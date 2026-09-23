# Phase 0 discovery — competitor-monitor (2026-09-23 run)

Comparison discovery reused verbatim from `reports/comparison-content-creator/discovery.md` (stable across runs; BASE_URL https://www.themodernwallet.com, Astro 4 static + React islands, brand ModernWallet).

- **Roster**: `scripts/competitor_monitor/competitors.json` — 12 enabled competitors (Calculator.net, Omni Calculator, The Calculator Site, MortgageCalculator.org, SmartAsset, Bankrate, NerdWallet, CalcXML, Dinkytown, Financial Mentor, Investor.gov, Investopedia). Niche include/exclude terms unchanged.
- **Ledger**: `reports/competitor-monitor/ledger.json` — 12 competitors tracked. Not a first run.
- **Previous baseline chart**: `reports/competitor-monitor/baseline-2026-09-22.md` / `.json` — most recent. This run's new chart (`baseline-2026-09-23`) diffs against it.
- **Existing tools/interactives**: `src/pages/calculators/` + `src/lib/*` engines + React islands (`src/components/*`), SoftwareApplication JSON-LD convention per CONTENT.md. Phase 3c mirrors this for NET-NEW tool candidates.
- **Publish path**: commit on `claude/weekly-competitor-7lrwr4`, then `git fetch origin main && git rebase origin/main && git push origin HEAD:main`. Typecheck: `npx tsc --noEmit`; build: `npm run build`.
- **Reusable scripts**: `scripts/submit_indexnow.py`, `scripts/lib/content_gen.py`, `scripts/lib/keyword_data.py`, `scripts/competitor_monitor/scraper.py` (detect/record/show/baseline).
- **Run cadence**: 3x/week; last run 2026-09-22 completed and pushed to main. This is a normal continuation run.

Auto-continue to Phase 1.
