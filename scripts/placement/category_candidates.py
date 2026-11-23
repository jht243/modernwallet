#!/usr/bin/env python3
"""
Phase 1c of /vendor-roundup-auto: find NEW vendor categories the site has no comparison page for.

Owner rule (2026-10-11, fleet-wide): roundups are not limited to the categories we started with.
When vendors show up that fit no existing comparison page, the routine creates a new category and,
once it has >= 4 qualified vendors, builds its comparison page.

Two evidence sources, merged into one candidate list:
  1. CUT-AS-OTHER-CATEGORY vendors: rows files (reports/vendor-roundup/rows/*.json) whose cut[]
     reason says the vendor fits a different/new category ("category 4", "different category",
     "other category", "new category"), with the routine's suggested category in the reason.
  2. BUYER DEMAND: DataForSEO keyword suggestions containing the site's expansionSeeds (data/placement-verticals.json),
     filtered to commercial "who do I buy from" queries (best/top/companies/software/services/lenders/
     insurance/providers/apps/firms/near me…) that NO existing vertical's keywords already cover.

Writes reports/vendor-roundup/category-candidates.json and prints the top candidates by volume.
Read-only (except the report). The ROUTINE decides which candidates become verticals (see the
playbook's Phase 1c). Cost: one keyword_suggestions call per seed (~$0.02-0.06 each).

  python3 scripts/placement/category_candidates.py [--verticals-json reports/verticals.json] [--min-volume 50]
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from lib import dataforseo as dfs  # noqa: E402
from lib import semrush as sr  # noqa: E402

COMMERCIAL = re.compile(r"\b(best|top|compan(y|ies)|software|services?|providers?|lenders?|insurance|"
                        r"insurers?|apps?|tools?|platforms?|firms?|vendors?|near me|programs?|plans?|"
                        r"brokers?|brokerages?|agenc(y|ies)|consultants?|contractors?|apps?|banks?|lenders?|cards?|accounts?|"
                        r"advisors?|platforms?|services?|providers?|companies|trackers?)\b", re.I)
# Informational queries are not vendor categories.
INFORMATIONAL = re.compile(r"\b(how|what|why|when|is|are|can|does|do|should|definition|meaning|vs|"
                           r"template|example|sample|form|law|laws|rules|requirements?)\b", re.I)
CUT_OTHER = re.compile(r"category 4|different (vertical|category)|other (vertical|category)|"
                       r"new (vertical|category)|fits (a |the )?[\w\s-]+ (vertical|category)", re.I)
STOP = {"best", "top", "the", "for", "a", "an", "of", "and", "in", "to", "near", "me", "2025", "2026", "2027", "online"}


SYNONYMS = [  # applied before tokenizing so near-synonyms count as one category
    (r"\bhigh[- ]yield\b", "hys"), (r"\bhysa\b", "hys savings"), (r"\bcredit cards?\b", "card"),
    (r"\brobo[- ]?advis[oe]rs?\b", "robo"), (r"\bbrokerages?\b", "broker"), (r"\bbrokers?\b", "broker"),
    (r"\bloans?\b", "loan"), (r"\blenders?\b", "loan"), (r"\bapplications?\b", "app"), (r"\bsoftware\b", "app"),
    (r"\b401\(?k\)?s?\b", "401k"), (r"\bindividual retirement accounts?\b", "ira"),
]


def tokens(s: str) -> set[str]:
    s = s.lower()
    for pat, rep in SYNONYMS:
        s = re.sub(pat, rep, s)
    out = set()
    for t in re.findall(r"[a-z0-9&]+", s):
        if t in STOP or len(t) < 2:
            continue
        if len(t) > 4 and t.endswith("ies"):
            t = t[:-3] + "y"
        elif len(t) > 3 and t.endswith("s") and not t.endswith("ss"):
            t = t[:-1]
        out.add(t)
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--verticals-json", default="data/placement-verticals.json",
                    help="site config with verticals[].keywords + expansionSeeds (layer3: a dump of verticals.ts)")
    ap.add_argument("--seeds", default="", help="comma-separated seeds (overrides config expansionSeeds; layer3 passes these)")
    ap.add_argument("--min-volume", type=int, default=50)
    ap.add_argument("--limit", type=int, default=400)
    ap.add_argument("--cache-days", type=int, default=14, help="Reuse cached monthly keyword suggestions per seed for N days (0 disables)")
    ap.add_argument("--no-cache", action="store_true", help="Force live keyword_suggestions fetch ignoring disk cache")
    args = ap.parse_args()

    cfg = json.loads((ROOT / args.verticals_json).read_text())
    verticals = cfg["verticals"] if isinstance(cfg, dict) else cfg
    seeds = ([x.strip() for x in args.seeds.split(",") if x.strip()]
             or (cfg.get("expansionSeeds") if isinstance(cfg, dict) else None) or [])
    covered = [tokens(k) for v in verticals for k in v.get("keywords", [])]
    covered += [tokens(v.get("label", "")) for v in verticals]

    def is_covered(q: str) -> bool:
        t = tokens(q)
        # covered when an existing keyword's significant words are all present in the query
        return any(c and c <= t for c in covered)

    # 1. cut-as-other-category vendors from rows files
    other: dict[str, list[str]] = defaultdict(list)
    for f in sorted((ROOT / "reports" / "vendor-roundup" / "rows").glob("*.json")):
        try:
            spec = json.loads(f.read_text())
        except Exception:
            continue
        for c in spec.get("cut", []):
            why = c.get("why", "")
            if CUT_OTHER.search(why):
                m = re.search(r"(?:fits|belongs (?:on|in)|suggest(?:ed)?(?: category)?:?)\s+(?:a |an |the )?([\w\s&/-]{3,60}?)(?:\s+(?:vertical|category|page)|[.;,)]|$)", why, re.I)
                other[(m.group(1).strip().lower() if m else "unlabelled")].append(c.get("domain", ""))

    # 2. buyer-demand queries CONTAINING one of the site's seeds (keyword_suggestions — the tight
    #    expansion; keyword_ideas broad-matches and drifts off-topic, measured 2026-10-11 on HOA:
    #    "cloud accounting software", "home care services").
    cache_path = ROOT / "reports" / "vendor-roundup" / ".category-candidates-cache.json"
    cache_data: dict[str, dict] = {}
    if not args.no_cache and args.cache_days > 0 and cache_path.is_file():
        try:
            loaded = json.loads(cache_path.read_text())
            if isinstance(loaded, dict):
                cache_data = loaded
        except Exception:
            cache_data = {}
    now_utc = dt.datetime.now(dt.timezone.utc)
    ttl_seconds = max(0, args.cache_days) * 86400
    cache_dirty = False
    disk_hits = 0
    sb_hits = 0
    sb_writes: list[dict] = []

    def _sb_cache_get(keys: list[str]) -> dict[str, list]:
        if not keys or args.no_cache or ttl_seconds <= 0 or not hasattr(dfs, "_sb_req"):
            return {}
        try:
            import urllib.parse
            since = (now_utc - dt.timedelta(seconds=ttl_seconds)).isoformat().replace("+00:00", "Z")
            q_in = ",".join(keys)
            rows = dfs._sb_req(
                "GET",
                f"category_candidates_cache?select=cache_key,ideas,fetched_at"
                f"&cache_key=in.({urllib.parse.quote(q_in, safe=',')})"
                f"&fetched_at=gte.{urllib.parse.quote(since)}",
            )
            found: dict[str, list] = {}
            for r in (rows or []):
                ck = r.get("cache_key")
                id_list = r.get("ideas")
                if isinstance(ck, str) and isinstance(id_list, list):
                    found[ck] = id_list
            return found
        except Exception:
            return {}

    sb_configured = hasattr(dfs, "_sb") and bool(dfs._sb()[0])
    if seeds and not args.no_cache and ttl_seconds > 0 and not sb_configured:
        print("! category_candidates: SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not set — 14d Supabase cache disabled (pass SUPABASE_* inline)", file=sys.stderr)

    def _sb_cache_put(rows: list[dict]) -> None:
        if not rows or not hasattr(dfs, "_sb_req") or not sb_configured:
            return
        try:
            res = dfs._sb_req(
                "POST",
                "category_candidates_cache?on_conflict=cache_key",
                rows,
                prefer="resolution=merge-duplicates,return=minimal",
            )
            if res is None:
                print(f"! category_candidates: Supabase cache write failed for {len(rows)} seed(s)", file=sys.stderr)
            else:
                print(f"category_candidates cache: saved {len(rows)} seed(s) to 14d Supabase cache", file=sys.stderr)
        except Exception as exc:
            print(f"! category_candidates: Supabase cache write error: {exc}", file=sys.stderr)

    demand: list[dict] = []
    seen: set[str] = set()
    seed_keys = [
        (seed, hashlib.sha256(f"{seed.strip().lower()}|{args.limit}|{args.min_volume}".encode()).hexdigest()[:24])
        for seed in seeds
    ]
    missing_from_disk: list[str] = []
    if not args.no_cache and ttl_seconds > 0:
        for _, ckey in seed_keys:
            ent = cache_data.get(ckey) or {}
            valid_disk = False
            try:
                cached_at = dt.datetime.fromisoformat(str(ent.get("cachedAt", "")).replace("Z", "+00:00"))
                valid_disk = (now_utc - cached_at).total_seconds() < ttl_seconds and isinstance(ent.get("ideas"), list)
            except Exception:
                valid_disk = False
            if not valid_disk:
                missing_from_disk.append(ckey)
    sb_cached = _sb_cache_get(missing_from_disk)

    if seeds and (sr.available() or dfs.available() or cache_data or sb_cached):
        for seed, ckey in seed_keys:
            ideas = None
            if not args.no_cache and ttl_seconds > 0 and ckey in cache_data:
                ent = cache_data.get(ckey) or {}
                try:
                    cached_at = dt.datetime.fromisoformat(str(ent.get("cachedAt", "")).replace("Z", "+00:00"))
                    if (now_utc - cached_at).total_seconds() < ttl_seconds and isinstance(ent.get("ideas"), list):
                        ideas = ent["ideas"]
                        disk_hits += 1
                except Exception:
                    ideas = None
            if ideas is None and ckey in sb_cached:
                ideas = sb_cached[ckey]
                sb_hits += 1
                if ttl_seconds > 0:
                    cache_data[ckey] = {"seed": seed, "cachedAt": now_utc.isoformat().replace("+00:00", "Z"), "ideas": ideas}
                    cache_dirty = True
            if ideas is None:
                # SEMRUSH first (USER RULE 2026-11-02); DataForSEO only when SEMRUSH fails.
                fetched_source = "semrush"
                try:
                    if not sr.available():
                        raise RuntimeError("SEMRUSH unavailable")
                    ideas = sr.keyword_suggestions(seed, limit=args.limit, min_volume=args.min_volume)
                except Exception as exc:
                    print(f"! SEMRUSH phrase_fullsearch({seed!r}) failed: {exc} -> DataForSEO", file=sys.stderr)
                    fetched_source = "dataforseo"
                    try:
                        if not dfs.available():
                            raise RuntimeError("DataForSEO unavailable")
                        ideas = dfs.keyword_suggestions(seed, limit=args.limit, min_volume=args.min_volume)
                    except Exception as exc2:
                        print(f"! keyword_suggestions({seed!r}) failed: {exc2}", file=sys.stderr)
                        continue
                if ttl_seconds > 0:
                    ts_iso = now_utc.isoformat().replace("+00:00", "Z")
                    cache_data[ckey] = {"seed": seed, "cachedAt": ts_iso, "ideas": ideas}
                    cache_dirty = True
                    sb_writes.append({
                        "cache_key": ckey,
                        "seed": seed.strip().lower(),
                        "min_volume": int(args.min_volume),
                        "row_limit": int(args.limit),
                        "source": fetched_source,
                        "ideas": ideas,
                        "fetched_at": ts_iso,
                    })
            for i in ideas:
                q = (i.get("keyword") or "").lower()
                if (not q or q in seen or not COMMERCIAL.search(q) or INFORMATIONAL.search(q) or is_covered(q)
                        or re.search(r"\b(inc|llc|houston|tx|nj|ny|ca|fl|login|portal|phone|number|careers?|jobs?)\b", q)):
                    continue
                seen.add(q)
                demand.append({"query": q, "volume": i.get("volume") or 0, "cpc": i.get("cpc"), "seed": seed})
        if sb_writes:
            _sb_cache_put(sb_writes)
        if cache_dirty:
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_text(json.dumps(cache_data, indent=2) + "\n")
        total_hits = disk_hits + sb_hits
        if total_hits:
            print(
                f"category_candidates cache: {total_hits}/{len(seeds)} seed(s) served from {args.cache_days}d cache "
                f"(supabase={sb_hits}, disk={disk_hits})",
                file=sys.stderr,
            )
    elif not seeds:
        print("! no expansionSeeds in the config: demand source skipped", file=sys.stderr)

    # group demand queries into rough categories by their significant words
    groups: dict[str, dict] = {}
    for d in sorted(demand, key=lambda x: -x["volume"]):
        key = " ".join(sorted(tokens(d["query"])))[:80]
        g = groups.setdefault(key, {"head": d["query"], "volume": 0, "queries": []})
        g["volume"] += d["volume"]
        g["queries"].append(d["query"])
    cands = sorted(groups.values(), key=lambda g: -g["volume"])

    out = {"site": cfg.get("site") if isinstance(cfg, dict) else None,
           "cut_as_other_category": {k: sorted(set(v)) for k, v in other.items()},
           "demand_candidates": cands[:60],
           "cost": dfs.cost_summary()}
    p = ROOT / "reports" / "vendor-roundup" / "category-candidates.json"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(out, indent=2) + "\n")

    print(f"cut-as-other-category groups: {len(other)}")
    for k, v in other.items():
        print(f"  {k}: {len(v)} vendor(s) {', '.join(sorted(set(v))[:6])}")
    print(f"\nuncovered buyer-demand categories (top 25 of {len(cands)}):")
    for g in cands[:25]:
        print(f"  {g['volume']:>7}  {g['head']}  (+{len(g['queries']) - 1} variants)")
    print(f"\n{dfs.cost_summary()}\n-> {p.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
