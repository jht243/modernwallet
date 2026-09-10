# Page-quality-pass audit ledger

> One row per treated page. Drives this pass's own 7-day cooldown AND the
> feedback loop (Phase 1 step 7 compares current metrics to the `sessions`/
> `avg_eng_s`/`eng_rate`/`bounce`/`scrolled_pct` stored here at treatment time).

| route | treated | window | sessions | avg_eng_s | eng_rate | bounce | scrolled_pct | diagnosis | actions | audit |
|---|---|---|---|---|---|---|---|---|---|---|
| /roundup/best-index-funds/ | 2026-08-27 | 2026-07-31..2026-08-27 (28d) | 64 | 61.9 | 0.3906 | 0.6094 | 0.0526 | DEAD_END | ADD_LINKS (3: /compare/brokerage-vs-ira/, /compare/stocks-vs-bonds/, /portfolio/) | PASS (round 2, after fixing link-redundancy finding) |
| /compare/custodial-roth-ira-vs-brokerage-account/ | 2026-09-07 | 2026-08-11..2026-09-07 (28d) | 53 | 102.2 | 0.1132 | 0.8868 | n/a (no scroll data) | DEAD_END | ADD_LINKS (2: /guides/utma-custodial-account-explained/, /compare/custodial-account-vs-savings-account/) | PASS |
| /guides/is-social-security-taxable/ | 2026-09-10 | 2026-08-14..2026-09-10 (28d) | 78 | 92.6 | 0.3205 | 0.6795 | 0.0405 | DEAD_END | ADD_LINKS (2: /compare/rmd-vs-qcd/, /retirement/rmd-calculator/) | PASS |
| /mileage-deduction/irs-mileage-rate-2026/ | 2026-09-10 | 2026-08-14..2026-09-10 (28d) | 71 | 35.3 | 0.3239 | 0.6761 | 0.0923 | THIN_UNDERDELIVERY | APPEND_FAQ (1: mileage reimbursement/accountable-plan taxability) | PASS (round 1, 1 mechanical wording fix) |
