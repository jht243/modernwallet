# Phase 4 independent review: autocomplete pass 2026-10-28

Reviewer: phase4-reviewer (did not write the pages). Own audit bundle: 28 parts delivered, `check` returned `delivery-complete-sources-current`.
Load receipt: `reports/standards-ledger.jsonl` mindmap-pass 2026-10-28 phase-3 `via: load-script`; cs 0e00ec2e, aa ed445917, exp 1969dcd5 all match the files on disk.
Pages reviewed: `/rent-vs-buy-calculator/` (RVB) and `/stock-capital-gains-tax-calculator/` (SG). Exact text = `src/data/calculators.ts` entries, identical to `drafts/*.json` (no field diffs). Rendered from `dist/`.

## VERDICT

- RVB: FAIL. One wrong fact (also in the closed fact list), two unsupported or unconditioned claims, an evidence-packet gap, a restatement, rhythm and tell findings, one tool boundary defect.
- SG: FAIL. Banned coy abstraction "the tool" x5, a takeaway that omits the condition that actually reverses it, rhythm run in the FAQ, overloaded sentences.
- All findings are Rung 1 / Rung 0 (fix in place, no rewrite). Numbers, IRS thresholds and the Freddie Mac rate are otherwise correct. No testing claim, no neutrality claim, no unlinked agency, no external URL off the allowed lists.

## Reproduced evidence

- RVB: `python3 evidence/rent-vs-buy-calculator/check.py` output is byte-identical to `check.out.json`. `ts_check.mts` prints 14 `ok`. I also recomputed from `check.py` `run()` and the TS engine every figure in the page text and FAQs: payment $2,198.18; first-month owning $3,032 / renting $2,215 / diff $817; ratios 15.2, 12.8, 11.9; diffs -39,311 / -40,669 / -41,156 / -39,815 / -29,926 at years 3/5/7/10/15; break-even 21; rate 6/5/4% -> years 8/5/4 with payments 1,918.56 / 1,717.83 / 1,527.73 and 7-yr diffs -5,977 / +20,214 / +45,917; rent 2,600 -> 7, 2,800 -> 5; growth 5% -> 5, 1% -> never; return 3% -> 9, 9% -> never; 10% down -> year 30, cash $52,000. All match. Every year below 21 is negative at the defaults (supports "any stay shorter than the break-even year favors renting").
- SG: `check.py` output identical to `check.out.json`; `ts_check.out.txt` 13 `ok`. Recomputed all 8 closed-list scenarios and page figures in the TS engine: 3,000 / 4,400 / 0 / 1,582.50 / 5,725+1,140=6,865 / 6,000+1,520=7,520 / 2,286 / 40,000+7,600=47,600. All match.
- IRS Rev. Proc. 2025-32 text (`/tmp/rp/rp.txt`): 0%/15% limits single 49,450/545,500; MFJ 98,900/613,700; HoH 66,200/579,600; MFS 49,450/306,850; standard deduction 16,100 / 32,200 / 24,150 / 16,100; ordinary tables incl. 105,700 and 201,775 tops. All match. WebFetch of IRS Topic 559 (3.8%, $250k/$125k/$200k) and Topic 409 (more than one year, $3,000/$1,500, carryforward, Form 8949 and Schedule D) match. Freddie Mac PMMS fetched: "averaged 7.32% as of October 22, 2026, down from last week when it averaged 7.40%". Match.
- Browser (Playwright chromium, `dist/` on :8765): both routes at 390 and 1280: 0 console errors/warnings, no horizontal scroll (scrollWidth = clientWidth), `data-tool` slug correct, default result on first load (RVB "Renting ends $41,156 ahead after 7 years. Buying only passes renting in year 21."; SG "$3,000"). Editing fields updates results (rate 5% -> Year 5; holding period short -> $4,400; loss -> $0 and loss message). All 16 / 3+2 controls have labels or aria-labels. Year table fits at 390px.

## Gate table

