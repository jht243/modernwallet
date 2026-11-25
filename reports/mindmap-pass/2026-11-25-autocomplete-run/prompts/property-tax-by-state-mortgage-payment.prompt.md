# Approved Page Assignment: `/guides/property-tax-by-state-mortgage-payment/` (`property-tax-by-state-mortgage-payment`)
- **Action ID:** `A4` (create new content)
- **Active Mindmap Track:** `comparison`
- **Title:** Property Tax by State: What It Adds to Your Mortgage Payment
- **Page Type / Format / Medium:** guide | comparison table/database - 50 states | text
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** How much do property taxes add to my monthly mortgage payment in my state? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 90/334 mortgage completions name a state or taxes and insurance]
- **Working Answer (Col 11):** Property tax adds roughly (effective rate x home price)/12 to principal and interest, from about $100/month in Hawaii to over $700 in New Jersey on a $400,000 home; table gives each state (figure shape).
- **Answer Placement (Col 12):** section 1: state table of monthly property tax on a $400,000 home

## Demand & Differentiation Context
- **Problem / Gap:** lens 1/2: 'mortgage calculator <state> / with taxes and insurance / property tax / escrow' 90 completions across ~45 states. Source: estimate (autocomplete) NOT measured. lookup: /mortgage/piti-calculator generic; no state property-tax comparison.
- **Keyword Evidence:** "Primary 'mortgage calculator with taxes and insurance / mortgage calculator <state> (90 mapped completions)' and supporting phrases from the Autocomplete CSVs (candidate IDs in candidate-dispositions.csv). Source: estimate (autocomplete) NOT measured; no SEMRUSH/DataForSEO key in this run (checked 2026-11-25). Country/database: US."
- **Why New Page / Angle:** Closest routes: /mortgage/piti-calculator/ (generic, no state data), /mortgage/affordability-calculator/, /guides/mortgage-mistakes-before-applying/. None compares states. No commits touch the route. Insurance is excluded: no primary insurance dataset was retrieved.
- **Intent-Based Our Takeaway:** "Property tax can add from about $100 to over $700 a month on a $400,000 home depending on state; use your county rate for the real number. Applies to owner-occupied homes at the stated price; changes with assessed value, exemptions and county rates."

## Eligible Internal & Testing Evidence Pool for Page Type `regulated-legal-or-financial` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

## Approved Section Outline
1. **Property Tax Added to a $400,000 Mortgage by State** — Answer: 50-state table
2. **How the Estimate Works** — Effective rate x price / 12; ACS basis and limits
3. **Highest and Lowest Property Tax States** — Reading the extremes
4. **What Else Goes Into Escrow** — Insurance and PMI noted as not included; link PITI tool
5. **Property Tax Mortgage FAQs** — Completions-derived questions

