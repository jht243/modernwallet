// Which calculators are "live" — i.e. have a working island and should get built hub + spoke pages.
// Plain strings only (no React imports) so this can be used in Astro frontmatter / build-time
// filtering without pulling client component code into the server bundle.
//
// Phase 2 added: "mortgage", "retirement", "investing", "portfolio", "real-estate", "net-worth".
// Pillar 1 (professional services) added: "tax-resolution". Pillar 2: "estate-planning".
// Pillar 3: "probate". Pillar 4: "elder-care".
export const LIVE_IDS = new Set<string>(["auto-loan", "mortgage", "real-estate", "retirement", "investing", "portfolio", "net-worth", "budget", "tax-resolution", "estate-planning", "probate", "elder-care"]);
