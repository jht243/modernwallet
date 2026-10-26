import json,re
DATE="2026-10-26"; slug="pmi-cancellation-housing-order"; R="reports/mindmap-pass/2026-10-26-xtrends"
d=json.load(open(f"{R}/drafts/{slug}.json"))
tk=open(f"{R}/drafts/{slug}--takeaway.md").read().strip()
head,body=tk.split("\n",1); assert head.strip()=="## Our Takeaway"
body=body.strip()
body=body.replace("for future Fannie Mae and Freddie Mac mortgages","for Fannie Mae and Freddie Mac mortgages made after the pilot is established")
body=body.replace("shows that earlier cancellation depends entirely on property appreciation and the rules the agency sets","shows that earlier cancellation would depend on how much the home has appreciated and on the rules the agency sets")
secs=[{"heading":s["heading"],"body":s["body"].strip()} for s in d["sections"]]
secs.append({"heading":"Our Takeaway","body":body})
for s in secs:
    s["body"]=s["body"].replace("Section 4(c) mandates that lenders pass these savings through to borrowers","Section 4(c) says the Director must require that savings be passed through to borrowers, and that lenders inform borrowers of them")
    s["body"]=s["body"].replace("Section 4(c) explicitly requires lenders to pass these cost reductions directly to borrowers","Section 4(c) says the Director must require that savings be passed through to borrowers, and that lenders inform borrowers of them")
faqs=d["faqs"]
for f in faqs:
    f["answer"]=f["answer"].replace("Under federal law, servicers must automatically terminate","Servicers generally must automatically terminate")
o={"updated":DATE,"slug":slug,"title":d["metaTitle"],"metaDescription":d["metaDescription"],"h1":d["h1"],"cardBlurb":d["cardBlurb"],"introText":d["introText"],"sections":secs,
 "tools":[{"href":"/mortgage/amortization-schedule/","label":"Mortgage amortization schedule"},{"href":"/mortgage/extra-payment-calculator/","label":"Extra payment calculator"},{"href":"/mortgage/refinance-calculator/","label":"Mortgage refinance calculator"}],
 "faqs":faqs,"sources":[{"label":"White House: Decreasing Housing Costs for the American People (Oct 22, 2026)","url":"https://www.whitehouse.gov/presidential-actions/2026/10/decreasing-housing-costs-for-the-american-people/"},{"label":"CFPB: When can I remove private mortgage insurance (PMI) from my loan?","url":"https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/"},{"label":"CFPB: What is private mortgage insurance (PMI)?","url":"https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/"}]}
for sec in secs: sec["body"]=sec["body"].replace("\n\n ","\n\n")
assert len(o["title"])<=60 and len(o["metaDescription"])<=160,(len(o["title"]),len(o["metaDescription"]))
path="src/data/guides.ts"; anchor="export const GUIDES: Guide[] = [\n"
s=open(path).read(); assert s.count(anchor)==1 and f'"slug": "{slug}"' not in s
add=f"  // ── mindmap-pass {DATE} (x-trends): {slug} ──\n"+"\n".join("  "+l for l in json.dumps(o,indent=2,ensure_ascii=False).splitlines())+",\n"
open(path,"w").write(s.replace(anchor,anchor+add,1)); print("templated")
