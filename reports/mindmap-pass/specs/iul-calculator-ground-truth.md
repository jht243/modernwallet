# IUL calculator — engine ground truth (2026-08-30)

Every number in the page copy for /iul-calculator/ comes from this output, per CONTENT.md item 2.
Regenerate: `node /tmp/gt.mjs` against `src/lib/iul.ts`.

```
== DEFAULT PRESET (40yo, $12k/yr x20, $500k DB, 9% cap, 7% index, to age 70) ==
totalPremium         $240,000
finalCashValue       $583,785
finalSurrenderValue  $583,785
uncappedFinal        $1,277,172
capCostCompounded    $693,386
totalCOI             $49,109
totalExpenses        $18,000
finalBaseline(401k)  $1,520,634
gap (IUL - 401k)     $-936,849
crossoverYear        null  lapseYear null
y1  credited 9% index 19.7% capCost $1,207 coi $1,219 cv $10,956 surr $9,860
y10 credited 9% index 16.7% coi $1,828 cv $132,266
y30 coi $2,047 cv $583,785
first 0% credited yr: 3 index was -8.3% cv fell to $32,120 from $22,320 coi $1,360

== BROKERAGE BASELINE ==
finalBaseline(brokerage) $714,425 gap $-130,639

== MIN-FUNDED LAPSE ($2,400/yr x15 on $750k DB, to 85) ==
lapseYear 7 age 46 | coi that yr $2,966 | total premium paid by then $16,800
0%-credited years AFTER funding stops (yr>20):
 y23 age62: index -8.3% credited 0% | cv $408,053 -> $406,684 (FELL by $1,370) | coi $1,250 + admin $120
 y27 age66: index -16.3% credited 0% | cv $481,559 -> $480,104 (FELL by $1,456) | coi $1,336 + admin $120

Also every 0% year while funding (premium masks the drop):
 y3: cv $22,320 -> $32,120 (premium $12,000 came in)
 y7: cv $71,445 -> $80,949 (premium $12,000 came in)
 y13: cv $174,874 -> $184,058 (premium $12,000 came in)
 y17: cv $251,693 -> $260,823 (premium $12,000 came in)
```
