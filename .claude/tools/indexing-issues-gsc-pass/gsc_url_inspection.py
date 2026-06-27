#!/usr/bin/env python3
"""
GSC URL Inspection API sweep tool.
Inspects URLs from a site's sitemap(s) via the Google Search Console URL Inspection API.
Writes dated JSON + CSV output to a project-local out dir.

Usage:
  python gsc_url_inspection.py --base-url https://example.com [--out reports/indexing-pass]
                                [--url URL]          # single smoke-test URL
                                [--urls-file FILE]   # inspect a specific list of URLs
                                [--resume]           # continue an in-progress sweep
                                [--recheck-indexed]  # re-inspect URLs flagged indexed last sweep
                                [--max-noindexed N]  # stop after N non-indexed (default 200; 0=off)
                                [--site-url SC_PROP] # override property (e.g. sc-domain:example.com)
                                [--sa-file FILE]     # override service-account JSON path
                                [--limit N]          # inspect at most N URLs total
"""

import argparse
import json
import os
import signal
import sys
import time
from datetime import date, datetime
from pathlib import Path
from typing import Optional
import xml.etree.ElementTree as ET

# ── Credentials ────────────────────────────────────────────────────────────────
def load_credentials(sa_file_override: Optional[str] = None):
    """Resolve and return google.oauth2.service_account.Credentials."""
    try:
        from google.oauth2 import service_account
        import google.auth.transport.requests as gtr
    except ImportError:
        print("ERROR: google-auth not installed. Run: pip install google-auth requests", file=sys.stderr)
        sys.exit(1)

    candidates = []
    if sa_file_override:
        candidates.append(sa_file_override)
    candidates += [
        os.environ.get("GOOGLE_REPORTING_SA_JSON"),   # inline JSON string
        os.environ.get("GOOGLE_REPORTING_SA_FILE"),
        os.environ.get("GSC_SA_FILE"),
        os.path.expanduser("~/.claude/secrets/gsc-service-account.json"),
    ]

    sa_info = None
    sa_path = None
    for c in candidates:
        if not c:
            continue
        # Might be an inline JSON string
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
            sa_path = str(p)
            break

    if sa_info is None:
        print("ERROR: No service-account credentials found.", file=sys.stderr)
        print("Place the SA JSON at ~/.claude/secrets/gsc-service-account.json "
              "or set GOOGLE_REPORTING_SA_FILE env var.", file=sys.stderr)
        sys.exit(2)

    scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]
    creds = service_account.Credentials.from_service_account_info(sa_info, scopes=scopes)
    return creds


# ── Sitemap fetching ───────────────────────────────────────────────────────────
def fetch_sitemap_urls(base_url: str) -> tuple[list[str], list[str]]:
    """Return (url_list, skipped_sitemaps). Follows one sitemap-index level."""
    import requests
    sitemap_url = base_url.rstrip("/") + "/sitemap.xml"
    urls = []
    skipped = []

    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    def fetch_xml(url):
        try:
            r = requests.get(url, timeout=30)
            r.raise_for_status()
            return ET.fromstring(r.content)
        except Exception as e:
            skipped.append(url)
            print(f"  WARNING: could not fetch {url}: {e}", file=sys.stderr)
            return None

    root = fetch_xml(sitemap_url)
    if root is None:
        return urls, skipped

    tag = root.tag.lower()
    if "sitemapindex" in tag:
        # Sitemap index — fetch each child sitemap
        for sm in root.findall(".//sm:sitemap/sm:loc", ns) + root.findall(".//sitemap/loc"):
            child_url = sm.text.strip()
            child_root = fetch_xml(child_url)
            if child_root is None:
                continue
            for loc in child_root.findall(".//sm:loc", ns) + child_root.findall(".//loc"):
                u = loc.text.strip()
                if u not in urls:
                    urls.append(u)
    else:
        # Plain sitemap
        for loc in root.findall(".//sm:loc", ns) + root.findall(".//loc"):
            u = loc.text.strip()
            if u not in urls:
                urls.append(u)

    return urls, skipped


