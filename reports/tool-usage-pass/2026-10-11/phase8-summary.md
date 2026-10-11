# Phase 8 — Summary (tool-usage pass 2026-10-11, themodernwallet.com)

| Phase | Rows | Outcome |
|---|---|---|
| 1 — Cannibalization detection (advisory) | 2 | 2 pairs flagged (break-even vs SS retirement calculator; reimbursement calculator vs CA/TX/MI state-law guide) — differentiate, 0 edits, no canonical or 301 written |
| 2 — Metadata | 0 | nothing to do (tool-fix guardrail: no title/meta/H1 changes) |
| 3 — New content | 3 | built /social-security-break-even-calculator/ (1,056 words), /mileage-reimbursement-calculator/ (1,033), /portfolio-rebalancing-calculator/ (994); prose by content_gen.py (claude-opus-5-5, second key — first key out of credit; no fallback model used) |
| 4 — Audit | 3 pages + 7 diffs | round 1: 3 Rung-1 fixes (earnings-test sentence, portfolio assumptions scope, $0-benefit break-even); round 2 VERDICT: PASS. depth: 3/0 passing, median 1,033 words (tool-page bar 1,019) |
| 5 — Body text | 8 | 7 tool fixes (decimal-safe inputs in 6 tools + calc-ui; HYSA APY labels + compare APY; Trump cap labels + seed note; SS benefit field + total income; 60/40 gap + assumptions; 20px mileage checkbox; liquid-net-worth focus) + SS page: 2026 earnings test, 67→70 break-even 81 → 82½, $2,816 → $2,728 |
| 6 — Internal linking | 3 new pages | inbound: SS page sentence + retirement cross-links → break-even; mileage 2026 page sentence + state guide + mileage cross-links → reimbursement; 60/40 page sentence + rebalancing guide + portfolio cross-links → rebalancing. Header/nav untouched (calculator menu auto-lists by navOrder) |
| 7 — Sitemap + IndexNow prep | — | 3 routes added via @astrojs/sitemap at build (site emits no lastmod); IndexNow list of 9 URLs prepared (submitted post-deploy, live only) |

**Cannibalization advisory:** /social-security-break-even-calculator/ (new) vs /retirement/social-security-retirement-calculator/ (GSC n/a; 10 tool users) — cluster "when to take social security" → differentiate. /mileage-reimbursement-calculator/ (new) vs /guides/state-mileage-reimbursement-law-california-texas-michigan (GSC n/a) — cluster "mileage reimbursement calculator" → differentiate (human may retitle the guide). No canonical or 301 was written.

**Emerging search patterns actioned:** cluster "Social Security break-even" → create new content → [calculator] → /social-security-break-even-calculator/ (built); cluster "Mileage reimbursement" → create new content → [calculator] → /mileage-reimbursement-calculator/ (built); cluster "Portfolio rebalancing" → create new content → [calculator] → /portfolio-rebalancing-calculator/ (built).

**Question coverage:**
- /social-security-break-even-calculator/ — asked "At what age does waiting to claim Social Security pay off?" [PAA 0; ac 11/11] → answered in section 1
- /mileage-reimbursement-calculator/ — asked "How do I calculate mileage reimbursement?" [PAA 3/6; ac 3/4] → answered in section 1
- /portfolio-rebalancing-calculator/ — asked "How much of each fund do I buy or sell…?" [verb-only — no PAA, no completions] → answered in section 1
- /retirement/social-security-retirement-calculator/ — asked "What is the Social Security earnings limit for 2026?" [ac 1/1] → answered in section 2 (earnings-test passage)
- 6 tool-fix rows answer their page's existing question in section 1 (the calculator).
Counts: 9 of 10 rows PAA/completion-backed, 1 verb-only; 1 row (liquid net worth) flagged half off-topic PAA.

**Next in line (specced):** /hysa-vs-cd-calculator/, /trump-account-vs-529-calculator/ (reports/mindmap-pass/specs/).

**Noteworthy:** the decimal-drop bug also exists in ~46 other calculators with local input helpers (not touched this run). The couples retirement page (/retirement/couples-retirement-calculator/) still says the 67→70 break-even is "roughly age 81" (correct per SSA percentages: about 82½) — not edited this run. No GSC credentials in the cloud, so persona evidence used page titles/H1s.

Files: 22 source files changed/added + reports. Branch: claude/tool-usage-modernwallet-6pqn0d. Continuing to Phase 9 (commit + push)...
