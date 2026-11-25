# Approved Page Assignment: `/guides/medicaid-work-requirements-2027-hold-harmless/` (`medicaid-work-requirements-2027-hold-harmless`)
- **Action ID:** `A3` (create new content)
- **Active Mindmap Track:** `guide`
- **Title:** Medicaid Work Requirements 2027: Will You Lose Coverage?
- **Page Type / Format / Medium:** guide (explainer, floor 1,200 words) | article | text + comparison table
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** Will I lose Medicaid on Jan 1 for missing the new work requirement? [verb-only - no PAA, no completions]
- **Working Answer (Col 11):** Not automatically: the federal requirement starts Jan 1, 2027, but in a state that elected CMS's optional hold-harmless period it cannot deny or disenroll for non-compliance through June 30, 2027; you still must report. In other states, noncompliance triggers a notice and 30 days to respond.
- **Answer Placement (Col 12):** section 1: 'Will You Lose Medicaid on January 1?'

## Demand & Differentiation Context
- **Problem / Gap:** lookup: no match. Site has only /compare/aca-vs-medicaid/ and /compare/medicare-vs-medicaid/ (different intent). Demand inferred - fresh news trend, no tool volume.
- **Keyword Evidence:** "Primary: 'medicaid work requirements 2027'; supporting: 'medicaid work requirement hold harmless', 'which states delay medicaid work requirements'. Demand inferred - fresh news trend, no tool volume (no provider call this run; labeled not measured). Checked 2026-11-25."
- **Why New Page / Angle:** Coverage lookup (research/coverage-lookup.txt): no existing page; /compare/aca-vs-medicaid/ and /compare/medicare-vs-medicaid/ answer eligibility comparison, not penalties for missing the requirement. No commits name the topic (git log checked via lookup: 'Commits naming the topic: none').
- **Intent-Based Our Takeaway:** "For most Medicaid adults 19-64 the Jan 1 date matters only if your state did not opt in and you cannot show 80 hours, income of $580 a month, or an exemption; in an opted-in state coverage cannot be cut for non-compliance before July 1, 2027, but the clock and reporting duty still apply. This changes if CMS or a court changes the delay or your state withdraws."

## Eligible Internal & Testing Evidence Pool for Page Type `how-to-or-workflow-guide` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

## Approved Section Outline
1. **Will You Lose Medicaid on January 1?** — Direct conditional answer: federal start date, hold-harmless pause to June 30, 2027, you still report
2. **Who the Rule Covers and Who Is Exempt** — Adults 19-64 in the expansion group, 43 states + DC, 80 hours a month or $580 income, exemptions list from CMS fact sheet
3. **What a Hold-Harmless State Can and Cannot Do** — SMDL smd26006: may suspend denials and disenrollments, must still verify; Oregon as the verified example
4. **State Check Table** — Situation vs what happens (opted in, not opted in, exempt, applicant) with sources
5. **What to Do Now** — Report hours or exemption, watch notices, 30-day response window, contact state agency
6. **FAQ** — On-topic questions only

## Approved Internal Outbound Links
- {"source": "/guides/medicaid-work-requirements-2027-hold-harmless/", "target": "/compare/aca-vs-medicaid/", "section": "What to Do Now", "anchor": "ACA vs Medicaid comparison", "purpose": "readers who lose Medicaid need Marketplace coverage", "inspection": {"path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt", "sha256": "6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997"}}
- {"source": "/guides/medicaid-work-requirements-2027-hold-harmless/", "target": "/budget/aca-subsidy-calculator/", "section": "What to Do Now", "anchor": "ACA subsidy calculator", "purpose": "estimate Marketplace cost", "inspection": {"path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt", "sha256": "6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997"}}

