---
mindmap_pass_date: 2026-10-14
source: Google Autocomplete mining (5 seeds, 1,318 completions) via /autocomplete-pass-auto, free-form brief, DataForSEO-validated
interpreted_brief: Weekly Autocomplete harvest for themodernwallet.com from five seeds with no dedicated page (inflation calculator, annuity calculator, credit card interest calculator, loan payment calculator, paycheck calculator). Real live searches; build the calculators the site can back with defensible math.
generated_by: mindmap-pass build phase — keyword demand ladder (volume=dataforseo, kd=dataforseo; Ahrefs/SEMRUSH not configured) + Autocomplete miner + live SERP check (4 heads, $0.016) + scripts/mindmap/coverage_lookup.py duplicate check
demand_source: dataforseo
serp_reads: 4 heads read; $0.0163
status: ready-for-execution
---

Keyword data: volume=dataforseo, kd=dataforseo. Raw SERP: reports/mindmap-pass/2026-10-14-autocomplete.serp.json. Autocomplete CSVs: reports/keyword-pass/2026-10-14.autocomplete.*.csv.

**Duplicate check:** passed — 3 new-page rows checked, 0 matched an existing page with the same reader goal (coverage_lookup.py --site-url https://www.themodernwallet.com; /annuity-calculator/ only hit comparison/guide pages on annuities, /credit-card-interest-calculator/ only card roundups and guides, /loan-payment-calculator/ only product-specific auto/FHA/VA spokes). Run inline by the orchestrator; no reviewer subagent was spawned.

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Lens 1/2, seed "annuity calculator": `annuity calculator` 33,100/mo KD 32 CPC $5.24; `annuity payout calculator` 9,900 KD 23; `present value of annuity calculator` 1,900 KD 22; `future value of annuity calculator` 1,300; `lottery annuity calculator` 6,600 KD 8 (not built, needs lottery tax rules); 250 completions. lookup: /compare/annuity-vs-cd — a comparison reader, not a payout calculator. Only comparison/guide pages exist. | Build /annuity-calculator/ — payout, growth and value-today in one tool; ordinary vs due; prose from the API writer | create new content | /annuity-calculator/ | calculator | interactive tool | interactive tool | winnable (AI Overview) | AI Overview cites schwab.com, calculator.net, immediateannuities.com; no forum dominance | "How can I calculate my annuity?" [PAA 2/6 how-to; ac 4/10 question] | Figure | section 1 |
| Lens 1/2, seed "credit card interest calculator": `credit card interest calculator` 27,100/mo KD 10 CPC $6.04; completions "per month", "daily", "on $5000". lookup: /credit-card-payoff (pays a balance down) — different goal from one cycle's interest charge. | Build /credit-card-interest-calculator/ — daily rate x average daily balance, mid-cycle payment, effective annual rate | create new content | /credit-card-interest-calculator/ | calculator | interactive tool | interactive tool | winnable (AI Overview) | AI Overview cites nerdwallet.com, discover.com, calculator.net; page one is small calculator sites | "How do I calculate my credit card interest?" [PAA 2/6 how-to; ac 3/10 question] | Figure | section 1 |
| Lens 1/2, seed "loan payment calculator": `loan payment calculator` 110,000/mo KD 46 CPC $2.79; completions "amortization", "additional payments", "biweekly". lookup: only product-specific loan calculators (auto, FHA, VA, personal). | Build /loan-payment-calculator/ — generic fixed-rate payment, interest, extra-payment payoff | create new content | /loan-payment-calculator/ | calculator | interactive tool | interactive tool | winnable (AI Overview) | AI Overview cites bankrate.com, calculator.net; page one is banks and mortgagecalculator.org | "How is my monthly loan payment calculated?" [verb-only — no PAA; ac 4/10 question] | Figure | section 1 |

## Emerging search patterns (clusters)
| Cluster (theme) | Member queries | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| Annuity math | annuity calculator (33,100); annuity payout calculator (9,900); present value of annuity calculator (1,900) | coverage gap at theme level | partial (comparisons only) | create new content | /annuity-calculator/ | calculator | interactive tool | interactive tool | winnable (AI Overview) | schwab, calculator.net |
| Card interest per cycle | credit card interest calculator (27,100) | intent mismatch with payoff tool | partial | create new content | /credit-card-interest-calculator/ | calculator | interactive tool | interactive tool | winnable (AI Overview) | nerdwallet, discover |
| Generic loan payment | loan payment calculator (110,000) | no generic tool | partial (product-specific) | create new content | /loan-payment-calculator/ | calculator | interactive tool | interactive tool | winnable (AI Overview) | bankrate, calculator.net |

## Exclusions / candidates considered
- **Paycheck calculator** (550,000/mo, KD 52): needs sourced federal and state withholding tables and a yearly refresh. Deferred, not dropped: no tool ships on invented tax math.
- **Inflation calculator** seed: /inflation-calculator/ shipped 2026-10-11 (755ac39). Its completions are already covered; no new row.
- Lottery annuity, annuity vs lump sum (260/mo), annuity due (170/mo): served by the annuity tool's timing and mode switches; lottery tax rules not built.
- Lens 3 (vs / alternatives / pricing): no named vendor entity in these generic calculator seeds; annuity-vs-CD and pension-vs-annuity comparison pages already exist.
- Single-vendor and country-specific completions (aviva, canada, uk, australia, sbi, groww) kept in the CSVs as demand signal; not charted this run.
