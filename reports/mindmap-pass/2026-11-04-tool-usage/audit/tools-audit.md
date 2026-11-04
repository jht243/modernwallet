# Phase 4 tools audit: rows F1-F7 (tool fix) and M2-M7 (tool monetize)

- Auditor: `phase4-tools-auditor` (independent; did not write these changes; no src/ edits made)
- Date: 2026-11-04
- Instruction bundle: `reports/mindmap-pass/2026-11-04-tool-usage/preflight-audit-tools` (prepare run-id 46b88ec9126142f294163c78dfd74e8c, 37/37 parts read one per call, `check` = `delivery-complete-sources-current`)
- Scope: `git diff -- src/lib src/components` (excluding BiweeklyMortgage/PayoffVsInvest files and their CalculatorIsland lines), `git diff -- src/data/spokes-probate.ts src/data/spokes-elder-care.ts`, and `updated` bumps in src/data.
- Preview: http://127.0.0.1:4321 (static dist). Playwright chromium, 1366px and 390px.
- Evidence files: `audit/tools-audit-walk1.json`, `audit/tools-audit-walk2.json` (browser results), `audit/tools-audit-asin1.json`, `audit/tools-audit-asin2.json` (ASIN re-resolution), screenshots in `audit/screens/` (40 PNGs).
- Reviewed file hashes (sha256, first 12): FloridaAmendment3Calculator.tsx 332c72893275, InflationCalculator.tsx 7906feff56be, SocialSecurityTaxableCalculator.tsx 5e1c4759ac06, SelfEmploymentTaxCalculator.tsx 9c5a29ed8832, StockCapitalGainsCalculator.tsx cb66396ed0b8, LongTermCareCostCalculator.tsx aac2322f29e8, ProbateHubCalculator.tsx bc7f04db3285, ToolPicks.tsx eea97f040688, lib/florida-amendment-3.ts 428a4a2adf52, lib/self-employment-tax.ts 94611b4ad5f2, lib/long-term-care-cost.ts 447bb6005973, lib/probate-hub.ts d8490da59044, data/spokes-probate.ts b7e0e2bfcf7d, data/spokes-elder-care.ts b5775acc1ce9.

## Global checks (all rows)

| Check | Result | Evidence |
|---|---|---|
| Console errors | PASS | 0 console/page errors on all 14 routes x 2 widths (walk1 `consoleErrors`, walk2 `consoleErrors`). |
| Horizontal scroll | PASS | scrollWidth == clientWidth on every route at 1366 and 390 (walk1 `layout`). |
| URL / title / meta / H1 | PASS | No metaTitle/metaDescription/h1/slug edits in the scoped diffs; rendered title/H1/meta recorded per route in walk1 `head`. |
| `data-tool` root untouched | PASS | No `data-tool=` in any diff; rendered roots: florida-amendment-3-calculator, inflation-calculator, social-security-taxable-benefits-calculator, self-employment-tax, stock-capital-gains-tax-calculator, elder-care, probate. |
| No new dependencies / paid API | PASS | Only internal imports added (ToolPicks, lib constants). |
| Check scripts | PASS | `node checks/F4-F5.check.mjs` 15/15 ok; `node checks/florida-amendment-3.check.mjs` 9/9 PASS. |
| New-text em-dash | PASS | Em-dash counts unchanged in every touched file (old=new: spokes-elder-care 52, spokes-probate 62, long-term-care-cost.ts 3, probate-hub.ts 19, ProbateHubCalculator 4, LongTermCareCost 3); no em-dash in added lines of other files. |
| "honest" / hype words in new text | PASS | grep of added lines: only hits are pre-existing "Essentially" and "dramatically" in edited-but-unchanged sentences. |
| Unlinked check/verify directives in new text | **FAIL** | `src/components/ProbateHubCalculator.tsx:120` "Check your state's limit for real property." has no link (rendered on /probate/, /probate/fee-calculator/, /probate/cost-vs-trust-calculator/ and all state sub-pages). Other new directives are linked: F1 "Check with your county property appraiser" -> floridarevenue.com LocalOfficials (200); F6 "Check your county in the CareScout ... Cost of Care Survey" -> carescout.com/cost-of-care (200). |
| Updated date on every edited page | **FAIL** | dist JSON-LD + byline: every route rendering a changed island shows 2026-11-04 EXCEPT `/self-employment-tax/youtube-taxes/` and `/self-employment-tax/dataannotation-taxes/` ("Updated October 9, 2026", dateModified 2026-10-09). Both render `data-tool="self-employment-tax"` and in the browser show the new due-dates note, Form 7206 note, under-$400 logic, QBI threshold change and the picks block (walk2 `youtube`: dates/picks/form7206 all true). Source: `src/data/spokes-gig-online.ts:351` and `:410`. |
| No date churn on unchanged pages | PASS | /elder-care/ hub and medicaid-spend-down pages (ElderCareHubCalculator, unchanged) kept 2026-06-25; special-needs-trust kept 2026-10-10. All bumped pages in scope render a changed island. |

