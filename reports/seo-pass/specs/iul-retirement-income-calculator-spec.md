# Asset Spec: IUL Retirement Income Calculator

**Prepared:** 2026-09-02 · Autocomplete keyword-gap pass (`autocomplete-pass-auto`, IUL seed) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-09-02.md`, new-content row 4 ("current tool only models the accumulation phase").

## 1. Target route/URL

`/iul-calculator/retirement-income-calculator/`

New `SpokeEntry` under `calculator: "iul-calculator"`, in the same not-yet-created `src/data/spokes-iul-calculator.ts` file described in the companion `iul-loan-calculator-spec.md` (Section 1) — confirmed via `src/data/spokes.ts` and `src/data/calculators.ts` that no spokes file exists for `iul-calculator` today. Both IUL spokes in this pass belong in that one new file; neither is created this pass.

## 2. Recommended format + rationale

**Format: a new interactive calculator.** The two mined queries — "iul income calculator" and "iul retirement calculator" — are tool-seeking, and describe a genuinely different life-cycle stage than the hub covers.

Confirmed against `src/lib/iul.ts`: `computeIul()` takes a single horizon, `currentAge` → `projectToAge`, funded by `annualPremium` for `yearsFunded` years, and returns one ending snapshot (`finalCashValue`, `finalSurrenderValue`, `finalBaselineBalance`). There is no concept anywhere in the file of *drawing income out* of the policy after that horizon ends — no distribution-phase loop, no withdrawal, no post-retirement loan mechanic. The hub's own copy (per `src/data/calculators.ts`) frames the policy purely as an accumulation vehicle compared against a 401(k)/brokerage baseline; it never asks "then what — how do I actually get money out of this thing every year in retirement?" That's precisely what "iul income calculator" and "iul retirement calculator" are asking.

This is a distinct feature from the companion `loan-calculator` spec: that one models a single or occasional draw at any point during accumulation; this one models a **systematic, recurring income stream** starting at a chosen retirement age and continuing for a chosen horizon — the same shape distinction the site already draws between `/investing/withdrawal-calculator/` (forward, ongoing) and a one-off loan.

## 3. What the asset computes — inputs → outputs, and the math

**Inputs:**
- Every `IulInput` field needed to run the accumulation phase (identical to the hub) through a chosen `retirementAge` (reuses `computeIul()`'s existing `currentAge`→`projectToAge` mechanic, with `projectToAge` renamed conceptually to "retirement start age" for this spoke).
- `incomeMode: "loan" | "withdrawal"` — the two real mechanics carriers pitch: **loans** (borrow against cash value, generally income-tax-free while the policy stays in force and isn't a Modified Endowment Contract — see the out-of-scope note below) or **withdrawals** (partial surrenders, tax-free up to cost basis under IRC §72(e), taxable as ordinary income above basis).
- `annualIncomeTarget` — dollars drawn each year during the income phase, either as a flat entry or (secondary UI convenience) derived as a percent of the cash value at retirement.
- `incomeYears` — how many years the income stream runs (mirrors `retirement.ts`'s existing `lifeExpectancy − retirementAge` framing already used on the retirement hub, for consistency across the site's calculators).

**Math — two phases, chained:**

1. **Accumulation phase:** call the existing `computeIul()` unmodified through `retirementAge`, exactly as the hub already does. This produces `finalCashValue`, `finalSurrenderValue`, `finalBaselineBalance` — the starting point for phase 2. No changes to `iul.ts`'s existing accumulation math.

2. **Distribution phase — new loop, run in a new function:** starting from the accumulation phase's ending cash value, continue the same crediting mechanics (participation/cap/floor on whatever return assumption the user carries into retirement — reuse `assumedIndexReturnPct`/`variableReturns`) and the same COI/admin charges (net amount at risk still shrinks the death benefit each year, using the same `corridorFactor()`), but replace "premium in" with "income out" each year:
   - **Withdrawal mode:** `cashValue_y -= annualIncomeTarget` directly (a straight partial surrender), reducing cost basis first (tax-free) and then gain (taxable) — the calculator should track and report a running cost-basis figure (`totalPremium` already computed by the accumulation phase serves as the starting basis) so the page can show how many years of withdrawals stay tax-free before crossing into taxable territory, without attempting to compute the actual tax bill (a prose-and-primary-source topic, matching `iul.ts`'s existing MEC/§7702 scope boundary).
   - **Loan mode:** identical loan sub-ledger to the companion `loan-calculator` spec (`loanBalance_y = loanBalance_{y-1} × (1+loanRate) + annualIncomeTarget`; net cash value = cash value minus loan balance), reusing that spec's `computeIulWithLoan()` machinery directly rather than re-implementing it — a systematic-loan income stream is just that function's loan ledger run every year of the income phase instead of occasionally.
   - **Lapse-during-income check:** flag the year (if any) cash value (withdrawal mode) or net cash value (loan mode) reaches zero before `incomeYears` completes — the central risk this calculator needs to surface, since a policy that runs dry mid-retirement is a materially different outcome than one that funds the full income horizon.

3. **Baseline comparison, income phase:** run the matching 401(k)/brokerage baseline (whichever `computeIul()` already produced through accumulation) through the **same** systematic withdrawal, reusing `maxSustainableWithdrawal()`/`withdrawalSchedule()` from `src/lib/investment.ts` rather than writing new drawdown logic — those functions already do exactly "given a starting balance, a return, and years, run a fixed withdrawal against it" (see their doc comments), which is precisely what's needed for the baseline side. This keeps the IUL-vs-baseline comparison the hub already establishes intact through the distribution phase, not just accumulation.

**Outputs:** year-by-year distribution-phase table (income drawn, cash/net-cash-value, remaining death benefit) for the IUL side and the baseline side; total income received over the horizon on both paths; lapse-during-income year (null if none, for either side); ending death benefit remaining (loan mode only — withdrawal mode's death benefit tracks cash value down via the corridor as usual).

## 4. Primary + secondary keywords

- **Primary:** "iul retirement calculator"
- **Secondary:** "iul income calculator" — the row's only two mined variants; both pulled verbatim from the chart's `problem` cell.

## 5. Word count / scope estimate

Matching the `SpokeEntry` shape:
- `intro`: ~120–150 words framing the accumulation-vs-distribution split the hub doesn't cover, and pointing out that "IUL income" almost always means one of two specific mechanics (loan or withdrawal), not a generic "income" feature.
- `howItWorks`: ~600–800 words — needs to cover both income modes, the cost-basis-first tax treatment of withdrawals, the loan-mode risk already detailed in the companion spec, and why the site models both against a baseline that's also drawing income (not just accumulating), so the comparison stays fair through retirement.
- `commonMistakes`: 5 items (~150–200 words) — e.g., assuming "tax-free loan income" has no downside, withdrawing past cost basis without expecting a tax bill, ignoring lapse-during-retirement risk, assuming the policy's crediting rate in retirement matches the accumulation-phase illustration.
- `workedExample`: one scenario (~100–150 words) — a policy reaching retirement age with a given cash value, drawing a chosen annual income via loan or withdrawal, showing how many years it lasts.
- `faqs`: 6–7 pairs (~300–450 words) — "how do I take income from an IUL," "is IUL retirement income really tax-free," "loan vs. withdrawal — which is better," "can my IUL run out of money in retirement," "how does this compare to a 401(k) in retirement."
- **Total copy: ~1,150–1,500 words**, consistent with the companion loan-calculator spec's scope given the shared complexity.
- Cross-link to the companion `/iul-calculator/loan-calculator/` spoke (once both exist) as `relatedSlugs`, and to `/investing/withdrawal-calculator/` for the general (non-IUL) version of the same distribution-phase question.

## 6. Technical dependencies

- **`src/lib/iul-retirement-income.ts`** — new file (keeps the distribution-phase loop out of `iul.ts` itself, matching this codebase's convention — seen in `personal-loan-payoff.ts` vs. `business-loan-payoff.ts` — of giving a materially different life-cycle stage its own file rather than growing one file's responsibilities indefinitely). Exports `computeIulRetirementIncome(input)`, which: (1) calls the existing `computeIul()` unmodified for the accumulation phase; (2) runs the new distribution-phase loop described in Section 3, reusing the companion spec's `computeIulWithLoan()` loan ledger for loan mode; (3) calls `maxSustainableWithdrawal()`/`withdrawalSchedule()` from `src/lib/investment.ts` for the baseline side.
- **`src/components/IulRetirementIncomeCalculator.tsx`** — new React island; UI needs a mode toggle (loan/withdrawal) and a two-phase result view (accumulation summary, then distribution-phase year-by-year table), closest existing precedent being the hub's own IUL-vs-baseline layout plus `WithdrawalReverseCalculator.tsx`'s schedule-table pattern for the drawdown side.
- **Registration:** add `"iul-retirement-income-calculator": IulRetirementIncomeCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`; the new `SpokeEntry` needs `islandId: "iul-retirement-income-calculator"` set explicitly (same override mechanism as the companion spec).
- **`LIVE_IDS` in `src/data/registry.ts`:** no change needed — ships under the existing `"iul-calculator"` hub.
- Depends on the companion `iul-loan-calculator-spec.md`'s `computeIulWithLoan()` existing first (or being built alongside it) for loan-mode income; withdrawal mode has no such dependency and could ship independently if the two specs are built out of order.
- Same `src/data/spokes-iul-calculator.ts` creation dependency as the companion spec (Section 1) — not created this pass.
