# Phase 4 audit — tool-usage-mindmap-auto 2026-11-04 (independent auditors)

Auditors (distinct from the writer `tool-usage-main`): `phase4-tools-auditor` (rows F1-F7, M2-M7: tool fix / tool monetize diffs, browser walks, ASIN re-resolution) and `phase4-pages-auditor` (new pages /biweekly-mortgage-calculator/ and /pay-off-mortgage-or-invest-calculator/, analysis replays, complete rendered review of 29 indexable routes + 4 noindex routes from hydrated DOM).
Final results: tools audit Round 2 PASS; pages audit Round 3 PASS; `rendered-audit.py check --recapture` = "Rendered review evidence verified"; `mindmap-gates.py audit-analysis` PASS for both slugs.
Routes covered: /florida-amendment-3-calculator/ /inflation-calculator/ /social-security-taxable-benefits-calculator/ /self-employment-tax/how-much-to-set-aside-for-taxes/ /stock-capital-gains-tax-calculator/ /elder-care/long-term-care-cost-calculator/ /probate/cost-vs-trust-calculator/ /biweekly-mortgage-calculator/ /pay-off-mortgage-or-invest-calculator/ /mortgage/extra-payment-calculator/ /guides/pay-off-mortgage-early-or-invest/

---

## Report 1 — tool rows (full)

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


---

## Report 2 — new pages and rendered review (full)

# Phase 4 audit of pages and rendered output: tool-usage run, 2026-11-04

- **Reviewer:** `phase4-pages-auditor`, an independent agent that did not write these changes.
- **Content author:** `tool-usage-main` (manifest/packet author). The prose came from content_gen with model claude-opus-5-5.
- **Instruction bundle:** I read all 33 parts of `preflight-audit-pages/` in order. `workflow-preflight.py check` returned `delivery-complete-sources-current`. Files covered: _decision-evidence, _testing-labels, _content-standard, _anti-ai-language, _experience, _workflow-checkpoints, _rendered-page-audit, _mindmap-execution, _remediation-ladder and phase-4-audit.
- **Scope:** I read and edited no `src/` files and no drafts. I wrote only reviewer artifacts under `audit/`.

## Summary

