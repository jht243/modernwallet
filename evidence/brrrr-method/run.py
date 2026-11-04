#!/usr/bin/env python3
"""BRRRR worked scenario (modeled, deterministic). Usage: run.py INPUTS.json OUTPUT.json"""
import json, sys

def main(inp_path, out_path):
    i = json.load(open(inp_path))
    cash_in = i["purchasePrice"] + i["purchaseClosingCosts"] + i["rehabCost"]
    ltv, rate = i["refinanceLtvAssumption"], i["refinanceClosingCostRate"]
    initial_investment = i["purchasePrice"] + i["purchaseClosingCosts"]
    rows = {}
    for name, arv in i["afterRepairValueScenarios"].items():
        # Path A: standard cash-out refinance sized on appraised value (assumed LTV)
        loan_a = arv * ltv
        net_a = loan_a * (1 - rate)
        # Path B: delayed-financing style cap: loan cannot exceed documented initial purchase investment
        # cap: documented purchase investment plus financing of the new loan's closing costs (fee rate x loan) => L <= I / (1 - rate)
        loan_b = min(initial_investment / (1 - rate), arv * ltv)
        net_b = loan_b * (1 - rate)
        rows[name] = {
            "arv": arv,
            "pathA": {"loan": round(loan_a, 2), "netProceeds": round(net_a, 2), "cashLeftInDeal": round(cash_in - net_a, 2)},
            "pathB": {"loan": round(loan_b, 2), "netProceeds": round(net_b, 2), "cashLeftInDeal": round(cash_in - net_b, 2)},
        }
    breakeven_loan = cash_in / (1 - rate)
    out = {
        "totalCashInvested": cash_in,
        "initialPurchaseInvestment": initial_investment,
        "scenarios": rows,
        "breakevenLoanForFullCashOut": round(breakeven_loan, 2),
        "breakevenArvForFullCashOutAtAssumedLtv": round(breakeven_loan / ltv, 2),
        "breakevenArvAsMultipleOfCashInvested": round(breakeven_loan / ltv / cash_in, 4),
        "units": "USD",
    }
    json.dump(out, open(out_path, "w"), indent=2, sort_keys=True)
    print(json.dumps(out, indent=2, sort_keys=True))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
