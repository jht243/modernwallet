---
source: podcast transcripts (podcast-pain-pass), SEMRUSH-validated (SEMrush 403 this run — ladder auto-demoted to DataForSEO per keyword-demand-ladder; volumes labeled dataforseo, not estimates)
interpreted_brief: >
  This week's episodes (Ready For Retirement, How to Money, Suze Orman's Women & Money,
  The Better Budgeting Podcast, Catching Up to FI, Rental Income Podcast) skew heavily
  toward retirement-readiness anxiety, budgeting fundamentals, and small-scale rental
  investing. Three mandatory lenses ran on the mined pain: direct-intent validation (22
  terms cleared the 70/mo floor), adjacent-demand mining via Autocomplete + DataForSEO
  across the top 10 seeds, and comparison/alternatives mining across the named entities
  (HSA, 401k, Roth IRA, inherited IRA, Social Security, pensions, Airbnb, rental property).
  An independent adversarial dedup reviewer checked all 28 candidate rows this produced
  against the site's existing calculator spokes, comparison pages, and guides (all read
  in full, not title-grep) plus the shipped_slugs ledger. 27 of 28 were already covered
  by existing content that directly answers the reader's question. Exactly one genuine
  gap survived: Social Security survivor benefits for a widow(er) or minor/dependent
  child — distinct in intent from the site's existing spousal-benefit and divorced-spouse
  coverage, which is scoped to married-couple claiming coordination.
status: ready-for-execution
---

# Podcast Pain Pass — Chart — 2026-08-25

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable |
|---|---|---|---|---|---|---|
| Lens 1+2 cluster: "social security survivor benefits" (27,100/mo, KD17, dataforseo) + "...for widow" (8,100/mo, KD20) + "...for child" (est. band, autocomplete-corroborated) + "how long do survivor benefits last" (140/mo) + "...and remarriage" (50/mo) + "...back pay" (10/mo). Podcast pain hook: Ready For Retirement's "How to Maximize Social Security Spousal Benefits" episode surfaced spousal-coordination questions; the site already answers those (couples-retirement-calculator, divorced-spouse FAQ), but every existing mention of "survivor benefit" on the site is scoped to a married couple deciding who keeps the larger check — nothing addresses a widow(er) claiming alone, a minor/dependent child's benefit, the age-18/in-school cutoff, garnishment protection, retroactive lump-sum payment, or COLA treatment specific to a survivor claim. Independently confirmed unowned by the dedup reviewer (see run notes). | Create new content: a dedicated Social Security survivor benefits guide covering eligibility (widow/widower, divorced widow(er), minor/dependent/disabled child), the benefit amount (up to 100% of the deceased's benefit), the age-60 (age-50 if disabled) earliest-claim rule for a surviving spouse, the child benefit cutoff (18, or 19 if still in secondary school, no cutoff if disabled before 22), the family maximum, remarriage effects, retroactive/lump-sum payment, and COLA — grounded in official SSA guidance only. | retirement | /guides/social-security-survivor-benefits-guide/ | article | guide (matches site's existing long-form guide pattern, e.g. is-social-security-taxable, couples-retirement-calculator's spousal-benefit FAQ block) | text |

## Emerging search patterns (clusters)

- **Social Security survivor benefits — widow(er) + dependent child** (Lens 2, adjacent-demand): the autocomplete pool for seed "social security spousal benefit" surfaced a large, distinct sub-cluster of survivor-specific questions (COLA, remarriage, garnishment, retroactive pay, benefits ending at 18/in college) that the SS spousal-benefit content already on site does not answer. This is the row above.

No other actionable cluster this run — every other Lens-1/2/3 candidate (22 direct-intent terms + comparison/alternatives sweep across HSA, 401k, Roth IRA, inherited IRA, pensions, Airbnb, rental property) mapped to existing, substantively-matching site content per the independent dedup review.

## Exclusions (DROP — covered by existing content, verified by independent reviewer reading full matching entries, not title/keyword grep)

how to make a budget → `spokes-budget.ts` (monthly/50-30-20/zero-based budget calculators) · mortgage payoff calculator → `spokes-mortgage.ts:payoff-calculator` (exact targetKeyword match) · roth vs traditional ira → `comparisons.ts:roth-ira-vs-traditional-ira` · coast fire calculator → live `/coast-fire/` vertical + `coast-fire-guide` + `coast-fire-for-couples` · 50 30 20 rule → `spokes-budget.ts:50-30-20-budget-calculator` · index funds vs etf → `comparisons.ts:index-fund-vs-etf` · trust vs will → `comparisons.ts:living-trust-vs-will` · how much do i need to retire → `guides.ts:how-much-do-i-need-to-retire-by-age` · how to calculate net worth → `spokes-net-worth.ts:how-to-calculate-net-worth` · average net worth by age → `spokes-net-worth.ts:net-worth-by-age-calculator` · how to start investing → `guides.ts:how-to-start-investing` · when to take social security → `spokes-retirement.ts:social-security-retirement-calculator` · how does probate work → `guides.ts:probate-process-guide` · portfolio rebalancing → `guides.ts:portfolio-rebalancing` · emergency fund amount → `guides.ts:how-much-emergency-fund` · debt payoff strategy → `debt-snowball-vs-avalanche` + `pay-off-debt-or-invest` + `how-long-to-pay-off-credit-card` · should i refinance → `spokes-mortgage.ts:refinance-calculator` · estate planning basics → `guides.ts:first-time-estate-planning` · rental property roi → `spokes-real-estate.ts:roi-calculator` · dividend strategy / high-yield red flag → `guides.ts:how-to-build-a-dividend-portfolio` (explicitly warns high yield is a red flag) · closing costs explained → `spokes-mortgage.ts:closing-cost-calculator` · net worth milestones → split coverage across `net-worth-projection-calculator` / `net-worth-by-age-calculator` / `net-worth-percentile-calculator` (flagged for a future body-update pass, not new content — this routine is additive-new-content-only) · SS spousal benefits (eligibility/50% floor/coordination) → `spokes-retirement.ts:couples-retirement-calculator` · SS divorced-spouse benefits (10-yr rule) → `spokes-retirement.ts` FAQ (exact "if the marriage lasted at least 10 years" match) · inherited Roth IRA 5-year rule → `guides.ts:inherited-ira-taxes-explained` (explicit 5-year clock explained, distinct from the 10-year SECURE Act rule) · HSA as long-term investment → `guides.ts:average-hsa-balance-by-age` (dedicated triple-tax-advantage / invest-and-wait sections) · retirement benchmarks by age 40/50/60 → `guides.ts:how-much-do-i-need-to-retire-by-age` + `catch-up-on-retirement-savings-in-your-60s`.

## Deterministic auto-approve

1 surviving row (well within 1–20 auto-approve band; no circuit-breaker). No deferred_rows carried over from a prior run (ledger checked — empty). AUTO-APPROVED. Proceeding to Phase 2.
