# Asset Spec: Chapter 61 Disability Retirement Calculator

**Prepared:** 2026-08-17 · trend-pass-auto (trend lane, Chapter 61 / CRDP theme) · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

`/retirement/chapter-61-disability-retirement-calculator/`

New `SpokeEntry` under `calculator: "retirement"` (sibling of the existing `military-retirement-calculator` spoke), added to `src/data/spokes-retirement.ts`.

## 2. Recommended format + why

**Format: a new calculator spoke page** — a dedicated Method A / Method B Chapter 61 pay estimator, distinct from the existing military retirement calculator.

Why: autocomplete mining this run returned a strong, repeated tool-intent cluster around this exact gap — "chapter 61 retirement calculator", "chapter 61 retirement pay calculator", "military disability retirement calculator", "military disability retirement pay calculator", "army disability retirement calculator", "best military medical retirement calculator" (6+ distinct suggestions, the single strongest demand signal of this run's mining). The existing `military-retirement-calculator` spoke computes only the standard years-of-service pension (High-3 × 2.0%/2.5% multiplier) and explicitly tells Chapter 61 readers to do the comparison by hand: its own FAQ says "compute that same years-of-service figure, then separately compute the disability-percentage figure... and compare the two — DFAS pays whichever is higher." No live tool on the site does that second computation or the comparison.

The two comparison pages shipped this run (`compare/military-retirement-vs-medical-retirement` explains the two-method rule in prose; `compare/medical-retirement-vs-disability-severance-pay` explains the severance-pay side) both describe the math narratively but neither includes an interactive calculator — this spoke is the natural tool companion to both.

## 3. What the asset does — inputs → outputs

**Inputs:**
- Years of creditable service at separation (supports fractional years)
- High-3 average monthly base pay (or reuse the existing High-3 input pattern from `military-retirement-calculator`)
- VA/PEB disability rating percentage
- Status: TDRL (Temporary Disability Retired List) or PDRL (Permanent Disability Retired List) — TDRL applies the 50% minimum-rating floor to Method A; PDRL does not
- BRS or legacy High-3 plan (reuses the existing multiplier toggle from `military-retirement-calculator`: 2.0% BRS / 2.5% legacy)

**Outputs:**
- **Method A (disability-percentage) result**: `max(rating%, 50% if TDRL) × High-3 monthly average` — shown as a monthly dollar figure
- **Method B (years-of-service) result**: `years of service × 2.0% or 2.5% × High-3 monthly average` — reuses the same multiplier math already in `military-retirement-calculator`
- **Verdict line**: which method pays more for the entered inputs, stated as a direct dollar comparison (AEO-friendly, self-contained answer — "Method A pays $X/month; Method B pays $Y/month; DFAS pays the higher of the two, $Z/month")
- **Conditional note**: if disability rating is below 30% and years of service is under 20, a note explaining the entered scenario would actually fall under Disability Severance Pay, not Chapter 61 retirement, with a link to `/compare/medical-retirement-vs-disability-severance-pay/`

## 4. Primary + secondary keywords

- **Primary:** "chapter 61 retirement calculator" / "military disability retirement calculator"
- **Secondary:** "chapter 61 retirement pay calculator", "military disability retirement pay calculator", "army disability retirement calculator", "military medical retirement calculator"

## 5. Word-count/scope estimate

Follow the `SpokeEntry` shape used by the existing `military-retirement-calculator` spoke (closest structural analog — same High-3/multiplier engine, same military-retirement domain):

- `intro`: ~120–150 words, opening with a self-contained AEO sentence stating that Chapter 61 pay uses whichever of two methods produces the higher amount
- `howItWorks`: ~180–220 words — explain Method A vs Method B, the TDRL 50% floor, and that this reuses the standard High-3/multiplier math from the sibling calculator for Method B
- `commonMistakes`: 5 bullets — likely: assuming disability rating alone determines the payout (Method B can win for long-service members with a modest rating); forgetting the TDRL 50% floor only applies pre-finalization; using current base pay instead of the High-3 average; not checking the 30%-rating/20-year threshold that determines Chapter 61 eligibility vs. severance pay; assuming CRDP applies automatically at any years of service (it requires 20+ even for Chapter 61 retirees, per the existing `military-retirement-vs-va-disability` comparison)
- `workedExample`: one full worked numeric example (~130–160 words) — e.g. an 8-year member with a 40% TDRL rating vs. the years-of-service method, showing Method A wins
- `faqs`: 5 Q&A pairs, ~40–60 words each — should include "How is Chapter 61 disability retirement pay calculated?" and "What is the TDRL 50% floor?"
- **Total copy: ~700–850 words**, in line with sibling military-retirement spokes.

## 6. Technical dependencies

- **Category/hub:** reuses the existing `retirement` `CalculatorDef`/hub — no new hub page.
- **New logic needed (the actual net-new build work):**
  1. **Method A / Method B dual computation** — `src/lib/retirement.ts` today only implements the years-of-service (Method B) pension formula, used by `military-retirement-calculator`'s `islandId`. A new pure function (e.g. `computeChapter61Pay()`) is needed to compute Method A (`max(ratingPct, tdrl ? 50 : ratingPct) × high3Monthly`) and return both figures plus the higher one. This is simple arithmetic, not a new modeling engine — low implementation risk — but it is still new calculation logic, not a data-file-only change, so it is scoped as a spec rather than built same-run per this pass's additive-content-only scope.
  2. **A UI variant or new island mode** — either extend `MilitaryRetirementCalculator.tsx` (if that is the existing island component; confirm exact file name in `src/components/islands.ts`) with a new `mode: "chapter-61"` that swaps in the rating/TDRL inputs and shows both method results plus the verdict, or build a small dedicated component. Given the existing island already toggles BRS/legacy multipliers, extending it with a new mode is the lower-risk path, matching the pattern used elsewhere on the site (e.g. `RetirementCalculator.tsx`'s existing `"projection"` / `"early-withdrawal"` / `"rmd"` modes).
  3. **Cross-link logic**: a simple threshold check (rating < 30% AND years < 20) to surface the severance-pay redirect note — pure presentational logic, no new data dependency.
- **Sources:** reuse the DFAS disability-retirement page and 10 U.S.C. Chapter 61 citations already used on `compare/military-retirement-vs-medical-retirement` and `compare/medical-retirement-vs-disability-severance-pay` — no new primary-source research required for the copy; the auditor should independently re-verify the Method A/B formulas against DFAS.mil before this ships as code, since a miscalculated retirement-pay tool is a real-money YMYL risk.
- **Cross-links:** add to `relatedSlugs`: `military-retirement-calculator`; also add this new slug into `compare/military-retirement-vs-medical-retirement` and `compare/medical-retirement-vs-disability-severance-pay`'s `calculatorLinks` arrays once built (not done this run — those pages were not edited, per the additive-only/new-routes-only scope of this pass).
