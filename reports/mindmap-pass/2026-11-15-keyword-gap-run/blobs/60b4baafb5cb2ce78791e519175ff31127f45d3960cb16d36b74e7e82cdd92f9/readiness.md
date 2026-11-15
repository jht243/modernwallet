# Readiness report - keyword-gap BUILD (job keyword-gap-2026-11-15)

Author: mindmap-build. Unattended run; Phase 0 treated as approved by caller. Independent chart review still required (not self-approved).

## Preflight
- Bundle: reports/mindmap-pass/2026-11-15-keyword-gap-run/preflight-build (30 parts delivered, `check` = delivery-complete-sources-current). Run id e51063a11df34ea9a5a1777895b8ea32, actor mindmap-build, context kwgap-20261115-build epoch 1.

## Intake reconciliation
- Intake frozen at research/intake-keyword-gap.brief.md (sha in manifest evidenceFiles) + reports/seo-research/keyword-gap.json: 444 clusters, 522 keywords. cluster-dispositions.json gives each cluster a disposition and reason (counts in manifest exclusions; revised after chart-review round 1: per-row mortgage/auto/deferred checks). Dispositions are rule-assisted from keyword patterns plus live-repo checks; COVERED-PARTIAL means pre-matched pages are topical neighbours only (fuzzy), not a PASS of coverage.
- Key correction to caller brief: 'car loan calculator' DOES have a route: /auto-loan/ hub (src/data/calculators.ts id auto-loan, targetKeyword 'auto loan calculator', FAQ naming the car loan payment calculator) + 7 spokes. coverage-lookup.txt shows it as EXACT SLUG. No new page; avoids cannibalization.
- 'tax calculator' / federal income tax: live /tax-bracket-calculator/ (intro $85,000 example, howItWorks, HoH example) and /guides/how-much-tax-will-i-pay/ already answer tax owed. A3 is the no-addition branch; only a link to /paycheck-calculator/ is added.
- 'new york income tax calculator': deferred. tax.ny.gov guessed URLs returned 404 (saved as sources/ny-*.txt); no official NY/NYC 2026 schedule cited, so not built.

## Research and keyword evidence
- Demand: measured SEMRUSH/DataForSEO figures from the frozen intake (not re-pulled per caller). New head phrases not in intake carry no volume claim.
- SERP: DataForSEO unavailable this run (serp.json verdict unread, 0 calls). Rows say `unread`; never-block rule applied. Autocomplete question sweeps saved (autocomplete.salary.csv, autocomplete.paycheck.csv). PAA unavailable.
- Primary sources saved verbatim with URL and UTC time under research/sources/: IRS 2026 inflation adjustments (std deduction, brackets), IRS Rev. Proc. 2025-32 (pdftotext, full), IRS Topic 751 (6.2%, 1.45%, wage base $184,500, 0.9% above $200,000), IRS Topic 560. SSA site returned 403 to curl; wage base taken from IRS Topic 751 (primary).
- Reference math: research/paycheck-reference-calc.py + output json; assertions: $60,000 single federal tax $5,020 (hand check: taxable 43,900 = 60,000 - 16,100; 10% x 12,400 = 1,240 plus 12% x 31,500 = 3,780; total 5,020), std-deduction boundary gives $0, SS cap binds above $184,500, $52,000/(40x52) = $25.00/hr.

## Application map (rule -> artifact)
- _decision-evidence: calculated basis, visible 'internal modeling' attribution planned in briefs; takeaways per intent table in briefs; no-addition not applicable (real gap).
- _testing-labels / _experience section G: no product testing; ordinary presentation, no tested label/schema; stated per brief.
- YMYL guardrail (caller): only IRS-sourced figures, assumptions and exclusions on page, no individualized advice, no returns/rates invented.
- Chart obligations: titles avoid banned headings (no Conclusion/Summary); no vendor-neutrality claims; reader question + answer in section 1; depth floors: calculator tool pages budget >= 600 body words plus FAQ (WRITE to confirm floor from phase-3 table).
- Build cap: 2 new builds of max 3. State rows: only NY URLs attempted. Defended pages: defended-pages.json has no pages; /tax-bracket-calculator/ not locked.
- Review profile: HIGH (consequential tax/financial), 2 audits max, liabilityBlock not expected.

## Per-page preparation checks
| Page | Duplicate check | Testing eligibility | Evidence and label decision | Takeaway brief | Evidence |
|---|---|---|---|---|---|
| A1 /salary-calculator/ | no existing home (coverage-lookup.txt) | not eligible (section G products only) | calculated, no external figures | per brief | paycheck-reference-output.json |
| A2 /paycheck-calculator/ | no existing home; /tax-bracket-calculator/ is income tax only | not eligible | calculated from IRS sources | per brief | sources/irs-*.txt, reference calc |
| A3 /tax-bracket-calculator/ (links only) | no-addition: calculator (reader goal: tax owed and bracket) and /guides/how-much-tax-will-i-pay/ (estimate my 2026 bill, match 0.75) already answer it | not eligible | no new evidence; existing engine | n/a (existing verdicts sufficient) | coverage-lookup.txt, src/lib/tax-bracket.ts |

## Reviewer guardrails carried into WRITE/AUDIT (CR-5)
See A2/A1 contributionAndEvidence: Additional Medicare 0.9% employer withholding vs Topic 560 thresholds; pre-tax input lowers income tax only; Sec125/HSA not modeled; leaves-out list (tips, overtime, senior, QBI, child tax credit); annual-liability estimate not Pub 15-T; A1 35-45 hour table is an illustration; Phase 4 boundary and period test cases.

## Open limits
- SERP/PAA unread; GSC unavailable (growth baseline recorded unavailable, not zero).
- Link placements use FAQ/section names read from source files; WRITE must re-inspect before editing.
