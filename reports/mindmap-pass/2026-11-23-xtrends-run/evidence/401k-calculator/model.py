"""Market-drop arithmetic for the 401(k) calculator enrichment (hypothetical balance, no contributions)."""
import json, math, os
from decimal import Decimal as D, ROUND_HALF_UP
q = lambda x: str(D(x).quantize(D("0.01"), ROUND_HALF_UP))
BAL, RET = D(100000), 7  # RET: the 401k calculator page preset annual return, percent
rows = []
for d in (10, 20, 30):
    after = BAL * (100 - d) / 100
    gain = D(d) / (100 - d) * 100
    yrs = math.log(100 / (100 - d)) / math.log(1 + RET / 100)
    rows.append({
        "drop_pct": d,
        "balance_after_usd": q(after),
        "loss_usd": q(BAL - after),
        "gain_needed_to_recover_pct": q(gain),
        "years_to_recover_at_7pct_no_contributions": f"{yrs:.1f}",
    })
out = {
    "assumptions": {
        "hypothetical_starting_balance_usd": 100000,
        "return_after_drop_pct_per_year": RET,
        "contributions_during_recovery": "ignored",
        "fees_taxes_inflation": "ignored",
    },
    "formula": "balance_after = start*(1-d); gain_needed = d/(1-d); years = ln(1/(1-d))/ln(1+r)",
    "drop_table": rows,
}
here = os.path.dirname(os.path.abspath(__file__))
json.dump(out, open(os.path.join(here, "output.json"), "w"), indent=1)
print(json.dumps(out))
