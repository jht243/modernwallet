#!/usr/bin/env python3
"""A5 model: replicates src/lib/retirement.ts projectRetirement() accumulation (annual compounding, 12 x monthly
contribution added at year end) for the scenarios on /retirement/401k-calculator/."""
import json, os
HERE=os.path.dirname(os.path.abspath(__file__))
INFL=0.03
def bal(start,monthly,rate,years_total,years_contrib):
    b=start
    for y in range(years_total):
        b*=1+rate
        if y<years_contrib: b+=monthly*12*(1+0) if False else 0
    # exact engine form: FV(savings) + annual*((1+r)^n-1)/r for years_contrib deposits, then grown for the remaining years
    fv_s=start*(1+rate)**years_total
    a=monthly*12
    fv_c=a*((1+rate)**years_contrib-1)/rate*(1+rate)**(years_total-years_contrib)
    return fv_s+fv_c
def todays(b,years): return b/(1+INFL)**years
S,M,R_,N=20000,800,0.07,35
out={'assumptions':{'startAge':30,'retireAge':65,'start':S,'monthly':M,'returnPct':7,'inflationPct':3,'engine':'annual compounding, annual deposits of 12 x monthly at year end (src/lib/retirement.ts)'}}
base=bal(S,M,R_,N,N)
assert abs(base-1540606)<1,base
out['base']={'nominal':round(base),'todays':round(todays(base,N)),'contributions':M*12*N}
stops=[]
for stopAge in [35,40,45,50,55,60,65]:
    yc=stopAge-30
    b=bal(S,M,R_,N,yc)
    stops.append({'stopAge':stopAge,'yearsContributing':yc,'nominal':round(b),'todays':round(todays(b,N)),'pctOfBase':round(100*b/base,1),'totalContributed':M*12*yc})
out['stopContributing']=stops
# balance frozen with zero contributions from day one
out['neverContribute']={'nominal':round(S*(1+R_)**N),'todays':round(todays(S*(1+R_)**N,N))}
# value of each extra year of contributions near the end vs the start
out['marginalYear']={'dropLastYear':round(base-bal(S,M,R_,N,N-1)),'dropFirstYearEquivalent':'see stopContributing table'}
# no match: assume $300 of the $800 is employer match (hypothetical split)
nm=bal(S,500,R_,N,N)
out['noMatch']={'assumedEmployeeMonthly':500,'assumedMatchMonthly':300,'nominal':round(nm),'todays':round(todays(nm,N)),'gapVsBase':round(base-nm),'pctOfBase':round(100*nm/base,1)}
# inflation sensitivity for base
out['inflationSensitivity']={str(p):round(base/(1+p/100)**N) for p in [2,3,4]}
# break-even: years of contributions needed to still reach $1,000,000 nominal at 65
for yc in range(0,36):
    if bal(S,M,R_,N,yc)>=1_000_000:
        out['yearsOfContributionsToReach1M']={'years':yc,'stopAge':30+yc,'balance':round(bal(S,M,R_,N,yc))};break
# counterexample: with a 0% return stopping contributions loses exactly the skipped deposits
out['counterexample']={'returnPct':0,'note':'at 0% return, stopping at 45 leaves S + 12*M*15 = '+str(S+M*12*15)+' versus base '+str(S+M*12*35)}
json.dump(out,open(os.path.join(HERE,'output.json'),'w'),indent=1)
print(json.dumps(out,indent=1))
