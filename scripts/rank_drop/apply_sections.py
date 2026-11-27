#!/usr/bin/env python3
"""Splice every planned + generated fix into the data files — deterministically.

plan.json (written by the planner):
  {"slug", "lane": "REFRESH|DIFFERENTIATE|RECOVER|TECH|SNIPPET|RANK",
   "action": "add_section" | "meta_only" | "no-fix" | "flag-intent-shift" | "flag-merge",
   "section_id": "kebab-id", "insert_before": "<existing section id>" | null,
   "meta": {"metaTitle": "...", "metaDescription": "..."}   (optional, one-sentence edits),
   "reviewer_note": "Two crisp natural sentences for Publisher's Take / Editor's Note." (optional),
   "summary": "one sentence"}

Date honesty rule:
  - `substantive(ops)` in backends/base.py bumps the page's visible updated date ONLY when an
    `insert_section`, `replace_section`, `rewrite`, or verified `FACT FIX` ships — NEVER on
    `meta_only` or when only registering a `reviewer_note`.

ReviewerNote rule:
  - Registered via `.claude/tools/mindmap-tracks.py` into the site's ReviewerNote store
    (`src/utils/reviewerNotes.ts`, `src/data/reviewer-notes.ts`, `lib/reviewer-notes.ts`, or
    `src/reviewer_notes.py`) ONLY when `.claude/reviewer-voice-profile.json` exists in the repo
    (automatically skipped on the 4 physician-reviewed medical sites). Never writes inside `.claude/`.
  - Numbers are NOT required inside `reviewer_note`.
"""

import argparse
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
from backends.base import Unsupported  # noqa: E402

MEDICAL_NO_QUOTE_REPOS = {
    "longevitybenchmark", "medicalfrontier", "metabolic_journal", "psych_report",
}


def _engine() -> str:
    from siteconf import engine
    return engine()


def parse_draft(md: str) -> tuple[str, list[str], dict | None]:
    """Parse `section.md` into `(heading, paragraphs, optional_table_dict)`."""
    lines = [l.rstrip() for l in md.strip().splitlines()]
    if not lines or not lines[0].startswith("## "):
        raise ValueError("draft must start with one '## ' heading")
    heading = lines[0][3:].strip()
    paras, cur, table_lines = [], [], []
    for l in lines[1:]:
        stripped = l.strip()
        if stripped.startswith("|") and stripped.endswith("|"):
            if cur:
                paras.append(" ".join(cur))
                cur = []
            table_lines.append(stripped)
            continue
        if l.startswith(("#", "- ", "* ", "1. ")):
            raise ValueError(f"draft has non-paragraph markdown: {l[:40]!r}")
        if not stripped:
            if cur:
                paras.append(" ".join(cur))
                cur = []
        else:
            cur.append(stripped)
    if cur:
        paras.append(" ".join(cur))
    if not paras:
        raise ValueError("draft has no paragraphs")

    table = None
    if table_lines:
        parsed_rows = []
        for tl in table_lines:
            if re.match(r"^\|[\s|:-]+\|$", tl):
                continue
            parsed_rows.append([c.strip() for c in tl.strip("|").split("|")])
        if len(parsed_rows) >= 2:
            table = {"headers": parsed_rows[0], "rows": parsed_rows[1:]}
            # For backends that only store `paragraphs` (e.g., TS without table field, HTML/PG/Py),
            # keep a clean inline summary fallback available if needed, while native table backends
            # render `table` directly.
    return heading, paras, table


def _table_as_prose_or_html(paras: list[str], table: dict | None, backend_name: str) -> list[str]:
    """For HTML-capable backends (`py_registry`, `jinja_catalog`, `pg_rows`) without native `table` op handling,
    or leave `paras` intact when `md_frontmatter`/`ts_entries`/`json_entries` handle `op['table']` directly."""
    if not table or backend_name in ("md_frontmatter", "ts_entries", "json_entries"):
        return paras
    # Convert pipe rows into clean sentence lines so py_registry/jinja_catalog/pg_rows render every scenario fact
    headers = table.get("headers") or []
    t_sentences = []
    for row in table.get("rows") or []:
        pairs = [f"{headers[i]}: {row[i]}" for i in range(min(len(headers), len(row))) if row[i]]
        if pairs:
            s = "; ".join(pairs).rstrip(".") + "."
            t_sentences.append(s)
    if not t_sentences:
        return paras
    block = " ".join(t_sentences)
    return [paras[0], block, *paras[1:]]


