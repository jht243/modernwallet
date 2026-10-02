import textwrap
FLOOR=1200
rows=[]
def row(slug,kw,secondary,intent,rq,ans,place,facts,urls,internal,sections,faqs,cf_title,cf_outline,comp,anchor):
    t=f"""# Row: {slug}

route: /guides/{slug}/
slug: {slug}
page type: explainer
medium: text -> text
register: operator
depth floor: {FLOOR} body words
primary keyword: {kw}
secondary keywords: {secondary}
intent: {intent}
reader question: "{rq}"
answer: {ans}
answer placement: {place}

## CLOSED FACT LIST
Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the named source. Arithmetic shown on the page must use only the worked-example numbers below (labelled hypothetical where marked).

""" + "\n".join("- "+f for f in facts) + """

## CLOSED URL LIST (only these external URLs; also written to allowed-urls.txt)
""" + "\n".join("- "+u for u in urls) + """

## Internal links available (use real routes only)
""" + "\n".join("- "+i for i in internal) + """

## Section-by-section coverage (write ORIGINAL prose, do not restate outline wording)
""" + "\n".join(f"{n}. {s}" for n,s in enumerate(sections,1)) + """

## FAQ questions (answer each with a direct lead sentence)
""" + "\n".join("- "+q for q in faqs) + f"""

## Anchor
{anchor}

---

COVERAGE FLOOR — a competitor ({comp}) published a page on this topic:
  Title: {cf_title}
  Section outline (H2/H3): {cf_outline}
Your page MUST cover every topic in this outline and beat its depth and usefulness.
Treat this outline only as a checklist of topics to exceed.
Write 100% ORIGINAL prose. Do NOT copy, paraphrase sentence-by-sentence, or mirror
the competitor's wording. Add information gain they do not have (a first-hand operational
detail, a failure mode, a non-obvious tradeoff, or a decision criterion).
Never reference or name the competitor on the page.
"""
    open(f"{slug}.prompt.md","w").write(t)
    open(f"{slug}.allowed-urls.txt","w").write("\n".join(urls)+"\n")

ANCH="Use only the general editorial framing licensed by _experience.md (calculators-and-guides publisher; no client volume, no named-client claims, no advisory practice). If no honest first-hand observation fits, use `anchor-exempt:` and anchor instead on the decision criterion named in the sections list as the page's original substance."

