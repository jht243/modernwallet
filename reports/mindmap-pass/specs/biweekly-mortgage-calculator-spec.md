# Spec — /biweekly-mortgage-calculator/ (next in line, tool-usage pass 2026-10-14)

- **Seed tool:** mortgage (/mortgage/payoff-calculator/, 7 people in 6 days).
- **Persona:** homeowner 4 years into a 30-year loan weighing biweekly payments vs a flat extra monthly amount.
- **Format:** calculator (client-side, deterministic). Mirror `/mortgage-recast-calculator/` wiring (top-level calculator entry in `src/data/calculators.ts`, island in `CalculatorIsland.tsx`, `LIVE_IDS`, cross-links).
- **Demand:** `biweekly mortgage calculator` 1,900/mo KD 0 (DataForSEO, measured).
- **Inputs:** balance, rate, months left, optional servicer biweekly fee.
- **Outputs:** payoff time and interest with half-payments every 2 weeks (26/yr = 13 monthly payments), vs. monthly, vs. adding 1/12 of a payment each month; fee drag.
- **Logic:** standard amortization; biweekly modeled as 26 half-payments a year applied when paid (state the servicer-timing assumption).
- **Dedup:** /auto-loan/extra-payment-calculator (auto loans), /mortgage/payoff-calculator (flat extra payment) — link both.
- **Inbound links:** from /mortgage/payoff-calculator/ and /mortgage-recast-calculator/.
