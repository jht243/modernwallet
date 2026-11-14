---
mindmap_pass_date: 2026-11-14
source: "trend-pass-auto Lane C 2026-11-14: top GSC queries (7d to 2026-11-14) plus research pack, SEMRUSH-validated; DataForSEO SERP; Google Autocomplete"
interpreted_brief: "Our top GSC queries for the 7 days ending 2026-11-14 are 5 human queries with 0 clicks and 1-2 impressions each plus a site: operator; the research lanes found no trend and flagged two as uncovered: 'solo 401k loan calculator' and 'hard money calculator'. BUILD confirmed both are real gaps (the site explains 401(k) loan rules but has no loan calculator; it has no real-estate loan-cost tool), found the larger demand behind them ('401k loan calculator' 4,400/mo, 'hard money loan calculator' 1,900/mo, 'bridge loan calculator' 1,600/mo), and plans three new calculator pages plus one additive solo-401(k) section on the existing rules guide. The other four queries remain covered/DROPPED per the ledger and the two UTMA/avg-balance enrichments stay HELD because their primary sources are still unreachable."
status: ready-for-approval
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [source: top-10 + coverage] Lens 1 direct intent. GSC 'solo 401k loan calculator' (2 impr, pos 37.5, 0 clicks, Lane B flagged uncovered). SEMRUSH us 2026-11-14: 'solo 401k loan calculator' 20/mo KD0, 'solo 401k loan' 140 KD9, 'borrow from solo 401k' 140 KD2; Lens 2 sibling head '401k loan calculator' 4,400 KD29, '401k loan payment calculator' 880, '401k loan repayment calculator' 590. Autocomplete corroborates (solo-loan 5-10 completions; 401k loan sweep 310 rows). Diagnosis: the site explains the rules (/guides/401k-loan-rules) and compares borrowing paths, but no page computes the cap or payment. lookup: /guides/401k-loan-rules (reader wants the rules, not a computed cap and payment: different goal) and /compare/401k-loan-vs-heloc (borrowing-path choice); no calculator match. Commits checked: git log -S on 'solo 401(k) loan' empty; 401k-loan-rules added in 3e3db96, no calculator commit. Same-run overlap: TL-04 enriches the rules guide (different reader goal). | Create /retirement/401k-loan-calculator/ targeting '401k loan calculator' and 'solo 401k loan calculator' [calculator]: new standalone src/lib engine (statutory cap per 26 U.S.C. 72(p)(2)(A) and level-payment schedule), built in Phase 3c. register: operator; page type: cost-pricing / spoke tool; depth floor: at least 1,000 reader-facing body words. | create new content | /retirement/401k-loan-calculator/ | calculator | interactive tool | interactive tool | locked (advisory; AI Overview) | DataForSEO read of '401k loan calculator' and 'solo 401k loan calculator': top-10 domain parse returned google.com for every slot (parser artifact, advisory only); AI Overview present, cites tiaa.org, voyaretirementplans.com, irafinancial.com, youtube.com, trsretire.com; PAA includes 'How are 401k loan amounts calculated?'. Not used to drop the row. | How much can I borrow from my 401(k), and what will my loan payments be? [PAA 2/6 on-topic (how much loan can I get from my 401k; $10,000 over 5 years per month), 4/6 off-topic: retirement age, contribution percentage, balance growth; ac 6/44 question completions incl. how much 401k loan can i take, how are 401k loans paid back] | Your new loan, added to loans you already owe the plan, cannot exceed the lesser of $50,000 reduced by how much your highest plan-loan balance in the past 12 months exceeded your balance today, or the greater of half your vested balance or $10,000; the calculator subtracts what you already owe and returns the largest new loan and the payment for the amount you enter (answer shape: figure). | section 1 — Calculate Your 401(k) Loan Limit and Payment | MW-TL-01 |
| [source: top-10 + coverage] Lens 1 direct intent. GSC 'hard money calculator' (1 impr, pos 81, 0 clicks, Lane B flagged no dedicated page). SEMRUSH us 2026-11-14: 'hard money loan calculator' 1,900 KD18 (cpc $3.31), 'hard money calculator' 480 KD19, 'fix and flip calculator' 390 KD6, 'fix and flip loan calculator' 140 KD12; Autocomplete a-z/question sweep 286 rows (calculator interest only, payment calculator, points, how much hard money loan cost). Diagnosis: the site has no real-estate loan-cost tool; rental calculators (cash flow, cap rate, cash-on-cash) assume a long-term mortgage. lookup: no match (nearest /guides/buy-a-house-with-no-money-down, zero-down mortgages, different reader). Commits checked: git log -S 'hard money' over src is empty. Same-run overlap: TL-03 shares the interest-only-plus-fees arithmetic but serves a sell-then-buy reader. The fix-and-flip profit queries fold into this page's ARV/profit output rather than a second row. | Create /real-estate/hard-money-loan-calculator/ targeting 'hard money loan calculator' [calculator]: new standalone src/lib engine for interest-only cost, points, fees, extension, balloon payoff, loan-to-cost, loan-to-ARV and optional flip profit, built in Phase 3c. register: operator; page type: cost-pricing / spoke tool; depth floor: at least 1,000 reader-facing body words. | create new content | /real-estate/hard-money-loan-calculator/ | calculator | interactive tool | interactive tool | locked (advisory; AI Overview) | DataForSEO read of 'hard money loan calculator': top-10 domain parse returned google.com for every slot (parser artifact, advisory only); AI Overview present; PAA 'How do hard money loans work?', 'How do you calculate loan to cost?'. Not used to drop the row. | How much will a hard money loan cost me in total? [PAA 2/6 on-topic (how do hard money loans work; how do you calculate loan to cost), 4/6 off-topic: personal loan monthly cost, mortgage affordability; ac 3/16 question completions incl. how much hard money loan cost, is hard money loan interest only] | Total cost is the points and fees at closing plus interest-only payments for every month you hold the loan (plus any extension fee), repaid with a balloon of the full balance at exit; the calculator returns each piece, the loan-to-cost and loan-to-ARV percentages and, if you enter an after-repair value, the deal's profit after financing (answer shape: figure). | section 1 — Calculate Your Hard Money Loan Cost | MW-TL-02 |
| [source: top-10] Lens 2 adjacent-demand cluster off the hard money seed (same short-term interest-only-plus-fees family). SEMRUSH us 2026-11-14: 'bridge loan calculator' 1,600 KD18 (cpc $3.14); Autocomplete bridge-loan sweep 307 rows incl. 'how much bridge loan cost', 'how much bridge loan can i get', 'how do bridge loans work when buying a house'; PAA 'Does a bridge loan cost more?'. Diagnosis: /compare/bridge-loan-vs-heloc compares the two options but has no calculator; no page computes the overlap cost. lookup: /compare/bridge-loan-vs-heloc (choice between two products, different goal). Commits checked: git log -S 'bridge loan calculator' empty. Same-run overlap: TL-02 (different reader: investor financing a purchase vs homeowner buying before selling); cross-link, do not merge. | Create /real-estate/bridge-loan-calculator/ targeting 'bridge loan calculator' [calculator]: new standalone src/lib engine for bridge loan fees, interest, overlap carrying cost and net sale proceeds, built in Phase 3c (may share arithmetic helpers with the TL-02 engine). register: operator; page type: cost-pricing / spoke tool; depth floor: at least 1,000 reader-facing body words. | create new content | /real-estate/bridge-loan-calculator/ | calculator | interactive tool | interactive tool | locked (advisory; AI Overview) | DataForSEO read of 'bridge loan calculator': top-10 domain parse returned google.com for every slot (parser artifact, advisory only); AI Overview present; PAA 'Does a bridge loan cost more?'. Not used to drop the row. | How much will a bridge loan cost me until my old home sells? [PAA 2/6 adjacent (does a bridge loan cost more; how do you calculate loan to cost), 4/6 off-topic: construction loan payment, 20% down payment, mortgage qualification; ac 3/16 question completions incl. how much bridge loan can i get, how much bridge loan cost] | The cost is the bridge loan's fees plus its interest for every month until the old home sells, on top of carrying both homes; the calculator returns the bridge cost, the monthly overlap outlay and the net proceeds you keep after the old mortgage, the bridge loan and selling costs (answer shape: figure). | section 1 — Calculate Your Bridge Loan Cost | MW-TL-03 |
| [source: top-10] Lens 2 enrichment on the page that owns the 401(k) loan rules. SEMRUSH us 2026-11-14: 'solo 401k loan' 140 KD9, 'borrow from solo 401k' 140 KD2, 'solo 401k loan rules' 70 KD17; Autocomplete: can i take a loan from a solo 401k, can you borrow from a solo 401k, how do solo 401k loans work. Diagnosis: guides/401k-loan-rules is employer-plan framed and has no owner-only/solo section, so the solo-loan head queries have no answering passage. lookup: /guides/401k-loan-rules (right topical home, missing the solo angle). Commits checked: 401k-loan-rules added 3e3db96; no later commit touches it; git log -S 'solo 401(k) loan' empty. Not AIO-defended (defended-pages.json pages: []). | Add one section 'Can a Solo 401(k) Lend to Its Owner?' as section 2 of /guides/401k-loan-rules/ plus 2 FAQs, additive via content_gen.py section, grounded only in 26 U.S.C. 72(p), 4975(c)(1)(B), 4975(d)(1)(A)-(E), 4975(f)(6) and 416(i)(1)(A) (all five (d)(1) conditions listed, key-employee interest non-deductibility stated, no deductibility implied); link the new calculator from the guide's tools list and first section. No provider-specific claims. | update existing body text | /guides/401k-loan-rules/ | article section (additive H2 and 2 FAQs) | text | text | locked (advisory; AI Overview) | DataForSEO read of 'solo 401k loan calculator' (same cluster): AI Overview present; PAA 'How much loan can I get from my 401k?', 'What is the downside of a Solo 401k?'. Advisory only. | Can I borrow from my solo 401(k)? [ac 4/44 question completions: can i take a loan from a solo 401k, can you borrow from a solo 401k, how do solo 401k loans work, how does a solo 401k loan work; PAA support is for the amount question on the calculator page, not eligibility] | Yes, if the plan document provides for loans: an owner-only 401(k) follows the same 26 U.S.C. 72(p) limits, and the 26 U.S.C. 4975(d)(1) conditions for the loan to avoid being a prohibited transaction include availability on a reasonably equivalent basis, no larger amounts for highly compensated employees, specific plan provisions, a reasonable interest rate and adequate security; the plan document and its administrator decide whether a given loan meets them. A plan loan is a loan between a plan and a disqualified person under 4975(c)(1)(B), and the statute text bars the (d) exemption for IRA owners (4975(f)(6)), so an IRA-based plan (SEP, SIMPLE, traditional IRA) cannot lend to its owner. An owner is generally a key employee under 416(i)(1)(A)(ii), so interest on the owner's own loan is not deductible under 72(p)(3) (answer shape: verdict with its boundary). | section 2 — Can a Solo 401(k) Lend to Its Owner? | MW-TL-04 |