# 1 medical debt
row("how-to-deal-with-medical-debt","how to deal with medical debt",
 "medical bill payment plan, negotiate medical bills, medical debt help, hospital financial assistance",
 'informational, "what do I do about a medical bill I cannot pay"',
 "How do I deal with medical debt I can't pay?",
 "Before paying anything, request an itemized bill and check it against your insurer's explanation of benefits, then ask the provider for a payment plan or financial assistance application; do not move the bill to a credit card or loan until those two steps are done, because a medical bill carries credit reporting protections a loan does not.",
 'section 1 "What to Do First When a Medical Bill Arrives" (the ordered steps), before any background',
 [
 "Medical and dental expenses are deductible only to the extent they exceed 7.5% of adjusted gross income (AGI), and only if you itemize deductions on Schedule A (Form 1040). Source: IRS Topic 502.",
 "Hypothetical worked example: AGI $80,000, so the 7.5% threshold is $6,000. With $9,000 of medical expenses, $3,000 is the deductible excess. The 2026 standard deduction for a single filer is $16,100 (married filing jointly $32,200), so itemizing for $3,000 of medical expenses alone rarely beats the standard deduction. Source: IRS Topic 502; IRS 2026 inflation adjustments release.",
 "The No Surprises Act (effective January 1, 2022) protects patients from unexpected out-of-network bills for emergency services, non-emergency care by out-of-network providers at in-network hospitals, outpatient departments or surgical centers, and air ambulance services. Source: CMS No Surprises Act consumer page.",
 "Providers usually must give a good faith estimate of cost if you request one or schedule services at least 3 business days in advance. Uninsured or self-pay patients can dispute a bill that is at least $400 above the good faith estimate. The CMS help desk number is 1-800-985-3059. Source: CMS No Surprises Act consumer page.",
 "Nonprofit (charitable) hospitals must have a written financial assistance policy under Section 501(r) of the tax code and must make reasonable efforts to determine whether a patient qualifies before taking extraordinary collection actions. Extraordinary collection actions include legal or judicial process, selling the debt to another party, and reporting to credit bureaus. A 120-day notification period and a 240-day application period both start on the date of the first post-discharge billing statement. Source: IRS billing and collections page for Section 501(r)(6).",
 "Credit bureaus' voluntary rules (as already described on this site's medical-loan guide): paid medical collection debt is not included on credit reports, unpaid medical collections under $500 are excluded, and there is a 365-day waiting period before new medical debt can appear. These are voluntary policies of Equifax, Experian and TransUnion.",
 "The CFPB finalized a rule in January 2025 that would have barred medical debt from credit reports. In July 2025 the U.S. District Court for the Eastern District of Texas vacated it in Cornerstone Credit Union League v. CFPB, so the federal ban is not in effect and the voluntary bureau policies are what applies. Source: CFPB Regulation V rule page (rule status: vacated).",
 "Converting a medical bill into a personal loan or credit card balance makes it ordinary consumer debt: it reports under standard credit rules and loses the under-$500 exclusion and the 365-day waiting period.",
 "Hypothetical worked example: a $6,000 bill on a 0% provider payment plan for 24 months is $250 a month ($6,000 / 24). Whether any given provider offers a 0% plan is the provider's choice; ask.",
 "Debt collectors are covered by the Fair Debt Collection Practices Act (FDCPA) and the CFPB's debt collection rule. Source: CFPB debt collection page.",
 "Home modifications made for medical care (ramps, widened doorways, grab bars) are a medical expense only to the extent the cost exceeds any increase in the home's value. Source: IRS Publication 502.",
 ],
 ["https://www.irs.gov/taxtopics/tc502","https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill","https://www.cms.gov/nosurprises/consumers","https://www.irs.gov/charities-non-profits/billing-and-collections-section-501r6","https://www.consumerfinance.gov/rules-policy/final-rules/prohibition-on-creditors-and-consumer-reporting-agencies-concerning-medical-information-regulation-v/","https://www.consumerfinance.gov/consumer-tools/debt-collection/","https://www.irs.gov/publications/p502"],
 ["/guides/medical-loan-explained/ (existing guide: loans for medical bills and credit reporting)","/guides/how-to-deal-with-debt-collectors/ (existing guide)","/guides/how-to-pay-off-debt/ (existing guide)","/guides/debt-snowball-vs-avalanche/ (existing guide)","/compare/debt-snowball-vs-avalanche/ (comparison)","/budget/ (budget calculator hub)","/personal-loan/ (personal loan calculator hub)","/credit-card-payoff/ (credit card payoff calculator)"],
 ["What to do first when a bill arrives: request the itemized bill, compare it to the explanation of benefits, check for billing errors and No Surprises Act coverage (this section answers the reader question).",
  "Payment plans: how to ask, what to get in writing, the 24-month example.",
  "Hospital financial assistance and charity care: the nonprofit-hospital rule and the 120-day/240-day windows (the highest information-gain section: most readers never ask for the application).",
  "Negotiating the balance yourself, and when a medical bill advocate is worth hiring (state the decision criterion; no invented fee percentages).",
  "Medical credit cards, personal loans, and other credit: why converting the bill loses credit reporting protections; when borrowing still makes sense (inversion case).",
  "Credit reporting rules for medical debt: voluntary bureau policies and the vacated federal rule, presented exactly as in the fact list.",
  "Hardship and income-based help, charities and nonprofit assistance (describe the types; no invented program names or limits).",
  "Tax angle: the 7.5% AGI floor example, and why it rarely helps.",
  "Collections: what changes once a bill is sent to a collector, and a short numbered checklist of what to do and not to do.",
  "Who this is not for and what would change our answer."],
 ["How do I deal with medical debt I can't afford to pay?","Can I negotiate a hospital bill?","Is medical debt on my credit report?","Should I put a medical bill on a credit card?","Can I deduct medical expenses on my taxes?"],
 "7 Ways to Deal with Medical Debt",
 "Medical bill payment plan; medical credit card; other credit options; negotiating costs yourself; hiring a medical bill advocate; hardship plan eligibility; organization assistance; things to consider with medical bills",
 "NerdWallet", ANCH)

