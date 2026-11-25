# Independent Phase 4 audit — 2026-11-25 tool-usage (HIGH profile; round 1 FAIL → targeted rework → round 2 PASS, budget exhausted, no liabilityBlock)

## Round 2 (final) — batch 1
# Phase 4 Round 2 audit, Batch 1 (audit-b1)

Snapshot: reports/mindmap-pass/2026-11-25-tool-usage/audit/preview-snapshot-r2.json. Review: reports/mindmap-pass/2026-11-25-tool-usage/audit/review-r2.json. Round 2 of 2 recorded; all 8 routes PASS (disposition publish); rendered check PASS; audit-analysis verified on all 8. For the 4 calculated routes I reran scripts/test-tool-usage-1125.mjs (134 checks pass) into audit/replay-r2-<slug>.json; each is identical to the saved output.json and was placed at analysis-reviews/<slug>.replay.json (the batch tool does not auto-replay a list-form command).

## Round-1 findings, verified against rendered output and saved sources
- SEP-1 partly fixed (see SEP-1b), SEP-2 fixed (FAQ answers yes with shared limits, matches Pub 560 lines 903-904 and 2152), SEP-3 fixed (2026 $184,500, 2027 $192,300, saved SSA Federal Register 2026-21796 contains 192,300; test line 42), SEP-4 fixed, SEP-5 fixed.
- W4V-1 fixed (title 59 chars), W4V-2 fixed (senior deduction effect stated for both examples; $2,055 and $3,462 recomputed, phase-out $75,000/$150,000 matches saved irs-senior-deduction.txt), W4V-3 fixed (irs-rp-2025-32.txt saved).
- CL-1 fixed (title 54 chars). COLA-1, COLA-2 fixed. G1-1 to G1-5 fixed ($6.50, $65.50, 2027 IRMAA $112,000/$224,000 and about 9% match saved CMS). SSDI-1, SSI-1, SSI-2, CH-1 fixed (no November 18 deadline left, list renders cleanly).
- No regressions found in the diff of rendered sentences.

## Remaining findings (non-blocking nits, not liabilityBlock)
- SEP-1b (nit): "Solo 401(k) employee deferrals ... can then be made by the filing deadline, including extensions" is not directly supported by Pub 560 (line 659 notes earlier DOL due dates; the first-year exception is 'without extensions'), and sits beside a 'without extensions' sentence. Suggest dropping "including extensions".

No liabilityBlock candidates.


## Round 2 (final) — batch 2 / couples
# Phase 4 Round 2 audit, Batch 2 (audit-b1)

Snapshot: audit/preview-snapshot-b2r2.json (couples route). Review: reports/mindmap-pass/2026-11-25-tool-usage/audit/review-b2r2.json. Round 2 of 2 recorded: /retirement/couples-retirement-calculator/ PASS (publish), rendered check PASS, audit-analysis verified.

## Round-1 findings verified
- M1-1 fixed: page renders Updated November 25, 2026 and dateModified 2026-11-25; retirement-income-calculator `updated` restored to 2026-08-30 (git diff shows only the couples bump and showBookPicks).
- PKT-1 fixed: couples packet is now basis reported with whyNoQuantitativeAnalysis and reasoning, no TODO; audit-analysis passes.
- PKT-2 fixed: irs-mileage-rate-2026 packet likewise reclassified; its round-1 PASS (review-b2.json, recorded, immutable) now passes audit-analysis and rendered-audit check on the exact projected subset (audit/approved-snapshot-irs.json, approved-review-irs.json, analysis audit/irs-mileage-rate-2026-analysis-b2.json). Note: running finish-audit on the whole review-b2.json still fails because its couples row is the older round-1 FAIL, so use the projected subset for publication of the mileage route and review-b2r2.json for couples.
- Books block re-checked in the hydrated DOM: one data-tool-picks block, three ASINs tagged soulcircle01-20, rel sponsored nofollow noopener noreferrer, disclosure, no prices, result unchanged.

## Remaining findings (nits, not liabilityBlock)
- M1-2b: shared ToolPicks link is 32px tall (below 40px).
- INH-1: inherited unsourced sentence "Couples who plan for retirement together typically build more wealth..." at the top of the couples page.
- F4-1 (mileage rate, round 1): pre-existing em-dashes and 46-char title, out of F4 scope.

No liabilityBlock candidates.


## Round 1 history (retained findings)
Round 1 batch 1: FAIL all 8 routes (see audit-b1.md). Round 1 batch 2: couples FAIL; mileage-rate PASS (analysis packet then completed); 6 link-only routes PASS (see audit-b2.md).

Remaining non-blocking nits: SEP-1b (deferral 'including extensions' wording), M1-2b (ToolPicks link 32px), INH-1 (couples opener unsourced sentence), F4-1 (pre-existing mileage em-dashes/title).
## Per-row disposition (final)
| Route | Row | Final audit result |
|---|---|---|
| /social-security-cola-calculator/ | F1/F2 | PASS (round 2) |
| /guides/2027-social-security-cola/, /guides/2027-ssdi-cola/, /guides/ssi-increase-2027/, /guides/social-security-changes-2027/ | F3/F5/F6/F7 | PASS (round 2) |
| /retirement/couples-retirement-calculator/ | M1 | PASS (round 2) |
| /mileage-deduction/irs-mileage-rate-2026/ | F4 | PASS (round 1, analysis packet completed afterwards) |
| /sep-ira-solo-401k-contribution-calculator/ | C1 | PASS (round 2) |
| /social-security-withholding-calculator/ | C2 | PASS (round 2) |
| /capital-loss-carryover-calculator/ | C3 | PASS (round 2) |
| /self-employment-tax/, /social-security-taxable-benefits-calculator/, /stock-capital-gains-tax-calculator/, /mileage-deduction/, /compare/sep-ira-vs-solo-401k, /guides/tax-loss-harvesting/ | L1-L3 | PASS (round 1, link-only) |

VERDICT: PASS
