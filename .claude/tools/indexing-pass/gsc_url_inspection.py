#!/usr/bin/env python3
"""
GSC URL Inspection sweep — GLOBAL, project-agnostic data source for /indexing-pass.

Self-contained: imports NO project code, so the same script works for every
site under one Google Search Console service account (banthebots.org,
mindmedicinelaw.com, caracasresearch.com, …). You point it at a site; it
derives the GSC property, fetches that site's sitemap, and inspects each URL
through the Search Console URL Inspection API — the only official source of
true per-URL index status ("Page Indexing" coverage states).

Credentials (one service account for all properties). Resolved in order:
  1. --sa-file PATH
  2. env GOOGLE_REPORTING_SA_JSON   (inline JSON — matches the projects' Render secret)
  3. env GOOGLE_REPORTING_SA_FILE   (path)
  4. env GSC_SA_FILE                (path)
  5. default ~/.claude/secrets/gsc-service-account.json   ← set once, used globally
The service account must be a FULL or OWNER user of each property (scope alone
is not enough — URL Inspection 403s otherwise).

Property: --site-url wins; otherwise derived from --base-url host as
`sc-domain:<registrable-domain>` (a Domain property covers every host/scheme).

Output: per-project reports/indexing-pass/<DATE>.inspection.json under --out
(default ./reports/indexing-pass, i.e. the current project's repo).

Usage:
  # single-URL smoke test (prints JSON, writes nothing):
  gsc_url_inspection.py --base-url https://www.banthebots.org --url https://www.banthebots.org/
  # full sweep of a site's sitemap:
  gsc_url_inspection.py --base-url https://www.banthebots.org
  # another project — same script, same creds, just a different site:
  gsc_url_inspection.py --base-url https://mindmedicinelaw.com
  # explicit property / limit / output dir:
  gsc_url_inspection.py --base-url https://x.com --site-url sc-domain:x.com --limit 20 --out reports/indexing-pass
  # resume an interrupted sweep (skips URLs already done in today's JSON):
  gsc_url_inspection.py --base-url https://x.com --resume
  # inspect / gap-fill an explicit list in ONE process, merging into today's sweep:
  gsc_url_inspection.py --base-url https://x.com --urls-file missing.txt --resume
  # compare two sweeps (reindexing progress):
  gsc_url_inspection.py --verify OLD.json NEW.json

Robustness: results are checkpointed to <DATE>.inspection.json every N URLs
(--checkpoint-every, default 25) via atomic write, and on SIGTERM/SIGINT, so a
kill loses nothing — just re-run with --resume. Child sitemaps that fail after
retries are recorded under "skipped_sitemaps" (never silently dropped).

Exit codes: 0 ok, 2 no credentials, 3 first call 403 (SA lacks Full/Owner access),
130 interrupted (checkpoint written).
"""

from __future__ import annotations

import argparse
import json
import os
import signal
import sys
import time
import xml.etree.ElementTree as ET
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request as GoogleAuthRequest

SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
INSPECT_ENDPOINT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"
SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
DEFAULT_SA = Path("~/.claude/secrets/gsc-service-account.json").expanduser()
THROTTLE_SECONDS = 0.2  # well under the 600/min per-property ceiling
UA = "indexing-pass/1.0 (+gsc-url-inspection)"
INDEXED_STATE = "Submitted and indexed"  # the one "healthy" coverage state
DEFAULT_MAX_NOINDEXED = 200  # stop a run after this many non-indexed pages are found


def log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


# --------------------------------------------------------------------------- creds
def load_sa_info(sa_file: str | None) -> dict | None:
    if sa_file:
        return json.loads(Path(sa_file).expanduser().read_text(encoding="utf-8"))
    raw = os.environ.get("GOOGLE_REPORTING_SA_JSON", "").strip()
    if raw:
        return json.loads(raw)
    for env in ("GOOGLE_REPORTING_SA_FILE", "GSC_SA_FILE"):
        p = os.environ.get(env, "").strip()
        if p:
            return json.loads(Path(p).expanduser().read_text(encoding="utf-8"))
    if DEFAULT_SA.exists():
        return json.loads(DEFAULT_SA.read_text(encoding="utf-8"))
    return None


