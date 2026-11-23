---
mindmap_pass_date: 2026-11-23
source: "reports/mindmap-pass/2026-11-23-trend-lane-c-run/brief.txt"
interpreted_brief: "Our 10 top-clicking Google queries for the 7 days ending 2026-11-23 plus our own research on what is missing. Research found one uncovered reader query, 'rule of 78 calculator' (3 impressions, position 64, 170/mo measured US demand, 1,000/mo for 'rule of 78'); the other nine queries are covered by existing pages or are an operator string. Build the one missing page as a free deterministic calculator that shows how the Rule of 78 allocates loan interest and what early payoff costs versus an actuarial refund."
status: pending-chart-review
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [coverage / top-10] Lane B: 'rule of 78 calculator' (0 clicks, 3 impr, pos 64.33) is UNCOVERED. Lens 1 direct intent; Lens 2 cluster 'Rule of 78 loan interest': rule of 78 1,000/mo; what is the rule of 78 210; rule of 78 calculator 170; rule of 78 loan 140; rule of 78 formula 90 (DataForSEO US 2026-11-23, KD 0 modeled). lookup: no match (none of 875 repo pages / 890 sitemap routes, no redirect, no commit). Nearest neighbours /auto-loan/early-payoff-calculator/ (simple-interest extra payments) and /loan-payment-calculator/ (level payment) do not allocate interest by sum of the digits. Site has no engine for it. | Create /rule-of-78-calculator/ [calculator]: reader enters loan amount, APR, term, payment number of payoff; tool shows the Rule-of-78 interest earned and payoff refund versus the actuarial refund, the dollar difference, and a month-by-month allocation. BUILT in Phase 3c from new src/lib/rule-of-78.ts reusing computeLoanPayment for the level payment. | create new content | /rule-of-78-calculator/ | calculator - searchers want a personalized interest-split and payoff-refund figure | interactive tool | interactive tool | winnable (AI Overview) | Top 10 are small calculator sites (cleartali, loanamortizationcalculator.app, solvefree, calcwarehouse); 0 major platforms, no forums; AI Overview cites goldpointsystems.com, investopedia.com, youtube.com; PAA off-intent generic loan math. | How does the Rule of 78 split my loan interest, and how much more does it cost me to pay the loan off early? [PAA 0/6 on-topic; 6/6 off-topic: generic loan math; ac 10/10 corroborate rule-of-78 question family] | Verdict/figure: the Rule of 78 front-loads interest by sum of the digits, so an early payoff refunds less unearned interest than the actuarial method; the extra cost is small on short or low-rate loans and larger on long, high-rate ones (for example $28.65 on $15,000 at 7% for 48 months paid off after 12 payments), and federal law (15 U.S.C. 1615(b)) bars it for precomputed consumer loans over 61 months. | section 1: "Rule of 78 Calculator" (calculator plus opening answer block) | A1 |

## Original request and acceptance

Capture the one uncovered top-10 query with a useful, accurate, YMYL-safe page and drop everything already covered.

- **id:** REQ-1
**description:** Evaluate and, if it fits, build the uncovered query 'rule of 78 calculator' (tool row via Phase 3c because it needs new src/lib engine code).
**acceptance:** A live /rule-of-78-calculator/ page with a working client-side calculator whose figures come from a new tested src/lib/rule-of-78.ts engine, with statute claims limited to 15 U.S.C. 1615 as verified.
**actionIds:** - A1
- **id:** REQ-2
**description:** Drop the other top-10 queries already covered by existing pages, recording reasons; no metadata or redirect rows; additive only; 25-page cap.
**acceptance:** Exclusions list accounts for every other top-10 query with its existing page; chart has no metadata/consolidation rows.
**actionIds:** - A1

### Presentation — A1

