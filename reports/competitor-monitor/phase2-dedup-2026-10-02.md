# Phase 2 - Dedup (2026-10-02)

AI generation calls so far: 0 - dedup ran first (local checks against src/data/*.ts).

Selection: most recent by `lastmod` desc (new > updated > pending-retry tie-break). The strict top 10 was mostly off-niche (Omni physics/health/math tools, taco day, hexadecimal, city-specific advisor lists, card-offer news), so the walk continued down the recency list to 10 finance-relevant items. Passed-over off-niche items were not acted on and stay pending. Cap of 10 acted-on items respected.

| # | Candidate | Kind | Coverage check | Tag |
|---|---|---|---|---|
| 1 | NerdWallet mortgage-rates-today-friday-october-2-2026 | page | `current-mortgage-rates-guide` already covers rate drivers by design, without dated snapshots | DUPLICATE (skipped-duplicate) |
| 2 | NerdWallet pay-medical-debt | page | only `medical-loan-explained` (loan angle) and debt-collector guide; no medical-bill playbook | NEW |
| 3 | NerdWallet tax-deductions-for-homeowners | page | only generic `tax-deductions-checklist`; no homeowner page | NEW |
| 4 | NerdWallet registered-investment-advisor | page | advisor-choice/worth-it guides exist, none defines or verifies an RIA | NEW |
| 5 | NerdWallet how-much-save-by-30 | page | Fidelity age multiples and benchmarks already in `how-much-do-i-need-to-retire-by-age` and `how-much-to-save-for-retirement-average-earner` | DUPLICATE (skipped-duplicate) |
| 6 | Omni payday-loan (tool) | tool | no payday coverage; calculator hub mechanism needs new engine+island+hub prose; APR formula defensible but guide fallback chosen | NEW (guide fallback) |
| 7 | Omni student-loan (tool) | tool | standard-plan guide exists but no payment-formula page; guide fallback | NEW (guide fallback) |
| 8 | Omni home-improvement-loan (tool) | tool | comparisons exist (HELOC vs personal loan etc.) but no financing-decision guide; guide fallback | NEW (guide fallback) |
| 9 | NerdWallet auto-insurance-pricing-report-2026 | page | proprietary survey data report; cannot be matched with original sourced facts | skipped-low-value |
| 10 | NerdWallet bilt-obsidian-vs-chase-sapphire-preferred | comparison | card terms (fees, bonuses, partners) volatile and not verifiable from issuer pages in this run | skipped-low-value |

NEW -> generate: 6 (all guides) - PARTIAL -> enrich: 0 - DUPLICATE -> dropped: 2 - skipped-low-value: 2