# ── URL Inspection API ─────────────────────────────────────────────────────────
def inspect_url(session, site_url: str, inspection_url: str, retries: int = 3) -> dict:
    """Call the URL Inspection API for one URL. Returns the API response dict."""
    import requests as req_lib
    api = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"
    payload = {"inspectionUrl": inspection_url, "siteUrl": site_url}
    for attempt in range(retries):
        try:
            r = session.post(api, json=payload, timeout=30)
            if r.status_code == 403:
                print(f"\nERROR 403: Service account lacks Full/Owner access to GSC property '{site_url}'.", file=sys.stderr)
                print("Fix: GSC → Settings → Users and permissions → Add the SA as Full user.", file=sys.stderr)
                sys.exit(3)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            if attempt < retries - 1:
                wait = 2 ** attempt
                print(f"  retry {attempt+1} for {inspection_url} after {wait}s: {e}", file=sys.stderr)
                time.sleep(wait)
            else:
                return {"error": str(e), "inspection_url": inspection_url}
    return {}


def extract_fields(api_resp: dict) -> dict:
    """Flatten the API response to our standard field set."""
    result = api_resp.get("inspectionResult", api_resp.get("urlInspectionResult", {}))
    idx = result.get("indexStatusResult", {})
    mobile = result.get("mobileUsabilityResult", {})

    verdict_map = {
        "VERDICT_UNSPECIFIED": "NEUTRAL",
        "PASS": "PASS",
        "PARTIAL": "PARTIAL",
        "FAIL": "FAIL",
        "NEUTRAL": "NEUTRAL",
    }

    coverage = idx.get("coverageState", "")
    verdict = verdict_map.get(idx.get("verdict", ""), idx.get("verdict", ""))
    robots_state = idx.get("robotsTxtState", "")
    indexing_state = idx.get("indexingState", "")
    page_fetch = idx.get("pageFetchState", "")
    google_canon = idx.get("googleCanonical", "")
    user_canon = idx.get("userCanonical", "")
    last_crawl = idx.get("lastCrawlTime", "")
    referring_urls = idx.get("referringUrls", [])

    return {
        "coverage_state": coverage,
        "verdict": verdict,
        "robots_txt_state": robots_state,
        "indexing_state": indexing_state,
        "page_fetch_state": page_fetch,
        "google_canonical": google_canon,
        "user_canonical": user_canon,
        "last_crawl_time": last_crawl,
        "referring_urls": referring_urls,
        "mobile_verdict": mobile.get("verdict", ""),
        "raw": result,
    }


# ── Checkpoint helpers ─────────────────────────────────────────────────────────
def load_existing(json_path: Path) -> dict:
    if json_path.exists():
        with open(json_path) as f:
            return json.load(f)
    return {"inspected": {}, "deferred": [], "skipped_sitemaps": [], "partial": False}


