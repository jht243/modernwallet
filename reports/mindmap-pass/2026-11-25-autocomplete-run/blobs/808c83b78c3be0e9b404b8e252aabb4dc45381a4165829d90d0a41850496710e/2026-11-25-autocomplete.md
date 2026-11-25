---
mindmap_pass_date: 2026-11-25
source: "reports/mindmap-pass/2026-11-25-autocomplete-run/brief.txt"
interpreted_brief: "Unattended Autocomplete pass for themodernwallet.com: 1,570 live Google completions from five calculator seeds (mortgage, compound interest, 401k, debt payoff, social security). Most completions are already served by the site's 237+ calculators and guides; the run keeps only genuine gaps: a multi-debt payoff tool, a 401k paycheck-impact tool, a compound-interest spreadsheet guide, a property-tax-by-state mortgage guide, and body gaps on the 401k calculator. Social Security completions are deferred because ssa.gov blocks primary-source access."
status: ready-for-approval
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lens 1/2: 'debt payoff calculator' cluster, 181 completions + 65 template/planner variants (avalanche, snowball, multiple loans/cards, extra payments, biweekly, lump sum, how long, payoff date). Source: estimate (autocomplete) NOT measured. lookup: /credit-card-payoff/ - single-card payoff only; /compare/debt-snowball-vs-avalanche - explainer without inputs; no multi-debt tool. | Create /debt-payoff-calculator/ [interactive tool]: enter several debts (balance, APR, minimum), extra monthly payment and optional lump sum; compare avalanche, snowball and minimums-only payoff date, interest and order. | create new content | /debt-payoff-calculator/ | interactive tool - inputs change payoff order and total interest | interactive tool | interactive tool | unread (no DataForSEO key) | SERP not read: DATAFORSEO_B64 absent in this run; demand rests on Autocomplete completions only | How long will it take to pay off all my debts and which one should I pay first? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 181/294 debt completions are payoff-method or schedule questions] | One result table showing payoff date and total interest for avalanche vs snowball vs minimums-only, with the payoff order (mechanism: pay minimums on all, send the extra to the target debt, roll freed payments). | section 1: the calculator and its three-strategy result | A1 |
| lens 1/2: 'compound interest calculator excel / google sheets / formula / spreadsheet / template' 28 completions. Source: estimate (autocomplete) NOT measured. lookup: /investing/compound-interest-calculator/ is a web tool; no spreadsheet formula page (/guides/how-is-savings-account-interest-calculated/ covers savings interest only). | Create /guides/compound-interest-formula-excel-google-sheets/ [article with copy-paste formulas and a worked table]: A=P(1+r/n)^(nt), FV() with and without monthly deposits, daily/monthly/yearly compounding differences. | create new content | /guides/compound-interest-formula-excel-google-sheets/ | article - mechanism with copy-paste formulas | text | text | unread (no DataForSEO key) | SERP not read: no DataForSEO key; Autocomplete only | How do I calculate compound interest in Excel or Google Sheets? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 28/313 completions are excel/sheets/formula how-tos] | Use =FV(rate/n, n*years, -monthly deposit, -principal) or =P*(1+r/n)^(n*t); the page gives both with verified outputs (mechanism). | section 1: How to Calculate Compound Interest in Excel and Google Sheets | A3 |
| lens 1/2: 'mortgage calculator <state> / with taxes and insurance / property tax / escrow' 90 completions across ~45 states. Source: estimate (autocomplete) NOT measured. lookup: /mortgage/piti-calculator generic; no state property-tax comparison. | Create /guides/property-tax-by-state-mortgage-payment/ [article + state table]: effective property-tax rate by state (Tax Foundation, ACS 2024) converted to monthly escrow on a stated home price, added to principal and interest. | create new content | /guides/property-tax-by-state-mortgage-payment/ | comparison table/database - 50 states | text | text | unread (no DataForSEO key) | SERP not read: no DataForSEO key; Autocomplete only | How much do property taxes add to my monthly mortgage payment in my state? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 90/334 mortgage completions name a state or taxes and insurance] | Property tax adds roughly (effective rate x home price)/12 to principal and interest, from about $100/month in Hawaii to over $700 in New Jersey on a $400,000 home; table gives each state (figure shape). | section 1: state table of monthly property tax on a $400,000 home | A4 |
| lens 2: '401k calculator if i stop contributing / adjusted for inflation / no match / how long will it last / increasing contributions' 21 completions. Source: estimate (autocomplete) NOT measured. lookup: /retirement/401k-calculator/ body covers projection and market drops only. | Add targeted sections to /retirement/401k-calculator/ (additive only): what happens if you stop contributing, inflation-adjusted balance, and contributing without a match, using the calculator's own formula. | update existing body text | /retirement/401k-calculator/ | article section | text | text | unread (no DataForSEO key) | SERP not read: no DataForSEO key; Autocomplete only | What happens to my 401(k) projection if I stop contributing or adjust for inflation? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 21/304 completions ask these variants] | Stopping contributions at a given age freezes deposits while growth continues; the new section shows the balance with and without contributions and in today's dollars (verdict with break-even). | section 2: What Happens If You Stop Contributing | A5 |

