# Approved Page Assignment: `/rule-of-78-calculator/` (`rule-of-78-calculator`)
- **Action ID:** `A1` (create new content)
- **Title:** Rule of 78 Calculator: Payoff Refund vs Actuarial
- **Page Type / Format / Medium:** calculator | calculator - searchers want a personalized interest-split and payoff-refund figure | interactive tool
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** How does the Rule of 78 split my loan interest, and how much more does it cost me to pay the loan off early? [PAA 0/6 on-topic; 6/6 off-topic: generic loan math; ac 10/10 corroborate rule-of-78 question family]
- **Working Answer (Col 11):** Verdict/figure: the Rule of 78 front-loads interest by sum of the digits, so an early payoff refunds less unearned interest than the actuarial method; the extra cost is small on short or low-rate loans and larger on long, high-rate ones (for example $28.65 on $15,000 at 7% for 48 months paid off after 12 payments), and federal law (15 U.S.C. 1615(b)) bars it for precomputed consumer loans over 61 months.
- **Answer Placement (Col 12):** section 1: "Rule of 78 Calculator" (calculator plus opening answer block)

## Demand & Differentiation Context
- **Problem / Gap:** [coverage / top-10] Lane B: 'rule of 78 calculator' (0 clicks, 3 impr, pos 64.33) is UNCOVERED. Lens 1 direct intent; Lens 2 cluster 'Rule of 78 loan interest': rule of 78 1,000/mo; what is the rule of 78 210; rule of 78 calculator 170; rule of 78 loan 140; rule of 78 formula 90 (DataForSEO US 2026-11-23, KD 0 modeled). lookup: no match (none of 875 repo pages / 890 sitemap routes, no redirect, no commit). Nearest neighbours /auto-loan/early-payoff-calculator/ (simple-interest extra payments) and /loan-payment-calculator/ (level payment) do not allocate interest by sum of the digits. Site has no engine for it.
- **Keyword Evidence:** "Primary 'rule of 78 calculator' 170/mo US KD 0; supporting 'rule of 78' 1,000, 'what is the rule of 78' 210, 'rule of 78 loan' 140, 'rule of 78 formula' 90, 'is the rule of 78 legal' 10. Provider DataForSEO (SEMRUSH HTTP 403), US, checked 2026-11-23; volumes bucketed, KD modeled; 'rule of 78 vs simple interest' 75 and 'rule of 78 example' 150 are autocomplete estimates, not measured. GSC: 3 impressions at position 64.33. Files: research/keyword-volumes.json, keyword-expand.json, autocomplete csv."
- **Why New Page / Angle:** Coverage lookup found no home. Closest routes /auto-loan/early-payoff-calculator/, /loan-payment-calculator/ and /personal-loan/extra-payment-calculator/ answer simple-interest extra-payment and level-payment questions; none computes sum-of-the-digits allocation or the payoff refund difference. git log -S for the topic empty; HEAD 735f8af. Independent duplicate review is the CHART-REVIEW decision.
- **Intent-Based Our Takeaway:** "Rule of 78 pushes interest into the early months, so paying a precomputed loan off early refunds less than the actuarial method would; on short or low-rate loans the extra cost is tens of dollars, on long high-rate loans it can exceed $200, and it vanishes near maturity. Federal law bars it only for precomputed consumer loans over 61 months, so a shorter precomputed loan may still use it depending on contract and state law. Applies to precomputed loans only; what would change it: a simple-interest or actuarial contract, a term over 61 months, or a payoff statement (requestable under 15 U.S.C. 1615(c), one free per year) showing a different refund. Based on our internal modeling plus the cited statute and CFPB."

## Approved Section Outline
1. **Rule of 78 Calculator** — Opening answer sentence plus the calculator (amount, APR, term, payoff payment number); outputs Rule-of-78 refund, actuarial refund, extra interest the lender keeps.
2. **How the Rule of 78 Splits Your Interest** — Sum-of-the-digits formula with the n(n+1)/2 denominator, a worked example from the engine, and an interest-by-month table.
3. **What Early Payoff Costs Under the Rule of 78** — Engine cases across amount/APR/term showing when the gap is small versus large and that it falls to zero at maturity.
4. **Is the Rule of 78 Legal?** — 15 U.S.C. 1615(b): refund must be at least as favorable as actuarial for precomputed consumer credit over 61 months consummated after Sept 30, 1993; terms of 61 months or less are not covered by that provision; state law and contract not asserted, readers told to check.
5. **Who This Is Not For** — Simple-interest loans (most auto, personal and mortgage loans) where the Rule of 78 does not apply; business loans and non-U.S. loans.
6. **What Would Change Our Answer** — Contract uses actuarial or simple interest; term over 61 months; state law; payoff statement shows a different refund.
7. **Rule of 78 Questions** — FAQs in sentence case: what is it, formula, is it legal, car loan, how to get a payoff statement, vs simple interest.

## Approved Internal Outbound Links
- {"source": "/rule-of-78-calculator/", "target": "/loan-payment-calculator/", "section": "How the Rule of 78 Splits Your Interest", "anchor": "loan payment calculator", "purpose": "Level payment and actuarial amortization for the same loan", "inspection": {"path": "src/data/calculators.ts", "sha256": "4275008f54155466058aac9fc2b6107a7c2daabe19feff4142f4cfba49c8d9e1"}}
- {"source": "/rule-of-78-calculator/", "target": "/auto-loan/early-payoff-calculator/", "section": "Who This Is Not For", "anchor": "auto loan early payoff calculator", "purpose": "Simple-interest loans: savings from extra payments", "inspection": {"path": "src/data/spokes-auto.ts", "sha256": "56a43e9202273db3ee30b9724a40d3fc455b6a209a5efaa477718287a0e7a66d"}}

