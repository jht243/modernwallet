---
source: podcast transcripts (podcast-pain-pass), SEMRUSH-validated
interpreted_brief: >
  This week's 42 new episodes across 7 transcript-ready personal-finance shows
  skew heavily toward investing and budgeting, with meaningful volume in
  retirement, tax/estate, real estate, and net worth. Listeners repeatedly ask
  "how much" and "how do I" — they want a concrete number or a step-by-step,
  not general encouragement. Roth-conversion/Medicare interactions, rental
  ROI judgment, dividend-stock evaluation, and retirement-income product
  choice (pension vs. purchased annuity) recur across shows this week.
status: ready-for-execution
---

# Podcast Pain Pass — Chart — 2026-08-14

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable |
|---|---|---|---|---|---|---|
| **Lens 1 (direct intent)** — 21 baseline theme terms validated ≥70 vol/mo (`how to make a budget` 1.83M, `how to calculate net worth` 110K, `how to start investing` 40.5K, `mortgage payoff calculator` 40.5K, `roth vs traditional ira` 22.2K, `50 30 20 rule` 22.2K, `coast fire calculator` 18.1K, `how much do i need to retire` 12.1K, `trust vs will` 9.9K, `average net worth by age` 9.9K, `index funds vs etf` 3.6K, `when to take social security` 1.3K, `emergency fund amount` 1.3K, `should i refinance` 1.3K, `how does probate work` 1.0K, `estate planning basics` 720, `portfolio rebalancing` 720, `dividend investing strategy` 260, `rental property roi` 260, `closing costs explained` 210, `debt payoff strategy` 140). Manual verification against `src/data/*.ts` + `ledger.json` shipped_slugs confirmed every one of these 21 is already the primary target of a live hub, spoke, guide, or comparison page (e.g. `roth-ira-vs-traditional-ira`, `living-trust-vs-will`, `coast-fire` calculator, `roi-calculator` real-estate spoke, `social-security-retirement-calculator`, `refinance-calculator`, `closing-cost-calculator`, `probate-process-guide`, `first-time-estate-planning`, `50-30-20-budget-calculator`, `how-to-build-a-dividend-portfolio`, `how-much-do-i-need-to-retire-by-age`, `how-much-emergency-fund`, `debt-snowball-vs-avalanche`, `portfolio-rebalancing`, plus the `budget`/`investing`/`net-worth`/`mortgage` hub pages themselves). | n/a | n/a | (all — already covered) | n/a | n/a | n/a |
| Listeners on 3 shows this week discuss guaranteed-income retirement products (pensions, annuities) with no page distinguishing an employer pension from a purchased annuity — which pays more guaranteed income, how each is taxed, when to pick one over the other. SEMRUSH: `pension vs annuity` 590/mo, KD 26. Adversarial dedup confirmed: `pension-vs-401k` and `annuity-vs-cd` compare different pairs; the only near-miss (`spokes-retirement.ts` FAQ on lump-sum-vs-monthly-annuity) covers a pension's own payout election, not pension-as-income-source vs. a separately purchased annuity. | Build a comparison page: guaranteed income amount, taxation (pension fully taxable as ordinary income vs. annuity exclusion ratio on non-qualified funds), inflation protection, survivor/spousal options, when each makes sense. | create new content | `/compare/pension-vs-annuity/` | comparison table/database | article (comparisons.ts schema) | full comparison page |
| Rental-property owners on "Rental Income Podcast" this week weigh REITs against direct rental ownership (liquidity, hands-on time, diversification) with no dedicated head-to-head page. SEMRUSH: `reit vs rental property` 90/mo, KD 13 (thin volume, kept — real, distinct intent from the passive-income listicle that only mentions both in passing). Adversarial dedup confirmed only passing mentions exist (`guides.ts` passive-income listicle subsection, `spokes-real-estate.ts` outbound link), no substantive comparison. | Build a comparison page: liquidity, minimum capital, hands-on time/management burden, diversification, historical total-return ranges (cited, not invented), tax treatment differences. | create new content | `/compare/reit-vs-rental-property/` | comparison table/database | article (comparisons.ts schema) | full comparison page |

## Emerging search patterns (clusters)

- **Retirement-income product choice (pension vs. annuity).** Cluster evidence: `pension vs annuity` (590/mo), autocomplete/SEMRUSH `phrase_these` showed no lower-volume variants worth splitting out — one clean head term. No existing dedicated page. → row 2 above.
- **REIT vs. direct rental ownership.** Cluster evidence: `reit vs rental property` (90/mo) plus this week's rental-podcast pain quotes on time/cost tradeoffs of direct ownership. Thin volume but a real, distinct, currently-unaddressed intent. → row 3 above.
- All other mined clusters this run (rental property ROI calculation, trust vs. will, HSA vs. FSA, HELOC vs. cash-out refinance, investing for a teenager/custodial accounts, financial-advisor fee percentage, estate-planning basics, Roth-conversion Medicare/IRMAA surcharge, "pay off debt or invest") returned real SEMRUSH/autocomplete demand but every one matched an existing live page or FAQ answering the same intent (see Lens-1 row above and the per-cluster verification in this run's mining notes). No emerging cluster beyond the two rows above survived the dedup gate.

## Exclusions

- The Roth-conversion/Medicare IRMAA-surcharge angle ("how roth conversions affect medicare irmaa surcharges", 10/mo) is real but too low-volume for a dedicated page and the underlying topic is already covered by the shipped `roth-conversion-rules` page; flagged as a possible future body-text enrichment, not new content, and out of scope for this routine (which only creates net-new pages).
- "Debt payoff strategy" (140/mo) was judged same-intent as the shipped `debt-snowball-vs-avalanche` comparison (the two dominant payoff strategies) — conservative YMYL near-synonym call, dropped.
- No candidate exceeded the 20-row circuit-breaker; no row was deferred.
