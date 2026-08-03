# Asset spec — Dividend Yield Calculator

**Status:** spec only. A human builds the tool.
**Source:** podcast-pain-pass run 2026-08-03, chart row 19.

## Demand
| term | volume/mo | KD |
|---|---|---|
| `dividend yield calculator` | 2,400 | 32 |

## Why this is NOT already covered
`/investing/dividend-calculator/` exists but targets `dividend reinvestment calculator` — it is a
DRIP future-balance engine (contributions + reinvestment + time → ending balance). The yield
calculator has a different input/output contract: price and payout in, yield and required
capital out. The dedup reviewer confirmed the distinction.

## Podcast hook
"And so, if you do the math, that will give you the dividend yield." / "in the first year you
would have received $522 in dividends." — the dividend shows narrate this arithmetic verbally
across whole episodes and never give the listener a place to enter their own numbers.

## Route
`/investing/dividend-yield-calculator/` — new spoke in `src/data/spokes-investing.ts` under the
live `investing` hub.

## Inputs
- Share price
- Dividend per share, with a period selector (quarterly / monthly / annual)
- Shares owned (optional)
- **Income target** (optional, the reverse mode — the question listeners actually ask)
- Expected annual dividend growth rate (optional)
- Account type: taxable / tax-advantaged (drives the after-tax view)
- Marginal rate + qualified-vs-ordinary toggle (taxable only)

## Outputs
1. **Dividend yield** = annual dividends per share / share price.
2. **Annual, quarterly and monthly income** at the entered share count.
3. **Reverse mode: capital required** for a target income = target / yield. Show it prominently —
   this is the highest-intent output.
4. **Yield on cost** if the user enters an original purchase price.
5. **After-tax income** in a taxable account, split by qualified vs ordinary treatment.
6. **Warning:** yield rises when price falls. Show the implied price change whenever the entered
   yield is unusually high, so the tool teaches the trap rather than hiding it.

## Dependencies
- No new tax tables needed for the basic yield math.
- Qualified-dividend rates (0/15/20%) if the after-tax view is built.
- Reuse `src/lib/format.ts` for currency/percent formatting.

## Primary sources
- IRS Pub 550 (qualified vs ordinary dividends, holding period, REIT treatment): https://www.irs.gov/publications/p550
- SEC investor.gov on ex-dividend price behavior: https://www.investor.gov/introduction-investing/investing-basics/glossary/ex-dividend-dates-when-are-you-entitled-stock-and

## Related pages shipped this run
`/guides/how-to-build-a-dividend-portfolio/` (teaches this exact arithmetic with illustrative
numbers), `/roundup/best-dividend-etfs/`, `/roundup/best-dividend-etfs-for-retirement/`,
`/roundup/best-monthly-dividend-etfs/`. Cross-link the tool from all four once built.
