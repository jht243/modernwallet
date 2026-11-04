#!/usr/bin/env python3
"""Tax-loss harvesting worked arithmetic (calculated, deterministic). Usage: run.py INPUTS.json OUTPUT.json"""
import json, sys

def main(inp_path, out_path):
    i = json.load(open(inp_path))
    s, f = i["scenario"], i["sourceFigures"]
    loss = s["harvestedLossAgainstLongTermGains"]
    offset = {f"{int(r*100)}pct": round(loss * r, 2) for r in f["longTermRates"]}
    net = s["netLossOnlyYearHarvestedLoss"]
    limit = f["netCapitalLossDeductionLimit"]
    deduct = min(limit, net)
    carry = net - deduct
    d = s["deferralExample"]
    realized_loss = d["basis"] - d["salePrice"]
    new_basis = d["salePrice"]
    later_gain = d["laterSalePrice"] - new_basis
    w = f["washSaleExample"]
    disallowed = w["originalCost"] - w["salePrice"]
    out = {
        "federalTaxSavedOnTenThousandDollarLossAgainstLongTermGains": offset,
        "netLossYear": {"netLoss": net, "deductibleAgainstOtherIncome": deduct, "carriedForward": carry,
                        "marriedFilingSeparatelyDeductible": min(f["netCapitalLossDeductionLimitMarriedFilingSeparately"], net)},
        "deferral": {"realizedLoss": realized_loss, "newBasis": new_basis, "gainIfLaterSoldAtOriginalPrice": later_gain,
                     "gainEqualsHarvestedLoss": later_gain == realized_loss},
        "washSaleIrsExample": {"disallowedLoss": disallowed, "newBasis": w["repurchaseCost"] + disallowed},
        "zeroRateMaxTaxableIncome2026": f["zeroRateMaxTaxableIncome2026"],
        "units": "USD"
    }
    json.dump(out, open(out_path, "w"), indent=2, sort_keys=True)
    print(json.dumps(out, indent=2, sort_keys=True))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