## Reviewer Guardrails (Must Respect)
- CR-1 (substantive): In writing, label any term over 61 months as a formula illustration (a federally restricted term for precomputed consumer loans), prefer a 60-month example for the 'larger gap' case ($25,000 / 8% / 60 / 12 = $88.13, engine-computed), and make the calculator show a visible notice whenever term > 61 months. Keep the figures engine-computed, never hand-typed.
- CR-2 (substantive): Writer closed fact list uses the exact subsection (b) wording above; never write 'illegal' or 'banned' without the over-61-month and precomputed-consumer conditions; do not assert any state-law position; tell readers to check the contract and request a payoff statement (1615(c): within 5 days, one free per year). Phase 4 tests this consequential claim against the 61-month counterexample.
- CR-3 (substantive): Cite the govinfo URL https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap41-subchapI-partA-sec1615.htm as the statute source in sourcesCited and the packet, with LII at most as a secondary convenience link; record the reviewer capture as a source artifact in the evidence packet. Do not log this as HELD or unreachable.
- CR-4 (substantive): Restate the tag in the packet/Phase 3 prompt as [PAA 0/6 on-topic; ac question sweep: what-is/how-does-it-work/how-to-calculate/is-legal dominant] without changing the approved question string used for case retrieval (or rerun cases-batch if it changes). Open section 1 with a one-sentence definition of the Rule of 78 followed by the answer block so the 210/mo 'what is' intent is served, then the calculator; FAQ built from the sweep: what is it, formula, example, is it legal/still used, car loans, payoff statement, vs simple interest.
- CR-5 (substantive): Record in the run summary/ledger digest as DROPPED-covered: plan to buy a car -> compare/buying-vs-leasing-a-car and compare/new-car-vs-used-car; roth 401k vs standard 401k and roth and traditional 401k -> compare/roth-401k-vs-traditional-401k; tax deferred vs taxable -> /taxable-vs-tax-deferred/; where can i get a free will -> roundup/best-online-will-makers and compare/online-will-vs-lawyer (reviewer confirmed these routes exist in src/data). Not ledgered as blocking rows.
- CR-6 (substantive): State assumptions and the method note beside the result with visible 'In our internal modeling, we compared ...' attribution and no tested/tested-and-reviewed wording; engine unit tests must cover k=n (difference 0), k=0 or invalid input, APR=0, term 1, and a golden case ($15,000/7%/48/12 -> Rule 78 earned $971.99, actuarial $943.34, difference $28.65); Phase 4 replays the engine. Prefer a non-spliced SEO title of 50-60 chars such as 'Rule of 78 Calculator for Loan Payoff Refunds' (45) extended to 50-60, keeping the primary keyword first; disclaimer at the page bottom only; no 'honest/actually' wording.
- CR-1: The takeaway ('on long high-rate loans it can exceed $200') and the $30,000 / 9% / 72-month feasibility case ($227.82) sit on a term exceeding 61 months, where 15 U.S.C. 1615(b) requires a refund at least as favorable as actuarial for precomputed consumer credit consummated after 9/30/1993. Presenting it as a typical lender outcome contradicts the page's own legality section.
- CR-2: The legal claim must carry its full scope in the first answer, FAQ and takeaway: 15 U.S.C. 1615(b) applies to precomputed consumer credit transactions (not business loans) with a term exceeding 61 months consummated after September 30, 1993; it does not say the Rule of 78 is legal at 61 months or less (state law and contract can differ; source silence is not proof of legality). 1615(a) (prompt refund of unearned interest on full prepayment, under $1 exempt) applies regardless of term.
- CR-3: Primary-source citation: BUILD saved only the LII mirror and recorded govinfo and house.gov as 404. The official GPO copy loads (verified by reviewer, saved to chart-review-evidence/govinfo-15usc1615.txt, text identical for (a)-(d)); uscode.house.gov 404s from the runner. The site rule is primary sources only.
- CR-4: Reader-question evidence tag says 'ac 10/10 corroborate', which is the keyword-level corroboration, not the question-prefix sweep. The saved sweep (54 question rows) is dominated by what-is-the-rule-of-78, how-does-it-work, how-to-calculate and is-it-legal; PAA is 0/6 on-topic, so the question is autocomplete-driven and the largest phrase variant ('what is the rule of 78', 210/mo) is definitional.
- CR-5: Intake accounting covers the 10 top queries only. The pull JSON coverage_queries has 15 rows; five (plan to buy a car, roth 401k vs standard 401k, roth and traditional 401k, tax deferred vs taxable, where can i get a free will) have no explicit disposition in readiness.md or exclusions.
- CR-6: Calculator and copy limits: model assumes level-payment, whole-month, fixed-rate precomputed loan with no fees or rebate-on-default, and the refund at payment k is computed from remaining finance charge; real contracts add fees and payoff-date conventions. Planned title 'Rule of 78 Calculator: Payoff Refund vs Actuarial' is a colon-spliced two-clause form against the headline rule (50 chars, length ok).

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"calculated"`: include honest visible internal calculation/modeling attribution matching `execution` output with explicit visible assumptions + counterexample (never claim hands-on product testing or `(Tested YYYY)` unless `basis` is `"measured"` with executed `runs:[{testedAt}]`).
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-build",
  "route": "/rule-of-78-calculator/",
  "readerQuestion": "How does the Rule of 78 split my loan interest, and how much more does it cost me to pay the loan off early? [PAA 0/6 on-topic; 6/6 off-topic: generic loan math; ac 10/10 corroborate rule-of-78 question family]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/approval-manifest.json",
      "sha256": "35a072a0897d6f357e6b98395e588efd8dbe27670f93748a3ed5e28e5126fbb2"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/chart-review.json",
      "sha256": "823e871ac2b92dd0bac0e617b2ff7bbe02b409bd5551ed53d2002176b462cea6"
    },
    "actionId": "A1"
  },
  "presentation": {
    "medium": "interactive tool",
    "placement": "Opening answer block, then the calculator directly beneath it in section 1",
    "reason": "The dollar difference depends on amount, APR, term and payoff month, which a finite table cannot cover; the static answer and a worked example stay readable without interaction.",
    "readerInputs": [
      "Loan amount",
      "APR",
      "Term in months",
      "Payment number at which the loan is paid off"
    ],
    "interaction": {
      "decision": "build",
      "reason": "Four inputs change the refund difference, so a reader can see their own loan; a static table shows only one example."
    },
    "animation": {
      "decision": "not-useful",
      "reason": "A static allocation chart/table shows the front-loading faster; no motion needed."
    }
  },
  "basis": "calculated",
  "decisionGap": "Searchers for 'rule of 78 calculator' find small calculator sites (cleartali, loanamortizationcalculator.app, solvefree, calcwarehouse) and an AI Overview citing goldpointsystems.com, investopedia.com and youtube.com. Sampled only the 2026-11-23 SERP top 10 for that query; no site-wide or competitor-wide uniqueness is claimed. The reader still cannot see, on their own loan, the dollar difference between the Rule of 78 refund and the actuarial refund, how the sum-of-the-digits split front-loads interest month by month, or that the federal rule on the method turns on a 61-month term line for precomputed consumer loans.",
  "finding": "In our internal modeling we compared the Rule of 78 with the actuarial method on the same precomputed loans. For a $15,000 loan at 7% over 48 months ($359.19 a month, $2,241.30 total finance charge) paid off after 12 payments, the Rule of 78 credits the lender $971.99 of interest against $943.34 under the actuarial method, so the Rule of 78 refund is $1,269.31 against $1,297.96 and the lender keeps $28.65 more. The gap is $26.26 after payment 24, $3.30 after payment 42 and $0 at payment 48. It is $88.13 on $25,000 at 8% over 60 months after 12 payments and $1.64 on $5,000 at 6% over 24 months after 12 payments. At 0% APR there is no finance charge to allocate. 15 U.S.C. 1615(b) requires a refund at least as favorable to the consumer as the actuarial method for a precomputed consumer credit transaction with a term over 61 months consummated after September 30, 1993.",
  "conditions": "Fixed-rate precomputed installment loan; level monthly payments; whole months; payoff right after a scheduled payment; no fees, no state law, no rebate-on-default rules; the gap is modeled, not a lender quote. The statute scope is limited to precomputed consumer credit transactions over 61 months consummated after 1993-09-30; terms of 61 months or less are not covered by subsection (b), and this page asserts nothing about state law or any contract. Terms over 61 months are shown only as a formula illustration.",
  "whatWouldChange": "A simple-interest or actuarial contract (no Rule of 78 at all), a precomputed term over 61 months (federal actuarial-or-better refund), a state law or contract that sets a different refund, or a lender payoff statement showing a different refund figure.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/evidence/rule-of-78-calculator/cases.json",
    "sha256": "140ff8f657fc43937888893577420cb90a5766723d1fc5870ec1d4cb4cf0c79d"
  },
  "caseDecisions": "Retrieved with the exact packet reader question (cases.json, 8 candidates: owned-property-drones-defense, owned-property-ban-the-bots, owned-property-medical-frontier, owned-property-diy-repair-guide, client-bowlero-corporation, client-professional-bowlers-association-pba, client-horizen-labs, client-multiple-hoa-and-condo-boards-across-the-usa). Matches were only on stop words (and, how, the, cost). None concerns consumer installment loans, and ModernWallet's _experience.md has no named-client specifics. Rejected all; no client or case claim on the page.",
  "sourceArtifacts": [
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/brief.txt",
      "sha256": "03868dd39f84629e8e28ed82f9eda634bc66f007fa4a93ffd1beb0b6286a9e7c"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/keyword-volumes.json",
      "sha256": "7fbaf40577536a986cc5e59233ec85bd94e355e35a8af8f8175a80bcba613259"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/keyword-expand.json",
      "sha256": "a84d57a733b143dbfef89cc814b73a9903c707f1dc7beab9145cd94a696c0293"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/serp-rule-of-78-calculator.txt",
      "sha256": "39202316fb60af07903d9d6910773e09721e92b9928b9d39e45ef79068a17dd9"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/autocomplete-rule-of-78.csv",
      "sha256": "d8d76679674742cf31a865e38d940b89056986986bce4f56335760f78def6e28"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/coverage-lookup.txt",
      "sha256": "c755493197d4fbc0b44fa9b1f966a1ef91db92ec3140fb67c512eb101ffd783a"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/sources/15usc1615-lii.txt",
      "sha256": "542f193d0ccb14b301c0841e63019eff6ea1007819632e695bdb53215334f8a3"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/sources/cfpb-precomputed-vs-simple.txt",
      "sha256": "d1c1ab81feb09a8aaf979ee1ddc91dfbac1d0eb16cc307d5176050b48b86e9e2"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/feasibility-rule78.py",
      "sha256": "69ea5323455153cdbc3b202ade9e5964cbead104734fda95e34b0f4775cc3a81"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/feasibility-rule78.json",
      "sha256": "3c1f629b286d99580e82172bd197dd5728d4175f8f6d0a5fe8fe962f8a6d3e8a"
    },
    {
      "path": "reports/trend-pass/2026-11-23.research.md",
      "sha256": "95f9ec4ed5dc9e5d271dd02df0dc633004798f118693a5fe0e42359c2872fdef"
    },
    {
      "path": "reports/trend-pass/2026-11-23.pull.json",
      "sha256": "fd03e89bb0c66fb54110ebabc10b8b1846679c23e3dbd0f778120aab5f3b6973"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/chart-review-evidence/govinfo-15usc1615.txt",
      "sha256": "09fd125ef5a6ef4bea71e50face083f453d7797cfc84508982598997b6f35277"
    }
  ],
  "presentationArtifacts": [
    {
      "path": "src/lib/rule-of-78.ts",
      "sha256": "f1d5d4466551943ca508ef55b763212f38620b5b8601ff8d888e78ad1a06411a"
    },
    {
      "path": "src/components/Rule78Calculator.tsx",
      "sha256": "74305c310057f3431e6b2a56c2574656999c954f4396cc0eeadf955f4bd21926"
    },
    {
      "path": "scripts/test-rule-of-78.mjs",
      "sha256": "546adcca5af096be3d3433705aa02417f93becfc9bfc014a16f963925272e866"
    }
  ],
  "method": "Deterministic run of the shipped engine src/lib/rule-of-78.ts (bundled with esbuild and executed by model.mjs) on illustrative loans. Level payment = P x r / (1 - (1 + r)^-n), r = APR / 12 (reused computeLoanPayment). Finance charge I = payment x n - P. Rule of 78: interest earned after k payments = I x k(2n - k + 1) / (n(n + 1)), i.e. month j is credited (n - j + 1) / (n(n + 1)/2) of I. Actuarial: interest in the first k payments of the standard amortization schedule. Refund = I minus interest earned; difference = Rule of 78 earned minus actuarial earned.",
  "units": "USD; months; percent of finance charge",
  "limitations": "No fees, taxes, insurance, state law, contract terms, default rebates or daily-interest payoff conventions. Loans are illustrative, not market quotes. The engine rejects non-integer terms or payment numbers, terms over 120 months and APR over 30%.",
  "counterexample": "At payment 48 of 48 the difference is $0 because both methods have earned the whole finance charge. At 0% APR there is no interest to allocate. On a 24-month, 6% loan paid off after 12 payments the gap is only $1.64, so the method matters little there. For a precomputed consumer loan over 61 months, federal law requires an actuarial-or-better refund, so the Rule of 78 figure in the 72-month illustration ($227.82) would not apply to it.",
  "execution": {
    "command": [
      "node",
      "reports/mindmap-pass/2026-11-23-trend-lane-c-run/evidence/rule-of-78-calculator/model.mjs",
      "reports/mindmap-pass/2026-11-23-trend-lane-c-run/evidence/rule-of-78-calculator/inputs.json",
      "reports/mindmap-pass/2026-11-23-trend-lane-c-run/evidence/rule-of-78-calculator/output.json"
    ],
    "code": {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/evidence/rule-of-78-calculator/model.mjs",
      "sha256": "fb4d7ec2ee42fed97431581379d4e03be702f4ae044bb4e93302fb2a9745d983"
    },
    "inputs": [
      {
        "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/evidence/rule-of-78-calculator/inputs.json",
        "sha256": "b1ea336a1a9dc83f645166038cae1a2be382afbd706d2203d7b7c8f1c01d5068"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/evidence/rule-of-78-calculator/output.json",
      "sha256": "82e298302e8d43375761ab60f6eaaa03b7285ecba492121e88410cd69239666f"
    }
  },
  "caseUses": [],
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "output.json cases golden, golden-month-24, golden-month-42, golden-maturity, larger-gap-60, short-low-rate, low-rate-48, zero-apr, over-61-illustration"
    ],
    "scopeAndLimits": "illustrative fixed-rate precomputed loans, level payments, whole months, no fees, no state law or contract terms",
    "publicMethod": "How the Rule of 78 Splits Your Interest section: the formula, the worked example and the month-by-month table; the calculator shows the same figures for any loan",
    "placement": "introText worked example, first finding and howItWorks"
  },
  "medium": "interactive tool (calculator) with static worked example, interest-by-month table and refund bars; reader inputs change the answer",
  "exclusions": "No TESTED label or tested schema (financial formula tool; _experience.md section G excludes financial services and no product test exists). No professional-review claim. No state-law position.",
  "sourceUrls": [
    {
      "url": "https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap41-subchapI-partA-sec1615.htm",
      "checked": "2026-11-23",
      "artifact": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/chart-review-evidence/govinfo-15usc1615.txt"
    },
    {
      "url": "https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/",
      "checked": "2026-11-23",
      "artifact": "reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/sources/cfpb-precomputed-vs-simple.txt"
    }
  ]
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/brief.txt`
```
Trend-pass-auto Lane C brief (2026-11-23). Interpreted brief: Our 10 top-clicking Google queries for the 7 days ending 2026-11-23, plus our own research on what's trending and what's missing. Build what this demand implies the site lacks. Treat research findings as strong suggestions.
Top-10 queries (verbatim): site:themodernwallet.com (0c/8i/pos1); rule of 78 calculator (0c/3i/pos64.33); 20000 for 72 months (0/2/2); 401k roth traditional (0/1/93); am i on track to retire (0/1/96); best financial way to buy a car (0/1/74); best way to buy a car financially (0/1/84); cheap wills (0/1/96); investment portfolio calculator (0/1/81); living trust services (0/1/77).
Research pack (reports/trend-pass/2026-11-23.research.md): Trend none; Lane B 14 covered / 1 uncovered: "rule of 78 calculator" UNCOVERED (slug rule-of-78-calculator FREE). rising/spillover/modifier_patterns all empty.
Overrides: no metadata rows, additive only, cap 25, tag rows trend/coverage/top-10, finance/YMYL guardrails (engine numbers, primary sources only, no personalized advice).

```
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/keyword-volumes.json`
```
{
 "rows": [
  {
   "keyword": "is the rule of 78 legal",
   "volume": 10,
   "volume_low": 10,
   "volume_high": 10,
   "kd": 6,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 0,
    "corroborates": false
   }
  },
  {
   "keyword": "rule of 78",
   "volume": 1000,
   "volume_low": 1000,
   "volume_high": 1000,
   "kd": 0,
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
   "keyword": "rule of 78 calculator",
   "volume": 170,
   "volume_low": 170,
   "volume_high": 170,
   "kd": 0,
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
   "keyword": "rule of 78 formula",
   "volume": 90,
   "volume_low": 90,
   "volume_high": 90,
   "kd": 0,
   "cpc": 38.92,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "rule of 78 loan",
   "volume": 140,
   "volume_low": 140,
   "volume_high": 140,
   "kd": 0,
   "cpc": 0.02,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "rule of 78 vs simple interest",
   "volume": 10,
   "volume_low": 10,
   "volume_high": 10,
   "kd": 5,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 3,
    "corroborates": true
   }
  }
 ],
 "notes": [
  "semrush unusable (HTTP 403)",
  "volume: using dataforseo (quality order semrush > dataforseo)",
  "dataforseo returned volume for 6/6 phrases",
  "kd: using dataforseo (quality order semrush > dataforseo)",
  "Autocomplete: 5/6 rows corroborated live"
 ]
}

