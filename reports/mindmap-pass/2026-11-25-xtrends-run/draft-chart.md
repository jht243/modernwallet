---
mindmap_pass_date: 2026-11-25
source: "reports/x-trends/2026-11-25.md"
interpreted_brief: "Daily X trend scout for themodernwallet.com, 5 bullets. Reader intents: (1) a person holding or considering Anthropic (ANT) stock after it fell below its $83 IPO price; (2) a Medicaid adult worried about the Jan 1, 2027 work requirement and the CMS optional hold-harmless delay; (3) Medicare's third-cycle negotiated prices (unverifiable, dropped); (4) a home buyer asking how much they can borrow before a loan is jumbo under the 2027 FHFA limit; (5) a tenant in HUD-assisted housing asking how the mixed-status rule affects them. Input modality: pasted scout email bullets (untrusted data, every fact checked against primary sources)."
status: pending-chart-review
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lookup: /guides/how-to-buy-anthropic-stock exact slug (updated 2026-10-27) says 'You cannot buy Anthropic stock today' and 'no shares trade'; stale since Nasdaq listing 2026-11-19 (424B4 filed). Does not cover post-IPO price risk. Demand inferred - fresh news trend, no tool volume. | Targeted in-place edits to /guides/how-to-buy-anthropic-stock/: replace the not-yet-listed status in introText, cardBlurb, sections 1, 2, 5 and 6 and FAQs with the Nov 19 listing facts; add a 'After the IPO: price below $83, hold, sell or buy' section with a conditional takeaway and lockup dates; keep sourced S-1 financials and the pre-IPO scam section. Writer: content_gen.py section. | update existing body text | /guides/how-to-buy-anthropic-stock/ | article section update | text + comparison table | text + comparison table | unread (fresh trend, no SERP read this run) | SERP not read; fresh-trend rule, no provider/SERP calls made | Anthropic stock fell below its $83 IPO price: should I sell, hold or buy? [verb-only - no PAA, no completions] | Depends on who you are: IPO-price buyers are about flat or below, open buyers are down more than 25% at $83, the lockup calendar adds supply later, and no one can say where it goes; position size and time horizon decide, not the headline. | section 1: 'After the IPO: Below $83, Hold, Sell or Buy?' placed ahead of the S-1 material | A1 |
| lookup: /guides/what-is-an-ipo contains 'nothing trades yet' about Anthropic (src/data/guides.ts:12857), an inherited contradiction of A1. | One-sentence targeted correction in /guides/what-is-an-ipo/ section 'How IPOs actually work for retail investors': replace 'Anthropic has filed to go public but nothing trades yet' with the listing fact and link. | update existing body text | /guides/what-is-an-ipo/ | sentence correction | text | text | unread (fresh trend, no SERP read this run) | SERP not read; fresh-trend rule, no provider/SERP calls made | Has Anthropic's IPO happened? [verb-only - no PAA, no completions] | Yes: priced at $83 and opened on Nasdaq as ANT on Nov 19, 2026 (SEC 424B4). | section 'How IPOs actually work for retail investors', final paragraph | A2 |
| lookup: no match. Site has only /compare/aca-vs-medicaid/ and /compare/medicare-vs-medicaid/ (different intent). Demand inferred - fresh news trend, no tool volume. | Create /guides/medicaid-work-requirements-2027-hold-harmless/ [article + state-check table] | create new content | /guides/medicaid-work-requirements-2027-hold-harmless/ | article | text + comparison table | text + comparison table | unread (fresh trend, no SERP read this run) | SERP not read; fresh-trend rule, no provider/SERP calls made | Will I lose Medicaid on Jan 1 for missing the new work requirement? [verb-only - no PAA, no completions] | Not automatically: the federal requirement starts Jan 1, 2027, but in a state that elected CMS's optional hold-harmless period it cannot deny or disenroll for non-compliance through June 30, 2027; you still must report. In other states, noncompliance triggers a notice and 30 days to respond. | section 1: 'Will You Lose Medicaid on January 1?' | A3 |
| lookup: no match; no loan-limit page on site (closest: /mortgage/home-affordability-calculator/, /mortgage/down-payment-calculator/, /guides/types-of-mortgage-loans/ - different intent). Demand inferred - fresh news trend, no tool volume. | Create /guides/conforming-loan-limit-2027/ [article + calculated table] | create new content | /guides/conforming-loan-limit-2027/ | article | text + comparison table | text + comparison table | unread (fresh trend, no SERP read this run) | SERP not read; fresh-trend rule, no provider/SERP calls made | How much can I borrow in 2027 before it's a jumbo loan? [verb-only - no PAA, no completions] | $855,400 for a one-unit home in most counties (up $22,650), up to $1,283,100 in high-cost counties; in Alaska, Hawaii, Guam and the USVI the baseline is $1,283,100 and the ceiling $1,924,650. The limit caps the loan amount, not the price. | section 1: 'The 2027 Conforming Loan Limit' | A4 |
| lookup: no match; no HUD/rental-assistance page on site (closest: /guides/how-much-should-i-spend-on-rent/). Demand inferred - fresh news trend, no tool volume. | Create /guides/hud-mixed-status-housing-rule/ [article + timeline table] | create new content | /guides/hud-mixed-status-housing-rule/ | article | text + comparison table | text + comparison table | unread (fresh trend, no SERP read this run) | SERP not read; fresh-trend rule, no provider/SERP calls made | Which families lose prorated rent help under HUD's mixed-status rule, and what should tenants do? [verb-only - no PAA, no completions] | From Dec 14, 2026 every household member in covered programs must verify eligible status; mixed-status families keep prorated help only while verification is pending, with 90 days after the effective date to submit evidence; a 22-state suit is pending, so check for a court order before acting. | section 1: 'What Changes on December 14' | A5 |

