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
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

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


def semrush_csv(key, params):
    q = {"key": key, "export_escape": 1, "export_decode": 1, **params}
    url = "https://api.semrush.com/?" + urllib.parse.urlencode(q)
    req = urllib.request.Request(url, headers={"User-Agent": "modernwallet-SEO-Research/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            body = r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"SEMrush HTTP {e.code}")
    if body.startswith("ERROR 50"):
        return []
    if body.lower().startswith(("error", "not enough", "wrong")):
        raise RuntimeError(body[:160])
    lines = [l for l in body.splitlines() if l.strip()]
    return list(csv.DictReader(lines, delimiter=";")) if len(lines) >= 2 else []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True)
    ap.add_argument("--floor", type=int, default=70, help="min monthly volume to keep")
    ap.add_argument("--database", default=os.environ.get("SEMRUSH_DATABASE", "us"))
    args = ap.parse_args()
    key = os.environ.get("SEMRUSH_API_KEY")
    if not key:
        raise SystemExit("SEMRUSH_API_KEY unset — cannot validate. Aborting (no fabricated volume).")

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

    these, kdi = {}, {}
    for i in range(0, len(phrases), 100):
        chunk = phrases[i:i + 100]
        for r in semrush_csv(key, {"type": "phrase_these", "database": args.database,
                                   "phrase": ";".join(chunk), "export_columns": "Ph,Nq,Cp,Co,Kd"}):
            these[r["Keyword"].lower()] = r
        for r in semrush_csv(key, {"type": "phrase_kdi", "database": args.database,
                                   "phrase": ";".join(chunk), "export_columns": "Ph,Kd"}):
            kdi[r["Keyword"].lower()] = r.get("Keyword Difficulty Index", "")

    out = []
    for p, meta in candidates.items():
        r = these.get(p.lower())
        vol = int(float(r["Search Volume"])) if r and r.get("Search Volume") else 0
        if vol < args.floor:
            continue
        out.append({"phrase": p, "volume": vol,
                    "kd": kdi.get(p.lower(), (r.get("Keyword Difficulty Index", "") if r else "")),
                    "theme": meta["theme"], "hub": HUBS.get(meta["theme"], "/")})
    out.sort(key=lambda x: -x["volume"])
    (run / "validated_terms.json").write_text(json.dumps(out, indent=1))
    print(f"Validated {len(out)}/{len(phrases)} candidate terms >= {args.floor} vol/mo")
    for e in out[:25]:
        print(f"  {e['volume']:>6}  KD{e['kd']:<3}  {e['phrase']}  [{e['theme']}]")
    print(f"-> {run/'validated_terms.json'}")


if __name__ == "__main__":
    main()
