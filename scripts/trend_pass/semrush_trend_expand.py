#!/usr/bin/env python3
"""Trend-pass Phase 3 — SEMrush expansion (runs ALONGSIDE Google Autocomplete).

Given the run's seed set (trend entities ∪ uncovered coverage queries), pull
related/broad-match keywords from SEMrush with real search volume + difficulty,
so Phase 3 can surface NEW candidates the free autocomplete endpoint misses and
attach a volume signal to every candidate.

This is BEST-EFFORT by design: if the key is missing or SEMrush errors, the
script exits 0 with an empty result and a note on stderr — the trend-pass run
must never be blocked by SEMrush. Autocomplete remains the always-on expander.

Endpoints used (SEMrush Analytics API v3, one report per seed):
  - phrase_related    → semantically related keywords (the expansion net)
  - phrase_these      → exact rows for the seeds themselves (volume anchor)
Both are keyword reports, not domain reports, so a single low-cost call per seed.

Auth: SEMRUSH_API_KEY env var (or --api-key). US database by default.

Usage:
  scripts/trend_pass/semrush_trend_expand.py \\
    --seed "claude opus 5" --seed "opus 5 pricing" \\
    --json reports/trend-pass/<date>.semrush.json

Exit codes: always 0 (best-effort). The JSON `status` field says what happened.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://api.semrush.com/"
# Columns: keyword, volume, CPC, competition, keyword difficulty.
# Codes/headers match the working scripts/semrush_keyword_gap.py (Kd, not Td).
COLUMNS = "Ph,Nq,Cp,Co,Kd"


def _fetch(api_key: str, params: dict) -> list[dict]:
    query = {
        "key": api_key,
        "export_escape": 1,
        "export_decode": 1,
        "export_columns": COLUMNS,
        **params,
    }
    url = API + "?" + urllib.parse.urlencode(query)
    with urllib.request.urlopen(url, timeout=30) as resp:
        text = resp.read().decode("utf-8", "replace")
    # SEMrush returns an "ERROR ##" line (not CSV) on any problem.
    if text.startswith("ERROR") or "\n" not in text.strip():
        raise RuntimeError(text.strip()[:200])
    reader = csv.DictReader(io.StringIO(text), delimiter=";")
    out = []
    for row in reader:
        kw = (row.get("Keyword") or "").strip()
        if not kw:
            continue
        out.append({
            "keyword": kw,
            "volume": int(row.get("Search Volume") or 0),
            "cpc": float(row.get("CPC") or 0.0),
            # Header differs by report (domain: "Keyword Difficulty",
            # phrase: "Keyword Difficulty Index") — accept either.
            "kd": float(row.get("Keyword Difficulty")
                        or row.get("Keyword Difficulty Index") or 0.0),
        })
    return out


def expand(api_key: str, seeds: list[str], database: str, per_seed: int) -> dict:
    keywords: dict[str, dict] = {}
    errors: list[str] = []
    for seed in seeds:
        seed = seed.strip()
        if not seed:
            continue
        for report in ("phrase_related", "phrase_these"):
            try:
                rows = _fetch(api_key, {
                    "type": report,
                    "phrase": seed,
                    "database": database,
                    "display_limit": per_seed,
                    "display_sort": "nq_desc",
                })
            except (urllib.error.URLError, RuntimeError, ValueError) as e:
                errors.append(f"{report}({seed}): {e}")
                continue
            for r in rows:
                k = r["keyword"].lower()
                # keep the highest-volume observation of a duplicated keyword
                if k not in keywords or r["volume"] > keywords[k]["volume"]:
                    r["seed"] = seed
                    keywords[k] = r
            time.sleep(0.4)  # be polite to the API
    ranked = sorted(keywords.values(), key=lambda r: r["volume"], reverse=True)
    return {"keywords": ranked, "errors": errors}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Trend-pass SEMrush expansion (best-effort).")
    ap.add_argument("--seed", action="append", default=[], help="Seed entity/query (repeatable).")
    ap.add_argument("--database", default="us")
    ap.add_argument("--per-seed", type=int, default=25, help="Max rows per report per seed.")
    ap.add_argument("--api-key", default=os.environ.get("SEMRUSH_API_KEY"))
    ap.add_argument("--json", help="Write result to file instead of stdout.")
    args = ap.parse_args(argv)

    if not args.seed:
        result = {"status": "skipped", "reason": "no seeds provided", "keywords": [], "errors": []}
    elif not args.api_key:
        result = {"status": "skipped", "reason": "SEMRUSH_API_KEY not set", "keywords": [], "errors": []}
    else:
        r = expand(args.api_key, args.seed, args.database, args.per_seed)
        status = "ok" if r["keywords"] else ("error" if r["errors"] else "empty")
        result = {"status": status, "seeds": args.seed, "database": args.database, **r}

    if args.json:
        Path(args.json).parent.mkdir(parents=True, exist_ok=True)
        Path(args.json).write_text(json.dumps(result, indent=2))
        print(f"SEMrush expansion: {result['status']} "
              f"({len(result['keywords'])} keywords) → {args.json}", file=sys.stderr)
    else:
        json.dump(result, sys.stdout, indent=2)
        sys.stdout.write("\n")
    return 0  # always succeed — best-effort


if __name__ == "__main__":
    sys.exit(main())