## Per-row verdicts

### F1 Florida Amendment 3 (`/florida-amendment-3-calculator/`): PASS
- Diff limited to `src/lib/florida-amendment-3.ts` and `FloridaAmendment3Calculator.tsx` as the row says. Additive: Yes/No toggle added, sub-line text updated, disclaimer extended; no input/output removed. `residentBy2027` optional, default Yes.
- Math: reason + worked example + source present (Fla. Const. Art. VII s.6(a), s.196.031; FL DOR CPI table). FL DOR PDF fetched: "2026 2.7% $26,411" (additional exemption applied to assessed value above $50,000). Reproduced in browser: $60,000 at 11.2 mills -> $280; $45,000 -> $224; $285,000 -> $2,224 (2028) and "$1,104 in 2027 (approved by voters Nov 3, 2026)", unchanged; check script confirms >= $76,411 unchanged.
- Newcomer note shows on No: "The larger exemption phases in for people who become Florida residents after Jan 1, 2027. Newcomers may not get the full increase right away, so the 2027 and 2028 bills above keep today's exemption." No "fifth year"/"five years" in the tool (walk1 `newcomer.fifth=false`). Zero-millage hint renders. Old "if Amendment 3 passes" gone. Toggle buttons 40px, aria-pressed. Byline/JSON-LD 2026-11-04.
- Advisory: page FAQ says newcomers "ramp up to $250,000 after five years"; the tool holds today's exemption for 2027-2028 as a disclosed conservative simplification. Not contradictory to the answer, but a 2027 arrival's 2028 savings may be understated.

### F2 Inflation calculator (`/inflation-calculator/`): PASS
- Chips 2% (Fed target)/3%/4% set the rate (walk1 `chipSets2="2"`); Fed link is the 2% longer-run FAQ (fetched); BLS CPI link; deflation hint "Rates below 0% (deflation) are not supported; a minus sign is ignored."
- Year-by-year table: 20 rows for 20 years; year 1 on $50,000 at 2% = $51,000 / $49,020 / $50,000, matching amount x (1+i)^t (existing engine reused per row). Copy button present. Nothing removed; math unchanged.

### M2 Inflation picks: PASS
- `data-tool-picks="inflation-calculator"`, heading "Further reading on beating inflation", below the disclaimer (DOM order true). Tiers change: cash (return 0) -> Bogleheads + How to Make Your Money Last; return 7%/20 yrs -> Pfau + Quinn; return 7%/5 yrs -> Four Pillars + Pfau. Links amazon.com/dp/<ASIN>?tag=soulcircle01-20, rel "sponsored nofollow noopener noreferrer", target _blank, disclosure line present, no price/rating text.

### F3 Social Security taxable benefits (`/social-security-taxable-benefits-calculator/`): PASS
- MFS-living-together now reads "the base amount is $0, so up to 85% ... from the first dollar (IRS Pub 915)"; "above $0" gone. Pub 915 confirms "$0 if you are married filing separately and lived with your spouse at any time".
- Other-income hint (1099-R box 2a, exclude qualified Roth, up to 85 cents per dollar) correct. W-4V note: fw4v.pdf confirms 7%, 10%, 12% or 22%; links to /tax-bracket-calculator/ and the senior-deduction guide; note hidden when taxable = $0 (walk1 `w4vHiddenAtZero`). No math change.

### M3 SS taxable picks: PASS
- Slug `social-security-taxable-benefits-calculator`; below the Pub 915 disclaimer. 85% tier -> Pfau, Taxes Made Simple, Lasser 2027; none tier ($20,000 benefits, $10,000 other, single) -> Social Security Made Simple, Get What's Yours. Tag/rel/target/disclosure correct; no prices.

