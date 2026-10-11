# investing — /investing/high-yield-savings-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run (the GSC tool has no service-account credentials here). Intent taken from the page title/H1 "High Yield Savings Calculator" and the tool's own subhead "Enter your balance, deposits, and APY to see interest earned over time."
- STEP 1 numbers (30-day window, data_days = 3): people 32, uses 36, views 62, use_rate 0.581, people_7d 32. Most-used tool on the site.

## Persona
- Who/where: a 30-something renter on a phone at lunch, moving a $25,000 emergency fund out of a big-bank savings account into an online HYSA that advertises 4.1% APY.
- Job: "If I park $25k and add $500 a month, how much interest will I actually earn in 5 years?"
- Done = one trustworthy interest-earned number they can compare against what their current bank pays.

## Walkthrough
Desktop 1366px (screenshot `screenshots/investing-desktop.png`):
1. Page loads 200 in ~2.9s, tool starts 446px down, prefilled $10,000 / $300 / 4.5% / 10 yrs → "$61,029 future value".
2. Typed Starting balance 25000 → accepted, shown "25,000".
3. Typed Monthly contribution 500 → accepted.
4. Typed the APY "4.1" into "Annual return %" → the field shows **41**. The decimal point disappeared as it was typed. Same with "0.5" → **5**.
5. Typed Years 5. Result: **"$282,876 after 5 years at 41%"**, "Investment growth $227,876". An absurd answer that a hurried reader could believe was the HYSA's value.
6. Opened "Show year-by-year growth" → table renders the same 41% numbers.
Phone 390px (screenshot `screenshots/investing-mobile.png`):
1. No horizontal scroll (scrollWidth 390), tool starts 797px down, all inputs ≥32px tall.
2. Same inputs, same result: "4.1" became 41%, "$282,876 after 5 years at 41%".
3. No console errors at either width.

## Friction
- "I typed 4.1 and it says 41%. Is it broken? Now I don't trust any number on this page." — every decimal typed into a number field is dropped (4.1 → 41, 0.5 → 5). This is the core input of a savings calculator (APYs are almost always decimals). Same bug confirmed on trump-account, retirement and portfolio fields — it is the shared number input.
- "It says 'Annual return' and 'Investment growth' — I'm putting cash in a savings account, I want the APY and the interest I earn." Labels speak investing, not savings.
- "Is that interest taxed?" — HYSA interest is ordinary income; the tool gives no hint.
