# Approved Page Assignment: `/guides/hud-mixed-status-housing-rule/` (`hud-mixed-status-housing-rule`)
- **Action ID:** `A5` (create new content)
- **Active Mindmap Track:** `guide`
- **Title:** HUD Mixed-Status Housing Rule: What Changes December 14
- **Page Type / Format / Medium:** guide (explainer, floor 1,200 words) | article | text + comparison table
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** Which families lose prorated rent help under HUD's mixed-status rule, and what should tenants do? [verb-only - no PAA, no completions]
- **Working Answer (Col 11):** From Dec 14, 2026 every household member in covered programs must verify eligible status; mixed-status families keep prorated help only while verification is pending, with 90 days after the effective date to submit evidence; a 22-state suit is pending, so check for a court order before acting.
- **Answer Placement (Col 12):** section 1: 'What Changes on December 14'

## Demand & Differentiation Context
- **Problem / Gap:** lookup: no match; no HUD/rental-assistance page on site (closest: /guides/how-much-should-i-spend-on-rent/). Demand inferred - fresh news trend, no tool volume.
- **Keyword Evidence:** "Primary: 'hud mixed status rule'; supporting: 'mixed status families section 8 rule', 'hud prorated assistance'. Demand inferred - fresh news trend, no tool volume (not measured). Checked 2026-11-25."
- **Why New Page / Angle:** Coverage lookup: no existing page; /guides/how-much-should-i-spend-on-rent/ and /compare/renting-vs-buying/ do not cover assisted-housing rules.
- **Intent-Based Our Takeaway:** "If your household is in public housing, vouchers or project-based Section 8, gather proof of eligible status for every member before the 90-day window (about March 14, 2027) and ask your housing authority what applies to you; this changes if a court blocks the rule or HUD revises it."

## Eligible Internal & Testing Evidence Pool for Page Type `how-to-or-workflow-guide` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

## Approved Section Outline
1. **What Changes on December 14** — Rule published 2026-11-12 (FR 2026-23003), effective 2026-12-14, every member must verify status, proration only while pending
2. **Who Is Affected and Which Programs** — Public Housing, HCV, project-based Section 8 covered; 202/811 PRAC, 811 PRA, SPRAC, 202/162 PAC not covered; HUD estimates cited by NY AG: about 20,000 families, 78,100 people
3. **Timeline Table** — Publication, effective date, 90-day mixed-status evidence window (about March 14, 2027), non-mixed at next recertification
4. **The Lawsuit** — Multistate suit in D. Mass. (NY AG release, 2026-11-23), claims and relief sought; no injunction verified; pending is not a block
5. **What Tenants Should Do** — Talk to housing authority, keep documents, legal aid, do not leave on rumor
6. **FAQ** — On-topic

