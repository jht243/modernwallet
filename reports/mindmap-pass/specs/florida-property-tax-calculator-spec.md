# Spec — /florida-property-tax-calculator/ (tool-usage pass 2026-10-28, next in line)

- **Route:** /florida-property-tax-calculator/ (top-level calculator; wiring mirrors /florida-amendment-3-calculator/: `src/data/calculators.ts` entry + `CalculatorIsland.tsx` + `registry.ts` LIVE_IDS + `cross-links.ts`).
- **Format + rationale:** calculator — `florida property tax calculator` 3,600/mo KD 15 (DataForSEO, 2026-10-28); the reader wants a bill for their own home and county.
- **What it does:** inputs county (select), just/market value, assessed (Save Our Homes) value, homestead yes/no, other exemptions (senior, veteran, widow) as a dollar amount, optional millage override from the TRIM notice; outputs taxable value for school and non-school levies separately (the $25,000 + indexed second homestead exemption applies to non-school levies only), estimated bill, and a link to the Amendment 3 calculator for the 2027/2028 change.
- **Blocker this run:** county-level millage rates must come from the Florida Department of Revenue (Property Tax Oversight data, "millage rates" by county). The runner got a 404 on floridarevenue.com's millage PDF path; next run must locate the current DOR file (or each county's TRIM/millage page) and record the source URL + year. Do not ship county averages from a non-official aggregator.
- **Seed tool / persona:** florida-amendment-3-calculator (16 people) — the Hillsborough homesteader with a TRIM notice.
- **Keywords:** florida property tax calculator; property tax calculator florida; florida homestead exemption calculator.
- **Dependencies:** calc-ui; no picks (YMYL property tax — book fit is weak, decide at build).
