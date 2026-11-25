---
mindmap_pass_date: 2026-11-25
source: "reports/mindmap-pass/2026-11-25-autocomplete-run/brief.txt"
interpreted_brief: "Unattended Autocomplete pass for themodernwallet.com: 1,570 live Google completions from five calculator seeds (mortgage, compound interest, 401k, debt payoff, social security). Most completions are already served by the site's 237+ calculators and guides; the run keeps only genuine gaps: a multi-debt payoff tool, a 401k paycheck-impact tool, a compound-interest spreadsheet guide, a property-tax-by-state mortgage guide, and body gaps on the 401k calculator. Social Security completions are deferred because ssa.gov blocks primary-source access."
status: pending-chart-review
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lens 1/2: 'debt payoff calculator' cluster, 181 completions + 65 template/planner variants (avalanche, snowball, multiple loans/cards, extra payments, biweekly, lump sum, how long, payoff date). Source: estimate (autocomplete) NOT measured. lookup: /credit-card-payoff/ - single-card payoff only; /compare/debt-snowball-vs-avalanche - explainer without inputs; no multi-debt tool. | Create /debt-payoff-calculator/ [interactive tool]: enter several debts (balance, APR, minimum), extra monthly payment and optional lump sum; compare avalanche, snowball and minimums-only payoff date, interest and order. | create new content | /debt-payoff-calculator/ | interactive tool - inputs change payoff order and total interest | interactive tool | interactive tool | unread (no DataForSEO key) | SERP not read: DATAFORSEO_B64 absent in this run; demand rests on Autocomplete completions only | How long will it take to pay off all my debts and which one should I pay first? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 181/294 debt completions are payoff-method or schedule questions] | One result table showing payoff date and total interest for avalanche vs snowball vs minimums-only, with the payoff order (mechanism: pay minimums on all, send the extra to the target debt, roll freed payments). | section 1: the calculator and its three-strategy result | A1 |
| lens 1/2: '401k calculator paycheck / take home / per paycheck / net pay / deduction / hourly / overtime' 13 completions. Source: estimate (autocomplete) NOT measured. lookup: /retirement/401k-calculator/ projects balance only; no take-home view. | Create /retirement/401k-paycheck-calculator/ [interactive tool]: gross pay, pay frequency, filing status and contribution % (or dollars) produce per-paycheck pre-tax contribution, estimated federal income tax saved, take-home change and 2026 annual limit check. | create new content | /retirement/401k-paycheck-calculator/ | calculator - inputs change take-home cost of contributing | interactive tool | interactive tool | unread (no DataForSEO key) | SERP not read: no DataForSEO key; Autocomplete only | How much will my paycheck drop if I put X% into my 401(k)? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 13/304 completions ask paycheck/take-home impact] | A pre-tax contribution lowers take-home by less than the contribution because it also cuts federal income tax at the marginal rate; the tool shows the exact per-paycheck figures (figure shape). | section 1: the calculator with its per-paycheck result | A2 |
| lens 1/2: 'compound interest calculator excel / google sheets / formula / spreadsheet / template' 28 completions. Source: estimate (autocomplete) NOT measured. lookup: /investing/compound-interest-calculator/ is a web tool; no spreadsheet formula page (/guides/how-is-savings-account-interest-calculated/ covers savings interest only). | Create /guides/compound-interest-formula-excel-google-sheets/ [article with copy-paste formulas and a worked table]: A=P(1+r/n)^(nt), FV() with and without monthly deposits, daily/monthly/yearly compounding differences. | create new content | /guides/compound-interest-formula-excel-google-sheets/ | article - mechanism with copy-paste formulas | text | text | unread (no DataForSEO key) | SERP not read: no DataForSEO key; Autocomplete only | How do I calculate compound interest in Excel or Google Sheets? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 28/313 completions are excel/sheets/formula how-tos] | Use =FV(rate/n, n*years, -monthly deposit, -principal) or =P*(1+r/n)^(n*t); the page gives both with verified outputs (mechanism). | section 1: How to Calculate Compound Interest in Excel and Google Sheets | A3 |
| lens 1/2: 'mortgage calculator <state> / with taxes and insurance / property tax / escrow' 90 completions across ~45 states. Source: estimate (autocomplete) NOT measured. lookup: /mortgage/piti-calculator generic; no state property-tax comparison. | Create /guides/property-tax-by-state-mortgage-payment/ [article + state table]: effective property-tax rate by state (Tax Foundation, ACS 2024) converted to monthly escrow on a stated home price, added to principal and interest. | create new content | /guides/property-tax-by-state-mortgage-payment/ | comparison table/database - 50 states | text | text | unread (no DataForSEO key) | SERP not read: no DataForSEO key; Autocomplete only | How much do property taxes add to my monthly mortgage payment in my state? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 90/334 mortgage completions name a state or taxes and insurance] | Property tax adds roughly (effective rate x home price)/12 to principal and interest, from about $100/month in Hawaii to over $700 in New Jersey on a $400,000 home; table gives each state (figure shape). | section 1: state table of monthly property tax on a $400,000 home | A4 |
| lens 2: '401k calculator if i stop contributing / adjusted for inflation / no match / how long will it last / increasing contributions' 21 completions. Source: estimate (autocomplete) NOT measured. lookup: /retirement/401k-calculator/ body covers projection and market drops only. | Add targeted sections to /retirement/401k-calculator/ (additive only): what happens if you stop contributing, inflation-adjusted balance, and contributing without a match, using the calculator's own formula. | update existing body text | /retirement/401k-calculator/ | article section | text | text | unread (no DataForSEO key) | SERP not read: no DataForSEO key; Autocomplete only | What happens to my 401(k) projection if I stop contributing or adjust for inflation? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 21/304 completions ask these variants] | Stopping contributions at a given age freezes deposits while growth continues; the new section shows the balance with and without contributions and in today's dollars (verdict with break-even). | section 2: What Happens If You Stop Contributing | A5 |

