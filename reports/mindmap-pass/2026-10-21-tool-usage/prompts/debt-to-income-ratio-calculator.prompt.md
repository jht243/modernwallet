# ROW PROMPT (data only) — debt-to-income-ratio-calculator

route: /debt-to-income-ratio-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; intro ~140 words, howItWorks ~420 words, 8 FAQs)
primary keyword: debt to income ratio calculator (also: debt-to-income ratio, DTI calculator, how to calculate debt to income ratio, what is a good debt to income ratio)
intent: someone about to apply for a mortgage, car loan or personal loan (or a homeowner tallying debts after a net-worth check) wants their own DTI and how much room they have before a lender's limit.
reader question: "How to calculate debt-to-income ratio?" [PAA 5/6 how-to/what-is-good "How to calculate debt-to-income ratio?", "What is a good debt-to-income ratio?", "Is 37% a good debt-to-income ratio?"; ac 10/10]
answer: A figure: add up your monthly debt payments, divide by your gross monthly income and multiply by 100. $2,470 of payments on $6,500 gross income is a 38.0% DTI, just above the 36% Fannie Mae allows on a manually underwritten mortgage.
answer placement: section 1 — introText paragraph one gives the formula in one sentence and says what the tool returns; paragraph two is the $6,500 worked example. Do not open with a definition paragraph beyond that one sentence.

## The calculator (describe only what it does)
Inputs: gross monthly income (before taxes); rent or mortgage payment (with taxes, insurance, HOA); auto loan payments; student loan payments; credit card minimums; other debt payments (personal loans, child support, alimony).
Outputs: debt-to-income ratio (total monthly debt payments ÷ gross monthly income), a one-line band against the Fannie Mae lines; housing-only (front-end) ratio; total monthly debt payments; room before 36%, room before 45%, room before 50% (the extra monthly payment that could be added before reaching each line; $0 when already over).
Hint text in the tool: use monthly minimum payments, not balances; utilities, phone, groceries and insurance you pay on your own don't count; the starting figures are placeholders.
Method the page may state: DTI = total monthly debt payments ÷ gross monthly income × 100. Front-end ratio = housing payment ÷ gross monthly income × 100. Room = gross monthly income × the line − total monthly debt payments.
Assumptions the page must state: the 36/45/50% lines are Fannie Mae's limits for mortgages it buys, not approvals; FHA, VA, auto and personal lenders set their own limits; every lender also weighs credit and savings; gross income means before taxes.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; never state another lender's or loan program's DTI limit, a "28/36 rule", a 43% rule, an average DTI, or a statistic.
- CFPB definition: "Your debt-to-income ratio (DTI) is all your monthly debt payments divided by your gross monthly income." CFPB example: a $1,500 mortgage + $100 auto loan + $400 other debts = $2,000 a month; on $6,000 gross monthly income that is a 33% DTI. (Source: https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/ ). The calculator shows that example as 33.3%.
- Fannie Mae Selling Guide B3-6-02, Debt-to-Income Ratios (dated 04/02/2025): maximum total DTI for a manually underwritten loan is 36% of stable monthly income; that maximum can be exceeded up to 45% if the borrower meets the credit score and reserve requirements; for loans underwritten through Desktop Underwriter (DU), Fannie Mae's automated underwriting system, the maximum is 50%. (Source: https://selling-guide.fanniemae.com/sel/b3-6-02/debt-income-ratios )
- Worked example (computed by the calculator, the tool's starting figures): gross monthly income $6,500; housing $1,650; auto $450; student loans $250; card minimums $120; other $0. Total $2,470 a month. DTI 38.0%. Housing-only ratio 25.4%. Room before 36%: $0 (the payments are $130 over that line). Room before 45%: $455. Room before 50%: $780.
- Paying off the $450 auto loan in that example: total $2,020, DTI 31.1%, room before 36% becomes $320.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/ (CFPB definition); https://selling-guide.fanniemae.com/sel/b3-6-02/debt-income-ratios (Fannie Mae limits). Nothing else.

## Internal routes it may link (real routes only)
/mortgage/home-affordability-calculator/ (home affordability calculator), /auto-loan/car-affordability-calculator/ (car affordability calculator), /net-worth/liquid-net-worth-calculator/ (liquid net worth calculator), /debt-consolidation-calculator/ (debt consolidation calculator), /credit-card-payoff/ (credit card payoff calculator), /budget/ (budget calculator), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks: (1) the formula and what counts as a debt payment vs what doesn't (utilities, phone, groceries, insurance you pay yourself); (2) gross vs take-home income — use income before taxes; (3) the front-end (housing-only) ratio vs the total ratio; (4) the Fannie Mae lines: 36% manual, up to 45% with credit score and reserve requirements, 50% through DU — and that other lenders and loan types set their own; (5) how to lower it: pay off a small loan entirely (the $450 example), raise income, avoid new debt before applying — link /debt-consolidation-calculator/ and /credit-card-payoff/; mention /mortgage/home-affordability-calculator/ and /auto-loan/car-affordability-calculator/ for the next step.
Who this is not for: someone who wants to know whether they can afford a payment in their own budget (take-home pay) — point them to /budget/.
What would change the answer: a lender that counts income or debts differently, or a loan program with its own limit.

## FAQ questions (verbatim, in this order)
1. How to calculate debt-to-income ratio?
2. What is a good debt-to-income ratio?
3. Is 37% a good debt-to-income ratio?
4. Is 35 DTI too high?
5. What debts count in a debt-to-income ratio?
6. Do lenders use gross or net income for DTI?
7. What is the difference between front-end and back-end DTI?
8. How can I lower my debt-to-income ratio quickly?
For question 2 cite the Fannie Mae lines and say other lenders differ. For questions 3 and 4 answer against the 36/45/50% Fannie Mae lines only.
