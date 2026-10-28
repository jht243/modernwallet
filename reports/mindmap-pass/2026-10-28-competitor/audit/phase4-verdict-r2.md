# Phase 4 verdict r2, 2026-10-28 competitor run (phase4-reviewer)

Startup `workflow-start.sh --cloud` exit 0 (7617515). Audit bundle `check` re-run: delivery-complete-sources-current. Audited bytes: dist HTML hash equals the new `rendered-snapshot.json` htmlSha256 and the 127.0.0.1:4331 response for all four routes. Draft JSONs equal the guides.ts entries.

Round 1: all substance findings are resolved. What remains are small mechanical defects, all Rung 1.

average-retirement-savings-by-age: FIX-IN-PLACE (3 MUST-FIX: R2-1 broken list, R2-2 rhythm run, R2-3 two overlong sentences)
student-loan-deferment: FIX-IN-PLACE (3 MUST-FIX: R2-1 merged bullet, R2-2 tee-up is sentence 3, R2-3 one 32-word sentence)
/retirement/ (inbound link): FIX needed on date policy and route inventory
/student-loan-wage-garnishment-calculator/ (inbound link): FIX needed on the link label

## Round-1 findings verified fixed against the sources
- Inflation: Federal Reserve restates all dollar amounts to 2025 dollars (scf26.pdf p.2 note 4, Appendix A; Table 3 header). The page now says so.
- Report date is October 2026. Page says "published ... in October 2026".
- By-age mean above median is no longer asserted; only the all-ages 4.26x.
- Calculator claim, orphan sentence pair, tee-up and opening sentence, 65+ alternative, counterexamples: fixed.
- Student loan: installment wording, four economic hardship routes, six-month limits (f)(3)(iv) and (f)(4), 685.205(b)(9) 60-day processing forbearance (interest not capitalized), consistent subsidized wording, ed.gov and peacecorps.gov links, half-up rounding ($1,199) with calc.py/output.txt regenerated and rerun identical.

## Remaining MUST-FIX with exact replacements

Retirement guide (quote and replacement in findings-r2):
1. R2-1: "We also divided ... mean. - 35 to 44 versus under 35: 3.77 times. - 45 to 54 ..." renders as a run-on paragraph. Restore real line breaks and a bullet list.
2. R2-2: sentences 66-75 are all 15+ words (monotone run). Shorten two bullets: "**Account holders only:** families without an IRA or DC plan do not appear." and "**Needs:** the figures say nothing about what balance you need."
3. R2-3: split "A balance below the average ... holds, because this release does not show the by-age medians." (32) into two sentences. Replace Takeaway S1 (35 words) with "Among families aged 64 or younger with an IRA or DC plan, the average balance rises from $48,400 under 35 to $670,200 at 55 to 64."

Student loan guide:
1. R2-1: "- You serve as a Peace Corps volunteer. - You already received an economic hardship deferment on a Federal Family Education Loan (FFEL) Program or Federal Perkins Loan..." is one merged bullet. Split into two lines.
2. R2-2: tee-up is sentence 3. Order the intro as answer, tee-up, then "Keep making scheduled payments if you can until it confirms approval."
3. R2-3: split the 32-word "Deferment and forbearance both pause or shrink ... subsidized loan." sentence at "but".

Inbound-link routes:
4. /student-loan-wage-garnishment-calculator/: the pill "Can't pay? How to defer your student loans" is aimed at borrowers in default, and the guide says a borrower in default is not eligible for deferment until arrangements are made. Suggested label in `src/data/cross-links.ts`: "Not in default yet? How to defer your student loans".
5. /retirement/ (and its 11 sibling retirement calculators): the shared "retirement" cross-link renders a new pill on 12 routes plus new cards on /guides/. The garnishment calculator was date-bumped for the same kind of link edit but these 12 were not. `phase-4-audit.md` date-bump rule names internal links and treats a stale date as a hard fail, while `_rendered-page-audit.md` permits documented link-only differences. The coordinator must pick one and record it: either bump `updated` for the retirement group to 2026-10-28, or write a link-only exception into the run summary. The decision must be the same for all 12 routes.
6. Manifest scope: `rendered-manifest.json` lists only `/retirement/`. I mechanically confirmed in dist that all 12 retirement routes carry the identical pill and keep their original dates, and that /guides/ shows both new cards. Add the other 11 routes and `/guides/` to the manifest (or record this mechanical inspection in the run notes) before closing deployment records.

## Not blocking
- `evidence/average-retirement-savings-by-age/calc.py` header still says "published 2026-10-09"; the source says October 2026.
- Table A's own caption lacks "2025 dollars"; the support is the report-wide statement (advisory wording fix in findings-r2).
- ed.gov and peacecorps.gov return HTTP 403 to this sandbox; I could not verify them.
- Layout evidence is structural only; no device screenshot.
- Inherited footer on every page: em-dash disclaimer and "This never affects our rankings or editorial coverage."
- Site template sets datePublished from `updated`, so the garnishment route's datePublished moved to 2026-10-28.

## Rendered review
`audit/rendered-review-r2.json`: reviewer phase4-reviewer, four routes with fingerprints copied from the new snapshot, `snapshotSha256` 38514a2223746bb4aecd8755597d021b56e50e197547326b89bc677c757f5f6e (canonical digest stored in the snapshot), `snapshotFileSha256` 85e0fbd69e5f5fb25900a9957c34ca3586da59c409fad5cd1f04d820ddb0fbbf. All four verdicts are FAIL; the checks that truly pass are marked PASS with evidence. After the fixes, recapture and re-review all affected routes (any change voids the fingerprints).
