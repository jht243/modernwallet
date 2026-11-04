# Phase 8 summary — mindmap-pass 2026-11-04 (tool-usage)

| Phase | Rows | Outcome |
|---|---|---|
| 1 — Cannibalization detection (advisory) | 0 | No pairs flagged; no canonical or 301 written. |
| 2 — Metadata | 0 | Skipped — no rows (titles/meta/H1 of fixed tools unchanged). |
| 3 — New content | 2 | Built /biweekly-mortgage-calculator/ (1,066 body words) and /pay-off-mortgage-or-invest-calculator/ (1,048) — React islands mirroring /mortgage-recast-calculator/; prose by content_gen (claude-opus-5-5, no fallback). |
| 4 — Audit | 2 pages + 13 tool rows | Two independent auditors. Round 1 FAIL (tee-up records, 3 semicolons, 2 FAQ dead ends, inherited contradictions on 3 affected pages, 2 missed date bumps, an unlinked directive). Round 2: tools PASS; pages FAIL on one elder-care sentence + 2 routes missing from the render manifest. Round 3: see audit.md. depth: 2/0 passing (calculator framing pages, compared with the 802-word mirror), median 1,057 words. Chart review: 3 rounds (C2 model leftover-cash bug found and fixed; case receipts redone). |
| 5 — Body text (tool fix / monetize) | 13 | F1 Florida banded exemption fix + approved wording + newcomer toggle; F2/M2 inflation chips, year table, books; F3/M3 SS taxable copy + books; F4/M4 SE $400 floor, QBI threshold/test fix, due dates + books; F5/M5 stock CG room-after-sale + loss stats + books; F6/M6 elder-care $$ bug, rising-cost shortfall, $217 copay + books; F7/M7 probate copy, small-estate line, Texas note + Nolo books. |
| 6 — Internal linking | 2 + inbound | Biweekly ← /mortgage/extra-payment-calculator/ FAQ + /mortgage-recast-calculator/ cross-links; payoff-or-invest ← /guides/pay-off-mortgage-early-or-invest/ + /compare/pay-off-mortgage-vs-invest/; the two new tools cross-link each other. 2 inbound each (no further natural placements without forcing). Homepage header untouched. |
| 7 — Sitemap + IndexNow prep | — | Sitemap built by @astrojs/sitemap (both routes present); IndexNow list of 29 indexable new/changed URLs at reports/mindmap-pass/2026-11-04-tool-usage.indexnow.txt (noindex probate/elder-care spokes excluded). |

## Question coverage
- /biweekly-mortgage-calculator/ — asked "How much faster do biweekly mortgage payments pay off my loan?" [verb-only - no PAA, no completions] → answered in section 1 (intro + tool result).
- /pay-off-mortgage-or-invest-calculator/ — asked "Should I pay off my mortgage or invest the money?" [PAA 0; ac ~27/37 verdict-pattern] → answered in section 1.
- Tool-fix rows: persona-walkthrough backed (no GSC access). Run-wide: 1 completion-backed, 1 verb-only, 0 off-topic PAA flags.

## Emerging search patterns actioned
- cluster "Mortgage prepayment schedules" → create new content → [calculator] → /biweekly-mortgage-calculator/ (built)
- cluster "Pay off mortgage or invest" → create new content → [calculator] → /pay-off-mortgage-or-invest-calculator/ (built)

## Evidence and growth
- Both new tools: basis calculated (evidence/<slug>/evidence.json, executed calc.py, replayed by the auditor); growth.json files linked from the render manifest; registered in reports/content-evidence.jsonl by rendered-audit.py record-deployment after live verification.

## Noteworthy
- Inherited fixes on affected pages: extra-payment FAQ figure and dead CFPB citation; set-aside page "$400 floor" wording; elder-care page $209.50 → $217.00 and its worked-example arithmetic.
- Noindex routes (site policy): elder-care LTC and three probate spokes reviewed from hydrated DOM; not captured by rendered-audit.py and not sent to IndexNow.
- content_gen: CONTENT_ANTHROPIC_KEY (key 1) reported a low credit balance; key 2 served all calls.
- Not done (next in line): shared "Skip to the calculator" template link; depreciation-recapture, 1031-exchange, SS withholding, capital-loss carryover, Florida portability, historical CPI, SEP/Solo 401(k) calculators.

All work is staged on branch claude/upbeat-brown-k661dd. Continuing to Phase 9 (commit + push).
