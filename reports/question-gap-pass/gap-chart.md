# Question-Gap-Pass Auto — Gap Chart (2026-09-05)

20 pages analyzed via 4 parallel Phase 2+3 sub-passes (real GSC top-90-day-click pages + real Google
PAA questions via DataForSEO + locally generated follow-ups). Full per-question tables are in the
4 sub-agent outputs summarized below; this file records the AUTO-APPROVED action set actually executed
in Phase 4, applying the deterministic rule: every Add/Strengthen/Link the sub-passes produced is
auto-approved, subject to the existing high-value/not-elsewhere filters. Three items were DROPPED
(not auto-approved) because no primary source could ground them without fabrication, per the YMYL
hard rule — "ground every claim or DROP the enrichment":
- "What does Dave Ramsey say about UTMA accounts?" / "...about 529?" (2 pages) — Ramsey Solutions'
  specific published stance on UTMA/529 accounts was not verified from a primary source.
- "Why are people boycotting 529 plans?" (2 pages) — no grounded, verifiable basis for this PAA claim.
- Exact dollar figures for E7/average military retirement pay, IRS payment-plan modification fees,
  "Americans with $1M in liquid/retirement assets," and SNT-specific tax/Section-8 mechanics — written
  as hedged, non-numeric answers (pointing to the DoD pay chart / existing site tools) rather than
  invented figures, per each sub-pass's explicit flag.

## Add / Strengthen (executed — see commit diff for exact text)

| Page | Question | Action |
|---|---|---|
| /compare/trump-account-vs-brokerage-account/ | Does the $1,000 Trump Account seed expire or have a claim deadline? | Add |
| /trump-account/ | Does an adopted child qualify for a Trump Account the same as a biological child? | Add |
| /compare/trump-account-vs-savings-account/ | Does a Trump Account or kids savings account affect SNAP/Medicaid eligibility? | Add |
| /investing/withdrawal-calculator/ | What is the 7% withdrawal rule? | Add |
| /investing/withdrawal-calculator/ | How long will $500,000 last in retirement at 62? | Strengthen |
| /investing/withdrawal-calculator/ | How much do I need in a 401(k) to get $3,000/month? | Add |
| /net-worth/liquid-net-worth-calculator/ | How many Americans have $1,000,000 in liquid assets? | Add (hedged) |
| /portfolio/60-40-portfolio-calculator/ | How many Americans have $1,000,000 in retirement? | Add (hedged) |
| /retirement/military-retirement-calculator/ | How much is E7 retirement pay with 20 years? | Strengthen (hedged) |
| /retirement/military-retirement-calculator/ | How much does a retired military member make a month? | Strengthen (hedged) |
| /compare/custodial-roth-ira-vs-utma/ | What are the downsides of the account not already covered — full list? | Link (see below) |
| /compare/529-vs-utma/ | What is the 529 loophole (Roth IRA rollover)? | Link (see below) |
| /tax-resolution/irs-payment-plan-calculator/ | Is it a good idea to do a payment plan with the IRS? | Add |
| /tax-resolution/irs-payment-plan-calculator/ | What if I can't afford an IRS payment plan? | Strengthen |
| /estate-planning/living-trust-cost-calculator/ | What is the downside of having a living trust? | Strengthen |
| /estate-planning/living-trust-cost-calculator/ | What is the "7 year rule" for trusts? | Add (myth-bust) |
| /estate-planning/ | What are common mistakes to avoid in estate planning? | Add |
| /roundup/best-estate-planning-software/ | Which child should be executor? | Add |
| /elder-care/special-needs-trust-calculator/ | How much money can a special needs trust hold? | Strengthen |
| /elder-care/special-needs-trust-calculator/ | What is the downside of a special needs trust? | Strengthen |
| /roundup/best-ira-accounts/ | Is it better to put money in a CD or an IRA? | Add |
| /roundup/best-ira-accounts/ | Where can I get 7% interest on my money? | Add (hedged) |
| /roundup/best-ira-accounts/ | Where can I put $10,000 to make the most money? | Strengthen |

## Link (executed — one high-value, genuinely-missing link per page, capped)

| Page | Target | Question it answers |
|---|---|---|
| /compare/trump-account-vs-baby-bonds/ | /compare/trump-account-vs-529/ | Key differences between a 529 plan and a Trump Account |
| /guides/trump-account-worth-it/ | /investing/roth-ira-calculator/ | How much will $10,000 in a Roth IRA be worth in 20 years |
| /compare/custodial-roth-ira-vs-utma/ | /compare/custodial-account-vs-savings-account/ | Can I take the UTMA money back for myself |
| /compare/custodial-roth-ira-vs-brokerage-account/ | /compare/iul-vs-roth-ira/ | How much will $10,000 in a Roth IRA be worth in 20 years |
| /compare/529-vs-utma/ | /guides/529-leftover-money-options/ | What is the 529 loophole |
| /compare/trump-account-vs-529/ | /guides/trump-account-worth-it/ | (SNAP/Medicaid theme — link forward once added there) |
| /investing/high-yield-savings-calculator/ | /guides/pay-off-debt-or-invest/ | Should I put money in a HYSA or pay off debt first |
| /portfolio/60-40-portfolio-calculator/ | /guides/how-to-retire-with-1-million/ | How long will $1,000,000 last using the 4% rule |
| /estate-planning/living-trust-cost-calculator/ | /roundup/best-estate-planning-software/ | What assets cannot be placed in a trust |
| /estate-planning/ | /guides/probate-process-guide/ | What happens if I die without a will |
| /roundup/best-estate-planning-software/ | /compare/living-trust-vs-will/ | Is it better to put your estate in a trust or a will |
| /elder-care/special-needs-trust-calculator/ | /compare/special-needs-trust-vs-able-account/ | SNT vs ABLE account |
| /roundup/best-ira-accounts/ | /compare/rollover-ira-vs-traditional-ira/ | Does an IRA protect my money in a lawsuit/bankruptcy |

## Skipped (already clear, already linked, or below the value bar)
See the 4 sub-pass outputs for the full per-page question tables (~90 questions total). The large
majority of PAA + generated questions scored `clear` against their own page or were already linked
by the 2026-08-29 run (verified live against the current file, not just the cache).

## Audit
See Phase 5 section of the run email for pass/fail counts.
