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
    relatedSlugs: ["net-worth-by-age-calculator", "liquid-net-worth-calculator", "net-worth-percentile-calculator", "net-worth-projection-calculator"],
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
      { question: "How does net worth by age compare for couples versus individuals?", answer: "The Federal Reserve's 2022 Survey of Consumer Finances shows that married-couple households accumulate substantially more net worth than single-person households at every age bracket, driven by dual incomes, shared fixed costs, and combined retirement contributions. While the SCF does not publish a side-by-side single-versus-couple age table, the survey consistently finds that married-couple household median net worth is roughly two to three times that of single-person households in the same age range. For example, at the 35–44 bracket the all-households SCF median is $135,600; single-person households in that group typically fall well below that figure, while two-adult households typically exceed it by a wide margin. The same pattern holds at every decade. For a household-level comparison as a couple, use the [couples net worth calculator](/net-worth/couples-net-worth-calculator/) to combine both partners' assets and liabilities, then benchmark the combined figure against the SCF medians shown above." },
    ],
    sources: [
      { label: "Federal Reserve, Survey of Consumer Finances overview", url: "https://www.federalreserve.gov/econres/scfindex.htm" },
    ],
    toolHeading: "Compare your net worth to the median for your age",
    toolSubheading: "Federal Reserve 2022 SCF medians, side by side with your number.",
    preset: { cash: 12000, investments: 25000, retirement: 55000, realEstate: 280000, vehicles: 20000, mortgage: 230000, autoLoans: 15000, studentLoans: 20000, creditCards: 4000, age: 35 },
    relatedSlugs: ["how-to-calculate-net-worth", "liquid-net-worth-calculator", "net-worth-percentile-calculator", "couples-net-worth-calculator"],
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
    relatedSlugs: ["how-to-calculate-net-worth", "net-worth-by-age-calculator", "net-worth-projection-calculator", "net-worth-percentile-calculator"],
  },

  {
    calculator: "net-worth",
    slug: "net-worth-percentile-calculator",
    title: "Net Worth Percentile Calculator: Where Do You Rank?",
    metaDescription:
      "See your wealth rank among U.S. households using Federal Reserve SCF 2022 data. Find where your net worth falls by percentile — median is $192,700.",
    targetKeyword: "net worth percentile calculator",
    estimatedVolume: 8100,
    estimatedKD: 45,
    h1: "Net Worth Percentile Calculator",
    intro:
      "The net worth percentile calculator shows where your household wealth ranks among all U.S. households, using data from the Federal Reserve's 2022 Survey of Consumer Finances. Enter your assets and debts above, and you'll see your net worth alongside the percentile it represents. The SCF is the gold-standard source on U.S. household wealth — a comprehensive survey of roughly 5,000 families conducted every three years.",
    howItWorks:
      "Your net worth percentile is determined by comparing your total assets minus total liabilities to the wealth distribution reported in the Federal Reserve's Survey of Consumer Finances. The SCF divides U.S. households into percentile brackets and publishes the wealth cutoffs at each threshold.\n\nKey 2022 SCF benchmarks: the median U.S. household net worth is approximately $192,700, meaning half of all households have more and half have less. The mean is approximately $1.06 million — nearly six times the median — because the ultra-wealthy pull the average sharply upward. To reach the top 10%, a household needs roughly $1.46 million in net worth. The top 1% threshold is approximately $11.1 million. These figures reflect all age groups combined; for age-specific benchmarks, use the [net worth by age calculator](/net-worth/net-worth-by-age-calculator/).",
    commonMistakes: [
      "Comparing yourself to the mean net worth instead of the median. The mean ($1.06M) is almost 6× the median ($192,700) because a small number of ultra-wealthy households pull the average up dramatically.",
      "Forgetting that SCF net worth is measured at the household level, not per individual. A couple's combined assets and debts form one data point in the survey.",
      "Treating a below-median net worth as failure. The median is the midpoint of a wide distribution — half of all U.S. households are below it by definition.",
      "Using a single year's snapshot to judge progress. Net worth percentile is most meaningful as a trend over several years, not a one-time rank.",
      "Leaving out retirement accounts. The SCF includes 401(k) and IRA balances in household net worth, so you should too when comparing to SCF percentiles.",
    ],
    workedExample:
      "Consider a 40-year-old household with $15,000 in cash, $40,000 in taxable investments, $120,000 in retirement accounts, a $350,000 home, and $25,000 in vehicles — $550,000 in total assets. Liabilities include a $250,000 mortgage, $18,000 auto loan, $22,000 in student loans, and $6,000 in credit card balances — $296,000 in total liabilities. Net worth is $254,000. That sits above the overall U.S. median of $192,700, placing this household roughly around the 55th to 60th percentile of all U.S. households according to the 2022 SCF distribution. The 45–54 age SCF median is $247,200, so this household is close to the typical midpoint for its age group.",
    faqs: [
      {
        question: "What is the median net worth in the U.S.?",
        answer:
          "The median U.S. household net worth is approximately $192,700, according to the Federal Reserve's 2022 Survey of Consumer Finances. Half of all households have more than this, and half have less. The median is a far more realistic benchmark than the mean ($1.06 million), which is skewed upward by a small number of ultra-wealthy households.",
      },
      {
        question: "How much net worth do you need to be in the top 10%?",
        answer:
          "To reach the top 10% of U.S. households by net worth, you need approximately $1.46 million, based on the 2022 Survey of Consumer Finances. The top 1% threshold is approximately $11.1 million. These cutoffs include all ages combined — younger households typically need lower absolute amounts to rank in the upper percentiles for their age group.",
      },
      {
        question: "Why is average net worth so much higher than median net worth?",
        answer:
          "The mean (average) U.S. household net worth is roughly $1.06 million while the median is $192,700 — nearly a 6× gap. This happens because the top 1% of households hold approximately 31% of all U.S. household wealth, according to the Federal Reserve's Distributional Financial Accounts. A small number of billionaires pull the average far above what a typical household actually holds.",
      },
      {
        question: "Does the Federal Reserve measure net worth by individual or household?",
        answer:
          "The Federal Reserve's Survey of Consumer Finances measures net worth at the household level. That means a couple's combined assets and debts form a single data point. When comparing to SCF percentile benchmarks, use your total household net worth — both partners' assets and liabilities combined.",
      },
      {
        question: "How do I compare my net worth to people my age?",
        answer:
          "For age-specific benchmarks, use the [net worth by age calculator](/net-worth/net-worth-by-age-calculator/), which shows the 2022 SCF median for your age bracket. The overall percentile calculator here compares you to all U.S. households regardless of age.",
      },
    ],
    sources: [
      {
        label: "Federal Reserve — Survey of Consumer Finances 2022",
        url: "https://www.federalreserve.gov/econres/scfindex.htm",
      },
      {
        label: "Federal Reserve — Distributional Financial Accounts (DFA)",
        url: "https://www.federalreserve.gov/releases/z1/dataviz/dfa/distribute/chart/",
      },
    ],
    toolHeading: "Find your net worth percentile",
    toolSubheading: "Enter your assets and debts — see where you rank among U.S. households.",
    preset: {
      cash: 15000,
      investments: 40000,
      retirement: 120000,
      realEstate: 350000,
      vehicles: 25000,
      otherAssets: 0,
      mortgage: 250000,
      autoLoans: 18000,
      studentLoans: 22000,
      creditCards: 6000,
      otherDebt: 0,
      age: 40,
    },
    relatedSlugs: [
      "how-to-calculate-net-worth",
      "net-worth-by-age-calculator",
      "liquid-net-worth-calculator",
    ],
  },

  {
    calculator: "net-worth",
    slug: "couples-net-worth-calculator",
    title: "Couples Net Worth Calculator: Track Together",
    metaDescription:
      "Calculate combined household net worth for couples. Enter both partners' assets and debts to see your true financial picture as a household unit.",
    targetKeyword: "couples net worth calculator",
    estimatedVolume: 2400,
    estimatedKD: 30,
    h1: "Couples Net Worth Calculator",
    intro:
      "A household net worth calculation combines both partners' assets and liabilities into a single number that reflects your shared financial position. The Federal Reserve's Survey of Consumer Finances — the authoritative source on U.S. household wealth — measures net worth at the household level for exactly this reason. Use the calculator above to enter both partners' figures together, then read on for what joint tracking reveals that individual tracking misses.",
    howItWorks:
      "Combined household net worth equals the total of both partners' assets minus the total of both partners' liabilities. Assets to include: all checking and savings accounts, taxable investment accounts, retirement balances (401(k), IRA, pension present value), the current market value of jointly or individually owned real estate, and vehicles. Liabilities to subtract: the remaining mortgage balance, all auto loans, student loans held by either partner, credit card balances, and any personal loans.\n\nThe key reason to track jointly: nearly every major financial decision — buying a home, planning retirement, setting insurance coverage, qualifying for a mortgage — is evaluated at the household level by lenders, the IRS, and the Federal Reserve alike. Knowing only your individual number leaves half the picture missing. For comparison to U.S. benchmarks, use the [net worth percentile calculator](/net-worth/net-worth-percentile-calculator/) after you've combined your figures.\n\nOnce you have a combined number, two adjacent decisions apply at the household level. First, a prenup or postnup defines how those assets split at divorce or death — the [prenup cost calculator](/estate-planning/prenup-cost-calculator/) shows state-by-state attorney fees plus UPAA/UPMAA enforceability rules and California's mandatory 7-day waiting period. Second, above roughly $850,000 combined net worth with kids or cross-state property, a will alone stops being enough — the [estate planning calculator](/estate-planning/) shows the specific plan tier (simple will, complex will, revocable trust, or full estate plan) your household actually needs.",
    commonMistakes: [
      "Tracking only individual net worth when financial decisions are made jointly. A mortgage application, for example, uses combined income and combined debt load.",
      "Omitting one partner's student loans because they feel like 'their debt.' In a household budget, both partners' debts reduce the household's financial margin.",
      "Forgetting to include both partners' retirement accounts. A spouse's 401(k) is part of the household's long-term wealth even if the other partner has no access to it today.",
      "Using a joint number for age benchmarks without accounting for age gap. If partners differ in age by more than a few years, the SCF age-bracket comparison is less meaningful at the household level.",
      "Conflating legal ownership with financial reality. Even in separate-property states, both partners' incomes and debts affect household cash flow and should both appear in a planning-level net worth calculation.",
    ],
    workedExample:
      "A couple, both age 42, pools their figures. Partner A has $20,000 cash, $60,000 in investments, $180,000 in retirement accounts, a $500,000 home, and $30,000 vehicle. Partner B has $10,000 cash, $20,000 in investments, and $60,000 in retirement accounts. Combined assets: $880,000. Partner A carries a $380,000 mortgage, $15,000 auto loan, and $15,000 student loans. Partner B carries $15,000 student loans and $8,000 in credit cards. Combined liabilities: $433,000. Household net worth: $447,000. The 2022 SCF median for the 35–44 bracket is $135,600 — this household sits well above the median for their age group.",
    faqs: [
      {
        question: "Should couples calculate net worth together or separately?",
        answer:
          "Both. Calculate jointly to see your household financial position for major decisions like buying a home, planning retirement, or qualifying for insurance. Calculate separately to track individual credit health and to ensure each partner has independent financial footing. The Federal Reserve's SCF uses the household level for wealth comparisons.",
      },
      {
        question: "Do co-signed loans count in both partners' net worth?",
        answer:
          "Yes — and this is a non-obvious point. If one partner co-signs the other's student loan, both partners are legally responsible for the full balance. In a household net worth calculation, the loan appears once as a liability. But in individual credit profiles and individual financial assessments, both co-signers bear the debt. Track it in the joint calculation and make sure both partners understand their individual exposure.",
      },
      {
        question: "How does the Federal Reserve measure household net worth?",
        answer:
          "The Federal Reserve's Survey of Consumer Finances measures net worth at the household level — combining all assets and liabilities of everyone in the household unit. This is why SCF median benchmarks should be compared to your combined household net worth, not to one partner's individual figure.",
      },
      {
        question: "What if partners have very different asset levels?",
        answer:
          "Net worth is still calculated the same way — total assets minus total liabilities for the household. A significant imbalance between partners is useful information: it may indicate one partner has stronger individual financial standing, which matters if the couple separates or if one partner needs to qualify for credit independently.",
      },
      {
        question: "How does this relate to the net worth by age calculator?",
        answer:
          "The [net worth by age calculator](/net-worth/net-worth-by-age-calculator/) uses SCF medians by age of the household head. For couples, use the age of the primary earner or the older partner to get the most relevant benchmark, then compare your combined household net worth to that figure.",
      },
    ],
    sources: [
      {
        label: "Federal Reserve — Survey of Consumer Finances household methodology",
        url: "https://www.federalreserve.gov/econres/scfindex.htm",
      },
      {
        label: "CFPB — Joint financial planning resources",
        url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/",
      },
    ],
    toolHeading: "Calculate your household net worth together",
    toolSubheading: "Enter both partners' assets and debts to see your combined financial picture.",
    preset: {
      cash: 30000,
      investments: 80000,
      retirement: 240000,
      realEstate: 500000,
      vehicles: 40000,
      otherAssets: 0,
      mortgage: 380000,
      autoLoans: 25000,
      studentLoans: 30000,
      creditCards: 8000,
      otherDebt: 0,
      age: 42,
    },
    relatedSlugs: [
      "how-to-calculate-net-worth",
      "net-worth-by-age-calculator",
      "net-worth-percentile-calculator",
    ],
  },

  {
    calculator: "net-worth",
    slug: "net-worth-projection-calculator",
    title: "Net Worth Projection Calculator: See Your Future",
    metaDescription:
      "Project your net worth 10–20 years out. See when you'll hit $1M and how savings rate and investment return change the timeline.",
    targetKeyword: "net worth projection calculator",
    estimatedVolume: 3600,
    estimatedKD: 38,
    h1: "Net Worth Projection Calculator",
    intro:
      "A net worth projection calculator estimates where you'll be financially in 5, 10, and 20 years based on your current net worth, annual savings, and expected investment return. Today's snapshot — your assets minus your debts — is the starting line. This spoke explains how to use that number as the foundation for a forward-looking projection so you can see when key milestones like $500,000 or $1 million become reachable.",
    howItWorks:
      "Net worth projection starts with your current net worth and then applies two growth levers year by year: the amount you add each year (your savings rate) and the return your existing assets earn (your investment return rate). In formula terms: projected net worth in year N = (current net worth × (1 + return rate)^N) + (annual savings × ((1 + return rate)^N − 1) / return rate).\n\nTwo factors drive the result, but their relative importance shifts over time. In the early years, your savings rate — how much new money you add each year — has more impact than your return rate. If your current net worth is $50,000 and you add $12,000 a year, doubling that contribution to $24,000 increases your 10-year projection far more than raising your return assumption from 6% to 8% on the same $50,000 base. Once your net worth grows to roughly 10× your annual income, however, the math flips: at that scale, a 2-percentage-point change in return rate outweighs any realistic increase in annual savings. That crossover point is one of the most useful — and least discussed — insights in personal finance planning. For age-based context on where you stand today, see the [net worth by age calculator](/net-worth/net-worth-by-age-calculator/).",
    commonMistakes: [
      "Using an unrealistically high return assumption. The SEC's compound-interest illustrations typically use 6–7% as a long-term nominal equity return benchmark. Assuming 10–12% compounding overstates likely outcomes.",
      "Forgetting that savings rate must account for taxes and living expenses — the number that matters is net annual additions to investment accounts, not gross income.",
      "Projecting linear debt paydown without accounting for the freed-up cash flow once a loan is paid off. Paying off a car loan at year 3 increases available savings from year 4 onward.",
      "Treating the projection as a guaranteed outcome rather than a sensitivity tool. Run at least three scenarios: conservative (5% return, current savings), base (7% return, modest savings increase), and optimistic (8% return, aggressive savings).",
      "Ignoring inflation. A projected net worth of $1 million in 20 years has less purchasing power than $1 million today. In real (inflation-adjusted) terms, use a real return rate of roughly 4–5% instead of nominal.",
    ],
    workedExample:
      "A 35-year-old has a current net worth of $254,000: $20,000 cash, $50,000 investments, $100,000 in retirement accounts, a $300,000 home, $20,000 in vehicles, minus a $240,000 mortgage, $15,000 auto loan, $18,000 student loans, and $4,000 in credit cards. They save $15,000 per year in net additions to their investment and retirement accounts. At a 7% annual return, their 10-year projected net worth is approximately $757,000, and their 20-year projection exceeds $2.1 million. Raising the savings rate to $20,000 per year moves the 10-year projection to roughly $843,000 — an $86,000 increase from the extra savings alone. Compare that to bumping the return assumption from 7% to 9%, which adds about $109,000 over 10 years on the same savings — meaningful, but not dramatically different at this stage. By year 20, the return-rate lever dominates.",
    faqs: [
      {
        question: "What is a net worth projection calculator?",
        answer:
          "A net worth projection calculator estimates your future net worth by applying your expected savings rate and investment return to your current net worth over a set time horizon. It shows when you might hit financial milestones like $500,000 or $1 million and lets you test how changes to savings or return rate change the timeline.",
      },
      {
        question: "Does savings rate or investment return matter more?",
        answer:
          "It depends on where you are in the wealth-building journey. When net worth is small relative to income — say, under 5× annual income — adding more money each year matters more than squeezing out extra return. Once net worth exceeds roughly 10× annual income, your investment return rate begins to dominate. This is why high earners benefit most from optimizing asset allocation, while people earlier in their careers benefit most from increasing their savings rate.",
      },
      {
        question: "What return rate should I use for a net worth projection?",
        answer:
          "The SEC's Investor.gov compound-interest calculator uses 6% and 8% as illustrative long-term return rates. Many financial planners use 6–7% as a nominal return assumption for a diversified stock-and-bond portfolio over 20+ years. Avoid assuming 10–12% consistently, as that reflects peak historical equity returns and overstates likely long-run outcomes for most investors.",
      },
      {
        question: "How do I project net worth if I have debt?",
        answer:
          "Start with your current net worth (assets minus all debts) as the baseline — the debt is already baked in. Each year, your net worth grows from two sources: investment returns on your existing assets and net new savings added. As debts like auto loans are paid off, the freed cash flow can shift into savings, boosting future projections.",
      },
      {
        question: "Where can I see how my current net worth compares to peers?",
        answer:
          "Use the [net worth by age calculator](/net-worth/net-worth-by-age-calculator/) for SCF median benchmarks by age group, or the [net worth percentile calculator](/net-worth/net-worth-percentile-calculator/) to see your rank among all U.S. households. Both use Federal Reserve 2022 Survey of Consumer Finances data.",
      },
    ],
    sources: [
      {
        label: "Federal Reserve — Economic research on household wealth accumulation",
        url: "https://www.federalreserve.gov/econres/scfindex.htm",
      },
      {
        label: "SEC Investor.gov — Compound Interest Calculator",
        url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator",
      },
    ],
    toolHeading: "Project your net worth into the future",
    toolSubheading: "See your 10- and 20-year milestones based on today's snapshot plus your savings rate.",
    preset: {
      cash: 20000,
      investments: 50000,
      retirement: 100000,
      realEstate: 300000,
      vehicles: 20000,
      otherAssets: 0,
      mortgage: 240000,
      autoLoans: 15000,
      studentLoans: 18000,
      creditCards: 4000,
      otherDebt: 0,
      age: 35,
    },
    relatedSlugs: [
      "how-to-calculate-net-worth",
      "net-worth-by-age-calculator",
      "liquid-net-worth-calculator",
    ],
  },
];
