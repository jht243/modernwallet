# Phase 0 discovery — competitor-monitor (2026-09-18 run)

Comparison discovery reused verbatim from `reports/comparison-content-creator/discovery.md` (written this run).

- **Roster**: `scripts/competitor_monitor/competitors.json` — 12 enabled competitors (Calculator.net, Omni Calculator, The Calculator Site, MortgageCalculator.org, SmartAsset, Bankrate, NerdWallet, CalcXML, Dinkytown, Financial Mentor, Investor.gov, Investopedia). Niche include/exclude terms defined (personal finance calculators, loans, mortgage, retirement, investing, credit, tax, etc.; excludes crypto/gambling).
- **Ledger**: `reports/competitor-monitor/ledger.json` — 12 competitors tracked, all previously seeded. Not a first run. Last crawl dates 2026-09-16 for 9/12 (investor.gov, mortgagecalculator.org, thecalculatorsite.com show 0 pages/no last_crawled — likely scrape failures/blocked, persistent across prior runs per history).
- **Previous baseline chart**: `reports/competitor-monitor/baseline-2026-09-16.md` / `.json` — most recent, dated 2026-09-16. This run's new chart (`baseline-2026-09-18`) will diff against it.
- **Existing tools/interactives**: `src/pages/calculators/` + `src/lib/*` engines + React islands (`src/components/*`), SoftwareApplication JSON-LD convention per CONTENT.md. Phase 3c mirrors this pattern for NET-NEW tool candidates; no dedicated tools sitemap file (site uses the single @astrojs/sitemap-generated sitemap, filtered by noindex.ts).
- **Run cadence**: 3x/week; prior runs 2026-09-14 and 2026-09-16 both completed and pushed to main (commits 2cff98e, 5a18c4f). This is a normal continuation run, not a first run.

Auto-continue to Phase 1.
