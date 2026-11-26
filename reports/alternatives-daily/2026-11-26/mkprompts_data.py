exec(open("reports/alternatives-daily/2026-11-26/mkprompts_head.py").read())

# ---------------- VANGUARD ----------------
VG = """### Vanguard (subject), investor.vanguard.com fees page (schedule effective July 10, 2026)
- Fees depend on Qualifying Assets (QA) held at Vanguard; as QA rises, fees and commissions generally fall. Figures below are for clients with QA under $1 million unless stated.
- Online stock and ETF trades: $0 commission. Broker-assisted trades (placed by phone with a representative): a $25 broker-assisted commission (BAC) per trade may apply. All stock and ETF sales carry a securities transaction fee, and every ETF has management fees and expenses stated in its prospectus.
- Options: $0 commission plus a $1-per-contract fee. Options exercises and assignments are commission-free. A limited number of commission-free options and transaction-fee mutual fund trades are offered to eligible clients with higher QA, resetting each calendar year.
- Vanguard mutual funds: $0 to trade online; a few Vanguard funds charge special purchase or redemption fees of 0.25% to 1.00% of the transaction, paid to the fund. Some fund minimums are $1,000 (some $5,000).
- Non-Vanguard mutual funds: no-transaction-fee (NTF) funds $0 online, $25 BAC if broker-assisted; transaction-fee (TF) funds $20 online or $20 plus $25 BAC if broker-assisted (QA under $1 million). Sales within 60 calendar days of the most recent purchase of the same fund carry a $50 early redemption fee. Enrolling in a TF mutual fund dollar-cost-averaging program adds $3 per transaction.
- Account service fee: Vanguard may charge a $25 annual account service fee; it is waived for Cash Plus accounts, for organization or trust accounts under an employer identification number, and for clients who elect e-delivery of statements and other documents, among other conditions.
- The Vanguard homepage also advertises Vanguard Cash Plus (a savings option with a stated APY that the fetched page leaves as an unfilled template, so do NOT quote any Cash Plus rate) and Vanguard advisory services with varying fees; do not quote advisory fees."""
VR = {
"Fidelity": """### Fidelity, fidelity.com/trading/commissions-margin-rates
- $0 commissions for online US stock, ETF and option trades; no minimums to open an account. Option contract fees apply (the commission table shows $0 base with contract fees; do not state the per-contract amount).
- Buy-to-close option orders of $0.65 or less are $0. Bonds: $1.00 per bond online (as listed). No-transaction-fee non-Fidelity funds $0.""",
"Charles Schwab": """### Charles Schwab, schwab.com/pricing
- $0 online equity trade commissions; $0 online base commission plus $0.65 per options contract; no account or trade minimums.
- Broker-assisted trades add a $25 service charge. Crypto: 0.75% of trade value per buy or sell (minimum $0.01).""",
"Merrill Edge": """### Merrill Edge Self-Directed, merrilledge.com/pricing
- $0 for online stock, ETF and option trades with no minimum investment; options contract and other fees may apply (per-contract amount not on the page text).
- Account fees listed for general investing accounts: partial account transfer $0, full account transfer $49.95, wire transfer $24.95.""",
"E*TRADE": """### E*TRADE from Morgan Stanley, us.etrade.com
- $0 commission on stocks, options, mutual funds and ETFs online. Options contracts: $0.65 per contract (the page also shows 50 cents with 30+ trades per quarter). Futures contracts $1.50 per contract per side plus fees (E-nano Equity Index futures $0.75). Bonds $1.00 per bond (minimum $10, maximum $250). Crypto commissions 0.50% of the dollar value of each trade.
- Other fees may apply. A bonus offer for new clients is advertised (up to $1,500 on funding by 2/28/2027); treat as a time-limited promotion and do not describe it as a regular price.""",
"Betterment": """### Betterment, betterment.com/pricing
- Digital investing: $5 per month on balances $0 to $24,000; 0.25% annually when you set up $200 or more in monthly recurring deposits or reach $24,000 to $1,000,000 balance. Eligible balances over $1,000,000 get progressive fee discounts. No minimum balance.
- Premium plan: 0.65% annual advisory fee, with access to an advisor. Fees are assessed monthly.
- Self-directed investing: no commission on stocks and ETFs; Betterment waives its wrap fee on self-directed assets. Cash Reserve account: no fees or minimums, variable APY (promotional APY boosts are time-limited; do not quote a rate).""",
"Webull": """### Webull, webull.com/pricing
- $0 commissions for US-listed stocks, ETFs and options; no deposit minimums. $0.50 per contract fee on certain index options. Pass-through regulatory fees apply (for example the SEC fee of $0.0000206 times trade volume). $75 per outgoing stock transfer.""",
}
bv = "[what do brokers charge to trade](/guides/what-do-brokers-charge-to-trade/), [best investment apps for beginners roundup](/roundup/best-investment-apps-for-beginners/), [best brokers for treasury bonds roundup](/roundup/best-brokers-for-treasury-bonds/), [Fidelity alternatives](/alternatives/fidelity/), [Robinhood alternatives](/alternatives/robinhood/), [comparison hub](/compare/)"
names = ["Fidelity","Charles Schwab","Merrill Edge","E*TRADE","Betterment","Webull"]
build("vanguard", "Vanguard", "https://investor.vanguard.com",
 "Vanguard alternatives, brokers like Vanguard, Vanguard vs Fidelity, Vanguard vs Schwab, Vanguard brokerage fees",
 "What should I use instead of Vanguard for a brokerage account?",
 "Fidelity, Charles Schwab, Merrill Edge, E*TRADE, Betterment and Webull are the six providers covered. Published online stock and ETF commissions are $0 at Vanguard and at the five brokerages; they differ on options contracts, broker-assisted fees, account and transfer fees. Betterment instead charges a $5 monthly or 0.25% annual advisory-style fee.",
 names, [VR[k] for k in names], bv,
 "Brokerage page: list fees only. Never say a firm is best, safe or suitable for anyone; never mention returns, fund performance or investing advice. Never quote a Vanguard Cash Plus rate or advisory fee (not on the fact list). Say the Vanguard fee schedule is effective July 10, 2026 as its page states. Billing basis matters: Betterment fees are monthly or annual as listed.",
 VG,
 "100 options contracts at Vanguard $1 each = $100; at Schwab $0.65 = $65; at E*TRADE $0.65 = $65 (or 50 cents = $50 with 30+ trades per quarter); at Webull $0. A Vanguard broker-assisted trade for QA under $1 million adds $25 versus $0 online; a Schwab broker-assisted trade also adds $25. A TF mutual fund purchase at Vanguard online is $20, or $45 if broker-assisted ($20 + $25). Betterment on a $10,000 balance with no recurring deposit: $5 x 12 = $60 a year; on $30,000: 0.25% = $75 a year; Premium 0.65% of $30,000 = $195 a year. Arithmetic on published fees only, not advice.")

