# ROW PROMPT — health-insurance-before-medicare-early-retirement (guide page, ModernWallet)

## PAGE
- route: /guides/health-insurance-before-medicare-early-retirement/
- slug: health-insurance-before-medicare-early-retirement
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 700 words minimum. A shorter page of listed facts beats padding.
- register: operator
- updated date: 2026-09-29

## KEYWORDS + INTENT
- primary keyword: early retirement health insurance
- secondary keywords (DataForSEO measured): early retirement health insurance (1,000/mo); aca subsidies early retirement (autocomplete-corroborated, estimate); health insurance before medicare; cobra vs marketplace
- intent: Reader planning to retire before 65 (anchored by Catching Up to FI's "How to Get Health Insurance When You Retire Early" episode and Ready For Retirement's early-retirement episode, which name health insurance as a top early-retirement gap) wants the options to cover the gap until Medicare and the tradeoffs.
- reader question: "how do I get health insurance if I retire before 65?"
- answer placement: section 1 "The Coverage Gap Before Medicare"

## SECTION COVERAGE
1. The Coverage Gap Before Medicare: Medicare's Initial Enrollment Period starts 3 months before 65, so anyone retiring earlier needs bridge coverage; list the general options: COBRA, Marketplace plan, spouse's employer plan, other (say others exist; keep general).
2. COBRA Continuation Coverage: what it is, duration usually up to 18 months, 60-day election, you usually pay the full premium plus, employer 20+ employees; premium figure limited to facts.
3. Marketplace Coverage and the Special Enrollment Period: losing job-based coverage triggers a SEP within 60 days before or after; voluntarily dropping doesn't qualify; the retirement itself is not listed as a qualifying event so the reader should confirm at HealthCare.gov. Subsidies: say premium tax credits depend on household income (estimated); do NOT state thresholds or amounts (not on the list) and tell reader to check HealthCare.gov. Explain in general that planning taxable income in early retirement can matter for subsidy eligibility; link /guides/roth-conversion-ladder/ ; not advice.
4. Comparing the Options: prose tradeoffs (cost predictability, provider networks, timeline, subsidy eligibility) without invented numbers.
5. When Medicare Starts to Matter: link /guides/medicare-enrollment-periods/ and /guides/medicare-costs-2026-part-b-premium-irmaa/.
6. A Checklist Before You Leave Your Job: general questions to ask HR, the plan administrator, HealthCare.gov, a licensed agent.
FAQ (verbatim): How long can you stay on COBRA after retiring? / Can you get a Marketplace plan if you retire early? / Is COBRA cheaper than a Marketplace plan? / What happens to health insurance at 65? / Do you need health insurance if you retire early and are healthy?

## INTERNAL LINKS YOU MAY USE (exact paths)
- /guides/how-to-retire-at-40/
- /guides/coast-fire-guide/
- /guides/roth-conversion-ladder/
- /guides/is-3-million-enough-to-retire-at-40/
- /guides/medicare-enrollment-periods/
- /guides/medicare-costs-2026-part-b-premium-irmaa/
- /retirement/early-retirement-calculator/
- /retirement/fire-calculator/

## `tools` FIELD
Pick 2-3 from the internal links list below (calculators). Exact href and a short human label.

## SOURCES
Populate `sources` with entries drawn ONLY from the closed URL list.

## Hard prohibitions
- No fabricated statistics, premiums, dates or thresholds. Only figures on the closed fact list.
- No individualized financial, tax, insurance or retirement advice. Describe rules and tradeoffs; direct the reader to a licensed insurance agent, SHIP counselor, CPA or financial advisor for their own situation.
- Never link the page to itself.

# CLOSED FACT LIST
**Anything not on this list, you do not know.**
- Medicare IEP begins 3 months before the month you turn 65 (Medicare.gov: https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-does-medicare-coverage-start).
- COBRA (US Dept of Labor, https://www.dol.gov/agencies/ebsa/laws-and-regulations/laws/cobra): temporary coverage for you and dependents, "usually up to 18 months"; you have 60 days to enroll, starting when job-based coverage ends or when you receive a COBRA election notice, whichever is later; you usually pay the full premium amount unless your employer agrees to cover some or all as part of separation. Also (https://www.dol.gov/general/topic/health-plans/cobra): COBRA gives workers and families who lose health benefits the right to continue group coverage, applies when the employer has 20 or more employees, and qualified individuals may be required to pay the entire premium up to 102% of the plan's cost.
- HealthCare.gov (https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/): you may qualify for a Special Enrollment Period if you lost qualifying health coverage in the past 60 days or expect to lose it in the next 60 days. Voluntarily dropping COBRA does not qualify you; choosing to stop paying COBRA premiums doesn't either. When COBRA ends you have a 60-day window. Retirement itself is not listed as a qualifying life event on the page. Special enrollment can also be based on estimated household income (HealthCare.gov's wording: "or based on estimated household income").
- Standard 2026 Medicare Part B premium is $202.90/mo (CMS) — context only.

