---
mindmap_pass_date: 2026-10-26
source: free-form input brief (trend-pass top-10 queries + research pack), DataForSEO-validated
interpreted_brief: Our 10 top queries for the 7 days ending 2026-10-26 (1 click, mostly impression-only), plus Lane A/B research. Lane A matched trends.md rows 4 and 6; Lane B found one uncovered top-20 query, "index investment funds", which has no definitional page on the site.
generated_by: mindmap-pass build phase (trend-pass Lane C) - demand ladder (rung that answered: dataforseo) + Autocomplete miner (4 seeds) + live SERP reality check (4 heads read)
demand_source: dataforseo
serp_reads: 4 heads read; DataForSEO about $0.02
status: ready-for-execution
---

| # | problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | source: coverage + top-10 (Lens 2, adjacent to "index investment funds", 74,000/mo KD 37 head). Cluster: what is an index fund 12,100/mo KD 37 (measured); how to invest in index funds 2,400 KD 37; how to invest in index funds for beginners 480 KD 22; are index funds a good investment 320 KD 46; index fund pros and cons 210 KD 7 (DataForSEO). Autocomplete: 198 completions. lookup: /roundup/best-index-funds (ranked picks), /compare/index-fund-vs-etf and -vs-mutual-fund (comparisons), /investing/sp500-calculator (calculator): all different reader goals, no definitional page. | Create /guides/what-is-an-index-fund/ as a definitional guide with a modeled fee-drag table from src/lib/investment.ts | create new content | /guides/what-is-an-index-fund | article - definition is the dominant PAA pattern | text | text | winnable (AI Overview) | no forum domination on the head; AI Overview cites fidelity.com, investor.vanguard.com, nerdwallet.com, chase.com, investor.gov | What is an index fund and how does it work? [PAA 3/6 on-topic; related searches: what is an index fund and how does it work] | definition + mechanism: a pooled fund holding an index's securities in the same proportions, normally at lower cost | section 1: How an Index Fund Works (intro answers in first two sentences) |

## Emerging search patterns (clusters)
| Cluster (theme) | Member queries | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| Index fund basics | what is an index fund; how to invest in index funds; are index funds a good investment; index fund pros and cons | coverage gap at theme level: no definitional page | partial (comparisons, roundup) | create new content | /guides/what-is-an-index-fund | article | text | text | winnable (AI Overview) | AI Overview cites fidelity.com, investor.vanguard.com, nerdwallet.com |

## Exclusions
- coast fire amount (50-500/mo estimate, NOT measured; coast fire number 1,300/mo): /guides/coast-fire-number-by-age and /coast-fire/ exist. DROPPED (exists).
- trump account vs brokerage account for kids (75-750/mo estimate, NOT measured): /compare/trump-account-vs-brokerage-account and custodial/kid brokerage pages exist. DROPPED (exists).
- are trump accounts a scam: /guides/trump-account-scams exists. DROPPED (exists).
- will online / regular vs roth 401k / best lenders / living trust / financial calculators online / nerdwallet calculators: ledger 2026-10-22 and 10-23, trends.md rows 4, 6, 8. DROPPED (exists).
- Duplicate-suppression: coverage_lookup.py run on every candidate (inline and by the independent reviewer); no page with the same reader goal. Commits naming the topic: none.
