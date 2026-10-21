"""Template the 2026-10-21 tool-usage drafts into src/data/calculators.ts. Net-new only; refuses duplicates."""
import json, sys
RUN = "reports/mindmap-pass/2026-10-21-tool-usage"
DATE = "2026-10-21"
j = lambda v: json.dumps(v, ensure_ascii=False)
TOOLS = [
    ("debt-to-income-ratio-calculator", "Debt-to-Income Ratio", 61, "debt to income ratio calculator", "Debt-to-Income Ratio Calculator",
     {"grossMonthlyIncome": 6500, "housing": 1650, "auto": 450, "studentLoans": 250, "creditCards": 120, "otherDebts": 0},
     [("CFPB: What is a debt-to-income ratio?", "https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/"),
      ("Fannie Mae Selling Guide B3-6-02: Debt-to-Income Ratios", "https://selling-guide.fanniemae.com/sel/b3-6-02/debt-income-ratios")]),
    ("social-security-taxable-benefits-calculator", "Taxable Social Security", 62, "social security taxable benefits calculator", "Social Security Taxable Benefits Calculator",
     {"status": "mfj", "benefits": 42000, "otherIncome": 30000, "taxExemptInterest": 0},
     [("IRS Publication 915: Social Security and Equivalent Railroad Retirement Benefits", "https://www.irs.gov/publications/p915")]),
]
path = "src/data/calculators.ts"
s = open(path).read()
entries = ""
for slug, label, nav, kw, h1, preset, sources in TOOLS:
    d = json.load(open(f"{RUN}/drafts/{slug}.json"))
    if f'id: "{slug}"' in s or f'"id": "{slug}"' in s: sys.exit(f"already present {slug}")
    for k in ("metaTitle", "metaDescription", "introText", "howItWorks", "faqs"):
        if not d.get(k): sys.exit(f"REFUSE {slug}: missing {k}")
    assert len(d["metaTitle"]) <= 60 and len(d["metaDescription"]) <= 160, slug
    faqs = ",\n".join(f"      {{ question: {j(f['question'])}, answer: {j(f['answer'])} }}" for f in d["faqs"])
    srcs = ",\n".join(f"      {{ label: {j(l)}, url: {j(u)} }}" for l, u in sources)
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
    sources: [
{srcs},
    ],
    updated: "{DATE}",
    defaultPreset: {json.dumps(preset)},
  }},
'''
a = s.index('"id": "tax-bracket-calculator"')
i = s.index("\n  },\n", a) + len("\n  },")
s = s[:i + 1] + entries + s[i + 1:]
open(path, "w").write(s); print("calcs ok")
