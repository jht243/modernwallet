// Referral / affiliate link constants — single source of truth.
//
// `linkify` (src/lib/richtext.ts) auto-links every "Robinhood" mention in body
// prose to the referral link, and the footer shows the site-wide disclosure.
//
// COMPLIANCE NOTE — Robinhood: `join.robinhood.com/*` is a PERSONAL referral
// link. Robinhood's referral-program terms restrict it to individual sharing and
// can disallow distribution via a monetized content/SEO site. When the Robinhood
// AFFILIATE program (Impact / Partnerize) is live, swap ROBINHOOD_URL for the
// affiliate link — nothing else changes.

export const ROBINHOOD_URL = "https://join.robinhood.com/jonatht93";

/** rel for monetized outbound links (Google + FTC friendly). */
export const PARTNER_REL = "sponsored nofollow noopener noreferrer";

/** Site-wide affiliate disclosure, rendered in the footer. */
export const AFFILIATE_DISCLOSURE =
  "Some links on this site are referral or affiliate links, including our Robinhood referral link — we may earn a reward or commission at no cost to you. This never affects our rankings or editorial coverage.";
