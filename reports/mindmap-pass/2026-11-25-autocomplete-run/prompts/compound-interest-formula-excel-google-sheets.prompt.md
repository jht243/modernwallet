# Approved Page Assignment: `/guides/compound-interest-formula-excel-google-sheets/` (`compound-interest-formula-excel-google-sheets`)
- **Action ID:** `A3` (create new content)
- **Active Mindmap Track:** `guide`
- **Title:** Compound Interest Formula in Excel and Google Sheets
- **Page Type / Format / Medium:** guide | article - mechanism with copy-paste formulas | text
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** How do I calculate compound interest in Excel or Google Sheets? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 28/313 completions are excel/sheets/formula how-tos]
- **Working Answer (Col 11):** Use =FV(rate/n, n*years, -monthly deposit, -principal) or =P*(1+r/n)^(n*t); the page gives both with verified outputs (mechanism).
- **Answer Placement (Col 12):** section 1: How to Calculate Compound Interest in Excel and Google Sheets

## Demand & Differentiation Context
- **Problem / Gap:** lens 1/2: 'compound interest calculator excel / google sheets / formula / spreadsheet / template' 28 completions. Source: estimate (autocomplete) NOT measured. lookup: /investing/compound-interest-calculator/ is a web tool; no spreadsheet formula page (/guides/how-is-savings-account-interest-calculated/ covers savings interest only).
- **Keyword Evidence:** "Primary 'compound interest calculator excel / google sheets / formula (28 mapped completions)' and supporting phrases from the Autocomplete CSVs (candidate IDs in candidate-dispositions.csv). Source: estimate (autocomplete) NOT measured; no SEMRUSH/DataForSEO key in this run (checked 2026-11-25). Country/database: US."
- **Why New Page / Angle:** Closest routes: /investing/compound-interest-calculator/ (web tool), /guides/how-is-savings-account-interest-calculated/ (savings APY), /guides/retirement-calculator-spreadsheet-template/ (retirement only). None gives compound-interest spreadsheet formulas. No commits touch the route.
- **Intent-Based Our Takeaway:** "Use =FV(rate/periods, periods*years, -payment, -principal) for deposits or =P*(1+r/n)^(n*t) for a lump sum; results match the web calculator. Applies to fixed-rate compounding; changes for variable rates or taxes."

## Eligible Internal & Testing Evidence Pool for Page Type `regulated-legal-or-financial` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

## Approved Section Outline
1. **How to Calculate Compound Interest in Excel and Google Sheets** — Answer: two formulas with output
2. **The Compound Interest Formula Step by Step** — A=P(1+r/n)^(nt) with a worked $10,000 example
3. **Adding Monthly Contributions With FV** — FV syntax from Microsoft documentation; sign convention
4. **Daily, Monthly and Yearly Compounding Compared** — Table of results for one balance
5. **Common Spreadsheet Mistakes** — Rate/period mismatch, sign errors
6. **Compound Interest Spreadsheet FAQs** — Completions-derived questions

## Approved Internal Outbound Links
- {"source": "/guides/compound-interest-formula-excel-google-sheets/", "target": "/investing/compound-interest-calculator/", "section": "Opening answer", "anchor": "compound interest calculator", "purpose": "Reader-specific inputs", "inspection": {"path": "src/data/spokes-investing.ts", "sha256": "4e385bb2f5d652542163ce6df015c804221e24eb02d76dd2ad89d402d66ee480"}}
- {"source": "/guides/compound-interest-formula-excel-google-sheets/", "target": "/guides/how-is-savings-account-interest-calculated/", "section": "Daily vs monthly compounding", "anchor": "how savings account interest is calculated", "purpose": "Related mechanism", "inspection": {"path": "src/data/guides.ts", "sha256": "c5be292d100c82cf37393826982c55207d01bd93b9257438aa3f970aff038f76"}}

