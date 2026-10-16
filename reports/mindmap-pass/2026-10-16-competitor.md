---
mindmap_pass_date: 2026-10-16
source: competitor publishing monitor (NerdWallet, Bankrate), 10 most recent new/updated items
interpreted_brief: Ten competitor pages refreshed 2026-10-14 to 10-16. Build original, primary-sourced coverage only where the site has no dedicated page.
generated_by: mindmap-pass (unattended) — keyword tools not configured, demand estimated; coverage_lookup + manual duplicate review
status: executed — 2 pages built
---

## Main action table
| problem | solution | bucket | target | format | reader_question | answer_placement |
|---|---|---|---|---|---|---|
| NerdWallet "401(k) Loans". lookup: /compare/401k-loan-vs-heloc (different reader goal: borrowing path comparison). No page explains the loan rules. | Create guide on loan limit, repayment, default | create new content | /guides/401k-loan-rules/ | article (figure/list) | "How does a 401(k) loan work, and how much can I borrow?" [verb-only — no PAA, no completions] | section 1 |
| NerdWallet "Is Student Loan Forgiveness Taxable?". lookup: no match. | Create guide: the taxability test from IRC 61/108 and IRS Topic 431 | create new content | /guides/is-student-loan-forgiveness-taxable/ | article (verdict/test) | "Is student loan forgiveness taxable?" [verb-only — no PAA, no completions] | section 1 |

## Emerging search patterns (clusters)
| Cluster | Members | Lever | Target |
|---|---|---|---|
| 401(k) loan rules | 401k loan; borrow from 401k | create new content | /guides/401k-loan-rules/ |
| Forgiveness tax | student loan forgiveness taxable; student loan tax bomb | create new content | /guides/is-student-loan-forgiveness-taxable/ |

## Exclusions
- Student loan consolidation calculator — no student-loan calculator island exists; not built this run (skipped-low-value).
- PayPal Cashback vs Venmo card, airline card guide — card terms change often and no primary source could be fetched (skipped-low-value).
- First-time homebuyer grants, auto-refinance credit impact — HUD/CFPB pages unreachable this run, so no sourced fact list (skipped-low-value).
- Small business lender reviews — vendor review hub, no sourced facts (skipped-low-value). Credit card debt payoff — /guides/how-to-pay-off-debt and /guides/how-long-to-pay-off-credit-card (skipped-duplicate). Grad school — /guides/how-to-pay-for-grad-school (skipped-duplicate).

## Outcome
Writer claude-opus-5-5 UNUSABLE (both keys: credit too low); both pages written by fallback gemini-3.8-flash. Claim check removed unsupported sentences; Phase 4 adversarial auditors (Explore) returned FAIL with 19 and 21 findings; all applied by exact replacement (apply_fixes.py), not re-audited. Pages are ~950 and ~900 body words, under the 1,200 floor because the sourced fact list is the limit. Astro build passes.
