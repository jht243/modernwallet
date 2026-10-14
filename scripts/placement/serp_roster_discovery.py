#!/usr/bin/env python3
"""
Discover each vertical's established vendor roster from the live SERP.

Port of layer3 scripts/serp_roster_discovery.py (via thehoaguide, rankandpay, themetabolicjournal) for ModernWallet. A company
ranking for "best high yield savings accounts" has a marketing budget aimed at the exact keyword our roundup
targets — a credible table row and a prospect that replies. Rows land in
fleet_placement_prospects (site='themodernwallet.com') with no email and no site_kind; the
growth-sites-api placement radar enriches + classifies them (the routine calls it right after
this, and the daily 12:00 UTC cron sweeps whatever is left).

Differences from layer3 (both fixes for problems measured there):
  - SERPs are fetched in parallel. layer3's serial loop needs ~45 min for 120 SERPs and is
    killed at the 10-minute tool limit; 64 SERPs here finish in about a minute.
  - Existing rows are never overwritten (resolution=ignore-duplicates). layer3's
    merge-duplicates upsert resets status to 'new' on every re-discovery, which can put an
    already-emailed or disqualified vendor back in the queue.

  python3 scripts/placement/serp_roster_discovery.py --dry-run
  python3 scripts/placement/serp_roster_discovery.py --verticals high-yield-savings-accounts --upsert
  python3 scripts/placement/serp_roster_discovery.py --from-file     # upsert the last dry run
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from lib import dataforseo as dfs  # noqa: E402

CONFIG = json.loads((ROOT / "data" / "placement-verticals.json").read_text())
SITE = CONFIG["site"]
OUT_PATH = ROOT / "reports" / "vendor-roundup" / "serp-roster.json"

# A domain must rank for >= this many of a vertical's head keywords to count as roster.
# Same threshold as layer3 (measured there: 3 drops real vendors and keeps horizontal SaaS).
MIN_HITS = 2
# Ranks 11-20 included: that is where the smaller vendors live, who reply most.
DEPTH = 20
WORKERS = 8

# Never prospects: platforms, retailers, directories, review sites, press, associations, government.
# The radar's classifier catches unknown publishers; this list saves the enrichment fetch on
# the ones we already know. Keep in step with growth-sites-api placement/qualify.mjs +
# PLACEMENT_SITES['thehoaguide.com'].extraPublishers.
BLOCKLIST = {
    "themodernwallet.com", "layer3labs.io", "pipelinemarketing.io",
    "killswitch.rip",  # Killswitch is a client: ranked on merit, never pinned, never Featured, never emailed as a prospect
    "google.com", "youtube.com", "reddit.com", "quora.com", "facebook.com", "linkedin.com",
    "instagram.com", "x.com", "twitter.com", "tiktok.com", "pinterest.com", "medium.com",
    "wikipedia.org", "amazon.com", "apple.com", "apps.apple.com", "play.google.com", "yelp.com", "bbb.org",
    "trustpilot.com", "sitejabber.com", "g2.com", "capterra.com", "getapp.com", "softwareadvice.com",
    "forbes.com", "nytimes.com", "wsj.com", "cnn.com", "cnbc.com", "businessinsider.com", "usnews.com",
    "money.com", "time.com", "fortune.com", "barrons.com", "marketwatch.com", "fool.com", "kiplinger.com",
    "cnet.com", "wired.com", "theverge.com", "zdnet.com", "pcmag.com", "techradar.com", "tomsguide.com",
    "nerdwallet.com", "bankrate.com", "investopedia.com", "thebalancemoney.com", "creditkarma.com",
    "wallethub.com", "magnifymoney.com", "lendingtree.com", "credible.com", "smartasset.com",
    "moneygeek.com", "valuepenguin.com", "thepointsguy.com", "doctorofcredit.com", "depositaccounts.com",
    "finder.com", "experian.com", "investor.gov", "consumerfinance.gov", "fdic.gov", "ncua.gov", "irs.gov",
    "sec.gov", "finra.org", "brokercheck.finra.org", "treasurydirect.gov", "studentaid.gov", "sba.gov",
    "benzinga.com", "stockbrokers.com", "brokerchooser.com", "morningstar.com", "seekingalpha.com",
    "kiplinger.com", "moneyunder30.com", "thecollegeinvestor.com", "financialsamurai.com", "mrmoneymustache.com",
    "bogleheads.org", "whitecoatinvestor.com", "noradarealestate.com", "fundera.com", "nav.com",
    "businessnewsdaily.com", "fitsmallbusiness.com", "merchantmaverick.com", "uschamber.com", "nolo.com",
    "consumerreports.org", "consumeraffairs.com", "topconsumerreviews.com", "top10.com",
}


def blocked(domain: str) -> bool:
    d = domain.lower().removeprefix("www.")
    if d in BLOCKLIST or d.endswith((".gov", ".mil", ".us")):
        return True
    parts = d.split(".")
    return len(parts) > 2 and ".".join(parts[-2:]) in BLOCKLIST


def fetch(kw: str) -> tuple[str, list]:
    try:
        return kw, (dfs.serp_organic(kw, depth=DEPTH, paa_depth=0).get("items") or [])
    except Exception as exc:  # one failed SERP must not lose the vertical
        print(f"    ! {kw}: {exc}", file=sys.stderr)
        return kw, []


def discover(vertical: dict, serps: dict[str, list]) -> list[dict]:
    tally: dict[str, dict] = defaultdict(lambda: {"hits": 0, "best_rank": 999, "title": "", "description": ""})
    for kw in vertical["keywords"]:
        for item in serps.get(kw, []):
            if item.get("type") != "organic":
                continue
            domain = (item.get("domain") or "").lower().removeprefix("www.")
            if not domain or blocked(domain):
                continue
            rank = item.get("rank_group") or 999
            t = tally[domain]
            t["hits"] += 1
            if rank < t["best_rank"]:
                t["best_rank"], t["title"], t["description"] = rank, item.get("title") or "", item.get("description") or ""
    roster = [{
        "domain": d, "vertical": vertical["id"], "hits": t["hits"], "rank": t["best_rank"],
        "title": t["title"][:160], "description": t["description"][:300],
        "priority": max(1, 60 - 2 * t["best_rank"]),
    } for d, t in tally.items() if t["hits"] >= MIN_HITS]
    roster.sort(key=lambda r: r["rank"])
    return roster


def upsert(rows: list[dict]) -> tuple[int, int]:
    base = dfs.resolve_key("SUPABASE_URL").rstrip("/")
    key = dfs.resolve_key("SUPABASE_SERVICE_ROLE_KEY")
    if not base or not key:
        raise SystemExit("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not available")
    payload = [{
        "site": SITE,
        "domain": r["domain"],
        "name": re.split(r"\s+[|·—–-]\s+", r["title"])[0][:120] or r["domain"],
        "site_url": f"https://{r['domain']}",
        "one_liner": r["description"],
        "sources": [f"serp:{r['vertical']}"],
        "vertical": r["vertical"],
        "serp_rank": r["rank"],
        "priority": r["priority"],
        "notes": f"SERP roster: ranks for {r['hits']} head keywords, best #{r['rank']}",
    } for r in rows]
    # A domain can rank in two verticals; the first (best-ranked) one owns it.
    seen: set[str] = set()
    payload = [p for p in sorted(payload, key=lambda p: p["serp_rank"]) if not (p["domain"] in seen or seen.add(p["domain"]))]
    req = urllib.request.Request(
        f"{base}/rest/v1/fleet_placement_prospects?on_conflict=site,domain",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json", "apikey": key, "Authorization": f"Bearer {key}",
                 "Prefer": "resolution=ignore-duplicates,return=representation"},
        method="POST")
    with urllib.request.urlopen(req, timeout=60) as resp:
        created = json.loads(resp.read() or b"[]")
    return len(created), len(payload) - len(created)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--verticals", default="", help="comma-separated ids; default = all")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--upsert", action="store_true")
    ap.add_argument("--from-file", action="store_true",
                    help="upsert the roster a previous run wrote (no SERP spend)")
    args = ap.parse_args()

    if args.from_file:
        rows = json.loads(OUT_PATH.read_text())
        created, existing = upsert(rows)
        print(f"{len(rows)} roster rows from {OUT_PATH.name}: new prospects {created}, already tracked {existing}", file=sys.stderr)
        return 0

    verticals = CONFIG["verticals"]
    if args.verticals:
        want = {v.strip() for v in args.verticals.split(",") if v.strip()}
        verticals = [v for v in verticals if v["id"] in want]
        if want - {v["id"] for v in verticals}:
            raise SystemExit(f"unknown vertical(s): {', '.join(sorted(want - {v['id'] for v in verticals}))}")
    keywords = sorted({kw for v in verticals for kw in v["keywords"]})
    print(f"{len(verticals)} vertical(s), {len(keywords)} SERPs (~${len(keywords) * 0.002:.2f})", file=sys.stderr)
    with ThreadPoolExecutor(WORKERS) as pool:
        serps = dict(pool.map(fetch, keywords))

    all_rows: list[dict] = []
    for v in verticals:
        roster = discover(v, serps)
        all_rows.extend(roster)
        print(f"\n{v['label']} ({v['id']}) -> {len(roster)} roster domains", file=sys.stderr)
        for r in roster[:30]:
            print(f"   #{r['rank']:<3} hits={r['hits']}  {r['domain']:<34} {r['title'][:50]}", file=sys.stderr)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(all_rows, indent=2) + "\n")
    print(f"\n{len(all_rows)} roster rows. cost: {dfs.cost_summary()}", file=sys.stderr)
    if args.upsert and not args.dry_run:
        created, existing = upsert(all_rows)
        print(f"new prospects {created}, already tracked {existing}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
