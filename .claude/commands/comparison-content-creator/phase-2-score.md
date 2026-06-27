# Phase 2 — Score on live SEO data + select

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

Batch calls sensibly; cap total candidates scored to a reasonable ceiling (e.g. 30) — rank by a cheap heuristic first and only pull live data for the most promising, to bound API spend further.

## Composite score
Score each candidate (normalize each factor 0–1):

```
score = volume_factor           # log-scaled search volume
      × intent_factor           # "vs"/comparison = high commercial intent; "for [segment]" = higher
      × winnability_factor       # inverse of KD + weak-SERP bonus; penalize entrenched incumbents
      × lead_value_factor        # maps to a service/segment the business actually sells (user priority: LEADS)
      × portfolio_fit_factor     # fills a genuine gap; strengthens an existing hub/cluster
      × ai_citation_factor       # (if Brand Radar present) likelihood of LLM citation
```

**Lead value is up-weighted** — the user's priority is leads, not raw traffic. A medium-volume "X vs Y for [high-value vertical]" that maps to a paid service should outrank a high-volume but purely informational model-vs-model pair.

## Heuristic fallback (`--heuristic`, or no data source for a given candidate)
Score from internal signals only, zero external calls: entity prominence in existing content, segment→service mapping, coverage-gap size, and internal-link authority of related hubs. Clearly label these scores as `heuristic` in the output so the user knows they're not demand-validated.

## Select + record
- **Emit the mandatory Candidate Chart now** (exact columns/format defined in the launcher: `# | Comparison | Vol | KD | CPC | Coverage | Verdict`). It MUST include **every** candidate from Phase 1 — NEW (scored), PARTIAL and DUPLICATE (carried from 1b with their conflicting slug), and low/no-data rows. Dropped and low-ranked rows are never hidden. This chart is the headline deliverable of the run.
- Use the **actual data behind each** (volume, KD, CPC, top SERP competitors, GSC impressions). No invented numbers; `no data` where the source returned none, `—` where not queried (blocked pre-scoring).
- Apply thresholds (defaults, tunable): volume floor, KD ceiling, minimum composite score. Drop anything below.
- Take the **top N** (N = the run argument, default 5).
- Write every **non-selected** scored candidate to `reports/comparison-content-creator/cache.json` (with its score + reason) so future runs skip it.
- Pass the selected pairs (with their primaryKeyword, slug, segment, and the data context) to Phase 3. Auto-continue.