## Original request and acceptance

Turn the day's verified X trends into accurate, primary-sourced pages for readers making a decision, enriching the existing Anthropic guide instead of a thin duplicate, dropping what cannot be verified.

- **id:** REQ-1
**description:** Bullet 1: enrich /guides/how-to-buy-anthropic-stock/ with post-IPO price risk, sell/hold/buy framing and lockups; remove the now-false 'cannot buy today' premise
**acceptance:** Rendered guide states the Nov 19 Nasdaq listing at $83, the Nov 24 close below $83 attributed to CNBC, lockup terms from the 424B4, a hold/sell/buy conditional takeaway, and no remaining 'nothing trades' claim on it or on /guides/what-is-an-ipo/
**actionIds:** - A1
- A2
- **id:** REQ-2
**description:** Bullet 2: page on whether a Medicaid adult loses coverage for missing the work requirement and where penalties are paused to June 30, 2027
**acceptance:** Page answers the Jan 1 question in section 1 with the hold-harmless condition, cites CMS IFR and SMDL smd26006, names only states verified from a primary source (Oregon), and tells readers how to check their own state
**actionIds:** - A3
- **id:** REQ-4
**description:** Bullet 4: 2027 conforming loan limit page: how much before jumbo, county limit, whether waiting until January helps
**acceptance:** Page states $855,400 / $1,283,100 / $1,924,650 with the FHFA release, a calculated purchase-price-by-down-payment table, county lookup route, and a supported conditional answer on waiting (no unverified delivery-date claim)
**actionIds:** - A4
- **id:** REQ-5
**description:** Bullet 5: HUD mixed-status rule: what changes Dec 14, who is affected, lawsuit status, what tenants should do
**acceptance:** Page states publication 2026-11-12, effective 2026-12-14, 90-day evidence window, proration only while verification pending, the multistate suit in D. Mass. as not yet a block unless a court order exists, and directs readers to their housing authority or legal aid
**actionIds:** - A5

### Presentation — A1

**medium:** text + comparison table
**placement:** section 1: 'After the IPO: Below $83, Hold, Sell or Buy?' placed ahead of the S-1 material
**reason:** A finite set of cases (holder type vs situation) is best as a table plus a short conditional takeaway; no reader inputs change the answer.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A fixed finite set of cases; a static table answers faster than inputs
**animation:** **decision:** not-useful
**reason:** Static scannable layout answers faster; no sequence to animate

### Presentation — A2

**medium:** text
**placement:** section 'How IPOs actually work for retail investors', final paragraph
**reason:** One sentence correction; no new format.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A fixed finite set of cases; a static table answers faster than inputs
**animation:** **decision:** not-useful
**reason:** Static scannable layout answers faster; no sequence to animate

### Presentation — A3

**medium:** text + comparison table
**placement:** section 1: 'Will You Lose Medicaid on January 1?'
**reason:** Reader needs a conditional answer by situation (state opted in or not, exempt or not); a finite table covers it.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A fixed finite set of cases; a static table answers faster than inputs
**animation:** **decision:** not-useful
**reason:** Static scannable layout answers faster; no sequence to animate

