# Row — 60-40-vs-90-10-portfolio

route: /compare/60-40-vs-90-10-portfolio/
slug: 60-40-vs-90-10-portfolio
page type: comparison
medium: text -> text
register: operator
depth floor: 1,500 body words
primary keyword: 60/40 vs 90/10 portfolio
secondary keywords: 60 40 vs 90 10 portfolio, 90/10 portfolio vs 60/40, aggressive portfolio vs balanced portfolio
intent: a reader deciding between the classic balanced 60/40 stock-bond split and the far more
aggressive 90/10 split — same-model comparison of return, risk, and 30-year growth.

reader question: "What's the difference between a 60/40 portfolio and a 90/10 portfolio?"
[verb-only — no PAA, no completions; grounded in repeated Google Autocomplete demand: "90 10 vs 60 40 portfolio" surfaced independently in both the 2026-08-20 and 2026-09-23 GA4-top-pages autocomplete pulls on this site's own "60/40 portfolio calculator" and "90/10 portfolio calculator" head terms]
answer: State both mixes' modeled expected return, volatility, Sharpe ratio, and 30-year growth
on $100,000 side by side, then say which time horizon / risk tolerance each fits.
answer placement: section 1 ("Where these numbers actually come from") + the comparison table
and verdict above it — this is a "which" question, so the pick and the numbers come immediately,
not after scope/definition material.

optionAName: 60/40 Portfolio
optionBName: 90/10 Portfolio

## THE CLOSED FACT LIST — the only numbers this page may state

Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say
it is unpublished and tell the reader to verify at the vendor/regulator page. All figures below
were independently computed against this site's own `src/lib/portfolio.ts` engine (stocks
modeled at 10% expected return / 16% volatility; bonds at 4% / 5%; correlation 0.1; risk-free
rate 2.5%; formula: portfolio variance = ΣΣ w_i·w_j·σ_i·σ_j·ρ_ij, Sharpe = (return − risk-free) /
volatility, 30-year compounding with no added contributions) and cross-checked against this
site's own already-published figures on its sibling pages (they match exactly):

- 60/40 portfolio (60% stocks / 40% bonds): expected return 7.60%, volatility 10.00%, Sharpe
  ratio 0.51. $100,000 over 30 years with no added contributions grows to ≈$900,260 in the model.
  (These exact figures are already published on this site's own
  `/compare/70-30-vs-60-40-portfolio/` page and its `/portfolio/60-40-portfolio-calculator/`
  page — reuse them verbatim, do not recompute a different figure.)
- 90/10 portfolio (90% stocks / 10% bonds): expected return 9.40%, volatility 14.46%, Sharpe
  ratio 0.48. $100,000 over 30 years with no added contributions grows to ≈$1,480,879 in the
  model. (Already published on this site's own `/portfolio/90-10-portfolio-calculator/` page and
  its own `/compare/80-20-vs-90-10-portfolio/` page — reuse verbatim.)
- Difference in 30-year modeled balance: ≈$580,619 more in the 90/10 mix on the same $100,000
  starting balance, no added contributions.
- Difference in expected return: 1.80 percentage points (9.40% − 7.60%).
- Difference in volatility: 4.46 percentage points (14.46% − 10.00%).
- Sharpe ratio: 60/40's 0.51 is HIGHER than 90/10's 0.48 — 60/40 is the more risk-efficient mix
  in this model, even though 90/10 wins on raw expected return. State this plainly; do not let
  the higher raw return read as an unqualified "90/10 wins."
- Likely 1-year range on $100,000, model ±1 standard deviation (compute directly from the two
  volatility figures above, formula = total × (1 + expected_return ± volatility), do not invent
  a different formula):
  - 60/40: $100,000 × (1 + 0.076 + 0.10) = $117,600 best case; $100,000 × (1 + 0.076 − 0.10) =
    $97,600 worst case.
  - 90/10: $100,000 × (1 + 0.094 + 0.1446) = $123,860 best case; $100,000 × (1 + 0.094 − 0.1446)
    = $94,940 worst case.
