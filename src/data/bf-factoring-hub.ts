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

  intro:
    "This invoice factoring calculator shows exactly how much cash you get now and what a factoring deal really costs. Enter your invoice amount, advance rate, factoring fee, and how fast your customer pays. The tool returns your upfront cash, the reserve held back, total fees, and your true annual cost. For a $100,000 invoice at an 85% advance rate and a 1.5% fee per 30 days, you get $85,000 in cash now and hold a $15,000 reserve. When your customer pays in 45 days, the total factoring fee is $3,000, your $12,000 rebate is released, and your net proceeds are $97,000 — an effective APR of 28.63%.",

  howItWorks:
    "An invoice factoring calculator estimates your cost by combining the advance rate, the factoring fee, and how long your customer takes to pay. First, you sell an unpaid invoice to a factoring company. The advance rate sets your cash now — 85% of a $100,000 invoice is $85,000. The remaining $15,000 is a reserve the factor holds back. The fee is charged per 30-day period the invoice stays open, so 1.5% over 45 days spans two periods and totals $3,000. When your customer pays, the factor releases the reserve minus fees. Here that rebate is $12,000, leaving $97,000 in net proceeds. Because factoring is a sale of receivables, not a loan, it does not add debt to your balance sheet. The [factoring fee calculator](/invoice-factoring/factoring-fee-calculator/) isolates just the fee if you want a quick single number.",

  faqs: [
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