## Approved Internal Outbound Links
- {"source": "/guides/property-tax-by-state-mortgage-payment/", "target": "/mortgage/piti-calculator/", "section": "What Else Goes Into Escrow", "anchor": "PITI mortgage calculator", "purpose": "Compute exact payment", "inspection": {"path": "src/data/spokes-mortgage.ts", "sha256": "136442304053d3a534933015426556658f46c2bb08713486960e94c6eadef44f"}}
- {"source": "/guides/property-tax-by-state-mortgage-payment/", "target": "/mortgage/affordability-calculator/", "section": "Highest and Lowest", "anchor": "mortgage affordability calculator", "purpose": "Next step", "inspection": {"path": "src/data/spokes-mortgage.ts", "sha256": "136442304053d3a534933015426556658f46c2bb08713486960e94c6eadef44f"}}

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
  "route": "/guides/property-tax-by-state-mortgage-payment/",
  "readerQuestion": "How much do property taxes add to my monthly mortgage payment in my state? [verb-only - no PAA, no completions: SERP/PAA unavailable; ac 90/334 mortgage completions name a state or taxes and insurance]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/approval-manifest.json",
      "sha256": "699acb869e892c7940c22cd1e6c866e11f523a0ff7dfafa57ac8ce982a23616c"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/chart-review.json",
      "sha256": "da4cb07f1b9686db6ebf29a2bb354c08a046bf27a546308e7174f04f490177b2"
    },
    "actionId": "A4"
  },
  "presentation": {
    "medium": "text",
    "placement": "Sortable 50-state table in section 1",
    "reason": "A finite 50-row comparison answers the question; the reader's own price is handled by the linked PITI calculator",
    "readerInputs": [
      "State"
    ],
    "interaction": {
      "decision": "not-useful",
      "reason": "A finite 50-row table covers the state variable; the PITI calculator is linked for a reader price"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static layout answers faster; no sequence to animate"
    }
  },
  "basis": "calculated",
  "decisionGap": "/mortgage/piti-calculator/ takes a property tax input but gives no state rate, and its FAQ gives only two states; readers searching 'mortgage calculator <state> with taxes' need the monthly property-tax amount for their state on a stated home price.",
  "finding": "On a $400,000 home, effective property tax rates from the Tax Foundation (2024 American Community Survey) add about $97 a month in Hawaii (0.29%) and $627 a month in New Jersey and Illinois (1.88% each) to principal and interest. The median state adds about $263 a month. District of Columbia (0.60%) adds $200. County rates differ from the state average: in the same source New Jersey counties run from 0.93% (Cape May, about $310 a month on $400,000) to 2.47% (Camden, about $823 a month).",
  "conditions": "Owner-occupied homes; state effective rate x $400,000 / 12; real taxes depend on assessed value, exemptions and county or city rates; insurance, PMI and HOA dues are not included.",
  "whatWouldChange": "A county rate far from the state average, a homestead or senior exemption, an assessed value different from the price, or a Tax Foundation update to the effective rates.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/property-tax-by-state-mortgage-payment/cases.json",
    "sha256": "74be8e49993dd3887937ee765f404788ff2041aaa6f4f0340b92918ceec7f8c1"
  },
  "caseDecisions": "cases.json returned only generic Layer3Labs records matched on stopwords; none concern property tax or mortgages, so no client or fleet case is used. caseUses is empty.",
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
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/tax-foundation-property-taxes-by-state.txt",
      "sha256": "23d8aadd7f78efb9dc15baf039d0781485c7f6a839abef09c5246fb4483a8fd4"
    }
  ],
  "method": "Parse Table 2 of the saved Tax Foundation page (effective rate on owner-occupied housing value, 2024), compute rate x 400,000 / 12 per state, rank by rate, list DC separately, and compute the county-range counterexample from Table 1 of the same page. Saved formula and outputs in model.py and output.json.",
  "units": "USD per month, percent of home value",
  "limitations": "State averages hide county variation; ACS values are survey estimates; excludes homeowners insurance (no primary dataset retrieved), mortgage insurance and HOA dues.",
  "counterexample": "Camden County, New Jersey has a 2.47% effective rate in the same source, so the same $400,000 home owes about $823 a month, above the state-average $627.",
  "execution": {
    "command": [
      "python3",
      "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/property-tax-by-state-mortgage-payment/model.py"
    ],
    "code": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/property-tax-by-state-mortgage-payment/model.py",
      "sha256": "08ffd75494871d524ea548f54a066f23d9651dfd09fe88214454bfbce5f50854"
    },
    "inputs": [
      {
        "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/tax-foundation-property-taxes-by-state.txt",
        "sha256": "23d8aadd7f78efb9dc15baf039d0781485c7f6a839abef09c5246fb4483a8fd4"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/property-tax-by-state-mortgage-payment/output.json",
      "sha256": "e02c0277ec4ccf1aa83ed2b78de1225f6bd522e0378ca7e09f79b5e0e1e9bb0b"
    }
  },
  "caseUses": [],
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [],
    "scopeAndLimits": "State averages hide county variation; ACS values are survey estimates; excludes homeowners insurance (no primary dataset retrieved), mortgage insurance and HOA dues.",
    "publicMethod": "On-page: How the Estimate Works section gives the formula, the source and the county caveat.",
    "placement": "50-state table in section 1."
  }
}
```

## Executed Scenario Model Output (`output.json` — Cite Exact Figures)
Cite exact figures from `output.json` below.
```json
{
  "priceUsd": 400000,
  "formula": "monthly = effective_rate_pct/100 * 400000 / 12",
  "states": [
    {
      "state": "New Jersey",
      "rate2024": 1.88,
      "rate2023": 1.98,
      "rank": 1,
      "monthlyOn400k": 626.67,
      "monthlyOn400kRounded": 627
    },
    {
      "state": "Illinois",
      "rate2024": 1.88,
      "rate2023": 1.91,
      "rank": 2,
      "monthlyOn400k": 626.67,
      "monthlyOn400kRounded": 627
    },
    {
      "state": "Connecticut",
      "rate2024": 1.54,
      "rate2023": 1.62,
      "rank": 3,
      "monthlyOn400k": 513.33,
      "monthlyOn400kRounded": 513
    },
    {
      "state": "Vermont",
      "rate2024": 1.51,
      "rate2023": 1.58,
      "rank": 4,
      "monthlyOn400k": 503.33,
      "monthlyOn400kRounded": 503
    },
    {
      "state": "New Hampshire",
      "rate2024": 1.5,
      "rate2023": 1.62,
      "rank": 5,
      "monthlyOn400k": 500.0,
      "monthlyOn400kRounded": 500
    },
    {
      "state": "Nebraska",
      "rate2024": 1.44,
      "rate2023": 1.48,
      "rank": 6,
      "monthlyOn400k": 480.0,
      "monthlyOn400kRounded": 480
    },
    {
      "state": "Texas",
      "rate2024": 1.4,
      "rate2023": 1.47,
      "rank": 7,
      "monthlyOn400k": 466.67,
      "monthlyOn400kRounded": 467
    },
    {
      "state": "Ohio",
      "rate2024": 1.36,
      "rate2023": 1.41,
      "rank": 8,
      "monthlyOn400k": 453.33,
      "monthlyOn400kRounded": 453
    },
    {
      "state": "Iowa",
      "rate2024": 1.33,
      "rate2023": 1.36,
      "rank": 9,
      "monthlyOn400k": 443.33,
      "monthlyOn400kRounded": 443
    },
    {
      "state": "Wisconsin",
      "rate2024": 1.32,
      "rate2023": 1.39,
      "rank": 10,
      "monthlyOn400k": 440.0,
      "monthlyOn400kRounded": 440
    },
    {
      "state": "New York",
      "rate2024": 1.3,
      "rate2023": 1.31,
      "rank": 11,
      "monthlyOn400k": 433.33,
      "monthlyOn400kRounded": 433
    },
    {
      "state": "Pennsylvania",
      "rate2024": 1.26,
      "rate2023": 1.31,
      "rank": 12,
      "monthlyOn400k": 420.0,
      "monthlyOn400kRounded": 420
    },
    {
      "state": "Kansas",
      "rate2024": 1.21,
      "rate2023": 1.22,
      "rank": 13,
      "monthlyOn400k": 403.33,
      "monthlyOn400kRounded": 403
    },
    {
      "state": "Michigan",
      "rate2024": 1.19,
      "rate2023": 1.23,
      "rank": 14,
      "monthlyOn400k": 396.67,
      "monthlyOn400kRounded": 397
    },
    {
      "state": "Rhode Island",
      "rate2024": 1.12,
      "rate2023": 1.19,
      "rank": 15,
      "monthlyOn400k": 373.33,
      "monthlyOn400kRounded": 373
    },
    {
      "state": "Massachusetts",
      "rate2024": 1.0,
      "rate2023": 1.03,
      "rank": 16,
      "monthlyOn400k": 333.33,
      "monthlyOn400kRounded": 333
    },
    {
      "state": "Minnesota",
      "rate2024": 1.0,
      "rate2023": 1.01,
      "rank": 17,
      "monthlyOn400k": 333.33,
      "monthlyOn400kRounded": 333
    },
    {
      "state": "South Dakota",
      "rate2024": 1.0,
      "rate2023": 1.03,
      "rank": 18,
      "monthlyOn400k": 333.33,
      "monthlyOn400kRounded": 333
    },
    {
      "state": "Maine",
      "rate2024": 0.98,
      "rate2023": 1.04,
      "rank": 19,
      "monthlyOn400k": 326.67,
      "monthlyOn400kRounded": 327
    },
    {
      "state": "Alaska",
      "rate2024": 0.94,
      "rate2023": 0.95,
      "rank": 20,
      "monthlyOn400k": 313.33,
      "monthlyOn400kRounded": 313
    },
    {
      "state": "Maryland",
      "rate2024": 0.92,
      "rate2023": 0.95,
      "rank": 21,
      "monthlyOn400k": 306.67,
      "monthlyOn400kRounded": 307
    },
    {
      "state": "North Dakota",
      "rate2024": 0.92,
      "rate2023": 0.92,
      "rank": 22,
      "monthlyOn400k": 306.67,
      "monthlyOn400kRounded": 307
    },
    {
      "state": "Missouri",
      "rate2024": 0.89,
      "rate2023": 0.91,
      "rank": 23,
      "monthlyOn400k": 296.67,
      "monthlyOn400kRounded": 297
    },
    {
      "state": "Oregon",
      "rate2024": 0.81,
      "rate2023": 0.83,
      "rank": 24,
      "monthlyOn400k": 270.0,
      "monthlyOn400kRounded": 270
    },
    {
      "state": "Georgia",
      "rate2024": 0.79,
      "rate2023": 0.82,
      "rank": 25,
      "monthlyOn400k": 263.33,
      "monthlyOn400kRounded": 263
    },
    {
      "state": "Oklahoma",
      "rate2024": 0.79,
      "rate2023": 0.8,
      "rank": 26,
      "monthlyOn400k": 263.33,
      "monthlyOn400kRounded": 263
    },
    {
      "state": "Florida",
      "rate2024": 0.78,
      "rate2023": 0.8,
      "rank": 27,
      "monthlyOn400k": 260.0,
      "monthlyOn400kRounded": 260
    },
    {
      "state": "Virginia",
      "rate2024": 0.78,
      "rate2023": 0.79,
      "rank": 28,
      "monthlyOn400k": 260.0,
      "monthlyOn400kRounded": 260
    },
    {
      "state": "Indiana",
      "rate2024": 0.76,
      "rate2023": 0.77,
      "rank": 29,
      "monthlyOn400k": 253.33,
      "monthlyOn400kRounded": 253
    },
    {
      "state": "Washington",
      "rate2024": 0.75,
      "rate2023": 0.77,
      "rank": 30,
      "monthlyOn400k": 250.0,
      "monthlyOn400kRounded": 250
    },
    {
      "state": "Kentucky",
      "rate2024": 0.74,
      "rate2023": 0.76,
      "rank": 31,
      "monthlyOn400k": 246.67,
      "monthlyOn400kRounded": 247
    },
    {
      "state": "California",
      "rate2024": 0.7,
      "rate2023": 0.7,
      "rank": 32,
      "monthlyOn400k": 233.33,
      "monthlyOn400kRounded": 233
    },
    {
      "state": "North Carolina",
      "rate2024": 0.66,
      "rate2023": 0.69,
      "rank": 33,
      "monthlyOn400k": 220.0,
      "monthlyOn400kRounded": 220
    },
    {
      "state": "New Mexico",
      "rate2024": 0.63,
      "rate2023": 0.62,
      "rank": 34,
      "monthlyOn400k": 210.0,
      "monthlyOn400kRounded": 210
    },
    {
      "state": "Montana",
      "rate2024": 0.61,
      "rate2023": 0.64,
      "rank": 35,
      "monthlyOn400k": 203.33,
      "monthlyOn400kRounded": 203
    },
    {
      "state": "Mississippi",
      "rate2024": 0.58,
      "rate2023": 0.6,
      "rank": 36,
      "monthlyOn400k": 193.33,
      "monthlyOn400kRounded": 193
    },
    {
      "state": "Arkansas",
      "rate2024": 0.56,
      "rate2023": 0.57,
      "rank": 37,
      "monthlyOn400k": 186.67,
      "monthlyOn400kRounded": 187
    },
    {
      "state": "Louisiana",
      "rate2024": 0.55,
      "rate2023": 0.54,
      "rank": 38,
      "monthlyOn400k": 183.33,
      "monthlyOn400kRounded": 183
    },
    {
      "state": "Delaware",
      "rate2024": 0.54,
      "rate2023": 0.55,
      "rank": 39,
      "monthlyOn400k": 180.0,
      "monthlyOn400kRounded": 180
    },
    {
      "state": "Wyoming",
      "rate2024": 0.53,
      "rate2023": 0.52,
      "rank": 40,
      "monthlyOn400k": 176.67,
      "monthlyOn400kRounded": 177
    },
    {
      "state": "Tennessee",
      "rate2024": 0.52,
      "rate2023": 0.56,
      "rank": 41,
      "monthlyOn400k": 173.33,
      "monthlyOn400kRounded": 173
    },
    {
      "state": "West Virginia",
      "rate2024": 0.51,
      "rate2023": 0.51,
      "rank": 42,
      "monthlyOn400k": 170.0,
      "monthlyOn400kRounded": 170
    },
    {
      "state": "Nevada",
      "rate2024": 0.5,
      "rate2023": 0.51,
      "rank": 43,
      "monthlyOn400k": 166.67,
      "monthlyOn400kRounded": 167
    },
    {
      "state": "Colorado",
      "rate2024": 0.5,
      "rate2023": 0.5,
      "rank": 44,
      "monthlyOn400k": 166.67,
      "monthlyOn400kRounded": 167
    },
    {
      "state": "Idaho",
      "rate2024": 0.5,
      "rate2023": 0.53,
      "rank": 45,
      "monthlyOn400k": 166.67,
      "monthlyOn400kRounded": 167
    },
    {
      "state": "South Carolina",
      "rate2024": 0.49,
      "rate2023": 0.51,
      "rank": 46,
      "monthlyOn400k": 163.33,
      "monthlyOn400kRounded": 163
    },
    {
      "state": "Arizona",
      "rate2024": 0.48,
      "rate2023": 0.51,
      "rank": 47,
      "monthlyOn400k": 160.0,
      "monthlyOn400kRounded": 160
    },
    {
      "state": "Utah",
      "rate2024": 0.48,
      "rate2023": 0.5,
      "rank": 48,
      "monthlyOn400k": 160.0,
      "monthlyOn400kRounded": 160
    },
    {
      "state": "Alabama",
      "rate2024": 0.37,
      "rate2023": 0.37,
      "rank": 49,
      "monthlyOn400k": 123.33,
      "monthlyOn400kRounded": 123
    },
    {
      "state": "Hawaii",
      "rate2024": 0.29,
      "rate2023": 0.3,
      "rank": 50,
      "monthlyOn400k": 96.67,
      "monthlyOn400kRounded": 97
    }
  ],
  "districtOfColumbia": [
    {
      "state": "District of Columbia",
      "rate2024": 0.6,
      "rate2023": 0.6,
      "rank": 9,
      "monthlyOn400k": 200.0,
      "monthlyOn400kRounded": 200
    }
  ],
  "max": 626.67,
  "min": 96.67,
  "median_state_monthly": [
    263.33,
    263.33
  ],
  "counterexample": {
    "note": "NJ county rates in the same source run 0.93% (Cape May) to 2.47% (Camden), so a Camden County home at $400,000 owes about $823/month, above the state-average $627",
    "camdenMonthly": 823.33,
    "capeMayMonthly": 310.0
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
### `reports/mindmap-pass/2026-11-25-autocomplete-run/research/sources/tax-foundation-property-taxes-by-state.txt`
```
CANONICAL URL: https://taxfoundation.org/data/all/state/property-taxes-by-state-county/
FINAL URL: https://taxfoundation.org/data/all/state/property-taxes-by-state-county/
RETRIEVED UTC: 2026-11-25T08:13:37.510560Z



Property Taxes by State and County, 2026 | Tax Foundation Maps

Skip to content

US

Europe

EN

Subscribe

Donate

Research

Research Areas

Federal Tax
State Tax
Global Tax
EU Tax

All Research
Meet Our Experts

Featured Projects

Options for Reforming America’s Tax Code
State Tax Competitiveness Index
International Tax Competitiveness Index
European Tax Policy Scorecard
Tariff Tracker
2026 Tax Calculator
Federal Tax Modeling

Featured Issues

Tariffs & Trade
Debt & Deficits
OBBBA
Property Taxes
State Tax Trends
Wealth Taxes
Global Tax Deal

Latest Research

Digital Services Taxes in the United Kingdom and Belgium Create Large Economic Harms per Unit of Revenue
15 min read

Experts
Data

Data Areas

Federal Tax
State Tax
Global Tax
EU Tax

All Data
Meet Our Experts

Featured Projects

Facts & Figures: How Does Your State Compare?
2026 Tax Brackets
2026 Tax Calculator
Who Pays Federal Income Taxes
Federal Economic Data Dashboard
State and Local Tax Burdens
Corporate Tax Rates Around the World
Sources of Government Revenue in the OECD

Featured Issues

State Data Explorer
Country Data Explorer
State Tax Maps
European Tax Maps

Latest Data

Online Sports Betting Taxes by State, 2026
7 min read

Blog & Commentary

Blog
Testimony
Op-eds
Podcast
Experts

Latest Blog Post

Movers and Shakers in the 2027 State Tax Competitiveness Index
6 min read

Latest Testimony

Why Poland Should Abandon Its Proposed Digital Services Tax

Latest Op-ed

Washington Can Start Delivering on Affordability by Rejecting Trump’s Tariffs

Education

Tax Terms Glossary
Explainer Videos
The Short Form Blog
Our Principles

Primers

The Three Basic Tax Types
Not All Taxes Are Created Equal
The Weird Way Taxes Impact Behavior

Lessons
Legislative Courses

Tax Foundation University
State Tax Policy Boot Camp

Featured Term

Excise Tax

Events
About Us

About Us
Our Principles
Contact Us

Staff

Meet Our Team
Meet Our Experts
Meet Our Board

Careers

Job Openings
Internships

Support Our Work

Donate Today
Donor FAQ
President's Circle
Planned Giving

Start typing to search...

Home • Data • State Taxes • Property Taxes by State and County, 2026

See previous versions of this post
Property Taxes by State and County, 2026
March 16, 2026 March 17, 2026 9 min read By: Janelle Fritts

Print

Table of Contents

See Related Resources

Property taxes are the  primary tool  for financing local governments. In fiscal year 2023, property taxes comprised 28.9 percent of total state and local  tax A tax is a mandatory payment or charge collected by local, state, and national governments from individuals or businesses to cover the costs of general government services, goods, and activities.  collections in the  United States ,  more than any other source of tax revenue, despite being levied almost exclusively at the local (not state) level. Local governments rely heavily on property taxes to fund schools, roads, police departments, fire and emergency medical services, and other services associated with residency and property ownership. Property taxes accounted for 70.0 percent of local tax collections in fiscal year 2023.

Some states with high property taxes, like  New Hampshire  and Texas, rely heavily on them in lieu of other major tax categories. This often involves g
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

Page: guide JSON for `/guides/property-tax-by-state-mortgage-payment/` (page type: explainer with a data table; depth floor 1,200 body words, the state table does not count toward the floor). register: operator. medium: text.
Keys (exactly these): `title` (50 to 60 characters, primary keyword), `metaDescription` (130 to 160 characters), `h1`, `cardBlurb` (one sentence, at most 160 characters), `introText` (Markdown string, 2 to 3 short paragraphs separated by a blank line), `sections` (array of `{"heading": string, "body": Markdown string}`), `tools` (array of `{"href": "/internal-route/", "label": string}`, real internal calculators from the list below), `faqs` (array of `{"question": string, "answer": string}`, answer leads with the direct answer, Markdown links allowed), `sources` (array of `{"label": string, "url": string}`, URLs from the CLOSED URL LIST only), `disclaimerText` (one sentence: general educational information, not personalized financial advice), `reviewerNote`.

## Closed facts (verified in `output.json`; Tax Foundation Table 2, effective property tax rate on owner-occupied housing value, 2024, from the 2024 American Community Survey, link https://taxfoundation.org/data/all/state/property-taxes-by-state-county/ at first mention)
Formula: monthly property tax = effective rate x $400,000 / 12. Range across the 50 states: about $97 a month (Hawaii, 0.29%) to about $627 a month (New Jersey and Illinois, both 1.88%). Do NOT say "over $700" anywhere. Median state about $263 a month. Connecticut 1.54% = $513, Vermont 1.51% = $503, New Hampshire 1.50% = $500, Texas 1.40% = $467, California 0.70% = $233, Florida 0.78% = $260, Alabama 0.37% = $123, New York 1.30% = $433 (use `output.json` for any other state). District of Columbia 0.60% = $200 a month, listed separately and not ranked among the 50 states.
County variation (same source, county table): New Jersey counties run from 0.93% (Cape May County, about $310 a month on $400,000) to 2.47% (Camden County, about $823 a month), so a county rate can sit far from the state average.
The full 50-state table is inserted by the editor at a placeholder: in the FIRST section body write the exact line `{{STATE_TABLE}}` on its own line where the table belongs (columns: Rank, State, Effective Rate, Monthly Tax on $400,000). Do NOT write the table yourself and do not list more than five states in prose.
Not included in the figure: homeowners insurance (no primary insurance dataset was retrieved, so do not give an insurance figure), mortgage insurance and HOA dues. The /mortgage/piti-calculator/ adds those pieces.
Counterexample / limits: state averages hide county variation; assessed value, exemptions and the county or city rate decide the real bill; ACS values are survey estimates.

## Section plan (this order; headings in Title Case)
1. "Property Tax Added to a $400,000 Mortgage by State": opening answer (sentence 1: property tax adds about (effective rate x home price) / 12 a month, from about $97 in Hawaii to about $627 in New Jersey and Illinois on a $400,000 home), the `{{STATE_TABLE}}` line, one sentence on DC.
2. "How the Estimate Works": formula, the ACS source and what an effective rate is, first visible attribution sentence beginning "In our internal modeling, we" (we converted each state's effective rate to a monthly dollar figure on a $400,000 home), county caveat with the Camden / Cape May figures.
3. "Highest and Lowest Property Tax States": read the extremes (five highest, five lowest from `output.json`), link `[mortgage affordability calculator](/mortgage/affordability-calculator/)` here.
4. "What Else Goes Into Escrow": insurance and PMI not included; link `[PITI mortgage calculator](/mortgage/piti-calculator/)` (PITI means principal, interest, taxes and insurance); how to use a county rate.
5. "Our Takeaway" (short section): property tax can add about $97 to about $627 a month on a $400,000 home depending on state; use your county rate for the real number; applies to owner-occupied homes at that price; changes with assessed value, exemptions and county rates. Include Who this is not for (buyers at other prices: scale the figure by price / $400,000; renters) and What would change our answer.
- `faqs` (5 to 6): does a mortgage calculator include property tax and insurance (mortgage calculators differ: PITI ones do, a principal-and-interest one does not; link the PITI calculator); how much is property tax on a $400,000 house in <highest state> and <lowest state>; what is an effective property tax rate; why do property taxes differ inside one state; is homeowners insurance included (no); how do I use my own price (rate x price / 12).
- `tools`: /mortgage/piti-calculator/, /mortgage/affordability-calculator/, /hidden-cost-of-owning-a-home-calculator/.
- Allowed internal links: /mortgage/piti-calculator/, /mortgage/affordability-calculator/, /guides/mortgage-mistakes-before-applying/, /hidden-cost-of-owning-a-home-calculator/, /mortgage/.
- `sources`: Tax Foundation property taxes by state and county (URL above).
- Do not give city figures (Austin, Chicago, Houston and so on) and do not claim city or county pages exist.
