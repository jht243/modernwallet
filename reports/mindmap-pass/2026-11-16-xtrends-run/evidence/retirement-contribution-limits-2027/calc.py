#!/usr/bin/env python3
"""Per-pay-period arithmetic for 2027 retirement deferral limits.
Inputs are IRS figures (IR-2026-136, Notice 2026-66). Deterministic, no randomness."""
import json, sys
from decimal import Decimal, ROUND_HALF_UP

inp = json.load(open(sys.argv[1]))
out_path = sys.argv[2]
c = lambda x: Decimal(str(x)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

base = Decimal(inp["deferral_limit_2027"])
cu50 = Decimal(inp["catchup_50_2027"])
cu6063 = Decimal(inp["catchup_60_63_2027"])
totals = {
    "under_50": base,
    "age_50_plus": base + cu50,
    "age_60_to_63": base + cu6063,
}
deltas_vs_2026 = {
    "deferral": base - Decimal(inp["deferral_limit_2026"]),
    "catchup_50": cu50 - Decimal(inp["catchup_50_2026"]),
    "catchup_60_63": cu6063 - Decimal(inp["catchup_60_63_2026"]),
    "total_60_63": totals["age_60_to_63"] - (Decimal(inp["deferral_limit_2026"]) + Decimal(inp["catchup_60_63_2026"])),
}
schedules = {"biweekly_26": 26, "semimonthly_24": 24, "monthly_12": 12, "weekly_52": 52, "biweekly_27_paychecks": 27}
per_period = {
    grp: {name: str(c(tot / n)) for name, n in schedules.items()}
    for grp, tot in totals.items()
}
res = {
    "units": "US dollars per calendar year (totals) and per pay period (schedules)",
    "totals_2027": {k: str(v) for k, v in totals.items()},
    "deltas_vs_2026": {k: str(v) for k, v in deltas_vs_2026.items()},
    "per_period": per_period,
    "counterexample": "A worker paid every other Friday can receive 27 paychecks in a calendar year; the 26-period figure then overshoots the cap by one paycheck, and the 27-period figure applies.",
}
json.dump(res, open(out_path, "w"), indent=2, sort_keys=True)
print(json.dumps(res, indent=2, sort_keys=True))
