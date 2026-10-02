import json
def load(s): return json.load(open(f'drafts/{s}.json'))
def save(s,d): json.dump(d,open(f'drafts/{s}.json','w'),indent=2,ensure_ascii=False)
def R(d,old,new,count=1):
    n=0
    def walk(o):
        nonlocal n
        if isinstance(o,str):
            if old in o: n+=o.count(old); return o.replace(old,new)
            return o
        if isinstance(o,dict): return {k:walk(v) for k,v in o.items()}
        if isinstance(o,list): return [walk(v) for v in o]
        return o
    r=walk(d)
    assert n>=1,('NOT FOUND',old[:70])
    return r
def T(d,title,h1=None):
    assert 50<=len(title)<=60,(len(title),title)
    d['title']=title
    if h1: d['h1']=h1
    return d

# ---- medical debt
s='how-to-deal-with-medical-debt'; d=load(s)
d=T(d,"How to Deal with Medical Debt You Cannot Afford to Pay")
for o,n in [
("At ModernWallet, we see people rush to put medical expenses on plastic out of panic, which strips away the special protections that apply only to healthcare debt.","Putting a medical bill on a credit card out of panic strips away protections that apply to healthcare debt."),
("such as wage garnishment or property liens","such as a lawsuit"),
("during which the facility cannot initiate extraordinary collection actions without prior written notice.","and the hospital must send written notice at least 30 days before the end of that period describing the collection actions it may take."),
("allowing you to submit a completed financial assistance application even if collections activity has begun.","during which you can submit a financial assistance application."),
("Eligibility is typically based on household income relative to federal poverty guidelines, and an approved application can reduce a balance to zero.","Each hospital sets its own eligibility rules, so ask for the written policy and read the income limits before you apply."),
(", or they may adjust fees down to Medicare reimbursement benchmarks or local commercial averages",""),
("where a single missed payment can trigger credit bureau reporting within thirty days","where a missed payment is reported under standard credit rules"),
("For unpaid medical debts of $500 or more, the credit bureaus observe a mandatory 365-day waiting period from the date of delinquency before the collection account can be placed on your credit profile.","The bureaus also wait 365 days before new medical debt can appear on a credit report."),
("Request written debt validation within thirty days of the collector's initial contact to verify","Request written validation of the debt to verify"),
("or run the balances through our [snowball vs avalanche comparison](/compare/debt-snowball-vs-avalanche/)",""),
("Our advice to prioritize hospital negotiations over outside borrowing would change if a court vacates the current voluntary credit bureau reporting policies, or if a provider offers a binding written discount larger than the cost of short-term commercial financing. Until those conditions occur, keeping medical balances with the primary healthcare facility remains the safest path.","Our advice to negotiate before borrowing would change if the credit bureaus dropped their voluntary medical debt policies or if a provider refused every payment plan and demanded payment up front."),
("or if it is less than 365 days delinquent","or if it is newer than the bureaus' 365-day waiting period"),
]: d=R(d,o,n)
save(s,d)

# ---- homeowners
s='tax-deductions-for-homeowners'; d=load(s)
d=T(d,"Tax Deductions for Homeowners and the Itemizing Test in 2026","Tax Deductions for Homeowners in 2026")
for o,n in [
("Most homeowners can deduct mortgage interest, state and local property taxes, and mortgage points, but only if their total itemized deductions exceed the standard deduction.","The main tax deductions for homeowners are mortgage interest, state and local property taxes, and mortgage points, but they only help when total itemized deductions exceed the standard deduction."),
("At ModernWallet, we see many buyers assume that purchasing a property immediately lowers their tax bill. For a married couple","Many buyers assume that buying a home immediately lowers their tax bill. For a married couple"),
(", paying points must be an established business practice in your area, and the amount paid must be clearly itemized on your settlement statement as points or loan origination fees.",", and the points must be clearly shown as points on your settlement statement."),
(" For instance, points paid to refinance an existing home loan typically must be amortized over the full term rather than claimed at once.",""),
("Property taxes paid through an escrow account are deductible only in the calendar year the mortgage servicer actually transfers the money to the taxing authority. Transfer taxes, transfer fees, and utility service assessments are not deductible as property taxes.","Check the amount on your county property tax statement, because only taxes actually paid count."),
("such as an $800,000 loan originating in a high-interest environment","such as a $700,000 loan at a high interest rate"),
("If your total annual mortgage interest and local taxes stay well below $32,200,","If you are married filing jointly and your total annual mortgage interest and local taxes stay well below $32,200,"),
]: d=R(d,o,n)
save(s,d)

