#!/usr/bin/env python3
"""Technical site audit — DataForSEO OnPage fallback, in Ahrefs' issue vocabulary.

Why this exists: `/ahrefs-site-audit-auto` used to email failure and skip the
whole run when the Ahrefs MCP was unreachable or the workspace was out of units
-- exactly the "blocked on one dry vendor" failure the keyword demand ladder
exists to prevent (see .claude/commands/_keyword-demand-ladder.md). Ahrefs Site
Audit stays PREFERRED; this is the rung below it.

The contract that makes the fallback free downstream: **this module emits the
Ahrefs issue slugs the skill's fix table already keys on** (`no_h1_tag`,
`title_too_long`, `img_missing_alt`, ...). The auditor changes; the fix table,
severity ordering, gates and email do not.

Coverage vs Ahrefs (verified live against DataForSEO OnPage, 52 checks/page):
near-parity on everything the fix table can auto-fix. Genuinely NOT covered ->
reported under `unavailable_on_this_source` so a run never silently claims a
clean bill of health for a check it never ran.

Cost: on_page/instant_pages is ~$0.00015 per URL -- a 200-page site is ~$0.03.
Synchronous (no crawl task to poll), so it fits a cron run with no new state.

Usage:
    python3 scripts/lib/site_audit.py audit \\
        --base-url https://www.layer3labs.io \\
        --sitemap https://www.layer3labs.io/sitemap.xml \\
        --out reports/site-audit/2026-08-28.dataforseo.json

    # or audit an explicit list
    python3 scripts/lib/site_audit.py audit --base-url https://x.com --urls-file urls.txt

Stdlib only. No pip installs. Key resolves exactly like every other fleet key
(env -> .claude/routines.config -> ~/.claude/secrets.env) via dataforseo.py.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dataforseo as dfs  # noqa: E402

# --- the mapping table -----------------------------------------------------
# left: DataForSEO OnPage check (True == the problem is present)
# right: the Ahrefs issue slug the skill's fix table already keys on.
# Verified against a live on_page/instant_pages response, not from docs.
DFS_TO_AHREFS = {
    "no_h1_tag":            "h1_missing",
    "no_title":             "title_missing",
    "title_too_long":       "title_too_long",
    "title_too_short":      "title_too_short",
    "duplicate_title_tag":  "title_duplicate",
    "no_description":       "meta_desc_missing",
    "no_image_alt":         "img_missing_alt",
    "https_to_http_links":  "mixed_content_link",
    "is_broken":            "broken_internal_link",
    "broken_links":         "broken_internal_link",
    "broken_resources":     "broken_external_link",
    "has_micromarkup_errors": "schema_invalid",
    "low_content_rate":     "low_text_html_ratio",
    "low_character_count":  "low_word_count",
    "has_meta_refresh_redirect": "redirect_chain",
    "duplicate_meta_tags":  "duplicate_meta",
}

# Checks Ahrefs runs that DataForSEO's OnPage payload cannot answer. Reported
# explicitly rather than silently omitted -- a missing check is not a pass.
UNAVAILABLE = [
    "canonical_to_redirect", "canonical_to_4xx", "redirect_loop",
    "hreflang_mismatch", "lang_missing", "noindex_in_sitemap",
]

MAX_TITLE, MIN_TITLE = 60, 30
MAX_DESC, MIN_DESC = 155, 70


def _fetch(url: str, timeout: int = 20) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "layer3-site-audit/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def sitemap_urls(sitemap_url: str, cap: int = 500) -> list[str]:
    """Flatten a sitemap or sitemap index into a URL list."""
    seen, out, queue = set(), [], [sitemap_url]
    while queue and len(out) < cap:
        sm = queue.pop(0)
        if sm in seen:
            continue
        seen.add(sm)
        try:
            xml = _fetch(sm)
        except Exception as e:
            print(f"[site_audit] sitemap unreadable {sm}: {str(e)[:80]}", file=sys.stderr)
            continue
        locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml)
        if "<sitemapindex" in xml:
            queue.extend(locs)
        else:
            for u in locs:
                if u not in out:
                    out.append(u)
                if len(out) >= cap:
                    break
    return out


def _page_issues(item: dict, base_host: str) -> list[dict]:
    """One DataForSEO page item -> issue rows in Ahrefs vocabulary."""
    url = item.get("url", "")
    checks = item.get("checks", {}) or {}
    meta = item.get("meta", {}) or {}
    issues: list[dict] = []

    def add(kind: str, detail: str = "") -> None:
        issues.append({"kind": kind, "url": url, "detail": detail})

    for dfs_key, slug in DFS_TO_AHREFS.items():
        val = checks.get(dfs_key, item.get(dfs_key))
        if val is True:
            add(slug, f"dataforseo:{dfs_key}")

    # Length rules DataForSEO reports as booleans only for title; compute the
    # description ones ourselves so the fix table's too_short/too_long rows exist.
    desc = (meta.get("description") or "").strip()
    if desc and len(desc) > MAX_DESC:
        add("meta_desc_too_long", f"{len(desc)} chars")
    elif desc and len(desc) < MIN_DESC:
        add("meta_desc_too_short", f"{len(desc)} chars")

    # Multiple H1s: the boolean only covers "none", so count the htags.
    h1s = (meta.get("htags") or {}).get("h1") or []
    if len(h1s) > 1:
        add("h1_multiple", f"{len(h1s)} H1s")

    # Canonical: DataForSEO exposes the value, not a verdict.
    canonical = (meta.get("canonical") or "").strip()
    if not canonical:
        add("canonical_missing", "no <link rel=canonical>")

    sc = item.get("status_code")
    if isinstance(sc, int) and sc >= 400:
        add("page_4xx_5xx", f"status {sc}")

    return issues


def audit(base_url: str, urls: list[str], cap: int = 300) -> dict:
    """Audit `urls` through DataForSEO OnPage. Returns the normalized report."""
    if not dfs.available():
        raise RuntimeError("DataForSEO unavailable (no key or DFS_ENABLED=0)")
    base_host = re.sub(r"^https?://", "", base_url).strip("/").split("/")[0]
    urls = urls[:cap]
    issues, audited, failed = [], [], []

    # DataForSEO rejects >5 same-host tasks in one POST ("duplicate crawl host"),
    # so batch at 5. A rejected task is NOT a clean page -- it is recorded and
    # retried once on its own, then reported as failed.
    BATCH = 5
    pending = list(urls)
    retried: set[str] = set()

    while pending:
        batch, pending = pending[:BATCH], pending[BATCH:]
        try:
            body = dfs._post("on_page/instant_pages",
                             [{"url": u, "enable_javascript": False} for u in batch])
        except Exception as e:
            failed.extend({"url": u, "reason": str(e)[:120]} for u in batch)
            print(f"[site_audit] batch failed: {str(e)[:110]}", file=sys.stderr)
            continue

        for idx, task in enumerate(body.get("tasks") or []):
            url = batch[idx] if idx < len(batch) else None
            got = False
            for res in (task.get("result") or []):
                for item in (res.get("items") or []):
                    got = True
                    audited.append(item.get("url"))
                    issues.extend(_page_issues(item, base_host))
            if got:
                continue
            msg = str(task.get("status_message"))[:120]
            if url and url not in retried:       # one lone retry, then give up
                retried.add(url)
                pending.append(url)
            elif url:
                failed.append({"url": url, "reason": msg})
                print(f"[site_audit] page not audited: {url} -- {msg}", file=sys.stderr)

    by_kind: dict[str, int] = {}
    for it in issues:
        by_kind[it["kind"]] = by_kind.get(it["kind"], 0) + 1

    return {
        "source": "dataforseo",           # the skill prints this in the email
        "base_url": base_url,
        "pages_requested": len(urls),
        "pages_audited": len(audited),
        "pages_failed": failed,
        "issue_count": len(issues),
        "by_kind": dict(sorted(by_kind.items(), key=lambda kv: -kv[1])),
        "issues": issues,
        "unavailable_on_this_source": UNAVAILABLE,
        "cost_usd": round(dfs.spent(), 5),
    }


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("audit")
    a.add_argument("--base-url", required=True)
    a.add_argument("--sitemap")
    a.add_argument("--urls-file")
    a.add_argument("--cap", type=int, default=300)
    a.add_argument("--out")
    ns = ap.parse_args(argv)

    if ns.urls_file:
        urls = [l.strip() for l in open(ns.urls_file) if l.strip()]
    else:
        sm = ns.sitemap or ns.base_url.rstrip("/") + "/sitemap.xml"
        urls = sitemap_urls(sm, cap=ns.cap)
    if not urls:
        print("[site_audit] no URLs to audit", file=sys.stderr)
        return 2

    rep = audit(ns.base_url, urls, cap=ns.cap)
    out = json.dumps(rep, indent=1)
    if ns.out:
        os.makedirs(os.path.dirname(ns.out) or ".", exist_ok=True)
        with open(ns.out, "w") as fh:
            fh.write(out)
        print(f"[site_audit] {rep['pages_audited']} pages, {rep['issue_count']} issues, "
              f"${rep['cost_usd']} -> {ns.out}")
    else:
        print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