# 2 homeowner deductions
row("tax-deductions-for-homeowners","tax deductions for homeowners",
 "homeowner tax deductions 2026, mortgage interest deduction, property tax deduction, home equity loan interest deduction, home office deduction",
 'informational, "what can I deduct as a homeowner"',
 "Which tax deductions can a homeowner actually claim, and is itemizing worth it?",
 "Most homeowners deduct mortgage interest, property taxes (within the state and local tax cap), and sometimes points, but only if their itemized total beats the standard deduction; with a $400,000 mortgage at 6.5% the first-year interest is about $25,868, which still falls short of the $32,200 married-filing-jointly standard deduction before property taxes are added.",
 'section 1 "Do Your Deductions Beat the Standard Deduction?" (the test and worked example), before listing individual deductions',
 [
 "2026 standard deduction: $16,100 for single filers and married filing separately, $32,200 for married filing jointly, $24,150 for head of household. Source: IRS 2026 inflation adjustments release.",
 "Mortgage interest is deductible on acquisition debt up to $750,000 ($375,000 if married filing separately) for homes acquired after December 15, 2017; a $1 million limit ($500,000 married filing separately) applies to mortgages taken out before December 16, 2017. Source: IRS Topic 505 and Publication 936.",
 "Hypothetical worked example (engine-computed): a $400,000 30-year fixed mortgage at 6.5% has a monthly principal-and-interest payment of $2,528.27 and about $25,868.36 of interest in the first year. A $300,000 mortgage at 6.5% has a $1,896.20 payment and about $19,401.27 of first-year interest.",
 "Hypothetical stack: $25,868 interest plus $5,000 of property taxes is $30,868, which is below the $32,200 married-filing-jointly standard deduction, so that couple would not benefit from itemizing on those two items alone. The same couple would need roughly $1,332 more in other itemized deductions ($32,200 - $30,868) before itemizing wins.",
 "Home equity loan and HELOC interest is deductible only if the proceeds were used to buy, build, or substantially improve the home that secures the loan. Quote from IRS Publication 936: \"No matter when the indebtedness was incurred, you can no longer deduct the interest from a loan secured by your home to the extent the loan proceeds weren't used to buy, build, or substantially improve your home.\" The same $750,000 overall limit applies.",
 "Points paid on a primary-residence mortgage can be deducted in full in the year paid if specific criteria are met, including that the loan was used to buy or build the home and the points are clearly shown as points on the settlement documents; otherwise points are deducted ratably over the life of the loan. Points paid by a seller are not deductible by the buyer as interest. Source: IRS Publication 936 and Topic 505.",
 "State and local real property taxes are deductible only if you itemize on Schedule A. The combined state and local tax (SALT) deduction cap is $40,000 for 2025 ($20,000 married filing separately) and cannot be reduced below $10,000; the cap is scheduled to rise 1% a year, which makes it $40,400 for 2026 under current law (verify the current figure at IRS Topic 503). Source: IRS Topic 503.",
 "The itemized deduction for mortgage insurance premiums is described in IRS Publication 936 as expired; tax law changes in 2025 affect this, so the page must tell the reader to check the current-year Publication 936 rather than state a rule.",
 "Home office: the simplified method is $5 per square foot of home used exclusively and regularly for business, up to 300 square feet, a maximum of $1,500. It is available to self-employed people and business owners; employees cannot claim a home office deduction because miscellaneous itemized deductions for employee business expenses were eliminated for tax years beginning after 2017. Source: IRS simplified option page.",
 "Home modifications for medical care count as a medical expense only for the amount that exceeds any increase in the home's value, and medical expenses are deductible only above 7.5% of AGI and only if you itemize. Source: IRS Publication 502 and Topic 502.",
 "Not deductible as a general rule (state as a plain list without inventing sources): principal payments, homeowners insurance premiums, routine repairs and maintenance, utilities, and HOA fees on a primary home. Source: IRS Publication 530 (reader to verify).",
 ],
 ["https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill","https://www.irs.gov/taxtopics/tc505","https://www.irs.gov/publications/p936","https://www.irs.gov/taxtopics/tc503","https://www.irs.gov/businesses/small-businesses-self-employed/simplified-option-for-home-office-deduction","https://www.irs.gov/publications/p502","https://www.irs.gov/taxtopics/tc502"],
 ["/guides/tax-deductions-checklist/ (existing guide)","/guides/mortgage-early-payoff-tax-implications/ (existing guide)","/guides/heloc-calculator-explained/ (existing guide)","/compare/heloc-vs-home-equity-loan/ (comparison)","/guides/first-time-home-buyer-guide/ (existing guide)","/mortgage/ (mortgage calculator hub)","/mortgage/closing-cost-calculator/ (calculator)","/mortgage/home-affordability-calculator/ (calculator)","/heloc-calculator/ (calculator)"],
 ["Do your deductions beat the standard deduction: the test, the 2026 amounts, the $400,000 and $300,000 mortgage examples (answers the reader question).",
  "Mortgage interest: the $750,000 limit, older $1 million limit, where interest shows up.",
  "Home equity loan and HELOC interest: the use-of-proceeds test, with a practical example of a kitchen remodel vs paying off credit cards.",
  "Discount points: when they are deductible in the year paid vs spread over the loan.",
  "Property taxes and the SALT cap: $40,000 / $40,400 and the $10,000 floor, itemizing requirement.",
  "Home office expenses: simplified method and who may claim.",
  "Medically necessary home improvements: the exceeds-the-value-increase rule.",
  "Homeowner costs that are not deductible (plain list).",
  "A short numbered checklist of what records to keep and what to do before filing; mortgage insurance premium status handled as a verify-it item.",
  "Who this is not for and what would change our answer (e.g., high-tax-state owner with a large mortgage vs. owner with a nearly paid-off loan)."],
 ["Is mortgage interest tax deductible in 2026?","Are property taxes deductible?","Can I deduct home equity loan or HELOC interest?","Can I deduct home improvements?","Should I itemize or take the standard deduction as a homeowner?"],
 "Tax Deductions for Homeowners in 2026",
 "Standard deduction for 2026; mortgage interest; home equity loan and HELOC interest; discount points; property taxes; home office expenses; medically necessary home improvements; homeowner costs that are not deductible; tax help for complex issues",
 "NerdWallet", ANCH)

