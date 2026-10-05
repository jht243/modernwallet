"""Backend: pages are Jinja templates + Python catalogs (mindmedicinelaw.com / psych_report).

A curated page is THREE things, all of which the engine may touch:
  1. a catalog entry  — a dataclass call in a Python catalog, e.g. `Therapy(slug="ayahuasca", …,
     last_reviewed="2026-10-05")` in src/seo/cluster_topology.py. It must be `status="published"`
     (when the class has a status) or the route falls through (guides → DB row, which we do NOT
     support: locate() returns None for it).
  2. a template       — templates/<dir>/<slug>.html.j2; the body is raw HTML (<h2>, <p>, tables)
     inside `<div class="therapy-body">`, the H1 + visible "Last reviewed" date come from a
     `therapy_header(therapy, "YYYY-MM-DD", …)` / `law_header(act, "YYYY-MM-DD")` macro call.
  3. (guides only) an overrides block in server.py `_curated_guide_overrides()`:
     `if slug == "<slug>": return {"seo_title": …, "seo_description": …, "faq_items": [{q, a}]}`.

The URL prefix picks the catalog (one slug can be a guide AND a retreat). site.json "jinja" block
(all optional; defaults = psych_report):
  server        "server.py"
  templates     "templates"
  overrides_fn  "_curated_guide_overrides"
  python        interpreter that can `import jinja2` (+ flask for the GET check); auto-detected
  http_check    true    Flask test-client GET of the edited page (skipped if the app can't import)
  kinds         {prefix: {catalog, cls, tpl, header, meta, sections}} merged over KINDS below

Dates: every apply bumps BOTH the catalog `last_reviewed` (JSON-LD + sitemap) AND the literal date
in the template's *_header(…, "YYYY-MM-DD") call (the visible byline). They can disagree before
the edit (e.g. /guides/ayahuasca); after it both read `today`.

Strings in Python may be implicitly concatenated ("…" "…"); every Python edit goes through `ast`
node spans + a literal scanner that maps each decoded character back to its source offset, so a
replacement touches only the characters that change.
"""

from __future__ import annotations

import ast
import difflib
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from html.parser import HTMLParser
from pathlib import Path

from .base import Backend, Page, Result, Unsupported

KINDS = {
    "guides": {"catalog": "src/seo/cluster_topology.py", "cls": "Therapy", "tpl": "guides",
               "header": "therapy_header", "meta": "overrides", "sections": True},
    "law": {"catalog": "src/seo/cluster_topology.py", "cls": "LegislativeAct", "tpl": "law",
            "header": "law_header", "meta": "catalog", "sections": True},
    "retreats": {"catalog": "src/seo/cluster_topology.py", "cls": "RetreatGuide", "tpl": "retreats",
                 "header": None, "meta": "catalog", "sections": True},
    "commentary": {"catalog": "src/seo/commentary_catalog.py", "cls": "CommentaryPost", "tpl": "commentary",
                   "header": None, "meta": "catalog_title", "sections": False},
}
# visible strings inside these {{ macro(...) }} calls are page text (key takeaways are |safe HTML)
LITERAL_CALLEES = {"key_takeaways", "therapy_header", "law_header", "retreat_header"}
# catalog string kwargs that render on the page itself (replace can target them)
VISIBLE_KWARGS = {"tagline"}
COMMENTARY_KWARGS = {"headline", "summary", "source_quote", "context", "evidence", "bottom_line",
                     "claim", "explanation", "q", "a"}
BLOCK_TAGS = {"div", "section", "aside", "details", "ul", "ol", "table", "nav", "figure", "blockquote",
              "form", "header", "footer", "article", "main"}
BREAK_TAGS = BLOCK_TAGS | {"p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "tr", "td", "th", "summary",
                           "br", "dl", "dt", "dd", "thead", "tbody", "hr", "caption"}
FOOTERISH = re.compile(r"^(faq|frequently asked|sources|references|citations|related|further reading|"
                       r"bottom line|sources and methodology)", re.I)
DATE = r"\d{4}-\d{2}-\d{2}"


# ======================================================================================
# small helpers
# ======================================================================================
def slugify(t: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", html.unescape(t).lower()).strip("-")


def _collapse(t: str) -> str:
    return re.sub(r"\s+", " ", t).strip()


def _fold(t: str) -> str:
    """length-preserving quote/dash folding used only as a fallback for matching"""
    return t.translate(str.maketrans({"\u2019": "'", "\u2018": "'", "\u201c": '"', "\u201d": '"',
                                      "\u00a0": " ", "\u2013": "-", "\u2014": "-"}))


def _line_start(s: str, i: int) -> int:
    return s.rfind("\n", 0, i) + 1


def _ws_before(s: str, i: int) -> bool:
    return s[_line_start(s, i):i].strip() == ""


def _indent_at(s: str, i: int) -> str:
    ls = _line_start(s, i)
    return re.match(r"[ \t]*", s[ls:]).group(0)


def _esc(t: str) -> str:
    """HTML-escape text for a template and stop Jinja from reading it as markup."""
    return re.sub(r"\{(?=[{%#])", "&#123;", html.escape(t, quote=False))


def md_inline(t: str) -> str:
    out, pos = [], 0
    for m in re.finditer(r"\[([^\]]+)\]\(([^)\s]+)\)", t):
        out.append(_esc(t[pos:m.start()]))
        out.append(f'<a href="{html.escape(m.group(2), quote=True)}">{_esc(m.group(1))}</a>')
        pos = m.end()
    out.append(_esc(t[pos:]))
    s = "".join(out)
    s = re.sub(r"\*\*(?=\S)(.+?)(?<=\S)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])\*(?=\S)([^*]+?)(?<=\S)\*(?![\w*])", r"<em>\1</em>", s)
    return s


def md_strip(t: str) -> str:
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r"\1", t)
    return re.sub(r"\*\*(.+?)\*\*", r"\1", t)


