# Readiness report: x-trends 2026-11-17 (themodernwallet.com)

Job: xtrends-2026-11-17. Author: mindmap-build. Mode: unattended `x-trends-mindmap-auto` (Phase 0 treated as approved by the caller; recorded authorization is the caller's STEP 3 brief). preparationMode: full.
Run id 80de8ad43f764c5fb6d595bb582b0491. Preflight bundle: `reports/mindmap-pass/2026-11-17-xtrends-run/preflight-build` (32 parts read, `check` = delivery-complete-sources-current).

## Aggregate preparation status

PASS pending independent chart review (BUILD never self-approves).

## Application map (rule -> concrete decision)

| Rule | Decision / artifact |
|---|---|
| `_vendor-research.md` | No vendor-addition task. Chase is the subject of a consumer-rights guide, not a roundup row; coverage-first applied to own site: `research/coverage-lookup.txt` shows no existing home for any of the 3 bullets. |
| `_decision-evidence.md` | All three pages: basis `reported` (external sources named), plus one small `calculated` illustration on A2 (rate-escalation schedule from the Treasury 3%/+1/10% rule) labelled as our arithmetic, not a finding about product performance. No tool, no invented tests. |
| `_testing-labels.md` + `_experience.md` | Section G excludes legal/financial services. Retail banking fee reversal, retirement-plan rules and property tax are financial/legal topics: TESTED format OFF, ordinary presentation, no "we tested" or howWeTested, no testing schema. Eligible=false for all three. |
| `_content-review-policy.md` | Claim risk floor HIGH for all three (consequential financial/tax/retirement claims; consumer-rights steps). Two audits max, release at first genuine PASS or exact final audited snapshot at limit. No `liabilityBlock` expected (no dosing, no physical hazard, no accusation). No professional review flag set; disclaimers at bottom. |
| `_keyword-demand-ladder.md` | Pinned `KEYWORD_PROVIDERS=semrush,dataforseo`. `keyword_data.py status`: SEMRUSH has no key, DataForSEO unusable: all rows are `source: estimate (Google Autocomplete), NOT measured`. Fresh-trend rule: low volume does not veto. |
| Chart gate: SERP/PAA | `serp.py batch` returned `unread` (DataForSEO unavailable, 0 calls). Rows carry `serp_verdict: unread` as a weakness label, not a drop signal. Question evidence = Autocomplete question sweep CSVs. |
| Duplicate check | `coverage_lookup.py --site-url https://www.themodernwallet.com` run for 3 candidates, saved to `research/coverage-lookup.txt` (sha256 9457e49f...). 0 existing homes found. Manual confirmation by grep of `src/data/*.ts`: "auto-enrollment" hits in guides.ts are Trump Accounts (child accounts, unrelated); 401(k) auto-enroll appears only as one-sentence mentions inside roundups.ts and comparisons.ts FAQs (SECURE 2.0 requires auto-enroll for plans established after Dec 29, 2022); no outage/overdraft/fee-refund page; no Truth-in-Taxation page. |
| Enrich-vs-new (explicit brief ask) | `/guides/retirement-contribution-limits-2027/` (published 2026-11-16) answers "what are the 2027 limits"; it has no auto-enrollment content (headings inspected, `research/link-inspections/limits-2027.txt`). Reader intent differs (plan default rate/exemptions/opt-out vs dollar limits), so NEW page plus an inbound link from it. |
| Primary-source capture | Verbatim snapshots in `research/sources/*.txt` (12 files incl. one `unverified` ledger). |
| Link inspections | `research/link-inspections/*.txt` (7 files). |

## Per-bullet dispositions

| Bullet | Disposition | Reason |
|---|---|---|
| 1 Chase outage Nov 16 fee reversal [FRUSTRATION] | NEW page `/guides/chase-outage-fee-reversal` | No outage or fee-refund page; autocomplete shows live demand (chase late fee refund, chase overdraft fee refund estimated 500-5000/mo band); sources verified: NBC, Fortune, Chase overdraft page, Reg E 1005.11, CFPB complaint page. |
| 2 Final 401(k)/403(b) auto-enrollment rules [RELEASE] | NEW page `/guides/401k-auto-enrollment-final-rules` | No home page; Treasury press release SB-0690 (2026-11-17) and 26 USC 414A verified. |
| 3 Minnesota Truth-in-Taxation notices | NEW page `/guides/minnesota-truth-in-taxation-notice` | No home page; Minnesota DOR press release 2026-11-12 and Minn. Stat. 275.065 verified. |

## Brief claims NOT verified (excluded from the writer's closed fact list)

1. "TD 10061": not found in Federal Register API (0 documents since 2026-11-01), not confirmed by web search. The page cites Treasury press release SB-0690 and IRC 414A; it must not print "TD 10061" or a Federal Register number (`research/sources/fr-td10061-unverified.txt`).
2. "Chase service came back around 6:30 pm ET": NBC says only that transactions were "posting normally Monday evening"; writer uses NBC's wording.
3. "As of Nov 17 there was no blanket fee waiver": no source retrieved states this either way. Writer may only say that none of the checked sources (NBC, Fortune, Chase's overdraft page) announces a blanket waiver, as a stated limit, and must tell readers to ask and check Chase's current statements.
4. "Outage posts 3,322 / 1,457; fee-reversal posts 197": X post counts, not retrievable; demand context only, never published as fact.
5. US News and Reuters X links: not retrievable (HTTP 000 / X post); not cited.
6. Minnesota: "notices go out Nov 11-24" is verified by Minn. Stat. 275.065 subd. 3 ("after November 10 and on or before November 24"); the press release confirms hearings run late November to late December and final levies due Dec 28, 2026 (no higher than preliminary). The hearing start time, and the property-value appeal path, were not verified: excluded.
7. Auto-enrollment applicability: Treasury says the final regulations "generally apply to retirement plan years beginning after December 31, 2027". The statute itself (Pub. L. 117-328 sec. 101(c)) applies to plan years beginning after Dec 31, 2024, as read via the Cornell LII copy of 414A summary; good-faith compliance in the gap is NOT verified and must not be asserted. The page must state both dates with attribution and avoid telling readers their current plan is exempt.

## Per-page preparation checks

| Page | Duplicate check | Testing eligibility | Evidence and label decision | Takeaway brief | Evidence |
|---|---|---|---|---|---|
| A1 /guides/chase-outage-fee-reversal | PASS: no match (`coverage-lookup.txt`) | Excluded (financial services, section G) | reported; ordinary presentation | Ask Chase in writing/by phone with dates; document; escalate to CFPB if no resolution; a late/overdraft fee tied to a verified outage is a discretionary request, not a guaranteed right, except Reg E errors on electronic transfers | sources nbc, fortune, chase-overdraft, reg-e, cfpb |
| A2 /guides/401k-auto-enrollment-final-rules | PASS: no match; enrich-vs-new decided new | Excluded | reported + small calculated illustration | The default is 3%, rising 1 point a year to at least 10% (max 15%); you can opt out or pick another rate; exemptions list; decide if the default fits your budget and match | sources treasury, usc-414A |
| A3 /guides/minnesota-truth-in-taxation-notice | PASS: no match | Excluded | reported | The notice is a proposal; final levies can only be lower; read the 3 columns; hearing is the venue to comment; it does not by itself change your valuation | sources mn-revenue, mn-statute, mn-tnt-revenue |

## Technical and publication preparation

Guides are records in `src/data/guides.ts` (Guide interface: slug, title, metaDescription, h1, cardBlurb, introText, sections[], tools[], faqs[], sources[], disclaimerText) rendered at `src/pages/guides/[slug]`. New records go at the top of `GUIDES` following the 2026-11-16 comment convention. Sitemaps are generated; WRITE verifies the 3 routes in the build output and sitemap. Scope: commit, push (land-run), live verification, IndexNow (per caller). Growth: `growth.json` with `not-yet-published` status and age-matched comparator; baseline unavailable (no GSC for new routes), recorded as unavailable not zero.
