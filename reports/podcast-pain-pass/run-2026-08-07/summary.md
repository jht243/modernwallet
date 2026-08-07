# podcast-pain-pass run summary — 2026-08-07

## Episodes pulled per show (90 total)
- Ready For Retirement: 12 (across two pull windows this session)
- How to Money: 12
- Suze Orman's Women & Money: 12
- The Better Budgeting Podcast: 12
- Catching Up to FI: 6 (see bug note below — 0 on first attempt)
- The Simply Investing Dividend Podcast: 12
- Rental Income Podcast With Dan Lane: 12
- The Personal Finance Club Show: 12

Two bugs in `scripts/podcast_pain_pass/pull_new_episodes.py` were found and fixed this run:
1. `show["topic"]` didn't match `feeds.json`'s actual `"vertical"` key — every run crashed before pulling anything. Fixed to read `vertical`.
2. `field()`'s tag-stripping regex swallowed CDATA-wrapped `<guid>`/`<link>` content whole (no `>` inside `<![CDATA[...]]>` until the end), producing empty guids and silently 0-pulling any CDATA-feed show (Catching Up to FI / libsyn). Fixed to extract CDATA content directly.

## Pain clusters mined (263 sentences across 6 site themes)
investing 103 · tax-estate 50 · budget 42 · retirement 38 · real-estate 17 · net-worth 13

## Validated terms
- Lens 1 (direct-intent, floor 70/mo): 21/23 candidate terms validated — but ALL 21 came back **already covered** by this site's existing 95 guides / 80+ comparisons / 9 calculator hubs on independent dedup review.
- Lens 2 (autocomplete adjacent-demand, 10 seeds) + Lens 3 (entity vs/alternatives): 8 clusters/entity gaps survived dedup, +1 carried-forward deferred row (target-date-fund-vs-sp500).

## What was deduped (dropped, already covered)
- All 21 Lens-1 direct-intent terms (see chart.md exclusions for evidence per term).
- `reit-vs-rental-property` — dropped by the independent adversarial dedup reviewer as substantively covered by `/guides/real-estate-investment-options/`'s dedicated REIT section + head-to-head FAQ.

## What shipped (13 rows: 9 new pages + 4 body-text enrichments)

### New pages
- [What Is a Good Credit Score?](https://www.themodernwallet.com/guides/what-is-a-good-credit-score/)
- [How Much Do I Need to Retire by Age?](https://www.themodernwallet.com/guides/how-much-do-i-need-to-retire-by-age/)
- [Mega-Backdoor Roth 401(k)](https://www.themodernwallet.com/guides/mega-backdoor-roth-401k/)
- [How to Budget for Teens and College Students](https://www.themodernwallet.com/guides/how-to-budget-for-teens-college-students/)
- [Net Worth for FAFSA and Accredited Investor Tests](https://www.themodernwallet.com/guides/net-worth-for-fafsa-and-accredited-investor/)
- [VOO vs SPY](https://www.themodernwallet.com/compare/voo-vs-spy/)
- [Vanguard vs Fidelity](https://www.themodernwallet.com/compare/vanguard-vs-fidelity/)
- [Donor-Advised Fund vs Private Foundation](https://www.themodernwallet.com/compare/donor-advised-fund-vs-private-foundation/)
- [Target-Date Fund vs S&P 500 Index Fund](https://www.themodernwallet.com/compare/target-date-fund-vs-sp500/) (carried-forward deferred row from a prior run)

### Body-text enrichments (additive FAQ sections, no existing content removed)
- `/net-worth/net-worth-by-age-calculator/` — net worth by income bracket, by education level, generational-label caveat (Fed SCF sourced)
- `/coast-fire/` — account-type (tax) and inflation-adjustment FAQs
- `/mortgage/payoff-calculator/` — why a payoff amount exceeds the statement balance, what a payoff statement must include, quote validity (CFPB sourced)
- `/investing/` — starting to invest with little/no money (Fidelity/Schwab $0-minimum, $1-fractional-share sourced)

## Process quality
- Independent adversarial dedup gate (separate subagent from the chart author) reviewed all 14 candidate rows: 13 KEEP, 1 DROP.
- Independent adversarial content audit (separate subagents from the writers) reviewed all 9 new pages against the site's hard-fail checklist: 5/9 failed on first pass (all on the mechanical first-mention external-link rule), 4/9 passed clean. All 5 failures fixed in one rework round (link additions only, no prose rewritten) and reconfirmed in the rebuilt HTML.
- `npm run build`: 586 pages build clean.

## Commit / push
Committed incrementally to `claude/weekly-podcast-pain-nydw7a` throughout the run (checkpointed after each stage per the routine's incremental-backlog safety net). Final publish: rebase onto `origin/main` and push `HEAD:main` (see below for outcome).
