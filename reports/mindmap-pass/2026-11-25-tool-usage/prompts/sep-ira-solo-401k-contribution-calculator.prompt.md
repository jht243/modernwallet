# Approved Page Assignment: `/sep-ira-solo-401k-contribution-calculator/` (`sep-ira-solo-401k-contribution-calculator`)
- **Action ID:** `C1` (create new content)
- **Active Mindmap Track:** `guide`
- **Title:** SEP IRA and Solo 401(k) Contribution Calculator
- **Page Type / Format / Medium:** explainer (tool page; mirrors /social-security-taxable-benefits-calculator/) | calculator | interactive tool
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** How much can I put into a SEP IRA or solo 401(k) as a self-employed person? [PAA 1/6 on-topic: 'How much am I allowed to contribute to my SEP IRA?'; ac 4/14 how-is-calculated/limit questions; PAA 5/6 off-topic retirement-saving generics]
- **Working Answer (Col 11):** Roughly 20% of net earnings after half of SE tax for a SEP, and the same plus the $25,500 (2027) employee deferral for a solo 401(k), capped at $75,000 (figure); on $100,000 profit that is $18,587 for a SEP and $44,087 for a solo 401(k).
- **Answer Placement (Col 12):** section 1: calculator results panel and intro worked example

## Demand & Differentiation Context
- **Problem / Gap:** lookup: /compare/sep-ira-vs-solo-401k - reader intent: choose between two plans, not compute own maximum; /guides/401k-contribution-limits-2026 and /guides/ira-contribution-limits-2026 - generic limits for employees. No calculator. Persona next job: freelance delivery driver (mileage-deduction persona, self-employment-tax seed) asking after SE tax how much she can shelter. Demand (DataForSEO 2026-11-25, us, measured): solo 401k contribution calculator 720/mo KD 3; sep ira contribution calculator 480 KD 3; sep ira calculator 720 KD 0; solo 401k contribution limit 4,400 KD 14.
- **Keyword Evidence:** "DataForSEO us 2026-11-25 measured (SEMRUSH HTTP 403): solo 401k contribution calculator 720/mo KD 3; sep ira calculator 720 KD 0; sep ira contribution calculator 480 KD 3; solo 401k contribution limit 4,400 KD 14; sep ira contribution limit 1,600 KD 40; sep ira vs solo 401k 1,600 KD 2. Primary: sep ira contribution calculator (research/keyword-volumes*.json)."
- **Why New Page / Angle:** coverage_lookup (research/coverage-lookup.txt): /compare/sep-ira-vs-solo-401k (reader chooses a plan; no calculation of own maximum), /guides/401k-contribution-limits-2026 and /guides/ira-contribution-limits-2026 (employee limits, not self-employed formulas). No redirects, no commits naming the topic, no past chart row; same-run overlap none. Duplicate decision: KEEP (pending independent review). Spec backlog: ledger 2026-11-04 sep-ira-solo-401k-contribution-calculator (seed self-employment-tax).
- **Intent-Based Our Takeaway:** "For most sole proprietors a solo 401(k) allows far more than a SEP at the same profit because the $25,500 employee deferral sits on top of the 20% employer share; at high profit both hit the $75,000 cap and a SEP is simpler. The answer changes for anyone with employees (SEP must cover them) or W-2 deferrals elsewhere that use up the employee limit."

## Eligible Internal & Testing Evidence Pool for Page Type `regulated-legal-or-financial` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

## Approved Section Outline
1. **SEP IRA and Solo 401(k) Contribution Calculator** — calculator + live results: SEP max, solo 401(k) employee + employer max, which allows more, cap warnings
2. **How the Maximum Is Figured** — Pub 560 reduced-rate method (20% of net earnings after half of SE tax), 2026 vs 2027 limits, $75,000/$72,000 cap, compensation limit, catch-up amounts, worked $100,000 example
3. **When a Solo 401(k) Beats a SEP IRA** — low-income crossover, Roth/loan features, deadlines, who should skip it (employees, other plan deferrals)
4. **FAQ** — how much can I contribute to a SEP IRA; deadline; how is it calculated; how contributions affect taxes; can I have both

