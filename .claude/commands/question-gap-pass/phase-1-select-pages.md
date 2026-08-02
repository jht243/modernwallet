# Phase 1 — Select the top N pages by GSC clicks → map each to its source file

This is the **only paid/data call in the skill**. Pick the project's most-visited pages from Google Search Console clicks, then resolve each live URL back to the editable source file Phase 0 mapped. Default **N = 20** (or `$ARGUMENTS`, or the explicit `--pages` list).

## Pull the top pages

Use the GSC source Phase 0 confirmed. **Primary = the direct Google Search Console API** (no Ahrefs) — it returns the complete, real click/impression data (Ahrefs only samples a subset of GSC).

- **Direct GSC (preferred):** run the repo helper
  ```
  python3 .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
    --base-url <BASE_URL> --top-pages <N> --days 90
  ```
  It derives the `sc-domain:<host>` property, ranks pages by clicks then impressions, and returns JSON `{ "top_pages": [ {page, clicks, impressions, ctr, position}, ... ] }`. Parse `top_pages`.
  - **Credentials:** the helper reads `GOOGLE_REPORTING_SA_JSON` (inline JSON), `GOOGLE_REPORTING_SA_FILE`, or `~/.claude/secrets/gsc-service-account.json`. In a cloud routine the service account is passed **inline** — prefix the command with `GOOGLE_REPORTING_SA_JSON="$(echo '<base64>' | base64 -d)"`. Install deps once if needed: `python3 -m pip install --quiet google-auth requests`.
  - Exit 2 = no creds; exit 3 = the SA lacks permission on the property → STOP, report it (don't fabricate pages).
- **Ahrefs MCP `gsc-pages` (fallback only)** — use *only* if the direct GSC helper has no credentials available (e.g. a local run with no SA). Same idea: pages sorted by clicks, top N.
- If `--pages "<url>,<url>,..."` was passed, skip the call and use that list verbatim (clicks/impressions = `n/a`).

If GSC returns nothing for the property, do not fabricate pages — STOP per the hard blocker and report that the GSC source returned no rows.

## Filter the list

Drop pages that this skill can't or shouldn't enrich:
- **Homepage / pure navigation / category index pages** with no article body — there's nothing to answer-enrich. Note them as skipped.
- **Non-content routes** (login, pricing-app, legal boilerplate) unless they genuinely host answerable content.
- Anything whose URL Phase 0's mapping **cannot resolve to a source file** — record it as `unmapped` and skip; do not guess a file.

Keep going until you have up to N **mapped, enrichable** content pages, ranked by clicks.

## Map URL → source file

For each surviving page, resolve the live URL to its exact editable file using Phase 0's URL→file rule (strip BASE_URL, match slug to the data-object entry / MDX path / CMS id). Record for each:
- `url`, `clicks`, `impressions`
- `source_file` (exact path) + the body field key (for data-object stores)
- `title` / `H1`

Read each selected page's source in full now (or note it for Phase 2/3 to read) so question generation and scoring work from real content, not the URL.

Write the selected set to `reports/question-gap-pass/pages.json`. Print the Phase Summary (list the N pages with their click counts) and **auto-continue to Phase 2**.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The one human stop is the Phase 3 Gap Chart gate. This phase is NOT it. Start Phase 2 in the same turn.
