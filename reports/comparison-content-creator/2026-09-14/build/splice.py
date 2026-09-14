import json, pathlib, datetime

ROOT = pathlib.Path("/home/user/modernwallet")
DRAFTS = ROOT / "reports/comparison-content-creator/2026-09-14/drafts"
TODAY = "2026-09-14"

CONFIG = {
  "lyft-vs-uber": dict(
    targetKeyword="lyft vs uber",
    related=["doordash-vs-uber-eats", "instacart-vs-doordash"],
    calc=[{"label": "Self-Employment Tax Calculator", "href": "/self-employment-tax/"},
          {"label": "Mileage Deduction Calculator", "href": "/mileage-deduction/"}],
    sources=[
      {"label": "Uber", "url": "https://www.uber.com"},
      {"label": "Lyft", "url": "https://www.lyft.com"},
      {"label": "IRS — Gig Economy Tax Center", "url": "https://www.irs.gov/businesses/gig-economy-tax-center"},
    ],
  ),
  "doordash-vs-uber-eats": dict(
    targetKeyword="doordash vs uber eats",
    related=["lyft-vs-uber", "instacart-vs-doordash", "amazon-flex-vs-doordash"],
    calc=[{"label": "Self-Employment Tax Calculator", "href": "/self-employment-tax/"},
          {"label": "Mileage Deduction Calculator", "href": "/mileage-deduction/"}],
    sources=[
      {"label": "DoorDash", "url": "https://www.doordash.com"},
      {"label": "Uber Eats", "url": "https://www.ubereats.com"},
      {"label": "IRS — Gig Economy Tax Center", "url": "https://www.irs.gov/businesses/gig-economy-tax-center"},
    ],
  ),
  "instacart-vs-doordash": dict(
    targetKeyword="instacart vs doordash",
    related=["doordash-vs-uber-eats", "shipt-vs-instacart", "amazon-flex-vs-doordash"],
    calc=[{"label": "Self-Employment Tax Calculator", "href": "/self-employment-tax/"},
          {"label": "Mileage Deduction Calculator", "href": "/mileage-deduction/"}],
    sources=[
      {"label": "Instacart", "url": "https://www.instacart.com"},
      {"label": "DoorDash", "url": "https://www.doordash.com"},
      {"label": "IRS — Gig Economy Tax Center", "url": "https://www.irs.gov/businesses/gig-economy-tax-center"},
    ],
  ),
  "amazon-flex-vs-doordash": dict(
    targetKeyword="amazon flex vs doordash",
    related=["instacart-vs-doordash", "doordash-vs-uber-eats", "shipt-vs-instacart"],
    calc=[{"label": "Self-Employment Tax Calculator", "href": "/self-employment-tax/"},
          {"label": "Mileage Deduction Calculator", "href": "/mileage-deduction/"}],
    sources=[
      {"label": "Amazon Flex", "url": "https://flex.amazon.com"},
      {"label": "DoorDash", "url": "https://www.doordash.com"},
      {"label": "IRS — Gig Economy Tax Center", "url": "https://www.irs.gov/businesses/gig-economy-tax-center"},
    ],
  ),
  "shipt-vs-instacart": dict(
    targetKeyword="shipt vs instacart",
    related=["instacart-vs-doordash", "amazon-flex-vs-doordash"],
    calc=[{"label": "Self-Employment Tax Calculator", "href": "/self-employment-tax/"},
          {"label": "Mileage Deduction Calculator", "href": "/mileage-deduction/"}],
    sources=[
      {"label": "Shipt", "url": "https://www.shipt.com"},
      {"label": "Instacart", "url": "https://www.instacart.com"},
      {"label": "IRS — Gig Economy Tax Center", "url": "https://www.irs.gov/businesses/gig-economy-tax-center"},
    ],
  ),
  "s-corp-vs-c-corp": dict(
    targetKeyword="s corp vs c corp",
    related=["llc-vs-c-corp", "llc-vs-s-corp", "sole-proprietorship-vs-llc"],
    calc=[{"label": "S Corp Tax Hub", "href": "/s-corp-tax/"},
          {"label": "S Corp Reasonable Salary Calculator", "href": "/s-corp-tax/s-corp-reasonable-salary-calculator/"}],
    sources=[
      {"label": "IRS — About Form 2553", "url": "https://www.irs.gov/forms-pubs/about-form-2553"},
      {"label": "IRS — S Corporations", "url": "https://www.irs.gov/businesses/small-businesses-self-employed/s-corporations"},
    ],
  ),
  "llc-vs-c-corp": dict(
    targetKeyword="llc vs c corp",
    related=["s-corp-vs-c-corp", "llc-vs-s-corp", "sole-proprietorship-vs-partnership"],
    calc=[{"label": "S Corp Tax Hub", "href": "/s-corp-tax/"},
          {"label": "LLC vs S Corp Tax Calculator", "href": "/s-corp-tax/llc-vs-s-corp-tax-calculator/"}],
    sources=[
      {"label": "IRS — Limited Liability Company (LLC)", "url": "https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc"},
      {"label": "IRS — Forming a Corporation", "url": "https://www.irs.gov/businesses/small-businesses-self-employed/forming-a-corporation"},
    ],
  ),
  "sole-proprietorship-vs-partnership": dict(
    targetKeyword="sole proprietorship vs partnership",
    related=["sole-proprietorship-vs-llc", "llc-vs-s-corp", "s-corp-vs-c-corp"],
    calc=[{"label": "Self-Employment Tax Calculator", "href": "/self-employment-tax/"},
          {"label": "S Corp Tax Hub", "href": "/s-corp-tax/"}],
    sources=[
      {"label": "IRS — Sole Proprietorships", "url": "https://www.irs.gov/businesses/small-businesses-self-employed/sole-proprietorships"},
      {"label": "IRS — Partnerships", "url": "https://www.irs.gov/businesses/partnerships"},
    ],
  ),
  "hr-block-vs-taxact": dict(
    targetKeyword="h&r block vs taxact",
    related=["turbotax-vs-hr-block", "turbotax-vs-taxact", "freetaxusa-vs-turbotax"],
    calc=[],
    sources=[
      {"label": "H&R Block", "url": "https://www.hrblock.com"},
      {"label": "TaxAct", "url": "https://www.taxact.com"},
      {"label": "IRS — Free File", "url": "https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free"},
    ],
  ),
  "medicare-vs-medicaid": dict(
    targetKeyword="medicare vs medicaid",
    related=["medicare-advantage-vs-medigap"],
    calc=[{"label": "Long-Term Care Cost Calculator", "href": "/elder-care/long-term-care-cost-calculator/"},
          {"label": "Elder Care Hub", "href": "/elder-care/"}],
    sources=[
      {"label": "Medicare.gov", "url": "https://www.medicare.gov"},
      {"label": "Medicaid.gov", "url": "https://www.medicaid.gov"},
      {"label": "Social Security Administration", "url": "https://www.ssa.gov"},
    ],
  ),
  "new-car-vs-used-car": dict(
    targetKeyword="new car vs used car",
    related=["buying-vs-leasing-a-car", "certified-pre-owned-vs-used-car"],
    calc=[{"label": "Car Affordability Calculator", "href": "/auto-loan/car-affordability-calculator/"},
          {"label": "Auto Loan Payoff Calculator", "href": "/auto-loan/payoff-calculator/"}],
    sources=[
      {"label": "Consumer Reports", "url": "https://www.consumerreports.org"},
      {"label": "IRS", "url": "https://www.irs.gov"},
    ],
  ),
  "certified-pre-owned-vs-used-car": dict(
    targetKeyword="certified pre-owned vs used car",
    related=["new-car-vs-used-car", "buying-vs-leasing-a-car"],
    calc=[{"label": "Car Affordability Calculator", "href": "/auto-loan/car-affordability-calculator/"}],
    sources=[
      {"label": "Consumer Reports", "url": "https://www.consumerreports.org"},
      {"label": "Kelley Blue Book", "url": "https://www.kbb.com"},
    ],
  ),
  "secured-credit-card-vs-unsecured-credit-card": dict(
    targetKeyword="secured vs unsecured credit card",
    related=["secured-vs-unsecured-loan"],
    calc=[],
    sources=[
      {"label": "Consumer Financial Protection Bureau", "url": "https://www.consumerfinance.gov"},
      {"label": "Experian", "url": "https://www.experian.com"},
    ],
  ),
}

