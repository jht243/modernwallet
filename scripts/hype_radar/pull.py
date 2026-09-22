#!/usr/bin/env python3
"""Hype radar — find the tool/product names that are breaking out RIGHT NOW.

The signal is REPETITION across independent stories inside a short window. A
tool nobody had heard of on Monday that is named in six separate Hacker News
stories by Wednesday is having a moment, and its SERP is still empty.

Sources (all free, all real; any one of them dying never fails the run):
  - Hacker News via Algolia  — the primary detector
  - Reddit hot/.rss          — AI-community buzz (heavily rate-limited; best-effort)
  - Google Trends daily RSS  — real trending searches, for mainstream-sized spikes

Deliberately NOT a source: DataForSEO's google_trends "rising" list. Verified
2026-09-22 — identical back-to-back calls return different values and unrelated
junk ("how to bake a cake", "k-pop trending"). It cannot trigger a page.

Google Autocomplete is attached per candidate as CONTEXT, never as a gate: an
empty autocomplete means search has not caught up yet, which is the whole
opportunity, not a reason to drop the row.

The ledger is written AT HARVEST: every name handed to mindmap is recorded
then and there, so the routine has nothing to do after the handoff. Whether
the site already covers a name is mindmap's call (its dedup), not this script's.

Subcommands:
  pull    --json OUT   harvest, ledger-filter, record, write JSON
  record  --names a,b  manual ledger edit (normally not needed)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
LEDGER = REPO / "reports" / "hype-radar" / "tools_seen.json"
UA = "Mozilla/5.0 (compatible; layer3labs-hype-radar/1.0; +https://www.layer3labs.io)"

CONFIG_PATH = Path(__file__).with_name("sources.json")

# Defaults = the Layer3Labs (AI) profile. A repo overrides any of these in
# scripts/hype_radar/sources.json; the mechanism (a name repeating across
# independent stories) is vertical-agnostic, only the SOURCES change.
DEFAULT_CONFIG = {
    "hacker_news": True,          # dev-audience source; useless outside tech
    "news_queries": [],           # Google News RSS per query — the universal source
    "subreddits": ["ChatGPT", "artificial", "LocalLLaMA", "singularity", "AI_Agents"],
    "google_trends_geo": "US",    # "" disables
    "incumbents": [],             # vertical's own household names, added to INCUMBENTS
    "min_stories": 3,
    "hours": 72,
    "min_points": 5,
}


def load_config() -> dict:
    cfg = dict(DEFAULT_CONFIG)
    try:
        cfg.update(json.loads(CONFIG_PATH.read_text()))
    except FileNotFoundError:
        pass
    except Exception as e:  # noqa: BLE001 — a broken config must not fail the run
        print(f"[config] {CONFIG_PATH.name} unreadable ({e}) — using defaults", file=sys.stderr)
    return cfg

# Names already covered to death, plus English that merely looks like a name in
# a title. Neither is a discovery.
INCUMBENTS = {
    "openai", "chatgpt", "gpt", "anthropic", "claude", "google", "gemini",
    "deepmind", "meta", "llama", "microsoft", "copilot", "apple", "amazon",
    "aws", "azure", "nvidia", "xai", "grok", "mistral", "midjourney", "github",
    "apple intelligence", "deepseek", "qwen", "perplexity", "cursor", "notion",
    "figma", "slack", "linux", "windows", "python", "rust", "javascript",
    "typescript", "react", "docker", "kubernetes", "postgres", "sqlite",
    "macos", "ios", "android", "iphone", "ipad", "chrome", "firefox", "safari",
    "tesla", "spacex", "intel", "amd", "arm", "ubuntu", "debian", "netflix",
    "youtube", "tiktok", "twitter", "reddit", "facebook", "instagram", "whatsapp",
    "telegram", "discord", "zoom", "stripe", "shopify", "salesforce", "oracle",
    "ibm", "samsung", "sony", "uber", "airbnb", "spotify", "wikipedia", "vscode",
    "vim", "emacs", "node", "nodejs", "java", "golang", "swift", "kotlin", "php",
    "ruby", "rails", "django", "nextjs", "vercel", "cloudflare", "supabase",
    "huggingface", "ollama", "langchain", "llamaindex", "pytorch", "tensorflow",
    "cuda", "wsj", "nyt", "bbc", "cnn", "reuters", "bloomberg", "techcrunch",
    "arxiv", "wired", "verge", "ycombinator", "nasa", "fda", "sec", "doj", "fcc",
}

# Google News headlines are written BY publications, so their mastheads repeat
# across stories far more than any product does. A publisher is never a discovery.
PUBLISHERS = {
    "wirecutter", "nyt", "nytimes", "wsj", "cnn", "cnet", "engadget", "gizmodo",
    "mashable", "techradar", "tomsguide", "tomshardware", "digitaltrends",
    "zdnet", "pcmag", "pcworld", "androidpolice", "9to5mac", "9to5google",
    "macrumors", "appleinsider", "slashgear", "bgr", "gq", "esquire", "vogue",
    "wirecutter", "forbes", "fortune", "insider", "businessinsider", "cnbc",
    "bloomberg", "reuters", "guardian", "telegraph", "independent", "dailymail",
    "buzzfeed", "vice", "vox", "axios", "politico", "npr", "pbs", "bbc", "abc",
    "nbc", "cbs", "fox", "usatoday", "washingtonpost", "wapo", "latimes",
    "yahoo", "msn", "medium", "substack", "reddit", "quora", "wikipedia",
    "outside", "backpacker", "rei", "popsci", "popularmechanics", "wired",
    "thespruce", "goodhousekeeping", "realsimple", "epicurious", "seriouseats",
    "healthline", "webmd", "menshealth", "womenshealth", "prevention", "shape",
    "allrecipes", "foodnetwork", "bonappetit", "architecturaldigest", "dwell",
    "motleyfool", "seekingalpha", "marketwatch", "barrons", "investopedia",
    "techcrunch", "theregister", "arstechnica", "hackernews", "geekwire",
    "techrepublic", "venturebeat", "thetrek", "techgearlab", "streetinsider",
}
STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "for", "to", "of", "in", "on", "at",
    "is", "it", "its", "was", "why", "how", "what", "when", "where", "who",
    "show", "ask", "tell", "hn", "new", "now", "we", "i", "my", "you", "your",
    "our", "this", "that", "with", "from", "by", "as", "be", "are", "no", "not",
    "ai", "llm", "llms", "api", "cli", "sdk", "os", "pdf", "sql", "html", "css",
    "开源", "usa", "us", "uk", "eu", "ceo", "cto", "vp", "phd", "faq", "tl;dr",
    "i'm", "don't", "can't", "it's", "here's", "there's", "one", "two", "first",
    "doesn", "isn", "aren", "wasn", "weren", "didn", "won", "wouldn", "couldn",
    "shouldn", "hasn", "haven", "ain", "has", "have", "had", "does", "did", "uses",
    "let", "lets", "there", "here", "they", "them", "their", "than", "then",
    "best", "top", "free", "open", "source", "opensource", "build", "building",
    "built", "using", "use", "make", "made", "making", "release", "released",
    "simple", "fast", "local", "tiny", "minimal", "lightweight", "small", "smart",
    "easy", "better", "modern", "native", "secure", "private", "self-hosted",
    "selfhosted", "offline", "realtime", "real-time", "instant", "universal",
    "introducing", "announcing", "launching", "meet", "say", "hello", "goodbye",
    "inside", "beyond", "toward", "towards", "against", "after", "before",
    "labs", "lab", "inc", "ltd", "llc", "corp", "team", "hq", "dev", "devs",
    "app", "apps", "tool", "tools", "agent", "agents", "model", "models",
    "gpu", "gpus", "cpu", "cpus", "tpu", "npu", "ram", "vram", "ssd", "svg", "png",
    "jpg", "jpeg", "gif", "json", "xml", "yaml", "toml", "http", "https", "url",
    "urls", "ssh", "tls", "ssl", "dns", "iot", "usb", "hdmi", "wifi", "gps", "sim",
    "esim", "hdr", "led", "oled", "lcd", "ocr", "nlp", "ml", "rag", "mcp", "gui",
    "ide", "ui", "ux", "seo", "saas", "b2b", "b2c", "roi", "kpi", "ipo", "vc",
    "unix", "posix", "wasm", "webassembly", "ascii", "utf", "utf-8", "regex",
}

TOKEN = re.compile(r"[A-Za-z][A-Za-z0-9.\-_]{1,24}")

# A real product name is usually NOT an English word. The system dictionary is a
# far better filter than any hand-kept stoplist ('intelligence', 'performance',
# 'chinese' all die; 'jev' survives). Dictionary words are still kept when the
# title treats them as a product — 'Show HN: Muse ...', 'muse.ai', 'Muse AI' —
# so Cursor/Notion/Windsurf-shaped names are not thrown away.
def _load_dictionary() -> set[str]:
    """Vendored copy first — the cloud runner is a bare Linux box with no
    /usr/share/dict. Without a dictionary the noise filter is OFF and every
    capitalized English word becomes a candidate, so an empty result is loud."""
    import gzip
    vendored = Path(__file__).with_name("words.txt.gz")
    sources = [vendored, Path("/usr/share/dict/words"), Path("/usr/dict/words")]
    for cand in sources:
        try:
            raw = (gzip.open(cand, "rt", encoding="utf-8", errors="ignore").read()
                   if cand.suffix == ".gz" else cand.read_text(encoding="utf-8", errors="ignore"))
            words = {w.strip().lower() for w in raw.splitlines() if len(w.strip()) > 2}
            if len(words) > 10_000:
                return words
        except OSError:
            continue
    print("[dict] NO DICTIONARY FOUND — noise filter disabled, expect junk candidates",
          file=sys.stderr)
    return set()


DICTIONARY = _load_dictionary()


def _http_json(url: str, timeout: int = 45):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def _http_text(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


# ------------------------------------------------------------------- sources
def hacker_news(hours: int, min_points: int) -> list[dict]:
    since = int(time.time()) - hours * 3600
    out: list[dict] = []
    for tags in ("story", "show_hn"):
        url = ("https://hn.algolia.com/api/v1/search_by_date?tags=" + tags
               + f"&numericFilters=created_at_i>{since},points>{min_points}&hitsPerPage=1000")
        try:
            d = _http_json(url)
        except Exception as e:  # noqa: BLE001
            print(f"[hn] {tags}: {e}", file=sys.stderr)
            continue
        for h in d.get("hits") or []:
            if h.get("title"):
                out.append({
                    "source": f"hn:{tags}",
                    "title": h["title"],
                    "url": h.get("url") or f"https://news.ycombinator.com/item?id={h.get('objectID')}",
                    "score": h.get("points"),
                })
    return out


def reddit_rss(subs: list[str], limit: int = 25, delay: float = 8.0) -> list[dict]:
    """Reddit blocks the JSON API for non-browser clients and rate-limits the RSS
    feeds hard. Slow, best-effort, and every failure is simply skipped."""
    out: list[dict] = []
    for sub in subs:
        for attempt in range(3):
            try:
                xml = _http_text(f"https://www.reddit.com/r/{sub}/hot/.rss?limit={limit}")
                import xml.etree.ElementTree as ET
                ns = {"a": "http://www.w3.org/2005/Atom"}
                for entry in ET.fromstring(xml).findall("a:entry", ns):
                    title = (entry.findtext("a:title", namespaces=ns) or "").strip()
                    link = entry.find("a:link", ns)
                    href = link.get("href") if link is not None else f"https://www.reddit.com/r/{sub}/"
                    if title:
                        out.append({"source": f"reddit:{sub}", "title": title,
                                    "url": href, "score": None})
                break
            except Exception as e:  # noqa: BLE001
                if attempt < 2:
                    time.sleep(delay * (attempt + 2))
                    continue
                print(f"[reddit] {sub}: {e}", file=sys.stderr)
        time.sleep(delay)
    return out


def google_trends_daily(geo: str = "US") -> list[dict]:
    """Real Google Trends daily trending searches (free RSS). All-topic, so only
    a mainstream-sized spike shows up here — that is exactly what it is for."""
    try:
        xml = _http_text(f"https://trends.google.com/trending/rss?geo={geo}")
    except Exception as e:  # noqa: BLE001
        print(f"[trends-rss] {e}", file=sys.stderr)
        return []
    titles = re.findall(r"<title>(.*?)</title>", xml, re.S)[1:]  # [0] = feed title
    return [{"source": "google-trends-daily", "title": re.sub(r"<.*?>", "", t).strip(),
             "url": "https://trends.google.com/trending?geo=" + geo, "score": None}
            for t in titles if t.strip()]


def google_news(queries: list[str], per_query: int = 40) -> list[dict]:
    """Google News RSS per query. Free, no key, and for a consumer vertical it is
    the source that HN is for tech — headlines that name products:
    "Vikings Blade The Godfather Review", "Lefant A1 Pro Air Purifier Review"."""
    out: list[dict] = []
    for q in queries:
        url = ("https://news.google.com/rss/search?q=" + urllib.parse.quote(q)
               + "&hl=en-US&gl=US&ceid=US:en")
        try:
            xml = _http_text(url)
        except Exception as e:  # noqa: BLE001
            print(f"[news] {q}: {e}", file=sys.stderr)
            continue
        titles = re.findall(r"<title>(.*?)</title>", xml, re.S)[1:]  # [0] = feed title
        links = re.findall(r"<link>(.*?)</link>", xml, re.S)[1:]
        for i, t in enumerate(titles[:per_query]):
            title = re.sub(r"<.*?>", "", t).replace("<![CDATA[", "").replace("]]>", "").strip()
            # Google News appends " - Publication"; the publisher is not a product
            title = re.sub(r"\s+-\s+[^-]{2,40}$", "", title)
            if title:
                out.append({"source": f"news:{q}", "title": title,
                            "url": (links[i].strip() if i < len(links) else url), "score": None})
        time.sleep(1)
    return out


AI_CONTEXT = re.compile(r"\b(ai|tool|app|api|agent|llm|model|pricing|price|"
                        r"review|alternative|download|login|how to use)\b", re.I)


def autocomplete(name: str) -> list[str]:
    """Context only, never a gate. Google suggests plenty of unrelated noise for
    a short string ('jev' -> 'je vais', 'iev airport'), so a suggestion only
    counts when it names the tool AND sits in a product context. An empty list
    means search has not caught up yet — which is the opportunity, not a defect."""
    out: list[str] = []
    for term in (f"{name} ai", name):
        url = ("https://suggestqueries.google.com/complete/search?client=firefox&q="
               + urllib.parse.quote(term))
        try:
            suggestions = (_http_json(url, timeout=15) or [None, []])[1]
        except Exception:  # noqa: BLE001
            continue
        for s in suggestions:
            low = s.lower()
            if re.search(rf"\b{re.escape(name.lower())}\b", low) and AI_CONTEXT.search(low):
                if s not in out:
                    out.append(s)
    return out[:10]


# ------------------------------------------------------------------- ledger
def load_ledger() -> dict:
    if LEDGER.exists():
        try:
            return json.loads(LEDGER.read_text())
        except Exception:  # noqa: BLE001
            return {}
    return {}


def record(names: list[str]) -> None:
    led = load_ledger()
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    for n in names:
        key = n.strip().lower()
        if key:
            led.setdefault(key, {"first_seen": today, "runs": 0})
            led[key]["last_seen"] = today
            led[key]["runs"] = led[key].get("runs", 0) + 1
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    LEDGER.write_text(json.dumps(led, indent=1, sort_keys=True) + "\n")


# -------------------------------------------------------------- name mining
def _is_english(low: str) -> bool:
    """The word list carries base forms only ('ban', 'year'), so check the common
    inflections too or 'bans' / 'years' / 'uses' sail through as names."""
    if low in DICTIONARY:
        return True
    for suffix, repl in (("ies", "y"), ("es", ""), ("s", ""), ("ed", ""), ("ed", "e"),
                         ("ing", ""), ("ing", "e"), ("er", ""), ("est", ""), ("ly", "")):
        if low.endswith(suffix) and len(low) - len(suffix) >= 3:
            if low[: -len(suffix)] + repl in DICTIONARY:
                return True
    return False


def _product_marker(tok: str, head: str, title: str, is_show_hn: bool) -> bool:
    """Evidence that a dictionary word is being used as a product name here."""
    low = tok.lower()
    if is_show_hn and head.lower().startswith(low):
        return True
    if re.search(rf"\b{re.escape(low)}\s*(\.(ai|dev|io|com|app|sh))", title, re.I):
        return True
    # 'Muse AI' / 'Jev Labs' counts; 'uses AI' / 'has AI' does not — the token must be
    # capitalized and not simply the title-cased first word.
    if tok[0].isupper() and not title.lower().startswith(low):
        if re.search(rf"\b{re.escape(tok)}\s+(AI|Labs)\b", title):
            return True
    return False


def candidate_names(title: str, source: str = "") -> set[str]:
    """Product-name-shaped tokens in one title. Kept deliberately loose — a name
    only survives if it repeats across INDEPENDENT stories, which is the filter
    that actually works."""
    names: set[str] = set()
    if source == "google-trends-daily":
        # A trending search IS a name ('halo', 'tsla'), lowercase and bare. Take it
        # whole; it still needs to repeat in the other sources to count.
        low = title.strip().lower()
        if (2 < len(low) <= 30 and low not in STOPWORDS and low not in INCUMBENTS
                and not _is_english(low) and " " not in low):
            names.add(low)
        return names
    head = title
    m = re.match(r"^(?:Show|Ask|Tell)\s+HN:\s*(.+)$", title, re.I)
    if m:  # 'Show HN: jevals – replacing LLM judges' -> the bit before the dash
        head = re.split(r"[–—\-:|,(]", m.group(1))[0].strip()
    for tok in TOKEN.findall(head):
        low = tok.lower().strip(".-_")
        bare = low.replace(".", "").replace("-", "").replace("_", "")
        if (len(bare) < 3 or low in STOPWORDS or low in INCUMBENTS
                or bare in STOPWORDS or low.isdigit()
                or re.fullmatch(r"v?\d[\d.]*", low)
                or ("." in low and len(bare) <= 4)):  # u.s, e.g, a.i
            continue
        looks_like_name = (
            tok[0].isupper()                      # Jev, Windsurf
            or re.search(r"[A-Z]", tok[1:])       # CamelCase
            or "." in tok or "-" in tok           # tool.dev, open-webui
            or (m and head.lower().startswith(low))  # 'Show HN: jevals ...'
        )
        if not looks_like_name:
            continue
        if low in PUBLISHERS:
            continue
        # 'stubble-free', 'budget-friendly' — a compound of ordinary words is a
        # description, not a product name. 'open-webui' survives (not English).
        if "-" in low and all(_is_english(part) or part in STOPWORDS
                              for part in low.split("-") if part):
            continue
        if _is_english(low) and not _product_marker(tok, head, title, bool(m)):
            continue
        names.add(low)
    return names


def build_candidates(items: list[dict], min_stories: int) -> list[dict]:
    hits: dict[str, list[dict]] = defaultdict(list)
    for it in items:
        for name in candidate_names(it["title"], it["source"]):
            hits[name].append(it)

    out = []
    for name, evidence in hits.items():
        # One article submitted twice under two titles is ONE story. HN text posts
        # have no external URL, so they fall back to the title.
        def _story_key(e: dict) -> str:
            u = (e.get("url") or "").lower().rstrip("/")
            if u and "news.ycombinator.com/item" not in u and not u.endswith("trends.google.com/trending?geo=us"):
                return u
            return e["title"].lower()
        stories = {_story_key(e) for e in evidence}
        titles = {e["title"] for e in evidence}
        if len(stories) < min_stories:
            continue
        sources = {e["source"].split(":")[0] for e in evidence}
        out.append({
            "name": name,
            "story_count": len(stories),
            "source_kinds": sorted(sources),
            "top_score": max((e.get("score") or 0) for e in evidence),
            "evidence": [{"title": e["title"], "url": e["url"], "source": e["source"],
                          "score": e.get("score")} for e in evidence],
        })
    out.sort(key=lambda c: (-c["story_count"], -c["top_score"]))
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("pull")
    p.add_argument("--json", required=True)
    p.add_argument("--hours", type=int, default=None)
    p.add_argument("--min-points", type=int, default=None)
    p.add_argument("--min-stories", type=int, default=None,
                   help="distinct stories a name must appear in to count as a spike")
    p.add_argument("--include-seen", action="store_true",
                   help="ignore the ledger (debugging)")
    p.add_argument("--no-record", action="store_true",
                   help="do not write handed-off names to the ledger (debugging)")
    p.add_argument("--no-reddit", action="store_true", help="skip the slow Reddit pass")

    r = sub.add_parser("record")
    r.add_argument("--names", required=True)

    a = ap.parse_args()
    if a.cmd == "record":
        names = [n for n in a.names.split(",") if n.strip()]
        record(names)
        print(f"recorded {len(names)} name(s) -> {LEDGER}")
        return 0

    cfg = load_config()
    hours = a.hours or cfg["hours"]
    min_points = a.min_points or cfg["min_points"]
    min_stories = a.min_stories or cfg["min_stories"]
    INCUMBENTS.update(x.lower() for x in cfg.get("incumbents") or [])

    items: list[dict] = []
    if cfg.get("hacker_news"):
        items += hacker_news(hours, min_points)
    if cfg.get("news_queries"):
        items += google_news(cfg["news_queries"])
    if cfg.get("google_trends_geo"):
        items += google_trends_daily(cfg["google_trends_geo"])
    if not a.no_reddit and cfg.get("subreddits"):
        items += reddit_rss(cfg["subreddits"])

    candidates = build_candidates(items, min_stories)

    led = load_ledger()
    fresh, seen = [], []
    for c in candidates:
        if a.include_seen:
            fresh.append(c)
        elif c["name"] in led:
            seen.append(c)
        else:
            fresh.append(c)

    if fresh and not a.no_record:  # handed off = recorded; nothing to do post-mindmap
        record([c["name"] for c in fresh])

    for c in fresh:  # context, not a gate
        c["autocomplete"] = autocomplete(c["name"])
        c["search_caught_up"] = bool(c["autocomplete"])

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "window_hours": hours,
        "min_stories": min_stories,
        "sources": {k: cfg[k] for k in
                    ("hacker_news", "news_queries", "subreddits", "google_trends_geo")},
        "item_count": len(items),
        "candidates": fresh,
        "already_in_ledger": [c["name"] for c in seen],
    }
    out = Path(a.json)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=1) + "\n")

    print(f"{len(items)} items scanned · {len(fresh)} new candidate(s), "
          f"{len(seen)} already seen -> {out}")
    for c in fresh:
        early = "" if c["search_caught_up"] else "  [EARLY — no autocomplete yet]"
        print(f"  {c['name']}  {c['story_count']} stories  {c['source_kinds']}{early}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
