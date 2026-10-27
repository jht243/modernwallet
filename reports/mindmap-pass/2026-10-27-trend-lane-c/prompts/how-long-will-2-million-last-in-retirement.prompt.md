# ROW PROMPT — how-long-will-2-million-last-in-retirement (guide page, ModernWallet)

## PAGE
- route: /guides/how-long-will-2-million-last-in-retirement/
- slug: how-long-will-2-million-last-in-retirement
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 1,200 words minimum. A shorter page of listed facts beats padding.
- register: operator
- updated date: 2026-10-27

## KEYWORDS + INTENT
- primary keyword: how long will 2 million last in retirement (590/mo, KD 0, DataForSEO measured)
- secondary keyword (DataForSEO measured): how long will 2 million dollars last in retirement (50/mo)
- intent: A retiree or near-retiree with about $2,000,000 wants the years it lasts, and whether living on the interest alone works.
- SERP: winnable but forum-heavy (Reddit and Facebook), AI Overview present (cites CNBC, AgeMy, Holland Capital, Yahoo Finance, SmartAsset), so the opening must be a directly extractable answer with figures.
- reader question: "How long will $2 million last in retirement?" [PAA 3/6 on-topic (what a $2M retirement looks like, how many years $1M lasts, live off the interest); 3/6 off-topic stats (401k average at 65, wealthy, how many 60-year-olds have it); ac 9/9 question forms]
- answer: It lasts anywhere from about 10 years to more than 45 years: at a flat $8,000 a month it lasts about 20.8 years at a 0% real return, 27 years at 2% and 44.9 years at 4%, and at 4% real the return alone covers $6,666.67 a month without touching the balance. (shape: figure + verdict with break-even)
- answer placement: section 1 "How Long $2,000,000 Lasts at Different Monthly Spending Levels": introText answers in its first two sentences; section 1 has the years table (GFM pipe table) and break-even.

## SECTION COVERAGE (in this order)
1. How Long $2,000,000 Lasts at Different Monthly Spending Levels: table, attribution, break-even.
2. Can You Live on the Interest Alone: interest-only income at 2 to 5% real, the 4% rule as reported by the Trinity Study ($6,666.67 a month); who this is not for.
3. How Much You Can Spend for 20, 25, 30 and 35 Years: fixed-horizon table.
4. What Changes the Years: taxes, spending that rises faster than inflation, sequence risk, other income, couples (the model counts household spending; no couple-specific data), what would change our answer; link the $1,000,000 guide for the smaller balance.
5. Our Takeaway.
FAQ (answers from the fact list only): What does a $2 million retirement look like? (answer: only the monthly spending levels in the fact list) / Can I live off the interest on $2 million? / How many years will $1 million last in retirement? (one-sentence answer + link to the $1,000,000 guide; the $2,000,000 results are not simply double the years: the same years need double the spending) / How long will $2 million last for a couple? / How long will $2 million last with Social Security?

## ATTRIBUTION (required, per the evidence contract)
Basis: CALCULATED. Beside the first table, one or two natural sentences in the form: what we did -> what we found -> how a reader can check it. Pattern (adapt the wording): "In our internal modeling, we ran $2,000,000 through the same engine as our withdrawal calculator at four real returns and six monthly spending levels to see how many years each lasts. Using flat withdrawals in today's dollars, ..." and say the inputs are listed so a reader can reproduce each row in the linked calculators. Never say "we tested", "testing", "tested", or imply a product trial, a client conversation, a survey or a measured result. Name the 4% rule's origin as the reported Trinity Study, not ours. Do not repeat the attribution cue elsewhere except once in Our Takeaway ("Based on our internal modeling ...").
## TAKEAWAY (the last substantive section, named "Our Takeaway", before FAQs; informational, not advice)
For a 30-year retirement, $2,000,000 supports a flat monthly draw of about $5,560 with no growth, about $7,390 at 2% real and about $9,550 at 4% real. Living on the return alone needs a real return close to the spending rate: at 4% real the return covers $6,666.67 a month and leaves the balance intact; at 2% real only $3,333.33. It fits a reader whose planned spending sits under those levels; it changes with taxes, spending that rises faster than inflation and early market losses. Basis: our internal modeling (calculated).

## INTERNAL LINKS YOU MAY USE (exact paths, first mention only)
- /investing/withdrawal-calculator/
- /retirement/retirement-income-calculator/
- /retirement/social-security-retirement-calculator/
- /guides/retirement-withdrawal-strategies/
- /guides/how-long-will-150k-last-in-retirement/
- /guides/how-long-will-1-million-last-in-retirement/
- /guides/is-3-million-enough-to-retire-at-40/

## `tools` FIELD
Pick 2-3 from: /investing/withdrawal-calculator/ (label "Withdrawal calculator"), /retirement/retirement-income-calculator/ (label "Retirement income"), /retirement/social-security-retirement-calculator/ (label "Social Security").

## SOURCES
Populate `sources` ONLY from the closed URL list (the AAII Trinity Study article). Cite nothing for the modeled figures beyond saying they come from our own engine.

