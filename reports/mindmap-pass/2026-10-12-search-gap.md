---
mindmap_pass_date: 2026-10-12
source: search-gap brief (9 zero-result site searches, one asker typing one question incrementally), demand ladder not needed (asker demand is the signal)
interpreted_brief: One visitor on /guides/what-to-do-with-an-inheritance/ typed nine progressive versions of "what if I inherit an IRA that has been previously inherited" and got zero results. No page on the site explains successor-beneficiary rules for an already-inherited IRA.
generated_by: mindmap-pass build phase, SERP read 1 head (winnable; AI Overview present, cites irs.gov, vanguard), Autocomplete questions returned none
status: ready-for-execution
---
| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Direct intent, 9 search rows = 1 asker. lookup: /guides/inherited-ira-taxes-explained/ — explains 10-year rule for first-generation heirs, nothing on a successor beneficiary. No volume (asker demand). | Add a section on inheriting an IRA that was already inherited (successor beneficiary) | update existing body text | src/data/guides.ts slug inherited-ira-taxes-explained | n/a | n/a | n/a | winnable (AI Overview) | AI Overview cites irs.gov, vanguard; no forum domination | What happens if I inherit an IRA that was already inherited? [verb-only — no PAA match, no completions] | Successor beneficiary generally does not get a fresh clock; deadline depends on first heir's category (verdict/mechanism) | section 1 of the new section |
| Same asker was on /guides/what-to-do-with-an-inheritance/ whose FAQ and Step 2 mention inherited IRAs but not this case. lookup: that page, broader plan page, reader goal differs | Add one FAQ pointing to the full section | update existing body text | src/data/guides.ts slug what-to-do-with-an-inheritance | n/a | n/a | n/a | n/a | same as row 1 | same | short answer + link | FAQ |

## Emerging search patterns (clusters)
No emerging clusters detected this run.

## Exclusions
No new page: lookup found no page for this exact intent, but the nearest topical home (inherited-ira-taxes-explained) is a reasonable home, so enrich rather than duplicate. Duplicate check: passed — 1 new-page candidate checked, 0 matched an existing page (resolved as enrichment). No commits touch this topic.