```
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/keyword-expand.json`
```
{
 "rows": [
  {
   "keyword": "rule of 78 method",
   "volume": 1000,
   "volume_low": 1000,
   "volume_high": 1000,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "rule of 78",
   "volume": 1000,
   "volume_low": 1000,
   "volume_high": 1000,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "what is the rule of 78",
   "volume": 210,
   "volume_low": 210,
   "volume_high": 210,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "what is rule of 78",
   "volume": 210,
   "volume_low": 210,
   "volume_high": 210,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "rule of 78 calculator",
   "volume": 170,
   "volume_low": 170,
   "volume_high": 170,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "calculator rule of 78",
   "volume": 170,
   "volume_low": 170,
   "volume_high": 170,
   "kd": 1,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "rule of 78's calculator",
   "volume": 170,
   "volume_low": 170,
   "volume_high": 170,
   "kd": "",
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "loan rule of 78",
   "volume": 140,
   "volume_low": 140,
   "volume_high": 140,
   "kd": "",
   "cpc": 0.02,
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "rule of 78 loan",
   "volume": 140,
   "volume_low": 140,
   "volume_high": 140,
   "kd": 0,
   "cpc": 0.02,
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "rule of 78 loans",
   "volume": 140,
   "volume_low": 140,
   "volume_high": 140,
   "kd": 0,
   "cpc": 0.02,
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "formula for rule of 78",
   "volume": 90,
   "volume_low": 90,
   "volume_high": 90,
   "kd": 0,
   "cpc": 38.92,
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "rule of 78 formula",
   "volume": 90,
   "volume_low": 90,
   "volume_high": 90,
   "kd": 0,
   "cpc": 38.92,
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "rule of 78 interest",
   "volume": 40,
   "volume_low": 40,
   "volume_high": 40,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "interest rule of 78",
   "volume": 40,
   "volume_low": 40,
   "volume_high": 40,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "what is the rule of 78 in finance",
   "volume": 40,
   "volume_low": 40,
   "volume_high": 40,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "sales rule of 78",
   "volume": 30,
   "volume_low": 30,
   "volume_high": 30,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "seed": "rule of 78"
  },
  {
   "keyword": "rule of 78 in sales",
   "volume": 30,
   "volume_low": 30,
   "volume_high": 30,
   "kd"
```
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/serp-rule-of-78-calculator.txt`
```
{
 "keyword": "rule of 78 calculator",
 "verdict": "winnable",
 "forum_dominated": false,
 "ai_overview_present": true,
 "ai_overview_cited_domains": [
  "www.goldpointsystems.com",
  "www.investopedia.com",
  "www.youtube.com"
 ],
 "featured_snippet": null,
 "top10_domains": [
  "cleartali.com",
  "cleartali.com",
  "www.loanamortizationcalculator.app",
  "www.letrasbonitas.net",
  "solvefree.com",
  "kovertiz.com",
  "ondevice.tools",
  "www.calcwarehouse.com"
 ],
 "major_domains": [],
 "forum_domains": [],
 "serp_feature_mix": {
  "ai_overview": 1,
  "images": 1,
  "organic": 8,
  "people_also_ask": 1
 },
 "paa": [
  "How do I calculate loan interest?",
  "How much is 26.99 APR on $3000?",
  "What is the monthly payment on a $400,000 loan at 7%?",
  "What is the future value of $100,000 in 20 years?",
  "Can I live off the interest of $100,000?",
  "What will 1 dollar be worth in 20 years?"
 ],
 "related_searches": [],
 "recommended_shape": "standard article/guide is viable",
 "evidence": "AI Overview present, cites www.goldpointsystems.com, www.investopedia.com, www.youtube.com",
 "se_results_count": 50
}

