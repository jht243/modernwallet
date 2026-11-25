#!/usr/bin/env python3
"""Technical site audit — DataForSEO OnPage fallback + $0 local blind-spot verifier,
in Ahrefs' issue vocabulary.

Why this exists: `/ahrefs-site-audit-auto` used to email failure and skip the
whole run when the Ahrefs MCP was unreachable or the workspace was out of units
-- exactly the "blocked on one dry vendor" failure the keyword demand ladder
exists to prevent (see .claude/commands/_keyword-demand-ladder.md). Ahrefs Site
Audit stays PREFERRED; DataForSEO OnPage + local HTTP/HTML verification is the
rung below it, and `local-audit` runs all critical technical checks at $0.00
even when both Ahrefs and DataForSEO have zero credits.

Coverage vs Ahrefs:
  1. DataForSEO OnPage (52 checks/page, ~$0.00015/URL) covers title/meta/H1/alt/
     broken-link/schema/word-count checks.
  2. Built-in $0 local HTTP + HTML verifier closes ALL SIX former DataForSEO
     blind spots (`canonical_to_redirect`, `canonical_to_4xx`, `redirect_loop`,
     `hreflang_mismatch`, `lang_missing`, `noindex_in_sitemap`) directly against
     live URLs and sitemaps (`UNAVAILABLE = []`).

Usage:
    python3 scripts/lib/site_audit.py audit \\
        --base-url https://www.layer3labs.io \\
        --sitemap https://www.layer3labs.io/sitemap.xml \\
        --out reports/site-audit/2026-11-25.dataforseo.json

    # $0 pure-local technical audit (zero vendor credits required):
    python3 scripts/lib/site_audit.py local-audit \\
        --base-url https://www.layer3labs.io \\
        --sitemap https://www.layer3labs.io/sitemap.xml \\
        --out reports/site-audit/2026-11-25.local.json
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    import dataforseo as dfs  # noqa: E402
except Exception:  # pragma: no cover - local-audit works even without dataforseo.py
    dfs = None

# --- the mapping table -----------------------------------------------------
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

# All 6 former DataForSEO blind spots are now verified locally at $0.
UNAVAILABLE: list[str] = []

MAX_TITLE, MIN_TITLE = 60, 30
MAX_DESC, MIN_DESC = 155, 70
UA = "layer3-site-audit/1.1 (+https://www.layer3labs.io)"
LANG_RE = re.compile(r"^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$")
HREFLANG_RE = re.compile(r"^(?:x-default|[a-zA-Z]{2,3}(?:-[a-zA-Z]{2}|-[0-9]{3})?)$")


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


_NO_REDIRECT_OPENER = urllib.request.build_opener(_NoRedirect)


def _fetch(url: str, timeout: int = 20) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def _single_hop(url: str, timeout: int = 15) -> tuple[int, dict[str, str], str]:
    """Perform one HTTP GET without following redirects -> (status, lower_headers, html_sample)."""
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml,*/*"})
    try:
        with _NO_REDIRECT_OPENER.open(req, timeout=timeout) as resp:
            hdrs = {k.lower(): v for k, v in resp.headers.items()}
            body = resp.read(524288).decode("utf-8", "replace")
            return resp.status, hdrs, body
    except urllib.error.HTTPError as e:
        hdrs = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
        try:
            body = e.read(65536).decode("utf-8", "replace") if e.fp else ""
        except Exception:
            body = ""
        return e.code, hdrs, body
    except Exception:
        return 0, {}, ""


def _trace_url(url: str, max_hops: int = 10, timeout: int = 15) -> dict:
    """Follow redirects manually to detect loops, chains, final status, headers, and HTML."""
    cur = url
    visited = [cur]
    hops = 0
    while hops <= max_hops:
        code, hdrs, body = _single_hop(cur, timeout=timeout)
        if code in (301, 302, 303, 307, 308):
            loc = (hdrs.get("location") or "").strip()
            if not loc:
                return {"initial_status": code if hops == 0 else visited_first_code,
                        "final_status": code, "final_url": cur, "hops": hops,
                        "loop": False, "headers": hdrs, "body": body}
            nxt = urllib.parse.urljoin(cur, loc)
            if hops == 0:
                visited_first_code = code
            hops += 1
            if nxt in visited or hops > max_hops:
                return {"initial_status": visited_first_code, "final_status": code,
                        "final_url": nxt, "hops": hops, "loop": True,
                        "chain": visited + [nxt], "headers": hdrs, "body": ""}
            visited.append(nxt)
            cur = nxt
            continue
        first_code = code if hops == 0 else visited_first_code
        return {"initial_status": first_code, "final_status": code, "final_url": cur,
                "hops": hops, "loop": False, "headers": hdrs, "body": body}
    return {"initial_status": 0, "final_status": 0, "final_url": cur, "hops": hops, "loop": True, "headers": {}, "body": ""}


class _HeadSignalsParser(HTMLParser):
    """Extract <html lang>, <title>, meta description/robots, <link rel=canonical|alternate>, and <h1>."""
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.html_seen = False
        self.html_lang: str | None = None
        self.canonical: str | None = None
        self.robots_directives: list[str] = []
        self.hreflangs: list[tuple[str, str]] = []
        self.title_parts: list[str] = []
        self._in_title = False
        self.description: str = ""
        self.h1_count = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        t = tag.lower()
        ad = {k.lower(): (v or "").strip() for k, v in attrs if k}
        if t == "html" and not self.html_seen:
            self.html_seen = True
            self.html_lang = ad.get("lang")
        elif t == "title":
            self._in_title = True
        elif t == "h1":
            self.h1_count += 1
        elif t == "meta":
            name = ad.get("name", "").lower()
            content = ad.get("content", "")
            if name in ("robots", "googlebot") and content:
                self.robots_directives.append(content.lower())
            elif name == "description" and not self.description:
                self.description = content.strip()
        elif t == "link":
            rels = {r.lower() for r in ad.get("rel", "").split() if r}
            href = ad.get("href", "")
            if "canonical" in rels and href and self.canonical is None:
                self.canonical = href
            if "alternate" in rels and "hreflang" in ad and href:
                self.hreflangs.append((ad["hreflang"].strip(), href))

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)


def _norm_url(u: str) -> str:
    p = urllib.parse.urlsplit(u.strip())
    path = p.path.rstrip("/") or "/"
    return urllib.parse.urlunsplit((p.scheme.lower(), p.netloc.lower(), path, p.query, ""))


def _has_noindex(headers: dict[str, str], robots_meta: list[str]) -> bool:
    xrt = headers.get("x-robots-tag", "").lower()
    if "noindex" in xrt:
        return True
    return any("noindex" in m for m in robots_meta)


def local_blindspot_audit(urls: list[str], from_sitemap: bool = True,
                          include_core_onpage: bool = False,
                          workers: int = 8) -> tuple[list[dict], int, list[dict]]:
    """Run all 6 $0 local blind-spot checks (plus core HTML checks when include_core_onpage=True).
    Returns (issues, pages_audited_count, failed_pages)."""
    if not urls:
        return [], 0, []

    with ThreadPoolExecutor(max_workers=max(1, workers)) as ex:
        traces = list(ex.map(_trace_url, urls))

    parsed_pages: dict[str, tuple[dict, _HeadSignalsParser]] = {}
    issues: list[dict] = []
    failed: list[dict] = []
    audited_count = 0
    canonical_targets: set[str] = set()
    hreflang_targets: set[str] = set()

    for url, tr in zip(urls, traces):
        if tr["final_status"] == 0 and not tr.get("loop"):
            failed.append({"url": url, "reason": "unreachable (status 0)"})
            continue
        audited_count += 1
        if tr.get("loop"):
            issues.append({"kind": "redirect_loop", "url": url,
                           "detail": f"loop after {tr['hops']} hops -> {tr['final_url']}"})
            continue

        p = _HeadSignalsParser()
        if tr["body"]:
            try:
                p.feed(tr["body"])
            except Exception:
                pass
        parsed_pages[url] = (tr, p)

        # 1. noindex_in_sitemap
        if from_sitemap and _has_noindex(tr["headers"], p.robots_directives):
            issues.append({"kind": "noindex_in_sitemap", "url": url,
                           "detail": "sitemap URL carries noindex directive"})

        # 2. lang_missing (only on 200 HTML documents)
        if tr["final_status"] == 200 and p.html_seen:
            lang = (p.html_lang or "").strip()
            if not lang or not LANG_RE.match(lang):
                issues.append({"kind": "lang_missing", "url": url,
                               "detail": f"missing or invalid <html lang> ({lang or 'empty'})"})

        # Collect canonical & hreflang targets for deduplicated probing
        if p.canonical:
            abs_can = urllib.parse.urljoin(tr["final_url"], p.canonical)
            canonical_targets.add(abs_can)
        for hl_code, hl_href in p.hreflangs:
            abs_hl = urllib.parse.urljoin(tr["final_url"], hl_href)
            hreflang_targets.add(abs_hl)

        if include_core_onpage:
            if tr["final_status"] >= 400:
                issues.append({"kind": "page_4xx_5xx", "url": url, "detail": f"status {tr['final_status']}"})
                continue
            title = "".join(p.title_parts).strip()
            if not title:
                issues.append({"kind": "title_missing", "url": url, "detail": "local:no_title"})
            elif len(title) > MAX_TITLE:
                issues.append({"kind": "title_too_long", "url": url, "detail": f"{len(title)} chars"})
            elif len(title) < MIN_TITLE:
                issues.append({"kind": "title_too_short", "url": url, "detail": f"{len(title)} chars"})
            if not p.description:
                issues.append({"kind": "meta_desc_missing", "url": url, "detail": "local:no_description"})
            elif len(p.description) > MAX_DESC:
                issues.append({"kind": "meta_desc_too_long", "url": url, "detail": f"{len(p.description)} chars"})
            elif len(p.description) < MIN_DESC:
                issues.append({"kind": "meta_desc_too_short", "url": url, "detail": f"{len(p.description)} chars"})
            if p.h1_count == 0:
                issues.append({"kind": "h1_missing", "url": url, "detail": "local:no_h1"})
            elif p.h1_count > 1:
                issues.append({"kind": "h1_multiple", "url": url, "detail": f"{p.h1_count} H1s"})
            if not p.canonical:
                issues.append({"kind": "canonical_missing", "url": url, "detail": "no <link rel=canonical>"})

    # Reuse already-traced URLs where possible; probe unseen canonical/hreflang URLs
    known_traces: dict[str, dict] = {u: tr for u, (tr, _) in parsed_pages.items()}
    for u, (tr, _) in list(parsed_pages.items()):
        known_traces[tr["final_url"]] = tr

    extra_urls = sorted((canonical_targets | hreflang_targets) - set(known_traces.keys()))
    if extra_urls:
        with ThreadPoolExecutor(max_workers=max(1, workers)) as ex:
            for u, tr in zip(extra_urls, ex.map(_trace_url, extra_urls)):
                known_traces[u] = tr

    # 3 & 4 & 5: canonical_to_redirect, canonical_to_4xx, redirect_loop on canonical
    for url, (tr, p) in parsed_pages.items():
        if not p.canonical:
            continue
        abs_can = urllib.parse.urljoin(tr["final_url"], p.canonical)
        ctr = known_traces.get(abs_can)
        if not ctr:
            continue
        if ctr.get("loop"):
            issues.append({"kind": "redirect_loop", "url": url,
                           "detail": f"canonical {abs_can} enters redirect loop"})
        elif ctr["initial_status"] in (301, 302, 303, 307, 308):
            if ctr["final_status"] >= 400 or ctr["final_status"] == 0:
                issues.append({"kind": "canonical_to_4xx", "url": url,
                               "detail": f"canonical {abs_can} redirects to status {ctr['final_status']}"})
            else:
                issues.append({"kind": "canonical_to_redirect", "url": url,
                               "detail": f"canonical {abs_can} returns {ctr['initial_status']} -> {ctr['final_url']}"})
        elif ctr["initial_status"] >= 400 or ctr["initial_status"] == 0:
            issues.append({"kind": "canonical_to_4xx", "url": url,
                           "detail": f"canonical {abs_can} returns status {ctr['initial_status']}"})

    # 6. hreflang_mismatch (invalid code, missing self-reference, or missing return tag)
    parsed_by_norm: dict[str, _HeadSignalsParser] = {}
    for u, (tr, p) in parsed_pages.items():
        parsed_by_norm[_norm_url(u)] = p
        parsed_by_norm[_norm_url(tr["final_url"])] = p
    for u in extra_urls:
        tr = known_traces.get(u)
        if tr and tr.get("body") and tr["final_status"] == 200:
            hp = _HeadSignalsParser()
            try:
                hp.feed(tr["body"])
                parsed_by_norm[_norm_url(u)] = hp
                parsed_by_norm[_norm_url(tr["final_url"])] = hp
            except Exception:
                pass

    for url, (tr, p) in parsed_pages.items():
        if not p.hreflangs:
            continue
        self_norm = _norm_url(tr["final_url"])
        bad_codes = [code for code, _ in p.hreflangs if not HREFLANG_RE.match(code)]
        if bad_codes:
            issues.append({"kind": "hreflang_mismatch", "url": url,
                           "detail": f"invalid hreflang code(s): {', '.join(bad_codes[:3])}"})
            continue
        alt_norms = [_norm_url(urllib.parse.urljoin(tr["final_url"], h)) for _, h in p.hreflangs]
        if self_norm not in alt_norms and _norm_url(url) not in alt_norms:
            issues.append({"kind": "hreflang_mismatch", "url": url,
                           "detail": "missing self-referencing hreflang tag"})
            continue
        for code, href in p.hreflangs:
            target_abs = urllib.parse.urljoin(tr["final_url"], href)
            target_norm = _norm_url(target_abs)
            if target_norm == self_norm:
                continue
            tp = parsed_by_norm.get(target_norm)
            if tp is None:
                ttr = known_traces.get(target_abs)
                if ttr and (ttr["final_status"] >= 400 or ttr["final_status"] == 0):
                    issues.append({"kind": "hreflang_mismatch", "url": url,
                                   "detail": f"hreflang ({code}) target {target_abs} returned {ttr['final_status']}"})
                    break
                continue
            back_norms = {_norm_url(urllib.parse.urljoin(target_abs, bh)) for _, bh in tp.hreflangs}
            if self_norm not in back_norms and _norm_url(url) not in back_norms:
                issues.append({"kind": "hreflang_mismatch", "url": url,
                               "detail": f"hreflang ({code}) target {target_abs} lacks return link"})
                break

    return issues, audited_count, failed


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

    desc = (meta.get("description") or "").strip()
    if desc and len(desc) > MAX_DESC:
        add("meta_desc_too_long", f"{len(desc)} chars")
    elif desc and len(desc) < MIN_DESC:
        add("meta_desc_too_short", f"{len(desc)} chars")

    h1s = (meta.get("htags") or {}).get("h1") or []
    if len(h1s) > 1:
        add("h1_multiple", f"{len(h1s)} H1s")

    canonical = (meta.get("canonical") or "").strip()
    if not canonical:
        add("canonical_missing", "no <link rel=canonical>")

    sc = item.get("status_code")
    if isinstance(sc, int) and sc >= 400:
        add("page_4xx_5xx", f"status {sc}")

    return issues


def _dedup_issues(issues: list[dict]) -> list[dict]:
    seen = set()
    out = []
    for it in issues:
        key = (it["kind"], it["url"])
        if key not in seen:
            seen.add(key)
            out.append(it)
    return out


def local_audit(base_url: str, urls: list[str], cap: int = 300, from_sitemap: bool = True) -> dict:
    """$0 pure-local technical SEO audit covering core on-page rules + all 6 blind spots."""
    urls = urls[:cap]
    issues, audited_count, failed = local_blindspot_audit(
        urls, from_sitemap=from_sitemap, include_core_onpage=True
    )
    issues = _dedup_issues(issues)
    by_kind: dict[str, int] = {}
    for it in issues:
        by_kind[it["kind"]] = by_kind.get(it["kind"], 0) + 1
    return {
        "source": "local",
        "base_url": base_url,
        "pages_requested": len(urls),
        "pages_audited": audited_count,
        "pages_failed": failed,
        "issue_count": len(issues),
        "by_kind": dict(sorted(by_kind.items(), key=lambda kv: -kv[1])),
        "issues": issues,
        "unavailable_on_this_source": [],
        "cost_usd": 0.0,
    }


def audit(base_url: str, urls: list[str], cap: int = 300, from_sitemap: bool = True) -> dict:
    """Audit `urls` through DataForSEO OnPage + $0 local blind-spot checks (falls back to pure local if DFS unavailable)."""
    urls = urls[:cap]
    if not dfs or not dfs.available():
        print("[site_audit] DataForSEO unavailable -> running $0 local_audit fallback", file=sys.stderr)
        return local_audit(base_url, urls, cap=cap, from_sitemap=from_sitemap)

    base_host = re.sub(r"^https?://", "", base_url).strip("/").split("/")[0]
    issues, audited, failed = [], [], []

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
            if url and url not in retried:
                retried.add(url)
                pending.append(url)
            elif url:
                failed.append({"url": url, "reason": msg})
                print(f"[site_audit] page not audited: {url} -- {msg}", file=sys.stderr)

    # Augment DataForSEO results with the 6 $0 local blind-spot checks
    local_issues, _, _ = local_blindspot_audit(urls, from_sitemap=from_sitemap, include_core_onpage=False)
    issues = _dedup_issues(issues + local_issues)

    by_kind: dict[str, int] = {}
    for it in issues:
        by_kind[it["kind"]] = by_kind.get(it["kind"], 0) + 1

    return {
        "source": "dataforseo+local",
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
    for cmd_name in ("audit", "local-audit"):
        p = sub.add_parser(cmd_name)
        p.add_argument("--base-url", required=True)
        p.add_argument("--sitemap")
        p.add_argument("--urls-file")
        p.add_argument("--cap", type=int, default=300)
        p.add_argument("--out")
    ns = ap.parse_args(argv)

    from_sitemap = not bool(ns.urls_file)
    if ns.urls_file:
        urls = [l.strip() for l in open(ns.urls_file) if l.strip()]
    else:
        sm = ns.sitemap or ns.base_url.rstrip("/") + "/sitemap.xml"
        urls = sitemap_urls(sm, cap=ns.cap)
    if not urls:
        print("[site_audit] no URLs to audit", file=sys.stderr)
        return 2

    if ns.cmd == "local-audit":
        rep = local_audit(ns.base_url, urls, cap=ns.cap, from_sitemap=from_sitemap)
    else:
        rep = audit(ns.base_url, urls, cap=ns.cap, from_sitemap=from_sitemap)
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
