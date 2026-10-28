
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 1 — Diagnose: flag → filter → evidence → name the failure mode

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


The heart of this pass. Nothing is edited here; the output is a **diagnosis roster** — each entry a page, its evidence, and a named failure mode that Phase 2 turns into prescriptions. Wrong diagnosis = wrong medicine, so every rule below is deliberately conservative.

## 1. Classify every pulled page
For each of the 25 pages:
- **Archetype** — discovered from the site's own page shapes (slug inventory + route patterns): `guide`, `comparison`, `explainer/hub`, `vertical-spoke`, `roundup`, `briefing`, `tool`, or `conversion/nav` (home, service, booking/audit, resource hubs, about, contact). When unsure between content and conversion, choose conversion — the safe default, since conversion pages are never body-edited.
- **Non-organic %** from `channel_split` (Direct + Referral + Unassigned share).

## 2. Traffic floor
Only pages with **≥50 sessions in the window** can be flagged. Below that, engagement rates are noise — list as `below floor` in the digest and move on. Never lower the floor to force findings.

## 3. Weak-signal flags (archetype-relative — no absolute thresholds)
Compute per-archetype medians *within the pulled set* for `avg_eng_s`, `engagement_rate`, `bounce_rate`, and `scrolled_pct` (if present). An archetype with <4 pages in the set falls back to the medians across all content-archetype pages. A page's flags:

| flag | condition |
|---|---|
| `DWELL` | `avg_eng_s` < 0.5 × archetype median |
| `ENG_RATE` | `engagement_rate` < 0.5 × archetype median |
| `BOUNCE` | `bounce_rate` > archetype median + 15 points |
| `SCROLL` | `scrolled_pct` < 0.5 × archetype median (only when the property has scroll data) |

**A page is FLAGGED when it has ≥2 flags** (any combination). One flag alone is never actionable — single-signal "problems" are how an engine ends up "fixing" healthy pages.

- Flagged **conversion/nav** pages: never body-edited → digest section "Flagged for the human", with their numbers. Done with them.
- Flagged **content** pages → continue.

## 4. Cooldown + buffer filter (before any expensive evidence pull)
In order, per flagged content page:
1. **Own cooldown (HARD 7 days):** row in `reports/page-quality-pass/page-quality-audits.md` with `treated` date < 7 days ago → SKIP (`cooldown until <date>`).
2. **GA4-pass buffer (48h):** row in `reports/trend-pass/ga4-page-audits.md` audited < 48 hours ago → SKIP (`GA4-buffer`) — never two engines on one page in one cycle. Older audits do NOT block: that pass builds around pages and appends; it does not treat weak bodies.
3. Survivors are tonight's **candidates**. All flagged pages filtered out → early exit per the orchestrator (a first-class success).

## 5. Per-page GSC evidence (for intent + metadata decisions)
For each candidate:

```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
  --base-url <BASE_URL_FROM_ROUTINE> \
  --page <BASE_URL_FROM_ROUTINE><route> --trend
```

Record `totals`, `top_queries`, `verdict` (`performing`/`underperforming`/`no-data`/`mixed`, plus `rewrite_recommended`). `no-data` is common for AI/direct-traffic pages — the metadata lane closes, everything else stays open.

## 6. Diagnosis (named failure modes — exactly one primary per page)
Judge the signal PATTERN, not any single number:

Check `QUICK_ANSWER_OK` FIRST — it guards everything below. Then: **THIN is about leaving fast** (weak dwell, corroborated), **DEAD_END is about leaving after reading** (healthy dwell, weak bounce/engagement). A high bounce alone can't distinguish them — on archetypes that bounce high as a class (comparisons), the corroborating flag is often `SCROLL` or `ENG_RATE`, not `BOUNCE`.

| diagnosis | signal pattern | what Phase 2 prescribes |
|---|---|---|
| `QUICK_ANSWER_OK` *(check first)* | `DWELL` but bounce ≤ archetype median AND (eng rate healthy OR scroll healthy): they got the answer fast and left satisfied | **NO ACTION.** Log why. This row exists to stop the engine from "fixing" pages that work. |
| `THIN_UNDERDELIVERY` | `DWELL` + ≥1 corroborating flag (`BOUNCE`, `SCROLL`, or `ENG_RATE`): visitors arrive, find nothing worth staying for, leave in seconds without scrolling | **section-level rewrites** of the sections that fail their headings; append missing high-value sections |
| `DEAD_END` | dwell near/above median but `BOUNCE` + `ENG_RATE`: they read, then have nowhere to go | **next-step internal links** — contextual links + a "read next" pathway; body prose untouched |
| `INTENT_MISMATCH` | GSC `top_queries` ask something the page doesn't actually answer (compare queries to the page's real content, not its headings) | rewrite the ANSWERING section to answer the real query; metadata only if the GSC gate authorizes |
| `TOOL_INTENT` | autocomplete around the head term shows calculator/checker/template/quiz intent AND the page is pure prose | **embed a working on-page tool** (secondary diagnosis allowed alongside any of the above) |

Ambiguous pattern (e.g. skewed dwell: high avg but terrible eng rate — a few deep readers masking mass bounces) → prefer the LEAST invasive diagnosis consistent with the evidence (`DEAD_END` before `THIN_UNDERDELIVERY`). When even that feels forced → `QUICK_ANSWER_OK` + digest note. **When in doubt, don't operate.**

## 7. Improvement report (the feedback loop — measurement only)
From this pass's own ledger, every page treated **≥14 days ago**: compare its stored pre-edit metrics to the current window's (pull rows, or a one-page targeted GA4 query for treated pages that fell out of the top-25). Emit the before→now table for the digest. **No automated action from this data in v1.**

## Output
The diagnosis roster: route, archetype, metrics, flags, GSC evidence, primary (+ optional `TOOL_INTENT` secondary) diagnosis → `phase-2-prescribe.md`. Plus the improvement-report table and the skipped/flag-only lists for the digest.
