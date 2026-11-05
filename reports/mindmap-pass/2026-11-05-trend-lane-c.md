---
mindmap_pass_date: 2026-11-05
source: free-form input brief (trend-pass top queries + research pack), SEMRUSH-validated (reused 2026-11-04 paid discovery, no new spend)
interpreted_brief: Top queries for the 7 days ending 2026-11-05 (4 queries, 0 clicks, identical to 2026-11-04) plus Lane A/B research (no clear trend; 4/4 covered). Lane C re-competes yesterday's HELD candidate, a living-trust definition/mechanism section on the existing family-trust guide.
generated_by: mindmap-pass build phase (trend-pass Lane C) - demand ladder reused from 2026-11-04 (volume=semrush, kd=semrush; dataforseo SERP; volumes.json, volumes2.json, serp.json, serp2.json) + coverage_lookup. No new paid calls.
demand_source: semrush
serp_reads: 0 new (6 heads reused from 2026-11-04, DataForSEO ~$0.0126 spent yesterday)
status: blocked-preparation
---

## Preparation check
| Check | Result | Evidence |
|---|---|---|
| Preparation check | ❌ Failed - build blocked | Build bundle 37/37 and write bundle 34/34 read, both `check` passed. BLOCKED: `content_gen.py section` requires a `chart-review.json` written by a reviewer distinct from the manifest author (`mindmap-gates.py` independent()). The builder has no subagent-spawn tool in this environment, so no independent chart reviewer could be run and no review was fabricated. |

## Action chart

| # | problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Lens 2 / top-10 (living trust services, best trust services). 'what is a living trust' 14,800/mo KD 40, 'revocable living trust' 22,200 KD 47, 'what is a revocable living trust' 4,400 KD 35 (SEMRUSH us, measured 2026-11-04, volumes.json). lookup: /guides/what-is-a-family-trust - explains family/living trust but no living-trust heading, walkthrough or FAQ; /guides/is-a-living-trust-worth-it - cost/break-even (different job). | Add a section 'What a Living Trust Is and How It Works' (walkthrough, what it does not do, downsides, trust types, 3 FAQs, links to /guides/how-to-fund-a-trust and /guides/is-a-living-trust-worth-it) to /guides/what-is-a-family-trust via content_gen.py section; additive only. | update existing body text | /guides/what-is-a-family-trust/ | n/a | n/a | n/a | locked (AI Overview) | 2026-11-04 serp.json: locked SERP, AI Overview present | What is a living trust and how does it work? [verb/definition pattern; PAA per 2026-11-04 serp.json] | A living trust is a trust you create while alive and fund with your assets so a trustee you name can manage and pass them on without probate; it does not shield assets from creditors or save income tax while revocable (definition). | section 1 or 2 of the guide | top-10 |

## Emerging search patterns (clusters)
No emerging clusters detected this run.

## Duplicate check
Coverage lookup run inline (scripts/mindmap/coverage_lookup.py --site-url https://www.themodernwallet.com): 1 candidate; strongest home /guides/what-is-a-family-trust (exact slug), parent /guides/is-a-living-trust-worth-it; no commits name the topic; no redirects; no same-run overlap. Result: 1 row is a body enrichment of an existing page, not a new page (reclassification already made by the 2026-11-04 independent Explore reviewer). Independent duplicate-suppression reviewer for TODAY: NOT RUN, builder cannot spawn subagents; the orchestrator must run one.

## Exclusions
- best trust services, living trust services, trust and will reviews, nerdwallet/dave ramsey retirement calculator variants: DROP/HELD as 2026-11-03 and 2026-11-04 (covered by /roundup/best-living-trust-services/, /roundup/best-retirement-calculators/; vendor pricing not groundable unattended).
- Ledger status of row 1: HELD (re-competes). Not DROPPED.
