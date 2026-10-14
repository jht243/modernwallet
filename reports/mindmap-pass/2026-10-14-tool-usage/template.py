"""Template the 2026-10-14 tool-usage drafts into src/data/calculators.ts. Net-new only; refuses duplicates."""
import json, sys
RUN = "reports/mindmap-pass/2026-10-14-tool-usage"
DATE = "2026-10-14"
j = lambda v: json.dumps(v, ensure_ascii=False)

TOOLS = [
    ("hysa-vs-cd-calculator", "HYSA vs CD", 53, "hysa vs cd calculator", "HYSA vs CD Calculator",
     {"deposit": 25000, "termMonths": 12, "hysaApyPct": 4, "cdApyPct": 4.25, "hysaLaterApyPct": 0, "changeAfterMonths": 6, "penaltyMonths": 3, "withdrawMonth": 0}),
    ("trump-account-vs-529-calculator", "Trump Account vs 529", 54, "trump account vs 529 calculator", "Trump Account vs 529 Calculator",
     {"childAge": 0, "yearlyContribution": 2400, "returnPct": 7, "seedEligible": True, "taxRatePct": 12, "forCollege": True}),
    ("mortgage-recast-calculator", "Mortgage Recast", 55, "mortgage recast calculator", "Mortgage Recast Calculator",
     {"balance": 238000, "ratePct": 6.875, "monthsLeft": 312, "lumpSum": 30000, "fee": 250}),
]

path = "src/data/calculators.ts"
s = open(path).read()
entries = ""
for slug, label, nav, kw, h1, preset in TOOLS:
    d = json.load(open(f"{RUN}/drafts/{slug}.json"))
    if f'id: "{slug}"' in s: sys.exit(f"already present {slug}")
    for k in ("metaTitle", "metaDescription", "introText", "howItWorks", "faqs"):
        if not d.get(k): sys.exit(f"REFUSE {slug}: missing {k}")
    assert len(d["metaTitle"]) <= 60 and len(d["metaDescription"]) <= 160, slug
    faqs = ",\n".join(f"      {{ question: {j(f['question'])}, answer: {j(f['answer'])} }}" for f in d["faqs"])
    entries += f'''  // {label} calculator — tool-usage pass ({DATE}). Prose generated via scripts/lib/content_gen.py
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
i = s.index("\n  },\n", s.index('id: "loan-payment-calculator"')) + len("\n  },")
s = s[:i + 1] + entries + s[i + 1:]
open(path, "w").write(s); print("calcs ok")