## Reviewer Guardrails (Must Respect)
- CR2 (substantive): WRITE must compute every state cell as effective rate x $400,000 / 12 from the saved table (NJ and IL $627, HI $97, DC listed separately), state the range as about $97 to $627, and drop 'over $700'. Cite 2024 ACS 5-year basis and that county rates vary (NJ counties run 0.93% to 2.47% in the same source). Record a guardrail for AUDIT to recheck the inherited PITI FAQ NJ 'over 2.1%' wording (rendered-page-audit inherited contradiction); fix it in Phase 6/5 as a targeted edit or note it.
- CR3 (substantive): In WRITE add an outbound link to /debt-consolidation-calculator/ near the 'How the Calculator Works' or FAQ section and one sentence distinguishing the two tools; keep the avalanche vs snowball vs minimums result in section 1. Reader question evidence tag should read 'ac-only' since completions exist (see CR6).
- CR4 (substantive): No change required for this run. Record in the exclusions that the primary source route exists (FR 2026-21796) so a later run can draft SS benefit-formula/earnings-test pages; update the D-SS reason text on next pass. Do not draft SS pages now without a saved verbatim source.
- CR5 (minor): Carry as a reviewer guardrail: BUILD/MAIN may leave CSV as is for this unattended run, but the final summary must not claim these specific completions are answered; list them as 'covered by blanket seed route, unverified per completion' or 'out of A4/A5 scope'. For A5 add 'with increasing contributions' or 'catch-up' only if natural; do not add a drawdown section.
- CR7 (substantive): WRITE must save the Google Sheets FV page verbatim to research/sources/ before drafting and cite it first-use; state the monthly-deposit/n condition in the opening answer and takeaway (use n=12 for monthly deposits, or separate rate per deposit period). Execute and save the Python verification of every formula output shown.
- REQ-2 (requestCoverage): A1, A3, A4 pass the same-intent check (closest routes named, none answers the question). A2 fails: /paycheck-calculator/ already answers the 401(k) take-home question with the same method (CR1). Requirement is met once A2 is pruned.
- CR1: A2 duplicates the existing live /paycheck-calculator/ (published 2026-11-15), which already takes pre-tax retirement contributions, applies 2026 IRS brackets and standard deduction, outputs per-paycheck take-home and has an FAQ answering 'How does a 401(k) contribution change my take-home pay?' with the same mechanism A2 proposes. A2's whyNewPage claims 'None shows per-paycheck take-home' and the readiness row claims 401k-calculator has no paycheck view without naming /paycheck-calculator/; the coverage_lookup row returned 'none found', and a failed lookup does not prove absence.
- CR2: The A4 answer and takeaway state property tax adds 'over $700' a month in New Jersey on a $400,000 home. The saved Tax Foundation source gives NJ and Illinois 1.88% (2024 ACS), i.e. $627/month; Hawaii is 0.29%, i.e. $97/month. The existing /mortgage/piti-calculator/ FAQ also says NJ 'over 2.1%', which now contradicts the new page.
- CR3: A1 whyNewPage omits the existing /debt-consolidation-calculator/, which already simulates several debts month by month. Intent differs (consolidation loan vs keep, not payoff order), so no collision, but the brief should say so and link it. /compare/debt-snowball-vs-avalanche/ also already has a worked two-method example, so A1 must lead with the interactive three-strategy result, not another explainer.
- CR4: Deferral reason 'ssa.gov 403, cannot be primary-sourced' is true for ssa.gov (reproduced on five SSA URLs) but overstated: SSA's Federal Register COLA/other-determinations notice (FR 2026-21796, 2026-10-26) is available via govinfo.gov PDF and federalregister.gov API and contains bend points and earnings-test exempt amounts. Deferral is conservative and harmless, not a liabilityBlock.
- CR5: Disposition granularity: 636 of 659 'covered' rows use one of three blanket seed-level reason strings. Some completions are not clearly served by the named routes (for example '401k vesting calculator', '401k hardship calculator', '401k calculator solo', where coverage-lookup showed no home or only a comparison). Also A4 absorbs city completions (austin, chicago, houston, nyc, long island, philadelphia) and 'mortgage calculator piti' that a state table does not answer, and A5 absorbs 'how long will it last', 'drawdown', 'lump sum', 'catch up', 'profit sharing' and 'increasing contributions' which the A5 section scope (stop contributing, inflation-adjusted, no match) does not cover (existing /investing/withdrawal-calculator/ and /retirement/retirement-income-calculator/ cover drawdown).
- CR6: Reader-question evidence tags read '[verb-only - no PAA, no completions: ...; ac 181/294 ...]' although completions exist; per build-brief Step 4.6 the verb-only tag means no PAA and no completions returned. A3 testingAndReview carries copy-pasted 'HIGH factual profile for tax figures'. A4 whyNewPage says PITI has 'no state data' while its FAQ has a Hawaii/NJ range. A1 inbound placement section 'Which should you choose' is 'Which method should you choose?' in source.
- CR7: A3 defers 'Google Sheets FV uses the same arguments (verify in WRITE with a second saved source)'. Per _rendered-page-audit.md preparation must finish research that supports the proposed answer. The Google Docs Editors help page for FV is reachable (curl returned 'FV(rate, number_of_periods, payment_amount, [present_value], [end_or_beginning])'). Also the headline answer =FV(rate/n, n*years, -monthly deposit, -principal) is valid only when the deposit frequency equals the compounding frequency n.

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"calculated"`: include honest visible internal calculation/modeling attribution matching `execution` output with explicit visible assumptions + counterexample (never claim hands-on product testing or `(Tested YYYY)` unless `basis` is `"measured"` with executed `runs:[{testedAt}]`).
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-write",
  "route": "/guides/compound-interest-formula-excel-google-sheets/",
  "readerQuestion": "How do I calculate compound interest in Excel or Google Sheets? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 28/313 completions are excel/sheets/formula how-tos]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/approval-manifest.json",
      "sha256": "699acb869e892c7940c22cd1e6c866e11f523a0ff7dfafa57ac8ce982a23616c"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/chart-review.json",
      "sha256": "da4cb07f1b9686db6ebf29a2bb354c08a046bf27a546308e7174f04f490177b2"
    },
    "actionId": "A3"
  },
  "presentation": {
    "medium": "text",
    "placement": "Formulas and worked example in section 1",
    "reason": "Readers want paste-ready formulas and checkable outputs, not another widget",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "Static formulas and a result table answer it; the existing calculator is linked for reader-specific inputs"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static layout answers faster; no sequence to animate"
    }
  },
  "basis": "calculated",
  "decisionGap": "/investing/compound-interest-calculator/ is a web tool and /guides/how-is-savings-account-interest-calculated/ covers savings APY, but no page gives paste-ready Excel or Google Sheets formulas with verified outputs and the condition that makes the FV shortcut correct.",
  "finding": "For $10,000 at 5% for 10 years, =10000*(1+0.05/12)^(12*10) returns $16,470.09 (monthly), $16,436.19 (quarterly), $16,288.95 (yearly) and $16,486.65 (daily, n=365). With $200 deposited each month and the same monthly compounding, =FV(0.05/12,12*10,-200,-10000) returns $47,526.55 (end-of-month deposits) and $47,655.95 with type=1 (start-of-month); the $34,000 paid in earns $13,526.55. The FV shortcut is correct only when the compounding period and the deposit period are the same: with monthly deposits but daily compounding, convert to an effective monthly rate, (1+0.05/365)^(365/12)-1, which gives $47,559.87. Passing the annual rate 5% with 120 monthly periods returns $4,880,767.80, and entering deposits as positive numbers returns a negative balance.",
  "conditions": "Fixed rate; same compounding and deposit period for the plain FV formula (use n=12 for monthly deposits); deposits at period end unless type=1; taxes and fees ignored; Excel and Google Sheets use the same argument order FV(rate, nper, pmt, [pv], [type]).",
  "whatWouldChange": "A variable rate, deposits and compounding on different schedules (needs an effective rate per deposit period), taxes or fees, or a spreadsheet function that changes its argument order or sign convention.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/compound-interest-formula-excel-google-sheets/cases.json",
    "sha256": "cb5ce61c164338b25343fb9343d57bac28c5a930f021da51cbe2c4807df00855"
  },
  "caseDecisions": "cases.json returned only generic Layer3Labs records matched on stopwords; none concern spreadsheet formulas or consumer finance, so no client or fleet case is used. caseUses is empty.",
  "sourceArtifacts": [
    {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/brief.txt",
      "sha256": "4a53fd90d16a609b6a883d858b050b9c3e7881e402fa713135bb1a14f8ca1516"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/candidate-dispositions.csv",
      "sha256": "7704ceb7a425204bcde9ada3d4c255e6311f6144c7ede801349aabef43955c38"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/research/coverage-lookup.txt",
      "sha256": "8ed3ecee4cde76da57df4d88097ccae88dc5619c6d045a2d56cca4c3d706e894"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/research/relevant-routes.txt",
      "sha256": "92c8e8e7a22f5885a54cbdf50c5d9db3a1dfc245d5298fef1b4d50d5abcfd1e5"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/research/sitemap-0.xml",
      "sha256": "0144b1168c599e5851736398f48c5ee805a928b4cd7a181b1725d3782fc27e15"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/microsoft-fv-function.txt",
      "sha256": "5b1857bf7a9a4b896f5ae36ea4e32d4f3eed415c3e3f4cc74ceb23eabd22b8c7"
    }
  ],
  "method": "Python re-implementation of FV(rate,nper,pmt,pv,type) = -(pv*(1+r)^n + pmt*(1+r*type)*((1+r)^n-1)/r) checked against Microsoft's documented example =FV(0.06/12,10,-200,-500,1)=2,581.40 and against a month-by-month loop for the $200 deposit case. Syntax and units note cited to Microsoft Support (FV function) and the Google Docs Editors Help (FV), both saved verbatim in research/sources.",
  "units": "USD",
  "limitations": "Fixed nominal rate with no taxes, fees or inflation; shows monthly, quarterly, yearly and daily compounding only; the Google Sheets help page states the consistent-units rule but not the sign convention, which comes from the Microsoft page.",
  "counterexample": "Monthly deposits with daily compounding break the plain FV(rate/12, ...) shortcut: the correct figure is $47,559.87 against $47,526.55, a $33.32 difference over 10 years. Using the annual rate with monthly periods overstates the result by about 100 times ($4,880,767.80).",
  "execution": {
    "command": [
      "python3",
      "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/compound-interest-formula-excel-google-sheets/model.py"
    ],
    "code": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/compound-interest-formula-excel-google-sheets/model.py",
      "sha256": "ea358c45ee906ecf78eb923176ed5c656e38a981a15179bca9444a0ac2dd3607"
    },
    "inputs": [
      {
        "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/microsoft-fv-function.txt",
        "sha256": "5b1857bf7a9a4b896f5ae36ea4e32d4f3eed415c3e3f4cc74ceb23eabd22b8c7"
      },
      {
        "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/google-sheets-fv-function.txt",
        "sha256": "cbe87adece8bba7070be3ce8082fad12c4e2f61a1edc67af8a3866bf93ffa729"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/compound-interest-formula-excel-google-sheets/output.json",
      "sha256": "595ecd5682c53ee2b1793cfac10341e84e81a11561e8ca9f82dd906144221d3a"
    }
  },
  "caseUses": [],
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [],
    "scopeAndLimits": "Fixed nominal rate with no taxes, fees or inflation; shows monthly, quarterly, yearly and daily compounding only; the Google Sheets help page states the consistent-units rule but not the sign convention, which comes from the Microsoft page.",
    "publicMethod": "On-page: each formula is shown with its inputs and result so readers can paste it into a sheet and compare.",
    "placement": "Formula block and worked table in section 1, with the same-frequency condition in the opening answer and takeaway."
  }
}
```

