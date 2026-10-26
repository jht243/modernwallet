
<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
<!-- /workflow-source-freshness-v1 -->

# Phase 6 — Summary + HARD HUMAN GATE, then push

<!-- decision-evidence-v1 -->
## Evidence and growth hand-off

Follow `_decision-evidence.md`, section 5. For each substantive contribution, report the decision improved, evidence type, packet path, hypothesis and outcome status. Register its `growth.json` in `reports/content-evidence.jsonl` with a stable run/route id, route, origin routine, packet path, growth path and status. Update the same id on deployment/outcome review; do not duplicate it. Local-only work has no deployed date or traffic uplift. Publication permissions and this phase's existing gates are unchanged.
<!-- /decision-evidence-v1 -->

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->

This is the **one human gate** in the run. Everything is staged locally on a working branch (Phase 5); nothing is live yet. Print the summary, **STOP, and wait for explicit approval**. Only after the user approves do you push to main and ping IndexNow. Also write the report to `reports/comparison-content-creator/run-<TODAY>.md`.

## Report contents
- **The Candidate Chart (reprint in full).** Lead with the mandatory chart from Phase 2 (exact format in the launcher) covering ALL candidates — built, partial, duplicate, low-volume — with a "Published?" mark added to each row. This is the headline artifact.
- **Candidates funnel:** total generated → after cache-dedup → after coverage check (NEW) → scored → selected. Show the drop counts at each stage.
- **Published pages:** for each, the slug, live URL, primary keyword, and the **live data behind it** (search volume, KD, top SERP competitors, GSC impressions if any, composite score). No invented numbers.
- **Held as draft:** any page that failed Phase 4 twice — slug + reason (what the audit flagged). These are committed but noindex.
- **Enriched pages (done, not a to-do):** every `PARTIAL` that Phase 3b spot-edited — the existing URL, the entity pair, and **what was actually added** (the head-to-head sub-section / table / verdict / FAQ). These are real, staged in-place edits to existing pages — not new routes. Note any PARTIAL that was **skipped** ("already covered") or **reverted** (failed audit twice) with the reason.
- **Dropped as duplicate:** `DUPLICATE` candidates + the conflicting existing URL (so the human can confirm nothing valuable was skipped).
- **API usage:** how many keyword-research calls were made, and confirmation that zero were spent on cached/duplicate/covered pairs.
- **Publish facts:** commit SHA (+ link), files touched, sitemap entries added, IndexNow HTTP status.
- **Cache:** path to the updated `reports/comparison-content-creator/cache.json` and how many losers were recorded for future runs.

## ‼️ The gate
After printing the summary + chart, ask exactly this (or its functional equivalent) and STOP:
> "Staged on branch `{branch}` ({N} pages, typecheck green). Approve to push to main + ping IndexNow, or hold to revise?"

Acceptable approvals: "approve", "push", "go", "ship", "yes". On anything else, STOP cleanly and leave the working branch in place for the user to inspect, edit, or discard — do not push.

## After approval — push + IndexNow
Only once approved:
1. Merge/rebase the working branch onto the default branch and **push to main**. Capture the full commit SHA confirmed on the remote. (Reuse `git_commit_push()` if present.)
2. **IndexNow:** if a key exists, POST the full list of live, non-draft URLs — **both the new pages AND every enriched URL** (their content changed, so they should be re-crawled) — and capture the HTTP status. Only ping URLs that are actually deployed/live. (Reuse `indexnow()` if present.)
3. Print the final confirmation (SHA + link, live URLs, IndexNow status).

## Optional email
If Phase 0 found an email mechanism (e.g. a Resend integration / `notify.py`), send the same summary to the project's owner after the push. If none exists, skip.
