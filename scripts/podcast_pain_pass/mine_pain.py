#!/usr/bin/env python3
"""Mine pulled transcripts for PATIENT pain (symptoms, struggles, unanswered
questions) and cluster into the site's themodernwallet.com content themes.

Stdlib only. Reads a run manifest (from pull_new_episodes.py), scans each
transcript for patient-pain sentences, clusters them per topic theme, and writes
pain_clusters.json for the SEMRUSH validation step.

This is the consumer-health analog of layer3's B2B miner: instead of "task I want
to automate" the signal is "symptom / struggle / question a reader is searching
help for" — the exact demand a health journal answers with an informational page.

Usage:
  python3 scripts/podcast_pain_pass/mine_pain.py --run reports/podcast-pain-pass/run-<DATE>
"""
from __future__ import annotations
import argparse, json, re
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[2]

# Patient-pain signal: symptoms/struggle, confusion/questions, and lab/number talk.
CUES = [
    # symptom / struggle
    r"\bstruggl", r"\bsuffer", r"\bexhaust", r"\btired all the time\b", r"\bfatigue",
    r"\bno energy\b", r"\blow energy\b", r"\bbrain fog\b", r"\bcan'?t sleep\b", r"\binsomnia\b",
    r"\bnight sweats?\b", r"\bhot flash", r"\bmood swings?\b", r"\banxious\b", r"\banxiety\b",
    r"\bdepress", r"\birritab", r"\bhair (?:loss|thinning|falling)\b", r"\bcravings?\b",
    r"\blow libido\b", r"\bsex drive\b", r"\bgained? weight\b", r"\bweight (?:gain|won'?t)\b",
    r"\bcan'?t lose\b", r"\bcould'?nt lose\b", r"\bcouldn'?t lose\b", r"\bbelly fat\b",
    r"\bbloat", r"\bjoint pain\b", r"\bmuscle loss\b", r"\bweak(?:er|ness)?\b", r"\bfracture",
    # confusion / unanswered question
    r"\bnobody (?:told|talks)\b", r"\bno one (?:told|talks)\b", r"\bdidn'?t know\b",
    r"\bwish (?:i|i'?d|someone)\b", r"\bmy doctor\b", r"\bdoctor (?:said|told|won'?t|wouldn'?t|dismiss)\b",
    r"\bdismissed\b", r"\bis it normal\b", r"\bwhy (?:do|am|is|does) i\b", r"\bwhat'?s (?:going on|happening)\b",
    r"\bconfused\b", r"\bkept (?:getting|being)\b", r"\bwhat (?:dose|dosage)\b", r"\bhow much\b",
    r"\bshould i (?:take|test|get)\b", r"\bhow do i\b", r"\bhow to\b",
    # labs / numbers
    r"\bmy (?:levels?|numbers?|labs?|results?)\b", r"\bblood (?:work|test|panel)\b",
    r"\btested?\b", r"\bnormal range\b", r"\bout of range\b", r"\bdeficien", r"\bbiomarker",
    r"\btoo (?:high|low)\b", r"\belevated\b", r"\bcame back (?:high|low|normal)\b",
]
CUE_RE = re.compile("|".join(CUES), re.I)

# Theme -> matcher. Themes map to the site's IA hubs (see validate_terms.py HUBS).
THEMES = {
    "retirement": [r"retire", r"401k", r"\bira\b", r"roth", r"pension", r"social security", r"rmd", r"annuit", r"coast fire", r"\bfire\b"],
    "investing": [r"invest", r"portfolio", r"index fund", r"\betf\b", r"dividend", r"allocation", r"rebalanc", r"brokerage", r"stock"],
    "budget": [r"budget", r"spend", r"save", r"emergency fund", r"debt", r"credit card", r"payoff", r"cash flow"],
    "real-estate": [r"mortgage", r"home ?buy", r"refinanc", r"rental", r"landlord", r"property", r"\bheloc\b", r"closing cost"],
    "tax-estate": [r"\btax", r"deduction", r"estate", r"probate", r"trust", r"inherit", r"elder care", r"will\b"],
    "net-worth": [r"net worth", r"track", r"asset", r"liabilit", r"milestone", r"wealth"],
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

    # theme -> list of {ep, text}  (topic from the show is only a coarse hint;
    # the real routing is by the theme matched in the sentence itself)
    clusters = defaultdict(list)
    for ep in manifest:
        text = (ROOT / ep["transcript"]).read_text()
        for s in sentences(text):
            s = s.strip()
            if not (25 <= len(s) <= 260 and CUE_RE.search(s)):
                continue
            for theme, rx in COMP.items():
                if rx.search(s):
                    clusters[theme].append({"ep": ep["title"][:70], "text": s})

    out = {}
    for theme, hits in clusters.items():
        reps = [h["text"] for h in hits if len(h["text"]) <= 180][:3]
        out[theme] = {"count": len(hits), "examples": reps}
    (run / "pain_clusters.json").write_text(json.dumps(out, indent=1))
    total = sum(t["count"] for t in out.values())
    print(f"Mined {total} patient-pain sentences across {len(manifest)} episodes")
    for theme, v in sorted(out.items(), key=lambda kv: -kv[1]["count"]):
        print(f"  {theme}: {v['count']}")
    print(f"-> {run/'pain_clusters.json'}")


if __name__ == "__main__":
    main()
