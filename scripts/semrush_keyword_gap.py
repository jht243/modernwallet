#!/usr/bin/env python3
"""SEMRUSH keyword-gap analysis for themodernwallet.com.

Pulls competitors via domain_organic_organic, then each competitor's top
organic keywords via domain_organic, subtracts what our domain ranks for
AND what is already tracked in reports/seo-research/target-keywords.md,
tags survivors core/adjacent, and emits JSON to stdout.

Reads SEMRUSH_API_KEY (+ optional SEMRUSH_DATABASE) from .env or env.
"""
from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

# --- config -----------------------------------------------------------------

OUR_DOMAIN = "themodernwallet.com"
TARGET_KW_DOC = Path("reports/seo-research/target-keywords.md")

# Tight competitor set (seeds). We confirm/prune against SEMRUSH's live
# domain_organic_organic and merge — never hardcoded as final.
SEED_COMPETITORS = [
    "calculator.net",
    "bankrate.com",
    "nerdwallet.com",
    "smartasset.com",
    "investopedia.com",
    "mortgagecalculator.org",
    "ramseysolutions.com",
    "fidelity.com",
]

# How many top keywords to pull per competitor (tight = cheap)
TOP_KW_PER_COMPETITOR = 50

# Volume floor for Lens 1 gap rows
VOLUME_FLOOR = 100

# Relevance vocabularies — coarse tagging, NOT a hard gate.
# Core = squarely on our 8 calculator hubs.
RELEVANT = re.compile(
    r"\b(auto loan|car loan|mortgage|refinance|real estate|rental|"
    r"property|retirement|401k|ira|roth|pension|invest|investing|"
    r"investment|portfolio|asset allocation|net worth|budget|"
    r"savings|compound interest|amortiz|down payment|apr|loan payment|"
    r"home loan|home equity|heloc|fire calculator|fers|trs)\b",
    re.I,
)
# Adjacent = personal finance one step out
ADJACENT = re.compile(
    r"\b(personal finance|debt|credit|credit card|tax|inflation|"
    r"interest rate|salary|income|expense|emergency fund|hsa|fsa|"
    r"529|college savings|insurance|annuity|social security|"
    r"medicare|estate planning|will|trust|wealth|side hustle|"
    r"financial advisor|financial plan|money market|cd ladder|"
    r"high yield savings|hysa)\b",
    re.I,
)
# Hard-exclude branded/junk
EXCLUDE = re.compile(
    r"\b(login|sign in|signin|app store|google play|youtube|"
    r"calculator\.net|bankrate\.com|nerdwallet\.com|reviews?|"
    r"customer service|phone number|address|hours|near me|"
    r"download|tutorial|youtube tutorial|free trial)\b",
    re.I,
)

# --- env --------------------------------------------------------------------

def load_env() -> None:
    env_path = Path(".env")
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

load_env()

API_KEY = os.environ.get("SEMRUSH_API_KEY")
DATABASE = os.environ.get("SEMRUSH_DATABASE", "us")
if not API_KEY:
    sys.exit("SEMRUSH_API_KEY missing — set it in .env")

# --- HTTP -------------------------------------------------------------------

BASE_URL = "https://api.semrush.com/"

def semrush(params: dict[str, str]) -> str:
    params = {**params, "key": API_KEY, "database": DATABASE}
    url = BASE_URL + "?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return r.read().decode("utf-8", errors="replace")
    except Exception as exc:
        return f"ERROR: {exc}"

def parse_csv(text: str) -> list[dict[str, str]]:
    """SEMRUSH returns ';'-separated header + rows. ERROR responses begin with 'ERROR'."""
    if not text or text.startswith("ERROR"):
        return []
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if not lines:
        return []
    header = lines[0].split(";")
    out = []
    for ln in lines[1:]:
        cols = ln.split(";")
        if len(cols) < len(header):
            continue
        out.append(dict(zip(header, cols)))
    return out

# --- data pulls -------------------------------------------------------------

def live_competitors(domain: str, limit: int = 10) -> list[str]:
    text = semrush({
        "type": "domain_organic_organic",
        "domain": domain,
        "display_limit": str(limit),
        "export_columns": "Dn,Cr,Np,Or,Ot,Oc,Ad",
    })
    rows = parse_csv(text)
    return [r.get("Domain", "").strip() for r in rows if r.get("Domain")]

def domain_top_keywords(domain: str, limit: int) -> list[dict]:
    text = semrush({
        "type": "domain_organic",
        "domain": domain,
        "display_limit": str(limit),
        "export_columns": "Ph,Po,Nq,Cp,Co,Nr,Ur,Tr,In",
    })
    rows = parse_csv(text)
    out = []
    for r in rows:
        try:
            out.append({
                "keyword": r.get("Keyword", "").strip(),
                "position": int(r.get("Position", "0") or 0),
                "volume": int(r.get("Search Volume", "0") or 0),
                "cpc": float(r.get("CPC", "0") or 0),
                "competition": float(r.get("Competition", "0") or 0),
                "url": r.get("Url", "").strip(),
                "intent": r.get("Intents", "").strip() or r.get("Intent", "").strip(),
            })
        except (ValueError, KeyError):
            continue
    return out

