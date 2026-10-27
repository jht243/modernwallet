"""Independent re-implementation of Schedule 1-A Part IV lines 24-30 (2025 form) used to cross-check
src/lib/car-loan-deduction.ts and to produce the scenario table quoted on the page. Run: python3 check.py"""
import math, json

def qpvli(interest, magi, status):
    start = 200000 if status == "mfj" else 100000
    line24 = min(interest, 10000)
    line27 = magi - start
    if line27 <= 0:
        return line24
    line28 = math.ceil(line27 / 1000)
    return max(0, line24 - line28 * 200)

def interest_months(p, apr, n, m):
    r = apr / 100 / 12
    pay = p * r / (1 - (1 + r) ** -n)
    bal, tot = p, 0.0
    for _ in range(m):
        i = bal * r; tot += i; bal -= pay - i
    return round(tot, 2)

out = {}
# scenario A: single filer, $95,000 MAGI, $4,200 interest, 22% bracket
out["A_single_95k_4200"] = qpvli(4200, 95000, "single")
# scenario B: joint, $215,000 MAGI, $4,200 interest
out["B_mfj_215k_4200"] = qpvli(4200, 215000, "mfj")
# scenario C: single at the cap
out["C_single_100k_12000"] = qpvli(12000, 100000, "single")
out["C_single_125k_12000"] = qpvli(12000, 125000, "single")
out["C_single_149000_12000"] = qpvli(12000, 149000, "single")
out["C_single_149001_12000"] = qpvli(12000, 149001, "single")
out["C_single_150000_12000"] = qpvli(12000, 150000, "single")
out["C_mfj_249001_12000"] = qpvli(12000, 249001, "mfj")
out["C_mfj_249000_12000"] = qpvli(12000, 249000, "mfj")
# boundary: $1 over the threshold costs a full $200 step
out["D_single_100001_12000"] = qpvli(12000, 100001, "single")
# first-year interest on a $45,000 loan, 72 months, 9% APR, 12 payments
out["E_interest_45000_72_9_12mo"] = interest_months(45000, 9.0, 72, 12)
# tax value at 22% of a $4,200 deduction
out["F_taxsaved_22pct_4200"] = round(4200 * 0.22, 2)
# sensitivity: same $4,200 of interest, MAGI 100k..150k single
out["G_sweep_single_4200"] = {m: qpvli(4200, m, "single") for m in (100000, 105000, 110000, 120000, 130000, 140000)}
print(json.dumps(out, indent=1))