## Executed Scenario Model Output (`output.json` — Cite Exact Figures)
Cite exact figures from `output.json` below.
```json
{
  "lumpSum": {
    "P": 10000,
    "r": 0.05,
    "years": 10,
    "byFrequency": {
      "yearly": 16288.95,
      "quarterly": 16436.19,
      "monthly": 16470.09,
      "daily": 16486.65
    },
    "fvEquivalentMonthly": 16470.09,
    "continuousForComparison": 16487.21
  },
  "deposits": {
    "P": 10000,
    "r": 0.05,
    "years": 10,
    "monthlyDeposit": 200,
    "fvMonthlyEnd": 47526.55,
    "fvMonthlyBegin": 47655.95,
    "depositsOnly": 31056.46,
    "totalContributed": 34000,
    "interestEarned": 13526.55,
    "monthByMonthEnd": 47526.55
  },
  "mistakes": {
    "annualRateWithMonthlyPeriods": 4880767.8,
    "correct": 47526.55,
    "signError": -47526.55,
    "ratePerPeriodMissing": "rate must be annual rate divided by n when nper counts the same n periods per year"
  },
  "microsoftExample": {
    "formula": "=FV(0.06/12,10,-200,-500,1)",
    "result": 2581.4,
    "documented": 2581.4
  },
  "yearlyDeposits": {
    "formula": "=FV(5%,10,-2400,-10000)",
    "result": 46475.89
  },
  "mixedFrequency": {
    "effectiveMonthlyRate": 0.00417507,
    "fvUsingEffectiveMonthlyRate": 47559.87,
    "fvNaiveMonthlyRate": 47526.55,
    "note": "when deposit and compounding frequencies differ, convert to an effective rate per deposit period: (1+r/n)^(n/m)-1"
  },
  "apy": {
    "monthly": 0.051162,
    "daily": 0.051267
  }
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/mindmap-pass/2026-11-25-autocomplete-run/brief.txt`
```
Source: Google Autocomplete mining for https://themodernwallet.com (seeds: mortgage calculator, compound interest calculator, 401k calculator, debt payoff calculator, social security calculator). Completions are real live searches; keyword tools lag them, so zero measured volume does not veto a completion alone.
Unattended run: save the chart to reports/mindmap-pass/2026-11-25-autocomplete.md (exact name), treat Phase 0 manifest as approved, continue without stopping.
Input completions (all rows, unfiltered, every candidate ID kept) are in reports/keyword-pass/2026-11-25.autocomplete.{mortgage-calculator,compound-interest-calculator,401k-calculator,debt-payoff-calculator,social-security-calculator}.csv (1,570 rows total).

```
### `reports/mindmap-pass/2026-11-25-autocomplete-run/candidate-dispositions.csv`
```
candidate_id,seed,suggestion,via,disposition,reason
401k-calculator:001,401k-calculator,what 401k calculator should i use,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution-limits-2026/, /compare/rule-of-55-vs-72t/"
401k-calculator:002,401k-calculator,what 401k calculator do i need,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution-limits-2026/, /compare/rule-of-55-vs-72t/"
401k-calculator:003,401k-calculator,what 401k calculator do i use,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution-limits-2026/, /compare/rule-of-55-vs-72t/"
401k-calculator:004,401k-calculator,what 401k calculator to use,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution-limits-2026/, /compare/rule-of-55-vs-72t/"
401k-calculator:005,401k-calculator,what is 401k calculator,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution-limits-2026/, /compare/rule-of-55-vs-72t/"
401k-calculator:006,401k-calculator,what is rmd for 401k calculator,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution-limits-2026/, /compare/rule-of-55-vs-72t/"
401k-calculator:007,401k-calculator,what is the best 401k calculator,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution-limits-2026/, /compare/rule-of-55-vs-72t/"
401k-calculator:008,401k-calculator,how do i calculate my 401k,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution-limits-2026/, /compare/rule-of-55-vs-72t/"
401k-calculator:009,401k-calculator,what is 401k rule of 55,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution-limits-2026/, /compare/rule-of-55-vs-72t/"
401k-calculator:010,401k-calculator,how much will be in my 401k calculator,question:what,covered,"Covered by /retirement/401k-calculator/, /retirement/401k-loan-calculator/, /retirement/401k-early-withdrawal-calculator/, /retirement/rmd-calculator/, /roth-vs-traditional-401k-calculator/, /guides/401k-contribution
```
### `reports/mindmap-pass/2026-11-25-autocomplete-run/research/coverage-lookup.txt`
```
coverage_lookup: 53 candidate(s) vs 884 repo pages / 901 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1271 past-chart lines

### /guides/mortgage-calculator-with-taxes-and-insurance  — row - · create new content
keyword: mortgage calculator with taxes and insurance; mortgage calculator piti
reader question (new page intent): do mortgage calculators include escrow, property tax
lookup terms: mortgage taxe insurance piti   format cues: calculator

Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:
- /mortgage/piti-calculator  [in sitemap · src/data/spokes-mortgage.ts · topic match 0.5 on mortgage piti · same format: calculator]
    title: PITI Mortgage Calculator: All-In Monthly Payment
    desc:  Calculate your full PITI mortgage payment — principal, interest, property taxes, homeowner's insurance, and PMI — to see what you truly owe each month.
- /back-taxes-impact-calculator  [NOT IN SITEMAP (unreleased, or live but missing from the sitemap) · src/data/spokes-tax-resolution.ts · topic match 0.5 on mortgage taxe · same format: calculator]
    title: Back Taxes Impact Calculator: Mortgage, Passport, Credit
    desc:  Free back taxes impact calculator. See how IRS debt affects mortgage approval, passport, credit report, and CSED expiration in plain English.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-10-14-tool-usage.md [table] | 15 | Lens 2 (next tool after mortgage — the payoff persona with a lump sum asks recast vs extra payments). `mortgage recast calculator` 18,100/mo KD 8 (dataforseo measured, Autocomplete corroborated). lookup: no recast
- 2026-10-25.md [table] | 2 | **Lens 1 (direct intent — brief item 1, house buying).** `home buying checklist` **1,600/KD 5** (primary), `home buying process checklist` 1,000/KD 7, `what to look for when buying a house` 1,700/KD 0 (secondary on
- 2026-10-25.md [table] | 5 | **Lens 1 (direct intent — brief item 4, renting out as owner/landlord).** `tenant screening checklist` 250/KD 5 ($2.00 CPC), `first time landlord checklist` 200/KD 1, `landlord checklist` 150/KD 0, `rental property
- 2026-10-29-xtrends.md [table] | Lens 1 direct intent + news-driven (Zillow and Thumbtack 2026 study, Fox Business 2026-10-22). 'hidden cost of owning a home' 210/mo KD 4, 'cost of owning a home calculator' 170/mo KD 25, 'home maintenance cost calcula
- 2026-11-04-tool-usage.md [table] | 6 | self-employment-tax (40 people, 42 uses, 117 views; data_days 27). Walkthrough: $420 profit shows $59 SE tax though net earnings $387.87 < $400 owe none (Schedule SE line 4c); QBI phase-in warning tests gross incom
- 2026-11-16-comparison.md [table] | lookup: /compare/annuity-vs-cd and /compare/pension-vs-annuity - different pairings. Lens 1 direct intent (brief candidate 6). "annuity vs 401k" 1,600/mo KD 24 SEMRUSH; no page compares the two; SERP winnable. | Create
Commits naming the topic: none
Same run overlap: row - /guides/mortgage-calculator-by-state (0.75)