### Presentation — A4

**medium:** text + comparison table
**placement:** section 1: 'The 2027 Conforming Loan Limit'
**reason:** Finite down-payment cases show the jumbo line; a table of purchase prices by down payment answers it without inputs, and the existing down-payment calculator covers custom inputs.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A fixed finite set of cases; a static table answers faster than inputs
**animation:** **decision:** not-useful
**reason:** Static scannable layout answers faster; no sequence to animate

### Presentation — A5

**medium:** text + comparison table
**placement:** section 1: 'What Changes on December 14'
**reason:** Dated rule changes and who-is-affected cases are finite; a timeline table plus short sections suffice.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A fixed finite set of cases; a static table answers faster than inputs
**animation:** **decision:** not-useful
**reason:** Static scannable layout answers faster; no sequence to animate

## Emerging search patterns (clusters)

- Medicaid work-requirement implementation (hold-harmless states, exemptions): create new content /guides/medicaid-work-requirements-2027-hold-harmless/; demand inferred - fresh news, no tool volume
- Conforming loan limit 2027 (jumbo line, county limits): create new content /guides/conforming-loan-limit-2027/; demand inferred - fresh news, no tool volume
- HUD mixed-status rule (Dec 14, lawsuit): create new content /guides/hud-mixed-status-housing-rule/; demand inferred - fresh news, no tool volume
- Anthropic post-IPO (below $83, lockups): update existing body text /guides/how-to-buy-anthropic-stock/ and one sentence in /guides/what-is-an-ipo/

## Exclusions

- Bullet 3 (Medicare next 13 negotiated drug prices 2028) dropped and re-queued: the CMS page lists no 2028 drug names, prices or savings; the third cycle selected 15 drugs, not 13; '$9.2B (45%)' unsupported. No page until CMS data files are read.
- Maryland and New Hampshire Medicaid hold-harmless opt-ins not verified from a primary source: excluded from page; only Oregon (OHA 2026-11-23) named.
- Dollar close and percent loss for Nov 24 (Anthropic) not verified; page says 'closed below the $83 IPO price' (CNBC) only. '7.3% premarket' unverified (x.com HTTP 402).
- 2027 Fannie/Freddie delivery-date rule for the loan-limit page not verified; excluded.
- Earlier Nov 23 ERISA ESG deferral is not in this brief; untouched.
- Lens 3 (vs/alternatives/pricing): no comparable product entities in this brief; not forced.

## New-page briefs

### A3 — /guides/medicaid-work-requirements-2027-hold-harmless/

**Identity**

**title:** Medicaid Work Requirements 2027: Will You Lose Coverage?
**pageType:** guide (explainer, floor 1,200 words)
**format:** article
**medium:** text + comparison table

**Reader and answer**

**question:** Will I lose Medicaid on Jan 1 for missing the new work requirement? [verb-only - no PAA, no completions]
**answer:** Not automatically: the federal requirement starts Jan 1, 2027, but in a state that elected CMS's optional hold-harmless period it cannot deny or disenroll for non-compliance through June 30, 2027; you still must report. In other states, noncompliance triggers a notice and 30 days to respond.
**placement:** section 1: 'Will You Lose Medicaid on January 1?'

**Keyword evidence**

Primary: 'medicaid work requirements 2027'; supporting: 'medicaid work requirement hold harmless', 'which states delay medicaid work requirements'. Demand inferred - fresh news trend, no tool volume (no provider call this run; labeled not measured). Checked 2026-11-25.

**SERP and questions**

SERP not read. Questions come from the scout bullet only; WRITE may run the free autocomplete question sweep for FAQ wording and records limits honestly.

**Why a new page**

Coverage lookup (research/coverage-lookup.txt): no existing page; /compare/aca-vs-medicaid/ and /compare/medicare-vs-medicaid/ answer eligibility comparison, not penalties for missing the requirement. No commits name the topic (git log checked via lookup: 'Commits naming the topic: none').

**Planned outline**

- **heading:** Will You Lose Medicaid on January 1?
**purpose:** Direct conditional answer: federal start date, hold-harmless pause to June 30, 2027, you still report
- **heading:** Who the Rule Covers and Who Is Exempt
**purpose:** Adults 19-64 in the expansion group, 43 states + DC, 80 hours a month or $580 income, exemptions list from CMS fact sheet
- **heading:** What a Hold-Harmless State Can and Cannot Do
**purpose:** SMDL smd26006: may suspend denials and disenrollments, must still verify; Oregon as the verified example
- **heading:** State Check Table
**purpose:** Situation vs what happens (opted in, not opted in, exempt, applicant) with sources
- **heading:** What to Do Now
**purpose:** Report hours or exemption, watch notices, 30-day response window, contact state agency
- **heading:** FAQ
**purpose:** On-topic questions only