## Original request and acceptance

Turn real Autocomplete demand into net-new or enriched pages only where the site has no page answering the reader's question, with primary-source support.

- **id:** REQ-1
**description:** Account for every one of the 1,570 Autocomplete completions with a disposition (page, covered, deferred or excluded) under its candidate ID.
**acceptance:** candidate-dispositions.csv lists all 1,570 IDs; mapped IDs point to an action row; covered IDs name the existing route.
**actionIds:** - A1
- A2
- A3
- A4
- A5
- **id:** REQ-2
**description:** Create net-new pages only where coverage lookup shows no existing page with the same reader intent.
**acceptance:** Each new page brief names the closest existing routes and why they do not answer the question; rendered pages contain a working answer in section 1 or 2.
**actionIds:** - A1
- A2
- A3
- A4
- **id:** REQ-3
**description:** Enrich the existing 401(k) calculator page where completions reveal body gaps (stop contributing, inflation-adjusted, no match) without rewriting it.
**acceptance:** Targeted new sections added to /retirement/401k-calculator/ with modeled figures and existing content untouched.
**actionIds:** - A5

### Presentation — A1

**medium:** interactive tool
**placement:** Calculator above the fold, strategy comparison and worked example below
**reason:** Reader inputs (balances, APRs, extra payment) change which strategy wins and the payoff date
**readerInputs:** - Debt balances
- APRs
- Minimum payments
- Extra monthly payment
- Lump sum
**interaction:** **decision:** build
**reason:** Order and interest depend on the reader's own balances and rates; a static table cannot show them
**animation:** **decision:** use
**reason:** Month-by-month balance bars show how payoff order changes when the extra payment rolls over

### Presentation — A2

**medium:** interactive tool
**placement:** Calculator first, worked $75,000 example below
**reason:** Take-home impact depends on salary, frequency, filing status and contribution rate
**readerInputs:** - Gross pay
- Pay frequency
- Filing status
- Contribution %
- Employer match %
**interaction:** **decision:** build
**reason:** Result is a function of the reader's own salary and rate
**animation:** **decision:** not-useful
**reason:** Static layout answers faster; no sequence to animate

### Presentation — A3

