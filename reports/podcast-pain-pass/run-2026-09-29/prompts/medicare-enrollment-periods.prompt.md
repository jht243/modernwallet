# ROW PROMPT — medicare-enrollment-periods (guide page, ModernWallet)

## PAGE
- route: /guides/medicare-enrollment-periods/
- slug: medicare-enrollment-periods
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 700 words minimum. A shorter page of listed facts beats padding.
- register: operator
- updated date: 2026-09-29

## KEYWORDS + INTENT
- primary keyword: Medicare enrollment periods
- secondary keywords (DataForSEO measured): medicare enrollment periods (6,600/mo); initial enrollment period; general enrollment period; special enrollment period medicare
- intent: Reader approaching 65 or retiring (anchored by Suze Orman's "2026 Medicare Master Class") wants to know WHEN they can sign up, when coverage starts, and what happens if they miss the window.
- reader question: "when can I sign up for Medicare?"
- answer placement: section 1 "The Initial Enrollment Period"

## SECTION COVERAGE
1. The Initial Enrollment Period: 7 months window, when it starts and ends; coverage start depends on when you enroll (state generally; verify at Medicare.gov).
2. The General Enrollment Period: Jan 1 to Mar 31, coverage starts the month after signup.
3. The Special Enrollment Period for Employer Coverage: ends 8 months after group coverage or employment ends, whichever happens first.
4. What Late Enrollment Costs: a monthly late enrollment penalty for as long as you have Part B, and it goes up the longer you wait. Do NOT state a percentage.
5. Retiring Before 65 vs After 65: a short paragraph. Link /guides/health-insurance-before-medicare-early-retirement/.
6. A Simple Timeline Checklist: plain sentences, no individualized advice.
FAQ (verbatim): When does Medicare open enrollment start? is NOT allowed (different meaning). Use: How long is the Medicare initial enrollment period? / When does Medicare coverage start after you sign up in the General Enrollment Period? / How long do you have to sign up for Medicare after leaving a job? / Is there a penalty for signing up late? / Do COBRA or retiree plans extend the Special Enrollment Period? (answer: they do not automatically; say the reader must check the rules at Medicare.gov, this is not on the fact list beyond the 8-month rule).

## INTERNAL LINKS YOU MAY USE (exact paths)
- /compare/medicare-vs-medicare-advantage/
- /compare/medicare-advantage-vs-medigap/
- /compare/medicare-vs-medicaid/
- /guides/how-to-retire-at-67/
- /retirement/social-security-retirement-calculator/
- /retirement/retirement-income-calculator/
SIBLING PAGES SHIPPING IN THIS RUN (safe): /guides/medicare-costs-2026-part-b-premium-irmaa/ , /guides/health-insurance-before-medicare-early-retirement/

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
Source: Medicare.gov "When does Medicare coverage start?" (https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-does-medicare-coverage-start)
- Initial Enrollment Period: "lasts for 7 months, starting 3 months before you turn 65, and ending 3 months after the month you turn 65." Coverage start date depends on the month you enroll.
- General Enrollment Period: January 1 to March 31 each year; coverage starts the month after you sign up.
- Special Enrollment Period for employer (group health plan) coverage: ends 8 months after the group health plan coverage or the employment ends, whichever happens first.
- If you wait to sign up when you must pay for Part B, you may pay a monthly late enrollment penalty for as long as you have Part B; the penalty goes up the longer you wait.
- Standard 2026 Part B premium is $202.90/mo (CMS: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles) — may be cited for context only.

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
