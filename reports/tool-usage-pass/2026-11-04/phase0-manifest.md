# Phase 0 manifest — mindmap-pass 2026-11-04 (tool-usage)

Chart: `reports/mindmap-pass/2026-11-04-tool-usage/approval-chart.md` (deterministic render, validate-chart OK) and its machine mirror `reports/mindmap-pass/2026-11-04-tool-usage.md` (0 days old). Unattended run — the scheduled /tool-usage-mindmap-auto routine is the recorded authorization; manifest treated as approved per STEP 5.

Project facts: BASE_URL https://www.themodernwallet.com · Astro static + React islands (CalculatorIsland.tsx) · deploys from main · canonical self-referential from the layout · IndexNow key file in public/ · sitemap built by @astrojs/sitemap · calculator registry src/data/calculators.ts + src/data/registry.ts LIVE_IDS + src/data/cross-links.ts; page date field `updated` · no check-depth script · brand ModernWallet · build `npm run build`.

## Preparation check
| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | [readiness](../../mindmap-pass/2026-11-04-tool-usage/readiness.md); independent chart review PASS (chart-review.json, round 2) |

## Duplicate check
passed -- 2 new-page rows checked, 0 matched an existing page (coverage_lookup + independent reviewer: KEEP /biweekly-mortgage-calculator/, KEEP /pay-off-mortgage-or-invest-calculator/)

## Emerging search patterns detected this run
| Cluster (theme) | Member queries | Why emerging | Lever | Target | Format |
|---|---|---|---|---|---|
| Mortgage prepayment schedules | biweekly mortgage calculator (1,900); bi weekly mortgage calculator (720); biweekly mortgage payment calculator (480) | coverage gap | create new content | /biweekly-mortgage-calculator/ | calculator |
| Pay off mortgage or invest | pay off mortgage or invest calculator (260); pay off mortgage vs invest calculator (260); should i pay off my mortgage or invest (590) | intent mismatch | create new content | /pay-off-mortgage-or-invest-calculator/ | calculator |

Question evidence flags: C1 `[verb-only — no PAA, no completions]`; tool-fix rows are persona-walkthrough backed (no GSC).

| Phase | Rows | Plan |
|---|---|---|
| 1 — Cannibalization (advisory) | 0 | skipped — no rows |
| 2 — Metadata | 0 | skipped — no rows |
| 3 — New content | 2 | Create /biweekly-mortgage-calculator/ [calculator, BUILT in 3c] — answers "How much faster do biweekly mortgage payments pay off my loan?" in section 1; create /pay-off-mortgage-or-invest-calculator/ [calculator, BUILT in 3c] — answers "Should I pay off my mortgage or invest the money?" in section 1 |
| 4 — Audit | — | Adversarial review of 2 new pages + 13 tool fix/monetize diffs + rendered snapshots |
| 5 — Body text (tool fix / tool monetize) | 13 | F1 Florida exemption banding + approved wording + newcomer toggle; F2/M2 inflation hints, chips, year table + books; F3/M3 SS taxable copy + books; F4/M4 self-employment $400 floor, QBI test, due dates + books; F5/M5 stock CG room-after-sale, loss stats + books; F6/M6 elder-care $$ bug, shortfall basis, $217 copay + books; F7/M7 probate copy, small-estate line, Texas note + books |
| 6 — Internal linking | 2 + inbound | Link C1 from /mortgage/extra-payment-calculator/ FAQ and /mortgage-recast-calculator/ cross-links; C2 from /guides/pay-off-mortgage-early-or-invest/ and /compare/pay-off-mortgage-vs-invest/; date bumps |
| 7 — Sitemap + IndexNow | — | build regenerates sitemap; IndexNow list of new + changed URLs |
| 8 — Summary | — | auto-continue |
| 9 — Commit + deliver | — | single commit, deploy helper push, live verify, IndexNow |