class Inspector:
    def __init__(self, sa_info: dict, site_url: str):
        self.site_url = site_url
        self._creds = service_account.Credentials.from_service_account_info(sa_info, scopes=[SCOPE])
        self._auth_req = GoogleAuthRequest()

    def _token(self) -> str:
        if not self._creds.valid:
            self._creds.refresh(self._auth_req)
        return self._creds.token

    def inspect(self, url: str, retries: int = 2) -> dict:
        """Inspect one URL. Retries transient failures (timeouts, 429, 5xx) with
        backoff so a single slow/flaky page can't stall or kill the whole run;
        after `retries` it records the error and the caller moves on."""
        try:
            token = self._token()
        except Exception as exc:  # noqa: BLE001
            return {"url": url, "success": False, "status_code": None, "error": f"token refresh failed: {exc}"[:500]}
        last: dict | None = None
        for attempt in range(retries + 1):
            try:
                resp = requests.post(
                    INSPECT_ENDPOINT,
                    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                    json={"inspectionUrl": url, "siteUrl": self.site_url},
                    timeout=30,
                )
            except Exception as exc:  # noqa: BLE001
                last = {"url": url, "success": False, "status_code": None, "error": f"http error: {exc}"[:500]}
                if attempt < retries:
                    time.sleep(2 ** attempt)
                    continue
                return last
            if resp.status_code in (429, 500, 502, 503, 504) and attempt < retries:
                time.sleep(2 ** attempt)
                continue
            if resp.status_code != 200:
                return {"url": url, "success": False, "status_code": resp.status_code, "error": (resp.text or "")[:500]}
            idx = (resp.json().get("inspectionResult", {}) or {}).get("indexStatusResult", {}) or {}
            break
        else:  # pragma: no cover — exhausted retries on transient status
            return last or {"url": url, "success": False, "status_code": None, "error": "exhausted retries"}
        return {
            "url": url,
            "success": True,
            "status_code": 200,
            "verdict": idx.get("verdict", ""),
            "coverage_state": idx.get("coverageState", ""),
            "robots_txt_state": idx.get("robotsTxtState", ""),
            "indexing_state": idx.get("indexingState", ""),
            "page_fetch_state": idx.get("pageFetchState", ""),
            "google_canonical": idx.get("googleCanonical", ""),
            "user_canonical": idx.get("userCanonical", ""),
            "last_crawl_time": idx.get("lastCrawlTime", ""),
            "referring_urls": list(idx.get("referringUrls", []) or []),
            "sitemaps": list(idx.get("sitemap", []) or []),
        }


# --------------------------------------------------------------------------- property + urls
def derive_site_url(base_url: str, explicit: str | None) -> str:
    if explicit:
        return explicit
    host = urlparse(base_url).netloc or base_url
    if host.startswith("www."):
        host = host[4:]
    return f"sc-domain:{host}"


def fetch_sitemap_urls(base_url: str) -> tuple[list[str], list[str]]:
    """Fetch <base>/sitemap.xml, following a sitemapindex one level into child
    sitemaps. Returns (page URLs, skipped child sitemaps). A child sitemap that
    still fails after retries is recorded in `skipped` — NEVER silently dropped,
    so callers know coverage is partial."""
    root_url = f"{base_url.rstrip('/')}/sitemap.xml"
    urls: list[str] = []
    skipped: list[str] = []
    try:
        root = ET.fromstring(_get(root_url))
    except Exception as exc:  # noqa: BLE001
        log(f"Could not fetch/parse {root_url} after retries: {exc}")
        return urls, [root_url]
    tag = root.tag.split("}")[-1]
    if tag == "sitemapindex":
        for sm in root.findall("sm:sitemap", SITEMAP_NS):
            loc = sm.find("sm:loc", SITEMAP_NS)
            if loc is not None and loc.text:
                try:
                    child = ET.fromstring(_get(loc.text))
                    urls += [u.find("sm:loc", SITEMAP_NS).text for u in child.findall("sm:url", SITEMAP_NS)]
                except Exception as exc:  # noqa: BLE001
                    log(f"  child sitemap {loc.text} FAILED after retries: {exc} — recorded as skipped (partial coverage)")
                    skipped.append(loc.text)
    else:  # urlset
        urls += [u.find("sm:loc", SITEMAP_NS).text for u in root.findall("sm:url", SITEMAP_NS)]
    return [u for u in urls if u], skipped


