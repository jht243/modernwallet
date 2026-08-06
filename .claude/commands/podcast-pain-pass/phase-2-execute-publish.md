# Phase 2 — EXECUTE + PUBLISH (via the site's OWN content engine)

Input: the auto-approved chart from Phase 1. This routine does NOT carry its own page generator — it hands the chart to **this repo's existing content engine**, exactly as `trend-pass-auto` does. Do not invent a new page shape.

## ‼️ BUILD THROUGHPUT + INCREMENTAL BACKLOG (BUILD_CAP = 15) — no approved page is ever stranded
Two mechanisms together (the checkpoint is what actually guarantees safety, so the cap can be generous):
1. **Incremental backlog checkpoint (the real safety net):** at the START of Phase 2, write EVERY approved row (deferred-backlog rows first, then newly-mined by descending SEMRUSH volume) into `reports/podcast-pain-pass/ledger.json` under `deferred_rows`. Then build one at a time (parallelize the writer subagents, but register/record serially); **after each page is published + 200-verified, remove it from `deferred_rows`.** If the session ends for ANY reason (budget, error) part-way, `deferred_rows` already holds exactly the unbuilt remainder — Phase 1 drains it FIRST next run. Nothing is stranded, no matter how many pages a run approves.
2. **Soft cap (BUILD_CAP = 15):** attempt up to **15 pages this run** — enough to ship a big week in one go. Approved rows beyond 15 just stay in `deferred_rows` for the next run. This is a throughput ceiling, not a content cap — tune it to how many pages a cloud session reliably completes (start at 15).
The `>N survivors` circuit-breaker still guards the TOTAL approved count (runaway backstop) — separate from this.

## 1. Write the content — additive, via the repo's own approach
For each KEPT row, discover this repo's add-a-page mechanism (Phase 0 site-facts: additive data file / markdown / content dir / bundled generator on this Flask + SQLite site) and use **`.claude/commands/seo-gsc-pass/phase-3-new-content.md` VERBATIM** as the writing prompt, then audit via **`.claude/commands/seo-gsc-pass/phase-4-audit.md`**. Constraints:
- **Additive only** — new routes only; never edit/rewrite an existing page.
- Match the site's existing page shape, voice, internal-link patterns, and CTA/disclosure standard. Internal-link each new page up to its `hub`.
- **YMYL health — this is the hard rule.** Ground every factual/medical claim in the repo's own sourced content or a reputable primary source (link the first mention per the first-mention rule). NEVER invent dosages, lab ranges, statistics, or treatment advice. The mined pain sentence anchors *search intent only* — never present it, or anything derived from a podcast, as medical fact. If a claim can't be grounded, drop the page (flag it) rather than guess. Include the site's standard medical disclaimer.
- Pages failing audit after 2 retries are reverted (flagged "failed audit"); a partial batch still ships.

## 2. Sitemap + build check
Update the sitemap for new routes (follow the repo's existing generation — do NOT hand-edit if build-generated). Run the repo's typecheck/build if present; mechanical fixes only, else revert the offending page.

## 3. Ledger writes (before the commit)
- `reports/podcast-pain-pass/ledger.json`: append every shipped slug to `shipped_slugs`; the dedup reviewer treats these as covered next week. (Processed episode GUIDs were already written by `pull_new_episodes.py`.)
- Save `reports/podcast-pain-pass/run-$DATE/summary.md`: episodes pulled per show, pain clusters found, validated terms, what shipped (with routes), what was deduped, circuit-breaker notes.

## 4. Stale-base check → commit → push
Other crons commit mid-run. `git fetch origin && git status`; after staging your files by explicit pathspec, `git diff --cached HEAD --numstat` must show NO deletions you didn't make. Single commit `podcast-pain-pass-auto <date>: N pages from <shows>`; push per the trigger (publish-to-main override — `git fetch origin main && git rebase origin/main && git push origin HEAD:main`, retry rebase up to 3×; on unresolved conflict push the ephemeral branch + email a manual-merge note, never force-push main).

## 5. Verify 200s + IndexNow
After deploy settles (poll a few min), curl each new URL — all 200 before IndexNow. Submit new URLs to IndexNow (fallback key `dc557f6bfced447aa1a71771d8a0d24a` if the site key file is absent). Non-200 → report, skip from IndexNow, do NOT roll back.

## 6. Email `success`
Assemble the details file and send per the orchestrator's Email section.

**‼️ The details file MUST list every new page — this is non-negotiable.** The email helper's `clean_details` strips analytics/roster/table noise and keeps only "what changed" sections, so the new-page list must be under a surviving heading (`## New pages shipped`) with this EXACT shape — one `[Title](FULL-URL)` bullet per page, using the **full absolute URL** you just 200-verified (a markdown link's target is NOT host-resolved, so a bare `/route` here would render as a broken relative link — always paste the complete `https://…` URL):

```markdown
## New pages shipped
- [Magnesium for Sleep](https://www.themetabolicjournal.com/guides/magnesium-for-sleep)
- [Magnesium Glycinate vs Citrate](https://www.themetabolicjournal.com/compare/magnesium-glycinate-vs-citrate)
- [Magnesium Deficiency Symptoms](https://www.themetabolicjournal.com/symptoms/magnesium-deficiency)
```

Rules for this section:
- **List ALL of them** — one bullet per page actually shipped this run, never a truncated/"top N" subset, never a count-only summary line ("1 new page"). If 15 pages shipped, all 15 bullets appear.
- Each bullet is `[Human title](https://www.themetabolicjournal.com<route>)` using the exact route from `shipped_slugs` + the live host, so every page renders as a clickable link.
- If the run also updated existing page bodies, add a second section titled EXACTLY `## Updated pages` (this heading survives the filter — `## Body updates` does NOT) listing each as a `[Title](FULL-URL)` bullet the same way.
- If ZERO pages shipped (empty/no-changes run), send `no-changes` — there is no New-pages section to build.
