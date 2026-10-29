#!/usr/bin/env python3
"""Phase 4 auditor's independent replay of the hidden-cost calculation (written fresh, does not import run.mts or the engine)."""
import json, math, sys
inp = json.load(open('evidence/hidden-cost-of-owning-a-home-calculator/inputs.json'))
n = inp['national']; r = inp['reportedChanges']
NAT_TOTAL = n['maintenance'] + n['propertyTax'] + n['insurance']

def clean(x):
    return x if (isinstance(x, (int, float)) and math.isfinite(x) and x > 0) else 0

def run(i):
    m, t, ins = clean(i['maintenance']), clean(i['propertyTax']), clean(i['insurance'])
    hoa = clean(i['hoaMonthly']) * 12
    annual = m + t + ins + hoa
    yrs = i['years'] if math.isfinite(i['years']) else 5
    yrs = int(min(30, max(1, round(yrs))))
    g = (i['growthPct'] if math.isfinite(i['growthPct']) else 0) / 100
    sched, cum = [], 0
    for y in range(1, yrs + 1):
        tot = annual * math.pow(1 + g, y - 1)
        sched.append({'year': y, 'total': tot})
        cum += tot
    share = ({'maintenance': m / annual, 'propertyTax': t / annual, 'insurance': ins / annual, 'hoa': hoa / annual}
             if annual > 0 else {'maintenance': 0, 'propertyTax': 0, 'insurance': 0, 'hoa': 0})
    val = clean(i['homeValue']); mort = clean(i['mortgageMonthly'])
    return {'annual': annual, 'monthly': annual / 12, 'hoaAnnual': hoa,
            'vsNationalAnnual': m + t + ins - NAT_TOTAL, 'share': share,
            'pctOfValue': (annual / val) * 100 if val > 0 else None,
            'allInMonthly': mort + annual / 12 if mort > 0 else None,
            'maintenanceMonthly': m / 12, 'schedule': sched, 'cumulative': cum}

def norm(x):
    # JS emits integers without a trailing .0; keep ints as ints where the value is whole, as JSON.stringify does.
    if isinstance(x, float) and x.is_integer() and abs(x) < 1e21:
        return int(x)
    if isinstance(x, dict): return {k: norm(v) for k, v in x.items()}
    if isinstance(x, list): return [norm(v) for v in x]
    return x

back = {'maintenance': n['maintenance'] / (1 + r['maintenanceFiveYearPct'] / 100),
        'propertyTax': n['propertyTax'] / (1 + r['propertyTaxFiveYearPct'] / 100),
        'insurance': n['insurance'] / (1 + r['insuranceFiveYearPct'] / 100)}
bs = back['maintenance'] + back['propertyTax'] + back['insurance']
out = {'nationalSumCheck': {'components': NAT_TOTAL, 'reportedTotal': n['reportedTotal'], 'engineTotal': NAT_TOTAL, 'monthly': n['reportedTotal'] / 12},
       'backcastFiveYears': {**back, 'sum': bs, 'totalFromReportedPct': n['reportedTotal'] / (1 + r['totalFiveYearPct'] / 100),
                             'impliedTotalChangePct': (n['reportedTotal'] / bs - 1) * 100},
       'scenarios': [{'id': s['id'], 'input': s['input'], 'result': run(s['input'])} for s in inp['scenarios']]}
json.dump(norm(out), open(sys.argv[1], 'w'), indent=1); open(sys.argv[1], 'a').write('\n')
