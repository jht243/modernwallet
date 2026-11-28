# Approved Page Assignment: `/alternatives/square/` (`square`)
- **Action ID:** `A2` (create new content)
- **Active Mindmap Track:** `alternatives`
- **Title:** Square Alternatives 2026: Fees and Plans Compared
- **Page Type / Format / Medium:** comparison | comparison | structured comparison table with scenario cost model
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** What should I use instead of Square for taking card payments in person? [verb-only — no PAA, no completions]
- **Working Answer (Col 11):** Stripe Terminal, Clover, Toast, SumUp, Shopify POS and Helcim are six Square alternatives, and Stripe Terminal's 2.7% + 5¢ in-person rate is the lowest per-sale cost among the flat-rate options on a $30 ticket. Square's free plan publishes 2.6% + 15¢ in person, which costs $0.93 on a $30 sale against $0.86 at Stripe Terminal, a $0.07 gap before hardware.
- **Answer Placement (Col 12):** Section 1 (opening sentence)

## Demand & Differentiation Context
- **Problem / Gap:** Readers searching "square alternatives" lack verified 2026 plan caps and switching break-even math.
- **Keyword Evidence:** "Validated backlog query \"square alternatives\" checked 2026-11-28."
- **Why New Page / Angle:** No existing Layer3Labs route covers /alternatives/square/; verified deduplication against data/comparisons*.ts and sitemap.
- **Intent-Based Our Takeaway:** "Stripe Terminal, Clover, Toast, SumUp, Shopify POS and Helcim are six Square alternatives, and Stripe Terminal's 2.7% + 5¢ in-person rate is the lowest per-sale cost among the flat-rate options on a $30 ticket. Square's free plan publishes 2.6% + 15¢ in person, which costs $0.93 on a $30 sale against $0.86 at Stripe Terminal, a $0.07 gap before hardware."

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
  - Published Author & Contributor: 'What is Blockchain?' (Amazon), Nasdaq ('Ukraine's Crypto Donation Triumph'), Toolbox B2B, LinkedIn AI cost-math posts ($10,000 agency packaging vs. $12/mo AI prototyping)
- **Voice Rules (enforced by automated lint; concrete numbers NOT required):**
  - Write exactly 2 crisp sentences (roughly 30-55 words total) tailored specifically to THIS new page's topic, rules, pricing thresholds, or operational tradeoffs.
  - Use Jonathan's blunt, practical practitioner voice with natural contractions (don't, it's, you're, that's) and concrete specifics from this page's verified SOURCE facts.
  - NEVER use em-dashes, en-dashes, spaced hyphens, 'not X, but Y' closers, or banned AI words (leverage, robust, seamless, crucial, pivotal, landscape, game-changer, unlock, delve, comprehensive, streamline, holistic).
  - NEVER copy a sample quote verbatim. Sample quotes are style and tone references only.
- **Style Reference Only (NEVER copy verbatim):**
  - "Once your self-employed profit grows past side-hustle territory, picking between a Solo 401(k) and a SEP IRA can swing your annual tax-advantaged contribution room by tens of thousands of dollars. Run both numbers against your actual net business income before year-end deadlines lock you out."
  - "Parents hesitate to fund 529 plans because they worry about locking money up if their kid skips college or gets a scholarship. With the newer Roth IRA rollover rules and beneficiary-transfer options, unused balances have far more flexibility than most families realize, so check the holding-period rules before paying a penalty."
- **Publish Registration:** Include `"reviewerNote": {"label": "Publisher's Take", "note": "<fresh 2-sentence plain-English quote; numbers optional>"}` AND run `python3 .claude/tools/mindmap-tracks.py register-reviewer-note --route "/alternatives/square/" --note "<fresh 2-sentence quote>"`.

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
    "id": "example-047",
    "publicDescription": "A CRM consultancy building its own AI writing system",
    "relationship": "Client projects",
    "topic": "CRM & branded AI writing",
    "workSummary": "A writing system using the business’s existing articles to produce drafts in its own style, with a local search-quality checker.",
    "possibleUses": "Using a business’s past articles to draft in its own style, with repeatable content checks.",
    "limits": "The records describe the build. Claims about time saved, revenue, adoption or deployment need their own supporting record.",
    "suggestedFraming": "Natural compliant framing (keep anonymous, no invented metrics): \"Working with A CRM consultancy building its own AI writing system, we saw this exact workflow bottleneck around crm & branded ai writing...\" or \"As we saw working with A CRM consultancy building its own AI writing system, a tool like this fits best when...\"",
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
1. **Best Square Alternatives by Team Workload** — Direct switching map + 3-scenario monthly/annual break-even cost model and counterexample
2. **Square Plus: Pricing, Caps, and Tradeoffs vs. Square** — Verified Square Plus tiers, hard limits, ideal fit, and where Square still wins
3. **Square Premium: Pricing, Caps, and Tradeoffs vs. Square** — Verified Square Premium tiers, hard limits, ideal fit, and where Square still wins
4. **Stripe Terminal: Pricing, Caps, and Tradeoffs vs. Square** — Verified Stripe Terminal tiers, hard limits, ideal fit, and where Square still wins
5. **SumUp: Pricing, Caps, and Tradeoffs vs. Square** — Verified SumUp tiers, hard limits, ideal fit, and where Square still wins
6. **Shopify POS (Basic plan): Pricing, Caps, and Tradeoffs vs. Square** — Verified Shopify POS (Basic plan) tiers, hard limits, ideal fit, and where Square still wins
7. **Clover: Pricing, Caps, and Tradeoffs vs. Square** — Verified Clover tiers, hard limits, ideal fit, and where Square still wins
8. **How to Choose a Square Alternative** — Concrete buyer decision criteria and hidden overage traps
9. **When Square Is Still the Better Fit** — Explicit counterexample and retention scenarios
10. **Who This Is Not For** — Clear scope boundaries
11. **What Would Change Our Answer** — Specific vendor price or cap changes that would flip the verdict

## Approved Internal Outbound Links
- {"source": "/alternatives/square/", "target": "/alternatives", "section": "How to Choose", "anchor": "alternatives", "purpose": "Connect readers to broader Layer3Labs pricing and implementation benchmarks.", "inspection": {"path": "src/data/alternatives.ts", "sha256": "b0abd7619030e9f484d93d2d56465a6d032bd984a3d9f244fda45dffdb09957b"}}
- {"source": "/alternatives/square/", "target": "/benefits-comparisons", "section": "How to Choose", "anchor": "benefits comparisons", "purpose": "Connect readers to broader Layer3Labs pricing and implementation benchmarks.", "inspection": {"path": "src/data/benefits-comparisons.ts", "sha256": "733901b5c59559ed043ef2e6d0c886699c80707b9289f882a91f18c937eaf657"}}

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"modeled"`: include honest visible internal calculation/modeling attribution matching `execution` output with explicit visible assumptions + counterexample (never claim hands-on product testing or `(Tested YYYY)` unless `basis` is `"measured"` with executed `runs:[{testedAt}]`).
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-scout-intake-writer",
  "route": "/alternatives/square/",
  "readerQuestion": "What should I use instead of Square for taking card payments in person? [verb-only — no PAA, no completions]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/approval-manifest.json",
      "sha256": "4050a5277f9d006937d31716a2dceaf732db3cf9e8882e756b91965f35d8b016"
    },
    "review": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/chart-review.json",
      "sha256": "4921ec7ae553b8e2f05f25b41d9f03f45f31d7d3b9301e139b9aea7729e51801"
    },
    "actionId": "A2"
  },
  "presentation": {
    "medium": "structured comparison table with scenario cost model",
    "placement": "Opening direct answer followed by comparison matrix and 3-scenario cost/break-even table",
    "reason": "Buyers comparing Square options need verifiable tier math and explicit break-even thresholds rather than generic prose.",
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
  "decisionGap": "Pricing pages list percentages per plan without the per-location monthly fee, the average-ticket flip point against 5¢ versus 15¢ fixed fees, or the volume at which a paid plan pays for itself.",
  "finding": "Stripe Terminal, Clover, Toast, SumUp, Shopify POS and Helcim are six Square alternatives, and Stripe Terminal's 2.7% + 5¢ in-person rate is the lowest per-sale cost among the flat-rate options on a $30 ticket. Square's free plan publishes 2.6% + 15¢ in person, which costs $0.93 on a $30 sale against $0.86 at Stripe Terminal, a $0.07 gap before hardware.",
  "conditions": "Domestic US tap, dip or swipe card sales at a $30 average ticket on published self-serve rates, one location, excluding hardware, disputes and custom pricing.",
  "whatWouldChange": "A change to Square's published in-person rates, Stripe Terminal's 2.7% + 5¢, or a larger average ticket would move the ranking; Square also offers custom rates above $250,000 a year.",
  "method": "Deterministic 3-scenario seat, cap, and overage cost model over verified primary vendor pricing snapshots.",
  "units": "USD/month and USD/year",
  "limitations": "Excludes unpublished enterprise commits, custom volume discounts, and implementation labor.",
  "counterexample": "Stripe Terminal's 2.7% + 5¢ and Square Free's 2.6% + 15¢ cost the same at a $100 average ticket (0.027 x 100 + 0.05 = 2.75; 0.026 x 100 + 0.15 = 2.75). Above $100 per sale Square Free costs less per sale than Stripe Terminal. Square Premium's 2.4% + 15¢ matches Stripe Terminal at a $33.33 ticket, so on a $60 ticket Square Premium costs $1.59 per sale against $1.67, an $0.08 saving that takes 1,863 sales a month to cover Premium's $149 fee.",
  "caseSelection": {
    "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/square/cases.json",
    "sha256": "7b05741785b09160d740658bbe633c75fb1a7e0126fe243553f72b2eb9012554"
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
      "scope": "Verified public self-serve pricing across 6 of 9 compared options on 2026-11-28.",
      "plan": {
        "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/square/public-comparison-plan.json",
        "sha256": "e5416760a23e086b3221595e7d3306048d74dc5162c64ac3043bcfcf911b3096"
      },
      "coveredItems": [
        "Square",
        "Square Plus",
        "Square Premium",
        "Stripe Terminal",
        "SumUp",
        "Shopify POS (Basic plan)"
      ],
      "excludedItems": {
        "Clover": "Quote-based / custom enterprise pricing; no public self-serve rate.",
        "Toast": "Quote-based / custom enterprise pricing; no public self-serve rate.",
        "Helcim": "Quote-based / custom enterprise pricing; no public self-serve rate."
      },
      "sources": [
        {
          "item": "Square",
          "url": "https://squareup.com/us/en/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/square-benchmark-vendors.json",
            "sha256": "04aab8890706873ba317d74390d3f280ed190820e2213c37c76145b9cf489361"
          },
          "extractedFacts": "Square (Square Free (in person)): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Square Plus",
          "url": "https://squareup.com/us/en/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/square-benchmark-vendors.json",
            "sha256": "04aab8890706873ba317d74390d3f280ed190820e2213c37c76145b9cf489361"
          },
          "extractedFacts": "Square Plus (Square Plus (in person)): base=$49/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Square Premium",
          "url": "https://squareup.com/us/en/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/square-benchmark-vendors.json",
            "sha256": "04aab8890706873ba317d74390d3f280ed190820e2213c37c76145b9cf489361"
          },
          "extractedFacts": "Square Premium (Square Premium (in person)): base=$149/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Stripe Terminal",
          "url": "https://stripe.com/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/square-benchmark-vendors.json",
            "sha256": "04aab8890706873ba317d74390d3f280ed190820e2213c37c76145b9cf489361"
          },
          "extractedFacts": "Stripe Terminal (Terminal in-person): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "SumUp",
          "url": "https://www.sumup.com/en-us/pricing/",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/square-benchmark-vendors.json",
            "sha256": "04aab8890706873ba317d74390d3f280ed190820e2213c37c76145b9cf489361"
          },
          "extractedFacts": "SumUp (Free plan): base=$0/mo, perSeat=$0/mo, includedVolume=0.0001."
        },
        {
          "item": "Shopify POS (Basic plan)",
          "url": "https://www.shopify.com/pricing",
          "checkedAt": "2026-11-28T16:44:55Z",
          "snapshot": {
            "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/square-benchmark-vendors.json",
            "sha256": "04aab8890706873ba317d74390d3f280ed190820e2213c37c76145b9cf489361"
          },
          "extractedFacts": "Shopify POS (Basic plan) (Basic): base=$29/mo, perSeat=$0/mo, includedVolume=0.0001."
        }
      ]
    }
  ],
  "sourceArtifacts": [
    {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/research/sources/square-benchmark-vendors.json",
      "sha256": "04aab8890706873ba317d74390d3f280ed190820e2213c37c76145b9cf489361"
    },
    {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/square/benchmark-inputs.json",
      "sha256": "88cce2c9b415bd964e005bbf618280a0afb7421b27bfd76acb733253acccde1d"
    },
    {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/square/public-comparison-plan.json",
      "sha256": "e5416760a23e086b3221595e7d3306048d74dc5162c64ac3043bcfcf911b3096"
    }
  ],
  "execution": {
    "command": [
      "python3",
      "reports/alternatives-daily/2026-11-28/mindmap/evidence/square/model.py"
    ],
    "code": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/square/model.py",
      "sha256": "541c124a72482dd75028852dc81dec10105bbec6ba32364f0ceb4ab46a25fb4c"
    },
    "inputs": [
      {
        "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/square/benchmark-inputs.json",
        "sha256": "88cce2c9b415bd964e005bbf618280a0afb7421b27bfd76acb733253acccde1d"
      }
    ],
    "output": {
      "path": "reports/alternatives-daily/2026-11-28/mindmap/evidence/square/output.json",
      "sha256": "b3647573154ee1cb691ae620201db6b112af0ee9d37f6419fe1d18b0bf92a7eb"
    }
  }
}
```

## Executed Scenario Model Output (`output.json` — Cite Exact Figures)
Populate `sections[0].table` (or `scenarioTable` on Vertical/Template pages) directly from `scenarioTable` below so every figure matches the verified benchmark.
```json
{
  "mode": "saas-tco",
  "subject": "Square",
  "scenarioCount": 3,
  "distinctScenarioWinners": [
    "Stripe Terminal"
  ],
  "scenarios": [
    {
      "scenario": "Corner shop: 500 sales a month ($15,000 at a $30 average ticket)",
      "lowestCostVendor": "Stripe Terminal",
      "lowestMonthlyUsd": 430.0,
      "quotes": {
        "Square": {
          "monthlyUsd": 465.0,
          "annualUsd": 5580.0,
          "plan": "Square Free (in person)",
          "savingsVsSubjectMonthlyUsd": 0.0,
          "savingsVsSubjectAnnualUsd": 0.0
        },
        "Square Plus": {
          "monthlyUsd": 499.0,
          "annualUsd": 5988.0,
          "plan": "Square Plus (in person)",
          "savingsVsSubjectMonthlyUsd": -34.0,
          "savingsVsSubjectAnnualUsd": -408.0
        },
        "Square Premium": {
          "monthlyUsd": 584.0,
          "annualUsd": 7008.0,
          "plan": "Square Premium (in person)",
          "savingsVsSubjectMonthlyUsd": -119.0,
          "savingsVsSubjectAnnualUsd": -1428.0
        },
        "Stripe Terminal": {
          "monthlyUsd": 430.0,
          "annualUsd": 5160.0,
          "plan": "Terminal in-person",
          "savingsVsSubjectMonthlyUsd": 35.0,
          "savingsVsSubjectAnnualUsd": 420.0
        },
        "SumUp": {
          "monthlyUsd": 440.0,
          "annualUsd": 5280.0,
          "plan": "Free plan",
          "savingsVsSubjectMonthlyUsd": 25.0,
          "savingsVsSubjectAnnualUsd": 300.0
        },
        "Shopify POS (Basic plan)": {
          "monthlyUsd": 469.0,
          "annualUsd": 5628.0,
          "plan": "Basic",
          "savingsVsSubjectMonthlyUsd": -4.0,
          "savingsVsSubjectAnnualUsd": -48.0
        }
      }
    },
    {
      "scenario": "Busy shop: 3,000 sales a month ($90,000)",
      "lowestCostVendor": "Stripe Terminal",
      "lowestMonthlyUsd": 2580.0,
      "quotes": {
        "Square": {
          "monthlyUsd": 2790.0,
          "annualUsd": 33480.0,
          "plan": "Square Free (in person)",
          "savingsVsSubjectMonthlyUsd": 0.0,
          "savingsVsSubjectAnnualUsd": 0.0
        },
        "Square Plus": {
          "monthlyUsd": 2749.0,
          "annualUsd": 32988.0,
          "plan": "Square Plus (in person)",
          "savingsVsSubjectMonthlyUsd": 41.0,
          "savingsVsSubjectAnnualUsd": 492.0
        },
        "Square Premium": {
          "monthlyUsd": 2759.0,
          "annualUsd": 33108.0,
          "plan": "Square Premium (in person)",
          "savingsVsSubjectMonthlyUsd": 31.0,
          "savingsVsSubjectAnnualUsd": 372.0
        },
        "Stripe Terminal": {
          "monthlyUsd": 2580.0,
          "annualUsd": 30960.0,
          "plan": "Terminal in-person",
          "savingsVsSubjectMonthlyUsd": 210.0,
          "savingsVsSubjectAnnualUsd": 2520.0
        },
        "SumUp": {
          "monthlyUsd": 2640.0,
          "annualUsd": 31680.0,
          "plan": "Free plan",
          "savingsVsSubjectMonthlyUsd": 150.0,
          "savingsVsSubjectAnnualUsd": 1800.0
        },
        "Shopify POS (Basic plan)": {
          "monthlyUsd": 2669.0,
          "annualUsd": 32028.0,
          "plan": "Basic",
          "savingsVsSubjectMonthlyUsd": 121.0,
          "savingsVsSubjectAnnualUsd": 1452.0
        }
      }
    },
    {
      "scenario": "High-volume shop: 10,000 sales a month ($300,000)",
      "lowestCostVendor": "Stripe Terminal",
      "lowestMonthlyUsd": 8600.0,
      "quotes": {
        "Square": {
          "monthlyUsd": 9300.0,
          "annualUsd": 111600.0,
          "plan": "Square Free (in person)",
          "savingsVsSubjectMonthlyUsd": 0.0,
          "savingsVsSubjectAnnualUsd": 0.0
        },
        "Square Plus": {
          "monthlyUsd": 9049.0,
          "annualUsd": 108588.0,
          "plan": "Square Plus (in person)",
          "savingsVsSubjectMonthlyUsd": 251.0,
          "savingsVsSubjectAnnualUsd": 3012.0
        },
        "Square Premium": {
          "monthlyUsd": 8849.0,
          "annualUsd": 106188.0,
          "plan": "Square Premium (in person)",
          "savingsVsSubjectMonthlyUsd": 451.0,
          "savingsVsSubjectAnnualUsd": 5412.0
        },
        "Stripe Terminal": {
          "monthlyUsd": 8600.0,
          "annualUsd": 103200.0,
          "plan": "Terminal in-person",
          "savingsVsSubjectMonthlyUsd": 700.0,
          "savingsVsSubjectAnnualUsd": 8400.0
        },
        "SumUp": {
          "monthlyUsd": 8800.0,
          "annualUsd": 105600.0,
          "plan": "Free plan",
          "savingsVsSubjectMonthlyUsd": 500.0,
          "savingsVsSubjectAnnualUsd": 6000.0
        },
        "Shopify POS (Basic plan)": {
          "monthlyUsd": 8829.0,
          "annualUsd": 105948.0,
          "plan": "Basic",
          "savingsVsSubjectMonthlyUsd": 471.0,
          "savingsVsSubjectAnnualUsd": 5652.0
        }
      }
    }
  ],
  "scenarioTable": {
    "caption": "Internal Plan & Workload Cost Model Across 3 Standardized Scenarios",
    "headers": [
      "Workload Scenario",
      "Square",
      "Square Plus",
      "Square Premium",
      "Stripe Terminal",
      "SumUp",
      "Lowest-Cost Pick"
    ],
    "rows": [
      [
        "Corner shop: 500 sales a month ($15,000 at a $30 average ticket)",
        "$465.00/mo",
        "$499.00/mo",
        "$584.00/mo",
        "$430.00/mo",
        "$440.00/mo",
        "Stripe Terminal ($430.00/mo)"
      ],
      [
        "Busy shop: 3,000 sales a month ($90,000)",
        "$2,790.00/mo",
        "$2,749.00/mo",
        "$2,759.00/mo",
        "$2,580.00/mo",
        "$2,640.00/mo",
        "Stripe Terminal ($2,580.00/mo)"
      ],
      [
        "High-volume shop: 10,000 sales a month ($300,000)",
        "$9,300.00/mo",
        "$9,049.00/mo",
        "$8,849.00/mo",
        "$8,600.00/mo",
        "$8,800.00/mo",
        "Stripe Terminal ($8,600.00/mo)"
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