- Risk-free rate used in the Sharpe calculation: 2.5% (SEC/FINRA long-run asset-class framing,
  same assumption already disclosed on every sibling portfolio page on this site).
- These are long-run MODEL ESTIMATES built on historical long-run asset-class assumptions, not
  guarantees of future performance. Say this explicitly; do not present any of the above as a
  promised return.
- This site already has three related comparison pages using the exact same model:
  `/compare/70-30-vs-60-40-portfolio/`, `/compare/80-20-vs-90-10-portfolio/`, and
  `/compare/70-30-vs-80-20-portfolio/`. You may reference that this comparison completes the
  same family, but do not restate their specific figures (only 60/40's and 90/10's numbers
  above belong on THIS page).
- Do NOT state a specific "best for" age, dollar amount, or family situation beyond time horizon
  and risk tolerance — those are the only two levers this site's model actually varies by.

## THE CLOSED URL LIST — the only external hrefs this page may use

- https://www.investor.gov/introduction-investing/getting-started/asset-allocation — SEC
  Investor.gov, Asset Allocation (use for the "where the model assumptions come from" claim)
- https://www.finra.org/investors/investing/investing-basics/asset-allocation-diversification —
  FINRA, Asset Allocation and Diversification

## Internal links this page may use (real routes only, all already live on this site)

- /portfolio/60-40-portfolio-calculator/ — 60/40 portfolio calculator
- /portfolio/90-10-portfolio-calculator/ — 90/10 portfolio calculator
- /portfolio/asset-allocation-calculator/ — asset allocation calculator (test any split)
- /compare/70-30-vs-60-40-portfolio/ — sibling comparison (mention once, do not restate its figures)
- /compare/80-20-vs-90-10-portfolio/ — sibling comparison (mention once, do not restate its figures)
- /portfolio/portfolio-risk-calculator/ — portfolio risk calculator

## What to cover, section by section

1. **Where these numbers actually come from** — state the two mixes' full model figures side by
   side (return, volatility, Sharpe, 30-year growth) and name the shared modeling assumptions
   (stocks 10%/16%, bonds 4%/5%) and their source.
2. **60/40 wins on risk-adjusted return; 90/10 wins on raw growth** — this is the genuine,
   non-obvious tension on this specific pairing (unlike the 70-30-vs-80-20 and 80-20-vs-90-10
   pages, which are adjacent mixes with small gaps, 60/40 and 90/10 are the two ends of this
   site's whole aggressive-to-balanced spectrum, so the gap is large in both directions at once).
   Show the dollar gap ($580,619) AND the Sharpe-ratio inversion (0.51 vs 0.48) as two different,
   sometimes-conflicting ways to read "which is better."
3. **How to decide between them** — time horizon and risk tolerance are the only two levers;
   name a condition under which each choice is correct and a condition under which it is wrong
   (required page element: "who this is not for" / "what would change our answer").

## FAQ questions (write real answers grounded only in the closed fact list above)

- "Is 90/10 too aggressive if I already run 60/40?"
- "How much more does a 90/10 portfolio grow than 60/40 over 30 years?"
- "Which has the better risk-adjusted return, 60/40 or 90/10?"
- "What's the difference in risk between a 60/40 and a 90/10 portfolio?"
- "Is there a middle ground between 60/40 and 90/10?" (answer: yes — name 70/30 and 80/20 as the
  two intermediate splits this site's calculators cover, and link the asset allocation calculator
  to test a custom split; do not invent a numeric split between them)

## Objectivity requirement (per the output contract)

Neither option is the automatic winner. At least one comparisonTable row must favor 60/40 (its
Sharpe ratio, its narrower 1-year range) and at least one must favor 90/10 (its raw return, its
30-year balance). The verdict names the time-horizon/risk-tolerance condition that decides it —
never a blanket "90/10 is better because it returns more."