## Original request and acceptance

Turn real Autocomplete demand into net-new or enriched pages only where the site has no page answering the reader's question, with primary-source support.

- **id:** REQ-1
**description:** Account for every one of the 1,570 Autocomplete completions with a disposition (page, covered, deferred or excluded) under its candidate ID.
**acceptance:** candidate-dispositions.csv lists all 1,570 IDs; mapped IDs point to an action row; covered IDs name the existing route.
**actionIds:** - A1
- A3
- A4
- A5
- **id:** REQ-2
**description:** Create net-new pages only where coverage lookup shows no existing page with the same reader intent.
**acceptance:** Each new page brief names the closest existing routes and why they do not answer the question; rendered pages contain a working answer in section 1 or 2.
**actionIds:** - A1
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

## Reviewer guardrails carried into writing

- CR2 (substantive): WRITE must compute every state cell as effective rate x $400,000 / 12 from the saved table (NJ and IL $627, HI $97, DC listed separately), state the range as about $97 to $627, and drop 'over $700'. Cite 2024 ACS 5-year basis and that county rates vary (NJ counties run 0.93% to 2.47% in the same source). Record a guardrail for AUDIT to recheck the inherited PITI FAQ NJ 'over 2.1%' wording (rendered-page-audit inherited contradiction); fix it in Phase 6/5 as a targeted edit or note it.
- CR3 (substantive): In WRITE add an outbound link to /debt-consolidation-calculator/ near the 'How the Calculator Works' or FAQ section and one sentence distinguishing the two tools; keep the avalanche vs snowball vs minimums result in section 1. Reader question evidence tag should read 'ac-only' since completions exist (see CR6).
- CR4 (substantive): No change required for this run. Record in the exclusions that the primary source route exists (FR 2026-21796) so a later run can draft SS benefit-formula/earnings-test pages; update the D-SS reason text on next pass. Do not draft SS pages now without a saved verbatim source.
- CR5 (minor): Carry as a reviewer guardrail: BUILD/MAIN may leave CSV as is for this unattended run, but the final summary must not claim these specific completions are answered; list them as 'covered by blanket seed route, unverified per completion' or 'out of A4/A5 scope'. For A5 add 'with increasing contributions' or 'catch-up' only if natural; do not add a drawdown section.
- CR7 (substantive): WRITE must save the Google Sheets FV page verbatim to research/sources/ before drafting and cite it first-use; state the monthly-deposit/n condition in the opening answer and takeaway (use n=12 for monthly deposits, or separate rate per deposit period). Execute and save the Python verification of every formula output shown.
- REQ-2 (requestCoverage): A1, A3, A4 pass the same-intent check (closest routes named, none answers the question). A2 fails: /paycheck-calculator/ already answers the 401(k) take-home question with the same method (CR1). Requirement is met once A2 is pruned.

Publication scope: commit: True, push: True, liveVerification: True, indexNow: True

## Preparation check

| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-25-autocomplete-run/readiness.md) |

Approve this plan to start the listed content work?
