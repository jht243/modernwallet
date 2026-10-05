"""Backend: pages are Python dict literals loaded into a registry (themetabolicjournal.com).

A page is either
  * a module  scripts/<prefix>_<slug>.py  holding  PAGE = {'path': ..., 'title': ..., ...}
    (a `_register_*_pages()` loader in generate_seo_pages.py imports it), or
  * an inline  _register(path="...", title=..., ...)  call in scripts/generate_seo_pages.py.
Both land in generate_seo_pages.PAGES keyed by URL path (no trailing slash). server.py's
_LANDING_SEO_OVERRIDES[path] {'title', 'description'} beats the page fields for <title>/meta.

site.json "py" block (all optional; defaults = metabolic_journal):
  registry        "scripts/generate_seo_pages.py"   file with the inline _register calls + PAGES
  registry_mod    "scripts.generate_seo_pages"      import name of the registry
  register_fn     "_register"
  module_glob     "scripts/*.py"                    files that may hold PAGE = {...}
  module_var      "PAGE"
  server          "server.py"                       file holding the SEO override dict
  overrides_var   "_LANDING_SEO_OVERRIDES"
  lint            "scripts/lib/content_lint.py"     run on edited modules (report only)
  python          sys.executable

Field model (both shapes): title (= <title> AND the H1), subtitle, summary, meta_description,
introText (HTML), sections [{'heading', 'content': '<p>…</p>\\n<p>…</p>'}], faqs [{'question',
'answer'}], reviewed_at 'YYYY-MM-DD'. Templates autoescape everything except introText and
section content, so only those two take HTML.

Every edit is surgical: the file is parsed with `ast`, and only the source span of the one literal
being changed (lineno/col_offset .. end_lineno/end_col_offset, UTF-8 byte columns converted to
characters) is rewritten. Nothing is ever pretty-printed or reformatted. Python's implicit string
concatenation ("a" "b" across lines) is handled by evaluating the whole Constant node and
rewriting that node's whole span with a new literal.

The registry's loaders do `except Exception: continue`, so a broken module SILENTLY drops its page
(404). validate() therefore imports the registry the way the server does and asserts every page
defined in an edited file is still in PAGES.
"""

from __future__ import annotations

import ast
import difflib
import html
import io
import json
import os
import py_compile
import re
import shutil
import subprocess
import sys
import tempfile
import tokenize
from pathlib import Path

from .base import Backend, Page, Result, Unsupported

PLAIN_TOP = ("title", "subtitle", "summary", "meta_description")
HTML_TOP = ("introText",)
_LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")
_BLOCK = re.compile(r"</?(p|br|li|ul|ol|div|h[1-6]|tr|td|th|table|thead|tbody|blockquote|section|dl|dt|dd)\b",
                    re.I)


# ── source positions ──────────────────────────────────────────────────────────────────────────
class _Pos:
    """Map ast (lineno, utf-8 byte col) to character offsets. Lines split on '\\n' only, exactly
    like the tokenizer (str.splitlines would also split on \\u2028 etc. inside string literals)."""

    def __init__(self, src: str):
        self.lines = src.split("\n")
        self.starts = [0]
        for ln in self.lines[:-1]:
            self.starts.append(self.starts[-1] + len(ln) + 1)

    def off(self, lineno: int, col: int) -> int:
        line = self.lines[lineno - 1]
        if line.isascii():
            return self.starts[lineno - 1] + col
        return self.starts[lineno - 1] + len(line.encode("utf-8")[:col].decode("utf-8"))

    def start(self, n) -> int:
        return self.off(n.lineno, n.col_offset)

    def end(self, n) -> int:
        return self.off(n.end_lineno, n.end_col_offset)

    def col(self, n) -> int:
        return self.start(n) - self.starts[n.lineno - 1]


# ── literal rendering ─────────────────────────────────────────────────────────────────────────
def _q(s: str, quote: str = "'") -> str:
    out = []
    for ch in s:
        o = ord(ch)
        if ch == "\\":
            out.append("\\\\")
        elif ch == quote:
            out.append("\\" + quote)
        elif ch == "\n":
            out.append("\\n")
        elif ch == "\r":
            out.append("\\r")
        elif ch == "\t":
            out.append("\\t")
        elif o < 32 or o == 127 or o == 0x85:
            out.append("\\x%02x" % o)
        elif ch in "  ":
            out.append("\\u%04x" % o)
        else:
            out.append(ch)
    return quote + "".join(out) + quote


def _render(v, col: int, quote: str) -> str:
    """Python source for a literal value, pprint-style, continuation lines indented to `col`.
    Strings with newlines become implicitly concatenated pieces (valid: always inside brackets)."""
    if isinstance(v, str):
        pieces = re.findall(r"[^\n]*\n|[^\n]+$", v)
        if len(pieces) <= 1:
            return _q(v, quote)
        return ("\n" + " " * col).join(_q(p, quote) for p in pieces)
    if isinstance(v, (list, tuple)):
        if not v:
            return "[]"
        return "[" + (",\n" + " " * (col + 1)).join(_render(x, col + 1, quote) for x in v) + "]"
    if isinstance(v, dict):
        if not v:
            return "{}"
        parts = []
        for k, x in v.items():
            kq = _q(str(k), quote)
            parts.append(kq + ": " + _render(x, col + 1 + len(kq) + 2, quote))
        return "{" + (",\n" + " " * (col + 1)).join(parts) + "}"
    return repr(v)


def _lit(v, col: int, quote: str) -> str:
    s = _render(v, col, quote)
    if ast.literal_eval(s if "\n" not in s else "(" + s + ")") != v:      # paranoia: never emit a lie
        raise ValueError("internal: rendered literal does not round-trip")
    return s


# ── markdown / html helpers ───────────────────────────────────────────────────────────────────
def _esc(s: str) -> str:
    s = html.escape(s, quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)


def _md_inline(t: str) -> str:
    out, pos = [], 0
    for m in _LINK.finditer(t):
        out.append(_esc(t[pos:m.start()]))
        out.append(f'<a href="{html.escape(m.group(2), quote=True)}">{_esc(m.group(1))}</a>')
        pos = m.end()
    out.append(_esc(t[pos:]))
    return "".join(out)


