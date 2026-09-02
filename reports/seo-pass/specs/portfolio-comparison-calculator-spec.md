# Asset Spec: Portfolio Comparison Calculator

**Prepared:** 2026-09-02 · Autocomplete keyword-gap pass (`autocomplete-pass-auto`, portfolio calculator seed) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-09-02.md`, new-content row 16 ("a coherent, buildable feature distinct from backtesting").

## 1. Target route/URL

`/portfolio/portfolio-comparison-calculator/`

New `SpokeEntry` under `calculator: "portfolio"`, added to the existing `src/data/spokes-portfolio.ts` (`PORTFOLIO_SPOKES` array) — same "existing spokes file, new entry only" situation as the two other portfolio specs in this pass.

## 2. Recommended format + rationale

**Format: a new interactive calculator**, explicitly **not** a historical backtester. The chart's own solution text draws this line correctly, and it matters for scope: "portfolio backtest calculator," "portfolio visualizer calculator," and similar historical-simulation queries are logged elsewhere in this same chart as a *roundup* row pointing to third-party tools (Portfolio Visualizer, Portfolio Charts), because this site's engine is a forward-looking estimator with no historical price database behind it — building a real backtester is a different, much larger project. This row's cluster — "portfolio comparison calculator," "portfolio overlap calculator," "stock/etf portfolio overlap calculator," "portfolio benchmark calculator" — is asking a narrower, buildable question: **given two allocations I define right now, how do they compare** on the model this site already runs for one allocation at a time.

Confirmed against `src/lib/portfolio.ts`: `computePortfolio()` takes exactly one allocation and returns exactly one result set — there is no comparison mode, no second allocation input, and no overlap concept anywhere in the file. `PortfolioCalculator.tsx` (the hub's live island) renders a single result panel. Nothing on the site today puts two allocations side by side.

## 3. What the asset computes — inputs → outputs, and the math

**Inputs:** two independent `PortfolioInput` sets (Portfolio A and Portfolio B — same four fields each: `stocks`, `bonds`, `realEstate`, `cash`, plus a shared or independently-set `monthlyContribution`/`years`).

**Math — almost entirely reuse, by design:**

1. Call the existing `computePortfolio()` **twice**, once per allocation — `computePortfolio(inputA)` and `computePortfolio(inputB)`. This is the core of the tool and requires zero new return/volatility/Sharpe math; every figure the comparison displays (expected return, volatility, Sharpe ratio, projected growth) is already correctly computed by the live engine today. This is the lowest-risk calculator spec in this pass precisely because it adds no new financial modeling — it's a side-by-side presentation layer over an engine that already works.

2. **Asset-class overlap score — the one genuinely new piece of math, and it must be scoped honestly.** The mined cluster includes "portfolio overlap calculator," "stock portfolio overlap calculator," and "etf portfolio overlap calculator" — in the real investing world, "fund overlap" almost always means *holdings-level* overlap (e.g., VOO and VTI both hold Apple, Microsoft, etc., so a fund-overlap tool reports what percent of each fund's *underlying stocks* also sit in the other). **This site has no per-fund constituent holdings data and does not fetch any live market data anywhere in its codebase** (confirmed: nothing in `src/lib/` makes an external API call; every calculator here is a pure, offline model over user-supplied inputs). Building a true fund-holdings overlap tool would require licensing or scraping per-ETF constituent data — a materially different, much larger project than this spec, and out of scope here.
   
   What **is** buildable from the existing engine, honestly labeled as such: an **asset-class overlap score**, not a fund-holdings overlap score — `overlapScore = Σ min(weightA_k, weightB_k)` across the four `AssetKey` values already exported from `portfolio.ts` (`stocks`, `bonds`, `realEstate`, `cash`). Two portfolios that are both 100% stocks score 100% "overlap" at the asset-class level even if they hold completely different individual stocks or funds — the page's copy must say this plainly and prominently (matching this site's established honesty convention, e.g. the IUL hub's "no carrier's real cap... is hard-coded" framing and the net-price-college spec's "this is a rough estimate" requirement), not imply it's measuring true fund-holdings overlap when a visitor from the "etf portfolio overlap calculator" query specifically wants that.

3. **Delta view:** report the difference in each headline figure (`expectedReturnPct`, `volatilityPct`, `sharpeRatio`, `projectedValue`) between A and B directly, so the page can lead with "Portfolio B has a 1.2 percentage-point higher expected return and 2.8 points more volatility than Portfolio A" rather than making the reader do the subtraction.

**Outputs:** two full `PortfolioResult` objects (A and B) shown side by side; the delta figures from step 3; the asset-class overlap score from step 2, with explicit "this measures overlap by asset class, not by fund holdings" framing in both the UI copy and the page's `howItWorks` text; both portfolios' growth schedules on one shared chart for visual comparison.

## 4. Primary + secondary keywords

- **Primary:** "portfolio comparison calculator"
- **Secondary:** "portfolio overlap calculator," "stock portfolio overlap calculator," "etf portfolio overlap calculator," "portfolio benchmark calculator" — every variant pulled verbatim from the chart row's `problem` cell. Note for whoever builds this: "portfolio benchmark calculator" more commonly means "how does my portfolio compare to a market index like the S&P 500" than "compare two allocations I define" — that's a related but distinct framing (a live benchmark index return isn't a `PortfolioInput` this engine has), and the FAQ section should address it directly (e.g., "how does my portfolio compare to the S&P 500" answered by pointing out a 100%-stock Portfolio B *is* a rough S&P-500-like proxy under this model's assumptions) rather than silently treating the keyword as fully covered by the two-custom-allocations tool.

## 5. Word count / scope estimate

Matching the `SpokeEntry` shape:
- `intro`: ~100–140 words, framing the two-allocations-side-by-side use case and stating upfront that "overlap" here is asset-class-level, not fund-holdings-level (the honesty framing needs to appear early, not buried).
- `howItWorks`: ~400–550 words — slightly longer than the typical portfolio spoke's `howItWorks` because the overlap-score scope limitation needs real explanation (why true fund overlap isn't offered, what asset-class overlap does and doesn't tell you), on top of the standard "how the two allocations are each modeled" content that mostly restates `asset-allocation-calculator`'s existing explanation.
- `commonMistakes`: 5 items (~150–200 words) — e.g., mistaking the asset-class overlap score for true fund-holdings overlap, comparing two allocations with different total dollar amounts and expecting a fair growth comparison without adjusting for that, over-indexing on the higher-expected-return portfolio without weighing its higher volatility.
- `workedExample`: one scenario (~120–170 words) — e.g., a 70/30 stock/bond allocation vs. a diversified four-asset-class mix, showing the return/risk/overlap delta.
- `faqs`: 6–8 pairs (~350–500 words) — "what is portfolio overlap and how is it calculated here," "does this compare my actual ETF holdings," "how do I compare my portfolio to the S&P 500," "which portfolio is 'better' — return or risk-adjusted."
- **Total copy: ~950–1,200 words**, slightly above the typical portfolio-spoke baseline given the overlap-scope explanation.

## 6. Technical dependencies

- **`src/lib/portfolio.ts`** (extend, don't replace) — add a thin new exported function `comparePortfolios(a: PortfolioInput, b: PortfolioInput)` that calls the existing `computePortfolio()` twice and computes the overlap score using the already-exported `KEYS`/`AssetKey` list — no changes to `computePortfolio()`'s own behavior, so every existing page using it is unaffected (matching the non-destructive-addition convention already used elsewhere in this codebase, e.g. `investment.ts`'s own comment on `maxSustainableWithdrawal()`: "Pure addition... does not read or alter `computeInvestment`... behavior").
- **`src/components/PortfolioComparisonCalculator.tsx`** — new React island. Two side-by-side instances of `PortfolioCalculator.tsx`'s existing allocation-input UI feeding one shared comparison/delta panel — the closest and most directly reusable existing UI precedent on the site is `AutoRefinanceCalculator.tsx`'s "two input sets, one result panel" pattern (its own header comment: "two input sets, one result panel"), which is structurally exactly what this spoke needs, just with `PortfolioInput` fields instead of loan terms.
- **Registration:** add `"portfolio-comparison": PortfolioComparisonCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`; the new `SpokeEntry` needs `islandId: "portfolio-comparison"` set explicitly (same override mechanism as the other two portfolio specs in this pass).
- **`LIVE_IDS` in `src/data/registry.ts`:** no change needed — ships under the existing `"portfolio"` hub.
- No new top-level data file needed — slots into the existing `PORTFOLIO_SPOKES` array once built.
- **Explicitly out of scope, flagged for the human builder, not to be silently attempted:** true fund/ETF holdings-level overlap (would require external constituent-holdings data this site has no source for) and true historical backtesting (would require a historical price database this site has no source for, and is already logged separately in this chart's roundup row pointing to third-party tools).
