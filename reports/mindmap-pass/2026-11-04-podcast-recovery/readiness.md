# Readiness evidence — podcast-pain-pass-auto recovery 2026-11-04 (themodernwallet.com)

Scope: recovery of the six deferred rows saved by the 2026-11-03 podcast run (main commit 2b7393f51831a06f918d01ca8cd096ae44c47397). Authorization: the saved scheduled routine prompt (jht243's own routine for jht243/modernwallet) authorizes commit, push to main, live verification and IndexNow for themodernwallet.com within the YMYL finance guardrail; recorded here, not invented.

## Per-row recovery decision (coverage and source freshness revalidated 2026-11-04)
| Deferred row | Decision | Reason |
|---|---|---|
| tax-loss-harvesting (12,100/mo) | BUILD | No dedicated page (git grep + coverage_lookup + live 404); IRS Topic 409, Pub. 550, Rev. Proc. 2025-32 fetched today. Existing /guides/wash-sale-rule-explained/ covers only the wash-sale rule (different reader goal). |
| hsa-triple-tax-advantage (2,400/mo; 'hsa contribution limits 2026' 33,100/mo supporting) | BUILD | No explainer (only /compare/hsa-vs-fsa/, /compare/hsa-vs-roth-ira/ and one tip); IRS Pub. 969 and Rev. Proc. 2025-19 fetched today. |
| brrrr-method (6,600/mo) | BUILD | No BRRRR page; Fannie Mae Selling Guide B2-1.3-03 (12/10/2025) and IRS Pub. 527 fetched today; scenario modeled with saved script. |
| house-hacking (4,400/mo) | DEFER | The only HUD source retrievable today is the 2019 revision of Handbook 4000.1 (PDF), not the current online handbook; FHA occupancy and rental-income rules cannot be cited as current. Next step: fetch the current HUD online handbook section (hud.gov) and CFPB owner-occupancy pages, then rebuild. |
| retirement-budget (1,300/mo) | DEFER | BLS Consumer Expenditure data returned Access Denied and ssa.gov returned 403 to the routine; no current primary spending figures retrievable. Next step: obtain BLS CE tables or another primary source, then rebuild. |
| how-to-appeal-property-taxes (590/mo) | DEFER | Process, deadlines and standards are set by each county or state; no single primary source, and the thin 590/mo demand does not justify an invented national procedure. Next step: pick a jurisdiction-neutral official source (state/county assessor pages) or scope per state. |

## Workflow freshness and instruction reading
- workflow-start.sh --cloud exit 0 (revision 045a43165c0947dff68bf91bf5aa2128ca04b82f, runId 98e209d477fe4c78877f124c1a5678cb).
- Build bundle reports/mindmap-pass/2026-11-04-podcast-recovery/preflight-build: 40/40 parts read sequentially, check = delivery-complete-sources-current. Write bundle preflight-write: 12/12 parts (reuse of build), check = delivery-complete-sources-current. The independent Phase 4 reviewer loads its own audit bundle.

## Application map (rule -> implementing decision)
- Reader question (chart cols 10-12) -> each action row and brief carry the PAA/autocomplete evidence-tagged question, answer with shape, and placement in section 1.
- Evidence basis (_decision-evidence.md): TLH = calculated (evidence/tax-loss-harvesting/run.py) + reported; HSA = reported + labeled arithmetic ($4,400 + $1,000); BRRRR = modeled (evidence/brrrr-method/run.py, assumptions labeled) + reported. Visible attribution wording is specified per brief ("In our internal modeling, we ran..."). No product tests, client conversations or measured outcomes are claimed.
- Testing labels (_testing-labels.md, _experience.md section G): TESTED excluded for all three (financial/tax/lending topics, no executed tests); ordinary presentation.
- Author/byline: existing site template and default author via Byline.astro/site.ts; no person created, no professional-review claim.
- Register: operator for all three (decision pages); tee-up draws only on _experience.md DOMAIN framings ("In the guides we publish here...").
- YMYL guardrail: every rate, limit, threshold and rule comes from IRS or Fannie Mae pages fetched today and quoted in evidence/<slug>/sources.md; unlinked or unsourced figures are excluded; page says it is general information and defers to a tax professional or lender; disclaimer renders at the bottom via the template.
- Takeaway (_decision-evidence.md section 3): per-brief 'takeaway' with condition that changes it.
- Depth: page type explainer, floor 1,200 body words, enforced by content_gen --floor and Phase 4.
- Rendered audit: complete rendered pages captured and independently reviewed in Phase 4 (rendered-audit.py), recompared live in Phase 9.

## Keyword demand, relevance and discovery coverage (KEYWORD_PROVIDERS=semrush,dataforseo; status volume/kd/expand = semrush)
Raw files: volumes.json, expand.<slug>.json, serp.json, autocomplete.<slug>.csv in this directory. expand --limit 20 per seed (per-source bound: up to 20 provider + 20 unique autocomplete ideas).
- tax loss harvesting: expand returned 38 (20 provider, 18 autocomplete-estimate; per-source cap of 20 reached, so coverage is capped and NOT exhaustive; unsampled families: wash sale, capital loss carryover, calculator, ETF, direct indexing, state variants). Accepted 28 on-topic (12 provider, 16 autocomplete); rejected 10: fiddleheads, floxum and jetsam, jetsam, harvesting basil, harvesting on a full moon, why bees make honey, custom electronics (non-finance word matches), tools for Indian retail investors, australia, ato (other jurisdictions).
- hsa triple tax advantage: expand returned 40 (21 provider, 19 autocomplete-estimate). Accepted 34 (15 provider, 19 autocomplete); rejected 6: brewery, brewpub near me, ten triple, triple integrals, triple rock brewery, further hsa. Supporting phrase found: 'hsa contribution limits 2026' 33,100/mo measured; served by section 1 of the same page (same reader intent), not a second page.
- brrrr method: expand returned 38 (20 provider, 18 autocomplete-estimate). Accepted 25 (18 provider, 7 autocomplete); rejected 13: brrrr invest academy and a turnkey-provider string (brand/spam), and books/courses/media/other-country/other-property-type variants (book, course, book pdf, audiobook, amazon, author, asian guy, academy, australia, airbnb, book amazon).
- Autocomplete counts are Google Autocomplete estimates, NOT measured volume. Measured exact-phrase metrics (volumes.json, 2026-11-04): tax loss harvesting 12,100 KD 53; hsa triple tax advantage 2,400 KD 37; brrrr method 6,600 KD 41; tax loss harvesting rules 1,300 KD 46; hsa contribution limits 2026 33,100 KD 44; how does the brrrr method work 40 KD 23.
- Omitted families and why: state-specific HSA/TLH treatment (no verified state sources; the pages say federal only), custodian/brand variants, India/Australia/UK variants, books and courses (off-intent for an explainer), investment-property LTV tables (Fannie Mae Eligibility Matrix page not retrievable). Stop reason: per-source caps were reached; the sampled ideas add no further answerable intent beyond the planned sections and the unsampled families are either covered by sections (wash sale, carryover) or unsourceable (state variants); no further widening was justified. Question sweeps, on-topic counts: TLH 67 of 71 raw (rejected zerodha, india x2, crypto), HSA 14 answerable of 19 raw (state, forum, custodian variants not answerable), BRRRR 28 of 32 raw (rejected bones-for-stock x2, canada, south africa). HSA provider row 'why are hsa triple tax advantage' is tagged provider but is a question-form variant.
- SERP/PAA (serp.json, DataForSEO 2026-11-04, $0.00645): TLH locked + AI Overview; HSA locked + AI Overview; BRRRR winnable + AI Overview. PAA 3/6, 5/6 and 6/6 on-topic respectively; off-topic PAA (Buffett views, $300,000 gains, Dave Ramsey opinion) go in neither the opener nor the FAQ.

## Duplicate and existing-page intent
coverage.txt (scripts/mindmap/coverage_lookup.py) lists no home for TLH or BRRRR and only /compare/hsa-vs-fsa for HSA (reader goal: choose between two accounts, different). A separate lookup limitation was caught by manual grep: /guides/wash-sale-rule-explained/ (shipped 2026-09-30, reader goal: how the 30-day window and basis adjustment work) is the TLH neighbor; the TLH page answers how-much/when-it-pays and links there for the rule's depth. /guides/tax-tips/ mentions TLH in one paragraph and HSAs in one paragraph (summary tips, not the answer). git log --all --oneline -S"brrrr" and -S"tax-loss-harvesting" slugs return no page-creating commits. The independent chart reviewer records the duplicate decision per row.

## Local testing eligibility and exclusions
_experience.md section G excludes financial services; no executed tests; TESTED off for all three. No professional-review obligation is recorded in site standards; none is claimed.

## Link preparation
Inspection artifacts: inspections-*.txt in this directory. Inbound plans (2 each) and outbound plans (live 200 verified 2026-11-04). Link-only edits carry no date bump and no sitemap lastmod change.

## Technical SEO and publication
New entries in src/data/guides.ts (existing Guide template; JSON-LD, canonical and sitemap derive from it); IndexNow after exact live verification; growth.json per page (baseline unavailable, not zero).

## Tool/visual preparation
Prose plus one GFM table per page generated from saved script output; no calculator or visual adds value beyond the existing /stock-capital-gains-tax-calculator/ and HSA/FSA comparison pages (justified N/A).

## Per-page preparation checks
| Page | Duplicate check | Testing eligibility | Evidence and label decision | Takeaway brief | Evidence |
|---|---|---|---|---|---|
| /guides/tax-loss-harvesting/ | KEEP (chart-reviewer-3 + coverage.txt + manual grep: wash-sale guide is a different goal; section 4 is a short bridge) | Not eligible: investing/tax outside _experience.md section G | calculated + reported; ordinary presentation; no TESTED | evidence.json takeaway and brief takeaway | evidence/tax-loss-harvesting/{sources.md,evidence.json,run.py,inputs.json,output.json}; volumes.json; serp.json; coverage.txt |
| /guides/hsa-triple-tax-advantage/ | KEEP (existing HSA pages are comparisons; tax-tips Tip 2 states the breaks and limits, so the page must add where each break ends) | Not eligible: tax/health-account topic outside section G | reported + labeled arithmetic; ordinary presentation; no TESTED | evidence.json takeaway and brief takeaway | evidence/hsa-triple-tax-advantage/{sources.md,evidence.json}; volumes.json; serp.json; coverage.txt |
| /guides/brrrr-method/ | KEEP (no BRRRR page; neighbors have other goals) | Not eligible: lending/real-estate investing outside section G | modeled + reported; ordinary presentation; no TESTED; delayed-financing repair-spending treatment labeled as the author's reading | evidence.json takeaway and brief takeaway | evidence/brrrr-method/{sources.md,evidence.json,run.py,inputs.json,output.json}; volumes.json; serp.json; coverage.txt |
