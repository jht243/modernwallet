import type { Guide } from "./guides";

// Business Financing pillar HUB guide. Phase-3 standard: AEO-first, YMYL byline + JSON-LD,
// primary sources only (SBA, Federal Reserve Small Business Credit Survey, FTC, CFPB).
// Threads the three hub calculators + the factor-rate calculator throughout.

export const BUSINESS_GUIDES: Guide[] = [
  {
    slug: "small-business-financing-guide",
    title: "Small Business Financing: A Complete Guide",
    metaDescription:
      "Small business financing explained: compare invoice factoring, a merchant cash advance, and a line of credit by speed, cost, and fit. Free calculators inside.",
    h1: "Small Business Financing: The Complete Guide for Owners",
    cardBlurb:
      "Compare factoring, merchant cash advances, and lines of credit by speed, cost, and fit — with free calculators for each.",
    intro:
      "Small business financing is money you borrow or advance to run or grow your business, repaid over time with interest or fees. This guide helps you pick the right option by weighing three things: how fast you need cash, what it truly costs, and whether you have unpaid B2B invoices. You will compare a merchant cash advance, invoice factoring, and a business line of credit. Each section links to a free ModernWallet calculator so you can run your own numbers. It also flags a costly trap the FTC has sued over, so you sign nothing blind.",
    sections: [
      {
        heading: "What counts as small business financing",
        body:
          "Small business financing covers any funding you use to cover expenses or grow. The most common forms are term loans, lines of credit, invoice factoring, and merchant cash advances. Each one prices risk differently, so the best choice depends on your situation.\n\nMany owners seek financing every year. In the Federal Reserve's 2024 Small Business Credit Survey, 59% of employer firms said they had applied for financing or used personal funds in the prior year. The most common reasons were covering operating expenses (56%) and funding an expansion (46%).\n\nThe survey also shows that outcomes vary widely. Only 41% of applicants got all the money they sought, while 24% got none. Knowing your options improves your odds and lowers your cost.",
      },
      {
        heading: "Start with SBA and bank loans for the lowest cost",
        body:
          "SBA and bank loans almost always cost the least, so start there if you have time. The SBA's 7(a) program guarantees loans up to $5 million through banks and credit unions. Its Microloan program lends up to $50,000, with an average loan near $13,000.\n\nThese loans carry the lowest rates but the slowest process. Approval can take weeks and needs strong credit, tax returns, and often collateral. If you can wait and you qualify, this is the cheapest money you will find. Already carrying one? Use our [business loan payoff calculator](/business-loan-payoff/) to see how much an extra monthly payment saves in interest.\n\nWhen a bank says no or the timeline is too long, the alternatives below fill the gap. They cost more but move faster. The rest of this guide helps you choose among them.",
      },
      {
        heading: "The decision framework: speed vs. cost vs. receivables",
        body:
          "Choose your financing by answering three questions in order. First, how fast do you need the cash? Second, how much can you afford to pay in total? Third, do you have unpaid invoices from other businesses (B2B)?\n\nIf you have B2B receivables and want the lowest cost of the fast options, invoice factoring usually wins. You sell unpaid invoices for cash now and pay a factor fee. Model the fee against your invoice value with our [invoice factoring calculator](/invoice-factoring/).\n\nIf you have no B2B invoices but need cash in days, a merchant cash advance is the fastest, though the most expensive. If you have decent credit and want a reusable, lower-cost cushion, a business line of credit beats both. The next sections break down each one.",
      },
      {
        heading: "When invoice factoring is the right call",
        body:
          "Invoice factoring fits businesses that invoice other companies and wait 30 to 90 days to get paid. You sell those unpaid invoices to a factor for most of their value up front. When your customer pays, you get the rest minus a factor fee.\n\nFactoring is cheaper than a merchant cash advance and nearly as fast. It also does not add debt, since you are selling an asset you already own. Your approval leans on your customers' credit, not just yours.\n\nRun your invoice amount and fee through our [invoice factoring calculator](/invoice-factoring/) to see your true cost. To weigh it head-to-head against an advance, read our [invoice factoring vs. merchant cash advance comparison](/compare/invoice-factoring-vs-merchant-cash-advance/).",
      },
      {
        heading: "When a merchant cash advance makes sense (and its true cost)",
        body:
          "A merchant cash advance (MCA) is the fastest option, often funding in one to two days. You get a lump sum and repay it from a slice of your daily card sales. It fits businesses with strong card revenue and no B2B invoices to factor.\n\nAn MCA is priced with a factor rate, not an interest rate, which hides the real cost. A 1.4 factor rate on $50,000 means you repay $70,000, no matter how fast you pay it off. Convert a factor rate into a true annualized cost with our [factor rate calculator](/merchant-cash-advance/factor-rate-calculator/).\n\nModel the full advance, including daily payments, with our [merchant cash advance calculator](/merchant-cash-advance/). To see how it stacks up against a normal loan, read our [merchant cash advance vs. loan comparison](/compare/merchant-cash-advance-vs-loan/).",
      },
      {
        heading: "When a business line of credit wins",
        body:
          "A business line of credit is the most flexible option and usually cheaper than an MCA. It works like a credit card: you draw what you need, pay interest only on that amount, and reuse it as you repay. This makes it ideal for uneven cash flow.\n\nA line of credit rewards decent credit and some operating history. Rates and limits depend on your revenue and credit profile. Because you only pay for what you use, it beats a lump-sum advance for ongoing or unpredictable needs.\n\nSize a draw and estimate your interest with our [business line of credit calculator](/business-line-of-credit/). If your need is one-time and urgent instead of ongoing, revisit the factoring or MCA options above.",
      },
      {
        heading: "The warning: MCA stacking and confessions of judgment",
        body:
          "The biggest danger in fast financing is a merchant cash advance, and two features make it worse. The first is stacking: taking a second or third advance on top of an existing one. Each new advance takes another cut of your daily sales, and the payments can quickly outrun your revenue.\n\nThe second is a confession of judgment (COJ). This is a clause where you sign away your right to fight a lawsuit before any dispute exists. The FTC has sued MCA operators who used COJs to seize business owners' personal and business assets, in one case winning a $20.3 million judgment.\n\nBefore you sign any advance, read every clause and refuse a COJ. Watch for hidden upfront fees and personal guarantees the FTC has flagged as deceptive. If a contract is confusing, have a lawyer review it first.",
      },
      {
        heading: "Match the tool to your need",
        body:
          "The right choice comes down to your answers on speed, cost, and receivables. Have B2B invoices? Start with factoring. Need cash in a day with no invoices? An MCA is fastest but priciest. Want a flexible, lower-cost cushion? Use a line of credit.\n\nWhatever you choose, run the numbers before you commit. Each option looks different once you see the total cost, not just the payment. The calculators below let you compare all three side by side.\n\nStart with the cheapest option you qualify for and have time to get. Move to faster, costlier options only when speed truly matters. That order protects your margins.",
      },
    ],
    tools: [
      { href: "/merchant-cash-advance/", label: "Merchant cash advance" },
      { href: "/invoice-factoring/", label: "Invoice factoring" },
      { href: "/business-line-of-credit/", label: "Business line of credit" },
      { href: "/merchant-cash-advance/factor-rate-calculator/", label: "Factor rate" },
    ],
    faqs: [
      {
        question: "What is small business financing?",
        answer:
          "Small business financing is money you borrow or advance to run or grow your business, repaid over time with interest or fees. Common forms include SBA and bank loans, business lines of credit, invoice factoring, and merchant cash advances. Each prices risk differently, so cost and speed vary.",
      },
      {
        question: "What is the cheapest small business financing?",
        answer:
          "SBA and bank loans are almost always the cheapest financing. The SBA's 7(a) program guarantees loans up to $5 million, and its Microloan program lends up to $50,000. They carry the lowest rates but take the longest to approve and require strong credit.",
      },
      {
        question: "When is invoice factoring better than a merchant cash advance?",
        answer:
          "Invoice factoring is usually better when you invoice other businesses and wait to get paid. It costs less than a merchant cash advance, funds almost as fast, and adds no debt because you are selling an asset. A cash advance fits only when you have no B2B invoices to factor.",
      },
      {
        question: "How does a merchant cash advance factor rate work?",
        answer:
          "A factor rate is a multiplier, not an interest rate. A 1.4 factor rate on a $50,000 advance means you repay $70,000, regardless of how fast you pay it off. This can hide a very high annual cost, so convert it with a factor rate calculator before you sign.",
      },
      {
        question: "What is a confession of judgment in an MCA contract?",
        answer:
          "A confession of judgment is a clause that waives your right to contest a lawsuit before any dispute happens. The FTC has sued merchant cash advance operators who used these clauses to seize owners' personal and business assets. Refuse a confession of judgment and have a lawyer review any advance contract.",
      },
      {
        question: "What is MCA stacking and why is it risky?",
        answer:
          "MCA stacking is taking a second or third merchant cash advance on top of an existing one. Each advance takes another slice of your daily sales, so the combined payments can outrun your revenue. Stacking is a common path to a cash crunch and should be avoided.",
      },
    ],
    sources: [
      {
        label: "Federal Reserve — 2025 Report on Employer Firms (2024 Small Business Credit Survey)",
        url: "https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms",
      },
      {
        label: "U.S. Small Business Administration — 7(a) loans",
        url: "https://www.sba.gov/funding-programs/loans/7a-loans",
      },
      {
        label: "FTC — Protecting small businesses seeking financing (merchant cash advances)",
        url: "https://www.ftc.gov/business-guidance/blog/2020/08/protecting-small-businesses-seeking-financing-during-pandemic",
      },
    ],
  },

  // Competitor-monitor pass (2026-07-20) — revenue-based loan sizing, grounded in the Fed's own
  // Small Business Credit Survey rather than any single lender's internal application data.
  {
    slug: "how-revenue-affects-business-loan-approval",
    title: "How Revenue Affects Your Business Loan Amount",
    metaDescription:
      "See how your business's revenue shapes what lenders approve — the funding gap by revenue size, and how to size a loan request lenders say yes to.",
    h1: "How Revenue Affects the Business Loan Amount You Can Get",
    cardBlurb: "The funding gap by revenue size, why growth rate matters as much as revenue level, and how to size a request lenders actually approve.",
    intro:
      "Revenue is one of the strongest signals a lender uses to size a business loan approval, but it isn't the only one — growth trend and lender type shift your odds of getting the full amount you ask for. This guide covers how revenue level and growth affect approval, where the funding gap is widest, and how to size a loan request that matches what a lender is actually likely to approve.",
    sections: [
      {
        heading: "Why working capital needs rise with revenue",
        body: "A business's working capital needs — inventory, payroll, receivables financing — scale roughly with its revenue, since more sales generally means more cash tied up in the gap between paying suppliers and collecting from customers. Lenders use this relationship in reverse: your revenue tells them roughly how large a working capital loan or credit line your business can realistically use and service.\n\nThis is why a loan request wildly out of proportion to your revenue draws extra scrutiny even with strong credit. A $500,000 loan request from a business doing $300,000 in annual revenue asks a lender to bet on future growth that hasn't happened yet, which is a fundamentally different (and harder) approval than sizing the request to current revenue.",
      },
      {
        heading: "The funding gap: who gets the full amount they ask for",
        body: "According to the Federal Reserve's [Small Business Credit Survey](https://www.fedsmallbusiness.org/reports/survey), 42% of applicants received the full amount of financing they sought, 36% received some or most of it, and 22% received none at all — meaning a majority of applicants get less than they asked for, not the full request. Small banks had the highest full-approval rate among lender types at 57%, well above the overall average, which is one reason a local bank or credit union is often worth trying before a larger, faster online lender.\n\nGrowth trend matters as much as revenue level. Among firms with steady month-over-month revenue growth of 10% or more, the approval rate reached 68% — well above the overall average — showing lenders weigh trajectory, not just your most recent revenue figure, when sizing an offer.",
      },
      {
        heading: "Lower-revenue businesses see the widest gap",
        body: "Smaller, lower-revenue businesses generally face a wider gap between what they request and what they're approved for, since a lender has less operating history and cash flow evidence to underwrite against. This isn't a reason to avoid applying — it's a reason to apply with a smaller, better-justified request and a lender suited to newer or smaller businesses, such as an [SBA Microloan](https://www.sba.gov/funding-programs/loans/microloans) intermediary or a local credit union, rather than starting with a large ask at a big bank.\n\nAs revenue and operating history grow, so does a lender's ability to underwrite based on real cash flow rather than projections, which is a large part of why approval odds and funded amounts both improve as a business matures — even before accounting for any change in credit profile.",
      },
      {
        heading: "How to size a loan request lenders say yes to",
        body: "Anchor your request to a specific, documented use — inventory for a confirmed order, payroll for a seasonal hiring push, equipment with a quote in hand — rather than a round number based on how much you'd like to have available. A specific, verifiable use is easier for a lender to underwrite and easier for you to justify if asked.\n\nRequest an amount your current revenue and cash flow can service comfortably, even before accounting for growth you expect but haven't yet realized. If your real need is larger than what your current numbers support, consider a smaller amount now paired with a revolving line of credit for the buffer, rather than one large term loan sized to a revenue projection.",
      },
      {
        heading: "Build liquidity before you need it",
        body: "Businesses that apply for financing with existing cash reserves and a clean, current set of financial statements generally see faster underwriting and better terms than businesses applying reactively during a cash crunch. Building even a modest cash buffer before you need financing gives you leverage: you can walk away from a bad offer instead of accepting whatever a lender proposes because you're out of options.\n\nKeep your bookkeeping current year-round, not just at tax time. A lender that can see clean, up-to-date financials moves faster and often extends better terms than one working from stale or incomplete records, since accurate numbers reduce the lender's own risk in the deal.",
      },
      {
        heading: "Try smaller banks and credit unions first",
        body: "Small banks post the highest full-approval rate of any lender type in the Fed's survey data, which makes them worth approaching before a larger bank or a fast online lender, especially for a business whose revenue doesn't yet support a large request. A community bank or credit union with local decision-making can also weigh factors — a long-standing relationship, local market knowledge — that a larger, more automated underwriting process may not.\n\nIf a smaller lender can't fund the full amount, a business line of credit or invoice factoring can fill the gap without forcing you to accept an oversized term loan just to get the total dollar amount you need — compare the trade-offs in our [small business financing guide](/guides/small-business-financing-guide/).",
      },
    ],
    tools: [
      { href: "/business-loan-payoff/", label: "Business loan payoff" },
      { href: "/business-line-of-credit/", label: "Business line of credit" },
      { href: "/invoice-factoring/", label: "Invoice factoring" },
    ],
    faqs: [
      { question: "How much of a business loan will I actually get approved for?", answer: "It varies widely, but Federal Reserve survey data shows only 42% of applicants get the full amount they request, 36% get some or most of it, and 22% get none. Your odds of full funding improve with a smaller banking relationship, steady revenue growth, and a request sized to your current cash flow rather than a future projection." },
      { question: "Does revenue growth matter more than revenue level for loan approval?", answer: "Growth trend carries real weight alongside your revenue level. Firms with steady month-over-month revenue growth of 10% or more saw a 68% approval rate in Federal Reserve survey data, well above the overall average, showing lenders weigh trajectory as well as your current revenue figure." },
      { question: "Why do small banks approve more small business loans than big banks?", answer: "Small banks posted the highest full-approval rate among lender types in the Fed's Small Business Credit Survey, at 57%. Local decision-making and a direct banking relationship can factor favorably into underwriting in ways a larger, more automated process may not." },
      { question: "How do I size a business loan request that's likely to be approved?", answer: "Anchor the request to a specific, documented use — inventory, payroll, or equipment with a real cost attached — sized to what your current revenue and cash flow can service. If your real need is larger, pair a smaller term loan with a revolving line of credit rather than requesting one oversized loan based on future projections." },
      { question: "Do newer or lower-revenue businesses have a harder time getting a full loan approval?", answer: "Generally yes, since lenders have less operating history and cash flow evidence to underwrite against. An SBA Microloan intermediary or a local credit union is often a better starting point than a large bank for a newer or lower-revenue business, since they're built to work with smaller, less-established borrowers." },
    ],
    sources: [
      {
        label: "Federal Reserve — Small Business Credit Survey",
        url: "https://www.fedsmallbusiness.org/reports/survey",
      },
      {
        label: "U.S. Small Business Administration — Microloan Program",
        url: "https://www.sba.gov/funding-programs/loans/microloans",
      },
    ],
  },
];
