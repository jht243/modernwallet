---
mindmap_pass_date: 2026-11-15
source: "reports/mindmap-pass/2026-11-15-keyword-gap-run/request.txt"
interpreted_brief: "Unattended keyword-gap run. Intake is the lossless competitor gap harvest (444 SERP-intent clusters, 522 keywords). Calculator-led site, so gap keywords best served by a calculator get a tool. Evaluated at cluster level against the live repo: 'car loan calculator' is already served by the /auto-loan/ hub (pre-match was a fuzzy miss), so no new page. Real gaps: salary/income conversion and take-home pay (no existing route). Federal income tax intent is already answered by the live /tax-bracket-calculator/ and /guides/how-much-tax-will-i-pay/ (no-addition; only a link to the new paycheck calculator). State/NYC tax calculators are deferred (only NY URLs attempted, not found). New builds capped at 2 of the allowed 3. Every cluster has a disposition in cluster-dispositions.json: {ADJ-NOT-PURSUED 168, BUILD-A1 8, BUILD-A2 8, COVERED 62, COVERED-PARTIAL 168, NEW-PAGE-CANDIDATE-DEFERRED 30}."
status: ready-for-approval
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Adjacent-demand direct intent. Cluster 'salary calculator' 339,600 combined vol (primary 246,000), KD 29, 2 competitors (calculator.net, smartasset.com; measured, SEMRUSH/DataForSEO intake 2026-11-15) plus annual salary 14,800, yearly salary 18,100, annual income 40,500, income calculator 18,100, gross income 6,600. lookup: no match. The site has no salary/hourly conversion tool; pre-matches (s-corp-reasonable-salary-calculator, 1099-vs-w2-calculator) serve different intents. | Create /salary-calculator/ targeting 'salary calculator' [calculator]: converts any pay figure between hourly, daily, weekly, biweekly, semimonthly, monthly and annual using stated hours per week and weeks per year. | create new content | /salary-calculator/ | calculator - searchers want an instant conversion from their own pay and hours | interactive tool | interactive tool | unread | DataForSEO SERP unavailable this run (0 calls); intake shows 2 calculator-site competitors (calculator.net, smartasset.com); autocomplete only. | How do I convert my annual salary to an hourly wage, and my hourly wage to an annual salary? [PAA unread - DataForSEO unavailable; ac 3/14 how-pattern: how to salary calculator hourly, how pay calculator, how wage calculator] | Annual pay divided by (hours per week x weeks per year) gives the hourly rate; at 40 hours and 52 weeks, a $52,000 salary is $25.00 an hour. Shape: figure. | section 1: "Salary Calculator" (tool with opening answer above it) | A1 |
| Adjacent-demand direct intent. Cluster 'paycheck tax calculator' 18,100 (KD 65), salary take home calculator 6,600 (KD 62), after tax income calculator 9,900 (KD 70), post tax income calculator 8,100 (KD 34); measured intake 2026-11-15. lookup: no match; /pto-cashout/ and /budget/ only mention paychecks. The site never answers 'what do I keep from my pay'. | Create /paycheck-calculator/ targeting 'paycheck tax calculator' [calculator]: estimates annual and per-paycheck take-home from gross pay using 2026 federal income tax brackets and standard deduction (IRS) plus Social Security and Medicare payroll tax (IRS/SSA); state and local taxes are explicitly excluded. | create new content | /paycheck-calculator/ | calculator - the answer depends on the reader's pay, filing status and pay frequency | interactive tool | interactive tool | unread | DataForSEO SERP unavailable this run (0 calls); autocomplete shows accuracy and 'how much will I net' question patterns; competitor SERPs not read. | How much of my paycheck will I keep after federal income tax and payroll tax? [PAA unread - DataForSEO unavailable; ac 2/12 how-much and accuracy pattern: how much will i net on my paycheck, is paycheck calculator accurate] | At $60,000 single filing, 2026 federal income tax is about $5,020 and payroll tax $4,590, leaving about $50,390 a year (about $1,938 per biweekly check) before any state tax, credits or other withholding. Shape: figure. | section 1: "Paycheck Calculator" (tool with opening answer above it) | A2 |
| Adjacent-demand direct intent (tax calculator 1,911,300 combined, income tax calculator 110,000, federal income tax calculator 14,800, income tax estimator 49,500, tax estimator 18,100, tax percentage calculator 8,100; measured intake). lookup: /tax-bracket-calculator/ (reader goal: find tax owed and bracket for 2026; intro $85,000 single example = $9,870, howItWorks with band table and head-of-household $60,000 example) and /guides/how-much-tax-will-i-pay/ (reader goal: estimate my 2026 federal bill; match 0.75, linked from the calculator). Both already answer 'how much federal income tax will I owe', so per _decision-evidence the no-addition branch applies: no body text, calculator or new URL added. Remaining need is a take-home path: the bracket tool excludes payroll tax. | No-addition decision for the federal income tax cluster (existing calculator + guide are sufficient; no cannibalizing second tax-owed page). Only change: add one inbound link from /tax-bracket-calculator/ to /paycheck-calculator/ where its FAQ says payroll and state tax are not included. Any title/description promise for 'federal income tax calculator' is left to a later GSC-gated Phase 2. | add internal links | /tax-bracket-calculator/ | n/a | n/a | n/a | unread | n/a - no-addition; DataForSEO SERP unavailable this run. | n/a | n/a | n/a | A3 |