**medium:** interactive tool
**placement:** Opening answer block, then the calculator directly beneath it in section 1
**reason:** The dollar difference depends on amount, APR, term and payoff month, which a finite table cannot cover; the static answer and a worked example stay readable without interaction.
**readerInputs:** - Loan amount
- APR
- Term in months
- Payment number at which the loan is paid off
**interaction:** **decision:** build
**reason:** Four inputs change the refund difference, so a reader can see their own loan; a static table shows only one example.
**animation:** **decision:** not-useful
**reason:** A static allocation chart/table shows the front-loading faster; no motion needed.

## Emerging search patterns (clusters)

- Rule of 78 loan interest | rule of 78 (1,000); what is the rule of 78 (210); rule of 78 calculator (170); rule of 78 loan (140); rule of 78 formula (90) | coverage gap at theme level: no page and no engine | create new content | /rule-of-78-calculator/ | calculator | interactive tool

## Exclusions

- site:themodernwallet.com: operator string, not a reader query.
- 20000 for 72 months: already covered by /auto-loan/ calculators (pos 2).
- 401k roth traditional: covered by compare/roth-401k-vs-traditional-401k.
- am i on track to retire: covered by /retirement/ calculators.
- best financial way to buy a car and best way to buy a car financially: covered by compare/buying-vs-leasing-a-car and compare/new-car-vs-used-car.
- cheap wills: covered by roundup/best-online-will-makers and compare/online-will-vs-lawyer.
- investment portfolio calculator: covered by /portfolio/.
- living trust services: covered by roundup/best-living-trust-services.
- Lens 2b: no transferable modifier wrapper in brief; Lens 3b skipped (not an AI-content repo); Lens 3: no comparable vendor entity.
- Rejected off-topic rule-of-78 families: aircraft rules 1937, sales-pipeline rule of 78, ATO. No metadata, consolidation or redirect rows.

## New-page briefs

### A1 — /rule-of-78-calculator/

**Identity**

**title:** Rule of 78 Calculator: Payoff Refund vs Actuarial
**pageType:** calculator
**format:** calculator - searchers want a personalized interest-split and payoff-refund figure
**medium:** interactive tool

**Reader and answer**

**question:** How does the Rule of 78 split my loan interest, and how much more does it cost me to pay the loan off early? [PAA 0/6 on-topic; 6/6 off-topic: generic loan math; ac 10/10 corroborate rule-of-78 question family]
**answer:** Verdict/figure: the Rule of 78 front-loads interest by sum of the digits, so an early payoff refunds less unearned interest than the actuarial method; the extra cost is small on short or low-rate loans and larger on long, high-rate ones (for example $28.65 on $15,000 at 7% for 48 months paid off after 12 payments), and federal law (15 U.S.C. 1615(b)) bars it for precomputed consumer loans over 61 months.
**placement:** section 1: "Rule of 78 Calculator" (calculator plus opening answer block)

**Keyword evidence**

Primary 'rule of 78 calculator' 170/mo US KD 0; supporting 'rule of 78' 1,000, 'what is the rule of 78' 210, 'rule of 78 loan' 140, 'rule of 78 formula' 90, 'is the rule of 78 legal' 10. Provider DataForSEO (SEMRUSH HTTP 403), US, checked 2026-11-23; volumes bucketed, KD modeled; 'rule of 78 vs simple interest' 75 and 'rule of 78 example' 150 are autocomplete estimates, not measured. GSC: 3 impressions at position 64.33. Files: research/keyword-volumes.json, keyword-expand.json, autocomplete csv.

**SERP and questions**

SERP winnable, 8 organic, small calculator sites, AI Overview (goldpointsystems, investopedia, youtube), no featured snippet. PAA off-intent (generic loan interest, 0/6 on-topic), so FAQ is built from the autocomplete family: what is the rule of 78, formula, example, is it legal, rule of 78 vs simple interest/actuarial, car loan, how to ask for a payoff statement. Limit: we cannot rely on PAA; the opening answer is driven by the keyword family.

**Why a new page**

