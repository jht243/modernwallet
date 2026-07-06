import type { CalculatorDef } from "./types";

export const MCA_HUB: CalculatorDef = {
  id: "merchant-cash-advance",
  islandId: "merchant-cash-advance",
  label: "Merchant Cash Advance",
  navOrder: 30,

  // ---- Hub-page SEO ----
  metaTitle: "MCA Calculator: Merchant Cash Advance Cost & APR",
  metaDescription:
    "Free MCA calculator. Enter your advance, factor rate, and term to see the total payback, daily payment, cost of capital, and true effective APR.",
  targetKeyword: "mca calculator",
  h1: "MCA Calculator: True Cost of a Merchant Cash Advance",

  intro:
    "This mca calculator shows the real cost of a merchant cash advance in seconds. Enter your advance amount, factor rate, and estimated term. The tool returns your total payback, cost of capital, and true effective APR.\n\nHere is the default example. A $50,000 advance at a 1.30 factor rate over an estimated 12-month term means a $65,000 total payback. That is $15,000 in cost of capital. Repaid through daily payments of $257.94 (about $5,416.67 per month across 252 payments), the effective APR works out to 54.81%.",

  howItWorks:
    "A merchant cash advance calculator works by multiplying your advance by the factor rate to find the total payback. Factor rates usually run from 1.10 to 1.50. At a 1.30 factor rate, a $50,000 advance means you owe $65,000. The extra $15,000 is your cost of capital.\n\nNext, the mca calculator estimates your daily payment. It spreads the $65,000 total payback across the estimated term, roughly 252 business-day payments over 12 months. That gives a daily payment of $257.94, or about $5,416.67 per month. From those payments, the tool derives the effective APR, which here is 54.81%.\n\nOne key point most tools hide: a factor rate is NOT an interest rate. Interest accrues over time, so paying a loan off early saves money. A factor rate is fixed. You owe factor × advance no matter what, so paying an MCA off early does not lower your $65,000 payback. To compare an MCA against real interest-based options, use the [factor rate calculator](/merchant-cash-advance/factor-rate-calculator/) or weigh a [business line of credit calculator](/business-line-of-credit/) instead.",

  faqs: [
    {
      question: "What does this mca calculator tell me?",
      answer:
        "This mca calculator tells you the total cost of an advance before you sign. It multiplies your advance by the factor rate to get the total payback, then shows your cost of capital, daily payment, and effective APR. For the $50,000 example at a 1.30 factor rate, that is a $65,000 payback, $15,000 in cost, and a 54.81% effective APR.",
    },
    {
      question: "Is a factor rate the same as an interest rate?",
      answer:
        "No. A factor rate is a fixed multiplier, not an interest rate. You owe the factor rate times your advance no matter how fast you repay. A 1.30 factor rate on $50,000 always means $65,000 owed. Interest, by contrast, accrues over time. That is why an MCA's effective APR can look very high once you convert it.",
    },
    {
      question: "Does paying off a merchant cash advance early save money?",
      answer:
        "Usually no. Because the cost is baked into a fixed factor rate, paying early does not reduce your payback. You still owe factor × advance, so $65,000 on our example advance stays $65,000. Some providers offer a discount for early payoff, but it is not required. Always ask and get any discount in writing.",
    },
    {
      question: "Is a merchant cash advance a loan?",
      answer:
        "Technically no. An MCA is structured as a sale of your future receivables, not a loan. Because it is a purchase, many state usury caps that limit loan interest rates do not apply. The CFPB still treats MCAs as credit for fair-lending purposes, and states like New York now require APR-style disclosures on these deals.",
    },
    {
      question: "How is the daily payment on an MCA calculated?",
      answer:
        "The daily payment spreads your total payback across the estimated repayment term. Our example splits a $65,000 payback across about 252 business-day payments over 12 months. That equals $257.94 per day, or roughly $5,416.67 per month. Providers may instead take a fixed percentage of daily sales, which shortens or lengthens the real term.",
    },
    {
      question: "What are cheaper alternatives to a merchant cash advance?",
      answer:
        "Cheaper options usually include a bank or SBA loan, a line of credit, or invoice-based funding. Compare an MCA against a [business line of credit calculator](/business-line-of-credit/) and [invoice factoring](/invoice-factoring/) before you commit. Our [merchant cash advance vs a business loan](/compare/merchant-cash-advance-vs-loan/) breakdown and the [small business financing guide](/guides/small-business-financing-guide/) walk through the tradeoffs.",
    },
  ],

  sources: [
    {
      label:
        "FTC — Merchant Cash Advance Providers Banned From Industry, Ordered to Redress Small Businesses (2022)",
      url: "https://www.ftc.gov/news-events/news/press-releases/2022/01/merchant-cash-advance-providers-banned-industry-ordered-redress-small-businesses",
    },
    {
      label:
        "NY Dept. of Financial Services — Commercial Financing Disclosure Regulation (APR disclosures for sales-based financing)",
      url: "https://www.dfs.ny.gov/reports_and_publications/press_releases/pr202302011",
    },
    {
      label: "U.S. Small Business Administration — 7(a) Loans",
      url: "https://www.sba.gov/funding-programs/loans/7a-loans",
    },
  ],

  defaultPreset: {
    advanceAmount: 50000,
    factorRate: 1.3,
    termMonths: 12,
    paymentFrequency: "daily",
  },
};
