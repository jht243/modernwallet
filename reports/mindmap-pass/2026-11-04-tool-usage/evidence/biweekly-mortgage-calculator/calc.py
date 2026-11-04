"""Biweekly mortgage model (tool-usage pass 2026-11-04). Mirrors src/lib/biweekly-mortgage.ts.
Monthly: standard amortization, payment = B*r/(1-(1+r)^-n), r = APR/12.
Biweekly (applied when paid): 26 half-payments a year, each period accrues APR/26 interest.
Extra 1/12: monthly payment + payment/12 each month (same 13 payments/yr, no servicer plan).
Fees: one-time setup fee + per-debit fee (third-party plans; CFPB notes DIY is free).
"""
import json, sys

def pmt(b, r, n):
    return b / n if r == 0 else b * r / (1 - (1 + r) ** -n)

def run(balance, apr, months, setup_fee=0.0, per_debit_fee=0.0):
    r = apr / 100 / 12
    p = pmt(balance, r, months)
    # monthly baseline
    def amort(rate, pay, cap):
        bal, i_tot, k = balance, 0.0, 0
        while bal > 0.005 and k < cap:
            i = bal * rate
            prin = min(pay - i, bal)
            if prin <= 0: return None
            bal -= prin; i_tot += i; k += 1
        return k, i_tot
    m_n, m_int = amort(r, p, 2000)
    b_n, b_int = amort(apr / 100 / 26, p / 2, 5000)
    e_n, e_int = amort(r, p + p / 12, 2000)
    fees = setup_fee + per_debit_fee * b_n
    return {
        "inputs": {"balance": balance, "aprPct": apr, "monthsLeft": months, "setupFee": setup_fee, "perDebitFee": per_debit_fee},
        "monthlyPayment": round(p, 2), "halfPayment": round(p / 2, 2),
        "monthly": {"months": m_n, "interest": round(m_int, 2)},
        "biweekly": {"payments": b_n, "years": round(b_n / 26, 2), "monthsEquivalent": round(b_n * 12 / 26, 1), "interest": round(b_int, 2),
                      "interestSaved": round(m_int - b_int, 2), "fees": round(fees, 2), "netSaved": round(m_int - b_int - fees, 2)},
        "extraTwelfth": {"extraPerMonth": round(p / 12, 2), "months": e_n, "interest": round(e_int, 2), "interestSaved": round(m_int - e_int, 2)},
    }

if __name__ == "__main__":
    cases = [
        (300000, 6.5, 360, 0, 0),        # worked example
        (300000, 6.5, 360, 400, 2.5),    # third-party plan fees (illustrative fee inputs)
        (238000, 6.875, 312, 0, 0),      # mid-loan (matches recast page example loan)
        (300000, 0, 360, 0, 0),          # boundary: 0% rate
        (300000, 3.0, 360, 0, 0),        # counterexample: low rate, savings shrink
    ]
    out = [run(*c) for c in cases]
    json.dump(out, open(sys.argv[1], "w"), indent=1)
    for o in out: print(json.dumps(o))
