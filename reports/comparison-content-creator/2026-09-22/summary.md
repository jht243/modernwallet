# comparison-content-auto — 2026-09-22

## Candidate Chart

| # | Comparison | Vol | KD | CPC | Coverage | Verdict |
|---|---|---|---|---|---|---|
| 1 | medicare-vs-medicare-advantage | 5,400/mo | 17 | $2.06 | NEW | **PUBLISHED** — new /compare/ page |
| 2 | target-date-fund-vs-index-fund | — | — | — | PARTIAL | **ENRICHED** — guides.ts what-target-date-fund-should-i-choose |
| 3 | hsa-vs-401k | — | — | — | PARTIAL | **ENRICHED** — guides.ts tax-free-retirement-account |
| 4 | donor-advised-fund-vs-qcd | — | — | — | PARTIAL | **ENRICHED** — comparisons.ts donor-advised-fund-vs-private-foundation |

API calls: DataForSEO volumes() ×1, serp.py read ×1 (both for the sole NEW candidate).
Reached scoring: 1 NEW of 4 candidates (site is heavily saturated: 158 existing comparisons +
73 prior published + 74 prior dropped in cache.json before this run).

## Pages created (1)
- **Medicare vs Medicare Advantage: Which Path Fits Your Care?** → `/compare/medicare-vs-medicare-advantage/` (new)

## Pages enriched (3)
- **Target-Date Fund vs Index Fund** → `/guides/what-target-date-fund-should-i-choose/` (added comparison sub-section + table + verdict)
- **HSA vs 401(k)** → `/guides/tax-free-retirement-account/` (added comparison sub-section + table + verdict)
- **Donor-Advised Fund vs. QCD** → `/compare/donor-advised-fund-vs-private-foundation/` (added comparison sub-section + table + verdict)

## Files changed
- `src/data/comparisons.ts` — 1 new comparison entry, 1 enrichment section, 2 inbound-link sentences (medicare-vs-medicaid, medicare-advantage-vs-medigap relatedComparisons)
- `src/data/guides.ts` — 2 enrichment sections (target-date-fund guide, tax-free-retirement-account guide)
- `src/data/spokes-elder-care.ts` — 1 inbound-link sentence (LTC cost spoke)
- `reports/comparison-content-creator/cache.json` — 4 new published entries recorded
- `reports/standards-ledger.jsonl` — load receipts for phase-3-generate
- `reports/comparison-content-creator/2026-09-22/` — prompts, drafts, .meta.json provenance for all 4 API-generated pieces

## Audit
Phase 4 result: 1/1 new page passed after 1 in-place fix-round (2 semicolons joining
clauses → periods, 1 banned filler word "streamline" → "cut"), 3/3 enrichments passed clean
on first read. 0 pages drafted/dropped. Links, depth (1,805 body words vs 1,500 floor on the
new page), register (operator), required elements (who-this-is-not-for + what-would-change),
neutrality, and disclaimer placement all verified.

## IndexNow
Pending Phase 6 push — see routine email for submission result.
