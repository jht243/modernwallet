## New pages shipped
- [What Is a Good Credit Score?](https://www.themodernwallet.com/guides/what-is-a-good-credit-score/)
- [How Much Do I Need to Retire by Age?](https://www.themodernwallet.com/guides/how-much-do-i-need-to-retire-by-age/)
- [Mega-Backdoor Roth 401(k)](https://www.themodernwallet.com/guides/mega-backdoor-roth-401k/)
- [How to Budget for Teens and College Students](https://www.themodernwallet.com/guides/how-to-budget-for-teens-college-students/)
- [Net Worth for FAFSA and Accredited Investor Tests](https://www.themodernwallet.com/guides/net-worth-for-fafsa-and-accredited-investor/)
- [VOO vs SPY](https://www.themodernwallet.com/compare/voo-vs-spy/)
- [Vanguard vs Fidelity](https://www.themodernwallet.com/compare/vanguard-vs-fidelity/)
- [Donor-Advised Fund vs Private Foundation](https://www.themodernwallet.com/compare/donor-advised-fund-vs-private-foundation/)
- [Target-Date Fund vs S&P 500 Index Fund](https://www.themodernwallet.com/compare/target-date-fund-vs-sp500/) (carried forward from a prior run's deferred backlog)

## Updated pages
- [Net Worth by Age Calculator](https://www.themodernwallet.com/net-worth/net-worth-by-age-calculator/) — added FAQs on net worth by income bracket and by education level (Fed SCF sourced)
- [Coast FIRE Calculator](https://www.themodernwallet.com/coast-fire/) — added FAQs on account-type (tax) and inflation adjustments to the coast number
- [Mortgage Payoff Calculator](https://www.themodernwallet.com/mortgage/payoff-calculator/) — added FAQs on why a payoff amount exceeds the statement balance (CFPB sourced)
- [Investing Hub](https://www.themodernwallet.com/investing/) — added an FAQ on starting to invest with little/no money

## Live verification
All 13 URLs above (9 new + 4 updated) returned HTTP 200 after the deploy settled, and spot-checks confirmed the live HTML contains the new content (not stale cache). Zero non-200s — nothing reverted, nothing skipped from IndexNow.

## What was mined
90 new transcript-tagged episodes across all 8 rostered personal-finance podcasts (Ready For Retirement, How to Money, Suze Orman's Women & Money, The Better Budgeting Podcast, Catching Up to FI, The Simply Investing Dividend Podcast, Rental Income Podcast With Dan Lane, The Personal Finance Club Show) — 263 patient-pain sentences clustered across investing (103), tax-estate (50), budget (42), retirement (38), real-estate (17), and net-worth (13).

Two bugs found and fixed in `pull_new_episodes.py` this run: a `feeds.json` field-name mismatch (`topic` vs the file's actual `vertical` key) that crashed every run before pulling anything, and a CDATA-parsing bug that silently zeroed out any feed wrapping its `<guid>`/`<link>` in CDATA (affected Catching Up to FI).

## Validated terms and dedup
21 Lens-1 direct-intent terms SEMRUSH-validated (floor 70/mo) — all 21 came back already covered by this site's existing 95 guides / 80+ comparisons / 9 calculator hubs, which is expected for a mature site; the real yield came from Lens-2 adjacent-demand (Autocomplete) and Lens-3 entity-gap mining. An independent adversarial dedup pass reviewed 14 candidate rows and dropped 1 (`reit-vs-rental-property`, already substantively covered by an existing guide).

## Content quality gate
An independent adversarial audit (separate agents from the writers) reviewed all 9 new pages against the site's hard-fail checklist. 5/9 failed the first pass, all on the same mechanical issue (an unlinked first mention of an external company/institution) — no factual, sourcing, or YMYL issues found. All 5 fixed in one rework round (link additions only) and reconfirmed against the rebuilt HTML.

## Commit + push
Commit `eacc159` on `main` (fast-forwarded from `claude/weekly-podcast-pain-nydw7a`, no rebase conflicts, no unexpected deletions). `npm run build`: 586 pages build clean.