def _register_reviewer_note_if_eligible(route: str, note_text: str, today: str, dry_run: bool) -> tuple[str | None, str | None]:
    """Validate and register `note_text` into the site's ReviewerNote store when eligible.
    Returns `(relative_store_file, note_msg)` or `(None, skip_or_warn_msg)`."""
    if not note_text or not note_text.strip():
        return None, None
    if ROOT.name in MEDICAL_NO_QUOTE_REPOS or not (ROOT / ".claude/reviewer-voice-profile.json").exists():
        return None, "skipped reviewer_note: quote-free / medical site"
    if re.search(r"dapper\s+labs", note_text, re.I):
        return None, "skipped reviewer_note: forbidden reference"
    mt_path = ROOT / ".claude/tools/mindmap-tracks.py"
    if not mt_path.exists():
        return None, "skipped reviewer_note: mindmap-tracks.py missing"
    spec = importlib.util.spec_from_file_location("_mm_tracks", mt_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    clean_note = note_text.replace("—", ", ").replace(" -- ", ", ").strip()
    lint_res = mod.lint_reviewer_note(clean_note, ROOT)
    if not lint_res.get("ok"):
        return None, f"skipped reviewer_note lint: {lint_res.get('issues')}"
    if dry_run:
        return None, "dry-run reviewer_note validated"
    reg = mod.register_reviewer_note(ROOT, route, clean_note, reviewed_date=today)
    if reg.get("ok") and reg.get("store_file"):
        rel = Path(reg["store_file"]).resolve().relative_to(ROOT.resolve()).as_posix()
        return rel, f"registered reviewer_note in {rel}"
    return None, f"skipped reviewer_note: {reg.get('reason') or 'not registered'}"


def sh(*cmd) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)


REWRITE_KEEP = ("slug", "publishedDate")