### /guides/how-much-mortgage-can-i-afford-on-my-salary  — row - · create new content
keyword: how much mortgage can i afford based on income; mortgage calculator based on salary
reader question (new page intent): How much mortgage can I afford on my income
lookup terms: mortgage afford salary based income   format cues: calculator

Possible existing homes: none found in the repo page data, the search inde
```
### `reports/mindmap-pass/2026-11-25-autocomplete-run/research/relevant-routes.txt`
```
/529-savings-calculator/
/annuity-calculator/
/auto-loan/amortization-schedule/
/auto-loan/car-affordability-calculator/
/auto-loan/early-payoff-calculator/
/auto-loan/interest-calculator/
/auto-loan/payoff-calculator/
/auto-loan/refinance-calculator/
/biweekly-mortgage-calculator/
/business-loan-payoff/
/car-loan-interest-deduction-calculator/
/commercial-mortgage-calculator/
/compare/15-year-vs-20-year-vs-30-year-mortgage/
/compare/15-year-vs-30-year-mortgage/
/compare/401k-loan-vs-heloc/
/compare/401k-vs-529/
/compare/401k-vs-brokerage-account/
/compare/401k-vs-ira-beneficiary-rules/
/compare/401k-vs-roth-ira/
/compare/403b-vs-401k/
/compare/457b-vs-401k/
/compare/457b-vs-roth-ira/
/compare/529-vs-roth-ira/
/compare/ai-investing-vs-robo-advisors/
/compare/annuity-vs-401k/
/compare/annuity-vs-cd/
/compare/annuity-vs-roth-ira/
/compare/assumable-mortgage-vs-refinance/
/compare/cash-out-refinance-vs-heloc/
/compare/construction-loan-vs-traditional-mortgage/
/compare/custodial-roth-ira-vs-529/
/compare/custodial-roth-ira-vs-brokerage-account/
/compare/custodial-roth-ira-vs-hysa/
/compare/custodial-roth-ira-vs-traditional-ira/
/compare/custodial-roth-ira-vs-trump-account/
/compare/custodial-roth-ira-vs-trust-fund/
/compare/custodial-roth-ira-vs-utma/
/compare/debt-settlement-vs-bankruptcy/
/compare/debt-snowball-vs-avalanche/
/compare/factor-rate-vs-interest-rate/
/compare/fixed-vs-arm-mortgage/
/compare/gusto-401k-vs-paychex-401k/
/compare/hsa-vs-roth-ira/
/compare/iul-vs-401k/
/compare/iul-vs-roth-ira/
/compare/medical-retirement-vs-disability-severance-pay/
/compare/military-retirement-vs-medical-retirement/
/compare/military-retirement-vs-va-disability/
/compare/mortgage-broker-vs-lender/
/compare/pay-off-mortgage-vs-invest/
/compare/pension-lump-sum-vs-annuity/
/compare/pension-vs-401k/
/compare/pension-vs-annuity/
/compare/rmd-vs-qcd/
/compare/rollover-ira-vs-roth-ira/
/compare/roth-401k-vs-traditional-401k/
/compare/roth-403b-vs-roth-ira/
/compare/roth-ira-vs-index-fund/
/compare/roth-ira-vs-roth-401k/
/compare/roth-ira-vs-traditional-ira/
/compare/sep-ira-vs-solo-401k/
/compare/simple-ira-vs-401k/
/compare/social-security-at-62-vs-70/
/compare/social-security-vs-401k/
/compare/sofi-invest-vs-robinhood/
/compare/solo-401k-vs-simple-ira/
/compare/traditional-ira-vs-401k/
/compare/trump-account-vs-roth-ira/
/compare/tsp-vs-401k/
/credit-card-interest-calculator/
/credit-card-payoff/
/debt-consolidation-calculator/
/debt-to-income-ratio-calculator/
/guides/15-year-mortgage-for-rental-property/
/guides/2027-cola-federal-military-retirees/
/guides/2027-social-security-cola/
/guides/40-year-mortgage-explained/
/guides/401k-beneficiary-rules/
/guides/401k-contribution-limits-2026/
/guides/401k-loan-rules/
/guides/529-investment-strategy-by-age/
/guides/am-i-ready-to-retire/
/guides/am-i-saving-too-much-for-retirement/
/guides/average-retirement-savings-by-age/
/guides/best-investment-account-for-kids/
/guides/bitcoin-retirement-calculator-considerations/
/guides/build-a-retirement-plan-in-8-steps/
/guides/can-i-retire-on-rental-income/
/guides/can-you-max-out-401k-and-ira/
/guides/can-you-retire-on-1-5-million-comfortably/
/guides/catch-up-on-retirement-savings-in-your-60s/
/guides/commercial-mortgage-calculator-explained/
/guides/current-mortgage-rates-guide/
/guides/custodial-roth-ira-for-kids/
/guides/dave-ramsey-12-percent-investment-return-explained/
/guides/defensive-investment-strategy/
/guides/does-retirement-income-count-as-incom
```
### `reports/mindmap-pass/2026-11-25-autocomplete-run/research/sitemap-0.xml`
```
<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>https://www.themodernwallet.com/</loc></url><url><loc>https://www.themodernwallet.com/529-savings-calculator/</loc></url><url><loc>https://www.themodernwallet.com/about/</loc></url><url><loc>https://www.themodernwallet.com/about/jonathan-teplitsky/</loc></url><url><loc>https://www.themodernwallet.com/alternatives/acorns/</loc><lastmod>2026-11-19T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/albert/</loc><lastmod>2026-11-21T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/ally-bank/</loc><lastmod>2026-11-20T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/betterment/</loc><lastmod>2026-11-20T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/bluevine/</loc><lastmod>2026-11-18T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/copilot-money/</loc><lastmod>2026-11-24T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/dave/</loc><lastmod>2026-11-19T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/empower/</loc><lastmod>2026-11-18T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/fidelity/</loc><lastmod>2026-11-22T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/freshbooks/</loc><lastmod>2026-11-16T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/gusto/</loc><lastmod>2026-11-22T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/legalzoom/</loc><lastmod>2026-11-16T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/m1/</loc><lastmod>2026-11-23T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/mercury/</loc><lastmod>2026-11-18T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/mileiq/</loc><lastmod>2026-11-21T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/monarch-money/</loc><lastmod>2026-11-17T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/novo/</loc><lastmod>2026-11-21T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/payoneer/</loc><lastmod>2026-11-23T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/paypal/</loc><lastmod>2026-11-22T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/quickbooks/</loc><lastmod>2026-11-13T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/quicken/</loc><lastmod>2026-11-13T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/robinhood/</loc><lastmod>2026-11-15T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/rocket-money/</loc><lastmod>2026-11-16T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives/simplifi/</loc><lastmod>2026-11-23T00:00:00.000Z</lastmod></url><url><loc>https://www.themodernwallet.com/alternatives
```
### `reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/microsoft-fv-function.txt`
```
CANONICAL URL: https://support.microsoft.com/en-us/office/fv-function-2eef9f44-a084-4c61-bdd8-4fe4bb1b71b3
FINAL URL: https://support.microsoft.com/en-us/excel/functions/fv-function
RETRIEVED UTC: 2026-11-25T08:13:37.279629Z



