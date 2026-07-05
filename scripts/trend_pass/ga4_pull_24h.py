#!/usr/bin/env python3
"""GA4 trend-pass Phase 0 pull — top-10 most-visited pages, last 24h, nothing more.

Sibling of gsc_pull_24h.py. Same shape, same minimalism, same inline
service-account auth (GOOGLE_REPORTING_SA_JSON) — the ONLY difference is the
data source: Google Analytics 4 (Analytics Data API `runReport`) instead of
Search Console.

Why this exists: GSC only reports Google-Search clicks. GA4 reports EVERY
channel — direct, referral, social, email, and AI-assistant referrals
(ChatGPT/Perplexity/Gemini/Claude). Sites with ~0 GSC traffic but heavy AI
traffic are invisible to the GSC pass and only visible here. This pull feeds
the exact same downstream engine (trend-detect → matrix → autocomplete →
4-layer dedup → publish) as the 2 AM GSC pass.

Output is drop-in compatible with the GSC pull: `top_pages` rows carry a
`clicks` field (aliased to screenPageViews) so the Phase 1 page-side trend
trigger works with zero edits, plus native GA4 metrics (`views`, `sessions`,
`active_users`) for richer scoring.

Auth reuses the GSC service-account JSON, but GA4 needs a DIFFERENT scope
(analytics.readonly) AND the SA email must be granted Viewer on the GA4
property (GA4 Admin → Property Access Management), and the Analytics Data API
must be enabled in the SA's Google Cloud project.

Usage:
  scripts/trend_pass/ga4_pull_24h.py --property-id 123456789 \\
    --json reports/trend-pass/<date>.ga4.pull.json

  # With per-page channel split (shows how much of each page is AI/Direct):
  scripts/trend_pass/ga4_pull_24h.py --property-id 123456789 --with-channels

Exit codes: 0 ok · 2 no credentials · 3 permission denied · 5 no data in window
"""

import argparse
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

# Reuse the sibling GSC tool's credential loading + auth session.
_TOOL_DIR = Path(__file__).resolve().parents[2] / ".claude" / "tools" / "gsc-search-analytics"
sys.path.insert(0, str(_TOOL_DIR))
from gsc_search_analytics import build_session, load_credentials  # noqa: E402

GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly"
API = "https://analyticsdata.googleapis.com/v1beta"


def _with_ga4_scope(creds):
    """The GSC loader hard-codes the webmasters scope; re-scope for GA4."""
    if hasattr(creds, "with_scopes"):
        return creds.with_scopes([GA4_SCOPE])
    return creds


def run_report(session, property_id: str, body: dict) -> dict:
    endpoint = f"{API}/properties/{property_id}:runReport"
    r = session.post(endpoint, json=body, timeout=30)
    if r.status_code == 403:
        print(f"ERROR 403: service account lacks access to GA4 property {property_id}. "
              f"Add the SA email as Viewer in GA4 Admin → Property Access Management, "
              f"and enable the Analytics Data API in its Cloud project.", file=sys.stderr)
        sys.exit(3)
    r.raise_for_status()
    return r.json()


def freshest_date_with_data(session, property_id: str) -> str | None:
    """Most recent single date (last 4 days) that has any sessions.

    Mirrors the GSC pull's freshest-day probe. GA4 is near-realtime, so today
    is usually partial-but-present; we still take the freshest day with rows so
    'last 24h' means the same thing on both engines.
    """
    end = date.today()
    start = end - timedelta(days=4)
    body = {
        "dateRanges": [{"startDate": start.isoformat(), "endDate": end.isoformat()}],
        "dimensions": [{"name": "date"}],
        "metrics": [{"name": "sessions"}],
        "orderBys": [{"dimension": {"dimensionName": "date"}, "desc": True}],
        "limit": 10,
    }
    resp = run_report(session, property_id, body)
    dates = []
    for row in resp.get("rows", []):
        raw = row["dimensionValues"][0]["value"]  # GA4 date is YYYYMMDD
        if raw and raw.isdigit() and len(raw) == 8:
            dates.append(f"{raw[0:4]}-{raw[4:6]}-{raw[6:8]}")
    return max(dates) if dates else None


