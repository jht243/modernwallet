import json, sys
RUN="reports/mindmap-pass/2026-10-16-trend-lane-c"; DATE="2026-10-16"
slug="401k-vs-529"
d=json.load(open(f"{RUN}/drafts/{slug}.json"))
C="https://www.consumerfinance.gov/ask-cfpb/"
obj={"updated":DATE,"slug":d["slug"],"title":d["metaTitle"],"metaDescription":d["metaDescription"],
 "targetKeyword":"401k vs 529","optionA":d["optionAName"],"optionB":d["optionBName"],"segment":"retirement","h1":d["h1"],
 "introText":d["introText"],"comparisonTable":d["comparisonTable"],"verdict":d["verdict"],"sections":d["sections"],"faqs":d["faqItems"],
 "sources":[{"label":"IRS Topic no. 313, Qualified tuition programs (QTPs)","url":"https://www.irs.gov/taxtopics/tc313"},
  {"label":"IRS Topic no. 558, Additional tax on early distributions from retirement plans other than IRAs","url":"https://www.irs.gov/taxtopics/tc558"},
  {"label":"IRS: 401(k) limit increases to $24,500 for 2026","url":"https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500"},
  {"label":"IRS Topic no. 424, 401(k) plans","url":"https://www.irs.gov/taxtopics/tc424"},
  {"label":"SEC Investor.gov: 529 plans","url":"https://www.investor.gov/introduction-investing/investing-basics/glossary/529-plans"}],
 "relatedComparisons":["529-vs-roth-ira","529-vs-brokerage-account","roth-401k-vs-traditional-401k"],
 "calculatorLinks":[{"label":"529 savings calculator","href":"/529-savings-calculator/"}]}
for k in ["title","metaDescription","h1","introText","verdict","sections","faqs","comparisonTable"]: assert obj[k],k
block="\n".join("  "+l for l in json.dumps(obj,indent=2,ensure_ascii=False).splitlines())
entry=f"  // ── mindmap-pass {DATE} (trend-lane-c, 401k vs 529): {slug} ──\n{block},\n"
path="src/data/comparisons.ts"; anchor="export const COMPARISONS: ComparisonEntry[] = [\n"
s=open(path).read(); assert f'slug: "{slug}"' not in s and f'"slug": "{slug}"' not in s and s.count(anchor)==1
open(path,"w").write(s.replace(anchor,anchor+entry,1)); print("templated")