FV function | Microsoft Support

Skip to main content

Microsoft

Support

Support

Support

Home

Microsoft 365

Office

Products

Microsoft 365

Outlook

Microsoft Teams

OneDrive

Microsoft Copilot

OneNote

Windows

more ...

Devices

Surface

PC Accessories

Xbox

PC Gaming

HoloLens

Surface Hub

Hardware warranties

Account & billing

Resources

Community forums

Microsoft 365 Admins

Developer

Education

Report a support scam

Product safety

More

Buy Microsoft 365

All Microsoft

Global

Microsoft 365

Azure

Copilot

Windows

Surface

XBOX

Deals

Small Business

Support

Software
Software

Windows Apps

Outlook

OneDrive

Microsoft Teams

OneNote

Microsoft Edge

Moving from Skype to Teams

PCs & Devices
PCs & Devices

Computers

Shop XBOX

Accessories

VR & mixed reality

Certified Refurbished

Trade-in for cash

Entertainment
Entertainment

XBOX Game Pass Ultimate

PC Game Pass

XBOX games

PC games

Business
Business

Microsoft AI

Microsoft Security

Dynamics 365

Microsoft 365 for business

Microsoft Power Platform

Windows 365

Small Business

Digital Sovereignty

Developer & IT
Developer & IT