**medium:** text
**placement:** Formulas and worked example in section 1
**reason:** Readers want paste-ready formulas and checkable outputs, not another widget
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** Static formulas and a result table answer it; the existing calculator is linked for reader-specific inputs
**animation:** **decision:** not-useful
**reason:** Static layout answers faster; no sequence to animate

### Presentation — A4

**medium:** text
**placement:** Sortable 50-state table in section 1
**reason:** A finite 50-row comparison answers the question; the reader's own price is handled by the linked PITI calculator
**readerInputs:** - State
**interaction:** **decision:** not-useful
**reason:** A finite 50-row table covers the state variable; the PITI calculator is linked for a reader price
**animation:** **decision:** not-useful
**reason:** Static layout answers faster; no sequence to animate

### Presentation — A5

**medium:** text
**placement:** After the opening explanation, as a new section
**reason:** A finite scenario table answers it; the existing calculator already accepts the inputs
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A finite scenario table answers it; the existing calculator above already accepts the inputs
**animation:** **decision:** not-useful
**reason:** Static layout answers faster; no sequence to animate

## Emerging search patterns (clusters)

- Debt payoff (multi-debt, avalanche/snowball, extra payment, lump sum, biweekly): 246 completions; no multi-debt tool; lever create new content /debt-payoff-calculator/ [interactive tool]; source estimate (autocomplete) NOT measured
- 401k paycheck/take-home impact: 13 completions; lever create new content /retirement/401k-paycheck-calculator/ [calculator]
- Compound interest spreadsheet formulas (Excel/Google Sheets): 28 completions; lever create new content /guides/compound-interest-formula-excel-google-sheets/ [article]
- Mortgage property tax and escrow by state: 90 completions; lever create new content /guides/property-tax-by-state-mortgage-payment/ [comparison table/database]
- 401k scenario variants (stop contributing, inflation-adjusted, no match): 21 completions; lever update existing body text /retirement/401k-calculator/

## Exclusions

- Social Security cluster (280 deferred completions: benefit formula/AIME/PIA, earnings test, spousal and divorced benefits, claiming age): DEFERRED - ssa.gov returned HTTP 403 Access Denied to curl and WebFetch on every path, so central claims (bend points, earnings-test limits) cannot be primary-sourced. Revisit when reachable. COLA, taxable benefits and 62-vs-70 completions are covered by /social-security-cola-calculator/, /social-security-taxable-benefits-calculator/, /social-security-break-even-calculator/, /compare/social-security-at-62-vs-70/.
- 659 covered completions: existing mortgage spokes, compound-interest/investing tools, 401k loan/early-withdrawal/RMD/Roth tools, /guides/pay-off-debt-or-invest/, /credit-card-payoff/ (see candidate-dispositions.csv for each ID).
- 145 non-US completions (UK, Canada, India, Australia, etc.) excluded: US-only site. 88 alphabet-sweep/brand noise completions excluded (games, unrelated brands).
- 65 debt payoff spreadsheet/planner/printable completions folded into A1 FAQ; standalone planner-app roundup excluded (would need vendor pricing sources and tested claims not permitted for financial tools).
- mortgage DSCR/USDA/jumbo/land/mobile-home variants: single completions, covered by PITI/commercial pages or insufficient evidence; no new page.
- Keyword volume/KD/SERP unavailable (no SEMRUSH/DataForSEO keys): demand is estimate (autocomplete), NOT measured.

## New-page briefs

### A1 — /debt-payoff-calculator/

**Identity**

**title:** Debt Payoff Calculator: Snowball vs Avalanche
**pageType:** calculator
**format:** interactive tool - inputs change payoff order and total interest
**medium:** interactive tool

**Reader and answer**

**question:** How long will it take to pay off all my debts and which one should I pay first? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 181/294 debt completions are payoff-method or schedule questions]
**answer:** One result table showing payoff date and total interest for avalanche vs snowball vs minimums-only, with the payoff order (mechanism: pay minimums on all, send the extra to the target debt, roll freed payments).
**placement:** section 1: the calculator and its three-strategy result

**Keyword evidence**

