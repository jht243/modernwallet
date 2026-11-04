# Sources — /biweekly-mortgage-calculator/ (checked 2026-11-04)
- Regulation Z, 12 CFR 1026.36(c)(1)(i)-(ii), CFPB: https://www.consumerfinance.gov/rules-policy/regulations/1026/36/
  Fetched 2026-11-04. (c)(1)(i): a servicer must credit a periodic payment as of the date of receipt. (c)(1)(ii): a servicer that retains a partial payment (less than a periodic payment) in a suspense or unapplied funds account must disclose it on the periodic statement and, once enough funds accumulate to cover a periodic payment, treat them as a periodic payment received.
  Use: a half-payment is a partial payment, so a servicer may hold it until a full payment builds up; the calculator's "applied when paid" model is the upper bound and the DIY 1/12-extra path is the comparison that does not depend on servicer timing.
- Inherited citation found dead: the CFPB Ask page ".../26-bi-weekly-mortgage-payments...-en-203/" cited on /mortgage/extra-payment-calculator/ now redirects to https://www.consumerfinance.gov/consumer-tools/mortgages/ (curl 2026-11-04). Not used on the new page.
- Amortization formula: payment = B × r ÷ (1 − (1 + r)^−n), already used site-wide (src/lib/mortgage-recast.ts).
- Arithmetic fact: 26 half-payments a year = 13 full monthly payments' worth (26 ÷ 2).
- Plan fees: no fee is asserted as standard; setup and per-debit fees are reader inputs.
