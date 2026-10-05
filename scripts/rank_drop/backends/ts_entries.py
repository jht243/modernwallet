"""Backend: pages are object literals in TypeScript data files (layer3labs, modernwallet).

site.json "ts" block (defaults = layer3labs):
  data_globs     ["data/*.ts"]                files that hold page entries
  parent_field   null | "calculator"          when a slug repeats, the entry whose parent_field equals
                                              the URL's first segment wins (modernwallet spokes)
  fields         {"title": "metaTitle", "description": "metaDescription", "h1": "h1",
                  "updated": "updatedDate"}   (modernwallet: title -> "title", updated -> "updated")
  title_fallback ["metaTitle"]                other title keys tried in order if `title` is absent
  updated_insert false                        insert the updated field after the slug if missing
  section_keys   ["sections", "buyingGuide"]
Section shape is detected per entry: `content: [..paragraphs..]` with ids (layer3) or one string
body `body:`/`content:` with paragraphs joined by a blank line and no id (modernwallet).
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from .base import Backend, Page, Result, Unsupported

_ENGINE = Path(__file__).resolve().parents[1]
if str(_ENGINE) not in sys.path:
    sys.path.insert(0, str(_ENGINE))
from entry_edit import apply_fact_edits, commit_or_preview, rebuild  # noqa: E402
from prepare_pages import object_span, plain_text  # noqa: E402

PARA_SEP = "\n\n"
STR = r"""(?P<q>["'`])(?:\\.|(?!(?P=q)).)*(?P=q)"""


def match_bracket(s: str, i: int) -> int:
    pairs = {"[": "]", "{": "}"}
    depth, quote, j = 0, None, i
    while j < len(s):
        c = s[j]
        if quote:
            if c == "\\":
                j += 2
                continue
            if c == quote:
                quote = None
        elif c in "'\"`":
            quote = c
        elif c in pairs:
            depth += 1
        elif c in "]}":
            depth -= 1
            if depth == 0:
                return j + 1
        j += 1
    raise ValueError("unbalanced")


def object_spans(src: str, positions: list[int]) -> dict[int, tuple[int, int, int]]:
    """{pos: (start, end)} of the innermost {…} owning each position — ONE string-aware pass over the
    file instead of one pass per match (data files are 10–30 MB)."""
    want = sorted(set(positions))
    out, stack, open_at = {}, [], {}
    i, n, quote, k = 0, len(src), None, 0
    pending = []                                   # (depth, pos) waiting for their object to close
    while i < n:
        while k < len(want) and want[k] <= i:
            if stack:
                pending.append((len(stack), want[k]))
            k += 1
        c = src[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "'\"`":
            quote = c
        elif src.startswith("//", i):
            j = src.find("\n", i)
            i = n if j < 0 else j
            continue
        elif src.startswith("/*", i):
            j = src.find("*/", i + 2)
            i = n if j < 0 else j + 2
            continue
        elif c == "{":
            stack.append(i)
        elif c == "}" and stack:
            start = stack.pop()
            depth = len(stack) + 1
            still = []
            for d, p in pending:
                if d == depth:
                    out[p] = (start, i + 1, depth)
                else:
                    still.append((d, p))
            pending = still
        i += 1
    return out


def _open_brace_before(arr: str, pos: int) -> int:
    depth, j = 0, pos
    while j > 0:
        j -= 1
        if arr[j] == "}":
            depth += 1
        elif arr[j] == "{":
            if depth == 0:
                return j
            depth -= 1
    raise ValueError("no enclosing object")


class TsEntries(Backend):
    def __init__(self, root, cfg):
        super().__init__(root, cfg)
        t = cfg.get("ts", {})
        self.globs = t.get("data_globs", ["data/*.ts"])
        self.parent_field = t.get("parent_field")
        self.f = {"title": "metaTitle", "description": "metaDescription", "h1": "h1", "updated": "updatedDate",
                  **t.get("fields", {})}
        self.title_fallback = t.get("title_fallback", ["metaTitle"])
        self.updated_insert = t.get("updated_insert", False)
        self.section_keys = t.get("section_keys", ["sections", "buyingGuide"])
        self._cache = {}

    # ---- locating ------------------------------------------------------------------------
    def _files(self) -> list[Path]:
        out = []
        for g in self.globs:
            out += sorted(self.root.glob(g))
        return out

    def _find(self, path: str, files: list[Path] | None = None):
        segs = [s for s in path.strip("/").split("/") if s]
        slug = segs[-1] if segs else ""
        pat = re.compile(r"""["']?slug["']?\s*:\s*["']""" + re.escape(slug) + r"""["']""")
        files = files or self._files()
        ck = (path, tuple(str(f) for f in files), tuple(f.stat().st_mtime_ns for f in files))
        if ck in self._cache:
            return self._cache[ck]
        pp = (re.compile(r"""["']?""" + re.escape(self.parent_field) + r"""["']?\s*:\s*["']""" + re.escape(segs[0]) + r"""["']""")
              if self.parent_field and len(segs) >= 2 else None)
        cands = []
        for f in files:
            src = f.read_text()
            if not pat.search(src):
                continue
            spans = object_spans(src, [m.start() for m in pat.finditer(src)])
            cands += [(f, a, b, src, dep) for a, b, dep in spans.values()]
            if cands and (not pp or any(pp.search(c[3][c[1]:c[2]]) for c in cands)):
                break                                # a page lives in one data file (old find_entry did this)
        if pp:
            cands = [c for c in cands if pp.search(c[3][c[1]:c[2]])] or cands
        if not cands:
            self._cache[ck] = None
            return None
        # the page's own entry is the SHALLOWEST object owning that slug (a related-product card sits
        # deeper, inside another page) and, if a slug is duplicated, the FIRST one — the one the site
        # serves (content_lint: "the later entry never publishes"; kimi-k3-explained, 2026-10-06)
        best = min(cands, key=lambda c: (c[4], c[1]))[:4]
        self._cache[ck] = best
        return best

    def locate(self, path: str) -> Page | None:
        hit = self._find(path)
        if not hit:
            return None
        f, a, b, src = hit
        entry = src[a:b]
        slug = path.rstrip("/").rsplit("/", 1)[-1]
        title = ""
        for key in [self.f["title"], *self.title_fallback, "h1", "title"]:
            m = re.search(r"""["']?""" + key + r"""["']?\s*:\s*["'`](.+?)["'`],?\s*$""", entry, re.M)
            if m:
                title = m.group(1)
                break
        rel = str(f.relative_to(self.root))
        dm = re.search(r"""["']?""" + re.escape(self.f["description"]) + r"""["']?\s*:\s*["'`](.+?)["'`],?\s*$""", entry, re.M)
        return Page(path=path, slug=slug, key=f"{rel}::{slug}", files=[rel], title=title,
                    kind=Path(rel).stem, native=entry, extra={"description": dm.group(1) if dm else ""})

    def _entry(self, page: Page):
        hit = self._find(page.path)
        if hit and str(hit[0]) != str(self.root / page.files[0]):
            hit = self._find(page.path, [self.root / page.files[0]])
        if not hit:
            raise ValueError(f"entry for {page.path} not found in {page.files[0]}")
        f, a, b, src = hit
        return f, src, src[a:b]

    # ---- reading -------------------------------------------------------------------------
    def text(self, page: Page) -> str:
        entry = self._entry(page)[2]
        out = plain_text(entry).rstrip("\n").splitlines()
        for m in re.finditer(r"""["']?(body|content|introText|intro)["']?\s*:\s*(["'`])((?:\\.|(?!\2).)*)\2""", entry, re.S):
            val = m.group(3).replace("\\n", "\n").replace("\\'", "'").replace('\\"', '"')
            if val and val not in "\n".join(out):
                out.append(val)
        return "\n".join(out).strip() + "\n"

    def headings(self, page: Page) -> list[dict]:
        entry = self._entry(page)[2]
        hs = [{"id": i, "heading": h} for i, h in re.findall(
            r"""["']?id["']?\s*:\s*["']([^"']+)["'],\s*\n\s*["']?heading["']?\s*:\s*["'](.+?)["'],?\s*$""", entry, re.M)]
        if hs:
            return hs
        return [{"id": None, "heading": h} for h in re.findall(
            r"""["']?heading["']?\s*:\s*["'`](.+?)["'`],?\s*$""", entry, re.M)]

    def voice_sample(self, kind: str, exclude: set[str]) -> str | None:
        for f in self._files():
            if f.stem != kind:
                continue
            src = f.read_text()
            for m in re.finditer(r"""["']?slug["']?\s*:\s*["']([^"']+)["']""", src):
                if m.group(1) in exclude:
                    continue
                try:
                    a, b = object_span(src, m.start())
                except ValueError:
                    continue
                e = src[a:b]
                if len(re.findall(r"""["']?heading["']?\s*:""", e)) >= 4:
                    return e
        return None

    # ---- writing -------------------------------------------------------------------------
    def _k(self, entry: str):
        json_keys = bool(re.search(r'^\s*"slug"\s*:', entry, re.M))
        return (lambda x: f'"{x}"') if json_keys else (lambda x: x)

    def _section_array(self, entry: str):
        for key in self.section_keys:
            m = re.search(r"""["']?""" + key + r"""["']?\s*:\s*\[""", entry)
            if m:
                a = m.end() - 1
                return a, match_bracket(entry, a)
        raise Unsupported("this page has no sections array (e.g. a calculator page)")

    def _section_obj(self, entry: str, heading: str, paras: list[str], sid: str | None, arr: str) -> str:
        k = self._k(entry)
        ind_m = re.search(r"\n(\s*)\{", arr)
        ind = ind_m.group(1) if ind_m else "    "
        if re.search(r"""["']?content["']?\s*:\s*\[""", arr) or (not re.search(r"""["']?(body|content)["']?\s*:""", arr)
                                                                  and "id" in arr):
            body = f",\n{ind}    ".join(json.dumps(p, ensure_ascii=False) for p in paras)
            sid = sid or re.sub(r"[^a-z0-9]+", "-", heading.lower()).strip("-")
            return (f"{{\n{ind}  {k('id')}: {json.dumps(sid)},\n"
                    f"{ind}  {k('heading')}: {json.dumps(heading, ensure_ascii=False)},\n"
                    f"{ind}  {k('content')}: [\n{ind}    {body}\n{ind}  ]\n{ind}}}")
        bkey = "content" if re.search(r"""["']?content["']?\s*:\s*["'`]""", arr) else "body"
        return (f"{{\n{ind}  {k('heading')}: {json.dumps(heading, ensure_ascii=False)},\n"
                f"{ind}  {k(bkey)}: {json.dumps(PARA_SEP.join(paras), ensure_ascii=False)}\n{ind}}}")

    def _find_section(self, arr: str, match: str):
        """(start, end) of the section object in arr whose id or heading == match, else None."""
        for pat in (r"""["']?id["']?\s*:\s*["']""" + re.escape(match) + r"""["']""",
                    r"""["']?heading["']?\s*:\s*["'`]""" + re.escape(match) + r"""["'`]"""):
            m = re.search(pat, arr, re.I)
            if m:
                s = _open_brace_before(arr, m.start())
                return s, match_bracket(arr, s)
        return None

    def _apply_ops(self, entry: str, ops: list[dict], today: str) -> tuple[str, list[str]]:
        notes = []
        for op in ops:
            kind = op["op"]
            if kind == "meta":
                for logical in ("title", "description"):
                    val = op.get(logical)
                    if not val:
                        continue
                    keys = [self.f[logical]] + (self.title_fallback if logical == "title" else [])
                    for field in keys:
                        pat = re.compile(r"""(["']?""" + re.escape(field) + r"""["']?\s*:\s*)""" + STR, re.S)
                        if pat.search(entry):
                            entry = pat.sub(lambda m: m.group(1) + json.dumps(val, ensure_ascii=False), entry, count=1)
                            notes.append(f"{field} -> {val[:80]}")
                            break
                    else:
                        notes.append(f"skipped {logical}: page has no {keys[0]} field")
            elif kind in ("insert_section", "replace_section"):
                a, b = self._section_array(entry)
                arr = entry[a:b]
                obj = self._section_obj(entry, op["heading"], op["paragraphs"], op.get("section_id"), arr)
                if kind == "replace_section":
                    hit = self._find_section(arr, op["match"])
                    if not hit:
                        raise ValueError(f"section {op['match']!r} not found to replace")
                    s, e = hit
                    arr = arr[:s] + obj + arr[e:]
                else:
                    if self._find_section(arr, op.get("section_id") or op["heading"]):
                        raise ValueError(f"section {op['heading']!r} already exists")
                    ind_m = re.search(r"\n(\s*)\{", arr)
                    ind = ind_m.group(1) if ind_m else "    "
                    hit = self._find_section(arr, op["before"]) if op.get("before") else None
                    if hit:
                        arr = arr[:hit[0]] + obj + ",\n" + ind + arr[hit[0]:]
                    else:
                        j = len(arr) - 2
                        while j > 0 and arr[j] in " \n\t,":
                            j -= 1
                        arr = arr[:j + 1] + ",\n" + ind + obj + arr[j + 1:]
                entry = entry[:a] + arr + entry[b:]
                notes.append(f"{'replaced' if kind == 'replace_section' else 'added'} section: {op['heading']}")
            elif kind == "replace":
                entry, done = apply_fact_edits(entry, [op])
                notes += done
            elif kind == "rewrite":
                entry = rebuild(entry, op["fields"], today)
                notes.append("rewrote keys: " + ", ".join(sorted(op["fields"])))
            else:
                raise ValueError(f"unknown op {kind}")
        up = self.f["updated"]
        entry, n = re.subn(r"""(["']?""" + re.escape(up) + r"""["']?\s*:\s*)(["'])\d{4}-\d{2}-\d{2}\2""",
                           lambda m: f"{m.group(1)}{m.group(2)}{today}{m.group(2)}", entry, count=1)
        if not n and self.updated_insert:
            k = self._k(entry)
            entry = re.sub(r"""(\n(\s*)["']?slug["']?\s*:\s*["'][^"']+["'],)""",
                           lambda m: f"{m.group(1)}\n{m.group(2)}{k(up)}: \"{today}\",", entry, count=1)
        return entry, notes

    def apply(self, page: Page, ops: list[dict], today: str, dry_run: bool = False, preview=None) -> Result:
        f, src, entry = self._entry(page)
        new_entry, notes = self._apply_ops(entry, ops, today)
        if src.count(entry) != 1:
            return Result(False, "entry text not unique in file")
        ok, msg = commit_or_preview(f, src, src.replace(entry, new_entry), dry_run, preview)
        return Result(ok, msg, [page.files[0]] if ok else [], notes)

    def restore(self, page: Page, base_sha: str, today: str) -> Result:
        rel = page.files[0]
        old_src = subprocess.run(["git", "show", f"{base_sha}:{rel}"], cwd=self.root, capture_output=True, text=True).stdout
        with tempfile.TemporaryDirectory() as td:
            tmp = Path(td) / Path(rel).name
            tmp.write_text(old_src)
            old = self._find(page.path, [tmp])
        f, src, cur = self._entry(page)
        if not old:
            return Result(False, "entry missing at base")
        ok, msg = commit_or_preview(f, src, src.replace(cur, old[3][old[1]:old[2]]), False)
        return Result(ok, msg, [rel] if ok else [], [f"restored to {base_sha}"])

    def validate(self, files: list[str]) -> tuple[bool, str]:
        r = subprocess.run(["node", str(_ENGINE / "syntax_check.mjs"), *files], cwd=self.root, capture_output=True, text=True)
        return r.returncode == 0, r.stdout.strip()[:300]


BACKEND = TsEntries