def _get(url: str, retries: int = 3, read_timeout: int = 60) -> bytes:
    """GET with retries + exponential backoff. Transient network/timeout errors
    on a sitemap fetch must NOT silently drop URLs (see fetch_sitemap_urls)."""
    last_exc: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            resp = requests.get(url, headers={"User-Agent": UA}, timeout=(15, read_timeout))
            resp.raise_for_status()
            return resp.content
        except Exception as exc:  # noqa: BLE001
            last_exc = exc
            if attempt < retries:
                backoff = 2 ** attempt  # 2s, 4s
                log(f"  fetch {url} attempt {attempt}/{retries} failed ({exc}); retrying in {backoff}s")
                time.sleep(backoff)
    raise last_exc  # type: ignore[misc]


# --------------------------------------------------------------------------- modes
def run_single(base_url: str, site_url: str, sa_info: dict, url: str) -> int:
    insp = Inspector(sa_info, site_url)
    res = insp.inspect(url)
    print(json.dumps(res, indent=2))
    if not res["success"] and res["status_code"] == 403:
        log(f"403 — service account needs FULL/OWNER access on property '{site_url}'.")
        return 3
    return 0


def write_output(out_path: Path, base_url: str, site_url: str,
                 results: list[dict], skipped_sitemaps: list[str], partial: bool,
                 extra: dict | None = None) -> None:
    """Atomically write the dated inspection JSON (tmp file + rename) so a kill
    mid-write can never corrupt or truncate the report."""
    payload = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "base_url": base_url,
        "site_url": site_url,
        "total": len(results),
        "partial": partial,
        "skipped_sitemaps": skipped_sitemaps,
        **(extra or {}),
        "results": results,
    }
    tmp = out_path.with_name(out_path.name + ".tmp")
    tmp.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    tmp.replace(out_path)


def load_url_list(urls_file: str) -> list[str]:
    lines = Path(urls_file).expanduser().read_text(encoding="utf-8").splitlines()
    return [ln.strip() for ln in lines if ln.strip() and not ln.strip().startswith("#")]


def find_baseline(out_dir: Path, today_name: str) -> dict[str, dict]:
    """Return {url: result} from the MOST RECENT prior sweep (a dated
    *.inspection.json older than today). This is the cross-run memory used to
    skip pages already known indexed. Empty if there's no prior sweep."""
    if not out_dir.exists():
        return {}
    priors = sorted(p for p in out_dir.glob("*.inspection.json") if p.name != today_name)
    for p in reversed(priors):  # ISO-dated filenames sort lexicographically
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
            return {r["url"]: r for r in data.get("results", []) if r.get("url")}
        except Exception:  # noqa: BLE001
            continue
    return {}


