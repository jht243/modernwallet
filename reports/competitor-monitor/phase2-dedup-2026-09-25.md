# Phase 2 — Dedup (2026-09-25)

AI generation calls so far: 0 — dedup ran first (local-only checks against src/data/*.ts).

## Volume / selection note
Scraper emitted 7,059 on-niche candidates; 6,849 is the long-standing `pending-retry` backlog (structurally can't clear under the 10/run cap; not caused by this run). Genuine activity this run: 30 `new` + 180 `updated` across Financial Mentor, Omni Calculator, NerdWallet, SmartAsset, Bankrate.

The mechanical "most-recent-first" top 10 (sorted by `lastmod` desc among `change=new`) pulled in:
- 4x NerdWallet daily mortgage-rate snapshots (`mortgage-rates-bond-yields`, `mortgage-rates-today-friday-september-25-2026`, `weekly-mortgage-rates-9-24-26`, `mortgage-rates-today-thursday-september-24-2026`)
- 1x NerdWallet student-loan-refinance explainer
- 1x NerdWallet "Ally missed our best-savings list" methodology piece
- 1x Bankrate Caribou auto-loan prequalification page (empty outline — thin funnel page, no editorial content)
- 1x NerdWallet "National Coffee Day" retail-deals roundup (off-mission promo content, no personal-finance value)
- 1x NerdWallet "Bilt Adds Amtrak as 2:1 Transfer Partner" (real, dated fact)
- 1x NerdWallet "These 3 Money Moves Take the Fright out of Fall" (BNPL-payday sync + W-4 refund timing tips)

Considered 2 replacement candidates from the next-strongest `new` items (NerdWallet `personal-loans/pre-qualify` — also a thin stats/marketing landing page, no real outline; NerdWallet `ways-to-pay-for-college-if-your-financial-aid-isnt-enough` — real content, but every tactic it lists is already scattered across existing Parent PLUS/private-loan/refinance guides, not a clean single-page gap). Neither cleared the bar, so the 2 low-value slots are left unreplaced rather than force-generating weak content this run.

## Coverage tags — kept batch (10)

| Candidate | Kind | Coverage check | Tag |
|---|---|---|---|
| NerdWallet: mortgage-rates-bond-yields | page | `current-mortgage-rates-guide` (updated 2026-09-11) already explains the 10-yr Treasury/Fed-funds relationship driving rates, by design without a stale specific number | **DUPLICATE** |
| NerdWallet: mortgage-rates-today-friday-september-25-2026 | page | Same guide; dated daily snapshot the guide's own philosophy avoids | **DUPLICATE** |
| Bankrate: caribou-prequalification | comparison | Scraped outline is empty — thin lender-referral funnel page, no coverage floor to build from or beat | **skipped-low-value** |
| NerdWallet: refinancing-to-lower-monthly-payments (student loans) | page | `should-you-refinance-student-loans` guide + `best-student-loan-refinance` roundup both already cover this in depth (federal-protection tradeoffs, break-even math, lender comparison) | **DUPLICATE** |
| NerdWallet: weekly-mortgage-rates-9-24-26 | page | Same `current-mortgage-rates-guide` | **DUPLICATE** |
| NerdWallet: why-ally-and-other-banks-missed-our-best-savings-list | page | `best-high-yield-savings-accounts` roundup (updated 2026-09-23, 2 days ago) already profiles Ally Bank in full (APY structure, buckets, fees, ATM tradeoffs) | **DUPLICATE** |
| NerdWallet: mortgage-rates-today-thursday-september-24-2026 | page | Same `current-mortgage-rates-guide` | **DUPLICATE** |
| NerdWallet: parents-fall-expenses ("3 Money Moves") | page→guide | No existing BNPL (Buy Now, Pay Later) guide anywhere in `guides.ts`/`roundups.ts` — genuine gap; W-4/prioritize tips already covered elsewhere but BNPL management is not | **NEW** |
| NerdWallet: coffee-day-deals | page | Retail-deals/promo content (free coffee, product releases) — no personal-finance educational substance, off-mission for an evergreen finance site | **skipped-low-value** |
| NerdWallet: bilt-amtrak | page→enrichment | `bilt-rewards-vs-chase-ultimate-rewards` comparison exists and deliberately avoids naming specific transfer partners ("confirm the current lineup..."); a real, dated, verifiable new partner (Amtrak, 2:1) is genuine information gain worth one factual addition | **PARTIAL** |

## Dispositions to record in Phase 6
- 1 NEW → generate a BNPL management guide (Phase 3).
- 1 PARTIAL → enrich `bilt-rewards-vs-chase-ultimate-rewards` with the Amtrak transfer-partner fact (Phase 3).
- 6 DUPLICATE → `skipped-duplicate` (conflicting URLs noted above).
- 2 → `skipped-low-value` (Caribou prequalification funnel page, Coffee Day promo roundup).
- Remaining ~20 SmartAsset/NerdWallet `new`, all `updated`, and the pending-retry backlog → left `pending`, re-surface next run under the same priority rule.

**NEW → generate: 1** · **PARTIAL → enrich: 1** · **DUPLICATE → dropped: 6** · **skipped-low-value: 2**

Auto-continue to Phase 3.
