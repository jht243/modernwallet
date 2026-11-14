#!/usr/bin/env python3
"""Trend-pass portable Phase 0 pull — top-10 queries + top-10 pages (+ top-20 & additive signals), last 7 days.

Weekly/portable variant of the Trend Pass Phase 0 pull. Preserves all original
keys untouched (`top_queries[10]`, `coverage_queries[20]`, `top_pages[10]`, and
top-10 click totals) while additively computing three discovery signals from
the full 25,000-row GSC query pull + a best-effort prior-window comparison:
  - `rising_queries`: breakout / newly appearing queries jumping vs. prior 7d window
  - `spillover_queries`: rank 6-50 high-impression, low-click queries outside top-20
  - `modifier_patterns`: recurring search modifier formulas (e.g. `dumb <X>`, `<X> without ai`)

Usage:
  scripts/trend_pass/gsc_pull_7d.py --base-url https://www.banthebots.org \\
    --json reports/trend-pass/<date>.pull.json

Exit codes: 0 ok · 2 no credentials · 3 permission · 5 no data in window
"""

import argparse
import json
import sys
from datetime import date, timedelta
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))
from gsc_signals import build_additive_signals  # noqa: E402

_TOOL_DIR = Path(__file__).resolve().parents[2] / ".claude" / "tools" / "gsc-search-analytics"
if str(_TOOL_DIR) not in sys.path:
    sys.path.insert(0, str(_TOOL_DIR))
from gsc_search_analytics import (  # noqa: E402
    build_session,
    derive_site_url,
    load_credentials,
    query_search_analytics,
)


def top_rows(session, site_url: str, start: str, end: str, dimension: str, limit: int | None = 10) -> list[dict]:
    body = {
        "startDate": start,
        "endDate": end,
        "dimensions": [dimension],
        "dataState": "all",
        # Full row set (GSC caps at 25k). A small rowLimit makes GSC return an
        # arbitrary/alphabetical slice, NOT the top rows — sort locally over
        # everything, then cut to `limit` if provided.
        "rowLimit": 25000,
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
    return rows if limit is None else rows[:limit]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Trend-pass 7-day pull: top-10 queries + top-10 pages + additive signals.")
    ap.add_argument("--base-url", required=True, help="e.g. https://www.banthebots.org")
    ap.add_argument("--site-url", help="Override derived GSC property.")
    ap.add_argument("--sa-file", help="Service-account JSON path override.")
    ap.add_argument("--days", type=int, default=7, help="Window in days (default 7 = weekly).")
    ap.add_argument("--json", help="Write result to file instead of stdout.")
    args = ap.parse_args(argv)

    site_url = derive_site_url(args.base_url, args.site_url)
    session = build_session(load_credentials(args.sa_file))

    end = date.today()
    start = end - timedelta(days=args.days)
    # Pull all queries once (up to 25k):
    # - TREND lane uses `top_queries[10]` (locked, sharp signal)
    # - COVERAGE lane uses `coverage_queries[20]` PLUS additive `rising_queries`,
    #   `spillover_queries`, and `modifier_patterns`.
    all_queries = top_rows(session, site_url, start.isoformat(), end.isoformat(), "query", limit=None)
    queries20 = all_queries[:20]
    queries = queries20[:10]
    pages = top_rows(session, site_url, start.isoformat(), end.isoformat(), "page", limit=10)

    if not queries and not pages:
        print(f"ERROR: no GSC data for {site_url} over last {args.days}d", file=sys.stderr)
        return 5

    prev_end = start - timedelta(days=1)
    prev_start = prev_end - timedelta(days=args.days)
    baseline_rows: list[dict] | None = None
    baseline_window: dict | None = None
    try:
        baseline_rows = top_rows(
            session, site_url, prev_start.isoformat(), prev_end.isoformat(), "query", limit=None
        )
        baseline_window = {
            "start": prev_start.isoformat(),
            "end": prev_end.isoformat(),
            "days": args.days,
            "comparison": "prior_window_equal_span",
        }
    except Exception as exc:
        print(f"[warn] baseline {args.days}d query pull skipped ({exc}); continuing without rising comparison", file=sys.stderr)

    additive = build_additive_signals(
        all_queries,
        queries20,
        baseline_rows=baseline_rows,
        baseline_divisor=1.0,
        is_24h=False,
    )

    payload = {
        "site_url": site_url,
        "window": {"start": start.isoformat(), "end": end.isoformat(), "days": args.days},
        "top_queries": queries,
        "coverage_queries": queries20,
        "top_pages": pages,
        "top10_pages_total_clicks": sum(p["clicks"] for p in pages),
        "top10_queries_total_clicks": sum(q["clicks"] for q in queries),
        "baseline_window": baseline_window,
        **additive,
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