Coverage lookup found no home. Closest routes /auto-loan/early-payoff-calculator/, /loan-payment-calculator/ and /personal-loan/extra-payment-calculator/ answer simple-interest extra-payment and level-payment questions; none computes sum-of-the-digits allocation or the payoff refund difference. git log -S for the topic empty; HEAD 735f8af. Independent duplicate review is the CHART-REVIEW decision.

**Planned outline**

- **heading:** Rule of 78 Calculator
**purpose:** Opening answer sentence plus the calculator (amount, APR, term, payoff payment number); outputs Rule-of-78 refund, actuarial refund, extra interest the lender keeps.
- **heading:** How the Rule of 78 Splits Your Interest
**purpose:** Sum-of-the-digits formula with the n(n+1)/2 denominator, a worked example from the engine, and an interest-by-month table.
- **heading:** What Early Payoff Costs Under the Rule of 78
**purpose:** Engine cases across amount/APR/term showing when the gap is small versus large and that it falls to zero at maturity.
- **heading:** Is the Rule of 78 Legal?
**purpose:** 15 U.S.C. 1615(b): refund must be at least as favorable as actuarial for precomputed consumer credit over 61 months consummated after Sept 30, 1993; terms of 61 months or less are not covered by that provision; state law and contract not asserted, readers told to check.
- **heading:** Who This Is Not For
**purpose:** Simple-interest loans (most auto, personal and mortgage loans) where the Rule of 78 does not apply; business loans and non-U.S. loans.
- **heading:** What Would Change Our Answer
**purpose:** Contract uses actuarial or simple interest; term over 61 months; state law; payoff statement shows a different refund.
- **heading:** Rule of 78 Questions
**purpose:** FAQs in sentence case: what is it, formula, is it legal, car loan, how to get a payoff statement, vs simple interest.

**Contribution and evidence**

Decision gap: readers searching the calculator cannot see the dollar cost of Rule-of-78 vs the actuarial method on their own loan. Basis calculated (own engine run, reproducible) plus reported (statute, CFPB). Provenance: scope = fixed-rate precomputed installment loan, level payments, whole months; limits = no fees, no state law, no rebate-on-default; publicMethod = on-page method note and formula. Primary sources checked 2026-11-23: https://www.law.cornell.edu/uscode/text/15/1615 (LII mirror of the U.S. Code; house.gov and govinfo 404 from runner) and https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/ (last reviewed Jan 30, 2024). Feasibility: $15,000/7%/48 mo after 12 payments Rule 78 earns $971.99 vs actuarial $943.34 ($28.65 gap); after 42 payments $3.30; $25,000/8%/60 after 12: $88.13; $30,000/9%/72 after 24: $227.82. Counterexample: loans of 61 months or less are outside the federal ban, and at maturity the two methods agree.

**Tables, tools or visuals**

Calculator inputs: loan amount, APR (0-30%), term months (1-120), payoff after payment number k. Outputs: level payment (computeLoanPayment), total finance charge, Rule-of-78 interest earned and refund, actuarial interest earned and refund, difference, plus an interest-allocation-by-month table (Rule 78 vs actuarial). Formula: earned_k = total interest x sum(n-k+1..n) / (n(n+1)/2). Default preset $15,000 / 7% / 48 / 12. Inline SVG or table bar of the two refunds; static worked example readable without interaction. Phase 3c: client-side, data-tool="rule-of-78-calculator", <= ~30 KB gz, mirrors loan-payment-calculator wiring (calculators.ts entry, islandId, LIVE_IDS) with src/lib/rule-of-78.ts and a unit-tested engine.

**Testing and review**

_experience.md section G excludes financial services from testing claims and this is a formula calculation, so TESTED format OFF (--tested no); no 'tested' byline or schema. Visible attribution: 'In our internal modeling, we compared the Rule of 78 with the actuarial method...' beside the first finding, with the method note nearby. Review profile expected HIGH-adjacent (statute and finance figures), independent risk assessment decides; consequential claim is the 15 U.S.C. 1615 scope statement. No professionalReviewRequired flag (explanatory, no personalized advice). Byline/Person JSON-LD template-rendered; disclaimer at page bottom only.

