# trump-account — /trump-account/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from title/H1 "Trump Account Calculator".
- STEP 1 numbers: people 12, uses 12, views 27, use_rate 0.444, people_7d 12 (data_days = 3).

## Persona
- Who/where: a parent of a 2-year-old, on a laptop at the kitchen table after reading a news story about the new Trump Accounts for kids.
- Job: "If we put in the $5,000 max each year and my employer adds $1,000, what will my kid have at 18?"
- Done = a value-at-18 they believe, and to know whether their child gets the $1,000 federal seed.

## Walkthrough
Desktop 1366px (screenshot `screenshots/trump-account-desktop.png`):
1. Loads 200 in ~2.6s, tool at 440px; defaults age 0, seed $1,000, family $2,400, return 7% → "$89,657 at 18".
2. Typed child's age 2 → accepted. The **$1,000 federal seed stays in the math**.
3. Typed family 5000, employer 1000 → warning: "Total private contributions are capped at $5,000/yr — the amount above that was not counted."
4. Result "$149,833 in 16 years at 7%", "You put in $81,000" (seed + 16 × $5,000).
5. Year-by-year table opens (ages 3,4,5,6,9,12,15,18).
6. Separately, typing a return of "6.5" became **65%** (decimal dropped).
Phone 390px (screenshot `screenshots/trump-account-mobile.png`): same results; no horizontal scroll, tool at 775px, no small tap targets, no console errors.

## Friction
- "The labels said family max $5,000 and employer max $2,500, so I thought I could do both. Then it told me my employer's $1,000 wasn't counted." — the two labels read as separate limits; the employer amount counts inside the same $5,000 cap. The warning only appears after the fact.
- "My son was born in 2024 — does he even get the $1,000?" — the federal $1,000 pilot seed is only for children born 2025–2028, but the tool keeps it in the total at any age without saying so.
- "I typed 6.5% and it says 65%." — the shared decimal bug.
