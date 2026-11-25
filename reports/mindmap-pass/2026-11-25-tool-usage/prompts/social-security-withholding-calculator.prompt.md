# Approved Page Assignment: `/social-security-withholding-calculator/` (`social-security-withholding-calculator`)
- **Action ID:** `C2` (create new content)
- **Active Mindmap Track:** `guide`
- **Title:** Social Security Withholding Calculator (Form W-4V)
- **Page Type / Format / Medium:** explainer (tool page; mirrors /social-security-taxable-benefits-calculator/) | calculator | interactive tool
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** How much federal tax should I withhold from my Social Security benefit (Form W-4V)? [PAA 1/6 on-topic: 'How is Social Security withholding calculated?'; ac 14 how/can/does questions on submitting W-4V; 5/6 PAA off-topic]
- **Working Answer (Col 11):** Estimate your tax on the benefit, then pick the W-4V rate (7, 10, 12 or 22% of each payment) whose yearly total is closest to it without falling short; no other percentage or amount is allowed (IRS Form W-4V).
- **Answer Placement (Col 12):** section 1: calculator results panel plus the four-rate comparison

## Demand & Differentiation Context
- **Problem / Gap:** lookup: no same-intent page; nearest /social-security-taxable-benefits-calculator/ (how much of benefits is taxable, existing tool, no W-4V step; its 2026-11-04 persona flagged 'no withholding next step') and /guides/states-that-tax-social-security (states). Persona next job: retiree 70 finishing the COLA/taxable-benefits calculators. Demand (DataForSEO measured): social security tax withholding calculator 720/mo KD 31; social security withholding calculator 720 KD 28; withhold tax from social security 2,400 KD 22; w-4v 1,600 KD 17.
- **Keyword Evidence:** "DataForSEO us 2026-11-25 measured: withhold tax from social security 2,400/mo KD 22; w-4v 1,600 KD 17; social security tax withholding calculator 720 KD 31; social security withholding calculator 720 KD 28; w-4v social security withholding 50-500 (autocomplete estimate, not measured). Primary: social security withholding calculator."
- **Why New Page / Angle:** coverage_lookup: no page for W-4V withholding. /social-security-taxable-benefits-calculator/ answers 'how much of my benefit is taxable' (its own 2026-11-04 persona asked for a withholding next step); /guides/senior-deduction-social-security and /guides/states-that-tax-social-security cover other intents. No commits; past chart 2026-11-04-tool-usage lists it as 'Next in line' spec. Duplicate decision: KEEP (pending independent review).
- **Intent-Based Our Takeaway:** "If your estimated tax on benefits is below 7 percent of the yearly benefit, W-4V at 7 percent over-withholds and you get a refund; if it exceeds 22 percent, W-4V cannot cover it and you need estimated payments or higher other-income withholding. Verify with a tax professional if your income is unusual."

## Eligible Internal & Testing Evidence Pool for Page Type `regulated-legal-or-financial` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

## Approved Section Outline
1. **Social Security Withholding Calculator** — calculator: benefit, filing status, other income -> estimated tax and the four W-4V rates compared
2. **How Form W-4V Withholding Works** — only 7, 10, 12 or 22 percent of each payment; how to file with SSA; stopping or changing it; why estimated tax can still be due
3. **Which W-4V Rate Fits Your Income** — worked cases showing under- and over-withholding, when quarterly estimates are the alternative
4. **FAQ** — how is Social Security withholding calculated; how to submit W-4V; can I file online; does it count as paid tax; can I pick another percentage