## Original request and acceptance

Turn this week's top Google queries plus our research findings into pages and sections the site lacks, so a reader who searches 'solo 401k loan calculator' or 'hard money calculator' lands on a page that answers the question with a figure grounded in an engine or a primary source.

- **id:** R1
**description:** Serve the new query 'solo 401k loan calculator' (research Lane B: uncovered) with a working calculator and a solo-401(k) answer grounded in 26 U.S.C. 72(p) and 4975.
**acceptance:** A live /retirement/401k-loan-calculator/ returns the statutory cap and level payment from a src/lib engine for entered inputs, states the solo/owner-only conditions with first-mention statute links, and /guides/401k-loan-rules/ carries a solo section that agrees with it.
**actionIds:** - MW-TL-01
- MW-TL-04
- **id:** R2
**description:** Serve the new query 'hard money calculator' (research Lane B: no dedicated page) with a calculator whose figures come only from reader inputs.
**acceptance:** A live /real-estate/hard-money-loan-calculator/ returns points, interest-only payment, total financing cost, balloon payoff, loan-to-cost and loan-to-ARV from a src/lib engine, with no market-rate claims on the page.
**actionIds:** - MW-TL-02
- **id:** R3
**description:** Build adjacent demand the queries imply (Lens 2): the bridge loan calculator cluster (1,600/mo), the same short-term-loan arithmetic family.
**acceptance:** A live /real-estate/bridge-loan-calculator/ returns bridge cost, overlap outlay and net proceeds from a src/lib engine, cross-linked with the hard money calculator and the bridge-loan-vs-heloc comparison.
**actionIds:** - MW-TL-03