**Contribution and evidence**

Decision gap: readers cannot tell if Jan 1 means loss of coverage. Basis: reported. Sources inspected 2026-11-25: CMS IFR fact sheet; medicaid.gov community-engagement page (SMDL smd26006 posted 2026-11-13); Oregon OHA 2026-11-23; KFF 2026-11-14 (secondary). Counterexample tested: state not opted in. Unknown to state: KFF says notice due Dec 11; confirm from SMDL text before stating.

**Tables, tools or visuals**

Table: situation, what the state may do, what you do, source. No calculator: no input changes a federal answer; state agency decides.

**Testing and review**

Site _experience.md section G excludes medical, legal and financial services; ordinary (non-TESTED) presentation, no 'we tested', no testing schema. Review profile HIGH (consequential claims). No professionalReviewRequired. Evidence basis: reported from named primary sources.

**Planned takeaway**

For most Medicaid adults 19-64 the Jan 1 date matters only if your state did not opt in and you cannot show 80 hours, income of $580 a month, or an exemption; in an opted-in state coverage cannot be cut for non-compliance before July 1, 2027, but the clock and reporting duty still apply. This changes if CMS or a court changes the delay or your state withdraws.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /compare/aca-vs-medicaid/
**target:** /guides/medicaid-work-requirements-2027-hold-harmless/
**section:** Medicaid column / verdict
**anchor:** Medicaid work requirement rules for 2027
**purpose:** reader checking Medicaid eligibility learns of new condition
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997
- **source:** /budget/aca-subsidy-calculator/
**target:** /guides/medicaid-work-requirements-2027-hold-harmless/
**section:** Medicaid eligibility note
**anchor:** Medicaid work requirements starting 2027
**purpose:** readers near the Medicaid income line
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997

**Outbound internal links**

**placements:** - **source:** /guides/medicaid-work-requirements-2027-hold-harmless/
**target:** /compare/aca-vs-medicaid/
**section:** What to Do Now
**anchor:** ACA vs Medicaid comparison
**purpose:** readers who lose Medicaid need Marketplace coverage
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997
- **source:** /guides/medicaid-work-requirements-2027-hold-harmless/
**target:** /budget/aca-subsidy-calculator/
**section:** What to Do Now
**anchor:** ACA subsidy calculator
**purpose:** estimate Marketplace cost
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997

**Technical and measurement scope**

Existing guides template: canonical, Article schema, sitemap lastmod today for new route; reviewer note via mindmap-tracks.py register-reviewer-note; growth.json in reports/content-evidence.jsonl with baseline not-yet-published and age-matched comparator; no uplift claimed. IndexNow after live 200.

### A4 — /guides/conforming-loan-limit-2027/

**Identity**

**title:** 2027 Conforming Loan Limit: $855,400 and the Jumbo Line
**pageType:** guide (explainer + cost table, floor 1,200 words)
**format:** article
**medium:** text + comparison table

**Reader and answer**

**question:** How much can I borrow in 2027 before it's a jumbo loan? [verb-only - no PAA, no completions]
**answer:** $855,400 for a one-unit home in most counties (up $22,650), up to $1,283,100 in high-cost counties; in Alaska, Hawaii, Guam and the USVI the baseline is $1,283,100 and the ceiling $1,924,650. The limit caps the loan amount, not the price.
**placement:** section 1: 'The 2027 Conforming Loan Limit'

**Keyword evidence**

Primary: '2027 conforming loan limit'; supporting: 'conforming loan limit 2027', 'jumbo loan limit 2027'. Demand inferred - fresh news trend, no tool volume (not measured). Checked 2026-11-25.

**SERP and questions**

SERP not read. Expect FHFA, lenders, mortgage news; WRITE should differentiate with the calculated down-payment table.

**Why a new page**

Coverage lookup: no existing loan-limit page. Closest /mortgage/home-affordability-calculator/, /mortgage/down-payment-calculator/, /guides/types-of-mortgage-loans/ serve different reader goals (affordability, down payment, product types).

**Planned outline**

