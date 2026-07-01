#!/usr/bin/env python3
"""Step E: append surviving gap keywords to target-keywords.md.

Adds a Last-updated line near the top and a new section at the bottom
grouping the 57 surviving Lens-1 gap keywords by target page.
"""
from __future__ import annotations
import csv
import pathlib
from collections import defaultdict

CSV_PATH = pathlib.Path("reports/keyword-pass/2026-06-30.keywords.csv")
DOC = pathlib.Path("reports/seo-research/target-keywords.md")
TODAY = "2026-06-30"

def main():
    rows = list(csv.DictReader(CSV_PATH.open()))
    by_target: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        by_target[r["target_page_or_new_url"]].append(r)

    text = DOC.read_text()

    # Add Updated: line under the H1 if not already present
    lines = text.splitlines()
    if not any(ln.startswith("> _Updated:") for ln in lines[:6]):
        new_top = [
            lines[0],
            "",
            f"> _Updated: {TODAY} — keyword-gap-pass appended {len(rows)} new gap keywords (see bottom section)._",
            "",
        ] + lines[1:]
        text = "\n".join(new_top)
    else:
        # Replace existing line
        text = "\n".join(
            f"> _Updated: {TODAY} — keyword-gap-pass appended {len(rows)} new gap keywords (see bottom section)._"
            if ln.startswith("> _Updated:") else ln
            for ln in text.splitlines()
        )

    # Build the new appendix
    appendix = [
        "",
        "",
        f"## {TODAY} keyword-gap-pass — newly tracked gap keywords",
        "",
        f"SEMRUSH Lens-1 competitor-gap pass against 8 seed competitors. "
        f"{len(rows)} actionable keywords added (after dedup vs ours, tracked, "
        f"and shipped spokes; off-mission/branded/rates dropped silently).",
        "",
        "| keyword | action | target | tier | volume |",
        "|---|---|---|---|---|",
    ]
    # Sort by core-first then volume desc
    rows.sort(key=lambda r: (r["tier"] != "core", -int(r["volume"])))
    for r in rows:
        appendix.append(
            f"| {r['keyword']} | {r['action']} | `{r['target_page_or_new_url']}` "
            f"| {r['tier']} | {int(r['volume']):,} |"
        )

    DOC.write_text(text + "\n".join(appendix) + "\n")
    print(f"Appended {len(rows)} gap keywords to {DOC} "
          f"across {len(by_target)} target pages.")

if __name__ == "__main__":
    main()
