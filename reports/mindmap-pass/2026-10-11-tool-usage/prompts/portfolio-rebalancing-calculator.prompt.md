# ROW PROMPT (data only) — portfolio-rebalancing-calculator

route: /portfolio-rebalancing-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: portfolio rebalancing calculator (also: rebalance portfolio calculator, rebalancing calculator, portfolio allocation calculator)
secondary keywords: how much to buy and sell to rebalance, rebalance with new money, asset allocation calculator
intent: an investor who has drifted from their target mix wants the exact dollar amount to buy or sell in each holding to get back on target, or how to steer new money so they do not have to sell.
reader question: "How much of each fund do I buy or sell to get back to my target allocation?" [verb-only — no PAA, no completions]
answer: A figure: for each holding, its target percentage times the portfolio total minus what it is worth now is the dollar amount to buy (positive) or sell (negative).
answer placement: section 1 — introText paragraph one gives that rule in its first sentence; paragraph two is the worked example. Do not open with a definition of asset allocation.

## The calculator (describe only what it does)
Inputs: for each of four holdings (Stocks, Bonds, Real estate / other, Cash) the value now and a target percentage; optional new money to invest; a checkbox "Use new money only — don't sell anything".
Outputs: a table of each holding's current percentage, target percentage and the dollars to buy or sell; total buys and sells; portfolio value now and after. A note appears when the targets do not add up to 100%.
Method the page may state: target value = target percentage × (current total + new money); trade = target value − current value. In new-money-only mode nothing is sold: new money goes to holdings below target in proportion to how far below each one is; if there is more than enough, the remainder is split by target percentage; if not enough, the portfolio ends closer to target but not on it.
Assumptions the page must state: pure arithmetic on the reader's numbers; selling in a taxable account can trigger capital gains tax and trades can have costs, neither modeled; the tool does not recommend a target mix; rebalancing inside a tax-advantaged account or with new money avoids the sale question (say this as a general point, no figures).

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state a recommended allocation, a historical return, a rebalancing threshold percentage, a tax rate, or a provider's figure. The guide /guides/portfolio-rebalancing/ covers when and how often to rebalance; link it for that and state no threshold here.
Worked example (computed by the calculator; the tool's default numbers):
- Now: Stocks $70,000, Bonds $25,000, Cash $5,000, total $100,000 — that is 70% / 25% / 5%.
- Target: 60% Stocks, 35% Bonds, 5% Cash.
- Buy-and-sell mode with no new money: sell $10,000 of Stocks and buy $10,000 of Bonds; Cash needs no trade.
- New-money-only mode with $10,000 to invest: $9,642.86 goes to Bonds and $357.14 to Cash, nothing is sold, and the mix ends at about 63.6% / 31.5% / 4.9%, closer to target but not on it.
- New-money-only mode with $30,000 to invest: $8,000 to Stocks, $20,500 to Bonds and $1,500 to Cash lands the $130,000 portfolio exactly on 60% / 35% / 5%.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.investor.gov/introduction-investing/investing-basics/glossary/rebalancing (SEC Investor.gov glossary: rebalancing)
https://www.investor.gov/introduction-investing/getting-started/asset-allocation (SEC Investor.gov: asset allocation)
Use these only as "where to read more" links. Attribute no specific number to them.

## Internal routes it may link (real routes only)
/guides/portfolio-rebalancing/ (when and how often), /portfolio/60-40-portfolio-calculator/ (return and risk of a mix), /portfolio/, /expense-ratio-calculator/

## Coverage
introText: as in the contract. howItWorks: (1) the target-value formula in words, (2) the buy-and-sell example, (3) new-money-only mode and why it can fall short, with the $10,000 example, (4) the $30,000 example that lands exactly on target, (5) assumptions: taxes and costs not modeled, no target recommended (link /guides/portfolio-rebalancing/ for when to rebalance), targets must add to 100%. Link /portfolio/60-40-portfolio-calculator/ once for readers who want the expected return and risk of their mix.

## FAQ questions (verbatim, in this order)
1. How do I calculate how much to rebalance?
2. Can I rebalance without selling?
3. How often should I rebalance my portfolio?
4. Does rebalancing trigger taxes?
5. What if my target percentages don't add up to 100%?
6. Can I use this for a 60/40 portfolio?
7. Does the calculator recommend an allocation?
8. Where can I learn more about rebalancing?
For question 3 state no threshold or schedule and link /guides/portfolio-rebalancing/. For question 4 say selling in a taxable account can trigger capital gains tax and the tool does not model it; no rates. For question 6 say set Stocks 60 and Bonds 40 and link /portfolio/60-40-portfolio-calculator/. For question 8 link https://www.investor.gov/introduction-investing/investing-basics/glossary/rebalancing.
