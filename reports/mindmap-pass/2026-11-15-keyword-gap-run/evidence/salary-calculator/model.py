"""Reference model for /salary-calculator/ (calculated, pure arithmetic). annual = hourly x hours/week x weeks/year.
Run from the repo root: python3 reports/mindmap-pass/2026-11-15-keyword-gap-run/evidence/salary-calculator/model.py"""
import json, os
OUT = os.path.join(os.path.dirname(__file__), "output.json")

def to_annual(amount, period, hours=40, weeks=52, days=5):
    return {"hourly": amount * hours * weeks, "daily": amount * days * weeks, "weekly": amount * weeks, "biweekly": amount * weeks / 2,
            "semimonthly": amount * 24, "monthly": amount * 12, "annual": amount}[period]

def convert(amount, period, hours=40, weeks=52, days=5):
    a = to_annual(amount, period, hours, weeks, days)
    return dict(annual=round(a, 2), monthly=round(a / 12, 2), semimonthly=round(a / 24, 2), biweekly=round(a / (weeks / 2), 2),
                weekly=round(a / weeks, 2), daily=round(a / (days * weeks), 2), hourly=round(a / (hours * weeks), 4))

cases = {
    "default_52000": convert(52000, "annual"),
    "hourly_25_to_annual": convert(25, "hourly"),
    "monthly_5000": convert(5000, "monthly"),
    "biweekly_2000": convert(2000, "biweekly"),
    "hourly_30_37_5h": convert(30, "hourly", 37.5),
    "annual_60000_50_weeks": convert(60000, "annual", 40, 50),
    "hourly_15": convert(15, "hourly"), "hourly_20": convert(20, "hourly"), "hourly_30": convert(30, "hourly"),
    "hourly_40": convert(40, "hourly"), "hourly_50": convert(50, "hourly"),
    "annual_40000": convert(40000, "annual"), "annual_50000": convert(50000, "annual"),
    "annual_75000": convert(75000, "annual"), "annual_100000": convert(100000, "annual"),
    "biweekly_3000": convert(3000, "biweekly"), "semimonthly_4000": convert(4000, "semimonthly"),
    "annual_60000_32h_4d": convert(60000, "annual", 32, 52, 4),
}
table = [dict(hours=h, hourly=round(60000 / (h * 52), 2), hoursPerYear=h * 52) for h in (35, 37.5, 40, 45)]
assert cases["default_52000"]["hourly"] == 25.0 and cases["hourly_25_to_annual"]["annual"] == 52000.0
assert cases["monthly_5000"]["annual"] == 60000.0
json.dump({"cases": cases, "hoursTable": table}, open(OUT, "w"), indent=1)
print(json.dumps(table))