def _pylit(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def _wrapped_lit(s: str, indent: str, width: int = 72) -> str:
    """'"aaa " \n<indent>"bbb"' — the repo's implicit-concatenation style for long strings."""
    words = re.findall(r"\S+\s*", s)
    chunks, cur = [], ""
    for w in words:
        if cur and len(cur) + len(w) > width:
            chunks.append(cur)
            cur = ""
        cur += w
    if cur or not chunks:
        chunks.append(cur)
    return ("\n" + indent).join(_pylit(c) for c in chunks)


# ---- Python string literal scanner with source offsets ---------------------------------
_SIMPLE_ESC = {"\\": "\\", "'": "'", '"': '"', "n": "\n", "t": "\t", "r": "\r", "a": "\a", "b": "\b",
               "f": "\f", "v": "\v"}


def decode_literal(src: str, a: int, b: int, raw: bool):
    """Decode src[a:b] (a literal's body) -> [(char, start, end)] with absolute source offsets."""
    out, i = [], a
    while i < b:
        c = src[i]
        if c != "\\" or raw:
            out.append((c, i, i + 1))
            i += 1
            continue
        n = src[i + 1] if i + 1 < b else ""
        if n in _SIMPLE_ESC:
            out.append((_SIMPLE_ESC[n], i, i + 2))
            i += 2
        elif n == "\n":
            i += 2
        elif n in "xuU":
            k = {"x": 2, "u": 4, "U": 8}[n]
            hexs = src[i + 2:i + 2 + k]
            if len(hexs) == k and re.fullmatch(r"[0-9a-fA-F]+", hexs):
                out.append((chr(int(hexs, 16)), i, i + 2 + k))
                i += 2 + k
            else:
                out.append(("\\", i, i + 1))
                i += 1
        elif n == "N" and src[i + 2:i + 3] == "{":
            j = src.index("}", i)
            import unicodedata
            out.append((unicodedata.lookup(src[i + 3:j]), i, j + 1))
            i = j + 1
        elif n in "01234567":
            m = re.match(r"[0-7]{1,3}", src[i + 1:i + 4])
            out.append((chr(int(m.group(0), 8)), i, i + 1 + len(m.group(0))))
            i += 1 + len(m.group(0))
        else:
            out.append(("\\", i, i + 1))
            i += 1
    return out


def scan_literals(src: str, a: int, b: int):
    """String literals in src[a:b] (skipping comments/whitespace/other code) ->
    [{'start','end','body_start','body_end','quote','prefix'}]."""
    out, i = [], a
    lit = re.compile(r"""([rRuUbBfF]{0,2})('''|\"\"\"|'|")""")
    while i < b:
        c = src[i]
        if c == "#":
            j = src.find("\n", i)
            i = b if j < 0 else j
            continue
        m = lit.match(src, i)
        if m and (i == a or not (src[i - 1].isalnum() or src[i - 1] == "_")):
            q = m.group(2)
            j = m.end()
            raw = "r" in m.group(1).lower()
            while j < len(src):
                if src[j] == "\\" and not raw:
                    j += 2
                    continue
                if src[j] == "\\" and raw:
                    j += 2
                    continue
                if src.startswith(q, j):
                    break
                j += 1
            out.append({"start": i, "end": j + len(q), "body_start": m.end(), "body_end": j,
                        "quote": q, "prefix": m.group(1).lower()})
            i = j + len(q)
            continue
        i += 1
    return out


class _Offsets:
    """ast (lineno, utf-8 byte col) -> absolute str offset."""

    def __init__(self, src: str):
        self.src = src
        self.starts = [0]
        for m in re.finditer("\n", src):
            self.starts.append(m.end())

    def at(self, lineno: int, col: int) -> int:
        ls = self.starts[lineno - 1]
        line_end = self.src.find("\n", ls)
        line = self.src[ls:line_end if line_end >= 0 else len(self.src)]
        return ls + len(line.encode("utf-8")[:col].decode("utf-8", "ignore"))

    def span(self, node) -> tuple[int, int]:
        return self.at(node.lineno, node.col_offset), self.at(node.end_lineno, node.end_col_offset)

    def lines(self, node) -> tuple[int, int]:
        """whole-line span of a statement: start of its first line .. after its last newline"""
        a = self.starts[node.lineno - 1]
        b = self.starts[node.end_lineno] if node.end_lineno < len(self.starts) else len(self.src)
        return a, b


# ======================================================================================
# Jinja template structure
# ======================================================================================
def _jinja_end(s: str, i: int) -> int | None:
    """If s[i:] opens a Jinja construct, return its end offset."""
    two = s[i:i + 2]
    if two == "{#":
        j = s.find("#}", i + 2)
        return len(s) if j < 0 else j + 2
    if two == "{%":
        j = s.find("%}", i + 2)
        return len(s) if j < 0 else j + 2
    if two == "{{":
        j, depth, q = i + 2, 0, None
        while j < len(s):
            c = s[j]
            if q:
                if c == "\\":
                    j += 2
                    continue
                if c == q:
                    q = None
            elif c in "'\"":
                q = c
            elif c in "([{":
                depth += 1
            elif c in ")]}":
                if depth == 0 and s.startswith("}}", j):
                    return j + 2
                depth -= 1
            j += 1
        return len(s)
    return None


def jinja_ranges(s: str) -> list[tuple[int, int, str]]:
    out, i = [], 0
    while True:
        j = s.find("{", i)
        if j < 0:
            return out
        e = _jinja_end(s, j)
        if e is None:
            i = j + 1
            continue
        out.append((j, e, s[j:j + 2]))
        i = e


def _in_ranges(i: int, rs) -> bool:
    return any(a <= i < b for a, b, _ in rs)


def h2_list(tpl: str, jr=None) -> list[dict]:
    jr = jinja_ranges(tpl) if jr is None else jr
    out = []
    for m in re.finditer(r"<h2\b([^>]*)>(.*?)</h2>", tpl, re.S):
        if _in_ranges(m.start(), jr):
            continue
        idm = re.search(r"""\bid\s*=\s*["']([^"']+)["']""", m.group(1))
        inner = m.group(2)
        txt = re.sub(r"\{[{%#].*?[}%#]\}", "", inner, flags=re.S)
        txt = _collapse(html.unescape(re.sub(r"<[^>]+>", "", txt)))
        out.append({"start": m.start(), "end": m.end(), "id": idm.group(1) if idm else None,
                    "heading": txt, "inner_start": m.start(2), "inner_end": m.end(2)})
    return out


def body_span(tpl: str, jr=None):
    """(open_start, open_end, close_start) of <div class="therapy-body">, or None."""
    m = re.search(r"""<div\b[^>]*class\s*=\s*["'][^"']*\btherapy-body\b[^"']*["'][^>]*>""", tpl)
    if not m:
        return None
    jr = jinja_ranges(tpl) if jr is None else jr
    depth = 0
    for t in re.finditer(r"<(/?)div\b[^>]*>", tpl[m.end():]):
        pos = m.end() + t.start()
        if _in_ranges(pos, jr):
            continue
        if t.group(1):
            if depth == 0:
                return m.start(), m.end(), pos
            depth -= 1
        elif not t.group(0).endswith("/>"):
            depth += 1
    return None


_TAG = re.compile(r"<(/?)([a-zA-Z][\w-]*)\b[^>]*?(/?)>", re.S)
_JSTMT = re.compile(r"\{%-?\s*(\w+)")


def section_end(tpl: str, start: int, limit: int) -> int:
    """Offset where the section that starts at `start` (after its <h2>) ends: the next <h2> at the
    same nesting depth, the close of the enclosing container, or the end of an enclosing Jinja block."""
    depth = jdepth = 0
    i = start
    while i < limit:
        c = tpl[i]
        if c == "{":
            e = _jinja_end(tpl, i)
            if e is not None:
                if tpl[i:i + 2] == "{%":
                    kw = (_JSTMT.match(tpl, i) or [None, ""])[1]
                    if kw in ("if", "for", "block", "macro", "call", "filter", "with", "set") and \
                            not (kw == "set" and "=" in tpl[i:e]):
                        jdepth += 1
                    elif kw.startswith("end"):
                        if jdepth == 0:
                            return i
                        jdepth -= 1
                    elif kw in ("else", "elif") and jdepth == 0:
                        return i
                i = e
                continue
        if c == "<":
            m = _TAG.match(tpl, i)
            if m:
                name = m.group(2).lower()
                if name in ("script", "style") and not m.group(1):
                    j = tpl.find(f"</{name}", m.end())
                    i = limit if j < 0 else j
                    continue
                if name == "h2" and not m.group(1) and depth == 0 and jdepth == 0:
                    return i
                if name in BLOCK_TAGS:
                    if m.group(1):
                        if depth == 0:
                            return i
                        depth -= 1
                    elif not m.group(3):
                        depth += 1
                i = m.end()
                continue
        i += 1
    return limit


def wrap_start(tpl: str, i: int, floor: int) -> tuple[int, bool]:
    """Move an <h2> start up over an enclosing wrapper opened right before it (<section class=faq…>,
    <div class=faq-lite>) and over `{% if/for %}` guards, so an insert lands OUTSIDE them."""
    wrapped = False
    while True:
        pre = tpl[floor:i].rstrip()
        m = re.search(r"<(section|div|aside|details)\b[^>]*>$", pre)
        if m and "therapy-body" not in m.group(0):
            i, wrapped = floor + m.start(), True
            continue
        m = re.search(r"\{%-?\s*(if|for)\b[^%]*-?%\}$", pre)
        if m:
            i = floor + m.start()
            continue
        return i, wrapped


# ---- visible text with source offsets (for `replace`) ----------------------------------
class Vis:
    """A run of reader-visible characters, each mapped to its source span + region."""

    def __init__(self, rel: str, html_mode: bool):
        self.rel, self.html = rel, html_mode
        self.ch, self.s, self.e, self.reg, self.virt = [], [], [], [], []
        self.regions = {}

    def add(self, c, s, e, reg, virt=False):
        self.ch.append(c), self.s.append(s), self.e.append(e), self.reg.append(reg), self.virt.append(virt)

    @property
    def text(self):
        return "".join(self.ch)


def _html_stage(raw, out: Vis):
    """raw = [(char, s, e, region)] -> visible chars (tags dropped, entities decoded)."""
    n, k = len(raw), 0
    while k < n:
        c, s, e, reg = raw[k]
        if c == "<" and k + 1 < n and (raw[k + 1][0].isalpha() or raw[k + 1][0] in "/!"):
            j = k
            while j < n and raw[j][0] != ">" and raw[j][3] == reg:
                j += 1
            tag = "".join(x[0] for x in raw[k:j + 1])
            m = re.match(r"</?\s*([a-zA-Z][\w-]*)", tag)
            name = m.group(1).lower() if m else ""
            if name in ("script", "style") and not tag.startswith("</"):
                close = f"</{name}"
                jj = j
                while jj < n and "".join(x[0] for x in raw[jj:jj + len(close)]).lower() != close:
                    jj += 1
                while jj < n and raw[jj][0] != ">":
                    jj += 1
                k = jj + 1
                continue
            if name in BREAK_TAGS:
                out.add("\n", s, raw[min(j, n - 1)][2], reg, virt=True)
            k = j + 1
            continue
        if c == "&":
            tail = "".join(x[0] for x in raw[k:k + 40])
            m = re.match(r"&(#\d+|#[xX][0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);", tail)
            if m and all(raw[k + t][3] == reg for t in range(len(m.group(0)))):
                dec = html.unescape(m.group(0))
                if dec != m.group(0):
                    for d in dec:
                        out.add(d, s, raw[k + len(m.group(0)) - 1][2], reg)
                    k += len(m.group(0))
                    continue
        out.add(c, s, e, reg, virt=(reg == -1))
        k += 1


def template_visible(rel: str, tpl: str) -> Vis:
    v = Vis(rel, True)
    v.regions[0] = {"kind": "html"}
    v.regions[-1] = {"kind": "sep"}
    raw, i, rid = [], 0, 0
    m = re.search(r"\{%-?\s*block\s+content\s*-?%\}", tpl)
    i = m.end() if m else 0
    while i < len(tpl):
        if tpl[i] == "{":
            e = _jinja_end(tpl, i)
            if e is not None:
                if tpl[i:i + 2] == "{{":
                    cm = re.match(r"\{\{-?\s*(\w+)\s*\(", tpl[i:e])
                    if cm and cm.group(1) in LITERAL_CALLEES:
                        for lit in scan_literals(tpl, i + cm.end(), e - 2):
                            if lit["prefix"] or re.fullmatch(DATE, tpl[lit["body_start"]:lit["body_end"]]):
                                continue
                            rid += 1
                            v.regions[rid] = {"kind": "jlit", "quote": lit["quote"]}
                            raw.append(("\n", lit["start"], lit["start"], -1))
                            raw += [(c, s, ee, rid) for c, s, ee in
                                    decode_literal(tpl, lit["body_start"], lit["body_end"], False)]
                i = e
                continue
        raw.append((tpl[i], i, i + 1, 0))
        i += 1
    _html_stage(raw, v)
    return v


def python_visible(rel: str, src: str, node_spans: list[tuple[int, int, str]]) -> list[Vis]:
    """One Vis per Python string expression (implicit concatenation = one Vis, several regions)."""
    out = []
    for a, b, expect in node_spans:
        v = Vis(rel, False)
        lits = scan_literals(src, a, b)
        if not lits or any(lt["prefix"] not in ("", "u") for lt in lits):
            continue
        for n, lt in enumerate(lits):
            v.regions[n] = {"kind": "py", "quote": lt["quote"]}
            for c, s, e in decode_literal(src, lt["body_start"], lt["body_end"], False):
                v.add(c, s, e, n)
        if v.text == expect:              # sanity: our decode == Python's value
            out.append(v)
    return out


def _find(v: Vis, old: str, fold: bool) -> list[tuple[int, int]]:
    hay = _fold(v.text) if fold else v.text
    toks = (_fold(old) if fold else old).split()
    if not toks:
        return []
    pat = re.compile(r"\s+".join(re.escape(t) for t in toks))
    return [(m.start(), m.end()) for m in pat.finditer(hay)]


def _norm_map(t: str):
    """collapse whitespace runs; returns (normalised str, [(first_idx, last_idx)] per norm char)"""
    out, mp, i = [], [], 0
    while i < len(t):
        if t[i].isspace():
            j = i
            while j < len(t) and t[j].isspace():
                j += 1
            out.append(" ")
            mp.append((i, j - 1))
            i = j
        else:
            out.append(t[i])
            mp.append((i, i))
            i += 1
    return "".join(out), mp


def _encode_for(region: dict, text: str, html_text: bool) -> str:
    if region["kind"] == "py":
        q = region["quote"][0]
        return text.replace("\\", "\\\\").replace(q, "\\" + q).replace("\n", "\\n")
    t = text if html_text else _esc(text)
    if region["kind"] == "jlit":
        q = region["quote"][0]
        t = t.replace("\\", "\\\\").replace(q, "\\" + q)
    return t


def _span_edits(v: Vis, i0: int, i1: int, repl: str, links: bool, src: str) -> list[tuple[int, int, str]]:
    """Source edits replacing visible chars [i0, i1) with repl (i0 == i1: insert at that point)."""
    if i0 == i1:
        prev_ok = i0 > 0 and not v.virt[i0 - 1]
        if prev_ok:
            k, pos = i0 - 1, v.e[i0 - 1]
        elif i0 < len(v.ch) and not v.virt[i0]:
            k, pos = i0, v.s[i0]
        else:
            raise ValueError("replace would insert at a paragraph/heading boundary")
        return [(pos, pos, _encode_for(v.regions[v.reg[k]], repl, links))]
    idx = list(range(i0, i1))
    if any(v.virt[k] for k in idx):
        raise ValueError("replace would cross a paragraph/heading boundary — edit one block at a time")
    groups: list[list[int]] = []
    for k in idx:
        if groups and v.reg[groups[-1][-1]] == v.reg[k]:
            groups[-1].append(k)
        else:
            groups.append([k])
    if v.html and len(groups) > 1:
        raise ValueError("replace would cross a Jinja expression")
    edits = []
    for n, g in enumerate(groups):
        s0, e0 = v.s[g[0]], v.e[g[-1]]
        if v.html and v.regions[v.reg[g[0]]]["kind"] == "html":
            seg = src[s0:e0]
            if "<" in seg or re.search(r"\{[{%#]", seg):
                raise ValueError("replace would cross inline markup (<a>, <strong>…) — quote a smaller span")
        edits.append((s0, e0, _encode_for(v.regions[v.reg[g[0]]], repl, links) if n == 0 else ""))
    return edits


def plan_replace(v: Vis, a: int, b: int, new: str, src: str) -> list[tuple[int, int, str]]:
    """Minimal source edits turning visible chars [a, b) into `new`: a word-level diff, each changed
    run edited in place (so markup / string-piece boundaries between changes survive). Raises
    ValueError when a change itself would cross markup (a tag, a Jinja construct, a paragraph break)."""
    links = v.html and bool(re.search(r"\[[^\]]+\]\([^)\s]+\)", new))
    if not v.html:
        new = md_strip(new)
    old_n, mp = _norm_map(v.text[a:b])
    new_n = _collapse(new)
    if old_n == new_n:
        return []
    if links:                                           # new HTML markup: swap the whole span
        return _span_edits(v, a + mp[0][0], a + mp[-1][1] + 1, md_inline(new_n), True, src)
    ot, nt = re.findall(r"\s+|\S+", old_n), re.findall(r"\s+|\S+", new_n)
    oc = [0]
    for t in ot:
        oc.append(oc[-1] + len(t))
    edits = []
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, ot, nt, autojunk=False).get_opcodes():
        if tag == "equal":
            continue
        c0, c1 = oc[i1], oc[i2]
        repl = "".join(nt[j1:j2])
        if c0 == c1:                                    # pure insertion before old char c0
            at = a + mp[c0 - 1][1] + 1 if c0 > 0 else a + mp[0][0]
            edits += _span_edits(v, at, at, repl, False, src)
        else:
            edits += _span_edits(v, a + mp[c0][0], a + mp[c1 - 1][1] + 1, repl, False, src)
    return edits


