#!/usr/bin/env python3
"""Reproducible calculations for the 2026-10-27 podcast-pain run. Stdlib only.
Run: python3 reports/mindmap-pass/2026-10-27-podcast/evidence/calc.py
Writes calc-output.json beside each slug folder."""
import json, math, os
HERE = os.path.dirname(os.path.abspath(__file__))

def pmt(principal, annual_rate, years):
    r = annual_rate / 12; n = years * 12
    return principal * r / (1 - (1 + r) ** -n)

def balance_after(principal, annual_rate, years, months):
    r = annual_rate / 12; p = pmt(principal, annual_rate, years)
    return principal * (1 + r) ** months - p * (((1 + r) ** months - 1) / r)

def months_to_payoff(principal, annual_rate, payment):
    r = annual_rate / 12
    if payment <= principal * r: return None
    return math.log(payment / (payment - principal * r)) / math.log(1 + r)

# ---------- 15-year mortgage for a rental ----------
PRICE, DOWN = 400_000, 0.25
LOAN = PRICE * (1 - DOWN)
R30, R15 = 0.0732, 0.0668          # Freddie Mac PMMS, week of 2026-10-22 (primary-residence conforming averages)
OTHER = 1_000                       # ASSUMPTION: tax, insurance, repairs, management per month
VAC = 0.05                          # ASSUMPTION: vacancy/collection loss
p30, p15 = pmt(LOAN, R30, 30), pmt(LOAN, R15, 15)
tot30, tot15 = p30 * 360 - LOAN, p15 * 180 - LOAN
m_extra = months_to_payoff(LOAN, R30, p15)
extra_interest = p15 * m_extra - LOAN
def breakeven_rent(pi): return (pi + OTHER) / (1 - VAC)
sens = {}
for bump in (0.0, 0.005, 0.01):
    pi = pmt(LOAN, R15 + bump, 15)
    sens[f"15yr_rate_{(R15+bump)*100:.2f}"] = {"payment": round(pi, 2), "breakeven_rent": round(breakeven_rent(pi), 2)}
out_c = {
  "inputs": {"price": PRICE, "down_payment_pct": DOWN, "loan": LOAN, "rate_30": R30, "rate_15": R15,
             "other_monthly_costs_assumption": OTHER, "vacancy_assumption": VAC,
             "rate_source": "Freddie Mac PMMS 2026-10-22: 30-yr 7.32%, 15-yr 6.68% (primary-residence, conforming, good credit, 20% down; NOT investment-property quotes)"},
  "payment_30yr": round(p30, 2), "payment_15yr": round(p15, 2),
  "payment_difference": round(p15 - p30, 2),
  "total_interest_30yr": round(tot30, 2), "total_interest_15yr": round(tot15, 2),
  "interest_saved_by_15yr": round(tot30 - tot15, 2),
  "balance_after_5yr_30": round(balance_after(LOAN, R30, 30, 60), 2),
  "balance_after_5yr_15": round(balance_after(LOAN, R15, 15, 60), 2),
  "balance_after_10yr_30": round(balance_after(LOAN, R30, 30, 120), 2),
  "balance_after_10yr_15": round(balance_after(LOAN, R15, 15, 120), 2),
  "breakeven_rent_30yr": round(breakeven_rent(p30), 2),
  "breakeven_rent_15yr": round(breakeven_rent(p15), 2),
  "rent_example": 3_300,
  "cashflow_at_rent_3300_30yr": round(3300 * (1 - VAC) - OTHER - p30, 2),
  "cashflow_at_rent_3300_15yr": round(3300 * (1 - VAC) - OTHER - p15, 2),
  "30yr_loan_paying_15yr_payment": {"months_to_payoff": round(m_extra, 1), "years": round(m_extra / 12, 2),
                                    "total_interest": round(extra_interest, 2),
                                    "interest_vs_15yr_loan": round(extra_interest - tot15, 2)},
  "sensitivity_15yr_rate_premium_HYPOTHETICAL": sens,
  "per_100k_15yr_payment": round(pmt(100_000, R15, 15), 2),
  "per_100k_30yr_payment": round(pmt(100_000, R30, 30), 2),
}
# ---------- 401(k) 20% withholding ----------
rows = []
for gross in (50_000, 100_000, 250_000):
    w = gross * 0.20
    rows.append({"distribution": gross, "withheld_20pct": w, "received": gross - w,
                 "other_funds_needed_to_roll_over_all": w,
                 "taxable_if_withheld_amount_not_replaced": w,
                 "extra_10pct_on_that_amount_if_under_59_5_no_exception": w * 0.10})
out_b = {"source": "IRS Rollovers of retirement plan and IRA distributions (mandatory 20% withholding; 60 days); IRS early distributions (10% additional tax)",
         "scenarios": rows}
# ---------- inflation arithmetic ----------
base = 60_000
infl = {}
for i in (0.02, 0.03, 0.04):
    infl[f"{int(i*100)}pct"] = {"age_75": round(base * (1 + i) ** 10), "age_85": round(base * (1 + i) ** 20)}
out_a = {"basis": "arithmetic only: $60,000 of spending in today's dollars at age 65, grown at a constant inflation rate; not a forecast",
         "base": base, "by_inflation": infl}
for slug, o in (("15-year-mortgage-for-rental-property", out_c), ("what-to-do-with-401k-when-you-retire", out_b), ("phases-of-retirement", out_a)):
    json.dump(o, open(os.path.join(HERE, slug, "calc-output.json"), "w"), indent=2)
print(json.dumps({"c": out_c, "b": out_b, "a": out_a}, indent=1))

# ---------- credit utilization when closing a card ----------
TOTAL_LIMIT, BAL = 20_000, 4_000
util = {"before": round(BAL / TOTAL_LIMIT * 100, 1)}
for lim in (2_500, 5_000, 10_000):
    util[f"close_{lim}_limit_card_with_zero_balance"] = round(BAL / (TOTAL_LIMIT - lim) * 100, 1)
out_u = {"basis": "arithmetic only: utilization = total balances / total credit limits; no scoring model is applied; CFPB gives no score thresholds",
         "total_limit_before": TOTAL_LIMIT, "total_balance": BAL, "utilization_pct": util,
         "paydown_then_close": {"balance_after_paydown": 1_000, "close_10000_card_util_pct": round(1_000 / (TOTAL_LIMIT - 10_000) * 100, 1)}}
json.dump(out_u, open(os.path.join(HERE, "does-closing-a-credit-card-hurt-your-credit-score", "calc-output.json"), "w"), indent=2)
print(json.dumps(out_u, indent=1))
