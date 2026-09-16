import re

def extract(path, start_marker, end_marker):
    text = open(path).read()
    i = text.find(start_marker)
    if i == -1:
        raise SystemExit(f"start marker not found in {path}: {start_marker!r}")
    j = text.find(end_marker, i)
    if j == -1:
        raise SystemExit(f"end marker not found in {path}: {end_marker!r}")
    return text[i:j]

chunks = {
    "guides_new": extract("src/data/guides.ts",
        '// ── keyword-pass 2026-09-16 (freelance-rate + investment cluster) ──',
        '\n  ...SELF_EMPLOYED_GUIDES,'),
    "spoke_new": extract("src/data/spokes-freelance-rate.ts",
        '// ── keyword-pass 2026-09-16 (freelance design/writing/art rate cluster) ──',
        '\n];'),
    "sehubs_new": extract("src/data/se-hubs.ts",
        "Does this calculator work if I don't live in the United States?",
        'sources: [IRS_SE_TAX, IRS_SE_TAX_PAGE, IRS_ES]'),
    "calculators_new": extract("src/data/calculators.ts",
        "Do the 401(k), IRA, and TSP references",
        '\n    ],'),
}

patterns = {
    "em-dash": r"—",
    "honest": r"\bhonest",
    "delve": r"\bdelve\b",
    "leverage_verb": r"\bleverage\b",
    "unlock": r"\bunlock\b",
    "inflated": r"\b(crucial|vital|essential|pivotal|paramount|robust|holistic|myriad|plethora|testament|game.changer|cutting-edge|revolutionary|breakthrough|utilize|facilitate|empower|streamline)\b",
    "worth_noting": r"it's worth noting",
    "navigate_complexities": r"navigate the complexities",
    "in_todays": r"in today's",
    "coy": r"\b(the vendor|the platform|this provider)\b",
    "presup": r"\b(still|no longer|these days)\b",
    "honest2": r"honest",
}

for name, text in chunks.items():
    print(f"--- {name}: {len(text.split())} words ---")
    hit = False
    for pname, pat in patterns.items():
        for m in re.finditer(pat, text, re.I):
            hit = True
            start = max(0, m.start() - 40)
            print(" ", pname, repr(text[start:m.end() + 10]))
    if not hit:
        print("  (clean)")
