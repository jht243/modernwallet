# net-worth — /net-worth/liquid-net-worth-calculator/ (low-use lane)

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from title/H1 "Liquid Net Worth Calculator".
- STEP 1 numbers: people 1, uses 1, views 13, use_rate 0.077, people_7d 1 (data_days = 3). Low-use lane: why do viewers leave without touching it?

## Persona
- Who/where: a 38-year-old homeowner on a phone who searched "liquid net worth" after an advisor or a credit-card application asked for it.
- Job: "What is my liquid net worth — the money I could actually get to?"
- Done = one liquid number and a plain idea of what counts in it.

## Walkthrough
Desktop 1366px (screenshot `screenshots/net-worth-desktop.png`):
1. Loads 200 in ~2.6s, tool at 446px. Prefilled sample shows **"NET WORTH $160,000"** as the big headline; "Liquid net worth $80,000" is a smaller secondary stat.
2. Twelve inputs (6 assets, 5 debts, age) before any result moves.
3. Typed cash 18000, investments 42000, retirement 95000, home 380000, mortgage 290000, cards 3200, age 38 → headline "$236,800 net worth", "Liquid net worth **-$258,200**", benchmark "above the median for 35–44 by $101,200".
Phone 390px (screenshot `screenshots/net-worth-mobile.png`): same; tool at 766px, no horizontal scroll, no small tap targets, no console errors.

## Friction
- (why they leave) "I came for LIQUID net worth and the big number is something else." — the page's own keyword is the small stat, so a glance-reader concludes the tool doesn't answer their question.
- "Minus $258,200? I have $60k in the bank." — liquid net worth subtracts the whole mortgage from only liquid assets, with no line saying what counts (cash + taxable investments) and what doesn't (retirement, home, vehicles). The number is defensible but unexplained, so it reads as broken.
- Shared decimal bug on every dollar field.
