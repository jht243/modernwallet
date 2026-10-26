# ROW — card-issuer-profit

route: /guides/how-credit-card-companies-make-money/
slug: how-credit-card-companies-make-money
page type: explainer/guide (finance YMYL; reporter-plus-analysis register)
depth floor: 1100 body words
medium: text + one markdown table
register: operator
primary keyword: how credit card companies make money
secondary/semantic keywords: how credit card companies profit from debt, how do credit card companies make money if you pay in full, credit card interchange fees, credit card interest revenue, why credit card issuers want you to carry a balance
reader question: "How do credit card companies make money if you pay your balance in full?" [verb-only on SERP (DataForSEO unavailable this run); Autocomplete question sweep: 9/11 completions are "how do credit card companies make money if you pay in full / on time / on 0 interest / with rewards / on balance transfers"; ac 11/11 question]
answer: Mostly from cardholders who carry a balance (interest is the primary revenue source for major bank card portfolios), plus merchant-paid interchange on every purchase (about 1.8% of purchase volume for general purpose issuers in 2022) and fees. Someone who pays in full earns the issuer interchange only, not interest. (mechanism/pick: who pays what)
answer placement: section 1 "Who Pays the Card Issuer and How"
search intent: a cardholder wondering whether their issuer profits from them, and how much carrying a balance changes that; ends with what to do about it.

## THE CLOSED FACT LIST — every number/date/limit/name this page may state

### A. Reported (CFPB, "The Consumer Credit Card Market" 2025 report, published Dec 2025, data through 2024)
- Quote: "Interest is the primary cost of credit cards, exceeding $160 billion in 2024" (up from $105 billion in 2022). This is the cost to cardholders, not issuer revenue.
- Fees totaled $31.3 billion in 2024, 16 percent of the cost of credit cards in 2024, down from 19 percent in 2022. Late fees were the largest category at $17 billion in 2024.
- Deep subprime consumers hold about 14 percent of card accounts but generate 40 percent of late fees.
- Average APR in 2024: 25.2 percent for general purpose cards and 31.3 percent for private label cards; new general purpose accounts opened in 2024 averaged 27.5 percent.
- "The share of accounts that revolve credit card balances returned to pre-pandemic levels of around 50 percent, up from 45 percent observed in late 2021."
- About 15 percent of general purpose cardholders made only the minimum payment in 2024 (up from 13 percent).
- Average balance per cardholder about $5,300 in 2024.
- Minimum payments: "Most minimum payment calculations stipulate that consumers will pay the highest of a few options, such as a numerical floor, or a percentage of the cycle-ending balance plus interest and fees." Most issuers set the percentage at 1 percent of the balance, and typically add interest, fees and past-due amounts. Dollar floors in 2025 agreements ranged from $15 to $50; the most common was $40.
### B. Reported (CFPB 2023 report, data through 2022)
- Quote: "Interest income is the primary revenue source for the card portfolios of major banks."
- Interchange definition: "fees received by the issuer from card associations, part of the merchant discount rate." Networks set interchange schedules that vary by transaction type, retailer size and card type; issuing banks receive the majority of interchange revenue.
- General purpose issuers, 2022, as a share of receivables: interest income 12.3 percent, interchange income 7.9 percent, fee income 1.5 percent. Interchange was about 1.8 percent of purchase volume. (Do NOT convert these into a percentage split of total revenue; the report does not state one.)
- Private label cards: nearly zero interchange income.
### C. Reported (Federal Reserve G.19, release of Oct 7, 2026)
- Q2 2026, credit card plans: average APR 22.15 percent on accounts assessed interest; 20.94 percent on all accounts.
### D. Calculated (our internal modeling; reproducible: reports/mindmap-pass/2026-10-26-competitor/evidence/card-issuer-profit/calc.py, output.txt). Provenance: basis = calculated; scope = a single $5,300 balance (the CFPB average per cardholder) at 22.15% APR (Fed G.19 assessed-interest rate), no new purchases or fees, constant APR, monthly interest at APR/12, minimum payment = the higher of $40 or 1% of the balance plus that month's interest (the pattern the CFPB describes); interchange at 1.8% of purchases. These are scenario inputs, not any real card's terms.
- Month-1 interest $97.83; month-1 minimum payment $150.83.
- Paying only the minimum, the balance takes 190 months (15.8 years) to clear and generates $8,070.23 in interest ($13,370.23 total paid).
- At 25.2% APR (the CFPB 2024 average for general purpose cards) the same schedule takes 196 months and $9,307.50 interest.
- A balance held flat for one year at 22.15% costs $1,173.95 in interest. The same $5,300 spent and paid off in full earns the issuer about $95.40 in interchange at 1.8% (merchant-paid). Ratio about 12.3 to 1 for the year.
- Counterexample: paying a fixed $265 a month (5% of the original balance) clears the same balance in 26 months with $1,375.54 interest.
- What this shows: how much more a revolving balance is worth to an issuer than a paid-in-full account under these inputs. It does not show any issuer's actual profit, which depends on credit losses, rewards and funding costs we have not modeled. It is not a measured result.
### E. Unknown / do not state
Any issuer's actual profit margin, total revenue split, rewards cost, credit-loss rate, the status of the CFPB late-fee rule, any 2026 interchange litigation or settlement, merchant fee ranges, any named issuer's APR or terms, how much a pay-in-full cardholder costs an issuer.

