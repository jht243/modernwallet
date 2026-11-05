from pathlib import Path
import json,hashlib
r=Path('reports/mindmap-pass/2026-11-04-aca-snap');s=json.loads((r/'final-snapshot.json').read_text());own=json.loads((r/'audit/reviewer-approved-snapshot.json').read_text());author='benefits_final_reviewer'
assert s['snapshotSha256']=='dcb58a71da4487025e6b14de11b3aa66e24dee6bc5a28511deee81f0e98518e3'
assert {x['path']:x['fingerprint'] for x in s['routes']}=={x['path']:x['fingerprint'] for x in own['routes']}
def file_ref(p):return {'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
def digest(v):return hashlib.sha256(json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
# Each evidence statement below records this reviewer's completed observations, not a worker verdict.
notes={
'/':[
'Only the budget category count changes from5 to7; the two additional budget spokes explain it. The rest of the home reader path is unchanged against published850b. See reviewer-all-route-comparison-v2.json.',
'The seven-tool count matches the budget registry and the seven-card budget hub; no acquisition or traffic uplift is asserted.',
'No testing or professional-review claim is introduced by this count-only change; the established site identity is retained.',
'Home canonical and structured data are intact, with no new article date or freshness claim; captured parsing reports no failures.',
'The Budget category card still reaches /budget/; every internal target resolves in the candidate output. Navigation is unchanged.',
'Independently visited at1280 and390px; zero horizontal overflow or page errors. Home card grid screenshot was visually inspected in audit/final-browser/homedesktop.png.',
'Count-only existing-page scope. The independent1,089-to1,094 route comparison found no removals or unrelated changed routes.' ],
'/budget/':[
'Existing budget explanation/tool remains unchanged; exactly the SNAP and ACA spoke cards are added. Hydrated default income5000/plan4800 is coherent and independent browser capture is complete.',
'New labels correspond to the two actual local deterministic tools, with ordinary free/instant card wording and no eligibility or benefit-award promise.',
'No TESTED label or new experience claim is added. The original author and existing June25 update date remain unchanged for this collection/card-only change.',
'Selfcanonical /budget/, structured data and original collection date remain intact. New tool article dates are on their individual routes.',
'Both new card links reach their exact canonical budget spoke paths; SNAP/ACA casing is correct and all internal destinations exist.',
'Desktop budget tool/grid screenshot was visually inspected; new cards wrap correctly. Own390px capture has no page overflow or code errors; existing calculator remains usable.',
'Only two approved cards are added; no header/nav expansion, unrelated budget prose rewrite or new backend. Existing source provenance remains unchanged.' ],
'/calculators/':[
'The all-calculators listing adds the same two budget spokes and preserves its remaining groups. The independent baseline comparison isolates those two card insertions.',
'Both entries map to real implemented tools rather than placeholders, with source-supported program names and no invented result figures.',
'No executed-product testing, tested badge or new professional-review attribution is asserted by these index cards.',
'The all-calculators canonical/structured data remain intact; no date was stamped on unchanged index prose.',
'Both uppercase SNAP/ACA cards link to the new canonical /budget/ routes. Mechanical checks resolve every internal destination.',
'Own desktop/mobile full-page capture completed without page/console errors or390px overflow. The changed LinkCard variant matches the visually inspected budget grid.',
'Only the approved budget-spoke listing changes; the CALCULATORS navigation registry was not expanded with new hubs.' ],
'/compare/':[
'Two comparison cards are inserted in the existing listing. Their identities correctly distinguish SNAP/WIC and Marketplace/Medicaid; the remaining comparison cards are unchanged.',
'Card subjects/title promises match the reported-source comparisons and their implemented five-criterion tables; neither card promises a universal coverage winner.',
'New program comparisons use ordinary source-based presentation; no tests, credentials or professional review are invented.',
'Comparison-index canonical and schema remain valid with no artificial article-date bump.',
'New cards target /compare/snap-vs-wic/ and /compare/aca-vs-medicaid/ directly; all internal destinations resolve.',
'Own desktop and390px browser captures show a working card listing with no horizontal overflow, page errors or console errors. Long source program labels remain in the normal existing card layout.',
'Exactly two approved comparison cards are added; unrelated Medicare/Medicaid content is neither used as a source nor rewritten.' ],
'/guides/':[
'Only the new food-stamps guide card is inserted. Its text names the state application, dated confirmation, interview/proof and conditional expedited route; those match the six-step guide.',
'The guide card now truthfully reads1 tool and6 application steps, matching its one budget-tool link and actual six-step procedure; it does not promise guaranteed seven-day approval.',
'The card makes no product-test or fabricated client-experience claim; the destination uses ordinary sourced process guidance.',
'Guide-index selfcanonical/schema are intact, with no index freshness-date churn.',
'The new card reaches /guides/how-to-apply-for-food-stamps/ directly and its tool link is the existing household budget calculator; internal links resolve.',
'Own desktop/mobile guide-index captures completed with zero page/console errors and no390px overflow. The new card uses the established guide-card variant.',
'One approved guide/card is added. No application form, SSN collection, lead portal or unrelated guide rewrite is introduced.' ],
'/budget/household-budget-calculator/':[
'The entire existing budget path was read. The two additions keep restricted food benefits separate from cash income and point child-food-cost readers toward SNAP/WIC; existing calculator examples remain coherent.',
'The SNAP-only-eligible-food statement is supported by USDA food rules. The comparison link makes no blanket eligibility or enrollment promise. Existing unrelated budget guidance is preserved.',
'Only two contextual links/date are new; no testing attribution is added. Jonathan Velez remains the original byline.',
'Independently compared baseline and final Article dates: published2026-06-25 preserved, modified2026-11-04. Sitemap lastmod remains absent as before; see reviewer-dates-sitemap.json.',
'Exact approved anchors estimate SNAP food benefits and compare SNAP and WIC point to the two correct routes; every internal target resolves.',
'Own desktop/mobile capture hydrated the existing7500-income/7450-plan tool without page/console errors or390px overflow; the short link additions render inside their intended paragraphs/list item.',
'Baseline prose delta contains exactly two approved new sentences plus the visible date change; no unrelated body or metadata edit. See reviewer-existing-prose-deltas.json.' ],
'/guides/how-to-budget-with-irregular-income/':[
'The complete existing guide was read. The sole new health-insurance sentence fits its annual-income/Marketplace update advice and points readers to conditional credit math and the Medicaid distinction.',
'The linked targets explain all nonfinancial conditions and state/category variation. The source section does not promise that every freelancer receives a subsidy.',
'No testing/experience or professional credential is introduced; the established writer byline remains unchanged.',
'Baseline/final Article published2026-06-25 is preserved while modified becomes2026-11-04; sitemap lastmod remains absent as before.',
'Exact approved anchors estimate a federal premium credit and compare Marketplace coverage with Medicaid resolve to N2/N4; other internal destinations also exist.',
'Own desktop/mobile full-page capture shows the contextual sentence in the health-insurance section, with no page/console errors or390px overflow.',
'Baseline prose comparison contains only the approved link sentence and date. The historical tax-percentage inconsistency is unrelated to the revised coverage decision and was retained as an advisory.' ],
'/guides/how-to-make-a-budget/':[
'The full four-step budget guide was read. The new SNAP application link stays within the income/benefit-statements step and does not alter the four-step method or turn food benefits into a filing confirmation.',
'The official-application destination gives the required state-specific mechanism and explicitly separates restricted food benefits from cash budgeting; the source guide defines take-home pay as money landing in the account.',
'No product-test or invented personal/program-use experience is added to this existing guide.',
'Baseline/final published2026-10-20 is preserved; modified changes from2026-10-29 to2026-11-04. Sitemap lastmod remains absent, consistent with link-only policy.',
'Exact approved SNAP application steps anchor points to N5 in the first budget step. All internal destinations resolve.',
'Own desktop/mobile capture shows the link as part of the first step; four-step structure, tables and FAQs remain intact, with no390px overflow or browser code errors.',
'Only the approved new sentence and date differ from published baseline prose. No budget method, metadata experiment or unrelated author work is imported.' ],
'/budget/snap-benefits-calculator/':[
'The complete tool/article/FAQ/source/footer path agrees on a base formula before eligible minimums, conditional state eligibility and full-month FY2027 scope. The corrected U.S. Virgin Islands paragraphs are intact; all original findings are retained under audit/.',
'FY2027 USDA allotments/deductions and federal method support766/826 worked cases. Fresh reviewer replay and552 independent Decimal cases cover zero/high income, shelter cap, medical threshold, minimum and suppression behavior.',
'Visible ModernWallet calculation attribution names our hypothetical cases and inspectable worked table. No TESTED or clinical/professional-review claim appears; reused site byline and final financial notice are truthful.',
'Selfcanonical and Article/FAQ/WebApplication schema are consistent; published/modified2026-11-04 and visible update date agree. Source body2185 exceeds1200.',
'Two approved inbound sources plus relevant budget links exist; first-source citations and law link work. Every internal destination resolves; sitemap lists this canonical once with Nov4 lastmod.',
'Own browser observed766 default,826 with higher shelter, high-net suppression, conditional25 minimum, invalid inputs and region errors, keyboard Tab and actual clipboard/download.390px layout/table were visually inspected; abbreviation-only refresh passed.',
'Scope is1–8 members, contiguous48/DC, FY2027; no eligibility award, first-month proration, state supplement or unsupported product test. Inputs stay local; inspected tracker transmits event metadata rather than field values.' ],
'/budget/aca-subsidy-calculator/':[
'The whole article/tool/FAQ path agrees on benchmark-minus-contribution capped by eligible enrollment premiums, conditional nonfinancial eligibility and2027 coverage using2026 FPL. The worked cases and closing next action retain all conditions.',
'IRS2027 percentages, FPL and PTC Q26 support268.85 credit/281.15 premium,400% inclusive262.80 and the100 cap example.552 Decimal cases reproduced the corrected exact133% income boundary; IRS Q31 supports uncapped post2025 repayment.',
'Visible attribution accurately describes hypothetical calculations with inspectable formula/table. It does not claim insurance product testing, local plan quotes, professional review or guaranteed subsidy eligibility.',
'Article/FAQ/WebApplication schema, canonical and visible date match published/modified2026-11-04; source body2617 exceeds1200.',
'Approved budget/irregular-income inbounds and budget outbounds resolve; official IRS/HealthCare.gov deep links support action instructions. Canonical appears once in sitemap with Nov4 lastmod.',
'Own browser verified unknown/invalid/excluded withholding, confirmed268.85/281.15, exact133%,400%/one-cent-above and100 premium cap. Actual copy/download includes full program and MAGI names; keyboard/mobile390 checks and table inspection passed.',
'Only federal planning math for1–8 contiguous48/DC. No ZIP quote database, national Medicaid verdict, state subsidy, cost-sharing estimate, backend or empirical product-testing claim.' ],
'/compare/snap-vs-wic/':[
'The full five-row table and surrounding decision path consistently distinguish household SNAP groceries from WIC participant foods/services, allow both only when qualified, and retain the remaining WIC category/local assessment requirements.',
'USDA SNAP/WIC eligibility/food/benefit sources and California WIC support the table, different household definitions and conditional documents. USAGov supports food-stamps terminology. No arbitrary dollar score or clinical recommendation is added.',
'Reporter register names external sources rather than inventing tests or client experience. No TESTED badge or professional-review credit appears; the final educational notice and ordinary byline are present.',
'Canonical/Article/FAQ schema and visible November4 date agree; new Article dates both2026-11-04. Source body2220 exceeds1500.',
'Approved comparison-index/household-budget inbounds and two relevant budget outbounds resolve. Source citations and both official agency locators are present; sitemap contains this route once.',
'Own browser inspected the complete three-column/five-row table at390px, valid TOC anchors and FAQ expansion with zero code errors/overflow. Raw bold markers are gone; the fresh Oct.1/Sept.30 paragraphs keep dates together.',
'No universal winner, medical advice, cash/diaper promise or automatic WIC enrollment. The California document example is conditional; no actual program participation or testing is asserted.' ],
'/compare/aca-vs-medicaid/':[
'The whole law/private/public distinction, five-row table, exceptions, FAQs and conditional takeaway agree. The final changed sentence now says denial/limited-benefit paths can lead to different savings outcomes rather than guaranteeing three distinct answers.',
'HealthCare.gov/IRS support full-benefit versus limited-benefit coverage, state/category rules, MAGI scope,2027 work-denial restriction and IRS timing exception. Official NYC and federal expansion supplements support only the naming and conditional gap FAQs. Source-guard adjudication is saved honestly.',
'Reporter source-based comparison, not empirical insurance testing. The no-universal-winner takeaway follows the approved decision criteria and named exceptions; no professional credentials or review dates are fabricated.',
'Selfcanonical, Article/FAQ schema and visible date agree on2026-11-04; source body2402 exceeds1500. Immigration/status conditions are scoped to noncitizens with state pregnant/child exceptions preserved.',
'Approved comparison-index/irregular-income inbounds, budget outbounds and official eligibility/update links resolve. Both supplemental source citations are visible; sitemap includes the canonical once with Nov4 lastmod.',
'Own desktop/mobile browser checked the five-row table, six TOC anchors and FAQ behavior with zero code errors or390px overflow. The final one-sentence qualification was independently compared; subsequent normalized text is identical.',
'No insurer ranking, national Medicaid calculator, clinical advice or universal winner. Current coverage is ended only after replacement confirmation; limited-benefit, initial-assessment and work-denial distinctions remain explicit.' ],
'/guides/how-to-apply-for-food-stamps/':[
'The whole six-step process, document-purpose table, status/action table and FAQs distinguish filing, interview, verification, notice, expedited review and recertification. The blanket non-agency-form invalidity claim and research-absence narration are removed.',
'USDA/USAGov support residence-state filing, interviews/proof, ordinary30-day and conditional7-day timing,90-day fair hearing and notices. Document records are preparation rather than a universal mandatory list; phone filing is referred to the state agency.',
'Official-process operator page has the approved tee-up exemption and attributes agency rules. No personal enrollment, product testing, professional review or invented client record is claimed; final notice and standard byline are present.',
'Selfcanonical, Article/FAQ schema and visible modified date agree on2026-11-04, also its publication date; source body1918 exceeds1200. Fresh Oct.1/Sept.30 contexts now remain in complete paragraphs.',
'Approved guide-index/make-a-budget inbounds and two budget outbounds resolve. State directory, source agency and linked current-rule update notice are real primary destinations; sitemap includes this canonical once.',
'Own browser observed two readable tables, seven valid contents anchors and working FAQ expansion, no code errors and no390px overflow. The guide-card count is now1 tool/6 application steps; fresh paragraph refresh passed.',
'No SSN form, application collection, case-status portal or filing claim. The linked notice truthfully says work/noncitizen guidance is being updated. Restricted food benefits remain separate from cash income.' ]
}
keys=['wholePageCoherence','sourceSupport','testingAndAttribution','datesAndSchema','linksAndIndexability','renderedLayout','scopeAndExclusions'];assert set(notes)=={x['path'] for x in s['routes']}
review={'reviewer':author,'snapshotSha256':s['snapshotSha256'],'verdict':'PASS','sourceBinding':file_ref(r/'internal/selected-source.json'),'independentBrowserSnapshot':file_ref(r/'audit/reviewer-approved-snapshot.json'),'instructionBundles':[str(r/'preflight-final-review'),str(r/'preflight-final-local')],'routes':[],'advisories':['Unrelated historical style and footer-neutrality wording on retained legacy routes was not rewritten or certified as new evidence; no such claim is present on the five new pages.','The pre-existing tax-percentage inconsistency in the irregular-income guide is unrelated to its revised benefits link context.'],'history':'Original FAIL/FIX receipts and counters remain under audit/. N1 retains three fix rounds and narrow substantive reworks1–2; the second corrected its measured sentence rhythm. N5 retains fix3 for its hearing-sentence rhythm repair. The superseded PASS and withdrawn FAIL are preserved. Corrected abbreviation-aware all-five measurement passes with the N3 noun-list non-sentence candidate explicitly retained in audit/final-rhythm.json; no review history was reset. The ordinary editorial workflow applies, without client/upsell release exceptions.'}
for x in s['routes']:
 assert not x['failures']
 review['routes'].append({'path':x['path'],'fingerprint':x['fingerprint'],'verdict':'PASS','checks':{key:{'status':'PASS','evidence':ev} for key,ev in zip(keys,notes[x['path']])}})
(r/'final-render-review.json').write_text(json.dumps(review,indent=2)+'\n')
analysis={
'snap-benefits-calculator':[
'An adjustable deduction breakdown answers the approved amount question. The766/826 comparison and minimum/suppression cases show why maximum allotment alone is insufficient; the final base-formula wording avoids treating the minimum as an arithmetic error.',
'Inspected USDA FY2027 constants and eligibility method; independently executed calculate.py into reviewer-replay.json and compared its output. Separate552-case Decimal replay found and corrected a genuine ACA boundary issue; SNAP cases matched. Public worked inputs and assumptions are visible.',
'Checked zero income, high net, eligible small-household minimum, shelter cap and age/disability medical cases. Amounts are conditional on state eligibility,1–8 contiguous48/DC and full-month FY2027; source changes, deductions and first-month rules can alter the answer.',
'Final rendered route matches the reviewed tool/default766/table826 and clarified minimum semantics. Own browser tested controls, errors, clipboard and downloaded full-name result. Refer to final-render-review.json and the matching independent snapshot.',
'Financial/program arithmetic is ordinary calculated evidence, not a product test or professional benefits determination. Approved case matches were rejected because they do not establish ModernWallet program experience; no client/clinical claim appears.' ],
'aca-subsidy-calculator':[
'Benchmark/contribution/enrollment cap and conditional eligibility resolve the approved calculation question. The268.85 case,400% boundary and100 premium cap materially explain how inputs change federal assistance without fabricating local quotes.',
'IRS2027 percentage bands/2026FPL and PTC Q26 inputs were inspected. Fresh calculate.py replay matches creator output; independent552-case Decimal comparison reproduced the corrected133% income-path boundary and all stated examples.',
'Checked100/400 endpoints, one-cent-above exclusion, unknown/excluded conditions, low benchmark, enrollment cap and tobacco benchmark/enrollment distinction. Household/region/year limits and no tax reconciliation/state subsidy are explicit; IRS Q31 repayment warning remains.',
'The final article, worked table and tool agree on268.85/281.15 and conditional withholding. Actual independent browser copy/download includes full ACA and MAGI names; the exact final fingerprint is in final-render-review.json.',
'Calculated planning evidence does not enable TESTED labels or professional eligibility advice. No fabricated insurer trial, local rating database or client history; unrelated retrieved case records were appropriately rejected.' ],
'snap-vs-wic':[
'The useful synthesis maps SNAP household benefits to possible WIC income eligibility while preserving category/assessment requirements. The five-criterion table and household-definition contrast support whether one or both official applications make sense.',
'Independently inspected USDA SNAP/WIC eligibility/benefits and California WIC documents plus USAGov terminology. Source-to-claim reasoning is reported, not numerical or empirical. The packet correctly avoids arbitrary scores; rejected client/fleet matches have no relevant ModernWallet program-use evidence.',
'No WIC-category member changes the next step; qualifying households can apply to both but SNAP does not automatically enroll them. Local documentation/assessment, participant age and household definitions limit the result. No numeric replay is appropriate for these sourced distinctions.',
'The final complete render contains the supported five-row table, source links and conditional takeaway. The actual mobile table/FAQ/contents behavior and repaired date paragraphs were independently checked and are bound to the final snapshot/review.',
'Ordinary reporter policy comparison; no clinical advice, product test, diaper/cash promise, invented professional review or client experience. Saved case-selection rejections preserve ownership and scope.' ],
'aca-vs-medicaid':[
'The law/private/public distinction and eligibility-first decision rule answer the approved query. Full-benefit, limited-benefit, ordinary denial and2027 work-denial rules explain why declining Medicaid does not freely substitute subsidized private coverage.',
'Inspected HealthCare.gov/IRS and the two official FAQ supplements. The NYC source is limited to the Obamacare naming fact; the federal expansion source supports a conditional non-expansion gap. Three guard doubts plus the no-universal-winner takeaway have evidence-bound adjudications; the overstrong outcomes sentence is corrected.',
'State/category income differences, noncitizen/status conditions, limited-benefit coverage, the IRS initial-assessment exception and replacement-coverage timing are retained. The conclusion is conditional and uses an official household-member result; no fabricated premium average or numeric ranking is needed.',
'The final full render includes the corrected conditional outcomes sentence, source-supported CHIP may statements, official citations and all material exceptions. Its exact fingerprint is approved in final-render-review.json; own browser checked table/TOC/FAQ/mobile layout.',
'Ordinary source-reported comparison, not medical advice, empirical insurance testing or professional service review. The approved brief excludes a universal winner and a national Medicaid calculator. Retrieved unrelated cases remain rejected with their actual reasons.' ],
'how-to-apply-for-food-stamps':[
'The six-step state application mechanism plus two practical tables completes the reader task beyond a directory link. It separates filing, proof, interview, notice and recertification, and routes urgent need to conditional expedited review.',
'USDA/USAGov sources support the application sequence and timing. The packet was honestly narrowed after removing the unsupported blanket third-party-form assertion; the original packet is preserved. No national mandatory document list or national phone-filing claim is invented.',
'State submission channels and requested proof vary; expedited7-day processing is conditional, ordinary timing is generally30days, and the agency determines eligibility/award. The work/noncitizen notice is explicitly still being updated. This is reported process synthesis, so no artificial numerical experiment is needed.',
'The final guide preserves the six steps, preparation/status tables, exact source links and restricted-food-benefit budget distinction. Own browser checked both tables, seven contents anchors and FAQ behavior, with fresh intact date paragraphs; final snapshot/review bind the exact result.',
'Operator process voice uses the recorded tee-up exemption. No SSN/application collection, case access, personal enrollment/test experience or professional credential is claimed. Unrelated case matches were rejected; state agencies remain the decision makers.' ]}
a_keys=['usefulness','sourceAndAssumptions','conditionsAndCounterexample','renderedConsistency','localExclusions']
for slug,evidence in analysis.items():
 packet_path=r/'evidence'/slug/'evidence.json';packet=json.loads(packet_path.read_text());out={'reviewer':author,'verdict':'PASS','packetSha256':digest(packet),'renderedSnapshot':file_ref(r/'final-snapshot.json'),'renderedReview':file_ref(r/'final-render-review.json')}
 for key,ev in zip(a_keys,evidence):out[key]={'status':'PASS','evidence':ev}
 if packet['basis'] in ['calculated','modeled']:
  replay=r/'evidence'/slug/'reviewer-replay.json';out['replaySha256']=digest(json.loads(replay.read_text()));out['replayArtifact']=file_ref(replay)
 (r/'evidence'/slug/'analysis-review.json').write_text(json.dumps(out,indent=2)+'\n')
print('Wrote13 evidence-specific rendered decisions and5 final analysis receipts for',s['snapshotSha256'])
