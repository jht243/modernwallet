# Phase 4 report: podcast recovery 2026-11-04 (themodernwallet.com)

Reviewer: phase4-reviewer-1 (independent; did not write the pages). Instruction bundle: preflight-audit2, 33/33 parts read, `workflow-preflight.py check` = delivery-complete-sources-current. Evidence: live primary sources fetched 2026-11-04 (IRS Topic 409, Pub. 550, Rev. Proc. 2025-32, Schedule D instructions, Pub. 969, Rev. Proc. 2025-19, Pub. 527, Fannie Mae B2-1.3-03), independent replays of both `run.py` scripts, the complete rendered text of all 8 routes, and a fresh recapture (fingerprints identical to rendered-snapshot.json).

## Verdicts

| Page | Verdict | Blocking findings | Body words (floor 1,200) | Rhythm | Headline fields |
|---|---|---|---|---|---|
| /guides/tax-loss-harvesting/ | FAIL | 16 (T1 to T8) | 1,828 | pass (advisory: 64% long) | FAIL (3 tells) |
| /guides/hsa-triple-tax-advantage/ | FAIL | 17 (H1 to H9) | 1,776 | pass | FAIL (4 tells) |
| /guides/brrrr-method/ | FAIL | 11 (B1 to B8) | 2,302 | FAIL (sentences 106-115 monotone) | pass |
| /guides/tax-tips/ | PASS | 0 | n/a (link-only) | n/a | n/a |
| /guides/wash-sale-rule-explained/ | PASS | 0 | n/a | n/a | n/a |
| /compare/hsa-vs-fsa/ | PASS | 0 | n/a | n/a | n/a |
| /compare/cash-out-refinance-vs-heloc/ | PASS | 0 | n/a | n/a | n/a |
| /compare/reit-vs-rental-property/ | PASS | 0 | n/a | n/a | n/a |

Depth distribution (new article pages, measured with `wc -w` first and last): passing 3 / failing 0 / median 1,828 words against the 1,200 floor (52% above the floor; no "barely clears" finding).

Gates that pass on all three new pages: replay (both run.py outputs identical to saved output.json; every page figure matches), provenance wording (internal modeling only on TLH and BRRRR with inputs beside it; HSA third-person reported; no "we tested", no client claim, no byline in prose, "At ModernWallet, we" once), 75% LTV and 2% cost read as assumptions, $40,000 absent from every headline field and the BRRRR intro, intent (answer in the opening sections, on-topic PAA in FAQ, off-topic PAA absent, "Do I get $3,000 back" answered as a deduction), takeaway agrees with intro, tables and FAQs, "who this is not for" and "what would change our answer" present, no disclaimer at the top, canonical, JSON-LD (dateModified = datePublished = 2026-11-04, FAQPage), visible date, sitemap includes all three routes, tables render as `<table>` inside an overflow wrapper, all external links on allowed-urls.txt and markdown-only, all internal links resolve to built routes.

Verified live (no discrepancy): Rev. Proc. 2025-32 section 3.03 (all eight 0% and 15% ceilings); Rev. Proc. 2025-19 ($4,400, $8,750, $1,700, $3,400, $8,500, $17,000); Topic 409 ($3,000/$1,500 lesser-of, line 16, line 7a, 28%/25% maxima); Pub. 550 (wash-sale list, IRA exception, Example 1, line 16); Schedule D carryover worksheet; Pub. 969 (all HSA rules cited); Pub. 527 (27.5/30 years, 3.182%, $5,091, July 5 example); Fannie Mae B2-1.3-03 dated 12/10/2025 (12-month, six-month, listing, delayed financing; no mention of repairs, so "Fannie Mae does not address repair spending" is accurate). Generator flags: TLH '8500' was removed by the claim check and is not on the page; BRRRR '0.75' (labeled assumption), '0.98' (1 minus the 2% cost), '10000' (the appraisal step), '32585' (262,585.03 minus 230,000) and '7350' (10,000 x 0.75 x 0.98) are correct model arithmetic.

meta.guards schema flags (missing metaTitle, subtitle, cta fields, faqItems; "emptied" sections): confirmed noise. Every section body is non-empty in the drafts, in src/data/guides.ts and in dist.

