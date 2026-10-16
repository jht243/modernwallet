import json,re
R='reports/mindmap-pass/2026-10-16-trend-lane-c/drafts/401k-vs-529.json'
d=json.load(open(R))
miss=[]
def rep(get,set_,old,new):
    t=get()
    if old not in t: miss.append(old[:70]); return
    set_(t.replace(old,new,1))
def F(key):
    return (lambda:d[key]),(lambda v:d.__setitem__(key,v))
def S(i):
    return (lambda:d['sections'][i]['content']),(lambda v:d['sections'][i].__setitem__('content',v))
def T(i,c):
    return (lambda:d['comparisonTable']['rows'][i][c]),(lambda v:d['comparisonTable']['rows'][i].__setitem__(c,v))
def Q(i):
    return (lambda:d['faqItems'][i]['answer']),(lambda v:d['faqItems'][i].__setitem__('answer',v))
def A(f,old,new): rep(*f,old,new)
# intro
A(F('introText'),"A 401(k) and a 529 plan do different jobs: the 401(k) is for your own retirement and the 529 is for a student's education costs, so they are not interchangeable and money in one cannot simply be moved to the other.","A 401(k) is for your own retirement, and a 529 plan is for a student's education costs. They are not interchangeable, and money in one cannot simply be moved to the other.")
A(F('introText'),"Which account gets your next dollar depends on which goal arrives first, how the tax treatment fits your household income, and what access you need before retirement age.","Which account gets the next dollar depends on which goal is closer, how the tax treatment fits, and what access you will need.")
A(F('introText'),"Every dollar placed into a 529 plan must follow rules governing qualified educational expenses, while money in a workplace retirement plan remains bound by federal retirement distribution age thresholds.","A 529 plan has its own limits on what a withdrawal can pay for, and a 401(k) withdrawal before age 59½ can trigger a 10% additional tax.")
d['metaDescription']="401(k) vs 529 compared on 2026 contribution limits, tax treatment, what happens when the money is used for the wrong thing, and the 529 to Roth IRA rollover rules."
d['subtitle']="A direct comparison of contribution limits, tax treatment, withdrawal rules, and the 529 to Roth IRA rollover."
d['h1']="401(k) vs 529 Plan: Retirement and Education Accounts Compared"
# table
d['comparisonTable']['rows'][1]['a']="Offered through an employer's plan, which lets employees contribute a portion of their wages to individual accounts"
d['comparisonTable']['rows'][1]['b']="A state or state agency; eligible educational institutions can run prepaid-tuition versions"
d['comparisonTable']['rows'][2]['a']="Elective deferrals are generally pretax and are not reported as wages in box 1 of Form W-2, but they are still subject to Social Security and Medicare taxes; designated Roth deferrals are made after tax"
d['comparisonTable']['rows'][4]['a']="Traditional 401(k) distributions, including earnings, are includible in taxable income; qualified distributions from designated Roth accounts are tax free"
d['comparisonTable']['rows'][4]['b']="Distributions are not taxable at the federal level when used for qualified education expenses"
d['comparisonTable']['rows'][5]['b']="A portion of the earnings is taxable when the distribution is greater than the beneficiary's qualified higher education expenses; other taxes may apply (see IRS Publication 970)"
d['comparisonTable']['rows'][6]['b']="The IRS limits contributions on behalf of a beneficiary to the amount needed for the beneficiary's qualified education expenses; the program's administrator sets the plan's contribution limit"
a=d['comparisonTable']['rows'][6]['a']; a2=re.sub(r",? ?subject to individual plan caps","; catch-up applies if the plan permits it, and the plan's terms may set a lower limit",a); 
if a2==a: miss.append('row6a'); 
d['comparisonTable']['rows'][6]['a']=a2
# section 0
A(S(0),"Choosing between them requires understanding that the accounts address entirely different phases of life. The 401(k) builds personal capital intended to sustain your household once wage income ceases. ","The next dollar goes to whichever goal is closer, and a 529 plan has its own limits on what a withdrawal can pay for. ")
A(S(0),"By contrast, a 529 plan finances schooling for a designated beneficiary without exposing investment growth to federal income taxes.","By contrast, a 529 plan lets a contributor prepay a beneficiary's qualified higher education expenses or contribute to an account for paying them, and earnings grow tax free while in the account.")
A(S(0),"Some employers also contribute matching or profit-sharing funds directly to the worker's balance.","Employers can also contribute to employees' accounts.")
A(S(0),"To evaluate the distinctions between pretax and post-tax contributions inside workplace plans, review our analysis of [Roth 401(k) vs Traditional 401(k)](/compare/roth-401k-vs-traditional-401k/) before adjusting your payroll elections.","[Roth 401(k) vs Traditional 401(k)](/compare/roth-401k-vs-traditional-401k/) compares pretax and designated Roth contributions inside a workplace plan.")
A(S(0),"under Internal Revenue Service (IRS) guidelines","under rules from the [Internal Revenue Service (IRS)](https://www.irs.gov/retirement-plans/401k-plans)")
s=d['sections'][0]['content']
m=re.search(r"\s*Every state plus the District of Columbia sponsors at least one program option\. While colleges can operate prepaid tuition arrangements, state agencies maintain education savings plans\.",s)
if m: d['sections'][0]['content']=s.replace(m.group(0)," There are two types, prepaid tuition plans and education savings plans, and every state plus the District of Columbia sponsors at least one type. Eligible educational institutions can also run prepaid-tuition versions.",1)
else: miss.append('s0 every state')
A(S(0)," These plans exist strictly to collect prepayments or accumulate savings toward eligible educational costs.","")
# section 1
A(S(1),"Federal tax rules treat incoming deposits and account earnings differently across both accounts.","A traditional 401(k) excludes contributions from taxable income, while a 529 plan gives no federal deduction but lets earnings grow tax free.")
A(S(1),"excluded from gross taxable income in the contribution year","excluded from the employee's taxable income")
A(S(1),"Designated Roth elective deferrals do not reduce current taxable wages.","Designated Roth deferrals are made after tax.")
A(S(1),"including all investment earnings","including earnings")
A(S(1),"are never deductible","are not deductible")
A(S(1),"Contributions made to a 529","Contributions to a 529")
A(S(1),"Certain states provide a state income tax deduction or credit for residents who contribute to their home state's plan. State tax treatment varies by state.","Some states offer a state tax benefit, and state tax treatment varies by state.")
A(S(1)," This structure mirrors post-tax growth models found in other personal savings vehicles.","")
A(S(1),"To compare how non-retirement accounts operate alongside tuition plans, read our breakdown of a [529 vs Brokerage Account](/compare/529-vs-brokerage-account/) for long-term family investing.","[529 vs Brokerage Account](/compare/529-vs-brokerage-account/) compares a 529 plan with a non-retirement investing account.")
# section 2
A(S(2),"A 529 plan restricts tax-free distributions to qualified higher education expenses, whereas retirement plans permit penalty-free access for any spending category once you attain retirement age.","A 529 plan's tax-free distributions go toward qualified education expenses, which include higher education costs and, up to a limit, kindergarten through grade 12 costs.")
A(S(2),"Under federal rules, qualified higher education expenses include tuition, mandatory fees, books, supplies, and equipment required for attendance at an eligible college, university, or vocational school. The educational institution must be eligible to participate in federal student aid programs for the expenses to qualify.","Qualified higher education expenses generally include expenses required for enrollment or attendance at a college, university, vocational school or other postsecondary school eligible for federal student aid programs.")
A(S(2),"Qualified uses also extend to elementary and secondary school expenses, but these distributions carry specific dollar limitations. ","")
A(S(2),"This threshold increased from $10,000 before December 31, 2025.","The limit was $10,000 before December 31, 2025.")
A(S(2),"academic testing fees","certain test fees")
A(S(2),"curriculum materials, books, outside tutoring","curriculum and curricular materials, books and other instructional materials, outside tutoring and classes")
A(S(2),"For a detailed reference on eligible items, examine our guide to [529 Qualified Expenses](/guides/529-qualified-expenses/) before scheduling school withdrawals.","Eligible items are listed in [529 Qualified Expenses](/guides/529-qualified-expenses/).")
A(S(2),"A plan holder can withdraw up to a $10,000 lifetime limit per individual to pay principal or interest on qualified education loans for the beneficiary or the beneficiary's sibling.","Up to $10,000 per individual over a lifetime can be withdrawn to pay principal or interest on a student loan of the designated beneficiary or their sibling.")
# section 3
A(S(3),"Withdrawing money from either account for unauthorized purposes triggers taxes.","Using money for the wrong purpose has different tax consequences in each account.")
A(S(3),"ordinary income tax on the taxable portion","income tax on the taxable portion")
s=d['sections'][3]['content']
m=re.search(r"Exceptions for qualified retirement plans include[^\n]*?age 55\.",s)
if m: d['sections'][3]['content']=s.replace(m.group(0),"Exceptions for distributions from a qualified plan other than an IRA include total and permanent disability and terminal illness. Others cover a series of substantially equal periodic payments over life expectancy, payment to a beneficiary or estate after death, and distributions after separating from service at or after age 55. This is not a complete list, so check [IRS Topic 558](https://www.irs.gov/taxtopics/tc558).",1)
else: miss.append('exceptions')
s=d['sections'][3]['content']
m=re.search(r"Taking money from a 529 plan for non-qualified expenses.*?\[IRS Publication 970\]\(https://www\.irs\.gov/publications/p970\)\.",s,re.S)
if m: d['sections'][3]['content']=s.replace(m.group(0),"A 529 distribution is reported on Form 1099-Q, which splits the gross distribution into earnings and basis (return of investment). If a distribution is greater than the beneficiary's qualified higher education expenses, a portion of the earnings is taxable, and other taxes may apply; see [IRS Publication 970](https://www.irs.gov/publications/p970).",1)
else: miss.append('529 para')
s=d['sections'][3]['content']
m=re.search(r"Savers frequently ask.*?10% additional tax on taxable amounts\.",s,re.S)
if m: d['sections'][3]['content']=s.replace(m.group(0),"The IRS pages linked here describe no way to move money directly from a 401(k) into a 529 plan. Pulling money out of a 401(k) before age 59½ can trigger income tax on the taxable portion plus the 10% additional tax, and the plan's own rules govern what it allows; the [IRS 401(k) plans page](https://www.irs.gov/retirement-plans/401k-plans) summarizes how these plans work.",1)
else: miss.append('savers')
A(S(3),"If you hold unspent tuition funds instead, evaluate your choices through our guide on [529 Leftover Money Options](/guides/529-leftover-money-options/) to avoid non-qualified distributions.","Options for unspent 529 money are covered in [529 Leftover Money Options](/guides/529-leftover-money-options/).")
# section 4
d['sections'][4]['heading']="Rolling Unused 529 Money Into a Roth IRA"
s=d['sections'][4]['content']
m=re.search(r"Recent updates to federal tax rules.*?between the institutions\.",s,re.S)
if m: d['sections'][4]['content']=s.replace(m.group(0),"For distributions made after December 31, 2023, the beneficiary of a 529 plan may roll money into their own Roth IRA. To be tax free, the rollover must be a direct trustee-to-trustee transfer.",1)
else: miss.append('rollover intro')
s=d['sections'][4]['content']
m=re.search(r"Several strict timing restrictions.*?distribution date\.",s,re.S)
if m: d['sections'][4]['content']=s.replace(m.group(0),"The 529 account must have been open at least 15 years. The rollover also cannot exceed the amount contributed to the 529 (and its earnings) before the 5-year period ending on the date of the distribution.",1)
else: miss.append('timing')
s=d['sections'][4]['content']
m=re.search(r"To see how post-tax education balances.*?\[401\(k\) vs Roth IRA\]\(/compare/401k-vs-roth-ira/\)\.",s,re.S)
if m: d['sections'][4]['content']=s.replace(m.group(0),"[529 vs Roth IRA](/compare/529-vs-roth-ira/) and [401(k) vs Roth IRA](/compare/401k-vs-roth-ira/) compare those accounts directly.",1)
else: miss.append('vs roth')
s=d['sections'][4]['content']
m=re.search(r"Traditional 401\(k\) plans offer no comparable flexibility.*?contribution limits\.",s,re.S)
if m: d['sections'][4]['content']=s.replace(m.group(0),"Use the [529 Savings Calculator](/529-savings-calculator/) to run your own 529 numbers.",1)
else: miss.append('no comparable')
# section 5
d['sections'][5]['heading']="What Each Account Limits"
A(S(5),"The federal government and state plan trustees impose distinct caps on how much money you can deposit each year.","A 401(k) has a published 2026 dollar limit on employee deferrals, while a 529 plan's contribution limit comes from the IRS rule and the program.")
A(S(5),"Read our complete guide to [401(k) Contribution Limits 2026](/guides/401k-contribution-limits-2026/) to track these adjustments across your benefits package.","More on the limits is in [401(k) Contribution Limits 2026](/guides/401k-contribution-limits-2026/).")
A(S(5),"bringing their total elective deferral capacity to $32,500","so they can generally contribute up to $32,500")
A(S(5),"resulting in a maximum contribution of $35,750 for 2026","which is generally $35,750 for 2026 if the plan permits catch-up contributions")
s=d['sections'][5]['content']
m=re.search(r"A 529 plan operates under entirely different.*?adjusted gross income\.",s,re.S)
if m: d['sections'][5]['content']=s.replace(m.group(0),"The IRS limits 529 contributions on behalf of a beneficiary to the amount needed for the beneficiary's qualified education expenses, and each program's administrator sets the plan's contribution limit. There are no income restrictions on individual contributors ([IRS Publication 970](https://www.irs.gov/publications/p970)).",1)
else: miss.append('529 contrib')
# section 6
d['sections'][6]['heading']="Checking Plan Limits Before You Choose"
d['sections'][6]['content']="Which goal is closer, what your 401(k) plan's terms allow, and your 529 program's contribution limit set the answer. The plan documents state the plan's terms and the program's limit, and [IRS Topic 313](https://www.irs.gov/taxtopics/tc313) summarizes the 529 rules. [Is a 529 Plan Worth It?](/guides/is-a-529-plan-worth-it/) covers whether a 529 suits a particular family."
d['verdict']="A 401(k) fits you if your nearest goal is retirement income and you want contributions excluded from taxable income. A 529 plan fits you if you are paying a specific student's qualified education costs, including up to $20,000 a year of kindergarten through grade 12 expenses. Neither fits money you may need for other purposes: a 401(k) withdrawal before age 59½ can trigger income tax plus a 10% additional tax, and 529 earnings withdrawn beyond qualified expenses are partly taxable. Which goal is closer, what your 401(k) plan's terms allow, and your 529 program's contribution limit would change the answer."
d['faqItems'][0]['answer']="It depends on which goal is closer. A 401(k) is for your own retirement, with a 2026 employee deferral limit of $24,500, and a 529 plan is for a student's qualified education expenses. A 401(k) withdrawal before age 59½ can trigger a 10% additional tax, and a 529 withdrawal beyond qualified expenses makes a portion of the earnings taxable."
d['faqItems'][1]['answer']="The IRS pages linked on this page describe no way to roll a 401(k) directly into a 529 plan. Pulling money from a 401(k) before age 59½ can trigger income tax on the taxable portion plus a 10% additional tax unless an exception applies; see [IRS Topic 558](https://www.irs.gov/taxtopics/tc558)."
A(Q(2),"total disability","total and permanent disability")
d['faqItems'][2]['answer']=d['faqItems'][2]['answer'].rstrip()+" The exceptions listed here are not a complete list; see [IRS Topic 558](https://www.irs.gov/taxtopics/tc558)."
d['faqItems'][3]['answer']="If the beneficiary does not attend college, a 529 plan can still pay up to $20,000 a year of qualified kindergarten through grade 12 expenses and up to $10,000 over a lifetime toward a student loan of the beneficiary or their sibling. After the account has been open at least 15 years, the beneficiary may roll money into their own Roth IRA, up to a $35,000 lifetime limit and the annual Roth IRA contribution limit."
d['faqItems'][4]['answer']="Yes. A 529 plan can cover qualified elementary and secondary school expenses up to $20,000 a year, and expenses for registered apprenticeship programs and certain postsecondary credentialing programs. It can also pay up to $10,000 over a lifetime toward principal or interest on a student loan of the beneficiary or their sibling."
json.dump(d,open(R,'w'),indent=2,ensure_ascii=False)
print('MISSED:',miss)