# 3 RIA
row("what-is-a-registered-investment-advisor","registered investment advisor",
 "what is an RIA, RIA vs financial advisor, how to find a registered investment advisor, how do RIAs make money, investment adviser representative",
 'informational, "what is an RIA and should I use one"',
 "What is a registered investment advisor and how do I check that one is legitimate?",
 "A registered investment advisor (RIA) is a firm paid to give investment advice that is registered with the SEC or a state regulator and owes clients a fiduciary duty; check any firm or person for free on the SEC's Investment Adviser Public Disclosure database and read its Form ADV before you sign anything.",
 'section 1 "How to Check an RIA Before You Hire One" (the verification sequence), before the definitions',
 [
 "An investment adviser is, generally, a natural person or company that, for compensation, is engaged in the business of providing advice to others or issuing reports or analyses about securities. Those meeting the definition must register with the SEC or state regulators unless they qualify for an exemption. Source: SEC investment advisers page (Investment Advisers Act).",
 "RIAs managing $100 million or more in assets under management (AUM) are generally overseen by the SEC; RIAs with less than $100 million are generally regulated by the state where the adviser has its principal place of business. Mid-sized advisers ($25 million to $100 million) may register with the SEC if not required by their state; registration with the SEC is required when AUM reaches $110 million, and an adviser must deregister when it falls below $90 million. Internet-based advisers may register with the SEC regardless of AUM. Source: FINRA investment advisers page and SEC investment advisers page.",
 "Investment advisers are fiduciaries: they must act in the retail investor's best interests throughout the advisory relationship. Source: SEC Form CRS FAQ page.",
 "The SEC's Investment Adviser Public Disclosure (IAPD) database at adviserinfo.sec.gov lets you search any registered adviser's Form ADV for free. FINRA also points investors to SEC Action Lookup for Individuals (SALI). Source: FINRA investment advisers page.",
 "Form ADV Part 1 is registration information; Part 2 (the brochure) describes the adviser's business, fees, strategies, disciplinary history and conflicts of interest and must be delivered to clients. Both SEC-registered RIAs and broker-dealers must give retail clients Form CRS, a short relationship summary that helps you compare services and costs.",
 "An investment adviser representative (IAR) is generally a supervised person of an advisory firm who regularly solicits, meets with, or communicates with the firm's clients. An RIA is the firm; an IAR is the individual who works with you.",
 "RIAs are generally paid a fee based on the value of the assets in the account, although some charge a flat or hourly fee. Source: FINRA investment advisers page.",
 "The word 'adviser' (the legal spelling in the Investment Advisers Act) and 'advisor' are used interchangeably in everyday writing; the registration status, not the spelling, is what matters.",
 "Hypothetical worked example: a 1% assets-under-management fee on $500,000 is $5,000 a year; a $2,500 flat annual fee for the same planning scope is half that. A 1% fee on $1,000,000 is $10,000. (Illustration only, not a quote of any firm's fees.)",
 ],
 ["https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/investment-advisers","https://www.finra.org/investors/investing/working-with-investment-professional/investment-advisers","https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/frequently-asked-questions-form-crs","https://adviserinfo.sec.gov/","https://www.sec.gov/files/formcrs.pdf"],
 ["/guides/how-to-choose-a-financial-advisor/ (existing guide)","/guides/financial-advisor-worth-it/ (existing guide)","/compare/financial-advisor-vs-financial-planner/ (comparison)","/compare/financial-advisor-vs-cpa/ (comparison)","/compare/flat-fee-vs-aum-based-financial-advisors/ (comparison)","/roundup/best-robo-advisors/ (roundup)","/portfolio/ (portfolio calculator hub)","/retirement/ (retirement calculator hub)"],
 ["How to check an RIA before you hire one: IAPD search, Form ADV Part 2, Form CRS, disciplinary history (answers the reader question).",
  "What an RIA is, and 'adviser' vs 'advisor'.",
  "RIA vs IAR vs broker-dealer representative: who is the firm and who is the person.",
  "Who regulates RIAs: the $100 million, $110 million and $90 million thresholds and state regulators.",
  "The fiduciary duty and what it does and does not guarantee (it does not guarantee returns or low fees; state the decision criterion).",
  "How RIAs make money: AUM percentage, flat fee, hourly; the 1% worked examples; link the flat-fee-vs-AUM comparison.",
  "How an RIA can help, and the questions to ask in a first meeting (numbered list).",
  "Who this is not for (small balances, simple needs, robo-advisor alternative) and what would change our answer."],
 ["What does RIA stand for?","Is a registered investment advisor a fiduciary?","How do I verify a registered investment advisor?","How do RIAs get paid?","What is the difference between an RIA and a financial advisor?"],
 "What Is a Registered Investment Advisor (RIA)?",
 "Financial advisor or adviser; what about RIAs and IARs; how a registered investment advisor can help you; who regulates registered investment advisors; how to find a registered investment advisor; how do RIAs make money",
 "NerdWallet", ANCH)

