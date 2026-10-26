# ROW PROMPT (data only) — charitable-donation-tax-deduction-calculator

route: /charitable-donation-tax-deduction-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; intro ~140 words, howItWorks ~420 words, 8 FAQs)
primary keyword: charitable donation tax deduction calculator (also: charitable contribution deduction calculator, church donation tax deduction calculator, do my donations lower my taxes)
intent: a giver (often a church tither) wants to know whether this year's donations actually lower the federal tax bill, and by how much, under the 2026 rules.
reader question: "Will my charitable donations lower my taxes in 2026, and by how much?" [PAA/autocomplete: "are church donations tax deductible" 2026 variants; "church donation tax deduction calculator"; "how much church donation is tax deductible"; DataForSEO 590/mo for the head phrase]
answer: A figure plus a condition: most households now take the standard deduction, so gifts add little unless itemized deductions beat it. A married couple with $150,000 AGI giving $12,000 in cash, with $20,000 of other itemized deductions, saves $440 at a 22% rate, because only the $2,000 non-itemizer cash deduction adds to the standard deduction. Bunching two years of gifts into one year changes that.
answer placement: section 1 — introText paragraph one gives the answer and what the tool returns; paragraph two is the $150,000 worked example. Do not open with a definition of charity or a history of the deduction.

