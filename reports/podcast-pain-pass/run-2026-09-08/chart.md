---
source: podcast transcripts (podcast-pain-pass), SEMRUSH-validated
data_provider_note: >
  DataForSEO won volume + KD for this run (quality order ahrefs > dataforseo > semrush for
  volume; ahrefs > semrush > dataforseo for KD; ahrefs unusable — no AHREFS_API_KEY). SEMRUSH
  key was dry (HTTP 403) for the whole run — expected per the keyword-demand-ladder, not a
  failure. DataForSEO returned volume for 23/23 phrases and corroborated 23/23 rows against
  live Autocomplete. All 22 validated_terms.json phrases carry source: dataforseo,
  confidence: high.
interpreted_brief: >
  This week's 36 new episodes across 6 personal-finance podcasts skew heavily toward
  retirement-transition anxiety: when and how to file for Social Security, whether a
  72(t)/401(k) plan is actually built right, and how to turn a portfolio into a paycheck
  that lasts. Budgeting listeners are asking basic "am I doing this right" questions and
  struggling with identity/spending psychology after years of saving. Investors are
  weighing rules-of-thumb (withdrawal rates, portfolio composition) against real numbers,
  and real-estate listeners want tactical answers on rental cash flow and financing paths
  into their first or next property.
status: ready-for-execution
run: run-2026-09-08
surviving_rows: 0
---

# Podcast Pain Pass — Action Chart — run-2026-09-08

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable |
|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — |

**No surviving rows this run.** All 22 Lens-1 direct-intent terms were verified against `src/data/*.ts` and every one is already owned by a dedicated page targeting the same search intent (see Exclusions below for the specific file/route covering each). Lens-2 adjacent-demand clustering across the 10 seed autocomplete pulls surfaced no cluster with real, repeated demand that isn't already answered on an existing page. Lens-3 comparison/alternatives mining on the brief's named entities (Roth conversion, 72(t)/SEPP, donor-advised fund, Coast FIRE) found a dedicated comparison or guide already covering every one. This is a legitimate, expected outcome for a weekly pass on a mature 338-targetKeyword / 532-slug site — the auto-approve ladder's 0-survivor path (send `no-changes` email, STOP) applies.

## Emerging search patterns (clusters)

No emerging clusters detected this run.

Lens-2 evidence reviewed (10 autocomplete CSVs, mode=all, ~2,000 raw suggestions total) surfaced several repeated modifier groups, but every one already has a dedicated answer on the site, so none rose to an actionable row:

- **"50/30/20 rule before/after tax, gross/net income"** (10+ repeated variants in `50-30-20-rule.csv`) — already answered by the `50-30-20-budget-calculator` spoke's FAQ ("Should I use gross or take-home income for a budget?") and `commonMistakes` entry.
- **"50/30/20 rule include 401k / retirement / pension"** (5 variants) — already answered by the same spoke's FAQ ("Does the 20% include my 401(k)?").
- **"50/30/20 rule for teens / college students / kids"** (5 variants) — served by the existing `student-budget-calculator` spoke plus the budget hub's "How to create a family budget" section.
- **"Trust & Will vs [LegalZoom/Rocket Lawyer/Quicken WillMaker/GoodTrust/Mama Bear/Ethos]"** (6+ variants in `trust-vs-will.csv`, referring to the online service brand, not the will-vs-trust legal concept) — already covered head-to-head in the `best-estate-planning-software`, `best online will makers`, and `best living trust services` roundups (all of which name-compare Trust & Will against every one of those rivals with current pricing).
- **"Coast FIRE calculator with/including social security / pension"** (9 variants in `coast-fire-calculator.csv`) — already answered by the Coast FIRE calculator's own FAQ ("Does this calculator account for Social Security or a pension?").
- **"Net worth excluding/without home equity"** (7 variants across `average-net-worth-by-age.csv` and `how-to-calculate-net-worth.csv`) — this is exactly what the `liquid-net-worth-calculator` spoke measures (explicitly excludes home equity, retirement, and vehicles); its FAQ cross-links both source pages.
- **"Mortgage payoff calculator vs invest"** (1 distinct-modifier phrase in `mortgage-payoff-calculator.csv`) — already answered in depth: the `payoff-calculator` and `refinance-calculator` spoke FAQs plus a dedicated "Mortgage payoff vs. investing: a real numbers comparison" section (with a worked $300k/6.5% example) inside `/guides/pay-off-debt-or-invest/`.
- **"How to make a budget with ChatGPT / AI / Claude"** (4 variants in `how-to-make-a-budget.csv`) — already covered by `/guides/ai-financial-advice-chatbots-guide/`, which explicitly tells readers to run a chatbot-suggested 50/30/20 split back through the site's own budget calculator.
- International/regional variants (UK, Canada, Australia, India, Kenya, Philippines, Singapore, and 20+ other countries; U.S. state and city variants) across nearly every CSV — high raw completion count but out of scope for a US-focused personal-finance site with no localized content strategy; not treated as an actionable cluster.
- Off-topic autocomplete noise (e.g., "how many followers do i need to go live on TikTok/Instagram/YouTube" surfacing under the `how-much-do-i-need-to-retire` seed; unrelated "net income" accounting/tax queries surfacing under `how-to-calculate-net-worth`) — autocomplete topic drift from the alphabet-expansion mode, not real demand for this site's subject matter. Excluded, not mined further.

