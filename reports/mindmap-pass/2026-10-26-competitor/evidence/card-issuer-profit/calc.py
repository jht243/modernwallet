# Calculated scenario: what one revolving balance earns an issuer vs a pay-in-full card.
# Inputs (sourced): balance $5,300 (CFPB 2025 report, avg per cardholder 2024); APR 22.15% (Fed G.19 Q2 2026, accounts assessed interest);
# min payment rule = 1% of balance + that month's interest (CFPB 2025 s4.1.1: "most issuers set minimum payment at 1 percent ... add finance charges");
# dollar floor $40 (CFPB: most common floor); interchange 1.8% of purchase volume (CFPB 2023, general purpose issuers, 2022 data).
# Scenario assumptions (ours): no new purchases, no fees, constant APR, monthly compounding at APR/12.
def run(bal0=5300.0, apr=0.2215, floor=40.0):
    bal=bal0; tot_int=0.0; tot_paid=0.0; m=0; first=None
    while bal>0.005 and m<1200:
        i=bal*apr/12; m+=1
        pay=max(floor, 0.01*bal+i); pay=min(pay,bal+i)
        if first is None: first=(i,pay)
        bal=bal+i-pay; tot_int+=i; tot_paid+=pay
    return m,tot_int,tot_paid,first
m,ti,tp,f=run()
print(f"Balance 5300 @22.15%: month1 interest {f[0]:.2f}, month1 min payment {f[1]:.2f}")
print(f"Min-only payoff: {m} months ({m/12:.1f} yrs), total interest {ti:.2f}, total paid {tp:.2f}")
print(f"Year-1 interest if balance held flat: {5300*0.2215:.2f}")
print(f"Interchange on 5300 of purchases at 1.8%: {5300*0.018:.2f}")
print(f"Ratio flat-year interest / interchange: {5300*0.2215/(5300*0.018):.1f}x")
for apr in (0.2215,0.252):
    m,ti,tp,f=run(apr=apr); print(f"APR {apr*100:.2f}%: {m} months, interest {ti:.2f}")
# Counter: fixed $265/month (5% of balance) payoff
bal=5300.0; ti=0; m=0
while bal>0.005:
    i=bal*0.2215/12; m+=1; pay=min(265.0,bal+i); bal=bal+i-pay; ti+=i
print(f"Fixed $265/mo: {m} months, interest {ti:.2f}")
