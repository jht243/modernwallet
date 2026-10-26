"""Scheduled-amortization PMI timeline. Pure arithmetic; no PMI premium rate is assumed.
Run: python3 calc.py > output.txt"""
def bal(loan, rate, n, k):
    r = rate/12
    pmt = loan*r/(1-(1+r)**-n)
    b = loan
    for _ in range(k): b = b*(1+r)-pmt
    return pmt, b
def month_at(loan, rate, n, target):
    r = rate/12; pmt = loan*r/(1-(1+r)**-n); b = loan
    for m in range(1, n+1):
        b = b*(1+r)-pmt
        if b <= target+1e-9: return m
    return None
PRICE = 400_000
print("Case grid: price $400,000, 30-year fixed, scheduled payments only, original value = price")
print("down%  rate   loan     m_to_80%  yrs   m_to_78%  yrs   midpoint=180")
for down in (0.03, 0.05, 0.10, 0.15):
    for rate in (0.055, 0.065, 0.075):
        loan = PRICE*(1-down)
        m80 = month_at(loan, rate, 360, 0.80*PRICE)
        m78 = month_at(loan, rate, 360, 0.78*PRICE)
        print(f"{down*100:4.0f}  {rate*100:4.1f}  {loan:8.0f}  {m80:5d}  {m80/12:5.1f}  {m78:5d}  {m78/12:5.1f}")
print()
print("Current-value test (the order's pilot says current market value; threshold used here: 80% LTV, ILLUSTRATIVE)")
print("Home bought $400,000 with 5% down at 6.5%, 30-year. Value needed for balance = 80% of CURRENT value:")
for yrs in (2,3,5,7):
    pmt,b = bal(380000, 0.065, 360, yrs*12)
    print(f"year {yrs}: balance ${b:,.0f}; value needed for 80% LTV ${b/0.8:,.0f} ({(b/0.8/PRICE-1)*100:+.1f}% vs price)")
print()
print("Arithmetic, no assumed rate: monthly PMI per 0.1 percentage point of annual premium rate")
for loan in (300000, 380000):
    print(f"loan ${loan:,}: each 0.1 pt of annual rate = ${loan*0.001/12:,.2f}/mo")
print()
print("Counterexample: 20% down loan, price $400,000, loan $320,000: LTV is 80% on day one -> m=0 (no PMI case)")
