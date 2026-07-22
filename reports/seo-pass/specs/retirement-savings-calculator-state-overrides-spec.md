# Asset Spec: Retirement Savings Calculator — State Overrides (Batch 1, ~10 states)

**Prepared:** 2026-07-22 · Google-Autocomplete keyword-gap pass · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

`/retirement/retirement-savings-calculator/[state]/` — using the **existing** dynamic state-subpage route `src/pages/[category]/[slug]/[state].astro`.

Confirmed mechanism (read directly from source before writing this spec):
- `[state].astro`'s `getStaticPaths()` generates one page per (spoke × state) **only for spokes that declare `stateVariants`** (`src/data/types.ts` `SpokeEntry.stateVariants?: string[]`). Today, `retirement-savings-calculator` in `src/data/spokes-retirement.ts` has **no `stateVariants` set** — this route currently generates zero pages for this spoke. Adding `stateVariants` to that spoke entry is the trigger that turns this route on for it.
- Per-state bespoke content lives in a `Record<string, StateOverride>` keyed by state slug, itself nested under the spoke's slug in a top-level `Record<spokeSlug, Record<stateSlug, StateOverride>>` map — confirmed by the existing `src/data/state-overrides.ts`, which exports `STATE_OVERRIDES = { "offer-in-compromise-calculator": OIC_STATE_OVERRIDES, ... }` and a `getStateOverride(spokeSlug, stateSlug)` lookup function used directly by `[state].astro`.
- If a state in `stateVariants` has **no** entry in `STATE_OVERRIDES`, the route still renders using templated defaults (`${titleCase(entry.targetKeyword)} — ${state.name}`, generic intro wrapper, and the state's own `lawContext` from `src/data/states.ts` if set) — so the shell works immediately, but the bespoke content (the actual SEO value) only exists once an override is authored.

## 2. Recommended format + why

**Format: infra work (populate data), not new page code.** The route and template already exist and are proven (see `offer-in-compromise-calculator`, `estate-planning`'s will-cost-calculator, and the probate spokes, all of which already have 50-state `stateVariants` + partial `STATE_OVERRIDES` batches). This is purely a content-population task: add `stateVariants` to the `retirement-savings-calculator` spoke entry, then author a `RETIREMENT_SAVINGS_STATE_OVERRIDES` batch keyed by state slug.

Why this spoke, why now: the query signals — **"retirement calculator california"**, **"illinois"**, **"massachusetts"**, **"nc"**, **"nj"**, **"retirement calculator by state"** — show real demand for state-specific retirement-savings framing. This demand is genuine because **state income-tax treatment of retirement withdrawals varies materially**: some states (Florida, Texas, and other no-income-tax states) tax no retirement income at all; others fully or partially exempt Social Security and/or pension/401(k)/IRA withdrawals; others tax it all as ordinary income. That variation is real, substantive, state-specific content — not filler — which is exactly the bar the existing OIC state-overrides batch sets (see `src/data/state-overrides.ts`, e.g. the Alabama/Florida/Alaska entries, each with state-specific tax-rate and legal citations).

**Recommend starting with a first batch of ~10 states**, not a 50-state build in one pass (matching how OIC did its own batches — "Batch 1 (AL–GA)," "Batch 2 (HI–MD)" — visible in the comments in `state-overrides.ts`). Suggested first-10 list, mixing no-income-tax states with high-population/high-query-volume states:
1. **Florida** (no state income tax — retirement income entirely state-tax-free)
2. **Texas** (no state income tax)
3. **California** (explicit query signal; high income tax, but does NOT tax Social Security)
4. **New York** (explicit high-population state; partially exempts pension/retirement income up to a threshold)
5. **Illinois** (explicit query signal; fully exempts most retirement income including 401(k)/IRA/pension distributions — a notable, counter-intuitive fact worth surfacing)
6. **Massachusetts** (explicit query signal; taxes most retirement withdrawals but exempts certain public pensions)
7. **New Jersey** (explicit query signal — abbreviated "nj" in the autocomplete data; has a large retirement-income exclusion below an income threshold)
8. **North Carolina** (explicit query signal — abbreviated "nc"; taxes retirement income but exempts some government pensions under "Bailey" protections)
9. **Pennsylvania** (large population; does not tax retirement income from 401(k)/IRA/pensions after normal retirement age — another notable exemption fact)
10. **Washington** (no state income tax; large population, West Coast counterweight to California)

## 3. Concrete data/schema needed

For **each** of the ~10 states, add one entry to a new `Record<string, StateOverride>` (e.g. `RETIREMENT_SAVINGS_STATE_OVERRIDES` in a new or extended overrides file), following the exact `StateOverride` interface in `src/data/types.ts`:

```ts
export interface StateOverride {
  title?: string;            // ≤60 chars
  metaDescription?: string;  // ≤160 chars
  h1?: string;
  intro?: string;            // replaces templated intro wrapper
  lawContext?: string;       // replaces state.lawContext — THIS is the substantive content
  extraFaqs?: FAQ[];         // merged with parent spoke's faqs
  extraSources?: Source[];   // merged with parent spoke's sources
}
```

Per state, `lawContext` (the highest-value field — 2-3 paragraphs, matching the density of the OIC examples already in `state-overrides.ts`) must cover, specifically for retirement savings/withdrawals:
- Whether the state has an income tax at all
- Whether Social Security benefits are taxed at the state level
- Whether 401(k)/IRA/pension withdrawals are taxed, partially exempt (with thresholds/age conditions), or fully exempt
- Any state-specific retirement-income exclusion amount or age-based phase-in (e.g. NY's pension exclusion, NJ's retirement-income exclusion threshold, PA's after-retirement-age exemption, NC's Bailey-settlement government-pension carveout)
- One primary-source citation (state department of revenue / taxation page) per state, added via `extraSources`

`extraFaqs` (1-2 per state) should answer the literal query shape, e.g. "Does California tax retirement account withdrawals?" / "Is Social Security taxed in Illinois?"

`costFactor` (on `StateContext` in `src/data/states.ts`, not `StateOverride`) is not directly relevant here since this spoke isn't cost-estimation — leave state-level `costFactor` unset/default unless the engineer building this decides the retirement-savings projection should also flex a state tax-drag assumption into the projected balance (a further-scope idea worth flagging but not required for this batch).

**Critical caveat to carry into the build:** whoever builds this MUST verify each state's actual current-year tax treatment of retirement income against a primary source (state department of revenue site) before publishing — these rules change most legislative sessions (several states have phased out retirement-income taxation in recent years, e.g. Iowa, Nebraska), so the specific dollar thresholds and exemption rules cited here are illustrative directions for research, not verified figures to publish as-is.

## 4. Primary + secondary keywords

- **Primary:** "retirement calculator [state]" (e.g. "retirement calculator california")
- **Secondary:** "retirement calculator by state", "retirement calculator illinois", "retirement calculator massachusetts", "retirement calculator nc", "retirement calculator nj", plus natural variants like "does [state] tax retirement income"

## 5. Word-count/scope estimate

Per state page (10 states total in this batch):
- `lawContext`: ~200–350 words (2-3 paragraphs, matching OIC's density)
- `intro` override (optional but recommended): ~80–100 words
- `extraFaqs`: 1-2 Q&A pairs, ~40–60 words each
- **Per-state total: ~350–500 words × 10 states = ~3,500–5,000 words** for this batch — comparable in scope to one full OIC state-override batch (7-8 states) already shipped in `state-overrides.ts`.

## 6. Technical dependencies

- **Route:** `src/pages/[category]/[slug]/[state].astro` — already built, no changes needed.
- **Spoke change required:** add `stateVariants: [...]` (the 10 state slugs above, matching slugs in `src/data/states.ts`'s `STATES` array) to the `retirement-savings-calculator` entry in `src/data/spokes-retirement.ts`. This is the one-line change that activates the route for this spoke — currently absent.
- **New data file/section:** add a `RETIREMENT_SAVINGS_STATE_OVERRIDES` map, either as a new file (e.g. `src/data/retirement-savings-state-overrides.ts`, mirroring the file-per-spoke-family pattern hinted at in `types.ts`'s comment "Lives in the spoke's own overrides file (e.g. `src/data/oic-state-overrides.ts`)") or as an additional keyed section inside the existing `src/data/state-overrides.ts` (which already holds `STATE_OVERRIDES` as a multi-spoke map, currently with only `"offer-in-compromise-calculator"` populated). Register it by adding `"retirement-savings-calculator": RETIREMENT_SAVINGS_STATE_OVERRIDES` to the exported `STATE_OVERRIDES` object.
- **State list source of truth:** `src/data/states.ts` (`STATES: StateContext[]`) already contains the canonical 50-state slug/name/USPS list — reuse it, do not redefine state slugs.
- **No island/component changes needed** — the state route reuses the parent spoke's `islandId` (`retirement`) and preset exactly as the OIC and probate state pages already do.
- **Verification dependency:** current-year (2026) state tax treatment of retirement income for each of the 10 states must be confirmed against each state's department of revenue/taxation site before publish — flag this explicitly in the PR/build ticket since tax law changes yearly and this content directly informs a user's retirement financial decision (YMYL-adjacent).
