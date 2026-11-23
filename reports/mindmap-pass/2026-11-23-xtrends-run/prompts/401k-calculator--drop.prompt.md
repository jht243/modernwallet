# TASK: add ONE new section to the existing 401(k) calculator page /retirement/401k-calculator/
Add the section `## What a Market Drop Does to Your 401(k) Balance`. It is placed directly under the calculator, ahead of the existing "How it's calculated" section, so it must answer the reader's question first.
reader question: "What does a 10% to 20% market drop do to my 401(k), and should I sell?"
answer: A 10% to 20% drop leaves 90% to 80% of the balance and needs an 11.11% to 25.00% gain to get back; FINRA's turbulent-market guidance points to goals, diversification and avoiding impulsive moves; whether to sell depends on your time horizon, which this page cannot judge.
answer placement: section 1 (this section is the first section after the calculator).

Required shape, in this order, about 350 to 450 words in total:
1. Sentence 1 is the direct answer in one short sentence (the 10% to 20% figures). The next sentence says what we did in plain words: "In our internal modeling, we applied 10%, 20% and 30% drops to a hypothetical $100,000 balance and worked out the gain each one needs to recover." Keep that attribution natural; it is calculation, never testing.
2. The pipe table with columns: Market Drop | Balance After | Gain Needed to Recover | Years to Recover at 7% . Rows 10%, 20%, 30% using the numbers below. Directly after the table, one sentence with the conditions: hypothetical $100,000 balance, constant 7% yearly return (the calculator's default), no new contributions, fees, taxes or inflation, and real returns vary from year to year.
3. A short lead-in sentence and a bulleted list of the FINRA process points (goals, diversify, avoid impulsive moves, dollar-cost averaging), each attributed to FINRA and each saying what it does for the reader. Link FINRA on first mention and define it: Financial Industry Regulatory Authority (FINRA).
4. Write a short paragraph (no colon-label) that opens "Based on our internal modeling," and gives the conditional conclusion: a drop of this size is recoverable arithmetically, a longer time horizon gives it room, and a shorter one (withdrawals needed within a few years) can make waiting a poor fit. State plainly this is general information and the page cannot judge your time horizon or goals.
5. One sentence for who this is not for (someone who must withdraw within the next few years or whose balance sits in one holding should talk to a registered professional) and what would change the answer (a change in your time horizon or goals).
6. The LAST sentence is a concrete next step: enter your own balance in the calculator above, then see the [portfolio rebalancing calculator](/portfolio-rebalancing-calculator/) to check how your mix of investments looks. Do not attribute rebalancing guidance to FINRA.

# CLOSED FACT LIST (calculated, our internal modeling; units USD, percent, years)
- Hypothetical starting balance $100,000. Return assumption 7% per year constant (this is the 401(k) calculator's default return). Contributions, fees, taxes, inflation ignored.
- 10% drop: balance after $90,000; loss $10,000; gain needed to recover 11.11%; about 1.6 years at 7%.
- 20% drop: balance after $80,000; loss $20,000; gain needed to recover 25.00%; about 3.3 years at 7%.
- 30% drop: balance after $70,000; loss $30,000; gain needed to recover 42.86%; about 5.3 years at 7%.
- Why the gain is bigger than the drop: after a loss you hold a smaller base, so the recovery percentage is d / (1 - d).
- Counterexample (state it): if you must withdraw within a year or two you cannot wait 3.3 years for a 20% drop to recover at 7%. If you keep contributing, new money buys at lower prices, which can shorten recovery.
- FINRA (Financial Industry Regulatory Authority) page "Investor Tips for Turbulent Markets" says: clarify your financial goals and tie them to your long-term plan; diversify across and within asset classes (avoid too much in one investment, asset class or sector); avoid impulsive moves in volatile markets and focus on your future; dollar-cost averaging (investing a fixed amount on a regular schedule) can reduce emotional decision-making; you cannot control market swings.
- FINRA does NOT say that selling locks in losses and gives no rebalancing rules on that page. Never attribute either to FINRA.

# CLOSED URL LIST (external)
https://www.finra.org/investors/insights/tips-turbulent-market

# INTERNAL ROUTES you may link
/portfolio-rebalancing-calculator/ (Portfolio Rebalancing Calculator), /retirement/401k-early-withdrawal-calculator/ (401k Early Withdrawal Calculator), /guides/how-to-choose-a-financial-advisor/ (how to choose a financial advisor)

# OUTPUT CONTRACT (enrichment of an EXISTING page; this is NOT a new page)
- Output markdown only. Exactly one `## ` heading (Title Case) followed by the prose. No H1. No front matter. No code fences.
- Any table is a GitHub-style pipe table (header row, separator row, body rows) on its own lines.
- Write at a 7th to 8th grade reading level, in the site's editorial "we" voice (operator register). Address the reader as "you" only as a reader, never assume what they own.
- Zero em-dashes. No semicolons joining clauses. No "honest". No "not X, but Y" flourish. Never write "the vendor/the platform/the tool/the company" for a named subject. Link the first mention of every named organization with a markdown link using ONLY URLs from the CLOSED URL LIST or the INTERNAL ROUTES list. Do not invent URLs.
- Use ONLY facts and numbers from the CLOSED FACT LIST. Anything not on it, you do not know. Do not add statistics, dates, quotes, sponsor names, or news.
- Paragraphs are at most 3 sentences. Vary sentence length. Three or more parallel items go in a list.
- Do not mention this page, this article, or the reader's search. Do not use a Conclusion or Summary heading.
- Do NOT claim we tested anything. The only first-party basis is our internal modeling (calculation). Never write "we tested", "in our testing", or "tested".

# REVIEWER GUARDRAILS (must respect)
- No personalized sell or hold advice. Conditional on time horizon and goals only.
- No TESTED or testing claims. Label the work "our internal modeling".
- Hypothetical $100,000 and the 7% assumption must sit beside the numbers.
