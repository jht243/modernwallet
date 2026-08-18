#!/usr/bin/env python3
"""Trend-pass Phase 3 — paid-tool keyword expansion (runs ALONGSIDE Autocomplete).

Given the run's seed set (trend entities ∪ uncovered coverage queries), pull
related/matching keywords with real search volume + difficulty, so Phase 3 can
surface NEW candidates the free autocomplete endpoint misses and attach a volume
signal to every candidate.

Expansion goes through the shared fallback ladder in scripts/lib/keyword_data.py:
SEMRUSH → Ahrefs → public-source estimate (Google Autocomplete). A dry or missing
key demotes the run one rung; it never empties the result and never blocks the
pass. Every keyword row carries the `source` + `confidence` it came from, so
Phase 4/5 can rank measured volume above estimated volume.

(The filename is kept for compatibility with the phase docs and trigger configs
that already reference it — the script is no longer SEMRUSH-only.)

Usage:
  scripts/trend_pass/semrush_trend_expand.py \\
    --seed "claude opus 5" --seed "opus 5 pricing" \\
    --json reports/trend-pass/<date>.semrush.json

Exit codes: always 0 (best-effort). The JSON `status` field says what happened.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))
from keyword_data import expand as ladder_expand, notes  # noqa: E402


def expand(seeds: list[str], database: str, per_seed: int) -> dict:
    keywords: dict[str, dict] = {}
    errors: list[str] = []
    for seed in seeds:
        seed = seed.strip()
        if not seed:
            continue
        try:
            rows = ladder_expand(seed, limit=per_seed, database=database)
        except Exception as e:  # the ladder is best-effort; never sink the run
            errors.append(f"{seed}: {e}")
            continue
        for r in rows:
            k = (r.get("keyword") or "").strip().lower()
            if not k:
                continue
            # keep the highest-volume observation of a duplicated keyword
            if k not in keywords or r.get("volume", 0) > keywords[k].get("volume", 0):
                keywords[k] = {**r, "seed": seed}
    ranked = sorted(keywords.values(), key=lambda r: r.get("volume", 0), reverse=True)
    return {"keywords": ranked, "errors": errors}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Trend-pass keyword expansion (best-effort).")
    ap.add_argument("--seed", action="append", default=[], help="Seed entity/query (repeatable).")
    ap.add_argument("--database", default="us")
    ap.add_argument("--per-seed", type=int, default=25, help="Max rows per seed.")
    ap.add_argument("--api-key", default=None,
                    help="Deprecated; keys are read from the environment by keyword_data.")
    ap.add_argument("--json", help="Write result to file instead of stdout.")
    args = ap.parse_args(argv)

    if not args.seed:
        result = {"status": "skipped", "reason": "no seeds provided", "keywords": [], "errors": []}
    else:
        r = expand(args.seed, args.database, args.per_seed)
        status = "ok" if r["keywords"] else ("error" if r["errors"] else "empty")
        sources = {}
        for k in r["keywords"]:
            sources[k.get("source", "?")] = sources.get(k.get("source", "?"), 0) + 1
        result = {"status": status, "seeds": args.seed, "database": args.database,
                  "sources": sources, "provider_notes": notes(), **r}

    if args.json:
        Path(args.json).parent.mkdir(parents=True, exist_ok=True)
        Path(args.json).write_text(json.dumps(result, indent=2))
        print(f"Keyword expansion: {result['status']} "
              f"({len(result['keywords'])} keywords, sources={result.get('sources', {})}) "
              f"→ {args.json}", file=sys.stderr)
    else:
        json.dump(result, sys.stdout, indent=2)
        sys.stdout.write("\n")
    return 0  # always succeed — best-effort


if __name__ == "__main__":
    sys.exit(main())
