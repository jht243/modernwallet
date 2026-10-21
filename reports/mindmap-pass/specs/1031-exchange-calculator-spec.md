# Spec — /real-estate/1031-exchange-calculator/ (tool-usage pass 2026-10-21, next in line)

- **Route:** /real-estate/1031-exchange-calculator/ (real-estate spoke with its own `islandId`).
- **Format + rationale:** calculator — "1031 exchange calculator" 480/mo, KD 0 (dataforseo); PAA "How do you calculate gain on a 1031 exchange?", "Is it better to pay capital gains or do a 1031 exchange?". The existing /compare/1031-exchange-vs-opportunity-zone answers a different question (which program).
- **What it does:** inputs relinquished property sale price, selling costs, adjusted basis (or price + improvements − depreciation), replacement property price, new mortgage vs old mortgage relieved, cash received; outputs realized gain, recognized gain (boot: cash + net mortgage relief), deferred gain, basis of the replacement property, and the tax on the boot using `computeSaleTax()` from `src/lib/rental-sale-tax.ts`. Shows the 45-day identification and 180-day exchange deadlines.
- **Data sources:** IRS Form 8824 instructions (realized/recognized gain, boot netting, replacement basis); IRS "Like-Kind Exchanges — Real Estate Tax Tips" (45/180-day rules; real property only after 2017).
- **Keywords:** 1031 exchange calculator; how to calculate gain on a 1031 exchange; 1031 boot calculator; 1031 exchange basis calculator.
- **Dependencies:** `src/lib/rental-sale-tax.ts`; book picks via `ToolPicks`.
- **Placeholder route:** none needed.