# --- helpers ----------------------------------------------------------------

def normalize(kw: str) -> str:
    return re.sub(r"\s+", " ", kw.strip().lower())

def load_tracked_keywords() -> set[str]:
    """Pull every keyword already tracked in target-keywords.md.

    Captures:
      - 'targetKeyword' values from src/data/calculators.ts (head terms)
      - all '### Spokes' bullet phrases (the long-tail rows)
      - every row in the Autocomplete Discovery Log table
    """
    tracked: set[str] = set()
    if not TARGET_KW_DOC.exists():
        return tracked
    txt = TARGET_KW_DOC.read_text()
    # Capture the bolded **Hub: ...** lines too
    for m in re.finditer(r"\*\*Hub\*\*:\s*([^(\n]+?)(?:\(head term\))?$", txt, re.M):
        tracked.add(normalize(m.group(1)))
    # Spokes bullets: "- <keyword> → /path/"
    for m in re.finditer(r"^\-\s+([^→\n]+?)\s+→", txt, re.M):
        tracked.add(normalize(m.group(1)))
    # Autocomplete table rows
    for m in re.finditer(r"^\|\s*([^|]+?)\s*\|", txt, re.M):
        v = m.group(1).strip()
        if v and not v.startswith("-") and "→" not in v:
            tracked.add(normalize(v))
    return tracked

def tier_for(keyword: str) -> str | None:
    if EXCLUDE.search(keyword):
        return None
    if RELEVANT.search(keyword):
        return "core"
    if ADJACENT.search(keyword):
        return "adjacent"
    return None

# --- main -------------------------------------------------------------------

def main() -> None:
    tracked = load_tracked_keywords()

    # Step A: live competitor refresh, merged with seeds
    print(f"[info] pulling live competitors for {OUR_DOMAIN}...", file=sys.stderr)
    live = live_competitors(OUR_DOMAIN, limit=10)
    print(f"[info] SEMRUSH returned {len(live)} live competitors: {live[:5]}...",
          file=sys.stderr)
    competitors = []
    seen = set()
    for d in live + SEED_COMPETITORS:
        d = d.lower().lstrip("www.")
        if d and d not in seen and d != OUR_DOMAIN:
            competitors.append(d)
            seen.add(d)
    # Cap at 8 to stay cheap
    competitors = competitors[:8]
    print(f"[info] final competitor set ({len(competitors)}): {competitors}",
          file=sys.stderr)

    # Pull our own ranked keywords (likely tiny — new site)
    print(f"[info] pulling our own top keywords...", file=sys.stderr)
    our_kw = domain_top_keywords(OUR_DOMAIN, limit=200)
    our_set = {normalize(k["keyword"]) for k in our_kw}
    print(f"[info] we rank for {len(our_set)} keywords already", file=sys.stderr)

    # Pull each competitor's top keywords
    all_competitor_kw: list[dict] = []
    for comp in competitors:
        print(f"[info] pulling top {TOP_KW_PER_COMPETITOR} keywords for {comp}...",
              file=sys.stderr)
        kws = domain_top_keywords(comp, limit=TOP_KW_PER_COMPETITOR)
        for k in kws:
            k["competitor"] = comp
        all_competitor_kw.extend(kws)
        time.sleep(0.3)
    print(f"[info] total competitor keyword rows: {len(all_competitor_kw)}",
          file=sys.stderr)

    # Gap: theirs - ours - tracked, dedup by keyword, prefer best position
    by_kw: dict[str, dict] = {}
    for k in all_competitor_kw:
        nkw = normalize(k["keyword"])
        if nkw in our_set or nkw in tracked:
            continue
        if k["volume"] < VOLUME_FLOOR:
            continue
        tier = tier_for(k["keyword"])
        if tier is None:
            continue
        prev = by_kw.get(nkw)
        if prev is None or k["position"] < prev["comp_position"]:
            by_kw[nkw] = {
                "keyword": k["keyword"],
                "volume": k["volume"],
                "kd": k["competition"],
                "intent": k["intent"],
                "tier": tier,
                "comp_position": k["position"],
                "comp_url": k["url"],
                "competitor": k["competitor"],
            }

    gaps = sorted(by_kw.values(),
                  key=lambda x: (x["tier"] != "core", -x["volume"]))

    core = [g for g in gaps if g["tier"] == "core"]
    adj = [g for g in gaps if g["tier"] == "adjacent"]

    out = {
        "our_domain": OUR_DOMAIN,
        "database": DATABASE,
        "competitors": competitors,
        "our_organic_count": len(our_set),
        "tracked_count": len(tracked),
        "gap_count": len(gaps),
        "core_count": len(core),
        "adjacent_count": len(adj),
        "gaps": gaps,
    }
    print(json.dumps(out, indent=2))

if __name__ == "__main__":
    main()
