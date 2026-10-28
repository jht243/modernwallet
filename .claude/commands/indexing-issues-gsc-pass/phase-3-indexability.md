
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 3 — Indexability unblocks

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


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
