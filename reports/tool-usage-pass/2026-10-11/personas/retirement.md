# retirement — /retirement/social-security-retirement-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from title "Social Security Retirement Calculator" and H1 "Social Security Retirement Calculator: Add SSA Benefits to Your Plan".
- STEP 1 numbers: people 10, uses 12, views 28, use_rate 0.429, people_7d 10 (data_days = 3).

## Persona
- Who/where: a 58-year-old with $310,000 in a 401(k), on a desktop, Social Security statement from ssa.gov open in another tab showing about $2,300/month at full retirement age.
- Job: "If I retire at 66, what's my total monthly income — savings plus Social Security?"
- Done = one monthly income number (savings draw + SSA benefit) to compare with their budget.

## Walkthrough
Desktop 1366px (screenshot `screenshots/retirement-desktop.png`):
1. Loads 200 in ~2.7s, tool at 521px. Subhead: "See your portfolio balance at retirement, then add your SSA benefit estimate for your total monthly income."
2. Typed age 58, retirement age 66, savings 310000, monthly contribution 1200 → "Savings at retirement $680,379 (≈ $537,097 today)", "Monthly income (4% rule) $2,268".
3. Looked for a place to enter the $2,300 Social Security benefit — **there is none**. The six inputs are age, retirement age, savings, contribution, return, inflation. The page body says to "add that monthly amount" yourself.
4. Typing inflation "2.5" became **25%** (decimal dropped).
Phone 390px (screenshot `screenshots/retirement-mobile.png`): same; tool starts 960px down, no horizontal scroll, no console errors.

## Friction
- "It's called a Social Security calculator and promises to add my SSA benefit — but there's nowhere to type it. I have to do the addition myself." — missing input; the tool's own promise is unfulfilled.
- "2.5% inflation turned into 25%." — the shared decimal bug.
- Page body cites the 2025 earnings-test threshold ($23,400) on a page read in late 2026 — dated fact for a 2026 claimer.
