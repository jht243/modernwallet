import type { CalculatorDef } from "./types";

export const FACTORING_HUB: CalculatorDef = {
  id: "invoice-factoring",
  islandId: "invoice-factoring",
  label: "Invoice Factoring",
  navOrder: 31,

  metaTitle: "Invoice Factoring Calculator | Free Tool",
  metaDescription:
    "Free invoice factoring calculator. Enter your invoice, advance rate, and fee to see cash now, the reserve held back, total fees, and your effective APR.",
  targetKeyword: "invoice factoring calculator",

  h1: "Invoice Factoring Calculator",

  introText:
    "This invoice factoring calculator shows exactly how much cash you'll get now, and what the factoring deal really costs. Enter the invoice amount, advance rate, factoring fee, and how quickly your customer pays. The calculator then gives you your upfront cash, the reserve held back, total fees, and true annual cost.\n\nFor example, with a $100,000 invoice, an 85% advance rate, and a 1.5% fee per 30 days, you receive $85,000 in cash now and hold a $15,000 reserve. If your customer pays in 45 days, the total factoring fee is $3,000, your $12,000 rebate is released, and your net proceeds are $97,000, an effective APR of 28.63%.",

  howItWorks:
    "An invoice factoring calculator estimates your cost by combining the advance rate, the factoring fee, and how long your customer takes to pay. First, you sell an unpaid invoice to a factoring company. The advance rate sets your cash now — 85% of a $100,000 invoice is $85,000. The remaining $15,000 is a reserve the factor holds back. The fee is charged per 30-day period the invoice stays open, so 1.5% over 45 days spans two periods and totals $3,000. When your customer pays, the factor releases the reserve minus fees. Here that rebate is $12,000, leaving $97,000 in net proceeds. Because factoring is a sale of receivables, not a loan, it does not add debt to your balance sheet. The [factoring fee calculator](/invoice-factoring/factoring-fee-calculator/) isolates just the fee if you want a quick single number.",

  faqs: [
    {
      question: "What does invoice factoring mean?",
      answer:
        "Invoice factoring means selling your unpaid customer invoices to a third-party company, called a factor, in exchange for immediate cash instead of waiting 30, 45, or 60 days for payment. The factor advances most of the invoice value upfront — typically 80% to 90% — then pays you the remaining balance, minus its fee, once your customer settles the invoice. In plain terms, it converts money you're already owed into cash today, at a discount, without creating new debt on your books.",
    },
    {
      question: "How does an invoice factoring calculator work?",
      answer:
        "An invoice factoring calculator multiplies your invoice by the advance rate to find cash now, then applies the factoring fee for each 30-day period until payment. It shows the reserve held back, the rebate released when your customer pays, your net proceeds, and the effective APR. In our default example, a $100,000 invoice returns $85,000 up front and $97,000 net after a $3,000 fee.",
    },
    {
      question: "What is the difference between recourse and non-recourse factoring?",
      answer:
        "Recourse factoring means you must buy back an invoice if your customer never pays, so you carry the non-payment risk. Non-recourse factoring shifts that risk to the factoring company, which absorbs the loss instead. Because the factor takes on more risk with non-recourse deals, it usually charges higher fees. This choice changes who eats a bad debt, so read your agreement closely.",
    },
    {
      question: "How is the reserve released in invoice factoring?",
      answer:
        "The reserve is the part of your invoice the factor holds back until your customer pays. In our example, the factor advances $85,000 and holds a $15,000 reserve. When the customer pays in 45 days, the factor releases the reserve minus its fees. That means a $12,000 rebate here, since the $3,000 fee comes out of the $15,000 reserve first.",
    },
    {
      question: "Is invoice factoring a loan?",
      answer:
        "No, invoice factoring is a sale of your receivables, not a loan. You sell unpaid invoices to a factoring company for immediate cash instead of borrowing money you must repay. Because it is a sale, factoring does not add debt to your balance sheet. This is a key difference from a [merchant cash advance](/merchant-cash-advance/) or a bank line of credit.",
    },
    {
      question: "What is a good advance rate and factoring fee?",
      answer:
        "A good advance rate typically falls between 80% and 90% of the invoice value, and factoring fees usually run 1% to 5% per 30-day period. Higher advance rates and lower fees favor your business. Faster-paying customers also lower your total cost, since fees accrue for each period the invoice stays open. Compare offers using this factoring calculator before you sign.",
    },
    {
      question: "How do I lower my effective APR on factoring?",
      answer:
        "Lower your effective APR by working with faster-paying customers and negotiating a lower fee per period. In our example, a 45-day payment on a 1.5% fee produces a 28.63% APR. If the same customer paid in 30 days, only one fee period would apply, cutting the cost and the APR. You can also learn more in our [small business financing guide](/guides/small-business-financing-guide/).",
    },
    {
      question: "How fast can I get funded through invoice factoring?",
      answer:
        "Most factoring companies wire your advance within 24 to 48 hours after approving your first invoice, and repeat draws on already-approved customers can fund same-day. The setup itself — verifying your invoices and your customer's credit — is usually the slower step, often taking a few days to a week for a new account. Once that groundwork is done, ongoing factoring is one of the fastest ways to convert receivables into cash.",
    },
    {
      question: "Does invoice factoring require good business credit?",
      answer:
        "No. Factoring approval is based mainly on your customer's creditworthiness, not yours, since the factor is advancing against an invoice your customer owes. That makes it accessible to newer or lower-credit businesses that would not qualify for a traditional bank loan, as long as they bill creditworthy commercial or government customers. Your own credit history can still affect fee pricing, but it is rarely a disqualifying factor the way it is for a term loan.",
    },
    {
      question: "How do I record invoice factoring on my books?",
      answer:
        "It depends on whether your deal qualifies as a sale or a secured loan under GAAP. See our guide on [how to account for invoice factoring](/guides/how-to-account-for-invoice-factoring/) for the exact journal entries, the reserve and rebate treatment, and the balance-sheet impact of each case.",
    },
  ],

  sources: [
    {
      label: "U.S. Small Business Administration — Asset-Based Lending: Upside and Downside",
      url: "https://www.sba.gov/blog/asset-based-lending-what-upside-downside",
    },
    {
      label: "U.S. Small Business Administration — 7(a) Working Capital Pilot Program",
      url: "https://www.sba.gov/partners/lenders/7a-loan-program/7a-working-capital-pilot-program",
    },
  ],

  defaultPreset: {
    invoiceAmount: 100000,
    advanceRatePct: 85,
    factorFeePct: 1.5,
    daysUntilPaid: 45,
    feeStructure: "per30",
  },
};
