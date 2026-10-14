# ROW PROMPT (data only) — loan-payment-calculator

route: /loan-payment-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: loan payment calculator (also: loan repayment calculator, monthly loan payment calculator, loan amortization, how is a monthly loan payment calculated)
intent: a borrower with a loan amount, a rate and a term (any fixed-rate installment loan) wants the monthly payment, the total interest, and what an extra monthly payment would save.
reader question: "How is my monthly loan payment calculated?"
answer: A figure: the payment is the loan amount times the monthly rate, divided by one minus (1 plus the monthly rate) raised to the negative number of payments. A $25,000 loan at 8% APR over 5 years is $506.91 a month.
answer placement: section 1 — introText paragraph one says what the calculator returns and the three inputs in its first sentence; paragraph two is the $25,000 worked example. Do not open with a definition of a loan.

## The calculator (describe only what it does)
Inputs: loan amount; APR; term in years; an optional extra payment each month.
Outputs: the monthly payment; total interest; total paid; how the first payment splits between interest and principal; and, when an extra payment is entered, the payoff time with it, the interest saved and the months saved.
Method the page may state: monthly rate r = APR ÷ 12; payments n = years × 12; payment = amount × r ÷ (1 − (1 + r)^−n). At a 0% rate the payment is the amount ÷ n. Each month interest = balance × r and the rest of the payment reduces the balance (amortization). An extra payment goes straight to principal, so later months carry less interest.
Assumptions the page must state: fixed rate, equal monthly payments from the first month, no fees or prepayment penalties; taxes, insurance and lender fees are not included, so a mortgage or car payment runs higher; the amount, rate and term shown are placeholders the reader replaces with the lender's offer. The tool fits any fixed-rate installment loan; mortgages, car loans and personal loans have their own calculators.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state a market-average rate, a lender's terms, a statute, or a statistic.
Worked examples (computed by the calculator):
- $25,000 loan, 8% APR, 5 years (60 payments): $506.91 a month; total paid $30,414.59; total interest $5,414.59. First payment: interest $166.67 ($25,000 × 8% ÷ 12), principal $340.24.
- Same loan with $100 extra each month: paid off in 49 months instead of 60 (11 months sooner); total interest $4,325.29, which is $1,089.30 less.
- Same $25,000 at a 0% rate over 5 years: $416.67 a month (25,000 ÷ 60).
No other figures.

## CLOSED URL LIST — only external hrefs allowed
None. Do not write any external link.

## Internal routes it may link (real routes only)
/personal-loan/ (personal loan calculator), /auto-loan/ (auto loan calculator), /mortgage/ (mortgage calculator), /credit-card-payoff/ (credit card payoff calculator), /debt-consolidation-calculator/ (debt consolidation calculator), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks: (1) the formula with monthly rate and number of payments, using the $25,000 example, (2) amortization: the first payment's $166.67 interest and $340.24 principal and why interest shrinks, (3) the extra-payment case with the 49-month result, (4) the 0% case, (5) what the tool leaves out (taxes, insurance, fees) and which dedicated calculator to use for a mortgage, car loan or personal loan.

## FAQ questions (verbatim, in this order)
1. How is my monthly loan payment calculated?
2. How much is the monthly payment on a $25,000 loan?
3. How much interest will I pay over the life of the loan?
4. What does an extra monthly payment save?
5. How does amortization split each payment?
6. What if the loan has a 0% rate?
7. Does the payment include taxes, insurance or fees?
8. Should I use this or a mortgage, auto or personal loan calculator?
For question 2 give the 5-year 8% figure and say it changes with rate and term. For question 8 link /mortgage/, /auto-loan/ and /personal-loan/.
