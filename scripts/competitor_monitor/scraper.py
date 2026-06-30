#!/usr/bin/env python3
"""
Competitor Publishing Monitor — scraper + diff.

Watches a roster of AI-automation/development agency sites (competitors.json) and
detects what they publish or materially update between runs. Stdlib only — no pip
deps — so it runs headlessly in a cloud routine.

It does NOT generate or publish anything. It emits a list of candidate pages
(new + materially-updated) for the /competitor-monitor-auto skill to duplicate and
improve. State persists in a git-committed JSON ledger so weekly/3x-week runs on
ephemeral cloud branches stay deduped.

Page lifecycle in the ledger (per URL):
  baseline → seen at the very first crawl of a competitor; NEVER acted on
             (pre-existing content we don't chase retroactively).
  pending  → detected as new/materially-updated; not yet resolved. Re-emitted as a
             candidate every run until `record` marks it done, so a crashed run
             never silently drops a page.
  done     → acted on (published/enriched) or deliberately skipped
             (duplicate/low-value/fetch-failed). Carries acted/our_url/disposition.

Commands:
  detect   Crawl every competitor, diff against the ledger, write the ledger's
           seen-state (+ pending markers), write a candidates file, print a summary.
           First crawl of a competitor is a QUIET SEED (everything → baseline, 0
           candidates) so there is no publish/email storm on first run.
           Use --dry-run to compute + print WITHOUT writing the ledger or candidates.
  record   Merge the skill's per-URL dispositions back into the ledger (sets `done`).
  show     Print ledger stats.

Usage:
  python3 scripts/competitor_monitor/scraper.py detect [--dry-run] [--only DOMAIN]
  python3 scripts/competitor_monitor/scraper.py detect --out reports/competitor-monitor/candidates-2026-06-28.json
  python3 scripts/competitor_monitor/scraper.py record --dispositions /tmp/dispo.json
  python3 scripts/competitor_monitor/scraper.py show
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, asdict, field
from datetime import date
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
ROSTER_FILE = HERE / "competitors.json"
LEDGER_FILE = ROOT / "reports" / "competitor-monitor" / "ledger.json"

UA = "Mozilla/5.0 (compatible; Layer3CompetitorMonitor/1.0; +https://layer3labs.io)"

# Politeness + safety caps.
FETCH_TIMEOUT = 30
SLEEP_BETWEEN_FETCHES = 0.5     # seconds
MAX_URLS_PER_COMPETITOR = 8000  # ignore sitemaps larger than this (runaway guard)
MAX_SITEMAP_DEPTH = 5           # nested sitemapindex recursion limit

# ── Classification ────────────────────────────────────────────────────────────
TOOL_RE = re.compile(r"\b(calculator|calculate|tool|assessment|quiz|configurator|estimator|simulator)\b", re.I)
COMPARISON_RE = re.compile(r"(?:\b(?:vs|versus|compare|comparison|alternative|alternatives)\b|-vs-)", re.I)

# ── Relevance gate (PORTABLE — niche terms come from competitors.json) ───────────
# Only duplicate competitor pages inside THIS project's niche. The include/exclude
# term lists live in competitors.json under "niche": {"include":[...],"exclude":[...]}
# so the same scraper works for any project. If the file has no "niche" section,
# these AI/automation defaults apply (Layer3Labs' niche). A page is ON-NICHE when
# an include term matches its url+title+outline AND no exclude term matches.
DEFAULT_NICHE_INCLUDE = [
    "ai", "artificial intelligence", "automation", "automate", "workflow", "agent",
    "agentic", "chatbot", "chat bot", "copilot", "assistant", "receptionist",
    "answering service", "voice agent", "phone agent", "missed call", "crm",
    "consulting", "consultant", "customer service", "customer support", "lead intake",
    "appointment", "scheduling", "booking", "document automation", "intake",
    "chatgpt", "claude", "gemini", "llm", "gpt", "rag", "retrieval augmented",
    "generative", "prompt", "small business", "smb", "operations", "back office",
    "no-code", "no code", "integration",
]
DEFAULT_NICHE_EXCLUDE = [
    "blockchain", "crypto", "cryptocurrency", "cardano", "ethereum", "bitcoin",
    "web3", "nft", "defi", "token", "forex", "stocks", "trading", "ios", "android",
    "mobile app", "swift", "kotlin", "flutter", "aws", "azure", "gcp", "kubernetes",
    "devops", "gaming", "game development",
]


def _compile_terms(terms: list[str] | None):
    if not terms:
        return None
    return re.compile(r"(?i)\b(" + "|".join(re.escape(t) for t in terms) + r")\b")


NICHE = _compile_terms(DEFAULT_NICHE_INCLUDE)
OFF_NICHE = _compile_terms(DEFAULT_NICHE_EXCLUDE)


def configure_niche() -> None:
    """Override NICHE/OFF_NICHE from competitors.json's "niche" section, if present.
    Call once at the start of any command that uses is_relevant()."""
    global NICHE, OFF_NICHE
    try:
        cfg = json.loads(ROSTER_FILE.read_text())
    except Exception:
        return
    niche = cfg.get("niche") if isinstance(cfg, dict) else None
    if not niche:
        return
    if niche.get("include"):
        NICHE = _compile_terms(niche["include"])
    if "exclude" in niche:  # allow an explicit empty list to disable the exclude gate
        OFF_NICHE = _compile_terms(niche["exclude"])


def is_relevant(url: str, title: str, outline: list[str]) -> tuple[bool, list[str]]:
    """Return (on_niche, matched_terms). On-niche = an include hit and no exclude hit."""
    blob = " ".join([url, title, " ".join(outline)])
    if OFF_NICHE and OFF_NICHE.search(blob):
        return False, []
    hits = sorted({m.group(0).lower() for m in NICHE.finditer(blob)}) if NICHE else []
    return (bool(hits), hits)

# Sitemap XML namespace (sitemaps.org).
SM_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"


# ── Data model ────────────────────────────────────────────────────────────────
@dataclass
class Candidate:
    competitor: str          # competitor domain key (roster "domain")
    competitor_name: str
    url: str                 # canonical URL
    title: str
    kind: str                # page | comparison | tool
    change: str              # new | updated | pending-retry
    lastmod: str
    content_hash: str
    outline: list = field(default_factory=list)   # H2/H3 text, the coverage floor
    tool_io: list = field(default_factory=list)    # labels/inputs (tool kind only)


# ── HTTP ──────────────────────────────────────────────────────────────────────
def fetch(url: str, retries: int = 2) -> str | None:
    """GET with retry/backoff on transient errors (timeouts, conn resets, 429/5xx).
    A definitive 4xx (404/410/etc.) returns None immediately — retrying won't help."""
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    last = ""
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=FETCH_TIMEOUT) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < retries:
                time.sleep(2 * (attempt + 1))  # backoff on transient server/ratelimit
                last = str(e)
                continue
            print(f"  ! fetch failed: {url} ({e})")
            return None
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            last = str(e)
            if attempt < retries:
                time.sleep(2 * (attempt + 1))  # backoff on timeout / conn reset
                continue
            print(f"  ! fetch failed: {url} ({e})")
            return None
        except Exception as e:  # never let a single bad page crash the run
            print(f"  ! fetch error: {url} ({e})")
            return None
    if last:
        print(f"  ! fetch gave up after {retries} retries: {url} ({last})")
    return None


