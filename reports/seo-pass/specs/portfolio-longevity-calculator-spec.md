# Asset Spec: Portfolio Longevity Calculator

**Prepared:** 2026-09-02 · Autocomplete keyword-gap pass (`autocomplete-pass-auto`, portfolio calculator seed) · Phase-3 non-article asset spec (do not build — spec only). See `reports/keyword-pass/2026-09-02.md`, new-content row 12 ("the live tool only models accumulation, not drawdown longevity").

## 1. Target route/URL

`/portfolio/portfolio-longevity-calculator/`

New `SpokeEntry` under `calculator: "portfolio"`, added to the **existing** `src/data/spokes-portfolio.ts` (`PORTFOLIO_SPOKES` array, currently 7 entries — `asset-allocation-calculator`, `60-40-portfolio-calculator`, `expected-return-calculator`, `portfolio-risk-calculator`, `70-30-portfolio-calculator`, `80-20-portfolio-calculator`, `90-10-portfolio-calculator`) — unlike the IUL rows in this pass, the portfolio hub already has a working spokes file wired into `src/data/spokes.ts`'s `SPOKES` aggregator, so this spoke needs only a new array entry, not new infrastructure.

## 2. Recommended format + rationale

**Format: a new interactive calculator.** The query cluster is a tight, tool-seeking set — "how long will my portfolio last calculator," "portfolio longevity/survival/depletion calculator," "portfolio calculator with withdrawals," "portfolio reliance calculator" (including a branded variant, "portfolio reliance calculator capital group," grouped per this pass's inclusion-first policy) — every variant asking the same question: given a balance and a withdrawal, how long does the money hold up.

Confirmed against `src/lib/portfolio.ts`: `computePortfolio()` only ever *adds* money (`monthlyContribution`, compounding forward for `years`) — there is no withdrawal parameter, no depletion loop, and no "years funded" output anywhere in `PortfolioInput`/`PortfolioResult`. The hub is accumulation-only, exactly as the chart row states. This is a real, checkable gap distinct from `/portfolio/expected-return-calculator/` (also accumulation-only, per its own row in the metadata section of this chart) and from `/investing/withdrawal-calculator/`'s inverse `WithdrawalReverseCalculator.tsx` (solves for a *flat* sustainable monthly withdrawal over a fixed horizon at a *single* return rate — it doesn't take a multi-asset allocation as input, and it doesn't answer "how long does *this* withdrawal amount last," only "what's the max flat withdrawal for a chosen number of years").

## 3. What the asset computes — inputs → outputs, and the math

**Inputs:**
- Reuses `computePortfolio()`'s allocation inputs directly: `stocks`, `bonds`, `realEstate`, `cash` (dollar amounts), so the longevity calculation starts from the same blended expected-return/volatility model as the rest of the portfolio hub, rather than a single flat return rate like `retirement.ts`'s or `investment.ts`'s engines use.
- `withdrawalMode: "amount" | "rate"` — either a flat starting dollar withdrawal or a percent-of-balance rate (the classic "4% rule" framing several of the mined keywords echo).
- `annualWithdrawal` (or `withdrawalRatePct`, converted to a starting dollar amount against the total).
- `inflationAdjustPct` — whether/how much the withdrawal grows each year (default 3%, matching `retirement.ts`'s existing convention for the same concept).
- `maxYears` — a cap on the projection (default 50), since an under-withdrawing portfolio can technically run "forever" under a positive expected return and needs a sane display ceiling rather than an infinite loop.

**Math:**

1. Call the existing `computePortfolio()` unmodified to get `expectedReturnPct` and `volatilityPct` from the entered allocation — this is the one piece of real math reuse that keeps this spoke's output consistent with every other page under `/portfolio/` (the same asset-class assumptions, the same correlation-matrix-derived volatility, the same Sharpe-ratio framing already documented in `ASSETS`/`CORRELATION` at the top of `portfolio.ts`).

2. Run a depletion loop **structurally identical** to the one `src/lib/retirement.ts`'s `projectRetirement()` already implements for its own 4%-rule drawdown (lines ~60–72 of that file): `balance -= withdrawal` (start-of-year), `balance *= 1 + expectedReturn`, `withdrawal *= 1 + inflationRate`, incrementing a year counter until `balance < withdrawal` or `maxYears` is hit. The only generalization needed versus `retirement.ts`'s version is that this loop starts from an arbitrary current balance/return pair (the portfolio's own blended figures) rather than being wired specifically to `retirementAge`/`lifeExpectancy` — so this is best written as its own small, portfolio-scoped function rather than importing `retirement.ts`'s (which is intentionally coupled to the retirement-age framing per that file's own docstring), consistent with this codebase's established pattern of independent per-product copies of a shared loop shape (see `auto-loan.ts` vs. `business-loan-payoff.ts` vs. `personal-loan-payoff.ts`, each with its own header comment explaining the deliberate non-sharing).

3. **Best/worst-case range (optional, secondary output):** run the same depletion loop twice more at `expectedReturn ± volatility` (reusing `computePortfolio()`'s already-computed `volatilityPct`, the same ±1-SD convention that produces the hub's existing `oneYearBest`/`oneYearWorst` figures) to show a "your portfolio could last anywhere from X to Y years" range rather than a single point estimate — a meaningfully more honest framing than a single deterministic number for a multi-decade projection, and cheap to compute since it's the identical loop run three times.

4. **Reverse mode (secondary, reuses an existing function almost as-is):** "what's the most I can safely withdraw for N years" is already solved by `maxSustainableWithdrawal()` in `src/lib/investment.ts` — that function takes exactly `(currentBalance, annualReturnPct, years)` and returns the flat sustainable monthly withdrawal via the standard annuity-amortization formula. Feed it the portfolio's blended `expectedReturnPct` from step 1 instead of writing a second solver, and this calculator gets a working reverse mode for free.

**Outputs:** years the portfolio lasts at the entered withdrawal (capped at `maxYears`, with an explicit "lasts indefinitely at this rate" state when the loop never depletes); a best/worst-case year range; year-by-year balance table; the implied starting withdrawal rate (`annualWithdrawal / totalBalance`, directly comparable to the commonly cited 4% rule); reverse-mode output when the user instead enters a target number of years.

## 4. Primary + secondary keywords

- **Primary:** "portfolio longevity calculator"
- **Secondary:** "how long will my portfolio last calculator," "portfolio survival calculator," "portfolio depletion calculator," "portfolio calculator with withdrawals," "portfolio growth calculator with withdrawals," "portfolio goal calculator," "portfolio reliance calculator," "portfolio reliance calculator capital group" — every variant pulled verbatim from the chart row's `problem` cell. ("Portfolio goal calculator" is a looser fit than the rest of the cluster — closer to a target-balance calculator than a longevity one — but is grouped here per the chart's own classification and the site's inclusion-first keyword policy; the page copy can address it via an FAQ on "how much do I need to retire" framing without changing the core tool.)

## 5. Word count / scope estimate

Matching the `SpokeEntry` shape already used by the other six entries in `spokes-portfolio.ts`:
- `intro`: ~100–140 words, opening with the accumulation-vs-drawdown distinction and a pointer to `/portfolio/asset-allocation-calculator/` for the accumulation side.
- `howItWorks`: ~350–500 words — the depletion-loop mechanics, the 4%-rule framing, and the best/worst-case range explanation, in line with the density of the existing portfolio spokes' `howItWorks` sections (each currently runs two short paragraphs).
- `commonMistakes`: 5 items (~150–200 words) — e.g., withdrawing a flat percent of the *current* balance every year instead of an inflation-adjusted fixed amount (a real, commonly confused distinction in the retirement-income literature), ignoring sequence-of-returns risk in a single deterministic projection, assuming "indefinitely" means guaranteed rather than modeled.
- `workedExample`: one scenario (~100–150 words) mirroring the existing spokes' worked-example format — a stated allocation and withdrawal, resulting years-funded figure.
- `faqs`: 6–8 pairs (~350–500 words) — "what is a safe withdrawal rate," "how long will my portfolio last calculator vs. the 4% rule," "what happens if the market drops early in retirement (sequence risk)," cross-referencing `/portfolio/portfolio-risk-calculator/`'s existing volatility/drawdown FAQs rather than re-explaining volatility from scratch.
- **Total copy: ~900–1,150 words**, in line with the existing portfolio spokes' scope (comparable to `asset-allocation-calculator`'s ~900-word page).

## 6. Technical dependencies

- **`src/lib/portfolio-longevity.ts`** — new file. Exports `computePortfolioLongevity(allocation: PortfolioInput, withdrawal: {...})`, which calls `computePortfolio()` from `src/lib/portfolio.ts` for the return/volatility inputs, then runs the depletion loop described in Section 3. Also re-exports (or directly imports and calls) `maxSustainableWithdrawal()` from `src/lib/investment.ts` for reverse mode — no need to duplicate that solver.
- **`src/components/PortfolioLongevityCalculator.tsx`** — new React island. UI can closely follow `PortfolioCalculator.tsx`'s existing allocation-input layout (same four asset-class fields) plus a withdrawal-input section and a year-by-year table, similar in spirit to `WithdrawalReverseCalculator.tsx`'s schedule display.
- **Registration:** add `"portfolio-longevity": PortfolioLongevityCalculator` to the `ISLANDS` map in `src/components/CalculatorIsland.tsx`. Since this differs from the `portfolio` hub's default island (`PortfolioCalculator`), the new `SpokeEntry` needs `islandId: "portfolio-longevity"` set explicitly (the same override mechanism used elsewhere on the site, e.g. the auto-loan `affordability` spoke).
- **`LIVE_IDS` in `src/data/registry.ts`:** no change needed — `"portfolio"` is already present; this ships as a spoke under the existing hub.
- No new top-level data file needed (unlike the two IUL specs in this pass) — this entry slots directly into the existing `PORTFOLIO_SPOKES` array once built.
