# DATA — zakat FAQ addition: currency-agnostic

target page: /zakat/ (src/data/calculators.ts, id: "zakat")
task: add ONE new FAQ Q/A to the zakat hub's `faqs` array. Output is a single FAQ answer, no
heading (this is an FAQ answer insert, not a section).

question (verbatim): "Does this zakat calculator work in currencies other than US dollars?"

register: operator (matches the existing hub's voice — see the page's current text below)
page type: hub / section index (this is an addition to an existing hub, not a new page)

## Why this FAQ (context, not for the reader)
71 country/currency search variants (bd, bangladesh, cad, dubai, euro, india, naira, pakistan,
philippines, ksa, kuwait, kerala, sri lanka, maldives, nz, nigeria, norway, netherlands, oman,
qatar, riyal, rupees, singapore, south africa, saudi arabia, taka, trinidad, uk, uae, usd, uganda,
yen, aed, australia, hyderabad, hk, dollars, peso, and more) show real demand for making explicit
that the live calculator is currency-agnostic. This is the single largest cluster in this run.

## CLOSED FACT LIST
Anything not on this list, you do not know.
1. This site's zakat calculator (restate as established internal fact — the page's own current
   text below already establishes this, no external citation needed): the calculator does not
   hardcode a dollar nisab figure. It asks the user to enter today's gold or silver price PER GRAM
   in whatever currency they hold their wealth in, and derives the nisab threshold and the final
   zakat amount in that same currency. The math (87.48 grams of gold or 612.36 grams of silver
   times the entered price-per-gram, then 2.5% of net zakatable wealth) is unit-and-currency
   agnostic — it works the same whether the reader enters a price in US dollars, rupees, ringgit,
   riyal, naira, or any other currency, as long as every figure they enter (asset values, debts,
   and the metal price) uses the SAME currency consistently.
2. The reader is responsible for finding today's local gold/silver price in their own currency —
   this calculator does not auto-convert between currencies or auto-fetch a live price feed; the
   reader enters the number themselves (this is already established on the page: "Check Kitco's
   live gold and silver spot prices for today's per-gram figure").

## CLOSED URL LIST (external — NONE needed/allowed for this FAQ; do not add a new external link)

## Task
Write a 2-4 sentence FAQ answer. Lead with the direct answer (yes, it works in any currency).
State the mechanism (enter your local price-per-gram, keep every figure in the same currency).
Do not invent any currency-specific nisab dollar figures. Do not add a new external link — this
answer restates an internal mechanism already documented on the page.
