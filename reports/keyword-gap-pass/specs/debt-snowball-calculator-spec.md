# Asset spec — Debt Snowball Calculator (interactive tool)

**Status:** spec only. Per `phase-3-new-content.md`, this run does NOT build the asset and does
NOT call the content generator for it — a working multi-debt payoff tool needs a real React
island component, which is an engineering task outside this content routine's scope. No
`calculators.ts` entry was added and no route file was created: this repo's calculator routes
are generated from the `CALCULATORS` data array at build time, and adding an entry without a
matching, working `islandId` component would either fail the build or ship a page with no
interactive tool on it (see `isLive()` / `LIVE_IDS` in `src/data/calculators.ts`). There is
nothing to stub without that component, so no placeholder was written.

## Proposed route

`/debt-snowball/` — a new top-level entry in `src/data/calculators.ts` (same pattern as
`credit-card-payoff`, `personal-loan`), once the `debt-snowball` island exists.

## Why this asset, and why now

- **6,600/mo measured search volume** for "debt snowball calculator" (DataForSEO, KD 12 — low
  competition for a real, sizable query).
- Live Google Autocomplete mining on 2026-09-23 surfaced ~95 raw suggestions asking for a
  working multi-debt tool, spanning every angle: app, online, Excel/Google Sheets/spreadsheet,
  template, biweekly, extra-payment, lump-sum, one-time-payment, amortization schedule,
  snowball-vs-avalanche toggle, plus explicit demand to match or beat named third-party tools
  (Ramsey Solutions' calculator, Undebt.it, Vertex42, WhatsTheCost, Crown Financial's
  calculator, Financial Mentor).
- **No existing asset on this site does this.** `credit-card-payoff` (`src/data/calculators.ts`)
  amortizes exactly ONE balance/APR pair; it has no concept of multiple debts, an ordering rule,
  or a "roll the freed-up payment into the next debt" recurrence. `debt-snowball-vs-avalanche`
  (`src/data/comparisons.ts`) explains the method in prose with one static worked example; it
  has no interactive inputs.

## What it does (inputs → outputs)

**Inputs** (a repeatable row per debt, add/remove rows):
- Debt name/label (free text, for display only)
- Current balance ($)
- APR (%)
- Minimum monthly payment ($)

**Global inputs:**
- Extra amount available per month to put toward payoff, on top of all minimums ($)
- Method toggle: **Snowball** (order debts smallest balance → largest) or **Avalanche** (order
  debts highest APR → lowest) — reuse the exact ordering logic already described in
  `debt-snowball-vs-avalanche`, just made interactive instead of prose-only.
- Optional: one-time lump-sum payment amount + which month it lands, for the "lump sum" /
  "one-time payment" variant cluster mined this run.

**Outputs:**
- A month-by-month amortization table per debt (mirrors the existing `credit-card-payoff`
  single-balance table, extended to N debts): balance, interest charged, principal paid, for
  each debt, each month, until every balance hits $0.
- Total months to debt-free.
- Total interest paid across all debts, for the chosen method.
- A **method-comparison callout**: run the same debt list through BOTH orderings and show the
  interest difference and time difference, so a reader gets the avalanche's real dollar savings
  vs. the snowball's psychological win in one place (this reuses `debt-snowball-vs-avalanche`'s
  existing framing but grounds it in the reader's own numbers instead of one static example).
- A downloadable/printable schedule (CSV export) — this satisfies the large "excel / spreadsheet
  / google sheets / template" sub-cluster without building a separate downloadable asset.

## Primary and secondary keywords

- Primary: `debt snowball calculator` (6,600/mo measured, DataForSEO, KD 12)
- Secondary: `debt snowball calculator excel` (260/mo measured), `debt snowball vs avalanche
  calculator`, `debt snowball calculator with extra payments`, `debt snowball calculator with
  lump sum payment`, `biweekly debt snowball calculator`

## Technical dependencies

- A new React island (same pattern as the existing `credit-card-payoff` island): needs a
  repeatable-row form component (add/remove debt), the month-by-month amortization loop
  extended to N parallel balances with a payment-reallocation rule (when a debt hits $0, its
  former payment amount rolls into the next debt in the chosen order), and a CSV-export utility.
- No new data dependencies — all inputs are user-entered, no external data source needed.
- `src/data/calculators.ts`: new entry `{ id: "debt-snowball", islandId: "debt-snowball", ... }`
  once the island ships, following the exact field shape of the existing `credit-card-payoff`
  entry (metaTitle/metaDescription/targetKeyword/h1/introText/howItWorks/faqs/sources/
  defaultPreset).
- Cross-links to add once live: from `/credit-card-payoff/`'s existing "What if I have more than
  one credit card to pay off?" FAQ (already links to `/compare/debt-snowball-vs-avalanche/` —
  update that link, or add a second one, to point to `/debt-snowball/` once it exists), and from
  `/compare/debt-snowball-vs-avalanche/`'s own body (see the body-text row in the 2026-09-23
  chart, which adds exactly this kind of FAQ/cross-link without waiting on the tool).

## Scope note

This spec intentionally does not include a per-debt "credit utilization" or "credit score
impact" projection — that is a distinct, more speculative feature that would need its own
research and is out of scope for a v1 payoff-schedule tool.
