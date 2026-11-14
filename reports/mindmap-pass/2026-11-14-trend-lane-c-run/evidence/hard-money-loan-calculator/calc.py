"""Short-term interest-only loan cost model (trend pass Lane C, 2026-11-14). Independent replica of src/lib/hard-money-loan.ts.
Loan = purchase*purchaseAdvance% + rehab*rehabAdvance%. Points = loan*points%. Interest = sum over months of balance*APR/12
(rehab 'closing': full loan from month 1; 'even': rehab advance drawn in equal monthly shares, month k carries k/N).
Extension: extra months at the full balance plus a fee of extensionFee% of the loan. Balloon = loan.
Total financing cost = points + other fees + interest + extension interest + extension fee.
LTC = loan/(purchase+rehab). LTARV = loan/ARV. Profit = ARV - selling costs - purchase - rehab - financing cost - holding costs.
Every rate, point and fee below is an illustrative reader input, not a market or lender figure.
Usage: calc.py OUTPUT.json
"""
import json, sys

def model(purchase, rehab, p_adv, r_adv, apr, points, months, fees, ext_m=0, ext_fee=0.0, draw="closing", arv=0.0, sell=0.0, hold=0.0):
    pl, rl = purchase * p_adv / 100, rehab * r_adv / 100
    loan = pl + rl
    rm = apr / 100 / 12
    interest = ext_interest = 0.0
    for k in range(1, months + ext_m + 1):
        share = rl * (k / months) if (draw == "even" and k <= months) else rl
        m = (pl + share) * rm
        if k > months: ext_interest += m
        else: interest += m
    pts = loan * points / 100
    ext = loan * ext_fee / 100 if ext_m > 0 else 0.0
    total = pts + fees + interest + ext_interest + ext
    total_months = months + ext_m
    out = {"loan": loan, "downPayment": purchase - pl, "points": pts, "cashToClose": purchase - pl + pts + fees,
           "monthlyInterestFull": loan * rm, "interest": interest, "extensionInterest": ext_interest, "extensionFee": ext,
           "totalFinancingCost": total, "balloon": loan, "ltcPct": loan / (purchase + rehab) * 100,
           "annualizedCostPct": total / loan / (total_months / 12) * 100}
    if arv > 0:
        sc = arv * sell / 100
        out.update({"ltarvPct": loan / arv * 100, "sellingCosts": sc, "holdingCosts": hold * total_months,
                    "profit": arv - sc - purchase - rehab - total - hold * total_months})
    return {k: round(v, 2) for k, v in out.items()}

BASE = dict(purchase=200000, rehab=50000, p_adv=90, r_adv=100, apr=12, points=2, months=6, fees=2500)

def main(out):
    res = {"base": model(**BASE),
           "extension3mo1pct": model(**BASE, ext_m=3, ext_fee=1),
           "rehabDrawnEvenly": model(**BASE, draw="even"),
           "withArv330k": model(**BASE, arv=330000, sell=6, hold=1000),
           "sensitivity": {
               "months3": model(**{**BASE, "months": 3})["totalFinancingCost"], "months9": model(**{**BASE, "months": 9})["totalFinancingCost"],
               "points1": model(**{**BASE, "points": 1})["totalFinancingCost"], "points3": model(**{**BASE, "points": 3})["totalFinancingCost"],
               "apr10": model(**{**BASE, "apr": 10})["totalFinancingCost"], "apr14": model(**{**BASE, "apr": 14})["totalFinancingCost"]},
           "boundaries": {"zeroPoints": model(**{**BASE, "points": 0})["points"], "zeroRate": model(**{**BASE, "apr": 0})["totalFinancingCost"],
                          "noRehab": model(**{**BASE, "rehab": 0})["loan"], "fullAdvance": model(**{**BASE, "p_adv": 100})["downPayment"]}}
    json.dump(res, open(out, "w"), indent=1)

if __name__ == "__main__":
    main(sys.argv[1])
