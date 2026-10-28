# florida-amendment-3-calculator — /florida-amendment-3-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials on the runner). Intent from the H1 "Florida Amendment 3 Property Tax Calculator" and target keyword "florida amendment 3 property tax calculator". The vote is November 3, 2026 — six days after this run.
- STEP 1 numbers (data_days = 20, early): people 16, uses 18, views 46, use_rate 0.391, people_7d 12. First time worked.

## Persona
- Who/where: a Hillsborough County homesteader on a phone, TRIM notice in hand, deciding how to vote next Tuesday; assessed (Save Our Homes) value $212,480; county + city + district millage adds to 13.6421.
- Job: "What does Amendment 3 save me, in dollars, on my own bill?"
- Done = a yearly savings number for 2027 and 2028.

## Walkthrough
Desktop 1366px (`screenshots/florida-amendment-3-calculator-desktop.png`):
1. Page 200 in ~2.2s, `data-tool` root 471px down. Two inputs: Assessed value of your homestead ($400,000), non-school millage (10.5). Hint explains mills and says to use the county, city and district lines, not the school line.
2. Typed 212480 and 13.6421 (four decimals as printed on a TRIM notice — kept intact).
3. Result: "Yearly savings once fully phased in (2028) $2,197 — $1,345 in 2027 if Amendment 3 passes". Non-school bill today $2,197, 2027 $852, 2028 $0; extra exempt $98,589 (2027) / $161,069 (2028); a capped note explains the exemption can't exceed the home's value. Re-computed: (212,480 − 51,411) × 0.0136421 = $2,197.33; (212,480 − 150,000) × 0.0136421 = $852.36. Correct for the tool's stated inputs.
4. The job is done in two fields. One point: the "Florida TaxWatch" source link in the footnote is a small inline target (under 24px tall).
Phone 390px (`screenshots/florida-amendment-3-calculator-mobile.png`):
1. Same result; root 934px down; scrollWidth 390; no console errors; same small inline source link.

## Friction
- none blocking. The persona got their number at both widths. The small inline footnote link is ordinary body-link sizing, not a control — no row.
- Not this routine's job but noted for the owner: after the November 3 vote the tool's "if Amendment 3 passes" framing needs an outcome update (a content-freshness item, not a tool-usage friction).

## Monetization
Verdict: no-fit
The result is an estimated tax saving that informs a vote. The visitor's next step is voting and reading their TRIM notice; no product or book follows from it — a property-tax or homestead book would read as bolted on, and there is no mainstream current Florida-homestead title that would help more than the county property appraiser's own page. Nothing placed.
