# social-security-taxable-benefits-calculator — /social-security-taxable-benefits-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from the title "Social Security Taxable Benefits Calculator 2026" and the H1 "Social Security Taxable Benefits Calculator". The tool asks for filing status, the year's benefits (SSA-1099 box 5), all other income and tax-exempt interest, and returns the taxable part of the benefits (IRS Pub 915, Worksheet 1).
- STEP 1 numbers (data_days = 27, early): people 46, uses 51, views 109, use_rate 0.468, people_7d 17.

## Persona
- Who/where: a 68-year-old retired couple at the desk with this year's SSA-1099s ($38,400 combined), a pension 1099-R ($18,000) and planned IRA withdrawals ($24,000), plus $1,200 of muni-bond interest. Laptop first, then the phone at the kitchen table.
- Job: "How much of our Social Security will be taxed this year, and should we start having tax withheld from it?"
- Done = a taxable-benefits number they trust and the next step: roughly what tax that adds and what to put on Form W-4V.

## Walkthrough
Desktop 1366px (`screenshots/social-security-taxable-benefits-calculator-desktop.png`):
1. Page loads in about 1.7 to 3.1s with no console errors. The `data-tool` root starts 502px down, and the inputs show above the fold. Prefilled values are MFJ, $42,000 benefits and $30,000 other income, giving $11,950. Hand check: PI = 30,000 + 21,000 = 51,000, then 0.85 × 7,000 + min(6,000, 21,000) = $11,950. Correct.
2. Persona inputs: MFJ, benefits 38,400, other income 42,000, tax-exempt 1,200. The tool shows "$21,640, provisional income $62,400, 56.4% taxable, $16,760 not taxed". Hand check per Pub 915 Worksheet 1: PI = 42,000 + 1,200 + 19,200 = 62,400. Line 17 gives 0.85 × (62,400 − 44,000) + min(6,000, 19,200) = 15,640 + 6,000 = 21,640. The cap is 0.85 × 38,400 = 32,640, so the answer is **$21,640**. Correct.
3. Single, 24,000 / 20,000: PI 32,000 sits between $25k and $34k, and the tool shows $3,500 = min(0.5 × 7,000, 12,000). Correct. Single, 18,000 / 8,000: PI 17,000, tool shows $0. Correct.
4. MFS-lived-together, 20,000 / 10,000: the tool shows $17,000 (= 0.85 × 20,000, which is right because the base is $0). The sentence under it reads "Your provisional income is above $0, so up to 85%…", which sounds like a glitch.
5. As the persona: "OK, $21,640 is taxable. What does that cost us, and how much should we withhold?" The disclaimer says the tool "does not compute that tax". The page never mentions Form W-4V (the 7/10/12/22% voluntary withholding form), so the job stops one step short.
6. "All other income" lists "pensions, IRA withdrawals". The persona also takes $5,000 a year from a Roth IRA and adds it, which overstates PI by $5,000. Nothing on the page says to use only the taxable amount (1099-R box 2a) and to leave out qualified Roth withdrawals.
7. No horizontal scroll (scrollWidth 1366 = innerWidth), and every control is at least 32px tall.

Phone 390px (`screenshots/social-security-taxable-benefits-calculator-mobile.png`):
1. Loads in about 1.9s with no console errors. scrollWidth 390 = innerWidth, so there is no horizontal scroll. The status select and the three money inputs stack full width.
2. Single, 26,400 / 21,000: the tool shows $4,670, PI $34,200. Hand check: 0.85 × 200 + min(4,500, 13,200) = $4,670. Correct.
3. Re-entered the persona's MFJ numbers and got the same $21,640. The long select label ("Single, head of household, or married filing separately (lived apart all year)") is truncated in the closed select on the phone but readable when opened.

