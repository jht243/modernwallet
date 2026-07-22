import type { FAQ, Source } from "./types";
import { BUSINESS_GUIDES } from "./guides-business";

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
      { heading: "Step 6: Bought a house? You now need a will", body: "The single biggest financial asset most first-time buyers acquire is the home. Without a will, at death that home passes under state intestacy law — usually to a spouse and children, but with court supervision through probate and no guardian named for minor kids. A basic will handles both: it directs how the home passes and names a guardian for the children. If you own real estate in more than one state (say, a home plus an inherited family cabin), a revocable living trust also avoids ancillary probate in each state.\n\nAttorney costs run $300 to $2,500 depending on state and complexity; online services like Trust & Will ($199 individual / $299 couple), LegalZoom Basic ($129/$229), or FreeWill ($0) work for straightforward cases. See specifics with our [will cost calculator](/estate-planning/will-cost-calculator/), or run the full plan tier through the [estate planning calculator](/estate-planning/). This applies from the day you close on your first home." },
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

  {
    slug: "passive-income-ideas",
    title: "Passive Income Ideas: Realistic Streams That Actually Work",
    metaDescription:
      "Honest passive income ideas with the math: dividends, REITs, high-yield savings, rental property, and digital products. What's truly passive and what isn't.",
    h1: "Passive Income Ideas: A Math-Honest Guide to What Really Works",
    cardBlurb: "Dividends, REITs, HYSAs, rentals, digital products — with the setup work and taxes each one really takes.",
    intro:
      "The best passive income ideas share one honest truth: nothing is fully passive at the start. Most streams need real money, real setup work, or both before income shows up. The IRS defines passive activities narrowly, and many popular ideas fail that test on your tax return. This guide walks through five realistic streams, the math behind each, and how to pick one that fits your money and time.",
    sections: [
      { heading: "What 'passive income' actually means", body: "'Passive income' sounds hands-off, but the IRS defines the term much more strictly. IRS Topic No. 425 treats passive activities as businesses in which you do not materially participate. Rental real estate is generally passive by default, even if you manage it yourself.\n\nOther streams people call passive, like dividends and interest, are usually classified as portfolio income by the IRS, not passive income. That distinction matters at tax time because passive losses can only offset passive income. Before you chase a stream, know how the IRS will label it and how you will be taxed." },
      { heading: "Idea 1: Dividend investing", body: "A dividend is a share of a company's profit paid to shareholders, usually on a fixed schedule, per the SEC. You earn income by holding shares in companies that consistently pay dividends. Broad dividend index funds spread that income across many companies at a low cost.\n\nThe realistic math is simple. If a portfolio yields 3%, then $100,000 invested pays about $3,000 a year before tax. Qualified dividends are taxed at long-term capital gains rates, which are often lower than ordinary income rates. Model your own numbers with our [dividend calculator](/investing/dividend-calculator/) to see how yield and time change your income." },
      { heading: "Idea 2: REITs and rental property", body: "Real estate is one of the most popular passive income ideas, and one of the least truly passive. A REIT is a company that owns income-producing real estate and pays out most of its profits as dividends. REITs trade like stocks, so they need no landlord work at all.\n\nOwning a rental property is different. You handle tenants, repairs, and vacancies, or you pay a manager 8% to 12% of rent to do it. Model the cash flow before you buy with our [rental cash flow calculator](/real-estate/cash-flow-calculator/). A property with negative monthly cash flow is not passive income, it is a bet on price appreciation." },
      { heading: "Idea 3: High-yield savings and CDs", body: "A high-yield savings account (HYSA) pays interest on cash you keep in a bank. It is the most truly passive stream on this list because no setup skill is required. FDIC insurance covers deposits up to $250,000 per depositor, per insured bank.\n\nThe tradeoff is scale. Even at a 4% rate, $10,000 in an HYSA pays only about $400 a year, and that interest is taxed as ordinary income. Use our [high-yield savings calculator](/investing/high-yield-savings-calculator/) to see what any balance and rate actually pays. HYSAs work best for emergency funds and short-term goals, not as your only income stream." },
      { heading: "Idea 4: Digital products and content", body: "Digital products like courses, ebooks, templates, and stock photos can pay for years after you make them. The upside is huge scale with no per-unit cost to produce a copy. The downside is the front-loaded work, which often takes hundreds of hours before the first dollar arrives.\n\nMost digital products earn very little. The realistic failure mode is spending months building an asset for a market that never buys. Validate demand first with a smaller free version or a paid pre-order. If a market pays for the prototype, the larger product is worth building." },
      { heading: "The decision rule most guides skip", body: "Pick a stream that matches what you actually have. If you have money but not time, dividends, REITs, and HYSAs need no ongoing work. If you have time and skills but less money, digital products can scale without capital.\n\nRental property sits in the middle and needs both. Diversifying across two or three streams protects you when one underperforms, like when rates drop and HYSA yields fall. Start with the one that fits your situation, and expand only after it works." },
    ],
    tools: [
      { href: "/investing/dividend-calculator/", label: "Dividend income" },
      { href: "/investing/high-yield-savings-calculator/", label: "High-yield savings" },
      { href: "/real-estate/cash-flow-calculator/", label: "Rental cash flow" },
    ],
    faqs: [
      { question: "What are the best passive income ideas for beginners?", answer: "The best passive income ideas for beginners are high-yield savings accounts and broad dividend index funds. Both need almost no setup skill and start earning right away. A high-yield savings account pays interest immediately, while dividend funds spread income across many companies." },
      { question: "How much money do I need to start earning passive income?", answer: "You can start with any amount, but the income scales with what you invest. At a 4% yield, $1,000 pays about $40 a year, and $100,000 pays about $4,000. Small starts still build the habit of investing regularly, which grows the income over time." },
      { question: "Is dividend income truly passive?", answer: "Dividend income is hands-off, but the IRS classifies it as portfolio income, not passive income. That label matters at tax time because passive losses can only offset passive income under IRS rules. Qualified dividends are usually taxed at lower long-term capital gains rates." },
      { question: "Is rental property really passive income?", answer: "Rental property is passive under IRS rules but rarely passive in real life. You still handle tenants, repairs, and vacancies unless you pay a property manager 8% to 12% of rent. The IRS treats most rental income as passive even when you actively manage the property." },
      { question: "Are money in HYSAs and CDs FDIC insured?", answer: "Yes, deposits at FDIC-insured banks are covered up to $250,000 per depositor, per bank. This coverage includes savings accounts, checking accounts, CDs, and money market deposit accounts. Money market mutual funds are investments and are not FDIC insured." },
      { question: "How is passive income taxed?", answer: "Passive income is taxed based on its source. Interest and non-qualified dividends are taxed as ordinary income, while qualified dividends and long-term capital gains get lower rates. Rental income is reported on Schedule E, and IRS Form 8582 handles passive activity losses." },
    ],
    sources: [
      { label: "IRS — Topic No. 425, Passive Activities", url: "https://www.irs.gov/taxtopics/tc425" },
      { label: "SEC Investor.gov — Dividend", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/dividend" },
      { label: "FDIC — Deposit Insurance", url: "https://www.fdic.gov/resources/deposit-insurance/" },
    ],
  },

  {
    slug: "tax-tips",
    title: "Tax Tips: Planning Moves Individuals Often Miss",
    metaDescription:
      "Practical tax tips: retirement account contributions, HSAs, tax-loss harvesting, brackets, and standard vs itemized. General information, not tax advice.",
    h1: "Tax Tips: A Practical Checklist of Planning Moves to Consider",
    cardBlurb: "Retirement accounts, HSAs, tax-loss harvesting, brackets, and standard vs itemized — the moves people often miss.",
    intro:
      "These tax tips cover practical planning moves individuals often miss during the year, not just at filing time. You will learn how retirement accounts, HSAs, and tax-loss harvesting can lower your bill, plus how brackets and the standard deduction shape every decision. This guide is general information, not tax advice. Rules change, and your situation may need a CPA or enrolled agent to review.",
    sections: [
      { heading: "Tip 1: Fund tax-advantaged accounts first", body: "The biggest tax break most people miss is simply funding tax-advantaged accounts up to the annual limit. For 2026, the IRS lets you contribute up to $24,500 to a 401(k), plus an $8,000 catch-up at age 50 or older. Traditional 401(k) contributions lower your taxable income today.\n\nIRAs offer a smaller but useful boost. The 2026 IRA contribution limit is $7,500, with a $1,100 catch-up at age 50 or older. Use our [401k calculator](/retirement/401k-calculator/) and [Roth IRA calculator](/investing/roth-ira-calculator/) to see how each choice grows over time. Always contribute enough to your 401(k) to capture the full employer match first, because that is a 100% return that you cannot get anywhere else." },
      { heading: "Tip 2: Use an HSA for the triple tax break", body: "A Health Savings Account (HSA) is the only account that offers a triple tax advantage. IRS Publication 969 confirms all three: contributions are tax-deductible, growth is tax-free, and qualified medical withdrawals are tax-free. You need a high-deductible health plan to qualify.\n\nFor 2026, the IRS lets you contribute up to $4,400 for self-only coverage and $8,750 for family coverage. Many people miss the biggest opportunity by spending the HSA balance right away instead of investing it. If you can pay medical bills from other cash, let the HSA grow, then withdraw for those past expenses years later, tax-free." },
      { heading: "Tip 3: Consider tax-loss harvesting each fall", body: "Tax-loss harvesting means selling investments at a loss to offset gains and reduce your tax bill. The IRS lets you use realized losses to cancel out realized capital gains dollar for dollar. Any extra loss can offset up to $3,000 of ordinary income each year, and any remainder carries forward to future years.\n\nWatch the wash-sale rule. If you buy the same or a substantially identical security within 30 days before or after the sale, the loss is disallowed. Review your taxable brokerage account each November, not just in December, so you have time to act without rushing." },
      { heading: "Tip 4: Watch your bracket transitions", body: "The federal income tax uses marginal brackets, which means only the income above each threshold is taxed at that bracket's rate. This is not the same as your average tax rate. Understanding the difference helps you plan year-end income and deductions.\n\nA small change can matter near a bracket edge. Timing a Roth conversion, a bonus, or a large deduction can keep you in a lower bracket. If you are near a threshold, delaying $5,000 of income or accelerating a deduction can save real money. Our [high-yield savings calculator](/investing/high-yield-savings-calculator/) helps you plan year-end cash moves." },
      { heading: "Tip 5: Standard versus itemized deduction", body: "Most filers now take the standard deduction because it is larger than their itemized total. You should itemize only when your qualifying deductions exceed the standard amount. Common itemized items include state and local taxes (capped at $10,000), mortgage interest, and charitable gifts.\n\nOne planning move: bunching. If your itemized total is close to the standard, group two years of charitable gifts into one year to clear the threshold, then take the standard next year. A donor-advised fund can hold the gift now and distribute it over time. Check the current standard deduction on IRS.gov before you plan." },
      { heading: "Already behind on taxes? Here are your options →", body: "The tips above are proactive planning — they work if you're current on filing and payments. If you already owe back taxes, the IRS has statutory relief programs the public rarely hears about: Offer in Compromise settles the debt for less than owed, an installment agreement spreads it over 72+ months and cuts the failure-to-pay penalty in half, Currently Not Collectible suspends collection during hardship, First Time Abate wipes penalties, and the 10-year Collection Statute Expiration Date under IRC §6502(a)(1) writes off what isn't collected in time. Our [tax resolution calculator](/tax-resolution/) maps your specific situation to the right program, and the [back taxes impact calculator](/tax-resolution/back-taxes-impact-calculator/) shows the mortgage, passport, and credit consequences of leaving it unaddressed." },
    ],
    tools: [
      { href: "/retirement/401k-calculator/", label: "401(k) growth" },
      { href: "/investing/roth-ira-calculator/", label: "Roth IRA" },
      { href: "/investing/high-yield-savings-calculator/", label: "High-yield savings" },
    ],
    faqs: [
      { question: "What is the best tax tip most people miss?", answer: "The best tax tip most people miss is funding tax-advantaged accounts up to the annual IRS limit. A 401(k) contribution can lower your taxable income today, and an HSA offers a triple tax break. Capturing the full employer match on a 401(k) is the highest-return money move you can make." },
      { question: "How much can I contribute to a 401(k) in 2026?", answer: "The 2026 401(k) contribution limit is $24,500, per the IRS. If you are 50 or older, you can add an $8,000 catch-up contribution for $32,500 total. Ages 60 to 63 have a special $11,250 catch-up under SECURE 2.0." },
      { question: "What is tax-loss harvesting?", answer: "Tax-loss harvesting is selling losing investments to offset realized capital gains. The IRS lets you cancel gains dollar for dollar and use up to $3,000 of extra loss against ordinary income each year. Any remaining loss carries forward to future tax years." },
      { question: "How does an HSA give a triple tax advantage?", answer: "An HSA gives three tax breaks per IRS Publication 969: deductible contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses. You need a high-deductible health plan to contribute. The 2026 contribution limits are $4,400 for self-only and $8,750 for family coverage." },
      { question: "Should I take the standard or itemized deduction?", answer: "You should take whichever is larger. Most filers now take the standard deduction because it exceeds their itemized total. Itemize when your state and local taxes (capped at $10,000), mortgage interest, and charitable gifts add up to more than the standard." },
      { question: "Is this tax advice?", answer: "No, this guide is general information for education, not tax advice. Tax rules change and vary by state, filing status, and income. Talk to a CPA, enrolled agent, or other qualified tax professional before making major moves like Roth conversions or large charitable gifts." },
    ],
    sources: [
      { label: "IRS — 401(k) limit increases to $24,500 for 2026", url: "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500" },
      { label: "IRS — Publication 969, HSAs and Other Tax-Favored Health Plans", url: "https://www.irs.gov/publications/p969" },
      { label: "IRS — Topic No. 425, Passive Activities", url: "https://www.irs.gov/taxtopics/tc425" },
    ],
  },

  {
    slug: "how-to-choose-a-financial-advisor",
    title: "How to Choose a Financial Advisor: A Decision Guide",
    metaDescription:
      "How to choose a financial advisor: fiduciary vs suitability, fee-only vs commission, CFP credentials, and how to verify with SEC IAPD and FINRA BrokerCheck.",
    h1: "How to Choose a Financial Advisor: A Step-by-Step Decision Guide",
    cardBlurb: "Fiduciary vs suitability, fee-only vs commission, CFP credentials, and how to verify a real advisor.",
    intro:
      "Learning how to choose a financial advisor starts with the standard they follow, not the pitch they give. Some advisors are fiduciaries who must put your interests first. Others only need to recommend something suitable, which is a weaker rule. This guide walks you through the standards, the fee models, the CFP credential, how to verify an advisor, and the questions to ask on your first call.",
    sections: [
      { heading: "Step 1: Understand fiduciary vs suitability", body: "The single most important test is the standard your advisor follows. A fiduciary is required by law to act in your best interest, disclose conflicts, and avoid self-dealing. The SEC applies this fiduciary duty to registered investment advisers under the Investment Advisers Act of 1940.\n\nBrokers historically only had to recommend something suitable, a weaker rule that allowed higher-fee products when a cheaper option would also fit. Regulation Best Interest now raises the broker standard, but it is still not the same as fiduciary duty. Ask any advisor in writing: 'Are you a fiduciary at all times, on all my accounts?' The answer should be a simple yes." },
      { heading: "Step 2: Compare fee-only, commission, and hybrid", body: "How an advisor is paid shapes what they recommend. Fee-only advisors are paid only by you, either as a percentage of assets managed (often around 1% per year), a flat fee, or an hourly rate. This model reduces conflicts because their pay does not depend on which product you buy.\n\nCommission-based advisors earn from the products they sell you, like mutual funds, annuities, or insurance. Hybrid advisors can charge both. The SEC recommends comparing fees in actual dollars, not just percentages. A 1% fee on $500,000 is $5,000 a year, which needs to buy real value to be worth it." },
      { heading: "Step 3: Look for the CFP credential", body: "The CFP (Certified Financial Planner) is the most respected credential in personal financial planning. CFP professionals must complete college-level coursework, pass a rigorous exam, meet an experience requirement, and follow a code of ethics. CFP Board rules require them to act as fiduciaries when giving financial advice.\n\nOther credentials exist and vary widely in rigor. The SEC warns that professional designations do not all require the same difficulty, and some may indicate product limitations. A CFP with a fee-only fiduciary practice is a strong starting point for most families." },
      { heading: "Step 4: Verify the advisor before you hire", body: "Never hire an advisor without checking their record. The SEC provides two free tools you should always use. Investment Adviser Public Disclosure (IAPD) at adviserinfo.sec.gov shows the firm's Form ADV, services, fees, conflicts, and any disciplinary history. FINRA's BrokerCheck at brokercheck.finra.org covers brokers.\n\nThe SEC also requires most advisors to give you Form CRS, the Customer Relationship Summary. It discloses services, fees, conflicts, and any disciplinary events in plain language. If someone will not send you a Form CRS or ADV, walk away." },
      { heading: "Step 5: Questions to ask on the first call", body: "Bring the same short list to every advisor you interview. Ask: Are you a fiduciary on all accounts and at all times, in writing? How are you paid, exactly, and what will my total annual cost be in dollars? What credentials do you hold, and is one the CFP?\n\nAlso ask: Who is your typical client, and do they look like me? How often will we meet, and who is my main contact? What happens to my accounts if you leave or retire? A good advisor answers each question directly. A vague or evasive answer is your signal to keep looking." },
    ],
    tools: [
      { href: "/retirement/", label: "Retirement" },
      { href: "/investing/", label: "Investing" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "How do I choose a financial advisor?", answer: "Choose a financial advisor by starting with the fiduciary standard, then the fee model, then credentials. A fee-only fiduciary who holds the CFP credential is a strong starting point. Always verify their record on SEC IAPD or FINRA BrokerCheck before you sign anything." },
      { question: "What is a fiduciary financial advisor?", answer: "A fiduciary financial advisor is legally required to act in your best interest. The SEC applies this fiduciary duty to registered investment advisers under the Investment Advisers Act of 1940. Brokers historically followed a weaker 'suitability' standard, though Regulation Best Interest now raises that bar." },
      { question: "What is the difference between fee-only and commission?", answer: "A fee-only advisor is paid only by you, through a percentage of assets, a flat fee, or an hourly rate. A commission-based advisor is paid by the companies whose products they sell. Fee-only reduces conflicts because the advisor's pay does not depend on which product you buy." },
      { question: "What does CFP mean?", answer: "CFP stands for Certified Financial Planner, the leading credential in personal financial planning. CFP professionals must complete college-level coursework, pass an exam, meet an experience requirement, and follow a code of ethics. CFP Board rules require them to act as fiduciaries when giving financial advice." },
      { question: "How do I verify a financial advisor?", answer: "Verify an advisor using the SEC's Investment Adviser Public Disclosure (IAPD) at adviserinfo.sec.gov and FINRA's BrokerCheck at brokercheck.finra.org. Both are free and show the advisor's firm, services, fees, and any disciplinary history. Also request Form CRS and Form ADV before hiring." },
      { question: "How much does a financial advisor cost?", answer: "Costs vary by model. A fee-only advisor may charge about 1% of assets managed per year, a flat annual fee of a few thousand dollars, or an hourly rate. On $500,000, a 1% fee is $5,000 a year, so compare fees in actual dollars, not just percentages." },
      { question: "Where can I find a financial advisor?", answer: "Start with SEC Investment Adviser Public Disclosure (IAPD) at adviserinfo.sec.gov or FINRA BrokerCheck at brokercheck.finra.org, which let you search for advisors directly by name or firm instead of relying on an ad. The CFP Board also maintains a directory of CFP professionals. Wherever you find candidates, run them through the same verification steps before you hire anyone." },
    ],
    sources: [
      { label: "SEC Investor.gov — Choosing an Investment Professional", url: "https://www.investor.gov/introduction-investing/getting-started/working-investment-professional" },
      { label: "SEC — Investment Adviser Public Disclosure (IAPD)", url: "https://adviserinfo.sec.gov/" },
      { label: "FINRA — BrokerCheck", url: "https://brokercheck.finra.org/" },
    ],
  },

  {
    slug: "financial-advisor-worth-it",
    title: "Is a Financial Advisor Worth It? What to Know",
    metaDescription:
      "Is a financial advisor worth it? See what advisors typically cost, what research says about the value they add, and when DIY investing makes more sense.",
    h1: "Is a Financial Advisor Worth It? What the Research Actually Shows",
    cardBlurb: "What advisors cost, what Vanguard's research says about the value they add, and when DIY investing wins instead.",
    intro:
      "A financial advisor is worth the cost when the value they add — through smarter investment behavior, tax-aware moves, and a plan you actually follow — is bigger than the fee you pay, and [Vanguard](https://advisors.vanguard.com/content/dam/fas/pdfs/IARCQAA.pdf)'s own research puts that potential value at close to 3% a year for many investors. This guide breaks down what advisors actually cost, what the research says about the value they can add, and the specific situations where paying for one is worth it, or where doing it yourself is the smarter call.",
    sections: [
      { heading: "Step 1: What a financial advisor actually costs", body: "Most fee-only financial advisors charge a percentage of assets under management (AUM), commonly around 1% a year. On a $250,000 portfolio, that is $2,500 a year; on $1,000,000, it is $10,000 a year — real money that compounds against you the same way investment growth compounds for you.\n\nFlat-fee and hourly advisors are a growing alternative. Flat annual retainers commonly run $2,000 to $7,500 depending on complexity, and hourly planning runs roughly $150 to $400 an hour for a handful of sessions. Robo-advisors sit at the low end, often charging around 0.25% of assets with no dedicated human advisor attached. See our [guide to choosing a financial advisor](/guides/how-to-choose-a-financial-advisor/) for how fee models compare in more detail." },
      { heading: "Step 2: What the research says an advisor adds", body: "Vanguard's Advisor's Alpha research estimates that good advice can add on the order of 3 percentage points a year in net value, though the exact figure varies by investor and Vanguard is careful to note it is not earned evenly every year. The value comes less from picking winning investments and more from behavior: staying invested through downturns, rebalancing on a schedule instead of on emotion, and using tax-efficient moves like asset location and tax-loss harvesting.\n\nThe biggest single piece is usually behavioral coaching. Investors who sell in a panic during a downturn and buy back in late lock in losses that a disciplined, hands-off investor avoids entirely. An advisor's real job in a bad year is often simply talking a client out of a costly mistake, something a spreadsheet alone can't do." },
      { heading: "Step 3: When paying for a financial advisor is worth it", body: "A financial advisor tends to earn their fee when your situation has real complexity: a business sale, an inheritance, stock compensation with vesting and tax timing decisions, a pending retirement with Social Security claiming and withdrawal-order questions, or simply not having the time or temperament to manage investments yourself. High-net-worth households, roughly $1 million or more in investable assets, often layer on estate and tax coordination that is hard to DIY well.\n\nAn advisor is also worth it if you know, honestly, that you panic-sell during downturns or chase performance after the fact. That behavioral gap alone can cost more than any advisor fee over a full market cycle." },
      { heading: "Step 4: When DIY investing is the smarter choice", body: "If your situation is simple — one or two retirement accounts, no complex tax events, and the discipline to keep contributing on autopilot — a low-cost target-date fund or a robo-advisor at roughly 0.25% can capture most of the same diversification benefit at a fraction of the cost. Our [investing hub](/investing/) and [portfolio calculator](/portfolio/) can model the same allocation math a paid advisor would run.\n\nSmall balances are the clearest DIY case. A 1% fee on a $20,000 account is $200 a year, which needs to buy real behavioral or tax value to be worth it. As the dollar amount and the complexity both grow, the math shifts in the advisor's favor." },
      { heading: "Step 5: Run your own break-even math", body: "Compare the dollar cost of the fee to a realistic estimate of the value an advisor adds for your specific situation, not the average 3% figure. On $500,000, a 1% fee is $5,000 a year. If a disciplined plan and better tax placement genuinely save you more than $5,000 a year in avoided mistakes and tax drag, the advisor pays for themselves; if your situation is simple enough that you would not make those mistakes anyway, the fee is a pure cost.\n\nOnce you decide an advisor is worth it, our [guide to choosing a financial advisor](/guides/how-to-choose-a-financial-advisor/) walks through fiduciary status, fee models, the CFP credential, and how to verify anyone before you hire them." },
      { heading: "Robo-advisor vs. financial advisor: a quick side-by-side", body: "A robo-advisor and a financial advisor solve the same core problem, building and managing a portfolio, at very different price points and service levels. Cost is the starkest difference: a robo-advisor typically charges around 0.25% of assets with no dedicated human attached, while a traditional fee-only financial advisor charges roughly 1% AUM, about four times more, for a relationship with an actual person.\n\nThat extra cost buys judgment a robo-advisor's algorithm can't replicate: behavioral coaching during a downturn, tax-aware moves like asset location and loss harvesting timed to your specific situation, and guidance through one-time events like a business sale or inheritance. A robo-advisor rebalances on schedule and diversifies well, but it can't talk you out of a panic sell or plan around a stock-compensation vesting schedule.\n\nPick a robo-advisor if your situation is simple, one or two retirement accounts with no complex tax events, and you mainly need low-cost diversification and rebalancing. Pick a financial advisor once your situation has real complexity, or if you know you tend to make emotional investment decisions during volatility; the behavioral coaching alone is often worth more than the extra fee. See our [financial advisor vs financial planner](/compare/financial-advisor-vs-financial-planner/) comparison for the difference between those two credentials once you decide a human advisor is the right call." },
    ],
    tools: [
      { href: "/guides/how-to-choose-a-financial-advisor/", label: "How to choose a financial advisor" },
      { href: "/investing/", label: "Investing" },
      { href: "/portfolio/", label: "Portfolio" },
    ],
    faqs: [
      { question: "Is a financial advisor worth the 1% fee?", answer: "It depends on the value they add for your specific situation. Vanguard's research estimates advisors can add roughly 3 percentage points a year for many investors, mostly through behavioral coaching, rebalancing discipline, and tax-aware moves, but that value is not guaranteed and varies by investor and advisor." },
      { question: "What is the Vanguard Advisor's Alpha study?", answer: "Vanguard Advisor's Alpha is Vanguard's own research framework quantifying the value a good advisor can add through behavioral coaching, asset allocation, rebalancing, and tax-efficient placement, rather than through picking outperforming investments. Vanguard estimates the potential value at roughly 3% a year, concentrated mainly in behavioral guidance during volatile markets." },
      { question: "Is a financial advisor worth it for a small portfolio?", answer: "Usually not on fees alone. A 1% fee on a $20,000 account is $200 a year, and that needs to buy real value to be worth it. Smaller, simpler portfolios are often better served by a low-cost target-date fund or a robo-advisor, which typically charges around 0.25% with no dedicated human advisor." },
      { question: "Are robo-advisors a cheaper alternative to a financial advisor?", answer: "Yes, for straightforward situations. Robo-advisors typically charge around 0.25% of assets, versus roughly 1% for a traditional fee-only advisor, and automate diversification and rebalancing. They generally cannot replace a human advisor's judgment on complex tax, estate, or major life-event decisions." },
      { question: "When should I actually hire a financial advisor?", answer: "Consider hiring one when your situation gets complex, such as a business sale, inheritance, stock compensation, or retirement withdrawal planning, or when you know you tend to make emotional investment decisions during downturns. Our [guide to choosing a financial advisor](/guides/how-to-choose-a-financial-advisor/) covers how to vet and hire one once you decide it's worth it." },
      { question: "Robo-advisor or financial advisor for a $100,000 portfolio?", answer: "A robo-advisor at 0.25% costs about $250 a year on $100,000, versus roughly $1,000 a year for a 1% financial advisor. If your situation is straightforward, the robo-advisor is the lower-cost choice; if you have complex tax, estate, or behavioral needs, the extra $750 a year can easily pay for itself." },
    ],
    sources: [
      { label: "Vanguard — Advisor's Alpha", url: "https://advisors.vanguard.com/content/dam/fas/pdfs/IARCQAA.pdf" },
      { label: "SEC Investor.gov — Choosing an Investment Professional", url: "https://www.investor.gov/introduction-investing/getting-started/working-investment-professional" },
    ],
  },

  {
    slug: "is-60-40-portfolio-dead",
    title: "Is the 60/40 Portfolio Dead? What the Data Shows",
    metaDescription:
      "Is the 60/40 portfolio dead? See how it performed in the historic 2022 downturn and the years since, then decide if it still fits your own plan.",
    h1: "Is the 60/40 Portfolio Dead? What the Historical Data Actually Shows",
    cardBlurb: "The 2022 downturn that sparked the debate, the recovery since, and whether the classic 60/40 mix still earns a place in your plan.",
    intro:
      "The 60/40 portfolio is not dead — it had its worst year in decades in 2022, then rebounded sharply, and its long-run role as a balance between growth and stability is intact for most investors. This guide walks through what actually happened in 2022, how the portfolio has performed since, and how to decide whether 60/40 still fits your own plan.",
    sections: [
      { heading: "Step 1: What actually happened in 2022", body: "In 2022, the 60/40 portfolio delivered its worst performance since 1937 and one of its worst in roughly 200 years, according to [Morgan Stanley Investment Management](https://www.morganstanley.com/im/publication/insights/articles/article_bigpicturereturnofthe6040_ltr.pdf)'s own analysis of the strategy. Stocks and bonds fell together as the Federal Reserve raised interest rates aggressively to fight inflation, which broke the usual pattern where bonds cushion a stock selloff.\n\nThat simultaneous decline is exactly why the '60/40 is dead' narrative took hold. Bonds are supposed to zig when stocks zag; in 2022 they zagged together, and a strategy built on that offset looked broken for the first time in most investors' memory." },
      { heading: "Step 2: The rebound the headlines skipped", body: "The 60/40 portfolio rebounded sharply in the two years that followed as inflation cooled and interest rates stabilized, per Morgan Stanley's own data on the strategy. Stocks and bonds both posting gains again restored the diversification benefit that briefly disappeared in 2022.\n\nThe lesson isn't that 2022 didn't happen, it did, and it hurt. The lesson is that judging a decades-long strategy by its single worst year, then declaring it permanently broken, ignores what happened in the years right after. A strategy built for a full market cycle needs to be judged across a full cycle, not one bad year." },
      { heading: "Step 3: Why bonds and stocks fell together in 2022 (and usually don't)", body: "Stocks and bonds normally have a low or negative correlation, which is the entire reason to hold both. 2022 was unusual because the shock hit both asset classes through the same channel: the Fed's rapid rate hikes hurt bond prices directly, since higher rates make existing lower-yield bonds worth less, while also spooking stock valuations, which are sensitive to the discount rate used to value future earnings.\n\nThat kind of shared shock is rare but not unprecedented — it is closer to a once-in-a-generation event than the new normal. Most historical downturns, including 2008 and 2020, saw bonds hold up or gain while stocks fell, which is the diversification benefit working as intended." },
      { heading: "Step 4: Is 60/40 still a reasonable default?", body: "For an investor without a strong view on markets, 60/40 remains a reasonable, evidence-based starting point precisely because it doesn't require predicting the next crisis. Our [stocks vs bonds comparison](/compare/stocks-vs-bonds/) covers the classic age-based rule, 110 minus your age in stocks, that 60/40 approximates for a mid-career investor.\n\nThat said, 'reasonable default' is not the same as 'right for everyone.' Someone decades from retirement with a high risk tolerance may prefer a more stock-heavy mix like [70/30](/portfolio/70-30-portfolio-calculator/) or [80/20](/portfolio/80-20-portfolio-calculator/) for higher expected growth. Someone already retired and drawing down the portfolio may want more bonds, not fewer, for stability. Use the [60/40 portfolio calculator](/portfolio/60-40-portfolio-calculator/) to see the expected return and risk for your own numbers, and the [asset allocation calculator](/portfolio/asset-allocation-calculator/) to test other splits." },
      { heading: "Step 5: What to actually do with this information", body: "Don't abandon a long-term allocation because of one bad year, and don't assume 2022 can't happen again either. Both are overreactions. A more useful response is to check that your bond allocation matches your actual time horizon, since shorter-duration bonds hold up better when rates rise sharply, and that your stock-to-bond mix still matches how much risk you can actually tolerate, not how it felt to watch the account in late 2022.\n\nIf your answer is that 60/40 still fits your time horizon and risk tolerance, the historical data supports keeping it. If your time horizon has genuinely changed, that's a real reason to adjust the mix, the 2022 headlines by themselves are not." },
    ],
    tools: [
      { href: "/portfolio/60-40-portfolio-calculator/", label: "60/40 portfolio calculator" },
      { href: "/portfolio/70-30-portfolio-calculator/", label: "70/30 portfolio calculator" },
      { href: "/portfolio/asset-allocation-calculator/", label: "Asset allocation calculator" },
    ],
    faqs: [
      { question: "Is the 60/40 portfolio dead in 2026?", answer: "No. The 60/40 portfolio had its worst year since 1937 in 2022, but it rebounded sharply in the years that followed as inflation cooled, per Morgan Stanley Investment Management's analysis. A strategy's single worst year in nearly a century isn't evidence it's permanently broken." },
      { question: "Why did the 60/40 portfolio do so badly in 2022?", answer: "Stocks and bonds fell together in 2022, which is unusual, since bonds normally cushion a stock selloff. The Federal Reserve's aggressive interest rate hikes to fight inflation hurt bond prices directly while also pressuring stock valuations, breaking the typical inverse relationship between the two asset classes for that year." },
      { question: "Has the 60/40 portfolio recovered since 2022?", answer: "Yes. The 60/40 portfolio posted strong gains in the two years following the 2022 downturn as both stocks and bonds recovered, according to Morgan Stanley's own data on the strategy. Judging the strategy only by its worst single year misses the recovery that followed." },
      { question: "Should I still use a 60/40 portfolio?", answer: "It depends on your time horizon and risk tolerance, not on 2022 alone. If you want a balance of growth and stability and don't want to actively manage the mix, 60/40 remains a reasonable, well-tested starting point. Use the [60/40 portfolio calculator](/portfolio/60-40-portfolio-calculator/) to see the expected return and risk for your own numbers." },
      { question: "What's a good alternative to 60/40 if I want more growth?", answer: "A more stock-heavy mix like 70/30 or 80/20 trades some stability for higher expected long-run growth, which can suit investors with a longer time horizon and higher risk tolerance. Someone closer to retirement or already drawing down savings usually wants the opposite: more bonds, not fewer, for stability." },
    ],
    sources: [
      { label: "Morgan Stanley Investment Management — The Big Picture: The Return of the 60/40 Portfolio", url: "https://www.morganstanley.com/im/publication/insights/articles/article_bigpicturereturnofthe6040_ltr.pdf" },
      { label: "SEC Investor.gov — Asset Allocation", url: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation" },
    ],
  },

  {
    slug: "money-market-account",
    title: "Money Market Account: How MMAs Work vs HYSAs and CDs",
    metaDescription:
      "What a money market account is, how it differs from a high-yield savings account and CDs, FDIC coverage rules, and when to use each for your cash.",
    h1: "Money Market Account: A Practical Guide to MMAs vs HYSAs and CDs",
    cardBlurb: "How money market accounts work, MMA vs HYSA vs CD, FDIC coverage, and when to use each.",
    intro:
      "A money market account is a bank deposit account that usually pays a higher interest rate than a regular savings account. The CFPB explains that MMAs may allow limited check writing and debit card use, unlike most savings accounts. This guide covers how MMAs work, how they compare to high-yield savings accounts and CDs, what FDIC coverage protects, and when each account is the right choice for your cash.",
    sections: [
      { heading: "What a money market account is", body: "A money market account (MMA) is an interest-bearing deposit account at a bank or credit union. The CFPB describes MMAs as savings-style accounts that tend to pay higher interest than plain savings accounts. They often allow limited check writing and [debit card use](/guides/money-market-account-debit-card/), which regular savings accounts usually do not.\n\nMost MMAs require a higher minimum balance than a basic savings account, sometimes $1,000 or more. Some banks pay a higher rate only if you keep a balance above a set threshold. Read the fee schedule before opening one, because monthly fees can wipe out the extra interest on smaller balances." },
      { heading: "MMA vs money market mutual fund", body: "This is the single biggest source of confusion. A money market account is a bank deposit, and it is FDIC insured. A money market mutual fund is an investment sold by brokerage firms, and it is not FDIC insured, though it may have SIPC coverage.\n\nThe CFPB warns that these two products follow different regulations even though they share a similar name. If someone tells you their money market pays a much higher rate than any bank, they may mean a mutual fund. Check the account paperwork for the phrase 'FDIC insured' before you deposit money." },
      { heading: "FDIC coverage rules that protect your cash", body: "FDIC insurance covers deposits at insured banks up to $250,000 per depositor, per bank, per ownership category. Money market deposit accounts, savings accounts, checking accounts, and CDs all fall under this coverage. Credit union deposits get the same protection through the NCUA.\n\nA couple can effectively cover more by using different ownership categories. Two individual accounts and one joint account at the same bank give a couple up to $1,000,000 in coverage. The FDIC's Electronic Deposit Insurance Estimator (EDIE) calculates your exact coverage based on how the accounts are titled." },
      { heading: "MMA vs high-yield savings account (HYSA)", body: "Both accounts are FDIC-insured bank deposits that pay competitive interest. The differences show up in access and minimums. MMAs often allow limited check writing and a debit card, while HYSAs typically require an online transfer to move money. HYSAs from online-only banks often pay higher rates and have lower minimums.\n\nPick an MMA when you want quick check or debit access to a large cash balance, like a home down payment fund you may need on short notice. Pick an HYSA when the highest rate matters most and you do not need check-writing. Use our [high-yield savings calculator](/investing/high-yield-savings-calculator/) to compare rates in real dollars." },
      { heading: "MMA vs CD (certificate of deposit)", body: "A certificate of deposit (CD) locks your money for a fixed term, usually 3 months to 5 years, in exchange for a set interest rate. CDs typically charge an early-withdrawal penalty if you break the term. MMAs stay liquid and let you withdraw anytime, but their rate can change at any time.\n\nUse a CD when you know the exact date you need the cash and rates might drop. Use an MMA when you need flexibility or the timeline is uncertain. Many savers ladder CDs by opening several with staggered maturity dates, keeping some cash accessible while locking in longer-term rates. Model your goal with our [savings goal calculator](/investing/savings-goal-calculator/)." },
      { heading: "Withdrawal limits: how many times you can take money out", body: "Most money market accounts cap 'convenient' withdrawals — checks, debit card purchases, and electronic transfers — at around six per month, even though federal law no longer requires it. The old rule was the Federal Reserve's Regulation D, which capped these transfers from savings-type accounts at six per statement cycle. The Fed suspended that requirement in April 2020, but it left each bank free to keep its own cap, and many did.\n\nNot every transaction counts against the cap. ATM cash withdrawals and in-branch withdrawals are typically unlimited, because the rule was aimed at 'convenient' transfers. What usually counts: checks, debit purchases, online transfers to another account, and automatic bill payments. Cross your bank's cap and you'll pay an excess-withdrawal fee — often $5 to $15 per transaction — and a bank can convert a repeat offender's MMA into a checking account that earns little or no interest.\n\nPlan around the cap instead of fighting it. Route monthly bills through checking, and use the MMA for occasional large moves — funding an investment, covering an emergency, sending a down payment. If you find yourself bumping the limit every month, the money you're moving belongs in checking, not an MMA. Your bank's fee schedule lists its exact cap and excess fee; check it before you open the account." },
      { heading: "Treasury bills and Series I savings bonds: the other cash options", body: "Treasury bills and Series I savings bonds are two more places to park cash that pay competitive interest without bank credit risk, since both are backed directly by the U.S. government instead of FDIC insurance. You buy both directly from the Treasury at [TreasuryDirect.gov](https://www.treasurydirect.gov/), with no brokerage account required.\n\nA Treasury bill (T-bill) is a short-term government security sold in terms of 4, 8, 13, 17, 26, or 52 weeks. You buy it at a discount and receive the full face value at maturity, and the interest is exempt from state and local income tax, though it's still taxed federally — a real edge over a bank account if you live in a high-state-tax state. T-bill rates are set at auction and change with every offering, so check the current auction results on TreasuryDirect before you decide.\n\nA Series I savings bond pays a composite rate made of a fixed rate that never changes for the life of the bond, plus an inflation rate that resets every six months. You can buy up to $10,000 in electronic I bonds per calendar year, per Social Security number, through TreasuryDirect. The tradeoff is liquidity: you can't cash an I bond out at all in the first 12 months, and cashing one out before 5 years costs you the last 3 months of interest as a penalty.\n\nHere's how the choice might play out on $10,000 for a year. Say a competitive HYSA is paying 4.00% APY, a 6-month T-bill is auctioning near 4.10%, and an I bond's current composite rate is running close to 4.30% — in that illustrative scenario, the HYSA would earn roughly $400 over the year, the 6-month T-bill about $205 over its term (annualized, close to $410), and the I bond about $430, before counting any state tax savings from the T-bill's exemption. Rates change constantly, so treat these numbers as illustrative, not a quote — check the current APY, the latest T-bill auction results, and the I bond composite rate at TreasuryDirect.gov before you decide.\n\nFor most savers, an HYSA or MMA still wins on flexibility, since you can withdraw either one anytime without penalty. T-bills and I bonds are worth adding once you have cash you're confident you won't need for several months to a few years, especially if the state tax exemption or inflation protection matters for your situation." },
    ],
    tools: [
      { href: "/investing/high-yield-savings-calculator/", label: "High-yield savings" },
      { href: "/investing/savings-goal-calculator/", label: "Savings goal" },
    ],
    faqs: [
      { question: "What is a money market account?", answer: "A money market account (MMA) is an interest-bearing deposit account at a bank or credit union. The CFPB notes that MMAs usually pay higher interest than regular savings accounts and often allow limited check writing or debit card use. MMAs are FDIC insured up to $250,000 per depositor, per bank." },
      { question: "How much would $10,000 earn in a year in a money market account?", answer: "It depends on the account's current APY, which changes over time — but as an example, $10,000 in a money market account paying 4% APY would earn roughly $400 over a year. Compare that figure against a high-yield savings account, a 6-month Treasury bill, or a Series I savings bond, since all four can hold cash you don't need right away, each with its own liquidity and tax tradeoffs." },
      { question: "Is a money market account FDIC insured?", answer: "Yes, a money market account at an FDIC-insured bank is protected up to $250,000 per depositor, per bank, per ownership category. This coverage is separate from a money market mutual fund, which is an investment and is not FDIC insured. Credit union MMAs get the same coverage through the NCUA." },
      { question: "What's the difference between a money market account and a money market fund?", answer: "A money market account is a bank deposit that is FDIC insured. A money market mutual fund is an investment product sold by brokerages, and it is not FDIC insured. The CFPB notes the two products follow different regulations despite the similar name." },
      { question: "Money market account vs high-yield savings account: which is better?", answer: "Both are FDIC-insured bank deposits that pay competitive rates. An MMA often adds check writing and debit card access, useful for large balances you may need quickly. An HYSA, especially at an online bank, often pays a higher rate with lower minimums but no check access." },
      { question: "Money market account vs CD: which should I choose?", answer: "Choose a CD when you know the date you need the cash and want to lock in a rate. Choose a money market account when you need flexible access to the money at any time. MMA rates can change, while CD rates are fixed until maturity but come with an early-withdrawal penalty." },
      { question: "How much can I put in a money market account?", answer: "There is no legal cap on deposits into an MMA, but FDIC insurance covers only up to $250,000 per depositor, per bank, per ownership category. To insure more, you can spread deposits across multiple banks or use different ownership categories, like adding a joint account with a spouse." },
      { question: "How many withdrawals can I make from a money market account?", answer: "It depends on your bank. The Federal Reserve suspended Regulation D's six-per-month cap on convenient withdrawals in April 2020, but many banks kept a limit of around six checks, debit purchases, or electronic transfers per month. ATM and in-branch withdrawals usually don't count. Exceeding your bank's cap typically costs $5 to $15 per extra transaction." },
    ],
    sources: [
      { label: "CFPB — What is a money market account?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-money-market-account-en-915/" },
      { label: "FDIC — Deposit Insurance", url: "https://www.fdic.gov/resources/deposit-insurance/" },
      { label: "Federal Reserve — Regulation D interim final rule (April 2020)", url: "https://www.federalreserve.gov/newsevents/pressreleases/bcreg20200424a.htm" },
      { label: "TreasuryDirect — Treasury Bills", url: "https://www.treasurydirect.gov/marketable-securities/treasury-bills/" },
      { label: "TreasuryDirect — Series I Savings Bonds", url: "https://www.treasurydirect.gov/savings-bonds/i-bonds/" },
    ],
  },

  {
    slug: "money-market-account-debit-card",
    title: "Money Market Accounts With Debit Cards: How They Work",
    metaDescription:
      "Do money market accounts come with debit cards? How MMA debit access works, which banks offer it, transaction limits, and when checking fits better.",
    h1: "Money Market Accounts With Debit Cards: What to Know Before You Open One",
    cardBlurb: "Which money market accounts offer debit cards, how transaction limits work, and when checking is the better tool.",
    intro:
      "Some money market accounts come with a debit card, but not all of them do — and the ones that do usually cap how often you can use it. A money market account with a debit card gives you savings-level interest plus ATM and purchase access, which no regular savings account offers. This guide explains how MMA debit access works, how to find accounts that offer it, the transaction limits to expect, and when a checking account is still the right tool for spending.",
    sections: [
      { heading: "Do money market accounts come with debit cards?", body: "Some do, some don't — a debit card is a feature of the specific account, not of money market accounts as a category. The CFPB notes that MMAs may allow limited check writing and debit card access, which sets them apart from regular savings accounts. But each bank decides whether to issue a card at all.\n\nIn practice, you'll see three setups. Some banks issue a full debit card that works at ATMs and for purchases. Others issue an ATM-only card that withdraws cash but can't be swiped at a register. Many, especially online banks competing on rate, issue no card and route access through transfers and checks.\n\nBefore you open an account, confirm which setup you're getting. The account's fee schedule and disclosures will say 'debit card,' 'ATM card,' or neither. Don't assume — the difference decides whether the account can act as an emergency-spending backstop." },
      { heading: "How debit access on an MMA actually works", body: "An MMA debit card works like a checking debit card with a tighter leash. Cash withdrawals at ATMs usually don't count against transaction limits, while purchases and electronic transfers often do. That split comes from how banks classify 'convenient' transfers under their account rules.\n\nHere's why limits exist. Federal Regulation D historically capped 'convenient' withdrawals from savings-type accounts, including MMAs, at six per month. The Federal Reserve suspended that six-transfer requirement in April 2020, but it left banks free to keep their own caps — and many still do. Exceed the cap and you'll pay an excess-withdrawal fee, commonly a few dollars per transaction, or risk the bank converting your account to checking.\n\nSo treat an MMA debit card as an access valve, not a spending tool. It shines when you need cash from a large balance on short notice — a car repair from your emergency fund — without waiting on a transfer to checking." },
      { heading: "How to find a money market account with a debit card", body: "Filter for the feature first, then compare rates among the accounts that pass. Start from a shortlist of high-yield MMAs — our [best money market accounts](/roundup/best-money-market-accounts/) roundup notes which picks include debit or ATM access. Traditional banks and credit unions offer cards on MMAs more often than online-only banks, which tend to trade access features for higher APYs.\n\nCheck four things on any candidate account. First, whether the card is full debit or ATM-only. Second, the monthly transaction cap and the excess-withdrawal fee. Third, ATM network coverage and whether out-of-network fees get reimbursed. Fourth, the minimum balance required to earn the advertised APY and avoid monthly fees.\n\nVerify the account is a bank deposit before you fund it. A money market mutual fund at a brokerage is not FDIC insured, even though the name sounds nearly identical. Our [money market account guide](/guides/money-market-account/) explains how to tell the two apart." },
      { heading: "MMA with debit card vs checking account: which should hold your cash?", body: "Use each account for what it's built for: checking for unlimited spending, an MMA for earning interest on cash you rarely touch. A checking account has no withdrawal caps but typically pays little or no interest. An MMA pays savings-level APY but may cap or fee your transactions after a monthly limit.\n\nA practical split works well for most savers. Keep one to two months of expenses in checking for bills and daily spending. Park the rest — your emergency fund, a house down payment, money between investments — in the MMA, and let the debit card cover genuine emergencies only.\n\nRun the numbers on what the interest gap is worth. On a $30,000 emergency fund, the difference between a 0.1% checking rate and a competitive MMA rate is real money every year. Use our [high-yield savings calculator](/investing/high-yield-savings-calculator/) to put a dollar figure on your own balance, and our [savings goal calculator](/investing/savings-goal-calculator/) to plan the balance itself." },
    ],
    tools: [
      { href: "/investing/high-yield-savings-calculator/", label: "High-yield savings" },
      { href: "/investing/savings-goal-calculator/", label: "Savings goal" },
    ],
    faqs: [
      { question: "Do money market accounts come with debit cards?", answer: "Some do. A debit card is a bank-by-bank feature, not a standard part of money market accounts. Some banks issue full debit cards, some issue ATM-only cards, and many online banks issue no card at all. Check the account disclosures before opening if card access matters to you." },
      { question: "Can you get a debit card for an existing money market account?", answer: "Only if your bank offers one for that account type. Call or check your account's features page — some banks issue an ATM or debit card on request for MMAs. If yours doesn't, the alternatives are linking the MMA to your checking for fast transfers or moving to a bank whose MMA includes a card." },
      { question: "Is there a limit on debit card purchases from a money market account?", answer: "Usually yes. Many banks still cap 'convenient' withdrawals — debit purchases, checks, and electronic transfers — at around six per month, even though the Federal Reserve suspended the federal Regulation D requirement in April 2020. ATM cash withdrawals typically don't count. Exceeding the cap triggers an excess-withdrawal fee at most banks." },
      { question: "Do money market accounts offer checks or debit cards?", answer: "Many offer one or both, in limited form. Check writing and debit access are the two features that distinguish MMAs from regular savings accounts, per the CFPB. The exact mix varies: some accounts include both, some include only checks, and rate-focused online MMAs often include neither." },
      { question: "Can you pay bills directly from a money market account?", answer: "Often yes, through checks, the debit card, or electronic transfers — but each payment usually counts against your monthly transaction limit. Paying many bills from an MMA burns through a six-per-month cap fast. Route regular bills through checking and reserve the MMA for occasional large payments." },
      { question: "Is a money market account with a debit card FDIC insured?", answer: "Yes, if it's a money market deposit account at an FDIC-insured bank — coverage is $250,000 per depositor, per bank, per ownership category, and the debit card doesn't change that. A money market mutual fund at a brokerage is a different product and is not FDIC insured." },
    ],
    sources: [
      { label: "CFPB — What is a money market account?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-money-market-account-en-915/" },
      { label: "Federal Reserve — Regulation D Reserve Requirements (2020 interim final rule)", url: "https://www.federalreserve.gov/newsevents/pressreleases/bcreg20200424a.htm" },
      { label: "FDIC — Deposit Insurance", url: "https://www.fdic.gov/resources/deposit-insurance/" },
    ],
  },

  {
    slug: "back-taxes-guide",
    title: "Back Taxes Guide: What to Do When You Owe the IRS",
    metaDescription:
      "A step-by-step back taxes guide: what happens if you don't file, how to catch up, IRS relief programs, and when to hire a professional. Not tax advice.",
    h1: "Back Taxes Guide: What to Do When You Owe the IRS",
    cardBlurb: "Unfiled returns, IRS notices, and relief programs — a step-by-step guide for when you're behind.",
    intro:
      "This back taxes guide walks you through the practical playbook for handling IRS debt — from the moment you realize you have unfiled returns or an unpaid balance to picking the right relief program and knowing when to hire a professional. It covers what the IRS actually does when you don't pay (predictable and slower than most people expect), your five statutory relief options under the Internal Revenue Code, and the specific cost bands for tax attorneys, CPAs, and Enrolled Agents. It is general information, not tax advice.",
    sections: [
      {
        heading: "Step 1: File the missing returns first",
        body:
          "Every IRS relief program — Offer in Compromise, installment agreement, Currently Not Collectible, penalty abatement, Innocent Spouse Relief — requires that all your required returns be filed first. If you're behind on filing, that's step zero. There is no back-door workaround.\n\nThe IRS uses failure-to-file penalties (5% per month, capped at 25% of unpaid tax under IRC §6651(a)(1)) that stack on top of failure-to-pay penalties (0.5% per month, capped at 25% under §6651(a)(2)). Combined, that's a fast 47.5% add-on to your original balance. Filing — even late, even without paying — stops the failure-to-file clock immediately. You have unlimited time to file a late return, but the IRS may create a Substitute for Return (SFR) using worst-case assumptions if you delay too long, so filing your own return with legitimate deductions and credits is almost always better than accepting an SFR.",
      },
      {
        heading: "Step 2: Understand what the IRS will actually do",
        body:
          "The IRS collection escalation is predictable, and it moves slower than most people expect. First comes CP14 (initial notice of balance due), then CP501 and CP503 (reminders), then CP504 (Intent to Levy state tax refund only), and finally Letter 1058 or LT11 (Final Notice of Intent to Levy).\n\nOnce Letter 1058 arrives, the IRS has 30 days before it can garnish wages or levy bank accounts under IRC §6331. That 30-day window is your Collection Due Process right — filing Form 12153 (Request for a CDP Hearing) within the window stops the levy and gets you an Appeals conference. Missing the CDP deadline is the single most common way people go from 'behind on taxes' to 'wages being garnished at 25% or more.'\n\nAt the same time, the 10-year Collection Statute Expiration Date under IRC §6502(a)(1) is running in your favor. The IRS has 10 years from the date of assessment to collect. If the balance isn't paid before the CSED expires, the debt is written off — a real forgiveness path most articles don't mention. Pending Offers in Compromise, installment agreement requests, bankruptcy, CDP appeals, being outside the U.S. for 6+ months, and Innocent Spouse claims all toll (pause) the CSED. Plan the sequence carefully — a Partial Pay Installment Agreement over the last few years of the CSED can leave real dollars uncollected when the statute expires.",
      },
      {
        heading: "Step 3: Pick the right relief program",
        body:
          "The IRS offers five statutory relief options, and the right one depends on your specific numbers. The [tax resolution calculator](/tax-resolution/) applies the IRS's own math (Reasonable Collection Potential from Form 656-B) to your inputs and routes you to the specific program that fits.\n\nOffer in Compromise settles the debt for less than owed when your Reasonable Collection Potential — net asset equity plus 12 months of remaining monthly income for a lump-sum offer, or 24 months for periodic — is less than the balance. The IRS accepted 21.4% of offers in FY2025 (7,199 of 33,591 per the IRS Data Book). Use the [Offer in Compromise calculator](/tax-resolution/offer-in-compromise-calculator/) to see your specific floor.\n\nInstallment agreement spreads the balance over up to 72 months (streamlined online, for balances ≤ $50,000) or up to 120 months (non-streamlined, for larger balances). Setup is $22 online with direct debit; the failure-to-pay penalty drops from 0.5% to 0.25% per month once the agreement is approved. The [IRS payment plan calculator](/tax-resolution/irs-payment-plan-calculator/) compares all three plan tiers side by side.\n\nCurrently Not Collectible (Status 53) suspends active collection when your IRS Collection Financial Standards for housing, food, transportation, healthcare, and taxes meet or exceed your income. Interest and penalties keep accruing but no active collection happens — and the CSED clock keeps running.\n\nPenalty abatement wipes out failure-to-file, failure-to-pay, and failure-to-deposit penalties through First Time Abate (automatic if you've been penalty-free 3 prior years, all returns filed, and tax paid/arranged) or Reasonable Cause (case-by-case with documentation). The [penalty abatement calculator](/tax-resolution/penalty-abatement-calculator/) routes you to the right path.\n\nInnocent Spouse Relief under IRC §6015 removes liability entirely for a spouse who didn't know about (and didn't have reason to know about) the other spouse's understatement. Three flavors: §6015(b) (traditional innocent spouse), §6015(c) (separation of liability), §6015(f) (equitable relief). Form 8857 within 2 years of the first IRS collection notice for (b) and (c); more flexible timing for (f) per Rev. Proc. 2013-34.",
      },
      {
        heading: "Step 4: Address downstream impacts",
        body:
          "Back taxes affect more than just what you owe. Mortgage approval is blocked under Fannie Mae, Freddie Mac, and FHA underwriting guidelines until you're on a formal long-term installment agreement AND have made 3 on-time payments. A recorded Notice of Federal Tax Lien blocks approval entirely until it's released, discharged (Form 14135), or subordinated (Form 14134).\n\nYour passport can be denied or revoked under IRC §7345 if your total balance is $65,000 or more in 2026 (the $50,000 threshold indexed for inflation). Certification to the State Department is reversed within 30 days of entering an installment agreement, having an OIC accepted, or being placed in CNC status.\n\nYour credit score is unaffected — Equifax, Experian, and TransUnion removed tax liens from consumer credit reports in April 2018 — but the NFTL is still recorded at the county courthouse and shows up on lender title searches, professional-license background checks, and public-records databases. The [back taxes impact calculator](/tax-resolution/back-taxes-impact-calculator/) shows the specific impact profile for your situation.",
      },
      {
        heading: "Step 5: Know when to hire a professional",
        body:
          "For straightforward cases — a streamlined online installment agreement, a First Time Abate request, a Currently Not Collectible filing — you don't need a professional. The IRS's Online Payment Agreement application takes minutes, and the calculators at ModernWallet show the same numbers a paid EA would run.\n\nFor moderate cases — Offer in Compromise, Partial Pay Installment Agreement, penalty abatement with reasonable cause — an Enrolled Agent is usually the right hire. EAs are federally licensed by the IRS specifically for tax representation, have the same unlimited practice rights before the IRS as CPAs and attorneys, and typically charge $150–$300 per hour or $3,000–$7,500 for a complete OIC prep.\n\nFor complex cases — Innocent Spouse litigation, Tax Court petitions, criminal exposure, offshore reporting issues, appeals with significant dollars — hire a tax attorney ($300–$600+ per hour, $5,000–$15,000+ for OIC). The premium buys attorney-client privilege and court admission that CPAs and EAs don't have. Our [tax attorney vs CPA vs enrolled agent comparison](/compare/tax-attorney-vs-cpa-vs-enrolled-agent/) walks through the specific problem shapes each professional handles best.",
      },
    ],
    tools: [
      { href: "/tax-resolution/", label: "Tax resolution calculator" },
      { href: "/tax-resolution/offer-in-compromise-calculator/", label: "Offer in compromise calculator" },
      { href: "/tax-resolution/irs-payment-plan-calculator/", label: "IRS payment plan calculator" },
      { href: "/tax-resolution/penalty-abatement-calculator/", label: "Penalty abatement calculator" },
      { href: "/tax-resolution/back-taxes-impact-calculator/", label: "Back taxes impact calculator" },
    ],
    faqs: [
      {
        question: "What happens if I don't file back taxes?",
        answer:
          "The IRS charges failure-to-file penalties of 5% per month (capped at 25% of unpaid tax under IRC §6651(a)(1)) plus failure-to-pay penalties of 0.5% per month (also capped at 25% under §6651(a)(2)). Combined, that's a fast 47.5% add-on to your original balance, plus interest at the 2026 Q3 rate of 7% per year. The IRS can also create a Substitute for Return (SFR) using worst-case assumptions if you delay too long. Filing — even late, even without paying — stops the failure-to-file clock immediately.",
      },
      {
        question: "How far back can I file back taxes?",
        answer:
          "You can file a late return for any year — there is no statute of limitations on filing. But to claim a refund, you must file within 3 years of the original due date (or 2 years from when the tax was paid). To claim credits like the Earned Income Tax Credit, the 3-year rule also applies. For years beyond that, filing still stops the failure-to-file penalty accrual and helps you qualify for IRS relief programs, but you cannot collect a refund for those years.",
      },
      {
        question: "Can back taxes be forgiven?",
        answer:
          "Yes, in three specific ways under the Internal Revenue Code. An accepted Offer in Compromise settles the debt for less than the balance owed. A Partial Pay Installment Agreement pays less than the full amount over the remaining Collection Statute Expiration Date — whatever is unpaid when the 10-year statute expires disappears. And if Currently Not Collectible status suspends collection and your finances don't recover before the CSED expires, the debt expires with it. Blanket 'IRS forgiveness programs' pitched in ads are usually one of these three routes in disguise.",
      },
      {
        question: "Do I need a tax attorney or can I do it myself?",
        answer:
          "For straightforward cases you can DIY. Streamlined online installment agreements (balance ≤ $50,000), First Time Abate requests, and Currently Not Collectible filings are all designed for direct taxpayer use. Hire an Enrolled Agent ($150–$300/hour, $3,000–$7,500 for OIC) for moderate cases like Offers in Compromise. Hire a tax attorney ($300–$600+/hour) only when criminal exposure, Tax Court, complex Innocent Spouse, or offshore issues are involved — attorney-client privilege matters in those situations and CPAs/EAs get only the limited §7525 tax-practitioner privilege that doesn't apply in criminal proceedings.",
      },
      {
        question: "How long can the IRS collect on back taxes?",
        answer:
          "10 years from the date of assessment under IRC §6502(a)(1). That period — the Collection Statute Expiration Date (CSED) — pauses (tolls) during a pending Offer in Compromise, installment agreement request, bankruptcy, Collection Due Process appeal, or Innocent Spouse claim, and while you're outside the U.S. for 6+ months. If the CSED expires before the balance is paid, the debt is written off. Pending events toll the clock, so an unfavorable strategy sequence can extend collection well past 10 years.",
      },
      {
        question: "What does the IRS do first when I owe back taxes?",
        answer:
          "The IRS sends CP14 (initial balance-due notice), then CP501 and CP503 (reminders), then CP504 (Intent to Levy state tax refund only), and finally Letter 1058 or LT11 (Final Notice of Intent to Levy). Once Letter 1058 arrives and 30 days pass without a Collection Due Process appeal (Form 12153), the IRS can garnish wages under IRC §6331 or levy bank accounts. Filing Form 12153 within the 30-day window stops the levy and gets you an Appeals conference.",
      },
    ],
    sources: [
      { label: "IRS — Offer in Compromise", url: "https://www.irs.gov/payments/offer-in-compromise" },
      { label: "IRS — Payment plans (installment agreements)", url: "https://www.irs.gov/payments/payment-plans-installment-agreements" },
      { label: "IRS — Failure to File Penalty (§6651(a)(1))", url: "https://www.irs.gov/payments/failure-to-file-penalty" },
      { label: "IRS — First Time Abate", url: "https://www.irs.gov/payments/penalty-relief-due-to-first-time-abate-or-other-administrative-waiver" },
      { label: "IRS — Innocent Spouse Relief", url: "https://www.irs.gov/businesses/small-businesses-self-employed/innocent-spouse-relief" },
      { label: "IRS — Understanding a Federal Tax Lien", url: "https://www.irs.gov/businesses/small-businesses-self-employed/understanding-a-federal-tax-lien" },
      { label: "IRC §6502 — Collection Statute Expiration Date", url: "https://www.law.cornell.edu/uscode/text/26/6502" },
    ],
  },

  {
    slug: "first-time-estate-planning",
    title: "First Time Estate Planning: What You Actually Need",
    metaDescription:
      "A first-time estate planning guide: which documents you need, when to DIY vs hire an attorney, what it costs, and 2026 estate tax rules. Not legal advice.",
    h1: "First Time Estate Planning: Documents, Costs, and Order of Operations",
    cardBlurb: "The core 4 documents, DIY vs attorney costs by state, and the 2026 estate tax rules — step by step.",
    intro:
      "What actually counts as estate planning? It's the small set of legal documents and account setups that control what happens to your money, your property, and your medical care if you become incapacitated or die: a last will and testament, a durable power of attorney, an advance healthcare directive, your beneficiary designations on retirement and life insurance accounts, and — for some households — a revocable or irrevocable trust. Most people only need the first four; the trust becomes relevant only in specific situations (multi-state property, a special-needs dependent, or a desire for probate avoidance and privacy).\n\nThis first-time estate planning guide covers what you actually need at each net-worth tier, what it costs, and the order to tackle the documents. Below the federal $15M estate tax exemption and any state exemption, estate planning is about probate avoidance, guardianship for minors, and decision-making during incapacity — not about saving taxes. Above those thresholds, the analysis flips to tax planning, and attorney-drafted irrevocable trusts become essential.",
    sections: [
      {
        heading: "Step 1: The core four documents everyone needs",
        body:
          "Four documents cover the essentials for most households. First, a last will and testament — names an executor, distributes assets, and (critically for parents) nominates a guardian for minor children. Second, a durable power of attorney — appoints someone to handle finances during any incapacity BEFORE death, and can prevent the far more expensive court process described in our [power of attorney vs guardianship](/compare/power-of-attorney-vs-guardianship/) comparison. Third, an advance healthcare directive with HIPAA release — appoints a healthcare agent and states your wishes for end-of-life care. Fourth, a beneficiary designation review — the 401(k), IRA, and life insurance beneficiary forms override your will, so those matter more than most people realize.\n\nCost: attorney-drafted, $500 to $1,500 for the package in most states (California, New York, Massachusetts run 20-35% higher). Online, the same package runs $199 to $299 through Trust & Will, $129 to $229 through LegalZoom Basic, or $0 through FreeWill. See specifics with our [will cost calculator](/estate-planning/will-cost-calculator/).",
      },
      {
        heading: "Step 2: Decide whether you need a living trust",
        body:
          "A revocable living trust adds probate avoidance and privacy but doesn't reduce estate tax. You need one when at least one is true: you own real estate in more than one state (avoids ancillary probate), you have a special-needs dependent (paired with a Third-Party Special Needs Trust), you want your estate settled privately, or you're in California where probate on any estate over $184,500 gross is statutorily expensive.\n\nCost: attorney-drafted revocable trust $1,500 to $5,000 typical, $5,000 to $10,000+ in California and other HNW metros. Online, Trust & Will's trust plan is $499 individual / $599 couple; LegalZoom Living Trust ~$279; Nolo Quicken WillMaker Plus $139 (includes RLT template). Add $500 to $2,000 for trust funding — retitling deeds and accounts into the trust. Skip funding and the trust is decorative. Model with the [living trust cost calculator](/estate-planning/living-trust-cost-calculator/).",
      },
      {
        heading: "Step 3: Check your federal + state estate tax exposure",
        body:
          "The 2026 federal estate tax exemption is $15,000,000 per individual — permanent and indexed under the One Big Beautiful Bill Act (P.L. 119-21, July 2025), amending IRC §2010(c)(3). Married couples shield up to $30M via portability (Form 706 election). Rate is 40% flat on the excess.\n\nTwelve states plus DC also impose estate taxes with much lower thresholds: Oregon starts at $1M (lowest in country), Massachusetts $2M, Washington $3M (rate reset from 35% to 20% on 7/1/2026), Illinois $4M, Maryland $5M (also has inheritance tax), DC $4.99M, Vermont $5M, Hawaii $5.49M, Maine $7M, New York $7.35M (with unique 105% cliff), Minnesota $3M, Rhode Island $1.84M, and Connecticut $15M (tied to federal). Five states also impose inheritance tax that hits beneficiaries: Kentucky, Maryland, Nebraska, New Jersey, and Pennsylvania. Model with the [estate tax calculator](/estate-planning/estate-tax-calculator/).",
      },
      {
        heading: "Step 4: If you're above the exemption, add irrevocable trusts",
        body:
          "Only irrevocable trusts move assets out of your taxable estate. Common structures at this tier: an Irrevocable Life Insurance Trust (ILIT) holds a life insurance policy and receives the death benefit outside your estate (attorney cost $2,500 to $4,000); a dynasty trust holds assets for multiple generations and uses the $15M GST exemption to skip generation-skipping tax ($5,000 to $10,000+); a Medicaid Asset Protection Trust (MAPT) shields assets from long-term-care spend-down subject to the 5-year lookback under 42 U.S.C. §1396p ($3,000 to $6,000).\n\nIrrevocable trusts require attorney drafting — DIY tools can't produce them because the legal language must precisely disclaim retained rights that would otherwise trigger inclusion in your estate. Add annual Form 1041 tax return preparation ($500 to $2,000/year) because irrevocable trusts file their own tax returns.",
      },
      {
        heading: "Step 5: Address downstream issues before signing",
        body:
          "Before you sign anything, three checks. First, beneficiary designations on 401(k), IRA, and life insurance override your will — update those first, or your careful drafting gets bypassed. Second, if you're in a community property state (Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, Wisconsin), a joint trust preserves the double basis step-up on both spouses' halves at the first death under IRC §1014(b)(6) — separate trusts lose that benefit. Third, if you're planning to move to a no-estate-tax state (Florida, Texas, Nevada, Wyoming, Tennessee), do it before death to fully avoid your current state's estate tax — domicile at death controls.\n\nOnce those are addressed, the [estate planning calculator](/estate-planning/) shows the specific plan tier and document list your situation calls for. This guide is general information only, not legal advice — consult a licensed attorney in your state for anything beyond the DIY-appropriate simple case.",
      },
    ],
    tools: [
      { href: "/estate-planning/", label: "Estate planning calculator" },
      { href: "/estate-planning/will-cost-calculator/", label: "Will cost calculator" },
      { href: "/estate-planning/living-trust-cost-calculator/", label: "Living trust cost calculator" },
      { href: "/estate-planning/estate-tax-calculator/", label: "Estate tax calculator" },
      { href: "/estate-planning/prenup-cost-calculator/", label: "Prenup cost calculator" },
    ],
    faqs: [
      {
        question: "What documents do I need for first-time estate planning?",
        answer:
          "The core four are: a last will and testament (names executor, distributes assets, nominates guardian for minor children), a durable power of attorney (handles finances during incapacity before death), an advance healthcare directive with HIPAA release (appoints healthcare agent and states end-of-life wishes), and a beneficiary designation review for 401(k)/IRA/life insurance (those override your will). Attorney-drafted, the package runs $500 to $1,500; online, $199 to $299 through Trust & Will or $0 through FreeWill.",
      },
      {
        question: "How much does estate planning cost?",
        answer:
          "Attorney estate planning costs range from $300 for a simple will (single, no kids) up to $15,000+ for a full estate plan with irrevocable trusts (net worth above the $15M federal exemption). Middle-of-the-road: $750-$2,500 for a married-with-kids will package, $1,500-$5,000 for a revocable living trust, $2,500-$4,000 for an ILIT. Online services are much cheaper: FreeWill $0, Trust & Will $199-$599, LegalZoom $129-$299, Nolo $99-$209.",
      },
      {
        question: "At what age should I do estate planning?",
        answer:
          "Do it when at least one of these applies: you have a spouse or partner, you have minor children (guardian nomination is the single biggest reason to have a will), you own real estate, your net worth exceeds a few tens of thousands, or you have specific bequests you want to control. For most people, that's some point in their 20s or 30s — and definitely by the time you buy your first home or have a child. Waiting until later in life makes the same documents more expensive (family becomes more complex, assets more diverse) and risks dying intestate.",
      },
      {
        question: "Do I need a lawyer for estate planning?",
        answer:
          "Not for simple-to-moderate cases. Online services (Trust & Will, LegalZoom, FreeWill, Nolo) produce legally valid wills, powers of attorney, and healthcare directives in every state. Hire a lawyer when you have: blended family, business interests, testamentary trust for minor children with age-based distributions, contested beneficiaries, out-of-state property with unusual community-property/common-law interactions, estate near or above a state estate tax threshold, or you're in Louisiana (notarial testament requirement most online tools don't default to). Consider the hybrid attorney-review option (Trust & Will $299 add-on, Rocket Lawyer membership, LegalZoom Premium) for borderline cases.",
      },
      {
        question: "What is the 2026 federal estate tax exemption?",
        answer:
          "The 2026 federal estate tax exemption is $15,000,000 per individual, made permanent and indexed to inflation by the One Big Beautiful Bill Act (P.L. 119-21, signed July 2025), which amended IRC §2010(c)(3). The rate on the excess is a flat 40%. Married couples can shield up to $30 million by combining exemptions via portability (Form 706 election at the first spouse's death). The GST tax exemption mirrors at $15 million, and the annual gift tax exclusion for 2026 is $19,000 per donee.",
      },
      {
        question: "What states have their own estate tax?",
        answer:
          "Twelve states plus DC impose estate taxes in 2026, with exemptions far below the federal $15M: Oregon ($1M — lowest), Rhode Island ($1.84M, indexed), Massachusetts ($2M), Minnesota ($3M), Washington ($3M with rate reset 7/1/2026), Illinois ($4M), DC ($4.99M), Maryland ($5M — also has inheritance tax), Vermont ($5M), Hawaii ($5.49M), Maine ($7M), New York ($7.35M with 105% cliff), and Connecticut ($15M, tied to federal). Five additional states impose inheritance tax on beneficiaries: Kentucky, Maryland, Nebraska, New Jersey, and Pennsylvania. Use the [estate tax calculator](/estate-planning/estate-tax-calculator/) to see your exact exposure.",
      },
    ],
    sources: [
      { label: "IRS Rev. Proc. 2025-32 — 2026 inflation adjustments (OBBBA)", url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" },
      { label: "IRS — Estate Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax" },
      { label: "IRS — Form 706 Instructions (Portability)", url: "https://www.irs.gov/forms-pubs/about-form-706" },
      { label: "IRC §2010(c) — Applicable Credit Amount (OBBBA)", url: "https://www.law.cornell.edu/uscode/text/26/2010" },
      { label: "42 U.S.C. §1396p — Medicaid 5-year lookback", url: "https://www.law.cornell.edu/uscode/text/42/1396p" },
      { label: "American College of Trust and Estate Counsel (ACTEC)", url: "https://www.actec.org/" },
      { label: "Uniform Law Commission — Uniform Probate Code", url: "https://www.uniformlaws.org/" },
    ],
  },

  {
    slug: "probate-process-guide",
    title: "Probate Process Guide: What Happens After Someone Dies",
    metaDescription:
      "Probate process guide: what happens after death, executor duties, timeline by state, small-estate procedures, and how to avoid probate. Not legal advice.",
    h1: "Probate Process Guide: What to Do After Someone Dies",
    cardBlurb: "Executor duties, timeline, small-estate procedures, and how to avoid probate — step by step.",
    intro:
      "This probate process guide walks through what happens after a death: the initial 30-day tasks (funeral, notifying agencies, locating the will), opening probate (petition, letters testamentary), the executor's duties (inventory, notice, creditor claims, tax returns), distribution, and closing. It also covers when a small-estate procedure can bypass full probate and how a revocable living trust drafted during life would have avoided the whole process. Not legal advice — consult a licensed attorney in the decedent's state.",
    sections: [
      {
        heading: "Step 1: The first 30 days",
        body:
          "Immediately after death, three tasks come before probate. First, obtain 10-20 certified death certificates from the county vital records office ($15-$30 each) — you'll need them for banks, life insurance, retirement accounts, and title transfers. Second, locate the original will (safe deposit box, attorney's office, home file) — a photocopy is not enough in most states. Third, notify Social Security (which stops benefits and issues a small death benefit) and any pension administrators.\n\nIf there's a surviving spouse and modest joint assets, no probate may be needed at all — joint accounts, joint tenancy real estate, POD/TOD accounts, and beneficiary-designation assets (401(k), IRA, life insurance) all pass outside probate. Take inventory before assuming probate is required.",
      },
      {
        heading: "Step 2: Determine if probate is needed",
        body:
          "Full probate is only needed for assets in the decedent's sole name without a beneficiary designation or survivorship title. Every state has a small-estate procedure that bypasses full probate when the estate falls under a threshold: California $208,850 (§13100 affidavit, indexed 2025); Arizona $200,000 personal / $300,000 real (September 2025 update); Oregon $275,000 combined; Texas $75,000 excluding homestead; New York $50,000 personal property (SCPA Article 13 voluntary administration). Most other states run $25,000-$100,000. Below the threshold, the small-estate affidavit processes in weeks for under $1,000 — dramatically cheaper than full probate.\n\nThe [probate fee calculator](/probate/fee-calculator/) flags when your estate qualifies. Above the threshold, formal probate is generally required unless the decedent held everything in a revocable living trust.",
      },
      {
        heading: "Step 3: Open probate and get letters testamentary",
        body:
          "The executor named in the will (or, if no will, a court-appointed administrator) files a petition in the county probate court where the decedent was domiciled. The court holds a hearing, admits the will to probate, and issues letters testamentary — the executor's legal authority to act for the estate. This step takes 30-90 days in most states, longer in California and New York due to court backlogs.\n\nThe executor's authority begins with the letters, not with the death. Until the letters are issued, only limited actions (funeral, urgent bill payment from the executor's own funds) are proper. In statutory-fee states — California, Florida, Iowa, Missouri, Montana, New York (executor only), Wyoming, Arkansas, Oklahoma, New Jersey (executor only) — the executor's compensation is set by state statute. Elsewhere, it's 2-4% of gross estate as reasonable compensation.",
      },
      {
        heading: "Step 4: Inventory, notice, and creditor claims",
        body:
          "The executor's four core duties: inventory (list every asset and its date-of-death value; some states require formal appraisal for real estate), notice (mail to known heirs and creditors; publish in a newspaper of general circulation in the county), creditor claim period (2-12 months by state; California's is 4 months under Cal. Prob. Code §9100), and tax returns (final income tax on Form 1040, and Form 706 estate tax return if the estate exceeds the $15M federal exemption or applicable state threshold).\n\nCreditor claims are typically 3-8% of estate value: mortgages continue to accrue interest, credit cards, medical bills, and any unresolved obligations. Legitimate claims must be paid before distribution; disputed claims can be litigated. In California, missed publication of notice extends the timeline — the 4-month window doesn't start until notice actually runs.",
      },
      {
        heading: "How probate assets are valued (date-of-death valuation and stepped-up basis)",
        body:
          "Every asset in the estate is valued as of the date of death, not the date probate opens or closes. For bank and brokerage accounts, that value is usually read straight off the account statement for that date; for real property, closely-held business interests, and other assets without a public market price, the executor typically obtains an independent appraisal — sometimes from a court-appointed or state-certified appraiser — to document the date-of-death fair market value. This is the same valuation that feeds the inventory required in Step 4 above, and it's also the basis for any Form 706 estate tax return.\n\nThat same date-of-death value generally becomes the heir's stepped-up cost basis for capital-gains purposes — a rule the [IRS](https://www.irs.gov/faqs/interest-dividends-other-types-of-income/gifts-inheritances/gifts-inheritances) applies to most property acquired from a decedent: when the heir eventually sells the asset, gain or loss is measured against its value at death, not what the decedent originally paid for it. For an asset that gained significant value during the decedent's lifetime — an inherited home bought decades earlier at a much lower price, for example — that step-up can eliminate most of the capital-gains tax the decedent would otherwise have owed on the appreciation. Keep the appraisal and any Form 706 filing with the estate's records; they document the stepped-up basis if it's ever questioned later.",
      },
      {
        heading: "Step 5: Distribution and closing",
        body:
          "After creditor claims are resolved and taxes are paid, the executor distributes remaining assets according to the will (or state intestacy law if there's no will). The court reviews the final accounting, approves distributions, and discharges the executor.\n\nUncontested probate closes in 6-12 months in most states, 9-18 months with real estate, 12-24 months in California and New York, and 3-6 months in Texas independent administration. Contested probate — will contests, creditor litigation, fiduciary disputes — stretches to 2-5 years with costs escalating 5-10× the uncontested baseline.\n\nIs there a maximum time to complete probate? In most states, no single statutory deadline forces the whole case closed by a fixed date — probate ends when the required steps (creditor period, tax filings, final accounting, distribution) are actually finished, however long that takes. That doesn't mean there's no recourse against delay: if an executor sits on the case, an heir or beneficiary can generally file a petition to compel an accounting or distribution, and in serious cases petition the court to remove a stalling executor for failing to act. Separately, some states do impose hard deadlines on specific steps within probate rather than the case as a whole — the creditor-claim window (Step 4) is one example — and a handful of states set an outer limit for filing the final accounting or closing the estate. Those deadlines are state-specific, so confirm the exact rule for the decedent's state rather than assuming either a fixed maximum or no limit at all.",
      },
      {
        heading: "Step 6: If probate is dragging — accelerate what you can",
        body:
          "If you're stuck in a long probate, six levers can help. First, apply for a small-estate procedure if the estate qualifies (most states let you convert if you discover eligibility late). Second, publish creditor notice immediately if it hasn't run — the statutory window doesn't start until notice actually runs. Third, use independent administration where available (Texas Est. Code §401.001; several other states have similar provisions) to skip court oversight of routine acts. Fourth, request UPC informal probate in a UPC state (Utah, Colorado, Arizona, Minnesota, Idaho, others). Fifth, consider moving venue to a rural county if the decedent had residence flexibility. Sixth, hire a probate paralegal or attorney with local court expertise — knowing when to file specific motions can shave months. See the [probate timeline calculator](/probate/timeline-calculator/) for state-specific ranges.",
      },
      {
        heading: "Step 7: Avoid probate for your own estate",
        body:
          "The single most effective probate-avoidance tool is a revocable living trust set up during life. Assets in the trust bypass probate entirely at death — no attorney fee, no executor commission, no court proceeding, no publication. Cost: $1,500-$5,000 attorney or $499-$599 online (Trust & Will). Other probate-avoidance tools: transfer-on-death deeds for real estate (~30 states); pay-on-death designations for bank accounts; joint tenancy with rights of survivorship; beneficiary designations on 401(k), IRA, and life insurance (these override wills and trusts). A living trust is the most comprehensive because it covers assets these individual tools miss.\n\nFor any estate above the state's small-estate threshold, the trust math wins — see the [probate vs trust comparison](/compare/probate-vs-trust/) and the [living trust cost calculator](/estate-planning/living-trust-cost-calculator/). The savings for a $750,000 California estate are typically $28,000-$35,000 plus 12+ months of settlement time.",
      },
    ],
    tools: [
      { href: "/probate/", label: "Probate calculator" },
      { href: "/probate/fee-calculator/", label: "Probate fee calculator" },
      { href: "/probate/timeline-calculator/", label: "Probate timeline calculator" },
      { href: "/probate/cost-vs-trust-calculator/", label: "Probate vs trust calculator" },
      { href: "/estate-planning/", label: "Estate planning calculator" },
      { href: "/estate-planning/living-trust-cost-calculator/", label: "Living trust cost calculator" },
    ],
    faqs: [
      {
        question: "What is probate?",
        answer:
          "Probate is the court process that settles an estate at death: validating the will, appointing an executor, inventorying assets, paying creditors and taxes, and distributing what's left to beneficiaries. It typically takes 6-24 months and costs 3-8% of gross estate. Every state has a small-estate procedure that bypasses full probate when the estate falls below a threshold (California $208,850, Arizona $200,000, Oregon $275,000, most others $25k-$100k).",
      },
      {
        question: "How long does probate take?",
        answer:
          "Uncontested probate takes 6-12 months in most states, 9-18 months with real estate, 12-24 months in California and New York, and 3-6 months in Texas independent administration. Uniform Probate Code informal states (Utah, Colorado, Arizona, Minnesota, Idaho) run 4-8 months. Contested probate takes 2-5 years. Small-estate procedures process in weeks for qualifying estates. See the [probate timeline calculator](/probate/timeline-calculator/) for state-specific ranges.",
      },
      {
        question: "How much does probate cost?",
        answer:
          "3-8% of gross estate for uncontested probate in most states. In statutory-fee states (California Cal. Prob. Code §10810, Florida Fla. Stat. §733.6171, 7 others), the schedule is set by state law and both attorney and executor may each get the same percentage — total statutory fees can roughly double. The other ~41 states use a 'reasonable fee' model at 2-4% of gross estate for each of attorney and executor. Contested probate hits $50,000+ almost everywhere. See the [probate fee calculator](/probate/fee-calculator/) for the exact math in your state.",
      },
      {
        question: "How do I avoid probate?",
        answer:
          "The most comprehensive tool is a revocable living trust set up during life — assets titled to the trust bypass probate entirely at death. Cost: $1,500-$5,000 attorney or $499-$599 online. Other probate-avoidance tools: transfer-on-death deeds for real estate (~30 states); pay-on-death designations on bank accounts; joint tenancy with rights of survivorship; beneficiary designations on 401(k), IRA, and life insurance (these override wills and trusts). A living trust is the most comprehensive because it covers what individual tools miss.",
      },
      {
        question: "What are the executor's duties?",
        answer:
          "Four core duties. First, inventory — list every asset and its date-of-death value, with formal appraisal for real estate in most states. Second, notice — mail to known heirs and creditors, and publish in a newspaper of general circulation. Third, manage creditor claims through the state's statutory window (California 4 months under §9100, Texas 2 months, up to 12 months elsewhere) and pay legitimate claims. Fourth, file tax returns (final Form 1040 for the decedent's last year, and Form 706 estate tax return if estate exceeds the $15M federal exemption or applicable state threshold). After debts and taxes are paid, distribute per the will and file the final accounting with the court.",
      },
      {
        question: "What if there's no will?",
        answer:
          "The estate passes under state intestacy law rather than the decedent's wishes. Most states' intestacy statutes distribute to the surviving spouse and children first, then parents, then siblings, then more distant relatives — with specific percentages varying by state and whether there's a surviving spouse plus children. The court appoints an administrator (usually a close relative who petitions) instead of an executor. The process is the same as with a will — inventory, notice, creditor claims, tax returns, distribution — but the distribution follows state statute, not the decedent's intent. Unmarried partners and stepchildren typically inherit nothing under intestacy, which is why having any will at all matters more than most people realize.",
      },
    ],
    sources: [
      { label: "Cal. Prob. Code §10810 — attorney statutory schedule", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=10810&lawCode=PROB" },
      { label: "Cal. Prob. Code §9100 — creditor claim period", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=9100&lawCode=PROB" },
      { label: "Cal. Prob. Code §13100 — small-estate affidavit", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=13100&lawCode=PROB" },
      { label: "Fla. Stat. §733.6171 — attorney presumed reasonable", url: "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0733/Sections/0733.6171.html" },
      { label: "Tex. Est. Code §401.001 — independent administration", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.401.htm" },
      { label: "NY SCPA §2307 — executor commissions", url: "https://www.nysenate.gov/legislation/laws/SCP/2307" },
      { label: "Uniform Law Commission — Uniform Probate Code", url: "https://www.uniformlaws.org/" },
      { label: "American College of Trust and Estate Counsel (ACTEC)", url: "https://www.actec.org/" },
      { label: "IRS — Gifts & Inheritances (basis of inherited property)", url: "https://www.irs.gov/faqs/interest-dividends-other-types-of-income/gifts-inheritances/gifts-inheritances" },
    ],
  },

  {
    slug: "how-to-protect-assets-from-nursing-home",
    title: "How to Protect Assets From Nursing Home Costs",
    metaDescription:
      "Protect assets from nursing home costs: 5-year Medicaid lookback, MAPT, spend-down, home protection, and CSRA. Not legal advice — see an elder-law attorney.",
    h1: "How to Protect Assets From Nursing Home Costs",
    cardBlurb: "Medicaid Asset Protection Trusts, the 5-year lookback, home protection, and CSRA — the legal tools that actually work.",
    intro:
      "Nursing home care runs $115,000-$132,000/year in 2026 and inflates at ~4.5%/year. Without protection, a couple's life savings can be gone in 3-5 years — Medicaid takes over only after spend-down under 42 U.S.C. §1396p, and by then the well spouse has little left. This guide covers the actual tools that work: Medicaid Asset Protection Trusts funded 5+ years before application, transfers that avoid the lookback penalty, the Community Spouse Resource Allowance that protects half a couple's assets, home-equity limits and protection deeds, and the estate recovery rules that determine what's left for heirs. Not legal advice — every strategy here requires an elder-law attorney in your state, and timing is the difference between full protection and a wasted trust.",
    sections: [
      {
        heading: "Step 1: Understand the 5-year lookback (before you touch anything)",
        body:
          "Under 42 U.S.C. §1396p(c), Medicaid reviews every transfer in the 60 months before application. Any gift, below-market sale, or funding of an irrevocable trust triggers a penalty period during which Medicaid will not pay. Penalty period = transferred amount ÷ state monthly divisor: California $14,440/month, Texas $7,900, Florida $10,645, New York $16,229. Transfer $200,000 in California and the penalty is 13.8 months at $10,000+/month in nursing home costs — a $138,000 out-of-pocket bill you weren't planning for.\n\nException categories that don't trigger the penalty: transfers to a spouse; transfers to a disabled child (blind or disabled per Social Security definition); transfers to a caretaker child who lived in the home 2+ years providing care that delayed institutionalization; transfers to a sibling with equity interest who lived in the home 1+ year; and transfers into certain trusts for disabled beneficiaries under 65 (Special Needs Trusts under §1396p(d)(4)(A)). Everything else counts.\n\nBottom line: if you're within 5 years of needing care, you can't gift or transfer your way out. What you can do: spend down on care itself, buy exempt assets (home repairs, prepaid burial, one new car), use annuities that meet DRA requirements, or set up a Miller Trust in income-cap states. Full asset protection requires acting 5+ years before care is needed.",
      },
      {
        heading: "Step 2: Medicaid Asset Protection Trust (MAPT) — the primary tool",
        body:
          "A Medicaid Asset Protection Trust is an irrevocable trust set up 5+ years before Medicaid application that removes assets from countable resources while preserving them for family. Because the trust is irrevocable and the grantor gives up control, the assets are no longer 'available' under 42 U.S.C. §1396a — but the grantor can retain income rights and can name family members as trustees and beneficiaries.\n\nWhat goes in: home (transferred to the trust while retaining life estate or right to reside), non-retirement investments, second properties, high-value savings. What stays out: retirement accounts (transferring triggers full income tax immediately) and any assets you can't part with control of. Setup cost: $3,000-$7,000 for a properly drafted MAPT by an elder-law attorney. The 5-year clock starts on the transfer date, not application date. Transfer late 2026 and you're fully protected by late 2031.\n\nMAPTs are not appropriate for everyone. If care is imminent (under 5 years), the trust will trigger the lookback penalty and the transfer is worse than useless. If total assets are under about $200,000, spending down is often simpler than complex trust setup. Above that threshold and with 5+ years of planning runway, MAPTs are the standard tool.",
      },
      {
        heading: "Step 3: Protect the community spouse's share (CSRA + MMMNA)",
        body:
          "If you're married and only one spouse needs care, federal law under 42 U.S.C. §1924 protects the well spouse. The Community Spouse Resource Allowance (CSRA) protects half of countable assets, bounded by 2026 min $32,532 and max $162,660. If assets total $300,000, CSRA protects $150,000; if assets total $500,000, CSRA caps at $162,660. Illinois, Massachusetts, and New York use the maximum $162,660 as the floor — always the max, regardless of half-share math.\n\nThe Minimum Monthly Maintenance Needs Allowance (MMMNA) protects the well spouse's income. Federal minimum $2,643.75/month in 2026, max $4,066.50. If shelter costs (mortgage + utilities + property tax + insurance) exceed the shelter allowance, the well spouse can claim up to the max. Alaska $3,381.25 and Hawaii $3,111.25 have higher minimums.\n\nExecution: run the CSRA math with an elder-law attorney BEFORE spending anything. Couples routinely spend down $80,000-$120,000 they didn't have to — money that was fully protected by CSRA. See the [Medicaid spend-down calculator](/elder-care/medicaid-spend-down-calculator/) for state-specific figures.",
      },
      {
        heading: "Step 4: Protect the home (equity limit, transfer deeds, estate recovery)",
        body:
          "The primary residence is exempt during the applicant's life if a community spouse or dependent resides, or if the applicant intends to return home. But home equity is capped: 2026 federal minimum $752,000, maximum $1,130,000. Twelve states plus DC use the maximum (Alabama, California, Colorado, Connecticut, Hawaii, Maine, Massachusetts, New Jersey, New York, Tennessee, Washington). The other 38 use the minimum. Equity above the limit blocks Medicaid unless a HELOC reduces it or a spousal transfer moves it.\n\nAfter death, Medicaid Estate Recovery under 42 U.S.C. §1396p(b) can claim against the estate for benefits paid. Most states limit recovery to probate estate. Some (New York, Massachusetts) expand to non-probate assets like life insurance and jointly-held property. Strategies to reduce recovery: transfer to a MAPT 5+ years before application; enhanced life estate deed (ladybird deed) available in Florida, Michigan, Texas, Vermont, West Virginia — passes home to beneficiary at death without probate and without triggering lookback; transfer to a disabled child or caretaker child (both exempt from lookback); or transfer with retained life estate 5+ years before application (triggers lookback if within 60 months).",
      },
      {
        heading: "Step 5: Income-cap states need a Miller Trust",
        body:
          "In 20 income-cap states (Alabama, Alaska, Arizona, Colorado, Delaware, Florida, Georgia, Idaho, Indiana, Iowa, Louisiana, Mississippi, Nevada, New Mexico, Oklahoma, Oregon, South Carolina, South Dakota, Texas, Wyoming), monthly income above the 2026 cap of $2,982 (300% of SSI FBR $994) blocks institutional Medicaid. The fix under 42 U.S.C. §1396p(d)(4)(B): a Qualified Income Trust (Miller Trust) drafted before application. Each month, income above the cap flows into the trust; the trust pays the nursing home. Miller Trusts are simple ($500-$1,500 to draft) but must be in place BEFORE application, not after — Medicaid denies retroactively-fixed cases.\n\nMedically-needy states (the other ~30) don't need Miller Trusts. Instead, monthly income above the state's Medically Needy Income Level goes toward medical expenses (nursing home care counts) — a monthly spend-down that continues throughout care.",
      },
      {
        heading: "Step 6: Long-term care insurance as the parallel strategy",
        body:
          "LTC insurance is the alternative to Medicaid planning — pay premiums during working/pre-retirement years so care is funded without spend-down. 2026 median policy pays $150-$300/day, caps at 3-5 years or $150k-$300k lifetime, triggers on 2 of 6 ADLs (bathing, dressing, transferring, toileting, continence, eating) or cognitive impairment per HIPAA §7702B(c). Partnership LTC policies under Deficit Reduction Act §6021 add asset protection above the policy benefit paid — if the policy pays out $200,000 in benefits, an extra $200,000 in assets is protected from Medicaid spend-down if benefits eventually run out.\n\nLTC insurance premiums have risen sharply since 2018. A 60-year-old couple typically pays $6,000-$12,000/year for meaningful coverage. Hybrid life insurance with LTC rider (Nationwide CareMatters, Lincoln MoneyGuard) is cheaper and returns unused premium as a death benefit. See the [long-term care cost calculator](/elder-care/long-term-care-cost-calculator/) to size a policy against projected costs.",
      },
      {
        heading: "Step 7: Act now if care is 5+ years away — spend-down now if not",
        body:
          "Timing determines everything. If care is 5+ years away, MAPT + LTC insurance + strategic gifting can protect substantial assets. If care is within 5 years, the lookback penalty makes most protection strategies counterproductive — the tools become spend-down management, CSRA optimization for married couples, Miller Trust setup for income-cap states, and buying exempt assets (home repairs, prepaid burial, new car). Do not attempt DIY Medicaid planning — the rules are state-specific, the penalties for mistakes are large, and elder-law attorneys ($2,000-$8,000 flat fees for a complete plan) usually save many multiples of their cost.",
      },
    ],
    tools: [
      { href: "/elder-care/", label: "Elder care planning calculator" },
      { href: "/elder-care/medicaid-spend-down-calculator/", label: "Medicaid spend-down calculator" },
      { href: "/elder-care/long-term-care-cost-calculator/", label: "Long-term care cost calculator" },
      { href: "/elder-care/special-needs-trust-calculator/", label: "Special needs trust calculator" },
      { href: "/estate-planning/living-trust-cost-calculator/", label: "Living trust cost calculator" },
      { href: "/net-worth/net-worth-projection-calculator/", label: "Net worth projection calculator" },
    ],
    faqs: [
      {
        question: "How can I protect my assets from nursing home costs?",
        answer:
          "The primary tools are: a Medicaid Asset Protection Trust (MAPT) funded 5+ years before application; long-term care insurance or hybrid life+LTC rider policies; the Community Spouse Resource Allowance (CSRA) that automatically protects up to $162,660 for the well spouse; transfer deeds (ladybird deed in eligible states, life estate deed with 5+ year runway); and transfers to a disabled child or caretaker child (both exempt from the 5-year lookback). Timing is everything: within 5 years of care, most transfers trigger the lookback penalty under 42 U.S.C. §1396p(c).",
      },
      {
        question: "What is the 5-year Medicaid lookback?",
        answer:
          "Under 42 U.S.C. §1396p(c), Medicaid reviews all asset transfers in the 60 months before institutional Medicaid application. Any gift, below-market sale, or funding of an irrevocable trust triggers a penalty period = transferred amount ÷ state monthly divisor (California $14,440, Texas $7,900, Florida $10,645, New York $16,229). During the penalty period, Medicaid will not pay for nursing home care. Exceptions: transfers to a spouse, disabled child, caretaker child (2+ years), sibling with equity interest (1+ year), or a Special Needs Trust for a beneficiary under 65.",
      },
      {
        question: "What is a Medicaid Asset Protection Trust?",
        answer:
          "A Medicaid Asset Protection Trust (MAPT) is an irrevocable trust set up 5+ years before Medicaid application. Because the grantor gives up control, assets in the trust are not countable for Medicaid under 42 U.S.C. §1396a. The grantor can retain income rights and name family as trustees and beneficiaries. Setup: $3,000-$7,000 with an elder-law attorney. Best holdings: home (with life estate or right to reside), taxable investments, second properties. NOT retirement accounts — transferring triggers full income tax immediately. The 5-year clock starts on the transfer date.",
      },
      {
        question: "Can I give my house to my kids to avoid Medicaid recovery?",
        answer:
          "Only if you do it 5+ years before application. A gift of the home triggers the 60-month lookback under 42 U.S.C. §1396p(c). Alternatives that avoid the lookback trap: (1) transfer to a caretaker child who lived in the home 2+ years providing care — exempt from lookback; (2) transfer to a disabled child — exempt from lookback; (3) enhanced life estate deed (ladybird deed) available in Florida, Michigan, Texas, Vermont, West Virginia — passes home to beneficiary at death without probate and without triggering lookback; (4) transfer to a MAPT 5+ years before application.",
      },
      {
        question: "How much can my spouse keep if I go to a nursing home?",
        answer:
          "The Community Spouse Resource Allowance (CSRA) under 42 U.S.C. §1924(f)(2) protects half of the couple's countable assets, bounded by 2026 min $32,532 and max $162,660. Illinois, Massachusetts, and New York apply the max as the floor. The well spouse also keeps income up to the MMMNA — federal min $2,643.75/month in 2026, max $4,066.50. Alaska $3,381.25 and Hawaii $3,111.25 have higher minimums. The primary residence is fully exempt during the applicant's life if the community spouse resides. Run the CSRA math with an elder-law attorney BEFORE spending anything.",
      },
      {
        question: "Should I buy long-term care insurance or plan for Medicaid?",
        answer:
          "Depends on assets and age. If assets are under $200,000, Medicaid planning (MAPT + CSRA) is usually the fit — LTC insurance premiums would eat too much of the base. If assets are $500,000+, LTC insurance or hybrid life+LTC (Nationwide CareMatters, Lincoln MoneyGuard) can be cheaper than losing assets to spend-down. Partnership LTC policies under DRA §6021 add asset protection above the policy benefit paid — a common structure. See the [long-term care cost calculator](/elder-care/long-term-care-cost-calculator/) to size projected costs against assets and income.",
      },
    ],
    sources: [
      { label: "42 U.S.C. §1396p — Medicaid transfers, home equity, estate recovery", url: "https://www.ssa.gov/OP_Home/ssact/title19/1917.htm" },
      { label: "42 U.S.C. §1924 — CSRA + MMMNA (spousal impoverishment)", url: "https://www.ssa.gov/OP_Home/ssact/title19/1924.htm" },
      { label: "CMS 2026 Spousal Impoverishment Standards (CIB 12/9/2025)", url: "https://www.medicaid.gov/federal-policy-guidance/downloads/cib12092025.pdf" },
      { label: "IRS §7702B — Qualified long-term care insurance", url: "https://www.law.cornell.edu/uscode/text/26/7702B" },
      { label: "Deficit Reduction Act §6021 — Partnership LTC policies", url: "https://www.medicaid.gov/medicaid/long-term-services-supports/long-term-services-supports-partnerships-for-long-term-care/index.html" },
      { label: "National Academy of Elder Law Attorneys (NAELA)", url: "https://www.naela.org/" },
    ],
  },

  // ─── What Is a Trump Account? (pillar — mindmap pass 2026-07-04) ──────────
  {
    slug: "trump-accounts",
    title: "What Is a Trump Account? Rules & How to Open",
    metaDescription:
      "What is a Trump Account? A tax-advantaged account for kids with a $1,000 federal seed. See eligibility, contribution limits, taxes, and how to open one.",
    h1: "What Is a Trump Account? Rules, Eligibility & How to Open",
    cardBlurb:
      "A tax-advantaged investment account for children, with a $1,000 federal seed for kids born 2025–2028 and up to $5,000 a year in family contributions.",
    intro:
      "A Trump Account is a tax-advantaged investment account for a child, created by the 2025 Working Families Tax Cuts law, that holds S&P 500 index funds and can receive a one-time $1,000 federal seed for U.S.-citizen kids born between 2025 and 2028. The money grows tax-deferred until the child turns 18, when the account is treated like a traditional IRA. This guide covers who qualifies, how much you can add, how the taxes work, and exactly how to open one at [TrumpAccounts.gov](/trump-account/).\n\nUse our [Trump Account calculator](/trump-account/) to project the balance for your child. Then compare it against other options with our guides on [Trump Account vs 529](/compare/trump-account-vs-529/) plans and whether [Trump Accounts are worth it](/guides/trump-account-worth-it/).",
    sections: [
      { heading: "What a Trump Account is", body: "A Trump Account is a new kind of tax-advantaged investment account built for children. Congress created it in the 2025 tax law, the One Big Beautiful Bill, also called the Working Families Tax Cuts. In the tax code it lives under new section 530A.\n\nThink of it as a starter retirement account for a kid. Money goes in after tax, gets invested in a U.S. stock index fund, and grows without yearly tax bills. The account holds one investment type: a low-cost fund that tracks the S&P 500 or a similar U.S.-equity index.\n\nThe program went live on July 4, 2026. Before that date, no contributions could be made. The goal is simple. Give American children a long runway to build wealth through the stock market.\n\nWant the numbers behind that runway? Run your child's details through our [Trump Account calculator](/trump-account/)." },
      { heading: "Other names for the Trump Account", body: "The Trump Account goes by many informal names, but they all mean the same federal account. You may see it called a \"Trump savings account,\" a \"Trump baby account,\" a \"Trump child account,\" a \"Trump investment account,\" or even the \"Trump fund.\"\n\nNone of these are separate programs. They are all nicknames for the one account created under tax-code section 530A. Note that it is not a bank savings account and pays no fixed interest rate — the money is invested in a stock index fund.\n\nIf you searched using one of those names, these guides go deeper. See the [Trump savings account](/guides/trump-savings-account/) explainer, the account [for newborns](/guides/trump-account-for-newborns/), and [what it's invested in](/guides/what-are-trump-accounts-invested-in/). For the fine print, read the full [rules](/guides/trump-account-rules/), [who qualifies](/guides/trump-account-eligibility/), [how it's taxed](/guides/trump-account-taxes/), and [how to open one](/guides/how-to-open-a-trump-account/)." },
      { heading: "Who is eligible and the $1,000 seed", body: "Eligibility for the account and eligibility for the free $1,000 are two different things. Almost any child under 18 can have an account. Only a specific group gets the federal seed money.\n\n**Who gets the $1,000 seed:** The government adds a one-time $1,000 to the account of each U.S.-citizen child born between January 1, 2025, and December 31, 2028. The child needs a Social Security number. Any parent can open the account, regardless of the parent's own immigration status.\n\n**Who can open an account but gets no seed:** Children born before 2025, or after 2028, can still have a Trump Account opened and funded. They just do not receive the $1,000. The same is true for any eligible child under 18 outside the birth window.\n\nHere is a non-obvious point. The $1,000 seed does not count against your yearly contribution limit. It is a bonus on top of what your family can add. See the next section for how much you can contribute." },
      { heading: "Contribution limits and how the money is invested", body: "Families and friends can add up to $5,000 per year, combined, to a child's Trump Account. That cap is indexed to inflation starting after 2027, so it will rise over time. The $1,000 federal seed does not count toward this cap.\n\nEmployers can chip in too. An employer may contribute up to $2,500 a year for an employee's child. But that money counts inside the $5,000 limit, not on top of it. So if an employer adds $2,500, the family can add $2,500 more that year.\n\nRemember: no contributions were allowed before July 4, 2026.\n\n**How the money is invested:** Every Trump Account must hold a low-cost mutual fund or ETF that tracks the S&P 500 or a similar U.S.-equity index. There is no menu of risky picks. This keeps fees low and the strategy simple.\n\nWhat can that grow into? At a 7% average return, a single $1,000 seed left alone reaches about $3,513 by age 18. Add $200 a month and it grows to roughly $89,657. Max out $5,000 a year from birth and the account could hit about $182,980. Model your own plan with the [Investment calculator](/investing/)." },
      { heading: "How Trump Accounts are taxed", body: "This is where families most often get confused, so read closely. Contributions are made with after-tax money. They are not tax-deductible, unlike a traditional IRA contribution.\n\nWhile the money sits in the account, growth is tax-deferred. You pay no yearly tax on gains or dividends. That lets the balance compound faster.\n\nHere is the key insight most headlines miss. A Trump Account is not tax-free. When the child eventually withdraws, the account follows traditional-IRA rules. Withdrawals are taxed as ordinary income, and early-withdrawal penalties can apply.\n\nThat matters a lot. A Roth IRA grows tax-free. A 529 plan is tax-free when used for school. A Trump Account is only tax-deferred, so the tax bill comes later. This changes who benefits most from it. To weigh those trade-offs, read [Trump Account vs 529](/compare/trump-account-vs-529/) and [Trump Account vs a custodial account](/compare/trump-account-vs-custodial-account/)." },
      { heading: "How to open a Trump Account", body: "You open and manage a Trump Account through the official government channels. Do not use a random third-party site.\n\n**Step 1: Go to the official source.** Manage everything at [TrumpAccounts.gov](/trump-account/) or through the official Trump Accounts app. Families who already opted in while filing their taxes may have an account started for them.\n\n**Step 2: Have your documents ready.** You need the child's Social Security number, date of birth, and address. Opening takes only a few minutes.\n\n**Step 3: Pick a trustee.** The Bank of New York Mellon (BNY) is the Treasury's financial agent. Robinhood is the initial trustee. Fidelity, Schwab, Vanguard, and Bank of America are among the approved trustees you can choose.\n\n**Step 4: Fund the account.** Starting July 4, 2026, families who did not opt in at tax time can open and fund an account at TrumpAccounts.gov. Contributions are capped at $5,000 a year.\n\nOnce it is open, the $1,000 seed (if your child qualifies) is added by the government. Then your family contributions go to work in the index fund." },
      { heading: "The timeline to age 18 and what happens after", body: "A Trump Account is a long-game account. The rules are built around the child turning 18.\n\n**Before 18:** Withdrawals are generally blocked. The money stays invested and compounds. This lock-up is a feature, not a bug. It protects the runway that makes the account powerful.\n\nThe exact turning point is January 1 of the year the child turns 18. From that date, withdrawals become possible.\n\n**After 18:** The account is treated like a traditional IRA. That means withdrawals are taxed as ordinary income. Early-withdrawal rules apply if the now-adult takes money out before retirement age without a qualifying reason.\n\nSo the smart move for many families is to leave the money invested well past 18. The longer it compounds tax-deferred, the larger it grows. A balance that reaches five figures by 18 can multiply many times over by retirement. Test different holding periods in the [Investment calculator](/investing/)." },
      { heading: "Kids born before 2025 and other edge cases", body: "Plenty of parents ask the same question: my child was born before 2025, so are we shut out? No. You are not.\n\nAny eligible child under age 18 can have a Trump Account opened and funded. The birth date only decides one thing: whether the child gets the free $1,000 seed. Kids born before January 1, 2025, do not receive the seed, but they still get the tax-deferred account and the $5,000 yearly contribution room.\n\nThis is a real decision point. Without the $1,000 head start, is a Trump Account still the best home for your savings? For a child born before 2025, a Roth IRA (if they have earned income), a 529 for college, or a plain custodial account may fit better because of the tax difference. We break this down in [are Trump Accounts worth it](/guides/trump-account-worth-it/) and [Trump Account vs a custodial account](/compare/trump-account-vs-custodial-account/).\n\nThe bottom line: eligibility to open is broad, but the $1,000 bonus is narrow. Match the account to your child's situation, not just the headline. If your child missed the seed window, weigh the [best Trump Account alternatives](/guides/trump-account-alternatives/) before you decide." },
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" },
    ],
    faqs: [
      { question: "What is a Trump Account?", answer: "A Trump Account is a tax-advantaged investment account for a child, created by the 2025 Working Families Tax Cuts law under tax-code section 530A. It holds a low-cost S&P 500 index fund, grows tax-deferred, and can receive a one-time $1,000 federal seed for U.S.-citizen children born between 2025 and 2028. The money is generally locked until the child turns 18, after which the account follows traditional-IRA rules." },
      { question: "Is the Trump Account real?", answer: "Yes, the Trump Account is a real federal program, not a scam. Congress created it in the 2025 Working Families Tax Cuts law (the One Big Beautiful Bill) under tax-code section 530A, and the IRS administers it. Informal names like \"Trump baby account,\" \"Trump savings account,\" and \"Trump fund\" all refer to this same real account. The honest caveats are its tax and lock-up rules, not the program's legitimacy." },
      { question: "How do I open a Trump Account?", answer: "You open a Trump Account at the official [TrumpAccounts.gov](/trump-account/) site or the official Trump Accounts app, starting July 4, 2026. Have the child's Social Security number, date of birth, and address ready, then choose an approved trustee such as Robinhood, Fidelity, Schwab, Vanguard, or Bank of America. The Bank of New York Mellon (BNY) is the Treasury's financial agent. Families who opted in while filing taxes may already have an account started." },
      { question: "Who is eligible for a Trump Account?", answer: "Almost any U.S. child under age 18 with a Social Security number is eligible to have a Trump Account opened. Any parent can open one, regardless of the parent's immigration status. However, only U.S.-citizen children born between January 1, 2025, and December 31, 2028, receive the one-time $1,000 federal seed. Kids outside that birth window can still have an account, just without the seed." },
      { question: "Can kids born before 2025 get a Trump Account?", answer: "Yes, children born before 2025 can have a Trump Account opened and funded, but they do not receive the $1,000 federal seed. The seed is reserved for U.S.-citizen children born between January 1, 2025, and December 31, 2028. A child born earlier still gets the tax-deferred account and the same $5,000 yearly contribution room. Without the free seed, though, compare it against a Roth IRA, 529, or [custodial account](/compare/trump-account-vs-custodial-account/) first." },
      { question: "How much can you contribute to a Trump Account?", answer: "Families and friends can contribute up to $5,000 per year combined to a child's Trump Account, and that cap is indexed to inflation after 2027. An employer may add up to $2,500 a year, but that amount counts inside the $5,000 cap, not on top of it. The one-time $1,000 federal seed does not count toward the limit. Contributions could not be made before July 4, 2026." },
      { question: "Are Trump Accounts worth it?", answer: "Trump Accounts can be worth it, especially for a child who qualifies for the free $1,000 seed and a long time horizon. The key catch is taxes: withdrawals are taxed as ordinary income under traditional-IRA rules, not tax-free like a Roth IRA or a 529 used for school. That makes them a strong wealth-building tool but not always the best account for every goal. See our full breakdown of whether [Trump Accounts are worth it](/guides/trump-account-worth-it/)." },
      { question: "How is the money in a Trump Account invested?", answer: "The money in a Trump Account must be invested in a low-cost mutual fund or ETF that tracks the S&P 500 or a similar U.S.-equity index. There is no menu of individual stocks or risky picks, which keeps fees low and the strategy simple. At a 7% average return, a single $1,000 seed left alone could reach about $3,513 by age 18, while $200 a month could grow to roughly $89,657." },
      { question: "Can grandparents open or contribute to a Trump Account?", answer: "Grandparents, relatives, and friends can all contribute to a child's Trump Account, though a parent or legal guardian generally opens the account. Everyone's contributions count toward the same $5,000 annual cap, and money a grandparent adds is treated as a gift to the child. This makes a Trump Account an easy way for extended family to chip in on a child's future." },
      { question: "When can you open a Trump Account?", answer: "You can open and fund a Trump Account starting July 4, 2026, when the program went live. No contributions were allowed before that date. Families who opted in while filing their 2025 taxes may already have an account started, and everyone else can open one at TrumpAccounts.gov or through the official Trump Accounts app." },
      { question: "Do you report a Trump Account on your taxes?", answer: "You do not report Trump Account growth on your yearly taxes, because the account grows tax-deferred. Contributions are made with after-tax dollars and are not deductible, so they do not lower your tax bill. You make a one-time Trump Account election when you open the account, and withdrawals after the child turns 18 are taxed as ordinary income under traditional-IRA rules." },
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Treasury and IRS issue guidance on Trump Accounts (Notice 2025-68)", url: "https://www.irs.gov/newsroom/treasury-irs-issue-guidance-on-trump-accounts-established-under-the-working-families-tax-cuts-notice-announces-upcoming-regulations" },
      { label: "IRS — Notice 2025-68 (full text, PDF)", url: "https://www.irs.gov/pub/irs-drop/n-25-68.pdf" },
    ],
  },

  // ─── Are Trump Accounts Worth It? (decision — mindmap pass 2026-07-04) ────
  {
    slug: "trump-account-worth-it",
    title: "Are Trump Accounts Worth It? An Honest Look",
    metaDescription:
      "Are Trump Accounts worth it? An honest, balanced guide to the free $1,000 seed, the tax and lock-up catches, and whether to open one for your child.",
    h1: "Are Trump Accounts Worth It? Should You Open One for Your Child?",
    cardBlurb:
      "A balanced, no-hype verdict on Trump Accounts: the free $1,000 seed, the real catches, and who should skip them.",
    intro:
      "Trump Accounts are worth it for the free $1,000 federal seed almost every eligible child should claim, but adding money beyond that seed only makes sense for some families. This page gives you an honest, balanced answer. A Trump Account is a real federal program, not a scam. But it has real limits: money is locked until age 18, and withdrawals are taxed as ordinary income. Below we cover the genuine pros, the honest cons, and who should fund other accounts first.",
    sections: [
      { heading: "Are Trump Accounts a scam? No — it's a real federal program", body: "Trump Accounts are a legitimate federal program, not a scam. Congress created them in the 2025 tax law under Internal Revenue Code section 530A. The [IRS runs the program](/guides/trump-accounts/) and administers the accounts.\n\nHere is how it works. The government seeds $1,000 into an account for each U.S.-citizen child born from 2025 through 2028. Family members and employers can add money later. The funds must be invested in a U.S.-equity index fund, such as one tracking the S&P 500.\n\nSo why do people ask if it's a scam? The honest reason is the fine print, not fraud. Withdrawals get taxed as ordinary income, and the money stays locked until the child turns 18. Those are real trade-offs. But the program itself is genuine, and the $1,000 seed is guaranteed money." },
      { heading: "The genuine pros", body: "The biggest pro is simple: the $1,000 seed is free money. It costs you nothing to claim, and it belongs to your child. For most eligible families, that alone makes the account worth opening.\n\nThe other pros build on that seed:\n\n- **Tax-deferred compounding.** Your investment grows without yearly tax drag for up to 18 years. Over that long a window, compounding is powerful.\n- **Automatic long-term investing.** The money sits in a broad U.S.-equity index fund and stays invested. That removes the temptation to tinker.\n- **Anyone can chip in.** Parents, grandparents, and even an employer can add contributions.\n\nOur [Trump Account calculator](/trump-account/) shows the math. The $1,000 seed alone at a 7% return grows to about $3,513 by age 18. Add $200 a month and it reaches roughly $89,657. Max it out at $5,000 a year from birth and it can hit about $182,980." },
      { heading: "The honest cons and limits", body: "A balanced answer has to name the real drawbacks. Here they are, plainly:\n\n- **Withdrawals are taxed as ordinary income.** At 18, the account works like a traditional IRA. Your child pays regular income tax on every dollar taken out. A Roth IRA grows tax-free. A [529 plan](/compare/trump-account-vs-529/) is tax-free when used for school.\n- **The money is locked until 18.** You cannot tap it early for a house, a car, or an emergency. A [plain custodial account](/compare/trump-account-vs-custodial-account/) offers far more flexibility.\n- **Investment choice is restricted.** You must use a U.S.-equity index fund. No bonds, no international funds, no picking your own mix.\n- **The $5,000 yearly cap is modest.** Employers can add up to $2,500 within that cap. The seed does not count against it. Still, $5,000 limits how fast the account can grow.\n- **Contributions are after-tax and not deductible.** You get no tax break when you put money in.\n\nNone of this makes the account bad. But these limits matter when you decide whether to add money beyond the free seed." },
      { heading: "How it stacks up against 529s, Roth IRAs, and custodial accounts", body: "The Trump Account is not automatically the best account for every goal. Compare it to the main alternatives before you fund it heavily.\n\n**For college:** A 529 plan usually wins. It grows tax-free when used for qualified school costs. A Trump Account is taxed as ordinary income at withdrawal. See our full [Trump Account vs 529](/compare/trump-account-vs-529/) breakdown.\n\n**For maximum tax-free growth:** A custodial Roth IRA can beat it — but only if your child has earned income. Roth growth and qualified withdrawals are tax-free.\n\n**For flexibility:** A [custodial brokerage account](/compare/trump-account-vs-custodial-account/) has no lock-up and no investment limits. You can invest in anything and withdraw anytime.\n\n**Where the Trump Account shines:** It works best as a no-strings, long-term investing account for a child who may not go to college. The free seed and hands-off growth are its real edge. Run the numbers with our [investment calculator](/investing/) to compare paths. For the full tax picture, see [Trump Account taxes](/guides/trump-account-taxes/), and to tell it apart from a similar-sounding policy, read [Trump Account vs baby bonds](/compare/trump-account-vs-baby-bonds/)." },
      { heading: "Who should open one — and who should wait", body: "Here is a clear decision rule. Almost everyone eligible should claim the free $1,000 seed. It costs nothing and it is guaranteed money. There is rarely a reason to skip it.\n\nWhether to add your own contributions is the real question.\n\n**A Trump Account fits you if:**\n\n- You want a simple, long-term account your child controls as an adult.\n- Your child may not attend college, so a 529 is a weaker fit.\n- You have already funded higher-priority goals.\n\n**Fund other accounts first if:**\n\n- You are saving specifically for college — compare a [529](/compare/trump-account-vs-529/) first.\n- Your child has earned income — a custodial Roth IRA offers tax-free growth.\n- You may need the money before your child turns 18 — the lock-up is a dealbreaker.\n- You have high-interest debt or no emergency fund — pay those down first.\n\nAnd always cover the basics before any child account: your own emergency fund, your debt, and your retirement. If the Trump Account isn't the right fit, compare the [best Trump Account alternatives](/guides/trump-account-alternatives/)." },
      { heading: "The verdict", body: "So, are Trump Accounts worth it? For the free $1,000 seed, yes — nearly every eligible family should claim it. It is real money at no cost.\n\nBeyond the seed, the answer is \"it depends.\" The account offers tax-deferred growth and automatic long-term investing. But withdrawals are taxed as ordinary income, the money is locked until 18, and the investment menu is narrow.\n\nOur balanced take: open the account and take the seed. Then decide where extra dollars go based on your goal. For college, a 529 usually wins. For tax-free growth with a working teen, a custodial Roth IRA can win. For a flexible, no-strings account your child controls at 18, the Trump Account is a solid choice. Use the [Trump Account calculator](/trump-account/) to see how each path plays out for your family." },
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" },
    ],
    faqs: [
      { question: "Are Trump Accounts worth it?", answer: "Trump Accounts are worth it for the free $1,000 federal seed, which nearly every eligible child should claim at no cost. Whether you add your own money depends on your goal. For college, a 529 is often better. For a flexible, no-strings account your child controls at 18, a Trump Account is a strong option. It offers tax-deferred growth but taxes withdrawals as ordinary income." },
      { question: "Should I open a Trump Account for my child?", answer: "Yes, you should open a Trump Account to claim the free $1,000 seed if your child is an eligible U.S. citizen born from 2025 through 2028. That seed is guaranteed money at no cost. Adding contributions is a separate choice. Compare a 529 for college or a custodial Roth IRA for tax-free growth first. Also cover your emergency fund, debt, and retirement before funding any child account." },
      { question: "Are Trump Accounts a scam?", answer: "No, Trump Accounts are not a scam. They are a legitimate federal program created by the 2025 tax law under IRS code section 530A. The government seeds $1,000 for eligible children, and the IRS administers the accounts. The honest caveats are not fraud. They are that withdrawals get taxed as ordinary income and the money is locked until the child turns 18." },
      { question: "Is a Trump Account better than a 529?", answer: "For college savings, a 529 plan is usually better than a Trump Account. A 529 grows tax-free when used for qualified education costs. A Trump Account taxes withdrawals as ordinary income, even for school. The Trump Account can win for a child who may not attend college, because it is a flexible long-term account with a free $1,000 seed. See our full Trump Account vs 529 comparison to weigh both." },
      { question: "What's the catch with a Trump Account?", answer: "The main catches are taxes and access. Withdrawals are taxed as ordinary income, unlike a Roth IRA or a 529 used for school, which can be tax-free. The money is also locked until January 1 of the year your child turns 18, so you cannot use it earlier. On top of that, contributions must go into a U.S.-equity index fund, and the yearly cap is a modest $5,000." },
      { question: "How much can you contribute to a Trump Account?", answer: "You can contribute up to $5,000 per year to a Trump Account. Within that cap, an employer can add up to $2,500. The government's $1,000 seed does not count against the limit. Contributions are made with after-tax dollars and are not tax-deductible. All contributions must be invested in a U.S.-equity index fund, such as one that tracks the S&P 500." },
      { question: "Can a Trump Account be converted to a Roth IRA?", answer: "A Trump Account is not a Roth IRA, but once the child turns 18 it is treated like a traditional IRA, so the standard rules for converting a traditional IRA to a Roth would generally apply. A Roth conversion means paying ordinary income tax on the amount converted so it can then grow tax-free afterward. Because the IRS is still finalizing Trump Account rules, confirm the current conversion guidance before acting." },
      { question: "What are the disadvantages of a Trump Account?", answer: "The main disadvantages of a Trump Account are its tax and access rules, not the program itself. Withdrawals are taxed as ordinary income (not tax-free like a Roth IRA or a 529 used for school), the money is locked until January 1 of the year the child turns 18, contributions are not deductible, the yearly cap is a modest $5,000, and the money can only be invested in a U.S.-equity index fund. None of that makes it a scam — it is a real federal program — but these limits are why many families claim the free $1,000 seed and then fund other accounts for extra savings." },
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "Congressional Research Service — Trump Accounts (R48910)", url: "https://www.congress.gov/crs-product/R48910" },
      { label: "SEC Investor.gov — Compound Interest Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" },
    ],
  },


  // Trump Account alias + intent guides (autocomplete pass 2026-07-08) — 7 guides
  {
    slug: "trump-savings-account",
    title: "Trump Savings Account: How It Works & Who Qualifies",
    metaDescription: "The Trump savings account is the federal Trump Account. See how it works, the $1,000 seed, eligibility, contribution limits, taxes, and if it's worth it.",
    h1: "The Trump Savings Account: How It Works and Who Qualifies",
    cardBlurb: "\"Trump savings account\" is just a nickname for the federal Trump Account. Here's the $1,000 seed, the rules, the taxes, and whether it's worth opening.",
    intro: "The Trump savings account is not a bank account at all — it is the federal Trump Account under a friendlier name. Same product, same rules, same $1,000 seed for eligible newborns. People call it a \"savings account\" because it holds money for a child, but it pays no fixed interest rate. Instead it invests in a low-cost stock index fund and grows with the market. This guide explains what it is, who qualifies, how much you can add, how it is taxed, and whether it is worth opening. For the deeper explainer, see [what a Trump Account is](/guides/trump-accounts/), and run the numbers with our [Trump Account calculator](/trump-account/).",
    sections: [
      { heading: "Is the Trump savings account a real savings account?", body: "No — the \"Trump savings account\" is not a bank savings account and pays no fixed interest rate. It is a nickname for the federal Trump Account, a tax-deferred investment account for children created by the 2025 \"One Big Beautiful Bill.\"\n\nYou may also hear it called a \"Trump baby account\" or a \"Trump investment account.\" These are all informal names for the same thing. The law lives under Internal Revenue Code section 530A.\n\nUnlike a savings account, the money is invested in a stock index fund, not held at a fixed rate. That means it can grow faster over time — but its value can also rise and fall with the market." },
      { heading: "What is the Trump savings account?", body: "The Trump savings account is a long-term investment account that a parent opens for a child and funds with after-tax dollars. The program went live on July 4, 2026, and no contributions were allowed before that date.\n\nIts headline feature is a one-time $1,000 federal seed for qualifying newborns. The government deposits that money to start the account.\n\nThe balance is invested in a fund that tracks a U.S. stock index, and it grows tax-deferred until the child turns 18. Think of it as a starter retirement-style account rather than a place to park cash. Learn more in our pillar on [what a Trump Account is](/guides/trump-accounts/)." },
      { heading: "How does the Trump savings account work?", body: "The Trump savings account works by combining an optional federal seed, yearly family contributions, and index-fund growth that stays locked until the child turns 18. You open the account, add money over time, and the balance compounds.\n\nEligible children born January 1, 2025 through December 31, 2028 receive a one-time $1,000 seed. That seed does not count against the contribution cap.\n\nFamily, relatives, and friends can add up to $5,000 per year combined, a limit indexed to inflation after 2027. An employer may chip in up to $2,500 per year, but that amount counts inside the $5,000 cap, not on top of it.\n\nThe money must be held in a low-cost mutual fund or ETF that tracks the S&P 500 or a similar U.S.-equity index. You cannot pick individual stocks. See the full [Trump Account rules](/guides/trump-account-rules/) for the fine print." },
      { heading: "Trump savings account eligibility: who qualifies?", body: "Trump savings account eligibility centers on U.S.-citizen children who have a Social Security number. Any parent can open one, regardless of the parent's immigration status.\n\nChildren born January 1, 2025 through December 31, 2028 qualify for the $1,000 federal seed. This is the group the program was built to reward.\n\nChildren born before 2025, or after 2028, can still have an account opened and funded — but they get no seed. Any eligible child under 18 can hold an account; only the birth-date window controls the free $1,000.\n\nFor a full breakdown, read [who qualifies](/guides/trump-account-eligibility/) and our guide to the [Trump savings account for newborns](/guides/trump-account-for-newborns/)." },
      { heading: "How is the Trump savings account taxed?", body: "The Trump savings account is tax-deferred, not tax-free. You contribute after-tax dollars, and those contributions are not deductible.\n\nGrowth is not taxed while it stays in the account. That lets the balance compound faster year after year.\n\nOnce the child turns 18, the account is treated like a traditional IRA. Withdrawals are taxed as ordinary income, and early-withdrawal penalties can apply. The money is locked until January 1 of the year the child turns 18. Compare the tax treatment in our [Trump Account taxes](/guides/trump-account-taxes/) guide and [Trump Account vs 529](/compare/trump-account-vs-529/)." },
      { heading: "Is the Trump savings account worth it?", body: "For most families with a qualifying newborn, the Trump savings account is worth it — mainly because the $1,000 seed is free money you cannot get anywhere else. Even with no further deposits, that seed alone grows to about $3,513 by age 18 at a 7% return.\n\nAdding $200 a month lifts the projected balance to roughly $89,657. Contributing the full $5,000 a year from birth pushes it toward about $182,980.\n\nThe trade-off is access: the money is locked until the child turns 18 and is taxed as income on withdrawal. If you want flexible cash you can reach anytime, a plain [Trump Account vs a savings account](/compare/trump-account-vs-savings-account/) comparison shows why a bank account may fit better. For a full verdict, see [are Trump Accounts worth it](/guides/trump-account-worth-it/) and model your own numbers with the [Trump Account calculator](/trump-account/)." }
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      { question: "What is the Trump savings account?", answer: "The Trump savings account is a nickname for the federal Trump Account, a tax-deferred investment account for children created by the 2025 \"One Big Beautiful Bill.\" It is not a bank savings account and pays no fixed interest rate. The balance is invested in a U.S. stock index fund and grows until the child turns 18." },
      { question: "Is the Trump savings account a bank savings account?", answer: "No. Despite the name, it is not a bank savings account and earns no fixed interest rate. Money is invested in a low-cost mutual fund or ETF that tracks the S&P 500 or a similar U.S.-equity index. \"Trump savings account,\" \"Trump baby account,\" and \"Trump investment account\" all refer to the same federal Trump Account." },
      { question: "How does the Trump savings account work?", answer: "It works by combining an optional $1,000 federal seed, yearly contributions, and index-fund growth locked until age 18. Family, relatives, and friends can add up to $5,000 per year combined, indexed to inflation after 2027. The money must stay in a U.S. stock index fund, and it grows tax-deferred." },
      { question: "Who qualifies for the Trump savings account?", answer: "U.S.-citizen children with a Social Security number qualify, and any parent can open one regardless of immigration status. Children born January 1, 2025 through December 31, 2028 also receive the one-time $1,000 seed. Children born outside that window can hold a funded account but get no seed." },
      { question: "How is the Trump savings account taxed?", answer: "It is tax-deferred, not tax-free. Contributions are made with after-tax dollars and are not deductible, but growth is not taxed while it stays in the account. After the child turns 18 the account is treated like a traditional IRA, so withdrawals are taxed as ordinary income and early-withdrawal penalties can apply." },
      { question: "How much can you put in a Trump savings account?", answer: "Family, relatives, and friends can contribute up to $5,000 per year combined, a cap indexed to inflation after 2027. An employer may add up to $2,500 per year, but that counts inside the $5,000 cap, not on top of it. The $1,000 federal seed does not count against the cap." },
      { question: "Is the Trump savings account worth it for newborns?", answer: "For most families with a qualifying newborn, yes — the $1,000 seed is free money you cannot get elsewhere. At a 7% return, the seed alone grows to about $3,513 by age 18, and adding $200 a month reaches roughly $89,657. The main trade-off is that the money is locked until the child turns 18." },
      { question: "How do you open a Trump savings account?", answer: "Open one at TrumpAccounts.gov or the official Trump Accounts app using the child's Social Security number, date of birth, and address. Bank of New York Mellon (BNY) is Treasury's financial agent, Robinhood is the initial trustee, and Fidelity, Schwab, Vanguard, and Bank of America are among approved trustees. See our [how to open one](/guides/how-to-open-a-trump-account/) guide for steps." }
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Notice 2025-68 (full text, PDF)", url: "https://www.irs.gov/pub/irs-drop/n-25-68.pdf" },
      { label: "Congressional Research Service — Trump Accounts (R48910)", url: "https://www.congress.gov/crs-product/R48910" }
    ]
  },

  {
    slug: "trump-account-for-newborns",
    title: "Trump Account for Newborns: The $1,000 Baby Seed",
    metaDescription: "Yes, the Trump account for newborns is real: a $1,000 federal seed for U.S. babies born 2025–2028. See who qualifies and how to open one.",
    h1: "Trump Account for Newborns: The $1,000 Baby Seed",
    cardBlurb: "Babies born 2025–2028 get a free $1,000 federal seed. Here is how the Trump account for newborns works and how to open one.",
    intro: "The Trump account for newborns is real, and it comes with a free $1,000 federal seed for eligible babies. Congress created it in the 2025 \"One Big Beautiful Bill,\" the Working Families Tax Cuts law.\n\nThe headline benefit is a one-time $1,000 the government deposits for your child. You do not pay it back, and it is not a loan.\n\nThis page focuses on newborns and babies specifically. You will learn if it is real, who qualifies by birth year, whether it is automatic, and how to open one for your baby. For the bigger picture, see [what a Trump Account is](/guides/trump-accounts/).",
    sections: [
      { heading: "Is the Trump baby account real?", body: "Yes, the Trump baby account is real and written into federal law. It was created by the 2025 \"One Big Beautiful Bill\" (the Working Families Tax Cuts law) under IRC section 530A.\n\nThe program goes live on July 4, 2026. No money can go in before that date, so there is nothing to fund yet in 2025 or early 2026.\n\n\"Trump baby account\" and \"Trump newborn savings account\" are informal nicknames. The real product is the federal Trump Account, a tax-deferred investment account. It is not a bank savings account, and it does not sit at your local bank." },
      { heading: "The $1,000 newborn seed explained", body: "The newborn seed is a one-time $1,000 the federal government deposits into your baby's Trump Account. It is the single biggest reason to open one early.\n\nThe seed is free money that does not count against the yearly contribution cap. That cap is $5,000 per year combined, and an employer can add up to $2,500 inside it. The cap adjusts for inflation after 2027.\n\nThe money is invested in a low-cost S&P 500 or U.S.-equity index fund. It grows tax-deferred, so you owe no tax until your child withdraws it after age 18. Want to model the growth? Try the [Trump Account calculator](/trump-account/)." },
      { heading: "Which babies qualify: born 2025 through 2028", body: "Your baby qualifies for the $1,000 seed if they are a U.S. citizen born between January 1, 2025 and December 31, 2028. The child also needs a Social Security number.\n\nBabies born in 2025, 2026, 2027, and 2028 all qualify for the seed. A baby born in any of those four years hits the window, including a Trump account baby born 2025.\n\nA child born before 2025 does not get the seed. They can still have a Trump Account, but they miss the free $1,000. Any parent can open the account, no matter their own immigration status. See the full rules on [who qualifies](/guides/trump-account-eligibility/)." },
      { heading: "Is it automatic, or do you open it?", body: "The seed is not always automatic, so most parents should plan to open the account themselves. Do not assume the $1,000 will appear on its own.\n\nSome families who opted in while filing their taxes may already have an account started. If that is you, you may only need to confirm and fund it.\n\nEveryone else should open the account once the program is live. Your baby also needs a Social Security number first, which you usually apply for at birth. Without an SSN, the account cannot be created." },
      { heading: "How to open a Trump account for a baby", body: "You open a Trump account for a baby at TrumpAccounts.gov or through the official Trump Accounts app. Have your child's SSN, date of birth, and address ready.\n\nAccounts are held by approved trustees. BNY Mellon is the Treasury's financial agent, and Robinhood is the initial trustee. Fidelity, Schwab, Vanguard, and Bank of America are also among the approved providers.\n\nOpen the account after the July 4, 2026 launch, since no money moves before then. For a step-by-step walkthrough, read [how to open a Trump Account](/guides/how-to-open-a-trump-account/)." },
      { heading: "What the newborn seed can grow to by 18", body: "A newborn has the full 18-year runway, which makes the growth potential the best of any age. The account is locked until January 1 of the year your child turns 18.\n\nAt a 7% return, the $1,000 seed alone grows to about $3,513 by age 18. Add $200 a month and it reaches about $89,657. Contribute the $5,000 yearly max from birth and it can hit about $182,980.\n\nRemember the money is tax-deferred, not tax-free. Withdrawals after 18 are taxed as ordinary income, like a traditional IRA. To weigh it against college savings, compare [Trump Account vs 529](/compare/trump-account-vs-529/) and see [the rules](/guides/trump-account-rules/)." }
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      { question: "Is the Trump account for newborns real?", answer: "Yes. The Trump account for newborns is real federal law, created by the 2025 \"One Big Beautiful Bill\" under IRC section 530A. It gives eligible U.S. babies a one-time $1,000 seed. The program goes live July 4, 2026." },
      { question: "How much is the newborn seed?", answer: "The seed is a one-time $1,000 deposited by the federal government. It is free and does not count against the $5,000 yearly contribution cap. Your baby must be a U.S. citizen born 2025–2028 with a Social Security number." },
      { question: "Does a baby born in 2025 qualify?", answer: "Yes. A baby born in 2025 qualifies for the $1,000 seed, and so do babies born in 2026, 2027, and 2028. The child must be a U.S. citizen with an SSN. A baby born before 2025 can hold an account but gets no seed." },
      { question: "Is the Trump baby account automatic?", answer: "Not always. Some families who opted in while filing taxes may already have an account started. Most parents should plan to open one themselves at TrumpAccounts.gov once the program launches on July 4, 2026." },
      { question: "How do I open a Trump account for a baby?", answer: "Open it at TrumpAccounts.gov or the official Trump Accounts app. You need the child's SSN, date of birth, and address. Apply for your baby's SSN at birth first, since the account cannot be created without one." },
      { question: "Is the Trump newborn savings account a bank account?", answer: "No. \"Trump baby account\" and \"Trump newborn savings account\" are nicknames for the federal Trump Account. It is a tax-deferred investment account holding a low-cost U.S. stock index fund, not a bank savings account." },
      { question: "What can the $1,000 seed grow to by age 18?", answer: "At 7% growth, the $1,000 seed alone reaches about $3,513 by 18. Adding $200 a month gets about $89,657, and the $5,000 yearly max from birth reaches about $182,980. Withdrawals after 18 are taxed as ordinary income." },
      { question: "When can my child use the money?", answer: "The account is locked until January 1 of the year your child turns 18. It grows tax-deferred until then. To see if it fits your family, read [are Trump Accounts worth it](/guides/trump-account-worth-it/) and the [best investment account for kids](/guides/best-investment-account-for-kids/)." }
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Notice 2025-68 (full text, PDF)", url: "https://www.irs.gov/pub/irs-drop/n-25-68.pdf" },
      { label: "Social Security Administration — Social Security Numbers for Children", url: "https://www.ssa.gov/pubs/EN-05-10023.pdf" }
    ]
  },

  {
    slug: "how-to-open-a-trump-account",
    title: "How to Open a Trump Account: Step-by-Step Guide",
    metaDescription: "Learn how to open a Trump Account in minutes at TrumpAccounts.gov. Step-by-step: gather documents, pick a trustee, and fund your child's account safely.",
    h1: "How to Open a Trump Account: A Step-by-Step Guide",
    cardBlurb: "The step-by-step path to opening your child's Trump Account — the official site, documents, trustees, and funding.",
    intro: "Learning how to open a Trump Account takes only a few minutes online. You open one at TrumpAccounts.gov or the official Trump Accounts app, using your child's basic details. This guide walks you through each step, from gathering documents to picking a trustee to funding the account. First, it helps to understand [what a Trump Account is](/guides/trump-accounts/): a tax-deferred savings account for kids created by the 2025 One Big Beautiful Bill. If you want to model growth before you start, try our [Trump Account calculator](/trump-account/).",
    sections: [
      { heading: "Step 1: Go to the official Trump Account source", body: "Open a Trump Account only at TrumpAccounts.gov or the official Trump Accounts app. These are the government's channels, and they are the safe place to sign up. Opening takes only a few minutes once you have your child's details ready.\n\nThe program went live on July 4, 2026, so no accounts or contributions existed before then. If you opted in while filing your 2025 taxes, an account may already be started for you. In that case, log in through the official site to check and finish setup.\n\nBe careful, because scammers copy government pages to steal personal data. Never enter your child's Social Security number on a random third-party site. Type the official web address yourself instead of clicking links from ads, texts, or emails." },
      { heading: "Step 2: Gather the documents you need to sign up", body: "You need three things to open a Trump Account: the child's Social Security number, date of birth, and address. Have these ready before you start so the process moves quickly. With them on hand, signing up takes just a few minutes.\n\nAny parent can open an account, no matter their own immigration status. The child is the account owner, so their details are what the form asks for. Double-check the Social Security number, since a typo can delay your application.\n\nKeep this information private during and after setup. The official site is secure, but you should still avoid sharing these details anywhere else. To confirm your child qualifies, review [who qualifies](/guides/trump-account-eligibility/) before you apply." },
      { heading: "Step 3: Choose which bank or trustee holds the account", body: "You pick an approved trustee to hold and invest the Trump Account. The Treasury uses Bank of New York Mellon (BNY) as its financial agent behind the scenes. Robinhood is the initial trustee available at launch.\n\nMore providers are approved so families have choices. Fidelity, Schwab, Vanguard, and Bank of America are among the approved trustees you can select. Pick the one that fits how you already manage money, then continue setup.\n\nWhichever trustee you choose, the account still follows the same federal rules. The money goes into an S&P 500 index fund regardless of provider. Learn more about [the rules](/guides/trump-account-rules/) that apply no matter which trustee you use." },
      { heading: "Step 4: Fund the Trump Account after you open it", body: "You fund the account with family contributions once it is open. Starting July 4, 2026, families who did not opt in at tax time can open and fund at TrumpAccounts.gov. Contributions go straight into the S&P 500 index fund.\n\nThere is a yearly limit on how much you can add. The cap is $5,000 per year combined, and an employer can add up to $2,500 within that same cap. The $1,000 government seed does not count against this limit.\n\nYou do not have to max it out to start. Even small, steady contributions add up over years of market growth. Use our [Trump Account calculator](/trump-account/) or [investment calculator](/investing/) to see how funding choices grow over time." },
      { heading: "Who can open a Trump Account", body: "Almost any U.S. child under 18 with a Social Security number can have a Trump Account. Any parent can open one, regardless of their immigration status. This makes the account widely available to American families.\n\nOpening an account is separate from getting the $1,000 seed. The government seed is only for U.S.-citizen kids born between January 1, 2025 and December 31, 2028. Your child can still have an account and grow savings even without qualifying for the seed.\n\nSo two rules apply: one to open, and one to receive the seed. Understanding both prevents confusion at sign-up. If you have a baby, see our guide on Trump Accounts [for newborns](/guides/trump-account-for-newborns/)." },
      { heading: "What happens after you open a Trump Account", body: "After you open the account, the $1,000 seed is added by the government if your child qualifies. Your family contributions are invested in an S&P 500 / U.S.-equity index fund. This is the same fund for every account, chosen for broad market growth.\n\nThe account is built for the long term. Earnings grow tax-deferred, so you owe no yearly tax on the gains inside it. The money is locked until January 1 of the year the child turns 18.\n\nThat long runway is the point of the account. Years of contributions plus market growth can build a meaningful sum by adulthood. To weigh the trade-offs, read whether [Trump Accounts are worth it](/guides/trump-account-worth-it/) for your family." }
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      { question: "How do you open a Trump Account?", answer: "You open a Trump Account at TrumpAccounts.gov or the official Trump Accounts app. Enter the child's Social Security number, date of birth, and address, then choose an approved trustee. The whole process takes only a few minutes." },
      { question: "Where do I sign up for a Trump Account?", answer: "Sign up only at TrumpAccounts.gov or the official Trump Accounts app. These are the government's official channels. Avoid random third-party sites, since scammers copy government pages to steal personal data." },
      { question: "What documents do I need to apply for a Trump Account?", answer: "You need the child's Social Security number, date of birth, and address. Have these ready before you start so setup goes quickly. Any parent can apply, regardless of their immigration status." },
      { question: "Which bank should I use for a Trump Account?", answer: "You choose from approved trustees. Robinhood is the initial trustee, and Fidelity, Schwab, Vanguard, and Bank of America are among the approved options. Bank of New York Mellon serves as the Treasury's financial agent behind the scenes." },
      { question: "Can I open a Trump Account if my child was not born in the eligible years?", answer: "Yes. Almost any U.S. child under 18 with a Social Security number can have an account. Only the $1,000 government seed is limited to citizen children born January 1, 2025 through December 31, 2028." },
      { question: "When can I open and fund a Trump Account?", answer: "The program went live July 4, 2026. Starting that date, families who did not opt in at tax time can open and fund an account at TrumpAccounts.gov. Families who opted in while filing 2025 taxes may already have one started." },
      { question: "How much can I contribute after opening a Trump Account?", answer: "You can contribute up to $5,000 per year combined, with an employer able to add up to $2,500 within that cap. The $1,000 government seed does not count against the limit. Contributions go into an S&P 500 index fund." },
      { question: "Is my money locked after I open a Trump Account?", answer: "Yes. Funds grow tax-deferred and stay locked until January 1 of the year the child turns 18. The account is designed as a long-term investment in a U.S.-equity index fund." }
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Notice 2025-68 (full text, PDF)", url: "https://www.irs.gov/pub/irs-drop/n-25-68.pdf" }
    ]
  },

  {
    slug: "trump-account-eligibility",
    title: "Trump Account Eligibility: Who Qualifies?",
    metaDescription: "Trump Account eligibility explained: nearly any U.S. child under 18 with an SSN can open one, but only kids born 2025-2028 get the $1,000 seed.",
    h1: "Trump Account Eligibility: Who Qualifies?",
    cardBlurb: "Two eligibility rules, not one: who can open a Trump Account, and who gets the free $1,000 seed. Plus the checklist to know where your child stands.",
    intro: "Trump Account eligibility comes in two layers, and mixing them up is the single most common mistake parents make. One rule decides who can open an account. A separate rule decides who gets the free $1,000 federal seed.\n\nThese are not the same test. A child can qualify to open and fund an account while still missing out on the seed. This guide keeps the two apart so you know exactly where your child stands.\n\nWe cover citizenship, Social Security numbers, the birth-year window, older kids, adults, and the fact that there is no parental income limit. Start with [what a Trump Account is](/guides/trump-accounts/) if the basics are still fuzzy.",
    sections: [
      { heading: "Trump Account Eligibility: The Two Rules That Matter", body: "Trump Account eligibility splits into two separate questions. First, who can open an account. Second, who gets the one-time $1,000 seed.\n\nAlmost any U.S. child under 18 with a Social Security number can have an account opened. The seed is narrower. Only U.S.-citizen children born in a specific window receive it.\n\nHold these two rules apart as you read. A child can clear the first test, open an account, invest for years, and still not get the seed. That is normal, and it is not a rejection." },
      { heading: "Who Qualifies to Open an Account?", body: "Nearly any U.S. child under 18 with a valid Social Security number qualifies to open a Trump Account. The SSN is the key requirement. Without it, the account cannot be opened.\n\nAny parent can open one, regardless of the parent's immigration status. Your status does not block your child. The account belongs to the child, not to you.\n\nThere is no lottery and no waiting list. If your child is under 18 and has an SSN, you can move forward. See [how to open one](/guides/how-to-open-a-trump-account/) for the step-by-step." },
      { heading: "Trump Account Eligibility for the $1,000 Seed", body: "Only U.S.-citizen children born between January 1, 2025 and December 31, 2028 qualify for the one-time $1,000 federal seed. The child must also have a Social Security number. Miss the birth window, and the seed is gone even if everything else lines up.\n\nThe seed is a single federal deposit into the child's account. It does not count against the yearly contribution cap. It simply gives the account a head start.\n\nIf your child fits this window, they are a strong candidate. Parents of new babies should read [for newborns](/guides/trump-account-for-newborns/) to claim it correctly." },
      { heading: "Trump Account Eligibility for Older Kids and Adults", body: "Children born before 2025 can still open and fund a Trump Account. They simply get no seed. The birth-year window controls only the $1,000, not the account itself.\n\nThe same is true for kids born after 2028 or otherwise outside the window. They can invest the full amount each year. They just skip the free federal deposit. An older child is not shut out of the program.\n\nAdults do not qualify at all. A Trump Account is for children under 18, and it cannot be opened in an adult's name. Searches for a Trump Account for adults usually reflect confusion. The child gains control of the account at 18, so the money is locked until then. Check [the rules](/guides/trump-account-rules/) for the full lock-up terms." },
      { heading: "Is There a Trump Account Income Limit?", body: "There is no Trump Account income limit for parents, none to open and none to receive the $1,000 seed. High earners qualify. Low earners qualify. Your household income simply does not affect whether your child is eligible.\n\nThis surprises many families. Plenty of federal benefits phase out as income rises. This program does not work that way.\n\nThe only real caps are on contributions. You can add up to $5,000 per year combined, and an employer can put in up to $2,500 inside that same limit. Run the numbers with our [Trump Account calculator](/trump-account/), and weigh the trade-offs in [are Trump Accounts worth it](/guides/trump-account-worth-it/)." },
      { heading: "Your Trump Account Eligibility Checklist", body: "Use this quick checklist to confirm where your child stands. It separates the two eligibility rules so nothing gets mixed up.\n\nTo OPEN an account: the child is under 18, and the child has a valid Social Security number. Parent immigration status does not matter, and there is no income limit.\n\nTo GET the $1,000 SEED: the child is a U.S. citizen, has an SSN, and was born between January 1, 2025 and December 31, 2028. If your child meets the first set but not the second, you can still open and fund the account. You just will not receive the federal seed." }
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      { question: "What are the Trump Account eligibility rules?", answer: "Trump Account eligibility has two rules. Almost any U.S. child under 18 with a Social Security number can open an account. Only U.S.-citizen children born between January 1, 2025 and December 31, 2028 with an SSN get the one-time $1,000 federal seed." },
      { question: "Who qualifies for a Trump Account?", answer: "Nearly any U.S. child under 18 with a valid Social Security number qualifies to open a Trump Account. Any parent can open one, regardless of the parent's immigration status, because the account belongs to the child." },
      { question: "What is the Trump Account age limit?", answer: "The Trump Account age limit is 18. The account is opened for a child under 18, and the child gains control at 18. Funds stay locked until January 1 of the year the child turns 18." },
      { question: "Can my child get a Trump Account if born before 2025?", answer: "Yes. A child born before 2025 can still open and fund a Trump Account. They simply do not receive the $1,000 seed, which is reserved for U.S.-citizen kids born between January 1, 2025 and December 31, 2028." },
      { question: "Is there a Trump Account income limit?", answer: "No. There is no parental income limit to open a Trump Account or to receive the $1,000 seed. High and low earners qualify equally. The only caps are on contributions: $5,000 per year combined, with employers adding up to $2,500 inside that limit." },
      { question: "Can adults open a Trump Account?", answer: "No. A Trump Account is for children under 18, not adults, and it cannot be opened in an adult's name. Searches for a Trump Account for adults usually reflect confusion, because the child, not the parent, owns the account and controls it at 18." },
      { question: "Does my immigration status affect my child's eligibility?", answer: "No. Any parent can open a Trump Account for an eligible child regardless of the parent's immigration status. The account belongs to the child, so it is the child's age, citizenship, and Social Security number that determine eligibility." },
      { question: "When can the money in a Trump Account be used?", answer: "The money is locked until January 1 of the year the child turns 18. Contributions are invested in an S&P 500 or U.S.-equity index fund and grow tax-deferred until then, when the child gains control of the account." }
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Notice 2025-68 (full text, PDF)", url: "https://www.irs.gov/pub/irs-drop/n-25-68.pdf" },
      { label: "Congressional Research Service — Trump Accounts (R48910)", url: "https://www.congress.gov/crs-product/R48910" }
    ]
  },

  {
    slug: "trump-account-rules",
    title: "Trump Account Rules: Limits, Deposits & Access",
    metaDescription: "Trump account rules explained: the $5,000 annual cap, $1,000 seed, employer limits, S&P 500-only investing, and the lock-until-18 withdrawal rule.",
    h1: "Trump Account Rules: Limits, Deposits, and Access",
    cardBlurb: "The clean rulebook: contribution caps, seed money, who can pay in, investment limits, and when the money unlocks.",
    intro: "Trump account rules set one combined $5,000 annual contribution cap, an S&P 500-only investment limit, and a lock on the money until the child turns 18. The program was created by the 2025 One Big Beautiful Bill under IRC 530A. It goes live on July 4, 2026, and no contributions are allowed before then.\n\nThis page is the operating manual. It covers the deposit limits, the $1,000 federal seed, who can contribute, where the money is invested, and how withdrawals work. For the basics, start with [what a Trump Account is](/guides/trump-accounts/).",
    sections: [
      { heading: "Trump account rules at a glance", body: "Trump account rules boil down to a few hard limits you cannot exceed. Learn these first, and the rest falls into place.\n\n- Combined contributions are capped at $5,000 per year.\n- The federal $1,000 seed is separate and does not count against that cap.\n- Money must be invested in a low-cost S&P 500 index fund.\n- Funds are locked until January 1 of the year the child turns 18.\n- After 18, the account is treated like a traditional IRA.\n\nContributions are made with after-tax dollars and are not deductible. Growth inside the account is tax-deferred. To see how the numbers grow, use the [Trump Account calculator](/trump-account/)." },
      { heading: "Trump account contribution limits", body: "The Trump account contribution limit is $5,000 per year, combined across everyone who pays in. That single cap covers deposits from family, relatives, and friends together.\n\nThe $5,000 limit is indexed to inflation after 2027, so it should rise over time. Before then, it stays fixed at $5,000. No single person gets their own separate cap.\n\nEvery deposit counts toward the same annual total. If one grandparent adds $3,000, only $2,000 of room is left for the year. Deposits must wait until the program opens on July 4, 2026." },
      { heading: "The $1,000 seed money rules", body: "The government seeds eligible accounts with a one-time $1,000 deposit, and it does not count against the $5,000 cap. This seed is free federal money, not a contribution you make.\n\nTo qualify for the seed, the child must be a U.S. citizen with a Social Security number, born between January 1, 2025 and December 31, 2028. Kids born in that window get the $1,000 automatically.\n\nChildren born outside that window can still open a Trump account. They just do not receive the $1,000 seed. Check the full [eligibility rules](/guides/trump-account-eligibility/) to confirm who qualifies." },
      { heading: "Who can contribute, including employers", body: "Anyone can contribute to a child's Trump account, including family, relatives, and friends. All of their deposits share the same $5,000 annual cap.\n\nEmployers can contribute too, up to $2,500 per year. That employer money is counted inside the $5,000 cap, not on top of it.\n\nHere is what that means in practice:\n\n- An employer adds $2,500, leaving $2,500 of room for everyone else.\n- Family and friends fill the rest, up to the shared $5,000 total.\n- The $1,000 federal seed stays separate from all of it.\n\nSo the most an account can receive in one year is $5,000 in contributions, plus the one-time $1,000 seed if the child qualifies." },
      { heading: "The S&P 500 investment restriction", body: "Trump account money must be held in a low-cost mutual fund or ETF that tracks the S&P 500 or a similar U.S. equity index. This is a strict restriction with no exceptions.\n\nYou cannot pick individual stocks, bonds, or international funds. There are no self-directed choices and no active fund managers. The account holds one broad U.S. index fund.\n\nThis keeps costs low and the strategy simple. It also means returns follow the U.S. stock market. Learn more about [what a Trump Account is invested in](/guides/what-are-trump-accounts-invested-in/), or compare growth paths with the [Investment calculator](/investing/)." },
      { heading: "Trump account withdrawal rules and access", body: "Trump account withdrawal rules lock the money until January 1 of the year the child turns 18. No one can take funds out before then, including the parents.\n\nAfter 18, the account is treated like a traditional IRA. Withdrawals are taxed as ordinary income, and early-withdrawal penalties can apply depending on how the money is used.\n\nAt a 7% return, a $1,000 seed alone grows to about $3,513 by age 18. Add $200 a month and it reaches roughly $89,657. Fund the full $5,000 a year from birth and the balance nears $182,980. For the tax side, read [how it's taxed](/guides/trump-account-taxes/)." }
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      { question: "What are the main Trump account rules?", answer: "The main Trump account rules are a $5,000 combined annual contribution cap, an S&P 500-only investment requirement, and a lock on the money until the child turns 18. A one-time $1,000 federal seed is separate from the cap. Contributions are after-tax, and the program opens July 4, 2026." },
      { question: "How much can you contribute to a Trump account each year?", answer: "You can contribute up to $5,000 per year, combined across everyone who pays in. Family, relatives, and friends all share that single cap. The limit is indexed to inflation after 2027. The $1,000 federal seed does not count toward it." },
      { question: "Does the $1,000 seed count against the contribution cap?", answer: "No. The one-time $1,000 federal seed does not count against the $5,000 annual cap. It is separate free money for eligible children, who must be U.S. citizens with a Social Security number born between January 1, 2025 and December 31, 2028." },
      { question: "Can an employer contribute to a Trump account?", answer: "Yes, an employer can contribute up to $2,500 per year. That amount is counted inside the $5,000 annual cap, not added on top. If an employer adds $2,500, only $2,500 of contribution room remains for family and friends that year." },
      { question: "What can a Trump account be invested in?", answer: "A Trump account must be invested in a low-cost mutual fund or ETF that tracks the S&P 500 or a similar U.S. equity index. Individual stocks, bonds, international funds, and self-directed picks are not allowed. The account holds one broad U.S. index fund." },
      { question: "When can you withdraw money from a Trump account?", answer: "You can withdraw money starting January 1 of the year the child turns 18. Before that, the funds are locked for everyone, including parents. After 18, the account works like a traditional IRA, so withdrawals are taxed as ordinary income and may face early-withdrawal penalties." },
      { question: "Are Trump account contributions tax-deductible?", answer: "No. Trump account contributions are made with after-tax dollars and are not deductible. Growth inside the account is tax-deferred until withdrawal. To weigh the trade-offs, see whether [Trump Accounts are worth it](/guides/trump-account-worth-it/)." },
      { question: "When can you start contributing to a Trump account?", answer: "You can start contributing on July 4, 2026, when the program goes live. No contributions are allowed before that date. Eligible children born between January 1, 2025 and December 31, 2028 still receive the $1,000 seed once accounts open." }
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Notice 2025-68 (full text, PDF)", url: "https://www.irs.gov/pub/irs-drop/n-25-68.pdf" },
      { label: "Congressional Research Service — Trump Accounts (R48910)", url: "https://www.congress.gov/crs-product/R48910" }
    ]
  },

  {
    slug: "trump-account-taxes",
    title: "Trump Account Taxes: Deductible? How It's Taxed",
    metaDescription: "Trump account taxes explained: contributions are not deductible and growth is tax-deferred, not tax-free. See how withdrawals after 18 are taxed.",
    h1: "Trump Account Taxes: Is It Deductible and How Is It Taxed?",
    cardBlurb: "How a Trump Account is taxed: not deductible, not tax-free, just tax-deferred. See what you owe and when.",
    intro: "Trump account taxes confuse most parents, so start with the big correction. A Trump Account is tax-DEFERRED, not tax-free. Your contributions are not tax-deductible either.\n\nThat means you fund it with after-tax dollars, the money grows without a yearly tax bill, and taxes come due later. After the child turns 18, it works like a traditional IRA.\n\nThis guide breaks down every tax question in plain terms. For the basics first, see [what a Trump Account is](/guides/trump-accounts/) and [the rules](/guides/trump-account-rules/).",
    sections: [
      { heading: "Are Trump Account contributions tax-deductible?", body: "No, Trump Account contributions are not tax-deductible. You fund the account with after-tax dollars, so contributions never lower your taxable income.\n\nThis is a key difference from a traditional IRA. A traditional IRA contribution can often be deducted. A Trump Account contribution cannot.\n\nDo not expect a write-off for the money you put in. The annual cap is $5,000, and none of it reduces your tax bill. Employers can add up to $2,500, but that sits inside the same $5,000 limit." },
      { heading: "Is a Trump Account tax-free or just tax-deferred?", body: "A Trump Account is tax-deferred, not tax-free. The growth avoids yearly taxes, but the government still collects later.\n\nWhile the money stays invested, you owe no tax on gains or dividends each year. That lets the balance compound faster than a taxable account.\n\nThe trade-off is timing, not forgiveness. Tax-deferred means you delay the tax bill. Tax-free would mean you never pay it, and that is not how this account works." },
      { heading: "How is a Trump Account taxed after 18?", body: "After the child turns 18, a Trump Account is taxed like a traditional IRA. Withdrawals count as ordinary income in the year they are taken.\n\nThe account stays locked until January 1 of the year the child turns 18. Once unlocked, any money pulled out is added to taxable income at ordinary rates.\n\nEarly-withdrawal penalties can also apply, just as they do with a traditional IRA. So the size of the future tax bill depends on the child's income and when they withdraw. This is why planning the timing matters." },
      { heading: "Trump Account vs Roth IRA vs 529: tax treatment", body: "The three accounts are taxed in very different ways. Here is the quick contrast so you can see where the Trump Account fits.\n\n- Trump Account: contributions after-tax and not deductible, growth tax-deferred, withdrawals taxed as ordinary income later.\n- Roth IRA: contributions after-tax, growth tax-free, qualified withdrawals tax-free.\n- 529 plan: contributions after-tax, growth tax-free when used for qualified school costs.\n\nOnly the Trump Account defers the tax instead of erasing it. A Roth IRA and a 529 can be fully tax-free at withdrawal, while a Trump Account bill simply arrives later. Compare them directly in [Trump Account vs 529](/compare/trump-account-vs-529/) and [Trump Account vs Roth IRA](/compare/trump-account-vs-roth-ira/)." },
      { heading: "Is the $1,000 federal seed taxable to you?", body: "No, the $1,000 federal seed is not taxable income to you. You do not report it as income when the government adds it.\n\nThe seed is also not a contribution you deduct. It simply funds the account at the start.\n\nIt does not count against your $5,000 annual cap either. So the seed sits on top of what you and any employer can add each year." },
      { heading: "Trump Account on your tax return and filing notes", body: "You do not report a Trump Account's yearly growth on your own tax return. Because growth is tax-deferred, there is no annual gain to declare while the money stays invested.\n\nWhen you open the account, you make a one-time Trump Account \"election.\" That choice sets up how the account is treated.\n\nThe IRS is still finalizing detailed regulations under Notice 2025-68, so exact forms and reporting may change. Follow current IRS guidance and reporting instructions as they are released. For a full walkthrough of limits and timing, see [the rules](/guides/trump-account-rules/), and decide if the trade-offs fit your family in [are Trump Accounts worth it](/guides/trump-account-worth-it/). This is general information, not tax advice; talk to a tax professional about your situation." }
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      { question: "Is a Trump Account tax deductible?", answer: "No, a Trump Account is not tax deductible. You contribute after-tax dollars, so the money you put in does not lower your taxable income. This differs from a traditional IRA, where contributions can often be deducted." },
      { question: "How are Trump account taxes actually handled?", answer: "Trump account taxes work on a tax-deferred basis. There is no yearly tax on growth while the money stays invested. After the child turns 18, withdrawals are taxed as ordinary income, much like a traditional IRA." },
      { question: "Is a Trump Account tax free?", answer: "No, a Trump Account is not tax free. Its growth is tax-deferred, meaning you pay tax later instead of never. A Roth IRA or a 529 used for school can be tax free, but a Trump Account is not." },
      { question: "Do I report Trump Account growth on my tax return?", answer: "No, you do not report the account's yearly growth on your own tax return. Because the growth is tax-deferred, there is no annual gain to declare while the money stays invested." },
      { question: "Is the $1,000 seed taxable income to me?", answer: "No, the $1,000 federal seed is not taxable income to you. You do not report it as income, and it does not count against your $5,000 annual contribution cap." },
      { question: "How is a Trump Account taxed when the child withdraws?", answer: "Withdrawals are taxed as ordinary income after the child turns 18. The account is treated like a traditional IRA at that point, and early-withdrawal penalties can also apply depending on timing." },
      { question: "What tax form do I use for a Trump Account?", answer: "You make a one-time election when you open the account. The IRS is still finalizing detailed regulations under Notice 2025-68, so exact forms and reporting may evolve. Follow current IRS guidance and ask a tax pro about your situation." },
      { question: "What are the main tax benefits of a Trump Account?", answer: "The main tax benefit is tax-deferred growth, so gains and dividends are not taxed each year and can compound faster. The trade-off is that contributions are not deductible and withdrawals after 18 are taxed as ordinary income." }
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Notice 2025-68 (full text, PDF)", url: "https://www.irs.gov/pub/irs-drop/n-25-68.pdf" },
      { label: "IRS — Traditional IRA distribution rules", url: "https://www.irs.gov/retirement-plans/traditional-iras" }
    ]
  },

  {
    slug: "what-are-trump-accounts-invested-in",
    title: "What Are Trump Accounts Invested In?",
    metaDescription: "What are Trump Accounts invested in? One low-cost S&P 500 U.S. stock index fund only. See the rules, restrictions, and long-run growth context.",
    h1: "What Are Trump Accounts Invested In?",
    cardBlurb: "Every Trump Account holds one low-cost S&P 500 index fund. Here is why it is restricted and what that means for growth.",
    intro: "What are Trump Accounts invested in? Every Trump Account must hold one low-cost fund that tracks the S&P 500 or a similar broad U.S. stock index. You cannot pick individual stocks, bonds, or international funds. The money simply follows the U.S. stock market.\n\nThat single-fund design keeps fees low and the strategy simple. A \"Trump investment account\" is just another name for the same account. This guide explains what the money buys, why the choices are limited, and how that shapes long-run growth.",
    sections: [
      { heading: "What are Trump Accounts invested in?", body: "Every Trump Account is invested in one low-cost mutual fund or ETF that tracks the S&P 500 or a similar U.S.-equity index. That is the only allowed holding. There are no other investment choices to make.\n\nThe S&P 500 is a basket of about 500 large U.S. companies. Buying an index fund means you own a slice of all of them at once. Your balance rises and falls with the broad U.S. stock market.\n\nThis is a hands-off design. You do not build a portfolio or trade inside the account. One broad index fund does the work. Learn more about [what a Trump Account is](/guides/trump-accounts/) if you are new to the program." },
      { heading: "Trump account investment restrictions: what you cannot buy", body: "Trump account investment restrictions are strict: you can only hold one broad U.S. index fund. You cannot pick individual stocks like a single tech company. You cannot add bonds, international funds, or sector bets.\n\nThe account is not self-directed. That means no day trading, no crypto, and no custom mix. Your only real choice is which qualifying S&P 500-style fund the provider offers.\n\nThese limits are the same for every child. The law, IRC 530A, requires a low-cost fund tracking a U.S.-equity index. See [the rules](/guides/trump-account-rules/) for the full contribution and eligibility details." },
      { heading: "Why the trump account investment options are limited", body: "The trump account investment options are limited on purpose, to keep fees low and the strategy simple. Index funds charge tiny expense ratios. Low fees leave more money to grow over 18 years.\n\nSimplicity also protects families. There is no pressure to time the market or pick winners. Parents cannot make costly trading mistakes inside the account.\n\nBroad index investing is a widely respected approach. The SEC notes that index funds offer low costs and instant diversification. That fits an account meant to run untouched from birth until age 18." },
      { heading: "How does the trump investment account work?", body: "The trump investment account works by holding contributions in one U.S. stock index fund until the child turns 18. Money goes in after-tax, so contributions are not tax-deductible. Growth is tax-deferred while it sits in the account.\n\nContributions are capped at $5,000 per year combined. An employer can add up to $2,500 within that cap. A one-time $1,000 government seed for U.S.-citizen kids born 2025 through 2028 does not count against the cap.\n\nThe balance is locked until January 1 of the year the child turns 18. After that, it is taxed like a traditional IRA, at ordinary income rates on withdrawals. For a full breakdown, see [how it's taxed](/guides/trump-account-taxes/)." },
      { heading: "Trump account return on investment: what to expect", body: "Your trump account return on investment follows the U.S. stock market, so there is no guaranteed rate. Some years the fund rises. Other years it falls. Over long periods, U.S. stocks have historically averaged roughly 7% per year, but the past does not promise the future.\n\nWe use 7% only as an assumed illustration below, not a promise. Markets are volatile, and your real return could be higher or lower. Treat any single number as a rough estimate.\n\nHere is illustrative growth at an assumed 7% average return. A $1,000 seed left alone grows to about $3,513 by age 18. Add $200 a month and it reaches about $89,657. Contribute the full $5,000 a year from birth and it could reach about $182,980.\n\nRun your own numbers with the [Trump Account calculator](/trump-account/) or a general [investment calculator](/investing/) to test different amounts and returns." },
      { heading: "What the single-fund design means for growth", body: "The single-fund design means your growth depends on time in the market, not clever picks. Starting early gives compounding more years to work. Small, steady contributions add up over 18 years.\n\nBecause the account holds stocks, expect ups and downs along the way. A long time horizon helps ride out short-term drops. This is why the account stays locked until 18.\n\nIt is not the right fit for every family or goal. Compare it against alternatives before you commit. See [are Trump Accounts worth it](/guides/trump-account-worth-it/) and [Trump Account vs brokerage account](/compare/trump-account-vs-brokerage-account/) to weigh flexibility against simplicity." }
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      { question: "What are Trump Accounts invested in?", answer: "Trump Accounts are invested in one low-cost fund that tracks the S&P 500 or a similar broad U.S. stock index. That single fund is the only allowed holding. Your balance rises and falls with the U.S. stock market." },
      { question: "Can I pick individual stocks in a Trump Account?", answer: "No. You cannot pick individual stocks in a Trump Account. The account holds only one broad U.S. index fund. It is not self-directed, so there is no stock picking or trading." },
      { question: "What are the Trump account investment restrictions?", answer: "The main restriction is that the account may hold only a low-cost fund tracking a U.S.-equity index. No bonds, international funds, sector funds, crypto, or single stocks are allowed. Every account follows the same rule under IRC 530A." },
      { question: "What is the Trump account return on investment?", answer: "The return follows the U.S. stock market, so there is no guaranteed rate. U.S. stocks have historically averaged around 7% per year over long periods, but returns vary and markets fall in some years. Any projection is an estimate, not a promise." },
      { question: "Is a Trump investment account the same as a Trump Account?", answer: "Yes. \"Trump investment account\" is just another informal name for the Trump Account. Both refer to the same program created by the 2025 One Big Beautiful Bill. The investment inside is the same single index fund." },
      { question: "Why can't I choose my own investments?", answer: "The choices are limited to keep fees low and the strategy simple. One low-cost index fund offers broad diversification with minimal cost. It also removes the risk of costly trading mistakes over the account's long life." },
      { question: "How much could a Trump Account grow?", answer: "At an assumed 7% average annual return, a $1,000 seed alone could reach about $3,513 by age 18. Adding $200 a month could reach about $89,657. Contributing the $5,000 yearly cap from birth could reach about $182,980. These are illustrations, not guarantees." },
      { question: "When can the money be used?", answer: "The balance is locked until January 1 of the year the child turns 18. After that, withdrawals are taxed like a traditional IRA, at ordinary income rates. Contributions are made after-tax and grow tax-deferred until then." }
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Notice 2025-68 (full text, PDF)", url: "https://www.irs.gov/pub/irs-drop/n-25-68.pdf" },
      { label: "SEC Investor.gov — Index Funds", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1" }
    ]
  },

  // Trump Account alternatives roundup (comparison-content pass 2026-07-08)
  {
    slug: "trump-account-alternatives",
    title: "Trump Account Alternatives: 6 Options Ranked by Goal",
    metaDescription: "Compare the 6 best Trump Account alternatives - 529, custodial Roth IRA, UTMA, Coverdell, HYSA, I bonds - ranked by goal, including kids born before 2025.",
    h1: "Trump Account Alternatives: 6 Better Ways to Save for a Child",
    cardBlurb: "No seed money for a kid born before 2025? Compare the six best Trump Account alternatives and see which fits your goal.",
    intro: "The best Trump Account alternatives are a 529 plan, a custodial brokerage account, a custodial Roth IRA, a Coverdell ESA, a high-yield savings account, and I bonds. Each one fixes a limit the Trump Account can't.\n\nThe [Trump Account](/guides/trump-accounts/) only hands a $1,000 seed to U.S.-citizen kids born in 2025 through 2028. If your child was born before 2025, you get no seed at all — so the account's main draw disappears.\n\nThe Trump Account also locks the money until the year your child turns 18, taxes it as ordinary income, caps contributions at $5,000 a year, and holds only an S&P 500 index fund. Those limits are why families look elsewhere.\n\nThis guide ranks six alternatives by goal. Pick the one that matches what you want most: tax-free growth, flexibility, or safety. If you're still deciding, see whether a [Trump Account is worth it](/guides/trump-account-worth-it/) first.",
    sections: [
      { heading: "Why families look past the Trump Account", body: "Families seek Trump Account alternatives because the account is rigid and, for many kids, no longer free. The $1,000 seed only applies to children born in 2025 through 2028.\n\nIf your child was born before 2025, you can still open a Trump Account — but you get zero seed money. At that point it competes with every other account on its own merits, and it usually loses.\n\nThe other drawbacks apply to everyone. The money is tax-deferred, not tax-free, so withdrawals after age 18 are taxed as ordinary income like a traditional IRA. It stays locked until the year your child turns 18.\n\nContributions are capped at $5,000 a year, and you can only buy a U.S.-equity index fund. Check the [Trump Account eligibility rules](/guides/trump-account-eligibility/) if you're unsure whether your child qualifies for the seed.\n\nThe alternatives below beat the Trump Account on at least one of these fronts: taxes, flexibility, liquidity, or safety." },
      { heading: "1. 529 plan — best for college", body: "A 529 plan is the best Trump Account alternative if you're saving for education. Growth and withdrawals are completely tax-free when used for qualified education costs.\n\nThat tax-free treatment beats the Trump Account's ordinary-income tax. You contribute after-tax dollars, the money grows tax-free, and qualified withdrawals are never taxed.\n\n- Best for: parents focused on college or K–12 tuition.\n- Watch out for: non-education withdrawals face income tax plus a 10% penalty on earnings.\n\nLeftover money is no longer trapped. Under SECURE 2.0, you can roll up to $35,000 of unused 529 funds into the beneficiary's Roth IRA, subject to a 15-year account-age rule.\n\nSee the [full comparison of a Trump Account vs a 529](/compare/trump-account-vs-529/) and the list of [529 qualified expenses](/guides/529-qualified-expenses/) before you open one." },
      { heading: "2. Custodial brokerage account (UTMA/UGMA) — best for flexibility", body: "A custodial brokerage account is the best Trump Account alternative when you want no strings attached. You can invest in almost anything and spend it on almost anything for the child's benefit.\n\nUnlike the Trump Account's single index fund and age-18 lock, a UTMA or UGMA account has no contribution cap and no fixed use. The money can help before 18 — for a car, camp, or a first apartment.\n\n- Best for: parents who want full investment choice and early access.\n- Watch out for: the money is irrevocably the child's, and they take control at the age of majority.\n\nEarnings can trigger the kiddie tax, so large balances get taxed at parent rates. See the [Trump Account vs custodial account](/compare/trump-account-vs-custodial-account/) breakdown and our [UTMA custodial account explained](/guides/utma-custodial-account-explained/) guide." },
      { heading: "3. Custodial Roth IRA — best for a working teen", body: "A custodial Roth IRA is the best Trump Account alternative for a child who earns income. Growth and qualified withdrawals are 100% tax-free, which beats the Trump Account's ordinary-income tax.\n\nThe catch is the earned-income rule. Your child must have a job — babysitting, a summer role, or a first W-2 — to contribute at all.\n\nFor 2025, the contribution limit is the lesser of the child's earned income or $7,000. If your teen earns $3,000, that's the most you can put in.\n\n- Best for: teens with real earned income and decades to compound.\n- Watch out for: no earned income means no contribution allowed.\n\nA Roth started young is one of the strongest wealth tools there is. Compare it head-to-head in [Trump Account vs Roth IRA](/compare/trump-account-vs-roth-ira/) and read our [custodial Roth IRA for kids](/guides/custodial-roth-ira-for-kids/) guide." },
      { heading: "4. Coverdell ESA — a smaller education account", body: "A Coverdell education savings account (ESA) is a tax-free education option with tighter limits. Like a 529, qualified education withdrawals are tax-free.\n\nThe main limit is size. You can contribute only $2,000 per year, per child, across all Coverdell accounts.\n\nCoverdell ESAs also have income limits, so higher earners may not be able to contribute directly. It's a supplement, not usually a family's main account.\n\n- Best for: parents who want tax-free education savings with wider investment choice than a 529.\n- Watch out for: the $2,000 annual cap and income eligibility limits.\n\nMany families pair a small Coverdell with a 529. Confirm the current rules on the IRS Coverdell page before you open one." },
      { heading: "5. High-yield savings account (HYSA) — best for safety", body: "A high-yield savings account is the best Trump Account alternative when you can't risk losing money. Your balance never falls, and you can withdraw any time.\n\nThat liquidity is the opposite of the Trump Account's age-18 lock. If you might need the money before your child grows up, cash is the safer home.\n\n- Best for: short-term goals or money you may need before 18.\n- Watch out for: interest is taxed yearly, and returns usually trail the stock market over long periods.\n\nAn HYSA is ideal for an emergency cushion or a near-term expense, not for a 15-year growth goal. See [Trump Account vs a high-yield savings account](/compare/trump-account-vs-savings-account/) for the trade-offs." },
      { heading: "6. I bonds — best for very safe, inflation-protected saving", body: "I bonds are the best Trump Account alternative for rock-bottom risk with inflation protection. They're backed by the U.S. Treasury and adjust with inflation.\n\nYou buy them directly at TreasuryDirect.gov. The rate combines a fixed portion with an inflation portion that resets over time, so your buying power is protected.\n\n- Best for: parents who want near-zero risk and a hedge against rising prices.\n- Watch out for: annual purchase limits, a one-year holding minimum, and lower long-run growth than stocks.\n\nI bonds work well for the safe slice of a child's savings. For a stock-based option instead, compare the [Trump Account vs a brokerage account](/compare/trump-account-vs-brokerage-account/)." },
      { heading: "How to choose the right alternative", body: "Choose your Trump Account alternative by matching the account to your top goal. One plain rule sorts most families.\n\n- Saving for college? Start with a 529 plan.\n- Want full flexibility and any use? Open a custodial brokerage (UTMA/UGMA).\n- Have a teen with a job? Fund a custodial Roth IRA.\n- Need the money safe or soon? Use an HYSA or I bonds.\n\nYou can also stack them. Many families run a 529 for tuition, a custodial Roth once the teen works, and an HYSA for near-term needs.\n\nStill weighing the Trump Account itself? Compare every option in the [best investment account for kids](/guides/best-investment-account-for-kids/) hub, then run the numbers with our tools below." }
    ],
    tools: [
      { href: "/trump-account/", label: "Trump Account calculator" },
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      { question: "What are the best alternatives to a Trump Account?", answer: "The best Trump Account alternatives are a 529 plan for college, a custodial brokerage account for flexibility, and a custodial Roth IRA for a working teen. Coverdell ESAs, high-yield savings accounts, and I bonds round out the list. Each one fixes a limit the Trump Account has." },
      { question: "Is a 529 plan better than a Trump Account?", answer: "A 529 plan is better than a Trump Account if you're saving for education. A 529 grows tax-free and pays out tax-free for qualified school costs, while the Trump Account is taxed as ordinary income at withdrawal. The Trump Account only wins if your child qualifies for the $1,000 seed and you want a general-purpose account." },
      { question: "What can I use instead of a Trump Account if my child was born before 2025?", answer: "Use a 529 plan, a custodial brokerage account, or a custodial Roth IRA instead. Kids born before 2025 get no $1,000 Trump Account seed, so the account's main benefit is gone. These alternatives offer better taxes, flexibility, or liquidity." },
      { question: "Which alternative gives tax-free growth?", answer: "A 529 plan, a Coverdell ESA, and a custodial Roth IRA all offer tax-free growth. The 529 and Coverdell are tax-free for qualified education, while the Roth is tax-free for retirement and requires the child to have earned income. The Trump Account, by contrast, is only tax-deferred." },
      { question: "What's the most flexible Trump Account alternative?", answer: "A custodial brokerage account (UTMA/UGMA) is the most flexible alternative. It has no contribution cap, lets you invest in almost anything, and can be spent on almost anything for the child before age 18. The trade-off is that the money legally becomes the child's at the age of majority." },
      { question: "Can a teenager open a custodial Roth IRA instead?", answer: "Yes, a teenager with earned income can use a custodial Roth IRA. For 2025, you can contribute the lesser of their earned income or $7,000. Growth and qualified withdrawals are tax-free, making it a powerful long-term alternative for working kids." },
      { question: "Are I bonds a safe alternative for a child's savings?", answer: "Yes, I bonds are one of the safest alternatives. They're backed by the U.S. Treasury and adjust with inflation, so your buying power is protected. Watch for annual purchase limits and a one-year minimum holding period, and expect lower long-run growth than stocks." },
      { question: "Should I use more than one account?", answer: "Yes, many families combine accounts to match different goals. A common setup is a 529 for tuition, a custodial Roth IRA once a teen starts working, and a high-yield savings account for near-term needs. Stacking lets you capture tax-free growth, flexibility, and safety at once." }
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — 529 Plans: Questions and Answers", url: "https://www.irs.gov/newsroom/529-plans-questions-and-answers" },
      { label: "IRS — Coverdell Education Savings Accounts", url: "https://www.irs.gov/taxtopics/tc310" },
      { label: "TreasuryDirect — Series I Savings Bonds", url: "https://www.treasurydirect.gov/savings-bonds/i-bonds/" }
    ],
  },

  // Kids-accounts autocomplete pass (2026-07-04) — 7 guides
  {
    slug: "529-leftover-money-options",
    title: "What Happens to Leftover 529 Money",
    metaDescription: "Have 529 leftover money? You can change the beneficiary, roll up to $35,000 to a Roth IRA, use it for grad school, or withdraw it. Here are all 5 options.",
    h1: "What Happens to Leftover 529 Money: Your 5 Options",
    cardBlurb: "Five ways to use unused 529 funds without wasting them — including the new $35,000 Roth IRA rollover.",
    intro: "Leftover 529 money is rarely lost — you can change the beneficiary, roll up to $35,000 into a Roth IRA, spend it on more school, or take it out and pay tax plus a 10% penalty on the earnings only. A 529 plan does not expire, and the funds stay yours until you decide. The scariest-sounding path, a non-qualified withdrawal, penalizes only the growth, never your original contributions. And thanks to a 2024 rule, over-saving is far less risky than it once was. Here is how each option works, and how to pick.",
    sections: [
      {
        heading: "Option 1: Change the beneficiary",
        body: "The simplest fix for unused 529 funds is to change the beneficiary to another family member. The IRS lets you switch the beneficiary tax-free to a wide circle of relatives — a sibling, a future grandchild, a niece, a spouse, or even yourself.\n\nThis keeps the money growing tax-free for education. A common move: a parent rolls a first child's leftover balance to a younger sibling, or holds it for a grandchild years later.\n\nThere is no deadline to make the switch, so an unused account can simply wait. See our [529 qualified expenses guide](/guides/529-qualified-expenses/) for what the funds can then pay for."
      },
      {
        heading: "Option 2: Roll up to $35,000 into a Roth IRA",
        body: "Under the SECURE 2.0 Act, you can roll up to $35,000 of leftover 529 money into the beneficiary's Roth IRA. This is a lifetime cap, not a yearly one, and it started in 2024.\n\nThree rules matter. The 529 account must be at least 15 years old. Each year's rollover cannot exceed the annual Roth IRA contribution limit ($7,000 in 2025), so a full $35,000 takes several years. And the beneficiary must have earned income for that year.\n\nThis is the option that changes the math on saving. Because leftover funds can seed the child's retirement tax-free, over-saving in a 529 is far less risky than it used to be. Compare the two accounts in our [529 vs Roth IRA breakdown](/compare/529-vs-roth-ira/)."
      },
      {
        heading: "Option 3: Use it for more education",
        body: "A 529 covers far more than a four-year degree, so leftover money often still has a home. Qualified spending includes grad school, trade school, and registered apprenticeship program costs (fees, books, and required equipment).\n\nYou can also put up to $10,000 lifetime toward the beneficiary's student loans, plus another $10,000 for each of their siblings. This is a one-time-per-person lifetime cap.\n\nSo a child who finishes college with a balance left could later use it for a master's degree or a certification. This flexibility is a key edge over a [custodial UTMA account](/compare/529-vs-utma/), which has no education focus."
      },
      {
        heading: "Option 4: Take a non-qualified withdrawal",
        body: "If you just want the cash, you can take a non-qualified withdrawal — but only the earnings get taxed and penalized. Your original after-tax contributions always come out tax-free and penalty-free.\n\nOn the earnings portion, you owe ordinary income tax plus a 10% federal penalty. Each withdrawal is split pro-rata between contributions and growth, so you cannot pull out only your principal.\n\nExample: if an account is 60% contributions and 40% earnings, a $10,000 withdrawal treats $4,000 as taxable, penalized earnings. If most of the balance is still your own contributions, the real cost is small."
      },
      {
        heading: "Option 5: The scholarship exception",
        body: "If your child wins a scholarship, the 10% penalty is waived on a matching amount of leftover 529 money. This is a specific relief the IRS grants so a scholarship does not trap your savings.\n\nYou can withdraw up to the scholarship's value penalty-free. You still owe ordinary income tax on the earnings portion, but you skip the 10% hit.\n\nThe same waiver applies if the beneficiary attends a U.S. military academy or dies or becomes disabled. Keep the school's scholarship documentation with your tax records."
      },
      {
        heading: "How to choose the right option",
        body: "Rank the options by tax cost. Keeping the money inside a 529 — by changing the beneficiary, spending it on more school, or rolling it to a Roth IRA — preserves the tax break entirely. A non-qualified withdrawal is the only path that triggers tax and a penalty, and even then only on earnings.\n\nA simple decision rule: if anyone in the family will ever need education funds, keep the account and switch the beneficiary. If not, use the Roth rollover first, then withdraw the rest.\n\nDeciding how much to put in up front? Model it with our [529 savings calculator](/529-savings-calculator/), or step back to the [best investment account for kids](/guides/best-investment-account-for-kids/) to compare 529s with other options."
      }
    ],
    tools: [
      { href: "/529-savings-calculator/", label: "529 savings calculator" }
    ],
    faqs: [
      {
        question: "What happens to leftover 529 money if my child doesn't go to college?",
        answer: "Leftover 529 money is not lost if your child skips college — you can change the beneficiary to another relative, roll up to $35,000 into a Roth IRA, or withdraw it and pay income tax plus a 10% penalty on the earnings only. Your original contributions always come out tax-free."
      },
      {
        question: "Can I get my own contributions back from a 529 tax-free?",
        answer: "Yes. In a non-qualified withdrawal, your after-tax contributions always come out tax-free and penalty-free. Only the earnings portion of each withdrawal is taxed as ordinary income and hit with the 10% penalty, and every withdrawal is split pro-rata between the two."
      },
      {
        question: "How much of a 529 can I roll into a Roth IRA?",
        answer: "You can roll up to $35,000 of unused 529 funds into the beneficiary's Roth IRA over their lifetime. The 529 account must be at least 15 years old, each year's rollover is capped at the annual Roth limit ($7,000 in 2025), and the beneficiary needs earned income."
      },
      {
        question: "Does a 529 plan expire?",
        answer: "No. A 529 plan has no expiration date and no age limit for the beneficiary. Unused funds can stay invested and grow tax-free for years, which is why holding the account for a future grandchild or the beneficiary's grad school is often the best move."
      },
      {
        question: "What is the penalty for taking money out of a 529 for non-education?",
        answer: "A non-qualified 529 withdrawal owes ordinary income tax plus a 10% federal penalty on the earnings portion only, never on your contributions. The penalty is waived up to the amount of any scholarship the beneficiary receives."
      },
      {
        question: "Can I use leftover 529 money for student loans?",
        answer: "Yes. You can use up to $10,000 lifetime of 529 funds to repay the beneficiary's student loans, plus up to $10,000 for each of their siblings. This is a one-time-per-person lifetime cap, separate from the account's other uses."
      }
    ],
    sources: [
      { label: "IRS Topic No. 313, Qualified Tuition Programs (529 plans)", url: "https://www.irs.gov/taxtopics/tc313" },
      { label: "IRS Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras" }
    ],
  },

  {
    slug: "529-qualified-expenses",
    title: "529 Qualified Expenses: What a 529 Can Pay For",
    metaDescription: "529 qualified expenses: tuition, fees, books, room & board, computers, K-12 tuition up to $20,000/yr, apprenticeships, and up to $10,000 in student loans.",
    h1: "529 Qualified Expenses: What a 529 Plan Can Pay For Tax-Free",
    cardBlurb: "A plain-English list of what a 529 can and cannot cover tax-free — plus the room & board rule most families miss.",
    intro: "529 qualified expenses are the education costs you can pay from a 529 plan with no federal tax on the earnings. These include college tuition, fees, books, required supplies, room & board (if the student is enrolled at least half-time), and computers or internet used for school. A 529 can also cover K-12 tuition up to $20,000 per year in 2026, registered apprenticeship costs, and up to $10,000 lifetime toward student loans. Spend on anything else and the earnings portion gets hit with income tax plus a 10% penalty. This guide shows exactly what counts, what does not, and the one room & board rule most families miss.",
    sections: [
      {
        heading: "The core list: what a 529 pays for tax-free",
        body: "A 529 plan covers most real costs of higher education. Qualified expenses include tuition and mandatory fees, books, and supplies or equipment required for your courses. If the student is enrolled at least half-time, room & board also qualifies. So do computers, printers, software, and internet access used primarily by the student while enrolled.\n\nThe school must be an eligible institution — one that can take federal student aid. That covers nearly all accredited U.S. colleges, universities, and many vocational schools. Withdrawals for these costs are free from federal income tax, and usually state tax too.\n\nDeciding how much to save toward these costs? Run the numbers with our [529 savings calculator](/529-savings-calculator/), and see how a 529 stacks up against other options in our [best investment account for kids](/guides/best-investment-account-for-kids/) guide."
      },
      {
        heading: "K-12 tuition: up to $20,000 per year in 2026",
        body: "A 529 can pay for private or religious K-12 school tuition, up to $20,000 per beneficiary per year as of 2026. This is a big jump from the old $10,000 cap. The limit is per student, not per account, so it applies across all 529 plans for that child.\n\nOne catch: at the K-12 level, only tuition clearly qualifies for federal purposes. Room & board, books, and supplies for K-12 are treated differently than at the college level. Some states also do not follow the federal rule and may tax or penalize K-12 withdrawals at the state level.\n\nCheck your own state's treatment before pulling money for private school. A withdrawal that is federally fine can still trigger a state tax bill or clawback of a past state deduction."
      },
      {
        heading: "Room & board — and the off-campus rent trap",
        body: "Room & board is a qualified 529 expense only if the student is enrolled at least half-time. On-campus housing is simple: the amount you pay the school qualifies.\n\nOff-campus is where families overspend. Rent and food only qualify up to the school's published cost-of-attendance room & board allowance for off-campus students. If your child rents a $2,000/month apartment but the school's allowance is $1,200/month, only $1,200 qualifies. The extra $800 is a non-qualified withdrawal — the earnings portion owes income tax plus the 10% penalty.\n\nThe fix is simple: pull the school's published cost of attendance from the financial-aid office, and keep your 529-paid housing at or under that allowance. Keep receipts."
      },
      {
        heading: "Computers, apprenticeships, and student loans",
        body: "Computers and technology count. A laptop, related equipment, software, and internet access qualify as long as they are used primarily by the student during enrollment. General-purpose software or a gaming PC does not qualify.\n\nRegistered apprenticeship programs are also covered. Fees, books, supplies, and required equipment for a program registered with the U.S. Department of Labor are qualified 529 expenses.\n\nA 529 can also repay student loans — up to $10,000 lifetime per beneficiary, plus a separate $10,000 lifetime limit for each of the beneficiary's siblings. This is a lifetime cap, not annual. Have leftover money after these options? See your full menu in [529 leftover money options](/guides/529-leftover-money-options/)."
      },
      {
        heading: "What does NOT qualify (and the penalty)",
        body: "Plenty of college-life costs are not 529 qualified expenses. Transportation and travel — flights home, a car, gas, parking — do not qualify. Neither does student health insurance, most extracurricular fees, sports and club dues, or general living costs beyond the room & board allowance.\n\nWhen you spend 529 money on a non-qualified expense, only the earnings portion is taxed — your original contributions come out tax-free. But those earnings owe ordinary income tax plus a 10% federal penalty. The 10% penalty is waived in specific cases, such as the beneficiary receiving a scholarship (up to the scholarship amount), attending a U.S. military academy, or becoming disabled.\n\nBefore taking a non-qualified withdrawal, weigh alternatives like a Roth IRA rollover or changing the beneficiary. Also compare the 529's rules against a [Coverdell ESA](/compare/529-vs-coverdell-esa/) or a [Trump Account vs a 529](/compare/trump-account-vs-529/), which handle education spending very differently."
      }
    ],
    tools: [
      { href: "/529-savings-calculator/", label: "529 savings calculator" }
    ],
    faqs: [
      {
        question: "Can a 529 pay for private school (K-12)?",
        answer: "Yes. A 529 can pay K-12 tuition at private or religious schools, up to $20,000 per student per year in 2026. Only tuition clearly qualifies at the K-12 level — not room & board or supplies — and some states do not follow the federal rule, so check your state's treatment first."
      },
      {
        question: "Can I use a 529 for student loans?",
        answer: "Yes, up to $10,000 lifetime per beneficiary toward qualified student loans, plus a separate $10,000 lifetime limit for each of the beneficiary's siblings. This is a lifetime cap, not an annual one. Interest paid this way cannot also be deducted as student-loan interest."
      },
      {
        question: "Does room & board count as a 529 qualified expense?",
        answer: "Yes, but only if the student is enrolled at least half-time. On-campus housing qualifies up to what you pay the school. Off-campus rent and food qualify only up to the school's published cost-of-attendance room & board allowance."
      },
      {
        question: "How much off-campus rent does a 529 cover?",
        answer: "A 529 covers off-campus rent and food only up to the school's published cost-of-attendance room & board allowance for off-campus students. If your rent is higher than that allowance, the excess is a non-qualified withdrawal — so overpaying rent isn't fully covered. Get the allowance figure from the financial-aid office."
      },
      {
        question: "Can a 529 pay for a computer?",
        answer: "Yes. A computer, related equipment, software, and internet access are qualified 529 expenses if they are used primarily by the beneficiary while enrolled. A general-purpose or gaming computer used mainly for entertainment does not qualify."
      },
      {
        question: "What happens if I use 529 money for a non-qualified expense?",
        answer: "The earnings portion of a non-qualified withdrawal is taxed as ordinary income plus a 10% federal penalty; your contributions always come out tax-free. The 10% penalty is waived in certain cases, such as a scholarship (up to its amount), a service-academy appointment, disability, or death of the beneficiary."
      }
    ],
    sources: [
      { label: "IRS — Topic No. 313, Qualified Tuition Programs (529 plans)", url: "https://www.irs.gov/taxtopics/tc313" },
      { label: "SEC Investor.gov — An Introduction to 529 Plans (Investor Bulletin)", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/introduction-529-plans-investor-bulletin" },
      { label: "IRS — Publication 970, Tax Benefits for Education", url: "https://www.irs.gov/publications/p970" }
    ],
  },

  {
    slug: "best-investment-account-for-kids",
    title: "Best Investment Account for Kids (2026 Guide)",
    metaDescription: "The best investment account for kids depends on your goal. Compare the Trump Account, 529, custodial brokerage, and custodial Roth IRA — and how to layer them.",
    h1: "The Best Investment Account for Kids: How to Choose (and Layer) Them",
    cardBlurb: "A decision framework across every kid account type — Trump Account, 529, custodial brokerage, custodial Roth IRA — with a clear which-to-pick matrix.",
    intro: "The best investment account for kids is usually not one account — it is a layered stack: the free $1,000 Trump Account seed everyone eligible should claim, a 529 for college, and a custodial Roth IRA once a teen has a job. Each account wins at a different goal, so picking only one leaves money on the table. This guide compares all six main kid account types side by side, then gives you a plain decision rule for which to open first. The non-obvious takeaway: most families should stack accounts, not choose between them.",
    sections: [
      {
        heading: "The six kid account types, at a glance",
        body: "There is no single \"best\" account because each one is built for a different job. A [529 plan](/guides/529-qualified-expenses/) is a tax-free college account. A [custodial UTMA brokerage](/guides/utma-custodial-account-explained/) is a flexible, use-it-for-anything account. A [custodial Roth IRA](/guides/custodial-roth-ira-for-kids/) is a tax-free retirement head start for a working teen. The new [Trump Account](/guides/trump-accounts/) is a federal, tax-deferred account with a free seed. A Coverdell ESA is a small education account. A high-yield savings account (HYSA) is safe cash for short-term needs.\n\nThe right pick depends on your goal, your timeline, and whether the child has earned income. Match the account to the job, and you will almost always end up using more than one. If you came here from the Trump Account, see the full list of [Trump Account alternatives](/guides/trump-account-alternatives/)."
      },
      {
        heading: "Start free: claim the Trump Account seed",
        body: "If your child is a U.S. citizen born between 2025 and 2028 and has a Social Security number, the federal government will deposit a $1,000 seed into a Trump Account — free money you should not leave unclaimed. The account grows tax-deferred and must be invested in an S&P 500 or U.S.-equity index fund. It is locked until January 1 of the year the child turns 18, then behaves like a traditional IRA (withdrawals are taxed as ordinary income).\n\nThe growth is real even if you never add a dollar. Our engine puts the $1,000 seed alone at about $3,513 by age 18 at a 7% return. Add $200 a month and it reaches roughly $89,657. Contribute the $5,000 annual max from birth and it grows to about $182,980. Because the seed is free and requires no ongoing contributions, claiming it is the clearest first move for eligible families. New to it? Start with [who qualifies](/guides/trump-account-eligibility/) and the guide [for newborns](/guides/trump-account-for-newborns/). See how it compares in [Trump Account vs 529](/compare/trump-account-vs-529/) and against the proposed [baby bonds](/compare/trump-account-vs-baby-bonds/) programs."
      },
      {
        heading: "For college: the 529 plan",
        body: "If your primary goal is paying for school, a 529 plan is usually the strongest account. Contributions are after-tax, but growth and withdrawals are completely tax-free when used for qualified education — tuition, fees, books, and room & board — plus up to $20,000 a year in K-12 tuition and up to $10,000 lifetime toward student loans. Most states also add a state income-tax deduction or credit.\n\nA 529 also helps with financial aid: a parent-owned 529 is treated as a parental asset on the FAFSA, assessed at no more than 5.64% — a lighter hit than a custodial account. Our 529 calculator shows $300 a month from birth growing to about $116,206 by age 18 at a 6% return. The main risk is flexibility: non-qualified withdrawals owe income tax plus a 10% penalty on earnings, though SECURE 2.0 now lets up to $35,000 of unused funds roll into the beneficiary's Roth IRA. Weigh it against a plain brokerage in [529 vs UTMA](/compare/529-vs-utma/)."
      },
      {
        heading: "For flexibility: a custodial (UTMA) brokerage",
        body: "If you want to invest for a goal that is not college — a first car, a business, a down payment — a custodial UTMA brokerage account gives you the widest freedom. There is no contribution cap and no restriction on what you invest in. The catch is that the money is irrevocably the child's, and control transfers to them at the age of majority (18 to 25 depending on your state).\n\nTaxes follow the kiddie-tax rules: in 2025 the first $1,350 of unearned income is tax-free, the next $1,350 is taxed at the child's rate, and anything above $2,700 is taxed at the parents' marginal rate. On the FAFSA, a custodial account is the student's asset, assessed at 20% — a bigger aid hit than a 529. Learn the mechanics in [the UTMA custodial account explained](/guides/utma-custodial-account-explained/)."
      },
      {
        heading: "For a working teen: a custodial Roth IRA",
        body: "If your child has earned income from a real job or self-employment, a custodial Roth IRA is one of the most powerful accounts you can open for them. Contributions are limited to the lesser of the child's earned income or the annual IRA limit ($7,000 in 2025). Growth and qualified withdrawals are tax-free, and contributions (not earnings) can be pulled out anytime without tax or penalty.\n\nThe hard limit is earned income: a newborn with no wages cannot fund one, so this account only unlocks once a teen starts working. That makes it a later layer, not a starter account. Compare it against the federal option in [Trump Account vs Roth IRA](/compare/trump-account-vs-roth-ira/), and against college saving in [custodial Roth IRA vs 529](/compare/custodial-roth-ira-vs-529/)."
      },
      {
        heading: "Which to pick: the decision rule",
        body: "Do not agonize over a single choice — follow this order and layer as you go:\n\n1. Eligible for the Trump Account seed? Claim the free $1,000 first. It costs nothing.\n\n2. Saving mainly for college? Open a 529 next for its tax-free growth and lighter FAFSA treatment.\n\n3. Want flexibility for non-college goals? Add a custodial UTMA brokerage — but remember the child controls it as an adult.\n\n4. Does your teen have a job? Open a custodial Roth IRA and match part of their earnings for a tax-free retirement head start.\n\n5. Need money within a year or two? Keep it in an HYSA, not the market — see our guide on [high-yield savings accounts for kids and teens](/guides/high-yield-savings-account-for-kids-and-teens/) for the custodial and joint-account rules that apply below age 18.\n\nA Coverdell ESA can supplement education savings but caps at $2,000 a year, so most families choose a 529 instead. The insight worth repeating: the strongest plan for most households is a stack — the free Trump seed, a 529 for college, and a custodial Roth once a teen works — not a single \"best\" account."
      },
      {
        heading: "How to start today",
        body: "Start with the account that fits your child's situation right now. If they were born 2025–2028, claim the Trump Account seed through the IRS enrollment process — it takes about 10 minutes and needs only their SSN. For college, open a 529 with your state's plan (to capture any state tax break) or a low-cost national plan, then set up an automatic monthly contribution.\n\nRun the numbers before you commit a dollar. Use the [529 savings calculator](/529-savings-calculator/) to size a college target, and the [Trump Account calculator](/trump-account/) to see how the seed plus contributions compound to age 18. Once a teen earns income, add the custodial Roth IRA. Automating even small monthly deposits into the right layered accounts does more than any one perfect account choice."
      }
    ],
    tools: [
      { href: "/529-savings-calculator/", label: "529 savings calculator" },
      { href: "/trump-account/", label: "Trump Account calculator" }
    ],
    faqs: [
      {
        question: "What is the best investment account for kids?",
        answer: "The best investment account for kids depends on your goal: a 529 for college, a custodial UTMA brokerage for flexibility, and a custodial Roth IRA for a working teen. Most families should layer accounts rather than pick one — and claim the free $1,000 Trump Account seed first if the child is eligible."
      },
      {
        question: "Should I open just one account or several?",
        answer: "Most families are better off layering accounts. Claim the free Trump Account seed, add a 529 for college, and open a custodial Roth IRA once a teen has a job. Each account wins at a different goal, so stacking them beats forcing every dollar into one."
      },
      {
        question: "Is a 529 or a custodial account better for college?",
        answer: "A 529 is usually better for college. Its growth and withdrawals are tax-free for qualified education, and a parent-owned 529 is assessed at no more than 5.64% on the FAFSA. A custodial account is more flexible but is the student's asset, assessed at 20% — a larger financial-aid hit. See [529 vs UTMA](/compare/529-vs-utma/)."
      },
      {
        question: "Can my child have both a 529 and a custodial Roth IRA?",
        answer: "Yes. A child can hold both, and many should. Use the 529 for tax-free college savings and the custodial Roth IRA for tax-free retirement growth once they have earned income. SECURE 2.0 even lets up to $35,000 of unused 529 funds roll into the beneficiary's Roth IRA. Compare them in [custodial Roth IRA vs 529](/compare/custodial-roth-ira-vs-529/)."
      },
      {
        question: "How much can the free Trump Account seed grow?",
        answer: "The $1,000 Trump Account seed can grow to about $3,513 by age 18 with no added contributions at a 7% return. Adding $200 a month raises it to roughly $89,657, and contributing the $5,000 annual maximum from birth grows it to about $182,980. Read more in the [Trump Accounts guide](/guides/trump-accounts/)."
      },
      {
        question: "What account is best if my teen has a job?",
        answer: "A custodial Roth IRA is often the best account for a teen with earned income. Contributions are capped at the lesser of their earnings or $7,000 (2025), and qualified growth is tax-free. Because it requires documented earned income, it only becomes available once they start working. See [Trump Account vs Roth IRA](/compare/trump-account-vs-roth-ira/)."
      }
    ],
    sources: [
      { label: "IRS — Trump Accounts", url: "https://www.irs.gov/trumpaccounts" },
      { label: "IRS — Topic 313, Qualified Tuition Programs (529 plans)", url: "https://www.irs.gov/taxtopics/tc313" },
      { label: "IRS — Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras" },
      { label: "IRS — Topic 553, Tax on a Child's Investment Income (Kiddie Tax)", url: "https://www.irs.gov/taxtopics/tc553" }
    ],
  },

  {
    slug: "custodial-account-taxes-kiddie-tax",
    title: "Custodial Account Taxes: How the Kiddie Tax Works",
    metaDescription: "How custodial account taxes work and how the kiddie tax hits a child's unearned income in 2025 — brackets, filing rules, and planning tips.",
    h1: "Custodial Account Taxes and the Kiddie Tax Explained",
    cardBlurb: "Who pays tax on a custodial account, the 2025 kiddie-tax brackets, and how to keep a child's investment income under the threshold.",
    intro: "Custodial account taxes fall on the child, not the parent, because the assets legally belong to the minor — but the kiddie tax can push some of that income up to the parents' marginal rate. A custodial account (UTMA or UGMA) is taxed each year on its investment income, and the kiddie tax sets how much is tax-free, how much is taxed at the child's low rate, and how much is taxed at the parents' higher rate. In 2025 the first $1,350 of unearned income is tax-free and the next $1,350 is taxed at the child's rate. Everything above $2,700 is taxed at the parents' marginal rate. This guide explains who files, the brackets, earned vs unearned income, and how to keep the bill small.",
    sections: [
      {
        heading: "Who pays tax on a custodial account?",
        body: "The child pays the tax on a custodial account, because the money is irrevocably theirs. When you open a UTMA or UGMA account, the assets legally belong to the minor even though an adult custodian manages them. That is different from a parent-owned brokerage account, where the parent reports the income.\n\nBecause the account is the child's, the income is reported under the child's Social Security number. But a low child's tax rate does not automatically apply to all of it. The [kiddie tax](https://www.irs.gov/taxtopics/tc553) exists to stop families from shifting large investment income to a child to dodge higher rates. For the basics of how these accounts work, see our [UTMA custodial account guide](/guides/utma-custodial-account-explained/)."
      },
      {
        heading: "The 2025 kiddie-tax brackets",
        body: "The kiddie tax splits a child's unearned income into three tiers. For 2025, the tiers are:\n\n- **First $1,350** of unearned income: tax-free (covered by the standard deduction).\n- **Next $1,350** (from $1,350 to $2,700): taxed at the child's own rate, which is usually 10%.\n- **Above $2,700**: taxed at the parents' marginal tax rate.\n\nThat top tier is the surprise for many families. Once a custodial account throws off more than $2,700 in a year, the excess is taxed as if the parents earned it — often 22%, 24%, or higher. So a well-funded, growth-heavy custodial account can create a yearly tax bill at the parents' rate, not the child's."
      },
      {
        heading: "Earned vs unearned income — why it matters",
        body: "The kiddie tax only applies to unearned income. Unearned income is money the child did not work for: interest, dividends, and capital gains from investments. A custodial account produces exactly this kind of income, which is why it is exposed to the kiddie tax.\n\nEarned income — wages from a job or self-employment — is not subject to the kiddie tax. It is taxed at the child's own rate and gets its own standard deduction. This distinction is why a child with a real job can also fund a [custodial Roth IRA](/guides/best-investment-account-for-kids/), which needs earned income, while a custodial brokerage account never counts as earned income."
      },
      {
        heading: "When does a child have to file a tax return?",
        body: "A child generally must file their own return once unearned income tops $1,350 in 2025 (or when total income crosses the filing threshold). If the only income is investment income and it stays under that amount, no return is usually needed.\n\nWhen a return is required, unearned income above the thresholds is figured on [IRS Form 8615](https://www.irs.gov/taxtopics/tc553), which applies the parents' rate to the top tier. In some cases parents can instead report a child's interest and dividends on their own return using Form 8814 — but that can raise the parents' income, so run the numbers first. When in doubt, check the exact filing rules with a tax professional or the IRS."
      },
      {
        heading: "How to keep the tax bill small",
        body: "The simplest rule: keep the account's annual unearned income under the kiddie-tax threshold. If yearly interest, dividends, and realized gains stay below about $1,350, the income is effectively tax-free.\n\nPractical moves:\n\n- **Choose tax-efficient funds.** Broad index funds and ETFs throw off less taxable income than actively managed funds that trade often and distribute gains.\n- **Favor growth over payouts.** Funds that reinvest and pay small dividends defer taxes until you sell.\n- **Keep growth-heavy assets modest** inside a custodial account, or you invite a yearly bill at the parents' rate.\n- **Mind capital gains timing.** Selling appreciated holdings all at once can spike unearned income past $2,700.\n\nIf your goal is college and the tax hit worries you, a 529 grows tax-free for education — see [529 vs UTMA](/compare/529-vs-utma/) to compare the tradeoffs, and our [best investment account for kids](/guides/best-investment-account-for-kids/) pillar for the full picture."
      },
      {
        heading: "A worked example",
        body: "Say a custodial account holds $60,000 and earns $3,000 of dividends and interest in 2025. The first $1,350 is tax-free. The next $1,350 is taxed at the child's 10% rate ($135). The final $300 — the amount above $2,700 — is taxed at the parents' marginal rate; at 24% that is $72.\n\nThe same $3,000 in a smaller, more tax-efficient account might have stayed under $1,350 and owed nothing. That gap is why fund choice and account size matter. Use our [investment calculator](/investing/) to project how much income a given balance is likely to generate before you fund the account."
      }
    ],
    tools: [
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      {
        question: "Who pays taxes on a custodial account?",
        answer: "The child pays the taxes on a custodial account, because the assets legally belong to the minor. Income is reported under the child's Social Security number, but the kiddie tax can push part of it up to the parents' marginal rate."
      },
      {
        question: "What is the kiddie tax in 2025?",
        answer: "In 2025 the kiddie tax makes the first $1,350 of a child's unearned income tax-free, taxes the next $1,350 at the child's rate, and taxes anything above $2,700 at the parents' marginal rate. It applies to investment income like interest, dividends, and capital gains."
      },
      {
        question: "Does the kiddie tax apply to a child's job income?",
        answer: "No. The kiddie tax only applies to unearned income such as interest, dividends, and capital gains. Earned income from a job or self-employment is taxed at the child's own rate and is not subject to the kiddie tax."
      },
      {
        question: "When does a child have to file a tax return for a custodial account?",
        answer: "A child generally must file a return once unearned income tops $1,350 in 2025 (or when total income crosses the filing threshold). Income above the kiddie-tax tiers is figured on IRS Form 8615."
      },
      {
        question: "How can I lower custodial account taxes?",
        answer: "Keep the account's yearly unearned income under about $1,350 and use tax-efficient investments. Broad index funds and ETFs that pay small dividends and reinvest growth generate less taxable income than actively managed funds that distribute gains."
      },
      {
        question: "Is a custodial account better than a 529 for taxes?",
        answer: "For education, a 529 usually wins on taxes because its growth and qualified withdrawals are tax-free, while a custodial account is taxed yearly under the kiddie tax. A custodial account offers more spending flexibility. Compare them in our 529 vs UTMA guide."
      }
    ],
    sources: [
      { label: "IRS Topic 553 — Kiddie Tax (Tax on a Child's Investment and Other Unearned Income)", url: "https://www.irs.gov/taxtopics/tc553" },
      { label: "SEC Investor.gov — UGMA/UTMA Accounts", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/ugmautma-accounts" },
      { label: "IRS Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras" }
    ],
  },

  {
    slug: "custodial-roth-ira-for-kids",
    title: "Custodial Roth IRA for Kids: The Complete Guide",
    metaDescription: "A custodial Roth IRA lets a working child grow money tax-free. Learn the earned-income rule, 2025 limits, and how to open one.",
    h1: "Custodial Roth IRA for Kids: How It Works",
    cardBlurb: "A tax-free retirement account for kids who earn income — plus the one rule that decides whether they qualify.",
    intro: "A custodial Roth IRA for kids is a retirement account an adult opens and manages for a minor who has earned income. The child owns the account; the adult controls it until the child reaches the age of majority. Money grows tax-free, and qualified withdrawals in retirement are tax-free too. But there is one hard gate: the child must have earned income to contribute. No earned income means no funding — full stop.",
    sections: [
      {
        heading: "What a custodial Roth IRA is",
        body: "A custodial Roth IRA is a normal Roth IRA titled for a minor, with an adult acting as custodian. The adult opens it, funds it, and picks the investments. The child is the legal owner.\n\nControl transfers to the child when they reach the age of majority in their state, usually 18 or 21. After that, the account is theirs to manage.\n\nBecause it is a Roth, contributions go in after tax. There is no upfront deduction. The payoff comes later: decades of tax-free growth. For a young saver, that runway is the whole point. See how a Roth stacks up against other options in our [best investment account for kids guide](/guides/best-investment-account-for-kids/)."
      },
      {
        heading: "The earned-income rule (the key gate)",
        body: "This is the rule that decides everything. A child can only contribute if they have earned income for the year. A newborn or a kid with no job cannot have a funded Roth IRA — there is nothing to base a contribution on.\n\nThe contribution limit is the lesser of the child's earned income or the annual IRA limit. For 2025, that annual limit is $7,000. So a teen who earns $3,000 can contribute up to $3,000, not $7,000. A teen who earns $9,000 is still capped at $7,000.\n\nThe IRS is clear: yearly contributions to all of your IRAs cannot be more than $7,000, or, \"if less, your taxable compensation for the year.\" Earned income is the ceiling."
      },
      {
        heading: "What counts as earned income (and documenting it)",
        body: "Earned income means money paid for work. A W-2 job — a summer job, retail, lifeguarding, a paper route — clearly counts. Self-employment counts too: babysitting, lawn mowing, tutoring, dog walking, or reselling.\n\nWhat does not count: allowance, birthday cash, gifts, or investment income. Those are not earned.\n\nHere is the non-obvious part. You must be able to prove the income. If your child does self-employment work, keep records — dates, who paid, how much, and for what. A simple log or invoices is enough. If the IRS ever asks how a Roth got funded, undocumented \"chore\" money will not hold up. No documented earned income, no valid contribution."
      },
      {
        heading: "How to open a custodial Roth IRA",
        body: "The process is short. Pick a brokerage that offers custodial Roth IRAs — many major low-cost brokers do. Open the account under the adult's name as custodian, with the child as beneficial owner.\n\nYou will need the child's Social Security number and basic details, plus your own information as custodian.\n\nThen fund it, up to the child's earned income for the year (or $7,000 for 2025, whichever is less). The money does not have to be the child's exact paycheck — a parent can gift the contribution — but the child must have earned at least that much. Finally, invest it. A broad, low-cost index fund is a common, simple choice. Model the long-term math with our [investment calculator](/investing/)."
      },
      {
        heading: "Tax-free growth and flexible withdrawals",
        body: "The Roth advantage is tax-free growth. Contributions are after-tax, so qualified withdrawals in retirement come out completely tax-free — including decades of earnings.\n\nThere is also built-in flexibility. Contributions (not earnings) can be withdrawn anytime, tax- and penalty-free. If your teen puts in money and later needs it, the amount they contributed is accessible.\n\nOne caution: pulling contributions out early erases the tax-free growth that money would have earned. The account works best when the money stays invested for the long haul. For a comparison with education-focused accounts, see [custodial Roth IRA vs 529](/compare/custodial-roth-ira-vs-529/)."
      },
      {
        heading: "Why it is a powerful retirement head start",
        body: "Time is the reason. A dollar invested at 15 has 50 years to compound before a normal retirement age. That is a head start most adults never get.\n\nStarting young also builds the habit. A teen who watches their own account grow learns how investing works before they have real bills.\n\nA custodial Roth is not the only kids' account, and it is not always the right one — it depends on whether the child earns income. Compare it with a flexible custodial account in [custodial Roth IRA vs UTMA](/compare/custodial-roth-ira-vs-utma/), with the new federal option in [Trump Account vs Roth IRA](/compare/trump-account-vs-roth-ira/), and with the pre-tax alternative in [custodial Roth IRA vs Traditional IRA](/compare/custodial-roth-ira-vs-traditional-ira/)."
      }
    ],
    tools: [ { href: "/investing/roth-ira-calculator/", label: "Roth IRA calculator" } ],
    faqs: [
      {
        question: "Can I open a custodial Roth IRA for a child with no income?",
        answer: "No. A custodial Roth IRA can only be funded if the child has earned income for the year. Without earned income, there is no allowable contribution, so a newborn or a child with no job cannot have a funded Roth IRA."
      },
      {
        question: "What is the contribution limit for a custodial Roth IRA?",
        answer: "The limit is the lesser of the child's earned income or the annual IRA limit, which is $7,000 for 2025. A child who earns $2,500 can contribute up to $2,500; a child who earns more than $7,000 is still capped at $7,000."
      },
      {
        question: "What counts as earned income for a child's Roth IRA?",
        answer: "Earned income is money paid for work, such as a W-2 job or self-employment like babysitting, lawn mowing, or tutoring. Allowance, gifts, and investment income do not count, because they are not earned."
      },
      {
        question: "Do I need to document my child's earned income?",
        answer: "Yes. You should keep records of the income used to justify a contribution, especially for self-employment. A simple log of dates, amounts, and who paid — or invoices — protects the contribution if the IRS ever asks how the account was funded."
      },
      {
        question: "Can my child withdraw money from a custodial Roth IRA?",
        answer: "Contributions can be withdrawn anytime, tax- and penalty-free, but earnings generally cannot be withdrawn tax-free until retirement age and other conditions are met. Pulling money out early sacrifices future tax-free growth."
      },
      {
        question: "Who controls a custodial Roth IRA?",
        answer: "The adult custodian controls the account until the child reaches the age of majority, usually 18 or 21 depending on the state. After that, the child takes full control of the account they own."
      }
    ],
    sources: [
      { label: "IRS — Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras" },
      { label: "IRS — Retirement Topics: IRA Contribution Limits", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits" },
      { label: "SEC Investor.gov — UGMA/UTMA and custodial accounts", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/ugmautma-accounts" }
    ],
  },

  {
    slug: "how-to-open-a-custodial-brokerage-account-for-kids",
    title: "How to Open a Custodial Brokerage Account for Kids",
    metaDescription: "How to open a custodial brokerage account for kids: what a UTMA/UGMA is, what you need, choosing a broker, funding, and the kiddie tax explained.",
    h1: "How to Open a Custodial Brokerage Account for Kids",
    cardBlurb: "A step-by-step guide to opening, funding, and managing a UTMA/UGMA custodial brokerage account for your child.",
    intro: "To open a custodial brokerage account for kids, an adult opens a UTMA or UGMA account in the child's name at a broker, provides the child's Social Security number and their own ID, and funds it. The account is legally the child's, but you manage the investments as custodian. Most major brokers let you open one online in about 15 minutes with no minimum and no account fees. The catch worth knowing up front: your child takes full control at the age of majority, and you cannot take the money back. This guide walks through each step, from what you need to the [kiddie tax](/guides/custodial-account-taxes-kiddie-tax/) at the end.",
    sections: [
      {
        heading: "What a custodial (UTMA/UGMA) brokerage account is",
        body: "A custodial brokerage account is an investment account an adult opens and manages for a minor. The two types are UGMA (Uniform Gifts to Minors Act) and UTMA (Uniform Transfers to Minors Act). You act as the custodian and pick the investments, but the assets legally belong to the child.\n\nThe key word is irrevocable. Once you put money in, it is a gift to the child and cannot be taken back or moved to another kid. That is different from a 529 or a parent-owned brokerage account, where you keep control.\n\nUGMA holds financial assets only, such as cash, stocks, bonds, and funds. UTMA is broader and can also hold property like real estate. UTMA is the newer, more flexible statute and is available in nearly every state. For most families opening a brokerage account, the two work the same way. See our [UTMA custodial account explained](/guides/utma-custodial-account-explained/) guide for the full breakdown."
      },
      {
        heading: "What you need before you start",
        body: "You can gather everything in a few minutes. To open the account you will need:\n\n- The child's full legal name, date of birth, and Social Security number.\n- Your own government-issued ID and Social Security number, plus your address.\n- A funding source, usually a linked bank account for an electronic transfer.\n\nThe child's SSN matters because the account is reported under the child's tax ID, not yours. That is what triggers the kiddie tax rules on any investment gains, covered below.\n\nYou will also choose the age of majority for your state during signup, though this is usually fixed by law (often 18 or 21). Have your bank routing and account numbers ready so you can fund the account right away."
      },
      {
        heading: "Choosing a broker",
        body: "Most large brokers offer custodial accounts with no account fees, no minimum to open, and commission-free trades on stocks and ETFs. Firms like Fidelity, Schwab, and Vanguard all fit this description, and many banks and robo-advisors offer them too.\n\nWhen you compare, look at four things:\n\n- Cost: confirm zero account fees and commission-free ETF trades.\n- Minimums: many require $0 to open.\n- Investment choice: broad access to index funds and ETFs matters more than fancy tools.\n- Fractional shares: helpful when you are investing small amounts each month.\n\nAny reputable, low-cost broker that offers custodial UTMA/UGMA accounts will do the job. Do not overthink the brand; the account type and low fees matter far more than the logo."
      },
      {
        heading: "Opening the account: step by step",
        body: "The online process is short. Here is the typical flow:\n\n1. On the broker's site, choose to open a custodial or UTMA/UGMA account.\n2. Enter your details as the custodian, then the child's details, including their SSN.\n3. Select your state's age of majority if prompted.\n4. Review and agree to the custodial agreement.\n5. Link your bank account to fund it.\n\nApproval is usually instant or within a business day. Once open, you buy investments inside the account the same way you would in your own brokerage account. Everything you buy is held for the child."
      },
      {
        heading: "Funding the account and the gift-tax note",
        body: "You fund a custodial account by transferring cash from your bank, then investing it. There is no annual contribution limit on the account itself. Anyone, such as grandparents or relatives, can contribute too.\n\nGifts do interact with the federal gift tax, though most families never owe it. For 2026 you can give up to $19,000 per child per year without any gift-tax paperwork, per the [IRS gift tax rules](https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-gift-taxes). A married couple can give up to $38,000 combined to one child. Gifts above the annual exclusion only reduce your lifetime exemption; they rarely mean an actual tax bill.\n\nSet up an automatic monthly transfer if you can. Small, steady contributions add up over many years of growth."
      },
      {
        heading: "What to invest in",
        body: "Because a custodial account is for a long time horizon, most families choose broad, low-cost investments. A total-market or S&P 500 index fund or ETF gives you wide diversification in a single holding.\n\nThe main tradeoff is taxes. Unlike a 529 or Roth IRA, gains here are taxable each year, so funds that spin off less taxable income (like broad index ETFs) are efficient choices.\n\nAvoid frequent trading and individual-stock bets with a child's money. A simple index fund held for a decade or more usually beats a complicated portfolio. Try our [investment calculator](/investing/) to see how monthly contributions could grow over time."
      },
      {
        heading: "Taxes (kiddie tax) and the age-of-majority handover",
        body: "A custodial account's investment gains are taxed under the kiddie tax, not at your rate for most of it. For 2025, the first $1,350 of a child's unearned income is tax-free, the next $1,350 is taxed at the child's rate, and unearned income above $2,700 is taxed at the parents' marginal rate, per [IRS Topic 553](https://www.irs.gov/taxtopics/tc553). Most small accounts stay under these thresholds.\n\nThe bigger planning point is the handover. At the age of majority (18 to 21, depending on your state), the account becomes the child's outright. They can spend it on anything, and you lose all control. Plan for this: talk with your child about the money before that age, and do not assume it will go toward college.\n\nOne more tradeoff: for financial aid, a custodial account counts as the student's asset and is assessed at up to 20% on the FAFSA, a bigger aid hit than a parent-owned account. If college aid is your priority, weigh a [529 vs UTMA](/compare/529-vs-utma/). To compare every option side by side, start with our pillar guide on the [best investment account for kids](/guides/best-investment-account-for-kids/)."
      }
    ],
    tools: [
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      {
        question: "How do I open a custodial brokerage account for my child?",
        answer: "You open a custodial brokerage account by choosing a UTMA/UGMA account at a broker, entering your details and the child's Social Security number, agreeing to the custodial agreement, and linking a bank account to fund it. Most brokers finish approval online in minutes with no minimum."
      },
      {
        question: "What do I need to open a custodial account?",
        answer: "You need the child's full name, date of birth, and Social Security number, plus your own ID, Social Security number, and address, and a funding source such as a linked bank account. The child's SSN is required because the account is reported under their tax ID."
      },
      {
        question: "Can I take the money back out of a custodial account?",
        answer: "No, you cannot take the money back. A custodial account is an irrevocable gift to the child, so the assets legally belong to them. As custodian you can spend funds for the child's benefit, but you cannot reclaim the money or move it to another child."
      },
      {
        question: "When does my child get control of the account?",
        answer: "Your child gains full control at the age of majority, which is 18 to 21 depending on your state and the account's UTMA terms. At that point the account becomes theirs outright and they can use the money however they choose."
      },
      {
        question: "How is a custodial brokerage account taxed?",
        answer: "A custodial account is taxed under the kiddie tax on the child's unearned income. For 2025 the first $1,350 is tax-free, the next $1,350 is taxed at the child's rate, and income above $2,700 is taxed at the parents' marginal rate. See our [kiddie tax guide](/guides/custodial-account-taxes-kiddie-tax/) for details."
      },
      {
        question: "Is a custodial account better than a 529 for college?",
        answer: "It depends on your goal. A custodial account offers full investment flexibility and any use of the money, but a 529 gives tax-free growth for education and a smaller financial-aid hit. Compare them in our [529 vs UTMA](/compare/529-vs-utma/) breakdown."
      }
    ],
    sources: [
      { label: "IRS — Tax Topic 553, Tax on a Child's Investment and Other Unearned Income (Kiddie Tax)", url: "https://www.irs.gov/taxtopics/tc553" },
      { label: "IRS — Frequently Asked Questions on Gift Taxes", url: "https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-gift-taxes" },
      { label: "SEC Investor.gov — UGMA/UTMA Accounts", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/ugmautma-accounts" }
    ],
  },

  {
    slug: "utma-custodial-account-explained",
    title: "UTMA Custodial Account Explained: Pros & Cons",
    metaDescription: "A UTMA account lets an adult invest for a child until they come of age. See how custodial accounts work, the real pros and cons, and who they fit.",
    h1: "UTMA Custodial Account Explained: How It Works, Pros & Cons",
    cardBlurb: "A plain-English guide to UTMA custodial accounts — how they work, the tradeoffs, and who they suit.",
    intro: "A UTMA account is a custodial investment account an adult opens and manages for a child until the child legally owns it at the age of majority. UTMA stands for the Uniform Transfers to Minors Act. There is no contribution cap and you can invest in almost anything. But the money is the child's for good, and they take full control between 18 and 21 in most states. This guide covers how it works, the honest pros and cons, and who a custodial account fits.",
    sections: [
      {
        heading: "What a UTMA custodial account is",
        body: "A UTMA custodial account holds investments that legally belong to a child, managed by an adult until the child comes of age. The adult is the \"custodian\" — usually a parent — and the child is the beneficiary.\n\nYou open one at almost any brokerage. Money and investments you put in become the child's property right away. The custodian makes the buy and sell decisions, but only for the child's benefit.\n\nUTMA is the newer, broader version of these accounts. It can hold cash, stocks, funds, and even real estate or other property. It is available in nearly every state. For more on account types, see our [best investment account for kids](/guides/best-investment-account-for-kids/) guide."
      },
      {
        heading: "How a UTMA account works, step by step",
        body: "The custodian opens the account, funds it, and invests on the child's behalf. There is no limit on how much you can add, though gifts above the annual gift-tax exclusion may need reporting.\n\nWhile the child is a minor, the custodian controls the account. They can use the money for the child's benefit — but not for their own normal parenting costs.\n\nControl transfers to the child at the age of majority. This is 18, 21, or up to 25 depending on your state and the account terms. On that date, the account becomes fully theirs to do with as they wish. See [how to open a custodial brokerage account for kids](/guides/how-to-open-a-custodial-brokerage-account-for-kids/) for the setup steps."
      },
      {
        heading: "The pros of a UTMA account",
        body: "The biggest draw is flexibility. Unlike a 529 plan, the money is not locked to education — it can pay for a car, a first apartment, a business, or anything else.\n\nThere is no contribution cap, so you can fund it as much as you like. Investment choice is broad: index funds, individual stocks, bonds, and more.\n\nSetup is simple. There are no income limits and no earned-income rule, so you can open one for a newborn. Growth over 18 years can be meaningful — try our [investment calculator](/investing/) to model it."
      },
      {
        heading: "The cons families underestimate",
        body: "The account is irrevocable. Once you gift money in, you cannot take it back or change the beneficiary. That is very different from a 529 plan, where you keep control.\n\nInvestment income can trigger the kiddie tax. A child's unearned income above a yearly threshold is taxed at the parents' higher rate. We cover the details in our [custodial account taxes and kiddie tax](/guides/custodial-account-taxes-kiddie-tax/) guide.\n\nCustodial accounts also carry the heaviest college-aid penalty. On the FAFSA, the account counts as the student's own asset and is assessed at up to 20% — a bigger aid hit than a parent-owned 529, which is capped near 5.64%."
      },
      {
        heading: "The real risk: the child gets the money with no strings",
        body: "This is the tradeoff most families overlook. At the age of majority — often 18 or 21 — the child gets full, unrestricted control of the entire balance.\n\nThey can spend it on anything. You cannot legally require them to use it for college, a home, or anything responsible. For a small account meant to teach investing, this is fine and even valuable.\n\nFor a large balance, it is a genuine risk. A teenager suddenly owning tens of thousands of dollars is a real scenario. If keeping control matters to you, a parent-owned 529 or taxable brokerage may fit better — compare [529 vs UTMA](/compare/529-vs-utma/)."
      },
      {
        heading: "UTMA vs UGMA in brief",
        body: "UTMA and UGMA are close cousins, both custodial and both taxed under the kiddie tax. The main difference is what they can hold and when control transfers.\n\nUGMA (Uniform Gifts to Minors Act) holds only financial assets — cash, stocks, bonds, and funds. It is accepted in all states. UTMA is broader, can also hold real estate and other property, and often allows a later transfer age.\n\nUTMA is the newer, more flexible statute and is what most brokerages offer today. For a full breakdown, see [UTMA vs UGMA](/compare/utma-vs-ugma/)."
      },
      {
        heading: "Who a UTMA account is best for",
        body: "A UTMA account fits families who want flexible, no-strings savings for a child and are comfortable handing over control later. It shines as a hands-on way to teach a teen about investing with real money.\n\nIt suits gifts you are happy to make permanent, and amounts modest enough that full control at 18 to 21 is not a worry. It is also useful when the goal is not strictly college.\n\nIf education is the main goal, a 529 usually wins on taxes and financial aid — see [529 vs UTMA](/compare/529-vs-utma/). To weigh all the options side by side, start with our [best investment account for kids](/guides/best-investment-account-for-kids/) hub."
      }
    ],
    tools: [
      { href: "/investing/", label: "Investment calculator" }
    ],
    faqs: [
      {
        question: "Is a UTMA account a good idea?",
        answer: "A UTMA account is a good idea when you want flexible savings for a child and accept that they will control the money as an adult. It is great for teaching investing and for goals beyond college. It is riskier for large sums, because the child gets full control at 18 to 21 with no strings attached."
      },
      {
        question: "What are the main pros and cons of a UTMA account?",
        answer: "The main pros are no contribution cap, broad investment choice, and simple setup with no income limits. The main cons are that the gift is irrevocable, investment income can trigger the kiddie tax, the child takes full control at the age of majority, and it carries the heaviest FAFSA hit at up to 20% of the balance."
      },
      {
        question: "At what age does the child get the money in a UTMA account?",
        answer: "The child gains full control of a UTMA account at the age of majority, which is 18, 21, or up to 25 depending on the state and account terms. On that date the balance becomes entirely theirs to spend however they choose. You cannot legally restrict how they use it."
      },
      {
        question: "Can I take money back out of a UTMA account?",
        answer: "No — a UTMA account is irrevocable, so you cannot take back money you have gifted into it. The assets legally belong to the child. As custodian you may spend the funds only for the child's benefit, not for your own use or normal parenting costs."
      },
      {
        question: "What is the difference between UTMA and UGMA?",
        answer: "The difference is that UGMA accounts hold only financial assets like cash, stocks, and funds, while UTMA accounts can also hold real estate and other property. UTMA is the newer, more flexible statute and often allows a later transfer age. Both are custodial and both are taxed under the kiddie tax. See our [UTMA vs UGMA](/compare/utma-vs-ugma/) comparison."
      },
      {
        question: "How does a UTMA account affect financial aid?",
        answer: "A UTMA account hurts financial aid more than most accounts because the FAFSA counts it as the student's own asset, assessed at up to 20%. That is a bigger aid hit than a parent-owned 529 plan, which is assessed at no more than 5.64%. A [529 vs UTMA](/compare/529-vs-utma/) comparison shows the tradeoff."
      }
    ],
    sources: [
      { label: "FINRA — Custodial Accounts", url: "https://www.finra.org/investors/investing/investment-accounts/custodial-accounts" },
      { label: "SEC Investor.gov — UGMA/UTMA Accounts", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/ugmautma-accounts" },
      { label: "IRS — Topic 553, Tax on a Child's Investment Income (Kiddie Tax)", url: "https://www.irs.gov/taxtopics/tc553" }
    ],
  },
  {
    slug: "trump-gold-coin",
    title: "Trump Gold Coin: Is It Real and What's It Worth? (2026)",
    metaDescription:
      "The Trump gold coin is a real 2026 US Mint $1 coin, but it's gold-colored base metal, not solid gold. See what it's worth, when it's out, and where to buy it.",
    h1: "Trump Gold Coin: Is It Real, and What Is It Worth?",
    cardBlurb: "The new $1 US Mint coin featuring Trump — is it real gold, what it costs, when it drops, and how to avoid the fakes.",
    intro:
      "The Trump gold coin is real: on July 15, 2026, Treasury Secretary Scott Bessent announced the [U.S. Mint](https://www.usmint.gov/) will strike a new $1 coin featuring President Trump for America's 250th anniversary. But \"gold\" describes its color, not its metal. The coin has a gold-like finish over a non-precious base metal, and its face value is one dollar. This guide explains what the coin actually is, what it is worth, when and where you can buy it, and how to avoid the novelty knockoffs already flooding the market.",
    sections: [
      { heading: "Is the Trump gold coin real?", body: "Yes, the Trump gold coin is a real U.S. Mint product, not a hoax. Treasury Secretary Scott Bessent unveiled the design on July 15, 2026, and reporting from [CBS News](https://www.cbsnews.com/news/1-gold-coin-trump-face-us-mint/) and [The Hill](https://thehill.com/homenews/administration/5969240-scott-bessent-donald-trump-america-250-gold-coin/) confirms production has already begun in Philadelphia.\n\nThe coin marks the country's 250th birthday, the semiquincentennial. Its front shows Trump beneath the word \"LIBERTY,\" with the dual date \"1776-2026\" and \"IN GOD WE TRUST.\" The back carries the presidential seal, the number \"250,\" and \"ONE DOLLAR.\" An earlier draft that showed Trump on both sides with the words \"FIGHT FIGHT FIGHT\" was dropped.\n\nSo the announcement is genuine. Whether the coin should exist at all is a separate, contested question covered below." },
      { heading: "Is the Trump coin real gold?", body: "No, the Trump coin is not real gold. It has a gold-colored finish but is struck from non-precious metal, according to CBS News and other outlets, and its official value is its face value of one dollar.\n\nThat difference matters for your money. A solid-gold coin is worth its metal content, which moves with the gold market. A gold-colored base-metal coin has no meaningful melt value, so it is a keepsake, not bullion. Treat any seller who calls it \"solid gold\" or \"pure gold\" as a red flag.\n\nA separate 24-karat gold commemorative design was approved by the Commission of Fine Arts in March 2026. That is a different, far more expensive product from the $1 circulating coin most people are searching for." },
      { heading: "How much will the Trump gold coin cost, and is it worth anything?", body: "The U.S. Mint has not announced a price for the Trump gold coin yet. Its face value is one dollar, but collectible coins usually sell above face value to cover minting and packaging.\n\nFor comparison, the Mint's other 2026 semiquincentennial coins are sold in sets, bags, and rolls at fixed prices. Any real \"worth\" beyond the sale price depends on the collector market, which is impossible to predict for a brand-new coin. Do not buy it as an investment expecting it to rise in value.\n\nWe are not investment advisers, and this is not financial advice. If you want the coin, buy it because you like it as a keepsake, not because you expect a return." },
      { heading: "When and where can you buy the Trump gold coin?", body: "You will be able to buy the Trump gold coin in fall 2026 from the official U.S. Mint. Reporting says the coins are being minted now and will go on sale later this year.\n\nThe only official seller is the [United States Mint](https://www.usmint.gov/) at usmint.gov. Buying direct is the single best way to be sure you get a genuine coin at the real price. Bookmark the Mint's [semiquincentennial coin page](https://www.usmint.gov/coins/coin-programs/semiquincentennial/) and check back near the release.\n\nBe careful with any other site. Many third-party sellers advertise \"official Trump gold coins\" at inflated prices, and some sell novelty tokens that never came from the Mint." },
      { heading: "Is it legal to put Trump on a coin?", body: "Putting a living president on a U.S. coin is legally disputed. A law from 1866, tied to the later Thayer Amendment, bars the image of any living person from U.S. currency and securities, and the 2005 Presidential $1 Coin Act limited that series to deceased presidents.\n\nThe administration argues the coin is allowed under a different law: the [Circulating Collectible Coin Redesign Act of 2020](https://www.congress.gov/bill/116th-congress/house-bill/1923), which lets the Treasury issue $1 coins with 250th-anniversary designs during 2026 only. Bessent has also pointed to a 1926 Sesquicentennial coin that showed then-living President Calvin Coolidge.\n\nCritics disagree, and some lawmakers have proposed a bill to explicitly ban living or sitting presidents from coins. The Citizens Coinage Advisory Committee declined to review the design, and the Treasury Secretary holds final say. The dispute could still end up in court." },
      { heading: "How to spot and avoid Trump coin scams", body: "The safest way to avoid a Trump coin scam is to buy only from the U.S. Mint at usmint.gov. Because the coin is famous and in high demand, novelty sellers are already promoting look-alikes and \"official\" tokens the Mint never made.\n\nHere is the honest comparison. The official coin is a $1 face-value, gold-colored base-metal coin sold by the U.S. Mint at a set price. A novelty knockoff is often sold as \"solid gold\" or \"legal tender worth thousands,\" priced far higher, and shipped by a private seller using urgent, limited-time claims.\n\nProtect yourself with a few checks. Confirm the seller is usmint.gov, ignore \"solid gold\" or guaranteed-value claims, and never pay by gift card or wire transfer. When a deal feels urgent and too good to be true, it usually is. You can track any coins you own as collectibles in your [net worth calculator](/net-worth/).\n\nThird-party marketplaces are a common source of these scams. A \"Trump gold coin\" listing on [Amazon](https://www.amazon.com) or [eBay](https://www.ebay.com) is not automatically the genuine U.S. Mint product, even if the photos and description look official, since anyone can list a novelty token under that name. For the real coin, buy only through the U.S. Mint's own channels at usmint.gov, not a third-party marketplace listing." },
      { heading: "The Trump coin and the 2026 semiquincentennial series", body: "The Trump gold coin is one piece of a much larger 2026 coin program. To mark 250 years of independence, the U.S. Mint is issuing redesigned quarters, a new dime, and a Statue of Liberty half dollar, all dual-dated \"1776-2026.\"\n\nUnderstanding the full program helps you tell official coins from novelties. Our guide to [America's 250th anniversary coins](/guides/250th-anniversary-coins/) explains every coin the Mint is releasing this year. It is the best way to see where the Trump dollar fits in. For other Trump-branded money topics, see our [Trump accounts guide](/guides/trump-accounts/)." },
    ],
    tools: [
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "Are Trump coins real gold?", answer: "No. The $1 Trump coin has a gold-like finish but is made of non-precious metal, and its face value is one dollar. It is a gold-colored collectible, not solid gold or bullion, so it has no meaningful melt value." },
      { question: "How much will the Trump gold coin cost?", answer: "The U.S. Mint has not announced a price yet. The coin's face value is $1, but collectible coins normally sell above face value to cover minting and packaging. Watch usmint.gov for the official price near the fall 2026 release." },
      { question: "Where can I buy the Trump gold coin?", answer: "You can buy it from the official United States Mint at usmint.gov, expected in fall 2026. That is the only official source. Avoid third-party sites advertising \"official Trump gold coins,\" which often sell overpriced novelties." },
      { question: "When does the Trump gold coin come out?", answer: "The Trump gold coin is expected to go on sale in fall 2026. The U.S. Mint says production has already begun in Philadelphia. No exact on-sale date has been announced yet." },
      { question: "Is the Trump gold coin worth anything?", answer: "Its guaranteed worth is its $1 face value. It is gold-colored base metal, not gold, so it has no bullion value. Any collector value beyond the sale price is speculative for a brand-new coin, so do not buy it as an investment." },
      { question: "Is it legal to put Trump on a coin?", answer: "It is disputed. An 1866 law bars living people from U.S. currency, but the Treasury argues a 2020 law allows $1 semiquincentennial designs in 2026. The question is contested and could be challenged in court." },
      { question: "Is the Trump gold coin the same as the Trump crypto coin?", answer: "No. The $1 Trump gold coin is a physical U.S. Mint coin. The \"Trump coin\" traded online is a separate cryptocurrency, or memecoin, with no link to the U.S. Mint. This guide covers only the physical coin." },
      { question: "Is the Trump gold coin legal tender?", answer: "Yes, technically. It is a U.S. Mint $1 coin, so it is legal tender at its one-dollar face value, the same as any other U.S. coin. In practice, buyers pay well above that face value for the coin's collector appeal, not to spend it, so using it to buy a dollar's worth of anything would mean giving up whatever price you paid for it." },
      { question: "Is this the same as the \"Trump gold coin\" sold online since 2017-2020?", answer: "No. This $1 coin is a genuine, official U.S. Mint product from the 2026 250th-anniversary program, unveiled by Treasury Secretary Scott Bessent on July 15, 2026. Various \"Trump gold coin\" novelty items have circulated online since 2017-2020, but those were unofficial, privately minted items with no U.S. Mint backing or government authorization. If you bought a \"Trump gold coin\" before 2026, it is not this coin." },
    ],
    sources: [
      { label: "U.S. Mint — Semiquincentennial Coins", url: "https://www.usmint.gov/coins/coin-programs/semiquincentennial/" },
      { label: "CBS News — U.S. Mint to make $1 gold coin with Trump's face on it", url: "https://www.cbsnews.com/news/1-gold-coin-trump-face-us-mint/" },
      { label: "The Hill — Bessent unveils $1 golden coin featuring Trump image", url: "https://thehill.com/homenews/administration/5969240-scott-bessent-donald-trump-america-250-gold-coin/" },
      { label: "Congress.gov — Circulating Collectible Coin Redesign Act of 2020 (H.R. 1923, Pub. L. 116-330)", url: "https://www.congress.gov/bill/116th-congress/house-bill/1923" },
    ],
  },

  {
    slug: "250th-anniversary-coins",
    title: "250th Anniversary Coins: 2026 Semiquincentennial Guide",
    metaDescription:
      "A plain-English guide to America's 250th anniversary coins: the 2026 semiquincentennial quarters, dime, half dollar, and $1 coin, and how to buy the real ones.",
    h1: "250th Anniversary Coins: America's 2026 Semiquincentennial Coin Guide",
    cardBlurb: "Every coin the U.S. Mint is releasing for America's 250th birthday — and how to tell the official ones from novelties.",
    intro:
      "The 250th anniversary coins are the special U.S. coins struck in 2026 to mark 250 years of American independence, known as the semiquincentennial. The [U.S. Mint](https://www.usmint.gov/) is redesigning circulating coins, including five new quarters, a new dime, and a Statue of Liberty half dollar, all dual-dated \"1776-2026.\" This guide explains which coins are being released, where they come from, and how to make sure any coin you buy is genuine.",
    sections: [
      { heading: "What are the 250th anniversary coins?", body: "The 250th anniversary coins are U.S. coins issued in 2026 to celebrate the country's semiquincentennial, its 250th birthday. Congress authorized them through the [Circulating Collectible Coin Redesign Act of 2020](https://www.congress.gov/bill/116th-congress/house-bill/1923), which lets the Treasury put special anniversary designs on circulating coins during 2026.\n\nThese are official coins from the [United States Mint](https://www.usmint.gov/), not private collectibles. Most carry a dual date of \"1776-2026\" so you can spot the anniversary year at a glance. You can see the full lineup on the Mint's [semiquincentennial coin page](https://www.usmint.gov/coins/coin-programs/semiquincentennial/)." },
      { heading: "Which coins is the U.S. Mint releasing for 2026?", body: "The U.S. Mint is releasing a full set of redesigned circulating coins for 2026, plus collectible sets. The headline change is five new quarter designs rolled out through the year.\n\nThe five 2026 quarters honor milestones in American history: the Mayflower Compact, the Revolutionary War, the Declaration of Independence, the U.S. Constitution, and the Gettysburg Address. The Mint has also issued a redesigned dime featuring Liberty and a new half dollar showing the Statue of Liberty in place of President Kennedy. The one-cent and five-cent coins keep their normal look but add the \"1776-2026\" dual date." },
      { heading: "Where does the Trump $1 coin fit in?", body: "The Trump $1 coin is a separate part of the 2026 program, added by the Treasury under the same 2020 law. Announced on July 15, 2026, it is a gold-colored, non-precious-metal $1 coin featuring President Trump.\n\nIt is more controversial than the quarters and half dollar because it shows a living, sitting president, which older laws restrict. If you are searching for that specific coin, our full guide to the [Trump gold coin](/guides/trump-gold-coin/) covers whether it is real gold, what it may cost, when it drops, and how to avoid fakes." },
      { heading: "How to buy the real 250th anniversary coins", body: "You buy genuine 250th anniversary coins directly from the U.S. Mint at usmint.gov. The Mint sells them as annual sets, bags, and rolls, and circulating quarters also reach everyday pocket change through banks.\n\nStick to official channels to avoid overpriced novelties. Many private sites repackage common coins or sell look-alike tokens with claims like \"solid gold\" or \"rare investment.\" A genuine circulating quarter or half dollar is worth its face value plus a small collector premium, not thousands of dollars. Track any coins you keep as collectibles in your [net worth calculator](/net-worth/)." },
    ],
    tools: [
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "What are the 250th anniversary coins?", answer: "They are U.S. coins struck in 2026 to mark America's semiquincentennial, its 250th birthday. The set includes five new quarters, a redesigned dime, a Statue of Liberty half dollar, and a $1 coin, most dual-dated \"1776-2026,\" all issued by the U.S. Mint." },
      { question: "How many 2026 semiquincentennial quarters are there?", answer: "There are five 2026 quarters. Their designs honor the Mayflower Compact, the Revolutionary War, the Declaration of Independence, the U.S. Constitution, and the Gettysburg Address, released at intervals through 2026." },
      { question: "Are the 250th anniversary coins worth money?", answer: "Circulating 250th anniversary coins are generally worth their face value plus a small collector premium. Special proof or silver sets from the U.S. Mint cost more. Be wary of sellers claiming any 2026 coin is a rare investment worth thousands." },
      { question: "Where can I buy 2026 semiquincentennial coins?", answer: "Buy them from the official United States Mint at usmint.gov, which sells annual sets, bags, and rolls. Circulating quarters also appear in everyday change. Buying direct is the best way to avoid overpriced novelty coins." },
      { question: "Is the Trump coin part of the 250th anniversary coins?", answer: "Yes. The $1 Trump coin is a separate part of the 2026 semiquincentennial program, added by the Treasury under the same 2020 law. It is more disputed because it shows a living president. See our Trump gold coin guide for details." },
    ],
    sources: [
      { label: "U.S. Mint — Semiquincentennial Coins", url: "https://www.usmint.gov/coins/coin-programs/semiquincentennial/" },
      { label: "U.S. Mint — Semiquincentennial Circulating Coin Program Designs Unveiled", url: "https://www.usmint.gov/news/press-releases/united-states-mint-semiquincentennial-circulating-coin-program-designs-unveiled" },
      { label: "Congress.gov — Circulating Collectible Coin Redesign Act of 2020 (H.R. 1923, Pub. L. 116-330)", url: "https://www.congress.gov/bill/116th-congress/house-bill/1923" },
    ],
  },

  // ─── Competitor-monitor pass (2026-07-15) ────────────────────────────────
  {
    slug: "coast-fire-guide",
    title: "Coast FIRE Explained: What It Is and How to Reach It",
    metaDescription:
      "Coast FIRE means your savings can grow into a full retirement number without more contributions. See how the math works and how to know if you're there.",
    h1: "Coast FIRE: What It Is and How to Tell When You've Reached It",
    cardBlurb: "The retirement milestone where your existing savings can grow into your full number on their own — no more contributions required.",
    intro:
      "Coast FIRE is the point where your current retirement savings, left untouched, will grow into a full retirement nest egg by the time you plan to retire. Once you hit it, you can stop adding new money to retirement and instead put your income toward other goals, because compound growth alone will finish the job. This guide explains how the math works, why the idea has caught on, and the real trade-offs people skip before declaring themselves \"coasted.\"",
    sections: [
      { heading: "What Coast FIRE actually means", body: "Coast FIRE means you have already saved enough that, without a single additional contribution, compound growth alone will carry your retirement savings to your full number by your target retirement age. It sits between two more familiar ideas: regular retirement saving, where you keep contributing every paycheck until you retire, and full FIRE (Financial Independence, Retire Early), where you already have enough to live off withdrawals today.\n\nReaching Coast FIRE does not mean you stop working. Most people who hit it keep their job or income, but they no longer need to save for retirement specifically — that money is now free for a mortgage payoff, a career change, part-time work, or simply more spending today. Use our [Coast FIRE calculator](/coast-fire/) to see your own number: it works backward from your desired retirement spending to tell you exactly what you need invested today to coast." },
      { heading: "Why Coast FIRE caught on", body: "Coast FIRE gained traction because it offers a middle path between grinding toward full financial independence and the standard \"work until 65\" plan, at a moment when burnout and career flexibility became bigger priorities for many workers. Unlike full FIRE, which for most households requires roughly 25 times their annual spending saved before quitting entirely, a Coast FIRE number is smaller and reachable years earlier, because it still counts on decades of compounding to finish the job.\n\nThe appeal is real optionality without an all-or-nothing bet. Someone who reaches Coast FIRE in their late 30s can downshift to a lower-stress, lower-paying job, take a sabbatical, or start a business with less financial pressure, while retirement stays on track in the background." },
      { heading: "How the Coast FIRE number is calculated", body: "The calculation starts with your retirement number, not your savings. Take your desired annual retirement spending and divide it by a safe withdrawal rate — commonly 4%, which implies a target of 25 times your annual spending. A $60,000-a-year retirement goal implies a $1,500,000 nest egg.\n\nThat retirement number is then discounted back to today using your years until retirement and your expected annual return. The result is your coast number: the amount you'd need invested right now, with zero more contributions, to compound into your full retirement number by your target age. If your current savings already meet or beat that coast number, you've reached Coast FIRE. If not, the gap tells you how much more you need before compounding alone can finish the job — see the [retirement calculator](/retirement/) for a full projection that includes your ongoing contributions." },
      { heading: "The trade-offs most Coast FIRE guides skip", body: "The biggest overlooked risk is health insurance, not investment returns. If your plan to \"coast\" involves leaving a job with employer-sponsored coverage, you need a real budget for individual coverage through the [Health Insurance Marketplace](https://www.healthcare.gov/) or a part-time job that includes benefits — premiums for a mid-tier marketplace plan can run several hundred dollars a month per person before any subsidy, which changes how much income you actually need while coasting.\n\nSequence-of-returns risk is the second trap. Coast FIRE assumes a smooth average return over many years, but a market downturn in the first few years after you stop contributing can shrink your compounding base, since there's no new money coming in to buy the dip. Someone who coasts right before a prolonged downturn may need to resume contributions or delay retirement to recover.\n\nA third, quieter risk: lifestyle creep on the money you free up. The whole point of reaching Coast FIRE is redirecting cash that used to go to retirement — if that money instead funds a bigger house payment or new debt, you've lost the flexibility Coast FIRE was supposed to buy you." },
      { heading: "Signs you're not actually ready to coast yet", body: "Being technically \"coast FIRE'd\" on a spreadsheet does not mean it's the right time to stop contributing. Watch for these first: high-interest debt above roughly 7-8% still on the books, which almost always beats the expected return on new retirement contributions; an emergency fund under three to six months of expenses, since coasting removes some income cushion if you also cut work hours; and no clear health-insurance plan if coasting means fewer hours or a job change.\n\nIt's also worth stress-testing your number with a lower expected return and a later retirement age. If your coast number only works at an optimistic 8-9% average return, a more conservative 5-6% assumption may show you're not quite there — run both in the [Coast FIRE calculator](/coast-fire/) before making a big income decision." },
      { heading: "How to coast without quitting cold turkey", body: "Most people who reach Coast FIRE don't announce it or dramatically change their life overnight. A gradual approach works better in practice: verify your number with conservative assumptions, then redirect what used to be retirement contributions toward a specific goal — debt payoff, a home down payment, a cash buffer — rather than letting it disappear into daily spending. Track the freed-up cash in a [budget](/budget/) so you can see exactly where it's going.\n\nCheck your coast number at least once a year, especially after a big market move, a raise, or a change in your target retirement age or spending goal — the calculation is sensitive to all three, and a number that worked at 35 may need revisiting at 40." },
    ],
    tools: [
      { href: "/coast-fire/", label: "Coast FIRE calculator" },
      { href: "/retirement/", label: "Retirement" },
      { href: "/net-worth/", label: "Net worth" },
      { href: "/budget/", label: "Budget" },
    ],
    faqs: [
      { question: "What is Coast FIRE?", answer: "Coast FIRE is the point where your current retirement savings, growing untouched at your expected return, will reach your full retirement number by your target retirement age without any more contributions. Once you're there, you can stop saving for retirement specifically and redirect that money elsewhere." },
      { question: "How is a Coast FIRE number different from a full FIRE number?", answer: "A full FIRE number is what you need to retire and start withdrawing today — commonly 25 times your annual spending. A Coast FIRE number is smaller: it's what you need invested today so that, given years of compounding before your actual retirement age, it grows into that full FIRE number by itself." },
      { question: "What return should I use to calculate my Coast FIRE number?", answer: "A common planning range for a diversified, stock-heavy portfolio is 6% to 8% annually. A lower rate is more conservative and raises how much you need saved today; a higher rate lowers it but assumes more investment risk. Test a few rates in the calculator to see how sensitive your result is." },
      { question: "Does reaching Coast FIRE mean I should quit my job?", answer: "Not necessarily. Reaching Coast FIRE means retirement is funded by growth alone — it doesn't cover your current living expenses, health insurance, or other savings goals. Most people who reach it keep working, often in a lower-stress or lower-paying role, rather than stopping income entirely." },
      { question: "What's the biggest risk with a Coast FIRE plan?", answer: "A market downturn shortly after you stop contributing is the biggest risk, since there's no new money to offset a loss and your remaining growth years may not fully recover the average return you assumed. Losing employer health coverage without a replacement budget is the second most common planning gap." },
    ],
    sources: [
      { label: "U.S. SEC Investor.gov — Retirement Planning", url: "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/retirement-planning" },
      { label: "HealthCare.gov — The Health Insurance Marketplace", url: "https://www.healthcare.gov/" },
      { label: "U.S. Department of Labor — Top 10 Ways to Prepare for Retirement", url: "https://www.dol.gov/sites/dolgov/files/ebsa/about-ebsa/our-activities/resource-center/publications/top-10-ways-to-prepare-for-retirement.pdf" },
    ],
  },

  {
    slug: "credit-card-cash-advance-guide",
    title: "Credit Card Cash Advances: Why They Cost So Much",
    metaDescription:
      "A credit card cash advance skips the grace period and charges a higher APR plus an upfront fee. See what it really costs and cheaper ways to get cash fast.",
    h1: "Credit Card Cash Advance: Why It Costs More Than You Think",
    cardBlurb: "Cash advance fees, interest, and credit-score effects — plus cheaper ways to get cash fast.",
    intro:
      "A credit card cash advance lets you withdraw cash against your card's credit limit, but it comes with an upfront fee, a higher interest rate than purchases, and no grace period — interest starts the moment the cash leaves the ATM. This guide breaks down the real cost, a common trap that catches people who don't realize they took one, and cheaper alternatives for getting cash fast.",
    sections: [
      { heading: "What actually counts as a cash advance", body: "A cash advance is any transaction your credit card issuer treats as cash rather than a purchase, and it includes more than ATM withdrawals. The category also covers cash-equivalent transactions: buying money orders, wiring money, purchasing casino chips or lottery tickets, and using convenience checks your issuer mails you.\n\nThe one most people miss: funding a peer-to-payment app like [Venmo](https://venmo.com/), [Cash App](https://cash.app/), or [PayPal](https://www.paypal.com/) with a credit card, then sending that money to yourself or someone else, is often coded by the issuer as a cash advance rather than a purchase — even though it doesn't feel like withdrawing cash. Check your card's terms for how it classifies these transfers before relying on your credit card to fund one, since the fee and interest hit the same way an ATM withdrawal would." },
      { heading: "The fees stack immediately", body: "Most issuers charge a cash advance fee the moment the transaction posts, typically a flat percentage of the amount — commonly around 3% to 5%, or a flat minimum of $10, whichever is larger. Unlike a purchase, this fee is charged regardless of whether you pay the balance off before your due date.\n\nA $300 ATM withdrawal at a 5% fee costs $15 immediately, before a single day of interest accrues. Check your specific cardholder agreement, since the fee percentage and minimum vary by issuer and even by card within the same issuer." },
      { heading: "Why the interest is worse than it looks", body: "A cash advance skips the purchase grace period entirely — interest starts accruing from the day of the transaction, not from your statement due date. Most cards also charge a separate, higher APR for cash advances than for purchases, often several percentage points above your purchase rate.\n\nBecause there's no grace period, even paying your statement in full every month won't stop cash-advance interest from accruing between the transaction date and your payment date. A balance carried for a full billing cycle costs meaningfully more than the same dollar amount charged as a purchase, once the fee and the extra interest are added together." },
      { heading: "How it affects your credit score", body: "A cash advance increases your credit utilization the same way a purchase does, because it adds to your card balance against your credit limit. Utilization — the ratio of what you owe to your total available credit — is one of the larger factors in most credit scoring models, so a large cash advance can lower your score even if you plan to pay it off quickly, simply because of the timing between when it posts and when your payment reports.\n\nMost cards also have a separate, lower cash advance sub-limit than your total credit limit, so maxing out that sub-limit can push your utilization on that card higher than the balance alone suggests." },
      { heading: "Cheaper ways to get cash fast", body: "A cash advance should usually be a last resort, not a first option, because of the immediate fee and grace-period-free interest. A personal loan from a bank or credit union, even at a double-digit rate, is often cheaper once you account for the cash advance's upfront fee plus its higher APR, since the personal loan's interest is simpler and the rate is usually lower.\n\nOther options worth checking first: a 0% intro APR card used for a purchase you'd otherwise pay cash for, which frees up existing cash instead; an employer paycheck-advance program; a credit union payday-alternative loan, capped by federal credit union rules at a much lower cost than a payday loan; or asking family for a short-term, interest-free loan. Compare the real dollar cost of each option in our [budget calculator](/budget/) before deciding." },
      { heading: "If you already took one, minimize the damage", body: "Pay off a cash advance balance before your statement closes if at all possible, since interest is calculated daily from the transaction date with no grace period — every extra day carries a cost. Check your card's specific cash advance APR in your cardholder agreement or online account; it's often listed separately from your purchase APR and can be several points higher.\n\nIf you're carrying multiple balances, most issuers apply any payment above the minimum to the highest-APR balance first — since cash advance APR is usually the highest rate on the card, that works in your favor once you're paying more than the minimum." },
    ],
    tools: [
      { href: "/budget/", label: "Budget" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "What is a credit card cash advance?", answer: "A credit card cash advance is a transaction your issuer treats as cash rather than a purchase — most commonly an ATM withdrawal, but also convenience checks, money orders, wire transfers, and sometimes funding a peer-to-payment app. It carries an upfront fee and a higher interest rate than regular purchases, with interest starting immediately." },
      { question: "How much does a cash advance cost?", answer: "Most issuers charge an upfront fee of around 3% to 5% of the amount, or a flat $10 minimum, whichever is larger — plus a separate, usually higher APR that starts accruing interest immediately, with no grace period. Check your cardholder agreement for your card's exact numbers, since they vary by issuer." },
      { question: "Does a cash advance hurt your credit score?", answer: "It can, mainly by raising your credit utilization the same way any added balance does. Cash advances also often have a lower sub-limit than your total credit line, so a large one can push utilization on that specific card higher than the dollar amount alone suggests." },
      { question: "Is sending money through a payment app the same as a cash advance?", answer: "It can be. Funding Venmo, Cash App, or PayPal with a credit card is frequently coded by the issuer as a cash advance, not a purchase, which triggers the same upfront fee and immediate interest. Check your card's terms before relying on a credit card to fund a transfer." },
      { question: "What's a cheaper alternative to a credit card cash advance?", answer: "A personal loan from a bank or credit union is usually cheaper once you factor in the cash advance's upfront fee and higher, grace-period-free APR. A credit union payday-alternative loan is capped at a lower cost than a payday loan and is designed for exactly this kind of short-term cash need." },
    ],
    sources: [
      { label: "CFPB — Credit Cards", url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/" },
      { label: "CFPB — Submit a Complaint", url: "https://www.consumerfinance.gov/complaint/" },
    ],
  },

  {
    slug: "credit-card-perks-worth-it",
    title: "Which Credit Card Perks Are Actually Worth It?",
    metaDescription:
      "Zero fraud liability, free credit scores, metal cards — many credit card perks are now standard. See which ones matter and which are just marketing.",
    h1: "Credit Card Perks: Which Ones Are Actually Worth Paying For?",
    cardBlurb: "Most \"premium\" credit card perks are now standard across nearly every card — here's how to tell real value from marketing.",
    intro:
      "Many credit card perks marketed as premium benefits — zero fraud liability, a free credit score, contactless pay, a metal card — are now standard across nearly every major card, not a special reason to choose one card over another or pay an annual fee. This guide breaks down which perks are genuinely valuable, which are baseline features every issuer now offers, and how to actually calculate whether an annual-fee card pays for itself.",
    sections: [
      { heading: "Some \"perks\" are network rules, not card benefits", body: "Zero fraud liability for unauthorized charges is not a special benefit any single card offers — it's a baseline protection required by the major card networks ([Visa](https://www.visa.com/), [Mastercard](https://www.mastercard.com/), [American Express](https://www.americanexpress.com/), and [Discover](https://www.discover.com/)) on essentially every consumer credit card. The same is largely true of contactless tap-to-pay, which became a standard feature across nearly all new cards once issuers rolled out chip-and-contactless technology under the [EMV](https://www.emvco.com/) standard industry-wide.\n\nWhen a card's marketing highlights these as reasons to choose it, treat that as a sign the card may not have a genuinely differentiated benefit worth an annual fee — you likely already have the same protection on the free card in your wallet." },
      { heading: "Free features that sound premium but cost the issuer nothing", body: "A free credit score, a mobile app, and 24/7 customer service are now offered by nearly every issuer, including no-annual-fee cards, because the marginal cost of adding them is low and they're inexpensive credibility signals in card marketing. None of these should factor into a decision between two cards unless one issuer's app or support is meaningfully worse in practice — check recent reviews, not the feature list, before assuming a real difference exists.\n\nPorch piracy protection and instant card lock in an app fall into the same category for most major issuers today — useful, but not a reason to pay more. So is no over-limit fee: since the [CARD Act of 2009](https://www.congress.gov/bill/111th-congress/house-bill/627) requires issuers to get your consent before allowing an over-limit transaction at all, most simply decline the charge instead, which makes an \"over-limit fee\" a rare thing to be charged regardless of which card you carry.\n\nNo foreign transaction fee is the one exception worth actually comparing — it's genuinely not universal. Many no-annual-fee cards still charge 1% to 3% on purchases made abroad or with a foreign merchant, so if you travel internationally, confirm this specific term rather than assuming your card is fee-free; it's one of the few \"perks\" on this list that still meaningfully separates cards." },
      { heading: "The metal card myth", body: "A metal card's weight has no connection to any benefit — it is a manufacturing choice, not an indicator of rewards value, credit limit, or approval odds. Issuers use metal construction largely as a status signal, because a heavier card feels more premium when you hand it over, even though the material adds no functional value to what the card does.\n\nSome metal cards do carry genuinely strong rewards or travel benefits, but that value comes from the card's specific program, not from the card being metal. Evaluate the rewards rate, redemption value, and included benefits on their own merits, independent of what the card is made of." },
      { heading: "How to actually judge whether an annual-fee card is worth it", body: "The only reliable test is a breakeven calculation: add up the dollar value you'll realistically use from a card's fee-only benefits — travel credits, lounge access, an annual statement credit, an elevated rewards rate on your actual spending categories — and compare that total to the annual fee. A card advertising $500 in \"benefits value\" is only worth the fee if you will actually use enough of those specific credits; a travel credit you never redeem or a lounge you never visit contributes $0 to your real breakeven.\n\nBe honest about your actual spending pattern, not an idealized one. A card that rewards 4x points on dining only beats a flat 2% cash-back card if your real dining spending is high enough to make up the gap after the annual fee — run your last three months of statements through the [budget calculator](/budget/) to see your real category totals before assuming a premium card pays off." },
      { heading: "No-annual-fee cards already cover most people's needs", body: "For most cardholders, a strong no-annual-fee card with baseline fraud protection, a reasonable flat cash-back rate, and a mobile app already covers the majority of what a \"premium\" card offers, minus the fee. An annual-fee card only clears the bar when its specific, differentiated benefits — not the now-standard baseline features — add up to more than what you're paying for it every single year, not just the year you signed up for a welcome bonus." },
    ],
    tools: [
      { href: "/budget/", label: "Budget" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "Is zero fraud liability a real perk?", answer: "It's protection you almost certainly already have. Zero liability for unauthorized charges is required by the major card networks on nearly all consumer credit cards, not a special benefit unique to any one card. Don't let it be the deciding factor between two cards." },
      { question: "Are metal credit cards actually better?", answer: "Not because they're metal. A card's material has no effect on its rewards rate, credit limit, or benefits — it's a manufacturing and marketing choice. Some metal cards do have strong rewards programs, but evaluate that program on its own, separate from the card's weight." },
      { question: "How do I know if an annual-fee card is worth paying for?", answer: "Add up the realistic dollar value of the benefits you'll actually use — not the advertised maximum — and compare that total to the annual fee every year. If you won't actually redeem a travel credit or use a lounge, it doesn't count toward your breakeven." },
      { question: "Do all credit cards offer a free credit score now?", answer: "Most major issuers offer some form of free credit score access today, including no-annual-fee cards, so it shouldn't be a deciding factor between two specific cards. Compare the actual rewards rate and fees instead." },
      { question: "What credit card benefits are actually worth paying an annual fee for?", answer: "Benefits tied to your real, recurring spending — a travel credit you'll definitely use, airport lounge access if you fly often, or an elevated rewards rate in a category you spend heavily in — are the ones worth paying for. Baseline features like fraud protection, a mobile app, and contactless pay are not, since you likely get them for free elsewhere." },
    ],
    sources: [
      { label: "CFPB — Credit Cards", url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/" },
    ],
  },

  {
    slug: "credit-score-for-0-apr-credit-card",
    title: "What Credit Score Do You Need for a 0% APR Card?",
    metaDescription:
      "0% intro APR cards generally need good-to-excellent credit, but income matters too. See the score range to expect and the deferred-interest trap to avoid.",
    h1: "What Credit Score Do You Need for a 0% APR Credit Card?",
    cardBlurb: "Score ranges, what issuers actually check beyond your score, and the deferred-interest trap that isn't the same as true 0% APR.",
    intro:
      "A 0% intro APR credit card typically requires good to excellent credit — commonly a [FICO Score](https://www.myfico.com/credit-education/credit-scores) around 690 or higher — though your income, existing credit utilization, and recent credit inquiries matter almost as much as the score itself. This guide covers what issuers actually evaluate, realistic approval odds by score range, and a costly trap — deferred interest — that isn't the same thing as a true 0% intro APR offer.",
    sections: [
      { heading: "What \"0% intro APR\" actually means", body: "A 0% intro APR offer charges no interest on purchases, balance transfers, or both, for a set introductory period — commonly 12 to 21 months — after which the rate jumps to the card's standard variable APR on any remaining balance. Balance transfer offers almost always carry a separate transfer fee, typically 3% to 5% of the amount moved, charged upfront even though the interest itself is 0%.\n\nOnce the intro period ends, interest applies going forward on your remaining balance at the standard rate — it does not retroactively charge you for the intro period, as long as the card is a true 0% intro APR offer and not a deferred-interest offer." },
      { heading: "The score range issuers typically look for", body: "Issuers generally reserve 0% intro APR cards for applicants in the good-to-excellent FICO Score range, commonly cited as 690 and above, with the most competitive offers — the longest 0% periods, no annual fee — going to scores closer to 720 and up. A score in the fair range, roughly 580-669, makes approval for a 0% intro card unlikely, though secured cards and cards built for building credit remain available at that range.\n\nThese ranges are general guidance, not a guarantee — individual issuers set their own underwriting criteria and can approve or deny outside these typical bands." },
      { heading: "Your score isn't the only thing issuers check", body: "Income and existing debt matter as much as your score for a 0% intro APR approval, because issuers are extending a meaningful line of interest-free credit and want evidence you can repay it. A high score paired with high existing credit card utilization, a recent string of new-account inquiries, or a debt-to-income ratio that looks stretched can still result in a denial or a lower starting credit limit than expected.\n\nRecent applications matter too: opening several new cards in a short window can flag as risk to an issuer's underwriting model, independent of your score. Space out applications and pay down revolving balances before applying if your score is borderline." },
      { heading: "The deferred-interest trap: not the same as 0% APR", body: "A deferred-interest offer — common on store and retail cards — looks identical to a true 0% intro APR offer at checkout, but works very differently: if any balance remains unpaid when the promotional period ends, the issuer charges interest retroactively on the entire original purchase amount, back to the purchase date, not just on the remaining balance. A true 0% intro APR card only charges interest going forward on whatever balance is left.\n\nAlways read the specific terms before assuming an offer is true 0% APR — look for the words \"deferred interest\" in the disclosure, and if it's a deferred-interest offer, pay the full balance before the promotional period ends or you risk owing interest on the original purchase price in one lump sum." },
      { heading: "How to improve your approval odds", body: "Pay down existing card balances before applying, since utilization has an outsized effect on your score in the weeks before a new application. Avoid opening other new credit accounts in the months leading up to your application, since recent inquiries and new accounts can both lower your score and signal risk to underwriting.\n\nIf your score is borderline, consider applying with an issuer where you already have a strong banking relationship, since some issuers weigh existing account history favorably. Building a [budget](/budget/) that shows you can comfortably make more than the minimum payment also puts you in a stronger position if the issuer does a manual review." },
    ],
    tools: [
      { href: "/budget/", label: "Budget" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "What credit score do I need for a 0% APR credit card?", answer: "Most issuers reserve 0% intro APR cards for good-to-excellent credit, commonly a FICO Score of about 690 or higher, with the strongest offers going to scores near 720 and up. Income and existing debt also factor into approval, so a qualifying score alone doesn't guarantee approval." },
      { question: "Can I get a 0% APR card with fair credit?", answer: "It's unlikely for a standard 0% intro APR card, since issuers generally reserve those offers for good-to-excellent credit. If your score is in the fair range, focus on cards built for building credit first, then apply for a 0% intro offer once your score improves." },
      { question: "What's the difference between 0% intro APR and deferred interest?", answer: "A true 0% intro APR card charges interest only on whatever balance remains after the promotional period ends. A deferred-interest offer charges interest retroactively on the entire original purchase if any balance is left when the period ends — read the offer terms carefully to know which one you have." },
      { question: "Does a 0% APR balance transfer card have any fees?", answer: "Almost always, yes. Even though the interest rate is 0%, balance transfer offers typically charge an upfront fee of 3% to 5% of the transferred amount, charged at the time of the transfer regardless of the 0% rate." },
      { question: "Will applying for a 0% APR card hurt my credit score?", answer: "A single application typically causes a small, temporary dip from the hard inquiry, and a new account can slightly lower your average account age. For most people planning to pay down debt interest-free, the short-term dip is outweighed by the interest saved, as long as you avoid applying for several cards at once." },
    ],
    sources: [
      { label: "myFICO — Credit Score Education", url: "https://www.myfico.com/credit-education/credit-scores" },
      { label: "CFPB — Credit Cards", url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/" },
    ],
  },

  {
    slug: "401k-beneficiary-rules",
    title: "What Happens to a 401(k) When You Die: Beneficiary Rules",
    metaDescription:
      "401(k) beneficiary rules explained: the SECURE Act 10-year rule for non-spouse heirs, the spousal rollover option, and how taxes work on an inherited 401(k).",
    h1: "What Happens to a 401(k) When You Die: Beneficiary Rules and Taxes",
    cardBlurb: "Who inherits your 401(k), the SECURE Act's 10-year rule, and how taxes work for the beneficiary.",
    intro:
      "When you die with money in a 401(k), the account passes directly to whoever you named as beneficiary — bypassing your will entirely — and how quickly they must withdraw it, and how much tax they owe, depends on their relationship to you. This guide covers the spousal rollover option, the 10-year rule most other beneficiaries face, and the taxes and deadlines a beneficiary needs to know. Already received the funds and wondering what to do next? See our [what to do with an inheritance](/guides/what-to-do-with-an-inheritance/) guide for the full decision order.",
    sections: [
      { heading: "Your 401(k) passes by beneficiary designation, not your will", body: "A 401(k) account transfers to whoever you named on your beneficiary designation form, regardless of what your will says — this is one of the most common estate-planning mistakes, since people update their will but forget the separate form on file with their plan administrator. If no beneficiary is on file, the account typically passes according to the plan's default order, often the estate itself, which can trigger a slower, more expensive probate process and worse tax outcomes.\n\nReview your beneficiary designations any time your life changes — marriage, divorce, a new child, or a beneficiary's death — since the form on file controls, not your will or any verbal wishes. See our [estate planning calculator](/estate-planning/) for how beneficiary designations fit into your broader plan." },
      { heading: "If your spouse is the beneficiary", body: "A surviving spouse has the most flexibility of any 401(k) beneficiary. They can roll the inherited 401(k) into their own IRA or 401(k), treating it as if it were their own account — which means using their own life expectancy for future required withdrawals and, if they're not yet 59½, potentially delaying withdrawals longer than a non-spouse beneficiary could.\n\nAlternatively, a spouse can keep the account as an inherited (beneficiary) account rather than rolling it over, which can matter if they're under 59½ and might need penalty-free access to the funds before that age — inherited-account withdrawals avoid the 10% early-withdrawal penalty that would normally apply to their own accounts." },
      { heading: "The SECURE Act's 10-year rule for most other beneficiaries", body: "Most non-spouse beneficiaries — adult children, other relatives, friends — must empty an inherited 401(k) within 10 years of the original owner's death, under the [SECURE Act](https://www.congress.gov/bill/116th-congress/house-bill/1994), passed in 2019. This replaced the older \"stretch\" rule that let beneficiaries spread withdrawals over their own life expectancy, often for decades.\n\nA detail many beneficiaries miss: if the original account owner had already started their required minimum distributions before death, the [IRS](https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds) generally also requires the beneficiary to take annual withdrawals during the 10-year window, not just one lump sum at the end. Missing a required annual withdrawal can trigger an IRS excise tax on the amount that should have been withdrawn, so beneficiaries in this situation should confirm the exact requirement with the plan administrator or a tax professional early, not in year nine." },
      { heading: "Who still gets the longer \"stretch\" option", body: "A small group of beneficiaries, called eligible designated beneficiaries, can still stretch withdrawals over their own life expectancy instead of the 10-year rule: a surviving spouse, a minor child of the account owner (until they reach the age of majority, at which point the 10-year clock starts), a beneficiary who is disabled or chronically ill under the IRS's definition, and a beneficiary who is not more than 10 years younger than the original owner.\n\nThis distinction matters most for a young beneficiary who could otherwise stretch withdrawals — and their tax bill — over many decades rather than compressing them into a single 10-year window." },
      { heading: "How taxes work on an inherited 401(k)", body: "Withdrawals from an inherited traditional 401(k) are taxed as ordinary income to the beneficiary in the year they're taken, the same as they would have been for the original owner. A beneficiary in a high tax bracket who takes a large lump-sum withdrawal in one year can push themselves into an even higher bracket for that year, so spreading withdrawals across the 10-year window — rather than waiting until year 10 to take everything at once — often reduces the total tax bill.\n\nAn inherited Roth 401(k) works differently: qualified withdrawals are generally tax-free to the beneficiary, since the original owner already paid tax on the contributions. The same 10-year (or life-expectancy, for eligible designated beneficiaries) withdrawal timeline still applies, even though the money itself isn't taxed on the way out." },
      { heading: "What a beneficiary needs to do", body: "Contact the plan administrator directly and provide a certified death certificate to begin the claims process — the administrator, not the beneficiary's own bank, handles the actual transfer. The beneficiary then chooses how to receive the funds within the plan's and the IRS's rules: a lump sum, a rollover into an inherited IRA that preserves the tax-deferred status while the 10-year or life-expectancy clock runs, or scheduled withdrawals.\n\nMark the 10-year deadline (or the annual withdrawal requirement, if it applies) on a calendar immediately — the IRS excise tax for missing a required withdrawal is a real, avoidable cost, and plan administrators do not always send reminders as the deadline approaches." },
      { heading: "Tips for account owners naming a beneficiary", body: "Always name a contingent (backup) beneficiary, not just a primary one — if your primary beneficiary has already died and no contingent is on file, the account can default to your estate, dragging it into probate and losing the direct-transfer tax treatment described above. Never leave the beneficiary field blank or write \"my estate\" on purpose; naming an individual almost always produces a better outcome for them.\n\nNaming a trust as beneficiary is sometimes useful — for a minor child who can't legally receive a large lump sum, or a special-needs dependent who could lose means-tested benefits if they inherit directly — but it's a specialist drafting job. A poorly drafted trust beneficiary designation can accidentally force a faster payout than the 10-year rule would otherwise allow. Coordinate any trust-as-beneficiary decision with your [estate planning](/estate-planning/) documents, not the 401(k) form in isolation." },
    ],
    tools: [
      { href: "/estate-planning/", label: "Estate planning" },
      { href: "/retirement/", label: "Retirement" },
      { href: "/estate-planning/estate-tax-calculator/", label: "Estate tax" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "Does a 401(k) go through probate when the owner dies?", answer: "No, not if a valid beneficiary is named. A 401(k) passes directly to the named beneficiary outside of probate and outside of what the will says. It only enters probate if no beneficiary was named or the named beneficiary has already died with no contingent beneficiary on file." },
      { question: "What is the SECURE Act 10-year rule?", answer: "It requires most non-spouse beneficiaries of an inherited 401(k) to withdraw the entire balance within 10 years of the original owner's death, replacing the older rule that let beneficiaries stretch withdrawals over their own lifetime. A surviving spouse, a minor child, and a disabled or chronically ill beneficiary are among those exempt from the 10-year rule." },
      { question: "Do I have to pay taxes on an inherited 401(k)?", answer: "Withdrawals from an inherited traditional 401(k) are taxed as ordinary income in the year you take them. An inherited Roth 401(k)'s qualified withdrawals are generally tax-free, since the original owner already paid tax on those contributions, though the same withdrawal timeline still applies." },
      { question: "Can a spouse roll over an inherited 401(k) into their own account?", answer: "Yes. A surviving spouse can roll an inherited 401(k) into their own IRA or 401(k) and treat it as their own, which uses their own life expectancy for future required withdrawals. This option is not available to a non-spouse beneficiary." },
      { question: "What happens if a 401(k) has no beneficiary named?", answer: "The account typically passes according to the plan's default order, which is often the deceased owner's estate. That usually means the money goes through probate and can lose favorable tax-deferral options a named individual beneficiary would have had — naming a beneficiary avoids this." },
    ],
    sources: [
      { label: "IRS — Retirement Plans", url: "https://www.irs.gov/retirement-plans" },
      { label: "IRS — Retirement Topics: Required Minimum Distributions (RMDs)", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds" },
      { label: "Congress.gov — Setting Every Community Up for Retirement Enhancement Act of 2019 (H.R. 1994)", url: "https://www.congress.gov/bill/116th-congress/house-bill/1994" },
    ],
  },

  {
    slug: "529-investment-strategy-by-age",
    title: "529 Investment Strategy by Age: Age-Based vs Static",
    metaDescription:
      "Compare age-based (glide path) and static 529 investment options, see example allocations by age, and learn the rule that limits how often you can switch.",
    h1: "529 Investment Strategy by Age: Age-Based vs. Static Portfolios",
    cardBlurb: "How age-based glide-path portfolios work, when a static option makes more sense, and the twice-a-year rule on switching.",
    intro:
      "Most 529 college savings plans offer two ways to invest: an age-based portfolio that automatically shifts from stocks to bonds as your child nears college, or a static portfolio with a fixed allocation you manage yourself — and the right choice depends mostly on how hands-on you want to be and how many years remain until enrollment. This guide compares both, shows example age-based allocations, and covers a federal rule that limits how often you can change your investment choice.",
    sections: [
      { heading: "What a 529 plan actually is, briefly", body: "A 529 plan is a state-sponsored, tax-advantaged account for education savings: contributions grow tax-free, and withdrawals are tax-free when used for qualified education expenses like tuition, fees, and room and board. Every state offers at least one 529 plan, and you're not required to use your own state's plan, though some states offer a state income tax deduction only for contributions to their own plan. Use our [529 savings calculator](/529-savings-calculator/) to project your own balance and funding gap." },
      { heading: "How an age-based (glide path) portfolio works", body: "An age-based portfolio automatically shifts its mix of stocks and bonds as your child gets closer to college, starting more aggressive — a higher stock allocation — when they're young and gradually moving toward more conservative, bond-and-cash-heavy holdings as enrollment approaches. This \"glide path\" design mirrors a target-date retirement fund, aiming to capture growth early while protecting the balance from a market downturn right before you need to spend it.\n\nMost plans offer more than one glide path track — commonly an aggressive, moderate, and conservative version — so you can choose how quickly the portfolio de-risks even within the age-based option." },
      { heading: "Example age-based allocations by age", body: "While exact allocations vary by plan provider, a typical moderate age-based glide path might look roughly like this: around 90% stocks / 10% bonds for a newborn to age 5, shifting to around 70% stocks / 30% bonds by ages 6-10, roughly 50/50 by ages 11-14, and increasingly conservative — often 20% stocks or less, with the rest in bonds and cash — by the last one to two years before enrollment.\n\nThese figures are illustrative, not a specific plan's actual allocation — check your plan's official glide path schedule, since providers differ meaningfully in how aggressive or conservative each age band is." },
      { heading: "What a static 529 portfolio is", body: "A static (or \"individual fund\") 529 option keeps a fixed asset allocation that does not automatically change as your child ages — you choose the mix yourself from the plan's fund menu, similar to picking your own funds in a 401(k), and you're responsible for manually shifting toward more conservative holdings as college approaches if you want that protection.\n\nA static option makes the most sense if you want direct control over the allocation, have a specific risk tolerance the plan's age-based tracks don't match, or are already comfortable managing your own portfolio rebalancing on a schedule." },
      { heading: "How to compare 529 plan options", body: "Compare 529 plans on total expense ratio first, since a seemingly small annual fee difference compounds meaningfully over 18 years of growth — a 0.20% expense ratio versus a 1.00% expense ratio can mean tens of thousands of dollars of difference on a large balance over that time. Also check whether your own state offers a state income tax deduction or credit for contributions, since that can outweigh a slightly higher expense ratio in an out-of-state plan for many families.\n\nLook at the specific glide path schedule — how aggressive or conservative it is at each age — rather than just the plan's overall brand or state, since two age-based options can differ significantly in how much stock exposure they carry in a child's final pre-college years." },
      { heading: "Is an age-based or static strategy right for you?", body: "An age-based portfolio fits most families well, because it automatically manages the single biggest 529 investing risk — being too aggressively invested in stocks right before you need the money for tuition — without requiring you to remember to rebalance it yourself. A static portfolio fits families who want more control, have a specific allocation preference, or are already actively managing other investment accounts and want consistency across all of them.\n\nOne rule applies no matter which you choose: the [IRS](https://www.irs.gov/taxtopics/tc313) and most plans limit you to changing your investment option twice per calendar year, or anytime you also change the account's beneficiary. An age-based portfolio's automatic adjustments are valuable specifically because they don't count against that limit — the plan handles the shift for you without using one of your two changes." },
    ],
    tools: [
      { href: "/529-savings-calculator/", label: "529 savings calculator" },
      { href: "/guides/529-qualified-expenses/", label: "529 qualified expenses" },
      { href: "/guides/529-leftover-money-options/", label: "529 leftover money" },
    ],
    faqs: [
      { question: "What's the difference between an age-based and static 529 portfolio?", answer: "An age-based portfolio automatically shifts from stocks to bonds as your child nears college, without you doing anything. A static portfolio keeps a fixed allocation you choose and manage yourself, and you have to manually adjust it if you want it to become more conservative over time." },
      { question: "How many times can I change my 529 investment option?", answer: "Federal rules generally limit you to changing your 529 investment option twice per calendar year, or anytime you also change the account's beneficiary. An age-based portfolio's automatic shifts don't count against this limit, since the plan — not you — is making the change." },
      { question: "Is an age-based 529 portfolio too conservative if I start saving late?", answer: "It depends on the specific track. Most plans offer aggressive, moderate, and conservative age-based options, so a family starting late can choose a more aggressive track within the age-based system rather than switching to a fully static option, though a static allocation gives the most direct control if the age-based tracks don't fit your risk tolerance." },
      { question: "Does it matter which state's 529 plan I use?", answer: "You can use nearly any state's 529 plan regardless of where you live, but check your own state's rules first — many states offer a state income tax deduction only for contributions to their own plan, which can be worth more than a lower expense ratio elsewhere for some families." },
      { question: "Should I move my 529 to cash right before college?", answer: "Most age-based portfolios already shift toward cash and bonds in the final year or two before enrollment, which reduces the risk of a market drop right when you need the money. If you're in a static portfolio, consider manually reducing stock exposure as enrollment nears rather than waiting until the year you need to withdraw." },
    ],
    sources: [
      { label: "SEC Investor.gov — An Introduction to 529 Plans", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/529-plans" },
      { label: "IRS — Topic No. 313, Qualified Tuition Programs (529 plans)", url: "https://www.irs.gov/taxtopics/tc313" },
    ],
  },

  {
    slug: "real-estate-investment-options",
    title: "Real Estate Investment Options: 5 Ways to Invest",
    metaDescription:
      "Real estate investment options beyond being a landlord: short-term rentals, flipping, REITs, and crowdfunding — with the tax and liquidity tradeoffs of each.",
    h1: "Real Estate Investment Options: 5 Ways to Invest in Real Estate Without Just Being a Landlord",
    cardBlurb: "Landlording, short-term rentals, flipping, REITs, and crowdfunding — the tax and liquidity tradeoffs of each.",
    intro:
      "Real estate investment options go far beyond buying a rental house and finding tenants. Being a landlord is one path, but short-term rentals, house flipping, REITs, and real estate crowdfunding all let you invest in property with very different amounts of cash, time, and risk. This guide compares all five, including the tax rules and liquidity tradeoffs most overviews skip, so you can pick the option that actually fits your money and your schedule.",
    sections: [
      { heading: "Option 1: Being a landlord", body: "Being a landlord means buying a property and renting it out for monthly income, the most hands-on option on this list. You collect rent, pay the mortgage, taxes, and insurance, and keep what's left as cash flow, while tenants slowly pay down your loan and build your equity. The [IRS](https://www.irs.gov/publications/p527) also lets you depreciate the building over 27.5 years, which can shelter real rental income from tax on paper.\n\nThe tradeoff is real, ongoing work: tenant screening, repairs, vacancies, and the occasional late-night maintenance call, unless you pay a property manager 8% to 12% of rent to handle it. Landlording rewards people who run the numbers before they buy, not just people who like the idea of owning property.\n\nModernWallet already covers this option in depth. Run your own numbers with our [rental cash flow calculator](/real-estate/cash-flow-calculator/) and [cap rate calculator](/real-estate/cap-rate-calculator/) before you make an offer — a property with negative cash flow is a bet on appreciation, not an investment that pays you today." },
      { heading: "Option 2: Running a short-term rental", body: "A short-term rental is a home or spare room you rent out by the night instead of by the year, most often through [Airbnb](https://www.airbnb.com/) or a similar booking platform. It can earn more per night than a long-term lease in tourist or event-driven markets, but it also adds turnover cleaning, guest messaging, and dynamic pricing that a long-term rental never requires.\n\nMost overviews skip the two traps that catch new hosts. First, many cities and HOAs now require a short-term rental permit, cap the nights you can rent per year, or ban them outright in certain zones — check your local ordinance before you list a property, not after. Second, the tax treatment can shift: rental income is usually reported on Schedule E and isn't subject to self-employment tax, but a short-term rental that provides hotel-like services (daily cleaning, breakfast, concierge) can be treated as a trade or business, taxed on Schedule C and hit with self-employment tax on top of income tax.\n\nModel the income side with our [Airbnb income calculator](/real-estate/airbnb-calculator/), then confirm the local rules and likely tax treatment before you commit a property to short-term use." },
      { heading: "Option 3: Flipping houses", body: "Flipping a house means buying a property below market value, renovating it, and reselling it quickly for a profit, usually within months rather than years. Experienced flippers often use the 70% rule as a first screen: pay no more than 70% of a property's after-repair value, minus your estimated repair costs, to leave margin for the unexpected.\n\nThe tax trap is the part most guides skip. Sell within a year and the profit is taxed as a short-term capital gain at your ordinary income tax rate, not the lower long-term rate — [IRS Topic No. 409](https://www.irs.gov/taxtopics/tc409) covers the distinction. Flip houses often enough and the IRS may classify you as a real estate dealer rather than an investor, which adds self-employment tax on top of that and blocks a 1031 like-kind exchange, a tool that only applies to investment property, not inventory you're actively selling.\n\nFlipping can pay well, but it's the most active, most tax-exposed option on this list — closer to running a small business than making a passive investment." },
      { heading: "Option 4: REITs (real estate investment trusts)", body: "A REIT, or real estate investment trust, is a company that owns income-producing property and must pay out most of its profit as dividends, so you get real estate exposure just by buying a share the same way you'd buy a stock. The [SEC](https://www.investor.gov/introduction-investing/investing-basics/investment-products/real-estate-investment-trusts-reits) explains that publicly traded REITs trade on major exchanges and can be bought or sold on any trading day, while non-traded REITs are illiquid and can restrict how much you're allowed to redeem in a given period.\n\nThe tax tradeoff is the piece most beginners miss. Because a REIT avoids corporate income tax by distributing at least 90% of its taxable income, most REIT dividends are taxed to you as ordinary income instead of at the lower qualified-dividend rate — though the IRS does let individuals deduct up to 20% of that ordinary REIT dividend income, which softens the gap for many investors.\n\nA REIT gives you real estate exposure with stock-market liquidity and zero landlord duties, the most passive option on this list — but you give up the direct control, leverage, and depreciation benefits that come with owning property outright." },
      { heading: "Option 5: Real estate crowdfunding", body: "Real estate crowdfunding lets you invest smaller amounts alongside other investors in a specific property or fund through an online platform, instead of buying a whole property yourself. Not every platform is open to every investor, and that distinction matters more than the marketing suggests.\n\nPlatforms raising money through [Regulation Crowdfunding](https://www.sec.gov/resources-for-investors/investor-alerts-bulletins/ib_crowdfunding) (Reg CF) must open the offering to non-accredited investors too, though the SEC caps how much a non-accredited investor can put in over a 12-month period based on their income and net worth. Platforms raising money under [Regulation D](https://www.sec.gov/education/capitalraising/building-blocks/exempt-offerings-regulation-d) are usually restricted to accredited investors — generally, individual income over $200,000 (or $300,000 with a spouse) in each of the last two years, or a net worth over $1 million excluding your primary residence.\n\nCheck which exemption a platform is using before you fund an account, since it determines both who can invest and how much disclosure you're entitled to see. Crowdfunding sits between a REIT and a direct rental purchase: less liquid than a REIT, but far less work than owning and managing a property yourself." },
      { heading: "The bottom line: how the 5 options compare", body: "The five real estate investment options trade off liquidity, active work, and tax complexity in a fairly predictable pattern. Being a landlord and flipping houses demand the most hands-on time and the most tax complexity, but they also offer the most control and, for landlording, the steadiest long-run cash flow. A short-term rental sits in between: less commitment than a long-term rental, but real day-to-day management and a local-ordinance risk unique to this option.\n\nREITs and real estate crowdfunding sit at the more passive end. A REIT is the most liquid of the five — you can sell in seconds during market hours — while crowdfunding is less liquid but often lets you target a specific property or strategy a broad REIT fund wouldn't.\n\nThere's no single best answer. Want real estate exposure with no landlord duties and full liquidity? A REIT is the simplest starting point. Have more time than capital and want control over one property? Landlording or a short-term rental fits better. Want to test the waters with a small amount first? Crowdfunding is the middle ground. Whichever you choose, check your own [net worth](/net-worth/) first, since your real estate allocation should scale with what you can actually afford to tie up or lose." },
    ],
    tools: [
      { href: "/real-estate/cash-flow-calculator/", label: "Rental cash flow" },
      { href: "/real-estate/cap-rate-calculator/", label: "Cap rate" },
      { href: "/real-estate/airbnb-calculator/", label: "Airbnb income" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "What's the easiest real estate investment for beginners?", answer: "For most beginners, a publicly traded REIT is the easiest option because it requires no property management, trades like a stock, and can be bought with any amount of money. Being a landlord or flipping houses both require far more capital, time, and tax planning to do well." },
      { question: "Are REITs a good investment?", answer: "REITs can be a good investment for hands-off real estate exposure, since the SEC requires them to distribute at least 90% of taxable income as dividends. Most of that income is taxed as ordinary income rather than at lower qualified-dividend rates, though a deduction on ordinary REIT dividends softens that gap for many investors." },
      { question: "How much money do I need to start real estate crowdfunding?", answer: "It depends on the platform and which SEC exemption it uses. Platforms using Regulation Crowdfunding are open to non-accredited investors with online investment limits based on income and net worth, while platforms restricted to accredited investors require you to meet the SEC's income or net worth thresholds first." },
      { question: "Is house flipping profit taxed as ordinary income?", answer: "Yes, if you hold the property for a year or less, the profit is taxed as a short-term capital gain at your ordinary income tax rate. Flip houses often enough and the IRS may also classify you as a dealer, adding self-employment tax on top and blocking access to a 1031 exchange." },
      { question: "Do I need a permit to run a short-term rental?", answer: "Often yes. Many cities and homeowner associations require a permit, cap the nights you can rent per year, or restrict short-term rentals to certain zones entirely. Check your local ordinance before you list a property, since rules vary widely even between neighboring cities." },
      { question: "Which real estate investment option has the best returns?", answer: "There's no single option with the best returns for everyone; it depends on the leverage, work, and risk you're willing to take on. Flipping and landlording can post the highest returns because of leverage and active management, but REITs and crowdfunding trade some upside for far less time, work, and concentration risk." },
    ],
    sources: [
      { label: "SEC Investor.gov — Real Estate Investment Trusts (REITs)", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/real-estate-investment-trusts-reits" },
      { label: "SEC — Investor Bulletin: Regulation Crowdfunding for Investors", url: "https://www.sec.gov/resources-for-investors/investor-alerts-bulletins/ib_crowdfunding" },
      { label: "IRS — Publication 527, Residential Rental Property", url: "https://www.irs.gov/publications/p527" },
      { label: "IRS — Topic No. 409, Capital Gains and Losses", url: "https://www.irs.gov/taxtopics/tc409" },
    ],
  },

  {
    slug: "what-is-an-ipo",
    title: "What Is an IPO? How Going Public Actually Works",
    metaDescription:
      "What is an IPO? Learn how a company goes public, why it isn't always a win, and the lockup, allocation, and hype risks retail IPO investors face.",
    h1: "What Is an IPO? How Going Public Works and What It Means for Investors",
    cardBlurb: "Private vs public, the IPO process, why going public can backfire, and the lockup and allocation risks retail investors face.",
    intro:
      "An IPO, or initial public offering, is the first time a private company sells shares to the public and lists on a stock exchange. Going public raises cash and creates a tradable stock, but it also adds cost, disclosure, and outside pressure a private company never faces. This guide covers how a company actually goes public, the real benefits and downsides of doing it, and the parts most overviews skip: lockup expirations, why retail investors rarely get first-day access, and how to avoid chasing IPO hype.",
    sections: [
      { heading: "Private companies vs public companies", body: "A private company is owned by a small group — founders, employees, and private investors — and has no obligation to disclose its finances to the public. A public company sells shares on a stock exchange that anyone can buy, and in exchange it must regularly file detailed financial reports with the [SEC](https://www.sec.gov/), including quarterly and annual reports.\n\nGoing from private to public changes more than who owns the stock. It exposes the company's financials, strategy, and executive pay to competitors, analysts, and short sellers, all watching every quarterly report. Some founders treat that scrutiny as the price of access to public capital; others see it as a reason to stay private as long as they can." },
      { heading: "How a company goes public: the IPO process", body: "A company goes public by hiring investment banks, called underwriters, to manage the offering, then filing a detailed registration statement with the SEC — searchable on the SEC's [EDGAR system](https://www.sec.gov/edgar/search-and-access) — that discloses its financials, risks, and business model. The SEC reviews the filing and can require changes before the offering proceeds.\n\nOnce the filing clears review, the company and its underwriters go on a roadshow, pitching the stock to large institutional investors to gauge demand. That demand helps set the IPO price the night before trading begins. On the first trading day, the stock starts trading on the exchange, and its price can move sharply away from the IPO price within hours." },
      { heading: "The real benefits of going public", body: "Going public gives a company a large, one-time cash infusion it can use to pay down debt, fund growth, or acquire other companies. A public listing also creates a liquid stock that lets employees and early investors finally sell shares they've held for years, and it gives the company a public currency — its own stock — to use for future acquisitions.\n\nA public listing can also raise a company's profile with customers and partners, since a stock ticker carries a kind of credibility a private company doesn't have. For many founders and early employees, an IPO is the main way years of equity compensation finally turns into cash." },
      { heading: "Why an IPO can actually be a bad idea for the company", body: "Going public isn't automatically the right move, and plenty of successful companies choose to stay private for exactly that reason. The ongoing costs are real: compliance, quarterly reporting, investor relations staff, and far more exposure to shareholder lawsuits than a private company ever faces.\n\nPublic markets also pressure management toward short-term results, since missing a single quarterly earnings estimate can hit the stock hard, even when the long-term strategy is sound. A company that needs years to execute a plan may find that pressure genuinely destructive, which is why some late-stage private companies raise plenty of cash from private investors and delay going public for as long as they can." },
      { heading: "How IPOs actually work for retail investors", body: "Retail investors — individuals buying through an ordinary brokerage account — almost never get shares at the IPO price on day one. The [SEC's investor bulletin on IPOs](https://www.sec.gov/files/ipo-investorbulletin.pdf) notes that underwriters distribute most IPO shares to their institutional and high-net-worth clients first, so most retail investors can only buy once the stock starts trading on the open market, often at a price already well above the IPO price.\n\nA second risk shows up months later: the lockup period. Company insiders and early investors typically sign a [lockup agreement](https://www.sec.gov/fast-answers/answerslockuphtm.html), most commonly 180 days, that bars them from selling shares right after the IPO. When that lockup expires, a wave of insider selling can hit the stock all at once — the expiration date is disclosed in the prospectus, so retail investors can see it coming and plan around it instead of being surprised.\n\nThe first-day 'pop' also isn't guaranteed to hold. A stock that jumps 40% on day one can just as easily give that gain back, or fall below its IPO price entirely, in the weeks and months that follow, once the initial demand from underpricing and hype fades." },
      { heading: "Tips for investing in IPOs without chasing the hype", body: "Read the prospectus before you buy, not the headlines about the deal. The SEC recommends studying the actual offering document, since it discloses the company's finances, risks, and how shares are being allocated, in far more detail than any news story will.\n\nWatch for recency and hype bias: a stock dominating your social feed the week of its IPO is exactly the stock priced for maximum optimism, which leaves the least room for good news to push it higher. Waiting for the lockup expiration to pass, and for a full quarter or two of public reporting, gives you real financial data to evaluate instead of a roadshow pitch.\n\nSize any single IPO position small relative to your overall portfolio. A single new stock, with no trading history and a wave of insider selling still ahead of it, carries far more risk than an established company — our [portfolio calculator](/portfolio/) can help you see how one volatile position affects your overall risk before you buy." },
    ],
    tools: [
      { href: "/investing/", label: "Investing" },
      { href: "/portfolio/", label: "Portfolio" },
    ],
    faqs: [
      { question: "What does IPO mean?", answer: "IPO stands for initial public offering, the first time a private company sells shares to the public and begins trading on a stock exchange. Before the IPO, the company's shares are held by founders, employees, and private investors." },
      { question: "Can regular investors buy shares at the IPO price?", answer: "Rarely. Underwriters distribute most IPO shares to institutional and high-net-worth clients before trading opens, so most retail investors buy on the open market once trading begins, often at a price already above the IPO price." },
      { question: "What is an IPO lockup period?", answer: "A lockup period is a set window, most commonly 180 days, during which company insiders and early investors agree not to sell their shares after the IPO. When the lockup expires, a surge of insider selling can push the stock price down." },
      { question: "Why do IPO stocks sometimes drop after their first day?", answer: "A first-day 'pop' often reflects initial hype and intentional underpricing by underwriters, not the company's long-term value. As that early demand fades and the lockup expiration approaches, the stock can give back its early gains or fall below its IPO price." },
      { question: "Why would a company avoid going public?", answer: "Going public adds ongoing costs — compliance, quarterly reporting, investor relations, and shareholder lawsuit exposure — plus pressure to hit short-term earnings targets. Some companies with long-term strategies choose to stay private and raise cash from private investors instead." },
      { question: "Is it risky to invest in a company's IPO?", answer: "Yes, IPOs carry more risk than established public stocks because there's little public trading history, and a wave of insider selling is often still ahead at the lockup expiration. Reading the prospectus, sizing the position small, and waiting past the initial hype all help manage that risk." },
    ],
    sources: [
      { label: "SEC — Updated Investor Bulletin: Investing in an IPO", url: "https://www.sec.gov/files/ipo-investorbulletin.pdf" },
      { label: "SEC — Initial Public Offerings: Lockup Agreements", url: "https://www.sec.gov/fast-answers/answerslockuphtm.html" },
      { label: "FINRA — Rule 5131, New Issue Allocations and Distributions", url: "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5131" },
    ],
  },

  {
    slug: "what-to-do-with-an-inheritance",
    title: "What to Do With an Inheritance: A Step-by-Step Plan",
    metaDescription:
      "What to do with an inheritance: a 7-step order of operations covering debt, emergency savings, investing, real estate, taxes, and hiring an advisor.",
    h1: "What to Do With an Inheritance: A Step-by-Step Plan for Windfall Money",
    cardBlurb: "A step-by-step order of operations for inherited money — debt, savings, investing, real estate, taxes, and when to get help.",
    intro:
      "Receiving an inheritance is one of the few times in life a large sum of money lands all at once, and that suddenness is exactly why so many people mishandle it. This isn't a tax-rules explainer — we already cover [inherited 401(k) rules](/guides/401k-beneficiary-rules/) in detail elsewhere — it's a decision framework: the order in which to make each move, so a windfall builds lasting security instead of disappearing within a few years.",
    sections: [
      { heading: "Step 1: Pause before you spend or invest anything", body: "The single best first move with any inheritance is to do nothing major for 30 to 90 days. Park the money in a [high-yield savings account](/investing/high-yield-savings-calculator/) or money market account while you grieve, gather paperwork, and think clearly, since decisions made in the first weeks after a loss are the ones people regret most.\n\nUse this window to confirm how the money actually arrived — a lump sum from an estate, a beneficiary designation on a retirement account, or a piece of real estate — since the account type materially changes what you're allowed to do with it, and by when." },
      { heading: "Step 2: Know the tax rules before you sell or move anything", body: "Inherited assets get different tax treatment than assets you bought yourself, and knowing the rules before you act can save real money. Most inherited stocks, real estate, and other property get a 'step-up in basis' to their fair market value on the date of death, under [IRS Publication 551](https://www.irs.gov/publications/p551) — meaning if you sell right away, you may owe little or no capital gains tax, even if the original owner bought the asset decades ago for far less.\n\nAn inherited retirement account works differently and comes with a strict deadline. Most non-spouse beneficiaries of an inherited 401(k) or IRA must empty the account within 10 years under the [SECURE Act](https://www.congress.gov/bill/116th-congress/house-bill/1994)'s 10-year rule — see our [401(k) beneficiary rules guide](/guides/401k-beneficiary-rules/) for the full breakdown, including who qualifies for a longer stretch option and how withdrawals are taxed.\n\nMost inheritances never trigger federal estate tax, since the federal exemption is $15 million per individual as of 2026 (and up to $30 million for a married couple through portability). But a handful of states impose their own estate or inheritance tax at much lower thresholds, so check the state the deceased lived in, not just federal rules — our [estate planning](/estate-planning/) hub covers the state-by-state differences." },
      { heading: "Step 3: Pay down high-interest debt and build your emergency fund", body: "Paying off high-interest debt is usually the highest guaranteed return available with inherited money. Credit card debt commonly carries a 20%+ interest rate, a return no investment reliably beats, so clearing it first is rarely the wrong call.\n\nNext, build or top off an emergency fund of three to six months of expenses, kept in the same high-yield savings account you used to park the windfall initially. An inheritance that clears debt and fills an emergency fund creates a stable base every later step depends on." },
      { heading: "Step 4: Catch up on retirement savings", body: "Maximizing retirement account contributions is usually the next-best move, since decades of tax-advantaged growth are hard to replicate in a taxable account. If you're behind on 401(k) or IRA contributions, use part of the inheritance to live on so you can redirect more of your own paycheck into those accounts, since the inheritance itself typically can't be deposited directly into most retirement accounts.\n\nCheck our [retirement](/retirement/) hub and [401(k) calculator](/retirement/401k-calculator/) to see how a few years of maxed-out contributions change your retirement timeline." },
      { heading: "Step 5: Invest the rest in a taxable brokerage account", body: "Once debt is cleared and retirement accounts are funded, a taxable brokerage account is usually the right home for money you don't need for years. A broad, low-cost index fund spreads the money across hundreds of companies instead of concentrating it in a single stock or property, an important distinction if the inheritance itself was a concentrated stock position.\n\nInvest gradually if the lump sum feels overwhelming, or invest it in one move if your time horizon is genuinely long — either approach beats leaving the entire windfall in cash for years out of indecision. Our [investing hub](/investing/) can help you size an allocation that matches your actual risk tolerance, not just the size of the check." },
      { heading: "Step 6: Decide whether real estate makes sense for this specific windfall", body: "Buying real estate with an inheritance only makes sense if it fits a goal you already had, not because a lump sum suddenly makes a down payment available. If you were already planning to buy a home, an inheritance can fund the down payment and cut years off the process — our [net worth calculator](/net-worth/) shows how a real estate purchase changes your overall financial picture.\n\nBe cautious about inheriting real estate itself, like a family home. Selling it, renting it out, or moving in are all legitimate choices, but each carries different tax and maintenance consequences, so don't let sentimental attachment substitute for running the numbers on what the property will actually cost or earn." },
      { heading: "Step 7: Decide if you need a financial advisor for this", body: "A financial advisor is worth considering when the inheritance is large, complex, or includes assets you don't know how to manage, like a concentrated stock position, a business interest, or multiple retirement accounts with different rules. Our guides on [how to choose a financial advisor](/guides/how-to-choose-a-financial-advisor/) and [whether a financial advisor is worth it](/guides/financial-advisor-worth-it/) cover the fiduciary standard, fee models, and the break-even math in full — read those before you hire anyone.\n\nA simple inheritance — pay off debt, fund retirement, invest the rest in index funds — often doesn't need one. A large or complex inheritance, especially one involving inherited retirement accounts or a taxable estate, is exactly the situation where professional advice tends to earn its cost." },
    ],
    tools: [
      { href: "/net-worth/", label: "Net worth" },
      { href: "/estate-planning/", label: "Estate planning" },
      { href: "/retirement/", label: "Retirement" },
      { href: "/investing/", label: "Investing" },
    ],
    faqs: [
      { question: "What's the first thing I should do with an inheritance?", answer: "Pause for 30 to 90 days before spending or investing any of it. Park the money in a high-yield savings account while you gather paperwork and think clearly — major decisions made in the first weeks after a loss are the ones people regret most." },
      { question: "Do I owe taxes on an inheritance?", answer: "Most inherited property gets a step-up in basis to its fair market value on the date of death, so you may owe little or no capital gains tax if you sell right away. Inherited retirement accounts are taxed differently and follow the SECURE Act's 10-year withdrawal rule for most non-spouse beneficiaries." },
      { question: "Should I pay off debt or invest my inheritance first?", answer: "Pay off high-interest debt first, especially credit cards, since that interest rate is a guaranteed cost few investments reliably beat. After that, build or top off an emergency fund before moving money into retirement accounts or a brokerage account." },
      { question: "Should I use an inheritance to buy a house?", answer: "Only if buying a home was already part of your plan. An inheritance can fund a down payment and speed up a goal you already had, but buying real estate just because a lump sum is available, without a real plan for it, is a common and costly mistake." },
      { question: "Do I need a financial advisor to manage an inheritance?", answer: "It depends on the size and complexity. A simple inheritance you can pay off debt with, save, and invest in index funds usually doesn't need one. A large or complex inheritance — a concentrated stock position, a business interest, or multiple retirement accounts — is where professional advice tends to earn its cost." },
      { question: "How long do I have to decide what to do with an inherited retirement account?", answer: "Most non-spouse beneficiaries must empty an inherited 401(k) or IRA within 10 years under the SECURE Act, though some withdrawals may be required annually during that window. See our 401(k) beneficiary rules guide for the full breakdown, since the exact deadline and tax treatment depend on the account type and your relationship to the original owner." },
    ],
    sources: [
      { label: "IRS — Publication 551, Basis of Assets", url: "https://www.irs.gov/publications/p551" },
      { label: "IRS — Retirement Plans", url: "https://www.irs.gov/retirement-plans" },
      { label: "Congress.gov — Setting Every Community Up for Retirement Enhancement Act of 2019 (H.R. 1994)", url: "https://www.congress.gov/bill/116th-congress/house-bill/1994" },
    ],
  },

  {
    slug: "concentrated-stock-position-risk",
    title: "Concentrated Stock Position Risk: How Much Is Too Much?",
    metaDescription:
      "Concentrated stock position risk explained: the rule of thumb for how much is too much, the RSU/ESPP failure mode, and 5 ways to reduce your exposure.",
    h1: "Concentrated Stock Position Risk: How to Tell If You Have Too Much in One Stock",
    cardBlurb: "How much company stock is too much, the RSU/ESPP failure mode, and ways to reduce a concentrated position without a tax disaster.",
    intro:
      "A concentrated stock position is when a large share of your net worth sits in a single company's stock, and it's one of the most common — and most avoidable — ways investors take on risk they didn't intend. This guide covers how to tell if your position is actually concentrated, why the risk is worse than it looks for employees paid partly in company stock, and the specific strategies people use to reduce it without triggering an unnecessary tax bill.",
    sections: [
      { heading: "How much company stock counts as 'concentrated'?", body: "There's no single legal definition of a concentrated stock position, but many financial advisors flag anything above 10% to 15% of your net worth in a single stock as a level worth actively managing. Above that threshold, one company's bad quarter, lawsuit, or scandal can meaningfully dent your entire financial picture, not just one line on a statement.\n\nThe threshold should tighten, not loosen, if the stock is also your employer's, since your paycheck is already tied to that same company's fortunes. Check your own number first: add up every account that holds the stock — brokerage, 401(k), and any unvested awards — and divide by your total [net worth](/net-worth/) to see where you actually stand." },
      { heading: "The employee failure mode: RSUs, ESPP, and your 401(k) all in one stock", body: "The most common concentration trap isn't a deliberate bet, it's an accumulation nobody planned. An employee can end up holding company stock in four places at once: vesting restricted stock units (RSUs), an employee stock purchase plan (ESPP) bought at a discount, 401(k) contributions defaulted or directed into employer stock, and any stock options exercised and held rather than sold.\n\nEach piece feels small on its own, but added together they can quietly become 30%, 40%, or more of an employee's total net worth. The real danger is correlated risk: if the company has a bad year, you can lose your job and a large share of your savings at the same time, the exact opposite of what diversification is supposed to protect against." },
      { heading: "Look at your full financial picture, not just the stock", body: "Evaluating concentration risk means looking at your entire balance sheet, not the stock position in isolation. A $200,000 concentrated position is a very different risk for someone with $2 million in other diversified assets than for someone whose entire net worth is that $200,000.\n\nAlso weigh your time horizon and how easily you could replace the income tied to that job if the company struggles. Someone five years from retirement with most of their savings in employer stock carries meaningfully more risk than someone in their 20s with decades to recover from a downturn." },
      { heading: "Strategy 1: Sell and diversify, with a tax-aware plan", body: "Selling shares and reinvesting the proceeds across a diversified portfolio is the most direct way to cut concentration risk. The tax-aware version spreads the sale across multiple years or tax brackets, and prioritizes selling shares you've held longest, since those typically qualify for lower long-term capital gains rates instead of short-term ordinary income rates.\n\nSelling shares gradually rather than all at once also reduces the chance you sell everything right before a rally, though the flip side is real too: holding too long while waiting for a 'better' price is exactly how concentrated positions get built in the first place." },
      { heading: "Strategy 2: 10b5-1 plans, exchange funds, and direct indexing", body: "Company insiders — executives and board members with access to material nonpublic information — often use a [10b5-1 trading plan](https://www.sec.gov/newsroom/press-releases/2022-222) to schedule sales in advance, which lets them diversify on a set timeline without the appearance or risk of trading on inside information. If you're an insider or hold restricted shares, a 10b5-1 plan is usually the compliant way to start reducing a position, not an ad-hoc sale.\n\nTwo other tools address the tax side directly. An exchange fund lets you swap concentrated shares for a diversified basket alongside other investors with their own concentrated positions, deferring capital gains tax rather than triggering it, though these funds typically require a multi-year lockup and a high minimum investment. Direct indexing buys the individual stocks in an index directly, which lets you gradually sell off your concentrated position while using the resulting losses elsewhere in the portfolio to offset the gain, a form of tax-loss harvesting applied specifically to a concentration problem." },
      { heading: "How fast should you actually reduce a concentrated position?", body: "There's a real tension between the fastest way to cut risk and the most tax-efficient way to do it, and no formula resolves it for everyone. Selling all at once removes the risk immediately but can trigger the largest possible tax bill in a single year, potentially pushing you into a higher bracket.\n\nA phased plan — selling a fixed percentage or dollar amount each quarter or year — spreads the tax impact and gives you room to use tax-loss harvesting elsewhere to offset some of the gain. Whichever pace you choose, use our [portfolio risk calculator](/portfolio/portfolio-risk-calculator/) to see how each stage of the sale actually changes your overall risk, not just the size of the remaining position." },
    ],
    tools: [
      { href: "/portfolio/portfolio-risk-calculator/", label: "Portfolio risk" },
      { href: "/portfolio/", label: "Portfolio" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "How much company stock is too much?", answer: "Many financial advisors flag 10% to 15% of your net worth in a single stock as the point where the risk deserves active management. That threshold should be even lower if it's your own employer's stock, since your job and your savings are already tied to the same company." },
      { question: "Why is holding employer stock riskier than other concentrated positions?", answer: "Because your paycheck and your savings are tied to the same company, a downturn at that employer can hit your income and your net worth at the same time. RSUs, ESPP shares, 401(k) contributions, and exercised stock options can all quietly add up to a large employer-stock position without a single deliberate decision." },
      { question: "What's the most tax-efficient way to reduce a concentrated stock position?", answer: "Spreading sales across multiple years, prioritizing your longest-held shares for lower long-term capital gains rates, and pairing sales with tax-loss harvesting elsewhere in the portfolio are the standard tax-aware approaches. An exchange fund or direct indexing can also defer or offset some of the tax impact." },
      { question: "What is a 10b5-1 plan and who uses it?", answer: "A 10b5-1 plan is a written, pre-scheduled trading plan that lets company insiders sell shares on a set timeline without running afoul of insider trading rules. It's most useful for executives, board members, and other insiders who hold restricted or closely watched company stock." },
      { question: "What is an exchange fund?", answer: "An exchange fund lets you swap a concentrated stock position for a diversified basket of holdings alongside other investors doing the same, deferring the capital gains tax you'd otherwise owe from selling outright. These funds typically require a multi-year lockup period and a high minimum investment." },
      { question: "Should I sell all my concentrated stock at once?", answer: "Not usually. Selling everything at once removes the risk fastest but can trigger the largest possible tax bill in a single year. A phased sale over several years spreads the tax impact and gives you room to offset some of the gain with tax-loss harvesting." },
    ],
    sources: [
      { label: "SEC — SEC Adopts Amendments to Modernize Rule 10b5-1 Insider Trading Plans", url: "https://www.sec.gov/newsroom/press-releases/2022-222" },
      { label: "IRS — Topic No. 409, Capital Gains and Losses", url: "https://www.irs.gov/taxtopics/tc409" },
      { label: "SEC Investor.gov — Beginners' Guide to Asset Allocation, Diversification, and Rebalancing", url: "https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset" },
    ],
  },

  // ── Competitor-monitor pass (2026-07-20) — 5 consumer guides ──────────────────────────────
  {
    slug: "personal-loans-for-excellent-credit",
    title: "Personal Loans for Excellent Credit: Rates & Requirements",
    metaDescription:
      "See the personal loan rate range excellent credit (720+) typically qualifies for, what lenders check beyond your score, and the risks worth knowing.",
    h1: "Personal Loans for Excellent Credit: What Rate Can You Actually Get?",
    cardBlurb: "Realistic rate ranges for 720+ scores, why a high score doesn't guarantee the best offer, and the fine print worth reading first.",
    intro:
      "Excellent credit — generally a [FICO Score](https://www.myfico.com/credit-education/credit-scores) of 720 or higher — puts you in line for a personal loan's lowest advertised rates, but it does not guarantee them. Lenders also weigh your income, your existing debt, and your debt-to-income ratio before quoting a final number. This guide covers the realistic rate range excellent credit unlocks, the requirements lenders check beyond your score, and the risks that catch even strong-credit borrowers off guard.",
    sections: [
      {
        heading: "What counts as excellent credit for a personal loan",
        body: "Excellent credit generally means a FICO Score of 720 or higher, the tier [myFICO](https://www.myfico.com/credit-education/credit-scores) classifies as \"very good\" to \"exceptional.\" Most personal loan lenders use this range as their cutoff for the lowest published rates and the highest loan amounts without extra documentation.\n\nA score above 720 is necessary for a lender's best offer, but it is not sufficient on its own. Lenders pull your full credit report, not just your score, and look at your payment history length, your mix of account types, and any recent hard inquiries before finalizing a rate.",
      },
      {
        heading: "The rate range you can realistically expect",
        body: "Personal loan rates for excellent credit typically land in the high single digits to mid-teens APR, though the exact number depends heavily on the lender, the loan term, and your specific financial profile. The [Federal Reserve's G.19 Consumer Credit release](https://www.federalreserve.gov/releases/g19/current/) tracks average finance rates on consumer loans and is a useful baseline for how rates move with the broader rate environment.\n\nDon't assume the lowest rate a lender advertises is the rate you'll get. Advertised \"as low as\" rates usually apply to a small share of approved borrowers — the ones with the strongest overall profile, not just the highest score. Get a real, personalized quote through prequalification before comparing lenders on rate alone.",
      },
      {
        heading: "Why a high score doesn't guarantee the best offer",
        body: "Your debt-to-income (DTI) ratio can override a strong score. A lender comparing two applicants with identical 750 scores will typically offer a better rate to the one with lower existing debt payments relative to income, because DTI predicts repayment capacity in a way a score alone cannot.\n\nIncome stability matters too. A gap in employment history, a recent job change, or self-employment income that's hard to verify can all push your quoted rate higher than your score alone would suggest, even at 750 or above. Lenders are pricing the whole picture, not just the three-digit number.",
      },
      {
        heading: "How to shop without hurting your score",
        body: "Prequalification uses a soft credit pull, which doesn't affect your score, and lets you see estimated rates from multiple lenders before you formally apply. Most major online lenders and banks offer this step, so use it to compare real numbers instead of advertised ranges.\n\nWhen you're ready to apply for real, the formal application triggers a hard inquiry, which can cause a small, temporary score dip. If you complete all your rate-shopping applications within a short window — most scoring models use a 14- to 45-day rate-shopping period — many models count them as a single inquiry for scoring purposes rather than several separate ones.",
      },
      {
        heading: "What lenders ask for beyond your score",
        body: "Expect to provide proof of income (pay stubs, tax returns, or bank statements for self-employed applicants), a government-issued ID, and your Social Security number for the credit pull. Some lenders also ask about the loan's purpose, since debt consolidation and home improvement loans are sometimes priced differently than general-purpose loans.\n\nAn existing banking relationship can help. Some banks and credit unions offer relationship discounts or faster underwriting to customers who already hold a checking or savings account there, on top of whatever their credit criteria would otherwise produce.",
      },
      {
        heading: "The risks worth knowing even with excellent credit",
        body: "An origination fee — typically 1% to 10% of the loan amount — is deducted from your payout by many online lenders before you ever see the cash, which raises your real cost above the advertised APR. Run any offer through our [personal loan calculator](/personal-loan/) to see the effective APR once a fee is included, not just the stated rate.\n\nOverborrowing is the other common trap. A strong approval can tempt you to borrow more than you need, since the rate looks attractive. Borrow the amount the underlying goal actually requires, and confirm the lender has no prepayment penalty in case you want to pay the loan off faster than scheduled.",
      },
    ],
    tools: [
      { href: "/personal-loan/", label: "Personal loan" },
      { href: "/budget/", label: "Budget" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "How much can I borrow with excellent credit?", answer: "Loan amounts vary by lender, but excellent-credit borrowers commonly qualify for the higher end of a lender's range — often $50,000 or more from lenders that offer it — because income and DTI, not just the score, ultimately set your approved amount. Smaller, faster-funding loans are also available if you don't need the maximum." },
      { question: "What affects my personal loan rate besides my credit score?", answer: "Your debt-to-income ratio, income stability, loan amount, and loan term all factor into your final rate. Two borrowers with the same score can receive different offers if one carries meaningfully more existing debt relative to income." },
      { question: "Can I get a personal loan with no credit check?", answer: "Be cautious of any lender advertising \"no credit check\" personal loans — these are typically high-cost products aimed at borrowers who can't qualify elsewhere, and they don't reflect the rates available to excellent-credit borrowers. A legitimate lender will always check your credit before offering a real rate." },
      { question: "Should I take out a personal loan if I have excellent credit?", answer: "It depends on the alternative. A fixed-rate personal loan can beat carrying a balance on a high-rate credit card indefinitely, but a 0% intro APR balance transfer card can beat both if you can pay off the balance within the promotional window — compare the real numbers with our [personal loan calculator](/personal-loan/) before deciding." },
      { question: "Is a secured or unsecured personal loan better with excellent credit?", answer: "With excellent credit, an unsecured loan usually makes more sense, since your score alone can unlock a competitive rate without putting any collateral at risk. Secured personal loans exist and can shave a bit off the rate, but the risk of losing the pledged asset is rarely worth it once your credit already qualifies you for good unsecured terms." },
      { question: "How does the personal loan calculator estimate my payment?", answer: "It uses your loan amount, interest rate, and term to compute a standard amortized monthly payment, then factors in any origination fee to show the effective APR on the cash you actually receive — not just the stated rate on the loan's face value." },
    ],
    sources: [
      { label: "myFICO — Credit Score Education", url: "https://www.myfico.com/credit-education/credit-scores" },
      { label: "Consumer Financial Protection Bureau — What is the difference between a mortgage interest rate and an APR?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/" },
      { label: "Federal Reserve — Consumer Credit (G.19)", url: "https://www.federalreserve.gov/releases/g19/current/" },
    ],
  },

  {
    slug: "balance-transfer-credit-card-approval-odds",
    title: "Balance Transfer Card Approval Odds by Credit Score",
    metaDescription:
      "What credit score and income you realistically need to get approved for a balance transfer credit card — plus what to do if you're denied.",
    h1: "Balance Transfer Credit Card Approval Odds: What It Really Takes",
    cardBlurb: "The score and income issuers actually look for, why a good score alone isn't enough, and your next move if you're declined.",
    intro:
      "Approval for a balance transfer credit card depends on more than your credit score — issuers weigh your income, your existing utilization, and how much room they're willing to give a card that's about to absorb someone else's debt. This guide covers realistic approval odds by credit tier, what issuers check beyond the score, and what to do next if you're declined. Once you have a realistic sense of your odds, see [how to choose a balance transfer credit card](/guides/how-to-choose-a-balance-transfer-credit-card/) to pick between a dedicated 0% card and a rewards card with a transfer offer.",
    sections: [
      {
        heading: "The score range that gets approved",
        body: "Balance transfer cards with the longest 0% intro periods and no annual fee are generally reserved for good-to-excellent credit, commonly a [FICO Score](https://www.myfico.com/credit-education/credit-scores) around 690 and up, with the strongest offers going to scores near 720. Applicants in the fair range, roughly 580-669, are unlikely to be approved for a dedicated balance transfer card, though some issuers offer transfer options on cards built for building credit at a less favorable rate.",
      },
      {
        heading: "Why income and DTI matter as much as your score",
        body: "Issuers need evidence you can handle the transferred balance plus your existing obligations, so income and debt-to-income ratio carry real weight in the approval decision. A high score paired with a debt-to-income ratio that already looks stretched can still produce a denial, a lower credit limit than the balance you wanted to transfer, or approval with a shorter intro period than advertised.\n\nExisting utilization on your other cards factors in too. An issuer reviewing your application sees your total revolving debt across all your accounts, not just the balance you're trying to move, so high utilization elsewhere can work against you even with a strong score.",
      },
      {
        heading: "The credit limit problem: approved but not enough",
        body: "A common surprise for otherwise qualified applicants is being approved for a credit limit lower than the balance they wanted to transfer. If your new card's limit is smaller than the debt you're moving, you can only transfer part of it, and the remainder stays on the original card accruing interest.\n\nBefore applying, get a rough sense of your likely limit by checking your existing relationship with that issuer — if you already hold a card with them in good standing, they may extend a similar or higher limit on the new account. Otherwise, consider whether splitting a large balance across two transfer offers makes more sense than betting on one large approval.",
      },
      {
        heading: "How to check your odds without a hard inquiry",
        body: "Prequalification tools use a soft credit pull and let you see your estimated approval odds and offer terms before you submit a formal application, so use them first. A soft pull never affects your score, which makes it a low-risk way to compare multiple issuers before committing to a hard inquiry.\n\nWhen you do apply for real, the hard inquiry causes a small, typically temporary dip in your score. Space out applications rather than applying to several balance transfer cards in a short window, since a cluster of recent inquiries and new accounts can itself work against your approval odds.",
      },
      {
        heading: "What to do if you're declined",
        body: "Read the adverse action notice the issuer is required to send — it lists the specific reasons for the denial, which is more useful than guessing. Common reasons include insufficient credit history, high utilization, or a debt-to-income ratio the issuer considers too high for the requested limit.\n\nIf utilization is the issue, paying down existing balances before reapplying can meaningfully improve your odds within a billing cycle or two, since utilization is one of the more fast-moving factors in your score. If your score itself is the limiting factor, a nonprofit credit counseling agency accredited by the [National Foundation for Credit Counseling](https://www.nfcc.org/) can help you build a plan that doesn't rely on a balance transfer at all.",
      },
    ],
    tools: [
      { href: "/budget/", label: "Budget" },
      { href: "/personal-loan/", label: "Personal loan" },
    ],
    faqs: [
      { question: "What credit score do I need to get approved for a balance transfer card?", answer: "Most issuers reserve their best balance transfer offers — the longest 0% periods, no annual fee — for scores around 690 and up, with the strongest terms going to scores near 720. Approval below that range is possible but less likely, and the terms are usually less favorable." },
      { question: "Can I get approved for a balance transfer card with a low credit score?", answer: "It's unlikely for a dedicated balance transfer card, since issuers reserve those for good-to-excellent credit. If your score is in the fair range, a card built for building credit, a [personal loan](/personal-loan/), or a nonprofit debt management plan are more realistic paths." },
      { question: "Does applying for a balance transfer card hurt my credit score?", answer: "A formal application triggers a hard inquiry, which typically causes a small, temporary dip. Checking your prequalification odds first uses a soft pull instead, which doesn't affect your score at all." },
      { question: "Why was I approved for a lower limit than my balance?", answer: "Issuers set your limit based on your full credit profile, not just the size of the debt you're trying to move, so a lower-than-expected limit is common even with a decent score. If this happens, you can transfer what fits and leave the rest on your original card, or consider splitting the balance across two offers." },
      { question: "What's next if my balance transfer application is denied?", answer: "Read the adverse action notice for the specific reason, since it's usually tied to utilization, credit history length, or debt-to-income ratio rather than the score alone. Paying down existing balances before reapplying, or exploring a personal loan or nonprofit credit counseling in the meantime, are the most common next steps." },
    ],
    sources: [
      { label: "myFICO — Credit Score Education", url: "https://www.myfico.com/credit-education/credit-scores" },
      { label: "CFPB — Credit Cards", url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/" },
      { label: "National Foundation for Credit Counseling", url: "https://www.nfcc.org/" },
    ],
  },

  {
    slug: "how-to-choose-a-balance-transfer-credit-card",
    title: "How to Choose a Balance Transfer Credit Card",
    metaDescription:
      "How to pick between a dedicated 0% balance transfer card and a rewards card with a transfer offer — based on your score, timeline, and payoff plan.",
    h1: "How to Choose a Balance Transfer Credit Card",
    cardBlurb: "Dedicated 0% card vs a rewards card with a transfer offer — the four questions that actually decide it.",
    intro:
      "The right balance transfer credit card depends less on which offer looks flashiest and more on four specific answers: your credit score, how much you're moving, how long you genuinely need to pay it off, and whether you want anything beyond debt payoff from the card. This guide walks through the decision so you pick a card that matches your actual payoff timeline, not just its advertised intro period. Not sure you'll qualify yet? Check [balance transfer approval odds by credit score](/guides/balance-transfer-credit-card-approval-odds/) first.",
    sections: [
      {
        heading: "Dedicated 0% cards vs rewards cards with a transfer offer",
        body: "A dedicated balance transfer card is built for one job: the longest possible 0% intro period, often 15 to 21 months, usually with no annual fee, but few or no ongoing rewards once the intro period ends. A rewards card with a shorter transfer offer — commonly 12 to 15 months at 0% — earns points, miles, or cash back on new spending, which can be worth it if you also plan to keep using the card after the debt is gone.\n\nPick the dedicated card when payoff speed matters more than anything else. Pick the rewards card when your transfer balance is smaller relative to your income, you're confident you'll pay it off well within the shorter window, and you want a card you'll keep using afterward.",
      },
      {
        heading: "Do the transfer fee math before you apply",
        body: "Nearly every balance transfer, even at 0% interest, carries an upfront fee — typically 3% to 5% of the amount moved, charged at the time of transfer regardless of the promotional rate. On a $6,000 balance, a 3% fee costs $180 and a 5% fee costs $300, charged immediately even though you're paying 0% interest on the balance itself.\n\nCompare that fee against what you're currently paying in interest. If your existing card charges 22% APR and you'd otherwise carry the $6,000 balance for a year, you'd pay roughly $1,300 in interest — making even a 5% transfer fee a clear net win. The fee rarely changes the decision, but always confirm the exact percentage before committing, since it varies by issuer.",
      },
      {
        heading: "Match the intro period to your real payoff timeline",
        body: "Divide your transfer balance by the number of months in the intro period to get the fixed payment that clears it in full before interest kicks back in. A $6,000 balance on an 18-month 0% offer needs $333 a month; the same balance on a 12-month offer needs $500 a month.\n\nBe honest about which payment you can actually sustain every month without fail. Choosing a shorter intro period with a payment you can't consistently make defeats the purpose — any balance still open when the promotional period ends starts accruing interest at the card's standard rate, which is often well above what you were paying before.",
      },
      {
        heading: "What happens if you don't pay it off in time",
        body: "A true 0% intro APR card charges interest only going forward on whatever balance remains once the promotional period ends — it does not charge you retroactively for the intro months. That's different from a deferred-interest offer, more common on store cards, which can charge interest back to the original transfer date on the full amount if any balance is left when the period ends.\n\nRead your specific card's terms for the words \"deferred interest\" before assuming your offer works the safer way. If your card is a true 0% intro APR offer and you still have a balance when the period ends, you'll pay standard interest only on what's left — costly, but far less costly than a deferred-interest surprise.",
      },
      {
        heading: "A simple decision checklist",
        body: "Check your score first — a [FICO Score](https://www.myfico.com/credit-education/credit-scores) around 690 or higher opens up the best dedicated 0% offers, while scores below that range should look at a personal loan or a card built for building credit instead. Then divide your balance by your realistic monthly payment capacity to find the minimum intro period length you actually need, and only compare offers that meet or beat it.\n\nFinally, decide whether you want a rewards card you'll keep using afterward or a dedicated card you'll likely close once the balance is paid. There's no wrong answer — the right card is whichever one you'll actually pay off on schedule.",
      },
    ],
    tools: [
      { href: "/budget/", label: "Budget" },
      { href: "/personal-loan/", label: "Personal loan" },
    ],
    faqs: [
      { question: "Is a dedicated balance transfer card better than a rewards card with a transfer offer?", answer: "It depends on your payoff timeline. A dedicated card usually offers the longest 0% period, which is better if you need more time. A rewards card's shorter 0% period can still work if you're confident you'll pay off the balance quickly and want to keep earning rewards on the card afterward." },
      { question: "How much does a balance transfer cost even at 0% interest?", answer: "Almost every balance transfer charges an upfront fee, typically 3% to 5% of the amount moved, charged at the time of the transfer regardless of the 0% rate. Compare that one-time fee against the interest you'd otherwise pay to confirm the transfer still saves you money." },
      { question: "How do I pick the right intro period length?", answer: "Divide your balance by the monthly payment you can realistically sustain every month, and choose an intro period at least that long. Picking a shorter period with a payment you can't consistently make risks leaving a balance that starts accruing interest once the promotion ends." },
      { question: "What's the difference between true 0% APR and deferred interest on a balance transfer?", answer: "A true 0% intro APR card charges interest only on the remaining balance going forward once the period ends. A deferred-interest offer can charge interest retroactively on the full original amount if any balance is left — check your card's specific terms for the words \"deferred interest\" to know which one you have." },
      { question: "Should I choose a balance transfer card or a personal loan?", answer: "A balance transfer card can be cheaper if you can pay off the balance within the 0% window, since a personal loan charges interest from day one. If you need longer than the intro period to pay it off, a fixed-rate [personal loan](/personal-loan/) often ends up cheaper — run both scenarios before deciding." },
    ],
    sources: [
      { label: "CFPB — Credit Cards", url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/" },
      { label: "myFICO — Credit Score Education", url: "https://www.myfico.com/credit-education/credit-scores" },
    ],
  },

  {
    slug: "student-loan-standard-repayment-plan",
    title: "Student Loan Standard Repayment Plan: 2026 Changes",
    metaDescription:
      "The federal Standard Repayment Plan changed in 2026. See how the new Tiered Standard Plan differs from the legacy 10-year plan and which one applies to you.",
    h1: "Student Loan Standard Repayment Plan: What Changed in 2026",
    cardBlurb: "Legacy 10-year Standard Plan vs the new balance-based Tiered Standard Plan — and which one your loans actually fall under.",
    intro:
      "Federal student loan repayment changed for new borrowers starting July 1, 2026, when the [One Big Beautiful Bill Act](https://www.congress.gov/bill/119th-congress/house-bill/1) replaced the old menu of repayment plans with two options: a new Tiered Standard Repayment Plan and a new income-driven plan called the Repayment Assistance Plan (RAP). This guide explains how the legacy Standard Repayment Plan worked, what's different about the new Tiered Standard Plan, and which one applies to your loans.",
    sections: [
      {
        heading: "How the legacy Standard Repayment Plan worked",
        body: "The legacy Standard Repayment Plan sets a fixed monthly payment over a flat 10-year term, regardless of how much you borrowed. It was the default plan for federal student loans for decades and remains the fastest way to become debt-free among plans that were available before the 2026 changes, since no other plan pays off the balance faster.\n\nBecause the term never changes with your balance, a large loan balance under the legacy Standard Plan can mean a high monthly payment — sometimes high enough that borrowers with heavy debt loads chose an income-driven plan instead, trading a longer timeline for a lower payment.",
      },
      {
        heading: "What's new: the Tiered Standard Repayment Plan",
        body: "The Tiered Standard Repayment Plan, available to borrowers with loans first disbursed on or after July 1, 2026, adjusts its term based on your total outstanding balance instead of using one fixed 10-year term for everyone. Borrowers with smaller balances get a shorter term, while borrowers with larger balances are stretched across a longer one — the published tiers run from 10 years up to 25 years depending on how much you owe.\n\nThe Tiered Standard Plan is not income-driven. There's no income recertification, no payment tied to what you earn, and no loan forgiveness at the end of the term — you simply pay off the full balance plus interest over whichever tier your balance falls into. That makes it a closer cousin to the legacy Standard Plan than to an income-driven plan like RAP, just with a term that scales to your debt.",
      },
      {
        heading: "Legacy Standard vs Tiered Standard, side by side",
        body: "The core difference is simple: the legacy Standard Plan uses one fixed term (10 years) for every borrower, while the Tiered Standard Plan uses a variable term set by your balance, so a bigger loan doesn't force a payment as high as the legacy plan would have required. Both are non-income-driven, both charge interest the same way a standard loan does, and neither offers forgiveness at the end — the only real trade is monthly payment size versus total time and total interest paid.\n\nA smaller loan on the Tiered Standard Plan can land in the same 10-year tier as the legacy plan, producing an essentially identical payment. A larger loan lands in a longer tier, lowering the monthly payment compared to what the legacy 10-year plan would have demanded, but extending the payoff timeline and increasing total interest paid over the life of the loan.",
      },
      {
        heading: "Which plan applies to your loans",
        body: "Your plan options depend on when your loans were first disbursed, not on when you're reading this. Loans disbursed before July 1, 2026 generally keep access to the repayment options that existed under the prior system, subject to the transition rules servicers are applying. Loans first disbursed on or after July 1, 2026 choose between the new Tiered Standard Plan and RAP, the new income-driven option, as their primary choices going forward.\n\nBorrowers on legacy income-driven plans like Income-Contingent Repayment (ICR) or Pay As You Earn (PAYE) should know those plans are being phased out, with a full sunset date of July 1, 2028 under the law — your servicer will contact you before you're required to transition to one of the new options. Log into your account at [Federal Student Aid](https://studentaid.gov/) to confirm which plans you're currently eligible for; servicers are actively updating borrower options as the new system rolls out.",
      },
      {
        heading: "Is the Standard Plan right for you?",
        body: "Choose a Standard-style plan (legacy or tiered) when you want the lowest total interest cost and can comfortably afford the resulting monthly payment, since paying off the loan faster always saves money compared to a longer income-driven timeline. Both Standard-style plans front-load the payoff instead of stretching it, which suits borrowers whose income is stable and high enough relative to their balance.\n\nIf your income is lower relative to your balance, or your income varies year to year, RAP's income-based payment may fit better even though it takes longer to pay off, since it's specifically designed to keep payments affordable as your income changes. Run your numbers on the [Federal Student Aid loan simulator](https://studentaid.gov/loan-simulator/) before choosing, since the right plan depends entirely on your specific balance, income, and how much payment flexibility you actually need.",
      },
    ],
    tools: [
      { href: "/budget/", label: "Budget" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "What is the Tiered Standard Repayment Plan?", answer: "It's the new non-income-driven repayment plan for federal loans first disbursed on or after July 1, 2026, under the One Big Beautiful Bill Act. Instead of a flat 10-year term for everyone, your term — 10 to 25 years — is set by your total outstanding balance, so larger balances get a longer term and a lower monthly payment." },
      { question: "Is the legacy Standard Repayment Plan still available?", answer: "Legacy plan availability depends on when your loans were first disbursed and the transition rules your servicer is applying. Loans first disbursed on or after July 1, 2026 use the new Tiered Standard Plan or RAP instead; check your account at studentaid.gov to confirm your current options." },
      { question: "Which is cheaper: the legacy Standard Plan or the Tiered Standard Plan?", answer: "Whichever plan pays off your balance fastest generally costs less in total interest, since interest accrues over the whole repayment period. For a smaller balance that falls into a shorter tier, the two plans can cost roughly the same; for a larger balance, the Tiered Standard Plan's longer term lowers the monthly payment but increases total interest paid." },
      { question: "Does the Tiered Standard Plan offer loan forgiveness?", answer: "No. Neither the legacy Standard Plan nor the new Tiered Standard Plan offers forgiveness at the end of the term — you pay off the full balance plus interest. Forgiveness after a set number of payments is a feature of income-driven plans like RAP, not the Standard-style plans." },
      { question: "What happened to Income-Contingent Repayment (ICR) and PAYE?", answer: "Both are being phased out under the One Big Beautiful Bill Act, with a full sunset date of July 1, 2028. Borrowers currently on ICR or PAYE will be transitioned to one of the new plans before that date; your loan servicer will contact you with your specific timeline and options." },
      { question: "How do I find out which repayment plan I'm currently on?", answer: "Log into your account at Federal Student Aid (studentaid.gov) to see your current plan and the options available to you. The site also offers a loan simulator that estimates your monthly payment and total cost under each plan you qualify for." },
    ],
    sources: [
      { label: "Federal Student Aid (U.S. Department of Education) — studentaid.gov", url: "https://studentaid.gov/" },
      { label: "Federal Student Aid — Loan Simulator", url: "https://studentaid.gov/loan-simulator/" },
      { label: "Congress.gov — H.R.1, One Big Beautiful Bill Act", url: "https://www.congress.gov/bill/119th-congress/house-bill/1" },
    ],
  },

  {
    slug: "side-hustle-ideas",
    title: "Side Hustle Ideas: Realistic Pay, Effort & Tax Rules",
    metaDescription:
      "Side hustle ideas grouped by real hourly pay and startup effort — plus the tax rules (1099s, self-employment tax) most guides leave out.",
    h1: "Side Hustle Ideas: What Actually Pays, and What It Really Costs You in Time",
    cardBlurb: "Side hustles grouped by how fast you get paid and what they really net after expenses — plus the tax rules most lists skip.",
    intro:
      "The right side hustle depends less on a long list of ideas and more on one honest trade-off: how fast you need cash versus how much of your own time and money you're willing to put in first. This guide groups realistic side hustles by that trade-off — quick cash for your time, selling what you already own, selling a skill, and building an asset that pays later — and covers the tax rules on side income that most lists skip entirely.",
    sections: [
      {
        heading: "Quick cash for your time: gig and task apps",
        body: "Rideshare and delivery driving (passenger rides, food and grocery delivery) pay out within days and need no upfront investment beyond a vehicle you likely already own, but gas, vehicle wear, and insurance eat into the advertised per-trip rate more than most first-timers expect. Track your actual mileage from day one — the standard [IRS mileage rate](https://www.irs.gov/tax-professionals/standard-mileage-rates) is a real deduction against this income and materially changes your net pay per hour.\n\nTask and errand apps (moving help, furniture assembly, minor repairs) typically pay more per hour than driving apps because the work requires more skill or physical effort, and many let you set your own rate. Pet sitting and dog walking through a marketplace app fall in the same category: fast approval, modest but reliable pay, and almost no startup cost.",
      },
      {
        heading: "Selling what you already own",
        body: "Selling used clothing, electronics, and household items through a resale marketplace turns idle possessions into cash within days, with the platform's fee (typically 5% to 20% of the sale) as the only real cost. This is the fastest path to cash on this list because there's no client relationship to build and no skill to market — just an item, a listing, and a buyer.\n\nThe income adds up faster than people expect once they treat it as a recurring habit — a monthly closet and garage sweep — rather than a one-time declutter. It's not scalable the way a skill-based hustle is, but it's the lowest-effort entry point if you need cash this week.",
      },
      {
        heading: "Selling a skill: freelancing and tutoring",
        body: "Freelance work — writing, design, bookkeeping, virtual assistance — pays significantly more per hour than gig-app driving once you have even a small portfolio and one or two repeat clients, but the first month or two often means underpricing your time to build that portfolio. Private tutoring works similarly: pay per hour is strong relative to task apps, but building a steady client base takes weeks, not days.\n\nThe honest trade-off here is time-to-first-dollar versus long-term hourly rate. Gig-app work pays from day one at a modest rate; freelancing and tutoring pay little or nothing for the first few weeks while you build proof of work, then can pay two to three times more per hour once you have it.",
      },
      {
        heading: "Building an asset: digital products and content",
        body: "Digital products (templates, courses, an e-book, a print-on-demand shop) and content platforms (a YouTube channel, a blog, a Substack) can pay for months or years after the initial work, but almost all of that work happens before the first dollar arrives — often hundreds of unpaid hours. This is the opposite trade-off from gig-app driving: little to no pay upfront, in exchange for a shot at income that keeps arriving with no new hourly work.\n\nThe realistic failure mode is spending months on a product or channel that never finds an audience. Validate demand cheaply first — a small paid pre-order, a free sample chapter, a handful of short-form posts — before committing serious time to the full version. If a small test doesn't get any real interest, a larger version usually won't either.\n\nThis category overlaps with, but isn't the same as, [passive income](/guides/passive-income-ideas/): a digital product needs real upfront work and often ongoing marketing to keep selling, so it's better described as a side hustle with a long payoff than something that runs itself from day one.",
      },
      {
        heading: "The tax rules most side hustle lists skip",
        body: "Side hustle income is taxable starting with your very first dollar, whether or not you receive a tax form for it. Payment apps and marketplaces are required to send you a Form 1099-K once your payments cross the IRS reporting threshold for the year, but the IRS is clear that all income is reportable regardless of whether a 1099 arrives.\n\nMost side hustlers report this income on Schedule C as self-employment income, which also triggers self-employment tax — an additional 15.3% covering Social Security and Medicare, on top of your regular income tax rate — once net self-employment earnings exceed $400 in a year. Setting aside 25% to 30% of side hustle income for taxes as you earn it, rather than at filing time, avoids a painful surprise the following April.",
      },
      {
        heading: "Red flags worth avoiding",
        body: "Be skeptical of any \"side hustle\" that requires you to pay a large upfront fee for training, a starter kit, or exclusive access before you can start earning — legitimate gig platforms and marketplaces never charge you to join. The [FTC](https://consumer.ftc.gov/articles/job-scams) has flagged this pattern, often paired with vague promises of guaranteed high pay, as a recurring scam structure.\n\nAlso watch for \"reshipping\" or \"money transfer\" job offers that ask you to receive and forward packages or funds on someone else's behalf — these are common vehicles for fraud and can expose you to legal liability even if you didn't realize what was happening.",
      },
    ],
    tools: [
      { href: "/budget/", label: "Budget" },
      { href: "/net-worth/", label: "Net worth" },
    ],
    faqs: [
      { question: "What's the fastest side hustle to get paid from?", answer: "Selling items you already own through a resale marketplace typically pays out fastest, often within days, since there's no client relationship to build first. Gig and task apps are close behind, usually paying out within a few days of completed work." },
      { question: "Which side hustles pay the most per hour?", answer: "Freelance and skill-based work (writing, design, bookkeeping, tutoring) generally pays the most per hour once you've built even a small portfolio or client base, but it takes longer to reach that rate than gig-app work, which pays a modest amount from day one." },
      { question: "Do I have to pay taxes on side hustle income?", answer: "Yes. All side hustle income is taxable from the first dollar, whether or not you receive a 1099 form. Most people report it on Schedule C, which also triggers self-employment tax once net earnings exceed $400 for the year." },
      { question: "What is self-employment tax and how much is it?", answer: "Self-employment tax is an additional 15.3% covering Social Security and Medicare, charged on top of your regular income tax once your net self-employment earnings exceed $400 in a year. Setting aside 25% to 30% of side hustle income as you earn it helps cover both taxes at filing time." },
      { question: "Is passive income the same as a side hustle?", answer: "Not quite. A side hustle like freelancing, driving, or selling items requires ongoing time for ongoing pay. A digital product or content channel can eventually generate income with less new work per dollar, but it still starts with significant upfront effort — see our [passive income guide](/guides/passive-income-ideas/) for streams that are closer to truly hands-off." },
      { question: "How do I avoid side hustle scams?", answer: "Never pay an upfront fee to start a legitimate gig job, and be wary of any offer promising guaranteed high pay for vague work. Reshipping or money-transfer job offers are common fraud vehicles — the FTC recommends researching any company thoroughly before providing personal or banking information." },
    ],
    sources: [
      { label: "IRS — Understanding Your Form 1099-K", url: "https://www.irs.gov/businesses/small-businesses-self-employed/understanding-your-form-1099-k" },
      { label: "IRS — Self-Employment Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes" },
      { label: "FTC — Job Scams", url: "https://consumer.ftc.gov/articles/job-scams" },
    ],
  },

  {
    slug: "chase-travel-portal-guide",
    title: "Chase Travel Portal: How Points Boost & Redemptions Work",
    metaDescription:
      "How the Chase Travel portal values your Ultimate Rewards points, which cards unlock Points Boost, and when transferring to a partner beats the portal.",
    h1: "Chase Travel Portal: How It Works and When to Use It",
    cardBlurb: "Baseline point value, which cards unlock Points Boost, and when transferring to an airline or hotel partner beats booking through the portal.",
    intro:
      "The [Chase Travel](https://www.chase.com/personal/credit-cards/education/basics/how-to-use-chase-ultimate-rewards-travel-portal) portal lets Ultimate Rewards cardholders book flights and hotels directly with points, at a baseline value of 1 cent per point for every eligible card, with select bookings tagged Points Boost worth more. This guide covers how the portal prices your points, which cards unlock the higher Points Boost value, and when transferring points to an airline or hotel partner instead of booking through the portal gets you more for the same points.",
    sections: [
      {
        heading: "What the Chase Travel portal actually is",
        body: "The Chase Travel portal is a booking site built into your Ultimate Rewards account where you search flights, hotels, rental cars, and cruises and pay with points instead of cash. It works like a normal travel booking site — search dates, compare results, book — except your account balance decreases in points rather than dollars.\n\nEvery Ultimate Rewards-earning card can use the portal for standard bookings, but the point value and access to certain features scale up with premium cards, which is the main reason the \"right\" card for maximizing the portal isn't the same for every traveler.",
      },
      {
        heading: "Which cards can access the portal",
        body: "Any card that earns Ultimate Rewards points — including Chase Freedom, Sapphire Preferred, Sapphire Reserve, and the Ink Business line — can book through the portal at the baseline 1-cent-per-point value. Points Boost, the elevated redemption rate on select bookings, is limited to a smaller set of premium cards: Sapphire Reserve, Sapphire Preferred, Sapphire Reserve for Business, J.P. Morgan Reserve, Ink Business Preferred, and Ink Business Plus.\n\nIf you hold a no-annual-fee Freedom card, you can still book through the portal at the standard rate, but you won't see the boosted Points Boost pricing on tagged listings the way a Sapphire or premium Ink cardholder would.",
      },
      {
        heading: "How Points Boost changes your point value",
        body: "Points Boost is a rotating set of hotel and flight listings, marked with a rocket icon in search results, where your points are worth more than the standard 1-cent baseline for a limited time. On a Sapphire Reserve, boosted listings can be worth up to 2 cents per point; on a Sapphire Preferred, boosted listings top out around 1.5 cents per point — both a meaningful jump over the 1-cent rate every other portal booking gets.\n\nIf you held an eligible card before the Points Boost overhaul rolled out, points you earned before the changeover may still redeem at your card's old fixed rate for a limited transition window — check your account for a specific notice rather than assuming the 1-cent baseline applies to every point in your balance.\n\nThe catch is that Points Boost only applies to the specific listings Chase tags, not to every hotel or flight in a search. If your exact dates or preferred property aren't part of a current Points Boost offer, you're back to the standard 1-cent value for that booking, so it pays to compare a few date or property options before assuming you've found the best redemption.",
      },
      {
        heading: "Portal vs transferring to a travel partner",
        body: "Ultimate Rewards points can also be transferred, usually 1:1, to a set of airline and hotel partners, and that route can beat even a Points Boost redemption when the partner's own award chart prices a specific flight or hotel stay below what the points-per-dollar math implies through the portal. Transferring is generally the better move for a premium cabin flight or a luxury hotel stay where the partner's award price is unusually low relative to cash cost.\n\nThe portal is generally the simpler, safer choice for economy flights, budget-to-midrange hotels, and last-minute bookings, since it doesn't require researching a specific partner's award chart or worrying about partner award availability, which can be limited on popular routes. As a rule of thumb: check a transfer partner first for a big-ticket premium redemption, and default to the portal (ideally a Points Boost listing) for everyday travel.",
      },
      {
        heading: "How to find and book a Points Boost offer",
        body: "Log into the Chase Travel portal, search your dates as usual, and look for the rocket icon and \"Points Boost\" tag on individual listings in your results — boosted offers are also sometimes featured at the top of category pages. Because the offers rotate and are tied to specific inventory, availability changes; searching a few days on either side of your ideal dates can surface a boosted listing you'd otherwise miss.\n\nIf you need help with a booking made through the portal — a cancellation, a change, or a dispute — contact Chase Travel support directly through the number or chat listed in your account, rather than the hotel or airline itself, since the reservation was made through Chase and changes typically need to go through them first.",
      },
    ],
    tools: [
      { href: "/budget/", label: "Budget" },
    ],
    faqs: [
      { question: "What is the baseline value of a Chase Ultimate Rewards point in the travel portal?", answer: "Every Ultimate Rewards-earning card books through the portal at a baseline of 1 cent per point. Points Boost listings, available to Sapphire and premium Ink cardholders, are worth more — up to 1.5 cents on Sapphire Preferred and up to 2 cents on Sapphire Reserve." },
      { question: "Which credit cards can access Chase's travel portal?", answer: "Any Ultimate Rewards-earning card, including Chase Freedom, Sapphire Preferred, and Sapphire Reserve, can book through the portal at the standard rate. Points Boost's elevated rates are limited to Sapphire Reserve, Sapphire Preferred, Sapphire Reserve for Business, J.P. Morgan Reserve, Ink Business Preferred, and Ink Business Plus." },
      { question: "How do I find Points Boost offers in the portal?", answer: "Search your travel dates as usual and look for listings tagged with a rocket icon and the words \"Points Boost\" in your results. Offers rotate and apply to specific inventory, so checking a few nearby dates can turn up a boosted listing you'd otherwise miss." },
      { question: "Is it better to book through the portal or transfer points to a partner?", answer: "For everyday economy flights and mid-range hotels, the portal — ideally a Points Boost listing — is simpler and usually competitive. For premium cabin flights or luxury hotel stays, transferring points to an airline or hotel partner can be worth meaningfully more per point if that partner's award price is unusually low." },
      { question: "Does the Chase Travel portal charge any fees?", answer: "Booking through the portal itself doesn't add a separate fee beyond the points (or points-plus-cash) price shown at checkout. Standard airline and hotel policies, like change or cancellation fees from the airline or property, can still apply depending on the fare or rate rules of what you booked." },
      { question: "Can I cancel or change a booking made through the Chase Travel portal?", answer: "Yes, but changes generally need to go through Chase Travel support rather than the airline or hotel directly, since the reservation was made through Chase's system. Refund and change policies depend on the specific fare or rate you booked, so review those terms before booking if flexibility matters to you." },
    ],
    sources: [
      { label: "Chase — How to use the Chase Travel℠ portal", url: "https://www.chase.com/personal/credit-cards/education/basics/how-to-use-chase-ultimate-rewards-travel-portal" },
      { label: "Chase Travel — How Points Boost Works", url: "https://www.chase.com/travel/guide/trips/chase-sapphire-points-boost-benefits-guide" },
    ],
  },

  ...BUSINESS_GUIDES,
  // -- podcast-pain-pass 2026-07-21: how-much-life-insurance-do-i-need --
{
  slug: "how-much-life-insurance-do-i-need",
  title: "How Much Life Insurance Do I Need? (DIME Method)",
  metaDescription: "Most families need about 10 to 12 times their income in life insurance. Use the DIME method (debt, income, mortgage, education) to size your exact coverage.",
  h1: "How Much Life Insurance Do I Need?",
  cardBlurb: "A needs-based way to size your coverage, from the 10 to 12 times income rule to the DIME method.",
  intro: "How much life insurance you need is usually 10 to 12 times your yearly income. That simple multiple is a fast starting point for most families.\n\nYour real need is the money your family would lose if your paycheck stopped. A needs-based method adds up those exact costs, so you buy enough without overpaying.\n\nThis guide covers two ways to size your coverage. It explains why term insurance usually beats whole life for pure protection, and why your need shrinks as you age.",
  sections: [
    {
      heading: "The 10 to 12 Times Income Rule",
      body: "A common rule sets your life insurance at 10 to 12 times your yearly income. This multiple replaces your paycheck for about a decade, giving your family time to adjust.\n\nThe rule is fast, but blunt. It ignores your debts, the size of your mortgage, and how many children you have.\n\nUse it as a quick gut check. Then confirm the number with a needs-based method, like the one below.",
    },
    {
      heading: "The DIME Method Explained",
      body: "The DIME method sizes your coverage by adding four costs: Debt, Income, Mortgage, and Education. Each letter stands for a real bill your family would face.\n\nDebt means what you owe outside your mortgage, like car loans and credit cards.\n\nIncome is your yearly pay times the number of years your family would need it. Most people replace 10 years of income.\n\nMortgage is the balance left on your home loan. Education is the future cost of college for each child.\n\nAdd the four together to get one clear coverage target.",
    },
    {
      heading: "A Worked DIME Example",
      body: "Here is a DIME estimate for a married parent who earns $70,000 a year and has two young children. The numbers below are assumptions you would swap for your own.\n\nDebt: $25,000 in a car loan and credit cards.\nIncome: $70,000 of pay times 10 years, which is $700,000.\nMortgage: $250,000 left on the home loan.\nEducation: $100,000 each for two children, which is $200,000.\n\nAdd them up: $25,000 + $700,000 + $250,000 + $200,000 = $1,175,000 in coverage.\n\nThat total is about 17 times this parent's income. The simple 10 to 12 times rule would suggest only $700,000 to $840,000. The gap is the mortgage and college, which DIME counts on purpose.",
    },
    {
      heading: "Who Needs Little or No Life Insurance",
      body: "You may need little or no life insurance if no one depends on your income. The whole point of coverage is to protect people who would lose money without you.\n\nSingle adults with no children and no co-signed debt often need only enough to cover final expenses.\n\nStrong savings also replace some coverage. [Tally your assets with a net worth calculator](/net-worth/) to see what your family already has.\n\nA solid [emergency fund](/guides/how-much-emergency-fund/) lowers the cash your family must find right away, which shrinks the coverage you need.",
    },
    {
      heading: "Why Term Usually Beats Whole Life",
      body: "Term life insurance usually beats whole life for pure protection because it costs far less per dollar of coverage. The NAIC notes that term insurance is meant to give lower-cost coverage for a set period.\n\nWhole life is a cash-value policy that lasts your whole life but costs much more. That extra cost buys a savings feature, not a bigger death benefit.\n\nFor most families, cheap term buys the large payout they actually need. Buy whole life only for a lasting need, such as a lifelong dependent or [estate planning](/estate-planning/) goals.\n\nRead the full [whole life vs term life insurance comparison](/compare/whole-life-vs-term-life-insurance/) before you decide.",
    },
    {
      heading: "Why Your Coverage Need Shrinks Over Time",
      body: "Your life insurance need shrinks over time as your mortgage shrinks, your savings grow, and your children become independent. Most people carry the highest need in their 30s, not their 60s.\n\nThis is why you should buy the most coverage when you are young. Your need is highest then, and term premiums are lowest.\n\nThe NAIC says that once your home is paid off and your children support themselves, you may not need coverage at all.\n\nA long term policy locks in a low rate while you build the savings that will one day replace it.",
    },
  ],
  tools: [
    { href: "/net-worth/", label: "Net Worth Calculator" },
    { href: "/mortgage/payoff-calculator/", label: "Mortgage Payoff Calculator" },
    { href: "/estate-planning/", label: "Estate Planning Calculator" },
  ],
  faqs: [
    {
      question: "How much life insurance do I need?",
      answer: "You need enough to replace your income and cover your debts, mortgage, and your children's education. A fast rule is 10 to 12 times your yearly income. The DIME method gives a more exact figure by adding those costs together.",
    },
    {
      question: "What is the DIME method?",
      answer: "The DIME method adds four costs to size your coverage: Debt, Income, Mortgage, and Education. You total your non-mortgage debt, the years of income to replace, your mortgage balance, and future college costs.",
    },
    {
      question: "Is term or whole life insurance better?",
      answer: "Term life is better for most people who need pure, affordable protection. It costs much less than whole life for the same death benefit. Whole life fits a lasting need, like a lifelong dependent or an estate plan.",
    },
    {
      question: "Do I need life insurance if I have no kids?",
      answer: "You probably need little life insurance if no one depends on your income. Single adults with no dependents and no co-signed debt often need only enough to cover final expenses.",
    },
    {
      question: "Does my life insurance need change over time?",
      answer: "Yes, your life insurance need usually falls as you age. Your mortgage shrinks, your savings grow, and your children become independent, so the large coverage you buy young can later be reduced or dropped.",
    },
    {
      question: "Should I count my life insurance from work?",
      answer: "Yes, but employer life insurance usually is not enough on its own. The NAIC warns the death benefit is often less than you need, and you may lose the coverage if you leave the job.",
    },
  ],
  sources: [
    { label: "NAIC Life Insurance Buyer's Guide", url: "https://content.naic.org/sites/default/files/publication-lig-lp-consumer-life.pdf" },
    { label: "NAIC: What Type of Life Insurance Is Right for You?", url: "https://content.naic.org/article/consumer-insight-what-type-life-insurance-right-you" },
  ],
},

  // -- podcast-pain-pass 2026-07-21: how-much-emergency-fund --
{
    slug: "how-much-emergency-fund",
    title: "How Much Emergency Fund Do I Need? (3-6 Months Rule)",
    metaDescription:
      "How much emergency fund do you need? A common rule is 3 to 6 months of your essential expenses -- not your income. See a worked example and where to keep it.",
    h1: "How Much Emergency Fund Do I Need?",
    cardBlurb: "How much to save in an emergency fund -- sized on essential expenses, not income -- plus where to keep it and how to build it.",
    intro:
      "How much emergency fund you need is 3 to 6 months of your essential monthly expenses, not your total income. Sizing the fund on needs alone, rather than your full paycheck, often cuts the target in half. This guide shows you how to set the number and when to hold more or less. You will also see where to keep the cash and how to build it.",
    sections: [
      { heading: "Size it on essential expenses, not income", body: "Your emergency fund should cover essential monthly expenses, not your whole income. Essentials are the bills you cannot skip: rent or mortgage, utilities, groceries, insurance, transportation, and minimum debt payments.\n\nLeave out the extras. Dining out, travel, subscriptions, and shopping are wants, not needs. In a real emergency, you pause those costs, so your fund does not have to replace them.\n\nThis is the point most people miss. Sizing a fund on gross income can nearly double the target for no reason. Add up your true essentials first -- our [budget tools](/budget/) make that quick -- then multiply by the number of months you want to cover." },
      { heading: "A worked example: $3,000 a month", body: "Say your essential expenses come to $3,000 a month. Three months of coverage is $9,000. Six months is $18,000. That range, $9,000 to $18,000, is your target.\n\nPick a point in the range based on your risk. A stable two-income household might aim near $9,000. A single earner with variable pay leans toward $18,000.\n\nUse our [savings goal calculator](/investing/savings-goal-calculator/) to turn that target into a monthly savings plan you can actually follow." },
      { heading: "When to hold more than the minimum", body: "Hold closer to 6 months -- or more -- when your income is less certain or harder to replace. Several situations call for a bigger cushion.\n\n- **One income.** A single earner has no second paycheck as backup.\n- **Sole earner for a family.** More people depend on that one income.\n- **Variable or self-employed income.** Freelancers and commission earners face uneven months, so 6 to 12 months is safer.\n- **A shaky job or industry.** If layoffs are a real risk, a longer runway buys time.\n- **A long expected job search.** Senior or specialized roles can take many months to replace.\n\nThe less predictable your income, the more months you want saved." },
      { heading: "When 3 months is enough", body: "Three months of essential expenses can be enough when your income is stable and backed up. Two steady salaries in one household are the clearest case.\n\nIf one partner loses a job, the other paycheck still covers part of the bills. That shared safety net lowers how much cash you must hold.\n\nOther signs you can sit at the lower end: strong job security, an in-demand skill, and no dependents relying only on you. You can always build past 3 months later, but reaching that first milestone matters most." },
      { heading: "Where to keep your emergency fund", body: "Keep your emergency fund in a high-yield savings account that is FDIC-insured and easy to reach. The money must be safe and available the day you need it.\n\nThe FDIC automatically insures deposits up to at least $250,000 per depositor, per insured bank. A savings account keeps your cash protected while it earns interest.\n\nSkip investments like stocks for this money. Their value can drop right when an emergency hits. Also skip a plain checking account, where idle cash earns almost nothing and is easy to spend by accident.\n\nOne caution: do not treat a credit card as your emergency fund. If you already carry a balance, see [how long it takes to pay off a credit card](/guides/how-long-to-pay-off-credit-card/) to understand the real cost." },
      { heading: "Build it in the right order", body: "Build your emergency fund in two stages so early progress feels reachable. First, save a small starter fund of $1,000 to $2,000. This covers most surprise bills, like a car repair or a medical copay.\n\nA starter fund also keeps a small emergency from turning into high-interest debt. Once it is in place, grow the fund toward your full 3-to-6-month target.\n\nWondering whether to finish the fund before investing or clearing debt? See our guide on [whether to pay off debt or invest](/guides/pay-off-debt-or-invest/) to sequence the rest of your plan." },
    ],
    tools: [
      { href: "/budget/monthly-budget-calculator/", label: "Monthly budget" },
      { href: "/budget/50-30-20-budget-calculator/", label: "50/30/20 budget" },
      { href: "/investing/savings-goal-calculator/", label: "Savings goal" },
    ],
    faqs: [
      { question: "How much emergency fund do I need?", answer: "You need 3 to 6 months of your essential monthly expenses, not 3 to 6 months of income. Add up rent, utilities, groceries, insurance, transportation, and minimum debt payments. Then multiply by 3 for the low end and 6 for the high end." },
      { question: "Should an emergency fund be based on income or expenses?", answer: "Expenses -- specifically your essential expenses. In an emergency you cut wants like dining out and travel, so your fund only needs to cover needs. Sizing it on your full income can nearly double the target for no reason." },
      { question: "How much should I save before I start investing?", answer: "Save a starter fund of $1,000 to $2,000 first, then build toward 3 to 6 months of essential expenses. A starter fund keeps a small emergency from becoming credit card debt before you invest or attack other debt." },
      { question: "Where should I keep my emergency fund?", answer: "In a high-yield savings account that is FDIC-insured and liquid. FDIC insurance protects deposits up to at least $250,000 per depositor, per insured bank. A savings account also lets the cash earn interest while staying easy to reach. Avoid stocks, which can fall right when you need the money." },
      { question: "How many months should I save if I am self-employed?", answer: "Aim for 6 to 12 months of essential expenses if your income is variable or self-employed. Uneven months and slow seasons make a longer cushion safer than the standard 3 to 6 months. A single earner supporting a family should also lean toward the higher end." },
      { question: "Why do I need an emergency fund?", answer: "An emergency fund keeps a surprise cost from turning into high-interest debt. The Federal Reserve found that in 2024, only 63% of adults could cover a $400 emergency with cash or its equivalent. A dedicated fund means a car repair or medical bill does not derail your budget." },
    ],
    sources: [
      { label: "Federal Reserve -- Economic Well-Being of U.S. Households in 2024", url: "https://www.federalreserve.gov/publications/2025-economic-well-being-of-us-households-in-2024-savings-and-investments.htm" },
      { label: "CFPB -- An Essential Guide to Building an Emergency Fund", url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/" },
      { label: "FDIC -- Deposit Insurance", url: "https://www.fdic.gov/resources/deposit-insurance/" },
    ],
  },

  // -- podcast-pain-pass 2026-07-21: how-long-to-pay-off-credit-card --
{
  slug: "how-long-to-pay-off-credit-card",
  title: "How Long to Pay Off Credit Card: The Real Math",
  metaDescription:
    "How long to pay off a credit card depends on your balance, APR, and payment. See the payoff math, why minimum payments trap you, and how to clear it faster.",
  h1: "How Long Will It Take to Pay Off My Credit Card?",
  cardBlurb:
    "See how balance, APR, and payment set your payoff date -- and why a small fixed payment beats the minimum by years.",
  intro:
    "How long it takes to pay off a credit card depends on three things: your balance, your APR, and your monthly payment. This guide shows the exact math with a clear example. The big lesson is simple. Paying only the minimum can trap you in debt for a decade or more. A small, steady payment above the minimum can clear the same card in a few years. Run your own numbers with the free tools below.",
  sections: [
    {
      heading: "The three numbers that set your payoff time",
      body: "How long you carry a credit card balance comes down to three numbers: your balance, your APR, and your monthly payment. Your balance is what you owe today. Your APR is the yearly interest rate. Divide it by 12 to get the monthly rate. Your payment is what you send each month.\n\nRaise the payment and the timeline shrinks fast. Raise the APR or the balance and it stretches. The payment is the lever you control most. Even a small, steady increase changes the outcome more than most people expect.",
    },
    {
      heading: "The minimum-payment trap",
      body: "Paying only the minimum keeps you in debt for years, because most of it goes to interest, not your balance. Card issuers set the minimum low. It is often around 1% to 3% of the balance plus that month's interest. On a high-APR card, that barely dents what you owe.\n\nThe CARD Act forces your statement to show this. By law, each bill lists how long payoff takes if you pay only the minimum. It also shows the fixed amount that would clear your balance in 36 months. Read that box. The gap between those two numbers is the real cost of the minimum-payment habit.",
    },
    {
      heading: "How to calculate your payoff time",
      body: "You can calculate payoff time with one formula when your payment stays fixed:\n\nmonths = -ln(1 - (r x B) / P) / ln(1 + r)\n\nHere B is your balance, P is your fixed monthly payment, and r is your monthly rate (APR divided by 12). The \"ln\" is the natural logarithm on any calculator. The formula assumes a fixed rate, a fixed payment, and no new charges.\n\nOne rule falls straight out of the math. If your payment is less than or equal to one month's interest, you never pay the card off. Your payment has to beat the interest before the balance can fall at all.",
    },
    {
      heading: "Worked example: $5,000 at 24% APR",
      body: "Say you owe $5,000 on a card at 24% APR. That is a 2% monthly rate (24% / 12). You stop charging and pay a fixed $200 a month.\n\nPlug it in: months = -ln(1 - (0.02 x 5,000) / 200) / ln(1.02) = ln(2) / ln(1.02), which is about 35 months. You clear the card in just under three years and pay about $2,000 in interest.\n\nNow compare the minimum. Assume a typical minimum of 1% of the balance plus that month's interest, never below $25. It starts near $150 and shrinks as the balance falls. At that pace, payoff takes nearly 19 years and costs more than $8,000 in interest.\n\nHere is the part that surprises people. The fixed $200 is only about $50 more than the first minimum payment. That extra $50 a month, held steady, cuts payoff from nearly 19 years to about 3 years and saves more than $6,000 in interest.",
    },
    {
      heading: "How to pay off your credit card faster",
      body: "The fastest fix is to pick a fixed payment and never let it fall. Minimums drop as your balance drops, which quietly slows you down. A flat payment keeps your momentum going.\n\nAdd whatever extra you can on top. Because interest is charged on your balance, every extra dollar today saves interest on every month that follows. Even $25 more a month moves the finish line up.\n\nIf you carry more than one card, pick an order. The [debt snowball vs avalanche](/compare/debt-snowball-vs-avalanche/) comparison shows the two proven methods. Snowball pays the smallest balance first for quick wins. Avalanche pays the highest APR first to save the most interest. A 0% balance-transfer card can help too, but watch the transfer fee and the date the promo rate ends.",
    },
    {
      heading: "Pay off the card, or invest?",
      body: "Clearing high-APR credit card debt usually beats investing, dollar for dollar. Avoiding 24% interest works like a guaranteed 24% return. Few investments match that with no risk.\n\nStill capture any 401(k) employer match first, since that is free money. After that, attack the card. Our guide on whether to [pay off debt or invest](/guides/pay-off-debt-or-invest/) walks through the tradeoff step by step.\n\nTo find the extra cash, tighten your budget. A [50/30/20 budget](/budget/50-30-20-budget-calculator/) or a full [monthly budget](/budget/monthly-budget-calculator/) can free up money to raise your fixed payment.",
    },
  ],
  tools: [
    { href: "/budget/monthly-budget-calculator/", label: "Monthly budget" },
    { href: "/budget/50-30-20-budget-calculator/", label: "50/30/20 budget" },
  ],
  faqs: [
    {
      question: "How long does it take to pay off a credit card?",
      answer:
        "It depends on your balance, APR, and monthly payment. With a fixed payment, use months = -ln(1 - (r x B) / P) / ln(1 + r), where r is your monthly rate. Paying only the minimum can stretch a mid-size balance past a decade. A higher fixed payment can clear the same card in a few years.",
    },
    {
      question: "How long to pay off $5,000 in credit card debt?",
      answer:
        "About 35 months, or just under three years, if you pay a fixed $200 a month at 24% APR. That costs roughly $2,000 in interest. Pay only the minimum instead and the same balance can take nearly 19 years and cost more than $8,000 in interest.",
    },
    {
      question: "Why do minimum payments take so long?",
      answer:
        "Minimum payments are set low, often 1% to 3% of the balance plus interest, so most of each payment covers interest, not principal. As your balance falls, the minimum falls too, which slows progress further. By law, your statement shows how many years minimum-only payoff would take.",
    },
    {
      question: "What is the average credit card interest rate?",
      answer:
        "The average rate on credit card accounts was 20.94% in the Federal Reserve's G.19 release, and 22.15% for accounts actually charged interest (May 2026). A higher APR sends more of each payment to interest, which stretches your payoff time and raises the total you pay.",
    },
    {
      question: "Does paying more than the minimum help?",
      answer:
        "Yes, and it helps more than most people expect. Because interest is charged on your balance, every extra dollar cuts interest on all the months that follow. On a $5,000 card at 24% APR, paying a fixed $200 instead of the shrinking minimum saves more than $6,000 and many years of payments.",
    },
    {
      question: "Is it better to pay off my credit card or invest?",
      answer:
        "Paying off a high-APR credit card usually wins, because avoiding 24% interest works like a guaranteed 24% return with no risk. Capture any employer 401(k) match first, then focus on the card. See our guide on whether to pay off debt or invest for the full tradeoff.",
    },
  ],
  sources: [
    { label: "Federal Reserve -- Consumer Credit (G.19)", url: "https://www.federalreserve.gov/releases/g19/current/" },
    { label: "CFPB -- What the payoff box on your credit card statement means", url: "https://www.consumerfinance.gov/ask-cfpb/a-box-on-my-credit-card-bill-says-that-i-will-pay-off-the-balance-in-three-years-if-i-pay-a-certain-amount-what-does-that-mean-do-i-have-to-pay-that-much-if-i-pay-that-much-and-make-new-purchases-will-i-still-owe-nothing-after-three-years-en-36/" },
  ],
},

  // -- podcast-pain-pass 2026-07-21: how-much-tax-will-i-pay --
{
  slug: "how-much-tax-will-i-pay",
  title: "How Much Tax Will I Pay? Estimate Your 2026 Bill",
  metaDescription: "How much tax will you pay? Learn how tax brackets stack, why your marginal rate is not your effective rate, and how FICA adds on top -- with a worked example.",
  h1: "How Much Tax Will I Pay? Estimating Your Federal Income Tax",
  cardBlurb: "See why your top tax bracket is not the rate you actually pay -- and estimate your 2026 federal income tax with a clear worked example.",
  intro: "How much tax you will pay depends on your taxable income, your filing status, and the fact that only your last dollars hit your top rate.\n\nThe United States uses a progressive system. Your income is split into bands called brackets, and each band is taxed at its own rate.\n\nSo your top bracket, called your marginal rate, is not the rate you pay on your whole income. Your real rate, called the effective rate, is almost always lower.\n\nThis guide shows you how to estimate your 2026 federal income tax by hand, plus the Social Security and Medicare taxes that come out on top.",
  sections: [
    {
      heading: "Start with taxable income, not your salary",
      body: "Your salary is not the number the tax brackets use. Tax starts with a smaller figure called taxable income.\n\nTaxable income equals your gross income minus your deductions. Most people take the standard deduction, a flat amount that needs no receipts.\n\nFor tax year 2026, the standard deduction is $16,100 for single filers, $32,200 for married couples filing jointly, and $24,150 for heads of household.\n\nSo a single filer earning $70,000 has taxable income of $70,000 minus $16,100, or $53,900. The brackets apply to that $53,900 -- not the full salary."
    },
    {
      heading: "How the 2026 tax brackets stack",
      body: "The 2026 federal tax brackets are marginal, meaning each slice of your income is taxed at its own rate. Moving into a higher bracket only taxes the dollars inside that bracket.\n\nHere are the 2026 brackets for a single filer:\n\n- 10% on taxable income up to $12,400\n- 12% from $12,400 to $50,400\n- 22% from $50,400 to $105,700\n- 24% from $105,700 to $201,775\n- 32% from $201,775 to $256,225\n- 35% from $256,225 to $640,600\n- 37% on income above $640,600\n\nPicture your income poured into these bands from the bottom up. Fill the 10% band first, then the 12% band, and so on. Only the top splash lands in your highest bracket."
    },
    {
      heading: "Marginal rate vs effective rate",
      body: "Your marginal rate is the rate on your next dollar of income. Your effective rate is the tax you actually pay divided by your income. These two numbers are not the same.\n\nSay a single filer sits in the 22% bracket. That 22% only touches the dollars above $50,400. Everything below is taxed at 10% or 12%.\n\nBlend those lower rates in and the real rate drops well below 22%. That blended number is your effective rate, and it is the honest answer to how much tax you pay.\n\nThe worked example below shows a 22% top bracket turning into an effective rate near 12%."
    },
    {
      heading: "Worked example: a single filer earning $70,000",
      body: "Take a single filer with a $70,000 salary for tax year 2026.\n\nFirst, subtract the $16,100 standard deduction. Taxable income is $53,900.\n\nNow stack that $53,900 through the brackets:\n\n- 10% on the first $12,400 = $1,240\n- 12% on the next $38,000 (from $12,400 to $50,400) = $4,560\n- 22% on the last $3,500 (from $50,400 to $53,900) = $770\n\nAdd them up: $1,240 + $4,560 + $770 = $6,570 in federal income tax.\n\nHer top bracket is 22%, but her effective rate is $6,570 divided by $53,900, or about 12.2%. As a share of her full $70,000 salary, it is only about 9.4%.\n\nThat gap -- 22% on paper versus roughly 12% in reality -- is the whole point of a marginal system."
    },
    {
      heading: "FICA: Social Security and Medicare come out on top",
      body: "Federal income tax is not the only tax on your paycheck. FICA, which funds Social Security and Medicare, comes out on top.\n\nFICA applies to your gross wages, not your taxable income, so the standard deduction does not shrink it.\n\nAs an employee in 2026, you pay 6.2% for Social Security and 1.45% for Medicare, for 7.65% total. Your employer pays a matching 7.65%.\n\nSocial Security stops at a wage base. In 2026 you pay the 6.2% only on the first $184,500 of wages. Medicare has no cap.\n\nHigh earners pay an extra 0.9% Medicare tax on wages above $200,000.\n\nFor our $70,000 single filer, FICA is 7.65% of $70,000, or $5,355. Add that to $6,570 of income tax and her total federal tax is $11,925."
    },
    {
      heading: "Why a raise never lowers your take-home pay",
      body: "A raise into a higher bracket never lowers your take-home pay. This is the most common tax myth.\n\nBrackets are marginal, so a raise only taxes the new dollars at the higher rate. Every dollar you already earned keeps its old, lower rate.\n\nSay a raise pushes you from the 12% band into the 22% band. Only the part above the bracket line is taxed at 22%. You still keep most of the raise.\n\nYou can never take home less by earning more. A raise always leaves you with more cash, just not the full amount before tax."
    },
    {
      heading: "Lower your taxable income the legal way",
      body: "You can shrink your tax bill by shrinking your taxable income. Pre-tax retirement contributions are the simplest lever.\n\nMoney you put into a traditional 401(k) comes out before income tax. It lowers the taxable income your brackets apply to.\n\nOur single filer could cut her $53,900 taxable income by contributing to a workplace plan. Try the numbers in our [401(k) calculator](/retirement/401k-calculator/).\n\nA Roth account works the opposite way -- you pay tax now for tax-free withdrawals later. Our [401(k) vs Roth IRA guide](/compare/401k-vs-roth-ira/) walks through which fits your bracket.\n\nOne catch: pre-tax 401(k) contributions cut income tax but not FICA. Social Security and Medicare still apply to the money you defer."
    }
  ],
  tools: [
    { href: "/retirement/401k-calculator/", label: "401(k) Calculator" },
    { href: "/investing/roth-ira-calculator/", label: "Roth IRA Calculator" }
  ],
  faqs: [
    {
      question: "How much tax will I pay on a $70,000 salary?",
      answer: "A single filer earning $70,000 pays about $6,570 in 2026 federal income tax, an effective rate near 12.2% of taxable income. After the $16,100 standard deduction, taxable income is $53,900, stacked through the 10%, 12%, and 22% brackets. FICA adds another $5,355 for Social Security and Medicare."
    },
    {
      question: "What is the difference between my marginal and effective tax rate?",
      answer: "Your marginal rate is the rate on your next dollar of income, while your effective rate is your total tax divided by your income. Because brackets are marginal, your effective rate is almost always lower than your top bracket. A filer in the 22% bracket often has an effective rate near 12%."
    },
    {
      question: "Does a raise into a higher tax bracket lower my take-home pay?",
      answer: "No. A raise never lowers your take-home pay. Brackets are marginal, so only the dollars inside the new bracket are taxed at the higher rate. Every dollar below the bracket line keeps its lower rate, so you always keep more after a raise."
    },
    {
      question: "Is FICA the same as federal income tax?",
      answer: "No. FICA is separate from federal income tax. You pay 6.2% for Social Security and 1.45% for Medicare on your gross wages, on top of income tax. In 2026, Social Security tax stops after $184,500 of wages, while Medicare has no wage cap."
    },
    {
      question: "What is the 2026 standard deduction?",
      answer: "The 2026 standard deduction is $16,100 for single filers, $32,200 for married couples filing jointly, and $24,150 for heads of household. You subtract it from your gross income to find taxable income, which is the number the tax brackets actually apply to."
    },
    {
      question: "How can I lower how much tax I pay?",
      answer: "Lower your taxable income to lower your income tax. Pre-tax contributions to a traditional 401(k) come out before income tax and can move you toward a lower bracket. This cuts income tax but not FICA. Roth accounts instead trade tax now for tax-free income later."
    }
  ],
  sources: [
    { label: "IRS -- Tax inflation adjustments for tax year 2026", url: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill" },
    { label: "IRS Topic no. 751 -- Social Security and Medicare withholding rates", url: "https://www.irs.gov/taxtopics/tc751" }
  ],
},

  // -- podcast-pain-pass 2026-07-21: pay-off-debt-or-invest --
{
  slug: "pay-off-debt-or-invest",
  title: "Pay Off Debt or Invest? A Simple Decision Framework",
  metaDescription:
    "Deciding whether to pay off debt or invest? Compare your debt's interest rate to your expected return. Grab the 401(k) match, then kill high-rate debt first.",
  h1: "Should You Pay Off Debt or Invest? A Simple Decision Framework",
  cardBlurb: "Compare your debt's interest rate to your expected return, then follow the order: match, emergency fund, high-rate debt, invest.",
  intro:
    "Whether to pay off debt or invest comes down to one simple comparison. You weigh your debt's interest rate against the return you can expect from investing. Paying off a debt earns a guaranteed, risk-free return equal to its interest rate. Investing might beat that, but the return is never promised. This guide gives you the priority order most planners agree on. Each step links to a free ModernWallet calculator so you can run your own numbers.",
  sections: [
    { heading: "Paying off debt is a guaranteed return", body: "Paying off debt gives you a guaranteed, risk-free return equal to the loan's interest rate. Wipe out a card charging 21%, and you effectively earn 21% -- with zero risk. No investment can promise that.\n\nThe U.S. stock market has historically returned roughly 10% a year before inflation. But that long-run average hides big swings, and some years it drops 20% or more. Your future return is uncertain; the debt payoff is not.\n\nSo the real question is simple. Does your debt cost more than you can reliably earn? If yes, paying off the debt wins. Credit cards recently averaged about 21% APR, far above any safe return (Federal Reserve, May 2026)." },
    { heading: "Step 1: Grab your employer 401(k) match first", body: "Always contribute enough to capture your full employer 401(k) match before anything else. A match is free money and an instant return no debt payoff can beat.\n\nMany plans add 50 cents for every dollar you contribute (IRS). That is an immediate 50% return. A dollar-for-dollar match doubles your money on the spot -- a 100% return. Even with credit card debt, grab the match first, then attack the debt.\n\nOne catch: matching money may vest over a few years, so check your plan rules. After you secure the match, you can [compare a 401(k) vs a Roth IRA](/compare/401k-vs-roth-ira/) for the rest of your savings." },
    { heading: "Step 2: Build a starter emergency fund", body: "Build a small starter emergency fund before you throw every dollar at debt. Without cash on hand, one surprise bill lands right back on a credit card. That traps you in the cycle you are trying to escape.\n\nA starter fund of about $1,000, or one month of expenses, is enough at this stage. Keep it in a separate savings account you do not touch.\n\nYou can build the full three-to-six-month cushion later, after your high-rate debt is gone. See [how much emergency fund you need](/guides/how-much-emergency-fund/) for your own situation." },
    { heading: "Step 3: Kill high-interest debt before taxable investing", body: "Pay off high-interest debt before you invest in a regular taxable account. High-interest usually means anything above roughly 7% to 8%. Credit cards, at about 21%, are the clearest example.\n\nNo safe investment reliably beats those rates, so clearing the debt wins. The CFPB suggests targeting your highest-rate balance first to save the most (CFPB).\n\nNot sure which debt to hit first? See [debt snowball vs avalanche](/compare/debt-snowball-vs-avalanche/) to pick a method. To map your timeline, read [how long it takes to pay off a credit card](/guides/how-long-to-pay-off-credit-card/)." },
    { heading: "Step 4: With low-rate debt, investing often wins", body: "With low-rate debt, investing your extra cash often beats paying the loan down early. A sub-4% mortgage is the classic example. If your loan costs 3.5% and investments may earn more over time, the math favors investing.\n\nThat gap is your likely reward for taking some risk. It is not guaranteed, though, so weigh your comfort with risk.\n\nStudent loans and auto loans fall in a gray zone. Compare each loan's rate to your expected return, and split extra cash if you are unsure. Federal student loans also carry protections you give up by paying them off fast." },
    { heading: "The behavioral factor: guaranteed vs uncertain", body: "The math is only half the decision -- how you feel about debt matters too. A return from debt payoff is certain, while investment gains are not.\n\nSome people sleep better with zero debt, even when investing might earn a bit more. That peace of mind has real value. If debt stresses you out, paying it down faster is a reasonable choice.\n\nThe best plan is the one you will actually stick with. You can also split the difference: invest part of your cash and pay down debt with the rest." },
  ],
  tools: [
    { href: "/investing/compound-interest-calculator/", label: "Compound interest" },
    { href: "/investing/investment-growth-calculator/", label: "Investment growth" },
    { href: "/retirement/401k-calculator/", label: "401(k) growth" },
  ],
  faqs: [
    { question: "Should I pay off debt or invest first?", answer: "First grab any employer 401(k) match, since it is free money. Next build a small emergency fund. Then pay off high-interest debt, roughly 7% APR or more, before investing in a taxable account. Low-rate debt, like a sub-4% mortgage, can wait while you invest." },
    { question: "Is it better to pay off debt or invest?", answer: "It depends on your debt's interest rate versus your expected return. Paying off debt earns a guaranteed return equal to the rate. Investing may earn more but is never guaranteed. If your debt costs more than you can safely earn, paying it off usually wins." },
    { question: "What interest rate is high enough to pay off before investing?", answer: "Roughly 7% to 8% APR or higher is the common cutoff. Credit cards, which recently averaged about 21%, sit well above that. No safe investment reliably beats those rates, so clearing high-rate debt first is the stronger move." },
    { question: "Should I pay off my mortgage or invest?", answer: "With a low-rate mortgage, investing often wins over paying it off early. A sub-4% loan likely costs less than long-run investment returns. But those returns are uncertain, while paying down the loan is guaranteed. Choose based on the rate gap and your comfort with risk." },
    { question: "Why should I get the 401(k) match before paying off debt?", answer: "An employer match is an instant return no debt payoff can beat. A 50-cent match per dollar is an immediate 50% gain, and a dollar-for-dollar match is 100%. Contribute enough to capture the full match, then return to your debt." },
    { question: "Should I invest while I still have credit card debt?", answer: "Generally no, aside from capturing your employer 401(k) match. Credit cards near 21% cost far more than a safe investment can earn. Pay off the card balance first, then invest with the money you free up." },
  ],
  sources: [
    { label: "Federal Reserve -- Consumer Credit G.19", url: "https://www.federalreserve.gov/releases/g19/current/" },
    { label: "CFPB -- How to reduce your debt", url: "https://www.consumerfinance.gov/about-us/blog/how-reduce-your-debt/" },
    { label: "IRS -- 401(k) Plan Overview", url: "https://www.irs.gov/retirement-plans/plan-sponsor/401k-plan-overview" },
  ],
},

  // -- keyword-gap-pass 2026-07-22: retirement-calculator-spreadsheet-template --
  {
    slug: "retirement-calculator-spreadsheet-template",
    title: "Retirement Calculator Spreadsheet Template (Google Sheets)",
    metaDescription:
      "Build a retirement calculator spreadsheet template in Google Sheets or Excel. Copy the compound growth and safe withdrawal rate formulas step by step.",
    h1: "Build Your Own Retirement Calculator Spreadsheet Template",
    cardBlurb: "Copy these compound growth and withdrawal formulas into Google Sheets or Excel to build your own retirement projection.",
    intro:
      "This retirement calculator spreadsheet template teaches you to build your own retirement projection by hand. You will copy real formulas into Google Sheets or Excel, cell by cell. Each formula uses compound growth to project your balance and a safe withdrawal rate to estimate retirement income. Prefer not to build one yourself? Our free [retirement calculator](/retirement/) runs the same math instantly.",
    sections: [
      { heading: "Why build your own spreadsheet", body: "A spreadsheet you build yourself shows every assumption in plain view. You can see exactly how a change in your contribution or return rate moves your final number.\n\nThis matters because online calculators often hide their formulas behind a single result box. A spreadsheet you control lets you test your own what-if scenarios for years to come.\n\nYou only need two things to start: Google Sheets or Microsoft Excel, and about 15 minutes." },
      { heading: "Set up your five input columns", body: "Open a blank sheet and create five column headers in row 1: Year, Starting Balance, Contribution, Growth, and Ending Balance.\n\nIn cell B2, type your current retirement savings balance, for example 50000. In cell C2, type the dollar amount you plan to add this year, for example 7000.\n\nPick a separate cell off to the side, say H1, and label it Annual Return. Enter your assumed yearly growth rate as a decimal, such as 0.07 for 7%. You will reference this one cell in every row, so you can change your assumption once and watch the whole sheet update." },
      { heading: "The compound growth formula, cell by cell", body: "In cell D2, type the formula =B2*$H$1. This multiplies your starting balance by your assumed return, giving you that year's growth in dollars.\n\nIn cell E2, type =B2+C2+D2. This adds your starting balance, your contribution, and the growth to get your ending balance for the year.\n\nIn cell B3, type =E2. This carries last year's ending balance forward as next year's starting balance. Now copy that formula pattern down as many rows as years until retirement." },
      { heading: "Add contribution growth and check your total", body: "Real contributions usually rise over time with raises. In column C, you can increase the value slightly each year, for example multiplying the prior year's contribution by 1.03 for a 3% raise.\n\nAfter you fill in every row through your retirement year, the Ending Balance in your final row is your projected nest egg. This single cell answers 'how much will I have at retirement.'\n\nDouble-check the math with the built-in [FV function](https://support.google.com/docs/answer/3093224) in Google Sheets, which calculates the same growth in one formula: =FV(rate, years, -contribution, -starting_balance)." },
      { heading: "The safe withdrawal rate formula", body: "Once you have a projected balance, the next question is how much you can safely spend each year in retirement. A commonly cited starting point is the 4% rule, developed by financial planner [William Bengen](https://www.bengenfs.com/the-4-percent-rule/) in 1994.\n\nIn a new cell, label it Annual Retirement Income and enter the formula =FinalBalance*0.04, replacing FinalBalance with the cell reference of your last row's Ending Balance. This estimates a first-year withdrawal amount you then adjust for inflation in later years.\n\nBengen's own later research suggests some retirees could safely withdraw a bit more, depending on the mix of stocks and bonds and how long the money needs to last. Treat 4% as a reasonable starting assumption, not a guarantee." },
      { heading: "When to use the real calculator instead", body: "A spreadsheet is great for learning the mechanics, but it gets tedious once you want to test Social Security timing, tax brackets, or required minimum distributions.\n\nOur free [retirement calculator](/retirement/) runs this same compound growth math instantly, plus models withdrawals, inflation, and Social Security together. If you already have a savings target in mind, the [retirement savings calculator](/retirement/retirement-savings-calculator/) lets you test that specific number.\n\nMany people use both: the spreadsheet to understand the mechanics, and the calculator to run the full plan." },
    ],
    tools: [
      { href: "/retirement/", label: "Retirement calculator" },
      { href: "/retirement/retirement-savings-calculator/", label: "Retirement savings" },
    ],
    faqs: [
      { question: "What formula calculates compound growth in a spreadsheet?", answer: "Use =StartingBalance*(1+Rate) for one year of growth, then carry the result forward as next year's starting balance. Google Sheets and Excel also both support the built-in FV function, =FV(rate, nper, pmt, pv), to calculate a future value directly from your inputs." },
      { question: "How do I add my own contributions to the formula?", answer: "Add your contribution as a separate line item each year: Ending Balance = Starting Balance + Contribution + Growth. Carry that ending balance forward as next year's starting balance, then repeat the formula down each row until your retirement year." },
      { question: "What is the safe withdrawal rate formula?", answer: "Multiply your final projected balance by a withdrawal percentage, commonly 4%, to estimate a sustainable first-year retirement income. The formula is =FinalBalance*0.04. Adjust that dollar amount for inflation in each following year." },
      { question: "Can I build this template in Excel instead of Google Sheets?", answer: "Yes. The FV function and basic arithmetic formulas in this guide work the same way in Microsoft Excel and Google Sheets. Column and cell references may shift depending on where you place your inputs, but the formulas themselves do not change." },
      { question: "Should I just use an online retirement calculator instead?", answer: "A calculator is faster once you understand the concept, since it runs the same compound growth and withdrawal math automatically. Build the spreadsheet first to learn how the numbers connect, then switch to a full calculator to model taxes, Social Security, and inflation together." },
    ],
    sources: [
      { label: "Google Docs Editors Help — FV function", url: "https://support.google.com/docs/answer/3093224" },
      { label: "Bengen Financial Services — The 4% Rule", url: "https://www.bengenfs.com/the-4-percent-rule/" },
    ],
  },

  // -- keyword-gap-pass 2026-07-22: bitcoin-retirement-calculator-considerations --
  {
    slug: "bitcoin-retirement-calculator-considerations",
    title: "Bitcoin Retirement Calculator: Risks to Know First",
    metaDescription:
      "Thinking about a bitcoin retirement calculator? See the real risks: volatility, no yield, crypto tax rules, and why diversification still matters.",
    h1: "Bitcoin Retirement Calculator: What to Know Before You Rely on Crypto",
    cardBlurb: "The real risks of funding retirement with bitcoin or crypto — volatility, taxes, and no guaranteed yield.",
    intro:
      "A bitcoin retirement calculator cannot promise you a number, because bitcoin's price swings far more than stocks or bonds. This guide is not investment advice and makes no price prediction. Instead, it walks through the real risks of leaning on crypto for retirement: volatility, the lack of built-in income, how the [IRS](https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-virtual-currency-transactions) taxes your gains, and why spreading your money across assets still matters. Our free [retirement calculator](/retirement/) and [FIRE calculator](/retirement/fire-calculator/) can model a retirement plan built around traditional, diversified investments.",
    sections: [
      { heading: "Bitcoin is far more volatile than stocks", body: "Bitcoin's price swings are much larger than the stock market's, on average. Research from [Fidelity Digital Assets](https://www.fidelitydigitalassets.com/research-and-insights/closer-look-bitcoins-volatility) has found bitcoin's annualized volatility has historically run several times higher than the S&P 500's.\n\nThat volatility has come down somewhat since bitcoin's early years, but it still moves far more than a diversified stock and bond portfolio. A retirement plan built on a volatile single asset can lose a large share of its value in a short window.\n\nIf that drop happens right before or during retirement, the damage can be permanent, since you may need to sell at the bottom to cover living expenses." },
      { heading: "Bitcoin pays no yield unless you take on more risk", body: "Plain bitcoin held in a wallet earns no interest, dividend, or rent. Unlike a bond or a dividend stock, it produces no income on its own.\n\nSome investors turn to staking other cryptocurrencies, or to lending platforms, to earn a yield on crypto holdings. Bitcoin itself does not natively support staking, and third-party lending and staking products carry their own risk, including platform failures and lockup periods that can trap your money exactly when you need it.\n\nA retirement plan generally needs some assets built to produce income. Weigh how much of your plan, if any, should depend on an asset that only pays off through price appreciation." },
      { heading: "The IRS taxes crypto gains, and every sale counts", body: "The [IRS](https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-virtual-currency-transactions) treats cryptocurrency as property, not currency, for federal tax purposes. That means selling, trading, or spending bitcoin is a taxable event, and you owe capital gains tax on any increase in value.\n\nHold bitcoin for a year or less before selling, and the gain is taxed at your ordinary income rate. Hold it longer than a year, and it qualifies for lower long-term capital gains rates instead.\n\nEvery trade of one cryptocurrency for another also counts as a sale for tax purposes. That is a different rule than a traditional 401(k) or IRA, where trades inside the account are not taxed until you withdraw." },
      { heading: "Sequence-of-returns risk gets worse with volatile assets", body: "Sequence-of-returns risk is the danger that a few bad years, right when you start withdrawing money, permanently shrink how long your savings last. The same average return, in a different order, can produce very different outcomes.\n\nBecause bitcoin's price swings are larger, this risk is amplified for anyone withdrawing from a crypto-heavy portfolio. A sharp drop in year one of retirement, combined with withdrawals for living expenses, can lock in losses you never recover from.\n\nThis risk is one reason many retirement plans shift toward more stable assets as retirement approaches, rather than holding a volatile asset through the entire drawdown period." },
      { heading: "Diversification still matters, even with crypto", body: "The core idea behind diversification is spreading money across assets that do not all move together. A retirement plan concentrated in one asset, crypto or otherwise, carries more risk than one spread across stocks, bonds, and cash.\n\nThe [SEC's Office of Investor Education](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/crypto-asset-securities) warns that crypto asset investments can be exceptionally volatile and that investors should only risk money they can afford to lose entirely.\n\nIf you want crypto exposure in a retirement plan, treat it as one small slice of a larger, diversified portfolio, not the plan itself." },
    ],
    tools: [
      { href: "/retirement/", label: "Retirement calculator" },
      { href: "/retirement/fire-calculator/", label: "FIRE calculator" },
    ],
    faqs: [
      { question: "Can I retire on bitcoin alone?", answer: "Relying on a single volatile asset for your entire retirement carries significant risk. Bitcoin has no guaranteed yield and can lose a large share of its value quickly. Most retirement plans work better when spread across many types of assets, with crypto as at most a small slice." },
      { question: "How is bitcoin taxed when I sell it in retirement?", answer: "The IRS treats bitcoin as property, so selling it is a taxable event. Gains on bitcoin held a year or less are taxed at your ordinary income rate; gains on bitcoin held longer than a year qualify for lower long-term capital gains rates." },
      { question: "Does bitcoin pay any income like dividends or interest?", answer: "No. Bitcoin held in a wallet produces no interest, dividend, or rental income on its own. Any yield comes only from third-party staking or lending platforms, which carry additional risks like platform failure." },
      { question: "What is sequence-of-returns risk with crypto?", answer: "It is the risk that poor returns early in retirement, combined with withdrawals, permanently shrink your savings. Because crypto is more volatile than stocks, a bad stretch right when you start withdrawing can do outsized damage to a crypto-heavy retirement plan." },
      { question: "Is this guide investment advice or a price prediction?", answer: "No. This guide explains risks and considerations only. It makes no prediction about bitcoin's future price and is not personalized investment, tax, or legal advice. Talk to a qualified financial advisor before making retirement decisions involving crypto." },
    ],
    sources: [
      { label: "IRS — Frequently Asked Questions on Virtual Currency Transactions", url: "https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-virtual-currency-transactions" },
      { label: "SEC Investor.gov — Crypto Asset Securities Investor Alert", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/crypto-asset-securities" },
      { label: "Fidelity Digital Assets — A Closer Look at Bitcoin's Volatility", url: "https://www.fidelitydigitalassets.com/research-and-insights/closer-look-bitcoins-volatility" },
    ],
  },

  // -- keyword-gap-pass 2026-07-22: international-retirement-calculators --
  {
    slug: "international-retirement-calculators",
    title: "International Retirement Calculators: A Country Guide",
    metaDescription:
      "Looking for an international retirement calculator? Ours covers U.S. rules only — find your country's own official pension planning tool instead.",
    h1: "International Retirement Calculators: Find Your Country's Official Tool",
    cardBlurb: "Our calculator models U.S. rules. Here's where to find official retirement resources for the UK, Canada, India, Australia, and New Zealand.",
    intro:
      "Our [retirement calculator](/retirement/) is built around U.S. tax law and Social Security rules, so it will not give you an accurate answer if you live outside the United States. Each country runs its own pension system, with its own rules, ages, and formulas. Below are the official government resources for the UK, Canada, India, Australia, and New Zealand, so you land somewhere genuinely useful.",
    sections: [
      { heading: "Why a U.S. retirement calculator doesn't work abroad", body: "Retirement calculators are built around a specific country's tax code, retirement accounts, and government benefit formulas. Ours models U.S. 401(k) and IRA rules, U.S. federal tax brackets, and the Social Security benefit formula.\n\nNone of those rules apply outside the United States. A UK reader has no 401(k) or Social Security; they have workplace pensions and the State Pension instead. Using a U.S. tool with non-U.S. numbers gives you a meaningless result." },
      { heading: "United Kingdom: State Pension and workplace pensions", body: "The UK's government-run retirement benefit is the [State Pension](https://www.gov.uk/state-pension-age), administered by the Department for Work and Pensions. Your State Pension age depends on your date of birth, and your amount depends on your National Insurance record.\n\nCheck your own State Pension age and get a forecast directly on GOV.UK before you make any retirement plans." },
      { heading: "Canada: CPP and Old Age Security", body: "Canada's public retirement system has two main parts, both explained on [Canada.ca](https://www.canada.ca/en/services/benefits/publicpensions.html): the Canada Pension Plan (CPP), funded by your own contributions, and Old Age Security (OAS), funded through general tax revenue.\n\nEligibility, ages, and amounts for both differ from anything in the U.S. system. Use the official Canada.ca public pensions page to check your own numbers." },
      { heading: "India: Employees' Provident Fund", body: "India's main retirement savings system for salaried workers is the Employees' Provident Fund, run by the [Employees' Provident Fund Organisation](https://www.epfindia.gov.in/site_en/) (EPFO), a Government of India agency.\n\nEPF works through mandatory employer and employee contributions to a member account, with its own withdrawal and pension rules. Check your balance and rules through EPFO's official member portal, not a third-party site." },
      { heading: "Australia and New Zealand: superannuation systems", body: "Australia's retirement system is built on superannuation, a mandatory employer contribution to a private super fund. [Services Australia](https://www.servicesaustralia.gov.au/superannuation) explains how super interacts with the government Age Pension.\n\nNew Zealand runs a different system called NZ Superannuation, a universal government payment available from age 65 regardless of income or assets. Check your own eligibility on [Work and Income](https://www.workandincome.govt.nz/eligibility/seniors/superannuation/index.html), the New Zealand government agency that administers it." },
    ],
    tools: [
      { href: "/retirement/", label: "U.S. retirement calculator" },
    ],
    faqs: [
      { question: "Does ModernWallet's retirement calculator work outside the United States?", answer: "No. Our retirement calculator is built around U.S. tax brackets, 401(k) and IRA rules, and the Social Security benefit formula. It will not give an accurate projection for a non-U.S. pension or tax system." },
      { question: "Where can I find my country's official retirement calculator?", answer: "Start with your own government's retirement or pensions agency. This guide links directly to the official UK, Canadian, Indian, Australian, and New Zealand government pages that explain each country's system." },
      { question: "What is the UK equivalent of U.S. Social Security?", answer: "The UK's government-run retirement benefit is the State Pension, administered by the Department for Work and Pensions. Your amount depends on your National Insurance record, and your State Pension age depends on your date of birth." },
      { question: "What is superannuation?", answer: "Superannuation is Australia's mandatory employer-funded retirement savings system, similar in spirit to a 401(k) but required by law. New Zealand uses a different, separate system called NZ Superannuation, a universal government pension paid from age 65." },
      { question: "Is India's EPF the same as a U.S. 401(k)?", answer: "They are similar in concept but run under very different rules. The Employees' Provident Fund is a mandatory employer-and-employee-funded retirement account administered by India's EPFO, a government agency, with its own contribution and withdrawal rules distinct from any U.S. plan." },
    ],
    sources: [
      { label: "GOV.UK — Check your State Pension age", url: "https://www.gov.uk/state-pension-age" },
      { label: "Canada.ca — Public pensions", url: "https://www.canada.ca/en/services/benefits/publicpensions.html" },
      { label: "EPFO — Employees' Provident Fund Organisation", url: "https://www.epfindia.gov.in/site_en/" },
      { label: "Services Australia — Superannuation", url: "https://www.servicesaustralia.gov.au/superannuation" },
      { label: "Work and Income NZ — New Zealand Superannuation", url: "https://www.workandincome.govt.nz/eligibility/seniors/superannuation/index.html" },
    ],
  },

  // -- keyword-gap-pass 2026-07-22: high-yield-savings-account-for-kids-and-teens --
  {
    slug: "high-yield-savings-account-for-kids-and-teens",
    title: "High-Yield Savings Accounts for Kids and Teens",
    metaDescription:
      "How to open a high-yield savings account for kids, teens, and college students. Custodial rules, joint accounts, and age limits explained.",
    h1: "High-Yield Savings Accounts for Kids, Teens, and College Students",
    cardBlurb: "Custodial rules, joint accounts, and age limits for opening a HYSA for a child, teen, college student, or small business.",
    intro:
      "A high-yield savings account for kids works differently than one for an adult, mainly because of one rule: banks require an adult owner until the child turns 18. This guide walks through custodial and joint account options for kids, teens, college students, and even small businesses. Once you understand the age rules, you can compare real rates with our [high-yield savings calculator](/investing/high-yield-savings-calculator/).",
    sections: [
      { heading: "The core rule: minors need an adult on the account", body: "Most banks require you to be 18 to open a savings account entirely on your own. Below that age, a child's high-yield savings account must be a joint account, with a parent or legal guardian as a co-owner.\n\nThe [FDIC's Youth Banking Resource Center](https://www.fdic.gov/consumer-resource-center/youth-banking-resource-center) confirms that banks typically structure these accounts with an adult as a joint owner or custodian until the child turns 18, since a minor generally cannot sign a binding account agreement alone.\n\nThe parent or guardian on a joint account typically keeps full access and control, while the child builds a savings habit and, at many banks, gets a linked debit card with adult oversight." },
      { heading: "Custodial accounts: UTMA and UGMA", body: "A custodial account, opened under your state's version of the [Uniform Transfers to Minors Act](https://www.uniformlaws.org/committees/community-home?CommunityKey=4b0fd839-f40d-4021-af03-406e499ca67c) (UTMA) or Uniform Gifts to Minors Act (UGMA), is a different structure than a simple joint savings account. The money legally belongs to the child, but a custodian, usually a parent, manages it until the child reaches the account's transfer age.\n\nThat transfer age is set by state law and is typically 18 to 21, though a handful of states allow it to run later. Once a child reaches that age, they gain full control of the account, so custodial accounts work best when you're comfortable handing over full control at that age.\n\nInterest earned in a custodial account is the child's income for tax purposes. Under [2026 IRS rules](https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill), the first $1,350 of a child's unearned income is tax-free, the next $1,350 is taxed at the child's rate, and amounts above $2,700 can be taxed at the parent's rate under the kiddie tax. Most kids' HYSA balances stay well under that threshold." },
      { heading: "Teens: joint accounts that build independence", body: "For teens roughly 13 to 17, many banks and credit unions offer a joint high-yield savings account designed to teach money management. The parent co-owns the account, but the teen usually gets their own login and, sometimes, a debit card tied to a linked checking account.\n\nThis setup lets a teen watch their own balance grow while a parent retains oversight and can step in if needed. When the teen turns 18, most banks convert the account to an individual account in their name only, or the teen opens a new one and transfers the balance." },
      { heading: "College students: the transition to a solo account", body: "Once a student turns 18, they can open a high-yield savings account entirely in their own name, no parent required. Many banks offer student-specific savings or checking bundles with fee waivers while enrolled in school.\n\nA HYSA is a good home for a college student's emergency cushion or savings toward summer expenses, since the money stays liquid and earns a competitive rate. Compare current rates and see how a starting balance grows over a semester or a year with our [high-yield savings calculator](/investing/high-yield-savings-calculator/)." },
      { heading: "Small businesses: a different account type entirely", body: "A high-yield savings account for a small business is a separate product from a personal or custodial account, and it isn't tied to age rules at all. Business owners open these under the business's legal name and tax ID, usually an EIN, rather than a Social Security number.\n\nBusiness savings accounts sometimes carry lower rates or added fees compared with personal HYSAs, so compare terms carefully before moving business cash into one." },
      { heading: "Which account should you open?", body: "Match the account to the age and goal. A young child usually needs a joint savings account with a parent as co-owner, or a custodial UTMA/UGMA account if you want the money legally titled to the child.\n\nA teen benefits from a joint teen-specific savings account that builds financial habits before adulthood. A college student, once 18, can open a standard HYSA solo.\n\nIf you're weighing a savings account against an investment account for a child's longer-term goals, see our guide on the [best investment account for kids](/guides/best-investment-account-for-kids/) for how a HYSA fits alongside options like a 529 or custodial brokerage account." },
    ],
    tools: [
      { href: "/investing/high-yield-savings-calculator/", label: "High-yield savings" },
    ],
    faqs: [
      { question: "What age can a child open a high-yield savings account?", answer: "Most banks let anyone 18 or older open an individual high-yield savings account. Below 18, a child's account must be joint with a parent or legal guardian, or structured as a custodial UTMA/UGMA account managed by an adult." },
      { question: "What's the difference between a joint account and a custodial account for a kid?", answer: "A joint account is co-owned by a parent and child, with the parent typically retaining full access. A custodial UTMA or UGMA account legally belongs to the child from the start, with a parent managing it as custodian until the child reaches the state's transfer age, usually 18 to 21." },
      { question: "Is interest in a kid's savings account taxable?", answer: "Yes. Interest earned in a child's account is generally the child's taxable income. Under 2026 IRS rules, the first $1,350 of a child's unearned income is tax-free, the next $1,350 is taxed at the child's rate, and amounts above $2,700 can be taxed at the parent's rate under the kiddie tax." },
      { question: "Can a college student open their own high-yield savings account?", answer: "Yes. Once a student turns 18, they can open an individual high-yield savings account with no parent required. Many banks offer student account bundles with fee waivers while the student is enrolled in school." },
      { question: "Can a small business open a high-yield savings account?", answer: "Yes. Business high-yield savings accounts are opened under the business's legal name and EIN rather than an individual's Social Security number, and they aren't governed by the age rules that apply to personal or custodial accounts." },
    ],
    sources: [
      { label: "IRS — Tax inflation adjustments for tax year 2026", url: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill" },
      { label: "FDIC — Youth Banking Resource Center", url: "https://www.fdic.gov/consumer-resource-center/youth-banking-resource-center" },
    ],
  },

  // -- keyword-gap-pass 2026-07-22: international-high-yield-savings-accounts --
  {
    slug: "international-high-yield-savings-accounts",
    title: "International High-Yield Savings Accounts: What to Know",
    metaDescription:
      "Our high-yield savings guides cover FDIC-insured U.S. accounts. International savers: find your own country's official deposit protection scheme here.",
    h1: "International High-Yield Savings Accounts: Find Your Own Deposit Protection",
    cardBlurb: "Our HYSA content covers FDIC-insured U.S. accounts. Here's where non-U.S. savers can check their own country's deposit protection scheme.",
    intro:
      "ModernWallet's high-yield savings account content is built around U.S., [FDIC](https://www.fdic.gov/resources/deposit-insurance/)-insured banks. If you live outside the United States, FDIC insurance does not apply to your deposits at all, even if a foreign bank shares a name or brand with a U.S. one. This guide points you toward your own country's official deposit protection scheme instead.",
    sections: [
      { heading: "Why FDIC insurance is a U.S.-only protection", body: "FDIC insurance covers deposits at FDIC-insured U.S. banks up to $250,000 per depositor, per bank, for each account ownership category. It is a U.S. federal program and does not extend to banks headquartered or operating outside the United States.\n\nEvery country with a modern banking system runs its own, separate deposit protection scheme, usually through its central bank or a dedicated deposit insurance agency. The coverage limits, currencies, and rules are set independently by each country." },
      { heading: "United Kingdom: the FSCS", body: "UK depositors are protected by the [Financial Services Compensation Scheme](https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/) (FSCS), which covers eligible deposits at UK-authorised banks, building societies, and credit unions. As of December 1, 2025, the FSCS protection limit is £120,000 per person, per authorised institution, up from the prior £85,000 limit.\n\nCheck the FSCS's own site to confirm whether your specific bank is covered, since some UK-facing brands are actually operated under a shared banking license." },
      { heading: "Zambia and Zimbabwe: newer deposit protection schemes", body: "Zambia introduced the Zambia Deposit Insurance Scheme in 2025, run by the [Bank of Zambia](https://www.boz.zm/Public_Notice_Deposit_Insurance_Scheme.pdf), the country's central bank. It covers depositors at licensed banks and deposit-taking financial institutions up to K250,000 per depositor, per institution.\n\nZimbabwe's [Deposit Protection Corporation](https://dpcorp.co.zw/2026/07/06/dpc-agm-2026-highlights-strong-growth-governance-and-future-readiness/) (DPC) insures deposits at contributing banks. As of July 2026, coverage runs up to US$3,000 per depositor for banks and US$2,000 for deposit-taking microfinance institutions, up from US$1,000 and US$500 previously. Confirm current limits directly with each institution, since these schemes are relatively new and limits can change." },
      { heading: "New Zealand: the Depositor Compensation Scheme", body: "New Zealand's Depositor Compensation Scheme (DCS), run by the [Reserve Bank of New Zealand](https://www.rbnz.govt.nz/dcs), took effect on July 1, 2025. It covers up to NZ$100,000 per depositor, per covered institution, across banks, building societies, credit unions, and some finance companies.\n\nAll eligible deposits are automatically covered, so New Zealand savers don't need to apply or opt in." },
      { heading: "What to do if your country isn't listed here", body: "Deposit protection schemes exist in most developed and many developing economies, even when they're not covered in this guide. Search for your own central bank's website and look for terms like 'deposit insurance' or 'deposit protection' to find the official page.\n\nIf you cannot verify an official deposit protection scheme for your country, treat that as important information on its own. A bank account without any deposit protection carries real risk that a U.S. HYSA does not." },
    ],
    tools: [
      { href: "/investing/high-yield-savings-calculator/", label: "U.S. high-yield savings calculator" },
    ],
    faqs: [
      { question: "Does FDIC insurance cover my savings account outside the United States?", answer: "No. FDIC insurance only applies to deposits at FDIC-insured banks operating in the United States. If you bank outside the U.S., your deposits are protected, if at all, only by your own country's deposit protection scheme." },
      { question: "What is the UK equivalent of FDIC insurance?", answer: "The UK's Financial Services Compensation Scheme (FSCS) protects eligible deposits at UK-authorised banks, building societies, and credit unions. As of December 1, 2025, the FSCS limit is £120,000 per person, per institution." },
      { question: "Are savings accounts insured in Zambia and Zimbabwe?", answer: "Yes. Zambia's Zambia Deposit Insurance Scheme, run by the Bank of Zambia, covers up to K250,000 per depositor. Zimbabwe's Deposit Protection Corporation covers up to US$3,000 per depositor at banks, as of mid-2026." },
      { question: "What protects savings deposits in New Zealand?", answer: "New Zealand's Depositor Compensation Scheme, run by the Reserve Bank of New Zealand, covers up to NZ$100,000 per depositor, per covered institution. It took effect on July 1, 2025, and covers eligible deposits automatically." },
      { question: "What if I can't find my country's deposit protection scheme?", answer: "Search your central bank's official website for terms like 'deposit insurance' or 'deposit protection.' If you can't verify a scheme exists, treat the lack of protection as a real risk when deciding where to keep savings." },
    ],
    sources: [
      { label: "FDIC — Deposit Insurance", url: "https://www.fdic.gov/resources/deposit-insurance/" },
      { label: "FSCS — What We Cover: Banks, Building Societies, Credit Unions", url: "https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/" },
      { label: "Bank of Zambia — Public Notice: Deposit Insurance Scheme", url: "https://www.boz.zm/Public_Notice_Deposit_Insurance_Scheme.pdf" },
      { label: "Deposit Protection Corporation Zimbabwe — 2026 AGM coverage update", url: "https://dpcorp.co.zw/2026/07/06/dpc-agm-2026-highlights-strong-growth-governance-and-future-readiness/" },
      { label: "Reserve Bank of New Zealand — Depositor Compensation Scheme", url: "https://www.rbnz.govt.nz/dcs" },
    ],
  },

];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