## Reviewer Guardrails (Must Respect)
- CR1-A5-STATE-COUNT (substantive): WRITE must not print '22-state'. Use 'New York and 20 other states plus DC, joined by Pennsylvania's governor' (or 'a coalition of 22 attorneys general'), recounted from the NY AG release and the complaint/Federal Register text. Frame the suit as pending: no injunction or vacatur verified, so the rule is not blocked unless a court order exists at publication; recheck docket status before writing.
- CR1-A1-LOCKUP (substantive): WRITE: if the 424B4 lockup section cannot be read in this run, attribute the 180-day and 365-day lockups explicitly to the S-1 ('the S-1 described...; the final prospectus controls, read its lock-up section') and do not state exact expiry dates or a calendar of unlock dates. Do not claim REQ-1's '424B4 lockup terms' as satisfied; record the limit in the A1 evidence packet. If a reader tool for the 424B4 is available, read the 'Shares Eligible for Future Sale' section and cite the page.
- CR1-A1-CLOSE-PRICE (substantive): Write 'closed below the $83 IPO price on Nov 24, according to CNBC'. Do not print a dollar close, a percent drop figure beyond CNBC's 6.5%, or the Nov 19 $97.17 close. Open-price buyers at $111.50 are down more than 25% at any price at or below $83 (calculated: 83/111.50 - 1 = -25.6%); label as arithmetic, not a measured close. Give analyst targets only as CNBC-attributed. Because the price moves daily, date-stamp every price statement and avoid present-tense 'is trading at'. Do not give a sell/hold/buy instruction; conditional framing by holder type and horizon, with a not-personalized-advice limit.
- CR1-A3-SMDL (substantive): WRITE/AUDIT: read the SMDL text before stating conditions, or state only what the medicaid.gov page and OHA release support (states electing may suspend denials and disenrollments; period ends 2027-06-30; members still must verify). Do not state the Dec 11 deadline unless the SMDL confirms it; do not call any state besides Oregon opted in; describe the 30-day notice as the CMS interim rule's procedure subject to state implementation and the court ruling; give 'check your state Medicaid agency' as the route for state status. Keep section 1 conditional (opted-in vs not, exempt vs not). Do not say coverage is safe, say it cannot be denied or terminated for non-compliance in an electing state through June 30, 2027.
- CR1-A4-DELIVERY (substantive): Page must not assert a delivery-date rule or that closing in December vs January decides which limit applies. State FHFA's wording (limits for mortgages the Enterprises can acquire in 2027), say a lender decides which year's limit a given loan falls under, and answer 'does waiting until January help' conditionally: only for a loan between $832,750 and $855,400 (or the equivalent county band) and only if the lender confirms. Table is calculated: label 'In our internal calculation' with formula limit / (1 - down payment share), floor of the county-limit case, and note it ignores financed fees such as FHA-type premiums and that a lender may set its own jumbo thresholds. No invented jumbo rate premium.
- CR1-INHERITED-TEXT (substantive): Link-only edit on /compare/aca-vs-medicaid/ is acceptable only if the rendered page, after the link, does not contradict A3 (reader would read 'may need to meet' next to an A3 saying hold-harmless states may pause); AUDIT must read the rendered section and either add one reconciling clause (preserving unrelated content) or drop that inbound link and use another. For stale conforming-limit statements: roundups.ts:1901 'currently $806,500' is a dated claim contradicted by A4; correct it with a one-sentence targeted edit citing the 2027 limit, or add a link to A4, and AUDIT must check the rendered routes touched. The 2025-labelled comparison rows are dated and may stay.
- CR1-LINK-INSPECTION (substantive): Before Phase 6, open each source record and pick the real section for each anchor; where the named section does not exist, place the link in the closest relevant section (not the homepage nav) and record it. Keep link-only edits free of updatedDate bumps. Target is 2 inbound for A3/A5 and 3 for A4; fewer strong placements are acceptable over forced ones.
- CR1-SOURCE-FORM (substantive): WRITE must open the Federal Register text for 2026-23003 (effective date, 90-day evidence window, covered programs, proration language) and use direct quotations only from text actually read. AUDIT re-reads the primary pages instead of these extractions for every consequential figure. Source limits must be recorded in each evidence.json.
- CR1-ATTRIBUTION-TAKEAWAY (minor): AUDIT confirms the five rendered pages (and the two link-only/sentence-only touched routes) carry no 'tested' badge, byline or schema; A1/A3/A5 name the external source (CNBC, CMS, medicaid.gov, OHA, HUD, NY AG) for each fact and give the intent-based takeaways already in the briefs, including their reversal conditions. HIGH profile: AUDIT records riskAssessment with exact consequential-claim quotes.
- CR1-META-NOTE (advisory): Do not silently change; record a proposed result-specific title/description in the A1 evidence packet for the metadata lane. cardBlurb and introText are in scope and must be corrected.
- CR1-A5-STATE-COUNT
- CR1-A1-LOCKUP
- CR1-A1-CLOSE-PRICE
- CR1-A3-SMDL
- CR1-A4-DELIVERY
- CR1-INHERITED-TEXT
- CR1-LINK-INSPECTION
- CR1-SOURCE-FORM
- CR1-ATTRIBUTION-TAKEAWAY
- CR1-META-NOTE

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"reported"` (no executed multi-vendor benchmark script in `evidence.json`): NEVER claim hands-on product execution (`"In our internal testing"`, `"we tested"`, or `(Tested YYYY)`). You SHOULD still incorporate any genuinely relevant anonymized client/operator records (`Matched First-Party Client, Owned-App & Operator Experience Records` above) and any `Pre-Computed Practical Workload & Human-Unit Translations` above (stating their reference assumptions transparently, e.g. "Translating the published 1.5x Free cap against a 20-PDF monthly reading load at 150 words per minute...").
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-write",
  "route": "/guides/medicaid-work-requirements-2027-hold-harmless/",
  "readerQuestion": "Will I lose Medicaid on Jan 1 for missing the new work requirement? [verb-only - no PAA, no completions]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/approval-manifest.json",
      "sha256": "6c14985eb561e414f7f73570656803a94abbd5fbb57e23f4fa3d9e3a43d6d61a"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/chart-review.json",
      "sha256": "8acdedee1ab772bbcdfa994f0f77a57141ea9ebf6b4acdc3cbb1a17a9e3f59fe"
    },
    "actionId": "A3"
  },
  "presentation": {
    "medium": "text + comparison table",
    "placement": "section 1: 'Will You Lose Medicaid on January 1?'",
    "reason": "Reader needs a conditional answer by situation (state opted in or not, exempt or not); a finite table covers it.",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "A fixed finite set of cases; a static table answers faster than inputs"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static scannable layout answers faster; no sequence to animate"
    }
  },
  "basis": "reported",
  "decisionGap": "Readers cannot tell whether Jan 1, 2027 means losing Medicaid for missing the work requirement.",
  "finding": "The federal community engagement requirement starts no later than Jan 1, 2027. CMS (SMD# 26-006, Nov 13 2026) offers states an optional hold harmless period through June 30 2027: states that elect it may suspend eligibility denials and disenrollments for failing to show compliance, for applications received and renewals initiated through that date. States intending to use it from Jan 1 are asked to notify CMS by Dec 11 2026. Oregon (OHA, Nov 23 2026) is the one state verified as opting in. In a state that does not, a person found noncompliant gets notice and 30 calendar days to show compliance or an exemption (CMS IFR fact sheet).",
  "conditions": "Applies to potentially applicable adults 19-64 in the expansion group in 43 states plus DC; not other eligibility factors such as age or income; state election and CMS mitigation-plan approval govern; the hold harmless applies to applications received and renewals initiated through June 30 2027 (or a shorter state period). A court partly vacated parts of the IFR on Oct 29 2026 (Massachusetts v. Oz), which the SMDL itself notes.",
  "whatWouldChange": "CMS or a court changing the delay, a state withdrawing or shortening its period, or a state outside Oregon electing the option.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-xtrends-run/evidence/medicaid-work-requirements-2027-hold-harmless/cases.json",
    "sha256": "aed2f35afea270a28b70eb6b68ed821b767d5ab3b37f2906b46e8bcb92ca5edf"
  },
  "caseDecisions": "Retrieved cases.json for this question: no approved client record on this site matches (site _experience.md lists no named-client specifics). No client claim used; none forced.",
  "sourceArtifacts": [
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/cms-medicaid-ce-ifr.txt",
      "sha256": "7d5f460c606cf71f4d4b66c3728047d098ed22735806f618628327cbd24f14e5"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/medicaid-gov-ce-hold-harmless.txt",
      "sha256": "2b13315fd5abbf682ac8e3d5a434b07cd355517a04177941f5071723b48aa132"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/oregon-oha-hold-harmless.txt",
      "sha256": "376b1faeb29a5f31e7b0ff6985335a2926b1ff0b7819e3489fae9008d1171941"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/coverage-lookup.txt",
      "sha256": "4eb2f2b166b5ac49eca0861e02f0ad059bc46cfc0106727c76f562c81403a162"
    },
    {
      "path": "reports/x-trends/2026-11-25.md",
      "sha256": "3d4b8fc88a4a099cc9d035695505b4a8726d0ff16b737e24bcdafee3aea577b7"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/smd26006-full.txt",
      "sha256": "3a96befec24ca0b83c488acc4652932773771b2f3404b1f72b4b2d9f3669771c"
    }
  ],
  "whyNoQuantitativeAnalysis": "Policy rules and dates; no input changes a federal answer and the state agency decides.",
  "reasoning": "SMDL text read in full (smd26006-full.txt) states the option, end date, scope (only community engagement denials/disenrollments), the Dec 11 notification request and that after the period the state must deny or terminate with 42 CFR 435.558 procedures. CMS fact sheet gives the 80-hour/$580 standard, exemptions and 30-day notice. OHA release gives Oregon's election. Maryland and New Hampshire not verified from primary source: excluded.",
  "provenance": {
    "basis": "reported",
    "supportingRecordIds": [
      "smd26006-full.txt",
      "cms-medicaid-ce-ifr.txt",
      "oregon-oha-hold-harmless.txt",
      "medicaid-gov-ce-hold-harmless.txt"
    ],
    "scopeAndLimits": "named primary sources; KFF secondary not used for claims",
    "publicMethod": "On-page attribution to CMS, medicaid.gov and OHA with links",
    "placement": "section 1 and state check table"
  },
  "sourceLimits": "CMS IFR fact sheet and OHA release were read through fetch extractions in BUILD; AUDIT must re-read. SMDL read in full from the PDF in this run."
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/cms-medicaid-ce-ifr.txt`
```
URL: https://www.cms.gov/newsroom/fact-sheets/medicaid-community-engagement-requirement-certain-individuals-interim-final-rule-comment-period-cms
RETRIEVED_UTC: 2026-11-25T16:52:07Z
NOTE: WebFetch model extraction (page text not reproducible verbatim by the tool); figures below are what the fetch returned.

CMS fact sheet, IFC CMS-2454-IFC (issued 2026-06-01; FR 2026-06-03, 2026-11094)
- Subject: non-pregnant adults 19-64 not entitled/enrolled in Medicare, in Medicaid adult group or certain 1115 MEC demos; 43 states + DC; territories not subject.
- 80 hrs/month work, community service, work program, or half-time education, or combo; or income >= fed min wage x 80 ($580/mo in 2026).
- Exemptions: former foster youth; AI/AN; parents/caretakers of child 13 and under or disabled person; totally disabled veterans; medically frail; TANF/SNAP-compliant; SUD treatment; inmates; pregnant/postpartum.
- Look-back: applicants >=1 month before applying; enrollees 1+ months between renewals (state sets). Verify at application and renewal. Noncompliance notice then 30 calendar days to show compliance/exemption.
- States generally implement by 2027-01-01.

```
### `reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/medicaid-gov-ce-hold-harmless.txt`
```
URL: https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement
RETRIEVED_UTC: 2026-11-25T16:52:07Z
NOTE: WebFetch model extraction (page text not reproducible verbatim by the tool); figures below are what the fetch returned.

medicaid.gov community engagement page: Sec. 71119 of P.L. 119-21; start 2027-01-01 unless state sooner. SMDL smd26006 "Optional Hold Harmless Period for Community Engagement Implementation" posted 2026-11-13; metadata: states electing may suspend denials of eligibility and disenrollments for non-compliance; period ends 2027-06-30. (PDF body unreadable by tool; WRITE/AUDIT must read /root/.claude/projects/.../webfetch-1795625481342-i4gzeq.pdf or the PDF for notification deadline and conditions.)
KFF (secondary, 2026-11-14): CMS announced 2026-11-13; states still must verify; election notice due to CMS 2026-12-11 (per KFF, unverified in SMDL); court struck IFR provision requiring proof that condition limits ability to work.

```
### `reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/oregon-oha-hold-harmless.txt`
```
URL: https://www.oregon.gov/oha/ERD/Pages/OHA-to-delay-enforcement-of-new-federal-Medicaid-work-rules-to-keep-people-in-Oregon-insured-11.23.2026.aspx
RETRIEVED_UTC: 2026-11-25T16:52:07Z
NOTE: WebFetch model extraction (page text not reproducible verbatim by the tool); figures below are what the fetch returned.

Oregon Health Authority, 2026-11-23: Oregon opts into CMS hold harmless; no loss/denial of coverage for failing the rules through 2027-06-30; members still must verify requirements/exemptions; more time at next renewal. >600,000 OHP members notified in Sept; Gov. office projected up to a third could lose coverage even if qualified. Oct 2026 federal court partial ruling for 25 states (CMS exceeded authority limiting medical exemptions; barred penalizing states for system delays six months).
Maryland and New Hampshire opt-ins from the bullet: NOT verified from a primary source. Do not name them.

```
### `reports/mindmap-pass/2026-11-25-xtrends-run/research/coverage-lookup.txt`
```
coverage_lookup: 5 candidate(s) vs 887 repo pages / 905 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1293 past-chart lines

### /guides/how-to-buy-anthropic-stock  — row - · create new content
keyword: anthropic stock below IPO price; sell hold buy
reader question (new page intent): Anthropic stock fell below IPO price: sell, hold or buy?
lookup terms: buy anthropic stock below ipo sell hold   format cues: pricing

Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:
- /guides/how-to-buy-anthropic-stock  [EXACT SLUG · in sitemap · src/data/guides.ts · topic match 0.57 on buy anthropic stock ipo]
    title: How to Buy Anthropic Stock: IPO Status and Rules
    desc:  Learn how to buy Anthropic stock, what the filed Form S-1 shows, how initial public offering allocations work, and what risks pre-IPO offerings carry.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-10-28-autocomplete.md [exclusions] - Commits checked: `git log` and coverage_lookup for each target: no prior commit created `/rent-vs-buy-calculator/` or `/stock-capital-gains-tax-calculator/`.
- 2026-11-04-podcast.md [table] | Lens 1 direct intent (podcast: How to Money 'capital gains harvesting', Ready For Retirement brokerage episode). 'tax loss harvesting' 12,100/mo KD 53 CPC $3.93 (SEMRUSH us 2026-11-04, measured); 'tax loss harvesting r
- 2026-11-04-tool-usage.md [table] | 8 | stock-capital-gains-tax-calculator (19 people, 20 uses, 36 views (all 19 in the last 7 days); data_days 27). Walkthrough: '0% room left' is the room before the sale (MFJ $80,000 TI + $30,000 gain shows $18,900 thou
- 2026-11-04-tool-usage.md [table] | 9 | stock-capital-gains-tax-calculator (19 people; data_days 27). Verdict fit (books only, YMYL). The visitor's next step after the result is reading on this topic; no data-tool-picks block ships today. Evidence: repor
- 2026-11-23-comparison.md [table] | Lens 1 direct intent (brief candidate). 'bonds vs bond funds': 480/mo KD 6 (DataForSEO 2026-11-23, us). lookup: no same-intent page; Closest existing: /compare/stocks-vs-bonds (asset-class question), /compare/i-bonds-v
- 2026-11-23-xtrends.md [table] | Lens 1 direct intent + news-driven (brief bullet 1; X posts about 401(k) drops rose after the Nov 20 market close, per brief, unverified). Autocomplete (estimate, NOT measured, no provider keys): 'should i sell my 401k
Commits naming the topic: none
Same run overlap: none

### /guides/medicaid-work-requirements-2027  — row - · create new content
keyword: medicaid work requirements January 2027 hold harmless states
reader question (new page intent): Will I lose Medicaid for missing the work requirement?
lookup terms: medicaid work requirement 2027 january hold harmless state   format cues: -

Possible existing homes: none found in the repo page data, the search index or the sitemaps.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-11-04-aca-snap.md [exclusions] - Exclude state login/status/balance navigation, stale2025 shutdown/payment news, congressional predictions, political debates, and state-specific eligibility pages from this bounded first cluster. Current2027/fiscal2027
- 2026-11-04-aca-snap.md [exclusions] - Do not use existing Medicare/Medicaid or early-retirement pages as new inbound/outbound sources because relevant inherited cov
```
### `reports/x-trends/2026-11-25.md`
```
## Scout 2026-11-24 (thread 1a20e2ef23bbe2df) — themodernwallet.com
1. [FRUSTRATION] [ENRICH /guides/how-to-buy-anthropic-stock/] Anthropic stock fell below its $83 IPO price: should you sell, hold or buy, and what happened to people who bought at the open? — ANT opened at $111.50 on Nov 19 after pricing at $83. On Nov 24 it fell as much as 7.3% premarket and broke below the offer price for the first time. Buyers at the open are down about 25%; IPO-allocation holders are roughly flat. The buy-guide page doesn't cover post-IPO price risk or lockups. Sources: https://x.com/MarketWatch/status/2125243148460786131, https://www.cnbc.com/2026/11/24/anthropic-stock-ipo-price.html
2. Will you lose Medicaid on Jan 1 for missing the new work requirement? Which states are pausing penalties until June 30, 2027 — Federal Medicaid work requirements start Jan 1, 2027. CMS's Nov 13 "hold harmless" option lets states delay coverage losses through June 30, 2027. Maryland, New Hampshire and Oregon opted in Nov 20-23. Site has only ACA-vs-Medicaid comparisons. Sources: https://www.oregon.gov/oha/ERD/Pages/OHA-to-delay-enforcement-of-new-federal-Medicaid-work-rules-to-keep-people-in-Oregon-insured-11.23.2026.aspx, https://www.beckerspayer.com/payer/medicaid/3-states-planning-to-delay-medicaid-work-rules-enforcement/
3. Medicare's next 13 negotiated drug prices (2028): full list, first Part B drugs, what you'll pay — CMS announced Nov 23; effective Jan 1, 2028; est. savings $9.2B (45%). Sources: https://www.cms.gov/initiatives/medicare-prescription-drug-affordability/overview/medicare-drug-price-negotiation-program/selected-drugs-negotiated-prices

## Scout 2026-11-25 (thread 1a21354b636c2c5b) — themodernwallet.com
4. [RELEASE] 2027 conforming loan limit is $855,400: how much you can borrow before it's jumbo, county limit, whether waiting until January helps — FHFA raised baseline 2.72% (+$22,650). High-cost ceiling $1,283,100. Applies to loans delivered to Fannie Mae on/after Jan 1, 2027. Site has no loan-limit page. Sources: https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-for-2027
5. HUD's mixed-status housing rule takes effect Dec 14: which families lose prorated rent help, 22-state lawsuit, what tenants should do — Sources: https://ag.ny.gov/press-release/2026/attorney-general-james-sues-stop-trump-administration-pushing-thousands-us, https://gothamist.com/news/attorney-general-letitia-james-sues-hud-over-mixed-status-housing-rule

```
### `reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/fhfa-2027-cll.txt`
```
URL: https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-for-2027
RETRIEVED_UTC: 2026-11-25T16:52:07Z
NOTE: WebFetch model extraction (page text not reproducible verbatim by the tool); figures below are what the fetch returned.

FHFA Announces Conforming Loan Limit for 2027 (released 11/24/2026)
- Baseline one-unit limit 2027: $855,400, up $22,650 from 2026 (=> 2026 baseline $832,750).
- Basis: average US home prices rose 2.72% Q3 2025 to Q3 2026; baseline rises same percent.
- High-cost ceiling one-unit: $1,283,100 (150% of baseline).
- Alaska, Hawaii, Guam, USVI: baseline $1,283,100; ceiling $1,924,650.
- Limits higher in all but 24 counties/county equivalents.
- Links: full county list, map, methodology addendum, FAQ, LoanLimitQuestions@fhfa.gov.
FHFA data page (https://www.fhfa.gov/data/conforming-loan-limit): lists tie to the calendar year a loan is acquired; page does not state a "delivery" rule; 2027 amounts are in county list files.
NOT VERIFIED: any Fannie/Freddie delivery-date rule for 2027 (search found only 2026 precedent). Page must not assert one.

```
### `reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/cnbc-anthropic-below-ipo.txt`
```
URL: https://www.cnbc.com/2026/11/24/anthropic-stock-ipo-price.html
RETRIEVED_UTC: 2026-11-25T16:52:07Z
NOTE: WebFetch model extraction (page text not reproducible verbatim by the tool); figures below are what the fetch returned.

CNBC, Tue Nov 24 2026: "Anthropic stock falls below $83 IPO price, but analysts are still largely positive"
- IPO price $83; opened $111.50 on Nasdaq Thu Nov 19; fell 6.5% Tue and closed below IPO price (exact close not given on page).
- Raised $81.3B; oversubscribed; about half of institutional investors that ordered received no shares.
- Analysts: Canaccord Buy $135; Wedbush Outperform $120; Oppenheimer Outperform $150.
- Lockup not mentioned on the page.
Secondary (web search, not primary): Nov 19 close $97.17 (+17% vs $83), intraday high ~$115.10. Nov 24 close NOT confirmed anywhere.
Bullet claim "fell as much as 7.3% premarket": unverified (x.com post returned HTTP 402).
Arithmetic: 83/111.50-1 = -25.6%, so "open buyers down about 25%" holds only at an $83 price; use "below $83 means open buyers are down more than 25%" or avoid.

```
### `reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/sec-anthropic-424b4.txt`
```
URL: https://www.sec.gov/Archives/edgar/data/2130357/000162828026074944/0001628280-26-074944-index.htm
RETRIEVED_UTC: 2026-11-25T16:52:07Z
NOTE: WebFetch model extraction (page text not reproducible verbatim by the tool); figures below are what the fetch returned.

SEC EDGAR, Anthropic, PBC (CIK 0002130357): Form 424B4 final prospectus filed 2026-11-19, accession 0001628280-26-074944, file no. 333-299633. (Index only fetched; prospectus body 94 MB not read. WRITE/AUDIT must read lockup/share terms from the 424B4 text before stating them.)
Existing page already cites S-1 (acc 0001628280-26-067168) lockups: 180 days insiders, 365 days certain holders (from S-1; confirm in 424B4).

```


