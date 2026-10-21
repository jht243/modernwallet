# real-estate — /real-estate/capital-gains-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials). Intent from the H1 "Rental Property Capital Gains Calculator", the title "Rental Property Capital Gains Calculator: Net Proceeds" and the meta "See exactly what you'll net after selling a rental property — capital gains tax plus the 25% depreciation recapture" (target keyword `rental property capital gains calculator`).
- STEP 1 numbers (data_days = 13, early): people 15, uses 15, views 51, use_rate 0.294, people_7d 11. First time worked. The same `RentalCalculator` renders every /real-estate/ page; this one is the capital-gains page.

## Persona
- Who/where: a 52-year-old landlord, married, on a laptop with the closing statement from 2014 and last year's Schedule E: bought for $185,000 (+$4,000 closing), $15,000 new roof, rented 11 years, now has a $310,000 offer.
- Job: "If I sell for $310,000, how much federal tax do I owe — including the depreciation recapture?"
- Done = a gain figure and an estimated tax bill they can weigh against a 1031 exchange.

## Walkthrough
Desktop 1366px (`screenshots/real-estate-desktop.png`):
1. Page 200 in ~2.6s, `data-tool` root 477px down. Tool heading "Model your rental property's financials — Enter your property details above — then use the gain formula below to estimate sale taxes."
2. Inputs are all about buying and operating: purchase price, down payment %, closing %, rate, term, rent, vacancy, tax, insurance, maintenance, management, HOA. No sale price, no years owned, no depreciation, no filing status.
3. Entered purchase $185,000, 20% down, 4.25%, rent $1,650, tax $2,900, insurance $1,300 → monthly cash flow $357, cap rate 7.04%, cash-on-cash 10.08%. Opened "Show 20-year projection" → value in year 20 $334,131, "Net sale proceeds $239,667", IRR 16.98% — a hypothetical future sale with no tax at all.
4. As the persona: nowhere to type $310,000 or 11 years; the tool never shows a gain, the depreciation recapture, or a tax figure. The page body (below) has the formula with a worked example, so the reader has to do the arithmetic by hand.
5. Reading the body: "For 2024, long-term CG rates are 0% (taxable income under ~$47,025 single / ~$94,050 married)… 20% (income above ~$518,900 single / ~$583,750 married)" — two years out of date (2026: $49,450 / $98,900 and $545,500 / $613,700, IRS Rev. Proc. 2025-32, already quoted elsewhere on this site). It also calls the depreciation rate "a flat 25%"; IRS Topic 409 says unrecaptured section 1250 gain is taxed at a **maximum** 25%.
6. Same 18px horizontal page scroll (site footer).
Phone 390px (`screenshots/real-estate-mobile.png`):
1. Same numbers and same missing sale inputs; no horizontal scroll at 390px; inputs ≥32px; no console errors.

## Friction
- "It's called a capital gains calculator, but there's nowhere to put my sale price." — the tool on this page cannot compute the thing in its H1. → tool fix (additive, capital-gains page only via a preset flag): a "Selling? Estimate the federal tax on the sale" panel under the existing results with: sale price, selling costs %, original price + closing costs (prefilled from the purchase inputs), capital improvements, depreciation claimed (with an "estimate it" helper: (price + closing) × (1 − land %) ÷ 27.5 × years rented, IRS Pub 527), filing status (single / married filing jointly) and other taxable income. Outputs: adjusted basis, total gain, the depreciation (unrecaptured §1250) portion and its tax at the 25% maximum rate (shown as "up to"), the remaining long-term gain and its tax stacked on top of other income through the 2026 0/15/20% thresholds, and a 3.8% NIIT note. Formula per IRS Pub 544 / Topic 409 / Pub 527 — the same one the page body already states. Worked example (MFJ, $95,000 other taxable income): adjusted basis $185,000 + $4,000 + $15,000 − $60,480 = $143,520; gain $310,000 − $18,600 − $143,520 = $147,880; depreciation portion $60,480 → up to $15,120; remaining $87,400 sits above the $98,900 0% line → 15% = $13,110; estimated federal tax up to $28,230.
- "Is this 2024 table still right for my 2026 sale?" — stale thresholds on a YMYL page. → body fix: replace the 2024 threshold sentence with the 2026 figures (IRS Rev. Proc. 2025-32 / Topic 409) and correct "flat 25%" to "a maximum 25%" where the page says it (one-sentence edits).
- Footer horizontal scroll — covered by the site-wide footer row.

## Monetization
Verdict: fit
YMYL (tax on a property sale) → books only. Once the landlord sees a five-figure tax estimate, the next step is learning the deferral and planning options (1031, installment sale, timing) before talking to a CPA. Ranked product-type list:
1. Book — real-estate investor tax strategy (depreciation, recapture, 1031)
2. Book — advanced real-estate tax planning (cost segregation, exchanges, entity choices)
3. Book — annual income-tax guide (filing the sale: Schedule D, Form 4797)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Sale estimate shown with a depreciation portion (recapture owed) | 0990711765 *The Book on Tax Strategies for the Savvy Real Estate Investor* (Han & MacFarland, BiggerPockets); 1947200224 *The Book on Advanced Tax Strategies* (Han & MacFarland, BiggerPockets); 1394461577 *J.K. Lasser's Your Income Tax 2027* | How recapture and 1031 deferral work; then advanced planning; then the filing guide for the sale year |
| No sale entered (operating the rental) | 0990711765 *The Book on Tax Strategies for the Savvy Real Estate Investor*; 1394461577 *J.K. Lasser's Your Income Tax 2027* | The deductions and depreciation that shape the eventual sale |
