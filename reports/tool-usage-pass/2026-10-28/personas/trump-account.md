# trump-account — /trump-account/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials on the runner; `gsc_search_analytics.py` exits "No service-account credentials found"). Intent from the H1 "Trump Account Calculator" and meta title "Trump Account Calculator: $1,000 Value at 18".
- STEP 1 numbers (data_days = 20, early): people 95, uses 99, views 228, use_rate 0.434, people_7d 44.
- Re-picked although worked 2026-10-11: people_7d 44 is more than double the 21 recorded on the 2026-10-14 ledger line (STEP 2 "it took off" rule).

## Persona
- Who/where: a parent on a laptop at the kitchen table, two kids — a 7-year-old (born 2019) and a newborn — whose employer just announced it will put $500 a year into each employee child's Trump Account.
- Job: "If we put $4,000 a year in for our 7-year-old and my employer adds $2,500, what is it worth at 18?"
- Done = one dollar figure at 18 for the older child, and knowing whether the employer money counts against the family's limit.

## Walkthrough
Desktop 1366px (`screenshots/trump-account-desktop.png`):
1. Page 200 in ~3.0s, `data-tool` root 440px down, five inputs (Child's age now — blank, Federal seed $1,000, Yearly family contribution (family + employer max $5,000) $2,400, Yearly employer contribution (max $2,500, counts toward the $5,000) blank, Expected annual return 7%). Default result $89,657 at 18.
2. Typed 7 into Child's age → a note appears: "The $1,000 federal seed goes only to children born 2025 through 2028. If your child was born before 2025, set the federal seed to $0." Clear. Set the seed to 0.
3. Typed 4000 into "Yearly family contribution (family + employer max $5,000)" and 2500 into the employer field → "⚠️ Total private contributions are capped at $5,000/yr — the amount above that was not counted." Value at 18: $84,651 (seed still $1,000 in that pass) / with seed 0, family 2,000 + employer 500: $41,248 in 11 years, "You put in $27,500".
4. The persona hesitates at the family field: its label says "family + employer max $5,000", which reads as "type the combined total here". Walked that reading: seed 0, family field 4500 (their $4,000 + the employer's $500) and employer field 500 → no warning (the sum is exactly $5,000), "You put in $55,000", value at 18 $82,496. Their real money is $4,500 a year ($49,500 over 11 years) — the employer $500 was counted twice and nothing on screen flagged it.
5. Picks block ("Further reading for the parent of a future account holder", 3 books, disclosure) renders under the result. No console errors, no horizontal scroll.
Phone 390px (`screenshots/trump-account-mobile.png`):
1. Same inputs and results; root 809px down; scrollWidth 390 (no horizontal scroll); no targets under 24px; no console errors.

## Friction
- "Is the $4,500 the family total or do I add my employer's $500 separately? The label says family + employer." — the family field's label carries the combined-cap note, so it reads like a combined field. → tool fix: label "Yearly family contribution (parents, relatives, friends)" and move the cap note to a one-line hint under both fields: "Family and employer money together are capped at $5,000 a year; the employer part is capped at $2,500." No math change (the tool already caps the sum at $5,000).
- Nothing else blocked the job: seed eligibility note, cap warning and the year-by-year table all worked at both widths.

## Monetization
Verdict: fit
Already shipped 2026-10-14 (ledger: kids-and-money book, index-investing guide, couples money planning book — 3 product types). This persona's result (a five-figure balance their child controls at 18) is the same trigger, so the same ranked list holds; this run only re-verifies the three pinned ASINs still resolve and makes no change unless one fails.
1. Book — kids and money (the child will control this balance at 18): 1476766819 *Make Your Kid a Money Genius (Even If You're Not)* (Kobliner)
2. Book — index investing (the account must hold a U.S.-equity index fund): 1119404509 *The Little Book of Common Sense Investing* (Bogle)
3. Book — couples money planning (two parents agreeing on the yearly amount): 1523523689 *Money for Couples* (Sethi)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Any computed value at 18 | 1476766819, 1119404509, 1523523689 | Unchanged from 2026-10-14; re-resolved this run |
