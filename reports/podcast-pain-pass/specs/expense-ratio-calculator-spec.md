# Asset spec — Expense Ratio Calculator

**Status:** spec only. A human builds the tool.
**Source:** podcast-pain-pass run 2026-08-03, chart row 21.

## Demand
| term | volume/mo | KD |
|---|---|---|
| `expense ratio calculator` | 1,600 | 15 |

Second-lowest KD in the run. Autocomplete adds `expense ratio cost calculator`,
`expense ratio difference calculator`, `expense ratio comparison calculator`,
`expense ratio effect on returns calculator`, `expense ratio etf calculator`.

## Podcast hook
"So, you have to judge yourself, are the advisors or the expense ratios worth it?" — Suze Orman's
Women & Money, week of 2026-08-03. The listener is asked to judge a number nobody converts into
dollars for them.

## Route
`/investing/expense-ratio-calculator/` — new spoke in `src/data/spokes-investing.ts` under the
live `investing` hub.

## Inputs
- Starting balance
- Monthly or annual contribution
- Years invested
- Expected gross annual return
- **Fund A expense ratio and Fund B expense ratio** (side-by-side is the point of the tool)
- Advisory fee, if any (a separate layer on top of the fund fee)
- Sales load, if any (front-end percentage taken off the top before anything compounds)

## Outputs
1. **Ending balance under each fee** and the **dollar gap** between them.
2. **Total fees paid** over the period, separated into fund expenses, advisory fee, and load.
3. **Lost compounding** — the gap minus the raw fees, i.e. what the fees would have earned had
   they stayed invested. This is the part that makes the number land and most competitor
   calculators omit it.
4. **All-in annual cost** as a single percentage: fund expense ratio + advisory fee.
5. Optional **break-even view** — how much extra gross return the pricier fund must earn to match
   the cheaper one.

## Dependencies
- Compounding math can reuse `computeInvestment` in `src/lib/investment.ts`; check whether it
  supports a fee-drag parameter or needs one added.
- No tax tables required.
- Every rendered figure must come from the engine, per `CONTENT.md`.

## Correction to note when building
The expense ratio **includes** 12b-1 fees — the SEC fee table places them inside Total Annual Fund
Operating Expenses alongside management fees and other expenses. Sales loads, trading costs,
brokerage commissions and advisory fees sit **outside** it. Model those as separate layers; do not
double-count 12b-1.

## Primary sources
- SEC mutual fund and ETF fees investor bulletin: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/mutual-fund-and-etf-fees-and-expenses-investor-bulletin
- SEC/FINRA mutual fund fees primer (load caps, 12b-1 caps, redemption fee limit): https://www.sec.gov/files/ib_mutualfundfees.pdf
- DOL, A Look at 401(k) Plan Fees: https://www.dol.gov/sites/dolgov/files/ebsa/about-ebsa/our-activities/resource-center/publications/a-look-at-401k-plan-fees.pdf
  (both DOL URLs return 403 to automated clients but load normally in a browser)

## Related pages shipped this run
`/guides/what-is-a-good-expense-ratio/` — the benchmark-by-fund-type page. Link the tool from it
once built; the guide deliberately does not rebuild the compounding math.
