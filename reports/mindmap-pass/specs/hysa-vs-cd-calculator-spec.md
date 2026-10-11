# Spec — /hysa-vs-cd-calculator/ (next in line, tool-usage pass 2026-10-11)

- **Seed tool:** investing (/investing/high-yield-savings-calculator/, 32 people in 3 days).
- **Persona:** renter moving a $25k emergency fund into a HYSA, wondering whether to lock part of it into a CD.
- **Format:** calculator (client-side, deterministic). Mirror `/cd-calculator/` wiring (top-level calculator entry in `src/data/calculators.ts`, island in `CalculatorIsland.tsx`, `LIVE_IDS`, cross-links).
- **Demand:** `hysa vs cd calculator` est. 500–5,000/mo (estimate — Google Autocomplete, NOT measured); `cd vs high yield savings calculator` est. 75–750 (estimate). PAA: "Which is better for me, a CD or a high-yield savings account?", "What are the penalties for early CD withdrawal?", "How much does a $10,000 CD make in 1 year?". SERP: winnable, AI Overview present.
- **Inputs:** deposit, term (months), HYSA APY, CD APY, optional expected HYSA APY change after N months, optional early-withdrawal penalty (months of interest) + withdrawal month.
- **Outputs:** interest from each over the term; the difference; the HYSA rate the CD beats if HYSA rates fall; cost of breaking the CD early at the chosen month.
- **Logic:** FV of a lump sum with monthly compounding from APY → monthly rate `(1+APY)^(1/12)-1`; penalty = N months of CD interest at the CD rate (issuer-set; reader input, no default claimed as standard). FDIC $250,000 coverage note (fdic.gov).
- **Dedup:** `/compare/hysa-vs-cd/` (comparison article, no calculator) and `/cd-calculator/` (single-CD maturity) — link both; different reader job (side-by-side dollar answer).
- **Inbound links:** from the HYSA calculator page (next step), `/cd-calculator/`, `/compare/hysa-vs-cd/`.
