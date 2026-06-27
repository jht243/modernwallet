# Phase BUILD-REPORT — Generate the report from a GSC URL Inspection sweep

Run this phase **only when** Phase 0 cannot find a report at `reports/indexing-pass/<TODAY>.md` AND the user did not pass a report path argument. This phase produces the file Phase 0 then loads. Once saved, control returns to Phase 0 for selection, staleness check, parsing, and the manifest gate.

This is the data-collection step. The data source is the **Google Search Console URL Inspection API** — the only official source of true per-URL index status (the same data behind the "Page Indexing" report). There is no bulk coverage export, so each URL is inspected individually. The sweep is run by a **global, project-agnostic tool** so it works identically across every site under your GSC service account — you never hand-craft API calls or copy a script into the project.

## The global tool (shared by all projects)
- Script: `.claude/tools/indexing-issues-gsc-pass/gsc_url_inspection.py`
- Runner: `.claude/tools/indexing-issues-gsc-pass/.venv/bin/python` (its own venv with `google-auth` + `requests`; does NOT depend on the project's venv).
- Invoke as: `.claude/tools/indexing-issues-gsc-pass/.venv/bin/python .claude/tools/indexing-issues-gsc-pass/gsc_url_inspection.py <args>`

## Credentials & property (one service account for all sites)
- The tool resolves credentials in this order: `--sa-file`, env `GOOGLE_REPORTING_SA_JSON`, env `GOOGLE_REPORTING_SA_FILE`, env `GSC_SA_FILE`, then the global default **`~/.claude/secrets/gsc-service-account.json`**. The intended setup is to drop the service-account JSON at that global path once — then every project's `/indexing-issues-gsc-pass` works with no per-project credential setup.
- **Property** is derived automatically from the site: `--base-url https://www.example.com` → `sc-domain:example.com` (a Domain property covers all hosts/schemes). Override with `--site-url` only if a site uses a URL-prefix property instead.
- **The service account must be a FULL or OWNER user of the property.** Scope alone is not enough — URL Inspection requires that permission level. If the first inspection returns 403, the tool exits 3 and prints the fix: add the SA in GSC → Settings → Users and permissions. STOP and surface that to the user; do not continue with a fabricated report.
- If no credentials are found at all, the tool exits 2. STOP and tell the user to place the SA JSON at `~/.claude/secrets/gsc-service-account.json` (or set one of the env vars). Never fabricate an indexing report.

## Step A — Determine this project's site root
From the Phase-0 discovery (or a quick check now), get the canonical base URL for THIS project — e.g. from the project's sitemap `<loc>` entries, its canonical/site-URL config, or by reading `<repo>/sitemap.xml`. Call it `BASE_URL` (e.g. `https://www.banthebots.org`). Everything below is parameterized by it, so the same phase works for any project.

## Step B — Run the inspection sweep
1. **Smoke test first (quota-safe):** confirm auth before sweeping the whole site:
   ```bash
   .claude/tools/indexing-issues-gsc-pass/.venv/bin/python .claude/tools/indexing-issues-gsc-pass/gsc_url_inspection.py \
     --base-url "$BASE_URL" --url "$BASE_URL/"
   ```
   Expect JSON with `coverage_state` populated. A 403 → STOP per above (SA needs Full/Owner). A credentials error → STOP per above.
2. **Sweep:** inspect the site's sitemap URLs (the tool fetches `$BASE_URL/sitemap.xml`, following a sitemap index one level if present), skipping pages already indexed in the prior sweep and stopping after the non-indexed cap (see scaling note below). Output lands in THIS project's `reports/indexing-pass/`:
   ```bash
   .claude/tools/indexing-issues-gsc-pass/.venv/bin/python .claude/tools/indexing-issues-gsc-pass/gsc_url_inspection.py \
     --base-url "$BASE_URL" --out reports/indexing-pass
   ```
   This writes `reports/indexing-pass/<TODAY>.inspection.json` (the raw, machine-readable record every report row must trace to) and prints a coverage-state breakdown. A typical small site is far under the 2,000/day quota.

   The tool inspects all URLs in **one process** (single auth, token reused) and **checkpoints** the dated JSON every 25 URLs via atomic write, plus on SIGTERM/SIGINT. **NEVER loop the tool once per URL from the shell** — that spawns one re-authenticating process per URL (~7s each), runs for minutes, and gets killed mid-way. Always hand the tool the whole set in a single invocation.

   **Scales to big sites by design — two defaults bound every run:**
   - **Skip already-indexed pages.** The tool reads the most recent prior `*.inspection.json` in the out dir as a baseline; any URL that was `Submitted and indexed` last sweep is **carried forward without an API call** (no point re-confirming healthy pages). Override with `--recheck-indexed` for a periodic full re-verify (catches pages that fell out of the index). On the very first sweep there's no baseline, so everything is a candidate.
   - **Stop after 200 non-indexed pages** (`--max-noindexed`, default 200; `0` = no cap). The run inspects candidates until it has found 200 genuinely non-indexed pages, then stops; the rest are written to the JSON's `deferred` array. This is the hard ceiling that keeps a 10,000-page site from running for hours. To work through the deferred backlog on a later pass, re-run the **same** command with `--resume`. Indexed pages never count toward the 200.

3. **If the sweep is interrupted / killed**, do NOT start over. Re-run the *same* command with `--resume` — it loads today's JSON, skips every URL already inspected successfully, and only does the rest:
   ```bash
   .claude/tools/indexing-issues-gsc-pass/.venv/bin/python .claude/tools/indexing-issues-gsc-pass/gsc_url_inspection.py \
     --base-url "$BASE_URL" --out reports/indexing-pass --resume
   ```
4. **Check for partial coverage.** After the sweep, read the JSON's `partial` flag and `skipped_sitemaps` array. If `skipped_sitemaps` is non-empty, a child sitemap failed even after retries and its URLs were NOT inspected — coverage is incomplete. Enumerate the missing page URLs (from the project's `public/sitemap*.xml`), write them one-per-line to a file, and gap-fill them into the same dated JSON in one process:
   ```bash
   .claude/tools/indexing-issues-gsc-pass/.venv/bin/python .claude/tools/indexing-issues-gsc-pass/gsc_url_inspection.py \
     --base-url "$BASE_URL" --out reports/indexing-pass --urls-file /tmp/missing_urls.txt --resume
   ```
   `--urls-file` + `--resume` preserves the existing results and merges the new ones — it never overwrites the sweep with just the gap-fill list. Confirm the final `total` equals the count of unique sitemap URLs before building the report.

