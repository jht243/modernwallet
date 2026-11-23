import json
def case(P,apr,n,k):
    r=apr/1200; pay=P*r/(1-(1+r)**-n); I=pay*n-P
    r78=I*sum(range(n-k+1,n+1))/(n*(n+1)/2)   # earned after k payments
    bal=P
    for _ in range(k): bal=bal*(1+r)-pay
    act=pay*k-(P-bal)
    return dict(P=P,apr=apr,n=n,k=k,payment=round(pay,2),total_interest=round(I,2),rule78_earned=round(r78,2),actuarial_earned=round(act,2),extra_interest_charged_by_rule78=round(r78-act,2))
out=[case(15000,7,48,12),case(15000,7,48,24),case(15000,7,48,42),case(25000,8,60,12),case(30000,9,72,24)]
json.dump(out,open('/home/user/modernwallet/reports/mindmap-pass/2026-11-23-trend-lane-c-run/research/feasibility-rule78.json','w'),indent=1);print(json.dumps(out,indent=1))
