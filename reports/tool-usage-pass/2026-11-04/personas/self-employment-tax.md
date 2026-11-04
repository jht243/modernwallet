# self-employment-tax — /self-employment-tax/how-much-to-set-aside-for-taxes/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent comes from the title "How Much to Set Aside for Taxes (1099, 2026)", the H1 "How Much Should I Set Aside for Taxes on 1099 Income?" and the tool heading "How much to set aside: Add your W-2 wages to see the real rate for side income".
- STEP 1 numbers (data_days = 27, early): people 40, uses 42, views 117, use_rate 0.359, people_7d 16.
- `SelfEmploymentTaxCalculator` is the shared island behind the hub, this spoke, `/self-employment-tax/quarterly-estimated-tax-calculator/` and the gig-platform spokes. Any fix here reaches all of them.

## Persona
- Who/where: a 31-year-old freelance graphic designer, single, in their first full year on 1099s. They are at the laptop after a client paid an invoice, and expect about $62,000 of profit for 2026 with no day job.
- Job: "What percent of each payment do I move to my tax savings account, and what do I send the IRS each quarter?"
- Done means three things: a percentage to automate, a quarterly dollar amount, and when it is due.

## Walkthrough
Desktop 1366px (`screenshots/self-employment-tax-desktop.png`):
1. The page loads in about 2.2s with no console errors. The `data-tool` root starts 453px down. The answer is live, with no submit button.
2. Persona inputs: net profit 62,000, Single, no W-2, no other income, QBI on. The tool shows **20.2%**, "$12,498 of federal tax", SE tax $8,760, income tax $3,738 and quarterly $3,125. Hand check (Schedule SE, Rev. Proc. 2025-32):
   - NE = 62,000 × 0.9235 = 57,257.
   - SS = 57,257 × 12.4% = 7,099.87. Medicare = 57,257 × 2.9% = 1,660.45. SE tax = $8,760.32.
   - Half-SE deduction is 4,380.16, so AGI = 57,619.84. Subtract the 2026 standard deduction of $16,100 to get 41,519.84.
   - QBI = min(20% × 57,619.84, 20% × 41,519.84) = 8,303.97, so taxable income = 33,215.87.
   - Tax = 1,240 + 12% × 20,815.87 = $3,737.90.
   - Total is $12,498, which is 20.2% of profit. **Correct.**
3. Other cases also checked by hand and all matched:
   - Default 45,000 single: $8,580.
   - Married 62,000: $10,794 (std $32,200, QBI capped at $5,084, tax $2,034).
   - QBI off: $13,495.
4. Day-job case: 30,000 profit plus 180,000 W-2, single. The tool shows SS on $4,500 only (wage base $184,500, correct), Medicare $803, Additional Medicare $69 (0.9% × (180,000 + 27,705 − 200,000) = 69.35, correct) and income tax $5,629 (24% bracket, correct). It also shows the amber "Income above the QBI phase-in threshold… treat the QBI figure as an upper bound" box. That box is wrong for this filer. Taxable income before QBI is 180,000 + 30,000 − 680.77 − 16,100 = 193,219, which is below the 2026 threshold of $201,750. The full 20% QBI applies.
5. Tiny side gig: net profit $420. The tool shows "14.1%, $59 of federal tax", SE tax $59 and a quarterly payment of $15. **Wrong.** NE = 420 × 0.9235 = $387.87, which is under $400, so Schedule SE line 4c says no SE tax is owed. The right answer is $0.
6. As the persona: "$3,125 a quarter, but by when?" The page body never gives the 2026 due dates. It also doesn't say you can skip 1040-ES when you'll owe under $1,000, or that paying 100%/110% of last year's tax avoids the penalty. The body only refers out to another guide.
7. scrollWidth 1366 = innerWidth, so there is no horizontal scroll.

Phone 390px (`screenshots/self-employment-tax-mobile.png`):
1. Loads in about 1.8s with no console errors and no horizontal scroll (390 = 390). The filing-status toggle buttons fit on one row.
2. Head of household, 48,000: the tool shows 17.5% and $8,419. Hand check: SE $6,782, AGI 44,609, minus HOH std $24,150, QBI 4,092, TI 16,367 → tax $1,637 at 10%. Correct.
3. The day-job case gives the same numbers as desktop, and the same unwarranted QBI warning box takes about a screen of height on the phone.
4. The "Head of hh" toggle label is cryptic on a small screen. The QBI checkbox itself is 13px, but its wrapping `<label>` makes the whole row tappable, so that's fine.

