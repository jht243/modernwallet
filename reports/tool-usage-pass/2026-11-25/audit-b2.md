# Phase 4 Audit, Batch 2 (audit-b1), job 2026-11-25-tool-usage

Snapshot: reports/mindmap-pass/2026-11-25-tool-usage/audit/preview-snapshot-b2.json. Recorded review (frozen): reports/mindmap-pass/2026-11-25-tool-usage/audit/review-b2.json. Round 1 of max 2 recorded for all 8 routes. No liabilityBlock candidates.

## Recorded verdicts (round 1)
- /retirement/couples-retirement-calculator/ FAIL (roundsRemaining 1)
- /mileage-deduction/irs-mileage-rate-2026/ PASS recorded on the rendered review, BUT audit-analysis BLOCKED, see PKT-2
- /self-employment-tax/, /social-security-taxable-benefits-calculator/, /stock-capital-gains-tax-calculator/, /mileage-deduction/, /compare/sep-ira-vs-solo-401k, /guides/tax-loss-harvesting/ PASS (link-only)

## Findings
- M1-1 (FAIL, couples): Substantive body edit (M1 books block) but the couples spoke has no `updated` bump. Page renders Updated November 24, 2026 and dateModified 2026-11-24, not 2026-11-25. The bump was applied to the wrong neighbouring entry: `retirement-income-calculator` in src/data/spokes-retirement.ts changed `updated` 2026-08-30 to 2026-11-25 with no edit (outside this batch; date churn). Fix: set couples `updated` to 2026-11-25, revert retirement-income-calculator to 2026-08-30. Not a liabilityBlock.
- PKT-1 (FAIL, couples) and PKT-2 (FAIL, irs-mileage-rate-2026): evidence/<slug>/evidence.json is an unfilled init skeleton (13 TODO placeholders each, including presentationArtifacts path/sha256, model code/output hashes, finding, counterexample). audit-analysis fails with "Artifact missing: TODO: interactive component path", so the mileage-rate route cannot be released even though its rendered review was recorded PASS (recorded before the gate ran; the record is immutable, and I did not re-record). Fix needs no content change: complete the packet or reclassify the row as source-only/no-analysis with reasoning, then rerun audit-analysis. Not a liabilityBlock.
- M1-2 (nit): the shared ToolPicks "Check price on Amazon" link is 32px tall (below the 40px target); pre-existing style, new block inherits it.
- F4-1 (nit, mileage-rate): pre-existing em-dashes and a 46-character title; F4 is additive, so out of scope.

## Verified
- M1: hydrated DOM (headless Chrome, dist) shows exactly one data-tool-picks block, three links to ASINs 1945640197, 1982115831, 1119847672 (re-resolved with scripts/tool_usage/amazon_pick.py to the expected titles), tag soulcircle01-20, rel "sponsored nofollow noopener noreferrer", disclosure "As an Amazon Associate we earn from qualifying purchases", no prices, result unchanged ($3,799,914 / $12,666). The three picks are all books (planning, decumulation, investing basics), matching the manifest's product-type list. Code has one conditional block, gated on !showSocialSecurity, so the "Behind" state shows the same block with a different heading (code reviewed, not rendered).
- F4: intro adds one link to #estimate-deduction; element id=estimate-deduction carries data-tool="mileage-deduction"; title/meta/H1 unchanged in the diff; toggle buttons minHeight 40, row minHeight 44 as a label wrapping a 28px checkbox (whole row tappable; judged adequate; tap targets were not measured in a rendered 390px viewport, code only). Worked example arithmetic recomputed ($8,910, $8,700, $13,400, 26.13%).
- Link-only rows: links present at manifest placements (verified in rendered text), prior updated dates preserved (11-04, 10-14, 11-24).

VERDICT: FAIL