## Approved Internal Outbound Links
- {"source": "/sep-ira-solo-401k-contribution-calculator/", "target": "/compare/sep-ira-vs-solo-401k", "section": "When a Solo 401(k) Beats a SEP IRA", "anchor": "SEP-IRA vs Solo 401(k) comparison", "purpose": "fuller plan comparison", "inspection": {"path": "reports/mindmap-pass/2026-11-25-tool-usage/inspections/compare-sep-solo.txt", "sha256": "3ac808f1a26f44ccda803052a965b168189c61cb23092612bc977e03ae1b418a"}}
- {"source": "/sep-ira-solo-401k-contribution-calculator/", "target": "/self-employment-tax/", "section": "How the Maximum Is Figured", "anchor": "self-employment tax calculator", "purpose": "SE tax feeds net earnings", "inspection": {"path": "reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt", "sha256": "6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d"}}

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
  "route": "/sep-ira-solo-401k-contribution-calculator/",
  "readerQuestion": "How much can I put into a SEP IRA or solo 401(k) as a self-employed person? [PAA 1/6 on-topic: 'How much am I allowed to contribute to my SEP IRA?'; ac 4/14 how-is-calculated/limit questions; PAA 5/6 off-topic retirement-saving generics]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/approval-manifest.json",
      "sha256": "33ae4a84c3df27e1f4ddaa717203115760ee88ba7f11a65acac5df8ed9c0ec9a"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/chart-review.json",
      "sha256": "c7ab383e60370ee6227720d260018028cbbaf9d9cd0217dddd9857c67e0bf979"
    },
    "actionId": "C1"
  },
  "presentation": {
    "medium": "interactive tool",
    "placement": "section 1: calculator results panel and intro worked example",
    "reason": "Her maximum depends on her own profit and age, and the two plans diverge at low income; a table cannot show that.",
    "readerInputs": [
      "Net self-employment profit",
      "Tax year 2026/2027",
      "Age 50+ or 60-63",
      "Other 401(k) deferrals this year"
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
  "decisionGap": "Existing pages explain the plans (the SEP IRA vs solo 401(k) comparison) or give employee limits (401(k) and IRA limit guides), but none turns a self-employed reader's own profit into a maximum for each plan side by side with the 2027 limits.",
  "finding": "At $100,000 of Schedule C profit and tax year 2027, the SEP IRA maximum is $18,587 and the solo 401(k) maximum is $44,087 ($25,500 employee deferral plus $18,587 employer share), $52,587 with the $8,500 catch-up at 50 or older. The 20% employer share is the same in both plans, so the solo 401(k) allows more by the employee deferral until both reach the $75,000 limit (2027) at about $375,000 of net earnings.",
  "conditions": "Sole proprietor or single-member LLC with no employees; Schedule C profit only; employee deferral limit shared with any other plan; 2027 self-employment tax uses the labeled 2026 Social Security wage base of $184,500 (no 2027 base is asserted), which matters only above about $199,800 of profit; plan documents can set lower limits.",
  "whatWouldChange": "A SEP must cover eligible employees, so a business with employees loses the cost advantage; other-plan deferrals that use up the $25,500 limit remove the solo 401(k) advantage; Congress or the IRS changing the limits or the reduced-rate method; the 2027 wage base being published would change SE tax above about $199,800.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/sep-ira-solo-401k-contribution-calculator/cases.json",
    "sha256": "46d1b052bf120a2fcf8fd3711fad2a45bdc10a865d9ad3decc73dbf61ecaa917"
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
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/ac-sep-ira-contribution.csv",
      "sha256": "78aac4508e4a05ff5f7e4841393fd1d04ed9810c5a18909351a033c9fdd2d9c8"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/calc-examples.json",
      "sha256": "76302d3e54e979b5581893fea05e3c183dd34f22356ee1d3157e748fc763e75b"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-ir-2026-136.txt",
      "sha256": "57dd51ab5e63272cf5cc8b8b602de0505ac815d29cab6dc26725d91d0ad3baef"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-ir-2027-limits.txt",
      "sha256": "383a2c6fcda17b0586cd11c7970f1e332368c10e83c38cbe5a7d0d0fd01fb67d"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-notice-2026-66.txt",
      "sha256": "f8525ec6cdc671efe9f43c40ae527667c40e8b998173872140468ac70c5c2259"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-pub560.txt",
      "sha256": "db1f1fbe4645f567aa19f6fab7144a28c9881114773d1425636b57ae48b76f2a"
    }
  ],
  "presentationArtifacts": [
    {
      "path": "src/lib/sep-solo-401k.ts",
      "sha256": "7e71a882cf93aac89135e394f812b73a86d18ce3904525cf08474a259dd2c11d"
    },
    {
      "path": "src/components/SepSolo401kCalculator.tsx",
      "sha256": "7f822392932c398d5b62be7d06bbf7483050012ff30f4cfd9f934b78f1838cff"
    }
  ],
  "method": "Pub 560 reduced-rate method: net earnings = Schedule C profit minus half of Social Security and Medicare self-employment tax (reusing src/lib/self-employment-tax.ts); employer share = 20% of net earnings up to the annual compensation limit, capped at the 415(c) limit; solo employee deferral = $25,500 (2027) or $24,500 (2026) minus other-plan deferrals, limited to earned income left after the employer share; catch-up outside the 415(c) limit. Executed through scripts/test-tool-usage-1125.mjs, which bundles the engine and asserts the fixtures.",
  "units": "USD per tax year; rates as decimals",
  "limitations": "Estimate for sole proprietors with no employees; no Roth catch-up wage test; no spouse participation; 2027 Social Security wage base not used (2026 base of $184,500 labeled); Additional Medicare Tax excluded from the half-SE-tax deduction as the IRS rule requires; plan documents may be stricter.",
  "counterexample": "At $20,000 of profit the SEP IRA maximum is $3,717 but the solo 401(k) maximum is $18,587, the whole of net earnings, so the solo 401(k) advantage is largest in relative terms at low profit; with $25,500 of deferrals already made at a day-job 401(k) the solo 401(k) advantage is $0 and the SEP IRA is the simpler choice; at $500,000 of profit both plans stop at $75,000 and the SEP IRA is simpler.",
  "execution": {
    "command": [
      "node",
      "scripts/test-tool-usage-1125.mjs",
      "reports/mindmap-pass/2026-11-25-tool-usage/evidence/sep-ira-solo-401k-contribution-calculator/output.json",
      "sep"
    ],
    "code": {
      "path": "scripts/test-tool-usage-1125.mjs",
      "sha256": "a6c6df7d3379f9dfa09d71bfb0f00cf07113aee22deee60845caa932b2225260"
    },
    "inputs": [
      {
        "path": "src/lib/sep-solo-401k.ts",
        "sha256": "7e71a882cf93aac89135e394f812b73a86d18ce3904525cf08474a259dd2c11d"
      },
      {
        "path": "src/lib/self-employment-tax.ts",
        "sha256": "94611b4ad5f2fbdbb2def0ab89c20316f682dd4ebb54d12987928127c5c3b125"
      },
      {
        "path": "src/components/SepSolo401kCalculator.tsx",
        "sha256": "7f822392932c398d5b62be7d06bbf7483050012ff30f4cfd9f934b78f1838cff"
      },
      {
        "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-pub560.txt",
        "sha256": "db1f1fbe4645f567aa19f6fab7144a28c9881114773d1425636b57ae48b76f2a"
      },
      {
        "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-notice-2026-66.txt",
        "sha256": "f8525ec6cdc671efe9f43c40ae527667c40e8b998173872140468ac70c5c2259"
      },
      {
        "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-ir-2027-limits.txt",
        "sha256": "383a2c6fcda17b0586cd11c7970f1e332368c10e83c38cbe5a7d0d0fd01fb67d"
      },
      {
        "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-ir-2026-136.txt",
        "sha256": "57dd51ab5e63272cf5cc8b8b602de0505ac815d29cab6dc26725d91d0ad3baef"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/sep-ira-solo-401k-contribution-calculator/output.json",
      "sha256": "bf177bf496c54d9ec7547b705a0c8a50f6793eb0224894e7721d0d425b2e7a5e"
    }
  },
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "scripts/test-tool-usage-1125.mjs",
      "output.json"
    ],
    "scopeAndLimits": "Internal calculation from IRS Publication 560 and the IRS 2026 and 2027 limit announcements; arithmetic of the formula, not a product test; not tax advice.",
    "publicMethod": "On-page \"How the Maximum Is Figured\" section and the calculator itself, which shows the inputs, the 20% employer share and the limits table.",
    "placement": "beside the worked $100,000 example in the intro and in How the Maximum Is Figured"
  },
  "takeaway": "For most sole proprietors a solo 401(k) allows far more than a SEP IRA at the same profit because the employee deferral sits on top of the same 20% employer share; at high profit both reach the annual limit and a SEP IRA is simpler. The answer changes with employees (a SEP must cover them) and with deferrals made at another job.",
  "growth": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/sep-ira-solo-401k-contribution-calculator/growth.json"
}
```

## Executed Scenario Model Output (`output.json` — Cite Exact Figures)
Cite exact figures from `output.json` below.
```json
{
  "group": "sep",
  "checks": 135,
  "results": {
    "sep100k2027": {
      "year": 2027,
      "limits": {
        "annualAdditionsLimit": 75000,
        "deferralLimit": 25500,
        "catchUp50": 8500,
        "catchUp60to63": 11750,
        "compensationLimit": 375000
      },
      "seTax": 14129.55,
      "halfSeTax": 7064.78,
      "netEarnings": 92935.22,
      "countedEarnings": 92935.22,
      "employerBeforeCap": 18587.04,
      "employer": 18587.04,
      "sepMax": 18587.04,
      "employeeDeferral": 25500,
      "catchUp": 0,
      "soloMax": 44087.04,
      "soloMaxWithCatchUp": 44087.04,
      "soloAdvantage": 25500,
      "flags": {
        "employerCapped": false,
        "compensationCapped": false,
        "deferralReducedByOtherPlans": false,
        "deferralLimitedByEarnings": false,
        "belowSeFloor": false,
        "noEarnings": false,
        "seBaseEstimate": false
      }
    },
    "sep100k2027age50": {
      "year": 2027,
      "limits": {
        "annualAdditionsLimit": 75000,
        "deferralLimit": 25500,
        "catchUp50": 8500,
        "catchUp60to63": 11750,
        "compensationLimit": 375000
      },
      "seTax": 14129.55,
      "halfSeTax": 7064.78,
      "netEarnings": 92935.22,
      "countedEarnings": 92935.22,
      "employerBeforeCap": 18587.04,
      "employer": 18587.04,
      "sepMax": 18587.04,
      "employeeDeferral": 25500,
      "catchUp": 8500,
      "soloMax": 44087.04,
      "soloMaxWithCatchUp": 52587.04,
      "soloAdvantage": 34000,
      "flags": {
        "employerCapped": false,
        "compensationCapped": false,
        "deferralReducedByOtherPlans": false,
        "deferralLimitedByEarnings": false,
        "belowSeFloor": false,
        "noEarnings": false,
        "seBaseEstimate": false
      }
    },
    "sep100k2027age60": {
      "year": 2027,
      "limits": {
        "annualAdditionsLimit": 75000,
        "deferralLimit": 25500,
        "catchUp50": 8500,
        "catchUp60to63": 11750,
        "compensationLimit": 375000
      },
      "seTax": 14129.55,
      "halfSeTax": 7064.78,
      "netEarnings": 92935.22,
      "countedEarnings": 92935.22,
      "employerBeforeCap": 18587.04,
      "employer": 18587.04,
      "sepMax": 18587.04,
      "employeeDeferral": 25500,
      "catchUp": 11750,
      "soloMax": 44087.04,
      "soloMaxWithCatchUp": 55837.04,
      "soloAdvantage": 37250,
      "flags": {
        "employerCapped": false,
        "compensationCapped": false,
        "deferralReducedByOtherPlans": false,
        "deferralLimitedByEarnings": false,
        "belowSeFloor": false,
        "noEarnings": false,
        "seBaseEstimate": false
      }
    },
    "sep100k2026": {
      "year": 2026,
      "limits": {
        "annualAdditionsLimit": 72000,
        "deferralLimit": 24500,
        "catchUp50": 8000,
        "catchUp60to63": 11250,
        "compensationLimit": 360000
      },
      "seTax": 14129.55,
      "halfSeTax": 7064.78,
      "netEarnings": 92935.22,
      "countedEarnings": 92935.22,
      "employerBeforeCap": 18587.04,
      "employer": 18587.04,
      "sepMax": 18587.04,
      "employeeDeferral": 24500,
      "catchUp": 0,
      "soloMax": 43087.04,
      "soloMaxWithCatchUp": 43087.04,
      "soloAdvantage": 24500,
      "flags": {
        "employerCapped": false,
        "compensationCapped": false,
        "deferralReducedByOtherPlans": false,
        "deferralLimitedByEarnings": false,
        "belowSeFloor": false,
        "noEarnings": false,
        "seBaseEstimate": false
      }
    },
    "sep500k2027": {
      "year": 2027,
      "limits": {
        "annualAdditionsLimit": 75000,
        "deferralLimit": 25500,
        "catchUp50": 8500,
        "catchUp60to63": 11750,
        "compensationLimit": 375000
      },
      "seTax": 36268.75,
      "halfSeTax": 18134.38,
      "netEarnings": 481865.62,
      "countedEarnings": 375000,
      "employerBeforeCap": 75000,
      "employer": 75000,
      "sepMax": 75000,
      "employeeDeferral": 25500,
      "catchUp": 0,
      "soloMax": 75000,
      "soloMaxWithCatchUp": 75000,
      "soloAdvantage": 0,
      "flags": {
        "employerCapped": true,
        "compensationCapped": true,
        "deferralReducedByOtherPlans": false,
        "deferralLimitedByEarnings": false,
        "belowSeFloor": false,
        "noEarnings": false,
        "seBaseEstimate": true
      }
    },
    "sep500k2026": {
      "year": 2026,
      "limits": {
        "annualAdditionsLimit": 72000,
        "deferralLimit": 24500,
        "catchUp50": 8000,
        "catchUp60to63": 11250,
        "compensationLimit": 360000
      },
      "seTax": 36268.75,
      "halfSeTax": 18134.38,
      "netEarnings": 481865.62,
      "countedEarnings": 360000,
      "employerBeforeCap": 72000,
      "employer": 72000,
      "sepMax": 72000,
      "employeeDeferral": 24500,
      "catchUp": 0,
      "soloMax": 72000,
      "soloMaxWithCatchUp": 72000,
      "soloAdvantage": 0,
      "flags": {
        "employerCapped": true,
        "compensationCapped": true,
        "deferralReducedByOtherPlans": false,
        "deferralLimitedByEarnings": false,
        "belowSeFloor": false,
        "noEarnings": false,
        "seBaseEstimate": false
      }
    },
    "sep250k2027": {
      "year": 2027,
      "limits": {
        "annualAdditionsLimit": 75000,
        "deferralLimit": 25500,
        "catchUp50": 8500,
        "catchUp60to63": 11750,
        "compensationLimit": 375000
      },
      "seTax": 29573.38,
      "halfSeTax": 14786.69,
      "netEarnings": 235213.31,
      "countedEarnings": 235213.31,
      "employerBeforeCap": 47042.66,
      "employer": 47042.66,
      "sepMax": 47042.66,
      "employeeDeferral": 25500,
      "catchUp": 0,
      "soloMax": 72542.66,
      "soloMaxWithCatchUp": 72542.66,
      "soloAdvantage": 25500,
      "flags": {
        "employerCapped": false,
        "compensationCapped": false,
        "deferralReducedByOtherPlans": false,
        "deferralLimitedByEarnings": false,
        "belowSeFloor": false,
        "noEarnings": false,
        "seBaseEstimate": true
      }
    },
    "sep100kOtherFull": {
      "year": 2027,
      "limits": {
        "annualAdditionsLimit": 75000,
        "deferralLimit": 25500,
        "catchUp50": 8500,
        "catchUp60to63": 11750,
        "compensationLimit": 375000
      },
      "seTax": 14129.55,
      "halfSeTax": 7064.78,
      "netEarnings": 92935.22,
      "countedEarnings": 92935.22,
      "employerBeforeCap": 18587.04,
      "employer": 18587.04,
      "sepMax": 18587.04,
      "employeeDeferral": 0,
      "catchUp": 0,
      "soloMax": 18587.04,
      "soloMaxWithCatchUp": 18587.04,
      "soloAdvantage": 0,
      "flags": {
        "employerCapped": false,
        "compensationCapped": false,
        "deferralReducedByOtherPlans": true,
        "deferralLimitedByEarnings": false,
        "belowSeFloor": false,
        "noEarnings": false,
        "seBaseEstimate": false
      }
    },
    "sep20k2027": {
      "year": 2027,
      "limits": {
        "annualAdditionsLimit": 75000,
        "deferralLimit": 25500,
        "catchUp50": 8500,
        "catchUp60to63": 11750,
        "compensationLimit": 375000
      },
      "seTax": 2825.91,
      "halfSeTax": 1412.96,
      "netEarnings": 18587.04,
      "countedEarnings": 18587.04,
      "employerBeforeCap": 3717.41,
      "employer": 3717.41,
      "sepMax": 3717.41,
      "employeeDeferral": 14869.63,
      "catchUp": 0,
      "soloMax": 18587.04,
      "soloMaxWithCatchUp": 18587.04,
      "soloAdvantage": 14869.63,
      "flags": {
        "employerCapped": false,
        "compensationCapped": false,
        "deferralReducedByOtherPlans": false,
        "deferralLimitedByEarnings": true,
        "belowSeFloor": false,
        "noEarnings": false,
        "seBaseEstimate": false
      }
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
### `reports/mindmap-pass/2026-11-25-tool-usage/research/ac-sep-ira-contribution.csv`
```
seed,suggestion,via
sep ira contribution,what is sep ira contribution limit,question:what
sep ira contribution,what is sep ira contribution,question:what
sep ira contribution,what is sep ira contribution limit for 2025,question:what
sep ira contribution,what is sep ira contribution limit for 2026,question:what
sep ira contribution,what is sep ira contribution deadline,question:what
sep ira contribution,what are sep ira contribution rules,question:what
sep ira contribution,what is sep ira contribution limit for 2024,question:what
sep ira contribution,what is sep ira contribution based on,question:what
sep ira contribution,what is max sep ira contribution for 2025,question:what
sep ira contribution,what is max sep ira contribution for 2026,question:what
sep ira contribution,how is sep ira contribution calculated,question:how
sep ira contribution,how do sep ira contributions work,question:how
sep ira contribution,how are sep ira contributions reported,question:how
sep ira contribution,how do sep ira contributions affect taxes,question:how
sep ira contribution,how are sep ira contributions taxed,question:how
sep ira contribution,how is sep ira contribution calculated for s corp,question:how
sep ira contribution,how much sep ira contribution,question:how
sep ira contribution,how is sep ira contribution calculated for sole proprietorship,question:how
sep ira contribution,how are sep ira contributions deducted from s corp,question:how
sep ira contribution,how to calculate sep ira contribution for self employed,question:how
sep ira contribution,why sep ira contributions are not taxed,question:why
sep ira contribution,why sep ira contributions are tax deductible,question:why
sep ira contribution,why sep ira contribution limits,question:why
sep ira contribution,why are sep ira contribution limits so high,question:why
sep ira contribution,who contributes to a sep ira,question:why
sep ira contribution,when can you contribute to a sep ira,question:why
sep ira contribution,why sep ira contribution limits 2018,question:why
sep ira contribution,is sep ira contribution tax deductible,question:is
sep ira contribution,is sep ira contribution deductible,question:is
sep ira contribution,are sep ira contributions employer or employee,question:is
sep ira contribution,does sep ira contribution reduce agi,question:is
sep ira contribution,are sep ira contributions reported on w2,question:is
sep ira contribution,does sep ira contribution reduce taxable income,question:is
sep ira contribution,are sep ira contributions subject to fica,question:is
sep ira contribution,are sep ira contributions taxable,question:is
sep ira contribution,are sep ira contributions a business expense,question:is
sep ira contribution,are sep ira contributions above the line deductions,question:is
sep ira contribution,does sep ira contribution reduce magi,question:does
sep ira contribution,do sep ira contributions have to come from a business account,question:does
sep ira contribution,do sep ira contributions go on w2,question:does
sep ira contribution,do sep ira contributions count as income,question:does
sep ira contribution,do sep ira contributions go on schedule c,question:does
sep ira contribution,can sep ira contributions be made for prior year,question:does
sep ira contribution,can sep ira contributions be roth,question:does
sep ira contribution,is sep ira contribution based on gross or net income,question:does
sep ira contribution,can sep ira contributions be extended,question:can
s
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
### `reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-ir-2026-136.txt`
```
URL: https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
Retrieved: 2026-11-25T19:18:53.600390Z


401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500 | Internal Revenue Service
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
401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500
English
Español
中文 (简体)
Notice: Historical Content
This is an archival or historical document and may not reflect current law, policies or procedures.
More In News
Working Families Tax Cuts
News releases
News releases for frequently asked questions
Tax relief in disaster situations
Topics in the news
Fact sheets
IRS statements and announcements
IRS Tax Tips
IRS guidance
Media center
Tax articles to share
Posters to share
IR-2025-111, Nov. 13, 2025
WASHINGTON
— The Internal Revenue Service announced today that the amount individuals can contribute to their 401(k) plans in 2026 has increased to $24,500, up from $23,500 for 2025.
The IRS today also issued technical guidance regarding all cost‑of‑living adjustments affecting dollar limitations for pension plans and other retirement-related items for tax year 2026 in 
Notice 2025-67 
PDF
, posted today on IRS.gov.
Highlights of changes for 2026
The annual contribution limit for employees who participate in 401(k), 403(b), governmental 457 plans, and the federal government’s Thrift Savings Plan is increased to $24,500, up from $23,500 for 2025.
The limit on annual contributions to an IRA is increased to $7,500 from $7,000. The IRA catch‑up contribution limit for individuals aged 50 and over was amended under the SECURE 2.0 Act of 2022 (SECURE 2.0) to include an annual cost‑of‑living adjustment is increased to 
```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-ir-2027-limits.txt`
```
URL: https://www.irs.gov/newsroom/401k-limit-increases-to-25500-for-2027-ira-limit-remains-7500
Retrieved: 2026-11-25T19:19:11.642580Z


401(k) limit increases to $25,500 for 2027, IRA limit remains $7,500 | Internal Revenue Service
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
401(k) limit increases to $25,500 for 2027, IRA limit remains $7,500
More In News
Working Families Tax Cuts
News releases
News releases for frequently asked questions
Tax relief in disaster situations
Topics in the news
Fact sheets
IRS statements and announcements
IRS Tax Tips
IRS guidance
Media center
Tax articles to share
Posters to share
IR-2026-136, Nov. 12, 2026
WASHINGTON — The Internal Revenue Service announced today that the amount individuals can contribute to their 401(k) plans in 2027 has increased to $25,500, up from $24,500 for 2026.
The IRS today also issued technical guidance regarding all cost‑of‑living adjustments affecting dollar limitations for pension plans and other retirement-related items for tax year 2027 in 
Notice 2026-66 
PDF
, posted today on IRS.gov.
“Along with the Working Families Tax Cuts, this increase in the pension limitations will help American families keep more of their hard-earned income,” said IRS Chief Executive Officer Frank J. Bisignano. “With the new adjustment in place now, the IRS is giving taxpayers and employers the information needed to make retirement planning decisions for the year ahead.”
Highlights of changes for 2027
The annual contribution limit for employees who participate in 401(k), 403(b), governmental 457 plans, and the federal government’s Thrift Savings Plan is increased to $25,500, up from $24,500 for 2026.
The limit on annual contributions to an Individual Retirement Accoun
```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-notice-2026-66.txt`
```
URL: https://www.irs.gov/pub/irs-drop/n-26-66.pdf
Retrieved: 2026-11-25T19:19:11.642715Z

2027 Amounts Relating to Retirement Plans and IRAs, as Adjusted for Changes in
Cost-of-Living



Notice 2026-66

       Section 415 of the Internal Revenue Code (“Code”) provides for limitations on
benefits and contributions under qualified retirement plans. Section 415(d) requires that
the Secretary of the Treasury annually adjust these limitations for cost-of-living
increases. Under section 415(d), the adjustments are to be made under adjustment
procedures similar to those used to adjust benefit amounts under section 215(i)(2)(A) of
the Social Security Act. Other amounts applicable to deferred compensation plans are
also adjusted for cost-of-living increases using a variation of the methodology used for
the adjustments under section 415(d).

Cost-of-Living Adjusted Limitations for 2027

       Effective January 1, 2027, the limitation on the annual benefit under a defined
benefit plan under section 415(b)(1)(A) of the Code is increased from $290,000
to $300,000.

        For a participant who separated from service before January 1, 2027, the
participant’s limitation under a defined benefit plan under section 415(b)(1)(B) is
computed by multiplying the participant’s compensation limitation, as adjusted
through 2026, by 1.0350.

       The limitation for defined contribution plans under section 415(c)(1)(A) is
increased in 2027 from $72,000 to $75,000.

      The Code provides that various other amounts are to be adjusted at the same
time and in the same manner as the limitation of section 415(b)(1)(A). After taking into
account the applicable rounding rules, the amounts for 2027 are as follows:

       The limitation under section 402(g)(1) on the exclusion for elective deferrals
       described in section 402(g)(3), which includes elective deferrals made to the
       Thrift Savings Plan, is increased from $24,500 to $25,500.

       The limitation on deferrals under section 457(e)(15) concerning deferred
       compensation plans of state and local governments and tax-exempt
       organizations is increased from $24,500 to $25,500.

       The limitation under section 414(v)(2)(B)(i) for catch-up contributions to an
       applicable employer plan other than a plan described in section 401(k)(11) or
       section 408(p) that generally applies for individuals aged 50 or over is increased
       from $8,000 to $8,500. The limitation under section 414(v)(2)(E)(i) for catch-up
       contributions to an applicable employer plan other than a plan described in
       section 401(k)(11) or section 408(p) that applies for individuals who attain

                                             1
age 60, 61, 62, or 63 in 2027 increases from $11,250 to $11,750. The Roth
catch-up wage threshold for 2026, which under section 414(v)(7)(A) is used to
determine whether an individual’s catch-up contributions to an applicable
employer plan (other than a plan described in section 408(k) or (p)) for 2027
must be designated as Roth contributions, is increased from $150,000 to
$155,000.

The limitation under section 408(p)(2)(E)(i)(III) that generally applies to salary
reduction contributions under a SIMPLE retirement account or elective
contributions under a SIMPLE 401(k) plan is increased from $17,000 to $17,500.
The limitation under section 408(p)(2)(E)(i)(I) or (II) for employee elective
deferrals for SIMPLE retirement accounts maintained by certain eligible
em
```
### `reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-pub560.txt`
```
URL: https://www.irs.gov/publications/p560
Retrieved: 2026-11-25T19:18:53.605755Z


Publication 560 (2025), Retirement Plans for Small Business | Internal Revenue Service
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
Publication 560 - Introductory Material
Future Developments
What's New
Reminders
Introduction
What this publication covers.
SEP plans.
SIMPLE plans.
Qualified plans.
What this publication doesn’t cover.
Comments and suggestions.
Getting answers to your tax questions.
Getting tax forms, instructions, and publications.
Ordering forms and publications.
Tax questions.
Definitions You Need To Know
Annual additions.
Annual benefits.
Business.
Common-law employee.
Compensation.
Other options.
SIMPLE plans.
Contribution.
Deduction.
Earned income.
Elective deferral.
Employer.
Highly compensated employee.
Leased employee.
Exception.
Net earnings from self-employment.
Qualified plan.
Participant.
Partner.
Self-employed individual.
Sole proprietor.
Simplified Employee Pensions (SEPs)
Topics - This chapter discusses:
Useful Items - You may want to see:
Eligible employee.
Tip:
Excludable employees.
Setting up a SEP
Tip:
Formal written agreement.
When not to use Form 5305-SEP.
Information you must give to employees.
Setting up the employee's SEP IRA.
Deadline for setting up a SEP.
How Much Can I Contribute?
Time limit for making contributions.
Contribution Limits
Contributions for yourself.
Annual compensation limit.
More than one plan.
Tax treatment of excess contributions.
Reporting.
Deducting Contributions
Deduction Limit for Contributions for Participants
Deduction Limit for Self-Employed Individuals
Carryover of Excess SEP Contributions
Excise tax.
When To Deduct Contributions
Where To Deduct Contributions

```
