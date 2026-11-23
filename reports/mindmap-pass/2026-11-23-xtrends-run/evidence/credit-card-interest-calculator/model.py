"""One-cycle simple interest at 24% vs 10% APR on the credit card calculator's $5,000 preset."""
import json, os
from decimal import Decimal as D, ROUND_HALF_UP
q = lambda x: str(D(x).quantize(D("0.01"), ROUND_HALF_UP))
BAL, DAYS, YEAR = D(5000), 30, 365
rows = []
for apr in (24, 10):
    rows.append({
        "apr_pct": apr,
        "cycle_interest_usd": q(BAL * apr / 100 / YEAR * DAYS),
        "flat_year_simple_interest_usd": q(BAL * apr / 100),
    })
saving = D(rows[0]["cycle_interest_usd"]) - D(rows[1]["cycle_interest_usd"])
out = {
    "assumptions": {
        "balance_usd": 5000, "cycle_days": DAYS, "day_count_basis": YEAR,
        "interest": "simple, no payment in cycle, no compounding within cycle",
        "fees_and_availability": "no new fees; card stays available at the stated APR",
    },
    "formula": "interest = balance * APR / 365 * 30",
    "cc_table": rows,
    "cycle_saving_usd": q(saving),
    "flat_year_saving_usd": q(D(rows[0]["flat_year_simple_interest_usd"]) - D(rows[1]["flat_year_simple_interest_usd"])),
    "breakeven_new_fee_per_cycle_usd": q(saving),
}
here = os.path.dirname(os.path.abspath(__file__))
json.dump(out, open(os.path.join(here, "output.json"), "w"), indent=1)
print(json.dumps(out))
