# ROW PROMPT (data only) — debt-consolidation-calculator

route: /debt-consolidation-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: debt consolidation calculator (also: debt consolidation loan calculator)
secondary keywords: is debt consolidation worth it, debt consolidation interest savings, consolidation loan origination fee
intent: a borrower with several high-rate debts wants to know whether one consolidation loan lowers the monthly payment and the total interest compared with keeping the debts as they are, after any fee.
reader question: "Will a debt consolidation loan save me money?"
answer placement: introText paragraph one answers it in a definition sentence; paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: up to four debts, each with a balance, APR and the monthly payment made today; the new loan's APR, term in months, and origination fee as a percent of the loan.
Outputs: new monthly payment, new loan amount, origination fee in dollars, interest on the new loan, total interest if the debts are kept at today's payments, payoff time at today's payments, how much consolidating costs less or more once the fee is counted, and the monthly payment change.
Assumptions the page must state: fixed rates; no new borrowing on any card; the borrower keeps paying today's amounts on the old debts; the fee is taken out of the loan proceeds so the new loan is sized to cover the balances plus the fee; a longer new term lowers the payment but can raise total interest; rates, fees and eligibility are set by each lender and the rate, term and fee in the tool are placeholders, not quotes.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state a typical consolidation rate, credit-score cutoff, fee range, or URL; say lenders set these and tell the reader to compare real offers.
Worked example (all computed by the calculator with these inputs):
- Three debts: $8,000 at 24% APR paying $250 a month; $5,000 at 19% APR paying $150 a month; $3,000 at 29% APR paying $100 a month. Total balance $16,000; total payments $500 a month.
- Keeping them: the last debt is cleared in 55 months (4 years 7 months), with $9,469.39 in total interest.
- New loan: 12% APR, 48-month term, 3% origination fee. Fee $494.85, so the loan is $16,494.85. Monthly payment $434.37, which is $65.63 a month less than today. Interest on the new loan $4,355.04.
- Counting the fee, consolidating costs $4,849.89 in interest and fee against $9,469.39, which is $4,619.50 less.
Facts about rules:
- If a debt's monthly payment is no larger than its monthly interest, that debt never reaches zero at that payment; the tool flags it.
- A lower payment can come from a longer term rather than a lower rate; compare total interest, not only the payment.
- Consolidating does not erase the debt; new charges on a paid-off card can rebuild the balance.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
(none — use no external links)

## Internal routes it may link (real routes only)
/credit-card-payoff/, /personal-loan/, /guides/how-to-pay-off-debt/, /compare/debt-snowball-vs-avalanche/, /guides/how-to-choose-a-balance-transfer-credit-card/, /compare/heloc-vs-personal-loan/

## Coverage
introText: as in the contract. howItWorks: (1) how the tool plays each debt forward month by month at today's payment, using the 55-month and $9,469.39 figures, (2) how the new loan is sized with the fee and what the payment is, (3) the cost comparison counting the fee, (4) why the payment and the total cost can move in different directions, (5) assumptions stated plainly at the end. No individual advice.

## FAQ questions (verbatim, in this order)
1. Does debt consolidation save money?
2. How does a debt consolidation loan work?
3. How is the new loan amount calculated?
4. Does an origination fee change the math?
5. Is a lower monthly payment always better?
6. What debts can you consolidate?
7. What is the difference between debt consolidation and a balance transfer?
8. Should I consolidate or use the snowball or avalanche method?
For question 7 link /guides/how-to-choose-a-balance-transfer-credit-card/; for question 8 link /compare/debt-snowball-vs-avalanche/ and recommend neither. For question 6 say lenders decide which debts they allow and name only general kinds such as credit cards and personal loans. For question 2 link /personal-loan/.

# CORRECTIONS FROM THE PHASE 4 AUDIT (regenerate the whole object applying every item)
1. Remove claims not on the fact list: do not say "Lenders usually deduct an origination fee"; say "In this tool the fee is taken out of the loan proceeds, so the new loan is sized to cover the balances plus the fee." Remove "substantially lower", "typically", "common eligible accounts include ... other unsecured balances" (FAQ 6 may name only credit cards and personal loans as general kinds, and must say each lender decides). Do not use the phrase "debt consolidation interest savings" or "total debt consolidation". Say "interest saved".
2. FAQ 4 must say the fee raises the loan and the cost of borrowing, give the $494.85 figure, and say that in this example consolidating still costs $4,619.50 less once the fee is counted, with no statement about why the rate is lower.
3. FAQ 1 must start with "It can, but only when the new loan costs less in total, not just per month." then give the example figures in short sentences.
4. HARD: no sentence may contain more than THREE figures (a figure = any $ amount, %, month or year count). In intro paragraph two, split into at least five sentences: the three debts (one sentence each or two debts then one), the totals, the keep-them result, the new loan terms, the new loan results.
5. howItWorks must reach at least 440 words: add plain-language explanation of the month-by-month simulation and of what the cost comparison row means, using only fact-list figures. Do not open two paragraphs with the same word. Do not use "To see if debt consolidation is worth it".
