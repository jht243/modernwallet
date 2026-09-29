# ROW PROMPT — medicare-costs-2026-part-b-premium-irmaa (guide page, ModernWallet)

## PAGE
- route: /guides/medicare-costs-2026-part-b-premium-irmaa/
- slug: medicare-costs-2026-part-b-premium-irmaa
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 1300 words minimum across introText + sections + faqs
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
