#!/usr/bin/env python3
"""Portable trend-pass Phase 3 — topic-agnostic Google Autocomplete expansion.

Same free suggest endpoint as the other trend-pass engines, with GENERIC
content-discovery modifier templates (not model- or law-specific), so it works on
any content site. For each trend seed term:

  "<s>", "<s> vs", "<s> for", "best <s>", "is <s>", "<s> review",
  "how to <s>", "<s> alternatives", "<s> guide"

Then a–z expansion on the top 2 seeds by suggestion yield.

Stdlib only; wraps the shared autocomplete-paa fetch(). ~0.35s between requests.

Usage:
  mine_trend_autocomplete.py --seed "term one" --seed "term two" \\
    --json reports/trend-pass/<date>.autocomplete.json
"""

import argparse
import json
import sys
import time
from pathlib import Path

# The autocomplete-paa tool is bundled in every SEO-enabled repo's .claude/tools.
_MINER_DIR = Path(__file__).resolve().parents[2] / ".claude" / "tools" / "autocomplete-paa"
sys.path.insert(0, str(_MINER_DIR))
from autocomplete import ALPHABET, fetch  # noqa: E402

MODIFIER_TEMPLATES = [
    "{s}",
    "{s} vs",
    "{s} for",
    "best {s}",
    "is {s}",
    "{s} review",
    "how to {s}",
    "{s} alternatives",
    "{s} guide",
]
SLEEP_SECONDS = 0.35


def mine_seed(seed: str, seen: dict) -> int:
    new = 0
    try:
        results = fetch(seed)
    except Exception as e:
        print(f"[warn] fetch failed for {seed!r}: {e}", file=sys.stderr)
        return 0
    for q in results:
        key = q.strip().lower()
        if key and key != seed.strip().lower() and key not in seen:
            seen[key] = {"query": q, "seed": seed}
            new += 1
    time.sleep(SLEEP_SECONDS)
    return new


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Topic-agnostic autocomplete mining.")
    ap.add_argument("--seed", action="append", required=True,
                    help="Trend seed term, repeatable.")
    ap.add_argument("--json")
    args = ap.parse_args(argv)

    seen: dict = {}
    seed_yield: dict = {}
    seeds = [t.format(s=s.strip()) for s in args.seed for t in MODIFIER_TEMPLATES]
    for seed in seeds:
        seed_yield[seed] = mine_seed(seed, seen)
        print(f"  {seed!r}: +{seed_yield[seed]}", file=sys.stderr)

    top2 = sorted(seed_yield, key=seed_yield.get, reverse=True)[:2]
    for seed in top2:
        if seed_yield[seed] == 0:
            continue
        added = 0
        for letter in ALPHABET:
            added += mine_seed(f"{seed} {letter}", seen)
        print(f"  a-z on {seed!r}: +{added}", file=sys.stderr)

    payload = {
        "seeds": args.seed,
        "seeds_mined": len(seed_yield),
        "zero_suggestion_seeds": sorted(s for s, n in seed_yield.items() if n == 0),
        "alphabet_expanded_seeds": top2,
        "suggestions": sorted(seen.values(), key=lambda r: (r["seed"], r["query"])),
    }
    if args.json:
        Path(args.json).parent.mkdir(parents=True, exist_ok=True)
        with open(args.json, "w") as f:
            json.dump(payload, f, indent=2)
        print(f"Wrote {len(seen)} suggestions to {args.json}", file=sys.stderr)
    else:
        json.dump(payload, sys.stdout, indent=2)
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
