#!/usr/bin/env python3
"""Mine Google Autocomplete for zero-volume / long-tail keyword discovery.

Hits Google's public suggestqueries.google.com endpoint — no API key, no cost.
Returns the live list of completions Google would surface in the search box for
any seed. This is the source Steve Toth recommends for zero-tool-latency demand
signals (tip #3 in his SEO playbook).

Three modes:
  --mode simple    one query                  (1 call,  ~10 results)
  --mode questions question-prefix variants   (10 calls, ~80 results)
  --mode alphabet  seed + each letter a-z     (26 calls, ~200 results)
  --mode all       questions + alphabet       (36 calls, dedup, ~250 results)

Usage:
  autocomplete.py --seed "ai compliance"            # simple, JSON to stdout
  autocomplete.py --seed "ai compliance" --mode all # full mining
  autocomplete.py --seed "ai compliance" --mode all --csv out.csv

  # Bulk: one seed per line from stdin
  echo -e "ai compliance\\nai for lawyers" | autocomplete.py --stdin --mode questions --csv out.csv

  # PER-PROJECT inventory: append every new suggestion to the project's target-keyword doc
  # (deduped against everything already tracked in that file — primary, supporting, prior log).
  # Pass the project-specific path explicitly. This is per-project; nothing global.
  autocomplete.py --seed "ai compliance" --mode all \\
    --inventory /path/to/this/projects/target-keyword-inventory.md

Output JSON shape:
  {
    "seed": "ai compliance",
    "mode": "all",
    "suggestions": [
      {"query": "ai compliance certification", "via": "alphabet:c"},
      {"query": "what ai compliance means",   "via": "question:what"},
      ...
    ]
  }
"""

import argparse
import csv as csvmod
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import date


ENDPOINT = "https://suggestqueries.google.com/complete/search"
QUESTION_PREFIXES = [
    "what", "how", "why", "is", "does", "can", "should",
    "when", "where", "which",
]
ALPHABET = "abcdefghijklmnopqrstuvwxyz"
SLEEP_SECONDS = 0.20  # be polite; Google tolerates this rate from a single host


def fetch(query: str, hl: str = "en", gl: str = "us") -> list[str]:
    """Return Google's autocomplete suggestions for a single query string."""
    params = {"client": "firefox", "q": query, "hl": hl, "gl": gl}
    url = f"{ENDPOINT}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as r:
        raw = r.read().decode("utf-8", errors="replace")
    data = json.loads(raw)
    return list(data[1]) if isinstance(data, list) and len(data) >= 2 else []


def mine(seed: str, mode: str, hl: str, gl: str) -> list[dict]:
    """Mine autocomplete for one seed in the requested mode. De-duped."""
    seen: dict[str, str] = {}

    def record(q: str, via: str):
        if not q or q.strip().lower() == seed.strip().lower():
            return
        key = q.strip().lower()
        if key not in seen:
            seen[key] = via

    if mode in ("simple", "questions", "all"):
        if mode == "simple":
            queries = [(seed, "simple")]
        else:
            queries = [(f"{p} {seed}", f"question:{p}") for p in QUESTION_PREFIXES]
            if mode == "simple":
                queries.insert(0, (seed, "simple"))
        for q, via in queries:
            for sugg in fetch(q, hl=hl, gl=gl):
                record(sugg, via)
            time.sleep(SLEEP_SECONDS)

    if mode in ("alphabet", "all"):
        for letter in ALPHABET:
            for sugg in fetch(f"{seed} {letter}", hl=hl, gl=gl):
                record(sugg, f"alphabet:{letter}")
            time.sleep(SLEEP_SECONDS)

    return [{"query": q, "via": v} for q, v in seen.items()]


LOG_HEADER = "## Autocomplete Discovery Log"
LOG_TABLE_HEADER = (
    "| Suggestion | Seed | Via | Captured |\n"
    "|---|---|---|---|"
)
LOG_PREAMBLE = (
    "_Auto-appended by `~/.claude/tools/autocomplete-paa/autocomplete.py`. "
    "Each row is a live Google Autocomplete suggestion captured for a project seed. "
    "Promote rows into the main inventory tables above when classified into a page._"
)


def _existing_keywords(content: str) -> set[str]:
    """Lowercase set of every keyword already mentioned in any table cell of the
    inventory file. Conservative: counts cells in any Markdown table, splits on
    semicolons (the inventory's supporting-keywords format), strips boilerplate."""
    existing: set[str] = set()
    for line in content.splitlines():
        if "|" not in line:
            continue
        cells = [c.strip() for c in line.split("|")]
        for cell in cells:
            if not cell or cell.startswith("-") or cell.startswith(":"):
                continue
            for kw in cell.split(";"):
                kw = kw.strip().lower()
                # filter out header labels and obvious non-keywords
                if kw and not kw.startswith(("target url", "primary keyword",
                                             "supporting keywords", "suggestion",
                                             "seed", "via", "captured")):
                    existing.add(kw)
    return existing


