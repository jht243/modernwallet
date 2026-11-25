# Readiness report: 2026-11-25 X trends (themodernwallet.com), BUILD stage

Run ID 8526910b9fa648ccaa7285a71824ccfb, job xtrends-2026-11-25, actor mindmap-build, unattended /x-trends-mindmap-auto (Phase 0 treated as approved, no human gate). Preflight bundle: reports/mindmap-pass/2026-11-25-xtrends-run/preflight-build (33 parts delivered, check passed: delivery-complete-sources-current). Delivery is not proof of review; independent CHART-REVIEW still required.

## Duplicate check
passed - 5 candidates checked (3 new-page rows, 1 enrichment, 1 dropped), 1 matched an existing page (/guides/how-to-buy-anthropic-stock, enriched instead of duplicated). Evidence: research/coverage-lookup.txt (coverage_lookup.py --site-url https://www.themodernwallet.com).

## Per-bullet disposition
| # | Bullet | Disposition | Reason |
|---|---|---|---|
| 1 | Anthropic below $83 IPO | ENRICH /guides/how-to-buy-anthropic-stock/ (path exists, src/data/guides.ts:2041) + one-sentence fix to /guides/what-is-an-ipo/ | Existing guide still says "You cannot buy Anthropic stock today / nothing trades", contradicted by the Nov 19 listing (424B4 filed 2026-11-19, CNBC 2026-11-24). what-is-an-ipo says "nothing trades yet". Not a thin new page. |
| 2 | Medicaid work requirement / hold harmless | NEW /guides/medicaid-work-requirements-2027-hold-harmless/ | No page on the topic (lookup: no match). Verified: CMS IFR fact sheet, medicaid.gov SMDL smd26006 posted 2026-11-13, Oregon OHA 2026-11-23, KFF. Maryland and New Hampshire opt-ins NOT verified from a primary source, so not named. |
| 3 | Medicare next 13 negotiated prices | DROP (re-queue) | CMS page fetched lists no 2028 drug names, prices or savings; third cycle selected 15 drugs, not 13; "$9.2B (45%)" unsupported. Unverifiable claims must not reach a page. |
| 4 | 2027 conforming loan limit | NEW /guides/conforming-loan-limit-2027/ | No page (lookup: no match). FHFA release 2026-11-24 verified: $855,400 baseline (+$22,650, 2.72%), $1,283,100 ceiling, AK/HI/Guam/USVI $1,283,100 baseline and $1,924,650 ceiling, all but 24 counties higher. 2027 delivery-date rule NOT verified; the page must not assert one. |
| 5 | HUD mixed-status rule | NEW /guides/hud-mixed-status-housing-rule/ | No page (lookup: no match). Verified: HUD page (FR 2026-23003 published 2026-11-12, effective 2026-12-14), NY AG suit release (D. Mass., HUD estimates). |

## Demand and SERP
Fresh-trend rule applied: no keyword provider call and no SERP read were made this run (keyword tools lag new topics; measured volume cannot veto). Rows are labeled `demand inferred - fresh news trend, no tool volume`; reader_question tags read `[verb-only - no PAA, no completions]` honestly. serp_verdict `unread`. WRITE may run the free autocomplete sweep to pick FAQ questions.

## Review profile
HIGH for A1, A3, A4, A5 (consequential investment, health-coverage, mortgage and housing/legal claims quoted from primary sources). No professionalReviewRequired and no liabilityBlock identified. Never medical dosing/safety content.

## Testing and attribution
Site _experience.md section G excludes medical, legal and financial services. All five rows: ordinary (non-TESTED) presentation. Evidence basis: reported (A1, A3, A5) and calculated (A4 purchase-price table, reproducible arithmetic). No "we tested". Visible attribution: "In our internal calculation, we ..." only for A4 table.

## Open items for WRITE/AUDIT
- 424B4 (94 MB) body not read; lockup and share terms must be read from it before restating (existing page cites S-1 180/365-day lockups).
- Nov 24 close price unverified; use "closed below the $83 IPO price (CNBC)". Do not state a dollar close or a percent loss for open buyers beyond arithmetic from $83 vs $111.50 (more than 25% at or below $83).
- SMDL smd26006 PDF text is saved locally by the tool; notification deadline (KFF says 2026-12-11) must be confirmed from the SMDL.
- NY AG state count: 21 AG offices listed plus DC plus PA governor; recount from release before writing "22".
- Inherited statements on /compare/aca-vs-medicaid/ must be checked before an inbound link is added (link-only).

## Sources saved (research/sources/*.txt, WebFetch extractions with UTC timestamp)
fhfa-2027-cll, cnbc-anthropic-below-ipo, sec-anthropic-424b4, cms-medicaid-ce-ifr, medicaid-gov-ce-hold-harmless, oregon-oha-hold-harmless, hud-mixed-status-rule, ny-ag-hud-lawsuit, cms-selected-drugs.
Keyword calls: none (credentials not used, nothing written to repo).
