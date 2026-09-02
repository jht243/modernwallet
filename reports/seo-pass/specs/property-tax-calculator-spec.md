# Asset Spec: Property Tax Calculator

**Prepared:** 2026-09-02 · Autocomplete keyword-gap pass (`autocomplete-pass-auto`, elder/estate/other seeds) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-09-02.md`, new-content row 20 (autocomplete polysemy: "real estate tax" means property tax here, not inheritance/estate tax — "previously identified 2026-07-08 as a gap and still not built").

## 1. Target route/URL

`/real-estate/property-tax-calculator/`

New `SpokeEntry` under `calculator: "real-estate"`, added to the **existing** `src/data/spokes-real-estate.ts` (`REAL_ESTATE_SPOKES` array, currently 9 entries: `cash-flow-calculator`, `rental-income-calculator`, `cap-rate-calculator`, `cash-on-cash-return-calculator`, `roi-calculator`, `depreciation-calculator`, `rental-income-tax-calculator`, `airbnb-calculator`, `capital-gains-calculator`) — the real-estate hub already has a working spokes file, so this needs only a new array entry.

**NET-NEW check:** confirmed this route does not exist — no `property-tax` slug appears anywhere in `spokes-real-estate.ts`'s existing 9 entries, and the site's routing is fully dynamic (`src/pages/[category]/[slug].astro` renders whatever exists in the relevant `src/data/*.ts` array — there is no per-route file to check separately).

## 2. Recommended format + rationale

**Format: a new interactive calculator, distinct from every existing real-estate spoke.** The chart is explicit that this is genuine autocomplete polysemy: "real estate tax calculator by zip code / california / missouri / michigan / nj / nyc / texas / virginia" is how people search for a **property tax** estimator, not an inheritance/estate tax tool — confirmed distinct from `/estate-planning/estate-tax-calculator/`, which already exists and covers federal + state inheritance/estate tax (per this same chart's metadata section, row on `estate-tax-calculator`). This was flagged as a gap in a prior pass (2026-07-08) and still isn't built.

Confirmed against the existing real-estate engine, `src/lib/rental.ts`: `RentalInput.propertyTaxAnnual` exists only as a **flat dollar amount the user must already know** — it's passed straight through into `fixedOpEx` with no derivation logic anywhere in the file (no assessed-value input, no rate table, no state lookup). None of the 9 existing real-estate spokes computes a property tax bill from a home's value and location — they all take the annual tax bill as a given input. This calculator is the missing piece that derives that dollar figure, which every other real-estate and mortgage calculator on the site currently assumes the visitor already has in hand.

## 3. What the asset computes — inputs → outputs, and the math

**Inputs:**
- `assessedValue` (or `marketValue` + an `assessmentRatioPct` field, since a number of states assess below 100% of market value — the calculator should let the user enter whichever number they actually have).
- `state` — drives the default effective tax rate (see the state-data mechanism below).
- `homesteadExemptionAmount` (optional) — many states reduce the taxable assessed value for an owner-occupied primary residence by a flat dollar amount or percentage; default 0 (investment/rental property, or a state with no such exemption).
- `millageRateOverride` (optional) — lets a visitor who already knows their exact local mill rate (a county/school-district-level figure this site cannot look up without a live assessor-data source — see the explicit limitation below) enter it directly instead of relying on the state average.

**Math:**

`taxableValue = max(0, assessedValue − homesteadExemptionAmount)`
`annualTax = taxableValue × (millageRateOverride ?? stateAverageEffectiveRatePct) / 100`
`monthlyTax = annualTax / 12` (the escrow-relevant figure, directly reusable in a PITI context)

This is deliberately simple multiplication — the real value in this calculator isn't novel math, it's supplying the **rate** a visitor doesn't already have. That's consistent with how the site's existing PITI spoke already treats property tax: `spokes-mortgage.ts`'s PITI page has a live FAQ, "How do I estimate property taxes for my PITI?", answering "divide the annual property tax bill by 12... use the county's current millage rate applied to the assessed value. The national average is about 1.1% of assessed value per year, per the Tax Foundation, but local rates vary significantly" — this new spoke is the calculator that FAQ describes in prose but that doesn't exist as a tool anywhere on the site today. Reuse the same source (Tax Foundation's "Property Taxes by State" dataset, already cited in `spokes-mortgage.ts`) for the state-average rate table, for consistency with the figure the site already publishes elsewhere.

**Honesty requirement — must be stated plainly on the page, not buried:** the "by zip code" query cannot be genuinely serviced by this calculator. Real property tax rates vary by county and even by individual school/special-assessment district within a state — a true zip-code-level lookup requires a live county-assessor data source this site has no access to and doesn't fetch (same "no external market/live data anywhere in `src/lib/`" fact noted in the portfolio-comparison-calculator spec in this same batch). The page should use state-level average effective rates as the default, prominently label them as state averages rather than a specific address's real bill, and offer the `millageRateOverride` field as the accurate path for a visitor who already has their own county's rate — matching this site's established convention of stating an estimate's real limits rather than implying more precision than the model has (see the net-price-college and IUL specs' honesty framing).

**NYC-specific flag for the builder:** New York City runs its own property tax system (a class-based assessment structure) distinct from New York State's general county-level approach — the state-average model will be meaningfully off for NYC specifically, given "real estate tax calculator nyc" is one of the row's own mined keywords. The spec recommends the page copy note this explicitly rather than silently applying the NY state average to an NYC query, and flags a possible follow-up NYC-specific note/override as a future enhancement, not required for v1.

**Outputs:** estimated annual property tax; monthly-equivalent (escrow) figure; comparison against the 1.1% national average already cited on the mortgage PITI page; comparison against the selected state's average; taxable value after any homestead exemption applied.

## 4. Primary + secondary keywords

- **Primary:** "real estate tax calculator" (the disambiguated, property-tax sense)
- **Secondary:** "real estate tax calculator by zip code," "real estate tax calculator california," "real estate tax calculator missouri," "real estate tax calculator michigan," "real estate tax calculator nj," "real estate tax calculator nyc," "real estate tax calculator texas," "real estate tax calculator virginia" — every variant pulled verbatim from the chart row's `problem` cell. The eight state/locality-branded variants map directly onto the `stateVariants` mechanism described in Section 6, rather than needing eight separate hand-written pages.

## 5. Word count / scope estimate

Matching the `SpokeEntry` shape:
- `intro`: ~110–150 words, opening with the explicit property-tax-not-estate-tax disambiguation (mirroring the site's existing convention for autocomplete-polysemy pages, e.g. the net-price-college spec's net-worth disambiguation) and a link to `/estate-planning/estate-tax-calculator/` for visitors who actually meant inheritance/estate tax.
- `howItWorks`: ~350–500 words — assessed value vs. market value, what a millage rate is, the homestead-exemption concept, and the explicit "this is a state-average estimate, not your actual bill" limitation.
- `commonMistakes`: 5 items (~150–200 words) — e.g., confusing market value with assessed value, forgetting a homestead exemption applies only to a primary residence (not a rental), assuming the state average applies precisely to their own county, confusing property tax with the unrelated estate/inheritance tax.
- `workedExample`: one scenario (~100–150 words) — a stated assessed value and state, with and without a homestead exemption.
- `faqs`: 6–8 pairs (~350–500 words) — "what is the difference between real estate tax and estate tax," "how is property tax calculated," "what is a millage rate," "what is a homestead exemption," "why is my actual tax bill different from this estimate" — the last one doing the honesty-framing work directly in FAQ form.
- **Total copy: ~950–1,200 words**, in line with the existing real-estate spokes' scope, plus the state-page content described below.
- **State-subpage content (see Section 6):** if the `stateVariants` mechanism is used, each of the 50 states additionally needs a `StateOverride`-shaped `lawContext` paragraph (2–3 sentences) giving that state's actual average effective rate and any notable state-specific mechanic (e.g., a state-wide assessment cap, a notable homestead-exemption program) — this is the same per-state content lift already budgeted for in every other stateVariants-bearing spoke on the site (e.g. the OIC calculator's `state-overrides.ts`), not unique overhead this spec introduces.

## 6. Technical dependencies

- **`src/lib/property-tax.ts`** — new file, new pure function `computePropertyTax(input)` implementing the math in Section 3.
- **New state-rate data file, `src/data/property-tax-state-overrides.ts`** — following the exact convention `src/data/state-overrides.ts` already establishes for the OIC calculator (a `Record`/array keyed by state slug, matching `STATES` in `src/data/states.ts`), holding each state's average effective property-tax rate (sourced from Tax Foundation, same source already cited on the mortgage PITI spoke) as the `StateOverride.costFactor`-equivalent multiplier — this is exactly the field `types.ts` already documents as "multiplier applied to the parent spoke's baseline cost estimate for this state," so the site's existing state-subpage mechanism (`/[category]/[slug]/[state]/`, already live and routing) can serve the eight state-branded keyword variants (and the other 42 states, per the site's usual all-50-states convention) without any new routing work.
- **`src/components/PropertyTaxCalculator.tsx`** — new React island; a straightforward single-scenario input/output form, simpler than every other spec in this batch (no dual-scenario or year-by-year table needed — this is fundamentally a one-shot calculation, closer in shape to `PrenupCostCalculator.tsx` or `WillCostCalculator.tsx`'s single-result-panel pattern than to the multi-year-projection calculators elsewhere on the site).
- **Registration:** add `"property-tax": PropertyTaxCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`; the new `SpokeEntry` needs `islandId: "property-tax"` set explicitly (real-estate's default island, `RentalCalculator`, doesn't fit this spoke).
- **`LIVE_IDS` in `src/data/registry.ts`:** no change needed — ships under the existing `"real-estate"` hub.
- The new `SpokeEntry` should set `stateVariants: STATES.map(s => s.slug)` (reusing the existing `STATES` array from `src/data/states.ts` verbatim, per its own header comment: "50-state reference table used by the state-subpage route... and by state-aware calculator engines") to activate the `/real-estate/property-tax-calculator/[state]/` route pattern already built into the site.
- No new top-level spoke-array data file needed for the base route — slots into the existing `REAL_ESTATE_SPOKES` array once built; only the new `property-tax-state-overrides.ts` file is genuinely new data infrastructure.
