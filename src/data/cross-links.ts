// Curated cross-CALCULATOR links — the thing the audit found missing. Each calculator points to a
// few genuinely-related tools in OTHER categories, so a persona on a life journey (buy a car → check
// net worth; buy a home → are we ready to retire) is guided across the silo, and link equity spreads.

export interface CrossLink { href: string; label: string; }

export const CROSS_LINKS: Record<string, CrossLink[]> = {
  "auto-loan": [
    { href: "/auto-loan/car-affordability-calculator/", label: "How much car can I afford?" },
    { href: "/budget/", label: "Does this fit your budget?" },
    { href: "/net-worth/", label: "See your full net worth" },
    { href: "/mortgage/", label: "Buying a home too?" },
    { href: "/guides/is-extended-car-warranty-worth-it/", label: "Is an extended warranty worth it?" },
  ],
  "mortgage": [
    { href: "/mortgage/home-affordability-calculator/", label: "How much house can I afford?" },
    { href: "/budget/", label: "Build a monthly budget" },
    { href: "/net-worth/", label: "Check if you're financially ready" },
    { href: "/retirement/", label: "Stay on track for retirement" },
    { href: "/guides/current-mortgage-rates-guide/", label: "What actually sets your rate" },
    { href: "/guides/lessons-from-2008-housing-crash/", label: "What the 2008 crash still teaches buyers" },
  ],
  "real-estate": [
    { href: "/mortgage/", label: "Finance the purchase" },
    { href: "/investing/", label: "Compare to stock-market returns" },
    { href: "/net-worth/", label: "Track your total net worth" },
  ],
  "retirement": [
    { href: "/investing/", label: "Grow your investments" },
    { href: "/net-worth/", label: "Track your net worth" },
    { href: "/portfolio/", label: "Check your asset mix" },
    { href: "/coast-fire/", label: "Could you stop saving already?" },
  ],
  "coast-fire": [
    { href: "/retirement/", label: "Full retirement projection with contributions" },
    { href: "/investing/", label: "Project a taxable brokerage account" },
    { href: "/net-worth/", label: "Track your net worth" },
  ],
  "investing": [
    { href: "/retirement/", label: "Plan your retirement" },
    { href: "/portfolio/", label: "Balance your portfolio" },
    { href: "/net-worth/", label: "Track your net worth" },
    { href: "/roundup/best-brokers-for-treasury-bonds/", label: "Best brokers for Treasury bonds" },
  ],
  "portfolio": [
    { href: "/investing/", label: "Project investment growth" },
    { href: "/retirement/", label: "Plan your retirement" },
    { href: "/net-worth/", label: "Track your net worth" },
  ],
  "net-worth": [
    { href: "/budget/", label: "Build a monthly budget" },
    { href: "/retirement/", label: "Are you on track to retire?" },
    { href: "/investing/", label: "Grow your money" },
    { href: "/mortgage/", label: "How much house can you afford?" },
  ],
  "budget": [
    { href: "/net-worth/", label: "See your full net worth" },
    { href: "/investing/", label: "Invest your monthly surplus" },
    { href: "/retirement/", label: "Are you saving enough to retire?" },
    { href: "/personal-loan/", label: "Consolidating debt? Model a personal loan" },
    { href: "/guides/sales-tax-holidays-guide/", label: "Do sales tax holidays actually save money?" },
    { href: "/guides/ai-financial-advice-chatbots-guide/", label: "Using AI chatbots for money questions" },
  ],
  "personal-loan": [
    { href: "/budget/", label: "Does the payment fit your budget?" },
    { href: "/net-worth/", label: "See your full net worth" },
    { href: "/guides/how-to-choose-a-balance-transfer-credit-card/", label: "Compare a 0% balance transfer instead" },
  ],
  "tax-resolution": [
    { href: "/guides/tax-tips/", label: "Proactive tax planning (if you're current)" },
    { href: "/mortgage/home-affordability-calculator/", label: "Back taxes and mortgage approval" },
    { href: "/budget/", label: "Build a budget to fund the payment plan" },
    { href: "/net-worth/", label: "See your full net worth" },
  ],
  "merchant-cash-advance": [
    { href: "/business-line-of-credit/", label: "A cheaper alternative: business line of credit" },
    { href: "/invoice-factoring/", label: "Turn unpaid invoices into cash instead" },
    { href: "/compare/merchant-cash-advance-vs-loan/", label: "MCA vs a business loan" },
  ],
  "invoice-factoring": [
    { href: "/business-line-of-credit/", label: "Compare a business line of credit" },
    { href: "/merchant-cash-advance/", label: "How a merchant cash advance compares" },
    { href: "/compare/invoice-factoring-vs-merchant-cash-advance/", label: "Factoring vs MCA" },
  ],
  "business-line-of-credit": [
    { href: "/invoice-factoring/", label: "Factor invoices for faster cash" },
    { href: "/merchant-cash-advance/", label: "When speed matters: MCA" },
    { href: "/guides/small-business-financing-guide/", label: "Compare every financing option" },
  ],
  "business-loan-payoff": [
    { href: "/business-line-of-credit/", label: "Need more credit instead?" },
    { href: "/guides/small-business-financing-guide/", label: "Compare every financing option" },
    { href: "/net-worth/", label: "Track your net worth" },
  ],
  "estate-planning": [
    { href: "/retirement/", label: "Have a retirement plan — now protect it" },
    { href: "/net-worth/", label: "See your net worth first" },
    { href: "/net-worth/couples-net-worth-calculator/", label: "Planning finances together?" },
    { href: "/probate/", label: "Already dealing with probate?" },
  ],
  "probate": [
    { href: "/estate-planning/", label: "Plan ahead to avoid probate" },
    { href: "/estate-planning/living-trust-cost-calculator/", label: "A living trust avoids probate" },
    { href: "/estate-planning/estate-tax-calculator/", label: "Estate tax exposure at death" },
    { href: "/net-worth/", label: "Know the estate's net worth" },
  ],
  "elder-care": [
    { href: "/estate-planning/", label: "Start with your estate plan" },
    { href: "/estate-planning/living-trust-cost-calculator/", label: "Irrevocable trusts for asset protection" },
    { href: "/retirement/", label: "Model retirement + LTC costs together" },
    { href: "/net-worth/", label: "See your net worth first" },
  ],
  // Compliance Alerts pages (/compliance/*) — bridge the B2B compliance vertical to the business
  // and tax tools so the vertical is never a link island.
  "compliance": [
    { href: "/business-loan-payoff/", label: "Model your business loan payoff" },
    { href: "/tax-resolution/", label: "Behind on business taxes?" },
    { href: "/business-line-of-credit/", label: "Credit line for compliance costs" },
    { href: "/budget/", label: "Budget for compliance spending" },
  ],
};

export function crossLinksFor(calcId: string): CrossLink[] {
  return CROSS_LINKS[calcId] ?? [];
}