## Original request and acceptance

Turn the highest-opportunity, safely answerable calculator gaps from the competitor keyword gap into verifiable, official-source-backed tools, with honest dispositions for every cluster and at most 3 new builds.

- **id:** REQ-1
**description:** Preserve every original candidate cluster/keyword with an honest disposition (covered / adjacent-not-pursued with reason / new-page candidate).
**acceptance:** cluster-dispositions.json lists all 444 clusters and 522 keywords with disposition and reason (per-row verified for mortgage, auto and deferred rows against slugs/targetKeywords); chart exclusions summarize counts.
**actionIds:** - A1
- A2
- A3
- **id:** REQ-2
**description:** Assess 'car loan calculator' (priority) and build only if no existing route serves it.
**acceptance:** Chart records that /auto-loan/ already serves it, with lookup evidence; no duplicate page is created.
**actionIds:** - A3
- **id:** REQ-3
**description:** Build the salary calculator and the paycheck/take-home tool using only official-source figures (IRS/SSA), with stated assumptions and verifiable math.
**acceptance:** A1 and A2 render working client-side calculators whose constants match the saved IRS sources and reference output; assumptions and exclusions appear on page.
**actionIds:** - A1
- A2
- **id:** REQ-4
**description:** Assess tax calculator and New York income tax calculator only if official figures can be cited; cap new builds at 3.
**acceptance:** Federal tax intent is recorded as already served by /tax-bracket-calculator/ and /guides/how-much-tax-will-i-pay/ (no-addition, only a link to /paycheck-calculator/); NY/state deferred (only NY URLs attempted); 2 new pages total.
**actionIds:** - A3

### Presentation — A1

**medium:** interactive tool
**placement:** Page top, directly under the opening answer
**reason:** The reader enters one pay figure and hours; the tool returns every pay period at once.
**readerInputs:** - Pay amount
- Pay period it is quoted in
- Hours per week
- Weeks per year
**interaction:** **decision:** build
**reason:** Adjustable inputs change the answer; a static table cannot cover each reader's pay, hours or filing status.
**animation:** **decision:** not-useful
**reason:** Static result cards answer faster; no sequence or change over time needs motion.

### Presentation — A2

**medium:** interactive tool
**placement:** Page top, directly under the opening answer
**reason:** Take-home depends on pay, pay frequency, filing status and pre-tax retirement contributions, so the reader needs to enter them.
**readerInputs:** - Gross pay and period
- Pay frequency
- Filing status (single, married filing jointly, head of household)
- Pre-tax retirement contribution
**interaction:** **decision:** build
**reason:** Adjustable inputs change the answer; a static table cannot cover each reader's pay, hours or filing status.
**animation:** **decision:** not-useful
**reason:** Static result cards answer faster; no sequence or change over time needs motion.

## Emerging search patterns (clusters)