# 4 payday
row("payday-loan-calculator-explained","payday loan calculator",
 "payday loan APR, payday loan cost, how do payday loans work, payday loan alternatives, rollover payday loan",
 'informational, "how much does a payday loan really cost"',
 "How much does a payday loan really cost as an APR?",
 "Divide the fee by the amount borrowed, multiply by 365, divide by the loan length in days, and you have the APR: a $15 fee per $100 borrowed on a 14-day loan is a 391.07% APR, and renewing it four times costs $240 on a $400 loan without paying down a dollar of principal.",
 'section 1 "How to Calculate the APR on a Payday Loan" (the formula and the 14-day example), before what a payday loan is',
 [
 "CFPB: a common payday loan fee is $15 per $100 borrowed; state laws typically set the maximum from $10 to $30 per $100. Payday loans are usually repaid in a single payment on the borrower's next payday, with the due date typically two to four weeks after the loan is made. A two-week loan with a $15 per $100 fee equates to an APR of almost 400 percent. Credit card APRs can range from about 12 percent to about 30 percent. Payday lenders do not generally verify your ability to repay while meeting other obligations. Some states permit a rollover, where the borrower pays only the fees and the lender extends the due date. Source: CFPB 'What is a payday loan?'",
 "APR formula for a single-payment short loan: APR = (fee / amount borrowed) x (365 / term in days) x 100.",
 "Engine-computed APRs for a 14-day loan: $10 per $100 = 260.71%; $15 per $100 = 391.07%; $30 per $100 = 782.14%. A $15 per $100 fee on a 28-day loan = 195.54% (same fee, double the days, half the APR; the dollar cost is unchanged).",
 "Hypothetical worked example: borrow $400 for 14 days at $15 per $100. Fee = $60. Repay $460. APR = 60/400 x 365/14 x 100 = 391.07%.",
 "Hypothetical rollover example: the borrower cannot repay $460 on payday and pays only the $60 fee to extend. After four fee payments (the original and three renewals) the borrower has paid $240 (4 x $60) and still owes the $400 principal. That is a 60% cost on the principal over eight weeks.",
 "Comparison, hypothetical: a $400 cash advance on a credit card at a 30% APR for 14 days costs about $4.60 in interest ($400 x 0.30 x 14/365), not counting any cash advance fee. A $400 personal installment loan at 36% APR over six months has a monthly payment of $73.84 and total interest of $43.03. (Illustration only; the reader must price their own offers.)",
 "Alternatives to name by type, without inventing terms or limits: asking the creditor or utility for an extension or payment plan, a credit union small-dollar loan, a personal loan, a credit card cash advance (high fee, but far cheaper than a payday loan on the figures above), a paycheck advance from an employer, community or nonprofit assistance, and borrowing from family. Credit builder loans are a different product and do not provide emergency cash.",
 "Getting out of a rollover cycle: pay the fee plus a part of principal if allowed, ask the lender whether a payment plan or extended payment option exists (availability varies by state; reader must ask), stop borrowing from a second lender to repay the first, and cut other spending for one pay cycle. Do not state any state-specific law.",
 "Cost ceiling and legality vary by state; the page must say so and tell the reader to check their state regulator rather than state a specific state's rules.",
 ],
 ["https://www.consumerfinance.gov/ask-cfpb/what-is-a-payday-loan-en-1567/"],
 ["/personal-loan/ (personal loan calculator hub)","/credit-card-payoff/ (credit card payoff calculator)","/guides/how-to-pay-off-debt/ (existing guide)","/guides/credit-card-cash-advance-guide/ (existing guide)","/guides/secured-personal-loans-explained/ (existing guide)","/guides/how-to-deal-with-debt-collectors/ (existing guide)","/budget/ (budget calculator hub)","/guides/interest-per-day-calculator-explained/ is NOT a real route; do not use it"],
 ["How to calculate the APR on a payday loan: the formula, the 14-day $400 example and the $10/$15/$30 table (answers the reader question).",
  "What a payday loan is and how it works: single payment, next payday, two to four weeks, no ability-to-repay check.",
  "The rollover trap: the $240-on-$400 example and why the fee is paid again without reducing principal.",
  "Why the same fee gives a different APR at 14 vs 28 days (dollar cost vs APR), and when APR misleads (the inversion case: for a loan you will repay in two weeks the dollar fee is the number to weigh; APR is the number for comparing with other loans).",
  "How it compares: credit card cash advance and personal installment loan figures.",
  "Alternatives to a payday loan by type, and how to pick between them (numbered decision order).",
  "How to get out of a payday loan cycle (numbered steps).",
  "Advantages and disadvantages stated honestly (speed, no credit-score reliance vs cost, no ability-to-repay check).",
  "Who this is not for and what would change our answer."],
 ["How do you calculate the APR on a payday loan?","How much does a $500 payday loan cost?","What happens if I can't repay a payday loan?","Is a payday loan worse than a credit card cash advance?","Are payday loans legal in every state?"],
 "Payday Loan Calculator",
 "What is a payday loan; how do payday loans work; alternatives to payday loans; how to decide the best alternative; how to get out of a payday loan trap; what is a credit-builder loan; advantages and disadvantages of payday loans",
 "Omni Calculator", ANCH)

