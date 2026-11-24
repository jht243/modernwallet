<!-- KG-DFS:BEGIN — canonical copy lives in layer3 .claude/commands/_keyword-gap-data-source.md; synced fleet-wide -->
> **‼️ DATA SOURCE FOR THIS PASS (2026-11-24) — SEMRUSH first, DataForSEO fallback, then free Google data. NEVER Ahrefs.**
> OWNER POLICY (2026-11-24): Ahrefs is approved ONLY for technical site audit routines (`ahrefs-site-audit-auto`)
> and the weekly Winner/Loser pass (`ahrefs_winner_loser_pass`). Everything else follows SEMRUSH first,
> DataForSEO fallback, and free Google data (Google Search Console API / Google Autocomplete) when needed — NEVER Ahrefs.
>
> - **Do NOT call any Ahrefs tool** — no `site-explorer-*`, `keywords-explorer-*`, `serp-overview`,
>   `batch-analysis`, `gsc-*`, or any other `mcp__*ahrefs*` / Ahrefs API endpoint — not as a primary source and
>   not as a fallback. This overrides any legacy line below that mentions Ahrefs.
> - **Competitor gap (Lens 1):** run `python3 scripts/lib/dfs_keyword_gap.py --refresh-competitors` from
>   the repo root with `SEMRUSH_API_KEY` and `DATAFORSEO_B64` in the environment. Each domain's ranked
>   keywords come from SEMRUSH `domain_organic`, competitors from `domain_organic_organic`; a SEMRUSH
>   failure falls back to DataForSEO per domain and says so in `notes`. It reads `OUR_DOMAIN` / `COMPETITORS` /
>   `RELEVANT` / `ADJACENT` / `EXCLUDE` / `TARGET_KW_FILE` from `scripts/semrush_keyword_gap.py` and writes
>   `reports/seo-research/keyword-gap.json` (`gaps[]`: keyword, volume, kd, cpc, tier, competitors,
>   num_competitors, score). Use that file wherever the text below says to run the SEMRUSH gap script.
> - **Competitor refresh (Step A):** use the `live_competitors` list in that JSON plus a web
>   cross-check. Keep 6–12 real competitors; sync them into the `COMPETITORS` constant as before.
> - **Cache — commit it.** Domain pulls are cached 28 days in `reports/seo-research/dfs-cache/`
>   (any source). Commit that directory with the run so next week's run reuses it. Never pass
>   `--no-cache` in an autonomous run.
> - **Volumes / KD for Lens-2 ideas:** `scripts/lib/keyword_data.py` (SEMRUSH first, DataForSEO
>   fallback, free Google Autocomplete — never Ahrefs).
> - **PAA / SERP checks:** `scripts/lib/serp.py` (DataForSEO live SERP — SEMRUSH has none), never
>   Ahrefs `serp-overview`.
> - **If SEMRUSH and DataForSEO are both unavailable:** continue on free Google data (direct GSC API +
>   Google Autocomplete + live web) with `source: estimate` rows labelled as such. That is the fallback — never Ahrefs.
<!-- KG-DFS:END -->
