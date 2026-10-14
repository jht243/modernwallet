# Phase 0 — manifest (tool-usage pass 2026-10-14, unattended — treated as approved)

Chart: `reports/mindmap-pass/2026-10-14-tool-usage.md` (filename date 2026-10-14, `mindmap_pass_date: 2026-10-14`, `status: ready-for-execution`, 0 days old).

**Project facts:** BASE_URL https://www.themodernwallet.com (astro.config `site`). Astro static build + React islands (`CalculatorIsland.tsx`); static output, no server 301s. Canonical from `BaseLayout.astro` (self-referential). Sitemap generated at build by `@astrojs/sitemap`. IndexNow key `public/dc557f6bfced447aa1a71771d8a0d24a.txt`. Tool page template: top-level calculator `src/pages/[category]/index.astro` driven by `src/data/calculators.ts` + `LIVE_IDS` in `src/data/registry.ts` + `CROSS_LINKS`; mirrored tools: /cd-calculator/, /loan-payment-calculator/ (7766f65). `data-tool={calc.id}` on the tool section. No `check-depth` script. Brand: ModernWallet. Push target: `main` via the run's deploy script. Content standard: plain, figure-first, every rate/limit cited to the official source, "Estimate only" disclaimers in tools.

**Emerging search patterns detected this run**

| Cluster (theme) | Member queries | Why emerging | Lever | Target | Format |
|---|---|---|---|---|---|
| HYSA vs CD (personal answer) | hysa vs cd calculator; cd vs high yield savings calculator; Is it better to put my money in a CD or Hysa? | intent mismatch (article only) | create new content | /hysa-vs-cd-calculator/ | calculator |
| Trump Account vs 529 | trump account vs 529 calculator; Can you have both a Trump Account and a 529 account? | intent mismatch; real seed-tool users | create new content | /trump-account-vs-529-calculator/ | calculator |
| Mortgage recast | mortgage recast calculator (18,100/mo); downsides/benefits of recasting (PAA) | coverage gap (FAQ definitions only) | create new content | /mortgage-recast-calculator/ | calculator |
| Existing-loan payoff | mortgage payoff calculator with remaining balance; remaining mortgage balance calculator | intent mismatch | update existing body text | AutoLoanCalculator.tsx (/mortgage/payoff-calculator/) | n/a |

**Question evidence flags:** row 14 (`/trump-account-vs-529-calculator/`) — "calculator" head has no completions (est. 0–25, NOT measured); PAA 1/6 both-accounts, 2/6 529 amounts, 3/6 off-topic (Dave Ramsey / boycotts / downsides). Tool-fix rows 1–6 are backed by real usage, not search demand.

| Phase | Rows | Plan |
|---|---|---|
| Duplicate check | 3 checked | **passed** — 3 new-page rows checked, 3 matched an existing page (every `create new content` row carries a `lookup:` entry from `scripts/mindmap/coverage_lookup.py`; none has the same reader goal); adversarial reviewer GATE: PASS (1 wording correction applied to row 15) |
| 1 — Cannibalization detection (advisory) | 1 | FLAG /hysa-vs-cd-calculator/ vs /compare/hysa-vs-cd (same topic, article vs calculator) — differentiate, link both ways; **no edits, detection only** |
| 2 — Metadata | 0 | skipped — no rows (tool-fix guardrail: no title/meta/H1 changes) |
| 3 — New content | 3 | Create /hysa-vs-cd-calculator/ [calculator, depth matching /cd-calculator/, BUILT in 3c] — answers "Is it better to put my money in a CD or a high-yield savings account?" in section 1; create /trump-account-vs-529-calculator/ [calculator, BUILT in 3c] — answers "Can you have both a Trump Account and a 529, and which should get this year's money?" in section 1; create /mortgage-recast-calculator/ [calculator, BUILT in 3c] — answers "How much will my payment drop if I recast my mortgage?" in section 1 |
| 4 — Audit | — | Adversarial review of 3 new tool pages + 6 tool-fix diffs + 6 tool-monetize diffs (tool checklist + STEP 3 guardrails + ASIN re-resolve) |
| 5 — Body text | 13 | 7 `tool fix` (row 16 added mid-run after a browser sweep found the same decimal bug on 15 more calculators; chart gate re-run): decimal-safe rate/percent inputs on 15 calculators (row 16); AutoLoanCalculator APR decimal (/mortgage/payoff-calculator/ + /auto-loan/amortization-schedule/); AutoLoanCalculator existing-loan mode; RetirementCalculator today's-dollars total; InvestmentCalculator after-tax interest; MileageDeductionCalculator employee/Topic 511 note; PortfolioCalculator over/under-target line. 6 `tool monetize`: further-reading books under the result in mortgage, retirement, investing, mileage-deduction, portfolio, trump-account |
| 6 — Internal linking | 3 + inbound | "Next step" links: HYSA page → /hysa-vs-cd-calculator/; /trump-account/ → /trump-account-vs-529-calculator/; /mortgage/payoff-calculator/ + /mortgage/early-payoff-calculator/ → /mortgage-recast-calculator/; plus CROSS_LINKS / hub listing |
| 7 — Sitemap + IndexNow | — | 3 routes added via @astrojs/sitemap at build; prepare IndexNow list of 3 new + changed URLs |
| 8 — Summary | — | Print run summary, then auto-continue to Phase 9 (no approval stop) |
| 9 — Commit + deliver | — | Single commit; deploy to main; 200-verify; IndexNow; report SHA |
