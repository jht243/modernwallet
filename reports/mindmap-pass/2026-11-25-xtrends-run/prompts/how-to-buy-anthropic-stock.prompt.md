# Approved Page Assignment: `/guides/how-to-buy-anthropic-stock/` (`how-to-buy-anthropic-stock`)
- **Action ID:** `A1` (update existing body text)
- **Active Mindmap Track:** `guide`
- **Title:** Targeted in-place edits to /guides/how-to-buy-anthropic-stock/: replace the not-yet-listed status in introText, cardBlurb, sections 1, 2, 5 and 6 and FAQs with the Nov 19 listing facts; add a 'After the IPO: price below $83, hold, sell or buy' section with a conditional takeaway and lockup dates; keep sourced S-1 financials and the pre-IPO scam section. Writer: content_gen.py section.
- **Page Type / Format / Medium:** guide | article section update | text + comparison table
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** Anthropic stock fell below its $83 IPO price: should I sell, hold or buy? [verb-only - no PAA, no completions]
- **Working Answer (Col 11):** Depends on who you are: IPO-price buyers are about flat or below, open buyers are down more than 25% at $83, the lockup calendar adds supply later, and no one can say where it goes; position size and time horizon decide, not the headline.
- **Answer Placement (Col 12):** section 1: 'After the IPO: Below $83, Hold, Sell or Buy?' placed ahead of the S-1 material

## Demand & Differentiation Context
- **Problem / Gap:** lookup: /guides/how-to-buy-anthropic-stock exact slug (updated 2026-10-27) says 'You cannot buy Anthropic stock today' and 'no shares trade'; stale since Nasdaq listing 2026-11-19 (424B4 filed). Does not cover post-IPO price risk. Demand inferred - fresh news trend, no tool volume.
- **Keyword Evidence:** "SERP not read; fresh-trend rule, no provider/SERP calls made"
- **Why New Page / Angle:** Targeted in-place edits to /guides/how-to-buy-anthropic-stock/: replace the not-yet-listed status in introText, cardBlurb, sections 1, 2, 5 and 6 and FAQs with the Nov 19 listing facts; add a 'After the IPO: price below $83, hold, sell or buy' section with a conditional takeaway and lockup dates; keep sourced S-1 financials and the pre-IPO scam section. Writer: content_gen.py section.
- **Intent-Based Our Takeaway:** ""

