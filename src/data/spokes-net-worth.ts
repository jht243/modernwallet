import type { SpokeEntry } from "./types";

// WealthCheck (net-worth) spokes. Powered by src/lib/net-worth.ts. CONTENT: keyword-gap system —
// guided research+write (Federal Reserve SCF / CFPB / IRS primary sources, engine ground-truth
// figures) + adversarial audit per page. The net-worth-by-age benchmark uses the 2022 Survey of
// Consumer Finances median by age of household head. See CONTENT.md.

export const NET_WORTH_SPOKES: SpokeEntry[] = [
  {
    calculator: "net-worth",
    slug: "how-to-calculate-net-worth",
    title: "How to Calculate Net Worth: Step-by-Step Guide",
    metaDescription:
      "Learn how to calculate net worth in minutes. Add your assets, subtract your debts, and see where you stand vs. peers — with a worked example.",
    targetKeyword: "how to calculate net worth",
    estimatedVolume: 90500,
    estimatedKD: 55,
    h1: "How to Calculate Net Worth",
    intro:
      "Learning how to calculate net worth takes one simple step: add up everything you own, then subtract everything you owe. The number you get is your financial scorecard at a single point in time. Use the calculator above to run your own figures, then read on to learn what counts, what to skip, and how to interpret the result.",
    howItWorks:
      "Net worth equals total assets minus total liabilities. Assets are things you own that have real cash value today: checking and savings, taxable brokerage balances, retirement accounts like 401(k)s and IRAs, the current market value of your home, vehicles, and other property you could sell.\n\nLiabilities are what you owe right now: the remaining balance on your mortgage, auto loans, student loans, credit card debt, personal loans, and any unpaid medical bills. Use today's payoff amount for each debt, not the original loan size. The Federal Reserve uses this same framework in its Survey of Consumer Finances. For age-based benchmarks, see the [net worth by age calculator](/net-worth/net-worth-by-age-calculator/).",
    commonMistakes: [
      "Using the purchase price of your home instead of its current market value — net worth tracks today's reality, not what you paid years ago.",
      "Subtracting the original mortgage amount instead of the remaining balance owed.",
      "Excluding retirement accounts because of future taxes — a 401(k) or IRA is still an asset today, even though withdrawals will eventually be taxed.",
      "Overvaluing vehicles. Cars depreciate fast, so use a current resale estimate (Kelley Blue Book or similar), not what you paid.",
      "Forgetting small liabilities like credit card balances or buy-now-pay-later plans — they reduce net worth just like any other debt.",
    ],
    workedExample:
      "Take a 30-year-old running the numbers. On the asset side: $10,000 in cash, $15,000 in a taxable brokerage account, $30,000 in a retirement account, and $18,000 for the current resale value of their vehicle. That adds to $10,000 + $15,000 + $30,000 + $18,000 = $73,000 in total assets. On the liability side: $12,000 left on an auto loan, $25,000 in student loans, and $3,000 in credit card debt — $12,000 + $25,000 + $3,000 = $40,000 in total liabilities. Net worth is $73,000 − $40,000 = $33,000, with a debt-to-asset ratio of 54.79%. The Federal Reserve's Survey of Consumer Finances puts the median net worth for households under 35 at about $39,000, so this person is roughly $6,000 below the median for their age bracket — close, but with room to grow by paying down the credit card and student balances.",
    faqs: [
      { question: "How do you calculate net worth?", answer: "To calculate net worth, add the current value of every asset you own — cash, investments, retirement accounts, home, vehicles — then subtract the total of every debt you owe. The result is your net worth on that date." },
      { question: "Do I include my 401(k) and IRA in net worth?", answer: "Yes. Retirement accounts are assets at their current balance. Future taxes on withdrawals don't change that — most people use the full balance and simply remember the tax bill is coming. For the more conservative measure, see the [liquid net worth calculator](/net-worth/liquid-net-worth-calculator/)." },
      { question: "Should I use my home's purchase price or current value?", answer: "Use the current market value. Net worth measures today's reality, so check a recent appraisal or a Zillow-style estimate. Then subtract the remaining balance on your mortgage, not the original loan amount." },
      { question: "What if my net worth is negative?", answer: "A negative net worth means you owe more than you own. It's common early in life — student loans and a new mortgage often outweigh starter savings. Focus on paying down high-interest debt and building emergency cash to turn the number positive." },
      { question: "How often should I calculate my net worth?", answer: "Once a quarter is plenty for most people. Checking too often invites noise from market swings. A quarterly snapshot shows real trends without the daily distraction." },
    ],
    sources: [
      { label: "Federal Reserve — Survey of Consumer Finances", url: "https://www.federalreserve.gov/econres/scfindex.htm" },
      { label: "Consumer Financial Protection Bureau — Your Money, Your Goals", url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/" },
    ],
    toolHeading: "Calculate your net worth step by step",
    toolSubheading: "Enter assets, then debts. The total updates as you type.",
    preset: { cash: 10000, investments: 15000, retirement: 30000, realEstate: 0, vehicles: 18000, mortgage: 0, autoLoans: 12000, studentLoans: 25000, creditCards: 3000, age: 30 },
    relatedSlugs: ["net-worth-by-age-calculator", "liquid-net-worth-calculator"],
  },

  {
    calculator: "net-worth",
    slug: "net-worth-by-age-calculator",
    title: "Net Worth by Age Calculator: Compare to U.S. Median",
    metaDescription:
      "Free net worth by age calculator. Compare your assets minus debts to the 2022 Federal Reserve median net worth for your age bracket.",
    targetKeyword: "net worth by age calculator",
    estimatedVolume: 14800,
    estimatedKD: 50,
    h1: "Net Worth by Age Calculator",
    intro:
      "The net worth by age calculator above shows how your finances stack up against the typical American household in your age range. Enter your assets and debts, and the tool returns your net worth plus the U.S. median for your bracket. The benchmarks come straight from the Federal Reserve's 2022 Survey of Consumer Finances, the most authoritative source on household wealth.",
    howItWorks:
      "Net worth equals total assets minus total liabilities. The calculator adds your cash, investments, retirement accounts, home value, and vehicles, then subtracts your mortgage, auto loans, student loans, and credit card balances. It then compares the result to the median net worth for your age group.\n\nThe Federal Reserve's 2022 Survey of Consumer Finances reports median household net worth by age of head as follows: Under 35: $39,000; 35–44: $135,600; 45–54: $247,200; 55–64: $364,500; 65–74: $409,900; 75 or older: $335,600. The SCF runs every three years and uses the median rather than the mean. That matters because average (mean) net worth is far higher than median net worth, since a small number of billionaires pull the average up. The median tells you what a typical household actually holds.",
    commonMistakes: [
      "Comparing yourself to the average instead of the median. The average is skewed upward by ultra-wealthy households and overstates what is typical.",
      "Leaving out retirement accounts. A 401(k) or IRA balance is a real asset and belongs in your total.",
      "Counting your home's market value but forgetting to subtract the mortgage balance as a liability.",
      "Ignoring student loans or credit card balances because they feel small. Every debt reduces net worth.",
      "Using a car's purchase price instead of its current resale value. Vehicles depreciate quickly and should reflect today's market.",
    ],
    workedExample:
      "Consider a 35-year-old household. Assets total $392,000: $12,000 in cash, $25,000 in taxable investments, $55,000 in retirement accounts, a $280,000 home, and $20,000 in vehicles. Liabilities total $269,000: a $230,000 mortgage, $15,000 auto loan, $20,000 in student loans, and $4,000 in credit cards. Net worth is $123,000, and the debt-to-asset ratio is 68.62%. Age 35 falls in the 35–44 SCF bracket, where the median is $135,600. This household sits about $12,600 below the median for its age group.",
    faqs: [
      { question: "What is a net worth by age calculator?", answer: "A net worth by age calculator subtracts your debts from your assets and compares the result to the median net worth for your age bracket. It uses Federal Reserve Survey of Consumer Finances data so you can see where you stand against typical U.S. households." },
      { question: "What is the average net worth by age in the U.S.?", answer: "The 2022 Survey of Consumer Finances reports median net worth by age of household head: Under 35 is $39,000, 35–44 is $135,600, 45–54 is $247,200, 55–64 is $364,500, 65–74 is $409,900, and 75 or older is $335,600. The Federal Reserve uses the median because average figures are skewed by the very wealthy." },
      { question: "Why does net worth jump so much between age groups?", answer: "Net worth climbs from $39,000 under 35 to $247,200 at ages 45–54 because those years combine peak earnings, retirement contributions, and home equity buildup. Mortgage paydown and compounding investments accelerate wealth in midlife." },
      { question: "Is median net worth a better benchmark than average net worth?", answer: "Yes. Median net worth shows what a typical household holds, while average net worth is pulled up by a small number of billionaires. The Federal Reserve publishes median figures in the SCF for this reason." },
      { question: "How often is the Survey of Consumer Finances updated?", answer: "The Federal Reserve releases the Survey of Consumer Finances every three years. The 2022 SCF is the most recent dataset and provides the median net worth figures used in the calculator above." },
      { question: "What is the difference between net worth and liquid net worth?", answer: "Net worth includes illiquid assets like your home and vehicles. Liquid net worth counts only assets you can convert to cash quickly. Use the [liquid net worth calculator](/net-worth/liquid-net-worth-calculator/) to see the difference, or learn the method in [how to calculate net worth](/net-worth/how-to-calculate-net-worth/)." },
    ],
    sources: [
      { label: "Federal Reserve, Survey of Consumer Finances overview", url: "https://www.federalreserve.gov/econres/scfindex.htm" },
    ],
    toolHeading: "Compare your net worth to the median for your age",
    toolSubheading: "Federal Reserve 2022 SCF medians, side by side with your number.",
    preset: { cash: 12000, investments: 25000, retirement: 55000, realEstate: 280000, vehicles: 20000, mortgage: 230000, autoLoans: 15000, studentLoans: 20000, creditCards: 4000, age: 35 },
    relatedSlugs: ["how-to-calculate-net-worth", "liquid-net-worth-calculator"],
  },

  {
    calculator: "net-worth",
    slug: "liquid-net-worth-calculator",
    title: "Liquid Net Worth Calculator: See What You Can Spend",
    metaDescription:
      "Free liquid net worth calculator. See how much of your wealth is actually accessible after subtracting debts from cash and easy-to-sell investments.",
    targetKeyword: "liquid net worth calculator",
    estimatedVolume: 1900,
    estimatedKD: 35,
    h1: "Liquid Net Worth Calculator",
    intro:
      "The liquid net worth calculator above shows how much of your wealth is actually spendable today. Liquid net worth subtracts your total debts from your liquid assets only, leaving out retirement accounts, homes, and vehicles. The result is a more honest picture of your short-term financial safety than standard net worth.",
    howItWorks:
      "Liquid net worth equals your liquid assets minus your total liabilities. Liquid assets are the things you can turn into cash within a few days without losing significant value: checking and savings balances, money market accounts, taxable brokerage holdings, and short-term certificates of deposit.\n\nWhat does not count as liquid: 401(k) and IRA balances (a 10% early-withdrawal penalty plus income tax apply before age 59½, per IRS Topic 558), home equity (selling takes months), vehicles, business interests, and collectibles. Enter only your truly accessible assets above, then subtract every debt you owe, from credit cards to auto and student loans.",
    commonMistakes: [
      "Counting retirement accounts as liquid. A $200,000 401(k) balance is worth roughly $140,000 to a 40-year-old after the 10% IRS penalty and federal income tax, so it does not belong in liquid assets.",
      "Including home equity. A paid-off house raises standard net worth but does nothing for a surprise medical bill next week unless you sell or borrow against it.",
      "Forgetting credit card balances. Every dollar of revolving debt reduces liquid net worth, even if you plan to pay it off next month.",
      "Listing vehicles as liquid. Cars and trucks lose value the moment you list them and usually take weeks to sell at a fair price.",
      "Using market value for restricted stock or vested-but-illiquid shares. If you cannot sell the position today, it is not liquid.",
    ],
    workedExample:
      "Take a 45-year-old with $30,000 in cash, $80,000 in a taxable brokerage account, $60,000 in a 401(k), and a $20,000 vehicle. Total assets are $190,000. Debts include a $15,000 auto loan, $10,000 in student loans, and $5,000 in credit card balances, for $30,000 in total liabilities. Standard net worth is $160,000. But liquid assets are only $110,000 (cash plus the taxable brokerage), so liquid net worth is $80,000. That standard $160,000 figure sits $87,200 below the Federal Reserve's 45 to 54 Survey of Consumer Finances median of $247,200, yet the liquid picture is healthy: no mortgage, no penalty-locked savings being counted, and $110,000 of genuinely accessible money.",
    faqs: [
      { question: "What is a liquid net worth calculator?", answer: "A liquid net worth calculator subtracts your total debts from your liquid assets only, which are cash and investments you can sell within a few days. It excludes retirement accounts, real estate, and vehicles to show how much wealth is actually spendable right now." },
      { question: "Is my 401(k) part of liquid net worth?", answer: "No. Under IRS Topic 558, withdrawing from a 401(k) before age 59½ usually triggers a 10% additional tax on top of regular income tax, so the money is not freely accessible. Leave retirement accounts out of the liquid net worth calculation above." },
      { question: "How much liquid net worth should I have?", answer: "There is no single rule, but the CFPB's emergency fund guidance is really a liquid net worth target: enough accessible cash to cover the unexpected expenses you have actually faced in the past. Many planners suggest three to six months of essential expenses in liquid form." },
      { question: "Can my liquid net worth be negative?", answer: "Yes. If your credit card balances, auto loan, and student loans exceed your cash and taxable investments, your liquid net worth is negative even when your home or 401(k) makes your standard net worth positive. That gap is a common warning sign." },
      { question: "How is this different from regular net worth?", answer: "Standard net worth counts every asset you own, including homes, cars, and retirement accounts. Liquid net worth counts only assets you could turn into spendable cash within days without penalty. See [how to calculate net worth](/net-worth/how-to-calculate-net-worth/) for the broader version." },
      { question: "Should I compare my liquid net worth by age?", answer: "Comparing helps you spot gaps, but use it carefully. Try the [net worth by age calculator](/net-worth/net-worth-by-age-calculator/) for benchmarks." },
    ],
    sources: [
      { label: "CFPB — An Essential Guide to Building an Emergency Fund", url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/" },
      { label: "IRS Topic No. 558 — Additional Tax on Early Distributions", url: "https://www.irs.gov/taxtopics/tc558" },
    ],
    toolHeading: "Calculate your spendable wealth",
    toolSubheading: "Liquid assets only — minus every debt.",
    preset: { cash: 30000, investments: 80000, retirement: 60000, realEstate: 0, vehicles: 20000, mortgage: 0, autoLoans: 15000, studentLoans: 10000, creditCards: 5000, age: 45 },
    relatedSlugs: ["how-to-calculate-net-worth", "net-worth-by-age-calculator"],
  },
];
