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

  introText:
    "This business line of credit calculator shows your monthly payment and the true cost of the money you draw. Enter how much you draw, your APR, your repayment term, and any draw fee. A line of credit is revolving, so you pay interest only on the amount you actually draw — not your full credit limit. Draw $50,000 at a 12% APR over 24 months with a 2% draw fee, and your monthly payment is $2,353.67. You pay $6,488.17 in interest plus a $1,000 draw fee. That brings the total cost of the money to $7,488.17, an effective APR of 14.05% once the fee is counted.",

  howItWorks:
    "A business line of credit calculator amortizes the amount you draw over your repayment term, then adds any fees to find your real cost. First, the tool spreads your draw across each month at your APR, the same way a term loan works once the money is out. A $50,000 draw at 12% over 24 months comes to a $2,353.67 monthly payment and $6,488.17 in total interest. Next, it adds your draw fee — 2% of $50,000 is $1,000 here. The total cost of the money is $7,488.17. Because that $1,000 fee is real money you never get to use, your effective APR climbs to 14.05%, above the 12% quoted rate. Draw fees and maintenance fees are why the true cost of a line almost always beats the sticker rate. For a full comparison of options, see our [small business financing guide](/guides/small-business-financing-guide/).",

  faqs: [
    {
      question: "How does a business line of credit calculator work?",
      answer:
        "A business line of credit calculator amortizes your draw over your repayment term at your APR, then adds fees to show the true cost. It returns your monthly payment, total interest, any draw fee, the total cost of the money, and your effective APR. In our default example, a $50,000 draw at 12% over 24 months has a $2,353.67 monthly payment and costs $7,488.17 in total. People search for this same tool under different names — a business line of credit loan calculator, repayment calculator, payment calculator, amortization calculator, or interest calculator — but the math behind all of them is the same: how are payments calculated on a line of credit is really just asking how a draw amortizes at your APR. That holds whether the product is called a small business line of credit or a commercial line of credit at a bank; both are revolving and both amortize a draw the same way once you start repaying it.",
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
      question: "Does this calculator handle interest-only draws?",
      answer:
        "No — this calculator models an equal-payment draw, where every month's payment covers both principal and interest until the draw is paid off, the same way a term loan amortizes. Some lenders instead offer an interest-only draw period: during that stretch you pay only the interest on what you've drawn, and the principal either comes due in a lump sum when the draw period ends or converts into a fully amortizing repayment schedule afterward. To estimate an interest-only payment yourself in a spreadsheet, use simple interest: draw amount × APR ÷ 12. On a $50,000 draw at a 12% APR, that's $50,000 × 0.12 ÷ 12 = $500 a month, with none of the $50,000 principal repaid. Budget for a bigger payment once the interest-only period ends and principal repayment starts.",
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
      question: "How much can I qualify for on a business line of credit?",
      answer:
        "The size of the line a lender offers depends on several factors working together: your business's annual revenue, how long you've been operating, your personal and business credit scores, and whether you can offer collateral. Lenders also weigh your cash flow and existing debt to judge whether you can comfortably handle the payments this calculator shows. A stronger personal credit score and steady revenue growth typically unlock a larger limit and a lower APR, while a newer business with a thin credit history is more likely to be offered a smaller, often unsecured, line to start. Pledging collateral — equipment, inventory, or receivables — can help you qualify for a larger limit or a better rate, since it lowers the lender's risk. If you're approved for less than you need today, many lenders will reconsider your limit as your revenue and on-time payment history build.",
    },
    {
      question: "Can I get a $500,000 business line of credit?",
      answer:
        "It's possible, but a line that large usually comes from a bank rather than an online lender, and it typically requires strong revenue, time in business, and collateral. Conventional and online lenders more commonly cap lines in the tens of thousands to low hundreds of thousands of dollars. For a larger line backed by a government guarantee, ask about an SBA CAPLine, a type of SBA 7(a) loan structured as a revolving line — see our [business line of credit vs SBA loan](/compare/business-line-of-credit-vs-sba-loan/) comparison for how that option differs on approval time and qualification.",
    },
    {
      question: "How do business line of credit rates compare across banks?",
      answer:
        "Rates and fee structures vary widely by lender, and most banks won't quote a real number until you apply. Our [business line of credit rates by lender](/roundup/business-line-of-credit-rates-by-lender/) roundup pulls together what Chase, Wells Fargo, Bank of America, PNC, TD, RBC, Scotiabank, CIBC, Amex, and Bluevine each publish on their own sites, so you can compare the rate structure and fees side by side before you plug your own numbers into the calculator above.",
    },
    {
      question: "How do I calculate business line of credit payments in Excel?",
      answer:
        "You can replicate this calculator's monthly payment with the standard loan amortization formula: PMT = P × r ÷ (1 − (1 + r)^-n). P is your draw amount, r is your monthly interest rate, your APR divided by 12, and n is your total number of payments. In our default example, a $50,000 draw at 12% APR over 24 months, r equals 0.01 and n equals 24, and the formula returns $2,353.67, the same payment this calculator shows. In Excel or Google Sheets, skip the manual formula and use the built-in PMT function instead: =PMT(0.12/12, 24, -50000) returns that same $2,353.67. Add your draw fee as a separate line, since PMT covers only the amortized principal and interest, not upfront fees.",
    },
    {
      question:
        "Does this calculator work for Chase, Amex, Bank of America, or other specific lenders?",
      answer:
        "Yes. This calculator isn't tied to any one lender: it runs the same draw, APR, term, and fee math no matter which bank or lender you borrow from. Enter the draw amount, APR, term, and draw fee your own lender quotes, whether that's [Chase](https://www.chase.com/business/banking/loans/business-line-of-credit), [Bank of America](https://www.bankofamerica.com/smallbusiness/business-financing/unsecured-business-line-of-credit/), a credit union, or an online lender, and the calculator returns the same monthly payment and effective APR breakdown. American Express is one exception. Its [Business Blueprint](https://www.americanexpress.com/en-us/business/blueprint/business-line-of-credit/) line prices with a flat monthly fee instead of an APR, so convert that fee into an equivalent rate before you enter it here. For the actual rate, fee, and credit-limit numbers each lender publishes, see our [business line of credit rates by lender](/roundup/business-line-of-credit-rates-by-lender/) roundup.",
    },
    {
      question: "Is a fixed or prime-rate based line of credit better?",
      answer:
        "Most business lines of credit use a variable rate tied to the prime rate, not a fixed rate. The prime rate is a benchmark U.S. banks set off the [Federal Reserve's](https://www.federalreserve.gov/releases/h15/) federal funds rate, and it moves whenever the Fed changes that rate. A lender then quotes your line as prime plus a margin, for example prime plus 2%, so your payment can rise when the Fed raises rates and fall when it cuts them. A fixed-rate line locks that number instead, trading a potentially lower starting rate for protection against future rate hikes. Neither is automatically better. A variable, prime-based rate usually costs less if rates hold steady or fall. A fixed rate protects you if you expect rates to climb during your repayment term. Check whether the rate your lender quotes is fixed or variable before you enter it into this calculator, since a variable rate can change your real payment mid-term.",
    },
    {
      question: "Does this calculator apply to a commercial line of credit secured by real estate?",
      answer:
        "Yes. A commercial line of credit secured by real estate or business equipment amortizes the same way once you start drawing against it. This calculator's draw, APR, term, and fee math works for a secured commercial line just as it does for an unsecured one. Collateral changes what you qualify for. It does not change how the calculator computes your payment. Pledging real estate or equipment typically gets you a larger credit limit and a lower rate. The lender's risk drops when it can seize a specific asset if you default. Confirm your actual draw period and repayment period with your lender, since a secured commercial line sometimes runs on a different schedule than this calculator's default 24-month term. Enter your real numbers here to see the payment and effective APR.",
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