Primary 'debt payoff calculator (181 mapped completions: multiple loans, extra payments, biweekly, lump sum, how long)' and supporting phrases from the Autocomplete CSVs (candidate IDs in candidate-dispositions.csv). Source: estimate (autocomplete) NOT measured; no SEMRUSH/DataForSEO key in this run (checked 2026-11-25). Country/database: US.

**SERP and questions**

SERP/PAA not read (no DataForSEO key), recorded as unread. Autocomplete question completions are the only question evidence; FAQ drawn from them. Limit: competitiveness unknown; ordering by completion count only.

**Why a new page**

Closest routes: /credit-card-payoff/ (one card), /compare/debt-snowball-vs-avalanche/ (explainer, no inputs), /guides/pay-off-debt-or-invest/ (different decision), /guides/how-to-pay-off-debt/. None lets a reader enter several debts. Coverage lookup 2026-11-25; no commits touch /debt-payoff-calculator/. Independent duplicate review at CHART-REVIEW.

**Planned outline**

- **heading:** Debt Payoff Calculator
**purpose:** Tool with debt rows, extra payment and lump sum; three-strategy result in section 1
- **heading:** Snowball vs Avalanche on Your Numbers
**purpose:** Result table: payoff date, total interest, order; explains the gap
- **heading:** How the Calculator Works
**purpose:** Monthly interest then payment allocation, rollover rule, minimum floors
- **heading:** Worked Example: Three Debts and $200 Extra
**purpose:** Fixed example with figures the tool reproduces
- **heading:** Debt Payoff Calculator FAQs
**purpose:** Completions-derived questions: how long, biweekly, lump sum, spreadsheet

**Contribution and evidence**

Decision gap: existing pages explain avalanche vs snowball but cannot compute it. Evidence basis: calculated (deterministic simulation run in Python for the worked example, saved with outputs). Method sources: CFPB 'How to reduce your debt' (highest-rate and snowball methods) saved verbatim 2026-11-25. Counterexample: when APRs are equal, strategies tie; tool states it.

**Tables, tools or visuals**

Inputs: up to 10 debts (balance, APR, minimum), extra monthly amount, lump sum. Output: per-strategy payoff months, interest, order, balance chart. Constants none; formula monthly rate=APR/12 on declining balance. Static worked example readable without interaction. Chart reduced-motion safe.

**Testing and review**

Site section G excludes legal/financial services: no TESTED label, no 'we tested'. Evidence basis calculated: attribution reads 'In our internal modeling, we ...' with inputs named. HIGH factual profile for tax figures; no professional review required (general information). Publisher's Take generated at WRITE via reviewer-voice-profile.

**Planned takeaway**

Avalanche minimizes interest when APRs differ; snowball costs more but gives faster early wins; with equal rates or one dominant balance the choice barely matters. Applies to unsecured/installment debts you can prepay without penalty; would change if a debt has a prepayment penalty or a promotional 0% rate.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /credit-card-payoff/
**target:** /debt-payoff-calculator/
**section:** How it works (closing paragraph)
**anchor:** debt payoff calculator for several balances
**purpose:** Reader with more than one card moves to the multi-debt tool
**inspection:** **path:** src/data/calculators.ts
**sha256:** bf981cefd061214c90b926f5beb17a1c4e1ed166d173801c05f7420a5c19fb42
- **source:** /compare/debt-snowball-vs-avalanche/
**target:** /debt-payoff-calculator/
**section:** Which should you choose
**anchor:** run snowball and avalanche on your own debts
**purpose:** Turns the explainer into a computation
**inspection:** **path:** src/data/comparisons.ts
**sha256:** be7415388253184efffdac7f9c0ac1c8695786beef52dfad991fa231b17a3eb0

**Outbound internal links**