| Gate | RVB | SG |
|---|---|---|
| Phase 4 item 1: instructions/exclusions (no section G testing, finance excluded, ordinary format) | PASS | PASS |
| 2: reader question + exact-intent dedup (no existing route, `grep` and dist) | PASS | PASS |
| 3: source-to-claim, reproducibility | FAIL (F1, F3, F4) | PASS (F9 mechanical citation only) |
| 4: visible attribution, accurate basis (modeled / calculated), no testing claim | PASS (advisory A1) | PASS (advisory A1) |
| 5: takeaway answers question, agrees with intro/tool/FAQ, states reversing condition | FAIL (F2, F3) | FAIL (S2) |
| 6: testing labels (none, no "we tested", no tested schema, byline, meta) | PASS | PASS |
| 7: tool defaults/boundaries/labels/mobile | FAIL (F8) | PASS (S8 cosmetic) |
| 8: growth.json present, `not-yet-published`, no uplift claim | PASS | PASS |
| Reader-question gate (answer in first two sections; intro para 1 gives verdict + number) | PASS | PASS |
| Depth (explainer floor 1,200; intro+howItWorks+FAQ answers, links stripped) | PASS 1,521 (27% above) | PASS 1,491 |
| Metadata (title <=60, desc <=160) | PASS 43 / 145 (title under 50 target, F10) | PASS 39 / 144 (F10) |
| Headline scan (title, desc, H1, 8 FAQ questions) | PASS | PASS |
| Em-dash / semicolon / exclamation / "honest" / neutrality / byline-in-body greps | PASS (0 hits) | PASS (0 hits) |
| Rhythm (5 consecutive within 3 words; 10-run one band) | FAIL (F6) | FAIL (S5) |
| Coy abstraction / synonym cycling | PASS | FAIL (S1) |
| Restatement | FAIL (F5) | PASS |
| Links: internal routes exist (sitemap + dist + new routes in sitemap-0.xml) | PASS | PASS |
| Links: external on allowed lists only | PASS | PASS |
| Links: first mention linked (page body) | PASS (F9 tool hint) | PASS (F9 tool disclaimer) |
| Disclaimer position (template footer last; in-body line is in takeaway, not top) | PASS | PASS |
| Schema (title/desc/canonical/OG, WebApplication, FAQPage 8Q, Article dates 2026-10-28, citation, breadcrumb) | PASS | PASS |
| Neutrality / experience truth (no invented testing, "we" is authorial) | PASS | PASS |
| Required elements: who not for, what would change, next action last | PASS | PASS except reversing condition (S2) |
| Row records: register / medium / page type present; `teeup-exempt:` and anchor notes | FAIL mechanical (F11) | FAIL mechanical (F11) |
| Load receipt | PASS | PASS |

Distribution: depth passing 2 / failing 0 / median 1,506 (not within 10% of floor). Sentence bands RVB S17 M60 L35 of 112; SG S15 M50 L43 of 108.

## Numbered findings to fix

### RVB

F1 (claim, hard). Wrong figure, copied from the closed fact list. howItWorks para 3 and FAQ 6 say the 10%-down payment is "$2,472.95 with mortgage insurance included". $2,472.95 is principal and interest only (checked: 360,000 at 7.32% over 30 years = 2,472.95). Mortgage insurance (0.5% of the loan a year) adds $150 a month, so the payment with insurance is $2,622.95 and the first-month owning cost is $3,456.28 in the engine. The tool labels its figure "Mortgage payment (principal and interest)", so page and tool contradict.
FIX rent-vs-buy howItWorks: "The payment is $2,472.95 with mortgage insurance included, and the break-even moves to year 30." -> "The principal and interest payment is $2,472.95, mortgage insurance is added on top, and the break-even moves to year 30."
FIX rent-vs-buy faqs[5].answer: "The payment is $2,472.95 with mortgage insurance included." -> "The principal and interest payment is $2,472.95, and mortgage insurance is added on top of that."
Also correct the row prompt closed fact list (`prompts/rent-vs-buy-calculator.prompt.md`, "payment $2,472.95 with mortgage insurance included").

F2 (claim). Takeaway: "Buy if you expect to stay past the break-even year and the all-in monthly cost of owning is not far above rent." The second condition is not in the model or packet. At the defaults owning is $3,032 vs $2,215 rent (37% higher) and the model already prices that gap into the break-even. It also differs from the intro and FAQ 1 ("Buy only if you will stay past the break-even year").
FIX rent-vs-buy howItWorks: "Buy if you expect to stay past the break-even year and the all-in monthly cost of owning is not far above rent." -> "Based on our internal modeling, buy only if you expect to stay past the break-even year." (also restates the evidence basis at the decision.)

F3 (claim, condition missing). FAQ 6: "In this model, a bigger down payment helps buying." Only 10% vs 20% down appears in the packet, and the direction depends on the mortgage rate (7.32%) being above the investment return (6%). I ran 30% down: at 3% return it helps (year 7 vs 9); at 9% return 30% down is worse than 20% (year-7 gap -84,442 vs -79,525).
FIX rent-vs-buy faqs[5].answer: "In this model, a bigger down payment helps buying." -> "At the 7.32% default rate, which is above the 6% investment return, a bigger down payment helps buying."

