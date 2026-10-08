#!/usr/bin/env python3
"""Rung 1 of the remediation ladder (.claude/commands/_remediation-ladder.md) — FIX-IN-PLACE.

Auditors return, for every finding they can fix themselves, the exact offending text and its
replacement. This applies them verbatim — no writer round-trip, no regeneration, no full re-audit —
then syntax-checks and commits one `AUDIT FIX` commit per page. The 2026-10-04 run skipped this
rung: it regenerated whole sections on the first FAIL and reverted them on the second, losing 14 of
20 new sections to findings that were one-line fixes (a ChatGPT tell, an unlinked company, a stray
self-reference sentence).

Input: <packets>/<slug>/audit.json written by the auditor:
  {"slug", "sha", "round": N, "verdict": "PASS"|"FAIL",
   "mechanical": [{"old","new"}],            # Rung 0 — never counts as a rework
   "fixes":      [{"old","new","why"}],      # Rung 1 — applied here
   "rework":     ["<finding that needs new substance>"]}   # Rung 2 — back to the writer
Writes <packets>/<slug>/fixes-applied.json (with the audit round it applied, so a re-run never
applies the same round twice), <packets>/recheck.json (the auditor brief for the re-check: per
batch, the AUDIT FIX sha of every page), and prints which pages still need Rung 2 (rework.py).

Usage: scripts/rank_drop/apply_fixes.py --packets <P> --date <D> [--dry-run]
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
from siteconf import backend  # noqa: E402



def _engine() -> str:
    from siteconf import engine
    return engine()


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    ap.add_argument("--date", required=True)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args(argv)
    P = Path(a.packets).resolve()
    queue = {q["slug"]: q for q in json.load(open(P / "queue.json"))["queue"]}
    still_rework, done, recheck = [], [], {}
    batch_of = {}
    if (P / "audit-batches.json").exists():
        for b in json.load(open(P / "audit-batches.json")):
            for p in b["pages"]:
                batch_of[p["slug"]] = b["n"]
    for audit_f in sorted(P.glob("*/audit.json")):
        slug, d = audit_f.parent.name, audit_f.parent
        au = json.load(open(audit_f))
        # A PASS can still carry pairs: fact corrections on text the run did not write (page-1-2-no-clicks
        # audits facts on the whole page) or sentence fixes outside the run's diff. Skip only an empty PASS
        # (2026-10-07 first page-1-2 run: 18 fact/lint pairs on PASS pages were silently dropped).
        if au.get("verdict") == "PASS" and not (au.get("mechanical") or au.get("fixes")):
            continue
        rnd = au.get("round", 1)
        prev = json.load(open(d / "fixes-applied.json")) if (d / "fixes-applied.json").exists() else {}
        if prev.get("round") == rnd and prev.get("sha") == au.get("sha") and not a.dry_run:  # already applied
            if au.get("rework"):
                still_rework.append({"slug": slug, "rework": au["rework"]})
            continue
        edits = [e for e in au.get("mechanical", []) + au.get("fixes", []) if e.get("old") and "new" in e]
        notes = []
        if edits and slug in queue:
            item = queue[slug]
            try:
                B = backend()
                page = B.locate(item["path"])
                if not page:
                    raise ValueError("page not found by backend")
                res = B.apply(page, [{"op": "replace", "old": e["old"], "new": e["new"], "substantive": bool(e.get("source"))} for e in edits],
                              a.date, dry_run=a.dry_run, preview=d / "audit-fix.preview.diff")
                if not res.ok:
                    raise ValueError("backend: " + res.msg)
                notes = res.notes
                if not a.dry_run:
                    subprocess.run(["git", "add", *res.files, str(audit_f.relative_to(ROOT))], cwd=ROOT)
                    subprocess.run(["git", "commit", "-q", "-m",
                                    f"{_engine()} {a.date}: AUDIT FIX {item['path']}\n\n" + "\n".join(notes)],
                                   cwd=ROOT)
                    sha = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT,
                                         capture_output=True, text=True).stdout.strip()
                    recheck.setdefault(str(batch_of.get(slug, 0)), []).append(
                        {"slug": slug, "sha": sha, "next_round": rnd + 1})
                done.append({"slug": slug, "applied": len(notes)})
            except Exception as e:  # noqa: BLE001
                # a replacement that no longer matches is a reviewer error, not a reason to regenerate:
                # send it back to the SAME reviewer for a corrected pair (still Rung 1)
                done.append({"slug": slug, "error": str(e)[:300]})
                recheck.setdefault(str(batch_of.get(slug, 0)), []).append(
                    {"slug": slug, "sha": None, "next_round": rnd, "corrected_pair_needed": str(e)[:300]})
        (d / "fixes-applied.json").write_text(json.dumps({"round": rnd, "sha": au.get("sha"), "applied": notes}, indent=2))
        if au.get("rework"):
            still_rework.append({"slug": slug, "rework": au["rework"]})
    (P / "rung1.json").write_text(json.dumps({"fixed": done, "needs_rung2": still_rework}, indent=2))
    # MERGE with pending entries from an earlier pass: a second apply_fixes run must not drop a page
    # whose AUDIT FIX was never re-checked (2026-10-05: claude-pricing's fixes lost their re-check).
    # An entry stays pending until that page's audit.json reaches its next_round.
    if (P / "recheck.json").exists():
        for n_, items in json.load(open(P / "recheck.json")).items():
            for it in items:
                af = P / it["slug"] / "audit.json"
                rnd_now = json.load(open(af)).get("round", 1) if af.exists() else 0
                mine = {x["slug"] for x in recheck.get(n_, [])}
                if rnd_now < it["next_round"] and it["slug"] not in mine:
                    recheck.setdefault(n_, []).append(it)
    (P / "recheck.json").write_text(json.dumps(recheck, indent=1))
    for n, items in sorted(recheck.items()):
        print(f"RECHECK batch {n}: " + ", ".join(f"{i['slug']}@{i['sha']}" for i in items))
    print(f"OK rung1 pages={len(done)} needs_rung2={len(still_rework)}"
          + (" (DRY RUN)" if a.dry_run else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
