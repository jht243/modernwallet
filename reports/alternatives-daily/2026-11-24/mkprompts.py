import sys
D="2026-11-24"; P=f"reports/alternatives-daily/{D}/prompts/"
BUD = {
"Monarch": """### Monarch, monarch.com/pricing
- Two plans: Core at $99.99 per year or $14.99 per month; Plus at $199.99 per year. Plus adds forecasting tools, tracking for multiple income sources like a small business, and deeper investment features. First week free. Banner: 30% off Core for one year with code WELCOME (terms apply; may expire). Cancel anytime, money-back guarantee. Web signup recommended over app stores. No ads; says it never sells financial data.""",
"YNAB": """### YNAB (You Need A Budget), ynab.com/pricing
- Annual plan $109 paid annually ($9.08 per month, "$70 Savings"). Monthly plan $14.99 per month. Prices in US dollars plus tax where applicable. 34-day free trial, no credit card needed when signing up directly (app stores may require one). College students get a free 365-day trial. A subscription can be shared with a group of up to six. Debt tools with an integrated loan calculator. The YNAB Method asks what each dollar is for.""",
"Simplifi": """### Simplifi (Quicken), simplifimoney.com
- Cloud app for web and mobile, made by Quicken. Page shows "$3.99/month" and "$6.99" labeled "Billed annually"; footnote: discounts are calculated on the annual price, the final price may differ from the monthly discounted price multiplied by 12, offers are first-year only for new memberships ordered directly by December 8, 2026, renews automatically at then-current rates. Spending Plan (bills and savings first, remainder to spend), Projected Cash Flow up to 12 months ahead, net worth tracking, Watchlist, Savings Goals, Retirement Planner, Quicken AI, over 14,000 financial institutions, share with one other person, free one-on-one setup help. Not designed to function outside the U.S. and Canada. Do not compute a 12-month Simplifi total.""",
"Copilot Money": """### Copilot Money, copilot.money/pricing
- One plan, no tiers, no add-ons, no AI credits: $9 per month, or $109 billed yearly "instead of $119" (marked limited time offer). 16,000+ banks, money assistant, support from real humans included. Platforms: iPhone, iPad, Mac and Web. Households (sharing with a partner or family) is marked "Coming soon". Says it never sells financial data.""",
"EveryDollar": """### EveryDollar (Ramsey Solutions), ramseysolutions.com/ramseyplus/everydollar
- Free version: monthly budget, unlimited categories, manual transaction entry, sinking funds, split transactions, bill due dates. Premium after a 14-day free trial: $6.67 per month billed annually at $79.99, or $17.99 per month billed monthly; adds automatic bank connection, custom reports, CSV export, coach Q&A, net worth projection. Method: giving every dollar a job.""",
"Tiller": """### Tiller, tiller.com/pricing
- Syncs accounts into private spreadsheets you own (Google Sheets / Microsoft). 30-day free trial, then $99 per year ("never any ads or hidden fees"); card not charged until the end of the trial; then another 30 days with a full refund (up to 60 days risk-free). Sign up with a Microsoft or Google account. Sales tax added where required.""",
}
ACC = {
"QuickBooks Online": """### QuickBooks Online, quickbooks.intuit.com/pricing
- List prices per month: Free $0 (1 user); Simple Start $38 (1 user); Essentials $85 (3 users); Plus $140 (5 users); Advanced $340 (25 users). Promo: 70% off for 3 months (Simple Start $11.40, Essentials $25.50, Plus $42, Advanced $102), promotion stated to end 11/29.""",
"FreshBooks": """### FreshBooks, freshbooks.com/pricing
- Lite $23/month (5 clients), Plus $43/month (50 clients), Premium $70/month (unlimited clients), Select custom ("Let's Talk"). Promo: 90% off for 4 months (Lite $2.30, Plus $4.30, Premium $7.00 per month). Additional team members $11/month per user; payroll add-on $40/month plus $6/month per employee/contractor shown. Invoicing and expense tracking focus.""",
"Zoho Books": """### Zoho Books, zoho.com/us/books/pricing
- Priced per organization per month: Free $0 (1 user plus 1 accountant, up to 1,000 invoices a year; free plan available while revenue stays under $50K); Standard $20 monthly or $15 billed annually; Professional $50 or $40; Premium $70 or $60; Elite $150 or $120; Ultimate $275 or $240. Users included: Standard 3, Professional 5, Premium 10, Elite 10, Ultimate 15. Annual invoice caps: Standard 5,000, Professional 10,000, Premium 25,000, Elite and Ultimate 100,000. 14-day free trial.""",
"Wave": """### Wave, waveapps.com/pricing
- Starter $0 (unlimited estimates, invoices, bills and bookkeeping records; online card payments 2.9% + $0.60, Amex 3.4% + $0.60 per transaction). Pro $19 per month billed monthly or $190 per year billed annually (about $15.83 per month); Pro is priced per business; Pro card payments 2.9% + $0 for the first 10 transactions a month then 2.9% + $0.60. Starter receipts add-on $11/month or $96/year; Pro includes unlimited receipts. Payroll is an add-on priced from $25/month to from $40/month (the page does not say which applies to which plan).""",
"FreeAgent": """### FreeAgent, freeagent.com/us/pricing
- US sole proprietor offer: $27 per month regular, or $270 per year; promo 50% off for the first six months on monthly billing ($13.50 per month) or 50% off the first year on annual billing ($135, $11.25 per month). Smart Capture Unlimited add-on $6/month. Sales tax reporting and multi-currency invoicing included. 30-day free trial. The page does not list user, invoice or transaction limits.""",
}
XERO = """### Xero (subject), xero.com/us/pricing-plans
- Three plans, USD per month: Early $27 (send quotes and 20 invoices, 5 bills, bank reconciliation); Growing $59 (unlimited invoices and quotes, bill entry); Established $97 (multiple currencies, project time and cost tracking, expense claims). Promo: 90% off the first 6 months with code, offer ends November 30 (Early $2.70, Growing $5.90, Established $9.70 for the first 6 months, then regular price auto-renews monthly). Optional add-ons: auto-reconcile $5.00 per month; Xero Payroll powered by Gusto $36 a month plus $6 per employee/contractor. Prices exclude taxes. Xero says it serves 5.1 million customers, offers free expert setup help and no per-user license fees. Changing to a cheaper plan is allowed 1 month after upgrading. Invoice limits on Early count approving and sending."""

