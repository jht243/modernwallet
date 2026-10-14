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
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from lib import dataforseo as dfs  # noqa: E402

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
    demand: list[dict] = []
    seen: set[str] = set()
    if seeds and dfs.available():
        for seed in seeds:
            try:
                ideas = dfs.keyword_suggestions(seed, limit=args.limit, min_volume=args.min_volume)
            except Exception as exc:
                print(f"! keyword_suggestions({seed!r}) failed: {exc}", file=sys.stderr)
                continue
            for i in ideas:
                q = (i.get("keyword") or "").lower()
                if (not q or q in seen or not COMMERCIAL.search(q) or INFORMATIONAL.search(q) or is_covered(q)
                        or re.search(r"\b(inc|llc|houston|tx|nj|ny|ca|fl|login|portal|phone|number|careers?|jobs?)\b", q)):
                    continue
                seen.add(q)
                demand.append({"query": q, "volume": i.get("volume") or 0, "cpc": i.get("cpc"), "seed": seed})
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
