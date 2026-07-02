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
      { heading: "What a money market account is", body: "A money market account (MMA) is an interest-bearing deposit account at a bank or credit union. The CFPB describes MMAs as savings-style accounts that tend to pay higher interest than plain savings accounts. They often allow limited check writing and debit card use, which regular savings accounts usually do not.\n\nMost MMAs require a higher minimum balance than a basic savings account, sometimes $1,000 or more. Some banks pay a higher rate only if you keep a balance above a set threshold. Read the fee schedule before opening one, because monthly fees can wipe out the extra interest on smaller balances." },
      { heading: "MMA vs money market mutual fund", body: "This is the single biggest source of confusion. A money market account is a bank deposit, and it is FDIC insured. A money market mutual fund is an investment sold by brokerage firms, and it is not FDIC insured, though it may have SIPC coverage.\n\nThe CFPB warns that these two products follow different regulations even though they share a similar name. If someone tells you their money market pays a much higher rate than any bank, they may mean a mutual fund. Check the account paperwork for the phrase 'FDIC insured' before you deposit money." },
      { heading: "FDIC coverage rules that protect your cash", body: "FDIC insurance covers deposits at insured banks up to $250,000 per depositor, per bank, per ownership category. Money market deposit accounts, savings accounts, checking accounts, and CDs all fall under this coverage. Credit union deposits get the same protection through the NCUA.\n\nA couple can effectively cover more by using different ownership categories. Two individual accounts and one joint account at the same bank give a couple up to $1,000,000 in coverage. The FDIC's Electronic Deposit Insurance Estimator (EDIE) calculates your exact coverage based on how the accounts are titled." },
      { heading: "MMA vs high-yield savings account (HYSA)", body: "Both accounts are FDIC-insured bank deposits that pay competitive interest. The differences show up in access and minimums. MMAs often allow limited check writing and a debit card, while HYSAs typically require an online transfer to move money. HYSAs from online-only banks often pay higher rates and have lower minimums.\n\nPick an MMA when you want quick check or debit access to a large cash balance, like a home down payment fund you may need on short notice. Pick an HYSA when the highest rate matters most and you do not need check-writing. Use our [high-yield savings calculator](/investing/high-yield-savings-calculator/) to compare rates in real dollars." },
      { heading: "MMA vs CD (certificate of deposit)", body: "A certificate of deposit (CD) locks your money for a fixed term, usually 3 months to 5 years, in exchange for a set interest rate. CDs typically charge an early-withdrawal penalty if you break the term. MMAs stay liquid and let you withdraw anytime, but their rate can change at any time.\n\nUse a CD when you know the exact date you need the cash and rates might drop. Use an MMA when you need flexibility or the timeline is uncertain. Many savers ladder CDs by opening several with staggered maturity dates, keeping some cash accessible while locking in longer-term rates. Model your goal with our [savings goal calculator](/investing/savings-goal-calculator/)." },
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
    ],
    sources: [
      { label: "CFPB — What is a money market account?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-money-market-account-en-915/" },
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
      "This first-time estate planning guide covers what you actually need at each net-worth tier, what it costs, and the order to tackle the documents. Below the federal $15M estate tax exemption and any state exemption, estate planning is about probate avoidance, guardianship for minors, and decision-making during incapacity — not about saving taxes. Above those thresholds, the analysis flips to tax planning, and attorney-drafted irrevocable trusts become essential.",
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
        heading: "Step 5: Distribution and closing",
        body:
          "After creditor claims are resolved and taxes are paid, the executor distributes remaining assets according to the will (or state intestacy law if there's no will). The court reviews the final accounting, approves distributions, and discharges the executor.\n\nUncontested probate closes in 6-12 months in most states, 9-18 months with real estate, 12-24 months in California and New York, and 3-6 months in Texas independent administration. Contested probate — will contests, creditor litigation, fiduciary disputes — stretches to 2-5 years with costs escalating 5-10× the uncontested baseline.",
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
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
