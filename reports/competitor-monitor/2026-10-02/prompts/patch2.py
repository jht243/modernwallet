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
("Our verdict on payday loans would change only if a borrower faced an immediate, catastrophic fee exceeding 400% with no other liquidity source, and possessed guaranteed, unencumbered funds arriving on payday to eliminate the entire principal in full on day 14.","Our verdict would change only if a borrower had no cheaper source of cash and was certain to repay the full $460 on day 14, in which case the $60 dollar fee, not the APR, is the number to weigh."),
("The lender will attempt to cash your postdated check or electronically debit your bank account, which can trigger overdraft fees if your balance is insufficient. If the balance remains unpaid, the lender may offer a costly rollover, send the account to a third-party collections agency, or file a civil lawsuit.","In some states the lender may offer a rollover, where you pay only the fee and the due date is extended, but the fee repeats and the principal stays the same. Ask the lender about a payment plan before the due date, and read the loan contract for what happens if you miss it."),
("No, payday loans are not legal in every state. Several states ban payday lending outright or enforce strict interest rate caps that prevent lenders from operating high-cost storefronts, so check with your state financial regulator to see your local laws.","No. State law sets whether payday lending is allowed and how much it may cost, so check your state financial regulator to see your local rules."),
]: d=R(d,o,n)
for sec in d['sections']:
    if sec['heading']=='Audience Fit and Verdict Criteria': sec['heading']='Who Should Skip a Payday Loan'
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
