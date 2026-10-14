"""Template the 2026-10-14 autocomplete drafts into src/data. Net-new only; refuses duplicates."""
import json, sys
RUN = "reports/mindmap-pass/2026-10-14-autocomplete"
DATE = "2026-10-14"
j = lambda v: json.dumps(v, ensure_ascii=False)

TOOLS = [
    ("annuity-calculator", "Annuity", 50, "annuity calculator",
     {"mode": "payout", "lumpSum": 100000, "payment": 1000, "ratePct": 5, "years": 20, "perYear": 12, "atStart": False}),
    ("credit-card-interest-calculator", "Credit Card Interest", 51, "credit card interest calculator",
     {"balance": 5000, "aprPct": 24, "cycleDays": 30, "yearDays": 365, "payment": 0, "paymentDay": 15}),
    ("loan-payment-calculator", "Loan Payment", 52, "loan payment calculator",
     {"amount": 25000, "aprPct": 8, "years": 5, "extraMonthly": 0}),
]

path = "src/data/calculators.ts"
s = open(path).read()
entries = ""
for slug, label, nav, kw, preset in TOOLS:
    d = json.load(open(f"{RUN}/drafts/{slug}.json"))
    if f'id: "{slug}"' in s: sys.exit(f"already present {slug}")
    for k in ("metaTitle", "metaDescription", "introText", "howItWorks", "faqs"):
        if not d.get(k): sys.exit(f"REFUSE {slug}: missing {k}")
    assert len(d["metaTitle"]) <= 60 and len(d["metaDescription"]) <= 160, slug
    faqs = ",\n".join(f"      {{ question: {j(f['question'])}, answer: {j(f['answer'])} }}" for f in d["faqs"])
    h1 = kw.title()
    entries += f'''  // {label} calculator — autocomplete pass ({DATE}). Prose generated via scripts/lib/content_gen.py
  // (meta beside the draft in {RUN}/drafts/).
  {{
    id: "{slug}",
    islandId: "{slug}",
    label: {j(label)},
    navOrder: {nav},
    metaTitle: {j(d["metaTitle"])},
    metaDescription:
      {j(d["metaDescription"])},
    targetKeyword: {j(kw)},
    h1: {j(h1)},
    introText:
      {j(d["introText"])},
    howItWorks:
      {j(d["howItWorks"])},
    faqs: [
{faqs},
    ],
    updated: "{DATE}",
    defaultPreset: {json.dumps(preset)},
  }},
'''
i = s.index("\n];\n", s.index('id: "hurricane-deductible-calculator"'))
s = s[:i + 1] + entries + s[i + 1:]
open(path, "w").write(s); print("calcs ok")
