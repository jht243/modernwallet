#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = next(p for p in Path(__file__).resolve().parents if (p / ".claude").is_dir())
DATA = json.loads((ROOT / 'reports/alternatives-daily/2026-11-28/mindmap/research/sources/expensify-vendors.json').read_text())
subject_name = DATA.get("subject")
scenarios_out = []
for sc in DATA.get("scenarios", []):
    seats = sc.get("seats", 1)
    volume = sc.get("monthlyVolume", 0)
    quotes = {}
    for v in DATA.get("vendors", []):
        if not v.get("modeled", True):
            continue
        one_time = float(v.get("oneTimeUsd", 0.0) or 0.0)
        base = float(v.get("baseMonthlyUsd", 0.0) or 0.0)
        per_seat = float(v.get("perSeatMonthlyUsd", 0.0) or 0.0)
        inc_vol = float(v.get("includedVolume", 10**9) or 10**9)
        over_unit = float(v.get("overageUnitSize", 1000.0) or 1000.0)
        over_rate = float(v.get("overageUsdPerUnit", 0.0) or 0.0)
        addon = float(v.get("requiredAddonMonthlyUsd", 0.0) or 0.0) if sc.get("requiresAddon") else 0.0
        extra_units = max(0.0, volume - inc_vol) / over_unit
        monthly_rec = round(base + per_seat * seats + extra_units * over_rate + addon, 2)
        upfront_total = round(one_time * seats, 2)
        first_year = round(upfront_total + monthly_rec * 12, 2)
        eff_monthly = round(first_year / 12.0, 2) if one_time > 0 and monthly_rec == 0 else monthly_rec
        q_entry = {
            "monthlyUsd": eff_monthly,
            "annualUsd": first_year,
            "unitOverageUsd": round(over_rate / over_unit, 4) if over_rate else 0.0,
            "plan": v.get("planName", "Published tier"),
        }
        if one_time > 0:
            q_entry["oneTimeUnitUsd"] = one_time
            q_entry["upfrontTotalUsd"] = upfront_total
            q_entry["recurringMonthlyUsd"] = monthly_rec
        quotes[v["name"]] = q_entry
    subj_q = quotes.get(subject_name, {})
    subj_m = subj_q.get("monthlyUsd")
    subj_a = subj_q.get("annualUsd")
    if subj_m is not None:
        for q in quotes.values():
            diff_m = round(subj_m - q["monthlyUsd"], 2)
            diff_a = round(subj_a - q["annualUsd"], 2) if subj_a is not None else round(diff_m * 12, 2)
            q["savingsVsSubjectMonthlyUsd"] = diff_m
            q["savingsVsSubjectAnnualUsd"] = diff_a
    ranked = sorted(quotes.items(), key=lambda kv: kv[1]["annualUsd"])
    scenarios_out.append({
        "scenario": sc.get("name"),
        "seats": seats,
        "monthlyVolume": volume,
        "requiresAddon": bool(sc.get("requiresAddon")),
        "lowestCostVendor": ranked[0][0] if ranked else None,
        "lowestMonthlyUsd": ranked[0][1]["monthlyUsd"] if ranked else None,
        "lowestAnnualUsd": ranked[0][1]["annualUsd"] if ranked else None,
        "quotes": quotes,
    })
result = {"subject": subject_name, "scenarioCount": len(scenarios_out), "scenarios": scenarios_out}
print(json.dumps(result, indent=2))
