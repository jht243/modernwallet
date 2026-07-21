# Calculator-spec backlog — podcast-pain-pass 2026-07-21

12 interactive calculators ModernWallet lacks, surfaced + SEMRUSH-validated this run and confirmed net-new by the dedup gate. These are `calculator-spec` rows: the routine does NOT auto-build interactive tools (they need a real engine in `src/lib/*` + a React island in `src/components/*` + island registration). Each entry below is the build spec. Sorted by monthly search volume (priority).

> Two emerging hubs to stand up: **`/debt/`** (5 tools, ~46k combined volume — the site has no debt hub) and consumer **`/tax/`** tools (4 tools, ~50k combined — the existing `/tax/` is IRS-debt-resolution only).

---

## 1. Rent vs Buy Calculator — /mortgage/rent-vs-buy-calculator/  · 110,000/mo
- **Format:** interactive tool. Rationale: highest-volume gap; a pure-decision query where a breakeven horizon is the answer. Existing `/compare/renting-vs-buying/` is prose only — no tool.
- **Inputs:** home price, down payment %, mortgage rate, loan term, property tax %, HOA/insurance, maintenance %, monthly rent, rent growth %, home appreciation %, investment return on the down-payment alternative, years staying, marginal tax rate, closing costs, selling costs.
- **Outputs:** breakeven year (buying beats renting after N years), cumulative cost of each path over the horizon, net-worth-after chart, verdict ("buy if staying > N years").
- **Keywords:** rent vs buy calculator (primary); is it better to rent or buy, rent vs buy breakeven.
- **Dependencies:** new engine `src/lib/rentVsBuy.ts` (opportunity-cost model incl. down-payment investment + appreciation + tax); island `RentVsBuyCalculator.tsx`; register in `src/components/islands.ts`; spoke under `/mortgage/`.

## 2. Paycheck Tax Calculator — /tax/paycheck-tax-calculator/  · 22,200/mo
- **Format:** interactive tool. Rationale: take-home-pay estimate; existing /tax hub is IRS-debt resolution, not withholding.
- **Inputs:** gross pay, pay frequency, filing status, state, pre-tax deductions (401k, HSA, health), allowances/dependents.
- **Outputs:** federal income tax withheld, Social Security + Medicare (FICA), state tax estimate, net take-home per period + annualized; effective rate.
- **Keywords:** paycheck tax calculator; take home pay calculator; paycheck calculator after taxes.
- **Dependencies:** `src/lib/paycheckTax.ts` (2026 IRS brackets + standard deduction + FICA wage base; per-state simplified); island; new `/tax/` consumer spoke. **YMYL — figures must track IRS annually.**

## 3. Credit Card Payoff Calculator — /debt/credit-card-payoff-calculator/  · 22,200/mo
- **Format:** interactive tool. Rationale: anchors a NEW /debt/ hub.
- **Inputs:** balance, APR, either (a) fixed monthly payment → months+interest, or (b) target months → required payment. Optional extra payment.
- **Outputs:** payoff months, total interest, amortization schedule, "minimum-payment vs fixed-payment" contrast.
- **Keywords:** credit card payoff calculator; how long to pay off credit card (pairs with the guide shipped this run).
- **Dependencies:** `src/lib/debtPayoff.ts` (amortization: n = -ln(1 - rB/P)/ln(1+r)); island; **create `/debt/` category hub + route.**

## 4. Capital Gains Tax Calculator — /tax/capital-gains-tax-calculator/  · 14,800/mo
- **Format:** interactive tool. Rationale: general cap-gains tool (only a rental-property spoke exists).
- **Inputs:** purchase price, sale price, holding period (ST vs LT), taxable income, filing status, state.
- **Outputs:** gain, short- vs long-term rate applied (0/15/20% + NIIT 3.8% where applicable), estimated tax, net proceeds.
- **Keywords:** capital gains tax calculator; long term capital gains tax calculator.
- **Dependencies:** `src/lib/capitalGains.ts` (2026 LTCG brackets + NIIT); island; `/tax/` spoke. **YMYL.**

## 5. Debt Payoff Calculator — /debt/debt-payoff-calculator/  · 14,800/mo
- **Format:** interactive tool. Rationale: multi-debt planner; pairs with the snowball-vs-avalanche comparison shipped this run.
- **Inputs:** list of debts (balance, APR, min payment), total monthly budget, strategy toggle (snowball | avalanche).
- **Outputs:** debt-free date, total interest, per-strategy comparison, payoff order, month-by-month schedule.
- **Keywords:** debt payoff calculator; debt snowball calculator; debt avalanche calculator.
- **Dependencies:** `src/lib/debtPlan.ts` (multi-debt waterfall, both strategies); island (repeatable-row input); `/debt/` hub.

