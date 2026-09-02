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
          "Small business financing covers any funding you use to cover expenses or grow. The most common forms are term loans, lines of credit, invoice factoring, merchant cash advances, and [business credit cards](/roundup/best-business-credit-cards/). Each one prices risk differently, so the best choice depends on your situation.\n\nMany owners seek financing every year. In the Federal Reserve's 2024 Small Business Credit Survey, 59% of employer firms said they had applied for financing or used personal funds in the prior year. The most common reasons were covering operating expenses (56%) and funding an expansion (46%).\n\nThe survey also shows that outcomes vary widely. Only 41% of applicants got all the money they sought, while 24% got none. Knowing your options improves your odds and lowers your cost.",
      },
      {
        heading: "Start with SBA and bank loans for the lowest cost",
        body:
          "SBA and bank loans almost always cost the least, so start there if you have time. The SBA's 7(a) program guarantees loans up to $5 million through banks and credit unions. Its Microloan program lends up to $50,000, with an average loan near $13,000.\n\nThese loans carry the lowest rates but the slowest process. Approval can take weeks and needs strong credit, tax returns, and often collateral. If you can wait and you qualify, this is the cheapest money you will find. Already carrying one? Use our [business loan payoff calculator](/business-loan-payoff/) to see how much an extra monthly payment saves in interest. If a low credit score is what's holding you back, see our [guide to getting a business loan with bad credit](/guides/how-to-get-a-business-loan-with-bad-credit/) for the SBA Microloan's looser floor and the revenue-based options that skip a credit check entirely.\n\nWhen a bank says no or the timeline is too long, the alternatives below fill the gap. They cost more but move faster. The rest of this guide helps you choose among them.",
      },
      {
        heading: "The decision framework: speed vs. cost vs. receivables",
        body:
          "Choose your financing by answering three questions in order. First, how fast do you need the cash? Second, how much can you afford to pay in total? Third, do you have unpaid invoices from other businesses (B2B)?\n\nIf you have B2B receivables and want the lowest cost of the fast options, invoice factoring usually wins. You sell unpaid invoices for cash now and pay a factor fee. Model the fee against your invoice value with our [invoice factoring calculator](/invoice-factoring/).\n\nIf you have no B2B invoices but need cash in days, a merchant cash advance is the fastest, though the most expensive. If you have decent credit and want a reusable, lower-cost cushion, a business line of credit beats both. The next sections break down each one.",
      },
      {
        heading: "When invoice factoring is the right call",
        body:
          "Invoice factoring fits businesses that invoice other companies and wait 30 to 90 days to get paid. You sell those unpaid invoices to a factor for most of their value up front. When your customer pays, you get the rest minus a factor fee.\n\nFactoring is cheaper than a merchant cash advance and nearly as fast. It also does not add debt, since you are selling an asset you already own — as long as the deal qualifies as a sale under GAAP rather than a secured loan. Your approval leans on your customers' credit, not just yours.\n\nRun your invoice amount and fee through our [invoice factoring calculator](/invoice-factoring/) to see your true cost. To weigh it head-to-head against an advance, read our [invoice factoring vs. merchant cash advance comparison](/compare/invoice-factoring-vs-merchant-cash-advance/). If you need to book the deal on your own books, see our guide on [how to account for invoice factoring](/guides/how-to-account-for-invoice-factoring/).",
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

  // Autocomplete pass (2026-07-22) — GAAP/ASC 860 treatment of invoice factoring. Primary source:
  // FASB (ASC 860, Transfers and Servicing). Numbers match the factoring-fee-calculator spoke
  // ($25,000 invoice, 90% advance, 3% fee, 30 days) for cross-site consistency.
  {
    slug: "how-to-account-for-invoice-factoring",
    title: "How to Account for Invoice Factoring (GAAP Guide)",
    metaDescription:
      "Learn how to account for invoice factoring under GAAP: sale vs. loan treatment, journal entries, and balance-sheet impact, with a worked example.",
    h1: "How to Account for Invoice Factoring Under GAAP",
    cardBlurb:
      "Sale or loan? The GAAP journal entries, reserve accounting, and balance-sheet treatment for factored invoices, with a worked example.",
    intro:
      "Invoice factoring changes your books differently depending on how the deal is written. A factoring deal is either a sale of your receivables or a secured loan under GAAP (Generally Accepted Accounting Principles). That choice drives every journal entry you make.\n\nThe [Financial Accounting Standards Board (FASB)](https://fasb.org/about-us/facts) sets this rule in [ASC 860](https://storage.fasb.org/ASU2009-16.pdf), the standard for transfers of financial assets. This guide shows the debit and credit entries for both cases. It also covers the reserve, the rebate, and a worked $25,000 invoice example.",
    sections: [
      {
        heading: "Is invoice factoring a sale or a loan?",
        body:
          "Invoice factoring is either a sale of your receivables or a secured loan. GAAP decides which one applies. Under ASC 860, a transfer counts as a sale only if you give up control of the receivable.\n\nThree conditions decide that question. Your receivables must be legally separated from you, even if you go bankrupt. The buyer must also be free to pledge or sell them.\n\nYou must keep no real say over the receivable afterward, either. That is the third condition. All three must hold at once, not just one or two.\n\nIf all three conditions hold, you record the deal as a sale. You then remove the receivable from your books entirely. If even one condition fails, GAAP treats the whole deal as a secured borrowing instead.",
      },
      {
        heading: "Why recourse and non-recourse matter, but aren't the whole test",
        body:
          "Recourse factoring means you must buy back an invoice if your customer never pays. Non-recourse factoring shifts that non-payment risk to the factor instead. This split matters, but it does not decide the accounting alone.\n\nA non-recourse deal usually clears the ASC 860 sale test. The factor carries the credit risk in that case. You keep no real stake in the invoice.\n\nA recourse deal can still count as a sale, though. That happens when your guarantee only covers fraud or a billing dispute. The accounting turns on the exact rights each side keeps.\n\nIt does not turn on the word \"recourse\" alone. Read your contract closely before you assume either treatment applies. When in doubt, ask your accountant to walk through the three conditions against your agreement.",
      },
      {
        heading: "Journal entries when factoring qualifies as a sale",
        body:
          "Take a $25,000 invoice factored at a 90% advance rate, a 3% fee, and 30 days until payment. Your advance today is $22,500. The factor holds back a $2,500 reserve.\n\nAt the sale date, you debit cash for $22,500. You debit a \"due from factor\" asset for the $2,500 reserve. You credit accounts receivable for $25,000, and the invoice leaves your books.\n\nThe $750 factoring fee is booked right away, not when your customer pays. Debit factoring fee expense for $750, and credit due from factor for $750 as well.\n\nWhen your customer pays in 30 days, the factor sends your $1,750 rebate. Debit cash for $1,750 to record it. Credit due from factor for $1,750, which closes that account to zero.",
      },
      {
        heading: "Journal entries when factoring is a secured borrowing",
        body:
          "Some deals fail the ASC 860 sale test, often due to a strong repurchase obligation. GAAP then treats the deal as a secured borrowing. The receivable never leaves your books, and the cash you get is a liability, not sale proceeds.\n\nUsing the same $25,000 invoice, you debit cash for $22,500. You debit due from factor for the $2,500 reserve. You credit a \"due to factor\" liability for $25,000, and accounts receivable stays untouched.\n\nWhen your customer pays, debit due to factor for $25,000 and credit accounts receivable for $25,000. Record the $750 fee as interest expense against the reserve. Then collect the $1,750 rebate in cash, just as in the sale example above.",
      },
      {
        heading: "How the reserve and rebate get booked",
        body:
          "The reserve is the slice of your invoice the factor holds back until your customer pays. It belongs on your books as an asset, often called due from factor. In our example, that reserve starts at $2,500.\n\nWhen the customer pays, the factor keeps its fee out of the reserve first. It sends you the rest as a rebate, which is $1,750 here after the $750 fee. That rebate closes the due-from-factor account to zero.\n\nUntil the rebate arrives, the due-from-factor balance is real cash owed to you. Do not write it off or ignore it at month-end. Track it the same way you would track any other short-term receivable.",
      },
      {
        heading: "Balance-sheet impact: what changes and what doesn't",
        body:
          "A sale-treatment factoring deal removes the receivable from your balance sheet. It replaces that receivable with cash and a small reserve asset. Your total assets stay close to the invoice's value, and no new debt appears anywhere.\n\nA secured-borrowing deal works the opposite way. The receivable stays on your balance sheet exactly as before. A new liability also appears for the cash you were advanced, so both assets and liabilities grow.\n\nThis difference matters beyond bookkeeping. A secured borrowing raises your reported debt and can trip a loan covenant tied to your debt-to-asset ratio. That is one reason lenders and factors both care which test your deal actually passes.",
      },
      {
        heading: "How factoring accounting differs from a bank loan",
        body:
          "A bank loan always adds a liability to your books. It does not matter how you use the cash. Your receivables stay exactly as they were before the loan.\n\nSale-treatment factoring works differently. You trade one asset, the receivable, for another asset, cash. No new debt shows up on your balance sheet at all.\n\nThat is why factoring can look cheaper on paper than a same-size loan. The fee still cuts into your proceeds, though. Run both options through our [invoice factoring calculator](/invoice-factoring/) before you decide.\n\nOur [small business financing guide](/guides/small-business-financing-guide/) compares factoring against loans and other options side by side.",
      },
      {
        heading: "Get the numbers right before you sign",
        body:
          "Ask your accountant to confirm your contract clears the ASC 860 sale test. Do this before you book a single entry. Getting this wrong can misstate your balance sheet.\n\nA misstatement can also confuse your lender. It can throw off a loan covenant tied to your reported debt.\n\nModel your own invoice through our [invoice factoring calculator](/invoice-factoring/) hub to see your advance, reserve, fee, and net proceeds. Use the [factoring fee calculator](/invoice-factoring/factoring-fee-calculator/) to isolate the cost on one invoice. Use the [accounts receivable financing calculator](/invoice-factoring/accounts-receivable-financing/) instead for an ongoing arrangement.\n\nBoth tools use the same math shown in the journal entries above. Run your own numbers before you sign anything.",
      },
    ],
    tools: [
      { href: "/invoice-factoring/", label: "Invoice factoring" },
      { href: "/invoice-factoring/factoring-fee-calculator/", label: "Factoring fee" },
      { href: "/invoice-factoring/accounts-receivable-financing/", label: "Accounts receivable financing" },
    ],
    faqs: [
      {
        question: "Is invoice factoring a loan or a sale for accounting purposes?",
        answer:
          "It depends on the deal. Under FASB's ASC 860, factoring is a sale only if you give up legal and practical control of the receivable. If you keep a strong repurchase obligation or retain effective control, GAAP treats it as a secured loan instead, and the receivable stays on your books.",
      },
      {
        question: "What is the journal entry for factoring a $25,000 invoice?",
        answer:
          "On a $25,000 invoice at a 90% advance rate and a 3% fee, sale treatment works like this. Debit cash for $22,500, debit a due-from-factor reserve for $2,500, and credit accounts receivable for $25,000. Then debit factoring fee expense for $750 and credit due from factor for $750, and record the $1,750 rebate as cash in once your customer pays.",
      },
      {
        question: "Does invoice factoring show up as debt on the balance sheet?",
        answer:
          "Only if it fails the ASC 860 sale test. A qualifying sale removes the receivable and adds no debt, since you exchanged one asset for another. A deal treated as a secured borrowing keeps the receivable on your books and adds a matching liability for the cash advanced.",
      },
      {
        question: "How do I book the factoring reserve and rebate?",
        answer:
          "Record the reserve as an asset called due from factor at the time you sell or pledge the invoice. When your customer pays and the factor releases the rebate, debit cash and credit due from factor for the rebate amount, which zeroes out that account once the invoice is fully settled.",
      },
      {
        question: "Does recourse vs. non-recourse decide the accounting by itself?",
        answer:
          "No. Recourse and non-recourse describe who bears the risk of non-payment, but ASC 860 asks a broader question about control. A recourse deal can still qualify as a sale if your obligation is limited to fraud or disputes rather than ordinary non-payment, so read the specific terms, not just the label.",
      },
    ],
    sources: [
      {
        label: "FASB — Accounting Standards Update 2009-16, Transfers and Servicing (Topic 860)",
        url: "https://storage.fasb.org/ASU2009-16.pdf",
      },
      {
        label: "FASB — About the FASB",
        url: "https://fasb.org/about-us/facts",
      },
    ],
  },

  // -- competitor-monitor pass 2026-08-19 --
  {
    slug: "how-to-get-a-business-loan-with-bad-credit",
    title: "How to Get a Business Loan With Bad Credit in 2026",
    metaDescription:
      "Business loan options for bad credit: SBA Microloans, revenue-based lenders, and five moves that improve approval odds even below a 620 score.",
    h1: "How to Get a Business Loan With Bad Credit",
    cardBlurb: "SBA Microloans, revenue-focused lenders, and five concrete moves that improve approval odds when your credit score is working against you.",
    intro:
      "A credit score below 620 rules out the cheapest bank and SBA 7(a) financing, but it does not rule out every legitimate financing option. This guide covers the specific loan types that weigh business revenue over personal credit, the SBA program built for exactly this situation, and five moves that measurably improve your approval odds without waiting years to rebuild your score first.",
    sections: [
      {
        heading: "What 'bad credit' actually means to a lender",
        body:
          "Most small business lenders weigh two separate scores: your personal FICO score and, for many but not all loan types, your business's own credit profile, commonly the FICO SBSS score used by the [Small Business Administration](https://www.sba.gov/) and many banks. A personal score below roughly 620 is the practical line where SBA 7(a) loans and most bank term loans become very difficult to qualify for, though it is not always a hard automatic decline.\n\nBusiness revenue and time in business matter more than most owners expect. A lender evaluating a two-year-old business with $30,000 in monthly revenue and a 580 personal credit score is looking at a fundamentally different risk profile than a brand-new business with the same score and no revenue history, and several of the options below are built specifically around that revenue-first evaluation.",
      },
      {
        heading: "SBA Microloans: the most accessible SBA path",
        body:
          "SBA Microloans, funded up to $50,000 through nonprofit intermediary lenders rather than banks directly, carry meaningfully looser credit requirements than the SBA's larger 7(a) program. Many microloan intermediaries accept scores in the 575 to 620 range, and some will consider an application as low as 540 to 575 when the business shows strong offsetting factors: consistent monthly revenue, low existing debt, real business experience, or a credible business plan.\n\nThe trade-off for that flexibility is loan size and speed. A $50,000 cap and nonprofit-intermediary underwriting means the process usually takes longer than a same-day online lender, and the average SBA Microloan lands closer to $13,000 than the $50,000 ceiling. If your capital need fits inside that range, a Microloan is worth applying for before turning to a more expensive alternative lender, since the rate is typically far lower than what a revenue-based or merchant cash advance product will offer at a comparable credit tier.",
      },
      {
        heading: "Financing that weighs revenue over your credit score",
        body:
          "If your credit sits below the Microloan floor, or you need more than $50,000, several financing types are underwritten primarily on business cash flow rather than personal credit. [Invoice factoring](/invoice-factoring/) sells your unpaid B2B invoices for cash now, and approval leans on your customers' creditworthiness, not yours, which makes it accessible even to a business owner with damaged personal credit as long as the business itself invoices other companies. A [business line of credit](/business-line-of-credit/) from a fintech lender can also work at a lower credit tier than a bank would accept, though typically at a higher rate that reflects the added risk.\n\nA merchant cash advance is the fastest and most credit-lenient option of the three, since approval weighs your daily card sales more than your credit score at all, but it is also the most expensive per dollar borrowed of any option on this list. Treat it as a short-term bridge, not a standing financing strategy, and compare its real cost against a business line of credit or invoice factoring using our [small business financing guide](/guides/small-business-financing-guide/) before committing.",
      },
      {
        heading: "A worked example: $20,000, three ways",
        body:
          "Run the same $20,000 need through three paths to see why lender type matters as much as your score. An SBA Microloan at a representative 10% APR over 4 years, if your local intermediary approves a 590 score with strong revenue, costs roughly $507 a month and about $4,348 in total interest over the term.\n\nA fintech business line of credit at a representative 30% APR drawn as a 12-month installment costs roughly $1,950 a month and about $3,397 in interest, less total interest than the Microloan since the balance is repaid far faster, but requires no fixed collateral and often funds within days rather than weeks. A merchant cash advance on the same $20,000 at a 1.35 factor rate costs $27,000 total regardless of how fast you repay it, meaning $7,000 in fees, before any daily holdback timing risk on slow-revenue weeks. The line of credit and the Microloan land within roughly $1,000 of each other in total interest here, so speed and collateral requirements, not just rate, decide between them; the MCA is the clear outlier, costing $2,600 to $3,600 more in total fees than either one, which is exactly why it belongs in the 'fast bridge' category, not the default choice.",
      },
      {
        heading: "Five moves that improve your approval odds",
        body:
          "Choose the right lender type first. A bank or SBA 7(a) lender screens hardest on personal credit; a revenue-based or invoice-factoring lender screens hardest on cash flow, so applying to the wrong lender type for your specific weak point wastes a hard credit inquiry for nothing. If your business owns or is buying equipment, equipment financing is worth a specific look here too: the equipment itself serves as collateral, which routinely qualifies at a lower credit threshold than an unsecured loan of the same size.\n\nAsk for less money: a lender evaluating a smaller, more conservative request is taking on less risk, which can be the difference between an approval and a decline at a borderline credit score. Consider a co-signer with stronger personal credit, understanding that a co-signer is equally liable for the debt if your business can't repay it. And write a short, direct explanation of what caused the bad credit (a specific past event, not a vague excuse) in your application; underwriters read these, and a clear, honest account of a resolved past problem reads very differently than silence on the topic. A free session with a [SCORE](https://www.score.org/) or Small Business Development Center advisor before you apply can also help you match your specific situation to the right lender type, at no cost.",
      },
      {
        heading: "Build credit for your next round of financing",
        body:
          "Every payment you make on whichever financing you choose here is an opportunity to build the credit profile that gets you a cheaper loan next time. On-time payments on a Microloan, a factoring arrangement, or a business line of credit typically get reported to business credit bureaus, and a stronger business credit file can qualify your company for SBA 7(a) or conventional bank financing at a fraction of today's cost within a year or two.\n\nThe [Federal Reserve's Small Business Credit Survey](https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms) found that 42% of applicants received the full amount of financing they sought, 36% received some or most of it, and 22% received none at all, so a partial approval or a more expensive first loan is a common starting point, not a sign you did something wrong. Run your specific numbers, loan amount, rate, and term, through our [business loan payoff calculator](/business-loan-payoff/) once you have an offer in hand, so you know the real total cost before you sign.",
      },
    ],
    tools: [
      { href: "/business-loan-payoff/", label: "Business loan payoff" },
      { href: "/invoice-factoring/", label: "Invoice factoring" },
      { href: "/business-line-of-credit/", label: "Business line of credit" },
    ],
    faqs: [
      { question: "What credit score do I need for a business loan?", answer: "It depends heavily on the loan type. SBA 7(a) and most bank term loans generally need a personal score around 620 or higher, while SBA Microloans work with many applicants in the 575 to 620 range, and revenue-based options like invoice factoring or a merchant cash advance can work with an even lower score since they weigh business cash flow more heavily." },
      { question: "Can I get an SBA loan with bad credit?", answer: "An SBA 7(a) loan is difficult below roughly a 620 personal score, but an SBA Microloan, capped at $50,000 and issued through nonprofit intermediary lenders, has meaningfully looser requirements and can work for scores in the 575 to 620 range, or lower with strong offsetting business fundamentals." },
      { question: "What is the fastest business loan option with bad credit?", answer: "A merchant cash advance is typically the fastest, often funding within a day or two, since approval weighs your daily card sales rather than your credit score. It's also the most expensive option per dollar borrowed, so it fits best as a short-term bridge rather than a standing financing plan." },
      { question: "Does invoice factoring require good credit?", answer: "No. Invoice factoring is approved primarily on your customers' creditworthiness, since the factor is buying your unpaid invoices and getting repaid when your customer pays, not lending directly against your own credit profile. This makes it one of the more accessible options for a business owner with damaged personal credit." },
      { question: "Will a co-signer help me qualify for a business loan?", answer: "Often, yes, if the co-signer has stronger personal credit than you do, since the lender is now underwriting against the better of the two profiles. A co-signer takes on equal legal responsibility for the debt, so only add one who could and would repay the loan if your business could not." },
      { question: "How can I build business credit after getting a bad-credit loan?", answer: "Make every payment on time on whatever financing you start with; most lenders, including Microloan intermediaries and factoring companies, report payment history to business credit bureaus. A stronger business credit profile after a year or two of on-time payments typically qualifies you for cheaper financing, including SBA 7(a) or conventional bank loans, the next time you need capital." },
      { question: "Should I explain my bad credit in a loan application?", answer: "Yes, a short, specific, honest account of what caused the credit damage (a past medical bill, a prior business setback, a documented one-time event) generally reads better to an underwriter than leaving the application silent on it. Pair the explanation with evidence the underlying issue is resolved, such as several months of on-time payments since." },
    ],
    sources: [
      { label: "U.S. Small Business Administration — Loans", url: "https://www.sba.gov/funding-programs/loans" },
      { label: "Federal Reserve — 2025 Small Business Credit Survey (Report on Employer Firms)", url: "https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms" },
    ],
  },

  // ga4-top-pages-pass (2026-08-31) — Lane A spoke off the /roundup/business-line-of-credit-rates-by-lender/
  // winner. Requirements/qualification intent (Vol 590, KD 39, DataForSEO) has no dedicated page on-site;
  // the hub calculator and the rate roundup each touch qualification in passing but neither owns the intent.
  {
    slug: "business-line-of-credit-requirements",
    title: "Business Line of Credit Requirements by Lender Type",
    metaDescription:
      "Business line of credit requirements: the credit score, time in business, documents, and collateral rules banks and online lenders each set.",
    h1: "Business Line of Credit Requirements by Lender Type",
    cardBlurb:
      "The credit score, time-in-business, and document rules banks and online lenders set for a business line of credit, plus what to do if you fall short.",
    intro:
      "Most lenders want a personal credit score in the 600s, some operating history, and steady revenue before approving a business line of credit. The credit-score bar tends to run higher at a traditional bank than at a fintech or online lender, which prices for the added risk instead of screening it out. Revenue and time in business, by contrast, vary by lender more than by lender type. A lender also wants specific paperwork before it will quote a rate: bank statements, tax returns, and proof of ownership. Run your own numbers on ModernWallet's [business line of credit calculator](/business-line-of-credit/) once you know which credit tier you're likely to qualify for.",
    sections: [
      {
        heading: "The Short Answer: Credit Score, Time in Business, and Documents",
        body:
          "A business line of credit application comes down to four things: credit score, time in business, revenue and cash flow, and collateral.\n\n[Chase](https://www.chase.com/business/banking/loans/business-line-of-credit) requires a 660-plus FICO score and $100,000 or more in annual revenue for its unsecured line, and [Wells Fargo](https://www.wellsfargo.com/biz/business-credit/lines-of-credit/) sets its guarantor floor at roughly 680. [Bluevine](https://www.bluevine.com/business-loans/line-of-credit), an online lender, accepts scores from 625.\n\nTime in business doesn't split cleanly along the same bank-versus-online line. Wells Fargo, a bank, asks for six months or more in business. Bluevine, an online lender, asks for twelve. Each lender sets its own floor, so check the specific lender's stated minimum rather than assuming banks always ask for longer.",
      },
      {
        heading: "Credit Score: What Banks Want vs. What Online Lenders Accept",
        body:
          "A bank's minimum credit score for a business line of credit usually sits at 660 or higher, and the strongest pricing goes to borrowers well above that floor. Wells Fargo requires the guarantor, the owner personally backing the line, to carry a score typically at 680 or above, according to its own published terms.\n\nOnline and fintech lenders price for the added risk instead of screening it out entirely. Bluevine's stated minimum is 625. Several other lenders in our [business line of credit rates by lender](/roundup/business-line-of-credit-rates-by-lender/) roundup don't publish a minimum at all. They weigh credit as one input among several rather than a hard cutoff.\n\nIf your score sits in the high 500s to low 600s, an online lender is realistically your best path to a revolving line right now. The [SBA Microloan](https://www.sba.gov/funding-programs/loans/microloans) program is also worth checking if you need less than $50,000, since it weighs cash flow more than your credit score. Our guide to [getting a business loan with bad credit](/guides/how-to-get-a-business-loan-with-bad-credit/) covers both options in detail.",
      },
      {
        heading: "Secured vs. Unsecured: When Collateral Changes the Requirements",
        body:
          "An unsecured business line of credit doesn't require you to pledge a specific asset. It still comes with a personal guarantee in nearly every case, and it caps out at a lower limit than a secured line from the same lender. A secured line, backed by equipment, inventory, receivables, or real estate, generally unlocks a larger credit limit and a lower rate. The lender can seize the pledged asset on default instead of relying only on your credit and revenue.\n\nWhich one you can get depends on what your business owns free and clear. A newer business with no unencumbered assets is effectively limited to an unsecured line. An established business with paid-off equipment or property has a real choice between a lower rate and keeping that asset unpledged. Model both scenarios on the [business line of credit calculator](/business-line-of-credit/) before you apply, since the fee and rate difference changes your real monthly payment more than most owners expect.",
      },
      {
        heading: "The Documents a Lender Asks For",
        body:
          "Most lenders ask for the same core set of documents before they underwrite a business line of credit. Expect to provide two to three years of business tax returns and three to six months of business bank statements. You'll also need a copy of your EIN or business license, plus a personal financial statement from every owner with 20% or more equity.\n\nA bank usually also wants a current profit and loss statement and balance sheet. Several online lenders will underwrite from bank statements alone when your revenue history is short.\n\nGather these before you apply rather than after a lender asks. A slow document turnaround is one of the most common reasons an otherwise-qualified applicant loses weeks in underwriting. If your tax returns show heavy write-offs that make your cash flow look worse than it is, keep your bank statements ready to make that case directly. Several lenders weigh deposits over reported net income when the two disagree.",
      },
      {
        heading: "What a Personal Guarantee Requires From You",
        body:
          "A personal guarantee makes you personally liable for the line's balance if the business can't repay it. A lender can pursue your personal assets on default, separate from anything the business itself owns. Nearly every bank and most online lenders require one from any owner holding a meaningful stake, regardless of whether the line itself is secured or unsecured. The guarantee lets the lender extend revolving credit to a legal entity that could otherwise dissolve with the debt unpaid.\n\nA personal guarantee is not the same thing as pledging collateral. Collateral gives the lender a specific asset to claim. A guarantee gives it a legal claim against you personally, with no asset attached until a court order says otherwise. A handful of lenders, mostly ones underwriting heavily on business cash flow rather than the owner's credit, will waive the guarantee for a well-qualified business with a strong balance sheet. That stays the exception rather than the standard term.",
      },
      {
        heading: "Bank vs. Online Lender Requirements, Side by Side",
        body:
          "A bank sets the higher credit-score floor, usually 660 or above, and asks for the fuller paperwork: tax returns, a profit and loss statement, and a balance sheet. In exchange it typically funds in one to three weeks and quotes the lower rate once you clear that bar.\n\nAn online or fintech lender accepts a wider credit range, from the mid-500s up to 625 or higher depending on the lender, and several publish no minimum at all. It often underwrites from bank statements alone and funds in one to three business days. A personal guarantee is standard at both, with only rare exceptions from lenders that underwrite almost entirely on cash flow.\n\nA bank fits a business that already clears its credit bar and can wait a few weeks for a lower rate. An online lender fits a business that needs the line faster, sits below a bank's credit floor, or would rather submit bank statements than a full financial package. A bank wins on rate once you clear its bar. An online lender wins on speed and access below that bar.",
      },
      {
        heading: "If You Do Not Qualify Yet",
        body:
          "A declined application is not necessarily a dead end. If your credit score is the barrier, the SBA Microloan program and several revenue-based lenders weigh cash flow more heavily than your personal score. Our guide to getting a business loan with bad credit covers both in detail. If revenue or time in business is the barrier, building six to twelve months of clean, consistent bank statements before you reapply measurably improves your odds at the same lender.\n\nEvery on-time payment you make on whatever financing you start with today builds the credit and banking history that gets you a better rate the next time you apply. Run the numbers on a smaller starting line first with the [business line of credit calculator](/business-line-of-credit/), so you know your real payment before you commit to anything. Revisit the larger request once your file looks stronger.",
      },
    ],
    tools: [
      { href: "/business-line-of-credit/", label: "Business line of credit calculator" },
      { href: "/roundup/business-line-of-credit-rates-by-lender/", label: "Business line of credit rates by lender" },
      { href: "/guides/how-to-get-a-business-loan-with-bad-credit/", label: "Business loan with bad credit" },
    ],
    faqs: [
      {
        question: "What credit score do I need for a business line of credit?",
        answer:
          "A bank typically wants 660 or higher. Wells Fargo sets its guarantor floor at roughly 680. Online lenders price for more risk instead of screening it out: Bluevine's published minimum is 625, and several others in our lender roundup don't publish a minimum at all.",
      },
      {
        question: "Do I need collateral for a business line of credit?",
        answer:
          "Not always. An unsecured line skips a specific pledged asset but still requires a personal guarantee. A secured line, backed by equipment, inventory, or real estate, typically unlocks a larger limit and a lower rate.",
      },
      {
        question: "How long does my business need to be operating to qualify?",
        answer:
          "It depends on the specific lender rather than on whether it's a bank or an online lender. Wells Fargo, a bank, asks for six months or more. Bluevine, an online lender, asks for twelve. Check the stated minimum for the lender you're applying to instead of assuming a pattern.",
      },
      {
        question: "What documents do I need to apply for a business line of credit?",
        answer:
          "Plan on two to three years of business tax returns, three to six months of bank statements, and your EIN or business license. Add a personal financial statement from every owner with 20% or more equity. Banks often also want a current profit and loss statement and balance sheet.",
      },
      {
        question: "Is a personal guarantee required for a business line of credit?",
        answer:
          "In nearly every case, yes, from any owner with a meaningful stake, whether the line is secured or unsecured. A small number of lenders that underwrite heavily on business cash flow will waive it for a well-qualified business, though that stays the exception.",
      },
      {
        question: "Can I get a business line of credit with bad credit?",
        answer:
          "It is harder but not impossible. Revenue-based online lenders and the SBA Microloan program weigh cash flow and time in business more heavily than a bank does. Both are covered in our guide to getting a business loan with bad credit.",
      },
    ],
    sources: [
      { label: "U.S. Small Business Administration — Microloan Program", url: "https://www.sba.gov/funding-programs/loans/microloans" },
      { label: "Chase — Business Line of Credit", url: "https://www.chase.com/business/banking/loans/business-line-of-credit" },
      { label: "Wells Fargo — BusinessLine Line of Credit", url: "https://www.wellsfargo.com/biz/business-credit/lines-of-credit/" },
      { label: "Bluevine — Business Line of Credit", url: "https://www.bluevine.com/business-loans/line-of-credit" },
    ],
  },

  // keyword-gap-pass 2026-09-02, batch D. register: operator · medium: text → text ·
  // page type: explainer (1200-word floor). Qualification/affordability intent, distinct from
  // /business-loan-payoff/'s payoff math and from the existing revenue/bad-credit guides above,
  // which this cross-links rather than duplicates.
  {
    slug: "how-much-business-loan-can-i-qualify-for",
    title: "How Much Business Loan Can You Qualify For?",
    metaDescription:
      "See what lenders check: revenue, time in business, credit score, and DSCR. Typical thresholds by loan type, plus how to estimate your own borrowing capacity.",
    h1: "How Much Business Loan Can You Qualify For?",
    cardBlurb: "What lenders check on revenue, time in business, credit score, and DSCR, plus how to estimate your own borrowing capacity before you apply.",
    intro:
      "Most lenders qualify a business loan amount using four factors: your revenue, how long you've been in business, your credit score, and your debt service coverage ratio (DSCR), the ratio of your cash flow to your total debt payments. What we see business owners get wrong most often is applying for a round number instead of a number their own cash flow can actually support, which is one of the fastest ways to get approved for less than requested. Revenue and time in business largely determine the maximum amount available. Credit score and DSCR decide whether you qualify for it and at what rate. The sections below cover typical qualification thresholds by loan type, SBA loan, term loan, line of credit, and merchant cash advance (MCA), and a simple way to estimate your own borrowing capacity before you apply.",
    sections: [
      {
        heading: "How Revenue Sets Your Borrowing Limit",
        body: "Revenue sets the outer limit on how much a lender will offer, since a loan payment has to come out of cash the business generates each month. Most lenders size a request against a multiple of monthly or annual revenue rather than approving whatever amount is requested, so a business with $50,000 in monthly revenue is a different underwriting conversation than one with $10,000, even at identical credit scores.\n\nGrowth trend matters alongside the revenue level itself. Our [guide to how revenue affects business loan approval](/guides/how-revenue-affects-business-loan-approval/) breaks down the Federal Reserve's Small Business Credit Survey data on this in detail, including the wide range in what applicants actually get approved for versus what they request. The short version: a smaller, well-documented request tied to a specific business need clears underwriting far more easily than a large round number based on what you'd like to have available.",
      },
      {
        heading: "Time in Business: the Threshold by Lender Type",
        body: "Time in business is a hard cutoff for many lenders, not just a factor weighed alongside others. Bank and [Small Business Administration (SBA)](https://www.sba.gov/funding-programs/loans) loans generally want at least two years of operating history and two years of business tax returns, since that history lets an underwriter evaluate real cash flow instead of a projection. Newer businesses aren't automatically shut out. The SBA's Microloan program, funded through nonprofit intermediary lenders rather than banks directly, works with businesses that have far less history, sometimes under a year, when the fundamentals otherwise check out.\n\nOnline lenders sit at the other end. Many will fund a term loan or line of credit with as little as six months to one year in business, trading a lower time-in-business bar for a higher rate. A merchant cash advance (MCA) sits at the loosest end of the range, often available to businesses with as little as three to six months of card or bank revenue history, since approval leans almost entirely on recent daily revenue rather than a multi-year track record.",
      },
      {
        heading: "Credit Score Thresholds by Loan Type",
        body: "Most lenders check two separate scores, your personal FICO score and, for many loan types, the business's own FICO SBSS score, and each loan type sets its bar differently. SBA 7(a) loans and most bank term loans get difficult below roughly a 620 personal score, per standard SBA lender eligibility guidance and typical bank underwriting practice. SBA Microloan intermediaries typically work with a lower range, often 575 to 620, and sometimes further down with strong offsetting revenue.\n\nOnline term loans and lines of credit generally accept a wider band, often 600 to 650 depending on the lender, in exchange for a higher rate than a bank would charge at the same score. A merchant cash advance rarely sets a hard credit-score floor at all, since the advance is priced and approved primarily against your daily card or bank deposit history rather than your credit file.",
      },
      {
        heading: "Debt Service Coverage Ratio (DSCR): the Number That Decides the Rate",
        body: "Debt service coverage ratio (DSCR) measures whether your cash flow can cover a new loan payment on top of what you already owe, calculated as net operating income divided by total debt service, meaning all loan and lease payments due in a year, including the new loan being requested. A DSCR of 1.0 means cash flow exactly covers the payments with nothing left over, too thin a margin for most lenders to accept.\n\nMost lenders set a minimum DSCR somewhere between 1.15 and 1.25, meaning your cash flow needs to run 15% to 25% above your total debt payments before a lender will approve the loan. A business with $180,000 in annual net operating income and $120,000 in total debt payments, including the loan being requested, has a DSCR of 1.5, comfortably above that range. Drop that business's net operating income to $132,000 and the DSCR falls to 1.1, likely below what most lenders will accept, even though revenue and credit look unchanged.",
      },
      {
        heading: "Estimate Your Own Borrowing Capacity Before You Apply",
        body: "Estimate your own number by starting with net operating income and working backward from the DSCR floor lenders typically use. Divide your annual net operating income by 1.25, a common lender minimum, to see the maximum total annual debt payment your cash flow can support. Subtract any debt payments you already carry, and what's left is roughly the annual payment capacity available for a new loan.\n\nA business with $150,000 in annual net operating income and no existing debt payments can support up to $120,000 a year in total debt service at a 1.25 DSCR ($150,000 ÷ 1.25). At a representative 10% [SBA 7(a)](https://www.sba.gov/funding-programs/loans/7a-loans) rate over a 10-year term, that payment level supports a loan of roughly $757,000, before accounting for collateral, down payment, or other underwriting requirements a specific lender might add on top. Run the reverse math on your own numbers before applying, so the request you submit matches what your cash flow can carry, not just what you'd like to receive.",
      },
      {
        heading: "The Qualification Snapshot by Loan Type",
        body: "Four loan types serve very different qualification profiles, and matching your own numbers to the right one saves a wasted application and a hard credit inquiry.\n\n- **SBA 7(a) or bank term loan:** roughly 620+ personal credit, 2+ years in business, DSCR of 1.15 to 1.25 or higher, the lowest rate and the slowest approval timeline.\n- **SBA Microloan:** roughly 575 to 620 personal credit, under 2 years in business accepted with strong revenue, capped at $50,000, funded through nonprofit intermediaries rather than a bank.\n- **Online term loan or line of credit:** roughly 600 to 650 personal credit, 6 months to 1 year in business, a higher rate than a bank in exchange for faster funding and a lower revenue-history bar.\n- **Merchant cash advance:** little to no hard credit-score floor, 3 to 6 months of card or bank revenue history, priced by a fixed factor rate rather than an interest rate, and the most expensive option per dollar borrowed.\n\nStart with the option your current numbers already clear, then reassess the cheaper options again once your revenue history and credit both improve. Our [small business financing guide](/guides/small-business-financing-guide/) walks through the cost tradeoff between a line of credit, factoring, and an MCA in more depth once you know which qualification tier fits.",
      },
    ],
    tools: [
      { href: "/business-loan-payoff/", label: "Business loan payoff" },
      { href: "/business-line-of-credit/", label: "Business line of credit" },
      { href: "/merchant-cash-advance/", label: "Merchant cash advance" },
      { href: "/invoice-factoring/", label: "Invoice factoring" },
    ],
    faqs: [
      { question: "How much of a business loan will I qualify for?", answer: "It depends on your revenue, time in business, credit score, and DSCR, and it varies widely by lender and loan type. A rough starting estimate: divide your annual net operating income by 1.25, a common lender minimum DSCR, to see the maximum annual debt payment your cash flow supports, then work backward to a loan amount from there." },
      { question: "What is a good DSCR for a business loan?", answer: "1.25 or higher is a comfortable margin most lenders accept without hesitation. A DSCR between 1.0 and 1.15 is thin and likely to be declined by many lenders, even with strong revenue and credit, since it leaves little room for a slow month before a payment gets missed." },
      { question: "Can I get a business loan with less than a year in business?", answer: "Yes, through an SBA Microloan, an online term loan or line of credit, or a merchant cash advance, each of which accepts a shorter operating history than a bank or SBA 7(a) loan requires. A bank or SBA 7(a) loan generally wants at least two years of tax returns to evaluate real cash flow instead of a projection." },
      { question: "What credit score do I need to qualify for a business loan?", answer: "Roughly 620 or higher for an SBA 7(a) loan or a bank term loan, 575 to 620 for an SBA Microloan, and often 600 to 650 for an online term loan or line of credit. A merchant cash advance rarely sets a hard credit-score floor, since approval leans on daily card or bank revenue instead." },
      { question: "Does my personal credit matter if my business has strong revenue?", answer: "Yes, but less for some loan types than others. A bank or SBA 7(a) lender weighs personal credit heavily. Revenue-based options like a merchant cash advance or invoice factoring weigh your cash flow and, for factoring, your customers' credit far more than your own score." },
      { question: "How is DSCR different from a credit score?", answer: "A credit score measures your history of repaying debt reliably. DSCR measures whether your current cash flow can cover a new loan payment on top of what you already owe. A business can carry an excellent credit score and still fail a DSCR test if it's already carrying heavy debt, or the reverse: a thinner credit file with strong, low-debt cash flow." },
    ],
    sources: [
      { label: "U.S. Small Business Administration — Loans", url: "https://www.sba.gov/funding-programs/loans" },
      { label: "U.S. Small Business Administration — 7(a) loans", url: "https://www.sba.gov/funding-programs/loans/7a-loans" },
      { label: "Federal Reserve — Small Business Credit Survey", url: "https://www.fedsmallbusiness.org/reports/survey" },
    ],
  },

  // keyword-gap-pass 2026-09-02, batch D. register: operator · medium: text → text ·
  // page type: explainer (1200-word floor). Worked payment-math example computed directly
  // (standard amortization formula), not sourced — flagged as illustrative throughout.
  {
    slug: "balloon-payment-business-loan-explained",
    title: "Balloon Payment Business Loans Explained",
    metaDescription:
      "A balloon payment business loan has small payments for years, then one large final payment due at once. See the payment math and the refinance risk.",
    h1: "Balloon Payment Business Loans Explained",
    cardBlurb: "How a balloon structure differs from a standard amortizing loan, the refinance risk at the balloon date, and a full worked payment-math example.",
    intro:
      "A balloon payment business loan charges small monthly payments for a set number of years, then requires one large lump-sum payment, the balloon, to clear the remaining balance all at once. The mistake we see most often is treating the balloon date like a formality instead of a real deadline that requires refinancing, selling, or paying off the balance in cash. Commercial real estate and equipment loans use this structure often, since it keeps the monthly payment low while the lender avoids locking in today's rate for the loan's full amortization period. The payment math and the refinance risk at the balloon date both need to be worked out before you sign, not after.",
    sections: [
      {
        heading: "How a Balloon Structure Differs from a Standard Amortizing Loan",
        body: "A standard amortizing loan pays itself off completely by the end of its term, with every monthly payment covering interest plus a slice of principal until the balance hits zero on the final payment. A balloon loan uses the same monthly payment math, calculated as if the loan amortized over a longer period, often 20 or 25 years, but the loan actually matures much sooner, often in 5 or 7 years, at which point the entire remaining balance comes due at once, what the [Consumer Financial Protection Bureau](https://www.consumerfinance.gov/ask-cfpb/what-is-a-balloon-payment-en-102/) defines as a balloon payment.\n\nThat mismatch between the amortization period used to calculate the payment and the loan's real term keeps the monthly payment low. It also leaves a large balance still owed when the loan matures. Our [business loan payoff calculator](/business-loan-payoff/) models a standard fully-amortizing loan, useful for comparing what a balloon structure's low payment is trading away against a loan that pays itself off completely instead.",
      },
      {
        heading: "The Worked Payment Math",
        body: "Take a $250,000 commercial loan at a 7% annual interest rate, with a monthly payment calculated as if the loan amortized over 20 years (240 months), but a 5-year balloon term (60 months). The standard amortization formula puts the monthly payment at about $1,938, the same payment a fully 20-year loan at that rate and balance would carry.\n\nAfter 60 monthly payments, the loan has paid down only about $34,350 of the original $250,000 principal, since interest makes up most of each early payment on a 20-year schedule. The remaining balance, the balloon due at month 60, comes to roughly $215,650. Total payments made over those 5 years add up to $116,280 ($1,938 × 60), of which about $81,930 went to interest and only $34,350 reduced principal.\n\nA fully amortizing 5-year loan on the same $250,000 balance would instead pay off completely by month 60, with no balloon at all, but at a monthly payment of roughly $4,950, nearly two and a half times higher than the balloon structure's $1,938. That gap is the real price of the low balloon-loan payment: a large lump sum waiting at the end instead of a higher payment spread evenly across the same 5 years.",
      },
      {
        heading: "Why Lenders Structure Loans This Way",
        body: "Lenders offer a balloon structure mainly to manage their own interest rate risk, not as a favor to the borrower's cash flow, though the lower payment is real. Locking in a 20 or 25-year interest rate on a commercial loan exposes a lender to decades of rate risk if market rates rise, so shortening the loan's actual term to 5 or 7 years while still amortizing the payment over a longer period lets the lender reset the rate at maturity instead of carrying that risk for the full amortization period.\n\nCommercial real estate loans commonly use a 5-year or 7-year balloon on a 20 or 25-year amortization schedule, a structure distinct from the [SBA 504 loan program](https://www.sba.gov/funding-programs/loans/504-loans), which finances commercial real estate and major equipment through a fully amortizing structure instead of a balloon. Equipment loans outside the SBA 504 program sometimes use a shorter balloon, a 2- or 3-year term, since equipment depreciates faster than real estate. Either way, the low payment during the loan's active years is the upside. The balloon due date is the tradeoff, not a separate, unrelated feature of the loan.",
      },
      {
        heading: "The Refinance Risk at the Balloon Date",
        body: "The balloon date creates one real risk: needing to refinance, sell, or pay off a large balance at a moment you don't fully control, since the calendar decides when the balloon comes due, not your business's readiness. Three things can go wrong at once. Interest rates may have risen since the original loan closed, raising the cost of any refinance. Your business's revenue or credit profile may have weakened since underwriting, making a new lender's approval harder to get. Or the collateral itself, a commercial property, specialized equipment, may be worth less than it was at closing, creating a loan-to-value problem a refinance lender won't ignore.\n\nAny one of these alone can turn a routine refinance into a rushed, expensive one. All three at once, which tends to happen during a broader economic downturn exactly when many balloon loans across an industry mature at the same time, can make refinancing unavailable altogether, forcing a default or a distressed sale instead.",
      },
      {
        heading: "How to Manage the Balloon Date Before It Arrives",
        body: "Start the refinance conversation 6 to 12 months before the balloon date, not the month it's due, since underwriting a new loan takes real time and a late start removes your ability to shop multiple lenders if the first one says no. Keep financial statements current and clean throughout the loan's term rather than scrambling to assemble them right before refinancing, since a lender evaluating a refinance wants to see the same clean cash-flow history a lender would want for a brand-new loan.\n\nAsk about extension or renewal options when you first sign the loan, not when the balloon date is already close, since some lenders build in a renewal option at the original rate structure or a modest adjustment, which can remove the refinance risk entirely if your lender offers one. Setting aside a portion of monthly cash flow specifically earmarked for the eventual balloon, even informally, is another way to reduce the risk that the payment depends entirely on refinancing working out on schedule.",
      },
    ],
    tools: [
      { href: "/business-loan-payoff/", label: "Business loan payoff" },
    ],
    faqs: [
      { question: "What is a balloon payment on a business loan?", answer: "A balloon payment is the large, single lump-sum payment due at the end of a loan's term to clear the remaining balance, after years of smaller payments calculated as if the loan amortized over a much longer period. It's common on commercial real estate and equipment loans, where a 5- or 7-year balloon often sits on top of a 20- or 25-year amortization schedule." },
      { question: "Why is a balloon loan payment so much lower than a regular loan payment?", answer: "Because the monthly payment is calculated as if the loan paid off over a longer amortization period, often 20 or 25 years, even though the loan actually matures in 5 or 7 years. On a $250,000, 7% loan, that structure puts the payment at about $1,938 a month, versus roughly $4,950 for a loan that fully pays off in the same 5 years." },
      { question: "What happens if I can't pay off or refinance a balloon payment?", answer: "The lender can call the loan in default, which can trigger foreclosure on real estate collateral or repossession of equipment, or force a distressed sale of the asset to cover the balance. This is the core risk of a balloon structure, and it's why starting the refinance process 6 to 12 months before the balloon date matters." },
      { question: "Can I pay off a balloon loan early instead of waiting for the due date?", answer: "Usually yes, but confirm there's no prepayment penalty first, since some commercial loans carry one. Our [business loan payoff calculator](/business-loan-payoff/) models how extra payments toward principal on a standard amortizing loan reduce the balance and the interest owed, useful for planning how fast you could pay down a balloon loan's balance ahead of the maturity date." },
      { question: "Is a balloon loan a bad idea for a small business?", answer: "Not inherently. It fits a business planning to sell, refinance, or pay off the property or equipment well before the balloon date, since the lower payment frees up cash in the meantime. It's a poor fit for a business with no clear plan for the balloon date, since a rate increase, a credit setback, or a drop in the collateral's value can all make refinancing harder exactly when it's needed most." },
      { question: "What loan types commonly use a balloon structure?", answer: "Commercial real estate loans and equipment loans are the most common, along with some seller-financing arrangements in a business acquisition. The SBA 504 loan program is a notable exception built specifically as a fully amortizing alternative for commercial real estate and major equipment, with no balloon payment on its government-backed portion." },
    ],
    sources: [
      { label: "CFPB — What is a balloon payment?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-balloon-payment-en-102/" },
      { label: "U.S. Small Business Administration — 504 Loans", url: "https://www.sba.gov/funding-programs/loans/504-loans" },
    ],
  },
];