**placements:** - **source:** /debt-payoff-calculator/
**target:** /guides/pay-off-debt-or-invest/
**section:** FAQ
**anchor:** pay off debt or invest
**purpose:** Next decision once a payoff plan exists
**inspection:** **path:** src/data/guides.ts
**sha256:** c5be292d100c82cf37393826982c55207d01bd93b9257438aa3f970aff038f76
- **source:** /debt-payoff-calculator/
**target:** /credit-card-payoff/
**section:** How the Calculator Works
**anchor:** credit card payoff calculator
**purpose:** Single-card detail and minimum-payment path
**inspection:** **path:** src/data/calculators.ts
**sha256:** bf981cefd061214c90b926f5beb17a1c4e1ed166d173801c05f7420a5c19fb42

**Technical and measurement scope**

Reuse existing spoke/tool template, canonical self-reference, sitemap entry with today's lastmod, IndexNow after live 200. Measurement: growth.json registers hypothesis (new query family from Autocomplete) with baseline not-yet-published; no uplift claimed. GSC data unavailable in this run. Wire as top-level calculator in calculators.ts + island registration (Phase 3c).

### A2 — /retirement/401k-paycheck-calculator/

**Identity**

**title:** 401(k) Paycheck Calculator: Take-Home Impact
**pageType:** calculator
**format:** calculator - inputs change take-home cost of contributing
**medium:** interactive tool

**Reader and answer**

**question:** How much will my paycheck drop if I put X% into my 401(k)? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 13/304 completions ask paycheck/take-home impact]
**answer:** A pre-tax contribution lowers take-home by less than the contribution because it also cuts federal income tax at the marginal rate; the tool shows the exact per-paycheck figures (figure shape).
**placement:** section 1: the calculator with its per-paycheck result

**Keyword evidence**

Primary '401k paycheck calculator (13 mapped completions: paycheck, take home, per paycheck, net pay, hourly, overtime)' and supporting phrases from the Autocomplete CSVs (candidate IDs in candidate-dispositions.csv). Source: estimate (autocomplete) NOT measured; no SEMRUSH/DataForSEO key in this run (checked 2026-11-25). Country/database: US.

**SERP and questions**

SERP/PAA not read (no DataForSEO key), recorded as unread. Autocomplete question completions are the only question evidence; FAQ drawn from them. Limit: competitiveness unknown; ordering by completion count only.

**Why a new page**

Closest routes: /retirement/401k-calculator/ (balance projection only), /roth-vs-traditional-401k-calculator/ (tax treatment comparison), /guides/401k-contribution-limits-2026/ (limits). None shows per-paycheck take-home. Coverage lookup 2026-11-25; no prior commits touch the route.

**Planned outline**

- **heading:** 401(k) Paycheck Calculator
**purpose:** Inputs and per-paycheck result in section 1
- **heading:** What Your Contribution Really Costs You
**purpose:** Take-home drop vs contribution after federal tax savings
- **heading:** How the Estimate Works
**purpose:** Marginal bracket method, FICA unchanged, limits
- **heading:** Worked Example: $75,000 Salary, 6% Contribution
**purpose:** Figures reproduced by tool
- **heading:** 401(k) Paycheck FAQs
**purpose:** Hourly/overtime, bonus, Roth effect, match

**Contribution and evidence**

Decision gap: readers see projected balance but not what contributing costs per paycheck. Basis: calculated using 2026 federal brackets/standard deduction and 401(k) limit saved from IRS 2026 adjustments and contribution-limit pages (2026-11-25). Limitations: federal income tax only (no state, no withholding-table exact match), pre-tax traditional contributions; counterexample: low earners in the 10% bracket save little tax. Roth contributions do not reduce take-home tax.

**Tables, tools or visuals**

Inputs: gross pay, frequency, filing status, contribution % or $, match %. Output: contribution per paycheck, tax saved, net take-home change, year-to-date limit check ($24,500 for 2026 per IRS). Sourced constants from IRS pages above.

**Testing and review**

Site section G excludes legal/financial services: no TESTED label, no 'we tested'. Evidence basis calculated: attribution reads 'In our internal modeling, we ...' with inputs named. HIGH factual profile for tax figures; no professional review required (general information). Publisher's Take generated at WRITE via reviewer-voice-profile.

**Planned takeaway**

