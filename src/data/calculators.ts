import type { CalculatorDef, SpokeEntry } from "./types";
import { SPOKES } from "./spokes";
import { LIVE_IDS } from "./registry";
import { MCA_HUB } from "./bf-mca-hub";
import { FACTORING_HUB } from "./bf-factoring-hub";
import { LOC_HUB } from "./bf-loc-hub";

// The 7 calculator hubs. Each targets a head term; its spokes (in src/data/spokes*.ts) target the
// winnable long-tail. A calculator is "live" (gets built pages) only once its island is registered
// in src/components/islands.ts — until then it shows on the home page as upcoming.

export const CALCULATORS: CalculatorDef[] = [
  {
    id: "auto-loan",
    islandId: "auto-loan",
    label: "Auto Loan",
    navOrder: 1,
    metaTitle: "Auto Loan Calculator: Enter Any Amount, Instant Payment",
    metaDescription:
      "Enter any car loan amount and APR to see your exact monthly payment instantly. Free calculator with amortization, refinance tools, and 2026 rates.",
    targetKeyword: "auto loan calculator",
    h1: "Auto Loan Calculator",
    introText:
      "An auto loan calculator estimates your monthly car payment and the total cost of financing a vehicle. The calculator above does this in seconds. Enter the vehicle price, your down payment, the interest rate (APR), and the loan term to see your numbers. For example, a $35,000 car with $5,000 down at 7.5% APR over 60 months gives a $601.14 monthly payment.",
    howItWorks:
      "Your monthly car payment is set by three things: the loan amount, the APR, and the loan term. The loan amount is the price minus your down payment and trade-in. In the example above, $35,000 minus $5,000 down leaves a $30,000 loan. To calculate it yourself, start with the vehicle price. Subtract your down payment and any trade-in credit to get the loan amount. Then apply the APR and loan term to that amount using a fixed-payment amortization formula, the same one lenders use. The calculator above runs that formula the instant you change a number, so you can test a different down payment or term without doing the math by hand.\n\nEach payment is split between interest and principal through a process called amortization. Early on, more of your money goes to interest. In month one, the $601.14 payment splits into $187.50 of interest and $413.64 of principal. Over the full 60 months, you pay $6,068 in interest, for a total of $36,068.\n\nTo see the full month-by-month breakdown, use the [auto loan amortization calculator](/auto-loan/amortization-schedule/). To see how a higher payment cuts your interest, try the [auto loan extra payment calculator](/auto-loan/extra-payment-calculator/). Not sure how much car fits your budget first? Start with the [car affordability calculator](/auto-loan/car-affordability-calculator/). Already have a loan and wondering if a lower rate is out there? Run your numbers through the [auto loan refinance calculator](/auto-loan/refinance-calculator/).",
    faqs: [
      {
        question: "Is this the same as a car loan payment calculator?",
        answer:
          "Yes. An auto loan calculator and a car loan payment calculator solve the same problem: your monthly payment from a price, a down payment, an APR, and a term. Enter those four numbers in the calculator above and it returns your payment instantly, plus the full amortization schedule most bare payment calculators skip.",
      },
      {
        question: "What is a good interest rate on an auto loan in 2026?",
        answer:
          "A good rate depends on your credit and whether the car is new or used. In mid-2025, the average new-car APR was about 6.8%, and the average used-car APR was about 11.5%, according to Experian. Borrowers with strong credit often qualify for rates below these averages. Always compare offers from a bank or credit union before you visit the dealer. The strongest credit profiles sometimes see a manufacturer's 0% APR offer instead of a standard-rate loan, which works differently and isn't automatically the better deal — see our [0% APR car loan guide](/guides/0-percent-apr-car-loan-explained/) for when a cash rebate wins instead.",
      },
      {
        question: "Does this work as a used car loan calculator?",
        answer:
          "Yes. Enter a used car's price, your down payment, and its APR the same way you would for a new one, since the calculator runs the identical amortization math either way. The one thing to change is the rate you enter. Experian's mid-2025 data put the average used-car APR at 11.5%, well above the 6.8% average for new cars, because used vehicles carry more lending risk. Quote your own used-car rate from a bank or credit union rather than assuming the new-car average applies.",
      },
      {
        question: "Are auto loan rates going up or down right now?",
        answer:
          "Auto loan rates track the [Federal Reserve's](https://www.federalreserve.gov/monetarypolicy/openmarket.htm) federal funds rate, the benchmark most lenders price their own rates against. Experian's mid-2025 data put the average new-car APR near 6.8% and the average used-car APR near 11.5%. Those averages shift a little each time the Fed moves its target rate. Your own quote still depends far more on your credit score and your lender than on that general trend. Get a current rate quote from your bank or credit union, then plug it into the calculator above to see your exact payment — our [roundup of the best auto loan calculators by bank and credit union](/roundup/best-auto-loan-calculators-by-bank-and-credit-union/) is a fast way to check several at once.",
      },
      {
        question: "How does this auto loan calculator estimate my payment?",
        answer:
          "The auto loan calculator uses your loan amount, APR, and term to compute a fixed monthly payment. It applies a standard amortization formula, the same math lenders use. The result shows your principal and interest payment. It does not include taxes, registration, or insurance, so budget extra for those costs.",
      },
      {
        question: "Are car loan interest rates annual or monthly, and are they fixed or variable?",
        answer:
          "Car loan rates are quoted as an annual percentage, called the APR, even though interest is calculated and charged against your balance every month. The APR includes the interest rate plus any lender fees rolled into the loan, per the CFPB, so it's usually the slightly higher number on your paperwork. Nearly every auto loan carries a fixed rate. The APR you sign for stays the same for the full term, unlike a variable-rate loan that moves up or down with the market. That fixed rate is why the calculator above returns one stable monthly payment instead of a range.",
      },
      {
        question: "Should I choose a longer loan term to lower my payment?",
        answer:
          "A longer term lowers your monthly payment but raises the total interest you pay. Stretching a loan to 72 or 84 months also raises the risk of owing more than the car is worth. This is called being underwater. A shorter term costs more each month but saves money overall. As a rule, pick the shortest term you can comfortably afford. Our guide on [how long a car loan should be](/guides/how-long-should-a-car-loan-be/) walks through the exact interest cost at each common term length.",
      },
      {
        question: "What is a common dealer financing trap to avoid?",
        answer:
          "Watch out for dealer interest rate markup. When a dealer arranges your loan, they can add a markup to the lender's rate and keep the difference. This can cost you hundreds or thousands over the loan. Get a pre-approved rate from your own bank or credit union first — see our [roundup of bank and credit union auto loan calculators](/roundup/best-auto-loan-calculators-by-bank-and-credit-union/) to check several before you visit the dealer. The CFPB confirms your auto loan terms are negotiable, so use that outside offer as leverage.",
      },
      {
        question: "How much does a bigger down payment help?",
        answer:
          "A bigger down payment lowers your loan amount, which lowers both your payment and your total interest. It also reduces the risk of going underwater on the loan. Many buyers aim for at least 20% down on a new car and 10% on a used car. Even a small increase in your down payment can save you money over the life of the loan.",
      },
      {
        question: "Does this calculator include sales tax, fees, and my trade-in?",
        answer:
          "Yes for your trade-in. Enter its value and any amount you still owe in the calculator above, and it nets the two against your vehicle price the same way a dealer would. Sales tax and title fees are left out of the total, since they vary too much by state, county, and dealer to build into one number. Add your own state's sales tax rate to the vehicle price before you enter it, and the result comes close to your true out-the-door price. That's also why a calculator built for one specific state wouldn't be any more accurate than this one. The trade-in and tax math is identical everywhere. Only the tax rate itself changes, and you're the one who already knows your own rate.",
      },
      {
        question: "Are auto loans a good idea?",
        answer:
          "An auto loan is a reasonable way to buy a car you can't pay cash for. It works in your favor when the payment fits your budget and the rate isn't inflated by a dealer markup. Financing also keeps your cash free for emergencies instead of tied up in one asset that loses value the moment you drive it home. The loan becomes a bad idea when the term stretches past 60 months just to chase a lower payment. That longer term raises both your total interest and your odds of owing more than the car is worth. Run your own numbers through the calculator above before you decide, and weigh that payment against the rest of your monthly budget. If a private-party purchase or an older vehicle makes a standard auto loan hard to get, a personal loan is the usual fallback — see our [personal loan vs auto loan comparison](/compare/personal-loan-vs-auto-loan/) for the real cost gap between the two.",
      },
      {
        question: "Can I save money by paying off my car loan early?",
        answer:
          "Yes, paying early reduces the total interest you pay, since interest is charged on your remaining balance. Even small extra payments toward principal can shorten your loan. First, confirm your lender has no prepayment penalty. To run the numbers, use the [pay off car loan early calculator](/auto-loan/early-payoff-calculator/), the [auto loan payoff calculator](/auto-loan/payoff-calculator/), or the [auto loan interest calculator](/auto-loan/interest-calculator/).",
      },
      {
        question: "What's the monthly payment on a $50,000 car loan?",
        answer:
          "At 7.5% APR over 60 months with no down payment, a $50,000 car loan costs $1,001.90 a month. Enter $50,000 in the calculator above to see this instantly. Over the full 60 months you would pay $10,113.85 in interest, bringing the total of payments to $60,113.85. A larger down payment or a shorter term both lower that interest cost — try the [auto loan interest calculator](/auto-loan/interest-calculator/) to compare terms side by side.",
      },
      {
        question: "What's the monthly payment on a $27,000 car loan?",
        answer:
          "At 7.5% APR over 60 months with no down payment, a $27,000 car loan costs $541.02 a month. Enter $27,000 in the calculator above to check this against your own rate and term. Total interest over the 60 months is $5,461.48, for a total of payments of $32,461.48. If you already have a loan this size and want to see how extra payments would shrink that interest, use the [auto loan extra payment calculator](/auto-loan/extra-payment-calculator/).",
      },
      {
        question: "What is gap insurance, and do I need it?",
        answer:
          "Gap insurance covers the difference between what you still owe on your loan and what your insurer pays out if the car is totaled or stolen, since a car's value drops faster than a loan balance in the first few years. It matters most with a small down payment, a long loan term, or a new car that depreciates quickly right after purchase. Dealers often sell it at signing, but an independent insurer or credit union usually offers the same coverage for less.",
      },
      {
        question: "What happens if I can't make my car loan payments?",
        answer:
          "Your lender can repossess the car once you default, usually after missing multiple payments, because the vehicle itself is collateral for the loan. If the lender then sells the repossessed car for less than you still owe, you can still be responsible for that remaining balance, called a deficiency balance, plus repossession fees. Call your lender before you miss a payment; many offer a hardship deferment or a modified payment plan instead.",
      },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — Auto Loans", url: "https://www.consumerfinance.gov/consumer-tools/auto-loans/" },
      { label: "CFPB — What is a dealer markup?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-dealer-markup-en-799/" },
      { label: "Experian — Auto Loan Rates and Financing", url: "https://www.experian.com/blogs/ask-experian/auto-loan-rates-financing/" },
      { label: "Federal Reserve — Open Market Operations (federal funds rate)", url: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm" },
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
    metaTitle: "Free Mortgage Calculator: Instant Home Loan Estimate",
    metaDescription:
      "Use our free, simple mortgage calculator to instantly estimate your monthly principal and interest, see full amortization, and learn how a home loan works.",
    targetKeyword: "mortgage calculator",
    h1: "Mortgage Calculator",
    introText:
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
          "The average 30-year fixed mortgage rate was 6.66% as of August 27, 2026, according to Freddie Mac's Primary Mortgage Market Survey. Rates change weekly, so use today's quoted rate in the calculator above for an accurate estimate. A small rate change moves your payment more than most people expect.",
      },
      {
        question: "Is a mortgage calculator the same as a mortgage quote or a mortgage estimator?",
        answer:
          "A mortgage calculator, a mortgage quote, and a mortgage estimator all point at the same question: what will this loan cost me each month? A quote from a lender is the real, binding version, built from your actual credit and the property. The calculator above is the free, instant version you run before you talk to anyone, using your own home price, down payment, rate, and term to estimate that same monthly principal and interest payment.",
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
      {
        question: "What is a mortgage calculator?",
        answer:
          "A mortgage calculator is a tool that estimates your monthly principal and interest (P&I) payment on a home loan from four inputs: home price, down payment, interest rate, and loan term. Enter those figures in the calculator above and it returns your monthly payment plus a full amortization schedule breaking down interest versus principal for every payment.",
      },
      {
        question: "How does a mortgage calculator work?",
        answer:
          "A mortgage calculator applies the standard amortization formula: M = P × [r(1+r)^n] ÷ [(1+r)^n − 1], where M is the monthly payment, P is your loan principal, r is your monthly interest rate (annual rate ÷ 12), and n is your total number of payments (loan term in years × 12). For the $320,000 loan at 6.5% over 30 years described above, r is 0.5417% and n is 360, and running those numbers through the formula returns the $2,022.62 monthly P&I payment shown in the example. Plug the same formula into a spreadsheet if you want to check the calculator's math yourself.",
      },
      {
        question: "Is a mortgage calculator accurate?",
        answer:
          "This calculator accurately estimates your monthly principal and interest payment from the numbers you enter, using the same amortization math your lender applies. What it can't know is your actual lender-quoted APR or your final closing costs, since those depend on your specific lender, your credit profile, and points or fees that vary deal to deal. Treat the number above as a solid planning estimate, then confirm your real rate and fees on a [Loan Estimate](https://www.consumerfinance.gov/owning-a-home/loan-estimate/) from an actual lender before you commit.",
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
      "Use our free retirement calculator to project your investment growth, see how much you'll have saved, and whether your money lasts through retirement.",
    targetKeyword: "retirement calculator",
    h1: "Retirement Calculator: See If You're On Track",
    introText:
      "A retirement calculator is a free planning tool that projects how much money you'll have saved by a target retirement age and how long that money will last once you start withdrawing it. This one estimates your nest egg from your age, current savings, monthly contribution, and expected return — enter those in the calculator above to see your projected balance. It also shows your balance in today's dollars, so inflation doesn't fool you. For example, a 35-year-old saving $500 a month could reach about $1,097,072 by age 67.",
    howItWorks:
      "The retirement calculator works in two stages: it grows your savings until retirement, then estimates how much you can safely withdraw each year. During the saving years, it compounds your current balance plus monthly contributions at a fixed annual return you choose. In our example saver's case (age 35, $50,000 saved, $500/month, 7% return), the balance grows to $1,097,072 by age 67. The striking part is the source of that money: your $50,000 starting balance plus $192,000 of new contributions add up to $242,000 you put in. Compound growth adds the other $855,072, so time does the heavy lifting.\n\nFor spending, the calculator applies the 4% rule. It withdraws 4% of your balance in year one, which is $43,883 (about $3,657 per month) for our example. At that rate, the savings last through age 95. The 4% rule is a planning guideline, not a guarantee. To go deeper, try our [retirement savings calculator](/retirement/retirement-savings-calculator/), or model your workplace plan with the [401k calculator](/retirement/401k-calculator/). If the numbers feel high-stakes and you want a professional second opinion, our guide on [how to choose a financial advisor](/guides/how-to-choose-a-financial-advisor/) walks through fiduciary status, fees, and credentials.\n\nHave a retirement plan — now protect it. Once you've projected a nest egg above a few hundred thousand, the next question is what happens to it if you die before spending it, become incapacitated, or need long-term care. A revocable living trust avoids probate on the accounts and property that fund your retirement lifestyle; an ILIT removes life insurance from your taxable estate; and beneficiary designations on 401(k)/IRA accounts override your will, so those need to match your intent. See our [estate planning calculator](/estate-planning/) for a specific plan tier, and the [estate tax calculator](/estate-planning/estate-tax-calculator/) for federal and state exposure under the 2026 $15M exemption (permanent under OBBBA P.L. 119-21).\n\nThe biggest untracked retirement risk is long-term care. Median 2026 nursing home private room is $132,000/year and inflates at ~4.5% annually — a 4-year care period starting at age 82 can consume $600,000+ that your 4%-rule withdrawal was never meant to cover. Medicare pays essentially zero for custodial care. Project your exposure with the [long-term care cost calculator](/elder-care/long-term-care-cost-calculator/), and if projected shortfall is large, model the Medicaid safety net with the [Medicaid spend-down calculator](/elder-care/medicaid-spend-down-calculator/). Start Medicaid Asset Protection Trust planning 5+ years before care is needed — the 60-month lookback under 42 U.S.C. §1396p(c) blocks any last-minute transfers.",
    faqs: [
      { question: "How much will I have when I retire?", answer: "It depends on your savings, contributions, return, and time. The retirement calculator above projects your total. In our example, a 35-year-old saving $500 a month at a 7% return reaches $1,097,072 by age 67, which is about $426,034 in today's dollars." },
      { question: "How much of my retirement balance comes from compound growth?", answer: "Most of it, if you start early. In our example, you start with $50,000 and add $192,000 in contributions, for $242,000 of your own money. Investment growth adds $855,072 more, reaching $1,097,072. Compounding does far more work than your contributions alone." },
      { question: "Will my retirement savings last?", answer: "Often yes, if you withdraw at a careful rate. The calculator uses the 4% rule, taking 4% in year one. In our example that is $43,883, about $3,657 a month, and the savings last through age 95. The 4% rule is a guideline, not a guarantee." },
      { question: "What is the 4% rule?", answer: "The 4% rule is a guideline that says you can withdraw about 4% of your savings in your first year of retirement. It is an assumption built into this calculator, not a promise. Market returns, inflation, and how long you live can all change the outcome." },
      { question: "When do I have to start withdrawing from my retirement accounts?", answer: "Age 73 for most accounts. The IRS requires minimum distributions (RMDs) from traditional IRAs and 401(k)s starting at age 73. Roth IRAs are exempt while you are alive. Use our [RMD calculator](/retirement/rmd-calculator/) to estimate your required amount." },
      { question: "What if I withdraw from my 401(k) early?", answer: "Early 401(k) withdrawals before age 59½ usually trigger a 10% IRS penalty plus income tax. This shrinks your retirement balance and its future growth. Estimate the cost first with our [401k early withdrawal calculator](/retirement/401k-early-withdrawal-calculator/), and see our [tax tips guide](/guides/tax-tips/) for legal ways to reduce the bracket that penalty stacks on top of." },
      { question: "Is this a Monte Carlo retirement calculator?", answer: "No — this calculator uses a straight-line projection with one fixed annual return, not a Monte Carlo simulation. A Monte Carlo retirement calculator runs thousands of randomized market-return sequences and reports a probability, such as an 85% chance your money lasts to age 95, instead of one number. This calculator's simpler approach is faster for testing 'what if I contribute more' or 'what if I retire later' scenarios, but unlike Monte Carlo tools it can't show how a bad market in your first few retirement years (sequence-of-returns risk) would hurt more than the same loss arriving later, even with an identical average return." },
      { question: "Why do retirement calculators give different results for the same numbers?", answer: "Retirement calculators disagree mainly because of different built-in assumptions, not because the math is wrong. Feed identical age, savings, and contribution figures into two tools and you can still get very different projected balances if one assumes a 7% return and the other 6%, if one strips out inflation and the other doesn't, or if one models taxes on withdrawals while the other shows a pre-tax balance. This calculator shows both a nominal balance and a real (inflation-adjusted) balance, and its 4%-rule withdrawal figure is pre-tax — check what return, inflation, and tax assumptions any other calculator uses before treating one number as more 'right' than another. See our [roundup of the best retirement calculators](/roundup/best-retirement-calculators/) for how several popular tools compare on methodology." },
      { question: "How do I use this retirement calculator?", answer: "Enter your current age, the age you plan to retire, how much you've already saved, your monthly contribution, and an expected annual return. The calculator above compounds those numbers forward to your retirement age, then applies the 4% rule to estimate a year-one withdrawal. Try changing one input at a time — a later retirement age or a higher monthly contribution — to see which lever moves your projected balance the most." },
      { question: "What is the formula behind this retirement calculator?", answer: "The saving side compounds your contributions forward in plain English: each year, the calculator adds your contributions for that year, then grows the running balance by your annual return — the standard compound-growth formula applied to both your existing savings and everything you keep adding. The spending side then applies the 4% rule, multiplying your projected balance at retirement by 4% to estimate your first-year withdrawal." },
      { question: "Can I build my own version of this retirement calculator in a spreadsheet?", answer: "Yes. The same compound-growth and 4%-rule math behind this calculator can be copied cell by cell into Google Sheets or Excel. Our [retirement calculator spreadsheet template](/guides/retirement-calculator-spreadsheet-template/) walks through the exact formulas, so you can see every assumption in plain view before switching back to this calculator to model Social Security, taxes, and inflation together." },
      { question: "Should I count bitcoin or crypto toward my retirement number?", answer: "Be cautious. This calculator assumes one fixed annual return, which fits a diversified stock-and-bond portfolio far better than a volatile single asset like bitcoin. See our guide on [bitcoin retirement calculator considerations](/guides/bitcoin-retirement-calculator-considerations/) for the volatility, tax, and sequence-of-returns risks of leaning on crypto for retirement income." },
      { question: "Does this retirement calculator work if I don't live in the United States?", answer: "No. This calculator is built around U.S. 401(k) and IRA rules, U.S. federal tax brackets, and the Social Security benefit formula, so it will not give an accurate projection for a non-U.S. pension system. See our [international retirement calculators guide](/guides/international-retirement-calculators/) for official retirement resources in the UK, Canada, India, Australia, and New Zealand." },
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
    introText:
      "This investment calculator projects how your money could grow over time with a starting balance, regular contributions, and a chosen annual return. Just enter your numbers in the calculator above to see your estimated future balance. For example, $10,000 plus $500 a month at a 7% annual return grows to about $300,851 over 20 years. You put in $130,000, while compounding adds $170,851 in growth.",
    howItWorks:
      "The investment calculator above multiplies your contributions by a fixed annual return that compounds monthly. You provide a starting balance, a monthly contribution, an annual return rate, and a number of years. The tool then projects your ending balance and splits it into what you contributed versus what growth added.\n\nHere is the key insight: in the example above, growth of $170,851 is larger than the $130,000 you contributed. Compounding means you earn returns on past returns, so over time growth can overtake your own deposits. The earlier you start, the bigger this effect becomes. This is an estimate — the calculator assumes one fixed annual return, but real markets rise and fall, so actual results will vary. Explore the [compound interest calculator](/investing/compound-interest-calculator/) and [investment growth calculator](/investing/investment-growth-calculator/) to go deeper.\n\nInvestment basics start with three building blocks. A stock is partial ownership in one company. An ETF holds a basket of stocks (or bonds) and trades like a single stock during market hours. An index fund tracks a benchmark like the S&P 500 and simply owns what the index owns — that is why fees are lower. Where you hold them matters too: a taxable brokerage account gives full flexibility but taxes gains each year, while a retirement account (401(k), IRA) defers or eliminates tax but locks the money until age 59½. The SEC's investor.gov guide recommends using tax-advantaged accounts first, then a brokerage for extra savings.\n\nHow to invest in stocks — a 4-step starter framework. First, open a brokerage or IRA account at a low-fee provider (no minimum, no trade commissions on stocks and ETFs). Second, buy a broad, low-cost S&P 500 or total-market index fund — one purchase gives you exposure to hundreds of companies. Third, automate contributions on payday so investing happens before you can spend the money. Fourth, ignore the daily headlines; the S&P 500 has returned about 10% a year on average since 1957 despite dozens of scary drawdowns along the way. Use the [S&P 500 calculator](/investing/sp500-calculator/) to see what a steady contribution schedule would have produced. If you'd rather delegate the plan than DIY it, read our guide on [how to choose a financial advisor](/guides/how-to-choose-a-financial-advisor/) before you sign anywhere.\n\nInvestment strategies worth knowing. Buy-and-hold owns the market long term and skips timing decisions. [Dollar-cost averaging](/investing/dollar-cost-averaging-calculator/) invests the same amount on a fixed schedule, which buys more shares when prices fall and fewer when they rise. Tax-advantaged prioritization means filling accounts in this order: employer 401(k) up to the match, then Roth or traditional IRA, then more 401(k), then a taxable brokerage. The order captures free money and tax breaks before flexibility. Once your accounts are funded, dividend-paying funds and interest-bearing accounts can become steady [passive income streams](/guides/passive-income-ideas/) that complement earned income.",
    faqs: [
      { question: "What is an investment calculator?", answer: "An investment calculator is a tool that projects how your money grows over time. You enter a starting amount, regular contributions, an annual return, and a time period. It then estimates your future balance and how much of it comes from growth versus your own deposits." },
      { question: "How accurate is this investment calculator?", answer: "The calculator gives an estimate, not a guarantee. It assumes one fixed annual return that compounds monthly. Real investment returns change year to year, so your actual balance could be higher or lower than the projection." },
      { question: "Why does growth eventually exceed my contributions?", answer: "Growth exceeds contributions because of compounding. You earn returns on your money and on past returns too. In the example above, $130,000 in deposits produced $170,851 in growth over 20 years, so growth outpaced what you put in." },
      { question: "Why does starting early matter so much?", answer: "Starting early matters because compounding needs time to build. The longer your money stays invested, the more returns stack on top of past returns. FINRA notes that even small investments can grow over time and benefit from compounding." },
      { question: "Which calculator should I use next?", answer: "Pick the tool that matches your goal. Try the [compound interest calculator](/investing/compound-interest-calculator/), the [investment growth calculator](/investing/investment-growth-calculator/), the [high yield savings calculator](/investing/high-yield-savings-calculator/), or the [savings goal calculator](/investing/savings-goal-calculator/). Modeling a systematic monthly contribution outside the U.S.? See the [SIP calculator](/investing/sip-calculator/). Projecting a specific stock or ETF? Try the [stock investment calculator](/investing/stock-investment-calculator/). A federal employee? See the [TSP calculator](/investing/tsp-calculator/). Not sure which type of tool fits your question? Read [how to choose an investment calculator](/guides/how-to-choose-an-investment-calculator/). See all our [free financial calculators](/calculators/)." },
      { question: "I only have a little money to invest — is it even worth starting?", answer: "Yes, you can start investing with as little as $1. Many major brokerages, including [Fidelity](https://www.fidelity.com/trading/fractional-shares) and [Schwab](https://www.schwab.com/brokerage), have a $0 account minimum. Both also let you buy fractional shares for as little as $1. That means you don't need thousands of dollars saved before you begin. Fractional shares let you own a slice of an expensive stock without buying a full share. Your starting amount matters less than consistency. Step three of the 4-step starter framework above is automating a small recurring contribution. Even $25 or $50 a month adds up if it happens automatically, before you can spend the money. See how steady small contributions add up over time with the [dollar-cost averaging calculator](/investing/dollar-cost-averaging-calculator/)." },
      { question: "Can this calculator model biweekly, quarterly, or increasing contributions?", answer: "Not directly. It applies one fixed monthly contribution across your entire timeline, with no separate input for biweekly or quarterly deposits, a one-time lump sum, or a contribution that steps up over time. For biweekly contributions, multiply your biweekly amount by 26 pay periods a year and divide by 12 to get the equivalent monthly figure to enter above. For quarterly, multiply by 4 and divide by 12. To model a raise or a planned increase, run the calculator once per contribution amount: enter your current monthly figure for the years until your next change, note the ending balance, then run it again using that ending balance as your new starting balance and the higher monthly amount for the next stretch. Chaining segments this way builds the same year-by-year schedule a spreadsheet with a changing contribution column would produce." },
      { question: "Does this calculator adjust for inflation?", answer: "No, this calculator projects nominal returns, not inflation-adjusted (real) returns. The annual return rate you enter compounds on its own without subtracting inflation's effect on purchasing power. To approximate a real return, subtract your expected inflation rate from your return rate before entering it, so a 7% nominal return minus roughly 3% average inflation is close to a 4% real return. A nominal projection answers what your account balance will actually read. A real return answers what that balance will be worth in today's dollars." },
      { question: "What compounding formula does this calculator use?", answer: "This calculator compounds monthly using the standard future-value-with-contributions formula: FV = P × (1 + r)^n + PMT × [((1 + r)^n − 1) ÷ r], where P is your starting balance, PMT is your monthly contribution, r is your annual return divided by 12, and n is your number of months (years × 12). Enter the same P, PMT, r, and n into a spreadsheet's FV function, written as FV(rate, nper, -payment, -pv), and it reproduces the balance the calculator shows." },
      { question: "What does a 10-year example look like?", answer: "Using the same $10,000 starting balance and $500 monthly contribution from the example above, a 7% annual return over 10 years grows to roughly $106,600. You contribute $70,000 of that total, $10,000 upfront plus $500 for 120 months, and compounding adds about $36,600 in growth. Growth is a smaller share of the total than in the 20-year example above, because compounding needs more time to overtake your own deposits. Run the same inputs for 20 years instead and growth of $170,851 outpaces the $130,000 you put in." },
      { question: "Does this calculator include dividend reinvestment?", answer: "Only if you build it into the return rate you enter. This calculator applies a single blended annual return. It doesn't separately model price appreciation and dividend payouts. Enter a total-return rate, one that already assumes dividends are reinvested, rather than a price-only rate if you want dividends reflected in your projection. For a dedicated walkthrough of dividend reinvestment (DRIP) math and its tax caveats, see our [dividend reinvestment calculator](/investing/dividend-calculator/)." },
      { question: "Does this calculator work outside the United States?", answer: "The calculator itself is USD-based and its examples use U.S. figures, but the compound-growth formula behind it works the same in any currency. Enter your own starting balance and contribution in your local currency and the math still applies. Just use your own country's typical investment return instead of the U.S. figures cited on this page. For appraisal math (NPV, IRR, payback period) that also applies globally, see our [investment appraisal methods guide](/guides/investment-appraisal-methods-npv-irr/). To benchmark net worth internationally rather than project growth, see the [international net worth calculator](/net-worth/net-worth-calculator-international/)." },
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
      "Free online portfolio calculator — no app or spreadsheet needed. Enter stocks, bonds, real estate, and cash to estimate return, risk, Sharpe ratio, and growth.",
    targetKeyword: "portfolio calculator",
    h1: "Portfolio Calculator",
    introText:
      "This portfolio calculator estimates your investment mix's expected return, risk, and long-term growth from how your money is split across stocks, bonds, real estate, and cash. Enter your holdings in the calculator above to see your projected return, volatility, and Sharpe ratio in seconds. The figures use long-run historical averages as model assumptions, so treat them as estimates, not guarantees. Use it to test how shifting your asset mix changes the balance between reward and risk. It models an unleveraged mix only — if you're borrowing against the account itself, see our guide to [portfolio margin and leverage](/guides/portfolio-margin-and-leverage-explained/) for how that risk works instead.",
    howItWorks:
      "The portfolio calculator turns your asset mix into three core numbers: expected return, volatility, and the Sharpe ratio. Expected return is the weighted average of each asset class's long-run estimate. Volatility measures how much your value may swing year to year, and it accounts for how assets move together. Because stocks and bonds often move differently, holding both lowers volatility more than it lowers return. That is diversification, sometimes called the only free lunch in investing.\n\nThe Sharpe ratio equals expected return minus the 2.5% risk-free rate, divided by volatility, so it rewards return per unit of risk. A 100% stock mix has a higher expected return but usually a worse Sharpe ratio than a diversified mix. Take a balanced $100,000 portfolio of $60,000 stocks, $30,000 bonds, and $10,000 cash, contributing $500 a month. It shows a 7.45% expected return, 9.87% volatility, and a 0.50 Sharpe ratio. These outputs rest on model assumptions drawn from historical averages, so they are estimates, not promises of future results. Dig deeper with the [asset allocation calculator](/portfolio/asset-allocation-calculator/) and the [portfolio risk calculator](/portfolio/portfolio-risk-calculator/).\n\nThis calculator models pre-tax return and risk, not what you actually keep after taxes. If part of your mix sits in a regular taxable brokerage account, selling a winner to rebalance or fund a goal triggers capital gains tax. That tax shrinks the return shown above before it ever reaches your pocket. The [taxable vs. tax-deferred calculator](/taxable-vs-tax-deferred/) shows how much that tax bite costs over time compared with holding the same mix inside a 401(k) or IRA.\n\nIf retirement is why you're running these numbers, treat this calculator as one piece of a bigger plan. The [retirement calculator](/retirement/) layers your Social Security estimate, savings rate, and withdrawal plan on top of the return and risk figures shown here. Together they show whether this specific asset mix actually gets you to your retirement goal.",
    faqs: [
      { question: "What does this portfolio calculator do?", answer: "This portfolio calculator analyzes your asset mix to estimate expected return, risk, and long-term growth. You enter how much you hold in stocks, bonds, real estate, and cash. It then returns a weighted expected return, a portfolio volatility figure, and a Sharpe ratio. To go deeper on any one piece, try the [asset allocation calculator](/portfolio/asset-allocation-calculator/) or the [expected return calculator](/portfolio/expected-return-calculator/)." },
      { question: "How does diversification lower my risk?", answer: "Diversification lowers risk by spreading money across assets that do not move together. The SEC notes that diversification can limit losses when one investment falls but others hold up. Because stocks and bonds often move in different directions, a blended portfolio swings less than a single asset class. This is why volatility can drop more than expected return, giving you a better risk-adjusted result. Read the volatility figure above as your portfolio's diversification score. The lower it sits compared with an all-stock mix, the more your holdings are actually spreading risk instead of moving together." },
      { question: "What is a good Sharpe ratio?", answer: "A higher Sharpe ratio is better because it means more return per unit of risk. The example balanced portfolio above shows a Sharpe ratio of 0.50. A 100% stock mix may earn a higher expected return but often posts a lower Sharpe ratio, since its risk rises faster than its reward. Use the [portfolio risk calculator](/portfolio/portfolio-risk-calculator/) to compare risk-adjusted results across mixes." },
      { question: "Are the return and risk figures guaranteed?", answer: "No, the figures are estimates, not guarantees. They use long-run historical averages as model assumptions, such as 10% expected return for stocks and 4% for bonds. Real markets vary widely from year to year, and past performance does not predict future results. In the example, a typical year for the balanced portfolio could range from about $97,583 to $117,317. To see how a specific mix would have actually performed across real historical market cycles instead of a model estimate, compare the [best portfolio backtesting tools](/roundup/best-portfolio-backtesting-and-analysis-tools/)." },
      { question: "What growth can a balanced portfolio show over time?", answer: "Growth depends on your mix, contributions, and time horizon. In the example, a $100,000 balanced portfolio with $500 monthly contributions projects to about $679,255 over 20 years. Of that total, $220,000 is contributions and $459,255 is estimated growth. The classic 60/30/10 split is close to a [60/40 portfolio calculator](/portfolio/60-40-portfolio-calculator/) mix, and you can compare more tools on our [calculators](/calculators/) page." },
      { question: "What do portfolio alpha, attribution, and tracking error actually measure?", answer: "Alpha measures the return your portfolio earned above what a benchmark like the S&P 500 would predict for the same amount of risk. Attribution splits that gap into two pieces: how much came from your overall asset mix, and how much came from the specific holdings you picked. Tracking error measures how closely your return follows a chosen benchmark day to day. Duration measures how much a bond's price moves for each 1% change in interest rates. This calculator computes your expected return, volatility, and Sharpe ratio directly, and each of those other measures is built from those same inputs. It doesn't output a separate alpha, attribution, or duration number for every holding. A portfolio concentrated in one stock shows higher volatility here than the same money spread across stocks, bonds, real estate, and cash. That volatility gap is the same risk alpha, attribution, and concentration analysis are all trying to describe in more specialized terms. For the exact formula behind beta, variance, turnover, and NAV, with worked examples, see our [portfolio metrics formulas guide](/guides/portfolio-metrics-formulas-explained/)." },
      { question: "How do fees affect my portfolio return?", answer: "Fees reduce your return every year, and because your portfolio compounds, that reduction compounds too. Take the balanced $100,000 portfolio example above, growing at a 7.45% expected return with $500 added monthly: over 20 years it reaches about $679,255. Add a 1% annual fund fee and the return drops to 6.45%. The same portfolio then reaches only about $580,764, a gap of roughly $98,490 lost to fees alone over the same 20 years. Run your own numbers through the calculator above at a lower return to see what a real fund fee would cost your specific mix." },
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
    introText:
      "The rental property calculator above shows whether a single-family rental is a smart investment. Enter the purchase price, rent, loan terms, and expenses to see cash flow, cap rate, cash-on-cash return, and long-term ROI in seconds. It works for first-time buyers and seasoned landlords alike. The detailed guides below break down each metric so you can read your results with confidence.",
    howItWorks:
      "A rental property calculator estimates your profit by subtracting all costs from your rental income. It starts with effective gross income, which is your annual rent minus a vacancy allowance. Then it subtracts operating expenses like taxes, insurance, maintenance, and management to find net operating income (NOI). Finally, it subtracts your mortgage payment to reveal your cash flow.\n\nFour numbers tell the story. NOI is income after operating costs but before the loan. Cap rate is NOI divided by purchase price, a quick way to compare deals. Cash flow is the cash left each month after the mortgage. Cash-on-cash return is annual cash flow divided by the cash you invested.\n\nReal estate investing fundamentals for first-time buyers. Cap rate compares deals as if you paid cash — use the [cap rate calculator](/real-estate/cap-rate-calculator/) to screen properties in seconds. Cash-on-cash return measures the yield on your actual down payment, which is what a leveraged investor really earns; the [cash flow calculator](/real-estate/cash-flow-calculator/) shows both. The 1% rule (monthly rent ≥ 1% of purchase price) is a screening shortcut, not a verdict — most deals in expensive metros fail it, so run the full numbers before you walk away. Leverage cuts both ways: a mortgage magnifies your return when rents rise and your losses when values fall, so early on prioritize positive cash flow over hoped-for appreciation. Beginners lose more money to bad cash flow than to bad markets. Rental cash flow is one of the classic streams covered in our [passive income ideas guide](/guides/passive-income-ideas/), alongside dividends and interest.\n\nTaxes are where rentals quietly beat other investments. IRS Publication 527 lets you depreciate the building (not the land) over 27.5 years using GDS, which creates a paper loss that shelters real rental income. You can also deduct mortgage interest, property taxes, insurance, repairs, and management fees. A 1031 like-kind exchange lets you sell one rental and roll the gain into another without paying capital gains tax — the rules are strict on timing and property use, so read Pub 527 and consult a CPA before you file. This is general information, not tax advice. The [ROI calculator](/real-estate/roi-calculator/) helps you compare total returns across properties before you commit.",
    faqs: [
      { question: "How does a rental property calculator work?", answer: "A rental property calculator subtracts your vacancy loss, operating expenses, and mortgage payment from your rental income. Take this example: a $350,000 home with 25% down rents for $2,800 a month. After a 5% vacancy allowance, taxes, insurance, maintenance, and management, the net operating income is $20,844 a year. The mortgage of $1,746 a month leaves cash flow near break-even, about -$9 a month." },
      { question: "Is a break-even rental property still a good investment?", answer: "Yes, a near break-even property can still earn a strong return. In the example above, monthly cash flow is roughly -$9, yet the 20-year annualized return (IRR) is 9.45%. Two forces drive this: the property appreciates over time, and each mortgage payment builds your equity. Cash flow is only part of the picture, so judge a deal on total return, not just monthly profit." },
      { question: "What is a good cap rate and cash-on-cash return?", answer: "Cap rate and cash-on-cash return depend on your market, but here is what the example shows. The cap rate is 5.96%, found by dividing the $20,844 NOI by the $350,000 price. The cash-on-cash return is -0.12%, the annual cash flow of about -$113 divided by the $98,000 invested. Use the [cap rate calculator](/real-estate/cap-rate-calculator/) and [cash-on-cash return calculator](/real-estate/cash-on-cash-return-calculator/) to test your own numbers." },
      { question: "What does DSCR mean for a rental property?", answer: "DSCR (debt service coverage ratio) measures whether rent covers the mortgage. It divides net operating income by your annual loan payment. In the example, the DSCR is 0.99, just under 1.0. A DSCR below 1 means the property's income does not fully cover the loan payment, so you must add cash to make up the gap. Many lenders want a DSCR of 1.2 or higher. A DSCR loan for an investor who already carries several other financed properties is often a [portfolio loan](/guides/portfolio-loan-mortgage-explained/) the lender keeps in-house rather than sells, which changes what it costs." },
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
    metaTitle: "Net Worth Calculator: Quick, Easy & Free",
    metaDescription:
      "Free net worth calculator. Add assets, subtract debts, and compare your total to Federal Reserve median net worth by age.",
    targetKeyword: "net worth calculator",
    h1: "Net Worth Calculator",
    introText:
      "This free net worth calculator adds your assets, subtracts your debts, and shows where you stand against Federal Reserve benchmarks. Enter cash, investments, retirement accounts, home equity, and vehicles, then list mortgages, loans, and credit card balances in the calculator above. You will see your total net worth, your [liquid net worth](/net-worth/liquid-net-worth-calculator/), and your debt-to-asset ratio in seconds.",
    howItWorks:
      "Net worth equals everything you own minus everything you owe. The Federal Reserve's 2022 Survey of Consumer Finances reports median net worth that rises sharply with age: $39,000 under 35, $135,600 at 35–44, $247,200 at 45–54, $364,500 at 55–64, $409,900 at 65–74, and $335,600 at 75 or older. The median is the better yardstick than the average (mean), because a small number of very wealthy households pulls the average sharply higher.\n\nTake a sample household with a 40-year-old head: $550,000 in total assets ($15,000 cash, $40,000 taxable investments, $120,000 retirement, $350,000 home, $25,000 vehicles) and $296,000 in total debts ($250,000 mortgage, $18,000 auto, $22,000 student loans, $6,000 cards). Net worth is $254,000, about $118,400 above the 35–44 median of $135,600. Liquid net worth, however, is -$241,000 because only $55,000 of those assets are liquid. That gap is why homeowners often look wealthier than they feel. Learn the full method on [how to calculate net worth](/net-worth/how-to-calculate-net-worth/). Households crossing the seven-figure mark often start weighing professional help — see our guide on [how to choose a financial advisor](/guides/how-to-choose-a-financial-advisor/) for what to look for.\n\nKnow your net worth — now protect it for your family. Once you cross a few hundred thousand in combined assets (especially with kids or cross-state property), a will alone stops being enough and the calculus flips to probate avoidance, guardianship, and — above roughly $15M federal or a state estate tax threshold — estate tax planning. Our [estate planning calculator](/estate-planning/) maps your specific net worth and family situation to the right plan tier (simple will, complex will, revocable trust, or full estate plan), and the [estate tax calculator](/estate-planning/estate-tax-calculator/) shows your federal + state exposure using the 2026 numbers.",
    faqs: [
      { question: "What is a net worth calculator?", answer: "A net worth calculator totals your assets and subtracts your liabilities to show what you would have left if you sold everything and paid off every debt. The calculator above does this instantly and benchmarks the result against Federal Reserve median net worth data by age." },
      { question: "What is a good net worth for my age?", answer: "A good benchmark is the Federal Reserve SCF median for your age bracket: $39,000 under 35, $135,600 at 35–44, $247,200 at 45–54, $364,500 at 55–64, and $409,900 at 65–74. See age-by-age targets in our [net worth by age calculator](/net-worth/net-worth-by-age-calculator/)." },
      { question: "Why is mean net worth so much higher than median?", answer: "Mean net worth is much higher than median because wealth in the U.S. is heavily skewed toward the top. A small share of ultra-wealthy households pulls the average up, so the median is the better yardstick for a typical family." },
      { question: "What is liquid net worth and why does it matter?", answer: "Liquid net worth counts only assets you can convert to cash quickly, like checking, savings, and taxable investments, minus your total debt. It often surprises homeowners because home equity and retirement accounts are not liquid. Try the [liquid net worth calculator](/net-worth/liquid-net-worth-calculator/) for the full picture." },
      { question: "What counts as an asset versus a liability?", answer: "Assets are things you own with cash value: bank accounts, investments, retirement accounts, real estate, and vehicles. Liabilities are debts you owe: mortgages, auto loans, student loans, and credit card balances. The calculator above walks you through each category." },
      { question: "How often should I recalculate my net worth?", answer: "Recalculate your net worth once a quarter. That cadence catches investment swings, debt paydown, and home value changes without becoming noise. Bookmark the calculator above, or if you'd rather build your own running spreadsheet, see our [net worth spreadsheet template guide](/guides/net-worth-calculator-spreadsheet-template/). For a broader comparison of calculators and linked-account tracking apps, see [best net worth tracking tools](/roundup/best-net-worth-tracking-tools/). Not sure which calculator to run first, or how they connect to each other? See [how to use a financial planning calculator](/guides/financial-planning-calculator/). Or browse more tools at [our calculator hub](/calculators/)." },
      { question: "Why does net worth matter?", answer: "Net worth matters because it nets out everything you own against everything you owe, which reads your financial position more clearly than income alone. Two people earning the same salary can carry very different net worth, since one may hold high debt and low savings while the other has paid down debt and built assets. Tracking the number over time shows whether you're actually building wealth or just moving money around, because a rising net worth means assets are growing faster than debt. For how your own number compares to others your age, see our [net worth by age calculator](/net-worth/net-worth-by-age-calculator/)." },
      { question: "How does net worth relate to retirement readiness?", answer: "Net worth relates to retirement readiness through your invested assets specifically, not your total net worth. Home equity and a paid-off car count toward net worth but don't produce retirement income unless you sell or borrow against them, so readiness depends on retirement accounts and other invested assets rather than the full total. Run your full retirement plan with our [retirement calculator](/retirement/), or check whether your current invested assets have already grown large enough to coast to that number on their own with the [Coast FIRE calculator](/coast-fire/)." },
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
    introText:
      "A budget calculator splits your take-home pay across needs, wants, and savings so every dollar has a plan. The calculator above uses the popular 50/30/20 rule — 50% of income to needs, 30% to wants, and 20% to savings and debt payoff — and includes a zero-based mode for budgeting every dollar to zero. Enter your monthly income and spending to see your targets, where you're over, and how much is left to assign. For example, on $5,000 a month after tax, the 50/30/20 rule sets aside $2,500 for needs, $1,500 for wants, and $1,000 for savings.",
    howItWorks:
      "A budget works by comparing what you earn to what you plan to spend, then steering the gap toward your goals. The calculator above groups spending into three buckets. Needs are costs you can't skip — housing, utilities, groceries, transportation, insurance, and the minimum payments on your debts. Wants are lifestyle choices like dining out, subscriptions, travel, and — often overlooked — [an annual-fee credit card whose perks you don't actually use](/guides/credit-card-perks-worth-it/). Savings covers your emergency fund, retirement and investing, and any extra debt payoff above the minimum.\n\nThe 50/30/20 rule, popularized by Senator Elizabeth Warren in her book All Your Worth, recommends 50% of after-tax income for needs, 30% for wants, and 20% for savings and debt. These are guidelines, not laws — in high-cost areas, needs often run higher, which simply means a smaller wants bucket. The zero-based method, used by Dave Ramsey's EveryDollar and others, takes a different angle: income minus expenses should equal zero, so every dollar is assigned a job before the month begins. Use the toggle above to switch between the two. To turn your leftover into wealth, see how to [grow your savings](/investing/) and [track your net worth](/net-worth/).\n\nHow to make a budget in 5 steps. First, tally your monthly take-home pay — the amount that actually hits your bank account after taxes and payroll deductions. Second, list every expense, splitting fixed costs (rent, insurance, loan payments) from variable ones (groceries, gas, dining). Third, pick a framework: the [50/30/20 rule](/budget/50-30-20-budget-calculator/) if you want a quick guardrail, zero-based if you want tight control, or a [household budget](/budget/household-budget-calculator/) approach if two incomes fund one plan. Fourth, allocate leftover income to savings and debt payoff before wants — the CFPB's Money Smart guide calls this \"paying yourself first.\" Fifth, review once a month and adjust; a budget only works if it survives contact with real spending.\n\nHow to create a family budget adds three layers. Child care and education are often the second-largest line after housing — the BLS Consumer Expenditure Survey shows families with children spend 5–15% of income here, so treat it as a need, not a want. Joint accounts simplify the math but require a monthly money check-in so no one is surprised. Build a \"kid inflation\" buffer for growth spurts, school fees, and activities that arrive in lumpy bursts. The [monthly budget calculator](/budget/monthly-budget-calculator/) handles single-earner households; the [household budget calculator](/budget/household-budget-calculator/) is built for two incomes and shared bills.\n\nA looser cousin of 50/30/20 worth knowing is the 70/20/10 rule: 70% of income for everyday living expenses, 20% for savings, and 10% for debt payoff or giving. The appeal is simplicity — only three numbers instead of the finer needs/wants split 50/30/20 requires. The trade-off is real: lumping needs and wants into one 70% bucket makes it harder to spot which part of that spending is optional, so a household that could easily cut wants to escape high-interest debt may not notice the room to do it. 70/20/10 tends to fit best for disciplined savers with modest fixed costs and little or no high-interest debt; it fits worst for anyone carrying credit card balances, since the plan has no built-in signal to prioritize debt payoff the way 50/30/20's separate wants bucket does. If your fixed costs are unusually low relative to income, run both frameworks through the calculator above and see which produces a savings target you'll actually hit.",
    faqs: [
      { question: "What is a budget calculator?", answer: "A budget calculator totals your take-home income and planned spending to show whether you have a surplus or a shortfall, and how your spending compares to recommended targets. The calculator above splits your money into needs, wants, and savings using the 50/30/20 rule, or lets you budget every dollar to zero." },
      { question: "What is the 50/30/20 budget rule?", answer: "The 50/30/20 rule allocates 50% of your after-tax income to needs, 30% to wants, and 20% to savings and debt payoff. It comes from Senator Elizabeth Warren's book All Your Worth and is the most widely used quick-start budgeting framework because it needs just one number — your monthly take-home pay." },
      { question: "What is the 70/20/10 budget rule and how does it compare to 50/30/20?", answer: "The 70/20/10 rule allocates 70% of income to everyday living expenses, 20% to savings, and 10% to debt payoff or giving — one broad spending bucket instead of 50/30/20's separate needs and wants categories. It's simpler to set up, but because needs and wants are combined, it's harder to tell how much of that 70% is actually optional, which can hide room to cut spending and pay down debt faster." },
      { question: "Is the 70/20/10 budget a good idea if I have credit card debt?", answer: "Usually not as a starting point. Because 70/20/10 lumps needs and wants together and only sets aside 10% for debt, it doesn't force the same scrutiny of discretionary spending that 50/30/20's separate wants bucket does — and high-interest debt can grow faster than a flat 10% allocation pays it down. The 50/30/20 rule or a zero-based budget generally works better once you're actively paying off debt; see what [credit score you'd need for a 0% APR balance transfer card](/guides/credit-score-for-0-apr-credit-card/) as a faster way to attack the balance." },
      { question: "Should I use gross or take-home income for a budget?", answer: "Use take-home (after-tax) income — the amount that actually lands in your account. The 50/30/20 rule is built on after-tax pay. If you save for retirement through payroll deductions, you can add that back in and count it inside your 20% savings bucket." },
      { question: "What is zero-based budgeting?", answer: "Zero-based budgeting assigns every dollar of income a specific job until income minus expenses equals zero. It doesn't mean spending everything — money sent to savings or debt counts as a job. This is the method behind Dave Ramsey's EveryDollar app, and you can switch to it with the toggle in the calculator above." },
      { question: "Do minimum debt payments count as a need or savings?", answer: "Minimum required debt payments are needs — they're non-negotiable, so they belong in the 50% bucket. Any extra you pay above the minimum to get out of debt faster counts in the 20% savings and debt-payoff bucket. Keeping the two separate is the most common 50/30/20 mistake. If credit card debt is the target, see what [credit score a 0% APR card typically needs](/guides/credit-score-for-0-apr-credit-card/) before assuming a balance transfer is an option." },
      { question: "How much of my income should I save?", answer: "The 50/30/20 rule targets 20% of take-home pay for savings and debt payoff combined. If you have high-interest debt, focus that 20% on eliminating it first, then redirect it to an emergency fund and investing. See the [savings goal calculator](/investing/savings-goal-calculator/) to plan a target, or read [how to use a financial planning calculator](/guides/financial-planning-calculator/) to see how your savings rate connects to net worth and retirement readiness." },
      { question: "Can selling unused PTO help me hit a savings goal faster?", answer: "It can, if your employer offers a leave sell-back or PTO buyback option. Use the [PTO cash-out calculator](/pto-cashout/) to see the gross and estimated net payout from selling a specific number of days, then route that lump sum straight into the savings or debt-payoff bucket above." },
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
    introText:
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

  // ---- Pillar 2: Professional Services — Estate Planning ----
  // Grounded in IRS Rev. Proc. 2025-32 (2026 federal $15M exemption, permanent under OBBBA),
  // state DOR pages for the 12 estate-tax states + 5 inheritance-tax states, ABA fee surveys
  // for attorney costs, and Uniform Law Commission for UPC/UPAA adoption.
  // Engine: src/lib/estate-planning-hub.ts. Island: EstatePlanningHubCalculator.
  {
    id: "estate-planning",
    islandId: "estate-planning",
    label: "Estate Planning",
    navOrder: 10,
    metaTitle: "Estate Planning Calculator: What Do You Actually Need?",
    metaDescription:
      "Free estate planning calculator. Answer 6 questions to see whether a simple will, living trust, or full estate plan fits your situation.",
    targetKeyword: "estate planning calculator",
    h1: "Estate Planning Calculator: What Do You Actually Need?",
    introText:
      "An estate planning calculator maps your family and asset situation to the specific documents you need — from a simple will up to a full estate plan with irrevocable trusts. The calculator above does this in seconds using six inputs: state, net worth, marital status, kids, cross-state property, and any special-needs dependents. For a married couple with kids and $850,000 in net worth living in California, the recommendation is a will with guardianship nomination, durable powers of attorney, and healthcare directives — attorney cost $750 to $2,500, or $199 to $299 through online services like Trust & Will or LegalZoom. For the full document checklist, the DIY-vs-attorney decision, and the right order to tackle them, see our [first-time estate planning guide](/guides/first-time-estate-planning/).",
    howItWorks:
      "Estate planning breaks down into five tiers, and the right tier depends on the ratio of your family complexity to your net worth. The calculator above evaluates six inputs and routes you to one of them, each with a specific document list and a cost band.\n\nTier 1 is a simple will for a single person with no children and no cross-state property. Even someone young, healthy, and unmarried benefits from at least the healthcare directive and power of attorney, as our [first-time estate planning guide](/guides/first-time-estate-planning/) explains. A last will and testament, [durable power of attorney](/compare/power-of-attorney-vs-guardianship/), and advance healthcare directive cover the essentials. Attorney cost is $300 to $800; FreeWill offers all three at $0 (monetized via nonprofit partnerships) and Trust & Will's individual will is $199. Skip the will and your estate passes under your state's intestacy laws instead of your own wishes; the probate court then decides who administers it. See what actually happens if you die without any estate plan at all in our review of the [best estate planning software](/roundup/best-estate-planning-software/). See the [probate calculator](/probate/) for what that costs and how long it takes. Tier 2 is a moderate will for a single parent or a married couple without kids — it adds guardian nomination or spousal executor structure. Attorney $500 to $1,500; LegalZoom Basic $129 individual / $229 couple; Trust & Will $199 to $299. Tier 3 is a complex will for a married couple with kids: guardian nomination, executor, testamentary trust for the children until age 25 or 30, and a mandatory beneficiary designation review because 401(k), IRA, and life insurance designations override the will. Attorney $750 to $2,500; Trust & Will couple $299.\n\nTier 4 is a revocable living trust, needed when you own real estate or business interests in more than one state or when you have a special-needs dependent. A living trust holds title to real estate in every state and avoids ancillary probate — a separate probate proceeding in each state — that would otherwise duplicate cost and delay; see [living trust vs. probate](/compare/probate-vs-trust/) for the full cost and timeline comparison. If a special-needs dependent is involved, a Third-Party Special Needs Trust preserves the dependent's eligibility for means-tested benefits like SSI and Medicaid while providing supplemental resources. Attorney $1,500 to $5,000 for a straightforward revocable living trust; $3,500 to $7,500 when a Special Needs Trust is added. Trust & Will's trust product is $499 individual / $599 couple for simple facts. See the [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) for the full funding checklist and cost breakdown.\n\nTier 5 is a full estate plan for households above the federal or state estate tax exemption. It combines a revocable living trust with irrevocable structures — an ILIT for life insurance ($2,500–$4,000), a dynasty trust for generational transfers ($5,000–$10,000+), a Medicaid Asset Protection Trust ($3,000–$6,000), or a gifting trust to remove appreciating assets from the taxable estate. Attorney cost typically $5,000 to $15,000+; DIY tools are not appropriate at this net-worth tier.\n\nThe 2026 federal estate tax exemption is $15,000,000 per individual — permanent and indexed under the One Big Beautiful Bill Act (P.L. 119-21, July 2025), which amended IRC §2010(c)(3). Married couples can shield up to $30 million via portability by filing Form 706 at the first spouse's death, and the GST tax exemption mirrors at $15 million. The federal rate on the excess is a flat 40%. Twelve states plus DC impose their own estate tax with much lower thresholds — Oregon starts at $1 million, Massachusetts at $2 million, Washington at $3 million (with a rate reset from 35% to 20% effective July 1, 2026). Five states also impose an inheritance tax that hits beneficiaries directly regardless of estate size: Kentucky, Maryland, Nebraska, New Jersey, and Pennsylvania. Before you meet with an attorney or open an online service, run your household through the [net worth calculator](/net-worth/) — the plan tier hinges on that number and on the beneficiary designations feeding your [401(k) calculator](/retirement/401k-calculator/), because retirement-account beneficiaries override anything a will says. For your household's specific federal and state exposure, run the [estate tax calculator](/estate-planning/estate-tax-calculator/) directly.",
    faqs: [
      {
        question: "What is an estate planning calculator?",
        answer:
          "An estate planning calculator maps your family situation and net worth to the specific documents you need — from a simple will up through a full estate plan with irrevocable trusts. The calculator above evaluates six inputs (state, net worth, marital status, kids, cross-state property, special-needs dependents) and returns a plan tier with an attorney cost band, an online cost band, and the exact document list that tier includes.",
      },
      {
        question: "How much does estate planning cost?",
        answer:
          "Attorney estate planning costs run from $300 for a simple will (single, no kids) up to $15,000+ for a full estate plan with irrevocable trusts (net worth above the $15M federal exemption). Middle-of-the-road: $750–$2,500 for a married-with-kids will package, $1,500–$5,000 for a revocable living trust, $2,500–$4,000 for an ILIT. Online services are meaningfully cheaper: FreeWill is $0, Trust & Will is $199–$599, LegalZoom is $129–$299, and Nolo Quicken WillMaker is $99–$209 — they cover the simple-to-moderate tiers well but not the full-estate-plan tier.",
      },
      {
        question: "Do I need a living trust or is a will enough?",
        answer:
          "A will is enough for most households — a will is faster to draft, cheaper, and easier to update than a trust. You need a revocable living trust when at least one of three facts is true: you own real estate in more than one state (a trust avoids ancillary probate), you have a special-needs dependent (paired with a Third-Party Special Needs Trust to preserve SSI/Medicaid eligibility), or you want to avoid probate entirely for privacy or speed reasons. Below the estate tax exemption, a trust is a probate-avoidance tool, not a tax-avoidance tool.",
      },
      {
        question: "What is the 2026 federal estate tax exemption?",
        answer:
          "The 2026 federal estate tax exemption is $15,000,000 per individual, made permanent and indexed to inflation by the One Big Beautiful Bill Act (P.L. 119-21, signed July 2025), which amended IRC §2010(c)(3). The rate on the excess is a flat 40%. Married couples can shield up to $30 million by combining exemptions via portability (Form 706 election at the first spouse's death). The GST tax exemption mirrors at $15 million, and the annual gift tax exclusion for 2026 is $19,000 per donee. That $15,000,000 exemption applies only to a US citizen or resident — a nonresident alien gets a $60,000 exemption instead, covered in our guide to [US estate tax for non-citizens](/estate-planning/us-estate-tax-for-non-citizens/).",
      },
      {
        question: "Which states have their own estate tax in 2026?",
        answer:
          "Twelve states plus DC impose an estate tax in 2026, with exemptions much lower than the federal $15M: Oregon ($1M — the lowest), Massachusetts ($2M), Rhode Island ($1.84M, indexed), Washington ($3M with a rate reset from 35% to 20% effective 7/1/2026), Minnesota ($3M), Illinois ($4M), DC ($4.99M), Maryland ($5M — also has inheritance tax), Vermont ($5M), Hawaii ($5.49M), Maine ($7M), New York ($7.35M with a 105% cliff), and Connecticut ($15M, tied to federal). Five additional states impose an inheritance tax on beneficiaries: Kentucky, Maryland, Nebraska, New Jersey, and Pennsylvania.",
      },
      {
        question: "Can I do estate planning online?",
        answer:
          "Yes, for simple-to-moderate cases. Trust & Will ($199 individual will / $299 couple / $499–$599 trust) is the market leader, LegalZoom Basic Will is $129, and FreeWill is $0 through nonprofit partnerships. These services handle straightforward wills, POAs, and healthcare directives well. Online tools are not appropriate for revocable living trusts with real estate in multiple states, Special Needs Trusts, or any full estate plan above the estate tax exemption — those require attorney-drafted documents and, in most states, execution formalities that online tools cannot supervise.",
      },
      {
        question: "When should I update my estate plan?",
        answer:
          "Update your will, trust, and beneficiary designations after any major life change: marriage, divorce, a new child, a move to a new state, the death of a named executor or guardian, or a significant change in your net worth. Beneficiary designations on your 401(k), IRA, and life insurance override your will, so review those separately any time your life changes; a stale form can undo even a freshly updated will.",
      },
      {
        question: "Does estate planning work the same way in every state?",
        answer:
          "No, state law controls how a will must be signed and witnessed to be valid, small-estate and probate thresholds, and (for 12 states plus DC) whether an additional state estate or inheritance tax applies. Because the exact requirements differ by state, confirm your state's specific rules with a local attorney or your state courts' self-help resources before you sign anything.",
      },
      {
        question: "At what age should you start estate planning, and what is considered estate planning?",
        answer:
          "Estate planning is any legal and financial step that controls what happens to your money, property, and medical care if you become incapacitated or die. For most households that means four documents: a will, a power of attorney, a healthcare directive, and a review of your beneficiary designations, plus a trust for some situations. Start once any one of these applies to you: a spouse or partner, a minor child, real estate you own, or savings you'd want distributed on your own terms. For most people that point lands in their 20s or 30s, and definitely by the time they buy a first home or have a child. Waiting past that point doesn't remove the need. It just means the same documents get drafted later, often after life has already gotten more complicated to plan around.",
      },
    ],
    sources: [
      { label: "IRS Rev. Proc. 2025-32 — 2026 inflation adjustments (OBBBA)", url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" },
      { label: "IRS — Estate Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax" },
      { label: "IRS — 2026 inflation adjustments (One Big Beautiful Bill Act)", url: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill" },
      { label: "IRS — Estate Tax Portability (Form 706)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-estate-taxes" },
      { label: "ABA — Real Property, Trust and Estate Law Section", url: "https://www.americanbar.org/groups/real_property_trust_estate/" },
      { label: "Uniform Law Commission — Uniform Probate Code", url: "https://www.uniformlaws.org/" },
    ],
    defaultPreset: {
      married: true,
      kids: true,
      multipleStates: false,
      netWorth: 850000,
      state: "california",
      specialNeedsDependent: false,
    },
  },

  // ---- Pillar 3: Professional Services — Probate ----
  // Grounded in state probate codes (Cal. Prob. Code §10810 statutory fee schedule,
  // Fla. Stat. §733.6171, Iowa Code §633.197, Mo. Rev. Stat. §473.153, NY SCPA §2307,
  // plus reasonable-fee jurisdictions), Uniform Probate Code adoption, and state
  // small-estate thresholds. Engine: src/lib/probate-hub.ts.
  {
    id: "probate",
    islandId: "probate",
    label: "Probate",
    navOrder: 11,
    metaTitle: "Probate Calculator: What Will It Cost and How Long?",
    metaDescription:
      "Free probate calculator. Enter state and estate value to see total cost, timeline, small-estate options, and how much a living trust would have saved.",
    targetKeyword: "probate calculator",
    h1: "Probate Calculator: Cost, Timeline, and What a Trust Would've Saved",
    introText:
      "A probate calculator estimates the total cost and timeline of probating an estate in your state — attorney fees (statutory in 9 states, reasonable-fee in ~41), executor commission, court filing fees, and any ancillary probate for out-of-state real property. The calculator above applies the actual state fee schedule where one exists: California uses Cal. Prob. Code §10810 (4%/3%/2%/1%/0.5% tiers), Florida uses Fla. Stat. §733.6171 ($1,500 base + tiered percentages), and 7 other states have their own statutes. For a $750,000 moderate California estate, the total probate cost runs about $36,000–$42,000 over 15–30 months — versus $2,025–$6,750 for a revocable living trust that would have avoided probate entirely.",
    howItWorks:
      "Probate cost has four components. First, attorney fees — California, Florida, Iowa, Missouri, Montana, New York (executor only), Wyoming, Arkansas, Oklahoma, and New Jersey (executor only) set statutory schedules; every other state uses a reasonable-fee model at roughly 2-4% of gross estate. Second, executor commission — in California and Iowa, both the attorney and executor get the same statutory percentage, roughly doubling the bill. Third, court filing fees + publication + certified copies, typically $400-$1,500 uncontested, $900-$4,500 contested. Fourth, ancillary probate — a separate probate opened in each additional state where the decedent owned titled real property, running $2,000-$8,000 per additional state.\n\nTimelines vary sharply by state. Texas independent administration under Estates Code §401.001 closes in 3-6 months. Uniform Probate Code informal states (Utah, Colorado, Arizona, Minnesota, Idaho) close in 4-8 months. California takes 12-24 months because Prob. Code §9100's 4-month creditor claim period plus urban court backlogs push things out. New York Surrogate's Court runs 12-24 months for anything beyond voluntary administration (SCPA Article 13, available for personal property under $50,000). Contested probate — will contests, creditor litigation — runs 2-5 years everywhere.\n\nEvery state has a small-estate procedure that lets estates under a threshold skip full probate: California $208,850 (indexed 2025), Texas $75,000 excluding homestead, New York $50,000 personal property (SCPA Article 13), Florida $75,000 or death 2+ years old (summary administration), Wyoming $200,000. The calculator above flags when your estate qualifies. Below the threshold, fees drop to under $1,000 and timeline shortens to weeks.\n\nThe biggest single lever to reduce probate cost is a revocable living trust set up during life. Because trust assets don't pass through probate, the entire attorney-executor-court stack disappears. The [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) shows attorney fees of $1,500-$5,000 for a revocable trust in most states, $5,000-$10,000+ in California and other HNW metros. For any California estate over about $200,000 gross, the trust math wins decisively — a lesson probate teaches families the expensive way.",
    faqs: [
      {
        question: "What is a probate calculator?",
        answer:
          "A probate calculator estimates the total cost and timeline of probating an estate in your state. Inputs: state, gross estate value, complexity (uncontested vs contested), and number of additional states where real property is located (which triggers ancillary probate). The calculator above applies actual state fee schedules — California's Cal. Prob. Code §10810, Florida's Fla. Stat. §733.6171, and 7 other statutory states — and market-typical percentages for the ~41 reasonable-fee states.",
      },
      {
        question: "How much does probate cost?",
        answer:
          "Probate cost runs 3-8% of gross estate in most states for uncontested cases, or roughly $10,000-$60,000 for typical estates. In statutory-fee states like California, both the attorney and executor get the same percentage schedule (Cal. Prob. Code §10810), so total statutory fees roughly double: a $500,000 California estate faces about $26,000 in combined attorney + executor fees. Reasonable-fee states like Texas and Colorado run 2-4% of gross estate. Contested cases hit $50,000+ almost everywhere. Ancillary probate for real property in additional states adds $2,000-$8,000 per state.",
      },
      {
        question: "How long does probate take?",
        answer:
          "Uncontested probate takes 6-12 months in most states, 9-18 months with real estate, and 12-24 months in California and New York. Texas independent administration closes fastest (3-6 months). Uniform Probate Code informal states (Utah, Colorado, Arizona, Minnesota, Idaho) close in 4-8 months. California is slow because Prob. Code §9100 sets a 4-month creditor claim period plus urban courts run backlogs. Contested probate — will contests or creditor litigation — takes 2-5 years everywhere. Small-estate procedures bypass full probate and close in weeks.",
      },
      {
        question: "Which states have statutory probate fees?",
        answer:
          "Nine states set statutory attorney or executor fee schedules: California (Cal. Prob. Code §10810), Florida (Fla. Stat. §733.6171 attorney + §733.617 PR), Iowa (Iowa Code §633.197/198), Missouri (§473.153), Montana (§72-3-631), New York (SCPA §2307 executor only), Wyoming (§2-7-803), Arkansas (§28-48-108), Oklahoma (tit. 58 §527), and New Jersey (§3B:18-14, executor only). The other ~41 states use a 'reasonable fee' standard subject to court approval on contested cases and market-typical practice on uncontested cases (2-4% of gross estate typical).",
      },
      {
        question: "How can I avoid probate?",
        answer:
          "The most reliable way is a revocable living trust set up during life. Assets titled to the trust pass to beneficiaries at death without going through probate court. Other probate-avoidance tools: transfer-on-death deeds for real estate (available in ~30 states); pay-on-death designations on bank accounts; joint tenancy with rights of survivorship on real estate and vehicles; beneficiary designations on 401(k), IRA, and life insurance (these override wills and trusts). A living trust is the most comprehensive because it covers assets these individual tools miss. See the [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) for setup costs by state.",
      },
      {
        question: "What is ancillary probate?",
        answer:
          "Ancillary probate is a separate probate proceeding opened in each state (other than the decedent's domicile) where the decedent owned titled real property — real estate, mineral interests, sometimes vehicles/boats. The domicile-state probate must be opened first; the ancillary state then admits the domicile-state letters testamentary. Cost typically $2,000-$8,000 per additional state, plus 6-12 months of additional timeline. A revocable living trust that holds all real property avoids ancillary probate entirely because the trust doesn't die when the grantor does.",
      },
      {
        question: "How much does probate cost in Michigan, Missouri, Connecticut, South Dakota, or Virginia?",
        answer:
          "It varies widely because these five states don't all use the same fee model. Missouri sets a statutory attorney/executor percentage schedule (Mo. Rev. Stat. §473.153). Michigan and South Dakota use 'reasonable compensation' standards — Michigan with no percentage guideline at all, South Dakota with a non-binding one. Connecticut's statutory fee is actually a probate COURT fee (not an attorney or executor commission), capped at $40,000. Virginia has no attorney/executor fee statute but does levy a separate probate tax on the estate. See the [probate fee calculator](/probate/fee-calculator/) for the worked numbers and statute citations for each of these five states.",
      },
    ],
    sources: [
      { label: "Cal. Prob. Code §10810 — attorney statutory schedule", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=10810&lawCode=PROB" },
      { label: "Fla. Stat. §733.6171 — attorney presumed reasonable", url: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0733/Sections/0733.6171.html" },
      { label: "Iowa Code §633.197 — executor commission", url: "https://www.legis.iowa.gov/docs/code/633.197.pdf" },
      { label: "Mo. Rev. Stat. §473.153 — statutory fee", url: "https://revisor.mo.gov/main/OneSection.aspx?section=473.153" },
      { label: "NY SCPA §2307 — executor commissions", url: "https://www.nysenate.gov/legislation/laws/SCP/2307" },
      { label: "Uniform Law Commission — Uniform Probate Code", url: "https://www.uniformlaws.org/" },
      { label: "American College of Trust and Estate Counsel (ACTEC)", url: "https://www.actec.org/" },
    ],
    defaultPreset: {
      state: "california",
      estateValue: 750_000,
      complexity: "moderate",
      ancillaryStates: 0,
    },
  },

  // ---- Pillar 4: Professional Services — Elder Care ----
  // Grounded in 2026 CMS Medicaid figures (CIB 12/9/2025 — CSRA, MMMNA, home equity, income cap),
  // POMS SI 01120.199-.204 (Special Needs Trust rules under 42 U.S.C. §1396p(d)(4)), and the
  // CareScout 2025 Cost of Care Survey. OBBBA (P.L. 119-21) caps home equity at $1M eff. 1/1/2028.
  {
    id: "elder-care",
    islandId: "elder-care",
    label: "Elder Care",
    navOrder: 12,
    metaTitle: "Elder Care Planning Calculator: Medicaid + LTC Strategy",
    metaDescription:
      "Free elder care planning calculator. Assess Medicaid spend-down exposure, 5-year lookback deadlines, MAPT costs, and long-term care coverage gaps.",
    targetKeyword: "elder care planning calculator",
    h1: "Elder Care Planning Calculator: Protect Assets, Plan for LTC",
    introText:
      "An elder care planning calculator maps your age, assets, income, and long-term care outlook to the specific planning steps that protect assets from a $115,000-per-year median nursing home cost while preserving Medicaid eligibility. The calculator above applies the 2026 federal figures (Community Spouse Resource Allowance $32,532-$162,660, MMMNA minimum $2,644, institutional income cap $2,982/month) and the 60-month lookback under 42 U.S.C. §1396p(c). For a 62-year-old married couple with $550,000 in countable assets and possible LTC needs within 5 years, the recommendation is a Medicaid Asset Protection Trust ($3,000-$6,000 attorney-drafted) funded now — every month of delay compresses the lookback window and shifts assets from protected to countable.",
    howItWorks:
      "Elder care planning is the legal and financial preparation that protects an aging person's money, health decisions, and care options as their needs increase. Elder care itself is the broader term for the medical and daily-living support an older adult receives, anywhere from an in-home aide to a nursing home stay.\n\nElder care planning turns on three deadlines and one core rule. The core rule: Medicaid pays for long-term nursing home care once you qualify, but qualification requires countable assets under $2,000 (single) and CSRA-adjusted amounts for a community spouse. Medicare does NOT cover long-term custodial care — only up to 100 days of skilled nursing after a 3-day hospital stay (2026 days 21-100 = $217/day patient share). Private pay at the national median is $115,000/year for a semi-private nursing home room, or $129,575/year for a private room (CareScout 2025 Cost of Care Survey).\n\nDeadline 1: the 5-year Medicaid lookback. Transfers within 60 months of a Medicaid application trigger a penalty period equal to the transferred amount divided by the state's monthly divisor (California $14,440/month, Texas $7,900, Florida $10,645). Funding a Medicaid Asset Protection Trust (MAPT) — an irrevocable trust — 5+ years before application fully shields the assets; funding within 5 years creates partial exposure. This is why elder care planning starts in the mid-50s to early 60s: the earlier the trust is funded, the more assets it protects.\n\nDeadline 2: Community Spouse Resource Allowance (CSRA). If your spouse enters a nursing home while you remain in the community, federal law under 42 U.S.C. §1924(f) protects between $32,532 and $162,660 of assets for you (2026 figures per CMS CIB 12/9/2025). Above that, assets must be spent down or converted to exempt (home improvements, prepaid burial trust, spousal transfers). Attorney-guided spend-down converts countable to exempt at 1:1 ratios rather than the 50% you'd lose to private pay.\n\nDeadline 3: the 100-day Medicare skilled nursing window. After discharge from a hospital, Medicare covers days 1-20 fully and days 21-100 with a $217/day copay in 2026. Day 101 forward is 100% out-of-pocket until Medicaid qualification. Long-term care insurance ($2,200-$3,750/year for a 55-year-old single, $7,137-$12,250 at 65 per AALTCI 2025) fills this gap.\n\nGovernment programs beyond Medicaid also matter, and most elder-care planning conversations skip them. VA Aid & Attendance is an enhanced monthly payment added on top of the [VA Veterans Pension](https://www.va.gov/pension/aid-attendance-housebound/) for wartime veterans (and surviving spouses) who need help with daily activities like bathing and dressing, are substantially bedridden, or are in a nursing home — it requires an underlying pension award, which itself has net-worth and income limits set annually by the VA. Because the VA excludes unreimbursed recurring medical and care expenses (including assisted living and in-home care costs) when counting income for the pension, many veterans who look over-income on paper still qualify once those costs are deducted. PACE — the [Program of All-Inclusive Care for the Elderly](https://www.medicaid.gov/medicaid/long-term-services-supports/program-of-all-inclusive-care-for-elderly) — is a joint Medicare/Medicaid program for people 55 or older who need a nursing-home level of care but can still live safely in the community; an interdisciplinary team delivers medical care, adult day care, transportation, meals, and therapy through a local PACE center, financed by a capped monthly payment rather than fee-for-service billing. PACE primarily serves people dually eligible for Medicare and Medicaid, though Medicaid-only enrollees are also eligible where a local PACE program operates. Both programs interact with Medicaid planning rather than replace it: VA pension income generally still counts toward a state's Medicaid income limit, so a veteran pursuing both benefits should model the combined effect (ideally with an elder-law attorney) rather than assume they stack cleanly; PACE, by keeping someone at home under a Medicaid-funded plan of care, can reduce or delay the need for institutional Medicaid altogether, which changes the urgency and sizing of any MAPT or spend-down strategy.\n\nOne 2026 change worth flagging: California re-added a Medicaid asset test on January 1, 2026 after 2 years without one. Community Medi-Cal now applies a $130,000 individual / $195,000 couple asset limit — much higher than the federal $2,000, but a real cap that CA residents need to plan around. Every state's specific figures live in the [Medicaid spend-down calculator](/elder-care/medicaid-spend-down-calculator/). For long-term care cost projections, see the [long-term care cost calculator](/elder-care/long-term-care-cost-calculator/), and for special-needs family members the [special-needs trust calculator](/elder-care/special-needs-trust-calculator/). Working through the practical, non-Medicaid steps first — the care assessment, the legal documents, the family conversation? Our [elder care planning checklist](/guides/elder-care-planning-checklist/) walks through those six steps in order.",
    faqs: [
      {
        question: "What is an elder care planning calculator?",
        answer:
          "An elder care planning calculator assesses your Medicaid spend-down exposure, 5-year lookback deadline, and long-term care coverage gap. It applies the 2026 federal Medicaid figures — Community Spouse Resource Allowance $32,532-$162,660, MMMNA minimum $2,644, institutional income cap $2,982/month — and returns a plan tways with cost bands: Medicaid Asset Protection Trust $3,000-$6,000, third-party Special Needs Trust $2,500-$5,000, LTC insurance premiums by age.",
      },
      {
        question: "What is the Medicaid 5-year lookback?",
        answer:
          "Under 42 U.S.C. §1396p(c), Medicaid reviews all asset transfers made within 60 months before your application. Uncompensated transfers (including gifts to family, funding an irrevocable trust) trigger a penalty period equal to the transferred amount divided by the state's monthly divisor (California $14,440/month in 2026, Texas $7,900, Florida $10,645). A $200,000 transfer in California creates a ~14-month ineligibility period. Fund a MAPT more than 5 years before application and the lookback fully closes.",
      },
      {
        question: "What is CSRA (Community Spouse Resource Allowance)?",
        answer:
          "When one spouse enters a nursing home while the other remains in the community, federal spousal-impoverishment rules under 42 U.S.C. §1924 protect assets for the community spouse. The 2026 CSRA range is $32,532 minimum to $162,660 maximum (CMS CIB 12/9/2025). The community spouse can keep half the couple's countable assets up to the maximum, plus a minimum $2,644/month income allowance (MMMNA). Assets above the CSRA must be spent down before the institutional spouse qualifies for Medicaid.",
      },
      {
        question: "Does Medicare cover long-term care?",
        answer:
          "No — Medicare does NOT cover long-term custodial care. Medicare covers up to 100 days of skilled nursing after a qualifying 3-day inpatient hospital stay: days 1-20 fully covered, days 21-100 with a $217/day patient coinsurance in 2026, day 101+ is 100% patient responsibility until Medicaid qualifies or private funds run out. Private-pay nursing home costs are $114,975/year semi-private (national median, CareScout 2025). This is why long-term care insurance, MAPT planning, or spend-down strategy matters.",
      },
      {
        question: "What is a Medicaid Asset Protection Trust?",
        answer:
          "A Medicaid Asset Protection Trust (MAPT) is an irrevocable trust designed to remove assets from your countable Medicaid pool while allowing you to receive limited benefits (typically income, sometimes limited access). Attorney-drafted: $3,000-$6,000. Because it's irrevocable, transfers into a MAPT trigger the 5-year lookback under 42 U.S.C. §1396p(c) — fund it 5+ years before Medicaid application and it fully shields the assets. Fund it within 5 years and you face a penalty period. This is why MAPT planning starts in the mid-50s to early 60s.",
      },
      {
        question: "How much does long-term care cost?",
        answer:
          "National median costs from the CareScout 2025 Cost of Care Survey: home health aide $34/hour ($77,792/year full-time), adult day care $95/day, assisted living $6,200/month ($74,400/year), nursing home semi-private $315/day ($114,975/year), private $355/day ($129,575/year). State variation is dramatic: Alaska tops $330,000/year for nursing home care, while Texas is $65,700/year. See the [long-term care cost calculator](/elder-care/long-term-care-cost-calculator/) for your specific state and care type.",
      },
      {
        question: "What is VA Aid & Attendance and who qualifies?",
        answer:
          "VA Aid & Attendance is an increased monthly benefit added on top of the VA Veterans Pension (or Survivors Pension) for wartime veterans and surviving spouses who need help with daily activities, are substantially bedridden, or reside in a nursing home. It isn't a standalone benefit — you must first qualify for the underlying pension, which has its own net-worth and income limits set annually by the VA. Unreimbursed recurring care costs (assisted living, in-home aides) are deducted from countable income for the pension test, which is why many veterans who look over-income on paper still qualify. Current rates and the net-worth limit are published on va.gov and change every December; apply with VA Form 21-2680.",
      },
      {
        question: "What is PACE and how does it relate to Medicaid?",
        answer:
          "PACE (Program of All-Inclusive Care for the Elderly) is a joint Medicare/Medicaid program for people 55 or older who need a nursing-home level of care but can still live safely in the community. A PACE team provides medical care, adult day care, meals, therapy, and transportation, financed through a capped monthly payment instead of fee-for-service billing. It primarily serves people dually eligible for Medicare and Medicaid, though Medicaid-only enrollees can also qualify. PACE doesn't replace Medicaid planning — by keeping someone at home under a Medicaid-funded care plan, it can reduce or delay the need for institutional Medicaid, which changes how urgently a MAPT or spend-down strategy needs to be in place. Availability is local; not every county has a PACE program.",
      },
    ],
    sources: [
      { label: "CMS CMCS Informational Bulletin — 2026 SSI + Spousal Impoverishment Standards", url: "https://www.medicaid.gov/federal-policy-guidance/downloads/cib12092025.pdf" },
      { label: "42 U.S.C. §1396p — Medicaid transfers, home equity, estate recovery", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title42-section1396p" },
      { label: "42 U.S.C. §1924 — Spousal impoverishment (CSRA, MMMNA)", url: "https://www.law.cornell.edu/uscode/text/42/1396r-5" },
      { label: "CareScout 2025 Cost of Care Survey", url: "https://www.carescout.com/cost-of-care" },
      { label: "SSA POMS SI 01120.203 — Trusts (SNT rules)", url: "https://secure.ssa.gov/poms.nsf/lnx/0501120203" },
      { label: "Medicaid.gov — Home & Community Based Services (HCBS)", url: "https://www.medicaid.gov/medicaid/home-community-based-services/index.html" },
      { label: "Medicare.gov — Skilled Nursing Facility Care", url: "https://www.medicare.gov/coverage/skilled-nursing-facility-care" },
      { label: "VA.gov — Aid and Attendance benefits and Housebound allowance", url: "https://www.va.gov/pension/aid-attendance-housebound/" },
      { label: "Medicaid.gov — Program of All-Inclusive Care for the Elderly (PACE)", url: "https://www.medicaid.gov/medicaid/long-term-services-supports/program-of-all-inclusive-care-for-elderly" },
    ],
    defaultPreset: {
      age: 62,
      countableAssets: 550_000,
      monthlyIncome: 4_200,
      maritalStatus: "married-both-well",
      careRisk: "within-5-years",
      specialNeedsDependent: false,
    },
  },

  {
    id: "trump-account",
    islandId: "trump-account",
    label: "Trump Account",
    navOrder: 13,
    metaTitle: "Trump Account Calculator: $1,000 Value at 18",
    metaDescription:
      "See what a Trump Account investment could be worth at 18 — also called a Trump savings or baby account. Project the $1,000 federal seed plus your contributions.",
    targetKeyword: "trump account calculator",
    h1: "Trump Account Calculator",
    introText:
      "A Trump Account calculator projects how the new $1,000 federal seed, plus the contributions you add each year, could grow by the time your child turns 18. Enter your child's age, the seed, and how much your family (and any employer) adds each year in the calculator above to see the projected value. For example, a newborn's $1,000 seed plus $200 a month at a 7% annual return grows to about $89,657 by age 18 — $44,200 put in and $45,457 in tax-deferred growth.",
    howItWorks:
      "The calculator above starts with the seed deposit, adds your yearly contributions in monthly steps, and compounds the balance at the return you choose until the child turns 18. Trump Accounts launched on July 4, 2026: the federal government seeds $1,000 for each U.S.-citizen child born between 2025 and 2028, and the money must be invested in a low-cost fund that tracks the S&P 500 or a similar U.S.-stock index. Growth is tax-deferred, and withdrawals are generally blocked until January 1 of the year the child turns 18 — after which the account is taxed like a traditional IRA.\n\nContributions are capped. Families, relatives, and friends can add up to $5,000 per year combined, and an employer can chip in up to $2,500 — but that employer money counts toward the same $5,000 cap, not on top of it. The $1,000 federal seed does not count against the cap. Going over the cap has a real consequence beyond the calculator: contributing beyond the cap can trigger IRS correction requirements. The calculator mirrors that boundary by trimming anything you enter above the limits and showing a warning, so your projection reflects what the law actually allows.\n\nTime does the heavy lifting. The $1,000 seed alone, left untouched at a 7% return, grows to about $3,513 by age 18. Add $200 a month and the balance reaches roughly $89,657. Max out the $5,000 yearly limit from birth and it grows to about $182,980 — of which about half is growth you never contributed. This calculator only projects out to age 18, since that's when the account unlocks. For a longer horizon, like what $1,000 could grow into over 20 years, use the [compound interest calculator](/investing/compound-interest-calculator/) instead. To compare that path against other accounts, see [Trump Account vs 529](/compare/trump-account-vs-529/), [Trump Account vs a custodial account](/compare/trump-account-vs-custodial-account/), [Trump Account vs a savings account](/compare/trump-account-vs-savings-account/), [Trump Account vs a brokerage account](/compare/trump-account-vs-brokerage-account/), [Trump Account vs a Roth IRA](/compare/trump-account-vs-roth-ira/), and [Trump Account vs baby bonds](/compare/trump-account-vs-baby-bonds/), or read [what a Trump Account is and how to open one](/guides/trump-accounts/). For step-by-step setup see [how to open a Trump Account](/guides/how-to-open-a-trump-account/), the full [contribution rules](/guides/trump-account-rules/), and [what the account is invested in](/guides/what-are-trump-accounts-invested-in/). To pressure-test whether it's the right home for your money, see [are Trump Accounts worth it](/guides/trump-account-worth-it/). For a general projection with different assumptions, the [investment calculator](/investing/) uses the same compounding math.",
    faqs: [
      { question: "How does this Trump Account calculator work?", answer: "The Trump Account calculator takes your child's age, the $1,000 federal seed, and your yearly family and employer contributions, then compounds the balance monthly at the return you choose until age 18. It enforces the $5,000 yearly contribution cap (including the $2,500 employer limit) so the projection matches the real rules. The result is an estimate — actual index returns vary year to year, and the projection does not model any account fees. Our [Trump Account worth-it guide](/guides/trump-account-worth-it/) covers what, if anything, the account costs." },
      { question: "How much will a Trump Account be worth at 18?", answer: "It depends on contributions and returns. The $1,000 seed alone at a 7% average return grows to about $3,513 by age 18. Adding $200 a month brings it to roughly $89,657, and contributing the full $5,000 per year from birth reaches about $182,980. Use the calculator above to model your own numbers. Because the account is invested in a stock index, the balance can also fall in a bad year rather than just grow more slowly. See our [Trump Account vs brokerage account](/compare/trump-account-vs-brokerage-account/) comparison for how large a real downturn has gotten." },
      { question: "Who gets the $1,000 Trump Account seed?", answer: "The federal government deposits $1,000 for each U.S.-citizen child born between January 1, 2025 and December 31, 2028 who has a Social Security number. Children outside that birth window can still have a Trump Account opened and funded, but they do not receive the $1,000 seed. Set the seed to $0 in the calculator if your child isn't eligible." },
      { question: "How much can you contribute to a Trump Account each year?", answer: "Up to $5,000 per year combined from family, relatives, and friends. An employer can contribute up to $2,500, but that amount counts toward the same $5,000 cap rather than adding to it. The $1,000 federal seed is separate and does not count against the limit. The cap is indexed to inflation after 2027, so our [Trump savings account guide](/guides/trump-savings-account/) is where to check the current-year number before assuming last year's cap still applies." },
      { question: "Is Trump Account growth taxed?", answer: "Growth inside a Trump Account is tax-deferred — you owe no tax on gains while the money stays invested. Contributions are made with after-tax dollars and are not deductible. Once the child turns 18, the account is treated like a traditional IRA, so withdrawals are generally taxed as income. Compare the tax treatment in our [Trump Account vs 529](/compare/trump-account-vs-529/) guide." },
      { question: "Who manages a Trump Account before the child turns 18?", answer: "A parent or legal guardian opens the account and manages it on the child's behalf until then; the money legally belongs to the child, not the parent. At 18, the child gains full control and the account starts working like a traditional IRA. A parent's immigration status does not affect a child's eligibility; see the full [eligibility rules](/guides/trump-account-eligibility/) for details." },
      { question: "Is TrumpAccounts.gov legit, or is it a scam?", answer: "TrumpAccounts.gov is the real, official U.S. Treasury site for opening a Trump Account, live since the program's July 4, 2026 launch. Copycat sites, phishing texts, and fake \"processing fee\" calls have already shown up around the program; see [Trump Account scams to know](/guides/trump-account-scams/) for the full list of red flags before you enter your child's Social Security number anywhere." },
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Guidance on Trump Accounts (Working Families Tax Cuts)", url: "https://www.irs.gov/newsroom/treasury-irs-issue-guidance-on-trump-accounts-established-under-the-working-families-tax-cuts-notice-announces-upcoming-regulations" },
      { label: "Congressional Research Service — Trump Accounts: Overview (R48910)", url: "https://www.congress.gov/crs-product/R48910" },
      { label: "U.S. Treasury — BNY named financial agent for Trump Accounts", url: "https://home.treasury.gov/news/press-releases/sb0433" },
    ],
    defaultPreset: {
      childCurrentAge: 0,
      seedDeposit: 1000,
      annualFamilyContribution: 2400,
      annualEmployerContribution: 0,
      annualReturnPct: 7,
    },
  },

  {
    id: "529-savings-calculator",
    islandId: "529-savings-calculator",
    label: "529 College Savings",
    navOrder: 14,
    metaTitle: "529 Calculator: College Savings Projection",
    metaDescription:
      "Free 529 calculator: project your college savings growth to 18, compare it to inflated college costs, and see the monthly amount to fully fund it.",
    targetKeyword: "529 savings calculator",
    h1: "529 Savings Calculator",
    introText:
      "A 529 savings calculator projects how your college fund grows by the time your child turns 18, and shows whether it will cover the cost of college. Enter your child's age, your current balance, your monthly contribution, and an expected return in the calculator above. For example, starting at $0 and saving $300 a month at a 6% return grows to about $116,206 in 18 years — $64,800 contributed and $51,406 in tax-free growth. Add a college-cost target and the tool also shows your projected coverage and the monthly amount needed to fully fund it.",
    howItWorks:
      "The calculator compounds your 529 balance monthly at the return you choose until your child turns 18, then splits the result into what you contributed versus tax-free growth. A 529 plan grows tax-free and stays tax-free at withdrawal when the money pays for qualified education. In the example above, $300 a month reaches about $116,206 by age 18.\n\nWhen you enter a total four-year college cost in today's dollars, the calculator inflates it to your child's college-start year (college costs have historically risen about 5% a year, faster than general inflation) and compares it to your projected balance. It then shows your coverage percentage and the monthly contribution needed to close any gap. A $120,000 cost today, for instance, projects to roughly $289,000 in 18 years — so a $300/month plan would cover about 40% of it.\n\nUse the result to decide your next move. See what a 529 can actually pay for in our [529 qualified expenses guide](/guides/529-qualified-expenses/), and what happens to money you don't use in [529 leftover money options](/guides/529-leftover-money-options/). Weighing a 529 against other accounts? Compare [529 vs Roth IRA](/compare/529-vs-roth-ira/), [Trump Account vs 529](/compare/trump-account-vs-529/), and the full lineup in [best investment account for kids](/guides/best-investment-account-for-kids/). For a general (non-529) projection, the [investment calculator](/investing/) uses the same compounding math. Not sure which fund menu to pick once you open the account? See our [529 investment strategy by age](/guides/529-investment-strategy-by-age/) guide for age-based vs. static portfolios.",
    faqs: [
      { question: "How does this 529 calculator work?", answer: "This 529 calculator projects your college-savings balance by compounding your current balance and monthly contributions at a chosen annual return until your child turns 18. If you enter a college-cost target, it inflates that cost to your child's college year, shows what percentage you're on track to cover, and calculates the monthly contribution needed to fully fund it. Results are estimates — real returns and college costs vary." },
      { question: "How much should I save in a 529 per month?", answer: "The right monthly amount depends on your child's age, your target college cost, and your expected return. Saving $300 a month from birth at a 6% return grows to about $116,206 by age 18. To hit a specific college cost, enter it in the calculator above and it will show the exact monthly contribution needed to close the gap. Starting earlier lowers the monthly amount because compounding has more time to work." },
      { question: "What return should I assume for a 529 plan?", answer: "A common assumption for a 529 plan is 5% to 7% a year. Most 529 plans use age-based portfolios that start aggressive and shift toward bonds and cash as college nears, which lowers the expected return over time. A 6% average is a reasonable middle estimate. Use a lower rate if your child is close to college age, since the portfolio will be more conservative." },
      { question: "Does the calculator account for rising college costs?", answer: "Yes, when you enter a college-cost target the calculator inflates it to your child's college-start year. It defaults to 5% annual college-cost inflation, which is roughly the historical average and higher than general CPI inflation. You can change the rate. This is why a cost that looks affordable today can be far larger by the time your child enrolls." },
      { question: "Is 529 growth really tax-free?", answer: "Yes, growth in a 529 plan is tax-free, and withdrawals are also tax-free when used for qualified education expenses like tuition, fees, books, and room and board. Money used for non-qualified purposes owes income tax plus a 10% penalty on the earnings. See our [529 qualified expenses guide](/guides/529-qualified-expenses/) for the full list of what counts." },
    ],
    sources: [
      { label: "IRS — Topic No. 313, Qualified Tuition Programs (529 plans)", url: "https://www.irs.gov/taxtopics/tc313" },
      { label: "SEC Investor.gov — An Introduction to 529 Plans", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/529-plans" },
      { label: "SEC Investor.gov — Compound Interest Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" },
    ],
    defaultPreset: {
      childCurrentAge: 0,
      currentBalance: 0,
      monthlyContribution: 300,
      annualReturnPct: 6,
      collegeCostToday: 0,
      costInflationPct: 5,
    },
  },

  {
    id: "coast-fire",
    islandId: "coast-fire",
    label: "Coast FIRE",
    navOrder: 15,
    metaTitle: "Coast FIRE Calculator: When You Can Stop Saving",
    metaDescription:
      "Free Coast FIRE calculator: see if your savings will grow into your full retirement number alone, and when you'd reach it if you keep contributing.",
    targetKeyword: "coast fire calculator",
    h1: "Coast FIRE Calculator",
    introText:
      "A Coast FIRE calculator tells you whether the retirement savings you already have will compound into a full retirement nest egg by your target retirement age with zero more contributions. Enter your age, current savings, expected return, and desired retirement spending in the calculator above. For example, a 35-year-old with $150,000 saved, retiring at 65 with a 7% return and a $60,000-a-year spending goal, needs $197,051 invested today to coast — so that saver is not quite there yet and needs to keep contributing.",
    howItWorks:
      "The calculator above works backward from your retirement goal. First, it turns your desired annual retirement spending into a target nest egg (your \"FIRE number\") using the safe-withdrawal-rate rule: spending divided by the withdrawal rate, so a $60,000 spending goal at a 4% withdrawal rate needs a $1,500,000 nest egg.\n\nNext, it discounts that FIRE number back to today at your expected return, which gives your \"coast number\" — the amount you'd need invested right now, untouched, to grow into your FIRE number by retirement through compounding alone. If your current savings already clear that number, you've reached Coast FIRE: you could stop contributing entirely and still retire on schedule. If not, the calculator simulates your real monthly contribution month by month to find the exact age you'd cross the coast number, since that number shrinks every month your investments grow.\n\nThe Coast FIRE idea matters because it separates two different jobs: saving enough principal, and then giving that principal time to compound. Once you've coasted, extra income can go toward paying down debt, working fewer hours, or a lower-stress career change, because your retirement is already funded by growth. Use our [retirement calculator](/retirement/) to model your full retirement plan with continued contributions, or the [investment calculator](/investing/) to project a taxable brokerage account using the same compounding math. Planning with a partner? See [Coast FIRE for couples](/guides/coast-fire-for-couples/) for how to combine two incomes into one household number. Considering cutting to part-time now instead of waiting? [Coast FIRE vs. Barista FIRE](/compare/coast-fire-vs-barista-fire/) shows why that costs a much bigger number upfront.",
    faqs: [
      { question: "What is Coast FIRE?", answer: "Coast FIRE is the point where your current retirement savings, left to grow untouched at your expected return, will compound into your full retirement number by your target retirement age without any more contributions. Once you reach it, you can \"coast\" — keep working or not, but stop adding to retirement and still retire on time." },
      { question: "How is the Coast FIRE number calculated?", answer: "First, your desired annual retirement spending is divided by a safe withdrawal rate (commonly 4%) to get your FIRE number — the full nest egg you need. That FIRE number is then discounted back to today at your expected annual return over your years until retirement, which gives the amount you'd need invested right now to coast." },
      { question: "What is a good expected return to use?", answer: "A common planning assumption for a diversified stock-heavy portfolio is 6% to 8% annually after inflation. Using a lower return is more conservative and raises your coast number; a higher return lowers it but assumes more risk. Try a few different rates in the calculator to see how sensitive your result is." },
      { question: "Is Coast FIRE the same as full FIRE?", answer: "No. Full FIRE (Financial Independence, Retire Early) means you already have enough invested to retire and live off withdrawals now. Coast FIRE means your current savings will grow into that number LATER, by your target retirement age, without more contributions — you're not retiring yet, just no longer required to save for retirement." },
      { question: "What if I haven't reached Coast FIRE yet?", answer: "The calculator shows both your gap today and, if you enter a monthly contribution, the specific age you're projected to reach Coast FIRE by continuing at that pace. Contributing more, extending your timeline, or accepting a higher (riskier) expected return all move that date earlier." },
      { question: "Does this calculator account for Social Security or a pension?", answer: "Not as a separate input, but you can approximate it. Look up your estimated benefit with the [Social Security Administration](https://www.ssa.gov/benefits/retirement/planner/agereduction.html)'s tools, then subtract your expected annual Social Security or pension income from the \"desired annual spend\" figure you enter — that leaves only the portion your investments actually need to cover, since Social Security and a pension both supplement your portfolio rather than compete with it." },
      { question: "Can I use this calculator if I'll have rental income or plan to include real estate?", answer: "Yes, the same way as Social Security: subtract your expected net rental income (after expenses) from your desired annual spend, since that income covers part of your retirement need without your portfolio. Keep real estate equity itself out of the \"current savings\" field unless you'd actually sell and reinvest it, since this calculator projects liquid, invested assets compounding at a market return, not property appreciation." },
      { question: "Does having a mortgage change my Coast FIRE number?", answer: "Only through your spending goal, not as a separate input. If your mortgage will be paid off before you retire, don't include the payment in your \"desired annual spend\" — only your post-mortgage living costs. If you'll still be paying it in retirement, include that payment in your spending goal so the calculator solves for a portfolio big enough to cover it." },
      { question: "Is there a free Coast FIRE calculator spreadsheet I can download?", answer: "This page's calculator does the same math a spreadsheet would — projecting your current savings forward and discounting your retirement number back to today — without needing a download or a Google account. The formula behind it is straightforward: divide desired annual spending by your withdrawal rate for the FIRE number, then divide that by (1 + expected return) raised to your years until retirement for the coast number, so you're welcome to rebuild it in your own spreadsheet if you prefer to track it that way." },
      { question: "Does it matter whether my coast number is in a Roth, traditional 401(k), or a taxable account?", answer: "Yes — the calculator's growth math is pre-tax, so where your coast number sits changes what it's worth in retirement. A traditional 401(k) or IRA grows tax-deferred. But withdrawals count as ordinary income, so you'll owe tax before you can spend it. A Roth account grows tax-free. Qualified withdrawals owe no tax at all, so a Roth balance keeps its full value. A taxable brokerage account — the kind our [investment calculator](/investing/) projects — owes capital gains tax on growth when you sell. Long-term capital gains are usually taxed at a lower rate than ordinary income. If most coast-number dollars sit in a traditional account, plan for a higher real number than the calculator shows. That gives your after-tax spending enough room to hit your actual goal." },
      { question: "Should I enter a nominal or a real (inflation-adjusted) return in the Coast FIRE calculator?", answer: "Use a real, inflation-adjusted return, not a nominal one, if your spend goal is in today's dollars. The calculator's expected-return field is just one growth rate; it doesn't separate market growth from inflation. The long-run nominal average often quoted for the [S&P 500](/investing/) is close to 10% a year. A real return subtracts inflation's effect, showing what your money actually gains in buying power. [Federal Reserve research](https://www.federalreserve.gov/pubs/feds/2011/201114/index.html) puts the long-run historical real return on U.S. stocks at about 6.5% a year. Entering a 10% nominal return with a spend goal in today's dollars overstates how close you are to coasting. It ignores that future dollars will buy less. A real return like 6% to 7% keeps your coast number honest instead. It already accounts for inflation eating into your purchasing power over time." },
    ],
    sources: [
      { label: "U.S. SEC Investor.gov — Retirement Planning", url: "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/retirement-planning" },
      { label: "U.S. Department of Labor — Top 10 Ways to Prepare for Retirement", url: "https://www.dol.gov/sites/dolgov/files/ebsa/about-ebsa/our-activities/resource-center/publications/top-10-ways-to-prepare-for-retirement.pdf" },
      { label: "Social Security Administration — Full Retirement Age", url: "https://www.ssa.gov/benefits/retirement/planner/agereduction.html" },
    ],
    defaultPreset: {
      currentAge: 35,
      retirementAge: 65,
      currentSavings: 150000,
      monthlyContribution: 500,
      annualReturnPct: 7,
      desiredAnnualSpend: 60000,
      withdrawalRatePct: 4,
    },
  },

  {
    id: "business-loan-payoff",
    islandId: "business-loan-payoff",
    label: "Business Loan Payoff",
    navOrder: 16,
    metaTitle: "Business Loan Payoff Calculator: Early Payoff & Schedule",
    metaDescription:
      "Free business loan payoff calculator: see your full amortization schedule and how early extra payments cut your payoff date and interest cost instantly.",
    targetKeyword: "business loan payoff calculator",
    h1: "Business Loan Payoff Calculator",
    introText:
      "A business loan payoff calculator shows how much faster you can clear a standard term loan — like an [SBA 7(a)](https://www.sba.gov/funding-programs/loans/7a-loans) or bank loan — by adding extra money to your monthly payment. Enter your remaining balance, rate, remaining term, and any extra amount in the calculator above. For example, a $100,000 balance at 9.5% APR with 60 months left pays off 9 months sooner and saves $4,187 in interest with a $300 extra payment each month.",
    howItWorks:
      "This calculator rebuilds your loan's amortization schedule — the same month-by-month breakdown your lender uses. Each month, interest is charged on your remaining balance first, and the rest of your payment reduces principal. Because interest is calculated on a shrinking balance, applying extra money to principal today reduces every future interest charge, not just the current one.\n\nPick your goal above the calculator. \"I can pay extra each month\" compares your original schedule to that same payment plus a fixed extra amount, showing the months and interest you save. \"I want a payoff date\" works backward instead: tell it how many months until you want to be debt-free, and it solves for the exact extra monthly payment that gets you there. This is a standard amortizing-loan calculation — it does not apply to a merchant cash advance or invoice factoring, which are priced by a fixed factor rate instead of an annual interest rate; see our [merchant cash advance calculator](/merchant-cash-advance/) for that math. It also doesn't apply to a balloon-structured loan, where the payment is calculated over a longer amortization period than the loan actually runs — see our [balloon payment business loan guide](/guides/balloon-payment-business-loan-explained/) for the lump sum due at maturity.\n\nBefore sending extra principal, confirm two things with your lender in writing: that extra payments are applied to principal (not just credited toward next month's payment), and that your loan has no prepayment penalty. SBA 7(a) loans over $500,000 with a term of 15+ years, and many bank term loans in their early years, sometimes carry one.",
    faqs: [
      { question: "How does a business loan payoff calculator work?", answer: "It rebuilds your loan's amortization schedule month by month, charging interest on your remaining balance first and applying the rest of the payment to principal. Adding a fixed extra amount every month is applied straight to principal, which shrinks the balance faster and lowers every future month's interest charge. Switch to \"I want a payoff date\" if you'd rather work backward from a target timeline to the required payment." },
      { question: "Does paying extra on a business loan always save money?", answer: "On a standard amortizing loan (fixed rate, interest charged on the declining balance), yes — extra principal payments always reduce total interest, as long as your lender applies the extra to principal rather than future payments and there's no prepayment penalty. Confirm both with your lender before paying extra." },
      { question: "What's the difference between this and a merchant cash advance payoff?", answer: "A term loan charges interest on your declining balance, so paying early genuinely reduces the total cost. A merchant cash advance uses a fixed factor rate applied once to the full advance, so the total payback is generally fixed regardless of timing. Use the merchant cash advance payoff calculator for that math instead." },
      { question: "Should I pay off my business loan early or invest the extra cash?", answer: "Compare your loan's interest rate to your realistic after-tax return on alternative uses of that cash. If your loan rate is higher than what you'd confidently earn elsewhere, paying it down is the safer, guaranteed return. If your rate is low and the business has a strong growth use for the cash, reinvesting may win — run both scenarios before deciding." },
      { question: "What should I check before making extra payments on a business loan?", answer: "Four things: whether your lender has a prepayment penalty, whether extra payments are applied to principal (get this in writing), whether you're keeping enough cash reserve for payroll and emergencies before sending extra money to the loan, and the loan's tax treatment — interest on a business term loan is generally deductible as a business expense, so paying it off faster also shrinks that deduction going forward." },
      { question: "Why is my loan's payoff quote higher than my current balance?", answer: "Your statement balance usually only reflects interest posted through your last billing cycle, while a payoff quote adds per-diem interest accrued since that statement through your actual payoff date, plus any fee your loan agreement allows (like an unpaid late fee). The gap is normal and grows the longer you wait after requesting the quote — ask your lender for the quote's expiration date and pay before it lapses to avoid the number moving again." },
      { question: "How do you calculate a loan payoff amount?", answer: "A payoff amount is your remaining principal plus interest accrued from your last statement date to the day you actually pay. It also includes any fee your loan agreement allows, like an unpaid late fee. Lenders calculate that accrued interest per diem, meaning day by day, so the exact number shifts slightly the longer you wait to pay it. That's different from running the numbers through a standard amortization formula, whether in this calculator or a spreadsheet in Excel. A standard amortization schedule shows your scheduled balance as of your last payment, not the real-time number your lender will actually collect. For the exact figure, ask your lender for a payoff quote in writing, and pay before its stated expiration date so per-diem interest doesn't push the number higher again." },
      { question: "Can I negotiate my business loan's payoff amount?", answer: "Rarely on a standard, current, amortizing term loan — the payoff is simply your remaining principal plus accrued interest, which isn't a negotiable figure the way a settlement is. Negotiation becomes realistic mainly if the loan is in default or you're proposing a lump-sum settlement for less than the full balance, which a lender may accept to avoid a costly collection process, but that route also typically damages your business credit far more than paying the loan off in full." },
      { question: "How much can my business borrow in the first place?", answer: "Lenders weigh your revenue, time in business, credit profile, and existing debt payments, and the answer varies widely by lender and loan type. If you're exploring a revolving option instead of a fixed term loan, the [business line of credit calculator](/business-line-of-credit/) shows the true cost of a specific draw amount once fees are included, which can help you size a realistic borrowing request before you apply. See our full breakdown of [how much business loan you can qualify for](/guides/how-much-business-loan-can-i-qualify-for/) for the revenue, credit score, and DSCR thresholds lenders actually check." },
    ],
    sources: [
      { label: "U.S. Small Business Administration — 7(a) loans", url: "https://www.sba.gov/funding-programs/loans/7a-loans" },
      { label: "Federal Reserve Banks — Small Business Credit Survey", url: "https://www.fedsmallbusiness.org/" },
    ],
    defaultPreset: {
      loanBalance: 100000,
      interestRatePct: 9.5,
      remainingTermMonths: 60,
      extraMonthlyPayment: 300,
      targetPayoffMonths: 36,
    },
  },
  // Personal loan — competitor-monitor pass (2026-07-20). A standard amortizing unsecured
  // personal loan (debt consolidation, home improvement) — NOT a business term loan (see
  // business-loan-payoff above) or a factor-rate product. The only calculator on the market
  // this pass reviewed that also models the origination fee lenders deduct from your payout.
  {
    id: "personal-loan",
    islandId: "personal-loan",
    label: "Personal Loan",
    navOrder: 17,
    metaTitle: "U.S. Personal Loan Calculator: True Cost With Fees",
    metaDescription:
      "Free personal loan calculator: see your monthly payment plus the real effective APR once the lender's origination fee is factored in — not just the stated rate.",
    targetKeyword: "personal loan calculator",
    h1: "Personal Loan Calculator",
    introText:
      "A personal loan calculator estimates your monthly payment on an unsecured personal loan and, done right, also shows what the loan really costs once fees are counted. Enter your loan amount, interest rate, and term in the calculator above to see your payment instantly. For example, a $15,000 loan at 12.5% APR over 48 months costs $398.70 a month — but if the lender charges a 3% origination fee, you only receive $14,550 up front, which pushes your real effective APR above the stated 12.5% rate.",
    howItWorks:
      "Your personal loan payment is set by three numbers: the loan amount, the annual percentage rate (APR), and the term in months. The calculator spreads the loan amount over the term at a fixed rate and solves for the level monthly payment, the same amortization math your lender uses. In the example above, a $15,000 loan at 12.5% APR over 48 months produces a $398.70 monthly payment and $4,137.60 in total interest.\n\nHere is what most personal loan calculators leave out. Most online personal loan lenders charge an origination fee, typically 1% to 10% of the loan amount, and subtract it from your payout before you ever see the cash. Your payment is still calculated on the full loan amount, not the smaller amount you actually receive. That gap means your real borrowing cost is higher than the stated APR suggests. The [Consumer Financial Protection Bureau](https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/) explains APR as the rate that captures a loan's full cost, including fees — this calculator applies that same logic and shows you the effective APR on the cash you actually get, not just the face value of the loan.\n\nA 3% origination fee on the example above drops your payout to $14,550 while your $398.70 payment stays the same, which raises your effective APR to roughly 14.15%. On a shorter loan term, the same fee percentage pushes the effective rate up even more, since the fee is spread over fewer months of benefit. Always ask a lender for the origination fee percentage before comparing offers by stated rate alone — two loans with the same advertised APR can cost meaningfully different amounts once fees are included.",
    faqs: [
      {
        question: "How does this personal loan calculator work?",
        answer:
          "It uses your loan amount, APR, and term to compute a fixed monthly payment with standard amortization — the same math lenders use. It then goes a step further: if you enter an origination fee, it shows the cash you'll actually receive after the fee is deducted, and calculates the effective APR on that smaller amount, which is your real cost of borrowing.",
      },
      {
        question: "What is a good interest rate on a personal loan in 2026?",
        answer:
          "Rates vary widely by credit score, income, and lender. Borrowers with excellent credit (typically a [FICO Score](https://www.myfico.com/credit-education/whats-in-your-credit-score) of 720 or higher) tend to land toward the lower end of the market range, while fair-to-poor credit borrowers see substantially higher rates. Always compare your actual offers rather than relying on a single average, since lenders weigh income and existing debt alongside your score. See what several major banks and credit unions publish about their own personal loan rates in our [personal loan rates by lender](/roundup/personal-loan-rates-by-lender/) comparison.",
      },
      {
        question: "What is an origination fee and do all personal loans have one?",
        answer:
          "An origination fee is a one-time charge, usually 1% to 10% of the loan amount, that a lender subtracts from your loan proceeds to cover processing costs. Not every lender charges one — some credit unions and banks skip it entirely — so ask directly and enter 0% in the calculator above if your offer has none.",
      },
      {
        question: "Why is the effective APR higher than the interest rate I was quoted?",
        answer:
          "Your quoted interest rate only reflects the cost of the money over time. It ignores that an origination fee shrinks the amount you actually receive while your payment stays based on the full loan amount. The effective APR restates the true annualized cost against the smaller amount you actually got, which is why it's always equal to or higher than the stated rate whenever a fee applies.",
      },
      {
        question: "Should I choose a longer term to lower my personal loan payment?",
        answer:
          "A longer term lowers your monthly payment but increases the total interest you pay over the life of the loan, since you're borrowing the money for more months. A shorter term costs more per month but saves money overall. Run both terms through the calculator above and compare the total interest and total cost of borrowing, not just the monthly payment.",
      },
      {
        question: "Is a personal loan or a credit card cheaper for debt consolidation?",
        answer:
          "It depends on your rate on each. A personal loan typically has a fixed rate and a fixed payoff date, which can beat carrying a balance on a high-rate credit card indefinitely. A 0% intro APR balance transfer card can beat a personal loan for the promotional period if you can pay off the balance before it ends — see our guide on [choosing a balance transfer credit card](/guides/how-to-choose-a-balance-transfer-credit-card/) to compare the two paths.",
      },
      {
        question: "How much can I borrow with a personal loan?",
        answer:
          "It depends on the lender, and mainly on your credit score, income, and existing debt payments relative to that income (your debt-to-income ratio) rather than a single fixed limit. Lenders each set their own minimum and maximum loan amounts, so the honest way to know your real number is to check pre-qualification offers from a few lenders, which typically show an estimated amount and rate without a hard credit inquiry.",
      },
      {
        question: "Is a personal loan or a credit card better for a big purchase (not just consolidating debt)?",
        answer:
          "A personal loan usually wins for a purchase you can't pay off within a few months, since its fixed rate and fixed term protect you from a card's variable APR and the temptation to only pay the minimum. A 0% intro APR credit card can beat a personal loan if you're confident you'll pay the full purchase off before the promotional period ends, since that path carries no interest cost at all during the promo window — the moment you might carry a balance past that window, the math usually flips back to the personal loan. For a car purchase specifically, an auto loan usually beats both, since its collateral lowers the rate further still — see [personal loan vs auto loan](/compare/personal-loan-vs-auto-loan/) for the real numbers.",
      },
      {
        question: "Can I pay more than my scheduled monthly payment on a personal loan?",
        answer:
          "Most personal loans allow it, and extra payments go toward principal the same way they do on a standard amortizing loan, which reduces your total interest and can shorten your payoff timeline. Confirm two things with your lender first: that there's no prepayment penalty, and that extra amounts are actually applied to principal rather than just counted as an early payment toward next month's bill. See our [personal loan extra payment calculator](/personal-loan/extra-payment-calculator/) to see exactly how much a specific extra amount saves.",
      },
      {
        question: "What is a personal loan calculator?",
        answer:
          "A personal loan calculator is a tool that estimates your fixed monthly payment on an unsecured personal loan from three numbers: the amount you borrow, the annual percentage rate (APR), and the loan term in months. Enter those figures in the calculator above and it returns your monthly payment using the same amortization math your lender uses to set your bill.",
      },
      {
        question: "Why are personal loan rates so high?",
        answer:
          "Personal loan rates run higher than secured loans like mortgages or auto loans because there's no collateral for the lender to seize if you stop paying. Without a house or a car backing the loan, the lender prices that added risk into the rate, and where you land within the market range depends mainly on your credit score, your debt-to-income (DTI) ratio, and your income stability. The [Federal Reserve's Consumer Credit (G.19)](https://www.federalreserve.gov/releases/g19/current/) release tracks the average finance rate lenders charge on personal loans over time, and that average consistently runs above mortgage and auto-loan averages for the same reason: no asset backs the loan.",
      },
      {
        question: "How much personal loan should I take?",
        answer:
          "Borrow the smallest amount that actually solves what you're borrowing for, not the maximum a lender is willing to approve. Run your quoted rate and term through the calculator above to see the real monthly payment and total interest, then check that payment against your budget after every other fixed cost, since a payment that only just fits today's income leaves no cushion if that income drops. Lenders weigh your debt-to-income (DTI) ratio, your total monthly debt payments divided by your gross monthly income, when they set both your approval and your rate, and the [CFPB's guide to DTI](https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/) explains why keeping that ratio low matters even after you're approved. Borrowing less than the maximum also leaves more DTI room for whatever you need to qualify for next, like a mortgage.",
      },
      {
        question: "Does this calculator work outside the United States?",
        answer:
          "The calculator itself is set up in U.S. dollars, but the amortization math behind it works the same in any currency. It spreads a loan amount over a term at a fixed rate to solve for a level payment. Enter your own loan amount, rate, and term in your local currency and the same formula still applies. The rate itself gets quoted differently by country, though, and that difference matters more than the math does. Many countries outside the U.S. quote personal loan rates as a flat or reducing-balance rate instead of an APR, which changes what the quoted number actually means. See our [flat vs. reducing rate calculator](/personal-loan/flat-vs-reducing-rate-calculator/) to convert between the two and see the true cost either way.",
      },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — What is the difference between a mortgage interest rate and an APR?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/" },
      { label: "Federal Reserve — Consumer Credit (G.19)", url: "https://www.federalreserve.gov/releases/g19/current/" },
      { label: "myFICO — What's in my FICO Scores?", url: "https://www.myfico.com/credit-education/whats-in-your-credit-score" },
    ],
    defaultPreset: {
      loanAmount: 15000,
      interestRatePct: 12.5,
      loanTermMonths: 48,
      originationFeePct: 3,
    },
  },
  // Interest per day — competitor-monitor pass (2026-08-03): the daily-rate gap most simple
  // "interest per day" calculators skip is the interest-rate-vs-APY distinction once that daily
  // rate compounds. Works both directions (savings/HYSA/CD earning it, or loan/credit card owing it).
  {
    id: "interest-per-day",
    islandId: "interest-per-day",
    label: "Interest Per Day",
    navOrder: 18,
    metaTitle: "Interest Per Day Calculator: Daily Interest + APY",
    metaDescription:
      "Free interest per day calculator: see the daily, weekly, and monthly interest on any balance or loan, plus the effective yield (APY) once it compounds daily.",
    targetKeyword: "interest per day calculator",
    h1: "Interest Per Day Calculator",
    introText:
      "An interest per day calculator shows how much interest a balance earns, or a loan costs, in a single day — enter a balance and its annual rate above to see the daily, weekly, and monthly dollar amounts instantly. For example, $10,000 at a 4.5% annual rate earns about $1.23 a day, $8.63 a week, and $36.99 over a 30-day month. Most day-rate tools stop there; this one also shows the effective annual yield (APY) once that daily rate compounds daily, which is the number that actually shows up in your account balance a year later.",
    howItWorks:
      "Daily interest is the annual rate divided by 365, then multiplied by the balance. In the example above, a 4.5% annual rate divided by 365 days gives a daily rate of about 0.0123%, and 0.0123% of $10,000 is $1.23. Multiply that daily figure by 7 for a week or 30 for a typical month to see the running total.\n\nThe part most day-rate calculators leave out is the difference between a stated interest rate and the effective annual yield (APY) once that daily rate compounds. A bank that pays 4.5% and compounds daily doesn't just pay you 4.5% of your starting balance over a year — each day's interest gets added to the balance, so the next day's interest is calculated on a slightly larger number. Compounded daily, a stated 4.5% rate works out to roughly a 4.60% APY, and the [CFPB's Regulation DD rule on how APY is calculated](https://www.consumerfinance.gov/rules-policy/regulations/1030/A) is the reason banks are required to disclose the APY separately: it is the number that reflects what you actually earn.\n\nThe same daily math applies on the other side of the ledger. A credit card or loan balance that accrues interest daily is charged using the same principal-times-daily-rate formula, which is why a balance that sits unpaid for even a few extra days adds up faster than a monthly-only view suggests.",
    faqs: [
      {
        question: "How do I calculate interest per day on a loan?",
        answer:
          "Divide the annual interest rate by 365 to get the daily rate, then multiply that daily rate by the loan balance. For example, a $15,000 loan balance at a 7% annual rate has a daily rate of about 0.0192%, which works out to roughly $2.88 in interest for that day. Because most loans amortize, the balance shrinks with each payment, so the dollar amount of daily interest gradually falls over the life of the loan even though the rate stays fixed.",
      },
      {
        question: "What's the interest per day for a $500,000 balance at 4% interest per year?",
        answer:
          "At a 4% annual rate, the daily rate is about 0.01096%, so a $500,000 balance earns or accrues roughly $54.79 per day. Over a 30-day month that's about $1,643.84, and over a full year the simple total is $20,000 — slightly less than the compounded total if the balance earns daily compounding instead of a flat annual rate.",
      },
      {
        question: "How much interest does $1 billion earn per day?",
        answer:
          "At a 4.5% annual rate, $1 billion earns about $123,288 per day using the standard daily-rate formula (annual rate divided by 365, times the balance). The exact figure scales directly with whatever rate actually applies, so doubling the rate to 9% simply doubles the daily interest to roughly $246,575.",
      },
      {
        question: "Is interest calculated using a 365-day year or a 360-day year?",
        answer:
          "Most consumer savings accounts, HYSAs, and credit cards use a 365-day year (a 366-day count in a leap year), which is what this calculator assumes. Some commercial loans and a handful of legacy lending products instead use a 360-day \"banker's year,\" which produces a slightly higher daily rate for the same stated annual percentage. Check your account agreement or loan disclosure to confirm which method your specific product uses.",
      },
      {
        question: "Why is my effective APY higher than my stated interest rate?",
        answer:
          "Your stated interest rate is the simple annual rate before compounding. The annual percentage yield (APY) restates that same rate after accounting for how often it compounds — daily compounding means each day's interest starts earning its own interest, so the total collected over a year is slightly more than the simple rate alone would produce. The more frequently a rate compounds, the larger this gap becomes.",
      },
      {
        question: "What's the Excel formula for daily interest?",
        answer:
          "In Excel or Google Sheets, simple daily interest is =Principal*(Rate/365), where Rate is entered as a decimal (4.5% as 0.045). For $10,000 at 4.5%, that's =10000*(0.045/365), which returns $1.23 — matching the calculator above. To project a balance that compounds daily instead of just totaling flat daily interest, use =Principal*(1+Rate/365)^Days in place of simple multiplication.",
      },
      {
        question: "How do I calculate interest that compounds daily?",
        answer:
          "Daily compounding uses A = P × (1 + r/365)^n, where P is the principal, r is the annual rate as a decimal, and n is the number of days. For $10,000 at 4.5% compounded daily over 365 days, that's 10000 × (1.000123)^365 ≈ $10,460 — the extra $460, versus $450 under simple interest, is exactly the APY gap this calculator's effective-yield figure shows.",
      },
      {
        question: "Does this work the same for a mortgage, auto loan, student loan, or credit card?",
        answer:
          "Yes. The annual-rate-divided-by-365 formula is identical across loan types; only the balance and rate change. A $250,000 mortgage balance at 6.5% accrues about $44.52 in interest that day. A $20,000 auto loan balance at 7% accrues about $3.84. A $5,000 credit card balance at 24% accrues about $3.29. Enter your own loan's balance and rate above for the exact figure, then see the [auto loan interest calculator](/auto-loan/interest-calculator/) or [mortgage amortization schedule](/mortgage/amortization-schedule/) for the full day-by-day payoff breakdown instead of a single day's snapshot.",
      },
      {
        question: "How does my banking app calculate the 'interest per day' it shows me?",
        answer:
          "Any bank or savings app that displays a daily interest figure is running the same math this calculator does: your balance times the annual rate divided by 365 (or that same figure compounded daily for a running balance). If an app's number doesn't match what you compute here with your actual balance and stated rate, check whether it's compounding daily, weekly, or monthly, since that changes the total, or whether it's using a promotional rate on only part of your balance.",
      },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — 12 CFR Part 1030 (Regulation DD), Appendix A: Annual Percentage Yield Calculation", url: "https://www.consumerfinance.gov/rules-policy/regulations/1030/A" },
      { label: "Consumer Financial Protection Bureau — 12 CFR Part 1030, Truth in Savings (Regulation DD)", url: "https://www.consumerfinance.gov/rules-policy/regulations/1030/" },
    ],
    defaultPreset: {
      principal: 10000,
      annualRatePct: 4.5,
    },
  },
  // Taxable vs. tax-deferred — competitor-monitor pass (2026-08-05): most "401(k) vs brokerage"
  // content stops at a rule of thumb; this shows the actual dollar gap for your own return, tax
  // rate, and how much of a taxable account's annual gain gets realized (dividends/interest) vs.
  // stays unrealized until you sell.
  {
    id: "taxable-vs-tax-deferred",
    updated: "2026-08-30",
    islandId: "taxable-vs-tax-deferred",
    label: "Taxable vs. Tax-Deferred",
    navOrder: 19,
    metaTitle: "Taxable vs. Tax-Deferred Growth Calculator",
    metaDescription:
      "See the real dollar gap between a taxable brokerage account and a tax-deferred 401(k)/IRA for your own return, tax rate, and years invested.",
    targetKeyword: "taxable vs tax deferred calculator",
    h1: "Taxable vs. Tax-Deferred Investment Growth Calculator",
    introText:
      "A taxable vs. tax-deferred calculator shows the dollar difference between growing money in a regular brokerage account versus a tax-deferred account like a traditional 401(k) or IRA, for the same starting balance, contribution, and return. Enter your numbers above to see both final balances side by side. For example, $10,000 plus $6,000 a year for 25 years at a 7% return, taxed at 24%, ends up meaningfully larger in the tax-deferred account than the taxable one — even though the tax-deferred account owes a bigger one-time tax bill at the end.",
    howItWorks:
      "The taxable account model applies tax every year, but only to the share of that year's gain you'd actually realize — dividends and interest paid out, not appreciation you haven't sold. Enter the percentage of your gain that's realized each year: closer to 100% for a bond or high-dividend fund, closer to 0-20% for a low-turnover stock index fund. That realized share is taxed at your rate immediately; the rest keeps compounding untaxed until you eventually sell.\n\nThe tax-deferred account skips all of that. The full balance compounds every year with no annual tax bill, the same way a traditional 401(k) or IRA works. The tradeoff shows up at the end: the entire final balance, contributions and growth combined, is taxed once at your ordinary income tax rate when you withdraw it, the same way a 401(k) or traditional IRA withdrawal is taxed.\n\nBoth sides of this calculator use the SAME tax rate, on purpose. That isolates the one variable that actually matters here — timing. Tax-deferred growth usually wins specifically because untaxed money compounds faster than money that gets taxed away a little at a time, not because of a rate difference. In practice, long-term capital gains and qualified dividends often get a lower rate than ordinary income, which would narrow the gap in the taxable account's favor — this calculator doesn't model that separately, so treat the deferred account's advantage here as an upper-bound estimate.",
    faqs: [
      {
        question: "Is a tax-deferred account always better than a taxable account?",
        answer:
          "Not always, but it usually grows to a larger balance for the same return and tax rate, because untaxed money compounds faster than money that loses a slice to tax every year. A taxable account can still make sense for money you need before retirement age, since a 401(k) or traditional IRA charges an early-withdrawal penalty on top of ordinary income tax if you pull money out before 59½.",
      },
      {
        question: "What does 'percent realized' mean in this calculator?",
        answer:
          "It's the share of a taxable account's annual gain that actually gets taxed that year, like dividends or interest paid out to you. The rest of the gain is unrealized appreciation — the investment is worth more, but you haven't sold it, so nothing is taxed yet. A high-dividend or bond fund realizes most of its gain every year; a low-turnover stock index fund realizes very little until you sell.",
      },
      {
        question: "Why does the tax-deferred account still get taxed at the end?",
        answer:
          "Because a traditional 401(k) or IRA was never taxed going in or during the growth years, the IRS taxes the entire withdrawal as ordinary income. That's different from a Roth account, which is taxed up front so withdrawals in retirement are tax-free. This calculator models the traditional (pre-tax) version specifically.",
      },
      {
        question: "Does this calculator account for the lower long-term capital gains rate?",
        answer:
          "No, it uses one tax rate for both accounts to isolate the effect of tax timing. In reality, long-term capital gains and qualified dividends are often taxed at a lower rate than ordinary income, which would shrink the taxable account's disadvantage shown here. Treat the tax-deferred account's edge in this calculator as a reasonable upper-bound estimate, not an exact prediction.",
      },
      {
        question: "Should I max out a 401(k) before investing in a taxable brokerage account?",
        answer:
          "Most financial planners suggest capturing any employer 401(k) match first, since that's an immediate guaranteed return, then weighing a taxable account against further tax-advantaged contributions based on when you'll need the money. See our [401(k) vs. brokerage account comparison](/compare/401k-vs-brokerage-account/) for the full tradeoff, including access before retirement age.",
      },
      {
        question: "What's the difference between tax-deferred and tax-exempt?",
        answer:
          "Tax-deferred means the tax bill is postponed, not eliminated: a traditional 401(k) or IRA skips tax on the way in and during growth, then the IRS taxes the full withdrawal as ordinary income later. Tax-exempt means the growth is never taxed again once it's in the account: a Roth IRA is funded with money you've already paid tax on, so qualified withdrawals in retirement owe nothing further. This calculator models the taxable-vs-tax-deferred pairing only; run the numbers for the tax-exempt side with the [Roth IRA calculator](/investing/roth-ira-calculator/).",
      },
      {
        question: "How do taxable, tax-deferred, and tax-exempt accounts compare side by side?",
        answer:
          "Taxable, tax-deferred, and tax-exempt describe when the IRS takes its cut, not whether it does. A taxable brokerage account is taxed annually on realized gains, dividends, and interest, and again when you eventually sell. A tax-deferred account (traditional 401(k)/IRA) owes nothing until withdrawal, then the entire amount is taxed as ordinary income. A tax-exempt account (Roth IRA) is taxed once, up front, and qualified withdrawals afterward are tax-free. For the same contribution and return, tax-exempt and tax-deferred accounts usually end up close in after-tax value when your tax rate stays flat; tax-exempt pulls ahead if your tax rate is higher in retirement than it is now, and tax-deferred pulls ahead if it's lower. Only a few accounts qualify as tax-exempt, and our guide to [tax-free retirement accounts](/guides/tax-free-retirement-account/) names them and explains which products only borrow the label.",
      },
    ],
    sources: [
      { label: "IRS — Retirement Topics: Tax on Early Distributions", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-tax-on-early-distributions" },
      { label: "IRS — Topic no. 409, Capital Gains and Losses", url: "https://www.irs.gov/taxtopics/tc409" },
      { label: "IRS — Publication 550, Investment Income and Expenses (dividends and interest)", url: "https://www.irs.gov/publications/p550" },
      { label: "IRS — Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras" },
    ],
    defaultPreset: {
      startingBalance: 10000,
      annualContribution: 6000,
      annualReturnPct: 7,
      years: 25,
      taxRatePct: 24,
      taxableSharePct: 30,
    },
  },
  // Credit card payoff — competitor-monitor pass (2026-08-12): the gap most "credit card payoff
  // calculator" tools leave out is the minimum-payment-only comparison. This one computes that path
  // automatically, using the greater-of-$25-or-1%-plus-interest formula behind the minimum-payment
  // warning box every card statement must show under Regulation Z, 12 CFR 1026.7(b)(12).
  {
    id: "credit-card-payoff",
    islandId: "credit-card-payoff",
    label: "Credit Card Payoff",
    navOrder: 20,
    metaTitle: "Credit Card Payoff Calculator: Time & Interest Cost",
    metaDescription:
      "Free credit card payoff calculator. See how long a balance takes to pay off and the interest it costs, versus paying only the minimum.",
    targetKeyword: "credit card payoff calculator",
    h1: "Credit Card Payoff Calculator",
    introText:
      "A credit card payoff calculator shows how long it takes to clear a balance and how much interest that costs, based on your APR and monthly payment. Enter your balance, APR, and either a monthly payment or a target payoff date in the calculator above. For example, a $6,000 balance at 24% APR paid at $250 a month is paid off in 34 months and costs $2,255.61 in interest. The calculator also runs the minimum-payment-only path automatically: at that same balance and rate, minimum payments alone take 252 months, about 21 years, and cost $10,886.92 in interest, over $8,600 more than the $250-a-month plan, for the same starting balance.",
    howItWorks:
      "Interest on a credit card accrues on the remaining balance each month, then whatever you pay above that interest reduces the principal. The calculator repeats that month by month: it takes your balance and APR, applies one month of interest, subtracts your payment, and moves to the next month until the balance hits zero. That is the same mechanic behind every amortization schedule, just without a fixed loan term forcing the math.\n\nThe minimum-payment comparison uses the formula behind most major issuers' minimum-payment box: the greater of $25 or 1% of the balance plus that month's interest. Because that minimum is recalculated every month against a shrinking balance, the required minimum payment also shrinks over time, which is exactly why minimum-only payoff stretches out for years. The [Truth in Lending Act's Regulation Z](https://www.consumerfinance.gov/rules-policy/regulations/1026/7/) requires every statement to disclose an estimated payoff time at minimum payments for this reason, but the disclosure is usually a single line buried near the payment coupon. Running your own numbers above puts the full month-by-month comparison in front of you instead.\n\nIf you enter a target payoff date instead of a payment amount, the calculator solves the problem in reverse: it finds the fixed monthly payment that clears the balance by that date, using the same standard amortization formula lenders use for a fixed-term loan.\n\nPutting extra money toward the balance compounds because every dollar of principal you clear early stops accruing interest for every remaining month. On the $6,000-at-24%-APR example above, raising the payment from $250 to $300 a month, $50 more, cuts the payoff from 34 months to 26 months and drops total interest from $2,255.61 to $1,739.24, a savings of over $500 for an 8-month-shorter payoff. A biweekly schedule works the same way through a different mechanism: paying $125 every two weeks instead of $250 once a month adds up to 26 payments a year instead of 12 monthly payments, the equivalent of one extra full payment annually. On the same balance, that pattern pays it off in 30 months and costs $2,005.98 in interest. Enter whichever fixed payment you'd actually make (biweekly total, or your regular payment plus a lump sum) as the monthly payment above to see your own numbers.",
    faqs: [
      {
        question: "How much interest will I pay on my credit card?",
        answer:
          "It depends on your balance, APR, and payment size. On a $6,000 balance at 24% APR, paying $250 a month costs $2,255.61 in total interest over 34 months. Enter your own numbers in the calculator above to see your exact figure. Even a $50 change in monthly payment can shift total interest by hundreds of dollars.",
      },
      {
        question: "How long does it take to pay off a credit card at the minimum payment?",
        answer:
          "Far longer than most cardholders expect, because the minimum payment shrinks as the balance does. A $6,000 balance at 24% APR paid at the typical minimum (the greater of $25 or 1% of the balance plus interest) takes about 252 months, roughly 21 years, and costs $10,886.92 in interest, nearly double the original balance.",
      },
      {
        question: "How much extra should I pay to get out of credit card debt faster?",
        answer:
          "Any amount above the minimum helps, but the payoff time drops fastest on the first extra dollars, since more of each payment starts going to principal instead of interest. Try a few payment amounts in the calculator above and compare the total interest column. The gap between $150 and $250 a month on a mid-size balance is often a difference of a year or more in payoff time.",
      },
      {
        question: "What is a good APR for a credit card?",
        answer:
          "Rewards and travel cards for excellent credit often carry APRs in the high teens to low twenties, while cards built for building or rebuilding credit run higher, sometimes above 25%. Whatever your card's stated APR is, enter it directly in the calculator above. The payoff math depends on your exact rate, not a category average.",
      },
      {
        question: "Should I pay off a credit card or save the money instead?",
        answer:
          "For most people, paying down a card with a double-digit APR beats saving the same money in an account earning a few percent, since the guaranteed 'return' of not paying that interest almost always outpaces a savings account's yield. The one exception is a fully-matched employer 401(k) contribution or a true emergency fund with zero cash cushion. Cover those first, then direct extra money at the card.",
      },
      {
        question: "Does this calculator account for new purchases on the card?",
        answer:
          "No. It assumes no new charges are added while you pay down the existing balance, which is the only way a payoff date is predictable. Adding new purchases resets the math: interest keeps accruing on a bigger balance, and the payoff date shown above no longer applies. If you're actively using the card, re-run the calculator with your current balance each time it changes meaningfully.",
      },
      {
        question: "Is a balance transfer or a personal loan better than just paying off the card directly?",
        answer:
          "Both can beat paying a high-APR card down directly if you qualify. A 0% intro APR balance transfer card eliminates interest for the promotional period, but only if you can clear the balance before it ends: see [how to choose a balance transfer credit card](/guides/how-to-choose-a-balance-transfer-credit-card/). A fixed-rate personal loan trades a variable, often-higher card APR for a fixed rate and a fixed end date; compare the two directly with the [personal loan calculator](/personal-loan/).",
      },
      {
        question: "What if I have more than one credit card to pay off?",
        answer:
          "Run each card through this calculator separately, then decide which one to attack first with any extra money once all the minimums are covered. The two standard orderings are the avalanche method, highest APR first, which minimizes total interest, and the snowball method, smallest balance first, which clears individual cards faster and can be easier to stick with. See [debt snowball vs. avalanche](/compare/debt-snowball-vs-avalanche/) for a full worked comparison of both orderings on the same set of balances.",
      },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — Regulation Z, 12 CFR 1026.7(b)(12): Minimum payment disclosures", url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/7/" },
      { label: "Consumer Financial Protection Bureau — What the payoff box on your credit card statement means", url: "https://www.consumerfinance.gov/ask-cfpb/a-box-on-my-credit-card-bill-says-that-i-will-pay-off-the-balance-in-three-years-if-i-pay-a-certain-amount-what-does-that-mean-do-i-have-to-pay-that-much-if-i-pay-that-much-and-make-new-purchases-will-i-still-owe-nothing-after-three-years-en-36/" },
      { label: "Federal Reserve — Consumer Credit (G.19), credit card interest rates", url: "https://www.federalreserve.gov/releases/g19/current/" },
    ],
    defaultPreset: {
      balance: 6000,
      aprPct: 24,
      mode: "payment",
      monthlyPayment: 250,
      targetMonths: 24,
    },
  },
  {
    id: "pto-cashout",
    islandId: "pto-cashout",
    label: "PTO Cash-Out",
    navOrder: 33,
    metaTitle: "PTO Cash-Out Calculator: Sell Back Leave Days",
    metaDescription:
      "Free PTO cash-out calculator. See your gross payout, an estimated net-of-tax payout, and what selling leave days is really worth versus taking time off.",
    targetKeyword: "pto cash out calculator",
    h1: "PTO Cash-Out Calculator",
    introText:
      "A PTO cash-out calculator turns unused paid time off, vacation, or leave days into a dollar amount by finding your daily pay rate and multiplying it by the number of days you choose to sell back. Enter your salary or hourly rate, how many leave days you have available, and how many you want to cash out, and the calculator above returns the gross payout, an estimated net payout after a simple flat tax-rate estimate, and what those same days would have been worth as paid time off instead. For example, someone earning $72,000 a year on a standard five-day work week has a daily rate of about $276.92, so selling 5 days produces a gross payout of about $1,384.62, or roughly $1,080 after a 22% tax-rate estimate.",
    howItWorks:
      "Selling back leave days works on one simple idea: your employer already pays you a certain amount for each day you work, so cashing out a day of leave pays that same daily rate instead of the day being spent resting. The calculator's job is to find that daily rate accurately, then do the multiplication for you.\n\nIf you're paid an annual salary, the calculator divides your salary by the number of paid work days in a year. It assumes a fixed number of work days per week, all year, with no unpaid weeks and no overtime folded in: work days per week times 52 weeks. A $72,000 salary on a standard five-day week gives 260 work days a year, so the daily rate is $72,000 divided by 260, which comes out to $276.92. Selling 5 days at that rate gives a gross payout of $276.92 times 5, or $1,384.62. If you're paid monthly, the calculator first multiplies your monthly salary by 12 to get an annual figure, then runs the same formula. If you're paid hourly, the daily rate is simpler: your hourly rate times your standard hours in one workday, typically 8. A $35-an-hour employee on an 8-hour day has a daily rate of $280, with no overtime premium included in that figure.\n\nOnce the calculator has a daily rate, the gross payout is just that rate times the number of days you sell. There's no rounding trick and no bonus for selling more days at once. It's a straight multiplication, the same way most employer payroll systems price out a leave-day cash-out or an unused-vacation payment at termination.\n\nThe improvement over a plain gross-payout number is the net estimate. A PTO cash-out is usually paid as a separate, lump-sum item on a paycheck rather than blended into your regular salary, and the [IRS](https://www.irs.gov/publications/p15) treats amounts like this as \"supplemental wages.\" Employers are generally required to withhold supplemental wages at a flat rate, currently 22% for most employees (37% only applies once an employee's supplemental wages for the year pass $1 million), rather than using your regular paycheck's withholding formula. That flat rate is often higher or lower than what you'd actually owe once your full year's income is taxed, so the number on your pay stub the week you cash out leave isn't necessarily your final tax bill on that money. It's just what gets withheld up front. Entering a tax-rate estimate above lets the calculator show a rough net figure using the same idea: gross payout times one minus the rate you enter. On the $1,384.62 example above, a 22% estimate withholds about $304.62, leaving roughly $1,080.00 net. This is a simplified planning number, not a payroll calculation — it doesn't account for Social Security or Medicare withholding, state tax rules, or your employer's specific payroll setup, all of which can shift the real number in either direction.\n\nThe calculator also shows what those same days would have been worth as paid time off, using the identical daily rate. That number matches the gross payout exactly, on purpose. Selling a leave day doesn't manufacture extra value or lose any either. Your employer pays you the same daily rate whether you take the day off or exchange it for cash. The actual decision isn't a math problem; it's a tradeoff between having cash now and having rest, flexibility, or a buffer of paid days later. Someone who is already stretched thin on time off, or who expects a slow season where those days would go unused anyway, tends to lean toward selling. Someone who values the recovery time, or who is worried about being able to take leave later in the year, tends to lean toward keeping the days. The calculator's only job is to make sure both sides of that tradeoff are priced the same way, so the decision comes down to what you actually need rather than a guess about which option pays more.\n\nTwo more assumptions worth naming plainly: the calculator does not model overtime pay, shift differentials, commissions, or bonuses on top of a base rate, and it does not apply any state-specific tax or leave-payout rules. Some employers cap how many days can be sold in a year, some only allow a cash-out during a specific open-enrollment window, and some public-sector and military leave-sale programs have their own eligibility rules and formulas set by policy rather than a simple daily-rate calculation. Check your own employer's leave policy or HR department for the rules that actually apply to your payout.",
    faqs: [
      {
        question: "Can I sell back unused PTO?",
        answer:
          "It depends entirely on your employer's policy. There's no general legal right to cash out unused paid time off in most private-sector jobs. Some employers offer a \"PTO sell-back\" or \"vacation buyback\" option, often once a year or tied to a use-it-or-lose-it deadline, letting employees convert a limited number of days into pay instead of losing them. Others don't offer any cash-out option at all and simply carry leave over, cap it, or forfeit it. Check your employee handbook or ask HR whether a sell-back program exists and how many days it allows.",
      },
      {
        question: "Is a PTO cash-out taxed differently than my regular paycheck?",
        answer:
          "The total tax you owe for the year is calculated the same way regardless of how the income arrived, but the amount withheld up front often isn't. A PTO cash-out is commonly treated as a \"supplemental wage\" for withholding purposes, and the [IRS](https://www.irs.gov/publications/p15) generally has employers withhold supplemental wages at a flat rate, 22% for most employees as of the current rate, rather than running it through your regular paycheck's withholding formula. That can make the check look smaller or larger than expected compared to a normal paycheck of the same size. Your actual tax liability gets reconciled when you file your return; the flat withholding rate is just what's taken out at the time of payment.",
      },
      {
        question: "Is my employer legally required to pay out unused PTO when I leave?",
        answer:
          "It depends on your state, and it's a different question from whether your employer offers a sell-back program while you're still working. A handful of states treat earned vacation as wages you've already earned, so it can't be forfeited: California ([Labor Code §227.3](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=227.3.)) bans use-it-or-lose-it policies outright and requires payout in the final paycheck; Colorado (Colorado Wage Act) and Illinois (820 ILCS 115/5) similarly bar forfeiture of vacation pay earned under the employer's own policy. Most other states, including Texas and Florida, have no such law — the [federal Fair Labor Standards Act](https://www.dol.gov/general/topic/workhours/holidays) doesn't require payment for unused vacation at all, so whether you're paid out on separation comes down entirely to your employer's written policy or contract. Check your own state's labor department and your employee handbook before assuming either way.",
      },
      {
        question: "Does selling leave days affect my other benefits?",
        answer:
          "It can, depending on how your employer structures benefits and accruals. Some plans calculate future PTO accrual, retirement contribution matching, or short-term disability pay using your leave balance or a rolling average of pay that includes lump-sum leave payments, in which case a cash-out could nudge those numbers slightly. Others treat a leave sell-back as a one-time payment with no effect on ongoing benefit calculations. Because this varies a lot by employer and plan design, ask your HR or benefits team directly before selling a large number of days if you're relying on any benefit that's tied to your leave balance or average pay.",
      },
      {
        question: "What is a holiday purchase scheme?",
        answer:
          "A holiday purchase scheme runs the opposite direction from a PTO cash-out: instead of trading unused leave days for cash, an employee pays to buy extra paid leave days on top of their standard allowance, usually through a payroll deduction spread across the year. These schemes are more common outside the U.S., particularly in the U.K. and Ireland, where many employers offer an annual window to buy or sell a set number of holiday days as part of flexible-benefits enrollment. The math is the same daily-rate idea in reverse: the cost of buying a day is typically close to that day's normal pay rate, deducted from future paychecks instead of added to one.",
      },
      {
        question: "How many PTO days can employers let you sell back?",
        answer:
          "There's no universal number. It's set entirely by each employer's policy, and many cap it well below your full leave balance to make sure employees still take some time off. A common structure allows selling back only the days earned beyond a minimum carryover amount, or a flat cap like five or ten days per year, often tied to a specific enrollment period rather than being available year-round. Some public-sector and military leave-sale programs work differently again, with their own statutory limits; for example, federal employees who separate from service receive a lump-sum payment for unused annual leave under rules set by the Office of Personnel Management, a different mechanism from a private-employer sell-back program. Always check your specific plan's cap before assuming a number.",
      },
      {
        question: "Should I sell my leave days or take the time off?",
        answer:
          "There's no universally correct answer, because the dollar value is identical either way. The calculator above deliberately shows the same daily rate on both sides. The decision comes down to what you need more right now: cash for a specific expense, debt payoff, or savings goal, versus rest, flexibility, or a buffer of paid days for later in the year. Check whether your employer caps how many days you can carry over or requires you to use leave by a certain deadline, since a use-it-or-lose-it policy can make selling the more practical choice even if you'd otherwise prefer the time off.",
      },
    ],
    sources: [
      { label: "IRS Publication 15 (Circular E) — Employer's Tax Guide, Section 7: Supplemental wages", url: "https://www.irs.gov/publications/p15" },
      { label: "U.S. Office of Personnel Management — Fact Sheet: Lump-Sum Payments for Annual Leave", url: "https://www.opm.gov/policy-data-oversight/pay-leave/leave-administration/fact-sheets/lump-sum-payments-for-annual-leave/" },
    ],
    defaultPreset: {
      payBasis: "annual",
      annualSalary: 72000,
      monthlySalary: 6000,
      hourlyRate: 35,
      hoursPerWeek: 40,
      hoursPerDay: 8,
      workDaysPerWeek: 5,
      daysAvailable: 15,
      daysToSell: 5,
      taxRatePct: 22,
    },
  },
  {
    id: "iul-calculator",
    updated: "2026-08-30",
    islandId: "iul-calculator",
    label: "IUL",
    navOrder: 21,
    metaTitle: "IUL Calculator: What the Cap and Fees Cost",
    metaDescription:
      "Free IUL calculator projects indexed universal life cash value year by year, showing what the cap and the rising cost of insurance take out.",
    targetKeyword: "iul calculator",
    h1: "IUL Calculator",
    introText:
      "This IUL calculator projects an indexed universal life (IUL) policy year by year and shows what the cap and the cost of insurance actually take out of it. Every guide we write here starts from the math, and on an indexed universal life policy the math turns on charges the sales illustration tends to leave in the footnotes — the same charges that fund the [commission an agent earns](/guides/iul-agent-commission-explained/) for selling the policy in the first place.\n\nEnter your premium, the death benefit, and the cap and participation rate you were quoted. The calculator's year-by-year projection table shows cash value, surrender value, and the death benefit to the age you pick. It runs the same premium into a 401(k) or a taxable brokerage account beside it so you can see both paths at once. This calculator is free to use, with no signup and no Excel file to download. It updates the table as you change the premium, cap, participation rate, or cost-of-insurance inputs, using the numbers you enter rather than one carrier's hard-coded rates.\n\nOn the numbers loaded above, a 40-year-old paying $12,000 a year for 20 years into a $500,000 policy reaches a surrender value of $583,785 at age 70. The same policy with no cap would have reached $1,277,172. The cap cost $693,386, and the cost of insurance took another $49,109.",
    howItWorks:
      "An indexed universal life policy credits interest tied to a stock index, but it does not own the index and it does not pay you the index return. Three settings decide what actually lands in your account. The participation rate is the share of the index move you start with. The cap is the ceiling on that credited rate in a good year. The floor, usually 0%, is what you get in a year the index falls.\n\nThe cap is the setting that costs the most and gets the least attention. In the projection above, year 1 has the index up 19.7% while the policy credits 9%, the cap. That single year hands back $1,207. Repeat it across 30 years and the gap compounds: $583,785 with the cap against $1,277,172 without it. The calculator shows both, because one number without the other is a sales illustration rather than a projection.\n\nCost of insurance is the charge that ends policies. It is billed against the net amount at risk, which is the death benefit minus your cash value, at a rate per $1,000 that rises every year you age. It comes out of cash value. You never write a check for it, so it is easy to miss. While you are still paying premiums it is invisible, because the premium is larger than the charge. After the premiums stop, it is the only thing moving.\n\nThe 0% floor gets misread here. It sets a minimum on the credited rate. It does not set a minimum on your balance. In year 23 of the projection above, the index falls 8.3% and the policy credits 0%, exactly as advertised. Cash value still drops $1,370 that year, because the $1,250 cost of insurance and the $120 annual admin fee are deducted regardless. A floor is not a guarantee that your money cannot go down.\n\nSurrender value is what you would actually walk away with, and for the first several years it is meaningfully less than the cash value. The surrender charge starts at a percentage of cash value and grades to zero over a set number of years. In year 1 above, cash value is $10,956 while surrender value is $9,860, against $12,000 of premium paid. Most of the loss in an indexed universal life policy comes from cancelling early.\n\nThe baseline column runs your premium dollars into a 401(k) with an employer match or a taxable brokerage account instead. With a 50% match, the 401(k) reaches $1,520,634 against the policy's $583,785. Against a taxable brokerage at the same 7% return, the policy trails by $130,639. The match is doing most of that work. Our [IUL vs 401k comparison](/compare/iul-vs-401k/) treats the match as the deciding fact, and our [IUL vs Roth IRA comparison](/compare/iul-vs-roth-ira/) turns on the contribution ceiling instead.\n\nThe defaults loaded above are illustrative assumptions. No carrier's published rates, real cap, or cost-of-insurance table is built into this tool. Ask for an in-force illustration run at the guaranteed maximum charges, then enter those figures here.",
    faqs: [
      {
        question: "What does IUL stand for?",
        answer:
          "IUL stands for indexed universal life, a form of permanent life insurance that credits interest tied to a stock market index instead of paying that index's actual return. An IUL calculator, sometimes called an index universal life insurance calculator, projects what a policy is actually worth. It applies the cap, the participation rate, and the rising cost of insurance, then subtracts each from the index gain the policy is credited. A sales illustration usually skips that math. This calculator runs it in full, using the cap and cost figures you enter rather than generic defaults.",
      },
      {
        question: "Is an IUL a good investment?",
        answer:
          "An indexed universal life policy is life insurance with a savings component. It is usually a poor substitute for a retirement account. On the projection above, the policy ends at $583,785 while the same dollars in a 401(k) with a 50% match reach $1,520,634. It fits a narrow case: someone already maxing every tax-advantaged account who also needs a permanent death benefit and will fund the policy well above its minimum. It is worth it only for that narrow case, and it is not worth it as a first retirement account. That narrow case rarely extends to buying the policy on a child instead of an adult — see [what an IUL for kids actually costs](/guides/iul-for-kids-child-life-insurance/) before running that math separately. An IUL is relatively safe against a market downturn: the 0% floor means a bad index year credits 0% instead of a negative number. It is not safe against the policy's own charges, which still come out of cash value even in a 0% year. In year 23 of the projection above, the index fell 8.3% and the policy credited 0%. Cash value still dropped $1,370 that year, because the cost of insurance and the admin fee were deducted regardless. If you are choosing between a policy and an unfunded 401(k) match, the match wins on arithmetic that is not close.",
      },
      {
        question: "How much does an IUL cost per month?",
        answer:
          "There is no standard monthly cost, because the charge depends on your age, health, the death benefit, and the carrier's own rate table. The shape is predictable: the cost of insurance is charged on the death benefit minus your cash value, and the rate per $1,000 rises every year you age. On the assumptions loaded above, the annual charge starts at $1,219 and totals $49,109 over 30 years. Ask any agent for the policy's guaranteed maximum charges. The illustrated ones are not the number to plan on. Enter the guaranteed figures here. Premium and cost of insurance are two different numbers, and mixing them up is the most common source of confusion. You pay the premium in: $12,000 a year on the assumptions loaded above. The policy pays the cost of insurance out of your cash value to cover the death benefit. On those same assumptions, that charge starts at $1,219 in year one and rises every year you age, totaling $49,109 over 30 years. The price quoted upfront is the premium. The cost of insurance is a separate, ongoing charge that keeps rising even after premiums stop.",
      },
      {
        question: "What happens if I stop paying premiums on an IUL?",
        answer:
          "The charges keep coming out of cash value until the cash value runs out, and then the policy lapses and the coverage ends. This is the most common way an indexed universal life policy fails. Set the premium low against a large death benefit in the calculator above and you can watch it happen. At $2,400 a year against a $750,000 death benefit, the policy lapses in year 7, at age 46, after $16,800 of premiums. If a lapsed policy has gain in it, a tax bill can follow the loss of coverage.",
      },
      {
        question: "How does this calculator project the IUL death benefit?",
        answer:
          "This calculator projects the death benefit for every year of the policy, alongside cash value and surrender value, using the premium, cap, and cost-of-insurance inputs you enter. It also approximates the section 7702 corridor that keeps the death benefit above cash value as the policy grows, the same adjustment that keeps the cost-of-insurance charge accurate. The death benefit is not guaranteed to stay level. If cash value runs out, the policy lapses and the coverage, including the death benefit, ends with it. On $2,400 a year against a $750,000 death benefit, that happens in year 7, at age 46, after $16,800 of premiums.",
      },
      {
        question: "Can the insurance company lower my cap rate?",
        answer:
          "Yes, on most products, and this is the single most important question to ask before you sign. The cap is typically declared by the carrier and can be reset on a policy already in force. The rate in your illustration is not a rate you are owed. Two things are contractual. The guaranteed minimum floor and the guaranteed maximum charges hold. Ask which elements of your specific policy are guaranteed in writing, then run this calculator again with the cap lowered to see what the downside looks like. See how that redeclaration risk actually plays out across specific carriers in our guide to [IUL illustrations by carrier](/guides/iul-illustrations-by-carrier/).",
      },
      {
        question: "What is the 0% floor protecting?",
        answer:
          "The floor sets a minimum on the credited interest rate. It does not set one on your balance. In a year the index falls, the policy credits 0% instead of a negative number, which is real protection against market loss. The policy charges are still deducted from cash value that same year. Toggle the year-by-year table and watch a 0% year after your premiums stop. The balance still shrinks. The floor stops a negative credit and does nothing about the charges.",
      },
      {
        question: "What kind of return does an IUL calculator project?",
        answer:
          "This calculator does not assume one fixed growth rate. It runs the index return you enter, year by year, through the participation rate, cap, and floor you set, then shows the rate that gets credited to cash value. On the assumptions loaded above, a 100% participation rate and a 9% cap turn a 19.7% index year into a 9% credited year. Over 30 years, that produces a surrender value of $583,785, against $1,277,172 for the identical policy with no cap. The gap between those two numbers is the credited growth after the cap and the cost of insurance take their share. Plan around that number, since the index's own return never reaches the policy in full.",
      },
      {
        question: "Is this the same as an infinite banking calculator?",
        answer:
          "Infinite banking usually describes an overfunded whole life policy rather than an indexed universal life one, so the crediting mechanics differ. The cost structure is the same idea: premiums go in, charges come out of cash value, and you borrow against what is left. A policy loan is not free money. It is a loan against your own cash value that accrues interest and reduces the death benefit if you never repay it. Our [infinite banking guide](/guides/infinite-banking/) works through the break-even math, and our [guide to borrowing against life insurance](/guides/borrowing-against-life-insurance/) covers the loan mechanics.",
      },
      {
        question: "What is cash value in an IUL calculator?",
        answer:
          "Cash value is the running account balance inside the policy, the number this calculator tracks year by year as premiums, credited interest, and the cost of insurance move through it. It is not the same as surrender value. Surrender value is the amount the carrier would actually pay you to cancel before the surrender charge phases out. In year 1 of the projection above, cash value is $10,956 while surrender value is $9,860, after $12,000 of premium paid. Cash value is also not the death benefit, which a beneficiary receives if you die while the policy is in force. Watch the cash value row against the cap and cost-of-insurance figures in the year-by-year table to see what moves it each year.",
      },
      {
        question: "Why is the surrender value lower than the cash value?",
        answer:
          "A surrender charge applies for the first several policy years. It grades down to zero on a schedule written into the contract. Cash value is the account balance. Surrender value is what the carrier would pay you to cancel. On the numbers above, year 1 shows $10,956 of cash value against $9,860 of surrender value, after $12,000 of premium. Ask for the surrender-charge schedule in writing before you sign, because it varies by product and by your age at issue.",
      },
      {
        question: "How does an IUL compare to a Roth IRA or a 401(k)?",
        answer:
          "Both accounts beat the policy on cost and access, and the 401(k) adds an employer match the policy cannot match. An indexed universal life policy has no federal contribution cap. A saver who has already filled every tax-advantaged account can keep putting money in. That is a real advantage for a small number of people. Our [IUL vs 401k comparison](/compare/iul-vs-401k/) and [IUL vs Roth IRA comparison](/compare/iul-vs-roth-ira/) work through each decision, and the [taxable vs tax-deferred calculator](/taxable-vs-tax-deferred/) shows the three-way tax math on ordinary accounts.",
      },
      {
        question: "Does this calculator model taxes on the policy?",
        answer:
          "No. It models the policy's cash value, charges, and surrender value, and it applies a tax rate only to the taxable brokerage baseline. It does not model modified endowment contract status, the IRC section 7702 premium limits, or how a policy loan is taxed. Each of those can change the outcome for a specific policy. It does approximate the section 7702 corridor that keeps a death benefit above cash value, because ignoring it would understate the cost of insurance. Treat every figure here as an illustration of the assumptions you entered.",
      },
      {
        question: "How is this different from a carrier's in-force illustration?",
        answer:
          "Every number this calculator shows is an estimate built from the assumptions you enter. No carrier has approved or guaranteed it. This calculator runs on the cap, participation rate, and cost-of-insurance figures you enter. A carrier's in-force illustration runs on its own software and your policy's actual contract terms. Both show a similar year-by-year path: cash value, surrender value, and death benefit. This calculator does not model modified endowment contract status or the section 7702 premium limits in full. It also does not know how your specific carrier prices cost of insurance at your age and health rating. Use it to test how a cap change, a skipped premium, or a lower participation rate would move the numbers. Then confirm the result against an in-force illustration run at guaranteed maximum charges.",
      },
    ],
    sources: [
      { label: "NAIC — Life Insurance Illustrations Model Regulation", url: "https://content.naic.org/sites/default/files/model-law-582.pdf" },
      { label: "NAIC — Life Insurance Consumer Information", url: "https://content.naic.org/consumer/life-insurance.htm" },
      { label: "FINRA — Insurance", url: "https://www.finra.org/investors/investing/investment-products/insurance" },
      { label: "Legal Information Institute — 26 U.S. Code 7702", url: "https://www.law.cornell.edu/uscode/text/26/7702" },
      { label: "Wisconsin Office of the Commissioner of Insurance — Consumer Alert on Universal Life Insurance", url: "https://oci.wi.gov/Pages/Regulation/CA20211203UniversalLifeInsurance.aspx" },
    ],
    defaultPreset: {
      annualPremium: 12000,
      yearsFunded: 20,
      currentAge: 40,
      projectToAge: 70,
      deathBenefit: 500000,
      capRatePct: 9,
      participationRatePct: 100,
      floorPct: 0,
      assumedIndexReturnPct: 7,
      variableReturns: true,
      coiPerThousand: 2.5,
      coiEscalationPct: 8,
      premiumLoadPct: 6,
      monthlyAdminFee: 10,
      surrenderChargePct: 10,
      surrenderChargeYears: 10,
      baseline: "401k",
      baselineReturnPct: 7,
      baselineExpenseRatioPct: 0.1,
      employerMatchPct: 50,
      taxRatePct: 24,
    },
  },
  // Zakat — competitor-monitor pass (2026-09-02): most zakat calculators hardcode a fixed dollar
  // nisab that goes stale within days of a gold/silver price move. This one takes today's metal
  // price as an input and derives the nisab threshold live, from the actual weight-based definition
  // (87.48g gold or 612.36g silver), the way it's actually meant to work.
  {
    id: "zakat",
    updated: "2026-09-02",
    islandId: "zakat",
    label: "Zakat",
    navOrder: 34,
    metaTitle: "Zakat Calculator: Live Nisab, 2.5% Estimate",
    metaDescription:
      "Free zakat calculator with a live nisab threshold based on today's gold or silver price. Enter your assets and debts to see the 2.5% zakat you owe.",
    targetKeyword: "zakat calculator",
    h1: "Zakat Calculator",
    introText:
      "A zakat calculator finds the 2.5% you owe on your zakatable wealth once it clears the nisab threshold, the minimum amount that must be reached before zakat becomes due. In the guides we publish here, we build every calculator around a number you can verify today. This one takes today's gold or silver price as an input and derives the nisab threshold live, so it never hardcodes a dollar figure that goes wrong within days of a price move. Enter your cash, investments, gold, and silver, add any money owed to you, subtract debts and bills due now, and the calculator above returns your zakatable wealth, your nisab threshold, and the zakat due if you clear it.",
    howItWorks:
      "Zakat is calculated as 2.5% of your net zakatable wealth, once two conditions are met: that wealth reaches the nisab threshold, and you've held it for one full lunar year, called the hawl. Miss either condition and no zakat is due yet on that portion of your wealth.\n\nThe nisab is defined as a weight of precious metal. [The Zakat Foundation of America](https://www.zakat.org/what-is-ni-ab-in-islam) puts the classical gold threshold at roughly 85 grams, while other zakat organizations, including [Islamic Relief Canada](https://www.islamicreliefcanada.org/our-work/zakat/zakat-on-gold), cite the more commonly used modern conversion of 87.48 grams of gold, or 612.36 grams of silver. This calculator defaults to the 87.48-gram gold figure and the 612.36-gram silver figure, and lets you enter today's price per gram for whichever metal you choose. That way the dollar threshold updates itself, instead of relying on a number that was only accurate on the day it was written. Most scholars recommend the silver standard by default. Silver's lower price per gram sets a lower dollar threshold, which brings more people into zakat eligibility and is treated as the more cautious, inclusive reading. The gold standard sets a materially higher bar. At a recent price of roughly $139 a gram, 87.48 grams of gold prices the gold nisab near $12,160, versus roughly $1,292 for the silver nisab at $2.11 a gram, a gap that matters most for someone whose wealth sits between the two thresholds.\n\nZakatable wealth adds up the assets zakat actually applies to and subtracts what you owe. On the asset side, that's cash and bank balances, gold and silver held as savings or investment (not classified as personal jewelry, where scholars disagree, covered below), investments and stock, business inventory, and money genuinely owed to you that you expect to collect. It excludes the home you live in, a car you use personally, and other personal-use items, since zakat targets wealth that's productive or held as savings. Everyday property you actually use doesn't count. On the liability side, subtract debts and bills due right now. A mortgage balance stretching years into the future doesn't count here. Only what's actually due today does. Once you have that net number, compare it to the nisab threshold: below it, no zakat is due; at or above it, multiply the full zakatable wealth by 2.5%.\n\nA worked example: say you hold $8,000 in cash and bank accounts and $5,000 in investments, no gold or silver, $1,500 in bills due now, and nothing owed to you. Zakatable wealth is $8,000 plus $5,000, minus $1,500, which comes to $11,500. Using the silver standard at $2.11 a gram, the nisab threshold is 612.36 grams times $2.11, about $1,292.08. Since $11,500 clears that easily, zakat due is 2.5% of $11,500, or $287.50. Check [Kitco's live gold and silver spot prices](https://www.kitco.com/charts/silver) for today's per-gram figure before you rely on the calculator's result, since a price even a few days old shifts the nisab threshold.",
    faqs: [
      {
        question: "What is zakat?",
        answer:
          "Zakat is one of the five pillars of Islam: an obligatory annual payment of 2.5% of a Muslim's net zakatable wealth, owed once that wealth reaches the nisab threshold and has been held for one full lunar year. It functions as a wealth purification and redistribution mechanism, distinct from sadaqah, which is voluntary charity given at any time in any amount.",
      },
      {
        question: "What is nisab?",
        answer:
          "Nisab is the minimum amount of wealth a Muslim must hold before zakat becomes due, defined as a weight of gold or silver rather than a fixed dollar figure. The most commonly used modern conversion sets it at 87.48 grams of gold or 612.36 grams of silver, though the [Zakat Foundation of America](https://www.zakat.org/what-is-ni-ab-in-islam) cites a slightly different classical gold conversion of roughly 85 grams. Because the dollar value of either standard moves with the metal's live price, the calculator above asks for today's price rather than assuming a fixed number.",
      },
      {
        question: "What assets are subject to zakat?",
        answer:
          "Cash and bank balances, gold and silver held as savings or investment, stocks and other investments, business inventory, and money owed to you that you genuinely expect to collect are all zakatable. A home you live in, a car you use personally, and everyday personal-use items are generally excluded, since zakat targets wealth that's productive or held as savings rather than property in active personal use.",
      },
      {
        question: "How do I calculate zakat the right way?",
        answer:
          "Add up your zakatable assets, cash, gold, silver, investments, and money owed to you, then subtract debts and bills due now to get your net zakatable wealth. Compare that figure to the nisab threshold for the metal standard you're using. If your wealth meets or exceeds nisab and you've held it for a full lunar year, multiply the entire zakatable wealth by 2.5% to get the zakat due. Use the full figure here. The amount above nisab alone is a common calculation mistake.",
      },
      {
        question: "Should I pay zakat on jewelry I wear?",
        answer:
          "Scholars disagree on this point. This calculator doesn't take a side. The Hanafi school generally holds that gold and silver jewelry is zakatable regardless of whether it's worn, since the underlying material carries zakat by its nature. Many scholars in the Shafi'i, Maliki, and Hanbali schools instead exempt jewelry that's genuinely worn for personal use, treating it more like a personal item than a store of wealth. If jewelry makes up a meaningful share of your assets, confirm which view your local Islamic center or a qualified scholar follows before you decide whether to include it above.",
      },
      {
        question: "Am I eligible to pay zakat?",
        answer:
          "Zakat is generally due from a Muslim adult of sound mind whose net zakatable wealth meets or exceeds the nisab threshold and has been held for one full lunar year. Below nisab, no zakat is owed. If your wealth dips below nisab at any point before that year is up, most scholars restart the clock once you cross the threshold again. A person whose wealth never reaches nisab isn't obligated to pay, though voluntary charity (sadaqah) is still encouraged at any level.",
      },
      {
        question: "How much zakat do I pay on savings of $200,000?",
        answer:
          "Assuming no debts are subtracted, $200,000 in zakatable savings clears nisab easily under either the gold or silver standard. The math is simple. $200,000 times 2.5% comes to $5,000 in zakat due. Subtract any debts or bills due now from the $200,000 first, if you have them. Zakat is calculated on the amount left after subtracting debts.",
      },
      {
        question: "Why does this calculator ask for today's gold or silver price instead of just showing a dollar amount?",
        answer:
          "Because the nisab is defined as a weight of metal. Gold and silver prices move daily, so a dollar figure fixed at launch is only accurate on the day it was published, and drifts further from correct every day after. Entering today's price per gram, easy to find from a live bullion-price source, keeps the threshold accurate whenever you actually run the numbers.",
      },
      {
        question: "Does this calculator issue a religious ruling (fatwa)?",
        answer:
          "No. It applies the standard 2.5% rate to the net zakatable wealth and nisab threshold you enter, which covers the arithmetic every school of thought agrees on. Points where scholars genuinely disagree, such as jewelry worn for personal use or how to treat a retirement account you can't access yet, aren't resolved by any calculator. Bring those specific questions to a qualified scholar or your local Islamic center.",
      },
    ],
    sources: [
      { label: "Zakat Foundation of America — What Is Nisab in Islam?", url: "https://www.zakat.org/what-is-ni-ab-in-islam" },
      { label: "Islamic Relief Canada — Zakat on Gold", url: "https://www.islamicreliefcanada.org/our-work/zakat/zakat-on-gold" },
      { label: "Kitco — Live Gold and Silver Spot Prices", url: "https://www.kitco.com/charts/silver" },
    ],
    defaultPreset: {
      cashAndBank: 8000,
      investmentsAndStock: 5000,
      goldValue: 0,
      silverValue: 0,
      receivables: 0,
      debtsDueNow: 1500,
      nisabStandard: "silver",
      metalPricePerGram: 2.11,
    },
  },
  MCA_HUB,
  FACTORING_HUB,
  LOC_HUB,
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
