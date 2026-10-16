---
mindmap_pass_date: 2026-10-16
source: free-form input brief (text: 4 zero-result site searches, last 24h, themodernwallet.com), SERP-validated
interpreted_brief: Four visitors, all on /mileage-deduction/irs-mileage-rate-2026/, searched four phrasings of one question: are employers required to pay the IRS standard mileage rate. The page covers the rate and the taxability of reimbursement but never says whether an employer must pay it.
generated_by: mindmap-pass build phase (search-gap run) — brief interpretation + live SERP reality check (1 head read, DataForSEO) + coverage lookup; demand ladder not spent (real searchers asked; volume never vetoes)
demand_source: measured SERP PAA (dataforseo); no keyword volume pulled
serp_reads: 1 head read (~$0.004)
status: ready-for-execution
---

## Brief (verbatim, every candidate, kind=search, page=/mileage-deduction/irs-mileage-rate-2026/)
- "are employers required to pay at the standard rate?" (2)
- "are employers required to pay a the standard rate?" (1)
- "are employers required to pay at the irs standard rate for mileage?" (1)
- "are employers required to pay at the irs standard rate?" (1)

## Duplicate check
passed — 0 new-page rows checked, 0 matched an existing page (coverage_lookup.py run for the candidate route; its only match, /mileage-deduction/irs-mileage-rate-2026, is the page the searchers were on, so the lever is enrichment, not a new page)

| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Direct intent, 4 phrasings of one question. lookup: /mileage-deduction/irs-mileage-rate-2026 — reader wants the rate and how to split miles; its FAQ covers employee deductions and taxability of reimbursement but not whether an employer must pay it. Related guide /guides/state-mileage-reimbursement-law-california-texas-michigan/ answers it at length but the asker was on the rate page and had to search. | Add FAQ "Are employers required to pay the IRS standard mileage rate?" to the rate page, linking the state-law guide | update existing body text | src/data/spokes-mileage.ts (slug irs-mileage-rate-2026) | n/a | n/a | n/a | winnable (AI Overview, reddit in top 10) | page one: irs.gov, jacksonlewis.com, companymileage.com, paylocity.com, motus.com; AI Overview present, cited domains not returned | "Are employers required to pay the IRS standard mileage rate?" [PAA 5/6 on-topic: are companies legally required to pay mileage; does an employer have to pay the IRS mileage rate; can companies pay less than IRS; ac n/a] | verdict: no federal requirement; FLSA minimum-wage floor and state law (e.g. California 2802) can still require reimbursement; only pay above the IRS rate is taxable | FAQ entry placed directly after "Can employees deduct mileage in 2026?" (the page template has fixed intro/how-it-works slots on the rate itself; FAQ list is the only extensible question slot) |

## Emerging search patterns (clusters)
No emerging clusters detected this run.

## Exclusions
- No new-page rows: the existing rate page is the right home and the state-law guide already covers depth. Lens 3 (vs/alternatives/pricing): no comparable entity in the brief.
- PAA "What is the $75 rule in the IRS?" and "Can I deduct mileage not reimbursed by my employer?" are not among the visitor questions; the second is already answered by the page's "Can employees deduct mileage in 2026?" FAQ. Not added.