def ts_str(v, indent=4):
    """Render a Python value as TS object-literal source (double-quoted strings)."""
    pad = " " * indent
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        if not v:
            return "[]"
        items = [pad + "  " + ts_str(x, indent + 2) for x in v]
        return "[\n" + ",\n".join(items) + "\n" + pad + "]"
    if isinstance(v, dict):
        items = []
        for k, val in v.items():
            key = k if k.isidentifier() else json.dumps(k)
            items.append(pad + "  " + key + ": " + ts_str(val, indent + 2))
        return "{\n" + ",\n".join(items) + "\n" + pad + "}"
    raise TypeError(type(v))

def build_entry(slug):
    d = json.loads((DRAFTS / f"{slug}.json").read_text())
    cfg = CONFIG[slug]
    entry = {
        "slug": d["slug"],
        "updated": TODAY,
        "title": d["metaTitle"],
        "metaDescription": d["metaDescription"],
        "targetKeyword": cfg["targetKeyword"],
        "optionA": d["optionAName"],
        "optionB": d["optionBName"],
        "h1": d["h1"],
        "introText": d["introText"],
        "comparisonTable": d["comparisonTable"],
        "verdict": d["verdict"],
        "sections": d["sections"],
        "faqs": [{"question": f["question"], "answer": f["answer"]} for f in d["faqItems"]],
        "sources": cfg["sources"],
        "relatedComparisons": cfg["related"],
    }
    if cfg["calc"]:
        entry["calculatorLinks"] = cfg["calc"]
    return entry

def entry_to_ts(entry):
    pad = "  "
    lines = [pad + "{"]
    for k, v in entry.items():
        lines.append(pad + "  " + k + ": " + ts_str(v, 4) + ",")
    lines.append(pad + "},")
    return "\n".join(lines)

order = ["lyft-vs-uber","doordash-vs-uber-eats","instacart-vs-doordash","amazon-flex-vs-doordash",
         "shipt-vs-instacart","s-corp-vs-c-corp","llc-vs-c-corp","sole-proprietorship-vs-partnership",
         "hr-block-vs-taxact","medicare-vs-medicaid","new-car-vs-used-car","certified-pre-owned-vs-used-car",
         "secured-credit-card-vs-unsecured-credit-card"]

blocks = []
for slug in order:
    entry = build_entry(slug)
    blocks.append(entry_to_ts(entry))

out = "\n\n".join(blocks)
out_path = ROOT / "reports/comparison-content-creator/2026-09-14/build/new-entries.ts.txt"
out_path.write_text(out + "\n")
print("wrote", out_path, len(order), "entries")
