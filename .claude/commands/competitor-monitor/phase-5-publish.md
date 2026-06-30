# Phase 5 — Stage (local only — NO push)

Stage everything that passed Phase 4 — new guides, new comparisons, enrichment edits, and built tools (skip `draft: true` items for sitemap/IndexNow, but still commit them so they're not lost). Everything here is local; the push + IndexNow happen in Phase 6. **Reuse the project's publish helpers if Phase 0 found any; otherwise do each step directly on the project's files.**

> **Cloud-safe override (from the launcher).** Ignore the "create a dedicated working branch" line in `comparison-content-creator/phase-5-publish.md`. **Stay on the current branch** and commit there. Push is Phase 6's job.

## Steps (in order)
1. **Insert content.** Add each new page to the project's discovered content store in its exact format (the same target the reused comparison/keyword generator writes to — e.g. an auto-merged `*-new` data file, or an MDX/content file). Re-check existing slugs one last time to prevent collisions. Tool files from Phase 3c are already on disk — just ensure they're `git add`-ed.
2. **Inbound internal links.** For each new page/tool, add a backlink FROM the most relevant existing hub/cluster/guide/vertical (reuse `add_inbound_link()`; idempotent). Never regenerate the target page.
3. **Sitemap.** Add each non-draft NEW route to the correct project sitemap (discovered in Phase 0) with today's `lastmod`, matching the project's `<url><loc>…</loc><lastmod>…</lastmod></url>` format. For enriched routes (already listed), only bump `lastmod`. Do NOT add drafts.
4. **Typecheck.** Run `npx tsc --noEmit` (reuse `tsc_check()`). **If it fails → `git reset --hard` / discard, abort, report `failure` to Phase 6 — do not commit broken content.**
5. **Commit (NO push).** Single commit on the current branch:
   `competitor-monitor: {N} new pages + {T} tools + {E} enriched — {slug-a}, {slug-b}, …`
   plus the repo's `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` footer. **Do not push.** Capture the staged commit SHA.

> ‼️ STOP HERE on the push. The push + IndexNow + ledger record happen in Phase 6.

## Output
Report: new pages staged vs held-as-draft, tools staged vs draft, enriched pages staged, files touched, inbound links added, sitemap entries/lastmods, typecheck result, staged commit SHA. **Auto-continue to Phase 6.**
