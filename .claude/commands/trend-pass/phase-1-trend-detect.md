
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 1 — Trend detection (CORE) + trend ledger check

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Work from the Phase 0 pull JSON only.

> **Research only (2026-10-06 port of the layer3 2026-10-05 redesign).** Lane A never builds or writes pages and calls no external API. Its output is a verdict + findings for the research pack (Phase 4); the mindmap engine (Phase 4c) is the only builder.

> **⚠️ Lane A feeds Lane C — READ FIRST.** This phase only decides Lane A's research verdict; it never ends the run. Any outcome below that says "stop" (or used to say "exit 0 / ALL WORK STOPS") means only *Lane A adds no findings this run* — control always continues to Phase 1b (Lane B), then Phase 4 (research pack), then **Phase 4c (mindmap), which runs every run, in full**. Never `exit 0` from this phase, and never treat "no trend" as a reason to skip Phase 4c.

## 1. Filter query noise
Drop any query starting with `-` or containing `-site:` (audit-crawler operator strings, not human demand). Collapse obvious near-identical 0-click impression-spam variants to one representative. Pages are never noise.

## 2. Classify each surviving query AND each top-10 page on two axes
- **entity/topic** — the subject (product, brand, question, concept) the query/page is about.
- **content-format** — review / roundup / guide / comparison / how-to / explainer / tool / news, etc. (match the repo's own page types, discovered from the sitemap).

Print the classification table (lands in the transcript + digest).

## 3. Clear-trend rule (deterministic)
A theme qualifies when **≥3 of the surviving top-10 queries share it** (same entity/topic family — variants/misspellings count), OR **≥3 of the top-10 pages share it AND those pages hold ≥40% of the top-10 pages' clicks** (page-side trigger; the usual one on a low-traffic site). No qualifying theme → **NO CLEAR TREND** (record the verdict for the digest), then **go to Phase 1b** — do NOT exit. A trendless run still runs the coverage lane.

## 4. Trend ledger check (BEFORE any mining)
Read `reports/trend-pass/trends.md`. Match semantically against the MINED rows (trends whose content already exists) and the EVERGREEN rows (steady site demand).
- **MATCH → the TREND lane stops.** No trend gap research, no trend findings, no queue, no backlog for the trend. Record the verdict ("Trend already caught on <date>: <theme> — no trend work this run") for the digest, then **go to Phase 1b** (the coverage lane still runs). Do NOT exit the run.
- **Ownership by another engine is NOT a match/stop** — there is no RADAR-OWNED class; if the theme isn't a MINED/EVERGREEN row, it's a NO MATCH even if some other engine also covers that surface.
- **NO MATCH** → step 5.

## 5. Adversarial refutation (one shot, ledger-NEW trends only)
Spawn ONE subagent (that did NOT classify) with the pull JSON, your theme statement, and `trends.md`. It tries to (1) refute the ≥3 grouping as coincidence, and (2) map the theme onto a MINED/EVERGREEN row. Refuted (1) → NO CLEAR TREND → **go to Phase 1b**. Refuted (2) → MATCH → the trend lane stops → **go to Phase 1b**. Survives → append the new trend row to `trends.md` (status `MINED`) and proceed to Phase 2 (Phase 1b still also runs).

## Output
Always hand off to **Phase 1b (coverage lane)**, plus either (a) a confirmed NEW trend + entity list → Phase 2, or (b) a "no clear trend" / "already caught" verdict → the trend lane contributes nothing. The run does NOT exit here; there is no "drain" path and no `exit 0` in this phase.
