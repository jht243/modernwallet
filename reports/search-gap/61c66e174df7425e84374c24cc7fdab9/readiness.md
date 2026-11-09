# Readiness / application map (BUILD worker: search-gap-build-worker)

Run ID (workflow): 18f61e198cff4ca2b43fe18e0a0859d0. Intake run ID: 61c66e174df7425e84374c24cc7fdab9. Intake sha256 verified: 7bd272a3d04e8e6aa066434f2a64f28871112409b2b56d99886af82a634030c0 (sha256sum matches the dispatcher's value; 2 candidates).

## Preflight
- `workflow-preflight.py prepare --phase build --actor search-gap-build-worker` with instructions: phase-build-brief.md, search-gap-content-auto.md, _vendor-research.md (plus the helper's standard contract set). 38 parts, all read one per call.
- `workflow-preflight.py check` result: `delivery-complete-sources-current` (38 parts). Run dir: `preflight-build/`.
- Note: `check` does not accept `--run-id` (only `prepare` does); `prepare` was given the supplied run id.
- Delivery is not proof of understanding; independent chart reviewer must audit this map.

## Application map
| Rule | Decision / artifact |
|---|---|
| CONTRACT.md 2: send every candidate whole; no wrapper discard; no aliasing, no ignore list | Both candidates retained with IDs/eventIds; `data/search-aliases.json` and `data/search-gap-ignore.json` not opened or edited |
| CONTRACT.md 4/5: decisions per candidate with specific reasons; no forced article | `decisions.json` (one per ID, no duplicates), `chart.md` evidence A/B |
| Coverage lookup / duplicate protection (build-brief) | `coverage-lookup.txt`, base URL https://www.themodernwallet.com |
| Keyword ladder (pinned semrush,dataforseo) | `keyword-volumes.json`: SEMRUSH key absent, DataForSEO not usable here, so autocomplete estimate only, labeled estimate NOT measured. No volumes invented |
| SERP read (Step 4.5) | Not run: no row survived to content, advisory only, no spend |
| Reader question / answer / placement (Step 4.6) | N/A for dropped candidates; no `create`/`update body` rows exist |
| Testing eligibility / labels (_testing-labels, _experience G) | N/A: no content; site's G section excludes financial services testing anyway; no testing claims |
| Decision evidence / takeaway / attribution | N/A (terminal no-addition/dropped branch, no writer, no packet) |
| Vendor research (_vendor-research) | N/A: not a vendor-addition intake; PKO is not a vendor row on any roundup target |
| Rendered audit / live compare | N/A: no content changes |
| Growth record | N/A: no contribution registered |
| Review budget (content-review-policy) | No content audit round consumed; no counters changed |
| Publication scope | commit false, push false, liveVerification false, indexNow false |

## Open items for the independent reviewer
1. Confirm `dropped` vs `no-addition` classification: proposed `dropped` because the input is junk/probe-shaped and off-mission, not a real question already sufficiently answered.
2. Confirm that treating PKO Bank Polski as the charitable reading and rejecting it for non-US scope is the correct reading of the full reader question.
3. Confirm no relevant page exists (independent grep/lookup).
