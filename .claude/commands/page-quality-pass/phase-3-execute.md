# Phase 3 — Execute: apply the prescriptions, then prove the build

Apply every prescription from Phase 2, one page at a time. Every word of new prose is written to the Stage-3 standard: `.claude/commands/seo-gsc-pass/phase-3-new-content.md` **if present** (research-first, E-E-A-T, answer-first, readability, internal linking); otherwise apply that standard inline. Nothing in this phase publishes — Phase 4 audits first.

## Mechanics per prescription type

### `REWRITE_SECTION`
- Replace ONLY the prose inside that one section, in place, in the page's source (data-file entry / markdown / template — wherever Phase 2 found it). Heading stays; position stays; every other section stays byte-identical.
- The new prose must deliver the content brief: specific, verified facts — numbers, names, steps, dates, trade-offs. Answer within the first two sentences; no filler openers ("In today's fast-moving world of…" is an instant Phase 4 kill).
- **Fact discipline:** every claim traces to the brief's verification. An old claim you could not verify does NOT survive into the rewrite.
- Length: whatever delivering the answer takes — a rewrite may be shorter than the filler it replaces, but the page's total information content must go UP, never down (Phase 4 checks this).

### `APPEND_SECTION`
Append after the last body section (before any FAQ block, matching the site's section order conventions), one section per prescription, answering its sub-intent completely. Same write standard.

### `ADD_LINKS`
Weave each link into an existing sentence where the reader's next question naturally arises — or add ONE short transitional sentence where no anchor point exists. Use the site's internal-link syntax/component exactly as sibling pages do. Verify every target route exists in the inventory AND returns content in the repo (a route in the inventory that was reverted upstream is a 404 waiting to ship).

### `EMBED_TOOL`
Build per the Phase 2 spec: working client-side logic (no fake outputs, no new dependencies, no secrets), placed where the prescription says, styled like the site's existing interactive components. All on-page copy (intro, labels, result text) meets the write standard.

### `REWRITE_METADATA`
Edit title/meta-description in the page's data record only. ‼️ NEVER emit `canonicalOverride: undefined` — omit the key entirely (it silently 404s the whole static export; tsc cannot catch it).

## Formatting hazards (all mandatory)
- **Apostrophes:** escape (`\'`) or double-quote every apostrophe inside single-quoted generated strings — one unescaped apostrophe fails the whole build and every deploy after it.
- **Byline:** never in body prose — it renders from the header + JSON-LD.
- **First-mention links:** first mention of any external company/product/model links to its official site UNLESS the project's auto-link registry covers it (layer3: `ENTITY_LINKS` in `src/utils/sectionContent.tsx` — CHECK the registry, never assume). Recurring new entity → note "registry candidate" in the digest; hand-link for now. Never hand-write a referral URL.
- **Inline CTA:** the site's standard CTA component below the first body section stays exactly where it is.

## Build gate (before Phase 4)
Typecheck AND full `next build` (or the repo's build command) — **Node 20** (`export PATH="/opt/homebrew/opt/node@20/bin:$PATH"` locally; cloud images default correctly). tsc alone is insufficient (undefined-serialization + apostrophe hazards only surface in the build). Build failure → fix mechanically if trivial (an escape, a missing comma); otherwise REVERT the offending page's edits entirely, log DROPPED ("build revert"), continue with the rest.

## Output
The edited working tree + per-page change manifest (files touched, sections rewritten/appended with before/after word counts, links added with targets, tools built, metadata diffs) → `phase-4-audit-publish.md`. **No commit yet.**


