exec(open("reports/alternatives-daily/2026-11-25/mkprompts_head.py").read())

R = {
"Ramp": """### Ramp, ramp.com/pricing
- Free plan: $0 per user per month; includes travel and expense, accounts payable (pay bills by ACH, card, check, wire), corporate card with unlimited cards, budgets and reporting, QuickBooks Online and Xero integrations. The page lists earning 2% on cash in an FDIC-insured checking account and 4.66% in a Ramp Investment Account (footnoted, variable).
- Plus plan: $15 per user per month plus a platform fee based on team size; "Save 20% with annual billing". Adds NetSuite and Sage Intacct integrations, multi-entity support, AI expense reviews; procurement is an add-on.
- Enterprise: custom pricing, annual billing.""",
"Mercury": """### Mercury, mercury.com/pricing
- Mercury (base): $0 per month; no monthly fees, overdraft penalties or minimum balances; up to $5M in FDIC insurance through partner banks and sweep networks; free ACH, wires, real-time payments and checks in USD; company cards and expense management included. Treasury access is unlocked with a $250K Mercury balance.
- Plus: $29.90 per month; invoice with ACH debit at $1 per transaction, recurring invoices, unlimited 1099 filings, priority support; 30-day free trial.
- Pro: $299 per month; ACH debit invoicing at $0 per transaction; relationship manager.
- Add-ons: Mercury Books $35 per month and Mercury Payroll $100 per month plus $50 per person paid per month, both waived until Dec 31, 2026. Currency exchange fee listed at 1%.""",
"Expensify": """### Expensify, expensify.com/pricing
- Submit: free for all members (SmartScan receipts, mileage tracking, expense reports).
- Collect: $5 per member per month; reimbursements, corporate card management, expense and travel approvals, travel booking, QuickBooks and Xero integrations.
- Control: custom pricing, as low as $9 per member per month; multiple approval flows, ERP integration (NetSuite, Sage Intacct), SAML/SSO, budgeting. 30-day free trial.""",
"BILL": """### BILL, bill.com/pricing
- Essentials $49 per user per month; Team $65 per user per month; Corporate $89 per user per month; Enterprise listed separately. Essentials syncs with accounting software by CSV import/export; higher tiers integrate automatically.
- Payment fees shown include $0.59 and $1.99 (BILL mails the check) per payment; the page text does not label every fee, so do not say which payment type each belongs to beyond the $1.99 mailed check. Credit lines from $1,000 to $5M are advertised.
- BILL Spend & Expense: the page says there are no per-user subscription fees for it.""",
"Relay": """### Relay, relayfi.com/pricing
- Starter $0 per month: 50 credit and debit cards, 20 checking accounts, 1.19% APY on savings (footnoted), 1% cash back on credit cards (footnoted), invoicing, accounting integrations, unlimited users.
- Grow $30 per month: 1.87% APY on savings, 1.25% cash back, multi-step approval rules, recurring invoices, bookkeeping automations.
- Scale: $120 per month shown with $90 displayed beside it (the page does not say which is the discount; write both as shown); 3.21% APY on savings, 1.5% cash back, 50 checking accounts per business, no fee for same-day ACH.
- All plans: no minimum balance, no hidden or overdraft fees.""",
}
BREX = """### Brex (subject), brex.com/pricing
- Essentials: $0 per user per month; global card acceptance, 1 local card program, up to two entities, accounting integrations, local currency wires, travel booking, bill pay, reimbursements, API access.
- Premium: $12 per user per month; adds multiple customizable expense policies, dynamic expense review chains, multi-entity (US and international), ERP and HRIS integrations, live budgets.
- Enterprise: custom pricing. Smart Card: custom pricing.
- The page says plans start at $0 per user per month and more advanced features are $12 per user per month. Brex LLC is a wholly owned subsidiary of Capital One, N.A. Treasury return figures shown (3.63% to 3.98%) are variable annualized estimates."""
W = {
"Charles Schwab": """### Charles Schwab, schwab.com/pricing
- $0 online equity trade commissions; $0 online base commission plus $0.65 per options contract; no account or trade minimums.
- Broker-assisted trades add a $25 service charge. Crypto: 0.75% of trade value per buy or sell (minimum $0.01).""",
"Fidelity": """### Fidelity, fidelity.com/trading/commissions-margin-rates
- $0 commissions for online US stock, ETF and option trades; option contract fees apply. Margin base rate 10.825% effective since September 18, 2026, lower by balance tier (for example $250,000 to $499,999 shows 10.325%).""",
"Interactive Brokers": """### Interactive Brokers, interactivebrokers.com pricing
- IBKR Lite: $0 commissions on US stocks and ETFs for US residents. IBKR Pro stocks and ETFs: tiered $0.0005 to $0.0035 per share or fixed $0.005 per share. IBKR Pro options: tiered $0.15 to $0.65 per contract or fixed $0.65 per contract. No account minimums or hidden fees per the page.""",
"Firstrade": """### Firstrade, firstrade.com/content/en-us/pricing
- $0 commission for stocks, ETFs and options; $0 options contract fee; mutual funds free to trade (load, no-load and NTF funds). Broker-assisted orders: $19.95 for stocks and ETFs; options $19.95 plus $0.50 per contract.""",
"tastytrade": """### tastytrade, tastytrade.com/pricing
- Stocks and ETFs $0 to open and close; fractional shares $0. Stock and ETF options $1 per contract to open (capped at $10 per leg), $0 to close. Broad-based index options $1 per contract to open, $0 to close. Cryptocurrency 1% per purchase to open and close (0.75% for BTC and ETH). Page says no subscriptions.""",
"Webull": """### Webull, webull.com/pricing
- $0 commissions for US-listed stocks, ETFs and options; no deposit minimums. $0.50 per contract fee on certain index options. Pass-through regulatory fees apply (for example the SEC fee of $0.0000206 times trade volume). $75 per outgoing stock transfer.""",
}
WBS = W["Webull"].replace("### Webull,", "### Webull (subject),")
SCS = W["Charles Schwab"].replace("### Charles Schwab,", "### Charles Schwab (subject),")

