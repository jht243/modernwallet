# Approved Page Assignment: `/debt-payoff-calculator/` (`debt-payoff-calculator`)
- **Action ID:** `A1` (create new content)
- **Active Mindmap Track:** `guide`
- **Title:** Debt Payoff Calculator: Snowball vs Avalanche
- **Page Type / Format / Medium:** calculator | interactive tool - inputs change payoff order and total interest | interactive tool
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** How long will it take to pay off all my debts and which one should I pay first? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 181/294 debt completions are payoff-method or schedule questions]
- **Working Answer (Col 11):** One result table showing payoff date and total interest for avalanche vs snowball vs minimums-only, with the payoff order (mechanism: pay minimums on all, send the extra to the target debt, roll freed payments).
- **Answer Placement (Col 12):** section 1: the calculator and its three-strategy result

## Demand & Differentiation Context
- **Problem / Gap:** lens 1/2: 'debt payoff calculator' cluster, 181 completions + 65 template/planner variants (avalanche, snowball, multiple loans/cards, extra payments, biweekly, lump sum, how long, payoff date). Source: estimate (autocomplete) NOT measured. lookup: /credit-card-payoff/ - single-card payoff only; /compare/debt-snowball-vs-avalanche - explainer without inputs; no multi-debt tool.
- **Keyword Evidence:** "Primary 'debt payoff calculator (181 mapped completions: multiple loans, extra payments, biweekly, lump sum, how long)' and supporting phrases from the Autocomplete CSVs (candidate IDs in candidate-dispositions.csv). Source: estimate (autocomplete) NOT measured; no SEMRUSH/DataForSEO key in this run (checked 2026-11-25). Country/database: US."
- **Why New Page / Angle:** Closest routes: /credit-card-payoff/ (one card), /compare/debt-snowball-vs-avalanche/ (explainer, no inputs), /guides/pay-off-debt-or-invest/ (different decision), /guides/how-to-pay-off-debt/. None lets a reader enter several debts. Coverage lookup 2026-11-25; no commits touch /debt-payoff-calculator/. Independent duplicate review at CHART-REVIEW.
- **Intent-Based Our Takeaway:** "Avalanche minimizes interest when APRs differ; snowball costs more but gives faster early wins; with equal rates or one dominant balance the choice barely matters. Applies to unsecured/installment debts you can prepay without penalty; would change if a debt has a prepayment penalty or a promotional 0% rate."

## Eligible Internal & Testing Evidence Pool for Page Type `regulated-legal-or-financial` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

## Approved Section Outline
1. **Debt Payoff Calculator** — Tool with debt rows, extra payment and lump sum; three-strategy result in section 1
2. **Snowball vs Avalanche on Your Numbers** — Result table: payoff date, total interest, order; explains the gap
3. **How the Calculator Works** — Monthly interest then payment allocation, rollover rule, minimum floors
4. **Worked Example: Three Debts and $200 Extra** — Fixed example with figures the tool reproduces
5. **Debt Payoff Calculator FAQs** — Completions-derived questions: how long, biweekly, lump sum, spreadsheet

