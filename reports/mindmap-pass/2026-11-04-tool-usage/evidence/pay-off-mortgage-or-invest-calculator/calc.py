"""Pay off mortgage or invest model (tool-usage pass 2026-11-04). Mirrors src/lib/payoff-vs-invest.ts.
Horizon = the loan's scheduled payoff (months left). Both paths spend the same cash each month: payment + extra.
Prepay path: extra goes to principal; once the loan is gone, payment + extra is invested every month until the horizon.
Invest path: extra is invested every month; the loan runs on schedule.
Investments compound monthly at (1+g)^(1/12)-1. Tax on gains at the horizon = taxRate x (balance - contributions).
At the horizon both homes are paid off, so compare the after-tax invested balances. Mortgage-interest deduction ignored
(most filers take the standard deduction; IRS Pub 936). Break-even return found by bisection.
"""
import json, sys

def pmt(b, r, n):
    return b / n if r == 0 else b * r / (1 - (1 + r) ** -n)

def run(balance, apr, months, extra, ret, tax):
    r = apr / 100 / 12
    p = pmt(balance, r, months)
    gm = (1 + ret / 100) ** (1 / 12) - 1
    # prepay path
    bal, k, int_pre, leftover = balance, 0, 0.0, 0.0
    while bal > 0.005 and k < months:
        i = bal * r; int_pre += i
        due = bal + i
        if p + extra >= due:
            leftover = p + extra - due   # cash left in the payoff month is invested, not dropped
            bal = 0.0
        else:
            bal = due - (p + extra)
        k += 1
    payoff_month = k
    inv, contrib = leftover, leftover
    for _ in range(months - payoff_month):
        inv = inv * (1 + gm) + p + extra; contrib += p + extra
    pre_after = inv - max(0, inv - contrib) * tax / 100
    # invest path
    inv2, c2 = 0.0, 0.0
    for _ in range(months):
        inv2 = inv2 * (1 + gm) + extra; c2 += extra
    inv_after = inv2 - max(0, inv2 - c2) * tax / 100
    int_sched = p * months - balance
    return {"payment": round(p, 2), "payoffMonth": payoff_month, "monthsSooner": months - payoff_month,
            "interestSaved": round(int_sched - int_pre, 2),
            "prepayWealth": round(pre_after, 2), "investWealth": round(inv_after, 2),
            "investMinusPrepay": round(inv_after - pre_after, 2)}

def breakeven(balance, apr, months, extra, tax):
    lo, hi = 0.0, 30.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if run(balance, apr, months, extra, mid, tax)["investMinusPrepay"] > 0: hi = mid
        else: lo = mid
    return round((lo + hi) / 2, 2)

if __name__ == "__main__":
    cases = [
        (300000, 6.5, 360, 300, 7, 15),   # worked example
        (300000, 6.5, 360, 300, 5, 15),
        (300000, 3.0, 360, 300, 7, 15),   # low-rate counterexample
        (250000, 6.5, 300, 500, 7, 15),
        (300000, 6.5, 360, 300, 7, 0),    # tax-advantaged account (0% tax on gains)
        (300000, 6.5, 360, 0, 7, 15),     # boundary: no extra
        (300000, 3.0, 360, 300, 7, 0),    # regression: 0% tax break-even must equal the effective annual mortgage rate
    ]
    out = []
    for c in cases:
        o = run(*c); o["inputs"] = dict(zip(["balance","aprPct","monthsLeft","extraPerMonth","returnPct","taxOnGainsPct"], c))
        o["breakEvenReturnPct"] = breakeven(c[0], c[1], c[2], c[3], c[5]) if c[3] > 0 else None
        out.append(o); print(json.dumps(o))
    for apr in (6.5, 3.0):
        eff = ((1 + apr / 100 / 12) ** 12 - 1) * 100
        be = breakeven(300000, apr, 360, 300, 0)
        assert abs(be - eff) < 0.02, (apr, be, eff)
        out.append({"regression": "0% tax break-even == effective annual rate", "aprPct": apr, "effectiveAnnualPct": round(eff, 3), "breakEvenReturnPct": be})
    json.dump(out, open(sys.argv[1], "w"), indent=1)
