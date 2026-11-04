# inflation-calculator — /inflation-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent comes from the title "Inflation Calculator: Future Cost and Buying Power", the H1 "Inflation Calculator", and the intro "shows what an amount of money will cost or buy in the future at an average annual inflation rate you choose."
- STEP 1 numbers (data_days = 27, early): people 21, uses 23, views 51, use_rate 0.451, people_7d 1. Use was steady earlier in the window and has nearly stopped this week.
- Page FAQ includes "Does this calculator use historical CPI data?" (it does not). It is a forward projection only.

## Persona
- Who/where: a 46-year-old on the phone on the couch at night, planning to retire in about 20 years. The household spends about $65,000 a year today, and $40,000 sits in a savings account earning nothing.
- Job: "What will my $65,000 lifestyle cost when I retire, and how much is my cash losing to inflation?"
- Done = one future-cost number to plug into a retirement plan, plus a sense of what a 4–5% return does to it.

## Walkthrough
Desktop 1366px (`screenshots/inflation-calculator-desktop.png`):
1. Page returns 200, network idle in ~1.9s, no console errors. The `data-tool` root is 565px down, so it is visible on the first screen. Four fields: amount ($), years, average annual inflation (%), and annual return (optional, %). The hint says 3% is "a placeholder, not a forecast".
2. Entered 65,000, 20 years, 3%, return blank. Result: "Cost later of what $65,000 buys today $117,397, after 20.0 years at 3.0% a year". $65,000 buys $35,989 in today's dollars, buying power lost 44.6%, halves in 23.4 years, real return −2.91%.
   Hand check: 1.03^20 = 1.806111 → $117,397. 65,000 / 1.806111 = $35,989. ln 2 / ln 1.03 = 23.45. 1/1.03 − 1 = −2.91%. All correct.
3. Entered 500,000, 25 years, 2.5% inflation, 4.5% return → $926,972 future cost, ending $1,502,717, $810,552 in today's dollars, real return 1.95%. Hand check: 1.025^25 = 1.853944, 1.045^25 = 3.005434, 1.045/1.025 − 1 = 1.951%. All correct.
4. Edge cases: 0.5 years works ($10,149). 0% → "—" for the halving time (correct). A return equal to inflation gives a 0.00% real return (correct).
5. As the persona, testing a deflation scenario, I typed "−1" for inflation. The tool silently showed "after 10.0 years at 1.0% a year" and $11,046. The minus sign was dropped, so I got the opposite of what I asked without any warning.
6. "Which rate do I type?" The only guidance is "3% is a placeholder". There is no anchor to the Fed's 2% target or to the BLS CPI figure I could look up.
7. I want to see the cost at 5, 10 and 15 years too, for my plan, but there is only a single endpoint and no way to copy or keep it.
8. "What was $100 in 1995 worth today?" This calculator can't answer it, and the FAQ confirms it.
9. No horizontal scroll (1366 = 1366). The tool has no buttons or links.

Phone 390px (`screenshots/inflation-calculator-mobile.png`):
1. Loads in ~1.8s with no console errors. The tool root is 1,087px down, so on an 844px screen the visitor scrolls past two intro paragraphs before seeing any input.
2. Inputs: amount and return are 316×40px. Years and inflation sit side by side at 152×40px. All have 16px font (no iOS zoom) and the decimal keypad.
3. Same results as desktop. No horizontal scroll (390 = 390).

## Friction
- "I typed minus 1 to test deflation and it showed 1% inflation." The shared `useDraft` in `src/components/calc-ui.tsx` strips "-" (`replace(/[^0-9.]/g, "")`, then `Math.max(0, n)`), so a negative rate becomes a positive one with no warning. → tool fix (additive, scoped to `src/components/InflationCalculator.tsx`, leaving the shared helper alone): one line in the input hint, "Rates below 0% (deflation) aren't supported; a minus sign is ignored." No math change.
- "What rate should I put in? 3% is 'a placeholder'." → tool fix (additive) in `InflationCalculator.tsx`: preset chips under the inflation field ("2% — the Federal Reserve's long-run target", "3%", "4%") that fill the field. Add a link to the BLS CPI page for the latest 12-month figure. Do not hardcode a current CPI number. Sources: https://www.federalreserve.gov/faqs/economy_14400.htm, https://www.bls.gov/cpi/. The inputs and the 3% default stay.
- "I need the cost at 5, 10 and 15 years for my plan, and a way to keep it." → tool fix (additive) in `InflationCalculator.tsx`: a collapsed "Show year-by-year" table using the engine's existing formula `amount × (1 + i)^t` for each whole year t (future cost, buying power, and the balance at the return), plus a "Copy table" button. Worked example: $65,000 at 3% gives $75,353 at year 5 (1.03^5 = 1.159274), $87,355 at year 10 (1.343916) and $101,268 at year 15 (1.557967). No new math.
- On phone the calculator starts below the first screen (1,087px), which may explain people_7d = 1. → page fix (additive): a "Jump to the calculator" anchor link under the first intro paragraph pointing at the existing tool section. The `data-tool` root, H1 and intro text stay.
- "What was $100 in 1995 worth today?" There is no historical mode. This is a separate job, best served by a new page (see next jobs) and cross-linked from this tool's hint. No change to this engine.

## Monetization
Verdict: fit
YMYL (money) → books only. Once they see that cash loses ~45% of its buying power over 20 years, or that their return barely beats inflation, the next step is to learn how to invest money to outpace inflation and how to plan retirement income that rises with prices. Every ASIN below was returned by `amazon_pick.py --index Books` for the exact title and author, and all are already pinned in `BOOKS` in `src/components/ToolPicks.tsx`. Heading: "Further reading on beating inflation".
Ranked product-type list:
1. Book: investing primer for growing money faster than inflation (low-cost index funds)
2. Book: retirement-income planning with inflation risk (making a fixed sum last while prices rise)
3. Book: portfolio and asset-allocation text on real (after-inflation) returns

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Return blank or 0 (cash losing buying power) | 1119847672 *The Bogleheads' Guide to Investing* (Larimore, Lindauer, LeBoeuf; Wiley); 1982115831 *How to Make Your Money Last* (Jane Bryant Quinn; Simon & Schuster) | How to move idle cash into low-cost investments that can outpace the inflation rate you entered; then how to make savings last as prices rise |
| Return entered, real return below 0% | 1264715919 *The Four Pillars of Investing, 2nd ed.* (William Bernstein; McGraw-Hill); 1119847672 *The Bogleheads' Guide to Investing* | Why the return you entered loses to inflation, and how asset allocation changes the real return |
| Real return 0% or above, years ≥ 10 (long-horizon planning) | 1945640154 *Retirement Planning Guidebook* (Wade Pfau; Retirement Researcher Media); 1982115831 *How to Make Your Money Last* (Quinn) | Turning the future-cost number into a retirement-income plan that handles inflation risk |
| Real return 0% or above, years < 10 | 1264715919 *The Four Pillars of Investing, 2nd ed.* (Bernstein); 1945640154 *Retirement Planning Guidebook* (Pfau) | Keeping a short-horizon plan ahead of prices without taking on more risk than needed |

Placement: a `<ToolPicks tool="inflation-calculator" ...>` inside the results panel of `src/components/InflationCalculator.tsx`, below the disclaimer, using `book(...)` from `src/components/ToolPicks.tsx`. This follows the same pattern as `SocialSecurityColaCalculator.tsx`.
