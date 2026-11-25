# Approved Page Assignment: `/capital-loss-carryover-calculator/` (`capital-loss-carryover-calculator`)
- **Action ID:** `C3` (create new content)
- **Active Mindmap Track:** `guide`
- **Title:** Capital Loss Carryover Calculator
- **Page Type / Format / Medium:** explainer (tool page; mirrors /social-security-taxable-benefits-calculator/) | calculator | interactive tool
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** How much of my stock losses can I deduct this year and carry forward? [PAA 2/6 on-topic: 'How do I find out if I have capital loss carryover?', 'What are the rules for carry forward of losses?'; ac 14 how/what questions; 4/6 PAA tax-rate off-topic]
- **Working Answer (Col 11):** Losses first cancel gains; a net loss deducts at most $3,000 ($1,500 married filing separately) against other income and the rest carries forward indefinitely (IRS Topic 409); a $50,000 net loss with no gains takes about 16 years to use.
- **Answer Placement (Col 12):** section 1: calculator results and year-by-year schedule

## Demand & Differentiation Context
- **Problem / Gap:** lookup: no existing page for the intent (coverage_lookup: no possible home); closest /guides/tax-loss-harvesting (how harvesting works, not a multi-year carryforward schedule) and /stock-capital-gains-tax-calculator/ (tax on a sale; its 2026-11-04 persona flagged 'loss result had no numbers'). Persona next job: DIY investor with a big realized loss. Demand (DataForSEO measured): capital loss carryover 2,400/mo KD 9; capital loss carryforward 2,400 KD 10; capital loss carryover calculator 30 KD 2 (thin, flagged); ac: how is capital loss carryover calculated, how much capital loss carryover can i use.
- **Keyword Evidence:** "DataForSEO us 2026-11-25 measured: capital loss carryover 2,400/mo KD 9; capital loss carryforward 2,400 KD 10; capital loss carryover calculator 30 KD 2 (thin, flagged); capital loss limit 3000 autocomplete estimate 20-200 (not measured). Primary: capital loss carryover calculator."
- **Why New Page / Angle:** coverage_lookup: no possible home. Closest /guides/tax-loss-harvesting (explains harvesting and the $3,000 limit, no carryforward schedule) and /stock-capital-gains-tax-calculator/ (tax on a sale). No commits; past chart 2026-11-04-tool-usage lists it as spec. Duplicate decision: KEEP (pending independent review).
- **Intent-Based Our Takeaway:** "A net loss never disappears: it offsets gains dollar for dollar, then up to $3,000 a year of other income, and the rest carries forward until used; with no gains a large loss can take well over a decade, so realizing gains in a low-income year can use it faster. Confirm with a tax professional for wash-sale or AMT situations."

## Eligible Internal & Testing Evidence Pool for Page Type `regulated-legal-or-financial` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

## Approved Section Outline
1. **Capital Loss Carryover Calculator** — calculator: ST/LT gains and losses, prior carryover, filing status, future gains -> this year's deduction, carryforward, year-by-year schedule
2. **How the $3,000 Limit and Carryover Work** — net losses against gains first, $3,000 ($1,500 MFS) against other income, indefinite carryforward, character preserved, Schedule D worksheet (IRS Topic 409, Pub 550)
3. **Worked Examples** — $50,000 loss with no gains -> $3,000 now, $47,000 carries, about 16 years; same loss with $10,000 future gains per year
4. **FAQ** — how do I know my carryover; rules for carry forward; what is used first; does it expire; what happens at death

## Approved Internal Outbound Links
- {"source": "/capital-loss-carryover-calculator/", "target": "/guides/tax-loss-harvesting/", "section": "How the $3,000 Limit and Carryover Work", "anchor": "how tax loss harvesting works", "purpose": "harvesting strategy", "inspection": {"path": "reports/mindmap-pass/2026-11-25-tool-usage/inspections/guide-tax-loss-harvesting.txt", "sha256": "53fe17237e2273be85fe279c792fd83b5274f55a963dc1f882d9413ce93848e8"}}
- {"source": "/capital-loss-carryover-calculator/", "target": "/guides/wash-sale-rule-explained/", "section": "FAQ", "anchor": "wash sale rule", "purpose": "disallowed losses", "inspection": {"path": "reports/mindmap-pass/2026-11-25-tool-usage/inspections/guide-wash-sale-rule-explained.txt", "sha256": "ae994706f78ba9fa18051340d338eb570c84085c65783e57433ee4c89fe03c1d"}}

