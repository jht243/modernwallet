#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = next(p for p in Path(__file__).resolve().parents if (p / ".claude").is_dir())
DATA = json.loads((ROOT / 'reports/alternatives-daily/2026-11-28/mindmap/evidence/stripe/benchmark-inputs.json').read_text())
mode = DATA["mode"]
subject = DATA.get("subject")
items = [it for it in DATA.get("items", []) if it.get("modeled", True)]
scenarios_out = []
table_headers = ["Workload Scenario"] + [it["name"] for it in items[:5]] + ["Lowest-Cost Pick"]
table_rows = []

for sc in DATA.get("scenarios", []):
    quotes = {}
    if mode == "api-tokens":
        in_m = float(sc.get("inputTokensM", 10.0))
        out_m = float(sc.get("outputTokensM", 2.0))
        cache_ratio = float(sc.get("cacheHitRatio", 0.0))
        for it in items:
            in_rate = float(it.get("inputPer1M", 0.0))
            out_rate = float(it.get("outputPer1M", 0.0))
            c_rate = float(it["cachedInputPer1M"]) if it.get("cachedInputPer1M") is not None else in_rate
            fresh_in = in_m * (1.0 - cache_ratio)
            cached_in = in_m * cache_ratio
            monthly = round(fresh_in * in_rate + cached_in * c_rate + out_m * out_rate, 2)
            quotes[it["name"]] = {"monthlyUsd": monthly, "annualUsd": round(monthly * 12, 2)}
    else:
        seats = int(sc.get("seats", 1))
        vol = float(sc.get("monthlyVolume", 0.0))
        for it in items:
            if float(vol) == 0.0 and it.get("hasFreeTier"):
                monthly = 0.0
            else:
                base = float(it.get("baseMonthlyUsd") or 0.0)
                per_seat = float(it.get("perSeatMonthlyUsd") or 0.0)
                seat_min = int(it.get("seatMin") or 1)
                eff_seats = max(seats, seat_min) if per_seat > 0 else seats
                inc = float(it.get("includedVolume") if it.get("includedVolume") is not None else 10**9)
                over_unit = float(it.get("overageUnitSize") or 1000.0)
                over_rate = float(it.get("overageUsdPerUnit") or 0.0)
                addon = float(it.get("requiredAddonMonthlyUsd") or 0.0) if sc.get("requiresAddon") else 0.0
                extra = max(0.0, vol - inc) / over_unit
                monthly = round(base + per_seat * eff_seats + extra * over_rate + addon, 2)
            quotes[it["name"]] = {"monthlyUsd": monthly, "annualUsd": round(monthly * 12, 2), "plan": it.get("planName", "Published tier")}
    subj_m = quotes.get(subject, {}).get("monthlyUsd")
    if subj_m is not None:
        for q in quotes.values():
            diff = round(subj_m - q["monthlyUsd"], 2)
            q["savingsVsSubjectMonthlyUsd"] = diff
            q["savingsVsSubjectAnnualUsd"] = round(diff * 12, 2)
    ranked = sorted(quotes.items(), key=lambda kv: kv[1]["monthlyUsd"])
    winner = ranked[0][0] if ranked else "N/A"
    winner_usd = ranked[0][1]["monthlyUsd"] if ranked else 0.0
    scenarios_out.append({
        "scenario": sc.get("name"),
        "lowestCostVendor": winner,
        "lowestMonthlyUsd": winner_usd,
        "quotes": quotes,
    })
    row_cells = [str(sc.get("name"))] + [f"${quotes[it['name']]['monthlyUsd']:,.2f}/mo" for it in items[:5]] + [f"{winner} (${winner_usd:,.2f}/mo)"]
    table_rows.append(row_cells)

winners = [s["lowestCostVendor"] for s in scenarios_out if s.get("lowestCostVendor")]
result = {
    "mode": mode,
    "subject": subject,
    "scenarioCount": len(scenarios_out),
    "distinctScenarioWinners": list(dict.fromkeys(winners)),
    "scenarios": scenarios_out,
    "scenarioTable": {
        "caption": f"Internal {('API Token' if mode == 'api-tokens' else 'Plan & Workload')} Cost Model Across {len(scenarios_out)} Standardized Scenarios",
        "headers": table_headers,
        "rows": table_rows,
    },
}
print(json.dumps(result, indent=2))