F4 (mechanical, evidence packet). Page says "the two versions agreed on every scenario below". The saved `check.out.json` / `ts_check.out.txt` (14 scenarios) lack rate 6%, rate 4%, rent $2,600 and 1% growth (grid has `appr_0`, not `appr_1`), which the page states. I ran them: Python and TS agree (8 / 1,918.56 / -5,977; 4 / 1,527.73 / +45,917; 7 / +3,836; never / -95,378). Add the four to `check.py` `grid` and `ts_check.mts` mapping, regenerate outputs, update `evidence.json` "14 scenarios". The claim is true, the record does not yet show it.

F5 (tell, restatement). howItWorks para 2 repeats intro para 2: "The mortgage payment is $2,198.18, and the first-month cost of owning is $3,032. Renting costs $2,215, so the renter invests $817 in the first month."
FIX: delete both sentences (keep "At the defaults, owning costs more than renting in the first month." and the price-to-rent sentence).

F6 (tell, rhythm and overload). Intro para 2 sentences 8 to 13 have lengths [12,14,14,11,14,14] (5+ within 3 words). Sentences 28 to 32 [13,12,13,12,15]. Sentence 26 is 34 words with two ideas.
FIX rent-vs-buy howItWorks: "In our internal modeling, we compared buying with renting and investing the same cash over 1 to 30 years, then changed one assumption at a time to see which ones move the break-even year." -> "In our internal modeling, we compared buying with renting and investing the same cash over 1 to 30 years. We then changed one assumption at a time to see which ones move the break-even year."
FIX rent-vs-buy introText: "After 7 years, the buyer's net worth is $169,338 and the renter's is $210,495. Renting and investing is ahead by $41,156." -> "Seven years in, buying leaves $169,338 and renting and investing leaves $210,495, so renting leads by $41,156." (and shorten "Renting a similar home costs $2,215 a month, including renter's insurance." -> "A similar rental costs $2,215 a month with renter's insurance.") Deleting F5's two sentences also breaks the 28 to 32 run.

F7 (tell, pseudo-cleft). FAQ 3: "Opportunity cost is what your down payment and extra monthly costs would earn if you invested them instead."
FIX: -> "Opportunity cost is the return your down payment and extra monthly costs would earn if you invested them instead."

F8 (tool, boundary). Rent = 0 or an empty rent field returns a result: "After 7 years, renting is ahead by $288,617 ... With these inputs buying never catches up", first-month renting cost $15. Engine allows `rent >= 0`. Down payment above 100% and loan term 0 show the unrelated message "Enter a home price and a monthly rent."
FIX `src/lib/rent-vs-buy.ts`: return null when `!(i.rent > 0)`; change the empty-state message to "Enter a home price, a monthly rent, a down payment from 0 to 100 and a loan term." (mechanical; no copy impact).

### SG

S1 (tell, coy abstraction / synonym cycling, hard). "the tool" x5 while the rest of the page says "the calculator": howItWorks "The tool does not check basis."; "The tool estimates MAGI as your taxable income plus the 2026 standard deduction plus the gain."; "The tool covers federal tax for 2026 only."; "because the tool does not estimate it"; "The tool is built for stock, exchange-traded fund (ETF) and fund shares in a taxable account."
FIX (each): replace "The tool"/"the tool" with "The calculator"/"the calculator".

S2 (claim, reversing condition missing). Takeaway "Hold a winning position for more than a year when you can." The listed reversers (state tax, wash-sale or loss-carryover rules, other investment income) do not change hold-versus-sell. The calculator measures tax only, and a falling price is the condition that reverses a hold-for-tax recommendation. The page never says so, and the takeaway does not restate the evidence basis.
FIX SG howItWorks: "Sold within a year, the same gain costs $4,400." -> "Sold within a year, the same gain costs $4,400, a $1,400 difference in our internal calculation. A price drop larger than that $1,400 would cost more than the tax you save by waiting."

S3 (claim, low). NIIT MAGI is estimated as taxable income + standard deduction + gain, but the input hint tells itemizers to enter taxable income after itemized deductions, which understates MAGI and NIIT for them. Not disclosed.
FIX SG howItWorks: after "That deduction is $16,100 for single filers and $32,200 for joint filers." add "If you itemize, the estimate understates your MAGI."

S4 (tell, overload). Sentence 18 (31 words): "In our internal calculation, we re-implemented the 2026 stacking rule in two separate programs and ran the scenarios below through both to see how income and holding period change the tax." Sentence 77 (31 words, two ideas): "If your other taxable income is under the 0% limit, long-term gains up to the room left in that bracket are tax-free, and the calculator shows how much room you have."
FIX: "...two separate programs. We ran the scenarios below through both to see how income and holding period change the tax." and "...are tax-free. The calculator shows how much room you have."