def top10_pages(session, property_id: str, day: str) -> list[dict]:
    body = {
        "dateRanges": [{"startDate": day, "endDate": day}],
        "dimensions": [{"name": "pagePath"}],
        "metrics": [
            {"name": "screenPageViews"},
            {"name": "sessions"},
            {"name": "totalUsers"},
        ],
        "orderBys": [{"metric": {"metricName": "screenPageViews"}, "desc": True}],
        "limit": 10,
    }
    resp = run_report(session, property_id, body)
    rows = []
    for row in resp.get("rows", []):
        page = row["dimensionValues"][0]["value"]
        m = row["metricValues"]
        views = int(m[0]["value"])
        rows.append({
            "page": page,
            "views": views,
            "sessions": int(m[1]["value"]),
            "active_users": int(m[2]["value"]),
            # compatibility alias so the GSC-shaped Phase 1 trigger runs unchanged:
            "clicks": views,
        })
    return rows[:10]


def channel_split(session, property_id: str, day: str, pages: list[str]) -> dict:
    """Per-page sessions by default channel group (Direct/Referral/Organic/…),
    scoped to the top-10 pages. This is where AI/Direct traffic becomes visible."""
    if not pages:
        return {}
    body = {
        "dateRanges": [{"startDate": day, "endDate": day}],
        "dimensions": [{"name": "pagePath"}, {"name": "sessionDefaultChannelGroup"}],
        "metrics": [{"name": "sessions"}],
        "dimensionFilter": {
            "filter": {
                "fieldName": "pagePath",
                "inListFilter": {"values": pages},
            }
        },
        "limit": 200,
    }
    resp = run_report(session, property_id, body)
    out: dict[str, dict[str, int]] = {}
    for row in resp.get("rows", []):
        page = row["dimensionValues"][0]["value"]
        channel = row["dimensionValues"][1]["value"]
        sess = int(row["metricValues"][0]["value"])
        out.setdefault(page, {})[channel] = sess
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="GA4 24h pull: top-10 most-visited pages.")
    ap.add_argument("--property-id", default=os.environ.get("GA4_PROPERTY_ID"),
                    help="GA4 numeric property ID (e.g. 123456789). Env: GA4_PROPERTY_ID.")
    ap.add_argument("--sa-file", help="Service-account JSON path override.")
    ap.add_argument("--with-channels", action="store_true",
                    help="Add per-page channel split (Direct/Referral/etc.).")
    ap.add_argument("--json", help="Write result to file instead of stdout.")
    args = ap.parse_args(argv)

    if not args.property_id:
        print("ERROR: --property-id (or GA4_PROPERTY_ID) is required.", file=sys.stderr)
        return 4

    creds = _with_ga4_scope(load_credentials(args.sa_file))
    session = build_session(creds)

    day = freshest_date_with_data(session, args.property_id)
    if not day:
        print(f"ERROR: no GA4 data in the last 4 days for property {args.property_id}",
              file=sys.stderr)
        return 5

    pages = top10_pages(session, args.property_id, day)
    payload = {
        "property_id": args.property_id,
        "data_date": day,
        "source": "ga4",
        "top_pages": pages,
        "top10_pages_total_views": sum(p["views"] for p in pages),
        "top10_pages_total_clicks": sum(p["clicks"] for p in pages),  # alias mirror
    }
    if args.with_channels:
        payload["channel_split"] = channel_split(
            session, args.property_id, day, [p["page"] for p in pages]
        )

    if args.json:
        Path(args.json).parent.mkdir(parents=True, exist_ok=True)
        with open(args.json, "w") as f:
            json.dump(payload, f, indent=2)
        print(f"Wrote GA4 pull for {day} to {args.json}", file=sys.stderr)
    else:
        json.dump(payload, sys.stdout, indent=2)
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
