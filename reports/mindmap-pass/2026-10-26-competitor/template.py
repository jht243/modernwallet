import json
DATE="2026-10-26"; R="reports/mindmap-pass/2026-10-26-competitor"
PAGES={
"how-credit-card-companies-make-money":dict(tools=[("/credit-card-payoff/","Credit card payoff"),("/credit-card-interest-calculator/","Credit card interest")],
 sources=[("CFPB: The Consumer Credit Card Market (2025 report)","https://files.consumerfinance.gov/f/documents/cfpb_consumer-credit-card-market-report_2025.pdf"),("CFPB: The Consumer Credit Card Market (2023 report)","https://files.consumerfinance.gov/f/documents/cfpb_consumer-credit-card-market-report_2023.pdf"),("Federal Reserve: G.19 Consumer Credit","https://www.federalreserve.gov/releases/g19/current/")]),
"build-wealth-during-high-inflation":dict(tools=[("/inflation-calculator/","Inflation calculator"),("/investing/high-yield-savings-calculator/","High-yield savings calculator")],
 sources=[("BLS: Consumer Price Index news release","https://www.bls.gov/news.release/cpi.nr0.htm"),("TreasuryDirect: I bond interest rates","https://www.treasurydirect.gov/savings-bonds/i-bonds/i-bonds-interest-rates/"),("TreasuryDirect: I bonds","https://www.treasurydirect.gov/savings-bonds/i-bonds/"),("TreasuryDirect: TIPS","https://www.treasurydirect.gov/marketable-securities/tips/"),("FDIC: National rates and rate caps","https://www.fdic.gov/national-rates-and-rate-caps"),("Federal Reserve: FOMC statement, September 16, 2026","https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm"),("IRS: 2026 401(k) and IRA limits","https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500")]),
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