def apply_edits(src: str, edits: list[tuple[int, int, str]]) -> str:
    for s, e, t in sorted(edits, key=lambda x: (x[0], x[1]), reverse=True):
        src = src[:s] + t + src[e:]
    return src


# ---- template -> plain text ---------------------------------------------------------------
class _Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.buf, self.mode, self.skip, self.row = [], [], None, 0, None

    def flush(self):
        t = _collapse("".join(self.buf))
        self.buf = []
        if not t:
            return
        if self.mode == "h2":
            self.out.append(f"\n## {t}\n")
        elif self.mode == "h3":
            self.out.append(f"\n### {t}\n")
        elif self.mode == "li":
            self.out.append(f"- {t}")
        elif self.mode == "summary":
            self.out.append(f"\n**Q: {t}**")
        elif self.row is not None:
            self.row.append(t)
            return
        else:
            self.out.append(t + "\n")

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1
            return
        if tag in ("td", "th"):
            self.flush()
            return
        if tag == "tr":
            self.flush()
            self.row = []
            return
        if tag in BREAK_TAGS:
            self.flush()
            self.mode = tag if tag in ("h2", "h3", "li", "summary") else None

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)
            return
        if tag in ("td", "th"):
            self.flush()
            return
        if tag == "tr":
            self.flush()
            if self.row:
                self.out.append("| " + " | ".join(self.row) + " |")
            self.row = None
            return
        if tag in BREAK_TAGS:
            self.flush()
            self.mode = None

    def handle_data(self, data):
        if not self.skip:
            self.buf.append(data)