Azure

Microsoft Developer

Microsoft Learn

Support for AI marketplace apps

Microsoft Tech Community

Microsoft Marketplace

Software companies

Visual Studio

Other
Other

Microsoft Rewards

Free downloads & security

Education

Gift cards

Licensing

Unlocked stories

View Sitemap

Search
Search for help

No results

Cancel

Sign in

Sign in with Microsoft

Sign in or create an account.

Hello,

Select a different account.

You have multiple accounts

Choose the account you want to sign in with.

Related topics

Related topics

×

ABS

ACCRINT

ACCRINTM

ACOS

ACOSH

ACOT

ACOTH

ADDRESS

AGGREGATE

AMORDEGRC

AMORLINC

AND

ARABIC

AREAS

ARRAYTOTEXT

ASC

ASIN

ASINH

ATAN

ATAN2

ATANH

AVEDEV

AVERAGE

AVERAGEA

AVERAGEIF

AVERAGEIFS

BAHTTEXT

BASE

BESSELI

BESSELJ

BESSELK

BESSELY

BETA.DIST

BETA.INV

BETADIST

BETAINV

BIN2DEC

BIN2HEX

BIN2OCT

BINOM.DIST

BINOM.DIST.RANGE

BINOM.INV

BINOMDIST

BITAND

BITLSHIFT

BITOR

BITRSHIFT

BITXOR

BYCOL

BYROW

CALL

CEILING

CEILING.MATH

CEILING.PRECISE

CELL

CHAR

CHIDIST

CHIINV

CHISQ.DIST

CHISQ.DIST.RT

CHISQ.INV

CHISQ.INV.RT

CHISQ.TEST

CHITEST

CHOOSE

CHOOSECOLS

CHOOSEROWS

CLEAN

CODE

COLUMN

COLUMNS

COMBIN

COMBINA

COMPLEX

CONCAT

CONCATENATE

CONFIDENCE

CONFIDENCE.NORM

CONFIDENCE.T

CONVERT

COPILOT

CORREL

COS

COSH

COT

COTH

COUNT

COUNTA

COUNTBLANK

COUNTIFS

COUPDAYBS

COUPDAYS

COUPDAYSNC

COUPNCD

COUPNUM

COUPPCD

COVAR

COVARIANCE.P

COVARIANCE.S

CRITBINOM

CSC

CSCH

CUBEKPIMEMBER

CUBEMEMBER

CUBEMEMBERPROPERTY

CUBERANKEDMEMBER

CUBESET

CUBESETCOUNT

CUBEVALUE

CUMIPMT

CUMPRINC

DATE

DATEDIF

DATEVALUE

DAVERAGE

DAY

DAYS

DAYS360

DB

DBCS

DCOUNT

DCOUNTA

DDB

DEC2BIN

DEC2HEX

DEC2OCT

DECIMAL

DEGREES

DELTA

DETECTLANGUAGE

DEVSQ

DGET

DISC

DMAX

DMIN

DOLLAR

DOLLARDE

DOLLARFR

DPRODUCT

DROP

DSTDEV

DSTDEVP

DSUM

DURATION

DVAR

DVARP

EDATE

EFFECT

ENCODEURL

EOMONTH

ERF

ERF.PRECISE

ERFC

ERFC.PRECISE

ERROR.TYPE

EUROCONVERT

EVEN

EXACT

EXP

EXPAND

EXPON.DIST

EXPONDIST

F.DIST

F.DIST.RT

F.INV

F.INV.RT

F.TEST

FACT

FACTDOUBLE

False

FDIST

FIELDVALUE

FILTER

FILTERXML

FINV

F
```
### `reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/irs-401k-limits-2026-newsroom.txt`
```
CANONICAL URL: https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
FINAL URL: https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
RETRIEVED UTC: 2026-11-25T08:13:36.192033Z



401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500 | Internal Revenue Service

Skip to main content

An official website of the United States government

Here's how you know

Official websites use .gov

A .gov website belongs to an official government organization in the United States.

Secure .gov websites use HTTPS

A lock
( )
or https:// means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.

Search IRS tasks, forms, and answers

Suggestions

Information Menu

Sign in

Individual

Business

Tax Pro

Access your tax information with an IRS account.

Refunds

Payments

Tax records

Create account

Main navigation

File

Overview

INFORMATION FOR…

Individuals

Business and self-employed

Charities and nonprofits

International filers

Retirement

Governments and tax-exempt bonds

Indian Tribal Governments

FILING FOR INDIVIDUALS

How to file

When to file

Where to file

Update your information

POPULAR

Tax record (transcript)

Apply for an Employer ID Number (EIN)

Amend return

Identity Protection PIN (IP PIN)

Pay

Overview

PAY BY

Bank Account (Direct Pay)

Payment Plan (Installment Agreement)

Electronic Federal Tax Payment System (EFTPS)

POPULAR

Your Online Account

Tax Withholding Estimator

Estimated Taxes

Penalties

Refunds

Overview

About refunds

Direct deposit

Reduced refunds

Where’s my amended return?

Credits & Deductions

Overview

INFORMATION FOR...

Individuals

For you and your family

Businesses & Self-Employed

Standard mileage and other information

POPULAR

Earned Income Credit (EITC)

Child Tax Credit

