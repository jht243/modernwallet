import type { SpokeEntry } from "./types";

// InvestmentIQ (investing) spokes. Powered by src/lib/investment.ts. Preset flags: `showFrequency`
// exposes the compounding-frequency control; `goalMode` switches to the reverse "monthly needed"
// solver. CONTENT: keyword-gap system — guided research+write (SEC/FINRA/FDIC/CFPB primary sources,
// engine ground-truth figures) + adversarial audit per page. See CONTENT.md.

export const INVESTING_SPOKES: SpokeEntry[] = [
  {
    calculator: "investing",
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator: Grow Your Money",
    metaDescription:
      "Use this compound interest calculator to see how your money grows over time and how compounding frequency affects your returns. Free and simple.",
    targetKeyword: "compound interest calculator",
    estimatedVolume: 823000,
    estimatedKD: 65,
    h1: "Compound Interest Calculator",
    intro:
      "This compound interest calculator shows how your money grows when you earn interest on your interest. Enter a starting amount, a monthly contribution, your expected return, and a time period. The calculator above also lets you choose how often interest compounds, from yearly to daily, so you can see the effect for yourself.",
    howItWorks:
      "Compound interest is the interest you earn on both your original money and the interest it has already earned. Over time, this snowball effect can grow your balance far beyond what you put in. To use the tool, enter your starting balance, regular contribution, annual return rate, and number of years.\n\nThe calculator above includes a compounding frequency control. Compounding frequency is how often your earned interest gets added back to your balance. More frequent compounding earns slightly more. But time and your return rate matter far more, so focus there first. To project a full portfolio, try the [investment growth calculator](/investing/investment-growth-calculator/).",
    commonMistakes: [
      "Forgetting to add regular contributions. Steady monthly deposits often drive most of your long-term growth, not the starting balance.",
      "Overestimating your annual return. Using an unrealistic rate inflates results. A modest, realistic figure gives a more useful estimate.",
      "Obsessing over compounding frequency. Daily versus annual compounding changes results only slightly compared to time and rate.",
      "Ignoring inflation and taxes. The calculator shows nominal growth, so your real spending power will be lower.",
      "Starting too late. Compounding rewards time, so delaying even a few years can cost you a large share of your final balance.",
    ],
    workedExample:
      "Imagine you start with $5,000 and add $200 every month. You expect a 6% annual return, compounded monthly, and you leave the money invested for 30 years. After 30 years, your balance grows to $231,016. You contributed $77,000 of your own money over that time. The remaining $154,016 is pure growth, the interest earned on your interest. This shows why time in the market matters so much.",
    faqs: [
      { question: "What is a compound interest calculator?", answer: "A compound interest calculator is a tool that shows how your money grows when you earn interest on your interest. You enter a starting amount, contributions, a return rate, and a time period. It then estimates your future balance. The calculator above also lets you pick how often interest compounds." },
      { question: "How does compounding frequency affect my returns?", answer: "More frequent compounding earns slightly more, but the difference is small. On $10,000 at 5% over 10 years with no contributions, annual compounding grows to $16,289. Quarterly reaches $16,436, monthly $16,470, and daily $16,487. Time and your return rate matter far more than frequency." },
      { question: "What is the Rule of 72?", answer: "The Rule of 72 is a quick way to estimate how long it takes money to double. You divide 72 by your annual return rate. At a 6% return, your money doubles in about 12 years. It is an estimate, not an exact figure, but it helps you gauge growth fast." },
      { question: "Why does compound interest grow money so fast over time?", answer: "Compound interest grows money quickly because you earn returns on your past returns, not just your original deposit. Each year, the base that earns interest gets larger. This creates a snowball effect that speeds up the longer you stay invested, which is why starting early matters." },
    ],
    sources: [
      { label: "SEC Investor.gov — Compound Interest Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" },
      { label: "SEC Investor.gov — What Is Compound Interest?", url: "https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/what-compound-interest" },
      { label: "FINRA — Tools and Calculators", url: "https://www.finra.org/investors/tools-and-calculators" },
    ],
    toolHeading: "See compound interest in action",
    toolSubheading: "Adjust the rate, time, and compounding frequency to watch growth accelerate.",
    preset: { currentBalance: 5000, monthlyContribution: 200, annualReturnPct: 6, years: 30, compoundsPerYear: 12, showFrequency: true },
    relatedSlugs: ["investment-growth-calculator", "high-yield-savings-calculator", "savings-goal-calculator"],
  },

  {
    calculator: "investing",
    slug: "investment-growth-calculator",
    title: "Investment Growth Calculator: Project Returns",
    metaDescription:
      "Use this free investment growth calculator to project how regular contributions and compounding can grow your portfolio over time.",
    targetKeyword: "investment growth calculator",
    estimatedVolume: 22200,
    estimatedKD: 53,
    h1: "Investment Growth Calculator",
    intro:
      "This investment growth calculator projects how your portfolio could grow when you invest a lump sum and add regular contributions. Enter your starting balance, monthly deposit, expected return, and time frame in the calculator above. It shows your future balance and how much of that is compounding growth versus the money you put in. Projections assume one fixed return; real markets rise and fall each year.",
    howItWorks:
      "The investment growth calculator above multiplies three forces: your starting balance, your ongoing contributions, and compound growth. Compounding means you earn returns on your past returns, not just your original money. Each month, your balance grows, and that larger balance earns the next round of returns.\n\nYour result depends heavily on the return you assume. Historically, a broad U.S. stock portfolio has returned just over 10% per year before inflation, according to FINRA. After inflation, that long-run figure is closer to 7% in real, spending-power terms. Pick a rate that matches your mix of stocks, bonds, and cash, then treat the output as an estimate, not a promise.",
    commonMistakes: [
      "Assuming a high return like 10% for a portfolio that holds bonds or cash, which historically return far less.",
      "Confusing nominal and real returns. A 10% nominal return is closer to 7% after inflation erodes your buying power.",
      "Treating the projection as guaranteed. Real markets swing up and down, so no single year matches the fixed rate.",
      "Skipping regular contributions. Steady monthly deposits often drive more of your final balance than the starting amount.",
      "Stopping contributions early. Cutting deposits short removes the years when compounding has the most money to work on.",
    ],
    workedExample:
      "Say you start with $25,000 and add $1,000 every month for 25 years, assuming an 8% annual return compounded monthly. The calculator above projects a future balance of $1,134,531. Over those 25 years you contribute $325,000 of your own money: the $25,000 start plus $1,000 across 300 months. The remaining $809,531 is pure growth. Put another way, your $325,000 in contributions turns into roughly 2.5 times that amount, and most of your ending balance is money the market earned for you.",
    faqs: [
      { question: "What is an investment growth calculator?", answer: "An investment growth calculator projects how a portfolio could grow over time from a starting balance, regular contributions, and an assumed annual return. It separates the money you put in from the growth compounding adds. Use it to set targets and compare different savings rates." },
      { question: "What return rate should I use?", answer: "Match the rate to your investment mix. A broad U.S. stock portfolio has historically returned just over 10% per year before inflation, per FINRA, while bonds and cash return far less. A conservative or blended portfolio may justify a lower assumption like 6% to 8%." },
      { question: "What is the difference between nominal and real returns?", answer: "Nominal return is the raw percentage your money grows. Real return subtracts inflation to show your actual gain in buying power. A long-run stock return near 10% nominal is closer to 7% real, so the calculator's dollar figures buy less in the future than today." },
      { question: "Do my contributions or my starting amount matter more?", answer: "For most long-term investors, steady contributions matter more. In the example above, $300,000 in monthly deposits dwarfs the $25,000 starting balance. Consistent investing over many years usually beats trying to time the market or relying on one upfront sum." },
      { question: "Is the projected balance guaranteed?", answer: "No. The projection assumes one fixed return every year, but real markets gain and lose value unpredictably. Treat the result as a planning estimate, not a promise. To compare a safe-cash option, see the [high yield savings calculator](/investing/high-yield-savings-calculator/)." },
    ],
    sources: [
      { label: "FINRA — Risk (historical asset-class returns and inflation)", url: "https://www.finra.org/investors/investing/investing-basics/risk" },
      { label: "SEC Investor.gov — Compound Interest", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest" },
    ],
    toolHeading: "Project your portfolio's growth",
    toolSubheading: "See how a lump sum plus monthly contributions compound over the years.",
    preset: { currentBalance: 25000, monthlyContribution: 1000, annualReturnPct: 8, years: 25 },
    relatedSlugs: ["compound-interest-calculator", "high-yield-savings-calculator", "savings-goal-calculator"],
  },

  {
    calculator: "investing",
    slug: "high-yield-savings-calculator",
    title: "High Yield Savings Calculator: Your APY Earnings",
    metaDescription:
      "Use this high yield savings calculator to see how much your money earns over time at a given APY, with monthly deposits and compounding.",
    targetKeyword: "high yield savings calculator",
    estimatedVolume: 33100,
    estimatedKD: 51,
    h1: "High Yield Savings Calculator",
    intro:
      "This high yield savings calculator shows how much a high-yield savings account (HYSA) can earn over time. Enter your starting balance, monthly deposit, APY, and time frame in the calculator above to see your projected balance. It separates the money you contribute from the interest you earn, so the growth is easy to follow. Remember that HYSA rates are variable and can rise or fall at any time.",
    howItWorks:
      "A high-yield savings account pays interest on your balance, and that interest compounds. Compounding means you earn interest on your past interest, not just your deposits. The calculator above grows your starting balance and each monthly deposit at your chosen APY, compounded monthly, then totals the result. To go deeper on compounding, try the [compound interest calculator](/investing/compound-interest-calculator/).\n\nFocus on the APY, not the plain interest rate. The Consumer Financial Protection Bureau notes that APY already reflects how often interest compounds. Because APY bakes in compounding, you can compare one account's APY directly to another's. To plan toward a target balance, use the [savings goal calculator](/investing/savings-goal-calculator/).",
    commonMistakes: [
      "Comparing a plain interest rate to an APY. APY already includes compounding, so always compare APY to APY.",
      "Assuming the rate is fixed. HYSA rates are variable and can drop when the bank chooses, which lowers future earnings.",
      "Treating a HYSA like a long-term investment. It is great for an emergency fund but usually trails long-term stock market returns.",
      "Ignoring the FDIC limit. Insurance covers $250,000 per depositor, per bank, per ownership category, so large balances at one bank may exceed it.",
      "Forgetting that interest is taxable. Savings interest is generally taxed as income, so your after-tax gain is smaller than the calculator shows.",
    ],
    workedExample:
      "Say you start with $10,000 and add $300 every month to a HYSA earning 4.5% APY, compounded monthly. After 10 years, the calculator projects a balance of $61,029. You contributed $46,000 of that yourself: the $10,000 start plus $300 a month for 120 months. The remaining $15,029 is interest earned. That extra growth comes from compounding, but note the 4.5% APY is not guaranteed, since HYSA rates can change over time.",
    faqs: [
      { question: "How accurate is this high yield savings calculator?", answer: "This high yield savings calculator is accurate for the inputs you enter, using monthly compounding. Real results will differ because HYSA rates are variable and can change at any time. Treat the projection as an estimate, not a guarantee." },
      { question: "What is the difference between APY and interest rate?", answer: "The interest rate is the base percentage your balance earns. APY (annual percentage yield) includes the effect of compounding, so it shows your true yearly return. The CFPB confirms APY reflects how often interest compounds. Always compare accounts by APY." },
      { question: "Is my money in a high-yield savings account safe?", answer: "Money in an FDIC-insured bank is protected up to $250,000 per depositor, per bank, per ownership category. That covers savings, checking, money market, and CD balances. If you hold more than the limit, spread it across banks or ownership categories to stay fully insured." },
      { question: "Is a high-yield savings account a good investment?", answer: "A HYSA is a strong place for an emergency fund and short-term savings, since the balance is safe and easy to reach. But it usually trails long-term stock market returns. For long-term goals, compare with the [investment growth calculator](/investing/investment-growth-calculator/)." },
      { question: "Do high-yield savings rates change?", answer: "Yes. HYSA rates are variable, so a bank can raise or lower the APY at any time. A rate that looks great today may drop later. The national average savings rate was just 0.38% as of June 2026, so shop around for a higher APY." },
    ],
    sources: [
      { label: "FDIC — National Rates and Rate Caps", url: "https://www.fdic.gov/national-rates-and-rate-caps" },
      { label: "FDIC — Understanding Deposit Insurance ($250,000 coverage)", url: "https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance" },
      { label: "CFPB — Truth in Savings (Regulation DD, APY)", url: "https://www.consumerfinance.gov/rules-policy/regulations/1030/" },
    ],
    toolHeading: "How much will your savings earn?",
    toolSubheading: "Enter your balance, deposits, and APY to see interest earned over time.",
    preset: { currentBalance: 10000, monthlyContribution: 300, annualReturnPct: 4.5, years: 10 },
    relatedSlugs: ["compound-interest-calculator", "investment-growth-calculator", "savings-goal-calculator"],
  },

  {
    calculator: "investing",
    slug: "savings-goal-calculator",
    title: "Savings Goal Calculator: How Much to Save Monthly",
    metaDescription:
      "Use this savings goal calculator to find the monthly amount you need to save to hit a target by your deadline. See a worked example and avoid mistakes.",
    targetKeyword: "savings goal calculator",
    estimatedVolume: 6600,
    estimatedKD: 39,
    h1: "Savings Goal Calculator: Find Your Monthly Number",
    intro:
      "This savings goal calculator tells you how much to save each month to reach a target by a set date. You enter your goal, your starting balance, your time frame, and an expected return. The calculator above then solves for the one number that matters most: your required monthly contribution. That turns a giant, vague goal into a clear monthly habit you can actually track.",
    howItWorks:
      "A savings goal calculator works backward from your target. Instead of asking how big your savings will grow, it asks how much you must add each month to land on a specific number by a specific date. It takes your goal amount, current balance, years remaining, and an assumed annual return, then compounds the math monthly.\n\nThe result is a single monthly figure. Time and return both shape that number. A longer time frame lets compounding do more work, so each monthly deposit can be smaller. A higher assumed return also lowers the monthly amount, but it adds risk, so choose a rate that fits how you invest. To see how a fixed deposit grows instead, use the [investment growth calculator](/investing/investment-growth-calculator/).",
    commonMistakes: [
      "Assuming the starting balance alone will carry you. A lump sum left to grow rarely covers a large goal, so monthly contributions usually do the heavy lifting.",
      "Picking an unrealistic return. A high rate shrinks your monthly number on screen but raises real-world risk. Match the rate to your actual investments.",
      "Ignoring inflation. A target set in today's dollars may buy less by your deadline, so revisit big goals over time.",
      "Treating the monthly amount as fixed forever. Re-run the numbers after raises, market swings, or a changed deadline.",
      "Starting late. Each year you wait raises the monthly amount needed, because compounding has less time to help.",
    ],
    workedExample:
      "Say your goal is $1,000,000 in 30 years. You start with $20,000 and assume a 7% annual return compounded monthly. Left alone with no monthly deposits, that $20,000 grows to only about $162,330, roughly 16% of the goal. So the contributions carry the rest. The calculator shows you need to save about $687 each month to reach $1,000,000. Breaking a seven-figure target into one monthly number makes it feel reachable.",
    faqs: [
      { question: "What is a savings goal calculator?", answer: "A savings goal calculator tells you how much to save each month to reach a target amount by a chosen date. You enter your goal, current balance, time frame, and expected return, and it solves for the monthly contribution needed." },
      { question: "How much do I need to save each month to reach $1 million?", answer: "It depends on your time frame, starting balance, and return. For example, with $20,000 saved today, a 7% annual return, and 30 years, you would need about $687 per month to reach $1,000,000. Enter your own numbers in the calculator above." },
      { question: "Does starting earlier lower the monthly amount I need?", answer: "Yes. Starting earlier gives compounding more time to work, so each monthly deposit can be smaller. Waiting raises the monthly amount needed because there are fewer years for your money to grow." },
      { question: "What return rate should I use?", answer: "Use a rate that matches how your money is invested, not a best-case guess. A higher assumed return lowers your monthly number but adds risk. A conservative rate gives a safer, more realistic monthly target." },
    ],
    sources: [
      { label: "SEC Investor.gov — Savings Goal Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/savings-goal-calculator" },
      { label: "SEC Investor.gov — Compound Interest", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest" },
    ],
    toolHeading: "How much should you save each month?",
    toolSubheading: "Enter your goal and timeline to get your required monthly contribution.",
    preset: { goalMode: true, targetAmount: 1000000, currentBalance: 20000, monthlyContribution: 0, annualReturnPct: 7, years: 30 },
    relatedSlugs: ["compound-interest-calculator", "investment-growth-calculator", "high-yield-savings-calculator"],
  },
];