Do not invent statuses for URLs the sweep didn't cover; if it was limited (`--limit`), any `skipped_sitemaps` remain after gap-fill, or the JSON's `deferred` array is non-empty (cap reached — those URLs were not inspected this pass), say so explicitly in the report so the human knows coverage is partial and a follow-up `--resume` pass is needed.

## Step C — Classify each URL by coverageState
Read `<TODAY>.inspection.json`. For each URL, map its `coverage_state` (and `verdict` / `robots_txt_state` / `google_canonical` vs `user_canonical`) to **exactly one primary bucket**, and separate genuine defects from intentional/healthy states. Use this table:

| GSC `coverageState` | Disposition / primary bucket |
|---|---|
| Submitted and indexed | **healthy** — excluded from the actionable table |
| Crawled – currently not indexed | `improve thin content` (also queued for internal links in Phase 6) |
| Discovered – currently not indexed | `add internal links` (also sitemap + re-submit in Phase 7) |
| Duplicate without user-selected canonical | `fix canonical / duplicate` |
| Duplicate, Google chose different canonical than user | `fix canonical / duplicate` (align user-declared canonical to Google's choice, or strengthen the intended one) |
| Alternate page with proper canonical | **working as intended** — exclusions note, no action |
| Page with redirect | **working as intended** if the redirect is deliberate; else `fix redirect / error page` |
| Excluded by 'noindex' tag | `unblock indexability` if the `noindex` is unintended; **working as intended** if deliberate (e.g. /admin) |
| Blocked by robots.txt | `unblock indexability` if unintended; **working as intended** if deliberate |
| Soft 404 | `fix redirect / error page` (add real content, or return a proper 404/410 + drop from sitemap) |
| Not found (404) | `fix redirect / error page` (restore, redirect, or remove from sitemap) |
| Server error (5xx) | `fix redirect / error page` (a code bug to fix) |
| URL is unknown to Google | `add internal links` (also re-submit in Phase 7) |
| Redirect error | `fix redirect / error page` |

Anything you cannot confidently classify (or where "intentional vs error" is genuinely unclear) → bucket **`ambiguous — needs human`**. It becomes a HARD-STOP row at the manifest; the user resolves it before approving.

**Gotcha — don't misread un-crawled URLs as defects.** For URLs Google hasn't fetched yet (`Discovered` / `URL is unknown to Google`, `verdict: NEUTRAL`, empty `last_crawl_time`), the `robots_txt_state` / `indexing_state` / `page_fetch_state` come back as `*_UNSPECIFIED`. That is **normal**, not a robots/noindex/fetch failure — only treat those fields as problems when the URL was actually crawled (`verdict` is `PASS`/`PARTIAL`/`FAIL`). `Discovered`/`Unknown` are discovery/crawl-budget issues (→ internal links + sitemap + re-submit), not technical blocks.

## Step D — Diagnose the root cause against the codebase
For every actionable URL, name the concrete fix target by inspecting THIS project's repo (do NOT guess; use the Phase-0 discovery of where canonical/routing/robots/templates live):
- **Canonical/duplicate** → the project's canonical mechanism (config + the template/head where `<link rel="canonical">` is emitted). Quote `google_canonical` vs `user_canonical` to show the exact mismatch.
- **Redirect/error** → the specific route/handler (or the DB/CMS record behind a dynamic route) that returns the wrong status / redirects.
- **Indexability** → the robots.txt source, or wherever a `noindex` meta/header is emitted.
- **Thin content** → the page template + the data/CMS record behind the URL.
- **Discovered/unknown** → which hub/cluster pages *should* link to it (for Phase 6) and whether it's in the sitemap (for Phase 7).

### Step D.1 — Build the "already-shipped ledger" FIRST (once), then diagnose rows against it
Re-proposing a fix that already landed is a real failure mode (e.g. commit `dcdb8f6 "Add internal links to fix 9 discovered-not-indexed pages"` already linked pages that may still show `Discovered – not indexed` purely because Google hasn't recrawled yet). Build the ledger **once, up front, as a first-class artifact** — do NOT re-grep commits ad hoc per row.

**(a) Compute the ledger.** Scan the last N commits (default 30; dates ignored — a fix counts as shipped if it appears anywhere in the window) plus the working tree, and extract every SEO/indexing fix already shipped:
- `git log --oneline -30`; for content, `git log -p -30 -- <page/data/template files>`; `git status` + `git diff` for un-committed in-progress fixes.
- Fix signatures to harvest: **internal links** (a URL slug appearing as a new `href` in a hub/footer/homepage/related module), **sitemap** (URL added to a `sitemap*.xml`), **canonical** (`<link rel=canonical>` / canonical-config change for a route), **redirect/status** (redirect or status-code change), **content** (substantive body/template addition).

**(b) Write the ledger artifact** to `reports/indexing-pass/<YYYY-MM-DD>.shipped-ledger.md` — a table `url | fix_type | evidence_sha | commit_subject | source(commit|working-tree)`. This is the auditable record the Gate-A reviewer (Step F) checks against. Note the exact lookback you used (e.g. `HEAD..HEAD~30`).

**(c) Diagnose each actionable row against the ledger** and annotate — every row MUST carry exactly one:
   - **Fix already in the ledger** → set `bucket` to **`already-fixed — awaiting recrawl`**, put `✅ shipped in <SHA> (<subject>)` in `diagnosis`, set `fix` to "No action — fix already shipped; recorded so it isn't redone; awaiting Google recrawl (NO `lastmod` bump, NO re-submit — the page didn't change this run)." Excluded from the edit phases (1–4, 6) AND from Phase 7's `lastmod`/re-submit sets; it is informational only.
   - **Fix NOT in the ledger** → keep the natural bucket and note "checked ledger (HEAD..HEAD~30), no prior fix."

Never drop a row as already-fixed without a concrete ledger SHA — a wrong "already-fixed" call silently denies a page the fix it needs (the costliest error in this step).

## Step E — Save the report
Write `reports/indexing-pass/<YYYY-MM-DD>.md` (today's date), beginning with this exact header block:

```
---
indexing_pass_date: <YYYY-MM-DD>
source: GSC URL Inspection API sweep (reports/indexing-pass/<YYYY-MM-DD>.inspection.json)
base_url: <BASE_URL>
site_url: <the property inspected, e.g. sc-domain:example.com>
generated_by: indexing-issues-gsc-pass build phase — .claude/tools/indexing-issues-gsc-pass/gsc_url_inspection.py
status: ready-for-execution
---
```

Then a table with these columns: `url`, `coverage_state` (verbatim from the JSON — the evidence), `diagnosis` (why not indexed + the concrete code/content/sitemap cause, cite file/route + SHA, INCLUDING the Step D.1 already-shipped finding), `fix` (the specific action in one clause), `bucket` (exactly one canonical bucket: `fix canonical / duplicate`, `fix redirect / error page`, `unblock indexability`, `improve thin content`, `add internal links`, `sitemap hygiene`, `already-fixed — awaiting recrawl`, or `ambiguous — needs human`), `target` (exact file/route/record to act on).

The table must contain **only actionable rows**. Healthy ("Submitted and indexed") and "working as intended" URLs are NOT rows — summarize them in a short exclusions paragraph below the table (counts + reasons). If there are no actionable rows, say so plainly.

Also write a per-URL CSV `reports/indexing-pass/<YYYY-MM-DD>.urls.csv` with header `url,coverage_state,bucket,target,fix`.

## After saving
Print: `Report saved to reports/indexing-pass/<TODAY>.md ({N} actionable URLs of {M} inspected, {K} already-fixed/awaiting-recrawl); ledger → <TODAY>.shipped-ledger.md; raw → <TODAY>.inspection.json; per-URL → <TODAY>.urls.csv.` Then **run Gate A (Step F)** — the adversarial duplicate / wrongful-drop reviewer. Only after Gate A PASSES does control return to Phase 0, which loads the report, runs the staleness check (will pass — brand new), and presents the manifest gate.

## Step F — Gate A: adversarial duplicate / wrongful-drop review (read-only)
After the report + ledger are saved, and **before** control returns to Phase 0 for the manifest, spawn a **read-only adversarial reviewer** (Agent tool, `subagent_type: Explore`) that did NOT build the report. It independently verifies the already-shipped classification **in both directions** against the ledger + git history:
- ☐ **0 duplicates survive** — no actionable row (bucket ≠ `already-fixed`) proposes a fix that the ledger shows already shipped. (false-negative check)
- ☐ **0 wrongful drops** — every `already-fixed — awaiting recrawl` row has a real, verifiable commit SHA (or working-tree diff) that actually implements that fix for that exact URL; none was dropped on a weak/missing match. (false-positive check — the more dangerous one)
- ☐ ledger lookback window matches the configured N (default 30) and the artifact exists at `reports/indexing-pass/<date>.shipped-ledger.md`.

The reviewer returns PASS only if all three hold. On rejection, fix the misclassified rows using its notes and re-review. **Max 2 rework attempts**, then STOP and escalate per the orchestrator's retry rule. Only after Gate A PASSES does control return to Phase 0 for the manifest gate.
