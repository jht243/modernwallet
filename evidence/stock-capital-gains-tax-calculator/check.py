"""Independent reference for /stock-capital-gains-tax-calculator/ (calculated, federal only, tax year 2026).

Ordinary tax uses the IRS "base amount plus rate of the excess" tables in Rev. Proc. 2025-32 section 4.01
(Tables 1 to 4), typed here independently of src/lib/tax-bracket.ts (which stores bracket tops and rates).
Long-term stacking uses section 4.03 thresholds; NIIT per IRS Topic 559.
"""
import json, sys
# (lower bound, base tax at lower bound, rate) per status, from the IRS tables.
T = {
 "single": [(0,0,.10),(12400,1240,.12),(50400,5800,.22),(105700,17966,.24),(201775,41024,.32),(256225,58448,.35),(640600,192979.25,.37)],
 "mfs":    [(0,0,.10),(12400,1240,.12),(50400,5800,.22),(105700,17966,.24),(201775,41024,.32),(256225,58448,.35),(384350,103291.75,.37)],
 "mfj":    [(0,0,.10),(24800,2480,.12),(100800,11600,.22),(211400,35932,.24),(403550,82048,.32),(512450,116896,.35),(768700,206583.5,.37)],
 "hoh":    [(0,0,.10),(17700,1770,.12),(67450,7740,.22),(105700,16155,.24),(201750,39207,.32),(256200,56631,.35),(640600,191171,.37)],
}
ZERO = {"single":49450,"mfj":98900,"hoh":66200,"mfs":49450}
FIFTEEN = {"single":545500,"mfj":613700,"hoh":579600,"mfs":306850}
NIIT_T = {"single":200000,"mfj":250000,"hoh":200000,"mfs":125000}
STD = {"single":16100,"mfj":32200,"hoh":24150,"mfs":16100}

def ordinary(status, ti):
    lo, base, rate = [r for r in T[status] if ti >= r[0]][-1]
    return base + rate * (ti - lo)

def run(status, ti, basis, proceeds, long_term):
    gain = proceeds - basis
    if gain <= 0: return dict(gain=gain, tax=0.0, niit=0.0, total=0.0)
    if long_term:
        z, f = ZERO[status], FIFTEEN[status]
        # integrate the 0/15/20 schedule over [ti, ti+gain] numerically-exact by pieces
        def lt(x):  # tax on the "gain layer" up to taxable income x, counting from 0 as if all were gain
            return 0.15 * max(0, min(x, f) - z) + 0.20 * max(0, x - f)
        tax = lt(ti + gain) - lt(ti)
    else:
        tax = ordinary(status, ti + gain) - ordinary(status, ti)
    magi = ti + STD[status] + gain
    niit = 0.038 * max(0, min(gain, magi - NIIT_T[status]))
    return dict(gain=gain, tax=round(tax,2), niit=round(niit,2), total=round(tax+niit,2))

SC = [
 ("default_lt_single_85k_gain20k", "single", 85000, 30000, 50000, True),
 ("zero_bracket_inside", "single", 20000, 10000, 15000, True),
 ("straddle_0_15", "single", 40000, 10000, 30000, True),
 ("straddle_15_20", "single", 540000, 10000, 40000, True),
 ("exactly_at_zero_top", "single", 49450, 0, 10000, True),
 ("short_term_single", "single", 85000, 30000, 50000, False),
 ("short_term_straddle_bracket", "single", 100000, 10000, 20000, False),
 ("mfj_lt_high", "mfj", 650000, 100000, 300000, True),
 ("niit_single_lt", "single", 190000, 20000, 60000, True),
 ("niit_mfj_short", "mfj", 240000, 20000, 60000, False),
 ("loss", "single", 85000, 30000, 20000, True),
 ("hoh_lt", "hoh", 60000, 10000, 40000, True),
 ("mfs_lt_top", "mfs", 300000, 10000, 50000, True),
]
out = {}
for name, st, ti, b, p, lt in SC:
    out[name] = dict(inputs=dict(status=st, taxableIncome=ti, basis=b, proceeds=p, longTerm=lt), **run(st, ti, b, p, lt))
    print(name, out[name]["gain"], out[name]["tax"], out[name]["niit"], out[name]["total"])
json.dump(out, open(sys.argv[1] if len(sys.argv)>1 else "check.out.json","w"), indent=1)
