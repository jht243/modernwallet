#!/usr/bin/env python3
"""GSC Search Analytics fetcher — universal page performance lookup.

Sibling to gsc_url_inspection.py. Same service-account auth, same property
derivation. Pulls page-level performance from Google Search Console's
SearchAnalytics API: impressions, clicks, CTR, avg position, top queries,
and 90-day trend.

Designed to drive metadata-rewrite decisions: before rewriting a page's
title/meta description, this tells you whether the page is currently
performing well, underperforming, or has no traction yet.

Usage:
  # Summary metrics + top queries for one page (last 30 days, default):
  gsc_search_analytics.py \\
    --base-url https://www.example.com \\
    --page https://www.example.com/some-page

  # With trend history (week-by-week impressions for last 90 days):
  gsc_search_analytics.py --base-url https://www.example.com \\
    --page https://www.example.com/some-page --trend

  # Batch mode — one page URL per line on stdin:
  echo -e "https://x.com/a\\nhttps://x.com/b" | gsc_search_analytics.py \\
    --base-url https://www.example.com --stdin --json out.json

Output (default JSON):
  {
    "page": "https://www.example.com/some-page",
    "window_days": 30,
    "totals": {
      "impressions": 1234, "clicks": 56,
      "ctr": 0.045, "position": 8.3
    },
    "top_queries": [
      {"query": "ai for medical practices", "impressions": 510,
       "clicks": 18, "ctr": 0.035, "position": 9.1},
      ...
    ],
    "verdict": {
      "label": "underperforming|performing|no-data|mixed",
      "reason": "<short human-readable reason>",
      "ctr": 0.045, "ctr_threshold_low": 0.03, "ctr_threshold_high": 0.05,
      "impressions_trend_30d": "flat",   // up | flat | down
      "rewrite_recommended": true|false
    }
  }

Exit codes:
  0  success
  2  no credentials (place SA JSON at ~/.claude/secrets/gsc-service-account.json)
  3  403 — service account lacks property permission
  4  bad arguments
"""

import argparse
import json
import os
import sys
import urllib.parse
from datetime import date, timedelta
from pathlib import Path
from typing import Optional


SA_PATHS = [
    None,  # placeholder for --sa-file override
    os.environ.get("GOOGLE_REPORTING_SA_JSON"),
    os.environ.get("GOOGLE_REPORTING_SA_FILE"),
    os.environ.get("GSC_SA_FILE"),
    os.path.expanduser("~/.claude/secrets/gsc-service-account.json"),
]


def load_credentials(sa_file_override: Optional[str] = None):
    try:
        from google.oauth2 import service_account
    except ImportError:
        print("ERROR: google-auth not installed. Run: pip install google-auth requests",
              file=sys.stderr)
        sys.exit(1)

    candidates = list(SA_PATHS)
    if sa_file_override:
        candidates[0] = sa_file_override

    sa_info = None
    for c in candidates:
        if not c:
            continue
        if c.strip().startswith("{"):
            try:
                sa_info = json.loads(c)
                break
            except json.JSONDecodeError:
                continue
        p = Path(c)
        if p.exists():
            with open(p) as f:
                sa_info = json.load(f)
            break

    if sa_info is None:
        print("ERROR: No service-account credentials found. Place SA JSON at "
              "~/.claude/secrets/gsc-service-account.json or set GOOGLE_REPORTING_SA_FILE.",
              file=sys.stderr)
        sys.exit(2)

    scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]
    return service_account.Credentials.from_service_account_info(sa_info, scopes=scopes)


def derive_site_url(base_url: str, override: Optional[str] = None) -> str:
    """Derive the GSC property identifier from a base URL.
    base_url=https://www.example.com → sc-domain:example.com (default — covers all hosts/schemes).
    Override with --site-url for a URL-prefix property."""
    if override:
        return override
    host = urllib.parse.urlparse(base_url).netloc or base_url
    host = host.lower().lstrip("www.")
    return f"sc-domain:{host}"


