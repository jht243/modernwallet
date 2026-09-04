import type { CalculatorDef } from "./types";

export const MCA_HUB: CalculatorDef = {
  id: "merchant-cash-advance",
  islandId: "merchant-cash-advance",
  label: "Merchant Cash Advance",
  navOrder: 30,

  // ---- Hub-page SEO ----
  metaTitle: "MCA Calculator: Merchant Cash Advance Cost & APR",
  metaDescription:
    "Free MCA calculator (not technically a loan). Enter your advance, factor rate, and term to see the total payback, daily payment, and true effective APR.",
  targetKeyword: "mca calculator",
  h1: "MCA Calculator: True Cost of a Merchant Cash Advance",

  introText:
    "This MCA calculator shows the true cost of a merchant cash advance in seconds. Enter your advance amount, factor rate, and estimated term, and the tool will calculate your total payback, cost of capital, and true effective APR.\n\nHere's the default example: A $50,000 advance with a 1.30 factor rate and an estimated 12-month term results in a total payback of $65,000. That includes $15,000 in cost of capital. With daily payments of $257.94 (about $5,416.67 per month across 252 payments) the effective APR is 54.81%.",

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
        "Technically no. An MCA is structured as a sale of your future receivables, not a loan. Because it is a purchase, many state usury caps that limit loan interest rates do not apply. The [CFPB](https://www.consumerfinance.gov/) still treats MCAs as credit for fair-lending purposes, and states like [New York](https://www.dfs.ny.gov/reports_and_publications/press_releases/pr202302011) now require APR-style disclosures on these deals.",
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
    {
      question: "Are MCAs legal?",
      answer:
        "Yes — merchant cash advances are legal across the United States. An MCA is a purchase of your future receivables, not a loan, so it generally falls outside the usury caps that limit interest rates on loans. That is the accurate answer behind the common \"is an MCA usury\" search — it reflects a structural difference in the product, not a loophole this calculator is built to endorse or condemn. What has changed recently is disclosure, not legal status. A growing list of states — New York, [California](https://dfpi.ca.gov/regulated-industries/california-financing-law/about-california-financing-law/california-financing-law-commercial-financing-disclosures/), [Utah](https://dfi.utah.gov/non-depository/commercial-financing/), [Connecticut](https://portal.ct.gov/-/media/dob/consumer-credit-division/commercial-financing-guidance-8-1.pdf), [Florida](https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0500-0599%2F0559%2FSections%2F0559.9613.html), [Georgia](https://www.legis.ga.gov/api/legislation/document/20232024/219440), and [Virginia](https://www.scc.virginia.gov/regulated-industries/bureau-of-financial-institutions/) — now require MCA providers to give an APR-equivalent cost disclosure before you sign. There is still no federal law written specifically for MCAs, so coverage keeps evolving state by state.",
    },
    {
      question: "Are MCAs a scam?",
      answer:
        "Not inherently. MCAs are a legal, legitimate financing product used by many small businesses, but the category does attract bad actors. The [FTC](https://www.ftc.gov/news-events/news/press-releases/2022/01/merchant-cash-advance-providers-banned-industry-ordered-redress-small-businesses) has banned specific MCA providers and ordered refunds over deceptive practices such as hidden fees, undisclosed daily withdrawal amounts, and aggressive collection tactics. Before you sign with any provider, get the total payback amount, the exact payment schedule, and any default or collection terms in writing, and run the numbers through this calculator so you know your true cost and effective APR up front.",
    },
    {
      question: "What are the pros and cons of an MCA?",
      answer:
        "The main advantage is speed and accessibility: funding can arrive in a day or two, approval leans on your revenue history rather than a high credit score or collateral, and payments flex with sales since most providers take a percentage of daily receipts. The tradeoffs are real. The effective APR usually runs far higher than a bank loan or line of credit (our $50,000 example works out to 54.81%), the factor-rate cost is fixed no matter how fast you repay, and larger advances often require a personal guarantee and a UCC lien on business assets. Weigh an MCA against a [business line of credit](/business-line-of-credit/) or [invoice factoring](/invoice-factoring/) before you decide.",
    },
    {
      question: "Does an MCA require a personal guarantee?",
      answer:
        "Often, yes, especially for larger advances or newer businesses. A personal guarantee means you agree to repay the advance from personal assets if the business can't, which is separate from the underlying MCA itself — the sale-of-receivables structure applies to the business's revenue, but the guarantee is a promise you make as an individual. Some providers waive it for smaller advances or well-established businesses with strong revenue history. Always read the guarantee language in the contract before you sign, since it can expose personal assets even though an MCA is marketed as business-only financing.",
    },
    {
      question: "Is an MCA payment tax deductible?",
      answer:
        "Generally, yes. The discount or fee portion of a merchant cash advance — the difference between what you receive and the total payback — is typically treated as a deductible business expense, similar to how loan interest is deducted, rather than as a return of principal. Because an MCA is legally a sale of receivables rather than a loan, the exact accounting treatment can vary by provider and by how the advance is booked. This isn't tax advice; confirm the correct treatment for your specific advance with a CPA before you file.",
    },
    {
      question: "Does an MCA report to business credit bureaus?",
      answer:
        "It depends on the provider. Some MCA companies report payment history to commercial credit bureaus such as [Equifax Business](https://www.equifax.com/business/) or [Dun & Bradstreet](https://www.dnb.com/en-us/smb/business-credit.html), which can help or hurt your business credit profile depending on how the advance is repaid. Most providers, however, do not report to any commercial bureau, and reporting to your PERSONAL credit file is rare since an MCA is underwritten against business revenue, not your personal credit history. Ask any provider directly whether — and to whom — they report before you sign.",
    },
    {
      question: "Is a merchant cash advance halal?",
      answer:
        "This is genuinely disputed, and qualified Islamic finance scholars disagree. An MCA is structured as a purchase of future receivables at a fixed factor rate rather than a loan carrying a time-based interest charge, which puts it structurally closer to a permissible sale-based contract than a conventional interest (riba) loan. Some scholars view the revenue-share mechanism favorably for that reason. Others argue the fixed factor-rate markup still functions economically like interest regardless of the legal label, which makes it harder to reconcile with riba prohibitions. There is no single settled verdict — if Shariah compliance matters for your business, consult a qualified Islamic finance scholar about the specific advance and provider you're considering before signing.",
    },
    {
      question: "Where did merchant cash advances come from, and how are they regulated today?",
      answer:
        "Merchant cash advances emerged in the United States in the mid-1990s as an alternative to traditional small-business bank lending, built around advancing cash against future card and receivables revenue for businesses that banks considered too new or too risky to qualify for a conventional loan. The product has grown since into a multi-billion-dollar alternative-financing niche serving retailers, restaurants, and other cash-flow-dependent small businesses that value speed over a low rate. Regulation has developed unevenly and state by state: there is still no federal law written specifically for MCAs, but New York, California, Utah, Connecticut, Florida, Georgia, and Virginia all now require providers to give an APR-equivalent cost disclosure before a business signs. Expect more states to pass similar commercial-financing-disclosure laws as the industry keeps growing.",
    },
    {
      question: "What documents and requirements do I need to apply for a merchant cash advance?",
      answer:
        "Most providers ask for the same core paperwork: 3 to 6 months of business bank statements, proof you've been in business for a minimum period (often 6 months to 1 year), a minimum monthly revenue threshold, and a signed application. Larger advances typically also require a signed personal guarantee. Because underwriting leans on your recent bank statements and revenue rather than a lengthy credit file, approval and funding can move in a day or two once your documents are in. Applications are handled entirely online or by phone — there is no merchant cash advance office to visit, so searching for one \"near me\" won't turn up a physical branch the way a bank might.",
    },
    {
      question: "What fees does an MCA carry beyond the factor rate?",
      answer:
        "The factor rate is not the only cost. Most MCA providers also charge an origination fee, deducted from your advance before you receive it. That means less than the full $50,000 may hit your account even before repayment starts. Many providers separately charge an underwriting or administrative fee to cover reviewing your application and bank statements. If your provider collects payments through daily ACH withdrawals, expect a per-transaction ACH or processing fee on top of each payment. None of these fees show up in the factor-rate math this calculator runs. Add them to the $65,000 payback in our example to find your true out-of-pocket cost. Ask any provider for a written, itemized fee schedule before you sign, since fee names and amounts vary a lot by provider.",
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
