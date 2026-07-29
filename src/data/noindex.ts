// Single source of truth for which pages are excluded from Google's index.
//
// After the July 2026 index-bloat traffic drop, the 7 newest pillars keep only their
// hub page (`/{pillar}/`) indexed; every spoke (`/{pillar}/{slug}/`) and 50-state
// variant (`/{pillar}/{slug}/{state}/`) carries `noindex,nofollow`. Both the page
// templates (which emit the robots meta) and the sitemap filter (which drops the URLs
// from sitemap-0.xml) import from here so the two can never disagree — a sitemap that
// lists a noindexed URL is a GSC quality demerit ("Submitted URL marked noindex").

// Pillar calculator IDs whose sub-pages are de-indexed. Hub pages stay indexed.
export const NOINDEX_PILLARS = new Set<string>([
  "tax-resolution",
  "estate-planning",
  "probate",
  "elder-care",
  "merchant-cash-advance",
  "invoice-factoring",
  "business-line-of-credit",
]);

// True for a spoke or state page under a noindexed pillar; false for the pillar hub
// and for every page outside these pillars. Accepts a pathname (leading slash optional).
export function isNoindexedPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  // segments[0] = pillar/category, segments[1] = spoke slug, segments[2] = state.
  // length >= 2 means it is a sub-page (spoke or state), not the hub.
  return segments.length >= 2 && NOINDEX_PILLARS.has(segments[0]);
}