def run_sweep(base_url: str, site_url: str, sa_info: dict, out_dir: Path,
              limit: int | None, urls_file: str | None, resume: bool,
              checkpoint_every: int, max_noindexed: int, recheck_indexed: bool) -> int:
    # --- enumerate target URLs (explicit list wins over sitemap) ---
    explicit = bool(urls_file)
    if explicit:
        urls = load_url_list(urls_file)
        skipped_sitemaps: list[str] = []
        if not urls:
            log(f"No URLs found in --urls-file {urls_file}; aborting.")
            return 2
        log(f"Loaded {len(urls)} URLs from {urls_file}.")
    else:
        urls, skipped_sitemaps = fetch_sitemap_urls(base_url)
        if not urls:
            log("No URLs enumerated from sitemap; aborting.")
            return 2
    if limit:
        urls = urls[:limit]

    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{date.today().isoformat()}.inspection.json"

    # --- preserve prior results in today's file; merge skipped-sitemap notes ---
    results_map: dict[str, dict] = {}
    if out_path.exists():
        try:
            prev = json.loads(out_path.read_text(encoding="utf-8"))
            for r in prev.get("results", []):
                if r.get("url"):
                    results_map[r["url"]] = r
            skipped_sitemaps = sorted(set(skipped_sitemaps) | set(prev.get("skipped_sitemaps", [])))
            log(f"Found existing {out_path.name} with {len(results_map)} results (preserving).")
        except Exception as exc:  # noqa: BLE001
            log(f"Could not read existing {out_path.name} ({exc}); starting fresh.")

    # --- cross-run memory: skip pages already known indexed in the last sweep ---
    # An explicit --urls-file means "inspect exactly these", so skip-indexed is off there.
    skip_indexed = not recheck_indexed and not explicit
    baseline = find_baseline(out_dir, out_path.name) if skip_indexed else {}
    prev_indexed = {u for u, r in baseline.items()
                    if r.get("success") and r.get("coverage_state") == INDEXED_STATE}
    if skip_indexed and prev_indexed:
        log(f"Baseline: {len(prev_indexed)} pages were indexed last sweep — skipping (status carried forward).")

    # --- partition: carry-forward indexed, resume-skip done, queue the rest ---
    carried = 0
    to_do: list[str] = []
    for u in urls:
        if resume and results_map.get(u, {}).get("success"):
            continue  # already inspected successfully today
        if skip_indexed and u in prev_indexed and u not in results_map:
            r = dict(baseline[u]); r["carried_forward"] = True
            results_map[u] = r
            carried += 1
            continue
        to_do.append(u)
    if carried:
        log(f"Carried forward {carried} already-indexed pages without re-inspecting.")

    cap = max_noindexed if max_noindexed and max_noindexed > 0 else None
    log(f"Queued {len(to_do)} URLs to inspect for '{site_url}'"
        + (f"; will STOP after {cap} non-indexed pages are found" if cap else "")
        + f" (checkpoint every {checkpoint_every}) …")
    insp = Inspector(sa_info, site_url)

    deferred: list[str] = []

    # --- flush on SIGTERM/SIGINT so a kill keeps everything done so far ---
    def _flush_and_exit(signum, _frame):  # noqa: ANN001
        write_output(out_path, base_url, site_url, list(results_map.values()), skipped_sitemaps,
                     partial=True, extra={"carried_forward": carried, "deferred": deferred})
        log(f"\nSignal {signum} received — checkpointed {len(results_map)} results to {out_path}; exiting.")
        sys.exit(130)
    signal.signal(signal.SIGTERM, _flush_and_exit)
    signal.signal(signal.SIGINT, _flush_and_exit)

    had_prior_success = any(r.get("success") for r in results_map.values())
    total = len(to_do)
    noindexed_found = 0
    for i, url in enumerate(to_do, 1):
        if cap and noindexed_found >= cap:
            deferred = to_do[i - 1:]
            log(f"Cap reached: {noindexed_found} non-indexed pages found; "
                f"deferring {len(deferred)} uninspected URLs to the next pass (re-run with --resume).")
            break
        res = insp.inspect(url)
        if not res["success"] and res["status_code"] == 403 and i == 1 and not had_prior_success:
            log(f"403 on first inspection — SA is not a FULL/OWNER user of '{site_url}'. "
                f"Add it in GSC → Settings → Users and permissions, then retry.\n{res.get('error','')}")
            return 3
        results_map[url] = res
        is_noindexed = res.get("success") and res.get("coverage_state") != INDEXED_STATE
        if is_noindexed:
            noindexed_found += 1
        tag = f"  [non-indexed {noindexed_found}{'/' + str(cap) if cap else ''}]" if is_noindexed else ""
        log(f"[{i}/{total}] {url} — {res.get('coverage_state') or res.get('error') or '?'}{tag}")
        if i % checkpoint_every == 0:
            write_output(out_path, base_url, site_url, list(results_map.values()), skipped_sitemaps,
                         partial=True, extra={"carried_forward": carried, "deferred": deferred})
            log(f"  ✓ checkpoint: {len(results_map)} results saved to {out_path.name}")
        time.sleep(THROTTLE_SECONDS)

    write_output(out_path, base_url, site_url, list(results_map.values()), skipped_sitemaps,
                 partial=bool(deferred or skipped_sitemaps),
                 extra={"carried_forward": carried, "deferred": deferred})

    results = list(results_map.values())
    counts: dict[str, int] = {}
    for r in results:
        key = r["coverage_state"] if r.get("success") else f"ERROR {r.get('status_code') or ''}".strip()
        counts[key] = counts.get(key, 0) + 1
    log("\nCoverage-state breakdown:")
    for state, n in sorted(counts.items(), key=lambda kv: -kv[1]):
        log(f"  {n:4d}  {state}")
    if carried:
        log(f"  (incl. {carried} carried forward from the last sweep, not re-inspected)")
    if deferred:
        log(f"\n⏭  {len(deferred)} URLs DEFERRED (cap of {cap} non-indexed reached). "
            f"Re-run the same command with --resume to inspect them next pass.")
    if skipped_sitemaps:
        log("\n⚠ PARTIAL COVERAGE — these child sitemaps failed and their URLs were NOT inspected:")
        for s in skipped_sitemaps:
            log(f"    {s}")
        log("  Re-run the same command (it resumes), or pass those URLs via --urls-file --resume.")
    log(f"\nWrote {out_path} ({len(results)} total results)")
    return 0


