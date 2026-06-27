import type { SpokeEntry } from "./types";

// RetirementIQ (retirement) spokes. Powered by src/lib/retirement.ts (projection / early-withdrawal /
// RMD), selected by `mode` in each preset. CONTENT: keyword-gap system — guided research+write (IRS /
// DOL / SSA primary sources, engine ground-truth figures) + adversarial audit per page. See CONTENT.md.

export const RETIREMENT_SPOKES: SpokeEntry[] = [
  {
    calculator: "retirement",
    slug: "401k-early-withdrawal-calculator",
    title: "401k Early Withdrawal Calculator: See Your Real Cost",
    metaDescription:
      "Use our 401k early withdrawal calculator to see the penalty, taxes, and lost growth before you cash out. Find out exactly how much you'd actually keep.",
    targetKeyword: "401k early withdrawal calculator",
    estimatedVolume: 8100,
    estimatedKD: 41,
    h1: "401k Early Withdrawal Calculator",
    intro:
      "This 401k early withdrawal calculator shows exactly how much you keep after taxes and penalties. Cashing out a 401(k) before age 59½ usually triggers a 10% IRS penalty plus regular income tax. The real damage goes further: you also lose decades of compound growth. Enter your numbers in the calculator above to see your true cost.",
    howItWorks:
      "The calculator multiplies your withdrawal by three costs. First, the IRS adds a 10% early-withdrawal penalty on most distributions before age 59½. Second, the money counts as ordinary income, so you owe federal tax at your bracket. Third, most states tax it too.\n\nThe tool then projects what that same money could have earned if left invested. It uses your expected return and years to retirement. This lost growth is often the biggest cost, and it never shows up on your tax bill. To see what your balance could become if you leave it alone, try the [401k calculator](/retirement/401k-calculator/).",
    commonMistakes: [
      "Thinking the 10% penalty is the only cost. You also owe federal and state income tax on the full amount.",
      "Assuming an exception removes all costs. Exceptions like disability or the Rule of 55 waive the 10% penalty, but you still owe income tax.",
      "Trusting the plan's automatic withholding to cover your taxes. The default 20% federal withholding often falls short of your real bill.",
      "Ignoring lost compound growth. The withdrawal you spend today can never grow for retirement again.",
      "Forgetting the withdrawal can push you into a higher tax bracket, raising the rate on your top dollars.",
    ],
    workedExample:
      "A 40-year-old withdraws $25,000 from a 401(k). She is in the 22% federal bracket and pays 5% state tax. The 10% penalty costs $2,500. Federal income tax adds $5,500, and state tax adds $1,250. That is $9,250 in total cost, or 37% of the withdrawal. She keeps just $15,750. Worse, if she left the $25,000 invested at 7% for her 27 years to retirement, it could have grown by about $130,347.",
    faqs: [
      { question: "How much do I keep with a 401k early withdrawal calculator?", answer: "You keep your withdrawal minus the 10% penalty, federal income tax, and state tax. For a 40-year-old withdrawing $25,000 in the 22% bracket with 5% state tax, total cost is $9,250, leaving $15,750. The calculator above shows your exact figures." },
      { question: "What is the penalty for withdrawing from a 401(k) early?", answer: "The penalty is a 10% additional tax on most distributions taken before age 59½. It applies on top of the regular income tax you owe. On a $25,000 withdrawal, the penalty alone is $2,500." },
      { question: "Are there exceptions to the 10% early withdrawal penalty?", answer: "Yes. The IRS waives the 10% penalty for several situations, including separation from service at age 55 or older, total disability, and large unreimbursed medical expenses. Important: these exceptions remove the penalty but not the income tax." },
      { question: "Will my 401(k) withholding cover my full tax bill?", answer: "Often not. Plans usually withhold 20% for federal tax by default, but your actual bill can be higher. It may also miss the 10% penalty and state tax, leaving a balance due at tax time." },
      { question: "Is a hardship withdrawal taxed and penalized?", answer: "Usually yes. According to the IRS, hardship distributions are subject to income tax and may also face the 10% additional tax on early distributions. A hardship reason does not automatically make the withdrawal tax-free." },
    ],
    sources: [
      { label: "IRS Topic No. 558, Additional Tax on Early Distributions From Retirement Plans", url: "https://www.irs.gov/taxtopics/tc558" },
      { label: "IRS — Retirement Topics: Hardship Distributions", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-hardship-distributions" },
    ],
    toolHeading: "What will an early 401(k) withdrawal really cost?",
    toolSubheading: "See the penalty, taxes, and lost future growth before you cash out.",
    preset: { mode: "early-withdrawal", withdrawalAmount: 25000, age: 40, federalTaxRatePct: 22, stateTaxRatePct: 5, yearsToRetirement: 27, annualReturnPct: 7 },
    relatedSlugs: ["401k-calculator", "retirement-savings-calculator", "rmd-calculator"],
  },

  {
    calculator: "retirement",
    slug: "401k-calculator",
    title: "401k Calculator: Project Your Retirement Growth",
    metaDescription:
      "Use our free 401k calculator to project how much your 401(k) will grow by retirement, based on your contributions, employer match, and returns.",
    targetKeyword: "401k calculator",
    estimatedVolume: 135000,
    estimatedKD: 58,
    h1: "401k Calculator: See How Much Your 401(k) Will Grow",
    intro:
      "This 401k calculator projects how much your 401(k) will be worth when you retire. Enter your current balance, monthly contributions, expected return, and the years until retirement. The calculator above then shows your savings at retirement and how much comes from growth versus your own deposits. Use it to test how small changes today shape your future nest egg.",
    howItWorks:
      "The 401k calculator grows your current balance and monthly contributions forward to your retirement age. It assumes a fixed annual return that compounds each year. You enter your starting balance, monthly contribution (including any employer match), expected yearly return, and target retirement age.\n\nThe tool then splits your final balance into two parts: the money you put in and the investment growth on top. This split reveals the power of compounding. Real markets rise and fall, so treat the result as a planning estimate, not a guarantee. To plan beyond your workplace plan, see the [retirement savings calculator](/retirement/retirement-savings-calculator/).",
    commonMistakes: [
      "Skipping the full employer match. The match is free money and an instant return on your contribution. Always contribute enough to capture every matching dollar your employer offers.",
      "Forgetting to include the employer match in your monthly contribution figure. The calculator expects your total monthly deposit, so add your share plus your employer's.",
      "Setting an unrealistic return rate. A fixed 7% is a common long-term stock estimate, but higher numbers can badly overstate your balance.",
      "Waiting too long to start. Starting at 30 instead of 40 gives your money an extra decade to compound, which often doubles the final result.",
      "Ignoring the 2026 contribution limit. You can defer up to $24,500 in 2026, plus an $8,000 catch-up if you are age 50 or older.",
    ],
    workedExample:
      "Say you are 30 years old with $20,000 already in your 401(k). You contribute $800 per month, including your employer match, and expect a 7% annual return until you retire at 65. The calculator projects $1,540,606 in savings at retirement. Your $20,000 starting balance plus $336,000 in contributions over 35 years make up the money you put in, while investment growth adds $1,184,606. Using the 4% rule, that balance could provide about $5,135 per month in your first year of retirement.",
    faqs: [
      { question: "What does a 401k calculator do?", answer: "A 401k calculator projects how much your 401(k) will grow by retirement. You enter your balance, monthly contributions, expected return, and retirement age. It then estimates your final savings and shows how much comes from growth versus your own deposits." },
      { question: "How much can I contribute to a 401(k) in 2026?", answer: "You can contribute up to $24,500 to your 401(k) in 2026. If you are age 50 or older, you can add an $8,000 catch-up contribution, for a total of $32,500. These limits apply to your own deferrals, not employer matching." },
      { question: "Does the calculator include my employer match?", answer: "Yes, if you include the match in your monthly contribution. Enter your total monthly deposit, combining your own contribution and your employer's match. The employer match is essentially free money, so contribute enough to earn the full amount offered." },
      { question: "What return rate should I use?", answer: "Many planners use a fixed 7% annual return as a long-term stock market estimate. The calculator assumes this rate stays the same every year. Real returns vary, so treat the projection as an estimate and try a few different rates." },
      { question: "What if I withdraw from my 401(k) early?", answer: "Withdrawing before age 59½ usually costs a 10% penalty plus income tax, and it erases future growth. Estimate the damage first with our [401k early withdrawal calculator](/retirement/401k-early-withdrawal-calculator/) before cashing out." },
    ],
    sources: [
      { label: "IRS — 401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500", url: "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500" },
      { label: "IRS — Retirement Topics: 401(k) and Profit-Sharing Plan Contribution Limits", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits" },
      { label: "IRS — Retirement Topics: Catch-up Contributions", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions" },
    ],
    toolHeading: "Project your 401(k) at retirement",
    toolSubheading: "See how contributions plus the employer match compound over your career.",
    preset: { mode: "projection", currentAge: 30, retirementAge: 65, currentSavings: 20000, monthlyContribution: 800, annualReturnPct: 7 },
    relatedSlugs: ["retirement-savings-calculator", "401k-early-withdrawal-calculator", "rmd-calculator"],
  },

  {
    calculator: "retirement",
    slug: "retirement-savings-calculator",
    title: "Retirement Savings Calculator: Saving Enough?",
    metaDescription:
      "Use our retirement savings calculator to project how much your nest egg will grow and estimate your future monthly income from those savings.",
    targetKeyword: "retirement savings calculator",
    estimatedVolume: 14000,
    estimatedKD: 50,
    h1: "Retirement Savings Calculator",
    intro:
      "This retirement savings calculator shows how much your nest egg could grow by the day you retire. Enter your age, current savings, monthly contribution, and an expected return. The calculator above then projects your balance and estimates your first-year monthly income. Use it to answer one question: am I saving enough?",
    howItWorks:
      "The calculator above grows your current savings and future contributions at a fixed annual return until your chosen retirement age. It then applies the 4% rule to estimate a safe yearly withdrawal, which it shows as monthly income.\n\nTwo numbers here are assumptions, not promises. The return is a single fixed rate, so real markets will vary year to year. The 4% safe-withdrawal rate is a common planning guideline, not a guarantee. Treat the result as a planning estimate and update it as your savings change. To model a workplace plan specifically, use the [401k calculator](/retirement/401k-calculator/).",
    commonMistakes: [
      "Assuming the fixed return is guaranteed. Real returns swing each year, so treat the projection as an estimate, not a locked-in number.",
      "Ignoring sequence-of-returns risk. Poor market years early in retirement can shrink a portfolio faster than the 4% rule assumes.",
      "Waiting to start. Delaying contributions costs you compounding, which does most of the heavy lifting over decades.",
      "Forgetting inflation. Future dollars buy less, so a projected balance is worth less than it looks today.",
      "Counting on the 4% rule as a promise. It is a planning guideline, and your safe withdrawal may be higher or lower.",
    ],
    workedExample:
      "Say you are 40, plan to retire at 67, and have $100,000 saved today. You add $1,000 a month and assume a 7% annual return. The calculator projects $1,515,193 at retirement. Of that, your $100,000 starting balance and $324,000 in contributions over 27 years are the money you put in, while investment growth adds $1,091,193. Notice the gap: growth dwarfs the money you put in, thanks to compounding. At the 4% rule, that balance supports about $5,051 a month in first-year retirement income.",
    faqs: [
      { question: "How does this retirement savings calculator work?", answer: "This retirement savings calculator grows your current balance and monthly contributions at a fixed annual return until your retirement age. It then applies the 4% rule to estimate your first-year monthly income. The return and withdrawal rate are assumptions, so the result is a planning estimate." },
      { question: "What is the 4% rule?", answer: "The 4% rule is a guideline that you can withdraw about 4% of your savings in your first year of retirement. The calculator uses it to estimate monthly income. It is a planning assumption, not a guarantee, because market returns and spending vary." },
      { question: "Why is investment growth larger than what I contribute?", answer: "Compounding does the heavy lifting over long periods. In the example above, a $100,000 starting balance plus $324,000 in contributions grows into $1,515,193, with $1,091,193 of that coming from growth alone. The longer your money stays invested, the more this gap widens." },
      { question: "When must I start withdrawing from these accounts?", answer: "Age 73 for traditional IRAs and 401(k)s, under the IRS required minimum distribution rules. Roth IRAs are exempt for the owner. Estimate your first required withdrawal with our [RMD calculator](/retirement/rmd-calculator/)." },
      { question: "What if real returns are lower than my estimate?", answer: "Then your actual balance will be smaller than the projection. The calculator uses one fixed return, but real markets rise and fall. Poor returns early in retirement, called sequence-of-returns risk, can hurt most. Revisit your plan and contributions often." },
    ],
    sources: [
      { label: "U.S. Department of Labor — Top 10 Ways to Prepare for Retirement", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/top-10-ways-to-prepare-for-retirement" },
      { label: "IRS — Retirement Topics: 401(k) and Profit-Sharing Plan Contribution Limits", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits" },
    ],
    toolHeading: "Are you saving enough for retirement?",
    toolSubheading: "Project your nest egg and your first-year monthly income.",
    preset: { mode: "projection", currentAge: 40, retirementAge: 67, currentSavings: 100000, monthlyContribution: 1000, annualReturnPct: 7 },
    relatedSlugs: ["401k-calculator", "401k-early-withdrawal-calculator", "rmd-calculator"],
  },

  {
    calculator: "retirement",
    slug: "rmd-calculator",
    title: "RMD Calculator: Required Minimum Distribution 2026",
    metaDescription:
      "Free RMD calculator finds your required minimum distribution. See how much you must withdraw from your IRA or 401(k) at age 73 and avoid the penalty.",
    targetKeyword: "RMD calculator",
    estimatedVolume: 33000,
    estimatedKD: 47,
    h1: "RMD Calculator: Find Your Required Minimum Distribution",
    intro:
      "This RMD calculator shows how much you must withdraw from your retirement account this year. A required minimum distribution (RMD) is the amount the IRS makes you take from traditional IRAs and 401(k)s once you reach age 73. Enter your prior year-end balance and age in the calculator above to get your number in seconds.",
    howItWorks:
      "The RMD calculator divides your account balance by an IRS life expectancy factor. It uses your balance as of December 31 last year and your age this year. The IRS Uniform Lifetime Table sets the distribution period for your age. At age 73, that period is 26.5.\n\nSo the math is simple: balance divided by the distribution period equals your RMD. A larger balance or a younger age raises the amount you must withdraw. The calculator above handles the table lookup for you.",
    commonMistakes: [
      "Missing the deadline. Most RMDs are due by December 31. Your very first RMD can wait until April 1 of the year after you turn 73, but taking two that year raises your taxable income.",
      "Ignoring the steep penalty. A missed RMD triggers a 25% excise tax on the amount you should have withdrawn. It drops to 10% only if you correct the shortfall within two years.",
      "Using the wrong balance. The RMD is based on your prior year-end balance, not your current one. Use the December 31 value from last year.",
      "Combining 401(k) RMDs across plans. You can total your IRA RMDs and take them from one IRA, but each 401(k) RMD must come from that specific plan.",
      "Forgetting Roth rules. Roth IRAs have no RMDs for the original owner, so do not withdraw from one to meet an IRA requirement.",
    ],
    workedExample:
      "Say you are 73 with $500,000 in a traditional IRA as of December 31 last year. The IRS distribution period at age 73 is 26.5. Divide $500,000 by 26.5 and your RMD is $18,868 for the year. That works out to about $1,572 a month, or roughly 3.77% of your balance. You must withdraw at least that much by December 31 to avoid the penalty.",
    faqs: [
      { question: "How does the RMD calculator work?", answer: "The RMD calculator divides your prior year-end account balance by an IRS life expectancy factor for your age. Enter your December 31 balance and your age, and it returns the minimum you must withdraw this year. At age 73 the IRS distribution period is 26.5, so a $500,000 balance produces an RMD of $18,868." },
      { question: "At what age do RMDs start?", answer: "RMDs start at age 73 under the SECURE Act 2.0. You must take your first distribution by April 1 of the year after you turn 73. Every RMD after that is due by December 31." },
      { question: "What happens if I miss my RMD?", answer: "Missing an RMD triggers a 25% excise tax on the amount you failed to withdraw. The penalty falls to 10% if you correct the shortfall promptly, generally within two years. You report and pay this tax on IRS Form 5329." },
      { question: "Do Roth IRAs have RMDs?", answer: "Roth IRAs have no RMDs for the original owner during their lifetime. You can leave the money invested as long as you like. This is a key reason some savers convert traditional balances to Roth accounts before age 73." },
      { question: "Can I combine RMDs from multiple accounts?", answer: "You can total the RMDs from all your traditional IRAs and take the full amount from just one IRA. This does not work for 401(k) plans. Each 401(k) RMD must be withdrawn separately from that specific plan." },
    ],
    sources: [
      { label: "IRS — Retirement Plan and IRA Required Minimum Distributions FAQs", url: "https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs" },
      { label: "IRS — Publication 590-B, Distributions from IRAs (Uniform Lifetime Table)", url: "https://www.irs.gov/publications/p590b" },
      { label: "IRS — Retirement Topics: Required Minimum Distributions (RMDs)", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds" },
    ],
    toolHeading: "Calculate this year's RMD",
    toolSubheading: "Enter your prior year-end balance and age to find your required withdrawal.",
    preset: { mode: "rmd", accountBalance: 500000, age: 73 },
    relatedSlugs: ["401k-calculator", "retirement-savings-calculator", "401k-early-withdrawal-calculator"],
  },
];