- Salary / income conversion: salary calculator 339,600; annual income calculator 40,500; yearly salary 18,100; income calculator 18,100; annual salary 14,800; gross income 6,600 -> create /salary-calculator/ (A1)
- Take-home pay: paycheck tax calculator 18,100; salary to paycheck 12,100; figuring out paycheck from salary 12,100; figure out salary after taxes 12,100; after tax income 9,900; after tax 8,100; post tax income 8,100; salary take home 6,600 -> create /paycheck-calculator/ (A2)
- Federal income tax: tax calculator 1,911,300; income tax calculator 110,000; income tax estimator 49,500; tax estimator 18,100; federal income tax calculator 14,800; us income tax calculator 4,400 -> already served by /tax-bracket-calculator/ and /guides/how-much-tax-will-i-pay/; no-addition, link to /paycheck-calculator/ only (A3)
- Car loan: car loan calculator 450,000; car loan payment calculator 49,500; auto loan payment calculator 40,500 -> covered by /auto-loan/ hub, no action
- State and NYC tax/salary calculators (new york income tax 9,900; california income tax 15,700; salary calculator state variants) -> deferred, official 2026 state schedules not retrievable this run

## Exclusions

- Dispositions for all 444 clusters / 522 keywords are in reports/mindmap-pass/2026-11-15-keyword-gap-run/cluster-dispositions.json (hash in evidenceFiles). Counts: ADJ-NOT-PURSUED 168, BUILD-A1 8, BUILD-A2 8, COVERED 62, COVERED-PARTIAL 168, NEW-PAGE-CANDIDATE-DEFERRED 30. COVERED-PARTIAL means pre-matched pages are topical neighbours only. Mortgage, auto and deferred rows were checked per row against slugs and targetKeywords.
- car loan calculator (450,000): NOT a new page; /auto-loan/ (Auto Loan Calculator, targetKeyword 'auto loan calculator', FAQ 'Is this the same as a car loan payment calculator?') plus 7 spokes already serve the intent. The brief's 'none' was a fuzzy pre-match miss.
- new york income tax calculator / nyc tax calculator / state tax calculators: adjacent-not-pursued this run, deferred. Only NY URLs were attempted (two tax.ny.gov guessed URLs returned 404, saved); other states not researched; no official 2026 NY or NYC schedule is cited. States without income tax (Florida, Texas) are largely served by A2 (federal income tax and payroll tax only). Revisit after A2 ships.
- Insurance (car, home, health, life, renters, travel, disability), credit cards, rates, Social Security, celebrity net worth, brand-navigational queries: adjacent-not-pursued or covered-partial per ledger; high KD, per-vendor YMYL data not safely verifiable here, or off-mission. Not auto-deprioritized: each has a stated reason.
- New builds capped at 2 (A1, A2) of the allowed 3; no third build because remaining candidates need per-state or per-vendor primary data not available this run.
- tax calculator / income tax calculator / federal income tax calculator / income tax estimator / tax estimator / tax percentage calculator: COVERED, no-addition (A3). /tax-bracket-calculator/ and /guides/how-much-tax-will-i-pay/ already answer tax owed; no second page or section added. reverse mortgage calculator (and calculate reverse mortgage) is one consistent deferred candidate: no existing page, HECM needs HUD primary sources.

## New-page briefs

### A1 — /salary-calculator/

**Identity**

**title:** Salary Calculator: Hourly, Weekly, Monthly and Annual Pay
**pageType:** calculator tool page
**format:** calculator - searchers want an instant conversion from their own pay and hours
**medium:** interactive tool

**Reader and answer**

**question:** How do I convert my annual salary to an hourly wage, and my hourly wage to an annual salary? [PAA unread - DataForSEO unavailable; ac 3/14 how-pattern: how to salary calculator hourly, how pay calculator, how wage calculator]
**answer:** Annual pay divided by (hours per week x weeks per year) gives the hourly rate; at 40 hours and 52 weeks, a $52,000 salary is $25.00 an hour. Shape: figure.
**placement:** section 1: "Salary Calculator" (tool with opening answer above it)
**audience:** US wage earners checking pay offers or paychecks

