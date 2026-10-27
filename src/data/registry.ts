// Which calculators are "live" — i.e. have a working island and should get built hub + spoke pages.
// Plain strings only (no React imports) so this can be used in Astro frontmatter / build-time
// filtering without pulling client component code into the server bundle.
//
// Phase 2 added: "mortgage", "retirement", "investing", "portfolio", "real-estate", "net-worth".
// Pillar 1 (professional services) added: "tax-resolution". Pillar 2: "estate-planning".
// Pillar 3: "probate". Pillar 4: "elder-care". Mindmap pass (Trump Accounts): "trump-account".
// Autocomplete pass (kids accounts): "529-savings-calculator".
// Competitor-monitor pass (2026-07-15): "coast-fire", "business-loan-payoff".
// Competitor-monitor pass (2026-07-20): "personal-loan".
// Competitor-monitor pass (2026-08-03): "interest-per-day".
// Competitor-monitor pass (2026-08-05): "taxable-vs-tax-deferred".
// Competitor-monitor pass (2026-08-12): "credit-card-payoff".
// Competitor-monitor pass (2026-08-17): "pto-cashout".
// Mindmap pass (2026-08-30): "iul-calculator" — indexed universal life cash-value projection.
// Competitor-monitor pass (2026-09-02): "zakat" — nisab-aware zakat calculator.
// Self-employed / 1099 silo (2026-09-05): "self-employment-tax", "mileage-deduction", "freelance-rate".
// Business-structure pillar (2026-09-05): "s-corp-tax" — entity choice and the S-corp election.
// Competitor-monitor pass (2026-09-07): "life-insurance-needs" — present-value needs analysis;
// Keyword-gap pass (2026-09-28): "heloc-calculator". Keyword-gap pass (2026-10-04): "commercial-mortgage-calculator". Autocomplete pass (2026-10-07): "cd-calculator", "emergency-fund-calculator", "debt-consolidation-calculator".
// Keyword-gap pass (2026-10-11): "inflation-calculator", "expense-ratio-calculator".
// Tool-usage pass (2026-10-11): "social-security-break-even-calculator", "mileage-reimbursement-calculator", "portfolio-rebalancing-calculator".
// X-trends pass (2026-10-12): "hurricane-deductible-calculator".
// Autocomplete pass (2026-10-14): "annuity-calculator", "credit-card-interest-calculator", "loan-payment-calculator".
// Tool-usage pass (2026-10-14): "hysa-vs-cd-calculator", "trump-account-vs-529-calculator", "mortgage-recast-calculator".
// Mindmap pass (2026-10-14, 2027 COLA): "social-security-cola-calculator".
// Trend pass (2026-10-17): "roth-vs-traditional-401k-calculator".
// X-trends pass (2026-10-19): "florida-amendment-3-calculator".
// X-trends pass (2026-10-20): "student-loan-wage-garnishment-calculator".
// Autocomplete pass (2026-10-21): "tax-bracket-calculator".
// Tool-usage pass (2026-10-21): "debt-to-income-ratio-calculator", "social-security-taxable-benefits-calculator".
// Mindmap pass (2026-10-25): "checklists" — customizable, printable home buying/selling/renting/landlord checklists.
// GA4 top-pages pass (2026-10-26): "charitable-donation-tax-deduction-calculator".
// X-trends pass (2026-10-27): "car-loan-interest-deduction-calculator".
// "operating-cash-flow", "cash-conversion-cycle" — SMB cash-flow health metrics (business financing).
export const LIVE_IDS = new Set<string>(["auto-loan", "mortgage", "real-estate", "retirement", "investing", "portfolio", "net-worth", "budget", "tax-resolution", "estate-planning", "probate", "elder-care", "trump-account", "529-savings-calculator", "coast-fire", "business-loan-payoff", "personal-loan", "merchant-cash-advance", "invoice-factoring", "business-line-of-credit", "interest-per-day", "taxable-vs-tax-deferred", "credit-card-payoff", "pto-cashout", "iul-calculator", "zakat", "self-employment-tax", "mileage-deduction", "freelance-rate", "s-corp-tax", "life-insurance-needs", "operating-cash-flow", "cash-conversion-cycle", "heloc-calculator", "commercial-mortgage-calculator", "cd-calculator", "emergency-fund-calculator", "debt-consolidation-calculator", "inflation-calculator", "expense-ratio-calculator", "social-security-break-even-calculator", "mileage-reimbursement-calculator", "portfolio-rebalancing-calculator", "hurricane-deductible-calculator", "annuity-calculator", "credit-card-interest-calculator", "loan-payment-calculator", "hysa-vs-cd-calculator", "trump-account-vs-529-calculator", "mortgage-recast-calculator", "social-security-cola-calculator", "roth-vs-traditional-401k-calculator", "florida-amendment-3-calculator", "student-loan-wage-garnishment-calculator", "tax-bracket-calculator", "debt-to-income-ratio-calculator", "social-security-taxable-benefits-calculator", "checklists", "charitable-donation-tax-deduction-calculator", "car-loan-interest-deduction-calculator"]);