- **heading:** The 2027 Conforming Loan Limit
**purpose:** FHFA numbers: $855,400 baseline, +$22,650 (2.72%), $1,283,100 ceiling, AK/HI/Guam/USVI $1,283,100 baseline and $1,924,650 ceiling
- **heading:** Purchase Price Before a Loan Becomes Jumbo
**purpose:** Table by down payment (3, 5, 10, 15, 20 percent): price = limit / (1 - down), calculated
- **heading:** Find Your County Limit
**purpose:** FHFA county list/map; all but 24 counties are above baseline
- **heading:** Does Waiting Until January Help?
**purpose:** Conditional: FHFA ties lists to the year a loan is acquired; ask lender; do not assert delivery rule
- **heading:** What Changes If You Go Jumbo
**purpose:** Qualified only with lender sourced rules; no invented rate premium
- **heading:** FAQ
**purpose:** On-topic

**Contribution and evidence**

Basis: reported (FHFA release 2026-11-24, data page) + calculated (table). In our internal calculation, we divided the limit by one minus each down payment share to find the highest price a conforming loan can finance; input: $855,400; outputs 881,856 / 900,421 / 950,444 / 1,006,353 / 1,069,250 for 3/5/10/15/20 percent. Counterexample: in a high-cost county the same formula uses that county's limit; in a county over baseline the table is a floor. Unverified and excluded: 2027 Fannie/Freddie delivery-date rule.

**Tables, tools or visuals**

Table of purchase price by down payment, formula stated beside it; link to existing down-payment calculator for custom input. Execution packet: evidence.json with code/hash per _mindmap-execution.md section 2.

**Testing and review**

Site _experience.md section G excludes medical, legal and financial services; ordinary (non-TESTED) presentation, no 'we tested', no testing schema. Review profile HIGH (consequential claims). No professionalReviewRequired. Evidence basis: reported from named primary sources.

**Planned takeaway**