def _md_plain(t: str) -> str:
    return re.sub(r"\*\*(.+?)\*\*", r"\1", _LINK.sub(r"\1", t))


def _paras_html(paras) -> str:
    if isinstance(paras, str):
        paras = re.split(r"\n\s*\n", paras)
    blocks = []
    for p in paras:
        p = (p or "").strip()
        if not p:
            continue
        lines = [ln.strip() for ln in p.split("\n") if ln.strip()]
        if all(re.match(r"[-*]\s+", ln) for ln in lines):
            blocks.append("<ul>" + "".join(f"<li>{_md_inline(re.sub(r'^[-*]\s+', '', ln))}</li>"
                                           for ln in lines) + "</ul>")
        else:
            blocks.append(f"<p>{_md_inline(' '.join(lines))}</p>")
    return "\n".join(blocks)


def _plain(s: str) -> str:
    """HTML -> reading text (paragraphs separated by a blank line, list items as '- ')."""
    s = re.sub(r"(?i)<br\s*/?>", "\n", s or "")
    s = re.sub(r"(?i)<li\b[^>]*>", "\n- ", s)
    s = re.sub(r"(?i)</li>", "\n", s)
    s = re.sub(r"(?i)</(p|div|ul|ol|h[1-6]|table|blockquote|tr)>", "\n\n", s)
    s = re.sub(r"(?i)<(td|th)\b[^>]*>", " ", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    lines = [re.sub(r"[ \t ]+", " ", ln).strip() for ln in s.split("\n")]
    return re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip()


def _project(raw: str, is_html: bool):
    """Reader-visible projection of a field: (visible string, [(raw_start, raw_end)] per char).
    HTML tags vanish (block tags become '\\n'), entities decode, whitespace runs collapse."""
    vis: list[str] = []
    idx: list[list[int]] = []
    i, n = 0, len(raw)

    def push(ch, a, b):
        if ch.isspace() and ch != "\n":
            ch = " "
        if ch == " " and (not vis or vis[-1] in " \n"):
            if idx:
                idx[-1][1] = b
            return
        if ch == "\n" and vis and vis[-1] == " ":
            vis[-1] = "\n"
            idx[-1][1] = b
            return
        vis.append(ch)
        idx.append([a, b])

    while i < n:
        c = raw[i]
        if is_html and c == "<":
            j = raw.find(">", i)
            if j > 0:
                if _BLOCK.match(raw, i):
                    push("\n", i, j + 1)
                i = j + 1
                continue
        if is_html and c == "&":
            m = re.match(r"&(#\d+|#x[0-9a-fA-F]+|[A-Za-z]\w*);", raw[i:i + 12])
            if m:
                dec = html.unescape(m.group(0))
                if dec != m.group(0):
                    for ch in dec:
                        push(ch, i, i + m.end())
                    i += m.end()
                    continue
        push(c, i, i + 1)
        i += 1
    return "".join(vis), idx


def _slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")


def _same_heading(a: str, b: str) -> bool:
    a, b = (a or "").strip(), (b or "").strip()
    return a.lower() == b.lower() or (_slugify(a) and _slugify(a) == _slugify(b))


def norm_path(path: str) -> str:
    p = re.sub(r"^[a-z][a-z0-9+.-]*://[^/]+", "", (path or "").strip(), flags=re.I)
    p = p.split("#", 1)[0].split("?", 1)[0]
    p = "/" + p.strip("/")
    return p


# ── ast helpers ───────────────────────────────────────────────────────────────────────────────
def _fieldmap(node) -> dict:
    """name -> (key_or_keyword_node, value_node); the last duplicate wins, as at runtime."""
    out = {}
    if isinstance(node, ast.Dict):
        for k, v in zip(node.keys, node.values):
            if isinstance(k, ast.Constant) and isinstance(k.value, str):
                out[k.value] = (k, v)
    elif isinstance(node, ast.Call):
        for kw in node.keywords:
            if kw.arg:
                out[kw.arg] = (kw, kw.value)
    return out


def _try_eval(node):
    try:
        return True, ast.literal_eval(node)
    except Exception:  # noqa: BLE001 — a non-literal field (BinOp, Name, f-string) is just skipped
        return False, None


def _strnode(n) -> bool:
    return isinstance(n, ast.Constant) and isinstance(n.value, str)


class PyRegistry(Backend):
    def __init__(self, root, cfg):
        super().__init__(Path(root), cfg)
        c = cfg.get("py", {}) if isinstance(cfg, dict) else {}
        self.registry = c.get("registry", "scripts/generate_seo_pages.py")
        self.registry_mod = c.get("registry_mod", "scripts.generate_seo_pages")
        self.register_fn = c.get("register_fn", "_register")
        self.module_glob = c.get("module_glob", "scripts/*.py")
        self.module_var = c.get("module_var", "PAGE")
        self.server = c.get("server", "server.py")
        self.overrides_var = c.get("overrides_var", "_LANDING_SEO_OVERRIDES")
        self.lint = c.get("lint", "scripts/lib/content_lint.py")
        self.python = c.get("python", sys.executable)
        self._expect: dict[str, dict] = {}       # path -> what validate() must see in PAGES
        self._expect_ov: dict[str, dict] = {}    # path -> what validate() must see in the overrides

    # ── finding nodes ────────────────────────────────────────────────────────────────────────
    def _module_node(self, tree):
        for n in tree.body:
            if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == self.module_var
                                                 for t in n.targets) and isinstance(n.value, ast.Dict):
                return n.value
            if (isinstance(n, ast.AnnAssign) and isinstance(n.target, ast.Name)
                    and n.target.id == self.module_var and isinstance(n.value, ast.Dict)):
                return n.value
        return None

    def _inline_calls(self, tree) -> dict:
        out = {}
        for n in ast.walk(tree):
            if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == self.register_fn:
                p = _fieldmap(n).get("path")
                if p and _strnode(p[1]):
                    out[norm_path(p[1].value)] = n
        return out

    def _node_in(self, rel: str, src: str, path: str):
        """(tree, page node) for `path` in this file's source, or (tree, None)."""
        tree = ast.parse(src)
        if rel == self.registry:
            return tree, self._inline_calls(tree).get(path)
        node = self._module_node(tree)
        if node is not None:
            p = _fieldmap(node).get("path")
            if p and _strnode(p[1]) and norm_path(p[1].value) == path:
                return tree, node
        return tree, None

    def _module_files(self) -> list[Path]:
        reg = (self.root / self.registry).resolve()
        return [f for f in sorted(self.root.glob(self.module_glob)) if f.resolve() != reg]

    def _candidates(self, path: str) -> list[tuple[str, str]]:
        needles = (f"'{path}'", f'"{path}"')
        out = []
        for f in self._module_files():
            try:
                src = f.read_text()
            except (OSError, UnicodeDecodeError):
                continue
            if not any(nd in src for nd in needles):
                continue
            try:
                if self._node_in(str(f.relative_to(self.root)), src, path)[1] is not None:
                    out.append((str(f.relative_to(self.root)), "module"))
            except SyntaxError:
                continue
        reg = self.root / self.registry
        if reg.exists():
            src = reg.read_text()
            if any(nd in src for nd in needles) and self._node_in(self.registry, src, path)[1] is not None:
                out.append((self.registry, "inline"))
        return out

    def _effective(self, path: str, cands: list[tuple[str, str]]) -> tuple[str, str]:
        """Several sources register this path: the served one is whichever PAGES ended up holding."""
        code = (f"import json,sys\nimport {self.registry_mod} as g\np=g.PAGES.get({path!r})\n"
                "print(json.dumps(None if p is None else {'title': p.title, "
                "'h': [s.get('heading') for s in p.sections]}))")
        live = None
        try:
            r = self._run([self.python, "-c", code], self.root)
            live = json.loads(r.stdout.strip().splitlines()[-1]) if r.returncode == 0 else None
        except Exception:  # noqa: BLE001
            live = None
        if live:
            for rel, kind in cands:
                d = self._values_of(self._node_in(rel, (self.root / rel).read_text(), path)[1])
                if d.get("title") == live["title"] and [s.get("heading") for s in d.get("sections", [])
                                                         if isinstance(s, dict)] == live["h"]:
                    return rel, kind
        return cands[0]

    def _overrides(self, src: str):
        tree = ast.parse(src)
        for n in tree.body:
            tgt = None
            if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == self.overrides_var
                                                 for t in n.targets):
                tgt = n.value
            elif isinstance(n, ast.AnnAssign) and isinstance(n.target, ast.Name) and n.target.id == self.overrides_var:
                tgt = n.value
            if isinstance(tgt, ast.Dict):
                return tgt
        return None

    def _ov_entry(self, src: str, path: str):
        """(overrides dict node, key node, value node) — key/value None when no entry exists."""
        d = self._overrides(src)
        if d is None:
            return None, None, None
        hit = (None, None)
        for k, v in zip(d.keys, d.values):
            if _strnode(k) and norm_path(k.value) == path:
                hit = (k, v)
        return d, hit[0], hit[1]

    def _server_src(self) -> str | None:
        f = self.root / self.server
        return f.read_text() if f.exists() else None

    # ── locating ─────────────────────────────────────────────────────────────────────────────
    def locate(self, path: str) -> Page | None:
        path = norm_path(path)
        cands = self._candidates(path)
        if not cands:
            return None
        rel, kind = cands[0] if len(cands) == 1 else self._effective(path, cands)
        src = (self.root / rel).read_text()
        node = self._node_in(rel, src, path)[1]
        d = self._values_of(node)
        native = ast.get_source_segment(src, node) or ""
        files = [rel]
        extra = {"file": rel, "source": kind, "override": False}
        ssrc = self._server_src()
        if ssrc is not None:
            _, k, v = self._ov_entry(ssrc, path)
            if k is not None:
                files.append(self.server)
                ov_src = ssrc[_Pos(ssrc).start(k):_Pos(ssrc).end(v)]
                ok, ov = _try_eval(v)
                extra.update(override=True, override_native=ov_src,
                             seo_title=(ov or {}).get("title") if ok else None,
                             seo_description=(ov or {}).get("description") if ok else None)
                native += f"\n\n# {self.server} {self.overrides_var} entry (beats the page for <title>/meta):\n" + ov_src
        slug = path.rstrip("/").rsplit("/", 1)[-1]
        return Page(path=path, slug=slug, key=f"{rel}::{path}", files=files, title=d.get("title", ""),
                    kind=d.get("page_type", ""), native=native, extra=extra)

    def _file_of(self, page: Page) -> str:
        return page.extra.get("file") or page.files[0]

    def _values_of(self, node) -> dict:
        out = {}
        for name, (_, v) in _fieldmap(node).items():
            ok, val = _try_eval(v)
            if ok:
                out[name] = val
        return out

    def _values(self, page: Page) -> dict:
        rel = self._file_of(page)
        node = self._node_in(rel, (self.root / rel).read_text(), norm_path(page.path))[1]
        if node is None:
            raise ValueError(f"page {page.path} not found in {rel}")
        return self._values_of(node)

    # ── reading ──────────────────────────────────────────────────────────────────────────────
    def text(self, page: Page) -> str:
        d = self._values(page)
        out = [f"# {d.get('title', '')}"]
        for k in ("subtitle", "summary"):
            if isinstance(d.get(k), str) and d[k].strip():
                out.append(_plain(d[k]))
        if isinstance(d.get("introText"), str) and d["introText"].strip():
            out.append(_plain(d["introText"]))
        for s in d.get("sections") or []:
            if not isinstance(s, dict):
                continue
            if s.get("heading"):
                out.append(f"## {s['heading']}")
            if isinstance(s.get("content"), str):
                out.append(_plain(s["content"]))
        faqs = [f for f in d.get("faqs") or [] if isinstance(f, dict)]
        if faqs:
            out.append("## Frequently Asked Questions")
            for f in faqs:
                out.append(f"**Q: {f.get('question', '')}**\n{_plain(f.get('answer', ''))}")
        return "\n\n".join(x for x in out if x).strip() + "\n"

    def headings(self, page: Page) -> list[dict]:
        return [{"id": None, "heading": s.get("heading", "")}
                for s in self._values(page).get("sections") or [] if isinstance(s, dict)]

    def voice_sample(self, kind: str, exclude: set[str]) -> str | None:
        exclude = set(exclude or ())

        def excluded(p: str) -> bool:
            p = norm_path(p)
            return p in exclude or p.rsplit("/", 1)[-1] in exclude

        def good(d: dict) -> bool:
            return (d.get("page_type") == kind and not excluded(d.get("path", ""))
                    and len([s for s in d.get("sections") or [] if isinstance(s, dict)]) >= 4)

        needles = (f"'page_type': '{kind}'", f'"page_type": "{kind}"', f"page_type='{kind}'",
                   f'page_type="{kind}"')
        for f in self._module_files():
            try:
                src = f.read_text()
            except (OSError, UnicodeDecodeError):
                continue
            if not any(nd in src for nd in needles):
                continue
            try:
                node = self._module_node(ast.parse(src))
            except SyntaxError:
                continue
            if node is not None and good(self._values_of(node)):
                return ast.get_source_segment(src, node)
        reg = self.root / self.registry
        if reg.exists():
            src = reg.read_text()
            for node in self._inline_calls(ast.parse(src)).values():
                if good(self._values_of(node)):
                    return ast.get_source_segment(src, node)
        return None

    # ── surgical edit primitives (each re-parses: ops see each other's results) ─────────────────
    @staticmethod
    def _splice(src: str, a: int, b: int, text: str) -> str:
        return src[:a] + text + src[b:]

    def _quote_of(self, src: str, node) -> str:
        P = _Pos(src)
        fm = _fieldmap(node)
        probe = None
        if isinstance(node, ast.Dict):
            probe = next((k for k in node.keys if k is not None), None)
        elif "path" in fm:
            probe = fm["path"][1]
        ch = src[P.start(probe)] if probe is not None else "'"
        return ch if ch in "'\"" else "'"

    def _set_value(self, src: str, node, name: str, value, quote: str | None = None) -> str:
        """Replace field `name`'s value literal, or insert the field after the last one."""
        P = _Pos(src)
        quote = quote or self._quote_of(src, node)
        fm = _fieldmap(node)
        if name in fm:
            v = fm[name][1]
            return self._splice(src, P.start(v), P.end(v), _lit(value, P.col(v), quote))
        if isinstance(node, ast.Dict):
            if not node.keys:
                a, b = P.start(node), P.end(node)
                kq = _q(name, quote)
                return self._splice(src, a, b, "{" + kq + ": " + _lit(value, P.col(node) + len(kq) + 3, quote) + "}")
            last = next((k for k in reversed(node.keys) if k is not None), node.values[-1])
            col = P.col(last)
            kq = _q(name, quote)
            text = ",\n" + " " * col + kq + ": " + _lit(value, col + len(kq) + 2, quote)
            at = P.end(node.values[-1])
            return self._splice(src, at, at, text)
        if isinstance(node, ast.Call):
            if not node.keywords:
                raise Unsupported(f"{self.register_fn}() call has no keyword arguments to extend")
            col = P.col(node.keywords[-1])
            text = ",\n" + " " * col + name + "=" + _lit(value, col + len(name) + 1, quote)
            at = P.end(node.keywords[-1].value)
            return self._splice(src, at, at, text)
        raise Unsupported("page node is neither a dict literal nor a register call")

    def _page(self, srcs: dict, rel: str, path: str):
        tree, node = self._node_in(rel, srcs[rel], path)
        if node is None:
            raise ValueError(f"page {path} not found in {rel}")
        return node

    def _sections(self, srcs, rel, path):
        node = self._page(srcs, rel, path)
        fm = _fieldmap(node)
        if "sections" not in fm or not isinstance(fm["sections"][1], ast.List):
            raise Unsupported("this page has no literal sections list (e.g. a tool/calculator page)")
        return node, fm["sections"][1]

    @staticmethod
    def _sec_heading(el) -> str | None:
        if isinstance(el, ast.Dict):
            h = _fieldmap(el).get("heading")
            if h and _strnode(h[1]):
                return h[1].value
        return None

    def _insert_section(self, srcs, rel, path, heading, content_html, before) -> str:
        node, lst = self._sections(srcs, rel, path)
        src = srcs[rel]
        P = _Pos(src)
        quote = self._quote_of(src, node)
        if any(_same_heading(self._sec_heading(el) or "", heading) for el in lst.elts):
            raise ValueError(f"section {heading!r} already exists")
        val = {"heading": heading, "content": content_html}
        if not lst.elts:
            col = P.col(lst) + 1
            return self._splice(src, P.start(lst), P.end(lst), "[" + _lit(val, col, quote) + "]")
        col = P.col(lst.elts[-1])
        target = None
        if before:
            target = next((el for el in lst.elts if _same_heading(self._sec_heading(el) or "", before)), None)
        if target is not None:
            at = P.start(target)
            return self._splice(src, at, at, _lit(val, P.col(target), quote) + ",\n" + " " * P.col(target))
        at = P.end(lst.elts[-1])
        return self._splice(src, at, at, ",\n" + " " * col + _lit(val, col, quote))

    def _replace_section(self, srcs, rel, path, heading, content_html, match) -> str:
        node, lst = self._sections(srcs, rel, path)
        src = srcs[rel]
        P = _Pos(src)
        quote = self._quote_of(src, node)
        hits = [el for el in lst.elts if _same_heading(self._sec_heading(el) or "", match)]
        if len(hits) != 1:
            raise ValueError(f"section {match!r} matched {len(hits)} sections (need exactly 1)")
        el = hits[0]
        if not _same_heading(heading, match) and any(
                _same_heading(self._sec_heading(e) or "", heading) for e in lst.elts if e is not el):
            raise ValueError(f"another section is already headed {heading!r}")
        new = {"heading": heading, "content": content_html}
        if isinstance(el, ast.Dict):        # keep any extra keys the section carries (e.g. 'id')
            ok, old = _try_eval(el)
            if ok and isinstance(old, dict):
                new = {**old, "heading": heading, "content": content_html}
        return self._splice(src, P.start(el), P.end(el), _lit(new, P.col(el), quote))

    def _text_nodes(self, node):
        """[(value node, is_html, label)] for every reader-visible string literal of the page."""
        out = []
        fm = _fieldmap(node)
        for k in PLAIN_TOP + HTML_TOP:
            if k in fm and _strnode(fm[k][1]):
                out.append((fm[k][1], k in HTML_TOP, k))
        for lk, parts in (("sections", (("heading", False), ("content", True))),
                          ("faqs", (("question", False), ("answer", None)))):
            if lk in fm and isinstance(fm[lk][1], ast.List):
                for i, el in enumerate(fm[lk][1].elts):
                    efm = _fieldmap(el) if isinstance(el, ast.Dict) else {}
                    for k, is_html in parts:
                        if k in efm and _strnode(efm[k][1]):
                            h = ("<" in efm[k][1].value) if is_html is None else is_html   # FAQ answers: HTML only if they carry tags
                            out.append((efm[k][1], h, f"{lk}[{i}].{k}"))
        return out

    def _replace(self, srcs, rel, path, old: str, new: str) -> tuple[str, str]:
        node = self._page(srcs, rel, path)
        src = srcs[rel]
        P = _Pos(src)
        quote = self._quote_of(src, node)
        want = " ".join(old.split())
        if not want:
            raise ValueError("replace: empty 'old'")
        hits = []
        for vnode, is_html, label in self._text_nodes(node):
            raw = vnode.value
            vis, idx = _project(raw, is_html)
            start = vis.find(want)
            while start >= 0:
                hits.append((vnode, is_html, label, raw, idx, start, start + len(want)))
                start = vis.find(want, start + 1)
        if not hits:                       # the planner quoted raw source (with tags/entities)
            for vnode, is_html, label in self._text_nodes(node):
                c = vnode.value.count(old)
                hits += [(vnode, is_html, label, vnode.value, None, vnode.value.find(old), None)] * c
        if len(hits) != 1:
            raise ValueError(f"replace 'old' must match exactly once in the page, matched {len(hits)}: {old[:80]!r}")
        vnode, is_html, label, raw, idx, a, b = hits[0]
        if idx is None:                    # raw-source match
            s, e = a, a + len(old)
            new_raw = new if (is_html and "<" in old) or not is_html else _md_inline(new)
        else:
            s, e = idx[a][0], idx[b - 1][1]
            if not is_html:
                new_raw = _md_plain(new)
            else:
                s, e = self._widen_to_tags(raw, s, e)
                new_raw = self._carry_markup(raw[s:e], new)
        src = self._splice_string(src, vnode, s, e, new_raw, quote)
        return src, f'{label}: "{old[:80]}" -> "{new[:80]}"'

    def _splice_string(self, src: str, vnode, s: int, e: int, new_raw: str, quote: str) -> str:
        """Replace raw[s:e] of string node `vnode` with new_raw. Only the implicitly-concatenated
        pieces ("…" "…") that overlap [s, e) are rewritten, so the diff stays as small as the edit;
        falls back to rewriting the whole node when the pieces cannot be mapped."""
        P = _Pos(src)
        a, b = P.start(vnode), P.end(vnode)
        raw = vnode.value
        seg = src[a:b]
        try:
            toks = [t for t in tokenize.generate_tokens(io.StringIO("(" + seg + ")").readline)
                    if t.type == tokenize.STRING]
            lines = ("(" + seg + ")").split("\n")
            starts = [0]
            for ln in lines[:-1]:
                starts.append(starts[-1] + len(ln) + 1)
            pieces = []
            for t in toks:
                ps = starts[t.start[0] - 1] + t.start[1] - 1
                pe = starts[t.end[0] - 1] + t.end[1] - 1
                pieces.append((ps, pe, ast.literal_eval(t.string), t.string))
            if not pieces or "".join(p[2] for p in pieces) != raw:
                raise ValueError("pieces do not rebuild the value")
        except (tokenize.TokenError, SyntaxError, ValueError, IndentationError):
            newval = raw[:s] + new_raw + raw[e:]
            return self._splice(src, a, b, _lit(newval, P.col(vnode), quote))
        bounds, pos = [], 0
        for ps, pe, v, tok in pieces:
            bounds.append((pos, pos + len(v)))
            pos += len(v)
        i = next((k for k, (lo, hi) in enumerate(bounds) if lo <= s < hi), len(pieces) - 1)
        j = i if e <= s else next((k for k, (lo, hi) in enumerate(bounds) if lo < e <= hi), len(pieces) - 1)
        text = pieces[i][2][:s - bounds[i][0]] + new_raw + pieces[j][2][e - bounds[j][0]:]
        q = pieces[i][3][0] if pieces[i][3][:1] in ("'", '"') else quote
        before = seg[:pieces[i][0]]
        col = len(before) - before.rfind("\n") - 1 if "\n" in before else P.col(vnode) + len(before)
        rendered = _lit(text, col, q) if text else q + q
        tq = pieces[i][3][:3]
        if i == j and tq in ('"""', "'''") and tq not in text and "\\" not in text and "\r" not in text \
                and not text.endswith(tq[0]) and ast.literal_eval(tq + text + tq) == text:
            rendered = tq + text + tq                    # keep a triple-quoted block triple-quoted
        return self._splice(src, a + pieces[i][0], a + pieces[j][1], rendered)

    @staticmethod
    def _widen_to_tags(raw: str, s: int, e: int) -> tuple[int, int]:
        """If the matched text starts/ends exactly inside an inline element (<a>text</a>), take the
        whole element so its markup is carried, not cut in half."""
        for _ in range(4):
            piece = raw[s:e]
            opens = [m.group(1).lower() for m in re.finditer(r"<([a-zA-Z]\w*)\b[^>]*>", piece)
                     if not _BLOCK.match(m.group(0))]
            closes = [m.group(1).lower() for m in re.finditer(r"</([a-zA-Z]\w*)>", piece)
                      if not _BLOCK.match(m.group(0))]
            changed = False
            for t in set(closes):
                if closes.count(t) > opens.count(t):
                    m = re.search(r"<(" + t + r")\b[^>]*>$", raw[:s], re.I)
                    if m:
                        s, changed = m.start(), True
            for t in set(opens):
                if opens.count(t) > closes.count(t):
                    m = re.match(r"</" + t + r">", raw[e:], re.I)
                    if m:
                        e, changed = e + m.end(), True
            if not changed:
                break
        return s, e

    @staticmethod
    def _carry_markup(piece: str, new: str) -> str:
        """HTML for `new`, re-wrapping every inline element of the replaced text (links, <strong>…)
        around the same anchor text in `new`; refuses rather than silently dropping a link."""
        if re.search(r"</?[a-zA-Z][^>]*>", new):          # planner supplied HTML itself
            return new
        out = _md_inline(new)
        tags = re.findall(r"<[^>]+>", piece)
        if not tags:
            return out
        pairs = list(re.finditer(r"<([a-zA-Z]\w*)\b[^>]*>([^<]*)</\1>", piece))
        paired = sum(len(re.findall(r"<[^>]+>", m.group(0))) for m in pairs)
        if paired != len([t for t in tags if not _BLOCK.match(t)]) or any(_BLOCK.match(t) for t in tags):
            raise ValueError("replace 'old' spans block or nested markup; quote a sentence inside one paragraph")
        holders = {}
        for i, m in enumerate(pairs):
            inner_new = _esc(" ".join(html.unescape(m.group(2)).split()))
            if out.count(inner_new) != 1:
                raise ValueError(f"replace would drop inline markup around {html.unescape(m.group(2))!r}: "
                                 "keep that anchor text exactly once in 'new' (or use [text](/url))")
            h = f"\x00{i}\x00"
            out = out.replace(inner_new, h, 1)
            holders[h] = m.group(0)
        for h, markup in holders.items():
            out = out.replace(h, markup)
        return out

    # ── meta (title/description) ─────────────────────────────────────────────────────────────
    def _meta(self, srcs, orig, rel, path, op, notes):
        title, desc = op.get("title"), op.get("description")
        ssrc = self._get(srcs, orig, self.server) if (title or desc) else None
        ovd, k, v = self._ov_entry(ssrc, path) if ssrc is not None else (None, None, None)
        has_ov = k is not None and isinstance(v, ast.Dict)
        ovf = _fieldmap(v) if has_ov else {}
        if title:
            if has_ov:
                srcs[self.server] = self._set_value(ssrc, v, "title", title, '"')
                notes.append(f"{self.server} {self.overrides_var}[{path}].title -> {title[:80]}")
            elif ovd is not None and ovd.keys:
                P = _Pos(ssrc)
                col = P.col(next(x for x in reversed(ovd.keys) if x is not None))
                pq = _q(path, '"')
                text = ",\n" + " " * col + pq + ": " + _lit({"title": title}, col + len(pq) + 2, '"')
                at = P.end(ovd.values[-1])
                srcs[self.server] = self._splice(ssrc, at, at, text)
                notes.append(f"{self.server} {self.overrides_var}[{path}] added, title -> {title[:80]} "
                             "(page 'title' left alone: it is also the H1)")
            else:
                notes.append(f"skipped title: no {self.overrides_var} dict in {self.server} and the page "
                             "'title' is also the H1")
            ssrc = srcs.get(self.server)
            ovd, k, v = self._ov_entry(ssrc, path) if ssrc is not None else (None, None, None)
            has_ov = k is not None and isinstance(v, ast.Dict)
            ovf = _fieldmap(v) if has_ov else {}
        if desc:
            if has_ov and "description" in ovf:
                srcs[self.server] = self._set_value(ssrc, v, "description", desc, '"')
                notes.append(f"{self.server} {self.overrides_var}[{path}].description -> {desc[:80]}")
            else:
                node = self._page(srcs, rel, path)
                srcs[rel] = self._set_value(srcs[rel], node, "meta_description", desc)
                notes.append(f"meta_description -> {desc[:80]}")
        s_now = srcs.get(self.server)
        if s_now is not None and s_now != orig.get(self.server):
            _, k2, v2 = self._ov_entry(s_now, path)
            ok, val = _try_eval(v2) if v2 is not None else (False, None)
            if ok:
                self._expect_ov[path] = val

    # ── rewrite (L5) ─────────────────────────────────────────────────────────────────────────
    _ALIASES = {"metaDescription": "meta_description", "description": "meta_description", "h1": "title",
                "intro": "introText", "faq": "faqs", "updatedDate": None, "reviewed_at": None,
                "publishedDate": None, "slug": None, "path": None}

    def _rewrite(self, srcs, orig, rel, path, fields: dict, notes):
        applied = []
        meta_title = fields.get("metaTitle")
        for key, val in fields.items():
            name = self._ALIASES.get(key, key)
            if key == "metaTitle" or name is None:
                continue
            if name in PLAIN_TOP and isinstance(val, str):
                v = _md_plain(val)
            elif name == "introText" and isinstance(val, (str, list)):
                v = val if isinstance(val, str) and val.lstrip().startswith("<") else _paras_html(val)
            elif name == "sections" and isinstance(val, list):
                v = []
                for s in val:
                    body = s.get("content", s.get("body", s.get("paragraphs", "")))
                    if isinstance(body, str) and body.lstrip().startswith("<"):
                        html_body = body
                    else:
                        html_body = _paras_html(body)
                    v.append({"heading": s.get("heading", ""), "content": html_body})
            elif name == "faqs" and isinstance(val, list):
                v = [{"question": _md_plain(f.get("question", f.get("q", ""))),
                      "answer": _md_plain(f.get("answer", f.get("a", "")))} for f in val]
            elif name == "keywords" and isinstance(val, list) and all(isinstance(x, str) for x in val):
                v = val
            else:
                notes.append(f"skipped rewrite key {key}: no matching page field")
                continue
            node = self._page(srcs, rel, path)
            srcs[rel] = self._set_value(srcs[rel], node, name, v)
            applied.append(name)
        if meta_title:
            self._meta(srcs, orig, rel, path, {"op": "meta", "title": meta_title}, notes)
            applied.append("seo title")
        if not applied:
            raise Unsupported("rewrite: none of the draft's keys map to this page's fields")
        notes.append("rewrote keys: " + ", ".join(sorted(applied)))

    # ── apply ────────────────────────────────────────────────────────────────────────────────
    def _get(self, srcs: dict, orig: dict, rel: str) -> str:
        if rel not in srcs:
            f = self.root / rel
            srcs[rel] = f.read_text() if f.exists() else None
            orig[rel] = srcs[rel]
        return srcs[rel]

    def _run_ops(self, page: Page, ops: list[dict], today: str):
        rel = self._file_of(page)
        path = norm_path(page.path)
        srcs, orig, notes = {}, {}, []
        self._get(srcs, orig, rel)
        self._expect, self._expect_ov = {}, {}
        for op in ops:
            kind = op.get("op")
            if kind == "meta":
                self._meta(srcs, orig, rel, path, op, notes)
            elif kind == "insert_section":
                srcs[rel] = self._insert_section(srcs, rel, path, op["heading"], _paras_html(op["paragraphs"]),
                                                 op.get("before"))
                notes.append(f"added section: {op['heading']}")
            elif kind == "replace_section":
                srcs[rel] = self._replace_section(srcs, rel, path, op["heading"], _paras_html(op["paragraphs"]),
                                                  op["match"])
                notes.append(f"replaced section: {op['match']} -> {op['heading']}")
            elif kind == "replace":
                srcs[rel], note = self._replace(srcs, rel, path, op["old"], op["new"])
                notes.append(note)
            elif kind == "rewrite":
                self._rewrite(srcs, orig, rel, path, op["fields"], notes)
            else:
                raise ValueError(f"unknown op {kind}")
        node = self._page(srcs, rel, path)
        srcs[rel] = self._set_value(srcs[rel], node, "reviewed_at", today)
        notes.append(f"reviewed_at -> {today}")
        d = self._values_of(self._page(srcs, rel, path))
        self._expect[path] = {"reviewed_at": today,
                              "headings": [s.get("heading") for s in d.get("sections") or [] if isinstance(s, dict)]}
        changed = [f for f in srcs if srcs[f] is not None and srcs[f] != orig[f]]
        return srcs, orig, changed, notes

    def apply(self, page: Page, ops: list[dict], today: str, dry_run: bool = False,
              preview: Path | None = None) -> Result:
        srcs, orig, changed, notes = self._run_ops(page, ops, today)
        if dry_run:
            td = self._overlay({f: srcs[f] for f in changed})
            try:
                ok, msg = self._validate(changed, td)
            finally:
                shutil.rmtree(td, ignore_errors=True)
            if preview is not None:
                Path(preview).write_text(self._diff(orig, srcs, changed))
            return Result(ok, msg, changed if ok else [], notes)
        return self._commit(orig, srcs, changed, notes)

    def _commit(self, orig, srcs, changed, notes) -> Result:
        for f in changed:
            (self.root / f).write_text(srcs[f])
        try:
            ok, msg = self.validate(changed)
        except Exception as e:  # noqa: BLE001
            ok, msg = False, f"validator crashed: {e}"
        if not ok:
            for f in changed:                                   # roll back this page only
                (self.root / f).write_text(orig[f])
        return Result(ok, msg, changed if ok else [], notes)

    @staticmethod
    def _diff(orig, srcs, changed) -> str:
        out = []
        for f in changed:
            out += difflib.unified_diff(orig[f].splitlines(), srcs[f].splitlines(), f"a/{f}", f"b/{f}",
                                        n=1, lineterm="")
        return "\n".join(out) + "\n"

    # ── restore ──────────────────────────────────────────────────────────────────────────────
    def _git_show(self, sha: str, rel: str) -> str | None:
        r = subprocess.run(["git", "show", f"{sha}:{rel}"], cwd=self.root, capture_output=True)
        return r.stdout.decode("utf-8") if r.returncode == 0 else None

    def restore(self, page: Page, base_sha: str, today: str) -> Result:
        rel = self._file_of(page)
        path = norm_path(page.path)
        base = self._git_show(base_sha, rel)
        if base is None:
            return Result(False, f"{rel} does not exist at {base_sha}")
        bnode = self._node_in(rel, base, path)[1]
        if bnode is None:
            return Result(False, f"page {path} missing from {rel} at {base_sha}")
        srcs, orig = {}, {}
        cur = self._get(srcs, orig, rel)
        cnode = self._node_in(rel, cur, path)[1]
        if cnode is None:
            return Result(False, f"page {path} no longer in {rel}; restore by hand")
        BP, CP = _Pos(base), _Pos(cur)
        srcs[rel] = self._splice(cur, CP.start(cnode), CP.end(cnode), base[BP.start(bnode):BP.end(bnode)])
        notes = [f"{rel}: {path} restored to {base_sha}"]
        # the SEO override entry, if either side has one
        cs = self._get(srcs, orig, self.server)
        bs = self._git_show(base_sha, self.server)
        if cs is not None:
            _, ck, cv = self._ov_entry(cs, path)
            bd, bk, bv = self._ov_entry(bs, path) if bs is not None else (None, None, None)
            P = _Pos(cs)
            if ck is not None and bk is not None:
                BS = _Pos(bs)
                srcs[self.server] = self._splice(cs, P.start(ck), P.end(cv), bs[BS.start(bk):BS.end(bv)])
            elif ck is not None:                     # entry added during the run: remove it
                d = self._overrides(cs)
                i = next(j for j, k in enumerate(d.keys) if k is not None and P.start(k) == P.start(ck))
                if i > 0:
                    a, b = P.end(d.values[i - 1]), P.end(cv)
                elif len(d.keys) > 1:
                    a, b = P.start(ck), P.start(d.keys[1])
                else:
                    a, b = P.start(ck), P.end(cv)
                srcs[self.server] = self._splice(cs, a, b, "")
            elif bk is not None:                     # entry deleted during the run: put it back
                d = self._overrides(cs)
                BS = _Pos(bs)
                entry = bs[BS.start(bk):BS.end(bv)]
                if d is None or not d.keys:
                    return Result(False, f"{self.overrides_var} missing in {self.server}; restore by hand")
                col = P.col(next(k for k in reversed(d.keys) if k is not None))
                at = P.end(d.values[-1])
                srcs[self.server] = self._splice(cs, at, at, ",\n" + " " * col + entry)
            if srcs[self.server] != orig[self.server]:
                notes.append(f"{self.server}: {self.overrides_var}[{path}] restored to {base_sha}")
                if bv is not None:
                    ok, val = _try_eval(bv)
                    self._expect_ov = {path: val} if ok else {}
                else:
                    self._expect_ov = {path: None}
        d = self._values_of(bnode)
        self._expect = {path: {"headings": [s.get("heading") for s in d.get("sections") or []
                                            if isinstance(s, dict)]}}
        changed = [f for f in srcs if srcs[f] is not None and srcs[f] != orig[f]]
        if not changed:
            return Result(True, "already identical to base", [], notes)
        return self._commit(orig, srcs, changed, notes)

    # ── validation ───────────────────────────────────────────────────────────────────────────
    def _run(self, cmd, cwd: Path, timeout: int = 300):
        env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
        env.pop("PYTHONPATH", None)
        return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, env=env, timeout=timeout)

    def _overlay(self, new_srcs: dict[str, str]) -> Path:
        """A temp tree that IS the repo (symlinks) except the edited files, which are real copies
        holding the new source — so the registry can be imported without touching the repo."""
        td = Path(tempfile.mkdtemp(prefix="py-registry-"))
        tree: dict = {}
        for rel in new_srcs:
            node = tree
            for part in Path(rel).parts:
                node = node.setdefault(part, {})

        def build(real: Path, dst: Path, spec: dict):
            dst.mkdir(parents=True, exist_ok=True)
            for child in real.iterdir():
                if child.name in spec:
                    continue
                os.symlink(child, dst / child.name)
            for name, sub in spec.items():
                if sub and (real / name).is_dir():
                    build(real / name, dst / name, sub)

        build(self.root, td, tree)
        for rel, src in new_srcs.items():
            (td / rel).parent.mkdir(parents=True, exist_ok=True)
            (td / rel).write_text(src)
        return td

    def _paths_defined(self, root: Path, rel: str) -> list[str]:
        f = root / rel
        if not f.exists() or rel == self.server:
            return []
        try:
            tree = ast.parse(f.read_text())
        except SyntaxError:
            return []
        if rel == self.registry:
            return [norm_path(p) for p in self._inline_calls(tree)]
        node = self._module_node(tree)
        if node is not None:
            p = _fieldmap(node).get("path")
            if p and _strnode(p[1]):
                return [norm_path(p[1].value)]
        return []

    def validate(self, files: list[str]) -> tuple[bool, str]:
        return self._validate(files, self.root)

    def _validate(self, files: list[str], root: Path) -> tuple[bool, str]:
        msgs, ok = [], True
        with tempfile.TemporaryDirectory() as td:
            for i, rel in enumerate(files):
                if not rel.endswith(".py"):
                    continue
                try:
                    py_compile.compile(str(root / rel), cfile=str(Path(td) / f"{i}.pyc"), doraise=True)
                except py_compile.PyCompileError as e:
                    return False, f"py_compile {rel}: {str(e.msg)[-300:]}"
        expect = {p: {} for f in files for p in self._paths_defined(root, f)}
        for p, e in self._expect.items():
            expect[p] = e
        if expect:
            code = (
                "import json,sys\n"
                f"import {self.registry_mod} as g\n"
                "exp=json.load(sys.stdin); P=g.PAGES\n"
                "print(json.dumps({'n': len(P), 'missing': [p for p in exp if p not in P], 'got': {p: {"
                "'reviewed_at': P[p].reviewed_at, 'headings': [s.get('heading') for s in P[p].sections]} "
                "for p in exp if p in P and exp[p]}}))\n")
            env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
            env.pop("PYTHONPATH", None)
            r = subprocess.run([self.python, "-c", code], cwd=root, input=json.dumps(expect), capture_output=True,
                               text=True, env=env, timeout=300)
            if r.returncode:
                return False, f"registry import failed: {(r.stderr or r.stdout).strip()[-400:]}"
            res = json.loads(r.stdout.strip().splitlines()[-1])
            if res["missing"]:
                return False, (f"page(s) dropped from PAGES (a loader swallowed an exception?): "
                               f"{', '.join(res['missing'][:10])}")
            for p, e in expect.items():
                got = res["got"].get(p)
                if not e or got is None:
                    continue
                if "reviewed_at" in e and got["reviewed_at"] != e["reviewed_at"]:
                    ok = False
                    msgs.append(f"{p}: reviewed_at {got['reviewed_at']} != {e['reviewed_at']}")
                it = iter(got["headings"])
                if "headings" in e and not all(any(h == g for g in it) for h in e["headings"]):
                    ok = False
                    msgs.append(f"{p}: served sections do not contain the edited headings in order")
            msgs.insert(0, f"PAGES ok ({res['n']} pages; {len(expect)} checked)")
        if self.server in files:
            try:
                d = self._overrides((root / self.server).read_text())
                live = ast.literal_eval(d) if d is not None else {}
            except Exception as e:  # noqa: BLE001
                return False, f"{self.overrides_var} no longer a literal dict: {e}"
            for p, want in self._expect_ov.items():
                if live.get(p) != want:
                    ok = False
                    msgs.append(f"{self.overrides_var}[{p}] = {live.get(p)!r}, expected {want!r}")
            msgs.append(f"{self.overrides_var} ok ({len(live)} entries)")
        lint = root / self.lint
        if lint.exists():
            mods = [rel for rel in files if rel != self.registry and rel != self.server
                    and self._paths_defined(root, rel)]
            for rel in mods:
                mod = rel[:-3].replace("/", ".")
                r = self._run([self.python, str(self.lint), "--module", mod, "--json"], root)
                try:
                    found = json.loads(r.stdout).get(mod, [])
                    hard = sum(1 for x in found if x.get("hard"))
                    msgs.append(f"lint {mod}: {hard} hard / {len(found) - hard} advisory (report only)")
                except Exception:  # noqa: BLE001
                    msgs.append(f"lint {mod}: could not run ({(r.stderr or '').strip()[-120:]})")
        return ok, "; ".join(msgs)[:1500]


BACKEND = PyRegistry
