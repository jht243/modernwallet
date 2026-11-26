# Readiness report - x-trends-mindmap-auto, themodernwallet.com, 2026-11-26
Job: xtrends-modernwallet-2026-11-26. Author: mindmap-build. Preflight bundle: reports/mindmap-pass/2026-11-26-xtrends-run/preflight-build (32 parts, check = delivery-complete-sources-current). Authorization: unattended x-trends-mindmap-auto caller; Phase 0 treated as approved by caller; no human gate. Independent CHART-REVIEW still required (not self-approved).

## Intake reconciliation (frozen intake reports/x-trends/2026-11-26.md, untrusted data)
| Bullet | Disposition | Action |
|---|---|---|
| 1 SpaceX share / Trump Account [ENRICH /guides/elon-musk-spacex-share-for-kids/] | ENRICH existing page (path confirmed present in src/data/guides.ts, in sitemap) | A1 body enrichment + A2 metadata (title/description still say "Can't Be Claimed Yet") |
| 2 Allstate outage | NEW PAGE (coverage_lookup: no existing page; site has zero insurance-company pages) | A3 new guide |

## Duplicate check
passed - 1 new-page rows checked, 0 matched an existing page (coverage-lookup.txt; the ENRICH route matched its own exact slug as expected and is an enrichment, not a new page).

