"""401(k) loan model (trend pass Lane C, 2026-11-14). Independent Python replica of src/lib/401k-loan.ts.
Cap per 26 U.S.C. 72(p)(2)(A): new loan + loans already owed <= min(50,000 - max(0, highest12 - owed), max(vested/2, 10,000)).
Max new loan = max(0, cap - owed). Level payment = P*r/(1-(1+r)^-n), r = APR/payments per year, n = years*payments per year.
Rules checked: term over 5 years (general purpose), payments less often than quarterly, amount over the cap.
Usage: calc.py OUTPUT.json   (inputs are hard-coded in this order and mirrored in inputs.json)
"""
import json, sys

def limit(vested, owed, h12):
    a = max(0.0, 50000 - max(0.0, h12 - owed))
    b = max(vested / 2, 10000)
    cap = min(a, b)
    return {"prongDollar": a, "prongVested": b, "totalLimit": cap, "maxNewLoan": max(0.0, cap - owed)}

def pay(p, apr, years, ppy):
    n = round(years * ppy); r = apr / 100 / ppy
    pmt = p / n if r == 0 else p * r / (1 - (1 + r) ** -n)
    bal, tot_int, yearly, y_int, y_paid = p, 0.0, [], 0.0, 0.0
    for k in range(1, n + 1):
        i = bal * r
        prin = bal if k == n else pmt - i
        bal = 0.0 if k == n else bal - prin
        tot_int += i; y_int += i; y_paid += prin + i
        if k % ppy == 0 or k == n:
            yearly.append({"year": -(-k // ppy), "paid": round(y_paid, 2), "interest": round(y_int, 2), "endBalance": round(bal, 2)})
            y_int = y_paid = 0.0
    return {"periods": n, "payment": round(pmt, 2), "totalInterest": round(tot_int, 2), "totalRepaid": round(p + tot_int, 2), "yearly": yearly}

LIMITS = [(15000, 0, 0), (60000, 0, 0), (200000, 0, 0), (100000, 0, 0), (200000, 10000, 20000), (200000, 20000, 50000)]
PAYS = [(10000, 6, 5, 12), (10000, 8, 5, 12), (10000, 10, 5, 12), (10000, 8, 5, 4), (10000, 8, 5, 26), (30000, 8, 5, 12), (30000, 8, 15, 12)]

def main(out):
    res = {"limits": [{"vested": v, "owed": o, "highest12": h, **{k: round(x, 2) for k, x in limit(v, o, h).items()}} for v, o, h in LIMITS],
           "payments": [{"amount": p, "aprPct": a, "years": y, "paymentsPerYear": q, **pay(p, a, y, q)} for p, a, y, q in PAYS],
           "rules": {"termOver5GeneralPurpose": "flag", "paymentsUnderQuarterly": "flag", "residenceException": "term over 5 years allowed"},
           "doubleDeductionCheck": {"vested": 200000, "owed": 10000, "highest12": 20000, "statute": 30000, "doubleDeductionReading": 20000}}
    json.dump(res, open(out, "w"), indent=1)

if __name__ == "__main__":
    main(sys.argv[1])