def query_search_analytics(session, site_url: str, body: dict, retries: int = 3) -> dict:
    """Hit the SearchAnalytics:query endpoint and return parsed JSON."""
    import requests as req_lib

    quoted_site = urllib.parse.quote(site_url, safe="")
    endpoint = (
        f"https://searchconsole.googleapis.com/webmasters/v3/sites/"
        f"{quoted_site}/searchAnalytics/query"
    )
    last_err = None
    for attempt in range(retries):
        try:
            r = session.post(endpoint, json=body, timeout=30)
            if r.status_code == 403:
                print(f"ERROR 403: service account lacks permission on {site_url}. "
                      f"Add it as Full/Owner in GSC → Settings → Users and permissions.",
                      file=sys.stderr)
                sys.exit(3)
            r.raise_for_status()
            return r.json()
        except req_lib.RequestException as e:
            last_err = e
            if attempt < retries - 1:
                import time
                time.sleep(1.5 ** attempt)
                continue
            raise
    raise RuntimeError(f"unreachable: {last_err}")


def fetch_page_summary(session, site_url: str, page_url: str, window_days: int) -> dict:
    """Get totals + top queries for one page over the last N days."""
    end = date.today()
    start = end - timedelta(days=window_days)
    body_base = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensionFilterGroups": [{
            "filters": [{
                "dimension": "page",
                "operator": "equals",
                "expression": page_url,
            }],
        }],
        "rowLimit": 25,
    }
    # Totals: no dimensions, single aggregate row
    totals_resp = query_search_analytics(session, site_url, {**body_base, "dimensions": []})
    totals_rows = totals_resp.get("rows", [])
    if totals_rows:
        t = totals_rows[0]
        totals = {
            "impressions": int(t.get("impressions", 0)),
            "clicks": int(t.get("clicks", 0)),
            "ctr": round(t.get("ctr", 0.0), 4),
            "position": round(t.get("position", 0.0), 2),
        }
    else:
        totals = {"impressions": 0, "clicks": 0, "ctr": 0.0, "position": 0.0}

    # Top queries
    q_resp = query_search_analytics(session, site_url, {**body_base, "dimensions": ["query"]})
    top_queries = []
    for row in q_resp.get("rows", []):
        top_queries.append({
            "query": row.get("keys", [""])[0],
            "impressions": int(row.get("impressions", 0)),
            "clicks": int(row.get("clicks", 0)),
            "ctr": round(row.get("ctr", 0.0), 4),
            "position": round(row.get("position", 0.0), 2),
        })
    return {"totals": totals, "top_queries": top_queries[:10]}


def fetch_trend(session, site_url: str, page_url: str, window_days: int = 90) -> dict:
    """Get week-bucketed impressions for the page over the last window_days."""
    end = date.today()
    start = end - timedelta(days=window_days)
    body = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensions": ["date"],
        "dimensionFilterGroups": [{
            "filters": [{
                "dimension": "page",
                "operator": "equals",
                "expression": page_url,
            }],
        }],
        "rowLimit": 1000,
    }
    resp = query_search_analytics(session, site_url, body)
    daily = []
    for row in resp.get("rows", []):
        daily.append({
            "date": row.get("keys", [""])[0],
            "impressions": int(row.get("impressions", 0)),
            "clicks": int(row.get("clicks", 0)),
        })
    # Classify trend: compare first third vs last third
    if len(daily) < 14:
        trend = "insufficient-data"
    else:
        third = len(daily) // 3
        early = sum(d["impressions"] for d in daily[:third]) / max(third, 1)
        late = sum(d["impressions"] for d in daily[-third:]) / max(third, 1)
        if early == 0 and late == 0:
            trend = "no-traffic"
        elif early == 0:
            trend = "up"
        else:
            ratio = late / early
            if ratio >= 1.2:
                trend = "up"
            elif ratio <= 0.8:
                trend = "down"
            else:
                trend = "flat"
    return {"daily": daily, "trend_30d": trend}


