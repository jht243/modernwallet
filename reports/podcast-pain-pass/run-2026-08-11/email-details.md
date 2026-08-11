## New pages shipped
- [Is Social Security Taxable? 2026 Thresholds Explained](https://www.themodernwallet.com/guides/is-social-security-taxable/)
- [DSCR Loan Requirements: What Investors Need to Qualify](https://www.themodernwallet.com/guides/dscr-loan-requirements/)
- [Portfolio Rebalancing: When and How to Do It](https://www.themodernwallet.com/guides/portfolio-rebalancing/)

## Live verification
All 3 URLs above returned HTTP 200 after the deploy settled (~30 seconds), and each page's live HTML was spot-checked to confirm it carries the new title/content, not a stale cache. Zero non-200s — nothing reverted, nothing skipped from IndexNow.

## What was mined
47 new transcript-tagged episodes across all 8 rostered personal-finance podcasts (Ready For Retirement, How to Money, Suze Orman's Women & Money, The Better Budgeting Podcast, Catching Up to FI, The Simply Investing Dividend Podcast, Rental Income Podcast With Dan Lane, The Personal Finance Club Show) — 155 patient-pain sentences clustered across investing (77), tax-estate (23), budget (21), retirement (14), net-worth (10), and real-estate (10).

## Validated terms and dedup
21 Lens-1 direct-intent terms SEMRUSH-validated (floor 70/mo) — all 21 came back already covered by this site's 100+ existing guides, comparisons, and calculators, which is expected for a mature site four days after the last run (2026-08-07). The real yield came from Lens-2 adjacent-demand (Autocomplete) and Lens-3 entity-gap mining off this week's episodes (an "is Social Security taxable" pain cluster from a Suze Orman/Ready For Retirement thread, and a DSCR-loan entity named in the Rental Income Podcast). An independent adversarial dedup pass reviewed all 3 candidate rows plus spot-checked 5 exclusion claims — all held up, including the judgment call that the site's existing DSCR content is scoped to commercial mortgages, leaving the residential-investor DSCR angle genuinely uncovered.

## Content quality gate
An independent adversarial audit (a separate subagent from the writer) reviewed all 3 new pages against the site's hard-fail checklist. 1/3 (DSCR) passed clean on the first pass. 2/3 failed on the mechanical first-mention external-link rule (Social Security Administration/IRS and SEC investor.gov were hyperlinked on their second mention instead of their first, in the intro paragraph) — no factual or sourcing issues. The portfolio-rebalancing page also had a worked-example math error (stated a 60/40 portfolio compounds to "66/34" after 3 years at 10%/3% returns; the correct figure is ~65/35). Both issues fixed in one rework round and reconfirmed clean against the rebuilt HTML.

## Commit + push
Commit `3229f02` on `main` (fast-forwarded from `claude/weekly-podcast-pain-hql3te`, no rebase conflicts, no unexpected deletions — verified via `git diff --cached HEAD --numstat` before each commit). `npm run build`: 600 pages build clean (597 before this run's 3 additions).
