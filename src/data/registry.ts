// Which calculators are "live" — i.e. have a working island and should get built hub + spoke pages.
// Plain strings only (no React imports) so this can be used in Astro frontmatter / build-time
// filtering without pulling client component code into the server bundle.
//
// Phase 2 adds: "mortgage", "retirement", "investing", "portfolio", "real-estate", "net-worth".
export const LIVE_IDS = new Set<string>(["auto-loan", "mortgage", "real-estate", "retirement", "investing", "portfolio", "net-worth", "budget"]);
