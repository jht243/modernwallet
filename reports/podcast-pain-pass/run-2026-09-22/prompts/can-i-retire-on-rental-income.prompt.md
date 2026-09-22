# ROW PROMPT — can-i-retire-on-rental-income (guide page, ModernWallet / themodernwallet.com)

## PAGE
- route: /guides/can-i-retire-on-rental-income/
- slug: can-i-retire-on-rental-income
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 1200 words minimum across introText + sections + faqs
- register: operator
- medium: text -> text
- updated date to use where the schema needs one: 2026-09-22

## KEYWORDS + INTENT
- primary keyword: can i retire on rental income
- secondary keywords (autocomplete-corroborated, DataForSEO estimate band ~75/mo each): how much rental income to retire; is rental income good for retirement; how is rental income taxed in retirement; how to find investment property deals (folded as FAQ); can you negotiate the price of a rental property (folded as FAQ)
- intent: Feasibility + how-to intent — this week's Rental Income Podcast ran 6 new episodes on landlords retiring off rental cash flow, finding deals, and pricing. The reader wants to know if this is realistic, what the cash-flow math actually looks like, and how rental income is taxed once they're relying on it.
- reader question: "can rental income actually replace my paycheck in retirement, and how is it taxed?"

## FAQ SPEC — use these REAL autocomplete-mined questions, verbatim as `faqs[].question` (includes the two folded topics per the chart's RECLASSIFY verdict — do not make these separate pages)
  1. Can you live off rental income?
  2. How much rental income do you need to retire?
  3. Is rental income a good retirement strategy?
  4. How is rental income taxed in retirement?
  5. How do you find good rental property deals?
  6. Can you negotiate the price of a rental property?
Answer each in 2-4 sentences, concretely, from the fact list only. Do not invent additional FAQ questions.

