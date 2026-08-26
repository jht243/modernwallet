# Asset Spec: Personal Loan Payoff Calculator

**Prepared:** 2026-08-26 · Autocomplete keyword-gap pass (`keyword-gap-pass`, personal-loan hub) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-08-26.md`, new-content row 7 ("No payoff-date / interest-saved tool for personal loans").

## 1. Target route/URL

`/personal-loan/payoff-calculator/`

New `SpokeEntry` under `calculator: "personal-loan"` in a new `src/data/spokes-personal-loan.ts` (see amortization-schedule spec, section 6, for the same file-creation dependency — shared across all six personal-loan spoke specs in this batch).

## 2. Recommended format + rationale

**Format: a new interactive calculator**, not a reuse of `PersonalLoanCalculator`.

`computePersonalLoan()` in `src/lib/personal-loan.ts` has no concept of "extra payment," "remaining balance mid-loan," or a comparison scenario at all — it takes exactly four inputs (`loanAmount`, `interestRatePct`, `loanTermMonths`, `originationFeePct`) and returns one static payment/APR outcome for the full original term. There is nothing in that file that models paying faster than the scheduled payment, and no baseline-vs-scenario comparison logic exists anywhere in the component (`PersonalLoanCalculator.tsx` renders a single result set, not two side-by-side outcomes). A payoff-date tool needs to run the amortization loop twice — once at the original scheduled payment (baseline) and once with an accelerated payment (scenario) — and diff the two, which is new looping/comparison logic the current engine cannot produce from its inputs.

## 3. What the asset does

**Inputs:** current loan balance ($) — supports someone mid-loan, not just a new loan — original/current interest rate (%), remaining term in months OR current scheduled monthly payment, and one of two entry modes: (a) an extra monthly amount to add, or (b) a target payoff date, which the tool reverse-solves into the required extra payment.

**Outputs:** new payoff date (vs. the original scheduled payoff date), total interest paid under the accelerated plan vs. the baseline (minimum-scheduled-payment) plan, dollar amount of interest saved, and months shaved off the term.

**Formula:**
- **Baseline schedule:** amortize `balance` at `r = APR/100/12` over the entered `remainingTermMonths` using the standard annuity payment `M = balance · r · (1+r)^n / ((1+r)^n − 1)`; total baseline interest = `M × n − balance`.
- **Accelerated scenario (forward mode — extra amount given):** loop month by month with `payment = M + extraMonthly`: `interest_t = balance_{t-1} × r`; `principal_t = payment − interest_t`; `balance_t = balance_{t-1} − principal_t`; stop when `balance_t ≤ 0` (clamp the final principal payment to the remaining balance). Count months to reach zero = new payoff term. Sum `interest_t` across the loop = scenario total interest.
- **Reverse mode (target date given):** solve for the constant `extraMonthly` such that the accelerated loop above reaches `balance ≤ 0` at exactly the target month count. Since total interest paid is monotonically decreasing in payment size, this is solvable by bisection on `extraMonthly` (same bisection pattern as `solveEffectiveApr()` in `personal-loan.ts`: run the loop at a trial extra-payment value, check whether it pays off before/after/at the target month, narrow the bracket, repeat ~40–60 iterations).
- **Interest saved** = baseline total interest − scenario total interest. **Months saved** = baseline `n` − scenario payoff month count.

## 4. Primary and secondary keywords

- **Primary:** "personal loan payoff calculator"
- **Secondary:** "pay off personal loan early calculator," "early payoff calculator personal loan," "personal loan early payoff calculator" — pulled directly from the chart row's raw variants: "payoff," "pay off early," "early payoff"

## 5. Word count / scope estimate

~700–900 words of surrounding copy: intro framing the "should I pay off my personal loan early" question, a how-it-works section walking through one worked example (e.g., a $15,000/12.5%/48-month loan with a $50/month extra payment), 5–6 FAQs (e.g., "is there a prepayment penalty," "does paying extra always go to principal," "should I pay off a personal loan early or invest the difference" — mirrors the existing mortgage `early-payoff-calculator` spoke's comparison-FAQ pattern noted in the chart's body-text rows). Cross-link to the extra-payment-calculator spec below for readers who want biweekly/recurring modeling instead of a single extra amount.

## 6. Technical dependencies

- **`src/lib/personal-loan-payoff.ts`** — new engine. `src/lib/business-loan-payoff.ts` is an almost exact structural template for this: it already implements a scheduled-payment baseline, an `extraMonthlyPayment` forward mode, a `targetPayoffMonths` reverse mode solving for `requiredExtraForTarget`, a full `schedule: AmortRow[]`, and `interestSaved`/`monthsSaved` outputs — precisely the shape this spec needs. Its own header comment states it is "kept as an independent copy" of the shared amortization pattern (matching `auto-loan.ts`) specifically so a change to one product's engine never silently affects another's — so `personal-loan-payoff.ts` should follow the same convention: read `business-loan-payoff.ts` as the reference, then write an independent copy adapted for the personal-loan naming/inputs (no cross-import).
- **`src/components/PersonalLoanPayoffCalculator.tsx`** — new React island rendering a baseline-vs-scenario comparison (two payoff dates, two interest totals side by side) plus a mode toggle (extra-amount vs. target-date).
- **Registration required:** add `"personal-loan-payoff": PersonalLoanPayoffCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`, and add `"personal-loan-payoff"` to `LIVE_IDS` in `src/data/registry.ts`.
- New `SpokeEntry` in `src/data/spokes-personal-loan.ts` (`calculator: "personal-loan"`, `slug: "payoff-calculator"`) — see section 1.
