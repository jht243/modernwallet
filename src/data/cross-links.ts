// Curated cross-CALCULATOR links — the thing the audit found missing. Each calculator points to a
// few genuinely-related tools in OTHER categories, so a persona on a life journey (buy a car → check
// net worth; buy a home → are we ready to retire) is guided across the silo, and link equity spreads.

export interface CrossLink { href: string; label: string; }

export const CROSS_LINKS: Record<string, CrossLink[]> = {
  "iul-calculator": [
    { href: "/retirement/", label: "Project retirement with a real account" },
    { href: "/investing/", label: "Compare to ordinary investing" },
    { href: "/taxable-vs-tax-deferred/", label: "See the three-way tax math" },
    { href: "/compare/iul-vs-401k/", label: "IUL vs 401(k): which wins" },
    { href: "/compare/iul-vs-roth-ira/", label: "IUL vs Roth IRA" },
  ],
  "auto-loan": [
    { href: "/auto-loan/car-affordability-calculator/", label: "How much car can I afford?" },
    { href: "/budget/", label: "Does this fit your budget?" },
    { href: "/net-worth/", label: "See your full net worth" },
    { href: "/mortgage/", label: "Buying a home too?" },
    { href: "/guides/is-extended-car-warranty-worth-it/", label: "Is an extended warranty worth it?" },
    { href: "/guides/is-driving-around-for-cheaper-gas-worth-it/", label: "Is chasing cheaper gas actually worth it?" },
    { href: "/guides/should-you-get-the-discount-tire-credit-card/", label: "Financing new tires? Read this first" },
  ],
  "mortgage": [
    { href: "/mortgage/home-affordability-calculator/", label: "How much house can I afford?" },
    { href: "/budget/", label: "Build a monthly budget" },
    { href: "/net-worth/", label: "Check if you're financially ready" },
    { href: "/retirement/", label: "Stay on track for retirement" },
    { href: "/guides/current-mortgage-rates-guide/", label: "What actually sets your rate" },
    { href: "/guides/lessons-from-2008-housing-crash/", label: "What the 2008 crash still teaches buyers" },
    { href: "/guides/40-year-mortgage-explained/", label: "Considering a 40-year term?" },
  ],
  "real-estate": [
    { href: "/mortgage/", label: "Finance the purchase" },
    { href: "/investing/", label: "Compare to stock-market returns" },
    { href: "/net-worth/", label: "Track your total net worth" },
  ],
  "retirement": [
    { href: "/investing/", label: "Grow your investments" },
    { href: "/iul-calculator/", label: "Pitched an IUL? Run the numbers" },
    { href: "/net-worth/", label: "Track your net worth" },
    { href: "/portfolio/", label: "Check your asset mix" },
    { href: "/coast-fire/", label: "Could you stop saving already?" },
    { href: "/guides/how-to-retire-at-40/", label: "Thinking about retiring early?" },
    { href: "/guides/is-3-million-enough-to-retire-at-40/", label: "Is $3 million enough?" },
  ],
  "coast-fire": [
    { href: "/retirement/", label: "Full retirement projection with contributions" },
    { href: "/investing/", label: "Project a taxable brokerage account" },
    { href: "/net-worth/", label: "Track your net worth" },
  ],
  "investing": [
    { href: "/iul-calculator/", label: "Pitched an IUL? Run the numbers" },
    { href: "/retirement/", label: "Plan your retirement" },
    { href: "/portfolio/", label: "Balance your portfolio" },
    { href: "/net-worth/", label: "Track your net worth" },
    { href: "/roundup/best-brokers-for-treasury-bonds/", label: "Best brokers for Treasury bonds" },
    { href: "/guides/how-to-invest-200k/", label: "Investing a lump sum? Start with $200k" },
    { href: "/guides/how-to-invest-100k-to-1-million/", label: "How long $100k takes to reach $1M" },
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
    { href: "/guides/financial-planning-for-30-year-olds/", label: "Financial planning in your 30s" },
  ],
  "budget": [
    { href: "/net-worth/", label: "See your full net worth" },
    { href: "/investing/", label: "Invest your monthly surplus" },
    { href: "/retirement/", label: "Are you saving enough to retire?" },
    { href: "/personal-loan/", label: "Consolidating debt? Model a personal loan" },
    { href: "/guides/sales-tax-holidays-guide/", label: "Do sales tax holidays actually save money?" },
    { href: "/guides/ai-financial-advice-chatbots-guide/", label: "Using AI chatbots for money questions" },
    { href: "/guides/lending-money-to-family-boundaries/", label: "Lending money to family? Set boundaries first" },
  ],
  "personal-loan": [
    { href: "/budget/", label: "Does the payment fit your budget?" },
    { href: "/net-worth/", label: "See your full net worth" },
    { href: "/credit-card-payoff/", label: "Compare against paying the card down directly" },
    { href: "/guides/how-to-choose-a-balance-transfer-credit-card/", label: "Compare a 0% balance transfer instead" },
    { href: "/guides/how-to-read-a-personal-loan-review/", label: "How to read a lender review" },
    { href: "/guides/is-prosper-a-good-personal-loan-lender/", label: "Considering Prosper? Read the real cost first" },
    { href: "/guides/is-possible-finance-a-good-personal-loan-option/", label: "Considering Possible Finance? Check the real APR" },
  ],
  "credit-card-payoff": [
    { href: "/personal-loan/", label: "Compare a fixed-rate personal loan instead" },
    { href: "/budget/", label: "Build a payoff plan into your budget" },
    { href: "/net-worth/", label: "See your full net worth" },
    { href: "/roundup/best-credit-cards-for-fair-credit/", label: "Rebuilding credit? Compare cards for fair credit" },
    { href: "/roundup/best-secured-credit-cards/", label: "No credit history yet? Compare secured cards" },
    { href: "/roundup/best-cash-back-credit-cards/", label: "Paying in full each month? Compare cash back cards" },
    { href: "/roundup/best-travel-credit-cards/", label: "Compare the best travel credit cards" },
    { href: "/roundup/best-student-credit-cards/", label: "First card as a student? See the best options" },
    { href: "/roundup/best-citi-credit-cards/", label: "Comparing Citi cards? See the full lineup" },
    { href: "/guides/how-to-choose-a-balance-transfer-credit-card/", label: "Consider a 0% balance transfer card" },
    { href: "/guides/should-you-get-the-discount-tire-credit-card/", label: "Financing new tires? Check the deferred-interest math first" },
    { href: "/guides/should-you-get-the-nibbles-credit-card/", label: "Considering a pet-insurance credit card?" },
  ],
  "pto-cashout": [
    { href: "/budget/", label: "Plan where the payout goes in your budget" },
    { href: "/net-worth/", label: "See your full net worth" },
    { href: "/investing/savings-goal-calculator/", label: "Build an emergency fund instead" },
    { href: "/personal-loan/", label: "Comparing a personal loan instead of cashing out leave?" },
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
    { href: "/guides/how-to-get-a-business-loan-with-bad-credit/", label: "Damaged credit? See financing that weighs revenue instead" },
  ],
  "business-line-of-credit": [
    { href: "/invoice-factoring/", label: "Factor invoices for faster cash" },
    { href: "/merchant-cash-advance/", label: "When speed matters: MCA" },
    { href: "/guides/small-business-financing-guide/", label: "Compare every financing option" },
    { href: "/guides/how-to-get-a-business-loan-with-bad-credit/", label: "Below a 620 score? Start here" },
  ],
  "business-loan-payoff": [
    { href: "/business-line-of-credit/", label: "Need more credit instead?" },
    { href: "/guides/small-business-financing-guide/", label: "Compare every financing option" },
    { href: "/net-worth/", label: "Track your net worth" },
    { href: "/guides/how-to-get-a-business-loan-with-bad-credit/", label: "Bad credit? See which financing types still qualify" },
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
