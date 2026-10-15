import json, sys
RUN="reports/mindmap-pass/2026-10-15-trend-lane-c"; DATE="2026-10-15"
slug="mortgage-broker-vs-lender"
d=json.load(open(f"{RUN}/drafts/{slug}.json"))
C="https://www.consumerfinance.gov/ask-cfpb/"
obj={"updated":DATE,"slug":d["slug"],"title":d["metaTitle"],"metaDescription":d["metaDescription"],
 "targetKeyword":"mortgage broker vs lender","optionA":d["optionAName"],"optionB":d["optionBName"],"segment":"lending","h1":d["h1"],
 "introText":d["introText"],"comparisonTable":d["comparisonTable"],"verdict":d["verdict"],"sections":d["sections"],"faqs":d["faqItems"],
 "sources":[{"label":"CFPB: What is the difference between a mortgage lender and a mortgage broker?","url":C+"what-is-the-difference-between-a-mortgage-lender-and-a-mortgage-broker-en-130/"},
  {"label":"CFPB: How does a mortgage loan officer or broker get paid?","url":C+"how-does-a-mortgage-loan-officer-or-broker-get-paid-en-132/"}],
 "relatedComparisons":[],
 "calculatorLinks":[{"label":"Closing cost calculator","href":"/mortgage/closing-cost-calculator/"}]}
for k in ["title","metaDescription","h1","introText","verdict","sections","faqs","comparisonTable"]: assert obj[k],k
block="\n".join("  "+l for l in json.dumps(obj,indent=2,ensure_ascii=False).splitlines())
entry=f"  // ── mindmap-pass {DATE} (trend-lane-c, mortgage broker vs lender): {slug} ──\n{block},\n"
path="src/data/comparisons.ts"; anchor="export const COMPARISONS: ComparisonEntry[] = [\n"
s=open(path).read(); assert f'slug: "{slug}"' not in s and f'"slug": "{slug}"' not in s and s.count(anchor)==1
open(path,"w").write(s.replace(anchor,anchor+entry,1)); print("templated")