def build(slug, prod, url, kw, rq, answer, alts, facts, links, compnote, subjfacts, cost, extra=""):
    names=", ".join(alts)
    t=f"""# DATA ONLY prompt: {prod} Alternatives (route /alternatives/{slug}/)

route: /alternatives/{slug}/
slug: {slug}
product: {prod}
officialUrl: {url}
page type: comparison (floor 1,500 body words)
register: operator
medium: prose -> prose
primary keyword: {prod} alternatives
secondary keywords: {kw}
published/updated: {D}
reader question: "{rq}" [verb-only, no PAA, no completions]
answer: {answer}
answer placement: section 1 (intro), first two sentences
TESTED: never. Nothing on this page was tested. Use "fits people who..." wording; no advice, no "you should".
Link rule: the ONLY external link is [{prod}]({url}) once in the intro. All other companies in plain text. Internal links (use at least 4): {links}
Required sections: comparison table ({prod} subject row first, then {len(alts)} alternatives: {names}), chooseSection "How to Choose a {prod} Alternative", one H2 per alternative (heading like "<Name> Pricing, Plans and Fit"), stillBetterFit "When {prod} Is Still the Better Fit" with "Who This Is Not For" and "What Would Change Our Answer" as sections/paragraphs, verdict, 4-6 FAQs, closing concrete next action. Define acronyms on first use.
tableNote suggestion: "Prices from each provider's own website, checked November 24, 2026. Prices are in US dollars."
tableColumns: ["Product", "Fees and pricing", "Best fit"]
Do not write {prod}'s name as a stand-in ("the platform", "the vendor", "the app" alone). Do not mention products not on this list. {compnote}
Never give financial advice; list published prices only. Promotional prices may be named as promotions with their stated end dates, never as the regular price.
Worked cost examples allowed (arithmetic only on these figures): {cost}

## CLOSED FACT LIST (use ONLY these facts; checked November 24, 2026 on each vendor's own site)

{subjfacts}

""" + "\n\n".join(facts) + "\n\nAnything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the vendor page.\n"
    open(P+slug+".prompt.md","w").write(t)
    open(P+slug+"-allowed-urls.txt","w").write(url+"\n/\n")

bl="[best budgeting apps roundup](/roundup/best-budgeting-apps/), [best net worth tracker roundup](/roundup/best-net-worth-tracker/), [zero-based budget calculator](/budget/zero-based-budget-calculator/), [guide to making a budget](/guides/how-to-make-a-budget/), [Monarch alternatives](/alternatives/monarch-money/), [YNAB alternatives](/alternatives/ynab/), [Simplifi alternatives](/alternatives/simplifi/), [comparison hub](/compare/)"
build("tiller","Tiller","https://www.tiller.com","Tiller Money alternatives, apps like Tiller, Tiller vs Monarch, Tiller vs YNAB, spreadsheet budgeting alternatives",
 "What should I use instead of Tiller for budgeting?",
 "Monarch, YNAB, Simplifi, Copilot Money and EveryDollar are the five budgeting apps covered. Published prices run from a free EveryDollar tier to $17.99 a month on EveryDollar Premium monthly billing, and they differ in method, platform and whether a trial needs a card. Tiller is the spreadsheet-based one at $99 a year after a 30-day trial.",
 ["Monarch","YNAB","Simplifi","Copilot Money","EveryDollar"],
 [BUD[k] for k in ["Monarch","YNAB","Simplifi","Copilot Money","EveryDollar"]],bl,
 "Mention Tiller as spreadsheet-based; mention Quicken only as Simplifi's maker.",BUD["Tiller"].replace("### Tiller,","### Tiller (subject),"),
 "Tiller $99 a year = $8.25 a month (99/12). Monarch Core 12 x $14.99 = $179.88 vs $99.99 yearly. YNAB 12 x $14.99 = $179.88 vs $109 annual (difference $70.88). Copilot $9 x 12 = $108 vs $109 billed yearly. EveryDollar premium 12 x $17.99 = $215.88 vs $79.99 annual. Tiller $99 vs Monarch Core yearly $99.99: Tiller is $0.99 less; vs EveryDollar annual $79.99: Tiller is $19.01 more; vs YNAB $109: $10 less. Do NOT compute a 12-month Simplifi total.")
