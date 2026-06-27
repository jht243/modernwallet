# Phase 5 — Stage (local only — NO push, NO IndexNow)

Stage everything that passed Phase 4 — both the **net-new pages** from Phase 3 and the **enrichment edits** from Phase 3b (skip pages marked `draft: true` — they stay noindex and out of the sitemap, but are still committed so they're not lost). Everything here is local: the push to main and the IndexNow ping happen in Phase 6 **only after the human approves**. **Reuse project publish helpers if Phase 0 found them** (e.g. `scripts/model_radar/publish.py`); otherwise do each step directly on the project's files.

> Work on a dedicated working branch (e.g. `comparison-content/<TODAY>`), not directly on main, so the pre-gate commit is easy to inspect or discard.

## Steps (in order)
1. **Insert content into the project's content store.** Append the new `ComparisonPage` objects to the project's comparison data file (e.g. `data/comparisons-new.ts`, which auto-merges) — or write the MDX/CMS entries. Use the project's existing-slug guard (`existing_slugs()` or equivalent) one last time to prevent collisions.
2. **Inbound internal links.** For each new page, add a backlink FROM the most relevant existing pages identified in Phase 3 (hub/cluster/guide/vertical) so the new page is discoverable and well-linked. Idempotent — skip if the link already exists. (Reuse `add_inbound_link()` if present.) Never regenerate the target page; insert only the link.
2b. **Enriched pages (Phase 3b edits).** These are already-existing files edited in place — there is nothing to insert and **no new route to create**. Just `git add` the edited files. Do NOT regenerate them and do NOT add them as new sitemap entries.
3. **Sitemap.** Add each published (non-draft) NEW route to the correct `public/sitemap*.xml` with today's `lastmod`, matching the discovered `<url><loc>…</loc><lastmod>…</lastmod></url>` format. For each **enriched** route (already in the sitemap), only **bump its existing `lastmod`** to today — do not add a duplicate entry. (Reuse `add_sitemap()` if present.) Do NOT add drafts.
4. **Typecheck / build sanity.** Run the project's check (e.g. `npx tsc --noEmit`, or `npm run build`). **If it fails: revert the working tree (`git reset --hard` / discard), abort, and report — do not commit broken content.** (Reuse `tsc_check()` + reset if present.)
5. **Commit to the working branch (NO push).** Single commit on the working branch, message like `Comparison Content Creator: {N} new pages + {E} enriched — {slug-a}, {slug-b}, …`, with the project's commit footer convention (e.g. the `Co-Authored-By` line). **Do not push. Do not touch main yet.** Capture the staged commit SHA.

> ‼️ STOP HERE on the push. The actual push to main + IndexNow is deferred to Phase 6, after the human approves the summary. Do NOT push or ping IndexNow in this phase.

## Output
Report: new pages staged vs held-as-draft, **enriched pages staged**, files touched, inbound links added, sitemap entries added + lastmods bumped, typecheck result, working-branch name + staged commit SHA. Auto-continue to Phase 6 (the gate).
