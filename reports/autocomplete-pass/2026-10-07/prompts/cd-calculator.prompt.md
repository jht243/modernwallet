# ROW PROMPT (data only) — cd-calculator

route: /cd-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: cd calculator (also: certificate of deposit calculator, cd interest calculator)
secondary keywords: cd early withdrawal penalty, cd interest after tax, how much does a cd earn, cd maturity value
intent: a saver comparing or holding a certificate of deposit wants to know the balance at maturity, the interest earned, how much of it is left after tax, and what an early withdrawal would cost.
reader question: "How much will my CD be worth when it matures?"
answer placement: introText paragraph one answers it in a definition sentence; paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: deposit, CD rate as an APY, term in months, the reader's tax rate on interest, an early-withdrawal penalty entered as a number of months of interest, and an optional month to withdraw early.
Outputs: balance at maturity, interest earned, interest after tax, total return over the term, average interest per month, and, when an early-withdrawal month is entered, the interest accrued by then, the penalty, and the net balance received.
Assumptions the page must state: the APY is fixed for the whole term; APY already includes compounding, so the balance is the deposit multiplied by (1 + APY) raised to the number of years; no additional deposits; the penalty is modeled as a set number of months of interest on the deposit at the APY, and banks calculate penalties differently so the reader should enter the figure from their CD disclosure; one flat tax rate is applied to the interest. The APY, tax rate and penalty in the tool are placeholders, not quotes.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a rate, penalty norm, term norm, tax bracket, insurance limit, or URL; if a figure is bank-specific, say it varies by bank and tell the reader to check the CD disclosure.
Worked example (all computed by the calculator with these inputs):
- Deposit $10,000; APY 4.5%; term 12 months; tax rate 22%.
- Balance at maturity: $10,450.00. Interest earned: $450.00. Interest after a 22% tax rate: $351.00. Total return: 4.5%. Average interest per month: $37.50.
- Same deposit and APY held 60 months (5 years): balance at maturity $12,461.82; interest earned $2,461.82.
- Early withdrawal example (12-month CD, withdrawn at month 6, penalty of 3 months of interest): interest accrued by month 6 is $222.52; penalty $112.50; net balance received $10,110.02; net gain against the deposit $110.02.
Facts about rules:
- APY is the annual percentage yield and already reflects compounding within the year.
- Banks set their own early-withdrawal penalties and some calculate them differently; check the CD disclosure. Do not state typical penalty lengths.
- CD interest is generally taxed as ordinary income; the page may link /guides/is-savings-and-cd-interest-taxable/ for the tax detail. State no tax brackets.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
(none — use no external links)

## Internal routes it may link (real routes only)
/guides/is-savings-and-cd-interest-taxable/, /compare/cd-vs-money-market/, /compare/cd-vs-treasury-bill/, /guides/how-much-emergency-fund/, /investing/

## Coverage
introText: as in the contract. howItWorks: (1) how APY turns into a maturity balance, using the 12-month and 60-month figures, (2) the after-tax figure and what it assumes, (3) the early-withdrawal row and its penalty assumption, (4) how to read the result when comparing CDs (compare APY to APY, term to term), (5) the assumptions stated plainly at the end. Describe rules and trade-offs; give no individual advice.

## FAQ questions (verbatim, in this order)
1. How do you calculate CD interest?
2. How much does a $10,000 CD earn?
3. What is the difference between APY and interest rate on a CD?
4. Is CD interest taxable?
5. What happens if I withdraw from a CD early?
6. Does a longer CD term always earn more?
7. How is a CD different from a money market account?
8. How does a CD compare with a Treasury bill?
For question 3 say APY includes compounding and the plain rate does not, without stating any figure beyond the worked example. For question 4 link /guides/is-savings-and-cd-interest-taxable/. For question 7 link /compare/cd-vs-money-market/, for question 8 link /compare/cd-vs-treasury-bill/; do not recommend either.

# CORRECTIONS FROM THE PHASE 4 AUDIT (regenerate the whole object applying every item)
1. Remove every claim not on the fact list: no "guaranteed" rate, nothing about money market rates being variable, nothing about Treasury bills being sellable on a secondary market or issued by the federal government beyond the words "Treasury bill", nothing about taxes being due "in the year it accrues" or about federal and state taxes. FAQ 7 and 8 say only that the products differ in terms and access, that the reader should compare actual offers, and link the comparison. FAQ 6: say a longer term earns more dollars only when the APY is the same, using the $450.00 and $2,461.82 figures, and that banks set a different APY for each term.
2. HARD: no sentence may contain more than THREE figures (a figure = any $ amount, %, month or year count). State the terms in one sentence ("A $10,000 deposit at a 4.5% APY for 12 months.") and the results in the next. This applies to intro paragraph two, every howItWorks paragraph, and every FAQ answer.
3. Never write the phrase "applicable state". Do not use "specific underlying assumptions" or "serve as placeholders". The last howItWorks paragraph must say: "The APY, tax rate and penalty in the calculator are placeholders, not quotes. Replace them with the figures in your bank's CD disclosure."
4. howItWorks must reach at least 440 words: add plain-language explanation of what APY means for the maturity formula and what each result row shows, using only fact-list figures. Do not open two paragraphs with the same word.
5. Do not recommend anything and do not use "evaluate", "breakdown", "strategies", or "asset allocation".
