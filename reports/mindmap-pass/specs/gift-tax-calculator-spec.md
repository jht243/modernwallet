# Asset spec — Gift tax calculator (`/estate-planning/gift-tax-calculator/`)

**Chart row:** mindmap-pass 2026-09-21, row 6. **Format:** calculator (interactive tool). **Phase 3 writes this spec only — the island is built in a follow-up pass.**

## Why a calculator, not an article
"gift tax calculator" carries 1,000/mo at kd7, and the SERP's real PAA questions are arithmetic ones — *"How are gift taxes calculated?"*, *"How much is gift tax on $30,000?"*, *"Can I gift my child $100,000 tax-free?"* — which resolve to a per-user number, not prose. Related searches include "Gift tax calculator 2026" and "Lifetime gift tax exemption calculator". Page one: taxact.com, nerdwallet.com, smartasset.com, jacksonhewitt.com, irs.gov, turbotax.intuit.com. Verdict: winnable. The existing `/estate-planning/estate-tax-calculator/` models tax at death and does **not** model lifetime gifts.

## Route + placement
- Route: `/estate-planning/gift-tax-calculator/`
- Store: new spoke in `src/data/spokes-estate-planning.ts`, `calculator: "estate-planning"`.
- Island: `src/components/GiftTaxCalculator.tsx`; register in `src/data/calculators.ts` + `LIVE_IDS` (id `gift-tax`).
- **Primary keyword:** gift tax calculator. **Secondary:** gift tax calculator 2026, lifetime gift tax exemption calculator, how much is gift tax on $30,000.
- **Placeholder route: not needed.** `/estate-planning/` is served by an Astro dynamic route off the spokes store, so the route materialises the moment the spoke entry lands. Do not add the spoke entry until the island exists, or the build will ship an empty page.

## Inputs
| Input | Type | Default | Notes |
|---|---|---|---|
| Gift amount per recipient | currency | $50,000 | |
| Number of recipients | integer | 1 | the annual exclusion is per donee |
| Filing status / gift splitting | toggle | Single | Married electing to split gifts doubles the exclusion to $38,000 per donee and requires both spouses' consent on Form 709 |
| Recipient is a non-US-citizen spouse | checkbox | off | applies the $194,000 2026 exclusion instead |
| Recipient is a US-citizen spouse | checkbox | off | unlimited marital deduction — result is $0 and no return |
| Lifetime exemption already used | currency | $0 | prior taxable gifts reported on earlier Forms 709 |
| Direct tuition or medical payment to the institution | checkbox | off | excluded entirely, no exclusion consumed |

## Outputs
1. **Annual exclusion applied** — `min(gift, 19,000) × recipients` (or $38,000/donee when splitting).
2. **Taxable gift** — the excess above the exclusion. Worked checks: $50,000 single → $31,000; $50,000 split → $12,000; $75,000 single → $56,000; $75,000 split → $37,000 ($18,500 each); $100,000 single → $81,000.
3. **Lifetime exemption remaining** — `15,000,000 − (already used + taxable gift)`. Worked check: $100,000 single gift → **$14,919,000** remaining.
4. **Gift tax actually owed** — `$0` until cumulative taxable gifts exceed $15,000,000; above that, 40% on the excess. The headline result for nearly every user is **$0 owed**, and the UI must say so rather than burying it.
5. **Form 709 required?** — Yes/No with the reason (over the annual exclusion to one donee, a split-gift election, or a future interest). Links `/guides/form-709-gift-tax-return/`.
6. **Per-recipient breakdown table** when recipients > 1.

## Required on-page copy
- One extractable sentence stating the 2026 annual exclusion ($19,000) and lifetime exemption ($15,000,000) together, for AEO.
- "What this does not model": state estate and inheritance taxes (no state levies a standalone gift tax in 2026 — Connecticut repealed its gift tax for gifts made on or after 1 January 2023), generation-skipping transfer tax, valuation of non-cash gifts, future interests, and prior-year exclusions.
- Standard disclaimer: general information, not tax advice.
- Links: `/guides/gift-tax-limit-2026/`, `/guides/form-709-gift-tax-return/`, `/estate-planning/estate-tax-calculator/`, `/guides/what-is-a-grat-trust/`.

## Data sources
IRC §2503 (annual exclusion); IRC §2010(c)(3) and OBBBA P.L. 119-21 (the $15,000,000 exemption); IRC §2523 (marital deduction); IRS gift tax page and Form 709 instructions. **Every figure is a 2026 figure and must be dated on the page**, with a note that the exclusion is indexed and changes.

## Dependencies
`CalculatorIsland.tsx`; spoke shape in `spokes-estate-planning.ts`; `registry.ts` `LIVE_IDS`. No external API.
