import json
DATE="2026-10-20"; slug="how-to-make-a-budget"
d=json.load(open(f"reports/mindmap-pass/2026-10-20-podcast/drafts/{slug}.edited.json"))
o={"updated":DATE,"slug":slug,"title":d["metaTitle"],"metaDescription":d["metaDescription"],"h1":d["h1"],"cardBlurb":d["cardBlurb"],"introText":d["introText"],"sections":d["sections"],
 "tools":[{"href":"/budget/monthly-budget-calculator/","label":"Monthly Budget Calculator"},{"href":"/budget/50-30-20-budget-calculator/","label":"50/30/20 Budget Calculator"},{"href":"/budget/zero-based-budget-calculator/","label":"Zero-Based Budget Calculator"}],
 "faqs":d["faqs"],"sources":[{"label":"CFPB: Budgeting: How to create a budget and stick with it","url":"https://www.consumerfinance.gov/about-us/blog/budgeting-how-to-create-a-budget-and-stick-with-it/"}]}
assert len(o["title"])<=60 and len(o["metaDescription"])<=160
path="src/data/guides.ts"; anchor="export const GUIDES: Guide[] = [\n"
s=open(path).read(); assert s.count(anchor)==1 and f'"slug": "{slug}"' not in s
add=f"  // ── mindmap-pass {DATE} (podcast-pain-pass): {slug} ──\n"+"\n".join("  "+l for l in json.dumps(o,indent=2,ensure_ascii=False).splitlines())+",\n"
open(path,"w").write(s.replace(anchor,anchor+add,1)); print("templated")