## Exclusions — mined but already covered

All 22 Lens-1 direct-intent terms from `validated_terms.json` were dropped as already covered. Each was checked past a naive filename grep: the matching `src/data/*.ts` entry was read in full to confirm a dedicated page (title/h1/targetKeyword) genuinely owns the same search intent, not just an incidental body mention.

| # | Term (vol) | Verdict | Covered by |
|---|---|---|---|
| 1 | how to make a budget (165,000) | DROP | `src/data/calculators.ts` — `/budget/` hub ("Budget Calculator"), dedicated "How to make a budget in 5 steps" step-by-step section in `howItWorks` |
| 2 | mortgage payoff calculator (60,500) | DROP | `src/data/spokes-mortgage.ts` — `/mortgage/payoff-calculator/`, exact title match |
| 3 | 50 30 20 rule (40,500) | DROP | `src/data/spokes-budget.ts` — `/budget/50-30-20-budget-calculator/` |
| 4 | roth vs traditional ira (40,500) | DROP | `src/data/comparisons.ts` — `/compare/roth-ira-vs-traditional-ira/` (targetKeyword exact match, reordered) |
| 5 | coast fire calculator (40,500) | DROP | `src/data/calculators.ts` — `/coast-fire/`, h1 "Coast FIRE Calculator" |
| 6 | trust vs will (18,100) | DROP | `src/data/comparisons.ts` — `/compare/living-trust-vs-will/` (targetKeyword "living trust vs will" — same intent, conservative YMYL near-synonym) |
| 7 | index funds vs etf (18,100) | DROP | `src/data/comparisons.ts` — `/compare/index-fund-vs-etf/` |
| 8 | how much do i need to retire (14,800) | DROP | `src/data/guides.ts` — `/guides/how-much-do-i-need-to-retire-by-age/` |
| 9 | how to calculate net worth (14,800) | DROP | `src/data/spokes-net-worth.ts` — `/net-worth/how-to-calculate-net-worth/`, exact targetKeyword match |
| 10 | average net worth by age (12,100) | DROP | `src/data/spokes-net-worth.ts` — `/net-worth/net-worth-by-age-calculator/` (median-by-age comparison, same intent) |
| 11 | how to start investing (8,100) | DROP | `src/data/guides.ts` — `/guides/how-to-start-investing/` |
| 12 | how does probate work (1,600) | DROP | `src/data/guides.ts` — `/guides/probate-process-guide/` ("Probate Process Guide: What Happens After Someone Dies") |
| 13 | when to take social security (1,600) | DROP | `src/data/guides.ts` — `/guides/how-to-retire-at-67/`, dedicated "Social Security at 62 vs. 67 vs. 70: What's the Real Dollar Difference?" section |
| 14 | portfolio rebalancing (1,000) | DROP | `src/data/guides.ts` — `/guides/portfolio-rebalancing/` |
| 15 | emergency fund amount (880) | DROP | `src/data/guides.ts` — `/guides/how-much-emergency-fund/` ("How Much Emergency Fund Do I Need? (3-6 Months Rule)") |
| 16 | debt payoff strategy (720) | DROP | `src/data/comparisons.ts` — `/compare/debt-snowball-vs-avalanche/` |
| 17 | should i refinance (590) | DROP | `src/data/spokes-mortgage.ts` — `/mortgage/refinance-calculator/` ("Mortgage Refinance Calculator: Break-Even Analysis") |
| 18 | estate planning basics (480) | DROP | `src/data/guides.ts` — `/guides/first-time-estate-planning/` ("First Time Estate Planning: What You Actually Need") |
| 19 | rental property roi (390) | DROP | `src/data/spokes-real-estate.ts` — `/real-estate/roi-calculator/` ("Rental Property ROI Calculator: Total Return Tool") |
| 20 | dividend investing strategy (260) | DROP | `src/data/guides.ts` — `/guides/how-to-build-a-dividend-portfolio/` |
| 21 | closing costs explained (140) | DROP | `src/data/spokes-mortgage.ts` — `/mortgage/closing-cost-calculator/`, plus `src/data/guides.ts` — `/guides/mortgage-refinance-closing-costs/` |
| 22 | net worth milestones (70) | DROP | `src/data/spokes-net-worth.ts` — `/net-worth/net-worth-projection-calculator/` (explicit $500k/$1M milestone framing) and `/net-worth/net-worth-by-age-calculator/` |

**Lens-3 entity check** (brief-named entities worth a vs/alternatives page): all four candidates already have dedicated coverage, so no Lens-3 row was proposed.
- **Roth conversion** → `/guides/roth-conversion-rules/` and `/guides/roth-conversion-ladder/` (`src/data/guides.ts`)
- **72(t) plan / SEPP** → covered across `src/data/spokes-retirement.ts` (early-withdrawal/FIRE-calculator FAQs) and `/guides/...` "The alternatives: Rule of 55 and 72(t) payments" section
- **Donor-advised fund (Daffy)** → `src/data/comparisons.ts` — `/compare/donor-advised-fund-vs-private-foundation/`, exact targetKeyword match to the brief entity
- **Coast FIRE** → `/coast-fire/` calculator, `/guides/coast-fire-guide/`, `/guides/coast-fire-for-couples/`, and `/compare/coast-fire-vs-barista-fire/`
