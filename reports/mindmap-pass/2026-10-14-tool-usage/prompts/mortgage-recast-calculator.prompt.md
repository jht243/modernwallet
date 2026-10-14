# ROW PROMPT (data only) — mortgage-recast-calculator

route: /mortgage-recast-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; intro ~140 words, howItWorks ~420 words, 8 FAQs)
primary keyword: mortgage recast calculator (also: recast mortgage, recasting a mortgage, recast vs extra payment)
intent: a homeowner with a lump sum (bonus, inheritance, home sale proceeds) wants to know how much their monthly payment drops if they recast, and whether prepaying without a recast saves more.
reader question: "How much will my payment drop if I recast my mortgage?" [PAA 2/6 recast pros/cons; 2/6 pay-off-faster; ac 1/1]
answer: A figure: a recast re-amortizes the lower balance over the same months left at the same rate. $238,000 at 6.875% with 312 months left: a $30,000 lump sum drops the payment from $1,639.33 to $1,432.69, $206.64 a month less.
answer placement: section 1 — introText paragraph one says what a recast does to the payment in one sentence and what the tool returns; paragraph two is the $238,000 worked example. Do not open with a definition of mortgage recasting beyond that one sentence.

## The calculator (describe only what it does)
Inputs: current loan balance; interest rate; months left; lump sum toward principal; lender's recast fee.
Outputs: new payment after the recast and how much it drops; new balance; interest saved by the recast; when a fee is entered, how many months of savings earn it back and the interest saved after the fee; the same lump sum prepaid without a recast: interest saved, the new payoff time and how much sooner.
Method the page may state: payment = balance × r ÷ (1 − (1 + r)^−n), r = rate ÷ 12, n = months left. A recast uses the new balance with the same r and n. Prepaying without a recast keeps the old payment on the lower balance, so the loan ends sooner.
Assumptions the page must state: fixed-rate loan, principal and interest only (taxes and insurance not included); the recast fee and minimum lump sum are set by the servicer, so the reader asks the servicer; not every loan can be recast, the servicer decides, and many servicers do not recast government-backed loans such as FHA and VA loans.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state a typical recast fee, a typical minimum lump sum, a market rate, a statute, or a statistic.
Worked examples (computed by the calculator):
- $238,000 balance, 6.875%, 312 months left (26 years): payment $1,639.33 principal and interest.
- Recast with a $30,000 lump sum: new balance $208,000; new payment $1,432.69; $206.64 a month less; $34,471.26 interest saved over the remaining 312 months.
- With a $250 fee entered: the fee is earned back in 2 months; $34,221.26 interest saved after the fee.
- The same $30,000 prepaid with no recast: keep paying $1,639.33 and the loan ends in 228 months, 84 months (7 years) sooner, saving $109,002.12 in interest.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
None. Do not write any external link.

## Internal routes it may link (real routes only)
/mortgage/payoff-calculator/ (mortgage payoff calculator), /mortgage/early-payoff-calculator/ (early payoff calculator), /mortgage/ (mortgage calculator), /guides/pay-off-mortgage-early-or-invest/ (pay off mortgage early or invest), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks: (1) the payment formula and the recast example; (2) the fee and how fast the lower payment earns it back; (3) recast vs prepaying without a recast: the 84-month and $109,002.12 comparison, and that a recast trades interest savings for a lower required payment; (4) who a recast fits (someone who wants a lower required payment, for example after a home sale or a drop in income) and who should prepay instead (someone who wants the loan gone sooner); (5) limits: fixed-rate only, servicer decides eligibility, government-backed loans often cannot be recast, taxes and insurance excluded. Link /mortgage/payoff-calculator/ for monthly extra payments and /guides/pay-off-mortgage-early-or-invest/ for the invest-instead question.
Who this is not for: a borrower who wants to shorten the loan rather than lower the payment — they should prepay; say so.
What would change the answer: a high recast fee relative to the monthly savings, or a loan the servicer will not recast.

## FAQ questions (verbatim, in this order)
1. How much will my payment drop if I recast my mortgage?
2. What are the downsides of recasting a mortgage?
3. What are the benefits of recasting?
4. Is it better to recast or just pay extra principal?
5. How long does it take to earn back a recast fee?
6. Can every mortgage be recast?
7. Does recasting change my interest rate or loan term?
8. How do I cut years off my mortgage instead?
For question 8 link /mortgage/payoff-calculator/.