### F4 Self-employment tax (`/self-employment-tax/how-much-to-set-aside-for-taxes/` and shared spokes): FAIL (date rule only)
- Math: `SE_MIN_NET_EARNINGS = 400` zeroes SE tax and half-SE deduction; $420 profit -> "Net earnings of $388 are under $400, so no self-employment tax is owed" and SE tax $0 (walk2 `se420`). Schedule SE instructions fetched (line 4c < $400). QBI test moved to taxable income before QBI; single/HOH 201,750 confirmed in Rev. Proc. 2025-32 s.4.26 table ($403,500 MFJ, $201,775 MFS, $201,750 all other). Persona $62,000 single unchanged ($12,498, 20.2%).
- Due dates (Apr 15, Jun 15, Sep 15, 2026; Jan 15, 2027), $1,000 rule and 100%/110% ($150,000 AGI) safe harbor match the IRS estimated-tax FAQ. Form 7206 note correct. HOH aria-label/title added. Quarterly self-link suppressed on the quarterly page (walk2 `quarterly.selfLink=0`) and present on DoorDash.
- FAIL: two pages rendering this changed island did not get the date bump: `src/data/spokes-gig-online.ts:351` (dataannotation-taxes) and `:410` (youtube-taxes) still `"updated": "2026-10-09"`. Fix: set both to `"2026-11-04"` and rebuild.
- Advisory: aria-label "Head of household" on a button whose visible text is "Head of hh" does not contain the visible text (WCAG 2.5.3 label-in-name); the title attribute alone or visible text "Head of household" would avoid it.

### M4 Self-employment picks: PASS (inherits F4 date fix for youtube/dataannotation)
- Slug `self-employment-tax`; below the Form 7206 disclaimer (bounding boxes: picks top 1239 > disclaimer bottom 1223 at 1366). Tiers change: profit only -> Piper contractor taxes, Working for Yourself, Deduct It!; with $60,000 W-2 -> Piper + Deduct It!; $260,000 profit (QBI above threshold) -> Lasser Small Business Taxes 2027 + Piper. Tag/rel/target/disclosure correct; no prices. Block also renders on doordash, quarterly, 1099, hub, youtube and dataannotation routes.

### F5 Stock capital gains (`/stock-capital-gains-tax-calculator/`): PASS
- MFJ TI $80,000 + $30,000 LT gain: "Before this sale. This sale uses $18,900 at 0%; $0 left." Loss case single TI $72,000, loss $23,500: deductible $3,000, carried $20,500, saves about $660 (22% bracket) — Topic 409 fetched ($3,000 / $1,500 MFS). Holding-period example (bought Mar 10, 2025 -> long-term on/after Mar 11, 2026) matches Pub 550 "day after you acquired". Standard deductions $16,100 / $32,200 / $24,150 match Rev. Proc. 2025-32. Tax math unchanged (check script persona $3,525 LT, $5,170 ST, NIIT $1,900).
- Advisory: "at 0%; $0 left" joins two clauses with a semicolon (content-standard punctuation rule). Rung 1 suggestion: `This sale uses {X} at 0%, leaving {Y}.`

### M5 Stock picks: PASS
- Slug `stock-capital-gains-tax-calculator`; below the Rev. Proc. disclaimer (picks top 1069 > 1053). Gain tier -> Taxes Made Simple + Bogleheads; loss tier -> same titles with loss-specific "why" lines; high-income tier (TI $600,000) -> Lasser 2027 + Taxes Made Simple. Tag/rel/target/disclosure correct; no prices.

### F6 Long-term care (`/elder-care/long-term-care-cost-calculator/`): PASS
- "$$180,000" fixed ("Your $180,000 in liquid assets covers ~2.1 years"). Persona case (Ohio, semi-private, 78, 1 yr out, 3 yrs, $1,900/mo, $180,000): total $339,291, start-year shortfall $256,068, new "Total shortfall if costs keep rising" $270,891 (= 339,291 - 1,900 x 36) reproduced in the browser at both widths. Default case $381,255 matches persona math.
- Copay $217.00: CMS 2026 fact sheet fetched ("$217.00 in 2026 ($209.50 in 2025)"). Tool lib note and page body (howItWorks + FAQ) both say $217.00; 0 occurrences of 209.50 rendered. LTC insurance only mentioned when ticked (low-likelihood reasoning without insurance verified). Age hint, 20px checkbox in a 44px row, state-factor note with CareScout link present.

### M6 Long-term care picks: PASS
- Slug `elder-care`; sits after the Genworth note, ~800px below the Medicaid-likelihood box, never inside it. Tiers change: LOW -> Quinn, Pfau, Nolo LTC; MEDIUM (persona) -> Nolo LTC, Quinn, Care for Aging Parents; HIGH ($20,000 assets) -> Nolo LTC, Care for Aging Parents, Get What's Yours for Medicare; home health aide puts Care for Aging Parents first. "Why" lines frame books as preparation for an elder-law attorney, not a substitute. Tag/rel/target/disclosure correct; no prices.

