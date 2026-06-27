import type { SpokeEntry } from "./types";

// PortfolioIQ (portfolio) spokes. Powered by src/lib/portfolio.ts (weighted expected return,
// volatility via a correlation matrix, Sharpe ratio, growth projection). CONTENT: keyword-gap
// system — guided research+write (SEC/FINRA primary sources, engine ground-truth figures) +
// adversarial audit per page. Asset-class return/volatility figures are documented MODEL ASSUMPTIONS
// (long-run historical estimates) and the content says so. See CONTENT.md.

export const PORTFOLIO_SPOKES: SpokeEntry[] = [
  {
    calculator: "portfolio",
    slug: "asset-allocation-calculator",
    title: "Asset Allocation Calculator: Stocks, Bonds & Cash",
    metaDescription:
      "Use this asset allocation calculator to split your portfolio across stocks, bonds, real estate, and cash. See expected return, risk, and 25-year growth.",
    targetKeyword: "asset allocation calculator",
    estimatedVolume: 8100,
    estimatedKD: 48,
    h1: "Asset Allocation Calculator",
    intro:
      "The asset allocation calculator above shows how to split your money across stocks, bonds, real estate, and cash. Enter your balances and time horizon to see your portfolio's expected return, volatility, and long-run growth. Your mix of asset classes drives most of your return swings over time, often more than which individual stocks you pick. This tool helps you find a blend that fits your goals and your tolerance for risk.",
    howItWorks:
      "The asset allocation calculator weighs each asset class by the dollars you assign to it. Each class carries a long-run return and volatility estimate: stocks 10% return at 16% volatility, bonds 4% at 5%, real estate 8% at 15%, and cash 2.5% at 1%. These are model assumptions, not guarantees, and real results will vary year to year.\n\nThe tool then combines those weights into one expected return and one portfolio volatility. Because assets that do not move together offset each other, your blended risk lands below the simple average of the parts. The calculator also reports a Sharpe ratio, which measures return earned per unit of risk above a 2.5% risk-free rate. To compare risk-adjusted mixes, see the [portfolio risk calculator](/portfolio/portfolio-risk-calculator/).",
    commonMistakes: [
      "Treating the model returns as guarantees. The 10% stock and 4% bond figures are long-run estimates, and any single year can look very different.",
      "Holding too much cash for a long horizon. Cash earns about 2.5% in the model, so it can lag inflation over decades.",
      "Chasing individual stock picks instead of setting the asset mix first. Allocation drives most of your return variability.",
      "Never rebalancing. When stocks surge, your mix drifts toward more risk than you chose, so periodic rebalancing matters.",
      "Ignoring your time horizon and risk tolerance, the two factors the SEC says should shape your allocation.",
    ],
    workedExample:
      "Imagine a $100,000 portfolio split as $50,000 stocks, $20,000 bonds, $20,000 real estate, and $10,000 cash. That is a 50% / 20% / 20% / 10% mix. Under the model, it carries a 7.65% expected return and 10.28% volatility, for a Sharpe ratio of 0.50. Adding $500 every month for 25 years, the calculator projects the portfolio growing to about $1,048,304.",
    faqs: [
      { question: "What is an asset allocation calculator?", answer: "An asset allocation calculator shows how to divide your portfolio across stocks, bonds, real estate, and cash. It estimates your blended expected return, your overall risk, and how the portfolio could grow over time. You enter your balances and contributions, and the tool does the math." },
      { question: "How should I split stocks, bonds, real estate, and cash?", answer: "Base your split on your time horizon and your tolerance for risk, the two factors the SEC highlights. Longer horizons can support more stocks; shorter horizons lean toward bonds and cash. The calculator above lets you test different mixes and compare the results." },
      { question: "What is the \"110 minus your age\" rule?", answer: "A common rule of thumb is to hold roughly 110 minus your age in stocks. A 40-year-old would target about 70% stocks. This is only a guideline, not a personalized plan, so adjust it for your own goals and comfort with risk." },
      { question: "Does diversification really lower risk?", answer: "Yes. Spreading money across assets that do not move together reduces overall volatility. In the worked example, a diversified mix shows 10.28% volatility, well below the 16% of stocks alone. Diversification cannot remove all risk, but it cushions losses in any single asset." },
      { question: "What is rebalancing and why does it matter?", answer: "Rebalancing means resetting your portfolio back to its target mix after market moves. When one asset class grows, it can crowd out the others and raise your risk. Rebalancing forces you to buy low and sell high, and the SEC suggests reviewing your mix periodically." },
    ],
    sources: [
      { label: "SEC Investor.gov — Beginners' Guide to Asset Allocation, Diversification, and Rebalancing", url: "https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset" },
      { label: "FINRA — Asset Allocation and Diversification", url: "https://www.finra.org/investors/investing/investing-basics/asset-allocation-diversification" },
    ],
    toolHeading: "Build and test your asset allocation",
    toolSubheading: "Split your money across stocks, bonds, real estate, and cash to see return and risk.",
    preset: { stocks: 50000, bonds: 20000, realEstate: 20000, cash: 10000, monthlyContribution: 500, years: 25 },
    relatedSlugs: ["60-40-portfolio-calculator", "expected-return-calculator", "portfolio-risk-calculator"],
  },

  {
    calculator: "portfolio",
    slug: "60-40-portfolio-calculator",
    title: "60/40 Portfolio Calculator: Return, Risk & Growth",
    metaDescription:
      "Use this 60/40 portfolio calculator to see the expected return, risk, and long-run growth of the classic 60% stock, 40% bond mix.",
    targetKeyword: "60/40 portfolio calculator",
    estimatedVolume: 2900,
    estimatedKD: 36,
    h1: "60/40 Portfolio Calculator",
    intro:
      "The 60/40 portfolio holds 60% stocks and 40% bonds, a classic balanced mix. The calculator above shows its expected return, its risk, and how it might grow over time. Enter your stock and bond amounts to see the numbers for your own money. These figures are long-run model estimates, not guarantees.",
    howItWorks:
      "A 60/40 portfolio blends the growth of stocks with the steadier nature of bonds. The calculator above weights each asset by its share of your money. Stocks are modeled at a 10% return with 16% volatility. Bonds are modeled at a 4% return with 5% volatility.\n\nThe tool then combines these to find your portfolio's expected return, its volatility, and its Sharpe ratio. The Sharpe ratio measures return earned above a 2.5% risk-free rate per unit of risk. Higher is better. The growth projection compounds your expected return over the years you choose. To try other splits, use the [asset allocation calculator](/portfolio/asset-allocation-calculator/).",
    commonMistakes: [
      "Treating the 10% stock and 4% bond figures as guaranteed. They are long-run model assumptions, and real returns vary widely year to year.",
      "Assuming stocks and bonds always move in opposite directions. In some years, such as 2022, both fell together and challenged the 60/40 mix.",
      "Forgetting to rebalance. Without it, a rising stock market slowly pushes your mix past 60%, raising your risk.",
      "Ignoring your time horizon. A 60/40 split may be too cautious for a young saver or too risky near a short-term goal.",
      "Confusing lower volatility with no risk. The 60/40 still loses money in bad years, just less than an all-stock portfolio.",
    ],
    workedExample:
      "Say you invest $60,000 in stocks and $40,000 in bonds, for $100,000 total. That is a 60% stock, 40% bond split. The calculator shows an expected return of 7.60% and volatility of 10.00%, giving a Sharpe ratio of 0.51. Held for 30 years with no extra contributions, that $100,000 grows to about $900,260 in the model. The lower volatility is the trade-off: you give up some return versus all stocks for a much smoother ride.",
    faqs: [
      { question: "What is a 60/40 portfolio?", answer: "A 60/40 portfolio holds 60% in stocks and 40% in bonds. It is a classic balanced mix. The stocks drive growth, and the bonds add stability and income. It has long been a default starting point for everyday investors." },
      { question: "What return does the 60/40 portfolio calculator assume?", answer: "The calculator models stocks at a 10% return with 16% volatility and bonds at a 4% return with 5% volatility. For a 60/40 mix, that gives an expected return of 7.60% and volatility of 10.00%. These are long-run estimates, not promises." },
      { question: "Is the 60/40 portfolio still a good strategy?", answer: "The 60/40 portfolio remains a widely used balanced benchmark. It gives up some return versus all stocks in exchange for much lower risk. In 2022, stocks and bonds fell together, which tested the mix. It still suits many investors seeking balance." },
      { question: "How much can a 60/40 portfolio grow over 30 years?", answer: "In the model, $100,000 split 60/40 with no added contributions grows to about $900,260 over 30 years. This uses a 7.60% expected return. Actual results will differ because real markets rise and fall." },
      { question: "Why hold bonds instead of all stocks?", answer: "Bonds are generally less volatile than stocks but offer more modest returns, per SEC guidance. Adding 40% bonds lowers the 60/40 portfolio's volatility to 10.00%, well below an all-stock mix. That trade buys you a smoother path for less return." },
    ],
    sources: [
      { label: "SEC Investor.gov — Asset Allocation", url: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation" },
      { label: "SEC Investor.gov — Beginners' Guide to Asset Allocation, Diversification, and Rebalancing", url: "https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset" },
      { label: "FINRA — Asset Allocation and Diversification", url: "https://www.finra.org/investors/investing/investing-basics/asset-allocation-diversification" },
    ],
    toolHeading: "Analyze the classic 60/40 portfolio",
    toolSubheading: "See the expected return, risk, and growth of a 60% stock, 40% bond mix.",
    preset: { stocks: 60000, bonds: 40000, realEstate: 0, cash: 0, monthlyContribution: 0, years: 30 },
    relatedSlugs: ["asset-allocation-calculator", "expected-return-calculator", "portfolio-risk-calculator"],
  },

  {
    calculator: "portfolio",
    slug: "expected-return-calculator",
    title: "Expected Return Calculator: Portfolio Weighted Average",
    metaDescription:
      "Use this expected return calculator to find your portfolio's weighted average return across stocks, bonds, real estate, and cash in seconds.",
    targetKeyword: "expected return calculator",
    estimatedVolume: 2400,
    estimatedKD: 40,
    h1: "Expected Return Calculator",
    intro:
      "The expected return calculator above estimates your portfolio's long-run return by taking a weighted average of each holding's expected return. It weights every asset by its dollar amount, so your largest position drives the result. Enter how much you hold in stocks, bonds, real estate, and cash to see your blended figure. Remember: expected return is a long-run estimate, not a promise of what you will earn next year.",
    howItWorks:
      "Expected return is the weighted average of each holding's expected return. The calculator above multiplies each asset's portfolio weight by its assumed long-run return, then adds the pieces together. The formula is simple: (weight of asset A × return of A) + (weight of asset B × return of B), and so on.\n\nThese return figures are model assumptions, not guarantees. This tool uses long-run estimates of 10% for stocks, 4% for bonds, 8% for real estate, and 2.5% for cash. Because the math weights by dollars, your biggest holding has the most influence on the final number. To weigh that return against its risk, see the [portfolio risk calculator](/portfolio/portfolio-risk-calculator/).",
    commonMistakes: [
      "Treating the expected return as a forecast for one specific year. It is a long-run average, and actual yearly results swing well above and below it.",
      "Ignoring volatility. A higher expected return almost always comes with bigger price swings, so review the risk figure too.",
      "Weighting holdings equally instead of by dollar amount. Your largest position dominates the weighted average, not the number of holdings.",
      "Using outdated balances. Update your dollar amounts after big deposits, withdrawals, or market moves so the weights stay accurate.",
      "Confusing the model's assumed returns with guaranteed returns. These are estimates, and real assets can lose money in any given year.",
    ],
    workedExample:
      "Suppose you hold $70,000 in stocks, $20,000 in bonds, and $10,000 in cash, a $100,000 portfolio split 70% / 20% / 10%. The calculator weights each return: 70% × 10% gives 7%, 20% × 4% gives 0.8%, and 10% × 2.5% gives 0.25%. Add them up: 7% + 0.8% + 0.25% = 8.05%. That 8.05% is your portfolio's expected return. The portfolio carries 11.35% volatility and a Sharpe ratio of 0.49. In one year, $100,000 at an 8.05% expected return grows to about $108,050, though any single year may land much higher or lower.",
    faqs: [
      { question: "What is an expected return calculator?", answer: "An expected return calculator finds your portfolio's weighted average return. It multiplies each holding's dollar weight by its assumed long-run return, then sums the results. The calculator above does this instantly across stocks, bonds, real estate, and cash." },
      { question: "How is portfolio expected return calculated?", answer: "Portfolio expected return is the weighted average of each holding's expected return. You multiply each asset's share of the portfolio by its expected return, then add the parts. For example, 70% × 10% + 20% × 4% + 10% × 2.5% = 8.05%." },
      { question: "Is expected return what I will actually earn?", answer: "No. Expected return is a long-run average, not what you will earn in any given year. Real results swing above and below it. The return figures here are model assumptions, not guarantees, and investments can lose money." },
      { question: "Why does my biggest holding affect the result the most?", answer: "Because the calculation weights each asset by its dollar amount. A holding that makes up 70% of your portfolio influences the average far more than one at 10%. Your largest position dominates the final expected return." },
      { question: "Does a higher expected return mean more risk?", answer: "Usually, yes. FINRA notes that the higher the expected return, the greater the risk of loss. Stocks carry a higher expected return than bonds or cash, but also larger price swings, so check the volatility figure too." },
    ],
    sources: [
      { label: "FINRA — Know Your Risk Tolerance", url: "https://www.finra.org/investors/insights/know-your-risk-tolerance" },
      { label: "SEC Investor.gov — Asset Allocation", url: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation" },
    ],
    toolHeading: "Calculate your portfolio's expected return",
    toolSubheading: "Enter your holdings to see the weighted-average return across asset classes.",
    preset: { stocks: 70000, bonds: 20000, realEstate: 0, cash: 10000, monthlyContribution: 0, years: 1 },
    relatedSlugs: ["asset-allocation-calculator", "60-40-portfolio-calculator", "portfolio-risk-calculator"],
  },

  {
    calculator: "portfolio",
    slug: "portfolio-risk-calculator",
    title: "Portfolio Risk Calculator: Volatility & Sharpe Ratio",
    metaDescription:
      "Use this portfolio risk calculator to measure volatility and the Sharpe ratio, then compare risk-adjusted returns across two sample portfolios.",
    targetKeyword: "portfolio risk calculator",
    estimatedVolume: 1300,
    estimatedKD: 38,
    h1: "Portfolio Risk Calculator",
    intro:
      "This portfolio risk calculator measures how much your mix could swing and how much return you earn for that risk. Enter your stock, bond, and cash amounts in the calculator above. It reports expected return, volatility, and the Sharpe ratio in seconds. Higher return does not always mean a better deal, and this page shows why. To plan the mix itself, try the [asset allocation calculator](/portfolio/asset-allocation-calculator/).",
    howItWorks:
      "Volatility is the standard deviation of returns. It measures how far results tend to swing above and below the average. A higher number means a bumpier ride. The portfolio risk calculator blends the volatility of each holding to estimate your portfolio's overall swing.\n\nThe Sharpe ratio measures return per unit of risk. The formula is (expected return − risk-free rate) ÷ volatility. We use a 2.5% risk-free rate. A higher Sharpe ratio means you are paid more for each unit of risk you take. The figures here are long-run model assumptions: stocks 10% return and 16% volatility, bonds 4% and 5%, cash 2.5% and 1%. They are estimates, not guarantees. To go deeper, see the [expected return calculator](/portfolio/expected-return-calculator/) or test the [60/40 portfolio calculator](/portfolio/60-40-portfolio-calculator/).",
    commonMistakes: [
      "Chasing the highest expected return while ignoring volatility. A bigger number can hide a much rougher ride.",
      "Treating volatility as the only measure. The Sharpe ratio shows whether that risk actually pays off.",
      "Assuming the model figures are guaranteed. They are long-run assumptions, and real returns vary year to year.",
      "Forgetting that adding bonds and cash can raise your Sharpe ratio even as it lowers expected return.",
      "Ignoring your time horizon. A wide one-year range matters more if you need the money soon.",
    ],
    workedExample:
      "Compare two $100,000 portfolios over 20 years. The aggressive mix holds $90,000 in stocks and $10,000 in cash (90% / 10%). It has a 9.25% expected return, 14.40% volatility, and a 0.47 Sharpe ratio. Its 20-year projection is about $586,717, but a typical year ranges from roughly $94,850 to $123,650. The conservative mix holds $20,000 in stocks, $50,000 in bonds, and $30,000 in cash (20% / 50% / 30%). It has a 4.75% expected return, 4.30% volatility, and a 0.52 Sharpe ratio. The aggressive mix earns more, yet the conservative mix has the higher Sharpe ratio. It earns more return for each unit of risk.",
    faqs: [
      { question: "What does a portfolio risk calculator measure?", answer: "A portfolio risk calculator measures volatility and risk-adjusted return. Volatility shows how much your mix could swing. The Sharpe ratio shows how much return you earn for that risk. The calculator above reports both, plus your expected return." },
      { question: "What is a good Sharpe ratio?", answer: "A higher Sharpe ratio is better because it means more return per unit of risk. In our example, the conservative mix scores 0.52 and the aggressive mix scores 0.47. So the conservative, diversified mix is more efficient even though it earns less." },
      { question: "Does a higher expected return mean a better portfolio?", answer: "Not always. The aggressive mix has a 9.25% expected return versus 4.75% for the conservative mix. But the conservative mix has the higher Sharpe ratio, 0.52 versus 0.47. It earns more return for each unit of risk taken." },
      { question: "What is volatility in investing?", answer: "Volatility is the standard deviation of returns. It measures how far results swing above and below the average. Higher volatility means bigger swings and more risk. Stocks in our model carry 16% volatility, while cash carries just 1%." },
    ],
    sources: [
      { label: "FINRA — Volatility", url: "https://www.finra.org/investors/investing/investing-basics/volatility" },
      { label: "FINRA — Risk", url: "https://www.finra.org/investors/investing/investing-basics/risk" },
      { label: "SEC Investor.gov — Beginners' Guide to Asset Allocation, Diversification, and Rebalancing", url: "https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset" },
    ],
    toolHeading: "Measure your portfolio's risk",
    toolSubheading: "See volatility and the Sharpe ratio — return earned per unit of risk.",
    preset: { stocks: 90000, bonds: 0, realEstate: 0, cash: 10000, monthlyContribution: 0, years: 20 },
    relatedSlugs: ["asset-allocation-calculator", "60-40-portfolio-calculator", "expected-return-calculator"],
  },
];