## Decision needed from the orchestrator (not a defect in the generated prose)

Date policy on the five link-only routes. The approved plan (readiness.md, chart-review PASS) edits tax-tips, wash-sale-rule-explained, hsa-vs-fsa, cash-out-refinance-vs-heloc and reit-vs-rental-property without bumping "updated". `phase-4-audit.md` "Updated-page date-bump rule" says any rendered change (internal links included) needs the date bump and calls a stale date a hard fail; `_rendered-page-audit.md` allows a documented date-policy exception. I passed the five routes under that documented exception because the dates are unchanged, equal to dateModified, and consistent with the approved plan, and because bumping /compare/hsa-vs-fsa/ would label a page "Updated November 4, 2026" while it still shows 2025 limits ($4,300/$8,550). If the orchestrator would rather bump, change `updated` on the five entries (src/data/guides.ts tax-tips and wash-sale; src/data/comparisons.ts three entries), rebuild, recapture and have the five routes re-reviewed. Either way record the choice.

## Required fixes, in order (each tied to the exact draft section; apply with `content_gen.py fix` using each page's findings file, then Rung 0 mechanical edits where marked)

Full quote, defect and suggested replacement for every item are in `<slug>-findings.txt`. Every replacement must only restate the closed fact list or delete. Two items need a fact-list correction first (marked FACTS); the orchestrator should make those edits to the row prompt or choose the deletion alternative given in the findings file. After the fixes the three pages must be rebuilt, recaptured, re-reviewed in full, and the analysis files regenerated (any content change voids this review).

### 1. /guides/hsa-triple-tax-advantage/ (draft hsa-triple-tax-advantage.json)

