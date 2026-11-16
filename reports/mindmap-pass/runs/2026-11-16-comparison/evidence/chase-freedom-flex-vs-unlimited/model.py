#!/usr/bin/env python3
"""Chase Freedom Flex vs Freedom Unlimited, annual cash back from published earn rates (v2).
Adds the 12.5%-of-spend break-even rule and the $48,000 total-spend ceiling (guardrail G-1).

Inputs (creditcards.chase.com captures, 2026-11-16): Flex pays 5% on the first $1,500 of combined purchases per quarter
in the activated rotating category (everything else 1%); Unlimited pays 1.5% on everything outside travel/dining/drugstores.
Both pay 5% Chase Travel and 3% dining and drugstores; those are identical, so the model leaves them out (spend assumed zero).
Assumptions: all spend S is either rotating-category spend or other spend; the category is activated; category spend
matches the quarter's category exactly (best case for Flex); no sign-up bonus; $0 annual fee.

Derivation: with quarterly category spend B (<= 1500) and other annual spend O = S - 4B:
  Flex - Unlimited = 4B*(0.05-0.015) + O*(0.01-0.015) = 0.14B - 0.005*(S-4B) = 0.16B - 0.005S
  Flex wins iff 0.16B > 0.005S  <=>  4B > 0.125*S   (annual category spend above 12.5% of total spend)
  Max B is 1500, so Flex can win only if 0.125*S < 6000, i.e. S < 48000.
"""
import json, sys

def flex(S, B, activated=True):
    cap = min(B, 1500.0)
    cat = (cap * 0.05 + (B - cap) * 0.01) * 4 if activated else B * 4 * 0.01
    other = S - 4 * B
    return cat + other * 0.01

def unlimited(S, B):
    return S * 0.015

out = {"assumptions": "see module docstring; category activated unless stated; no sign-up bonus; $0 annual fee"}

# Scenarios at $24,000 total spend
S = 24000
scen = {
    "no_category_spend": dict(S=24000, B=0),
    "category_600_per_quarter": dict(S=24000, B=600),
    "category_750_per_quarter_breakeven": dict(S=24000, B=750),
    "category_1500_per_quarter": dict(S=24000, B=1500),
    "category_1500_per_quarter_NOT_activated": dict(S=24000, B=1500, activated=False),
}
out["scenarios_24000"] = {}
for k, v in scen.items():
    act = v.get("activated", True)
    f, u = flex(v["S"], v["B"], act), unlimited(v["S"], v["B"])
    out["scenarios_24000"][k] = {"total_spend": v["S"], "category_spend_per_quarter": v["B"], "activated": act,
                                 "flex_usd": round(f, 2), "unlimited_usd": round(u, 2),
                                 "flex_minus_unlimited_usd": round(f - u, 2)}

# 12.5% rule: category-share of annual spend needed, by total spend
out["breakeven_by_total_spend"] = {}
for S in (12000, 24000, 36000, 48000, 60000):
    needed_annual = 0.125 * S
    needed_q = needed_annual / 4
    feasible = needed_q < 1500
    out["breakeven_by_total_spend"][str(S)] = {
        "category_spend_needed_annual_usd": round(needed_annual, 2),
        "category_spend_needed_per_quarter_usd": round(needed_q, 2),
        "within_1500_quarterly_cap": feasible,
        "flex_minus_unlimited_at_full_1500_per_quarter_usd": round(flex(S, 1500) - unlimited(S, 1500), 2),
    }

# $48,000 ceiling and sub-ceiling checks
out["ceiling_checks"] = {
    "S_47999_full_cap": round(flex(47999, 1500) - unlimited(47999, 1500), 4),
    "S_48000_full_cap": round(flex(48000, 1500) - unlimited(48000, 1500), 4),
    "S_60000_full_cap": round(flex(60000, 1500) - unlimited(60000, 1500), 4),
    "max_flex_advantage_usd_at_24000": round(flex(24000, 1500) - unlimited(24000, 1500), 2),
}
# Break-even table at $24,000 by quarterly category spend
out["breakeven_24000_by_quarterly_category_spend"] = {
    str(B): round(flex(24000, B) - unlimited(24000, B), 2) for B in (0, 250, 500, 750, 1000, 1250, 1500)
}
# Dining/drugstore-heavy pattern: 9,000 of 24,000 on the shared 3% categories, no rotating-category spend (both cards pay 3% there)
out["dining_drugstore_heavy_24000_no_category"] = {
    "dining_drugstore_usd": 9000, "other_usd": 15000,
    "flex_usd": round(9000 * 0.03 + 15000 * 0.01, 2),
    "unlimited_usd": round(9000 * 0.03 + 15000 * 0.015, 2),
}
out["dining_drugstore_heavy_24000_no_category"]["flex_minus_unlimited_usd"] = round(
    out["dining_drugstore_heavy_24000_no_category"]["flex_usd"] - out["dining_drugstore_heavy_24000_no_category"]["unlimited_usd"], 2)
# 60,000 full-cap check (annual cash back on comparable spend)
out["full_cap_60000"] = {"flex_usd": round(flex(60000, 1500), 2), "unlimited_usd": round(unlimited(60000, 1500), 2)}
# Counterexample: not activated
out["counterexample_not_activated_24000"] = round(flex(24000, 1500, False) - unlimited(24000, 1500), 2)
out["rule"] = "Flex beats Unlimited iff 4*B > 0.125*S with B <= 1500, so only when S < 48000"
json.dump(out, open(sys.argv[1], "w"), indent=1)
print(json.dumps(out, indent=1))
