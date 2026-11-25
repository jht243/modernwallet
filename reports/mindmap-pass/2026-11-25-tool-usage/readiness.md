# Readiness report: tool-usage 2026-11-25 (job 2026-11-25-tool-usage)

Author: build. Not self-approved; independent CHART-REVIEW required. Mode: unattended `*-auto`, `preparationMode: full`.

## Preparation evidence
- Workflow freshness + full reading: runId 375ba13e3d77479eae414dbeb4f1657f, bundle `preflight-build` (34 parts, check = delivery-complete-sources-current).
- Original intake: `reports/mindmap-pass/2026-11-25-tool-usage-brief.md` (4 numbered rows; all kept, none cut). Personas: `reports/tool-usage-pass/2026-11-25/personas/*.md` (5 tools; persona gate passed).
- Coverage lookup (site-url https://www.themodernwallet.com): `research/coverage-lookup.txt` for C1/C2/C3 and the COLA tool. No existing calculator for any of the three new intents (only /compare/sep-ira-vs-solo-401k, limits guides, taxable-benefits calculator, tax-loss-harvesting guide, which answer different reader goals).
- Demand ladder (KEYWORD_PROVIDERS=semrush,dataforseo; SEMRUSH HTTP 403 so DataForSEO answered volume/KD/expand): `research/keyword-volumes.json`, `keyword-volumes2.json`, `kw-status.json`. Autocomplete question sweeps: `research/ac-*.csv`. SERP reads (5 heads, $0.0106): `research/serp.json`.
- Primary sources saved verbatim with URL + UTC timestamp in `research/sources/`: CMS 2027 Part B fact sheet, IRS IR-2026-136 (2026 limits), IRS 2027 limits release, IRS Notice 2026-66, Form W-4V, IRS Pub 560, Pub 550, Topic 409.
- Amazon picks for the retirement tool: `research/amazon-picks-retirement.txt` (amazon_pick.py output; ASINs only from it).
- Calculated examples for briefs: `research/calc-examples.json` (arithmetic only; Phase 3 produces the executed evidence packets).

## Per-page preparation checks
| Page | Duplicate check | Testing eligibility | Evidence and label decision | Takeaway brief | Evidence |
|---|---|---|---|---|---|
| /social-security-cola-calculator/ (F1-F3, F5-F7) | existing route, tool fix + factual correction | excluded (financial; section G) | reported (CMS) | in manifest | CMS fact sheet |
| /retirement/couples-retirement-calculator/ (M1) | existing route | excluded | n/a (books) | n/a | amazon picks |
| /mileage-deduction/irs-mileage-rate-2026/ (F4) | existing route | excluded | n/a | n/a | persona |
| /sep-ira-solo-401k-contribution-calculator/ (C1) | no same-intent page | excluded | calculated (IRS Pub 560, Notice 2026-66) | in brief | lookup, serp, sources |
| /social-security-withholding-calculator/ (C2) | no same-intent page | excluded | calculated (Form W-4V, Pub 915 via existing lib) | in brief | lookup, serp, sources |
| /capital-loss-carryover-calculator/ (C3) | no page; closest tax-loss-harvesting guide (different intent) | excluded | calculated (Pub 550, Topic 409) | in brief | lookup, serp, sources |

## Limits and honest notes
- 2027 SS wage base (needed for SE tax at high profit) was not retrievable from ssa.gov here (403 in prior runs); Phase 3 must reuse the existing self-employment-tax lib constants and label the tax year, or cite a retrievable SSA source before using any 2027 base.
- C3 demand: "capital loss carryover" 2,400/mo KD 9; "capital loss carryover calculator" 30/mo (DataForSEO, measured). Kept as the persona next job per the brief; flagged for the reviewer.
- Max 3 new tools respected (C1-C3). Other spec backlog items (depreciation-recapture, 1031) stay in "Next in line".
- Existing guide pages with stale Part B sentences are factual corrections only; no metadata change.
