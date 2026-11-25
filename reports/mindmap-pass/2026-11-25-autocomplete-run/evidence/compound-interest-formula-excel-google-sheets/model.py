#!/usr/bin/env python3
"""A3 model: verify every spreadsheet formula output shown on the page.
Excel/Sheets FV(rate,nper,pmt,[pv],[type]) = -(pv*(1+r)^n + pmt*(1+r*type)*((1+r)^n-1)/r)  (r != 0).
Cash paid out is negative, so deposits and the starting balance are entered as negatives to get a positive result."""
import json, os
HERE=os.path.dirname(os.path.abspath(__file__))
def fv(rate,nper,pmt,pv=0,typ=0):
    if rate==0: return -(pv+pmt*nper)
    g=(1+rate)**nper
    return -(pv*g+pmt*(1+rate*typ)*(g-1)/rate)
def lump(P,r,n,t): return P*(1+r/n)**(n*t)
out={}
P,r,t=10000,0.05,10
out['lumpSum']={'P':P,'r':r,'years':t,'byFrequency':{k:round(lump(P,r,n,t),2) for k,n in [('yearly',1),('quarterly',4),('monthly',12),('daily',365)]}}
out['lumpSum']['fvEquivalentMonthly']=round(fv(r/12,12*t,0,-P),2)
out['lumpSum']['continuousForComparison']=round(P*2.718281828459045**(r*t),2)
# monthly deposits, same frequency (n=12) condition
dep=200
out['deposits']={'P':P,'r':r,'years':t,'monthlyDeposit':dep,
 'fvMonthlyEnd':round(fv(r/12,12*t,-dep,-P),2),
 'fvMonthlyBegin':round(fv(r/12,12*t,-dep,-P,1),2),
 'depositsOnly':round(fv(r/12,12*t,-dep),2),
 'totalContributed':P+dep*12*t}
out['deposits']['interestEarned']=round(out['deposits']['fvMonthlyEnd']-out['deposits']['totalContributed'],2)
# manual month-by-month check
b=P
for m in range(12*t): b=b*(1+r/12)+dep
out['deposits']['monthByMonthEnd']=round(b,2)
assert abs(b-out['deposits']['fvMonthlyEnd'])<0.01
# the mismatch mistake: annual rate with monthly periods
out['mistakes']={
 'annualRateWithMonthlyPeriods':round(fv(r,12*t,-dep,-P),2),
 'correct':out['deposits']['fvMonthlyEnd'],
 'signError':round(fv(r/12,12*t,dep,P),2),
 'ratePerPeriodMissing':'rate must be annual rate divided by n when nper counts the same n periods per year'}
# Microsoft documented example
out['microsoftExample']={'formula':'=FV(0.06/12,10,-200,-500,1)','result':round(fv(0.06/12,10,-200,-500,1),2),'documented':2581.40}
assert abs(out['microsoftExample']['result']-2581.40)<0.005
# yearly deposits with yearly compounding (same frequency)
out['yearlyDeposits']={'formula':'=FV(5%,10,-2400,-10000)','result':round(fv(0.05,10,-2400,-10000),2)}
# mixed frequency: monthly deposits but daily compounding => no exact single FV; show approximation using effective monthly rate
eff_m=(1+r/365)**(365/12)-1
out['mixedFrequency']={'effectiveMonthlyRate':round(eff_m,8),'fvUsingEffectiveMonthlyRate':round(fv(eff_m,12*t,-dep,-P),2),'fvNaiveMonthlyRate':out['deposits']['fvMonthlyEnd'],'note':'when deposit and compounding frequencies differ, convert to an effective rate per deposit period: (1+r/n)^(n/m)-1'}
# APY
out['apy']={'monthly':round((1+r/12)**12-1,6),'daily':round((1+r/365)**365-1,6)}
json.dump(out,open(os.path.join(HERE,'output.json'),'w'),indent=1)
print(json.dumps(out,indent=1))
