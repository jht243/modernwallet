---
mindmap_pass_date: 2026-10-23
source: free-form input brief (trend-pass top-10 queries + research pack), DataForSEO-validated
interpreted_brief: Our 10 top-clicking Google queries for the 7 days ending 2026-10-23 (all zero-click, impression-only), plus Lane A/B research. Build what the demand implies the site lacks. Lane A matched trends.md rows 4, 6, 8 (no trend work); Lane B found no top-20 query without a page except "investment calculator with increasing contributions", whose gap the site's own FAQ admits.
generated_by: mindmap-pass build phase (trend-pass Lane C) - demand ladder (rung that answered: dataforseo) + Autocomplete miner (4 seeds) + live SERP reality check (2 heads read)
demand_source: dataforseo
serp_reads: 2 heads read; DataForSEO 2 calls, $0.0080
status: ready-for-execution
---

| # | problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | source: coverage + top-10 (Lens 2 adjacent to the top-20 query "investment calculator with increasing contributions", pos 17, 1 impr). Cluster: investment calculator with increasing contributions 320/mo KD 21 (measured, DataForSEO); compound interest calculator with increasing contributions 260/mo KD 38; increasing pension contributions calculator 10/mo; Autocomplete: increasing annual / monthly / over time / and inflation contributions (10 completions). The site's own investment-growth-calculator FAQ says it cannot model a contribution that steps up. lookup: /investing/compound-interest-calculator - reader wants a flat-contribution compounding projection; same topic, different goal. | Create /investing/investment-calculator-increasing-contributions/ as a calculator spoke reusing the investing island with a new optional yearly-increase input (engine change is additive, default 0 = identical) | create new content | /investing/investment-calculator-increasing-contributions | calculator - searchers want a personalized projection | interactive tool | interactive tool | winnable (AI Overview) | no forum or major-platform domination; AI Overview cites investor.sebi.gov.in, myplan.johnhancock.com, financialmentor.com; no PAA | How much will my investments grow if I raise my contribution a little every year? [verb-only - no PAA; ac 10 completions] | figure: a 3% yearly raise turns $300,850.72 flat into $367,509.35 over 20 years | section 1: intro answer block |

## Emerging search patterns (clusters)
| Cluster (theme) | Member queries | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| Increasing-contribution investment projection | investment calculator with increasing contributions; compound interest calculator with increasing contributions; investment growth calculator increasing contributions | intent mismatch: existing calculators are flat-contribution only (FAQ says so) | partial | create new content | /investing/investment-calculator-increasing-contributions | calculator | interactive tool | interactive tool | winnable (AI Overview) | AI Overview cites investor.sebi.gov.in, myplan.johnhancock.com |

## Exclusions
- will online / online will / last will online / make a will online (1,000/mo "make a will online"): covered by roundup/best-online-will-makers, compare/online-will-vs-lawyer, trends.md row 6. DROPPED (exists).
- regular vs roth 401k variants: compare/roth-401k-vs-traditional-401k + calculator, trends.md row 4. DROPPED (exists).
- best mortgage lenders / best lenders for home loans: roundup/best-mortgage-lenders, trends.md row 8; jumbo / second-home / seniors / bad-credit lender roundups stay HELD (verified lender terms needed).
- deposit vs custodial account: compare/custodial-account-vs-savings-account and custodial-roth-ira-vs-* exist. DROPPED (exists).
- etf mutual funds, financial (online) calculators, nerdwallet calculator, how long will my money last: covered, see ledger 2026-10-22.
- most trusted living trust company for real estate owners: roundup/best-living-trust-services. DROPPED (exists).
- Duplicate-suppression: coverage_lookup.py run inline on the one new row (no same-intent page; only the flat-contribution parent), no commits name the topic; independent page-level adversarial audit ran 3 rounds. Prior commits checked: no prior commits touch this route.
