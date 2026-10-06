# ROW PROMPT — spousal-ira (guide page, ModernWallet)

## PAGE
- route: /guides/spousal-ira/
- slug: spousal-ira
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 650 words minimum. A shorter page of listed facts beats padding.
- register: operator
- updated date: 2026-10-06

## KEYWORDS + INTENT
- primary keyword: spousal IRA
- secondary keywords (DataForSEO measured): spousal ira (6,600/mo); can my spouse fund my roth ira; spousal ira contribution limit
- intent: A married reader whose spouse has little or no paid income (anchored by a listener question "Can my spouse fund my Roth?") wants to know whether a non-earning spouse can have an IRA, how much can go in, and what limits still apply.
- reader question: "Can I contribute to an IRA for a spouse who does not work?"
- answer placement: section 1 "What a Spousal IRA Is"

## SECTION COVERAGE
1. What a Spousal IRA Is: not a separate account type; a rule letting a spouse with little or no taxable compensation contribute when filing jointly.
2. The Joint Return and Compensation Rule: each spouse can contribute up to the limit, combined contributions capped by taxable compensation on the joint return.
3. The 2026 Contribution Limit: $7,500, $8,600 if age 50+, per person; lesser of limit or compensation.
4. Traditional or Roth for the Spouse's Account: the deduction may be limited if either spouse is covered by a work plan and income exceeds certain levels; Roth contributions may be limited by income. State only that, no thresholds; link /compare/roth-ira-vs-traditional-ira/.
5. Common Mix-Ups: it is not one shared account; each IRA belongs to one spouse; going over limit has a tax on excess contributions (say only that one exists; no rate).
6. Where to Check Your Own Numbers: point to IRS pages and a tax professional.
FAQ (verbatim): Can a non-working spouse have an IRA? / Can my spouse fund my Roth IRA? / How much can a spouse contribute to a spousal IRA in 2026? / Do we have to file jointly to use a spousal IRA? / Is a spousal IRA a joint account?

## INTERNAL LINKS YOU MAY USE (exact paths)
- /compare/roth-ira-vs-traditional-ira/
- /retirement/couples-retirement-calculator/
- /retirement/retirement-savings-calculator/
- /guides/tax-free-retirement-account/

## `tools` FIELD
Pick 2 from the internal links list (calculators only). Exact href and a short human label.

## SOURCES
Populate `sources` with entries drawn ONLY from the closed URL list.

## Hard prohibitions
- No fabricated statistics, limits, dates or thresholds. Only figures on the closed fact list.
- No individualized financial, tax or retirement advice. Describe rules and tradeoffs; direct the reader to a CPA, tax professional or licensed financial advisor.
- Never link the page to itself. No mention of podcasts.

# CLOSED FACT LIST
**Anything not on this list, you do not know.** Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the IRS page.
Source: IRS "Retirement topics - IRA contribution limits" (https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits)
- For 2026, total contributions you make each year to all of your traditional IRAs and Roth IRAs can't be more than $7,500 ($8,600 if you're age 50 or older), or, if less, your taxable compensation for the year.
- For 2025 and 2024: $7,000 ($8,000 if 50 or older). (Context only; the page is about 2026.)
- Spousal IRAs: "If you file a joint return, you may be able to contribute to an IRA even if you didn't have taxable compensation as long as your spouse did. Each spouse can make a contribution up to the current limit; however, the total of your combined contributions can't be more than the taxable compensation reported on your joint return." IRS points to the Kay Bailey Hutchison Spousal IRA Limit in Publication 590-A (https://www.irs.gov/publications/p590a).
- "If neither spouse participated in a retirement plan at work, all of your contributions will be deductible." (traditional IRA contributions)
- Traditional IRA contributions may be tax-deductible; the deduction may be limited if you or your spouse is covered by a retirement plan at work and your income exceeds certain levels.
- Roth IRA contribution may be limited based on filing status and income, in addition to the general limit.
- You can contribute to a traditional or Roth IRA even if you participate in another retirement plan through your employer.
- For 2020 and later there is no age limit on making regular contributions to traditional or Roth IRAs.
- An excess IRA contribution occurs if you contribute more than the contribution limit; there is a tax on excess IRA contributions (rate not on this list; do not state it).
- Rollover contributions are not subject to the IRA contribution limit.
Do NOT state: contribution deadlines, Roth or deduction income thresholds, phase-out ranges, tax rates, or dollar examples beyond direct arithmetic on the figures above.

# CORRECTIONS FROM THE PHASE 4 AUDIT (first draft FAILED; obey strictly)
Every factual sentence must be traceable to the CLOSED FACT LIST or be direct arithmetic on listed figures. Specifically:
1. metaDescription MUST be 150 characters or fewer.
2. Do NOT say anything about: Social Security numbers; account titling, legal ownership, who controls investments or beneficiaries; whether financial institutions offer joint IRAs; married filing separately; Roth withdrawals being tax-free or Roth contributions being non-deductible; excess contributions being taxed "every year"; "regardless of household income"; employer-plan rollover specifics beyond "rollover contributions are not subject to the IRA contribution limit". If asked in an FAQ (e.g. "Is a spousal IRA a joint account?"), answer using ONLY: a spousal IRA is not a separate account type but a rule about contributions; each spouse can contribute up to the limit; combined contributions are capped by taxable compensation on the joint return; and direct the reader to IRS Publication 590-A for account details.
3. Joint return wording must stay conditional, as the IRS wrote it: "If you file a joint return, you may be able to contribute...". Never say the IRS "requires" it or that you "cannot" use it otherwise; for filing status questions say to confirm at IRS Publication 590-A.
4. State the cap exactly: each spouse may contribute up to the limit, and the combined contributions cannot exceed the taxable compensation on the joint return. Never say a person's deposits "cannot exceed the dollar cap or joint compensation, whichever is lower" across all accounts of the couple.
5. Delete any "we see couples..." / "most common misunderstanding" / superlative claims. The "At ModernWallet, we..." sentence, if used, must describe what the page does ("At ModernWallet, we keep the numbers on this page tied to the IRS pages linked below."), not observed behavior. No filler benefit phrases ("expanding family savings", "ensuring").
6. The `tools` labels must be plain calculator names. No imperatives aimed at the reader's own return; use "the IRS pages list the current rules" style.
7. The $12,000 / $4,500 / $15,000 / $17,200 figures may appear ONLY if framed "for example, a hypothetical couple" and shown as arithmetic; $15,000 and $17,200 only as "two times the per-person limit, if joint compensation is at least that much".
