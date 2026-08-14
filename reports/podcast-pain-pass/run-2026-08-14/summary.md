# Podcast Pain Pass — Run Summary — 2026-08-14

## Episodes pulled (42 total, capped at 6/show)
- Ready For Retirement: 6
- How to Money: 6
- Suze Orman's Women & Money: 6
- The Better Budgeting Podcast: 6
- Catching Up to FI: 6
- The Simply Investing Dividend Podcast: 6
- Rental Income Podcast With Dan Lane: 6
- The Personal Finance Club Show: 0 (no new episodes)

All 8 rostered feeds still carried `<podcast:transcript>` tags — no feed regressions to report.

## Pain clusters mined (125 sentences across 42 episodes)
investing 53 · budget 25 · retirement 17 · tax-estate 14 · real-estate 9 · net-worth 7

## Mindmap pass
- **Lens 1 (direct intent):** 21 baseline theme terms validated ≥70 vol/mo via SEMRUSH. All 21 manually confirmed already covered by existing hub/spoke/guide/comparison pages — no new-content rows.
- **Lens 2 (adjacent demand):** 8 autocomplete seeds mined + SEMRUSH `phrase_questions` expansion. Candidate clusters (trust vs will, HSA vs FSA, HELOC vs cash-out refinance, investing for a teenager, financial-advisor fee percentage, estate-planning basics, rental property ROI, "pay off debt or invest", Roth-conversion/Medicare IRMAA surcharge) all matched existing site content — dropped.
- **Lens 3 (comparison/alternatives):** 4 entity-pair seeds validated on SEMRUSH. 2 survived independent adversarial dedup review: **pension vs annuity** (590/mo) and **REIT vs rental property** (90/mo).
- Auto-approved: 2 rows (within the 1–20 range; no circuit-breaker).

## What shipped
| Page | Route | Format |
|---|---|---|
| Pension vs Annuity: Which Gives You More Guaranteed Income? | `/compare/pension-vs-annuity/` | comparison page |
| REIT vs Rental Property: Which Real Estate Investment Wins? | `/compare/reit-vs-rental-property/` | comparison page |

Both pages: researched against primary sources (IRS, PBGC, SEC Investor.gov, IRC §857, FINRA, Nareit, IRS Pub 527), full JSON-LD (BreadcrumbList, FAQPage, Person, Article), visible byline, internal links verified against live routes. Adversarial audit found one hard-check fail (REIT page meta description 163 chars) — fixed and rebuilt; both pages passed on rebuild.

## What was deduped (dropped as already-covered)
roth vs traditional ira, coast fire calculator, how much do i need to retire, trust vs will, average net worth by age, index funds vs etf, emergency fund amount, portfolio rebalancing, how to make a budget, how to calculate net worth, how to start investing, mortgage payoff calculator, 50 30 20 rule, when to take social security, should i refinance, how does probate work, estate planning basics, dividend investing strategy, rental property roi, closing costs explained, debt payoff strategy, hsa vs fsa, heloc vs cash out refinance, investing for a teenager, financial advisor fee percentage, pay off debt or invest.

## Circuit-breaker / deferred backlog
Not triggered. `deferred_rows` was empty entering this run and remains empty (nothing carried over, nothing stranded).

## Ledger
- `shipped_slugs`: +2 (`pension-vs-annuity`, `reit-vs-rental-property`) → 35 total.
- `last_run`: 2026-08-14.
- Episode GUIDs marked processed by `pull_new_episodes.py` during Phase 0.
