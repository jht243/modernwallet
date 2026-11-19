// Referral / affiliate link constants — single source of truth.
//
// `linkify` (src/lib/richtext.ts) auto-links every "Robinhood" and "American Express" / "Amex"
// mention in body prose to the referral link, and the footer shows the site-wide disclosure.
//
// COMPLIANCE NOTE — Robinhood & American Express: `join.robinhood.com/*` and
// `americanexpress.com/en-us/referral/*` are PERSONAL referral links. Issuer
// referral-program terms restrict commercial distribution and cap annual referral
// bonuses per card. When direct AFFILIATE links (Impact / Partnerize / CJ) are
// live, swap the URL constants below — nothing else changes.

export const ROBINHOOD_URL = "https://join.robinhood.com/jonatht93";

export const AMEX_PLATINUM_URL =
  "https://americanexpress.com/en-us/referral/platinum-card?ref=JONATTNwWt&XL=MIINS";

/** rel for monetized outbound links (Google + FTC friendly). */
export const PARTNER_REL = "sponsored nofollow noopener noreferrer";

/** Site-wide affiliate disclosure, rendered in the footer. */
export const AFFILIATE_DISCLOSURE =
  "Some links on this site are referral or affiliate links, including our Robinhood and American Express referral links — we may earn a reward or commission at no cost to you. This never affects our rankings or editorial coverage.";
