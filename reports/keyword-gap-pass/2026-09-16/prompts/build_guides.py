import json

sources_map = {
  "zakat-calculation-by-madhab-hanafi-shafii-shia": [
    {"label": "Joe Bradford — How to Calculate Your Zakat", "url": "https://joebradford.substack.com/p/how-to-calculate-your-zakat"},
    {"label": "SeekersGuidance — Gold or Silver Nisab Standard", "url": "https://seekersguidance.org/answers/shafii-fiqh/should-the-minimum-zakatable-amount-be-measured-by-the-gold-or-silver-standards/"},
    {"label": "Zakat Foundation of America — What Is Nisab in Islam?", "url": "https://www.zakat.org/what-is-ni-ab-in-islam"},
    {"label": "Islamic Relief Canada — Zakat on Gold", "url": "https://www.islamicreliefcanada.org/our-work/zakat/zakat-on-gold"},
    {"label": "Sistani.org — Alms Tax (Zakat), Chapter Eight", "url": "https://www.sistani.org/english/book/48/2314/"},
    {"label": "Sistani.org — The Taxable Limit (Nisab) for Gold", "url": "https://www.sistani.org/english/book/48/2317/"},
    {"label": "Sistani.org — The Nisab for Silver", "url": "https://www.sistani.org/english/book/48/2318/"},
  ],
  "zakat-on-cryptocurrency-calculator-explained": [
    {"label": "Joe Bradford — Zakat on Cryptocurrency", "url": "https://joebradford.substack.com/p/zakat-on-cryptocurrency"},
    {"label": "Musaffa Academy — Zakat on Cryptocurrency", "url": "https://academy.musaffa.com/zakat-on-cryptocurrency/"},
    {"label": "Joe Bradford — Zakat on Retirement Accounts", "url": "https://joebradford.substack.com/p/zakat-on-retirement-accounts-a-complete"},
  ],
  "zakat-calculator-malaysia-by-state": [
    {"label": "Malaysia.gov.my — List of State Zakat Agencies", "url": "https://www.malaysia.gov.my/en/categories/aid-welfare-and-assistance/zakat/list-of-state-zakat-agencies"},
    {"label": "JAIS — About Us", "url": "https://www.jais.gov.my/en/about-us-3/"},
    {"label": "Lembaga Zakat Selangor — About Us", "url": "https://www.zakatselangor.com.my/en/about-us/"},
    {"label": "iMoney — Income Zakat and Tax Rebate", "url": "https://www.imoney.my/articles/zakat-income-2026-tax-rebate"},
  ],
}

for slug, srcs in sources_map.items():
    p = f"reports/keyword-gap-pass/2026-09-16/drafts/{slug}.json"
    d = json.load(open(p))
    guide = {
        "slug": d["slug"],
        "updated": "2026-09-16",
        "title": d["title"],
        "metaDescription": d["metaDescription"],
        "h1": d["h1"],
        "cardBlurb": d["cardBlurb"],
        "introText": d["introText"],
        "sections": d["sections"],
        "tools": [{"href": "/zakat/", "label": "Zakat calculator"}],
        "faqs": d["faqItems"],
        "sources": srcs,
    }
    out = f"reports/keyword-gap-pass/2026-09-16/drafts/{slug}.guide.json"
    json.dump(guide, open(out, "w"), indent=2, ensure_ascii=False)
    print("wrote", out)