# ---------------- RAMP ----------------
RS = """### Ramp (subject), ramp.com/pricing
- Free plan: $0 per user per month; travel and expense, accounts payable (pay bills by ACH, card, check, wire), corporate card with unlimited cards, budgets and reporting, QuickBooks Online and Xero integrations, invoice creation and accounts receivable tools. The page lists earning 4.61% in a Ramp Investment Account (footnoted, variable; no fees, minimum deposits or transfer caps) and 2% on cash in an FDIC-insured checking account; free wires and same-day ACH via Bill Pay.
- Plus plan: $15 per user per month plus a platform fee based on team size ("Save 20% with annual billing"). Adds NetSuite, Sage Intacct and more integrations, multi-entity support, AI expense reviews, custom user roles and audit log; procurement is an add-on to Plus or Enterprise.
- Enterprise: custom pricing, annual billing."""
RR = {
"Brex": """### Brex, brex.com/pricing
- Essentials: $0 per user per month; global card acceptance, local currency wires, travel booking (free on Essentials), accounting integrations.
- Premium: $12 per user per month; multiple customizable expense policies, ERP and HRIS integrations.
- Enterprise: custom pricing. The page says plans start at $0 per user per month and more advanced features are $12 per user per month. Brex LLC is a wholly owned subsidiary of Capital One, N.A.""",
"Mercury": """### Mercury, mercury.com/pricing
- The page defaults to annual pricing (15% off). Mercury base plan: $0 per month; Plus: $29.90 per month billed annually ($35 per month month-to-month); Pro: $299 per month billed annually ($350 per month month-to-month).
- Mercury base: no monthly fees or minimum balances; free ACH, wires and checks in USD; company cards and expense management included. Plus adds invoicing with ACH debit at $1 per transaction and a 30-day free trial; Pro lists ACH debit invoicing at $0 per transaction.
- Add-ons: Mercury Books $35 per month and Mercury Payroll $100 per month plus $50 per person paid per month, both waived until December 31, 2026.""",
"Relay": """### Relay, relayfi.com/pricing
- Starter $0 per month: 1.19% APY on savings (footnoted), 1% cash back on credit cards (footnoted), unlimited users. Grow: 1.87% APY, 1.25% cash back, free trial offered. Scale: 3.21% APY, 1.5% cash back, free trial offered. (The page text fetched today does not show the Grow and Scale monthly prices; do NOT state any Relay monthly price for Grow or Scale. Say Grow and Scale monthly prices are shown on Relay's pricing page.)
- Relay says it saves up to 50% over competitors on wire and same-day ACH.""",
"Expensify": """### Expensify, expensify.com/pricing
- Submit: free (SmartScan receipts, mileage tracking, expense reports). Collect: $5 per member per month. Control: custom pricing, as low as $9 per member per month. 30-day free trial.""",
"BILL": """### BILL, bill.com/pricing
- Plans listed: Essentials, Team, Corporate, Enterprise (Enterprise custom). Today's fetched page text does NOT show per-user plan prices, so do NOT state any BILL subscription price; say BILL publishes plan prices on its pricing page.
- Payment fees shown: $0.59 and $1.99 per payment ($1.99 where BILL mails the check); $1.99 per 1099 filing. Credit lines from $1,000 to $5M are advertised.""",
}
br = "[best business bank accounts roundup](/roundup/best-business-bank-accounts/), [best business credit cards roundup](/roundup/best-business-credit-cards/), [best accounting software for freelancers](/roundup/best-accounting-software-for-freelancers/), [Brex alternatives](/alternatives/brex/), [Mercury alternatives](/alternatives/mercury/), [comparison hub](/compare/)"
rn = ["Brex","Mercury","Relay","Expensify","BILL"]
build("ramp", "Ramp", "https://www.ramp.com/pricing",
 "Ramp alternatives, Ramp vs Brex, Ramp vs Mercury, corporate card alternatives, spend management software",
 "What should I use instead of Ramp for business cards and spend management?",
 "Brex, Mercury, Relay, Expensify and BILL are the five business money tools covered. Published entry prices are $0 at Ramp Free, Brex Essentials, Mercury, Relay Starter and Expensify Submit; paid tiers run from $5 per member per month on Expensify Collect to $12 per user per month on Brex Premium and $15 per user per month on Ramp Plus.",
 rn, [RR[k] for k in rn], br,
 "Mention Capital One only as Brex's parent as stated on the page. Do not claim rewards rates for Brex or Ramp cards. Always label Mercury's $29.90 and $299 as billed annually with the monthly-billing $35 and $350 alongside. Do not state Relay Grow/Scale or BILL plan prices (not on the fact list).",
 RS,
 "Ramp Plus $15 x 10 users x 12 months = $1,800 a year before the team-size platform fee, which is unpublished; Ramp Free $0. Brex Premium $12 x 10 x 12 = $1,440 a year; Brex Essentials $0. Expensify Collect $5 x 10 x 12 = $600 a year. Mercury Plus $29.90 x 12 = $358.80 a year billed annually or $35 x 12 = $420 month-to-month; Pro $299 x 12 = $3,588 annual or $350 x 12 = $4,200 monthly. Say these are arithmetic on list prices for a 10-user example, not quotes.")