**Planned takeaway**

Rule of 78 pushes interest into the early months, so paying a precomputed loan off early refunds less than the actuarial method would; on short or low-rate loans the extra cost is tens of dollars, on long high-rate loans it can exceed $200, and it vanishes near maturity. Federal law bars it only for precomputed consumer loans over 61 months, so a shorter precomputed loan may still use it depending on contract and state law. Applies to precomputed loans only; what would change it: a simple-interest or actuarial contract, a term over 61 months, or a payoff statement (requestable under 15 U.S.C. 1615(c), one free per year) showing a different refund. Based on our internal modeling plus the cited statute and CFPB.

**Inbound internal links**

**required:** 3
**placements:** - **source:** /auto-loan/early-payoff-calculator/
**target:** /rule-of-78-calculator/
**section:** Common mistakes (precomputed interest bullet) and FAQ on prepayment
**anchor:** Rule of 78 calculator
**purpose:** Readers with a precomputed loan see how the refund is computed
**inspection:** **path:** src/data/spokes-auto.ts
**sha256:** 56a43e9202273db3ee30b9724a40d3fc455b6a209a5efaa477718287a0e7a66d
- **source:** /loan-payment-calculator/
**target:** /rule-of-78-calculator/
**section:** How it works / FAQ on extra payment savings
**anchor:** Rule of 78 interest and early payoff refund
**purpose:** Loan-payment readers learn the precomputed-loan exception to the amortization split
**inspection:** **path:** src/data/calculators.ts
**sha256:** 4275008f54155466058aac9fc2b6107a7c2daabe19feff4142f4cfba49c8d9e1
- **source:** /personal-loan/extra-payment-calculator/
**target:** /rule-of-78-calculator/
**section:** FAQ: Do personal loans have prepayment penalties?
**anchor:** how the Rule of 78 works
**purpose:** Prepayment-penalty readers get the precomputed refund method
**inspection:** **path:** src/data/spokes-personal-loan.ts
**sha256:** fd4c51057b0822c98ccae9260ce879747c3895772775898c95bf4a6adf2a01f6

**Outbound internal links**

**placements:** - **source:** /rule-of-78-calculator/
**target:** /loan-payment-calculator/
**section:** How the Rule of 78 Splits Your Interest
**anchor:** loan payment calculator
**purpose:** Level payment and actuarial amortization for the same loan
**inspection:** **path:** src/data/calculators.ts
**sha256:** 4275008f54155466058aac9fc2b6107a7c2daabe19feff4142f4cfba49c8d9e1
- **source:** /rule-of-78-calculator/
**target:** /auto-loan/early-payoff-calculator/
**section:** Who This Is Not For
**anchor:** auto loan early payoff calculator
**purpose:** Simple-interest loans: savings from extra payments
**inspection:** **path:** src/data/spokes-auto.ts
**sha256:** 56a43e9202273db3ee30b9724a40d3fc455b6a209a5efaa477718287a0e7a66d

**Technical and measurement scope**

Route /rule-of-78-calculator/ at root like loan-payment-calculator: new entry in src/data/calculators.ts (id/islandId rule-of-78-calculator), add to LIVE_IDS in src/data/registry.ts, island component src/components/Rule78Calculator.tsx wired in CalculatorIsland.tsx, engine src/lib/rule-of-78.ts, JSON-LD/SoftwareApplication via existing builders, canonical self-referential, sitemap routed by existing generator, IndexNow after live 200. Measurement: growth.json hypothesis 'a dedicated calculator wins impressions for the rule-of-78 query family'; baseline = 3 GSC impressions at pos 64.33 for the exact query (7-day window to 2026-11-23, property themodernwallet.com); status not-yet-published, age-matched comparator; no uplift claimed.

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
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-23-trend-lane-c-run/readiness.md) |

Approve this plan to start the listed content work?
