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
    relatedSlugs: ["401k-calculator", "early-retirement-calculator", "retirement-savings-calculator"],
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
      { question: "How much does an employer match add over a career?", answer: "The impact is substantial. On a $50,000 salary with a 3% employer match, your employer contributes $1,500 per year. At a 7% annual return over 30 years, that $1,500 annual match alone grows to approximately $141,700 — without you contributing a single extra dollar. The match is also an instant 100% return on the dollars that trigger it, which is why always contributing enough to capture the full match is the highest-priority step in retirement planning. To model the combined effect of your contributions and the match, include both amounts in the monthly contribution field above, then compare the full projection in the [retirement savings calculator](/retirement/retirement-savings-calculator/)." },
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
    relatedSlugs: ["retirement-savings-calculator", "retirement-income-calculator", "military-retirement-calculator"],
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
      { question: "Does this retirement calculator account for inflation?", answer: "The calculator uses a nominal return rate that you supply, so it does not automatically strip out inflation. To think in today's dollars, subtract the inflation rate from your expected return. For example, if you expect a 7% nominal return and 3% inflation, enter 4% as your rate. The calculator will then show your projected balance in today's purchasing power. Alternatively, use the nominal rate and remember the final balance will be worth less in real terms — the Federal Reserve targets 2% annual inflation as a long-run benchmark." },
    ],
    sources: [
      { label: "U.S. Department of Labor — Top 10 Ways to Prepare for Retirement", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/top-10-ways-to-prepare-for-retirement" },
      { label: "IRS — Retirement Topics: 401(k) and Profit-Sharing Plan Contribution Limits", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits" },
      { label: "Federal Reserve — Why does the Federal Reserve aim for inflation of 2 percent?", url: "https://www.federalreserve.gov/faqs/economy_14400.htm" },
    ],
    toolHeading: "Are you saving enough for retirement?",
    toolSubheading: "Project your nest egg and your first-year monthly income.",
    preset: { mode: "projection", currentAge: 40, retirementAge: 67, currentSavings: 100000, monthlyContribution: 1000, annualReturnPct: 7 },
    relatedSlugs: ["401k-calculator", "retirement-income-calculator", "social-security-retirement-calculator"],
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
    relatedSlugs: ["401k-calculator", "retirement-income-calculator", "pension-calculator"],
  },

  {
    calculator: "retirement",
    slug: "fire-calculator",
    title: "FIRE Calculator: Find Your FIRE Number",
    metaDescription:
      "Use our FIRE calculator to find your Financial Independence number, project your early retirement date, and compare lean FIRE, FIRE, and fat FIRE targets.",
    targetKeyword: "FIRE calculator",
    estimatedVolume: 9900,
    estimatedKD: 38,
    h1: "FIRE Calculator: Find Your Financial Independence Number",
    intro:
      "Your FIRE number is 25 times your annual expenses — the lump sum that, invested at a 4% withdrawal rate, can fund your lifestyle indefinitely without you ever working again. The FIRE (Financial Independence, Retire Early) movement is built on this math, derived from the 1998 Trinity Study which tested withdrawal rates across historical 30-year market periods. Enter your numbers above to project when your portfolio could cross that threshold.",
    howItWorks:
      "The calculator grows your current savings and monthly contributions at your expected annual return until the projected balance equals or exceeds 25 times your annual expenses — your FIRE number. It tells you how many years remain at your current savings rate, and what your balance will be at each target retirement age.\n\nThree FIRE variants use different multiples: lean FIRE targets 20× expenses (a frugal lifestyle, roughly a 5% withdrawal rate); standard FIRE targets 25× (4% rule); and fat FIRE targets 33× or more for a comfortable cushion. The more years your money must last, the lower your safe withdrawal rate should be. For a general retirement projection without an early-exit target, see the [retirement savings calculator](/retirement/retirement-savings-calculator/).",
    commonMistakes: [
      "Using current spending instead of retirement spending. Your FIRE number is based on what you plan to spend in retirement, not necessarily what you spend now — they can differ significantly.",
      "Ignoring healthcare costs before Medicare eligibility at 65. Private health insurance is often the largest expense for early retirees and can dwarf other budget items.",
      "Assuming the 4% rule is safe for a 50-year retirement. The Trinity Study modeled 30-year horizons. A 40- or 50-year retirement may need a lower rate, closer to 3.5%, to remain reliable.",
      "Forgetting taxes on withdrawals. Traditional 401(k) and IRA distributions are taxed as ordinary income, so your after-tax spending power is less than the gross withdrawal.",
      "Counting on a 100% stock return forever. Sequence-of-returns risk — a market crash in your first retirement years — can permanently damage a portfolio even if long-run returns are good.",
    ],
    workedExample:
      "Suppose you spend $60,000 per year and want to retire at 45. Your FIRE number is $60,000 × 25 = $1,500,000. You are 30 with $100,000 saved and contribute $2,000 per month. At a 7% annual return, the calculator projects your balance reaches $1,500,000 in roughly 17 years — right at age 47. Bumping contributions by $500 per month closes that gap by about two years. The calculator lets you test these levers instantly.",
    faqs: [
      {
        question: "What is a FIRE number?",
        answer:
          "Your FIRE number is 25 times your expected annual expenses in retirement. It represents the portfolio size that, with a 4% annual withdrawal, can fund your lifestyle indefinitely based on historical market data from the Trinity Study. For example, $50,000 in annual spending requires a $1,250,000 FIRE number.",
      },
      {
        question: "Is the 4% rule safe for early retirement at 40 or 45?",
        answer:
          "It may not be. The original Trinity Study modeled 30-year retirement periods; retiring at 40 could mean a 50-year horizon. Many FIRE planners use a more conservative 3% to 3.5% withdrawal rate — equivalent to 29× to 33× annual expenses — for very early retirements to reduce failure risk.",
      },
      {
        question: "What is the difference between lean FIRE, FIRE, and fat FIRE?",
        answer:
          "Lean FIRE targets roughly 20 times annual expenses and assumes a frugal lifestyle with minimal discretionary spending. Standard FIRE targets 25 times expenses. Fat FIRE targets 33 times or more, providing a large cushion for higher spending or market downturns. Each simply reflects a different withdrawal rate assumption.",
      },
      {
        question: "How do I access retirement savings before age 59½ without paying the 10% penalty?",
        answer:
          "Several legal paths exist. The IRS Rule of 72(t) — also called Substantially Equal Periodic Payments (SEPP) under IRS Section 72(t) — lets you take penalty-free IRA withdrawals at any age if you commit to a fixed schedule for five years or until age 59½, whichever is later. A Roth IRA conversion ladder is another common FIRE strategy. See the [early retirement calculator](/retirement/early-retirement-calculator/) for more detail.",
      },
      {
        question: "Should I include Social Security in my FIRE number calculation?",
        answer:
          "Yes, but carefully. If you retire at 40, Social Security (SSA) benefits may be decades away and your benefit will be lower because of fewer earning years on record. Use SSA's online estimator for your projected benefit, then treat it as a future income offset that reduces the portfolio withdrawals you need after age 62 or 67.",
      },
    ],
    sources: [
      {
        label: "Cooley, Hubbard & Walz — 'Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable' (Trinity Study), AAII Journal, 1998",
        url: "https://www.aaii.com/journal/article/retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable",
      },
      {
        label: "IRS — Section 72(t): Substantially Equal Periodic Payments",
        url: "https://www.irs.gov/retirement-plans/retirement-plans-faqs-regarding-substantially-equal-periodic-payments",
      },
    ],
    toolHeading: "When will you hit your FIRE number?",
    toolSubheading: "Project how long until your savings fund an early retirement at your spending level.",
    preset: { mode: "projection", currentAge: 30, retirementAge: 45, currentSavings: 100000, monthlyContribution: 2000, annualReturnPct: 7 },
    relatedSlugs: ["early-retirement-calculator", "retirement-savings-calculator", "retirement-income-calculator"],
  },

  {
    calculator: "retirement",
    slug: "couples-retirement-calculator",
    title: "Couples Retirement Calculator: Plan Together",
    metaDescription:
      "Use our couples retirement calculator to project your combined nest egg, model different retirement ages, and maximize spousal Social Security benefits.",
    targetKeyword: "couples retirement calculator",
    estimatedVolume: 2400,
    estimatedKD: 32,
    h1: "Couples Retirement Calculator: Plan Your Retirement Together",
    intro:
      "Couples who plan retirement jointly typically accumulate more wealth and retire more securely than those who plan separately, because coordinating Social Security claiming ages, contribution timing, and survivor benefits can add tens of thousands of dollars in lifetime income. Enter your combined savings and contributions above to project your shared nest egg, then read below to see how to layer in spousal Social Security benefits.",
    howItWorks:
      "The calculator projects your combined savings — enter both partners' balances and contributions as a single total — at your expected return until the earlier partner's retirement age. Use the notes below to add your Social Security estimate on top of the projected balance.\n\nWhere couples differ from single filers: Social Security (SSA) offers a spousal benefit equal to up to 50% of the higher earner's full retirement age (FRA) benefit, and survivor benefits that let the surviving spouse keep the larger of the two benefits for life. Coordinating these claiming decisions is one of the highest-value retirement planning levers available. For a breakdown of your workplace accounts, see the [401k calculator](/retirement/401k-calculator/).",
    commonMistakes: [
      "Claiming Social Security at the same age. Often the lower-earning spouse should claim earlier and the higher earner should delay to 70, maximizing the survivor benefit that will carry forward for life.",
      "Forgetting survivor benefits. When one spouse dies, the survivor keeps only the larger of the two Social Security checks — not both. If both partners claimed early at 62, the surviving spouse is left with a permanently reduced benefit.",
      "Treating each partner's account separately. Enter combined savings for an accurate projection of the total household portfolio.",
      "Overlooking the spousal benefit floor. A spouse with little or no work history is entitled to up to 50% of the higher earner's FRA benefit, regardless of their own earnings record, per SSA rules.",
      "Ignoring the age gap. If one partner is 5 or more years younger, the retirement runway is longer and the projection should extend further, requiring a higher savings target.",
    ],
    workedExample:
      "Partner A earns more and has a projected Social Security FRA benefit of $2,400/month. Partner B has a much smaller earnings record with a projected benefit of $800/month — but the spousal benefit floor gives Partner B 50% of Partner A's FRA benefit ($1,200/month) if that is larger. If Partner A delays to age 70, their own benefit grows to about $2,976/month (8% annual Delayed Retirement Credits × 3 years). If Partner A dies first, the surviving Partner B inherits that $2,976 check for life — more than triple Partner B's own $800 benefit. This is why delaying the higher earner often wins on a household lifetime basis.",
    faqs: [
      {
        question: "How does spousal Social Security benefit work?",
        answer:
          "A spouse is entitled to up to 50% of the other spouse's full retirement age (FRA) benefit if that amount is larger than their own earned benefit, according to the Social Security Administration. The spousal benefit does not grow if the higher earner delays past FRA — only the earner's own benefit grows with delayed credits.",
      },
      {
        question: "Should both spouses retire at the same age?",
        answer:
          "Not necessarily. The optimal plan often has the higher earner work longer to delay Social Security to age 70, while the lower earner retires earlier and claims their own benefit sooner. This coordination maximizes the survivor benefit — the income stream that continues for whichever partner lives longer.",
      },
      {
        question: "What is the break-even age for delaying Social Security?",
        answer:
          "For most individuals, the break-even age for claiming at 70 versus 67 (FRA for those born 1960 or later) is roughly age 81. If either partner expects to live past 81, delaying the higher earner's claim to 70 usually generates more total lifetime household income, and it permanently raises the survivor benefit.",
      },
      {
        question: "How should a couple enter data into this calculator?",
        answer:
          "Enter the combined total of both partners' current retirement savings in the 'current savings' field. Do the same for monthly contributions — add both partners' amounts together. The projection then shows the household total, which you can compare against a household spending target.",
      },
      {
        question: "Does this calculator include Social Security income?",
        answer:
          "Not directly. The calculator projects portfolio growth; it does not fetch your SSA record. Estimate your Social Security benefit at ssa.gov using the SSA's Retirement Estimator, then add that monthly amount to the portfolio withdrawal your balance can support. See the [Social Security retirement calculator](/retirement/social-security-retirement-calculator/) for more guidance.",
      },
    ],
    sources: [
      {
        label: "SSA — Benefits Planner: Retirement — Spousal Benefits",
        url: "https://www.ssa.gov/benefits/retirement/planner/applying7.html",
      },
      {
        label: "SSA — Benefits Planner: Retirement — Delayed Retirement Credits",
        url: "https://www.ssa.gov/benefits/retirement/planner/delayret.html",
      },
    ],
    toolHeading: "Project your combined retirement nest egg",
    toolSubheading: "Enter both partners' total savings and contributions to see your household balance at retirement.",
    preset: { mode: "projection", currentAge: 38, retirementAge: 65, currentSavings: 180000, monthlyContribution: 3000, annualReturnPct: 7 },
    relatedSlugs: ["retirement-savings-calculator", "social-security-retirement-calculator", "401k-calculator"],
  },

  {
    calculator: "retirement",
    slug: "retirement-income-calculator",
    title: "Retirement Income Calculator: How Long Savings Last",
    metaDescription:
      "Our retirement income calculator shows how long your savings will last in retirement, models withdrawal rates, and flags sequence-of-returns risk.",
    targetKeyword: "retirement income calculator",
    estimatedVolume: 6600,
    estimatedKD: 44,
    h1: "Retirement Income Calculator: How Long Will Your Savings Last?",
    intro:
      "A retirement income calculator answers the decumulation question: given a starting balance, an annual withdrawal, and an expected return, how many years will the money last? This is the mirror image of saving — instead of building a nest egg, you are drawing it down — and the math is more fragile than most people expect.",
    howItWorks:
      "The calculator projects how long your savings last by applying your annual withdrawal each year and growing the remaining balance at your expected return. When the balance hits zero, the money is gone. A higher return or a lower withdrawal extends the runway; a poor early sequence of returns — called sequence-of-returns risk — can shorten it dramatically even if the long-run average looks fine.\n\nThe 4% rule is a common starting point: withdraw 4% of your balance in year one, then adjust for inflation each year. Research suggests this rate has historically funded a 30-year retirement in most market conditions. For your required minimum distributions starting at age 73, see the [RMD calculator](/retirement/rmd-calculator/). To model the savings side, see the [retirement savings calculator](/retirement/retirement-savings-calculator/).",
    commonMistakes: [
      "Ignoring sequence-of-returns risk. A 20% market loss in year one of retirement has a permanently larger impact than the same loss in year ten, because you are selling assets at depressed prices with no paycheck to recover.",
      "Using average returns as if they are constant. Averages hide year-to-year volatility. Sequence risk means bad years early in retirement are disproportionately damaging to portfolio longevity.",
      "Forgetting that withdrawals are taxable. Traditional IRA and 401(k) distributions count as ordinary income. Your gross withdrawal must be larger than your net spending need after taxes.",
      "Ignoring required minimum distributions. Starting at age 73, the IRS requires withdrawals from traditional accounts whether you need the money or not — which can push you into a higher tax bracket.",
      "Underestimating longevity. The Social Security Administration reports that a 65-year-old woman has a roughly 1-in-3 chance of reaching age 90. A 25-year retirement is a reasonable planning horizon; a 30-year horizon is prudent.",
    ],
    workedExample:
      "You retire at 65 with $750,000 saved and plan to withdraw $40,000 per year (about 5.3% initial rate), growing with inflation. At a 6% return, the calculator shows the money lasting about 28 years to age 93. But if the market drops 25% in year one of retirement — reducing your balance to $522,500 before you withdraw — the money now lasts only about 23 years. That five-year difference illustrates sequence risk. A common mitigation: hold 1 to 2 years of expenses in cash or short-term bonds so you never sell equities in a panic during a downturn.",
    faqs: [
      {
        question: "What is sequence-of-returns risk?",
        answer:
          "Sequence-of-returns risk is the danger that poor market returns early in retirement will permanently reduce how long your savings last. Because you are selling assets each year to fund spending, a market crash in year one forces you to liquidate more shares at low prices — shares that never recover in your portfolio. The same average return with a different sequence produces drastically different outcomes.",
      },
      {
        question: "How can I protect against sequence-of-returns risk?",
        answer:
          "One well-tested approach is maintaining a 1- to 2-year cash buffer or a short-term bond allocation equal to your near-term spending needs. This lets you avoid selling equities during a downturn. Another approach is flexible spending — reducing withdrawals by 10–15% in down years and spending more in up years. Both strategies extend portfolio longevity.",
      },
      {
        question: "What withdrawal rate is safe for a 30-year retirement?",
        answer:
          "The 4% rule — withdrawing 4% of your initial balance and adjusting for inflation annually — has historically funded a 30-year retirement in most market conditions, based on the Trinity Study's analysis of historical return sequences. For retirements longer than 30 years, a 3% to 3.5% rate is more conservative.",
      },
      {
        question: "When do RMDs start and how do they affect my drawdown plan?",
        answer:
          "Required minimum distributions from traditional IRAs and 401(k)s begin at age 73 under IRS rules. The IRS sets the amount based on your account balance and a life expectancy table. RMDs can force you to withdraw more than you planned, increasing your taxable income. Use the [RMD calculator](/retirement/rmd-calculator/) to estimate your first required withdrawal.",
      },
      {
        question: "Should I include Social Security in this calculation?",
        answer:
          "Yes. Social Security income reduces the amount you need to withdraw from savings each year. If your Social Security benefit covers $2,000 per month and you need $4,000 per month total, you only need to withdraw $2,000 from your portfolio — effectively halving your withdrawal rate and significantly extending how long your savings last.",
      },
    ],
    sources: [
      {
        label: "U.S. Department of Labor — What You Should Know About Your Retirement Plan",
        url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/what-you-should-know-about-your-retirement-plan",
      },
      {
        label: "IRS — Retirement Topics: Required Minimum Distributions (RMDs)",
        url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds",
      },
      {
        label: "SSA — Calculators: Life Expectancy",
        url: "https://www.ssa.gov/oact/population/longevity.html",
      },
    ],
    toolHeading: "How long will your retirement savings last?",
    toolSubheading: "Project your drawdown runway based on your balance, withdrawal rate, and expected return.",
    preset: { mode: "projection", currentAge: 60, retirementAge: 65, currentSavings: 750000, monthlyContribution: 1500, annualReturnPct: 6 },
    relatedSlugs: ["retirement-savings-calculator", "401k-calculator", "rmd-calculator"],
  },

  {
    calculator: "retirement",
    slug: "military-retirement-calculator",
    title: "Military Retirement Calculator: TSP + Pension",
    metaDescription:
      "Project your TSP balance alongside your military pension estimate. Covers BRS vs. legacy High-3, TSP matching, 20-year vesting, and survivor benefits.",
    targetKeyword: "military retirement calculator",
    estimatedVolume: 3600,
    estimatedKD: 30,
    h1: "Military Retirement Calculator: Project TSP Growth and Pension",
    intro:
      "Military retirement combines two income streams that civilian workers rarely have together: a defined-benefit pension based on years of service and a Thrift Savings Plan (TSP) that works like a 401(k) — and the Blended Retirement System (BRS), introduced in 2018 by the Department of Defense, changed the terms for most service members entering after January 1, 2018. Use the calculator above to project your TSP growth, then add your pension estimate below to see the full picture.",
    howItWorks:
      "This calculator projects your TSP balance — the defined-contribution side of military retirement. Enter your current TSP balance, monthly contributions (your own plus any BRS matching), expected return, and your target separation age.\n\nFor the pension side, use the formula that applies to your plan. Under the legacy High-3 system: pension = 2.5% × years of service × average of your three highest-pay years. A 20-year retiree receives 50% of High-3 pay. Under BRS: pension = 2.0% × years of service × High-3 average, plus a government TSP match of up to 5% of basic pay after three years of service, plus a one-time continuation pay bonus at the midpoint. For general retirement projection, see the [retirement savings calculator](/retirement/retirement-savings-calculator/).",
    commonMistakes: [
      "Forgetting the 20-year cliff on the legacy High-3 plan. Under legacy rules, separating before 20 years of service means zero pension — you lose the entire defined-benefit, no matter how many years you served. The BRS was designed specifically to fix this cliff for the modern force.",
      "Not capturing the full BRS TSP match. BRS provides automatic 1% TSP contribution from the government after 60 days, then a dollar-for-dollar match on the next 3% and 50 cents on the next 2% after three years — a total of up to 5% matching. Service members who do not opt in above the 1% auto-contribution leave free money behind.",
      "Using current base pay instead of High-3 average. The pension formula uses the average of your three highest consecutive annual base-pay years, not your final pay. Late promotions can shift this number meaningfully.",
      "Ignoring COLA adjustments. Military pensions are adjusted annually for cost-of-living increases tied to the Consumer Price Index, per Department of Defense policy. This inflation protection is a significant advantage over many civilian pensions.",
      "Overlooking the Survivor Benefit Plan (SBP). Without enrolling in SBP, your pension stops at death and your surviving spouse receives nothing. SBP covers up to 55% of your retirement pay at a premium, and the election window closes at retirement.",
    ],
    workedExample:
      "A service member enters under BRS at age 22, separates at age 42 with exactly 20 years of service and a High-3 average base pay of $72,000 per year. Legacy pension would have been 50% × $72,000 = $36,000 annually ($3,000/month). Under BRS, pension is 40% × $72,000 = $28,800 annually ($2,400/month). However, over 20 years of TSP contributions at $500/month with a 5% employer match ($300/month = $800/month total) at 7% return, the TSP balance at separation is approximately $500,000. If that TSP is withdrawn at 4%, it provides $20,000/year — bringing BRS total income to $48,800, compared with legacy-only $36,000.",
    faqs: [
      {
        question: "What is the difference between the legacy High-3 plan and BRS?",
        answer:
          "Under the legacy High-3 plan, a 20-year retiree receives 2.5% × years of service × High-3 average pay (50% at 20 years), with no TSP matching and no benefit at all for those who leave before 20 years. Under BRS, the pension multiplier drops to 2.0% (40% at 20 years), but the government provides up to 5% TSP matching after three years of service, a continuation pay bonus, and service members who leave before 20 years keep their TSP balance plus any vested matching.",
      },
      {
        question: "What happens to my TSP if I separate before 20 years under BRS?",
        answer:
          "Under BRS, a service member who leaves before 20 years receives no pension but keeps their entire TSP balance, including vested government matching contributions. Government matching vests after two years of service. This is the key BRS design feature: it extends retirement benefits to the roughly 80% of service members who historically left before the 20-year mark and received nothing under the legacy plan.",
      },
      {
        question: "How much does the government match in the TSP under BRS?",
        answer:
          "After 60 days of service, the government automatically contributes 1% of basic pay to your TSP. Beginning in your fourth year of service, the government also matches your contributions: dollar-for-dollar on the first 3% you contribute, and 50 cents per dollar on the next 2%. To capture the full 5% match, you must contribute at least 5% of your basic pay.",
      },
      {
        question: "Can I access my TSP before age 59½ without penalty as a military retiree?",
        answer:
          "Possibly. If you separate from service in the year you turn 55 or later, you may qualify for the Rule of 55, which waives the 10% early withdrawal penalty on TSP distributions. Additionally, combat-zone tax exclusion rules may apply to contributions made during qualifying deployments. Consult IRS Publication 590-B and your TSP plan documents for specifics.",
      },
      {
        question: "What is the Survivor Benefit Plan and should I elect it?",
        answer:
          "The Survivor Benefit Plan (SBP) is a Department of Defense insurance program that continues up to 55% of your retirement pay to a surviving spouse after you die. Premiums are roughly 6.5% of the covered base amount. Without SBP, your military pension stops at death. The election must be made at retirement; you cannot add it later. For most married retirees, SBP is worth evaluating carefully against commercial life insurance alternatives.",
      },
    ],
    sources: [
      {
        label: "Department of Defense — Blended Retirement System Overview",
        url: "https://militarypay.defense.gov/Portals/3/Documents/BlendedRetirementDocuments/BRS%20Overview%20Handout.pdf",
      },
      {
        label: "DFAS — Military Retirement",
        url: "https://www.dfas.mil/RetiredMilitary/plan/retirement-types/",
      },
      {
        label: "IRS — Publication 590-B: Distributions from Individual Retirement Arrangements",
        url: "https://www.irs.gov/publications/p590b",
      },
    ],
    toolHeading: "Project your TSP balance at military retirement",
    toolSubheading: "Enter your TSP balance and contributions, then add your pension estimate to see your full retirement income.",
    preset: { mode: "projection", currentAge: 28, retirementAge: 48, currentSavings: 35000, monthlyContribution: 1200, annualReturnPct: 7 },
    relatedSlugs: ["retirement-savings-calculator", "401k-calculator", "fire-calculator"],
  },

  {
    calculator: "retirement",
    slug: "early-retirement-calculator",
    title: "Early Retirement Calculator: Can You Retire Now?",
    metaDescription:
      "Our early retirement calculator projects your savings gap, models a bridge to Social Security at 62, and shows IRS options for accessing funds before age 59½.",
    targetKeyword: "early retirement calculator",
    estimatedVolume: 4400,
    estimatedKD: 36,
    h1: "Early Retirement Calculator: Are You Ready to Retire Early?",
    intro:
      "Early retirement is financially viable when your projected portfolio balance can sustain your spending — without a paycheck — from your planned retirement date until Social Security and Medicare fill the gap years later. Use the calculator above to project whether your current savings trajectory reaches that number by your target date, and read below for the rules governing how to access tax-advantaged funds early.",
    howItWorks:
      "The calculator projects your savings to your target retirement age and estimates how many years your portfolio can sustain a given withdrawal rate. It does not automatically add Social Security income, because the earliest you can claim Social Security retired-worker benefits is age 62, and claiming that early reduces your benefit by up to 30% compared with your Full Retirement Age (FRA), according to the Social Security Administration.\n\nTwo IRS rules are critical for early retirees accessing tax-advantaged accounts before age 59½. First, the Rule of 55: if you separate from your employer in the calendar year you turn 55 or later, you can take penalty-free distributions from that employer's 401(k) plan (not IRAs). Second, IRS Section 72(t) Substantially Equal Periodic Payments (SEPP): you can take penalty-free IRA withdrawals at any age if you commit to a fixed payment schedule for at least five years or until age 59½, whichever is longer. For the FIRE-specific version of this question, see the [FIRE calculator](/retirement/fire-calculator/).",
    commonMistakes: [
      "Assuming Social Security is available immediately after leaving work. The earliest claim age for retired-worker benefits is 62, and claiming at 62 permanently reduces your benefit by up to 30% versus your FRA benefit, per SSA rules.",
      "Underestimating health insurance costs before Medicare at 65. Without employer coverage, marketplace premiums for a 55-year-old can easily exceed $1,000 per month per person, significantly affecting your withdrawal rate.",
      "Misapplying the Rule of 55. The rule applies only to the 401(k) plan of your last employer — the one you separate from at age 55 or later. Old 401(k)s from prior employers and all IRAs require SEPP or age 59½ for penalty-free access.",
      "Breaking a 72(t) SEPP payment schedule. Modifying or stopping SEPP payments before the required period ends triggers the 10% penalty retroactively on all prior distributions, plus interest.",
      "Forgetting that 20 to 30 years of retirement changes the math. A 55-year-old who lives to 90 faces a 35-year drawdown — well beyond the 30 years modeled by the standard 4% rule research. A 3% to 3.5% withdrawal rate is more appropriate.",
    ],
    workedExample:
      "You are 50, want to retire at 55, and have $800,000 saved. You contribute $2,500 per month and expect 7% annual returns. The calculator projects your balance at 55 will be approximately $1,216,000. At a 3.5% withdrawal rate (appropriate for a 35-year horizon), that supports about $42,560 per year, or $3,547 per month. From 55 to 62, you bridge entirely on portfolio withdrawals. At 62 you could claim a reduced Social Security benefit; if your estimated FRA benefit is $2,200/month, claiming at 62 gives you roughly $1,540/month instead — permanently. Delaying to your FRA at 67 costs seven more years of portfolio-only withdrawals but preserves the full benefit and the higher survivor benefit for a spouse.",
    faqs: [
      {
        question: "What is the earliest age I can collect Social Security retirement benefits?",
        answer:
          "The earliest you can claim Social Security retired-worker benefits is age 62, according to the Social Security Administration. Claiming at 62 permanently reduces your monthly benefit by up to 30% compared with your Full Retirement Age benefit (age 67 for those born in 1960 or later). Benefits are not available before 62 unless you qualify for Social Security Disability Insurance.",
      },
      {
        question: "How does the IRS Rule of 55 work?",
        answer:
          "Under IRS rules, if you separate from your employer in the calendar year you turn 55 or older (age 50 for certain public safety employees), you may take penalty-free distributions from that employer's 401(k) or 403(b) plan. The 10% early withdrawal penalty is waived, but ordinary income tax still applies. This applies only to the plan of the employer you leave — not to old 401(k)s from prior jobs or to IRAs.",
      },
      {
        question: "What is a 72(t) SEPP distribution?",
        answer:
          "IRS Section 72(t) allows penalty-free withdrawals from an IRA at any age if you take Substantially Equal Periodic Payments (SEPP) using one of three IRS-approved calculation methods. You must continue the payments for at least five years or until age 59½, whichever is longer. Breaking the schedule before the required period ends retroactively applies the 10% penalty on all prior distributions, plus interest.",
      },
      {
        question: "How do I cover health insurance before Medicare at 65?",
        answer:
          "Early retirees under 65 are not eligible for Medicare. Options include COBRA continuation coverage from your former employer (often expensive), marketplace plans under the Affordable Care Act (premiums may qualify for subsidies if your income is low enough), a spouse's employer plan, or short-term health insurance. Healthcare costs are often the largest unplanned expense for early retirees and should be modeled explicitly in your budget.",
      },
      {
        question: "What withdrawal rate is safe for a 35-year early retirement?",
        answer:
          "Research based on the Trinity Study and subsequent work suggests that a 3% to 3.5% withdrawal rate is more appropriate than the standard 4% rule for retirements lasting 35 to 40 years. A 3% rate requires approximately 33 times annual expenses in savings — a higher bar than standard FIRE's 25×, but it provides a larger buffer against sequence-of-returns risk and longevity.",
      },
    ],
    sources: [
      {
        label: "IRS Topic No. 558 — Additional Tax on Early Distributions From Retirement Plans (Rule of 55)",
        url: "https://www.irs.gov/taxtopics/tc558",
      },
      {
        label: "IRS — Retirement Plans FAQs: Substantially Equal Periodic Payments (Section 72(t))",
        url: "https://www.irs.gov/retirement-plans/retirement-plans-faqs-regarding-substantially-equal-periodic-payments",
      },
      {
        label: "SSA — Benefits Planner: Retirement — Retirement Age and Benefit Reduction",
        url: "https://www.ssa.gov/benefits/retirement/planner/agereduction.html",
      },
    ],
    toolHeading: "Will your savings support early retirement?",
    toolSubheading: "Project your balance at your target age and estimate how long it will last before Social Security kicks in.",
    preset: { mode: "projection", currentAge: 50, retirementAge: 55, currentSavings: 800000, monthlyContribution: 2500, annualReturnPct: 7 },
    relatedSlugs: ["fire-calculator", "retirement-savings-calculator", "401k-early-withdrawal-calculator"],
  },

  {
    calculator: "retirement",
    slug: "pension-calculator",
    title: "Retirement Calculator with Pension: Model Both",
    metaDescription:
      "Our retirement calculator with pension lets you model your 401(k) or IRA growth alongside your defined-benefit pension to project your total retirement income.",
    targetKeyword: "retirement calculator with pension",
    estimatedVolume: 2900,
    estimatedKD: 33,
    h1: "Retirement Calculator with Pension: Model Your 401(k) and Pension Together",
    intro:
      "A defined-benefit (DB) pension and a 401(k) or IRA serve completely different roles in retirement, and modeling them together gives the most accurate picture of total income. Use the calculator above to project your 401(k) or IRA balance; then use the formula below to estimate your pension and add both income streams together.",
    howItWorks:
      "The calculator projects your defined-contribution account — your 401(k), 403(b), or IRA — at your expected return until retirement. For the pension side, most defined-benefit formulas follow this structure: annual pension = years of service × benefit multiplier × final average salary (or average of your highest three to five years of pay).\n\nExample: 25 years of service × 1.5% multiplier × $80,000 average salary = $30,000 per year ($2,500 per month). Check your plan's Summary Plan Description for your exact multiplier and averaging period — the Department of Labor requires employers to provide this document upon request. The non-obvious insight here: a DB pension effectively acts like a large bond allocation in your portfolio, providing stable income regardless of market performance. This allows you to take more equity risk with your 401(k) side, potentially generating higher long-run growth. For the drawdown side of this equation, see the [retirement income calculator](/retirement/retirement-income-calculator/).",
    commonMistakes: [
      "Forgetting PBGC insurance limits. If your employer's pension plan is underfunded and the company fails, the Pension Benefit Guaranty Corporation (PBGC) insures benefits up to a maximum that varies by age and year. For 2026, the PBGC maximum monthly guarantee for a single-life annuity at age 65 is set by PBGC tables — consult pbgc.gov for the current figure. Benefits above this limit may not be fully protected.",
      "Assuming a pension benefit is inflation-adjusted. Many private-sector DB pensions pay a fixed monthly amount with no cost-of-living adjustment. Over a 25-year retirement with 3% annual inflation, fixed payments lose roughly half their purchasing power.",
      "Ignoring survivor options. Most pension plans offer a joint-and-survivor annuity that pays a reduced amount but continues to your spouse after your death. Choosing the single-life option for higher payments leaves your spouse with no income if you die first.",
      "Overlooking the pension's impact on Social Security. If you receive a pension from employment not covered by Social Security (common in some state and local government jobs), the Windfall Elimination Provision (WEP) or Government Pension Offset (GPO) may reduce your Social Security benefit, per SSA rules.",
      "Not requesting your plan's Summary Plan Description. The SPD spells out your exact benefit formula, vesting schedule, and survivor options. The DOL requires your employer to provide it free of charge upon written request.",
    ],
    workedExample:
      "You are 45 with $200,000 in a 401(k), contributing $1,500 per month, and expecting a 6% return until age 65. The calculator projects your 401(k) reaches approximately $833,000 at retirement. Your DB pension formula: 20 years of service × 1.75% × $85,000 average salary = $29,750 per year, or $2,479 per month. At 4% withdrawal, your 401(k) supports an additional $2,777 per month. Total retirement income: $2,479 (pension) + $2,777 (401k) = $5,256 per month, before Social Security. The pension's $2,479 acts as a floor, meaning you can afford to hold more equities in the 401(k) and target higher growth, because your basic expenses are already covered.",
    faqs: [
      {
        question: "How do I calculate my pension benefit?",
        answer:
          "Most defined-benefit pension formulas follow this structure: annual benefit = years of service × benefit multiplier × final average salary. For example, 20 years × 1.5% × $70,000 = $21,000 per year. Your plan's Summary Plan Description, which your employer must provide under DOL rules, contains your exact multiplier and the averaging method used for your salary.",
      },
      {
        question: "Is my pension protected if my employer goes bankrupt?",
        answer:
          "Pensions covered by private-sector defined-benefit plans are insured by the Pension Benefit Guaranty Corporation (PBGC), a federal agency. PBGC guarantees benefits up to an annual maximum that depends on your age at retirement. Benefits above that cap may not be fully covered. Government pensions are not covered by PBGC but are typically backed by the sponsoring government entity.",
      },
      {
        question: "Does my pension affect my Social Security benefit?",
        answer:
          "It may. If you worked in a job not covered by Social Security — such as some state and local government positions — and also have Social Security earnings, the Windfall Elimination Provision (WEP) can reduce your Social Security benefit. The Government Pension Offset (GPO) can reduce or eliminate a spousal or survivor Social Security benefit. Check the SSA website for details on whether WEP or GPO applies to your situation.",
      },
      {
        question: "Should I take the pension as a lump sum or monthly annuity?",
        answer:
          "This depends on your health, other income sources, and risk tolerance. A monthly annuity provides guaranteed income for life (and potentially for a surviving spouse) regardless of market performance. A lump sum gives you control and the potential for higher returns if invested well, but shifts all longevity and investment risk to you. IRS Publication 575 covers the tax treatment of pension and annuity payments.",
      },
      {
        question: "How does having a pension change how I should invest my 401(k)?",
        answer:
          "A defined-benefit pension functions like a bond in your portfolio — it provides predictable, fixed income independent of market returns. Because that income stream reduces your reliance on portfolio withdrawals, you may be able to tolerate more equity exposure in your 401(k) without increasing your overall retirement risk. This is one reason pension holders can sometimes afford a higher stock allocation than conventional rules of thumb suggest.",
      },
    ],
    sources: [
      {
        label: "DOL — Publication: What You Should Know About Your Retirement Plan (Summary Plan Description)",
        url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/what-you-should-know-about-your-retirement-plan",
      },
      {
        label: "PBGC — Maximum Monthly Guarantee Tables",
        url: "https://www.pbgc.gov/wr/benefits/guaranteed-benefits/maximum-guarantee",
      },
      {
        label: "IRS Publication 575 — Pension and Annuity Income",
        url: "https://www.irs.gov/publications/p575",
      },
      {
        label: "SSA — Windfall Elimination Provision",
        url: "https://www.ssa.gov/benefits/retirement/planner/wep.html",
      },
    ],
    toolHeading: "Project your 401(k) balance alongside your pension",
    toolSubheading: "Enter your defined-contribution savings to estimate portfolio income, then add your pension monthly payment for your total retirement income.",
    preset: { mode: "projection", currentAge: 45, retirementAge: 65, currentSavings: 200000, monthlyContribution: 1500, annualReturnPct: 6 },
    relatedSlugs: ["retirement-savings-calculator", "retirement-income-calculator", "401k-calculator"],
  },

  {
    calculator: "retirement",
    slug: "social-security-retirement-calculator",
    title: "Social Security Retirement Calculator",
    metaDescription:
      "Our Social Security retirement calculator shows how claiming age affects your benefit and how to add SSA income to your total retirement projection.",
    targetKeyword: "retirement calculator with social security",
    estimatedVolume: 5400,
    estimatedKD: 42,
    h1: "Social Security Retirement Calculator: Add SSA Benefits to Your Plan",
    intro:
      "Social Security claiming age is one of the highest-impact retirement decisions most people make: claiming at 62 versus 70 can change your monthly benefit by more than 75%, according to the Social Security Administration — and that difference is permanent, paid for life, and inflation-adjusted each year via Cost-of-Living Adjustments (COLA). Use the calculator above to project your savings, then use the guidance below to model how your SSA benefit changes at each claiming age.",
    howItWorks:
      "The calculator projects your savings-side balance — your 401(k), IRA, or other accounts — at your expected return until retirement. To add your Social Security income, estimate your benefit using SSA's Retirement Estimator at ssa.gov, then add that monthly amount to the portfolio withdrawal your balance supports.\n\nThe key variables: Your Full Retirement Age (FRA) is 67 if you were born in 1960 or later, per SSA rules. Claiming before FRA permanently reduces your benefit — by up to 30% if you claim at 62. Delaying past FRA permanently increases your benefit by 8% per year (Delayed Retirement Credits), up to age 70. There are no additional credits for delaying past 70. The break-even calculation: delaying from 67 to 70 requires roughly 11 to 12 years of higher payments to offset the three years of foregone benefits — meaning if you live past roughly age 81, delaying to 70 pays more in total lifetime benefits. For couples, see the [couples retirement calculator](/retirement/couples-retirement-calculator/) for spousal benefit coordination.",
    commonMistakes: [
      "Claiming at 62 without modeling the long-term cost. The 30% reduction at 62 versus FRA (67) is permanent. For someone who lives to 85, claiming at 62 versus 67 often means collecting $50,000 to $100,000 less in total lifetime benefits, depending on the benefit amount.",
      "Assuming Social Security will fully fund retirement. Social Security is designed to replace approximately 40% of pre-retirement income for average earners, according to SSA. It is a supplement to savings, not a substitute.",
      "Forgetting the earnings test before FRA. If you claim Social Security before your FRA and continue working, SSA withholds $1 in benefits for every $2 earned above an annual threshold ($23,400 in 2025 per SSA). Withheld amounts are eventually recredited after FRA, but the cash flow impact matters.",
      "Not accounting for Social Security taxation. Up to 85% of Social Security benefits may be subject to federal income tax if your combined income (adjusted gross income + nontaxable interest + half of Social Security) exceeds $34,000 for singles or $44,000 for married couples filing jointly, per IRS rules.",
      "Overlooking the COLA guarantee. Social Security benefits are adjusted annually for inflation via Cost-of-Living Adjustments tied to the CPI-W. This built-in inflation protection is a significant advantage over fixed pension payments or fixed annuities, and it compounds in value over a long retirement.",
    ],
    workedExample:
      "You are 55 with $400,000 in savings, contributing $1,500 per month, and planning to retire at your FRA of 67. The calculator projects your balance at 67 is approximately $1,122,000. SSA estimates your monthly benefit at FRA as $2,200. At 4% withdrawal, your savings support $3,740/month. Total: $2,200 (SSA) + $3,740 (savings) = $5,940/month. Now consider delaying to 70: your benefit becomes roughly $2,816/month (8% × 3 years × $2,200). But you work three extra years, growing savings to about $1,367,000 — supporting $4,557/month from savings. Total at 70: $2,816 + $4,557 = $7,373/month. Whether to retire at 67 or 70 depends on health, lifestyle, and longevity expectations, but the numbers make the trade-off concrete.",
    faqs: [
      {
        question: "What is the Full Retirement Age for Social Security?",
        answer:
          "Your Full Retirement Age (FRA) is the age at which you receive 100% of your earned Social Security benefit. For anyone born in 1960 or later, FRA is 67, according to the Social Security Administration. For those born between 1943 and 1959, FRA ranges from 66 to 66 years and 10 months.",
      },
      {
        question: "How much does claiming Social Security early reduce my benefit?",
        answer:
          "Claiming before your FRA permanently reduces your monthly benefit. Claiming at 62 (the earliest allowed age) reduces your benefit by up to 30% if your FRA is 67. The reduction is roughly 5/9 of 1% per month for the first 36 months before FRA, and 5/12 of 1% per month beyond that, per SSA guidelines.",
      },
      {
        question: "How much does delaying Social Security past FRA increase my benefit?",
        answer:
          "Delaying past your FRA earns Delayed Retirement Credits of 8% per year (two-thirds of 1% per month), up to age 70. Delaying from FRA 67 to age 70 increases your benefit by approximately 24%. No additional credits accrue after age 70, so there is no financial benefit to delaying past 70.",
      },
      {
        question: "At what age does delaying Social Security to 70 break even?",
        answer:
          "The break-even age for delaying from FRA (67) to 70 is approximately age 81. If you live past 81, the higher monthly payments from delaying to 70 will have paid out more in total lifetime benefits than claiming at 67 would have. If you expect a shorter lifespan or have an immediate income need, claiming earlier may make more sense for your situation.",
      },
      {
        question: "Are Social Security benefits taxable?",
        answer:
          "Up to 85% of Social Security benefits may be subject to federal income tax, depending on your combined income. Combined income is defined as adjusted gross income plus nontaxable interest plus half of your Social Security benefits. If this total exceeds $25,000 for single filers or $32,000 for married couples filing jointly, a portion of benefits is taxable. The maximum taxable percentage is 85%, not 100%. State tax treatment of Social Security varies.",
      },
    ],
    sources: [
      {
        label: "SSA — Benefits Planner: Retirement — Retirement Age and Benefit Reduction",
        url: "https://www.ssa.gov/benefits/retirement/planner/agereduction.html",
      },
      {
        label: "SSA — Benefits Planner: Retirement — Delayed Retirement Credits",
        url: "https://www.ssa.gov/benefits/retirement/planner/delayret.html",
      },
      {
        label: "SSA Publication EN-05-10035 — Understanding the Benefits",
        url: "https://www.ssa.gov/pubs/EN-05-10035.pdf",
      },
      {
        label: "IRS — Publication 915: Social Security and Equivalent Railroad Retirement Benefits",
        url: "https://www.irs.gov/publications/p915",
      },
    ],
    toolHeading: "Project your savings and Social Security income together",
    toolSubheading: "See your portfolio balance at retirement, then add your SSA benefit estimate for your total monthly income.",
    preset: { mode: "projection", currentAge: 55, retirementAge: 67, currentSavings: 400000, monthlyContribution: 1500, annualReturnPct: 7 },
    relatedSlugs: ["retirement-savings-calculator", "couples-retirement-calculator", "early-retirement-calculator"],
  },
];
