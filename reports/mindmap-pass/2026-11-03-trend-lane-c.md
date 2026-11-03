---
mindmap_pass_date: 2026-11-03
source: free-form input brief (trend-pass top-10 queries + research pack), SEMRUSH-validated
interpreted_brief: Top queries for the 7 days ending 2026-11-03 (4 queries, 0 clicks, 1-3 impressions each) plus Lane A/B research (no clear trend; 4/4 covered). Lane C probed the living-trust/online estate-document family (Trust & Will, LegalZoom) and the "which retirement calculator" question family.
generated_by: mindmap-pass build phase (trend-pass Lane C) - demand ladder (volume=semrush, kd=semrush, expand=semrush; dataforseo for SERP) + Autocomplete question sweep (2 seeds, 61 suggestions) + 3 live SERP reads + independent duplicate reviewer
demand_source: semrush
serp_reads: 3 heads read, DataForSEO $0.0063
status: no-actionable-rows
---

## Preparation check
| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | reports/mindmap-pass/2026-11-03-trend-lane-c.volumes.json, .volumes2.json, .expand.*.json, .autocomplete.*.csv, .serp.json |

## Duplicate check
passed -- 0 new-page rows checked, 0 matched an existing page (3 candidate rows probed via coverage_lookup.py; none survived to a row). 

## Emerging search patterns (clusters)
No emerging clusters detected this run.

## Candidates considered (no table rows)
- compare/legalzoom-vs-trust-and-will — "trust and will vs legalzoom" 390/mo KD 8 (SEMRUSH us, measured); PAA "Which is better, LegalZoom or trust and will?"; SERP contested, AI Overview present. lookup: no dedicated vs page (roundup/best-living-trust-services and compare/power-of-attorney-vs-trust list both vendors). **HELD (YMYL source not groundable unattended).** Trust & Will pricing verified live today at trustandwill.com/pricing (Trust Plan $499, Will Plan $199, attorney +$299, $49/yr membership). LegalZoom's living-trust page (legalzoom.com/estate-planning/living-trust) renders no price to a non-JS fetch, and the existing roundup itself labels LegalZoom trust pricing "~$279 (verify current)". One side of the table cannot be sourced, so no page. Re-competes next run (same as the 2026-10-19 HELD row).
- "trust and will review" 260/mo KD 17, "is trust and will legit" 720/mo KD 20: same HELD blocker for the vendor-fact side; roundup/best-living-trust-services carries the Trust & Will entry.
- retirement-calculator accuracy cluster ("most accurate retirement calculator" 170/mo KD 55, "which retirement calculator is most accurate" 10, "do retirement calculators account for inflation" 20, "why do retirement calculators vary so much" 0): DROP. SERP locked (google/forum/blog mix, AI Overview), demand 0-170/mo, and /roundup/best-retirement-calculators already compares calculators by method, inflation, taxes and Social Security.

## Exclusions
- best trust services (70/mo KD 58), living trust services (110/mo KD 30), best online trust services (20): DROP. /roundup/best-living-trust-services/ (live).
- nerdwallet retirement calculator (18,100/mo KD 72), nerdwallet calculator retirement (110): DROP. Branded competitor query; /calculators/, /retirement/ hub and the retirement calculators serve the generic intent (same disposition as ledger 2026-10-19 to 2026-10-29).
- Commits checked: git log -S "trust-and-will" returns only c658f5e (ga4-top-pages ledger note); no page created.
