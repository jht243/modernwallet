#!/usr/bin/env python3
"""Translate mined patient-pain clusters into real informational search terms and
SEMRUSH-validate them.

Stdlib only. Reads pain_clusters.json (theme -> count), expands each PRESENT theme
into candidate SEARCH phrases (the questions/terms readers actually type — NOT the
pain phrasing), validates them on SEMRUSH (phrase_these + phrase_kdi), and writes
validated_terms.json for the auto-approve chart step. Only terms at/above --floor
survive. Each term is tagged with the site hub used for internal linking.

Needs SEMRUSH_API_KEY in the environment.

Usage:
  SEMRUSH_API_KEY=... python3 scripts/podcast_pain_pass/validate_terms.py \
      --run reports/podcast-pain-pass/run-<DATE> --floor 70
"""
from __future__ import annotations
import argparse, csv, json, os, urllib.parse, urllib.request, urllib.error
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))
from keyword_data import volumes, passes_floor, score_volume, notes  # noqa: E402

# theme -> the internal-linking hub on themodernwallet.com
HUBS = {
    "retirement": "/retirement",
    "investing": "/investing",
    "budget": "/budget",
    "real-estate": "/real-estate",
    "tax-estate": "/estate-planning",
    "net-worth": "/net-worth",
}

# theme -> candidate informational search phrases. Encodes the pain->query insight;
# SEMRUSH then filters to real demand. These are questions/terms people TYPE, not the
# spoken pain from the transcript.
THEME_TERMS = {
    "retirement": ["how much do i need to retire", "roth vs traditional ira", "when to take social security", "coast fire calculator"],
    "investing": ["how to start investing", "index funds vs etf", "dividend investing strategy", "portfolio rebalancing"],
    "budget": ["how to make a budget", "emergency fund amount", "debt payoff strategy", "50 30 20 rule"],
    "real-estate": ["mortgage payoff calculator", "rental property roi", "should i refinance", "closing costs explained"],
    "tax-estate": ["estate planning basics", "how does probate work", "tax deductions checklist", "trust vs will"],
    "net-worth": ["how to calculate net worth", "average net worth by age", "net worth milestones"],
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True)
    ap.add_argument("--floor", type=int, default=70, help="min monthly volume to keep")
    ap.add_argument("--database", default=os.environ.get("SEMRUSH_DATABASE", "us"))
    args = ap.parse_args()

    run = ROOT / args.run
    clusters = json.loads((run / "pain_clusters.json").read_text())

    # build candidate set from PRESENT themes only
    candidates = {}  # phrase -> {theme}
    for theme in clusters:
        for p in THEME_TERMS.get(theme, []):
            candidates.setdefault(p, {"theme": theme})
    phrases = list(candidates)
    if not phrases:
        (run / "validated_terms.json").write_text("[]")
        print("No candidate phrases generated.")
        return

    # Volume validation via the shared fallback ladder (never blocks on a dry key)
    rows = volumes(phrases, database=args.database)

    out = []
    for p, meta in candidates.items():
        r = rows.get(p.lower())
        if not r or not passes_floor(r, args.floor):
            continue
        vol = r.get("volume", 0)
        out.append({"phrase": p, "volume": vol,
                    "kd": r.get("kd", ""), "source": r.get("source", ""),
                    "confidence": r.get("confidence", ""),
                    "volume_low": r.get("volume_low"),
                    "volume_high": r.get("volume_high"),
                    "scored_volume": score_volume(r),
                    "theme": meta["theme"], "hub": HUBS.get(meta["theme"], "/")})
    out.sort(key=lambda x: -x["scored_volume"])
    (run / "validated_terms.json").write_text(json.dumps(out, indent=1))
    (run / "keyword_data_notes.json").write_text(json.dumps(notes(), indent=1))
    _src = {}
    for _e in out:
        _src[_e["source"]] = _src.get(_e["source"], 0) + 1
    print(f"Sources: {_src}")
    if _src.get("estimate"):
        print("NOTE: estimate rows carry a volume BAND, not measured volume — "
              "label them as estimated in the chart.")
    print(f"Validated {len(out)}/{len(phrases)} candidate terms >= {args.floor} vol/mo")
    for e in out[:25]:
        print(f"  {e['volume']:>6}  KD{e['kd']:<3}  {e['phrase']}  [{e['theme']}]")
    print(f"-> {run/'validated_terms.json'}")


if __name__ == "__main__":
    main()