# CORRECTIONS FROM THE PHASE 4 AUDIT (first draft FAILED; obey strictly)
The first draft failed for stating things NOT on the closed fact list. Rules for this regeneration:
1. Every factual sentence must be traceable to the CLOSED FACT LIST or be direct arithmetic on listed figures. No other rules, mechanics, eligibility conditions, percentages, ages, dates, form names (no "Form SSA-44"), appeal or life-changing-event procedures, retroactivity claims, "full calendar year" claims, coinsurance, what Part B covers, MAGI definitions, mailing schedules, spouse-plan rules, network types (HMO/PPO), severance, creditable-coverage rules, or dollar examples of medical bills. If a topic is not on the list, write one sentence telling the reader to confirm it with Medicare.gov, HealthCare.gov, the plan administrator or a licensed agent, and move on.
2. Joint IRMAA thresholds are NOT double the single ones (top tiers are $750,000 vs $500,000). Do not describe how spouses each pay; say only that the joint column applies to married filing jointly.
3. Do NOT say COBRA is or is not creditable, does or does not extend the Special Enrollment Period; say the reader must check the rule at Medicare.gov.
4. Do NOT name Social Security Administration, IRS, SHIP, CMS-except-as-linked, as unlinked agencies; write "Social Security" only as in "the notice you get from Social Security" with no procedures. Link HealthCare.gov, Medicare.gov, CMS, DOL at first mention using only the closed URL list.
5. The "At ModernWallet, we" sentence, if used, must be a plain editorial-stance sentence with no numbers, activity claims or superlatives (e.g. "At ModernWallet, we treat the cost of this coverage as a line item to price before anything else in the plan."). 
6. Sentence 1 of introText must directly answer the reader question with the concrete facts from the list (e.g. for enrollment: the 7-month Initial Enrollment Period, 3 months before the month you turn 65 through 3 months after).
7. No tables. No "This guide/article" self-reference. No dramatic fragments ("Do not delay."), no "essential", "unmatched", "seamless", "guarantees", "lifelong", "never expires", "almost always", "rarely". No individualized advice ("you should consider phased retirement", "coordinate with a CPA before selling real estate"). Describe options and tradeoffs only in terms of the facts. No trailing -ing clauses tacked to sentences. Titles: single clause, no colon.
8. Source labels use a comma or colon, never "--".
9. End with a one-paragraph disclaimer as the LAST element of the last section (educational, not advice; confirm with a licensed professional).
10. Health page: COBRA is "usually up to 18 months"; cost is "the full premium, up to 102% of the plan's cost" (no "administrative fee"); the 20-employee threshold as listed only; do not restate IEP end date; link /guides/medicare-enrollment-periods/ for it. Do not assert who qualifies for premium tax credits.

# SECOND CORRECTIONS ROUND (the regenerated draft STILL failed). Additional strict rules
A. Write ONLY sentences that restate listed facts, verified arithmetic on them, links to the allowed internal pages, or "confirm this at <linked source>". Everything else is deleted, including: what Part B/Part A cover; who pays what out of pocket; premium-free Part A; who decides IRMAA (say only it is a monthly adjustment added to the standard premiums, and per the list Social Security uses a past tax return); mailing schedules; notice procedures; "ensures/prevents"; work-past-65 rules; supplemental/network/formulary talk; coverage-gap financial risk; anything about how COBRA or retiree plans interact with Medicare (say: check Medicare.gov).
B. No trailing -ing clauses ("...bringing the total to..."): write two sentences instead. No dramatic imperatives ("Do not assume...", "Keep the answers together"), no paired-contrast aphorisms, no "this annual window serves as".
C. Coverage start after IEP enrollment: only "depends on the month you enroll". The IEP is 3 months before the MONTH you turn 65 (never "3 months before your birthday").
D. Penalty: use the list wording only: "If you wait to sign up when you must pay for Part B, you may pay a monthly late enrollment penalty for as long as you have Part B, and it goes up the longer you wait."
E. Premium tax credits: one sentence only: "Ask HealthCare.gov how premium tax credits and your income estimate apply to you." Never state that credits depend on income.
F. IRMAA example: give the Tier 2 monthly adjustments ($81.20 Part B, $14.50 Part D) and, if you show a yearly total, say "if both apply for 12 months: $1,148.40". Do not define MAGI; do not claim what counts as income except: Roth conversions and withdrawals may change reported income, so ask a CPA. Do not compare joint to single thresholds; just list the figures. Say "roughly 92%" never "92%". Every source needs a real URL from the closed list.
G. Every page: the "At ModernWallet, we" sentence is a plain stance line with no claim (e.g. "At ModernWallet, we treat this as a line item to confirm before the rest of the plan."). No "What would change our advice" sentence. Link Medicare.gov at its first mention using the allowed when-does-coverage-start URL.
H. introText sentence 1 leads with concrete listed facts (enrollment: IEP 7 months, from 3 months before the month you turn 65 to 3 months after; health: COBRA usually up to 18 months, 60 days to elect, up to 102% of plan cost, and HealthCare.gov special enrollment within 60 days before or after losing coverage; costs: $202.90 premium and $283 deductible).
I. Health page: neutral tradeoffs only in terms of listed facts; no "may suit someone", no "poor fit", no spouse-plan rules; mention another employer plan only as "another possible source; ask the plan administrator".
