# Phase 2 — Dedup (2026-09-23)

AI generation calls so far: 0 — dedup ran first (local-only checks against src/data/*.ts).

## Volume / selection note
Scraper emitted 6,863 on-niche candidates. Nearly all (~6,850) is a long-standing `pending-retry` backlog (stable ~6,700 for several weeks — the 10/run cap structurally can't clear it; not caused by this run). Genuine activity this run: SmartAsset (30 new + 15 updated), NerdWallet (4 new + 58 updated), Omni Calculator (31 updated).

The mechanical "most-recent-first" top 10 pulled in 4 NerdWallet items that are timely news/opinion, not evergreen guide material fit for this site's format:
- `mortgage-rates-today-wednesday-september-23-2026` — daily rate snapshot, stale within 24h.
- `data-center-ai-midterm-election-2026` — political/election news, no lasting personal-finance guide value.
- `ai-shopping` — opinion piece on AI recommendations, not a calculator/guide topic.
- `mortgage-editor-rents-instead-of-buying` — first-person essay, no reusable informational core.

Recorded as `skipped-low-value` (not duplicate, not generated) rather than left to resurface every run.

Replaced with the next 4 strongest SmartAsset evergreen `new` candidates by recency, all confirmed NEW after coverage check.

## Coverage tags — kept batch (10)

| Candidate | Kind | Coverage check | Tag |
|---|---|---|---|
| SmartAsset: rental-property-tax-deductions | page→guide | No ModernWallet page/section on rental-property tax deductions | **NEW** |
| SmartAsset: how-to-check-your-401k-balance | page→guide | No dedicated "find/check your 401k balance" page | **NEW** |
| SmartAsset: can-you-retire-on-1-5-million-comfortably | page→guide | Existing `is-3-million-enough-to-retire-at-40` is a different amount/age combo (same template family, not cannibalizing) | **NEW** |
| SmartAsset: how-long-will-150k-last-in-retirement | page→guide | No existing coverage | **NEW** |
| SmartAsset: does-retirement-income-count-as-income-for-social-security | page→guide | No existing coverage | **NEW** |
| SmartAsset: how-much-will-i-need-to-retire-in-2050 | page→guide | No existing coverage | **NEW** |
| SmartAsset: is-10-million-enough-for-you-to-retire-at-50 | page→guide | Different amount/age combo vs existing `is-3-million-enough-to-retire-at-40` | **NEW** |
| SmartAsset: flat-fee-vs-aum-based-financial-advisors | comparison | No existing advisor-fee-structure comparison | **NEW** |
| SmartAsset: simple-ira-vs-sep-ira | comparison | Existing comparisons cover SEP-IRA vs Solo 401(k), SIMPLE IRA vs 401(k), Traditional vs SIMPLE IRA, Solo 401(k) vs SIMPLE IRA — this exact pair (SIMPLE IRA vs SEP-IRA) is NOT covered head-to-head | **NEW** |
| SmartAsset: roth-403b-vs-roth-ira | comparison | No existing coverage | **NEW** |

## Deprioritized (this run) — no coverage conflict, adjacent existing content
- SmartAsset: `full-retirement-age` — FRA is well-covered in passing across multiple Social Security FAQs in `spokes-retirement.ts` (birth-year rules, claiming-age tradeoffs); no dedicated standalone page, but not a clean gap either. Left as overflow (stays `pending`, re-evaluated next run) rather than spending an enrichment slot on already-adequate scattered coverage.

## Dispositions to record in Phase 6
- 10 kept candidates → generate → `published` or `enriched` per Phase 4 outcome.
- 4 NerdWallet news/opinion candidates → `skipped-low-value`.
- Remaining ~24 SmartAsset `new`, all `updated`, and the pending-retry backlog → left `pending`/untouched, re-surface under the same priority rule next run.

**NEW → generate: 10** · **PARTIAL → enrich: 0** · **DUPLICATE → dropped: 0** (0 exact/reverse-slug or subsuming-page duplicates found in this batch)

Auto-continue to Phase 3.
