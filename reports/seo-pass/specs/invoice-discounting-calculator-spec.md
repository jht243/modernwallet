# Asset Spec: Invoice Discounting Calculator

**Prepared:** 2026-07-22 · Google-Autocomplete keyword-gap pass · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

`/invoice-factoring/invoice-discounting-calculator/`

New `SpokeEntry` under `calculator: "invoice-factoring"` (the existing live `invoice-factoring` category — see `src/data/registry.ts` `LIVE_IDS`), added to `src/data/spokes-business-financing.ts` alongside the two existing `invoice-factoring` spokes (`accounts-receivable-financing`, `factoring-fee-calculator`).

## 2. Recommended format + why

**Format: a new calculator spoke page** (SEO hub-and-spoke pattern), NOT a guide/article.

Why: the query signals — **"invoice discounting calculator india"** and **"invoice discounting investment calculator"** — are transactional/tool-seeking, not informational. But they describe a genuinely different persona and math than anything currently on the site:

- ModernWallet's existing `invoice-factoring` spokes (`factoring-fee-calculator`, `accounts-receivable-financing`) are all **business-owner-side**: "I have an unpaid invoice, what do I get if I sell/advance against it" — solving for advance amount, reserve, fee, net proceeds, effective APR paid.
- "Invoice discounting calculator" in the autocomplete signal (especially the India-market variant, where "invoice discounting" is the standard term for what the U.S. calls invoice factoring/discounting from the *investor/financier* side) is asking the inverse question: **"I am the investor/financier buying this receivable at a discount — what yield do I earn, and what should I pay today for a future cash flow?"** That is a present-value / discount-yield calculation, not an advance-rate calculation.

This is a distinct intent from the existing pages, so it should NOT be folded into `accounts-receivable-financing` (that would blur two audiences with opposite questions) — it earns its own spoke.

## 3. What the asset does — inputs → outputs

**Persona: the investor/financier**, not the business owner.

**Inputs:**
- Face value of the invoice/receivable (the amount due at maturity)
- Days/months until maturity (or a maturity date)
- Discount rate (annualized) OR discount yield the investor requires
- Optional: platform/servicing fee taken by the discounting marketplace (common in India's TReDS/invoice-discounting-platform context)

**Outputs:**
- **Present value / purchase price today** — what the investor pays now to buy the receivable (face value discounted back at the given rate over the remaining days)
- **Discount amount** — face value minus purchase price (the investor's gross return in dollars)
- **Effective annualized yield** — the discount amount annualized over the actual holding period, so a short-dated receivable's yield is comparable across different maturities (mirrors the "effective APR" pattern already used on the existing factoring spokes, but computed from the investor's return, not the borrower's cost)
- Optional: net yield after platform/servicing fee

This is conceptually the mirror image of the existing `computeFactoring()` output (`src/lib/invoice-factoring.ts`) — same annualization instinct, opposite direction (yield earned vs. cost paid).

## 4. Primary + secondary keywords

- **Primary:** "invoice discounting calculator" / "invoice discounting calculator india"
- **Secondary:** "invoice discounting investment calculator", "invoice discounting yield calculator", "receivables discounting calculator", "discount an invoice calculator"

## 5. Word-count/scope estimate

Follow the existing `SpokeEntry` shape exactly (see `src/data/spokes-business-financing.ts` for the pattern already used by `factoring-fee-calculator`):

- `intro`: ~120–150 words
- `howItWorks`: ~180–220 words (must clearly explain PV/discount-yield math, not advance-rate math, so readers don't confuse it with the sibling factoring-fee page)
- `commonMistakes`: 5 bullets, ~15–25 words each
- `workedExample`: one full worked numeric example (~120–150 words), e.g. "A $50,000 invoice due in 60 days, discounted at a 12% annual rate → investor pays ~$49,014 today, earns a $986 discount, for an effective annualized yield of ~12% net of a 60-day holding period" (numbers illustrative — must be recomputed against the actual island math once built)
- `faqs`: 5 Q&A pairs, ~40–60 words per answer
- **Total copy: ~700–900 words**, consistent with sibling spokes on this hub.

## 6. Technical dependencies

- **Category/hub:** reuses the existing `invoice-factoring` `CalculatorDef` in `src/data/bf-factoring-hub.ts` (already `islandId: "invoice-factoring"`, already in `LIVE_IDS`) — no new hub page needed, this is a spoke under it.
- **`SpokeEntry` shape:** follow `src/data/types.ts` `SpokeEntry` interface exactly, same fields the two existing `invoice-factoring` spokes use in `src/data/spokes-business-financing.ts`.
- **Island/component decision (the key build decision for the engineer):**
  - The existing `InvoiceFactoringCalculator.tsx` (`src/components/InvoiceFactoringCalculator.tsx`) + its pure logic in `src/lib/invoice-factoring.ts` (`computeFactoring()`) compute **advance-rate/fee/effective-APR-paid** math — this is the wrong math for this spoke's persona and should NOT simply be reused with a relabeled preset, because the investor question (PV/discount yield) is mathematically distinct from the business-owner question (advance minus fee).
  - **Recommendation: build a new pure calc function** (e.g. `computeInvoiceDiscount()` in a new or extended `src/lib/invoice-factoring.ts`) implementing simple/PV discounting: `presentValue = faceValue / (1 + (annualRate × daysToMaturity/365))` (or true compound PV if the engineer prefers), plus a **new small island component** (e.g. `InvoiceDiscountingCalculator.tsx`) registered in `src/components/CalculatorIsland.tsx`'s island map alongside the existing `"invoice-factoring"` entry, e.g. under a new key `"invoice-discounting"`. Set this spoke's `islandId: "invoice-discounting"` (using the `SpokeEntry.islandId` override field, which already exists for exactly this purpose — see `src/data/types.ts` comment: "Lets a spoke use a different tool than its category").
  - This keeps the existing factoring-fee/AR-financing island untouched and avoids overloading one component with two incompatible mental models behind a mode flag.
- **Sources:** cite a primary source appropriate to invoice discounting — e.g. RBI/TReDS documentation for the India-market context (since "india" appears directly in the query signal), plus a U.S.-neutral source (SBA/CFPB) if the page is positioned as US+India applicable. The engineer should verify current RBI TReDS guidance before publishing, since regulatory framing can change.
- **Cross-links:** add to `relatedSlugs` on both existing `invoice-factoring` spokes (`accounts-receivable-financing`, `factoring-fee-calculator`) pointing back to this new spoke, and vice versa, so all three invoice-factoring pages interlink (no-orphan rule).
- **Definitional consistency flag (verify before publishing):** the site already has a live `invoice-factoring-vs-invoice-discounting` comparison page (`src/data/comparisons-business.ts`) that defines "invoice discounting" as a UK/Europe-style borrower-side product — the business keeps its own collections/ledger under its own name, functionally close to factoring but confidential — NOT as an investor-side PV/yield calculation. That is a different definition of the same term than this spec's India-TReDS-investor framing. Both usages are real (the term is genuinely overloaded across markets), but the engineer should explicitly address the conflict in this spoke's copy (e.g. "in the U.S./U.K. sense... vs. in the India/TReDS sense...") so a reader who has seen the comparison page isn't confused by an apparently contradictory definition, and should cross-link the two pages to make the distinction explicit rather than silent.
