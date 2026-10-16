import json
R="reports/mindmap-pass/2026-10-16-competitor/drafts/"; DATE="2026-10-16"
meta={
"401k-loan-rules":dict(tools=[{"href":"/401k-early-withdrawal-calculator/","label":"401(k) early withdrawal calculator"}],sources=[
 {"label":"26 U.S.C. § 72, Cornell LII","url":"https://www.law.cornell.edu/uscode/text/26/72"},
 {"label":"26 U.S.C. § 402, Cornell LII","url":"https://www.law.cornell.edu/uscode/text/26/402"},
 {"label":"IRS Topic no. 558, Additional tax on early distributions from retirement plans other than IRAs","url":"https://www.irs.gov/taxtopics/tc558"}]),
"is-student-loan-forgiveness-taxable":dict(tools=[],sources=[
 {"label":"IRS Topic no. 431, Canceled debt","url":"https://www.irs.gov/taxtopics/tc431"},
 {"label":"26 U.S.C. § 108, Cornell LII","url":"https://www.law.cornell.edu/uscode/text/26/108"},
 {"label":"26 U.S.C. § 61, Cornell LII","url":"https://www.law.cornell.edu/uscode/text/26/61"}])}
path="src/data/guides.ts"; anchor="export const GUIDES: Guide[] = [\n"
s=open(path).read(); assert s.count(anchor)==1
add=""
for slug,m in meta.items():
    d=json.load(open(R+slug+".fixed.json"))
    assert f'slug: "{slug}"' not in s
    o={"updated":DATE,"slug":slug,"title":d["metaTitle"],"metaDescription":d["metaDescription"],"h1":d["h1"],"cardBlurb":d["cardBlurb"],"introText":d["introText"],"sections":d["sections"],"tools":m["tools"],"faqs":d["faqs"],"sources":m["sources"]}
    assert len(o["title"])<=60 and len(o["metaDescription"])<=160,(slug,len(o["title"]),len(o["metaDescription"]))
    add+=f"  // ── mindmap-pass {DATE} (competitor-monitor): {slug} ──\n"+"\n".join("  "+l for l in json.dumps(o,indent=2,ensure_ascii=False).splitlines())+",\n"
open(path,"w").write(s.replace(anchor,anchor+add,1)); print("templated")
