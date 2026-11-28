# Approved Page Assignment: `/alternatives/expensify/` (`expensify`)
- **Action ID:** `A3` (create new content)
- **Active Mindmap Track:** `alternatives`
- **Title:** Expensify Alternatives 2026: Pricing and Plans Compared
- **Page Type / Format / Medium:** comparison | comparison | structured comparison table with scenario cost model
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** What should I use instead of Expensify for expense reports? [verb-only — no PAA, no completions]
- **Working Answer (Col 11):** Zoho Expense, Ramp, Brex, BILL Spend & Expense, Sage Expense Management and Rydoo are six Expensify alternatives, and four of them publish a software price below Expensify's $5 per member per month. Zoho Expense Standard is $4 per user billed monthly, and Ramp, Brex Essentials and BILL Spend & Expense each list $0 per user.
- **Answer Placement (Col 12):** Section 1 (opening sentence)

## Demand & Differentiation Context
- **Problem / Gap:** Readers searching "expensify alternatives" lack verified 2026 plan caps and switching break-even math.
- **Keyword Evidence:** "Validated backlog query \"expensify alternatives\" checked 2026-11-28."
- **Why New Page / Angle:** No existing Layer3Labs route covers /alternatives/expensify/; verified deduplication against data/comparisons*.ts and sitemap.
- **Intent-Based Our Takeaway:** "Zoho Expense, Ramp, Brex, BILL Spend & Expense, Sage Expense Management and Rydoo are six Expensify alternatives, and four of them publish a software price below Expensify's $5 per member per month. Zoho Expense Standard is $4 per user billed monthly, and Ramp, Brex Essentials and BILL Spend & Expense each list $0 per user."

## Eligible Internal & Testing Evidence Pool for Page Type `alternatives-evaluation` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Think wide and deep across our full anonymized client and founder catalog (over 50 small business founders across medical practices, law firms, finance, hospitality, construction, HOA, retail, and tech; plus over 7 small medical practices / 10+ years working with doctors). Surface real operational, cash-flow, bandwidth, or career/age-stage tradeoffs across business types (always anonymous, never inventing survey percentages or clinical/investment advice, and staying within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

