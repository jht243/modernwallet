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

// Clean Author vs. Expert Reviewer split (Healthline / Cleveland Clinic standard):
// - Author (Organization): ModernWallet Research Desk compiles formulas, lender/IRS/CFPB figures, and guides.
// - Editorial Reviewer (Verified Person): Jonathan Teplitsky, MBA oversees editorial standards and review.
export const EDITORIAL_DESK = {
  name: "ModernWallet Research Desk",
  url: `${SITE.url}/editorial-policy/`,
  path: "/editorial-policy/",
  description:
    "The ModernWallet Research Desk builds standard financial calculator models, verifies rates, limits, and rules against primary sources (CFPB, IRS, Federal Reserve, FDIC), and updates guides when regulations or market terms change.",
} as const;

export const EDITORIAL_REVIEWER = {
  id: "https://www.jonathanteplitsky.com/#person",
  name: "Jonathan Teplitsky",
  displayName: "Jonathan Teplitsky, MBA",
  credentials: "MBA",
  role: "Publisher & Editorial Reviewer",
  credentialSummary: "Harvard Business School MBA · Licensed Florida Real Estate Agent (#3440355) · Founder & CEO, Layer3Labs",
  license: {
    title: "Licensed Florida Real Estate Agent",
    number: "3440355",
    issuer: "Florida Department of Business and Professional Regulation (DBPR)",
    verifyUrl: "https://www.myfloridalicense.com/",
  },
  path: "/about/jonathan-teplitsky/",
  url: `${SITE.url}/about/jonathan-teplitsky/`,
  image: `${SITE.url}/images/jonathan-teplitsky.png`,
  imagePath: "/images/jonathan-teplitsky.png",
  sameAs: [
    "https://www.jonathanteplitsky.com/",
    "https://www.linkedin.com/in/jonathanteplitsky/",
  ],
  alumniOf: [
    {
      name: "Harvard Business School",
      sameAs: "https://www.hbs.edu/",
    },
  ],
  bio:
    "Jonathan Teplitsky is the Publisher and Editorial Reviewer of ModernWallet and Founder & CEO of Layer3Labs. He holds an MBA from Harvard Business School (2014–2016), previously led marketing for a $200M+ business at Amazon and product launches at Uber, and served as a Former U.S. Army Captain (Military Intelligence). He oversees ModernWallet's editorial standards, formula verification rules, and primary-source review process.",
  knowsAbout: [
    "Personal finance",
    "Loan amortization",
    "Interest rates and APR",
    "Mortgage and auto financing",
    "Retirement and investment math",
    "Debt payoff strategies",
  ],
} as const;

// Exported under AUTHOR for compatibility with existing schema/page imports; points to the verified human reviewer.
export const AUTHOR = EDITORIAL_REVIEWER;

// Optional specialist reviewer override for legal/tax pages (e.g., licensed attorney or CPA).
// Never ship a placeholder name here.
export const REVIEWER: Reviewer | undefined = undefined;

// Sitewide "last updated" stamp. Bump when content is materially revised.
export const LAST_UPDATED = "2026-11-24";
