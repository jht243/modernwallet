---
mindmap_pass_date: 2026-11-04
source: free-form input brief (trend-pass top queries + research pack), SEMRUSH-validated
interpreted_brief: Top queries for the 7 days ending 2026-11-04 (4 queries, 0 clicks, 1-3 impressions each, same set as 2026-11-03) plus Lane A/B research (no clear trend; 4/4 covered). Lane C probed the living-trust family (definition/mechanism intent) and the "which retirement calculator" family.
generated_by: mindmap-pass build phase (trend-pass Lane C) - demand ladder (volume=semrush, kd=semrush, expand=semrush; dataforseo for SERP) + 6 live SERP reads + coverage_lookup + independent duplicate reviewer (Explore subagent)
demand_source: semrush
serp_reads: 6 heads read, DataForSEO ~$0.0126
status: no-actionable-rows
---

## Preparation check
| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed (no new-page rows; build bundle 35/35 read, check passed) | reports/mindmap-pass/2026-11-04-trend-lane-c.volumes.json, .volumes2.json, .expand.*.json, .serp.json, .serp2.json |

## Duplicate check
passed -- 1 new-page row checked, 1 matched an existing page (/guides/what-is-a-family-trust; reviewer RECLASSIFY to body enrichment).

## Emerging search patterns (clusters)
No emerging clusters detected this run.

## Candidates considered (no table rows)
- /guides/what-is-a-living-trust ("what is a living trust" 14,800/mo KD 40; "revocable living trust" 22,200 KD 47; "what is a revocable living trust" 4,400 KD 35; SEMRUSH us 2026-11-04). SERP locked, AI Overview present. Independent reviewer: RECLASSIFY to `update existing body text` on /guides/what-is-a-family-trust (guides.ts ~L18432), which already defines the living trust under the "family trust" name but never uses the living-trust terms in a heading/FAQ. Missing: "how a living trust works" walkthrough, what it does NOT do, downsides, types of trusts, three FAQs, links to /guides/how-to-fund-a-trust and /guides/is-a-living-trust-worth-it. **HELD, not built this run**: the additive section (content_gen.py section + Phase 4 audit + rendered audit) was not executed in this run. Re-competes next run; not DROPPED.
- trust and will reviews (5,400/mo KD 33), trust and will vs legalzoom: HELD, vendor pricing not groundable unattended (see ledger 2026-11-03).
- dave ramsey retirement calculator (22,200/mo KD 36), nerdwallet retirement calculator (18,100 KD 72): branded competitor queries; served by /roundup/best-retirement-calculators and the calculators hub. DROP (same as 2026-11-03).

## Exclusions
- best trust services (70/mo KD 58), living trust services (110/mo KD 30): DROP, /roundup/best-living-trust-services/ exists.
- best retirement calculator (9,900/mo KD 55): DROP, /roundup/best-retirement-calculators/ exists; SERP contested.
- Commits checked: git log -S "what-is-a-living-trust" returns nothing; no page created.
