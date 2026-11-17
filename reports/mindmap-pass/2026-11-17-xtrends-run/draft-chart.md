---
mindmap_pass_date: 2026-11-17
source: "reports/x-trends/2026-11-17.md"
interpreted_brief: "Daily Fleet trend scout (Grok Bot) section for themodernwallet.com, three bullets treated as untrusted topic data and re-verified against primary sources: (1) how to get Chase late, overdraft and NSF fees reversed after the Nov 16 2026 outage, (2) what the Nov 17 2026 Treasury/IRS final regulations on mandatory 401(k)/403(b) automatic enrollment (IRC 414A, SECURE 2.0) mean for workers, (3) how to read a Minnesota Truth-in-Taxation notice of proposed 2027 property taxes and use the hearing before final levies are set by Dec 28. Input modality: text (X-trend email section). Dedup found no existing home for any bullet, so each becomes a net-new guide with inbound links from related existing pages."
status: pending-chart-review
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lens 1 direct intent plus news-driven (Chase outage Nov 16 2026; NBC News and Fortune). lookup: no match. Autocomplete bands (estimate, NOT measured): chase late fee refund 500-5000/mo, chase overdraft fee refund 500-5000/mo, chase outage 500-5000/mo, chase outage fee reversal 0-50/mo. The site has no outage or bank-fee-refund page. | Create /guides/chase-outage-fee-reversal targeting 'chase outage fee reversal' / 'chase overdraft fee refund' [article with request script and documentation checklist] | create new content | /guides/chase-outage-fee-reversal | article - the reader wants a method (ask, document, escalate), not a comparison | text | text | unread | SERP not read: serp.py returned 'DataForSEO unavailable' (0 calls); weakness label, not a drop signal. No PAA available. | How do I get Chase to reverse late, overdraft or NSF fees caused by the Nov 16 outage? [PAA 0/0 unread; ac 0/47 on-intent question completions, outage-status completions only] | Ask Chase directly, by phone or secure message, to reverse each fee and cite the date, then document every call and escalate to a CFPB complaint if unresolved; mechanism: identify fees, gather proof, make the request, follow up, escalate. | Section 1: 'How to Ask Chase to Reverse Outage Fees' | A1 |
| Lens 1 direct intent plus news-driven (Treasury/IRS final regulations, Nov 17 2026, press release SB-0690). lookup: no match; existing mentions are one-sentence FAQ lines in roundups/comparisons; /guides/retirement-contribution-limits-2027 serves a limits reader (checked, enrich-vs-new decided new). Autocomplete bands (estimate, NOT measured): 401k automatic enrollment 500-5000/mo, secure 2.0 automatic enrollment 500-5000/mo, 401k auto enrollment rules 150-1500/mo. | Create /guides/401k-auto-enrollment-final-rules targeting '401k automatic enrollment rules' / 'secure 2.0 automatic enrollment' [article with rate-schedule table] | create new content | /guides/401k-auto-enrollment-final-rules | article - the reader wants the rule's mechanics and their options; a finite schedule table fits | text | text | unread | SERP not read: DataForSEO unavailable. Autocomplete question sweep: 'is 401k auto enrollment required', 'can an employer automatically enroll you in a 401k', 'is 401k auto enrollment mandatory', 'can 401k auto enrollment be changed', 'how 401k auto enrollment works'. | What do the final 401(k) auto-enrollment rules mean for my paycheck, and can I opt out? [PAA 0/0 unread; ac 12/66 question completions, required/mandatory/can-change/opt-out family] | Covered new 401(k) and 403(b) plans must enroll eligible employees at 3% or more, rising at least 1 point a year to at least 10% (max 15%); you can opt out or choose another rate; pre-2022-enactment plans, small and new businesses, governmental, church and SIMPLE plans are exempt. Shape: the rule with its boundaries. | Section 1: 'What the Final Auto-Enrollment Rules Require' | A2 |
| Lens 1 direct intent plus seasonal news (Minnesota DOR press release 2026-11-12; notices mailed Nov 11-24). lookup: no match (no property-tax-notice page anywhere on the site). Autocomplete bands (estimate, NOT measured): truth in taxation notice 20-200/mo; minnesota truth in taxation and minnesota property tax increase 2027 are low-signal bands. Fresh-trend rule applies. | Create /guides/minnesota-truth-in-taxation-notice targeting 'minnesota truth in taxation notice' [article with notice-reading table] | create new content | /guides/minnesota-truth-in-taxation-notice | article - the reader wants to interpret a notice and know what to do before the hearing | text | text | unread | SERP not read: DataForSEO unavailable. Autocomplete question sweep: 'is truth in taxation notice minnesota legitimate', 'how truth in taxation notice minnesota works', 'is truth in taxation notice minnesota required'. | Why did my Minnesota proposed 2027 property tax go up, how do I read the Truth-in-Taxation notice and what can I do before final levies are set? [PAA 0/0 unread; ac 10/47 question completions, what/how/is-it-legit family] | The notice is a proposal built from preliminary local levies (statewide up to $949 million, 6.5% higher); read the current-versus-proposed columns per taxing authority, attend a local hearing, and remember final levies, due Dec 28 2026, can be lower but not higher. Shape: how-to-read plus next step. | Section 1: 'What Your Truth-in-Taxation Notice Is and What You Can Do' | A3 |

