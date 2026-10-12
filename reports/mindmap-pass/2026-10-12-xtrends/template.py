"""Template the 2026-10-12 x-trends drafts into src/data. Net-new only; refuses duplicates."""
import json, sys, re
RUN = "reports/mindmap-pass/2026-10-12-xtrends"
DATE = "2026-10-12"
GUIDE_KEYS = ["slug", "title", "metaDescription", "h1", "cardBlurb", "introText", "sections", "tools", "faqs", "sources"]

def guide(slug):
    d = json.load(open(f"{RUN}/drafts/{slug}.json"))
    missing = [k for k in GUIDE_KEYS if not d.get(k)]
    if missing: sys.exit(f"REFUSE {slug}: {missing}")
    obj = {"updated": DATE}; obj.update({k: d[k] for k in GUIDE_KEYS})
    body = "\n".join("  " + l for l in json.dumps(obj, indent=2, ensure_ascii=False).splitlines())
    path = "src/data/guides.ts"; s = open(path).read()
    if f'"slug": "{slug}"' in s: sys.exit("already present")
    a = "export const GUIDES: Guide[] = [\n"; assert s.count(a) == 1
    s = s.replace(a, a + f"  // -- x-trends-mindmap-auto {DATE}: {slug} --\n{body},\n", 1)
    open(path, "w").write(s); print("guide ok", slug)

def calc(slug):
    d = json.load(open(f"{RUN}/drafts/{slug}.json"))
    path = "src/data/calculators.ts"; s = open(path).read()
    if f'id: "{slug}"' in s: sys.exit("already present")
    j = lambda v: json.dumps(v, ensure_ascii=False)
    faqs = ",\n".join(f"      {{ question: {j(f['question'])}, answer: {j(f['answer'])} }}" for f in d["faqs"])
    src = [("Florida CFO: Florida's Hurricane Deductible", "https://myfloridacfo.com/division/consumers/consumerprotections/floridashurricanedeductible"),
           ("Florida Statutes section 627.701: Liability of insureds; coinsurance; deductibles", "https://www.flsenate.gov/Laws/Statutes/2025/627.701"),
           ("Florida Statutes section 627.70132: Notice of property insurance claim", "https://www.flsenate.gov/Laws/Statutes/2025/627.70132")]
    srcs = ",\n".join(f"      {{ label: {j(a)}, url: {j(b)} }}" for a, b in src)
    entry = f'''  // Hurricane Deductible calculator — x-trends pass ({DATE}). Prose generated via scripts/lib/content_gen.py
  // (meta beside the draft in {RUN}/drafts/).
  {{
    id: "{slug}",
    islandId: "{slug}",
    label: "Hurricane Deductible",
    navOrder: 49,
    metaTitle: {j(d["metaTitle"])},
    metaDescription:
      {j(d["metaDescription"])},
    targetKeyword: "hurricane deductible calculator",
    h1: "Hurricane Deductible Calculator",
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
    defaultPreset: {{"dwellingLimit": 300000, "kind": "percent", "deductibleValue": 5, "damage": 40000, "alreadyUsed": 0, "otherPerilsDeductible": 1000}},
  }},
'''
    anchor = "\n];\n"
    i = s.index("\n];\n", s.index('id: "portfolio-rebalancing-calculator"'))
    s = s[:i + 1] + entry + s[i + 1:]
    open(path, "w").write(s); print("calc ok", slug)

guide("2027-social-security-cola"); calc("hurricane-deductible-calculator")
