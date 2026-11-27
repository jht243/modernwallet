"""Backend: pages are Markdown / MDX files with YAML frontmatter (Astro / Next.js content collections).

site.json "md" block (all optional):
  content_globs  ["src/content/**/*.md", "src/content/**/*.mdx", "content/**/*.md", "content/**/*.mdx"]
  fields         {"title": "metaTitle", "title_fallback": ["title"],
                  "description": "description", "description_fallback": ["metaDescription", "deck", "dek"],
                  "updated": "updated"}
  updated_insert true   insert the updated field into frontmatter when substantive(ops) and missing

Surgical edit rules:
  - Frontmatter lines that are not touched stay byte-for-byte identical (never PyYAML-dump the block).
  - Body edits preserve existing prose, links, callouts, MDX components, and tables verbatim.
  - Visible updated date is bumped ONLY when substantive(ops) is True (never on meta-only or wording edits).
"""

from __future__ import annotations

import difflib
import json
import re
import subprocess
import sys
from pathlib import Path

from .base import Backend, Page, Result, Unsupported, substantive

_ENGINE = Path(__file__).resolve().parents[1]
if str(_ENGINE) not in sys.path:
    sys.path.insert(0, str(_ENGINE))
from entry_edit import commit_or_preview  # noqa: E402

FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.S)
FOOTER_H2 = re.compile(r"^(frequently asked questions|faq|sources|references|methodology|related)\b", re.I)
MD_LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")
DATE_KEYS = ("updatedDate", "updated", "lastUpdated", "dateModified")


def _slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")


def _unquote_yaml(val: str) -> str:
    v = val.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in ("'", '"'):
        if v[0] == '"':
            try:
                return json.loads(v)
            except Exception:  # noqa: BLE001
                return v[1:-1]
        return v[1:-1].replace("''", "'")
    return v


def _parse_fm(fm_text: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for line in fm_text.splitlines():
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.+?)\s*$", line)
        if m:
            out[m.group(1)] = _unquote_yaml(m.group(2))
    return out


def _set_fm_scalar(fm_text: str, key: str, value: str, insert_after: tuple[str, ...] = ("title", "slug")) -> tuple[str, bool]:
    """Replace `key: ...` in YAML frontmatter (handling single-line or indented folded/quoted continuation),
    or insert after `insert_after` when `insert_after` is non-empty. Returns (new_fm, changed)."""
    encoded = json.dumps(value, ensure_ascii=False)
    lines = fm_text.splitlines()
    for i, line in enumerate(lines):
        if re.match(r"^" + re.escape(key) + r"\s*:", line):
            end = i + 1
            raw_rhs = line.split(":", 1)[1].strip()
            if raw_rhs in ("", ">", "|", ">-", "|-"):
                while end < len(lines) and (lines[end].startswith("  ") or not lines[end].strip()):
                    end += 1
            lines[i:end] = [f"{key}: {encoded}"]
            return "\n".join(lines), True
    if not insert_after:
        return fm_text, False
    pos = len(lines)
    for anchor in insert_after:
        for i, line in enumerate(lines):
            if re.match(r"^" + re.escape(anchor) + r"\s*:", line):
                pos = i + 1
                break
        if pos != len(lines):
            break
    lines.insert(pos, f"{key}: {encoded}")
    return "\n".join(lines), True


def _strip_md_inline(t: str) -> str:
    s = MD_LINK.sub(r"\1", t)
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"\1", s)
    s = re.sub(r"`([^`]+)`", r"\1", s)
    return s


def _h2_spans(body: str) -> list[dict]:
    """List of top-level `## ` sections in Markdown body, ignoring fenced code blocks."""
    lines = body.splitlines(keepends=True)
    spans = []
    in_fence = False
    offset = 0
    for line in lines:
        stripped = line.lstrip()
        if stripped.startswith(("```", "~~~")):
            in_fence = not in_fence
        elif not in_fence and re.match(r"^##\s+\S", line):
            heading = re.sub(r"^##\s+", "", line).strip()
            spans.append({"start": offset, "line_end": offset + len(line), "heading": heading, "id": _slugify(heading)})
        offset += len(line)
    for idx, sp in enumerate(spans):
        sp["end"] = spans[idx + 1]["start"] if idx + 1 < len(spans) else len(body)
    return spans