# ── URL identity ──────────────────────────────────────────────────────────────
def canonical_url(url: str) -> str:
    """Stable identity: drop query (UTM) + fragment + trailing slash; lowercase the
    scheme+host but preserve path case (paths can be case-sensitive)."""
    if not url:
        return ""
    url = url.strip().split("#", 1)[0].split("?", 1)[0]
    p = urllib.parse.urlsplit(url)
    netloc = p.netloc.lower()
    scheme = (p.scheme or "https").lower()
    path = p.path.rstrip("/")
    return urllib.parse.urlunsplit((scheme, netloc, path, "", ""))


def domain_key(domain: str) -> str:
    d = domain.strip().lower()
    d = re.sub(r"^https?://", "", d).rstrip("/")
    return d


# ── HTML extraction (stdlib only, regex-light) ────────────────────────────────
def _strip_blocks(html: str) -> str:
    html = re.sub(r"(?is)<script\b.*?</script>", " ", html)
    html = re.sub(r"(?is)<style\b.*?</style>", " ", html)
    html = re.sub(r"(?is)<noscript\b.*?</noscript>", " ", html)
    return html


def _strip_chrome(html: str) -> str:
    """Drop nav/header/footer/aside so site-wide menu & footer headings don't
    pollute the article outline. Approximate (non-nested) but good enough."""
    h = _strip_blocks(html)
    h = re.sub(r"(?is)<(nav|header|footer|aside)\b[^>]*>.*?</\1>", " ", h)
    return h


