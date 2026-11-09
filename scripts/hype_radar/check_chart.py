#!/usr/bin/env python3
"""Hard check: did the mindmap chart carry every angle from the hype tally?

The hype radar writes each candidate's angle tally into the day's pull JSON.
/mindmap-pass is told (via ANGLE_LENS.md) to record every angle in the chart's
`## What it's hyped for (angle tally)` block. This script verifies that in code,
so a tally that never reached the chart fails loudly instead of silently.

Rules:
  - A candidate WITH angles that the chart dropped entirely is fine, but its name
    must still appear somewhere in the chart (e.g. the exclusions paragraph).
  - A candidate that appears in the tally block must have EVERY one of its
    angles there, with the same count and a non-empty decision.

Usage:
  python3 scripts/hype_radar/check_chart.py --pull reports/hype-radar/<date>.json \\
      --chart reports/mindmap-pass/<chart>.md
Exit 0 = pass, 1 = fail (problems printed), 2 = bad input.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

BLOCK = "## What it's hyped for (angle tally)"


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip().strip("`*").lower())


def tally_rows(chart: str) -> list[dict]:
    i = chart.find(BLOCK)
    if i < 0:
        return []
    rows = []
    for line in chart[i + len(BLOCK):].splitlines()[1:]:
        if line.startswith("## "):
            break
        if not line.startswith("|") or re.match(r"^\|\s*-", line):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 6 or norm(cells[0]) == "entity":
            continue
        rows.append({"entity": norm(cells[0]), "angle": norm(cells[1]), "count": cells[2].strip(),
                     "decision": cells[5].strip() if len(cells) > 5 else ""})
    return rows


def check(pull: dict, chart: str) -> list[str]:
    problems: list[str] = []
    rows = tally_rows(chart)
    has_block = BLOCK in chart
    low_chart = chart.lower()
    for c in pull.get("candidates") or []:
        name, angles = c.get("label") or c["name"], c.get("angles") or []
        if not angles:
            continue
        # The chart may name the candidate by its full label, its key, or an alias.
        names = {norm(n) for n in [c["name"], c.get("label"), *(c.get("aliases") or [])] if n}
        mine = [r for r in rows if r["entity"] in names]
        if not mine:
            if not any(re.search(rf"\b{re.escape(n)}\b", low_chart) for n in names):
                problems.append(f"{name}: has an angle tally but the chart never mentions it "
                                f"(neither in the tally block nor as dropped/excluded)")
            continue
        for a in angles:
            hit = [r for r in mine if r["angle"] == norm(a["angle"])]
            if not hit:
                problems.append(f"{name}: angle '{a['angle']} x{a['count']}' missing from the tally block")
                continue
            r = hit[0]
            if re.sub(r"\D", "", r["count"]) != str(a["count"]):
                problems.append(f"{name}: angle '{a['angle']}' count is '{r['count']}' in the chart, "
                                f"{a['count']} in the tally")
            if not r["decision"] or r["decision"] in ("-", "—"):
                problems.append(f"{name}: angle '{a['angle']}' has no decision")
    if not has_block and any(c.get("angles") for c in pull.get("candidates") or []):
        problems.insert(0, f"chart has no '{BLOCK}' block")
    return problems


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pull", required=True, help="reports/hype-radar/<date>.json")
    ap.add_argument("--chart", required=True, help="the mindmap chart this run saved")
    a = ap.parse_args()
    try:
        pull = json.loads(Path(a.pull).read_text())
        chart = Path(a.chart).read_text()
    except Exception as e:  # noqa: BLE001
        print(f"check_chart: cannot read input: {e}", file=sys.stderr)
        return 2
    problems = check(pull, chart)
    if problems:
        print("ANGLE CHECK FAILED — fix the chart, then re-run this check:")
        for p in problems:
            print(f"  - {p}")
        return 1
    n = sum(len(c.get("angles") or []) for c in pull.get("candidates") or [])
    print(f"ANGLE CHECK PASSED — {n} angle(s) accounted for in {a.chart}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
