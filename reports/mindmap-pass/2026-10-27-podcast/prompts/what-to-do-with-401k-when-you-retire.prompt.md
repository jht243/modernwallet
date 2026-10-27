# ROW PROMPT — what-to-do-with-401k-when-you-retire (guide page, ModernWallet)

## PAGE
- route: /guides/what-to-do-with-401k-when-you-retire/
- slug: what-to-do-with-401k-when-you-retire
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 1,200 words minimum. A shorter page of listed facts beats padding.
- register: operator
- updated date: 2026-10-27

## KEYWORDS + INTENT
- primary keyword: what to do with your 401k when you retire (260/mo, KD 7, DataForSEO measured, US, 2026-10-27)
- secondary keywords (Google Autocomplete completions, observed 2026-10-27, no tool volume): what can you do with your 401k when you retire; what to do with your 401k after you retire; where do you put your 401k when you retire; what to do with 401k when you retire early
- intent: A person who has retired or is about to leave their last employer wants to know which choices they have for the money in the employer 401(k), and which choice carries a tax trap.
- SERP: winnable but forum-dominated (Reddit, YouTube, Facebook in the top 10), AI Overview present (cites Reddit, BlackRock, Fidelity, Northwestern Mutual, Vanguard), so the opening must be a directly extractable answer; IRS page one result (irs.gov) is also in the top 10.
- reader question: "What are my options for my 401(k) when I retire?" [PAA 3/6 on-topic (what to do after leaving a job, where to put retirement money after retiring, what a good balance is at 65); 3/6 off-topic (the "$1000 a month rule", how much to retire comfortably, share of people with $1,000,000); ac 23/23 question forms]
- answer: You have four IRS-recognised choices: leave the money in the plan (if the plan allows it), move it by direct rollover to an IRA or another employer plan, take it as cash, or (for a Roth IRA) convert it; the choice that costs people money is a check made out to you, because the plan must withhold 20% and you have 60 days to replace it. (shape: list of options with the pick-boundary)
- answer placement: section 1 "Your Four Options for a 401(k) at Retirement": introText answers in its first two sentences; section 1 lays out the options as a GFM pipe table (columns: Option, What happens to taxes, What to watch) from the fact list.

