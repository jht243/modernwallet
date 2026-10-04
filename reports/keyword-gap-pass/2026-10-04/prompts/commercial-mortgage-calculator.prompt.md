# ROW PROMPT (data only) — commercial-mortgage-calculator

route: /commercial-mortgage-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~150 words, howItWorks ~450 words, 8 FAQs
primary keyword: commercial mortgage calculator (also: commercial mortgage payment calculator, commercial real estate loan calculator, commercial property loan calculator)
secondary keywords: commercial mortgage balloon payment, DSCR calculator commercial loan, commercial loan interest only period, how much commercial mortgage can i afford
intent: an investor or business owner buying an office, retail, industrial or multifamily property wants (1) the monthly payment, (2) the balloon balance owed when the term ends, and (3) whether the property's income covers the payment the way a lender will test it.
reader question: "What is my commercial mortgage payment, and what do I owe at the end of the term?"
answer placement: introText paragraph one answers it in a definition sentence; paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: property value, loan-to-value (LTV) percent, interest rate (APR), amortization years, loan term years, interest-only years, annual net operating income (NOI), and the lender's minimum debt service coverage ratio (DSCR).
Outputs: loan amount, down payment, monthly principal-and-interest payment, annual debt service, balloon balance due when the term ends, total interest paid over the term, DSCR (NOI divided by annual debt service), debt yield (NOI divided by the loan amount), the largest loan that still meets the minimum DSCR on that NOI, and an interest-only payment when an interest-only period is entered.
Assumptions the page must state: fixed rate for the whole term; monthly payments; amortization is counted from the end of any interest-only period; no fees, reserves, prepayment charges, taxes or insurance; DSCR is calculated on the amortizing payment. The rate, LTV, term and minimum DSCR in the tool are placeholders the reader replaces with the figures in their lender's term sheet, not quotes. Lenders define NOI, DSCR and debt yield in their own way.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a rate, LTV cap, DSCR minimum, amortization or term norm, fee, benchmark, or URL; if a figure is lender-specific, say it varies by lender and tell the reader to check their term sheet.
Worked example (all computed by the calculator with these inputs):
- Property value $1,000,000; LTV 75%; loan amount $750,000; down payment $250,000.
- 7% APR; 25-year amortization; 10-year loan term; no interest-only period.
- Monthly principal-and-interest payment: $5,300.84. Annual debt service: $63,610.13.
- Balloon balance owed when the 10-year term ends: $589,750.47. Principal paid down over the term: $160,249.53.
- Total interest paid over the 10-year term: $475,851.75.
- Net operating income $100,000: DSCR = $100,000 / $63,610.13 = 1.57x. Debt yield = $100,000 / $750,000 = 13.3%.
- With a minimum DSCR of 1.25x on that NOI, the largest loan the coverage test supports (at 7%, 25-year amortization) is $943,246.02. This is a coverage limit only; the lender's LTV cap is a separate limit.
- Same loan with a 2-year interest-only period: interest-only payment $4,375.00 a month for the first 24 months, then $5,300.84 a month; balloon at the end of the 10-year term rises to $631,307.89; total interest over the term $495,188.92.
- Rate stress: at 8% instead of 7% (everything else the same) the payment is $5,788.62 a month, DSCR is 1.44x, and the balloon is $605,724.80.
Facts about rules:
- Commercial loans are commonly amortized over a longer period than the loan term, so a balloon balance comes due at the end of the term and is usually paid by refinancing or selling. Say "many commercial loans", never a typical length.
- Lenders qualify the property or business on its income (DSCR), not only on the borrower's personal income. Lenders set their own minimum DSCR, maximum LTV, rate, term, amortization, fees and prepayment terms. Do not state typical values or ranges.
- Missing payments on a commercial mortgage can lead to foreclosure on the property (general statement, no numbers).
No other figures.

## CLOSED URL LIST — only external hrefs allowed
(none — use no external links)

## Internal routes it may link (real routes only)
/guides/commercial-mortgage-calculator-explained/ (the explainer guide on DSCR and balloon payments), /mortgage/ (home mortgage calculator), /real-estate/cap-rate-calculator/, /real-estate/ (rental and real estate calculator), /heloc-calculator/, /business-loan-payoff/

