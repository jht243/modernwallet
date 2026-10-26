# ROW PROMPT — what-is-an-index-fund (guide page, ModernWallet)

## PAGE
- route: /guides/what-is-an-index-fund/
- slug: what-is-an-index-fund
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 1,100 words minimum. A shorter page of listed facts beats padding.
- register: operator
- updated date: 2026-10-26

## KEYWORDS + INTENT
- primary keyword: what is an index fund (12,100/mo, KD 37, DataForSEO measured)
- secondary keywords (DataForSEO measured): how to invest in index funds (2,400/mo); how to invest in index funds for beginners (480/mo); are index funds a good investment (320/mo); index fund pros and cons (210/mo). Head term from Search Console: "index investment funds" (74,000/mo).
- intent: A beginner who keeps hearing "just buy an index fund" wants to know what one is, how it works, what it costs and whether it fits them, before opening an account.
- SERP: winnable, no forum domination, an AI Overview is present (cites Fidelity, Vanguard, NerdWallet, Chase, Investor.gov), so the opening must be a directly extractable answer.
- reader question: "What is an index fund and how does it work?" [PAA 3/6 on-topic definition and how it works ("How exactly does an index fund work?", "What are the top 3 index funds?", "Are index funds a good investment?"); related searches: "what is an index fund and how does it work", "what is an index fund for dummies", "how to invest in index funds"]
- answer: An index fund is a pooled fund (a mutual fund or ETF) that holds the securities in a market index, such as the S&P 500, in the same proportions as the index, instead of having a manager pick investments. Because nobody is picking, fees are usually lower. (shape: definition + mechanism; definition is the dominant pattern here so a definitional opening is licensed)
- answer placement: section 1 "How an Index Fund Works": the introText answers in its first two sentences, and section 1 gives the mechanism (index, fund holds the same stocks in the same proportions, fund tracks it, low trading).

## SECTION COVERAGE (in this order)
1. How an Index Fund Works: the mechanism, S&P 500 example, passive vs active in one short contrast.
2. Index Fund vs ETF vs Mutual Fund: one fund can be an index fund AND be an ETF or a mutual fund; the index fund describes the strategy, ETF and mutual fund describe the wrapper. Link the three comparison pages.
3. What Index Funds Cost: expense ratio; the modeled fee-drag table from the fact list (our internal modeling, state the inputs so a reader can reproduce it in the investment growth calculator); provider-listed expense ratios of named funds from the fact list, flagged as at time of writing.
4. The Downsides of Index Funds: no protection from market declines, you get the whole market including weak parts, no way to beat the index, fees still vary, some funds track narrow indexes. (PAA: "What are the downsides of investing in index funds?")
5. How to Invest in an Index Fund: the steps (pick the account type, pick the index, compare the expense ratio, choose fund or ETF, set a recurring amount); no personalized advice; link /roundup/best-index-funds/ and /compare/roth-ira-vs-index-fund/.
6. Our Takeaway: an index fund suits a reader who wants broad, low-cost exposure for money they will not need for years; say what the fee modeling shows, name the evidence basis ("In our internal modeling with the same engine as our investment growth calculator, ..."), and the conditions that change the answer (money needed within a few years, a wish to hold single stocks, high-fee funds, tax account type). Informational, not advice.
FAQ (use these, answers from the fact list only): What is an index fund in simple terms? / How does an index fund work? / Are index funds a good investment? / What are the downsides of index funds? / Is an index fund the same as an ETF? / How do I invest in an index fund? / Do index funds have fees?

## INTERNAL LINKS YOU MAY USE (exact paths, first mention only)
- /roundup/best-index-funds/
- /compare/index-fund-vs-etf/
- /compare/index-fund-vs-mutual-fund/
- /compare/etf-vs-mutual-fund/
- /compare/roth-ira-vs-index-fund/
- /guides/what-is-a-good-expense-ratio/
- /investing/sp500-calculator/
- /investing/investment-growth-calculator/

## `tools` FIELD
Pick 2-3 from: /investing/sp500-calculator/ (label "S&P 500 calculator"), /investing/investment-growth-calculator/ (label "Investment growth calculator"), /investing/compound-interest-calculator/ (label "Compound interest calculator").

## SOURCES
Populate `sources` ONLY from the closed URL list (FINRA Mutual Funds; FINRA Risk). Cite nothing for the modeled figures beyond saying they come from our own engine.

