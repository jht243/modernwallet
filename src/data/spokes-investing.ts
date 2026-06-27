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
      { question: "How do taxes reduce my compound interest returns?", answer: "In a taxable brokerage account, investment earnings — dividends, interest, and realized capital gains — are taxed annually, which reduces your effective compounding rate. A 22% federal income tax bracket applied to a 10% nominal return leaves roughly 7.8% after tax on ordinary income (10% × (1 − 0.22) = 7.8%). Over 30 years the difference is dramatic: $10,000 growing at 10% reaches approximately $174,500, while the same amount at 7.8% reaches only about $96,000 — nearly half as much. Tax-advantaged accounts like a Roth IRA or 401(k) eliminate this annual drag entirely, which is why most advisors recommend maxing those before investing in taxable accounts." },
    ],
    sources: [
      { label: "SEC Investor.gov — Compound Interest Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" },
      { label: "SEC Investor.gov — What Is Compound Interest?", url: "https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/what-compound-interest" },
      { label: "FINRA — Tools and Calculators", url: "https://www.finra.org/investors/tools-and-calculators" },
    ],
    toolHeading: "See compound interest in action",
    toolSubheading: "Adjust the rate, time, and compounding frequency to watch growth accelerate.",
    preset: { currentBalance: 5000, monthlyContribution: 200, annualReturnPct: 6, years: 30, compoundsPerYear: 12, showFrequency: true },
    relatedSlugs: ["investment-growth-calculator", "roth-ira-calculator", "savings-goal-calculator"],
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
    relatedSlugs: ["compound-interest-calculator", "sp500-calculator", "withdrawal-calculator"],
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
    relatedSlugs: ["roth-ira-calculator", "withdrawal-calculator", "high-yield-savings-calculator"],
  },

  {
    calculator: "investing",
    slug: "roth-ira-calculator",
    title: "Roth IRA Calculator: Project Tax-Free Growth",
    metaDescription:
      "Project your Roth IRA balance using 2026 contribution limits. See how post-tax contributions grow tax-free over decades. Includes income phase-out info.",
    targetKeyword: "Roth IRA calculator",
    estimatedVolume: 110000,
    estimatedKD: 60,
    h1: "Roth IRA Calculator",
    intro:
      "A Roth IRA lets you invest after-tax dollars today so that growth and qualified withdrawals in retirement are completely tax-free. Use the calculator above to project your balance by entering your current savings, a monthly contribution up to the annual limit, an expected return, and a time horizon. The 2026 IRS annual contribution limit is $7,000 ($8,000 if you are age 50 or older), per IRS Publication 590-A — so $583 per month gets you to the full limit. Results are estimates; actual growth depends on market performance and your individual tax situation.",
    howItWorks:
      "A Roth IRA calculator applies compound growth to your after-tax contributions. Because contributions are not deducted from income now, qualified withdrawals in retirement — principal and earnings — are tax-free under current law (IRS Publication 590-B). The calculator above projects your balance using the standard future-value formula applied monthly.\n\nTwo rules determine how much you can contribute. First, the annual limit: $7,000 in 2026, or $8,000 if you are 50 or older (IRS Publication 590-A). Second, an income phase-out: for 2024, single filers begin losing the ability to contribute at $146,000 of modified adjusted gross income and lose it entirely at $161,000; married filing jointly phase-out runs $230,000–$240,000. The IRS adjusts these figures annually. If your income exceeds the limit, a backdoor Roth conversion — contributing to a traditional IRA then converting — is a legal workaround described in IRS Notice 2010-84. The real, non-obvious advantage of a Roth is tax-rate arbitrage: if you are in a lower bracket now than you expect to be in retirement, paying taxes today locks in that lower rate on all future growth. To compare with a taxable account, see the [investment growth calculator](/investing/investment-growth-calculator/).\n\nRoth IRA vs Traditional IRA — the key differences at a glance: A Roth IRA uses after-tax contributions so qualified withdrawals are 100% tax-free, has no required minimum distributions (RMDs) during your lifetime, and has income limits ($161,000 single / $240,000 married for 2024). A Traditional IRA gives you a tax deduction on contributions now (if you meet income rules), but every withdrawal in retirement is taxed as ordinary income — and you must take RMDs starting at age 73 whether you need the money or not. Both share the $7,000 annual limit. The verdict: choose Roth IRA when you expect a higher tax rate in retirement than you pay today, or when you value flexibility and zero RMDs. Choose Traditional IRA when you need the upfront deduction to lower this year's tax bill and expect a lower bracket in retirement. Many savers do both.",
    commonMistakes: [
      "Contributing more than the annual limit. Excess contributions trigger a 6% excise tax per year until corrected, per IRS Publication 590-A.",
      "Ignoring the income phase-out. High earners who contribute directly may owe the excess-contribution penalty — check your MAGI before contributing.",
      "Assuming you can withdraw earnings at any time. Earnings are tax- and penalty-free only after age 59½ and a five-year holding period; early withdrawals of earnings may trigger taxes and a 10% penalty.",
      "Forgetting that the limit applies across all IRAs combined. Your $7,000 cap is shared between traditional and Roth IRAs — you cannot put $7,000 into each.",
      "Using a too-conservative return for a decades-long horizon. A Roth IRA held for 30+ years is typically invested in equities, so assuming a 4% savings-account rate understates likely growth.",
    ],
    workedExample:
      "Suppose you open a Roth IRA at age 35 with $10,000 already saved and contribute $583 per month (roughly $7,000 per year, the 2026 limit) for 30 years, earning an average of 7% annually. By age 65 the calculator projects a balance of approximately $730,000. Your total out-of-pocket contributions over that period are about $219,800. The remaining $510,000-plus is tax-free compounded growth — income you will never owe federal tax on in retirement, unlike a traditional IRA or 401(k), where every dollar withdrawn is taxable.",
    faqs: [
      {
        question: "What is the Roth IRA contribution limit for 2026?",
        answer:
          "The 2026 Roth IRA contribution limit is $7,000, or $8,000 if you are age 50 or older — the same as 2024 and 2025 levels per IRS Publication 590-A. The IRS adjusts limits for inflation periodically, so check IRS.gov each year for the current figure.",
      },
      {
        question: "What is the Roth IRA income limit?",
        answer:
          "For 2024, single filers start losing the ability to contribute at $146,000 of modified adjusted gross income and are fully phased out at $161,000. Married filing jointly phase-out runs $230,000–$240,000. The IRS updates these thresholds annually. If you exceed the limit, look into a backdoor Roth conversion.",
      },
      {
        question: "What is a backdoor Roth IRA?",
        answer:
          "A backdoor Roth conversion lets high-income earners who exceed the income phase-out contribute to a non-deductible traditional IRA, then convert that balance to a Roth IRA. IRS Notice 2010-84 confirms this is permissible. If you have other pre-tax IRA balances, the pro-rata rule may create a taxable event — consult a tax advisor.",
      },
      {
        question: "When can I withdraw from a Roth IRA tax-free?",
        answer:
          "Qualified distributions — meaning withdrawals of both contributions and earnings — are tax- and penalty-free once you are 59½ and have held the Roth for at least five years. You can always withdraw your original contributions (not earnings) at any age without tax or penalty, per IRS Publication 590-B.",
      },
      {
        question: "Roth IRA vs. traditional IRA: which is better?",
        answer:
          "It depends on your current versus expected future tax rate. A Roth is advantageous if you are in a lower bracket now than you expect in retirement — you pay taxes today at the lower rate and never pay them again on growth. A traditional IRA gives an upfront deduction but all withdrawals are taxed. If your future tax rate is uncertain, contributing to both is a common hedge.",
      },
      {
        question: "What are the biggest differences between a Roth IRA and a Traditional IRA?",
        answer:
          "Four differences matter most. (1) Tax timing: Roth contributions are after-tax — no deduction now, but withdrawals are forever tax-free. Traditional contributions may be tax-deductible now, but every withdrawal is taxed as ordinary income. (2) Required minimum distributions: Roth IRAs have no RMDs during the owner's lifetime; Traditional IRAs require withdrawals starting at age 73. (3) Income limits: Roth IRA has income limits ($161,000 single / $240,000 married in 2024); Traditional IRA has no income limit to contribute, though the deduction phases out for high earners with a workplace plan. (4) Withdrawal flexibility: Roth contributions (not earnings) can be withdrawn anytime without penalty — Traditional IRA withdrawals before 59½ trigger a 10% penalty. For a full comparison, see [401(k) vs Roth IRA](/compare/401k-vs-roth-ira/).",
      },
    ],
    sources: [
      { label: "IRS — Publication 590-A (Contributions to IRAs)", url: "https://www.irs.gov/publications/p590a" },
      { label: "IRS — Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras" },
      { label: "IRS — Notice 2010-84 (Backdoor Roth)", url: "https://www.irs.gov/irb/2010-51_IRB#NOT-2010-84" },
    ],
    toolHeading: "Project your Roth IRA balance",
    toolSubheading: "See how tax-free compounding builds wealth over decades.",
    preset: { currentBalance: 10000, monthlyContribution: 583, annualReturnPct: 7, years: 30 },
    relatedSlugs: ["compound-interest-calculator", "dividend-calculator", "savings-goal-calculator"],
  },

  {
    calculator: "investing",
    slug: "dividend-calculator",
    title: "Dividend Reinvestment Calculator (DRIP)",
    metaDescription:
      "Model DRIP compounding: see how reinvesting dividends accelerates portfolio growth versus taking cash. Project total return over time.",
    targetKeyword: "dividend reinvestment calculator",
    estimatedVolume: 27100,
    estimatedKD: 48,
    h1: "Dividend Reinvestment Calculator (DRIP)",
    intro:
      "Dividend reinvestment (DRIP) means using the dividends your investments pay to automatically buy more shares instead of taking the cash — and the compounding effect can meaningfully accelerate long-term portfolio growth. Use the calculator above to project a portfolio's total return by entering a starting balance, an assumed annual return that blends price appreciation and dividend yield, and a time horizon. The difference between a total-return projection (dividends reinvested) and a price-only projection is the heart of the DRIP story.",
    howItWorks:
      "Total return equals price appreciation plus dividends reinvested. When you reinvest dividends, you buy fractional shares that themselves pay future dividends — a compounding loop that amplifies growth over time. The S&P 500's nominal price-only return has averaged roughly 4% per year historically, while total return including reinvested dividends averages closer to 7% annually, a gap documented in Federal Reserve FRED data and Robert Shiller's long-run dataset.\n\nThe calculator above models total return as a single blended annual rate — the cleanest way to approximate DRIP growth without share-price simulation. Enter the total-return rate (typically 7–10% for a broad equity index) to capture both price and dividend compounding in one number. The non-obvious catch: in a taxable brokerage account, reinvested dividends are still taxable in the year they are received (as ordinary income or qualified dividends), even though you never see the cash. That annual tax drag reduces your effective compounding rate. Holding dividend-paying investments inside a Roth IRA or 401(k) eliminates that drag entirely and is the ideal DRIP wrapper. For a side-by-side comparison, see the [Roth IRA calculator](/investing/roth-ira-calculator/).",
    commonMistakes: [
      "Confusing dividend yield with total return. A 4% yield does not mean 4% total return — price appreciation (or depreciation) is the other component.",
      "Ignoring taxes on dividends in taxable accounts. Reinvested dividends are taxable in the year received, even if you never touch the cash, reducing real compounding.",
      "Chasing high-yield dividend stocks without checking payout sustainability. A 10% yield that gets cut leaves you with a lower stock price and lower future income.",
      "Forgetting that DRIP amplifies losses too. Reinvesting into a declining stock automatically buys more shares at falling prices — that can be a feature (dollar cost averaging) or a risk if the company is deteriorating.",
      "Not accounting for dividend withholding taxes on international holdings. Foreign dividends are often subject to withholding, lowering the effective yield.",
    ],
    workedExample:
      "Suppose you invest $50,000 in a diversified index fund with no additional contributions and assume a 7% total annual return (blending roughly 3% dividend yield reinvested plus ~4% price appreciation). After 20 years, the calculator projects a balance of approximately $193,500 — nearly four times your initial investment. If instead you had taken dividends as cash (modeling the ~4% price-only return), the same $50,000 would grow to only about $109,600. The difference — roughly $83,900 — is the compounding value of DRIP over two decades.",
    faqs: [
      {
        question: "What is a dividend reinvestment plan (DRIP)?",
        answer:
          "A DRIP automatically uses dividend payments to purchase additional shares of the same stock or fund rather than distributing cash. Most brokerages and many companies offer DRIPs. Over time, the reinvested shares generate their own dividends, creating a compounding loop that accelerates growth.",
      },
      {
        question: "Are reinvested dividends taxable?",
        answer:
          "Yes. In a taxable brokerage account, dividends are taxable in the year you receive them — even if they are immediately reinvested. Qualified dividends are taxed at the lower capital gains rate (0%, 15%, or 20% depending on income); ordinary dividends are taxed as income. This annual tax drag is why tax-advantaged accounts like Roth IRAs are the ideal DRIP wrapper.",
      },
      {
        question: "How much does reinvesting dividends add to long-term returns?",
        answer:
          "Historically, the difference is substantial. Federal Reserve FRED data and Robert Shiller's S&P 500 dataset show that price-only returns have averaged roughly 4% per year while total return (dividends reinvested) averages closer to 7% — nearly doubling the compounding rate. Over 20–30 years, that gap produces dramatically different ending balances.",
      },
      {
        question: "Should I reinvest dividends or take the cash?",
        answer:
          "For long-term investors who do not need current income, reinvesting almost always builds more wealth, since compounding multiplies the effect over time. For retirees or income-focused investors who need cash flow, taking dividends as income makes sense. The right choice depends on your financial phase and tax situation.",
      },
      {
        question: "What return rate should I use for a DRIP calculation?",
        answer:
          "Use a total-return rate that blends price appreciation and dividend yield. For a broad U.S. equity index, a 7–10% historical total return is commonly cited. Using a price-only rate (around 4% for the S&P 500) would understate DRIP's impact. Check current data on Federal Reserve FRED for up-to-date figures.",
      },
    ],
    sources: [
      { label: "SEC — Dividend Reinvestment Plans (DRIPs)", url: "https://www.sec.gov/answers/drip.htm" },
      { label: "Federal Reserve FRED — S&P 500 market data", url: "https://fred.stlouisfed.org/" },
    ],
    toolHeading: "Model your DRIP growth",
    toolSubheading: "See how reinvesting dividends compounds your portfolio over time.",
    preset: { currentBalance: 50000, monthlyContribution: 0, annualReturnPct: 7, years: 20 },
    relatedSlugs: ["compound-interest-calculator", "investment-growth-calculator", "roth-ira-calculator"],
  },

  {
    calculator: "investing",
    slug: "dollar-cost-averaging-calculator",
    title: "Dollar Cost Averaging Calculator",
    metaDescription:
      "Model DCA strategy: invest a fixed amount at regular intervals to lower your average cost basis. Compare periodic investing vs. lump sum.",
    targetKeyword: "dollar cost averaging calculator",
    estimatedVolume: 18100,
    estimatedKD: 44,
    h1: "Dollar Cost Averaging Calculator",
    intro:
      "Dollar cost averaging (DCA) means investing a fixed dollar amount at regular intervals regardless of market conditions — automatically buying more shares when prices are low and fewer shares when prices are high. The calculator above projects the future value of a DCA strategy by entering a starting balance, a fixed monthly contribution, an assumed annual return, and a time horizon. Over long periods, the result demonstrates how consistent, disciplined investing can build significant wealth without trying to time the market.",
    howItWorks:
      "DCA works by decoupling the investment decision from the price decision. Because you invest the same dollar amount each period, a lower price automatically buys you more shares and a higher price buys fewer — your average cost per share ends up lower than the average price per share over the period. This mechanical effect slightly reduces risk versus investing everything at once when prices happen to be high.\n\nHere is the non-obvious nuance: FINRA's research and Vanguard's widely cited study 'Dollar-Cost Averaging Just Means Taking Risk Later' found that investing a lump sum immediately outperforms DCA roughly two-thirds of the time over a 12-month horizon — because markets tend to rise more often than they fall. DCA's most important benefit is behavioral, not mathematical: it removes the paralysis of waiting for 'the right moment' and gets investors into the market consistently. For investors who receive income periodically (e.g., a paycheck), DCA is also the natural structure. To model a one-time lump sum instead, try the [investment growth calculator](/investing/investment-growth-calculator/).",
    commonMistakes: [
      "Stopping contributions during market downturns. That is precisely when DCA buys the most shares at the lowest prices — pausing defeats the strategy.",
      "Choosing too short a time horizon. DCA's cost-averaging benefit is most visible over many years; short periods show little statistical difference from lump sum investing.",
      "Using DCA to delay a lump sum you already have. If you have a windfall sitting in cash, research shows investing it immediately outperforms spreading it over months in most historical scenarios.",
      "Ignoring transaction costs. If each periodic investment triggers a brokerage fee, frequent small trades erode returns — use a commission-free broker or a fund with automatic investment features.",
      "Mixing up DCA with market timing. DCA works on a strict schedule regardless of your market opinion; if you skip or delay contributions based on market news, you have abandoned the strategy.",
    ],
    workedExample:
      "Suppose you start with nothing and invest $500 every month for 20 years, assuming a 7% average annual return. The calculator projects a final balance of approximately $260,500. Your total contributions over 240 months are $120,000. The remaining $140,500 is compounded growth. This illustrates DCA's core proposition: a modest, consistent amount invested every month can produce a balance more than double your total contributions over a long horizon.",
    faqs: [
      {
        question: "What is dollar cost averaging?",
        answer:
          "Dollar cost averaging is an investment strategy where you invest a fixed dollar amount at regular intervals — weekly, monthly, or otherwise — regardless of market price. When prices are low, your fixed amount buys more shares; when prices are high, it buys fewer. Over time this can lower your average cost per share.",
      },
      {
        question: "Is dollar cost averaging better than lump sum investing?",
        answer:
          "Research, including Vanguard's analysis, shows lump sum investing outperforms DCA roughly two-thirds of the time over a 12-month horizon because markets trend upward more often than they trend down. DCA's primary value is behavioral: it removes the guesswork of timing, gets investors started, and keeps them investing through volatility.",
      },
      {
        question: "How does DCA lower my average cost per share?",
        answer:
          "Because you invest a fixed dollar amount each period, you buy more shares when prices are low and fewer when prices are high. Mathematically, the average cost per share (harmonic mean of prices weighted by shares bought) is always lower than or equal to the average price per share over the same period — the effect is most pronounced in volatile markets.",
      },
      {
        question: "What is a good monthly amount to invest with DCA?",
        answer:
          "There is no universal answer — the right amount is whatever you can invest consistently without disrupting your budget or emergency fund. Even $50–$100 per month compounds meaningfully over 20–30 years. The key is consistency. Use the calculator above to find a monthly number that matches your goal.",
      },
      {
        question: "Can I use DCA in a Roth IRA or 401(k)?",
        answer:
          "Yes, and those are ideal DCA vehicles. Contributing to a 401(k) every paycheck is already dollar cost averaging by design. A Roth IRA lets you spread contributions across the year up to the annual limit ($7,000 in 2026). Both accounts shelter your DCA gains from annual taxes, unlike a taxable brokerage account.",
      },
    ],
    sources: [
      { label: "FINRA — Dollar Cost Averaging", url: "https://www.finra.org/investors/investing/investing-basics/dollar-cost-averaging" },
      { label: "SEC Investor.gov — Invest Wisely: An Introduction to Mutual Funds", url: "https://www.investor.gov/introduction-investing/getting-started/invest-wisely" },
    ],
    toolHeading: "Model your DCA investment plan",
    toolSubheading: "See how a fixed monthly contribution builds wealth over time.",
    preset: { currentBalance: 0, monthlyContribution: 500, annualReturnPct: 7, years: 20 },
    relatedSlugs: ["compound-interest-calculator", "investment-growth-calculator", "savings-goal-calculator"],
  },

  {
    calculator: "investing",
    slug: "sp500-calculator",
    title: "S&P 500 Calculator: Project Index Fund Returns",
    metaDescription:
      "Project S&P 500 investment growth at the historical ~10.5% average annual return. Model monthly contributions and lump sums in our free calculator.",
    targetKeyword: "S&P 500 calculator",
    estimatedVolume: 14800,
    estimatedKD: 42,
    h1: "S&P 500 Investment Calculator",
    intro:
      "The S&P 500 has delivered approximately 10–11% in average annual nominal returns since 1926, with dividends reinvested, according to S&P Dow Jones Indices SPIVA data and Federal Reserve historical records. Use the calculator above to project what a lump sum and regular monthly contributions would grow to at that historical rate over your chosen time horizon. The 10.5% preset is a long-run average — any given decade can look dramatically different, including negative stretches lasting several years.",
    howItWorks:
      "The calculator above applies compound growth monthly at the annual return rate you enter. For the S&P 500, the widely cited long-run nominal figure is roughly 10–11% per year with dividends reinvested (SPIVA S&P Dow Jones Indices, 2023 Scorecard). Adjusting for approximately 3% average inflation produces a real return of roughly 7–8%. The preset uses 10.5% nominal to reflect historical long-run performance, but you can adjust it downward to model a more conservative scenario or to approximate real (inflation-adjusted) returns.\n\nThe most important non-obvious insight about S&P 500 investing: the long-run average hides extreme year-to-year volatility. The index fell 37% in 2008 and rose 33% in 2013. A 30-year investor who stayed fully invested through every crash historically earned close to the full 10%+ average; an investor who panic-sold in early 2009 locked in deep losses and missed one of the strongest recoveries in history. Time in the market, not timing the market, is the primary driver of index-fund wealth. For a tax-advantaged wrapper, see the [Roth IRA calculator](/investing/roth-ira-calculator/).",
    commonMistakes: [
      "Assuming 10% every year. The S&P 500's annual return varies wildly — some years are -30%, others are +30%. The 10% figure is only an average over many decades.",
      "Confusing nominal and real returns. The 10–11% nominal figure is not adjusted for inflation. In real spending-power terms, the long-run return is closer to 7–8%.",
      "Extrapolating short-term performance. A strong recent 5-year return does not predict the next 5 years; reversion to the mean is a documented tendency in equity markets.",
      "Panic-selling in downturns. Missing just the 10 best trading days in a decade can cut long-term returns by more than half — a pattern documented in multiple J.P. Morgan and DALBAR studies.",
      "Ignoring expense ratios. Even a small annual fee (0.5% vs. 0.03%) compounds into a meaningful drag on a 30-year portfolio. Favor low-cost index funds.",
    ],
    workedExample:
      "Suppose you invest $10,000 today and add $500 per month for 30 years, assuming the historical 10.5% average annual S&P 500 return. The calculator projects a balance of approximately $1,290,000. Your total out-of-pocket contributions are $190,000 ($10,000 upfront plus $500 × 360 months). The remaining $1,100,000 is compounded market return — nearly six times your contributions. This illustrates why low-cost, long-horizon index investing has been described by Warren Buffett and others as one of the most reliable wealth-building strategies available to ordinary investors.",
    faqs: [
      {
        question: "What is the average S&P 500 annual return?",
        answer:
          "The S&P 500 has returned approximately 10–11% per year in nominal terms with dividends reinvested since 1926, according to S&P Dow Jones Indices SPIVA data. Adjusted for roughly 3% average inflation, the real return is closer to 7–8% per year. Past performance does not guarantee future results.",
      },
      {
        question: "Should I use 10% or 7% in an S&P 500 calculator?",
        answer:
          "Use 10–10.5% if you want a nominal (before inflation) projection that matches historical averages. Use 7% if you want a real (inflation-adjusted) projection showing future purchasing power. Both are defensible — just label which one you are using so you interpret the result correctly.",
      },
      {
        question: "Is the S&P 500 a good long-term investment?",
        answer:
          "Historically, yes. SPIVA data consistently shows that the majority of actively managed funds underperform the S&P 500 index over 10- and 15-year periods. A low-cost S&P 500 index fund (ETF or mutual fund) gives broad diversification across 500 large U.S. companies and has outperformed most active strategies over long horizons.",
      },
      {
        question: "How do I invest in the S&P 500?",
        answer:
          "You cannot buy the index directly, but you can buy a fund that tracks it. Popular options include ETFs like SPY, IVV, and VOO, or mutual funds like Fidelity's FXAIX. You can hold these in a taxable brokerage account, a Roth IRA, a 401(k), or other account. Expense ratios on leading S&P 500 index funds are typically under 0.05%.",
      },
      {
        question: "What if I need the money during a market downturn?",
        answer:
          "This is sequence-of-returns risk — being forced to sell during a downturn crystallizes losses and can permanently impair your portfolio. The standard guidance is to hold only money you can leave invested for at least 5–10 years in equities, and to keep shorter-term needs in stable accounts like a high-yield savings account. See the [high yield savings calculator](/investing/high-yield-savings-calculator/) for that side of the equation.",
      },
    ],
    sources: [
      { label: "S&P Dow Jones Indices — SPIVA U.S. Scorecard", url: "https://www.spglobal.com/spdji/en/research-insights/spiva/" },
      { label: "Federal Reserve FRED — Market and economic data", url: "https://fred.stlouisfed.org/" },
    ],
    toolHeading: "Project your S&P 500 investment",
    toolSubheading: "See what a monthly contribution grows to at the historical average return.",
    preset: { currentBalance: 10000, monthlyContribution: 500, annualReturnPct: 10.5, years: 30 },
    relatedSlugs: ["compound-interest-calculator", "investment-growth-calculator", "dollar-cost-averaging-calculator"],
  },

  {
    calculator: "investing",
    slug: "withdrawal-calculator",
    title: "Investment Withdrawal Calculator: How Long It Lasts",
    metaDescription:
      "See how long your portfolio lasts at a given monthly withdrawal rate. Understand the 4% rule and sustainable withdrawal rates for retirement.",
    targetKeyword: "investment withdrawal calculator",
    estimatedVolume: 12100,
    estimatedKD: 41,
    h1: "Investment Withdrawal Calculator",
    intro:
      "An investment withdrawal calculator shows how many years your portfolio will last when you stop adding money and start taking it out. Enter your current balance, your monthly withdrawal amount, and an assumed annual return on the remaining invested balance. The calculator above projects your balance year by year so you can see when — and whether — your portfolio runs out. This is an essential planning tool for retirement income and for stress-testing whether your savings can support your planned lifestyle.",
    howItWorks:
      "The calculator applies your expected annual return to the portfolio balance each month, then subtracts your monthly withdrawal. If the return outpaces withdrawals, the portfolio grows. If withdrawals outpace growth, the balance declines toward zero. The key variable is the gap between your withdrawal rate and your portfolio's return rate.\n\nThe 4% rule is the most widely cited guideline for sustainable withdrawals. Financial planner William Bengen introduced it in a 1994 Journal of Financial Planning paper: withdrawing 4% of your initial portfolio value in year one — then adjusting that dollar amount for inflation each year — has historically sustained a 30-year retirement across most historical market scenarios when invested in a balanced stock-bond portfolio. The non-obvious limitation: the 4% rule was calibrated for a 30-year retirement and a roughly 50/50 stock-bond mix. For a 40-year retirement (retiring at 55 with a 95-year life expectancy) or a heavily equity-weighted portfolio, some researchers — including Wade Pfau at the American College of Financial Services — argue a 3.3% rate is safer. Conversely, flexible spending (reducing withdrawals in bad market years) can make a higher rate viable. The [savings goal calculator](/investing/savings-goal-calculator/) can help you determine how much you need to accumulate before retirement.",
    commonMistakes: [
      "Assuming a fixed return each year in retirement. Real portfolios fluctuate, and sequence-of-returns risk means a market crash in your first few retirement years is far more damaging than the same crash later — even if the average return ends up identical.",
      "Ignoring inflation adjustments. A fixed $4,000 monthly withdrawal buys less purchasing power each year. The 4% rule adjusts the dollar amount upward for inflation annually; a flat-nominal withdrawal is more conservative in real terms over time.",
      "Using the 4% rule for a 40+ year retirement. It was designed for 30 years. A 55-year-old retiree with a 40-year horizon should model a lower rate (3–3.5%) or plan for more flexible spending.",
      "Forgetting taxes on withdrawals. Traditional IRA and 401(k) withdrawals are taxed as ordinary income. Factor your tax bracket into how much to actually withdraw each month.",
      "Not modeling Social Security or other income. A partial income stream (Social Security, pension, annuity) can dramatically extend portfolio longevity by reducing how much you need to withdraw from investments.",
    ],
    workedExample:
      "Suppose you retire with $1,000,000 invested at an average 6% annual return and withdraw $5,000 per month ($60,000 per year, a 6% initial withdrawal rate). The 4% rule would suggest $40,000 per year is the sustainable baseline on a $1M portfolio. At $5,000 per month your withdrawal exceeds the 4% guideline, so the calculator shows the portfolio depleting in roughly 24 years — potentially short for a 30+ year retirement. Reducing withdrawals to $3,500 per month ($42,000 per year, just over 4%) extends the portfolio well beyond 30 years under the same return assumption.",
    faqs: [
      {
        question: "What is the 4% rule for retirement withdrawals?",
        answer:
          "The 4% rule states that withdrawing 4% of your initial portfolio value in year one — then increasing that dollar amount by inflation annually — has historically sustained a 30-year retirement in most market scenarios. It was introduced by financial planner William Bengen in 1994 using U.S. historical return data going back to 1926.",
      },
      {
        question: "How long will $1 million last in retirement?",
        answer:
          "It depends on your withdrawal rate and portfolio return. At a 4% withdrawal rate ($40,000 per year, or about $3,333 per month) with a 6% average return, a $1 million portfolio can last 30+ years. At a 6% withdrawal rate ($60,000 per year), the same portfolio may deplete in roughly 24 years. Use the calculator above to model your specific numbers.",
      },
      {
        question: "Is the 4% rule still valid?",
        answer:
          "It remains a useful starting point, but many researchers suggest adjusting it based on your circumstances. For a 30-year retirement with a balanced portfolio, 4% has held up historically. For a 40-year retirement or a period of low expected returns, 3–3.5% is more conservative. Flexible spending — reducing withdrawals in bad market years — can make a higher rate viable.",
      },
      {
        question: "What withdrawal rate is safe for early retirement?",
        answer:
          "For a 40-year retirement horizon (retiring in your 50s), researchers such as Wade Pfau suggest a safe withdrawal rate closer to 3.3–3.5%. A 30-year horizon supports the traditional 4%. The longer the horizon, the more compound inflation and sequence-of-returns risk matter, both of which push the safe rate down.",
      },
      {
        question: "Does Social Security affect how much I can withdraw from my portfolio?",
        answer:
          "Yes, significantly. Social Security income reduces how much you need to draw from your portfolio each month, which extends its longevity. For example, $2,000 per month in Social Security means you need $2,000 less per month from your investments — the equivalent of having an additional $600,000 in a portfolio earning 4%. Always model Social Security separately when planning retirement withdrawals.",
      },
    ],
    sources: [
      { label: "DOL — Retirement savings and withdrawal guidance", url: "https://www.dol.gov/general/topic/retirement/retirementsavings" },
      { label: "SEC Investor.gov — Planning for retirement", url: "https://www.investor.gov/additional-resources/retirement-toolkit" },
    ],
    toolHeading: "How long will your portfolio last?",
    toolSubheading: "Enter your balance and monthly withdrawal to see when the money runs out.",
    preset: { goalMode: false, currentBalance: 1000000, monthlyContribution: 0, annualReturnPct: 6, years: 30 },
    relatedSlugs: ["compound-interest-calculator", "savings-goal-calculator", "high-yield-savings-calculator"],
  },
];
