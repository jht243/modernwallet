# Readiness report: trend-pass Lane C BUILD, 2026-11-23 (job trend-lane-c-2026-11-23)

Author: mindmap-build (BUILD stage). Independent CHART-REVIEW still required. Preflight bundle: reports/mindmap-pass/2026-11-23-trend-lane-c-run/preflight-build (33 parts, `check` = delivery-complete-sources-current). preparationMode: full (unattended trend-pass-auto caller).

## Original intake accounting (all 10 top-10 queries + research pack)
| Query (verbatim) | Impr / pos | Disposition | Reason / evidence |
|---|---|---|---|
| site:themodernwallet.com | 8 / 1 | DROPPED | Operator string, not a reader query (research pack flags it). |
| rule of 78 calculator | 3 / 64.33 | KEPT: A1 create new content (TOOL row, Phase 3c) | UNCOVERED. Coverage lookup: no existing page, no redirect, no commit. Slug /rule-of-78-calculator/ free. Tag: coverage / top-10. |
| 20000 for 72 months | 2 / 2 | DROPPED | Already covered by /auto-loan/ calculators (pos 2). No new angle. |
| 401k roth traditional | 1 / 93 | DROPPED | Covered: compare/roth-401k-vs-traditional-401k (trends.md row 4 MINED). |
| am i on track to retire | 1 / 96 | DROPPED | Covered: /retirement/ calculators. |
| best financial way to buy a car | 1 / 74 | DROPPED | Covered: compare/buying-vs-leasing-a-car, new-car-vs-used-car. |
| best way to buy a car financially | 1 / 84 | DROPPED | Same intent as previous row; same pages. |
| cheap wills | 1 / 96 | DROPPED | Covered: roundup/best-online-will-makers, compare/online-will-vs-lawyer. |
| investment portfolio calculator | 1 / 81 | DROPPED | Covered: /portfolio/. |
| living trust services | 1 / 77 | DROPPED | Covered: roundup/best-living-trust-services. |
Trend lane: none. Rising / spillover / modifier_patterns: all empty, so Lens 2b records "no transferable modifier wrapper in brief". Lens 3b skipped (not an AI-content repo). Ledger: no rule-of-78 row in reports/trend-pass/ledger.md (grep empty), so not KEPT/DROPPED/HELD.

## Fit decision for "rule of 78 calculator"
Fits the site (free deterministic loan calculators, auto/personal loan cluster, explicit precomputed-interest and prepayment content already present in spokes-auto.ts). No existing src/lib engine computes Rule-of-78 (sum-of-the-digits) interest allocation (loan-payment.ts gives only the level payment and actuarial schedule), so this needs NEW engine code `src/lib/rule-of-78.ts` and a new island component. Per phase-4c override that is a TOOL row built via Phase 3c, not an article row. It reuses `computeLoanPayment` for the level payment only.

## Keyword ladder
Rung used: DataForSEO (volume/kd/expand), SEMRUSH unusable (HTTP 403, recorded by `keyword_data.py status`), Ahrefs excluded by pin, plus Google Autocomplete on top; SERP via DataForSEO `serp.py`. Date 2026-11-23, US. Raw: research/keyword-volumes.json, research/keyword-expand.json (20 provider + 14 autocomplete ideas, limit 20 per source, stop reason: all returned ideas are one intent family), research/autocomplete-rule-of-78.csv (237 suggestions), research/serp-rule-of-78-calculator.txt.
- rule of 78: 1,000/mo KD 0; rule of 78 calculator: 170/mo KD 0; rule of 78 loan: 140; rule of 78 formula: 90 (CPC $38.92); what is the rule of 78: 210; is the rule of 78 legal: 10; rule of 78 vs simple interest: 10 (volume 75 is an autocomplete estimate, NOT measured). DataForSEO volumes are bucketed; KD is modeled and never used to drop a row.
- Off-topic rejects: "rule 78 of aircraft rules 1937", "rule of 78 in sales" (sales-pipeline sense), "rule of 78 ato" (Australia). Omitted families: none plausible.
- SERP: verdict winnable; AI Overview present citing goldpointsystems.com, investopedia.com, youtube.com; top 10 are small calculator sites (cleartali, loanamortizationcalculator.app, solvefree, calcwarehouse, etc.), no forum or major-platform domination. PAA returned are off-intent generic loan questions (0 on-topic of 6), so reader question evidence tag is `[PAA 0/6 on-topic; 6/6 off-topic: generic loan math; ac 10/10 corroborate]`, an intent flag for the reviewer (autocomplete and keyword family carry the question, not PAA).

## Duplicate check
`coverage_lookup.py --site-url https://www.themodernwallet.com` (research/coverage-lookup.txt): 1 candidate vs 875 repo pages / 890 sitemap routes: "Possible existing homes: none found", redirects none, commits naming the topic none, same-run overlap none. Closest neighbours (different reader goal, outbound/inbound link targets, NOT homes): /auto-loan/early-payoff-calculator/ (simple-interest extra payments), /loan-payment-calculator/ (level payment, amortization), /personal-loan/extra-payment-calculator/. Neither explains Rule-of-78 allocation or the early-payoff refund difference. git log: no commits touch the topic.