### Presentation — MW-TL-01

**medium:** interactive tool
**placement:** New spoke page; calculator is section 1, above the explanation
**reason:** The answer turns on three reader numbers (vested balance, loans outstanding now and the highest balance in the last 12 months) plus rate and term, which a static table cannot cover.
**readerInputs:** - Vested account balance
- Current outstanding plan loan balance
- Highest plan loan balance in the past 12 months
- Loan amount wanted
- Interest rate (APR)
- Term in years
- Payments per year (quarterly, monthly or per paycheck)
- Loan purpose: general or principal residence
**interaction:** **decision:** build
**reason:** Statutory cap, repayment and the 5-year and quarterly rules change with each input; the reader cannot read their own cap from a table.
**animation:** **decision:** not-useful
**reason:** There is no changing quantity worth animating; results update instantly and a 5-row schedule table is the clearer view.

### Presentation — MW-TL-02

**medium:** interactive tool
**placement:** New real-estate spoke; calculator is section 1
**reason:** Cost depends on loan size, rate, points, months held and optional after-repair value, so the reader must enter their deal.
**readerInputs:** - Purchase price
- Rehab budget
- Percent of purchase price the lender advances
- Percent of rehab financed
- Interest rate (APR)
- Points (percent of loan)
- Months until payoff
- Lender, document and other fees
- Extension months and fee
- After-repair value (optional)
- Selling costs percent and monthly holding costs (optional)
**interaction:** **decision:** build
**reason:** Each input changes total financing cost, loan-to-cost and profit; a static example cannot answer a reader whose points or hold time differ.
**animation:** **decision:** not-useful
**reason:** A month-by-month interest table is clearer than motion; reduced-motion safe by default.

### Presentation — MW-TL-03

**medium:** interactive tool
**placement:** New real-estate spoke; calculator is section 1
**reason:** The cost depends on loan size, rate, fees and how many months the old home takes to sell, which only the reader knows.
**readerInputs:** - Expected sale price of the old home
- Old mortgage payoff
- Bridge loan amount
- Interest rate (APR)
- Origination percent and other fees
- Months until the old home sells
- New mortgage payment
- Old home monthly carrying costs
- Selling costs percent
**interaction:** **decision:** build
**reason:** Months-to-sell is the main swing factor and changes the answer; a fixed example hides it.
**animation:** **decision:** not-useful
**reason:** Month count is a single number; a cost-by-month table shows the sensitivity without animation.

### Presentation — MW-TL-04

**medium:** text
**placement:** Existing guide, new section 2 after the opening 72(p) limits section
**reason:** A yes-with-conditions verdict about plan documents and the prohibited-transaction exemption is prose; the calculator page handles the numbers.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** The answer is a conditional rule, not a computation; a calculator would duplicate TL-01.
**animation:** **decision:** not-useful
**reason:** Nothing changes dynamically.

## Emerging search patterns (clusters)

- **cluster:** 401(k) loan calculation
**queries:** 401k loan calculator (4,400/mo); 401k loan payment calculator (880); 401k loan repayment calculator (590); solo 401k loan calculator (20); solo 401k loan (140); borrow from solo 401k (140)
**why:** Calculator-intent queries with no computing page; rules guide exists
**coverage:** partial (rules guide, comparison)
**lever:** create new content
**target:** /retirement/401k-loan-calculator/
**format:** calculator
**best_medium:** interactive tool
**resolved_deliverable:** interactive tool
**serp_verdict:** locked (advisory; AI Overview)
**serp_evidence:** AI Overview cites tiaa.org, voyaretirementplans.com, irafinancial.com; domain parse artifact
- **cluster:** Solo 401(k) loan eligibility
**queries:** can i take a loan from a solo 401k; can you borrow from a solo 401k; how do solo 401k loans work; solo 401k loan rules (70)
**why:** Guide is employer-plan framed; no owner-only passage
**coverage:** partial
**lever:** update existing body text
**target:** /guides/401k-loan-rules/
**format:** article section (additive H2 and 2 FAQs)
**best_medium:** text
**resolved_deliverable:** text
**serp_verdict:** locked (advisory; AI Overview)
**serp_evidence:** AI Overview present for the solo calculator head
- **cluster:** Hard money loan cost
**queries:** hard money loan calculator (1,900); hard money calculator (480); fix and flip calculator (390); fix and flip loan calculator (140); hard money loan interest only calculator (75-750 est.)
**why:** No real-estate loan-cost tool on site
**coverage:** none
**lever:** create new content
**target:** /real-estate/hard-money-loan-calculator/
**format:** calculator
**best_medium:** interactive tool
**resolved_deliverable:** interactive tool
**serp_verdict:** locked (advisory; AI Overview)
**serp_evidence:** domain parse artifact; AI Overview present
- **cluster:** Bridge loan cost
**queries:** bridge loan calculator (1,600); how much bridge loan cost; how much bridge loan can i get
**why:** Comparison page exists, calculator does not
**coverage:** partial (comparison only)
**lever:** create new content
**target:** /real-estate/bridge-loan-calculator/
**format:** calculator
**best_medium:** interactive tool
**resolved_deliverable:** interactive tool
**serp_verdict:** locked (advisory; AI Overview)
**serp_evidence:** domain parse artifact; AI Overview present

## Exclusions

site: operator, roth or regular 401k, tax deferred growth calculator and utma: skipped (covered/DROPPED per ledger 2026-11-13). HELD (not dropped): utma state age-of-majority and transfer/close enrichment (statute sources still unreachable, data/sources/ absent); 401(k) balance-by-age enrichment (Fidelity 403, Vanguard 404); what-is-a-hard-money-loan explainer and hard money vs bridge loan comparison (no primary source for typical terms, thin demand). DROPPED off-mission: hard money lender directories. Lens 3 (vs/alternatives/pricing): entity 'hard money loan' vs bridge loan 20-40/mo held; hard money vs private money 90/mo KD12 and vs conventional 20/mo too thin and ungroundable; 401(k) loan vs HELOC and bridge loan vs HELOC comparisons already exist; no branded vendor in the brief. Lens 3b skipped (not an AI-content repo). No metadata rows, no consolidation, no provider-specific solo 401(k) claims, no market-rate claims for hard money or bridge loans, no TESTED claims (site experience section G excludes financial services). TL-02 and TL-03 share arithmetic but serve different readers; if the independent reviewer sees cannibalization, merge decision belongs to Phase 1 advisory only.

