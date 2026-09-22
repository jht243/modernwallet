# Asset spec — GRAT calculator (`/estate-planning/grat-calculator/`)

**Chart row:** mindmap-pass 2026-09-21, row 3. **Format:** calculator (interactive tool). **Phase 3 writes this spec only — the island is built in a follow-up pass.**

## Why a calculator, not an article
Query signals are explicitly computational: "grat calculator" (70/mo, kd0, $6.03 CPC), "grantor retained annuity trust calculator" (20/mo, $6.65 CPC), "grat annuity payment calculation" (10/mo, $7.68 CPC), "grat trust calculator" (10/mo), plus "rolling grat calculator" as a SERP related search. The real PAA on the read SERP is *"How to calculate GRAT annuity payment?"* — a question a prose page cannot answer for the reader's own numbers. Page one is small actuarial tool sites (rogerhealy.com, wealthplannerpro.ai, brentmark.com, wcalcs.com, estateplanningtool.com) plus actec.org; only 1/10 slots is a major platform (smartasset.com). Verdict: winnable.

## Route + placement
- Route: `/estate-planning/grat-calculator/`
- Store: new spoke entry in `src/data/spokes-estate-planning.ts` with `calculator: "estate-planning"`, mirroring `estate-tax-calculator` / `living-trust-cost-calculator`.
- Island: `src/components/GratCalculator.tsx`, registered in `src/data/calculators.ts` and added to `LIVE_IDS` in `src/data/registry.ts` (id `grat`).
- **Primary keyword:** grat calculator. **Secondary:** grantor retained annuity trust calculator, grat trust calculator, grat annuity payment calculation, rolling grat calculator.
- **Placeholder route: not needed.** `/estate-planning/` is served by an Astro dynamic route off the spokes store, so the route materialises the moment the spoke entry lands. Do not add the spoke entry until the island exists, or the build will ship an empty page.

## Inputs
| Input | Type | Default | Notes |
|---|---|---|---|
| Amount transferred into the GRAT | currency | $5,000,000 | min $100,000 |
| GRAT term | integer years | 2 | 2–10, matching the common range |
| Section 7520 rate for the funding month | percent | 5.40 | user-entered; label "September 2026 = 5.40%"; link https://www.irs.gov/businesses/small-businesses-self-employed/section-7520-interest-rates and state the rate changes monthly |
| Assumed annual growth rate | percent | 8.0 | clearly labelled an assumption, not a forecast |
| Annuity structure | toggle | Zeroed-out | Zeroed-out (solve for the annuity that drives the taxable gift to ~$0) \| Fixed annuity (user enters the payment) |
| Increasing annuity | toggle | off | when on, apply the 20% annual step-up permitted by Treas. Reg. §25.2702-3 |
| Roll annuity payments into a new GRAT | toggle | off | when on, model a rolling programme over the same total horizon |

## Outputs
1. **Annual annuity payment** — for a zeroed-out GRAT, `amount / a(n, r)` where `a(n,r) = (1 − (1+r)^−n) / r` (ordinary annuity, payments at the end of each year). Worked check: $5,000,000, n=2, r=5.4% → a = 1.84891 → **$2,704,290/yr**.
2. **Taxable gift at funding** — `amount − PV(annuity stream at the 7520 rate)`. ~$0 in zeroed-out mode; a real number in fixed-annuity mode.
3. **Projected remainder to beneficiaries** — year-by-year: `balance = balance × (1 + growth) − annuity`. Worked check at 12% growth on the above: Y1 $2,895,710 → Y2 **$538,905**.
4. **Lifetime exemption consumed** — the taxable gift, shown against the 2026 $15,000,000 exemption.
5. **Break-even growth rate** — the growth rate at which the remainder is $0 (equals the 7520 rate in zeroed-out mode); state it plainly: below this, the GRAT transfers nothing.
6. **Year-by-year table** — opening balance, growth, annuity paid, closing balance.
7. **Rolling mode** — repeats the above per GRAT, re-funding each with the prior annuity payment, and totals the remainder transferred.

## Required on-page copy (written when the island is built)
- One sentence stating the result plainly for AEO.
- "What this does not model": mortality risk (IRC §2036 pull-back if the grantor dies during the term), income tax paid by the grantor, trustee and legal fees, valuation disputes on hard-to-value assets, and state law.
- The disclaimer pattern used by `estate-tax-calculator`: general information, not legal or tax advice; work with an estate planning attorney and CPA.
- Links: `/guides/what-is-a-grat-trust/`, `/guides/rolling-grat-strategy/`, `/compare/grat-vs-idgt/`, `/estate-planning/estate-tax-calculator/`.

## Data sources
IRS §7520 rate table (monthly, user-entered — **never hardcode a rate as current**); IRC §7520; IRC §2702 and Treas. Reg. §25.2702-3; IRC §2010(c)(3) for the $15,000,000 exemption.

## Dependencies
`CalculatorIsland.tsx` pattern; `spokes-estate-planning.ts` spoke shape; `registry.ts` `LIVE_IDS`. No external API.