# ---------------- HONEYBOOK ----------------
HS = """### HoneyBook (subject), honeybook.com/pricing
- Starter: $29 per month billed annually ($36 per month billed monthly). Unlimited clients and projects, invoices and payments, proposals and contracts, calendar, client portal, basic reports, up to 2 live lead forms, HoneyBook AI.
- Essentials: $49 per month billed annually ($59 billed monthly). Adds scheduler, automations, QuickBooks Online integration, up to 10 live lead forms, SMS reminders, removal of "Powered by HoneyBook", standard reports.
- Premium: $109 per month billed annually ($129 billed monthly). Adds unlimited team members, priority support, multiple companies, advanced reports.
- All plans start with a free trial; change or cancel anytime. Promotional discounts (such as "50% off" on annual plans or seasonal sales) appear on the page and are time-limited; treat them as promotions, never as the regular price.
- Payment processing: card fees start at 2.7% plus 10 cents; ACH bank transfer fees are 1.5%. Premium subscribers who transact over $500,000 annually may be eligible for discounted card fees."""
HR = {
"Dubsado": """### Dubsado, dubsado.com/pricing
- Starter Plan $335 per year; Premier Plan $525 per year (annual prices as shown; "choose annual and get 2 months worth of savings"; a 50% first-year offer through November 30 is a promotion). Unlimited projects and clients.
- Add-ons: $10 per month per additional brand; 3 additional users free, then 4-10 users $25 per month, 11-20 users $45 per month, 21-30 users $60 per month. Free trial offered.""",
"17hats": """### 17hats, 17hats.com/pricing
- One all-inclusive plan: $60 per month (monthly), $600 per year (yearly, saves $120), or $800 per two years (bi-yearly, saves $400). 7-day free trial; a 50% first-year offer is a promotion. 30-day money-back guarantee.
- Add-ons: bank connect $5 per month; basic online scheduling $5 per month and advanced $10 per month on some tiers. Document limits by tier (20, 35 or unlimited docs per month).""",
"Bonsai": """### Bonsai, hellobonsai.com/pricing
- Billed annually, per user per month: Basic $9, Essentials $19 (adds invoices and payments, proposals and contracts, scheduling, client portal, expense tracking), Premium $29 (adds project insights, workload management, Gantt view, integrations with QuickBooks, Xero, Zapier), Elite $49 (custom permissions, 3 users minimum). Basic is $15 per user per month on monthly billing. Free start offered.""",
"Moxie": """### Moxie, withmoxie.com/pricing
- Starter $10 per month ($120 charged annually) or $12 per month billed monthly; Pro $20 per month ($240 annually) or $25 monthly; Teams $32 per month ($385 annually) or $40 monthly (up to five team members). 14-day free trial. Includes client management, project management, invoicing and payments, proposals, time tracking, sales pipeline.""",
"FreshBooks": """### FreshBooks, freshbooks.com/pricing
- List prices per month: Lite $23.00 (invoices to 5 clients), Plus $43.00 (50 clients, most popular), Premium $70.00 (adds project profitability); a Select tier is quote-based. A limited-time Black Friday offer shows 90% off for 4 months (promotion; Lite $2.30, Plus $4.30, Premium $7.00 during those 4 months). Extras: team members $11 per month per user, Advanced Payments $20 per month, Payroll $40 per month plus $6 per month per user. 30-day money-back guarantee.""",
}
bh = "[best accounting software for freelancers](/roundup/best-accounting-software-for-freelancers/), [best business bank accounts roundup](/roundup/best-business-bank-accounts/), [QuickBooks alternatives](/alternatives/quickbooks/), [comparison hub](/compare/)"
hn = ["Dubsado","17hats","Bonsai","Moxie","FreshBooks"]
build("honeybook", "HoneyBook", "https://www.honeybook.com/pricing",
 "HoneyBook alternatives, HoneyBook vs Dubsado, HoneyBook vs Bonsai, client management software for freelancers, apps like HoneyBook",
 "What should I use instead of HoneyBook for freelancer client management and invoicing?",
 "Dubsado, 17hats, Bonsai, Moxie and FreshBooks are the five providers covered. Published monthly prices run from $10 on Moxie Starter (billed annually) to $60 on 17hats, against HoneyBook Starter at $29 per month billed annually; billing basis (annual versus monthly) changes every price on this page.",
 hn, [HR[k] for k in hn], bh,
 "Always state billing basis (annual vs monthly) next to every price. Treat all promotional discounts as promotions with no regular-price claim. Do not claim which tool has more features beyond the fact list.",
 HS,
 "HoneyBook Starter $29 x 12 = $348 a year billed annually versus $36 x 12 = $432 monthly; Essentials $49 x 12 = $588 annual; Premium $109 x 12 = $1,308 annual. Moxie Starter $120 a year annual; Pro $240; Teams $385. 17hats $600 a year on yearly plan versus $60 x 12 = $720 monthly. Dubsado Starter $335 a year, Premier $525. Bonsai Essentials $19 x 12 = $228 a year per user. FreshBooks Plus $43 x 12 = $516 at list. Arithmetic on list prices only, not advice.")