## New-page briefs

### MW-TL-01 — /retirement/401k-loan-calculator/

**Identity**

**title:** 401(k) Loan Calculator: Max Amount and Payment (Solo and Employer Plans)
**pageType:** cost-pricing / spoke tool
**format:** calculator
**medium:** interactive tool
**register:** operator
**depthFloorWords:** 1000

**Reader and answer**

**question:** How much can I borrow from my 401(k), and what will my loan payments be? [PAA 2/6 on-topic (how much loan can I get from my 401k; $10,000 over 5 years per month), 4/6 off-topic: retirement age, contribution percentage, balance growth; ac 6/44 question completions incl. how much 401k loan can i take, how are 401k loans paid back]
**answer:** Your new loan, added to loans you already owe the plan, cannot exceed the lesser of $50,000 reduced by how much your highest plan-loan balance in the past 12 months exceeded your balance today, or the greater of half your vested balance or $10,000; the calculator subtracts what you already owe and returns the largest new loan and the payment for the amount you enter (answer shape: figure).
**placement:** section 1 — Calculate Your 401(k) Loan Limit and Payment
**reader:** U.S. saver with an employer or owner-only 401(k) weighing a plan loan.
**scope:** Federal limits only; plan documents control.
**answerShape:** figure

**Keyword evidence**

**primary:** **phrase:** 401k loan calculator
**monthlySearches:** 4400
**kd:** 29
**source:** SEMRUSH
**confidence:** high
**autocompleteCorroborations:** 10
**supporting:** - **phrase:** solo 401k loan calculator
**monthlySearches:** 20
**kd:** 0
**source:** SEMRUSH (GSC: 2 impressions at position 37.5)
- **phrase:** 401k loan payment calculator
**monthlySearches:** 880
**kd:** 45
**source:** SEMRUSH
- **phrase:** 401k loan repayment calculator
**monthlySearches:** 590
**kd:** 48
**source:** SEMRUSH
- **phrase:** solo 401k loan
**monthlySearches:** 140
**kd:** 9
**source:** SEMRUSH
- **phrase:** borrow from solo 401k
**monthlySearches:** 140
**kd:** 2
**source:** SEMRUSH
**caveat:** Semrush volumes are Google Ads buckets; do not sum or present as real-time totals.
**database:** US
**researchDate:** 2026-11-14

**SERP and questions**

**exactQuery:** 401k loan calculator
**serp:** locked per advisory parser (artifact: all top-10 domains read as google.com); AI Overview present, cites tiaa.org, voyaretirementplans.com, irafinancial.com, youtube.com, trsretire.com; no featured snippet
**aiOverviewCites:** tiaa.org, voyaretirementplans.com, irafinancial.com, youtube.com, trsretire.com
**paa:** 2/6 on-topic for the solo head, 1/6 on-topic for the generic head
**autocomplete:** 401k loan sweep 310 rows; solo 401k loan sweep 43 rows
**shape:** Calculator with a direct-answer block in section 1 (AEO target).
**paaQuestions:** - How much loan can I get from my 401k?
- How much would a $10,000 loan cost per month over 5 years?
- How are 401k loan amounts calculated?
**autocompleteQuestions:** - how much 401k loan can i take
- how are 401k loans paid back
- how many 401k loans can you have
- does 401k loan interest work
- can i take a loan from a solo 401k
**offTopicPaa:** Can I retire at 62 with $400,000; What will $100,000 be worth in 30 years; Can I contribute 100% of salary to a solo 401k (not FAQ targets)
**sectionVsFaq:** Section 1 answers how much can I borrow and the payment. FAQs cover the amount-formula question, how many loans, repayment rules, and the solo question with a link to the guide.

**Why a new page**

**coverage:** coverage_lookup 2026-11-14: nearest /guides/401k-loan-rules (rules explainer), /compare/401k-loan-vs-heloc (path choice), /compare/sep-ira-vs-solo-401k and /compare/solo-401k-vs-simple-ira (plan choice). None computes a cap or payment; no calculator spoke for 401(k) loans exists in src/data/spokes-retirement.ts.
**intentGap:** A reader who knows the rules still cannot read their own cap (the three-term lesser-of/greater-of formula with the 12-month highest-balance reduction) or a payment.
**checkedCommits:** No commit adds a 401(k) loan calculator or solo loan text (git log -S empty); guide added in 3e3db96.
**independentDuplicateReview:** Run by the independent CHART-REVIEW stage; BUILD ran coverage_lookup inline and records M=0 same-intent matches for this row.
**formatDecision:** Interactive: cap and payment depend on six reader numbers.

**Planned outline**

- **section:** Calculate Your 401(k) Loan Limit and Payment
**purpose:** Direct answer to how much can I borrow and what is the payment. Tool plus a two-sentence answer block above it (AEO). No solo toggle: the 72(p) formula is the same for employer and owner-only plans, so no input differs.
- **section:** How the Loan Limit Is Calculated
**purpose:** Walk the 72(p)(2)(A) formula with three engine-computed worked cases (vested $15,000, $60,000, $200,000, no prior loans, matching the existing guide) and one case with a prior loan balance and a higher 12-month peak.
- **section:** Repayment Rules the Calculator Checks
**purpose:** 5 years (home-purchase exception), level amortization at least quarterly, and what the tool flags when inputs fall outside: deemed distribution; link the early-withdrawal calculator for the tax estimate.
- **section:** Borrowing From a Solo 401(k)
**purpose:** Short pointer only (2-3 sentences) to the guide section owned by TL-04: same 72(p) limits for an owner-only plan; plan document must provide for loans; the 4975(d)(1) conditions include more than a plan provision (cite all five in the guide, not here); owners are generally key employees so loan interest is not deductible (416(i)(1)(A)(ii), 72(p)(3)). No provider claims.
- **section:** What the Calculator Does Not Include
**purpose:** Fees, lost investment growth, taxes on a defaulted loan, plan-specific rates and limits; state that interest repaid goes back to your own account but the borrowed amount is out of the market meanwhile (no return figure asserted).
- **section:** FAQ plan from observed PAA and Autocomplete
**questionsAndPurpose:** - **question:** How are 401k loan amounts calculated?
**purpose:** Formula in words with the engine example.
- **question:** How much would a $10,000 401(k) loan cost per month over 5 years?
**purpose:** Engine output at a user-labelled example rate; states rate is an example input, not a market rate.
- **question:** How many 401(k) loans can you have at once?
**purpose:** Statute counts all outstanding plan loans in the cap; the number of loans is set by the plan document.
- **question:** Can I take a loan from a solo 401(k)?
**purpose:** Two-sentence pointer matching TL-04 (conditions include the plan document providing for loans) and linking the guide section; the guide owns the full answer.
- **question:** What happens if I do not repay a 401(k) loan?
**purpose:** 72(p)(1) deemed distribution; link the early-withdrawal calculator.