## Reviewer Guardrails (Must Respect)
- CR-1 (substantive): Correct the F1 solution cell and calc-examples closed fact to $1,916.60 gross and $1,707 net (SSA rounds to the dime then down to whole dollars after Part B); do not copy $1,917 or $1,707.60 into any page, test or FAQ.
- CR-2 (substantive): State the schedule exactly in the packet and page (e.g. $3,000 this year and 16 more tax years, final $2,000) and make takeaway, FAQ, table and calculator agree; Phase 4 replay must match.
- CR-3 (substantive): Label the tax year on the page and in results; use 2026 figures labeled as 2026, or cite a retrievable IRS 2027 inflation-adjustment source before using 2027 values. Do not present estimated 2027 brackets as official.
- CR-4 (substantive): Either retrieve and save the SSA 2027 taxable-maximum source and cite it, or compute SE tax for the 2027 option using the labeled 2026 base with a visible 'estimate, 2027 base not used' note (or restrict). Add a boundary case above the wage base to the packet.
- CR-6 (substantive): Add the planned three-book block for the default (non-Social-Security) result path without creating a second data-tool-picks block when showSocialSecurity is true; verify exactly one block renders in both states and that live ASINs match amazon-picks-retirement.txt.
- CR-7 (nit): Keep the explainer short, lead with the comparison table, link the existing guide instead of restating it; keep the 'confirm with a tax professional' line at the bottom, not in section 1.
- CR-1: F1 worked example is arithmetically wrong. It says $1,850 x 1.036 = $1,917 gross and net $1,707.60.
- CR-2: 'about 16 years' to use a $50,000 net loss is inconsistent with the saved calc (15.7).
- CR-3: Tax year for the W-4V estimate is unresolved.
- CR-4: The 2027 tax-year toggle needs a defensible SE-tax Social Security wage base.
- CR-5: F4 serp_verdict 'unread' contradicts its own problem cell and saved SERP read.
- CR-6: RetirementCalculator.tsx already renders ToolPicks, but only inside a showSocialSecurity condition, so the M1 'restore' is really a render-condition fix.
- CR-7: C2 'How Form W-4V Works' repeats a W-4V paragraph that already exists in guides.ts L9385 and a sentence in SocialSecurityTaxableCalculator.tsx.

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"calculated"`: include honest visible internal calculation/modeling attribution matching `execution` output with explicit visible assumptions + counterexample (never claim hands-on product testing or `(Tested YYYY)` unless `basis` is `"measured"` with executed `runs:[{testedAt}]`).
```json
{
  "gateSchemaVersion": 1,
  "author": "write-b1",
  "route": "/capital-loss-carryover-calculator/",
  "readerQuestion": "How much of my stock losses can I deduct this year and carry forward? [PAA 2/6 on-topic: 'How do I find out if I have capital loss carryover?', 'What are the rules for carry forward of losses?'; ac 14 how/what questions; 4/6 PAA tax-rate off-topic]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/approval-manifest.json",
      "sha256": "33ae4a84c3df27e1f4ddaa717203115760ee88ba7f11a65acac5df8ed9c0ec9a"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/chart-review.json",
      "sha256": "c7ab383e60370ee6227720d260018028cbbaf9d9cd0217dddd9857c67e0bf979"
    },
    "actionId": "C3"
  },
  "presentation": {
    "medium": "interactive tool",
    "placement": "section 1: calculator results and year-by-year schedule",
    "reason": "The carryforward and years-to-use depend on the reader's own totals; a schedule needs inputs.",
    "readerInputs": [
      "Short-term gains/losses",
      "Long-term gains/losses",
      "Filing status",
      "Prior-year carryover",
      "Future yearly gains"
    ],
    "interaction": {
      "decision": "build",
      "reason": "The answer depends on the reader's own numbers; a static table cannot show their result."
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Live-updating numbers are enough; decorative motion adds nothing."
    }
  },
  "basis": "calculated",
  "decisionGap": "The tax-loss harvesting guide explains the $3,000 limit and the stock capital gains calculator returns the tax on a sale, but neither shows how long a large loss takes to use or how short-term and long-term character carries forward.",
  "finding": "A $50,000 net loss with no gains deducts $3,000 this year and carries $47,000 forward; at $3,000 a year the deductions run 16 more tax years, with the final deduction $2,000, for 17 tax years in all. A single filer with $30,000 of short-term and $20,000 of long-term losses carries $27,000 short-term and $20,000 long-term into year 2, and short-term loss is used first. Married filing separately deducts $1,500 a year, so the same loss takes 34 years.",
  "conditions": "Taxable income is assumed large enough to absorb the deduction every year; future gains are entered as one net long-term gain per year; wash-sale disallowed losses, AMT and state rules are not modeled; limits are not indexed for inflation.",
  "whatWouldChange": "Low taxable income in a year raises the carryforward (Worksheet 4-1); realizing net gains in later years uses the loss faster ($10,000 of net long-term gain a year shortens the $50,000 schedule to 4 years of deductions); a wash sale defers a loss; a change in the statutory limit.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/capital-loss-carryover-calculator/cases.json",
    "sha256": "e9176b001e12b0fc2babc65ad581306b5d9e0293e8d1b24c2787116773689728"
  },
  "caseDecisions": "Retrieved cases.json candidates (owned properties, a bowling company, law firms, game studios) were all outside U.S. personal tax and retirement guidance, so none is used and no client observation appears on the page; attribution is limited to our internal calculation.",
  "sourceArtifacts": [
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage-brief.md",
      "sha256": "d197e7ff8a423d0ced3dee927ea2f1a3e8f5ec795d8ab315b46a6eb5b55e7415"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/coverage-lookup.txt",
      "sha256": "934f1ae5414528dc4f3f40692ecd8efd21010002d2d331f5620c138019f45fdc"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/serp.json",
      "sha256": "58eff2c6c795921e29bf025ba692abc6d48fe2b32e332c9515fd457c95bd79e7"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/keyword-volumes.json",
      "sha256": "b85c3f2d320280ba4e55cc8451ae1c119990d0345f0a83d0647d10586d52eeea"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/keyword-volumes2.json",
      "sha256": "f1d04f4cd12b0e3e260cea0acb91a0f33c4ebd6ec53e59f53a1410971b304877"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/kw-status.json",
      "sha256": "d6859cb8bf4a307655a8205dd556d25cd4006f5d5fec51c4fd8d663e6b579d06"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/ac-capital-loss-carryover.csv",
      "sha256": "c9e4ad545237983a6d458a98cdab1f06a0967375e7e9847b6e16b8a0a6183677"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/calc-examples.json",
      "sha256": "76302d3e54e979b5581893fea05e3c183dd34f22356ee1d3157e748fc763e75b"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-pub550.txt",
      "sha256": "f93f754fba1a6ec069fe467e589e8a9438462ec966891c9ea8345845caefbf70"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-topic409.txt",
      "sha256": "06dc2dd8c45947ff7e7bb95f5e28d7fab0f4022fa7ed03781706b1241377bbdd"
    }
  ],
  "presentationArtifacts": [
    {
      "path": "src/lib/capital-loss-carryover.ts",
      "sha256": "0a1229cccf0e6d8513822795a89f7aee141ae398a8ff36290f94b3c676b1a4e9"
    },
    {
      "path": "src/components/CapitalLossCarryoverCalculator.tsx",
      "sha256": "b65834a0d264610f50c51ea81746eedccb99e22177208fb442e7e4a5e5140b65"
    }
  ],
  "method": "Pub 550 Worksheet 4-1 per year: net short-term and long-term results combined, deduction = lesser of the limit ($3,000, $1,500 married filing separately) and the net loss, short-term loss used first; carryforward repeated until used, with later net long-term gains entered by the reader. Executed through scripts/test-tool-usage-1125.mjs.",
  "units": "USD per tax year",
  "limitations": "Assumes sufficient taxable income each year; one net long-term gain figure for all later years; no wash-sale, AMT or state modeling; schedule stops at 200 years.",
  "counterexample": "With $10,000 of net long-term gain each later year the $50,000 loss is used over 4 tax years instead of 17, and with $100,000 of future gain it is absorbed in year 2 with no further deduction.",
  "execution": {
    "command": [
      "node",
      "scripts/test-tool-usage-1125.mjs",
      "reports/mindmap-pass/2026-11-25-tool-usage/evidence/capital-loss-carryover-calculator/output.json",
      "cl"
    ],
    "code": {
      "path": "scripts/test-tool-usage-1125.mjs",
      "sha256": "a6c6df7d3379f9dfa09d71bfb0f00cf07113aee22deee60845caa932b2225260"
    },
    "inputs": [
      {
        "path": "src/lib/capital-loss-carryover.ts",
        "sha256": "0a1229cccf0e6d8513822795a89f7aee141ae398a8ff36290f94b3c676b1a4e9"
      },
      {
        "path": "src/components/CapitalLossCarryoverCalculator.tsx",
        "sha256": "b65834a0d264610f50c51ea81746eedccb99e22177208fb442e7e4a5e5140b65"
      },
      {
        "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-topic409.txt",
        "sha256": "06dc2dd8c45947ff7e7bb95f5e28d7fab0f4022fa7ed03781706b1241377bbdd"
      },
      {
        "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-pub550.txt",
        "sha256": "f93f754fba1a6ec069fe467e589e8a9438462ec966891c9ea8345845caefbf70"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/capital-loss-carryover-calculator/output.json",
      "sha256": "3579847b1538ab1aff449af900b66d67b05dc4edb5ce7d2b32ae6bf75ef0bfbd"
    }
  },
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "scripts/test-tool-usage-1125.mjs",
      "output.json"
    ],
    "scopeAndLimits": "Internal calculation of IRS Topic 409 and Publication 550 rules; arithmetic of published rules, not tax advice.",
    "publicMethod": "On-page \"How the $3,000 Limit and Carryover Work\" and \"Worked Examples\" sections and the year-by-year schedule in the calculator.",
    "placement": "beside the $50,000 worked example in the intro and in Worked Examples"
  },
  "takeaway": "A net loss never disappears: it offsets gains dollar for dollar, then up to $3,000 a year of other income, and the rest carries forward until used. With no gains a large loss can take well over a decade, so realizing gains in a low-income year can use it faster. Confirm wash-sale and AMT situations with a tax professional.",
  "growth": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/capital-loss-carryover-calculator/growth.json"
}
```

## Executed Scenario Model Output (`output.json` — Cite Exact Figures)
Cite exact figures from `output.json` below.
```json
{
  "group": "cl",
  "checks": 135,
  "results": {
    "cl50k": {
      "limit": 3000,
      "netThisYear": -50000,
      "netSt": -30000,
      "netLt": -20000,
      "isNetLoss": true,
      "deductionThisYear": 3000,
      "carryTotal": 47000,
      "carrySt": 27000,
      "carryLt": 20000,
      "schedule": [
        {
          "year": 1,
          "net": -50000,
          "deduction": 3000,
          "carrySt": 27000,
          "carryLt": 20000,
          "carryTotal": 47000
        },
        {
          "year": 2,
          "net": -47000,
          "deduction": 3000,
          "carrySt": 24000,
          "carryLt": 20000,
          "carryTotal": 44000
        },
        {
          "year": 3,
          "net": -44000,
          "deduction": 3000,
          "carrySt": 21000,
          "carryLt": 20000,
          "carryTotal": 41000
        },
        {
          "year": 4,
          "net": -41000,
          "deduction": 3000,
          "carrySt": 18000,
          "carryLt": 20000,
          "carryTotal": 38000
        },
        {
          "year": 5,
          "net": -38000,
          "deduction": 3000,
          "carrySt": 15000,
          "carryLt": 20000,
          "carryTotal": 35000
        },
        {
          "year": 6,
          "net": -35000,
          "deduction": 3000,
          "carrySt": 12000,
          "carryLt": 20000,
          "carryTotal": 32000
        },
        {
          "year": 7,
          "net": -32000,
          "deduction": 3000,
          "carrySt": 9000,
          "carryLt": 20000,
          "carryTotal": 29000
        },
        {
          "year": 8,
          "net": -29000,
          "deduction": 3000,
          "carrySt": 6000,
          "carryLt": 20000,
          "carryTotal": 26000
        },
        {
          "year": 9,
          "net": -26000,
          "deduction": 3000,
          "carrySt": 3000,
          "carryLt": 20000,
          "carryTotal": 23000
        },
        {
          "year": 10,
          "net": -23000,
          "deduction": 3000,
          "carrySt": 0,
          "carryLt": 20000,
          "carryTotal": 20000
        },
        {
          "year": 11,
          "net": -20000,
          "deduction": 3000,
          "carrySt": 0,
          "carryLt": 17000,
          "carryTotal": 17000
        },
        {
          "year": 12,
          "net": -17000,
          "deduction": 3000,
          "carrySt": 0,
          "carryLt": 14000,
          "carryTotal": 14000
        },
        {
          "year": 13,
          "net": -14000,
          "deduction": 3000,
          "carrySt": 0,
          "carryLt": 11000,
          "carryTotal": 11000
        },
        {
          "year": 14,
          "net": -11000,
          "deduction": 3000,
          "carrySt": 0,
          "carryLt": 8000,
          "carryTotal": 8000
        },
        {
          "year": 15,
          "net": -8000,
          "deduction": 3000,
          "carrySt": 0,
          "carryLt": 5000,
          "carryTotal": 5000
        },
        {
          "year": 16,
          "net": -5000,
          "deduction": 3000,
          "carrySt": 0,
          "carryLt": 2000,
          "carryTotal": 2000
        },
        {
          "year": 17,
          "net": -2000,
          "deduction": 2000,
          "carrySt": 0,
          "carryLt": 0,
          "carryTotal": 0
        }
      ],
      "yearsOfDeductions": 17,
      "lastYearDeduction": 2000,
      "unusedAfterMax": 0,
      "totalDeducted": 50000
    },
    "cl50kMfs": {
      "limit": 1500,
      "netThisYear": -50000,
      "netSt": -30000,
      "netLt": -20000,
      "isNetLoss": true,
      "deductionThisYear": 1500,
      "carryTotal": 48500,
      "carrySt": 28500,
      "carryLt": 20000,
      "schedule": [
        {
          "year": 1,
          "net": -50000,
          "deduction": 1500,
          "carrySt": 28500,
          "carryLt": 20000,
          "carryTotal": 48500
        },
        {
          "year": 2,
          "net": -48500,
          "deduction": 1500,
          "carrySt": 27000,
          "carryLt": 20000,
          "carryTotal": 47000
        },
        {
          "year": 3,
          "net": -47000,
          "deduction": 1500,
          "carrySt": 25500,
          "carryLt": 20000,
          "carryTotal": 45500
        },
        {
          "year": 4,
          "net": -45500,
          "deduction": 1500,
          "carrySt": 24000,
          "carryLt": 20000,
          "carryTotal": 44000
        },
        {
          "year": 5,
          "net": -44000,
          "deduction": 1500,
          "carrySt": 22500,
          "carryLt": 20000,
          "carryTotal": 42500
        },
        {
          "year": 6,
          "net": -42500,
          "deduction": 1500,
          "carrySt": 21000,
          "carryLt": 20000,
          "carryTotal": 41000
        },
        {
          "year": 7,
          "net": -41000,
          "deduction": 1500,
          "carrySt": 19500,
          "carryLt": 20000,
          "carryTotal": 39500
        },
        {
          "year": 8,
          "net": -39500,
          "deduction": 1500,
          "carrySt": 18000,
          "carryLt": 20000,
          "carryTotal": 38000
        },
        {
          "year": 9,
          "net": -38000,
          "deduction": 1500,
          "carrySt": 16500,
          "carryLt": 20000,
          "carryTotal": 36500
        },
        {
          "year": 10,
          "net": -36500,
          "deduction": 1500,
          "carrySt": 15000,
          "carryLt": 20000,
          "carryTotal": 35000
        },
        {
          "year": 11,
          "net": -35000,
          "deduction": 1500,
          "carrySt": 13500,
          "carryLt": 20000,
          "carryTotal": 33500
        },
        {
          "year": 12,
          "net": -33500,
          "deduction": 1500,
          "carrySt": 12000,
          "carryLt": 20000,
          "carryTotal": 32000
        },
        {
          "year": 13,
          "net": -32000,
          "deduction": 1500,
          "carrySt": 10500,
          "carryLt": 20000,
          "carryTotal": 30500
        },
        {
          "year": 14,
          "net": -30500,
          "deduction": 1500,
          "carrySt": 9000,
          "carryLt": 20000,
          "carryTotal": 29000
        },
        {
          "year": 15,
          "net": -29000,
          "deduction": 1500,
          "carrySt": 7500,
          "carryLt": 20000,
          "carryTotal": 27500
        },
        {
          "year": 16,
          "net": -27500,
          "deduction": 1500,
          "carrySt": 6000,
          "carryLt": 20000,
          "carryTotal": 26000
        },
        {
          "year": 17,
          "net": -26000,
          "deduction": 1500,
          "carrySt": 4500,
          "carryLt": 20000,
          "carryTotal": 24500
        },
        {
          "year": 18,
          "net": -24500,
          "deduction": 1500,
          "carrySt": 3000,
          "carryLt": 20000,
          "carryTotal": 23000
        },
        {
          "year": 19,
          "net": -23000,
          "deduction": 1500,
          "carrySt": 1500,
          "carryLt": 20000,
          "carryTotal": 21500
        },
        {
          "year": 20,
          "net": -21500,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 20000,
          "carryTotal": 20000
        },
        {
          "year": 21,
          "net": -20000,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 18500,
          "carryTotal": 18500
        },
        {
          "year": 22,
          "net": -18500,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 17000,
          "carryTotal": 17000
        },
        {
          "year": 23,
          "net": -17000,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 15500,
          "carryTotal": 15500
        },
        {
          "year": 24,
          "net": -15500,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 14000,
          "carryTotal": 14000
        },
        {
          "year": 25,
          "net": -14000,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 12500,
          "carryTotal": 12500
        },
        {
          "year": 26,
          "net": -12500,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 11000,
          "carryTotal": 11000
        },
        {
          "year": 27,
          "net": -11000,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 9500,
          "carryTotal": 9500
        },
        {
          "year": 28,
          "net": -9500,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 8000,
          "carryTotal": 8000
        },
        {
          "year": 29,
          "net": -8000,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 6500,
          "carryTotal": 6500
        },
        {
          "year": 30,
          "net": -6500,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 5000,
          "carryTotal": 5000
        },
        {
          "year": 31,
          "net": -5000,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 3500,
          "carryTotal": 3500
        },
        {
          "year": 32,
          "net": -3500,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 2000,
          "carryTotal": 2000
        },
        {
          "year": 33,
          "net": -2000,
          "deduction": 1500,
          "carrySt": 0,
          "carryLt": 500,
          "carryTotal": 500
        },
        {
          "year": 34,
          "net": -500,
          "deduction": 500,
          "carrySt": 0,
          "carryLt": 0,
          "carryTotal": 0
        }
      ],
      "yearsOfDeductions": 34,
      "lastYearDeduction": 500,
      "unusedAfterMax": 0,
      "totalDeducted": 50000
    },
    "clMixed": {
      "limit": 3000,
      "netThisYear": -6000,
      "netSt": -10000,
      "netLt": 4000,
      "isNetLoss": true,
      "deductionThisYear": 3000,
      "carryTotal": 3000,
      "carrySt": 3000,
      "carryLt": 0,
      "schedule": [
        {
          "year": 1,
          "net": -6000,
          "deduction": 3000,
          "carrySt": 3000,
          "carryLt": 0,
          "carryTotal": 3000
        },
        {
          "year": 2,
          "net": -3000,
          "deduction": 3000,
          "carrySt": 0,
          "carryLt": 0,
          "carryTotal": 0
        }
      ],
      "yearsOfDeductions": 2,
      "lastYearDeduction": 3000,
      "unusedAfterMax": 0,
      "totalDeducted": 6000
    },
    "cl50kFutureGain": {
      "limit": 3000,
      "netThisYear": -50000,
      "netSt": -30000,
      "netLt": -20000,
      "isNetLoss": true,
      "deductionThisYear": 3000,
      "carryTotal": 47000,
      "carrySt": 27000,
      "carryLt": 20000,
      "schedule": [
        {
          "year": 1,
          "net": -50000,
          "deduction": 3000,
          "carrySt": 27000,
          "carryLt": 20000,
          "carryTotal": 47000
        },
        {
          "year": 2,
          "net": -37000,
          "deduction": 3000,
          "carrySt": 24000,
          "carryLt": 10000,
          "carryTotal": 34000
        },
        {
          "year": 3,
          "net": -24000,
          "deduction": 3000,
          "carrySt": 21000,
          "carryLt": 0,
          "carryTotal": 21000
        },
        {
          "year": 4,
          "net": -11000,
          "deduction": 3000,
          "carrySt": 8000,
          "carryLt": 0,
          "carryTotal": 8000
        },
        {
          "year": 5,
          "net": 2000,
          "deduction": 0,
          "carrySt": 0,
          "carryLt": 0,
          "carryTotal": 0
        }
      ],
      "yearsOfDeductions": 4,
      "lastYearDeduction": 3000,
      "unusedAfterMax": 0,
      "totalDeducted": 12000
    }
  }
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/mindmap-pass/2026-11-25-tool-usage-brief.md`
```
# Tool-usage brief 2026-11-25 (themodernwallet.com, BASE_URL https://www.themodernwallet.com, data_days 48)

Caller: tool-usage-mindmap-auto. Run dir: reports/tool-usage-pass/2026-11-25/. Personas (read them): reports/tool-usage-pass/2026-11-25/personas/*.md. Chart output name: reports/mindmap-pass/2026-11-25-tool-usage.md (all 12 build-brief columns, `lookup:` on every create row, every picked tool present). Canonical job: 2026-11-25-tool-usage.

Picked tools (5): investing, social-security-cola-calculator, retirement, mileage-deduction, portfolio.
Walked, no friction (add line `Walked, no friction: <tool>` under the chart table): investing, portfolio.

## Rows to include (original intake, none to be cut)
1. TOOL FIX /social-security-cola-calculator/ (src/components/SocialSecurityColaCalculator.tsx, src/lib/social-security-cola.ts): CMS announced the final 2027 standard Part B premium on 2026-11-17: $209.40 (+$6.50 over $202.90), deductible $292 (CMS fact sheet https://www.cms.gov/newsroom/fact-sheets/2027-medicare-parts-b-premiums-deductibles ; Federal Register 2026-23601). Tool still says "has not been announced" and offers the $209.50 Trustees projection. Replace with the final standard premium button + hint (higher-income IRMAA enrollees pay more; enter your own), keep every field/mode. Also the same stale sentences live in src/data/calculators.ts FAQ ("Does the calculator include the 2027 Medicare Part B premium?") and src/data/guides.ts (several FAQ answers: "has not been announced", "projects $209.50") -> factual corrections via update existing body text rows (official source cited; verify each stale sentence by grep).
2. TOOL MONETIZE /retirement/couples-retirement-calculator/ (verdict fit, books only, YMYL): no data-tool-picks block renders today although the 2026-10-14 ledger says it shipped. Restore ToolPicks (src/components/ToolPicks.tsx, tag soulcircle01-20) under the result with 3+ book types per persona Monetization; ASINs only from scripts/tool_usage/amazon_pick.py output (AMZ_CLIENT_ID/AMZ_CLIENT_SECRET provided by the caller env).
3. TOOL FIX /mileage-deduction/irs-mileage-rate-2026/ (low use 4.4% of 1762 views): rate-seeking visitor never reaches the tool. Add a short "Estimate your deduction" jump link near the rate answer (anchor to the tool) and raise tap targets of rate buttons/checkbox to >=40px on phones. Additive only.
4. NEW TOOLS (max 3, create new content, format calculator): from the specced backlog (ledger `spec` lines 2026-11-04) chosen by persona next-job: (a) sep-ira-solo-401k-contribution-calculator (seed: self-employment-tax / mileage-deduction persona, self-employed driver), (b) social-security-withholding-calculator (W-4V; seed: social-security-cola-calculator / taxable-benefits persona), (c) capital-loss-carryover-calculator (seed: stock-capital-gains-tax-calculator). Every rate/limit from IRS/SSA primary sources cited on page. Run coverage_lookup.py first; any route already covered becomes a no-addition result, not a duplicate page.

Rules: YMYL finance; never remove/merge/redirect any tool or page; keep data-tool roots; no stored prices; client-side deterministic tools only; prose >1 sentence via content_gen.py.

```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/coverage-lookup.txt`
```
coverage_lookup: 4 candidate(s) vs 893 repo pages / 911 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1306 past-chart lines

### /sep-ira-solo-401k-contribution-calculator/  — row - · create new content
keyword: sep ira contribution calculator; solo 401k contribution limit calculator
reader question (new page intent): How much can I put into a SEP IRA or solo 401(k) as a self-employed person?
lookup terms: sep ira solo 401k contribution   format cues: calculator limits

Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:
- /compare/sep-ira-vs-solo-401k  [PARENT PAGE · in sitemap · src/data/comparisons.ts · topic match 0.8 on sep ira solo 401k]
    title: SEP-IRA vs Solo 401(k): 2025 Guide for the Self-Employed
    desc:  SEP-IRA vs Solo 401(k): the Solo 401(k) lets you save more at low income and offers Roth and loans. See 2025 IRS limits, rules, and how to choose.
- /compare/solo-401k-vs-simple-ira  [in sitemap · src/data/comparisons.ts · topic match 0.6 on ira solo 401k]
    title: Solo 401(k) vs SIMPLE IRA: The 2025 Guide for Owners
    desc:  Solo 401(k) vs SIMPLE IRA compared: 2025 contribution limits, employee eligibility, admin work, and loans, so you know which plan fits your business.
- /guides/ira-contribution-limits-2026  [PARENT PAGE · in sitemap · src/data/guides.ts · topic match 0.4 on ira contribution · same format: limits]
    title: IRA Contribution Limits for 2026: The Complete Guide
    desc:  The 2026 IRA contribution limit is $7,500 ($8,600 if you're 50+). See Roth income limits, deduction rules, and what happens if you contribute too much.
- /guides/401k-contribution-limits-2026  [PARENT PAGE · in sitemap · src/data/guides.ts · topic match 0.4 on 401k contribution · same format: limits]
    title: 401(k) Contribution Limits for 2026: The Complete Guide
    desc:  The 2026 401(k) contribution limit is $24,500 ($32,500 if you're 50+, $35,750 if you're 60-63). See the Roth/Traditional combined cap and catch-up rules.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-11-15-trend-lane-c.md [exclusions] - 401k contribution roth vs traditional / roth or regular 401k: DROP, exist (/compare/roth-401k-vs-traditional-401k, /roth-vs-traditional-401k-calculator, /compare/401k-vs-roth-ira).
- 2026-11-16-xtrends.md [table] | Lens 1 direct intent plus fresh news (IRS IR-2026-136, Nov 12 2026). lookup: /guides/401k-contribution-limits-2026 and /guides/ira-contribution-limits-2026 serve a 2026-limits reader, not a 2027 one; /compare/tsp-vs-40
- 2026-11-16-xtrends.md [table] | Inbound path: /guides/401k-contribution-limits-2026 has no pointer to the 2027 figures that IRS announced Nov 12 2026 (lookup: PARENT/sibling year page). | Add a one-sentence pointer with anchor to the 2027 guide in th
- 2026-11-16-xtrends.md [table] | Inbound path: /guides/ira-contribution-limits-2026 has no pointer to 2027 figures (IRA limit unchanged, phase-outs rose). | Add a one-sentence pointer with anchor to the 2027 guide in the 2026 IRA guide's limits sectio
- 2026-11-16-xtrends.md [table] | Inbound path: /retirement/401k-calculator/ shows contribution rates but not the 2027 cap IRS announced Nov 12 2026. | Add an inbound link to the 2027 limits guide beside the calculator's contribution-limit discussion (
- 2026-11-25-autocomplete.md [table] | lens 2: '401k calculator if i stop contributing / ad
```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/serp.json`
```
{
 "rows": [
  {
   "keyword": "sep ira contribution calculator",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [
    "www.fidelity.com",
    "www.sofi.com",
    "jupid.com",
    "www.irs.gov"
   ],
   "featured_snippet": null,
   "top10_domains": [
    "ezretirementcalculator.com",
    "www.fonerbooks.com",
    "www.pensiondeductions.com",
    "ttlc.intuit.com",
    "unclekam.com",
    "www.youtube.com",
    "gigtaxtools.com",
    "voxluci.com",
    "www.justanswer.com"
   ],
   "major_domains": [
    "ttlc.intuit.com"
   ],
   "forum_domains": [
    "www.youtube.com"
   ],
   "serp_feature_mix": {
    "ai_overview": 1,
    "organic": 9,
    "people_also_ask": 1,
    "related_searches": 1
   },
   "paa": [
    "How much am I allowed to contribute to my SEP IRA?",
    "How much should I save for retirement?",
    "How can I calculate my retirement date?",
    "How much will $1000 grow in a Roth IRA?",
    "How long will $750,000 last in retirement at 62?",
    "Is $200 a month enough for Roth IRA?"
   ],
   "related_searches": [
    "Best retirement calculator free",
    "Best Monte Carlo retirement calculator",
    "Best retirement calculator for married couples",
    "Merrill retirement calculator",
    "Schwab retirement calculator",
    "Fidelity Monte Carlo simulation calculator",
    "Personal retirement calculator",
    "Monte carlo retirement calculator excel"
   ],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "1/10 major platforms (ttlc.intuit.com); AI Overview present, cites www.fidelity.com, www.sofi.com, jupid.com, www.irs.gov",
   "se_results_count": 92
  },
  {
   "keyword": "social security tax withholding calculator",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [
    "www.irs.gov",
    "www.ssa.gov",
    "www.staffmarket.com"
   ],
   "featured_snippet": null,
   "top10_domains": [
    "tools.en.softonic.com",
    "voxluci.com",
    "tool.teamzlab.com",
    "www.irs.com",
    "www.justanswer.com",
    "sagesystax.com",
    "www.calcxml.com",
    "ttlc.intuit.com",
    "www.fidelity.com"
   ],
   "major_domains": [
    "ttlc.intuit.com"
   ],
   "forum_domains": [],
   "serp_feature_mix": {
    "ai_overview": 1,
    "organic": 9,
    "people_also_ask": 1
   },
   "paa": [
    "How is Social Security withholding calculated?",
    "Where can I find my Social Security number?",
    "How do I calculate my FICA tax burden in 2026?",
    "What are the tax brackets for 2026?",
    "What is the new $6000 tax break for seniors?",
    "Does everyone get a $3,000 tax refund?"
   ],
   "related_searches": [],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "1/10 major platforms (ttlc.intuit.com); AI Overview present, cites www.irs.gov, www.ssa.gov, www.staffmarket.com",
   "se_results_count": 89
  },
  {
   "keyword": "capital loss carryover calculator",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [],
   "featured_snippet": null,
   "top10_domains": [
    "www.xltemplates.org",
    "finfriend.work",
    "beacontry.com",
    "simms-accounting.com",
    "glidepathmoney.com",
    "www.youtube.com",
    "ttlc.intuit.com",
    "www.worthshield.com",
    "app.getsupers.com"
   ],
   "major_domains": [
    "ttlc.intuit.com"
   ],
   "forum_domains": [
    "www.youtu
```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/keyword-volumes.json`
```
{
 "rows": [
  {
   "keyword": "2027 medicare part b premium",
   "volume": 5400,
   "volume_low": 5400,
   "volume_high": 5400,
   "kd": 0,
   "cpc": 7.89,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "capital loss carryover calculator",
   "volume": 30,
   "volume_low": 30,
   "volume_high": 30,
   "kd": 2,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "self employed retirement calculator",
   "volume": 10,
   "volume_low": 10,
   "volume_high": 10,
   "kd": 45,
   "cpc": 4.04,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "sep ira calculator",
   "volume": 720,
   "volume_low": 720,
   "volume_high": 720,
   "kd": 0,
   "cpc": 5.86,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "sep ira contribution calculator",
   "volume": 480,
   "volume_low": 480,
   "volume_high": 480,
   "kd": 3,
   "cpc": 4.85,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "social security tax withholding calculator",
   "volume": 720,
   "volume_low": 720,
   "volume_high": 720,
   "kd": 31,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "social security withholding calculator",
   "volume": 720,
   "volume_low": 720,
   "volume_high": 720,
   "kd": 28,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "solo 401k contribution calculator",
   "volume": 720,
   "volume_low": 720,
   "volume_high": 720,
   "kd": 3,
   "cpc": 3.42,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "w-4v social security withholding",
   "volume": 50,
   "volume_low": 50,
   "volume_high": 500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 8 live autocomplete completions (est. 50-500/mo, NOT measured)",
   "autocomplete": {
    "completions": 8,
    "corroborates": false
   }
  },
  {
   "keyword": "capital loss carryforward calculator",
   "volume": 20,
   "volume_low": 20,
   "volume_high": 200,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 7 live autocomplete completions (est. 20-200/mo, NOT measured)",
   "autocomplete": {
    "completions": 7,
    "corroborates": false
   }
  }
 ],
 "notes": [
  "semrush unusable (HTTP 403)",
  "volume: using dataforseo (quality order semrush > dataforseo)",
  "dataforseo returned volume for 8/10 phrases",
  "kd: using dataforseo (quality order semrush > dataforseo)",
  "No tool volume for 2 phrases \u2014 autocomplete band
```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/keyword-volumes2.json`
```
{
 "rows": [
  {
   "keyword": "capital loss carryforward",
   "volume": 2400,
   "volume_low": 2400,
   "volume_high": 2400,
   "kd": 10,
   "cpc": 8.24,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "capital loss carryover",
   "volume": 2400,
   "volume_low": 2400,
   "volume_high": 2400,
   "kd": 9,
   "cpc": 8.24,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "sep ira contribution limit",
   "volume": 1600,
   "volume_low": 1600,
   "volume_high": 1600,
   "kd": 40,
   "cpc": 3.05,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "sep ira vs solo 401k",
   "volume": 1600,
   "volume_low": 1600,
   "volume_high": 1600,
   "kd": 2,
   "cpc": 10.07,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "solo 401k contribution limit",
   "volume": 4400,
   "volume_low": 4400,
   "volume_high": 4400,
   "kd": 14,
   "cpc": 4.6,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "w-4v",
   "volume": 1600,
   "volume_low": 1600,
   "volume_high": 1600,
   "kd": 17,
   "cpc": 0.48,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "withhold tax from social security",
   "volume": 2400,
   "volume_low": 2400,
   "volume_high": 2400,
   "kd": 22,
   "cpc": 0.59,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "capital loss limit 3000",
   "volume": 0,
   "volume_low": 0,
   "volume_high": 50,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 little or no live autocomplete signal (est. 0-50/mo, NOT measured)",
   "autocomplete": {
    "completions": 2,
    "corroborates": true
   }
  }
 ],
 "notes": [
  "semrush unusable (HTTP 403)",
  "volume: using dataforseo (quality order semrush > dataforseo)",
  "dataforseo returned volume for 7/8 phrases",
  "kd: using dataforseo (quality order semrush > dataforseo)",
  "No tool volume for 1 phrases \u2014 autocomplete band (source=estimate, NOT measured)",
  "Autocomplete: 8/8 rows corroborated live"
 ]
}

```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/kw-status.json`
```
{
 "dataforseo": "ok (balance $30.727619000000004)",
 "semrush": "unavailable: HTTP 403",
 "ahrefs": "off: reserved for technical site audits and weekly winner/loser only",
 "autocomplete": "ok",
 "selected": {
  "volume": "dataforseo",
  "kd": "dataforseo",
  "expand": "dataforseo"
 }
}

```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/ac-capital-loss-carryover.csv`
```
seed,suggestion,via
capital loss carryover,what's capital loss carryover,question:what
capital loss carryover,which capital loss carryover is used first,question:what
capital loss carryover,what is capital loss carryover on tax return,question:what
capital loss carryover,what is capital loss carryover worksheet,question:what
capital loss carryover,what does capital loss carryover,question:what
capital loss carryover,what is capital loss carryovers from 2024,question:what
capital loss carryover,what happens to capital loss carryover at death,question:what
capital loss carryover,what is california capital loss carryover,question:what
capital loss carryover,what is amt capital loss carryover,question:what
capital loss carryover,what is arkansas capital loss carryover,question:what
capital loss carryover,how capital loss carryover works,question:how
capital loss carryover,how much capital loss carryover can i use,question:how
capital loss carryover,how is capital loss carryover calculated,question:how
capital loss carryover,how is capital loss carryover applied,question:how
capital loss carryover,how to capital loss carryover,question:how
capital loss carryover,how long capital loss carryover,question:how
capital loss carryover,how to find capital loss carryover from last year,question:how
capital loss carryover,how long does capital loss carryover last,question:how
capital loss carryover,how to report capital loss carryover from previous year,question:how
capital loss carryover,how to use capital loss carryover,question:how
capital loss carryover,why capital loss carryover is zero,question:why
capital loss carryover,why capital loss carryover is negative,question:why
capital loss carryover,why capital loss carryover worksheet,question:why
capital loss carryover,why capital loss carryover how many years,question:why
capital loss carryover,is capital loss carryover good or bad,question:is
capital loss carryover,is capital loss carryover a deduction,question:is
capital loss carryover,does capital loss carryover expire,question:is
capital loss carryover,does capital loss carryover,question:is
capital loss carryover,does capital loss carryover reduce taxable income,question:is
capital loss carryover,does capital loss carryover automatically,question:is
capital loss carryover,does capital loss carryover reduce agi,question:is
capital loss carryover,does capital loss carryover have to be used,question:is
capital loss carryover,what is capital loss carryover,question:is
capital loss carryover,where is capital loss carryover on tax return,question:is
capital loss carryover,do capital loss carryovers expire,question:does
capital loss carryover,do capital loss carryovers expire at death,question:does
capital loss carryover,do capital losses carryover year to year,question:does
capital loss carryover,can capital loss carryover offset ordinary income,question:does
capital loss carryover,can capital loss carryover offset dividend income,question:can
capital loss carryover,can capital loss carryover offset depreciation recapture,question:can
capital loss carryover,can capital loss carryovers be inherited,question:can
capital loss carryover,can capital loss carryovers be used to offset ordinary income,question:can
capital loss carryover,can capital loss carryover offset interest income,question:can
capital loss carryover,should capital loss carryover be capitalized,question:should
capital loss carryover,can capital loss carry forward,question:should
capit
```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/calc-examples.json`
```
{
 "sep_example": {
  "net_profit": 100000,
  "se_tax": 14129.55,
  "half_se": 7064.77,
  "net_earnings": 92935.23,
  "sep_max": 18587.05,
  "solo_401k_max_2027": 44087.04,
  "solo_with_age50_catchup": 52587.04
 },
 "cola_example": {
  "benefit": 1850,
  "part_b_2026": 202.9,
  "part_b_2027": 209.4,
  "cola": 0.036,
  "gross": 1917.0
 },
 "capital_loss_example": {
  "net_loss": 50000,
  "deduct": 3000,
  "carry_st": 27000,
  "carry_lt": 20000,
  "years_to_use_with_no_gains": 15.7
 }
}

```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-pub550.txt`
```
URL: https://www.irs.gov/publications/p550
Retrieved: 2026-11-25T19:18:53.619146Z


Publication 550 (2025), Investment Income and Expenses | Internal Revenue Service
      Skip to main content
Official websites use .gov
A 
.gov
 website belongs to an official government organization in the United States.
Secure .gov websites use HTTPS
          A 
lock
          (
)
          or 
https://
 means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.
      Search IRS tasks, forms, and answers
        Suggestions
      English
Español
中文 (简体)
中文 (繁體)
한국어
Русский
Tiếng Việt
Kreyòl ayisyen
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
Businesses & Self-Employed
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
Form 1040 Instructions
Form W-9
Form 4506-T
Form W-4
Form 941
Form W-2
Form 9465
POPULAR FOR TAX PROS
Form 1040-X
Form 2848
Form W-7
Circular 230
Report Fraud
Overview
Tax fraud and scams
Identity theft
Fake IRS email or message
Tax return preparer misconduct
Help for tax professionals
Search
Include Historical Content
- Any -
No
Include Historical Content
- Any -
No
Search
Publication 550 - Introductory Material
Future Developments
What’s New
Reminders
Introduction
Investment income.
Investment expenses.
Qualified retirement plans and IRAs.
Comments and suggestions.
Getting answers to your tax questions.
Getting tax forms, instructions, and publications.
Ordering tax forms, instructions, and publications.
Investment Income
Topics - This chapter discusses:
Useful Items - You may want to see:
General Information
Recordkeeping.
Net investment income tax (NIIT).
Tax on unearned income of certain children.
Beneficiary of an estate or trust.
Taxpayer Identification Number (TIN).
TIN for joint account.
Custodian account for your child.
Penalty for failure to supply TIN.
Backup withholding.
Certification.
Underreported interest and dividends.
How to stop backup withholding due to underreporting.
How to stop backup withholding due to an incorrect TIN.
Reporting backup withholding.
Nonresident aliens.
Penalties.
Where to report investment income.
Joint accounts.
Community property states.
Income from property given to a child.
Savings account with parent as trustee.
Accuracy-related penalty.
Interest Income
Form 1099-INT.
Interest not reported on Form 1099-INT.
Nominees.
Incorrect amount.
Form 1099-OID.
Exempt-interest dividends.
Interest on VA dividends.
Individual retirement arrangements (IRAs).
Taxable Interest—General
Dividends that are actually interest.
Money market funds.
Certificates of deposit and other deferred interest accounts.
Interest subject to penalty for early wit
```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-topic409.txt`
```
URL: https://www.irs.gov/taxtopics/tc409
Retrieved: 2026-11-25T19:18:53.620269Z


Topic no. 409, Capital gains and losses | Internal Revenue Service
      Skip to main content
Official websites use .gov
A 
.gov
 website belongs to an official government organization in the United States.
Secure .gov websites use HTTPS
          A 
lock
          (
)
          or 
https://
 means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.
      Search IRS tasks, forms, and answers
        Suggestions
      English
Español
中文 (简体)
中文 (繁體)
한국어
Русский
Tiếng Việt
Kreyòl ayisyen
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
Businesses & Self-Employed
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
Form 1040 Instructions
Form W-9
Form 4506-T
Form W-4
Form 941
Form W-2
Form 9465
POPULAR FOR TAX PROS
Form 1040-X
Form 2848
Form W-7
Circular 230
Report Fraud
Overview
Tax fraud and scams
Identity theft
Fake IRS email or message
Tax return preparer misconduct
Help for tax professionals
Search
Include Historical Content
- Any -
No
Include Historical Content
- Any -
No
Search
Topic no. 409, Capital gains and losses
English
Español
中文 (繁體)
한국어
Русский
Tiếng Việt
More In Help
Interactive Tax Assistant
Tools
Report fraud
Tax scams
Identity theft
Notices and letters
Appeals
Frequently asked questions
Accessibility
Contact your local IRS office
Contact an international IRS office
Tax topics
Other languages
Almost everything you own and use for personal or investment purposes is a capital asset. Examples of capital assets include a home, personal-use items like household furnishings, and stocks or bonds held as investments. When you sell a capital asset, the difference between the adjusted basis in the asset and the amount you realized from the sale is a capital gain or a capital loss. Generally, an asset's basis is its cost to the owner, but if you received the asset as a gift or inheritance, refer to 
Publication 551, Basis of Assets
 for information about your basis. You have a capital gain if you sell the asset for more than your adjusted basis. You have a capital loss if you sell the asset for less than your adjusted basis. Losses from the sale of personal-use property, such as your home or car, aren't tax deductible.
Short-term or long-term
To correctly arrive at your net capital gain or loss, capital gains and losses are classified as long-term or short-term. Generally, if you hold the asset for more than one year before you dispose of it, your capital gain or loss is long-term. If you hold it one year or less, your capital gain or loss is short-term. For exceptions to this rule, such as p
```