## Friction
- "It says 'above $0', is that a bug?" In `src/components/SocialSecurityTaxableCalculator.tsx`, the `tierText` for `mfs-together` prints the generic "above $0" sentence. Proposed fix (additive copy branch, no math change): when `v.status === "mfs-together"`, say "Married filing separately and living with your spouse at any time in the year, the base amount is $0, so up to 85% of your benefits are taxable from the first dollar (IRS Pub 915)." Source: https://www.irs.gov/publications/p915.
- "We put our Roth withdrawals in 'other income'. Should we have?" In the same component, the "All other income" field has no hint about which amounts count. Proposed fix (additive hint under the field): "Use the taxable amounts only: Form 1099-R box 2a, not 1a. Leave out qualified Roth IRA withdrawals and the tax-free part of a pension." No math change. Worked example: with a $5,000 Roth withdrawal wrongly included, the persona's PI goes from 62,400 to 67,400 and taxable benefits rise by 0.85 × 5,000 = $4,250, from $21,640 to $25,890. That overstates their taxable benefits by $4,250. Source: Pub 915 Worksheet 1 line 3 ("adjusted gross income" items), https://www.irs.gov/publications/p915.
- "Now what does this cost us, and what do we withhold?" The result stops at the taxable amount. Proposed fix in `SocialSecurityTaxableCalculator.tsx`, additive and an explanation only, no new tax math: add a short note under the result. "This taxable amount is added to your other taxable income. To have tax taken out of your benefit, file Form W-4V and choose 7%, 10%, 12% or 22% of each payment. Your bracket is in our tax bracket calculator." Link to /tax-bracket-calculator/ and to /guides/senior-deduction-social-security/ (the 2025–2028 $6,000 deduction for people 65+ lowers the tax but not the taxable-benefits figure). Source: https://www.irs.gov/forms-pubs/about-form-w-4-v. A computed tax/withholding figure is better built as the separate next tool (see next jobs) than bolted onto the Worksheet 1 tool.

## Monetization
Verdict: fit
YMYL (Social Security tax), so books only. With their taxable-benefits number in hand, the persona's next step is understanding how retirement income is taxed and how to arrange withdrawals so less of their Social Security gets taxed. No `data-tool-picks` block ships today (the component does not import `ToolPicks`). Ranked product-type list:
1. Book: plain-English income-tax primer that covers how Social Security is taxed (Piper, *Taxes Made Simple*)
2. Book: Social Security claiming and taxation guide (Piper, *Social Security Made Simple*; Kotlikoff/Moeller/Solman, *Get What's Yours*)
3. Book: retirement-income/withdrawal planning (Pfau, *Retirement Planning Guidebook*)
4. Book: annual tax-year reference for preparing the 2026 return (*J.K. Lasser's Your Income Tax 2027*)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Up to 85% taxable (PI above the upper amount) | 1945640154 *Retirement Planning Guidebook* (Pfau); 1950967204 *Taxes Made Simple* (Piper); 1394461577 *J.K. Lasser's Your Income Tax 2027* | Ordering IRA, Roth and taxable withdrawals so less of your benefit is taxed. How the taxable part is taxed at your rates. The full 2026-return reference. |
| Up to 50% taxable (between the two amounts) | 1950967204 *Taxes Made Simple* (Piper); 1950967190 *Social Security Made Simple* (Piper); 1945640154 *Retirement Planning Guidebook* (Pfau) | Explains provisional income and the 50% tier. How claiming and spousal rules interact with tax. How to keep income under the next threshold. |
| None taxable | 1950967190 *Social Security Made Simple* (Piper); 1501144766 *Get What's Yours* (revised, Kotlikoff/Moeller/Solman) | No tax to plan for, so the next question is whether you're collecting every benefit you're owed. |

Wiring: `import ToolPicks, { book } from "./ToolPicks"` in `src/components/SocialSecurityTaxableCalculator.tsx`. Render it in the results column after the disclaimer, picking the tier from `r.tier`. Heading: "Further reading on how your Social Security is taxed". Add a `taxesMadeSimple` entry (1950967204) to `BOOKS` in `src/components/ToolPicks.tsx`. The other books are already in the catalog: `pfauGuidebook`, `ssMadeSimple`, `getWhatsYours`, `lasser2027`. All ASINs were confirmed via `amazon_pick.py --index Books` on 2026-11-04.