# ---- RIA
s='what-is-a-registered-investment-advisor'; d=load(s)
d=T(d,"What a Registered Investment Advisor Is and How to Check One","What Is a Registered Investment Advisor (RIA)?")
for o,n in [
("At ModernWallet, we review advisory frameworks and investor disclosures across the financial industry, and the most common misstep we see readers make is assuming any professional calling themselves a financial advisor is legally bound to put clients first. In reality, the legal label registered investment advisor applies","Many people assume anyone calling themselves a financial advisor is legally bound to put clients first. The legal label registered investment advisor applies"),
("and gives you an unedited record of whether regulators or clients have ever taken formal action against the practice","and shows the firm's disciplinary history"),
("emphasizes that this standard requires advisers to eliminate or disclose conflicts of interest and provide undivided loyalty in portfolio recommendations","describes this standard"),
("requires the firm and its representatives to act in the client's best interests, eliminate or disclose conflicts of interest, and provide undivided loyalty throughout the advisory relationship","requires the firm to act in the client's best interests throughout the advisory relationship"),
("While both may give guidance on your portfolio, an RIA operates under an ongoing fiduciary requirement, whereas broker-dealers historically operate under sales-focused transaction rules. Understanding whether you are dealing with an RIA or a broker-dealer helps you evaluate how your professional is compensated.","Both may give guidance on your portfolio, and both SEC-registered RIAs and broker-dealers must give you Form CRS so you can compare services and costs. Ask which one you are dealing with, because it changes how your professional is paid."),
("which makes analyzing fee structures essential before hiring","which makes it worth comparing fee structures before hiring"),
("utilizing automated platforms","using automated platforms"),
]: d=R(d,o,n)
save(s,d)

# ---- payday
s='payday-loan-calculator-explained'; d=load(s)
d=T(d,"Payday Loan Calculator Math for the True APR and Fees","How a Payday Loan Calculator Turns Fees Into Triple-Digit APR")
for o,n in [
("At ModernWallet, we see borrowers treat a flat fee as a small convenience charge without converting the figure into an annualized rate.","A flat fee reads like a small convenience charge until it is converted into an annualized rate."),
("Renewing or rolling over that balance compounds the damage quickly.","Rolling over the balance adds another fee each cycle."),
("Borrowers secure the advance by providing a postdated personal check or granting electronic debit access to their checking account. On the due date, the lender deposits the check or initiates an automated withdrawal for the principal plus the agreed fee.\n\n",""),
(", where interest rates face statutory federal limits",""),
("as several states require lenders to offer structured payoff options without additional fees","since availability varies by state and lender"),
("Payday loans offer rapid access to funds with minimal qualification hurdles. Lenders process applications within minutes, disburse cash on the same day, and do not rely on standard credit scores during approval.","Payday loans offer quick access to cash with little underwriting, because lenders do not generally verify your ability to repay."),
("## Audience Fit and Verdict Criteria","## Who Should Skip a Payday Loan"),
("Our verdict on payday loans would change only if a borrower faced an immediate, catastrophic fee exceeding 400% with no other liquidity source, and possessed guaranteed, unencumbered funds arriving on payday to eliminate the entire principal in full on day 14.","Our verdict would change only if a borrower had no cheaper source of cash and was certain to repay the full $460 on day 14, in which case the $60 dollar fee, not the APR, is the number to weigh."),
("The lender will attempt to cash your postdated check or electronically debit your bank account, which can trigger overdraft fees if your balance is insufficient. If the balance remains unpaid, the lender may offer a costly rollover, send the account to a third-party collections agency, or file a civil lawsuit.","In some states the lender may offer a rollover, where you pay only the fee and the due date is extended, but the fee repeats and the principal stays the same. Ask the lender about a payment plan before the due date, and read the loan contract for what happens if you miss it."),
("No, payday loans are not legal in every state. Several states ban payday lending outright or enforce strict interest rate caps that prevent lenders from operating high-cost storefronts, so check with your state financial regulator to see your local laws.","No. State law sets whether payday lending is allowed and how much it may cost, so check your state financial regulator to see your local rules."),
]: d=R(d,o,n)
save(s,d)

