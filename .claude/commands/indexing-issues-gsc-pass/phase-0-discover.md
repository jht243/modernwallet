# Phase 0 — Discover project facts + load report

Auto-discover every project fact by inspecting THIS repo (the workflow is portable — never assume a specific framework or file layout; discover it). Hardcode nothing; print what you find. The file names below are *examples* of what to look for, not fixed paths.

- **BASE_URL / canonical host** — from the site-URL/canonical config or the sitemap `<loc>` entries. Note any apex→www (or www→apex) normalization. This BASE_URL parameterizes the whole run, including the inspection sweep.
- **Framework + deploy mode** — e.g. Flask/Django/Express server-rendered, or Next.js/Astro static export. Server-side = real 301s/410s and per-route status control available; static export = consolidation/redirects must use canonical/build-time rules instead. This determines HOW Phases 1–2 fix things.
- **Canonical mechanism** — where `<link rel="canonical">` is emitted (a shared layout/head/template, fed by a base-URL helper or site config). Note whether it's self-referential and how a page would override it.
- **robots & noindex** — where `robots.txt` is generated/served (what's disallowed and why) and any place a `noindex` meta tag / `X-Robots-Tag` header is emitted. Distinguish intentional blocks (e.g. `/admin`, `/api`, `/health`) from accidental ones.
- **Sitemaps** — the sitemap generator/file(s). Note static vs data/CMS-driven URL sources and the route→record routing, so Phase 7 knows where to add/remove URLs.
- **Re-submit channels** — whether the project has IndexNow (key + client) and/or a Google Indexing API client. These are the Phase-7 re-submit channels; if absent, Phase 7 flags and skips them.
- **Content standard** — read 2–3 of the highest-quality existing pages and extract voice, depth, claims discipline, structure, CTA. This is the quality bar Phase 4 (thin-content) must match. Print a short summary.
- **Push target** — default to the repo's default branch unless conventions say otherwise.

## Load the report

By the time Phase 0 runs, the report already exists — Step 1 (`phase-build-report.md`) built it from the URL Inspection sweep, OR the user passed an existing report path. Phase 0 only LOADS the right file. Selection rules, in order:

1. **Argument path wins.** If the user passed a report path as an argument, use that file exactly.
2. **Today's report.** Else use `reports/indexing-pass/<TODAY>.md` (`<TODAY>` = `date +%Y-%m-%d`) — the file Step 1 just wrote.
3. **Newest by filename date.** Else, list all `reports/indexing-pass/*.md`, parse the `YYYY-MM-DD` from each filename, and pick the latest date **in the filename** (NOT by mtime).
4. **Ambiguity → STOP and ask.** Tie on filename date, or a filename that doesn't parse → STOP and list candidates. Do not guess.
5. **Nothing to load → STOP.** If no report exists, Step 1 should have built it. If it couldn't (auth 403, no credentials), STOP and surface that: "No report to load — the inspection sweep didn't produce one. Fix GSC access and re-run, or pass `/indexing-issues-gsc-pass <path/to/report.md>`."

After selecting:
- Print the selected report path AND the date in its filename, so the user can verify.
- **Staleness check:** parse `indexing_pass_date:` from frontmatter. If more than **7 days old** vs today, STOP and warn: "Report is N days old. Run anyway, or run a fresh sweep?" Wait for confirmation. (Index status drifts; old data ⇒ stale fixes.)
- Require frontmatter `status: ready-for-execution`. If missing, STOP — report isn't ready.
- Parse each row → `url`, `coverage_state`, `diagnosis`, `fix`, `bucket`, `target`. Classify `bucket` by intent (canonical / redirect-error / indexability / thin-content / internal-links / sitemap), not literal string. Ambiguous rows → "Ambiguous / needs human."

## Pre-execution manifest gate (HARD HUMAN GATE)

After parsing the report, **STOP and print the manifest table, then wait for the user's explicit approval before starting Phase 1.** Never auto-proceed past this gate.

**The manifest is keyed to what Google reports — the SAME coverage states as the inspection sweep (chart 1).** The user just saw "here's what Google sees"; the manifest must read as the direct answer: *for each of those issues, here is the solution.* It is a **two-column table: `Issue | Solution`** — no phase column, no separate count column (fold the URL count into the Issue cell). Phase numbers do not appear in the manifest. The Phase 8 end-of-run summary mirrors this same two-column shape (Issue → what we did).

### Manifest format — Table 1: issues PRESENT in this run

One row per `coverage_state` that actually appears in the report (count > 0), ordered by count. Two columns only:

| Issue | Solution |
|---|---|
| ✅ Submitted and indexed ({N}) | Nothing — healthy, leave alone |
| 🟡 Discovered – currently not indexed ({N}) | Found but not crawled → add ≥3 contextual internal links from relevant hubs; refresh sitemap `lastmod`; re-submit (IndexNow + Google Indexing) to prompt a crawl; flag thin/duplicative pages for a consolidate-vs-keep call |
| 🔴 URL is unknown to Google ({N}) | Not discovered → confirm in sitemap; add internal links; re-submit to force discovery |
| 🟠 Crawled – currently not indexed ({N}) | Crawled but low-value → improve content depth/E-E-A-T/uniqueness; add internal links; re-submit |
| ⏳ Already-fixed — awaiting recrawl ({N}) | Fix already shipped in a recent commit (cite SHA) → NO action this run (no code change, no `lastmod` bump, no re-submit — the page didn't change); recorded so the fix isn't redone; waiting on Google to recrawl |
| Duplicate without/with different canonical ({N}) | Set/align the canonical to the page you want indexed |
| Soft 404 / Not found 404 ({N}) | Add real content, or proper 404/410 + drop from sitemap; or restore/301 |
| Server error 5xx / Redirect error ({N}) | Fix the failing route / collapse the redirect chain |
| Excluded by noindex / Blocked by robots — unintended ({N}) | Remove the accidental noindex / unblock the path |
| Alternate page with proper canonical ({N}) | Nothing — intentional |

### Rules for Table 1
- **Exactly two columns: `Issue | Solution`.** No phase column. Put the URL count in parentheses inside the Issue cell.
- **One row per coverage state that occurs in this run** (count > 0). Combine closely-related states onto one row only if their solution is identical (as shown above); otherwise give each its own row.
- **Issue column**: the GSC coverage state verbatim (the user's vocabulary from chart 1), with the count in parentheses.
- **Solution column**: the concrete remedy for THAT state in plain language, drawn from the affected URLs' `fix` column — specific targets where useful (e.g. "link from {hub} to {url}"). This is the heart of the manifest: every problem Google reported gets a visible answer.
- Healthy / intentional states ("Submitted and indexed", "Alternate page with proper canonical") get a "Nothing — …" solution so the user sees they were deliberately left alone.

### Table 2 (optional): the playbook for states NOT seen this run
If helpful, append a short two-column `Issue | Solution` reference table of coverage states that did *not* occur, with the remedy each would trigger — so the user sees the full problem→solution map and trusts the diagnosis is complete. Skip if every state is already shown in Table 1.

### Ambiguous / strategic row
- If any URL could not be confidently classified, or any "intentional vs error" call is unresolved, OR a strategic editorial decision is needed (e.g. consolidate vs. index a large set of thin pages), append it as a final `Issue | Solution` row where the Issue is "⚠️ Needs your call: …" and the Solution states what the user must decide. If such a row exists, the gate cannot be approved until the user resolves it.

### Coverage disclosure (partial sweeps)
Before the manifest table, **disclose any incomplete coverage** so the user approves with full information. Read the inspection JSON's metadata:
- **`deferred` non-empty** → the sweep hit the non-indexed cap (default 200) and stopped; state how many URLs were not inspected this pass and that a follow-up `--resume` pass will cover them. The current manifest reflects only what was inspected.
- **`skipped_sitemaps` non-empty** → a child sitemap failed; those URLs were never inspected — name them and recommend a `--urls-file --resume` gap-fill before acting.
- **`carried_forward` > 0** → that many pages were assumed still-indexed from the prior sweep (not re-checked this run); note it so a stale "indexed" status isn't mistaken for a fresh confirmation.
Print these as a one-line "Coverage: inspected {X}, carried-forward {Y}, deferred {Z}, skipped-sitemaps {W}" note above Table 1. If coverage is partial, the manifest is still approvable, but the user should know the actionable set may grow on the next pass.

### After printing the table

Prompt the user with **exactly this question** (or its functional equivalent):
> "Manifest above — {K} issues Google flagged, each with its solution. Approve to start the fixes, or pause to revise?"

Acceptable approvals: "approve", "go", "start", "yes", or any clear affirmative.

If the user declines or wants to revise: STOP cleanly. Do not start Phase 1. Wait for them to edit the report and re-run, or give new direction.

Only after explicit approval, begin Phase 1.
