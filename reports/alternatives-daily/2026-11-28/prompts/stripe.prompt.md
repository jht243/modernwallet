# Approved Page Assignment: `/alternatives/stripe/` (`stripe`)
- **Action ID:** `A1` (create new content)
- **Active Mindmap Track:** `alternatives`
- **Title:** Stripe Alternatives 2026: Fees and Features Compared
- **Page Type / Format / Medium:** comparison | comparison | structured comparison table with scenario cost model
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** What should I use instead of Stripe for accepting card payments? [verb-only — no PAA, no completions]
- **Working Answer (Col 11):** Square, Helcim, Authorize.net, Shopify Payments, Paddle and Clover are six Stripe alternatives, and most of them publish the same 2.9% + 30¢ online card rate that Stripe does. Stripe's 2.9% + 30¢ costs $1.75 on a $50 online sale, while Square's free plan at 3.3% + 30¢ costs $1.95, a $0.20 difference per sale.
- **Answer Placement (Col 12):** Section 1 (opening sentence)

## Demand & Differentiation Context
- **Problem / Gap:** Readers searching "stripe alternatives" lack verified 2026 plan caps and switching break-even math.
- **Keyword Evidence:** "Validated backlog query \"stripe alternatives\" checked 2026-11-28."
- **Why New Page / Angle:** No existing Layer3Labs route covers /alternatives/stripe/; verified deduplication against data/comparisons*.ts and sitemap.
- **Intent-Based Our Takeaway:** "Square, Helcim, Authorize.net, Shopify Payments, Paddle and Clover are six Stripe alternatives, and most of them publish the same 2.9% + 30¢ online card rate that Stripe does. Stripe's 2.9% + 30¢ costs $1.75 on a $50 online sale, while Square's free plan at 3.3% + 30¢ costs $1.95, a $0.20 difference per sale."

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
  - Director of Community Growth, Horizen Labs (2018-2024): grew 1M+ users through referral/retention loops and analytics
  - Operations Manager, Uber (2015): relaunched UberFamily, cut operational costs 50% and grew driver utilization 30% via SQL/A-B testing
  - Former U.S. Army Captain (Military Intelligence, 35D, 2009-2020): Horn of Africa political/economic/threat intelligence; trained 50+ Ugandan and 20+ Tanzanian military officers for Somalia and DRC deployments
- **Voice Rules (enforced by automated lint; concrete numbers NOT required):**
  - Write exactly 2 crisp sentences (roughly 30-55 words total) tailored specifically to THIS new page's topic, rules, pricing thresholds, or operational tradeoffs.
  - Use Jonathan's blunt, practical practitioner voice with natural contractions (don't, it's, you're, that's) and concrete specifics from this page's verified SOURCE facts.
  - NEVER use em-dashes, en-dashes, spaced hyphens, 'not X, but Y' closers, or banned AI words (leverage, robust, seamless, crucial, pivotal, landscape, game-changer, unlock, delve, comprehensive, streamline, holistic).
  - NEVER copy a sample quote verbatim. Sample quotes are style and tone references only.
- **Style Reference Only (NEVER copy verbatim):**
  - "Once your self-employed profit grows past side-hustle territory, picking between a Solo 401(k) and a SEP IRA can swing your annual tax-advantaged contribution room by tens of thousands of dollars. Run both numbers against your actual net business income before year-end deadlines lock you out."
  - "Parents hesitate to fund 529 plans because they worry about locking money up if their kid skips college or gets a scholarship. With the newer Roth IRA rollover rules and beneficiary-transfer options, unused balances have far more flexibility than most families realize, so check the holding-period rules before paying a penalty."
- **Publish Registration:** Include `"reviewerNote": {"label": "Publisher's Take", "note": "<fresh 2-sentence plain-English quote; numbers optional>"}` AND run `python3 .claude/tools/mindmap-tracks.py register-reviewer-note --route "/alternatives/stripe/" --note "<fresh 2-sentence quote>"`.

