"""Reference model for /paycheck-calculator/ (calculated). 2026 federal income tax on the standard deduction plus employee payroll tax.
Sources: IRS Rev. Proc. 2025-32 (brackets, standard deduction), IRS Topic 751 (6.2% to $184,500; 1.45%; 0.9% withheld above $200,000), IRS Topic 560.
Run from the repo root: python3 reports/mindmap-pass/2026-11-15-keyword-gap-run/evidence/paycheck-calculator/model.py"""
import json, os
OUT = os.path.join(os.path.dirname(__file__), "output.json")
STD = {"single": 16100, "mfj": 32200, "hoh": 24150}
TOPS = {"single": [12400, 50400, 105700, 201775, 256225, 640600], "mfj": [24800, 100800, 211400, 403550, 512450, 768700], "hoh": [17700, 67450, 105700, 201750, 256200, 640600]}
RATES = [.10, .12, .22, .24, .32, .35, .37]
SS_RATE, SS_BASE, MED, ADDL, ADDL_T = 0.062, 184500, 0.0145, 0.009, 200000

def fed(taxable, st):
    t = 0.0; lo = 0
    for r, top in zip(RATES, TOPS[st] + [float("inf")]):
        if taxable > lo: t += (min(taxable, top) - lo) * r
        lo = top
    return t

def paycheck(gross, st="single", pretax=0, periods=26):
    pretax = min(max(0, pretax), gross)
    taxable = max(0, gross - pretax - STD[st])
    f = fed(taxable, st); ss = min(gross, SS_BASE) * SS_RATE; med = gross * MED + max(0, gross - ADDL_T) * ADDL
    net = gross - pretax - f - ss - med
    return dict(gross=gross, status=st, pretax=pretax, taxable=taxable, federal=round(f, 2), ss=round(ss, 2), medicare=round(med, 2),
                net_annual=round(net, 2), net_per_period=round(net / periods, 2), periods=periods, share=round(net / gross, 4))

cases = {
    "default_60000_single": paycheck(60000),
    "mfj_60000": paycheck(60000, "mfj"),
    "hoh_60000": paycheck(60000, "hoh"),
    "pretax_100000_10000": paycheck(100000, "single", 10000),
    "ss_cap_300000": paycheck(300000),
    "at_std_deduction_16100": paycheck(16100),
    "ss_cap_edge_184500_hoh": paycheck(184500, "hoh"),
    "addl_medicare_250000": paycheck(250000),
    "weekly_60000": paycheck(60000, periods=52),
}
table = [paycheck(g) for g in (40000, 60000, 100000, 150000)]
assert cases["default_60000_single"]["federal"] == 5020.0 and cases["default_60000_single"]["ss"] == 3720.0 and cases["default_60000_single"]["medicare"] == 870.0
assert cases["default_60000_single"]["net_annual"] == 50390.0
assert cases["at_std_deduction_16100"]["federal"] == 0
assert cases["ss_cap_300000"]["ss"] == round(184500 * .062, 2)
json.dump({"cases": cases, "salaryTable": table}, open(OUT, "w"), indent=1)
print(json.dumps(table))
