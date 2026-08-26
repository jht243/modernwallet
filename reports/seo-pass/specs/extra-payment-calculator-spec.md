# Asset Spec: Personal Loan Extra Payment Calculator

**Prepared:** 2026-08-26 · Autocomplete keyword-gap pass (`keyword-gap-pass`, personal-loan hub) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-08-26.md`, new-content row 8 ("No extra/biweekly-payment modeler for personal loans").

## 1. Target route/URL

`/personal-loan/extra-payment-calculator/`

New `SpokeEntry` under `calculator: "personal-loan"` in the (not-yet-existing) `src/data/spokes-personal-loan.ts` — see the amortization-schedule spec, section 6, for that shared file-creation dependency.

## 2. Recommended format + rationale

**Format: a new interactive calculator**, not a reuse of `PersonalLoanCalculator`.

`computePersonalLoan()` has no payment-cadence concept at all — it assumes exactly one fixed monthly payment for the full term and has no input for an extra amount, a payment frequency, or a recurring vs. one-time distinction. This tool needs to model several distinct payment-pattern *types* against a baseline (recurring monthly extra, one-time lump-sum extra applied in a chosen month, biweekly-instead-of-monthly cadence, and quarterly extra), which is a materially different input shape from the current engine's four scalar fields. Note the intentional scope split from the sibling `payoff-calculator` spec: that tool takes one extra-amount number (or a target date) and reports a payoff date; this tool is the flexible modeler that lets a reader compare *multiple payment-pattern types* side by side against the same baseline schedule — the two are complementary, not duplicates, matching the chart's own separation of the "payoff/pay off early" query cluster from the "additional payments/biweekly/quarterly" cluster.

## 3. What the asset does

**Inputs:** loan balance ($), interest rate (%), remaining term (months), and a repeatable extra-payment pattern selector: (a) recurring monthly extra amount, (b) one-time lump sum + the month it's applied, (c) biweekly payment instead of monthly, (d) recurring quarterly extra amount. A reader can combine more than one pattern in a single run (e.g., biweekly cadence + an annual bonus lump sum).

**Outputs:** side-by-side schedule comparison — baseline (scheduled payment only) vs. scenario (with the chosen extra-payment pattern) — showing new payoff date, total interest under each, interest saved, and months saved.

**Formula:**
- **Baseline:** identical closed-form annuity payment and full-term amortization loop as the payoff-calculator spec (`M = balance · r · (1+r)^n / ((1+r)^n − 1)`, then loop to build `baselineInterest` and `baselineMonths = n`).
- **Recurring monthly extra (a):** identical loop to the payoff-calculator's forward mode — `payment = M + extraMonthly` every month.
- **One-time lump sum (b):** run the standard loop with `payment = M`, except in the specified month subtract the lump sum directly from `balance` after that month's regular principal/interest split is applied (before computing next month's interest). This is a single-period balance reduction, not a payment-size change.
- **Biweekly-instead-of-monthly (c):** the standard "biweekly acceleration" mechanism — a biweekly payment of `M / 2` is made every 14 days, which produces 26 half-payments/year = 13 full monthly-equivalent payments/year (one extra full payment annually) instead of 12. Model this with a **daily-simple-interest accrual loop**: track the current balance and the date of the last payment; on each biweekly payment date, accrued interest = `balance × (APR/100/365) × daysSinceLastPayment`; principal portion = `(M/2) − accruedInterest`; `balance −= principal`; repeat until `balance ≤ 0`. This is more accurate than the common "just add one extra monthly payment per year" shortcut because it correctly captures the compounding benefit of paying down principal every 14 days instead of every 30, and should be labeled as such in the page copy so the number doesn't quietly disagree with cruder biweekly calculators elsewhere.
- **Quarterly extra (d):** same mechanism as (a) but the extra amount is applied once every 3rd month instead of every month: in months where `month % 3 === 0`, `payment = M + extraQuarterly`; otherwise `payment = M`.
- **Interest saved / months saved:** same diff-against-baseline calculation used in the payoff-calculator spec, computed per selected pattern (or per combination, if patterns are stacked).

## 4. Primary and secondary keywords

- **Primary:** "personal loan extra payment calculator"
- **Secondary:** "personal loan biweekly payment calculator," "additional payment calculator personal loan," "quarterly payment calculator personal loan" — pulled directly from the chart row's raw variants: "additional payments," "biweekly," "extra payments," "quarterly payments"

## 5. Word count / scope estimate

~800–1,000 words of surrounding copy: intro explaining the different ways to pay a loan down faster, a how-it-works section covering the biweekly-acceleration mechanism specifically (since it's the least intuitive of the four patterns and worth a dedicated worked example), 6–7 FAQs (e.g., "does my lender apply extra payments to principal automatically," "is biweekly really better than one extra monthly payment," "can I combine an extra payment with a lump-sum bonus"). Slightly larger scope than the amortization-schedule and payoff-calculator specs because four distinct payment patterns each need at least a sentence of explanation.

## 6. Technical dependencies

- **`src/lib/personal-loan-extra-payment.ts`** — new engine. As with the payoff-calculator spec, `src/lib/business-loan-payoff.ts` is the closest structural precedent for the baseline/scenario/schedule shape, but this engine needs to go further: it must support the daily-simple-interest biweekly loop described above (a genuinely new accrual mechanism — every other engine in this codebase, including `business-loan-payoff.ts` and `personal-loan.ts`, accrues interest monthly, not on a rolling daily/date basis) plus a lump-sum-in-month-N branch and a modulo-3 quarterly branch. This is the most complex of the six specs in this batch from an engineering-logic standpoint.
- **`src/components/PersonalLoanExtraPaymentCalculator.tsx`** — new React island with a pattern-type selector (radio/tabs for the four modes) and a baseline-vs-scenario comparison view, structurally similar to the payoff-calculator's component but with the added pattern-selector UI.
- **Registration required:** add `"personal-loan-extra-payment": PersonalLoanExtraPaymentCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`, and add `"personal-loan-extra-payment"` to `LIVE_IDS` in `src/data/registry.ts`.
- New `SpokeEntry` in `src/data/spokes-personal-loan.ts` (`calculator: "personal-loan"`, `slug: "extra-payment-calculator"`) — see section 1.
