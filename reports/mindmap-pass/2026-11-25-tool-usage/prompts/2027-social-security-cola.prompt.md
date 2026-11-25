# Approved Page Assignment: `/guides/2027-social-security-cola/` (`2027-social-security-cola`)
- **Action ID:** `F3` (update existing body text)
- **Active Mindmap Track:** `guide`
- **Title:** Replace each stale sentence with the final CMS figure and citation ($209.40 standard premium, +$6.50, deductible $292), recompute the example net gains that used $209.50 (e.g. $2,000 check: +$72 gross raise minus $6.50 premium increase = $65.50), keep every other word, metadata and URL; bump updated dates. The 2026-only $202.90 sentences and the Trustees-report solvency sentences are correct and stay.
- **Page Type / Format / Medium:** guide | article section | text
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** How much will Medicare Part B cost in 2027? [PAA none returned; DataForSEO '2027 medicare part b premium' 5,400/mo KD 0; AI Overview cites cms.gov, unitedmedicareadvisors.com]
- **Working Answer (Col 11):** $209.40 a month for the standard premium, $6.50 more than 2026, with a $292 deductible (CMS).
- **Answer Placement (Col 12):** FAQ and COLA-net sections of the four guides, existing slots

## Demand & Differentiation Context
- **Problem / Gap:** Stale sentences on four live guides (this row: slug 2027-social-security-cola, ~L4926 'Medicare has not announced', ~L4942 and FAQ ~L4990 'Trustees Report projects $209.50'; sibling rows F5-F7 cover the other three slugs) (verified by grep 2026-11-25): guides.ts slug 2027-ssdi-cola (body ~L4444, FAQ ~L4496: 'has not been announced'), ssi-increase-2027 (~L4554), social-security-changes-2027 (~L4632), 2027-social-security-cola (~L4926 'Medicare has not announced', ~L4942 and FAQ ~L4990 'Trustees Report projects $209.50'). All contradict the CMS Nov 17 2026 announcement ($209.40). lookup: existing guides, factual correction only (no new page).
- **Keyword Evidence:** "tool-fix row backed by real usage; no SERP read needed (volume never vetoes a tool fix)"
- **Why New Page / Angle:** Replace each stale sentence with the final CMS figure and citation ($209.40 standard premium, +$6.50, deductible $292), recompute the example net gains that used $209.50 (e.g. $2,000 check: +$72 gross raise minus $6.50 premium increase = $65.50), keep every other word, metadata and URL; bump updated dates. The 2026-only $202.90 sentences and the Trustees-report solvency sentences are correct and stay.
- **Intent-Based Our Takeaway:** ""