**Keyword evidence**

Primary 'salary calculator' 246,000 (cluster total 339,600), KD 29, source SEMRUSH/DataForSEO intake 2026-11-15 (us); supporting: salary calculator salary calculator salary calculator 60,500 (KD 29), annual income calculator 40,500, yearly salary calculator 18,100, income calculator 18,100, annual salary calculator 14,800, gross income calculator 6,600. Volumes are Google-rounded buckets.

**SERP and questions**

SERP not read (DataForSEO unavailable, 0 calls; verdict unread). Autocomplete (saved csv) shows how-to-hourly, net salary and monthly/yearly variants; many UK/Australia variants are off-market and ignored. PAA unavailable; FAQ will be drawn from autocomplete questions and the page's own math. Opportunity: KD 29 is the lowest of the big head terms; limit: calculator.net and smartasset are entrenched.

**Why a new page**

Closest existing routes: /freelance-rate/1099-vs-w2-calculator/ (what contractor rate matches a salary) and /s-corp-tax/s-corp-reasonable-salary-calculator/ (owner salary). Both serve different reader goals; coverage-lookup.txt finds no existing home. Checked commits: no commits touch a salary-calculator route (lookup: Commits naming the topic: none). Independent duplicate decision rests with CHART-REVIEW.

**Planned outline**

- **heading:** Salary Calculator
**purpose:** Opening answer sentence with worked $52,000 -> $25.00/hour example, then the tool
- **heading:** How the Salary Conversion Works
**purpose:** Formula: annual / (hours per week x weeks per year); every period derived from it; why 2,080 hours is only the 40 x 52 assumption
- **heading:** Salary Versus Hourly Pay by Hours and Weeks Worked
**purpose:** Finite table of the same $60,000 salary at 35, 37.5, 40 and 45 hours showing how the hourly rate moves (modeling, labeled)
- **heading:** What Gross Pay Leaves Out
**purpose:** Gross is before tax and deductions; link to the paycheck calculator for take-home
- **heading:** Salary Calculator FAQs
**purpose:** Autocomplete-sourced questions: hourly to salary, monthly to yearly, unpaid weeks, overtime not included

**Contribution and evidence**

Decision gap: readers compare offers quoted in different periods and do not see how hours worked change the effective hourly rate. Basis: calculated (pure arithmetic from reader inputs; no external figures). Reference code and output saved (paycheck-reference-calc.py, salary cases incl. 52,000 -> 25.00). Visible attribution: 'In our internal modeling, we converted the same $60,000 salary across 35 to 45 hour weeks to show how the hourly rate moves.' Counterexample: unpaid weeks or overtime change the conversion; page states they are not modeled. WRITE/AUDIT guardrail: the 35 to 45 hour table is plain arithmetic, so present it as an illustration/sensitivity aid, not original research or a finding; Phase 4 tests default 40x52, 37.5 hours, and period conversions with its own replay.

**Tables, tools or visuals**

Inputs: pay amount, period (hourly/daily/weekly/biweekly/semimonthly/monthly/annual), hours per week (default 40), weeks per year (default 52). Outputs: all periods. No sourced rates needed. Table: 4 hours-per-week scenarios (calculated). No chart; result cards readable without interaction.

**Testing and review**

Site _experience.md section G licenses product testing only; a calculator is not a product test and finance is excluded, so ordinary presentation: no 'we tested', howWeTested or tested schema. Math is labeled calculated; scenarios labeled modeling. Review profile HIGH (consequential tax/financial claims): 2 independent audits max, no professionalReviewRequired (general educational estimator, no individualized advice).

**Planned takeaway**