def _edit_one(item: dict, d: Path, kind: str, ops: list[dict], a, summary: str, extra_files: list[str] | None = None,
              extra_notes: list[str] | None = None) -> dict:
    """Apply ops to the page through the site's backend, preview or commit them as ONE commit."""
    from siteconf import backend
    B = backend()
    page = B.locate(item["path"])
    if not page:
        raise ValueError(f"page {item['path']} not found by the backend")
    res = B.apply(page, ops, a.date, dry_run=a.dry_run, preview=d / f"{kind.lower().replace(' ', '-')}.preview.diff")
    if not res.ok:
        raise ValueError("backend/validation failed: " + res.msg)
    all_files = list(dict.fromkeys([*res.files, *(extra_files or [])]))
    all_notes = [*(res.notes or []), *(extra_notes or [])]
    if res.notes and all(n.startswith("skipped") for n in res.notes) and not extra_files:
        return {"slug": item["slug"], "path": item["path"], "kind": kind, "status": "skipped-no-meta-fields",
                "notes": all_notes}
    commit = None
    if not (a.no_commit or a.dry_run):
        sh("git", "add", *all_files, str(d.relative_to(ROOT)))
        r = sh("git", "commit", "-q", "-m",
               f"{_engine()} {a.date}: {kind} {item['path']}\n\n{summary}\n" + "\n".join(all_notes) +
               "\n\nCo-Authored-By: Claude <noreply@anthropic.com>")
        if r.returncode:
            raise ValueError("commit failed: " + r.stderr[:200])
        commit = sh("git", "rev-parse", "--short", "HEAD").stdout.strip()
    return {"slug": item["slug"], "path": item["path"], "kind": kind, "status": "applied",
            "commit": commit, "notes": all_notes}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    ap.add_argument("--date", required=True)
    ap.add_argument("--no-commit", action="store_true")
    ap.add_argument("--rework", action="store_true",
                    help="Rung 2: only pages in rework.json; replace their existing section in place")
    ap.add_argument("--dry-run", action="store_true",
                    help="never write data files: syntax-check a temp copy, save <slug>/*.preview.diff")
    a = ap.parse_args(argv)
    from siteconf import site as _site_cfg
    bname = _site_cfg().get("backend", "")
    P = Path(a.packets).resolve()
    queue = json.load(open(P / "queue.json"))["queue"]
    if a.rework:
        todo = set(json.load(open(P / "rework.json")).get("regenerate", []))
        queue = [q for q in queue if q["slug"] in todo]
    results = []
    for item in queue:
        slug, d = item["slug"], P / item["slug"]
        # 1) sentence-level fact corrections — own commit (never re-applied on rework)
        fe = d / "fact-edits.json"
        if fe.exists() and not a.rework:
            edits = json.load(open(fe)).get("edits", [])
            if edits:
                try:
                    ops = [{"op": "replace", "old": e["old"], "new": e["new"], "substantive": True} for e in edits]
                    why = json.load(open(fe)).get("summary") or "Stale-price sentences rewritten from the price ledger."
                    src = "\n".join(f"source for \"{e['old'][:60]}\": {e['source']}" for e in edits if e.get("source"))
                    results.append(_edit_one(item, d, "FACT FIX", ops, a, why + ("\n" + src if src else "")))
                except Exception as e:  # noqa: BLE001
                    results.append({"slug": slug, "kind": "FACT FIX", "status": "error", "error": str(e)[:300]})
        # 2) the planned fix (L3 meta / L4 section / L5 rewrite + optional ReviewerNote) — own commit
        plan_f = d / "plan.json"
        if not plan_f.exists():
            continue
        plan = json.load(open(plan_f))
        act = plan.get("action")
        try:
            extra_files, extra_notes = [], []
            if act in ("add_section", "meta_only"):
                heading = paras = table = None
                if act == "add_section":
                    draft = d / "section.md"
                    if not draft.exists():
                        raise ValueError("section.md missing (generation failed)")
                    heading, raw_paras, table = parse_draft(draft.read_text())
                    paras = _table_as_prose_or_html(raw_paras, table, bname)
                    if re.search(r"dapper\s+labs", " ".join([heading, *paras]), re.I):
                        raise ValueError("REWORK: draft contains forbidden 'Dapper Labs' reference")
                    dx_f = d / "diagnosis.json"
                    dx_ev = (json.load(open(dx_f)).get("evidence") or {}) if dx_f.exists() else {}
                    if (dx_ev.get("internal_proof_gap") or {}).get("amazon_no_price") and "$" in " ".join([heading, *paras]):
                        raise ValueError("REWORK: Amazon hardware/gear page draft must not contain dollar prices ($); use specs only")
                    from diagnose import pricing, stale_prices
                    bad = [b for b in stale_prices(" ".join([heading] + paras), pricing(), paras)
                           if not b.get("ambiguous")]
                    if bad:
                        raise ValueError("REWORK: draft states a stale price: " +
                                         "; ".join(f"{b['model']} ${b['found'][0]:g}/${b['found'][1]:g}" for b in bad) +
                                         " — regenerate with the ledger price in a CORRECTIONS block")
                ops = []
                if heading is not None:
                    applied_f = d / "applied_section.json"
                    if a.rework:
                        prev = json.load(open(applied_f)) if applied_f.exists() else {}
                        ops.append({"op": "replace_section", "heading": heading, "paragraphs": paras,
                                    "table": table, "section_id": plan.get("section_id"),
                                    "match": prev.get("heading") or heading,
                                    "match_alt": plan.get("section_id")})
                    else:
                        ops.append({"op": "insert_section", "heading": heading, "paragraphs": paras,
                                    "table": table, "before": plan.get("insert_before"),
                                    "section_id": plan.get("section_id")})
                        if not a.dry_run:
                            applied_f.write_text(json.dumps({"heading": heading, "section_id": plan.get("section_id")}))
                meta = {} if a.rework else (plan.get("meta") or {})
                if meta.get("metaTitle") or meta.get("metaDescription"):
                    ops.append({"op": "meta", "title": meta.get("metaTitle"), "description": meta.get("metaDescription")})
                if not a.rework and plan.get("reviewer_note"):
                    rn_file, rn_msg = _register_reviewer_note_if_eligible(item["path"], plan["reviewer_note"], a.date, a.dry_run)
                    if rn_file:
                        extra_files.append(rn_file)
                    if rn_msg:
                        extra_notes.append(rn_msg)
                if not ops and not extra_files:
                    results.append({"slug": slug, "kind": act, "status": "nothing-to-apply"})
                    continue
                kind = "REWORK" if a.rework else plan.get("lane", "SECTION" if act == "add_section" else "METADATA")
            elif act == "rewrite":
                draft = d / "page.json"
                if not draft.exists():
                    raise ValueError("page.json missing (generation failed)")
                page = json.load(open(draft))
                if page.get("slug") not in (None, slug):
                    raise ValueError(f"draft slug {page.get('slug')!r} != {slug!r}")
                repl = {k: v for k, v in page.items() if k not in REWRITE_KEEP}
                ops = [{"op": "rewrite", "fields": repl}]
                kind = "REWORK" if a.rework else "REWRITE"
            else:
                results.append({"slug": slug, "kind": act, "status": act or "no-fix"})
                continue
            try:
                results.append(_edit_one(item, d, kind, ops, a, plan.get("summary", ""), extra_files=extra_files, extra_notes=extra_notes))
            except ValueError as e:
                alt = next((o.get("match_alt") for o in ops if o.get("op") == "replace_section"), None)
                if not alt or "backend" not in str(e):
                    raise
                for o in ops:
                    if o.get("op") == "replace_section":
                        o["match"] = alt
                results.append(_edit_one(item, d, kind, ops, a, plan.get("summary", ""), extra_files=extra_files, extra_notes=extra_notes))
        except Unsupported as e:
            results.append({"slug": slug, "path": item["path"], "kind": act, "status": "unsupported", "error": str(e)[:300]})
        except Exception as e:  # noqa: BLE001
            results.append({"slug": slug, "path": item["path"], "kind": act, "status": "error", "error": str(e)[:300]})
    (P / ("applied.rework.json" if a.rework else "applied.json")).write_text(json.dumps(results, indent=2))
    ok = sum(r["status"] == "applied" for r in results)
    print(f"OK applied={ok} other={len(results) - ok}" + (" (DRY RUN — no data files written)" if a.dry_run else "")
          + f" → {P / 'applied.json'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
