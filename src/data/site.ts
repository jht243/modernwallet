import type { Reviewer } from "./types";
// Single source of truth for brand + domain.
// Brand displayed on-site is "ModernWallet"; the live domain is www.TheModernWallet.com.
// (Goal: acquire the exact-match ModernWallet.com later — when that happens, just change SITE.url
// here AND `site:` in astro.config.mjs + public/robots.txt.)

export const SITE = {
  name: "ModernWallet",
  tagline: "Free Financial Calculators",
  url: "https://www.themodernwallet.com",
  description:
    "Free, accurate financial calculators — auto loans, mortgages, retirement, investing, rentals, and net worth. No signup, instant results.",
} as const;

export const OPERATOR = {
  name: "Layer3Labs",
  url: "https://www.layer3labs.io",
} as const;

// Named author/reviewer for YMYL (finance) E-E-A-T: visible byline + Person JSON-LD + "reviewed by".
export const AUTHOR = {
  name: "Jonathan Velez",
  role: "Personal Finance Writer & Editor",
  url: `${SITE.url}/about/`,
  bio: `Jonathan Velez writes and edits ${SITE.name}'s personal-finance content, focused on loans, interest, and debt payoff. Every calculator page is reviewed against primary sources like the CFPB and Federal Reserve.`,
  knowsAbout: [
    "Auto loans",
    "Loan amortization",
    "Interest and APR",
    "Debt payoff strategies",
    "Personal finance",
  ],
} as const;

// Attorney reviewer for legal/tax pages (Estate Planning, Probate, Elder Care, Tax Resolution).
// None confirmed, so legal pages show only the site author's byline and emit no reviewer Person.
// When a real attorney reviewer is confirmed, set this to { name, credentials: "Esq.", url }:
// it renders as a second byline line and a reviewer Person node on legal pages.
// Never ship a placeholder name here.
export const REVIEWER: Reviewer | undefined = undefined;

// Sitewide "last updated" stamp. Bump when content is materially revised.
export const LAST_UPDATED = "2026-06-25";