def _headings(html: str, levels: str = "123") -> list[str]:
    out: list[str] = []
    for m in re.finditer(rf"(?is)<h([{levels}])[^>]*>(.*?)</h\1>", html):
        text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(2))).strip()
        if text:
            out.append(text)
    return out


def boilerplate_headings(domain: str) -> set[str]:
    """Headings that appear on the competitor's HOMEPAGE — i.e. menu/footer/CTA
    chrome repeated on every page. Subtracted from each article's outline so the
    coverage floor reflects the article, not the site navigation."""
    home = fetch(f"https://{domain_key(domain)}/")
    time.sleep(SLEEP_BETWEEN_FETCHES)
    if not home:
        return set()
    return {h.lower() for h in _headings(home, "123")}


def page_text(html: str) -> str:
    txt = _strip_blocks(html)
    txt = re.sub(r"(?s)<[^>]+>", " ", txt)
    txt = re.sub(r"&[a-z#0-9]+;", " ", txt)
    txt = re.sub(r"\s+", " ", txt)
    return txt.strip()


def content_hash(html: str) -> str:
    return "sha256:" + hashlib.sha256(page_text(html).encode("utf-8", "replace")).hexdigest()


def extract_title(html: str) -> str:
    m = re.search(r"(?is)<title[^>]*>(.*?)</title>", html)
    if m:
        return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip()[:200]
    m = re.search(r"(?is)<h1[^>]*>(.*?)</h1>", html)
    if m:
        return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip()[:200]
    return ""


_GENERIC_HEADINGS = {
    "table of contents", "contents", "related posts", "related articles",
    "share this article", "share this post", "recent posts", "categories",
    "subscribe", "newsletter", "comments", "leave a comment", "about the author",
    "frequently asked questions", "faq", "faqs", "get in touch", "contact us",
}


def extract_outline(html: str, boiler: set[str] | None = None) -> list[str]:
    """H2/H3 headings of the ARTICLE — the competitor's coverage/structure floor.
    Strips nav/header/footer chrome and subtracts homepage boilerplate headings so
    site-wide menu items don't leak in."""
    boiler = boiler or set()
    out: list[str] = []
    seen: set[str] = set()
    for text in _headings(_strip_chrome(html), "23"):
        low = text.lower()
        if len(text) >= 160 or low in boiler or low in _GENERIC_HEADINGS or low in seen:
            continue
        seen.add(low)
        out.append(text)
        if len(out) >= 60:
            break
    return out


def extract_tool_io(html: str) -> list[str]:
    """Best-effort capture of a tool's inputs/labels so the skill can study it."""
    io: list[str] = []
    for m in re.finditer(r"(?is)<label[^>]*>(.*?)</label>", html):
        t = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip()
        if t and len(t) < 120:
            io.append(f"label: {t}")
    for m in re.finditer(r"(?is)<input\b([^>]*)>", html):
        attrs = m.group(1)
        name = re.search(r'(?i)\b(?:name|id|placeholder|aria-label)\s*=\s*["\']([^"\']+)', attrs)
        if name:
            io.append(f"input: {name.group(1).strip()}")
    for m in re.finditer(r"(?is)<select\b([^>]*)>", html):
        attrs = m.group(1)
        name = re.search(r'(?i)\b(?:name|id|aria-label)\s*=\s*["\']([^"\']+)', attrs)
        if name:
            io.append(f"select: {name.group(1).strip()}")
    # dedupe preserve order, cap
    seen: set[str] = set()
    uniq: list[str] = []
    for x in io:
        if x not in seen:
            seen.add(x)
            uniq.append(x)
        if len(uniq) >= 40:
            break
    return uniq


def classify(url: str, title: str) -> str:
    blob = f"{url} {title}"
    if TOOL_RE.search(blob):
        return "tool"
    if COMPARISON_RE.search(blob):
        return "comparison"
    return "page"


# ── Sitemap discovery + parsing ───────────────────────────────────────────────
def discover_sitemaps(domain: str, override: str | None) -> list[str]:
    if override:
        return [override]
    base = f"https://{domain_key(domain)}"
    found: list[str] = []
    # robots.txt Sitemap: lines
    robots = fetch(f"{base}/robots.txt")
    if robots:
        for line in robots.splitlines():
            m = re.match(r"(?i)\s*sitemap:\s*(\S+)", line)
            if m:
                found.append(m.group(1).strip())
    # common fallbacks
    for path in ("/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"):
        found.append(base + path)
    # dedupe preserve order
    seen: set[str] = set()
    out: list[str] = []
    for s in found:
        if s not in seen:
            seen.add(s)
            out.append(s)
    return out