## Matched First-Party Client, Owned-App & Operator Experience Records (Use Naturally Within Stated `limits`)
When one of these real engagements illustrates the exact problem or workflow on this page, weave it naturally into your analysis or takeaway (follow `suggestedFraming` below; keep client identities anonymous and never invent metrics or product tests):
```json
[
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
    "id": "product-CallScribe",
    "publicDescription": "CallScribe",
    "relationship": "Owned apps",
    "topic": "Transcription & knowledge tools",
    "workSummary": "Live call transcription software combining selected-app audio and a microphone, with source-grounded coaching features.",
    "possibleUses": "Speech capture, speaker labeling and answering only from a defined knowledge collection.",
    "limits": "Project files establish implementation experience; do not infer customers, adoption or performance. Private personal records and underlying case files remain excluded.",
    "suggestedFraming": "Natural compliant framing: \"Building and operating CallScribe (transcription & knowledge tools), we ran into the same tradeoff...\"",
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
    "assumptions": "Published 6.4% transaction/channel fee + $0.30 fixed per-order fee modeled across $45, $120, and $250 AOV at 25% vs. 55% gross product margin.",
    "scenarios": [
      {
        "orderValueUsd": 45.0,
        "feeUsd": 3.18,
        "netMarginAfterFeeAt25PctGrossUsd": 8.07,
        "shareOf25PctGrossMarginConsumedPct": 28.3,
        "netMarginAfterFeeAt55PctGrossUsd": 21.57
      },
      {
        "orderValueUsd": 120.0,
        "feeUsd": 7.98,
        "netMarginAfterFeeAt25PctGrossUsd": 22.02,
        "shareOf25PctGrossMarginConsumedPct": 26.6,
        "netMarginAfterFeeAt55PctGrossUsd": 58.02
      },
      {
        "orderValueUsd": 250.0,
        "feeUsd": 16.3,
        "netMarginAfterFeeAt25PctGrossUsd": 46.2,
        "shareOf25PctGrossMarginConsumedPct": 26.1,
        "netMarginAfterFeeAt55PctGrossUsd": 121.2
      }
    ]
  }
]
```

## Approved Section Outline
1. **Best Stripe Alternatives by Team Workload** — Direct switching map + 3-scenario monthly/annual break-even cost model and counterexample
2. **Square Online (Free plan): Pricing, Caps, and Tradeoffs vs. Stripe** — Verified Square Online (Free plan) tiers, hard limits, ideal fit, and where Stripe still wins
3. **Square Online (Plus plan): Pricing, Caps, and Tradeoffs vs. Stripe** — Verified Square Online (Plus plan) tiers, hard limits, ideal fit, and where Stripe still wins
4. **Authorize.net: Pricing, Caps, and Tradeoffs vs. Stripe** — Verified Authorize.net tiers, hard limits, ideal fit, and where Stripe still wins
5. **Shopify Payments (Basic plan): Pricing, Caps, and Tradeoffs vs. Stripe** — Verified Shopify Payments (Basic plan) tiers, hard limits, ideal fit, and where Stripe still wins
6. **Paddle: Pricing, Caps, and Tradeoffs vs. Stripe** — Verified Paddle tiers, hard limits, ideal fit, and where Stripe still wins
7. **Stripe Managed Payments: Pricing, Caps, and Tradeoffs vs. Stripe** — Verified Stripe Managed Payments tiers, hard limits, ideal fit, and where Stripe still wins
8. **How to Choose a Stripe Alternative** — Concrete buyer decision criteria and hidden overage traps
9. **When Stripe Is Still the Better Fit** — Explicit counterexample and retention scenarios
10. **Who This Is Not For** — Clear scope boundaries
11. **What Would Change Our Answer** — Specific vendor price or cap changes that would flip the verdict

