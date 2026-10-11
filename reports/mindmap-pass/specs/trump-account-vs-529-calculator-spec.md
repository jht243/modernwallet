# Spec — /trump-account-vs-529-calculator/ (next in line, tool-usage pass 2026-10-11)

- **Seed tool:** trump-account (/trump-account/, 12 people in 3 days).
- **Persona:** parent of a young child deciding where this year's $5,000 should go.
- **Format:** calculator (client-side, deterministic). Mirror `/529-savings-calculator/` and `/trump-account/` wiring.
- **Demand:** `trump account vs 529 calculator` est. 0–25/mo (estimate — Google Autocomplete, NOT measured). Demand inferred: a real user of the seed tool needs this next. Existing comparison article `/compare/trump-account-vs-529/` already ranks for the head term.
- **Inputs:** child's age, yearly contribution, expected return, federal seed eligibility (born 2025–2028), parent's state 529 deduction (reader input), intended use (college vs other), tax bracket at withdrawal.
- **Outputs:** value at 18 in each; after-tax value if used for qualified education (529 tax-free) vs Trump Account (tax-deferred, taxed on withdrawal per IRS rules); after-tax value if not used for education.
- **Logic and sources:** Trump Account rules from IRS guidance / CRS R48910 (already encoded in `src/lib/trump-account.ts`); 529 rules from IRS Pub 970. No state-deduction defaults: reader input only.
- **Inbound links:** from `/trump-account/` (next step) and `/compare/trump-account-vs-529/`.
