# Phase 4 round 2 (independent reviewer: phase4-reviewer)

## Re-verification of edited fields
- RVB `check.py` output identical to `check.out.json`; `ts_check` 18 ok. SG `check.py` identical; `ts_check` 13 ok (run via a `.ts`-suffixed import copy, because the engine's extensionless `./tax-bracket` import does not resolve under plain node; works under the project build).
- Recomputed edited sentences: 10% down P&I $2,472.95 with insurance added on top (correct); rate 6/4%, rent $2,600, 1% growth now covered; "year 5 at 5%, year 21 at 7.32%, ratio 15.2" correct.
- Greps on exact calculators.ts text: 0 em-dash, 0 semicolon, 0 "honest", 0 "the tool"; max sentence 28 (RVB) and 29 (SG); no 5-within-3 run, no 10-run in one band; words 1,514 / 1,528; titles 57 / 55, descriptions 145 / 144; links only the internal routes and allowed Freddie Mac / IRS URLs. No new tell or contradiction found in the two calculator pages.
- Tool: rent 0 now shows the empty-state message; gain 0 and loss messages correct (MFS $1,500 included); tool copy links Freddie Mac / Rev. Proc.; no horizontal scroll at 390 or 1280; 0 console errors.

## Verdicts
- /rent-vs-buy-calculator/ PASS
- /stock-capital-gains-tax-calculator/ PASS
- Rendered /compare/ordinary-income-vs-capital-gains-tax/ PASS (advisory: inherited 32%-bracket example omits the 3.8% NIIT that applies at that income, so the calculator it links to would show larger totals; the $2,550 saving is unchanged. Optional: add "before the 3.8% surtax" to both bills.)
- Rendered /compare/renting-vs-buying/ FAIL

## FAIL: /compare/renting-vs-buying/ (unresolved inherited contradiction that affects the answer)
The new sentence is accurate, but it now sits beside inherited claims it contradicts: "At a 15x ratio, you typically break even buying vs renting in about 4 years", the table row "Break-even timeline: Typically 5-7 years in most U.S. markets", the FAQ "typically 5-7 years in most markets", "A ratio below 15 strongly favors buying" and "Buy when ... below 20x". The page itself assumes 7% rates, where our model gives year 21 at ratio 15.2. A reader gets two incompatible break-even answers.
FIX renting-vs-buying section "The price-to-rent ratio: your key metric": "At a 15x ratio, you typically break even buying vs renting in about 4 years. At a 25x ratio, break-even extends to 10+ years — during which time you might move, the market might shift, or rates might change." -> "A higher ratio pushes the break-even later, and a lower mortgage rate pulls it earlier."
FIX table row: "Typically 5–7 years in most U.S. markets" -> "Depends on the mortgage rate and the price-to-rent ratio".
FIX FAQ "Is renting or buying cheaper in 2024?": "The breakeven point — when buying becomes the better financial deal — is typically 5–7 years in most markets." -> "The break-even point, when buying becomes the better financial deal, depends mainly on the mortgage rate and the price-to-rent ratio, and our rent vs buy calculator finds it for your numbers."
Advisory: "A ratio below 15 strongly favors buying" (our model: ratio 12.8 breaks even in year 7 at 7.32%) and "price-to-rent below 20x" in "Which should you choose?" are also rate-dependent.

## rendered-audit.py
`rendered-review.json` saved (reviewer phase4-reviewer, snapshotSha256 a2cd2e52a0ef525bb69f63d1a6549c249de026a2b0986735ee08be35dca98569). `check --recapture` returns `BLOCKED: /compare/renting-vs-buying/: unapproved render`, as intended by the FAIL verdict. After the fixes, recapture, and I will re-review that route only.