### F7 Probate (`/probate/cost-vs-trust-calculator/`, shared with /probate/ and spokes): FAIL
- Passing parts: intro now "The calculator below works out ..." and the paragraph precedes the tool in DOM (walk2 `trustIntroBelowTrue`). Small estate (Texas, $60,000): "If full probate were required" line and "Small-estate affidavit path: Under $1,000, weeks" row; state name "Texas" (no lowercase). Timeline explanation "Includes 3 to 6 months for real estate." matches engine constants. California $750,000 executor "$18,000 (statutory)" single figure. Funding row ($500 to $2,000) only on cost-vs-trust, and that page's howItWorks does state "Add $500-$2,000 for trust funding". Texas s.352.002 note checked against the statute text (5% of cash received/paid out, capped at 5% of gross FMV, exclusions for cash on hand at death, life insurance, payments to heirs) with a statute link. No savings math change.
- FAIL: `src/components/ProbateHubCalculator.tsx:120` new text "Real estate often needs a separate procedure. Check your state's limit for real property." is an unlinked check directive. Fix (Rung 1): `"Real estate often needs a separate procedure, and many states set a lower limit for real property."` (or link a state-specific source per state).
- Advisories: line 165 "The funding range is this page's estimate (see How it's calculated)" refers to the page itself; suggest "This range comes from How it's calculated below." Texas note "Many family executors waive it" has no source; consider dropping or sourcing.

### M7 Probate picks: PASS
- Slug `probate`; below "Estimates only ... Consult a licensed attorney" (picks top 1844 > 1828). Tiers change: California trust-saves -> Californian's Guide, Make Your Own Living Trust, 8 Ways; Texas $500,000 -> Living Trust, 8 Ways, Plan Your Estate; small estate -> 8 Ways + Estate Planning Basics; contested -> Executor's Guide + Plan Your Estate (no DIY trust book). Tag/rel/target/disclosure correct; no prices. Phone layout holds (screenshot reviewed).

## Routes exercised (1366px and 390px)
/florida-amendment-3-calculator/, /inflation-calculator/, /social-security-taxable-benefits-calculator/, /self-employment-tax/how-much-to-set-aside-for-taxes/, /stock-capital-gains-tax-calculator/, /elder-care/long-term-care-cost-calculator/, /probate/cost-vs-trust-calculator/, plus shared-component routes /self-employment-tax/, /self-employment-tax/doordash-taxes/, /self-employment-tax/quarterly-estimated-tax-calculator/, /self-employment-tax/youtube-taxes/, /probate/, /probate/fee-calculator/, /probate/fee-calculator/texas/. dist dateModified checked for every page carrying the seven changed data-tool roots (148 files).

## ASIN re-resolution (amazon_pick.py --index Books, Creators API, tag soulcircle01-20)
All 20 pinned ASINs re-resolved to the named book (top result unless noted):
- New 2026-11-04 keys: 1950967204 Taxes Made Simple (Piper); 1950967174 Independent Contractor, Sole Proprietor, and LLC Taxes (Piper); 1394448961 J.K. Lasser's Small Business Taxes 2027; 1413330010 Long-Term Care: How to Plan & Pay for It; 0761166769 How to Care for Aging Parents, 3rd Edition; 1413333400 8 Ways to Avoid Probate; 1413333257 Estate Planning Basics; 1413333192 Every Californian's Guide to Estate Planning; 1413330576 Make Your Own Living Trust; 1413329810 Plan Your Estate; 1413331742 Executor's Guide.
- Reused keys: 1119847672 Bogleheads' Guide to Investing; 1982115831 How to Make Your Money Last; 1264715919 Four Pillars of Investing 2nd ed.; 1945640154 Retirement Planning Guidebook (Pfau, second result, same title); 1394461577 J.K. Lasser's Your Income Tax 2027; 1950967190 Social Security Made Simple; 1501144766 Get What's Yours (revised); 1668031914 Get What's Yours for Medicare (revised); 1413333052 Deduct It!; 141333217X Working for Yourself.
- Credentials were passed via environment only; none written to any file.

## Not covered here
`rendered-audit.py capture/check` snapshot and review JSON were not produced by this tool-row audit; the orchestrator's rendered-page audit must still run on the final candidate after the fixes above.

