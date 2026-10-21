# Spec — /real-estate/depreciation-recapture-calculator/ (tool-usage pass 2026-10-21, next in line)

- **Route:** /real-estate/depreciation-recapture-calculator/ (real-estate spoke in `src/data/spokes-real-estate.ts` with its own `islandId`, mirroring the affordability spoke under /auto-loan/).
- **Format + rationale:** calculator — "depreciation recapture calculator" 480/mo, KD 0 (dataforseo); PAA "How do I calculate depreciation recapture?", "Is depreciation recapture always 25%?".
- **Scope (narrowed by the 2026-10-21 duplicate gate):** RECAPTURE ONLY. Inputs: depreciation taken (or price + closing, land %, years rented to estimate it via `estimateDepreciation()` in `src/lib/rental-sale-tax.ts`) and the gain on the sale; optional ordinary bracket. Outputs: recaptured portion = min(depreciation, gain); its tax at up to 25%, or at the reader's bracket if lower; a link to /real-estate/capital-gains-calculator/ for the whole-sale tax. No remaining-gain or 0/15/20% outputs (that is the capital-gains page's job).
- **Data sources:** IRS Topic 409 (unrecaptured §1250 gain, 25% maximum); IRS Pub 527 (27.5-year recovery, allowed-or-allowable rule); IRS Pub 544.
- **Keywords:** depreciation recapture calculator; how to calculate depreciation recapture; is depreciation recapture always 25%; depreciation recapture on rental property.
- **Dependencies:** reuse `src/lib/rental-sale-tax.ts` constants; book picks via `ToolPicks` (`hanTaxStrategies`).
- **Placeholder route:** none needed (spokes generate routes at build).
