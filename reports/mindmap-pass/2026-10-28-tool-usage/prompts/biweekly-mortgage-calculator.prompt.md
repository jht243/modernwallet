# ROW PROMPT (data only) — biweekly-mortgage-calculator

route: /biweekly-mortgage-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; intro ~150 words, howItWorks ~500 words, 8 FAQs)
primary keyword: biweekly mortgage calculator (also: is a biweekly mortgage payment worth it, biweekly mortgage payments, are biweekly mortgage payments better)
intent: a homeowner (often offered a biweekly plan by a lender or servicer) wants to know how much paying every two weeks saves and whether a paid plan is worth it.
reader question: "Is a biweekly mortgage payment worth it?" [PAA 0/0 returned; ac 51 completions incl. "is a biweekly mortgage payment worth it", "are biweekly mortgage payments better", "do biweekly mortgage payments work"; head term 1,900/mo KD 0 measured, DataForSEO US 2026-10-28]
answer: A verdict with the break-even. Paying half your payment every two weeks makes 26 half-payments, or 13 full payments, a year, so the extra payment cuts years and interest. On a $300,000 30-year loan at 6.5%, biweekly payments save about $88,122 of interest and end the loan in about 24 years and 2 months. Adding 1/12 of the payment each month saves almost the same, about $87,256, with no plan or fee, so a paid plan is worth it only when its fees are small next to the saving.
answer placement: section 1 — introText paragraph one gives the verdict and why; paragraph two is the $300,000 worked case. Do not open with a definition of biweekly payments.

## The calculator (describe only what it does)
Inputs: loan balance; interest rate; years left; "Plan setup fee (if any)"; "Fee per biweekly payment". Defaults: $300,000, 6.5%, 30 years, $0, $0.
Outputs: interest saved by biweekly payments and how much sooner the loan ends; the half-payment and the monthly payment; payoff time and total interest for monthly payments, for biweekly payments, and for monthly payments plus 1/12 extra; when fees are entered, the total fees and the net saving after fees compared with the 1/12-extra approach.
Method the page may state: monthly payment = balance × r ÷ (1 − (1 + r)^−n), with r the annual rate ÷ 12 and n the months left. Biweekly: half that payment every two weeks, 26 times a year, with interest at the annual rate ÷ 26 per two-week period. Monthly + 1/12: the monthly payment plus one twelfth of it each month. Fees = setup fee + fee per payment × the number of biweekly payments.
Assumptions the page must state: fixed-rate loan; principal and interest only (taxes, insurance and PMI left out); the servicer applies each half-payment when it arrives, and a servicer that holds half-payments until a full payment builds up saves less than shown; the calculator does not know any lender's fees.
Provenance (calculated, internal calculation): "In our internal calculation, we ran a range of balances, rates and terms through three payment schedules (monthly, biweekly, and monthly plus 1/12) in two separate programs and compared the interest each one pays." Both programs agreed on every scenario below. These are calculated scenarios, not tests of any lender's plan and not client cases. Tell the reader they can enter the same numbers in the calculator above to check them.
Takeaway (in howItWorks, near the end): biweekly payments work because they add one extra monthly payment a year; you get nearly the same saving by adding 1/12 of your payment each month yourself, for free; pay for a biweekly plan only if its fees are small next to the interest saved and the servicer credits half-payments when they arrive. Conditions that change it: a prepayment penalty on the loan, a short time left on the loan, or higher-rate debt the same money could pay off first. Not financial advice.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a lender's fee, a typical fee, a mortgage rate statistic, a lender name or a URL.
- A biweekly schedule is 26 half-payments a year, which equals 13 full monthly payments instead of 12 (arithmetic: 52 weeks ÷ 2 = 26).
- Consumer Financial Protection Bureau (CFPB), "What is a prepayment penalty?": some mortgages charge a fee for paying off all or part of the loan early; check the loan documents before paying extra. Source: https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/
- Calculated scenarios (fixed rate, principal and interest; both programs agree):
  1. $300,000 at 6.5%, 30 years: monthly payment $1,896.20; monthly schedule 360 payments, $382,633 interest. Biweekly: $948.10 every two weeks, 628 half-payments, paid off in about 24 years and 2 months, $294,512 interest, saving $88,122. Monthly + 1/12 ($158 extra a month): paid off in 290 months, saving $87,256.
  2. Same loan with a $395 setup fee and $2.50 per payment: fees $1,965, net saving $86,157.
  3. Same loan with $9.95 per payment: fees $6,249, net saving $81,873, below the $87,256 saved by adding 1/12 yourself.
  4. $200,000 at 4%, 30 years: biweekly saves $22,553 and ends about 4 years and 1 month sooner.
  5. $400,000 at 7%, 30 years: biweekly saves $137,851 and ends about 6 years and 3 months sooner.
  6. $250,000 at 6.5% with 15 years left: biweekly saves $19,887 and ends about 1 year and 10 months sooner.
  7. $150,000 at 6% with 10 years left: biweekly saves $5,717 and ends 1 year sooner.
  8. Counterexample: at a 0% rate, biweekly payments save no interest; they only end the loan sooner (about 27 years and 8 months instead of 30 on $300,000).
- Do not state any other figure.

## CLOSED URL LIST — only external hrefs allowed
https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/ (CFPB: What is a prepayment penalty?). Nothing else.

## Internal routes it may link (real routes only)
/mortgage/extra-payment-calculator/ (mortgage extra payment calculator: a flat extra amount each month), /mortgage/payoff-calculator/ (mortgage payoff calculator), /mortgage-recast-calculator/ (mortgage recast calculator: a lump sum that lowers the payment), /mortgage/ (mortgage payment calculator). No other internal route.

## Coverage
introText: as in the contract. howItWorks (4-5 paragraphs): (1) why biweekly saves money (26 half-payments = 13 payments) with the visible internal-calculation attribution at the first finding (scenario 1); (2) the three schedules side by side and how the formula and the rate ÷ 26 assumption work; (3) fees: scenarios 2 and 3 against the free 1/12 approach, and the prepayment-penalty check (CFPB); (4) when biweekly helps less: shorter time left (scenarios 6, 7), a servicer that holds half-payments, the 0% counterexample, higher-rate debt elsewhere; point to /mortgage/extra-payment-calculator/ for a flat extra amount and /mortgage-recast-calculator/ for a lump sum; (5) the takeaway.
Who this is not for: someone with an adjustable-rate loan (the calculator assumes a fixed rate), or someone who carries credit-card or other higher-rate debt (paying that first usually saves more).

## FAQ questions (verbatim, in this order)
1. Is a biweekly mortgage payment worth it?
2. Do biweekly mortgage payments really work?
3. Are biweekly mortgage payments better than one extra payment a year?
4. How many years do biweekly payments take off a 30-year mortgage?
5. Does paying biweekly lower my monthly payment?
6. What is the difference between biweekly and bi-monthly payments?
7. Should I pay a fee for a biweekly payment plan?
8. What should I check before switching to biweekly payments?
For question 6 say bi-monthly means twice a month, 24 half-payments a year, which equals 12 full payments and so adds no extra payment (arithmetic only). For question 8 mention the prepayment-penalty check (CFPB) and asking the servicer how it applies half-payments; do not name any lender.