def _render_md_section(heading: str, paras: list[str], table: dict | None = None) -> str:
    blocks = [f"## {heading}"]
    if paras:
        blocks.append(paras[0].strip())
    if table and table.get("headers") and table.get("rows"):
        headers = [str(h).replace("|", "/") for h in table["headers"]]
        sep = ["---" for _ in headers]
        t_lines = [
            "| " + " | ".join(headers) + " |",
            "| " + " | ".join(sep) + " |",
        ]
        for row in table["rows"]:
            cells = [str(c).replace("|", "/") for c in row]
            if len(cells) < len(headers):
                cells += [""] * (len(headers) - len(cells))
            t_lines.append("| " + " | ".join(cells[:len(headers)]) + " |")
        blocks.append("\n".join(t_lines))
    for p in (paras[1:] if paras else []):
        if p.strip():
            blocks.append(p.strip())
    return "\n\n".join(blocks) + "\n\n"


class MdFrontmatter(Backend):
    def __init__(self, root: Path, cfg: dict):
        super().__init__(Path(root), cfg)
        m = cfg.get("md", {})
        self.globs = m.get("content_globs", [
            "src/content/**/*.md", "src/content/**/*.mdx",
            "content/**/*.md", "content/**/*.mdx",
        ])
        f = m.get("fields", {})
        self.title_keys = [f.get("title", "metaTitle"), *f.get("title_fallback", ["title"])]
        self.desc_keys = [f.get("description", "metaDescription"), *f.get("description_fallback", ["description", "deck", "dek"])]
        self.updated_key = f.get("updated", "updated")
        self.updated_insert = m.get("updated_insert", True)
        self._files_cache: list[Path] | None = None

    def _files(self) -> list[Path]:
        if self._files_cache is None:
            seen = set()
            out = []
            for g in self.globs:
                for p in sorted(self.root.glob(g)):
                    if p.is_file() and not p.name.endswith(".meta.json") and p not in seen:
                        seen.add(p)
                        out.append(p)
            self._files_cache = out
        return self._files_cache

    @staticmethod
    def _split_doc(raw: str) -> tuple[str, str, str]:
        """Returns (fm_text, delimiter_block_fmt, body). Empty fm_text if no frontmatter."""
        m = FM_RE.match(raw)
        if not m:
            return "", "", raw
        nl = "\r\n" if "\r\n" in m.group(0)[:6] else "\n"
        return m.group(1), nl, raw[m.end():]

    def _candidate_score(self, f: Path, fm: dict[str, str], norm_p: str, segs: list[str], slug: str) -> int:
        """Higher score = better route match; 0 = not a match."""
        rel = f.relative_to(self.root).as_posix()
        for prefix in ("src/content/", "content/"):
            if rel.startswith(prefix):
                rel_sub = rel[len(prefix):]
                break
        else:
            rel_sub = rel
        no_ext = re.sub(r"\.mdx?$", "", rel_sub)
        if no_ext.endswith("/index"):
            no_ext = no_ext[:-len("/index")]
        fm_path = "/" + fm.get("path", "").strip("/") if fm.get("path") else ""
        fm_slug = fm.get("slug", "").strip("/")
        fm_hub = fm.get("hub", "").strip("/")
        stem = f.stem if f.stem != "index" else f.parent.name

        if fm_path and fm_path == norm_p:
            return 100
        if "/" + no_ext.strip("/") == norm_p:
            return 95
        if fm_slug and ("/" + fm_slug == norm_p or (len(segs) >= 2 and fm_hub == segs[0] and fm_slug == slug)):
            return 90
        if len(segs) >= 2 and fm_hub and fm_hub == segs[0] and stem == slug:
            return 85
        if stem == slug:
            # Avoid matching localized landings like `it--whiteElephant.md` unless slug matches full stem
            return 70
        return 0

    def locate(self, path: str) -> Page | None:
        norm_p = "/" + path.strip("/")
        if norm_p == "/":
            return None
        segs = [s for s in norm_p.strip("/").split("/") if s]
        slug = segs[-1]
        best: tuple[int, Path, str, dict[str, str]] | None = None
        for f in self._files():
            if slug not in f.name and slug not in f.parent.name:
                # fast check unless custom frontmatter path/slug might match
                raw_head = f.read_text(encoding="utf-8", errors="ignore")[:1500]
                if slug not in raw_head:
                    continue
            raw = f.read_text(encoding="utf-8", errors="ignore")
            fm_text, _, _ = self._split_doc(raw)
            fm = _parse_fm(fm_text) if fm_text else {}
            sc = self._candidate_score(f, fm, norm_p, segs, slug)
            if sc > 0 and (best is None or sc > best[0]):
                best = (sc, f, raw, fm)
        if best is None:
            return None
        _, f, raw, fm = best
        rel = f.relative_to(self.root).as_posix()
        title = next((fm[k] for k in [*self.title_keys, "h1", "title"] if fm.get(k)), "")
        desc = next((fm[k] for k in [*self.desc_keys, "description"] if fm.get(k)), "")
        kind = f.parent.name if f.stem != "index" else f.parent.parent.name
        return Page(
            path=norm_p,
            slug=slug,
            key=f"{rel}::{norm_p}",
            files=[rel],
            title=title,
            kind=kind or "guide",
            native=raw,
            extra={"description": desc, "frontmatter": fm},
        )

    def text(self, page: Page) -> str:
        raw = (self.root / page.files[0]).read_text(encoding="utf-8")
        fm_text, _, body = self._split_doc(raw)
        fm = _parse_fm(fm_text) if fm_text else {}
        h1 = fm.get("h1") or fm.get("title") or page.title
        out = [f"# {h1}"] if h1 else []
        for k in ("deck", "dek", "subtitle", "introText"):
            if fm.get(k):
                out.append(fm[k])
        out.append(body.strip())
        return "\n\n".join(x for x in out if x).strip() + "\n"

    def headings(self, page: Page) -> list[dict]:
        raw = (self.root / page.files[0]).read_text(encoding="utf-8")
        _, _, body = self._split_doc(raw)
        return [{"id": s["id"], "heading": s["heading"]} for s in _h2_spans(body)]

    def voice_sample(self, kind: str, exclude: set[str]) -> str | None:
        for f in self._files():
            k = f.parent.name if f.stem != "index" else f.parent.parent.name
            stem = f.stem if f.stem != "index" else f.parent.name
            if k != kind or stem in exclude:
                continue
            raw = f.read_text(encoding="utf-8", errors="ignore")
            _, _, body = self._split_doc(raw)
            if len(_h2_spans(body)) >= 4:
                return raw
        return None

    def _replace_body(self, body: str, old: str, new: str) -> tuple[str, str]:
        if body.count(old) == 1:
            return body.replace(old, new, 1), f'body: "{old[:70]}" -> "{new[:70]}"'
        # Match against reader-visible text inside single paragraphs / list items / table rows
        blocks = re.split(r"(\n\s*\n)", body)
        hits = []
        for idx, blk in enumerate(blocks):
            if not blk.strip() or blk.startswith("\n"):
                continue
            vis = " ".join(_strip_md_inline(blk).split())
            want = " ".join(_strip_md_inline(old).split())
            if want and want in vis:
                hits.append(idx)
        if len(hits) == 1:
            idx = hits[0]
            blk = blocks[idx]
            # Try sentence-level substring match if plain text appears directly
            norm_old = " ".join(old.split())
            for line_idx, ln in enumerate(blk.splitlines()):
                if norm_old in " ".join(ln.split()):
                    lines = blk.splitlines()
                    # preserve leading bullet if present
                    lead = re.match(r"^(\s*(?:[-*]|\d+\.)\s+)?", lines[line_idx]).group(0)
                    clean_ln = lines[line_idx][len(lead):]
                    if old in clean_ln:
                        lines[line_idx] = lead + clean_ln.replace(old, new, 1)
                        blocks[idx] = "\n".join(lines)
                        return "".join(blocks), f'body: "{old[:70]}" -> "{new[:70]}"'
            if "[" not in blk and "**" not in blk:
                blocks[idx] = " ".join(blk.split()).replace(" ".join(old.split()), new, 1)
                return "".join(blocks), f'body: "{old[:70]}" -> "{new[:70]}"'
        raise ValueError(f"replace 'old' must match exactly once in Markdown body: {old[:80]!r}")

    def apply(self, page: Page, ops: list[dict], today: str, dry_run: bool = False, preview: Path | None = None) -> Result:
        f = self.root / page.files[0]
        orig = f.read_text(encoding="utf-8")
        fm_text, nl, body = self._split_doc(orig)
        if not nl:
            return Result(False, "Markdown file has no YAML frontmatter")
        fm = _parse_fm(fm_text)
        notes: list[str] = []

        for op in ops:
            kind = op["op"]
            if kind == "meta":
                if op.get("title"):
                    # Prefer existing metaTitle, else if h1 exists update title, else update title
                    t_key = next((k for k in self.title_keys if k in fm), self.title_keys[-1])
                    fm_text, ok = _set_fm_scalar(fm_text, t_key, op["title"], insert_after=("title", "h1", "slug"))
                    if ok:
                        fm[t_key] = op["title"]
                        notes.append(f"{t_key} -> {op['title'][:80]}")
                if op.get("description"):
                    d_key = next((k for k in self.desc_keys if k in fm), "description")
                    fm_text, ok = _set_fm_scalar(fm_text, d_key, op["description"], insert_after=("metaTitle", "title", "h1", "deck", "dek"))
                    if ok:
                        fm[d_key] = op["description"]
                        notes.append(f"{d_key} -> {op['description'][:80]}")
            elif kind in ("insert_section", "replace_section"):
                spans = _h2_spans(body)
                sec_md = _render_md_section(op["heading"], op["paragraphs"], op.get("table"))
                if kind == "replace_section":
                    want = (op.get("match") or op["heading"]).strip().lower()
                    hit = next((s for s in spans if s["heading"].lower() == want or s["id"] == _slugify(want)), None)
                    if not hit:
                        raise ValueError(f"section {want!r} not found to replace")
                    body = body[:hit["start"]] + sec_md + body[hit["end"]:].lstrip("\n")
                    notes.append(f"replaced section: {op['heading']}")
                else:
                    sid = _slugify(op.get("section_id") or op["heading"])
                    if any(s["heading"].lower() == op["heading"].strip().lower() or s["id"] == sid for s in spans):
                        raise ValueError(f"section {op['heading']!r} already exists")
                    before = (op.get("before") or "").strip()
                    hit = next((s for s in spans if before and (s["heading"].lower() == before.lower() or s["id"] == _slugify(before))), None)
                    if hit is None and spans:
                        # If before was None, insert before FAQ/Sources footer or append at end
                        footer = next((s for s in spans if FOOTER_H2.match(s["heading"])), None)
                        hit = footer
                    if hit is not None:
                        prefix = body[:hit["start"]].rstrip("\n")
                        prefix = (prefix + "\n\n") if prefix else ""
                        body = prefix + sec_md + body[hit["start"]:].lstrip("\n")
                    else:
                        body = body.rstrip() + "\n\n" + sec_md
                    notes.append(f"added section: {op['heading']}")
            elif kind == "replace":
                body, note = self._replace_body(body, op["old"], op["new"])
                notes.append(note)
            else:
                raise Unsupported(f"md_frontmatter does not support op {kind!r}")

        if substantive(ops):
            u_key = next((k for k in DATE_KEYS if k in fm), self.updated_key)
            fm_text, _ = _set_fm_scalar(
                fm_text,
                u_key,
                today,
                insert_after=("pubDate", "publishedDate", "published", "date", "description") if self.updated_insert else (),
            )

        updated_doc = f"---{nl}{fm_text}{nl}---{nl}{body.lstrip(chr(13) + chr(10)) if not orig[FM_RE.match(orig).end():].startswith(nl) else nl + body.lstrip()}"
        # Preserve exact blank-line spacing after closing ---
        orig_after_fm = orig[FM_RE.match(orig).end():]
        lead_ws = re.match(r"^[\r\n]*", orig_after_fm).group(0) or nl
        updated_doc = f"---{nl}{fm_text}{nl}---{nl}{lead_ws}{body.lstrip()}"
        if not updated_doc.endswith("\n"):
            updated_doc += "\n"

        ok, msg = self._validate_doc(updated_doc)
        if not ok:
            return Result(False, msg)
        diff = "".join(difflib.unified_diff(orig.splitlines(True), updated_doc.splitlines(True), fromfile=page.files[0], tofile=page.files[0]))
        if preview:
            preview.write_text(diff, encoding="utf-8")
        if dry_run:
            return Result(True, "dry-run ok", [page.files[0]], notes)
        f.write_text(updated_doc, encoding="utf-8")
        return Result(True, "ok", [page.files[0]], notes)

    @staticmethod
    def _validate_doc(doc: str) -> tuple[bool, str]:
        m = FM_RE.match(doc)
        if not m:
            return False, "missing YAML frontmatter fence"
        fm = _parse_fm(m.group(1))
        if not (fm.get("title") or fm.get("metaTitle") or fm.get("h1") or fm.get("tool")):
            return False, "frontmatter missing title/metaTitle/h1"
        body = doc[m.end():].strip()
        if not body:
            return False, "markdown body is empty"
        return True, "ok"

    def restore(self, page: Page, base_sha: str, today: str) -> Result:
        rel = page.files[0]
        old_src = subprocess.run(["git", "show", f"{base_sha}:{rel}"], cwd=self.root, capture_output=True, text=True).stdout
        if not old_src:
            return Result(False, f"{rel} missing at {base_sha}")
        ok, msg = self._validate_doc(old_src)
        if not ok:
            return Result(False, msg)
        (self.root / rel).write_text(old_src, encoding="utf-8")
        return Result(True, "ok", [rel], [f"restored {rel} to {base_sha}"])

    def validate(self, files: list[str]) -> tuple[bool, str]:
        for rel in files:
            p = self.root / rel
            if p.suffix.lower() in (".md", ".mdx"):
                ok, msg = self._validate_doc(p.read_text(encoding="utf-8"))
                if not ok:
                    return False, f"{rel}: {msg}"
        return True, "markdown valid"


BACKEND = MdFrontmatter
