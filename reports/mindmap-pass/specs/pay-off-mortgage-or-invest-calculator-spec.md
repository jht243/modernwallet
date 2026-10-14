# Spec — /pay-off-mortgage-or-invest-calculator/ (next in line, tool-usage pass 2026-10-14)

- **Seed tool:** mortgage (/mortgage/payoff-calculator/).
- **Persona:** homeowner with $300/month spare, deciding between extra principal and investing it.
- **Format:** calculator (client-side, deterministic).
- **Demand:** `pay off mortgage or invest calculator` 260/mo KD 0 (DataForSEO, measured).
- **Inputs:** balance, rate, months left, extra per month, expected investment return (reader input), tax rate on investment gains (reader input).
- **Outputs:** at the original payoff date: net worth under each path (home equity + invested balance), interest saved, break-even return.
- **Logic:** amortization for the prepay path; the freed payment invested after early payoff; investment path compounds monthly. No default return claimed as expected.
- **Dedup:** /guides/pay-off-mortgage-early-or-invest (article, no calculator) — link both ways.
- **Inbound links:** from /mortgage/payoff-calculator/ and the guide.
