# Competitor Monitor — Discovery (2026-07-08)

Reuses `reports/comparison-content-creator/discovery.md` (2026-07-06) for site facts:
BASE_URL https://www.themodernwallet.com, Astro 4 static build, brand ModernWallet,
comparisons in `src/data/comparisons.ts` + `/compare/[slug].astro`, guides in
`src/data/guides.ts` + `/guides/[slug].astro`, calculators in `src/data/calculators.ts`,
sitemap auto-generated (@astrojs/sitemap), IndexNow key present, remote `jht243/modernwallet`.

## Competitor-monitor-specific

- **Roster:** `scripts/competitor_monitor/competitors.json` — 12 competitors enabled.
- **Ledger:** `reports/competitor-monitor/ledger.json` — not a first run; all 12 previously seeded (3 unseedable so far: The Calculator Site, MortgageCalculator.org, Investor.gov — all 403/404 on every sitemap URL tried, left unseeded, will retry next run).
- **Previous baseline chart:** `reports/competitor-monitor/baseline-2026-07-03.md` / `.json` — 12 competitors, 17,083 on-niche URLs, 901 tools, 934 comparisons tracked at baseline.
- **Existing tools/interactives:** `src/data/calculators.ts` + dedicated calculator routes (pattern Phase 3c would mirror if a tool candidate were selected this run — none were).
- **Tools sitemap:** covered by the single auto-generated `@astrojs/sitemap` output; no separate tools sitemap.

## Known scraper relevance-gate defect (flagged, not fixed this run — out of scope)

The niche include-list contains the bare word `"calculator"`, so the gate treats **any**
page whose title/outline contains "calculator" as on-niche — including Omni Calculator's
non-finance verticals (biology, math, conversion, health). Observed false positives this
run: "Mutation Frequency Calculator" (biology), "Equation of a Plane Calculator" (math),
"Yards to Acres Calculator" (conversion). These were manually excluded from this run's
shortlist rather than trusted from the automated gate. Recommend narrowing the gate in a
future maintenance pass (e.g. require a finance-domain co-occurring term alongside
"calculator", not the bare word alone).

## Phase 1 scrape result (2026-07-08)

`python3 scripts/competitor_monitor/scraper.py detect` → 938 raw candidates (879 `updated`,
59 `new`); 34 off-niche skipped; 38 fetch failures (mostly 403/404 sitemap probes on
already-known-flaky competitors).

The `updated` bucket is overwhelmingly a false-positive artifact: the 2026-07-03 baseline
seed recorded URLs without content hashes (`content_hash: ""`), so this run's first real
hash computation reads as "changed" for nearly every previously-seeded page (e.g.
Calculator.net: 221/222 pages flagged updated). This is not evidence of 879 real content
changes. Treated as **not actionable signal** this run; only the `new` bucket (59 URLs,
unambiguous — first time these URLs have ever been seen) was used to build the shortlist.

## This run's curated shortlist (cap = 10, manually niche-filtered from the 59 `new` items)

Excluded from the 59 `new` candidates before selection: daily/dated "mortgage rates today"
news snapshots (stale within a day, not evergreen — poor fit for a duplicate-and-improve
pass), SmartAsset `/advisor-resources/*` B2B pages aimed at financial-advisor
professionals (wrong audience — ModernWallet is a consumer site), Omni Calculator
off-niche calculators (biology/math/conversion — gate defect above), oil-market/oil-stock
speculative investing pieces (outside this project's existing entity universe / investment
guidance appetite), and generic travel/credit-card-perks/food-deal news (off-niche).

1. SmartAsset — Is HELOC Interest Tax Deductible? IRS Rules and Limits
2. SmartAsset — What Happens to Your 401(k) When You Die? Beneficiary Rules
3. SmartAsset — 2026 Eligibility Requirements for VA Loans
4. SmartAsset — 2026 VA Funding Fee: Complete Guide
5. SmartAsset — A 2026 Guide to HSA Investments
6. SmartAsset — Medicare Extra Help Income Limits for 2026
7. SmartAsset — Do I Need a Financial Advisor for My 401(k)?
8. SmartAsset — Who Is Exempt From Federal Income Tax: Individuals and Groups
9. NerdWallet — Best Small-Business Tax Services of 2026
10. NerdWallet — What Credit Score Do You Need for a 0% APR Credit Card?

All 10 are `kind: page` (no `tool` candidates survived curation) → Phase 3c (tool build)
is a no-op this run.

**Auto-continue to Phase 2 (dedup).**
