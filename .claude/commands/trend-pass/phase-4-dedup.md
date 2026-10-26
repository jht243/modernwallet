
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 4 — Local pre-filter + research pack

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Lanes A and B are research only (2026-10-06 port of the layer3 2026-10-05 redesign). This phase does NOT decide what gets built. It removes findings that obviously already exist, so mindmap doesn't waste work on them, and packages everything for the builder, mindmap (Phase 4c). **Local checks only — no external API, no keyword data, no SERP reads.** Winner protection, near-duplicate judgment, demand validation and the cap all belong to mindmap.

> **"Owned by another engine" is NEVER a removal reason.** The only removal reason here is that the page already exists (or was already judged in the ledger). Overlap with another engine is mutual and self-resolving via existence dedup.

## 1. Pre-filter each finding (local, cheap)
For every finding from Phase 2 (`source: trend`) and Phase 1b (`source: coverage`):
- **Slug inventory:** `python3 scripts/trend_pass/slug_inventory.py --base-url <BASE_URL> --check <slug>` → exit 1 (TAKEN) → remove ("exists: <where>"). It matches the full path OR the last segment, so a bare segment like `interest-calculator` can collide with a route in another vertical — record which route it hit.
- **Git history:** `git log -S "<slug>" --oneline` → hit → remove with the commit ref (a deliberately removed page must not silently return). A hit that is only a planning mention in a report (e.g. a `reports/keyword-pass/*.md` chart row that was never built) is NOT an existing page — keep the finding and note the ref.
- **Candidate ledger:** `reports/trend-pass/ledger.md` has it as KEPT or DROPPED → remove (the old row stands). An owner OVERRIDE row beats an earlier DROPPED; a HELD row does not block (see Phase 4c ledger statuses).

Removed findings are listed in the run report, not ledgered again.

## 2. Assemble the research pack
Write `reports/trend-pass/<YYYY-MM-DD>.research.md`:

```markdown
# Trend-pass research pack — <data_date> (7-day window <start>→<end>)

## Trend (Lane A)
Verdict: <NEW TREND: <theme> / Trend already caught on <date>: <theme> / No clear trend> — <evidence counts>
### Trend gap findings
- <suggested slug> — <entity × angle> — sibling evidence: <route, clicks> — proposed title: <title>

## Query check (Lane B)
Verdict: <N covered / M uncovered of top-20>
- "<uncovered query>" (<clicks> clicks, <impr> impr) — entity: <entity> — suggested angles: <anchor, angle, angle…>

## Pre-filtered out (already exists)
- <slug> — <reason>
```

Every heading is always present; write `None this run` under an empty one.

## Output
The research pack path → Phase 4c.