Contributing pre-tax lowers take-home by roughly contribution x (1 - marginal rate); for a single filer at 22% a $100 contribution costs about $78. Applies to traditional pre-tax deferrals; would change for Roth deferrals, state taxes, or if you already hit the annual limit.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /retirement/401k-calculator/
**target:** /retirement/401k-paycheck-calculator/
**section:** How it's calculated
**anchor:** 401(k) paycheck calculator
**purpose:** Reader checks what the contribution costs per paycheck
**inspection:** **path:** src/data/spokes-retirement.ts
**sha256:** 89be1455c786120041fb8a7db87186e68aace334504555ac416e18be7c063cc4
- **source:** /roth-vs-traditional-401k-calculator/
**target:** /retirement/401k-paycheck-calculator/
**section:** Related tools
**anchor:** see your take-home change
**purpose:** Pre-tax vs Roth take-home effect
**inspection:** **path:** src/data/cross-links.ts
**sha256:** 055870fed6734a392dc6cc1bc6e66ea35579c0b910b8af034a042ee552924ce5

**Outbound internal links**

**placements:** - **source:** /retirement/401k-paycheck-calculator/
**target:** /retirement/401k-calculator/
**section:** Worked example
**anchor:** 401(k) calculator
**purpose:** Project the balance the contribution builds
**inspection:** **path:** src/data/spokes-retirement.ts
**sha256:** 89be1455c786120041fb8a7db87186e68aace334504555ac416e18be7c063cc4
- **source:** /retirement/401k-paycheck-calculator/
**target:** /guides/401k-contribution-limits-2026/
**section:** How the estimate works
**anchor:** 2026 401(k) contribution limits
**purpose:** Limit source
**inspection:** **path:** src/data/guides.ts
**sha256:** c5be292d100c82cf37393826982c55207d01bd93b9257438aa3f970aff038f76

**Technical and measurement scope**

Reuse existing spoke/tool template, canonical self-reference, sitemap entry with today's lastmod, IndexNow after live 200. Measurement: growth.json registers hypothesis (new query family from Autocomplete) with baseline not-yet-published; no uplift claimed. GSC data unavailable in this run. Spoke under retirement hub in spokes-retirement.ts with island.

### A3 — /guides/compound-interest-formula-excel-google-sheets/

**Identity**

**title:** Compound Interest Formula in Excel and Google Sheets
**pageType:** guide
**format:** article - mechanism with copy-paste formulas
**medium:** text

**Reader and answer**

**question:** How do I calculate compound interest in Excel or Google Sheets? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 28/313 completions are excel/sheets/formula how-tos]
**answer:** Use =FV(rate/n, n*years, -monthly deposit, -principal) or =P*(1+r/n)^(n*t); the page gives both with verified outputs (mechanism).
**placement:** section 1: How to Calculate Compound Interest in Excel and Google Sheets

**Keyword evidence**

Primary 'compound interest calculator excel / google sheets / formula (28 mapped completions)' and supporting phrases from the Autocomplete CSVs (candidate IDs in candidate-dispositions.csv). Source: estimate (autocomplete) NOT measured; no SEMRUSH/DataForSEO key in this run (checked 2026-11-25). Country/database: US.

**SERP and questions**

SERP/PAA not read (no DataForSEO key), recorded as unread. Autocomplete question completions are the only question evidence; FAQ drawn from them. Limit: competitiveness unknown; ordering by completion count only.

**Why a new page**

Closest routes: /investing/compound-interest-calculator/ (web tool), /guides/how-is-savings-account-interest-calculated/ (savings APY), /guides/retirement-calculator-spreadsheet-template/ (retirement only). None gives compound-interest spreadsheet formulas. No commits touch the route.

**Planned outline**

- **heading:** How to Calculate Compound Interest in Excel and Google Sheets
**purpose:** Answer: two formulas with output
- **heading:** The Compound Interest Formula Step by Step
**purpose:** A=P(1+r/n)^(nt) with a worked $10,000 example
- **heading:** Adding Monthly Contributions With FV
**purpose:** FV syntax from Microsoft documentation; sign convention
- **heading:** Daily, Monthly and Yearly Compounding Compared
**purpose:** Table of results for one balance
- **heading:** Common Spreadsheet Mistakes
**purpose:** Rate/period mismatch, sign errors
- **heading:** Compound Interest Spreadsheet FAQs
**purpose:** Completions-derived questions

