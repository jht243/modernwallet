import json, math
from pathlib import Path
R=Path(__file__).resolve().parent
fpl=[15960,21640,27320,33000,38680,44360,50040,55720]
bands=[(100,133,2.15,2.15),(133,150,3.23,4.30),(150,200,4.30,6.78),(200,250,6.78,8.66),(250,300,8.66,10.22),(300,400,10.22,10.22)]
def aca(n,income,benchmark,plan):
 ratio=income/fpl[n-1]*100
 if ratio<100 or ratio>400:return {'fplPercent':ratio,'credit':0,'status':'Outside modeled income range; eligibility/special cases not assessed'}
 band=next(b for b in bands if b[0]<=ratio<b[1] or ratio==400 and b[1]==400)
 pct=band[2]+(ratio-band[0])/(band[1]-band[0])*(band[3]-band[2]);contrib=income*pct/100/12
 credit=min(plan,max(0,benchmark-contrib))
 return {'fplPercent':ratio,'applicablePercent':pct,'expectedMonthlyContribution':contrib,'credit':credit,'selectedPlanNetPremium':plan-credit,'basis':'Conditional federal arithmetic; other eligibility assumed'}
def snap(n,earned,unearned,dependent,child_support,medical,elderly,shelter):
 std=[217,217,217,229,268,308,308,308][n-1];maximum=[306,562,808,1023,1217,1463,1616,1841][n-1]
 adjusted=max(0,earned+unearned-0.2*earned-std-dependent-child_support-(max(0,medical-35) if elderly else 0))
 deduction=max(0,shelter-adjusted/2);deduction=deduction if elderly else min(769,deduction);net=max(0,adjusted-deduction)
 raw=max(0,maximum-math.ceil(net*0.3));conditional=max(25,raw) if n<=2 else raw
 return {'standardDeduction':std,'incomeAfterOtherDeductions':adjusted,'shelterDeduction':deduction,'netIncome':net,'roundedContribution':math.ceil(net*0.3),'formulaAmount':raw,'conditionalEligibleFullMonthAmount':conditional,'eligibility':'not determined','scope':'FY2027; 48 contiguous states/DC; first-month proration and state supplements excluded'}
result={'purpose':'Internal preparation feasibility calculations, not published content or a product test','aca':{'ordinary':aca(2,50000,600,550),'at400Percent':aca(2,86560,1000,1000),'oneDollarAbove400Percent':aca(2,86561,1000,1000),'selectedPremiumCap':aca(2,30000,900,100)},'snap':{'ordinary':snap(4,2000,0,0,0,0,False,1200),'higherAllowedShelter':snap(4,2000,0,0,0,0,False,1400),'zeroIncome':snap(1,0,0,0,0,0,False,0),'highIncomeConditionalOnly':snap(1,10000,0,0,0,0,False,0)}}
(R/'preparation-calculations.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