**Contribution and evidence**

**originalWork:** In our internal modeling the calculator applies the 26 U.S.C. 72(p)(2) formula and level-payment arithmetic to the reader's own inputs; the page states what we computed, the formula and that rates are user inputs.
**basis:** calculated
**legalSources:** 26 U.S.C. 72(p)(1)-(3), 4975(c)(1)(B), 4975(d)(1)(A)-(E), 4975(f)(6)(A)-(B) and 416(i)(1)(A) (Cornell LII, extracted 2026-11-14 in research/statute-extracts.md); cite 4975(c)(1)(B) in the closed facts for the IRA-plan sentence. IRS FAQ page returned 404 from the runner; statute text only.
**engine:** New src/lib/401k-loan.ts (standalone; mirrors src/lib/loan-payment.ts level-payment formula). Inputs/outputs listed in the presentation block; node-testable fixtures: vested 15,000 -> cap 10,000; 60,000 -> 30,000; 200,000 -> 50,000; with highest12=50,000 and outstanding=20,000 -> A=20,000 so max new loan = 0 (existing fixture); vested 200,000, outstanding 10,000, highest12 20,000 -> max new loan = min(50,000 - 20,000, 100,000 - 10,000) = 30,000 (a double-deduction reading would give 20,000); and a boundary at vested 100,000 exactly (cap 50,000).
**visibleAttribution:** Statute links at first mention; calculation attributed to our modeling with the formula shown beside the tool.
**limits:** No personalized advice; no provider-specific loan support claims; no tax figure on a defaulted loan (links the early-withdrawal calculator); example rate labelled as an example input.

**Tables, tools or visuals**

**tool:** Calculator island (data-tool root) built in Phase 3c from the new engine: inputs listed in presentation; outputs: statutory cap, available new loan, payment per period, total interest, total repaid, deemed-distribution flag with the 5-year and quarterly checks; amortization shown as a table (first and last 5 periods plus yearly totals).
**staticAnswer:** Section 1 answer block and the three worked cases remain readable without interaction.
**boundaries:** Vested under 20,000 (10,000 floor), exactly 100,000 (50,000 ceiling), prior loan with higher 12-month peak (vested 200,000, outstanding 10,000, highest12 20,000 -> 30,000), term over 5 years without residence flag, payments per year under 4.

**Testing and review**

**presentation:** Ordinary calculator page; no product test or ranking claim. site _experience.md section G licenses tested claims only for products on roundups and comparisons, and excludes financial services: no TESTED format.
**review:** Independent Phase 4 audit; financial/tax claims at the site floor, calculation replay of the engine via audit-analysis.
**labels:** basis calculated; no tested/reviewed-by claim; byline is the existing template author.

**Planned takeaway**

**intent:** Worth computing before you borrow: your cap and payment, and the conditions that make a loan count as a distribution instead.
**placement:** Short takeaway after the repayment-rule section; section 1 carries the figure.
**limitations:** Plan documents set availability, fees and rates; the calculator cannot tell whether your plan allows loans; borrowed money is out of the market meanwhile; a tax professional should confirm default consequences.

**Inbound internal links**

**required:** 3
**placements:** - **source:** /guides/401k-loan-rules/
**target:** /retirement/401k-loan-calculator/
**section:** How a 401(k) Loan Works and How Much You Can Borrow
**anchor:** 401(k) loan calculator
**purpose:** Readers who just learned the lesser-of formula can run their own numbers.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1
- **source:** /compare/401k-loan-vs-heloc/
**target:** /retirement/401k-loan-calculator/
**section:** What Decides Between a 401(k) Loan and a HELOC
**anchor:** 401(k) loan calculator
**purpose:** Readers comparing borrowing paths can size the 401(k) side.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1
- **source:** /compare/sep-ira-vs-solo-401k/
**target:** /retirement/401k-loan-calculator/
**section:** Roth, loans, and paperwork: the features that break the tie
**anchor:** solo 401(k) loan calculator
**purpose:** The section says a solo 401(k) offers loans; the tool shows the cap and payment.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1

**Outbound internal links**

**placements:** - **source:** /retirement/401k-loan-calculator/
**target:** /guides/401k-loan-rules/
**section:** Borrowing From a Solo 401(k)
**anchor:** 401(k) loan rules guide
**purpose:** Depth on the statute, repayment and default for readers who want the rules.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1
- **source:** /retirement/401k-loan-calculator/
**target:** /compare/401k-loan-vs-heloc/
**section:** What the Calculator Does Not Include
**anchor:** 401(k) loan vs HELOC
**purpose:** Readers needing a different borrowing source.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1

**Technical and measurement scope**

**route:** /retirement/401k-loan-calculator/
**implementation:** New spoke in src/data/spokes-retirement.ts (calculator: retirement) plus a new tool component and src/lib engine mirroring the 401k-early-withdrawal-calculator spoke wiring; Phase 3c decides exact files.
**metadata:** Self-canonical; existing spoke Article/WebApplication/FAQ/Breadcrumb/Person schema; title 50-60 characters with the primary keyword; template-rendered byline only.
**publishing:** Generated sitemap route, IndexNow after live verification.
**measurement:** GSC baseline: queries solo 401k loan calculator (2 impr, pos 37.5); no comparator; not-yet-published; no uplift forecast. Hypothesis: a computing page earns clicks the rules guide cannot for calculator-intent queries.

### MW-TL-02 — /real-estate/hard-money-loan-calculator/

**Identity**

**title:** Hard Money Loan Calculator: Points, Interest, and Total Cost
**pageType:** cost-pricing / spoke tool
**format:** calculator
**medium:** interactive tool
**register:** operator
**depthFloorWords:** 1000

**Reader and answer**