**Contribution and evidence**

Decision gap: readers want paste-ready, correct formulas. Basis: calculated; formulas executed in Python and results saved; syntax cited to Microsoft Support FV function page saved 2026-11-25. Google Sheets FV uses the same arguments (verify in WRITE with a second saved source). Counterexample: sign errors give negative results.

**Tables, tools or visuals**

Table: compounding frequency vs ending balance; formula block table (cell, formula, result). No widget; link to existing calculator.

**Testing and review**

Site section G excludes legal/financial services: no TESTED label, no 'we tested'. Evidence basis calculated: attribution reads 'In our internal modeling, we ...' with inputs named. HIGH factual profile for tax figures; no professional review required (general information). Publisher's Take generated at WRITE via reviewer-voice-profile.

**Planned takeaway**

Use =FV(rate/periods, periods*years, -payment, -principal) for deposits or =P*(1+r/n)^(n*t) for a lump sum; results match the web calculator. Applies to fixed-rate compounding; changes for variable rates or taxes.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /investing/compound-interest-calculator/
**target:** /guides/compound-interest-formula-excel-google-sheets/
**section:** How it works
**anchor:** compound interest formula for Excel and Google Sheets
**purpose:** Reader wanting the spreadsheet version
**inspection:** **path:** src/data/spokes-investing.ts
**sha256:** 4e385bb2f5d652542163ce6df015c804221e24eb02d76dd2ad89d402d66ee480
- **source:** /guides/retirement-calculator-spreadsheet-template/
**target:** /guides/compound-interest-formula-excel-google-sheets/
**section:** Related guides
**anchor:** compound interest spreadsheet formulas
**purpose:** Sibling spreadsheet guide
**inspection:** **path:** src/data/guides.ts
**sha256:** c5be292d100c82cf37393826982c55207d01bd93b9257438aa3f970aff038f76

**Outbound internal links**

**placements:** - **source:** /guides/compound-interest-formula-excel-google-sheets/
**target:** /investing/compound-interest-calculator/
**section:** Opening answer
**anchor:** compound interest calculator
**purpose:** Reader-specific inputs
**inspection:** **path:** src/data/spokes-investing.ts
**sha256:** 4e385bb2f5d652542163ce6df015c804221e24eb02d76dd2ad89d402d66ee480
- **source:** /guides/compound-interest-formula-excel-google-sheets/
**target:** /guides/how-is-savings-account-interest-calculated/
**section:** Daily vs monthly compounding
**anchor:** how savings account interest is calculated
**purpose:** Related mechanism
**inspection:** **path:** src/data/guides.ts
**sha256:** c5be292d100c82cf37393826982c55207d01bd93b9257438aa3f970aff038f76

**Technical and measurement scope**

Reuse existing spoke/tool template, canonical self-reference, sitemap entry with today's lastmod, IndexNow after live 200. Measurement: growth.json registers hypothesis (new query family from Autocomplete) with baseline not-yet-published; no uplift claimed. GSC data unavailable in this run.

### A4 — /guides/property-tax-by-state-mortgage-payment/

**Identity**

**title:** Property Tax by State: What It Adds to Your Mortgage Payment
**pageType:** guide
**format:** comparison table/database - 50 states
**medium:** text

**Reader and answer**

**question:** How much do property taxes add to my monthly mortgage payment in my state? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 90/334 mortgage completions name a state or taxes and insurance]
**answer:** Property tax adds roughly (effective rate x home price)/12 to principal and interest, from about $100/month in Hawaii to over $700 in New Jersey on a $400,000 home; table gives each state (figure shape).
**placement:** section 1: state table of monthly property tax on a $400,000 home

**Keyword evidence**

Primary 'mortgage calculator with taxes and insurance / mortgage calculator <state> (90 mapped completions)' and supporting phrases from the Autocomplete CSVs (candidate IDs in candidate-dispositions.csv). Source: estimate (autocomplete) NOT measured; no SEMRUSH/DataForSEO key in this run (checked 2026-11-25). Country/database: US.