## SECTION COVERAGE (in this order)
1. Your Four Options for a 401(k) at Retirement: leave it in the plan / direct rollover to an IRA or new employer plan / take the cash / roll or convert to a Roth IRA (taxable conversion). Table plus the direct answer.
2. Why a Check Made Out to You Costs More: the 20% mandatory withholding, the 60-day window, the worked arithmetic table ($50,000, $100,000, $250,000) from the calc packet, with the attribution.
3. When the Rule of 55 Changes the Answer: if you separate from service during or after the year you turn 55, 401(k) distributions are exempt from the 10% additional tax before 59½, but the IRS table shows the same exception does not apply to an IRA. So a reader under 59½ who needs the money should think before rolling everything into an IRA. Link /compare/rule-of-55-vs-72t/ and /retirement/401k-early-withdrawal-calculator/.
4. Required Withdrawals and What Leaving It in the Plan Does: RMD start age as the IRS states it, the in-plan delay while still working (not for 5% owners), Roth IRAs have no lifetime RMDs, the excise tax; link /retirement/rmd-calculator/.
5. Small Balances and the Default Rules: plan balance $1,000 to $5,000 and $1,000 or less rules; the plan must give a written explanation of options.
6. Questions to Ask the Plan Before Deciding: a numbered list of questions (fund list and costs, whether the plan lets you take partial withdrawals, whether it lets you stay, how the rollover is paid). These are QUESTIONS, not facts: do not state what plans typically charge or allow. Also "who this is not for" and "what would change our answer".
7. Our Takeaway.
FAQ (answers from the fact list only): What happens to my 401(k) when I retire? / Can I leave my 401(k) with my former employer? (answer from the fact list: the IRS describes leaving it as an option only via the small-balance rules and the RMD rules; say the plan's own rules decide and tell the reader to ask the plan administrator) / Do I have to withdraw my 401(k) when I retire? (RMD facts) / How do I avoid taxes when moving my 401(k)? (direct rollover) / Can I roll a 401(k) into a Roth IRA? (taxable conversion; link /guides/roth-conversion-rules/) / What is the 20% withholding on a 401(k) distribution?

## ATTRIBUTION (required, per the evidence contract)
Basis: REPORTED (IRS rules) + CALCULATED (the withholding arithmetic). Beside the withholding table, one or two natural sentences: "In our internal analysis, we worked through the IRS withholding and rollover rules for three distribution sizes to see how much of your own money a check made out to you puts at risk. ..." then what we found, then how a reader can check it (the IRS rollover page is linked; the arithmetic is 20% of the distribution). The IRS rules are the IRS's, not ours: name the IRS as the source of the rules. Never say "we tested", "testing" or imply a product trial, a client conversation, a survey or a measured outcome. Do not repeat the attribution cue elsewhere except once in Our Takeaway.
## TAKEAWAY (the last substantive section, named "Our Takeaway", before FAQs; informational, not advice)
For most retirees the real choice is between leaving the money where it is and a direct rollover to an IRA or a new employer plan, and the mistake to avoid is taking a check made out to you, since the plan must withhold 20% and you would need other money to roll over the full amount within 60 days. It fits a reader who wants to keep the money tax-deferred. It does not fit a reader under 59½ who separated from service in or after the year they turned 55 and needs money before 59½: a rollover to an IRA gives up the 401(k)-only exception. The answer changes with the plan's own rules and costs (which the IRS does not set), your age, and whether you need the money now. Basis: IRS rules (reported) and our internal analysis of the withholding arithmetic (calculated).

## INTERNAL LINKS YOU MAY USE (exact paths, first mention only)
- /guides/how-to-withdraw-from-401k/ (the site's existing guide on withdrawal methods, taxes, RMD ages by birth year and a partial-rollover section; this page covers the options decision and the withholding trap, so link it for the how-to-withdraw detail and do not repeat it)
- /retirement/401k-early-withdrawal-calculator/
- /compare/rule-of-55-vs-72t/
- /retirement/rmd-calculator/
- /guides/roth-conversion-rules/
- /compare/rollover-ira-vs-traditional-ira/
- /guides/inherited-ira-taxes-explained/ (only if the beneficiary question comes up; optional)
- /guides/retirement-withdrawal-strategies/
- /guides/am-i-ready-to-retire/
- /guides/financial-advisor-worth-it/

## `tools` FIELD
Pick 2-3 from: /retirement/401k-early-withdrawal-calculator/ (label "401(k) early withdrawal"), /retirement/rmd-calculator/ (label "RMD"), /retirement/retirement-income-calculator/ (label "Retirement income").

## SOURCES
Populate `sources` ONLY from the closed URL list (IRS rollover page, IRS early-distribution exceptions page, IRS RMD topic page, IRS RMD FAQ).

## Hard prohibitions
- No fabricated statistics, rates, dates, limits or thresholds. Only figures on the closed fact list. Do NOT state fund fees, typical plan features, creditor-protection claims, a Social Security amount, a tax bracket or any market return.
- No individualized investment, tax or retirement advice; point to a licensed financial advisor, CPA or the plan administrator for the reader's own situation. Disclaimer text, if any, only as the last element, never in the intro.
- Never link the page to itself. Do not name any brokerage, fund company or plan provider.
- Do not call anything "tested" or "testing"; the withholding figures are internal analysis (calculation).
- Do not claim neutrality, independence or lack of a financial interest.

# CLOSED FACT LIST
**Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the source.**

Source: IRS, Rollovers of Retirement Plan and IRA Distributions (https://www.irs.gov/retirement-plans/plan-participant-employee/rollovers-of-retirement-plan-and-ira-distributions), read 2026-10-27. REPORTED.
- Most pre-retirement payments from a retirement plan or IRA can be "rolled over" by depositing the payment in another retirement plan or IRA within 60 days. You can also have your financial institution or plan directly transfer the payment to another plan or IRA.
- Direct rollover: if you are getting a distribution from a retirement plan, you can ask your plan administrator to make the payment directly to another retirement plan or to an IRA. The administrator may issue the distribution as a check made payable to your new account. No taxes are withheld from your transfer amount.
- If a distribution from a retirement plan is paid directly to you, you can deposit all or part of it in an IRA or a retirement plan within 60 days. Taxes are withheld from a distribution from a retirement plan, so you have to use other funds to roll over the full amount of the distribution.
- A retirement plan distribution paid to you is subject to mandatory withholding of 20%, even if you intend to roll it over later. Withholding does not apply if you roll the amount over directly to another retirement plan or to an IRA. A distribution sent as a check payable to the receiving plan or IRA is not subject to withholding.
- An IRA distribution paid to you is subject to 10% withholding unless you elect out of withholding or choose a different amount; a trustee-to-trustee transfer to another IRA avoids withholding.
- If you do not roll the payment over, it is taxable (other than qualified Roth distributions and amounts already taxed) and you may also owe the additional 10% tax unless you qualify for an exception.
- IRS example: a 42-year-old received a $10,000 eligible rollover distribution from her 401(k); her employer withheld $2,000. If she rolls over only the $8,000 received, she reports $2,000 as taxable income, $8,000 as a nontaxable rollover and $2,000 as taxes paid, and she may owe the additional 10% tax on the $2,000. If she rolls over the full $10,000 (the $8,000 received plus $2,000 from other funds), the entire distribution is tax-free and she avoids the 10% additional tax.
- The one-rollover-per-12-months limit for IRA-to-IRA rollovers does not apply to plan-to-IRA rollovers, IRA-to-plan rollovers, trustee-to-trustee transfers, or traditional-IRA-to-Roth-IRA conversions.
- You can roll your money into almost any type of retirement plan or IRA. The IRS lists rollovers of employer plan money to a Roth IRA as a separate topic (Notice 2009-75); a move from a traditional IRA to a Roth IRA is called a conversion.
- The plan administrator must give you a written explanation of your rollover options for the distribution, including your right to have it transferred directly to another retirement plan or to an IRA.
- If you are no longer employed by the employer that maintains the plan and your plan account is between $1,000 and $5,000, the plan administrator may deposit the money into an IRA in your name if you do not elect to receive it or roll it over. If your plan account is $1,000 or less, the administrator may pay it to you, less in most cases 20% income tax withholding, without your consent. You can still roll that distribution over within 60 days.

Source: IRS, Retirement topics: Exceptions to tax on early distributions (https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-exceptions-to-tax-on-early-distributions), read 2026-10-27. REPORTED.
- Amounts withdrawn from an IRA or retirement plan before age 59½ are "early" distributions. You must pay an additional 10% early-withdrawal tax unless an exception applies.
- Exceptions to the 10% additional tax include: distributions after you reach age 59½ (qualified plans and IRAs); eligible distributions rolled over to another plan or IRA within 60 days; and, for qualified plans such as a 401(k) but NOT for IRAs, a separation from service during or after the year the employee reaches age 55 (age 50 for public safety employees of a state or political subdivision in a governmental plan). This is commonly called the rule of 55. The IRS exceptions table marks the separation-from-service exception "yes" for qualified plans and "no" for IRAs, SEPs, SIMPLE IRAs and SARSEPs.
- (Source for this bullet: IRS Topic no. 558, https://www.irs.gov/taxtopics/tc558) The 10% additional tax is on the part of the distribution that is included in income.

Source: IRS, Retirement topics: Required minimum distributions (https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds) and IRS, Retirement plan and IRA required minimum distributions FAQs (https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs), read 2026-10-27. REPORTED.
- You cannot keep retirement funds in your account indefinitely. You generally have to start taking withdrawals from your IRA, SIMPLE IRA, SEP IRA or retirement plan account when you reach age 73, as the saved IRS pages state it. The site's own guide /guides/how-to-withdraw-from-401k/ states, citing SECURE 2.0, that the age is 73 for people born 1951 to 1959 and rises to 75 for anyone born in 1960 or later. The page must say the start age depends on birth year, give both ages with that attribution, and link that guide. The IRS pages are the authority for a given birth year, so a reader should confirm their own start age there.
- If the plan allows it, retirement plan account owners can delay required minimum distributions from that plan until the year in which they retire, unless they are a 5% owner of the business sponsoring the plan. IRA owners cannot use that delay.
- You can delay the first required minimum distribution until April 1 of the year after you reach the start age, but then you must take two in that second year. A plan document may require distributions to begin after you reach the start age even if you are still working.
- Roth IRAs and designated Roth accounts (in a 401(k) or 403(b)) do not have required distributions while the owner is alive.
- If you do not withdraw the full required amount by the due date, the amount not withdrawn may be subject to an excise tax of 25%, or 10% if the shortfall is corrected within two years.

Source: our own arithmetic for this page (reproduce with reports/mindmap-pass/2026-10-27-podcast/evidence/calc.py; output in evidence/what-to-do-with-401k-when-you-retire/calc-output.json). CALCULATED. Method: 20% mandatory withholding applied to the gross distribution; to roll over the full amount the reader must add the withheld amount from other money within 60 days; the withheld amount not replaced is taxable income, and if the reader is under 59½ with no exception it may also carry the 10% additional tax (10% of that amount). This is arithmetic on the IRS rules, not tax advice, and it ignores the reader's tax rate.
- Distribution of $50,000 paid to the participant: $10,000 withheld, $40,000 received. To roll over all $50,000 the reader must add $10,000 of other money within 60 days. If not replaced: $10,000 taxable; the additional 10% on that amount would be $1,000 if under 59½ with no exception.
- Distribution of $100,000: $20,000 withheld, $80,000 received. Other money needed: $20,000. If not replaced: $20,000 taxable; additional 10% on it would be $2,000 if under 59½ with no exception.
- Distribution of $250,000: $50,000 withheld, $200,000 received. Other money needed: $50,000. If not replaced: $50,000 taxable; additional 10% on it would be $5,000 if under 59½ with no exception.
- A direct rollover of the same amounts has $0 withheld and no tax at the time of the transfer.
