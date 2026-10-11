# ROW PROMPT (data only) — inflation-calculator

route: /inflation-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: inflation calculator (also: calculator inflation, calculator for inflation rate, purchasing power calculator)
secondary keywords: what will something cost in 10 years, how much is money worth after inflation, real return after inflation
intent: a person wants to know what an amount of money will cost or buy in the future at an inflation rate they choose, and how inflation changes an investment return.
reader question: "How do I calculate the effect of inflation on money?"
answer placement: introText paragraph one answers it in a definition sentence; paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: an amount in today's dollars, a number of years, an assumed average annual inflation rate, and an optional annual return on the money (0 means the money is held as cash).
Outputs: the future cost of what the amount buys today, what the amount buys later in today's dollars, the share of buying power lost, the years for buying power to halve, the real return after inflation, the ending balance at the return, and that balance in today's dollars.
Formulas the page may state: future cost = amount x (1 + inflation)^years. Buying power later = amount / (1 + inflation)^years. Real return = (1 + nominal return) / (1 + inflation) - 1. Years to halve = ln 2 / ln(1 + inflation).
Assumptions the page must state: one steady inflation rate every year (real inflation changes year to year and differs by what you buy); the 3% in the tool is a placeholder the reader sets, not a forecast; no historical CPI data is built in, so for measured price changes the reader should use the Bureau of Labor Statistics CPI data; taxes and fees on the return are not modeled.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state a historical inflation rate, a Federal Reserve target, a CPI figure, a forecast, or a price for any good. Do not say "experts expect".
Worked example (all computed by the calculator with these inputs):
- $10,000 at 3% a year for 10 years: the same purchases cost $13,439 after 10 years.
- $10,000 held unchanged buys what $7,441 buys today, so it loses 25.6% of its buying power.
- At 3% inflation, buying power halves in about 23.4 years.
- Held as cash (0% return), the real return after inflation is -2.91% a year.
- With a 5% annual return and 3% inflation, the real return is 1.94% a year. The $10,000 grows to $16,289 in future dollars, which is worth $12,121 in today's dollars.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.bls.gov/cpi/ (Bureau of Labor Statistics Consumer Price Index program: where measured price changes are published)
https://www.investor.gov/introduction-investing/investing-basics/glossary/inflation (SEC Investor.gov glossary entry on inflation)
https://www.investor.gov/introduction-investing/investing-basics/glossary/real-rate-return (SEC Investor.gov glossary entry on real rate of return)
Use these only as "where to read more" links. Attribute no specific claim, number or definition wording to them.

## Internal routes it may link (real routes only)
/investing/, /retirement/, /budget/, /cd-calculator/, /compound-interest-calculator/, /high-yield-savings-calculator/

## Coverage
introText: as in the contract. howItWorks: (1) what the tool does with an amount, years and a rate, stating the future-cost formula and the $13,439 result, (2) buying power the other way round, the $7,441 and 25.6% results and the halving time, (3) real return, with the formula and the cash (-2.91%) and 5% (1.94%) cases and the $16,289 and $12,121 results, (4) why the rate is an input and what a single steady rate leaves out, pointing to the BLS CPI page for measured data, (5) assumptions stated plainly at the end. No individual advice.

## FAQ questions (verbatim, in this order)
1. How do I calculate the effect of inflation on money?
2. What is the formula for future cost with inflation?
3. What inflation rate should I enter?
4. What does real return mean?
5. Why does money held as cash lose value?
6. How long does it take for inflation to halve my buying power?
7. Does this calculator use historical CPI data?
8. Can I use this for retirement planning?
For question 3 say the tool does not pick a rate for the reader, that the 3% is a placeholder, that the reader can test several rates, and link https://www.bls.gov/cpi/ for measured price changes; state no historical or forecast rate. For question 8 say it can model how a fixed amount loses buying power over a retirement-length horizon, link /retirement/ for a full projection, and give no advice. Questions 5 and 6 use only the worked example. For question 7 say no, the reader supplies the rate, and link https://www.bls.gov/cpi/.
