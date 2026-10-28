"""Independent re-computation of the salary inflation calculator from the raw BLS API JSON (no TS code reused)."""
import json, glob, os
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "..", "inflation-calculator")
ann, mon = {}, {}
for f in glob.glob(os.path.join(RAW, "cpi_1*.json")) + glob.glob(os.path.join(RAW, "cpi_2*.json")):
    for r in json.load(open(f))["Results"]["series"][0]["data"]:
        if r["value"] in ("-", ""): continue
        y = int(r["year"])
        if r["period"] == "M13": ann[y] = float(r["value"])
        else: mon[(y, int(r["period"][1:]))] = float(r["value"])
latest = max(k for k in mon if k[0] == 2026)
L = mon[latest]; YA = mon[(2025, 9)]
out = {"latest_month": latest, "cpi_latest": L, "cpi_sep_2025": YA, "twelve_month_change_pct": round((L / YA - 1) * 100, 4), "scenarios": []}
def scen(salary, year, current=None):
    adj = salary * L / ann[year]
    years = latest[0] + (latest[1] - 0.5) / 12 - (year + 0.5)
    d = {"salary": salary, "year": year, "cpi_year": ann[year], "adjusted": round(adj, 2), "cumulative_pct": round((L / ann[year] - 1) * 100, 2), "years": round(years, 3)}
    if current:
        d.update(current=current, gap=round(current - adj, 2), gap_pct=round((current / adj - 1) * 100, 2),
                 real_per_year_pct=round(((current / adj) ** (1 / years) - 1) * 100, 3),
                 nominal_per_year_pct=round(((current / salary) ** (1 / years) - 1) * 100, 3),
                 keep_pace_raise=round(current * (L / YA - 1), 2))
    return d
for a in [(52000, 2010, 78000), (100000, 2000), (50000, 1996), (80000, 1990), (50000, 1990), (50000, 2000), (50000, 2010), (50000, 2020), (60000, 2020, 64000), (40000, 2025, 41000), (1, 1913)]:
    out["scenarios"].append(scen(*a))
# counterexample: a raise that beats nominal growth but not prices
out["counterexample"] = scen(60000, 2020, 64000)
out["fifty_k_by_year"] = {y: round(50000 * L / ann[y]) for y in [1970, 1980, 1985, 1995, 2005, 2015, 2019, 2022, 2024]}
out["year_over_year_pct"] = {y: round((ann[y] / ann[y - 1] - 1) * 100, 1) for y in [1979, 1980, 1981, 2009, 2019, 2020, 2021, 2022, 2023, 2024, 2025]}
out["annual_cpi"] = {y: ann[y] for y in [1970, 1980, 1985, 1995, 2005, 2008, 2009, 2015, 2019, 2021, 2022, 2024]}
print(json.dumps(out, indent=1))