**question:** How much will a hard money loan cost me in total? [PAA 2/6 on-topic (how do hard money loans work; how do you calculate loan to cost), 4/6 off-topic: personal loan monthly cost, mortgage affordability; ac 3/16 question completions incl. how much hard money loan cost, is hard money loan interest only]
**answer:** Total cost is the points and fees at closing plus interest-only payments for every month you hold the loan (plus any extension fee), repaid with a balloon of the full balance at exit; the calculator returns each piece, the loan-to-cost and loan-to-ARV percentages and, if you enter an after-repair value, the deal's profit after financing (answer shape: figure).
**placement:** section 1 — Calculate Your Hard Money Loan Cost
**reader:** Real estate investor or flipper pricing a short-term interest-only loan.
**scope:** Reader-entered terms only.
**answerShape:** figure

**Keyword evidence**

**primary:** **phrase:** hard money loan calculator
**monthlySearches:** 1900
**kd:** 18
**source:** SEMRUSH
**confidence:** high
**autocompleteCorroborations:** 10
**supporting:** - **phrase:** hard money calculator
**monthlySearches:** 480
**kd:** 19
**source:** SEMRUSH (GSC: 1 impression at position 81)
- **phrase:** fix and flip calculator
**monthlySearches:** 390
**kd:** 6
**source:** SEMRUSH
- **phrase:** fix and flip loan calculator
**monthlySearches:** 140
**kd:** 12
**source:** SEMRUSH
- **phrase:** hard money loan interest only calculator
**monthlySearches:** 75-750 estimate
**kd:** not measured
**source:** Autocomplete band, NOT measured
**caveat:** Semrush volumes are Google Ads buckets; do not sum or present as real-time totals.
**database:** US
**researchDate:** 2026-11-14

**SERP and questions**

**exactQuery:** hard money loan calculator
**serp:** locked per advisory parser (artifact: google.com for every slot); AI Overview present; no featured snippet
**aiOverviewCites:** not itemised in the saved read (cited domains list contains google.com only)
**paa:** 2/6 on-topic
**autocomplete:** 286 rows; question completions how much hard money loan cost, is hard money loan interest only; a-z: calculator interest only, payment calculator, points
**shape:** Calculator, direct-answer block in section 1.
**paaQuestions:** - How do hard money loans work?
- How do you calculate loan to cost?
**autocompleteQuestions:** - how much hard money loan cost
- is hard money loan interest only
- what are hard money loan interest rates
- what is a hard money loan example
**offTopicPaa:** How much would a $100,000 personal loan cost per month; How much mortgage can I qualify for; Can I afford a 300k house on a $70K salary; income for a $250000 mortgage
**sectionVsFaq:** Section 1 answers total cost. FAQs: how loan to cost is calculated (engine formula), whether payments are interest only (as an input, not a claim about every lender), how points work (percent of loan, paid at closing), what an extension costs.

**Why a new page**

**coverage:** coverage_lookup: no real-estate loan-cost page. Nearest /guides/buy-a-house-with-no-money-down (zero-down mortgages), spokes cash-flow/cash-on-cash/roi (long-term mortgage return), /compare/bridge-loan-vs-heloc.
**intentGap:** Flippers and investors cannot find the total cost of a short interest-only loan (points + months of interest + fees + balloon).
**checkedCommits:** git log -S "hard money" over src is empty.
**independentDuplicateReview:** Run by the independent CHART-REVIEW stage; BUILD records M=0 same-intent matches.
**formatDecision:** Interactive: five-plus reader inputs drive every output.

**Planned outline**

- **section:** Calculate Your Hard Money Loan Cost
**purpose:** Direct answer: total cost, loan-to-cost, loan-to-ARV, profit if ARV entered. Answer block above the tool.
- **section:** How the Cost Adds Up
**purpose:** Engine-computed worked example (labelled example inputs, not market rates): points at closing + monthly interest x months + fees + extension; balloon at exit.
- **section:** Loan to Cost and Loan to ARV Explained
**purpose:** Formulas LTC = loan / (purchase + rehab) and LTARV = loan / ARV, answering the PAA question; reader enters lender terms themselves.
- **section:** What Moves the Total Most
**purpose:** Sensitivity table from the engine: months held +/-3, points +/-1, rate +/-2 points; shows time is the lever. No claim about typical lender terms.
- **section:** What the Calculator Does Not Include
**purpose:** Taxes, draw inspection fees unless entered, default interest, prepayment minimums; flip profit is pre-tax; short-term gain tax links the existing real-estate-investment-options flipping section.
- **section:** FAQ plan from observed PAA and Autocomplete
**questionsAndPurpose:** - **question:** How do you calculate loan to cost?
**purpose:** Formula plus worked engine example.
- **question:** Are hard money loans interest only?
**purpose:** Calculator assumes interest-only by default as an input; reader confirms with their lender; no universal claim.
- **question:** How much do points add to a hard money loan?
**purpose:** Points x loan amount example.
- **question:** What does an extension cost?
**purpose:** Extension fee x balance plus extra months of interest.

**Contribution and evidence**

**originalWork:** In our internal modeling the calculator turns the reader's own loan terms into total financing cost, loan-to-cost and loan-to-ARV; the page shows the formulas next to the tool.
**basis:** calculated
**legalSources:** None required for arithmetic. No market-rate, lender-term or "typical" figure is stated: no primary source exists for them, and the page tells readers to enter their lender's quoted terms. Short-term capital gain mention only links IRS Topic 409 already used on the site.
**engine:** New src/lib/hard-money-loan.ts. Fixtures: purchase 200,000, rehab 50,000, lender advances 90% of purchase and 100% of rehab, 12% APR, 2 points, 6 months, 2,500 fees -> loan 230,000; points 4,600; monthly interest 2,300; interest 13,800; cost 20,900; balloon 230,000; LTC 92%; extension and ARV cases; zero-rate and zero-points boundaries. Engine, not the writer, supplies every number.
**visibleAttribution:** Our modeling named beside the first worked example; example inputs labelled as examples, not typical rates.
**limits:** No claim about what lenders charge; no advice to borrow; not a loan offer.
**writerGuards:** No boilerplate paragraphs shared with the bridge loan page; at least 1,000 reader-facing body words from its own outputs (LTC, LTARV, flip profit).

**Tables, tools or visuals**