b1 = "[best business bank accounts roundup](/roundup/best-business-bank-accounts/), [best business credit cards roundup](/roundup/best-business-credit-cards/), [best accounting software for freelancers](/roundup/best-accounting-software-for-freelancers/), [Mercury alternatives](/alternatives/mercury/), [Novo alternatives](/alternatives/novo/), [comparison hub](/compare/)"
build("brex", "Brex", "https://www.brex.com/pricing",
 "Brex alternatives for startups, corporate card alternatives, Brex vs Ramp, Brex vs Mercury, business expense management software",
 "What should I use instead of Brex for business cards and spend management?",
 "Ramp, Mercury, Expensify, BILL and Relay are the five business money tools covered. Published prices run from $0 plans (Ramp Free, Mercury, Expensify Submit, Relay Starter) to $299 a month on Mercury Pro and $89 per user per month on BILL Corporate. Brex lists Essentials at $0 and Premium at $12 per user per month.",
 ["Ramp", "Mercury", "Expensify", "BILL", "Relay"],
 [R[k] for k in ["Ramp", "Mercury", "Expensify", "BILL", "Relay"]], b1,
 "Mention Capital One only as Brex's parent as stated on the page. Do not claim rewards rates for Brex or any competitor card (not on the fact list).",
 BREX,
 "Brex Premium $12 x 10 users x 12 months = $1,440 a year; Brex Essentials $0. Expensify Collect $5 x 10 x 12 = $600 a year. BILL Essentials $49 x 10 x 12 = $5,880; Team $65 x 10 x 12 = $7,800; Corporate $89 x 10 x 12 = $10,680. Mercury Plus $29.90 x 12 = $358.80 a year; Pro $299 x 12 = $3,588. Relay Grow $30 x 12 = $360. Ramp Plus $15 x 10 x 12 = $1,800 before the team-size platform fee, which is unpublished here. Say these are arithmetic on list prices for a 10-user example, not quotes.")