## Eligible Internal & Testing Evidence Pool for Page Type `how-to-or-workflow-guide` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

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
  "route": "/guides/how-to-buy-anthropic-stock/",
  "readerQuestion": "Anthropic stock fell below its $83 IPO price: should I sell, hold or buy? [verb-only - no PAA, no completions]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/approval-manifest.json",
      "sha256": "6c14985eb561e414f7f73570656803a94abbd5fbb57e23f4fa3d9e3a43d6d61a"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/chart-review.json",
      "sha256": "8acdedee1ab772bbcdfa994f0f77a57141ea9ebf6b4acdc3cbb1a17a9e3f59fe"
    },
    "actionId": "A1"
  },
  "presentation": {
    "medium": "text + comparison table",
    "placement": "section 1: 'After the IPO: Below $83, Hold, Sell or Buy?' placed ahead of the S-1 material",
    "reason": "A finite set of cases (holder type vs situation) is best as a table plus a short conditional takeaway; no reader inputs change the answer.",
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
  "decisionGap": "Readers searching after the Nov 19 listing cannot tell from the existing guide (written pre-IPO, says nothing trades) what the price below $83 means for holding, selling or buying, or when locked-up shares arrive.",
  "finding": "Anthropic priced at $83, opened at $111.50 on Nasdaq on Nov 19 2026 and, per CNBC, closed down 6.5% on Nov 24 and below the $83 IPO price (exact close not published on the page). Holders who bought at the open are down more than 25% at any price at or below $83 (calculated: 83/111.50 - 1 = -25.6%). The S-1 described 180-day and 365-day lock-ups; the final prospectus controls.",
  "conditions": "Price statements are dated and stale by the next trading session. Lock-up terms are attributed to the S-1; the 424B4 body (about 94 MB) was not read in this run, so no unlock calendar is given. No sell, hold or buy instruction; conditional framing by holder type and horizon; not personalized advice.",
  "whatWouldChange": "A different close, a lock-up release or early release disclosed in the 424B4 or an 8-K, an analyst target change, or the reader's own cost basis and time horizon.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-xtrends-run/evidence/how-to-buy-anthropic-stock/cases.json",
    "sha256": "e0f08292a875d4c46582f4249aa441708b96ced879c6b56b1a9d4bdbc6b7a502"
  },
  "caseDecisions": "Retrieved cases.json for this question: no approved client record on this site matches (site _experience.md lists no named-client specifics). No client claim used; none forced.",
  "sourceArtifacts": [
    {
      "path": "reports/x-trends/2026-11-25.md",
      "sha256": "3d4b8fc88a4a099cc9d035695505b4a8726d0ff16b737e24bcdafee3aea577b7"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/coverage-lookup.txt",
      "sha256": "4eb2f2b166b5ac49eca0861e02f0ad059bc46cfc0106727c76f562c81403a162"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/fhfa-2027-cll.txt",
      "sha256": "81ed1a140bd72760c38d3a231d10f9ca3194e804cf6e248c6e98396e3d30d165"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/cnbc-anthropic-below-ipo.txt",
      "sha256": "d7751825940ffd0f376a9c563317381dcc20c38fabe27ad8e80b77f723820a85"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/sec-anthropic-424b4.txt",
      "sha256": "9fc116aa01ccaac28086492b664f3158036b98ce7bb6975a06af0fe366dec6ca"
    },
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
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/hud-mixed-status-rule.txt",
      "sha256": "0ce53843d402c1ba27d963098c8fd0d86130e60d25ffc104c17d6a9f7ca283b9"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/ny-ag-hud-lawsuit.txt",
      "sha256": "0e1c84e7af5ea0f9440f86b0bfc6f2c4700978a9ff732a8eae81620afced3083"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/sources/cms-selected-drugs.txt",
      "sha256": "bf6e913e3d9baf03ce58fd0752b726d8d68d05fad6cc9736a49010ab4d681118"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt",
      "sha256": "6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997"
    }
  ],
  "whyNoQuantitativeAnalysis": "The central answer is conditional guidance from reported prices and one arithmetic identity (83/111.50 - 1); no model of future prices is defensible.",
  "reasoning": "CNBC (2026-11-24) gives IPO price $83, open $111.50, a 6.5% fall on Nov 24 and a close below $83. SEC EDGAR shows the 424B4 filed 2026-11-19. S-1 text already on the page gives the 180/365-day lock-ups. From these, buyers at the open are underwater by more than 25% at or below $83, IPO-price buyers are about flat or below, and later share supply (lock-up expiry) is a known risk, so position size and time horizon decide, not the headline.",
  "provenance": {
    "basis": "reported",
    "supportingRecordIds": [
      "cnbc-anthropic-below-ipo.txt",
      "sec-anthropic-424b4.txt"
    ],
    "scopeAndLimits": "CNBC-reported prices; one calculated ratio labeled as arithmetic; lock-ups per S-1 only",
    "publicMethod": "On-page attribution to CNBC and the SEC filings; the arithmetic is shown inline",
    "placement": "section 1 table and takeaway"
  },
  "sourceLimits": "424B4 lock-up section not read (94 MB document; EDGAR index only). x.com 7.3% premarket claim unverified and excluded. Nov 24 dollar close and Nov 19 $97.17 close not verified and excluded.",
  "proposedMetadata": {
    "title": "Anthropic Stock Below $83 IPO Price: Hold, Sell or Buy?",
    "metaDescription": "Anthropic (ANT) closed below its $83 IPO price on Nov 24, 2026, per CNBC. See what that means by holder type, plus S-1 lock-up terms and how to buy.",
    "note": "Recorded for the metadata lane only; not applied in this run (CR1-META-NOTE)."
  }
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
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