**tool:** Calculator island from the new engine; outputs: loan amount, cash to close, monthly interest-only payment, points, total financing cost, payoff at exit, loan-to-cost, loan-to-ARV, simple annualized cost (labelled simple, not IRR), net profit before tax if ARV entered. Rehab draw toggle (funded at closing vs drawn evenly) changes interest base and is labelled.
**staticAnswer:** Section 1 answer block and the worked example table are readable without interaction.
**boundaries:** Zero points, zero rate, rehab 0, ARV blank, extension months 0, loan advance 100%.

**Testing and review**

**presentation:** Ordinary calculator page; no product test; no TESTED format (financial service exclusion).
**review:** Independent Phase 4 audit with engine replay; financial claims at the site floor.
**labels:** basis calculated; no tested/reviewed-by claim.

**Planned takeaway**

**intent:** Cost is points plus months of interest plus fees, so time held is the lever; run your own terms before comparing offers.
**placement:** Short takeaway after the sensitivity section.
**limitations:** Lender terms vary and are not asserted; profit is pre-tax; the tool does not judge whether a deal is good.

**Inbound internal links**

**required:** 3
**placements:** - **source:** /guides/real-estate-investment-options/
**target:** /real-estate/hard-money-loan-calculator/
**section:** Option 3: Flipping houses
**anchor:** hard money loan calculator
**purpose:** The flipping section discusses margins and taxes but not financing cost; the tool prices it.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1
- **source:** /compare/bridge-loan-vs-heloc/
**target:** /real-estate/hard-money-loan-calculator/
**section:** The Cost Comparison Over a Realistic 6- to 12-Month Hold
**anchor:** calculator for short-term interest-only loans
**purpose:** Short-hold cost readers can price a different short-term loan.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1
- **source:** /real-estate/cash-on-cash-return-calculator/
**target:** /real-estate/hard-money-loan-calculator/
**section:** Common mistakes
**anchor:** short-term loan cost calculator
**purpose:** The mistakes list warns about financed amounts; the tool covers a short-term loan whose cost is not a mortgage payment.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1

**Outbound internal links**

**placements:** - **source:** /real-estate/hard-money-loan-calculator/
**target:** /guides/real-estate-investment-options/
**section:** What the Calculator Does Not Include
**anchor:** flipping houses and its tax trap
**purpose:** Taxes on flip profit are covered there.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1
- **source:** /real-estate/hard-money-loan-calculator/
**target:** /compare/bridge-loan-vs-heloc/
**section:** What the Calculator Does Not Include
**anchor:** bridge loan vs HELOC
**purpose:** Readers choosing a different short-term financing route.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1

**Technical and measurement scope**

**route:** /real-estate/hard-money-loan-calculator/
**implementation:** New spoke in src/data/spokes-real-estate.ts (or its own calculator registry entry decided in Phase 3c) with new tool component and src/lib engine; mirror existing spoke wiring.
**metadata:** Self-canonical; spoke schema pattern; title 50-60 characters with primary keyword.
**publishing:** Generated sitemap route; IndexNow after live verification.
**measurement:** GSC baseline: hard money calculator (1 impr, pos 81); not-yet-published; no uplift forecast.

### MW-TL-03 — /real-estate/bridge-loan-calculator/

**Identity**

**title:** Bridge Loan Calculator: Cost, Overlap Payments, Net Proceeds
**pageType:** cost-pricing / spoke tool
**format:** calculator
**medium:** interactive tool
**register:** operator
**depthFloorWords:** 1000

**Reader and answer**

**question:** How much will a bridge loan cost me until my old home sells? [PAA 2/6 adjacent (does a bridge loan cost more; how do you calculate loan to cost), 4/6 off-topic: construction loan payment, 20% down payment, mortgage qualification; ac 3/16 question completions incl. how much bridge loan can i get, how much bridge loan cost]
**answer:** The cost is the bridge loan's fees plus its interest for every month until the old home sells, on top of carrying both homes; the calculator returns the bridge cost, the monthly overlap outlay and the net proceeds you keep after the old mortgage, the bridge loan and selling costs (answer shape: figure).
**placement:** section 1 — Calculate Your Bridge Loan Cost
**reader:** Homeowner buying before selling.
**scope:** Reader-entered terms only.
**answerShape:** figure

**Keyword evidence**

**primary:** **phrase:** bridge loan calculator
**monthlySearches:** 1600
**kd:** 18
**source:** SEMRUSH
**confidence:** high
**autocompleteCorroborations:** 10
**supporting:** - **phrase:** bridge loan
**monthlySearches:** head, not measured in this run
**kd:** not measured
**source:** Autocomplete sweep only (307 rows)
- **phrase:** how much bridge loan cost
**monthlySearches:** autocomplete question completion
**kd:** not measured
**source:** Google Autocomplete, NOT measured
**caveat:** Semrush volumes are Google Ads buckets; do not sum or present as real-time totals.
**database:** US
**researchDate:** 2026-11-14

**SERP and questions**

**exactQuery:** bridge loan calculator
**serp:** locked per advisory parser (artifact); AI Overview present
**aiOverviewCites:** not itemised (google.com only in saved read)
**paa:** 2/6 adjacent
**autocomplete:** bridge loan sweep 307 rows; questions how much bridge loan can i get, how much bridge loan cost, how do bridge loans work when buying a house
**shape:** Calculator, direct-answer block section 1.
**paaQuestions:** - Does a bridge loan cost more?
- How do you calculate loan to cost?
**autocompleteQuestions:** - how much bridge loan cost
- how much bridge loan can i get
- how long bridge loan
- how do bridge loans work when buying a house
**offTopicPaa:** How much would a $20,000 loan cost per month; monthly payment on a $300,000 construction loan; 20% down payment on $300,000; are construction loans hard to get
**sectionVsFaq:** Section 1 answers the cost. FAQs: does a bridge loan cost more (links the existing comparison), how long, how much can I get (lender limit entered by reader).

**Why a new page**

**coverage:** coverage_lookup: /compare/bridge-loan-vs-heloc is the only bridge-loan page (a choice between products). No calculator.
**intentGap:** The homeowner cannot compute overlap cost and net proceeds.
**checkedCommits:** git log -S "bridge loan calculator" empty.
**independentDuplicateReview:** Run by the independent CHART-REVIEW stage; BUILD records M=0 same-intent matches (comparison page has a different reader goal).
**formatDecision:** Interactive: months to sell and fees dominate the answer.

**Planned outline**

