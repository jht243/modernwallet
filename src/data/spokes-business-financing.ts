import type { SpokeEntry } from "./types";

export const BUSINESS_FINANCING_SPOKES: SpokeEntry[] = [
  {
    calculator: "merchant-cash-advance",
    slug: "factor-rate-calculator",
    title: "Factor Rate Calculator: See Your True MCA Cost",
    metaDescription:
      "Use our factor rate calculator to turn a merchant cash advance factor rate into real dollars and an effective APR. Free, instant, and easy to read.",
    targetKeyword: "factor rate calculator",
    estimatedVolume: 20,
    estimatedKD: 0,
    h1: "Factor Rate Calculator",
    introText:
      "This factor rate calculator turns a merchant cash advance factor rate into the real dollars you repay and the effective APR behind it.\nA factor rate is a decimal, like 1.4, that you multiply by your advance to get total payback. It is not an interest rate, so it hides the true yearly cost. Enter your advance amount, factor rate, and term below to see what the deal actually costs.\n\nThis tool sits under our [merchant cash advance hub](/merchant-cash-advance/). To compare the same offer against a bank loan, also try our [merchant cash advance payoff calculator](/merchant-cash-advance/merchant-cash-advance-payoff-calculator/).",
    howItWorks:
      "A factor rate calculator multiplies your advance by the factor rate to find total payback, then works backward to an effective APR.\nThe math is simple. Total payback equals advance times factor rate. Your cost is the payback minus the advance. To find the effective APR, the tool spreads that cost across your real payment schedule, since MCAs pull money daily or weekly. That schedule is why a small-looking factor rate becomes a very large APR.\n\nThe key lesson: a 1.4 factor rate is roughly a 95% APR. The factor rate is not interest. Two offers with the same factor rate can carry very different APRs if one has a shorter term, because you pay the same fee back faster. Always convert the factor rate to an APR before you sign.",
    commonMistakes: [
      "Treating a 1.4 factor rate like 40% interest. A 1.4 factor rate on a 9-month term is closer to a 95% effective APR.",
      "Ignoring the term length. A shorter term with the same factor rate means a higher APR, because you repay the fee faster.",
      "Forgetting daily or weekly payments drain cash flow long before the term technically ends.",
      "Comparing an MCA factor rate directly to a bank loan interest rate without converting both to APR first.",
      "Assuming the factor rate is negotiable after signing. It is fixed, so shop and compare before you commit.",
    ],
    workedExample:
      "Say you take a $100,000 advance at a 1.4 factor rate over a 9-month term with daily payments. Total payback is $100,000 times 1.4, or $140,000. Your cost is $40,000. On a daily schedule that is about $740.74 per day, roughly $15,555.56 per month, across about 189 payments. Spread over the real payoff timeline, the effective APR lands near 95%. That is why a 1.4 factor rate should never be read as 40%.",
    faqs: [
      {
        question: "What does a factor rate calculator do?",
        answer:
          "A factor rate calculator converts a merchant cash advance factor rate into total payback dollars and an effective APR. You enter your advance, factor rate, and term, and it shows the real cost so you can compare offers fairly.",
      },
      {
        question: "Is a factor rate the same as an interest rate?",
        answer:
          "No. A factor rate is a flat multiplier, not an interest rate. A 1.4 factor rate on a $100,000 advance means you repay $140,000 total, no matter how fast you pay. On a 9-month term that works out to about a 95% effective APR.",
      },
      {
        question: "How do I convert a factor rate to an APR?",
        answer:
          "Multiply the advance by the factor rate to get payback, subtract the advance to find the cost, then spread that cost across your real daily or weekly payment schedule. Our calculator does this for you. A 1.4 factor rate over 9 months is roughly a 95% APR.",
      },
      {
        question: "Why is the APR so much higher than the factor rate?",
        answer:
          "Because you repay the full fee quickly. A factor rate charges the same dollar cost whether the term is 6 months or 12. Squeezing that cost into a short term through daily payments pushes the effective APR far above what the factor rate suggests.",
      },
      {
        question: "Does the factor rate change if I pay early?",
        answer:
          "Usually no. With most merchant cash advances you owe the full factor rate times advance no matter when you pay. Ask your provider directly whether the contract offers a prepayment discount before you plan to pay early.",
      },
      {
        question: "Does an MCA have an interest rate?",
        answer:
          "No. A merchant cash advance does not carry an interest rate in the traditional sense. It is priced as a factor rate applied once to the whole advance, not a rate that accrues over time. You can still convert that factor rate into an effective APR to compare it against a loan, which is exactly what this calculator does. On our $100,000 example, a 1.4 factor rate over a 9-month term converts to roughly a 95% effective APR once the payback is spread across daily payments.",
      },
    ],
    sources: [
      {
        label: "CFPB — Truth in Lending (Regulation Z), 12 CFR Part 1026",
        url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/",
      },
      {
        label: "U.S. Small Business Administration — Asset-Based Lending: Upside and Downside",
        url: "https://www.sba.gov/blog/asset-based-lending-what-upside-downside",
      },
    ],
    toolHeading: "Factor Rate Calculator",
    toolSubheading: "Convert an MCA factor rate into total payback and a real effective APR.",
    preset: {
      advanceAmount: 100000,
      factorRate: 1.4,
      termMonths: 9,
      paymentFrequency: "daily",
    },
    relatedSlugs: ["merchant-cash-advance-payoff-calculator"],
  },
  {
    calculator: "merchant-cash-advance",
    slug: "merchant-cash-advance-payoff-calculator",
    title: "Merchant Cash Advance Payoff Calculator",
    metaDescription:
      "A merchant cash advance payoff calculator that shows your total balance, daily payments, and whether paying an MCA off early actually saves you money.",
    targetKeyword: "merchant cash advance payoff",
    estimatedVolume: 70,
    estimatedKD: 20,
    h1: "Merchant Cash Advance Payoff Calculator",
    introText:
      "This merchant cash advance payoff calculator shows your total payoff amount, your daily payment, and whether paying early saves you anything.\nA merchant cash advance payoff is set by the factor rate, not by remaining interest, so the math works differently from a normal loan. Enter your advance, factor rate, and term below to see the full balance you owe and how fast the daily payments pull it down.\n\nThis tool lives under our [merchant cash advance hub](/merchant-cash-advance/). To convert a raw factor rate into an APR, use our [factor rate calculator](/merchant-cash-advance/factor-rate-calculator/).",
    howItWorks:
      "A merchant cash advance payoff calculator multiplies your advance by the factor rate to fix the total balance, then divides it across daily payments.\nUnlike a bank loan, an MCA payoff is not reduced by unpaid interest. The total you owe is locked the moment you sign: advance times factor rate. The calculator takes that fixed number, subtracts what you have already paid, and shows the remaining balance plus the daily draw against your sales.\n\nHere is the non-obvious insight most owners miss: paying an MCA off early usually does not save money. You owe the full factor rate times advance regardless of timing, so early payoff just hands over the same fee sooner. The one exception is a contract with a prepayment discount. Those exist but are not standard, so ask your provider in writing before you assume early payoff helps.",
    commonMistakes: [
      "Assuming early payoff cuts the cost. In most MCA contracts you owe the full fixed payback no matter when you finish.",
      "Confusing the payoff balance with a loan principal. An MCA balance is advance times factor rate, not a shrinking principal plus interest.",
      "Not asking whether the contract has a prepayment discount. If it does not, paying early only speeds up the same total cost.",
      "Refinancing one MCA with another to 'save' money, which often stacks fees and deepens the hole.",
      "Overlooking how daily payments strain cash flow weeks before the balance is actually cleared.",
    ],
    workedExample:
      "Suppose you took a $40,000 advance at a 1.35 factor rate over an 8-month term with daily payments. Your fixed payback is $40,000 times 1.35, or $54,000, and your cost is $14,000. That is about $321.43 per day, roughly $6,750 per month, across about 168 payments, for an effective APR near 94.58%. If you paid the whole thing off in month three, you would still owe the full $54,000 unless your contract grants a prepayment discount. That is why early payoff rarely saves money here.",
    faqs: [
      {
        question: "Does paying off a merchant cash advance early save money?",
        answer:
          "Usually no. You owe the full factor rate times advance no matter when you pay, so early payoff hands over the same total sooner. The only exception is a contract with a written prepayment discount, which is not standard. Ask your provider directly.",
      },
      {
        question: "How is a merchant cash advance payoff amount calculated?",
        answer:
          "Your merchant cash advance payoff equals the advance multiplied by the factor rate. A $40,000 advance at a 1.35 factor rate means a fixed $54,000 payoff. Subtract what you have already paid to see your remaining balance.",
      },
      {
        question: "Why does my MCA balance not drop like a loan?",
        answer:
          "Because there is no interest to save. An MCA locks the total payback at signing as advance times factor rate. Payments chip at a fixed number, so the balance falls in a straight line, not on an amortization curve.",
      },
      {
        question: "What is a prepayment discount on an MCA?",
        answer:
          "A prepayment discount lowers your total payoff if you finish early. Most merchant cash advances do not include one, so you owe the full fee either way. Always confirm in writing whether your contract offers this before planning an early payoff.",
      },
      {
        question: "Should I take a second MCA to pay off the first?",
        answer:
          "Stacking a new MCA on an old one is risky. It usually adds a second full factor-rate fee on top of the first and tightens daily withdrawals. This deepens cash-flow strain rather than easing it, so treat refinancing with caution.",
      },
    ],
    sources: [
      {
        label: "CFPB — Truth in Lending (Regulation Z), 12 CFR Part 1026",
        url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/",
      },
      {
        label: "U.S. Small Business Administration — 3 Ways to Get Working Capital",
        url: "https://www.sba.gov/blog/3-ways-get-working-capital-your-business",
      },
    ],
    toolHeading: "Merchant Cash Advance Payoff Calculator",
    toolSubheading: "See your fixed payoff balance, daily payment, and whether early payoff helps.",
    preset: {
      advanceAmount: 40000,
      factorRate: 1.35,
      termMonths: 8,
      paymentFrequency: "daily",
    },
    relatedSlugs: ["factor-rate-calculator"],
  },
  {
    calculator: "invoice-factoring",
    slug: "accounts-receivable-financing",
    title: "Accounts Receivable Financing Calculator",
    metaDescription:
      "An accounts receivable financing calculator that shows your advance, reserve, factoring fee, rebate, net proceeds, and the real effective APR on an invoice.",
    targetKeyword: "accounts receivable financing",
    estimatedVolume: 2400,
    estimatedKD: 31,
    h1: "Accounts Receivable Financing Calculator",
    introText:
      "This accounts receivable financing calculator shows how much cash you get today, what you pay in fees, and the real effective APR on an invoice.\nAccounts receivable financing lets a business turn unpaid invoices into immediate cash by advancing most of the invoice value now. Enter your invoice amount, advance rate, factor fee, and expected days until payment below to see your advance, reserve, and net proceeds.\n\nThis tool sits under our [invoice factoring hub](/invoice-factoring/). To size the fee alone on a single invoice, use our [factoring fee calculator](/invoice-factoring/factoring-fee-calculator/). Once you've run the numbers, see our guide on [how to account for invoice factoring](/guides/how-to-account-for-invoice-factoring/) for the GAAP journal entries behind the advance, reserve, and rebate shown here.",
    howItWorks:
      "Accounts receivable financing advances a percentage of your invoice now, holds the rest in reserve, and charges a fee when your customer pays.\nThe calculator starts with the advance: invoice amount times the advance rate. The remaining slice becomes the reserve, held back until your customer settles the invoice. When payment lands, the financer keeps a factor fee and rebates the rest of the reserve to you. Net proceeds are your advance plus that rebate.\n\nThe non-obvious point is timing. Because the fee is charged over a short collection window, a fee that looks small as a percentage becomes a large annualized APR. A 2% fee on a 60-day invoice is not 2% a year. Spread across the real days-until-paid, that same fee works out to roughly a 30% effective APR, which is the number that matters for comparison.",
    commonMistakes: [
      "Reading the factor fee as an annual rate. A 2% fee over 60 days is closer to a 30% effective APR, not 2% a year.",
      "Forgetting the reserve. You do not get the full invoice up front; a portion is held until your customer pays.",
      "Ignoring how days-until-paid drives cost. Slow-paying customers stretch the fee window and can raise the effective APR.",
      "Confusing accounts receivable financing with factoring. In financing you often keep collections; in factoring the buyer collects.",
      "Overlooking whether the arrangement is recourse, meaning you may owe the money back if your customer never pays.",
    ],
    workedExample:
      "Take a $50,000 invoice with an 80% advance rate, a 2% factor fee, and 60 days until your customer pays. Your advance today is $40,000, and the reserve held back is $10,000. When the customer pays, the fee is $2,000, so your rebate is $8,000. Net proceeds come to $48,000 on the $50,000 invoice. Because the $2,000 fee is charged over just 60 days, the effective APR is about 30.42%, far above the 2% the fee first appears to be.",
    faqs: [
      {
        question: "What is accounts receivable financing?",
        answer:
          "Accounts receivable financing turns unpaid invoices into immediate cash. A financer advances most of an invoice's value now, holds a reserve, and charges a fee when your customer pays. On a $50,000 invoice at 80%, you receive $40,000 up front.",
      },
      {
        question: "How much cash do I actually receive?",
        answer:
          "You receive the advance now and the rebate later. On a $50,000 invoice at an 80% advance rate and a 2% fee, you get $40,000 today and an $8,000 rebate when the customer pays, for $48,000 in net proceeds after the $2,000 fee.",
      },
      {
        question: "What is the reserve in accounts receivable financing?",
        answer:
          "The reserve is the portion of your invoice held back until your customer pays. On a $50,000 invoice at an 80% advance, the reserve is $10,000. You get it back, minus the fee, once the invoice settles.",
      },
      {
        question: "How is the effective APR different from the factor fee?",
        answer:
          "The factor fee is a flat percentage; the effective APR annualizes it over the collection window. A 2% fee on a 60-day invoice is not 2% a year. Spread across 60 days it works out to about a 30.42% effective APR.",
      },
      {
        question: "Is accounts receivable financing the same as factoring?",
        answer:
          "They are close but not identical. With accounts receivable financing you typically keep control of collections. With factoring the buyer collects directly from your customer. Both advance cash against invoices and charge a fee tied to how long payment takes.",
      },
      {
        question: "Invoice factoring vs accounts receivable financing: which costs less?",
        answer:
          "Neither is inherently cheaper — both price the same way, an advance rate plus a fee tied to how long the invoice stays unpaid, so the cost difference on any given invoice usually comes down to the specific advance rate and fee your provider offers, not which structure you chose. The real difference is control and disclosure: factoring sells the invoice outright and the factor collects directly from your customer, who typically finds out; accounts receivable financing is usually structured as a loan secured by the receivable, so you keep collecting and your customer often never knows the invoice was financed. Most arrangements of both types are recourse, meaning you owe the money back if your customer never pays — confirm that term specifically before signing either one.",
      },
    ],
    sources: [
      {
        label: "U.S. Small Business Administration — 3 Ways to Get Working Capital",
        url: "https://www.sba.gov/blog/3-ways-get-working-capital-your-business",
      },
      {
        label: "U.S. Small Business Administration — Asset-Based Lending: Upside and Downside",
        url: "https://www.sba.gov/blog/asset-based-lending-what-upside-downside",
      },
    ],
    toolHeading: "Accounts Receivable Financing Calculator",
    toolSubheading: "See your advance, reserve, fee, rebate, net proceeds, and real APR.",
    preset: {
      invoiceAmount: 50000,
      advanceRatePct: 80,
      factorFeePct: 2,
      daysUntilPaid: 60,
    },
    relatedSlugs: ["factoring-fee-calculator"],
  },
  {
    calculator: "invoice-factoring",
    slug: "factoring-fee-calculator",
    title: "Factoring Fee & Invoice Finance Charge Calculator",
    metaDescription:
      "A factoring fee (invoice finance charge) calculator showing your advance, reserve, fee, rebate, net proceeds, and true effective APR on one invoice.",
    targetKeyword: "factoring fee calculator",
    estimatedVolume: 90,
    estimatedKD: 20,
    h1: "Factoring Fee Calculator",
    introText:
      "This factoring fee calculator shows the exact fee, cash advance, and effective APR when you factor a single invoice.\nA factoring fee is the discount a factor keeps for advancing cash against your invoice before your customer pays. Enter your invoice amount, advance rate, factor fee, and days until payment below to see your advance, reserve, rebate, and net proceeds in seconds.\n\nThis tool lives under our [invoice factoring hub](/invoice-factoring/). To model an ongoing financing arrangement instead of one invoice, use our [accounts receivable financing calculator](/invoice-factoring/accounts-receivable-financing/).",
    howItWorks:
      "A factoring fee calculator multiplies your invoice by the advance rate for cash now, then applies the factor fee against the full invoice.\nThe tool first finds your advance: invoice amount times the advance rate. The rest is the reserve, held until your customer pays. The factoring fee is charged on the invoice value, and once the customer settles, you get the reserve back minus that fee. Net proceeds are the advance plus the rebate.\n\nThe insight worth catching is that a higher advance rate does not lower your fee. A 90% advance simply gives you more cash up front, but the fee still applies to the whole invoice. And because the fee is charged over a short window, a 3% fee on a 30-day invoice becomes roughly a 40% effective APR. Short terms make small fees expensive on an annualized basis.",
    commonMistakes: [
      "Assuming a higher advance rate lowers the fee. The fee is charged on the full invoice regardless of how much you draw up front.",
      "Reading the fee as annual. A 3% fee over 30 days is closer to a 40% effective APR, not 3% a year.",
      "Forgetting the reserve is returned only after your customer pays, minus the fee.",
      "Not checking whether tiered fees apply, where the fee rises the longer an invoice stays unpaid.",
      "Comparing factoring fees to loan interest rates without annualizing both into APR first.",
    ],
    workedExample:
      "Factor a $25,000 invoice at a 90% advance rate, a 3% factor fee, and 30 days until payment. Your advance today is $22,500, with a $2,500 reserve held back. When your customer pays, the fee is $750, so your rebate is $1,750 and net proceeds are $24,250 on the $25,000 invoice. Because the $750 fee is charged over just 30 days, the effective APR is about 40.56%, far higher than the 3% the fee first appears to be.",
    faqs: [
      {
        question: "How does a factoring fee calculator work?",
        answer:
          "A factoring fee calculator multiplies your invoice by the advance rate to find cash now, applies the factor fee to the full invoice, and annualizes it. On a $25,000 invoice at 90% with a 3% fee, you get $22,500 up front and pay a $750 fee.",
      },
      {
        question: "How is a factoring fee calculated?",
        answer:
          "The factoring fee is a percentage of the full invoice value, not just the advance. On a $25,000 invoice at a 3% fee, the fee is $750. You receive that back out of your reserve when the invoice is paid, leaving a $1,750 rebate.",
      },
      {
        question: "Does a higher advance rate reduce the fee?",
        answer:
          "No. A higher advance rate gives you more cash up front but does not change the fee, which is charged on the whole invoice. A 90% advance on a $25,000 invoice still carries the same 3% fee, or $750.",
      },
      {
        question: "Why is the effective APR so high on a low fee?",
        answer:
          "Because the fee is charged over a short window. A 3% fee on a 30-day invoice works out to about a 40.56% effective APR once annualized. The shorter the payment window, the higher the APR on the same flat fee.",
      },
      {
        question: "What are net proceeds when factoring an invoice?",
        answer:
          "Net proceeds are your advance plus the rebate, which is the reserve minus the fee. On a $25,000 invoice at 90% with a 3% fee, that is $22,500 plus a $1,750 rebate, or $24,250 total on the $25,000 invoice.",
      },
    ],
    sources: [
      {
        label: "U.S. Small Business Administration — 3 Ways to Get Working Capital",
        url: "https://www.sba.gov/blog/3-ways-get-working-capital-your-business",
      },
      {
        label: "CFPB — Truth in Lending (Regulation Z), 12 CFR Part 1026",
        url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/",
      },
    ],
    toolHeading: "Factoring Fee Calculator",
    toolSubheading: "Price a single factored invoice: advance, fee, rebate, net proceeds, and APR.",
    preset: {
      invoiceAmount: 25000,
      advanceRatePct: 90,
      factorFeePct: 3,
      daysUntilPaid: 30,
    },
    relatedSlugs: ["accounts-receivable-financing"],
  },
];