## Original request and acceptance

Publish three timely, source-verified money guides that answer the specific reader questions behind this week's X trends, without repeating or contradicting existing site pages and without unverified claims.

- **id:** REQ-1
**description:** Chase Nov 16 outage fee reversal guide covering scripts, what to document and when to escalate to the CFPB (bullet 1).
**acceptance:** A published guide opens with the method for requesting reversal of late, overdraft and NSF fees, includes a short request script, a documentation list and the CFPB complaint route, and states only outage facts attributed to NBC News/Fortune/Chase.
**actionIds:** - A1
- **id:** REQ-2
**description:** Final 401(k)/403(b) auto-enrollment rules guide covering default rate, escalation, applicability date, exemptions and how to opt out or change the rate (bullet 2).
**acceptance:** A published guide states the 3% default, 1 point annual increase to at least 10% (max 15%), the plan-year-after-Dec-31-2027 applicability for the final regulations, the statutory exemptions and the right to opt out or choose another rate, attributed to Treasury SB-0690 and IRC 414A.
**actionIds:** - A2
- **id:** REQ-3
**description:** Minnesota Truth-in-Taxation notice guide covering why the proposed 2027 levy rose, how to read the notice and how to use the hearing before final levies (bullet 3).
**acceptance:** A published guide states the 6.5% / $949 million preliminary statewide figure, the notice mailing window, that final levies can be lower but not higher than preliminary levies and are due Dec 28 2026, and explains notice columns per Minn. Stat. 275.065, attributed to the Minnesota Department of Revenue.
**actionIds:** - A3

### Presentation — A1

