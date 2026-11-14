"""Bridge loan cost model (trend pass Lane C, 2026-11-14). Independent replica of src/lib/bridge-loan.ts.
Interest = loan*APR/12*months (simple, repaid from the sale proceeds). Fees = loan*origination% + other fees.
Bridge cost = fees + interest. Selling costs = sale price*selling%. Net proceeds = sale - old payoff - bridge loan - bridge cost - selling costs.
Monthly overlap outlay = new mortgage payment + old home monthly carrying costs.
Break-even months vs an alternative with no up-front fee = fees/(alternative monthly - bridge monthly interest), when positive.
Max bridge from a combined loan-to-value limit = sale price*limit% - old payoff (floored at 0).
Every rate, fee, limit and month count below is an illustrative reader input, not a lender or market figure.
Usage: calc.py OUTPUT.json
"""
import json, sys

def model(sale=400000, payoff=200000, loan=100000, apr=10, orig=2, other=0, months=6, new_pay=0, old_carry=0, sell=6, alt=0, ltv=0):
    fees = loan * orig / 100 + other
    mi = loan * apr / 100 / 12
    interest = mi * months
    cost = fees + interest
    sc = sale * sell / 100
    net = sale - payoff - loan - cost - sc
    out = {"fees": fees, "monthlyInterest": mi, "interest": interest, "bridgeCost": cost, "sellingCosts": sc, "netProceeds": net,
           "monthlyOverlapOutlay": new_pay + old_carry, "totalOverlapOutlay": (new_pay + old_carry) * months}
    if alt > mi: out["breakEvenMonths"] = fees / (alt - mi)
    if ltv > 0: out["maxBridgeFromLtv"] = max(0.0, sale * ltv / 100 - payoff)
    return {k: round(v, 2) for k, v in out.items()}

def main(out):
    res = {"base6mo": model(), "months3": model(months=3), "months9": model(months=9), "months12": model(months=12),
           "overlap": model(new_pay=2500, old_carry=1800), "breakEvenAlt1500": model(alt=1500),
           "ltv80": model(ltv=80), "payoff300k": model(payoff=300000), "noOrigination": model(orig=0), "zeroMonths": model(months=0)}
    json.dump(res, open(out, "w"), indent=1)

if __name__ == "__main__":
    main(sys.argv[1])
