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
    relatedSlugs: ["extra-payment-calculator", "refinance-calculator", "early-payoff-calculator"],
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
    relatedSlugs: ["payoff-calculator", "refinance-calculator", "amortization-schedule"],
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
    relatedSlugs: ["payoff-calculator", "extra-payment-calculator", "piti-calculator"],
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
    relatedSlugs: ["payoff-calculator", "refinance-calculator", "amortization-schedule"],
  },

  {
    calculator: "mortgage",
    slug: "piti-calculator",
    title: "PITI Mortgage Calculator: All-In Monthly Payment",
    metaDescription:
      "Calculate your full PITI mortgage payment — principal, interest, property taxes, homeowner's insurance, and PMI — to see what you truly owe each month.",
    targetKeyword: "mortgage calculator with taxes and insurance",
    estimatedVolume: 8100,
    estimatedKD: 48,
    h1: "PITI Mortgage Calculator",
    intro:
      "PITI stands for Principal, Interest, Taxes, and Insurance — the four components that make up your true all-in monthly mortgage payment. The calculator above shows your principal and interest (P&I); add your estimated property taxes and homeowner's insurance below to build your full PITI. Here is why it matters: lenders use your PITI — not just P&I — when applying the 28% front-end debt-to-income (DTI) rule, so your PITI must stay under 28% of your gross monthly income to qualify for most conventional loans.",
    howItWorks:
      "PITI is calculated by adding four line items: principal and interest from your amortization schedule, monthly property taxes (annual tax ÷ 12), monthly homeowner's insurance (annual premium ÷ 12), and PMI if your down payment is less than 20%. The calculator above handles the P&I portion; the remaining components depend on your location and loan structure.\n\nProperty taxes vary widely by state and county. The national average is roughly 1.1% of assessed home value per year, according to the Tax Foundation, but ranges from under 0.3% in Hawaii to over 2.1% in New Jersey. Private mortgage insurance (PMI) typically runs 0.5–1.5% of the loan amount annually for borrowers with less than 20% down, according to the CFPB. PMI is split into 12 monthly installments. Once your equity reaches 20%, you can request PMI cancellation under the Homeowners Protection Act; at 22% equity it is automatically terminated.",
    commonMistakes: [
      "Budgeting only for principal and interest. Taxes and insurance together often add $300–$600 or more per month on a median-priced home, which can push PITI above the lender's 28% front-end limit.",
      "Forgetting PMI when putting less than 20% down. On a $350,000 loan at 1% annual PMI, that adds $292 per month — a cost that disappears once you reach 20% equity.",
      "Using the list-price assessed value to estimate taxes. Assessed value can differ significantly from market price depending on your county. Ask the listing agent for the seller's current tax bill.",
      "Ignoring homeowner's insurance cost differences by location. Coastal or flood-prone areas can carry premiums three to four times the national average. Get a quote before finalizing your budget.",
      "Not asking about escrow. Most lenders escrow taxes and insurance, collecting them monthly as part of your payment. If yours does not, you must budget to pay those bills yourself at year-end.",
    ],
    workedExample:
      "Say you buy a $400,000 home with 20% down ($80,000), leaving a $320,000 loan at 6.75% for 30 years. P&I works out to $2,075.68 per month. Property taxes at the national average of 1.1% on $400,000 add $366.67 per month. Homeowner's insurance at a typical $1,500 per year adds $125 per month. Because you put 20% down, there is no PMI. Total PITI: $2,567.35 per month. To qualify conventionally under the 28% front-end rule, you would need at least $9,169 per month in gross income ($2,567.35 ÷ 0.28).",
    faqs: [
      {
        question: "What does PITI stand for in a mortgage?",
        answer:
          "PITI stands for Principal, Interest, Taxes, and Insurance. These four items make up your total monthly housing cost. Lenders use your full PITI payment — not just principal and interest — when calculating your front-end debt-to-income ratio.",
      },
      {
        question: "What is the 28% rule for PITI?",
        answer:
          "The 28% rule says your PITI should not exceed 28% of your gross monthly income. This is the conventional front-end DTI limit used by most lenders. For example, if you earn $8,000 per month before taxes, your PITI should stay at or below $2,240.",
      },
      {
        question: "How much is PMI and when can I remove it?",
        answer:
          "PMI typically costs 0.5–1.5% of your loan amount per year, according to the CFPB. You can request cancellation once your equity reaches 20% of the original purchase price. Under the federal Homeowners Protection Act, your lender must automatically cancel PMI when your loan balance reaches 78% of the original value.",
      },
      {
        question: "How do I estimate property taxes for my PITI?",
        answer:
          "Divide the annual property tax bill by 12. If you do not have the actual tax bill, use the county's current millage rate applied to the assessed value. The national average is about 1.1% of assessed value per year, per the Tax Foundation, but local rates vary significantly.",
      },
      {
        question: "Is homeowner's insurance required for a mortgage?",
        answer:
          "Yes. Nearly all lenders require homeowner's insurance for the life of the loan. The premium varies by location, home value, coverage level, and risk factors like flood zone or fire risk. Your lender will typically collect it monthly through your escrow account.",
      },
    ],
    sources: [
      { label: "CFPB — What is private mortgage insurance?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/" },
      { label: "CFPB — Understand loan options", url: "https://www.consumerfinance.gov/owning-a-home/loan-options/" },
      { label: "Tax Foundation — Property Taxes by State", url: "https://taxfoundation.org/data/all/state/property-taxes-by-state-county/" },
    ],
    toolHeading: "Calculate your PITI mortgage payment",
    toolSubheading: "Enter your home price and down payment to see principal and interest, then add taxes and insurance for your full PITI.",
    preset: { vehiclePrice: 400000, downPayment: 80000, interestRatePct: 6.75, loanTermMonths: 360 },
    relatedSlugs: ["affordability-calculator", "amortization-schedule", "interest-only-calculator"],
  },

  {
    calculator: "mortgage",
    slug: "affordability-calculator",
    title: "Mortgage Affordability Calculator: How Much House?",
    metaDescription:
      "Find out how much house you can afford based on your income, debts, and down payment. Uses the 28/36 DTI rules lenders actually apply.",
    targetKeyword: "mortgage affordability calculator",
    estimatedVolume: 22000,
    estimatedKD: 55,
    h1: "Mortgage Affordability Calculator",
    intro:
      "Your maximum affordable home price is determined by two lender rules: your PITI must stay at or below 28% of gross monthly income (front-end DTI), and all monthly debts combined must stay at or below 36% of gross monthly income (back-end DTI). The calculator above shows the principal-and-interest payment for any home price; use the 28% front-end limit to work backwards to a purchase price that fits your income. Here is the non-obvious insight: keeping your DTI under 36% does not just get you approved — lenders often tier interest rates by DTI, meaning a lower DTI can earn you a better rate, not merely a lender's yes.",
    howItWorks:
      "Lenders measure affordability with two debt-to-income ratios, according to the CFPB and Fannie Mae guidelines. The front-end DTI compares your monthly PITI payment to your gross monthly income; conventional lenders typically cap this at 28%. The back-end DTI adds all monthly debt payments (car loans, student loans, minimum credit card payments, and the new PITI) and divides by gross income; conventional lenders typically cap this at 36%, though Fannie Mae automated underwriting can approve up to 45-50% for strong borrowers. FHA loans allow higher DTIs — often up to 43% and in some cases 50% — making them more accessible for buyers with existing debt.\n\nTo find your maximum home price, start with 28% of your gross monthly income as your PITI budget, subtract estimated taxes and insurance, and the remainder is your maximum P&I. Enter that P&I into the calculator to find the corresponding loan amount, then add your down payment to get your maximum purchase price.",
    commonMistakes: [
      "Confusing gross income with take-home pay. DTI is always calculated on gross (pre-tax) monthly income, not the amount deposited in your bank account.",
      "Omitting minimum payments on all debts. Student loans, car payments, and even zero-balance credit cards with minimum payment requirements all count in your back-end DTI.",
      "Forgetting that PITI — not just P&I — goes into the DTI calculation. Taxes and insurance can add hundreds of dollars per month, reducing the loan size you can qualify for.",
      "Buying at the maximum you qualify for. Qualifying for the max does not mean it is comfortable. A lower payment leaves room for maintenance, savings, and life changes.",
      "Ignoring the impact of the down payment on PMI. A down payment below 20% adds PMI to your PITI, which increases your front-end DTI and reduces how much loan you can qualify for.",
    ],
    workedExample:
      "Suppose you earn $7,500 gross per month and have $400 per month in existing debt payments (car loan + student loan minimum). At the 28% front-end limit, your maximum PITI is $2,100. Subtract $350 for taxes and $125 for insurance, leaving $1,625 for P&I. At 6.75% for 30 years, a $1,625 P&I payment corresponds to roughly a $250,000 loan. With a $70,000 down payment, your maximum purchase price is about $320,000. Check the back-end: $2,100 PITI + $400 existing debt = $2,500, which is 33% of $7,500 gross — comfortably under the 36% back-end cap.",
    faqs: [
      {
        question: "How much house can I afford on my income?",
        answer:
          "A common starting point: your total PITI payment should not exceed 28% of your gross monthly income. On $6,000 per month in gross income, that is $1,680 for PITI. After subtracting taxes and insurance, the remaining P&I determines the loan amount you can afford at current rates.",
      },
      {
        question: "What DTI do lenders use for mortgage approval?",
        answer:
          "Conventional lenders typically use 28% front-end and 36% back-end DTI as standard guidelines, per Fannie Mae. Automated underwriting can approve up to 45-50% back-end DTI for strong borrowers. FHA allows up to 43% and sometimes 50% back-end DTI, according to HUD.",
      },
      {
        question: "Does a lower DTI get me a better mortgage rate?",
        answer:
          "Yes, in many cases. Lenders often use risk-based pricing that assigns better rates to lower-DTI borrowers. A DTI well under 36% signals stronger repayment capacity and can reduce your rate by 0.125–0.25%, saving thousands over the life of the loan.",
      },
      {
        question: "What counts as debt in my DTI calculation?",
        answer:
          "All monthly minimum debt payments count: car loans, student loans, personal loans, minimum credit card payments, child support, and alimony. The new mortgage PITI is also included in the back-end DTI. Income-driven student loan payments use the actual monthly payment amount in the calculation.",
      },
      {
        question: "How does an FHA loan change my affordability?",
        answer:
          "FHA loans allow higher DTI ratios — often up to 43%, and in some cases 50%, according to HUD — which can increase your maximum purchase price if you carry existing debt. See our [FHA loan calculator](/mortgage/fha-calculator/) for FHA-specific payment estimates including mortgage insurance premiums.",
      },
    ],
    sources: [
      { label: "CFPB — How do lenders decide how much to lend?", url: "https://www.consumerfinance.gov/ask-cfpb/how-do-lenders-decide-how-much-money-to-lend-me-en-19/" },
      { label: "Fannie Mae — Debt-to-Income Ratios", url: "https://www.fanniemae.com/media/document/pdf/selling-guide-dti.pdf" },
      { label: "HUD — FHA Loan Eligibility", url: "https://www.hud.gov/buying/loans" },
    ],
    toolHeading: "See what your target home price costs monthly",
    toolSubheading: "Enter a home price and down payment to find the P&I payment, then apply the 28% front-end rule to check affordability.",
    preset: { vehiclePrice: 350000, downPayment: 70000, interestRatePct: 6.75, loanTermMonths: 360 },
    relatedSlugs: ["piti-calculator", "fha-calculator", "va-loan-calculator"],
  },

  {
    calculator: "mortgage",
    slug: "refinance-calculator",
    title: "Mortgage Refinance Calculator: Break-Even Analysis",
    metaDescription:
      "Calculate your refinance break-even point: compare your current rate to a new rate, see monthly savings, and find out how long before closing costs pay off.",
    targetKeyword: "mortgage refinance calculator",
    estimatedVolume: 9900,
    estimatedKD: 52,
    h1: "Mortgage Refinance Calculator",
    intro:
      "A mortgage refinance is worth it only if you stay in the home long enough to recoup the closing costs through monthly savings — this is called the break-even point. Enter your new loan details in the calculator above to see the payment, then subtract it from your current payment to find your monthly savings. Divide your total closing costs by that monthly savings to get your break-even in months. The non-obvious trap: even if you lower your rate, resetting to a new 30-year term can cost you more in total interest than staying on your existing loan — always compare remaining-term options like a 20-year or 15-year refinance.",
    howItWorks:
      "Refinancing replaces your existing mortgage with a new one, typically at a lower interest rate or different term. Your new monthly payment is determined by the new loan amount (current balance + any rolled-in costs), the new interest rate, and the new term. Monthly savings equal your old P&I minus your new P&I.\n\nClosing costs typically run 2–5% of the loan amount, according to the CFPB. These include origination fees, appraisal, title insurance, and prepaid interest. Break-even is calculated as: total closing costs ÷ monthly savings = months to break even. If you plan to sell or refinance again before hitting that month, the refinance costs you money net. Some lenders offer no-closing-cost refinances, but the costs are rolled into the rate or loan balance — there is no free lunch, just a different trade-off.",
    commonMistakes: [
      "Resetting to a 30-year term without checking total interest. A 30-year refinance of a loan you have already paid for 8 years extends your payoff by 8 years and can add tens of thousands in interest even at a lower rate.",
      "Ignoring closing costs when calculating savings. A half-point rate drop saves real money monthly, but $8,000 in closing costs means it takes years to come out ahead.",
      "Refinancing right before a planned move. If your break-even is 36 months and you move in 24, you paid closing costs for nothing.",
      "Not shopping at least three lenders. The CFPB recommends comparing Loan Estimates from multiple lenders because rates and fees vary significantly for the same borrower profile.",
      "Cash-out refinancing for depreciating purchases. Tapping equity to buy cars or pay vacations converts unsecured spending into 30 years of mortgage interest.",
    ],
    workedExample:
      "You have a $280,000 balance at 7.25% with 22 years left. Your current P&I is $2,124. A lender offers a 30-year refinance at 5.75% with $7,000 in closing costs. Your new P&I would be $1,634 per month, saving $490 monthly. Break-even: $7,000 ÷ $490 = 14.3 months. If you plan to stay 5+ years, the refinance makes sense on monthly cash flow. But on the original 22-year remaining term, you would pay $145,608 more in total interest on the new 30-year loan versus finishing the old one — so a 20-year refinance at 5.75% (P&I: $1,948, break-even: 21 months) is worth comparing.",
    faqs: [
      {
        question: "When does it make sense to refinance a mortgage?",
        answer:
          "Refinancing makes sense when your monthly savings from a lower rate exceed closing costs before you plan to move or refinance again. A common rule of thumb is that a rate drop of 1% or more is worth investigating, but the actual math depends on your break-even period and how long you plan to stay.",
      },
      {
        question: "How much do refinance closing costs typically run?",
        answer:
          "Refinance closing costs typically run 2–5% of the loan amount, according to the CFPB. On a $300,000 loan, that is $6,000–$15,000. Costs include origination fees, appraisal, title search, and prepaid interest. Always get a Loan Estimate to see itemized costs before committing.",
      },
      {
        question: "What is a no-closing-cost refinance?",
        answer:
          "A no-closing-cost refinance rolls closing costs into your loan balance or offsets them with a higher interest rate (a lender credit). You pay nothing upfront, but you pay more over time through a larger balance or higher rate. It works best if you plan to refinance again soon or are short on cash.",
      },
      {
        question: "Does refinancing reset my mortgage clock?",
        answer:
          "Yes, if you choose a new 30-year term. Restarting the clock means more early payments go to interest, and your payoff date moves further out. Consider a shorter term like 20 or 15 years to avoid extending your debt while still lowering your rate. See our [amortization schedule](/mortgage/amortization-schedule/) to compare total interest by term.",
      },
      {
        question: "How do I calculate my refinance break-even point?",
        answer:
          "Divide your total closing costs by your monthly payment savings. For example, $7,000 in closing costs and $350 monthly savings yields a 20-month break-even. If you stay in the home at least that long, the refinance pays off. If you move sooner, you come out behind.",
      },
    ],
    sources: [
      { label: "CFPB — Should I refinance my mortgage?", url: "https://www.consumerfinance.gov/ask-cfpb/when-is-it-a-good-time-to-refinance-my-mortgage-en-1939/" },
      { label: "CFPB — What are closing costs?", url: "https://www.consumerfinance.gov/ask-cfpb/what-are-closing-costs-en-183/" },
      { label: "Freddie Mac — Refinancing", url: "https://myhome.freddiemac.com/refinancing" },
    ],
    toolHeading: "Model your refinance payment",
    toolSubheading: "Enter your new loan amount and rate to see P&I, then compare it to your current payment to find your break-even.",
    preset: { vehiclePrice: 350000, downPayment: 0, interestRatePct: 5.75, loanTermMonths: 360 },
    relatedSlugs: ["payoff-calculator", "interest-only-calculator", "amortization-schedule"],
  },

  {
    calculator: "mortgage",
    slug: "fha-calculator",
    title: "FHA Loan Calculator: Payment with MIP",
    metaDescription:
      "Calculate your FHA loan payment including upfront and annual mortgage insurance premiums (MIP). See how 3.5% down affects your true monthly cost.",
    targetKeyword: "FHA loan calculator",
    estimatedVolume: 6600,
    estimatedKD: 45,
    h1: "FHA Loan Calculator",
    intro:
      "An FHA loan requires a minimum 3.5% down payment for borrowers with a 580 or higher credit score and carries two layers of mortgage insurance: a one-time upfront MIP of 1.75% of the loan amount (typically financed into the loan) and an annual MIP of 0.55% for most 30-year loans with less than 10% down (per HUD's 2023 guidelines), divided into 12 monthly installments. The calculator above shows principal and interest on your loan amount after financing the upfront MIP. The critical non-obvious fact: unlike conventional PMI, FHA annual MIP remains for the life of the loan if you put less than 10% down — it does not automatically cancel at 20% equity, so many FHA borrowers refinance to conventional once they reach 20% to shed the ongoing insurance cost.",
    howItWorks:
      "FHA loans are insured by the Federal Housing Administration, part of HUD, which allows lenders to offer more lenient qualifying terms. With a 580+ credit score, you need only 3.5% down. With a 500–579 credit score, the minimum down payment rises to 10%.\n\nThe upfront MIP (UFMIP) equals 1.75% of the base loan amount. If you do not pay it at closing, it is added to your loan balance. On a $337,750 loan (3.5% down on $350,000), the UFMIP is $5,910.63, making your total financed amount $343,660.63. The annual MIP for a 30-year loan with less than 10% down is 0.55% of the average outstanding balance, per HUD. Divide by 12 to get the monthly MIP — roughly $157 per month on that loan. Together, P&I plus monthly MIP is your true FHA monthly housing cost.\n\nFHA vs Conventional loan — head-to-head: FHA requires only 3.5% down (vs 5% conventional) and accepts credit scores as low as 580, but charges MIP for the life of the loan (if less than 10% down). Conventional loans with 20%+ down have no PMI at all; with less than 20%, PMI cancels automatically at 20% equity (unlike FHA). On credit score, conventional loans reward 720+ borrowers with lower PMI rates that can fall below FHA MIP. Debt-to-income (DTI): FHA allows up to 43–50% DTI; conventional typically caps at 43–45%. Loan limits: both follow conforming limits in most markets, but FHA has its own county-level maximums. The verdict: choose FHA when your credit score is below 680 or you need sub-5% down with minimal savings. Choose conventional when your credit score is 680+ and you can put 5–20% down — you'll likely pay less in long-term insurance costs and can drop PMI, unlike FHA MIP.",
    commonMistakes: [
      "Assuming FHA MIP cancels at 20% equity like conventional PMI. For loans with less than 10% down originated after June 2013, FHA annual MIP stays for the full loan term per HUD rules — you must refinance to a conventional loan to remove it.",
      "Forgetting to add the UFMIP to the loan amount. If you finance the upfront MIP, your loan balance is 1.75% larger than the purchase price minus down payment.",
      "Not comparing the true cost to conventional PMI. At higher credit scores (720+), conventional PMI can be cheaper than FHA MIP, and conventional PMI cancels at 20% equity.",
      "Using FHA limits without checking local maximums. FHA sets loan limits by county. In high-cost areas the 2024 ceiling is $1,149,825; in lower-cost areas it can be as low as $498,257. You cannot borrow above your county's limit.",
      "Overlooking FHA streamline refinances. Once you have an FHA loan, an FHA streamline refinance requires less documentation and no new appraisal, making it easier to lower your rate later.",
    ],
    workedExample:
      "You buy a $350,000 home with 3.5% down ($12,250). Your base loan is $337,750. The UFMIP at 1.75% is $5,910.63, financed into the loan for a total balance of $343,660.63. At 6.5% for 30 years, P&I is $2,172.14 per month. Annual MIP at 0.55% on $343,660.63 is $1,890.13 per year, or $157.51 per month. Total monthly payment (P&I + MIP): $2,329.65. By contrast, a conventional loan at 6.75% on the same home with 3.5% down and PMI at 1.0% annually would run $2,211 P&I plus $276 PMI = $2,487 per month initially — more per month, but PMI cancels once you reach 20% equity.",
    faqs: [
      {
        question: "What is FHA mortgage insurance and how long do I pay it?",
        answer:
          "FHA mortgage insurance has two parts: a one-time upfront MIP of 1.75% of the loan amount, and an annual MIP charged monthly. For 30-year loans with less than 10% down, annual MIP continues for the life of the loan per HUD rules. With 10% or more down, annual MIP cancels after 11 years.",
      },
      {
        question: "What credit score do I need for an FHA loan?",
        answer:
          "You need a 580 or higher credit score to qualify for the 3.5% minimum down payment. With a score between 500 and 579, FHA requires a 10% down payment. Scores below 500 do not qualify for FHA financing, per HUD guidelines.",
      },
      {
        question: "How does FHA compare to conventional for first-time buyers?",
        answer:
          "FHA offers a lower down payment (3.5% vs. 5% for most conventional loans) and accepts lower credit scores. But FHA MIP can be more expensive long-term than conventional PMI, especially if you have strong credit. Once you have 20% equity, conventional loans let you drop PMI — FHA does not unless you refinance.",
      },
      {
        question: "What are the FHA loan limits for 2024?",
        answer:
          "FHA loan limits vary by county. For 2024, the national floor is $498,257 for a single-family home in lower-cost areas. The ceiling in high-cost areas is $1,149,825. Check HUD's website for your specific county limit before shopping for a home.",
      },
      {
        question: "Can I refinance out of FHA to remove MIP?",
        answer:
          "Yes. Once you reach 20% equity, you can refinance into a conventional loan and eliminate MIP entirely. This is one of the most common strategies for FHA borrowers, especially after home values rise. Compare the cost of refinancing against the ongoing MIP savings to find your break-even. See our [refinance calculator](/mortgage/refinance-calculator/) for the analysis.",
      },
      {
        question: "Is an FHA loan better than a conventional loan for first-time buyers?",
        answer:
          "FHA wins when your credit score is below 680 or your savings limit you to 3.5% down — FHA's minimum. Conventional wins when your score is 680+ and you can put 5–20% down: conventional PMI rates are lower for strong-credit borrowers and PMI cancels automatically at 20% equity. FHA MIP does not cancel unless you refinance (for loans with less than 10% down). On a $300,000 loan, a 720-credit-score borrower often pays less total insurance cost with conventional PMI over 7 years than with FHA MIP. Use the [mortgage calculator](/mortgage/) to model your own numbers and compare total cost for both loan types side by side.",
      },
    ],
    sources: [
      { label: "HUD — FHA Mortgage Insurance", url: "https://www.hud.gov/program_offices/housing/fhahistory" },
      { label: "HUD — FHA Mortgage Insurance Premiums", url: "https://www.hud.gov/sites/dfiles/OCHCO/documents/2023-07ml.pdf" },
      { label: "CFPB — FHA Loans", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-an-fha-loan-en-1965/" },
    ],
    toolHeading: "Calculate your FHA loan payment",
    toolSubheading: "Enter your home price with 3.5% down to see principal and interest, then add monthly MIP for your true FHA cost.",
    preset: { vehiclePrice: 350000, downPayment: 12250, interestRatePct: 6.5, loanTermMonths: 360 },
    relatedSlugs: ["va-loan-calculator", "piti-calculator", "affordability-calculator"],
  },

  {
    calculator: "mortgage",
    slug: "va-loan-calculator",
    title: "VA Loan Calculator: Payment with Funding Fee",
    metaDescription:
      "Calculate your VA loan payment with no down payment and no PMI. Includes VA funding fee details for veterans, active duty, and surviving spouses.",
    targetKeyword: "VA loan calculator",
    estimatedVolume: 5400,
    estimatedKD: 44,
    h1: "VA Loan Calculator",
    intro:
      "VA loans require no down payment and no private mortgage insurance for eligible veterans, active-duty service members, and surviving spouses — making them the most powerful home-buying benefit available to eligible borrowers. Instead of PMI, VA loans carry a one-time funding fee of 2.15% of the loan amount for first-time use with 0% down (2024 rate per VA.gov), which is typically financed into the loan. The non-obvious advantage: VA loans consistently carry the lowest average interest rates of any major loan type — historically 0.25–0.5% lower than conventional rates according to Freddie Mac's Primary Mortgage Market Survey — so the no-PMI and lower-rate combination saves eligible borrowers thousands of dollars per year.",
    howItWorks:
      "The VA Home Loan program is guaranteed by the U.S. Department of Veterans Affairs, which allows VA-approved lenders to offer favorable terms with no down payment requirement and no PMI. The guarantee reduces lender risk, which is why rates run lower than conventional.\n\nThe VA funding fee replaces PMI as the program's cost-recovery mechanism. For first-time use with 0% down, the fee is 2.15% of the loan amount. For subsequent use, it rises to 3.3%. With a 5% or more down payment, the fee drops to 1.5% (first use) or 3.3% (subsequent use). Service members receiving VA disability compensation of any percentage are exempt from the funding fee entirely, a significant savings. The funding fee is added to the loan balance if not paid at closing, which slightly increases your monthly P&I.",
    commonMistakes: [
      "Assuming VA loans are harder to get than conventional. VA loans have no minimum credit score set by VA (though lenders set their own, typically 580–620) and no maximum DTI set by VA — making them accessible to borrowers who might not qualify conventionally.",
      "Paying the funding fee out of pocket when you may be exempt. Veterans with a VA disability rating of any level are exempt from the funding fee. Surviving spouses of veterans who died in service or from service-connected disability are also exempt. Always verify your status before closing.",
      "Not shopping lenders. VA rates vary by lender even within the same loan type. The CFPB recommends comparing at least three lenders to ensure you get the best rate and fees.",
      "Using a VA loan on a home that fails VA appraisal. VA appraisals include minimum property requirements (MPRs) beyond standard market value. Homes with major safety or structural issues can fail VA appraisal, so inspect thoroughly before making an offer.",
      "Confusing VA loan entitlement with a loan limit. VA removed loan limits for eligible borrowers with full entitlement in 2020 — you can borrow as much as a lender will approve with no down payment, assuming your income and credit qualify.",
    ],
    workedExample:
      "You are a first-time VA loan user buying a $400,000 home with 0% down. Your base loan is $400,000. The funding fee at 2.15% is $8,600, financed into the loan for a total balance of $408,600. At 6.25% for 30 years, P&I is $2,516.75 per month. There is no PMI. Compare to a conventional loan on the same home with 5% down ($20,000): base loan $380,000 at 6.75% with 0.9% PMI gives P&I of $2,464.78 plus PMI of $285 = $2,749.78 per month, and you had to bring $20,000 to closing. The VA loan costs $233 less per month even with the higher balance, and required no down payment.",
    faqs: [
      {
        question: "Who is eligible for a VA home loan?",
        answer:
          "Eligible borrowers include veterans, active-duty service members, National Guard and Reserve members who meet service requirements, and surviving spouses of veterans who died in service or from a service-connected disability. VA.gov's eligibility page has the specific service duration requirements for each category.",
      },
      {
        question: "What is the VA funding fee and can it be waived?",
        answer:
          "The VA funding fee is a one-time charge of 2.15% of the loan amount for first-time use with 0% down (2024 rates). It can be financed into the loan or paid at closing. The fee is waived entirely for veterans receiving VA disability compensation of any rating and for eligible surviving spouses.",
      },
      {
        question: "Do VA loans have PMI?",
        answer:
          "No. VA loans have no private mortgage insurance requirement, regardless of your down payment. This is one of the program's most significant financial benefits. The VA funding fee (paid once) serves a similar cost-recovery function for the program but is far less expensive than years of monthly PMI.",
      },
      {
        question: "Are VA loan rates really lower than conventional rates?",
        answer:
          "Yes, historically. Freddie Mac's Primary Mortgage Market Survey data consistently shows VA loan rates averaging 0.25–0.5% lower than conventional rates. The VA guarantee reduces lender risk, which translates directly into better pricing for borrowers.",
      },
      {
        question: "Can I use a VA loan more than once?",
        answer:
          "Yes. You can use VA loan benefits multiple times as long as your entitlement is restored. Entitlement is typically restored when you sell the home and repay the prior VA loan in full. For subsequent use with 0% down, the funding fee increases to 3.3%. See our [affordability calculator](/mortgage/affordability-calculator/) to plan your next purchase.",
      },
    ],
    sources: [
      { label: "VA.gov — VA Home Loan Funding Fee", url: "https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/" },
      { label: "VA.gov — VA Home Loan Eligibility", url: "https://www.va.gov/housing-assistance/home-loans/eligibility/" },
      { label: "Freddie Mac — Primary Mortgage Market Survey", url: "https://www.freddiemac.com/pmms" },
    ],
    toolHeading: "Calculate your VA loan payment",
    toolSubheading: "Enter your home price with 0% down to see your VA loan P&I. Add 2.15% of the loan to the price to account for the financed funding fee.",
    preset: { vehiclePrice: 400000, downPayment: 0, interestRatePct: 6.25, loanTermMonths: 360 },
    relatedSlugs: ["fha-calculator", "piti-calculator", "affordability-calculator"],
  },

  {
    calculator: "mortgage",
    slug: "interest-only-calculator",
    title: "Interest-Only Mortgage Calculator",
    metaDescription:
      "Calculate your interest-only mortgage payment and see how the payment jumps when the IO period ends. Understand the risks before choosing an IO loan.",
    targetKeyword: "interest only mortgage calculator",
    estimatedVolume: 4400,
    estimatedKD: 41,
    h1: "Interest-Only Mortgage Calculator",
    intro:
      "An interest-only (IO) mortgage payment covers only the interest due each month — none of your payment reduces the principal balance during the IO period, which typically lasts 5 to 10 years. The calculator above shows the principal-and-interest payment for your loan; your IO payment is simply the monthly interest portion alone (loan balance × annual rate ÷ 12). When the IO period ends, the full remaining balance — unchanged from day one — amortizes over the remaining term, causing a significant payment increase. The critical risk: because IO loans build zero equity during the IO period, a drop in home values can leave you underwater with no equity buffer.",
    howItWorks:
      "During the interest-only period, your monthly payment equals loan balance × (annual interest rate ÷ 12). On a $400,000 loan at 6.75%, that is $400,000 × (0.0675 ÷ 12) = $2,250 per month. You pay $2,250 every month for the IO period and still owe $400,000 when it ends.\n\nAfter the IO period, the full balance must amortize over the remaining term. If you had a 30-year IO loan with a 10-year IO period, the $400,000 balance amortizes over the remaining 20 years (240 months) at the then-current rate. At 6.75%, that payment jumps to $3,044 per month — a 35% increase. If the loan is also adjustable-rate, the rate may be higher at that point, compounding the payment shock.\n\nTotal interest paid over the life of an IO loan significantly exceeds that of a fully amortizing loan because no principal reduction occurs during the IO period, so you pay interest on the full balance for those years.",
    commonMistakes: [
      "Treating the IO payment as your long-term budget. The low IO payment lasts only 5–10 years. Plan for the post-IO payment — which can be 25–40% higher — before you commit.",
      "Assuming the home will appreciate enough to cover the lack of equity build. IO loans became widespread before 2008 on this assumption. Home prices fell instead, leaving many IO borrowers deeply underwater.",
      "Not reading whether the loan is fixed or adjustable. Most IO loans are adjustable-rate (ARM) products. The rate can rise at the IO-period end, which can compound the payment jump beyond what a fixed-rate IO would produce.",
      "Forgetting that selling costs eat into zero-equity positions. If you sell during the IO period, you owe the full original balance. After subtracting realtor fees (typically 5–6%) and closing costs, you may need to bring cash to closing.",
      "Comparing the IO payment to a fully amortizing payment without accounting for total interest. An IO loan looks cheaper monthly but costs significantly more over 30 years because interest runs on the full balance for a decade longer.",
    ],
    workedExample:
      "You take a $400,000 IO loan at 6.75% with a 10-year IO period followed by a 20-year fully amortizing period. During the IO period: $400,000 × (0.0675 ÷ 12) = $2,250 per month for 120 months = $270,000 in interest paid, principal balance still $400,000. After IO period: $400,000 amortizes over 240 months at 6.75%, giving a payment of $3,044 per month. Total interest during amortization period: $330,560. Grand total interest: $600,560 — compared to $562,072 for a standard 30-year fully amortizing $400,000 loan at 6.75% (which has a constant payment of $2,594). The IO loan costs $38,488 more in total interest and carries far more risk.",
    faqs: [
      {
        question: "What is an interest-only mortgage?",
        answer:
          "An interest-only mortgage requires you to pay only the interest owed each month for a set period — typically 5 to 10 years. None of your payment reduces the loan balance. After the IO period ends, the full original balance amortizes over the remaining term, causing your payment to increase substantially.",
      },
      {
        question: "How much does the payment increase after the IO period?",
        answer:
          "The increase depends on your loan amount, rate, and remaining term. On a $400,000 loan at 6.75%, the IO payment is $2,250. After a 10-year IO period, the fully amortizing payment over the remaining 20 years jumps to $3,044 — a 35% increase. If the rate is also adjustable, the jump can be larger.",
      },
      {
        question: "Do interest-only loans build equity?",
        answer:
          "No. During the IO period, your balance does not decrease, so you build zero equity through loan paydown. Any equity gain comes solely from home price appreciation. If prices fall, you lose equity — or go underwater — with no principal reduction to cushion the loss.",
      },
      {
        question: "Who benefits from an interest-only mortgage?",
        answer:
          "IO loans can make sense for borrowers with irregular income (such as commissioned salespeople or investors) who expect large periodic income windfalls to pay down principal, or for short-term holds where the buyer plans to sell before the IO period ends. They require careful planning and carry meaningful risk.",
      },
      {
        question: "How do I calculate my interest-only payment?",
        answer:
          "Multiply your loan balance by your annual interest rate, then divide by 12. For example: $400,000 × 6.75% ÷ 12 = $2,250 per month. Use the calculator above to find your post-IO fully amortizing payment, which you can compare to your IO payment to plan for the transition.",
      },
    ],
    sources: [
      { label: "CFPB — Interest-only mortgages", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-an-interest-only-mortgage-en-1212/" },
      { label: "CFPB — Adjustable-rate mortgages", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-an-adjustable-rate-mortgage-en-100/" },
      { label: "HUD — Risky or Nontraditional Mortgages", url: "https://www.hud.gov/program_offices/housing/sfh/buying/risky_mortgages" },
    ],
    toolHeading: "Calculate your interest-only mortgage payment",
    toolSubheading: "Enter your loan details to see the fully amortizing P&I. Your IO payment is: loan amount × (rate ÷ 12).",
    preset: { vehiclePrice: 500000, downPayment: 100000, interestRatePct: 6.75, loanTermMonths: 360 },
    relatedSlugs: ["piti-calculator", "affordability-calculator", "amortization-schedule"],
  },

  {
    calculator: "mortgage",
    slug: "home-affordability-calculator",
    title: "Home Affordability Calculator: How Much House Can I Afford",
    metaDescription:
      "Use our free home affordability calculator to see how much house you can afford. The 28/36 rule, your debt, and down payment all shape your budget.",
    targetKeyword: "home affordability calculator",
    estimatedVolume: 40000,
    estimatedKD: 52,
    h1: "Home Affordability Calculator: How Much House Can I Afford?",
    islandId: "affordability",
    intro:
      "This home affordability calculator estimates how much house you can afford based on your income, debts, down payment, and mortgage rate. Enter your numbers in the calculator above to see a target home price and monthly payment. Lenders weigh your income against your debts to decide what you can borrow. Knowing how much house you can afford before you shop keeps your search realistic and your budget safe.",
    howItWorks:
      "The calculator above applies the 28/36 rule, a common guideline lenders use to gauge affordability. Under this rule, your monthly housing payment should stay at or below 28% of your gross monthly income, and your total debt payments should stay at or below 36%. Your gross income is what you earn before taxes. The lower of these two limits sets your real budget.\n\nThe housing payment here means PITI, not just principal and interest. PITI stands for principal, interest, property taxes, and insurance. If your down payment is under 20%, lenders usually add private mortgage insurance (PMI), which raises the payment. Try our [down payment calculator](/mortgage/down-payment-calculator/) and [closing cost calculator](/mortgage/closing-cost-calculator/) to plan the cash you'll need up front.",
    commonMistakes: [
      "Budgeting for only principal and interest. Property taxes, insurance, and PMI are part of every payment and can add hundreds of dollars a month.",
      "Ignoring existing debt. A car loan or student loan payment shrinks your housing budget close to dollar for dollar under the 36% limit.",
      "Treating the lender's maximum as your target. Lenders may approve a debt-to-income ratio well above 36%, but a higher ratio leaves less room for emergencies.",
      "Using take-home pay instead of gross income. The 28/36 rule is based on income before taxes, so using net pay distorts the result.",
      "Forgetting closing costs and a cash cushion. Stretching your down payment to the limit can leave you short on move-in day and beyond.",
    ],
    workedExample:
      "Say you earn $90,000 a year, or $7,500 in gross monthly income. You pay $400 a month toward existing debt, have $40,000 for a down payment, and face a 6.5% rate on a 30-year loan. Under the 28% housing limit, your maximum monthly payment is $2,100. That is the binding limit here, so it sets your budget. With property tax near 1.1% and insurance around $1,800 a year, you can afford a home priced at about $287,000, with a loan of roughly $247,285. The $2,100 payment breaks down to about $1,563 in principal and interest, $263 in property tax, $150 in insurance, and $124 in PMI, since the down payment is under 20%.",
    faqs: [
      { question: "How does a home affordability calculator decide how much house I can afford?", answer: "A home affordability calculator applies the 28/36 rule to your income, debts, down payment, and rate. It caps your housing payment at 28% of gross monthly income and your total debt at 36%. The lower limit sets your maximum home price. It then includes taxes, insurance, and PMI to show a realistic monthly payment. Before you buy, [check your net worth](/net-worth/) to make sure you're financially ready." },
      { question: "What is the 28/36 rule?", answer: "The 28/36 rule says your monthly housing payment should stay at or below 28% of gross monthly income, and all your debt payments combined should stay at or below 36%. It is a guideline, not a law. Lenders use it to estimate how much you can comfortably borrow." },
      { question: "Can I get approved for more than the 28/36 rule allows?", answer: "Yes. Many lenders approve higher debt-to-income ratios. Fannie Mae allows up to 50% for some automated approvals. A higher ratio means a bigger payment and less cushion for emergencies, so the safer payment may be lower than the maximum you qualify for." },
      { question: "How does existing debt affect how much house I can afford?", answer: "Existing debt lowers your home budget close to dollar for dollar. The 36% total-debt limit covers your housing payment plus car loans, student loans, and credit cards. Every $100 in other monthly debt is $100 less you can spend on housing. Once you buy, our [mortgage payoff calculator](/mortgage/payoff-calculator/) shows how extra payments shorten your loan." },
    ],
    sources: [
      { label: "CFPB — What is a debt-to-income ratio?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/" },
      { label: "CFPB — Figure out how much you want to spend", url: "https://www.consumerfinance.gov/owning-a-home/prepare/figure-out-how-much-you-want-to-spend/" },
      { label: "Fannie Mae — Debt-to-Income Ratios (Selling Guide B3-6-02)", url: "https://selling-guide.fanniemae.com/sel/b3-6-02/debt-income-ratios" },
    ],
    toolHeading: "How much house can you afford?",
    toolSubheading: "Enter your income and debts — the tool uses the 28/36 rule to find your price.",
    preset: { kind: "home", annualIncome: 90000, monthlyDebts: 400, downPayment: 40000, interestRatePct: 6.5, loanTermYears: 30 },
    relatedSlugs: ["down-payment-calculator", "closing-cost-calculator", "payoff-calculator", "amortization-schedule"],
  },

  {
    calculator: "mortgage",
    slug: "down-payment-calculator",
    title: "Down Payment Calculator: How Much You Need (+ PMI)",
    metaDescription:
      "Use our down payment calculator to see how much cash you need, your loan amount, and whether putting under 20% down triggers PMI.",
    targetKeyword: "down payment calculator",
    estimatedVolume: 18000,
    estimatedKD: 44,
    h1: "Down Payment Calculator",
    islandId: "mortgage-extras",
    intro:
      "This down payment calculator shows how much cash you need to buy a home and whether your down payment will trigger private mortgage insurance (PMI). Enter your home price and down payment percent in the calculator above. It returns your down payment amount, your loan amount, and your loan-to-value (LTV) ratio. Here is a key surprise: you do not need 20% down. Conventional loans can go as low as 3%, and FHA loans start at 3.5%. But putting down less than 20% on a conventional loan usually means paying PMI until you build enough equity.",
    howItWorks:
      "The down payment calculator above uses two numbers: your home price and your down payment percent. It multiplies them to find your down payment in dollars. It then subtracts that from the price to show your loan amount. Finally, it divides the loan amount by the price to find your LTV ratio.\n\nLTV is the figure lenders watch most. A 20% down payment means an 80% LTV, which avoids PMI on a conventional loan. Anything under 20% down pushes your LTV above 80% and usually adds PMI. Once you have a price in mind, see how much you can borrow with the [home affordability calculator](/mortgage/home-affordability-calculator/), and budget the rest with the [closing cost calculator](/mortgage/closing-cost-calculator/). If you need outside help closing the gap, see [down payment assistance programs](/guides/down-payment-assistance-programs/) or your state's [first-time home buyer savings account](/guides/first-time-home-buyer-savings-account/).",
    commonMistakes: [
      "Assuming you must put 20% down. Conventional loans go as low as 3%, and FHA loans start at 3.5%. You can buy with far less.",
      "Forgetting that under 20% down usually means PMI. This extra cost is added to your monthly payment until you reach 20% equity.",
      "Budgeting only for the down payment. Closing costs are separate and due at the same time. Estimate them with the closing cost calculator.",
      "Treating PMI as permanent. You can request cancellation at 80% LTV, and it auto-terminates at 78% LTV under federal law.",
      "Draining all your savings into the down payment. Leave a cushion for moving, repairs, and emergencies after closing.",
    ],
    workedExample:
      "Say you are buying a $400,000 home and put 10% down. Your down payment is $40,000, leaving a loan amount of $360,000. That puts your loan-to-value ratio at 90%. Because that is under 20% down, PMI is likely. If you could put down $40,000 more, your total down payment would reach $80,000, or 20%. That larger down payment would avoid PMI and lower both your loan and your lifetime interest.",
    faqs: [
      { question: "How much down payment do I need?", answer: "It depends on your loan type. Conventional loans can require as little as 3% down, and FHA loans require at least 3.5%. Use the down payment calculator above to turn a percent into a dollar amount for your home price. A 20% down payment is the threshold that avoids PMI on a conventional loan, but it is not required to buy." },
      { question: "Does a down payment under 20% mean I pay PMI?", answer: "Usually, yes. On a conventional loan, a down payment under 20% means your loan-to-value is above 80%, so lenders typically require private mortgage insurance (PMI). PMI protects the lender, not you. It is added to your monthly payment until you build enough equity to remove it." },
      { question: "When can I stop paying PMI?", answer: "You can request PMI cancellation in writing once your balance is scheduled to reach 80% of the home's original value. Your servicer must also automatically terminate PMI at 78% of the original value, as long as you are current on payments. This rule comes from the federal Homeowners Protection Act." },
      { question: "Why does a bigger down payment cost less over time?", answer: "A bigger down payment lowers your loan amount, so you borrow less and pay interest on a smaller balance. Reaching 20% down also avoids PMI entirely. Together, that reduces both your monthly payment and the total interest you pay over the life of the loan." },
    ],
    sources: [
      { label: "CFPB — What is private mortgage insurance?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/" },
      { label: "CFPB — When can I remove PMI from my loan?", url: "https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/" },
      { label: "HUD — Minimum down payment requirement for FHA", url: "https://answers.hud.gov/FHA/s/article/What-is-the-minimum-down-payment-requirement-for-FHA" },
    ],
    toolHeading: "Calculate your down payment",
    toolSubheading: "See your down payment, loan amount, LTV, and whether PMI applies.",
    preset: { kind: "down-payment", homePrice: 400000, downPaymentPct: 10 },
    relatedSlugs: ["home-affordability-calculator", "closing-cost-calculator", "payoff-calculator", "amortization-schedule"],
  },

  {
    calculator: "mortgage",
    slug: "closing-cost-calculator",
    title: "Closing Cost Calculator: Estimate Your Total",
    metaDescription:
      "Use this closing cost calculator to estimate what you'll pay at closing. See typical 2-5% costs, what's included, and how to compare lender quotes.",
    targetKeyword: "closing cost calculator",
    estimatedVolume: 14000,
    estimatedKD: 43,
    h1: "Closing Cost Calculator",
    islandId: "mortgage-extras",
    intro:
      "This closing cost calculator shows roughly what you'll pay at the closing table to finish buying a home. Enter your home price in the calculator above to get an instant estimate. Closing costs typically run about 2% to 5% of the price. On a $400,000 home, that means roughly $8,000 to $20,000, with a typical bill near $12,000 (about 3%). These fees cover the loan, title work, taxes, and prepaid items. Here is the key point many buyers miss: closing costs are separate from and on top of your down payment. The calculator gives a planning estimate. Your official Loan Estimate from a lender holds the real numbers.",
    howItWorks:
      "The closing cost calculator above multiplies your home price by a typical percentage to estimate your total. It then splits that total into the main fee categories so you can see where the money goes. On a $400,000 home with a typical 3% estimate, that is about $12,000. The rough breakdown is loan origination near $2,400, appraisal and inspection near $800, title insurance and search near $2,000, recording and transfer taxes near $2,000, prepaid taxes and insurance near $2,000, and other lender and third-party fees near $2,800.\n\nUse the result as a budgeting guide, not a final bill. After you apply, the lender must give you a Loan Estimate within three business days. That form lists your real closing costs and your estimated cash to close. You can request Loan Estimates from several lenders and compare them side by side. You can also shop separately for some services, like title work, to save money. Plan the rest of your upfront cash with the [down payment calculator](/mortgage/down-payment-calculator/) and the [home affordability calculator](/mortgage/home-affordability-calculator/).",
    commonMistakes: [
      "Treating closing costs as part of the down payment. They are extra money you bring on top of it.",
      "Budgeting only for the loan fees. Title insurance, transfer taxes, and prepaid escrow items add up fast.",
      "Skipping the lender comparison. Requesting Loan Estimates from several lenders can lower your total.",
      "Assuming every fee is fixed. You can shop for some services, and sellers may cover part of the costs.",
      "Treating this estimate as the final number. Your Loan Estimate has the accurate figures, not a calculator.",
    ],
    workedExample:
      "Maya is buying a $400,000 home. The calculator above uses a typical 3% rate and estimates about $12,000 in closing costs. The breakdown shows loan origination near $2,400, appraisal and inspection near $800, title insurance and search near $2,000, recording and transfer taxes near $2,000, prepaid taxes and insurance near $2,000, and other fees near $2,800. Maya now knows this $12,000 is separate from her down payment. She also sees the range runs from $8,000 at 2% to $20,000 at 5%, so she requests Loan Estimates from three lenders to compare and shops for title services.",
    faqs: [
      { question: "How much are closing costs on a house?", answer: "Closing costs typically run about 2% to 5% of the home price. On a $400,000 home, that is roughly $8,000 to $20,000, with a typical bill near $12,000. The closing cost calculator above estimates your total based on your price." },
      { question: "What is included in closing costs?", answer: "Closing costs include loan origination fees, appraisal and inspection, title insurance and search, recording and transfer taxes, and prepaid taxes and insurance for your escrow account. On a typical $400,000 purchase, these categories together total about $12,000." },
      { question: "Are closing costs separate from the down payment?", answer: "Yes. Closing costs are separate from and paid on top of your down payment. The down payment goes toward the home price, while closing costs cover the loan, title, taxes, and prepaid items. Budget for both. You can plan your down payment with the [down payment calculator](/mortgage/down-payment-calculator/)." },
      { question: "Can I lower my closing costs?", answer: "Yes, you have options. You can shop separately for some services, like title work, to save money. You can also compare Loan Estimates from several lenders, and sellers may agree to pay part of the costs." },
      { question: "When do I get the real closing cost numbers?", answer: "Your lender must give you a Loan Estimate within three business days of your application. This form lists your actual closing costs and your estimated cash to close. The calculator above gives a planning estimate, but the Loan Estimate has the real figures." },
    ],
    sources: [
      { label: "CFPB — What fees are paid when closing on a mortgage, and who pays them?", url: "https://www.consumerfinance.gov/ask-cfpb/what-fees-or-charges-are-paid-when-closing-on-a-mortgage-and-who-pays-them-en-1845/" },
      { label: "CFPB — Loan Estimate explainer", url: "https://www.consumerfinance.gov/owning-a-home/loan-estimate/" },
      { label: "CFPB — Get to know loan costs", url: "https://www.consumerfinance.gov/owning-a-home/explore/learn-about-loan-costs/" },
    ],
    toolHeading: "Estimate your closing costs",
    toolSubheading: "Enter the home price for a typical estimate and a fee-by-fee breakdown.",
    preset: { kind: "closing-cost", homePrice: 400000 },
    relatedSlugs: ["down-payment-calculator", "home-affordability-calculator", "payoff-calculator", "amortization-schedule"],
  },
];
