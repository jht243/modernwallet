# Phase 4 report, round 2: podcast recovery 2026-11-04

Reviewer: phase4-reviewer-1. Re-audit of the current built text (snapshot sha e5a0939c6899...; fresh capture, no capture failures). Round-1 outputs are untouched in audit/round1/. Rules unchanged (preflight-audit2 check = delivery-complete-sources-current).

## Verdicts

| Page | Round 1 | Round 2 | Remaining hard findings |
|---|---|---|---|
| /guides/tax-loss-harvesting/ | FAIL (16) | FAIL | 5 (R2-T1 to R2-T5) |
| /guides/hsa-triple-tax-advantage/ | FAIL (17) | FAIL | 3 (R2-H1 to R2-H3) |
| /guides/brrrr-method/ | FAIL (11) | FAIL | 1 (R2-B1) |
| /guides/tax-tips/ | PASS | PASS | 0 |
| /guides/wash-sale-rule-explained/ | PASS | PASS | 0 |
| /compare/hsa-vs-fsa/ | PASS | PASS | 0 |
| /compare/cash-out-refinance-vs-heloc/ | PASS | PASS | 0 |
| /compare/reit-vs-rental-property/ | PASS | PASS | 0 |

Depth (measured with `wc -w`, first and last): TLH 1,852, HSA 1,720, BRRRR 2,248 body words; floor 1,200; passing 3 / failing 0 / median 1,852. Rhythm: all three pass now (BRRRR 10-run fixed). Headline fields: all three pass now. Replays: both run.py outputs canonically identical to output.json; every page figure matches. Source claims: all PASS (F13 corrected, taxable-income wording fixed, HSA investing condition gone, assumption labels and "ask the lender" consistent). Layout: HSA asterisks gone (0 in rendered text). Links: BRRRR first IRS mention linked. The five link-only routes' rendered text is byte-identical to the round-1 reviewed text, so their PASS stands with the documented no-bump exception.

`rendered-audit.py check --recapture` returns "BLOCKED: /guides/tax-loss-harvesting/: unapproved render" (expected while the three guides FAIL); audit-analysis returns "Independent review has not passed" for all three. Analysis files: all five analysis checks now PASS on every page; the overall verdict is FAIL only because the rendered route is not yet approved.

## Inherited-context items: advisory, not blockers

- /compare/hsa-vs-fsa/ still shows 2025 limits ($4,300/$8,550, HDHP $1,650/$3,300) and "Updated June 25, 2026". Not a blocker for the revised answer: the revision is one anchor on "triple tax advantage" in a scenario about time horizon; the page labels every figure "2025", so it does not contradict the new guide's 2026 figures, and the added link cites no number. A bump without refreshing the figures would be worse. Follow-up: refresh that page's figures in a separate run.
- Comparison page context (80% to 85% combined LTV on /compare/cash-out-refinance-vs-heloc/; the one-sentence BRRRR paragraph on /compare/reit-vs-rental-property/; mid-contrast placement of the BRRRR sentence): advisory. The BRRRR guide labels its 75% an assumption and tells the reader to use the lender's figure, and the added sentences state no figure. Not blockers.
- Also advisory: "Medicare premiums are always qualified HSA expenses" on /compare/hsa-vs-fsa/ (inherited, overbroad before 65) versus the new guide's premium rules; not in the revised passage.

## Required fixes for round 2 (apply with `content_gen.py fix`; quote, problem and supported replacement are in each findings file)

### /guides/tax-loss-harvesting/ (no new facts)
1. R2-T1, sections[4]: "This guide covers sales in taxable accounts that you report on Form 8949. It does not cover losses inside an IRA or another tax-deferred account, so a tax professional is the place to take those." Banned self-reference (my round-1 replacement reused it; my error). Replace with "Losses inside an IRA or another tax-deferred account are a question for a tax professional." Same paragraph group: "The IRS pages this guide draws on do not cover ..." to "The IRS pages cited above do not cover ...".
2. R2-T2, sections[3]: split the 37-word IRA sentence at "stock." and start "A tax professional can explain what that means for your loss."
3. R2-T3, faqs[0]: split the 35-word sentence ("Yes. Selling stock ... creates a capital loss that cancels capital gains. IRS Topic 409 lets you deduct up to $3,000 ...").
4. R2-T4, faqs[3]: split the 36-word sentence into the loss-lowers-taxable-income sentence and a separate "The limit is the lesser of $3,000 ($1,500 if married filing separately) or your total net loss."
5. R2-T5, faqs[4]: "Cases such as a 0% year, a basis step-up at death or a gift to charity are not covered here." Dead end. Replace with "A tax professional can explain how a 0% year, a basis step-up at death or a gift to charity apply to you."

### /guides/hsa-triple-tax-advantage/
1. R2-H1, sections[1] paragraph 3: "Readers near Medicare enrollment can see what help exists in our Medicare Savings Programs guide." FACTS: add F21 (the existing guide says your state can pay your Medicare premiums through a Medicare Savings Program if you qualify). Then say that. Or delete the sentence.
2. R2-H2, sections[1] paragraph 4: "That choice comes with a testing period." FACTS: add the Pub. 969 definition (testing period begins with the last month of your tax year and ends on the last day of the 12th month following it). Then define it. Or delete the sentence and the following testing-period paragraph.
3. R2-H3, sections[5] list, sections[6] paragraph 2, faqs[5]: the "do not cover these questions" list and the state-tax statements route nowhere. FACTS: add F22 (for state tax treatment and your own tax saving, a tax professional can apply your state rules and your marginal rate). Keep only the state-tax and own-saving items, delete the custodian, employer-amount and 2027 bullets, add the tax-professional route in the list close, the takeaway and the FAQ. Or delete the unrouted items and sentences. Also remove the blank line that splits the list (cosmetic).

### /guides/brrrr-method/
1. R2-B1, sections[6] paragraph 2: split the 35-word sentence into "It also does not fit anyone who needs a refinance inside six months to recover repair spending, based on our reading of the delayed financing wording." and "Ask the lender how it counts repair costs."

Optional (advisory): TLH 33-word exceptions sentence; BRRRR 34-word stops-working sentence; trim the repeated "ask the lender" copy; cut the residual-flag sentence "A rule of thumb cannot tell you whether the refinance returns your cash."

After round 2 the three pages must be rebuilt, recaptured and re-reviewed in full (this review is bound to the current snapshot hash).