Conversion is arithmetic on the reader's hours: salary / (hours x weeks) = hourly. Applies to any pay offer; the answer changes if hours, unpaid weeks or overtime differ. Gross figure is not take-home; for that, use the paycheck calculator. Informational page, no purchase recommendation.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /budget/
**target:** /salary-calculator/
**section:** FAQ: Should I use gross or take-home income for a budget?
**anchor:** salary calculator
**purpose:** Reader needs gross-to-period conversion before budgeting
**inspection:** **path:** src/data/calculators.ts
**sha256:** 8b6814e99b1c23a81088654c6d3a8d709811d38abcc5139224d12aa2d4aa85fe
- **source:** /freelance-rate/1099-vs-w2-calculator/
**target:** /salary-calculator/
**section:** FAQ: How much more should a 1099 contractor charge than a W-2 salary?
**anchor:** convert a salary to an hourly rate
**purpose:** Compare salary to contractor hourly rate
**inspection:** **path:** src/data/spokes-freelance-rate.ts
**sha256:** 623cae022f24e23def8b27e1ff35024f5621d3d6b8289e8118dd14e6fa3ed2c9
- **source:** /guides/how-to-make-a-budget/
**target:** /salary-calculator/
**section:** Where the Numbers Come from When You Make a Budget
**anchor:** salary calculator
**purpose:** Convert quoted pay to monthly income for the budget
**inspection:** **path:** src/data/guides.ts
**sha256:** d40c21688bdb684b88bc584c3360c31c43bd5025468a229ac19f4dbdcc6132f9

**Outbound internal links**

**placements:** - **source:** /salary-calculator/
**target:** /paycheck-calculator/
**section:** What Gross Pay Leaves Out
**anchor:** paycheck calculator
**purpose:** Next step from gross to take-home
**inspection:** **path:** src/data/calculators.ts
**sha256:** 8b6814e99b1c23a81088654c6d3a8d709811d38abcc5139224d12aa2d4aa85fe
- **source:** /salary-calculator/
**target:** /budget/
**section:** What Gross Pay Leaves Out
**anchor:** budget calculator
**purpose:** Use monthly income in a budget
**inspection:** **path:** src/data/calculators.ts
**sha256:** 8b6814e99b1c23a81088654c6d3a8d709811d38abcc5139224d12aa2d4aa85fe

**Technical and measurement scope**

Register CalculatorDef (id, islandId) in src/data/calculators.ts, island component + src/lib engine, LIVE_IDS in src/data/registry.ts so the route /salary-calculator/ builds with canonical, sitemap and JSON-LD like existing calculators; add sitemap lastmod and IndexNow after live check. Measurement: growth.json with hypothesis (cluster head impressions/clicks), baseline not-yet-published, GSC unavailable here so recorded unavailable, never zero; day-28/56 windows after verified deployment.

### A2 — /paycheck-calculator/

**Identity**

**title:** Paycheck Calculator: 2026 Federal Take-Home Pay Estimate
**pageType:** calculator tool page
**format:** calculator - the answer depends on the reader's pay, filing status and pay frequency
**medium:** interactive tool

**Reader and answer**

**question:** How much of my paycheck will I keep after federal income tax and payroll tax? [PAA unread - DataForSEO unavailable; ac 2/12 how-much and accuracy pattern: how much will i net on my paycheck, is paycheck calculator accurate]
**answer:** At $60,000 single filing, 2026 federal income tax is about $5,020 and payroll tax $4,590, leaving about $50,390 a year (about $1,938 per biweekly check) before any state tax, credits or other withholding. Shape: figure.
**placement:** section 1: "Paycheck Calculator" (tool with opening answer above it)
**audience:** US wage earners checking pay offers or paychecks

**Keyword evidence**

Primary 'paycheck tax calculator' 18,100 (KD 65); supporting: after tax income calculator 9,900 (KD 70), post tax income calculator 8,100 (KD 34), salary take home calculator 6,600 (KD 62); SEMRUSH/DataForSEO intake 2026-11-15 (us). Head 'paycheck calculator' not in intake (no volume claimed). Additional A2-intent clusters (measured intake): salary to paycheck 12,100; figuring out paycheck from salary 12,100; figure out salary after taxes 12,100; after tax 8,100.

**SERP and questions**

SERP not read (DataForSEO unavailable). Autocomplete (saved csv): 'is paycheck calculator accurate', 'how much will i net on my paycheck', 'how do i calculate my paycheck manually'. These become FAQ items. Limit: competitors include state taxes, which this page deliberately excludes and says so.

**Why a new page**