```
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/autocomplete-rule-of-78.csv`
```
seed,suggestion,via
rule of 78,what is rule of 78,question:what
rule of 78,what is rule of 78 method,question:what
rule of 78,what is rule of 78 car loan,question:what
rule of 78,what does rule of 78 mean,question:what
rule of 78,what is the rule of 78 calculation,question:what
rule of 78,what is rule 78 of the internet,question:what
rule of 78,what is a rule of 78s loan,question:what
rule of 78,what is the rule of 78 formula,question:what
rule of 78,what is the rule of 78ths,question:what
rule of 78,how does the rule of 78 work,question:what
rule of 78,how rule of 78 works,question:how
rule of 78,how rule of 78s work,question:how
rule of 78,how does rule of 78 work,question:how
rule of 78,how to calculate rule of 78,question:how
rule of 78,how to use rule of 78,question:how
rule of 78,how rule of 78 formula,question:how
rule of 78,why rule of 78 is bad,question:why
rule of 78,why rule of 78s,question:why
rule of 78,why rule of 78 is important,question:why
rule of 78,why rule of 78 is good,question:why
rule of 78,why rule of 78,question:why
rule of 78,why rule of 78 calculator,question:why
rule of 78,why rule of 78 formula,question:why
rule of 78,is rule of 78 still legal,question:is
rule of 78,is rule of 78 legal,question:is
rule of 78,is the rule of 78 still used,question:is
rule of 78,what is rule 79,question:is
rule of 78,what is the rule of 75,question:does
rule of 78,does rule of 78,question:does
rule of 78,what is the 78 rule,question:can
rule of 78,can rule of 78,question:can
rule of 78,can rule of 78 calculator,question:can
rule of 78,can rule of 78 formula,question:can
rule of 78,should rule of 78 be used,question:should
rule of 78,should rule of 78 be capitalized,question:should
rule of 78,should rule of 78,question:should
rule of 78,should rule of 78 calculator,question:should
rule of 78,should rule of 78 formula,question:should
rule of 78,when rule of 78 is applied,question:when
rule of 78,when rule of 78 is used,question:when
rule of 78,when rule of 78s,question:when
rule of 78,when rule of 78,question:when
rule of 78,when rule of 78 calculator,question:when
rule of 78,when rule of 78 formula,question:when
rule of 78,where rule of 78s,question:where
rule of 78,where rule of 78 is used,question:where
rule of 78,where rule of 78 is applied,question:where
rule of 78,where rule of 78,question:where
rule of 78,where rule of 78 calculator,question:where
rule of 78,where rule of 78 formula,question:where
rule of 78,which rule of 78 is best,question:which
rule of 78,which rule of 78,question:which
rule of 78,which rule of 78 calculator,question:which
rule of 78,which rule of 78 formula,question:which
rule of 78,rule of 78 amortization schedule,alphabet:a
rule of 78,rule of 78 abolish,alphabet:a
rule of 78,rule of 78 abolition,alphabet:a
rule of 78,rule of 78 accounting,alphabet:a
rule of 78,rule of 78 amortization calculator,alphabet:a
rule of 78,rule of 78 amortization,alphabet:a
rule of 78,rule of 78 ato,alphabet:a
rule of 78,rule of 78 auto loan,alphabet:a
rule of 78,rule 78 of aircraft rules 1937 deals with,alphabet:a
rule of 78,rule 78 of aircraft rules 1937,alphabet:a
rule of 78,rule of 78 bnm,alphabet:b
rule of 78,rule of 78 bank,alphabet:b
rule of 78,rule 78 of bihar service code,alphabet:b
rule of 78,rule of 78 vs reducing balance,alphabet:b
rule of 78,rule of 78 calculator with balloon,alphabet:b
rule of 78,rule of 78 calculator with balloon excel,alphabet:b
rule of 78,bnm rule of 78 abolishment,alphabet:b
rule of 78,fed
```
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/coverage-lookup.txt`
```
coverage_lookup: 1 candidate(s) vs 875 repo pages / 890 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1231 past-chart lines

