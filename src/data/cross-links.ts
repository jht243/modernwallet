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
  ],
  "mortgage": [
    { href: "/mortgage/home-affordability-calculator/", label: "How much house can I afford?" },
    { href: "/budget/", label: "Build a monthly budget" },
    { href: "/net-worth/", label: "Check if you're financially ready" },
    { href: "/retirement/", label: "Stay on track for retirement" },
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
  ],
  "investing": [
    { href: "/retirement/", label: "Plan your retirement" },
    { href: "/portfolio/", label: "Balance your portfolio" },
    { href: "/net-worth/", label: "Track your net worth" },
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
  ],
  "tax-resolution": [
    { href: "/guides/tax-tips/", label: "Proactive tax planning (if you're current)" },
    { href: "/mortgage/home-affordability-calculator/", label: "Back taxes and mortgage approval" },
    { href: "/budget/", label: "Build a budget to fund the payment plan" },
    { href: "/net-worth/", label: "See your full net worth" },
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
};

export function crossLinksFor(calcId: string): CrossLink[] {
  return CROSS_LINKS[calcId] ?? [];
}