## Approved Internal Outbound Links
- {"source": "/guides/hud-mixed-status-housing-rule/", "target": "/guides/how-much-should-i-spend-on-rent/", "section": "What Tenants Should Do", "anchor": "how much to spend on rent", "purpose": "budget planning if assistance changes", "inspection": {"path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt", "sha256": "6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997"}}

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
  "route": "/guides/hud-mixed-status-housing-rule/",
  "readerQuestion": "Which families lose prorated rent help under HUD's mixed-status rule, and what should tenants do? [verb-only - no PAA, no completions]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/approval-manifest.json",
      "sha256": "6c14985eb561e414f7f73570656803a94abbd5fbb57e23f4fa3d9e3a43d6d61a"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/chart-review.json",
      "sha256": "8acdedee1ab772bbcdfa994f0f77a57141ea9ebf6b4acdc3cbb1a17a9e3f59fe"
    },
    "actionId": "A5"
  },
  "presentation": {
    "medium": "text + comparison table",
    "placement": "section 1: 'What Changes on December 14'",
    "reason": "Dated rule changes and who-is-affected cases are finite; a timeline table plus short sections suffice.",
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
  "decisionGap": "Tenants cannot tell from news summaries what changes on Dec 14, who has to document status and by when, or whether the lawsuit stops the rule.",
  "finding": "HUD's final rule (FR 2026-23003, 91 FR 72978, published Nov 12 2026) is effective Dec 14 2026. It requires verification of citizenship or eligible immigration status for all applicants and recipients of covered programs regardless of age, and makes prorated assistance a temporary condition pending verification. Tenants in mixed families who have not submitted evidence by Dec 14 must do so within 90 days of Dec 14 2026; other tenants at their next annual or interim reexamination. Responsible entities must give the Section 214 notice within 30 days after the effective date. Extensions of up to 60 days are available on certification. The NY AG suit (Nov 23 2026, D. Mass.) is pending; no injunction verified.",
  "conditions": "Covered programs per FR: Section 236 (tenants paying below market rent), Public Housing, Section 8 rental assistance programs and Housing Development Grant low-income units; HUD's page lists 202/811 PRAC, 811 PRA, SPRAC and 202/162 PAC as not covered. Not legal advice.",
  "whatWouldChange": "A court order blocking the rule, HUD revising it, or a housing authority's own notice with different dates.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-xtrends-run/evidence/hud-mixed-status-housing-rule/cases.json",
    "sha256": "f74bf9c480c86ba137438c264fbd51b73339c06f7c77f89fcf2e24f66a4079fd"
  },
  "caseDecisions": "Retrieved cases.json for this question: no approved client record on this site matches (site _experience.md lists no named-client specifics). No client claim used; none forced.",
  "sourceArtifacts": [
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/hud-mixed-status-rule.txt",
      "sha256": "0ce53843d402c1ba27d963098c8fd0d86130e60d25ffc104c17d6a9f7ca283b9"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/ny-ag-hud-lawsuit.txt",
      "sha256": "0e1c84e7af5ea0f9440f86b0bfc6f2c4700978a9ff732a8eae81620afced3083"
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
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/fr-2026-23003-excerpt.txt",
      "sha256": "d456450a72e9d31a01fbdce474e36ab5685de87ff66e3e91a946d49b02731354"
    }
  ],
  "whyNoQuantitativeAnalysis": "Regulatory dates and rules; no calculation changes the answer. The only date arithmetic is Dec 14 2026 plus 90 days = Mar 14 2027.",
  "reasoning": "Federal Register text read in this run (fr-2026-23003-excerpt.txt) gives the effective date, covered programs, 90-day and reexamination timing, 30-day notice and 60-day extension; HUD verification page and NY AG release give program exclusions and the suit. State count: NY AG release lists 21 other AGs besides NY plus DC and PA's governor, so the page uses the NY AG wording rather than a state count.",
  "provenance": {
    "basis": "reported",
    "supportingRecordIds": [
      "fr-2026-23003-excerpt.txt",
      "hud-mixed-status-rule.txt",
      "ny-ag-hud-lawsuit.txt"
    ],
    "scopeAndLimits": "HUD and Federal Register text; NY AG release for the suit",
    "publicMethod": "On-page attribution with links",
    "placement": "section 1 and timeline table"
  },
  "sourceLimits": "NY AG release read through a BUILD fetch extraction; AUDIT re-reads and recounts. Docket status rechecked only through the NY AG release in this run; no order verified."
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/hud-mixed-status-rule.txt`
```
URL: https://www.hud.gov/hud-partners/verification-of-eligible-status
RETRIEVED_UTC: 2026-11-25T16:52:07Z
NOTE: WebFetch model extraction (page text not reproducible verbatim by the tool); figures below are what the fetch returned.

