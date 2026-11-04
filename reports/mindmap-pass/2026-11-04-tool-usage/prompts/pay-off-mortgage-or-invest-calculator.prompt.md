# ROW PROMPT (data only) — pay-off-mortgage-or-invest-calculator

route: /pay-off-mortgage-or-invest-calculator/   chart row: C2
medium: interactive tool → interactive tool   register: operator   page type: explainer (calculator page; intro ~150 words, howItWorks ~480 words, 8 FAQs)
primary keyword: pay off mortgage or invest calculator (also: pay off mortgage vs invest calculator, should i pay off my mortgage or invest)
intent: a homeowner with spare monthly cash wants to know whether extra principal or investing leaves them better off, with their own numbers.
reader question: "Should I pay off my mortgage or invest the money? [PAA 0 returned; ac ~27/37 verdict-pattern completions (should i / is it better / which / what's better); off-jurisdiction rejected: uk, canada, australia, super, pension, shares]"
answer: Prepaying wins when your expected after-tax return is below the break-even return; on a 6.5% loan with $300 extra and a 15% tax on gains that break-even is about 7.2%, and at a 3% mortgage it falls to about 3.4% (verdict with break-even).
answer placement: section 1 — introText paragraph one gives the verdict rule in its first sentence and says what the tool returns; paragraph two is the $300,000 worked example with the break-even.

## The calculator (describe only what it does)
Inputs: current loan balance; mortgage rate; months left; extra cash each month; your expected annual return; tax rate on investment gains. The 7% return and 15% tax rate are placeholders, not a forecast; enter 0% tax for a Roth IRA or other account with no tax on gains.
Outputs: which path ends ahead and by how much (after tax, at the loan's scheduled payoff); break-even return; "Pay off early: invested after tax"; "Invest the extra: invested after tax"; interest saved by paying off early; how much sooner the loan is gone.

## Evidence and attribution (from evidence/pay-off-mortgage-or-invest-calculator/evidence.json, basis: calculated)
We ran a reproducible month-by-month calculation of both paths. Ask for ONE natural attribution beside the first worked-example finding, e.g. "In our internal calculation, we followed the same $300 a month both ways..." then the finding, and that readers can check it by changing the inputs. Do not say "tested". Repeat the basis once in the takeaway.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a market return, an average stock return, a historical return, a statistic, or a URL.
- Method: both paths spend the same cash each month (the mortgage payment plus the extra) until the loan's scheduled payoff date. Paying off early sends the extra to principal; once the loan is gone, the full payment plus the extra is invested every month (including the cash left over in the payoff month). Investing sends the extra to investments every month while the loan runs on schedule. Investments grow monthly at the reader's annual return. At the end, tax is charged on gains (balance minus contributions) at the reader's tax rate. Both homes are paid off at the end, so the comparison is the after-tax invested balance on each path. The break-even return is the annual return at which both paths end equal.
- Worked example (calculator starting figures): $300,000 balance, 6.5% rate, 360 months left, $300 extra a month, 7% return, 15% tax on gains. Monthly payment $1,896.20.
- Paying off early: the loan ends 110 months sooner and saves $135,115.17 in interest; after-tax invested balance at the original payoff date $322,598.79.
- Investing the $300: after-tax balance $314,410.41. Paying off early ends $8,188.38 ahead. Break-even return 7.19%.
- At a 5% return (same loan): paying off early ends $72,807.70 ahead.
- 3% mortgage (same balance, term, $300 extra, 7% return, 15% tax): break-even return 3.40%; investing ends $116,226.56 ahead.
- No tax on gains (0%, e.g. a Roth IRA), 6.5% loan, 7% return: break-even return 6.70%, which equals the loan's effective annual rate; investing ends $14,210.46 ahead.
- Assumptions: returns are steady with no market losses (real returns vary year to year, and investing can lose money while paying off principal cannot); the mortgage-interest deduction is ignored because IRS Publication 936 lets you deduct home mortgage interest only if you itemize deductions on Schedule A (https://www.irs.gov/publications/p936 ); principal and interest only; prepaid principal cannot be taken back out without selling or borrowing against the home.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/publications/p936 (IRS Publication 936). Nothing else.

## Internal routes it may link (real routes only)
/guides/pay-off-mortgage-early-or-invest/ (pay off mortgage early or invest guide), /compare/pay-off-mortgage-vs-invest/ (pay off mortgage vs invest comparison), /mortgage/payoff-calculator/ (mortgage payoff calculator), /biweekly-mortgage-calculator/ (biweekly mortgage calculator, shipping in this run), /emergency-fund-calculator/ (emergency fund calculator). No other internal route.

## Coverage
introText: as in the contract.
howItWorks: (1) the same-cash method and why both homes are paid off at the end; (2) the break-even return and how to read it against your own expected after-fee return; (3) the 3% mortgage counterexample and the no-tax-on-gains case; (4) what the calculator leaves out (market losses, the deduction only if you itemize per IRS Publication 936, liquidity: prepaid principal is hard to get back) and who should not prepay first (no emergency fund: link /emergency-fund-calculator/); (5) takeaway: based on our internal calculation, the rule, the conditions that change it, and the next action (link /guides/pay-off-mortgage-early-or-invest/ for worked examples and /mortgage/payoff-calculator/ to see the new payoff date). End on a concrete next step.

## FAQ questions (verbatim, in this order)
1. Should I pay off my mortgage or invest the money?
2. What return do I need to beat my mortgage rate?
3. Is it better to pay off a 3% mortgage or invest?
4. Does a Roth IRA change the answer?
5. Should I count the mortgage interest deduction?
6. What does the calculator leave out?
7. Should I build an emergency fund before paying extra on my mortgage?
8. What if I pay off the mortgage early and then invest?
