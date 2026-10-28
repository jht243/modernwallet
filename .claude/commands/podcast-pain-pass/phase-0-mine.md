
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 0 — EXPAND (pull new episodes → mine patient pain → compose the BRIEF)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


This phase only EXPANDS: podcasts → mined pain → a free-form brief. **No SEMRUSH, no narrowing here** — all validation/narrowing happens inside the Phase-1 mindmap pass. Set `DATE=$(date +%Y-%m-%d)` and `RUN=reports/podcast-pain-pass/run-$DATE`.

### Step 0.1 — Pull new episodes (RSS diff vs ledger)
```bash
python3 scripts/podcast_pain_pass/pull_new_episodes.py --out "$RUN" --max-per-show 6
```
- Reads `scripts/podcast_pain_pass/feeds.json` (roster of TRANSCRIPT-READY hormone / menopause / longevity / lab shows) and diffs each feed against `reports/podcast-pain-pass/ledger.json`.
- Downloads + normalizes the transcript for each new episode; writes `$RUN/manifest.json` and marks GUIDs processed in the ledger. Only episodes carrying a `<podcast:transcript>` tag are pulled (no speech-to-text). Transcript downloads are large — allow several minutes.
- `--max-per-show 6` is the per-feed circuit breaker (a long gap won't ingest a back catalog).
- **If output contains `NO_NEW_EPISODES` (empty manifest):** quiet week. Send the `no-changes` email and STOP the whole run.

### Step 0.2 — Mine patient-pain clusters
```bash
python3 scripts/podcast_pain_pass/mine_pain.py --run "$RUN"
```
Scans transcripts for patient-pain sentences (symptoms / struggles / unanswered questions / lab-number talk) and clusters them per site theme into `$RUN/pain_clusters.json`. Routing is by the theme matched IN the sentence, not the show's coarse topic tag.

### Step 0.3 — Compose the BRIEF (the mindmap-pass input)
Write `$RUN/brief.md` — the free-form input brief that Phase 1 (the mindmap-pass duplicate) consumes, exactly as if a human had handed `/mindmap-pass` a note. It must contain:
1. **Interpreted brief** (2–4 sentences): what this week's episodes say readers are struggling with / asking about, in your own words.
2. **Per-theme sections** for every theme present in `pain_clusters.json`: the theme, its hit count, 1–3 representative pain quotes (verbatim, marked as transcript quotes — they may contain speech-to-text noise; they anchor intent only), and 3–6 **seed phrases** — the informational queries a reader with that pain would type. Derive seeds from BOTH the mined language and `scripts/podcast_pain_pass/validate_terms.py`'s THEME_TERMS baseline for that theme.
3. **Entities named in the episodes** (supplements, drugs, tests, devices, protocols — e.g. "magnesium glycinate", "Mounjaro", "DEXA scan", "CGM"): list them; Phase 1's Lens 3 mines vs/alternatives/pricing formats around them.

**If `pain_clusters.json` is empty:** nothing minable this week → send `no-changes` email and STOP.

Proceed to Phase 1 with `$RUN/brief.md`.
