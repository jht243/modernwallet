<!-- KG-DFS:BEGIN — canonical copy lives in layer3 .claude/commands/_keyword-gap-data-source.md; synced fleet-wide -->
> **‼️ DATA SOURCE FOR THIS PASS (2026-11-02) — SEMRUSH first, DataForSEO fallback. NEVER Ahrefs.**
> Ahrefs units are reserved for technical site audits (`ahrefs-site-audit-auto`). On 2026-09-20
> this pass burned ~143k of the 200k monthly Ahrefs units in 50 minutes by pulling competitor
> keywords through the Ahrefs MCP. USER RULE 2026-11-02: SEMRUSH is primary wherever it can answer.
> So, for every step of the keyword-gap pass:
>
> - **Do NOT call any Ahrefs tool** — no `site-explorer-*`, `keywords-explorer-*`, `serp-overview`,
>   `batch-analysis` or any other `mcp__*ahrefs*` / Ahrefs API endpoint — not as a primary source and
>   not as a fallback. This overrides any sentence below that says "Ahrefs MCP fallback".
> - **Competitor gap (Lens 1):** run `python3 scripts/lib/dfs_keyword_gap.py --refresh-competitors` from
>   the repo root with the routine's `SEMRUSH_API_KEY` and `DATAFORSEO_B64` in the environment (the
>   prompt's key lines cover this script too). Each domain's ranked keywords come from SEMRUSH
>   `domain_organic`, competitors from `domain_organic_organic`; a SEMRUSH failure falls back to
>   DataForSEO per domain and says so in `notes`. It reads `OUR_DOMAIN` / `COMPETITORS` / `RELEVANT` /
>   `ADJACENT` / `EXCLUDE` / `TARGET_KW_FILE` from `scripts/semrush_keyword_gap.py` and writes
>   `reports/seo-research/keyword-gap.json` (`gaps[]`: keyword, volume, kd, cpc, tier, competitors,
>   num_competitors, score). Use that file wherever the text below says to run the SEMRUSH gap script.
> - **Competitor refresh (Step A):** use the `live_competitors` list in that JSON plus a web
>   cross-check. Keep 6–12 real competitors; sync them into the `COMPETITORS` constant as before.
> - **Cache — commit it.** Domain pulls are cached 28 days in `reports/seo-research/dfs-cache/`
>   (any source). Commit that directory with the run so next week's run reuses it. Never pass
>   `--no-cache` in an autonomous run.
> - **Volumes / KD for Lens-2 ideas:** `scripts/lib/keyword_data.py` (SEMRUSH first, DataForSEO
>   fallback); if a row comes back `source: ahrefs`, unset `AHREFS_API_KEY` for this run
>   (`env -u AHREFS_API_KEY python3 …`).
> - **PAA / SERP checks:** `scripts/lib/serp.py` (DataForSEO live SERP — SEMRUSH has none), never
>   Ahrefs `serp-overview`.
> - **If SEMRUSH and DataForSEO are both unavailable:** continue on Lens 2 (autocomplete + web) with
>   `source: estimate` rows labelled as such. That is the fallback — not Ahrefs.
<!-- KG-DFS:END -->
