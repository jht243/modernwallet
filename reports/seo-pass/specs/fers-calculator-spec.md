# Asset Spec: FERS Calculator

**Prepared:** 2026-07-22 · Google-Autocomplete keyword-gap pass · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

`/retirement/fers-calculator/`

New `SpokeEntry` under `calculator: "retirement"` (existing live `retirement` category), added to `src/data/spokes-retirement.ts` alongside the existing `military-retirement-calculator` and `pension-calculator` spokes.

## 2. Recommended format + why

**Format: a new calculator spoke page**, following the exact pattern of `military-retirement-calculator` and `pension-calculator` in `src/data/spokes-retirement.ts`.

Why: the query signals — **"what is fers retirement calculator"**, **"retirement calculator opm"**, **"retirement calculator federal employee"**, **"retirement calculator government"**, **"retirement calculator high 3"** — are all specific to the U.S. federal civilian workforce (FERS = Federal Employees Retirement System, administered by OPM = Office of Personnel Management). This is a large, distinct, well-defined audience (~2.2M federal civilian employees) not served by:
- `military-retirement-calculator` — covers uniformed military pension (BRS/legacy High-3) + TSP, which uses similar TSP mechanics but a **different pension formula and different eligibility rules** (military retires on 20-year cliff / BRS; FERS retires on MRA+years-of-service rules with its own bridge benefit).
- `pension-calculator` — a generic private-sector defined-benefit pension spoke (years × multiplier × final-average-salary), which does not capture FERS's specific three-part structure (Basic Annuity + FERS Supplement + TSP) or its "High-3" terminology, which is literally in the query signal ("retirement calculator high 3").

This gap is large enough (multiple distinct autocomplete signals, all pointing at OPM/FERS specifically) to justify its own spoke rather than folding into `pension-calculator`.

## 3. What the asset does — inputs → outputs

**Inputs:**
- High-3 average salary (average of highest 3 consecutive years of basic pay)
- Years of creditable federal service
- Age at retirement (drives which FERS Basic Annuity multiplier applies: 1.0% standard, or 1.1% if retiring at age 62+ with 20+ years of service)
- Whether the employee qualifies for the FERS Supplement (generally: retiring at MRA with 30+ years, or age 60 with 20+ years, before age 62 — the Supplement does NOT apply to deferred or MRA+10 retirements)
- Estimated Social Security benefit at 62 (used only to size the Supplement estimate, not to pay it — the Supplement approximates the SS benefit earned during federal service specifically)
- TSP balance today, monthly TSP contribution, expected annual return, years to retirement (reuses the existing `projectRetirement()` accumulation math)

**Outputs:**
- **FERS Basic Annuity** (annual + monthly): `High-3 × years of service × multiplier (1.0% or 1.1%)`
- **FERS Supplement** (annual + monthly, only shown if the retiree qualifies and is under 62): an approximation of the Social-Security-equivalent bridge benefit, clearly flagged as an estimate that ends at age 62
- **Projected TSP balance at retirement** (reusing `projectRetirement()` from `src/lib/retirement.ts`, same accumulation logic as the `401k-calculator` spoke)
- **Combined total monthly income picture**: Basic Annuity + Supplement (if applicable, pre-62) + a 4%-rule TSP withdrawal estimate, clearly broken out by source so the user can see which pieces stop at 62 (Supplement) vs. continue for life (Basic Annuity, TSP)

## 4. Primary + secondary keywords

- **Primary:** "fers calculator" / "fers retirement calculator"
- **Secondary:** "opm retirement calculator", "retirement calculator federal employee", "retirement calculator government", "high 3 retirement calculator", "fers supplement calculator"

## 5. Word-count/scope estimate

Follow the `SpokeEntry` shape used by `military-retirement-calculator` (a close structural analog — two income streams, one pension formula + one TSP/401k projection):

- `intro`: ~130–160 words, explicitly defining FERS/OPM/High-3 in the first sentence (AEO — self-contained opening sentence, matching the site's existing style)
- `howItWorks`: ~250–300 words — needs to cover three formula pieces (Basic Annuity multiplier logic, Supplement eligibility + bridge concept, TSP projection), more than a typical single-formula spoke
- `commonMistakes`: 5 bullets — likely candidates: confusing FERS with military/legacy CSRS rules, assuming the Supplement continues past 62, using current salary instead of High-3, forgetting the Supplement has its own earnings-test reduction if the retiree works while receiving it, not maximizing TSP agency match
- `workedExample`: one full worked numeric example (~150–180 words) — e.g. a 30-year federal employee retiring at MRA with a $90,000 High-3 and a TSP balance, showing Basic Annuity + Supplement + TSP income
- `faqs`: 5–6 Q&A pairs, ~40–70 words per answer, matching the site's FAQ density (see `military-retirement-calculator`, `pension-calculator`)
- **Total copy: ~900–1,100 words** (slightly above the single-formula spokes given the three-part income structure, in line with `military-retirement-calculator`'s scope)

## 6. Technical dependencies

- **Category/hub:** reuses the existing `retirement` `CalculatorDef`/hub — no new hub page needed.
- **Accumulation math (TSP side):** reuse `projectRetirement()` from `src/lib/retirement.ts` exactly as `401k-calculator` and `military-retirement-calculator` already do (`mode: "projection"` in `RetirementCalculator.tsx`) — zero new engine code needed for this piece.
- **Pension math (Basic Annuity + Supplement):** the FERS Basic Annuity and Supplement formulas are NOT currently modeled anywhere in `src/lib/retirement.ts` (only `projectRetirement`, `early401kWithdrawal`, `computeRMD` exist) or in `pension-calculator`'s spoke content (which describes the generic DB formula only in prose, computed by hand in the worked example — it does not have a dedicated pension-calculation mode in the island). Two build options for the engineer:
  1. **Prose-only pension math** (matching `pension-calculator`'s existing pattern exactly): the live `RetirementCalculator` island (`mode: "projection"`) handles only the TSP side; the FERS Basic Annuity + Supplement numbers are computed in the worked example and explained in prose/formula in `howItWorks`, with the user doing the two-line arithmetic themselves. This requires zero new engine/island code — fastest to ship, consistent with how `pension-calculator` and `military-retirement-calculator` already handle their DB-pension side.
  2. **Interactive pension mode** (bigger lift): add a new `mode: "fers"` to `RetirementCalculator.tsx` (`src/components/RetirementCalculator.tsx`) and a corresponding pure function in `src/lib/retirement.ts` (e.g. `computeFersAnnuity()`) that takes High-3, years of service, and retirement age, and returns Basic Annuity + Supplement, then combines with the existing `projectRetirement()` TSP output into one blended results panel.
  - **Recommendation:** ship option 1 first (matches existing site convention for pension-calculator and military-retirement-calculator), and flag option 2 as a fast-follow if this spoke earns meaningful traffic — do not block publish on new engine work.
- **Sources:** OPM's official FERS handbook/website (opm.gov) and IRS Pub 590-B for TSP tax treatment are the required primary sources — cite the current OPM FERS Basic Annuity formula and Social Security Supplement pages by name; verify multiplier and Supplement eligibility rules against opm.gov at build time since these are statutory and could change.
- **Cross-links:** add to `relatedSlugs` on `military-retirement-calculator`, `pension-calculator`, and `401k-calculator` (they already interlink retirement-income spokes), and add this new slug to those three spokes' own `relatedSlugs` arrays so the graph is bidirectional (no-orphan rule).
