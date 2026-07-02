// Comparison page data — head-to-head X vs Y articles.
// Route: /compare/<slug>/   (src/pages/compare/[slug].astro)
import type { FAQ, Source } from "./types";

export interface ComparisonEntry {
  slug: string;
  title: string;            // ≤60 chars — both entities named
  metaDescription: string;  // ≤160 chars
  targetKeyword: string;
  optionA: string;          // display name entity A
  optionB: string;          // display name entity B
  segment?: string;
  h1: string;
  intro: string;            // AEO: self-contained opening sentence
  comparisonTable: {
    rows: Array<{ dimension: string; a: string; b: string }>;
  };
  verdict: string;
  sections: Array<{ heading: string; content: string }>;
  faqs: FAQ[];
  sources?: Source[];
  relatedComparisons?: string[];
  calculatorLinks?: Array<{ label: string; href: string }>;
  draft?: boolean;
}

export const COMPARISONS: ComparisonEntry[] = [
  // ─── 1. 401(k) vs Roth IRA ───────────────────────────────────────────────
  {
    slug: "401k-vs-roth-ira",
    title: "401(k) vs Roth IRA: Which Retirement Account Wins?",
    metaDescription:
      "401(k) vs Roth IRA compared: contribution limits, tax rules, employer match, and which account saves you more in retirement.",
    targetKeyword: "401k vs roth ira",
    optionA: "401(k)",
    optionB: "Roth IRA",
    h1: "401(k) vs Roth IRA: Which Retirement Account Is Right for You?",
    intro:
      "A 401(k) lets you contribute up to $23,000 pre-tax in 2024 and often includes an employer match, while a Roth IRA allows $7,000 in after-tax dollars with tax-free withdrawals in retirement — and the right choice depends mostly on your current tax rate versus your expected rate in retirement.",
    comparisonTable: {
      rows: [
        { dimension: "2024 contribution limit", a: "$23,000 ($30,500 if 50+)", b: "$7,000 ($8,000 if 50+)" },
        { dimension: "Tax treatment", a: "Pre-tax; taxed on withdrawal", b: "After-tax; withdrawals tax-free" },
        { dimension: "Employer match", a: "Yes — free money from employer", b: "No employer match" },
        { dimension: "Income limits to contribute", a: "None (employer plan)", b: "$161,000 single / $240,000 married (2024)" },
        { dimension: "Required minimum distributions", a: "Yes, starting at age 73", b: "None during owner's lifetime" },
        { dimension: "Investment options", a: "Limited to plan's fund menu", b: "Unlimited (stocks, ETFs, bonds)" },
        { dimension: "Early withdrawal penalty", a: "10% on earnings before 59½", b: "Contributions anytime; earnings penalized" },
      ],
    },
    verdict:
      "Pick the 401(k) first when your employer offers a match — capturing that free money beats any other return. Pick the Roth IRA when you're under the income limits and expect to pay higher taxes in retirement than you do today. Many financial planners recommend doing both: max the 401(k) match, then fully fund a Roth IRA, then return to the 401(k) if money remains.",
    sections: [
      {
        heading: "How a 401(k) works",
        content:
          "A 401(k) is an employer-sponsored retirement plan that lets you defer part of your paycheck before taxes are taken out. In 2024 the IRS lets you contribute up to $23,000 — or $30,500 if you're 50 or older.\n\nYour contribution reduces your taxable income today. A $5,000 contribution cuts your taxable income by $5,000, which saves roughly $1,100 if you're in the 22% bracket. You'll owe income tax on withdrawals in retirement.\n\nThe real power of a 401(k) is the employer match. Many employers match 50–100% of your contribution up to a percentage of your salary. That match is an instant 50–100% return — no investment can reliably beat it. Use the [retirement calculator](/retirement/) to see how match dollars compound over time.",
      },
      {
        heading: "How a Roth IRA works",
        content:
          "A Roth IRA is an individual account you open directly with a brokerage — your employer is not involved. You contribute after-tax dollars, so there's no upfront tax break.\n\nThe payoff comes later: every qualified withdrawal in retirement is completely tax-free, including decades of growth. A $7,000 contribution that grows to $70,000 over 30 years can be withdrawn without owing a single dollar in taxes.\n\nRoth IRAs have income limits. In 2024, single filers earning above $161,000 (or $240,000 married filing jointly) cannot contribute directly. High earners can use the backdoor Roth IRA strategy to get around this limit. Use the [investment calculator](/investing/) to model Roth growth projections.",
      },
      {
        heading: "Which account saves more in taxes?",
        content:
          "The answer depends on whether your tax rate is higher now or in retirement. Traditional 401(k) wins if you're in a high bracket today and expect a lower rate later. Roth IRA wins if you're in a lower bracket now and expect taxes to rise.\n\nFor a 30-year-old in the 22% bracket saving $7,000/year, choosing Roth IRA over Traditional 401(k) can save $200,000+ in lifetime taxes if retirement rates end up higher — but cost you $50,000+ if rates fall.\n\nWhen in doubt, diversify: hold some pre-tax money (401k/Traditional IRA) and some after-tax money (Roth IRA) so you can draw from whichever bucket is taxed more favorably each year.",
      },
      {
        heading: "401(k) vs Roth IRA: can you have both?",
        content:
          "Yes — and most financial planners recommend it. There's no rule against having a 401(k) and a Roth IRA at the same time. The two accounts have separate, independent contribution limits.\n\nThe optimal order is usually: contribute to the 401(k) up to the full employer match → max out the Roth IRA → go back and max the 401(k) with any remaining savings.\n\nIf you're self-employed, a SEP-IRA or Solo 401(k) can replace the employer plan with even higher limits. The [retirement calculator](/retirement/) lets you model multiple account scenarios side by side.",
      },
      {
        heading: "The break-even tax rate: exactly when Roth wins",
        content:
          "The Roth IRA beats the Traditional 401(k) at the exact tax-rate crossover point where your future withdrawal rate equals your current contribution rate — and understanding that crossover gives you a precise decision rule, not just a gut feeling.\n\nHere's the math. Suppose you're in the 22% bracket today and contribute $7,000 to a Roth IRA. That $7,000 grows to $56,000 over 30 years at 7% — and you owe $0 in taxes when you withdraw it. To match that outcome with a Traditional 401(k), you'd also contribute $7,000 (but it reduces your taxable income by $7,000 × 22% = $1,540 in upfront tax savings). If you invest that $1,540 tax savings separately, it grows to about $12,376 at the same rate. In retirement, the $56,000 Traditional 401(k) balance is taxed on withdrawal. At a 22% rate, you net $43,680 — plus the $12,376 side fund — total $56,056. At a 10% retirement rate, you net $50,400 + $12,376 = $62,776. At 32%, you net $38,080 + $12,376 = $50,456.\n\nThe break-even occurs when your current and future rates are equal — in that case both accounts leave the same after-tax dollars. The Roth wins whenever your future rate is higher than your current rate; the Traditional 401(k) wins when your current rate is higher than your future rate. The crossover is one number: your current marginal rate.\n\nA non-obvious implication: most 30-year-olds today face a future tax environment with more uncertainty than their parents did. Tax rates have nowhere to go but up given long-run federal deficit trends (CBO projects debt-to-GDP above 100% by the mid-2030s). Betting on lower retirement rates requires betting against that secular trend. Many planners now recommend Roth contributions for anyone in the 24% bracket or below, even if they expect to drop a bracket in retirement, precisely because of this directional uncertainty.\n\nOne more often-missed variable: Required Minimum Distributions (RMDs) can push your retirement tax rate above what your paycheck-based rate implied. At 73, you must withdraw from a Traditional 401(k) whether you need the money or not. Add Social Security income (up to 85% of which is taxable), pension income, and rental income — and many retirees find themselves in the 22–24% bracket even on what looks like a modest budget. A Roth IRA has no RMDs and therefore lets you control your taxable income in retirement. Use the [retirement calculator](/retirement/) to model how RMDs interact with your projected income.",
      },
    ],
    faqs: [
      {
        question: "Is a Roth IRA better than a 401(k)?",
        answer:
          "Neither is universally better. A 401(k) is usually the first priority because of the employer match and higher contribution limit. A Roth IRA is better for tax-free retirement income and flexible withdrawals. Most savers benefit from using both.",
      },
      {
        question: "What happens to my 401(k) if I change jobs?",
        answer:
          "You can roll it into your new employer's 401(k), roll it into an IRA, leave it with the old employer, or cash it out (which triggers taxes and a 10% penalty). Rolling it over is usually the best move to keep the money growing tax-deferred.",
      },
      {
        question: "Can I contribute to both a 401(k) and Roth IRA in the same year?",
        answer:
          "Yes. They have separate limits. In 2024 you can contribute $23,000 to a 401(k) and $7,000 to a Roth IRA in the same year, provided your Roth IRA contribution doesn't exceed the income limits.",
      },
      {
        question: "What is the 401(k) income limit for 2024?",
        answer:
          "There is no income limit to contribute to a 401(k). Unlike a Roth IRA, any employee covered by an employer plan can contribute regardless of how much they earn.",
      },
      {
        question: "When can I withdraw from a Roth IRA without penalty?",
        answer:
          "You can withdraw your Roth IRA contributions (not earnings) at any time without penalty. To withdraw earnings tax-free, the account must be at least 5 years old and you must be 59½ or older.",
      },
    ],
    sources: [
      { label: "IRS — 401(k) plan overview", url: "https://www.irs.gov/retirement-plans/401k-plans" },
      { label: "IRS — Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras" },
      { label: "IRS — Retirement topics: contribution limits", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-contributions" },
    ],
    relatedComparisons: ["roth-401k-vs-traditional-401k", "brokerage-vs-ira", "529-vs-roth-ira"],
    calculatorLinks: [
      { label: "Retirement calculator", href: "/retirement/" },
      { label: "Investment growth calculator", href: "/investing/" },
      { label: "Net worth calculator", href: "/net-worth/" },
    ],
  },

  // ─── 2. Stocks vs Bonds ──────────────────────────────────────────────────
  {
    slug: "stocks-vs-bonds",
    title: "Stocks vs Bonds: Which Investment Is Right for You?",
    metaDescription:
      "Stocks vs bonds compared: returns, risk, income, and how to mix them at every age. Find the right balance for your portfolio.",
    targetKeyword: "stocks vs bonds",
    optionA: "Stocks",
    optionB: "Bonds",
    h1: "Stocks vs Bonds: Returns, Risk, and the Right Balance for Your Portfolio",
    intro:
      "Stocks have historically returned about 10% per year and drive long-term growth, while bonds average 3–5% per year with much less volatility — and most investors benefit from holding both, adjusting the mix as they age.",
    comparisonTable: {
      rows: [
        { dimension: "Historical average annual return", a: "~10% (S&P 500 long-run)", b: "~3–5% (investment-grade)" },
        { dimension: "Risk level", a: "High — prices fluctuate widely", b: "Low to moderate" },
        { dimension: "Income type", a: "Dividends (variable)", b: "Fixed interest (coupon)" },
        { dimension: "Inflation protection", a: "Good — earnings grow with economy", b: "Poor — fixed payments lose real value" },
        { dimension: "Liquidity", a: "High — traded every second", b: "Moderate — may have wide bid-ask spreads" },
        { dimension: "Recommended time horizon", a: "5+ years", b: "1–10+ years (depends on bond duration)" },
        { dimension: "Role in a portfolio", a: "Growth engine", b: "Stability and income buffer" },
      ],
    },
    verdict:
      "Pick stocks when you have a long time horizon (5+ years) and can tolerate short-term drops. Pick bonds for predictable income, capital preservation, or to dampen portfolio swings near retirement. A classic starting point: subtract your age from 110 to get your stock percentage — the rest in bonds.",
    sections: [
      {
        heading: "How stocks generate returns",
        content:
          "Stocks represent ownership in a company. You profit in two ways: price appreciation (the stock rises in value) and dividends (the company pays you a share of its profits). Over the long run, stocks have delivered the highest real returns of any major asset class.\n\nThe S&P 500 has averaged about 10% per year since 1957 — but that average hides wild swings. In 2008, stocks fell 37%. In 2009 they rebounded 26%. This volatility is the price you pay for those higher long-term returns.\n\nDiversification reduces individual-company risk. Owning an index ETF that tracks 500 stocks means one company's failure barely dents your portfolio. Use the [investment calculator](/investing/) to model how stock returns compound over time.",
      },
      {
        heading: "How bonds generate returns",
        content:
          "A bond is a loan you make to a government or company. In return, you receive regular interest payments (the coupon) and your principal back when the bond matures. The U.S. Treasury's 10-year note is the global benchmark.\n\nBonds lose value when interest rates rise — a $1,000 bond paying 3% becomes less attractive when new bonds pay 5%, so its market price drops. Conversely, bonds gain value when rates fall. This is called interest-rate risk.\n\nCredit risk is the chance the borrower defaults. U.S. Treasury bonds carry virtually zero credit risk. Corporate bonds pay higher yields to compensate for higher default risk.",
      },
      {
        heading: "The stocks-to-bonds ratio at every age",
        content:
          "A rough guideline: hold 110 minus your age in stocks and the rest in bonds. At 30, that's 80% stocks / 20% bonds. At 60, that's 50/50. This auto-adjusts as you approach retirement when capital preservation matters more.\n\nThe 60/40 portfolio (60% stocks, 40% bonds) has been a popular balanced benchmark. In most 20-year periods it has delivered about 8–9% annual returns with significantly less volatility than an all-stock portfolio. The [portfolio calculator](/portfolio/) can model how different mixes would have performed historically.\n\nAggressive investors with 30+ year horizons sometimes hold 90–100% stocks. Conservative investors near retirement may prefer 40/60 or even 30/70 to protect spending power.",
      },
      {
        heading: "Stocks vs bonds in a rising-rate environment",
        content:
          "Rising interest rates hurt bond prices — but they're a double-edged sword. Existing bonds lose value when rates rise, because newer bonds offer higher yields. A 10-year Treasury bond can lose 7–8% in price for every 1% rate increase.\n\nStocks are also hurt by rising rates, but usually less and with more resilience. Higher rates raise borrowing costs for companies but also signal a growing economy, which supports corporate earnings.\n\nOne practical non-obvious implication: in a rising-rate environment, short-duration bonds (1–3 year maturities) suffer far less than long-duration bonds. Many investors mistakenly hold long-duration bond funds when rate risk is high — switching to short-duration or Treasury I-Bonds can protect principal while still earning income.",
      },
    ],
    faqs: [
      {
        question: "Are stocks safer than bonds?",
        answer:
          "No — stocks are riskier than investment-grade bonds. Stocks can lose 30–50% in a downturn. High-quality bonds (U.S. Treasuries, investment-grade corporates) rarely lose more than 5–10% in any single year, though they can in extreme rate environments.",
      },
      {
        question: "Can stocks and bonds both lose money at the same time?",
        answer:
          "Yes, and 2022 was a stark example. Both the S&P 500 (−18%) and the U.S. bond market (−13%) fell sharply as the Federal Reserve raised rates aggressively. This correlation had been rare historically but reminds investors that diversification across asset classes does not guarantee protection in all conditions.",
      },
      {
        question: "What is a good stocks-to-bonds ratio?",
        answer:
          "A common rule of thumb is to subtract your age from 110 to get your stock percentage. At 40, that would be 70% stocks / 30% bonds. Adjust based on your personal risk tolerance and when you need the money — aggressive savers with 30+ years ahead often hold 90%+ in stocks.",
      },
      {
        question: "Do bonds protect against stock market crashes?",
        answer:
          "In most crashes, yes. During the 2008 financial crisis, stocks fell 37% while U.S. Treasury bonds gained about 25%. However, in 2022 both fell together because the cause of the crash (soaring inflation and rapid rate hikes) hurt bonds as much as stocks.",
      },
    ],
    sources: [
      { label: "Vanguard — Asset allocation guide", url: "https://investor.vanguard.com/investor-resources-education/education/model-portfolio-allocation" },
      { label: "Federal Reserve — Historical interest rate data", url: "https://www.federalreserve.gov/releases/h15/" },
      { label: "S&P Dow Jones Indices — S&P 500 historical returns", url: "https://www.spglobal.com/spdji/en/indices/equity/sp-500/" },
    ],
    relatedComparisons: ["etf-vs-mutual-fund", "401k-vs-roth-ira", "brokerage-vs-ira"],
    calculatorLinks: [
      { label: "Investment growth calculator", href: "/investing/" },
      { label: "Portfolio calculator", href: "/portfolio/" },
      { label: "Net worth calculator", href: "/net-worth/" },
    ],
  },

  // ─── 3. HYSA vs Money Market ──────────────────────────────────────────────
  {
    slug: "hysa-vs-money-market",
    title: "HYSA vs Money Market Account: Which Pays You More?",
    metaDescription:
      "High-yield savings account vs money market account: APY comparison, FDIC insurance, access, and which earns more for your cash in 2024.",
    targetKeyword: "hysa vs money market account",
    optionA: "High-Yield Savings Account (HYSA)",
    optionB: "Money Market Account",
    h1: "HYSA vs Money Market Account: Which Earns More Interest?",
    intro:
      "A high-yield savings account (HYSA) typically pays the highest APY on flexible savings — often 4.5–5.0% in 2024 — while a money market account pairs a competitive rate (4.0–4.8%) with check-writing and debit access, making it a better fit if you need to spend directly from the account.",
    comparisonTable: {
      rows: [
        { dimension: "Typical APY (mid-2024)", a: "4.50–5.10%", b: "4.00–4.80%" },
        { dimension: "FDIC/NCUA insured", a: "Yes (up to $250,000)", b: "Yes (up to $250,000)" },
        { dimension: "Check-writing", a: "Rarely offered", b: "Often included" },
        { dimension: "Debit card access", a: "Rarely offered", b: "Often included" },
        { dimension: "Monthly transaction limit", a: "Usually none (regulatory cap lifted)", b: "Usually none (regulatory cap lifted)" },
        { dimension: "Minimum opening balance", a: "$0–$100 at most online banks", b: "$0–$2,500 (varies by institution)" },
        { dimension: "Where to find best rates", a: "Online banks (Ally, Marcus, etc.)", b: "Online banks & credit unions" },
      ],
    },
    verdict:
      "Choose a HYSA when you want the highest possible rate on savings you don't need to spend directly. Choose a money market account when you need check-writing or debit access — useful for emergency funds you might need to pay a contractor or bill directly. If rate is your only criterion, HYSA usually wins.",
    sections: [
      {
        heading: "What is a high-yield savings account?",
        content:
          "A high-yield savings account (HYSA) is a federally insured savings account that pays well above the national average APY. The national average savings rate sits around 0.58% (FDIC, 2024), while top HYSAs pay 4.5–5.1% — more than 8x the average.\n\nHYSAs are most common at online-only banks that don't pay for physical branches. Lower overhead translates directly into higher rates for customers. Ally, Marcus by Goldman Sachs, and SoFi are popular providers.\n\nYou can use the [investment calculator](/investing/) to compare how much more you'd earn over a year at 5.0% vs 0.58% on, say, a $20,000 emergency fund.",
      },
      {
        heading: "What is a money market account?",
        content:
          "A money market account (MMA) is a deposit account offered by banks and credit unions that pays competitive interest while also giving you spending access — usually a debit card, check-writing, or both.\n\nMMAs are often confused with money market funds (which are investment products, not bank deposits, and not FDIC insured). A money market account at a bank IS FDIC insured and holds cash, not investments.\n\nThe key advantage over a regular savings account or HYSA is direct spending access. You can write a check directly from the account — helpful for paying contractors, bills, or landlords who don't accept electronic transfers.",
      },
      {
        heading: "HYSA vs money market: which has better rates?",
        content:
          "HYSAs typically top money market account rates because online banks compete aggressively for deposits by offering maximum yield. In mid-2024, the top HYSA rates were 5.00–5.15% while the top MMA rates ran 4.80–5.00%.\n\nThe gap is usually small — often 0.10–0.30%. On a $10,000 balance, that's $10–$30 per year in difference. For most savers, the practical difference is less about rate and more about what features you need alongside the yield.\n\nA non-obvious consideration: some money market accounts have tiered rates that pay more on higher balances. A $100,000 balance in certain MMAs can earn as much or more than a standard HYSA. Always compare APY at your actual balance level.",
      },
      {
        heading: "When to use each account",
        content:
          "Use a HYSA when your only goal is maximum interest on savings you don't need to spend directly. Most HYSAs let you link to an external checking account for easy transfers within 1–2 business days.\n\nUse a money market account when you need to be able to write checks or swipe a card from your savings — common for emergency funds where a transfer delay could cause problems, or for business owners managing cash flow.\n\nBoth are excellent for emergency funds, short-term savings goals, and parking cash you're waiting to invest. They're less suitable for money you'll need in under 1 month (use checking) or over 2 years (consider a CD).",
      },
    ],
    faqs: [
      {
        question: "Is a money market account safer than a HYSA?",
        answer:
          "Both are equally safe when held at FDIC-insured banks or NCUA-insured credit unions. Both are insured up to $250,000 per depositor per institution. Neither carries investment risk.",
      },
      {
        question: "Do HYSAs and money market accounts have transaction limits?",
        answer:
          "The Federal Reserve's Regulation D cap (6 withdrawals per month) was suspended in 2020 and many banks dropped the limit entirely. However, some banks still enforce their own monthly limits. Check your account terms.",
      },
      {
        question: "Can I lose money in a HYSA or money market account?",
        answer:
          "No, not at an FDIC-insured bank (up to $250,000). Your principal is safe, and you earn interest on it. The rate is variable, so your APY can change, but your balance never goes down due to market movements.",
      },
      {
        question: "How often do HYSA and money market rates change?",
        answer:
          "Rates on both accounts are variable and typically move with the Federal Reserve's federal funds rate. When the Fed raises rates, banks usually raise deposit rates (with some lag). When the Fed cuts rates, deposit rates fall. Rates are not locked in like a CD.",
      },
    ],
    sources: [
      { label: "FDIC — National deposit rates", url: "https://www.fdic.gov/resources/resolutions/bank-failures/failed-bank-list/banklist.html" },
      { label: "FDIC — Deposit insurance overview", url: "https://www.fdic.gov/resources/deposit-insurance/" },
      { label: "Federal Reserve — Regulation D", url: "https://www.federalreserve.gov/supervisionreg/regd.htm" },
    ],
    relatedComparisons: ["hysa-vs-cd", "stocks-vs-bonds", "brokerage-vs-ira"],
    calculatorLinks: [
      { label: "Investment growth calculator", href: "/investing/" },
      { label: "Net worth calculator", href: "/net-worth/" },
    ],
  },

  // ─── 4. HYSA vs CD ───────────────────────────────────────────────────────
  {
    slug: "hysa-vs-cd",
    title: "HYSA vs CD: Which One Earns More Interest in 2024?",
    metaDescription:
      "High-yield savings account vs CD compared: APY, liquidity, flexibility, and which account earns more given today's rates.",
    targetKeyword: "hysa vs cd",
    optionA: "High-Yield Savings Account (HYSA)",
    optionB: "Certificate of Deposit (CD)",
    h1: "HYSA vs CD: Which Account Earns More Interest?",
    intro:
      "A high-yield savings account (HYSA) earns a variable rate you can access anytime, while a CD locks your money for a set term (3 months to 5 years) in exchange for a fixed rate that can be slightly higher — the right choice depends entirely on when you need the money.",
    comparisonTable: {
      rows: [
        { dimension: "Typical APY (mid-2024)", a: "4.50–5.10% (variable)", b: "4.80–5.40% (1-year, fixed)" },
        { dimension: "Rate type", a: "Variable — changes with Fed rate", b: "Fixed for the full term" },
        { dimension: "Liquidity", a: "High — withdraw anytime", b: "Low — penalty for early withdrawal" },
        { dimension: "Early withdrawal penalty", a: "None", b: "Typically 60–180 days of interest" },
        { dimension: "Minimum deposit", a: "$0–$100 at most online banks", b: "$500–$1,000 typically" },
        { dimension: "FDIC insured", a: "Yes (up to $250,000)", b: "Yes (up to $250,000)" },
        { dimension: "Best for", a: "Emergency fund, flexible savings", b: "Known future expense, rate-lock" },
      ],
    },
    verdict:
      "Choose a HYSA for your emergency fund or any money you might need on short notice — the flexibility is worth slightly lower rates. Choose a CD when you have a specific future expense (home purchase down payment in 18 months, tuition in 2 years) and want to lock in today's rate before the Fed cuts.",
    sections: [
      {
        heading: "Why a CD can beat a HYSA on rate",
        content:
          "CDs pay higher rates because you promise the bank you'll leave your money untouched. Banks can plan around that commitment and offer a slight premium — typically 0.10–0.40% more than the top HYSA rate for a 1-year term.\n\nIn practice, the rate difference is modest. On a $10,000 deposit, earning 5.20% on a 1-year CD instead of 4.90% on a HYSA earns you about $30 more over the year. For most savers, the flexibility of a HYSA outweighs $30.\n\nThe math changes when you have a specific timeline and a larger balance. A $50,000 CD at 5.20% vs a HYSA at 4.80% earns $200 more per year — plus you're protected from rate cuts the Fed may announce.",
      },
      {
        heading: "The risk of locking into a CD",
        content:
          "The main downside of a CD is early withdrawal. Most banks charge a penalty — typically 60–180 days of interest — if you withdraw before the term ends. On a 1-year CD paying 5.0%, an early withdrawal 3 months in could cost you all your earned interest and then some.\n\nCDs also miss out if rates rise. If you lock into a 5% CD for 2 years and the Fed raises rates to push HYSA yields to 6%, you're stuck at 5% while your HYSA neighbor earns more.\n\nThe CD ladder strategy reduces both risks: instead of one large CD, you spread funds across CDs maturing at 3, 6, 9, and 12 months. Funds become available quarterly, and you always re-lock at current rates.",
      },
      {
        heading: "When a HYSA clearly wins",
        content:
          "A HYSA beats a CD any time you value flexibility. The clearest case is your emergency fund — 3–6 months of expenses you need accessible within days. Locking an emergency fund in a CD could cost you in a real emergency.\n\nHYSAs also win when the Fed is expected to raise rates. In a rising-rate environment, you capture each new higher rate automatically. CDs lock you into the old rate while HYSA savers ride the rate increases up.\n\nSince March 2022, the Fed raised rates 11 times. HYSA holders benefited from each hike automatically. CD holders who locked in early 2022 missed the top rates entirely.",
      },
      {
        heading: "CD ladder: the best of both worlds",
        content:
          "A CD ladder lets you combine the higher fixed rates of CDs with quarterly access to your money. The strategy: divide your savings into equal portions and buy CDs that mature in 3, 6, 9, and 12 months.\n\nAs each CD matures, you either reinvest into a new 12-month CD (extending the ladder) or take the cash if you need it. This gives you a yield that tracks 1-year CD rates — typically higher than a HYSA — while ensuring you always have a CD maturing soon.\n\nFor savers with $20,000+, a CD ladder often outperforms both a straight HYSA and a single lump-sum CD. The [investment calculator](/investing/) can model the compounding difference over 2–5 years.",
      },
    ],
    faqs: [
      {
        question: "Is a HYSA better than a CD right now?",
        answer:
          "As of mid-2024, top HYSA rates are close to top 1-year CD rates. The HYSA wins on flexibility; the CD wins slightly on rate certainty. If the Fed is expected to cut rates (which they signaled for late 2024), locking a CD now protects your rate. If you need access to the money, HYSA wins regardless.",
      },
      {
        question: "What happens if I withdraw from a CD early?",
        answer:
          "Most banks charge an early withdrawal penalty equal to 60–180 days of interest. On a 1-year CD at 5%, withdrawing after 3 months could mean forfeiting all earned interest. Some no-penalty CDs waive this fee but typically offer a lower rate.",
      },
      {
        question: "Are CDs worth it in 2024?",
        answer:
          "Yes, especially if you have a specific future expense. With 1-year CD rates around 5.0–5.4%, you can lock in a meaningful return without market risk. The key question is whether you can afford to leave the money untouched. If not, a HYSA is safer.",
      },
      {
        question: "What is the best HYSA rate available?",
        answer:
          "In mid-2024, the highest HYSA rates were in the 5.00–5.15% APY range, offered mainly by online banks. Rates change frequently — always compare using a current source like Bankrate or NerdWallet for today's top rates.",
      },
    ],
    sources: [
      { label: "FDIC — Deposit insurance overview", url: "https://www.fdic.gov/resources/deposit-insurance/" },
      { label: "Federal Reserve — Federal funds rate decisions", url: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm" },
    ],
    relatedComparisons: ["hysa-vs-money-market", "stocks-vs-bonds", "401k-vs-roth-ira"],
    calculatorLinks: [
      { label: "Investment growth calculator", href: "/investing/" },
      { label: "Net worth calculator", href: "/net-worth/" },
    ],
  },

  // ─── 5. Roth 401(k) vs Traditional 401(k) ────────────────────────────────
  {
    slug: "roth-401k-vs-traditional-401k",
    title: "Roth 401(k) vs Traditional 401(k): Which Saves More?",
    metaDescription:
      "Roth 401(k) vs Traditional 401(k): taxes, contribution limits, employer match, and which version saves more based on your tax rate.",
    targetKeyword: "roth 401k vs traditional 401k",
    optionA: "Roth 401(k)",
    optionB: "Traditional 401(k)",
    h1: "Roth 401(k) vs Traditional 401(k): Which Version Wins?",
    intro:
      "A Roth 401(k) takes contributions after tax so your withdrawals in retirement are tax-free, while a Traditional 401(k) reduces your taxable income today — and the right choice hinges on whether your tax rate is higher now or when you retire.",
    comparisonTable: {
      rows: [
        { dimension: "Contribution tax timing", a: "After-tax (no deduction now)", b: "Pre-tax (reduces taxable income now)" },
        { dimension: "2024 contribution limit", a: "$23,000 ($30,500 if 50+)", b: "$23,000 ($30,500 if 50+)" },
        { dimension: "Tax on retirement withdrawals", a: "Tax-free", b: "Taxed as ordinary income" },
        { dimension: "Employer match taxation", a: "Match goes into Traditional side (pre-tax)", b: "Match is pre-tax" },
        { dimension: "Required minimum distributions", a: "Yes at 73 (avoidable via Roth IRA rollover)", b: "Yes at 73" },
        { dimension: "Income limits", a: "None", b: "None" },
        { dimension: "Best for", a: "Early career, expect higher taxes in retirement", b: "Peak earning years, expect lower taxes in retirement" },
      ],
    },
    verdict:
      "Pick Roth 401(k) if you're early in your career or expect your tax rate to be higher in retirement (very common given potential Social Security income, RMDs, and tax law uncertainty). Pick Traditional 401(k) in your peak earning years when today's tax rate is likely your highest, and you're confident you'll be in a lower bracket in retirement.",
    sections: [
      {
        heading: "Tax math: which version saves more?",
        content:
          "The decision is a tax-rate bet. If your rate is 22% today and 12% in retirement, every Traditional 401(k) dollar saves 22 cents in tax now and costs only 12 cents when withdrawn — a 10-cent savings per dollar. Roth 401(k) would have been the wrong choice in that scenario.\n\nFlip it: if you're 28, earning $55,000, and in the 12% bracket today — but expect a 22% rate in retirement with Social Security, pension income, and RMDs — the Roth 401(k) saves 10 cents per dollar.\n\nThe honest answer is nobody knows for certain what future tax rates will be. That's why many financial planners recommend diversifying: split contributions between Roth and Traditional to hedge the uncertainty.",
      },
      {
        heading: "The employer match always goes in pre-tax",
        content:
          "A key rule most people miss: even if you choose the Roth 401(k) option, your employer's matching contributions always land in the pre-tax (Traditional) side of your account.\n\nThat means if you're 100% Roth 401(k), you'll still end up with a Traditional 401(k) balance from your employer match. When you withdraw that match in retirement, it's taxed. This is not a reason to avoid Roth — just important to plan for mixed tax treatment.\n\nSince the SECURE 2.0 Act (2022), employers can now offer Roth matching — some companies have updated their plans to let employees choose. Check with your HR department.",
      },
      {
        heading: "Roth 401(k) and required minimum distributions",
        content:
          "Both Roth and Traditional 401(k) accounts are subject to required minimum distributions (RMDs) starting at age 73. This is a key difference from a Roth IRA, which has no RMDs during the owner's lifetime.\n\nIf you want to avoid RMDs on your Roth 401(k) balance, you can roll it into a Roth IRA before you reach 73. Because Roth IRA contributions are after-tax (same as Roth 401k), there's no tax due on the rollover.\n\nThis is a common retirement planning strategy: during the years between retirement and age 73, roll Roth 401(k) funds to a Roth IRA to eliminate RMD requirements on that balance entirely.",
      },
      {
        heading: "When to use both at the same time",
        content:
          "If your plan allows split contributions, you can put some dollars in Traditional and some in Roth each year. In 2024, as long as the total doesn't exceed $23,000, you can split it any way you like.\n\nA practical approach: contribute enough Traditional 401(k) to stay in your current bracket's lower band, then put additional contributions in Roth. For example, if you're $5,000 below the top of the 22% bracket, put $5,000 Traditional (saving at 22%) and the rest Roth.\n\nUse the [retirement calculator](/retirement/) to model both approaches with your specific income and expected retirement spending.",
      },
    ],
    faqs: [
      {
        question: "Should I choose Roth or Traditional 401(k)?",
        answer:
          "Choose Roth 401(k) if you're early in your career and expect a higher tax rate in retirement. Choose Traditional 401(k) in your peak earning years when your current rate is high. Many financial planners recommend splitting contributions to hedge tax uncertainty.",
      },
      {
        question: "Can I have both a Roth and Traditional 401(k) in the same plan?",
        answer:
          "Yes, if your employer's plan allows it. You can split your contributions between Roth and Traditional in any proportion, as long as the combined total doesn't exceed the annual limit ($23,000 in 2024).",
      },
      {
        question: "Do Roth 401(k) contributions reduce my taxable income?",
        answer:
          "No. Roth 401(k) contributions are made with after-tax money, so they don't reduce your current year's taxable income. Traditional 401(k) contributions do reduce your taxable income.",
      },
      {
        question: "Is the Roth 401(k) better than a Roth IRA?",
        answer:
          "The Roth 401(k) has no income limits and a much higher contribution limit ($23,000 vs $7,000 in 2024). The Roth IRA has more investment options and no RMDs. Most people should use both: max the Roth IRA, then use the Roth 401(k) for additional savings.",
      },
    ],
    sources: [
      { label: "IRS — Designated Roth accounts", url: "https://www.irs.gov/retirement-plans/designated-roth-accounts" },
      { label: "IRS — 401(k) contribution limits", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits" },
      { label: "IRS — Required minimum distributions", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds" },
    ],
    relatedComparisons: ["401k-vs-roth-ira", "brokerage-vs-ira", "529-vs-roth-ira"],
    calculatorLinks: [
      { label: "Retirement calculator", href: "/retirement/" },
      { label: "Investment growth calculator", href: "/investing/" },
    ],
  },

  // ─── 6. 15-Year vs 30-Year Mortgage ──────────────────────────────────────
  {
    slug: "15-year-vs-30-year-mortgage",
    title: "15-Year vs 30-Year Mortgage: Which Loan Saves More?",
    metaDescription:
      "15-year vs 30-year mortgage compared: monthly payments, total interest, rates, and which loan saves you more money over time.",
    targetKeyword: "15 year vs 30 year mortgage",
    optionA: "15-Year Mortgage",
    optionB: "30-Year Mortgage",
    h1: "15-Year vs 30-Year Mortgage: Total Cost, Monthly Payment, and Which Wins",
    intro:
      "On a $300,000 loan, a 15-year mortgage at 6.5% costs about $2,620/month and saves over $150,000 in total interest compared to a 30-year loan at 7.0% ($1,996/month) — but only if your budget can absorb the higher payment.",
    comparisonTable: {
      rows: [
        { dimension: "Monthly payment ($300k loan)", a: "~$2,613 at 6.5%", b: "~$1,996 at 7.0%" },
        { dimension: "Total interest paid ($300k)", a: "~$170,000", b: "~$419,000" },
        { dimension: "Total interest savings vs 30-yr", a: "$249,000 saved", b: "Baseline" },
        { dimension: "Typical interest rate (2024)", a: "0.50–0.75% lower than 30-year", b: "Higher than 15-year" },
        { dimension: "Equity build speed", a: "Fast — half the loan paid in ~5 years", b: "Slow — mostly interest early" },
        { dimension: "Flexibility", a: "Less (larger required payment)", b: "More (can pay extra voluntarily)" },
        { dimension: "Best for", a: "Stable income, near retirement, refinancers", b: "First-time buyers, growing families" },
      ],
    },
    verdict:
      "Pick the 15-year mortgage if you can comfortably afford the higher payment — the interest savings are enormous and you'll build equity much faster. Pick the 30-year mortgage if the difference in monthly payment would strain your budget or cut into emergency savings, investments, or retirement contributions. The 30-year's lower payment lets you invest the difference, which can also compound significantly.",
    sections: [
      {
        heading: "The interest cost difference is enormous",
        content:
          "On a $300,000 home loan, the lifetime interest difference between a 15-year and 30-year mortgage is staggering. The 15-year loan (at 6.5%) pays about $170,000 in interest. The 30-year loan (at 7.0%) pays about $419,000. That's a $249,000 difference — nearly the cost of the original home.\n\nThe 15-year loan also typically carries a lower interest rate, usually 0.5–0.75% below the 30-year rate. That rate advantage is baked into the savings above. On a $300,000 loan, a 0.5% rate reduction alone saves over $30,000 in interest over the life of the loan.\n\nUse the [mortgage calculator](/mortgage/) to see the exact breakdown for your loan amount, rate, and term.",
      },
      {
        heading: "Can you beat the 15-year by investing the difference?",
        content:
          "The classic counterargument to the 15-year mortgage: take a 30-year loan, invest the $617/month payment difference in the stock market, and you might come out ahead over 30 years.\n\nIf you invest $617/month for 30 years at the historical S&P 500 average of 10%, you'd accumulate about $1.4 million — far more than the $249,000 in interest you'd save. This math works in theory.\n\nThe non-obvious problem: most people don't consistently invest the difference. The lower payment gets absorbed into lifestyle spending. If you're confident you'll invest it, the 30-year math can favor you. If history shows you spend extra income rather than invest it, the 15-year's forced savings wins.",
      },
      {
        heading: "Refinancing: can you get 15-year benefits with a 30-year loan?",
        content:
          "You can mimic a 15-year loan on a 30-year mortgage by making extra principal payments. If you add $617/month in extra principal on a $300,000 / 30-year / 7.0% loan, you pay it off in about 15 years and save almost the same in interest.\n\nThis hybrid approach gives you the lower required payment of a 30-year (financial flexibility) while hitting the 15-year payoff timeline if you stay disciplined. Many financial planners recommend this strategy: take the 30-year but pay as if it's a 15-year. In a financial emergency, you can drop to the minimum payment.\n\nThe actual 15-year loan is the right choice when you want an external commitment that enforces discipline — you can't easily skip payments — and when you're close to retirement and want a paid-off home.",
      },
      {
        heading: "Which mortgage term is right for your stage of life?",
        content:
          "Stage of life matters more than most mortgage comparisons admit. A 35-year-old with a growing family and variable income often benefits from the 30-year's flexibility — career changes, kids, and unexpected expenses are common.\n\nA 50-year-old refinancing a nearly paid-off home or a high earner in their peak years is the ideal 15-year borrower. They have stable income, kids are older, and they want the mortgage gone before retirement.\n\nFirst-time buyers with limited savings should almost always choose the 30-year. The lower payment preserves cash for an emergency fund and retirement contributions — both of which often yield more than the interest savings of a 15-year mortgage early in your career.",
      },
    ],
    faqs: [
      {
        question: "Is a 15-year mortgage always better than a 30-year?",
        answer:
          "Not always. The 15-year saves more in total interest, but only if the higher payment doesn't crowd out emergency savings or retirement contributions. A 30-year mortgage with disciplined extra payments can achieve similar results with more flexibility.",
      },
      {
        question: "What is the interest rate difference between 15 and 30-year mortgages?",
        answer:
          "In 2024, 15-year mortgage rates run about 0.50–0.75% lower than 30-year rates. On a $300,000 loan, that rate difference alone saves about $30,000–$45,000 in interest over the 15-year term.",
      },
      {
        question: "Can I pay off a 30-year mortgage in 15 years?",
        answer:
          "Yes — by making extra principal payments. Adding the equivalent of one extra monthly payment per year can shave 4–7 years off a 30-year mortgage. Paying the full \"difference\" between the 15 and 30-year payments can bring your payoff timeline close to 15 years.",
      },
      {
        question: "Which mortgage is better for refinancing?",
        answer:
          "If you're refinancing with 10–15 years left on a 30-year mortgage, switching to a 15-year often makes sense — you may not change your payoff date much, but you'll get a lower rate and build equity faster. Always compare total cost over your remaining time horizon, not just monthly payment.",
      },
    ],
    sources: [
      { label: "Freddie Mac — Primary Mortgage Market Survey", url: "https://www.freddiemac.com/pmms" },
      { label: "CFPB — Understanding mortgage fees and rates", url: "https://www.consumerfinance.gov/owning-a-home/" },
    ],
    relatedComparisons: ["fixed-vs-arm-mortgage", "renting-vs-buying"],
    calculatorLinks: [
      { label: "Mortgage calculator", href: "/mortgage/" },
      { label: "Net worth calculator", href: "/net-worth/" },
      { label: "Rental property calculator", href: "/real-estate/" },
    ],
  },

  // ─── 7. Brokerage Account vs IRA ─────────────────────────────────────────
  {
    slug: "brokerage-vs-ira",
    title: "Brokerage Account vs IRA: Which Is Better for You?",
    metaDescription:
      "Brokerage account vs IRA compared: contribution limits, tax treatment, withdrawal rules, and which account to prioritize for investing.",
    targetKeyword: "brokerage account vs ira",
    optionA: "Brokerage Account",
    optionB: "IRA",
    h1: "Brokerage Account vs IRA: Which Account Should You Invest In First?",
    intro:
      "A brokerage account has no contribution limits, no withdrawal restrictions, and is taxed annually on dividends and capital gains — while an IRA offers tax advantages ($7,000/year limit) that can save tens of thousands in taxes over a career, making the IRA the right first choice for most long-term investors.",
    comparisonTable: {
      rows: [
        { dimension: "Annual contribution limit", a: "None", b: "$7,000 ($8,000 if 50+) in 2024" },
        { dimension: "Tax on dividends/interest", a: "Taxed each year", b: "Traditional: tax-deferred; Roth: never" },
        { dimension: "Tax on capital gains", a: "Taxed when sold (0/15/20%)", b: "Traditional: taxed as income; Roth: never" },
        { dimension: "Early withdrawal", a: "Anytime, no penalty", b: "10% penalty on earnings before 59½" },
        { dimension: "Required minimum distributions", a: "None", b: "Traditional: yes at 73; Roth IRA: none" },
        { dimension: "Income limits", a: "None", b: "Roth IRA: $161k single / $240k married (2024)" },
        { dimension: "Investment options", a: "Unlimited (stocks, ETFs, options, etc.)", b: "Unlimited (self-directed IRA)" },
      ],
    },
    verdict:
      "Max out your IRA first — the tax advantages are too good to skip. A Traditional IRA deducts contributions now; a Roth IRA gives you tax-free growth forever. Once you've hit the $7,000 limit, use a brokerage account for additional investing. Use the brokerage for goals before retirement (house down payment, car) and for money you might need before age 59½.",
    sections: [
      {
        heading: "Why the IRA tax advantage is worth $100,000+",
        content:
          "Consider a 35-year-old investing $7,000/year for 30 years at 8% average returns. In a taxable brokerage (assuming 15% long-term capital gains annually), the account grows to about $620,000. In a Roth IRA with the same contributions and returns, it grows to $860,000 — and every dollar is tax-free.\n\nThat's a $240,000 difference purely from tax treatment on identical investments. The earlier you start, the larger the gap — because tax-free compounding has more time to work.\n\nUse the [investment calculator](/investing/) to plug in your own numbers and see how much your tax treatment affects the final balance.",
      },
      {
        heading: "When to choose a brokerage account first",
        content:
          "Despite the IRA's tax advantages, there are cases where a brokerage account makes more sense. If you're saving for a goal within the next 3–5 years — a home down payment, a car, a sabbatical — you can't lock that money in an IRA without risking a 10% early withdrawal penalty on earnings.\n\nBrokerage accounts are also essential once you've maxed your IRA. The $7,000 annual limit caps your tax-advantaged space. High earners who save 15–20% of income will exceed this limit and need a brokerage account for the overflow.\n\nA brokerage account also offers more flexibility for tax-loss harvesting — selling losing positions to offset gains, reducing your tax bill in high-income years. IRAs cannot be used for tax-loss harvesting.",
      },
      {
        heading: "Reducing taxes in a brokerage account",
        content:
          "A taxable brokerage account isn't a tax black hole — you have tools to minimize the drag. First, favor index ETFs over actively managed funds. Index ETFs rarely distribute capital gains (due to in-kind creation/redemption), while active mutual funds often distribute taxable gains even when you didn't sell.\n\nSecond, use tax-loss harvesting. When holdings are down, selling them realizes a loss that can offset capital gains dollar-for-dollar (and up to $3,000 of ordinary income per year). The loss can be carried forward indefinitely.\n\nThird, hold bonds in your IRA and stocks in your brokerage when possible. Bond interest is taxed as ordinary income (high), while stock long-term capital gains are taxed at 0–20% — so you want bonds sheltered in the IRA, stocks in the lower-rate taxable account.",
      },
      {
        heading: "The optimal account priority order",
        content:
          "Most personal finance experts agree on the optimal savings order. First, contribute to your 401(k) up to the full employer match — that's an instant 50–100% return. Second, max out a Roth IRA ($7,000 in 2024) — tax-free growth beats everything.\n\nThird, if you have money left, max the 401(k) — another $16,000 in pre-tax or Roth contributions ($23,000 total minus what you already contributed for the match). Fourth, use a taxable brokerage account for anything beyond these limits.\n\nThis order optimizes tax treatment at each income level. The [retirement calculator](/retirement/) can model how each account type contributes to your retirement balance over time.",
      },
    ],
    faqs: [
      {
        question: "Should I invest in a brokerage or Roth IRA first?",
        answer:
          "Roth IRA first, almost always. The tax-free growth advantage can add $200,000+ to your retirement balance on the same contributions. Use a brokerage only after maxing your IRA, or for savings you'll need before retirement.",
      },
      {
        question: "Is a brokerage account taxable?",
        answer:
          "Yes. You pay taxes on dividends and interest each year, and on capital gains when you sell. Long-term capital gains (holdings over 1 year) are taxed at 0%, 15%, or 20% depending on income. Short-term gains are taxed as ordinary income.",
      },
      {
        question: "Can I withdraw from a Roth IRA penalty-free for any reason?",
        answer:
          "You can withdraw your Roth IRA contributions (not earnings) at any time, for any reason, with no taxes or penalties. To withdraw earnings tax-free and penalty-free, the account must be at least 5 years old and you must be 59½ or older.",
      },
      {
        question: "What is a backdoor Roth IRA?",
        answer:
          "A backdoor Roth IRA is a strategy for high earners who exceed the Roth IRA income limits. You contribute to a nondeductible Traditional IRA (no income limit), then immediately convert it to a Roth IRA. As long as you have no pre-existing Traditional IRA balances, this creates Roth tax benefits regardless of income.",
      },
    ],
    sources: [
      { label: "IRS — Traditional and Roth IRAs", url: "https://www.irs.gov/retirement-plans/individual-retirement-arrangements-iras" },
      { label: "IRS — Topic No. 409 Capital Gains and Losses", url: "https://www.irs.gov/taxtopics/tc409" },
    ],
    relatedComparisons: ["401k-vs-roth-ira", "roth-401k-vs-traditional-401k", "stocks-vs-bonds"],
    calculatorLinks: [
      { label: "Investment growth calculator", href: "/investing/" },
      { label: "Retirement calculator", href: "/retirement/" },
      { label: "Portfolio calculator", href: "/portfolio/" },
    ],
  },

  // ─── 8. Fixed vs ARM Mortgage ─────────────────────────────────────────────
  {
    slug: "fixed-vs-arm-mortgage",
    title: "Fixed vs ARM Mortgage: Which Rate Will Save You More?",
    metaDescription:
      "Fixed vs ARM mortgage compared: rate stability, initial rates, long-term cost, and which loan type saves more for your situation.",
    targetKeyword: "fixed vs arm mortgage",
    optionA: "Fixed-Rate Mortgage",
    optionB: "Adjustable-Rate Mortgage (ARM)",
    h1: "Fixed vs ARM Mortgage: Which Rate Is Better for Your Home Loan?",
    intro:
      "A fixed-rate mortgage locks your interest rate for the life of the loan — protecting you from rising rates — while an ARM starts with a lower rate that adjusts after an initial period (typically 5, 7, or 10 years), making it cheaper up front but riskier over time.",
    comparisonTable: {
      rows: [
        { dimension: "Rate stability", a: "Same rate for life of loan", b: "Fixed for 3–10 years, then adjusts" },
        { dimension: "Initial rate (2024)", a: "~7.0% (30-year)", b: "~6.0–6.5% (5/1 ARM)" },
        { dimension: "Monthly payment", a: "Never changes", b: "Can rise or fall after initial period" },
        { dimension: "Best when rates are...", a: "Low — lock in the low rate", b: "High — bet on rates falling" },
        { dimension: "Long-term cost certainty", a: "Fully predictable", b: "Uncertain after adjustment period" },
        { dimension: "Rate caps", a: "N/A (rate never changes)", b: "Lifetime cap typically 5%, periodic cap 2%" },
        { dimension: "Best for", a: "Long-term homeowners (7+ years)", b: "Short-term owners or those expecting to refinance" },
      ],
    },
    verdict:
      "Pick a fixed-rate mortgage when you plan to stay in the home long-term, value payment certainty, or rates are relatively low. Pick an ARM when today's rates are elevated and expected to fall, when you plan to sell or refinance within the initial fixed period, or when the rate savings meaningfully reduce your monthly payment.",
    sections: [
      {
        heading: "How ARM rates work",
        content:
          "An adjustable-rate mortgage starts with a fixed rate for an initial period — the most common are 5/1, 7/1, and 10/1 ARMs. The first number is years fixed; the second is how often the rate adjusts after that.\n\nA 5/1 ARM at 6.0% stays fixed for 5 years, then adjusts annually based on a benchmark index (typically SOFR — the Secured Overnight Financing Rate) plus a fixed margin. If the index rises 1.5% by year 6, your rate could jump from 6.0% to 7.5%.\n\nARMs have caps to limit rate shock. A common structure is 2/2/5: the first adjustment can't exceed 2%, subsequent adjustments can't exceed 2%, and the lifetime cap is 5% above the initial rate. So a 6.0% ARM could rise to at most 11.0% over its life.",
      },
      {
        heading: "When ARMs save real money",
        content:
          "In a high-rate environment, ARMs offer a meaningful payment discount. In 2024, a typical 5/1 ARM was running about 0.5–1.0% below 30-year fixed rates. On a $400,000 loan, a 1% rate difference is about $265/month — $15,900 over 5 years.\n\nIf you sell or refinance before the ARM adjusts, you pocket the full savings with no downside. The ARM is especially attractive for buyers who know they'll move within 5–7 years (job relocation, family plans, downsizing).\n\nThe non-obvious risk: you may not move on schedule. Life changes, markets shift, and the home you planned to sell may not sell on your timeline. ARMs reward disciplined planners but punish those who overstay the initial period in a rising-rate environment.",
      },
      {
        heading: "Fixed-rate mortgages: predictability at a price",
        content:
          "A fixed-rate mortgage never changes. The payment you make on month 1 is identical to the payment on month 360 (year 30). This predictability has enormous value for budgeting, especially as your income grows but your housing cost doesn't.\n\nFixed rates are most valuable when locked in during a low-rate environment. Homeowners who locked 30-year rates at 2.75–3.5% in 2020–2021 now enjoy payments that look like rent on a studio apartment by comparison.\n\nIn 2024 with 30-year rates around 7%, locking a fixed rate feels expensive. But if rates rise further — or stay elevated — you'll be glad you did. Use the [mortgage calculator](/mortgage/) to model both scenarios at your loan amount.",
      },
      {
        heading: "Refinancing from ARM to fixed",
        content:
          "Many borrowers use an ARM initially, then refinance to a fixed rate before the adjustment period ends. This strategy captures the ARM's lower initial rate while limiting long-term rate risk.\n\nThe risk: refinancing costs money. Closing costs typically run 2–5% of the loan amount. On a $400,000 mortgage, that's $8,000–$20,000. You need to stay in the home long enough after refinancing to recoup those costs through lower payments.\n\nThe break-even point — how long it takes for payment savings to exceed refinancing costs — is usually 2–4 years at typical cost and rate-difference levels. Refinancing makes sense only if you expect to stay past the break-even point.",
      },
    ],
    faqs: [
      {
        question: "Is a fixed or ARM mortgage better in 2024?",
        answer:
          "In 2024, with rates elevated near 7%, ARMs offer a 0.5–1% rate discount for borrowers planning to sell or refinance within 5–7 years. If you plan to stay long-term or rates could rise further, the fixed-rate offers certainty worth paying a premium for.",
      },
      {
        question: "What happens to my ARM payment after the initial period?",
        answer:
          "After the fixed period (e.g., 5 years on a 5/1 ARM), the rate adjusts annually based on a market index plus your loan's margin. Most ARMs cap the first adjustment at +2%, subsequent adjustments at +2%, and the lifetime maximum at +5% above the initial rate.",
      },
      {
        question: "Can I refinance an ARM to a fixed-rate mortgage?",
        answer:
          "Yes. Refinancing an ARM to a fixed rate is common. The optimal time is before your ARM's first adjustment, so you lock in a fixed rate before potential rate increases. Weigh closing costs (2–5% of loan) against the monthly savings to calculate your break-even timeline.",
      },
      {
        question: "What is the ARM rate cap?",
        answer:
          "ARM rate caps limit how much your rate can change at each adjustment and over the life of the loan. A common structure is 2/2/5: rate can rise no more than 2% at first adjustment, 2% at each subsequent adjustment, and no more than 5% total over the life of the loan.",
      },
    ],
    sources: [
      { label: "CFPB — Adjustable-rate mortgages", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-an-adjustable-rate-mortgage-arm-en-100/" },
      { label: "Freddie Mac — Primary Mortgage Market Survey", url: "https://www.freddiemac.com/pmms" },
    ],
    relatedComparisons: ["15-year-vs-30-year-mortgage", "renting-vs-buying"],
    calculatorLinks: [
      { label: "Mortgage calculator", href: "/mortgage/" },
      { label: "Net worth calculator", href: "/net-worth/" },
    ],
  },

  // ─── 9. Renting vs Buying ─────────────────────────────────────────────────
  {
    slug: "renting-vs-buying",
    title: "Renting vs Buying a Home: Which Is Better for You?",
    metaDescription:
      "Renting vs buying a home compared: true costs, equity, flexibility, and which choice wins at different life stages and markets.",
    targetKeyword: "renting vs buying a home",
    optionA: "Renting",
    optionB: "Buying",
    h1: "Renting vs Buying a Home: The True Cost Comparison",
    intro:
      "Buying a home builds equity and can be cheaper than renting over 7+ years in most markets — but renting wins on flexibility, lower upfront costs, and in high-price markets where monthly ownership costs far exceed rent on comparable properties.",
    comparisonTable: {
      rows: [
        { dimension: "Upfront cost", a: "Low (first+last month, deposit ~$3–6k)", b: "High (3–20% down + 2–5% closing costs)" },
        { dimension: "Monthly cost", a: "Rent only (fixed term, may rise)", b: "Mortgage + taxes + insurance + maintenance" },
        { dimension: "Equity building", a: "None — money goes to landlord", b: "Yes — builds with each payment" },
        { dimension: "Flexibility to move", a: "High — relocate when lease ends", b: "Low — selling takes months + costs 6–10%" },
        { dimension: "Maintenance responsibility", a: "Landlord's (mostly)", b: "Owner's — budget 1% of home value/year" },
        { dimension: "Tax benefits", a: "None", b: "Mortgage interest + property tax deductions" },
        { dimension: "Break-even timeline", a: "N/A", b: "Typically 5–7 years in most U.S. markets" },
      ],
    },
    verdict:
      "Rent when you plan to stay fewer than 5 years, value mobility, or live in a high-cost city where price-to-rent ratios are above 25x. Buy when you plan to stay 7+ years, have a stable income and emergency fund, and housing costs are reasonable relative to rent (price-to-rent ratio below 20x). The rent-vs-buy decision is more about your life stage than pure math.",
    sections: [
      {
        heading: "The true cost of buying a home",
        content:
          "Most people underestimate the true cost of homeownership. Beyond the mortgage payment, owners pay property taxes (typically 1–2% of home value per year), homeowner's insurance (~0.5–1%), HOA fees (if applicable), and maintenance — the standard rule is 1% of home value annually, but older homes can easily run 2–3%.\n\nOn a $400,000 home with a 20% down payment, a 7% mortgage rate, 1.2% property tax, 0.8% insurance, and 1% maintenance, the true monthly cost is about $2,950 — before building any equity. After the equity portion, your actual 'rent equivalent' (the sunk cost) is closer to $2,200/month in the early years.\n\nThe [mortgage calculator](/mortgage/) and [net worth calculator](/net-worth/) can help you model full ownership costs and how home equity builds your net worth over time.",
      },
      {
        heading: "Why renting is not 'throwing money away'",
        content:
          "The most persistent myth in personal finance is that rent is wasted money. It's not — rent buys you housing, flexibility, freedom from maintenance, and the ability to deploy your down payment capital elsewhere.\n\nA $80,000 down payment invested in a diversified stock portfolio earning 8% annually grows to $860,000 over 30 years. That same $80,000 tied up as a down payment grows only as fast as home appreciation — historically 3–4% annually — reaching about $195,000 over 30 years.\n\nThe gap closes when you factor in leverage (you control $400k of home with $80k), the forced savings effect of mortgage payments, and rent that would have otherwise exceeded mortgage costs. The math favors buying in low-to-moderate price markets and long holding periods.",
      },
      {
        heading: "The price-to-rent ratio: your key metric",
        content:
          "The price-to-rent ratio is the clearest tool for the rent-vs-buy decision. Calculate it by dividing the home purchase price by the annual rent of a comparable property. A ratio below 15 strongly favors buying. A ratio of 15–20 is roughly neutral. Above 20, renting becomes increasingly competitive; above 25, renting usually wins financially.\n\nIn 2024, San Francisco's price-to-rent ratio exceeds 40x — meaning a $1.5 million home rents for less than $40,000/year. Chicago and Cleveland run near 12–14x, clearly favoring buyers. Most U.S. metros fall between 15–25x.\n\nA practical non-obvious insight: the price-to-rent ratio also predicts your break-even point. At a 15x ratio, you typically break even buying vs renting in about 4 years. At a 25x ratio, break-even extends to 10+ years — during which time you might move, the market might shift, or rates might change.",
      },
      {
        heading: "When renting is the smarter financial move",
        content:
          "Renting is financially rational in several scenarios that many buyers overlook. When your job is unstable or you might relocate, selling a home within 2–3 years rarely recovers the 6–10% transaction costs (agent commissions, closing costs, repairs). You're often financially better renting and keeping capital flexible.\n\nRenting also makes sense during periods of elevated home prices and rates, when the monthly cost to own far exceeds rent. In many coastal markets in 2023–2024, buying required a 25–35% premium over renting comparable space — a drag that takes many years to overcome through appreciation.\n\nRenting in a high-rent area while house-hacking (buying a multi-unit property elsewhere and renting out units) is an increasingly popular strategy for building wealth without tying yourself to an expensive market. The [rental property calculator](/real-estate/) can help evaluate investment property returns.",
      },
    ],
    faqs: [
      {
        question: "Is renting or buying cheaper in 2024?",
        answer:
          "In most U.S. markets in 2024, renting is cheaper on a monthly basis due to elevated home prices and 7%+ mortgage rates. However, buying builds equity while renting does not. The breakeven point — when buying becomes the better financial deal — is typically 5–7 years in most markets.",
      },
      {
        question: "How long should you own a home before selling?",
        answer:
          "Financial planners generally recommend owning a home for at least 5–7 years before selling to recoup transaction costs (agent commissions, closing costs, repairs) through appreciation and equity buildup. Selling in fewer than 3 years often results in a net loss even in appreciating markets.",
      },
      {
        question: "What is the price-to-rent ratio?",
        answer:
          "The price-to-rent ratio is the home purchase price divided by the annual rent of a comparable property. A ratio below 15 favors buying; above 20 favors renting. San Francisco exceeds 40x (strong rent signal); Cleveland runs near 12x (strong buy signal).",
      },
      {
        question: "Does renting build wealth?",
        answer:
          "Renting itself doesn't build wealth — but investing the down payment and payment difference in the stock market can. In high price-to-rent ratio markets, renting and investing the capital often outperforms buying, especially over short-to-medium time horizons.",
      },
    ],
    sources: [
      { label: "CFPB — Buying a home", url: "https://www.consumerfinance.gov/owning-a-home/" },
      { label: "Federal Reserve — Consumer finances survey", url: "https://www.federalreserve.gov/econres/scfindex.htm" },
      { label: "National Association of Realtors — Home affordability data", url: "https://www.nar.realtor/research-and-statistics/housing-statistics/housing-affordability-index" },
    ],
    relatedComparisons: ["15-year-vs-30-year-mortgage", "fixed-vs-arm-mortgage"],
    calculatorLinks: [
      { label: "Mortgage calculator", href: "/mortgage/" },
      { label: "Rental property calculator", href: "/real-estate/" },
      { label: "Net worth calculator", href: "/net-worth/" },
    ],
  },

  // ─── 10. 529 vs Roth IRA ─────────────────────────────────────────────────
  {
    slug: "529-vs-roth-ira",
    title: "529 vs Roth IRA for College Savings: Which Is Better?",
    metaDescription:
      "529 plan vs Roth IRA for college savings: tax treatment, financial aid impact, withdrawal rules, and which account to use for your child's education.",
    targetKeyword: "529 vs roth ira for college",
    optionA: "529 Plan",
    optionB: "Roth IRA",
    h1: "529 vs Roth IRA for College Savings: Which Account Should You Use?",
    intro:
      "A 529 plan is purpose-built for education savings with state tax deductions and tax-free qualified withdrawals — but a Roth IRA's flexibility to serve double duty for both college costs and retirement makes it a strong backup, especially when it's uncertain whether the child will attend college.",
    comparisonTable: {
      rows: [
        { dimension: "Primary purpose", a: "Education expenses", b: "Retirement (college is secondary use)" },
        { dimension: "Annual contribution limit", a: "No federal limit; $18k gift-tax exclusion", b: "$7,000/year ($8,000 if 50+)" },
        { dimension: "Tax on withdrawals", a: "Tax-free for qualified education expenses", b: "Contributions: always tax-free; earnings: tax-free at 59½+" },
        { dimension: "State tax deduction", a: "Available in most states", b: "None" },
        { dimension: "Financial aid impact", a: "Counted at 5.64% of balance (parental asset)", b: "Not counted in FAFSA (retirement account)" },
        { dimension: "Penalty if not used for school", a: "10% penalty + taxes on earnings", b: "Earnings penalty waived for education; taxes still apply" },
        { dimension: "New rollover rule (post-2024)", a: "Unused balance can roll to Roth IRA (up to $35k)", b: "N/A — already a Roth IRA" },
      ],
    },
    verdict:
      "Use a 529 as your primary college savings vehicle if your state offers a tax deduction — the state tax break often beats all other options for the first $5,000–$10,000 of annual contributions. Use a Roth IRA as a backup when you're unsure whether the child will attend college, since unused Roth funds simply remain in your retirement account. Many families do both: max the state deduction in a 529, then overflow to a Roth IRA.",
    sections: [
      {
        heading: "How a 529 plan works",
        content:
          "A 529 plan is a state-sponsored education savings account. Contributions are made with after-tax dollars, but growth and qualified withdrawals are completely tax-free. Qualified expenses include tuition, fees, books, room and board, computers, and K–12 tuition up to $10,000 per year.\n\nMost states offer a tax deduction on contributions. Virginia allows a $4,000 deduction per account per year; New York allows $5,000 ($10,000 married). These deductions can save families $200–$600 per year in state taxes, effectively boosting returns by 4–8% upfront.\n\nYou don't have to use your own state's 529. If another state's plan has better investment options or lower fees, you can use it — though you'll typically lose the state tax deduction by doing so.",
      },
      {
        heading: "Using a Roth IRA for college expenses",
        content:
          "A Roth IRA can fund college costs without the 10% early withdrawal penalty on earnings — education expenses are a penalty exception. However, earnings are still subject to income tax when withdrawn before 59½ for education (only contributions are always tax-free).\n\nThe bigger advantage of a Roth IRA for college planning is what happens if your child doesn't go to college. Unlike a 529, unused Roth IRA funds simply stay in your retirement account. No penalty, no taxes, no problem.\n\nThe financial aid angle: Roth IRA balances (being retirement accounts) are not counted in FAFSA calculations, while 529 balances count as parental assets at 5.64%. On a $100,000 account, the 529 reduces financial aid eligibility by $5,640; the Roth IRA reduces it by $0.",
      },
      {
        heading: "The new 529-to-Roth IRA rollover rule",
        content:
          "The SECURE 2.0 Act (effective 2024) created a new bridge between these two accounts: unused 529 balances can now be rolled into a Roth IRA for the beneficiary, up to $35,000 lifetime, subject to annual Roth IRA contribution limits.\n\nThis dramatically reduces the downside of over-funding a 529. If you save $100,000 in a 529 and your child receives a full scholarship, up to $35,000 can roll penalty-free to their Roth IRA — giving them a head start on retirement savings.\n\nThe rollover has restrictions: the 529 must be at least 15 years old, and the annual rollover cannot exceed that year's Roth IRA contribution limit. Still, this rule tips the balance further toward 529 for families with flexibility.",
      },
      {
        heading: "The optimal strategy: use both",
        content:
          "The strongest approach for most families is to use both accounts strategically. Contribute to the 529 up to the state tax deduction limit first — capturing that guaranteed return. For Virginia families, that's $4,000/account; for New York, $5,000.\n\nBeyond the deduction limit, the choice becomes harder. If you're confident your child will attend college and the 529 will be fully used, continue contributing there. If uncertain, redirect overflow to a Roth IRA — where the money does double duty for either purpose.\n\nA practical schedule for a newborn: contribute $500/month. The first $83/month (roughly $1,000/year) goes into a 529 for the state deduction. The remaining $417/month ($5,000/year) goes into a Roth IRA. At 18, the 529 has grown for education; the Roth IRA can supplement if needed or stay as retirement savings.",
      },
    ],
    faqs: [
      {
        question: "Can a Roth IRA be used for college expenses?",
        answer:
          "Yes. Roth IRA withdrawals for qualified higher education expenses are exempt from the 10% early withdrawal penalty. However, earnings withdrawn before age 59½ are still subject to income tax. Contributions (your principal) can always be withdrawn tax-free and penalty-free.",
      },
      {
        question: "Does a 529 plan affect financial aid?",
        answer:
          "Yes, but modestly. A 529 owned by a parent is counted as a parental asset on the FAFSA at a maximum rate of 5.64% of the account value. A $100,000 parent-owned 529 reduces financial aid eligibility by about $5,640. Roth IRAs are not counted on the FAFSA.",
      },
      {
        question: "What happens to a 529 if my child doesn't go to college?",
        answer:
          "You can change the beneficiary to another family member (sibling, cousin, yourself). You can also withdraw the money for non-education purposes, but you'll owe income tax plus a 10% penalty on earnings. Under new 2024 rules, up to $35,000 of unused 529 funds can be rolled into a Roth IRA for the beneficiary.",
      },
      {
        question: "Is a 529 or Roth IRA better for college savings?",
        answer:
          "The 529 is better when your state offers a tax deduction (guaranteed return) and you're confident the funds will be used for education. The Roth IRA is better when college attendance is uncertain, or when you want unused funds to serve as retirement savings. Most families benefit from contributing to both.",
      },
    ],
    sources: [
      { label: "IRS — 529 plans (qualified tuition programs)", url: "https://www.irs.gov/taxtopics/tc313" },
      { label: "Federal Student Aid — FAFSA and assets", url: "https://studentaid.gov/resources/prepare-for-college/students/how-fafsa-works" },
      { label: "IRS — SECURE 2.0 Act provisions", url: "https://www.irs.gov/retirement-plans/secure-20-act" },
    ],
    relatedComparisons: ["401k-vs-roth-ira", "brokerage-vs-ira", "roth-401k-vs-traditional-401k"],
    calculatorLinks: [
      { label: "Investment growth calculator", href: "/investing/" },
      { label: "Retirement calculator", href: "/retirement/" },
      { label: "Net worth calculator", href: "/net-worth/" },
    ],
  },

  // ─── 11. ETF vs Mutual Fund ───────────────────────────────────────────────
  {
    slug: "etf-vs-mutual-fund",
    title: "ETF vs Mutual Fund: Which Is the Better Investment?",
    metaDescription:
      "ETF vs mutual fund compared: costs, tax efficiency, trading, minimums, and which fund type is better for long-term investors in 2024.",
    targetKeyword: "etf vs mutual fund",
    optionA: "ETF (Exchange-Traded Fund)",
    optionB: "Mutual Fund",
    h1: "ETF vs Mutual Fund: Which Is the Better Investment?",
    intro:
      "ETFs and mutual funds both pool investor money into a diversified portfolio — but ETFs trade like stocks, typically have lower expense ratios, and are more tax-efficient, while mutual funds offer automatic investing and true fractional shares, making them still the better choice for certain retirement account investors.",
    comparisonTable: {
      rows: [
        { dimension: "How it trades", a: "Intraday on an exchange (like a stock)", b: "Priced once daily at market close" },
        { dimension: "Minimum investment", a: "Price of 1 share (often $1–$200)", b: "Often $1,000–$3,000 (varies by fund)" },
        { dimension: "Typical expense ratio", a: "0.03–0.20% (index ETFs)", b: "0.05–1.50% (active funds much higher)" },
        { dimension: "Tax efficiency", a: "High — in-kind creation avoids capital gains", b: "Lower — distributes capital gains to holders" },
        { dimension: "Automatic investing", a: "Less common (full shares only at many brokers)", b: "Easy — invest any dollar amount automatically" },
        { dimension: "Dividend reinvestment", a: "Manual or DRIP (varies by broker)", b: "Automatic at most fund companies" },
        { dimension: "Management style", a: "Mostly passive (index-tracking)", b: "Both active and passive options" },
      ],
    },
    verdict:
      "For most investors, low-cost index ETFs (like those tracking the S&P 500 or total market) are the best choice: they have the lowest fees, highest tax efficiency, and instant diversification. Choose mutual funds when you want automatic dollar-amount investing in a retirement account, or when you prefer a specific actively managed fund not available as an ETF. For taxable brokerage accounts, ETFs almost always win on tax efficiency.",
    sections: [
      {
        heading: "Why ETF expense ratios matter so much",
        content:
          "A 1% expense ratio difference might sound small, but over 30 years it costs you roughly 25% of your final portfolio value. Invest $10,000 at 8% gross returns with a 0.05% expense ratio for 30 years: you end up with about $98,600. At a 1.0% expense ratio: about $76,100. The $22,500 gap is entirely from fees.\n\nVanguard's total market ETF (VTI) charges 0.03% — $3 per year on a $10,000 investment. Actively managed mutual funds often charge 0.50–1.20%. That gap compounds over decades into life-changing dollar differences.\n\nUse the [investment calculator](/investing/) to model how expense ratios affect your portfolio over your investment horizon — many investors are shocked by the decades-long impact.",
      },
      {
        heading: "ETF tax efficiency: the structural advantage",
        content:
          "ETFs have a structural tax advantage over mutual funds in taxable accounts. When mutual fund investors redeem shares, the fund must sell holdings to raise cash — triggering capital gains that are distributed to all remaining shareholders, even those who didn't sell.\n\nETFs avoid this through in-kind creation and redemption. Authorized participants exchange baskets of securities (not cash) with the ETF, so the fund almost never needs to sell holdings to meet redemptions. Result: ETF investors rarely receive capital gains distributions.\n\nIn practice, many index mutual funds (like Vanguard's mutual fund classes) are also highly tax-efficient. The key rule: in taxable accounts, prefer ETFs or index mutual funds over actively managed mutual funds. In tax-advantaged accounts (IRA, 401k), tax efficiency doesn't matter — use whichever has the lower expense ratio.",
      },
      {
        heading: "When mutual funds are the better choice",
        content:
          "Mutual funds still win in two scenarios. First: automatic investing. If you want $500 automatically invested every month from your paycheck into a diversified fund, mutual funds do this perfectly — you buy exact dollar amounts, fractions and all. ETF automatic investing is improving but still less seamless at many brokers.\n\nSecond: 401(k) accounts. Most 401(k) plans offer mutual funds, not ETFs. The selection of mutual funds in your plan is what you get — and low-cost index mutual funds in a 401(k) are just as good as ETFs for retirement savings (no tax efficiency concern in a tax-deferred account).\n\nA non-obvious scenario where mutual funds are superior: target-date funds. These automatically rebalance between stocks and bonds as you approach retirement. Most are available only as mutual funds. If you want automatic rebalancing and a single-fund retirement solution, mutual fund target-date funds are hard to beat.",
      },
      {
        heading: "Active vs passive: the bigger question",
        content:
          "The ETF vs mutual fund debate is secondary to the more important active vs passive question. Whether you choose an ETF or a mutual fund, a passive index strategy (tracking the market) beats the average actively managed fund in most time periods.\n\nS&P Dow Jones Indices data (SPIVA reports) consistently shows that 80–90% of actively managed mutual funds underperform their benchmark index after fees over 15-year periods. The underperformance is largely explained by higher expense ratios.\n\nThe practical implication: a low-cost index mutual fund (Fidelity's FZROX at 0%) beats an expensive active ETF (if you could find one), and a low-cost index ETF beats an expensive active mutual fund. Cost and style matter more than the fund structure. The [portfolio calculator](/portfolio/) can help you model the impact of different asset allocations.",
      },
    ],
    faqs: [
      {
        question: "Is an ETF better than a mutual fund?",
        answer:
          "For most long-term investors, especially in taxable accounts, yes. Low-cost index ETFs have lower expense ratios, higher tax efficiency, and no minimums. Mutual funds remain better for automatic investing and in 401(k) plans. The most important factor is cost — a low-cost mutual fund beats a high-cost ETF every time.",
      },
      {
        question: "Can you lose money in an ETF?",
        answer:
          "Yes. ETFs are market investments and can decline in value. An S&P 500 ETF fell about 19% in 2022 and 38% in 2008. The diversification of an ETF reduces single-company risk but does not protect against broad market declines.",
      },
      {
        question: "What is the difference between an ETF and an index fund?",
        answer:
          "An index fund is a strategy (tracks a market index); an ETF is a structure (trades on an exchange). Most ETFs are index funds — they track an index and trade on exchanges. But there are also actively managed ETFs and index mutual funds (which track an index but don't trade intraday). Low-cost index funds in either structure are effectively interchangeable for long-term investors.",
      },
      {
        question: "Do ETFs pay dividends?",
        answer:
          "Yes. Most ETFs holding dividend-paying stocks or bonds distribute dividends to shareholders, usually quarterly. In a taxable account, these dividends are taxed as qualified dividends (0–20%) or ordinary income. In a Roth IRA or 401(k), dividends grow tax-free.",
      },
      {
        question: "Are ETFs safer than mutual funds?",
        answer:
          "Neither is inherently safer — safety depends on what's inside the fund, not its structure. An ETF holding 500 large U.S. companies is less risky than a mutual fund concentrated in one sector. Compare funds by their holdings, diversification, and volatility, not by ETF vs mutual fund label.",
      },
    ],
    sources: [
      { label: "S&P Dow Jones Indices — SPIVA U.S. Year-End 2023", url: "https://www.spglobal.com/spdji/en/research-insights/spiva/" },
      { label: "IRS — Mutual funds and ETFs — What every investor should know", url: "https://www.irs.gov/taxtopics/tc404" },
      { label: "SEC — Exchange-traded funds", url: "https://www.sec.gov/etf" },
    ],
    relatedComparisons: ["stocks-vs-bonds", "brokerage-vs-ira", "401k-vs-roth-ira"],
    calculatorLinks: [
      { label: "Investment growth calculator", href: "/investing/" },
      { label: "Portfolio calculator", href: "/portfolio/" },
      { label: "Net worth calculator", href: "/net-worth/" },
    ],
  },

  // ─── 12. HSA vs FSA ──────────────────────────────────────────────────────
  {
    slug: "hsa-vs-fsa",
    title: "HSA vs FSA: Which Account Saves You More?",
    metaDescription:
      "HSA vs FSA compared: contribution limits, rollover rules, investment options, and which pre-tax health savings account is right for you in 2025.",
    targetKeyword: "hsa vs fsa",
    optionA: "Health Savings Account (HSA)",
    optionB: "Flexible Spending Account (FSA)",
    h1: "HSA vs FSA: Which Pre-Tax Health Account Is Right for You?",
    intro:
      "An HSA lets you save pre-tax money for medical costs, rolls over every year, and can be invested for long-term growth — but it requires a high-deductible health plan — while an FSA also provides pre-tax savings without that eligibility restriction, though a \"use it or lose it\" rule means unspent balances are forfeited at year-end, making the HSA the better long-term choice for those who qualify.",
    comparisonTable: {
      rows: [
        { dimension: "2025 contribution limit", a: "$4,300 individual / $8,550 family", b: "$3,300 (healthcare FSA)" },
        { dimension: "Account ownership", a: "You own it — portable when you leave your employer", b: "Employer-owned — typically forfeited when you leave" },
        { dimension: "Rollover / carryover", a: "Full balance rolls over every year, indefinitely", b: "\"Use it or lose it\" — up to $660 carryover OR 2.5-month grace period (employer's choice)" },
        { dimension: "Eligible health plan required", a: "Yes — must be enrolled in an HDHP", b: "No — available with most health plan types" },
        { dimension: "Investment option", a: "Yes — invest in stocks, ETFs, and mutual funds above the cash threshold", b: "No — cash-only, no investment component" },
        { dimension: "Tax advantage", a: "Triple: pre-tax contributions + tax-free growth + tax-free withdrawals", b: "Double: pre-tax contributions + tax-free qualified withdrawals (no growth)" },
        { dimension: "Funds available day 1", a: "Only what you've contributed so far this year", b: "Full annual election amount available on day 1 of coverage" },
      ],
    },
    verdict:
      "Choose an HSA if your employer offers a high-deductible health plan — the triple tax advantage, unlimited rollover, and long-term investment potential make it one of the most powerful savings vehicles in the tax code. Choose an FSA if your health plan doesn't qualify for an HSA, you need the full year's funds available immediately in January, or you have predictable annual medical expenses you know you'll spend. If your employer offers a Limited-Purpose FSA (dental and vision only), you can pair it with an HSA to get benefits from both — but a standard healthcare FSA and an HSA cannot be held simultaneously.",
    sections: [
      {
        heading: "How an HSA works",
        content:
          "A Health Savings Account (HSA) is a personal tax-advantaged account you own permanently. Contributions go in pre-tax, grow tax-free when invested, and come out tax-free when used for qualified medical expenses — the only triple tax advantage in the U.S. tax code.\n\nThe key eligibility requirement: you must be enrolled in a High-Deductible Health Plan (HDHP). In 2025, an HDHP is defined as a plan with a minimum deductible of $1,650 for self-only coverage or $3,300 for family coverage. If your employer doesn't offer an HDHP option, you can't open an HSA.\n\nThe rollover rule is the HSA's most underrated feature. Unlike an FSA, your full balance carries forward every year without limit. A 35-year-old who contributes $4,300/year for 30 years and invests at a historical 8% average return would accumulate over $525,000 — and all of it is tax-free for qualified medical expenses. Use the [investment calculator](/investing/) to model HSA growth at your contribution level.\n\nAt age 65, the HSA transforms into something resembling a Traditional IRA: you can withdraw for any purpose and pay ordinary income tax on non-medical withdrawals, with no additional penalty. Medicare premiums are always qualified HSA expenses, tax-free.",
      },
      {
        heading: "How an FSA works",
        content:
          "A Flexible Spending Account (FSA) is an employer-sponsored benefit that lets you set aside pre-tax dollars for qualified medical, dental, and vision expenses without requiring a specific type of health plan. The key practical feature: your full annual election amount is available from day one — even before you've contributed those payroll deductions.\n\nThe trade-off is the \"use it or lose it\" rule. Unspent FSA balances at year-end revert to your employer. The IRS allows employers to offer one of two relief options — a carryover of up to $660 to the following plan year, or a 2.5-month grace period — but not both, and not every employer offers either.\n\nThe FSA is entirely employer-controlled. If you leave your job mid-year, your remaining FSA balance is generally forfeited unless you elect COBRA continuation coverage. This portability gap is the sharpest practical difference between the two accounts.\n\nFor families with known large annual medical expenses — scheduled surgeries, braces, or a new baby's pediatric costs — the FSA's front-loading can actually be an advantage. You can charge $3,300 in January and repay it through payroll the rest of the year, effectively getting an interest-free loan from your employer.",
      },
      {
        heading: "The HSA as a long-term retirement savings tool",
        content:
          "The most underused HSA strategy is treating it as a \"stealth IRA\" for healthcare costs in retirement. The approach: max the HSA each year, invest the balance in a low-cost stock index fund, pay current medical expenses out of pocket, and save every receipt.\n\nAt retirement, you use those saved receipts to reimburse yourself from the HSA — tax-free, with no time limit on reimbursements for old expenses. Medicare premiums, long-term care insurance, and most healthcare costs in retirement are qualified HSA expenses and can be paid tax-free.\n\nThe compounding advantage is substantial. An HSA invested in an S&P 500 index fund from age 35 to 65 outperforms the same dollars in a taxable savings account by roughly 30–40% on an after-tax basis, solely from eliminating capital gains and dividend taxes along the way.\n\nA non-obvious implication: the HSA is the only savings account where you can contribute pre-tax, earn returns tax-free, AND withdraw tax-free — making its effective return higher than a Roth IRA for qualified medical expenses. See the [net worth calculator](/net-worth/) to factor healthcare costs into your long-term financial picture.",
      },
      {
        heading: "When an FSA beats an HSA",
        content:
          "The FSA wins in several scenarios that most comparison articles overlook. First: predictable large early-year expenses. If you're scheduling a $3,000 surgery in January, the FSA lets you access the full $3,300 immediately and repay through payroll deductions — the HSA would only have what you'd contributed since January 1.\n\nSecond: when your employer's health plan doesn't qualify for an HSA. Many popular employer plans — PPOs with low deductibles, HMOs — don't meet the HDHP threshold. If your only option is a $1,000-deductible plan, HSA is off the table and FSA is the only pre-tax health savings option available.\n\nThird: predictable annual spend with no desire to invest. If you reliably spend exactly your FSA election on annual healthcare costs, the FSA's simplicity (no investment decisions, no investment threshold to manage) is genuinely adequate. The triple tax advantage only matters if you have a long-enough time horizon for tax-free growth to accumulate.\n\nFor most people under 50 with an HDHP option, the HSA still wins on math. But the FSA wins on practicality when health plan constraints or near-term cash flow are the primary concern. Use the [retirement calculator](/retirement/) to factor both accounts into your long-term savings plan.",
      },
    ],
    faqs: [
      {
        question: "Can I have both an HSA and an FSA at the same time?",
        answer:
          "Not a standard healthcare FSA and an HSA simultaneously — IRS rules prohibit it. However, you can pair an HSA with a Limited-Purpose FSA (LPFSA), which covers only dental and vision expenses. You can also hold a Dependent Care FSA (for childcare costs) alongside an HSA — that's a different type of FSA entirely and has no conflict with HSA eligibility.",
      },
      {
        question: "What happens to my HSA if I switch from an HDHP to a regular health plan?",
        answer:
          "Your existing HSA balance stays yours permanently. You just can't make new contributions while enrolled in a non-HDHP plan. The funds already in the account can still be used tax-free for qualified medical expenses at any age, with no deadline. If you switch back to an HDHP later, you can resume contributions.",
      },
      {
        question: "What happens to my FSA if I leave my job?",
        answer:
          "Your FSA balance is generally forfeited when you leave your employer unless you elect COBRA continuation coverage to maintain FSA access through year-end. The FSA is employer-owned — unlike an HSA, you can't take it with you. This is one of the strongest arguments for spending your FSA down before leaving a job and for contributing conservatively if job security is uncertain.",
      },
      {
        question: "Is an HSA or FSA better for taxes?",
        answer:
          "The HSA is better for taxes in almost every scenario where you qualify. It provides a triple tax advantage: pre-tax contributions reduce your taxable income, growth is tax-free when invested, and withdrawals for medical expenses are tax-free. An FSA gives you the first and third benefit but not tax-free growth (no investment option). For someone in the 22% tax bracket saving $4,300/year in an HSA, the immediate income tax savings alone is about $946 — plus investment growth over time.",
      },
      {
        question: "What qualifies as a medical expense for HSA and FSA?",
        answer:
          "Both accounts cover the same IRS-defined list: doctor visits, prescription drugs, dental care, vision care (including LASIK), mental health services, surgery, hospital fees, and many medical devices. After the 2020 CARES Act, over-the-counter medications and menstrual care products are eligible for both without a prescription. Cosmetic procedures, gym memberships, and non-prescription vitamins are generally not qualified expenses. The full list is in IRS Publication 502.",
      },
    ],
    sources: [
      { label: "IRS — Publication 969: Health Savings Accounts", url: "https://www.irs.gov/publications/p969" },
      { label: "IRS — Publication 502: Medical and Dental Expenses", url: "https://www.irs.gov/publications/p502" },
      { label: "IRS — HSA contribution limits 2025", url: "https://www.irs.gov/newsroom/irs-announces-2025-hsa-limits" },
    ],
    relatedComparisons: ["401k-vs-roth-ira", "brokerage-vs-ira", "hysa-vs-money-market"],
    calculatorLinks: [
      { label: "Investment growth calculator", href: "/investing/" },
      { label: "Net worth calculator", href: "/net-worth/" },
      { label: "Retirement calculator", href: "/retirement/" },
    ],
  },

  // ─── 13. VA Loan vs Conventional Loan ────────────────────────────────────
  {
    slug: "va-loan-vs-conventional-loan",
    title: "VA Loan vs Conventional Loan: Which Saves More?",
    metaDescription:
      "VA loan vs conventional loan compared: down payment, funding fee vs PMI, interest rates, eligibility, and which mortgage saves veterans the most money.",
    targetKeyword: "va loan vs conventional loan",
    optionA: "VA Loan",
    optionB: "Conventional Loan",
    h1: "VA Loan vs Conventional Loan: Which Mortgage Is Better for Veterans?",
    intro:
      "A VA loan gives eligible veterans and service members 0% down payment and no monthly PMI — two features that save thousands upfront and hundreds per month — while a conventional loan is available to anyone but requires 3–20% down and PMI until 20% equity is reached, making the VA loan the financially superior choice for most eligible borrowers.",
    comparisonTable: {
      rows: [
        { dimension: "Minimum down payment", a: "0% — no down payment required", b: "3% for first-time buyers; 5% for repeat buyers (conventional conforming)" },
        { dimension: "Monthly PMI", a: "None — ever, regardless of down payment", b: "Required below 20% equity; typically 0.5–1.5%/year of loan balance" },
        { dimension: "One-time funding fee", a: "1.25–3.3% of loan amount (waived for veterans with 10%+ disability rating)", b: "None (standard closing costs apply)" },
        { dimension: "Interest rate advantage", a: "Typically 0.25–0.5% lower than comparable conventional rate", b: "Market rate — varies by credit score, LTV, and lender" },
        { dimension: "Minimum credit score", a: "No VA minimum; most lenders require 580–620+", b: "620+ for conforming loans; 680+ for best rates" },
        { dimension: "Eligibility", a: "Active duty, veterans, National Guard/Reserves (6 years), surviving spouses — requires Certificate of Eligibility", b: "Anyone with qualifying income and credit — no service requirement" },
        { dimension: "Property types allowed", a: "Primary residence only — no investment properties or vacation homes", b: "Primary residence, second home, and investment properties" },
      ],
    },
    verdict:
      "Choose a VA loan if you or your spouse has qualifying military service — the combination of no down payment, no monthly PMI, and lower interest rates saves most borrowers $200–$500 per month versus a comparable conventional loan with less than 20% down. The one-time funding fee (1.25–3.3%) is typically offset by PMI savings within 18–36 months. Choose a conventional loan when you don't have VA eligibility, when you plan to buy an investment property (VA is primary residence only), or when you can put 20% down and eliminate PMI entirely — at which point the rate difference is smaller and no funding fee applies.",
    sections: [
      {
        heading: "How the VA funding fee compares to conventional PMI",
        content:
          "The most common misconception about the VA loan is that the funding fee makes it more expensive than conventional. In almost every scenario for borrowers with less than 20% down, that's wrong.\n\nHere's the math: A first-time VA borrower with 0% down pays a 2.15% funding fee — $7,525 on a $350,000 loan. A conventional borrower with 5% down pays zero upfront fee but pays PMI of approximately 0.8% per year — $2,660/year or $222/month — until reaching 20% equity, which typically takes 7–12 years on a standard amortization schedule.\n\nOn that $350,000 loan, the VA borrower's one-time funding fee ($7,525) is fully offset by PMI savings in about 3.4 years. After that, the VA borrower saves $222/month indefinitely — and that's before factoring in the lower interest rate on the VA loan itself. Use the [mortgage calculator](/mortgage/) to run the full comparison at your loan amount and down payment.\n\nVeterans with a service-connected disability rating of 10% or more are completely exempt from the funding fee, making the VA loan savings even larger. Surviving spouses of veterans who died in service or from a service-connected disability are also exempt.",
      },
      {
        heading: "VA loan interest rates vs conventional rates",
        content:
          "VA loans consistently carry lower interest rates than conventional mortgages — typically 0.25–0.50 percentage points below comparable 30-year conventional rates. That gap sounds modest, but compounded over 30 years it's substantial: a 0.375% rate advantage on a $400,000 loan saves about $90/month and roughly $32,400 in total interest.\n\nThe rate advantage exists because the Department of Veterans Affairs guarantees 25% of each VA loan against default, which dramatically reduces lender risk. Lenders pass part of that reduced risk to borrowers through lower rates.\n\nNot all lenders price the VA rate advantage equally. Veterans-focused lenders like Navy Federal Credit Union, USAA, and dedicated VA mortgage specialists tend to offer the most competitive rates. Always compare at least three lenders — the gap between the best and worst VA rate offer can exceed the typical VA-vs-conventional rate difference for borrowers with strong credit.\n\nUse the [VA loan calculator](/mortgage/va-loan-calculator/) to model your exact monthly payment and total interest at current rates.",
      },
      {
        heading: "When a conventional loan beats a VA loan",
        content:
          "Despite the VA loan's financial advantages for most eligible borrowers, conventional loans win in specific situations.\n\nInvestment properties: VA loans are strictly limited to primary residences you intend to occupy. If you want to buy a rental property, a vacation home, or a multi-unit building you won't live in, you need a conventional loan. Many veterans use a VA loan for their primary residence and conventional financing for their real estate investment portfolio.\n\nRepeat VA use with equity: The funding fee increases for subsequent VA loan use (3.3% vs 2.15% for first-time users with 0% down). A veteran who can put 20% down on a second or third home purchase may prefer a conventional loan — no funding fee, no PMI (since the down payment eliminates it), and rates that may be competitive at higher credit scores.\n\nCondo complications: Not all condominiums are VA-approved, and the VA approval process for condo communities can be lengthy. In a competitive condo market where a competing conventional offer can close faster, the timing disadvantage may matter. Use the [home affordability calculator](/mortgage/home-affordability-calculator/) to evaluate what you can qualify for under each loan type.",
      },
      {
        heading: "How to qualify for a VA loan: eligibility and the COE",
        content:
          "VA loan eligibility is based on your length and character of military service. The general rules: veterans who served at least 90 consecutive days during wartime or 181 days during peacetime qualify. National Guard and Reserve members need at least 6 years of service or 90 days of active duty under Title 10 or Title 32 orders. Active-duty service members qualify after 90 continuous days. Surviving spouses of eligible veterans may also qualify.\n\nTo use a VA loan, you need a Certificate of Eligibility (COE). Most VA-approved lenders can pull your COE electronically through the VA's portal in minutes as part of the loan application — it rarely requires paperwork on your part.\n\nA key underwriting difference from conventional loans: the VA evaluates residual income — the money left over after all monthly debts and living expenses — in addition to the standard debt-to-income ratio. This more holistic approach makes VA loans more accessible to veterans with higher debt loads than conventional lenders would approve.\n\nThe VA loan benefit can be used repeatedly, but full entitlement is generally restored after selling the prior VA-financed home and repaying the loan. Use the [down payment calculator](/mortgage/down-payment-calculator/) to see how different down payment amounts affect your monthly payment under each loan type.",
      },
    ],
    faqs: [
      {
        question: "Is a VA loan always better than a conventional loan for veterans?",
        answer:
          "For most eligible veterans buying a primary residence with less than 20% down, yes. The VA loan's combination of no PMI, lower rates, and 0% down saves $200–$500/month in most scenarios. Exceptions: investment properties (VA requires primary residence), condos without VA approval, or veterans putting 20%+ down who want to skip the funding fee and have minimal rate difference.",
      },
      {
        question: "What is the VA loan funding fee and who is exempt?",
        answer:
          "The VA funding fee is a one-time charge of 1.25–3.3% of the loan amount, typically rolled into the loan balance. It funds the VA guarantee program so it costs taxpayers nothing. Veterans with a service-connected disability rating of 10% or higher are completely exempt — saving $4,375–$11,550 on a typical $350,000 loan. Purple Heart recipients and surviving spouses of veterans who died in service or from a service-connected disability are also exempt.",
      },
      {
        question: "Can a veteran use a VA loan more than once?",
        answer:
          "Yes. VA loan benefits can be used multiple times. The funding fee increases on subsequent uses without a down payment (3.3% vs 2.15% for first-time users), but the benefit remains available. You can restore full VA entitlement by selling the prior home and repaying the VA loan, or use \"bonus entitlement\" to hold a second VA loan while keeping the first property.",
      },
      {
        question: "Does a VA loan require a down payment?",
        answer:
          "No down payment is required on a VA loan. Veterans can purchase a home up to the conforming loan limit with 0% down, and since 2020 there is no VA loan limit for eligible veterans with full entitlement — meaning you can buy above the conforming loan limit with 0% down. However, making a down payment of 5% or more reduces the funding fee, which lowers your upfront cost.",
      },
    ],
    sources: [
      { label: "U.S. Department of Veterans Affairs — VA home loans", url: "https://www.benefits.va.gov/homeloans/" },
      { label: "VA — VA loan funding fee tables", url: "https://www.benefits.va.gov/homeloans/purchasecashout_fees.asp" },
      { label: "CFPB — VA loan basics", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-va-loan-en-1567/" },
    ],
    relatedComparisons: ["15-year-vs-30-year-mortgage", "fixed-vs-arm-mortgage", "renting-vs-buying"],
    calculatorLinks: [
      { label: "Mortgage calculator", href: "/mortgage/" },
      { label: "VA loan calculator", href: "/mortgage/va-loan-calculator/" },
      { label: "Home affordability calculator", href: "/mortgage/home-affordability-calculator/" },
    ],
  },

  // ─── Tax Attorney vs CPA vs Enrolled Agent ──────────────────────────────
  {
    slug: "tax-attorney-vs-cpa-vs-enrolled-agent",
    title: "Tax Attorney vs CPA vs Enrolled Agent: Who to Hire",
    metaDescription:
      "Tax attorney vs CPA vs enrolled agent compared: credentials, hourly rates, IRS representation rights, and which one to hire for what tax problem.",
    targetKeyword: "tax attorney vs cpa vs enrolled agent",
    optionA: "Tax Attorney",
    optionB: "CPA or Enrolled Agent",
    segment: "Tax Resolution",
    h1: "Tax Attorney vs CPA vs Enrolled Agent: Who to Hire for What",
    intro:
      "A tax attorney is a bar-admitted lawyer who adds attorney-client privilege and can represent you in U.S. Tax Court; a CPA is a state-licensed accountant whose strength is broad accounting and financial-statement depth; and an Enrolled Agent is a federally licensed IRS specialist who is often the most affordable option for straightforward representation. All three have unlimited practice rights before the IRS under Circular 230, but the right choice depends on the shape of your tax problem: criminal or high-stakes litigation calls for a tax attorney, bookkeeping or business tax planning calls for a CPA, and IRS collection cases (installment agreements, Offers in Compromise, penalty abatement) typically call for an EA at $150–$300 per hour.",
    comparisonTable: {
      rows: [
        { dimension: "Credential source", a: "Bar admission (state supreme court); often J.D. + LL.M. in taxation", b: "CPA: state board + college coursework + Uniform CPA Exam. EA: IRS federal license via Special Enrollment Examination or 5+ years IRS experience" },
        { dimension: "IRS practice rights (Circular 230)", a: "Unlimited representation on all matters, all tax years", b: "Unlimited representation on all matters, all tax years" },
        { dimension: "Attorney-client privilege", a: "Full attorney-client privilege for legal advice", b: "Limited §7525 tax-practitioner privilege in non-criminal, civil-only matters; no privilege in criminal cases" },
        { dimension: "Typical hourly rate", a: "$300–$600+", b: "CPA: $250–$500. EA: $150–$300" },
        { dimension: "Offer in Compromise prep", a: "$5,000–$15,000+", b: "$3,000–$7,500" },
        { dimension: "Installment agreement setup", a: "$2,500–$5,000+", b: "$1,500–$3,500" },
        { dimension: "Tax Court representation", a: "Yes (admitted to U.S. Tax Court)", b: "Only if separately admitted (rare)" },
        { dimension: "Criminal tax defense", a: "Yes", b: "No — must refer to a tax attorney" },
        { dimension: "Best fit", a: "Criminal exposure, Tax Court petition, complex Innocent Spouse, offshore issues, appeals with significant dollars", b: "Straightforward collection cases: installment agreements, OIC, penalty abatement, currently not collectible, first-time abate" },
      ],
    },
    verdict:
      "Pick a tax attorney only when you have criminal exposure, a Tax Court petition on the table, a complex Innocent Spouse claim, offshore reporting issues, or an appeal with significant dollars at stake — the price premium buys attorney-client privilege and court admission. For everything else, an Enrolled Agent is usually the right hire: the same unlimited practice rights before the IRS as a CPA or attorney, sharper focus on IRS collection procedures, and 40–60% lower hourly rates. A CPA is the right choice when the tax problem is downstream of a bookkeeping or business-tax error — they can fix the underlying accounting AND handle the IRS notice.",
    sections: [
      {
        heading: "What each credential actually means",
        content:
          "A tax attorney is a J.D.-holding lawyer admitted to a state bar, often with an additional LL.M. in taxation. The bar admission triggers attorney-client privilege — communications with a tax attorney about legal advice are privileged and cannot be compelled in most contexts. Tax attorneys can appear in every court, including U.S. Tax Court, U.S. District Court, and the U.S. Court of Federal Claims.\n\nA CPA (Certified Public Accountant) is licensed by a state board of accountancy after completing 150 semester hours of college coursework, passing the four-section Uniform CPA Examination, and typically 1–2 years of qualifying experience. The CPA license focuses on accounting and auditing; taxation is one of several specialty areas.\n\nAn Enrolled Agent is federally licensed by the IRS itself, either by passing the three-part Special Enrollment Examination (SEE) or by 5+ years of qualifying IRS experience. EAs specialize in taxation — that's the entire scope of the license. Unlike CPAs and attorneys, EA licensure is granted by the IRS and is portable across all 50 states without further requirements.\n\nAll three have 'unlimited practice rights' under IRS Circular 230, meaning they can represent any taxpayer, on any matter, before any IRS office, on any tax period.",
      },
      {
        heading: "The privilege question",
        content:
          "The single most important legal difference is privilege. Attorney-client privilege protects communications with a tax attorney for the purpose of obtaining legal advice, in both civil and criminal contexts. The IRS cannot compel disclosure of privileged communications.\n\nCPAs and Enrolled Agents have a much narrower protection under IRC §7525 (the federally authorized tax practitioner privilege). It applies only in non-criminal civil tax matters before the IRS or federal court. In criminal tax proceedings, §7525 provides zero protection — the IRS can subpoena the entire client file. This is the single biggest reason to hire a tax attorney if criminal exposure is possible.\n\nA practical rule: if the IRS has referred your case to Criminal Investigation Division (CID), or if the potential penalty structure includes fraud (§6663 — 75% of underpayment) or willful failure to file (§7203, a misdemeanor), retain a tax attorney immediately. Any communications you have with a CPA or EA from that point on are subpoena-able.",
      },
      {
        heading: "Cost differences on real tax-resolution work",
        content:
          "For straightforward IRS collection work, the price gap between attorneys and EAs is substantial. Offer in Compromise preparation typically costs $3,000 to $7,500 with an Enrolled Agent or CPA (per practitioner surveys from TaxCure and NAEA members), versus $5,000 to $15,000+ with a tax attorney. Complex or appealed OICs push higher on both sides.\n\nInstallment agreement setup runs $1,500 to $3,500 with an EA/CPA versus $2,500 to $5,000+ with a tax attorney. Penalty abatement (First Time Abate is often a single phone call) runs $500 to $1,500 with an EA/CPA versus $1,000 to $2,500 with an attorney.\n\nThe [tax resolution hub](/tax-resolution/) walks through the specific relief program each situation calls for, and the [IRS payment plan calculator](/tax-resolution/irs-payment-plan-calculator/), [Offer in Compromise calculator](/tax-resolution/offer-in-compromise-calculator/), and [penalty abatement calculator](/tax-resolution/penalty-abatement-calculator/) show what each program is actually worth to you — a lot of straightforward relief is DIY-able if you have the calculator to check the numbers.",
      },
      {
        heading: "Which one to hire, by problem shape",
        content:
          "Hire a tax attorney when: (1) the IRS has issued a criminal referral or you have Fraud Technical Advisor involvement, (2) you're petitioning U.S. Tax Court, (3) you have complex Innocent Spouse Relief facts (§6015 equitable relief cases turn on litigation-quality analysis), (4) offshore reporting issues are involved (FBAR penalties can hit $10,000 per non-willful violation or 50% of account value for willful), or (5) an appeal has enough dollars at risk to justify the premium.\n\nHire a CPA when: (1) bookkeeping or business-tax error caused the IRS problem, (2) you need financial-statement work alongside the tax representation, (3) you have complex business tax situations (S-corp basis, partnership allocations, multi-state issues), or (4) the CPA is already representing you on your annual return.\n\nHire an Enrolled Agent when: (1) it's a routine IRS collection matter (installment agreement, OIC, CNC, penalty abatement, currently not collectible), (2) budget matters and the problem doesn't require litigation, (3) you want a specialist whose entire practice is IRS representation, or (4) you're in the middle of a wage garnishment, bank levy, or automated collection escalation and need someone who lives in this world.",
      },
    ],
    faqs: [
      {
        question: "Can an Enrolled Agent do everything a tax attorney can do with the IRS?",
        answer:
          "Yes and no. Under IRS Circular 230, Enrolled Agents have the same unlimited practice rights before the IRS as attorneys and CPAs — they can represent any taxpayer, on any matter, at any level of the IRS, including Appeals. What they cannot do is appear in U.S. Tax Court (unless separately admitted, which is rare), provide legal advice, or extend full attorney-client privilege. For routine IRS collection cases, an EA can do everything a tax attorney can do at 40–60% lower cost.",
      },
      {
        question: "When do I need a tax attorney instead of a CPA?",
        answer:
          "You need a tax attorney when there is criminal exposure (fraud penalties under §6663, willful failure to file under §7203, or an IRS Criminal Investigation Division referral), when petitioning U.S. Tax Court, when Innocent Spouse Relief under §6015 requires litigation-quality analysis, when offshore reporting issues (FBAR, FATCA) are involved, or when attorney-client privilege matters. The §7525 tax-practitioner privilege that covers CPAs is limited to non-criminal civil matters and evaporates the moment the case turns criminal.",
      },
      {
        question: "How much do tax attorneys, CPAs, and Enrolled Agents charge?",
        answer:
          "Tax attorneys typically charge $300–$600+ per hour and $5,000–$15,000+ for a complete Offer in Compromise. CPAs charge $250–$500 per hour and $3,000–$7,500 for an OIC. Enrolled Agents are the most affordable at $150–$300 per hour and $3,000–$7,500 for an OIC — often at the lower end of that band. First Time Abate penalty relief runs $500–$1,500 with an EA or CPA. All fees vary by market and case complexity.",
      },
      {
        question: "What is an Enrolled Agent and how is it different from a CPA?",
        answer:
          "An Enrolled Agent is a federally licensed IRS specialist. The EA license is granted by the IRS itself after passing the three-part Special Enrollment Examination (or through 5+ years of qualifying IRS experience). It focuses exclusively on taxation and IRS representation. A CPA is state-licensed after passing the four-section Uniform CPA Examination and covers a broader accounting and financial-statement scope. Both have unlimited practice rights before the IRS; both can prepare returns and represent clients in audits, appeals, and collections. EAs tend to focus on tax specifically; CPAs on accounting broadly.",
      },
      {
        question: "Does attorney-client privilege apply to CPAs and Enrolled Agents?",
        answer:
          "No — not in full. CPAs and Enrolled Agents get the limited §7525 tax-practitioner privilege, which applies only in non-criminal civil matters before the IRS or in federal court proceedings. §7525 does not apply in criminal tax proceedings, state tax proceedings, or in matters involving tax shelters. Full attorney-client privilege applies only to communications with a licensed attorney for the purpose of obtaining legal advice. This is why criminal tax exposure requires a tax attorney, not a CPA or EA.",
      },
      {
        question: "Can I represent myself before the IRS instead of hiring a professional?",
        answer:
          "Yes. Any taxpayer can represent themselves before the IRS at every stage — audit, collection, Appeals, and even Tax Court (as a pro se petitioner). For straightforward cases, self-representation is entirely viable: streamlined online installment agreements, First Time Abate requests, and Currently Not Collectible filings are all designed for DIY use. The calculators at the tax resolution hub show you the numbers professionals would run. Hire a professional when the dollars, complexity, or criminal exposure justify the cost.",
      },
    ],
    sources: [
      { label: "IRS — Circular 230: Regulations Governing Practice Before the IRS", url: "https://www.irs.gov/tax-professionals/circular-230-tax-professionals" },
      { label: "IRS — Enrolled Agent Information", url: "https://www.irs.gov/tax-professionals/enrolled-agents" },
      { label: "IRC §7525 — Confidentiality privileges relating to taxpayer communications", url: "https://www.law.cornell.edu/uscode/text/26/7525" },
      { label: "AICPA — What is a CPA?", url: "https://www.aicpa-cima.com/resources/article/what-is-a-cpa" },
      { label: "NAEA — What is an Enrolled Agent?", url: "https://www.naea.org/for-taxpayers/find-an-enrolled-agent" },
    ],
    relatedComparisons: [],
    calculatorLinks: [
      { label: "Tax resolution calculator", href: "/tax-resolution/" },
      { label: "Offer in compromise calculator", href: "/tax-resolution/offer-in-compromise-calculator/" },
      { label: "IRS payment plan calculator", href: "/tax-resolution/irs-payment-plan-calculator/" },
      { label: "Penalty abatement calculator", href: "/tax-resolution/penalty-abatement-calculator/" },
    ],
  },

  // ─── Living Trust vs Will ────────────────────────────────────────────────
  {
    slug: "living-trust-vs-will",
    title: "Living Trust vs Will: Which One Do You Actually Need?",
    metaDescription:
      "Living trust vs will: probate avoidance, cost, privacy, and when a trust is worth it. Attorney and online costs plus 2026 estate tax rules.",
    targetKeyword: "living trust vs will",
    optionA: "Living Trust",
    optionB: "Will",
    segment: "Estate Planning",
    h1: "Living Trust vs Will: Which One Do You Actually Need?",
    intro:
      "A living trust avoids probate entirely and keeps your estate settlement private, but costs $1,500–$5,000 attorney-drafted (or $499–$599 online); a will is cheaper ($300–$2,500 attorney or $0–$299 online) and easier to update, but goes through public probate at your death. Neither reduces federal estate tax (the 2026 $15M exemption is the same either way). You need a living trust when you own real estate in more than one state, have a special-needs dependent, or want to avoid probate for privacy or speed reasons — for most households below the estate tax exemption, a will is enough.",
    comparisonTable: {
      rows: [
        { dimension: "Probate at death", a: "Avoided (assets in trust bypass probate)", b: "Public probate proceeding required" },
        { dimension: "Attorney cost", a: "$1,500–$5,000 typical; $5,000–$10,000+ in CA/HNW metros", b: "$300–$2,500 depending on complexity" },
        { dimension: "Online cost", a: "$499–$599 (Trust & Will); $139 (Nolo WillMaker Plus)", b: "$0 (FreeWill); $129–$299 (LegalZoom / Trust & Will)" },
        { dimension: "Estate tax savings", a: "None — revocable trust is in taxable estate", b: "None — will is in taxable estate" },
        { dimension: "Privacy", a: "Private (not filed in court)", b: "Public record via probate court" },
        { dimension: "Multi-state property", a: "Avoids ancillary probate in each state", b: "Requires ancillary probate per state" },
        { dimension: "Updates during life", a: "Amend the trust anytime you're alive", b: "Codicil or new will (simpler process)" },
        { dimension: "Guardian nomination for minors", a: "Requires a pour-over will alongside the trust", b: "Built into the will directly" },
      ],
    },
    verdict:
      "Choose a will when: you have straightforward assets in one state, no cross-state property, no special-needs dependent, and your net worth is below the federal $15M estate tax exemption. Add a durable POA and healthcare directive, and you're covered for $500–$1,500 attorney or $199–$299 online. Choose a living trust when: you own real estate in multiple states (avoids ancillary probate), you have a special-needs dependent (paired with a Third-Party Special Needs Trust), you want privacy for your estate settlement, or you're in California where probate on any estate over $184,500 gross is statutorily expensive. If your net worth is above the federal exemption OR any state estate tax threshold (Oregon $1M, Massachusetts $2M, Washington $3M, etc.), you need BOTH — a revocable living trust for probate avoidance plus irrevocable trusts (ILIT, dynasty) for tax planning.",
    sections: [
      {
        heading: "What a living trust actually does",
        content:
          "A revocable living trust holds title to your assets during your life — you're both trustee and beneficiary, so nothing changes about your control. At death, a successor trustee distributes the assets according to the trust document, bypassing probate court entirely. That's the whole benefit: probate avoidance. A living trust does NOT reduce estate tax (assets remain in your taxable estate because you retained control), does NOT protect assets from creditors during your life, and does NOT change how retirement accounts or life insurance pass (beneficiary designations override the trust).\n\nThe [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) shows attorney and online costs for revocable trusts and their irrevocable cousins (ILIT, MAPT, dynasty).",
      },
      {
        heading: "What a will does",
        content:
          "A last will and testament directs how your assets pass at death, names an executor to administer the estate, and (critically for parents) nominates a guardian for minor children. It's cheaper, simpler, and easier to update than a trust. The catch: it triggers probate — a public court proceeding to validate the will, pay creditors, and distribute assets. Probate takes 6–18 months typically, is public, and costs 2–7% of estate value depending on state (California's statutory fee schedule is famously expensive).\n\nThe [will cost calculator](/estate-planning/will-cost-calculator/) shows state-specific attorney and online costs, plus each state's execution requirements (witnesses, holographic recognition, self-proving affidavit).",
      },
      {
        heading: "When probate actually matters (and doesn't)",
        content:
          "Probate matters most in three situations: California (statutory attorney fees on estates over $184,500 gross start at 4% of the first $100k and scale down), states with real property in multiple jurisdictions (each requires its own ancillary probate), and estates where privacy matters (probate records are public). Probate matters less in most other states, where informal or summary procedures apply to modest estates and the process is administrative rather than adversarial.\n\nA useful test: look up your state's small-estate threshold (Texas $75,000, Utah $100,000, Wyoming $200,000, most states $25,000–$50,000). Below that, simplified procedures apply and a trust adds little value. Above it, the trust's probate-avoidance benefit becomes real.",
      },
      {
        heading: "What both instruments miss",
        content:
          "Wills and trusts both control what a will/trust controls — but the biggest financial assets often pass through beneficiary designations that override both. 401(k) accounts, IRAs, and life insurance pass to the named beneficiary regardless of what your will or trust says. Bank and brokerage accounts with Transfer-on-Death (TOD) designations do the same. Real estate with joint tenancy with rights of survivorship passes automatically. Before drafting either a will or a trust, do a beneficiary designation review — that's often where most of the estate actually is.",
      },
    ],
    faqs: [
      {
        question: "Should I have a will or a living trust?",
        answer:
          "Most households need a will. Add a living trust when: you own real estate in more than one state (avoids ancillary probate in each state), you have a special-needs dependent (paired with a Third-Party Special Needs Trust to preserve SSI/Medicaid), you want your estate settled privately (probate is public), or you're in California where probate is statutorily expensive. Below the federal $15M estate tax exemption and state exemption thresholds, a living trust is a probate-avoidance tool, not a tax-avoidance tool.",
      },
      {
        question: "Does a living trust save on estate tax?",
        answer:
          "No — a revocable living trust does not reduce estate tax. Assets in a revocable trust remain in your taxable estate because you retained control (you can amend or dissolve the trust). The 2026 federal exemption is $15M per individual regardless of whether you use a will or a trust. Only irrevocable trusts (ILIT, dynasty, MAPT) move assets out of the taxable estate — and those require attorney drafting and permanent transfer of control.",
      },
      {
        question: "How much cheaper is a will than a living trust?",
        answer:
          "Attorney-drafted, a will runs $300–$2,500 depending on complexity, while a revocable living trust runs $1,500–$5,000 — roughly 3–5× the will cost. Online, the gap is smaller: FreeWill offers a will for $0, Trust & Will individual will is $199 vs. individual trust $499. Add trust funding ($500–$2,000 for deed recording and account retitling) and the trust total climbs further. Below the estate tax exemption and outside of the specific trust-benefit situations (multi-state property, special needs, privacy), the extra cost buys probate avoidance you may not need.",
      },
      {
        question: "Does a living trust replace a will?",
        answer:
          "No — you need both. A living trust holds the assets you've funded into it, but any assets NOT funded into the trust still need a will to direct their distribution and name an executor. That will is called a 'pour-over will' — it 'pours over' any missed assets into the trust at death. You also need the will to nominate a guardian for minor children (a nomination in a trust document is not the same). Plan on a will + a trust as a pair, not either/or.",
      },
      {
        question: "Can I set up a living trust online?",
        answer:
          "Yes, for revocable living trusts with straightforward facts. Trust & Will ($499 individual / $599 couple), LegalZoom Living Trust (~$279), and Nolo Quicken WillMaker Plus ($139, includes RLT template) all produce valid RLTs. Online is not appropriate for irrevocable trusts (ILIT, MAPT, dynasty), Medicaid planning under the 5-year lookback, blended families with complex distributions, business interests, or cross-state property with unusual titling. Attorney-drafted becomes worth it when the facts stop fitting a fill-in-the-blank template.",
      },
    ],
    sources: [
      { label: "IRS — Estate Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax" },
      { label: "LegalZoom — Cost to Set Up a Living Trust (2026)", url: "https://www.legalzoom.com/articles/cost-to-set-up-a-living-trust" },
      { label: "American College of Trust and Estate Counsel (ACTEC)", url: "https://www.actec.org/" },
      { label: "Uniform Law Commission — Uniform Probate Code", url: "https://www.uniformlaws.org/" },
    ],
    relatedComparisons: ["online-will-vs-lawyer", "revocable-vs-irrevocable-trust"],
    calculatorLinks: [
      { label: "Estate planning calculator", href: "/estate-planning/" },
      { label: "Will cost calculator", href: "/estate-planning/will-cost-calculator/" },
      { label: "Living trust cost calculator", href: "/estate-planning/living-trust-cost-calculator/" },
      { label: "Estate tax calculator", href: "/estate-planning/estate-tax-calculator/" },
    ],
  },

  // ─── Online Will vs Lawyer ────────────────────────────────────────────────
  {
    slug: "online-will-vs-lawyer",
    title: "Online Will vs Lawyer: Which Should You Use in 2026?",
    metaDescription:
      "Online will vs lawyer compared: cost, validity, state execution rules, and when each is the right choice. Trust & Will, LegalZoom, FreeWill, Nolo.",
    targetKeyword: "online will vs lawyer",
    optionA: "Online Will Service",
    optionB: "Lawyer",
    segment: "Estate Planning",
    h1: "Online Will vs Lawyer: When Each Is the Right Choice",
    intro:
      "An online will from Trust & Will, LegalZoom, FreeWill, or Nolo produces a legally valid last will and testament in every U.S. state (with Louisiana requiring an extra notary step under La. Civ. Code art. 1577), costs $0–$299 for the will itself, and works for most simple-to-moderate estates. A lawyer costs $300–$7,500+ depending on state and complexity, and is worth it for blended families, business interests, testamentary trusts with age-based distributions, or estates above state estate tax thresholds. The trap most people miss isn't which tool — it's whether the will was executed with the state's required formalities (witnesses, signing sequence, self-proving affidavit).",
    comparisonTable: {
      rows: [
        { dimension: "Cost — simple will", a: "$0–$299 (FreeWill / Trust & Will / LegalZoom Basic)", b: "$300–$800 attorney-drafted" },
        { dimension: "Cost — moderate will (married + kids)", a: "$199–$299 (Trust & Will couple)", b: "$750–$2,500 attorney-drafted" },
        { dimension: "Cost — complex will (blended, business)", a: "Not appropriate — attorney required", b: "$2,500–$7,500+" },
        { dimension: "Legal validity", a: "Valid in every state when signed with required formalities", b: "Valid — attorney supervises execution" },
        { dimension: "State execution supervision", a: "You handle witnesses and signing yourself", b: "Attorney office serves as witness venue" },
        { dimension: "Louisiana notarial testament", a: "Trust & Will / LegalZoom do NOT default to Louisiana's notary requirement — verify or use a Louisiana attorney", b: "Attorney handles notary + 2 witnesses in one appointment" },
        { dimension: "Guardian nomination for minors", a: "Standard field on Trust & Will, LegalZoom, Nolo", b: "Included" },
        { dimension: "Testamentary trust with age distributions", a: "Not supported by most online tools", b: "Custom-drafted by attorney" },
        { dimension: "Ongoing updates", a: "Free with membership (Trust & Will) or repurchase", b: "Codicil $150–$400 or new will" },
        { dimension: "Peace of mind / professional review", a: "Attorney add-on $299 (Trust & Will)", b: "Included" },
      ],
    },
    verdict:
      "Choose an online service when: you have straightforward assets, a clear list of beneficiaries, no blended family or business interests, and you're not in Louisiana (which requires a notary at signing). Trust & Will ($199/$299) and LegalZoom Basic ($129/$229) are the leaders; FreeWill is genuinely free and produces a valid last will and testament in every state. Choose a lawyer when: you have a blended family, business interests, a testamentary trust with age-based distributions to minor children, contested beneficiaries, or your estate is near or above a state estate tax threshold (Oregon $1M, Massachusetts $2M, etc.). Hybrid option: use Trust & Will's attorney review add-on ($299) or Rocket Lawyer's membership-based attorney consultation to get professional eyes on an online-drafted document without full attorney rates.",
    sections: [
      {
        heading: "Are online wills legally binding?",
        content:
          "Yes — a will produced by Trust & Will, LegalZoom, FreeWill, or Nolo is a legally valid last will and testament in every U.S. state, provided you execute it with the state's required formalities. Those formalities are: (1) two witnesses present at signing (essentially every state), (2) a notary for the self-proving affidavit (48 states + DC), and (3) Louisiana's additional notarial testament requirement under La. Civ. Code art. 1577. Colorado and North Dakota uniquely accept notarization instead of two witnesses. About 27 states also recognize holographic (handwritten, unwitnessed) wills as a fallback. Online tools produce documents that meet these formalities — you just need to follow the signing instructions the service provides.",
      },
      {
        heading: "When online is genuinely enough",
        content:
          "Online is enough for the majority of households: single with standard heirs, married couples with a clear beneficiary structure, single parents naming a guardian for minor children, and moderate-complexity estates without business interests or blended families. Trust & Will's couple plan ($299) covers a married-with-kids will package with guardian nomination, POA, and healthcare directive. LegalZoom Basic ($129/$229) covers the same for less. FreeWill is $0 and produces valid documents in every state. The signing instructions the services provide are specific and correct — the primary source of online-will failures is user error at signing (skipping witnesses, wrong signing sequence), not defects in the drafted document.",
      },
      {
        heading: "When you actually need a lawyer",
        content:
          "Hire an attorney when the facts stop fitting the fill-in-the-blank template. Concrete triggers: blended family (children from multiple marriages, second spouse), business ownership (LLC operating agreement interactions, buy-sell provisions), a testamentary trust for minor children with age-based distributions past 18 (online tools handle basic guardianship but not multi-tranche trusts), contested beneficiaries (a disinherited child or an unusual bequest), out-of-state property with unusual titling (community property with a common-law state residence), or an estate near or above a state estate tax threshold that requires credit-shelter or QTIP planning. Louisiana residents should generally use a Louisiana attorney because of the notarial testament requirement most online tools don't default to.",
      },
      {
        heading: "The 'attorney review' hybrid",
        content:
          "Trust & Will offers a $299 attorney review add-on. Rocket Lawyer's membership includes attorney consultations. LegalZoom Premium ($299 individual / $399 couple) includes attorney consultation. These hybrid options give you attorney eyes on an online-drafted document at meaningfully lower cost than full attorney drafting. They're a reasonable middle path when your situation is close to but not clearly in the DIY-appropriate box.",
      },
    ],
    faqs: [
      {
        question: "Is an online will legally binding?",
        answer:
          "Yes — an online will from Trust & Will, LegalZoom, FreeWill, or Nolo is a legally valid last will and testament in every U.S. state, provided you execute it with the state's required formalities. Louisiana requires an extra notary step under La. Civ. Code art. 1577 that most online tools don't default to. The primary source of online-will failures is user error at signing (skipping witnesses, wrong signing sequence, forgetting the self-proving affidavit) — not defects in the drafted document.",
      },
      {
        question: "How much cheaper is an online will than a lawyer?",
        answer:
          "Online will services are 60–95% cheaper than attorneys. FreeWill is $0, LegalZoom Basic is $129/$229, Trust & Will is $199/$299, Nolo Quicken WillMaker is $99–$209. Attorney-drafted wills run $300–$800 for simple facts and $750–$2,500 for moderate complexity. In high-cost states like California and New York, attorney costs are 35% above the national baseline (simple $405–$1,080, moderate $1,013–$3,375). For simple-to-moderate facts, the cost delta buys you nothing beyond peace of mind — the online-drafted document itself is legally identical.",
      },
      {
        question: "When should I use a lawyer instead of an online will?",
        answer:
          "Use a lawyer when your situation has any of: blended family with children from multiple marriages, business interests requiring specific succession planning, testamentary trust for minor children with age-based distributions, contested beneficiaries, out-of-state property with unusual community-property/common-law interactions, estate above a state estate tax threshold (Oregon $1M, Massachusetts $2M, Washington $3M, etc.), or you're in Louisiana (notarial testament requirement). Consider the attorney-review hybrid (Trust & Will $299 add-on, Rocket Lawyer membership, LegalZoom Premium $299) if your situation is borderline.",
      },
      {
        question: "Do online wills cover all 50 states?",
        answer:
          "Yes — Trust & Will, LegalZoom, and FreeWill produce valid last wills and testaments in all 50 states plus DC. Nolo Quicken WillMaker is sold as software in every state. The state-specific variations they handle: witness count (2 in essentially every state; Colorado and North Dakota also accept notarization alone), self-proving affidavit availability (48 states + DC), and Louisiana's notarial testament requirement (2 witnesses PLUS notary under La. Civ. Code art. 1577 — some online tools don't default to this, so verify or use a Louisiana attorney). Follow the state-specific signing instructions the service provides.",
      },
      {
        question: "Can I do a will and living trust online?",
        answer:
          "Yes for both, though the trust is more complex. Trust & Will's trust plan ($499 individual / $599 couple) produces a valid revocable living trust plus a pour-over will and supporting documents. LegalZoom Living Trust is ~$279. Nolo Quicken WillMaker Plus ($139) includes an RLT template. Online is not appropriate for irrevocable trusts (ILIT, MAPT, dynasty), Medicaid planning, or estates above state tax exemption thresholds where credit-shelter planning is needed. For those, attorney-drafted is warranted.",
      },
    ],
    sources: [
      { label: "Uniform Law Commission — Uniform Probate Code (witness rules)", url: "https://www.uniformlaws.org/" },
      { label: "Cornell LII — Holographic will overview", url: "https://www.law.cornell.edu/wex/holographic_will" },
      { label: "Legaltemplates 2026 — 909-firm estate planning cost study", url: "https://legaltemplates.net/resources/estate-planning/cost-of-estate-planning/" },
      { label: "Nolo — How Much Will a Lawyer Charge to Write Your Will?", url: "https://www.nolo.com/legal-encyclopedia/how-much-will-lawyer-charge-write-your-will.html" },
    ],
    relatedComparisons: ["living-trust-vs-will", "revocable-vs-irrevocable-trust"],
    calculatorLinks: [
      { label: "Will cost calculator", href: "/estate-planning/will-cost-calculator/" },
      { label: "Living trust cost calculator", href: "/estate-planning/living-trust-cost-calculator/" },
      { label: "Estate planning calculator", href: "/estate-planning/" },
    ],
  },

  // ─── Revocable vs Irrevocable Trust ──────────────────────────────────────
  {
    slug: "revocable-vs-irrevocable-trust",
    title: "Revocable vs Irrevocable Trust: Which Do You Need?",
    metaDescription:
      "Revocable vs irrevocable trust compared: probate avoidance, estate tax, Medicaid asset protection, cost, and when each type is the right choice.",
    targetKeyword: "revocable vs irrevocable trust",
    optionA: "Revocable Trust (RLT)",
    optionB: "Irrevocable Trust",
    segment: "Estate Planning",
    h1: "Revocable vs Irrevocable Trust: What's the Difference?",
    intro:
      "A revocable trust (also called a revocable living trust or RLT) can be changed or dissolved by you at any time — you retain full control, and it avoids probate but does NOT reduce estate tax, protect assets from creditors, or shield assets from Medicaid. An irrevocable trust permanently transfers ownership out of your control and, in exchange, can achieve real tax and asset-protection goals: an ILIT removes life insurance from your taxable estate, a Medicaid Asset Protection Trust (MAPT) shields assets from long-term-care spend-down (subject to the 5-year lookback), and a dynasty trust transfers wealth across generations. Cost: revocable $1,500–$5,000; ILIT $2,500–$4,000; MAPT $3,000–$6,000; dynasty $5,000–$10,000+.",
    comparisonTable: {
      rows: [
        { dimension: "Control during life", a: "You retain full control (trustee + beneficiary)", b: "Permanently transferred to trustee (with limits)" },
        { dimension: "Can be changed/dissolved", a: "Yes, anytime", b: "No (with narrow exceptions)" },
        { dimension: "Avoids probate", a: "Yes", b: "Yes (assets not in your name at death)" },
        { dimension: "Reduces estate tax", a: "No — assets remain in taxable estate", b: "Yes — moves assets out of taxable estate" },
        { dimension: "Protects from creditors", a: "No — you still own the assets legally", b: "Yes, with proper structure (asset protection trusts)" },
        { dimension: "Shields from Medicaid spend-down", a: "No", b: "Yes via MAPT (5-year lookback applies)" },
        { dimension: "Federal income tax", a: "Grantor trust — you report income on your 1040", b: "Separate taxpayer — files Form 1041; typically higher rates" },
        { dimension: "Attorney cost", a: "$1,500–$5,000 (CA/HNW: $5,000–$10,000+)", b: "ILIT $2,500–$4,000; MAPT $3,000–$6,000; dynasty $5,000–$10,000+" },
        { dimension: "Online option", a: "Trust & Will $499/$599; Nolo WillMaker Plus $139", b: "Not appropriate — attorney-drafted only" },
        { dimension: "Primary use case", a: "Probate avoidance + privacy", b: "Estate tax reduction + asset protection" },
      ],
    },
    verdict:
      "Choose a revocable trust when your goal is probate avoidance and privacy — you want to control your assets during life and keep them out of probate court at death. Most households below the $15M federal exemption and state estate tax thresholds need only a revocable trust (if any trust at all). Choose an irrevocable trust when your goal is estate tax reduction, asset protection, or Medicaid planning. Specific fits: ILIT for anyone with life insurance whose taxable estate is above the federal or state exemption; MAPT for anyone within 5 years of possibly needing Medicaid for long-term care; dynasty trust for generational wealth transfer above the GST exemption ($15M in 2026). Most estate plans that use irrevocable trusts ALSO use a revocable trust for the household's non-transferred assets — the two are complements, not either/or.",
    sections: [
      {
        heading: "The control tradeoff",
        content:
          "The single biggest difference is control. With a revocable trust, you're the trustee and the beneficiary during your life — you can amend the trust, add or remove assets, change beneficiaries, and dissolve it entirely. That flexibility is why revocable trusts don't reduce estate tax: the IRS looks at whether you retained control, and a revocable trust means yes. With an irrevocable trust, you permanently transfer ownership to a trustee, who manages the assets according to the trust document for the beneficiaries. Once funded, you generally can't amend or dissolve it, take assets back, or serve as trustee (with narrow exceptions for grantor-trust structures). That loss of control is what makes the tax and asset-protection benefits real.",
      },
      {
        heading: "Which trust reduces estate tax",
        content:
          "Only irrevocable trusts move assets out of your taxable estate. A revocable trust does not — assets in a revocable trust are counted in the estate at your death because you retained control. Common irrevocable structures: ILIT (Irrevocable Life Insurance Trust) holds a life insurance policy and receives the death benefit outside your estate; dynasty trust holds assets for multiple generations and uses the $15M GST exemption to skip generation-skipping tax; gifting trust receives lifetime gifts and removes future appreciation from your estate. Each has specific requirements — ILITs have a 3-year rule under IRC §2035(a) if transferring an existing policy, and dynasty trusts require state law that permits perpetual trusts (Delaware, South Dakota, Nevada, Wyoming lead here).",
      },
      {
        heading: "Which trust helps with Medicaid",
        content:
          "Only a Medicaid Asset Protection Trust (MAPT) — a specific type of irrevocable trust — can shield assets from Medicaid spend-down. Medicaid applies a 5-year lookback under 42 U.S.C. §1396p: transfers within 5 years of applying for Medicaid trigger a penalty period equal to the transferred amount divided by the state's monthly regional rate. A MAPT funded more than 5 years before application avoids the penalty and shields the assets. A revocable trust provides zero Medicaid protection because you still control the assets — they count against eligibility. Plan MAPT funding at least 5 years before any anticipated long-term-care need.",
      },
      {
        heading: "Cost and complexity",
        content:
          "Revocable trusts are attorney-drafted at $1,500–$5,000 (California and HNW metros $5,000–$10,000+) or DIY through Trust & Will ($499/$599) or Nolo WillMaker Plus ($139). Irrevocable trusts require attorney drafting — DIY tools cannot produce them because the legal language must precisely disclaim retained rights that would otherwise trigger inclusion in your estate. ILIT $2,500–$4,000; MAPT $3,000–$6,000; dynasty trust $5,000–$10,000+. Add annual Form 1041 tax return preparation ($500–$2,000) for irrevocable trusts because they file their own tax returns.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between revocable and irrevocable trusts?",
        answer:
          "A revocable trust can be changed or dissolved by you at any time; you retain full control. Its primary benefit is probate avoidance. It does NOT reduce estate tax, protect assets from creditors, or shield assets from Medicaid. An irrevocable trust permanently transfers ownership out of your control. In exchange, it can reduce estate tax (ILIT, dynasty, gifting trusts), protect assets (asset-protection trusts, DAPTs), or shield assets from Medicaid (MAPT). Cost is higher — irrevocable trusts require attorney drafting.",
      },
      {
        question: "Does a revocable trust save estate tax?",
        answer:
          "No — a revocable trust does not save estate tax. Assets in a revocable trust remain in your taxable estate because you retained control. The 2026 federal exemption is $15M per individual regardless of whether you use a revocable trust. Only irrevocable trusts move assets out of the taxable estate. If your net worth is above the federal exemption or a state estate tax threshold, you need irrevocable structures (ILIT, dynasty trust, gifting trust) for the tax benefit — a revocable trust alone doesn't help.",
      },
      {
        question: "Does a revocable trust protect assets from Medicaid?",
        answer:
          "No — a revocable trust provides zero Medicaid protection because you still control the assets. They count against your Medicaid eligibility just as if they were in your own name. Only a Medicaid Asset Protection Trust (MAPT) — a specific type of irrevocable trust — can shield assets, and only if funded more than 5 years before applying for Medicaid (the federal 5-year lookback under 42 U.S.C. §1396p). Attorney cost is $3,000–$6,000. Plan MAPT funding at least 5 years before any anticipated long-term-care need.",
      },
      {
        question: "Which is more expensive: revocable or irrevocable trust?",
        answer:
          "Irrevocable trusts are typically more expensive: ILIT $2,500–$4,000, MAPT $3,000–$6,000, dynasty trust $5,000–$10,000+. Revocable trusts run $1,500–$5,000 attorney-drafted for typical facts (California and high-net-worth metros $5,000–$10,000+). Online options exist for revocable trusts (Trust & Will $499/$599, Nolo $139) but not for irrevocable — those require attorney drafting because the legal language must precisely disclaim retained rights. Add annual Form 1041 preparation ($500–$2,000/year) for irrevocable trusts.",
      },
      {
        question: "Do I need both a revocable and irrevocable trust?",
        answer:
          "Often, yes — they're complements, not either/or. A common structure: revocable living trust holds the household's day-to-day assets for probate avoidance during life and privacy at death, while irrevocable trusts hold specific assets targeted for tax reduction (ILIT for life insurance, dynasty for generational transfer) or asset protection (MAPT for Medicaid, DAPT for creditor protection). Above the federal $15M exemption or a state estate tax threshold, most estate plans use both. Below those thresholds, a revocable trust alone is usually enough.",
      },
    ],
    sources: [
      { label: "IRS — Estate Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax" },
      { label: "IRC §2035 — Three-year rule for ILIT transfers", url: "https://www.law.cornell.edu/uscode/text/26/2035" },
      { label: "42 U.S.C. §1396p — Medicaid 5-year lookback", url: "https://www.law.cornell.edu/uscode/text/42/1396p" },
      { label: "ACTEC — American College of Trust and Estate Counsel", url: "https://www.actec.org/" },
      { label: "Medicaid.gov — Estate Recovery", url: "https://www.medicaid.gov/medicaid/eligibility-policy/estate-recovery/index.html" },
    ],
    relatedComparisons: ["living-trust-vs-will", "online-will-vs-lawyer"],
    calculatorLinks: [
      { label: "Living trust cost calculator", href: "/estate-planning/living-trust-cost-calculator/" },
      { label: "Estate tax calculator", href: "/estate-planning/estate-tax-calculator/" },
      { label: "Estate planning calculator", href: "/estate-planning/" },
      { label: "Medicaid spend-down calculator", href: "/elder-care/medicaid-spend-down-calculator/" },
      { label: "Long-term care cost calculator", href: "/elder-care/long-term-care-cost-calculator/" },
    ],
  },

  // ─── Prenup vs Postnup ────────────────────────────────────────────────────
  {
    slug: "prenup-vs-postnup",
    title: "Prenup vs Postnup: Timing, Cost, and Enforceability",
    metaDescription:
      "Prenup vs postnup compared: timing, cost, enforceability standards, state law (UPAA/UPMAA), and when each is the right choice.",
    targetKeyword: "prenup vs postnup",
    optionA: "Prenup (Premarital)",
    optionB: "Postnup (Postmarital)",
    segment: "Estate Planning",
    h1: "Prenup vs Postnup: Timing, Cost, and Enforceability",
    intro:
      "A prenuptial agreement is signed before marriage and is enforceable in every U.S. state under the Uniform Premarital Agreement Act (UPAA, ~28 states) or state case law; a postnuptial agreement is signed after marriage and is enforceable under a stricter standard because spouses owe each other a fiduciary duty by then, making full disclosure and independent counsel effectively mandatory. Both cost roughly the same per party ($1,500–$10,000+ depending on state), but postnups face higher enforcement risk. California requires a 7-day waiting period before signing prenups (Cal. Fam. Code §1615(c)(2)(B)) and independent counsel for waivers — rules that apply to postnups too under §1615(c). If you're already married, the postnup is still available; if you're not yet married, the prenup is easier to enforce.",
    comparisonTable: {
      rows: [
        { dimension: "Timing", a: "Signed before marriage", b: "Signed after marriage" },
        { dimension: "Enforceability standard", a: "UPAA in ~28 states + case law elsewhere", b: "Higher standard — fiduciary duty applies" },
        { dimension: "Full financial disclosure", a: "Required under UPAA (or written waiver)", b: "Effectively mandatory due to fiduciary duty" },
        { dimension: "Independent counsel", a: "Strongly recommended; required in CA for waivers", b: "Effectively required for enforceability" },
        { dimension: "Cost — moderate case", a: "$4,000–$14,000 total ($2,000–$7,000/party)", b: "$4,000–$16,000 total ($2,000–$8,000/party)" },
        { dimension: "California 7-day rule", a: "Applies (§1615(c)(2)(B))", b: "Applies to postnups too" },
        { dimension: "Uniform Act coverage", a: "UPAA (1983) or UPMAA (2012)", b: "UPMAA covers postnups; UPAA does not" },
        { dimension: "Court skepticism at enforcement", a: "Moderate", b: "High — courts scrutinize for coercion" },
        { dimension: "What it can't enforce", a: "Child custody, child support, unconscionable terms", b: "Same" },
      ],
    },
    verdict:
      "Choose a prenup when you can — sign before marriage. Prenups are cheaper to enforce (lower court skepticism), covered by UPAA in 28 states, and don't face the fiduciary-duty overlay that postnups do. Postnups are the right choice when: you're already married and something material changed (inheritance, business start, significantly different net worth), you want to formalize what would otherwise happen at divorce, or you have a specific reason (estate planning, second-marriage protection, business succession) that arose after marriage. In both cases, both parties should have independent counsel, full disclosure is essential, and California's 7-day waiting period applies. If you're in a UPMAA state (Colorado, North Dakota), postnups are more clearly on equal footing with prenups than in UPAA-only states.",
    sections: [
      {
        heading: "The fiduciary duty difference",
        content:
          "The big legal difference between prenups and postnups: spouses owe each other a fiduciary duty; engaged couples don't. That duty means postnups face a higher enforceability bar. Full financial disclosure isn't just recommended for a postnup — it's effectively mandatory, because concealment breaches the fiduciary duty and voids the agreement. Independent counsel for each spouse becomes essentially required because a court will look skeptically at any postnup where one spouse dominated the process. California's Cal. Fam. Code §1615(c) requires independent counsel for waivers in both prenups and postnups, but the practical bar for postnup enforcement is higher across all states.",
      },
      {
        heading: "When each makes sense",
        content:
          "Prenup makes sense before any first marriage where one party has meaningful premarital assets or a business, and before any second (or later) marriage where children from a prior marriage need protection, inheritance rights need to be specified, or spousal support waivers are on the table. Postnup makes sense when: a material change occurred (large inheritance, business start, significantly asymmetric net worth), the couple wants to formalize property division without divorcing (sometimes called a 'reconciliation agreement' when it accompanies marriage counseling), or estate planning requires specific asset allocation between spouses. A postnup can also convert community-property state assets to separate property (California, Texas, Washington) or vice versa.",
      },
      {
        heading: "Cost and enforceability tradeoffs",
        content:
          "Per-party attorney costs are roughly the same for prenups and postnups at the same complexity — NYC $2,500–$10,000+ per party, California $3,000–$10,000+, Florida and Texas $1,500–$5,000, national baseline $1,500–$8,000. But postnups almost always require both parties to have independent counsel (due to fiduciary duty overlay), so plan on 2× the per-party number for total cost. Enforceability tradeoff: prenups can survive with somewhat less procedural rigor because there's no fiduciary duty; postnups need full disclosure, independent counsel, and reasonable substantive terms to hold up at enforcement.",
      },
      {
        heading: "What neither can enforce",
        content:
          "Neither a prenup nor a postnup can enforce child-custody or child-support decisions — universally void as the court applies its best-interest standard. Neither can enforce terms that encourage divorce (void in most states). Neither can enforce unconscionable terms — UPAA states measure unconscionability at execution, while some non-UPAA states (New Jersey, California in some contexts) also measure at enforcement. Personal or lifestyle clauses (weight-loss requirements, chore lists, sexual frequency) are generally unenforceable, though non-financial breach penalties are sometimes upheld. Everything else — property division, spousal support waivers or caps, debt allocation, business protection, inheritance rights — can be enforced in both agreement types with proper drafting.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between a prenup and a postnup?",
        answer:
          "A prenuptial agreement is signed before marriage; a postnuptial agreement is signed after marriage. Both cover the same subjects — property division, spousal support waivers, debt allocation, inheritance rights — but postnups face a higher enforceability standard because spouses owe each other a fiduciary duty by the time they sign. That fiduciary duty makes full financial disclosure and independent counsel effectively mandatory for a postnup, while prenups can survive with somewhat less procedural rigor.",
      },
      {
        question: "How much does a postnup cost compared to a prenup?",
        answer:
          "Per-party attorney costs are similar. National baseline: $1,500–$3,500 per party simple, $2,500–$5,000 moderate, $4,000–$8,000 complex. High-cost states run higher — NYC $2,500–$10,000+ per party, California $3,000–$10,000+. Both agreement types usually require both parties to retain their own attorneys (roughly 2× the per-party number for total cost). Postnups tend toward the higher end of the per-party range because the enforceability standard is stricter and drafting must be more careful.",
      },
      {
        question: "Are postnups enforceable?",
        answer:
          "Yes, but under a stricter standard than prenups. Postnups require full financial disclosure (mandatory due to fiduciary duty between spouses), independent counsel for each spouse (effectively required), and terms that are not unconscionable at execution (and, in some states, not unconscionable at enforcement). UPMAA (2012) explicitly covers postnups; UPAA (1983) does not. Confirmed UPMAA adopters are Colorado and North Dakota. In UPAA-only and non-UPAA states, postnups are enforced under case law with generally higher court scrutiny than prenups face.",
      },
      {
        question: "Does California's 7-day waiting period apply to postnups?",
        answer:
          "Yes. Cal. Fam. Code §1615(c) applies to both prenuptial and postnuptial agreements. The 7-day waiting period between final agreement presentation and signing (§1615(c)(2)(B)) applies to both, and the independent-counsel requirement for waivers of spousal-support or property rights (§1615(c)) applies to both. In practice, California postnups need the same procedural runway as California prenups: at least 7 days between final draft and signing, both parties represented by their own attorneys.",
      },
      {
        question: "Can a postnup convert community property?",
        answer:
          "Yes — in community property states (Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, Wisconsin) a postnup can convert community-property assets to separate property or vice versa. This is sometimes called a 'transmutation agreement' and requires specific formalities — most states require the transmutation to be in writing and signed by the spouse whose interest is being adversely affected. In California, Fam. Code §852 requires an express declaration of transmutation; ambiguity is resolved against transmutation. Consult a family-law attorney in your community property state before attempting this.",
      },
    ],
    sources: [
      { label: "Uniform Law Commission — Premarital and Marital Agreements Act (UPMAA)", url: "https://www.uniformlaws.org/committees/community-home?CommunityKey=2e456584-938e-4008-ba0c-bb6a1a544400" },
      { label: "Cornell LII — Uniform Premarital Agreement Act", url: "https://www.law.cornell.edu/wex/uniform_premarital_agreement_act" },
      { label: "Cal. Fam. Code §1615", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=1615." },
      { label: "Community property in the United States (Wikipedia)", url: "https://en.wikipedia.org/wiki/Community_property_in_the_United_States" },
    ],
    relatedComparisons: ["living-trust-vs-will"],
    calculatorLinks: [
      { label: "Prenup cost calculator", href: "/estate-planning/prenup-cost-calculator/" },
      { label: "Estate planning calculator", href: "/estate-planning/" },
    ],
  },

  // ─── Probate vs Trust ────────────────────────────────────────────────────
  {
    slug: "probate-vs-trust",
    title: "Probate vs Trust: The Real Cost + Timeline Tradeoff",
    metaDescription:
      "Probate vs trust compared: probate cost 3-8% of estate + 6-24 months vs trust setup $1,500-$5,000 during life. Real numbers by state.",
    targetKeyword: "probate vs trust",
    optionA: "Probate",
    optionB: "Revocable Living Trust",
    segment: "Probate",
    h1: "Probate vs Trust: What Each One Actually Costs",
    intro:
      "Probate is the default court process for settling an estate at death — attorney fees, executor commission, court costs, and 6-24 months of settlement time, running roughly 3-8% of gross estate. A revocable living trust is the standard alternative — $1,500-$5,000 attorney or $499-$599 online, set up during life, and it avoids probate entirely because trust assets don't pass through court. For estates above the state's small-estate threshold (California $208,850; Arizona $200,000; Oregon $275,000), the trust math wins decisively: a $750,000 California estate faces $36,000+ in statutory probate fees vs $2,025-$6,750 for a revocable living trust that would have avoided it entirely.",
    comparisonTable: {
      rows: [
        { dimension: "When you pay", a: "At death (deducted from estate)", b: "During life (one-time setup)" },
        { dimension: "Attorney fee", a: "Statutory in 9 states (CA §10810: 4%/3%/2%/1%/0.5%); reasonable in ~41 states (2-4% of gross)", b: "$1,500-$5,000 typical; $5,000-$10,000+ in CA/HNW; $499-$599 online" },
        { dimension: "Executor / trustee fee", a: "2-4% commission (CA + IA + WY: same statutory schedule)", b: "Typically 0 during life (grantor is trustee); successor trustee compensated only if formal" },
        { dimension: "Court + publication", a: "$400-$1,500 uncontested; $900-$4,500 contested", b: "None" },
        { dimension: "Timeline", a: "6-24 months uncontested; 2-5 years contested", b: "Weeks to distribute at death" },
        { dimension: "Privacy", a: "Public record via probate court", b: "Private (trust not filed in court)" },
        { dimension: "Multi-state property", a: "Requires ancillary probate per state ($2k-$8k each + 6-12 months)", b: "Trust holds all property; no ancillary needed" },
        { dimension: "Small-estate procedure", a: "Available if estate ≤ state threshold; weeks + <$1,000", b: "Same trust setup — usually not worth it below threshold" },
        { dimension: "Estate tax", a: "Doesn't reduce; assets in taxable estate", b: "Doesn't reduce; assets remain in taxable estate (revocable)" },
        { dimension: "Changes after setup", a: "N/A (probate is one-shot)", b: "Amend anytime during life" },
      ],
    },
    verdict:
      "Choose probate (i.e., don't set up a trust) when: your estate is at or below the state's small-estate threshold (California $208,850; Arizona $200,000; Oregon $275,000; most others $25k-$100k) AND you don't own real property in multiple states. Below the threshold, small-estate procedures process in weeks for under $1,000 — cheaper than trust setup. Choose a revocable living trust when: your estate is above the small-estate threshold, you own real property in more than one state (avoids ancillary probate), you're in a slow probate state (California, New York), or you want privacy for your estate settlement. The trust setup cost ($1,500-$5,000) is meaningfully less than probate cost on any middle-class-or-larger estate. Above the federal $15M estate tax exemption or a state exemption threshold, you also need IRREVOCABLE trusts (ILIT, MAPT, dynasty) for tax planning — a revocable trust alone doesn't reduce estate tax.",
    sections: [
      {
        heading: "The math on a $750,000 California estate",
        content:
          "Under Cal. Prob. Code §10810, attorney statutory fee on $750,000: 4% × $100k ($4,000) + 3% × $100k ($3,000) + 2% × $550k ($11,000) = $18,000. Under §10800, executor gets the same $18,000. Court filing + publication + certified copies: $600-$1,500. Total probate cost: $36,600-$37,500 over 15-30 months (12-24 base + 3-6 for real estate under Cal. Prob. Code §9100's 4-month creditor claim period plus urban court backlog).\n\nCompare to a California revocable living trust: attorney-drafted $2,025-$6,750 (national $1,500-$5,000 × California's 1.35 cost multiplier) or Trust & Will online $499-$599. Add funding $500-$2,000. Total trust setup: $2,525-$8,750, done today. Net savings if the trust is in place at death: $28,000-$35,000 plus 12+ months of estate settlement time. The [probate fee calculator](/probate/fee-calculator/) computes this exactly for your specific state and estate value.",
      },
      {
        heading: "When probate is the right choice",
        content:
          "Not every estate needs a trust. Below the state's small-estate threshold, probate via affidavit is cheaper than trust setup. California §13100 processes estates ≤ $208,850 in weeks for a few hundred dollars in fees. Arizona's threshold expanded to $200,000 personal / $300,000 real in September 2025. Oregon allows $275,000 combined. Every state has some form of simplified procedure; the threshold determines whether trust setup pays off.\n\nThe other case where probate makes sense: single-property, single-state, single-heir estates where the parties want court oversight of asset transfer. Some heirs prefer a clean court order over trust-based distribution — probate provides that public record and creditor cutoff at the end of the claim period.",
      },
      {
        heading: "The multi-state trap",
        content:
          "Ancillary probate is the single strongest argument for a trust. Every state where the decedent owned titled real property (real estate, mineral interests, sometimes vehicles/boats) requires its own probate proceeding at death — the primary probate opens in the domicile state, then each additional state runs its own ancillary probate. Cost is $2,000-$8,000 per additional state, and timeline adds 6-12 months per state.\n\nA revocable living trust with title to all real properties eliminates this entirely. Nothing 'dies' with the grantor because the trust owns everything; no ancillary probate is triggered. For anyone owning a vacation home, inherited family cabin, or investment property in another state, this alone typically justifies the trust cost.",
      },
      {
        heading: "What a revocable trust doesn't do",
        content:
          "A revocable living trust does NOT reduce estate tax. Assets in a revocable trust remain in your taxable estate because you retained control. The 2026 federal exemption is $15M per individual (permanent under OBBBA P.L. 119-21) regardless of trust structure. It also does not protect assets from your creditors during life or from Medicaid spend-down. For those, you need irrevocable structures — see the [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) for ILIT, MAPT, and dynasty trust costs.",
      },
    ],
    faqs: [
      {
        question: "Is a trust cheaper than probate?",
        answer:
          "For estates above the state's small-estate threshold, yes — dramatically so. Trust setup runs $1,500-$5,000 attorney or $499-$599 online, one-time during life. Probate at death runs 3-8% of gross estate, or roughly $10,000-$60,000 for typical estates. In statutory-fee states (California under Cal. Prob. Code §10810, Florida under §733.6171, and 7 others), the gap is even larger because probate fees are fixed by percentage tiers on gross estate. For a $750,000 California estate, probate costs about $36,000 vs trust setup at $2,025-$6,750.",
      },
      {
        question: "How much does probate cost?",
        answer:
          "3-8% of gross estate in most states for uncontested probate, or roughly $10,000-$60,000 for typical estates. In California (Cal. Prob. Code §10810), both attorney and executor each get the same statutory percentage schedule (4%/3%/2%/1%/0.5%), so total statutory fees roughly double. Florida sets attorney fees under §733.6171 with a stepped base and tiered percentages. The other ~41 states use reasonable-fee models at 2-4% of gross estate. Contested probate hits $50,000+ almost everywhere.",
      },
      {
        question: "Does a living trust avoid probate?",
        answer:
          "Yes, for assets properly funded into the trust. The trust holds title to your assets during your life (with you as trustee and beneficiary), and at death a successor trustee distributes them according to the trust document — bypassing probate court entirely. The catch: the trust MUST be funded. Assets not retitled into the trust still go through probate. Trust funding (retitling deeds, brokerage accounts, etc.) is a $500-$2,000 additional cost or DIY step that most trust failures skip.",
      },
      {
        question: "How long does probate take?",
        answer:
          "6-12 months for uncontested probate in most states, 9-18 months with real estate, 12-24 months in California and New York (statutory creditor claim periods + court backlogs), and 3-6 months in Texas (independent administration under Tex. Est. Code §401.001). Contested probate takes 2-5 years. A revocable living trust distributes to beneficiaries in weeks after death — no court proceeding required for trust assets. See the [probate timeline calculator](/probate/timeline-calculator/) for state-specific ranges.",
      },
      {
        question: "Do I need a trust or is a will enough?",
        answer:
          "A will is enough when your estate is at or below the state's small-estate threshold (California $208,850, Arizona $200,000, Oregon $275,000, most others $25k-$100k) AND you don't own real property in multiple states. Add a durable POA and healthcare directive to the will and you're covered for $500-$1,500 attorney or $199-$299 online. Add a revocable living trust when you're above the small-estate threshold, own multi-state real estate, or want probate avoidance for privacy or speed. See the [living trust vs will comparison](/compare/living-trust-vs-will/) for the full framework.",
      },
      {
        question: "Does a living trust save estate tax?",
        answer:
          "No — a revocable living trust does NOT reduce estate tax. Assets remain in your taxable estate because you retained control. The 2026 federal exemption is $15M per individual (permanent under OBBBA P.L. 119-21) regardless of trust structure. Only irrevocable trusts move assets out of the taxable estate: ILIT for life insurance, dynasty trust for generational transfer, gifting trusts for appreciating assets. See the [estate tax calculator](/estate-planning/estate-tax-calculator/) for federal + state exposure, and the [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) for irrevocable trust costs.",
      },
    ],
    sources: [
      { label: "Cal. Prob. Code §10810 — attorney statutory schedule", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=10810&lawCode=PROB" },
      { label: "Fla. Stat. §733.6171 — attorney presumed reasonable", url: "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0733/Sections/0733.6171.html" },
      { label: "NY SCPA §2307 — executor commissions", url: "https://www.nysenate.gov/legislation/laws/SCP/2307" },
      { label: "LegalZoom — Cost to Set Up a Living Trust (2026)", url: "https://www.legalzoom.com/articles/cost-to-set-up-a-living-trust" },
      { label: "IRS — Estate Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax" },
      { label: "American College of Trust and Estate Counsel (ACTEC)", url: "https://www.actec.org/" },
    ],
    relatedComparisons: ["living-trust-vs-will", "revocable-vs-irrevocable-trust"],
    calculatorLinks: [
      { label: "Probate calculator", href: "/probate/" },
      { label: "Probate fee calculator", href: "/probate/fee-calculator/" },
      { label: "Probate vs trust calculator", href: "/probate/cost-vs-trust-calculator/" },
      { label: "Living trust cost calculator", href: "/estate-planning/living-trust-cost-calculator/" },
    ],
  },
];

export const COMPARISON_BY_SLUG = Object.fromEntries(
  COMPARISONS.map((c) => [c.slug, c])
);