## Generate Fresh Page-Specific Reviewer Note (Required — Jonathan Teplitsky)
- **Label:** `Publisher's Take` · **Angle:** Harvard Business School MBA, Amazon/Uber Operating Leader & Licensed Florida Real Estate Agent (#3440355)
- **Verified Career Lines (use ONLY these facts; never invent anecdotes, never cite Dapper Labs, and never restate vendor sticker prices—name a post-month-1 friction point and who should walk away; numbers are optional):**
  - Harvard Business School MBA (2014-2016); B.A. Defense Language Institute Foreign Language Center (2013-2014)
  - Founder & CEO, Layer3Labs (2020-2025): led 15 developers building AI/Web3 tools, marketplaces, and 17 games; grew B2C platform to 1.5M+ users with $0 marketing spend; advised Bowlero, NBCU, Jane Goodall Institute
  - Director of Community Growth, Horizen Labs (2018-2024): grew 1M+ users through referral/retention loops and analytics
  - Former U.S. Army Captain (Military Intelligence, 35D, 2009-2020): Horn of Africa political/economic/threat intelligence; trained 50+ Ugandan and 20+ Tanzanian military officers for Somalia and DRC deployments
- **Voice Rules (enforced by automated lint; concrete numbers NOT required):**
  - Write exactly 2 crisp sentences (roughly 30-55 words total) tailored specifically to THIS new page's topic, rules, pricing thresholds, or operational tradeoffs.
  - Use Jonathan's blunt, practical practitioner voice with natural contractions (don't, it's, you're, that's) and concrete specifics from this page's verified SOURCE facts.
  - NEVER use em-dashes, en-dashes, spaced hyphens, 'not X, but Y' closers, or banned AI words (leverage, robust, seamless, crucial, pivotal, landscape, game-changer, unlock, delve, comprehensive, streamline, holistic).
  - NEVER copy a sample quote verbatim. Sample quotes are style and tone references only.
- **Style Reference Only (NEVER copy verbatim):**
  - "Once your self-employed profit grows past side-hustle territory, picking between a Solo 401(k) and a SEP IRA can swing your annual tax-advantaged contribution room by tens of thousands of dollars. Run both numbers against your actual net business income before year-end deadlines lock you out."
  - "Parents hesitate to fund 529 plans because they worry about locking money up if their kid skips college or gets a scholarship. With the newer Roth IRA rollover rules and beneficiary-transfer options, unused balances have far more flexibility than most families realize, so check the holding-period rules before paying a penalty."
- **Publish Registration:** Include `"reviewerNote": {"label": "Publisher's Take", "note": "<fresh 2-sentence plain-English quote; numbers optional>"}` AND run `python3 .claude/tools/mindmap-tracks.py register-reviewer-note --route "/alternatives/expensify/" --note "<fresh 2-sentence quote>"`.

## Matched First-Party Client, Owned-App & Operator Experience Records (Use Naturally Within Stated `limits`)
When one of these real engagements illustrates the exact problem or workflow on this page, weave it naturally into your analysis or takeaway (follow `suggestedFraming` below; keep client identities anonymous and never invent metrics or product tests):
```json
[
  {
    "id": "example-035",
    "publicDescription": "A merchant-cash-advance investment business",
    "relationship": "Client projects",
    "topic": "Finance operations",
    "workSummary": "Accounting engine for merchant-cash-advance data: uploads, validation, journal entries and QuickBooks export. Signed project agreements and sign-off folders are present.",
    "possibleUses": "Keeping accounting calculations predictable; converting different vendors’ files into consistent QuickBooks entries, with checks and a record of each step.",
    "limits": "The records describe the build. Claims about time saved, revenue, adoption or deployment need their own supporting record.",
    "suggestedFraming": "Natural compliant framing (keep anonymous, no invented metrics): \"Working with A merchant-cash-advance investment business, we saw this exact workflow bottleneck around finance operations...\" or \"As we saw working with A merchant-cash-advance investment business, a tool like this fits best when...\"",
    "outcomeLeads": []
  },
  {
    "id": "example-063",
    "publicDescription": "A fractional-loan investment business",
    "relationship": "Client projects",
    "topic": "Financial services",
    "workSummary": "Approved record identifies a finance-sector engagement; detailed deliverables are not specified.",
    "possibleUses": "Finance-sector implementation experience, only at the supported level of detail.",
    "limits": "Approved description and exact quotes only. Do not add new measurements, dates, performance results or a current operating scale.",
    "suggestedFraming": "Natural compliant framing (keep anonymous, no invented metrics): \"Working with A fractional-loan investment business, we saw this exact workflow bottleneck around financial services...\" or \"As we saw working with A fractional-loan investment business, a tool like this fits best when...\"",
    "outcomeLeads": []
  },
  {
    "id": "example-037",
    "publicDescription": "A financial-management and professional-referral business",
    "relationship": "Client projects",
    "topic": "Professional referral & client workflows",
    "workSummary": "A client-intake application and a proposed professional-network search and referral tool. Project code and a referral-tool proposal/invoice trail are present.",
    "possibleUses": "Client onboarding, controlled-access workflows, referral matching and turning an existing professional network into searchable records.",
    "limits": "The records describe the build. Claims about time saved, revenue, adoption or deployment need their own supporting record.",
    "suggestedFraming": "Natural compliant framing (keep anonymous, no invented metrics): \"Working with A financial-management and professional-referral business, we saw this exact workflow bottleneck around professional referral & client workflows...\" or \"As we saw working with A financial-management and professional-referral business, a tool like this fits best when...\"",
    "outcomeLeads": []
  }
]
```

## Pre-Computed Practical Workload & Human-Unit Translations (Verified Closed-World Math — Use Where Helpful)
Translate abstract vendor speeds, caps, credits, or billing cycles into concrete human work units (such as 10-page PDFs, 30-minute meetings, and 8-hour workdays saved) using these exact pre-computed figures and stating the reference assumption transparently (never claim hands-on product execution unless `basis == "measured"`):
```json
[
  {
    "kind": "merchant_order_margin_scenarios",
    "assumptions": "Published 3.3% transaction/channel fee + $0.30 fixed per-order fee modeled across $45, $120, and $250 AOV at 25% vs. 55% gross product margin.",
    "scenarios": [
      {
        "orderValueUsd": 45.0,
        "feeUsd": 1.79,
        "netMarginAfterFeeAt25PctGrossUsd": 9.46,
        "shareOf25PctGrossMarginConsumedPct": 15.9,
        "netMarginAfterFeeAt55PctGrossUsd": 22.96
      },
      {
        "orderValueUsd": 120.0,
        "feeUsd": 4.26,
        "netMarginAfterFeeAt25PctGrossUsd": 25.74,
        "shareOf25PctGrossMarginConsumedPct": 14.2,
        "netMarginAfterFeeAt55PctGrossUsd": 61.74
      },
      {
        "orderValueUsd": 250.0,
        "feeUsd": 8.55,
        "netMarginAfterFeeAt25PctGrossUsd": 53.95,
        "shareOf25PctGrossMarginConsumedPct": 13.7,
        "netMarginAfterFeeAt55PctGrossUsd": 128.95
      }
    ]
  }
]
```

## Approved Section Outline
1. **Best Expensify Alternatives by Team Workload** — Direct switching map + 3-scenario monthly/annual break-even cost model and counterexample
2. **Zoho Expense: Pricing, Caps, and Tradeoffs vs. Expensify** — Verified Zoho Expense tiers, hard limits, ideal fit, and where Expensify still wins
3. **Rydoo: Pricing, Caps, and Tradeoffs vs. Expensify** — Verified Rydoo tiers, hard limits, ideal fit, and where Expensify still wins
4. **Sage Expense Management: Pricing, Caps, and Tradeoffs vs. Expensify** — Verified Sage Expense Management tiers, hard limits, ideal fit, and where Expensify still wins
5. **Brex: Pricing, Caps, and Tradeoffs vs. Expensify** — Verified Brex tiers, hard limits, ideal fit, and where Expensify still wins
6. **Brex Premium: Pricing, Caps, and Tradeoffs vs. Expensify** — Verified Brex Premium tiers, hard limits, ideal fit, and where Expensify still wins
7. **Ramp: Pricing, Caps, and Tradeoffs vs. Expensify** — Verified Ramp tiers, hard limits, ideal fit, and where Expensify still wins
8. **How to Choose a Expensify Alternative** — Concrete buyer decision criteria and hidden overage traps
9. **When Expensify Is Still the Better Fit** — Explicit counterexample and retention scenarios
10. **Who This Is Not For** — Clear scope boundaries
11. **What Would Change Our Answer** — Specific vendor price or cap changes that would flip the verdict

## Approved Internal Outbound Links
- {"source": "/alternatives/expensify/", "target": "/alternatives", "section": "How to Choose", "anchor": "alternatives", "purpose": "Connect readers to broader Layer3Labs pricing and implementation benchmarks.", "inspection": {"path": "src/data/alternatives.ts", "sha256": "b0abd7619030e9f484d93d2d56465a6d032bd984a3d9f244fda45dffdb09957b"}}
- {"source": "/alternatives/expensify/", "target": "/benefits-comparisons", "section": "How to Choose", "anchor": "benefits comparisons", "purpose": "Connect readers to broader Layer3Labs pricing and implementation benchmarks.", "inspection": {"path": "src/data/benefits-comparisons.ts", "sha256": "733901b5c59559ed043ef2e6d0c886699c80707b9289f882a91f18c937eaf657"}}

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"modeled"`: include honest visible internal calculation/modeling attribution matching `execution` output with explicit visible assumptions + counterexample (never claim hands-on product testing or `(Tested YYYY)` unless `basis` is `"measured"` with executed `runs:[{testedAt}]`).
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-scout-intake-writer",
  "route": "/alternatives/expensify/",
  "readerQuestion": "What should I use instead of Expensify for expense reports? [verb-only — no PAA, no completions]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/approval-manifest.json",
      "sha256": "4050a5277f9d006937d31716a2dceaf732db3cf9e8882e756b91965f35d8b016"
    },
    "review": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/chart-review.json",
      "sha256": "4921ec7ae553b8e2f05f25b41d9f03f45f31d7d3b9301e139b9aea7729e51801"
    },
    "actionId": "A3"
  },
  "presentation": {
    "medium": "structured comparison table with scenario cost model",
    "placement": "Opening direct answer followed by comparison matrix and 3-scenario cost/break-even table",
    "reason": "Buyers comparing Expensify options need verifiable tier math and explicit break-even thresholds rather than generic prose.",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "Three pre-computed team/workload scenarios answer the switching math faster without widget friction."
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static scannable tables communicate pricing thresholds immediately."
    }
  },
  "basis": "modeled",
  "decisionGap": "Pricing pages state per-seat rates but do not show team-size totals, the 3-user cap on Zoho Expense's free plan, or 5-user minimums at Rydoo and Sage Expense Management.",
  "finding": "Zoho Expense, Ramp, Brex, BILL Spend & Expense, Sage Expense Management and Rydoo are six Expensify alternatives, and four of them publish a software price below Expensify's $5 per member per month. Zoho Expense Standard is $4 per user billed monthly, and Ramp, Brex Essentials and BILL Spend & Expense each list $0 per user.",
  "conditions": "Published per-seat software prices only, no corporate card rewards, no travel booking fees, no implementation or add-on fees, standard self-serve plans.",
  "whatWouldChange": "A change to Expensify's $5 Collect price, Zoho Expense's $4 Standard price, or a vendor adding a per-user fee to its $0 plan would move the cost ranking.",
  "method": "Deterministic total-cost-of-ownership calculation across 3 standardized team/usage scenarios using published base fees, per-seat charges, included volume caps, overage blocks, and mandatory channel add-ons.",
  "units": "USD/month and USD/year",
  "limitations": "Excludes negotiated enterprise discounts, implementation labor, and third-party telephony/LLM API pass-through usage outside published plan allowances.",
  "counterexample": "At 3 members Expensify Collect costs $15 a month while Zoho Expense's Free plan, capped at 3 users, costs $0. At 100 members Zoho Expense Standard at $4 a user is $400 a month against Expensify's $500, a $100 monthly gap ($1,200 a year). Below 5 users the ranking flips toward Expensify: at 4 members Expensify Collect is $20 a month, while Rydoo and Sage Expense Management both state a 5-user starting point, which is $60 and $59.95 at 5 users.",
  "execution": {
    "command": [
      "python3",
      "reports/alternatives-daily/2026-11-28/mindmap/evidence/expensify/model.py"
    ],
    "code": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/expensify/model.py",
      "sha256": "e765b6bba17778cadc3b132b4c9de03ad6465d6c2c58b7ff290939be3ce95193"
    },
    "inputs": [
      {
        "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
        "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
      }
    ],
    "output": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/expensify/output.json",
      "sha256": "235494a5d40740fe8561422bd9f0f2b58c3336b1141543d4023cddc7ba4cff67"
    }
  },
  "caseSelection": {
    "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/expensify/cases.json",
    "sha256": "81eeb038d2adfb3fe5e5c7fb79a68da81255d19d00c309d7e01fe18dffbd327a"
  },
  "caseDecisions": "Evaluated retrieved _approved-cases.json candidates; relied on deterministic vendor-rate scenario modeling and Layer3 catalog context without claiming unverified client outcomes.",
  "caseUses": [],
  "comparisons": [
    {
      "kind": "public-data",
      "status": "used",
      "basis": "modeled",
      "reason": "Multi-vendor published pricing tiers and usage caps directly govern switching TCO.",
      "scope": "Published self-serve tiers across 8 compared vendors as of 2026-11-28.",
      "plan": {
        "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/expensify/comparison-plan.json",
        "sha256": "74d4aeeeed422418075f74b4470bd7c3fa8966a01f79e15765bccce3cb5e2c25"
      },
      "coveredItems": [
        "Expensify",
        "Zoho Expense",
        "Rydoo",
        "Sage Expense Management",
        "Brex",
        "Brex Premium",
        "Ramp",
        "BILL Spend & Expense"
      ],
      "excludedItems": {},
      "sources": [
        {
          "item": "Expensify",
          "url": "https://www.expensify.com/pricing",
          "checkedAt": "2026-11-28T00:00:00Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
            "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
          },
          "extractedFacts": "Expensify (Collect): base=$0/mo, perSeat=$5/mo, includedVolume=0.0001. Best fit: small teams. Features/Notes: $5 per member per month; Submit plan free; Control custom pricing from $9 per member per month."
        },
        {
          "item": "Zoho Expense",
          "url": "https://www.zoho.com/us/expense/pricing/",
          "checkedAt": "2026-11-28T00:00:00Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
            "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
          },
          "extractedFacts": "Zoho Expense (Standard (billed monthly)): base=$0/mo, perSeat=$4/mo, includedVolume=0.0001. Features/Notes: $4 per user per month billed monthly, $3 billed annually; Free plan capped at 3 users."
        },
        {
          "item": "Rydoo",
          "url": "https://www.rydoo.com/pricing/",
          "checkedAt": "2026-11-28T00:00:00Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
            "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
          },
          "extractedFacts": "Rydoo (Essentials (billed monthly)): base=$0/mo, perSeat=$12/mo, includedVolume=0.0001. Features/Notes: $12 per user per month billed monthly, $9 billed annually; starts at 5 users."
        },
        {
          "item": "Sage Expense Management",
          "url": "https://www.fylehq.com/pricing",
          "checkedAt": "2026-11-28T00:00:00Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
            "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
          },
          "extractedFacts": "Sage Expense Management (Growth (billed annually)): base=$0/mo, perSeat=$11.99/mo, includedVolume=0.0001. Features/Notes: $11.99 per active user per month billed annually; minimum billing 5 users."
        },
        {
          "item": "Brex",
          "url": "https://www.brex.com/pricing",
          "checkedAt": "2026-11-28T00:00:00Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
            "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
          },
          "extractedFacts": "Brex (Essentials): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001. Features/Notes: $0 per user per month; Premium $12 per user per month."
        },
        {
          "item": "Brex Premium",
          "url": "https://www.brex.com/pricing",
          "checkedAt": "2026-11-28T00:00:00Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
            "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
          },
          "extractedFacts": "Brex Premium (Premium): base=$0/mo, perSeat=$12/mo, includedVolume=0.0001. Features/Notes: $12 per user per month."
        },
        {
          "item": "Ramp",
          "url": "https://ramp.com/pricing",
          "checkedAt": "2026-11-28T00:00:00Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
            "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
          },
          "extractedFacts": "Ramp (Free): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001. Features/Notes: $0 per user per month; Plus $15 per user per month plus a platform fee based on team size (not published as a number)."
        },
        {
          "item": "BILL Spend & Expense",
          "url": "https://www.bill.com/pricing",
          "checkedAt": "2026-11-28T00:00:00Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
            "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
          },
          "extractedFacts": "BILL Spend & Expense (Spend & Expense): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001. Features/Notes: $0 per user per month with no subscription or per-user software fee."
        }
      ]
    }
  ],
  "sourceArtifacts": [
    {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json",
      "sha256": "30bf81262d122c6898159540ec6445c17085ac1d76d26b1c625f2e2e746eeca3"
    }
  ]
}
```

## Executed Scenario Model Output (`output.json` — Cite Exact Figures)
Cite exact figures from `output.json` below.
```json
{
  "subject": "Expensify",
  "scenarioCount": 3,
  "scenarios": [
    {
      "scenario": "Small team: 5 members",
      "seats": 5,
      "monthlyVolume": 0,
      "requiresAddon": false,
      "lowestCostVendor": "Brex",
      "lowestMonthlyUsd": 0.0,
      "lowestAnnualUsd": 0.0,
      "quotes": {
        "Expensify": {
          "monthlyUsd": 25.0,
          "annualUsd": 300.0,
          "unitOverageUsd": 0.0,
          "plan": "Collect",
          "savingsVsSubjectMonthlyUsd": 0.0,
          "savingsVsSubjectAnnualUsd": 0.0
        },
        "Zoho Expense": {
          "monthlyUsd": 20.0,
          "annualUsd": 240.0,
          "unitOverageUsd": 0.0,
          "plan": "Standard (billed monthly)",
          "savingsVsSubjectMonthlyUsd": 5.0,
          "savingsVsSubjectAnnualUsd": 60.0
        },
        "Rydoo": {
          "monthlyUsd": 60.0,
          "annualUsd": 720.0,
          "unitOverageUsd": 0.0,
          "plan": "Essentials (billed monthly)",
          "savingsVsSubjectMonthlyUsd": -35.0,
          "savingsVsSubjectAnnualUsd": -420.0
        },
        "Sage Expense Management": {
          "monthlyUsd": 59.95,
          "annualUsd": 719.4,
          "unitOverageUsd": 0.0,
          "plan": "Growth (billed annually)",
          "savingsVsSubjectMonthlyUsd": -34.95,
          "savingsVsSubjectAnnualUsd": -419.4
        },
        "Brex": {
          "monthlyUsd": 0.0,
          "annualUsd": 0.0,
          "unitOverageUsd": 0.0,
          "plan": "Essentials",
          "savingsVsSubjectMonthlyUsd": 25.0,
          "savingsVsSubjectAnnualUsd": 300.0
        },
        "Brex Premium": {
          "monthlyUsd": 60.0,
          "annualUsd": 720.0,
          "unitOverageUsd": 0.0,
          "plan": "Premium",
          "savingsVsSubjectMonthlyUsd": -35.0,
          "savingsVsSubjectAnnualUsd": -420.0
        },
        "Ramp": {
          "monthlyUsd": 0.0,
          "annualUsd": 0.0,
          "unitOverageUsd": 0.0,
          "plan": "Free",
          "savingsVsSubjectMonthlyUsd": 25.0,
          "savingsVsSubjectAnnualUsd": 300.0
        },
        "BILL Spend & Expense": {
          "monthlyUsd": 0.0,
          "annualUsd": 0.0,
          "unitOverageUsd": 0.0,
          "plan": "Spend & Expense",
          "savingsVsSubjectMonthlyUsd": 25.0,
          "savingsVsSubjectAnnualUsd": 300.0
        }
      }
    },
    {
      "scenario": "Growing team: 25 members",
      "seats": 25,
      "monthlyVolume": 0,
      "requiresAddon": false,
      "lowestCostVendor": "Brex",
      "lowestMonthlyUsd": 0.0,
      "lowestAnnualUsd": 0.0,
      "quotes": {
        "Expensify": {
          "monthlyUsd": 125.0,
          "annualUsd": 1500.0,
          "unitOverageUsd": 0.0,
          "plan": "Collect",
          "savingsVsSubjectMonthlyUsd": 0.0,
          "savingsVsSubjectAnnualUsd": 0.0
        },
        "Zoho Expense": {
          "monthlyUsd": 100.0,
          "annualUsd": 1200.0,
          "unitOverageUsd": 0.0,
          "plan": "Standard (billed monthly)",
          "savingsVsSubjectMonthlyUsd": 25.0,
          "savingsVsSubjectAnnualUsd": 300.0
        },
        "Rydoo": {
          "monthlyUsd": 300.0,
          "annualUsd": 3600.0,
          "unitOverageUsd": 0.0,
          "plan": "Essentials (billed monthly)",
          "savingsVsSubjectMonthlyUsd": -175.0,
          "savingsVsSubjectAnnualUsd": -2100.0
        },
        "Sage Expense Management": {
          "monthlyUsd": 299.75,
          "annualUsd": 3597.0,
          "unitOverageUsd": 0.0,
          "plan": "Growth (billed annually)",
          "savingsVsSubjectMonthlyUsd": -174.75,
          "savingsVsSubjectAnnualUsd": -2097.0
        },
        "Brex": {
          "monthlyUsd": 0.0,
          "annualUsd": 0.0,
          "unitOverageUsd": 0.0,
          "plan": "Essentials",
          "savingsVsSubjectMonthlyUsd": 125.0,
          "savingsVsSubjectAnnualUsd": 1500.0
        },
        "Brex Premium": {
          "monthlyUsd": 300.0,
          "annualUsd": 3600.0,
          "unitOverageUsd": 0.0,
          "plan": "Premium",
          "savingsVsSubjectMonthlyUsd": -175.0,
          "savingsVsSubjectAnnualUsd": -2100.0
        },
        "Ramp": {
          "monthlyUsd": 0.0,
          "annualUsd": 0.0,
          "unitOverageUsd": 0.0,
          "plan": "Free",
          "savingsVsSubjectMonthlyUsd": 125.0,
          "savingsVsSubjectAnnualUsd": 1500.0
        },
        "BILL Spend & Expense": {
          "monthlyUsd": 0.0,
          "annualUsd": 0.0,
          "unitOverageUsd": 0.0,
          "plan": "Spend & Expense",
          "savingsVsSubjectMonthlyUsd": 125.0,
          "savingsVsSubjectAnnualUsd": 1500.0
        }
      }
    },
    {
      "scenario": "Mid-size team: 100 members",
      "seats": 100,
      "monthlyVolume": 0,
      "requiresAddon": false,
      "lowestCostVendor": "Brex",
      "lowestMonthlyUsd": 0.0,
      "lowestAnnualUsd": 0.0,
      "quotes": {
        "Expensify": {
          "monthlyUsd": 500.0,
          "annualUsd": 6000.0,
          "unitOverageUsd": 0.0,
          "plan": "Collect",
          "savingsVsSubjectMonthlyUsd": 0.0,
          "savingsVsSubjectAnnualUsd": 0.0
        },
        "Zoho Expense": {
          "monthlyUsd": 400.0,
          "annualUsd": 4800.0,
          "unitOverageUsd": 0.0,
          "plan": "Standard (billed monthly)",
          "savingsVsSubjectMonthlyUsd": 100.0,
          "savingsVsSubjectAnnualUsd": 1200.0
        },
        "Rydoo": {
          "monthlyUsd": 1200.0,
          "annualUsd": 14400.0,
          "unitOverageUsd": 0.0,
          "plan": "Essentials (billed monthly)",
          "savingsVsSubjectMonthlyUsd": -700.0,
          "savingsVsSubjectAnnualUsd": -8400.0
        },
        "Sage Expense Management": {
          "monthlyUsd": 1199.0,
          "annualUsd": 14388.0,
          "unitOverageUsd": 0.0,
          "plan": "Growth (billed annually)",
          "savingsVsSubjectMonthlyUsd": -699.0,
          "savingsVsSubjectAnnualUsd": -8388.0
        },
        "Brex": {
          "monthlyUsd": 0.0,
          "annualUsd": 0.0,
          "unitOverageUsd": 0.0,
          "plan": "Essentials",
          "savingsVsSubjectMonthlyUsd": 500.0,
          "savingsVsSubjectAnnualUsd": 6000.0
        },
        "Brex Premium": {
          "monthlyUsd": 1200.0,
          "annualUsd": 14400.0,
          "unitOverageUsd": 0.0,
          "plan": "Premium",
          "savingsVsSubjectMonthlyUsd": -700.0,
          "savingsVsSubjectAnnualUsd": -8400.0
        },
        "Ramp": {
          "monthlyUsd": 0.0,
          "annualUsd": 0.0,
          "unitOverageUsd": 0.0,
          "plan": "Free",
          "savingsVsSubjectMonthlyUsd": 500.0,
          "savingsVsSubjectAnnualUsd": 6000.0
        },
        "BILL Spend & Expense": {
          "monthlyUsd": 0.0,
          "annualUsd": 0.0,
          "unitOverageUsd": 0.0,
          "plan": "Spend & Expense",
          "savingsVsSubjectMonthlyUsd": 500.0,
          "savingsVsSubjectAnnualUsd": 6000.0
        }
      }
    }
  ]
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/alternatives-daily/2026-11-28/mindmap/request-brief.txt`
```
# Unified Mindmap Scout Intake (alternatives) — mindmap-alternatives-2026-11-28

1. Target `/alternatives/stripe/` — Stripe Alternatives 2026: Fees and Features Compared: What should I use instead of Stripe for accepting card payments? [verb-only — no PAA, no completions]
2. Target `/alternatives/square/` — Square Alternatives 2026: Fees and Plans Compared: What should I use instead of Square for taking card payments in person? [verb-only — no PAA, no completions]
3. Target `/alternatives/expensify/` — Expensify Alternatives 2026: Pricing and Plans Compared: What should I use instead of Expensify for expense reports? [verb-only — no PAA, no completions]

```
### `reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json`
```
{
  "retrievedAt": "2026-11-28T00:00:00Z",
  "subject": "Expensify",
  "officialUrl": "https://www.expensify.com/",
  "vendors": [
    {
      "name": "Expensify",
      "planName": "Collect",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 5,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "small teams",
      "notes": "$5 per member per month; Submit plan free; Control custom pricing from $9 per member per month",
      "limits": "",
      "sourceUrl": "https://www.expensify.com/pricing",
      "modeled": true
    },
    {
      "name": "Zoho Expense",
      "planName": "Standard (billed monthly)",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 4,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "$4 per user per month billed monthly, $3 billed annually; Free plan capped at 3 users",
      "limits": "",
      "sourceUrl": "https://www.zoho.com/us/expense/pricing/",
      "modeled": true
    },
    {
      "name": "Rydoo",
      "planName": "Essentials (billed monthly)",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 12,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "$12 per user per month billed monthly, $9 billed annually; starts at 5 users",
      "limits": "",
      "sourceUrl": "https://www.rydoo.com/pricing/",
      "modeled": true
    },
    {
      "name": "Sage Expense Management",
      "planName": "Growth (billed annually)",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 11.99,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "$11.99 per active user per month billed annually; minimum billing 5 users",
      "limits": "",
      "sourceUrl": "https://www.fylehq.com/pricing",
      "modeled": true
    },
    {
      "name": "Brex",
      "planName": "Essentials",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "$0 per user per month; Premium $12 per user per month",
      "limits": "",
      "sourceUrl": "https://www.brex.com/pricing",
      "modeled": true
    },
    {
      "name": "Brex Premium",
      "planName": "Premium",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 12,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "$12 per user per month",
      "limits": "",
      "sourceUrl": "https://www.brex.com/pricing",
      "modeled": true
    },
    {
      "name": "Ramp",
      "planName": "Free",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "$0 per user per month; Plus $15 per user per month plus a platform fee based on team size (not published as a number)",
      "limits": "",
      "sourceUrl": "https://ramp.com/pricing",
      "modeled": true
    },
    {
      "name": "BILL Spend & Expense",
      "planName": "Spend & Expense",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "$0 per user per month with no subscription or 
```
### `reports/alternatives-daily/2026-11-28/mindmap/research/sources/square-vendors.json`
```
{
  "retrievedAt": "2026-11-28T00:00:00Z",
  "subject": "Square",
  "officialUrl": "https://squareup.com/",
  "vendors": [
    {
      "name": "Square",
      "planName": "Square Free (in person)",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.93,
      "bestFit": "small shops and mobile sellers",
      "notes": "2.6% + 15¢ tap, dip or swipe; 3.3% + 30¢ online; $0/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Square Plus",
      "planName": "Square Plus (in person)",
      "baseMonthlyUsd": 49,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.9,
      "bestFit": "",
      "notes": "2.5% + 15¢ in person; $49/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Square Premium",
      "planName": "Square Premium (in person)",
      "baseMonthlyUsd": 149,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.87,
      "bestFit": "",
      "notes": "2.4% + 15¢ in person; $149/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Stripe Terminal",
      "planName": "Terminal in-person",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.86,
      "bestFit": "",
      "notes": "2.7% + 5¢ per domestic in-person card transaction; readers from $59",
      "limits": "",
      "sourceUrl": "https://stripe.com/pricing",
      "modeled": true
    },
    {
      "name": "SumUp",
      "planName": "Free plan",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.88,
      "bestFit": "",
      "notes": "2.6% + 10¢ in person; $0/month",
      "limits": "",
      "sourceUrl": "https://www.sumup.com/en-us/pricing/",
      "modeled": true
    },
    {
      "name": "Shopify POS (Basic plan)",
      "planName": "Basic",
      "baseMonthlyUsd": 29,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.88,
      "bestFit": "",
      "notes": "$29/month Shopify plan; in-person card rate 2.6% + 10¢",
      "limits": "",
      "sourceUrl": "https://www.shopify.com/pricing",
      "modeled": true
    },
    {
      "name": "Clover",
      "planName": "Retail Basic",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "2.6% + 10¢ on Basic; 2.3% + 10¢ on Standard and Advanced; device plans",
      "limits": "",
      "sourceUrl": "https://www.clover.com/pricing/retail",
      "modeled": false
    },
    {
      "name": "Toast",
      "planName": "Restaurant POS",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "Starter Kit from $0/month with a higher card rate; Point of Sale from $69/month",
      "limits": "",
      "sourceUrl": "https://po
```
### `reports/alternatives-daily/2026-11-28/mindmap/research/sources/square-benchmark-vendors.json`
```
{
  "retrievedAt": "2026-11-28T16:44:55Z",
  "route": "/alternatives/square/",
  "subject": "Square",
  "officialUrl": "https://squareup.com/",
  "vendors": [
    {
      "name": "Square",
      "planName": "Square Free (in person)",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.93,
      "bestFit": "small shops and mobile sellers",
      "notes": "2.6% + 15¢ tap, dip or swipe; 3.3% + 30¢ online; $0/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Square Plus",
      "planName": "Square Plus (in person)",
      "baseMonthlyUsd": 49,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.9,
      "bestFit": "",
      "notes": "2.5% + 15¢ in person; $49/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Square Premium",
      "planName": "Square Premium (in person)",
      "baseMonthlyUsd": 149,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.87,
      "bestFit": "",
      "notes": "2.4% + 15¢ in person; $149/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Stripe Terminal",
      "planName": "Terminal in-person",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.86,
      "bestFit": "",
      "notes": "2.7% + 5¢ per domestic in-person card transaction; readers from $59",
      "limits": "",
      "sourceUrl": "https://stripe.com/pricing",
      "modeled": true
    },
    {
      "name": "SumUp",
      "planName": "Free plan",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.88,
      "bestFit": "",
      "notes": "2.6% + 10¢ in person; $0/month",
      "limits": "",
      "sourceUrl": "https://www.sumup.com/en-us/pricing/",
      "modeled": true
    },
    {
      "name": "Shopify POS (Basic plan)",
      "planName": "Basic",
      "baseMonthlyUsd": 29,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0.88,
      "bestFit": "",
      "notes": "$29/month Shopify plan; in-person card rate 2.6% + 10¢",
      "limits": "",
      "sourceUrl": "https://www.shopify.com/pricing",
      "modeled": true
    },
    {
      "name": "Clover",
      "planName": "Retail Basic",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "2.6% + 10¢ on Basic; 2.3% + 10¢ on Standard and Advanced; device plans",
      "limits": "",
      "sourceUrl": "https://www.clover.com/pricing/retail",
      "modeled": false
    },
    {
      "name": "Toast",
      "planName": "Restaurant POS",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "Starter Kit from $0/month with a higher card rate; Point of Sale from $69/month",
      "limits": "",
      "sourceUrl": "https://pos.toasttab.com/pricing",
      "modeled": false
    },
    {
      "name": "Helcim",
      "planName": "Interchange-plus",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "Interchange plus 0.40% + 8¢ in person on $0 to $50K monthly volume",
      "limits": "",
      "sourceUrl": "https://www.helcim.com/pricing/",
      "modeled": false
    }
  ],
  "scenarios": [
    {
      "name": "Corner shop: 500 sales a month ($15,000 at a $30 average ticket)",
      "seats": 1,
      "monthlyVolume": 500
    },
    {
      "name": "Busy shop: 3,000 sales a month ($90,000)",
      "seats": 1,
      "monthlyVolume": 3000
    },
    {
      "name": "High-volume shop: 10,000 sales a month ($300,000)",
      "seats": 1,
      "monthlyVolume": 10000
    }
  ]
}

```
