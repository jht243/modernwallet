import type { SpokeEntry } from "./types";

// MortgageIQ (mortgage) spokes. Powered by the same amortization engine (src/lib/auto-loan.ts) in
// mortgageMode — principal & interest only (taxes/insurance/PMI are out of scope and the content
// says so). CONTENT: written via the keyword-gap system (guided research+write vs CFPB / Freddie Mac
// primary sources, engine ground-truth figures) + adversarial audit per page. See CONTENT.md.
//
// Deferred to a later pass (need biweekly / two-loan math the engine lacks): biweekly, refinance.

export const MORTGAGE_SPOKES: SpokeEntry[] = [
  {
    calculator: "mortgage",
    slug: "payoff-calculator",
    title: "Mortgage Payoff Calculator: See Your Early Payoff Date",
    metaDescription:
      "Use our mortgage payoff calculator to see when your loan ends and how much extra payments save you in interest. Free, fast, and based on 2026 rules.",
    targetKeyword: "mortgage payoff calculator",
    estimatedVolume: 12000,
    estimatedKD: 50,
    h1: "Mortgage Payoff Calculator",
    intro:
      "A mortgage payoff calculator shows when your loan will be paid off and how much interest extra payments can save. Enter your balance, rate, term, and any extra monthly amount in the calculator above to see your new payoff date instantly. The biggest takeaway: extra principal paid early in a 30-year loan saves far more than the same amount paid near the end. That is because interest is charged on your remaining balance, so cutting it sooner stops more interest from ever accruing.",
    howItWorks:
      "This calculator compares two paths: your scheduled payoff and a faster payoff with extra principal. It uses your balance, interest rate, and term to build an amortization schedule, then adds your extra payment to principal each month.\n\nEvery dollar of extra payment lowers your balance, so less interest is charged going forward. The CFPB explains that most of an early payment goes to interest, with the rest reducing principal and building equity. As your balance falls, more of each regular payment shifts to principal, which speeds up payoff. Always confirm with your servicer that extra money is applied to principal, not held or pushed to next month's bill.",
    commonMistakes: [
      "Not telling your servicer to apply extra money to principal. Mark each extra payment as 'principal only' or it may be held or counted as an early next-month payment.",
      "Assuming a prepayment penalty applies. Many mortgages have none, and per the CFPB penalties usually apply only if you pay off the whole loan within the first three to five years.",
      "Waiting until late in the loan to add extra payments. Extra principal in year 2 saves far more interest than the same amount in year 25.",
      "Confusing recasting with prepaying. Recasting re-amortizes your balance to lower the monthly payment; prepaying keeps the payment but shortens the term and cuts interest.",
      "Ignoring opportunity cost. Before overpaying, weigh higher-return uses like an employer 401(k) match, high-interest debt, or an emergency fund.",
    ],
    workedExample:
      "Say you owe $300,000 at 6.5% on a 30-year loan. Your scheduled principal and interest payment is $1,896.20. With no extra payments, you pay it off in 360 months and pay about $382,634 in interest. Now add $200 a month toward principal. In month 1, $1,625.00 goes to interest. The scheduled payment covers $271.20 of principal, and your extra $200 lifts the total principal reduction to $471.20. That small change pays the loan off in 277 months, about 23 years and 1 month. Total interest drops to $279,185. You save $103,449 in interest and 83 months, nearly 7 years.",
    faqs: [
      {
        question: "How does a mortgage payoff calculator work?",
        answer:
          "A mortgage payoff calculator builds your amortization schedule and shows your payoff date with and without extra payments. You enter your balance, rate, term, and any extra monthly amount. It then calculates total interest and months saved so you can compare both paths.",
      },
      {
        question: "Do extra payments really go toward principal?",
        answer:
          "Extra payments go toward principal only if you direct them that way. Mark each extra payment as 'principal' and confirm your servicer applied it. Freddie Mac advises checking that the bank credited the extra amount to your balance rather than future interest.",
      },
      {
        question: "Will I owe a penalty for paying off my mortgage early?",
        answer:
          "Usually no, but it depends on your loan terms. The CFPB notes that not all mortgages have a prepayment penalty, and when one exists it typically applies only if you pay off the full balance within the first three to five years. Check your loan documents to be sure.",
      },
      {
        question: "How much can extra payments save me?",
        answer:
          "Extra payments can save tens of thousands in interest and years off your loan. In our example, adding $200 a month to a $300,000 loan at 6.5% saves $103,449 in interest and pays it off 83 months early. Use the calculator above with your own numbers.",
      },
      {
        question: "What is the difference between prepaying and recasting a mortgage?",
        answer:
          "Prepaying means paying extra principal to shorten your term and cut interest while keeping the same monthly payment. Recasting re-amortizes your remaining balance over the original term to lower the monthly payment. Recasting does not save as much interest as prepaying the same amount.",
      },
    ],
    sources: [
      { label: "CFPB — How does paying down a mortgage work?", url: "https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/" },
      { label: "CFPB — Can I be charged a penalty for paying off my mortgage early?", url: "https://www.consumerfinance.gov/ask-cfpb/can-i-be-charged-a-penalty-for-paying-off-my-mortgage-early-en-204/" },
      { label: "Freddie Mac — Is there a faster way to be mortgage-free?", url: "https://myhome.freddiemac.com/blog/homeownership/pay-off-mortgage-faster" },
    ],
    toolHeading: "Calculate your mortgage payoff",
    toolSubheading: "Add an extra monthly payment to see your new payoff date and interest saved.",
    preset: { vehiclePrice: 300000, downPayment: 0, interestRatePct: 6.5, loanTermMonths: 360, extraMonthlyPayment: 200 },
    relatedSlugs: ["extra-payment-calculator", "early-payoff-calculator", "amortization-schedule"],
  },

  {
    calculator: "mortgage",
    slug: "extra-payment-calculator",
    title: "Mortgage Extra Payment Calculator: See Your Savings",
    metaDescription:
      "Use this mortgage extra payment calculator to see how extra monthly payments cut years off your loan and save thousands in interest. Free 2026 tool.",
    targetKeyword: "mortgage extra payment calculator",
    estimatedVolume: 2400,
    estimatedKD: 42,
    h1: "Mortgage Extra Payment Calculator",
    intro:
      "This mortgage extra payment calculator shows how much interest and time you save by paying more than your required monthly amount. Enter your balance, rate, term, and extra payment in the calculator above to see your new payoff date. Even a small extra amount each month can shave years off a 30-year loan. The calculator does the math so you can compare scenarios in seconds.",
    howItWorks:
      "A mortgage extra payment calculator applies any amount above your scheduled payment directly to your loan principal. Lowering the principal faster means less interest accrues over the life of the loan. That is why a modest monthly extra can save tens of thousands of dollars.\n\nThe tool first finds your scheduled principal-and-interest payment. It then adds your extra amount each month and rebuilds the payoff schedule. You see your new payoff date, total interest, and lifetime savings side by side with the original loan.",
    commonMistakes: [
      "Not telling your servicer to apply the extra money to principal. The CFPB warns that servicers may otherwise put it toward next month's payment or escrow, so add a written note or use the principal-only option.",
      "Paying for a third-party biweekly plan. The CFPB notes you can get the same result for free by sending one extra payment a year yourself, instead of paying a setup or service fee.",
      "Skipping a check for a prepayment penalty before you start. These usually apply only in the first three to five years, but confirm with your lender first.",
      "Funneling extra cash into the mortgage before higher-rate debt or an emergency fund. Mortgage money is hard to pull back out once it is paid.",
      "Confusing your total monthly payment with principal and interest. Taxes and insurance in escrow do not pay down the loan, so base your extra payment on the P&I figure.",
    ],
    workedExample:
      "Consider a $350,000 mortgage at 6.5% for 30 years. The scheduled principal-and-interest payment is $2,212.24. With no extra payments, the loan runs the full 360 months and costs about $446,406 in interest. Now add $300 extra every month. In month one, $1,895.83 goes to interest. The scheduled payment puts $316.41 toward principal, and your extra $300 brings the total principal reduction to $616.40. Keeping that $300 going, the loan is paid off in 261 months, about 21 years and 9 months. Total interest drops to $303,412. That is $142,994 saved in interest and 99 months, over eight years, cut from the term.",
    faqs: [
      {
        question: "How much do I save with a mortgage extra payment calculator?",
        answer:
          "It depends on your loan, but the savings are large. On a $350,000 loan at 6.5% for 30 years, adding $300 a month saves $142,994 in interest and pays the loan off 99 months early. Enter your own numbers in the calculator above to see your figures.",
      },
      {
        question: "Does one extra mortgage payment a year really help?",
        answer:
          "Yes. One extra payment a year still cuts roughly four to five years off a typical 30-year loan. A biweekly schedule does the same thing: paying half your amount every two weeks adds up to 26 half-payments, or 13 full monthly payments, each year.",
      },
      {
        question: "How do I make sure extra payments go to principal?",
        answer:
          "Tell your servicer in writing to apply the extra amount to principal. The CFPB cautions that without instructions, a servicer may apply extra money to the next payment or to escrow instead of reducing your balance.",
      },
      {
        question: "Will I pay a penalty for paying my mortgage early?",
        answer:
          "Usually not for small extra principal payments. The CFPB says prepayment penalties typically apply only if you pay off the whole balance within the first three to five years. Check your loan documents or ask your lender to be sure.",
      },
      {
        question: "Is a biweekly plan better than just paying extra?",
        answer:
          "Both reach the same goal, but doing it yourself is free. Third-party biweekly plans can charge setup or service fees. You can match the result by adding one extra payment a year on your own, or using the calculator above to set a monthly extra amount.",
      },
    ],
    sources: [
      { label: "CFPB — What is a prepayment penalty?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/" },
      { label: "CFPB — Pay down your loan faster without a biweekly plan fee", url: "https://www.consumerfinance.gov/ask-cfpb/someone-offered-me-the-ability-to-make-26-bi-weekly-mortgage-payments-a-year-for-a-fee-is-there-a-way-i-can-pay-down-my-loan-faster-on-my-own-without-paying-a-fee-to-sign-up-for-this-plan-en-203/" },
      { label: "CFPB — How does paying down a mortgage work?", url: "https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/" },
    ],
    toolHeading: "How much will extra payments save?",
    toolSubheading: "Enter your mortgage, then add an extra monthly amount to see the savings.",
    preset: { vehiclePrice: 350000, downPayment: 0, interestRatePct: 6.5, loanTermMonths: 360, extraMonthlyPayment: 300 },
    relatedSlugs: ["payoff-calculator", "early-payoff-calculator", "amortization-schedule"],
  },

  {
    calculator: "mortgage",
    slug: "amortization-schedule",
    title: "Mortgage Amortization Calculator & Schedule",
    metaDescription:
      "Use our mortgage amortization calculator to see a month-by-month schedule of principal, interest, and balance, and watch your home equity build.",
    targetKeyword: "mortgage amortization calculator",
    estimatedVolume: 9900,
    estimatedKD: 46,
    h1: "Mortgage Amortization Calculator",
    intro:
      "A mortgage amortization calculator shows how each monthly payment splits between principal and interest until your loan reaches zero. The calculator above builds a full month-by-month schedule, so you can see your balance shrink and your equity grow. Amortization simply means paying off a loan with regular payments over time. Here is the surprise: early payments are mostly interest, not principal.",
    howItWorks:
      "A mortgage amortization schedule lists every payment over your loan term and shows how much goes to interest, how much goes to principal, and what balance remains. Enter your loan amount, interest rate, and term, then the calculator above does the rest.\n\nEach month, interest is charged on your current balance using a monthly rate equal to your APR divided by 12. The payment stays the same, but as the balance falls, less goes to interest and more goes to principal. That is why the split flips slowly. The CFPB notes that interest payments do not build equity, so your ownership stake grows far slower than the dollars you pay in.",
    commonMistakes: [
      "Assuming payments split evenly between principal and interest. Early on, the bulk goes to interest, and principal catches up only in later years.",
      "Confusing the APR with the note rate. The note rate sets your monthly interest; the APR also bundles points and fees, so it usually runs higher.",
      "Expecting fast equity in years 1 to 5. Because early payments are mostly interest, selling or refinancing early can leave you with little equity after closing costs.",
      "Forgetting that taxes, insurance, and PMI sit outside the amortization schedule. The schedule only covers principal and interest.",
      "Mistaking a low minimum payment for progress. If a payment fails to cover the interest due, the balance grows. The CFPB calls this negative amortization.",
    ],
    workedExample:
      "Take a $320,000 mortgage at 6.5% APR over a 30-year, 360-month term with no extra payment. The monthly principal and interest payment is $2,022.62. In month 1, $1,733.33 goes to interest and only $289.28 goes to principal, so just about 14% of that first payment touches what you owe. The split flips slowly over the years, and by the final years almost all of each payment is principal. Across the full term you pay $408,142 in interest, bringing the total of payments to $728,142.",
    faqs: [
      {
        question: "What is a mortgage amortization calculator?",
        answer:
          "A mortgage amortization calculator builds a month-by-month schedule showing how each payment splits between principal and interest, plus your remaining balance. It reveals how slowly your balance falls in the early years and how equity builds over time.",
      },
      {
        question: "Why does most of my early payment go to interest?",
        answer:
          "Interest is charged on your full remaining balance, which is largest at the start. So early payments are mostly interest. On a $320,000 loan at 6.5%, month 1 sends $1,733.33 to interest and only $289.28 to principal.",
      },
      {
        question: "How is the monthly interest calculated?",
        answer:
          "Your monthly interest rate equals your APR divided by 12. That rate is applied to your current balance each month. As the balance drops, the interest portion shrinks and more of your fixed payment goes to principal.",
      },
      {
        question: "What is negative amortization?",
        answer:
          "Negative amortization means the amount you owe goes up even when you pay, because your payment does not cover the interest due. The CFPB warns unpaid interest gets added to your balance, which can leave you owing more than your home is worth.",
      },
      {
        question: "How can I pay off my mortgage faster?",
        answer:
          "Adding to principal shrinks the back of your schedule and cuts total interest. Try our [extra payment calculator](/mortgage/extra-payment-calculator/), [early payoff calculator](/mortgage/early-payoff-calculator/), or [payoff calculator](/mortgage/payoff-calculator/).",
      },
    ],
    sources: [
      { label: "CFPB — How does paying down a mortgage work?", url: "https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/" },
      { label: "CFPB — What is negative amortization?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-negative-amortization-en-103/" },
      { label: "CFPB — Mortgage interest rate vs. APR", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/" },
    ],
    toolHeading: "Generate your mortgage amortization schedule",
    toolSubheading: "Enter your loan to see the full month-by-month principal and interest breakdown.",
    preset: { vehiclePrice: 320000, downPayment: 0, interestRatePct: 6.5, loanTermMonths: 360, extraMonthlyPayment: 0 },
    relatedSlugs: ["payoff-calculator", "extra-payment-calculator", "early-payoff-calculator"],
  },

  {
    calculator: "mortgage",
    slug: "early-payoff-calculator",
    title: "Pay Off Mortgage Early Calculator: See Your Savings",
    metaDescription:
      "Use our pay off mortgage early calculator to see how extra payments cut years and interest. See a $250,000 example and decide if early payoff fits your goals.",
    targetKeyword: "pay off mortgage early calculator",
    estimatedVolume: 1900,
    estimatedKD: 40,
    h1: "Pay Off Mortgage Early Calculator",
    intro:
      "A pay off mortgage early calculator shows how extra monthly payments shorten your loan and slash total interest. Enter your balance, rate, term, and extra payment in the calculator above to see your new payoff date instantly. The results help you decide whether paying down your mortgage beats other uses of that money. Use it to compare a few extra-payment amounts before you commit.",
    howItWorks:
      "Paying off a mortgage early works by sending extra money toward principal, which is the amount you still owe. Every dollar of extra principal removes future interest from your loan. The calculator above takes your loan details and adds your extra payment to each month's principal. It then rebuilds your amortization schedule to find a new, earlier payoff date.\n\nThe tool reports two numbers that matter most: total interest saved and months removed from your term. Compare those savings against your mortgage rate. If your rate is higher than the yield on a safe investment, prepaying often wins. If a safe investment or higher-rate debt beats your rate, that money may work harder elsewhere.",
    commonMistakes: [
      "Prepaying before building an emergency fund. The CFPB stresses keeping cash for surprise costs, because money sent to your mortgage is hard to get back.",
      "Ignoring higher-rate debt. Credit cards and other loans often cost far more than your mortgage, so pay those off first.",
      "Skipping tax-advantaged accounts. Maxing a 401(k) or IRA match can beat the guaranteed return from prepaying a low-rate loan.",
      "Confusing recasting with prepaying. Recasting lowers your monthly payment but keeps the term, while extra payments shorten the term instead.",
      "Not checking for a prepayment penalty. Some loans charge a fee for early payoff, so read your Note before sending large extra amounts.",
    ],
    workedExample:
      "Take a $250,000 mortgage at 6.0% APR on a 30-year term. The scheduled monthly principal and interest is $1,498.88. With no extra payments, you pay it off in 360 months and owe about $289,595 in total interest. Now add $500 each month toward principal. In month 1, $1,250.00 goes to interest. The scheduled payment covers $248.88 of principal, and your extra $500 brings the total principal reduction to $748.88. With that extra $500, total interest drops to $143,467 and the loan is gone in 197 months, about 16 years and 5 months. That extra payment saves $146,128 in interest and 163 months, over 13 years.",
    faqs: [
      {
        question: "Is it smart to pay off my mortgage early?",
        answer:
          "It can be smart if your mortgage rate is higher than what you can safely earn elsewhere. First build an emergency fund, pay off higher-rate debt, and capture any retirement match. After that, prepaying gives a guaranteed return equal to your mortgage rate.",
      },
      {
        question: "How much can I save by paying off my mortgage early?",
        answer:
          "Savings depend on your balance, rate, and extra payment. In our example, a $250,000 loan at 6.0% with $500 extra each month saves $146,128 in interest and 163 months. Use the calculator above with your own numbers to see your result.",
      },
      {
        question: "Will I be charged a penalty for paying off my mortgage early?",
        answer:
          "Usually no, but some loans carry a prepayment penalty. The CFPB notes these penalties rarely apply when you pay extra principal in small amounts. They more often trigger if you pay off the whole balance early by selling or refinancing. Check your loan documents to be sure.",
      },
      {
        question: "What is the difference between recasting and paying off early?",
        answer:
          "Recasting applies a lump sum to principal and lowers your monthly payment while keeping the same term. Paying off early sends extra money toward principal to shorten the term instead. Recasting eases your budget, while prepaying gets you debt-free sooner.",
      },
    ],
    sources: [
      { label: "CFPB — Can I be charged a penalty for paying off my mortgage early?", url: "https://www.consumerfinance.gov/ask-cfpb/can-i-be-charged-a-penalty-for-paying-off-my-mortgage-early-en-204/" },
      { label: "CFPB — What is a prepayment penalty?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/" },
      { label: "CFPB — An essential guide to building an emergency fund", url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/" },
    ],
    toolHeading: "Should you pay off your mortgage early?",
    toolSubheading: "Enter your balance as the home price, set down payment to $0, and add an extra payment.",
    preset: { vehiclePrice: 250000, downPayment: 0, interestRatePct: 6.0, loanTermMonths: 360, extraMonthlyPayment: 500 },
    relatedSlugs: ["payoff-calculator", "extra-payment-calculator", "amortization-schedule"],
  },
];
