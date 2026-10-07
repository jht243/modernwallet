# Phase 2 - Dedup (2026-10-07)

AI generation calls so far: 0 - dedup ran first (slug/topic grep against src/data).

Scrape: 7,940 candidates (151 new/updated, rest long-standing pending-retry backlog, mostly Omni/NerdWallet/SmartAsset/Calculator.net). Cap of 10 respected; this run acted on 3 finance-relevant items (the recent list was dominated by news, legal pages, rate snapshots, reviews and non-finance tools). Everything else stays pending.

| Candidate | Kind | Coverage check | Tag |
|---|---|---|---|
| NerdWallet pay-for-delete | page | no pay-for-delete/collections-letter page; debt-collectors guide covers rights only | NEW |
| NerdWallet raise-credit-score-fast | page | only score-range and 0% APR score guides; no build-credit playbook | NEW |
| SmartAsset installment-loans-vs-revolving-credit | comparison | no installment vs revolving page | NEW |
| Bankrate/NerdWallet rate snapshots, reviews, news, card offers | page | volatile/proprietary | skipped-low-value (left pending) |

NEW -> generate: 3 - PARTIAL -> enrich: 0 - DUPLICATE -> dropped: 0
