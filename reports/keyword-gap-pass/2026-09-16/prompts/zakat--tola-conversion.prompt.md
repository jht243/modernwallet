# DATA — zakat FAQ addition: gold/silver unit conversion (tola vs gram)

target page: /zakat/ (src/data/calculators.ts, id: "zakat")
task: add ONE new FAQ Q/A to the zakat hub's `faqs` array. Output is a single FAQ answer, no
heading.

question (verbatim): "My gold is weighed in tola, not grams. How do I use it in this calculator?"

register: operator
page type: hub / section index

## Why this FAQ (context, not for the reader)
24 search variants around gold/silver/tola/gram unit conversions show real demand for an explicit
unit-conversion answer (South Asian jewelers commonly weigh gold in tola, not grams).

## CLOSED FACT LIST
Anything not on this list, you do not know. Never invent a conversion factor.
1. **1 tola = 11.6638 grams** (South Asian tola, the unit commonly used across India, Pakistan,
   and Bangladesh for weighing gold and silver). Source (verified via two independent unit-
   conversion references): https://yconvert.com/convert/weight/tola-to-gram.php and
   https://www.convertunits.com/from/tola/to/grams — both state 1 tola = 11.6638 grams (one gives
   the more precise 11.6638038 grams; jewelers commonly round to 11.664 grams for daily retail
   use — mention this rounding in passing if it fits naturally, do not treat it as a conflict).
2. This site's zakat calculator (restate as established internal fact, no new citation needed):
   already asks for weight/value in grams and already supports BOTH gold and silver as nisab
   standard inputs (the existing page text already documents "87.48 grams of gold, or 612.36
   grams of silver" and a `nisabStandard` choice between the two). A reader whose scale reads
   tola needs to convert to grams first, using the factor in fact 1, before entering a weight- or
   value-based figure into the calculator.

## CLOSED URL LIST (external — the ONLY hrefs this FAQ may use, only if a link genuinely helps)
- https://yconvert.com/convert/weight/tola-to-gram.php

## Task
Write a 2-4 sentence FAQ answer. Lead with the direct answer: give the exact conversion factor
(1 tola = 11.6638 grams) so the reader can convert their own weight. Confirm both gold and silver
are already supported as nisab inputs. Do not invent a different conversion factor or a currency
figure.