### /rule-of-78-calculator  — row - · create new content
keyword: rule of 78 calculator; rule of 78; is the rule of 78 legal
reader question (new page intent): How does the Rule of 78 split loan interest and what do I lose paying early?
lookup terms: rule v78 legal   format cues: calculator

Possible existing homes: none found in the repo page data, the search index or the sitemaps.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-10-11-tool-usage.md [table] | 8 | Lens 2 (adjacent to retirement persona — the next decision after "what is my income"). Cluster "Social Security break-even": `social security break even calculator` 8,100/mo KD 11; `social security break even calcu
- 2026-10-25.md [table] | 5 | **Lens 1 (direct intent — brief item 4, renting out as owner/landlord).** `tenant screening checklist` 250/KD 5 ($2.00 CPC), `first time landlord checklist` 200/KD 1, `landlord checklist` 150/KD 0, `rental property
Commits naming the topic: none
Same run overlap: none


```
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/sources/15usc1615-lii.txt`
```
SOURCE: https://www.law.cornell.edu/uscode/text/15/1615 (LII mirror of the U.S. Code; uscode.house.gov URL returned 404, govinfo 404)
RETRIEVED: 2026-11-23T07:12:29Z

(a) Prompt refund of unearned interest required
(1) In general
If a consumer prepays in full the financed amount under any consumer credit transaction, the creditor shall promptly refund any unearned portion of the interest charge to the consumer.
(2) Exception for refund of de minimus [1] amount
No refund shall be required under paragraph (1) with respect to the prepayment of any consumer credit transaction if the total amount of the refund would be less than $1.
(3) Applicability to refinanced transactions and acceleration by the creditorThis subsection shall apply with respect to any prepayment of a consumer credit transaction described in paragraph (1) without regard to the manner or the reason for the prepayment, including—
(A)
 any prepayment made in connection with the refinancing, consolidation, or restructuring of the transaction; and
(B)
 any prepayment made as a result of the acceleration of the obligation to repay the amount due with respect to the transaction.
(b) Use of “Rule of 78’s” prohibited
For the purpose of calculating any refund of interest required under subsection (a) for any precomputed consumer credit transaction of a term exceeding 61 months which is consummated after September 30, 1993, the creditor shall compute the refund based on a method which is at least as favorable to the consumer as the actuarial method.
(c) Statement of prepayment amount
(1) In generalBefore the end of the 5-day period beginning on the date an oral or written request is received by a creditor from a consumer for the disclosure of the amount due on any precomputed consumer credit account, the creditor or assignee shall provide the consumer with a statement of—
(A)
 the amount necessary to prepay the account in full; and
(B)
 if the amount disclosed pursuant to subparagraph (A) includes an amount which is required to be refunded under this section with respect to such prepayment, the amount of such refund.
(2) Written statement required if request is in writing
If the customer’s request is in writing, the statement under paragraph (1) shall be in writing.
(3) 1 free annual statement
A consumer shall be entitled to obtain 1 statement under paragraph (1) each year without charge.
(4) Additional statements subject to reasonable fees
Any creditor may impose a reasonable fee to cover the cost of providing any statement under paragraph (1) to any consumer in addition to the 1 free annual statement required under paragraph (3) if the amount of the charge for such additional statement is disclosed to the consumer before furnishing such statement.
(d) DefinitionsFor the purpose of this section—
(1) Actuarial method
The term “actuarial method” means the method of allocating payments made on a debt between the amount financed and the finance charge pursuant to which a payment is applied first to the accumulated finance charge and any remainder is subtracted from, or any deficiency is added to, the unpaid balance of the amount financed.
(2) Consumer, credit
The terms “consumer” and “creditor” have the meanings given to such terms in section 1602 of this title.
(3) CreditorThe term “creditor”—
(A)
 has the meaning given to such term in section 1602 of this title; and
(B)
 includes any assignee of any creditor with respect to credit extended in connection with any consumer credit trans
```
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/sources/cfpb-precomputed-vs-simple.txt`
```
SOURCE: https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/
RETRIEVED: 2026-11-23T07:13:15Z

