# ROW PROMPT — medicare-costs-2026-part-b-premium-irmaa (guide page, ModernWallet)

## PAGE
- route: /guides/medicare-costs-2026-part-b-premium-irmaa/
- slug: medicare-costs-2026-part-b-premium-irmaa
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 700 words minimum. A shorter page of listed facts beats padding.
- register: operator
- updated date: 2026-09-29

## KEYWORDS + INTENT
- primary keyword: Medicare Part B premium 2026
- secondary keywords (DataForSEO measured 2026-09-29): medicare part b premium 2026 (49,500/mo); medicare irmaa (5,400/mo); irmaa brackets; irmaa surcharge; part b deductible
- intent: Reader (often a retiree or pre-retiree; anchored by this week's Suze Orman "2026 Medicare Master Class" episode) wants the actual 2026 Part B premium, the deductible, and whether income pushes them into a higher bracket (IRMAA) and how the bracket is decided.
- reader question: "how much is the Medicare Part B premium in 2026 and what is IRMAA?"
- answer placement: section 1 "The 2026 Part B Premium and Deductible" (and sentence 1 of introText gives the standard premium and the deductible).

## SECTION COVERAGE
1. The 2026 Part B Premium and Deductible: standard premium, deductible, Part A inpatient deductible.
2. What IRMAA Is and Who Pays It: an income-related adjustment added to the standard Part B and Part D premiums for higher-income enrollees; which tax return year is used is NOT on the fact list, so say the agency uses a past federal tax return and the reader should confirm which year at Social Security.
3. The 2026 IRMAA Tiers: present as a clear prose list or short paragraphs (no tables) covering all six tiers for single and joint filers with total Part B premium and Part D adjustment.
4. How Income Choices Can Move You Between Tiers: general mechanics only (MAGI thresholds are cliffs: one dollar over a threshold moves the whole tier per the fact list's ">" wording); mention that Roth conversions, capital gains and retirement withdrawals count as income in general terms and link /guides/roth-conversion-rules/; no individualized advice.
5. What Is Not Covered By These Numbers: Medicare Advantage, Medigap, Part D plan premiums, and copays vary by plan; say so and tell reader to verify at Medicare.gov / their plan.
6. Next steps: check the notice from Social Security, and see a licensed advisor / SHIP counselor.
FAQ (verbatim): What is the Medicare Part B premium in 2026? / What is the Part B deductible in 2026? / What income triggers IRMAA in 2026? / Do married couples have higher IRMAA thresholds? / Is the Part D IRMAA separate from the Part B IRMAA?

## INTERNAL LINKS YOU MAY USE (exact paths)
- /compare/medicare-vs-medicare-advantage/
- /compare/medicare-advantage-vs-medigap/
- /guides/roth-conversion-rules/
- /guides/how-to-retire-at-67/
- /retirement/retirement-income-calculator/
- /retirement/social-security-retirement-calculator/
SIBLING PAGES SHIPPING IN THIS RUN (safe): /guides/medicare-enrollment-periods/ , /guides/health-insurance-before-medicare-early-retirement/

## `tools` FIELD
Pick 2-3 from the internal links list below (calculators). Exact href and a short human label.

## SOURCES
Populate `sources` with entries drawn ONLY from the closed URL list.

## Hard prohibitions
- No fabricated statistics, premiums, dates or thresholds. Only figures on the closed fact list.
- No individualized financial, tax, insurance or retirement advice. Describe rules and tradeoffs; direct the reader to a licensed insurance agent, SHIP counselor, CPA or financial advisor for their own situation.
- Never link the page to itself.

# CLOSED FACT LIST
**Anything not on this list, you do not know. Never invent a price, limit, benchmark or URL; say it is unpublished and tell the reader to verify at the primary source.**
Source: CMS fact sheet "2026 Medicare Parts A & B Premiums and Deductibles" (https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles), released Nov 14, 2025.
- Standard monthly Part B premium 2026: $202.90.
- Part B annual deductible 2026: $283.
- Part A inpatient hospital deductible 2026 (per benefit period admission): $1,736.
- IRMAA affects roughly 8% of people with Medicare Part B.
- Social Security determines IRMAA from the most recent federal tax return the IRS provides (generally a return filed in 2025 for tax year 2024, for 2026 amounts).
- Part B IRMAA tiers 2026 (MAGI individual | MAGI joint | monthly adjustment | total Part B premium):
  - $109,000 or less | $218,000 or less | $0.00 | $202.90
  - above $109,000 to $137,000 | above $218,000 to $274,000 | $81.20 | $284.10
  - above $137,000 to $171,000 | above $274,000 to $342,000 | $202.90 | $405.80
  - above $171,000 to $205,000 | above $342,000 to $410,000 | $324.60 | $527.50
  - above $205,000 to under $500,000 | above $410,000 to under $750,000 | $446.30 | $649.20
  - $500,000 or more | $750,000 or more | $487.00 | $689.90
- Part D income-related monthly adjustment (added to the plan premium): same tiers → $0.00; $14.50; $37.50; $60.40; $83.30; $91.00.
- The joint thresholds apply to married filing jointly. Other filing statuses (e.g. married filing separately) have different rules that are NOT on this list: tell the reader to check with Social Security.

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
