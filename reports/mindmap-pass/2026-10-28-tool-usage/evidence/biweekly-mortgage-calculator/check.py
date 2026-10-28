"""Independent re-computation of the biweekly mortgage calculator (no TS code reused)."""
import json
def pmt(B, apr, n):
    r = apr / 12
    return B / n if r == 0 else B * r / (1 - (1 + r) ** -n)
def amort(B, pr, pay, per_year):
    b, k, i = B, 0, 0.0
    while b > 0.005 and k < 2000:
        it = b * pr; i += it; b = b + it - min(pay, b + it); k += 1
    return {"payments": k, "years": round(k / per_year, 3), "interest": round(i, 2)}
def scen(B, rate, yrs, setup=0, fee=0):
    apr = rate / 100; n = round(yrs * 12); p = pmt(B, apr, n)
    m = amort(B, apr / 12, p, 12); bw = amort(B, apr / 26, p / 2, 26); x = amort(B, apr / 12, p + p / 12, 12)
    fees = setup + fee * bw["payments"]
    return {"balance": B, "rate": rate, "years_left": yrs, "setup_fee": setup, "per_payment_fee": fee, "payment": round(p, 2),
            "monthly": m, "biweekly": bw, "extra_twelfth": x,
            "biweekly_saved": round(m["interest"] - bw["interest"], 2), "extra_twelfth_saved": round(m["interest"] - x["interest"], 2),
            "years_sooner": round(m["years"] - bw["years"], 3), "fees": round(fees, 2), "net": round(m["interest"] - bw["interest"] - fees, 2)}
grid = [scen(300000, 6.5, 30), scen(300000, 6.5, 30, 395, 2.5), scen(200000, 4.0, 30), scen(400000, 7.0, 30), scen(250000, 6.5, 15), scen(150000, 6.0, 10), scen(300000, 0.0, 30), scen(300000, 6.5, 30, 0, 9.95)]
print(json.dumps({"scenarios": grid}, indent=1))
