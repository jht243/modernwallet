# Asset spec — Cybercab fleet income calculator

- **Route:** `/cybercab-fleet-income/` (top-level, the pattern every calculator on this site uses: `src/pages/[category]/index.astro` builds hubs from `CALCULATORS.filter(isLive)` and links `/${c.id}/`). NOT `/calculators/<id>/`.
- **Calculator id:** `cybercab-fleet-income`
- **Format + rationale:** interactive tool. The cluster is ROI intent ("is cybercab a good investment", "tesla robotaxi fleet", "robotaxi business"), and the live SERP for the head is Reddit, Facebook, YouTube, Electrek commentary and stock-analyst posts. The DataForSEO read's own `recommended_shape` for that head is "experience-led / operator-voice or interactive tool". Nobody on page one lets a reader put in their own numbers. That is this site's only real differentiator here.
- **Source row:** chart `reports/mindmap-pass/2026-09-09-cybercab.md`, row 1.
- **Depends on:** `/guides/cybercab-cost-of-ownership/` (the cost lines this tool takes as inputs) and `/guides/can-you-buy-a-cybercab/` (eligibility). Both shipped in this pass.

## What it does

**Inputs** (all user-supplied; the tool ships NO Tesla figure as a default, because Tesla has published no price, no fare card and no revenue split):
| Input | Unit | Notes |
|---|---|---|
| Vehicle purchase price | $ | Musk stated a sub-$30,000 target in Oct 2024. Placeholder text says "target only, Tesla has published no price". Field starts empty. |
| Down payment | $ | |
| APR | % | |
| Loan term | months | |
| Paid ride hours per day | hours | The break-even driver. |
| Days operated per week | days | |
| Average revenue per paid hour | $ | User's own assumption. No default. |
| Platform revenue share kept by operator | % | No default. Tesla has published no split. |
| Electricity cost | $ per kWh | DC fast charging only (NACS, 48 kWh pack, ~293 mi range), so no cheap overnight AC rate. |
| Energy use | kWh per mile | Required input. Default 0.164 kWh/mi, DERIVED from the published 48 kWh pack over 293 mi of range (FACTS A) and labelled as derived, not as a Tesla spec. |
| Miles per paid hour | miles | With energy use, gives the energy cost per hour. |
| Assumed resale value at year 5 | $ | Feeds output 4. Depreciation drives this, not the cash-flow outputs. |
| Insurance | $ per year | Commercial autonomous vehicle. |
| Cleaning + depot handling | $ per month | |
| Maintenance | $ per year | |
| Annual depreciation | % of value | Non-cash. It affects ONLY the year-5 resale figure in output 4, never the cash-flow outputs. Flag: resale is an open question while the NHTSA self-certification investigation is unresolved. |

**Outputs:**
1. Monthly gross revenue, monthly operating cost, monthly loan payment, **monthly net cash flow**.
2. **Break-even paid hours per day** — the headline number, and the one no competitor publishes: the daily paid-ride hours at which net cash flow reaches zero. **Boundary rules:** if the per-hour contribution margin is zero or negative, or the solve exceeds 24 hours a day, print "no break-even at these assumptions" rather than a number. Never render an impossible figure such as 41 hours a day.
3. Payback period on the down payment plus cumulative negative cash flow. **If cumulative cash flow never turns positive, print "never at these assumptions" rather than a number.**
4. Five-year cumulative net cash flow **plus the assumed year-5 resale value, minus any loan balance still outstanding at month 60** (terms longer than 60 months leave a balance), and total return against total cash invested.
5. A sensitivity strip: net cash flow at the user's utilization minus 25%, at their figure, and plus 25%.

**Answer block (AEO):** one directly-extractable sentence above the tool stating that Tesla has published no Cybercab price, no fleet terms and no revenue split, so any return figure is the reader's own assumptions rather than a quote, and naming break-even utilization as the number that decides it.

## Build wiring (5 files, matching the `coast-fire` and `zakat` precedents)
1. `src/lib/cybercab-fleet-income.ts` — the engine (pure functions, exported constants, no React).
2. `src/components/CybercabFleetIncomeCalculator.tsx` — the island.
3. `src/components/CalculatorIsland.tsx` — import + `ISLANDS` map entry (the single `client:only` entry point).
4. `src/data/calculators.ts` — `CALCULATORS` entry matching `CalculatorDef` in `src/data/types.ts`. Required fields: `id`, `islandId`, `label`, `navOrder` (required; `liveCalculators()` sorts on it), `h1`, `targetKeyword`, `introText`, `metaTitle`, `metaDescription`, `howItWorks`, `faqs`, `sources`, and `defaultPreset`. There is NO `category` field.
   **`defaultPreset` is required and non-optional, and it must NOT assert an unpublished Tesla figure.** Populate it only with fields the reader supplies from their own situation (APR, loan term, electricity cost, energy use). Leave purchase price, revenue per paid hour and revenue share OUT of the preset. A type error here must never be resolved by inventing a $30,000 default, which is the exact thing this spec exists to prevent.
5. `src/data/registry.ts` — add `"cybercab-fleet-income"` to `LIVE_IDS` (line 21). Note `isLive(c)` tests `LIVE_IDS.has(c.islandId)`, NOT `c.id`, so `id` and `islandId` must both be `cybercab-fleet-income`.

## Content rules the page copy must follow
- Never present the sub-$30,000 target as a price. Never state a fare or a revenue split. Never tell a reader that buying one will produce income.
- The closed fact list at `reports/mindmap-pass/2026-09-09-cybercab/prompts/FACTS.md` governs every figure on the page.
- Every result is labelled as following from the reader's own inputs.

## Status
**Spec only — not built in this pass.** Phase 3 of `/mindmap-pass` writes asset specs and does not build interactive assets. Building this is a follow-on task.
