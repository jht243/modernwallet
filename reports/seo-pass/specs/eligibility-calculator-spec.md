# Asset Spec: Personal Loan Eligibility Calculator

**Prepared:** 2026-08-26 · Autocomplete keyword-gap pass (`keyword-gap-pass`, personal-loan hub) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-08-26.md`, new-content row 9 ("No credit-score-based approval-odds tool").

## 1. Target route/URL

`/personal-loan/eligibility-calculator/`

New `SpokeEntry` under `calculator: "personal-loan"` in the (not-yet-existing) `src/data/spokes-personal-loan.ts` — see the amortization-schedule spec, section 6, for that shared file-creation dependency.

## 2. Recommended format + rationale

**Format: a new interactive calculator**, not a reuse of `PersonalLoanCalculator`.

`computePersonalLoan()` takes credit quality as a given — the user enters the interest rate *they already have* (or are quoting). There is no credit score input anywhere in `PersonalLoanInput`, no rate-tier lookup table, and no approval-likelihood output of any kind; the existing tool cannot answer "what rate might I qualify for" or "am I likely to get approved" because it has no notion of creditworthiness at all. A genuinely new engine is required: a credit-score-tier → rate-range lookup, combined with a DTI-based approval-likelihood heuristic, neither of which exists in this codebase in any calculator today.

## ⚠️ Compliance consideration (read before building)

This tool must be framed, in both the UI copy and the FAQ, as an **educational estimate**, never as a real underwriting decision, pre-qualification, or credit decision. Presenting "approval odds" carries real accuracy and liability exposure that the site's other calculators (which only do deterministic math — a payment formula, an amortization loop) do not carry:

- Use qualitative bands only (e.g., "Likely," "Possible," "Unlikely to qualify without a co-signer") — **never a numeric percentage** ("73% approval chance"), since a fabricated-precision number invites a reader to treat it as a real odds calculation, which it categorically is not.
- Source the credit-tier rate ranges from published aggregate data (e.g., Federal Reserve G.19 consumer credit release, a Bankrate/LendingTree published rate survey) and cite it, the same way the existing `personal-loan` hub FAQ already sources its rate-range answer to no single number.
- Include a prominent, non-collapsible disclaimer near the results (not just buried in an FAQ): this tool does not perform a credit check, does not reflect any single lender's actual underwriting criteria (which also weighs income, existing debt, employment history, and factors this tool cannot see), and is not a substitute for pre-qualifying with an actual lender.
- Do not collect or store any personally identifying financial data — every input stays client-side in the browser (matching this codebase's existing pattern: every calculator here is a pure client-side React state computation with no backend submission).
- Avoid language that could be read as a promise or representation of outcome ("you will be approved," "guaranteed rate") anywhere in the copy, FAQ, or component labels.

## 3. What the asset does

**Inputs:** self-reported credit score (either a number or a band picker: Poor <580, Fair 580–669, Good 670–739, Very Good 740–799, Exceptional 800–850 — standard FICO bands), gross annual income, existing monthly debt payments (for DTI), desired loan amount and term.

**Outputs:** an estimated APR *range* for the reader's credit tier (not a single number), a qualitative approval-likelihood band, and the estimated monthly payment at the midpoint of that range (reusing the same closed-form annuity formula already in `personal-loan.ts`).

**Formula:**
- **Rate-tier lookup:** a static table mapping each of the five FICO bands above to a published representative APR range (sourced, not invented — e.g., "Exceptional: ~X–Y%," "Poor: ~X–Y%"). This is a lookup, not a computed model — the estimate's honesty depends on using real published survey data, refreshed periodically, not a formula presented as precise.
- **DTI calculation:** `DTI% = (existingMonthlyDebt + estimatedNewPayment) / grossMonthlyIncome × 100`, where `estimatedNewPayment` is computed via the standard annuity formula at the midpoint rate for the reader's tier: `M = P · r · (1+r)^n / ((1+r)^n − 1)`.
- **Approval-likelihood band:** a simple, transparent weighted-points heuristic, not a black-box score — e.g., credit tier contributes most of the weight (Exceptional/Very Good → high base points, Poor → low base points), then DTI adjusts it (DTI <20% → no penalty, 20–36% → small penalty, 36–43% → moderate penalty, >43% → large penalty, matching the widely-published 36%/43% DTI thresholds used elsewhere on this site's mortgage-affordability spoke). Points map to three bands: "Likely," "Possible — consider a co-signer or smaller amount," "Unlikely without improving DTI or credit first." The exact point thresholds should be documented inline in the engine's comments as a transparent, auditable rule set (not tuned to any real lender's actual model), consistent with the compliance framing above.

## 4. Primary and secondary keywords

- **Primary:** "personal loan eligibility calculator"
- **Secondary:** "personal loan calculator based on credit score," "personal loan qualification calculator," "am I eligible for a personal loan calculator" — pulled directly from the chart row's raw variants: "based on credit score," "eligibility," "qualification calculator"

## 5. Word count / scope estimate

~1,000–1,300 words of surrounding copy — larger than the other five specs in this batch because the compliance framing itself requires real explanatory space: an intro clarifying this is an estimate, a how-it-works section explaining both the rate-tier lookup and the DTI-based likelihood band, a dedicated "how accurate is this" FAQ answer, and 6–8 total FAQs (e.g., "does this run a credit check," "will this affect my credit score," "why do two lenders quote me different rates for the same score," "what if I don't know my exact credit score"). The disclaimer text itself is additional word count beyond this estimate and should not be trimmed to hit a target length.

## 6. Technical dependencies

- **`src/lib/personal-loan-eligibility.ts`** — new engine, no existing precedent in this codebase (no other calculator does a credit-tier lookup or a qualitative-likelihood heuristic; the closest input concept, DTI, currently exists only in the mortgage `affordability-calculator` spoke's copy, not as reusable lib code). Should export the rate-tier table as clearly-labeled, easily-updatable constants (with a source-URL comment) so the ranges can be refreshed without touching the calculation logic.
- **`src/components/PersonalLoanEligibilityCalculator.tsx`** — new React island. Needs a credit-band selector, a results view showing a *range* and a *qualitative band* (not point numbers, per the compliance section above), and a persistent, styled disclaimer block (not a small-print footnote) — a new visual treatment relative to the existing `PersonalLoanCalculator.tsx`'s single-line `disclaimer` div.
- **Registration required:** add `"personal-loan-eligibility": PersonalLoanEligibilityCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`, and add `"personal-loan-eligibility"` to `LIVE_IDS` in `src/data/registry.ts`.
- New `SpokeEntry` in `src/data/spokes-personal-loan.ts` (`calculator: "personal-loan"`, `slug: "eligibility-calculator"`) — see section 1.
