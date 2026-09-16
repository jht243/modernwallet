# DATA — zakat FAQ addition: catch-up zakat for missed/previous years

target page: /zakat/ (src/data/calculators.ts, id: "zakat")
task: add ONE new FAQ Q/A to the zakat hub's `faqs` array. Output is a single FAQ answer, no
heading. This is the 7th, lower-priority FAQ in this run — only proceed if the 6 priority FAQs
are already done.

question (verbatim): "How do I calculate zakat I owe from previous years I didn't pay?"

register: operator
page type: hub / section index

## Why this FAQ (context, not for the reader)
"zakat year calculator" and "zakat calculator for previous years" — distinct from the current-year
worked example already on the page.

## CLOSED FACT LIST
Anything not on this list, you do not know.
1. Catch-up (missed-year) zakat is calculated sequentially, year by year, not as a flat repeat of
   the current year's 2.5% on the same starting balance. For each missed year in order: calculate
   2.5% of that year's zakatable wealth, then subtract that amount from the wealth total before
   moving to the next year's calculation — the missed zakat is treated like a debt owed, so each
   subsequent year's calculation starts from a reduced principal. Source:
   https://seekersguidance.org/answers/hanafi-fiqh/how-do-i-pay-zakat-from-previous-years/
2. Worked mechanism (restate the source's own example as an illustration, do not present as this
   reader's numbers): starting from 500 grams of gold, year one's zakat is 2.5% of 500g (12.5g),
   which leaves 487.5g; year two's zakat is then 2.5% of that reduced 487.5g figure, and so on for
   each additional missed year. Source: https://seekersguidance.org/answers/hanafi-fiqh/how-do-i-pay-zakat-from-previous-years/
3. This site's calculator computes one year at a time — restate as established internal fact, no
   citation needed: to reconstruct multiple missed years, the reader runs the calculator once per
   missed year, using that year's own asset figures, and manually carries the prior year's zakat
   forward as a deduction the way fact 1 describes; the calculator does not do this multi-year
   chaining automatically.

## CLOSED URL LIST (external — the ONLY href this FAQ may use)
- https://seekersguidance.org/answers/hanafi-fiqh/how-do-i-pay-zakat-from-previous-years/

## Task
Write a 3-4 sentence FAQ answer. Lead with the direct answer: calculate each missed year in
sequence, treating the previous year's unpaid zakat as a deduction before figuring the next year's
amount. Briefly illustrate with the sourced example. Note the calculator has to be run once per
missed year. Do not invent a number of years or a dollar figure.
