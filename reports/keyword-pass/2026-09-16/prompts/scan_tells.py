import re

files = ["src/data/guides.ts", "src/data/spokes-freelance-rate.ts", "src/data/se-hubs.ts", "src/data/calculators.ts"]
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
}
for f in files:
    text = open(f).read()
    for name, pat in patterns.items():
        for m in re.finditer(pat, text, re.I):
            start = max(0, m.start() - 40)
            print(f, name, repr(text[start:m.end() + 10]))