If your loan is under $855,400 (or your county's higher limit) it is conforming; above it, you need a jumbo loan or a bigger down payment, and each extra $1 of down payment lowers the amount borrowed dollar for dollar. Waiting for January only matters if the new limit would be above your loan and your lender confirms which year's limit applies to your loan; it changes if your county limit differs.

**Inbound internal links**

**required:** 3
**placements:** - **source:** /mortgage/home-affordability-calculator/
**target:** /guides/conforming-loan-limit-2027/
**section:** results / how it works
**anchor:** 2027 conforming loan limit
**purpose:** buyers near the loan limit
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997
- **source:** /mortgage/down-payment-calculator/
**target:** /guides/conforming-loan-limit-2027/
**section:** how it works
**anchor:** conforming loan limit for 2027
**purpose:** down payment affects whether loan is jumbo
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997
- **source:** /guides/types-of-mortgage-loans/
**target:** /guides/conforming-loan-limit-2027/
**section:** conforming and jumbo loans
**anchor:** 2027 conforming loan limit
**purpose:** jumbo definition reader
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997

**Outbound internal links**

**placements:** - **source:** /guides/conforming-loan-limit-2027/
**target:** /mortgage/down-payment-calculator/
**section:** Purchase Price Before a Loan Becomes Jumbo
**anchor:** down payment calculator
**purpose:** custom inputs
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997
- **source:** /guides/conforming-loan-limit-2027/
**target:** /guides/types-of-mortgage-loans/
**section:** What Changes If You Go Jumbo
**anchor:** types of mortgage loans
**purpose:** product background
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997

**Technical and measurement scope**

Existing guides template: canonical, Article schema, sitemap lastmod today for new route; reviewer note via mindmap-tracks.py register-reviewer-note; growth.json in reports/content-evidence.jsonl with baseline not-yet-published and age-matched comparator; no uplift claimed. IndexNow after live 200.

### A5 — /guides/hud-mixed-status-housing-rule/

**Identity**

**title:** HUD Mixed-Status Housing Rule: What Changes December 14
**pageType:** guide (explainer, floor 1,200 words)
**format:** article
**medium:** text + comparison table

**Reader and answer**

**question:** Which families lose prorated rent help under HUD's mixed-status rule, and what should tenants do? [verb-only - no PAA, no completions]
**answer:** From Dec 14, 2026 every household member in covered programs must verify eligible status; mixed-status families keep prorated help only while verification is pending, with 90 days after the effective date to submit evidence; a 22-state suit is pending, so check for a court order before acting.
**placement:** section 1: 'What Changes on December 14'

**Keyword evidence**

Primary: 'hud mixed status rule'; supporting: 'mixed status families section 8 rule', 'hud prorated assistance'. Demand inferred - fresh news trend, no tool volume (not measured). Checked 2026-11-25.

**SERP and questions**

SERP not read. WRITE may run autocomplete question sweep; legal-adjacent so page stays informational.

**Why a new page**

Coverage lookup: no existing page; /guides/how-much-should-i-spend-on-rent/ and /compare/renting-vs-buying/ do not cover assisted-housing rules.

**Planned outline**

- **heading:** What Changes on December 14
**purpose:** Rule published 2026-11-12 (FR 2026-23003), effective 2026-12-14, every member must verify status, proration only while pending
- **heading:** Who Is Affected and Which Programs
**purpose:** Public Housing, HCV, project-based Section 8 covered; 202/811 PRAC, 811 PRA, SPRAC, 202/162 PAC not covered; HUD estimates cited by NY AG: about 20,000 families, 78,100 people
- **heading:** Timeline Table
**purpose:** Publication, effective date, 90-day mixed-status evidence window (about March 14, 2027), non-mixed at next recertification
- **heading:** The Lawsuit
**purpose:** Multistate suit in D. Mass. (NY AG release, 2026-11-23), claims and relief sought; no injunction verified; pending is not a block
- **heading:** What Tenants Should Do
**purpose:** Talk to housing authority, keep documents, legal aid, do not leave on rumor
- **heading:** FAQ
**purpose:** On-topic

**Contribution and evidence**

Basis: reported. Sources inspected 2026-11-25: HUD verification page; NY AG release; Federal Register citation from HUD. Counterexample: a court injunction would change enforcement for plaintiff states. WRITE must open the Federal Register text and recount the states.

**Tables, tools or visuals**

Timeline table and who-is-covered table.

**Testing and review**

Site _experience.md section G excludes medical, legal and financial services; ordinary (non-TESTED) presentation, no 'we tested', no testing schema. Review profile HIGH (consequential claims). No professionalReviewRequired. Evidence basis: reported from named primary sources. Legal-adjacent: not legal advice; direct to housing authority and legal aid; no liabilityBlock identified.

**Planned takeaway**

If your household is in public housing, vouchers or project-based Section 8, gather proof of eligible status for every member before the 90-day window (about March 14, 2027) and ask your housing authority what applies to you; this changes if a court blocks the rule or HUD revises it.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /guides/how-much-should-i-spend-on-rent/
**target:** /guides/hud-mixed-status-housing-rule/
**section:** rent affordability / assistance mention
**anchor:** HUD mixed-status housing rule
**purpose:** renters on assisted housing
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997
- **source:** /compare/renting-vs-buying/
**target:** /guides/hud-mixed-status-housing-rule/
**section:** renting side
**anchor:** housing assistance rule changes
**purpose:** renters reading costs
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997

**Outbound internal links**

**placements:** - **source:** /guides/hud-mixed-status-housing-rule/
**target:** /guides/how-much-should-i-spend-on-rent/
**section:** What Tenants Should Do
**anchor:** how much to spend on rent
**purpose:** budget planning if assistance changes
**inspection:** **path:** reports/mindmap-pass/2026-11-25-xtrends-run/research/link-inspections.txt
**sha256:** 6620c0c56c890c1995a25effc497afe962a19318e3ae8dc63e44dbc22b591997

**Technical and measurement scope**

Existing guides template: canonical, Article schema, sitemap lastmod today for new route; reviewer note via mindmap-tracks.py register-reviewer-note; growth.json in reports/content-evidence.jsonl with baseline not-yet-published and age-matched comparator; no uplift claimed. IndexNow after live 200.

## Execution plan

1. Record advisory cannibalization check (no destructive merges).
2. Apply any approved metadata updates (or N/A when none in chart).
3. Generate net-new approved routes with verified evidence packets.
4. Run independent Phase 4 rendered-page audit on all changed routes.
5. Apply any approved existing-page body enrichments (or N/A when none).
6. Add approved inbound and outbound internal links across inspected routes.
7. Update sitemaps and prepare IndexNow URL list without pre-deploy ping.
8. Compile Phase 8 execution and cluster summary.
9. Commit, deploy to main, verify HTTP 200 live renders, and submit IndexNow.

Publication scope: commit: True, push: True, liveVerification: True, indexNow: True

## Preparation check

| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-25-xtrends-run/readiness.md) |

Approve this plan to start the listed content work?
