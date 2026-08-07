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


def top_pages(session, property_id: str, start: str, end: str, top: int,
              with_engagement: bool = False) -> list[dict]:
    metrics = [
        {"name": "screenPageViews"},
        {"name": "sessions"},
        {"name": "totalUsers"},
    ]
    if with_engagement:
        metrics += [
            {"name": "userEngagementDuration"},
            {"name": "engagementRate"},
            {"name": "bounceRate"},
        ]
    body = {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "pagePath"}],
        "metrics": metrics,
        "orderBys": [{"metric": {"metricName": "screenPageViews"}, "desc": True}],
        "limit": top,
    }
    resp = run_report(session, property_id, body)
    rows = []
    for row in resp.get("rows", []):
        page = row["dimensionValues"][0]["value"]
        m = row["metricValues"]
        views = int(m[0]["value"])
        active_users = int(m[2]["value"])
        out = {
            "page": page,
            "views": views,
            "sessions": int(m[1]["value"]),
            "active_users": active_users,
            # compatibility alias so the GSC-shaped Phase 1 trigger runs unchanged:
            "clicks": views,
        }
        if with_engagement:
            eng_duration_s = float(m[3]["value"])
            out["avg_eng_s"] = round(eng_duration_s / active_users, 1) if active_users else 0.0
            out["engagement_rate"] = round(float(m[4]["value"]), 4)
            out["bounce_rate"] = round(float(m[5]["value"]), 4)
        rows.append(out)
    return rows[:top]


def scrolled_pct_by_page(session, property_id: str, start: str, end: str,
                          pages: list[dict]) -> None:
    """Share of active users who fired the default 90%-scroll event, per page.

    Mutates `pages` in place, adding scrolled_users / scrolled_pct. Silently
    no-ops (leaves the fields absent) on properties without enhanced-measurement
    scroll tracking — callers must treat scrolled_pct as optional.
    """
    body = {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "pagePath"}],
        "metrics": [{"name": "activeUsers"}],
        "dimensionFilter": {
            "filter": {"fieldName": "eventName", "stringFilter": {"value": "scroll"}}
        },
        "limit": 200,
    }
    try:
        resp = run_report(session, property_id, body)
    except Exception as exc:  # noqa: BLE001 — best-effort, property may lack scroll tracking
        print(f"WARNING: scroll-depth metric unavailable ({exc}); skipping scrolled_pct.",
              file=sys.stderr)
        return
    scrolled = {
        row["dimensionValues"][0]["value"]: int(row["metricValues"][0]["value"])
        for row in resp.get("rows", [])
    }
    for p in pages:
        su = scrolled.get(p["page"])
        if su is None:
            continue
        p["scrolled_users"] = su
        p["scrolled_pct"] = round(su / p["active_users"], 4) if p["active_users"] else 0.0


def channel_split(session, property_id: str, start: str, end: str, pages: list[str]) -> dict:
    """Per-page sessions by default channel group (Direct/Referral/Organic/…),
    scoped to the top pages. This is where AI/Direct traffic becomes visible."""
    if not pages:
        return {}
    body = {
        "dateRanges": [{"startDate": start, "endDate": end}],
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
    ap.add_argument("--with-engagement", action="store_true",
                    help="Add avg_eng_s, engagement_rate, bounce_rate, scrolled_pct per page.")
    ap.add_argument("--days", type=int, default=1,
                    help="Window size in days, ending on the freshest day with data (default 1).")
    ap.add_argument("--top", type=int, default=10,
                    help="Number of top pages to return, ranked by views (default 10).")
    ap.add_argument("--json", help="Write result to file instead of stdout.")
    args = ap.parse_args(argv)

    if not args.property_id:
        print("ERROR: --property-id (or GA4_PROPERTY_ID) is required.", file=sys.stderr)
        return 4

    creds = _with_ga4_scope(load_credentials(args.sa_file))
    session = build_session(creds)

    end = freshest_date_with_data(session, args.property_id)
    if not end:
        print(f"ERROR: no GA4 data in the last 4 days for property {args.property_id}",
              file=sys.stderr)
        return 5
    start = (date.fromisoformat(end) - timedelta(days=args.days - 1)).isoformat()

    pages = top_pages(session, args.property_id, start, end, args.top,
                       with_engagement=args.with_engagement)
    if args.with_engagement:
        scrolled_pct_by_page(session, args.property_id, start, end, pages)

    payload = {
        "property_id": args.property_id,
        "data_date": end,
        "window_start": start,
        "window_end": end,
        "window_days": args.days,
        "source": "ga4",
        "top_pages": pages,
        "top10_pages_total_views": sum(p["views"] for p in pages),
        "top10_pages_total_clicks": sum(p["clicks"] for p in pages),  # alias mirror
    }
    if args.with_channels:
        payload["channel_split"] = channel_split(
            session, args.property_id, start, end, [p["page"] for p in pages]
        )

    if args.json:
        Path(args.json).parent.mkdir(parents=True, exist_ok=True)
        with open(args.json, "w") as f:
            json.dump(payload, f, indent=2)
        print(f"Wrote GA4 pull for {start}..{end} to {args.json}", file=sys.stderr)
    else:
        json.dump(payload, sys.stdout, indent=2)
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
