"""Reference implementation used to define/verify A1 (salary) and A2 (paycheck) calculator math. Sources: IRS Rev. Proc. 2025-32 (2026 brackets, std deduction), IRS Topic 751 + SSA wage base $184,500 (IRS Topic 751), IRS Topic 560."""
import json
STD={"single":16100,"mfj":32200,"hoh":24150}
TOPS={"single":[12400,50400,105700,201775,256225,640600],"mfj":[24800,100800,211400,403550,512450,768700],"hoh":[17700,67450,105700,201750,256200,640600]}
RATES=[.10,.12,.22,.24,.32,.35,.37]
SS_RATE,SS_BASE,MED,ADDL,ADDL_THRESH=0.062,184500,0.0145,0.009,200000
def fed(taxable,st):
    t=0;lo=0
    for r,top in zip(RATES,TOPS[st]+[float('inf')]):
        if taxable>lo: t+=(min(taxable,top)-lo)*r
        lo=top
    return t
def paycheck(gross,st,pretax_retirement=0,periods=26):
    taxable=max(0,gross-pretax_retirement-STD[st])
    f=fed(taxable,st); ss=min(gross,SS_BASE)*SS_RATE; med=gross*MED+max(0,gross-ADDL_THRESH)*ADDL
    net=gross-pretax_retirement-f-ss-med
    return dict(gross=gross,status=st,pretax=pretax_retirement,federal=round(f,2),ss=round(ss,2),medicare=round(med,2),net_annual=round(net,2),net_per_period=round(net/periods,2),periods=periods)
def salary(annual,hours_week=40,weeks=52):
    h=annual/(hours_week*weeks)
    return dict(annual=annual,hourly=round(h,4),monthly=round(annual/12,2),biweekly=round(annual/26,2),weekly=round(annual/weeks,2),daily=round(h*hours_week/5,2))
cases=[paycheck(60000,"single"),paycheck(60000,"mfj"),paycheck(100000,"single",pretax_retirement=10000),paycheck(250000,"single"),paycheck(0,"single"),paycheck(16100,"single"),paycheck(184500,"hoh")]
# boundary / counterexample: gross exactly at single std deduction -> zero federal tax; SS cap binds above 184,500
assert cases[5]["federal"]==0 and paycheck(300000,"single")["ss"]==round(184500*.062,2)
# hand check: 60000 single: taxable 43900 -> 1240+ (43900-12400)*.12=1240+3780=5020
assert cases[0]["federal"]==5020.0
sal=[salary(52000),salary(75000,37.5,52),salary(104000,40,52)]
assert salary(52000)["hourly"]==25.0
json.dump({"paycheck":cases,"salary":sal},open("reports/mindmap-pass/2026-11-15-keyword-gap-run/research/paycheck-reference-output.json","w"),indent=1)
print(json.dumps(cases[0]),json.dumps(sal[0]))