def parse_sitemap(url: str, depth: int = 0) -> dict[str, str]:
    """Return {canonical_url: lastmod}. Recurses into <sitemapindex>."""
    if depth > MAX_SITEMAP_DEPTH:
        return {}
    xml = fetch(url)
    if not xml:
        return {}
    try:
        root = ET.fromstring(xml.encode("utf-8", "replace"))
    except ET.ParseError:
        return {}
    tag = root.tag.lower()
    out: dict[str, str] = {}
    if tag.endswith("sitemapindex"):
        for sm in root.findall(f"{SM_NS}sitemap"):
            loc = sm.findtext(f"{SM_NS}loc") or sm.findtext("loc")
            if loc:
                out.update(parse_sitemap(loc.strip(), depth + 1))
                time.sleep(0.2)  # gentle pace through nested sub-sitemaps (avoid ratelimit)
                if len(out) > MAX_URLS_PER_COMPETITOR:
                    break
    else:
        for u in root.findall(f"{SM_NS}url") or root.findall("url"):
            loc = u.findtext(f"{SM_NS}loc") or u.findtext("loc")
            if not loc:
                continue
            lastmod = (u.findtext(f"{SM_NS}lastmod") or u.findtext("lastmod") or "").strip()
            out[canonical_url(loc.strip())] = lastmod
    return out


def collect_competitor_urls(comp: dict) -> dict[str, str]:
    """All sitemap URLs for a competitor → {canonical_url: lastmod}."""
    urls: dict[str, str] = {}
    for sm in discover_sitemaps(comp["domain"], comp.get("sitemap")):
        urls.update(parse_sitemap(sm))
        if len(urls) >= MAX_URLS_PER_COMPETITOR:
            print(f"  ! {comp['domain']}: hit MAX_URLS cap ({MAX_URLS_PER_COMPETITOR}); truncating")
            break
    # keep only same-host URLs (some sitemaps list third-party/CDN hosts)
    host = domain_key(comp["domain"])
    return {u: lm for u, lm in urls.items() if host in urllib.parse.urlsplit(u).netloc.lower()}


# ── Ledger I/O ────────────────────────────────────────────────────────────────
def load_roster() -> list[dict]:
    if not ROSTER_FILE.exists():
        print(f"FATAL: roster not found at {ROSTER_FILE}", file=sys.stderr)
        sys.exit(2)
    data = json.loads(ROSTER_FILE.read_text())
    roster = data["competitors"] if isinstance(data, dict) else data
    return [c for c in roster if c.get("domain") and not c.get("disabled")]


def load_ledger() -> dict:
    if LEDGER_FILE.exists():
        try:
            return json.loads(LEDGER_FILE.read_text())
        except json.JSONDecodeError:
            print(f"  ! ledger unreadable, starting fresh: {LEDGER_FILE}", file=sys.stderr)
    return {"version": 1, "competitors": {}}


def save_ledger(ledger: dict) -> None:
    LEDGER_FILE.parent.mkdir(parents=True, exist_ok=True)
    LEDGER_FILE.write_text(json.dumps(ledger, indent=2, sort_keys=True) + "\n")


def _comp_entry(ledger: dict, key: str) -> dict:
    return ledger.setdefault("competitors", {}).setdefault(key, {"last_crawled": "", "pages": {}})


# ── detect ────────────────────────────────────────────────────────────────────
def fetch_page_meta(url: str, boiler: set[str] | None = None) -> tuple[str, str, list, list] | None:
    """Fetch a page → (title, content_hash, outline, tool_io). None on failure."""
    html = fetch(url)
    time.sleep(SLEEP_BETWEEN_FETCHES)
    if html is None:
        return None
    title = extract_title(html)
    h = content_hash(html)
    outline = extract_outline(html, boiler)
    kind = classify(url, title)
    io = extract_tool_io(html) if kind == "tool" else []
    return title, h, outline, io


