# Phase 6 — Stage + push the enriched pages

The user approved at the Phase 3 gate and Phase 5 confirmed quality, so this phase stages and ships in one pass — no second human stop. Only pages that survived Phase 5 are included.

## Steps

1. **Sitemap lastmod bump.** For each enriched page, update its existing `<lastmod>` in the discovered sitemap file(s) to today. **Do NOT add new `<url>` entries** — these pages already exist. If Phase 0 found a sitemap helper (e.g. `add_sitemap`/a regenerator), use it; otherwise edit the `<lastmod>` in place.

2. **Typecheck / build.** Run the discovered command (e.g. `npx tsc --noEmit` or `npm run build`). If it fails:
   - Fix it if the cause is an obvious mechanical slip in your edit (wrong field key, stray comma, unclosed tag).
   - If it still fails, **revert the offending page's edit** (restore byte-for-byte), re-run the check, and record the page as "reverted — typecheck." Never push a red tree.

3. **Commit.** Stage only the enriched source files + sitemap changes. Use the project's commit convention with a clear message, e.g.:
   ```
   feat(question-gap-pass): answer high-value follow-up questions on top <N> pages

   Added <A> FAQ/sections, strengthened <S>, linked <L> across <P> top-traffic pages.
   ```
   End with the project's `Co-Authored-By` line if it has one. Never commit secrets or `.env`. Never pass `--no-verify`.

4. **Push.** Push to the project's default branch (`main`) per its git flow. A manual local run may already be on `main`. **Autonomous variants (`/question-gap-pass-auto` and other `*-auto` cloud routines) deploy to `main` via `.claude/scripts/deploy-run-to-main.sh push`** per their launcher's Git model — never leave the enriched content on an unmerged ephemeral branch. Never force-push.

5. **IndexNow.** Ping IndexNow for the **enriched URLs only** (they changed; unchanged pages are not submitted). Reuse the discovered IndexNow helper/key; if no key exists, skip and flag it in the summary.

6. **Update cache.** Confirm `reports/question-gap-pass/cache.json` records every page analyzed + every section added this run, so future runs don't re-suggest them.

## Final report (print after pushing)
```
## /question-gap-pass — run complete
- Pages analyzed: <P> (top by GSC clicks)
- Follow-up questions generated: <G>
- Sections added: <A> · Strengthened: <S> · Internal links: <L> · Skipped: <K>
- Reverted (failed audit/typecheck): <list, or none>
- Per page: <route> → +<a> add / <s> strengthen / <l> link
- Commit: <SHA>
- IndexNow: <enriched URLs submitted, or "skipped — no key">
- cache.json: reports/question-gap-pass/cache.json
```

This phase ends the run. No further human stop.
