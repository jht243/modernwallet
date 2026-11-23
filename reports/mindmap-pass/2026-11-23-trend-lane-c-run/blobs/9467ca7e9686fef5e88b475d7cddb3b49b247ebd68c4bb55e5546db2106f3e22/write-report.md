# WRITE report: trend-lane-c-2026-11-23, Batch 1 (A1, /rule-of-78-calculator/)

Actor: mindmap-build (WRITE stage), runId 230f59c5220e46748fbd6276168dd13e. Not committed or pushed. This is not an audit PASS.

## Built
- Engine: `src/lib/rule-of-78.ts` (reuses `computeLoanPayment`; Rule of 78 earned = I x k(2n - k + 1) / (n(n + 1)); actuarial from the amortization schedule; validates integer term 1 to 120, APR 0 to 30, payment number 1 to term).
- Tests: `scripts/test-rule-of-78.mjs` (esbuild replay, pattern of `scripts/test-loan-engines.mjs`): 391 checks pass. Covers golden $15,000/7%/48/12 (R78 earned $971.99, actuarial $943.34, difference $28.65), k=n difference 0, invalid input (k=0, k>n, non-integer, NaN, out-of-range) returns null, APR=0, term 1, 61/62-month flag, schedule sums, non-negative difference for every k.
- Island: `src/components/Rule78Calculator.tsx` (4 inputs, refunds, earned interest, refund bars, over-61-month notice linking the govinfo statute, month-by-month table). `data-tool` root comes from the hub page section (`calc.id` = route slug).
- Wiring: `CalculatorIsland.tsx` map entry, `registry.ts` LIVE_IDS, `calculators.ts` entry (navOrder 66, published/updated 2026-11-23, sources = govinfo statute + CFPB page).
- Evidence packet: `evidence/rule-of-78-calculator/` (`model.mjs` runs the shipped engine via esbuild, `inputs.json`, `output.json`, `evidence.json`, `growth.json`, `cases.json`). `validate-analysis` PASS. Every dollar figure in the closed fact list came from `output.json`.

## Prose generation
- `content_gen.py write`, `--tested no`, `--schema none`, floor 1200, manifest/review/packet flags. Draft: `drafts/rule-of-78-calculator.json` plus `.meta.json` (commit beside it).
- Model that ran: `gemini-3.8-flash` (FALLBACK). Primary `claude-opus-5-5` unusable: the supplied Anthropic keys were refused (credit balance too low, then short-TTL dead-key cache). Claim check ran 2 passes (2 claims removed). Cost about $0.02 for the write call.
- Raw first draft kept as `drafts/rule-of-78-calculator.json.writer-v1`. Body about 1,900 words.
- `content_gen.py fix` was refused by the generation budget ("a paid repair needs the actual failed independent review"), so the writer self-check findings (`audit/rule-of-78-calculator.writer-findings.txt`) were applied as single-sentence in-context edits using only fact-list wording: formula FAQ sentence, intro statute scope (after September 30, 1993), 3 sentences in "Who This Is Not For", 1 in "What Would Change Our Answer", intro closing sentence, one added scope sentence in "Our Takeaway", and 3 rhythm shortenings. metaTitle set in-context to a non-spliced 51-character title: "Rule of 78 Calculator for Early Loan Payoff Refunds". These edits are visible by diffing against `.writer-v1`. Independent AUDIT should review them as part of the exact page.
- INTRO HUMANIZE not run: pages generated end-to-end by `content_gen.py` are exempt, and the standard forbids a WRITE-stage subagent from calling `humanize_intro.py`. No OpenAI humanize key was used.

## Guardrails
- CR-1: 60-month case ($25,000/8%/60/12, $88.13) is the larger-gap example; the 72-month $227.82 case appears once, labelled a formula illustration; calculator shows a notice when term > 61.
- CR-2: statute scope wording from subsection (b); no "illegal/banned" without both conditions; no state-law position; payoff statement under 1615(c) explained (5 days, one free per year).
- CR-3: govinfo URL is the statute source (page sources, in-text link, packet artifact `chart-review-evidence/govinfo-15usc1615.txt`).
- CR-4: section 1 opens with a one-sentence definition then the answer; FAQ built from the question sweep.
- CR-5: dropped-covered queries to record in the run digest: plan to buy a car (compare/buying-vs-leasing-a-car, compare/new-car-vs-used-car); roth 401k vs standard 401k and roth and traditional 401k (compare/roth-401k-vs-traditional-401k); tax deferred vs taxable (/taxable-vs-tax-deferred/); where can i get a free will (roundup/best-online-will-makers, compare/online-will-vs-lawyer).
- CR-6: visible "In our internal modeling, we compared..." attribution in intro and "Based on our internal modeling" in the takeaway; no tested wording; title 51 chars; no em-dashes.

## Internal links (Phase 6, link-only; `updated` dates untouched)
- Inbound: `src/data/spokes-auto.ts` (early-payoff mistakes bullet), `src/data/calculators.ts` (loan-payment FAQ on amortization split), `src/data/spokes-personal-loan.ts` (prepayment-penalty FAQ).
- Outbound: /loan-payment-calculator/ in "How the Rule of 78 Splits Your Interest"; /auto-loan/early-payoff-calculator/ in "Who This Is Not For".

## Checks
- `check-write-scope` PASS; `precheck-drafts` PASS; `check_data_files.mjs` OK on the four edited data files; `npx tsc --noEmit`: 11 errors, identical to the baseline before this run (none in new or edited files); `npm run build` exit 0 (1162 pages, bundle check ok); `rendered-audit.py capture-local --build` captured 4 routes.