def classify_verdict(summary: dict, trend: Optional[dict]) -> dict:
    """Decide whether a metadata rewrite is recommended based on perf signals.

    Rules (sensible defaults — tweak as you learn):
      - CTR < 3% at avg position < 10 → underperforming → REWRITE OK
      - Impressions trending DOWN for 30d → underperforming → REWRITE OK
      - No impressions → no-data → REWRITE OK (nothing to lose)
      - CTR >= 5% AND impressions trending UP → performing → DEFER rewrite
      - Otherwise → mixed → REWRITE OK with caution
    """
    t = summary["totals"]
    ctr = t["ctr"]
    impressions = t["impressions"]
    position = t["position"]
    trend_label = trend["trend_30d"] if trend else None

    if impressions == 0:
        return {
            "label": "no-data",
            "reason": "Page has no GSC impressions in window — nothing to lose by rewriting.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": True,
        }
    if ctr >= 0.05 and trend_label == "up":
        return {
            "label": "performing",
            "reason": f"CTR {ctr:.1%} ≥ 5% AND impressions trending up — current title is working; DEFER rewrite.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": False,
        }
    if trend_label == "down":
        return {
            "label": "underperforming",
            "reason": f"Impressions trending DOWN over 30 days — rewrite justified.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": True,
        }
    if ctr == 0.0 and impressions >= 50:
        return {
            "label": "underperforming",
            "reason": f"CTR 0% on {impressions} impressions (avg pos {position:.1f}) — page is shown but nobody clicks; rewrite justified.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": True,
        }
    if ctr < 0.03 and position < 10:
        return {
            "label": "underperforming",
            "reason": f"CTR {ctr:.1%} < 3% at avg position {position:.1f} — title not pulling clicks; rewrite justified.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": True,
        }
    return {
        "label": "mixed",
        "reason": f"CTR {ctr:.1%}, position {position:.1f}, trend {trend_label} — neither clearly winning nor losing. Rewrite OK with caution.",
        "ctr": ctr, "impressions": impressions, "position": position,
        "impressions_trend_30d": trend_label,
        "rewrite_recommended": True,
    }


def build_session(creds):
    """Authenticated requests session with auto token refresh."""
    import requests
    from google.auth.transport.requests import Request as GoogleRequest

    class AuthSession(requests.Session):
        def __init__(self, credentials):
            super().__init__()
            self._creds = credentials
            self._gauth_req = GoogleRequest()

        def request(self, method, url, *args, **kwargs):  # type: ignore[override]
            if not self._creds.valid:
                self._creds.refresh(self._gauth_req)
            headers = kwargs.pop("headers", {}) or {}
            headers["Authorization"] = f"Bearer {self._creds.token}"
            return super().request(method, url, *args, headers=headers, **kwargs)

    return AuthSession(creds)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        description="GSC Search Analytics fetcher — page-level performance + rewrite verdict."
    )
    ap.add_argument("--base-url", required=True,
                    help="e.g. https://www.example.com — used to derive sc-domain:<host>.")
    ap.add_argument("--page",
                    help="Full page URL to inspect. Use --stdin for batch.")
    ap.add_argument("--stdin", action="store_true",
                    help="Read one page URL per line from stdin (overrides --page).")
    ap.add_argument("--site-url",
                    help="Override the derived GSC property (e.g. URL-prefix property).")
    ap.add_argument("--sa-file", help="Path to service-account JSON (overrides env vars).")
    ap.add_argument("--days", type=int, default=30,
                    help="Summary window in days (default 30).")
    ap.add_argument("--trend", action="store_true",
                    help="Also fetch 90-day day-by-day impressions for trend classification.")
    ap.add_argument("--json", help="Write JSON results to file instead of stdout.")
    args = ap.parse_args(argv)

    if not args.page and not args.stdin:
        ap.error("--page or --stdin required")

    site_url = derive_site_url(args.base_url, args.site_url)
    creds = load_credentials(args.sa_file)
    session = build_session(creds)

    pages = ([line.strip() for line in sys.stdin if line.strip()]
             if args.stdin else [args.page])

    results = []
    for page in pages:
        try:
            summary = fetch_page_summary(session, site_url, page, args.days)
            trend = fetch_trend(session, site_url, page, 90) if args.trend else None
            verdict = classify_verdict(summary, trend)
            results.append({
                "page": page,
                "site_url": site_url,
                "window_days": args.days,
                "totals": summary["totals"],
                "top_queries": summary["top_queries"],
                "trend": trend,
                "verdict": verdict,
            })
        except Exception as e:
            print(f"[warn] {page}: {e}", file=sys.stderr)
            results.append({"page": page, "error": str(e)})

    payload = results[0] if len(results) == 1 else results
    if args.json:
        with open(args.json, "w") as f:
            json.dump(payload, f, indent=2)
        print(f"Wrote {len(results)} page result(s) to {args.json}", file=sys.stderr)
    else:
        json.dump(payload, sys.stdout, indent=2)
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
