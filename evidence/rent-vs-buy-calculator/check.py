"""Reference model for /rent-vs-buy-calculator/ (modeled, not measured).

Buying path: down payment + closing cost up front, then each month mortgage payment (P&I),
property tax, insurance, maintenance (all on the home's current value), HOA, and PMI while the loan
is above 80% of the purchase price. Renting path: rent (grows yearly) + renter's insurance, and the
down payment + buy closing cost are invested at the start.
Each month the cheaper path invests the monthly difference. At each year-end:
  buyer net worth  = home value * (1 - selling cost) - loan balance + buyer's investment pot
  renter net worth = renter's investment pot
Federal tax effects (mortgage interest, SALT) are NOT modeled: most filers take the standard deduction.
"""
import json, sys

DEF = dict(price=400000, down_pct=20, rate_pct=7.32, term_years=30, prop_tax_pct=1.0, insurance_pct=0.5,
           maint_pct=1.0, hoa_month=0, closing_pct=3.0, sell_pct=6.0, appr_pct=3.0, rent=2200,
           rent_growth_pct=3.0, renter_ins_month=15, return_pct=6.0, pmi_pct=0.5, years=7)

def run(p):
    p = {**DEF, **p}
    price = p["price"]; loan0 = price * (1 - p["down_pct"] / 100)
    n = int(p["term_years"] * 12); r = p["rate_pct"] / 1200
    pay = loan0 / n if r == 0 else loan0 * r / (1 - (1 + r) ** -n)
    mret = (1 + p["return_pct"] / 100) ** (1 / 12) - 1
    cash0 = price * p["down_pct"] / 100 + price * p["closing_pct"] / 100
    renter = cash0; owner_pot = 0.0; bal = loan0
    rows = []
    maxm = 30 * 12
    for m in range(1, maxm + 1):
        yr = (m - 1) // 12                      # 0-based year index
        value_start = price * (1 + p["appr_pct"] / 100) ** yr
        if m <= n:
            interest = bal * r; princ = pay - interest; bal = max(0.0, bal - princ); pi = pay
        else:
            pi = 0.0
        pmi = (loan0 * p["pmi_pct"] / 100 / 12) if (bal > 0.8 * price and p["down_pct"] < 20) else 0.0
        own = pi + value_start * (p["prop_tax_pct"] + p["insurance_pct"] + p["maint_pct"]) / 1200 + p["hoa_month"] + pmi
        rent = p["rent"] * (1 + p["rent_growth_pct"] / 100) ** yr + p["renter_ins_month"]
        renter = renter * (1 + mret) + max(0.0, own - rent)
        owner_pot = owner_pot * (1 + mret) + max(0.0, rent - own)
        if m % 12 == 0:
            y = m // 12
            value = price * (1 + p["appr_pct"] / 100) ** y
            buy_nw = value * (1 - p["sell_pct"] / 100) - bal + owner_pot
            rows.append(dict(year=y, buy=round(buy_nw, 2), rent=round(renter, 2), diff=round(buy_nw - renter, 2)))
    be = next((r_["year"] for r_ in rows if r_["diff"] >= 0), None)
    return dict(payment=round(pay, 2), rows=rows, break_even=be, at_horizon=rows[p["years"] - 1])

if __name__ == "__main__":
    out = {"default": run({}), "scenarios": {}}
    grid = {
        "rate_5": dict(rate_pct=5.0), "rate_3": dict(rate_pct=3.0), "rate_9": dict(rate_pct=9.0),
        "rent_2800": dict(rent=2800), "rent_1600": dict(rent=1600),
        "appr_0": dict(appr_pct=0.0), "appr_1": dict(appr_pct=1.0), "rate_6": dict(rate_pct=6.0), "rate_4": dict(rate_pct=4.0), "rent_2600": dict(rent=2600), "appr_5": dict(appr_pct=5.0),
        "return_3": dict(return_pct=3.0), "return_9": dict(return_pct=9.0),
        "down_10": dict(down_pct=10), "down_3": dict(down_pct=3.5),
        "price_600": dict(price=600000, rent=2800), "zero_rate": dict(rate_pct=0.0),
    }
    for k, v in grid.items():
        r = run(v); out["scenarios"][k] = dict(inputs=v, break_even=r["break_even"], payment=r["payment"], at_horizon=r["at_horizon"])
    json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else "check.out.json", "w"), indent=1)
    d = out["default"]
    print("default payment", d["payment"], "break-even", d["break_even"], "7y", d["at_horizon"])
    for k, v in out["scenarios"].items(): print(k, v["break_even"], v["at_horizon"]["diff"])