**medium:** text
**placement:** Section 1 opening answer, then a short request script block and a documentation checklist
**reason:** The reader needs steps and wording, a finite list, not variable-input math
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** The fee amounts are fixed policy figures (Chase's $34 overdraft fee, max 3 per business day) so a table beats a calculator
**animation:** **decision:** not-useful
**reason:** Static scannable layout answers faster without decorative motion

### Presentation — A2

**medium:** text + finite table
**placement:** Section 1 opening answer, then a year-by-year default-rate table
**reason:** The default schedule is a finite 3% to 10% ladder, so a table shows it without interaction
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** Rate steps are fixed by rule; the only reader variable is salary and one worked example covers it
**animation:** **decision:** not-useful
**reason:** Static scannable layout answers faster without decorative motion

### Presentation — A3

**medium:** text + finite table
**placement:** Section 1 opening answer, then a table of what each notice column shows
**reason:** Notice columns and dates are finite and parcel-specific numbers come from the reader's own notice
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** The reader's own notice carries the parcel numbers; no site-side input changes the answer
**animation:** **decision:** not-useful
**reason:** Static scannable layout answers faster without decorative motion

## Emerging search patterns (clusters)

- Bank outage fee reversal: chase late fee refund; chase overdraft fee refund; chase outage fee reversal (news-driven, estimate bands, NOT measured) -> create new content /guides/chase-outage-fee-reversal (article)
- SECURE 2.0 auto-enrollment: 401k automatic enrollment; secure 2.0 automatic enrollment; 401k auto enrollment rules (news-driven final regulations) -> create new content /guides/401k-auto-enrollment-final-rules (article)
- Minnesota property tax notices: truth in taxation notice; minnesota truth in taxation; proposed property tax notice (seasonal notices Nov 11-24) -> create new content /guides/minnesota-truth-in-taxation-notice (article)

## Exclusions

- Lens 3 comparison/alternatives/pricing: no comparable vendor entity in these bullets (Chase is the subject of a consumer-rights guide, not a roundup row): none forced.
- TD 10061 label: unverified, excluded; page cites Treasury SB-0690 and IRC 414A.
- Chase 6:30 pm restoration time and 'no blanket fee waiver as of Nov 17': unverified, excluded as facts (see readiness.md).
- X post volume counts (3,322 / 1,457 / 197): not retrievable, demand context only, never published.
- Minnesota hearing start times and valuation-appeal path: unverified, excluded.
- Existing page /guides/retirement-contribution-limits-2027: not enriched beyond one inbound link (different reader intent).
- Model-launch overlay and Lens 2b formula expansion: not applicable (no AI model launch; no transferable modifier wrapper in brief).

## New-page briefs

### A1 — /guides/chase-outage-fee-reversal

**Identity**

**title:** How to Get Chase Outage Fees Reversed (Nov 2026)
**pageType:** guide (how-to, cost-pricing floor 1,000 words)
**format:** article - the reader wants a method (ask, document, escalate), not a comparison
**medium:** text
**plannedMetadata:** **title:** How to Get Chase Outage Fees Reversed (Nov 2026)

**Reader and answer**

**question:** How do I get Chase to reverse late, overdraft or NSF fees caused by the Nov 16 outage? [PAA 0/0 unread; ac 0/47 on-intent question completions, outage-status completions only]
**answer:** Ask Chase directly, by phone or secure message, to reverse each fee and cite the date, then document every call and escalate to a CFPB complaint if unresolved; mechanism: identify fees, gather proof, make the request, follow up, escalate.
**placement:** Section 1: 'How to Ask Chase to Reverse Outage Fees'
**audience:** US consumers with the stated problem; adults making one concrete money decision
**intent:** informational / how-to

**Keyword evidence**

Provider ladder pinned semrush,dataforseo; SEMRUSH has no key and DataForSEO unavailable on 2026-11-17, so every figure is 'source: estimate (Google Autocomplete), NOT measured', US, checked 2026-11-17 (research/keyword-volumes.json). Primary: 'chase outage fee reversal' (0-50/mo band, 0 completions: brand-new phrase). Supporting: 'chase late fee refund' (500-5000, 9 completions), 'chase overdraft fee refund' (500-5000, 10 completions), 'chase outage' (500-5000, 10 completions). Fresh-trend rule: low or unmeasured volume does not veto.

**SERP and questions**

SERP unread (DataForSEO unavailable): weakness label. Autocomplete question sweep for 'chase outage' returned status questions (is chase down, is chase outage fixed), not fee questions: the fee-reversal angle is the under-served intent. Real PAA unavailable, so FAQ questions come from the sweep plus the reader question and are labeled as such.

**Why a new page**

Closest existing: none found by coverage_lookup (0 repo pages, 0 sitemap routes, 0 redirects); no commits name the topic. /guides/how-much-emergency-fund/ serves a savings-sizing reader, not a fee-reversal one. Independent duplicate review: required of CHART-REVIEW.

**Planned outline**

- **heading:** How to Ask Chase to Reverse Outage Fees
**purpose:** Section 1 answer: the 5-step method (list each fee, gather proof, ask by phone or secure message, note names and reference numbers, follow up in writing) and that reversal is a request to Chase, with no blanket waiver verified in the sources checked
- **heading:** What Chase Said Happened on November 16
**purpose:** Attributed facts only: software bug in on-premise hardware, not cyber-related, transactions posting normally Monday evening (NBC News), 94 million customer relationships; Fortune on Downdetector counts and Plaid/Zelle effects
- **heading:** Which Fees to Look For
**purpose:** Table: late fee, overdraft ($34 per transaction, max 3 per business day, none if $5 or less, none if overdrawn by $50 or less at end of day, Chase Overdraft Assist deposit-by 11 pm ET next business day rule), NSF note limited to what Chase's page states
- **heading:** What to Document and a Request Script
**purpose:** Checklist of dates, amounts, screenshots, statement lines; a short plain-language script; no guaranteed outcome
- **heading:** Delayed Zelle Payments and Electronic Transfer Errors
**purpose:** Reg E 12 CFR 1005.11: notice of error within 60 days of the statement; Zelle statement that delays originate at financial institutions (NBC); limits stated
- **heading:** When to Escalate to the CFPB
**purpose:** CFPB complaint form: company response, include dates/amounts, attach up to 50 pages, generally one complaint per problem; contact the company first
- **heading:** Our Takeaway
**purpose:** Planned takeaway below
- **heading:** Frequently Asked Questions
**purpose:** Sentence-case FAQs from the sweep: is the Chase outage fixed, does Chase refund fees after an outage, how long to dispute a fee

**Contribution and evidence**

Decision gap: readers hold fees after a bank-wide outage and do not know whether, how and where to ask. Basis: reported (external sources named inline). Sources checked 2026-11-17, saved verbatim: NBC News (rcna609673), Fortune 2026-11-16, Chase Overdraft Services page, 12 CFR 1005.11, CFPB complaint page. Fortune notes Chase refunded late fees after its 2010 outage if customers called to ask: precedent, not a promise for 2026. Unverified brief items excluded (6:30 pm restoration, no-blanket-waiver, X post counts). Counterexample test: a fee not caused by the outage (e.g., a real overdraft from your own spending) will not be reversed on outage grounds; say so.

**Tables, tools or visuals**

One finite table of fee types (what Chase's own page says) and a request script block. No calculator: fee amounts are fixed policy, a table answers it.

**Testing and review**

Section G of _experience.md excludes legal and financial services: TESTED format OFF, ordinary presentation, no we-tested wording, no howWeTested field, no testing schema or byline. HIGH claim-risk floor (consequential financial claims), two content audits max, release at first genuine PASS; no professionalReviewRequired flag; disclaimer at page bottom only. Existing editorial site byline/publisher identity is reused; no invented reviewer or credentials.

**Planned takeaway**

For you if an outage-period fee hit your Chase account: ask for reversal of each fee, with dates and proof, in the first contact; keep a log; if Chase declines or does not answer, file a CFPB complaint. Condition: reversal is Chase's discretion unless the problem is an electronic fund transfer error under Reg E. What changes it: if Chase announces a blanket waiver or automatic refunds, follow its instructions instead. Attributed as reported evidence, not our testing.

**Inbound internal links**

**required:** 1
**placements:** - **source:** /guides/how-much-emergency-fund/
**target:** /guides/chase-outage-fee-reversal/
**section:** Where to keep your emergency fund
**anchor:** what to do about bank fees after an outage
**purpose:** Readers choosing where to hold cash learn what to do if their bank has an outage and fees post
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/emergency-fund.txt
**sha256:** 6551f9cf8279f98dd1cdd0f7bce8c9b0c722127f9797f8396ca0d9eb6cdcb0c0

**Outbound internal links**

**placements:** - **source:** /guides/chase-outage-fee-reversal/
**target:** /guides/how-much-emergency-fund/
**section:** Our Takeaway
**anchor:** how much cash to keep outside one bank
**purpose:** Readers who were locked out of money see the cushion guide
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/emergency-fund.txt
**sha256:** 6551f9cf8279f98dd1cdd0f7bce8c9b0c722127f9797f8396ca0d9eb6cdcb0c0

**Technical and measurement scope**

Guide record added to src/data/guides.ts (Guide interface, canonical via existing /guides/[slug] template, JSON-LD Article/FAQ builders reused); sitemap and search-index regenerate at build; IndexNow after live 200. Measurement: growth.json status not-yet-published, age-matched comparator pages, GSC baseline unavailable (new route), not zero. No uplift claimed.

### A2 — /guides/401k-auto-enrollment-final-rules

**Identity**

**title:** 401(k) Auto-Enrollment Final Rules: 3% Default, 10% Target
**pageType:** guide (explainer, 1,200-word floor)
**format:** article - the reader wants the rule's mechanics and their options; a finite schedule table fits
**medium:** text
**plannedMetadata:** **title:** 401(k) Auto-Enrollment Final Rules: 3% Default, 10% Target

**Reader and answer**

**question:** What do the final 401(k) auto-enrollment rules mean for my paycheck, and can I opt out? [PAA 0/0 unread; ac 12/66 question completions, required/mandatory/can-change/opt-out family]
**answer:** Covered new 401(k) and 403(b) plans must enroll eligible employees at 3% or more, rising at least 1 point a year to at least 10% (max 15%); you can opt out or choose another rate; pre-2022-enactment plans, small and new businesses, governmental, church and SIMPLE plans are exempt. Shape: the rule with its boundaries.
**placement:** Section 1: 'What the Final Auto-Enrollment Rules Require'
**audience:** US consumers with the stated problem; adults making one concrete money decision
**intent:** informational / how-to

**Keyword evidence**

Provider ladder pinned semrush,dataforseo; SEMRUSH has no key and DataForSEO unavailable on 2026-11-17, so every figure is 'source: estimate (Google Autocomplete), NOT measured', US, checked 2026-11-17 (research/keyword-volumes.json). Primary: '401k automatic enrollment' (500-5000 band, 10 completions) and 'secure 2.0 automatic enrollment' (500-5000, 10). Supporting: '401k auto enrollment rules' (150-1500, 6). 'can i opt out of 401k auto enrollment' 0-25 (no completions; covered as an FAQ).

**SERP and questions**

SERP unread (DataForSEO unavailable). Autocomplete question sweep (66 suggestions for '401k auto enrollment'): is it required, mandatory, legal; can an employer auto-enroll you; can it be changed or delayed; notice requirements. These drive the opener and FAQ.

**Why a new page**

Closest existing: /guides/retirement-contribution-limits-2027/ (2026-11-16): dollar limits only, headings inspected, no auto-enrollment; roundups.ts and comparisons.ts carry one-sentence mentions (auto-enrollment required for plans established after Dec 29, 2022 and starting 2025). coverage_lookup: no home. Enrich-vs-new: different reader goal, so new page with inbound links. Independent duplicate review: required of CHART-REVIEW.

**Planned outline**

- **heading:** What the Final Auto-Enrollment Rules Require
**purpose:** Section 1 answer: 3% default, +1 point per year to at least 10% (max 15%), opt out or choose another rate, final regulations generally apply to plan years beginning after Dec 31, 2027 (Treasury, Nov 17 2026)
- **heading:** Which Plans Are Exempt
**purpose:** Statutory exemptions per IRC 414A(c): plans established before Dec 29 2022, employers under 3 years old, small employers (10 or fewer employees), governmental, church, SIMPLE 401(k); Treasury says final regs clarify these
- **heading:** How the Default Rate Rises Year by Year
**purpose:** Table of a 3% start with +1 per year to 10% (seven steps), labeled our illustrative arithmetic from the rule, plus one worked paycheck example at a stated salary
- **heading:** How to Opt Out or Change Your Rate
**purpose:** Participants may elect no contributions or another rate (414A); notices: Treasury says final regs let certain notices be combined; what to check in the plan's notice; sourced limits only
- **heading:** What the Final Regulations Changed for Employers
**purpose:** Timing and amount flexibility, notice simplification, mergers: one-sentence each from Treasury, no legal advice
- **heading:** Our Takeaway
**purpose:** Planned takeaway below
- **heading:** Frequently Asked Questions
**purpose:** Is auto-enrollment mandatory, can I opt out, does my current plan have to change, what rate will I start at, what about my match

**Contribution and evidence**

Decision gap: workers know auto-enrollment exists but not the numbers, the dates (statute 2025 vs final regulations after 2027) or their opt-out right. Basis: reported (Treasury SB-0690 and IRC 414A text) plus a small calculated illustration: our internal arithmetic from the stated rule shows a 3% default reaches 10% after seven annual steps; a $60,000 salary equals $1,800 a year at 3% and $6,000 at 10%. Sources checked 2026-11-17, saved verbatim. TD 10061 NOT verified and not to be cited. Counterexample: a worker whose employer is in an exempt category (e.g., a SIMPLE or governmental plan) is not auto-enrolled by this rule; many employers also auto-enroll voluntarily with different defaults. Good-faith interim compliance NOT verified: do not assert.

**Tables, tools or visuals**

One finite table: default rate by year of participation (3% to 10%, optional ceiling 15%). Worked example in prose. No calculator: fixed schedule.

**Testing and review**

Section G of _experience.md excludes legal and financial services: TESTED format OFF, ordinary presentation, no we-tested wording, no howWeTested field, no testing schema or byline. HIGH claim-risk floor (consequential financial claims), two content audits max, release at first genuine PASS; no professionalReviewRequired flag; disclaimer at page bottom only. Existing editorial site byline/publisher identity is reused; no invented reviewer or credentials.

**Planned takeaway**

For workers at employers with covered new 401(k)/403(b) plans: expect to be enrolled at 3% or more and raised at least 1 point a year, you can opt out or pick another rate; check your plan's notice and whether your plan is exempt. Condition: dates differ for existing versus new plans and exemptions apply. What changes it: a plan with a different compliant default, or an exempt plan. Attributed to Treasury and the statute, our schedule labeled illustrative arithmetic.

**Inbound internal links**

**required:** 3
**placements:** - **source:** /guides/retirement-contribution-limits-2027/
**target:** /guides/401k-auto-enrollment-final-rules/
**section:** Our Takeaway for 2027 Elections
**anchor:** how the new auto-enrollment default rate works
**purpose:** Readers setting 2027 elections learn the default and opt-out rules
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/limits-2027.txt
**sha256:** a6352c2d9ef1bbf9ebfcd3a17c8fb51bcc540c97c2c8fda9cb5aa94a51e5d144
- **source:** /guides/401k-contribution-limits-2026/
**target:** /guides/401k-auto-enrollment-final-rules/
**section:** The 401(k) Contribution Limit for 2026
**anchor:** automatic enrollment rules for new plans
**purpose:** Readers on the limits page see the default-rate rule
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/limits-2026.txt
**sha256:** 81996a12c430b860028155bd167ec3ec8cb0ed9c2ed1a9de29e30c61a264302a
- **source:** /compare/roth-401k-vs-traditional-401k/
**target:** /guides/401k-auto-enrollment-final-rules/
**section:** When to use both at the same time
**anchor:** what auto-enrollment defaults mean for Roth or traditional choice
**purpose:** Readers choosing a contribution type see the default rule
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/roth-vs-trad.txt
**sha256:** 2b42bd42883caf0f95a974b8da835659f89212a908bce2d2c5586866ce226032

**Outbound internal links**

**placements:** - **source:** /guides/401k-auto-enrollment-final-rules/
**target:** /guides/retirement-contribution-limits-2027/
**section:** Our Takeaway
**anchor:** 2027 401(k) contribution limits
**purpose:** Readers needing the dollar cap move to the limits guide
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/limits-2027.txt
**sha256:** a6352c2d9ef1bbf9ebfcd3a17c8fb51bcc540c97c2c8fda9cb5aa94a51e5d144
- **source:** /guides/401k-auto-enrollment-final-rules/
**target:** /retirement/401k-calculator/
**section:** Our Takeaway
**anchor:** 401(k) calculator
**purpose:** Readers test a 3% to 10% path with their own pay
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/401k-calc.txt
**sha256:** 52ec9c36abecf86fa77e32e8a63472d00d0b0a39b695c26f4bcbac57245855b6

**Technical and measurement scope**

Guide record added to src/data/guides.ts (Guide interface, canonical via existing /guides/[slug] template, JSON-LD Article/FAQ builders reused); sitemap and search-index regenerate at build; IndexNow after live 200. Measurement: growth.json status not-yet-published, age-matched comparator pages, GSC baseline unavailable (new route), not zero. No uplift claimed.

### A3 — /guides/minnesota-truth-in-taxation-notice

**Identity**

**title:** Minnesota Truth-in-Taxation Notice: Read Your 2027 Proposed Tax
**pageType:** guide (explainer/how-to, 1,200-word floor)
**format:** article - the reader wants to interpret a notice and know what to do before the hearing
**medium:** text
**plannedMetadata:** **title:** Minnesota Truth-in-Taxation Notice: Read Your 2027 Proposed Tax

**Reader and answer**

**question:** Why did my Minnesota proposed 2027 property tax go up, how do I read the Truth-in-Taxation notice and what can I do before final levies are set? [PAA 0/0 unread; ac 10/47 question completions, what/how/is-it-legit family]
**answer:** The notice is a proposal built from preliminary local levies (statewide up to $949 million, 6.5% higher); read the current-versus-proposed columns per taxing authority, attend a local hearing, and remember final levies, due Dec 28 2026, can be lower but not higher. Shape: how-to-read plus next step.
**placement:** Section 1: 'What Your Truth-in-Taxation Notice Is and What You Can Do'
**audience:** US consumers with the stated problem; adults making one concrete money decision
**intent:** informational / how-to

**Keyword evidence**

Provider ladder pinned semrush,dataforseo; SEMRUSH has no key and DataForSEO unavailable on 2026-11-17, so every figure is 'source: estimate (Google Autocomplete), NOT measured', US, checked 2026-11-17 (research/keyword-volumes.json). Primary: 'truth in taxation notice' (20-200 band, 5 completions) with 'minnesota' modifier. Supporting: 'minnesota truth in taxation', 'minnesota property tax increase 2027', 'proposed property tax notice' (see JSON). Seasonal: notices arrive Nov 11-24 2026.

**SERP and questions**

SERP unread (DataForSEO unavailable). Autocomplete questions: is it legitimate, how it works, is it required, what is it. 'Legit' and 'what is' are the opener's pattern.

**Why a new page**

Closest existing: none (coverage_lookup 0 repo/0 sitemap). /guides/tax-deductions-for-homeowners/ covers federal deductions, not a Minnesota notice. Independent duplicate review: required of CHART-REVIEW.

**Planned outline**

- **heading:** What Your Truth-in-Taxation Notice Is and What You Can Do
**purpose:** Section 1 answer: a proposal from preliminary levies; read it, attend the hearing, final levies set by Dec 28 2026 can be lower but not higher; statewide preliminary levies up to $949 million (6.5%) over 2026
- **heading:** Why Proposed Taxes Are Rising in 2027
**purpose:** DOR figures by taxing type: cities 8.1%, counties 8.1%, townships 4.9%, schools 5.0%, special districts 3.7%; last year final levy was $74 million below preliminary (6.4% final)
- **heading:** How to Read the Notice, Column by Column
**purpose:** Per Minn. Stat. 275.065 subd. 3: current year taxes, proposed taxes, percent change, taxing authority meeting times, market value shown; statute-only reading, no invented layout
- **heading:** How to Use the Hearing
**purpose:** Which bodies must hold meetings (cities over 500 people, counties, school districts, regional library authorities, metropolitan taxing districts), window late Nov to late Dec, what to prepare; start times not stated (unverified)
- **heading:** What the Hearing Cannot Change
**purpose:** Final levy cannot exceed proposed; town and state general tax proposed equals final; the page does not cover valuation appeals (unverified, separate process)
- **heading:** Our Takeaway
**purpose:** Planned takeaway below
- **heading:** Frequently Asked Questions
**purpose:** Is the notice a bill, is the notice legitimate, can my tax go up after the notice, when are final levies set, who must hold a hearing

**Contribution and evidence**

Decision gap: Minnesotans receive a proposed-tax notice without knowing it is a ceiling, what its columns mean or what hearings do. Basis: reported (Minnesota DOR press release 2026-11-12, Minn. Stat. 275.065, DOR Truth-in-Taxation page, CBS Minnesota). Sources checked 2026-11-17, saved verbatim. Counterexample: voter-approved school referenda (63 districts, 26 at least partly passed) are not in notices; the proposed amount is not a final bill because final levies can be lower and your own valuation or class is separate. Nothing about outcomes is predicted.

**Tables, tools or visuals**

One finite table of notice columns and what each means, plus a short dates list. No tool: parcel numbers come from the reader's own notice.

**Testing and review**

Section G of _experience.md excludes legal and financial services: TESTED format OFF, ordinary presentation, no we-tested wording, no howWeTested field, no testing schema or byline. HIGH claim-risk floor (consequential financial claims), two content audits max, release at first genuine PASS; no professionalReviewRequired flag; disclaimer at page bottom only. Existing editorial site byline/publisher identity is reused; no invented reviewer or credentials.

**Planned takeaway**

For Minnesota homeowners holding a proposed-tax notice: treat the figure as a ceiling, compare current versus proposed taxes by taxing authority, and attend the meeting for the body driving the increase before final levies are set by Dec 28 2026. Condition: parcel tax also depends on valuation and classification, which this notice does not decide. What changes it: final levy information (DOR releases it in February).

**Inbound internal links**

**required:** 2
**placements:** - **source:** /guides/tax-deductions-for-homeowners/
**target:** /guides/minnesota-truth-in-taxation-notice/
**section:** Property Taxes and the State and Local Tax Cap
**anchor:** how to read a Minnesota proposed property tax notice
**purpose:** Minnesota readers weighing property taxes see the notice guide
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/homeowner-deductions.txt
**sha256:** e0cf0753e000d2977ce6886b7c5832bfc368860a294a9b7ac3df15ccc8dc8e35
- **source:** /mortgage/home-affordability-calculator/
**target:** /guides/minnesota-truth-in-taxation-notice/
**section:** Enter your income and debts — the tool uses the 28/36 rule to find your price.
**anchor:** why a Minnesota proposed tax can change your budget
**purpose:** Readers pricing a home see how a notice shapes yearly tax
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/home-afford.txt
**sha256:** cf96363f699cfbeb816daebaaa1fce353fc9b829086daa440fc0cc22816d8302

**Outbound internal links**

**placements:** - **source:** /guides/minnesota-truth-in-taxation-notice/
**target:** /guides/tax-deductions-for-homeowners/
**section:** Our Takeaway
**anchor:** homeowner tax deductions
**purpose:** Readers who pay property tax see what can be deducted
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/homeowner-deductions.txt
**sha256:** e0cf0753e000d2977ce6886b7c5832bfc368860a294a9b7ac3df15ccc8dc8e35
- **source:** /guides/minnesota-truth-in-taxation-notice/
**target:** /mortgage/home-affordability-calculator/
**section:** Our Takeaway
**anchor:** home affordability calculator
**purpose:** Readers re-test affordability with the proposed tax
**inspection:** **path:** reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/home-afford.txt
**sha256:** cf96363f699cfbeb816daebaaa1fce353fc9b829086daa440fc0cc22816d8302

**Technical and measurement scope**

Guide record added to src/data/guides.ts (Guide interface, canonical via existing /guides/[slug] template, JSON-LD Article/FAQ builders reused); sitemap and search-index regenerate at build; IndexNow after live 200. Measurement: growth.json status not-yet-published, age-matched comparator pages, GSC baseline unavailable (new route), not zero. No uplift claimed.

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
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-17-xtrends-run/readiness.md) |

Approve this plan to start the listed content work?
