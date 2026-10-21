# Spec — /irmaa-calculator/ (tool-usage pass 2026-10-21, next in line)

- **Route:** /irmaa-calculator/ (standalone calculator; wiring = `src/data/calculators.ts` entry + `CalculatorIsland.tsx` + `registry.ts` LIVE_IDS + `cross-links.ts`, mirroring /social-security-cola-calculator/).
- **Format + rationale:** calculator — the query is "irmaa calculator" (390/mo, KD 6, dataforseo) and PAA "How much is my irmaa?" asks for the reader's own figure.
- **What it does:** inputs filing status (single / MFJ / MFS lived with spouse) and MAGI from two years earlier (the year CMS uses); outputs the IRMAA tier, the monthly Part B premium with surcharge, the Part D surcharge, the yearly cost, and how far MAGI is from the next tier down.
- **Data sources (must be read from the official page at build time, not memory):** CMS "Medicare Parts A & B premiums and deductibles" fact sheet for the year (tier MAGI bands + Part B amounts); CMS Part D IRMAA table; SSA POMS HI 01101.020 (MAGI definition, two-year lookback); SSA-44 life-changing-event form for the "appeal" note. If the 2027 tables are out by then, ship 2027; otherwise 2026 labelled as such.
- **Keywords:** irmaa calculator; irmaa brackets 2026; 2027 irmaa brackets; how much is my irmaa; medicare income limits 2027.
- **Seed tool / persona:** social-security-cola-calculator (165 people) — the retiree whose Part B comes out of the check.
- **Dependencies:** none beyond calc-ui; book picks via `ToolPicks` (Medicare guide).
- **Placeholder route:** none needed (Astro generates routes from the registry).
