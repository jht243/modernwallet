---
source: podcast transcripts (podcast-pain-pass), SEMRUSH-validated
interpreted_brief: >
  This week's 47 new episodes across all 8 rostered transcript-ready personal-finance
  shows skew heavily toward investing mechanics and behavior (portfolio cash allocation,
  bond funds, diversification myths, dividend vs term-deposit tradeoffs — 77 hits)
  alongside retirement-spending psychology and Social Security tax confusion.
status: ready-for-execution
---

# Podcast Pain Pass — Chart — 2026-08-11

## Action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable |
|---|---|---|---|---|---|---|
| **Lens 1 (direct-intent, floor 70/mo):** 21/23 THEME_TERMS candidates validated — but on independent site-inventory check, ALL 21 are already covered by existing guides/comparisons/calculators (see exclusions below). | — | — | — | — | — | — |
| **Lens 2 (adjacent-demand, "is social security taxable"):** 33,100 vol/mo, KD59. Mined from the tax-estate pain cluster ("provisional income... how much money you owe in taxes on your social security benefit"). Autocomplete surfaced a broad cluster (by state, disability, "regressive", "how is SS taxable") around a single core informational intent: the federal provisional-income formula and thresholds. Site's only existing touchpoint is one FAQ bullet on the Social Security Retirement Calculator (a claiming-age/benefit-amount tool) — no dedicated explainer. | create new content | tax-estate | `/guides/is-social-security-taxable/` | article (informational explainer) | text | text |
| **Lens 3 (entity vs/pricing — DSCR loan, named via Rental Income Podcast entity "He Bought A Rental Property... DSCR"):** "dscr loan requirements" 3,600 vol/mo, KD44. Autocomplete cluster (82 completions) is dominated by residential 1-4 unit investor-loan questions: income requirements, down payment %, appraisal waiver, occupancy rules, state-level lender variance. Site's only DSCR coverage is inside `/guides/commercial-mortgage-calculator/`, scoped to SBA/commercial DSCR — a different loan product and qualification context from a residential rental DSCR loan. | create new content | real-estate | `/guides/dscr-loan-requirements/` | article (informational explainer) | text | text |
| **Lens 2 (adjacent-demand, "portfolio rebalancing"):** 720 vol/mo, KD61 (already a Lens-1 THEME_TERMS candidate, carried forward here since site-inventory check found only passing mentions inside unrelated comparison pages — no dedicated page on when/how to rebalance, bands vs. calendar rebalancing, or tax cost). Ties directly to this week's #1 pain cluster (investing, 77 hits) — cash-reserve and portfolio-composition confusion. | create new content | investing | `/guides/portfolio-rebalancing/` | article (informational explainer) | text | text |

## Emerging search patterns (clusters)
- **Social Security taxability** (Lens 2): "is social security taxable [by state / ca / disability / regressive]" — single dominant intent (the federal provisional-income rule), state-tax nuance can live as a body section, not a separate page.
- **Residential DSCR loan mechanics** (Lens 3): "dscr loan requirements [income / down payment / appraisal / occupancy / state]" — single dominant intent (qualifying for a residential investor DSCR loan), state variants can live as a body section.
- **Portfolio rebalancing** (Lens 2/1 carryover): no strong autocomplete cluster beyond the base phrase; kept as a single article on volume + total absence of dedicated coverage.

## Exclusions (already covered — dropped by site-inventory + independent dedup review)
- `how to make a budget` (1,830,000) → covered by 4 budget calculators (`50-30-20-budget-calculator`, `household-budget-calculator`, `monthly-budget-calculator`, `zero-based-budget-calculator`).
- `how to calculate net worth` / `average net worth by age` (110,000 / 9,900) → `net-worth-by-age-calculator` (enriched 2026-08-07 with income/education-bracket FAQs).
- `how to start investing` (40,500) → `/investing/` hub (enriched 2026-08-07 with a $0-minimum FAQ).
- `mortgage payoff calculator` (40,500) → `payoff-calculator` spoke (enriched 2026-08-07).
- `roth vs traditional ira` (22,200) → `roth-ira-vs-traditional-ira` comparison.
- `50 30 20 rule` (22,200) → `50-30-20-budget-calculator`.
- `coast fire calculator` (18,100) → `/coast-fire/` hub; `coast fire calculator with social security` (90, Lens 2) is already answered by its existing "Does this calculator account for Social Security or a pension?" FAQ.
- `how much do i need to retire` (12,100) → `how-much-do-i-need-to-retire-by-age` guide (shipped 2026-08-07).
- `trust vs will` (9,900) → `living-trust-vs-will` comparison.
- `index funds vs etf` (3,600) → `index-fund-vs-etf` comparison.
- `when to take social security` (1,300) → `social-security-retirement-calculator` spoke.
- `emergency fund amount` (1,300) → `how-much-emergency-fund` guide.
- `should i refinance` (1,300) → mortgage `refinance-calculator` spoke.
- `how does probate work` (1,000) → `probate-process-guide` / `probate-vs-trust`.
- `estate planning basics` (720) → `first-time-estate-planning` guide.
- `dividend investing strategy` (260) → `how-to-build-a-dividend-portfolio` guide + `dividend-calculator` + 3 dividend-ETF roundups.
- `rental property roi` (260) → `roi-calculator` / `rental-income-calculator` spokes.
- `closing costs explained` (210) → `closing-cost-calculator` spoke.
- `debt payoff strategy` (140) → `debt-snowball-vs-avalanche` comparison.
- `4 percent rule retirement` (480, Lens 3) → `withdrawal-calculator` spoke (already covers Bengen's 4% rule, Pfau's 3.3% critique, inflation adjustment, 40-year-horizon caveat in depth).
- `hsa vs fsa` (33,100, Lens 3) → `hsa-vs-fsa` comparison (already exists).
- `bond fund vs individual bonds` (40, Lens 2) → below the 70/mo floor, dropped regardless of coverage.
- `how much cash should i keep in my portfolio` (best variant 40, Lens 2) → all phrasing variants tested below the 70/mo floor.
- `social security taxable by state` (0, Lens 2 sub-angle) → no measurable volume as its own page; folded into the new `is-social-security-taxable` guide as a body section instead.

## Deferred backlog
`reports/podcast-pain-pass/ledger.json` `deferred_rows` was empty at run start — nothing to drain.