Clean Energy and Vehicle Credits

Standard Deduction

Retirement Plans

Forms

Overview

POPULAR FORMS & INSTRUCTIONS

Form 1040

Individual Income Tax Return

Form 1040 Instructions

Instructions for Form 1040

Form W-9

Request for Taxpayer Identification Number (TIN) and Certification

Form 4506-T

Request for Transcript of Tax Return

Form W-4

Employee's Withholding Certificate

Form 941

Employer's Quarterly Federal Tax Return

Form W-2

Wage and Tax Statement

Form 9465

Installment Agreement Request

POPULAR FOR TAX PROS

Form 1040-X

Amended Individual Income Tax Return

Form 2848

Power of Attorney

Form W-7

Apply for an ITIN

Circular 230

Regulations Governing Practice before the IRS

Report Fraud

Overview

Tax fraud and scams

Identity theft

Fake IRS email or message

Tax return preparer misconduct

Help for tax professionals

Information Menu 2

Help

News

Tax Pros

English

Español
中文 (简体)
中文 (繁體)
한국어
Русский
Tiếng Việt
Kreyòl ayisyen

Help Menu Mobile

Sign in

Individual

Business

Tax Pro

Access your tax information with an IRS account.

Refunds

Payments

Tax records

Create account

File

Overview
INFORMATION FOR…
Individuals
Business and self-employed
Charities and nonprofits
International filers
Retirement
Governments and tax-exempt bonds
Indian Tribal Governments
FILING FOR INDIVIDUALS
How to file
When to file
Where to file
Update your information
POPULAR
Tax record (transcript)
Apply for an Employer ID Number (EIN)
Amend return
Identity Protection PIN (IP PIN)

Pay

