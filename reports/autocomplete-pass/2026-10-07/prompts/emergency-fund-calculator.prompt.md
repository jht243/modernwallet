# ROW PROMPT (data only) — emergency-fund-calculator

route: /emergency-fund-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: emergency fund calculator (also: how much emergency fund do i need, emergency savings calculator)
secondary keywords: emergency fund by months of expenses, how long to build an emergency fund, emergency fund target
intent: a person wants a target dollar figure for an emergency fund based on their own essential bills, how much is still missing, and how long it takes to get there.
reader question: "How much emergency fund do I need?"
answer placement: introText paragraph one answers it in a definition sentence; paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: monthly essential costs in seven lines (rent or mortgage, food, utilities, insurance, minimum debt payments, transportation, other must-pay costs), the number of months of expenses to cover (the reader chooses), amount saved so far, monthly deposit, and an optional savings yield (APY).
Outputs: monthly essentials total, emergency fund target, amount still to save, months of expenses covered today, time to reach the target at the entered deposit, and the monthly deposit that would finish in 12 months.
Assumptions the page must state: steady monthly spending and a fixed monthly deposit; any yield is compounded monthly; no inflation or change in bills; the months to cover (6 in the tool) is a placeholder the reader sets, not a recommendation, because the right cushion depends on job stability, household and health.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state a recommended number of months, a survey statistic, a savings-rate benchmark, or a URL. Do not say "experts recommend". The existing guide /guides/how-much-emergency-fund/ covers the common rules of thumb; link to it for that and state no rule-of-thumb figure here.
Worked example (all computed by the calculator with these inputs):
- Monthly essentials $3,000, made up of rent or mortgage $1,500, food $500, utilities $250, insurance $200, minimum debt payments $250, transportation $200, other $100.
- Covering 6 months gives a target of $18,000. Saved so far $3,000, which covers 1.0 month. Still to save $15,000.
- Depositing $400 a month with no yield reaches the target in 38 months (3 years 2 months).
- Finishing in 12 months with no yield would take a deposit of $1,250 a month.
Facts about rules:
- Count only bills that continue after a job loss; discretionary spending is left out of the target.
- A higher yield shortens the time slightly; the tool lets the reader enter any yield; no yield figure is stated on the page.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
(none — use no external links)

## Internal routes it may link (real routes only)
/guides/how-much-emergency-fund/, /compare/sinking-fund-vs-emergency-fund/, /budget/, /guides/how-to-pay-off-debt/, /cd-calculator/

## Coverage
introText: as in the contract. howItWorks: (1) which costs count as essentials and why the target is built from them and not from income, using the $3,000 breakdown, (2) the target and gap, with the months-covered figure, (3) the time-to-goal row and the 12-month deposit row, (4) how a yield changes the timeline (no figure), (5) assumptions stated plainly at the end. No individual advice.

## FAQ questions (verbatim, in this order)
1. How much emergency fund do I need?
2. What counts as an essential expense?
3. Should the target be based on income or expenses?
4. How long does it take to build an emergency fund?
5. Where should I keep my emergency fund?
6. Should I pay off debt or build an emergency fund first?
7. What is the difference between a sinking fund and an emergency fund?
8. Should I include my minimum debt payments?
For question 1 say it depends on the reader's own essentials and the number of months they choose to cover, give the worked example, and link /guides/how-much-emergency-fund/; state no recommended months. For question 5 say a place that is easy to reach and does not lose value when the markets fall is the usual aim, name no product or rate, and link /cd-calculator/ only as a way to model one option. For question 6 link /guides/how-to-pay-off-debt/ and recommend neither order. For question 7 link /compare/sinking-fund-vs-emergency-fund/.

# CORRECTIONS FROM THE PHASE 4 AUDIT (regenerate the whole object applying every item)
1. introText paragraph one must not repeat the word "calculator" as a verb: write "An emergency fund calculator turns your essential monthly bills and the number of months you choose into a savings target." Do not say "calculates".
2. Remove every claim not on the fact list: no late fees, no credit-record damage, no "lenders still expect", no "luxury purchases", no "retirement contributions", no "survive", no "ensures", no "protected from volatility", no "Cash reserves should". FAQ 8 says only that minimum payments continue after a job loss, so the tool counts them in the essentials, with the $250 figure. FAQ 3 says the target is built from essential bills because those are the costs that continue when pay stops, and the tool does not use income. FAQ 5 says the reader wants money they can reach quickly and that does not move with the markets, names no product, and links /cd-calculator/ as a way to model one option.
3. HARD: no sentence may contain more than THREE figures (a figure = any $ amount, %, month or year count). Split the seven-line $3,000 breakdown into two sentences (first four lines, then the last three) and split every worked-example sentence: terms in one sentence, results in the next.
4. howItWorks must reach at least 440 words: expand the time-to-goal and yield paragraphs with plain-language explanation of what each output row means, using only fact-list figures.
5. FAQ 6: say both orders are common and the reader should look at the interest rate on the debt and how stable their income is; give no rule. Link /guides/how-to-pay-off-debt/.
