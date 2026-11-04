# ROW PROMPT (data only) — biweekly-mortgage-calculator

route: /biweekly-mortgage-calculator/   chart row: C1
medium: interactive tool → interactive tool   register: operator   page type: explainer (calculator page; intro ~150 words, howItWorks ~450 words, 8 FAQs)
primary keyword: biweekly mortgage calculator (also: bi weekly mortgage calculator, biweekly mortgage payment calculator, monthly vs biweekly mortgage)
intent: a homeowner with a fixed-rate mortgage wants to know how much faster biweekly payments pay off the loan and whether a biweekly plan is worth it.
reader question: "How much faster do biweekly mortgage payments pay off my loan? [verb-only - no PAA, no completions; related searches: monthly vs biweekly mortgage calculator, biweekly mortgage calculator with extra payments]"
answer: On a $300,000, 6.5%, 30-year loan, biweekly half-payments end the loan about 70 months (nearly 6 years) sooner and save about $88,100 in interest, and adding 1/12 of a payment each month gets within $865 of that with no plan (figure).
answer placement: section 1 — introText paragraph one answers in its first sentence and says what the tool returns; paragraph two is the $300,000 worked example. No definition paragraph first.

## The calculator (describe only what it does)
Inputs: current loan balance; interest rate; months left; biweekly plan setup fee; fee per biweekly debit (both fees default to $0).
Outputs: how much sooner biweekly payments end the loan; the half-payment every two weeks vs the monthly payment; interest saved (biweekly); paid off in (time); when fees are entered: plan fees over the loan and interest saved after fees; a box "Same 13th payment, no plan" showing interest saved by adding 1/12 of a payment to each monthly payment, the extra per month and when that loan ends; the monthly schedule's length and total interest.
Hint text in the tool: copy the balance, rate and months left from the mortgage statement; the starting figures are placeholders; leave fees at $0 if you set up biweekly payments yourself.

## Evidence and attribution (from evidence/biweekly-mortgage-calculator/evidence.json, basis: calculated)
We ran a reproducible calculation of three payment schedules for the same loan. Ask for ONE natural attribution beside the first worked-example finding, e.g. "In our internal calculation, we ran the same loan three ways..." then what we found, and that readers can check it by changing the inputs in the calculator. Do not say "tested". Repeat the evidence basis once in the takeaway ("Based on our internal calculation...").

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; never state a typical fee for biweekly plans, a statistic, or how a specific servicer handles payments.
- Method: monthly payment = balance × r ÷ (1 − (1 + r)^−n), with r = annual rate ÷ 12 and n = months left. Biweekly: half the monthly payment every two weeks, 26 half-payments a year, which equals 13 monthly payments' worth (26 ÷ 2). Each two-week period accrues the annual rate ÷ 26 in interest, and each half-payment is applied the day it is paid. Do-it-yourself path: the monthly payment plus 1/12 of it each month (also 13 payments' worth a year).
- Worked example (calculator starting figures): $300,000 balance, 6.5% rate, 360 months left. Monthly payment $1,896.20; half-payment $948.10.
- Monthly schedule: 360 months; total interest $382,633.47.
- Biweekly: 628 half-payments, about 289.8 months (24 years 2 months); total interest $294,511.68; interest saved $88,121.78; about 70 months (5 years 10 months) sooner.
- 1/12 extra each month: extra $158.02 a month; loan ends in 290 months (24 years 2 months), 70 months sooner; interest saved $87,256.29. That is $865 less than the biweekly saving (difference $865.49).
- Fee illustration (illustrative inputs, not a market rate): a $400 setup fee plus $2.50 per debit costs $1,970 over the 628 debits, leaving $86,151.78 of interest saved after fees, which is less than the free 1/12-extra path saves.
- Low-rate counterexample: $300,000 at 3% for 360 months: monthly payment $1,264.81; biweekly saves $20,637.30 in interest. At 0% interest, biweekly saves $0 in interest.
- Regulation Z, 12 CFR 1026.36(c)(1): a servicer must credit a full periodic payment as of the date it is received; a servicer may hold a payment smaller than a full periodic payment (a partial payment) in a suspense or unapplied-funds account, must show those funds on the periodic statement, and once enough builds up to cover a full payment it must treat the funds as a payment received. So if a servicer holds half-payments, the real biweekly saving is somewhat smaller than the calculator shows; the 1/12-extra path does not depend on that timing. (Source: https://www.consumerfinance.gov/rules-policy/regulations/1026/36/ )
- The calculator covers fixed-rate loans and principal and interest only; taxes, insurance and escrow are not included.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.consumerfinance.gov/rules-policy/regulations/1026/36/ (Regulation Z 1026.36). Nothing else.

## Internal routes it may link (real routes only)
/mortgage/extra-payment-calculator/ (mortgage extra payment calculator), /mortgage/payoff-calculator/ (mortgage payoff calculator), /mortgage-recast-calculator/ (mortgage recast calculator), /pay-off-mortgage-or-invest-calculator/ (pay off mortgage or invest calculator, shipping in this run), /mortgage/ (mortgage payment calculator). No other internal route.

## Coverage
introText: as in the contract (answer, then the $300,000 example with the 1/12-extra comparison and the attribution sentence).
howItWorks: (1) the formula and the 26 half-payments = 13 payments mechanism; (2) the applied-when-paid assumption and the Regulation Z partial-payment rule, with what to ask your servicer; (3) the free 1/12-extra path and why it gets almost the same result; (4) plan fees and the fee illustration; (5) low-rate counterexample (3% and 0%), who should skip a paid plan (a low-rate loan, a servicer that holds half-payments, a fee that eats the gap) and what would change the answer; (6) takeaway paragraph: based on our internal calculation, the answer, the condition, and the next action (link /mortgage/extra-payment-calculator/ to test another extra amount, and /pay-off-mortgage-or-invest-calculator/ for whether to prepay at all). End on a concrete next step.

## FAQ questions (verbatim, in this order)
1. How much faster will biweekly payments pay off my mortgage?
2. Does paying biweekly really save money?
3. Is a biweekly plan better than paying extra each month?
4. Can my servicer hold my half payments?
5. Is a biweekly mortgage plan worth a fee?
6. Is biweekly worth it on a low-rate mortgage?
7. How much extra do I pay each year with biweekly payments?
8. Does the calculator include taxes and insurance?