Overview
PAY BY
Bank Account (Direct Pay)
Payment Plan (Installment Agreem
```
### `reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/irs-401k-contribution-limits-topic.txt`
```
CANONICAL URL: https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits
FINAL URL: https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits
RETRIEVED UTC: 2026-11-25T08:13:36.384955Z



Retirement topics - 401(k) and profit-sharing plan contribution limits | Internal Revenue Service

Skip to main content

An official website of the United States government

Here's how you know

Official websites use .gov

A .gov website belongs to an official government organization in the United States.

Secure .gov websites use HTTPS

A lock
( )
or https:// means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.

Search IRS tasks, forms, and answers

Suggestions

Information Menu

Sign in

Individual

Business

Tax Pro

Access your tax information with an IRS account.

Refunds

Payments

Tax records

Create account

Main navigation

File

Overview

INFORMATION FOR…

Individuals

Business and self-employed

Charities and nonprofits

International filers

Retirement

Governments and tax-exempt bonds

Indian Tribal Governments

FILING FOR INDIVIDUALS

How to file

When to file

Where to file

Update your information

POPULAR

Tax record (transcript)

Apply for an Employer ID Number (EIN)

Amend return

Identity Protection PIN (IP PIN)

Pay

Overview

PAY BY

Bank Account (Direct Pay)

Payment Plan (Installment Agreement)

Electronic Federal Tax Payment System (EFTPS)

POPULAR

Your Online Account

Tax Withholding Estimator

Estimated Taxes

Penalties

Refunds

Overview

About refunds

Direct deposit

Reduced refunds

Where’s my amended return?

Credits & Deductions

Overview

INFORMATION FOR...

Individuals

For you and your family

Businesses & Self-Employed

Standard mileage and other information

POPULAR

Earned Income Credit (EITC)

Child Tax Credit

Clean Energy and Vehicle Credits

Standard Deduction

Retirement Plans

Forms

Overview

POPULAR FORMS & INSTRUCTIONS

Form 1040

Individual Income Tax Return

Form 1040 Instructions

Instructions for Form 1040

Form W-9

Request for Taxpayer Identification Number (TIN) and Certification

Form 4506-T

Request for Transcript of Tax Return

Form W-4

Employee's Withholding Certificate

Form 941

Employer's Quarterly Federal Tax Return

Form W-2

Wage and Tax Statement

Form 9465

Installment Agreement Request

POPULAR FOR TAX PROS

Form 1040-X

Amended Individual Income Tax Return

Form 2848

Power of Attorney

Form W-7

Apply for an ITIN

Circular 230

Regulations Governing Practice before the IRS

Report Fraud

Overview

Tax fraud and scams

Identity theft

Fake IRS email or message

Tax return preparer misconduct

Help for tax professionals

Information Menu 2

Help

News

Tax Pros

English

Español
中文 (简体)
中文 (繁體)
한국어
Русский
Tiếng Việt
Kreyòl ayisyen

Help Menu Mobile

Sign in

Individual

Business

Tax Pro

Access your tax information with an IRS account.

Refunds

Payments

Tax records

Create account

File

Overview
INFORMATION FOR…
Individuals
Business and self-employed
Charities and nonprofits
International filers
Retirement
Governments and tax-exempt bonds
Indian Tribal Governments
FILING FOR INDIVIDUALS
How to file
When to file
Where to file
Update your information
POPULAR
Tax record (transcript)
Apply for an Employer ID Number (EIN)
Amend return
Identity Protection PIN (IP PIN)

Pay

Overview

```

# OUTPUT CONTRACT (THIS REPOSITORY)
Follow the `Output Schema (this repository)` rule in the system prompt. Return ONE JSON object, nothing else (no code fence).
House rules that apply to every string: no em-dashes (use a period, comma or colon), no semicolons joining clauses, headings in Title Case, FAQ questions in sentence case, define each acronym on first use (APR means annual percentage rate; FV means future value), link the first mention of every outside organization to a URL on the CLOSED URL LIST, never invent a number: every figure must appear in the evidence packet, `output.json` or the source excerpts above. Never claim we tested a product or interviewed anyone. Keep paragraphs to 3 sentences, mix sentence lengths, state the consequence of every feature. Do not pad to reach the floor: answer more of the reader's questions instead. The page opens with the working answer (sentence 1), then one tee-up sentence is optional (`teeup-exempt` is acceptable). No Conclusion or Summary heading. Disclaimers belong only in `disclaimerText`.
Also return `"reviewerNote": {"label": "Publisher's Take", "reviewedDate": "November 25, 2026", "note": "<exactly 2 sentences in Jonathan Teplitsky's voice, grounded in this page's verified facts and the Reviewer Voice & Career Profile if one is in this prompt; no em-dashes, no AI buzzwords, no invented personal stories>"}`.

Page: guide JSON for `/guides/compound-interest-formula-excel-google-sheets/` (page type: explainer/how-to guide; depth floor 1,200 body words). register: operator. medium: text.
Keys (exactly these): `title` (50 to 60 characters, primary keyword), `metaDescription` (130 to 160 characters), `h1`, `cardBlurb` (one sentence, at most 160 characters), `introText` (Markdown string, 2 to 3 short paragraphs separated by a blank line), `sections` (array of `{"heading": string, "body": Markdown string}`), `tools` (array of `{"href": "/internal-route/", "label": string}`, real internal calculators from the list below), `faqs` (array of `{"question": string, "answer": string}`, answer leads with the direct answer, Markdown links allowed), `sources` (array of `{"label": string, "url": string}`, URLs from the CLOSED URL LIST only), `disclaimerText` (one sentence: general educational information, not personalized financial advice), `reviewerNote`.

## Closed formula facts (all outputs verified in `output.json`)
Both Excel and Google Sheets use `FV(rate, nper, pmt, [pv], [type])` (Microsoft Support FV function page and Google Docs Editors Help FV page, both on the CLOSED URL LIST; link each at first mention). Cash you pay out (deposits, starting balance) is negative, so enter them as negatives to get a positive result (Microsoft page). Use the same units for rate and nper (both pages): 12%/12 and years*12 for monthly. Google Sheets page: `type` 0 (default) is payment at the end of each period, 1 is the beginning.
Lump sum, $10,000 at 5% for 10 years: `=10000*(1+0.05/12)^(12*10)` = $16,470.09 monthly; quarterly (n=4) $16,436.19; yearly (n=1) $16,288.95; daily (n=365) $16,486.65. `=FV(0.05/12,12*10,0,-10000)` = $16,470.09 (same as the power formula).
With $200 deposited every month and monthly compounding: `=FV(0.05/12,12*10,-200,-10000)` = $47,526.55 (deposits at the end of each month); with type 1 `=FV(0.05/12,12*10,-200,-10000,1)` = $47,655.95. Total paid in = $34,000, interest earned = $13,526.55. Deposits only (no starting balance) `=FV(0.05/12,12*10,-200)` = $31,056.46. A month-by-month loop gives the same $47,526.55.
Yearly deposits and yearly compounding: `=FV(5%,10,-2400,-10000)` = $46,475.89.
THE CONDITION (state it in the opening answer and in the takeaway): the `=FV(rate/n, n*years, -deposit, -principal)` shortcut is correct only when deposits are made as often as interest compounds (use n = 12 for monthly deposits and monthly compounding). If deposits are monthly but interest compounds daily, convert to an effective monthly rate `(1+0.05/365)^(365/12)-1` = 0.00417507 and use it as the rate: `=FV(0.00417507,12*10,-200,-10000)` = $47,559.87, against $47,526.55 from the naive monthly rate, a $33.32 difference over 10 years.
Mistakes (verified): passing the annual rate 5% with 120 monthly periods returns $4,880,767.80 instead of $47,526.55; entering deposits and starting balance as positive numbers returns -$47,526.55.
Microsoft's documented example: `=FV(0.06/12,10,-200,-500,1)` = $2,581.40.
Effective annual yield: 5% compounded monthly is 5.1162%; compounded daily 5.1267%.
The existing calculator page (`/investing/compound-interest-calculator/`) lets readers enter their own numbers. Say results match it only where the page's own inputs are the same; do not state that it uses the same formula unless the packet says so.

## Section plan (this order; headings in Title Case)
1. "How to Calculate Compound Interest in Excel and Google Sheets" (the answer: two formulas with outputs and the same-frequency condition; link the web calculator `[compound interest calculator](/investing/compound-interest-calculator/)` here). Include the first visible attribution sentence beginning "In our internal modeling, we" naming what we ran (the formulas on $10,000 at 5%) and that we checked them against a month-by-month loop and Microsoft's documented example.
2. "The Compound Interest Formula Step by Step" (A = P(1+r/n)^(nt), define each symbol, the $10,000 worked example).
3. "Adding Monthly Contributions With FV" (syntax from the two help pages, the sign convention, type 0 vs 1, the effective-rate fix for mixed frequency).
4. "Daily, Monthly and Yearly Compounding Compared" (a pipe table for the $10,000 example plus APY; link `[how savings account interest is calculated](/guides/how-is-savings-account-interest-calculated/)`).
5. "Common Spreadsheet Mistakes" (rate/period mismatch, sign errors, deposit and compounding mismatch; numbered list).
6. "Our Takeaway" paragraph inside the last body section or as its own section before the FAQs: use `=FV(rate/n, n*years, -deposit, -principal)` when deposits and compounding both use n; use the lump-sum power formula for no deposits; changes with variable rates, taxes or mismatched frequencies. Include Who this is not for (readers wanting a one-click answer should use the web calculator; variable-rate accounts need a different model) and What would change our answer.
- `faqs` (5 to 6, from completions): how to calculate compound interest in Excel; is compound interest calculated monthly or yearly; does the same formula work in Google Sheets; how to do quarterly or half-yearly compounding (n=4, n=2: only quarterly figure is verified $16,436.19; give the pattern without inventing half-yearly numbers); how to include monthly deposits; what rate to enter.
- `tools`: /investing/compound-interest-calculator/, /guides/retirement-calculator-spreadsheet-template/ (label it "Retirement spreadsheet template guide"), /guides/how-is-savings-account-interest-calculated/.
- Allowed internal links: /investing/compound-interest-calculator/, /guides/how-is-savings-account-interest-calculated/, /guides/retirement-calculator-spreadsheet-template/, /guides/mortgage-amortization-schedule-excel-template/, /retirement/retirement-savings-calculator/.
- `sources`: Microsoft Support FV function, Google Docs Editors Help FV (URLs on the CLOSED URL LIST).
- Do not offer a downloadable template and do not describe any file we have not built.