## Hard prohibitions
- No fabricated statistics, fees, dates or thresholds. Only figures on the closed fact list.
- No individualized tax or investment advice; point to a licensed financial advisor or CPA for the reader's own situation.
- Never link the page to itself. Do not name a brokerage not on the fact list. Do not state historical return numbers or that index funds "beat" anything beyond what the fact list says.
- Do not call the modeled figures "tested" or "testing"; they are internal modeling/calculation.

# CLOSED FACT LIST
**Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the fund provider's page.**

Source: FINRA, Mutual Funds (https://www.finra.org/investors/investing/investment-products/mutual-funds)
- Some funds seek to replicate a market index. Stock index funds are passively managed funds that attempt to replicate the performance of a specific stock market index by investing in the stocks held by that index.
- For example, the manager of an index fund that tracks the S&P 500 typically buys a portfolio that includes all of the stocks in that index in the same proportions as they are represented in the index.
- Many large-cap stock funds use the S&P 500 Index as the benchmark for their performance. A fund that invests across market capitalizations might use the Dow Jones Wilshire 5000 Total Stock Market Index, which measures more than 5,000 small-, mid- and large-company stocks. Bond funds measure themselves against a broad bond index that tracks the yields of many bonds.
- Because index funds don't need to retain active professional managers, and because their holdings aren't as frequently traded, they normally have lower operating costs than actively managed funds. However, fees vary from index fund to index fund, so the return on these funds varies as well.
- Some index funds, called enhanced index funds, are hybrids: managers pick and choose among the investments the index tracks to try to beat it. Their fees might be higher than the average for index funds, and the approach may not do as well as the overall index.

Source: FINRA, Risk (https://www.finra.org/investors/investing/investing-basics/risk)
- Investments carry risk and real markets rise and fall; historical returns are not guaranteed. A fund that tracks an index will fall when that index falls.

Source: our own modeling with the site's investment engine (src/lib/investment.ts, the same engine as the investment growth calculator and S&P 500 calculator). Method: $10,000 starting balance, $500 added every month, a 7% annual return before fees, the fund's expense ratio subtracted from that return (so 0.03% fee = 6.97% net, 0.50% = 6.50% net, 1.00% = 6.00% net), monthly compounding, one fixed return every year, no taxes. A reader can reproduce each row by entering those inputs in the investment growth calculator. It is a modeled scenario, not a measured fund result.
- After 10 years: 0.03% fee gives $106,436.44; 0.50% fee gives $103,323.41; 1.00% fee gives $100,133.64. Total put in is $70,000.00 in every case.
- After 20 years: 0.03% fee gives $299,663.83; 0.50% fee gives $281,774.93; 1.00% fee gives $264,122.49. Total put in is $130,000.00.
- After 30 years: 0.03% fee gives $686,828.96; 0.50% fee gives $623,007.02; 1.00% fee gives $562,483.27. Total put in is $190,000.00.
- Difference at 30 years between the 0.03% and 1.00% fee cases: $124,345.69. Difference between 0.03% and 0.50%: $63,821.94.
- What the modeling does not show: real markets do not return a fixed 7%, it ignores taxes, and it does not say any fund will return 7%. The point is only the size of the gap that a fee difference leaves, with everything else equal.

Source: expense ratios already published on our best index funds roundup (/roundup/best-index-funds/), as listed by the fund providers at time of writing; the reader should verify current figures on the provider's page.
- VOO (Vanguard S&P 500 ETF): 0.03%. FXAIX (Fidelity 500 Index Fund, a mutual fund): 0.015%. FZROX (Fidelity ZERO Total Market Index Fund): 0.00%, available at Fidelity. VTI (Vanguard Total Stock Market ETF): 0.03%.
- VOO and FXAIX both track the S&P 500; one is an ETF and one is a mutual fund. S&P 500 funds hold 500 large U.S. companies. A total-market fund like VTI holds thousands of U.S. stocks of all sizes.
- "Index fund" describes the strategy (track an index); "ETF" and "mutual fund" describe how the fund is packaged and traded. ETFs trade on an exchange during the day; mutual funds are priced once a day after markets close. Both can be index funds.
- Fund minimums vary by provider; the reader should check the provider.

Source: site pages already published
- Index funds held in a taxable account can produce dividends and capital gains taxed in the year received; in a tax-advantaged account such as an IRA or 401(k) taxes are deferred or, with a Roth, may be avoided on qualified withdrawals. Rules vary by account; the reader should confirm with a tax professional.
