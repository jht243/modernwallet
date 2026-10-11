# ROW PROMPT (data only) — expense-ratio-calculator

route: /expense-ratio-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: expense ratio calculator (also: total expense ratio, mutual fund fee calculator, etf expense ratio calculator, investment fee calculator)
secondary keywords: how much do fund fees cost over 30 years, expense ratio difference, fee drag
intent: a person wants to see how much two funds with different annual expense ratios differ in ending balance over the years, using their own contributions and return assumption.
reader question: "How much does an expense ratio cost over time?"
answer placement: introText paragraph one answers it in a definition sentence; paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: starting balance, monthly contribution, years invested, an assumed return before fund costs, and the annual expense ratio of Fund A and of Fund B.
Outputs: the ending balance of each fund, the dollar gap between them, the growth each ratio takes compared with a no-fee benchmark, the no-fee ending balance, and the total put in.
Method the page may state: each ratio is subtracted from the assumed return to give a net annual return; the net return compounds monthly; each contribution is added at the end of the month.
Assumptions the page must state: one steady assumed return every year; the 7% return and both ratios in the tool (0.05% and 1%) are placeholders the reader replaces, not typical or recommended values; the ratio is the only difference between the two funds, so trading costs, sales loads, taxes and differences in holdings are not modeled; a fund's real expense ratio is in its prospectus or fact sheet.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state a typical, average or recommended expense ratio, a fund name, a historical return, or a Vanguard/Fidelity/other provider figure. The existing guide /guides/what-is-a-good-expense-ratio/ covers what counts as a good ratio; link it for that and state no benchmark here.
Worked example (all computed by the calculator with these inputs):
- Starting balance $10,000, monthly contribution $500, 30 years, assumed return before fund costs 7%.
- Total put in over the 30 years: $190,000.
- With no fund cost the ending balance is $660,849.
- Fund A at a 0.05% expense ratio ends at $654,429, so the ratio takes $6,419 of growth.
- Fund B at a 1% expense ratio ends at $544,691, so the ratio takes $116,157 of growth.
- Fund A ends $109,738 higher than Fund B.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.investor.gov/introduction-investing/investing-basics/glossary/expense-ratio (SEC Investor.gov glossary entry on expense ratio)
https://www.investor.gov/introduction-investing/investing-basics/glossary/mutual-fund-fees-and-expenses (SEC Investor.gov glossary entry on mutual fund fees and expenses)
Use these only as "where to read more" links. Attribute no specific claim, number or definition wording to them.

## Internal routes it may link (real routes only)
/guides/what-is-a-good-expense-ratio/, /compare/etf-vs-mutual-fund/, /compare/index-fund-vs-etf/, /compare/index-fund-vs-mutual-fund/, /investing/, /compound-interest-calculator/, /retirement/

## Coverage
introText: as in the contract. howItWorks: (1) what an expense ratio is (an annual percentage of fund assets taken out of the fund) and how the tool subtracts it from the assumed return, (2) the $190,000 put in and the no-fee $660,849 benchmark, (3) Fund A and Fund B results and the gap, with the cost-of-ratio rows, (4) why the gap grows over time (the cost compounds with the balance) in plain words with no extra figures, (5) assumptions stated plainly at the end, including that a lower ratio does not guarantee a higher return. No individual advice, no fund recommendations.

## FAQ questions (verbatim, in this order)
1. How much does an expense ratio cost over time?
2. How is an expense ratio calculated?
3. Where do I find a fund's expense ratio?
4. What is a good expense ratio?
5. Do ETFs and mutual funds charge the same expense ratio?
6. Does a lower expense ratio mean a better fund?
7. Does the calculator include other fees?
8. How does the expense ratio affect my return?
For question 3 say the prospectus and fact sheet list it and link https://www.investor.gov/introduction-investing/investing-basics/glossary/expense-ratio. For question 4 give no number and link /guides/what-is-a-good-expense-ratio/. For question 5 state no figures; ETFs and mutual funds both have expense ratios that vary by fund; link /compare/etf-vs-mutual-fund/. For question 6 say no, the ratio is one cost among many and does not predict return. For question 7 name sales loads, trading costs and taxes as not modeled and link https://www.investor.gov/introduction-investing/investing-basics/glossary/mutual-fund-fees-and-expenses.