## Required changes
1. `src/data/spokes-gig-online.ts:351` and `:410`: `"updated": "2026-10-09"` -> `"updated": "2026-11-04"` (dataannotation-taxes, youtube-taxes render the changed SE island and picks). Rebuild and confirm byline + JSON-LD.
2. `src/components/ProbateHubCalculator.tsx:120`: replace the unlinked "Check your state's limit for real property." (suggested: "Real estate often needs a separate procedure, and many states set a lower limit for real property.").

Row summary: F1 PASS, F2 PASS, M2 PASS, F3 PASS, M3 PASS, F4 FAIL (date bump), M4 PASS (pending F4 date fix), F5 PASS, M5 PASS, F6 PASS, M6 PASS, F7 FAIL (unlinked directive), M7 PASS.

Round 1 result: FAIL (F4 date bump on 2 routes, F7 unlinked directive).

## Round 2 (re-audit of the rebuilt preview, 2026-11-04)

Evidence: `audit/tools-audit-r2-walk1.json`, `audit/tools-audit-r2-walk2.json`, screenshots in `audit/screens/r2/`. Both walks were rerun at 1366px and 390px on all 14 routes. Results: 0 console errors, no horizontal scroll, and every picks block still has tag=soulcircle01-20, rel "sponsored nofollow noopener noreferrer", target _blank and the disclosure, with no price or rating text. Both check scripts pass again: F4-F5 15/15 and Florida 9/9.

| Item | Result | Evidence |
|---|---|---|
| R1 fix 1: date bump on youtube-taxes / dataannotation-taxes | PASS | `src/data/spokes-gig-online.ts` both now `"2026-11-04"`. dist: both show dateModified 2026-11-04 and "Updated November 4, 2026". Browser: youtube shows the new SE notes and picks with the new byline. Across dist, all 127 pages carrying the six changed roots are 2026-11-04. The 53 elder-care hub, medicaid and special-needs pages keep their old dates; they use the unchanged ElderCareHubCalculator, so this is correct. |
| R1 fix 2: ProbateHubCalculator.tsx:120 | PASS | Renders "Real estate often needs a separate procedure, and many states set a lower limit for real property." on /probate/, /probate/fee-calculator/ and /probate/cost-vs-trust-calculator/. The line has no directive. |
| ProbateHubCalculator.tsx:165 | PASS | "The funding range is the estimate given in How it's calculated." The text no longer refers to the page itself. The funding row still shows only on cost-vs-trust. |
| probate-hub.ts Texas note | PASS | "Many family executors waive it" removed. It now ends "The executor range shown is a ceiling." That sentence is consistent with the §352.002 5% cap. The statute link still renders. |
| SE HOH aria-label | PASS | aria-label "Head of hh (head of household)" contains the visible text "Head of hh" (label-in-name satisfied). |
| Inflation hint | PASS | "Rates below 0% (deflation) are not supported. A minus sign is ignored." |
| Stock sub-line | PASS | MFJ $80,000 + $30,000 gain renders "Before this sale. This sale uses $18,900 at 0%, leaving $0." |
| Set-aside page prose (inherited fix) | PASS | Now reads "applies once net earnings reach $400 ([Schedule SE](https://www.irs.gov/instructions/i1040sse)), up to the $184,500 Social Security wage base". This matches the tool's new $400 floor and the Schedule SE instructions. It is present in dist and adds no new em-dash. |
| LTC worked example (inherited fix) | PASS | Prose example now reads "about $338,000 at year-one prices, or about $374,000 if costs keep rising". Both figures reproduce from its own stated numbers: $7,040 x 48 = $337,920, and $528,000 - $3,200 x 48 = $374,400. It also discloses that the calculator's unrounded figures differ slightly (tool default $381,255). This agrees with the tool's new two-row shortfall. The persona case in the browser still shows $256,068 / $270,891. The page shows $217.00 twice and 209.50 nowhere. |
| Unchanged rows | PASS | F1, F2, F3, F5 and F6 behaviour is unchanged from round 1, with the same values. Picks still change by tier for M2-M7 (same tier lists as round 1) and still sit below the answer and disclaimer (bounding boxes). |
| New-text scans | PASS | Em-dash counts are unchanged in every re-edited file, and the added lines contain no "honest" or hype words. |

Not covered by this audit: the orchestrator's `rendered-audit.py` capture and review. Run-notes say noindex elder-care/probate spokes are reviewed from hydrated DOM because the helper refuses noindex routes.

Round 2 row summary: F1 PASS, F2 PASS, M2 PASS, F3 PASS, M3 PASS, F4 PASS, M4 PASS, F5 PASS, M5 PASS, F6 PASS, M6 PASS, F7 PASS, M7 PASS.

VERDICT: PASS