bl2="[best budgeting apps roundup](/roundup/best-budgeting-apps/), [best net worth tracker roundup](/roundup/best-net-worth-tracker/), [guide to making a budget](/guides/how-to-make-a-budget/), [Monarch alternatives](/alternatives/monarch-money/), [YNAB alternatives](/alternatives/ynab/), [Simplifi alternatives](/alternatives/simplifi/), [Rocket Money alternatives](/alternatives/rocket-money/), [comparison hub](/compare/)"
build("copilot-money","Copilot Money","https://www.copilot.money","Copilot alternatives, apps like Copilot Money, Copilot Money vs Monarch, Copilot Money vs YNAB, Android budgeting apps",
 "What should I use instead of Copilot Money for budgeting?",
 "Monarch, YNAB, Simplifi, Tiller and EveryDollar are the five budgeting apps covered. Published prices run from a free EveryDollar tier to $17.99 a month on EveryDollar Premium monthly billing, and they differ in method, platforms and trial terms. Copilot Money is a single $9 a month plan, or $109 billed yearly, on iPhone, iPad, Mac and Web.",
 ["Monarch","YNAB","Simplifi","Tiller","EveryDollar"],
 [BUD[k] for k in ["Monarch","YNAB","Simplifi","Tiller","EveryDollar"]],bl2,
 "Mention Quicken only as Simplifi's maker. Copilot Money's pricing page lists iPhone, iPad, Mac and Web only; do not claim Android support or lack of it beyond that (say 'the pricing page lists').",BUD["Copilot Money"].replace("### Copilot Money,","### Copilot Money (subject),"),
 "Copilot $9 x 12 = $108 vs $109 billed yearly ($1 more than monthly; $10 less than the $119 it replaces). Monarch Core 12 x $14.99 = $179.88 vs $99.99 yearly. YNAB 12 x $14.99 = $179.88 vs $109 annual (difference $70.88). Tiller $99 a year = $8.25 a month. EveryDollar premium 12 x $17.99 = $215.88 vs $79.99 annual. Copilot $109 yearly vs Monarch Core yearly $99.99: $9.01 more; vs Monarch Plus $199.99: $90.99 less. Do NOT compute a 12-month Simplifi total.")
bl3="[best accounting software for freelancers roundup](/roundup/best-accounting-software-for-freelancers/), [best business bank accounts roundup](/roundup/best-business-bank-accounts/), [QuickBooks alternatives](/alternatives/quickbooks/), [FreshBooks alternatives](/alternatives/freshbooks/), [Wave alternatives](/alternatives/wave/), [Gusto alternatives](/alternatives/gusto/), [comparison hub](/compare/)"
build("xero","Xero","https://www.xero.com/us/pricing-plans/","Xero alternatives for small business, accounting software like Xero, Xero vs QuickBooks, Xero vs FreshBooks, free accounting software",
 "What should I use instead of Xero for small business accounting?",
 "QuickBooks Online, FreshBooks, Zoho Books, Wave and FreeAgent are the five accounting tools covered. Published list prices run from free tiers (QuickBooks Online Free, Zoho Books Free, Wave Starter) up to $340 a month on QuickBooks Online Advanced, and they differ in user limits, client or invoice caps and payroll add-ons. Xero lists Early $27, Growing $59 and Established $97 a month.",
 ["QuickBooks Online","FreshBooks","Zoho Books","Wave","FreeAgent"],
 [ACC[k] for k in ["QuickBooks Online","FreshBooks","Zoho Books","Wave","FreeAgent"]],bl3,
 "Mention Gusto only as Xero Payroll's provider. Note that the page names the subject 'Xero' in US pricing.",XERO,
 "Xero Early $27 x 12 = $324; Growing $59 x 12 = $708; Established $97 x 12 = $1,164. Promo first 6 months: Early $2.70 x 6 = $16.20; Growing $5.90 x 6 = $35.40; Established $9.70 x 6 = $58.20. QuickBooks Simple Start $38 x 12 = $456; Essentials $85 x 12 = $1,020; Plus $140 x 12 = $1,680. Zoho Books Standard annual billing $15 x 12 = $180 vs monthly $20 x 12 = $240. Wave Pro $190 a year vs 12 x $19 = $228 (difference $38). FreeAgent $270 a year vs 12 x $27 = $324 (difference $54). FreshBooks Lite $23 x 12 = $276; Plus $43 x 12 = $516. Xero Growing $59 vs QuickBooks Essentials $85: Xero is $26 a month less; Xero Early $27 vs QuickBooks Simple Start $38: $11 less.")
