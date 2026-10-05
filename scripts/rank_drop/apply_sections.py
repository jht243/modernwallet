#!/usr/bin/env python3
"""Splice every planned + generated fix into the data files — deterministically.

The first live run had an LLM hand-splice each section with ad-hoc Python, then
fix its own splice (it added a `bullets:` key the renderer shows out of order).
Here the splice is code: one plan.json (from the planner) + one section.md
(from content_gen) per page → inserted as a new {id, heading, content[]} object
into the page's own `sections` (or `buyingGuide`) array, `updatedDate` bumped,
optional metaTitle/metaDescription replaced, syntax-checked, and committed as
ONE commit per page so any page can be audited or reverted on its own.

plan.json (written by the planner):
  {"slug", "lane": "REFRESH|DIFFERENTIATE|RECOVER|TECH",
   "action": "add_section" | "meta_only" | "no-fix" | "flag-intent-shift" | "flag-merge",
   "section_id": "kebab-id", "insert_before": "<existing section id>" | null,
   "meta": {"metaTitle": "...", "metaDescription": "..."}   (optional, one-sentence edits),
   "summary": "one sentence"}

Usage: scripts/rank_drop/apply_sections.py --packets reports/rank-drop/<date>/packets --date <date>
       ... --rework     Rung 2: only the pages in <packets>/rework.json (from rework.py); a section
                        whose id is already on the page is REPLACED in place (heading + content),
                        not added twice, and the commit kind is REWORK.
Writes <packets>/applied.json (applied.rework.json with --rework): [{slug, status, commit, error}]
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
from backends.base import Unsupported  # noqa: E402

ARRAY_KEYS = ("sections", "buyingGuide")
SKIPPED_META: list[str] = []
STR = r"""(?P<q>["'])(?:\\.|(?!(?P=q)).)*(?P=q)"""


def match_bracket(s: str, i: int) -> int:
    """Index just past the bracket matching s[i] ('[' or '{'), string-aware."""
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


def parse_draft(md: str) -> tuple[str, list[str]]:
    lines = [l.rstrip() for l in md.strip().splitlines()]
    if not lines or not lines[0].startswith("## "):
        raise ValueError("draft must start with one '## ' heading")
    heading = lines[0][3:].strip()
    paras, cur = [], []
    for l in lines[1:]:
        if l.startswith(("#", "|", "- ", "* ", "1. ")):
            raise ValueError(f"draft has non-paragraph markdown: {l[:40]!r}")
        if not l.strip():
            if cur:
                paras.append(" ".join(cur))
                cur = []
        else:
            cur.append(l.strip())
    if cur:
        paras.append(" ".join(cur))
    if not paras:
        raise ValueError("draft has no paragraphs")
    return heading, paras


def splice(entry: str, plan: dict, heading: str | None, paras: list[str] | None, today: str,
           replace: bool = False) -> str:
    json_keys = bool(re.search(r'^\s*"slug"\s*:', entry, re.M))
    k = (lambda x: f'"{x}"') if json_keys else (lambda x: x)

    if heading is not None:
        m = None
        for key in ARRAY_KEYS:
            m = re.search(r"""["']?""" + key + r"""["']?\s*:\s*\[""", entry)
            if m:
                break
        if not m:
            raise ValueError("no sections/buyingGuide array in entry")
        a = m.end() - 1
        b = match_bracket(entry, a)                     # just past ']'
        arr = entry[a:b]
        ind_m = re.search(r"\n(\s*)\{", arr)
        ind = ind_m.group(1) if ind_m else "    "
        sid = plan.get("section_id") or re.sub(r"[^a-z0-9]+", "-", heading.lower()).strip("-")
        body = f",\n{ind}    ".join(json.dumps(p, ensure_ascii=False) for p in paras)
        obj = (f"{{\n{ind}  {k('id')}: {json.dumps(sid)},\n"
               f"{ind}  {k('heading')}: {json.dumps(heading, ensure_ascii=False)},\n"
               f"{ind}  {k('content')}: [\n{ind}    {body}\n{ind}  ]\n{ind}}}")
        have = re.search(r"""["']?id["']?\s*:\s*["']""" + re.escape(sid) + r"""["']""", arr)
        if have and not replace:
            raise ValueError(f"section id {sid!r} already exists")
        before = None if have else plan.get("insert_before")
        pos = None
        if have:                                         # Rung 2: swap the old object for the new one
            depth, j = 0, have.start()
            while j > 0:
                j -= 1
                if arr[j] == "}":
                    depth += 1
                elif arr[j] == "{":
                    if depth == 0:
                        break
                    depth -= 1
            start = a + j
            end = match_bracket(entry, start)
            entry = entry[:start] + obj + entry[end:]
            pos = start
        if before:
            mm = re.search(r"""["']?id["']?\s*:\s*["']""" + re.escape(before) + r"""["']""", arr)
            if mm:
                # walk back to the '{' that opens that element
                depth, j = 0, mm.start()
                while j > 0:
                    j -= 1
                    if arr[j] == "}":
                        depth += 1
                    elif arr[j] == "{":
                        if depth == 0:
                            break
                        depth -= 1
                pos = a + j
                entry = entry[:pos] + obj + ",\n" + ind + entry[pos:]
        if pos is None and not have:                     # append after the last element
            close = b - 1
            j = close - 1
            while j > a and entry[j] in " \n\t,":
                j -= 1
            entry = entry[:j + 1] + ",\n" + ind + obj + entry[j + 1:]

    for field, val in (plan.get("meta") or {}).items():
        if field not in ("metaTitle", "metaDescription", "h1", "subtitle") or not val:
            continue
        pat = re.compile(r"""(["']?""" + field + r"""["']?\s*:\s*)""" + STR)
        if not pat.search(entry):
            # some collections (gear deep-dives) carry no metaTitle/metaDescription: skip the field,
            # never error (2026-10-05 a meta_only plan errored and the run renamed plan.json by hand)
            SKIPPED_META.append(field)
            continue
        entry = pat.sub(lambda m: m.group(1) + json.dumps(val, ensure_ascii=False), entry, count=1)

    entry, n = re.subn(r"""(["']?updatedDate["']?\s*:\s*)(["'])\d{4}-\d{2}-\d{2}\2""",
                       lambda m: f"{m.group(1)}{m.group(2)}{today}{m.group(2)}", entry, count=1)
    return entry


def sh(*cmd) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)


REWRITE_KEEP = ("slug", "publishedDate")      # never taken from a generated draft


def _edit_one(item: dict, d: Path, kind: str, ops: list[dict], a, summary: str) -> dict:
    """Apply ops to the page through the site's backend, preview or commit them as ONE commit."""
    from siteconf import backend
    B = backend()
    page = B.locate(item["path"])
    if not page:
        raise ValueError(f"page {item['path']} not found by the backend")
    res = B.apply(page, ops, a.date, dry_run=a.dry_run, preview=d / f"{kind.lower().replace(' ', '-')}.preview.diff")
    if not res.ok:
        raise ValueError("backend/validation failed: " + res.msg)
    if res.notes and all(n.startswith("skipped") for n in res.notes):
        return {"slug": item["slug"], "path": item["path"], "kind": kind, "status": "skipped-no-meta-fields",
                "notes": res.notes}
    commit = None
    if not (a.no_commit or a.dry_run):
        sh("git", "add", *res.files, str(d.relative_to(ROOT)))
        r = sh("git", "commit", "-q", "-m",
               f"rank-drop-recovery {a.date}: {kind} {item['path']}\n\n{summary}\n" + "\n".join(res.notes) +
               "\n\nCo-Authored-By: Claude <noreply@anthropic.com>")
        if r.returncode:
            raise ValueError("commit failed: " + r.stderr[:200])
        commit = sh("git", "rev-parse", "--short", "HEAD").stdout.strip()
    return {"slug": item["slug"], "path": item["path"], "kind": kind, "status": "applied",
            "commit": commit, "notes": res.notes}


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
    P = Path(a.packets).resolve()
    queue = json.load(open(P / "queue.json"))["queue"]
    if a.rework:
        todo = set(json.load(open(P / "rework.json")).get("regenerate", []))
        queue = [q for q in queue if q["slug"] in todo]
    results = []
    for item in queue:
        slug, d = item["slug"], P / item["slug"]
        # 1) sentence-level fact corrections (from FACT_FIX_TASK) — own commit (never re-applied on rework)
        fe = d / "fact-edits.json"
        if fe.exists() and not a.rework:
            edits = json.load(open(fe)).get("edits", [])
            if edits:
                try:
                    results.append(_edit_one(item, d, "FACT FIX", [{"op": "replace", **e} for e in edits], a,
                                             "Stale-price sentences rewritten from the price ledger."))
                except Exception as e:  # noqa: BLE001
                    results.append({"slug": slug, "kind": "FACT FIX", "status": "error", "error": str(e)[:300]})
        # 2) the planned fix (L3 meta / L4 section / L5 rewrite) — own commit
        plan_f = d / "plan.json"
        if not plan_f.exists():
            continue
        plan = json.load(open(plan_f))
        act = plan.get("action")
        try:
            if act in ("add_section", "meta_only"):
                heading = paras = None
                if act == "add_section":
                    draft = d / "section.md"
                    if not draft.exists():
                        raise ValueError("section.md missing (generation failed)")
                    heading, paras = parse_draft(draft.read_text())
                    # Rung 0 guard: a draft may not state a price that disagrees with data/pricing.ts
                    # (the 10-04 run's gpt-5-6-pricing section copied the page's stale $5/$30).
                    from diagnose import pricing, stale_prices
                    # only prices pinned to ONE model: an ambiguous attribution ("Sonnet 5.5 … Opus 5.5 at
                    # $4") is not evidence of a stale price, and rejecting it burned claude-pricing's
                    # rework cap on 2026-10-05 with a correct draft. The auditor checks every price anyway.
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
                        # match by the heading as applied (every backend has headings; only TS sites have
                        # ids); apply_sections retries with the section id if an audit fix retitled it
                        ops.append({"op": "replace_section", "heading": heading, "paragraphs": paras,
                                    "section_id": plan.get("section_id"),
                                    "match": prev.get("heading") or heading,
                                    "match_alt": plan.get("section_id")})
                    else:
                        ops.append({"op": "insert_section", "heading": heading, "paragraphs": paras,
                                    "before": plan.get("insert_before"), "section_id": plan.get("section_id")})
                        if not a.dry_run:
                            applied_f.write_text(json.dumps({"heading": heading, "section_id": plan.get("section_id")}))
                # on rework the meta was already applied (and may carry Rung 1 audit fixes): never re-apply it
                meta = {} if a.rework else (plan.get("meta") or {})
                if meta.get("metaTitle") or meta.get("metaDescription"):
                    ops.append({"op": "meta", "title": meta.get("metaTitle"), "description": meta.get("metaDescription")})
                if not ops:
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
                results.append(_edit_one(item, d, kind, ops, a, plan.get("summary", "")))
            except ValueError as e:
                alt = next((o.get("match_alt") for o in ops if o.get("op") == "replace_section"), None)
                if not alt or "backend" not in str(e):
                    raise
                for o in ops:
                    if o.get("op") == "replace_section":
                        o["match"] = alt
                results.append(_edit_one(item, d, kind, ops, a, plan.get("summary", "")))
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