def detect(roster: list[dict], ledger: dict, today: str, only: str | None) -> tuple[list[Candidate], dict, list[str], list[dict]]:
    candidates: list[Candidate] = []
    fetch_failures: list[str] = []
    skipped_off_niche: list[dict] = []

    for comp in roster:
        key = domain_key(comp["domain"])
        name = comp.get("name", key)
        if only and only.lower() not in key:
            continue

        entry = _comp_entry(ledger, key)
        pages = entry["pages"]
        first_run = len(pages) == 0

        print(f"\n== {name} ({key}) ==")
        live = collect_competitor_urls(comp)
        print(f"  sitemap URLs: {len(live)}  | ledger pages: {len(pages)}  | first_run: {first_run}")

        if not live and first_run:
            print("  ! no sitemap URLs found on first crawl — leaving competitor unseeded (will retry next run)")
            continue

        if first_run:
            # QUIET SEED — everything is baseline, emit zero candidates.
            for u, lm in live.items():
                pages[u] = {
                    "first_seen": today, "last_seen": today, "lastmod": lm,
                    "content_hash": "", "kind": classify(u, ""), "status": "baseline",
                }
            entry["last_crawled"] = today
            print(f"  seeded {len(live)} pages as baseline (no candidates on first run)")
            continue

        # Existing competitor — diff. Boilerplate headings (homepage menu/footer)
        # are fetched lazily, only once, and only if we actually fetch a page.
        new_count = updated_count = retry_count = 0
        boiler_box: dict = {}

        def _meta(u: str):
            if "set" not in boiler_box:
                boiler_box["set"] = boilerplate_headings(comp["domain"])
            return fetch_page_meta(u, boiler_box["set"])

        # 1) Re-emit still-pending pages (crash-safety): a page detected before but
        #    not yet resolved stays a candidate until `record` marks it done.
        for u, rec in pages.items():
            if rec.get("status") == "pending":
                candidates.append(Candidate(
                    competitor=key, competitor_name=name, url=u,
                    title=rec.get("title", ""), kind=rec.get("kind", classify(u, "")),
                    change="pending-retry", lastmod=rec.get("lastmod", ""),
                    content_hash=rec.get("content_hash", ""),
                    outline=rec.get("outline", []), tool_io=rec.get("tool_io", []),
                ))
                rec["last_seen"] = today
                retry_count += 1

        off_count = 0

        def _emit(u: str, lm: str, meta, change: str) -> str:
            """Apply the relevance gate, update the ledger, and either emit a
            candidate (on-niche) or record an off-niche skip. Returns 'on'/'off'."""
            nonlocal off_count
            title, h, outline, io = meta
            kind = classify(u, title)
            rel, hits = is_relevant(u, title, outline)
            rec0 = pages.get(u, {})
            base = {
                "first_seen": rec0.get("first_seen", today), "last_seen": today,
                "lastmod": lm, "content_hash": h, "kind": kind, "title": title,
                "outline": outline, "tool_io": io,
            }
            if not rel:
                pages[u] = {**rec0, **base, "status": "done",
                            "disposition": "skipped-off-niche", "acted": False}
                skipped_off_niche.append({"url": u, "title": title, "kind": kind,
                                          "competitor": name})
                off_count += 1
                return "off"
            pages[u] = {**rec0, **base, "status": "pending", "relevance_hits": hits}
            candidates.append(Candidate(key, name, u, title, kind, change, lm, h, outline, io))
            return "on"

        # 2) Walk live URLs for new + materially-updated.
        for u, lm in live.items():
            rec = pages.get(u)
            if rec is None:
                meta = _meta(u)
                if meta is None:
                    fetch_failures.append(u)
                    pages[u] = {"first_seen": today, "last_seen": today, "lastmod": lm,
                                "content_hash": "", "kind": classify(u, ""), "status": "fetch-failed"}
                    continue
                if _emit(u, lm, meta, "new") == "on":
                    new_count += 1
                continue

            if rec.get("status") in ("pending", "fetch-failed"):
                # pending already re-emitted above; fetch-failed retried here.
                if rec.get("status") == "fetch-failed":
                    meta = _meta(u)
                    if meta is None:
                        fetch_failures.append(u)
                        rec["last_seen"] = today
                        continue
                    if _emit(u, lm, meta, "new") == "on":
                        new_count += 1
                else:
                    rec["last_seen"] = today
                continue

            # rec is baseline or done → check for a material update.
            # New-URL detection (above) is the primary signal and needs no page
            # fetch. Update detection only fires when the sitemap exposes a
            # `lastmod` that ADVANCED — then we fetch once and hash-compare. Sites
            # with no lastmod are not re-fetched every run (that would mean
            # re-downloading the whole site each run); their silent edits are not
            # tracked, by design. A real new URL still gets caught.
            rec["last_seen"] = today
            stored_lm = rec.get("lastmod", "")
            if not (lm and lm != stored_lm):
                continue  # no lastmod advance → treat as unchanged, no fetch
            meta = _meta(u)
            if meta is None:
                fetch_failures.append(u)
                continue
            _t, h, _o, _io = meta
            if rec.get("content_hash") and h == rec["content_hash"]:
                rec["lastmod"] = lm  # cosmetic lastmod bump, content identical
                continue
            if _emit(u, lm, meta, "updated") == "on":
                updated_count += 1

        entry["last_crawled"] = today
        print(f"  new: {new_count}  updated: {updated_count}  off-niche: {off_count}  pending-retry: {retry_count}")

    return candidates, ledger, fetch_failures, skipped_off_niche