| Route | Verdict | Blocking finding |
|---|---|---|
| /biweekly-mortgage-calculator/ (new) | **FAIL** | tee-up record missing; tool-copy semicolon; opening answer omits the 30-year term; vague "The answer changes…" sentence |
| /pay-off-mortgage-or-invest-calculator/ (new) | **FAIL** | tee-up record missing; two dead-end FAQ answers |
| /mortgage/extra-payment-calculator/ | **FAIL** | inherited "four to five years" contradicts the new linked answer (5 yr 10 mo at the page's own 6.5%); inherited CFPB citation now redirects to a generic hub |
| /self-employment-tax/how-much-to-set-aside-for-taxes/ | **FAIL** | inherited prose "applies from the very first dollar of profit" contradicts the new $400 floor (F4 target route) |
| /inflation-calculator/ | **FAIL** | new tool copy uses a semicolon |
| /stock-capital-gains-tax-calculator/ | **FAIL** | new tool copy uses a semicolon |
| 21 other snapshot routes | PASS | advisories only (listed below) |
| noindex: /elder-care/long-term-care-cost-calculator/ | **FAIL** | worked-example shortfall $360,000 conflicts with its own arithmetic ($7,040 × 48 ≈ $338,000) and with the tool's revised rows for the same default ($346,464 / $381,255) |
| noindex: /probate/cost-vs-trust-calculator/, /probate/fee-calculator/, /probate/timeline-calculator/ | PASS (advisories) | n/a |

---

## 1. Content audit of the two new pages

Both pages were read in the rendered preview (`audit/preview-snapshot.json`) and in `src/data/calculators.ts`. The text matches the drafts byte for byte.

Run records (prompt): `medium: interactive tool → interactive tool`, `register: operator`, `page type: explainer (calculator page…)`. The reader questions carry evidence tags. C1 is `[verb-only - no PAA, no completions…]`, which is a weaker premise, noted rather than failed. C2 is `[PAA 0 returned; ac ~27/37 …]`.

### 1a. /biweekly-mortgage-calculator/

| Gate | Result | Evidence |
|---|---|---|
| Register | PASS | Operator: "you", "At ModernWallet, we ran that loan three ways…". No encyclopedia voice. |
| Tee-up | **FAIL** (`teeup-missing-no-exemption`) | Paragraph 1 is the answer, then "Enter your balance… below…", then "It returns…". There is no tee-up and no `teeup-exempt:` note in the prompt, manifest, readiness, chart or run report (grep). A record fix is enough; see findings.txt #3. |
| First "we" names ModernWallet | PASS | "At ModernWallet, we ran that loan three ways in an internal calculation". `src/data/site.ts` SITE.name = "ModernWallet". |
| Reader question answered in section 1 | PASS with fix | Sentence 1 gives the figure ("about 70 months sooner") and paragraph 2 the worked example. The approved answer's "30-year" condition is dropped from sentence 1 (findings #1). |
| Required elements | PASS (one meaning-bar fix) | Who it's not for: "Skip a paid biweekly plan if your rate is low, if your servicer holds half-payments, or if the fee is larger than the gap…". What would change: present but vague ("The answer changes if your servicer applies… and charges no fee."), see findings #2. Close on next action: links to the extra-payment and pay-off-or-invest calculators. inlineCta: N/A, because `CalculatorDef` has no inlineCta field (same as the mirror page). |
| Disclaimer placement | PASS | The "not financial advice" line is in the footer, the last element. The tool's "Estimate only…" note sits inside the results, not at the top of the page. |
| Byline in body | PASS | None. "In our internal calculation" is method attribution, which the rules exempt. |
| Links gate | PASS | First mention of Regulation Z is the linked tool disclaimer (consumerfinance.gov 1026.36, verified 200). No other organisation is named. Note: the `howItWorks` mention is unlinked because the output contract forbade external links there. |
| Naming / directives | PASS (note) | "ask your servicer whether it applies each half-payment on arrival" is servicer-specific, so no single URL answers it. "The calculator" follows the mirror-page convention (advisory). |
| Sentence rhythm (script) | PASS | 69 sentences: short (1–8) 14, medium (9–14) 20, long (15+) 35. No 10-run in one band. No 5-run within 3 words. Over 30 words: #9 (35, the formula sentence, same as the mirror page) and #33 (31, "Skip a paid biweekly plan if…", one list sentence). |
| Depth | PASS (calculator framing page) | Body (intro + howItWorks + FAQ answers) = **1,054 words** (intro 136, howItWorks 522, FAQ 396). The mirror /mortgage-recast-calculator/ = **802** (110 / 304 / 388). The new page is 31% above the mirror. Note: the row label "explainer" carries a 1,200 floor, but phase-4 applies the DEPTH gate to `article` format rows only and this row is `calculator`. Recommend recording page type as a tool page in future so the label and the applied floor agree. |
| Anchor | PASS | Original calculation: biweekly vs free 1/12-extra vs fee drag (packet `calculated`). |
| Neutrality | PASS (advisory) | No self-neutrality claim in page prose. The site-wide footer line "This never affects our rankings or editorial coverage" predates this run and is advisory under the scope note. |
| Load receipt | PASS (pending stage) | `reports/standards-ledger.jsonl` has phase-3 and phase-5 `via:load-script` entries for tool-usage-mindmap-auto on 2026-11-04 with cs=ebf9e6f6 aa=59194cdd exp=1969dcd5. Recomputed sha256 prefixes match exactly. Domain is non-empty. The file is modified but not yet staged; it must be staged with the commit. |
| Em-dash count | PASS | 0 in all page fields. |
| "honest" grep | PASS | 0 hits. |
| Semicolons / exclamations in prose | PASS / **FAIL in tool copy** | Prose has 0 of each. The tool hint has one semicolon (findings #4). |
| Title case, meta | PASS | H1 "Biweekly Mortgage Calculator". metaTitle 58 chars, metaDescription 148 chars. Template headings ("How it works") use the site-wide sentence case, the same as the mirror page (advisory). |
| Numbers vs closed fact list | PASS | Script check: 105 numeric tokens, 0 outside the fact list. The fact list matches output.json: $1,896.20, $948.10, $382,633.47, 628, 289.8, $294,511.68, $88,121.78, 70 mo, $158.02, 290, $87,256.29, $865.49, $1,970, $86,151.78, $1,264.81, $20,637.30, $0. |
| Page text vs actual tool (browser) | PASS | Labels: "Current loan balance", "Interest rate", "Months left", "Biweekly plan setup fee", "Fee per biweekly debit". Defaults: 300,000 / 6.5 / 360 / 0 / 0. Output: "5 years 10 months sooner", "$948.10 every two weeks instead of $1,896.20", "$88,122", "24 years 2 months", "Same 13th payment, no plan $87,256". Fees 400 / 2.5 show "Plan fees over the loan $1,970", "after fees $86,152". This matches the prose claim that the calculator shows fees and savings after fees. |
| Takeaway agreement | PASS | Intro, tool, takeaway ("Based on our internal calculation… within $865.49 with no plan… $20,637.30 at 3% and $0 at 0%") and FAQs 1–6 agree. |
| Visible attribution | PASS | "At ModernWallet, we ran that loan three ways in an internal calculation… You can check every figure by changing the inputs in the calculator." This is a calculated basis, which matches packet provenance. |
| TESTED claims | PASS | None in prose, meta or schema. Schema is WebApplication, FAQPage, Article, Person and Breadcrumb. |

### 1b. /pay-off-mortgage-or-invest-calculator/

| Gate | Result | Evidence |
|---|---|---|
| Register | PASS | Operator: "you", "In our internal calculation, we followed…". |
| Tee-up | **FAIL** (`teeup-missing-no-exemption`) | Paragraph 1 has the rule, the inverse rule, then input and output sentences. No tee-up and no exemption note (findings #3). |
| First "we" naming | PASS | The first "we" is the authorial or method "we" ("In our internal calculation, we followed…"), which the naming rule exempts. The brand also appears in the page header. Note: the writer's claim-check removed "At ModernWallet, we" citing a wrong brand name ("The Modern Wallet"). The result is still compliant. |
| Reader question in section 1 | PASS | "Pay off the mortgage when your expected return is below the break-even return." Paragraph 2 gives the $300,000 example: "Paying off early ends $8,188.38 ahead because the 7% return sits below the 7.19% break-even." |
| Required elements | PASS except dead-ends | Who it's not for: "If you have no emergency fund, size one… before you send extra cash to the loan". What would change: "A lower mortgage rate or a tax-free account lowers the break-even, which tips the result toward investing". Close: the payoff-calculator link. |
| Meaning bar | **FAIL** (`dead-end` ×2) | FAQ 5: "If you itemize, keep in mind that the results do not include the deduction." FAQ 6: "…It ignores the mortgage-interest deduction and shows principal and interest only." Both name a limitation and stop. See findings #1 and #2. |
| Disclaimer, byline, neutrality, em-dash (0), honest (0), semicolons (0), exclamations (0) | PASS | Same checks as 1a. |
| Links gate | PASS | First "IRS" mention is the tool disclaimer link to irs.gov/publications/p936 (200). `howItWorks` links "Internal Revenue Service (IRS) Publication 936". Advisory: the acronyms IRS and IRA first appear undefined in tool copy, before the body definitions. |
| Sentence rhythm | PASS | 69 sentences: short 10, medium 27, long 32. No violations. Max 30 words (the outputs list). |
| Depth | PASS (calculator framing page) | **1,016 words** (intro 153, howItWorks 491, FAQ 372) against the mirror's 802 (+27%). The same explainer-label note as 1a applies. |
| Numbers vs fact list | PASS | 63 numeric tokens, 0 outside the list. All match output.json: 7.19, 8,188.38, 110, 135,115.17, 322,598.79, 314,410.41, 72,807.70, 3.40, 116,226.56, 6.70, 14,210.46. |
| Page text vs tool (browser) | PASS | Labels: "Mortgage rate", "Extra cash each month", "Your expected annual return", "Tax rate on investment gains". Defaults 300,000 / 6.5 / 360 / 300 / 7 / 15 give "Paying off early ends ahead by $8,188", "Break-even return 7.19%", $322,599, $314,410, $135,115, "9 years 2 months". 5% gives +$72,808. 3% gives investing +$116,227 and 3.40%. 0% tax gives 6.70%. These match the prose. |
| Takeaway agreement | PASS | Intro rule, break-even box note, takeaway ("Based on our internal calculation, pay off early when your expected return is below the break-even…") and FAQ 1 agree. |
| Visible attribution | PASS | "In our internal calculation, we followed the same $300 a month both ways, month by month… You can check the result by changing any input." |
| TESTED claims | PASS | None. |

Findings files: `audit/biweekly-mortgage-calculator.findings.txt` and `audit/pay-off-mortgage-or-invest-calculator.findings.txt`, each with quote, defect and replacement.

---

## 2. Analysis replay

| | biweekly-mortgage-calculator | pay-off-mortgage-or-invest-calculator |
|---|---|---|
| Code / inputs reviewed | calc.py d45028bb…, inputs.json e8295c09…. All packet artifact hashes match the files. | calc.py d4c52750…, inputs.json a947d8ea…. Hashes match. |
| Fresh replay | `python3 -I calc.py audit/biweekly-mortgage-calculator-replay.json`, exit 0 | same command, exit 0, including calc.py's own assertion that break-even at 0% tax equals the effective rate |
| Replay vs output.json | byte-identical; canonical 5d51290ad1d3… | byte-identical; canonical 8f2ad54d87b8… |
| TS engine cross-check (`audit/ts-engine-crosscheck.json`, via tsx) | 5/5 cases match to the cent, 0 mismatches | 7/7 cases match, 0 mismatches |
| Boundary: 0% rate | $0 interest saved, 720 half-payments (UI "2 years 4 months sooner", "$0") | break-even 0.00%, investing ahead $177,010 |
| Boundary: $0 extra | n/a; $0 fees hide the fee row | break-even null; UI "Enter an extra amount to compare" |
| Boundary: 0% tax break-even = effective annual rate | n/a | 6.697185% vs (1+0.065/12)^12−1 = 6.697185%; 3.041596% vs 3.041596% |
| Bad input | 0 balance, 0 months or NaN return null; UI "Enter a balance and months left"; months capped at 480 | same; 0 months is handled |
| Limitation found | none | break-even bisection capped at 30%: 100% tax (or a rate of about 27% or more) shows "Break-even return 30.00%". Advisory, unrealistic inputs; suggest showing "above 30%". |
| packetSha256 (canonical) | d23722709bab… | 3b3791419a8a… |
| `audit/<slug>-analysis.json` verdict | **FAIL**. Analysis checks pass on the numbers; renderedConsistency FAIL because sentence 1 drops the 30-year condition and the route's rendered review is FAIL. | **FAIL**. All five analysis checks pass, but the decision is bound to the route's rendered review, which is FAIL. |
| `mindmap-gates.py audit-analysis` | `{"status":"FAIL","error":"Independent review has not passed"}` (exit 1, expected) | same |
| Direct helper sub-checks | `analysis()` packet and artifact hashes OK; replay digest equal; packet reader question matches the manifest | same |

Usefulness: both findings change a real choice (pay for a biweekly plan or not; prepay or invest, with tax). Neither is restated vendor fact. Sources were checked live on 2026-11-04: Reg Z 1026.36 (200) and IRS Pub 936 (200).

---

## 3. Rendered review of all 27 snapshot routes

- `rendered-review.json` sha256: 15196856d68799229a02211a4e41d87049cda87e671ca83dd4f7c440f6a1d7d6
- snapshotSha256 field: 42a7bb39c4dec02137af39e2e85b3f18d57257b6a9eba576a797e29703f51241
- snapshot file sha256: 8352361fe87546f1d5129a4c2de927ee43317b2350c184348d7e9d9e768c03f9
- Result: 21 PASS and 6 FAIL (the routes in the summary table).

**Dates (all 27):** the visible "Updated November 4, 2026" appears on every route. JSON-LD Article dateModified is 2026-11-04 everywhere, and dateModified is never before datePublished. Advisory: datePublished is also 2026-11-04 on every edited existing page. The templates fall back to `published ?? updated` (calculators/guides) or `updated` (spokes/compare), so the original publication date is overwritten. This template behaviour predates the run. Setting `published` on the edited calculators and the guide would preserve it.

**Indexability:** all 27 return 200 with no robots meta and a self-canonical. Changed internal links resolve.

**Layout:** at 390px there is no horizontal overflow and no page errors on both new pages and on 10 sampled routes (extra-payment, recast, guide, compare, inflation, florida, doordash spoke, stock, SS, probate). The new pages were also checked at 1366px. Screenshots were inspected for the tool panels at 390px.

### Whole-page coherence: specific checks

- **Guide /guides/pay-off-mortgage-early-or-invest/ vs the new calculator:** consistent. The guide's 3% loan invests ahead and its 7.5% loan prepays ahead, and the calculator's break-evens agree (3.40% at 3%; above 7.5% at 7.5%). The guide labels its gaps pre-tax. PASS.
- **Compare /compare/pay-off-mortgage-vs-invest/:** "Your mortgage rate must beat the net after-tax return" agrees with the after-tax break-even. PASS.
- **Extra-payment /mortgage/extra-payment-calculator/:** **FAIL.**
  - Its FAQ says "One extra payment a year still cuts roughly four to five years off a typical 30-year loan. A biweekly schedule does the same thing". The page's own example is 6.5% for 30 years, where the replay gives 70 months (5.85 yr). The rate sweep gives 4.1 yr at 4%, 4.7 at 5% and 5.5 at 6%.
  - Suggested fix: "One extra payment a year cuts about 5 years 10 months off a $300,000, 6.5%, 30-year loan, and about 3 years 6 months at 3%." Those figures are from the evidence replay.
  - The sources list cites "CFPB, Pay down your loan faster without a biweekly plan fee", which returns 301 to https://www.consumerfinance.gov/consumer-tools/mortgages/. It supports the common-mistake line "The CFPB notes you can get the same result for free…". The run's own sources.md recorded this as dead and left it. The fix is to replace it with a live primary source or drop the CFPB attribution.
- **Self-employment spokes (15 routes) vs the $400 floor and QBI threshold:** spoke prose consistently says the obligation "starts at $400 of net self-employment earnings". No QBI threshold figure appears in prose. Due months agree with the new note, and the quarterly page omits its self-link as designed. PASS.
  - **Exception, /self-employment-tax/how-much-to-set-aside-for-taxes/: FAIL.** The page says SE tax "is 15.3% of 92.35% of profit, an effective 14.13%, and it applies from the very first dollar of profit up to the $184,500 Social Security wage base". The tool on the same page now says no SE tax under $400 of net earnings.
  - Suggested fix: "…an effective 14.13%. Once your net earnings reach $400 for the year, it applies from the first dollar of profit up to the $184,500 Social Security wage base."
- **Inflation page vs the new rate chips:** the FAQ "The calculator does not pick a rate for you. The 3% in the tool is a placeholder" stays true, because the chips are optional presets. New tool copy "Rates below 0% (deflation) are not supported; a minus sign is ignored." uses a semicolon: **FAIL**, fix with a period. Advisory: the intro says "in the calculator above" but the tool renders below it.
- **Stock capital gains:** the new sub-line "Before this sale. This sale uses $0 at 0%; $0 left." uses a semicolon: **FAIL**. Fix: "This sale uses $X at 0%, leaving $Y." The new standard-deduction and loss-limit copy agrees with the prose.
- **Florida Amendment 3:** "approved by voters Nov 3, 2026" matches the prose and FAQ. Advisory: the prose says the tool does not model the newcomer phase-in, while a newcomer toggle now exists. The toggle keeps today's exemption, so the sentence is still literally true. PASS.
- **Social Security taxable:** new hint, W-4V and MFS copy agree with the prose. PASS. Advisory: the pre-existing disclaimer has a semicolon.
- **Probate hub /probate/:** the tool default sits inside the prose ranges. PASS. Advisories: the intro says "calculator above" (the defect F7 fixed on the spoke), and the prose range runs to $42,000 against the tool's $39,300.
- **Recast:** only the new cross-link changed. PASS.

### rendered-audit.py check output

```
$ python3 .claude/tools/rendered-audit.py check --snapshot R/audit/preview-snapshot.json --review R/audit/rendered-review.json --recapture
BLOCKED: /biweekly-mortgage-calculator/: unapproved render
EXIT=1
```

This is expected: six routes carry verdict FAIL, so the helper stops at the first one.

Freshness: before the check I refreshed the hydrated DOM with `node domcap.js http://127.0.0.1:4321 routes.json R/audit/dom-preview`. It reported 0 page errors, and the files were rewritten at 2026-11-04T20:05Z. I then ran an independent `rendered-audit.py capture --dom-dir R/audit/dom-preview` into scratch. It captured 27 complete routes with 0 failures, and **0 fingerprints changed** against the approved snapshot. The review is therefore bound to the current render.

---

## 4. The four noindex routes (outside the helper; hydrated DOM in `audit/dom-preview/` and the browser)

All four have `robots: noindex, nofollow` and a self-canonical. Visible updated date is November 4, 2026, and Article datePublished and dateModified are both 2026-11-04. The tool and ToolPicks render below the "Consult a licensed attorney" line with the Amazon Associate disclosure and rel="sponsored nofollow noopener noreferrer". The domcap refresh showed no page errors.

- **/elder-care/long-term-care-cost-calculator/: FAIL.**
  - The F6 tool changes render: no stray "$$", "Total shortfall over care period (at start-year prices) $346,464", "Total shortfall if costs keep rising $381,255", the state-factor note with the CareScout link, and the $217.00/day SNF copay in the tool, prose and FAQ.
  - The worked example describes exactly the tool's default (62-year-old, Florida, assisted living, 15 years out, 4 years of care, $2,400 + $800 income, $400,000 assets). It says "leaves a $7,040/mo shortfall, $84,500/year. Over 4 years, total shortfall projects to $360,000". Its own arithmetic gives about $338,000, and the tool shows $346,464 or $381,255 for the same case. The prose also says $528,000 and $10,240 where the tool shows $534,855 and $10,418.
  - This is an inherited contradiction in the revised shortfall answer. Fix by restating the worked example from the tool's default output.
  - Advisories: the tool sub-line prints the lowercase state ("in florida"), and the prose has "Oklahoma 0.78%" (meaning 0.78×). Both predate this run.
- **/probate/cost-vs-trust-calculator/: PASS with advisories.**
  - Intro now says "calculator below" (F7 fix). The tool shows "Plus funding the trust (retitling deeds and accounts) $500 to $2,000. Not included above or in the savings below."
  - Advisories: the intro's "net savings are $30,000-$40,000" runs above the tool's $29,650–$37,275. The worked example says "Take the calculator's default… court $600-$1,500, total $36,600-$37,500" against the tool's $400–$1,500 and $36,400–$39,300. These are inherited approximations. The trust verdict and its magnitude agree.
- **/probate/fee-calculator/: PASS with advisories.** Inherited "roughly" figures ($36,600–$37,500; $30,000–$35,000 net) differ slightly from the tool default ($36,400–$39,300; $29,650–$37,275). The direction is consistent.
- **/probate/timeline-calculator/: PASS.** The 15–30 month default matches the prose worked example. The new "Includes 3 to 6 months for real estate" line agrees with the prose ("adds 3-6 months").

---

## 5. Advisory notes (non-blocking)

1. The site-wide footer line "This never affects our rankings or editorial coverage" is a neutrality-style claim in pre-existing template copy. It is recorded for the human, not mass-edited.
2. datePublished is overwritten by the date bump on edited existing pages (template fallback).
3. The "Interactive — edit any field" badge has an em-dash. It is pre-existing template copy.
4. "The calculator" is used as a stand-in on the new pages (the mirror page has the same pattern), and "the tool" appears in pre-existing inflation and Florida prose.
5. Acronyms CFR, IRS and IRA first appear undefined in tool copy, which renders before the body definitions.
6. The payoff tool's break-even caps at 30% (shows "30.00%" for 100% tax).
7. The standards-ledger receipt must be staged with the commit.
8. C1's reader question is verb-only (no PAA or completions), a weaker premise.

## Per-page pass state

```
/biweekly-mortgage-calculator/: FIX-IN-PLACE (4) — findings.txt #1-#2 via content_gen fix; #3 run-note; #4 component edit
/pay-off-mortgage-or-invest-calculator/: FIX-IN-PLACE (3) — findings.txt #1-#2 via content_gen fix; #3 run-note
/mortgage/extra-payment-calculator/: FIX-IN-PLACE (2) — FAQ figure; dead CFPB citation
/self-employment-tax/how-much-to-set-aside-for-taxes/: FIX-IN-PLACE (1) — "$400" condition in the SE-tax sentence
/inflation-calculator/: FIX-IN-PLACE (1) — tool-copy semicolon
/stock-capital-gains-tax-calculator/: FIX-IN-PLACE (1) — tool-copy semicolon
/elder-care/long-term-care-cost-calculator/ (noindex): FIX-IN-PLACE (1) — worked-example shortfall figures
all other routes: PASS
```

All fixes change rendered output. They need a rebuild, a DOM recapture, a new snapshot and a fresh independent review before publication.

Round 1 result: FAIL (superseded by Round 2 below).

---

# Round 2: re-audit after fixes (2026-11-04, ~20:15–20:30 UTC)

**Inputs:**
- Rebuilt preview at http://127.0.0.1:4321.
- New snapshot `audit/preview-snapshot.json`: snapshotSha256 4a3caa54efd4402b8d6c95197725c29c7840b4a2efd59a2d3ca54b296a079ac5, file sha256 095f2bfd…, 27 routes, 0 capture failures, manifest unchanged.
- Round-1 snapshot kept as `preview-snapshot.round1.json`.
- Bundle `check` re-run: `delivery-complete-sources-current`.

21 routes changed fingerprint since round 1: both new pages, extra-payment, inflation, stock, and all 16 self-employment routes (the aria-label change). Six were byte-identical in semantics (guide, compare, recast, florida, probate hub, SS taxable). Their round-1 PASS evidence still applies and was re-bound to the new fingerprints.

## R2.1 New pages: all gates re-run on the exact templated text

The source text equals the fixed drafts (`drafts/<slug>.json`) for every field.

| Gate | /biweekly-mortgage-calculator/ | /pay-off-mortgage-or-invest-calculator/ |
|---|---|---|
| Round-1 findings | Fixed. Sentence 1: "On a $300,000, 30-year loan at 6.5%, biweekly payments end the mortgage about 70 months sooner." Condition sentence: "If your servicer applies each half-payment the day it arrives and charges no fee, its biweekly option saves $865.49 more than the 1/12-extra path on the example loan." Tool hint: "…yourself. Enter them if…" | Fixed. FAQ 5: "…so read the pay off mortgage vs invest comparison before you decide." (route resolves; that page's tax section covers itemizing). FAQ 6 adds "enter a lower return: at 5% on the example loan, paying off early ends $72,807.70 ahead." |
| Tee-up | PASS. `teeup-exempt:` recorded in `reports/tool-usage-pass/2026-11-04/run-notes.md` with a page-specific reason; sentence 1 is still the answer. | PASS, same. |
| Row records | PASS. run-notes: medium interactive tool → interactive tool; register operator; page type calculator page. | PASS |
| Numbers vs closed fact list | PASS (0 outside the list) | PASS (0 outside the list) |
| Em-dash / "honest" / semicolons / exclamations in page fields | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| Rhythm (script) | 69 sentences, S/M/L 14/20/35, no 10-run or 5-run violations | 70 sentences, 10/26/34, no violations |
| Depth (calculator framing page vs mirror 802) | 1,066 words | 1,048 words |
| Register, first-"we" naming, required elements, disclaimer, byline, links, naming/directives, anchor, neutrality, testing, takeaway agreement, attribution | PASS. The new sentence agrees with the takeaway and FAQ 3. | PASS. The new FAQ text agrees with the intro and takeaway. |
| Load receipt | PASS (unchanged; still to be staged with the commit) | PASS |

No new `_anti-ai-language.md` tell was introduced by the fix sentences. I checked them for antithesis, cleft, vague abstraction and unlinked directive. The FAQ 5 directive links the exact comparison page.

## R2.2 Analysis replay and audit-analysis

- **Evidence packets:** unchanged. Canonical hashes are biweekly d23722709bab… and payoff 3b3791419a8a….
- **Replay:** a fresh `calc.py` run to scratch is byte-identical to `audit/<slug>-replay.json` and to `output.json`.
- **Analysis files:** both `audit/<slug>-analysis.json` files are updated to verdict PASS, with renderedConsistency PASS on the round-2 render. They are bound to snapshot file sha256 095f2bfd90c95e5bf415fe0ead0f47e45763e8d7fc564eebe86e048709ff4063 and rendered-review sha256 ecdc62f41ff2a5e9263885c69abe7df27c528ec24f97e06cee774d15a7a2d752. The checks are mirrored at the top level, because the helper reads them there.
- **Helper output for both slugs:**
  ```
  $ python3 .claude/tools/mindmap-gates.py audit-analysis --packet R/evidence/<slug>/evidence.json --review R/audit/<slug>-analysis.json --replay-output R/audit/<slug>-replay.json
  {"status": "PASS", "scope": "Structural/artifact checks only; ..."}   (both slugs, exit 0)
  ```

## R2.3 Inherited fixes on linked and shared pages

- **/mortgage/extra-payment-calculator/: PASS.**
  - The FAQ reads "about 70 months on a $300,000 loan at 6.5%, and fewer at lower rates". This agrees with the evidence (70 months at 6.5%, 42 at 3%).
  - The source is now the CFPB key-terms page (HTTP 200, fetched 2026-11-04). Its bi-weekly entry says "You may be able to accomplish the same goal without the fee by making an extra monthly mortgage payment each year", which supports the page's "The CFPB notes…" line.
- **/self-employment-tax/how-much-to-set-aside-for-taxes/: PASS.** It now says "applies once net earnings reach $400 (Schedule SE), up to the $184,500 Social Security wage base", matching the tool's `SE_MIN_NET_EARNINGS = 400`.
- **/inflation-calculator/ and /stock-capital-gains-tax-calculator/: PASS.** The semicolons are replaced with "…not supported. A minus sign is ignored." and "This sale uses $X at 0%, leaving $Y."
- **Other tool copy:** the only remaining semicolons in tool regions are pre-existing and unchanged (recast fee hint; SS disclaimer). They stay advisory.

**Browser check at 390px**, covering both new pages, extra-payment, set-aside, inflation, stock and the uber-driver spoke: scrollWidth equals clientWidth on every page and there are 0 page errors.

## R2.4 rendered-audit check (new snapshot, all 27 routes PASS)

I refreshed the hydrated DOM first: `node domcap.js http://127.0.0.1:4321 routes.json R/audit/dom-preview` reported `{}`, meaning no page errors.

```
$ python3 .claude/tools/rendered-audit.py check --snapshot R/audit/preview-snapshot.json --review R/audit/rendered-review.json --recapture
Rendered review evidence verified
EXIT=0
```

`rendered-review.json` covers all 27 routes with the new fingerprints, verdict PASS, and evidence on all 7 checks per route.

## R2.5 Noindex routes (hydrated DOM refreshed 20:2x UTC; outside the helper)

- **/probate/cost-vs-trust-calculator/: PASS (advisory unchanged).**
  - The unlinked "Check your state's limit" directive is gone.
  - The funding row now reads "The funding range is the estimate given in How it's calculated."
  - The intro's "$30,000-$40,000" net savings is still looser than the tool's $29,650–$37,275 (advisory).
- **/probate/fee-calculator/, /probate/timeline-calculator/: PASS.**
  - The unsourced "Many family executors waive it" Texas line is removed.
  - The only remaining "waive" hits are Virginia probate-tax prose, which is pre-existing.
- **/elder-care/long-term-care-cost-calculator/: FAIL (one sentence).**
  - The corrected worked example is now internally consistent: $7,040 × 48 ≈ $338,000, and $528,000 − $153,600 ≈ $374,000.
  - The added explanation is wrong: "The calculator's figures for the same case differ slightly because it does not round the projected costs."
  - `src/lib/long-term-care-cost.ts` does round, with `Math.round` on lines 120, 125, 131, 134 and 142.
  - The real reason for the gap is the base cost. The tool uses the national 2026 assisted-living median of $68,000 × the 0.95 Florida factor = $64,600 (shown as "Cost today (annual) $64,600"). The prose projects the Florida median to $63,500.
  - FIX (Rung 1): "The calculator's figures for the same case are slightly higher because it starts from the national 2026 median ($68,000) times the 0.95 Florida factor, or $64,600 a year, rather than the $63,500 Florida figure used here."

## R2.6 Scope gap found in round 2

The orchestrator bumped two more indexable spokes to 2026-11-04 because they render the changed SelfEmploymentTaxCalculator:
- /self-employment-tax/dataannotation-taxes/
- /self-employment-tax/youtube-taxes/

They are **not in `render-manifest.json`, the snapshot or the review**. So they have no bound preview approval, and `rendered-audit.py compare` would not verify them live. `dist/` confirms they carry `data-tool="self-employment-tax"`, have no robots meta, and show visible updated date and dateModified of 2026-11-04.

I read both in the browser at 390px and found them clean:
- No overflow and 0 page errors.
- Prose is consistent with the $400 floor: YouTube says "owe self-employment tax once net earnings reach $400"; DataAnnotation says "file Schedule SE whenever your net self-employment earnings reach $400 or more".
- YouTube's "taxable income starting from the first dollar" refers to income tax and is followed by the $400 SE condition.
- Due dates match.

Even so, the content is not bound to the snapshot, the review or the live comparison. **FIX:** add both routes to `render-manifest.json` with `expectedUpdatedDate: 2026-11-04` (and add them to `routes.json` for domcap), recapture, then hand back for review. I expect to add PASS rows on the evidence above.

## R2.7 Advisories carried forward (non-blocking)

These are listed in section 5 and remain unchanged: the footer neutrality line; datePublished overwritten by the date bump; the template em-dash badge; "the calculator" as a stand-in; CFR/IRS/IRA undefined in tool copy; the payoff break-even capped at 30%; the inflation and probate-hub intros saying "calculator above"; and the ledger receipt still unstaged.

## Round 2 per-page pass state

```
/biweekly-mortgage-calculator/: PASS
/pay-off-mortgage-or-invest-calculator/: PASS
/mortgage/extra-payment-calculator/: PASS
/self-employment-tax/how-much-to-set-aside-for-taxes/: PASS
/inflation-calculator/: PASS
/stock-capital-gains-tax-calculator/: PASS
other 21 snapshot routes: PASS
/probate/cost-vs-trust-calculator/, /probate/fee-calculator/, /probate/timeline-calculator/ (noindex): PASS
/elder-care/long-term-care-cost-calculator/ (noindex): FIX-IN-PLACE (1): false "does not round" explanation
/self-employment-tax/dataannotation-taxes/, /self-employment-tax/youtube-taxes/: BLOCKED (scope): add to render manifest, recapture, review
```

Round 2 result: FAIL (superseded by Round 3 below).

---

# Round 3: re-audit after round-2 blockers (2026-11-04)

**Inputs:**
- Rebuilt preview at http://127.0.0.1:4321.
- New snapshot `audit/preview-snapshot.json`: snapshotSha256 9481589b31925ad19ef665aec781e89867c647fc5396f343b98b98d972fb3346, file sha256 69c7db54…, 29 routes, capture failures [].
- Round-2 snapshot kept as `preview-snapshot.round2.json`.
- Bundle `check`: `delivery-complete-sources-current`.

Fingerprint diff against round 2: the 27 previous routes are unchanged, and the only additions are the two new routes. This confirms the coordinator's statement that nothing else changed.

## R3.1 Elder-care worked example (noindex, hydrated DOM refreshed): PASS

The DOM now reads: "The calculator's figures for the same case are slightly higher because it starts from the national 2026 median ($68,000) times the 0.95 Florida factor, or $64,600 a year, rather than the $63,500 Florida figure used here."

- It matches `BASE_2026["assisted-living"] = 68_000` and `florida: 0.95` in `src/lib/long-term-care-cost.ts`.
- It matches the tool's "Cost today (annual) $64,600" and is directionally correct ($346,464 > $338,000; $381,255 > $374,000).
- "does not round" is gone from both the DOM and the source.

## R3.2 New review rows: /self-employment-tax/dataannotation-taxes/ and /self-employment-tax/youtube-taxes/: PASS

| Check | Result |
|---|---|
| Status, indexability, canonical | HTTP 200, no robots meta, self-canonical |
| Dates | Visible "Updated November 4, 2026"; Article datePublished and dateModified both 2026-11-04. The bump is justified because the shared tool changed. |
| Shared tool | Renders the changed self-employment calculator: 2026 due-date note, under-$400 note, Form 7206 note, Head of household aria-label |
| Affiliate block | ToolPicks with the Amazon Associate disclosure |
| Tool copy | No semicolons |
| Testing claims | None |
| Prose vs $400 rule | DataAnnotation: "you must file Schedule SE whenever your net self-employment earnings reach $400 or more". YouTube: "taxable income starting from the first dollar" (income tax), then "owe self-employment tax once net earnings reach $400". Both agree with the tool. No "first dollar of profit" SE claim. |
| Layout | 390px: no overflow, 0 page errors |

## R3.3 rendered-audit check (29 routes, all PASS)

I refreshed the hydrated DOM first: domcap reported `{}`, meaning no page errors.

```
$ python3 .claude/tools/rendered-audit.py check --snapshot R/audit/preview-snapshot.json --review R/audit/rendered-review.json --recapture
Rendered review evidence verified
EXIT=0
```

`rendered-review.json` sha256 is d2ab58c9fc664e6157acf7dfee3af09c931d6086d91374c6b403ee1d90cedd95. Its rows carry the round-2 evidence for the 27 unchanged routes, re-bound to the new snapshot, plus the 2 new rows.

## R3.4 audit-analysis

Both `<slug>-analysis.json` files are re-bound to snapshot file sha256 69c7db54… and review sha256 d2ab58c9…. The packets and replays are unchanged and still byte-identical.

```
biweekly-mortgage-calculator:          {"status": "PASS", ...}  exit 0
pay-off-mortgage-or-invest-calculator: {"status": "PASS", ...}  exit 0
```

## R3.5 Remaining advisories (non-blocking, unchanged from round 2)

- Footer neutrality line (pre-existing template).
- datePublished follows the template's updated-date fallback.
- Template em-dash badge.
- "The calculator" used as a stand-in.
- CFR/IRS/IRA undefined in tool copy.
- Payoff break-even capped at 30%.
- Inflation and probate-hub intros say "calculator above".
- Cost-vs-trust intro savings range is looser than the tool's.
- The standards-ledger receipt must be staged with the commit.

## Round 3 per-page pass state

```
All 29 snapshot routes: PASS
Noindex /elder-care/long-term-care-cost-calculator/, /probate/cost-vs-trust-calculator/, /probate/fee-calculator/, /probate/timeline-calculator/: PASS
```


VERDICT: PASS
