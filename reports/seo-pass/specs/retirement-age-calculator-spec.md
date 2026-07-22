# Asset Spec: Retirement Age Calculator

**Prepared:** 2026-07-22 · Google-Autocomplete keyword-gap pass · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

`/retirement/retirement-age-calculator/`

New `SpokeEntry` under `calculator: "retirement"`, added to `src/data/spokes-retirement.ts`.

## 2. Recommended format + why

**Format: a new calculator spoke page** — a date/countdown-driven "when can I retire" tool, distinct from every existing retirement spoke.

Why: the query signals — **"retirement calculator by age"**, **"retirement year calculator by age"**, **"when can retire calculator"**, **"should i retire calculator"**, **"calculate retirement year from date of birth"**, **"retire young calculator"** — share a common shape none of the existing spokes fill: the user is asking to work **from a date of birth / current date forward to a specific calendar countdown**, not just "project my balance at an age I pick." The closest existing asset is the **`am-i-ready-to-retire` guide** (confirmed in `src/data/guides.ts` — a 5-step checklist-style long-form guide with links out to other calculators), which is explicitly NOT interactive — it has no inputs/outputs of its own, just prose steps and links. The autocomplete signal is tool-seeking ("calculator", "calculate ... from date of birth"), so a checklist guide does not satisfy the intent; this needs a real interactive countdown tool.

It is also different from `retirement-savings-calculator` / `fire-calculator` / `early-retirement-calculator`, which all take "retirement age" as a static input the user types in — none of them compute a literal countdown date from a birthdate, and none of them answer "should I retire now" as a yes/no-style verdict.

## 3. What the asset does — inputs → outputs

**Inputs:**
- Date of birth
- Target retirement age OR a specific target retirement date (support either entry mode)
- Current savings balance
- Monthly contribution
- Expected annual return
- Target monthly/annual income need in retirement

**Outputs:**
- **Exact countdown**: calendar date of the target retirement, plus "X years, Y months from today" framing (the AEO-friendly, self-contained answer this query cluster is explicitly asking for)
- **Projected balance at that date** — reuses the existing `projectRetirement()` accumulation math (same engine as `retirement-savings-calculator`), fed `currentAge` derived from date of birth and `retirementAge` derived from the target
- **Verdict against the target income need**: whether the projected balance clears a 4%-safe-withdrawal-rate income target (i.e., "yes, your projected balance supports your stated monthly income need" / "no, there's a gap of $X/month") — this is the "should I retire" framing the query signal is looking for, made concrete instead of a vague checklist
- **Cross-link suggestion, conditionally rendered**: if the numbers clear the target comfortably (or well ahead of the entered target age), surface a prompt pointing to `/retirement/fire-calculator/` ("your numbers suggest you could retire earlier — see the FIRE calculator") and a general link to `/retirement/` for the full suite

## 4. Primary + secondary keywords

- **Primary:** "retirement age calculator" / "retirement calculator by age"
- **Secondary:** "when can i retire calculator", "should i retire calculator", "retirement year calculator", "calculate retirement year from date of birth", "retire young calculator" (this last term positions the page to also cross-link to FIRE/early-retirement content for readers with more aggressive timelines)

## 5. Word-count/scope estimate

Follow the `SpokeEntry` shape used by `retirement-savings-calculator` (closest structural analog — same underlying projection engine, similar "am I on track" framing):

- `intro`: ~120–150 words, opening with a self-contained AEO sentence answering "how do I calculate when I can retire" directly
- `howItWorks`: ~180–220 words — explain the date-to-age conversion, the projection math (reusing existing engine), and the safe-withdrawal-rate verdict logic
- `commonMistakes`: 5 bullets — likely: treating the verdict as a guarantee rather than an estimate, ignoring Social Security timing (cross-reference `social-security-retirement-calculator`), not accounting for healthcare costs before 65, forgetting inflation on the income target, using today's expenses instead of retirement-year expenses
- `workedExample`: one full worked numeric example (~130–160 words) with a concrete DOB, target age, and clear "yes/no" verdict against a stated income need
- `faqs`: 5 Q&A pairs, ~40–60 words each — should include at least one FAQ directly answering "when can I retire" and one on "should I retire calculator" phrasing to match query intent
- **Total copy: ~700–850 words**, in line with sibling projection-based spokes.

## 6. Technical dependencies

- **Category/hub:** reuses the existing `retirement` `CalculatorDef`/hub — no new hub page.
- **Core engine:** reuses `projectRetirement()` from `src/lib/retirement.ts` (`mode: "projection"` in the existing `RetirementCalculator.tsx` island) — the accumulation and 4%-rule withdrawal math already exists and needs no changes.
- **New logic needed (the actual net-new build work):**
  1. **Date-of-birth → current-age conversion** and **target-date → target-age conversion** (simple date arithmetic) — this does not exist in `src/lib/retirement.ts` today, which takes `currentAge`/`retirementAge` as plain numbers, not dates. Recommend adding this as a thin wrapper/adapter function (e.g. in `src/lib/retirement.ts` or a small new helper) that converts DOB + target date/age into the `currentAge`/`retirementAge` numbers `projectRetirement()` already expects, then calls the existing engine — no change to the core projection math itself.
  2. **A UI variant that accepts DOB/date instead of raw age** — either (a) extend `RetirementCalculator.tsx` with a new `mode: "retirement-age"` that swaps the age inputs for date inputs and layers on the countdown display + income-target verdict, or (b) build a small new component that wraps the existing engine call. Given this is mostly a presentational/input-format difference rather than new math, extending the existing island with a new mode (like the site already does for `"projection"` / `"early-withdrawal"` / `"rmd"`) is the lower-risk path — recommend that approach over a wholly new component.
  3. **Conditional cross-link logic**: a simple comparison (is projected retirement age earlier than the user's stated target?) to decide whether to surface the FIRE-calculator prompt — pure presentational logic, no new data dependency.
- **Sources:** SSA and DOL sources already used elsewhere on the retirement spokes (e.g. DOL "Top 10 Ways to Prepare for Retirement," already cited by `am-i-ready-to-retire`) are appropriate here too; no new primary-source research required.
- **Cross-links:** add to `relatedSlugs`: `retirement-savings-calculator`, `fire-calculator`, `early-retirement-calculator`, `social-security-retirement-calculator`; also add this new slug into those spokes' `relatedSlugs` and into the `am-i-ready-to-retire` guide's `tools` array (`src/data/guides.ts`) as an additional linked tool, since that guide is the closest existing content and currently has no interactive countdown tool to point to.