def run_verify(old_path: str, new_path: str) -> int:
    old = {r["url"]: r for r in json.loads(Path(old_path).read_text())["results"]}
    new = {r["url"]: r for r in json.loads(Path(new_path).read_text())["results"]}
    improved, regressed, unchanged = [], [], 0
    INDEXED = "Submitted and indexed"
    for url, nr in new.items():
        orr = old.get(url)
        if not orr:
            continue
        o, n = orr.get("coverage_state", ""), nr.get("coverage_state", "")
        if o == n:
            unchanged += 1
        elif n == INDEXED:
            improved.append((url, o, n))
        elif o == INDEXED:
            regressed.append((url, o, n))
        else:
            improved.append((url, o, n))
    print(f"Now indexed / improved ({len(improved)}):")
    for url, o, n in improved:
        print(f"  {url} : {o} → {n}")
    if regressed:
        print(f"\nRegressed out of index ({len(regressed)}):")
        for url, o, n in regressed:
            print(f"  {url} : {o} → {n}")
    print(f"\nUnchanged: {unchanged}")
    return 0


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Global GSC URL Inspection sweep for /indexing-pass")
    ap.add_argument("--base-url", help="Site root, e.g. https://www.banthebots.org (used to derive property + fetch sitemap).")
    ap.add_argument("--site-url", help="GSC property id (e.g. sc-domain:banthebots.org). Default: derived from --base-url.")
    ap.add_argument("--url", help="Inspect a single URL and print JSON (quota-safe smoke test).")
    ap.add_argument("--limit", type=int, help="Inspect only the first N URLs (debugging).")
    ap.add_argument("--urls-file", help="Inspect URLs from this file (one per line, # comments ok) in ONE process instead of the sitemap. Use with --resume to merge into / extend today's sweep.")
    ap.add_argument("--resume", action="store_true", help="Skip URLs already inspected successfully in today's <DATE>.inspection.json; only do the missing/errored ones.")
    ap.add_argument("--checkpoint-every", type=int, default=25, help="Atomically write partial results every N URLs (default 25), so a kill loses nothing.")
    ap.add_argument("--max-noindexed", type=int, default=DEFAULT_MAX_NOINDEXED, help=f"Stop the run after this many NON-INDEXED pages are found (default {DEFAULT_MAX_NOINDEXED}); 0 = no cap. Already-indexed pages do not count. Uninspected URLs are deferred to the next --resume pass.")
    ap.add_argument("--recheck-indexed", action="store_true", help="Re-inspect pages that were 'Submitted and indexed' in the most recent prior sweep (default: skip them and carry their status forward — saves API calls on big sites).")
    ap.add_argument("--out", default="reports/indexing-pass", help="Output dir for the dated JSON (default ./reports/indexing-pass).")
    ap.add_argument("--sa-file", help="Path to the service-account JSON (overrides env / default location).")
    ap.add_argument("--verify", nargs=2, metavar=("OLD.json", "NEW.json"), help="Diff two prior sweeps.")
    args = ap.parse_args(argv)

    if args.verify:
        return run_verify(*args.verify)

    sa_info = load_sa_info(args.sa_file)
    if sa_info is None:
        log("No service-account credentials. Set one of: --sa-file, GOOGLE_REPORTING_SA_JSON, "
            f"GOOGLE_REPORTING_SA_FILE, GSC_SA_FILE, or place the JSON at {DEFAULT_SA}.")
        return 2

    if not args.base_url and not args.site_url:
        log("Provide --base-url (and optionally --site-url).")
        return 2
    base_url = (args.base_url or "").rstrip("/")
    site_url = derive_site_url(base_url, args.site_url)

    if args.url:
        return run_single(base_url, site_url, sa_info, args.url)
    return run_sweep(base_url, site_url, sa_info, Path(args.out), args.limit,
                     args.urls_file, args.resume, args.checkpoint_every,
                     args.max_noindexed, args.recheck_indexed)


if __name__ == "__main__":
    raise SystemExit(main())
