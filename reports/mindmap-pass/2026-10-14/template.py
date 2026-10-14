"""Template an audited comparison draft into src/data/comparisons.ts (net-new only)."""
import json, sys
RUN="reports/mindmap-pass/2026-10-14"; DATE="2026-10-14"
slug=sys.argv[1]
d=json.load(open(f"{RUN}/drafts/{slug}.json"))
obj={
 "updated":DATE,"slug":d["slug"],"title":d["metaTitle"],"metaDescription":d["metaDescription"],
 "targetKeyword":"money market account vs money market fund",
 "optionA":d["optionAName"],"optionB":d["optionBName"],"segment":"banking","h1":d["h1"],
 "introText":d["introText"],"comparisonTable":d["comparisonTable"],"verdict":d["verdict"],
 "sections":d["sections"],"faqs":d["faqItems"],
 "sources":[
  {"label":"FDIC: Understanding Deposit Insurance","url":"https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance/"},
  {"label":"FDIC: Financial Products Insured and Not Insured","url":"https://www.fdic.gov/resources/deposit-insurance/financial-products-insured"},
  {"label":"SEC Investor.gov: Money Market Funds","url":"https://www.investor.gov/introduction-investing/investing-basics/glossary/money-market-funds"},
  {"label":"SEC Investor.gov: Mutual Funds","url":"https://www.investor.gov/introduction-investing/investing-basics/glossary/mutual-funds"}],
 "relatedComparisons":["hysa-vs-money-market","cd-vs-money-market"],
 "calculatorLinks":[{"label":"Emergency fund calculator","href":"/emergency-fund-calculator/"},{"label":"High-yield savings calculator","href":"/investing/high-yield-savings-calculator/"}],
}
for k in ["title","metaDescription","h1","introText","verdict","sections","faqs","comparisonTable"]:
    assert obj[k], k
body=json.dumps(obj,indent=2,ensure_ascii=False)
block="\n".join("  "+l for l in body.splitlines())
entry=f"  // ── mindmap-pass {DATE} (trend-lane-c, money market account vs fund): {slug} ──\n{block},\n"
path="src/data/comparisons.ts"; anchor="export const COMPARISONS: ComparisonEntry[] = [\n"
s=open(path).read()
assert f'"slug": "{slug}"' not in s and f'slug: "{slug}"' not in s, "exists"
assert s.count(anchor)==1
open(path,"w").write(s.replace(anchor,anchor+entry,1)); print("templated")
