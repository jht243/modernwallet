import type { CalculatorDef, SpokeEntry } from "./types";
import { SPOKES } from "./spokes";
import { LIVE_IDS } from "./registry";

// The 7 calculator hubs. Each targets a head term; its spokes (in src/data/spokes*.ts) target the
// winnable long-tail. A calculator is "live" (gets built pages) only once its island is registered
// in src/components/islands.ts — until then it shows on the home page as upcoming.

export const CALCULATORS: CalculatorDef[] = [
  {
    id: "auto-loan",
    islandId: "auto-loan",
    label: "Auto Loan",
    navOrder: 1,
    metaTitle: "Auto & Car Loan Calculator: Estimate Loan Payment",
    metaDescription:
      "Use our free auto & car loan calculator to estimate your monthly payment, total interest, and the true cost of financing a vehicle in 2026.",
    targetKeyword: "auto loan calculator",
    h1: "Auto Loan Calculator",
    intro:
      "An auto loan calculator estimates your monthly car payment and the total cost of financing a vehicle. The calculator above does this in seconds. Enter the vehicle price, your down payment, the interest rate (APR), and the loan term to see your numbers. For example, a $35,000 car with $5,000 down at 7.5% APR over 60 months gives a $601.14 monthly payment.",
    howItWorks:
      "Your monthly car payment is set by three things: the loan amount, the APR, and the loan term. The loan amount is the price minus your down payment and trade-in. In the example above, $35,000 minus $5,000 down leaves a $30,000 loan.\n\nEach payment is split between interest and principal through a process called amortization. Early on, more of your money goes to interest. In month one, the $601.14 payment splits into $187.50 of interest and $413.64 of principal. Over the full 60 months, you pay $6,068 in interest, for a total of $36,068.\n\nTo see the full month-by-month breakdown, use the [auto loan amortization calculator](/auto-loan/amortization-schedule/). To see how a higher payment cuts your interest, try the [auto loan extra payment calculator](/auto-loan/extra-payment-calculator/).",
    faqs: [
      {
        question: "What is a good interest rate on an auto loan in 2026?",
        answer:
          "A good rate depends on your credit and whether the car is new or used. In mid-2025, the average new-car APR was about 6.8%, and the average used-car APR was about 11.5%, according to Experian. Borrowers with strong credit often qualify for rates below these averages. Always compare offers from a bank or credit union before you visit the dealer.",
      },
      {
        question: "How does this auto loan calculator estimate my payment?",
        answer:
          "The auto loan calculator uses your loan amount, APR, and term to compute a fixed monthly payment. It applies a standard amortization formula, the same math lenders use. The result shows your principal and interest payment. It does not include taxes, registration, or insurance, so budget extra for those costs.",
      },
      {
        question: "Should I choose a longer loan term to lower my payment?",
        answer:
          "A longer term lowers your monthly payment but raises the total interest you pay. Stretching a loan to 72 or 84 months also raises the risk of owing more than the car is worth. This is called being underwater. A shorter term costs more each month but saves money overall. As a rule, pick the shortest term you can comfortably afford.",
      },
      {
        question: "What is a common dealer financing trap to avoid?",
        answer:
          "Watch out for dealer interest rate markup. When a dealer arranges your loan, they can add a markup to the lender's rate and keep the difference. This can cost you hundreds or thousands over the loan. Get a pre-approved rate from your own bank or credit union first. The CFPB confirms your auto loan terms are negotiable, so use that outside offer as leverage.",
      },
      {
        question: "How much does a bigger down payment help?",
        answer:
          "A bigger down payment lowers your loan amount, which lowers both your payment and your total interest. It also reduces the risk of going underwater on the loan. Many buyers aim for at least 20% down on a new car and 10% on a used car. Even a small increase in your down payment can save you money over the life of the loan.",
      },
      {
        question: "Can I save money by paying off my car loan early?",
        answer:
          "Yes, paying early reduces the total interest you pay, since interest is charged on your remaining balance. Even small extra payments toward principal can shorten your loan. First, confirm your lender has no prepayment penalty. To run the numbers, use the [pay off car loan early calculator](/auto-loan/early-payoff-calculator/), the [auto loan payoff calculator](/auto-loan/payoff-calculator/), or the [auto loan interest calculator](/auto-loan/interest-calculator/).",
      },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — Auto Loans", url: "https://www.consumerfinance.gov/consumer-tools/auto-loans/" },
      { label: "CFPB — What is a dealer markup?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-dealer-markup-en-799/" },
      { label: "Experian — Auto Loan Rates and Financing", url: "https://www.experian.com/blogs/ask-experian/auto-loan-rates-financing/" },
    ],
    defaultPreset: {
      vehiclePrice: 35000,
      downPayment: 5000,
      tradeInValue: 0,
      tradeInOwed: 0,
      cashIncentives: 0,
      salesTaxPct: 0,
      titleFees: 0,
      includeTaxesFees: false,
      interestRatePct: 7.5,
      loanTermMonths: 60,
      extraMonthlyPayment: 0,
    },
  },

  {
    id: "mortgage",
    islandId: "mortgage", // not yet registered → "upcoming" until Phase 2
    label: "Mortgage",
    navOrder: 2,
    metaTitle: "Mortgage Payment Calculator: Home Loan Estimator",
    metaDescription:
      "Use our free mortgage payment calculator to estimate your monthly principal and interest, see your full amortization, and learn how a home loan really works.",
    targetKeyword: "mortgage calculator",
    h1: "Mortgage Calculator",
    intro:
      "This mortgage calculator estimates the monthly principal and interest (P&I) payment on a home loan and shows the full amortization schedule. Enter your home price, down payment, interest rate, and term in the calculator above to see your number instantly. You can also add property taxes and homeowners insurance to see your full monthly payment, known as PITI (principal, interest, taxes, and insurance) — the number that actually hits your bank account.",
    howItWorks:
      "A mortgage calculator works by spreading your loan amount over the term at a fixed interest rate, then solving for the level monthly payment. Take a common 2026 example: a $400,000 home with $80,000 down leaves a $320,000 loan. At a 6.5% APR over 30 years, the monthly P&I payment is $2,022.62.\n\nHere is the part most buyers miss. In month one, $1,733.33 of that payment goes to interest and only $289.28 goes to principal. Early payments are almost all interest, and principal builds slowly. Over the full 30 years you would pay $408,142 in interest, bringing the total of payments to $728,142. That is why even small extra payments early on can save so much.",
    faqs: [
      {
        question: "How do I use this mortgage calculator?",
        answer:
          "Enter your home price, down payment, interest rate, and loan term in the calculator above. It instantly returns your monthly principal and interest payment and a full amortization schedule. For a $320,000 loan at 6.5% over 30 years, the monthly P&I is $2,022.62.",
      },
      {
        question: "What is the difference between P&I and PITI?",
        answer:
          "P&I is principal and interest only, the part this calculator computes. PITI adds property taxes and insurance, and your real monthly payment is PITI, not P&I. Lenders collect taxes and insurance through an escrow account on top of P&I, so your actual bill will be higher than the number shown above. The CFPB explains how escrow accounts pay these property-related expenses.",
      },
      {
        question: "Does this calculator include PMI?",
        answer:
          "No, this calculator does not include private mortgage insurance (PMI). According to the CFPB, PMI is required on a conventional loan when your down payment is under 20 percent, and it protects the lender, not you. PMI is an extra monthly cost on top of the P&I shown above until you reach 20 percent equity.",
      },
      {
        question: "What is the current 30-year mortgage rate?",
        answer:
          "The average 30-year fixed mortgage rate was 6.49% as of June 25, 2026, according to Freddie Mac. Rates change weekly, so use today's quoted rate in the calculator above for an accurate estimate. A small rate change moves your payment more than most people expect.",
      },
      {
        question: "Why does so little of my early payment go to principal?",
        answer:
          "Early payments are almost all interest because interest is charged on your full remaining balance. In month one of a $320,000 loan at 6.5%, $1,733.33 goes to interest and just $289.28 reduces principal. The balance shrinks slowly at first, then principal accelerates over time. See the full breakdown with our [mortgage amortization calculator](/mortgage/amortization-schedule/).",
      },
      {
        question: "How can I pay off my mortgage faster?",
        answer:
          "Adding extra money to your monthly payment goes straight to principal and shortens your loan. Because early payments are mostly interest, extra principal early saves the most interest over the life of the loan. Run the numbers with our [mortgage extra payment calculator](/mortgage/extra-payment-calculator/), [pay off mortgage early calculator](/mortgage/early-payoff-calculator/), and [mortgage payoff calculator](/mortgage/payoff-calculator/).",
      },
    ],
    sources: [
      { label: "Freddie Mac — Primary Mortgage Market Survey (current rates)", url: "https://www.freddiemac.com/pmms" },
      { label: "CFPB — What is private mortgage insurance (PMI)?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/" },
      { label: "CFPB — What is an escrow or impound account?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-an-escrow-or-impound-account-en-140/" },
    ],
    defaultPreset: {
      vehiclePrice: 400000, // reuses the auto-loan engine: "price" = home price
      downPayment: 80000,
      interestRatePct: 6.5,
      loanTermMonths: 360,
      extraMonthlyPayment: 0,
      propertyTaxAnnual: 4400, // ~1.1% of $400k — showcases PITI
      homeInsuranceAnnual: 1800,
    },
  },

  {
    id: "retirement",
    islandId: "retirement",
    label: "Retirement",
    navOrder: 3,
    metaTitle: "Retirement Calculator: Are You On Track to Retire?",
    metaDescription:
      "Use our free retirement calculator to see how much you'll have saved, what you can spend each year, and whether your money lasts through retirement.",
    targetKeyword: "retirement calculator",
    h1: "Retirement Calculator: See If You're On Track",
    intro:
      "This retirement calculator estimates how much you'll have saved by your target retirement age and whether that money will last. Enter your age, current savings, monthly contribution, and expected return in the calculator above to see your projected nest egg. It also shows your balance in today's dollars, so inflation doesn't fool you. For example, a 35-year-old saving $500 a month could reach about $1,097,072 by age 67.",
    howItWorks:
      "The retirement calculator works in two stages: it grows your savings until retirement, then estimates how much you can safely withdraw each year. During the saving years, it compounds your current balance plus monthly contributions at a fixed annual return you choose. In our example saver's case (age 35, $50,000 saved, $500/month, 7% return), the balance grows to $1,097,072 by age 67. The striking part is the source of that money: your $50,000 starting balance plus $192,000 of new contributions add up to $242,000 you put in. Compound growth adds the other $855,072, so time does the heavy lifting.\n\nFor spending, the calculator applies the 4% rule. It withdraws 4% of your balance in year one, which is $43,883 (about $3,657 per month) for our example. At that rate, the savings last through age 95. The 4% rule is a planning guideline, not a guarantee. To go deeper, try our [retirement savings calculator](/retirement/retirement-savings-calculator/), or model your workplace plan with the [401k calculator](/retirement/401k-calculator/). If the numbers feel high-stakes and you want a professional second opinion, our guide on [how to choose a financial advisor](/guides/how-to-choose-a-financial-advisor/) walks through fiduciary status, fees, and credentials.",
    faqs: [
      { question: "How much will I have when I retire?", answer: "It depends on your savings, contributions, return, and time. The retirement calculator above projects your total. In our example, a 35-year-old saving $500 a month at a 7% return reaches $1,097,072 by age 67, which is about $426,034 in today's dollars." },
      { question: "How much of my retirement balance comes from compound growth?", answer: "Most of it, if you start early. In our example, you start with $50,000 and add $192,000 in contributions, for $242,000 of your own money. Investment growth adds $855,072 more, reaching $1,097,072. Compounding does far more work than your contributions alone." },
      { question: "Will my retirement savings last?", answer: "Often yes, if you withdraw at a careful rate. The calculator uses the 4% rule, taking 4% in year one. In our example that is $43,883, about $3,657 a month, and the savings last through age 95. The 4% rule is a guideline, not a guarantee." },
      { question: "What is the 4% rule?", answer: "The 4% rule is a guideline that says you can withdraw about 4% of your savings in your first year of retirement. It is an assumption built into this calculator, not a promise. Market returns, inflation, and how long you live can all change the outcome." },
      { question: "When do I have to start withdrawing from my retirement accounts?", answer: "Age 73 for most accounts. The IRS requires minimum distributions (RMDs) from traditional IRAs and 401(k)s starting at age 73. Roth IRAs are exempt while you are alive. Use our [RMD calculator](/retirement/rmd-calculator/) to estimate your required amount." },
      { question: "What if I withdraw from my 401(k) early?", answer: "Early 401(k) withdrawals before age 59½ usually trigger a 10% IRS penalty plus income tax. This shrinks your retirement balance and its future growth. Estimate the cost first with our [401k early withdrawal calculator](/retirement/401k-early-withdrawal-calculator/), and see our [tax tips guide](/guides/tax-tips/) for legal ways to reduce the bracket that penalty stacks on top of." },
    ],
    sources: [
      { label: "IRS — 401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500", url: "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500" },
      { label: "IRS — Retirement Topics: Required Minimum Distributions (RMDs)", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds" },
      { label: "Social Security Administration — Full Retirement Age", url: "https://www.ssa.gov/benefits/retirement/planner/agereduction.html" },
    ],
    defaultPreset: { mode: "projection", currentAge: 35, retirementAge: 67, currentSavings: 50000, monthlyContribution: 500, annualReturnPct: 7, inflationPct: 3, lifeExpectancy: 95 },
  },

  {
    id: "investing",
    islandId: "investing",
    label: "Investing",
    navOrder: 4,
    metaTitle: "Investment Calculator: Project Your Growth",
    metaDescription:
      "Use our free investment calculator to project how your money grows with regular contributions, compounding, and time. See your future balance fast.",
    targetKeyword: "investment calculator",
    h1: "Investment Calculator",
    intro:
      "This investment calculator projects how your money could grow over time with a starting balance, regular contributions, and a chosen annual return. Just enter your numbers in the calculator above to see your estimated future balance. For example, $10,000 plus $500 a month at a 7% annual return grows to about $300,851 over 20 years. You put in $130,000, while compounding adds $170,851 in growth.",
    howItWorks:
      "The investment calculator above multiplies your contributions by a fixed annual return that compounds monthly. You provide a starting balance, a monthly contribution, an annual return rate, and a number of years. The tool then projects your ending balance and splits it into what you contributed versus what growth added.\n\nHere is the key insight: in the example above, growth of $170,851 is larger than the $130,000 you contributed. Compounding means you earn returns on past returns, so over time growth can overtake your own deposits. The earlier you start, the bigger this effect becomes. This is an estimate — the calculator assumes one fixed annual return, but real markets rise and fall, so actual results will vary. Explore the [compound interest calculator](/investing/compound-interest-calculator/) and [investment growth calculator](/investing/investment-growth-calculator/) to go deeper.\n\nInvestment basics start with three building blocks. A stock is partial ownership in one company. An ETF holds a basket of stocks (or bonds) and trades like a single stock during market hours. An index fund tracks a benchmark like the S&P 500 and simply owns what the index owns — that is why fees are lower. Where you hold them matters too: a taxable brokerage account gives full flexibility but taxes gains each year, while a retirement account (401(k), IRA) defers or eliminates tax but locks the money until age 59½. The SEC's investor.gov guide recommends using tax-advantaged accounts first, then a brokerage for extra savings.\n\nHow to invest in stocks — a 4-step starter framework. First, open a brokerage or IRA account at a low-fee provider (no minimum, no trade commissions on stocks and ETFs). Second, buy a broad, low-cost S&P 500 or total-market index fund — one purchase gives you exposure to hundreds of companies. Third, automate contributions on payday so investing happens before you can spend the money. Fourth, ignore the daily headlines; the S&P 500 has returned about 10% a year on average since 1957 despite dozens of scary drawdowns along the way. Use the [S&P 500 calculator](/investing/sp500-calculator/) to see what a steady contribution schedule would have produced. If you'd rather delegate the plan than DIY it, read our guide on [how to choose a financial advisor](/guides/how-to-choose-a-financial-advisor/) before you sign anywhere.\n\nInvestment strategies worth knowing. Buy-and-hold owns the market long term and skips timing decisions. [Dollar-cost averaging](/investing/dollar-cost-averaging-calculator/) invests the same amount on a fixed schedule, which buys more shares when prices fall and fewer when they rise. Tax-advantaged prioritization means filling accounts in this order: employer 401(k) up to the match, then Roth or traditional IRA, then more 401(k), then a taxable brokerage. The order captures free money and tax breaks before flexibility. Once your accounts are funded, dividend-paying funds and interest-bearing accounts can become steady [passive income streams](/guides/passive-income-ideas/) that complement earned income.",
    faqs: [
      { question: "What is an investment calculator?", answer: "An investment calculator is a tool that projects how your money grows over time. You enter a starting amount, regular contributions, an annual return, and a time period. It then estimates your future balance and how much of it comes from growth versus your own deposits." },
      { question: "How accurate is this investment calculator?", answer: "The calculator gives an estimate, not a guarantee. It assumes one fixed annual return that compounds monthly. Real investment returns change year to year, so your actual balance could be higher or lower than the projection." },
      { question: "Why does growth eventually exceed my contributions?", answer: "Growth exceeds contributions because of compounding. You earn returns on your money and on past returns too. In the example above, $130,000 in deposits produced $170,851 in growth over 20 years, so growth outpaced what you put in." },
      { question: "Why does starting early matter so much?", answer: "Starting early matters because compounding needs time to build. The longer your money stays invested, the more returns stack on top of past returns. FINRA notes that even small investments can grow over time and benefit from compounding." },
      { question: "Which calculator should I use next?", answer: "Pick the tool that matches your goal. Try the [compound interest calculator](/investing/compound-interest-calculator/), the [investment growth calculator](/investing/investment-growth-calculator/), the [high yield savings calculator](/investing/high-yield-savings-calculator/), or the [savings goal calculator](/investing/savings-goal-calculator/). See all our [free financial calculators](/calculators/)." },
    ],
    sources: [
      { label: "SEC Investor.gov — Compound Interest Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" },
      { label: "SEC Investor.gov — Save and Invest", url: "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest" },
      { label: "FINRA — Financial Tips for New Investors", url: "https://www.finra.org/investors/insights/tips-new-investors" },
    ],
    defaultPreset: { currentBalance: 10000, monthlyContribution: 500, annualReturnPct: 7, years: 20 },
  },

  {
    id: "portfolio",
    islandId: "portfolio",
    label: "Portfolio",
    navOrder: 5,
    metaTitle: "Portfolio Calculator: Return, Risk & Growth",
    metaDescription:
      "Free portfolio calculator: enter your stocks, bonds, real estate, and cash to estimate expected return, risk, Sharpe ratio, and long-term growth.",
    targetKeyword: "portfolio calculator",
    h1: "Portfolio Calculator",
    intro:
      "This portfolio calculator estimates your investment mix's expected return, risk, and long-term growth from how your money is split across stocks, bonds, real estate, and cash. Enter your holdings in the calculator above to see your projected return, volatility, and Sharpe ratio in seconds. The figures use long-run historical averages as model assumptions, so treat them as estimates, not guarantees. Use it to test how shifting your asset mix changes the balance between reward and risk.",
    howItWorks:
      "The portfolio calculator turns your asset mix into three core numbers: expected return, volatility, and the Sharpe ratio. Expected return is the weighted average of each asset class's long-run estimate. Volatility measures how much your value may swing year to year, and it accounts for how assets move together. Because stocks and bonds often move differently, holding both lowers volatility more than it lowers return. That is diversification, sometimes called the only free lunch in investing.\n\nThe Sharpe ratio equals expected return minus the 2.5% risk-free rate, divided by volatility, so it rewards return per unit of risk. A 100% stock mix has a higher expected return but usually a worse Sharpe ratio than a diversified mix. Take a balanced $100,000 portfolio of $60,000 stocks, $30,000 bonds, and $10,000 cash, contributing $500 a month. It shows a 7.45% expected return, 9.87% volatility, and a 0.50 Sharpe ratio. These outputs rest on model assumptions drawn from historical averages, so they are estimates, not promises of future results. Dig deeper with the [asset allocation calculator](/portfolio/asset-allocation-calculator/) and the [portfolio risk calculator](/portfolio/portfolio-risk-calculator/).",
    faqs: [
      { question: "What does this portfolio calculator do?", answer: "This portfolio calculator analyzes your asset mix to estimate expected return, risk, and long-term growth. You enter how much you hold in stocks, bonds, real estate, and cash. It then returns a weighted expected return, a portfolio volatility figure, and a Sharpe ratio. To go deeper on any one piece, try the [asset allocation calculator](/portfolio/asset-allocation-calculator/) or the [expected return calculator](/portfolio/expected-return-calculator/)." },
      { question: "How does diversification lower my risk?", answer: "Diversification lowers risk by spreading money across assets that do not move together. The SEC notes that diversification can limit losses when one investment falls but others hold up. Because stocks and bonds often move in different directions, a blended portfolio swings less than a single asset class. This is why volatility can drop more than expected return, giving you a better risk-adjusted result." },
      { question: "What is a good Sharpe ratio?", answer: "A higher Sharpe ratio is better because it means more return per unit of risk. The example balanced portfolio above shows a Sharpe ratio of 0.50. A 100% stock mix may earn a higher expected return but often posts a lower Sharpe ratio, since its risk rises faster than its reward. Use the [portfolio risk calculator](/portfolio/portfolio-risk-calculator/) to compare risk-adjusted results across mixes." },
      { question: "Are the return and risk figures guaranteed?", answer: "No, the figures are estimates, not guarantees. They use long-run historical averages as model assumptions, such as 10% expected return for stocks and 4% for bonds. Real markets vary widely from year to year, and past performance does not predict future results. In the example, a typical year for the balanced portfolio could range from about $97,583 to $117,317." },
      { question: "What growth can a balanced portfolio show over time?", answer: "Growth depends on your mix, contributions, and time horizon. In the example, a $100,000 balanced portfolio with $500 monthly contributions projects to about $679,255 over 20 years. Of that total, $220,000 is contributions and $459,255 is estimated growth. The classic 60/30/10 split is close to a [60/40 portfolio calculator](/portfolio/60-40-portfolio-calculator/) mix, and you can compare more tools on our [calculators](/calculators/) page." },
    ],
    sources: [
      { label: "SEC Investor.gov — Beginners' Guide to Asset Allocation, Diversification, and Rebalancing", url: "https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset" },
      { label: "FINRA — Asset Allocation and Diversification", url: "https://www.finra.org/investors/investing/investing-basics/asset-allocation-diversification" },
    ],
    defaultPreset: { stocks: 60000, bonds: 30000, realEstate: 0, cash: 10000, monthlyContribution: 500, years: 20 },
  },

  {
    id: "real-estate",
    islandId: "real-estate",
    label: "Real Estate",
    navOrder: 6,
    metaTitle: "Rental Property Calculator: Cash Flow & ROI Tools",
    metaDescription:
      "Use our free rental property calculator to analyze cash flow, cap rate, cash-on-cash return, and long-term ROI before you buy.",
    targetKeyword: "rental property calculator",
    h1: "Rental Property Calculator: Analyze Cash Flow and Returns",
    intro:
      "The rental property calculator above shows whether a single-family rental is a smart investment. Enter the purchase price, rent, loan terms, and expenses to see cash flow, cap rate, cash-on-cash return, and long-term ROI in seconds. It works for first-time buyers and seasoned landlords alike. The detailed guides below break down each metric so you can read your results with confidence.",
    howItWorks:
      "A rental property calculator estimates your profit by subtracting all costs from your rental income. It starts with effective gross income, which is your annual rent minus a vacancy allowance. Then it subtracts operating expenses like taxes, insurance, maintenance, and management to find net operating income (NOI). Finally, it subtracts your mortgage payment to reveal your cash flow.\n\nFour numbers tell the story. NOI is income after operating costs but before the loan. Cap rate is NOI divided by purchase price, a quick way to compare deals. Cash flow is the cash left each month after the mortgage. Cash-on-cash return is annual cash flow divided by the cash you invested.\n\nReal estate investing fundamentals for first-time buyers. Cap rate compares deals as if you paid cash — use the [cap rate calculator](/real-estate/cap-rate-calculator/) to screen properties in seconds. Cash-on-cash return measures the yield on your actual down payment, which is what a leveraged investor really earns; the [cash flow calculator](/real-estate/cash-flow-calculator/) shows both. The 1% rule (monthly rent ≥ 1% of purchase price) is a screening shortcut, not a verdict — most deals in expensive metros fail it, so run the full numbers before you walk away. Leverage cuts both ways: a mortgage magnifies your return when rents rise and your losses when values fall, so early on prioritize positive cash flow over hoped-for appreciation. Beginners lose more money to bad cash flow than to bad markets. Rental cash flow is one of the classic streams covered in our [passive income ideas guide](/guides/passive-income-ideas/), alongside dividends and interest.\n\nTaxes are where rentals quietly beat other investments. IRS Publication 527 lets you depreciate the building (not the land) over 27.5 years using GDS, which creates a paper loss that shelters real rental income. You can also deduct mortgage interest, property taxes, insurance, repairs, and management fees. A 1031 like-kind exchange lets you sell one rental and roll the gain into another without paying capital gains tax — the rules are strict on timing and property use, so read Pub 527 and consult a CPA before you file. This is general information, not tax advice. The [ROI calculator](/real-estate/roi-calculator/) helps you compare total returns across properties before you commit.",
    faqs: [
      { question: "How does a rental property calculator work?", answer: "A rental property calculator subtracts your vacancy loss, operating expenses, and mortgage payment from your rental income. Take this example: a $350,000 home with 25% down rents for $2,800 a month. After a 5% vacancy allowance, taxes, insurance, maintenance, and management, the net operating income is $20,844 a year. The mortgage of $1,746 a month leaves cash flow near break-even, about -$9 a month." },
      { question: "Is a break-even rental property still a good investment?", answer: "Yes, a near break-even property can still earn a strong return. In the example above, monthly cash flow is roughly -$9, yet the 20-year annualized return (IRR) is 9.45%. Two forces drive this: the property appreciates over time, and each mortgage payment builds your equity. Cash flow is only part of the picture, so judge a deal on total return, not just monthly profit." },
      { question: "What is a good cap rate and cash-on-cash return?", answer: "Cap rate and cash-on-cash return depend on your market, but here is what the example shows. The cap rate is 5.96%, found by dividing the $20,844 NOI by the $350,000 price. The cash-on-cash return is -0.12%, the annual cash flow of about -$113 divided by the $98,000 invested. Use the [cap rate calculator](/real-estate/cap-rate-calculator/) and [cash-on-cash return calculator](/real-estate/cash-on-cash-return-calculator/) to test your own numbers." },
      { question: "What does DSCR mean for a rental property?", answer: "DSCR (debt service coverage ratio) measures whether rent covers the mortgage. It divides net operating income by your annual loan payment. In the example, the DSCR is 0.99, just under 1.0. A DSCR below 1 means the property's income does not fully cover the loan payment, so you must add cash to make up the gap. Many lenders want a DSCR of 1.2 or higher." },
      { question: "What is the 1% rule in rental investing?", answer: "The 1% rule says monthly rent should equal at least 1% of the purchase price. In the example, $2,800 in rent on a $350,000 home is 0.80%, below the threshold. The rule is a fast screen, not a verdict. It ignores taxes, financing, and appreciation, so always run the full numbers in the [rental cash flow calculator](/real-estate/cash-flow-calculator/) before deciding." },
      { question: "How is rental income taxed?", answer: "Rental income is taxable, but many costs are deductible. The IRS requires you to report all rent you receive, including advance rent and certain tenant payments. You can deduct operating expenses like mortgage interest, property taxes, insurance, repairs, and management fees. You also depreciate the building over 27.5 years. See IRS Topic No. 414 and Publication 527 for the full rules." },
    ],
    sources: [
      { label: "IRS Topic No. 414, Rental Income and Expenses", url: "https://www.irs.gov/taxtopics/tc414" },
      { label: "IRS Publication 527, Residential Rental Property", url: "https://www.irs.gov/publications/p527" },
    ],
    defaultPreset: {
      purchasePrice: 350000, downPaymentPct: 25, closingCostsPct: 3, interestRatePct: 7, loanTermYears: 30,
      monthlyRent: 2800, vacancyRatePct: 5, propertyTaxAnnual: 4200, insuranceAnnual: 1500,
      maintenancePctOfRent: 8, managementPctOfRent: 8, appreciationPct: 3, rentGrowthPct: 2,
      expenseGrowthPct: 2, sellingCostsPct: 7, holdYears: 20,
    },
  },

  {
    id: "net-worth",
    islandId: "net-worth",
    label: "Net Worth",
    navOrder: 7,
    metaTitle: "Net Worth Calculator: Free Tool With Age Benchmarks",
    metaDescription:
      "Free net worth calculator. Add assets, subtract debts, and compare your total to Federal Reserve median net worth by age.",
    targetKeyword: "net worth calculator",
    h1: "Net Worth Calculator",
    intro:
      "This free net worth calculator adds your assets, subtracts your debts, and shows where you stand against Federal Reserve benchmarks. Enter cash, investments, retirement accounts, home equity, and vehicles, then list mortgages, loans, and credit card balances in the calculator above. You will see your total net worth, your [liquid net worth](/net-worth/liquid-net-worth-calculator/), and your debt-to-asset ratio in seconds.",
    howItWorks:
      "Net worth equals everything you own minus everything you owe. The Federal Reserve's 2022 Survey of Consumer Finances reports median net worth that rises sharply with age: $39,000 under 35, $135,600 at 35–44, $247,200 at 45–54, $364,500 at 55–64, $409,900 at 65–74, and $335,600 at 75 or older. The median is the better yardstick than the average (mean), because a small number of very wealthy households pulls the average sharply higher.\n\nTake a sample household with a 40-year-old head: $550,000 in total assets ($15,000 cash, $40,000 taxable investments, $120,000 retirement, $350,000 home, $25,000 vehicles) and $296,000 in total debts ($250,000 mortgage, $18,000 auto, $22,000 student loans, $6,000 cards). Net worth is $254,000, about $118,400 above the 35–44 median of $135,600. Liquid net worth, however, is -$241,000 because only $55,000 of those assets are liquid. That gap is why homeowners often look wealthier than they feel. Learn the full method on [how to calculate net worth](/net-worth/how-to-calculate-net-worth/). Households crossing the seven-figure mark often start weighing professional help — see our guide on [how to choose a financial advisor](/guides/how-to-choose-a-financial-advisor/) for what to look for.",
    faqs: [
      { question: "What is a net worth calculator?", answer: "A net worth calculator totals your assets and subtracts your liabilities to show what you would have left if you sold everything and paid off every debt. The calculator above does this instantly and benchmarks the result against Federal Reserve median net worth data by age." },
      { question: "What is a good net worth for my age?", answer: "A good benchmark is the Federal Reserve SCF median for your age bracket: $39,000 under 35, $135,600 at 35–44, $247,200 at 45–54, $364,500 at 55–64, and $409,900 at 65–74. See age-by-age targets in our [net worth by age calculator](/net-worth/net-worth-by-age-calculator/)." },
      { question: "Why is mean net worth so much higher than median?", answer: "Mean net worth is much higher than median because wealth in the U.S. is heavily skewed toward the top. A small share of ultra-wealthy households pulls the average up, so the median is the better yardstick for a typical family." },
      { question: "What is liquid net worth and why does it matter?", answer: "Liquid net worth counts only assets you can convert to cash quickly, like checking, savings, and taxable investments, minus your total debt. It often surprises homeowners because home equity and retirement accounts are not liquid. Try the [liquid net worth calculator](/net-worth/liquid-net-worth-calculator/) for the full picture." },
      { question: "What counts as an asset versus a liability?", answer: "Assets are things you own with cash value: bank accounts, investments, retirement accounts, real estate, and vehicles. Liabilities are debts you owe: mortgages, auto loans, student loans, and credit card balances. The calculator above walks you through each category." },
      { question: "How often should I recalculate my net worth?", answer: "Recalculate your net worth once a quarter. That cadence catches investment swings, debt paydown, and home value changes without becoming noise. Bookmark the calculator above or browse more tools at [our calculator hub](/calculators/)." },
    ],
    sources: [
      { label: "Federal Reserve — Survey of Consumer Finances", url: "https://www.federalreserve.gov/econres/scfindex.htm" },
      { label: "Consumer Financial Protection Bureau — Your Money, Your Goals", url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/" },
    ],
    defaultPreset: { cash: 15000, investments: 40000, retirement: 120000, realEstate: 350000, vehicles: 25000, mortgage: 250000, autoLoans: 18000, studentLoans: 22000, creditCards: 6000, age: 40 },
  },

  {
    id: "budget",
    islandId: "budget",
    label: "Budget",
    navOrder: 8,
    metaTitle: "Budget Calculator: Plan Your Monthly Spending",
    metaDescription:
      "Free budget calculator using the 50/30/20 rule or zero-based method. Enter your take-home pay and expenses to see exactly where your money should go.",
    targetKeyword: "budget calculator",
    h1: "Budget Calculator",
    intro:
      "A budget calculator splits your take-home pay across needs, wants, and savings so every dollar has a plan. The calculator above uses the popular 50/30/20 rule — 50% of income to needs, 30% to wants, and 20% to savings and debt payoff — and includes a zero-based mode for budgeting every dollar to zero. Enter your monthly income and spending to see your targets, where you're over, and how much is left to assign. For example, on $5,000 a month after tax, the 50/30/20 rule sets aside $2,500 for needs, $1,500 for wants, and $1,000 for savings.",
    howItWorks:
      "A budget works by comparing what you earn to what you plan to spend, then steering the gap toward your goals. The calculator above groups spending into three buckets. Needs are costs you can't skip — housing, utilities, groceries, transportation, insurance, and the minimum payments on your debts. Wants are lifestyle choices like dining out, subscriptions, and travel. Savings covers your emergency fund, retirement and investing, and any extra debt payoff above the minimum.\n\nThe 50/30/20 rule, popularized by Senator Elizabeth Warren in her book All Your Worth, recommends 50% of after-tax income for needs, 30% for wants, and 20% for savings and debt. These are guidelines, not laws — in high-cost areas, needs often run higher, which simply means a smaller wants bucket. The zero-based method, used by Dave Ramsey's EveryDollar and others, takes a different angle: income minus expenses should equal zero, so every dollar is assigned a job before the month begins. Use the toggle above to switch between the two. To turn your leftover into wealth, see how to [grow your savings](/investing/) and [track your net worth](/net-worth/).\n\nHow to make a budget in 5 steps. First, tally your monthly take-home pay — the amount that actually hits your bank account after taxes and payroll deductions. Second, list every expense, splitting fixed costs (rent, insurance, loan payments) from variable ones (groceries, gas, dining). Third, pick a framework: the [50/30/20 rule](/budget/50-30-20-budget-calculator/) if you want a quick guardrail, zero-based if you want tight control, or a [household budget](/budget/household-budget-calculator/) approach if two incomes fund one plan. Fourth, allocate leftover income to savings and debt payoff before wants — the CFPB's Money Smart guide calls this \"paying yourself first.\" Fifth, review once a month and adjust; a budget only works if it survives contact with real spending.\n\nHow to create a family budget adds three layers. Child care and education are often the second-largest line after housing — the BLS Consumer Expenditure Survey shows families with children spend 5–15% of income here, so treat it as a need, not a want. Joint accounts simplify the math but require a monthly money check-in so no one is surprised. Build a \"kid inflation\" buffer for growth spurts, school fees, and activities that arrive in lumpy bursts. The [monthly budget calculator](/budget/monthly-budget-calculator/) handles single-earner households; the [household budget calculator](/budget/household-budget-calculator/) is built for two incomes and shared bills.",
    faqs: [
      { question: "What is a budget calculator?", answer: "A budget calculator totals your take-home income and planned spending to show whether you have a surplus or a shortfall, and how your spending compares to recommended targets. The calculator above splits your money into needs, wants, and savings using the 50/30/20 rule, or lets you budget every dollar to zero." },
      { question: "What is the 50/30/20 budget rule?", answer: "The 50/30/20 rule allocates 50% of your after-tax income to needs, 30% to wants, and 20% to savings and debt payoff. It comes from Senator Elizabeth Warren's book All Your Worth and is the most widely used quick-start budgeting framework because it needs just one number — your monthly take-home pay." },
      { question: "Should I use gross or take-home income for a budget?", answer: "Use take-home (after-tax) income — the amount that actually lands in your account. The 50/30/20 rule is built on after-tax pay. If you save for retirement through payroll deductions, you can add that back in and count it inside your 20% savings bucket." },
      { question: "What is zero-based budgeting?", answer: "Zero-based budgeting assigns every dollar of income a specific job until income minus expenses equals zero. It doesn't mean spending everything — money sent to savings or debt counts as a job. This is the method behind Dave Ramsey's EveryDollar app, and you can switch to it with the toggle in the calculator above." },
      { question: "Do minimum debt payments count as a need or savings?", answer: "Minimum required debt payments are needs — they're non-negotiable, so they belong in the 50% bucket. Any extra you pay above the minimum to get out of debt faster counts in the 20% savings and debt-payoff bucket. Keeping the two separate is the most common 50/30/20 mistake." },
      { question: "How much of my income should I save?", answer: "The 50/30/20 rule targets 20% of take-home pay for savings and debt payoff combined. If you have high-interest debt, focus that 20% on eliminating it first, then redirect it to an emergency fund and investing. See the [savings goal calculator](/investing/savings-goal-calculator/) to plan a target." },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — Making a budget", url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/teach/activities/creating-budget/" },
      { label: "Warren & Tyagi — All Your Worth: The Ultimate Lifetime Money Plan", url: "https://www.elizabethwarren.com/" },
    ],
    defaultPreset: {
      monthlyIncome: 5000,
      mode: "50-30-20",
      amounts: { housing: 1500, utilities: 220, groceries: 500, transportation: 300, insurance: 180, minimumDebt: 150, dining: 300, entertainment: 130, shopping: 220, funMisc: 150, emergencyFund: 250, retirement: 600, extraDebt: 300 },
    },
  },

  // ---- Pillar 1: Professional Services — Tax Resolution ----
  // Different audience from /guides/tax-tips (which covers proactive planning). This hub is for
  // taxpayers already behind — negotiating IRS debt, penalties, and collection notices. Grounded in
  // IRS Form 656-B (OIC), IRC §6502 (CSED), IRM 5.14/5.16 (IA + CNC), and Pub 971 (Innocent Spouse).
  // Engine: src/lib/tax-resolution-hub.ts. Island: TaxResolutionHubCalculator.
  {
    id: "tax-resolution",
    islandId: "tax-resolution",
    label: "Tax Resolution",
    navOrder: 9,
    metaTitle: "Tax Resolution Calculator: What Are Your IRS Options?",
    metaDescription:
      "Free tax resolution calculator. Enter what you owe, your income, and assets — see whether an OIC, IRS payment plan, or hardship status fits your situation.",
    targetKeyword: "tax resolution calculator",
    h1: "Tax Resolution Calculator: See Your IRS Relief Options",
    intro:
      "A tax resolution calculator maps your IRS debt to the specific relief program most likely to work — Offer in Compromise, installment agreement, Currently Not Collectible, penalty abatement, or Innocent Spouse Relief. The calculator above does this in seconds. Enter what you owe, your monthly income, your allowable living expenses, your net asset equity, and whether the debt is joint. For example, someone owing $42,000 with $700 a month of disposable income and $8,000 of equity has an IRS Reasonable Collection Potential of $16,400 — the floor for a viable Offer in Compromise.",
    howItWorks:
      "An IRS tax debt has five main paths out, and the right one depends on the ratio of what you can pay to what you owe. The calculator applies the IRS's own math — Reasonable Collection Potential (RCP) — which equals your net asset equity plus a multiple of your monthly disposable income: 12 months for a Lump-Sum Cash Offer, 24 months for a Periodic Payment Offer. If RCP is meaningfully less than your debt, an Offer in Compromise is viable. The IRS accepted 7,199 of 33,591 offers in FY2025 — a 21.4% acceptance rate — so it's a real path, not a marketing slogan.\n\nIf your RCP equals or exceeds the debt, the IRS will collect in full and you're choosing between installment structures. A short-term payment plan (up to 180 days, no setup fee) works if you can pay it off fast. A streamlined installment agreement is the online default for individuals owing $50,000 or less — $22 setup with direct debit, and your failure-to-pay penalty drops from 0.5% to 0.25% per month the day the plan is approved. Owe more than $50,000 and the IRS requires Form 433-F to review your full financial picture before approving a non-streamlined agreement.\n\nThere's also a hardship track. If your allowable living expenses meet or exceed your income — measured against the IRS Collection Financial Standards for your county and family size — the IRS should place your account in Currently Not Collectible status. Active collection stops, but the 10-year Collection Statute Expiration Date (CSED) under IRC §6502(a)(1) keeps running in your favor. If the CSED expires before your finances improve, the debt is gone. Two frequently overlooked options round out the picture: First Time Abate strips out failure-to-file and failure-to-pay penalties if you've been penalty-free for the last 3 years, and Innocent Spouse Relief under IRC §6015 can remove liability entirely if the debt came from a spouse's under-reporting. If you're current on taxes and looking for planning rather than resolution, our [tax tips guide](/guides/tax-tips/) covers that side. This page is for when you're already behind.",
    faqs: [
      {
        question: "What is a tax resolution calculator?",
        answer:
          "A tax resolution calculator maps IRS tax debt to the relief program most likely to fit — Offer in Compromise, installment agreement, Currently Not Collectible, penalty abatement, or Innocent Spouse Relief. This one takes your debt amount, income, allowable living expenses, and asset equity, then applies the IRS's Reasonable Collection Potential formula to show which path applies and roughly what professional help would cost.",
      },
      {
        question: "Is IRS tax relief legit?",
        answer:
          "IRS tax relief is real. Offer in Compromise, installment agreements, Currently Not Collectible status, and penalty abatement are all statutory programs the IRS administers under the Internal Revenue Code, not marketing gimmicks. The FY2025 IRS Data Book shows 7,199 of 33,591 offers were accepted — a 21.4% acceptance rate. The catch is that companies promising 'pennies on the dollar' before ever seeing your Form 433 financials rarely deliver what the IRS actually approves. Real relief is what the IRS's own Reasonable Collection Potential math says you can pay.",
      },
      {
        question: "How much does tax relief cost?",
        answer:
          "Professional fees typically run $3,500 to $7,500 for an Offer in Compromise, $500 to $1,500 for a penalty-abatement request, and $1,500 to $3,500 for a non-streamlined installment agreement above the $50,000 threshold. Streamlined online installment agreements cost just $22 to set up with direct debit — most people don't need a professional for those. The IRS's own $205 Offer in Compromise application fee is waived if your income is at or below 250% of the federal poverty guidelines.",
      },
      {
        question: "Can back taxes be forgiven?",
        answer:
          "Yes, in three specific ways. An accepted Offer in Compromise settles the debt for less than the balance owed. A Partial Pay Installment Agreement lets you pay less than the full amount over the remaining CSED; whatever is unpaid when the 10-year statute expires disappears. And if the IRS places you in Currently Not Collectible status and your finances don't recover before the CSED, the debt expires. Blanket 'IRS forgiveness programs' pitched in ads are usually one of these three routes in disguise.",
      },
      {
        question: "What happens if I ignore back taxes?",
        answer:
          "Ignoring back taxes triggers a predictable escalation. Failure-to-pay penalty runs 0.5% per month (capped at 25% of the balance), interest accrues at the IRS quarterly underpayment rate (7% per year for the third quarter of 2026), and a Notice of Federal Tax Lien can be filed against your assets. Continued non-response leads to wage garnishment or a bank levy, and the State Department can revoke or refuse passport renewal once seriously delinquent tax debt exceeds roughly $62,000. The debt does not go away on its own — the 10-year CSED clock starts only when the tax is assessed.",
      },
      {
        question: "What's the difference between a tax attorney, CPA, and Enrolled Agent?",
        answer:
          "All three can represent you before the IRS, but their strengths differ. Enrolled Agents are federally licensed by the IRS specifically for tax representation and are usually the most affordable option ($150–$300/hour). CPAs bring broader accounting depth — useful if bookkeeping errors caused the debt. Tax attorneys ($300–$600/hour) add attorney-client privilege and are the right call if there is criminal exposure, complex Innocent Spouse issues, or a Tax Court petition on the table.",
      },
    ],
    sources: [
      { label: "IRS — Payment plans (installment agreements)", url: "https://www.irs.gov/payments/payment-plans-installment-agreements" },
      { label: "IRS — Offer in Compromise", url: "https://www.irs.gov/payments/offer-in-compromise" },
      { label: "IRS — Form 656 Booklet (OIC application)", url: "https://www.irs.gov/pub/irs-pdf/f656b.pdf" },
      { label: "IRS — Failure to Pay Penalty", url: "https://www.irs.gov/payments/failure-to-pay-penalty" },
      { label: "IRS — Quarterly interest rates on underpayments", url: "https://www.irs.gov/payments/quarterly-interest-rates" },
      { label: "IRS — Innocent Spouse Relief (IRC §6015)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/innocent-spouse-relief" },
      { label: "IRS — First Time Abate (penalty relief)", url: "https://www.irs.gov/payments/penalty-relief-due-to-first-time-abate-or-other-administrative-waiver" },
      { label: "IRS Data Book (FY2025) — Publication 55B", url: "https://www.irs.gov/pub/irs-pdf/p55b.pdf" },
    ],
    defaultPreset: {
      totalDebt: 42000,
      yearsBehind: 0,
      monthlyIncome: 6500,
      monthlyAllowableExpenses: 5800,
      assetEquity: 8000,
      isJointSpousal: false,
      cleanPriorThreeYears: false,
    },
  },
];

export const CALC_BY_ID: Record<string, CalculatorDef> = Object.fromEntries(
  CALCULATORS.map((c) => [c.id, c]),
);

/** A calculator is live (builds pages) once its island is registered. */
export function isLive(c: CalculatorDef): boolean {
  return LIVE_IDS.has(c.islandId);
}

export function liveCalculators(): CalculatorDef[] {
  return CALCULATORS.filter(isLive).sort((a, b) => a.navOrder - b.navOrder);
}

/** Spokes that belong under a calculator. */
export function spokesForCalc(id: string): SpokeEntry[] {
  return SPOKES.filter((s) => s.calculator === id);
}

/** Up to n related spokes within the same calculator: curated first, then siblings. */
export function relatedSpokes(entry: SpokeEntry, n = 4): SpokeEntry[] {
  const out: SpokeEntry[] = [];
  const seen = new Set([entry.slug]);
  for (const sl of entry.relatedSlugs ?? []) {
    const m = SPOKES.find((s) => s.calculator === entry.calculator && s.slug === sl);
    if (m && !seen.has(m.slug)) {
      out.push(m);
      seen.add(m.slug);
    }
  }
  for (const s of spokesForCalc(entry.calculator)) {
    if (out.length >= n) break;
    if (!seen.has(s.slug)) {
      out.push(s);
      seen.add(s.slug);
    }
  }
  return out.slice(0, n);
}