## Approved Internal Outbound Links
- {"source": "/debt-payoff-calculator/", "target": "/guides/pay-off-debt-or-invest/", "section": "FAQ", "anchor": "pay off debt or invest", "purpose": "Next decision once a payoff plan exists", "inspection": {"path": "src/data/guides.ts", "sha256": "c5be292d100c82cf37393826982c55207d01bd93b9257438aa3f970aff038f76"}}
- {"source": "/debt-payoff-calculator/", "target": "/credit-card-payoff/", "section": "How the Calculator Works", "anchor": "credit card payoff calculator", "purpose": "Single-card detail and minimum-payment path", "inspection": {"path": "src/data/calculators.ts", "sha256": "bf981cefd061214c90b926f5beb17a1c4e1ed166d173801c05f7420a5c19fb42"}}

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
  "route": "/debt-payoff-calculator/",
  "readerQuestion": "How long will it take to pay off all my debts and which one should I pay first? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 181/294 debt completions are payoff-method or schedule questions]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/approval-manifest.json",
      "sha256": "699acb869e892c7940c22cd1e6c866e11f523a0ff7dfafa57ac8ce982a23616c"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/chart-review.json",
      "sha256": "da4cb07f1b9686db6ebf29a2bb354c08a046bf27a546308e7174f04f490177b2"
    },
    "actionId": "A1"
  },
  "presentation": {
    "medium": "interactive tool",
    "placement": "Calculator above the fold, strategy comparison and worked example below",
    "reason": "Reader inputs (balances, APRs, extra payment) change which strategy wins and the payoff date",
    "readerInputs": [
      "Debt balances",
      "APRs",
      "Minimum payments",
      "Extra monthly payment",
      "Lump sum"
    ],
    "interaction": {
      "decision": "build",
      "reason": "Order and interest depend on the reader's own balances and rates; a static table cannot show them"
    },
    "animation": {
      "decision": "use",
      "reason": "Month-by-month balance bars show how payoff order changes when the extra payment rolls over"
    }
  },
  "basis": "calculated",
  "decisionGap": "Existing pages explain avalanche vs snowball (/compare/debt-snowball-vs-avalanche/) or pay off one card (/credit-card-payoff/) or compare consolidating (/debt-consolidation-calculator/), but none lets a reader enter several debts and see payoff date, total interest and payoff order for avalanche, snowball and minimums-only side by side.",
  "finding": "For the worked example (store card $2,500 at 19.99% with $75 minimum, credit card $6,000 at 27.99% with $160 minimum, personal loan $11,000 at 11% with $280 minimum, plus $200 extra a month), avalanche clears all three debts in 34 months with $4,783.63 interest, snowball takes 35 months with $5,120.19 interest ($336.56 more), and paying only minimums takes 91 months with $12,291.39 interest. Avalanche pays the 27.99% card first, snowball pays the $2,500 card first (month 10) and the first win comes 12 months sooner. When APRs are equal the two cost the same interest.",
  "conditions": "Fixed APRs; interest added monthly at APR/12; no new charges or fees; the full monthly budget (sum of minimums plus extra) is paid every month with freed minimums rolling to the next debt; no prepayment penalty; minimums-only means no rollover and no extra. Applies to unsecured and installment debts that can be prepaid.",
  "whatWouldChange": "Equal APRs (the order stops mattering), a smallest balance that also has the highest APR (same plan), a 0% promotional rate or a prepayment penalty on one debt, or a minimum payment below monthly interest on a debt.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/debt-payoff-calculator/cases.json",
    "sha256": "89bc6c3cac986ea099a3a7b3723d58d545cd7f37e9eaa81f483bd50173df5504"
  },
  "caseDecisions": "cases.json returned only generic Layer3Labs records matched on stopwords ('for', 'what'); none concern consumer debt payoff, so no client or fleet case is used. caseUses is empty.",
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
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/cfpb-how-reduce-your-debt.txt",
      "sha256": "153c0241fb10c1a224546d37871bd8ee1c2741e1d230d32b0e117322566944e9"
    }
  ],
  "presentationArtifacts": [
    {
      "path": "src/lib/debt-payoff.ts",
      "sha256": "1be70cfc99b89fbf66f4fa771fffdb688302b3a73188b733f5d9442c350fcb40"
    },
    {
      "path": "src/components/DebtPayoffCalculator.tsx",
      "sha256": "cf8803e242f408e9fb72889cce331e4e084d0fcfef14a9b08c2d89e5ec730b02"
    }
  ],
  "method": "Deterministic month-by-month simulation. Each month: add interest (balance x APR / 12) to each open debt, pay each open debt its minimum (capped at its balance), then send the rest of the monthly budget (sum of original minimums + extra, plus any lump sum in month 1) to the target debt, spilling down the order. Avalanche order: highest APR first, ties smaller balance. Snowball order: smallest starting balance first, ties higher APR. Minimums-only: each debt gets only its minimum, no rollover. Independent Python implementation in model.py is replayed against the TypeScript engine src/lib/debt-payoff.ts in scripts/test-debt-payoff.mjs.",
  "units": "USD, months",
  "limitations": "Ignores new charges, fees, variable or promotional rates, daily compounding and lender rounding; assumes the reader pays the full budget every month.",
  "counterexample": "Two debts at the same 18% APR ($3,000 and $7,000, $150 extra): avalanche and snowball both finish in 30 months with $2,464.56 interest, so snowball costs nothing extra. When the smallest debt also has the highest rate ($1,500 at 26% and $9,000 at 9%) both methods choose the same order.",
  "execution": {
    "command": [
      "python3",
      "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/debt-payoff-calculator/model.py"
    ],
    "code": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/debt-payoff-calculator/model.py",
      "sha256": "9de5268aa058ac40c2fa89e5002e315eb006c3ac7f9854c946562db9b3278a2b"
    },
    "inputs": [
      {
        "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/brief.txt",
        "sha256": "4a53fd90d16a609b6a883d858b050b9c3e7881e402fa713135bb1a14f8ca1516"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/debt-payoff-calculator/output.json",
      "sha256": "bbbdf4a6bae38ae03a2a753e1c9e047264aff956e952797f4b7ea460fce3749f"
    }
  },
  "caseUses": [],
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [],
    "scopeAndLimits": "Ignores new charges, fees, variable or promotional rates, daily compounding and lender rounding; assumes the reader pays the full budget every month.",
    "publicMethod": "On-page: How the Calculator Works section states the monthly loop and the worked example lists each input; the tool itself lets readers rerun it.",
    "placement": "Calculator and three-strategy result table in section 1; worked example below the tool."
  }
}
```

## Executed Scenario Model Output (`output.json` — Cite Exact Figures)
Cite exact figures from `output.json` below.
```json
{
  "example": {
    "debts": [
      {
        "name": "Store card",
        "balance": 2500,
        "apr": 19.99,
        "min": 75
      },
      {
        "name": "Credit card",
        "balance": 6000,
        "apr": 27.99,
        "min": 160
      },
      {
        "name": "Personal loan",
        "balance": 11000,
        "apr": 11.0,
        "min": 280
      }
    ],
    "extraMonthly": 200,
    "lumpSum": 0,
    "totalBalance": 19500,
    "totalMinimums": 515,
    "avalanche": {
      "months": 34,
      "interest": 4783.63,
      "paid": 24283.63,
      "order": [
        1,
        0,
        2
      ],
      "payoffMonth": [
        26,
        22,
        34
      ]
    },
    "snowball": {
      "months": 35,
      "interest": 5120.19,
      "paid": 24620.19,
      "order": [
        0,
        1,
        2
      ],
      "payoffMonth": [
        10,
        27,
        35
      ]
    },
    "minimums": {
      "months": 91,
      "interest": 12291.39,
      "paid": 31791.39,
      "order": [
        2,
        0,
        1
      ],
      "payoffMonth": [
        50,
        91,
        49
      ]
    },
    "gap": {
      "snowballExtraInterest": 336.56,
      "monthsDifference": 1,
      "avalancheSavesVsMinimums": 7507.76,
      "monthsSavedVsMinimums": 57
    }
  },
  "lumpSumVariant": {
    "lumpSum": 2000,
    "avalanche": {
      "months": 30,
      "interest": 3323.03,
      "paid": 22823.03,
      "order": [
        1,
        0,
        2
      ],
      "payoffMonth": [
        19,
        14,
        30
      ]
    },
    "snowball": {
      "months": 30,
      "interest": 3634.37,
      "paid": 23134.37,
      "order": [
        0,
        1,
        2
      ],
      "payoffMonth": [
        2,
        19,
        30
      ]
    }
  },
  "counterexampleEqualRates": {
    "debts": [
      {
        "balance": 3000,
        "apr": 18,
        "min": 90
      },
      {
        "balance": 7000,
        "apr": 18,
        "min": 180
      }
    ],
    "extraMonthly": 150,
    "avalanche": {
      "months": 30,
      "interest": 2464.56,
      "paid": 12464.56,
      "order": [
        0,
        1
      ],
      "payoffMonth": [
        14,
        30
      ]
    },
    "snowball": {
      "months": 30,
      "interest": 2464.56,
      "paid": 12464.56,
      "order": [
        0,
        1
      ],
      "payoffMonth": [
        14,
        30
      ]
    }
  },
  "counterexampleSmallestIsHighest": {
    "debts": [
      {
        "balance": 1500,
        "apr": 26,
        "min": 50
      },
      {
        "balance": 9000,
        "apr": 9,
        "min": 200
      }
    ],
    "extraMonthly": 100,
    "avalanche": {
      "months": 35,
      "interest": 1611.43,
      "paid": 12111.43,
      "order": [
        0,
        1
      ],
      "payoffMonth": [
        12,
        35
      ]
    },
    "snowball": {
      "months": 35,
      "interest": 1611.43,
      "paid": 12111.43,
      "order": [
        0,
        1
      ],
      "payoffMonth": [
        12,
        35
      ]
    }
  },
  "minimumBelowInterest": {
    "debts": [
      {
        "balance": 5000,
        "apr": 30,
        "min": 100
      }
    ],
    "minimums": {
      "months": null,
      "interest": null,
      "paid": null,
      "order": [],
      "payoffMonth": [
        null
      ]
    },
    "avalancheWith150Extra": {
      "months": 29,
      "interest": 2017.96,
      "paid": 7017.96,
      "order": [
        0
      ],
      "payoffMonth": [
        29
      ]
    }
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
### `reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/cfpb-how-reduce-your-debt.txt`
```
CANONICAL URL: https://www.consumerfinance.gov/about-us/blog/how-reduce-your-debt
FINAL URL: https://www.consumerfinance.gov/archive/blog/how-reduce-your-debt/
RETRIEVED UTC: 2026-11-25T08:13:52.033028Z



How to reduce your debt | Consumer Financial Protection Bureau

Skip to main content

An official website of the
United States government

(855) 411-2372

Submit a Complaint

Search

Search

Close

Search

Open the main menu

Close the main menu

Submit a Complaint

Consumer Education

Back

Resources for Yourself

Consumer Advisories

Money Topics

Auto Loans

Bank Accounts & Services

Credit Cards

Credit Reports & Scores

Debt Collection

Fraud & Scams

Money Topics

Money Transfers

Mortgages

Payday Loans

Prepaid Cards

Private Student Loans

Reverse Mortgages

Additional Resources

Submit a Complaint

Plain Writing

Browse Ask CFPB

Rules & Policy

Back

Rules & Policy Overview

Final Rules

Interactive Regulations

Rules Under Development

Notices and Opportunities to Comment

Regulatory Agenda

Competition and Innovation

Advisory Committees

Enforcement

Back

Enforcement Overview

Payments to Harmed Consumers

2025 Enforcement Lookback

Enforcement Actions

Investigatory Authority

Life Cycle of an Enforcement Action

Enforcement Principles

Supervision and Enforcement Priorities

Supervision

Back

Supervision Overview

Compliance overview

Compliance resources

Guidance

Registration & Submission Programs

Consumer Complaint Program

Data & Research

Back

Data & Research Overview

Reports

Research Hub

Consumer Complaint Database

Mortgage Database (HMDA)

Small Business Lending Database

Public Data Inventory

Consumer Credit Trends

Mortgage Performance Trends

Financial Well-Being Survey

Credit Card Surveys & Agreements

Prepaid Account Agreements

National Age-Friendly Banking Survey

Featured

Help advance financial well-being

About Us

Back

About Us

Recent Updates

Careers

Advisory Committees

Newsroom

Contact Us

Events

(855) 411-2372

Archived content

This is archived content from the Consumer Financial Protection Bureau website. The information here may be outdated and links may no longer function.

/

Blog Archive

How to reduce your debt

By
Courtney-Rose Dantus

–

JUL 16, 2019

Share & print

Getting out of debt is possible when you know what you owe and what you can do to repay it. If you’re ready to begin paying down your debt, start with these three steps.
Step one: Understand debt reduction strategies
There are two basic strategies that can help you reduce debt: the highest interest rate method and the snowball method.

Highest interest rate method

This approach focuses on your debts like credit card and student loan debts with the highest rate of interest. The goal is to pay off the highest interest rate debt as quickly as possible, because it’s costing you the most. While it may not feel like you’re making progress, this method will help you eliminate your costliest debts first—which can save you money in the long run.

Snowball method

This approach focuses on your smallest debt. The goal is to get rid it as soon as possible. You keep on making the minimum payments on all of your debts, and you put any extra funds you have toward paying off the smallest debt. This will help you pay it off sooner.
Once you’ve paid one smaller debt in full, dedicate that freed up money to the next smallest debt. This way, you create a “snowball” of payments as you eliminate each debt. Unlike the higher interes
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

Page: calculator hub JSON for `/debt-payoff-calculator/` (page type: calculator; depth floor 1,200 body words, floor applies to intro + howItWorks + sections + FAQ answers). register: operator. medium: interactive tool + text. reader question and answer are fixed above.
Keys (exactly these): `metaTitle` (50 to 60 characters, primary keyword), `metaDescription` (130 to 160 characters), `h1`, `introText` (Markdown string, 2 to 3 short paragraphs separated by a blank line; the calculator renders directly under the intro), `howItWorksHeading` (string), `howItWorks` (Markdown string, paragraphs separated by a blank line), `sections` (array of `{"heading": string, "body": Markdown string}`), `faqs` (array of `{"question": string, "answer": string}`), `sources` (array of `{"label": string, "url": string}`, URLs from the CLOSED URL LIST only), `reviewerNote`.

## What the built tool does (describe exactly this, nothing more)
The calculator (already built, `data-tool="debt-payoff-calculator"`) takes up to 10 debts with a name, balance, APR and minimum payment, an extra monthly amount and a one-time lump sum applied next month. It shows a table comparing three plans on debt-free date, total interest and payoff order: avalanche (extra goes to the highest APR first), snowball (extra goes to the smallest balance first) and minimums only (each debt gets only its minimum, no extra, no rollover). A month slider steps both plans forward and shows bars of what is left on each debt. Monthly loop: add interest (balance x APR / 12), pay each open debt its minimum, send the rest of the monthly budget (sum of the original minimums plus the extra) to the target debt, then to the next debt in order; a cleared debt's minimum rolls onto the next. Warns when a minimum does not cover a month of interest. It starts loaded with the worked example, so the first screen already shows the three-plan result.
Preset (loaded on first view): Store card $2,500 at 19.99% APR with $75 minimum; Credit card $6,000 at 27.99% with $160 minimum; Personal loan $11,000 at 11% with $280 minimum; $200 extra a month; no lump sum. Results from `output.json` `example`: avalanche 34 months, $4,783.63 interest, order Credit card (month 22), Store card (month 26), Personal loan (month 34); snowball 35 months, $5,120.19 interest, order Store card (month 10), Credit card (month 27), Personal loan (month 35); minimums only 91 months, $12,291.39 interest. Snowball costs $336.56 more interest and finishes 1 month later. Avalanche avoids $7,507.76 of interest and 57 months compared with minimums only. With a $2,000 lump sum (`lumpSumVariant`) avalanche finishes in 30 months with $3,323.03 interest and snowball in 30 months with $3,634.37 interest.

## Section plan (this order; headings in Title Case)
- `introText`: sentence 1 answers the reader question with the preset result (all three debts, $19,500 owed, debt-free in 34 months with avalanche and $4,783.63 interest, versus 91 months and $12,291.39 paying only minimums). Say the tool is loaded with this example and the reader replaces the numbers. Name the pay-first answer: pay minimums on every debt and send the extra to the highest APR debt (avalanche) or the smallest balance (snowball), and freed minimums roll to the next debt. Keep it under 160 words.
- `howItWorksHeading` = "Snowball vs Avalanche on Your Numbers"; `howItWorks`: explain the result table, why avalanche costs less when APRs differ ($336.56 less on the example), why snowball clears the first debt sooner (month 10 against month 22), CFPB's description of both methods (cite the CFPB blog URL on the CLOSED URL LIST at first mention), the equal-APR counterexample (two debts at 18%: both 30 months, $2,464.56 interest) and the smallest-is-highest-APR counterexample (same order). Include the first visible attribution sentence beginning "In our internal modeling, we".
- sections[0] heading "How the Calculator Works": the monthly loop above, the rollover rule, what happens when a minimum is below monthly interest, assumptions (fixed APR, no new charges or fees, full budget paid every month). Add one sentence linking `[debt consolidation calculator](/debt-consolidation-calculator/)` and distinguishing it: that tool compares keeping your debts against one new consolidation loan, this one chooses the payoff order for debts you keep. Link `[credit card payoff calculator](/credit-card-payoff/)` for a single card and its minimum-payment path.
- sections[1] heading "Worked Example: Three Debts and $200 Extra": a GFM pipe table of the three debts (name, balance, APR, minimum) and a second pipe table of the three plans (plan, debt-free in, total interest, payoff order), using only figures above; then the takeaway paragraph ("Our Takeaway" sentence style is fine inside the section): avalanche minimizes interest when APRs differ, snowball costs more but gives faster early wins, with equal rates or when the smallest debt also has the top rate the choice barely matters; applies to debts you can prepay without penalty; would change with a prepayment penalty or a 0% promotional rate. Include Who this is not for (someone with one debt should use the credit card payoff calculator; someone with a debt under a 0% promotional rate should not pay it first) and What would change our answer.
- `faqs` (7 to 8, answers 40 to 90 words, lead with the direct answer): which debt to pay off first; how long it takes to pay off several debts; does an extra payment or lump sum help (use the $2,000 lump sum figures above); can it handle biweekly payments (the calculator is monthly: 26 half payments a year equal 13 monthly payments, so add one twelfth of your monthly budget as the extra amount, an approximation; do not claim more); can I include a car loan, student loan or HELOC (yes if it has an APR and a minimum payment; note secured debts and prepayment penalties); why can the calculator differ from my lender (assumptions); can I do this in Excel or Google Sheets (a sheet repeats the same monthly loop on one row per month; the calculator does that loop for you; do not offer a template); should I pay debt or invest (link `[pay off debt or invest](/guides/pay-off-debt-or-invest/)`).
- Allowed internal links: /credit-card-payoff/, /compare/debt-snowball-vs-avalanche/, /debt-consolidation-calculator/, /guides/pay-off-debt-or-invest/, /guides/how-to-pay-off-debt/, /emergency-fund-calculator/, /loan-payment-calculator/, /guides/how-to-choose-a-balance-transfer-credit-card/. Do not mention any competitor or app by name (Dave Ramsey, NerdWallet, Credit Karma and similar). Do not claim these completions are answered beyond what the tool does.
- `sources`: CFPB "How to reduce your debt" (https://www.consumerfinance.gov/about-us/blog/how-reduce-your-debt).