## Approved Internal Outbound Links
- {"source": "/social-security-withholding-calculator/", "target": "/social-security-taxable-benefits-calculator/", "section": "How Form W-4V Withholding Works", "anchor": "how much of your Social Security is taxable", "purpose": "taxable portion input", "inspection": {"path": "reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt", "sha256": "6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d"}}
- {"source": "/social-security-withholding-calculator/", "target": "/social-security-cola-calculator/", "section": "Which W-4V Rate Fits Your Income", "anchor": "2027 Social Security COLA calculator", "purpose": "new benefit amount", "inspection": {"path": "reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt", "sha256": "6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d"}}

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
  "route": "/social-security-withholding-calculator/",
  "readerQuestion": "How much federal tax should I withhold from my Social Security benefit (Form W-4V)? [PAA 1/6 on-topic: 'How is Social Security withholding calculated?'; ac 14 how/can/does questions on submitting W-4V; 5/6 PAA off-topic]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/approval-manifest.json",
      "sha256": "33ae4a84c3df27e1f4ddaa717203115760ee88ba7f11a65acac5df8ed9c0ec9a"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/chart-review.json",
      "sha256": "c7ab383e60370ee6227720d260018028cbbaf9d9cd0217dddd9857c67e0bf979"
    },
    "actionId": "C2"
  },
  "presentation": {
    "medium": "interactive tool",
    "placement": "section 1: calculator results panel plus the four-rate comparison",
    "reason": "The best W-4V rate depends on the reader's benefit and other income; the four-rate comparison needs their numbers.",
    "readerInputs": [
      "Monthly benefit",
      "Filing status",
      "Other taxable income",
      "Existing withholding"
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
  "decisionGap": "The taxable-benefits calculator stops at the taxable amount, and SSA and IRS pages list the four W-4V rates without helping a reader see which one covers their own estimated tax. No page compares the four rates against an estimate.",
  "finding": "A single filer 65 or older with a $2,400 monthly benefit and $30,000 of other income has $13,340 of taxable benefits and about $2,775 of estimated 2026-rules federal tax; 7% of each payment withholds $2,016 (short), 10% withholds $2,880 (about $105 over), so 10% is the lowest allowed rate that does not fall short. Form W-4V allows only 7%, 10%, 12% or 22% of each payment.",
  "conditions": "Tax year basis is 2026: 2026 brackets and standard deduction (Rev. Proc. 2025-32) are applied and 2027 brackets are not; the senior deduction, credits, state tax and itemized deductions are left out so the estimate can run high; the reader may enter tax already paid and the months the rate would apply.",
  "whatWouldChange": "If other income is higher so that estimated tax exceeds 22% of the yearly benefit, no W-4V rate covers it and estimated payments or withholding on other income are needed; if the benefit is fully tax-free or tax is already covered, no request is needed; a rate change by law or 2027 bracket publication would change the figures.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/social-security-withholding-calculator/cases.json",
    "sha256": "b2e6cc18e63f2c7901a9ff12b863d637ba6ed9d00762e009e7d43944ac366b05"
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
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/ac-w-4v-social-security.csv",
      "sha256": "5b1480e925ed8c37f23d21138487dd8baeaabb9603f869320867d5107da022d0"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/calc-examples.json",
      "sha256": "76302d3e54e979b5581893fea05e3c183dd34f22356ee1d3157e748fc763e75b"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-form-w4v.txt",
      "sha256": "aff3f79dcbbc25aaa7d5942219a0c53947aad3642406e305ca179296f4ff44f8"
    }
  ],
  "presentationArtifacts": [
    {
      "path": "src/lib/social-security-withholding.ts",
      "sha256": "5b76acb0d710e369f1004c95855f489f0252a650da5b49980e2173e0bfd8fcdc"
    },
    {
      "path": "src/components/SocialSecurityWithholdingCalculator.tsx",
      "sha256": "fa2d86fb88c7a817f7fb6eb90b5ab85c576394678d8c633a23b7b612d5e6cc43"
    }
  ],
  "method": "Taxable benefits by Pub 915 Worksheet 1 (existing engine); federal tax = ordinary-income brackets on other income plus taxable benefits, less the 2026 standard deduction and the age-65 additional amount; each W-4V rate x monthly benefit x months compared with tax still to cover; lowest rate whose withholding is at least the tax is recommended. Executed through scripts/test-tool-usage-1125.mjs.",
  "units": "USD per year unless stated; rates as decimals",
  "limitations": "2026 tax rules only; no state tax, credits, senior deduction, itemized deductions, capital-gain rates or additional Medicare tax; filing status limited to single, head of household, married filing jointly and married filing separately living together.",
  "counterexample": "At a $3,000 monthly benefit and $200,000 of other income the estimated tax is $44,440 and even 22% withholds only $7,920, so no W-4V rate covers the tax; at a $1,500 monthly benefit with no other income the benefits are not taxable and no withholding is needed.",
  "execution": {
    "command": [
      "node",
      "scripts/test-tool-usage-1125.mjs",
      "reports/mindmap-pass/2026-11-25-tool-usage/evidence/social-security-withholding-calculator/output.json",
      "w4v"
    ],
    "code": {
      "path": "scripts/test-tool-usage-1125.mjs",
      "sha256": "a6c6df7d3379f9dfa09d71bfb0f00cf07113aee22deee60845caa932b2225260"
    },
    "inputs": [
      {
        "path": "src/lib/social-security-withholding.ts",
        "sha256": "5b76acb0d710e369f1004c95855f489f0252a650da5b49980e2173e0bfd8fcdc"
      },
      {
        "path": "src/lib/social-security-taxable.ts",
        "sha256": "83784cd4ffc41e9d0d730ef646c8527e51c745641a98fb262264fa15add649c5"
      },
      {
        "path": "src/lib/tax-bracket.ts",
        "sha256": "ee67769761fe38cde726dc35aaefac675c47c3df137ee40a8123dd0f19d8431e"
      },
      {
        "path": "src/lib/stock-capital-gains.ts",
        "sha256": "778deb5b349499e742c62a0510a4d2783be84b82dea545e29819dfb376bc1718"
      },
      {
        "path": "src/components/SocialSecurityWithholdingCalculator.tsx",
        "sha256": "fa2d86fb88c7a817f7fb6eb90b5ab85c576394678d8c633a23b7b612d5e6cc43"
      },
      {
        "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-form-w4v.txt",
        "sha256": "aff3f79dcbbc25aaa7d5942219a0c53947aad3642406e305ca179296f4ff44f8"
      },
      {
        "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-w4v.txt",
        "sha256": "c6a06f8f4972a55bc2ec9b37b4232d85ae1098dfa2852efa3304c9e9cf37c644"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/social-security-withholding-calculator/output.json",
      "sha256": "a44fb0118b3dcc5b591b5093b70786229884e8384303fd8bec7b35f0c3b84f69"
    }
  },
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "scripts/test-tool-usage-1125.mjs",
      "output.json"
    ],
    "scopeAndLimits": "Internal calculation reusing the site's Pub 915 and 2026 bracket engines; the four rates and their limits come from IRS Form W-4V; arithmetic only, not tax advice.",
    "publicMethod": "On-page \"How Form W-4V Withholding Works\" section, the four-rate table in the calculator and the tax-year note beside the result.",
    "placement": "beside the worked example in the intro and in Which W-4V Rate Fits Your Income"
  },
  "takeaway": "Pick the lowest W-4V rate whose yearly total covers your estimated tax; if even 22% falls short, add estimated payments, and if your benefits are not taxable, skip the form. Confirm unusual income with a tax professional.",
  "growth": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/social-security-withholding-calculator/growth.json"
}
```

## Executed Scenario Model Output (`output.json` — Cite Exact Figures)
Cite exact figures from `output.json` below.
```json
{
  "group": "w4v",
  "checks": 135,
  "results": {
    "w4vDefault": {
      "input": {
        "status": "single",
        "monthlyBenefit": 2400,
        "months": 12,
        "otherIncome": 24000,
        "filers65": 1,
        "alreadyPaid": 0
      },
      "result": {
        "taxYear": 2026,
        "annualBenefits": 28800,
        "taxableBenefits": 8240,
        "pctTaxable": 28.6,
        "provisionalIncome": 38400,
        "deduction": 18150,
        "taxableIncome": 14090,
        "estimatedTax": 1442.8,
        "taxToCover": 1442.8,
        "rows": [
          {
            "rate": 0.07,
            "withheld": 2016,
            "surplus": 573.2,
            "coversTax": true
          },
          {
            "rate": 0.1,
            "withheld": 2880,
            "surplus": 1437.2,
            "coversTax": true
          },
          {
            "rate": 0.12,
            "withheld": 3456,
            "surplus": 2013.2,
            "coversTax": true
          },
          {
            "rate": 0.22,
            "withheld": 6336,
            "surplus": 4893.2,
            "coversTax": true
          }
        ],
        "advice": "rate",
        "best": 0.07,
        "neededShare": 0.050097222222222224
      }
    },
    "w4vTaxFree": {
      "taxYear": 2026,
      "annualBenefits": 18000,
      "taxableBenefits": 0,
      "pctTaxable": 0,
      "provisionalIncome": 9000,
      "deduction": 18150,
      "taxableIncome": 0,
      "estimatedTax": 0,
      "taxToCover": 0,
      "rows": [
        {
          "rate": 0.07,
          "withheld": 1260,
          "surplus": 1260,
          "coversTax": true
        },
        {
          "rate": 0.1,
          "withheld": 1800,
          "surplus": 1800,
          "coversTax": true
        },
        {
          "rate": 0.12,
          "withheld": 2160,
          "surplus": 2160,
          "coversTax": true
        },
        {
          "rate": 0.22,
          "withheld": 3960,
          "surplus": 3960,
          "coversTax": true
        }
      ],
      "advice": "none",
      "best": null,
      "neededShare": 0
    },
    "w4vHighIncome": {
      "taxYear": 2026,
      "annualBenefits": 36000,
      "taxableBenefits": 30600,
      "pctTaxable": 85,
      "provisionalIncome": 218000,
      "deduction": 18150,
      "taxableIncome": 212450,
      "estimatedTax": 44440,
      "taxToCover": 44440,
      "rows": [
        {
          "rate": 0.07,
          "withheld": 2520,
          "surplus": -41920,
          "coversTax": false
        },
        {
          "rate": 0.1,
          "withheld": 3600,
          "surplus": -40840,
          "coversTax": false
        },
        {
          "rate": 0.12,
          "withheld": 4320,
          "surplus": -40120,
          "coversTax": false
        },
        {
          "rate": 0.22,
          "withheld": 7920,
          "surplus": -36520,
          "coversTax": false
        }
      ],
      "advice": "short",
      "best": 0.22,
      "neededShare": 1.2344444444444445
    },
    "w4vThreeMonths": {
      "taxYear": 2026,
      "annualBenefits": 28800,
      "taxableBenefits": 8240,
      "pctTaxable": 28.6,
      "provisionalIncome": 38400,
      "deduction": 18150,
      "taxableIncome": 14090,
      "estimatedTax": 1442.8,
      "taxToCover": 1442.8,
      "rows": [
        {
          "rate": 0.07,
          "withheld": 504,
          "surplus": -938.8,
          "coversTax": false
        },
        {
          "rate": 0.1,
          "withheld": 720,
          "surplus": -722.8,
          "coversTax": false
        },
        {
          "rate": 0.12,
          "withheld": 864,
          "surplus": -578.8,
          "coversTax": false
        },
        {
          "rate": 0.22,
          "withheld": 1584,
          "surplus": 141.2,
          "coversTax": true
        }
      ],
      "advice": "rate",
      "best": 0.22,
      "neededShare": 0.2003888888888889
    },
    "w4vMfj": {
      "taxYear": 2026,
      "annualBenefits": 45600,
      "taxableBenefits": 13480,
      "pctTaxable": 29.6,
      "provisionalIncome": 52800,
      "deduction": 35500,
      "taxableIncome": 7980,
      "estimatedTax": 798,
      "taxToCover": 798,
      "rows": [
        {
          "rate": 0.07,
          "withheld": 3192,
          "surplus": 2394,
          "coversTax": true
        },
        {
          "rate": 0.1,
          "withheld": 4560,
          "surplus": 3762,
          "coversTax": true
        },
        {
          "rate": 0.12,
          "withheld": 5472,
          "surplus": 4674,
          "coversTax": true
        },
        {
          "rate": 0.22,
          "withheld": 10032,
          "surplus": 9234,
          "coversTax": true
        }
      ],
      "advice": "rate",
      "best": 0.07,
      "neededShare": 0.0175
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
### `reports/mindmap-pass/2026-11-25-tool-usage/research/ac-w-4v-social-security.csv`
```
seed,suggestion,via
w-4v social security,what w-4v social security number,question:what
w-4v social security,what w-4v social security mean,question:what
w-4v social security,what w-4v social security benefits,question:what
w-4v social security,w 4v social security form,question:what
w-4v social security,w 4v social security,question:what
w-4v social security,w 4v social security form pdf,question:what
w-4v social security,w 4v social security form online,question:what
w-4v social security,w 4 social security,question:what
w-4v social security,w 4 social security form,question:what
w-4v social security,w 4 social security withholding,question:what
w-4v social security,how to submit w 4v to social security,question:how
w-4v social security,how to send w 4v to social security,question:how
w-4v social security,how to file w 4v with social security,question:how
w-4v social security,why w-4v social security number,question:why
w-4v social security,why w-4v social security tax,question:why
w-4v social security,how does social security recalculate withheld benefits,question:why
w-4v social security,is w-4v social security number,question:is
w-4v social security,is w-4v social security withholding,question:is
w-4v social security,where to mail form w 4v for social security,question:is
w-4v social security,does w-4v social security tax,question:does
w-4v social security,does w-4v social security number,question:does
w-4v social security,can i mail w 4v form to social security,question:can
w-4v social security,can i fax w 4v form to social security,question:can
w-4v social security,can i complete form w 4v online for social security,question:can
w-4v social security,should w-4v social security be taxed,question:should
w-4v social security,should w-4v social security number,question:should
w-4v social security,should w-4v social security,question:should
w-4v social security,when w-4v social security benefits,question:when
w-4v social security,when w-4v social security number,question:when
w-4v social security,when w-4v social security is due,question:when
w-4v social security,when w-4v social security payment,question:when
w-4v social security,where to mail w 4v social security,question:when
w-4v social security,when w-4v social security,question:when
w-4v social security,where to send w 4v to social security,question:where
w-4v social security,where to mail w 4v for social security withholding,question:where
w-4v social security,which w-4v social security form to use,question:which

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
### `reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-form-w4v.txt`
```
URL: https://www.irs.gov/pub/irs-pdf/fw4v.pdf
Retrieved: 2026-11-25T19:19:11.642675Z

Form  W-4V
(Rev. January 2026)
                                               Voluntary Withholding Request
                             (For unemployment compensation and certain Federal Government and other payments.)            OMB No. 1545-0074
Department of the Treasury
Internal Revenue Service
                                  Give Form W-4V to the payer of your payments. Do not send it to the IRS.
  1     First name and middle initial                           Last name                                         2 Social security number

  3     Home address (number and street)                        City or town                              State               ZIP code

  4     Claim or identification number (if any) you use with your payer


  5          I want federal income tax withheld from my unemployment compensation at a rate of 10% of each payment.

  6     I want federal income tax withheld from (a) my social security benefits, (b) my social security equivalent Tier 1 railroad retirement
        benefits, (c) my Commodity Credit Corporation loans, (d) certain crop disaster payments under the Agricultural Act of 1949 or
        under Title II of the Disaster Assistance Act of 1988, or (e) dividends and other distributions from Alaska Native Corporations to
        its shareholders, at the rate of (check one):     7%               10%            12%              22%

  7          I want you to stop withholding federal income tax from my payment(s).

Sign
Here        Your signature (This form is not valid unless you sign it.)                                       Date

General Instructions                                                      Note: If you receive social security benefits, you can request
                                                                          changes to your withholding at https://www.ssa.gov/manage-
Section references are to the Internal Revenue Code unless                benefits/request-withhold-taxes, or contact the Social Security
otherwise noted.                                                          Administration (SSA) at 1-800-772-1213, or you can complete Form
Future developments. For the latest information about any future          W-4V and submit it to the SSA.
developments related to Form W-4V, such as legislation enacted            Line 3. If your address is outside the United States or the U.S.
after it was published, go to www.irs.gov/FormW4V.                        territories, enter on line 3 the city, province or state, and name of
Purpose of form. Complete Form W-4V if you want the payer to              the country. Follow the country’s practice for entering the postal
withhold federal income tax from any of the government payments           code. Don’t abbreviate the country name.
shown below.                                                              Line 4. Enter the claim or identification number you use with your
   • Unemployment compensation (including Railroad                        payer. For withholding from social security benefits, the claim
Unemployment Insurance Act (RUIA) payments).                              number is the social security number under which a claim is filed or
                                                                          benefits are paid (for example, 123-45-6789A or 123-45-6789B6).
   • Social security benefits.                          
```
