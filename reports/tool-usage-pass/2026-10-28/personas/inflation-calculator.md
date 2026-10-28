# inflation-calculator — /inflation-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials on the runner). Intent from the H1 "Inflation Calculator"; the page's own FAQ "Does this calculator use historical CPI data?" answers "No", i.e. the page already anticipates that question.
- STEP 1 numbers (data_days = 20, early): people 20, uses 22, views 45, use_rate 0.489, people_7d 11. First time worked.
- Official data check this run: BLS CPI-U (series CUUR0000SA0, U.S. city average, all items, 1982-84=100) annual averages 1913–2025 and monthly values through September 2026 retrieved from the BLS Public Data API (api.bls.gov) on 2026-10-28.

## Persona
- Who/where: a 41-year-old on a laptop preparing for a raise conversation; started their career in 2010 at $52,000 and now earns $78,000.
- Job: "What is my 2010 salary worth in today's dollars — did my pay keep up with inflation?"
- Done = one figure: $52,000 in 2010 expressed in 2026 dollars, to compare with $78,000.

## Walkthrough
Desktop 1366px (`screenshots/inflation-calculator-desktop.png`):
1. Page 200 in ~2.3s, `data-tool` root 565px down. Inputs: Amount in today's dollars ($10,000), Years (10), Average annual inflation (3%), Annual return (optional). Every field points forward from today.
2. There is no "starting year" field. The persona tries to bend it: typed 52000, 16 years, and — guessing — 2.6% inflation, 4.1% return.
3. Result: "Cost later of what $52,000 buys today $78,408 after 16.0 years at 2.6% a year", buying power lost 33.7%, real return 1.46%, ending balance $98,904 ($65,593 today). This answers a different question (2026 → 2042) with a rate they made up. The real answer from BLS CPI-U is $52,000 × 336.94 (Sep 2026) ÷ 218.056 (2010 average) ≈ $80,350 — so $78,000 is a pay cut in real terms, which the tool cannot show.
4. The hint under the inputs still says "The 3% inflation rate above is a placeholder" after the rate was changed to 2.6% — stale text.
5. No picks block under the result.
Phone 390px (`screenshots/inflation-calculator-mobile.png`):
1. Same behaviour; root 1,087px down (long intro above the tool); scrollWidth 390; no console errors; no targets under 24px.

## Friction
- "I just want to know what $52,000 in 2010 is worth now. It only goes forward and makes me guess the inflation rate." — no past-year mode; the most common inflation-calculator job can't be done. → tool fix (additive): a "From a past year" mode — inputs: amount + year (1913–2025); output: value in today's dollars = amount × latest CPI-U ÷ that year's CPI-U annual average, cumulative inflation and average yearly rate, using embedded BLS CPI-U data cited on the page. The existing forward mode, its inputs and outputs stay unchanged. Worked example: $52,000 × 336.94 ÷ 218.056 = $80,350; cumulative +54.5%.
- "It says 3% is a placeholder — I typed 2.6." — hint text is static. → tool fix: the hint reads the current rate ("The 2.6% rate above is your assumption, not a forecast"). No math change.
- Long intro pushes the tool 1,087px down on a phone — not a fix row (intro set by the content standard).

## Monetization
Verdict: fit
YMYL (money) → books only. The result is "money left as cash loses X% of its buying power" or "this return beats inflation by Y%". The next step for this person is deciding where money should sit so it keeps up. Ranked product-type list:
1. Book — index investing basics (earning a real return above inflation): 1119404509 *The Little Book of Common Sense Investing* (Bogle)
2. Book — asset allocation incl. inflation-protected bonds and stocks: 1264715919 *The Four Pillars of Investing* (2nd ed., Bernstein)
3. Book — spending and values (making a shrinking dollar go further): 0143115766 *Your Money or Your Life* (Robin & Dominguez)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Real return at or below 0% (cash losing to inflation) | 1119404509 Bogle; 1264715919 Bernstein; 0143115766 Robin | How to earn a return above inflation; building a mix that keeps up; stretching spending meanwhile |
| Real return above 0% | 1264715919 Bernstein; 1119404509 Bogle | Keep the inflation-beating mix balanced; the low-cost index logic behind it |
| Past-year mode (value in today's dollars) | 1119404509 Bogle; 0143115766 Robin | The same buying-power lesson for money they hold now |
