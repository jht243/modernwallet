# Phase 3 — Indexability unblocks

Act on every report row in the `unblock indexability` bucket: URLs the inspection returned as `Excluded by 'noindex' tag` or `Blocked by robots.txt` **where the block is unintended**. The job is to remove blocks that are accidentally keeping pages we want indexed out of the index — and to explicitly leave intentional blocks alone.

## Worker
For each URL:
1. **Confirm intent before touching anything.** Re-read the build-report diagnosis and the actual code. A block is *intentional* (leave it, record as working-as-intended) when the URL is admin/internal/utility (e.g. `/admin`, `/api`, `/health`, OG-image endpoints, tearsheets, search/filter param URLs). A block is *unintended* when it sits on a real content page that should rank.
   - **HARD STOP:** if you cannot tell whether a block is intentional, do NOT remove it — flag `ambiguous — needs human`.
2. **Remove the unintended block at its source — scoped to the reported page/path ONLY (global rule 8a):**
   - `noindex` meta / `X-Robots-Tag` header → find where it's emitted for that route/template and stop emitting it for **only the specific page(s)** that should be indexed (scope the change narrowly — never strip `noindex` globally or for a whole template that also covers pages meant to stay out).
   - `robots.txt` `Disallow` → wherever the project generates/serves robots.txt (per Phase 0), **narrow the single offending rule** so it no longer covers the specific reported content path, while preserving every other intentional disallow (e.g. `/api/`, `/admin/`, `/health`). Never broaden `Allow` site-wide, never remove `Disallow: /`-class rules, and never rewrite the file wholesale — change only the one rule blocking the reported path.
3. **Sanity-check robots.txt holistically:** confirm the `Disallow` list still blocks exactly the intended internal paths and nothing user-facing, and that both sitemaps remain referenced.
4. Queue every unblocked URL for re-submission in Phase 7 (so Google re-crawls sooner).
5. `git add`. Do not commit.

## Reviewer checklist
- ☐ each change traces to a real `Excluded by 'noindex'` / `Blocked by robots.txt` row
- ☐ only **unintended** blocks removed; intentional blocks on `/admin`, `/api`, `/health`, utility endpoints untouched
- ☐ `noindex` removal scoped to the specific page(s) — no global strip, no whole-template change affecting unaffected pages (global rule 8a; else auto-REJECT)
- ☐ robots.txt change altered only the single rule blocking the reported path — no site-wide `Allow` broadening, no wholesale rewrite; still disallows the intended internal paths and still references both sitemaps
- ☐ ambiguous "intentional vs accidental" cases were flagged, not guessed
- ☐ unblocked URLs queued for Phase 7 re-submission

Reject with specifics; max 2 rework attempts, then STOP and escalate.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, Track B is complete. Immediately proceed: once Track A (Phase 4) has also passed, begin Phase 5 in the SAME turn. Do NOT stop or ask. The only human stops are Stop 1 (Phase 0 manifest) and Stop 2 (Phase 8 summary).