Closest: /tax-bracket-calculator/ (reader goal: find tax owed and bracket; income tax only, no payroll tax, no take-home) and /guides/how-much-tax-will-i-pay/ (estimate the federal bill); neither answers take-home, and A2 must not repeat a tax-owed worked example as its main answer (cannibalization ruling), /pto-cashout/ (leave payout), /budget/. None answers take-home pay; lookup finds no home. No commits name the topic.

**Planned outline**

- **heading:** Paycheck Calculator
**purpose:** Opening answer with $60,000 single example then tool
- **heading:** How Take-Home Pay Is Calculated
**purpose:** Gross - pre-tax retirement - federal income tax (2026 brackets after standard deduction) - Social Security 6.2% to the wage base - Medicare 1.45%
- **heading:** 2026 Federal Figures Used
**purpose:** Table of brackets, standard deductions, wage base and rates with IRS links and check date
- **heading:** What This Estimate Leaves Out
**purpose:** State and local tax, credits, health premiums, other withholding, W-4 choices, additional Medicare 0.9% handled above $200,000 only
- **heading:** Take-Home Pay at Different Salaries
**purpose:** Finite modeled table: $40,000, $60,000, $100,000, $150,000 single
- **heading:** Paycheck Calculator FAQs
**purpose:** Accuracy, how much will I net, calculate manually, why take-home differs from the estimate

**Contribution and evidence**

Decision gap: readers see gross pay but not what survives federal and payroll tax. Basis: calculated from IRS figures (Rev. Proc. 2025-32 brackets; IRS 2026 release standard deduction $16,100 single / $32,200 MFJ / $24,150 HoH; IRS Topic 751 rates and $184,500 wage base; Topic 560 0.9% above $200,000). Reference code with hand-check ($60,000 single: federal $5,020, SS $3,720, Medicare $870, net $50,390) saved. Attribution: 'In our internal modeling, we ran 2026 federal brackets and payroll tax across salaries from $40,000 to $150,000 to estimate take-home pay.' Counterexample: state tax or a W-4 with extra withholding makes the check smaller; stated. Unknown: actual employer withholding method (IRS Pub 15-T) differs from annual liability. WRITE/AUDIT guardrails: (a) model employer withholding of 0.9% Additional Medicare above $200,000 for all statuses (IRS Topic 751) and say a married couple's final liability uses Topic 560 thresholds ($250,000 MFJ, $125,000 MFS, $200,000 others) and can differ; (b) pre-tax input is a traditional 401(k)/403(b)-style deferral that lowers income tax only, FICA stays on gross; Section 125 premiums, HSA and similar deductions not modeled; (c) 'What This Estimate Leaves Out' names tips, overtime, senior and QBI deductions, child tax credit, credits generally, state/local tax, W-4 extra withholding; result is an annual-liability estimate, not IRS Pub 15-T withholding; (d) wage base cited to IRS Topic 751 (SSA blocked curl); (e) Phase 4 replay with own artifact: std-deduction boundary ($16,100 single = $0 federal), SS cap above $184,500, MFJ and HoH cases, 26/24/52/12 period defaults.

**Tables, tools or visuals**

Inputs: gross pay + period, pay frequency, filing status (single, MFJ, HoH; MFS excluded), pre-tax retirement contribution (reduces income tax only, not FICA). Outputs: annual and per-paycheck federal tax, Social Security, Medicare, net. Reuses src/lib/tax-bracket.ts constants (already match Rev. Proc. 2025-32). Table of sourced constants; modeled salary table. Standard deduction only; no credits.

**Testing and review**

Site _experience.md section G licenses product testing only; a calculator is not a product test and finance is excluded, so ordinary presentation: no 'we tested', howWeTested or tested schema. Math is labeled calculated; scenarios labeled modeling. Review profile HIGH (consequential tax/financial claims): 2 independent audits max, no professionalReviewRequired (general educational estimator, no individualized advice).

**Planned takeaway**