## Hard prohibitions
- No fabricated statistics, rates, dates, limits or thresholds. Only figures on the closed fact list. Do NOT state any Social Security benefit amount, any tax bracket, any market return percentage as history, or what share of Americans hold a given balance.
- No individualized investment, tax or retirement advice; point to a licensed financial advisor or CPA for the reader's own situation. Disclaimer text, if any, only as the last element, never in the intro.
- Never link the page to itself. Do not name any brokerage or fund company.
- Do not call the modeled figures "tested" or "testing"; they are internal modeling/calculation.
- Do not claim neutrality, independence or lack of a financial interest.

# CLOSED FACT LIST
**Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the source.**

Source: our own modeling with the site's investment engine (src/lib/investment.ts: effectiveMonthlyRate and the same monthly loop as withdrawalSchedule and maxSustainableWithdrawal, the engine behind the withdrawal calculator). Reproduction script and output are saved in the repo (evidence packet). Method: a flat monthly withdrawal in today's dollars taken at the end of each month; the balance earns a REAL annual return (return after inflation) compounded monthly at the annual rate divided by 12; no taxes, no fees, no Social Security or other income, one fixed return every year (no market ups and downs). Checked against the closed-form payout formula: 0 mismatches across 48 scenarios. This is a calculated, modeled scenario, not a measured result and not a forecast.
- A real return is the return after inflation. As an example of the arithmetic only: a 7% nominal return with 3% inflation is a real return of about 3.9% (1.07 / 1.03 - 1 = 3.88%). The model does not predict what returns or inflation will be.
- Why real dollars matter: holding the withdrawal flat in today's dollars means the actual dollar amount rises with inflation each year, so the model matches a retiree who keeps the same buying power. A calculator that holds the dollar withdrawal flat without growth (for example the site's withdrawal calculator, which uses a nominal return) will show different years for the same inputs.
- Age arithmetic: living to 90 means 35 years of withdrawals from age 55, 30 years from age 60, and 25 years from age 65.
- What the model leaves out: market swings (a bad run of returns early in retirement can empty a balance sooner than a fixed average return shows, called sequence-of-returns risk), taxes on withdrawals from traditional 401(k) and IRA balances, healthcare and long-term-care costs, and spending that changes over time.

Modeled results for a starting balance of $2,000,000 (years until the balance reaches zero):
- $6,000 a month from $2,000,000: 0% real return: 27.8 years; 2% real return: 40.6 years; 4% real return: does not run out in the model (the monthly withdrawal is no more than the monthly return, so the balance never reaches zero); 5% real return: does not run out in the model (the monthly withdrawal is no more than the monthly return, so the balance never reaches zero).
- $6,666.67 a month from $2,000,000: 0% real return: 25 years; 2% real return: 34.8 years; 4% real return: does not run out in the model (the monthly withdrawal is no more than the monthly return, so the balance never reaches zero); 5% real return: does not run out in the model (the monthly withdrawal is no more than the monthly return, so the balance never reaches zero).
- $8,000 a month from $2,000,000: 0% real return: 20.8 years; 2% real return: 27 years; 4% real return: 44.9 years; 5% real return: does not run out in the model (the monthly withdrawal is no more than the monthly return, so the balance never reaches zero).
- $10,000 a month from $2,000,000: 0% real return: 16.7 years; 2% real return: 20.3 years; 4% real return: 27.6 years; 5% real return: 35.9 years.
- $12,000 a month from $2,000,000: 0% real return: 13.9 years; 2% real return: 16.3 years; 4% real return: 20.3 years; 5% real return: 23.8 years.
- $16,000 a month from $2,000,000: 0% real return: 10.4 years; 2% real return: 11.8 years; 4% real return: 13.5 years; 5% real return: 14.8 years.
- Highest flat monthly withdrawal that uses $2,000,000 up in exactly 20 years: 0% real: $8,333.33 a month; 2% real: $10,117.67 a month; 4% real: $12,119.61 a month; 5% real: $13,199.11 a month.
- Highest flat monthly withdrawal that uses $2,000,000 up in exactly 25 years: 0% real: $6,666.67 a month; 2% real: $8,477.09 a month; 4% real: $10,556.74 a month; 5% real: $11,691.80 a month.
- Highest flat monthly withdrawal that uses $2,000,000 up in exactly 30 years: 0% real: $5,555.56 a month; 2% real: $7,392.39 a month; 4% real: $9,548.31 a month; 5% real: $10,736.43 a month.
- Highest flat monthly withdrawal that uses $2,000,000 up in exactly 35 years: 0% real: $4,761.90 a month; 2% real: $6,625.26 a month; 4% real: $8,855.49 a month; 5% real: $10,093.75 a month.
- Interest-only income (monthly withdrawal equal to the monthly real return, balance stays at the starting amount): 2% real: $40,000 a year, $3,333.33 a month; 3% real: $60,000 a year, $5,000 a month; 4% real: $80,000 a year, $6,666.67 a month; 5% real: $100,000 a year, $8,333.33 a month.

Source: Cooley, Hubbard and Walz, Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable, AAII Journal (the "Trinity Study") (https://www.aaii.com/journal/article/retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable). REPORTED, not our test.
- The study tested historical periods and reported that withdrawing about 4% of the starting balance in the first year, then raising that dollar amount with inflation, lasted 30 years in most of the historical periods tested for portfolios with a large share in stocks. This is the origin of the "4% rule". It is a historical result, not a guarantee, and it covers a 30-year horizon.
- On $1,000,000 the 4% rule is $40,000 in year one, which is $3,333.33 a month. On $2,000,000 it is $80,000 in year one, which is $6,666.67 a month.
