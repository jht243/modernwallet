#!/usr/bin/env python3
"""Trend-pass (Mind Medicine Law) Phase 0 pull — top-10 queries + top-10 pages, last 7 days.

This is the WEEKLY variant of the Layer3 nightly engine. Mind Medicine Law runs
~1–2 organic clicks/day, so a 24h top-10 would be empty most days; a 7-day window
clears the signal threshold while keeping the input tiny (two lists, nothing more)
so the Phase 1 trend judgment stays sharp.

Same service-account auth + sc-domain derivation as the sibling GSC tools.
Property: sc-domain:mindmedicinelaw.com.

Usage:
  scripts/trend_pass/gsc_pull_7d.py --base-url https://www.mindmedicinelaw.com \\
    --json reports/trend-pass/<date>.pull.json

Exit codes: 0 ok · 2 no credentials · 3 permission · 5 no data in window
"""

import argparse
import json
import sys
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


def top10(session, site_url: str, start: str, end: str, dimension: str) -> list[dict]:
    body = {
        "startDate": start,
        "endDate": end,
        "dimensions": [dimension],
        "dataState": "all",
        "rowLimit": 25,
    }
    resp = query_search_analytics(session, site_url, body)
    rows = [{
        dimension: r.get("keys", [""])[0],
        "clicks": int(r.get("clicks", 0)),
        "impressions": int(r.get("impressions", 0)),
        "ctr": round(r.get("ctr", 0.0), 4),
        "position": round(r.get("position", 0.0), 2),
    } for r in resp.get("rows", [])]
    rows.sort(key=lambda r: (r["clicks"], r["impressions"]), reverse=True)
    return rows[:10]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Trend-pass 7-day pull: top-10 queries + top-10 pages.")
    ap.add_argument("--base-url", required=True, help="e.g. https://www.mindmedicinelaw.com")
    ap.add_argument("--site-url", help="Override derived GSC property.")
    ap.add_argument("--sa-file", help="Service-account JSON path override.")
    ap.add_argument("--days", type=int, default=7, help="Window in days (default 7 = weekly).")
    ap.add_argument("--json", help="Write result to file instead of stdout.")
    args = ap.parse_args(argv)

    site_url = derive_site_url(args.base_url, args.site_url)
    session = build_session(load_credentials(args.sa_file))

    end = date.today()
    start = end - timedelta(days=args.days)
    queries = top10(session, site_url, start.isoformat(), end.isoformat(), "query")
    pages = top10(session, site_url, start.isoformat(), end.isoformat(), "page")

    if not queries and not pages:
        print(f"ERROR: no GSC data for {site_url} over last {args.days}d", file=sys.stderr)
        return 5

    payload = {
        "site_url": site_url,
        "window": {"start": start.isoformat(), "end": end.isoformat(), "days": args.days},
        "top_queries": queries,
        "top_pages": pages,
        "top10_pages_total_clicks": sum(p["clicks"] for p in pages),
        "top10_queries_total_clicks": sum(q["clicks"] for q in queries),
    }
    if args.json:
        Path(args.json).parent.mkdir(parents=True, exist_ok=True)
        with open(args.json, "w") as f:
            json.dump(payload, f, indent=2)
        print(f"Wrote 7d pull ({start}→{end}) to {args.json}", file=sys.stderr)
    else:
        json.dump(payload, sys.stdout, indent=2)
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
