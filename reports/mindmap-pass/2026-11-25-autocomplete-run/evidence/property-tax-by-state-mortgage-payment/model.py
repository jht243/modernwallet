#!/usr/bin/env python3
"""A4 model: monthly property tax on a $400,000 home = effective rate x price / 12, per state.
Input: Tax Foundation Table 2 (ACS 2024 1-year? see source) saved verbatim in research/sources."""
import json, re, hashlib, os, sys
HERE=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(HERE,'..','..','research','sources','tax-foundation-property-taxes-by-state.txt')
PRICE=400000
txt=open(SRC,encoding='utf-8').read()
start=txt.rfind('Table 2. Property Taxes by State')
# the state table sits between the LAST-but-one occurrence header and its Note line
blocks=[m.start() for m in re.finditer(r'Table 2\. Property Taxes by State',txt)]
sec=txt[blocks[0]:]
end=sec.find('Note: The figures in this table')
sec=sec[:end]
rows=[]
for ln in sec.splitlines():
    m=re.match(r'^([A-Za-z\. ]+?) (\d\.\d\d)% (\d\.\d\d)% (\d+)$',ln.strip())
    if m:
        rows.append({'state':m.group(1),'rate2024':float(m.group(2)),'rate2023':float(m.group(3)),'rank':int(m.group(4))})
dc=[r for r in rows if r['state']=='District of Columbia']
states=[r for r in rows if r['state']!='District of Columbia']
assert len(states)==50,len(states)
for r in rows:
    r['monthlyOn400k']=round(PRICE*r['rate2024']/100/12,2)
    r['monthlyOn400kRounded']=int(round(r['monthlyOn400k']))
states.sort(key=lambda r:(r['rank'],r['state']))
out={'priceUsd':PRICE,'formula':'monthly = effective_rate_pct/100 * 400000 / 12','states':states,'districtOfColumbia':dc,
 'max':max(states,key=lambda r:r['monthlyOn400k'])['monthlyOn400k'],'min':min(states,key=lambda r:r['monthlyOn400k'])['monthlyOn400k'],
 'median_state_monthly':sorted(r['monthlyOn400k'] for r in states)[24:26],
 'counterexample':{'note':'NJ county rates in the same source run 0.93% (Cape May) to 2.47% (Camden), so a Camden County home at $400,000 owes about $823/month, above the state-average $627','camdenMonthly':round(PRICE*2.47/100/12,2),'capeMayMonthly':round(PRICE*0.93/100/12,2)}}
json.dump(out,open(os.path.join(HERE,'output.json'),'w'),indent=1)
print(len(states),out['max'],out['min'])