## Eligible Internal & Testing Evidence Pool for Page Type `how-to-or-workflow-guide` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`live_free_tier_or_workflow_probe` (Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe):** Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).
- **`practical_workload_and_unit_translation` (Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)):** Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.
- **`internal_scenario_and_spec_modeling` (Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling):** Use when vendors/products publish prices, caps, API token rates, or comparable numeric specs where multi-scenario break-even math clarifies the choice.
- **`interactive_tool_or_calculator` (Interactive Calculator / Decision Widget):** Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.

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
  "route": "/guides/2027-social-security-cola/",
  "readerQuestion": "How much will Medicare Part B cost in 2027? [PAA none returned; DataForSEO '2027 medicare part b premium' 5,400/mo KD 0; AI Overview cites cms.gov, unitedmedicareadvisors.com]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/approval-manifest.json",
      "sha256": "33ae4a84c3df27e1f4ddaa717203115760ee88ba7f11a65acac5df8ed9c0ec9a"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/chart-review.json",
      "sha256": "c7ab383e60370ee6227720d260018028cbbaf9d9cd0217dddd9857c67e0bf979"
    },
    "actionId": "F3"
  },
  "presentation": {
    "medium": "text",
    "placement": "FAQ and COLA-net sections of the four guides, existing slots",
    "reason": "A code change inside an existing tool; the persona's blocked step is fixed in place and the static answer stays readable.",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "A corrected sentence is answered in prose; the page's own calculator already handles the interaction."
    },
    "animation": {
      "decision": "not-useful",
      "reason": "A corrected number and a link need no motion."
    }
  },
  "basis": "calculated",
  "decisionGap": "TODO: state the specific reader decision gap not resolved by generic summaries",
  "finding": "TODO: state the concrete evidence-backed finding answering readerQuestion",
  "conditions": "TODO: state material conditions/assumptions under which finding holds",
  "whatWouldChange": "TODO: state concrete price/policy/spec changes that would flip the finding",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/2027-social-security-cola/cases.json",
    "sha256": "ebe1e083093024aef9ececbdabe1f8b33d6303efddeec5535fed31ad0d72108e"
  },
  "caseDecisions": "TODO: explain which retrieved cases.json records were used (anonymized) or why none applied",
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
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/ac-sep-ira-contribution.csv",
      "sha256": "78aac4508e4a05ff5f7e4841393fd1d04ed9810c5a18909351a033c9fdd2d9c8"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/ac-w-4v-social-security.csv",
      "sha256": "5b1480e925ed8c37f23d21138487dd8baeaabb9603f869320867d5107da022d0"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/amazon-picks-retirement.txt",
      "sha256": "6ee49d1a00b6650910c58bd4737dc5eae15f38f8e48fab10c8ec62d8caca01a1"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/calc-examples.json",
      "sha256": "76302d3e54e979b5581893fea05e3c183dd34f22356ee1d3157e748fc763e75b"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/cms-2027-partb.txt",
      "sha256": "16367dafe9ff6db1ae6931c0abdf83e9c448fc8fa80762c809a303c2a2403908"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-form-w4v.txt",
      "sha256": "aff3f79dcbbc25aaa7d5942219a0c53947aad3642406e305ca179296f4ff44f8"
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
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-pub550.txt",
      "sha256": "f93f754fba1a6ec069fe467e589e8a9438462ec966891c9ea8345845caefbf70"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-pub560.txt",
      "sha256": "db1f1fbe4645f567aa19f6fab7144a28c9881114773d1425636b57ae48b76f2a"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-topic409.txt",
      "sha256": "06dc2dd8c45947ff7e7bb95f5e28d7fab0f4022fa7ed03781706b1241377bbdd"
    },
    {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/research/sources/irs-w4v.txt",
      "sha256": "c6a06f8f4972a55bc2ec9b37b4232d85ae1098dfa2852efa3304c9e9cf37c644"
    },
    {
      "path": "reports/tool-usage-pass/2026-11-25/personas/investing.md",
      "sha256": "c3db40075e1f9dc53a1b4a7daa574b78c595098465b19c9ec6503d75f6c03c08"
    },
    {
      "path": "reports/tool-usage-pass/2026-11-25/personas/mileage-deduction.md",
      "sha256": "dc9f01c48c510a3fc06f2bbd9a82c7baf0aa2c00a7787345832c179eb4fb9b1a"
    },
    {
      "path": "reports/tool-usage-pass/2026-11-25/personas/portfolio.md",
      "sha256": "43db99bb8fa1fc197c827965c29e288864c24f4a50b10373f5191aef03db9b0b"
    },
    {
      "path": "reports/tool-usage-pass/2026-11-25/personas/retirement.md",
      "sha256": "2d6308f9ca949d26e447de014d978dca3326d2185d46f200407e51de20612e86"
    },
    {
      "path": "reports/tool-usage-pass/2026-11-25/personas/social-security-cola-calculator.md",
      "sha256": "69d69c27ddc66bc0af27549c6c64162085b3d9cbad6113bea4b18a5e0f7753f3"
    }
  ],
  "method": "TODO: describe calculation/model formula and explicit visible assumptions",
  "units": "TODO: explicit units (e.g., USD/month, ms, tokens)",
  "limitations": "TODO: model boundaries and excluded variables",
  "counterexample": "TODO: concrete scenario/input where the recommendation reverses",
  "execution": {
    "command": [
      "python3",
      "reports/mindmap-pass/2026-11-25-tool-usage/evidence/2027-social-security-cola/model.py"
    ],
    "code": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/2027-social-security-cola/model.py",
      "sha256": "TODO: 64-char sha256"
    },
    "inputs": [
      {
        "path": "reports/mindmap-pass/2026-11-25-tool-usage-brief.md",
        "sha256": "d197e7ff8a423d0ced3dee927ea2f1a3e8f5ec795d8ab315b46a6eb5b55e7415"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-25-tool-usage/evidence/2027-social-security-cola/output.json",
      "sha256": "TODO: 64-char sha256"
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
