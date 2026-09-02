# Asset Spec: Dividend Income Calculator

**Prepared:** 2026-09-02 · Autocomplete keyword-gap pass (`autocomplete-pass-auto`, portfolio calculator seed) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-09-02.md`, new-content row 13 ("not modeled by the current expected-return calculator, which doesn't isolate dividend income").

## 1. Target route/URL

`/portfolio/dividend-income-calculator/`

New `SpokeEntry` under `calculator: "portfolio"`, added to the existing `src/data/spokes-portfolio.ts` (`PORTFOLIO_SPOKES` array) — same "existing spokes file, new entry only" situation as the portfolio-longevity spec; no new data file needed for this route.

## 2. Recommended format + rationale

**Format: a new interactive calculator.** The cluster is dense and clearly tool-seeking — "portfolio dividend yield calculator," "portfolio drip calculator," "stock portfolio calculator with dividends," "portfolio income calculator" — visitors want to enter a yield and a horizon and see a dollar figure, not read an explainer.

Confirmed against `src/lib/portfolio.ts`: `ASSETS` models each asset class with a single `expectedReturn` figure (stocks 10%, bonds 4%, real estate 8%, cash 2.5%) that blends price appreciation and income together into one number — there is no `dividendYield` field anywhere in the file, no DRIP (dividend reinvestment) toggle, and `/portfolio/expected-return-calculator/`'s own row in this chart's metadata section confirms it "already computes weighted-average projected growth/return" as one combined figure. A visitor asking specifically about dividend *income* — the cash a portfolio throws off, separate from its price appreciation — cannot get that number from any live tool on the site today. This is a real, isolable sub-component of return the existing model deliberately doesn't split out (matching the site's convention of documenting model boundaries rather than pretending a broader tool already covers a narrower question).

## 3. What the asset computes — inputs → outputs, and the math

**Inputs:**
- `startingBalance` — current portfolio value.
- `dividendYieldPct` — the blended annual dividend/income yield on the balance (a direct user assumption, following the same "the user supplies the assumption, we don't hard-code a real fund's yield" convention `iul.ts` documents explicitly for cap rates and `portfolio.ts`'s own header comment documents for asset-class returns).
- `priceAppreciationPct` — expected price growth, kept *separate* from the yield (this separation is the entire point of the tool — total return = price appreciation + dividend yield, and this calculator's job is showing the yield slice on its own).
- `dividendGrowthPct` — annual growth rate of the dividend itself (a distinct, commonly cited figure — e.g., "dividend growth investing" — separate from price appreciation; default 0 if unset, so a flat-yield model is available as the simple case).
- `drip: boolean` — whether dividends are reinvested (compounding the balance that future dividends are paid on) or paid out as cash (balance grows only from price appreciation; dividends accumulate separately as a running cash total).
- `additionalAnnualContribution` (optional) — mirrors `computePortfolio()`'s `monthlyContribution` convention, converted to an annual figure for this loop.
- `years`.

**Math — new year-by-year loop** (no closed-form shortcut, matching the site's established convention — see `iul.ts`'s header: "Year-by-year loop... so every step is independently checkable by hand"):

For each year `y`:
1. `dividendThisYear = balance × currentYieldRate`, where `currentYieldRate` starts at `dividendYieldPct` and itself compounds by `dividendGrowthPct` each year (a growing yield-on-a-growing-balance, the standard "dividend growth investing" shape).
2. If `drip`: `balance += dividendThisYear` (reinvested) *before* applying price appreciation that year, so reinvested dividends also participate in price growth going forward — the compounding mechanic DRIP calculators exist to show.
   If not `drip`: `cumulativeCashDividends += dividendThisYear`; the balance does **not** grow from the dividend, only from price appreciation.
3. `balance *= (1 + priceAppreciationPct/100)` (applies regardless of DRIP mode — price appreciation is separate from the yield decision).
4. `balance += additionalAnnualContribution` (if any).
5. Track `yieldOnCost = dividendThisYear / originalCostBasis` each year — a commonly searched-for figure distinct from the *current* yield (`dividendThisYear / balance`), and worth reporting separately since it's exactly the kind of number a DRIP calculator should surface (an investor's income relative to what they originally put in, which rises over time under DRIP + dividend growth even if the *current* yield percentage looks flat).

**Optional secondary framing tied to the existing multi-asset model:** rather than treating this as a fully separate single-number tool, the spec should flag for the builder that `portfolio.ts`'s existing `ASSETS` table could eventually be extended with a parallel per-asset-class yield split (e.g., stocks ~1.3% dividend / ~8.7% appreciation of their blended 10%, bonds counted as ~100% "yield" since a coupon *is* income, cash's 2.5% likewise ~100% yield) so this calculator could someday take the same four-asset-class allocation inputs as the rest of `/portfolio/` instead of one aggregate yield figure — consistent with the hub's existing modeling conventions. That extension is **not required to ship a correct, useful v1** of this spoke (a single blended `dividendYieldPct` input, as specified above, is sufficient and matches the query cluster's own framing — "portfolio dividend yield calculator," not "asset-class dividend calculator") — it's flagged here only as a natural follow-up a builder should know is consistent with the site's existing engine, not as part of this spec's scope.

**Outputs:** year-by-year table (balance, dividend income that year, cumulative cash dividends if not DRIP, yield-on-cost); ending balance with vs. without DRIP (run both modes and show the delta — the single most persuasive number a DRIP calculator produces); total dividends received over the horizon; final yield-on-cost.

## 4. Primary + secondary keywords

- **Primary:** "portfolio dividend yield calculator"
- **Secondary:** "what is portfolio yield," "portfolio calculator dividend," "portfolio growth calculator with dividends," "portfolio calculator with dividends," "portfolio calculator with drip," "portfolio drip calculator," "portfolio yield calculator," "stock portfolio yield calculator," "stock portfolio calculator with dividends," "portfolio income calculator," "portfolio interest calculator" — every variant pulled verbatim from the chart row's `problem` cell. ("Portfolio ytd calculator" also appears in the row; year-to-date performance isn't really the same concept as dividend yield, and it's a looser fit than the rest of this cluster — flagged here for completeness per the mandate to list every mined variant, but the page copy shouldn't force a YTD-performance feature into a dividend/DRIP tool; if it needs addressing at all, an FAQ distinguishing "portfolio yield" from "portfolio YTD return" is the lighter-weight fix.)

## 5. Word count / scope estimate

Matching the `SpokeEntry` shape:
- `intro`: ~100–140 words, opening with the price-appreciation-vs-yield distinction and why the expected-return calculator's single blended figure doesn't answer "how much income will this throw off."
- `howItWorks`: ~350–500 words — the DRIP-vs-cash mechanic, dividend growth compounding, and the yield-on-cost concept, at the density level of the existing portfolio spokes.
- `commonMistakes`: 5 items (~150–200 words) — e.g., confusing current yield with yield-on-cost, assuming a high current yield always means more total return (ignoring price appreciation entirely), forgetting DRIP taxes dividends as income in a taxable account even though nothing was withdrawn (a real, checkable IRS rule worth one line, not a full tax-treatment build-out), treating a stated yield as guaranteed rather than a model assumption.
- `workedExample`: one scenario (~100–150 words) — a stated balance, yield, and appreciation rate, shown with DRIP on vs. off over a chosen horizon.
- `faqs`: 6–8 pairs (~350–500 words) — "what is DRIP," "is dividend income taxed even if I reinvest it," "what's a good dividend yield for a portfolio," "yield-on-cost vs. current yield," cross-linking to `/portfolio/expected-return-calculator/` for the combined-return version of the same question.
- **Total copy: ~900–1,150 words**, consistent with the existing portfolio spokes.

## 6. Technical dependencies

- **`src/lib/dividend-income.ts`** — new file, new pure function `computeDividendIncome(input)` implementing the loop in Section 3. Deliberately independent of `portfolio.ts`'s multi-asset allocation model for v1 (single blended yield input, per Section 3's scope note), so it doesn't need any change to the existing `ASSETS`/`CORRELATION` tables or `computePortfolio()`'s behavior.
- **`src/components/DividendIncomeCalculator.tsx`** — new React island; a DRIP-on/DRIP-off toggle with a side-by-side ending-balance comparison is the core UI, closest existing precedent being `AutoRefinanceCalculator.tsx`'s two-scenario comparison layout (keep-current-loan vs. refinance) applied here to (no-DRIP vs. DRIP).
- **Registration:** add `"dividend-income": DividendIncomeCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`; the new `SpokeEntry` needs `islandId: "dividend-income"` set explicitly (same override mechanism as the other specs in this pass).
- **`LIVE_IDS` in `src/data/registry.ts`:** no change needed — ships under the existing `"portfolio"` hub.
- No new top-level data file needed — slots into the existing `PORTFOLIO_SPOKES` array once built.