def html_to_text(fragment: str) -> str:
    p = _Text()
    p.feed(fragment)
    p.close()
    p.flush()
    return re.sub(r"\n{3,}", "\n\n", "\n".join(p.out)).strip()


def strip_jinja(s: str) -> str:
    out, last = [], 0
    for a, b, _ in jinja_ranges(s):
        out.append(s[last:a])
        last = b
    out.append(s[last:])
    return "".join(out)


# ======================================================================================
# the backend
# ======================================================================================
class JinjaCatalog(Backend):
    def __init__(self, root, cfg):
        super().__init__(Path(root), cfg)
        j = cfg.get("jinja", {})
        self.server = j.get("server", "server.py")
        self.tdir = j.get("templates", "templates")
        self.ofn = j.get("overrides_fn", "_curated_guide_overrides")
        self.http_check = j.get("http_check", True)
        self.python = j.get("python")
        self.kinds = {k: dict(v) for k, v in KINDS.items()}
        for k, v in j.get("kinds", {}).items():
            self.kinds.setdefault(k, {}).update(v)
        self._ast_cache: dict[str, tuple[str, ast.AST]] = {}
        self._interp: dict[str, str | None] = {}
        self._http_target: tuple[str, list[str]] | None = None

    # ---- source access -------------------------------------------------------------------
    def _read(self, rel: str) -> str:
        return (self.root / rel).read_text(encoding="utf-8")

    def _ast(self, rel: str, src: str):
        hit = self._ast_cache.get(rel)
        if hit and hit[0] == src:
            return hit[1]
        tree = ast.parse(src)
        self._ast_cache[rel] = (src, tree)
        return tree

    def _split(self, path: str):
        segs = [s for s in path.strip("/").split("/") if s]
        if len(segs) != 2 or segs[0] not in self.kinds:
            return None, None
        return segs[0], segs[1]

    # ---- catalog entry ---------------------------------------------------------------------
    def _catalog_call(self, kind: dict, slug: str, src: str):
        """The dataclass call for slug (LAST one wins, like the {t.slug: t} lookup dicts)."""
        tree = self._ast(kind["catalog"], src)
        hit = None
        for n in ast.walk(tree):
            if isinstance(n, ast.Call) and getattr(n.func, "id", None) == kind["cls"]:
                for k in n.keywords:
                    if k.arg == "slug" and isinstance(k.value, ast.Constant) and k.value.value == slug:
                        if hit is None or (n.lineno, n.col_offset) > (hit.lineno, hit.col_offset):
                            hit = n
        return hit

    @staticmethod
    def _kw(call, name):
        for k in call.keywords:
            if k.arg == name:
                return k
        return None

    def _kwval(self, call, name, default=""):
        k = self._kw(call, name)
        if k is None:
            return default
        try:
            return ast.literal_eval(k.value)
        except Exception:  # noqa: BLE001
            return default

    # ---- overrides block (guides) ----------------------------------------------------------
    def _ofn(self, src: str):
        tree = self._ast(self.server, src)
        for n in tree.body:
            if isinstance(n, ast.FunctionDef) and n.name == self.ofn:
                return n
        return None

    @staticmethod
    def _is_slug_if(stmt, slug=None):
        t = getattr(stmt, "test", None)
        ok = (isinstance(stmt, ast.If) and isinstance(t, ast.Compare) and isinstance(t.left, ast.Name)
              and t.left.id == "slug" and len(t.ops) == 1 and isinstance(t.ops[0], ast.Eq)
              and isinstance(t.comparators[0], ast.Constant))
        return ok and (slug is None or t.comparators[0].value == slug)

    def _block(self, src: str, slug: str):
        """First `if slug == "<slug>":` in the overrides function (the one that returns at runtime)."""
        fn = self._ofn(src)
        if fn is None:
            return None
        for s in fn.body:
            if self._is_slug_if(s, slug):
                return s
        return None

    @staticmethod
    def _block_dict(block):
        """(return Dict node, {name: value node} for local assignments) of an overrides block."""
        local = {}
        for s in block.body:
            if isinstance(s, ast.Assign) and len(s.targets) == 1 and isinstance(s.targets[0], ast.Name):
                local[s.targets[0].id] = s.value
            if isinstance(s, ast.Return):
                return (s.value if isinstance(s.value, ast.Dict) else None), local
        return None, local

    @staticmethod
    def _dict_get(d, key):
        for k, v in zip(d.keys, d.values):
            if isinstance(k, ast.Constant) and k.value == key:
                return v
        return None

    def _faq_nodes(self, block):
        """[(q node, a node)] of the overrides faq_items list (inline or a local variable)."""
        d, local = self._block_dict(block)
        if d is None:
            return []
        lst = self._dict_get(d, "faq_items")
        if isinstance(lst, ast.Name):
            lst = local.get(lst.id)
        if not isinstance(lst, ast.List):
            return []
        out = []
        for el in lst.elts:
            if isinstance(el, ast.Dict):
                q, a = self._dict_get(el, "q"), self._dict_get(el, "a")
                if isinstance(q, ast.Constant) and isinstance(a, ast.Constant):
                    out.append((q, a))
        return out

    # ---- locate ----------------------------------------------------------------------------
    def locate(self, path: str) -> Page | None:
        prefix, slug = self._split(path)
        if not prefix:
            return None
        kind = self.kinds[prefix]
        cat_src = self._read(kind["catalog"])
        call = self._catalog_call(kind, slug, cat_src)
        if call is None:
            return None                       # guides: DB-backed fallback page — unsupported
        status = self._kwval(call, "status", None)
        if status is not None and status != "published":
            return None
        tpl_rel = f"{self.tdir}/{kind['tpl']}/{slug}.html.j2"
        if not (self.root / tpl_rel).exists():
            return None
        tpl = self._read(tpl_rel)
        name = self._kwval(call, "name", slug)
        tagline = self._kwval(call, "tagline", "")
        files, block_src, title, desc = [tpl_rel], "", "", ""
        if kind["meta"] == "overrides":
            srv = self._read(self.server)
            block = self._block(srv, slug)
            ov = {}
            if block is not None:
                off = _Offsets(srv)
                a, b = off.lines(block)
                block_src = srv[a:b]
                d, _ = self._block_dict(block)
                for k in ("seo_title", "seo_description", "breadcrumb_label", "guide_h1"):
                    v = self._dict_get(d, k) if d is not None else None
                    if isinstance(v, ast.Constant) and isinstance(v.value, str):
                        ov[k] = v.value
                files.append(self.server)
            label = ov.get("breadcrumb_label") or (name if name.lower().endswith("therapy") else f"{name} therapy")
            title = ov.get("seo_title") or f"{label} — guide"
            desc = ov.get("seo_description") or tagline
        elif kind["cls"] == "CommentaryPost":
            title = self._kwval(call, "seo_title", None) or \
                f"{self._kwval(call, 'person')} on {self._kwval(call, 'topic')}: evidence check"
            desc = self._kwval(call, "summary", "")
        else:
            title = self._kwval(call, "seo_title", "") or f"{name} — guide"
            desc = self._kwval(call, "seo_description", "") or tagline
        files.append(kind["catalog"])
        off = _Offsets(cat_src)
        ca, cb = off.span(call)
        native = tpl
        if block_src:
            native += f"\n\n{{# ---- {self.server} {self.ofn} block ---- #}}\n" + block_src
        native += f"\n{{# ---- {kind['catalog']} entry ---- #}}\n" + cat_src[ca:cb] + "\n"
        return Page(path=path, slug=slug, key=f"{prefix}::{slug}", files=files, title=title, kind=prefix,
                    native=native, extra={"description": desc, "template": tpl_rel, "catalog": kind["catalog"],
                                          "prefix": prefix})

    def _kind(self, page: Page) -> tuple[str, dict]:
        prefix, slug = self._split(page.path)
        if not prefix:
            raise ValueError(f"{page.path}: not a catalog page")
        return prefix, self.kinds[prefix]

    # ---- reading ---------------------------------------------------------------------------
    def _h1(self, tpl: str, call, kind: dict, ov_h1: str | None) -> str:
        name = self._kwval(call, "name", "")
        if kind["cls"] == "CommentaryPost":
            return self._kwval(call, "headline", "")
        if kind["header"]:
            m = re.search(r"\{\{-?\s*" + kind["header"] + r"\((.*?)\)\s*-?\}\}", tpl, re.S)
            if m:
                t = re.search(r"""title_override\s*=\s*(?:(\w+)\s+or\s+)?(["'])((?:\\.|(?!\2).)*)\2""", m.group(1), re.S)
                if t:
                    if t.group(1) == "guide_h1" and ov_h1:
                        return ov_h1
                    return t.group(3)
                if re.search(r"title_override\s*=\s*guide_h1\b", m.group(1)) and ov_h1:
                    return ov_h1
        if kind["cls"] == "Therapy":
            return name if name.lower().strip().endswith("therapy") else f"{name} therapy"
        return name

    def text(self, page: Page) -> str:
        prefix, kind = self._kind(page)
        tpl = self._read(page.extra["template"])
        cat_src = self._read(kind["catalog"])
        call = self._catalog_call(kind, page.slug, cat_src)
        out = []
        faq = []
        ov_h1 = None
        if kind["meta"] == "overrides":
            srv = self._read(self.server)
            block = self._block(srv, page.slug)
            if block is not None:
                d, _ = self._block_dict(block)
                v = self._dict_get(d, "guide_h1") if d is not None else None
                ov_h1 = v.value if isinstance(v, ast.Constant) else None
                faq = [(q.value, a.value) for q, a in self._faq_nodes(block)]
        out.append(f"# {self._h1(tpl, call, kind, ov_h1)}\n")
        if kind["cls"] == "CommentaryPost":
            out.append(self._kwval(call, "summary", "") + "\n")
            for h, f in (("Context", "context"), ("What The Evidence Shows", "evidence"),
                         ("Bottom Line", "bottom_line")):
                out.append(f"## {h}\n\n{self._kwval(call, f, '')}\n")
            fk = self._kw(call, "faq_items")
            if fk is not None:
                for el in getattr(fk.value, "elts", []):
                    if isinstance(el, ast.Call):
                        q, a = self._kwval(el, "q"), self._kwval(el, "a")
                        faq.append((q, a))
        else:
            tag = self._kwval(call, "tagline", "")
            if tag:
                out.append(tag + "\n")
            m = re.search(r"\{\{-?\s*key_takeaways\(", tpl)
            if m:
                e = _jinja_end(tpl, m.start())
                items = [html_to_text("".join(c for c, _, _ in decode_literal(tpl, lt["body_start"], lt["body_end"], False)))
                         for lt in scan_literals(tpl, m.end(), e - 2)]
                if items:
                    out.append("Key takeaways:\n" + "\n".join(f"- {x}" for x in items if x) + "\n")
            bs = body_span(tpl)
            frag = tpl[bs[1]:bs[2]] if bs else tpl
            out.append(html_to_text(strip_jinja(frag)) + "\n")
        txt = "\n".join(out)
        if faq:
            items = "\n".join(f"**Q: {q}**\n{a}\n" for q, a in faq)
            head = "\n## Frequently asked questions\n"
            if head in txt:
                txt = txt.replace(head, head + "\n" + items + "\n", 1)
            else:
                txt += head + "\n" + items
        return re.sub(r"\n{3,}", "\n\n", txt).strip() + "\n"

    def headings(self, page: Page) -> list[dict]:
        prefix, kind = self._kind(page)
        if not kind["sections"]:
            return [{"id": None, "heading": h} for h in ("Context", "What The Evidence Shows", "Where It Lands",
                                                         "Bottom Line", "Frequently asked questions")]
        tpl = self._read(page.extra["template"])
        jr = jinja_ranges(tpl)
        bs = body_span(tpl, jr)
        hs = h2_list(tpl, jr)
        if bs:
            hs = [h for h in hs if bs[1] <= h["start"] < bs[2]]
        return [{"id": h["id"], "heading": h["heading"]} for h in hs]

    def voice_sample(self, kind: str, exclude: set[str]) -> str | None:
        k = self.kinds.get(kind)
        if not k or not k["sections"]:
            return None
        for f in sorted((self.root / self.tdir / k["tpl"]).glob("*.html.j2")):
            slug = f.name[:-len(".html.j2")]
            if slug.startswith("_") or slug in exclude:
                continue
            tpl = f.read_text(encoding="utf-8")
            bs = body_span(tpl)
            hs = [h for h in h2_list(tpl) if not bs or bs[1] <= h["start"] < bs[2]]
            if len(hs) >= 4:
                return tpl
        return None

    # ---- writing: template ops ---------------------------------------------------------------
    @staticmethod
    def _section_html(heading: str, paras: list[str], sid: str | None, ind: str) -> str:
        idattr = f' id="{html.escape(sid, quote=True)}"' if sid else ""
        lines = [f"{ind}<h2{idattr}>{_esc(heading)}</h2>"]
        for p in paras:
            p = p.strip()
            if not p:
                continue
            ls = p.splitlines()
            if all(re.match(r"\s*[-*]\s+", x) for x in ls):
                lines.append(f"{ind}<ul>")
                for x in ls:
                    item = md_inline(re.sub(r"^\s*[-*]\s+", "", x))
                    lines.append(f"{ind}  <li>{item}</li>")
                lines.append(f"{ind}</ul>")
            else:
                lines.append(f"{ind}<p>{md_inline(_collapse(p))}</p>")
        return "\n".join(lines) + "\n"

    @staticmethod
    def _match_h2(hs, key: str):
        k = key.strip()
        for h in hs:
            if h["id"] and h["id"] == k:
                return h
        for h in hs:
            if h["heading"].casefold() == _collapse(html.unescape(k)).casefold():
                return h
        for h in hs:
            if slugify(h["heading"]) == slugify(k) or (h["id"] and h["id"] == slugify(k)):
                return h
        return None

    @staticmethod
    def _toc_span(tpl: str):
        m = re.search(r"""<(div|nav)\b[^>]*class\s*=\s*["'][^"']*\btoc[\w-]*[^"']*["'][^>]*>""", tpl)
        if not m:
            return None
        depth, tag = 0, m.group(1)
        for t in re.finditer(rf"<(/?){tag}\b[^>]*>", tpl[m.end():]):
            if t.group(1):
                if depth == 0:
                    return m.start(), m.end() + t.end()
                depth -= 1
            else:
                depth += 1
        return None

    def _toc_edit(self, tpl: str, new_id: str, heading: str, before_id: str | None):
        """(pos, text) to add an 'On this page' entry for a new section, or None."""
        ts = self._toc_span(tpl)
        if not ts:
            return None
        box = tpl[ts[0]:ts[1]]
        lis = [m for m in re.finditer(r"""^[ \t]*<li>\s*<a href="#([^"]+)">.*?</a>\s*</li>[ \t]*\n""", box, re.M)]
        if not lis:
            return None
        ref = next((m for m in lis if before_id and m.group(1) == before_id), None)
        tmpl = (ref or lis[-1]).group(0)
        line = re.sub(r'href="#[^"]+"', f'href="#{html.escape(new_id, quote=True)}"', tmpl, count=1)
        line = re.sub(r"(<a [^>]*>).*?(</a>)", lambda m: m.group(1) + _esc(heading) + m.group(2), line, count=1)
        pos = ts[0] + (ref.start() if ref else lis[-1].end())
        return pos, line

    def _default_anchor(self, tpl: str, bs, hs_body):
        """Where an un-anchored new section goes: before the trailing FAQ/sources run, else at the
        end of the therapy-body div."""
        run = None
        for h in reversed(hs_body):
            if FOOTERISH.match(h["heading"]) or (h["id"] and FOOTERISH.match(h["id"].replace("-", " "))):
                run = h
            else:
                break
        if run is not None:
            pos, _ = wrap_start(tpl, run["start"], bs[1])
            return pos, run
        return bs[2], None

    def _op_section(self, tpl: str, op: dict, notes: list, expect: list) -> str:
        jr = jinja_ranges(tpl)
        bs = body_span(tpl, jr)
        if not bs:
            raise Unsupported("template has no <div class=\"therapy-body\"> to put a section in")
        hs_all = h2_list(tpl, jr)
        hs = [h for h in hs_all if bs[1] <= h["start"] < bs[2]]
        heading = _collapse(op["heading"])
        inds = [_indent_at(tpl, h["start"]) for h in hs if _ws_before(tpl, h["start"])]
        body_ind = max(set(inds), key=inds.count) if inds else _indent_at(tpl, bs[0]) + "  "
        if op["op"] == "replace_section":
            h = self._match_h2(hs, op["match"])
            if not h:
                raise ValueError(f"section {op['match']!r} not found to replace")
            if (h["id"] or "").lower() == "faq" or FOOTERISH.match(h["heading"]) and "frequently" in h["heading"].lower():
                raise Unsupported("the FAQ section is data-driven (faq_items) — not replaceable as a section")
            ws, wrapped = wrap_start(tpl, h["start"], bs[1])
            if wrapped or ws != h["start"] or not _ws_before(tpl, h["start"]):
                raise Unsupported(f"section {op['match']!r} is wrapped in a container/Jinja guard")
            end = section_end(tpl, h["end"], bs[2])
            k = end
            while k > h["end"] and tpl[k - 1].isspace():
                k -= 1
            nl = tpl.find("\n", k)
            stop = end if nl < 0 or nl >= end else nl + 1
            start = _line_start(tpl, h["start"])
            sid = op.get("section_id") or h["id"] or slugify(heading)
            if sid != h["id"] and any(x["id"] == sid for x in hs_all):
                sid = h["id"]
            new = self._section_html(heading, op["paragraphs"], sid, _indent_at(tpl, h["start"]))
            edits = [(start, stop, new)]
            if h["id"] and heading != h["heading"]:
                ts = self._toc_span(tpl)
                if ts:
                    box = tpl[ts[0]:ts[1]]
                    ms = list(re.finditer(r'(<a href="#' + re.escape(h["id"]) + r'">)(.*?)(</a>)', box))
                    if len(ms) == 1 and _collapse(html.unescape(ms[0].group(2))) == h["heading"]:
                        m = ms[0]
                        edits.append((ts[0] + m.start(2), ts[0] + m.end(2), _esc(heading)))
            notes.append(f"replaced section: {h['heading']} -> {heading}")
            expect.append(_esc(heading))
            return apply_edits(tpl, edits)
        # insert_section
        sid = op.get("section_id") or slugify(heading)
        if self._match_h2(hs_all, heading) or any(x["id"] == sid for x in hs_all):
            raise ValueError(f"section {heading!r} already exists")
        anchor_h = self._match_h2(hs, op["before"]) if op.get("before") else None
        if op.get("before") and not anchor_h:
            notes.append(f"before {op['before']!r} not found — appended at the end of the body")
        if anchor_h:
            pos, _ = wrap_start(tpl, anchor_h["start"], bs[1])
        else:
            pos, anchor_h = self._default_anchor(tpl, bs, hs)
        if _ws_before(tpl, pos):
            at = _line_start(tpl, pos)
            ind = _indent_at(tpl, pos) if anchor_h else body_ind
            new = self._section_html(heading, op["paragraphs"], sid, ind) + "\n"
        else:
            at = pos
            new = "\n" + self._section_html(heading, op["paragraphs"], sid, body_ind) + "\n"
        edits = [(at, at, new)]
        toc = self._toc_edit(tpl, sid, heading, anchor_h["id"] if anchor_h else None)
        if toc and toc[0] != at:
            edits.append((toc[0], toc[0], toc[1]))
            notes.append("added 'On this page' entry")
        notes.append(f"added section: {heading}" + (f" (before {anchor_h['heading']})" if anchor_h else ""))
        expect.append(_esc(heading))
        return apply_edits(tpl, edits)

    # ---- writing: python edits -----------------------------------------------------------------
    @staticmethod
    def _set_str_node(src: str, off: _Offsets, node, value: str) -> str:
        a, b = off.span(node)
        multi = "\n" in src[a:b]
        lit = _wrapped_lit(value, _indent_at(src, a)) if multi else _pylit(value)
        return src[:a] + lit + src[b:]

    def _set_kwarg(self, src: str, rel: str, call_fn, name: str, value: str) -> tuple[str, str]:
        call = call_fn(src)
        off = _Offsets(src)
        k = self._kw(call, name)
        if k is not None:
            if not (isinstance(k.value, ast.Constant) and isinstance(k.value.value, (str, type(None)))):
                return src, f"skipped {name}: not a plain string"
            return self._set_str_node(src, off, k.value, value), f"{name} -> {value[:80]}"
        last = call.keywords[-1]
        _, e = off.span(last.value)
        j = e
        while j < len(src) and src[j] in " \t":
            j += 1
        ind = _indent_at(src, off.at(last.lineno, last.col_offset))
        if src[j:j + 1] == ",":
            ins_at, text = j + 1, f"\n{ind}{name}={_pylit(value)},"
        else:
            ins_at, text = e, f",\n{ind}{name}={_pylit(value)},"
        return src[:ins_at] + text + src[ins_at:], f"{name} -> {value[:80]} (added)"

    def _set_override(self, srv: str, slug: str, key: str, value: str) -> tuple[str, str]:
        block = self._block(srv, slug)
        off = _Offsets(srv)
        if block is None:
            fn = self._ofn(srv)
            if fn is None:
                raise Unsupported(f"{self.server} has no {self.ofn}()")
            tail = next((s for s in fn.body[1:] if not self._is_slug_if(s)), None)
            anchor = tail or fn.body[-1]
            ins = off.starts[anchor.lineno - 1]
            first_if = next(s for s in fn.body if self._is_slug_if(s))
            i1 = _indent_at(srv, off.at(first_if.lineno, first_if.col_offset))
            text = (f'{i1}if slug == {_pylit(slug)}:\n{i1}    return {{\n'
                    f'{i1}        {_pylit(key)}: {_pylit(value)},\n{i1}    }}\n\n')
            return srv[:ins] + text + srv[ins:], f"{key} -> {value[:80]} (new overrides block)"
        d, _ = self._block_dict(block)
        if d is None:
            raise Unsupported(f"overrides block for {slug!r} does not return a dict literal")
        v = self._dict_get(d, key)
        if v is not None:
            if not (isinstance(v, ast.Constant) and isinstance(v.value, str)):
                return srv, f"skipped {key}: not a plain string"
            return self._set_str_node(srv, off, v, value), f"{key} -> {value[:80]}"
        da, _ = off.span(d)
        if d.keys:
            k0 = off.at(d.keys[0].lineno, d.keys[0].col_offset)
            ind = _indent_at(srv, k0)
            at = _line_start(srv, k0)
        else:
            ind = _indent_at(srv, da) + "    "
            at = srv.find("\n", da) + 1
        return srv[:at] + f"{ind}{_pylit(key)}: {_pylit(value)},\n" + srv[at:], f"{key} -> {value[:80]} (added)"

    # ---- replace ---------------------------------------------------------------------------------
    def _replace_units(self, page: Page, kind: dict, srcs: dict) -> list[Vis]:
        units = []
        tpl_rel = page.extra["template"]
        if kind["sections"]:
            units.append(template_visible(tpl_rel, srcs[tpl_rel]))
        if kind["meta"] == "overrides" and self.server in srcs:
            srv = srcs[self.server]
            block = self._block(srv, page.slug)
            if block is not None:
                off = _Offsets(srv)
                spans = []
                for q, a in self._faq_nodes(block):
                    for n in (q, a):
                        s, e = off.span(n)
                        spans.append((s, e, n.value))
                units += python_visible(self.server, srv, spans)
        cat = kind["catalog"]
        csrc = srcs[cat]
        call = self._catalog_call(kind, page.slug, csrc)
        off = _Offsets(csrc)
        wanted = COMMENTARY_KWARGS if kind["cls"] == "CommentaryPost" else VISIBLE_KWARGS
        spans = []
        for n in ast.walk(call):
            if isinstance(n, ast.keyword) and n.arg in wanted and isinstance(n.value, ast.Constant) \
                    and isinstance(n.value.value, str):
                s, e = off.span(n.value)
                spans.append((s, e, n.value.value))
        units += python_visible(cat, csrc, spans)
        return units

    def _op_replace(self, page: Page, kind: dict, srcs: dict, op: dict, notes: list):
        old = _collapse(html.unescape(op["old"]))
        units = self._replace_units(page, kind, srcs)
        for fold in (False, True):
            hits = [(u, a, b) for u in units for a, b in _find(u, old, fold)]
            if hits:
                break
        if len(hits) != 1:
            raise ValueError(f"replace 'old' text found {len(hits)} times (need exactly 1): {op['old'][:80]!r}")
        u, a, b = hits[0]
        edits = plan_replace(u, a, b, op["new"], srcs[u.rel])
        srcs[u.rel] = apply_edits(srcs[u.rel], edits)
        where = "template" if u.html else Path(u.rel).name
        notes.append(f'"{op["old"][:80]}" -> "{op["new"][:80]}" ({where})')

    # ---- dates -------------------------------------------------------------------------------
    def _bump_dates(self, page: Page, kind: dict, srcs: dict, today: str, notes: list):
        tpl_rel = page.extra["template"]
        if kind["header"]:
            pat = re.compile(r"(\{\{-?\s*" + kind["header"] + r"\(\s*\w+\s*,\s*)([\"'])(" + DATE + r")\2")
            ms = list(pat.finditer(srcs[tpl_rel]))
            if len(ms) == 1:
                m = ms[0]
                if m.group(3) != today:
                    srcs[tpl_rel] = srcs[tpl_rel][:m.start(3)] + today + srcs[tpl_rel][m.end(3):]
            else:
                notes.append(f"template header date not bumped ({len(ms)} {kind['header']} date literals)")
        cat = kind["catalog"]
        call = self._catalog_call(kind, page.slug, srcs[cat])
        k = self._kw(call, "last_reviewed")
        if k is not None and isinstance(k.value, ast.Constant) and k.value.value == today:
            return
        srcs[cat], _ = self._set_kwarg(srcs[cat], cat, lambda s: self._catalog_call(kind, page.slug, s),
                                       "last_reviewed", today)
        notes.append(f"updated -> {today}")

    # ---- apply -------------------------------------------------------------------------------
    def apply(self, page: Page, ops: list[dict], today: str, dry_run: bool = False, preview=None) -> Result:
        prefix, kind = self._kind(page)
        tpl_rel = page.extra["template"]
        rels = [tpl_rel, kind["catalog"]] + ([self.server] if kind["meta"] == "overrides" else [])
        orig = {r: self._read(r) for r in dict.fromkeys(rels)}
        srcs = dict(orig)
        notes, expect = [], []
        for op in ops:
            kop = op["op"]
            if kop == "meta":
                for logical, field in (("title", "seo_title"), ("description", "seo_description")):
                    val = op.get(logical)
                    if not val:
                        continue
                    if kind["meta"] == "overrides":
                        srcs[self.server], note = self._set_override(srcs[self.server], page.slug, field, val)
                    elif kind["meta"] == "catalog_title" and logical == "description":
                        note = "skipped description: commentary meta description is the visible summary"
                    else:
                        cat = kind["catalog"]
                        srcs[cat], note = self._set_kwarg(srcs[cat], cat,
                                                          lambda s: self._catalog_call(kind, page.slug, s), field, val)
                    notes.append(note)
                    if logical == "title" and not note.startswith("skipped"):
                        expect.append(html.escape(val, quote=True).replace("&#x27;", "&#39;").replace("&quot;", "&#34;"))
            elif kop in ("insert_section", "replace_section"):
                if not kind["sections"]:
                    raise Unsupported(f"/{prefix}/ pages are rendered from catalog fields by a fixed macro — no free sections")
                srcs[tpl_rel] = self._op_section(srcs[tpl_rel], op, notes, expect)
            elif kop == "replace":
                self._op_replace(page, kind, srcs, op, notes)
            elif kop == "rewrite":
                raise Unsupported("full rewrite (L5) is not supported for Jinja template pages")
            else:
                raise ValueError(f"unknown op {kop}")
        self._bump_dates(page, kind, srcs, today, notes)
        changed = [r for r in srcs if srcs[r] != orig[r]]
        if dry_run:
            if preview is not None:
                diff = []
                for r in changed:
                    diff += difflib.unified_diff(orig[r].splitlines(), srcs[r].splitlines(), f"a/{r}", f"b/{r}",
                                                 n=1, lineterm="")
                Path(preview).write_text("\n".join(diff) + "\n")
            ok, msg = self._check_sources({r: srcs[r] for r in changed}, {r: orig[r] for r in changed})
            return Result(ok, msg, changed if ok else [], notes)
        for r in changed:
            (self.root / r).write_text(srcs[r], encoding="utf-8")
        self._http_target = (page.path, expect)
        try:
            ok, msg = self._validate(changed, {r: orig[r] for r in changed})
        finally:
            self._http_target = None
        if not ok:
            for r in changed:
                (self.root / r).write_text(orig[r], encoding="utf-8")
        return Result(ok, msg, changed if ok else [], notes)

    # ---- restore -----------------------------------------------------------------------------
    def _git_show(self, sha: str, rel: str) -> str | None:
        r = subprocess.run(["git", "show", f"{sha}:{rel}"], cwd=self.root, capture_output=True)
        return r.stdout.decode("utf-8") if r.returncode == 0 else None

    def restore(self, page: Page, base_sha: str, today: str) -> Result:
        prefix, kind = self._kind(page)
        tpl_rel = page.extra["template"]
        changed, notes = [], []
        base_tpl = self._git_show(base_sha, tpl_rel)
        if base_tpl is None:
            return Result(False, f"{tpl_rel} missing at {base_sha}")
        new = {tpl_rel: base_tpl}
        cat = kind["catalog"]
        cur_cat, base_cat = self._read(cat), self._git_show(base_sha, cat)
        cur_call = self._catalog_call(kind, page.slug, cur_cat)
        base_call = self._catalog_call(kind, page.slug, base_cat) if base_cat else None
        if cur_call is None or base_call is None:
            return Result(False, "catalog entry missing now or at base")
        ca, cb = _Offsets(cur_cat).span(cur_call)
        ba, bb = _Offsets(base_cat).span(base_call)
        new[cat] = cur_cat[:ca] + base_cat[ba:bb] + cur_cat[cb:]
        if kind["meta"] == "overrides":
            srv, base_srv = self._read(self.server), self._git_show(base_sha, self.server)
            cur_b = self._block(srv, page.slug)
            base_b = self._block(base_srv, page.slug) if base_srv else None
            off = _Offsets(srv)
            if cur_b is not None and base_b is not None:
                a, b = off.lines(cur_b)
                ba2, bb2 = _Offsets(base_srv).lines(base_b)
                new[self.server] = srv[:a] + base_srv[ba2:bb2] + srv[b:]
            elif cur_b is not None:                       # block was created by the run: drop it
                a, b = off.lines(cur_b)
                if srv[b:b + 1] == "\n":
                    b += 1
                new[self.server] = srv[:a] + srv[b:]
            elif base_b is not None:
                return Result(False, "overrides block was deleted since base — restore by hand")
        for r, text in new.items():
            if (self.root / r).read_text(encoding="utf-8") != text:
                (self.root / r).write_text(text, encoding="utf-8")
                changed.append(r)
        ok, msg = self.validate(changed)
        notes.append(f"restored to {base_sha}")
        return Result(ok, msg, changed, notes)

    # ---- validation --------------------------------------------------------------------------
    def _interpreter(self, need: str) -> str | None:
        """A Python that can `import <need>` (jinja2 / flask). The engine's own Python may lack them."""
        if need in self._interp:
            return self._interp[need]
        cands = [self.python, sys.executable, str(self.root / ".venv/bin/python"), str(self.root / "venv/bin/python"),
                 shutil.which("python3"), "/usr/bin/python3", "/opt/homebrew/bin/python3"]
        hit = None
        for c in dict.fromkeys(x for x in cands if x):
            if not Path(c).exists():
                continue
            r = subprocess.run([c, "-c", f"import {need}"], capture_output=True)
            if r.returncode == 0:
                hit = c
                break
        self._interp[need] = hit
        return hit

    @staticmethod
    def _balance(src: str) -> dict:
        b = {}
        for t in ("div", "section", "ul", "ol", "table", "details", "aside", "p", "h2", "h3", "a", "li"):
            b[t] = len(re.findall(rf"<{t}\b", src)) - len(re.findall(rf"</{t}\s*>", src))
        st = re.findall(r"\{%-?\s*(\w+)", src)
        for k in ("if", "for", "block", "macro", "call"):
            b["j" + k] = st.count(k) - st.count("end" + k)
        return b

    def _jinja_parse(self, items: dict[str, str]) -> tuple[bool, str]:
        """items: {name: template source}. Parse each with jinja2 (in-process or via a capable interpreter)."""
        code = ("import json,sys\nfrom jinja2 import Environment, FileSystemLoader\n"
                "env=Environment(loader=FileSystemLoader(sys.argv[1]))\nbad=[]\n"
                "for name,path in json.load(open(sys.argv[2])):\n"
                "    try: env.parse(open(path,encoding='utf-8').read(), name=name)\n"
                "    except Exception as e: bad.append(f'{name}: {e}')\n"
                "print(json.dumps(bad))\n")
        py = self._interpreter("jinja2")
        if not py:
            return True, "jinja2 unavailable — balanced-tag check only"
        with tempfile.TemporaryDirectory() as td:
            lst = []
            for n, (name, text) in enumerate(items.items()):
                p = Path(td) / f"t{n}.j2"
                p.write_text(text, encoding="utf-8")
                lst.append((name, str(p)))
            (Path(td) / "list.json").write_text(json.dumps(lst))
            r = subprocess.run([py, "-c", code, str(self.root / self.tdir), str(Path(td) / "list.json")],
                               capture_output=True, text=True, timeout=120)
        if r.returncode:
            return False, "jinja check crashed: " + r.stderr[-300:]
        bad = json.loads(r.stdout.strip().splitlines()[-1])
        return (not bad), ("; ".join(bad)[:300] if bad else "jinja2 parse ok")

    def _check_sources(self, new: dict[str, str], old: dict[str, str] | None = None) -> tuple[bool, str]:
        msgs, tpls = [], {}
        for rel, text in new.items():
            if rel.endswith(".py"):
                try:
                    compile(text, rel, "exec")
                except SyntaxError as e:
                    return False, f"{rel}: SyntaxError line {e.lineno}: {e.msg}"
                msgs.append(f"{Path(rel).name} compiles")
            elif rel.endswith(".j2"):
                if old and rel in old and self._balance(text) != self._balance(old[rel]):
                    return False, f"{rel}: tag balance changed {self._balance(old[rel])} -> {self._balance(text)}"
                tpls[rel[len(self.tdir) + 1:] if rel.startswith(self.tdir + "/") else rel] = text
        if tpls:
            ok, m = self._jinja_parse(tpls)
            if not ok:
                return False, m
            msgs.append(m)
        return True, "; ".join(msgs) or "nothing to check"

    def _http(self, path: str, expect: list[str]) -> tuple[bool, str]:
        py = self._interpreter("flask")
        if not py:
            return True, "GET skipped (no interpreter with flask)"
        code = ("import json,os,sys\nsys.path.insert(0,sys.argv[1])\n"
                "try:\n    import server\nexcept BaseException as e:\n"
                "    print(json.dumps({'skip':repr(e)[:200]})); sys.exit(0)\n"
                "r=server.app.test_client().get(sys.argv[2]); b=r.get_data(as_text=True)\n"
                "print(json.dumps({'status':r.status_code,'missing':[x for x in json.loads(sys.argv[3]) if x not in b]}))\n")
        with tempfile.TemporaryDirectory() as td:
            env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1", "DATABASE_URL": f"sqlite:///{td}/check.db"}
            try:
                r = subprocess.run([py, "-c", code, str(self.root), path, json.dumps(expect)], cwd=td, env=env,
                                   capture_output=True, text=True, timeout=180)
            except subprocess.TimeoutExpired:
                return True, "GET skipped (timeout)"
        try:
            out = json.loads(r.stdout.strip().splitlines()[-1])
        except Exception:  # noqa: BLE001
            return True, "GET skipped (no result): " + r.stderr[-200:]
        if "skip" in out:
            return True, "GET skipped (app import failed: " + out["skip"] + ")"
        if out["status"] != 200:
            return False, f"GET {path} -> {out['status']}"
        if out["missing"]:
            return False, f"GET {path} 200 but missing {out['missing'][:3]}"
        return True, f"GET {path} 200"

    def _validate(self, files: list[str], old: dict[str, str] | None = None) -> tuple[bool, str]:
        ok, msg = self._check_sources({f: self._read(f) for f in files}, old)
        if not ok or not self.http_check or not self._http_target:
            return ok, msg
        ok2, m2 = self._http(*self._http_target)
        return ok2, f"{msg}; {m2}"

    def validate(self, files: list[str]) -> tuple[bool, str]:
        return self._validate(files)


BACKEND = JinjaCatalog
