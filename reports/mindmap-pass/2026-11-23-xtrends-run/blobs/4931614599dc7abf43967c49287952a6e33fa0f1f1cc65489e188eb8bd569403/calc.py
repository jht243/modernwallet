import json
from decimal import Decimal as D, ROUND_HALF_UP
q=lambda x: str(D(x).quantize(D("0.01"),ROUND_HALF_UP))
out={"inputs":{"hypothetical_balance":100000,"drops_pct":[10,20,30],"cc_balance":5000,"cc_apr_pct":[24,10],"cycle_days":30,"year_days":365}}
rows=[]
for d in (10,20,30):
    bal=D(100000)*(100-d)/100
    rows.append({"drop_pct":d,"balance_after":q(bal),"gain_needed_to_recover_pct":q(D(d)/(100-d)*100)})
out["drop_table"]=rows
cc=[]
for a in (24,10):
    cc.append({"apr_pct":a,"cycle_interest":q(D(5000)*a/100/365*30),"flat_year_simple_interest":q(D(5000)*a/100)})
out["cc_table"]=cc
out["cc_cycle_saving"]=q(D(cc[0]["cycle_interest"])-D(cc[1]["cycle_interest"]))
out["cc_year_saving_flat"]=q(D(cc[0]["flat_year_simple_interest"])-D(cc[1]["flat_year_simple_interest"]))
json.dump(out,open("evidence/calc-output.json","w"),indent=1)
print(json.dumps(out))
