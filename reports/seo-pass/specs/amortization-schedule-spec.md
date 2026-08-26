# Asset Spec: Personal Loan Amortization Schedule Calculator

**Prepared:** 2026-08-26 · Autocomplete keyword-gap pass (`keyword-gap-pass`, personal-loan hub) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-08-26.md`, new-content row 6 ("No month-by-month amortization view for personal loans").

## 1. Target route/URL

`/personal-loan/amortization-schedule/`

New `SpokeEntry` under `calculator: "personal-loan"`. No `spokes-personal-loan.ts` file exists yet in `src/data/` — this would be the first spoke under the personal-loan hub, so it also requires creating that file and wiring it into the `SPOKES` aggregator in `src/data/spokes.ts` (currently 13 spoke-file imports; personal-loan is not among them).

## 2. Recommended format + rationale

**Format: a new interactive calculator**, not a reuse of the existing `PersonalLoanCalculator` island.

`src/components/PersonalLoanCalculator.tsx` calls `computePersonalLoan()` in `src/lib/personal-loan.ts`, which returns only seven aggregate scalars for the whole loan — `monthlyPayment`, `totalRepaid`, `totalInterest`, `originationFeeAmount`, `amountReceived`, `totalCostOfBorrowing`, `effectiveAprPct`. There is no month-by-month loop anywhere in that file: `monthlyPaymentFor()` computes a single payment via the closed-form annuity formula, and `presentValue()` / `solveEffectiveApr()` exist only to back-solve the effective APR by bisection. None of these functions retain a running balance or a per-period principal/interest split, and the component renders no schedule table or chart — just five summary stats and an APR callout box. A month-by-month amortization schedule with a payoff chart is a genuinely different data shape (an array of N rows, not seven numbers) and requires a new loop-based engine, not a parameter change to the existing one.

16 raw autocomplete variants target this specifically ("amortization schedule," "EMI," loan-tenure-in-months phrasing), confirming real demand for the row-by-row breakdown, not just the aggregate totals the current tool already shows.

## 3. What the asset does

**Inputs:** loan amount ($), interest rate / APR (%), loan term (months, matching the existing 24/36/48/60/72/84 `TERM_OPTIONS` pattern), optional origination fee (%) for consistency with the hub's existing fee-aware framing.

**Outputs:** a full month-by-month table (month #, payment, principal portion, interest portion, remaining balance) plus a payoff-progress chart (cumulative principal paid vs. cumulative interest paid over the term, or a remaining-balance line) and the same top-line summary stats the hub already shows (monthly payment, total interest, total repaid).

**Formula (standard fully-amortizing schedule):**
- Monthly rate `r = APR / 100 / 12`
- Fixed payment `M = P · r · (1+r)^n / ((1+r)^n − 1)` (same annuity formula as `monthlyPaymentFor()` in `personal-loan.ts` — this part CAN be reused/imported once exported)
- For each month `t = 1…n`, starting from `balance₀ = P`:
  - `interest_t = balance_{t-1} × r`
  - `principal_t = M − interest_t`
  - `balance_t = balance_{t-1} − principal_t`
- On the final month, clamp `principal_n = balance_{n-1}` and `payment_n = principal_n + interest_n` to absorb rounding drift so the schedule ends at exactly $0.00.
- Running totals: `cumulativeInterest_t = Σ interest_1..t`, `cumulativePrincipal_t = Σ principal_1..t` — these two series drive the payoff chart.

## 4. Primary and secondary keywords

- **Primary:** "personal loan amortization schedule," "personal loan amortization calculator"
- **Secondary:** "personal loan calculator with amortization schedule," "personal loan EMI schedule," "loan tenure calculator" (from the "tenure in months" variant cluster), "personal loan payment schedule calculator"

## 5. Word count / scope estimate

~700–900 words of surrounding copy (intro explaining what an amortization schedule shows and why the principal/interest split shifts over time, a how-it-works section walking through one worked month, 5–7 FAQs — e.g. "why does more of my payment go to interest early on," "can I download this schedule," "does extra payment change this schedule" with a cross-link to the extra-payment-calculator spec below). Matches the scope of the existing `personal-loan` hub's own copy (~650 words) and other single-purpose spokes like `factor-rate-calculator`.

## 6. Technical dependencies

- **`src/lib/personal-loan-amortization.ts`** — new engine exporting a function that returns the full row array (not just totals), e.g. `computeAmortizationSchedule(input): AmortizationRow[]`. Should reuse the existing `monthlyPaymentFor()` logic from `personal-loan.ts` (currently private to that file — would need exporting, or a small duplicated copy per that file's own stated pattern of "kept as an independent copy ... rather than importing," so a duplicated copy is consistent with existing repo convention).
- **`src/components/PersonalLoanAmortizationCalculator.tsx`** — new React island. Needs a scrollable/paginated table component (new UI pattern for this codebase's calculators — nothing currently renders a >12-row table) plus a simple SVG or canvas-based line/area chart for the payoff visualization (no charting library is currently imported anywhere in `src/components/`, per the file list scanned for this spec — confirm before adding a dependency; a hand-rolled inline SVG area chart is the lowest-dependency option and matches this codebase's no-external-chart-lib pattern).
- **Registration required:** add `"personal-loan-amortization-schedule": PersonalLoanAmortizationCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`, and add `"personal-loan-amortization-schedule"` to `LIVE_IDS` in `src/data/registry.ts`.
- **New `src/data/spokes-personal-loan.ts`** (does not exist yet) with a `SpokeEntry` for `calculator: "personal-loan"`, `slug: "amortization-schedule"`, imported into `src/data/spokes.ts`'s `SPOKES` array alongside the other 13 spoke files.
