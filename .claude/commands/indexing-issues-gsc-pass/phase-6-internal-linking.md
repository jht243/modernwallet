
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 6 — Internal linking (discovery boost)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


For indexing, internal links are the primary lever for two coverage states: `Discovered – currently not indexed`, `URL is unknown to Google` (Google knows about / found the URL but hasn't prioritized crawling/indexing it — more internal link equity tells it the page matters), and they reinforce `Crawled – currently not indexed` pages improved in Phase 4.

## ‼️ HARD RULE — max 3 visible related links per page; overflow goes behind "See more"
Any "related articles" / "more reading" / "you might also like" **recommendation module on a page shows at most 3 links by default.** If more relevant links exist, they go behind a collapsed **"See more"** expander — NEVER by enlarging the default-visible list to 4, 5, 6+. Do not inflate a related-links section to cram in more internal links; 3 visible is the ceiling, full stop.
- This cap is about *recommendation modules* on content pages. It does **not** apply to genuine archive/index/category listing pages (e.g. the `/briefing` index), which are inherently full listings.
- The cap is on **outbound visible links per section**. The indexing goal — each non-indexed target getting **≥3 inbound links** — is met by links coming from *multiple* source pages (each contributing ≤3 visible), not by bloating any single section.
- In-body editorial links inside article prose are allowed where genuinely relevant, but must not be stuffed.

## ‼️ HARD RULE — NATURALNESS BEATS THE QUOTA. ≥3 inbound is a TARGET, never a mandate.
The ≥3-inbound-links goal below is an *aspiration*, not a number to hit at any cost. **Relevance is the hard constraint; the count is not.**
- Only add a link where a **human editor genuinely would** — same topic, the link actually helps the reader. If a target can only earn 1 or 2 natural links, **stop there. Zero is an acceptable answer.**
- **NEVER force it:** never link from a page that isn't topically related, never insert a link a human wouldn't, never clutter a page to manufacture inbound links. Forced/irrelevant internal linking is an over-optimization **penalty risk** — under-linking is safe, forcing is not.
- **Vary anchor text naturally** — do NOT repeat the same exact-match keyword anchor across multiple source pages to manufacture links; that reads as link engineering. Anchors should look like organic editorial links.
- **If a target genuinely can't attract enough natural links, that's a signal, not a failure to brute-force** → flag it `ambiguous — needs human` (it may be thin, orphaned, or a consolidation candidate). Do NOT wrap it in artificial links to clear the quota.

## Worker
1. **Derive the target set** (not just explicit `add internal links` rows): every report URL whose `coverage_state` is `Discovered – currently not indexed`, `URL is unknown to Google`, or `Crawled – currently not indexed`, plus any orphan URL surfaced in the build-report diagnosis. **EXCLUDE every row whose bucket is `already-fixed — awaiting recrawl`** — the build phase already confirmed its links shipped in a recent commit; re-linking it is duplicate work, and it gets no further action this run (not even re-submit).
2. **Per-target already-linked guard (do this BEFORE adding any links).** For each remaining target URL, confirm it does NOT already have sufficient inbound links: grep the current codebase for existing `href` references to the slug, and scan the last 30 commits (`git log -p -30`) for a prior link-add. If the target already has **≥3 contextual inbound links**, do NOT add more — record it as "already linked (≥3 inbound, shipped in <SHA> / present in <files>)" and move on. Only pages genuinely short of 3 inbound links are candidates for new links.
3. For each target URL still short of links, add inbound contextual links **only where genuinely relevant** (per the NATURALNESS HARD RULE above) from relevant existing pages (hubs/clusters/related explainers identified in Phase 0), spread across multiple sources so no single related-links module exceeds 3 visible (see the 3-visible HARD RULE):
   - Use the framework's normal link markup (template `<a href>` / link macro) with **descriptive, varied anchor text** — never "click here", never a bare URL, never the same exact-match anchor repeated across sources.
   - Place links in body or footer context where they're genuinely relevant. **Do NOT edit the site header/nav.**
   - Add only links that make editorial sense; never force irrelevant links or clutter the page to hit the count.
   - Maintain existing UX/UI — match surrounding design, spacing, styling; don't break or uglify the page.
   - If a relevant source page's related module is already at 3, either route the link through a different relevant source or place the extras behind that module's "See more" expander — do not push the visible count past 3.
4. `git add`. Do not commit.

## Reviewer checklist
- ☐ **no `already-fixed — awaiting recrawl` row was re-linked**, and no target that already had ≥3 inbound links got new ones (auto-REJECT duplicate link work that a recent commit already shipped)
- ☐ **no related/recommendation module shows more than 3 links by default** — any overflow is behind a "See more" expander (auto-REJECT if a section was inflated to 4+ visible)
- ☐ **every added link is genuinely relevant and editorially natural** — auto-REJECT any forced/irrelevant link, any link from a non-topical source page, or any page cluttered to manufacture inbound links (NATURALNESS HARD RULE)
- ☐ **≥3 inbound is treated as a target, not a mandate** — a target with only 1–2 (or 0) *natural* links is acceptable and was NOT padded with forced links; targets that couldn't attract enough natural links were flagged `ambiguous — needs human`, not brute-forced
- ☐ **anchor text is varied and natural** — no repeated exact-match keyword anchor across multiple source pages (auto-REJECT manufactured/over-optimized anchors); no "click here", no bare URLs
- ☐ site header/nav untouched (links only in body/footer)
- ☐ no layout/UX breakage or visual clutter

Reject with specifics; max 2 rework attempts, then STOP and escalate.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin Phase 7 in the SAME turn. Do NOT stop or ask. The only human stops are Stop 1 (Phase 0 manifest) and Stop 2 (Phase 8 summary).