## Approved Internal Outbound Links
- {"source": "/alternatives/stripe/", "target": "/alternatives", "section": "How to Choose", "anchor": "alternatives", "purpose": "Connect readers to broader Layer3Labs pricing and implementation benchmarks.", "inspection": {"path": "src/data/alternatives.ts", "sha256": "b0abd7619030e9f484d93d2d56465a6d032bd984a3d9f244fda45dffdb09957b"}}
- {"source": "/alternatives/stripe/", "target": "/benefits-comparisons", "section": "How to Choose", "anchor": "benefits comparisons", "purpose": "Connect readers to broader Layer3Labs pricing and implementation benchmarks.", "inspection": {"path": "src/data/benefits-comparisons.ts", "sha256": "733901b5c59559ed043ef2e6d0c886699c80707b9289f882a91f18c937eaf657"}}

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"modeled"`: include honest visible internal calculation/modeling attribution matching `execution` output with explicit visible assumptions + counterexample (never claim hands-on product testing or `(Tested YYYY)` unless `basis` is `"measured"` with executed `runs:[{testedAt}]`).
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-scout-intake-writer",
  "route": "/alternatives/stripe/",
  "readerQuestion": "What should I use instead of Stripe for accepting card payments? [verb-only — no PAA, no completions]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/approval-manifest.json",
      "sha256": "4050a5277f9d006937d31716a2dceaf732db3cf9e8882e756b91965f35d8b016"
    },
    "review": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/chart-review.json",
      "sha256": "4921ec7ae553b8e2f05f25b41d9f03f45f31d7d3b9301e139b9aea7729e51801"
    },
    "actionId": "A1"
  },
  "presentation": {
    "medium": "structured comparison table with scenario cost model",
    "placement": "Opening direct answer followed by comparison matrix and 3-scenario cost/break-even table",
    "reason": "Buyers comparing Stripe options need verifiable tier math and explicit break-even thresholds rather than generic prose.",
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
  "decisionGap": "Pricing pages list rates in isolation and do not show per-sale cost at a fixed ticket size, the $25 to $49 monthly fees that offset identical percentage rates, or the point where interchange-plus beats a flat rate.",
  "finding": "Square, Helcim, Authorize.net, Shopify Payments, Paddle and Clover are six Stripe alternatives, and most of them publish the same 2.9% + 30¢ online card rate that Stripe does. Stripe's 2.9% + 30¢ costs $1.75 on a $50 online sale, while Square's free plan at 3.3% + 30¢ costs $1.95, a $0.20 difference per sale.",
  "conditions": "Domestic US online card payments at a $50 average ticket, standard published rates, no disputes, no currency conversion, no negotiated custom pricing.",
  "whatWouldChange": "A change to Stripe's 2.9% + 30¢ standard rate, a published Helcim interchange average, or a Paddle or Stripe Managed Payments fee change would move the cost ranking.",
  "method": "Deterministic 3-scenario seat, cap, and overage cost model over verified primary vendor pricing snapshots.",
  "units": "USD/month and USD/year",
  "limitations": "Excludes unpublished enterprise commits, custom volume discounts, and implementation labor.",
  "counterexample": "Helcim publishes an interchange-plus margin of 0.50% + 25¢ on keyed and online sales up to $50,000 a month, which is $0.50 on a $50 sale. Stripe's 2.9% + 30¢ is $1.75, so Helcim costs less whenever average interchange stays under $1.25 per $50 sale (2.5% of the ticket). Helcim's page does not publish interchange as a number, so the flip point is arithmetic only: above 2.5% Stripe costs less, below it Helcim does. On the $60,000 and $200,000 monthly tiers the margins fall to $0.425 and $0.375 per $50 sale, which moves the flip point to 2.65% and 2.75%.",
  "caseSelection": {
    "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/stripe/cases.json",
    "sha256": "3e24006187c20c7f90e5dc415ff65c523d420ad279214974c951b2edbff734e1"
  },
  "caseSearchContext": [],
  "caseDecisions": "Searched first-party catalog for relevant anonymous operator/client context; numerical rankings rely strictly on verified pricing/benchmark artifacts.",
  "caseUses": [],
  "comparisons": [
    {
      "kind": "public-data",
      "status": "used",
      "basis": "modeled",
      "reason": "Published pricing tiers, plan caps, and token rates directly determine total workload cost and break-even thresholds.",
      "scope": "Verified public self-serve pricing across 7 of 9 compared options on 2026-11-28.",
      "plan": {
        "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/stripe/public-comparison-plan.json",
        "sha256": "e5dba794b31b93cebc74800f84854a6def26eea94edc4b5b41fc67aa144974b8"
      },
      "coveredItems": [
        "Stripe",
        "Square Online (Free plan)",
        "Square Online (Plus plan)",
        "Authorize.net",
        "Shopify Payments (Basic plan)",
        "Paddle",
        "Stripe Managed Payments"
      ],
      "excludedItems": {
        "Helcim": "Quote-based / custom enterprise pricing; no public self-serve rate.",
        "Clover": "Quote-based / custom enterprise pricing; no public self-serve rate."
      },
      "sources": [
        {
          "item": "Stripe",
          "url": "https://stripe.com/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-benchmark-vendors.json",
            "sha256": "3069e3ada287c036bc1bc6a0a13fdebf842fb9d937fb86a9eda60d89af182b0a"
          },
          "extractedFacts": "Stripe (Standard (domestic online card)): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Square Online (Free plan)",
          "url": "https://squareup.com/us/en/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-benchmark-vendors.json",
            "sha256": "3069e3ada287c036bc1bc6a0a13fdebf842fb9d937fb86a9eda60d89af182b0a"
          },
          "extractedFacts": "Square Online (Free plan) (Square Free online card): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Square Online (Plus plan)",
          "url": "https://squareup.com/us/en/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-benchmark-vendors.json",
            "sha256": "3069e3ada287c036bc1bc6a0a13fdebf842fb9d937fb86a9eda60d89af182b0a"
          },
          "extractedFacts": "Square Online (Plus plan) (Square Plus online card): base=$49/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Authorize.net",
          "url": "https://www.authorize.net/sign-up/pricing.html",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-benchmark-vendors.json",
            "sha256": "3069e3ada287c036bc1bc6a0a13fdebf842fb9d937fb86a9eda60d89af182b0a"
          },
          "extractedFacts": "Authorize.net (All-in-One): base=$25/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Shopify Payments (Basic plan)",
          "url": "https://www.shopify.com/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-benchmark-vendors.json",
            "sha256": "3069e3ada287c036bc1bc6a0a13fdebf842fb9d937fb86a9eda60d89af182b0a"
          },
          "extractedFacts": "Shopify Payments (Basic plan) (Basic): base=$29/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Paddle",
          "url": "https://www.paddle.com/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-benchmark-vendors.json",
            "sha256": "3069e3ada287c036bc1bc6a0a13fdebf842fb9d937fb86a9eda60d89af182b0a"
          },
          "extractedFacts": "Paddle (Merchant of record): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Stripe Managed Payments",
          "url": "https://stripe.com/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-benchmark-vendors.json",
            "sha256": "3069e3ada287c036bc1bc6a0a13fdebf842fb9d937fb86a9eda60d89af182b0a"
          },
          "extractedFacts": "Stripe Managed Payments (Stripe merchant of record): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001."
        }
      ]
    }
  ],
  "sourceArtifacts": [
    {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-benchmark-vendors.json",
      "sha256": "3069e3ada287c036bc1bc6a0a13fdebf842fb9d937fb86a9eda60d89af182b0a"
    },
    {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/stripe/benchmark-inputs.json",
      "sha256": "6c820bdffe0da50228bbfff893398d89dfd8f94556e19b26087b61743aa8d1b8"
    },
    {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/stripe/public-comparison-plan.json",
      "sha256": "e5dba794b31b93cebc74800f84854a6def26eea94edc4b5b41fc67aa144974b8"
    }
  ],
  "execution": {
    "command": [
      "python3",
      "reports/alternatives-daily/2026-11-28/mindmap/evidence/stripe/model.py"
    ],
    "code": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/stripe/model.py",
      "sha256": "0162dbb536d046821fe77b9f3d5325483e6bbf49dbbe677e4e982032bd7d1505"
    },
    "inputs": [
      {
        "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/stripe/benchmark-inputs.json",
        "sha256": "6c820bdffe0da50228bbfff893398d89dfd8f94556e19b26087b61743aa8d1b8"
      }
    ],
    "output": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/stripe/output.json",
      "sha256": "f249351e82c74931abd31c30c16be255d7f4b4acad1c779ac1cd1bd4d8b8e127"
    }
  }
}
```

