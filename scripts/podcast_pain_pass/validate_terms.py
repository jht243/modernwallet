#!/usr/bin/env python3
"""Translate mined pain clusters into real search terms and SEMRUSH-validate them.

Stdlib only. Reads pain_clusters.json (per vertical -> theme -> count), expands
each present (vertical, theme) into candidate SEARCH phrases (the calculator /
how-much / X-vs-Y terms people actually type, not the pain phrasing), validates
them on SEMRUSH (phrase_these + phrase_kdi), and writes validated_terms.json for
the auto-approve chart step. Only terms at/above --floor survive.

Consumer-personal-finance analogue of the source routine's software-term
validator: the THEME_TERMS below encode "which money query answers this pain",
and SEMRUSH filters to real demand.

Needs SEMRUSH_API_KEY in the environment.

Usage:
  SEMRUSH_API_KEY=... python3 scripts/podcast_pain_pass/validate_terms.py \
      --run reports/podcast-pain-pass/run-<DATE> --floor 70
"""
from __future__ import annotations
import argparse, csv, json, os, urllib.parse, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# vertical -> optional vocab for {v} templates (finance phrases rarely need it,
# but kept for parity + a few "{v} calculator" style expansions).
VOCAB = {
    "investing": ["investment"],
    "retirement": ["retirement"],
    "debt": ["debt"],
    "personal-finance": ["money"],
}

# theme -> the money queries a listener with that pain actually searches.
# Calculator / how-much / X-vs-Y intent. SEMRUSH then filters to real demand.
THEME_TERMS = {
    "mortgage-home-buying": ["how much house can i afford", "mortgage payoff calculator",
                             "down payment calculator", "closing cost calculator",
                             "refinance calculator", "biweekly mortgage calculator",
                             "rent vs buy calculator"],
    "retirement-savings": ["how much do i need to retire", "401k vs roth ira",
                           "roth ira calculator", "retirement savings calculator",
                           "how much to save for retirement", "401k calculator",
                           "social security break even calculator"],
    "debt-payoff": ["debt payoff calculator", "debt snowball vs avalanche",
                    "credit card payoff calculator", "how long to pay off credit card",
                    "student loan payoff calculator", "debt consolidation calculator",
                    "pay off debt or invest"],
    "budgeting-saving": ["50 30 20 budget calculator", "emergency fund calculator",
                         "how much emergency fund", "savings goal calculator",
                         "how much should i save each month", "paycheck budget calculator"],
    "investing": ["compound interest calculator", "investment growth calculator",
                  "how much to invest per month", "index fund vs etf",
                  "roth ira vs brokerage account", "dividend calculator"],
    "credit-score": ["credit utilization calculator", "how to raise credit score",
                     "credit score to buy a house", "how long to build credit",
                     "credit card interest calculator"],
    "taxes": ["capital gains tax calculator", "tax bracket calculator",
              "how much tax will i pay", "paycheck tax calculator",
              "roth conversion calculator"],
    "insurance-estate": ["net worth calculator", "how much life insurance do i need",
                         "term vs whole life insurance", "will cost calculator",
                         "estate tax calculator"],
}

# theme -> ModernWallet category hub (best guess; phase-1 resolves the exact
# live route against the repo's actual category slugs before it lands in a row).
THEME_HUB = {
    "mortgage-home-buying": "mortgage",
    "retirement-savings": "retirement",
    "debt-payoff": "debt",
    "budgeting-saving": "budget",
    "investing": "investing",
    "credit-score": "credit",
    "taxes": "tax",
    "insurance-estate": "estate-planning",
}


def semrush_csv(key, params):
    q = {"key": key, "export_escape": 1, "export_decode": 1, **params}
    url = "https://api.semrush.com/?" + urllib.parse.urlencode(q)
    req = urllib.request.Request(url, headers={"User-Agent": "ModernWallet-SEO-Research/1.0"})
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

    # build candidate set from present (vertical, theme) pairs
    candidates = {}  # phrase -> {vertical, theme}
    for vert, themes in clusters.items():
        vocab = VOCAB.get(vert, [vert])
        for theme in themes:
            for tmpl in THEME_TERMS.get(theme, []):
                phrases = [tmpl.replace("{v}", w) for w in vocab] if "{v}" in tmpl else [tmpl]
                for p in phrases:
                    candidates.setdefault(p, {"vertical": vert, "theme": theme})
    phrases = list(candidates)
    if not phrases:
        (run / "validated_terms.json").write_text("[]")
        print("No candidate phrases generated.")
        return

    # SEMRUSH batch (chunks of 100)
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
                    "vertical": meta["vertical"], "theme": meta["theme"],
                    "hub": f"/{THEME_HUB.get(meta['theme'], meta['vertical'])}/"})
    out.sort(key=lambda x: -x["volume"])
    (run / "validated_terms.json").write_text(json.dumps(out, indent=1))
    print(f"Validated {len(out)}/{len(phrases)} candidate terms >= {args.floor} vol/mo")
    for e in out[:25]:
        print(f"  {e['volume']:>6}  KD{e['kd']:<3}  {e['phrase']}  [{e['vertical']}/{e['theme']}]")
    print(f"-> {run/'validated_terms.json'}")


if __name__ == "__main__":
    main()
