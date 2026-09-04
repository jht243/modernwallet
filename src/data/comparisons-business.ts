// Business Financing pillar — head-to-head comparison pages.
// Route: /compare/<slug>/   (src/pages/compare/[slug].astro)
// YMYL: template renders byline (Jonathan Velez) + verified primary sources.
import type { ComparisonEntry } from "./comparisons";

export const BUSINESS_COMPARISONS: ComparisonEntry[] = [
  // ─── 1. Merchant Cash Advance vs Business Loan ───────────────────────────
  {
    slug: "merchant-cash-advance-vs-loan",
    title: "Merchant Cash Advance vs Loan: Cost & Speed",
    metaDescription:
      "Merchant cash advance vs loan: an MCA can hit ~55% effective APR while a bank or SBA loan runs 8-30%. Compare cost, speed, and repayment.",
    targetKeyword: "merchant cash advance vs loan",
    optionA: "Merchant Cash Advance",
    optionB: "Business Loan",
    segment: "Business Financing",
    h1: "Merchant Cash Advance vs Loan: Which Costs Less?",
    introText:
      "A merchant cash advance vs loan comparison comes down to speed versus cost: an MCA funds in days but can carry a much higher price, while a bank or SBA loan is slower yet far cheaper. A 1.30 factor-rate MCA repaid over about 12 months works out to roughly a 54.81% effective APR. A bank or SBA term loan often lands between 8% and 30% APR. One more key difference: an MCA is legally a sale of your future receivables, not a loan at all.",
    comparisonTable: {
      rows: [
        { dimension: "Legal structure", a: "Sale of future receivables (not a loan)", b: "A loan with a fixed principal and interest" },
        { dimension: "Cost measure", a: "Factor rate (e.g. 1.30 = $13,000 owed on $10,000)", b: "Interest rate / APR (e.g. 8-30%)" },
        { dimension: "Illustrative effective APR", a: "~54.81% (1.30 factor over ~12 months)", b: "Often 8-30% APR (bank / SBA 7(a))" },
        { dimension: "Speed to fund", a: "Often 1-3 business days", b: "Weeks; SBA loans can take 30-90 days" },
        { dimension: "Repayment", a: "Daily or weekly holdback from sales", b: "Fixed monthly payment" },
        { dimension: "Qualification", a: "Based on card / revenue volume; low credit OK", b: "Credit score, time in business, collateral" },
        { dimension: "Cost as you repay", a: "Fixed — early payoff does not save money", b: "Interest accrues on the balance; early payoff saves" },
      ],
    },
    verdict:
      "Choose a business loan when you can wait and qualify — it is almost always cheaper. Choose a merchant cash advance only when you need cash in days, cannot qualify for a loan, and have the sales margin to absorb daily holdbacks. Price the MCA as an effective APR before you sign, because the factor rate hides the true cost.",
    sections: [
      {
        heading: "A merchant cash advance is a receivables sale, not a loan",
        content:
          "A merchant cash advance is legally a purchase of your future sales, not a loan. The provider buys a slice of your future revenue at a discount and collects it back over time. This structure is why MCAs often sit outside state interest-rate caps that apply to loans. The Federal Reserve's Small Business Credit Survey notes MCAs are offered by nonbank providers, usually under $100,000, and repaid as a percentage of sales rather than in fixed amounts. See our [merchant cash advance calculator](/merchant-cash-advance/) to model the payback.",
      },
      {
        heading: "The factor rate makes an MCA look cheaper than it is",
        content:
          "The factor rate hides the true cost of a merchant cash advance. A 1.30 factor on a $10,000 advance means you repay $13,000 — a $3,000 fee no matter how fast you pay. Repaid over about 12 months, that is roughly a 54.81% effective APR, because you lose access to the money over time. The Fed notes MCA providers often do not quote an APR at all. Use our [factor rate calculator](/merchant-cash-advance/factor-rate-calculator/) to convert a factor rate into an APR.",
      },
      {
        heading: "A bank or SBA loan is slower but far cheaper",
        content:
          "A bank or SBA loan almost always costs less than an MCA. SBA 7(a) loans are capped by the SBA at the base rate plus 3.0% to 6.5%, depending on loan size, and can run up to 25 years. Rates commonly land between 8% and 30% APR across bank and online lenders. The trade-off is time: SBA loans can take 30 to 90 days and require credit, revenue history, and often collateral. Compare a [business line of credit](/business-line-of-credit/) if you want flexible, revolving access instead.",
      },
      {
        heading: "Non-obvious insight: early payoff on an MCA saves nothing",
        content:
          "Paying off a merchant cash advance early does not reduce its cost. Because the fee is fixed by the factor rate, you owe the same $13,000 whether you repay in 6 months or 12. That means fast repayment actually raises your effective APR. A loan works the opposite way: interest accrues on the shrinking balance, so paying early saves real money. The FTC has also brought enforcement actions against MCA operators who withdrew more than the agreed amount, so read the holdback terms closely.",
      },
    ],
    faqs: [
      {
        question: "Is a merchant cash advance vs loan cheaper?",
        answer:
          "A loan is almost always cheaper than a merchant cash advance. A 1.30 factor MCA repaid over about 12 months runs near a 54.81% effective APR, while a bank or SBA loan often costs 8-30% APR. Use an MCA only when speed matters more than cost.",
      },
      {
        question: "Is a merchant cash advance a loan?",
        answer:
          "No. A merchant cash advance is legally a sale of your future receivables, not a loan. That structure lets many MCAs avoid state interest-rate caps, which is a key reason they can cost so much more than a business loan.",
      },
      {
        question: "How fast can each option fund?",
        answer:
          "An MCA often funds in one to three business days. A bank loan takes weeks, and an SBA 7(a) loan can take 30 to 90 days. Speed is the main advantage an MCA has over a loan.",
      },
      {
        question: "How is a merchant cash advance repaid?",
        answer:
          "An MCA is repaid through a daily or weekly holdback taken from your sales or bank deposits. A business loan is repaid in fixed monthly installments, which are easier to budget around.",
      },
    ],
    sources: [
      { label: "Federal Reserve — 2025 Small Business Credit Survey (Report on Employer Firms)", url: "https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms" },
      { label: "U.S. SBA — 7(a) loan terms, conditions, and eligibility", url: "https://www.sba.gov/partners/lenders/7a-loan-program/terms-conditions-eligibility" },
      { label: "FTC — Court enters $20.3M judgment against MCA operator for deceiving small businesses", url: "https://www.ftc.gov/news-events/news/press-releases/2024/02/court-enters-203-million-judgment-ftc-case-against-merchant-cash-advance-operator-jonathan-braun" },
      { label: "CFPB — Small business lending under ECOA (Regulation B)", url: "https://www.consumerfinance.gov/rules-policy/final-rules/small-business-lending-under-the-equal-credit-opportunity-act-regulation-b/" },
    ],
    relatedComparisons: ["factor-rate-vs-interest-rate", "invoice-factoring-vs-merchant-cash-advance", "merchant-cash-advance-vs-revenue-based-financing"],
    calculatorLinks: [
      { label: "Merchant cash advance calculator", href: "/merchant-cash-advance/" },
      { label: "Factor rate calculator", href: "/merchant-cash-advance/factor-rate-calculator/" },
      { label: "Business line of credit calculator", href: "/business-line-of-credit/" },
    ],
  },

  // ─── 2. Factor Rate vs Interest Rate (APR) ───────────────────────────────
  {
    slug: "factor-rate-vs-interest-rate",
    title: "Factor Rate vs Interest Rate: Key Differences",
    metaDescription:
      "Factor rate vs interest rate: a 1.40 factor on $100,000 is a fixed $40,000 fee (~95% APR). See why a factor rate never shrinks and APR does.",
    targetKeyword: "factor rate vs interest rate",
    optionA: "Factor Rate",
    optionB: "Interest Rate (APR)",
    segment: "Business Financing",
    h1: "Factor Rate vs Interest Rate: What's the Difference?",
    introText:
      "The core of factor rate vs interest rate is this: a factor rate is a fixed multiplier that never changes, while an interest rate accrues on your balance and falls as you repay. A 1.40 factor rate on a $100,000 advance is a flat $40,000 cost — about a 95% effective APR over roughly 9 months. An interest rate does the opposite: it charges you only on the money you still owe, so the cost drops as the balance shrinks. That single difference is why a factor rate can cost far more than its number suggests.",
    comparisonTable: {
      rows: [
        { dimension: "What it is", a: "A fixed multiplier (e.g. 1.40)", b: "A percentage charged on the balance" },
        { dimension: "How cost is set", a: "Locked at signing — never changes", b: "Accrues over time on what you still owe" },
        { dimension: "Cost on $100,000", a: "1.40 factor = $40,000 fixed fee", b: "Depends on rate, balance, and term" },
        { dimension: "Illustrative effective APR", a: "~95% (1.40 factor over ~9 months)", b: "Stated directly (e.g. 10% APR = 10%)" },
        { dimension: "Effect of paying early", a: "No savings — fee is fixed", b: "Saves money — less interest accrues" },
        { dimension: "Where you see it", a: "MCAs, some short-term advances", b: "Bank loans, SBA loans, lines of credit" },
        { dimension: "Easy to compare?", a: "No — must convert to APR", b: "Yes — APR is standardized" },
      ],
    },
    verdict:
      "An interest rate (APR) is the honest, comparable number; a factor rate is not. Always convert a factor rate to an effective APR before you sign, because a 1.40 factor can equal roughly 95% APR — several times higher than most loans. If a lender only quotes a factor rate and refuses an APR, treat that as a warning sign.",
    sections: [
      {
        heading: "A factor rate is a fixed multiplier that never shrinks",
        content:
          "A factor rate is a flat multiplier applied once, at signing. A 1.40 factor on $100,000 means you owe $140,000 — a $40,000 fee that does not change no matter how you repay. The Federal Reserve notes that merchant cash advance providers typically charge a factor rate and often do not express the cost as an APR at all. That makes the price look small when it is not. Convert it with our [factor rate calculator](/merchant-cash-advance/factor-rate-calculator/).",
      },
      {
        heading: "An interest rate accrues on your balance and falls as you repay",
        content:
          "An interest rate charges you only on the money you still owe. As you pay down the balance, the interest you owe each period drops. That is why a 10% APR loan really costs about 10% a year — the number is standardized and comparable. A factor rate ignores this entirely, charging the full fee up front regardless of your payment speed. See how balances shrink on a [business line of credit](/business-line-of-credit/).",
      },
      {
        heading: "The same money can cost wildly different amounts",
        content:
          "A factor rate and an interest rate can describe the same dollars at very different true prices. A 1.40 factor on $100,000 repaid over about 9 months is a fixed $40,000 fee — roughly a 95% effective APR. A bank loan for the same amount might charge 10% APR and cost a few thousand dollars over a year. The factor rate's flat fee, collected through fast daily holdbacks, is what pushes the effective APR so high. Model an advance with our [merchant cash advance calculator](/merchant-cash-advance/).",
      },
      {
        heading: "Non-obvious insight: a shorter term makes a factor rate worse",
        content:
          "With a factor rate, paying faster raises your effective APR — the opposite of a loan. Because the $40,000 fee is fixed, repaying it in 6 months instead of 9 crams the same cost into less time, so the annualized rate climbs. With an interest rate, a shorter term means less total interest. This is the trap in factor-rate pricing: the 'good' behavior of paying early costs you nothing back and can make the deal look even pricier when annualized.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between a factor rate vs interest rate?",
        answer:
          "A factor rate is a fixed multiplier set at signing that never changes, while an interest rate accrues on your balance and falls as you repay. A 1.40 factor on $100,000 is a flat $40,000 fee — about 95% effective APR over ~9 months.",
      },
      {
        question: "How do I convert a factor rate to an APR?",
        answer:
          "Multiply the advance by the factor rate to get total repayment, subtract the advance to find the fee, then annualize that fee over the real repayment term. A 1.40 factor over about 9 months is roughly 95% APR. Our factor rate calculator does the math for you.",
      },
      {
        question: "Why do lenders quote a factor rate instead of an APR?",
        answer:
          "A factor rate makes the cost look small. A 1.40 factor reads as a modest number, but it can equal roughly 95% APR. The Federal Reserve notes MCA providers often skip the APR entirely, which makes comparison shopping harder.",
      },
      {
        question: "Does paying off a factor-rate advance early save money?",
        answer:
          "No. The fee set by the factor rate is fixed, so paying early saves nothing and actually raises your effective APR. With an interest rate, paying early cuts total interest because it accrues on the remaining balance.",
      },
    ],
    sources: [
      { label: "Federal Reserve — 2025 Small Business Credit Survey (Report on Employer Firms)", url: "https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms" },
      { label: "CFPB — Small business lending under ECOA (Regulation B)", url: "https://www.consumerfinance.gov/rules-policy/final-rules/small-business-lending-under-the-equal-credit-opportunity-act-regulation-b/" },
      { label: "U.S. SBA — 7(a) loan terms, conditions, and eligibility", url: "https://www.sba.gov/partners/lenders/7a-loan-program/terms-conditions-eligibility" },
      { label: "FTC — Court enters $20.3M judgment against MCA operator for deceiving small businesses", url: "https://www.ftc.gov/news-events/news/press-releases/2024/02/court-enters-203-million-judgment-ftc-case-against-merchant-cash-advance-operator-jonathan-braun" },
    ],
    relatedComparisons: ["merchant-cash-advance-vs-loan", "invoice-factoring-vs-merchant-cash-advance"],
    calculatorLinks: [
      { label: "Factor rate calculator", href: "/merchant-cash-advance/factor-rate-calculator/" },
      { label: "Merchant cash advance calculator", href: "/merchant-cash-advance/" },
      { label: "Business line of credit calculator", href: "/business-line-of-credit/" },
    ],
  },

  // ─── 3. Invoice Factoring vs Merchant Cash Advance ───────────────────────
  {
    slug: "invoice-factoring-vs-merchant-cash-advance",
    title: "Invoice Factoring vs Merchant Cash Advance",
    metaDescription:
      "Invoice factoring vs merchant cash advance: factoring a $100,000 invoice can run ~28.63% APR versus 50-150% for an MCA. See which is cheaper.",
    targetKeyword: "invoice factoring vs merchant cash advance",
    optionA: "Invoice Factoring",
    optionB: "Merchant Cash Advance",
    segment: "Business Financing",
    h1: "Invoice Factoring vs Merchant Cash Advance: Which Is Cheaper?",
    introText:
      "Invoice factoring vs merchant cash advance usually favors factoring on cost, because it is tied to real, unpaid invoices rather than a bet on future sales. Factoring a $100,000 invoice at an 85% advance and a 1.5% fee per 30 days works out to about a 28.63% effective APR. A merchant cash advance for the same business often runs 50% to 150% APR. Both give fast cash, but factoring's link to actual receivables typically makes it the cheaper and lower-risk choice.",
    comparisonTable: {
      rows: [
        { dimension: "What backs it", a: "A real, unpaid invoice you already issued", b: "A bet on your future sales" },
        { dimension: "Cost measure", a: "Factoring fee (e.g. 1.5% per 30 days)", b: "Factor rate (e.g. 1.30-1.50)" },
        { dimension: "Illustrative effective APR", a: "~28.63% ($100,000 invoice, 85% advance)", b: "Often 50-150% APR" },
        { dimension: "How you get cash", a: "Advance on the invoice (e.g. 85% upfront)", b: "Lump-sum advance against future revenue" },
        { dimension: "Repayment source", a: "Your customer pays the invoice", b: "Daily / weekly holdback from your sales" },
        { dimension: "Best fit", a: "B2B firms with slow-paying customers", b: "Card-heavy retail with no invoices" },
        { dimension: "Risk profile", a: "Lower — tied to owed money", b: "Higher — cost is fixed regardless of sales" },
      ],
    },
    verdict:
      "If you invoice other businesses, invoice factoring is usually the cheaper, safer choice — its cost is tied to money customers already owe you. A merchant cash advance fits card-heavy businesses with no invoices, but expect a much higher effective APR. Price both as an APR first, and favor factoring whenever your revenue comes from unpaid B2B invoices.",
    sections: [
      {
        heading: "Invoice factoring is tied to money you are already owed",
        content:
          "Invoice factoring advances cash against invoices your customers have not yet paid. You sell a $100,000 invoice, receive about 85% ($85,000) upfront, and the factor collects the full amount from your customer. Because it is backed by a real receivable, the cost is lower. The CFPB notes that, unlike a merchant cash advance, factoring involves existing receivables at the time of the transaction. Model the payout with our [invoice factoring calculator](/invoice-factoring/).",
      },
      {
        heading: "A merchant cash advance is a bet on future sales",
        content:
          "A merchant cash advance sells a slice of your future revenue before you earn it. There is no invoice behind it — the provider advances a lump sum and collects a fixed amount through daily or weekly holdbacks. Because the repayment is uncertain, providers price in more risk, often landing at 50% to 150% APR. Convert an MCA's factor rate to an APR with our [factor rate calculator](/merchant-cash-advance/factor-rate-calculator/).",
      },
      {
        heading: "The cost gap is large and consistent",
        content:
          "Factoring is typically far cheaper than a merchant cash advance. Factoring a $100,000 invoice at 85% upfront and 1.5% per 30 days runs about a 28.63% effective APR. A comparable MCA often costs 50% to 150% APR. The gap comes from collateral: factoring is secured by an invoice a real customer owes, while an MCA rests on sales that may never arrive. See how an MCA prices out in our [merchant cash advance calculator](/merchant-cash-advance/).",
      },
      {
        heading: "Non-obvious insight: factoring shifts collection risk, an MCA keeps it on you",
        content:
          "The hidden difference is who chases the payment. In many factoring deals the factor collects directly from your customer, taking on the collection work and, in non-recourse deals, some default risk. An MCA leaves all the risk with you: if sales dip, the fixed fee still stands and daily holdbacks keep pulling from your account. The FTC has sued MCA operators who withdrew more than agreed, so the repayment mechanics matter as much as the headline rate. A [business line of credit](/business-line-of-credit/) can be a lower-risk alternative to both.",
      },
    ],
    faqs: [
      {
        question: "Is invoice factoring vs merchant cash advance cheaper?",
        answer:
          "Invoice factoring is usually cheaper. Factoring a $100,000 invoice at 85% upfront and 1.5% per 30 days runs about 28.63% effective APR, while a merchant cash advance often costs 50% to 150% APR. Factoring's link to a real invoice lowers the price.",
      },
      {
        question: "What is the main difference between factoring and an MCA?",
        answer:
          "Invoice factoring is backed by a real, unpaid invoice, while a merchant cash advance is an advance against uncertain future sales. The CFPB notes factoring involves existing receivables, whereas an MCA does not — which is why factoring usually costs less.",
      },
      {
        question: "Which should a B2B business choose?",
        answer:
          "A B2B business that invoices slow-paying customers should usually choose invoice factoring. It turns unpaid invoices into cash at a lower effective APR. An MCA fits card-heavy retail firms that do not issue invoices.",
      },
      {
        question: "Who collects the payment in each option?",
        answer:
          "In many factoring deals, the factor collects directly from your customer. With a merchant cash advance, the provider pulls a daily or weekly holdback from your own sales, so the repayment risk stays entirely with you.",
      },
    ],
    sources: [
      { label: "CFPB — Small business lending under ECOA (Regulation B)", url: "https://www.consumerfinance.gov/rules-policy/final-rules/small-business-lending-under-the-equal-credit-opportunity-act-regulation-b/" },
      { label: "Federal Reserve — 2025 Small Business Credit Survey (Report on Employer Firms)", url: "https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms" },
      { label: "FTC — Court enters $20.3M judgment against MCA operator for deceiving small businesses", url: "https://www.ftc.gov/news-events/news/press-releases/2024/02/court-enters-203-million-judgment-ftc-case-against-merchant-cash-advance-operator-jonathan-braun" },
      { label: "U.S. SBA — 7(a) loan terms, conditions, and eligibility", url: "https://www.sba.gov/partners/lenders/7a-loan-program/terms-conditions-eligibility" },
    ],
    relatedComparisons: ["merchant-cash-advance-vs-loan", "factor-rate-vs-interest-rate", "invoice-factoring-vs-business-line-of-credit"],
    calculatorLinks: [
      { label: "Invoice factoring calculator", href: "/invoice-factoring/" },
      { label: "Merchant cash advance calculator", href: "/merchant-cash-advance/" },
      { label: "Factor rate calculator", href: "/merchant-cash-advance/factor-rate-calculator/" },
    ],
  },

  // ─── 4. Invoice Factoring vs Business Line of Credit ─────────────────────
  {
    slug: "invoice-factoring-vs-business-line-of-credit",
    title: "Invoice Factoring vs Business Line of Credit",
    metaDescription:
      "Invoice factoring vs business line of credit: factoring a $100,000 invoice can run ~28.63% APR versus ~14.05% effective APR for a typical LOC draw.",
    targetKeyword: "invoice factoring vs business line of credit",
    optionA: "Invoice Factoring",
    optionB: "Business Line of Credit",
    segment: "Business Financing",
    h1: "Invoice Factoring vs Business Line of Credit: Which Is Cheaper?",
    introText:
      "Invoice factoring vs business line of credit usually comes down to whether you already have unpaid invoices or just need flexible access to cash. Factoring a $100,000 invoice at an 85% advance and a 1.5% fee per 30 days works out to about a 28.63% effective APR. A business line of credit drawing $50,000 at a 12% APR over 24 months with a 2% draw fee costs about 14.05% effective APR. A line of credit is usually cheaper, but it requires qualifying for approval upfront, while factoring approval leans on your customer's credit instead of yours.",
    comparisonTable: {
      rows: [
        { dimension: "What backs it", a: "A real, unpaid invoice you already issued", b: "Your business's own credit and revenue history" },
        { dimension: "Cost measure", a: "Factoring fee (e.g. 1.5% per 30 days)", b: "APR plus any draw or maintenance fees" },
        { dimension: "Illustrative effective APR", a: "~28.63% ($100,000 invoice, 85% advance)", b: "~14.05% ($50,000 draw, 12% APR, 2% draw fee)" },
        { dimension: "Approval basis", a: "Your customer's creditworthiness", b: "Your business's own credit and financials" },
        { dimension: "How you get cash", a: "Advance on a specific invoice (e.g. 85% upfront)", b: "Draw any amount up to your credit limit, revolving" },
        { dimension: "Repayment source", a: "Your customer pays the invoice", b: "You repay the draw over its term" },
        { dimension: "Best fit", a: "B2B firms with slow-paying customers and thin credit", b: "Established businesses that qualify and want flexible access" },
      ],
    },
    verdict:
      "A business line of credit is usually the cheaper option when your business can qualify for one — its effective APR typically undercuts factoring's fee-per-period structure. But factoring stays the better fit when your own credit or time in business would not clear a line's approval bar, since factoring is priced mainly on your customer's ability to pay, not yours. Run both figures as an effective APR before deciding.",
    sections: [
      {
        heading: "A line of credit is priced on your business, factoring is priced on your customer",
        content:
          "A business line of credit is approved and priced using your own business credit, revenue, and time in business. Invoice factoring instead leans on the creditworthiness of the customer who owes the invoice, which is why newer or lower-credit businesses can often qualify for factoring when they would not qualify for a line. Model your own draw cost with our [business line of credit calculator](/business-line-of-credit/).",
      },
      {
        heading: "The cost gap favors a line of credit when you can get one",
        content:
          "Drawing $50,000 on a line of credit at 12% APR over 24 months with a 2% draw fee costs about 14.05% effective APR. Factoring a comparable $100,000 invoice at an 85% advance and a 1.5% fee per 30 days runs closer to 28.63% effective APR. The gap exists because a line charges a standard interest rate, while factoring's fee accrues per 30-day period the invoice stays outstanding — the longer your customer takes to pay, the more factoring costs. See the fee build-up in our [invoice factoring calculator](/invoice-factoring/).",
      },
      {
        heading: "Revolving access vs. invoice-by-invoice cash",
        content:
          "A line of credit is revolving: draw what you need, repay it, and draw again up to your limit, without tying each draw to a specific sale. Factoring instead converts one invoice at a time into cash, so your available funding rises and falls with how much you have billed and not yet collected. A business with steady, predictable expenses often prefers a line's flexibility; a business whose cash is mostly tied up in slow-paying invoices often leans on factoring instead.",
      },
      {
        heading: "Non-obvious insight: the two are not mutually exclusive",
        content:
          "Many small businesses use a line of credit for day-to-day flexibility and turn to factoring only when a specific slow-paying invoice creates a cash crunch a line's limit cannot cover. Using both also avoids maxing out a single credit line, which can hurt future approval odds. Compare the effective APR each option quotes you, since draw fees and factoring fees both push the real cost above the headline rate.",
      },
    ],
    faqs: [
      {
        question: "Is invoice factoring or a business line of credit cheaper?",
        answer:
          "A business line of credit is usually cheaper when you qualify for one. Drawing $50,000 at 12% APR over 24 months with a 2% draw fee costs about 14.05% effective APR, versus roughly 28.63% for a comparable invoice factoring deal. The gap narrows or reverses if your customers pay very quickly, since factoring fees accrue per 30-day period.",
      },
      {
        question: "Which is easier to qualify for, factoring or a line of credit?",
        answer:
          "Invoice factoring is typically easier to qualify for because approval leans on your customer's creditworthiness, not yours. A business line of credit is underwritten against your own business credit, revenue, and time in business, which can shut out newer or lower-credit companies that factoring would still approve.",
      },
      {
        question: "Can I use both a line of credit and invoice factoring?",
        answer:
          "Yes. Many businesses keep a line of credit open for everyday flexibility and use invoice factoring only when a specific slow-paying invoice needs to be turned into cash faster than the line's limit allows. Using both can also help avoid maxing out a single credit source.",
      },
      {
        question: "Does a business line of credit add debt like a loan?",
        answer:
          "Yes. A business line of credit is a form of borrowing, so a draw adds debt to your balance sheet and accrues interest until repaid. Invoice factoring is a sale of your receivables, not a loan, so it does not add debt the same way — though it does reduce the cash you eventually collect from the sold invoice.",
      },
      {
        question: "Is invoice factoring worth it?",
        answer:
          "Invoice factoring is worth it if slow-paying customers, not weak margins, are your cash-flow problem — you convert an invoice you'd otherwise wait 30-90 days to collect into cash within a day or two, and approval leans on your customer's credit rather than yours. It's usually not worth it if you'd qualify for a cheaper line of credit or term loan instead, since factoring's per-30-day fee structure typically prices higher than a bank rate. Run both as an effective APR with the calculators above before deciding, and weigh recourse vs non-recourse terms, since a bad-debt buyback clause changes who eats an unpaid invoice.",
      },
    ],
    sources: [
      { label: "CFPB — Small business lending under ECOA (Regulation B)", url: "https://www.consumerfinance.gov/rules-policy/final-rules/small-business-lending-under-the-equal-credit-opportunity-act-regulation-b/" },
      { label: "U.S. SBA — Asset-Based Lending: Upside and Downside", url: "https://www.sba.gov/blog/asset-based-lending-what-upside-downside" },
      { label: "Federal Reserve — 2025 Small Business Credit Survey (Report on Employer Firms)", url: "https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms" },
    ],
    relatedComparisons: ["invoice-factoring-vs-merchant-cash-advance", "merchant-cash-advance-vs-loan", "invoice-factoring-vs-invoice-discounting"],
    calculatorLinks: [
      { label: "Invoice factoring calculator", href: "/invoice-factoring/" },
      { label: "Business line of credit calculator", href: "/business-line-of-credit/" },
    ],
  },

  // ─── Invoice Factoring vs Invoice Discounting (ga4-top-pages pass 2026-07-08) ──
  {
    slug: "invoice-factoring-vs-invoice-discounting",
    title: "Invoice Factoring vs Invoice Discounting: Key Difference",
    metaDescription:
      "Invoice factoring vs invoice discounting: factoring hands collections to the funder, while discounting stays confidential and you keep your own ledger.",
    targetKeyword: "invoice factoring vs invoice discounting",
    optionA: "Invoice Factoring",
    optionB: "Invoice Discounting",
    segment: "Business Financing",
    h1: "Invoice Factoring vs Invoice Discounting: What's the Real Difference?",
    introText:
      "Invoice factoring and invoice discounting both advance cash against unpaid invoices, but the difference is who collects the money and whether your customer finds out. With factoring, the factoring company takes over collections and your customer usually pays the factor directly, so the arrangement is visible. With invoice discounting, you keep collecting payments yourself under your own name, your customer is typically unaware a lender is involved, and you carry more of the credit-control responsibility in exchange for confidentiality.",
    comparisonTable: {
      rows: [
        { dimension: "Who collects the invoice", a: "The factoring company contacts and collects from your customer", b: "You continue collecting under your own business name" },
        { dimension: "Customer awareness", a: "Usually visible — your customer often pays the factor directly", b: "Usually confidential — your customer may never know" },
        { dimension: "Credit control", a: "Factor typically runs credit checks and manages collections", b: "You retain your own credit and collections process" },
        { dimension: "Typical business profile", a: "Smaller businesses or those wanting collections outsourced", b: "Larger, more established businesses with their own credit team" },
        { dimension: "Recourse options", a: "Available as recourse or non-recourse", b: "Almost always recourse — you keep the credit risk" },
        { dimension: "U.S. market availability", a: "Widely available from many providers", b: "Less common in the U.S.; more standard in the U.K. and Europe" },
      ],
    },
    verdict:
      "Choose invoice factoring if you want a funder to take collections off your plate, don't have your own credit department, or don't mind your customer knowing a factor is involved — it's the more widely available option for U.S. small businesses. Choose invoice discounting if you have an established credit and collections process, want your financing to stay confidential from customers, and can qualify with a lender that offers it (more common for larger, more established U.S. businesses and standard practice in the U.K.). Most small businesses in the U.S. end up with factoring simply because discounting is harder to find and typically requires a stronger financial profile to qualify.",
    sections: [
      {
        heading: "The core split: who owns collections",
        content:
          "Invoice factoring transfers the collections job to the funder. Once you sell an invoice, the factoring company contacts your customer, manages follow-up, and often collects payment directly into its own account. That's a real operational benefit if you don't have a credit department — the factor effectively becomes one for you, as described in our [invoice factoring calculator](/invoice-factoring/) guide.\n\nInvoice discounting flips that. You keep running your own accounts-receivable process, invoicing and following up exactly as you always have. The lender advances cash against the invoice but stays in the background; you're still the one calling a late-paying customer.",
      },
      {
        heading: "Why confidentiality is the whole point of discounting",
        content:
          "The defining feature of invoice discounting is that it can be arranged confidentially — your customer typically has no idea a lender has advanced you money against their invoice. For businesses that worry a visible factoring arrangement could signal cash-flow stress to customers or competitors, that discretion is the main draw.\n\nFactoring is usually the opposite: many factoring agreements require notifying the customer, and payment is often redirected to the factor's lockbox or account. Some non-notification factoring products exist, but they're the exception, not the rule, and typically cost more.",
      },
      {
        heading: "Why discounting is harder to get than factoring in the U.S.",
        content:
          "Invoice discounting is far more standard in the U.K. and Europe than in the United States, where invoice factoring dominates the small-business alternative-financing market. Discounting lenders generally want to see a mature, disciplined credit and collections function already in place, because you — not the lender — are still responsible for chasing payment. That makes it a better fit for larger, more established businesses than for a newer company still building its receivables process.\n\nFactoring's lower bar is a direct result of the funder taking on collections itself: because the factor controls the process (and often prices in non-recourse credit protection), it can extend financing to newer or thinner-credit businesses that a discounting arrangement would turn away. See how factoring stacks up against other options in [invoice factoring vs business line of credit](/compare/invoice-factoring-vs-business-line-of-credit/).",
      },
      {
        heading: "Which should you choose?",
        content:
          "Pick invoice factoring if you want collections handled for you, are a newer or smaller business, or can't easily qualify for a confidential facility. Pick invoice discounting only if you already run a solid in-house credit and collections process, want the arrangement kept confidential from customers, and can find a lender that offers it for a business your size.\n\nBoth options convert unpaid invoices into cash faster than waiting for net-30 or net-60 terms to run their course. Model the true cost of either against your invoice terms with our [factoring fee calculator](/invoice-factoring/factoring-fee-calculator/) before signing.",
      },
    ],
    faqs: [
      {
        question: "What is the main difference between invoice factoring and invoice discounting?",
        answer:
          "The main difference is who collects the invoice and whether your customer knows. With invoice factoring, the factoring company takes over collections and the arrangement is usually visible to your customer. With invoice discounting, you keep collecting payments yourself, and the financing typically stays confidential from your customer.",
      },
      {
        question: "Is invoice discounting cheaper than invoice factoring?",
        answer:
          "Not necessarily — pricing depends more on your business's credit profile and the specific lender than on which product you choose. Discounting can look cheaper on paper because the lender isn't running your collections, but it's also harder to qualify for, and you still carry the collections workload and most of the credit risk yourself.",
      },
      {
        question: "Can a small business get invoice discounting in the U.S.?",
        answer:
          "It's possible but less common than invoice factoring in the U.S. market. Invoice discounting is far more standard in the U.K. and Europe. In the U.S., most lenders offering discounting want to see an established credit and collections process already in place, which favors larger, more mature businesses over newer or smaller ones.",
      },
      {
        question: "Will my customer know if I use invoice factoring or invoice discounting?",
        answer:
          "With invoice factoring, your customer usually finds out, since the factor often collects payment directly and may contact your customer about the invoice. With invoice discounting, your customer typically never knows, since you continue collecting under your own name while the lender stays in the background.",
      },
    ],
    sources: [
      { label: "U.S. Small Business Administration — Asset-Based Lending: Upside and Downside", url: "https://www.sba.gov/blog/asset-based-lending-what-upside-downside" },
      { label: "CFPB — Small business lending under ECOA (Regulation B)", url: "https://www.consumerfinance.gov/rules-policy/final-rules/small-business-lending-under-the-equal-credit-opportunity-act-regulation-b/" },
    ],
    relatedComparisons: ["invoice-factoring-vs-business-line-of-credit", "invoice-factoring-vs-merchant-cash-advance"],
    calculatorLinks: [
      { label: "Invoice factoring calculator", href: "/invoice-factoring/" },
      { label: "Factoring fee calculator", href: "/invoice-factoring/factoring-fee-calculator/" },
    ],
  },

  // ─── Business Line of Credit vs SBA Loan ──────────────────────────────
  {
    slug: "business-line-of-credit-vs-sba-loan",
    title: "Business Line of Credit vs SBA Loan: Which Fits?",
    metaDescription:
      "Business line of credit vs SBA loan: revolving credit funds in days at higher rates, while an SBA 7(a) loan is cheaper but takes 30-90 days to close.",
    targetKeyword: "business line of credit vs sba loan",
    optionA: "Business Line of Credit",
    optionB: "SBA Loan",
    segment: "Business Financing",
    h1: "Business Line of Credit vs SBA Loan: Which Should You Choose?",
    introText:
      "A business line of credit vs SBA loan comparison comes down to speed versus cost: a line of credit is revolving and can fund in days, while an SBA 7(a) loan is a lump-sum term loan capped by government rate rules that often makes it the cheaper long-term option. Drawing $50,000 on a line of credit at a 12% APR with a 2% draw fee costs about 14.05% effective APR. An SBA 7(a) loan's rate is capped by the U.S. [Small Business Administration](https://www.sba.gov/partners/lenders/7a-loan-program/terms-conditions-eligibility) at the base rate plus roughly 3.0% to 6.5%, but approval commonly takes 30 to 90 days versus days to about two weeks for a line of credit. Which wins depends on how fast you need the money and how much collateral and paperwork you can supply.",
    comparisonTable: {
      rows: [
        { dimension: "Structure", a: "Revolving credit line — draw, repay, draw again", b: "Lump-sum term loan, government-guaranteed" },
        { dimension: "Cost measure", a: "APR plus any draw or maintenance fees", b: "Rate capped by the SBA (base rate + 3.0%-6.5%) plus a guaranty fee" },
        { dimension: "Illustrative effective APR", a: "~14.05% ($50,000 draw, 12% APR, 2% draw fee)", b: "Capped by SBA formula; varies with loan size and lender" },
        { dimension: "Speed to fund", a: "Often days to about two weeks", b: "Typically 30-90 days" },
        { dimension: "Repayment", a: "Interest only on the amount drawn, revolving", b: "Fixed monthly principal and interest on the full amount" },
        { dimension: "Collateral / guarantee", a: "Often unsecured for smaller lines; larger lines may need a lien", b: "Personal guarantee required from 20%+ owners; collateral required when available" },
        { dimension: "Typical loan size", a: "Commonly up to a few hundred thousand dollars", b: "Up to $5 million maximum loan amount" },
        { dimension: "Term", a: "Open-ended draw period, renewable", b: "Up to 10 years for working capital/equipment; up to 25 years for real estate" },
        { dimension: "Best fit", a: "Ongoing or seasonal cash-flow gaps", b: "Large, one-time capital needs like expansion, equipment, or real estate" },
      ],
    },
    verdict:
      "Choose a business line of credit when you need fast, flexible access to cash for recurring or seasonal gaps and can accept a higher rate for that speed. Choose an SBA loan when you have a large, one-time capital need — expansion, equipment, real estate, or an acquisition — and can wait 30 to 90 days for a lower, government-capped rate. If you want SBA-backed money in a revolving format, ask a lender about SBA CAPLines, which combine both structures.",
    sections: [
      {
        heading: "A business line of credit is fast, revolving access to cash",
        content:
          "A business line of credit lets you draw funds as needed, up to a set limit, and pay interest only on what you actually draw. Drawing $50,000 at a 12% APR over 24 months with a 2% draw fee comes to a $2,353.67 monthly payment and about $7,488.17 in total cost — an effective APR of 14.05% once the draw fee is counted.\n\nMost lenders can approve and fund a line of credit within days to about two weeks, especially online lenders, though bank lines can take longer. Smaller lines are often unsecured; larger lines may require a blanket lien on business assets. See the [business line of credit calculator](/business-line-of-credit/) to model your own draw cost.",
      },
      {
        heading: "An SBA loan is a government-guaranteed term loan with capped rates",
        content:
          "An SBA 7(a) loan is a term loan made by a bank or approved lender, with a portion guaranteed by the U.S. Small Business Administration — typically 85% of loans up to $150,000 and 75% of larger loans, up to a $5 million maximum loan amount. That guarantee is why an SBA loan usually costs less than other financing: the SBA caps the interest rate lenders can charge at the base rate plus roughly 3.0% to 6.5%, depending on loan size and maturity.\n\nTerms run up to 10 years for working capital or equipment and up to 25 years for real estate. The trade-off for that lower rate is time and paperwork: approval commonly takes 30 to 90 days, and the SBA requires a personal guarantee from anyone who owns 20% or more of the business, plus collateral when it is available.",
      },
      {
        heading: "Speed and qualification are the real trade-off",
        content:
          "Speed favors the line of credit; cost usually favors the SBA loan. A line of credit can fund in days because approval leans on a shorter application, your business's cash flow, and often a soft credit pull for smaller amounts.\n\nAn SBA loan requires a fuller underwriting file — tax returns, financial statements, a business plan for larger loans, and proof of collateral where available — which is why approval stretches to 30-90 days even though the SBA itself does not lend the money directly. If your business cannot wait that long, the line of credit's speed can outweigh its higher rate.",
      },
      {
        heading: "Non-obvious insight: the SBA also offers its own revolving line of credit",
        content:
          "Not every SBA product is a lump-sum term loan. The SBA's CAPLines program, a type of 7(a) loan, provides revolving lines of credit for seasonal, contract, builder, and general working-capital needs, with terms up to 10 years. That means the real-world choice is not always \"line of credit vs. SBA loan\" — a business can sometimes get an SBA-guaranteed revolving line instead of either a conventional line of credit or a standard SBA term loan.\n\nCAPLines still carries SBA underwriting requirements and timelines, so it will not match a fintech line's days-to-fund speed, but it can beat a conventional line's rate. Ask your lender whether a CAPLine fits before assuming your only options are a standard business line of credit or a term-loan SBA 7(a).",
      },
    ],
    faqs: [
      {
        question: "Is a business line of credit or an SBA loan cheaper?",
        answer:
          "An SBA loan is usually cheaper because the SBA caps the interest rate a lender can charge at the base rate plus roughly 3.0% to 6.5%. A line of credit trades that lower rate for speed — drawing $50,000 at 12% APR with a 2% draw fee runs about 14.05% effective APR, which can still beat other fast-cash options like a merchant cash advance.",
      },
      {
        question: "How fast can I get a business line of credit vs an SBA loan?",
        answer:
          "A business line of credit can often fund in days to about two weeks, especially through an online lender. An SBA loan typically takes 30 to 90 days to close because of its fuller underwriting file and government guarantee process.",
      },
      {
        question: "Do I need collateral or a personal guarantee for either option?",
        answer:
          "An SBA loan requires a personal guarantee from anyone who owns 20% or more of the business, and lenders must take available collateral, though the SBA will not decline a loan solely for lacking it. A business line of credit is often unsecured for smaller limits, but larger lines may require a lien on business assets.",
      },
      {
        question: "Can I get an SBA-backed line of credit instead of a term loan?",
        answer:
          "Yes. The SBA's CAPLines program is a type of 7(a) loan that provides a revolving line of credit for seasonal, contract, builder, or general working-capital needs, with terms up to 10 years. It carries SBA underwriting timelines, so it funds slower than a conventional line of credit but can cost less.",
      },
      {
        question: "Which is easier to qualify for?",
        answer:
          "A business line of credit is generally easier to qualify for, especially from online lenders that weigh revenue and cash flow over a full credit package. An SBA loan requires stronger documentation — tax returns, financial statements, and often collateral — which can shut out newer or thinly capitalized businesses.",
      },
      {
        question: "Can I use a business line of credit and an SBA loan together?",
        answer:
          "Yes. Many businesses use an SBA loan to fund a large, one-time need like equipment or real estate, then keep a separate business line of credit open for day-to-day cash-flow gaps. Using both spreads financing across the option best suited to each need instead of forcing one product to do both jobs.",
      },
    ],
    sources: [
      { label: "U.S. SBA — 7(a) loan terms, conditions, and eligibility", url: "https://www.sba.gov/partners/lenders/7a-loan-program/terms-conditions-eligibility" },
      { label: "U.S. Small Business Administration — Types of 7(a) loans (CAPLines revolving lines of credit)", url: "https://www.sba.gov/partners/lenders/7a-loan-program/types-7a-loans" },
      { label: "Consumer Financial Protection Bureau — What to look for when shopping for a line of credit", url: "https://www.consumerfinance.gov/ask-cfpb/what-should-i-look-for-when-shopping-for-a-personal-line-of-credit-en-905/" },
      { label: "Federal Reserve — 2025 Small Business Credit Survey (Report on Employer Firms)", url: "https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms" },
    ],
    relatedComparisons: ["invoice-factoring-vs-business-line-of-credit", "merchant-cash-advance-vs-loan"],
    calculatorLinks: [
      { label: "Business line of credit calculator", href: "/business-line-of-credit/" },
    ],
  },

  // ─── Merchant Cash Advance vs Revenue-Based Financing (ga4-top-pages pass 2026-07-16) ──
  {
    slug: "merchant-cash-advance-vs-revenue-based-financing",
    title: "Merchant Cash Advance vs Revenue-Based Financing",
    metaDescription:
      "Merchant cash advance vs revenue-based financing: MCA sells receivables at a factor rate; RBF repays a % of revenue to a cap. Compare structure and cost.",
    targetKeyword: "merchant cash advance vs revenue based financing",
    optionA: "Merchant Cash Advance",
    optionB: "Revenue-Based Financing",
    segment: "Business Financing",
    h1: "Merchant Cash Advance vs Revenue-Based Financing: What's the Difference?",
    introText:
      "Merchant cash advance vs revenue-based financing comes down to how the repayment actually moves: an MCA sells a slice of your future receivables for a fixed daily or weekly debit set at signing, while revenue-based financing (RBF) is a financing agreement repaid as a percentage of your actual monthly revenue until a pre-agreed repayment cap is reached. Both structures set a fixed total cost upfront instead of charging a standard interest rate, but they are not the same product. An MCA is priced with a factor rate and leans on card and bank-deposit history; RBF is priced with a repayment-cap multiple and often leans on recurring revenue metrics like monthly recurring revenue (MRR), which is why it shows up more often at SaaS, subscription, and ecommerce companies than at card-heavy retail shops.",
    comparisonTable: {
      rows: [
        { dimension: "Legal structure", a: "Sale of future receivables (not a loan in most states)", b: "Typically a loan or financing agreement; some providers structure it as a revenue-share purchase" },
        { dimension: "Cost measure", a: "Factor rate (fixed multiplier, e.g. 1.30) — not an APR", b: "Repayment cap — a fixed multiple of the amount funded (commonly cited around 1.3x-3x)" },
        { dimension: "Repayment structure", a: "Fixed daily or weekly holdback amount set at signing", b: "Recalculated monthly as a set percentage of that month's actual revenue" },
        { dimension: "Cost transparency", a: "Factor rate hides the effective APR; some states now require APR-style disclosure", b: "Repayment cap is stated upfront, but it still is not a standardized APR" },
        { dimension: "Typical qualifying business", a: "Card-heavy retail, restaurants, and service businesses with daily sales volume", b: "Recurring-revenue businesses — SaaS, subscription, and ecommerce brands with predictable monthly revenue" },
        { dimension: "Speed of funding", a: "Often 1-3 business days", b: "Roughly 1-4 weeks for underwriting at most providers; some ecommerce-focused lenders review in about 24 hours" },
        { dimension: "Collateral / personal guarantee", a: "Often required on larger advances, plus a UCC lien on business assets", b: "Commonly none — many RBF providers advertise no personal guarantee and no equity dilution" },
      ],
    },
    verdict:
      "Choose a merchant cash advance when you run a card-swipe business — retail, restaurant, or service — that needs cash in a day or two and can absorb a fixed daily debit regardless of how sales move that week. Choose revenue-based financing when your revenue is recurring and trackable, such as SaaS or subscription billing, and you would rather have a payment that shrinks in a slow month and grows in a strong one, in exchange for a slower underwriting process. Both cap your total cost upfront, so ask any provider — MCA or RBF — for the exact repayment cap or factor rate before you sign, since the headline pitch rarely tells you the real number.",
    sections: [
      {
        heading: "A merchant cash advance is a receivables sale with a fixed daily debit",
        content:
          "A merchant cash advance is legally a purchase of your future sales, not a loan, and its repayment amount is fixed at signing rather than tied precisely to how revenue moves that month. A 1.30 factor rate on a $50,000 advance means you owe $65,000 total — a $15,000 fee that does not shrink no matter how fast you repay. That $65,000 is then split into a daily or weekly holdback, often several hundred dollars a day, debited automatically from your card batches or bank account. The [Federal Reserve's Small Business Credit Survey](https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms) describes MCAs as a nonbank product usually under $100,000, repaid as a percentage of sales rather than in a single fixed dollar figure — but in practice, most providers set that percentage into a fixed daily amount at signing, and it does not automatically renegotiate down the moment a slow week hits. Model your own payback with the [merchant cash advance calculator](/merchant-cash-advance/).",
      },
      {
        heading: "Revenue-based financing repays as a moving percentage of revenue, up to a cap",
        content:
          "Revenue-based financing repays through a fixed percentage of your actual monthly revenue, recalculated each period, until you hit a pre-agreed repayment cap. [Clearco](https://www.clear.co/), an RBF provider focused on ecommerce brands, describes the typical structure as a pre-agreed repayment cap without interest, commonly ranging from about 1.3x to 3x the original amount funded — the total cost is bounded, but unlike an MCA's flat daily debit, the actual monthly payment moves with revenue. [Lighter Capital](https://www.lightercapital.com/), an RBF lender focused on technology and SaaS companies, underwrites primarily against recurring revenue — it typically looks for around $200,000 in annual recurring revenue or $15,000 in monthly recurring revenue from a diversified customer base, rather than card-swipe or bank-deposit history. Most RBF providers also advertise no personal guarantee and no equity dilution, since the financing is not a claim on ownership.",
      },
      {
        heading: "Where the two structures genuinely diverge",
        content:
          "The core divide is what the repayment amount is actually pegged to. An MCA's daily or weekly debit is set once, at signing, and generally stays fixed even as your sales fluctuate day to day. RBF's monthly payment is explicitly recalculated against that month's real revenue, so it is designed to shrink in a slow month and grow in a strong one. Underwriting diverges the same way: MCA providers look at card and bank-deposit history, which is why they can approve businesses with weak credit or a short operating history, while RBF providers look at recurring-revenue metrics like MRR or ARR, which is why the product fits subscription and ecommerce businesses better than a corner restaurant with no predictable monthly billing.",
      },
      {
        heading: "Non-obvious insight: a bad month hits an MCA harder than it hits RBF",
        content:
          "A revenue dip exposes the real structural gap between these two products. Because an MCA's daily holdback is usually fixed in dollar terms at signing, a slow week does not automatically lower what gets debited from your account that week, which is exactly the kind of mismatch the FTC has pursued MCA operators over when withdrawals outpaced what a business could actually afford. RBF's monthly percentage, by contrast, is recalculated against real revenue each period, so a weak month produces a smaller payment by design, not by negotiation. That flexibility is also why RBF's total repayment cap sits alongside a longer, slower underwriting process — providers want more certainty about your recurring revenue before they agree to let the payment move with it.",
      },
    ],
    faqs: [
      {
        question: "Is a merchant cash advance the same as revenue-based financing?",
        answer:
          "No. A merchant cash advance is a sale of future receivables repaid through a fixed daily or weekly debit set at signing, while revenue-based financing is typically a loan or financing agreement repaid as a percentage of actual monthly revenue up to a repayment cap. They both avoid a standard interest rate, but the repayment mechanics and underwriting are structurally different.",
      },
      {
        question: "Is a merchant cash advance or revenue-based financing cheaper?",
        answer:
          "It depends on the deal, not the category. MCA factor rates commonly run around 1.10 to 1.50, while RBF repayment caps are often cited around 1.3x to 3x the amount funded — the ranges overlap. Ask any provider for the exact factor rate or repayment cap and convert it to an effective cost before comparing, since neither product quotes a standard APR upfront.",
      },
      {
        question: "Does revenue-based financing require good personal credit?",
        answer:
          "Usually not as the primary factor. Most RBF providers underwrite against your recurring revenue — metrics like monthly recurring revenue or annual recurring revenue — rather than a personal credit score, and many advertise no personal guarantee. A merchant cash advance instead leans on your card and bank-deposit history, and can still require a personal guarantee on larger advances.",
      },
      {
        question: "Can an ecommerce or SaaS business get a merchant cash advance instead of RBF?",
        answer:
          "Technically yes, but the underwriting fit is usually worse. MCA providers evaluate card-swipe or bank-deposit volume, which does not map cleanly onto subscription billing or ecommerce revenue that arrives through platforms like Shopify or Stripe. Revenue-based financing providers are built to underwrite exactly that kind of recurring or platform-based revenue, which is typically the better structural fit.",
      },
      {
        question: "Is revenue-based financing a loan?",
        answer:
          "Usually, yes — most revenue-based financing is structured as a loan or debt-like financing agreement, though the exact legal treatment varies by provider and state, and some structure it as a revenue-share purchase instead. Either way, RBF is generally not structured as a sale of receivables the way a merchant cash advance is, which is the key legal difference between the two products.",
      },
    ],
    sources: [
      { label: "Federal Reserve — 2025 Small Business Credit Survey (Report on Employer Firms)", url: "https://www.fedsmallbusiness.org/reports/survey/2025/2025-report-on-employer-firms" },
      { label: "CFPB — Small business lending under ECOA (Regulation B)", url: "https://www.consumerfinance.gov/rules-policy/final-rules/small-business-lending-under-the-equal-credit-opportunity-act-regulation-b/" },
      { label: "FTC — Court enters $20.3M judgment against MCA operator for deceiving small businesses", url: "https://www.ftc.gov/news-events/news/press-releases/2024/02/court-enters-203-million-judgment-ftc-case-against-merchant-cash-advance-operator-jonathan-braun" },
      { label: "Clearco — What Is Revenue-Based Funding and Why Founders Are Choosing Flexible Models", url: "https://www.clear.co/blog/what-is-revenue-based-funding-for-founders" },
      { label: "Lighter Capital — Startup Financing: How Revenue-Based Financing Works", url: "https://www.lightercapital.com/how-it-works" },
    ],
    relatedComparisons: ["merchant-cash-advance-vs-loan", "invoice-factoring-vs-merchant-cash-advance", "factor-rate-vs-interest-rate"],
    calculatorLinks: [
      { label: "Merchant cash advance calculator", href: "/merchant-cash-advance/" },
      { label: "Factor rate calculator", href: "/merchant-cash-advance/factor-rate-calculator/" },
    ],
  },
];
