#!/usr/bin/env python3
"""A1 model: independent Python implementation of src/lib/debt-payoff.ts used to produce the worked example
and to cross-check the TypeScript engine (scripts/test-debt-payoff.mjs replays these fixtures)."""
import json, os
HERE=os.path.dirname(os.path.abspath(__file__))
EPS=0.005; MAXM=600
def sim(strategy,debts,extra,lump):
    n=len(debts); bal=[d['balance'] for d in debts]
    if strategy=='avalanche': order=sorted(range(n),key=lambda i:(-debts[i]['apr'],debts[i]['balance'],i))
    elif strategy=='snowball': order=sorted(range(n),key=lambda i:(debts[i]['balance'],-debts[i]['apr'],i))
    else: order=list(range(n))
    mins=sum(d['min'] for d in debts)
    ex=0 if strategy=='minimums' else extra; lp=0 if strategy=='minimums' else lump
    pm=[None]*n; po=[]; interest=0.0; paid=0.0; m=0
    while m<MAXM and any(b>EPS for b in bal):
        m+=1
        for i in range(n):
            if bal[i]>EPS:
                it=bal[i]*debts[i]['apr']/100/12; bal[i]+=it; interest+=it
        budget=0 if strategy=='minimums' else mins+ex+(lp if m==1 else 0)
        for i in range(n):
            if bal[i]>EPS:
                p=min(debts[i]['min'],bal[i]); bal[i]-=p; paid+=p
                if strategy!='minimums': budget-=p
        if strategy!='minimums':
            for i in order:
                if budget<=EPS: break
                if bal[i]>EPS:
                    p=min(budget,bal[i]); bal[i]-=p; paid+=p; budget-=p
        for i in order:
            if bal[i]<=EPS and pm[i] is None:
                bal[i]=0; pm[i]=m; po.append(i)
    nc=any(b>EPS for b in bal)
    return {'months':None if nc else m,'interest':None if nc else round(interest,2),'paid':None if nc else round(paid,2),'order':po,'payoffMonth':pm}
EXAMPLE=[{'name':'Store card','balance':2500,'apr':19.99,'min':75},
         {'name':'Credit card','balance':6000,'apr':27.99,'min':160},
         {'name':'Personal loan','balance':11000,'apr':11.0,'min':280}]
EXTRA=200
out={'example':{'debts':EXAMPLE,'extraMonthly':EXTRA,'lumpSum':0,'totalBalance':sum(d['balance'] for d in EXAMPLE),'totalMinimums':sum(d['min'] for d in EXAMPLE)}}
for s in ['avalanche','snowball','minimums']: out['example'][s]=sim(s,EXAMPLE,EXTRA,0)
a,sn,mi=out['example']['avalanche'],out['example']['snowball'],out['example']['minimums']
out['example']['gap']={'snowballExtraInterest':round(sn['interest']-a['interest'],2),'monthsDifference':sn['months']-a['months'],
 'avalancheSavesVsMinimums':round(mi['interest']-a['interest'],2),'monthsSavedVsMinimums':mi['months']-a['months']}
# lump sum variant: same debts, $2,000 lump sum
out['lumpSumVariant']={'lumpSum':2000,**{s:sim(s,EXAMPLE,EXTRA,2000) for s in ['avalanche','snowball']}}
# counterexample: equal APRs -> same interest
EQ=[{'balance':3000,'apr':18,'min':90},{'balance':7000,'apr':18,'min':180}]
out['counterexampleEqualRates']={'debts':EQ,'extraMonthly':150,'avalanche':sim('avalanche',EQ,150,0),'snowball':sim('snowball',EQ,150,0)}
# counterexample 2: the smallest debt also has the highest APR -> same order
SM=[{'balance':1500,'apr':26,'min':50},{'balance':9000,'apr':9,'min':200}]
out['counterexampleSmallestIsHighest']={'debts':SM,'extraMonthly':100,'avalanche':sim('avalanche',SM,100,0),'snowball':sim('snowball',SM,100,0)}
# edge: minimum below interest under minimums-only
BAD=[{'balance':5000,'apr':30,'min':100}]
out['minimumBelowInterest']={'debts':BAD,'minimums':sim('minimums',BAD,0,0),'avalancheWith150Extra':sim('avalanche',BAD,150,0)}
json.dump(out,open(os.path.join(HERE,'output.json'),'w'),indent=1)
print(json.dumps(out,indent=1))
