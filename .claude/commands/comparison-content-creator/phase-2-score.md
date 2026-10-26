
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 2 — Score on live SEO data + select

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


**API-cost gate (enforced):** only `NEW` candidates from Phase 1b reach this phase. Never call any SEO data tool for a cached, duplicate, or partially-covered pair. If the user passed `--heuristic`, skip all external calls and score on internal signals only (see "Heuristic fallback").

## Pull live data per surviving candidate
Use only the data sources Phase 0 found connected. For each `NEW` candidate's `primaryKeyword`:

- **Ahrefs MCP** (if present):
  - `keywords-explorer-overview` → search **volume**, **keyword difficulty (KD)**, CPC. (Remember Ahrefs monetary values are USD cents — divide by 100.) Honor the MCP rule: if a response includes `render_with`, call the named render tool before using the data.
  - `keywords-explorer-related-terms` → catch a higher-volume phrasing of the same pair; if one clearly wins, adopt it as the `primaryKeyword` (keep the slug aligned).
  - `serp-overview` → who currently ranks page 1. Judge **winnability**: are incumbents weak (forums, thin listicles, low-DR) or entrenched (the vendors themselves, high-DR review sites)?
- **GSC MCP** (if present): `gsc-keywords` / `gsc-pages` → are we already getting **impressions** for this pair or a near variant? Latent impressions we don't yet serve = strong, cheap opportunity.
- **SEMrush export** (if a keyword-gap CSV was found): use it for competitor-gap corroboration — pairs competitors rank for and we don't.
- **Brand Radar** (if present): the LLM-citation angle — does comparison content already surface in AI answers for this pair? High AI-citation potential is a tie-breaker up.
- **Keyword demand ladder (REQUIRED backup before any heuristic scoring):** if the Ahrefs MCP is absent, dry, or erroring for a candidate, get volume/KD/CPC from `scripts/lib/keyword_data.py` instead (`volumes()` -- reads `DATAFORSEO_B64`/`SEMRUSH_API_KEY`/`AHREFS_API_KEY` from the environment and resolves the best usable provider per field; see `.claude/commands/_keyword-demand-ladder.md`). Only when the ladder itself returns `source: estimate` may a candidate be scored heuristically -- measured data from ANY rung always beats internal signals.

Batch calls sensibly; cap total candidates scored to a reasonable ceiling (e.g. 30) — rank by a cheap heuristic first and only pull live data for the most promising, to bound API spend further.

## Name-mixup check (MANDATORY, added 2026-10-21)

Some product names are also common words or other brands (Make vs Makefile, Granola the AI note-taker vs granola the food, Mercury 2 the model vs Mercury the bank, Llama the model vs Ollama/llama.cpp). A page on a phrase whose Google top 10 means something else cannot win (measured on layer3 2026-10-21: /comparisons/make-alternatives got 0 impressions for "make alternatives" in 90 days; /comparisons/mercury-2-alternatives ranked #2 for "mercury alternatives" with 0 clicks).

For every NEW candidate that survives to scoring, run on its `primaryKeyword`:
```
python3 scripts/intent_check.py "<primaryKeyword>" --terms "<terms that identify OUR entity: its domain, product-category words>"
```
- `on_intent` (6+ of the top 10 match) → keep the phrase.
- `mixed` or `off_intent` → try the clearer phrasings in order: the brand domain (`make.com alternatives`), `<name> ai alternatives`, `<name> app alternatives`. Adopt the first that comes back `on_intent` as the `primaryKeyword`, and use it in the slug, title and H1 (e.g. `make-com-alternatives`, "Make.com Alternatives"). Re-pull its volume.
- None comes back `on_intent` → drop the candidate and cache it with reason `name mixup: <verdicts>`.
Judge on Google's top 10 only. Do not use People-also-ask or autocomplete for this call; on 2026-10-20 they suggested "bolt alternatives" was about bolts and ride-hailing while the top 10 was 8 of 9 bolt.new.

## Composite score
Score each candidate (normalize each factor 0–1):

```
score = volume_factor           # log-scaled search volume
      × intent_factor           # matches the actual query intent and site audience; no automatic commercial/segment bonus
      × winnability_factor       # inverse of KD + weak-SERP bonus; penalize entrenched incumbents
      × click_opportunity_factor # realistic organic click opportunity given the SERP layout; not all searches become clicks
      × answer_value_factor      # ability to provide a better, evidence-backed answer than existing results
      × portfolio_fit_factor     # fills a genuine gap; strengthens an existing hub/cluster
```

**Traffic growth is the default.** Prioritize relevant topics with the greatest realistic opportunity to earn additional organic clicks. Consider search demand, ranking difficulty, gaps in existing coverage, and our ability to provide a better answer. Commercial value may break a close tie, but should not override substantially greater traffic potential unless the user explicitly requests lead generation. Record any explicit lead-generation objective and its scoring adjustment for that run; never assume it from the site's services or audience.

Treat this score as a prioritization aid, not a predicted click count. Explain the evidence behind each factor; do not invent CTR or traffic estimates. AI-citation potential is an optional tie-breaker, not a multiplier that suppresses organic opportunities when citation data is absent.

## Heuristic fallback (`--heuristic`, or no data source for a given candidate)
Score from internal signals only, zero external calls: entity prominence in existing content, audience relevance, coverage-gap size, our ability to provide a better answer, and internal-link authority of related hubs. Do not infer demand from commercial value or award an automatic service/segment bonus. Clearly label these scores as `heuristic` in the output so the user knows they're not demand-validated.

## Select + record
- **Emit the mandatory Candidate Chart now** (exact columns/format defined in the launcher: `# | Comparison | Vol | KD | CPC | Coverage | Verdict`). It MUST include **every** candidate from Phase 1 — NEW (scored), PARTIAL and DUPLICATE (carried from 1b with their conflicting slug), and low/no-data rows. Dropped and low-ranked rows are never hidden. This chart is the headline deliverable of the run.
- Use the **actual data behind each** (volume, KD, CPC, top SERP competitors, GSC impressions). No invented numbers; `no data` where the source returned none, `—` where not queried (blocked pre-scoring).
- Apply thresholds (defaults, tunable): volume floor, KD ceiling, minimum composite score. Drop anything below.
- Take the **top N** (N = the run argument, default 5).
- Write every **non-selected** scored candidate to `reports/comparison-content-creator/cache.json` (with its score + reason) so future runs skip it.
- Pass the selected pairs (with their primaryKeyword, slug, segment, and the data context) to Phase 3. Auto-continue.
