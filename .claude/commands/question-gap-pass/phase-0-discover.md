# Phase 0 — Discover project facts

Auto-discover everything later phases need. Hardcode nothing about any specific project. Persist what you find to `reports/question-gap-pass/discovery.md` (create the dir if missing) so a re-run and the audit subagent share the same facts.

This skill **edits existing top pages in place**, so the single most important discovery is **how a page's URL maps to its editable source file** and **how that source stores body content**.

## What to discover

1. **BASE_URL** — the production origin. From `public/sitemap*.xml` `<loc>`, a canonical tag, or JsonLd builders. Needed to match GSC page URLs (Phase 1) back to source files.

2. **Framework + deploy mode** — Next.js static export, Astro, Hugo, MDX, CMS, etc. Note static-export limitations.

3. **Content storage + URL→file mapping (most critical).** Determine how a live URL resolves to an editable file and how that file holds body text:
   - **Data-object array** (e.g. `data/*.ts` with a typed `Page[]` interface + `[slug].tsx` route): record the file(s), the slug field, and the **real body field key** (e.g. `content:`, `body:`, `sections:`) — grep an existing object, don't assume.
   - **MDX/Markdown files**: record the content directory, the frontmatter schema, and how the route is derived from the path.
   - **CMS**: record the entry-edit flow.
   - **Read 1–2 of the actual top pages' source files in full** once Phase 1 selects them — Phase 4 must mirror their structure, FAQ block shape, heading style, schema (FAQ/Article JsonLd), and voice. (In Phase 0, read 1–2 representative pages so you know the shape early.)
   - Record whether pages emit **FAQPage JsonLd** — if so, Phase 4 must extend it when it adds an FAQ entry.

4. **The full content URL set** — ALL pages/guides/verticals/FAQs with their routes + H1s + the topics they cover. Phase 3 needs this to answer "is this follow-up question already answered **elsewhere** on the site?" (the anti-duplication check). Don't limit this to the top pages.

5. **GSC data source** — confirm a working route to "most visited pages". **Primary = direct Google Search Console API (no Ahrefs):**
   - **Direct GSC helper** `.claude/tools/gsc-search-analytics/gsc_search_analytics.py --top-pages N` → real, complete clicks + impressions per page. Confirm a service account is available: `GOOGLE_REPORTING_SA_JSON` (inline, cloud), `GOOGLE_REPORTING_SA_FILE`, or `~/.claude/secrets/gsc-service-account.json` (local). The SA must have read access to the `sc-domain:<host>` property.
   - **Ahrefs MCP `gsc-pages`** — fallback only, if no SA credentials are available.
   - If neither is available → hard blocker (unless the user passed `--pages`).

6. **Business / brand name** — from `<title>` suffix, logo alt, footer, `package.json`, schema.org `Organization`, or the About page. **This is the `{BUSINESS_NAME}` token Phase 4 substitutes into the verbatim writing prompt.** If undiscoverable, fall back to the domain.

7. **Service / lead mapping** — what the business sells and to whom. Phase 3 uses it to rank a follow-up question's **value** (a question that gates a purchase decision is High value).

8. **Publish conventions:**
   - Sitemap file(s) + `<lastmod>` format (Phase 6 bumps lastmod for each enriched page — no new `<url>` entries, the pages already exist).
   - IndexNow key (`public/<32-hex>.txt`; if absent, IndexNow is skipped + flagged).
   - Git flow (default branch, commit-message convention, `Co-Authored-By` pattern).
   - Reusable helpers if present (e.g. `scripts/model_radar/` `add_sitemap`/`tsc_check`/`git_commit_push`/`indexnow`). Reuse them; otherwise operate on files directly.
   - Typecheck/build command (e.g. `npx tsc --noEmit`).

9. **Verbatim content-standard files** — confirm both exist and will be reused character-for-character:
   - `.claude/commands/seo-gsc-pass/phase-3-new-content.md` (writing standard for any added section)
   - `.claude/commands/seo-gsc-pass/phase-4-audit.md` (audit standard)
   If either is missing, note it — Phase 4/5 fall back to inlined quality rules but flag the degradation.

## Hard-blocker checks (STOP only on these)
- No content system / no URL→file mapping found → STOP, report what you looked for.
- No GSC source connected **and** no `--pages` list passed → STOP.
- Working tree not safe to stage onto (unrelated uncommitted changes) → STOP, ask to stash/commit.

Write `reports/question-gap-pass/discovery.md` with every fact above, then print the Phase Summary and **auto-continue to Phase 1** (do not ask).

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
This workflow has EXACTLY ONE human stop — the Phase 3 Gap Chart gate. This phase is NOT it. Print the summary and start Phase 1 in the same turn.