**SERP and questions**

SERP/PAA not read (no DataForSEO key), recorded as unread. Autocomplete question completions are the only question evidence; FAQ drawn from them. Limit: competitiveness unknown; ordering by completion count only.

**Why a new page**

Closest routes: /mortgage/piti-calculator/ (generic, no state data), /mortgage/affordability-calculator/, /guides/mortgage-mistakes-before-applying/. None compares states. No commits touch the route. Insurance is excluded: no primary insurance dataset was retrieved.

**Planned outline**

- **heading:** Property Tax Added to a $400,000 Mortgage by State
**purpose:** Answer: 50-state table
- **heading:** How the Estimate Works
**purpose:** Effective rate x price / 12; ACS basis and limits
- **heading:** Highest and Lowest Property Tax States
**purpose:** Reading the extremes
- **heading:** What Else Goes Into Escrow
**purpose:** Insurance and PMI noted as not included; link PITI tool
- **heading:** Property Tax Mortgage FAQs
**purpose:** Completions-derived questions

**Contribution and evidence**

Decision gap: state-name completions need a state figure, not a generic calculator. Basis: calculated from Tax Foundation effective property-tax rates (ACS 2024 5-year estimates) saved verbatim 2026-11-25; rate x $400,000 / 12 executed in Python. Limits: state averages hide county variation; counterexample: a county rate far above the state average.

**Tables, tools or visuals**

Table columns: state, effective rate, monthly tax on $400,000, rank. Link PITI calculator for own price. No interactive element.

**Testing and review**

Site section G excludes legal/financial services: no TESTED label, no 'we tested'. Evidence basis calculated: attribution reads 'In our internal modeling, we ...' with inputs named. HIGH factual profile for tax figures; no professional review required (general information). Publisher's Take generated at WRITE via reviewer-voice-profile.

**Planned takeaway**

Property tax can add from about $100 to over $700 a month on a $400,000 home depending on state; use your county rate for the real number. Applies to owner-occupied homes at the stated price; changes with assessed value, exemptions and county rates.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /mortgage/piti-calculator/
**target:** /guides/property-tax-by-state-mortgage-payment/
**section:** How it works
**anchor:** property tax by state
**purpose:** Reader needing a state tax rate for the PITI inputs
**inspection:** **path:** src/data/spokes-mortgage.ts
**sha256:** 136442304053d3a534933015426556658f46c2bb08713486960e94c6eadef44f
- **source:** /mortgage/affordability-calculator/
**target:** /guides/property-tax-by-state-mortgage-payment/
**section:** Related guides
**anchor:** how state property taxes change affordability
**purpose:** Affordability depends on escrow
**inspection:** **path:** src/data/spokes-mortgage.ts
**sha256:** 136442304053d3a534933015426556658f46c2bb08713486960e94c6eadef44f

**Outbound internal links**

**placements:** - **source:** /guides/property-tax-by-state-mortgage-payment/
**target:** /mortgage/piti-calculator/
**section:** What Else Goes Into Escrow
**anchor:** PITI mortgage calculator
**purpose:** Compute exact payment
**inspection:** **path:** src/data/spokes-mortgage.ts
**sha256:** 136442304053d3a534933015426556658f46c2bb08713486960e94c6eadef44f
- **source:** /guides/property-tax-by-state-mortgage-payment/
**target:** /mortgage/affordability-calculator/
**section:** Highest and Lowest
**anchor:** mortgage affordability calculator
**purpose:** Next step
**inspection:** **path:** src/data/spokes-mortgage.ts
**sha256:** 136442304053d3a534933015426556658f46c2bb08713486960e94c6eadef44f

**Technical and measurement scope**

Reuse existing spoke/tool template, canonical self-reference, sitemap entry with today's lastmod, IndexNow after live 200. Measurement: growth.json registers hypothesis (new query family from Autocomplete) with baseline not-yet-published; no uplift claimed. GSC data unavailable in this run.

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
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-25-autocomplete-run/readiness.md) |

Approve this plan to start the listed content work?