## Executed Scenario Model Output (`output.json` — Cite Exact Figures)
Populate `sections[0].table` (or `scenarioTable` on Vertical/Template pages) directly from `scenarioTable` below so every figure matches the verified benchmark.
```json
{
  "mode": "saas-tco",
  "subject": "Stripe",
  "scenarioCount": 3,
  "distinctScenarioWinners": [
    "Stripe"
  ],
  "scenarios": [
    {
      "scenario": "Small online shop: 200 sales a month ($10,000 at a $50 average ticket)",
      "lowestCostVendor": "Stripe",
      "lowestMonthlyUsd": 350.0,
      "quotes": {
        "Stripe": {
          "monthlyUsd": 350.0,
          "annualUsd": 4200.0,
          "plan": "Standard (domestic online card)",
          "savingsVsSubjectMonthlyUsd": 0.0,
          "savingsVsSubjectAnnualUsd": 0.0
        },
        "Square Online (Free plan)": {
          "monthlyUsd": 390.0,
          "annualUsd": 4680.0,
          "plan": "Square Free online card",
          "savingsVsSubjectMonthlyUsd": -40.0,
          "savingsVsSubjectAnnualUsd": -480.0
        },
        "Square Online (Plus plan)": {
          "monthlyUsd": 399.0,
          "annualUsd": 4788.0,
          "plan": "Square Plus online card",
          "savingsVsSubjectMonthlyUsd": -49.0,
          "savingsVsSubjectAnnualUsd": -588.0
        },
        "Authorize.net": {
          "monthlyUsd": 375.0,
          "annualUsd": 4500.0,
          "plan": "All-in-One",
          "savingsVsSubjectMonthlyUsd": -25.0,
          "savingsVsSubjectAnnualUsd": -300.0
        },
        "Shopify Payments (Basic plan)": {
          "monthlyUsd": 379.0,
          "annualUsd": 4548.0,
          "plan": "Basic",
          "savingsVsSubjectMonthlyUsd": -29.0,
          "savingsVsSubjectAnnualUsd": -348.0
        },
        "Paddle": {
          "monthlyUsd": 600.0,
          "annualUsd": 7200.0,
          "plan": "Merchant of record",
          "savingsVsSubjectMonthlyUsd": -250.0,
          "savingsVsSubjectAnnualUsd": -3000.0
        },
        "Stripe Managed Payments": {
          "monthlyUsd": 700.0,
          "annualUsd": 8400.0,
          "plan": "Stripe merchant of record",
          "savingsVsSubjectMonthlyUsd": -350.0,
          "savingsVsSubjectAnnualUsd": -4200.0
        }
      }
    },
    {
      "scenario": "Growing shop: 1,200 sales a month ($60,000)",
      "lowestCostVendor": "Stripe",
      "lowestMonthlyUsd": 2100.0,
      "quotes": {
        "Stripe": {
          "monthlyUsd": 2100.0,
          "annualUsd": 25200.0,
          "plan": "Standard (domestic online card)",
          "savingsVsSubjectMonthlyUsd": 0.0,
          "savingsVsSubjectAnnualUsd": 0.0
        },
        "Square Online (Free plan)": {
          "monthlyUsd": 2340.0,
          "annualUsd": 28080.0,
          "plan": "Square Free online card",
          "savingsVsSubjectMonthlyUsd": -240.0,
          "savingsVsSubjectAnnualUsd": -2880.0
        },
        "Square Online (Plus plan)": {
          "monthlyUsd": 2149.0,
          "annualUsd": 25788.0,
          "plan": "Square Plus online card",
          "savingsVsSubjectMonthlyUsd": -49.0,
          "savingsVsSubjectAnnualUsd": -588.0
        },
        "Authorize.net": {
          "monthlyUsd": 2125.0,
          "annualUsd": 25500.0,
          "plan": "All-in-One",
          "savingsVsSubjectMonthlyUsd": -25.0,
          "savingsVsSubjectAnnualUsd": -300.0
        },
        "Shopify Payments (Basic plan)": {
          "monthlyUsd": 2129.0,
          "annualUsd": 25548.0,
          "plan": "Basic",
          "savingsVsSubjectMonthlyUsd": -29.0,
          "savingsVsSubjectAnnualUsd": -348.0
        },
        "Paddle": {
          "monthlyUsd": 3600.0,
          "annualUsd": 43200.0,
          "plan": "Merchant of record",
          "savingsVsSubjectMonthlyUsd": -1500.0,
          "savingsVsSubjectAnnualUsd": -18000.0
        },
        "Stripe Managed Payments": {
          "monthlyUsd": 4200.0,
          "annualUsd": 50400.0,
          "plan": "Stripe merchant of record",
          "savingsVsSubjectMonthlyUsd": -2100.0,
          "savingsVsSubjectAnnualUsd": -25200.0
        }
      }
    },
    {
      "scenario": "Established shop: 4,000 sales a month ($200,000)",
      "lowestCostVendor": "Stripe",
      "lowestMonthlyUsd": 7000.0,
      "quotes": {
        "Stripe": {
          "monthlyUsd": 7000.0,
          "annualUsd": 84000.0,
          "plan": "Standard (domestic online card)",
          "savingsVsSubjectMonthlyUsd": 0.0,
          "savingsVsSubjectAnnualUsd": 0.0
        },
        "Square Online (Free plan)": {
          "monthlyUsd": 7800.0,
          "annualUsd": 93600.0,
          "plan": "Square Free online card",
          "savingsVsSubjectMonthlyUsd": -800.0,
          "savingsVsSubjectAnnualUsd": -9600.0
        },
        "Square Online (Plus plan)": {
          "monthlyUsd": 7049.0,
          "annualUsd": 84588.0,
          "plan": "Square Plus online card",
          "savingsVsSubjectMonthlyUsd": -49.0,
          "savingsVsSubjectAnnualUsd": -588.0
        },
        "Authorize.net": {
          "monthlyUsd": 7025.0,
          "annualUsd": 84300.0,
          "plan": "All-in-One",
          "savingsVsSubjectMonthlyUsd": -25.0,
          "savingsVsSubjectAnnualUsd": -300.0
        },
        "Shopify Payments (Basic plan)": {
          "monthlyUsd": 7029.0,
          "annualUsd": 84348.0,
          "plan": "Basic",
          "savingsVsSubjectMonthlyUsd": -29.0,
          "savingsVsSubjectAnnualUsd": -348.0
        },
        "Paddle": {
          "monthlyUsd": 12000.0,
          "annualUsd": 144000.0,
          "plan": "Merchant of record",
          "savingsVsSubjectMonthlyUsd": -5000.0,
          "savingsVsSubjectAnnualUsd": -60000.0
        },
        "Stripe Managed Payments": {
          "monthlyUsd": 14000.0,
          "annualUsd": 168000.0,
          "plan": "Stripe merchant of record",
          "savingsVsSubjectMonthlyUsd": -7000.0,
          "savingsVsSubjectAnnualUsd": -84000.0
        }
      }
    }
  ],
  "scenarioTable": {
    "caption": "Internal Plan & Workload Cost Model Across 3 Standardized Scenarios",
    "headers": [
      "Workload Scenario",
      "Stripe",
      "Square Online (Free plan)",
      "Square Online (Plus plan)",
      "Authorize.net",
      "Shopify Payments (Basic plan)",
      "Lowest-Cost Pick"
    ],
    "rows": [
      [
        "Small online shop: 200 sales a month ($10,000 at a $50 average ticket)",
        "$350.00/mo",
        "$390.00/mo",
        "$399.00/mo",
        "$375.00/mo",
        "$379.00/mo",
        "Stripe ($350.00/mo)"
      ],
      [
        "Growing shop: 1,200 sales a month ($60,000)",
        "$2,100.00/mo",
        "$2,340.00/mo",
        "$2,149.00/mo",
        "$2,125.00/mo",
        "$2,129.00/mo",
        "Stripe ($2,100.00/mo)"
      ],
      [
        "Established shop: 4,000 sales a month ($200,000)",
        "$7,000.00/mo",
        "$7,800.00/mo",
        "$7,049.00/mo",
        "$7,025.00/mo",
        "$7,029.00/mo",
        "Stripe ($7,000.00/mo)"
      ]
    ]
  }
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
### `reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-vendors.json`
```
{
  "retrievedAt": "2026-11-28T00:00:00Z",
  "subject": "Stripe",
  "officialUrl": "https://stripe.com/",
  "vendors": [
    {
      "name": "Stripe",
      "planName": "Standard (domestic online card)",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.75,
      "bestFit": "developers and online sellers",
      "notes": "2.9% + 30¢ per successful domestic card transaction; no setup or monthly fees; +1.5% international cards, +1% currency conversion; $15 dispute fee",
      "limits": "",
      "sourceUrl": "https://stripe.com/pricing",
      "modeled": true
    },
    {
      "name": "Square Online (Free plan)",
      "planName": "Square Free online card",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.95,
      "bestFit": "",
      "notes": "3.3% + 30¢ online; $0/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Square Online (Plus plan)",
      "planName": "Square Plus online card",
      "baseMonthlyUsd": 49,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.75,
      "bestFit": "",
      "notes": "2.9% + 30¢ online; $49/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Authorize.net",
      "planName": "All-in-One",
      "baseMonthlyUsd": 25,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.75,
      "bestFit": "",
      "notes": "$25/month plus 2.9% + 30¢ per transaction",
      "limits": "",
      "sourceUrl": "https://www.authorize.net/sign-up/pricing.html",
      "modeled": true
    },
    {
      "name": "Shopify Payments (Basic plan)",
      "planName": "Basic",
      "baseMonthlyUsd": 29,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.75,
      "bestFit": "",
      "notes": "$29/month Shopify plan; card rates from 2.9% + 30¢",
      "limits": "",
      "sourceUrl": "https://www.shopify.com/pricing",
      "modeled": true
    },
    {
      "name": "Paddle",
      "planName": "Merchant of record",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 3.0,
      "bestFit": "",
      "notes": "5% + 50¢ per transaction, all-in-one merchant of record, no monthly fee",
      "limits": "",
      "sourceUrl": "https://www.paddle.com/pricing",
      "modeled": true
    },
    {
      "name": "Stripe Managed Payments",
      "planName": "Stripe merchant of record",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 3.5,
      "bestFit": "",
      "notes": "2.9% + 30¢ Payments fee plus 3.5% per Managed Payments transaction = 6.4% + 30¢",
      "limits": "",
      "sourceUrl": "https://stripe.com/pricing",
      "modeled": true
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

```
### `reports/alternatives-daily/2026-11-28/mindmap/research/sources/stripe-benchmark-vendors.json`
```
{
  "retrievedAt": "2026-11-28T16:44:55Z",
  "route": "/alternatives/stripe/",
  "subject": "Stripe",
  "officialUrl": "https://stripe.com/",
  "vendors": [
    {
      "name": "Stripe",
      "planName": "Standard (domestic online card)",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.75,
      "bestFit": "developers and online sellers",
      "notes": "2.9% + 30¢ per successful domestic card transaction; no setup or monthly fees; +1.5% international cards, +1% currency conversion; $15 dispute fee",
      "limits": "",
      "sourceUrl": "https://stripe.com/pricing",
      "modeled": true
    },
    {
      "name": "Square Online (Free plan)",
      "planName": "Square Free online card",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.95,
      "bestFit": "",
      "notes": "3.3% + 30¢ online; $0/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Square Online (Plus plan)",
      "planName": "Square Plus online card",
      "baseMonthlyUsd": 49,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.75,
      "bestFit": "",
      "notes": "2.9% + 30¢ online; $49/month per location",
      "limits": "",
      "sourceUrl": "https://squareup.com/us/en/pricing",
      "modeled": true
    },
    {
      "name": "Authorize.net",
      "planName": "All-in-One",
      "baseMonthlyUsd": 25,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.75,
      "bestFit": "",
      "notes": "$25/month plus 2.9% + 30¢ per transaction",
      "limits": "",
      "sourceUrl": "https://www.authorize.net/sign-up/pricing.html",
      "modeled": true
    },
    {
      "name": "Shopify Payments (Basic plan)",
      "planName": "Basic",
      "baseMonthlyUsd": 29,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 1.75,
      "bestFit": "",
      "notes": "$29/month Shopify plan; card rates from 2.9% + 30¢",
      "limits": "",
      "sourceUrl": "https://www.shopify.com/pricing",
      "modeled": true
    },
    {
      "name": "Paddle",
      "planName": "Merchant of record",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 3.0,
      "bestFit": "",
      "notes": "5% + 50¢ per transaction, all-in-one merchant of record, no monthly fee",
      "limits": "",
      "sourceUrl": "https://www.paddle.com/pricing",
      "modeled": true
    },
    {
      "name": "Stripe Managed Payments",
      "planName": "Stripe merchant of record",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 3.5,
      "bestFit": "",
      "notes": "2.9% + 30¢ Payments fee plus 3.5% per Managed Payments transaction = 6.4% + 30¢",
      "limits": "",
      "sourceUrl": "https://stripe.com/pricing",
      "modeled": true
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
      "notes": "Interchange plus 0.50% + 25¢ keyed and online on $0 to $50K monthly volume; interchange not published as a number",
      "limits": "",
      "sourceUrl": "https://www.helcim.com/pricing/",
      "modeled": false
    },
    {
      "name": "Clover",
      "planName": "Pay as little as 2.3% + 10¢",
      "baseMonthlyUsd": 0,
      "perSeatMonthlyUsd": 0,
      "includedVolume": 0.0001,
      "overageUnitSize": 1,
      "overageUsdPerUnit": 0,
      "bestFit": "",
      "notes": "Keyed-in 3.5% + 10¢ on retail plans; device plans",
      "limits": "",
      "sourceUrl": "https://www.clover.com/pricing",
      "modeled": false
    }
  ],
  "scenarios": [
    {
      "name": "Small online shop: 200 sales a month ($10,000 at a $50 average ticket)",
      "seats": 1,
      "monthlyVolume": 200
    },
    {
      "name": "Growing shop: 1,200 sales a month ($60,000)",
      "seats": 1,
      "monthlyVolume": 1200
    },
    {
      "name": "Es
```
