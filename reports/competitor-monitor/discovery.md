# ModernWallet — Competitor Monitor Discovery
_Generated: 2026-07-01_

## Reused facts (from comparison-content-creator/phase-0, 2026-06-27, still current)
- **BASE_URL:** `https://www.themodernwallet.com`
- **Framework:** Astro 4.x static export, `@astrojs/sitemap` auto-generated, `@astrojs/react` islands for calculators.
- **Business name:** ModernWallet
- **Content homes:**
  - Comparisons: `src/data/comparisons.ts` (`ComparisonEntry[]`) → `src/pages/compare/[slug].astro`
  - Guides: `src/pages/guides/[slug].astro` + index (data-driven, guides data file)
  - Roundups: `src/pages/roundup/[slug].astro`
- **Existing content inventory:** 7 calculator hubs (auto-loan, mortgage, retirement, investing, portfolio, real-estate, net-worth) + spokes, 11+ comparison pages already published (401k-vs-roth-ira, stocks-vs-bonds, hysa-vs-money-market, hysa-vs-cd, roth-401k-vs-traditional-401k, 15-year-vs-30-year-mortgage, brokerage-vs-ira, fixed-vs-arm-mortgage, renting-vs-buying, 529-vs-roth-ira, etf-vs-mutual-fund, +2 more from 3013741), guides (persona + thin-content fixes), roundup pages (9+).
- **Interactive tools:** React islands in `src/components/*Calculator.tsx`, mounted via `CalculatorIsland.tsx`; hub+spoke route pattern under `/[category]/`.
- **IndexNow key:** none in `public/` → IndexNow skipped (unchanged from prior runs).
- **Typecheck/build:** `npx tsc --noEmit`, `npm run build` (astro build).
- **Git push flow:** `git push origin HEAD` on the current cloud branch (never `main` directly — hard rule for this skill).

## Competitor-monitor-specific
- **Roster:** `scripts/competitor_monitor/competitors.json` — 12 enabled competitors (Calculator.net, Omni Calculator, The Calculator Site, MortgageCalculator.org, SmartAsset, Bankrate, NerdWallet, CalcXML, Dinkytown, Financial Mentor, Investor.gov, Investopedia). Niche include/exclude terms present (personal-finance calculators/guides; excludes crypto/gambling/forex).
- **Ledger:** `reports/competitor-monitor/ledger.json` — `{"version":1,"competitors":{}}`. Empty → this is effectively the first detect run (infra was committed in c1640bd but `detect` has not yet been executed/recorded).
- **Previous baseline chart:** none found (`reports/competitor-monitor/baseline-*.{md,json}` absent). First run — baseline gets created in Phase 6.
- **Tools sitemap:** none manual (auto-generated sitemap covers everything under `src/pages`).

## Note
First-run semantics apply per the scraper's own design: the first crawl of each competitor is a quiet seed (baseline only, 0 candidates), so this run is expected to seed the ledger with **0 actionable candidates**.

**Auto-continue to Phase 1.**
