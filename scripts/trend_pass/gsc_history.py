#!/usr/bin/env python3
"""Trend-pass ledger BOOTSTRAP helper — 30-day GSC history for seeding trends.md.

NOT part of the nightly run (that is gsc_pull_24h.py, deliberately tiny). This
pulls a wider window ONCE so the trend ledger can be seeded with the themes
Google actually recorded — not just the ones derivable from commits. A theme
that drove traffic weeks ago but is quiet today won't show in a 24h pull, yet it
must be in the ledger or the night it resurfaces the engine re-mines old ground.

Pulls, over --days (default 30):
  - top N queries by clicks
  - top N pages by clicks
  - per-ISO-week clicks for the top queries (rise/decay detection)

Auth/property mirror the sibling GSC tools.

Usage:
  scripts/trend_pass/gsc_history.py --base-url https://www.layer3labs.io \\
    --days 30 --top 60 --json reports/trend-pass/bootstrap.history.json
"""

import argparse
import json
import sys
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

_TOOL_DIR = Path(__file__).resolve().parents[2] / ".claude" / "tools" / "gsc-search-analytics"
sys.path.insert(0, str(_TOOL_DIR))
from gsc_search_analytics import (  # noqa: E402
    build_session,
    derive_site_url,
    load_credentials,
    query_search_analytics,
)


def top_by(session, site_url, start, end, dimension, limit):
    body = {
        "startDate": start,
        "endDate": end,
        "dimensions": [dimension],
        "dataState": "all",
        # Full row set (GSC caps at 25k). A small rowLimit makes GSC return an
        # arbitrary/alphabetical slice, NOT the top rows — sort locally over
        # everything, then cut to `limit`.
        "rowLimit": 25000,
    }
    resp = query_search_analytics(session, site_url, body)
    rows = [{
        dimension: r.get("keys", [""])[0],
        "clicks": int(r.get("clicks", 0)),
        "impressions": int(r.get("impressions", 0)),
        "position": round(r.get("position", 0.0), 1),
    } for r in resp.get("rows", [])]
    rows.sort(key=lambda r: (r["clicks"], r["impressions"]), reverse=True)
    return rows[:limit]


def weekly_query_clicks(session, site_url, start, end, queries):
    """Per-ISO-week clicks for a set of queries — reveals spike-then-decay."""
    body = {
        "startDate": start,
        "endDate": end,
        "dimensions": ["date", "query"],
        "dataState": "all",
        "rowLimit": 25000,
    }
    resp = query_search_analytics(session, site_url, body)
    qset = {q.lower() for q in queries}
    weeks = defaultdict(lambda: defaultdict(int))
    for r in resp.get("rows", []):
        d, q = r["keys"][0], r["keys"][1]
        if q.lower() not in qset:
            continue
        iso = date.fromisoformat(d).isocalendar()
        wk = f"{iso[0]}-W{iso[1]:02d}"
        weeks[q][wk] += int(r.get("clicks", 0))
    return {q: dict(sorted(w.items())) for q, w in weeks.items()}


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", required=True)
    ap.add_argument("--site-url")
    ap.add_argument("--sa-file")
    ap.add_argument("--days", type=int, default=30)
    ap.add_argument("--top", type=int, default=60)
    ap.add_argument("--json")
    args = ap.parse_args(argv)

    site_url = derive_site_url(args.base_url, args.site_url)
    session = build_session(load_credentials(args.sa_file))
    end = date.today()
    start = end - timedelta(days=args.days)

    queries = top_by(session, site_url, start.isoformat(), end.isoformat(), "query", args.top)
    pages = top_by(session, site_url, start.isoformat(), end.isoformat(), "page", args.top)
    weekly = weekly_query_clicks(session, site_url, start.isoformat(), end.isoformat(),
                                 [q["query"] for q in queries])

    payload = {
        "site_url": site_url,
        "window": {"start": start.isoformat(), "end": end.isoformat(), "days": args.days},
        "top_queries": queries,
        "top_pages": pages,
        "weekly_query_clicks": weekly,
    }
    if args.json:
        Path(args.json).parent.mkdir(parents=True, exist_ok=True)
        with open(args.json, "w") as f:
            json.dump(payload, f, indent=2)
        print(f"Wrote {len(queries)} queries + {len(pages)} pages to {args.json}", file=sys.stderr)
    else:
        json.dump(payload, sys.stdout, indent=2)
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