last reviewed: JAN 30, 2024
            What's the difference between a simple interest rate and precomputed interest on an auto loan?
                Precomputed interest results in the total interest due under the loan being calculated IMMEDIATELY. It is then spread equally among monthly payments. Simple interest – which is far more common - calculates the interest based on the outstanding balance of the loan either on a daily or monthly basis.
        Precomputed interest is an uncommon way of calculating interest payments for your auto loan. It benefits the lender if you pay more than the minimum balance each month or pay off your loan early. If you plan to pay your loan off early, you want to make sure lenders are using a simple interest rate, which is generally more common.Simple interest rateThe simple interest rate formula (also referred to as an amortizing rate) calculates the interest owed on a daily or monthly basis. The amount of interest you pay each month is calculated based on your actual outstanding balance on the day your payment is due. If you tend to make more than your monthly payment each month, the amount you owe – or your principal – gets smaller as you pay down your loan.Precomputed interest rateWith a precomputed interest rate, the interest is added to your principal at the beginning of your loan and then split into monthly payments. This formula allocates more of your payment to interest during the first part of your loan. Making extra payments does not reduce the principal amount (or interest) owed.If you’re planning to pay off your loan early, a precomputed interest rate would mean you’re ultimately paying more in interest. However, you may get a refund of some “unearned” interest.See different ways to get an auto loanYou have several options to consider when buying a new car or getting an auto loan. Learn how they can affect your overall money picture.Read more about the ways to finance your loan
                Don't see what you're looking for?
                    Browse related questions 