# CLOSED FACT LIST (AUTHORITATIVE; supersedes anything above, including the scout brief, KFF/secondary notes and the x-trends bullets)
Anything not on this list, you do not know. Never invent a price, limit, date, count, name, quote or URL. If a needed fact is not here, leave it out or say it is not published and link the primary source.
Style reminders: register operator; no em-dashes; no "tested" or "we tested" claims, no testing badge; no first-person experience beyond what the packet's provenance licenses; keep the "At The Modern Wallet, we" first company claim rule; an intent-based "Our Takeaway" section near the end; FAQ questions in sentence case; a final concrete next-action sentence; disclaimer content goes in the last section only if needed ("general information, not legal/financial/medical advice").
LEAK WARNINGS (facts that appear in the scout brief above but are NOT verified and must NOT appear): "22-state" lawsuit wording; Maryland or New Hampshire as Medicaid hold-harmless states; "7.3% premarket"; "Nov 19 close $97.17"; any Nov 24 dollar close; any Fannie Mae or Freddie Mac "delivery date" rule for the 2027 limit; "$9.2B", "13 drugs"; and any sell/hold/buy instruction.

## FACTS (A3)
Source key: [SMDL] = CMS State Medicaid Director letter SMD# 26-006, "Optional Hold Harmless Period for Community Engagement Implementation", Nov 13 2026, https://www.medicaid.gov/Federal-Policy-Guidance/Downloads/smd26006.pdf (full text below, read in this run). [CMS FS] = CMS fact sheet on the community engagement interim final rule, https://www.cms.gov/newsroom/fact-sheets/medicaid-community-engagement-requirement-certain-individuals-interim-final-rule-comment-period-cms . [MCD] = https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement . [OHA] = Oregon Health Authority release, Nov 23 2026, https://www.oregon.gov/oha/ERD/Pages/OHA-to-delay-enforcement-of-new-federal-Medicaid-work-rules-to-keep-people-in-Oregon-insured-11.23.2026.aspx
1. The community engagement requirement comes from section 71119 of Public Law 119-21 (the "Working Families Tax Cut" legislation as CMS calls it); states must implement it no later than January 1, 2027. [MCD][SMDL]
2. Who: non-pregnant adults 19 to 64 not entitled to or enrolled in Medicare, in the Medicaid adult (expansion) group or certain section 1115 minimum essential coverage demonstrations; 43 states plus DC; territories not subject. [CMS FS]
3. The standard: 80 hours a month of work, community service, a work program, or half-time education, or a combination; or income at least federal minimum wage x 80 hours ($580 a month in 2026). [CMS FS]
4. Exemptions listed by CMS: former foster youth; American Indian and Alaska Native people; parents or caretakers of a child age 13 and under or of a disabled person; totally disabled veterans; medically frail people; people complying with TANF or SNAP work rules; people in substance use disorder treatment; incarcerated people; pregnant and postpartum people. [CMS FS]
5. Look-back: applicants are checked for at least one month before applying; enrollees for one or more months between renewals (state sets); verification at application and renewal. [CMS FS]
6. Noncompliance: the state sends a notice and the person has 30 calendar days to show compliance or an exemption. [CMS FS] (Describe as the CMS interim rule's procedure; state implementation varies. The SMDL says after a hold harmless period ends the state must deny or terminate when an applicable individual has not met the requirement and must first follow noncompliance procedures at 42 CFR 435.558.)
7. [SMDL] CMS is offering all states an optional "hold harmless" period through June 30, 2027, during which states that elect it may suspend denials of eligibility and disenrollments when applicable individuals do not demonstrate compliance with community engagement. It covers applications received and renewals initiated through and including June 30, 2027 (or a shorter state-set period). A state may use less than the full period.
8. [SMDL] CMS will not take enforcement action against a state that suspends eligibility denials and disenrollments based on a failure to show the requirement, an exception, or an exclusion. States must still assess whether individuals meet the requirement or are excluded during the period.
9. [SMDL] The hold harmless period applies only to the community engagement requirement. States may not suspend denials or disenrollments for other eligibility factors such as age or household income.
10. [SMDL] States that want it must request it in their mitigation plans, which CMS approves. States that intend to use it beginning January 1, 2027 are asked to notify CMS by December 11, 2026.
11. [SMDL] After the period ends in a state, for applications submitted and renewals initiated after that, the state must deny or terminate eligibility when an applicable individual is determined ineligible because they did not meet the requirement.
12. [SMDL footnote] A federal court partly vacated parts of the CMS regulations: Massachusetts v. Oz, D. Mass., Oct 29 2026 (cited in the SMDL). [OHA] describes an Oct 2026 federal court partial ruling for 25 states.
13. [OHA] Oregon is the ONLY state to name as opted in (OHA Nov 23 2026): no loss or denial of coverage for failing the rules through June 30, 2027; members still must verify requirements or exemptions; more time at next renewal. OHA notified more than 600,000 Oregon Health Plan members in September; the governor's office projected up to a third could lose coverage even if qualified.
14. No other state may be called opted in. Tell readers to check their state Medicaid agency (name the route, no invented URL; the internal link to /compare/aca-vs-medicaid/ and /budget/aca-subsidy-calculator/ are allowed).
15. Do NOT say coverage is "safe". Say coverage cannot be denied or terminated for noncompliance in an electing state through June 30, 2027, and members still must report.
## FULL TEXT OF [SMDL]
URL: https://www.medicaid.gov/Federal-Policy-Guidance/Downloads/smd26006.pdf
RETRIEVED_UTC: 2026-11-25T16:59:54Z
NOTE: full PDF text via pdftotext (read in WRITE, 229KB PDF)
DEPARTMENT OF HEALTH & HUMAN SERVICES
Centers for Medicare & Medicaid Services
7500 Security Boulevard, Mail Stop S2-26-12
Baltimore, Maryland 21244-1850
SMD# 26-006
RE: Optional Hold Harmless
Period for Community
Engagement Implementation
November 13, 2026
Dear State Medicaid Director:
The Centers for Medicare & Medicaid Services (CMS) has been working with states 1 that elect
to provide coverage to “applicable individuals” as defined in section 1902(xx)(9)(A)(i) of the
Social Security Act (the Act) and 42 C.F.R. § 435.551 2 to implement the community engagement
requirement described in section 1902(xx) of the Act no later than January 1, 2027. We
appreciate your leadership and the substantial progress states have made toward implementing
Medicaid’s community engagement requirement. Across the country, states are modernizing
eligibility systems, developing new data connections, training staff, engaging community
partners, and improving the applicant and beneficiary experience. We recognize the dedication
behind this work and appreciate your commitment to the Medicaid beneficiaries we serve.
Our shared goal is to make community engagement successful for applicants and beneficiaries,
while ensuring that individuals who qualify for exclusions or exceptions are appropriately
identified and excluded. Achieving those goals requires modernized systems, scaled automated
processes, and informed beneficiaries and potential beneficiaries. States should use available
reliable data and, wherever possible, automated processes to verify qualifying activities and
identify exclusions or exceptions, minimizing the need for applicants and beneficiaries to submit
information the state can obtain electronically. When additional information is necessary,
applicants and beneficiaries should receive clear information about their options, accessible
assistance, and a straightforward way to respond.
We have heard directly from states about their implementation timelines, impediments to
successful launches at scale, policy updates, operations, and overall readiness. We are aware that
leading up to January 1, 2027, and continuing thereafter, states are and will be actively
identifying and addressing deficiencies, such as updating eligibility determination logics and
system-generated notices, and mitigating challenges to maintain compliance with timely
eligibility operations, which may arise when they first implement community engagement and
other Medicaid eligibility and enrollment requirements enacted through Public Law No. 119-21
(which CMS refers to as the “Working Families Tax Cut” (WFTC) legislation). Your feedback to
The term “states” in this letter refers to the 50 states and the District of Columbia.
Generally, these are states that provide coverage to the adult group under the state plan (the group described in
section 1902(a)(10)(A)(i)(VIII) of the Act and 42 C.F.R. § 435.119) or to adults who meet many of the criteria under
section 1902(a)(10)(A)(i)(VIII) of the Act, but who are eligible under or enrolled in a demonstration project under
section 1115(a)(2) of the Act that provides minimum essential coverage (MEC), rather than under the state plan (as
detailed in section 1902(xx)(9)(A)(i)(II) of the Act and 42 C.F.R. § 435.551(b)).
1
2

Page 2 – State Medicaid Director
date reinforces the importance of providing a practical transition period that supports the longterm success of community engagement and builds on improvements to the Medicaid eligibility
and enrollment experience.
To that end, CMS is offering all states an optional “hold harmless” period through June 30, 2027,
during which states that elect the option may suspend denials of eligibility and disenrollments
when applicable individuals do not demonstrate compliance with community engagement. The
hold harmless period applies to applicants and beneficiaries who are potentially applicable
individuals. States may also seek CMS approval to adopt other mitigations and strategies to
support successful implementation and address or prevent compliance deficiencies. The hold
harmless period is optional, and states that choose to implement the hold harmless period are not
required to use the option for the entire period through June 30, 2027.
Hold Harmless Period
If a state chooses to use the hold harmless period, CMS will not take enforcement action against
it for failing to condition eligibility on community engagement during that period. Specifically,
CMS will not take enforcement action if a state suspends eligibility denials and disenrollments
based on an individual’s failure to show either that they meet the community engagement
requirement through qualifying activities or an exception (i.e., deemed compliance) or that they
qualify for an exclusion from the requirement. This applies to applications received and renewals
initiated through and including June 30, 2027 (or shorter hold harmless period implemented by
the state). States choosing to use the hold harmless period will be expected to work towards full
compliance with the statute and applicable regulations. 3 States will not be permitted to use the
hold harmless period unless they assess whether individuals meet the requirement (including
through deemed compliance) or are excluded from it, for all relevant applications received or
renewals initiated during the hold harmless period. Doing so will let states test and refine their
systems and processes before enforcement begins, supporting a successful launch of the
community engagement requirement. This will also provide states the opportunity to learn from
the early months of implementation to identify and address workforce training needs and
improve the applicant and beneficiary experience before enforcement begins.
This hold harmless period applies only to the requirement at section 1902(xx)(1) of the Act and
42 C.F.R. § 435.559 to condition initial or continued eligibility on demonstration of community
engagement and does not apply to any other aspects of the requirement to implement community
engagement by January 1, 2027. It also does not apply to denials and disenrollments based on
eligibility criteria other than community engagement. States may not suspend denials or
disenrollments if an applicable individual fails to meet factors of eligibility other than
community engagement during the hold harmless period, such as ineligibility based on age or
household income.
As noted above, states have the option to implement the hold harmless period option or
implement the option for a shorter duration, but, state-specific compliance deficiencies may
The obligation to work towards full compliance with the statute and applicable regulations does not include an
obligation to implement the portion of the regulations recently vacated by a court. See Massachusetts v. Oz, No. 2612692-RGS, 2026 WL 3257397, at *5–6 (D. Mass. Oct. 29, 2026).

3

Page 3 – State Medicaid Director
warrant a state implementing the hold harmless option or other mitigations to avoid corrective
action under section 1904 of the Act for state noncompliance.
For applications submitted and renewals initiated after the hold harmless period ends in the state,
the state must deny or terminate eligibility (as applicable) when an applicable individual is
determined ineligible for Medicaid because the individual has not met the community
engagement requirement. Before denying or terminating eligibility, the state must comply with
all applicable regulatory requirements, including (but not limited to) noncompliance procedures
described at 42 C.F.R. § 435.558.
States that wish to use the hold harmless period should request it as an optional strategy in their
mitigation plans described further in this letter, which are submitted to
Medicaidworks@cms.hhs.gov and their state lead. CMS will approve use of the hold harmless
period as part of the state’s mitigation plan. States that have already submitted a mitigation plan
or have requested a good faith effort exemption may update their requests to take into account
the hold harmless period option. States that intend to use the hold harmless period beginning
January 1, 2027, are asked to notify CMS by December 11, 2026.
State Mitigation Plans
CMS previously shared with states that they should identify compliance deficiencies as well as
mitigations and other strategies to support implementation of the community engagement
requirement and other eligibility and enrollment provisions of the WFTC legislation. States are
encouraged to review all relevant regulations and available guidance to assess their compliance
with community engagement and must obtain CMS approval prior to implementing the hold
harmless period or other mitigations to address compliance deficiencies. CMS will monitor state
implementation of community engagement, including use of the hold harmless period and other
mitigations and strategies outlined in a state’s approved community engagement mitigation plan.
A state must comply with its approved mitigation plan to avoid formal compliance action under
section 1904 of the Act for compliance deficiencies associated with implementation of
community engagement or other eligibility provisions. States may need to work with CMS to
update their mitigation plans as their implementation evolves.
Eligibility determinations for applicable individuals who did not demonstrate community
engagement and whose applications are filed or renewals are initiated during the hold harmless
period that is documented in a state’s approved mitigation plan will not be considered an error
for purposes of the Payment Error Rate Measurement (PERM) reviews, Medicaid Eligibility
Quality Control (MEQC) reviews, or other CMS Medicaid beneficiary eligibility audits.
Similarly, states that implement other mitigations that are documented in an approved mitigation
plan related to community engagement implementation and that are compliant with the
parameters of that plan (including updates to the plan as implementation evolves) will not be
considered in violation of the Medicaid statute and regulations for purposes of PERM reviews,
MEQC reviews, or other CMS Medicaid beneficiary eligibility audits.

Page 4 – State Medicaid Director
Closing
CMS will remain an active partner throughout this transition period, providing technical
assistance, helping states resolve implementation challenges, and sharing effective approaches
across states. We encourage states to continue raising implementation concerns early so we can
work together to address them.
Thank you for your continued partnership and the extraordinary effort of your teams. Together,
we can implement community engagement in a way that supports better health, greater
opportunity, and lasting paths to prosperity for the people who depend on Medicaid. If you have
questions regarding this letter or would like to request technical assistance, please email
Medicaidworks@cms.hhs.gov.
Sincerely,
/s/
Daniel Brillman
Deputy Administrator and Director