b2 = "[best brokers for treasury bonds roundup](/roundup/best-brokers-for-treasury-bonds/), [best investment apps for beginners roundup](/roundup/best-investment-apps-for-beginners/), [what do brokers charge to trade](/guides/what-do-brokers-charge-to-trade/), [Robinhood alternatives](/alternatives/robinhood/), [Fidelity alternatives](/alternatives/fidelity/), [comparison hub](/compare/)"
build("webull", "Webull", "https://www.webull.com/pricing",
 "Webull alternatives, apps like Webull, Webull vs Fidelity, Webull vs Schwab, commission free brokers",
 "What should I use instead of Webull for stock and options trading?",
 "Charles Schwab, Fidelity, Interactive Brokers, Firstrade and tastytrade are the five brokerages covered. Published prices are $0 for online stock and ETF trades at all five (IBKR Lite for Interactive Brokers) and differ on options contracts, from $0 at Firstrade to $0.65 at Schwab and Fidelity. Webull lists $0 commissions on US-listed stocks, ETFs and options.",
 ["Charles Schwab", "Fidelity", "Interactive Brokers", "Firstrade", "tastytrade"],
 [W[k] for k in ["Charles Schwab", "Fidelity", "Interactive Brokers", "Firstrade", "tastytrade"]], b2,
 "Brokerage page: list fees only. Never say a broker is best, safe or suitable for anyone; never mention returns or investing advice. Only mention a $0.65 Fidelity per-contract figure as 'option contract fees apply' unless stated on the list.",
 WBS,
 "100 options contracts at $0.65 = $65 (Schwab); at $1 = $100 (tastytrade open, capped at $10 per leg); at $0 = $0 (Webull, Firstrade). 10 contracts at IBKR Pro fixed $0.65 = $6.50. Index options at Webull $0.50 per contract x 20 = $10. A $19.95 Firstrade broker-assisted stock order versus $0 online. Arithmetic on published fees only, not advice.")

b3 = "[what do brokers charge to trade](/guides/what-do-brokers-charge-to-trade/), [best investment apps for beginners roundup](/roundup/best-investment-apps-for-beginners/), [best brokers for treasury bonds roundup](/roundup/best-brokers-for-treasury-bonds/), [Fidelity alternatives](/alternatives/fidelity/), [Robinhood alternatives](/alternatives/robinhood/), [comparison hub](/compare/)"
build("charles-schwab", "Charles Schwab", "https://www.schwab.com/pricing",
 "Schwab alternatives, brokers like Charles Schwab, Schwab vs Fidelity, Schwab vs Webull, commission free brokers",
 "What should I use instead of Charles Schwab for brokerage trading?",
 "Fidelity, Interactive Brokers, Webull, Firstrade and tastytrade are the five brokerages covered. Published prices are $0 for online stock and ETF trades at all of them (IBKR Lite for Interactive Brokers), and they differ on options contracts, from $0 at Webull and Firstrade to $1 to open at tastytrade. Charles Schwab lists $0 online equity commissions and $0.65 per options contract.",
 ["Fidelity", "Interactive Brokers", "Webull", "Firstrade", "tastytrade"],
 [W[k] for k in ["Fidelity", "Interactive Brokers", "Webull", "Firstrade", "tastytrade"]], b3,
 "Brokerage page: list fees only. Never say a broker is best, safe or suitable for anyone; never mention returns or investing advice. Schwab's page is about fees only; do not claim banking, advisory or robo products beyond what is listed.",
 SCS,
 "100 options contracts at Schwab $0.65 = $65 versus tastytrade $1 x 100 = $100 to open (capped at $10 per leg, so a single leg of 100 contracts is $10) versus $0 at Webull and Firstrade. A Schwab broker-assisted trade adds $25 on top of the online price. Crypto: Schwab 0.75% of a $1,000 trade = $7.50; tastytrade 1% = $10 (0.75% = $7.50 for BTC and ETH). Arithmetic on published fees only, not advice.")