- **section:** Calculate Your Bridge Loan Cost
**purpose:** Direct answer: bridge cost, monthly overlap outlay, net proceeds.
- **section:** What a Bridge Loan Costs Month by Month
**purpose:** Engine worked example with labelled example inputs: fees plus interest for 3, 6, 9 months; overlap with the new mortgage and old carrying costs.
- **section:** How Much You Can Borrow
**purpose:** Reader enters their lender's maximum combined loan-to-value; the tool computes the resulting amount; no universal limit stated.
- **section:** When the Old Home Sells Late
**purpose:** Sensitivity on months held; links /compare/bridge-loan-vs-heloc for choosing between the products.
- **section:** What the Calculator Does Not Include
**purpose:** Closing costs on the new home, taxes on sale, prepayment terms, lender-specific rules.
- **section:** FAQ plan from observed PAA and Autocomplete
**questionsAndPurpose:** - **question:** Does a bridge loan cost more?
**purpose:** Compare with a mortgage by computing both costs from entered rates; link the comparison.
- **question:** How much bridge loan can I get?
**purpose:** Combined-LTV input explained; lender sets it.
- **question:** How long does a bridge loan last?
**purpose:** Term is the reader's input; page asserts no standard term.

**Contribution and evidence**

**originalWork:** In our internal modeling the calculator totals bridge fees, interest and overlap carrying cost for the months the reader expects to hold both homes.
**basis:** calculated
**legalSources:** None required for arithmetic; no lender-term or rate claims; reuse only facts already published in /compare/bridge-loan-vs-heloc if cited.
**engine:** New src/lib/bridge-loan.ts. Fixtures: sale 400,000; old mortgage payoff 200,000; bridge 100,000 at 10% APR; 2% fee; 6 months -> interest 5,000, fee 2,000, bridge cost 7,000; selling costs 6% of 400,000 = 24,000; net proceeds = 400,000 - 200,000 - 100,000 - 7,000 - 24,000 = 69,000 (the page states this settlement convention); boundaries: months 0, fee 0, bridge 0, payoff above price.
**visibleAttribution:** Our modeling named beside the worked example.
**limits:** No rate/term/LTV claims; not a loan offer.
**writerGuards:** No boilerplate shared with the hard money page; at least 1,000 words from its own outputs; FAQ Does a bridge loan cost more is answered only as a computed, input-labelled comparison with no universal claim; how much and how long FAQs state no standard LTV or term.

**Tables, tools or visuals**

**tool:** Calculator island from the new engine; outputs: bridge interest and fees, total bridge cost, monthly overlap outlay, net proceeds from old home, break-even months against an optional alternative cost per month (reader entered).
**staticAnswer:** Answer block and worked example table readable without interaction.
**boundaries:** Months 0, bridge 0, fees 0, payoff above sale price (negative proceeds flagged).

**Testing and review**

**presentation:** Ordinary calculator page; no tested label.
**review:** Independent Phase 4 audit with engine replay.
**labels:** basis calculated.

**Planned takeaway**

**intent:** Bridge cost scales with months to sell, so price your own timeline before committing; compare against alternatives on the existing comparison page.
**placement:** Short takeaway after the late-sale section.
**limitations:** Lender terms vary and are not asserted.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /compare/bridge-loan-vs-heloc/
**target:** /real-estate/bridge-loan-calculator/
**section:** How a Bridge Loan Works for a Home Purchase
**anchor:** bridge loan calculator
**purpose:** Readers learning how it works can price their own timeline.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1
- **source:** /compare/bridge-loan-vs-heloc/
**target:** /real-estate/bridge-loan-calculator/
**section:** The Cost Comparison Over a Realistic 6- to 12-Month Hold
**anchor:** calculate your own bridge loan cost
**purpose:** The comparison uses a fixed hold period; the tool lets the reader change it.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1

**Outbound internal links**

**placements:** - **source:** /real-estate/bridge-loan-calculator/
**target:** /compare/bridge-loan-vs-heloc/
**section:** When the Old Home Sells Late
**anchor:** bridge loan vs HELOC
**purpose:** Choosing between the products.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1
- **source:** /real-estate/bridge-loan-calculator/
**target:** /real-estate/hard-money-loan-calculator/
**section:** What the Calculator Does Not Include
**anchor:** hard money loan calculator
**purpose:** Investors financing a purchase with a different short-term loan.
**inspection:** **path:** reports/mindmap-pass/2026-11-14-trend-lane-c-run/research/site-inspection.json
**sha256:** 85f3bf69c80102b47351bad08b7752eb3e03242ec3f6a08ebc34f51f0d1f89e1

**Technical and measurement scope**

**route:** /real-estate/bridge-loan-calculator/
**implementation:** New spoke and engine mirroring the TL-02 wiring; Phase 3c decides shared helpers vs separate files.
**metadata:** Self-canonical; spoke schema pattern; title 50-60 characters.
**publishing:** Generated sitemap route; IndexNow after live verification.
**measurement:** No GSC baseline for this query (not in top-20); not-yet-published; no uplift forecast.

## Execution plan

1. Advisory cannibalization check among the three new calculator routes and the 401(k) guide; no consolidation edits.
2. Skipped: no metadata rows (trend-pass override).
3. Build engines first and compute fixtures, then Phase 3c builds three calculator islands and spoke entries; content_gen.py writes the framing prose from closed fact lists and statute extracts; run deterministic case lookup (mindmap-gates cases-batch) before writing.
4. Independent audit of the three pages and the TL-04 section: engine replay, statute claims against research/statute-extracts.md, no market-rate claims, rendered output, within the shared review budget.
5. Add the Solo 401(k) section as section 2 of /guides/401k-loan-rules/ plus 2 FAQs and the tools-list link, additive only, bumping the rendered updated date.
6. Add inbound links per the inspected placements (3 for 401k loan calculator, 3 for hard money, 2 for bridge) and outbound links from each new page.
7. Add the three routes to the sitemap with today lastmod, refresh lastmod on /guides/401k-loan-rules/, prepare the IndexNow list.
8. Print the run summary including HELD ledger rows and the duplicate-check line.
9. Commit only this run's files, land per the checked-in land flow, verify exact live canonical output for all four routes, submit verified live URLs to IndexNow.

Publication scope: commit: True, push: True, liveVerification: True, indexNow: True

## Preparation check

| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-14-trend-lane-c-run/readiness.md) |

Approve this plan to start the listed content work?
