"""Template audited 2027-COLA drafts into src/data (net-new only). Re-runnable: replaces this run's own entries."""
import json, re, sys
RUN="reports/mindmap-pass/2026-10-14-cola"; DATE="2026-10-14"
PR="https://www.ssa.gov/news/en/press/releases/2026-10-14.html"; FS="https://www.ssa.gov/news/en/cola/factsheets/2027.html"
SRC_SSA=[{"label":"SSA: Social Security Announces 3.6 Percent Benefit Increase for 2027","url":PR},{"label":"SSA: 2027 Cost-of-Living Adjustment (COLA) Fact Sheet","url":FS}]
GUIDES={
 "2027-ssdi-cola":dict(tools=[("/social-security-cola-calculator/","Social Security COLA calculator"),("/retirement/social-security-retirement-calculator/","Social Security retirement calculator"),("/social-security-break-even-calculator/","Social Security break-even calculator")],src=SRC_SSA+[{"label":"SSA: Cost-of-Living Adjustment (COLA) Information","url":"https://www.ssa.gov/cola/"}]),
 "ssi-increase-2027":dict(tools=[("/social-security-cola-calculator/","Social Security COLA calculator"),("/retirement/social-security-retirement-calculator/","Social Security retirement calculator")],src=SRC_SSA+[{"label":"SSA: SSI Income","url":"https://www.ssa.gov/ssi/text-income-ussi.htm"}]),
 "social-security-changes-2027":dict(tools=[("/social-security-cola-calculator/","Social Security COLA calculator"),("/social-security-break-even-calculator/","Social Security break-even calculator"),("/retirement/social-security-retirement-calculator/","Social Security retirement calculator")],src=SRC_SSA),
 "2027-cola-federal-military-retirees":dict(tools=[("/retirement/military-retirement-calculator/","Military retirement calculator"),("/retirement/pension-calculator/","Pension calculator"),("/social-security-cola-calculator/","Social Security COLA calculator")],src=SRC_SSA+[
   {"label":"5 U.S.C. 8340: CSRS cost-of-living adjustment of annuities","url":"https://www.law.cornell.edu/uscode/text/5/8340"},
   {"label":"5 U.S.C. 8462: FERS cost-of-living adjustments","url":"https://www.law.cornell.edu/uscode/text/5/8462"},
   {"label":"10 U.S.C. 1401a: Military retired pay adjustments","url":"https://www.law.cornell.edu/uscode/text/10/1401a"},
   {"label":"Congress.gov: S.4487, Veterans' Compensation Cost-of-Living Adjustment Act of 2026","url":"https://www.congress.gov/bill/119th-congress/senate-bill/4487"},
   {"label":"FEDweek: January retirement COLAs set, 3.6 percent for CSRS, 2.6 percent for FERS","url":"https://www.fedweek.com/fedweek/january-retirement-colas-set-3-6-percent-for-csrs-2-6-percent-for-fers/"},
   {"label":"Military Times: The 2027 cost-of-living increase for retirees, veterans","url":"https://www.militarytimes.com/pay-benefits/mil-money/2026/10/14/heres-the-2027-cost-of-living-increase-for-retirees-veterans/"}]),
}
MARK="// -- mindmap-pass 2026-10-14 (2027 COLA): "
def indent(txt,n): return "\n".join(" "*n+l for l in txt.splitlines())
def guides():
    p="src/data/guides.ts"; s=open(p).read()
    s=re.sub(r"  "+re.escape(MARK)+r"[^\n]*\n  \{\n.*?\n  \},\n(?=  //|  \{)","",s,flags=re.S)  # idempotent remove
    anchor="export const GUIDES: Guide[] = [\n"; assert s.count(anchor)==1
    block=""
    for slug,cfg in GUIDES.items():
        d=json.load(open(f"{RUN}/drafts/{slug}.json"))
        assert d["slug"]==slug
        obj={"updated":DATE,"slug":slug,"title":d["metaTitle"],"metaDescription":d["metaDescription"],"h1":d["h1"],"cardBlurb":d["cardBlurb"],
             "introText":d["introText"],"sections":d["sections"],"tools":[{"href":h,"label":l} for h,l in cfg["tools"]],"faqs":d["faqs"],"sources":cfg["src"]}
        for k in ["title","metaDescription","h1","cardBlurb","introText","sections","faqs"]: assert obj[k],(slug,k)
        assert s.count(f'"slug": "{slug}"')==0 and s.count(f'slug: "{slug}"')==0, f"exists {slug}"
        block+=f"  {MARK}{slug} --\n"+indent(json.dumps(obj,indent=2,ensure_ascii=False),2)+",\n"
    open(p,"w").write(s.replace(anchor,anchor+block,1))
def calc():
    p="src/data/calculators.ts"; s=open(p).read()
    s=re.sub(r"  // Social Security COLA calculator — mindmap-pass 2026-10-14.*?\n  \},\n(?=\];)","",s,flags=re.S)
    d=json.load(open(f"{RUN}/drafts/social-security-cola-calculator.json"))
    obj={"id":"social-security-cola-calculator","islandId":"social-security-cola-calculator","label":"Social Security COLA","navOrder":56,
         "metaTitle":d["metaTitle"],"metaDescription":d["metaDescription"],"targetKeyword":"social security cola calculator","h1":"Social Security COLA Calculator for 2027",
         "introText":d["introText"],"howItWorks":d["howItWorks"],"faqs":d["faqs"],
         "sources":SRC_SSA+[{"label":"SSA POMS RS 00601.020: Rounding of benefits","url":"https://secure.ssa.gov/poms.nsf/lnx/0300601020"}],
         "updated":DATE,"defaultPreset":{"currentBenefit":2000,"partBPremium":0}}
    assert 'id: "social-security-cola-calculator"' not in s and '"id": "social-security-cola-calculator"' not in s
    entry="  // Social Security COLA calculator — mindmap-pass 2026-10-14 (2027 COLA brief). Prose generated via scripts/lib/content_gen.py\n  // (meta beside the draft in reports/mindmap-pass/2026-10-14-cola/drafts/).\n"+indent(json.dumps(obj,indent=2,ensure_ascii=False),2)+",\n"
    end="];\n\nexport const CALC_BY_ID"; assert s.count(end)==1
    open(p,"w").write(s.replace(end,entry+end,1))
guides(); calc(); print("templated")
