# ROW PROMPT (data only) — heloc-calculator

route: /heloc-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~150 words, howItWorks ~450 words, 8 FAQs
primary keyword: heloc calculator (also: heloc payment calculator, home equity line of credit calculator)
secondary keywords: heloc payment estimator, how much can i borrow with a heloc, heloc interest only payment, heloc draw period vs repayment period
intent: a homeowner wants to know (1) how big a line their equity supports and (2) what the monthly payment is in the draw period and after it.
reader question: "How much is my HELOC payment, and how much can I borrow?"
answer placement: introText paragraph one answers it in a definition sentence; paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: home value, mortgage balance owed, the lender's max combined loan-to-value (CLTV) cap, the amount drawn, the HELOC APR, draw-period years, repayment-period years, draw-period payment type (interest only, or principal and interest), and a rate-rise stress test in extra percentage points.
Outputs: the most the equity supports (home value x CLTV cap minus mortgage), draw-period payment, repayment-period payment, total interest in each phase and overall, CLTV after the draw, the payment increase when repayment starts (interest-only path), and a rate-stress row.
Assumptions the page must state: one lump-sum draw at the start; a fixed rate held for the whole term (real HELOCs are usually variable); no fees, no additional draws, no rate caps. The rate and CLTV cap in the calculator are placeholders the reader replaces with their lender's terms, not quotes.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a rate, cap, limit, fee, benchmark, or URL; if a figure is lender-specific, say it varies by lender and tell the reader to check their lender's offer.
Worked example (all computed by the calculator with these inputs):
- Home value $400,000; mortgage balance $250,000; lender CLTV cap 85%.
- Most the equity supports: $400,000 x 85% = $340,000, minus $250,000 = $90,000.
- Draw $50,000 at 8.5% APR; 10-year draw period; 20-year repayment period.
- CLTV after the draw: ($250,000 + $50,000) / $400,000 = 75%.
- Interest-only draw-period payment: $354.17 a month. Total interest over the 10-year draw period: $42,500.
- Repayment-period payment (principal and interest, 20 years, same 8.5%): $433.91 a month. Total interest over the repayment period: $54,138.79. Payment increase when repayment starts: $79.74 a month.
- Total interest over the whole 30 years on the interest-only path: $96,638.79.
- Same $50,000, principal-and-interest from day one (level payment over 30 years at 8.5%): $384.46 a month; total interest $88,404.43.
- Rate stress: if the rate were 2 points higher (10.5%), interest-only draw payment $437.50 a month, repayment payment $499.19 a month.
Facts about rules:
- IRS Publication 936 says interest on home equity loans and lines of credit is deductible only if the borrowed funds are used to buy, build, or substantially improve the taxpayer's home that secures the loan, and the loan must be secured by the taxpayer's main home or second home and meet other requirements. Tell the reader to ask a tax professional.
- A HELOC is secured by the home; missing payments can put the home at risk of foreclosure (general statement, no numbers).
- Lenders set their own CLTV caps, draw periods, repayment terms, fees and whether the rate is variable. Do not state typical values or ranges.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/publications/p936

## Internal routes it may link (real routes only)
/mortgage/ (mortgage calculator), /mortgage/home-affordability-calculator/, /personal-loan/ (personal loan calculator), /credit-card-payoff/, /budget/, /net-worth/, /interest-per-day/, /compare/home-equity-loan-vs-personal-loan/, /compare/401k-loan-vs-heloc/

## Coverage
introText: as in the contract. howItWorks: (1) the two phases and why the payment changes, (2) the equity limit formula and CLTV, (3) interest-only vs principal-and-interest draw, using the worked-example numbers, (4) the rate-stress row and why variable rates matter, (5) a plain note on the tax-deduction rule from IRS Publication 936 and to ask a professional. Describe rules and trade-offs; give no individual advice.

## FAQ questions (verbatim, in this order)
1. How much can I borrow with a HELOC?
2. How is a HELOC payment calculated?
3. What is the difference between the draw period and the repayment period?
4. Why does my HELOC payment go up when the repayment period starts?
5. What is CLTV and why does it matter for a HELOC?
6. Is HELOC interest tax deductible?
7. What happens to my HELOC payment if interest rates rise?
8. Should I use a HELOC, a home equity loan, or a personal loan?
For question 8 link the home-equity-loan-vs-personal-loan comparison and the personal loan calculator; do not recommend one.

# CORRECTIONS FROM THE PHASE 4 AUDIT (regenerate the whole object applying every item)
1. howItWorks must state, in plain sentences, the calculator's assumptions: one lump-sum draw at the start, one fixed rate for the whole term, no fees, no extra draws, no rate caps; and that the rate and CLTV cap in the tool are placeholders, not quotes. Put this at the end of the rate-stress paragraph.
2. Do not state product mechanics that are not on the fact list. Never say HELOCs "lock" the line, never say what a home equity loan's rate type is, never say a personal loan needs no collateral. Say "many HELOCs" where you describe draw/repayment mechanics, and say lenders set their own rates, terms and fees. FAQ 8 must be short: say lenders set their own rates, terms and fees for each product so the reader should compare actual offers, then give the two links. Do not say HELOC rates are variable as a fact; say "many HELOCs carry variable rates" and that the calculator holds one rate for the whole term.
3. metaTitle must not say "Payoff". Use "HELOC Calculator: Payments, Borrowing Limit & Interest".
4. howItWorks must reach at least 450 words. Add a paragraph on the "Principal and interest" draw option: the payment does not jump because principal is repaid from the first month, using the $384.46 and $88,404.43 figures.
5. No filler: do not use "distinct", "simply", or a bridging sentence like "Tax deductibility rules add another financial consideration". Start the tax paragraph with "According to IRS Publication 936". Write that the payment rises at repayment "if the draw period was interest-only". Split the last sentence of intro paragraph two after "$54,138.79" so no sentence holds more than three figures.
6. FAQ 5 must say why CLTV matters: the lender's cap times your home value, minus your mortgage, sets the maximum line.
