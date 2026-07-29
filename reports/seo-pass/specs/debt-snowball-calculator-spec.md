# Asset Spec: Debt Snowball Calculator

**Prepared:** 2026-07-29 · Google-Autocomplete keyword-gap pass (`autocomplete-pass-auto`) · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

`/budget/debt-snowball-calculator/`

New `SpokeEntry` under `calculator: "budget"`, added to `src/data/spokes-budget.ts`, with a matching interactive tool at `src/components/DebtSnowballCalculator.tsx` + engine at `src/lib/debt-snowball.ts` (neither exists yet).

This exact route was already identified and charted as `create new content / interactive tool` in the 2026-06-30 `keyword-gap-pass` (SEMRUSH Lens-1 competitor gap, "debt snowball", volume 12,100, tier adjacent — see `reports/keyword-pass/2026-06-30.md` line 158 and `2026-06-30.keywords.csv` line 56). It was never built — no spec, no component, no lib file exists in the repo (confirmed via search). This pass's mining reconfirms live demand: 111 raw Autocomplete suggestions for the seed "debt snowball calculator," almost entirely the head term and its direct variants (a much higher actionable-signal density than the bank/competitor-brand noise seen on the other seeds this run).

## 2. Recommended format + why

**Format: a new interactive calculator spoke**, matching the pattern of every other calculator in `src/data/spokes-budget.ts` under the `/budget/` hub.

Why: the query signal is overwhelmingly tool-seeking — "debt snowball calculator," "how to make a debt snowball calculator," "debt payoff calculator snowball method," "debt snowball timeline calculator," "debt snowball repayment calculator," "snowball debt elimination calculator" — readers want to enter their own debts and get a real payoff order + timeline, not just read about the method. The site already has excellent **conceptual** coverage of the *method* at `/compare/debt-snowball-vs-avalanche/` (built 2026-07-21, includes a worked numeric example comparing the two methods on one hypothetical debt set) — but that page has no interactive tool, and a reader with their OWN 3–6 debts cannot currently get a personalized snowball order/timeline anywhere on the site. This is a genuine gap, not a duplicate.

## 3. What the asset does — inputs → outputs

**Inputs:**
- A repeatable list of debts (name, balance, APR, minimum payment) — realistically 2–8 rows, add/remove row UI
- Extra monthly amount available to put toward debt (beyond the sum of minimums)

**Outputs:**
- **Payoff order**: debts sorted smallest-balance-first (the snowball rule), each with its own payoff month
- **Month-by-month schedule** (or at minimum a per-debt summary row): payoff date, total interest paid on that debt, running "debt-free date" for the whole plan
- **Total interest paid** and **months to debt-free** across the whole plan
- **Cross-link, always rendered**: a prominent link to `/compare/debt-snowball-vs-avalanche/` inviting the reader to also see the avalanche-order numbers for the exact same debts (reuses the same amortization-loop engine pattern already proven in `src/lib/auto-loan.ts` / `src/lib/business-loan-payoff.ts` — same rolling-extra-payment loop, just applied per-debt-in-sequence instead of to one balance) — this is the natural place to eventually also expose an "avalanche order" toggle, but that is out of scope for this spec; ship snowball-only first.

## 4. Primary + secondary keywords

- **Primary:** "debt snowball calculator"
- **Secondary:** "debt payoff calculator snowball method," "debt snowball method calculator," "debt snowball timeline calculator," "debt snowball repayment calculator," "how to make a debt snowball calculator"

## 5. Word-count/scope estimate

Calculator-page format (short intro + how-it-works + FAQ, matching every other `/budget/` spoke) — roughly 700–900 words of surrounding copy, same shape as existing budget spokes. The bulk of the engineering scope is the tool itself, not the copy.

## 6. Technical dependencies

- `src/lib/debt-snowball.ts` — new pure engine. Core loop: sort input debts by balance ascending; each month, pay every debt's minimum, then apply the total extra (own extra + freed-up minimums from already-paid-off debts, the "snowball" rollover) to the current smallest remaining balance; record per-debt payoff month + total interest; stop when all balances hit 0 or after a sane month cap (e.g. 600 months) to avoid an infinite loop on an unpayable input (extra + minimums < total interest accrual).
- `src/components/DebtSnowballCalculator.tsx` — new React island; needs a repeatable-row input UI (add/remove debt), which is a new UI pattern for this codebase (every existing calculator takes a fixed set of scalar inputs) — the most notable net-new engineering surface here, not just a copy/paste of an existing calculator.
- Registration in `src/components/CalculatorIsland.tsx` / the island registry (per `calculators.ts`'s comment: "A calculator is 'live' ... only once its island is registered") before the spoke goes live.
- New `SpokeEntry` in `src/data/spokes-budget.ts` (`calculator: "budget"`, `slug: "debt-snowball-calculator"`).

**No placeholder route was wired this pass** — `/budget/` spokes are 100% data-driven (`SpokeEntry[]` consumed by `[category]/[slug].astro`); there is no per-route file to stub, and adding a `SpokeEntry` without a registered island would render a broken/empty tool on a live URL. The safe placeholder is this spec file itself (tracked in git); a human (or a future pass with calculator-build scope) implements the engine + component, registers the island, then adds the `SpokeEntry`.

## 7. Not built this pass

Per the non-article Phase-3 rule: this spec IS the deliverable. No stub page, no placeholder route, no component skeleton was created — only this file.
