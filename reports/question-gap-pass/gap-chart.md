# question-gap-pass — Gap Chart — 2026-09-12

Top 20 pages by GSC clicks (90-day window). 17/20 were also analyzed by the 2026-09-05 run
(see cache.json) — most rows this time are `Skip — already shipped last run` or newly-scored
against fresh PAA data. Only the 3 New Mexico/Iowa/Washington will-cost-calculator state pages
were genuinely unanalyzed before this run. Full per-question tables (108 real PAA questions +
~350 generated candidates, every one scored) were produced by four parallel analysis passes and
are summarized here; the complete row-by-row tables live in this run's task history.

## Trump Account cluster (6 pages, 35 clicks / 1,921 impr combined)
- `/compare/trump-account-vs-brokerage-account/` (15 clicks) → Add 0 · Strengthen 0 · Link 1 identified (not applied) · Skip 23
- `/compare/trump-account-vs-savings-account/` (9 clicks) → Add 0 · Strengthen 0 · Link 1 applied + 3 identified · Skip 20
- `/compare/trump-account-vs-baby-bonds/` (5 clicks) → Add 0 · Strengthen 0 · Link 2 identified · Skip 21
- `/trump-account/` (3 clicks) → Add 0 · Strengthen 0 · Link 1 identified · Skip 22
- `/guides/trump-account-worth-it/` (2 clicks) → **Add 1** ("Are taxpayers paying for Trump Accounts?") · Strengthen 0 · Link 1 identified · Skip 20
- `/compare/trump-account-vs-529/` (1 click) → Add 0 · Strengthen 0 · Link 1 identified · Skip 21

## Estate planning / will-cost cluster (5 pages, 8 clicks / 337 impr combined)
- `/estate-planning/living-trust-cost-calculator/` (3 clicks) → **Add 2** (ILIT life-insurance disadvantages + how-to) · Strengthen 0 · Link 1 identified · Skip 21
- `/roundup/best-estate-planning-software/` (1 click) → Add 0 · Strengthen 0 · Link 2 identified · Skip 22
- `/estate-planning/will-cost-calculator/new-mexico/` (2 clicks, **new page**) → **Add 2** (NM probate threshold + community property) · Strengthen 0 · Link 2 identified · Skip 14
- `/estate-planning/will-cost-calculator/iowa/` (1 click, **new page**) → **Add 1** (Iowa probate threshold, corrected figure) · Strengthen 0 · Link 3 identified · Skip 15
- `/estate-planning/will-cost-calculator/washington/` (1 click, **new page**, SERP unread) → **Add 1** (joint-ownership) · **Strengthen 1** (lawContext connecting sentence) · Link 2 identified · Skip 11
- Base spoke `will-cost-calculator` (applies to hub + all 50 states) → **Add 1** ("How long does it take to get a will done?")

## Custodial / 529 / UTMA cluster (3 pages, 3 clicks / 273 impr combined)
- `/compare/custodial-roth-ira-vs-utma/` (1 click) → **Add 1** (market-risk FAQ) · Strengthen 0 · Link 3 identified · Skip 20
- `/compare/custodial-roth-ira-vs-brokerage-account/` (1 click) → **Add 1** (market-risk FAQ) · Strengthen 0 · Link 2 identified · Skip 21
- `/compare/529-vs-utma/` (1 click, forum-dominated SERP) → **Add 1** (market-risk FAQ, lived-experience tone, regenerated post-audit) · Strengthen 0 · Link 4 identified · Skip 15 (2 more flagged for research, not actioned: "Dave Ramsey on 529s" and "529 boycott" — no verifiable source in hand, correctly not fabricated)

## Misc calculators / roundup cluster (6 pages, 8 clicks / 2,435 impr combined)
- `/investing/withdrawal-calculator/` (2 clicks, PAA empty for this query) → Add 0 · Link 1 identified · Skip 25
- `/retirement/military-retirement-calculator/` (2 clicks) → Add 0 · Link 1 identified · Skip 25
- `/roundup/best-ira-accounts/` (1 click) → Add 0 · Link 1 identified · Skip 23
- `/investing/high-yield-savings-calculator/` (1 click) → Add 0 · Link 0 · Skip 24 (most thoroughly enriched page in the cluster — nothing left to close)
- `/net-worth/liquid-net-worth-calculator/` (1 click) → Add 0 · Link 0 · Skip 25
- `/portfolio/60-40-portfolio-calculator/` (1 click) → Add 0 · Link 0 · Skip 26

## TOTAL across 20 pages (+ 1 base spoke)
- **Add: 11** (all API-generated via `scripts/lib/content_gen.py section`, `.meta.json` committed alongside)
- **Strengthen: 1** (one-sentence in-context edit, exempt from API generation)
- **Link applied: 2** (one-sentence internal-link insertions, exempt from API generation)
- **Link identified, not applied this run: ~28** (recorded in `cache.json` `planned_links` as "identified, not yet applied" — safe, low-risk, cheap fixes for a future run; deprioritized this run in favor of the 11 substantive Add gaps, all real PAA/AI-Overview-citation-driven)
- **Skip: ~410** (of ~450 questions scored — most rows were already clear on-page, especially the 17 pages the 2026-09-05 run already enriched)

## Phase 5 audit
8/13 pieces passed on first read; 5 failed (3 unlinked first-mention entities, 1 banned
em-dash/semicolon punctuation, 1 wrong register for a forum-dominated page). All 5 fixed:
4 as Rung-1 mechanical fix-in-place (add the missing link, remove the banned punctuation), 1 as
a Rung-2 regeneration through the API writer with a corrections block (529-vs-utma market-risk
FAQ, rewritten to lead with the real parent worry instead of a neutral mechanism explainer).
13/13 pass on re-check. Zero pages reverted.

## Fact-check finding (out of scope for this run, flagged for a future fact-audit pass)
Iowa's small-estate probate threshold is stated as **$100,000** in this run's new content
(verified live 2026-09-12 against Iowa Code §633.356 as amended by House File 2660, effective
July 1, 2026 — previously $50,000). An **older, incorrect $200,000 figure for Iowa already
exists elsewhere on the site** (`src/data/spokes-probate.ts`, probate-timeline calculator
content). This is a pre-existing site error, not introduced by this run — flagged here for a
dedicated fact-audit pass to correct.
