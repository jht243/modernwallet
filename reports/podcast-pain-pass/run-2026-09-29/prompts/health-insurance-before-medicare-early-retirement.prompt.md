# ROW PROMPT — health-insurance-before-medicare-early-retirement (guide page, ModernWallet)

## PAGE
- route: /guides/health-insurance-before-medicare-early-retirement/
- slug: health-insurance-before-medicare-early-retirement
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 1300 words minimum across introText + sections + faqs
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