# 5 student loan payment
row("how-to-calculate-your-monthly-student-loan-payment","student loan payment calculator",
 "student loan monthly payment formula, student loan calculator, standard repayment plan payment, student loan interest",
 'informational + calculator-intent, "what will my student loan payment be"',
 "How do I calculate my monthly student loan payment?",
 "Use the amortization formula payment = P x i / (1 - (1 + i)^-n), where P is the balance, i is the monthly rate (annual rate divided by 12), and n is the number of monthly payments; $30,000 at a 6.52% fixed rate over 10 years comes to $340.95 a month and $10,913.92 of interest.",
 'section 1 "The Student Loan Payment Formula With a Worked Example" (formula and the $30,000 example), before federal vs private',
 [
 "Fixed monthly payment formula: payment = P x i / (1 - (1 + i)^-n), where P = principal balance, i = annual rate / 12, n = number of monthly payments.",
 "Federal Direct Subsidized and Unsubsidized Loans for undergraduate students first disbursed between July 1, 2026 and June 30, 2027 have a fixed interest rate of 6.52%, based on the 10-year Treasury note high yield of 4.468% plus a 2.05% add-on; the rate stays fixed for the life of the loan. Source: U.S. Department of Education Federal Student Aid announcement GENERAL-26-33.",
 "Standard repayment plan: a fixed amount of at least $50 a month for up to 10 years (up to 30 years for Consolidation Loans), not counting deferment and forbearance; it generally repays the loan with the lowest interest cost to the borrower.",
 "Engine-computed examples at 6.52% fixed, monthly payments: $30,000 over 5 years (60 payments) = $587.27 a month, $5,235.93 of interest, $35,235.93 total; over 10 years (120) = $340.95 a month, $10,913.92 interest, $40,913.92 total; over 20 years (240) = $224.03 a month, $23,766.08 interest, $53,766.08 total; over 25 years (300) = $202.94 a month, $30,881.17 interest, $60,881.17 total. $50,000 over 10 years = $568.25 a month, $18,189.86 interest, $68,189.86 total.",
 "Lengthening a $30,000 loan from 10 years to 20 years lowers the payment by $116.92 a month ($340.95 - $224.03) but adds $12,852.14 of interest ($23,766.08 - $10,913.92).",
 "Interest accrues daily on the outstanding balance in practice; the monthly-rate formula is a close planning estimate. The reader's loan servicer statement is the authority for the exact payoff figure.",
 "Federal and private loans differ: federal loans have fixed rates set by law each year, standardized repayment plans and protections such as deferment and forbearance; private loan rates and terms are set by the lender and depend on credit. Do not state private rates or any lender's terms.",
 "Federal repayment plans other than standard (income-driven options) and loan forgiveness rules have changed repeatedly by law and rule; the page must name them only as 'other plans' and send the reader to studentaid.gov to check which plans are currently available for their loan type, without stating plan names, percentages or forgiveness timelines.",
 "Paying extra toward principal shortens the term and cuts interest; a borrower should confirm with the servicer that extra payments are applied to principal, not held for the next due date.",
 ],
 ["https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-06-04/interest-rates-federal-direct-loans-first-disbursed-between-july-1-2026-and-june-30-2027","https://studentaid.gov/"],
 ["/guides/student-loan-standard-repayment-plan/ (existing guide)","/guides/should-you-refinance-student-loans/ (existing guide)","/guides/what-happens-if-you-dont-pay-your-student-loans/ (existing guide)","/roundup/best-student-loan-refinance/ (roundup)","/personal-loan/ (personal loan calculator hub; the same amortization math)","/budget/ (budget calculator hub)","/credit-card-payoff/ (credit card payoff calculator)"],
 ["The payment formula with the $30,000 at 6.52% over 10 years worked example (answers the reader question).",
  "How term changes payment and total cost: the 5, 10, 20 and 25 year table, and the 10 vs 20 year trade-off ($116.92 a month saved, $12,852.14 more interest).",
  "Federal vs private loans: what sets the rate, what the 2026-27 undergraduate rate is.",
  "The standard repayment plan: fixed payment, up to 10 years, $50 minimum; and a pointer to other plans via studentaid.gov without naming plan terms.",
  "How interest accrues and why a servicer's payoff figure can differ slightly from the formula.",
  "How to use the numbers: extra payments, a numbered checklist (find your rate and balance, pick a term, compute, check budget fit, confirm with servicer).",
  "When a lower payment is the right choice (income-constrained borrowers; inversion case) vs the shortest term.",
  "Who this is not for and what would change our answer (e.g., a different interest rate, a forgiveness-eligible borrower)."],
 ["How do I calculate my monthly student loan payment?","How much is the payment on a $50,000 student loan?","What is the current federal student loan interest rate?","Does a longer term save money on student loans?","Can I pay off my student loan early?"],
 "Student Loan Calculator",
 "What is a student loan; how do student loans work; how to use the student loans calculator; federal vs private; how to apply; how to calculate the loan balance; NSLDS; Perkins loan",
 "Omni Calculator", ANCH)

