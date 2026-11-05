import json,math,sys
from pathlib import Path
x=json.loads(Path(sys.argv[1]).read_text())
def aca(n,inc,b,p):
 f=inc/x["fpl"][n-1]*100
 if f<100 or f>400:return {"fplPercent":f,"credit":0,"otherEligibility":"not determined"}
 lo,hi,a,z=next(v for v in x["bands"] if v[0]<=f<v[1] or f==400 and v[1]==400)
 rate=a+(f-lo)/(hi-lo)*(z-a);c=inc*rate/100/12;credit=min(p,max(0,b-c))
 return {"fplPercent":f,"applicablePercent":rate,"contribution":c,"credit":credit,"netPremium":p-credit,"otherEligibility":"assumed for arithmetic"}
def snap(n,e,u,sh):
 a=max(0,e+u-.2*e-x["standard"][n-1]);d=min(x["shelterCap"],max(0,sh-a/2));net=max(0,a-d);c=math.ceil(net*.3)
 return {"adjustedIncome":a,"shelterDeduction":d,"netIncome":net,"contribution":c,"formulaBenefit":max(0,x["maximum"][n-1]-c),"eligibility":"not determined"}
o={"aca":{k:aca(*v) for k,v in x["acaScenarios"].items()},"snap":{k:snap(*v) for k,v in x["snapScenarios"].items()}}
Path(sys.argv[2]).write_text(json.dumps(o,indent=2)+"\n")
