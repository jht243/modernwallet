## Live verification
- https://www.themodernwallet.com/hysa-vs-cd-calculator/ — 200
- https://www.themodernwallet.com/investing/high-yield-savings-calculator/ — 200
- https://www.themodernwallet.com/mileage-deduction/irs-mileage-rate-2026/ — 200
- https://www.themodernwallet.com/mortgage-recast-calculator/ — 200
- https://www.themodernwallet.com/mortgage/payoff-calculator/ — 200
- https://www.themodernwallet.com/portfolio/60-40-portfolio-calculator/ — 200
- https://www.themodernwallet.com/retirement/social-security-retirement-calculator/ — 200
- https://www.themodernwallet.com/trump-account-vs-529-calculator/ — 200
- https://www.themodernwallet.com/trump-account/ — 200
- https://www.themodernwallet.com/mortgage/payoff-calculator/ — affiliate picks: OK (data-tool-picks="payoff-calculator", tag soulcircle01-20, 3 pinned ASINs)
- https://www.themodernwallet.com/retirement/social-security-retirement-calculator/ — affiliate picks: OK (data-tool-picks="social-security-retirement-calculator", tag soulcircle01-20, 4 pinned ASINs)
- https://www.themodernwallet.com/investing/high-yield-savings-calculator/ — affiliate picks: OK (data-tool-picks="high-yield-savings-calculator", tag soulcircle01-20, 4 pinned ASINs)
- https://www.themodernwallet.com/mileage-deduction/irs-mileage-rate-2026/ — affiliate picks: OK (data-tool-picks="irs-mileage-rate-2026", tag soulcircle01-20, 4 pinned ASINs)
- https://www.themodernwallet.com/portfolio/60-40-portfolio-calculator/ — affiliate picks: OK (data-tool-picks="60-40-portfolio-calculator", tag soulcircle01-20, 4 pinned ASINs)
- https://www.themodernwallet.com/trump-account/ — affiliate picks: OK (data-tool-picks="trump-account", tag soulcircle01-20, 4 pinned ASINs)

### Browser check (STEP 6, live site, 1366px and 390px)
- Picks change with the result on all 6 tools: HYSA ≥$50k → index-investing books, <$50k → savings books; mortgage payoff with extra → payoff books, no extra → homebuying; retirement no SS → SS books, SS entered → income books; mileage ≥$5k vs <$5k; 60/40 near-target vs >65% stocks; Trump Account age 0–9 vs 10–17. Every link `amazon.com/dp/<ASIN>?tag=soulcircle01-20`, disclosure shown, no console errors, no horizontal scroll at 390px.
- Persona frictions re-walked: mortgage 6.875% now 6.875 (existing-loan mode: $1,639 P&I, +$300 → 8 yrs 3 mo sooner, $99,233 saved); HYSA after-tax $6,951 at 22%; retirement ≈ $3,531/mo in today's dollars; 60/40 "$18,000 over · $38,000 under"; mileage Topic 511 note.
- Tracking (verify_beacons.cjs): PASS view=1 use=1 on /hysa-vs-cd-calculator/, /trump-account-vs-529-calculator/, /mortgage-recast-calculator/, /mortgage/payoff-calculator/, /investing/high-yield-savings-calculator/.
- Other changed URLs, 200: /auto-loan/amortization-schedule/, /mileage-deduction/, /mileage-deduction/standard-mileage-vs-actual-expenses/, /mileage-deduction/doordash-mileage-deduction/, /mortgage/early-payoff-calculator/, /cd-calculator/, /interest-per-day/, /real-estate/.
- IndexNow: INDEXNOW OK 200 via api.indexnow.org, 12 URLs.
- Gate note: the first `live` run failed the picks check only because `page_bundle()` read `<script src>` chunks but not Astro island `component-url` chunks, where client:only picks live; fixed in scripts/tool_usage/tool_usage_gate.py (one line), then the gate passed.
