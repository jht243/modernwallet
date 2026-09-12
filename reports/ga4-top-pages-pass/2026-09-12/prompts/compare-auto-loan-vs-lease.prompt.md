# Row — compare/auto-loan-vs-lease

route: /compare/auto-loan-vs-lease/
slug: auto-loan-vs-lease
page type: comparison
medium: text → text
register: operator
primary keyword: auto loan vs lease
secondary keywords: lease vs buy car, car loan vs lease, is it better to lease or finance a car
intent: a reader deciding whether to take an auto loan (finance/buy) or lease their next vehicle
depth floor: 1,500 body words (comparison)
optionAName: Auto Loan
optionBName: Car Lease

## CLOSED FACT LIST — every number, date, or claim the page may state
Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is
unpublished and tell the reader to verify at the vendor/regulator page. Where a fact is contested, say so.

1. Leasing a car generally produces a lower monthly payment than financing the same vehicle, because
   a lease payment covers the vehicle's expected depreciation over the lease term plus a rent charge
   (a finance-charge-like cost), taxes, and fees — not the vehicle's full price. (FTC)
2. Most vehicle leases cap annual mileage at 15,000 miles or less. Driving beyond that limit means an
   additional per-mile fee charged when the car is returned at lease end. Choosing a higher mileage
   allowance up front raises the monthly lease payment. (FTC)
3. At the end of a lease, the driver must return the vehicle — unless the lease agreement includes an
   option to buy it — and is responsible for excess wear and damage and any missing equipment. (FTC)
4. Ending a lease before its term is up can trigger a substantial early termination charge. (FTC)
5. A lessee must maintain insurance that meets the leasing company's standards and service the vehicle
   according to the manufacturer's recommended schedule for the life of the lease. (FTC)
6. With an auto loan, each monthly payment builds equity in the vehicle. The owner can sell or trade in
   the vehicle at any time and keeps whatever equity has built up. A leased vehicle builds no equity for
   the driver unless the lease includes and they exercise a purchase option. (FTC)
7. A down payment on a loan, or a "capitalized cost reduction" on a lease, reduces the amount financed
   or the monthly lease payment — but neither the FTC guide nor the CFPB guide state a universal minimum
   or a specific typical dollar amount for either; this varies by lender, lease company, and deal, so tell
   the reader to get that number from their specific offer rather than assuming a figure. (FTC; CFPB)
8. Typical auto loan terms run roughly 3 to 7 years (36 to 84 months). Once the loan is fully paid off,
   the owner has no more payments and keeps the vehicle outright. (CFPB)
9. A consumer shopping for either a loan or a lease should compare offers and check their own credit
   report first (available free at annualcreditreport.com), since credit history affects both loan
   approval and the interest rate or lease terms offered. (FTC)
10. Do not state a specific national-average APR, money factor, or residual-value percentage for leases
    or loans — neither source on the closed URL list publishes one, and these vary by lender, credit
    profile, and vehicle. Tell the reader to get their own specific rate/money-factor quote and residual
    value from the dealer or lender rather than relying on an assumed number.
11. Existing ModernWallet tools already compute real numbers for the loan side: an auto loan payment/
    payoff calculator, a refinance calculator, and an extra-payment calculator all exist on this site
    (real, already-built routes given in "internal links" below) — direct the reader to run their own
    numbers there rather than inventing a worked example with fabricated rate/price inputs.

## CLOSED URL LIST — the only external hrefs allowed (also to allowed-urls.txt)
- https://consumer.ftc.gov/financing-or-leasing-car — FTC, "Financing or Leasing a Car"
- https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-about-leasing-versus-buying-a-car-en-815/ — CFPB, "What should I know about leasing versus buying a car?"
- https://www.annualcreditreport.com — the only authorized free credit report source (named in the FTC guide)

