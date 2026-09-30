# Asset spec: Social Security tax calculator (`/social-security-tax-calculator/`)

**Chart row:** mindmap-pass 2026-09-30, row 1. **Format:** calculator (interactive tool). **Phase 3 writes this spec only. The island gets built in a follow-up pass.** The ga4-top-pages pass deferred this same calculator twice ("Lane E, new engine work", 2026-09-22 and 2026-09-29).

## Why a calculator, not an article
The brief's biggest winner is `/guides/is-social-security-taxable/` (357 GA4 views, 16.2% of the site in the user's screenshot). That guide explains the combined-income formula, but it gives the reader no way to run their own numbers. Google Autocomplete returns 20+ calculator phrasings across the two seeds: *social security taxable benefits calculator 2026*, *how much social security taxable calculator*, *social security taxable amount calculator*, *social security tax calculator for retirees*, *social security taxable amount worksheet*, *social security tax calculator big beautiful bill*. Every one of them asks for a personal figure. Demand is `source: estimate (autocomplete), NOT measured`: no volume provider was usable this run. The SERP was not read, because DataForSEO credentials aren't configured.

## Route + placement
- Route: `/social-security-tax-calculator/`. This is a standalone calculator hub following the HELOC pattern (`e6722a8`, `/heloc-calculator/`).
- Engine: `src/lib/social-security-tax.ts`. Island: `src/components/SocialSecurityTaxCalculator.tsx`. Register it in `src/data/calculators.ts` (id and islandId `social-security-tax-calculator`) and in `LIVE_IDS` in `src/data/registry.ts`.
- **Primary keyword:** social security tax calculator. **Secondary:** social security taxable benefits calculator 2026, how much of my social security is taxable, social security taxable amount worksheet, social security tax calculator for seniors.
- **Placeholder route: not needed.** The hub is served by the `[category]` dynamic route off `calculators.ts`. Do not add the calculator entry until the island exists, or the build will ship an empty tool.

## Inputs
| Input | Type | Default | Notes |
|---|---|---|---|
| Filing status | select | Single | Single / Head of household / Qualifying surviving spouse / Married filing jointly / Married filing separately (lived apart all year) / Married filing separately (lived with spouse) |
| Annual Social Security benefits | currency | $24,000 | net benefits, SSA-1099 box 5 |
| Other income | currency | $20,000 | wages, pensions, IRA/401(k) withdrawals, taxable interest, dividends, capital gains |
| Tax-exempt interest | currency | $0 | municipal bond interest. It counts toward combined income. |
| Adjustments to income | currency | $0 | Schedule 1 lines 11–20, 23, 25 (optional, advanced) |
| Age 65+ (you / spouse) | checkboxes | off | only used for the senior-deduction panel |

## Engine: IRS Publication 915, Worksheet 1 (2025 edition), line for line
```
L2  = benefits × 0.5
L8  = L2 + otherIncome + taxExemptInterest − adjustments      (≤ 0 → taxable = 0)
MFS lived together → taxable = min(L8 × 0.85, benefits × 0.85), stop
base = 32,000 (MFJ) | 25,000 (all other statuses)
L10 = L8 − base                                                 (≤ 0 → taxable = 0)
L11 = 12,000 (MFJ) | 9,000 (others)
L12 = max(L10 − L11, 0);  L13 = min(L10, L11)
L15 = min(L2, L13 × 0.5); L17 = L15 + L12 × 0.85
taxable = min(L17, benefits × 0.85)
```

**Ground-truth checks** (computed with the formula above; the engine's unit test must reproduce every one exactly):
| Status | Benefits | Other income | Tax-exempt | Taxable benefits |
|---|---|---|---|---|
| Single | $20,000 | $0 | $0 | **$0** |
| Single | $24,000 | $20,000 | $0 | **$3,500** |
| Single | $24,000 | $15,000 | $2,000 | **$2,000** |
| Single | $30,000 | $40,000 | $0 | **$22,350** |
| MFJ | $48,000 | $10,000 | $0 | **$1,000** |
| MFJ | $40,000 | $30,000 | $0 | **$11,100** |
| MFJ | $36,000 | $80,000 | $0 | **$30,600** (85% cap) |
| MFS, lived together | $20,000 | $10,000 | $0 | **$17,000** |

## Outputs
1. **Combined income** (L8), with the base amount it was compared against.
2. **Taxable Social Security**: dollars, and as a % of benefits. Tier label: none / up to 50% / up to 85%.
3. **Tax-free portion**: benefits minus taxable.
4. **Senior deduction panel** (2025–2028). It shows $6,000 per person age 65+, reduced by 6% of MAGI above $75,000 ($150,000 MFJ), never below zero, and not available when married filing separately. MAGI = other income + taxable benefits − adjustments. This panel must state plainly that the deduction lowers taxable income but **does not change the taxable-benefits figure above**. Worked check: single, MAGI $100,000 → $4,500. Link it to `/guides/senior-deduction-social-security/`, which owns this answer.
5. A line pointing to Form W-4V withholding (7%, 10%, 12% or 22%).

## Required on-page copy
- One extractable AEO sentence with the thresholds: $25,000 / $32,000 base, up to 50%; above $34,000 / $44,000, up to 85%; never more than 85%.
- "What this does not model": state tax (link `/guides/states-that-tax-social-security/`), lump-sum prior-year benefit elections, foreign-income exclusions (worksheet L5), and the tax rate applied to the taxable amount.
- Standard disclaimer: general information, not tax advice.
- Links: `/guides/is-social-security-taxable/`, `/guides/senior-deduction-social-security/`, `/guides/states-that-tax-social-security/`, `/retirement/social-security-retirement-calculator/`.

## Data sources (closed list: `reports/mindmap-pass/2026-09-30/facts/senior-deduction.md` and `pub915-worksheet.md`)
- IRS Publication 915 (2025): https://www.irs.gov/publications/p915
- IRS Schedule 1-A (senior deduction math): https://www.irs.gov/pub/irs-pdf/f1040s1a.pdf
- IRS enhanced deduction for seniors: https://www.irs.gov/newsroom/one-big-beautiful-bill-act-tax-deductions-for-working-americans-and-seniors
- Form W-4V: https://www.irs.gov/pub/irs-pdf/fw4v.pdf

## Dependencies
- A new engine plus island (React TSX, same pattern as `HelocCalculator.tsx` / `heloc.ts`).
- A calculators.ts hub entry. Its copy (intro, how-it-works, FAQs) is generated through `content_gen.py` when the island ships, and the numbers are taken from the engine output.
- Inbound links from `/guides/is-social-security-taxable/` (tools panel) and `/retirement/` once live.
