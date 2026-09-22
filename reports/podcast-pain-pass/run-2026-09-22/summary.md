# Podcast Pain Pass — run summary — 2026-09-22

## Episodes pulled
36 new episodes across 6 of 8 rostered shows (2 shows had 0 new episodes this week):
- Ready For Retirement: 6
- How to Money: 6
- Suze Orman's Women & Money: 6
- The Better Budgeting Podcast: 6
- Catching Up to FI: 6
- Rental Income Podcast With Dan Lane: 6
- The Simply Investing Dividend Podcast: 0
- The Personal Finance Club Show: 0

## Pain clusters mined
112 patient-pain sentences across 6 themes: budget (34), retirement (21), investing (19),
real-estate (16), tax-estate (15), net-worth (7).

## Validated terms
- Lens 1 (direct intent, THEME_TERMS baseline): 22/23 candidates validated ≥70/mo (DataForSEO;
  SEMRUSH returned HTTP 403, ladder demoted automatically per `_keyword-demand-ladder.md`).
- Lens 2 (adjacent-demand, Autocomplete + DataForSEO): 10 seeds mined, 10 survivors ≥70/mo
  (mixed measured + autocomplete-estimate rows, floor applied via `passes_floor`).
- Lens 3 (comparison/alternatives): 3 candidates validated, all ≥70/mo.
- Keyword data: volume=dataforseo, kd=dataforseo (SEMRUSH HTTP 403 all calls; Ahrefs no key).

## Dedup gate (adversarial, read-only Explore subagent)
30 candidates reviewed against `src/data/{guides,comparisons,calculators,spokes-*,roundups}*.ts`,
`reports/podcast-pain-pass/ledger.json` shipped_slugs, and recent git log: **25 DROP** (already
covered by an existing calculator hub/spoke/guide/comparison), **1 RECLASSIFY** (folded as FAQs
onto a surviving page instead of shipping as thin standalone pages), **4 KEEP**.

## What shipped (4 pages, all passed Phase 4 audit after Rung-1 fix-in-place)
1. `/guides/what-is-a-sinking-fund/` — sinking fund definition/how-to guide (budget)
2. `/compare/sinking-fund-vs-emergency-fund/` — comparison page (budget)
3. `/guides/am-i-saving-too-much-for-retirement/` — retirement over-saving guide
4. `/guides/can-i-retire-on-rental-income/` — rental income retirement feasibility guide
   (folds in "find rental deals" + "negotiate price" demand as FAQs per the RECLASSIFY verdict)

All 4 generated via `scripts/lib/content_gen.py` (Gemini `gemini-3.8-flash`, thinking=high; no
fallback needed). `.meta.json` provenance committed beside every draft.

## Phase 4 audit
Independent Explore subagent (did not write the pages) found all 4 FAIL on first pass:
unlinked first-mentions of CFPB/FDIC/Fidelity/Federal Reserve, one wrong brand-name instance
("The Modern Wallet" → "ModernWallet"), 2 page-self-reference sentences ("This guide
outlines/breaks down..."), and sentence-rhythm monotony (runs of 10+ consecutive long-only
sentences) on 3 of 4 pages. All fixes were Rung-1 FIX-IN-PLACE (remediation ladder) — targeted
edits, no regeneration. A confirm-only re-read subagent verified every fix landed and found no
new defects; one page's depth margin was thin post-edit (1,522 words vs. 1,500 floor) and was
padded with a genuine worked example, not filler, to 1,585 words.

## Build + link check
`npm ci && npm run build`: 863 pages built clean, including all 4 new pages. Every internal
link and `tools[]`/`calculatorLinks[]` href used across the 4 pages (29 distinct routes)
resolves to a real built page — verified by checking `dist/<path>/index.html` exists for each.

## Circuit breaker
4 survivors, well under the 20-row circuit breaker. No hold triggered.
