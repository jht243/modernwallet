"""Backend: pages live in JSON files — either one JSON file per page (`data/pages/*.json`,
`data/alternatives/*.json`) or multi-entry JSON arrays / `{ "pages": [...] }` stores
(`src/data/*.json`, `src/data/alternatives-daily.json`, `data/alternatives-daily.json`).

site.json "json" block (all optional):
  data_globs    ["src/data/*.json", "data/pages/*.json", "data/alternatives/*.json"]
  fields        {"title": "metaTitle", "title_fallback": ["title", "seoTitle"],
                 "description": "metaDescription", "description_fallback": ["description", "deck"],
                 "updated": "updatedDate"}
  section_keys  ["sections", "chooseSection"]

Surgical rules:
  - Always validates output with `json.loads` before writing.
  - Bumps visible updated date ONLY when `substantive(ops)` is True (never on meta-only edits).
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

DATE_KEYS = ("updatedDate", "updated", "dateModified", "lastUpdated")
SKIP_BASENAMES = {
    "entity-links.json", "search-aliases.json", "tested-methods.json",
    "testing-evidence.json", "testing-published-presentation.json",
    "alternatives-pages.json", "paid-placements.json", "pitched-domains.json",
    "placement-verticals.json", "roundup-vendors.json", "ia.json", "hubs.json",
    "amazon-picks.json", "amazonOverrides.json", "amazonResolved.json",
    "lastmod.json", "portraits.json", "election-results.json",
    "election-results-state.json", "election-results-statewide.json",
}


def _slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")


def _strip_md(s: str) -> str:
    s = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r"\1", s or "")
    return re.sub(r"\*\*(.+?)\*\*", r"\1", s)


class JsonEntries(Backend):
    def __init__(self, root: Path, cfg: dict):
        super().__init__(Path(root), cfg)
        j = cfg.get("json", {})
        self.globs = j.get("data_globs", [
            "src/data/*.json", "data/pages/*.json", "data/alternatives/*.json", "data/*daily*.json",
        ])
        f = j.get("fields", {})
        self.title_keys = [f.get("title", "metaTitle"), *f.get("title_fallback", ["title", "seoTitle"])]
        self.desc_keys = [f.get("description", "metaDescription"), *f.get("description_fallback", ["description", "deck", "summary"])]
        self.updated_key = f.get("updated", "updatedDate")
        self.updated_insert = j.get("updated_insert", False)
        self.section_keys = j.get("section_keys", ["sections"])

    def _files(self) -> list[Path]:
        seen, out = set(), []
        for g in self.globs:
            for p in sorted(self.root.glob(g)):
                if p.is_file() and p.name not in SKIP_BASENAMES and not p.name.endswith(".meta.json") and p not in seen:
                    seen.add(p)
                    out.append(p)
        return out

    @staticmethod
    def _iter_entries(data) -> list[tuple[list, dict]]:
        """Yields (json_path_tokens, entry_dict) for single-page dicts, top-level lists, or {'pages': [...]}."""
        if isinstance(data, dict):
            if isinstance(data.get("pages"), list):
                return [(["pages", idx], el) for idx, el in enumerate(data["pages"]) if isinstance(el, dict)]
            if any(k in data for k in ("slug", "title", "metaTitle", "h1", "sections")):
                return [([], data)]
        elif isinstance(data, list):
            return [([idx], el) for idx, el in enumerate(data) if isinstance(el, dict)]
        return []

    def _match_entry(self, f: Path, data, norm_p: str, segs: list[str], slug: str):
        for jpath, el in self._iter_entries(data):
            eslug = str(el.get("slug") or "").strip("/")
            ehub = str(el.get("hub") or el.get("category") or "").strip("/")
            eroute = "/" + str(el.get("route") or el.get("href") or "").strip("/") if (el.get("route") or el.get("href")) else ""
            if eroute and eroute == norm_p:
                return jpath, el
            if eslug and ("/" + eslug == norm_p):
                return jpath, el
            if eslug == slug and (not ehub or (segs and ehub == segs[0])):
                return jpath, el
            if not jpath and f.stem == slug:
                return jpath, el
        return None

    def _find(self, path: str):
        norm_p = "/" + path.strip("/")
        if norm_p == "/":
            return None
        segs = [s for s in norm_p.strip("/").split("/") if s]
        slug = segs[-1]
        for f in self._files():
            raw = f.read_text(encoding="utf-8", errors="ignore")
            if slug not in raw and slug not in f.name:
                continue
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                continue
            hit = self._match_entry(f, data, norm_p, segs, slug)
            if hit is not None:
                return f, raw, data, hit[0], hit[1]
        return None

    def locate(self, path: str) -> Page | None:
        hit = self._find(path)
        if not hit:
            return None
        f, raw, _, jpath, el = hit
        rel = f.relative_to(self.root).as_posix()
        norm_p = "/" + path.strip("/")
        slug = norm_p.rsplit("/", 1)[-1]
        title = next((str(el[k]) for k in [*self.title_keys, "h1", "title"] if el.get(k)), "")
        desc = next((str(el[k]) for k in [*self.desc_keys, "description"] if el.get(k)), "")
        kind = str(el.get("type") or el.get("pageType") or f.stem)
        return Page(
            path=norm_p,
            slug=slug,
            key=f"{rel}::{norm_p}",
            files=[rel],
            title=title,
            kind=kind,
            native=json.dumps(el, indent=2, ensure_ascii=False),
            extra={"description": desc, "jpath": jpath},
        )

    def text(self, page: Page) -> str:
        hit = self._find(page.path)
        if not hit:
            raise ValueError(f"entry {page.path} not found")
        el = hit[4]
        out = [f"# {el.get('h1') or el.get('title') or page.title}"]
        for k in ("subtitle", "deck", "lead", "summary"):
            if isinstance(el.get(k), str) and el[k].strip():
                out.append(el[k].strip())
        for k in ("intro", "introText"):
            v = el.get(k)
            if isinstance(v, str) and v.strip():
                out.append(v.strip())
            elif isinstance(v, list):
                out.extend(str(x).strip() for x in v if str(x).strip())
        if isinstance(el.get("chooseSection"), dict):
            cs = el["chooseSection"]
            if cs.get("heading"):
                out.append(f"## {cs['heading']}")
            b = cs.get("body") or cs.get("content") or cs.get("paragraphs")
            if isinstance(b, str):
                out.append(b)
            elif isinstance(b, list):
                out.extend(str(x) for x in b)
        for sk in self.section_keys:
            for s in el.get(sk) or []:
                if not isinstance(s, dict):
                    continue
                h = s.get("heading") or s.get("h2")
                if h:
                    out.append(f"## {h}")
                b = s.get("content") if "content" in s else s.get("body")
                if isinstance(b, str) and b.strip():
                    out.append(b.strip())
                elif isinstance(b, list):
                    out.extend(str(x).strip() for x in b if str(x).strip())
        for fk in ("faqs", "faq"):
            faqs = el.get(fk)
            if isinstance(faqs, list) and faqs:
                out.append("## Frequently Asked Questions")
                for q in faqs:
                    if isinstance(q, dict):
                        out.append(f"**Q: {q.get('question') or q.get('q') or ''}**\n{q.get('answer') or q.get('a') or ''}")
        return "\n\n".join(x for x in out if x).strip() + "\n"

    def headings(self, page: Page) -> list[dict]:
        hit = self._find(page.path)
        if not hit:
            return []
        el = hit[4]
        out = []
        for sk in self.section_keys:
            for s in el.get(sk) or []:
                if isinstance(s, dict) and (s.get("heading") or s.get("h2")):
                    h = s.get("heading") or s.get("h2")
                    out.append({"id": s.get("id"), "heading": h})
        return out

    def voice_sample(self, kind: str, exclude: set[str]) -> str | None:
        for f in self._files():
            try:
                data = json.loads(f.read_text(encoding="utf-8", errors="ignore"))
            except json.JSONDecodeError:
                continue
            for _, el in self._iter_entries(data):
                eslug = str(el.get("slug") or "").rsplit("/", 1)[-1]
                if eslug in exclude:
                    continue
                secs = el.get("sections") or []
                if isinstance(secs, list) and len(secs) >= 3:
                    return json.dumps(el, indent=2, ensure_ascii=False)
        return None

    def _build_section(self, el: dict, secs: list, heading: str, paras: list[str], sid: str | None, table: dict | None) -> dict:
        sample = next((s for s in secs if isinstance(s, dict)), {})
        h_key = "h2" if ("h2" in sample and "heading" not in sample) else "heading"
        if "content" in sample and isinstance(sample.get("content"), list):
            sec = {**({"id": sid or _slugify(heading)} if "id" in sample else {}), h_key: heading, "content": paras}
        elif "body" in sample and isinstance(sample.get("body"), str):
            sec = {**({"id": sid or _slugify(heading)} if "id" in sample else {}), h_key: heading, "body": "\n\n".join(paras)}
        elif "content" in sample and isinstance(sample.get("content"), str):
            sec = {**({"id": sid or _slugify(heading)} if "id" in sample else {}), h_key: heading, "content": "\n\n".join(paras)}
        else:
            sec = {**({"id": sid or _slugify(heading)} if "id" in sample else {}), h_key: heading, "body": paras}
        if table and table.get("headers") and table.get("rows") and any(isinstance(s, dict) and "table" in s for s in secs):
            t_sample = next(s["table"] for s in secs if isinstance(s, dict) and isinstance(s.get("table"), dict))
            if "columns" in t_sample:
                sec["table"] = {"columns": table["headers"], "rows": table["rows"]}
            else:
                sec["table"] = {"headers": table["headers"], "rows": table["rows"]}
        return sec

    @staticmethod
    def _replace_in_obj(obj, old: str, new: str) -> int:
        count = 0
        if isinstance(obj, dict):
            for k, v in obj.items():
                if k in ("slug", "id", "href", "route", "url", "officialUrl"):
                    continue
                if isinstance(v, str):
                    if old in v:
                        count += v.count(old)
                        obj[k] = v.replace(old, new)
                    elif _strip_md(old) != old and _strip_md(old) in v:
                        plain_old = _strip_md(old)
                        count += v.count(plain_old)
                        obj[k] = v.replace(plain_old, _strip_md(new))
                elif isinstance(v, (dict, list)):
                    count += JsonEntries._replace_in_obj(v, old, new)
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                if isinstance(v, str):
                    if old in v:
                        count += v.count(old)
                        obj[i] = v.replace(old, new)
                elif isinstance(v, (dict, list)):
                    count += JsonEntries._replace_in_obj(v, old, new)
        return count

    def apply(self, page: Page, ops: list[dict], today: str, dry_run: bool = False, preview: Path | None = None) -> Result:
        hit = self._find(page.path)
        if not hit:
            return Result(False, f"entry {page.path} not found")
        f, orig, data, jpath, el = hit
        notes: list[str] = []

        for op in ops:
            kind = op["op"]
            if kind == "meta":
                if op.get("title"):
                    t_key = next((k for k in self.title_keys if k in el), self.title_keys[-1])
                    el[t_key] = op["title"]
                    notes.append(f"{t_key} -> {op['title'][:80]}")
                if op.get("description"):
                    d_key = next((k for k in self.desc_keys if k in el), self.desc_keys[0])
                    el[d_key] = op["description"]
                    notes.append(f"{d_key} -> {op['description'][:80]}")
            elif kind in ("insert_section", "replace_section"):
                sk = next((k for k in self.section_keys if isinstance(el.get(k), list)), None)
                if not sk:
                    raise Unsupported("JSON entry has no sections array")
                secs = el[sk]
                sec_obj = self._build_section(el, secs, op["heading"], op["paragraphs"], op.get("section_id"), op.get("table"))
                if kind == "replace_section":
                    want = (op.get("match") or op["heading"]).strip().lower()
                    idx = next((i for i, s in enumerate(secs) if isinstance(s, dict) and (
                        str(s.get("id") or "").lower() == want or
                        str(s.get("heading") or s.get("h2") or "").strip().lower() == want
                    )), None)
                    if idx is None:
                        raise ValueError(f"section {want!r} not found to replace")
                    secs[idx] = sec_obj
                    notes.append(f"replaced section: {op['heading']}")
                else:
                    want = (op.get("section_id") or op["heading"]).strip().lower()
                    if any(isinstance(s, dict) and (
                        str(s.get("id") or "").lower() == want or
                        str(s.get("heading") or s.get("h2") or "").strip().lower() == op["heading"].strip().lower()
                    ) for s in secs):
                        raise ValueError(f"section {op['heading']!r} already exists")
                    before = (op.get("before") or "").strip().lower()
                    idx = next((i for i, s in enumerate(secs) if before and isinstance(s, dict) and (
                        str(s.get("id") or "").lower() == before or
                        str(s.get("heading") or s.get("h2") or "").strip().lower() == before
                    )), None)
                    if idx is not None:
                        secs.insert(idx, sec_obj)
                    else:
                        secs.append(sec_obj)
                    notes.append(f"added section: {op['heading']}")
            elif kind == "replace":
                probe = json.loads(json.dumps(el))
                c = self._replace_in_obj(probe, op["old"], op["new"])
                if c != 1:
                    raise ValueError(f"replace 'old' matched {c}x (need 1): {op['old'][:80]!r}")
                self._replace_in_obj(el, op["old"], op["new"])
                notes.append(f'replace: "{op["old"][:70]}" -> "{op["new"][:70]}"')
            else:
                raise Unsupported(f"json_entries does not support op {kind!r}")

        if substantive(ops):
            u_key = next((k for k in DATE_KEYS if k in el), self.updated_key if self.updated_insert else None)
            if u_key:
                el[u_key] = today

        ind = 4 if re.search(r"^\n?\{\n    \"", orig) else 2
        updated = json.dumps(data, indent=ind, ensure_ascii=False) + "\n"
        json.loads(updated)  # round-trip assert
        diff = "".join(difflib.unified_diff(orig.splitlines(True), updated.splitlines(True), fromfile=page.files[0], tofile=page.files[0]))
        if preview:
            preview.write_text(diff, encoding="utf-8")
        if dry_run:
            return Result(True, "dry-run ok", [page.files[0]], notes)
        f.write_text(updated, encoding="utf-8")
        return Result(True, "ok", [page.files[0]], notes)

    def restore(self, page: Page, base_sha: str, today: str) -> Result:
        rel = page.files[0]
        old_raw = subprocess.run(["git", "show", f"{base_sha}:{rel}"], cwd=self.root, capture_output=True, text=True).stdout
        if not old_raw:
            return Result(False, f"{rel} missing at {base_sha}")
        jpath = page.extra.get("jpath") or []
        f = self.root / rel
        cur_raw = f.read_text(encoding="utf-8")
        if not jpath:
            json.loads(old_raw)
            f.write_text(old_raw, encoding="utf-8")
            return Result(True, "ok", [rel], [f"restored {rel} to {base_sha}"])
        old_data = json.loads(old_raw)
        cur_data = json.loads(cur_raw)
        norm_p = page.path
        segs = [s for s in norm_p.strip("/").split("/") if s]
        old_hit = self._match_entry(f, old_data, norm_p, segs, page.slug)
        cur_hit = self._match_entry(f, cur_data, norm_p, segs, page.slug)
        if not old_hit or not cur_hit:
            return Result(False, "entry missing at base or current")
        target_container = cur_data["pages"] if cur_hit[0][0] == "pages" else cur_data
        target_container[cur_hit[0][-1]] = old_hit[1]
        ind = 4 if re.search(r"^\n?\{\n    \"", cur_raw) else 2
        updated = json.dumps(cur_data, indent=ind, ensure_ascii=False) + "\n"
        json.loads(updated)
        f.write_text(updated, encoding="utf-8")
        return Result(True, "ok", [rel], [f"restored {page.path} to {base_sha}"])

    def validate(self, files: list[str]) -> tuple[bool, str]:
        for rel in files:
            p = self.root / rel
            if p.suffix.lower() == ".json":
                try:
                    json.loads(p.read_text(encoding="utf-8"))
                except Exception as e:  # noqa: BLE001
                    return False, f"{rel}: {e}"
        return True, "json valid"


BACKEND = JsonEntries
