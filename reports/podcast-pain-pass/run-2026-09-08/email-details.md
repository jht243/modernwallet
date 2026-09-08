## What ran

**Phase 0 — EXPAND:** pulled new transcript-ready episodes across the 6-show personal-finance roster.

| Show | New episodes |
|---|---|
| Ready For Retirement | 6 |
| How to Money | 6 |
| Suze Orman's Women & Money | 6 |
| The Better Budgeting Podcast | 6 |
| Catching Up to FI | 6 |
| The Simply Investing Dividend Podcast | 0 |
| Rental Income Podcast With Dan Lane | 6 |
| The Personal Finance Club Show | 0 |

**36 new episodes** mined → **112 patient-pain sentences** clustered into 6 themes: budget (25), investing (22), retirement (24), tax-estate (20), real-estate (12), net-worth (9).

**Phase 1 — MINDMAP PASS:**
- Lens 1 (direct intent): 22 candidate terms SEMRUSH/DataForSEO-validated at floor 70/mo. Keyword data: volume=dataforseo, kd=dataforseo (SEMRUSH key returned HTTP 403 — dry, per the keyword-demand-ladder this demotes a rung rather than blocking the run).
- Lens 2 (adjacent-demand): 10 seeds mined via Google Autocomplete (mode=all, ~2,000 raw suggestions).
- Lens 3 (comparison/alternatives): checked the brief's named entities (Roth conversion, 72(t)/SEPP, donor-advised fund, Coast FIRE).

## Result: 0 survivors — no-changes

Every one of the 22 Lens-1 terms is already owned by a dedicated page on the site (verified by reading the actual matching page, not a naive keyword grep) — e.g. "how to make a budget" (165k/mo) → the `/budget/` hub; "trust vs will" (18.1k/mo) → `/compare/living-trust-vs-will/`; "when to take social security" → a dedicated section inside `/guides/how-to-retire-at-67/`.

Lens-2 clustering surfaced several repeated autocomplete modifier groups (50/30/20 gross-vs-net, Trust & Will vs. LegalZoom/Rocket Lawyer/etc., Coast FIRE + Social Security, net worth excluding home equity, mortgage payoff vs. invest, budgeting with AI chatbots) — every one already has a dedicated FAQ, section, or roundup answering it. International/regional autocomplete variants and off-topic drift (e.g. TikTok follower counts) were excluded as noise, not gaps.

Lens-3 found dedicated coverage for all four brief-named entities, including an exact match for the donor-advised-fund entity at `/compare/donor-advised-fund-vs-private-foundation/`.

**This is the expected, healthy outcome for a weekly pass on a mature site** (338 targetKeyword entries / 532 slugs across `src/data/*.ts`). Full per-term coverage mapping: `reports/podcast-pain-pass/run-2026-09-08/chart.md`.

## Ledger

- `processed_guids` updated for all 8 shows (prevents re-mining this week's episodes).
- `last_run` set to 2026-09-08.
- No new `shipped_slugs`, no `deferred_rows` carried forward (none existed).

## New pages shipped

None this run.
