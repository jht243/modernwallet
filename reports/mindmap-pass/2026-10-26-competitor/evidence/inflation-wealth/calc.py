# Calculated scenario: purchasing power of $10,000 held 1 year under stated sourced inputs.
# Sourced: FDIC national avg savings rate 0.38% (as of 2026-10-19); BLS CPI-U 12-mo 3.7% (Sept 2026, released 2026-10-14);
# I bond composite 4.26% for bonds issued 2026-05-01..2026-10-31 (fixed 0.90%, set May 1 2026, 1.67% semiannual inflation component);
# I bond rules: 12-month lock, forfeit last 3 months of interest if redeemed before 5 years; $10,000/person/year electronic.
# Scenario assumptions (ours): CPI holds at 3.7% for the year; I bond composite held at 4.26% (it actually resets every 6 months);
# interest compounds annually for the simple comparison. NOT a forecast.
P=10000.0; cpi=0.037
def real(nom): return P*(1+nom)/(1+cpi)
for name,r in (("FDIC avg savings 0.38%",0.0038),("I bond composite 4.26% (held)",0.0426)):
    print(f"{name}: nominal end {P*(1+r):.2f}; end value in today's dollars {real(r):.2f}; real change {real(r)-P:+.2f}")
print(f"Cash under mattress 0%: end value in today's dollars {P/(1+cpi):.2f}; real change {P/(1+cpi)-P:+.2f}")
print(f"Break-even nominal rate to hold purchasing power: {cpi*100:.2f}%")
# Fixed-rate part only: real return of I bond when inflation component equals CPI = approx fixed rate
print(f"I bond fixed rate alone 0.90% vs 0%: extra over inflation each year ~ {P*0.009:.2f} on {P:.0f}")
# 3-month penalty if redeemed at month 13 (after lock, before 5 yrs): forfeit last 3 months interest
# interest earned over 13 months at 4.26%/yr simple monthly accrual approximation: 
mo=13; accrued=P*0.0426/12*mo; pen=P*0.0426/12*3
print(f"Redeem at month 13 (approx simple accrual): accrued {accrued:.2f}, 3-month penalty {pen:.2f}, net {accrued-pen:.2f}")
# Counterexample: if inflation falls to 2% and bond rate resets to 2.9% (0.9 fixed + 2.0 infl), real return stays ~ fixed rate
print("Counterexample: if CPI fell to 2.0%, a savings account at 0.38% still loses ~1.6% real; the I bond adds ~0.9% fixed above inflation.")
# Contribution room (IRS 2026): 401(k) $24,500, IRA $7,500 -> tax-advantaged room does not itself beat inflation
print(f"IRS 2026 limits: 401(k) 24,500; IRA 7,500; sum for one worker with both = {24500+7500}")