## Primary-source research (saved verbatim-as-retrievable under research/sources/)
Tool limits: WebFetch returns summaries or extracted text, not raw HTML; files are labelled accordingly. Facts we could and could not verify:
- VERIFIED (CNBC 2026-11-25, updated 11-26): SpaceX said one Class A share to every "active" Trump Account; Musk to match; Musk says his share transfers when his lockup expires in June 2027; CNBC says it is "unclear how many are considered active" and does not define active; Shotwell's 2M+ share gift expected in December; families cannot refuse stock gifts and generally cannot sell until the earlier of five years or end of the calendar year the beneficiary turns 17 (CNBC citing Treasury guidance); auto-enrolled children can receive philanthropic contributions without a claim; claim required for $1,000 seed and family/employer contributions. CNBC does not state whether the SpaceX share needs a claim.
- VERIFIED (trumpaccounts.gov): claim steps in the official app (verify identity, confirm relationship, review child info, accept terms, optional $1,000 claim), auto-enrollment as of Oct 1 2026, call center 866-USA-4547. Page has no SpaceX notice.
- NOT VERIFIABLE: the SpaceX X post (x.com/SpaceX/status/2125671356339499494) and Musk's post were not retrievable; ir.spacex.com has no announcement; Federal Register T.D. 10056 fetch was blocked. The brief's claim "SpaceX's share transfers in December" is NOT supported by CNBC (December is tied to Shotwell's gift) and must not be stated; say SpaceX's own transfer date is unconfirmed. "Active" is undefined in every source reached; state that plainly, never invent a definition.
- Allstate (PYMNTS 11-25, TechCrunch 11-25): outage since Mon Nov 23 of phone, email, payments, web, app; Allstate statement (as reported): some access restricted, claims still handled, customers unable to pay because of the disruption will not lose coverage or be charged late fees; cause and resolution time undisclosed; Oklahoma House Insurance Committee leaders urged no penalty. No Allstate-first-party notice or state DOI outage statement could be retrieved (allstate.com notice 404; search found none). Attribute the statement to reporting, not to a policy document. The unconfirmed layoff report in TechCrunch must not be repeated.
- State rules (HIGH profile support): California DOI auto guide: 10-day written notice after the payment due date before nonpayment cancellation; NAIC Compendium (Summer 2024) shows MO at least 10 days, NJ 15 days for nonpayment. Notice periods vary by state; no universal period may be asserted, and these rules do not by themselves cover outage-caused nonpayment.

## Keyword/SERP evidence (SEMRUSH first, DataForSEO fallback; check date 2026-11-26, us database)
Keyword data: volume=semrush, kd=semrush (DataForSEO used for SERP only). Measured: "allstate outage" 20/mo; "allstate down" 30; "allstate outage today" 0; "spacex trump account" 140; "how to claim trump account" 110. Estimates (autocomplete band, NOT measured): "allstate payment outage" 20-200; "spacex share trump account" 150-1500. Fresh-trend rule applied: low or zero measured volume does not veto; demand inferred from the X post surge (34/69/136 posts Nov 23-25) and live news, no tool volume yet. Autocomplete question sweep: 39 allstate / 15 spacex suggestions, saved (ac-*.csv); DataForSEO SERP reads: 2 heads, cost $0.0043 (serp.json). Allstate SERP: winnable, top 10 = newsweek, downdetector, cleveland.com, yahoo finance, allstate; PAA: "Is the Allstate system down right now?", "Why is the Allstate app not working?", "Why can't I log into my Allstate account?". SpaceX SERP: winnable (AI Overview cites forbes, chosun, investamerica, cnbc); PAA "Did SpaceX donate to Trump accounts?", "Is Elon Musk giving every kid a share of SpaceX?". Discovery limit: no widening (2 seeds, cluster sweep exhausted its actionable intents; rest were off-topic or news-live status queries).

## Risk profile
A3 Allstate: HIGH (consequential insurance and financial actions: coverage lapse, claims, switching). No medical/legal-liability claim; no professionalReviewRequired. A1/A2 SpaceX share: STANDARD-to-HIGH (financial/tax-adjacent children's accounts); treat as HIGH for review. Testing/labels: Modern Wallet `_experience.md` section G licenses product testing only on roundup/review/comparison pages and never financial services; no test was run. Both pages use ordinary presentation, no "tested" title, byline, method section or schema. Evidence basis for both = reported (source-only) with a calculated-free reasoning trail; no modeling, no measurements. Visible attribution names CNBC/PYMNTS/TechCrunch/Treasury/CA DOI/NAIC.

## Presentation decisions
A1: static answer (timeline table with reported vs unconfirmed columns plus numbered claim steps); no calculator since inputs do not change the answer. A3: static triage (checklist and a "what to do by situation" table); no interaction needed; no animation.

## Application map (rule -> artifact)
- _decision-evidence/_testing-labels: evidence basis "reported" per action in manifest `contributionAndEvidence`/`testingAndReview`; takeaway planned per page; no tested label.
- _content-review-policy: A3 HIGH (max 2 audits, liabilityBlock does not apply: no dosing/physical hazard/defamation; insurer statements must be attributed and not presented as policy terms).
- _keyword-demand-ladder: keyword-volumes.json, serp.json, ac-*.csv; provider note above.
- _mindmap-execution: manifest with request coverage, presentation decisions, briefs; seal-draft run before handback.
- vendor-research rule: vendor = Allstate; coverage lookup first (no existing coverage) then new-claim research (outage is a new event).
- rendered-page-audit/chart-obligations: central answers researched now; shared-template impact: guides template only; inherited "tested" labels: none expected on guides route (checked by WRITE/AUDIT via rendered capture).
- Counterexample test: strongest counterexample to "you will not lose coverage": Allstate's statement is a news-reported company statement, not a policy amendment; state cancellation rules vary, a policy can still cancel after notice; so the page tells readers to get written confirmation and keep proof.

## Per-page preparation checks
| Page | Duplicate check | Testing eligibility | Evidence and label decision | Takeaway brief | Evidence |
|---|---|---|---|---|---|
| /guides/elon-musk-spacex-share-for-kids/ (enrich) | exact route exists; lookup recorded | not eligible (financial, not product test) | reported; ordinary | claim the account for other reasons, SpaceX share not reserved by claiming; unknowns stated | CNBC, trumpaccounts.gov files |
| /guides/allstate-outage-coverage-payments-claims/ (new) | no existing home | not eligible | reported; ordinary | document everything, get written confirmation, switch only after new coverage is active and proof in hand | PYMNTS, TechCrunch, CA DOI, NAIC files |
