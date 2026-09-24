<!-- KG-DFS:BEGIN — canonical copy lives in layer3 .claude/commands/_keyword-gap-data-source.md; synced by scripts/sync-keyword-gap-dfs.sh -->
> **‼️ DATA SOURCE FOR THIS PASS (2026-09-24) — DataForSEO ONLY. NEVER Ahrefs.**
> Ahrefs units are reserved for technical site audits (`ahrefs-site-audit-auto`). On 2026-09-20
> this pass burned ~143k of the 200k monthly Ahrefs units in 50 minutes by pulling competitor
> keywords through the Ahrefs MCP. So, for every step of the keyword-gap pass:
>
> - **Do NOT call any Ahrefs tool** — no `site-explorer-*`, `keywords-explorer-*`, `serp-overview`,
>   `batch-analysis` or any other `mcp__*ahrefs*` / Ahrefs API endpoint — not as a primary source and
>   not as a fallback. This overrides any sentence below that says SEMRUSH, `SemrushClient`, or
>   "Ahrefs MCP fallback". SEMRUSH is dead on the fleet key; do not try it either.
> - **Competitor gap (Lens 1):** run `DATAFORSEO_B64='<the value this routine's prompt gives for
>   keyword_data.py>' python3 scripts/lib/dfs_keyword_gap.py --refresh-competitors` from the repo root
>   — the prompt's DATAFORSEO key line covers this script too, even where it only names
>   keyword_data.py / serp.py. Without the prefix it prints "DataForSEO unavailable". It reads `OUR_DOMAIN` / `COMPETITORS` / `RELEVANT` / `ADJACENT` / `EXCLUDE` /
>   `TARGET_KW_FILE` from `scripts/semrush_keyword_gap.py`, pulls each domain's ranked keywords from
>   DataForSEO, and writes `reports/seo-research/keyword-gap.json` (same `gaps[]` shape: keyword,
>   volume, kd, cpc, tier, competitors, num_competitors, score). Use that file wherever the text below
>   says to run the SEMRUSH gap script.
> - **Competitor refresh (Step A):** use the `live_competitors` list in that JSON (DataForSEO SERP
>   overlap, giants excluded) plus a web cross-check, instead of `SemrushClient.domain_competitors`.
>   Keep 6–12 real competitors; sync them into the `COMPETITORS` constant as before.
> - **Cache — commit it.** Domain pulls are cached 28 days in `reports/seo-research/dfs-cache/`.
>   Commit that directory with the run so next week's run reuses it (a fresh layer3 pull costs ~$0.50;
>   a cached run costs $0). Never pass `--no-cache` in an autonomous run.
> - **Volumes / KD for Lens-2 ideas:** `scripts/lib/keyword_data.py` with `DFS_ENABLED` on; if a row
>   comes back `source: ahrefs`, you are running with an Ahrefs key you should not use here — unset
>   `AHREFS_API_KEY` for this run (`env -u AHREFS_API_KEY python3 …`).
> - **PAA / SERP checks:** `scripts/lib/serp.py` (DataForSEO SERP), never Ahrefs `serp-overview`.
> - **If DataForSEO is unavailable or over budget:** continue on Lens 2 (autocomplete + web) with
>   `source: estimate` rows labelled as such. That is the fallback — not Ahrefs.
<!-- KG-DFS:END -->
