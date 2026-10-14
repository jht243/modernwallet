# retirement — /retirement/social-security-retirement-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run (tool cannot authenticate). Intent from the H1 "Social Security Retirement Calculator: Add SSA Benefits to Your Plan" and the tool heading "Project your savings and Social Security income together".
- STEP 1 numbers (data_days = 6, early): people 36, uses 43, views 100, use_rate 0.43, people_7d 36 (ledger 2026-10-11: 10 → more than doubled, re-picked).

## Persona
- Who/where: a 58-year-old office worker on a laptop at the kitchen table with their SSA statement open; $250,000 in a 401(k), adding $1,000/month, plans to retire at 67; statement says $2,100/month at 67.
- Job: "Add my Social Security to my savings — what monthly income will I have when I retire?"
- Done = one monthly-income number they can compare with today's bills.

## Walkthrough
Desktop 1366px (`screenshots/retirement-desktop.png`):
1. Page 200 (~3.6s), `data-tool="retirement"` root 521px down.
2. Typed Current age 58, Retirement age 67, Savings 250000, Monthly contribution 1000, Annual return 6, Monthly Social Security 2100 (inflation left at 3%).
3. Result: "Savings at retirement $560,266 ≈ $429,397 in today's dollars · Total monthly income $3,968 · Social Security $2,100 · Monthly income (4% rule) $1,868 · Years funded 28 yrs · On track…"
4. Checked the math: $1,868 = $560,266 × 4% ÷ 12 — future (inflated) dollars. $2,100 is the SSA statement figure, which SSA states in today's dollars. The $3,968 total adds the two, so it is neither today's dollars nor future dollars. In today's dollars the savings income is $429,397 × 4% ÷ 12 = $1,431, total ≈ $3,531.
Phone 390px (`screenshots/retirement-mobile.png`):
1. No horizontal scroll, root 960px down, inputs ≥32px. Same result. No console errors.

## Friction
- "My bills are in today's money. Is $3,968 today's money or 2035 money?" — the headline total mixes today's-dollar Social Security with future-dollar savings income and doesn't say which. → tool fix: add "≈ $X/month in today's dollars" under Total monthly income (SS as entered + 4% of the today's-dollar balance ÷ 12), and label the SS line "(today's dollars, from your SSA statement)". Worked example above: $2,100 + $1,431 = $3,531. Source: SSA statement estimates are in today's dollars (ssa.gov/myaccount).
- No other blockers; last week's SS field fix works at both widths.

## Monetization
Verdict: fit
YMYL → books only. This person's next step is deciding when to claim and how to draw income. Ranked list:
1. Book — Social Security claiming guide (the decision their result hinges on)
2. Book — retirement income / withdrawal planning
3. Book — general retirement guide for pre-retirees

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| No Social Security amount entered | 1950967190 *Social Security Made Simple* (Mike Piper); 1501144766 *Get What's Yours* (revised, Kotlikoff/Moeller/Solman, Simon & Schuster) | Explains the benefit figure they haven't added yet |
| SS entered, savings last through age 95 ("on track") | 1945640154 *Retirement Planning Guidebook* (Wade Pfau); 1950967190 *Social Security Made Simple* | Plans the drawdown order for a plan that works |
| SS entered, savings run low before 95 | 1982115831 *How to Make Your Money Last* (Jane Bryant Quinn, Simon & Schuster); 1501144766 *Get What's Yours* | Ways to stretch income, incl. delaying Social Security |
