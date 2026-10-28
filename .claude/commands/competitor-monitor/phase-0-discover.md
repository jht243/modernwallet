
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->

# Phase 0 — Discover project facts + load roster/ledger

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Auto-discover every project fact by inspecting the repo. **Hardcode nothing.** Persist findings to `reports/competitor-monitor/discovery.md` so later phases share state, then auto-continue to Phase 1.

## Reuse the comparison discovery, then add the competitor-monitor extras

Run the discovery in `.claude/commands/comparison-content-creator/phase-0-discover.md` to capture: **BASE_URL**, framework + deploy mode (Next.js / Astro / MDX / etc.), the **content format + where new pages are stored** (the exact data file / `*-new` auto-merge file, or MDX/content dir, that the reused comparison/keyword generator writes to), the **entity universe + full existing-content inventory** (slugs + H1s + target keywords across ALL content — Phase 2 needs all of it), the **business/brand name** (the `{BUSINESS_NAME}` value Phase 3 substitutes), **publish conventions** (sitemap files `public/sitemap*.xml`, IndexNow key `public/<32-hex>.txt` if any, typecheck/build command), and **reusable scripts** (any project publish/generate/audit helper — e.g. one exposing `existing_slugs` / `add_sitemap` / `indexnow` / `git_commit_push` — that Phases 3/5/6 can reuse).

> **Skip the "no SEO data source connected" hard-blocker** from that file. This skill does **not** use Ahrefs/SEMrush/GSC — its trigger is competitor publishing, not search data. Absence of an SEO data source is NOT a blocker here.

## Competitor-monitor-specific discovery

- **Roster** — read `scripts/competitor_monitor/competitors.json`. Count enabled competitors. If the file is missing or empty → **hard blocker** (skip run, email failure: "competitor roster missing").
- **Ledger** — read `reports/competitor-monitor/ledger.json`. Note how many competitors are already tracked and whether this is effectively a first run (empty `competitors`).
- **Previous baseline chart** — find the most recent `reports/competitor-monitor/baseline-*.{md,json}`. This is the reference chart the run measures against. Note its date and per-competitor on-niche counts. If none exists, this is the first run — the baseline gets created at the end (Phase 6). The chart is regenerated and committed **every run**, and each new chart auto-diffs against the previous one (its "Changes since the previous chart" section is the spotted delta).
- **Existing tools/interactives** — find whether the project has interactive tools/calculators and, if so, the pattern they follow (route location, component location, any SoftwareApplication JSON-LD helper) so Phase 3c can mirror it. If the project has NO interactive-tool mechanism, Phase 3c falls back to a guide page.
- **Tools sitemap** — note which sitemap lists tool/interactive routes (if the project has one).

## Hard-blocker checks (STOP only on these)
- No content system found (no guides/comparisons data files).
- Competitor roster missing/empty.
- Working tree not safe (uncommitted unrelated changes) — pre-flight already covers this.

## Output
Print a compact discovery summary (BASE_URL, framework, content data files, # existing guides/comparisons/tools, roster size, ledger state, reusable scripts, IndexNow key present?) and write the full version to `reports/competitor-monitor/discovery.md`. **Auto-continue to Phase 1.**
