# stock-capital-gains-tax-calculator — /stock-capital-gains-tax-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent is read from the title "Stock Capital Gains Tax Calculator for 2026 Stock Sales" and the H1 "Stock Capital Gains Tax Calculator". The tool takes filing status, taxable income before the sale, cost basis, sale proceeds and holding period, then returns the federal tax on the sale, with NIIT, the share of the gain paid as tax, and room left in the 0% bracket.
- STEP 1 numbers (data_days = 27, early): people 19, uses 20, views 36, use_rate 0.556, people_7d 19. All 19 people came in the last 7 days, so this is a new or newly surfaced tool with the highest use rate of the three.

## Persona
- Who/where: a 38-year-old single QA engineer selling index-fund shares from a brokerage account to cover a home down payment. The brokerage's realized-gain screen is open on the phone, and they check the result again on the laptop. Basis $18,000, sale $41,500, held 3 years, about $72,000 of taxable income.
- Job: "How much federal tax will this sale cost me, and would waiting or splitting it across years save anything?"
- Done = a dollar figure to set aside from the proceeds, and a clear yes or no on whether timing matters.

## Walkthrough
Desktop 1366px (`screenshots/stock-capital-gains-tax-calculator-desktop.png`):
1. The page loads in about 2.0s with no console errors. The `data-tool` root starts 534px down. Defaults (single, $85k, $30k → $50k, long) give $3,000, which is correct: 15% × 20,000.
2. Persona: single, TI 72,000, basis 18,000, proceeds 41,500, long-term → **$3,525**, "$0 at 0%, $23,500 at 15%", NIIT $0, 15.0%, proceeds after tax $37,975.
   - Hand check against Rev. Proc. 2025-32: the 0% band for single filers ends at $49,450. TI 72,000 is already past it, and 72,000 + 23,500 = 95,500 is below $545,500, so the whole gain is taxed at 15%: 15% × 23,500 = $3,525. Correct.
   - NIIT: MAGI ≈ 72,000 + 16,100 + 23,500 = 111,600, under $200,000, so $0. Correct.
3. Same sale, short-term → $5,170 at 22%. Hand check: 72,000 to 95,500 sits inside the 22% bracket (50,400–105,700), so 22% × 23,500 = $5,170. Correct. The 15% vs 22% gap ($1,645) answers "does waiting matter", and the tool shows both.
4. Low-income check: TI 30,000 with a 25,000 gain → $833, split as $19,450 at 0% and $5,550 at 15%. Correct.
5. High-income check: TI 220,000 with a 50,000 gain → $7,500 + NIIT $1,900. Hand check: MAGI 286,100 − 200,000 = 86,100, so NIIT is 3.8% × min(50,000, 86,100) = $1,900. Correct.
6. Loss check (basis 41,500, proceeds 18,000): "$0 … can offset up to $3,000 of other income … excess carries forward". The stats read "Capital loss $23,500", "Share of the gain paid as tax 0.0%", "Room left in the 0% bracket $0". As the persona: "So what is the loss worth to me this year, and how much carries over?" The tool doesn't say.
7. No horizontal scroll (1366 = 1366).

Phone 390px (`screenshots/stock-capital-gains-tax-calculator-mobile.png`):
1. The page loads in about 3.1s with no console errors and no horizontal scroll (390 = 390). Selects and inputs are full width and ≥32px tall.
2. MFJ scenario: TI 80,000, basis 12,000, proceeds 42,000, long → $1,665: "$18,900 at 0%, $11,100 at 15%". Hand check: 98,900 − 80,000 = 18,900 at 0%, and 11,100 × 15% = $1,665. Correct.
3. Below that, the result says **"Room left in the 0% bracket: $18,900"**. That figure is the room *before* this sale, and the sale has just used all of it (`zeroRoom` = 0% top − taxable income). The persona reads it as "I can still sell another $18,900 of gains tax-free this year", which is wrong. After this sale the room is $0.
4. The persona's own numbers give the same $3,525 as on desktop.

