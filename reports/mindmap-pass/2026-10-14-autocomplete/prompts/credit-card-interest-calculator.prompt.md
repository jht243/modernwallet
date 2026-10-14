# ROW PROMPT (data only) — credit-card-interest-calculator

route: /credit-card-interest-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: credit card interest calculator (also: credit card interest per month, how is credit card interest calculated, daily periodic rate, average daily balance)
intent: a cardholder wants to know how much interest a balance will be charged in one billing cycle, how the daily rate and average daily balance produce that number, and what a mid-cycle payment saves.
reader question: "How do I calculate my credit card interest?"
answer: A figure: divide the APR by the days in the year to get the daily rate, multiply by the average daily balance, then by the days in the cycle. A $5,000 balance at 24% APR over a 30-day cycle is charged $98.63.
answer placement: section 1 — introText paragraph one gives the method (daily rate times average daily balance times days in the cycle) in its first sentence; paragraph two is the $5,000 worked example. Do not open with a definition of APR.

## The calculator (describe only what it does)
Inputs: balance at the start of the billing cycle; the purchase APR; days in the billing cycle; days in the year used for the daily rate (365 or 360); an optional payment made during the cycle and the day of the cycle it posts.
Outputs: interest charged this cycle; the daily periodic rate; the average daily balance; what the same APR costs over a year if the balance stays flat; the effective annual rate when interest compounds daily; and, when a payment is entered, how much interest it saves against making no payment.
Method the page may state: daily periodic rate = APR ÷ days in the year. Average daily balance = the average of each day's balance across the cycle (the full balance until the payment posts, the reduced balance from that day on). Interest for the cycle = average daily balance × daily rate × days in the cycle. Effective annual rate if interest compounds daily = (1 + daily rate)^days in the year − 1.
Assumptions the page must state: the APR, cycle length and day-count basis come from the reader's statement and the figures shown are placeholders; the tool covers purchase interest only, with no grace period, fees, cash advances or new purchases; issuers differ in how they compound within a cycle and round, so a statement can differ slightly; check the cardholder agreement.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state a market-average APR, a statute, a CARD Act rule, or a statistic.
Worked examples (computed by the calculator):
- $5,000 balance, 24% APR, 30-day cycle, 365-day year, no payment: daily rate 0.0658% (24 ÷ 365); average daily balance $5,000; interest this cycle $98.63; the same balance held for a year costs $1,200 in simple interest; effective annual rate with daily compounding 27.11%.
- Same balance on a 360-day basis: interest this cycle $100.00 (daily rate 0.0667%).
- Same $5,000 with a $1,000 payment posting on day 11 of the 30-day cycle: 10 days at $5,000 and 20 days at $4,000, so average daily balance $4,333.33 and interest $85.48; that is $13.15 less than the $98.63 with no payment.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
None. Do not write any external link.

## Internal routes it may link (real routes only)
/credit-card-payoff/ (credit card payoff calculator), /guides/how-long-to-pay-off-credit-card/ (how long to pay off a card), /guides/good-apr-for-credit-card/ (what a good card APR is), /guides/how-to-choose-a-balance-transfer-credit-card/ (balance transfer cards), /compare/debt-snowball-vs-avalanche/ (snowball vs avalanche), /interest-per-day/ (interest per day calculator), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks: (1) daily periodic rate and the 365 vs 360 basis with the 24% example, (2) average daily balance and why payment timing matters, with the day-11 example, (3) interest for the cycle and the $98.63 result, (4) the yearly view: $1,200 simple vs 27.11% effective annual rate with daily compounding, (5) what the tool leaves out (grace period, fees, cash advances, new purchases, issuer rounding) and pointers to the payoff calculator and the APR guide.

## FAQ questions (verbatim, in this order)
1. How do I calculate my credit card interest?
2. How much interest will a $5,000 balance cost in a month?
3. What is the daily periodic rate?
4. What is the average daily balance?
5. Does paying early in the billing cycle lower my interest?
6. Why is the effective annual rate higher than my APR?
7. Why does my statement show a slightly different amount?
8. Does this calculator include a grace period or fees?
For question 7 mention the 365 vs 360 basis ($98.63 vs $100.00) and issuer rounding. For question 8 say no and link /credit-card-payoff/ for paying a balance down.
