#!/usr/bin/env python3
"""Annual cash back: Chase Freedom Flex vs Freedom Unlimited, from published earn rates.
Inputs (chase.com captures, 2026-11-16): Flex 5% on first $1,500/quarter in activated bonus categories (4% on top of 1%),
5% Chase Travel, 3% dining+drugstores, 1% other. Unlimited 5% Chase Travel, 3% dining+drugstores, 1.5% other.
Bonus-category spend is assumed to fully match the rotating category (best case for Flex). Both annual fees $0."""
import json, sys
def flex(travel, dd, bonus_q, other, activate=True):
    bonus_total = 0.0
    if activate:
        capped = min(bonus_q, 1500) * 4  # per quarter
        bonus_total = capped * 0.05 + (bonus_q - capped / 1) * 0 if False else 0
    # per-year, bonus_q = spend per quarter in the rotating category
    cap = min(bonus_q, 1500.0)
    bonus = (cap * 0.05 + (bonus_q - cap) * 0.01) * 4 if activate else bonus_q * 4 * 0.01
    return travel*0.05 + dd*0.03 + bonus + other*0.01
def unlimited(travel, dd, bonus_q, other):
    return travel*0.05 + dd*0.03 + bonus_q*4*0.015 + other*0.015
scen = {
 "no_bonus_category_spend_all_other": dict(travel=0, dd=0, bonus_q=0, other=24000),
 "bonus_1500_per_quarter_activated": dict(travel=0, dd=0, bonus_q=1500, other=18000),
 "bonus_600_per_quarter_activated": dict(travel=0, dd=0, bonus_q=600, other=21600),
 "bonus_1500_per_quarter_NOT_activated": dict(travel=0, dd=0, bonus_q=1500, other=18000, activate=False),
 "dining_drugstore_heavy_no_bonus": dict(travel=0, dd=9000, bonus_q=0, other=15000),
}
out = {}
for k, v in scen.items():
    act = v.pop("activate", True)
    f = flex(activate=act, **v); u = unlimited(**v)
    out[k] = {"inputs": {**v, "activated": act}, "flex_usd": round(f, 2), "unlimited_usd": round(u, 2), "flex_minus_unlimited_usd": round(f - u, 2)}
# break-even: quarterly bonus spend B (<=1500, activated) with other spend O=S-4B: Flex-Unlimited = 4*B*(0.05-0.015) + O*(0.01-0.015)
S = 24000
be = {}
for B in (0, 250, 500, 750, 1000, 1250, 1500):
    O = S - 4*B
    be[str(B)] = round(4*B*0.035 - O*0.005, 2)
out["breakeven_total_24000_by_quarterly_bonus_spend"] = be
out["breakeven_quarterly_bonus_spend_usd"] = round((S*0.005)/(4*0.035+4*0.005), 2)  # 4B*.035 = (S-4B)*.005
json.dump(out, open(sys.argv[1], "w"), indent=1)
print(json.dumps(out, indent=1))