## Friction
- **Wrong math, small profits:** "I made $420 on Etsy and it says I owe $59 in self-employment tax?" In `src/lib/self-employment-tax.ts` (`calculateSelfEmploymentTax`), SE tax is charged on any profit. Proposed fix (additive guard): when `netEarnings < 400`, set SS, Medicare, Additional Medicare and the half-SE deduction to 0. Add a note in `src/components/SelfEmploymentTaxCalculator.tsx`: "Net earnings under $400: no self-employment tax (Schedule SE line 4c). Income tax may still apply." Worked example: $420 × 92.35% = $387.87, which is under $400, so SE tax is $0 (the tool shows $59). Any profit up to $433.13 owes no SE tax (400 ÷ 0.9235). Sources: https://www.irs.gov/pub/irs-pdf/f1040sse.pdf (line 4c) and https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes.
- **Wrong warning, day job plus side gig:** "It says my QBI is only an upper bound. Do I need a preparer?" In `src/lib/self-employment-tax.ts`, `qbiAboveThreshold` compares gross income (`netProfit + w2Wages + otherIncome`) to the threshold. §199A tests taxable income before the QBI deduction. Separately, `QBI_THRESHOLD_2026.single` and `.hoh` are $201,775, which is Rev. Proc. 2025-32's married-filing-separately figure. Single and HOH ("all other returns") use **$201,750**. MFJ at $403,500 is correct.
  - Proposed fix (warning only; no change to the QBI dollar figure): test `afterStandard > QBI_THRESHOLD_2026[filingStatus]` and set single/hoh to 201,750.
  - Worked example: single, W-2 $180,000, profit $30,000. Taxable income before QBI = 180,000 + 30,000 − 680.77 − 16,100 = $193,219, which is below $201,750. No phase-in applies, so the warning should not show, and the $5,864 QBI deduction already displayed is the full amount.
  - Sources: Rev. Proc. 2025-32 §4.26, https://www.irs.gov/pub/irs-drop/rp-25-32.pdf, and Form 8995 instructions, https://www.irs.gov/instructions/i8995.
- **"$3,125 a quarter, but when do I pay it?"** The quarterly stat in `src/components/SelfEmploymentTaxCalculator.tsx` has no dates or rules. Proposed fix (additive note under the quarterly stat, no new math): "2026 payments are due April 15, June 15 and September 15, 2026, and January 15, 2027. You can skip estimates if you'll owe under $1,000 after withholding. Paying 100% of last year's tax (110% if your AGI was over $150,000) in four equal payments avoids the underpayment penalty." Link it to `/self-employment-tax/quarterly-estimated-tax-calculator/`. Source: https://www.irs.gov/faqs/estimated-tax and Form 1040-ES, https://www.irs.gov/forms-pubs/about-form-1040-es. The 2026 dates follow the 1040-ES schedule (Apr 15 / Jun 15 / Sep 15 / Jan 15). None falls on a weekend in 2026–27.
- **"I pay $450 a month for marketplace health insurance. Where does that go?"** The disclaimer in the same component already excludes self-employed health insurance and retirement deductions, but gives no sense of size. Proposed fix (explanation only, no new math, because the SEHI deduction also reduces QBI and the interaction isn't modelled): add a line saying "These deductions lower income tax, not self-employment tax, so the set-aside shown is on the high side if you have them." Source: https://www.irs.gov/forms-pubs/about-form-7206.
- **"What's 'Head of hh'?"** The filing-status toggle in `SelfEmploymentTaxCalculator.tsx` uses an abbreviated label. Proposed fix (additive): keep the button text and add `title="Head of household"` / `aria-label="Head of household"` to that button.

## Monetization
Verdict: fit
This is a YMYL tax tool, so picks are books only. With a set-aside rate and a quarterly figure, the freelancer's next job is running the business side properly: deductions that lower the number, bookkeeping, estimated payments and the legal basics of contracting. No `data-tool-picks` block ships today (the component doesn't import `ToolPicks`). Ranked product-type list:
1. Book: plain-English tax guide for sole proprietors and contractors (Piper, *Independent Contractor, Sole Proprietor, and LLC Taxes*)
2. Book: deductions guide that lowers the profit the rate applies to (Fishman, *Deduct It!*, Nolo)
3. Book: law-and-tax handbook for independent contractors (Fishman, *Working for Yourself*, Nolo)
4. Book: annual small-business tax reference for the 2026 return (*J.K. Lasser's Small Business Taxes 2027*, Wiley)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Full-time 1099 (no W-2 wages) | 1950967174 *Independent Contractor, Sole Proprietor, and LLC Taxes* (Piper); 141333217X *Working for Yourself* (Fishman, Nolo); 1413333052 *Deduct It!* (Fishman, Nolo) | Explains SE tax, QBI and quarterly payments for someone whose whole income is this number. Covers the contracts and records a full-time freelancer needs. Shows deductions that shrink the profit the rate applies to. |
| Side income on top of a W-2 job | 1950967174 *Independent Contractor, Sole Proprietor, and LLC Taxes* (Piper); 1413333052 *Deduct It!* (Fishman, Nolo) | Covers how side profit stacks on wages and when withholding can stand in for quarterly payments, then which side-gig costs are deductible. |
| QBI phase-in warning / high income | 1394448961 *J.K. Lasser's Small Business Taxes 2027* (Wiley); 1950967174 *Independent Contractor, Sole Proprietor, and LLC Taxes* (Piper) | The full 2026-return reference for the §199A limits and business-type rules the tool can't model, plus the plain-English overview. |

Wiring: in `src/components/SelfEmploymentTaxCalculator.tsx`, add `import ToolPicks, { book } from "./ToolPicks"` and render below the disclaimer. Choose the tier from `input.w2Wages > 0` and `result.qbiAboveThreshold`. Heading: "Further reading on self-employment taxes". Add `piperContractorTaxes` (1950967174) and `lasserSmallBiz2027` (1394448961) to `BOOKS` in `src/components/ToolPicks.tsx`. `workingForYourself` and `deductIt` are already in the catalog. All ASINs were reconfirmed with `amazon_pick.py --index Books` on 2026-11-04. Because the component is shared, picks also appear on the quarterly and gig spokes, where the same books fit.
