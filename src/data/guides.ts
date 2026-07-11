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
    ],
    sources: [
      { label: "SEC Investor.gov — Choosing an Investment Professional", url: "https://www.investor.gov/introduction-investing/getting-started/working-investment-professional" },
      { label: "SEC — Investment Adviser Public Disclosure (IAPD)", url: "https://adviserinfo.sec.gov/" },
      { label: "FINRA — BrokerCheck", url: "https://brokercheck.finra.org/" },
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
    ],
    tools: [
      { href: "/investing/high-yield-savings-calculator/", label: "High-yield savings" },
      { href: "/investing/savings-goal-calculator/", label: "Savings goal" },
    ],
    faqs: [
      { question: "What is a money market account?", answer: "A money market account (MMA) is an interest-bearing deposit account at a bank or credit union. The CFPB notes that MMAs usually pay higher interest than regular savings accounts and often allow limited check writing or debit card use. MMAs are FDIC insured up to $250,000 per depositor, per bank." },
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
          "Four documents cover the essentials for most households. First, a last will and testament — names an executor, distributes assets, and (critically for parents) nominates a guardian for minor children. Second, a durable power of attorney — appoints someone to handle finances during any incapacity BEFORE death. Third, an advance healthcare directive with HIPAA release — appoints a healthcare agent and states your wishes for end-of-life care. Fourth, a beneficiary designation review — the 401(k), IRA, and life insurance beneficiary forms override your will, so those matter more than most people realize.\n\nCost: attorney-drafted, $500 to $1,500 for the package in most states (California, New York, Massachusetts run 20-35% higher). Online, the same package runs $199 to $299 through Trust & Will, $129 to $229 through LegalZoom Basic, or $0 through FreeWill. See specifics with our [will cost calculator](/estate-planning/will-cost-calculator/).",
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
      "How to protect assets from nursing home costs: 5-year Medicaid lookback, MAPT, spend-down, home protection, and CSRA. Not legal advice — consult an elder-law attorney.",
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
    metaDescription: "529 qualified expenses include tuition, fees, books, room & board, computers, K-12 tuition up to $20,000/yr, apprenticeships, and up to $10,000 in student loans.",
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
    metaDescription: "The best investment account for kids depends on your goal. Compare the Trump Account, 529, custodial brokerage, and custodial Roth IRA — and learn to layer them.",
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
        body: "Do not agonize over a single choice — follow this order and layer as you go:\n\n1. Eligible for the Trump Account seed? Claim the free $1,000 first. It costs nothing.\n\n2. Saving mainly for college? Open a 529 next for its tax-free growth and lighter FAFSA treatment.\n\n3. Want flexibility for non-college goals? Add a custodial UTMA brokerage — but remember the child controls it as an adult.\n\n4. Does your teen have a job? Open a custodial Roth IRA and match part of their earnings for a tax-free retirement head start.\n\n5. Need money within a year or two? Keep it in an HYSA, not the market.\n\nA Coverdell ESA can supplement education savings but caps at $2,000 a year, so most families choose a 529 instead. The insight worth repeating: the strongest plan for most households is a stack — the free Trump seed, a 529 for college, and a custodial Roth once a teen works — not a single \"best\" account."
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
        body: "Time is the reason. A dollar invested at 15 has 50 years to compound before a normal retirement age. That is a head start most adults never get.\n\nStarting young also builds the habit. A teen who watches their own account grow learns how investing works before they have real bills.\n\nA custodial Roth is not the only kids' account, and it is not always the right one — it depends on whether the child earns income. Compare it with a flexible custodial account in [custodial Roth IRA vs UTMA](/compare/custodial-roth-ira-vs-utma/), and with the new federal option in [Trump Account vs Roth IRA](/compare/trump-account-vs-roth-ira/)."
      }
    ],
    tools: [ { href: "/investing/", label: "Investment calculator" } ],
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
  ...BUSINESS_GUIDES,
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