Anything not on this list, you do not know. Never invent a price, limit, statistic or URL. Give no personalized advice.

## THE CLOSED URL LIST — the only external hrefs allowed
- https://files.consumerfinance.gov/f/documents/cfpb_consumer-credit-card-market-report_2025.pdf
- https://files.consumerfinance.gov/f/documents/cfpb_consumer-credit-card-market-report_2023.pdf
- https://www.federalreserve.gov/releases/g19/current/

## Internal links to use (real routes only — use at least 3)
- [credit card payoff calculator](/credit-card-payoff/)
- [credit card interest calculator](/credit-card-interest-calculator/)
- [what counts as a good credit card APR](/guides/good-apr-for-credit-card/)
- [how long to pay off a credit card](/guides/how-long-to-pay-off-credit-card/)
- [how to choose a balance transfer credit card](/guides/how-to-choose-a-balance-transfer-credit-card/)

## What to cover, section by section
1. Intro: sentence 1 = the direct answer (mostly from people who carry a balance; pay-in-full cardholders still generate merchant-paid interchange).
2. Who Pays the Card Issuer and How (answering section, FIRST): interest (cardholder), interchange (merchant, via the network), fees (cardholder); what each is, using the CFPB 2023 figures and quotes with their conditions; pay-in-full vs revolving.
3. How Many Cardholders Carry a Balance: the ~50% revolve, 15% minimum-only, $5,300 average balance, late-fee concentration.
4. How Minimum Payments Keep a Balance Alive: the CFPB formula description.
5. Our Internal Modeling of One $5,300 Balance: the calc results as a table; attribute to our calculation; inputs stated; how readers can check (use the payoff calculator with their own numbers); counterexample $265.
6. What the Numbers Do Not Tell You: unknowns (credit losses, rewards).
7. Our Takeaway: answer, who it applies to (people carrying a balance vs pay-in-full), evidence basis = our internal modeling plus CFPB and Fed figures, not a test; the condition that changes it (a 0% promo or a low APR makes the interest piece small; a pay-in-full cardholder with rewards may be a net cost to the issuer is NOT known — do not state); next step: pay more than the minimum, compare APR.

## FAQ — write 5 questions
- How do credit card companies make money if you pay in full?
- How do credit card companies make money on 0% interest offers? (answer only from the facts: interchange continues; promo terms are not covered, say to read the offer)
- What is interchange and who pays it?
- Why is the minimum payment so low?
- How can I stop paying interest to my card issuer?