# ── record ────────────────────────────────────────────────────────────────────
def record(ledger: dict, dispositions: dict, today: str) -> int:
    """dispositions = {url: {"disposition": "...", "our_url": "..."}}.
    disposition ∈ published | enriched | skipped-duplicate | skipped-low-value | fetch-failed
    """
    acted_set = {"published", "enriched"}
    n = 0
    for comp in ledger.get("competitors", {}).values():
        for u, rec in comp.get("pages", {}).items():
            if u in dispositions:
                d = dispositions[u]
                rec["status"] = "done"
                rec["disposition"] = d.get("disposition", "skipped-low-value")
                rec["acted"] = rec["disposition"] in acted_set
                rec["our_url"] = d.get("our_url", "")
                rec["acted_date"] = today
                n += 1
    return n


# ── CLI ───────────────────────────────────────────────────────────────────────
def cmd_detect(args) -> int:
    configure_niche()
    today = args.today or date.today().isoformat()
    roster = load_roster()
    ledger = load_ledger()
    candidates, ledger, failures, off_niche = detect(roster, ledger, today, args.only)

    payload = {
        "generated": today,
        "candidate_count": len(candidates),
        "fetch_failures": failures,
        "skipped_off_niche": off_niche,
        "candidates": [asdict(c) for c in candidates],
    }

    print("\n" + "=" * 60)
    print(f"CANDIDATES: {len(candidates)}  (on-niche new/updated/pending across roster)")
    if off_niche:
        print(f"SKIPPED (off-niche): {len(off_niche)}  — recorded, not generated")
    by_kind: dict[str, int] = {}
    for c in candidates:
        by_kind[c.kind] = by_kind.get(c.kind, 0) + 1
    print(f"  by kind: {by_kind or '{}'}")
    if failures:
        print(f"  fetch failures: {len(failures)}")
    for c in candidates[:30]:
        print(f"  [{c.change:13}] [{c.kind:10}] {c.competitor_name}: {c.url}")
    if len(candidates) > 30:
        print(f"  … and {len(candidates) - 30} more")

    if args.dry_run:
        print("\n(--dry-run: ledger and candidates file NOT written)")
        if args.out:
            print(f"(--dry-run: would have written {args.out})")
        return 0

    save_ledger(ledger)
    print(f"\nledger written: {LEDGER_FILE.relative_to(ROOT)}")
    out_path = Path(args.out) if args.out else (LEDGER_FILE.parent / f"candidates-{today}.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"candidates written: {out_path}")
    return 0


def cmd_record(args) -> int:
    today = args.today or date.today().isoformat()
    dispositions = json.loads(Path(args.dispositions).read_text())
    if isinstance(dispositions, dict) and "dispositions" in dispositions:
        dispositions = dispositions["dispositions"]
    ledger = load_ledger()
    n = record(ledger, dispositions, today)
    if not args.dry_run:
        save_ledger(ledger)
    print(f"recorded {n} dispositions into ledger" + (" (dry-run, not written)" if args.dry_run else ""))
    return 0


def cmd_show(args) -> int:
    ledger = load_ledger()
    comps = ledger.get("competitors", {})
    print(f"ledger: {LEDGER_FILE}")
    print(f"competitors tracked: {len(comps)}")
    for key, entry in comps.items():
        pages = entry.get("pages", {})
        statuses: dict[str, int] = {}
        for rec in pages.values():
            s = rec.get("status", "?")
            statuses[s] = statuses.get(s, 0) + 1
        print(f"  {key}: {len(pages)} pages  last_crawled={entry.get('last_crawled','-')}  {statuses}")
    return 0


def cmd_baseline(args) -> int:
    """Snapshot the current on-niche pool per competitor → committed report
    (reports/competitor-monitor/baseline-<date>.{md,json}). This is the reference
    chart every run is measured against: the email reports new on-niche pages
    found SINCE this baseline. Re-run periodically to refresh the snapshot."""
    configure_niche()
    today = args.today or date.today().isoformat()
    roster = load_roster()
    rows = []
    for c in roster:
        if args.only and args.only.lower() not in domain_key(c["domain"]):
            continue
        try:
            urls = collect_competitor_urls(c)
        except Exception as e:
            print(f"  ! {c['domain']}: ERROR {e}")
            urls = {}
        niche = [u for u in urls if is_relevant(u, "", [])[0]]
        tools = [u for u in niche if classify(u, "") == "tool"]
        comps = [u for u in niche if classify(u, "") == "comparison"]
        rows.append({"name": c.get("name", c["domain"]), "domain": domain_key(c["domain"]),
                     "total_urls": len(urls), "on_niche": len(niche),
                     "tools": len(tools), "comparisons": len(comps),
                     "on_niche_urls": sorted(niche)})
        print(f"  {c['domain']:24} total={len(urls):5d} on-niche={len(niche):5d} tools={len(tools)} comps={len(comps)}", flush=True)

    out_dir = LEDGER_FILE.parent
    out_dir.mkdir(parents=True, exist_ok=True)
    json_path = Path(args.out_json) if args.out_json else out_dir / f"baseline-{today}.json"
    md_path = Path(args.out_md) if args.out_md else out_dir / f"baseline-{today}.md"

    # ── Load the PREVIOUS baseline chart (for carry-forward + diff) ──
    prev_path = None
    for p in sorted(out_dir.glob("baseline-*.json")):
        if p.resolve() != json_path.resolve():
            prev_path = p  # most recent prior chart wins (sorted by date in name)
    prev_date = ""
    prev_by_domain: dict[str, set] = {}
    prev_rows: dict[str, dict] = {}
    if prev_path:
        try:
            prev = json.loads(prev_path.read_text())
            prev_date = prev.get("generated", prev_path.stem.replace("baseline-", ""))
            for pr in prev.get("competitors", []):
                prev_by_domain[pr["domain"]] = set(pr.get("on_niche_urls", []))
                prev_rows[pr["domain"]] = pr
        except Exception as e:
            print(f"  ! could not read previous baseline {prev_path}: {e}")

    # ── 0-result guard: a flaky crawl (timeout/ratelimit) must NOT zero out a
    # competitor that had data last time. Carry forward the previous chart's data
    # and flag it stale, so the chart never regresses on a transient failure. ──
    for r in rows:
        if r["total_urls"] == 0 and prev_rows.get(r["domain"], {}).get("on_niche", 0) > 0:
            pr = prev_rows[r["domain"]]
            r.update({"total_urls": pr.get("total_urls", 0), "on_niche": pr.get("on_niche", 0),
                      "tools": pr.get("tools", 0), "comparisons": pr.get("comparisons", 0),
                      "on_niche_urls": pr.get("on_niche_urls", []),
                      "crawl_failed": True, "stale_from": prev_date})
            print(f"  ~ {r['domain']}: crawl returned 0 — carried forward {pr.get('on_niche',0)} on-niche from {prev_date}")

    rows.sort(key=lambda r: r["on_niche"], reverse=True)
    tot_u = sum(r["total_urls"] for r in rows)
    tot_n = sum(r["on_niche"] for r in rows)
    tot_t = sum(r["tools"] for r in rows)
    tot_c = sum(r["comparisons"] for r in rows)

    total_new = 0
    for r in rows:
        prev_urls = prev_by_domain.get(r["domain"], set())
        cur_urls = set(r["on_niche_urls"])
        new_urls = sorted(cur_urls - prev_urls) if prev_path else []
        removed = sorted(prev_urls - cur_urls) if prev_path else []
        r["new_since_prev"] = new_urls
        r["removed_since_prev"] = removed
        r["delta"] = (len(cur_urls) - len(prev_urls)) if prev_path else 0
        total_new += len(new_urls)

    json_path.write_text(json.dumps({
        "generated": today, "previous_baseline": prev_date,
        "competitor_count": len(rows),
        "total_urls": tot_u, "total_on_niche": tot_n,
        "total_tools": tot_t, "total_comparisons": tot_c,
        "total_new_since_prev": total_new,
        "competitors": rows,
    }, indent=2) + "\n")

    lines = [
        f"# Competitor on-niche baseline — {today}",
        "",
        "**What this is.** A snapshot of the on-niche page pool each rostered competitor",
        "has RIGHT NOW. It is the reference the Competitor Publishing Monitor measures",
        "against: each run reports the NEW on-niche pages a competitor has published",
        "*since this baseline*. The per-URL diff state lives in `ledger.json`; this file",
        "is the human-readable chart + audit snapshot. **Re-run",
        "`python3 scripts/competitor_monitor/scraper.py baseline` periodically to refresh.**",
        "",
        "On-niche = matches the AI/automation niche filter (NICHE/OFF_NICHE in scraper.py).",
        "`total_urls` is every sitemap URL; `on_niche` is the addressable pool we duplicate from.",
        "",
        "| Competitor | URLs | On-niche | Tools | Comparisons |",
        "|---|--:|--:|--:|--:|",
    ]
    for r in rows:
        lines.append(f"| {r['name']} ({r['domain']}) | {r['total_urls']} | {r['on_niche']} | {r['tools']} | {r['comparisons']} |")
    lines.append(f"| **TOTAL ({len(rows)})** | **{tot_u}** | **{tot_n}** | **{tot_t}** | **{tot_c}** |")

    # Changes since the previous chart — the diff future runs act on.
    lines += ["", "## Changes since the previous chart"]
    if not prev_path:
        lines.append("_First baseline — no previous chart to compare against._")
    else:
        lines.append(f"Compared against **{prev_date}** (`{prev_path.name}`). "
                     f"**{total_new} new on-niche page(s)** across the roster.")
        changed = [r for r in rows if r.get("new_since_prev") or r.get("removed_since_prev")]
        if not changed:
            lines.append("\nNo competitor published new on-niche pages since the previous chart.")
        for r in changed:
            lines.append(f"\n### {r['name']} ({r['domain']}) — Δ {r['delta']:+d} on-niche")
            for u in r["new_since_prev"][:25]:
                lines.append(f"- 🟢 NEW: {u}")
            if len(r["new_since_prev"]) > 25:
                lines.append(f"- … and {len(r['new_since_prev']) - 25} more new")
            for u in r["removed_since_prev"][:10]:
                lines.append(f"- ⚪ removed: {u}")

    lines += [
        "",
        "## How runs use this",
        "- **Run #1** seeds every URL above into `ledger.json` as `baseline` (acted on: never).",
        "- **Each 3×/week run** diffs the live sitemaps against the ledger and acts only on",
        "  what is NEW since baseline (then relevance-gated + deduped + capped).",
        "- The email digest's *Competitors scanned* line reports new/updated counts — i.e. the",
        "  delta against this chart. A competitor whose count climbs above its baseline here",
        "  has published something new to duplicate.",
        f"- Full per-competitor on-niche URL lists: `{json_path.name}`.",
    ]
    md_path.write_text("\n".join(lines) + "\n")

    print(f"\nbaseline written:\n  {md_path}\n  {json_path}")
    print(f"TOTAL: {tot_u} urls · {tot_n} on-niche · {tot_t} tools · {tot_c} comparisons across {len(rows)} competitors")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description="Competitor Publishing Monitor scraper")
    sub = p.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("baseline", help="snapshot on-niche pool per competitor → committed chart")
    b.add_argument("--only", help="restrict to competitor domains containing this substring")
    b.add_argument("--out-md", help="markdown chart output path")
    b.add_argument("--out-json", help="machine baseline output path")
    b.add_argument("--today", help="override date (YYYY-MM-DD)")
    b.set_defaults(func=cmd_baseline)

    d = sub.add_parser("detect", help="crawl + diff; write ledger + candidates")
    d.add_argument("--dry-run", action="store_true", help="compute + print but write nothing")
    d.add_argument("--only", help="restrict to competitor domains containing this substring")
    d.add_argument("--out", help="candidates JSON output path")
    d.add_argument("--today", help="override date (YYYY-MM-DD) for deterministic runs")
    d.set_defaults(func=cmd_detect)

    r = sub.add_parser("record", help="merge skill dispositions into the ledger")
    r.add_argument("--dispositions", required=True, help="JSON {url: {disposition, our_url}}")
    r.add_argument("--today", help="override date (YYYY-MM-DD)")
    r.add_argument("--dry-run", action="store_true")
    r.set_defaults(func=cmd_record)

    s = sub.add_parser("show", help="print ledger stats")
    s.set_defaults(func=cmd_show)

    args = p.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
