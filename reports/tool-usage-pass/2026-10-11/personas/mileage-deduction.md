# mileage-deduction — /mileage-deduction/irs-mileage-rate-2026/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from title/H1 "IRS Mileage Rate 2026: Two Rates, One Year" — most visitors want the rate itself.
- STEP 1 numbers: people 4, uses 4, views 67, use_rate 0.06, people_7d 4 (data_days = 3). Highest views of any tool; low use rate is expected on a "what is the rate" page whose answer is printed in the input labels.

## Persona
- Who/where: a self-employed rideshare/delivery driver on a phone, logging 17,600 business miles in 2026 (9,200 Jan–Jun, 8,400 Jul–Dec), ~$9,800 in car costs, 22% bracket.
- Job: "What's my mileage deduction this year, and is standard mileage better than actual expenses?"
- Done = the deduction dollar amount and which method to use on Schedule C.

## Walkthrough
Desktop 1366px (screenshot `screenshots/mileage-deduction-desktop.png`):
1. Loads 200 in ~2.4s, tool at 440px; labels show both 2026 rates (72.5¢ Jan–Jun, 76¢ Jul–Dec).
2. Typed 9200 and 8400 miles, picked 22%, typed $9,800 actual costs → a "Share of driving that was for business" field appeared.
3. Result: "$3,150 saved on a $13,054 deduction", line items per half-year, "Standard mileage wins — worth $3,254 more this year."
Phone 390px (screenshot `screenshots/mileage-deduction-mobile.png`): same result, no horizontal scroll, tool at 729px, no console errors. The "first year I used this vehicle" checkbox is a 13px tap target.

## Friction
- "The checkbox is tiny on my phone." — 13px checkbox; the label is clickable, so it works, but it is the one sub-32px control in the tool.
- Otherwise the job completed cleanly. Walked, essentially no friction beyond the shared decimal bug (miles and dollars rarely need decimals here).