## The calculator (describe only what it does)
Inputs: filing status (Single; Married filing jointly; Head of household; Married filing separately); adjusted gross income (AGI); cash gifts this year to a church or other public charity; other itemized deductions (mortgage interest, state and local taxes, medical); the reader's federal marginal tax rate (a percent; 22 is the placeholder).
Outputs: tax the gifts save this year (added deductions times the marginal rate); which route wins (itemize or standard) with both totals; giving that is deductible if itemizing after the 0.5% floor; what giving adds to the deductions; and a two-year bunching test (two years giving evenly vs the same money given in year one and nothing in year two, with the deduction totals and the extra tax effect at the reader's rate).
Method the page may state: if itemizing, the deductible charity is the smaller of the gifts and 60% of AGI, minus 0.5% of AGI (not below zero); the itemized total is that plus other itemized deductions. If not itemizing, the standard deduction plus the non-itemizer cash deduction (the smaller of the gifts and $1,000, or $2,000 married filing jointly) applies. The tool picks the larger total. What giving adds = the winning total minus the larger of the standard deduction and the other itemized deductions with no giving.
Assumptions the page must state: cash gifts to a church or other public charity only; non-cash gifts, appreciated stock, carryovers, the extra standard deduction for age 65 or older, the $6,000 senior deduction and gifts to donor-advised funds are not modeled (donor-advised fund gifts do not qualify for the non-itemizer deduction); the 60% limit is applied before the 0.5% floor and the IRS has not published a worksheet showing that order for 2026, so check final IRS guidance; tax saved is federal only, added deductions times the rate the reader enters; state tax is not included.
Provenance (calculated, internal modeling): "In our internal modeling, we ran the calculator's own formula on the scenarios below to see when donations change the tax bill." The scenarios are computed by the calculator's code; they are not tests of any product and not client cases. State the scenario results as modeled, with the stated assumptions, and tell the reader they can enter their own numbers in the calculator above to check them.
Takeaway (in howItWorks, near the end, before nothing else): for most households under the 2026 standard deductions, giving adds only the $1,000/$2,000 cash allowance to the deductions unless other itemized deductions are already near the standard deduction; giving evenly is the safe default and bunching helps mainly when the two-year total clears the standard deduction in the bunched year and stays under the 60% of AGI limit. Condition that reverses it: a bunched gift above 60% of AGI loses the deduction on the excess (the $15,000 gift on $20,000 AGI scenario), and a household far below the standard deduction gains nothing from bunching.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a tax rate, a bracket, a state rule, a statistic or a URL. Do not state any income tax bracket.
- 2026 standard deduction (IRS 2026 inflation-adjustment release, Rev. Proc. 2025-32): $16,100 single and married filing separately; $24,150 head of household; $32,200 married filing jointly.
- From 2026 (Public Law 119-21): itemizers can deduct charitable gifts only above 0.5% of AGI; non-itemizers can deduct cash gifts to eligible charities up to $1,000 ($2,000 married filing jointly) while taking the standard deduction. These apply on top of the overall itemized-deduction rules.
- IRS Publication 526: a charitable deduction generally cannot exceed 60% of AGI for cash gifts to the most common charities (churches included); 20%, 30% or 50% limits apply in some cases. Churches are qualified charities.
- IRS Publication 1771: a gift of $250 or more needs a written acknowledgment from the charity.
- Floor and cap formulas as above. Example floors: 0.5% of $150,000 = $750; 60% of $150,000 = $90,000.
- Modeled scenarios (computed by the calculator's code, saved in the run folder; each entered at the stated filing status):
  1. Married filing jointly, AGI $150,000, cash gifts $12,000, other itemized deductions $20,000, 22% rate: deductible giving if itemizing $11,250; itemized total $31,250; standard route $34,200 ($32,200 + $2,000 cash allowance); the standard route wins; giving adds $2,000 of deductions; tax saved $440. Two years giving $12,000 each year: $68,400 of deductions in total. Two years with $24,000 given in year one and nothing in year two: $43,250 itemized in year one (the $20,000 other + $23,250 deductible after the $750 floor) plus $32,200 standard in year two = $75,450; that adds $7,050 of deductions, about $1,551 of tax at 22%.
  2. Married filing jointly, AGI $150,000, cash gifts $1,500, no other itemized deductions: standard route $33,700; the $1,500 is deducted in full as the cash allowance; tax saved $330 at 22%.
  3. Married filing jointly, AGI $150,000, cash gifts $500: the gift is below the $750 floor, so itemizing deducts nothing; the cash allowance deducts $500; tax saved $110 at 22%.
  4. Single, AGI $90,000, cash gifts $6,000, other itemized deductions $18,000, 24% rate: deductible giving $5,550; itemized total $23,550 beats the $17,100 standard route; giving adds $5,550; tax saved $1,332. Bunching adds $450 of deductions over two years, about $108 of tax.
  5. Single, AGI $20,000, cash gifts $15,000, other itemized $20,000, 12% rate: the 60% limit caps deductible giving at $12,000, minus the $100 floor = $11,900. Bunching $30,000 into one year is capped at $12,000 and loses deductions: two-year total $51,900 against $63,800 giving evenly, $11,900 worse.
- Do not state any other figure, and do not claim anyone saves any particular amount except as the modeled scenarios above.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/publications/p526 (IRS Publication 526). https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill (IRS 2026 inflation adjustments). https://www.irs.gov/pub/irs-pdf/p1771.pdf (IRS Publication 1771). Nothing else.

## Internal routes it may link (real routes only)
/guides/are-church-donations-tax-deductible/ (are church donations tax deductible — the explainer), /guides/donor-advised-funds-explained/ (donor-advised funds), /compare/standard-vs-itemized-deduction/ (standard vs itemized deduction), /guides/senior-deduction-social-security/ (senior deduction), /tax-bracket-calculator/ (find your marginal rate), /compare/rmd-vs-qcd/ (RMD vs QCD), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks (4-5 paragraphs): (1) the two routes, itemize vs standard plus cash allowance, and the 0.5% floor with the $750 example; (2) the 60% of AGI limit and the $1,500 / $500 / $15,000 cases; (3) the bunching test with scenario 1 step by step and the scenario 5 counterexample, with the visible internal-modeling attribution at the first finding; (4) what the tool leaves out and the ordering caveat; (5) the takeaway (who it applies to, evidence basis = our internal modeling plus the IRS figures, what would change it).
Who this is not for: someone giving appreciated stock, non-cash items or through a donor-advised fund, or someone wanting their full tax bill.

## FAQ questions (verbatim, in this order)
1. Will my charitable donations lower my taxes in 2026?
2. How much of my church donations can I deduct?
3. Can I deduct donations if I take the standard deduction?
4. What is the 0.5% of AGI floor on charitable deductions?
5. What is the 60% of AGI limit on cash gifts?
6. Does bunching donations save tax?
7. Do donor-advised fund gifts count for the non-itemizer deduction?
8. What proof do I need for a donation of $250 or more?
For question 7 say gifts to donor-advised funds do not qualify for the non-itemizer cash deduction and point to /guides/donor-advised-funds-explained/. For question 8 name IRS Publication 1771 and the written acknowledgment.