def save_checkpoint(data: dict, json_path: Path):
    tmp = json_path.with_suffix(".tmp")
    with open(tmp, "w") as f:
        json.dump(data, f, indent=2)
    tmp.replace(json_path)


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="GSC URL Inspection sweep")
    parser.add_argument("--base-url", required=True, help="Site base URL, e.g. https://example.com")
    parser.add_argument("--out", default="reports/indexing-pass", help="Output directory")
    parser.add_argument("--url", help="Single URL for smoke test (prints JSON, exits)")
    parser.add_argument("--urls-file", help="File with one URL per line to inspect")
    parser.add_argument("--resume", action="store_true", help="Resume from existing dated JSON")
    parser.add_argument("--recheck-indexed", action="store_true", help="Re-inspect already-indexed URLs")
    parser.add_argument("--max-noindexed", type=int, default=200,
                        help="Stop after this many non-indexed URLs (0=no cap)")
    parser.add_argument("--site-url", help="GSC property override (e.g. sc-domain:example.com)")
    parser.add_argument("--sa-file", help="Path to service-account JSON")
    parser.add_argument("--limit", type=int, default=0, help="Inspect at most N URLs total")
    args = parser.parse_args()

    base_url = args.base_url.rstrip("/")
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    today = date.today().isoformat()
    json_path = out_dir / f"{today}.inspection.json"

    # Derive GSC property
    site_url = args.site_url
    if not site_url:
        from urllib.parse import urlparse
        parsed = urlparse(base_url)
        domain = parsed.netloc
        site_url = f"sc-domain:{domain}"

    # Load credentials
    creds = load_credentials(args.sa_file)

    # Build an authenticated requests session
    import requests
    from google.auth.transport.requests import Request as GoogleRequest

    class AuthSession(requests.Session):
        def __init__(self, credentials):
            super().__init__()
            self._creds = credentials
            self._refresh()

        def _refresh(self):
            req = GoogleRequest(requests.Session())
            self._creds.refresh(req)
            self.headers.update({"Authorization": f"Bearer {self._creds.token}"})

        def request(self, method, url, **kwargs):
            if not self._creds.valid:
                self._refresh()
            return super().request(method, url, **kwargs)

    session = AuthSession(creds)

    # ── Smoke test mode ──────────────────────────────────────────────────────
    if args.url:
        print(f"Smoke-testing {args.url} against {site_url} ...")
        resp = inspect_url(session, site_url, args.url)
        fields = extract_fields(resp)
        print(json.dumps(fields, indent=2))
        return

    # ── Load existing data (for resume / baseline) ───────────────────────────
    existing_data = load_existing(json_path)
    already_inspected = existing_data.get("inspected", {})

    # Load prior sweep for "skip already-indexed" baseline (most recent *.inspection.json != today)
    prior_indexed = set()
    if not args.recheck_indexed:
        prior_files = sorted(out_dir.glob("*.inspection.json"))
        for pf in reversed(prior_files):
            if pf == json_path:
                continue
            try:
                with open(pf) as f:
                    prior = json.load(f)
                for u, info in prior.get("inspected", {}).items():
                    if info.get("coverage_state") == "Submitted and indexed":
                        prior_indexed.add(u)
            except Exception:
                pass
            break  # only most recent

    # ── Determine URL list ───────────────────────────────────────────────────
    skipped_sitemaps = existing_data.get("skipped_sitemaps", [])

    if args.urls_file:
        with open(args.urls_file) as f:
            candidate_urls = [line.strip() for line in f if line.strip()]
        # Merge into existing data if --resume
        if args.resume:
            print(f"Merging {len(candidate_urls)} URLs from {args.urls_file} into existing sweep ...")
    else:
        print(f"Fetching sitemap from {base_url}/sitemap.xml ...")
        candidate_urls, new_skipped = fetch_sitemap_urls(base_url)
        skipped_sitemaps = list(set(skipped_sitemaps + new_skipped))
        print(f"  Found {len(candidate_urls)} URLs in sitemap(s). Skipped sitemaps: {len(skipped_sitemaps)}")

    # Filter to-do list
    todo = []
    carried_forward = 0
    skipped_prior_indexed = 0
    for u in candidate_urls:
        if args.resume and u in already_inspected:
            continue
        if u in prior_indexed and not args.recheck_indexed:
            skipped_prior_indexed += 1
            # Carry forward from prior sweep
            already_inspected[u] = {"coverage_state": "Submitted and indexed",
                                     "carried_forward": True, "verdict": "PASS",
                                     "robots_txt_state": "", "indexing_state": "",
                                     "page_fetch_state": "", "google_canonical": "",
                                     "user_canonical": "", "last_crawl_time": "",
                                     "referring_urls": [], "mobile_verdict": "", "raw": {}}
            carried_forward += 1
            continue
        todo.append(u)

    if args.limit > 0:
        todo = todo[: args.limit]

    print(f"  To inspect: {len(todo)} | Carried forward (indexed): {carried_forward} | "
          f"Already done (resume): {len(already_inspected) - carried_forward}")

    # ── Sweep ────────────────────────────────────────────────────────────────
    noindex_count = 0
    partial = existing_data.get("partial", False)
    deferred = list(existing_data.get("deferred", []))
    checkpoint_every = 25

    # Count non-indexed already found (for --max-noindexed accounting on resume)
    for u, info in already_inspected.items():
        cs = info.get("coverage_state", "")
        if cs and cs != "Submitted and indexed":
            noindex_count += 1

    stop_signal = [False]

    def _sighandler(sig, frame):
        print("\nInterrupt — saving checkpoint ...", file=sys.stderr)
        stop_signal[0] = True

    signal.signal(signal.SIGTERM, _sighandler)
    signal.signal(signal.SIGINT, _sighandler)

    for i, url in enumerate(todo):
        if stop_signal[0]:
            print("Stopping early — re-run with --resume to continue.")
            partial = True
            deferred.extend(todo[i:])
            break

        if args.max_noindexed > 0 and noindex_count >= args.max_noindexed:
            print(f"\nReached --max-noindexed cap ({args.max_noindexed}). Deferring remaining {len(todo) - i} URLs.")
            partial = True
            deferred.extend(todo[i:])
            break

        print(f"  [{i+1}/{len(todo)}] {url}", end="\r", flush=True)
        resp = inspect_url(session, site_url, url)
        fields = extract_fields(resp)
        already_inspected[url] = fields

        cs = fields.get("coverage_state", "")
        if cs and cs != "Submitted and indexed":
            noindex_count += 1

        if (i + 1) % checkpoint_every == 0:
            save_checkpoint(
                {"inspected": already_inspected, "deferred": deferred,
                 "skipped_sitemaps": skipped_sitemaps, "partial": partial,
                 "site_url": site_url, "base_url": base_url, "sweep_date": today},
                json_path,
            )

        # Respect API quota — ~1 req/sec is safe
        time.sleep(1.1)

    print()  # newline after \r progress

    # Final save
    final_data = {
        "inspected": already_inspected,
        "deferred": deferred,
        "skipped_sitemaps": skipped_sitemaps,
        "partial": partial,
        "site_url": site_url,
        "base_url": base_url,
        "sweep_date": today,
        "total": len(already_inspected),
    }
    save_checkpoint(final_data, json_path)

    # ── Coverage breakdown ───────────────────────────────────────────────────
    from collections import Counter
    counts = Counter(v.get("coverage_state", "unknown") for v in already_inspected.values())
    print("\nCoverage state breakdown:")
    for state, n in counts.most_common():
        print(f"  {n:4d}  {state}")
    print(f"\nTotal inspected: {len(already_inspected)} | Non-indexed: {noindex_count} | "
          f"Deferred: {len(deferred)} | Partial: {partial}")

    # ── CSV ──────────────────────────────────────────────────────────────────
    csv_path = out_dir / f"{today}.urls.csv"
    with open(csv_path, "w") as f:
        f.write("url,coverage_state,verdict,google_canonical,user_canonical,last_crawl_time\n")
        for u, info in already_inspected.items():
            def esc(v):
                return f'"{v}"' if "," in str(v) else str(v)
            f.write(f"{esc(u)},{esc(info.get('coverage_state',''))},{esc(info.get('verdict',''))},"
                    f"{esc(info.get('google_canonical',''))},{esc(info.get('user_canonical',''))},"
                    f"{esc(info.get('last_crawl_time',''))}\n")

    print(f"\nSaved: {json_path}")
    print(f"CSV:   {csv_path}")
    if partial:
        print(f"NOTE: Sweep is partial. Re-run with --resume to continue.")
    if skipped_sitemaps:
        print(f"WARNING: {len(skipped_sitemaps)} sitemap(s) could not be fetched: {skipped_sitemaps}")


if __name__ == "__main__":
    main()
