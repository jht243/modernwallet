import json
DATE="2026-10-28"; R="reports/mindmap-pass/2026-10-28-competitor"
PAGES={
"average-retirement-savings-by-age":dict(tools=[("/retirement/retirement-savings-calculator/","Retirement savings calculator"),("/retirement/401k-calculator/","401(k) calculator")],
 sources=[("Federal Reserve: Changes in U.S. Family Finances from 2022 to 2025 (SCF)","https://www.federalreserve.gov/publications/files/scf26.pdf"),("Federal Reserve: Survey of Consumer Finances","https://www.federalreserve.gov/econres/scfindex.htm")]),
"student-loan-deferment":dict(tools=[("/student-loan-wage-garnishment-calculator/","Student loan wage garnishment calculator")],
 sources=[("eCFR: 34 CFR 685.204, Deferment","https://www.ecfr.gov/current/title-34/part-685/section-685.204"),("eCFR: 34 CFR 685.205, Forbearance","https://www.ecfr.gov/current/title-34/part-685/section-685.205")]),
}
path="src/data/guides.ts"; anchor="export const GUIDES: Guide[] = [\n"
s=open(path).read(); assert s.count(anchor)==1
for slug,x in PAGES.items():
    d=json.load(open(f"{R}/drafts/{slug}.json")); assert f'"slug": "{slug}"' not in s
    o={"updated":DATE,"slug":slug,"title":d["metaTitle"],"metaDescription":d["metaDescription"],"h1":d["h1"],"cardBlurb":d["cardBlurb"],"introText":d["introText"],
       "sections":[{"heading":a["heading"],"body":a["body"].strip()} for a in d["sections"]],
       "tools":[{"href":h,"label":l} for h,l in x["tools"]],"faqs":d["faqs"],"sources":[{"label":l,"url":u} for l,u in x["sources"]]}
    assert len(o["title"])<=60 and len(o["metaDescription"])<=160,(slug,len(o["title"]),len(o["metaDescription"]))
    add=f"  // ── mindmap-pass {DATE} (competitor): {slug} ──\n"+"\n".join("  "+l for l in json.dumps(o,indent=2,ensure_ascii=False).splitlines())+",\n"
    s=s.replace(anchor,anchor+add,1)
open(path,"w").write(s); print("templated")
