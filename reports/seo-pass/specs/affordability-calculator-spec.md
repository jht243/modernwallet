# Asset Spec: Personal Loan Affordability Calculator

**Prepared:** 2026-08-26 · Autocomplete keyword-gap pass (`keyword-gap-pass`, personal-loan hub) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-08-26.md`, new-content row 10 ("No income/DTI-based max-loan-size tool, distinct from credit-eligibility").

## 1. Target route/URL

`/personal-loan/affordability-calculator/`

New `SpokeEntry` under `calculator: "personal-loan"` in the (not-yet-existing) `src/data/spokes-personal-loan.ts` — see the amortization-schedule spec, section 6, for that shared file-creation dependency.

## 2. Recommended format + rationale

**Format: a new interactive calculator**, not a reuse of `PersonalLoanCalculator`.

`computePersonalLoan()` always takes `loanAmount` as a fixed input and solves *forward* for the payment — it has no reverse-solve path from "here's my income and other debts" to "here's the most I should borrow." There is no income field, no existing-debt field, and no DTI concept anywhere in `PersonalLoanInput`. This tool inverts the existing calculator's direction of solve (income/DTI → max loan amount, instead of loan amount → payment), which needs the annuity present-value formula run in reverse, not the forward payment formula the current engine uses.

**Distinct from the eligibility-calculator spec:** that tool asks "what rate might I qualify for, given my credit," and returns a qualitative approval band. This tool asks "given my income and existing debts, what's the most I should responsibly borrow at a given rate," and returns a dollar figure. They answer different questions and share no calculation logic — the chart itself charts them as two separate rows for this reason.

## 3. What the asset does

**Inputs:** gross monthly income ($), existing monthly debt payments ($ — credit cards, auto loan, existing student loans, etc.), an assumed interest rate (%, either self-entered or optionally informed by a credit-tier default if this ships after the eligibility-calculator), desired loan term (months), and a max-DTI threshold (default 36%, with an option to raise to 43% — the two widely-published consumer-lending DTI thresholds, matching the site's existing mortgage `affordability-calculator` spoke's own framing).

**Outputs:** the maximum monthly payment the reader can take on within their DTI ceiling, and the corresponding maximum personal loan amount at the entered rate/term. Secondary output: the resulting DTI% if they borrow the max amount, shown as a check against the ceiling.

**Formula:**
- `maxTotalMonthlyDebt = grossMonthlyIncome × (maxDTI% / 100)`
- `maxNewLoanPayment = maxTotalMonthlyDebt − existingMonthlyDebt` (floor at $0 — if existing debt alone already exceeds the DTI ceiling, the max loan amount is $0 and the copy should say so plainly, not show a negative number)
- **Max loan amount** is the reverse of the standard annuity formula — present value of the max affordable payment stream: `maxLoanAmount = maxNewLoanPayment × (1 − (1+r)^−n) / r`, where `r = APR/100/12` and `n = term in months`. This is exactly the `presentValue()` function already written in `src/lib/personal-loan.ts` (currently private/unexported, used internally only for the effective-APR bisection solver) — this is the one calculation in this whole six-tool batch that can literally reuse existing code rather than reimplement it, provided `presentValue()` is exported from `personal-loan.ts` or duplicated per that file's own "independent copy" convention.
- **Resulting DTI check:** `resultingDTI% = (existingMonthlyDebt + maxNewLoanPayment) / grossMonthlyIncome × 100` — by construction this equals the entered `maxDTI%` exactly (it's a sanity-check echo, not new math), useful for the UI to restate the constraint in the results.

## 4. Primary and secondary keywords

- **Primary:** "personal loan affordability calculator," "how much personal loan can I get calculator"
- **Secondary:** "personal loan calculator based on salary," "how much can I borrow personal loan calculator" — pulled directly from the chart row's raw variants: "how much can i borrow," "based on salary"

## 5. Word count / scope estimate

~750–950 words of surrounding copy: intro explaining DTI and why lenders care about it, a how-it-works section with a worked example (e.g., $6,000/month gross income, $800/month existing debt, 36% DTI ceiling → max new payment, then max loan amount at a given rate/term), 5–6 FAQs (e.g., "what counts as existing debt," "does this include rent or a mortgage," "why 36% and not 43%," "is this the same as what a lender will actually approve" — with a cross-link to the eligibility-calculator spec above for the credit-tier angle).

## 6. Technical dependencies

- **`src/lib/personal-loan-affordability.ts`** — new engine. As noted in section 3, this is the one tool in the batch that can genuinely reuse existing math: `presentValue()` in `src/lib/personal-loan.ts` already computes exactly the reverse-annuity calculation this tool needs, but it is currently unexported (module-private). Either export it from `personal-loan.ts` and import it here, or copy it (1 function, ~5 lines) per the file's existing "independent copy" convention for cross-product engines — either is a trivial dependency compared to the other five specs' new looping logic.
- **`src/components/PersonalLoanAffordabilityCalculator.tsx`** — new React island. Simpler UI than the other five specs in this batch — no schedule table, no chart, just four/five inputs and 2–3 result stats, closest in shape to the existing `PersonalLoanCalculator.tsx`'s own results panel.
- **Registration required:** add `"personal-loan-affordability": PersonalLoanAffordabilityCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`, and add `"personal-loan-affordability"` to `LIVE_IDS` in `src/data/registry.ts`.
- New `SpokeEntry` in `src/data/spokes-personal-loan.ts` (`calculator: "personal-loan"`, `slug: "affordability-calculator"`) — see section 1.
