
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 1 — Scrape + diff (NET-NEW)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Run the scraper to crawl every roster competitor, diff against the ledger, and emit candidates. This is deterministic Python — **no LLM, no AI spend** here.

## Run the scraper

```bash
TODAY="$(date +%Y-%m-%d)"
python3 scripts/competitor_monitor/scraper.py detect \
  --out "reports/competitor-monitor/candidates-$TODAY.json"
```

This:
- Crawls each competitor's sitemap(s) (robots.txt + `/sitemap.xml` + `/sitemap_index.xml`), diffs URLs against `reports/competitor-monitor/ledger.json`.
- **First crawl of a competitor is a QUIET SEED** — every current URL is marked `baseline`, **0 candidates emitted** (no publish/email storm on first run).
- For an already-seeded competitor, emits **new** URLs and **materially-updated** pages (lastmod advanced + content hash changed). Still-`pending` pages from a prior crashed run are re-emitted (crash-safety).
- **Applies the relevance gate.** Only pages inside this project's niche (AI/automation/agents/CRM/receptionist/customer-service/SMB-ops/LLM/RAG, etc.) become candidates. Off-niche pages (crypto, mobile dev, enterprise cloud, etc.) are **recorded as `skipped-off-niche` in the ledger and NOT generated** — they appear in `payload.skipped_off_niche` for the email, and never re-surface.
- Writes the updated ledger (seen-state + `pending` markers + off-niche skips) and the candidates file.

> The scraper writing the ledger here is expected — it is part of this run's commit. New/updated candidates are marked `pending`; they only become `done` when Phase 6 records a disposition.

## Read the candidates

Load `reports/competitor-monitor/candidates-$TODAY.json`. Each candidate has: `competitor`, `competitor_name`, `url`, `title`, `kind` (`page`|`comparison`|`tool`), `change` (`new`|`updated`|`pending-retry`), `lastmod`, `content_hash`, `outline` (H2/H3 = the **coverage floor**), `tool_io` (for tools).

## Decision

- **`candidate_count == 0`** (first run, or nothing new) → do NOT generate anything. Commit the ledger (and candidates file) and hand to the email phase as **`no-changes`** ("No new competitor content detected; ledger seeded/refreshed."). Exit the run after the email.
- **Otherwise** → apply the per-run cap from the launcher (default 10): if candidates exceed the cap, keep the **most recent** N (sort by `lastmod` desc, then `change` priority new>updated>pending-retry), and record the overflow URLs for the email. Carry the kept candidates to Phase 2.

Print: total candidates, by-kind counts, fetch failures, kept vs overflow. **Auto-continue to Phase 2.**
