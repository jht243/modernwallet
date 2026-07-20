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
export const LIVE_IDS = new Set<string>(["auto-loan", "mortgage", "real-estate", "retirement", "investing", "portfolio", "net-worth", "budget", "tax-resolution", "estate-planning", "probate", "elder-care", "trump-account", "529-savings-calculator", "coast-fire", "business-loan-payoff", "personal-loan", "merchant-cash-advance", "invoice-factoring", "business-line-of-credit"]);
