#!/usr/bin/env python3
"""Metadata-driven classifier for Compliance Alert candidates.

Takes fetch.py output and scores each item on the STRUCTURED signals a new business
obligation actually carries — not just keyword guesses against a terse abstract:

  FEDERAL (Federal Register):
    - cfr_titles   : which CFR title the rule amends = the regulated-domain fingerprint.
                     26=Tax, 29=Labor, 12=Banking, 17=Securities, 20=Benefits, 16=FTC… are
                     where business duties live; 33=Coast Guard, 14=FAA, 50=Fisheries are noise.
    - agency_slugs : issuing agency tier (DOL/IRS/SEC/CFPB… vs Coast Guard/FAA/NOAA…).
    - action       : sub-type — a "correction", "delay", "temporary rule" is NOT a new duty.
    - significant  : economically-significant flag.
  STATE (OpenStates):
    - subjects     : OpenStates' curated subject tags (Labor & Employment, Taxation, …).
  BOTH: expanded duty + business-subject keyword hits as secondary evidence.

Each item gets an additive score; items at/above THRESHOLD pass. This fixes the blunt-AND
gate's two failure modes at once: terse-but-clearly-relevant rules pass on their metadata
(fewer false negatives), and safety-zone/airspace/fishery noise is dropped on domain
(fewer false positives). Deterministic — NO LLM calls (repo rule). The pass skill still
does the final precision judgment on survivors before any page is written.

Usage:
  python3 scripts/compliance_pass/fetch.py --days 7 --out /tmp/raw.json
  python3 scripts/compliance_pass/classify.py /tmp/raw.json \
      --out reports/compliance-pass/$(date +%F).candidates.json
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import re
import sys

THRESHOLD = 5  # score at/above this passes the gate

# ── CFR title → (weight, category, professionals) — the domain fingerprint ───────────────────
# High-weight titles are where affirmative business duties concentrate; noise titles get
# strongly negative weight so navigation/airspace/fishery rules can't reach THRESHOLD.
CFR_MAP: dict[int, tuple[int, str, list[str]]] = {
    8:  (5, "Employment & Labor", ["attorney", "consultant", "tech"]),        # I-9 / E-Verify
    12: (5, "Tax & Finance", ["cpa", "attorney", "tech"]),                    # Banks & Banking
    13: (5, "Tax & Finance", ["cpa", "attorney"]),                            # Business Credit (SBA)
    16: (5, "Consumer Protection", ["attorney", "consultant"]),              # Commercial Practices (FTC)
    17: (5, "Tax & Finance", ["attorney", "cpa"]),                            # Securities/Commodities
    20: (5, "Employment & Labor", ["consultant", "attorney", "cpa"]),        # Employees' Benefits (ERISA)
    26: (5, "Tax & Finance", ["cpa", "attorney", "tech"]),                    # Internal Revenue
    29: (5, "Employment & Labor", ["consultant", "attorney", "tech"]),       # Labor (DOL/OSHA)
    31: (5, "Tax & Finance", ["cpa", "attorney"]),                            # Treasury / FinCEN
    7:  (2, "Consumer Protection", ["consultant", "attorney"]),              # Agriculture (labeling)
    15: (2, "Consumer Protection", ["attorney", "consultant"]),              # Commerce & Foreign Trade
    19: (2, "Tax & Finance", ["consultant", "attorney"]),                     # Customs (importers)
    21: (2, "Healthcare", ["consultant", "attorney"]),                        # Food & Drugs (FDA)
    27: (2, "Licensing & Professions", ["attorney", "consultant"]),          # Alcohol/Tobacco/Firearms
    42: (2, "Healthcare", ["attorney", "consultant"]),                        # Public Health
    45: (2, "Healthcare", ["attorney", "consultant"]),                        # Public Welfare (HHS)
    47: (2, "Privacy & Data", ["attorney", "tech", "consultant"]),           # Telecommunications (FCC)
    48: (2, "Licensing & Professions", ["attorney", "consultant"]),          # Federal Acquisition (contractors)
    49: (3, "Transportation", ["consultant", "attorney"]),                    # Transportation (DOT/FMCSA)
    40: (2, "Environment & Energy", ["consultant", "attorney", "tech"]),     # EPA (SIPs excluded below)
    # Noise domains — strong negative so they can't clear THRESHOLD on stray keywords.
    14: (-8, "", []),   # Aeronautics & Space (FAA)
    33: (-8, "", []),   # Navigable Waters (Coast Guard)
    50: (-8, "", []),   # Wildlife & Fisheries
    5:  (-4, "", []),   # Administrative Personnel (gov-internal)
    32: (-4, "", []),   # National Defense
}

AGENCY_HIGH = {
    "labor-department", "occupational-safety-and-health-administration", "wage-and-hour-division",
    "employee-benefits-security-administration", "employment-and-training-administration",
    "internal-revenue-service", "securities-and-exchange-commission",
    "commodity-futures-trading-commission", "consumer-financial-protection-bureau",
    "federal-trade-commission", "equal-employment-opportunity-commission",
    "national-labor-relations-board", "financial-crimes-enforcement-network",
    "food-and-drug-administration", "centers-for-medicare-medicaid-services",
    "federal-communications-commission", "small-business-administration",
    "federal-motor-carrier-safety-administration", "pipeline-and-hazardous-materials-safety-administration",
    "comptroller-of-the-currency", "federal-deposit-insurance-corporation",
}
AGENCY_NOISE = {
    "coast-guard", "federal-aviation-administration",
    "national-oceanic-and-atmospheric-administration", "fish-and-wildlife-service",
    "national-park-service", "army-corps-of-engineers-department-of-defense",
    "surface-transportation-board",
}

# action sub-type noise — not a new substantive obligation. (Keep plain "Final rule" and
# "Interim final rule" — the latter can carry real duties, e.g. FinCEN BOI.)
ACTION_NOISE = re.compile(
    r"\btemporary rule\b|\bnotification\b|\bcorrection\b|\bdelay of (?:the )?effective date\b"
    r"|\bwithdrawal\b|\bremoval\b|\btechnical amendment\b|\bmeeting\b|\bpetition\b"
    r"|\breopening\b|\bextension of comment\b|\bstay\b",
    re.IGNORECASE,
)

# Title excludes — kill regardless of score (structural noise the metadata can't fully catch).
TITLE_EXCLUDE = re.compile(
    r"\bair plan approval\b|\bstate implementation plan\b|\bair quality (?:designation|plan)\b"
    r"|\bredesignation\b|\bsafety zone\b|\bsecurity zone\b|\bspecial local regulation\b"
    r"|\bdrawbridge\b|\banchorage\b|\bairworthiness directive\b|\bairspace\b"
    r"|\bfisher(?:y|ies)\b|\bmarine mammal\b|\bmigratory (?:bird|species)\b|\bhalibut\b|\btuna\b"
    r"|\bendangered\b|\bthreatened (?:wildlife|species)\b|\bcritical habitat\b"
    r"|\bstandard instrument approach\b|\btolerance\b.{0,20}\bexemption\b"
    r"|\bappropriations?\b|\bcommemorat|\bproclamation\b"
    r"|\bmedical devices?\b.{0,80}\bclassification\b|\bclassification of the\b"
    r"|\bdelegations? of authority\b|\bobsolete regulations?\b"
    r"|\binflation adjustment\b|\bnational environmental policy act\b"
    # single-entity actions (a named company's petition/variance) — not a broad obligation:
    r"|\b(?:approval|petition|variance|exemption|application)\b.{0,40}\b(?:Inc\.?|LLC|L\.?P\.?|Company|Corp\.?)\b",
    re.IGNORECASE,
)

# ── Secondary keyword evidence (expanded with real terms of art) ─────────────────────────────
DUTY_SIGNALS = [
    r"\b(?:shall|must|required to)\b.{0,30}\b(?:file|register|submit|report|disclose|post|provide|maintain|obtain|pay|notify|adopt|implement|certify|display|train|verify|retain)\b",
    r"\b(?:reporting|disclosure|filing|registration|recordkeeping|record-keeping|notice|labeling|certification|licensing|permitting|withholding|training) requirements?\b",
    r"\bcompliance (?:date|deadline|obligations?)\b",
    r"\b(?:annual|quarterly|periodic) (?:report|filing|disclosure|statement)\b",
    r"\bprohibits?\b|\bprivate right of action\b|\bcivil penalt(?:y|ies)\b",
    r"\bpaid (?:sick |family |medical )?leave\b|\bminimum wage\b|\bovertime\b|\bbeneficial ownership\b",
    r"\brequires? (?:employers?|businesses|companies|covered|regulated|reporting)\b",
    r"\bmust comply\b|\bnew (?:duties|obligations|standards)\b",
]
BUSINESS_SUBJECTS = [
    r"\bemployers?\b", r"\bbusinesses\b", r"\bcompan(?:y|ies)\b", r"\bcorporations?\b",
    r"\bLLCs?\b", r"\blicensees?\b", r"\bestablishments?\b", r"\boperators?\b", r"\bowners?\b",
    r"\blandlords?\b", r"\blenders?\b", r"\bmanufacturers?\b", r"\bproviders?\b", r"\bcontractors?\b",
    r"\bemployees?\b", r"\bimporters?\b", r"\bexporters?\b", r"\bproducers?\b", r"\bprocessors?\b",
    # domain terms of art that a naive list misses:
    r"\bregistrants?\b", r"\bfilers?\b", r"\bissuers?\b", r"\bbroker-?dealers?\b",
    r"\binvestment advisers?\b", r"\bplan (?:sponsors?|administrators?)\b",
    r"\bfinancial institutions?\b", r"\bcovered (?:entit(?:y|ies)|institutions?|employers?)\b",
    r"\bregulated entit(?:y|ies)\b", r"\bsmall entit(?:y|ies)\b", r"\bswap dealers?\b",
    r"\bmotor carriers?\b", r"\bfacilit(?:y|ies)\b",
]
_DUTY = [re.compile(p, re.IGNORECASE) for p in DUTY_SIGNALS]
_SUBJ = [re.compile(p, re.IGNORECASE) for p in BUSINESS_SUBJECTS]

# ── State subject tags (OpenStates) → (weight, category, professionals) ───────────────────────
# Order matters — first substring match wins. More-specific / higher-value tags first, and
# "health" is placed BEFORE "insurance" so "Health Care & Health Insurance" routes to
# Healthcare, not Insurance. Keys are matched against the lowercased joined subject string.
STATE_SUBJECT_MAP: list[tuple[str, int, str, list[str]]] = [
    ("labor & employment", 5, "Employment & Labor", ["consultant", "attorney", "tech"]),
    ("labor and employment", 5, "Employment & Labor", ["consultant", "attorney", "tech"]),
    ("employment", 5, "Employment & Labor", ["consultant", "attorney", "tech"]),
    ("minimum wage", 5, "Employment & Labor", ["consultant", "attorney"]),
    ("privacy", 5, "Privacy & Data", ["attorney", "tech", "consultant"]),
    ("data protection", 5, "Privacy & Data", ["attorney", "tech"]),
    ("financial services", 5, "Tax & Finance", ["cpa", "attorney"]),
    ("taxation", 5, "Tax & Finance", ["cpa", "attorney"]),
    ("licens", 4, "Licensing & Professions", ["attorney", "consultant"]),
    ("commerce", 4, "Consumer Protection", ["attorney", "consultant"]),
    ("consumer", 4, "Consumer Protection", ["attorney", "consultant"]),
    ("housing", 4, "Real Estate & Housing", ["attorney", "consultant"]),
    ("state revenue", 3, "Tax & Finance", ["cpa", "attorney"]),
    ("health care", 3, "Healthcare", ["attorney", "consultant"]),
    ("health insurance", 3, "Healthcare", ["attorney", "consultant"]),
    ("health", 3, "Healthcare", ["attorney", "consultant"]),
    ("insurance", 4, "Insurance", ["attorney", "consultant"]),
    ("environment", 3, "Environment & Energy", ["consultant", "attorney"]),
    ("agriculture", 2, "Consumer Protection", ["consultant", "attorney"]),
]


def compute_urgency(effective_date: str, today: dt.date | None = None) -> str:
    m = re.search(r"\d{4}-\d{2}-\d{2}", effective_date or "")
    if not m:
        return "unknown"
    try:
        d = dt.date.fromisoformat(m.group(0))
    except ValueError:
        return "unknown"
    today = today or dt.date.today()
    if (d - today).days <= 90:
        return "high"
    if d.year == today.year:
        return "medium"
    return "low"


def classify_item(item: dict) -> dict | None:
    title = item.get("title", "") or ""
    text = f"{title} {item.get('summary', '')}"
    if TITLE_EXCLUDE.search(title):
        return None
    if ACTION_NOISE.search(item.get("action", "") or ""):
        return None

    score = 0
    reasons: list[str] = []
    category = ""
    professionals: list[str] = []

    if item.get("source_type") == "federal_rule":
        # Primary signal: CFR title(s). Best (most positive) title sets the category.
        best = None
        for t in item.get("cfr_titles", []):
            if t in CFR_MAP:
                w, cat, pros = CFR_MAP[t]
                score += w
                reasons.append(f"cfr{t}:{w:+d}")
                if cat and (best is None or w > best[0]):
                    best = (w, cat, pros)
        if best:
            category, professionals = best[1], best[2]
        # Agency tier.
        slugs = set(item.get("agency_slugs", []))
        if slugs & AGENCY_HIGH:
            score += 3; reasons.append("agency_high:+3")
        if slugs & AGENCY_NOISE:
            score -= 6; reasons.append("agency_noise:-6")
        if item.get("significant"):
            score += 3; reasons.append("significant:+3")
    else:
        # State lane: OpenStates subject tags are the primary signal.
        subs = " ".join(item.get("subjects", [])).lower()
        best = None
        for key, w, cat, pros in STATE_SUBJECT_MAP:
            if key in subs:
                score += w; reasons.append(f"subj[{key}]:{w:+d}")
                if best is None or w > best[0]:
                    best = (w, cat, pros)
                break
        if best:
            category, professionals = best[1], best[2]

    # Secondary keyword evidence (both lanes).
    duty_hits = sorted({p.pattern for p in _DUTY if p.search(text)})
    subj_hits = sorted({p.pattern for p in _SUBJ if p.search(text)})
    if duty_hits:
        score += min(len(duty_hits), 3); reasons.append(f"duty×{len(duty_hits)}")
    if subj_hits:
        score += min(len(subj_hits), 2); reasons.append(f"subject×{len(subj_hits)}")

    if score < THRESHOLD:
        return None

    # Category fallback when metadata didn't set one.
    if not category:
        category = "Consumer Protection"
        professionals = ["attorney", "consultant"]

    return {
        **{k: v for k, v in item.items() if k not in ("agency_slugs",)},
        "urgency": compute_urgency(item.get("effective_date", "")),
        "category_guess": category,
        "professionals_guess": professionals,
        "score": score,
        "score_reasons": reasons,
        "duty_signals": duty_hits,
        "business_subjects": subj_hits,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("raw", help="fetch.py output JSON (path, or - for stdin)")
    ap.add_argument("--out", type=str, default="")
    ap.add_argument("--top", type=int, default=0, help="keep only the top N by score (0 = all)")
    args = ap.parse_args()

    raw = json.load(sys.stdin if args.raw == "-" else open(args.raw))
    items = raw.get("items", [])
    survivors = [c for c in (classify_item(i) for i in items) if c]
    survivors.sort(key=lambda c: -c["score"])
    if args.top:
        survivors = survivors[: args.top]

    payload = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "fetched": len(items),
        "passed_gate": len(survivors),
        "threshold": THRESHOLD,
        "note": (
            "Metadata-driven score gate (CFR title + agency + action + significance for federal, "
            "subject tags for state, plus keyword evidence). HIGH RECALL, NOT verified — the "
            "/compliance-alert-pass-auto skill confirms each survivor against the primary source "
            "before writing a page."
        ),
        "candidates": survivors,
    }
    text = json.dumps(payload, indent=2)
    if args.out:
        path = pathlib.Path(args.out)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
        print(f"[classify] {len(survivors)}/{len(items)} passed gate (threshold {THRESHOLD}) → {path}", file=sys.stderr)
    else:
        print(text)


if __name__ == "__main__":
    main()