# ---- student loan
s='how-to-calculate-your-monthly-student-loan-payment'; d=load(s)
d=T(d,"Student Loan Payment Calculator Formula With Worked Examples","How to Calculate Your Monthly Student Loan Payment")
for o,n in [
("At ModernWallet, we see borrowers get tripped up by how small changes in interest and term length quietly compound into thousands of dollars in total financing costs. For example,","Small changes in interest and term length add up to thousands of dollars in total financing cost. For example,"),
("without disrupting essential living expenses","without disrupting basic living expenses"),
("Yes, you can make extra payments toward your student loans at any time without penalty. You should confirm with your loan servicer that all extra funds","Generally yes, but confirm with your loan servicer that prepayment is allowed and that all extra funds"),
("not suitable for borrowers enrolled in income-contingent federal repayment programs or those pursuing public service loan forgiveness. Those programs determine","not suitable for borrowers on income-driven federal repayment plans. Those plans determine"),
]: d=R(d,o,n)
save(s,d)

# ---- home improvement
s='home-improvement-loan-guide'; d=load(s)
d=T(d,"How to Choose a Home Improvement Loan by Total Cost","How to Choose and Compare a Home Improvement Loan")
for o,n in [
("The best way to finance a home improvement project is to pick the cheapest financing structure that you can repay comfortably without putting your primary home at risk.","The best home improvement loan is the cheapest financing structure you can repay comfortably without putting your home at risk."),
("At ModernWallet, we review loan structures and calculation methods across personal finance to help borrowers see the true dollar cost of credit before signing an agreement. A $25,000 project","A $25,000 project"),
("Selecting the right loan involves three sequential checks. First, check whether you have sufficient equity to access secured rates without threatening your housing security. Second, evaluate whether your income supports the higher monthly payment of a five-year repayment schedule to avoid ballooning interest charges. Third, compare the total expense of origination fees against any interest rate discounts offered by the lender.","Work through three checks in order:\n\n1. Check whether you have enough equity to use a secured loan without threatening your housing security.\n2. Check whether your income supports the $506.91 payment of a five-year schedule in the example above.\n3. Compare the total cost of origination fees against any rate discount the lender offers."),
(" over terms that commonly range from two to seven years",""),
(", typically making interest-only payments before entering a principal-and-interest repayment period",""),
(", demand no home equity, and close significantly faster than equity-backed instruments",", and demand no home equity"),
("Unsecured personal loans used for remodeling do not qualify for an interest deduction under any circumstances because the Internal Revenue Service classifies that interest as non-deductible personal interest.","An unsecured personal loan used for remodeling generally does not qualify for an interest deduction, because it is not secured by your home."),
("Personal loan interest is never deductible.","Interest on an unsecured personal loan is generally not deductible."),
("To walk away","To walk away"),
(" Borrowers who prioritize monthly cash flow over total interest often end up paying for a minor cosmetic renovation long after the paint has faded and fixtures have worn out.",""),
("Our verdict on selecting unsecured installment loans over secured equity products would flip if private equity lenders eliminated upfront closing costs while home values dropped sharply, eroding equity cushions. Additionally, if unsecured personal loan rates spiked far above current ranges while equity loan rates dropped, the interest rate differential could outweigh the risk of pledging your residence as collateral.","Our preference for unsecured loans when income is uncertain would flip if a secured loan carried no closing costs and a rate far below your unsecured offers, and you held ample equity and steady income."),
]: d=R(d,o,n)
save(s,d)
print('ok')