## SECTION COVERAGE (each becomes one `sections[]` entry; noun-phrase Title Case headings; at most ONE heading may open with the primary keyword)
1. The direct answer up front (sentence 1 of introText, operator register): rental income can replace part or all of a paycheck in retirement, but only after real cash-flow math — mortgage payoff status, vacancy, repairs, and property management all eat into the rent check before it becomes spendable income.
2. The cash-flow math, worked hypothetical (label it clearly as a HYPOTHETICAL illustration, not a promise): a paid-off rental renting for $2,000/month generates $24,000/year in gross rent. After a commonly-cited rule of thumb among real estate investors that operating expenses (repairs, vacancy, insurance, property tax, management) run roughly 40-50% of gross rent, net cash flow before tax lands in a broad $12,000-$14,400/year range. Label the 40-50% figure explicitly as "a commonly used investor rule of thumb, not a guarantee," never as a government or measured statistic.
3. How rental income is actually taxed: real estate rental income and expenses are reported on Schedule E (Form 1040), Supplemental Income and Loss — cite IRS Topic 414. Walk through that this is separate from wage income and has its own reporting form.
4. Whether rental income counts toward Social Security-style "earned income" or triggers self-employment tax: under IRC §1402(a)(1), net rental income from real estate is generally EXCLUDED from net earnings from self-employment (so it generally does NOT get hit with self-employment tax) — UNLESS the owner provides substantial services to tenants (the kind of service you'd see with a hotel, bed-and-breakfast, or heavily-serviced short-term rental), or is in the trade or business of a real estate dealer. Cite IRS Topic 554.
5. Depreciation and passive activity basics: IRS Publication 527 covers depreciation of residential rental property and the passive activity rules that apply to most landlords — flag that these rules materially change the real after-tax cash flow and are exactly the kind of area where a CPA should be involved before someone counts on rental income to replace a paycheck.
6. Whether one property is realistically "enough": the honest answer is it depends entirely on the property's actual net cash flow versus the reader's actual retirement expenses — this page cannot hand a specific reader that number. Describe the process instead: total up realistic monthly retirement expenses, then work backward to how much NET (after-expense, after-tax) rental cash flow would need to replace them, and compare that to what a paid-off or low-leverage property in the reader's market realistically nets.
7. How to find and evaluate a rental deal (folds the "how to find investment property deals" and "negotiate price" demand): buyers commonly look at off-market listings, distressed or motivated-seller sales, and properties sitting on market past a typical days-on-market threshold as opportunities for a lower asking price; negotiating leverage typically comes from the seller's own motivation (time pressure, an as-is condition, or a slow market) rather than a fixed script. Cite this only as commonly described investor practice, not a government fact — do not invent a specific negotiation percentage or discount figure.
8. Who this is not for: a reader who needs 100% certain, inflation-proof income (a rental has vacancy risk, big-ticket repair risk, and requires either your time or a paid property manager) may be poorly served by relying on ONE property as their only retirement income; diversifying income sources, and not counting on rental income alone, is the general caution here.
9. What would change this: a market with much higher property prices relative to rent (a worse "cap rate"), a landlord who has to pay a property manager (commonly 8-10% of collected rent as a commonly cited range, label clearly as a common range not a fixed fact) versus self-managing, and a tenant/vacancy environment specific to the reader's market — none of which this page can calculate for a specific address.
10. Close on the concrete next action: running the actual numbers on a specific property with the site's cash flow and ROI calculators before treating rental income as retirement income, and involving a CPA on the tax side given the depreciation and passive-activity rules above.

## INTERNAL LINKS YOU MAY USE (exact paths — no others, never invent one)
- /real-estate/ — real estate hub
- /real-estate/cash-flow-calculator/ — cash flow calculator
- /real-estate/rental-income-calculator/ — rental income calculator
- /real-estate/cap-rate-calculator/ — cap rate calculator
- /real-estate/roi-calculator/ — ROI calculator
- /real-estate/rental-income-tax-calculator/ — rental income tax calculator
- /real-estate/depreciation-calculator/ — depreciation calculator
- /compare/reit-vs-rental-property/ — REIT vs rental property comparison (for readers who want passive exposure without being a landlord)
- /guides/dscr-loan-requirements/ — DSCR loan guide (financing an investment property)
(No siblings shipping in this same run for this page.)

## `tools` FIELD (guide pages only)
Pick 2-3 from: /real-estate/cash-flow-calculator/, /real-estate/rental-income-calculator/, /real-estate/cap-rate-calculator/, /real-estate/rental-income-tax-calculator/.

## SOURCES
Populate `sources` with 2-4 entries drawn ONLY from the closed URL list below.

# CLOSED FACT LIST

**Anything not on this list, you do not know. Never invent a tax rate, cap rate, appreciation rate, or rental-market statistic. Say it is unpublished and tell the reader to verify with a CPA or in their own market.**

## Tax reporting (source: IRS, "Topic no. 414, Rental income and expenses," irs.gov/taxtopics/tc414)
- Real estate rental income and expenses are generally reported on **Schedule E (Form 1040), Supplemental Income and Loss**.
- Taxable rental income includes regular rent payments, advance rent, a tenant's lease-cancellation payment, expenses a tenant pays on the owner's behalf, and a retained security deposit used as final rent.
- Deductible expenses generally must be for carrying on a trade or business, for the production of income, or for management/conservation/maintenance of income-producing property.

## Self-employment tax treatment (source: IRS, "Topic no. 554, Self-employment tax," irs.gov/taxtopics/tc554; statutory basis 26 U.S.C. §1402(a)(1))
- Under **IRC §1402(a)(1)**, net rental income from real estate is **generally excluded from net earnings from self-employment** — meaning it is generally **not** subject to self-employment tax.
- The exclusion does **not** apply where the owner provides **substantial services** to occupants (services beyond what is customary for a rental, e.g. daily cleaning, meals — the kind of service found at a hotel or bed-and-breakfast), or where the owner is in the trade or business of a **real estate dealer**.

## Depreciation and passive activity (source: IRS Publication 527, "Residential Rental Property," irs.gov/publications/p527)
- IRS Publication 527 is the IRS's guide to reporting income and expenses on residential rental property, including **depreciation** and the **passive activity and at-risk rules**.
- These rules affect how much of a rental loss (if any) can offset other income in a given year, and they are exactly the kind of area a CPA should review for a specific reader's situation. Do not attempt to state a specific depreciation schedule number or a specific passive-loss dollar limit — Publication 527 is cited for the reader to review the specifics themselves.

## Commonly cited investor rules of thumb (NOT government statistics — always label as such)
- A commonly cited rule of thumb among real estate investors is that operating expenses (repairs, vacancy, insurance, property tax, and management) run roughly **40% to 50% of gross rental income** over time. Always label this explicitly as an investor rule of thumb, never as a measured or government figure.
- A commonly cited range for a third-party property manager's fee is roughly **8% to 10% of collected rent**. Always label this explicitly as a commonly cited range, never as a fixed fact or a promise.

## Hard prohibitions
- No invented cap rate, appreciation rate, rent-growth rate, or specific market statistic.
- No individualized investment or tax advice — describe the general math and mechanics, and tell the reader to run their own numbers and consult a CPA.
- Never state that rental income is guaranteed, passive with zero effort, or risk-free.
- Never invent a specific negotiation discount percentage.