S5 (tell, rhythm). FAQ 2 and 3 sentences 87 to 92 lengths [12,11,10,13,10,11] (six within 3 words), run across the FAQ answers "The 15% rate runs to $545,500, and 20% applies above that. Married couples filing jointly get limits of $98,900 and $613,700. You must hold the stock more than one year, per IRS Topic 409. Stock held one year or less produces a short-term gain. A short-term gain is taxed as ordinary income at graduated rates."
FIX faqs[2].answer: "You must hold the stock more than one year, per IRS Topic 409. Stock held one year or less produces a short-term gain. A short-term gain is taxed as ordinary income at graduated rates." -> "Hold the stock more than one year, per IRS Topic 409, and the gain is long-term. Stock held one year or less produces a short-term gain, which is taxed as ordinary income at graduated rates."

S8 (tool, cosmetic). Gain exactly $0 shows "This gain falls inside the 0% long-term bracket, so it owes no federal tax." with a $0 gain; loss message gives only the $3,000 limit (omits $1,500 if married filing separately); stat label "Income tax on the gain" on a loss. Fix in component copy (mechanical).

S9 (mechanical, internal citation). Closed fact list, engine comment, `evidence.json` and brief cite "Rev. Proc. 2025-32 section 3.03 / section 3". The capital-gains amounts are section 4.03, tax tables 4.01, standard deduction 4.14 (section 3 is the 2025 modification). Not shown to readers. Correct the references.

### Both pages

F9 / S6 (mechanical, link in tool copy). Tool text renders before the linked mention: RVB hint "The mortgage rate is Freddie Mac's 30-year average ..." (unlinked); SG disclaimer "using the 2026 rates in IRS Revenue Procedure 2025-32" (unlinked). Link the first on-page occurrence in the component to the allowed URLs (`https://www.freddiemac.com/pmms`, `https://www.irs.gov/pub/irs-drop/rp-25-32.pdf`), or leave the name off the tool copy.

F10 (mechanical, advisory). metaTitle 43 / 39 characters vs the 50 to 60 target. RVB "With" should be lowercase if the title follows heading Title Case. Suggested: "Rent vs Buy Calculator with Break-Even Year and Net Worth" (57); "Stock Capital Gains Tax Calculator for 2026 Stock Sales" (55).

F11 (mechanical, records). No `teeup-exempt:` note and no anchor note exist for either row (grep of the run artifacts). Neither page has a tee-up, and both are operator register. Add to the run notes: `teeup-exempt: calculator page, answer-first, authorial "we" appears at the attribution` and `anchor: original modeled / calculated scenarios (evidence/<slug>/check.out.json)`.

### Advisory (do not block)

A1. Attribution sits in howItWorks paragraph 1, about 200 words after the first finding in the intro (RVB intro says "modeled"; SG intro does not say "calculated"). It is accurate (modeled / calculated, scope, how to check) and `provenance.placement` documents it, so PASS. Optional: lead the intro worked case with "In our internal modeling, we took a buyer who..." / "In our internal calculation, we took a single filer with $85,000..."
A2. STYLE paragraph cap (3 sentences): howItWorks paragraphs run 8 to 21 sentences; the template only supports `\n\n` paragraphs (no bullets, one H2 "How it works"). Split at logical breaks (rate scenarios / rent and growth / return and down payment; thresholds by filing status / worked cases; short-term / NIIT).
A3. Python and TypeScript are named without links (RVB). They are not on the allowed URL list. Prefer "in two separate programs" as SG does.
A4. Dead-ends: RVB "Moving costs and special assessments are not modeled either."; SG "It leaves out ... loss carryovers and wash sales" give no next step. Add a half-sentence route or accept.
A5. The tool shows the payment rounded ($2,198) while the page quotes $2,198.18.
A6. RVB takeaway links the tax bracket calculator "before you count on" the itemized deductions. A bracket does not tell the reader whether they itemize.

## Per-page final lines

rent-vs-buy-calculator: FIX-IN-PLACE (F1 to F8, F9 to F11 mechanical) -> FAIL until re-audited on the edited fields.
stock-capital-gains-tax-calculator: FIX-IN-PLACE (S1 to S5, S8, S9, F9, F10, F11) -> FAIL until re-audited on the edited fields.
Rework counter: 0 of 2 used. Nothing here needs new research or a writer re-run; none counts as a rework attempt (remediation ladder Rung 0/1). Edits change the exact text, so the Phase 4 pass is void and must be repeated on the edited fields and the rebuilt dist.
