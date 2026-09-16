import json

def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)

TOOLS = {
    "state-mileage-reimbursement-law-california-texas-michigan": [
        {"href": "/mileage-deduction/", "label": "Mileage deduction"},
        {"href": "/self-employment-tax/", "label": "Self-employment tax"},
    ],
    "mileage-reimbursement-rates-uk-canada-ireland-nz": [
        {"href": "/mileage-deduction/", "label": "Mileage deduction"},
    ],
    "lemon-law-mileage-offset-calculator-explained": [
        {"href": "/mileage-deduction/", "label": "Mileage deduction"},
        {"href": "/auto-loan/", "label": "Auto loan"},
    ],
}

SOURCES = {
    "state-mileage-reimbursement-law-california-texas-michigan": [
        {"label": "IRS — Standard mileage rates", "url": "https://www.irs.gov/tax-professionals/standard-mileage-rates"},
        {"label": "California Legislative Information — Labor Code Section 2802", "url": "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=2802."},
        {"label": "U.S. Department of Labor — Field Assistance Bulletin No. 2009-2", "url": "https://www.dol.gov/agencies/whd/field-assistance-bulletins/2009-2"},
        {"label": "U.S. Department of Labor — WHD Opinion Letter FLSA2020-12", "url": "https://www.dol.gov/sites/dolgov/files/WHD/opinion-letters/FLSA/2020_08_31_12_FLSA.pdf"},
        {"label": "Michigan Department of Labor and Economic Opportunity — 2026 minimum wage increase", "url": "https://www.michigan.gov/leo/news/2025/12/08/michigans-minimum-wage-set-to-increase-on-jan-1-2026"},
    ],
    "mileage-reimbursement-rates-uk-canada-ireland-nz": [
        {"label": "GOV.UK — Travel mileage and fuel rates and allowances", "url": "https://www.gov.uk/government/publications/rates-and-allowances-travel-mileage-and-fuel-allowances/travel-mileage-and-fuel-rates-and-allowances"},
        {"label": "GOV.UK — Tax relief for employees: vehicles you use for work", "url": "https://www.gov.uk/tax-relief-for-employees/vehicles-you-use-for-work"},
        {"label": "Department of Finance Canada — 2026 automobile deduction limits and expense benefit rates", "url": "https://www.canada.ca/en/department-finance/news/2026/01/government-announces-the-2026-automobile-deduction-limits-and-expense-benefit-rates-for-businesses.html"},
        {"label": "Revenue.ie — Civil Service rates", "url": "https://www.revenue.ie/en/employing-people/employee-expenses/travel-and-subsistence/civil-service-rates.aspx"},
        {"label": "Inland Revenue NZ — Operational Statement OS 19.04, kilometre rates 2025-26", "url": "https://www.taxtechnical.ird.govt.nz/operational-statements/2026/os-19-04-km-2026"},
        {"label": "IRS — Standard mileage rates", "url": "https://www.irs.gov/tax-professionals/standard-mileage-rates"},
    ],
    "lemon-law-mileage-offset-calculator-explained": [
        {"label": "California Legislative Information — Civil Code Section 1793.2", "url": "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1793.2."},
    ],
}

FILES = [
    "reports/keyword-pass/2026-09-16/drafts/state-mileage-reimbursement-law-california-texas-michigan.json",
    "reports/keyword-pass/2026-09-16/drafts/mileage-reimbursement-rates-uk-canada-ireland-nz.json",
    "reports/keyword-pass/2026-09-16/drafts/lemon-law-mileage-offset-calculator-explained.json",
]

out = []
for f in FILES:
    d = json.load(open(f))
    slug = d["slug"]
    lines = []
    lines.append("  {")
    lines.append(f"    slug: {js_str(slug)},")
    lines.append('    updated: "2026-09-16",')
    lines.append(f"    title: {js_str(d['title'])},")
    lines.append(f"    metaDescription: {js_str(d['metaDescription'])},")
    lines.append(f"    h1: {js_str(d['h1'])},")
    lines.append(f"    cardBlurb: {js_str(d['cardBlurb'])},")
    lines.append(f"    introText: {js_str(d['introText'])},")
    lines.append("    sections: [")
    for s in d["sections"]:
        lines.append(f"      {{ heading: {js_str(s['heading'])}, body: {js_str(s['body'])} }},")
    lines.append("    ],")
    lines.append("    tools: [")
    for t in TOOLS[slug]:
        lines.append(f"      {{ href: {js_str(t['href'])}, label: {js_str(t['label'])} }},")
    lines.append("    ],")
    lines.append("    faqs: [")
    for q in d["faqs"]:
        lines.append(f"      {{ question: {js_str(q['question'])}, answer: {js_str(q['answer'])} }},")
    lines.append("    ],")
    lines.append("    sources: [")
    for s in SOURCES[slug]:
        lines.append(f"      {{ label: {js_str(s['label'])}, url: {js_str(s['url'])} }},")
    lines.append("    ],")
    lines.append("  },")
    lines.append("")
    out.append("\n".join(lines))

result = "\n".join(out)
open("reports/keyword-pass/2026-09-16/prompts/guides_ts_insert.txt", "w").write(result)
print("wrote", len(result), "chars")
