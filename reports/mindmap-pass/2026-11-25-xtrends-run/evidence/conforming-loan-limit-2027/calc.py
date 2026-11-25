#!/usr/bin/env python3
"""Highest purchase price a loan at the conforming limit can finance: price = limit / (1 - down payment share).
Ignores financed fees (for example FHA-type premiums), closing costs and lender-set thresholds."""
import json, sys, math
inp = json.load(open(sys.argv[1]))
rows = []
for name, limit in (("baseline", inp["limitsUsed"]["baseline"]), ("highCostCeiling", inp["limitsUsed"]["highCostCeiling"])):
    for d in inp["downPaymentShares"]:
        price = limit / (1 - d)
        rows.append({"limitCase": name, "limit": limit, "downPaymentShare": d,
                     "maxPurchasePrice": round(price), "downPaymentDollars": round(price - limit)})
band = {"loanBetween": [inp["baselineLimit2026"], inp["baselineLimit2027"]],
        "note": "Only a loan in this band (baseline-county case) is conforming under the 2027 limit but not the 2026 limit."}
check = {"2027_minus_2026": inp["baselineLimit2027"] - inp["baselineLimit2026"], "matchesFhfaIncrease": inp["baselineLimit2027"] - inp["baselineLimit2026"] == inp["increase"],
         "ceilingIs150PercentOfBaseline": math.isclose(inp["baselineLimit2027"] * 1.5, inp["highCostCeiling2027"])}
json.dump({"formula": "limit / (1 - downPaymentShare)", "rows": rows, "waitingBand": band, "checks": check}, sys.stdout, indent=1)