Is it better to pay off the interest or principal on my auto loan?
What is the difference between a loan interest rate and the APR?
                                    Learn more about
                                    auto loans
            Search for your question
        Search
                    Searches are limited to 75
                    characters.
    Page last modified Jan. 30, 2024
    @
        02:33 PM EST
            About usThe Consumer Financial Protection Bureau is a 21st century agency that implements and enforces Federal consumer financial law and ensures that markets for consumer financial products are transparent, fair, and competitive.Learn how the CFPB can help you
    The content on this page provides general consumer information. It is not legal advice or regulatory guidance. The CFPB updates this information periodically. This information may include links or references to third-party resources or content. We do not endorse the third-party or guarantee the accuracy of this third-party information. There may be other resources that also serve your needs.

```
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/feasibility-rule78.py`
```
import json
def case(P,apr,n,k):
    r=apr/1200; pay=P*r/(1-(1+r)**-n); I=pay*n-P
    r78=I*sum(range(n-k+1,n+1))/(n*(n+1)/2)   # earned after k payments
    bal=P
    for _ in range(k): bal=bal*(1+r)-pay
    act=pay*k-(P-bal)
    return dict(P=P,apr=apr,n=n,k=k,payment=round(pay,2),total_interest=round(I,2),rule78_earned=round(r78,2),actuarial_earned=round(act,2),extra_interest_charged_by_rule78=round(r78-act,2))
out=[case(15000,7,48,12),case(15000,7,48,24),case(15000,7,48,42),case(25000,8,60,12),case(30000,9,72,24)]
json.dump(out,open('/home/user/modernwallet/reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/feasibility-rule78.json','w'),indent=1);print(json.dumps(out,indent=1))

```
### `reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/feasibility-rule78.json`
```
[
 {
  "P": 15000,
  "apr": 7,
  "n": 48,
  "k": 12,
  "payment": 359.19,
  "total_interest": 2241.3,
  "rule78_earned": 971.99,
  "actuarial_earned": 943.34,
  "extra_interest_charged_by_rule78": 28.65
 },
 {
  "P": 15000,
  "apr": 7,
  "n": 48,
  "k": 24,
  "payment": 359.19,
  "total_interest": 2241.3,
  "rule78_earned": 1669.54,
  "actuarial_earned": 1643.27,
  "extra_interest_charged_by_rule78": 26.26
 },
 {
  "P": 15000,
  "apr": 7,
  "n": 48,
  "k": 42,
  "payment": 359.19,
  "total_interest": 2241.3,
  "rule78_earned": 2201.27,
  "actuarial_earned": 2197.97,
  "extra_interest_charged_by_rule78": 3.3
 },
 {
  "P": 25000,
  "apr": 8,
  "n": 60,
  "k": 12,
  "payment": 506.91,
  "total_interest": 5414.59,
  "rule78_earned": 1935.05,
  "actuarial_earned": 1846.92,
  "extra_interest_charged_by_rule78": 88.13
 },
 {
  "P": 30000,
  "apr": 9,
  "n": 72,
  "k": 24,
  "payment": 540.77,
  "total_interest": 8935.16,
  "rule78_earned": 4936.78,
  "actuarial_earned": 4708.96,
  "extra_interest_charged_by_rule78": 227.82
 }
]
```
### `reports/trend-pass/2026-11-23.research.md`
```
# Trend-pass research pack — 2026-11-23 (7-day window 2026-11-16→2026-11-23)

## Trend (Lane A)
Verdict: Trend already caught on 2026-09-01: Roth 401(k) vs Traditional 401(k) contribution split (trends.md row 4, MINED) — "401k roth traditional", "roth 401k vs standard 401k", "roth and traditional 401k" share it, all 0 clicks / 1 impr; top pages show no theme with >=3 pages holding >=40% of clicks (1 click total, home page).
### Tier-0 trend findings
None this run
### Trend gap findings
None this run

## Query check (Lane B)
Verdict: 14 covered / 1 uncovered of coverage_queries (15 returned; incl. 'site:themodernwallet.com' operator string, not a reader query)
- "rule of 78 calculator" (0 clicks, 3 impr, pos 64.3) — UNCOVERED: no page, slug or text mention of the Rule of 78 anywhere in src/ (slug FREE: rule-of-78-calculator; git log -S empty) — entity: Rule of 78 / sum-of-the-digits loan interest allocation — suggested angles: anchor calculator (auto-loan or personal-loan section, early-payoff interest-rebate view), guide "what is the rule of 78 / is it legal" (15 U.S.C. 1615 bans it for precomputed consumer loans over 61 months; primary source needed). Fit-gate: formula is deterministic; legal claim needs primary source.
COVERED: roth 401k/traditional variants -> compare/roth-401k-vs-traditional-401k; best financial way to buy a car / plan to buy a car -> compare/buying-vs-leasing-a-car, new-car-vs-used-car; 20000 for 72 months -> /auto-loan/ calculators; cheap wills / where can i get a free will -> roundup/best-online-will-makers, compare/online-will-vs-lawyer; living trust services -> roundup/best-living-trust-services; investment portfolio calculator -> /portfolio/; tax deferred vs taxable -> /taxable-vs-tax-deferred/; am i on track to retire -> /retirement/ calculators.

### Rising & spillover uncovered queries (additive)
None this run (rising_queries=0, spillover_queries=0)
### Sideways formula / pattern expansion candidates (additive)
None this run (modifier_patterns=0; no repeatable modifier wrapper)

## Pre-filtered out (already exists)
- 14 reader coverage queries — exist; previously COVERED in ledger.md 2026-11-15/17/18 rows

```
### `reports/trend-pass/2026-11-23.pull.json`
```
{
  "site_url": "sc-domain:themodernwallet.com",
  "window": {
    "start": "2026-11-16",
    "end": "2026-11-23",
    "days": 7
  },
  "top_queries": [
    {
      "query": "site:themodernwallet.com",
      "clicks": 0,
      "impressions": 8,
      "ctr": 0,
      "position": 1
    },
    {
      "query": "rule of 78 calculator",
      "clicks": 0,
      "impressions": 3,
      "ctr": 0,
      "position": 64.33
    },
    {
      "query": "20000 for 72 months",
      "clicks": 0,
      "impressions": 2,
      "ctr": 0,
      "position": 2
    },
    {
      "query": "401k roth traditional",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 93
    },
    {
      "query": "am i on track to retire",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 96
    },
    {
      "query": "best financial way to buy a car",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 74
    },
    {
      "query": "best way to buy a car financially",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 84
    },
    {
      "query": "cheap wills",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 96
    },
    {
      "query": "investment portfolio calculator",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 81
    },
    {
      "query": "living trust services",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 77
    }
  ],
  "coverage_queries": [
    {
      "query": "site:themodernwallet.com",
      "clicks": 0,
      "impressions": 8,
      "ctr": 0,
      "position": 1
    },
    {
      "query": "rule of 78 calculator",
      "clicks": 0,
      "impressions": 3,
      "ctr": 0,
      "position": 64.33
    },
    {
      "query": "20000 for 72 months",
      "clicks": 0,
      "impressions": 2,
      "ctr": 0,
      "position": 2
    },
    {
      "query": "401k roth traditional",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 93
    },
    {
      "query": "am i on track to retire",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 96
    },
    {
      "query": "best financial way to buy a car",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 74
    },
    {
      "query": "best way to buy a car financially",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 84
    },
    {
      "query": "cheap wills",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 96
    },
    {
      "query": "investment portfolio calculator",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 81
    },
    {
      "query": "living trust services",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 77
    },
    {
      "query": "plan to buy a car",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 92
    },
    {
      "query": "roth 401k vs standard 401k",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 94
    },
    {
      "query": "roth and traditional 401k",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 87
    },
    {
      "query": "tax deferred vs taxable",
      "clicks": 0,
      "impressions": 1,
      "ctr": 0,
      "position": 72
    },
    {
      "query": "where can i get a free will",
      "clicks": 
```