HUD page: final rule published Federal Register 2026-11-12 (2026-23003, https://www.federalregister.gov/documents/2026/11/12/2026-23003/housing-and-community-development-act-of-1980-verification-of-eligible-status), effective 2026-12-14.
- Every family member must verify eligible status for household to keep rental assistance. Mixed-status families: 90 days after effective date (~2027-03-14) to provide evidence; non-mixed: by next annual/interim recertification. Prorated assistance only while verification of all members pending. "Do not contend" option ends. Applies to Section 214 programs: Public Housing, HCV, Project-based Section 8; not 202/811 PRAC, 811 PRA, SPRAC, 202/162 PAC.

```
### `reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/ny-ag-hud-lawsuit.txt`
```
URL: https://ag.ny.gov/press-release/2026/attorney-general-james-sues-stop-trump-administration-pushing-thousands-us
RETRIEVED_UTC: 2026-11-25T16:52:07Z
NOTE: WebFetch model extraction (page text not reproducible verbatim by the tool); figures below are what the fetch returned.

NY AG release (suit dated 2026-11-23): led by NY AG James, 21 other AGs + PA governor (AZ, CA, CO, CT, DE, HI, IL, ME, MD, MA, MI, MN, NJ, NM, OR, RI, VA, VT, WA, WI, DC listed); D. Mass.; claims HUD exceeds authority (1997 law allows prorating) and violates APA; seeks declaration, vacatur, injunction for plaintiff states. HUD estimates cited: ~20,000 mixed-status families, 78,100 people lose assistance, ~55,000 fully eligible mostly children. Count "22-state" per bullet: 21 listed states+DC=22 AG offices plus PA governor; WRITE must recount from the release. Also a separate C.D. Cal. suit by LA nonprofits (secondary report). No injunction status verified.

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


# CLOSED FACT LIST (AUTHORITATIVE; supersedes anything above, including the scout brief, KFF/secondary notes and the x-trends bullets)
Anything not on this list, you do not know. Never invent a price, limit, date, count, name, quote or URL. If a needed fact is not here, leave it out or say it is not published and link the primary source.
Style reminders: register operator; no em-dashes; no "tested" or "we tested" claims, no testing badge; no first-person experience beyond what the packet's provenance licenses; keep the "At The Modern Wallet, we" first company claim rule; an intent-based "Our Takeaway" section near the end; FAQ questions in sentence case; a final concrete next-action sentence; disclaimer content goes in the last section only if needed ("general information, not legal/financial/medical advice").
LEAK WARNINGS (facts that appear in the scout brief above but are NOT verified and must NOT appear): "22-state" lawsuit wording; Maryland or New Hampshire as Medicaid hold-harmless states; "7.3% premarket"; "Nov 19 close $97.17"; any Nov 24 dollar close; any Fannie Mae or Freddie Mac "delivery date" rule for the 2027 limit; "$9.2B", "13 drugs"; and any sell/hold/buy instruction.

## FACTS (A5)
Source key: [FR] = Federal Register 2026-23003, "Housing and Community Development Act of 1980: Verification of Eligible Status", final rule, 91 FR 72978, published Nov 12 2026, https://www.federalregister.gov/documents/2026/11/12/2026-23003/housing-and-community-development-act-of-1980-verification-of-eligible-status (full text read via https://www.govinfo.gov/content/pkg/FR-2026-11-12/pdf/2026-23003.pdf; excerpt below). [HUD] = https://www.hud.gov/hud-partners/verification-of-eligible-status . [NYAG] = New York Attorney General release, https://ag.ny.gov/press-release/2026/attorney-general-james-sues-stop-trump-administration-pushing-thousands-us
1. [FR] Effective date: December 14, 2026. Published November 12, 2026 (about 30 days before).
2. [FR] The rule requires verification of U.S. citizenship or eligible immigration status of all applicants and recipients of assistance under a covered program regardless of age. It makes prorated assistance a temporary condition pending verification of eligible status of all family members, where permitted by statute; under current regulations prorated assistance could continue indefinitely.
3. [FR] Current rules let a family member either declare eligible status or elect not to contend eligible status, which led to prorated assistance. The final rule removes the "do not contend" option.
4. [FR] Covered programs listed in the preamble: Section 236 of the National Housing Act (tenants paying below-market rent only); HUD's Public Housing programs; the Section 8 rental assistance programs; and the Housing Development Grant programs (low-income units only). [HUD] lists Public Housing, Housing Choice Vouchers and Project-based Section 8 as covered and the 202/811 PRAC, 811 PRA, SPRAC and 202/162 PAC programs as not covered.
5. [FR] Tenants in mixed families (some members eligible, some not) who have not submitted evidence as of Dec 14, 2026 must submit it within 90 days of Dec 14, 2026 (about March 14, 2027, our date arithmetic). All other tenants who have not submitted evidence must do so at their next annual or interim reexamination after Dec 14, 2026.
6. [FR] Responsible entities (housing authorities or owners) must give each tenant who has not submitted evidence the Section 214 notification no later than 30 days after the effective date.
7. [FR] A responsible entity must extend the time to submit evidence if the person submits the required declaration and consent forms certifying eligible status and certifies the evidence is temporarily unavailable or more time is needed and diligent efforts will be made. An extension may not exceed 60 days in total, is decided in writing.
8. [FR] If the family fails to submit evidence within the time in the notice or any extension, consequences follow under the rule's paragraph (h) (not detailed here). Do not describe further penalties beyond what is stated in facts 2 and 5.
9. [NYAG] Suit filed Nov 23 2026 in the U.S. District Court for the District of Massachusetts, led by New York Attorney General Letitia James. Use the wording "New York and 20 other states plus the District of Columbia, joined by Pennsylvania's governor" (or "a coalition of 22 attorneys general"). Never write "22-state". Plaintiffs listed: AZ, CA, CO, CT, DE, HI, IL, ME, MD, MA, MI, MN, NJ, NM, OR, RI, VA, VT, WA, WI and DC besides New York. Claims: HUD exceeds its authority (a 1997 law allows prorating) and violates the Administrative Procedure Act. Relief sought: declaration, vacatur and injunction for plaintiff states.
10. [NYAG] HUD estimates cited by the AG: about 20,000 mixed-status families and 78,100 people could lose assistance; about 55,000 are fully eligible, mostly children. Attribute to HUD estimates as cited by the NY AG.
11. Status: no injunction or vacatur verified as of Nov 25 2026. A pending suit is not a block unless a court order exists; check for an order before acting. A separate suit by Los Angeles nonprofits in C.D. Cal. is reported only by secondary sources: do not state it.
12. What tenants should do: ask the housing authority or owner what applies; keep identity and status documents ready; ask about the extension; contact legal aid; do not move out on rumor. Do not say any specific person is eligible or ineligible. Not legal advice. Link /guides/how-much-should-i-spend-on-rent/ in What Tenants Should Do.
## EXCERPT OF [FR]
URL: https://www.govinfo.gov/content/pkg/FR-2026-11-12/pdf/2026-23003.pdf (FR 2026-23003, 91 FR 72978)
RETRIEVED_UTC: 2026-11-25T16:59:54Z
NOTE: pdftotext of the full 10-page-set rule; excerpt of relevant passages (summary, covered programs, dates, 90-day, 60-day extension)
72978

Federal Register / Vol. 91, No. 217 / Thursday, November 12, 2026 / Rules and Regulations
I. Background

DEPARTMENT OF HOUSING AND
URBAN DEVELOPMENT
24 CFR Part 5
[Docket No. FR–6524–F–02]
RIN 2501–AE16

Housing and Community Development
Act of 1980: Verification of Eligible
Status
AGENCY: Office of the Secretary, HUD.
ACTION: Final rule.
SUMMARY: This final rule revises HUD’s

Section 214 regulations to require the
verification of U.S. citizenship or the
eligible immigration status of all
applicants and recipients of assistance
under a covered program regardless of
age. The rule will also make prorated
assistance a temporary condition
pending verification of eligible status of
all family members, where permitted by
statute, as opposed to under HUD’s
current regulations where prorated
assistance could continue indefinitely.
These amendments bring HUD’s
regulations into greater alignment with
the wording and purpose of Section 214
and align with the current
Administration’s priorities and
regulatory reform efforts.
DATES: Effective date: December 14,
2026.

khammond on DSK9W7S144PROD with RULES2

FOR FURTHER INFORMATION CONTACT:

Multifamily Housing programs:
Jennifer Larson, Director, Office of
Multifamily Asset Management and
Portfolio Oversight, Office of
Multifamily Housing Programs,
Department of Housing and Urban
Development, 451 7th Street SW, Room
6162, Washington, DC 20410; telephone
number (202) 402–7769 (this is not a
toll-free number).
Public Housing and Voucher
programs: Todd Thomas, Acting Deputy
Assistant Secretary, Office of Public
Housing and Voucher Programs, Office
of Public and Indian Housing,
Department of Housing and Urban
Development, 451 7th Street SW, Room
4204, Washington, DC 20410; telephone
number (202) 731–1442 (this is not a
toll-free number).
HUD welcomes and is prepared to
receive calls from individuals who are
deaf or hard of hearing, as well as
individuals with speech or
communication disabilities. To learn
more about how to make an accessible
telephone call, please visit https://
www.fcc.gov/consumers/guides/
telecommunications-relay-service-trs.
SUPPLEMENTARY INFORMATION:

VerDate Sep<11>2014

17:19 Nov 10, 2026

Jkt 271001

As explained in greater detail in the
proposed rule (91 FR 8151), Section 214
of the Housing and Community
Development Act of 1980 (42 U.S.C.
1436a) (‘‘Section 214’’) prohibits HUD
from making certain financial assistance
available to persons other than United
States citizens or specified categories of
eligible noncitizens. The Section 214
requirements apply to financial
assistance provided under the following
HUD programs (collectively referred to
in this preamble as ‘‘Section 214
covered programs’’ or ‘‘covered
programs’’):
1. Section 236 of the National
Housing Act (12 U.S.C. 1715z–1)
(tenants paying below market rent only)
(the Section 236 program); and
2. The United States Housing Act of
1937 (42 U.S.C. 1437 et seq.) which
covers: HUD’s Public Housing programs,
the Section 8 rental assistance programs,
and the Housing Development Grant
programs (with respect to low-income
units only).1
HUD’s current regulations
implementing Section 214 require that
each family member applying for
assistance under a Section 214 covered
program either: (1) submit a declaration
declaring that he or she is a U.S. citizen,
as defined in 24 CFR 5.504(b) (which
specifies that citizen means a citizen or
national of the United States), or a
noncitizen with eligible immigration
status; 2 or (2) elect not to contend
eligible immigration status and,
therefore, not submit documentation for
verification.3 HUD’s regulations also
cover how a family with individuals
whose eligibility has not been
established or who are not eligible for
assistance may still receive assistance:
through prorated assistance, based on
the number of individuals in the family
for whom eligibility has been
affirmatively established,4 or in limited
circumstances, through a temporary
deferral of termination of assistance.5
II. The Proposed Rule
On February 20, 2026, HUD published
the ‘‘Housing and Community
Development Act of 1980: Verification
1 Section 214(b). Additional limitations on
noncitizen eligibility are also found in the Personal
Responsibility and Work Opportunity Act of 1996,
8 U.S.C. 1611(b)(1)(E).
2 24 CFR 5.508(c). Family members declaring
themselves eligible noncitizens must provide
----
E:\FR\FM\12NOR2.SGM

12NOR2

khammond on DSK9W7S144PROD with RULES2

73022

Federal Register / Vol. 91, No. 217 / Thursday, November 12, 2026 / Rules and Regulations

as soon as possible, HUD chooses not to
delay the effective date of this rule
further than necessary. Although the
rule becomes effective 30 days after
publication, the effective date does not
require all existing households to
complete the new verification process
on that date. The majority of households
will have a year or more to submit
evidence of U.S. citizenship.
Accordingly, HUD determined that
affected households and responsible
entities will have sufficient time to
comply with the new requirements,
without requiring further delay the
rule’s effective date.
Under the notice provisions,
responsible entities must give each
tenant who has not submitted evidence
of citizenship or eligible status the
required Section 214 notification no
later than 30 days after the effective date
of the final rule. Under § 5.508(f)(2)(i),
tenants in mixed families who have not
previously submitted the required
evidence must do so within 90 days of
the effective date, while other affected
tenants submit at their next annual or
interim reexamination of income and
household composition, in accordance
with program requirements. HUD
determined that an earlier submission
deadline is appropriate for mixed
families because changes made by this
rule may affect a mixed-status family’s
continued eligibility for assistance
before the family’s next scheduled
reexamination. Deferring submission of
the required evidence until the next
annual or interim reexamination could
therefore result in assistance continuing
beyond the point at which the family is
no longer eligible under the applicable
requirements. By contrast, for other
existing tenants, HUD has determined
that collection of the required evidence
may appropriately be incorporated into
the ordinary reexamination process,
thereby reducing administrative burden
on responsible entities and tenants. The
differing timeframes thus reflect the
different circumstances of these groups
while allowing implementation to be
staggered where appropriate.
HUD appreciates commenters’
concerns regarding the interaction
between the notice and documentation
requirements. HUD has considered
these concerns but declines to tie the
90-day compliance period to the date on
which each individual family receives
notice. Creating uniform periods
measured from the effective date
provides clear and administrable
implementation deadlines for both
responsible entities and mixed families.
HUD encourages responsible entities to
provide notice of Section 214
requirements as promptly as practicable

VerDate Sep<11>2014
----
accordance with paragraph (g) of this
section.
(1) Applicants. For applicants,
responsible entities must ensure that
evidence of U.S. citizenship or eligible
status required under § 5.508(b) is
submitted not later than the date the
responsible entity anticipates or has
knowledge that verification of other
aspects of eligibility for assistance will
occur (see § 5.512(a)).
(2) Tenants. (i) Tenants in mixed
families receiving financial assistance
under a Section 214 covered program
who have not submitted evidence of
citizenship or eligible immigration
status required under § 5.508(b) as of
December 14, 2026 are required to
submit such evidence within 90 days of
December 14, 2026, in accordance with
program requirements.
(ii) All other tenants receiving
financial assistance under a Section 214
covered program who have not
submitted evidence of U.S. citizenship
or eligible immigration status required
under § 5.508(b) as of December 14,
2026 are required to submit such
evidence at the next annual or interim
reexamination of income and household
composition after December 14, 2026, in
accordance with program requirements.
(3) New family members of assisted
units. For any new family member that
comes to reside in an assisted unit, the

PO 00000

Frm 00051

Fmt 4701

Sfmt 4700

73027

required evidence under § 5.508(b) must
be submitted not later than the date the
responsible entity performs verification
of other aspects of eligibility for
assistance (see § 5.512(a)).
(4) Changing participation in a HUD
program. Whenever a family applies for
admission to a Section 214 covered
program, evidence of U.S. citizenship or
eligible status is required to be
submitted in accordance with the
requirements of this subpart E unless
the family already has submitted the
evidence to the responsible entity for a
Section 214 covered program.
(5) One-time evidence requirement for
continuous occupancy and changes in
status during occupancy. For each
family member, the family is required to
submit evidence of U.S. citizenship or
eligible status required under paragraph
(b) of this section only one time in
accordance with paragraph (f) of this
section during continuously assisted
occupancy under any Section 214
covered program. If a family member’s
citizenship or eligible immigration
status changes during occupancy, the
family is required to immediately notify
and submit evidence of the new
citizenship or eligible immigration
status to the responsible entity.
(g) Extensions of time to submit
evidence of U.S. citizenship or eligible
status—(1) When extension must be
granted. The responsible entity must
extend the time, provided in paragraph
(f) of this section and § 5.512(d)(2)(i), to
submit evidence of U.S. citizenship or
eligible immigration status required
under § 5.508(b) if the family member:
(i) Submits the required declaration
and verification consent forms
described in paragraphs (c) and (d) of
this section certifying that any person
for whom required evidence has not
been submitted is a U.S. citizen or a
noncitizen with eligible immigration
status; and
(ii) Certifies that the evidence needed
to support a claim of U.S. citizenship or
eligible immigration status is
temporarily unavailable or additional
time is needed to obtain and submit the
evidence, and prompt and diligent
efforts will be undertaken to obtain the
evidence.
(2) Sixty-day extension period. Any
extension of time, if granted, may not
exceed 60 days and must not run
concurrently with any other timelines
for submitting evidence of U.S.
citizenship or eligible immigration
status as stated in subpart E. The
additional time provided should be
sufficient to allow any family member
the time to obtain the evidence needed.
The responsible entity’s determination
of the length of the extension needed

E:\FR\FM\12NOR2.SGM

12NOR2

73028

Federal Register / Vol. 91, No. 217 / Thursday, November 12, 2026 / Rules and Regulations

must be based on the circumstances of
the individual case. The total extension
of time granted by the responsible entity
to a family must be limited to 60 days.
(3) Grant or denial of extension to be
in writing. The responsible entity must
issue its decision to grant or deny an
extension to the family by written
notice. If the extension is granted, the
notice must specify the extension period
granted (which is limited to a total of 60
days). If the extension is denied, the
notice must explain the reasons for
denial of the extension.
(h) Failure to submit evidence of U.S.
citizenship or eligible immigration
status or to verify eligible immigration
status. If the family fails to submit
required evidence of U.S. citizenship or
eligible status within the time period
specified in the notice, or any extension
granted in accordance with paragraph
