
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->

# Phase 2 — Opportunity mining: the 5 lanes, per audited page

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


For EACH page on the Phase 1 roster, run all five lanes. Every lane emits candidates into ONE unified list (each row: `lane · route-it-grows · slug-or-edit · evidence · proposed title/section`). Nothing is written here — `phase-3-dedup.md` decides survival, `phase-4-execute-publish.md` builds.

> **Portable — discover, don't assume.** This skill runs on many different sites. Do NOT assume a particular content domain, archetype set, or that any sibling skill is installed. Where a lane says "if `<skill>` is present," check `.claude/commands/<skill>/`; if it's there, follow it; if not, apply the inline fallback described in that lane. Discover the site's own archetypes and slug conventions from its existing slugs (via the inventory below), never from a fixed list.

First, once for the whole run:
```bash
python3 scripts/trend_pass/slug_inventory.py --json > /tmp/ga4-top-pages-inventory.json
```

And per page, mine autocomplete around its head term (seed = the page's topic head phrase; add the page's top 3 GSC queries as extra seeds when available):
```bash
python3 scripts/trend_pass/mine_trend_autocomplete.py --seeds "<head term>" "<gsc q1>" "<gsc q2>" "<gsc q3>"
```

## Lane A — Spoke / sibling pages
Infer the site's archetype set from the inventory (what shapes of page already exist — e.g. comparison `vs`, `alternatives`, explainer/hub, industry/vertical spokes, roundups, and any site-specific families this site happens to use). Build the coverage row for THIS page's core entity/topic across that discovered archetype set. Mark each cell BUILT/EMPTY against the inventory; copy the slug convention from the page's nearest existing siblings exactly — do not invent new slug shapes. Every EMPTY cell is a candidate with evidence = this page's views (it inherits the winner's demand). **Adjacent intents only** — a candidate that targets the winning page's own head intent is winner-protected (Phase 3 kills it; don't emit it).

## Lane B — Comparison / alternatives / worth-it coverage
For the page's entity, check: does its `X-vs-Y` set cover the counterparts autocomplete actually suggests? Does `X-alternatives` exist? Do "is X worth it" / pricing intents exist where autocomplete shows that demand? Missing + autocomplete-confirmed → candidate.
- **If `comparison-content-creator` is present:** follow its `phase-1b-coverage-check.md` dedup rules and never rebuild a comparison its history (`reports/comparison-content-creator/`) already shipped, PARTIAL-matched, or dropped.
- **Else:** treat vs/alternatives/worth-it as ordinary new-page candidates — Phase 3's slug/git/ledger layers still catch existing ones.

## Lane C — Body / FAQ enrichment
From the page's autocomplete sub-intents + GSC `top_queries`: which real questions/sub-intents are NOT answered on the page? Score coverage honestly — a heading that name-drops the topic without answering it is NOT covered.
- **If `question-gap-pass` is present:** use its `phase-2-questions.md` + `phase-3-coverage.md` method.
- **Else:** list the real follow-up questions for the page's topic and mark each answered/unanswered on the page directly.
Each high-value miss → an enrichment candidate (`route + section to append`). If another page on the site already owns that sub-intent as its dedicated topic, the candidate becomes "add internal link", not a new section.

## Lane D — Metadata (evidence-gated, strict)
ONLY for pages whose Phase 1 GSC verdict is `underperforming` with `rewrite_recommended: true` (impressions exist, CTR below threshold). Candidate = title/meta-description rewrite grounded in the page's actual `top_queries`. `performing`, `mixed`, or `no-data` → lane closed for that page, say so in the digest. (This is a correctness gate, not a numeric cap.)

## Lane E — On-page tools / quizzes / calculators
Scan the page's autocomplete results for tool-intent modifiers: `calculator`, `checker`, `template`, `quiz`, `generator`, `comparison tool`, `cost estimator`. A tool-intent suggestion with no existing tool covering it (check the inventory + the site's existing interactive components) → tool candidate; prefer embedding ON the winning page with a shareable route.
- **If `downloadable-asset-pass` is present:** follow its `phase-3c-tool-build.md` build conventions.
- **Else (the common case):** build a clean client-side tool — real working logic (no fake outputs), no new dependencies, no secrets, matching the site's existing component style.

## Output
The unified candidate list, tagged per lane and per source page, plus any Phase 1 deferred-drain rows → `phase-3-dedup.md` → `phase-4-execute-publish.md` (which also updates the page-audit ledger).
