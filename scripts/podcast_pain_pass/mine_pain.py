#!/usr/bin/env python3
"""Mine pulled transcripts for 'money-decision pain' and cluster into themes.

Stdlib only. Reads a run manifest (from pull_new_episodes.py), scans each
transcript for sentences where a listener is stuck on a money DECISION or
CALCULATION (the pain a ModernWallet calculator/guide could answer), clusters
them into finance themes, and writes pain_clusters.json for the SEMRUSH step.

This is the consumer-personal-finance analogue of the source routine's
"automatable manual work" miner: instead of "what work do practitioners wish
they could automate", it surfaces "what money question/number are listeners
struggling to figure out".

Usage:
  python3 scripts/podcast_pain_pass/mine_pain.py --run reports/podcast-pain-pass/run-<DATE>
"""
from __future__ import annotations
import argparse, json, re
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[2]

# Decision / confusion / calculation cues — the listener is stuck on a money
# question a tool or guide could resolve. Broad on purpose; THEMES scope it.
CUES = [
    r"\bhow much (?:should|do|can|would) i\b", r"\bhow do i (?:calculate|figure|know|decide)\b",
    r"\bcan i afford\b", r"\bcan we afford\b", r"\bhow much (?:house|home|car|do i need)\b",
    r"\bam i saving enough\b", r"\bhow long (?:will it take|until)\b", r"\bwhat'?s the difference between\b",
    r"\bshould i (?:pay off|invest|refinance|buy|rent|save|contribute|roll(?: over)?)\b",
    r"\bis it (?:better|worth it) to\b", r"\bworth it\b", r"\brun the numbers\b", r"\bdo the math\b",
    r"\bnot sure (?:if|how|whether)\b", r"\bconfused about\b", r"\bdon'?t know how much\b",
    r"\bfigure out (?:how much|whether|if)\b", r"\bstruggl(?:e|ing) (?:to|with)\b",
    r"\bdrowning in\b", r"\bbehind on\b", r"\bhow much (?:will|would) (?:it|that) cost\b",
    r"\bwish (?:i|we) (?:knew|understood|had)\b", r"\bif only i (?:knew|understood)\b",
    r"\bhow much (?:to|per month|a month) (?:save|invest|put)\b", r"\bhow much interest\b",
    r"\bwhat (?:would|will) my (?:payment|monthly)\b", r"\bhow much (?:tax|taxes)\b",
]
CUE_RE = re.compile("|".join(CUES), re.I)

# Finance themes → the language that flags each. Mapped to ModernWallet's
# calculator/guide coverage areas. A theme fires when a cue sentence also
# matches its lexicon.
THEMES = {
    "mortgage-home-buying": [r"mortgage", r"\bhome(?: ?buy| loan)?", r"\bhouse\b", r"down ?payment",
                             r"\bpmi\b", r"escrow", r"closing cost", r"refinanc", r"\bheloc\b",
                             r"home equity", r"first[- ]time buyer", r"\bapr\b"],
    "retirement-savings": [r"retire", r"401\s?\(?k\)?", r"\bira\b", r"\broth\b", r"pension",
                           r"social security", r"nest egg", r"\brmd\b", r"annuity",
                           r"\bfire\b", r"early retirement", r"withdraw(?:al)?"],
    "debt-payoff": [r"\bdebt\b", r"credit card", r"pay(?:ing)? off", r"\bloan\b", r"student loan",
                    r"minimum payment", r"snowball", r"avalanche", r"consolidat", r"payoff",
                    r"interest rate", r"\bapr\b", r"underwater"],
    "budgeting-saving": [r"\bbudget", r"\bsav(?:e|ing)", r"emergency fund", r"paycheck",
                         r"\bspending\b", r"sinking fund", r"live on", r"cut (?:back|expenses)",
                         r"cash ?flow", r"\bexpenses?\b"],
    "investing": [r"\binvest", r"index fund", r"\betf\b", r"portfolio", r"brokerage", r"compound",
                  r"dividend", r"\bstock", r"\bbond", r"asset allocation", r"\bs&p\b", r"returns?"],
    "credit-score": [r"credit score", r"credit report", r"\bfico\b", r"utilization", r"dispute",
                     r"build(?:ing)? credit", r"credit limit", r"hard inquiry"],
    "taxes": [r"\btax(?:es|able)?\b", r"deduction", r"withhold", r"refund", r"capital gains",
              r"tax bracket", r"\bw-?4\b", r"\b1099\b", r"estimated tax"],
    "insurance-estate": [r"insurance", r"life insurance", r"\bwill\b", r"estate", r"\btrust\b",
                         r"beneficiar", r"inheritance", r"net worth", r"probate", r"long[- ]term care"],
}
COMP = {k: re.compile("|".join(v), re.I) for k, v in THEMES.items()}


def sentences(text):
    return re.split(r"(?<=[.!?])\s+", text)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True)
    args = ap.parse_args()
    run = ROOT / args.run
    manifest = json.loads((run / "manifest.json").read_text())

    # vertical -> theme -> list of {ep, text}
    clusters = defaultdict(lambda: defaultdict(list))
    for ep in manifest:
        text = (ROOT / ep["transcript"]).read_text()
        for s in sentences(text):
            s = s.strip()
            if not (25 <= len(s) <= 240 and CUE_RE.search(s)):
                continue
            for theme, rx in COMP.items():
                if rx.search(s):
                    clusters[ep["vertical"]][theme].append({"ep": ep["title"][:70], "text": s})

    out = {}
    for vert, themes in clusters.items():
        out[vert] = {}
        for theme, hits in themes.items():
            # keep a couple of short representative fragments for grounding
            reps = [h["text"] for h in hits if len(h["text"]) <= 160][:2]
            out[vert][theme] = {"count": len(hits), "examples": reps}
    (run / "pain_clusters.json").write_text(json.dumps(out, indent=1))
    total = sum(t["count"] for v in out.values() for t in v.values())
    print(f"Mined {total} money-decision sentences across {len(manifest)} episodes")
    for vert, themes in sorted(out.items()):
        top = sorted(themes.items(), key=lambda kv: -kv[1]["count"])
        print(f"  {vert}: " + ", ".join(f"{k}({v['count']})" for k, v in top))
    print(f"-> {run/'pain_clusters.json'}")


if __name__ == "__main__":
    main()