## Internal links this page may use (real routes only)
- /auto-loan/ — the auto loan calculator hub (this run's winner page)
- /auto-loan/payoff-calculator/ — auto loan payoff calculator
- /auto-loan/refinance-calculator/ — auto loan refinance calculator
- /auto-loan/car-affordability-calculator/ — car affordability calculator
- /auto-loan/extra-payment-calculator/ — extra payment calculator

## What to cover, section by section
1. Intro — the core mechanical difference: a loan finances the whole vehicle and builds equity; a lease
   is closer to a long-term rental of the vehicle's depreciation, at a lower monthly cost, with no equity.
2. Section — "How the Two Costs Are Actually Structured" — walk through fact 1 (what a lease payment
   covers vs what a loan payment covers) and fact 6 (equity).
3. Section — "The Mileage and Wear Rules That Catch Lease Drivers Off Guard" — facts 2, 3, 5 (mileage cap,
   excess-mileage fee, wear-and-tear, insurance/maintenance obligations).
4. Section — "What Happens If You Want Out Early" — fact 4 (early termination charge on a lease) vs.
   selling or trading a financed vehicle at any time (fact 6) — a genuinely asymmetric risk between the two.
5. Section — "Who Actually Comes Out Ahead, and When" — a non-obvious insight: someone who drives well
   under the mileage cap, likes swapping vehicles every few years, and keeps the same monthly-payment
   budget either way tends to favor leasing; someone who drives high annual mileage, keeps vehicles a long
   time past loan payoff, or wants an asset they can sell tends to favor financing. Ground this in facts 1,
   2, 6, 8 only — do not invent a specific dollar break-even, since fact 10 forbids assuming a rate/residual.
6. comparisonTable — dimensions: monthly payment (fact 1), what builds (fact 6), mileage limits (fact 2),
   end-of-term obligation (fact 3), early exit cost (fact 4), typical commitment length (fact 8 for loan;
   note leases are commonly shorter multi-year terms but do not invent a specific lease-term number not on
   the fact list — say "set by the lease agreement, commonly shorter than a loan term" without a figure).
7. verdict — names the condition that decides it (mileage habits + how long they keep vehicles + whether
   they value ending up owning an asset), not a blanket winner.
8. FAQs (use these real autocomplete-derived question shapes, verbatim where natural):
   - "Is it cheaper to lease or finance a car?"
   - "What happens if I go over my mileage limit on a lease?"
   - "Can I get out of a car lease early?"
   - "Do I get anything back at the end of a car lease?"
   - "Is it better to buy or lease a car if I drive a lot?"
9. Close on a concrete next action: pointing the reader who chooses financing to run their own numbers on
   ModernWallet's auto loan calculators (internal links above) before signing.

## Objectivity rule
Neither option is the automatic winner. At least one comparisonTable row must favor leasing (lower
monthly payment; fact 1) and at least one must favor financing (equity/ownership; fact 6). The verdict
states the reader condition that decides it, not a universal recommendation.

# CORRECTIONS FROM THE PHASE 4 AUDIT (rework attempt 1/2)
Defect: monotone-rhythm. The first draft ran 68 of 71 body sentences in the long band (15+ words), with
one run of 26 consecutive long sentences in a row — fails the sentence-rhythm gate (`_content-standard.md`
STYLE / AUDITOR: no run of 10 consecutive sentences may sit in a single length band).
Fix: actively vary sentence length throughout every section and the intro. Mix in short sentences (1-8
words) and medium sentences (9-14 words) between the long ones — short sentences should land on the
actual point (a real fact from the closed fact list), not be padding. Do not write two consecutive
sections in the same rhythm. Re-read your own draft sentence by sentence before returning it and break up
any stretch of more than 4-5 sentences that all run long.
Also: fabricated example numbers are banned even as "illustrative" figures — every dollar figure and
every year must come from the CLOSED FACT LIST above. Do not invent a magnitude ("hundreds or thousands
of dollars") for any cost that has no number on the fact list; state the mechanism instead.