# 6 home improvement loan
row("home-improvement-loan-guide","home improvement loan",
 "home improvement loan calculator, how to finance home renovations, home improvement loan rates, are home improvement loans tax deductible",
 'informational, "how should I pay for a home improvement"',
 "What is the best way to finance a home improvement project?",
 "Pick the cheapest loan that you can repay on schedule: a $25,000 project costs a $506.91 monthly payment and $5,414.59 of interest as an 8% five-year loan, but $556.11 and $8,366.67 at 12%, so the rate and any origination fee decide which loan wins.",
 'section 1 "How to Choose a Home Improvement Loan" (the decision order and the $25,000 comparison), before definitions',
 [
 "Fixed payment formula: payment = P x i / (1 - (1 + i)^-n), i = annual rate / 12, n = number of monthly payments.",
 "Hypothetical worked examples for a $25,000 loan (illustrative rates, not offers): 8% over 60 months = $506.91 a month and $5,414.59 interest; 12% over 60 months = $556.11 a month and $8,366.67 interest; 8% over 120 months = $303.32 a month and $11,398.28 interest; 7% over 180 months = $224.71 a month and $15,447.27 interest.",
 "Origination fee, hypothetical: a 5% fee on a $25,000 loan is $1,250 taken from the proceeds, so you receive $23,750. To receive $25,000 after the fee you must borrow $26,315.79 ($25,000 / 0.95); at 8% over 60 months that is a $533.59 payment and $5,699.57 of interest. The fee therefore adds $26.68 a month and $284.98 of interest versus the no-fee example above.",
 "Home equity loan and HELOC interest is deductible only if the proceeds were used to buy, build, or substantially improve the home that secures the loan, within the $750,000 overall acquisition debt limit; personal loan interest on an unsecured loan used for home improvement is personal interest and is not deductible by that rule. Quote from IRS Publication 936: \"No matter when the indebtedness was incurred, you can no longer deduct the interest from a loan secured by your home to the extent the loan proceeds weren't used to buy, build, or substantially improve your home.\" Deductions help only if the borrower itemizes; the 2026 standard deduction is $16,100 single and $32,200 married filing jointly. Source: IRS Publication 936; IRS 2026 inflation adjustments release.",
 "Secured loans (home equity loan, HELOC, cash-out refinance) use the home as collateral and typically carry lower rates than unsecured personal loans but put the home at risk if payments are missed; unsecured personal loans do not require collateral but typically carry higher rates. Do not state rate figures.",
 "Credit cards can fund small projects but carry variable rates that are usually higher than installment loan rates; the page must not state any rate figure beyond the CFPB statement that credit card APRs can range from about 12 percent to about 30 percent (source: CFPB payday loan page).",
 "Medically necessary home modifications are a medical expense only for the amount exceeding the increase in home value. Source: IRS Publication 502.",
 "Government-backed and contractor financing programs exist; the page must name them only generally (contractor financing, government-backed renovation loans) and tell the reader to verify any program's terms with the lender, with no program names, limits or rates stated.",
 ],
 ["https://www.irs.gov/publications/p936","https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill","https://www.consumerfinance.gov/ask-cfpb/what-is-a-payday-loan-en-1567/","https://www.irs.gov/publications/p502"],
 ["/compare/heloc-vs-personal-loan/ (comparison)","/compare/home-equity-loan-vs-personal-loan/ (comparison)","/compare/heloc-vs-home-equity-loan/ (comparison)","/compare/cash-out-refinance-vs-heloc/ (comparison)","/compare/secured-vs-unsecured-loan/ (comparison)","/guides/heloc-calculator-explained/ (existing guide)","/heloc-calculator/ (calculator)","/personal-loan/ (personal loan calculator hub)","/mortgage/ (mortgage calculator hub)","/budget/ (budget calculator hub)"],
 ["How to choose a home improvement loan: the decision order and the $25,000 comparison table (answers the reader question).",
  "What a home improvement loan is and the main types: personal loan, home equity loan, HELOC, cash-out refinance, credit card, contractor financing.",
  "Secured vs unsecured: the collateral trade-off and who should avoid putting the home at risk.",
  "The fee effect: the 5% origination fee example.",
  "Term length: 5, 10 and 15 year payments vs total interest for the $25,000 example.",
  "Are home improvement loans tax deductible: the use-of-proceeds rule and the itemizing test.",
  "How to apply and what lenders look at (describe in general terms; no invented thresholds), and a numbered checklist to compare two offers.",
  "When to wait or pay cash instead (the inversion case: a project that does not add value or fix a safety issue), first-time buyer considerations stated generally.",
  "Who this is not for and what would change our answer."],
 ["What is the best loan for home improvements?","Are home improvement loans tax deductible?","Is a HELOC or a personal loan better for a renovation?","How much does a $25,000 home improvement loan cost?","Can I get a home improvement loan with bad credit?"],
 "Home Improvement Loan Calculator",
 "What is a home improvement loan; how to use the calculator; how to get a home improvement loan; governmental types; home equity, credit cards, personal loans; secured vs unsecured; what type is best; best reason to take one; can I get one when buying my first home; are they tax deductible",
 "Omni Calculator", ANCH)
