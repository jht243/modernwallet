# Phase 0 — manifest (tool-usage pass 2026-10-11, unattended — treated as approved)

Chart: `reports/mindmap-pass/2026-10-11-tool-usage.md` (filename date 2026-10-11, `mindmap_pass_date: 2026-10-11`, `status: ready-for-execution`, 0 days old).

**Project facts:** BASE_URL https://www.themodernwallet.com (astro.config `site`). Astro 4 static build + React islands (`CalculatorIsland.tsx` `client:only`); static output, so no server 301s. Canonical comes from `BaseLayout.astro` (`<link rel="canonical">`, self-referential). Sitemap: generated at build by `@astrojs/sitemap` (filter: noindex paths). IndexNow key: `public/dc557f6bfced447aa1a71771d8a0d24a.txt`. Tool page template: top-level calculator hub `src/pages/[category]/index.astro` driven by `src/data/calculators.ts` + `LIVE_IDS` in `src/data/registry.ts` + `CROSS_LINKS`; mirrored tool: `/expense-ratio-calculator/` (755ac39). `data-tool={calc.id}` on the tool section. No `check-depth` script. Brand: ModernWallet. Push target: `main` via `.claude/scripts/deploy-run-to-main.sh push`. Content standard: plain, figure-first, every rate/limit cited to the official source (IRS, SSA, FDIC), "Estimate only" disclaimers in tools.

**Emerging search patterns detected this run**

| Cluster (theme) | Member queries | Why emerging | Lever | Target | Format |
|---|---|---|---|---|---|
| Social Security break-even | social security break even calculator; when to take social security calculator; …by age | coverage gap; real user of the seed tool needs it next | create new content | /social-security-break-even-calculator/ | calculator |
| Mileage reimbursement | mileage reimbursement calculator; irs mileage reimbursement calculator; cents per mile calculator | coverage gap (guides only) | create new content | /mileage-reimbursement-calculator/ | calculator |
| Portfolio rebalancing | portfolio rebalancing calculator; rebalance portfolio calculator; portfolio allocation calculator | intent mismatch (guide only) | create new content | /portfolio-rebalancing-calculator/ | calculator |

**Question evidence flags:** row 10 (`/portfolio-rebalancing-calculator/`) is `[verb-only — no PAA, no completions]`; row 7 (liquid net worth tool fix) has `[PAA 3/6 off-topic]` (half off-topic: wealth thresholds/averages); row 8's head returned no PAA (question from 11/11 autocomplete completions).

| Phase | Rows | Plan |
|---|---|---|
| Duplicate check | 3 checked | **passed** — 3 new-page rows checked, 3 matched an existing page (every `create new content` row carries a `lookup:` entry from `scripts/mindmap/coverage_lookup.py`; none has the same reader goal); adversarial reviewer GATE: PASS after 1 rework |
| 1 — Cannibalization detection (advisory) | 2 | FLAG /social-security-break-even-calculator/ vs /retirement/social-security-retirement-calculator/ (break-even FAQ overlap) — differentiate, link both ways; FLAG /mileage-reimbursement-calculator/ vs /guides/state-mileage-reimbursement-law-california-texas-michigan (guide title starts "Mileage Reimbursement Calculator California") — differentiate; **no edits, detection only** |
| 2 — Metadata | 0 | skipped — no rows (tool-fix guardrail: no title/meta/H1 changes) |
| 3 — New content | 3 | Create /social-security-break-even-calculator/ [calculator, tool-page depth matching /expense-ratio-calculator/, BUILT in Phase 3c] — answers "At what age does waiting to claim Social Security pay off?" in section 1; create /mileage-reimbursement-calculator/ [calculator, BUILT in 3c] — answers "How do I calculate mileage reimbursement?" in section 1; create /portfolio-rebalancing-calculator/ [calculator, BUILT in 3c] — answers "How much of each fund do I buy or sell to get back to my target allocation?" in section 1 |
| 4 — Audit | — | Adversarial review of 3 new tool pages + 6 tool-fix diffs (tool checklist + STEP 3 guardrails) |
| 5 — Body text | 8 | 7 `tool fix` rows: InvestmentCalculator (decimal + savings labels + compare APY) on /investing/high-yield-savings-calculator/; TrumpAccountCalculator (decimal + cap labels + seed note) on /trump-account/; RetirementCalculator (decimal + SS benefit field + total income) on /retirement/social-security-retirement-calculator/; PortfolioCalculator (decimal + assumptions + 60/40 gap) on /portfolio/60-40-portfolio-calculator/; MileageDeductionCalculator (decimal + larger checkbox) on /mileage-deduction/irs-mileage-rate-2026/; NetWorthCalculator (decimal + liquid focus + definition) on /net-worth/liquid-net-worth-calculator/; plus calc-ui MoneyInput; 1 prose row: /retirement/social-security-retirement-calculator/ earnings-test sentence → 2026 SSA figures — answers "What is the Social Security earnings limit for 2026?" at section 2 |
| 6 — Internal linking | 3 + inbound | Inbound "next step" links to each new tool from its seed page (retirement SS page, mileage 2026 page, 60/40 page) plus CROSS_LINKS / hub listing |
| 7 — Sitemap + IndexNow | — | 3 routes added via @astrojs/sitemap at build; lastmod via `updated`; prepare IndexNow list of 3 new + 6 changed URLs |
| 8 — Summary | — | Print run summary, then auto-continue to Phase 9 (no approval stop) |
| 9 — Commit + deliver | — | Single commit; deploy-run-to-main.sh push to main; 200-verify; IndexNow; report SHA |