## Primary-source research (central answer, finished in preparation)
- 15 U.S.C. 1615 saved verbatim from the LII mirror of the U.S. Code (research/sources/15usc1615-lii.txt, retrieved 2026-11-23T07:12Z). uscode.house.gov and govinfo URL variants returned HTTP 404 from this runner, so LII is the primary-text mirror used; the reviewer should verify subsection (b). Findings: (a) unearned interest must be promptly refunded on full prepayment (de minimis under $1); (b) for precomputed consumer credit of a term exceeding 61 months consummated after September 30, 1993 the refund must be computed by a method at least as favorable to the consumer as the actuarial method (this is the Rule-of-78 ban, which the statute never names beyond its heading); (c) payoff statement within 5 days, one free per year; (d) actuarial method definition.
- CFPB: precomputed vs simple interest (research/sources/cfpb-precomputed-vs-simple.txt, last reviewed Jan 30, 2024): precomputed interest is uncommon on auto loans, front-loads interest, and early payoff costs more, with a possible refund of unearned interest.
- Strongest counterexample to the central conclusion: the federal ban covers only terms over 61 months, so a 60-month-or-shorter precomputed loan may legally use the Rule of 78 under federal law (state law varies and is not asserted here; the page must tell readers to check their contract and state rules). Source silence on state law is not proof of legality. The page must NOT say "the Rule of 78 is illegal" unconditionally.

## Engine feasibility (calculated basis, reproducible)
research/feasibility-rule78.py -> research/feasibility-rule78.json. Rule-of-78 interest earned after k of n payments = total interest x (sum of the last k digits of n..1) / (n(n+1)/2); actuarial = level-payment schedule. Reference cases: $15,000 / 7% / 48 mo payoff after 12 payments: Rule 78 earns $971.99 vs actuarial $943.34 (lender keeps $28.65 more); after 24: $26.26; after 42: $3.30. $25,000 / 8% / 60 mo after 12: $88.13. $30,000 / 9% / 72 mo after 24: $227.82. Finding: the extra interest cost is modest on short, low-rate loans, grows with rate and term, and shrinks to zero at maturity. These are feasibility outputs only; the Phase 3 evidence packet re-executes the shipped engine as the closed fact source.

## Evidence, attribution, testing, takeaway decisions
- Evidence basis: calculated (own engine) plus reported (statute and CFPB, attributed by name). Visible attribution to be written by the writer as "In our internal modeling, we compared..." style tied to the calculator and a nearby method note; no testing claims.
- Testing: section G of _experience.md licenses first-person testing only for products, apps and models and never for financial services; this is a calculation of a loan formula, so TESTED format is OFF (`--tested no`), ordinary format. No "tested" byline/schema.
- Takeaway: Rule of 78 shifts interest toward early months so early payoff refunds less than an actuarial refund; the difference is small on short or low-rate loans and larger on long, high-rate loans; federal law bars it for precomputed terms over 61 months; check your contract, payoff statement (15 U.S.C. 1615(c)) and state law. Informational/cost intent, no purchase recommendation, no personalized advice. Disclaimer at the bottom only.
- Review profile expectation: HIGH-adjacent (statute claim and finance figures). Independent risk assessment decides; consequential claim = the legal-scope statement.
- Defended pages: new route, N/A. Cooldowns: N/A for new route.

## Application map (rule -> concrete decision)
| Rule source | Decision |
|---|---|
| _decision-evidence.md | Decision gap: reader cannot see the dollar cost of Rule-of-78 vs actuarial on their own loan; calculated finding + takeaway above; evidence.json/growth.json planned in Phase 3. |
| _testing-labels.md / _experience.md G | Excluded (financial service); ordinary presentation. |
| _keyword-demand-ladder.md | DataForSEO rung, semrush 403 recorded, autocomplete labelled estimates. |
| _vendor-research.md | N/A (no vendor); coverage-first lookup done for site coverage. |
| _mindmap-execution.md | Full manifest, one TOOL row, request requirement mapped, cases-batch run in full mode. |
| phase-4c overrides | No metadata/redirect rows, additive, cap 25 (1 used), tag coverage/top-10, YMYL guardrails (engine numbers, primary sources, no advice, disclaimer bottom). |
| Format guard | New src/lib engine code -> TOOL row via Phase 3c (not an article spoke). |
| chart obligations (title 50-60 chars, headings, FAQ, who-not-for, what-would-change, next action) | Reflected in outline. |

## Per-page preparation checks
| Page | Duplicate check | Testing eligibility | Evidence and label decision | Takeaway brief | Evidence |
|---|---|---|---|---|---|
| /rule-of-78-calculator/ | passed (0 matches) | excluded (financial) | calculated + reported, no test label | planned | research/ folder files listed in manifest evidenceFiles |