Single filer at $60,000 keeps about $50,390 a year before state tax, roughly 84% of gross. Applies to W-2 employees using the standard deduction; answer changes with state tax, itemizing, credits, extra W-4 withholding or health premiums. Estimate, not withholding advice; consult payroll or a tax professional for exact figures.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /pto-cashout/
**target:** /paycheck-calculator/
**section:** FAQ: Is a PTO cash-out taxed differently than my regular paycheck?
**anchor:** paycheck calculator
**purpose:** Reader wants take-home on regular pay
**inspection:** **path:** src/data/calculators.ts
**sha256:** 8b6814e99b1c23a81088654c6d3a8d709811d38abcc5139224d12aa2d4aa85fe
- **source:** /tax-bracket-calculator/
**target:** /paycheck-calculator/
**section:** FAQ: Does this calculator include state tax?
**anchor:** estimate your take-home pay
**purpose:** Bracket tool excludes payroll tax; paycheck tool adds it
**inspection:** **path:** src/data/calculators.ts
**sha256:** 8b6814e99b1c23a81088654c6d3a8d709811d38abcc5139224d12aa2d4aa85fe
- **source:** /budget/
**target:** /paycheck-calculator/
**section:** FAQ: Should I use gross or take-home income for a budget?
**anchor:** paycheck calculator
**purpose:** Find take-home pay for budgeting
**inspection:** **path:** src/data/calculators.ts
**sha256:** 8b6814e99b1c23a81088654c6d3a8d709811d38abcc5139224d12aa2d4aa85fe

**Outbound internal links**

**placements:** - **source:** /paycheck-calculator/
**target:** /tax-bracket-calculator/
**section:** 2026 Federal Figures Used
**anchor:** federal tax bracket calculator
**purpose:** See marginal bracket detail
**inspection:** **path:** src/data/calculators.ts
**sha256:** 8b6814e99b1c23a81088654c6d3a8d709811d38abcc5139224d12aa2d4aa85fe
- **source:** /paycheck-calculator/
**target:** /salary-calculator/
**section:** How Take-Home Pay Is Calculated
**anchor:** salary calculator
**purpose:** Convert pay periods
**inspection:** **path:** src/data/calculators.ts
**sha256:** 8b6814e99b1c23a81088654c6d3a8d709811d38abcc5139224d12aa2d4aa85fe

**Technical and measurement scope**

Register CalculatorDef (id, islandId) in src/data/calculators.ts, island component + src/lib engine, LIVE_IDS in src/data/registry.ts so the route /paycheck-calculator/ builds with canonical, sitemap and JSON-LD like existing calculators; add sitemap lastmod and IndexNow after live check. Measurement: growth.json with hypothesis (cluster head impressions/clicks), baseline not-yet-published, GSC unavailable here so recorded unavailable, never zero; day-28/56 windows after verified deployment.

## Execution plan

1. Record advisory cannibalization check: /salary-calculator/ vs 1099-vs-w2 spoke; /paycheck-calculator/ vs /tax-bracket-calculator/ and /guides/how-much-tax-will-i-pay/ (take-home vs tax owed); no merges.
2. No metadata rows this run; car loan metadata lever left to GSC-gated Phase 2 in a later run.
3. Create /salary-calculator/ and /paycheck-calculator/ (Phase 3c builds: islands, src/lib engines, CalculatorDef, LIVE_IDS) with closed IRS fact lists and evidence packets.
4. Independent Phase 4 audit of both rendered pages (HIGH profile, replay reference calc).
5. No body-text rows: /tax-bracket-calculator/ is a documented no-addition (existing calculator and guide answer tax owed); N/A.
6. Add approved inbound links to both new pages from /budget/, 1099-vs-w2 spoke, how-to-make-a-budget guide, /pto-cashout/, /tax-bracket-calculator/ (the only A3 change); outbound as briefed. Link-only edits do not bump dates.
7. Add 2 routes to sitemap with lastmod; refresh tax-bracket lastmod; prepare IndexNow list, no pre-deploy ping.
8. Summary incl. cluster accounting (444 clusters dispositioned) and growth.json registration.
9. Commit, land on default branch, host-provenance proof, rendered-audit live compare, 200-verify, submit verified URLs to IndexNow.

Publication scope: commit: True, push: True, liveVerification: True, indexNow: True

## Preparation check

| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-15-keyword-gap-run/readiness.md) |

Approve this plan to start the listed content work?
