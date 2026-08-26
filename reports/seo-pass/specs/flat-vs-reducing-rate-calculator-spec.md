# Asset Spec: Flat Rate vs. Reducing Balance (EMI) Calculator

**Prepared:** 2026-08-26 · Autocomplete keyword-gap pass (`keyword-gap-pass`, personal-loan hub) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-08-26.md`, new-content row 11 ("Large international cluster wants flat-rate vs. reducing-balance / EMI math").

## 1. Target route/URL

`/personal-loan/flat-vs-reducing-rate-calculator/`

New `SpokeEntry` under `calculator: "personal-loan"` in the (not-yet-existing) `src/data/spokes-personal-loan.ts` — see the amortization-schedule spec, section 6, for that shared file-creation dependency.

## 2. Recommended format + rationale

**Format: a new interactive calculator**, not a reuse of `PersonalLoanCalculator`.

The existing tool assumes reducing-balance (amortizing) interest throughout — `monthlyPaymentFor()` and every downstream number in `computePersonalLoan()` are built on the reducing-balance annuity formula. It has no concept of a flat/EMI-style rate at all, and no bidirectional conversion between the two methodologies. A large international query cluster (flat-rate and reducing-balance terminology, plus EMI-specific phrasing) wants exactly that conversion, which requires two new solvers the current engine doesn't have: flat-rate → true effective (reducing-balance) APR, and the reverse, reducing-balance APR → equivalent flat rate.

## 3. What the asset does

**Inputs:** loan amount ($), term (months or years), and a mode toggle — either (a) a flat/EMI annual rate (%) to convert to a true effective APR, or (b) a reducing-balance APR (%) to convert to an equivalent flat rate.

**Outputs:** the converted rate in the other methodology, the resulting EMI/monthly payment, and total interest — shown side by side for both methodologies so the reader sees why the same advertised rate produces a materially different total cost under each.

**Formula — both methodologies explained inline on the page (not just computed silently):**

**Flat-rate / EMI method** (the S. Asian/international convention the query cluster is asking about): interest is calculated on the *original* principal for the *entire* term, not on the declining balance.
- `totalFlatInterest = P × flatRate% × years`
- `totalRepayment = P + totalFlatInterest`
- `EMI (flat) = totalRepayment / n` (months) — this EMI is the same fixed number every month, but note that "EMI" itself is a generic term for "the fixed monthly installment," used under *either* methodology internationally — the flat-rate connection is a common terminology conflation, not a rule, and the page copy should say so explicitly (this is the "what is EMI" definitional demand this page absorbs, per section 4).

**Reducing-balance / true-APR method** (the US-standard amortizing method used by the rest of this site's calculators): interest is calculated each month only on the *remaining* balance.
- `r = APR / 100 / 12`
- `EMI (reducing) = P · r · (1+r)^n / ((1+r)^n − 1)` — the same closed-form formula as `monthlyPaymentFor()` in `personal-loan.ts`.

**Conversion — flat rate → effective reducing-balance APR (mode a):**
1. Compute `EMI (flat)` per the formula above.
2. Solve for the reducing-balance monthly rate `r*` such that a reducing-balance loan of principal `P`, paid at exactly `EMI (flat)` for `n` months, is fully paid off — i.e., find `r*` where `presentValue(EMI(flat), r*, n) = P`. This is bisection, structurally identical to `solveEffectiveApr()` already in `personal-loan.ts`, except the target present value is the *full loan amount* `P` here (vs. `amountReceived`, the fee-adjusted disbursement, in the existing function). Convert `r*` to an annual effective APR: `APR* = r* × 12 × 100`.
3. The flat rate will always understate the true cost — the resulting `APR*` is materially higher than the stated flat rate (commonly close to double, though the exact ratio depends on term length; the page should show the actual computed gap for the reader's numbers, not quote a fixed rule of thumb as if it were exact).

**Conversion — reducing-balance APR → equivalent flat rate (mode b, the reverse):**
1. Compute `EMI (reducing)` via the standard formula above.
2. `totalInterestPaid = EMI(reducing) × n − P`
3. `equivalentFlatRate% = (totalInterestPaid / P) / years × 100`

## 4. Primary and secondary keywords

- **Primary:** "flat rate vs reducing balance calculator," "EMI calculator"
- **Secondary:** "flat interest rate to reducing balance calculator," "reducing balance interest calculator," "personal loan EMI calculator," "what is EMI in a personal loan" — pulled from the chart row's raw variants ("flat rate," "reducing balance," EMI-terminology variants). Note the chart also flags "EMI-terminology variants incl. hdfc/icici/sbi-style brand requests" — this page absorbs the *terminology* demand (defining EMI, explaining both methodologies) but should NOT use any specific bank's brand name in copy or metadata; the brand-name autocomplete variants only evidence the shape of demand, consistent with how the site's existing lender-rate roundups stay neutral rather than trademark-adjacent.

## 5. Word count / scope estimate

~1,000–1,200 words of surrounding copy — larger than most of the other five specs because both methodologies need a full, correct explanation (not just the tool's output) for the page to be genuinely useful to an audience unfamiliar with flat-rate lending, plus a standalone "what is EMI" definitional passage. Suggested structure: intro, a "what is EMI" explainer (2–3 sentences, definitional, matching the site's existing FAQ-definition pattern e.g. "What is a personal loan calculator?" on the hub), a flat-vs-reducing-balance explainer with the worked numeric example from section 3, and 6–7 FAQs (e.g., "why is my flat rate so much lower than my APR," "which method do US lenders use," "how do I compare a flat-rate offer to a US APR-quoted offer").

## 6. Technical dependencies

- **`src/lib/flat-vs-reducing-rate.ts`** — new engine. Needs: the flat-rate EMI formula (new), the standard reducing-balance EMI formula (duplicate `monthlyPaymentFor()` from `personal-loan.ts`, consistent with that file's "independent copy" convention), and a bisection solver structurally identical to `solveEffectiveApr()` in `personal-loan.ts` but re-targeted to solve against the full principal `P` instead of a fee-adjusted disbursement amount — this is a near-copy of existing logic with one changed target value, the lowest-novelty engine work in this batch alongside the affordability-calculator's `presentValue()` reuse.
- **`src/components/FlatVsReducingRateCalculator.tsx`** — new React island with a two-mode toggle (flat→reducing vs. reducing→flat) and a side-by-side "both methodologies" results view (not just one converted number) so the explanatory value is visible in the tool itself, not just in the surrounding copy.
- **Registration required:** add `"flat-vs-reducing-rate": FlatVsReducingRateCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`, and add `"flat-vs-reducing-rate"` to `LIVE_IDS` in `src/data/registry.ts`.
- New `SpokeEntry` in `src/data/spokes-personal-loan.ts` (`calculator: "personal-loan"`, `slug: "flat-vs-reducing-rate-calculator"`) — see section 1.
