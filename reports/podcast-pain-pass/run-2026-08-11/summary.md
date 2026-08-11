# podcast-pain-pass run summary — 2026-08-11

## Episodes pulled per show (47 total)
- Ready For Retirement: 6
- How to Money: 6
- Suze Orman's Women & Money: 6
- The Better Budgeting Podcast: 6
- Catching Up to FI: 6
- The Simply Investing Dividend Podcast: 6
- Rental Income Podcast With Dan Lane: 6
- The Personal Finance Club Show: 5

## Pain clusters mined (155 sentences across 6 site themes)
investing 77 · tax-estate 23 · budget 21 · retirement 14 · net-worth 10 · real-estate 10

## Validated terms
- Lens 1 (direct-intent, floor 70/mo): 21/23 THEME_TERMS candidates validated — all 21 already covered by existing site content (guides, comparisons, or calculator spokes) on independent inventory check.
- Lens 2 (autocomplete adjacent-demand, 10 seeds mined) + Lens 3 (entity vs/alternatives via HSA/FSA, 4% rule): 2 net-new rows survived (is-social-security-taxable, portfolio-rebalancing); a 3rd row (dscr-loan-requirements) came from Lens 3 entity mining off this week's Rental Income Podcast DSCR-loan episode.

## What was deduped (dropped, already covered)
All 21 Lens-1 terms plus 5 Lens-2/3 candidates below the SEMRUSH floor or already answered on-site — full evidence and exact slug citations in `chart.md`'s Exclusions section. Notable: `hsa vs fsa` (33,100 vol) and `4 percent rule retirement` (480 vol) both looked like strong candidates pre-dedup but were already thoroughly covered (`hsa-vs-fsa` comparison; `withdrawal-calculator` spoke covers Bengen's 4% rule and Pfau's critique in depth).

## What shipped (3 new guides)
- [Is Social Security Taxable? 2026 Thresholds Explained](https://www.themodernwallet.com/guides/is-social-security-taxable/)
- [DSCR Loan Requirements: What Investors Need to Qualify](https://www.themodernwallet.com/guides/dscr-loan-requirements/)
- [Portfolio Rebalancing: When and How to Do It](https://www.themodernwallet.com/guides/portfolio-rebalancing/)

## Process quality
- Independent adversarial dedup gate (separate subagent from the chart author) reviewed all 3 candidate rows: 3 KEEP, plus spot-checked 5 exclusion claims — all held up.
- Independent adversarial content audit (separate subagent from the writer) reviewed all 3 new pages against the site's hard-fail checklist: 1/3 passed clean (DSCR), 2/3 failed on the mechanical first-mention external-link rule (SSA/IRS and SEC-investor.gov linked on their second mention instead of first) plus one worked-example math error on the rebalancing page (66/34 stated vs. the correct ~65/35 compounding result at 3 years, 10%/3% returns). Both fixed in one rework round and reconfirmed clean against the rebuilt HTML.
- `npm run build`: 600 pages build clean (was 586 before this run's earlier 08-07 run, 597 pre-existing before today).

## Commit / push
Committed incrementally to `claude/weekly-podcast-pain-hql3te` throughout the run. Final publish: rebase onto `origin/main` and push `HEAD:main` (see email for outcome and live-verification results).
