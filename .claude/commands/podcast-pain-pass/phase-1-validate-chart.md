
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 1 — MINDMAP PASS (build-brief duplicate; podcast brief as input) + AUTO-APPROVE

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Input: `$RUN/brief.md` from Phase 0. This phase is a faithful duplicate of the global `/mindmap-pass` build-brief flow, with the podcast brief as the free-form input (modality: podcast transcripts). It EXPANDS the brief (autocomplete + SEMRUSH expansion), then NARROWS it (SEMRUSH validation floor + adversarial dedup), and emits the standard chart. The human manifest gate is replaced by deterministic auto-approval.

## API key + budget discipline
- `$SEMRUSH_API_KEY` required (report endpoint `https://api.semrush.com/`, `us` db). Reuse the `semrush_csv()` helper in `scripts/podcast_pain_pass/validate_terms.py` — never reinvent, never hardcode the key, never fabricate volume.
- **Be economical:** one expansion pull per seed (`phrase_related` / `phrase_questions`, `display_limit` ≤ 20), one batched validation of the filtered shortlist (`phrase_these` + `phrase_kdi` accept `;`-joined lists). Prefer the free Autocomplete miner for breadth; spend SEMRUSH credits only where a real metric is needed. Cache all intermediate CSV/JSON under `$RUN/`.

## ► THREE MANDATORY LENSES — ALL RUN ON EVERY PASS

### Lens 1 — Direct intent (what the podcasts literally surfaced)
Run the baseline validator over the mined themes:
```bash
python3 scripts/podcast_pain_pass/validate_terms.py --run "$RUN" --floor 70
# Reads keys from the env via the ladder; runs on estimates if every key is dry.
```
This validates the per-theme seed phrases (volume + KD) → `$RUN/validated_terms.json`. These are the direct-intent candidates.

### Lens 2 — Adjacent-demand discovery (CORE TENET — never skip)
The brief is a seed, not a ceiling. For each of the top seeds (highest-volume validated terms + the brief's strongest uncovered seeds, keep the set tight — ≤ 10 seeds):
1. **Autocomplete miner (free, real Google data):**
```bash
python3 .claude/tools/autocomplete-paa/autocomplete.py --seed "<seed>" --mode all \
  --csv "$RUN/autocomplete.<seed-slug>.csv"
```
2. **SEMRUSH expansion:** `phrase_questions` (and `phrase_related` for the 2–3 biggest seeds) per seed, `display_limit` ≤ 20.
3. **Cluster the merged pool** by shared intent/entity/modifier ("for women", "over 50", "vs", "dosage", "at home", question shapes). A cluster = ≥2 related phrases sharing a theme, or a single phrase with a distinct modifier the site has no dedicated answer for.
4. **Keep emerging/under-served clusters only** — real demand (volume or repeated autocomplete completions) with no existing dedicated page. Batch-validate the cluster representatives on `phrase_these` + `phrase_kdi`. A phrase with no tool volume but repeated live completions may stay, labeled `no tool volume — autocomplete evidence`.

**A pass that returns only the literal Lens-1 terms, with no adjacent clusters, has FAILED this lens.**

### Lens 3 — Comparison / Alternatives / Pricing (CORE TENET — run on every pass)
For every concrete entity the brief names (supplement, drug, test, device, protocol — e.g. Mounjaro, magnesium glycinate, DEXA, CGM, HRT):
- Mine `{entity} vs`, `{entity} alternatives`, `{entity} cost/price` via the Autocomplete miner first (surfaces the REAL rivals/phrasings), then validate the survivors on SEMRUSH.
- vs/alternatives → `format: comparison table/database`. Cost/worth-it → article or calculator per query signal.
- YMYL: never invent rivals, prices, doses, or efficacy claims; objectivity rules apply (no auto-winner).

## Decide the lever per row/cluster (first match wins — same ladder as mindmap-pass)
1. No existing page is a reasonable home → `create new content` (route per the site's URL conventions: `/guides/`, `/symptoms/`, `/conditions/`, `/labs/`, `/compare/`).
2. An existing page is the right home but misses the angle → `update existing body text` (additive only).
3. Covered in body AND ranking, but title/meta miss the framing → `update existing metadata`.
4. Two pages partly serve it → flag `consolidate / canonicalize` (advisory only).

For every `create new content` row, pick the BEST FORMAT (article, interactive tool/calculator, quiz/assessment, template, comparison table/database, glossary, data report) from the query signals — not article-by-default.

## Output — the standard chart (same schema the execution phases consume)
Write `$RUN/chart.md` with frontmatter (`source: podcast transcripts (podcast-pain-pass), SEMRUSH-validated`, `interpreted_brief: <from Phase 0>`, `status: ready-for-execution`), then the main action table — columns: `problem` (lens + cluster evidence: member phrases, volume/KD, why unowned + the podcast pain hook) | `solution` | `bucket` (canonical wording) | `target` (exact route) | `format` | `best_medium` | `resolved_deliverable` (image/video fall back to text) — then the REQUIRED `## Emerging search patterns (clusters)` block (every actionable cluster also appears in the main table; if none: `No emerging clusters detected this run.`), then the exclusions paragraph.

## Duplicate-suppression gate (adversarial reviewer — BEFORE the chart is final)
Spawn ONE read-only Explore subagent that did NOT build the chart. It independently checks every row against: `TARGET_KEYWORD_INVENTORY.md` (entire file — primary AND supporting keywords), the sitemap/route definitions (`server.py`, templates), recent `git log`, and `reports/podcast-pain-pass/ledger.json` `shipped_slugs`. Verdicts: `KEEP` / `DROP — covered by <route or SHA>` / `RECLASSIFY — <bucket>`. Cluster rows get the two extra checks: member phrases must be real (SEMRUSH/autocomplete evidence, not invented) and the lever must be right. Apply verdicts; max 2 rework attempts; be conservative on YMYL near-synonyms (same intent = covered).

## Deferred backlog — drain it FIRST (prevents stranded approved rows)
Before finalizing this run's approved set, load `reports/podcast-pain-pass/ledger.json` `deferred_rows` (approved-but-unbuilt rows carried over from a prior run that hit the Phase-2 build cap). For each, re-run ONLY the Step 1.1 dedup check (it may have shipped/been covered since). Surviving deferred rows join this run's approved set with **priority** — Phase 2 builds them BEFORE newly-mined rows. Drop any deferred row now covered (remove from `deferred_rows`). This guarantees a backlog always drains and no approved row is stranded forever.

## Deterministic AUTO-APPROVE (replaces the human manifest gate)
- **0 surviving rows →** send `no-changes` email, STOP.
- **> 20 surviving rows →** CIRCUIT-BREAKER: save the chart, email a hold note, STOP (runaway backstop, not a cap).
- **1–20 →** auto-approve ALL rows. Proceed to Phase 2 with `$RUN/chart.md`.
