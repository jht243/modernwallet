import type { FAQ, Source } from "./types";

// Long-form GUIDE pages — top-of-funnel "journey" content that threads multiple calculators
// together for a persona (home buyer, car buyer, pre-retiree). CONTENT via the keyword-gap
// write→audit workflow (CFPB/HUD/IRS/SSA/DOL primary sources). See CONTENT.md.

export interface GuideSection { heading: string; body: string; }
export interface GuideTool { href: string; label: string; }

export interface Guide {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  /** Short label + blurb for the guide index / cards. */
  cardBlurb: string;
  intro: string;
  sections: GuideSection[];
  /** The calculators this journey uses, shown as a "Tools for this journey" panel. */
  tools: GuideTool[];
  faqs: FAQ[];
  sources?: Source[];
}

export const GUIDES: Guide[] = [
  {
    slug: "first-time-home-buyer-guide",
    title: "First Time Home Buyer Guide: Steps to Buying a Home",
    metaDescription:
      "A clear first time home buyer guide: figure out affordability, save your down payment, budget closing costs, and check that you're financially ready.",
    h1: "First Time Home Buyer Guide: Your Step-by-Step Path to Buying",
    cardBlurb: "Affordability, down payment, closing costs, and getting financially ready — step by step.",
    intro:
      "This first time home buyer guide walks you through buying your first home one step at a time. You will learn how much house you can afford, how to save a down payment, and how to budget for closing costs. Each step links to a free ModernWallet calculator so you can run your own numbers. Take it slow, and check that you are financially ready before you buy.",
    sections: [
      { heading: "Step 1: Figure out how much house you can afford", body: "Start by working out a home price that fits your income and debts. Lenders look at your debt-to-income ratio, which is all your monthly debt payments divided by your gross monthly income. A common guideline is the 28/36 rule: keep housing costs near 28% of gross income and total debt near 36%.\n\nUse our [home affordability calculator](/mortgage/home-affordability-calculator/) to apply the 28/36 rule to your own numbers. It shows a realistic price range before you start shopping. Knowing your limit keeps you from falling for a home you cannot comfortably afford." },
      { heading: "Step 2: Save your down payment and understand PMI", body: "Your down payment is the cash you put toward the home price up front. A larger down payment lowers your loan and your monthly payment. When you put down less than 20% on a conventional loan, lenders require private mortgage insurance (PMI), which protects the lender, not you.\n\nSome loans need less cash to start. Conventional loans can go as low as 3% down, and FHA loans backed by HUD allow as little as 3.5%. Putting 20% down avoids PMI on a conventional loan. Use our [down payment calculator](/mortgage/down-payment-calculator/) to see how different amounts change your costs." },
      { heading: "Step 3: Budget for closing costs", body: "Closing costs are separate fees you pay to finalize the loan, on top of your down payment. They cover things like the appraisal, title insurance, taxes, and prepaid items such as homeowners insurance. These costs typically run about 2% to 5% of the loan amount.\n\nMany first-time buyers forget to budget for this cash. Your lender lists every fee on your Loan Estimate, so review it carefully. Use our [closing cost calculator](/mortgage/closing-cost-calculator/) to estimate this amount and avoid a surprise at the closing table." },
      { heading: "Step 4: Understand the monthly payment and paying it down", body: "Your monthly payment is more than just principal and interest. It often includes property taxes, homeowners insurance, and PMI if you put down less than 20%. Knowing the full payment helps you plan your budget honestly.\n\nPaying extra toward principal can shrink your loan years faster and save interest. Even small extra payments add up over time. Use our [mortgage payoff calculator](/mortgage/payoff-calculator/) to see how extra payments shorten your loan and cut total interest." },
      { heading: "Step 5: Make sure you're financially ready", body: "Being financially ready means more than affording the payment. You should have an emergency fund for repairs and a clear picture of your overall finances. Owning a home brings new costs, so a cash cushion protects you when something breaks.\n\nTracking your net worth shows whether you are on solid ground before you buy. It adds up what you own and subtracts what you owe. Use our [net worth calculator](/net-worth/) to check your full financial picture before you commit to a mortgage." },
    ],
    tools: [
      { href: "/mortgage/home-affordability-calculator/", label: "Home affordability" },
      { href: "/mortgage/down-payment-calculator/", label: "Down payment" },
      { href: "/mortgage/closing-cost-calculator/", label: "Closing costs" },
      { href: "/mortgage/payoff-calculator/", label: "Mortgage payoff" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "What is the first step for a first time home buyer?", answer: "The first step is figuring out how much house you can afford. Review your income, debts, and credit before you shop. Lenders weigh your debt-to-income ratio, so knowing your budget early keeps your search realistic and your finances safe." },
      { question: "How much do I need for a down payment?", answer: "You may need far less than 20%. Conventional loans can allow as little as 3% down, and FHA loans backed by HUD allow as little as 3.5%. Putting 20% down on a conventional loan lets you avoid private mortgage insurance (PMI)." },
      { question: "What is PMI and how do I avoid it?", answer: "PMI is private mortgage insurance that protects the lender, not you. On a conventional loan, it is required when your down payment is under 20%. You avoid it by putting at least 20% down, which removes the PMI requirement." },
      { question: "How much are closing costs?", answer: "Closing costs typically run about 2% to 5% of the loan amount. They are separate from your down payment and cover fees like the appraisal, title insurance, and taxes. Your Loan Estimate lists each fee before closing." },
      { question: "What is the 28/36 rule?", answer: "The 28/36 rule is a common affordability guideline. It suggests keeping housing costs at or below 28% of your gross monthly income and total debt at or below 36%. Lenders use your debt-to-income ratio to judge how much you can borrow." },
      { question: "How do I know if I'm financially ready to buy?", answer: "You are likely ready when you can afford the full monthly payment, have an emergency fund, and a positive net worth. Homeownership adds costs like repairs and insurance, so a cash cushion matters as much as qualifying for the loan." },
    ],
    sources: [
      { label: "CFPB — Buying a House: Prepare to Shop", url: "https://www.consumerfinance.gov/owning-a-home/process/prepare/" },
      { label: "CFPB — What is private mortgage insurance?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/" },
      { label: "CFPB — Your Home Loan Toolkit", url: "https://www.consumerfinance.gov/owning-a-home/explore/home-loan-toolkit/" },
    ],
  },

  {
    slug: "how-to-buy-a-car",
    title: "How to Buy a Car: A Step-by-Step Car Buying Guide",
    metaDescription:
      "Learn how to buy a car the smart way. This car buying guide walks you through budget, financing, interest, payoff, and the traps to avoid.",
    h1: "How to Buy a Car: A Smart Step-by-Step Guide",
    cardBlurb: "Set a real budget, get preapproved, know the interest, and dodge the dealership traps.",
    intro:
      "Learning how to buy a car starts with one idea: the sticker price is not the real price. This car buying guide walks you through each step, from setting a budget to signing the loan. You will learn what a car truly costs and how to avoid the most common traps. Run the numbers yourself at every stage with the free tools linked below.",
    sections: [
      { heading: "Step 1: Set a realistic budget before you shop", body: "Your car budget should cover far more than the monthly payment. A common rule is 20/4/10: put 20% down, finance for no more than four years, and keep total car costs under 10% of your income. The CFPB warns that the true cost of ownership also includes insurance, registration, gas, maintenance, and repairs.\n\nFigure out a safe price range before you fall in love with a car. Use our [car affordability calculator](/auto-loan/car-affordability-calculator/) to see what you can comfortably spend. Knowing your ceiling keeps you from stretching the loan to fit the car." },
      { heading: "Step 2: Get preapproved and understand the loan", body: "Getting preapproved before you visit a dealer puts you in control. A preapproval is a loan offer from a bank or credit union that lists your rate, term, and maximum amount. The CFPB recommends getting preapproved so you can shop around and compare it against any dealer financing.\n\nFour things shape every car loan: the price, your down payment, the interest rate, and the loan term. Change any one and the payment moves. Test different combinations with our [auto loan calculator](/auto-loan/) so you know your numbers before you negotiate." },
      { heading: "Step 3: Know what the interest really costs", body: "Interest is the price you pay to borrow, and it adds up quietly over the years. The CFPB advises comparing the APR and total amount financed, not just the monthly payment. A lower payment often hides a higher total cost.\n\nSee exactly how much interest you would pay over the life of a loan with our [auto loan interest calculator](/auto-loan/interest-calculator/). When you can see the full interest cost, a slightly higher payment on a shorter loan often looks like the better deal." },
      { heading: "Step 4: Plan to pay it off faster and save", body: "Paying extra each month shrinks both your loan and your total interest. Because interest is charged on the balance you still owe, lowering that balance sooner saves real money. Even small extra payments can shorten the loan by months.\n\nBefore you sign, model a faster payoff with our [auto loan payoff calculator](/auto-loan/payoff-calculator/). It shows how added payments cut your interest and free you from the loan early. Confirm there is no prepayment penalty in your contract first." },
      { heading: "Step 5: Avoid the traps at the dealership", body: "The biggest mistakes happen at signing, not on the test drive. Long loan terms lower the payment but raise total interest and can leave you owing more than the car is worth, a problem called negative equity. The CFPB notes that dealers may mark up your interest rate, so your preapproval is your bargaining chip.\n\nThe FTC says to focus on the total out-the-door price in writing, including every fee and add-on, rather than the monthly payment. You can say no to add-ons like extended warranties or paint protection. Recheck the final deal against our [auto loan calculator](/auto-loan/) before you sign anything." },
    ],
    tools: [
      { href: "/auto-loan/car-affordability-calculator/", label: "Car affordability" },
      { href: "/auto-loan/", label: "Auto loan" },
      { href: "/auto-loan/interest-calculator/", label: "Auto loan interest" },
      { href: "/auto-loan/payoff-calculator/", label: "Auto loan payoff" },
    ],
    faqs: [
      { question: "How do I buy a car the smart way?", answer: "Buy a car by working backward from a realistic budget, not from the sticker price. Set your spending limit, get preapproved by a bank or credit union, compare that offer to dealer financing, and focus on the total out-the-door price. Avoid stretching the loan term just to lower the monthly payment." },
      { question: "How much car can I afford?", answer: "You can generally afford a car when your total car costs stay under 10% of your monthly income. A common guideline is the 20/4/10 rule: 20% down, a loan of four years or less, and under 10% of income for all car expenses. Remember to include insurance, gas, and maintenance, not just the payment." },
      { question: "Should I get preapproved before going to the dealer?", answer: "Yes, getting preapproved before you shop is one of the smartest steps in buying a car. A preapproval gives you a firm rate and amount to compare against dealer financing. The CFPB recommends it so you can negotiate from a position of strength and avoid an inflated dealer interest rate." },
      { question: "Is a longer car loan term a bad idea?", answer: "A longer car loan term usually costs you more, even though the monthly payment is smaller. The CFPB notes that longer loans mean more total interest and a higher chance of owing more than the car is worth. Keeping the loan to five years or less limits both risks." },
      { question: "What is the out-the-door price?", answer: "The out-the-door price is the full amount you pay for a car, including taxes, fees, and any add-ons. The FTC recommends getting this total in writing before you visit the lot. It lets you compare dealers fairly and catch extra charges hidden behind a low monthly payment." },
      { question: "Can I say no to dealer add-ons?", answer: "Yes, you can decline dealer add-ons like extended warranties, paint protection, or gap insurance. The FTC states that dealers cannot charge you for add-ons you did not agree to. Saying no keeps these optional extras from inflating your total cost." },
    ],
    sources: [
      { label: "CFPB — How do I compare auto loan offers?", url: "https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/" },
      { label: "CFPB — Buying a car? Here's what you need to know", url: "https://www.consumerfinance.gov/about-us/blog/buying-a-car-heres-what-you-need-to-know/" },
      { label: "FTC — Financing or Leasing a Car", url: "https://consumer.ftc.gov/financing-or-leasing-car" },
    ],
  },

  {
    slug: "am-i-ready-to-retire",
    title: "Am I Ready to Retire? Your Retirement Readiness Guide",
    metaDescription:
      "Am I ready to retire? Walk through five steps to test your retirement readiness, from savings projections to RMDs and Social Security timing.",
    h1: "Am I Ready to Retire? A Step-by-Step Retirement Readiness Guide",
    cardBlurb: "Five steps to test if your money lasts — projections, 401(k), net worth, withdrawals, and timing.",
    intro:
      "You are ready to retire when your savings, income, and spending plan can support you for life. This retirement readiness guide walks you through five clear steps to test that. You will project whether your money lasts, maximize savings, check your net worth, plan withdrawals, and dodge timing risks. Each step links a free calculator so you can run your own numbers.",
    sections: [
      { heading: "Step 1: Project whether your savings will last", body: "Start by projecting whether your savings will last through retirement. This is the core test of retirement readiness. You need to know your expected balance at retirement and how long it can fund your spending.\n\nA common starting point is the 4% guideline. It suggests withdrawing about 4% of your balance in year one, then adjusting for inflation. Run your own numbers with our [retirement calculator](/retirement/) to see if your projected balance covers your needs. The Department of Labor notes that retirees often need 70% to 90% of their pre-retirement income to keep their standard of living." },
      { heading: "Step 2: Maximize your 401(k) before you stop working", body: "Maximizing your 401(k) in your final working years can sharply boost your readiness. Every extra dollar saved now has years to grow before you retire.\n\nFor 2026, the IRS lets you contribute up to $24,500 to a 401(k). If you are 50 or older, you can add an $8,000 catch-up, for $32,500 total. See how these limits change your outcome with our [401k calculator](/retirement/401k-calculator/). Always contribute at least enough to capture your full employer match. That match is free money you should not leave behind." },
      { heading: "Step 3: Know your total net worth heading in", body: "Your net worth is the clearest snapshot of your financial standing before retirement. It equals everything you own minus everything you owe.\n\nAdd up your retirement accounts, home equity, cash, and other assets. Then subtract debts like a mortgage, car loans, and credit cards. Our [net worth calculator](/net-worth/) does the math for you in minutes. Knowing this number helps you spot gaps early, and it shows which assets you can actually draw on for income." },
      { heading: "Step 4: Plan your withdrawals and the RMD rules at 73", body: "A smart withdrawal plan decides which accounts you tap and when. The order affects your taxes and how long your money lasts.\n\nThe IRS also forces withdrawals at a certain age. You must begin required minimum distributions (RMDs) from traditional IRAs and 401(k)s in the year you turn 73. Your first RMD can wait until April 1 of the next year, but later ones are due each December 31. Roth IRAs have no RMDs during your lifetime. Estimate your required amount with our [RMD calculator](/retirement/rmd-calculator/). Missing an RMD can trigger a steep penalty, so plan these withdrawals carefully." },
      { heading: "Step 5: Watch the timing risks", body: "Timing risks can quietly shrink a retirement that looks ready on paper. Four deserve close attention before you leave work.\n\nFirst is your Social Security claiming age. With a full retirement age of 67, claiming at 62 cuts your monthly benefit by about 30%, while waiting until 70 raises it to 124%. Second is sequence-of-returns risk: poor market returns in your first few retirement years can do lasting damage. Third, withdrawing from most retirement accounts before age 59½ usually adds a 10% early-withdrawal penalty. Fourth is healthcare before Medicare starts at 65, since you must bridge that coverage gap yourself." },
    ],
    tools: [
      { href: "/retirement/", label: "Retirement" },
      { href: "/retirement/401k-calculator/", label: "401(k)" },
      { href: "/net-worth/", label: "Net worth" },
      { href: "/retirement/rmd-calculator/", label: "RMD" },
    ],
    faqs: [
      { question: "How do I know if I am ready to retire?", answer: "You are ready to retire when your savings and guaranteed income can cover your expenses for life. Test your retirement readiness by projecting your balance, checking your net worth, and planning withdrawals. The Department of Labor suggests aiming for 70% to 90% of your pre-retirement income." },
      { question: "At what age are required minimum distributions required?", answer: "Required minimum distributions begin at age 73. You must take your first RMD from traditional IRAs and most workplace plans in the year you turn 73. You can delay that first withdrawal until April 1 of the following year. Roth IRAs do not require distributions during your lifetime." },
      { question: "What is the full retirement age for Social Security?", answer: "The full retirement age is 67 for anyone born in 1960 or later. Claiming at 62 reduces your monthly benefit by about 30%. Waiting until age 70 increases it to 124% of your full benefit. Your claiming age is one of the biggest retirement timing decisions." },
      { question: "How much can I contribute to my 401(k) in 2026?", answer: "You can contribute up to $24,500 to a 401(k) in 2026. If you are 50 or older, you can add an $8,000 catch-up for $32,500 total. Always contribute enough to capture your full employer match first." },
      { question: "What is sequence-of-returns risk?", answer: "Sequence-of-returns risk is the danger of poor investment returns early in retirement. Big losses in your first few years, combined with withdrawals, can permanently reduce how long your money lasts. The same average return in a different order of years can produce very different outcomes." },
      { question: "What happens if I withdraw retirement funds before 59½?", answer: "Withdrawing from most retirement accounts before age 59½ usually triggers a 10% early-withdrawal penalty plus income tax. Some exceptions apply, but the penalty can meaningfully cut your savings. Planning your withdrawal timing helps you avoid this cost." },
    ],
    sources: [
      { label: "IRS — Required Minimum Distributions (RMDs)", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds" },
      { label: "IRS — 401(k) limit increases to $24,500 for 2026", url: "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500" },
      { label: "SSA — Retirement Age and Benefit Reduction", url: "https://www.ssa.gov/benefits/retirement/planner/agereduction.html" },
      { label: "DOL — Top 10 Ways to Prepare for Retirement", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/top-10-ways-to-prepare-for-retirement" },
    ],
  },
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
