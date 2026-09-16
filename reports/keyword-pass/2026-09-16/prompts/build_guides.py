import json

def load(p):
    return json.load(open(p))

uk = load("reports/keyword-pass/2026-09-16/drafts/freelance-rate-calculator-uk-ir35-explained.json")
ramsey = load("reports/keyword-pass/2026-09-16/drafts/dave-ramsey-12-percent-investment-return-explained.json")

def build_guide(d, tools, updated="2026-09-16"):
    obj = {
        "slug": d["slug"],
        "updated": updated,
        "title": d["title"],
        "metaDescription": d["metaDescription"],
        "h1": d["h1"],
        "cardBlurb": d["cardBlurb"],
        "introText": d["introText"],
        "sections": [{"heading": s["heading"], "body": s["body"]} for s in d["sections"]],
        "tools": tools,
        "faqs": [{"question": f["question"], "answer": f["answer"]} for f in d["faqItems"]],
        "sources": d["sources"],
    }
    return obj

uk_tools = [
    {"href": "/freelance-rate/", "label": "Freelance rate"},
    {"href": "/freelance-rate/billable-hours-calculator/", "label": "Billable hours"},
]
ramsey_tools = [
    {"href": "/investing/", "label": "Investment calculator"},
    {"href": "/investing/sp500-calculator/", "label": "S&P 500 calculator"},
]

uk_obj = build_guide(uk, uk_tools)
ramsey_obj = build_guide(ramsey, ramsey_tools)

def to_ts(obj):
    return json.dumps(obj, indent=2, ensure_ascii=False)

open("reports/keyword-pass/2026-09-16/drafts/uk_guide.ts.json", "w").write(to_ts(uk_obj))
open("reports/keyword-pass/2026-09-16/drafts/ramsey_guide.ts.json", "w").write(to_ts(ramsey_obj))
print("done")
