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

VERDICT: PASS