1. H1, mechanical (Rung 0): sections[0], sections[2], sections[5] list items. Delete the paired `**` markers from all 10 bold-label list items. The renderer shows them literally (20 asterisks in the rendered text). Quote: `**Contributions:** Publication 969 says you can deduct contributions`. Labels stay as plain "Contributions:" text.
2. H2 and H2b, sections[0] table row 2 and the paragraph under the table. Quote: `Spouse rules in Publication 969` (a deferral in a data cell) and `We do not add the $1,000 to the family limit here, because Publication 969 has separate rules for spouses.` Fact list supports: F6 (the $1,000 increase applies to an eligible individual age 55 or older). Replace the cell with "$1,000 for each eligible individual age 55 or older (no family total shown)" and link IRS Publication 969 in the sentence. FACTS (optional): to state the spouse rule itself, add the Pub. 969 sentence "If both spouses are 55 or older and not enrolled in Medicare, each spouse's contribution limit is increased by the additional contribution."
3. H3 and H9, sections[6] "Our Takeaway" paragraph 1 and faqs[5] "Is an HSA worth it?". Quote: `An HSA is worth opening for an eligible person on a qualifying HDHP who can pay current medical bills from other cash and let the HSA balance carry over or be invested.` Problem: the same section says the answer rests on Pub. 969 and Rev. Proc. 2025-19, and neither says anything about investing or paying bills from other cash; F19 lists the investment menu as not covered. Fact list supports: F3, F16 (tax-free medical withdrawals, unspent amounts carry over), F13. Restate without the other-cash and invested conditions (replacements in the findings file). Remove "or is invested" from the FAQ the same way. Also remove the same words from evidence.json takeaway and the row prompt if the page is regenerated.
4. H5, H5b, H5c, H5d, H5e (meta-narration): introText sentence 3 ("so this page gives the exact 2026 dollar limits"), sections[4] last sentence ("This page sticks to HSA rules, ..."), sections[5] opening ("This explainer covers ... as we read them") and "The figures on this page do not fit three readers.", sections[6] paragraph 2 ("which this page does not cover"). Replace as listed in the findings file; delete the restating sentence in sections[4]; route state tax to a tax professional.
5. H5c, sections[5] bullet list: the six fragments are raised and not routed ("The 'adult child' coverage question" is also unexplained jargon). Collapse into the one sentence in the findings file; delete the adult-child bullet.
6. H6, sections[1] paragraph 3. Quote: `Readers near Medicare enrollment can see what help exists in our Medicare Savings Programs guide.` Replace with a concrete anchor sentence ("... explains how your state can pay your Part B premium if you qualify"; verified against the linked guide's first paragraph, so add it to the fact list or delete the sentence).
7. H7, sections[1] paragraph 3. Quote: `The Medicare rule reaches back in time.` Replace with "The Medicare rule can apply to earlier months."
8. H8, sections[1] paragraphs 4-5. Quote: `That choice comes with a testing period.` The term is never defined. FACTS: add Pub. 969 "the testing period begins with the last month of your tax year and ends on the last day of the 12th month following that month" and restate; or delete both sentences.
9. Headline fields (H4, H4b, H4c, H4d): sections[0].heading "What the HSA Triple Tax Advantage Is and the 2026 Limits" to "HSA Triple Tax Advantage Limits for 2026"; sections[4].heading "Compared With" to "Compared with" (mechanical); cardBlurb tricolon to the one-claim version in the findings file; title to "The HSA Triple Tax Advantage Allows $4,400 Self-Only in 2026" (60 characters; carried chart-review advisory).
10. Advisory, optional: HA1 broaden F11 (last-month rule applies to any eligible individual on December 1), HA3 trim FAQ 3, HA4 heading "Where the Three Tax Breaks End".

### 2. /guides/tax-loss-harvesting/ (draft tax-loss-harvesting.json)

1. T4, FACTS then sections[3] paragraph 2. Quote: `A purchase of substantially identical stock by your spouse, or by a corporation you control, after your sale also creates a wash sale.` Pub. 550 says "If you sell stock and your spouse or a corporation you control buys substantially identical stock, you also have a wash sale"; it does not say "after your sale". Correct F13 and delete "after your sale".
2. T3, sections[4] list item 1. Quote: `Your long-term gains fall under the 2026 0% ceiling for your filing status, so the loss cancels gains that carried no federal tax.` F7: the ceiling is on taxable income, including the gain. Replacement in findings file.
3. T6, sections[0] paragraph 2. Quote: `The loss cancels capital gains.` follows the personal-use-property sentence and reads as the wrong loss. Replace with "A capital loss on an investment cancels capital gains."
4. T1, T1b, T1c, T1d, T1e (page self-reference and dead-ends): introText sentence 2 ("this page works the dollar figures"), sections[1] last sentence ("which this page does not model"), sections[2] last sentence ("this page does not cover them"), sections[4] scope paragraph ("This page covers sales ... this guide does not address losses inside those accounts") and the omissions paragraph ("State tax treatment, the net investment income tax, broker reporting ... not covered ... Our tax tips guide covers other year-end moves."). Replace as listed; route to a tax professional and to /guides/wash-sale-rule-explained/ for broker reporting across accounts (F20 points there).
5. T2, sections[3] paragraph 4. Quote: `When the repurchase is for an IRA or Roth IRA, Publication 550 excepts it from adding the disallowed loss to the cost of the new stock.` The consequence is not stated; route to the wash sale rule guide (it states the loss is never recovered, Rev. Rul. 2008-5) or add that statement to the fact list.
6. T5, T5b, T5c (overloaded): introText sentence 3 (35 words), sections[0] paragraph 3 (35 words), sections[3] paragraph 3 (40-word Pub. 550 example). Split as listed; keep the first-mention IRS link in the intro. Optionally split faqs[0] (35 words).
7. T8, sections[1] paragraph 1. Quote: `using the IRS 2026 thresholds`. run.py does not use the ceilings; say the model used the 0%, 15% and 20% rates.
8. Headline fields (T7, T7b, T7c): sections[0].heading to "What Tax Loss Harvesting Can Deduct Each Year"; sections[2].heading to "Tax Loss Harvesting Usually Defers Tax to a Later Year"; cardBlurb to the one-claim version in the findings file.
9. Advisory, optional: TA2 backward "That", TA3 add "and surviving spouses" to the joint row, TA4 differentiate FAQ 4 from FAQ 1 and lead FAQ 6 with a yes, TA6 vary sentence length during the splits.

### 3. /guides/brrrr-method/ (draft brrrr-method.json)

1. B1, rhythm. Sections[6] "Our Takeaway" sentence 5 of 8. Quote: `The lender's real LTV limit and the appraisal can move this verdict in either direction.` Change to "... can move this verdict either way." (14 words). Sentences 106-115 are ten consecutive 15+ word sentences.
2. B3, sections[4] sentence 1. Quote: `according to the Internal Revenue Service (IRS) in IRS Publication 527`. Move the closed-list link (https://www.irs.gov/publications/p527) onto "Internal Revenue Service (IRS)" so the first mention is linked.
3. B5, "our reading plus ask the lender" consistency: the table lead-in in sections[1] ("The capped path applies our reading of Fannie Mae's delayed financing limit, which the section on that exception explains."), sections[5] paragraph 3 ("On our reading of the delayed financing exception, a refinance inside six months returns about the purchase money and leaves the $40,000 of repairs ..."), and sections[6] takeaway ("... based on our reading of the delayed financing wording."). Add "Fannie Mae does not address repair spending, so ask the lender how it counts repair costs" to each (fact list supports: F11, section 4 text). Remove the self-reference in the table lead-in.
4. B2, B2b, B2c, B2d (overloaded): introText paragraph 2 sentence 3 (35 words, "a rental with $193,000 of purchase price" misreads), introText paragraph 3 (36 words, nested "or"), sections[0] paragraph 3 (40 words), sections[3] paragraph 2 (38 words). Split as listed. Keep the intro free of $40,000.
5. B4, sections[5] paragraph 1. Quote: `Each one shows up differently in the numbers.` Delete.
6. B4b, faqs[0] last sentence. Quote: `Under Fannie Mae's delayed financing exception, if the purchase was funded with an unsecured loan or a HELOC on another property, the refinance proceeds must pay off or pay down that loan.` Delete (already in section 4).
7. B8, sections[3] paragraph 2. Quote: `Cash-out pricing applies to the new loan.` Delete (unexplained, no consequence on the fact list).
8. B7, faqs[2] and faqs[3]. Quotes: `no primary source cited here defines it`, `with no primary source on this page`. Replace with "none of the sources listed below defines it".
9. Advisory, optional: B6 "The standard path lends 75% of the appraised value" to "assumes a loan of 75%"; BA1 say "0.98 (one minus the 2% cost)"; BA3 trim the $185,000 depreciation example; BA4 "The new loan can be as large as ...".

### 4. Link-only routes (no fix required)

Optional polish for later runs: move the BRRRR sentence on /compare/cash-out-refinance-vs-heloc/ to follow the HELOC sentence so the cash-out versus HELOC contrast is not split; the one-sentence BRRRR paragraph on /compare/reit-vs-rental-property/ gives no consequence for the REIT-versus-rental decision; /compare/hsa-vs-fsa/ still shows 2025 limits and should be refreshed in a separate run.

## Outputs in this directory

- tax-loss-harvesting-findings.txt, hsa-triple-tax-advantage-findings.txt, brrrr-method-findings.txt
- rendered-review.json (8 routes; 5 link-only PASS, 3 new routes FAIL, per-check evidence)
- tax-loss-harvesting-analysis.json, brrrr-method-analysis.json, hsa-triple-tax-advantage-analysis.json (verdict FAIL; `mindmap-gates.py audit-analysis` returns "Independent review has not passed", as it must)
- tax-loss-harvesting-replay.json, brrrr-method-replay.json (independent replays, identical to output.json)
- `rendered-audit.py check ... --recapture` returns "BLOCKED: /guides/tax-loss-harvesting/: unapproved render", the expected result for a FAIL review; a separate fresh capture confirmed the rendered fingerprints still equal the reviewed snapshot (no drift).

Per-page state line (remediation ladder):
tax-loss-harvesting: FIX-IN-PLACE (findings file; two FACTS edits first)
hsa-triple-tax-advantage: FIX-IN-PLACE (one mechanical pass plus findings; two optional FACTS edits)
brrrr-method: FIX-IN-PLACE (all sentence-level)
five link-only routes: PASS