# CLOSED FACT LIST (AUTHORITATIVE; supersedes anything above, including the scout brief, KFF/secondary notes and the x-trends bullets)
Anything not on this list, you do not know. Never invent a price, limit, date, count, name, quote or URL. If a needed fact is not here, leave it out or say it is not published and link the primary source.
Style reminders: register operator; no em-dashes; no "tested" or "we tested" claims, no testing badge; no first-person experience beyond what the packet's provenance licenses; keep the "At The Modern Wallet, we" first company claim rule; an intent-based "Our Takeaway" section near the end; FAQ questions in sentence case; a final concrete next-action sentence; disclaimer content goes in the last section only if needed ("general information, not legal/financial/medical advice").
LEAK WARNINGS (facts that appear in the scout brief above but are NOT verified and must NOT appear): "22-state" lawsuit wording; Maryland or New Hampshire as Medicaid hold-harmless states; "7.3% premarket"; "Nov 19 close $97.17"; any Nov 24 dollar close; any Fannie Mae or Freddie Mac "delivery date" rule for the 2027 limit; "$9.2B", "13 drugs"; and any sell/hold/buy instruction.

## FACTS (A1: targeted enrichment only; the page's CURRENT text is supplied separately)
Source key: [CNBC] = https://www.cnbc.com/2026/11/24/anthropic-stock-ipo-price.html ; [424B4] = SEC EDGAR index https://www.sec.gov/Archives/edgar/data/2130357/000162828026074944/0001628280-26-074944-index.htm ; [S-1] = existing page's S-1 facts.
1. [424B4] Anthropic, PBC filed Form 424B4 (final prospectus) on 2026-11-19, accession 0001628280-26-074944. Only the filing index was read; the 94 MB prospectus body was NOT read.
2. [CNBC] IPO price $83. Shares opened at $111.50 on the Nasdaq on Thursday Nov 19 2026. Shares "closed down 6.5% on Tuesday" (Nov 24), "sending the stock below the artificial intelligence company's $83 IPO price". CNBC does not give an exact close. Say "closed below the $83 IPO price on Nov 24, according to CNBC". Print no dollar close and no percentage drop other than CNBC's 6.5%.
3. [CNBC] Anthropic raised $81.3 billion "in the largest offering of all time"; oversubscribed; about half of institutional investors that ordered received no shares.
4. [CNBC] Analyst views: Canaccord Genuity buy rating and $135 price target; Wedbush outperform and $120; Oppenheimer $150 price target. Attribute these to CNBC; they are analysts' targets, not our view.
5. Arithmetic (label as arithmetic, "in our internal calculation"): 83 / 111.50 - 1 = -25.6%, so anyone who bought at the $111.50 open is down more than 25% at any price at or below $83. A buyer at the $83 IPO price is flat at $83 and below water under it.
6. [S-1] The Form S-1 described a 180-day lock-up for company insiders and certain stockholders and a 365-day lock-up for specified holders; underwriting representatives may release lock-up securities in whole or part. The final prospectus controls: read its lock-up section ("Shares Eligible for Future Sale"). State NO expiry dates and no unlock calendar. Lock-ups are not mentioned on the CNBC page. SEC lock-up guide: https://www.sec.gov/fast-answers/answerslockuphtm.html . After lock-ups expire or are released, blocks of previously restricted shares can reach the market (existing page text).
7. Prices move daily: date-stamp every price statement ("as of Nov 24, 2026") and never write "is trading at".
8. Anthropic is listed on Nasdaq under ticker ANT (the page's existing text says so; the 424B4 index confirms the final prospectus was filed Nov 19).
9. Takeaway guidance: no sell, hold or buy instruction. Conditional framing by holder type and horizon (IPO-price holders; open-price buyers; people considering buying; short vs long horizon), concentrated-position limits, link /guides/concentrated-stock-position-risk/ and /guides/how-to-start-investing/. "General information, not personalized investment advice."
10. How to buy now: through any brokerage account with a market or limit order for ANT; retail IPO allocation is over. Do not state brokerage names or fees.
