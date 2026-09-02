# Asset Spec: IUL Loan Calculator

**Prepared:** 2026-09-02 · Autocomplete keyword-gap pass (`autocomplete-pass-auto`, IUL seed) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-09-02.md`, new-content row 3 ("the current engine does not model a policy loan explicitly").

## 1. Target route/URL

`/iul-calculator/loan-calculator/`

New `SpokeEntry` under `calculator: "iul-calculator"`. **No spokes file for `iul-calculator` exists today** — confirmed by reading `src/data/spokes.ts` (its `SPOKES` aggregator imports nine `spokes-*.ts` files; none is IUL) and by `src/data/calculators.ts` line 1229, where `iul-calculator` is registered only as a `CalculatorDef` hub with no matching spoke array. A human building this spec would need to: (1) create `src/data/spokes-iul-calculator.ts` exporting `IUL_CALCULATOR_SPOKES: SpokeEntry[]`, (2) import and spread it into `SPOKES` in `src/data/spokes.ts`, and (3) add this row plus the retirement-income-calculator spoke (companion spec) as its first two entries. Neither of those two steps is done in this pass — this spec is the only artifact this pass produces for this route.

## 2. Recommended format + rationale

**Format: a new interactive calculator**, not a guide. The query is a single, clean tool-seeking term — "iul loan calculator" — structurally identical to the "iul income/retirement calculator" cluster in the next row: someone who already understands the general IUL pitch wants to model a specific mechanic the hub doesn't cover.

Confirmed against `src/lib/iul.ts`: the file's own header explicitly scopes policy loans OUT of `computeIul()` — "Tax treatment beyond the baseline's `taxRatePct` is out of scope: no MEC status, no section 7702 premium limits, **no policy-loan taxation**. Those are prose-and-primary-source topics." The engine has no loan balance, no loan interest rate, and no net-of-loan cash value or death benefit anywhere in `IulInput`/`IulResult`. This is a genuine, deliberately-scoped-out gap, not an oversight — and it's exactly the feature the query cluster is asking for.

## 3. What the asset computes — inputs → outputs, and the math

**Inputs (extends `IulInput` from `src/lib/iul.ts`):**
- Every existing `IulInput` field (premium, death benefit, cap/participation/floor, COI schedule, charges, baseline) — the loan calculator is the accumulation engine plus a loan layer, not a replacement for it.
- `loanStartYear` — the policy year the loan begins (loans are typically taken well after the surrender-charge period, once cash value has built up).
- `annualLoanDraw` — dollars borrowed against the policy each year from `loanStartYear` onward (a one-time draw is `annualLoanDraw` entered for a single year with 0 afterward; a systematic draw repeats it).
- `loanInterestRatePct` — the rate the carrier charges on the outstanding loan balance, compounding annually if unpaid (the realistic case — most IUL policy loans are never repaid in cash).
- `loanType: "wash" | "standard"` — the two real carrier mechanics: on a **wash loan** (also called a "participating" loan on some products), the loaned portion of cash value keeps earning the policy's normal indexed crediting rate, so the loan interest charged and the credited interest received roughly offset (a "wash") — net cost is near zero in an average year. On a **standard loan**, the carrier moves the collateral amount for the loaned portion out of the indexed account into a fixed low-rate account (or simply stops crediting it), so the loan carries a real, uncompensated drag equal to `loanInterestRatePct` minus whatever that fixed segment still credits (model as 0% credited on the loaned collateral for a conservative default, clearly labeled as a carrier-specific assumption).

**Math — build as a new function, not a rewrite of `computeIul()`:**

Run the identical year-by-year loop `computeIul()` already implements (premium in, load off, participation/cap/floor crediting, COI on net-amount-at-risk via the existing `corridorFactor()`, admin fee, surrender-charge grading) — that mechanic doesn't change. Layer a loan sub-ledger on top, updated inside the same loop:

- `loanBalance_y = loanBalance_{y-1} × (1 + loanInterestRatePct/100) + newDraw_y` (draws add to principal; unpaid interest capitalizes — this is the realistic path a marketing illustration skips).
- **Wash loan:** cash value continues crediting on its *full* balance exactly as `computeIul()` already computes it (no adjustment) — the offsetting cost lives entirely in the loan-balance side, not in reduced crediting.
- **Standard loan:** subtract the outstanding `loanBalance_{y-1}` from the amount eligible for indexed crediting that year (crediting applies to `cashValue − loanBalance` instead of `cashValue`), modeling the carrier's fixed/segregated-collateral treatment.
- `netCashValue_y = cashValue_y − loanBalance_y`; `netDeathBenefit_y = deathBenefit_y − loanBalance_y` (both must never go negative in the reported figures — floor at 0, and flag it as a lapse, see below).
- **Loan-collapse lapse check:** flag the year (if any) `netCashValue_y ≤ 0` — this is the real IUL risk the carrier illustration hides: an unpaid loan compounding against a cap-limited crediting rate can outgrow cash value even while premiums are current on paper. On collapse, the policy lapses with a loan balance outstanding, which can trigger a large taxable "phantom income" event on the gain — the calculator should flag this qualitatively (a checkable, real consequence of IRC §72's treatment of a lapsed policy with a loan) without attempting to compute the actual tax bill, mirroring `iul.ts`'s existing "out of scope, prose topic" boundary for MEC/§7702.
- Report both the loaned and a **matched no-loan baseline** (a second, parallel run of plain `computeIul()` with `annualLoanDraw = 0`, same every other input) so the page can show "what you gave up by borrowing instead of surrendering or reducing the death benefit" side by side — reuses the existing 401(k)/brokerage baseline comparison pattern already on the hub, one level down.

**Outputs:** year-by-year table (loan balance, cumulative loan interest, net cash value, net death benefit) alongside the no-loan baseline's cash value; cumulative loan interest paid/capitalized over the horizon; lapse-from-loan year (null if none); net cash value and net death benefit at the projection's final age, loaned vs. not.

## 4. Primary + secondary keywords

- **Primary:** "iul loan calculator" (the row's sole mined keyword — a single, clean term with no secondary variants surfaced by this pass's autocomplete sweep).

## 5. Word count / scope estimate

Matching the `SpokeEntry` shape (`title`, `metaDescription`, `targetKeyword`, `h1`, `intro`, `howItWorks`, `commonMistakes`, `workedExample`, `faqs`, `sources`) used in `src/data/spokes-portfolio.ts`/`spokes-real-estate.ts`:
- `intro`: ~120–150 words, opening with the plain-language definition (what a policy loan is, why people take one instead of surrendering) and a one-line "this is not the same as taxable income" framing.
- `howItWorks`: ~600–800 words — this needs real depth: the wash-vs-standard loan distinction, why unpaid interest compounding is the default (not the exception), and the lapse-with-outstanding-loan tax trap. This is a materially harder topic than the hub's existing cap/COI explanation, so it should run toward the top of the site's usual howItWorks range.
- `commonMistakes`: 5 items (~150–200 words) — e.g., assuming a wash loan always nets to zero cost, forgetting unpaid interest compounds, ignoring the lapse-collapse risk, treating "tax-free loan" as "free money," borrowing against a policy still inside its surrender-charge window.
- `workedExample`: one worked scenario (~100–150 words) — a funded policy taking a modest annual loan starting at a chosen year, showing net cash value diverging from the no-loan baseline.
- `faqs`: 6–7 pairs (~300–450 words) — "is an IUL loan really tax-free," "what happens if I never repay the loan," "what's the difference between a wash loan and a standard loan," "can a policy loan cause my policy to lapse," "does the loan reduce my death benefit."
- **Total copy: ~1,150–1,500 words** — above the typical ~700–900-word spoke baseline given the loan-mechanics and tax-trap explanation this topic requires, comparable to the IUL hub page's own depth.
- Cross-link to the site's existing `/guides/borrowing-against-life-insurance/` and `/guides/infinite-banking/` guides (both already referenced from the IUL hub's FAQs per `src/data/calculators.ts`) for the narrative/legal detail this spoke's copy shouldn't re-litigate.

## 6. Technical dependencies

- **`src/lib/iul.ts`** — add a new exported function `computeIulWithLoan()` alongside the existing `computeIul()`, sharing the same per-year crediting/COI/expense mechanics (either by literally duplicating the loop with the loan sub-ledger inserted, matching the file's existing convention of running an "uncapped twin" loop alongside the real one for comparison, or by refactoring the shared per-year step into a small internal helper both functions call — the file's current single-function shape makes the duplication approach lower-risk for a first pass, since it can't accidentally change `computeIul()`'s existing behavior for the live hub page). New types: `IulLoanInput extends IulInput` (adds `loanStartYear`, `annualLoanDraw`, `loanInterestRatePct`, `loanType`) and `IulLoanResult` (adds `loanRows`, `cumulativeLoanInterest`, `loanLapseYear`, `netCashValueFinal`, `netDeathBenefitFinal`, plus the parallel no-loan baseline fields).
- **`src/components/IulLoanCalculator.tsx`** — new React island. Reasonable to build as its own component rather than extending `IulCalculator.tsx` in place, since the loan inputs and the loaned-vs-baseline comparison view are materially different UI from the hub's accumulation-only display; the hub's existing 401(k)/brokerage baseline-comparison layout is the closest visual precedent to reuse.
- **Registration:** add `"iul-loan-calculator": IulLoanCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`. Because this spoke's island differs from the `iul-calculator` hub's default (`IulCalculator`), the new `SpokeEntry` needs `islandId: "iul-loan-calculator"` set explicitly via the `SpokeEntry.islandId` override field (the same mechanism the net-price-college and auto-loan `affordability` spokes already use to render a non-default island under a shared hub).
- **`LIVE_IDS` in `src/data/registry.ts`:** no change needed — `"iul-calculator"` is already present, and this ships as a spoke under that existing hub, not a new top-level calculator.
- New `src/data/spokes-iul-calculator.ts` file + its import into `src/data/spokes.ts`'s `SPOKES` aggregator (see Section 1) — required infrastructure this spec does not create.
