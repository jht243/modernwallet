# Phase 2 — coverage/dedup (2026-09-22)

AI generation calls so far: 0 — dedup ran first (local file/string comparison only against `src/data/roundups-business.ts`, `roundups.ts`, `roundups-self-employed.ts`, `comparisons*.ts`, `guides*.ts`, `spokes*.ts`).

| # | Candidate (NerdWallet) | Target topic | Coverage | Conflicting/related this-site URL |
|---|---|---|---|---|
| 1 | Best Same-Day Business Loans (Sep 2026) | same-day business loans | NEW | none |
| 2 | Best Business Credit Cards (Sep 2026) | best business credit cards (general) | **DUPLICATE** | `/best-business-credit-cards/` (roundups-business.ts:1205) — same core topic/keyword, already a comprehensive 6-card roundup |
| 3 | Best Bad Credit Business Loans (Sep 2026) | bad-credit business loans | NEW | none |
| 4 | Best Business Credit Cards With No Personal Credit Check | no-credit-check business cards | NEW | related to /best-business-credit-cards/ but distinct keyword/segment, no dedicated page |
| 5 | Best Business Credit Cards for Sole Proprietorships | sole-proprietor business cards | NEW | none |
| 6 | Best Business Credit Cards for Startups With No Credit | startup no-credit business cards | NEW | none |
| 7 | Best Cash-Back Business Credit Cards | cash-back business cards | NEW | none |
| 8 | Best No Annual Fee Business Credit Cards | no-annual-fee business cards | NEW | none |
| 9 | Best Business Bank Accounts (2026) | business bank accounts | NEW | none |
| 10 | Best 0% APR Business Credit Cards (Sep 2026) | 0% APR business cards | NEW | none |

NEW → generate: 9
PARTIAL → enrich: 0
DUPLICATE → dropped: 1 (candidate #2, recorded as `skipped-duplicate` for Phase 6 ledger)

Auto-continue to Phase 3 (9 NEW roundup pages).