## 6. Tax Bracket Calculator — /tax/tax-bracket-calculator/  · 6,600/mo
- **Format:** interactive tool. Rationale: marginal-vs-effective; pairs with the "how much tax will I pay" guide shipped this run.
- **Inputs:** taxable income (or gross - deductions), filing status, year.
- **Outputs:** top marginal bracket, effective rate, tax owed, bracket-by-bracket stack visual.
- **Keywords:** tax bracket calculator; what tax bracket am i in.
- **Dependencies:** `src/lib/taxBrackets.ts` (2026 IRS brackets); island; `/tax/` spoke. **YMYL.**

## 7. Roth Conversion Calculator — /tax/roth-conversion-calculator/  · 6,600/mo
- **Format:** interactive tool. Rationale: conversion tax-cost + break-even; strong retirement cross-sell.
- **Inputs:** conversion amount, current taxable income, filing status, current + expected retirement marginal rate, years to retirement, growth rate, whether tax paid from outside funds.
- **Outputs:** tax owed on conversion, bracket bump, break-even year, projected after-tax value converted vs not.
- **Keywords:** roth conversion calculator; roth conversion tax calculator.
- **Dependencies:** `src/lib/rothConversion.ts`; island; `/tax/` (or `/retirement/`) spoke. **YMYL.**

## 8. Emergency Fund Calculator — /budget/emergency-fund-calculator/  · 6,600/mo
- **Format:** interactive tool. Rationale: pairs with the "how much emergency fund" guide shipped this run.
- **Inputs:** essential monthly expenses (or itemized), months of coverage (3–6 default, adjustable), current savings, monthly contribution.
- **Outputs:** target fund size, gap to target, months-to-goal at the contribution rate.
- **Keywords:** emergency fund calculator; how much emergency fund.
- **Dependencies:** `src/lib/emergencyFund.ts` (simple); island; `/budget/` spoke.

## 9. Social Security Break-Even Calculator — /retirement/social-security-break-even-calculator/  · 4,400/mo
- **Format:** interactive tool. Rationale: claiming-age decision; only a "retirement calc with SS" spoke exists, not a claiming break-even.
- **Inputs:** estimated benefit at 62 / FRA / 70 (or PIA), claiming ages to compare, optional COLA + discount rate.
- **Outputs:** break-even age between two claiming strategies, cumulative-benefit crossover chart.
- **Keywords:** social security break even calculator; when to take social security.
- **Dependencies:** `src/lib/ssBreakEven.ts` (SSA early/delayed adjustment factors); island; `/retirement/` spoke. **YMYL.**

## 10. Student Loan Payoff Calculator — /debt/student-loan-payoff-calculator/  · 4,400/mo
- **Format:** interactive tool. Inputs: balance, APR, payment or target months, extra payment. Outputs: payoff time, total interest, extra-payment savings.
- **Keywords:** student loan payoff calculator.
- **Dependencies:** reuse `src/lib/debtPayoff.ts` (single-loan amortization); island; `/debt/` spoke.

## 11. Debt Consolidation Calculator — /debt/debt-consolidation-calculator/  · 3,600/mo
- **Format:** interactive tool. Inputs: current debts (balance/APR/payment), consolidation-loan APR + term + fees. Outputs: new payment, total interest before vs after, monthly + lifetime savings, breakeven on fees.
- **Keywords:** debt consolidation calculator.
- **Dependencies:** `src/lib/debtConsolidation.ts`; island; `/debt/` spoke.

## 12. Biweekly Mortgage Calculator — /mortgage/biweekly-mortgage-calculator/  · 1,900/mo
- **Format:** interactive tool. Inputs: loan amount, rate, term, biweekly vs monthly toggle. Outputs: payoff-time reduction, interest saved (biweekly = 13 monthly payments/yr).
- **Keywords:** biweekly mortgage calculator; biweekly mortgage payment savings.
- **Dependencies:** reuse the existing mortgage amortization engine (`/mortgage/payoff-calculator/` logic); island; `/mortgage/` spoke.

---
_These are staged as backlog only — no routes/pages were created for them this run. Build them via the standard calculator workflow (engine → island → spoke content per CONTENT.md)._
