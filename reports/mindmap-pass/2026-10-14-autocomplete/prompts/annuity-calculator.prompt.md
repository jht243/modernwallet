# ROW PROMPT (data only) — annuity-calculator

route: /annuity-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: annuity calculator (also: annuity payout calculator, present value of annuity calculator, future value of annuity calculator, annuity due calculator)
intent: someone with a lump sum, a savings plan, or a pension-style stream of payments wants to know what a lump sum pays out each period, what level deposits grow to, or what a stream of payments is worth as one sum today.
reader question: "How can I calculate my annuity?"
answer: A figure: pick the question (payout, growth, or value today), enter the amount, rate, term and payment frequency, and read the result. A $100,000 lump sum paid out over 20 years at 5% gives $659.96 a month.
answer placement: section 1 — introText paragraph one says what the calculator finds in its first sentence and names the three questions; paragraph two is the $100,000 worked example. Do not open with a history of annuities.

## The calculator (describe only what it does)
Inputs: which question to answer (what a lump sum pays, what deposits grow to, what a payment stream is worth today); the lump sum or the payment per period; the annual interest or discount rate; the term in years; payment frequency (monthly, quarterly, semiannual, annual); and whether payments fall at the end of each period (ordinary annuity) or the start (annuity due).
Outputs: the level payment (payout), the ending balance (growth) or the lump-sum value today (present value); the total of all payments; the interest in the result; the number of payments.
Method the page may state: payout payment = lump sum divided by the present-value factor, where the factor is (1 − (1 + i)^−n) ÷ i, i = annual rate ÷ payments per year, n = years × payments per year; growth = payment × ((1 + i)^n − 1) ÷ i; value today = payment × the same present-value factor. For an annuity due, multiply by (1 + i). At a 0% rate the factor is simply n.
Assumptions the page must state: a fixed rate and level payments for the whole term; no fees, taxes or inflation adjustment; it is not an insurer's quote and a real annuity contract also prices life expectancy and the insurer's margin; the 5% rate and the amounts shown are placeholders the reader replaces.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state an insurer's payout rate, a current market rate, a tax rule, a statute, or a statistic.
Worked examples (computed by the calculator):
- Payout: $100,000 lump sum, 5% a year, 20 years, monthly payments at the end of each month (240 payments): $659.96 a month; all payments total $158,389.38; interest in them $58,389.38.
- Same payout with payments at the start of each month (annuity due): $657.22 a month; total $157,732.16.
- Same $100,000 over 10 years instead of 20 (120 payments): $1,060.66 a month; total $127,278.62.
- Same $100,000 at a 0% rate over 20 years: $416.67 a month (100,000 ÷ 240), total $100,000.
- Growth: $500 deposited each month, 6% a year, 20 years (240 deposits): balance $231,020.45; deposits total $120,000; growth $111,020.45.
- Value today: $1,000 a month for 10 years (120 payments) discounted at 5%: worth $94,281.35 today as one sum; the payments total $120,000, so the discount is $25,718.65. With payments at the start of each month the value today is $94,674.19.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
None. Do not write any external link.

## Internal routes it may link (real routes only)
/compare/annuity-vs-cd/ (annuity vs CD), /compare/pension-vs-annuity/ (pension vs annuity), /guides/qlac-qualified-longevity-annuity-contract/ (QLAC explained), /retirement/ (retirement calculator), /inflation-calculator/ (inflation calculator), /cd-calculator/ (CD calculator), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks: (1) the three questions and which inputs each uses, (2) the payout formula and the $100,000 example at 20 years and at 10 years, (3) ordinary annuity vs annuity due with the $659.96 vs $657.22 numbers, (4) the growth example ($500 a month) and the value-today example ($1,000 a month), (5) what the calculator leaves out (fees, taxes, inflation, life expectancy, the insurer's margin; a real contract's quote will differ) and a pointer to the annuity-vs-CD and pension-vs-annuity comparisons.

## FAQ questions (verbatim, in this order)
1. How do I calculate my annuity payment?
2. How much does a $100,000 annuity pay per month?
3. What is the difference between an ordinary annuity and an annuity due?
4. How do I find the present value of an annuity?
5. How do I find the future value of an annuity?
6. Does this annuity calculator give me an insurer's quote?
7. What happens to the payment if the interest rate is 0%?
8. Does the calculator account for inflation or taxes?
For question 2 use only the 20-year and 10-year payout figures and say it depends on the rate and term entered. For question 6 say no and explain what a real contract adds. For question 8 say no and link /inflation-calculator/.