## Friction
- **"It says I still have $18,900 of 0% room. Can I sell more tax-free?"** In `src/components/StockCapitalGainsCalculator.tsx` (stat at line ~75), the 0% room comes from `zeroRoom` in `src/lib/stock-capital-gains.ts` and is measured before the sale. Proposed fix, additive with no math change to the tax: keep the stat and add a sub-line, "Before this sale. This sale uses $X; $Y left after it." Here X = `r.at0` and Y = max(0, zeroRoom − gain) for a long-term gain. Worked example: MFJ, TI $80,000, LT gain $30,000. Room before is 98,900 − 80,000 = $18,900. The sale uses $18,900 at 0% and leaves $0 after it. Source: Rev. Proc. 2025-32 (2026 0% band to $98,900 MFJ / $49,450 single), https://www.irs.gov/pub/irs-drop/rp-25-32.pdf.
- **"I lost $23,500. What is that worth this year?"** In `src/components/StockCapitalGainsCalculator.tsx`, the loss verdict states the $3,000 rule but gives no numbers. Proposed fix, additive, shown only when `r.isLoss`, and assuming this is the only capital transaction (same assumption the tool already makes): add two stats.
  - "Deductible against other income this year" = min(loss, 3,000; 1,500 MFS), with an approximate saving at the bracket of the entered taxable income (the lib already has `marginalRate`).
  - "Carried forward to 2027" = loss − that amount.
  - Worked example: single, TI $72,000, loss $23,500. $3,000 is deductible, and 72,000 − 3,000 = 69,000 is still in the 22% bracket, so the saving is about $660. Carried forward: $20,500.
  - Source: IRS Topic 409, https://www.irs.gov/taxtopics/tc409, and Schedule D instructions.
- **"Is 'more than one year' 365 days from when I bought?"** The holding-period select in `StockCapitalGainsCalculator.tsx` has no hint. Proposed fix, an explanation only: "Long-term means held more than one year. Count from the day after you bought, so shares bought March 10, 2025 become long-term if sold on or after March 11, 2026." Source: IRS Pub 550 (holding period), https://www.irs.gov/publications/p550.
- **"I don't know my 'taxable income', only my salary."** The field hint in the same component says "after the standard or itemized deduction" but gives no figure. Proposed fix, additive copy with no math: show the status's 2026 standard deduction in the hint, for example "Salary minus $16,100 if single and you don't itemize ($32,200 joint, $24,150 head of household)". Source: Rev. Proc. 2025-32 §4.14.

## Monetization
Verdict: fit
This is YMYL investing tax, so books only. With the tax on this sale known, the persona's next step is understanding how investment taxes work, so they can time sales, harvest losses and keep more of the next sale. No `data-tool-picks` block ships today (the component does not import `ToolPicks`). Ranked product-type list:
1. Book: plain-English income-tax primer covering capital gains, loss limits and the 0% band (Piper, *Taxes Made Simple*)
2. Book: tax-efficient long-term investing (*The Bogleheads' Guide to Investing*, Wiley)
3. Book: annual tax-year reference for the 2026 return, Schedule D and Form 8960 (*J.K. Lasser's Your Income Tax 2027*)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Long-term gain, 0%/15% | 1950967204 *Taxes Made Simple* (Piper); 1119847672 *The Bogleheads' Guide to Investing* | Explains why part of the gain was taxed at 0% and how to use that band on purpose. Covers tax-efficient fund placement for the next sale. |
| Short-term gain | 1950967204 *Taxes Made Simple* (Piper); 1119847672 *The Bogleheads' Guide to Investing* | Why the same gain cost more at ordinary rates. Buy-and-hold habits that turn future gains into long-term ones. |
| NIIT applies / 20% band | 1394461577 *J.K. Lasser's Your Income Tax 2027*; 1950967204 *Taxes Made Simple* (Piper) | The full reference for Form 8960 and the 20% band at this income. Plain-English overview alongside it. |
| Loss | 1950967204 *Taxes Made Simple* (Piper); 1119847672 *The Bogleheads' Guide to Investing* | How the $3,000 limit and carryforward work. Staying invested through a loss and harvesting without a wash sale. |

Wiring: in `src/components/StockCapitalGainsCalculator.tsx`, add `import ToolPicks, { book } from "./ToolPicks"` and render it in the results column below the disclaimer. Pick the tier from `r.isLoss`, `v.longTerm` and NIIT > 0 / `at20 > 0`. Heading: "Further reading on taxes when you sell investments". Add `taxesMadeSimple` (1950967204) to `BOOKS` in `src/components/ToolPicks.tsx`; `bogleheads` and `lasser2027` are already in the catalog. All ASINs were reconfirmed with `amazon_pick.py --index Books` on 2026-11-04.
