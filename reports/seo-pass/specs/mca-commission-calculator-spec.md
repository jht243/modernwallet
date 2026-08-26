# Asset Spec: MCA Broker/ISO Commission Calculator

**Prepared:** 2026-08-26 · Google-Autocomplete keyword-gap pass (`autocomplete-pass-auto`) · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

`/merchant-cash-advance/commission-calculator/`

New `SpokeEntry` in `src/data/spokes-business-financing.ts` — `calculator: "merchant-cash-advance"` (keeps it under the existing `/merchant-cash-advance/` URL hub) with `islandId: "mca-commission"` set explicitly to override the hub's default `MerchantCashAdvanceCalculator` island (see §6). This route does not exist today.

## 2. Recommended format + rationale

**Format: a new interactive calculator**, not an article. The row's `problem` cell states the intent directly: "ISO/broker-side searchers want MCA commission math; the existing hub is written for the merchant, not the broker." This is a distinct persona and a distinct math problem from the rest of the MCA hub, so it needs its own tool rather than an FAQ addition.

Confirmed against `src/components/CalculatorIsland.tsx`'s `ISLANDS` map: `MerchantCashAdvanceCalculator` is the site's existing MCA tool, but it is framed entirely for the **merchant** — payback amount and effective APR on an advance the merchant is taking. It has no concept of a commission payout to the broker/ISO who placed the deal. `InvoiceFactoringCalculator` and `BusinessLineOfCreditCalculator` are the other business-financing-pillar islands and are unrelated products. None of the existing engines compute a broker-side commission — this genuinely needs new logic (even though the core multiplication is simple, no existing island exposes a rate-times-funded-amount commission output at all).

## 3. What the asset does — inputs → outputs, and the formula

**Inputs:**
- Advance/funded amount ($) — the deal size actually funded to the merchant
- Commission rate (%) — entered by the broker, since rates are funder- and deal-specific and not standardized (see note below)
- Optional: a simple tiered-rate toggle, letting the user enter up to 3 volume tiers (e.g. "under $X funded this month → rate A," "$X–$Y → rate B," "over $Y → rate C") so a broker whose funder pays on a sliding scale can model it
- Optional: a split percentage, for a sub-broker/referral-partner arrangement where the commission itself gets divided

**Outputs:**
- **Commission payout** ($) for a single deal = `funded amount × (commission rate ÷ 100)`
- If tiered: the applicable tier's rate is applied instead of a flat rate, with the tier boundary and resulting rate both shown so the broker can see which bracket they landed in
- If split: the sub-broker's payout share and the primary broker's remaining share, shown side by side
- A secondary "points" readout — in ISO/broker terminology, a "point" commonly means 1 percentage point of the funded amount, so a 10-point deal on $100,000 funded is a $10,000 commission; showing both the dollar figure and the point-based framing matches how brokers actually talk about these deals

**Formula / logic:**

1. **Base commission.** `Commission ($) = Funded Amount × (Commission Rate / 100)`. This is a flat, single-step calculation — the complexity in this tool is in the optional tiering and split logic, not the core formula.

2. **Tiered commission (optional).** If the broker enables tiering, the engine looks up which volume bracket the current month's cumulative funded amount (or the single deal, per the tool's chosen convention — flag this as a design decision for the builder, since ISO commission plans vary on whether tiers apply per-deal or per-month-of-cumulative-volume) falls into, and applies that bracket's rate instead of a single flat rate.

3. **Split (optional).** `Sub-broker payout = Commission × (Split % / 100)`; `Primary broker payout = Commission − Sub-broker payout`.

**Commission-rate accuracy requirement (not optional):** MCA/ISO commission structures are **not standardized or publicly documented** the way consumer loan APRs are — they vary by funder, by deal size, by the broker's volume relationship with that funder, and by whether the deal includes a "buy rate" markup the broker keeps as additional spread. The spec (and the eventual page copy) must **not** assert a single precise industry-wide commission percentage as fact. Instead, describe typical rates qualitatively — e.g., commission is commonly discussed in industry conversation as roughly in the mid-single-digit to mid-teens percent range of the funded amount, varying by funder and deal size — framed explicitly as a general range subject to real variation, not a verified statistic. The calculator itself should default to no pre-filled rate (or a clearly-labeled illustrative placeholder the user is expected to overwrite), so the tool never implies it knows a broker's actual contracted rate with a specific funder.

## 4. Primary and secondary keywords

- **Primary:** "MCA commission calculator"
- **Secondary (from the row's `problem` cell — ISO/broker-side search intent):** "merchant cash advance broker commission," "ISO commission calculator," "MCA broker commission calculator," "MCA ISO commission," "merchant cash advance commission rate"

## 5. Word count / scope estimate

Roughly 600–800 words — leaner than the other two specs in this batch, since the persona and formula are narrower and there's no disambiguation problem (the route sits cleanly under the existing `/merchant-cash-advance/` hub, targeting a different persona within the same product, not an unrelated concept). Suggested shape: short intro (frame explicitly for the broker/ISO reader, distinct from the merchant-facing hub calculator above it) → how commission math works (the base formula + a plain-language note on tiering/splits) → worked example → 4–6 FAQs (e.g. "what's a typical MCA commission rate," "what's a 'point' in ISO terms," "how do tiered commission plans work," "what's the difference between commission and buy-rate markup").

## 6. Technical dependencies

- `src/lib/mca-commission.ts` — new pure engine implementing the formula in §3 (flat calculation, plus the optional tier-lookup and split-division logic).
- `src/components/McaCommissionCalculator.tsx` — new React island (does not exist).
- Register the new island in `src/components/CalculatorIsland.tsx`'s `ISLANDS` map, e.g. `"mca-commission": McaCommissionCalculator,`.
- New `SpokeEntry` in `src/data/spokes-business-financing.ts`: `calculator: "merchant-cash-advance"`, `slug: "commission-calculator"`, with `islandId: "mca-commission"` set explicitly via the `SpokeEntry.islandId` override field (same mechanism as `affordability` under `/auto-loan/`) so the page renders the new engine instead of the hub's default `MerchantCashAdvanceCalculator`.
- **On `LIVE_IDS` in `src/data/registry.ts`:** verified by reading the file — `"merchant-cash-advance"` is already present, and this route is a spoke under that existing hub via the `islandId` override, so no new `LIVE_IDS` entry is required as designed. It would only be needed if the builder instead registers this as a new top-level `CalculatorDef` rather than a `/merchant-cash-advance/` spoke.

No stub page or placeholder component was created this pass — this spec file is the deliverable.
