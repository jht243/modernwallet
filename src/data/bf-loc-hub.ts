import type { CalculatorDef } from "./types";

export const LOC_HUB: CalculatorDef = {
  id: "business-line-of-credit",
  islandId: "business-line-of-credit",
  label: "Business Line of Credit",
  navOrder: 32,

  metaTitle: "Business Line of Credit Calculator | Free",
  metaDescription:
    "Free business line of credit calculator. Enter your draw, APR, term, and draw fee to see your monthly payment, total interest, and true effective APR.",
  targetKeyword: "business line of credit calculator",

  h1: "Business Line of Credit Calculator",

  intro:
    "This business line of credit calculator shows your monthly payment and the true cost of the money you draw. Enter how much you draw, your APR, your repayment term, and any draw fee. A line of credit is revolving, so you pay interest only on the amount you actually draw — not your full credit limit. Draw $50,000 at a 12% APR over 24 months with a 2% draw fee, and your monthly payment is $2,353.67. You pay $6,488.17 in interest plus a $1,000 draw fee. That brings the total cost of the money to $7,488.17, an effective APR of 14.05% once the fee is counted.",

  howItWorks:
    "A business line of credit calculator amortizes the amount you draw over your repayment term, then adds any fees to find your real cost. First, the tool spreads your draw across each month at your APR, the same way a term loan works once the money is out. A $50,000 draw at 12% over 24 months comes to a $2,353.67 monthly payment and $6,488.17 in total interest. Next, it adds your draw fee — 2% of $50,000 is $1,000 here. The total cost of the money is $7,488.17. Because that $1,000 fee is real money you never get to use, your effective APR climbs to 14.05%, above the 12% quoted rate. Draw fees and maintenance fees are why the true cost of a line almost always beats the sticker rate. For a full comparison of options, see our [small business financing guide](/guides/small-business-financing-guide/).",

  faqs: [
    {
      question: "How does a business line of credit calculator work?",
      answer:
        "A business line of credit calculator amortizes your draw over your repayment term at your APR, then adds fees to show the true cost. It returns your monthly payment, total interest, any draw fee, the total cost of the money, and your effective APR. In our default example, a $50,000 draw at 12% over 24 months has a $2,353.67 monthly payment and costs $7,488.17 in total.",
    },
    {
      question: "How is a line of credit different from a term loan?",
      answer:
        "A line of credit is revolving, so you draw funds as needed and pay interest only on what you draw. A term loan hands you the full amount at once, and you pay interest on all of it from day one. With a revolving line, you can repay a draw and borrow again up to your limit. This flexibility is why many owners use a line for cash-flow gaps instead of a lump-sum loan.",
    },
    {
      question: "Why is my effective APR higher than the quoted rate?",
      answer:
        "Your effective APR is higher because draw fees and maintenance fees add cost the quoted rate hides. In our example, a 12% APR plus a 2% draw fee produces a 14.05% effective APR. The $1,000 fee is money you pay but never get to use, so it raises your real borrowing cost. Always ask a lender for the effective APR, not just the interest rate.",
    },
    {
      question: "How much interest do I pay on a business line of credit?",
      answer:
        "You pay interest only on the amount you draw, not on your full credit limit. Drawing $50,000 at a 12% APR over 24 months costs $6,488.17 in interest. If you draw less or repay faster, you pay less interest. This is a core advantage of a revolving line over a fixed lump-sum loan.",
    },
    {
      question: "Is a line of credit cheaper than a merchant cash advance?",
      answer:
        "A line of credit is usually far cheaper than a merchant cash advance for the same amount of money. A line charges a normal APR, while a [merchant cash advance](/merchant-cash-advance/) uses a factor rate that often works out to a triple-digit APR. For a full breakdown, read [merchant cash advance vs a business loan](/compare/merchant-cash-advance-vs-loan/). If you invoice customers, [invoice factoring](/invoice-factoring/) is another option to weigh.",
    },
    {
      question: "What fees should I watch for on a business line of credit?",
      answer:
        "Watch for the APR, draw fees, annual or maintenance fees, and any late fees before you sign. The CFPB advises comparing the APR, whether it can change, and every access and account fee across offers. A 2% draw fee on a $50,000 draw adds $1,000 in cost, which pushes a 12% rate up to a 14.05% effective APR. Total these fees on this calculator before you commit.",
    },
    {
      question: "Can I get a $500,000 business line of credit?",
      answer:
        "It's possible, but a line that large usually comes from a bank rather than an online lender, and it typically requires strong revenue, time in business, and collateral. Conventional and online lenders more commonly cap lines in the tens of thousands to low hundreds of thousands of dollars. For a larger line backed by a government guarantee, ask about an SBA CAPLine, a type of SBA 7(a) loan structured as a revolving line — see our [business line of credit vs SBA loan](/compare/business-line-of-credit-vs-sba-loan/) comparison for how that option differs on approval time and qualification.",
    },
  ],

  sources: [
    {
      label:
        "U.S. Small Business Administration — Types of 7(a) loans (CAPLines revolving lines of credit)",
      url: "https://www.sba.gov/partners/lenders/7a-loan-program/types-7a-loans",
    },
    {
      label:
        "Consumer Financial Protection Bureau — What to look for when shopping for a line of credit",
      url: "https://www.consumerfinance.gov/ask-cfpb/what-should-i-look-for-when-shopping-for-a-personal-line-of-credit-en-905/",
    },
  ],

  defaultPreset: {
    drawAmount: 50000,
    aprPct: 12,
    repaymentTermMonths: 24,
    drawFeePct: 2,
  },
};
