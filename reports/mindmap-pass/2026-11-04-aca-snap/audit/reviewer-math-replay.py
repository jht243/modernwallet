import json,random
from decimal import Decimal as D,ROUND_CEILING
from pathlib import Path
rng=random.Random(11042026); cases=[]
mx=[306,562,808,1023,1217,1463,1616,1841];sd=[217,217,217,229,268,308,308,308];nr=[1330,1804,2277,2750,3224,3697,4170,4644]; fpl=[15960,21640,27320,33000,38680,44360,50040,55720]
for j in range(240):
 h=j%8; earned=D(rng.randrange(0,1500000))/100;unearned=D(rng.randrange(0,200000))/100;dep=D(rng.randrange(0,50000))/100;child=D(rng.randrange(0,40000))/100;med=D(rng.randrange(0,20000))/100;rent=D(rng.randrange(0,300000))/100;util=D(rng.randrange(0,100000))/100;elder=bool(j%2);elig=['unknown','confirmed','excluded'][j%3]
 adjusted=max(D(0),earned+unearned-earned*D('.2')-sd[h]-dep-child-(max(D(0),med-35) if elder else D(0)));ded=max(D(0),rent+util-adjusted/2);ded=ded if elder else min(D(769),ded);net=max(D(0),adjusted-ded); contribution=int((net*D('.3')).to_integral_value(rounding=ROUND_CEILING));formula=max(0,mx[h]-contribution);amount=None if elig=='excluded' or (net>nr[h] and elig!='confirmed') else max(25,formula) if h<2 else formula
 cases.append({'fn':'snapBenefits','input':dict(household=h+1,earned=float(earned),unearned=float(unearned),dependentCare=float(dep),childSupport=float(child),medical=float(med),rent=float(rent),utilities=float(util),elderlyDisabled=elder,region='contiguous',eligibility=elig),'expected':dict(adjusted=float(adjusted),shelterDeduction=float(ded),net=float(net),contribution=contribution,formulaAmount=formula,conditionalAmount=amount)})
bands=[(100,133,'2.15','2.15'),(133,150,'3.23','4.30'),(150,200,'4.30','6.78'),(200,250,'6.78','8.66'),(250,300,'8.66','10.22'),(300,400,'10.22','10.22')]
for h in range(8):
 for frac in ['.9999','1','1.32999','1.33','1.5','1.75','2','2.25','2.5','2.75','3','4','4.0001']:
  income=(D(fpl[h])*D(frac)).quantize(D('.01'));p=income/D(fpl[h])*100; eligible=100<=p<=400; pct=None
  if eligible:
   b=next((b for b in bands if p<b[1]),bands[-1]);pct=D(b[2])+(D(b[3])-D(b[2]))*(p-b[0])/(b[1]-b[0])
  contrib=income*pct/1200 if pct is not None else None
  for elig in ['unknown','confirmed','excluded']:
   enrollment=D(rng.randrange(0,100000))/100; benchmark=D(rng.randrange(0,200000))/100
   credit=min(enrollment,max(D(0),benchmark-contrib)) if contrib is not None and elig=='confirmed' else None
   cases.append({'fn':'acaSubsidy','input':dict(household=h+1,income=float(income),benchmark=float(benchmark),enrollment=float(enrollment),region='contiguous',eligibility=elig),'expected':dict(inRange=eligible,percentage=float(pct) if pct is not None else None,contribution=float(contrib) if contrib is not None else None,credit=float(credit) if credit is not None else None,netPremium=float(enrollment-credit) if credit is not None else None)})
Path('reports/mindmap-pass/2026-11-04-aca-snap/audit/reviewer-independent-cases.json').write_text(json.dumps(cases,indent=2)+'\n')
print(json.dumps({'independentDecimalCases':len(cases),'seed':11042026}))