## Coverage
introText: as in the contract. howItWorks: (1) amortization period versus loan term and why a balloon is due, using the worked-example numbers, (2) the DSCR test, debt yield, and the largest-loan-at-minimum-DSCR row, (3) the interest-only option and what it does to the balloon, (4) the rate-stress row, (5) the assumptions list stated in plain sentences at the end. Describe rules and trade-offs; give no individual advice.

## FAQ questions (verbatim, in this order)
1. How is a commercial mortgage payment calculated?
2. What is a balloon payment on a commercial mortgage?
3. What is DSCR and how do lenders use it?
4. How much commercial mortgage can I afford?
5. What is debt yield?
6. What does an interest-only period do to a commercial loan?
7. How is a commercial mortgage different from a residential mortgage?
8. Should I use a commercial mortgage or a home equity line to buy property?
For question 8 say lenders set their own rates, terms and fees for each product so the reader should compare actual offers, then link /heloc-calculator/ and /guides/commercial-mortgage-calculator-explained/; do not recommend one.

# CORRECTIONS FROM THE PHASE 4 AUDIT (regenerate the whole object applying every item)
1. Do not state any residential amortization length or term. Remove "15-year or 30-year". In FAQ 7 say only that many residential loans amortize over their full term, so they carry no balloon, and that commercial lenders underwrite on property income (DSCR) as well as the borrower.
2. Do not say what lenders use debt yield for, and do not say it is "independent of the interest rate". FAQ 5 and the howItWorks mention say only: debt yield is NOI divided by the loan amount, shown as a percent, and lenders define it in their own way.
3. Write natural sentences. Never use these literal phrases: "DSCR calculator commercial loan", "commercial loan interest only period", "commercial mortgage balloon payment". Say "the DSCR test", "an interest-only period", "the balloon payment". Do not open the intro with "calculates"; use "shows".
4. No sentence may hold more than three figures. Split the long worked-example sentence in intro paragraph two after "$63,610.13" and again after "$475,851.75".
5. The howItWorks "Borrowers typically satisfy this" sentence must read "Many borrowers refinance the balance or sell the property before the term ends" and nothing stronger.
6. Do not open any howItWorks paragraph with "Choosing" or "Underwriting". Vary openings.

# CORRECTIONS FROM THE PHASE 4 AUDIT, ROUND 2 (regenerate the whole object applying every item; earlier corrections still apply)
1. The final howItWorks paragraph must say: "The rate, LTV, term and minimum DSCR in the calculator are placeholders, not quotes. Replace them with the figures in your lender's term sheet."
2. Foreclosure: write only "Missing payments on a commercial mortgage can lead to foreclosure on the property." Never tie foreclosure to the balloon.
3. Remove "heavily", "entirely", "quickly", "narrow cash flow margins". Say lenders qualify the property on its income (DSCR), not only on the borrower's personal income. FAQ 3 says only that lenders use DSCR to qualify the property on its income and set their own minimums; do not say what lenders "verify". Rate-stress paragraph: say only that a higher rate raises the payment and lowers the DSCR, with the figures.
4. FAQ 8: say "rates, terms and fees" (not "closing fees"); no description of how either product is secured. FAQ 2: end with "Many borrowers refinance the balance or sell the property."
5. HARD: no sentence may contain more than THREE figures (a figure = any $ amount, %, year count, or ratio). Split every such sentence, including the worked-example sentences in intro paragraph two and in howItWorks paragraphs one and six.

# CORRECTIONS ROUND 3 (regenerate the whole object; all earlier corrections still apply)
1. howItWorks must reach at least 480 words: expand the DSCR/debt-yield paragraph and the interest-only paragraph with plain-language explanation of what each input means, using only fact-list figures.
2. Split these into two sentences each so none holds more than three figures: "At 7% APR on a 25-year amortization schedule with a 10-year loan term, the monthly payment is $5,300.84."; "If a lender sets a minimum DSCR of 1.25x on that $100,000 income, the coverage test supports a maximum loan of $943,246.02 at 7% APR."; "For the same $750,000 loan at 7% APR, a 2-year interest-only period sets payments at $4,375.00 a month for the first 24 months." State the terms (rate, amortization, term, IO length) in one sentence and the dollar results in the next.
3. FAQ 8 must not say which structure "fits your project"; end after the two links with no recommendation clause.