def append_to_inventory(path: str, results: list[dict]) -> tuple[int, int]:
    """Append every new (deduped) suggestion to the project's target-keyword
    inventory under a '## Autocomplete Discovery Log' section. Per-project:
    only writes to the path passed in. Returns (added, skipped_dupes)."""
    if not os.path.isfile(path):
        raise FileNotFoundError(
            f"--inventory {path} does not exist. Pass the project's target-keyword "
            "doc path (e.g. target-keyword-inventory.md at the repo root)."
        )

    with open(path) as f:
        content = f.read()

    existing = _existing_keywords(content)
    today = date.today().isoformat()

    new_rows: list[str] = []
    total = 0
    for r in results:
        for s in r["suggestions"]:
            total += 1
            key = s["query"].strip().lower()
            if key in existing:
                continue
            existing.add(key)
            # escape pipes inside cell contents to keep table valid
            q = s["query"].replace("|", "\\|")
            seed = r["seed"].replace("|", "\\|")
            via = s["via"].replace("|", "\\|")
            new_rows.append(f"| {q} | {seed} | {via} | {today} |")

    added = len(new_rows)
    skipped = total - added

    if added == 0:
        return 0, skipped

    if LOG_HEADER in content:
        # Append rows at the end of the existing log section.
        lines = content.split("\n")
        try:
            start = next(i for i, ln in enumerate(lines) if ln.strip() == LOG_HEADER)
        except StopIteration:
            start = len(lines)
        end = len(lines)
        for j in range(start + 1, len(lines)):
            if lines[j].startswith("## ") and lines[j].strip() != LOG_HEADER:
                end = j
                break
        # trim trailing blank lines so insertion stays tight
        while end > start + 1 and not lines[end - 1].strip():
            end -= 1
        new_lines = lines[:end] + new_rows + [""] + lines[end:]
        content = "\n".join(new_lines)
    else:
        # Create the section at the end of the file.
        content = (
            content.rstrip()
            + "\n\n"
            + LOG_HEADER
            + "\n\n"
            + LOG_PREAMBLE
            + "\n\n"
            + LOG_TABLE_HEADER
            + "\n"
            + "\n".join(new_rows)
            + "\n"
        )

    with open(path, "w") as f:
        f.write(content)

    return added, skipped


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        description="Mine Google Autocomplete for zero-volume keyword discovery."
    )
    ap.add_argument("--seed", help="One seed phrase to mine.")
    ap.add_argument("--stdin", action="store_true",
                    help="Read one seed per line from stdin (overrides --seed).")
    ap.add_argument("--mode", choices=["simple", "questions", "alphabet", "all"],
                    default="simple")
    ap.add_argument("--hl", default="en", help="Search language (default: en).")
    ap.add_argument("--gl", default="us", help="Search country (default: us).")
    ap.add_argument("--csv", help="Write results to CSV file instead of JSON stdout.")
    ap.add_argument("--inventory",
                    help="Path to THIS project's target-keyword inventory Markdown "
                         "(e.g. ./target-keyword-inventory.md). Every new suggestion "
                         "is deduped against everything already in that file and "
                         "appended under a '## Autocomplete Discovery Log' section. "
                         "Per-project — pass the project's own doc; never global.")
    args = ap.parse_args(argv)

    if not args.seed and not args.stdin:
        ap.error("--seed or --stdin required")

    seeds = [s.strip() for s in sys.stdin if s.strip()] if args.stdin else [args.seed]

    results = []
    for seed in seeds:
        try:
            suggs = mine(seed, args.mode, args.hl, args.gl)
        except Exception as e:
            print(f"[warn] {seed}: {e}", file=sys.stderr)
            suggs = []
        results.append({"seed": seed, "mode": args.mode, "suggestions": suggs})

    if args.csv:
        with open(args.csv, "w", newline="") as f:
            w = csvmod.writer(f)
            w.writerow(["seed", "suggestion", "via"])
            for r in results:
                for s in r["suggestions"]:
                    w.writerow([r["seed"], s["query"], s["via"]])
        total = sum(len(r["suggestions"]) for r in results)
        print(f"Wrote {total} suggestions across {len(results)} seed(s) to {args.csv}",
              file=sys.stderr)
    else:
        json.dump(results[0] if len(results) == 1 else results, sys.stdout, indent=2)
        sys.stdout.write("\n")

    if args.inventory:
        added, skipped = append_to_inventory(args.inventory, results)
        print(
            f"Appended {added} new suggestion(s) to {args.inventory} "
            f"(skipped {skipped} already tracked).",
            file=sys.stderr,
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
