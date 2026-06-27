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
];

export const COMPARISON_BY_SLUG = Object.fromEntries(
  COMPARISONS.map((c) => [c.slug, c])
);
