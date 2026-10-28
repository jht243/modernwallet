
<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 3 — New content creation (API-generated — see `_content-generation.md`)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


<!-- intent-takeaway-v1 -->
**Intent-based takeaway:** Read `_decision-evidence.md` in the active project's `.claude/commands/`, especially “Close with a takeaway that answers the page's intent.” Pass the planned conclusion, applicable reader/task, actual evidence basis and decision-changing condition into the existing writer brief. Reuse a sufficient verdict; preserve the no-addition branch and local exclusions. For global commands, resolve/install the sibling shared contract in the active project while preserving local rules.
<!-- /intent-takeaway-v1 -->

<!-- decision-evidence-v1 -->
## Decision evidence before drafting

Read and apply `.claude/commands/_decision-evidence.md` inside this phase, before assembling the writer prompt. Reuse the approved reader question, produce the strongest feasible evidence and counterexample, then select the presentation. Calculators remain an option, not a quota. Give the writer the evidence packet, including the supported provenance and its visible placement, with its closed facts; ask for explicit, natural phrasing at the relevant finding: “In our internal analysis/modeling/testing, we [specific action]…” matched to the evidence, followed by what we found and how readers can check the method or inputs. Merely naming the source of inputs is insufficient; preserve the existing API-writing, review and permission rules. Evidence labels take precedence over automatic TESTED-format eligibility: simulated/calculated data never licenses a firsthand-testing claim.
<!-- /decision-evidence-v1 -->

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->

> **‼️ THE RUNNING AGENT DOES NOT WRITE THE ARTICLE.** Page prose is generated by the
> configured model through `scripts/lib/content_gen.py` per
> `.claude/commands/_content-generation.md` (the canonical contract — read it in full before
> this phase). You assemble the prompts, run the generator, verify the draft mechanically, and
> hand it to the Phase 4 audit. Writing a page yourself, or substituting a model silently, is a
> hard failure of this phase. If the generator cannot run, STOP and report.

Act on every **new-content** row in the chart. The row's `format` column routes it:

- **`article` / no format** → generate the page.
- **`comparison table/database` whose target is a real comparison page type in THIS repo** →
  generate it as a real page (JSON stores: `--schema comparison`). Otherwise it is a spec.
- **`interactive tool`, `calculator`, `quiz/assessment`** → BUILT in this run, for real: follow
  `.claude/commands/mindmap-pass/phase-3c-tool-build.md` (mirror this repo's existing tool wiring,
  defensible logic, `data-tool` root, page prose from the API writer). A working tool on a live
  route — never a spec, never a stub. (MINDMAP-BUILDS-TOOLS)
- **`template`, `glossary/reference`, `data report` (as an interactive asset)** → this phase does
  NOT build the asset and does NOT call the generator. Write a one-page asset spec at
  `reports/mindmap-pass/specs/<slug>-spec.md` (route, format + rationale, what it does — column
  schema / data sources — keywords, scope, dependencies). `git add` it; Phase 4 reviews the spec.
  Never write stub page content for these.

> **NET-NEW ONLY.** This phase creates brand-new routes. Never overwrite, regenerate, or
> replace an existing page. A "new-content" row pointing at a route that already exists → STOP
> and flag it.

## Step 0 — load the standards (sanctioned loader) and preflight the generator

```bash
bash .claude/tools/load-standards.sh "mindmap-pass" "phase-3"     # if the loader exists; else read the three standards in full
python3 scripts/lib/content_gen.py preflight                       # at least one model in the chain must answer
```
`git add reports/standards-ledger.jsonl` when the loader wrote it. A failing preflight STOPS
the phase — do not write the pages by hand instead. If the run must use the fallback model
(the preflight says so), every page's meta will say `fallback_used` — report that in the summary.

## Step 1 — assemble the prompts (order per `_content-generation.md`)

Write everything under `reports/mindmap-pass/<TODAY>/prompts/`. **Use the page shape Phase 0
discovered for THIS repo:**

- **JSON/TS data stores** (pages are objects in a data file): the voice sample is a real page
  object from that store; the output contract lists its exact keys; generate with
  `--format json --schema guide|comparison|none`.
- **Markdown / MDX / Astro-content stores** (pages are files with frontmatter): the voice sample
  is a real page FILE (frontmatter + body) from the content directory; the output contract is
  "return the complete page file — the same frontmatter fields, then the body"; generate with
  `--format markdown` (no `--schema`).

- **`system.md`, once per run (one per page type if the run has several)** — (1) the real
  published page/file of the SAME type, labelled *imitate this* (for a launch family, a sibling
  is ideal; never the page being written); (2) the output contract for that shape (noun-phrase
  headings, ≤1 heading opening with the keyword, the CTA button text this repo uses, the brand
  first-"we" rule "At {BUSINESS_NAME}, we…" using the name Phase 0 discovered);
  (2a) when writing `metaTitle`, `h1`, `subtitle` and `metaDescription`, take the row's
  `reader question` into account — these are what the person who typed that question sees in
  the results and on arrival, so their wording is a useful guide to what will read as the
  answer. Lean toward the words that person would use over the words the vendor uses for
  itself; a term the product coined for itself usually lands better in the body, where you
  define it, than in the headline.
  (3) `_anti-ai-language.md` WRITER section (wins on conflict); (4) `_experience.md` in full;
  (5) `_content-standard.local.md` if present; (6) `_content-standard.md` LAST, scoped to
  structure/SEO/depth — "follow its rules, do not copy its tone".
- **`<slug>.prompt.md`, one per row, DATA ONLY** — route/slug/type/depth floor, keywords +
  intent from the chart row, **the chart's cols 10–12 copied verbatim — `reader question: "…"`, `answer: …` (with its
  shape), `answer placement: section 1|2 "<heading>"` — decided in build-brief Step 4.6, never
  re-derived here; the writer is told the answering section goes in that slot, before any
  scope/definition material (`_content-standard.md` INTENT; Phase 4 fails `intent-answered-late`)**,
  SERP evidence and real PAA questions as the FAQ spec, **the
  CLOSED FACT LIST** (with the "anything not on this list, you do not know" sentence and any
  leak warnings), **the CLOSED URL LIST**, the real internal routes it may link (siblings
  shipping in this run are fine), section-by-section coverage; for comparisons the two option
  names + table dimensions + the objectivity rule.
- **`allowed-urls.txt`** — one allowed external URL prefix per line (the mechanical guard).

## Step 2 — generate, one row at a time

```bash
python3 scripts/lib/content_gen.py write \
  --system reports/mindmap-pass/<TODAY>/prompts/system.md \
  --prompt reports/mindmap-pass/<TODAY>/prompts/<slug>.prompt.md \
  --out    reports/mindmap-pass/<TODAY>/drafts/<slug>.<json|md> \
  --slug   <slug> --floor <floor> --format <json|markdown> [--schema guide|comparison|none] \
  --allowed-urls reports/mindmap-pass/<TODAY>/prompts/allowed-urls.txt \
  --facts  reports/mindmap-pass/<TODAY>/prompts/<slug>.prompt.md
```
Check draft one before draft two. The generator applies the remediation ladder to the returned
draft rather than rejecting it: it **repairs in place** (fence, slug, a missing build-critical
key, an off-list link stripped with the sentence kept, house style) and logs each repair in
`meta.guards.repairs`; it **flags** for the auditor (`meta.guards.flags`) a missing content
field, a stripped citation, a page under the depth floor, and untraceable numbers; it
**regenerates only** a truncated page (after one retry at double the cap) or unparseable
output (raw saved). Read `meta.guards` before moving on — never send a whole page back for a
one-line fix. **`git add` every `.meta.json`** — it is the provenance record.

## Step 3 — verify → template → lint → Phase 4

1. **Topic-residue grep** across each draft for sibling topics that could have leaked from the
   voice sample or other rows. Read the draft; reject on any claim outside the fact list.
2. **Template** into THIS repo's store exactly as the pre-migration routine did (the page
   template, schema builders, dates, related links, and the inline CTA pointing at the
   consultation route **Phase 0 discovered — never invent a URL**). Every required page field
   must be present; a missing required field is a lint failure, not a render fallback.
3. **Mechanical lint (Rung 0)** with whatever this repo ships — `scripts/content_lint.mts`
   (Next/TS) or the portable `scripts/content_lint.py` — on every new slug, fix until clean.
   If the repo has no lint, apply the standard's PREFLIGHT list by hand.
4. **Phase 4 audit is the gate** — hand the auditor the closed fact list(s) AND the allowed URL
   list with the drafts, so a real sourced fact is not flagged as fabrication. Verify any
   "unsupported claim" finding against the source before acting on it. Fixes follow
   `_remediation-ladder.md`, **per page**: Rung-0 mechanical edits in place. Claim and tell
   findings (unsupported / inferred / contradicted claims, restatements, AI tells) go to
   **Rung 1 FIX-IN-PLACE first**, never straight to a regeneration — save that page's findings
   to `reports/mindmap-pass/<TODAY>/audit/<slug>.findings.txt` and run
   `python3 scripts/lib/content_gen.py fix --draft <draft> --findings <findings.txt> --facts <row prompt> --floor <floor> --allowed-urls <allowed-urls.txt>`,
   then re-template and re-audit that page in full on the same bar. **A re-audit that still
   finds claims or tells is another fix round (max 3 per page), not a failed attempt** — it
   never counts toward the 2-regeneration cap and never drops a page by itself (2026-10-08:
   both pages were dropped as "failed twice" after a single fix round). A **regeneration**
   (Rung 2) is only for what `fix` lists as NOT FIXABLE IN PLACE, a page under its floor, an
   auditor note that the floor can only be met by restating facts, or a page still failing
   after 3 fix rounds: first EXPAND the closed fact list with sourced facts (always when
   `meta.guards.fact_budget.thin`), then regenerate with a `# CORRECTIONS FROM THE PHASE 4
   AUDIT` block appended to the row prompt, and run the fix loop again on the new draft —
   never hand-write generated prose. After the second failed rework, stop this workflow and escalate; do not continue to commit, push or publish.

`git add` your work; do NOT commit (Phase 9 commits).

## Project specifics for this routine

Match the page template + schema builders Phase 0 discovered so new pages carry the same
scaffolding as existing pages. Tool rows → built per `phase-3c-tool-build.md`; other asset specs → `reports/mindmap-pass/specs/<slug>-spec.md`.
**The INTRO HUMANIZE step is SKIPPED for every page this phase generated** — they are exempt
per the content standard's INTRO HUMANIZE section (the generator carries its guards).

## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME
turn. Do NOT stop or print any question that waits for a human. The `/mindmap-pass` run has
EXACTLY ONE human stop (the Phase 0 manifest approval); this phase is not it. Phase 8 is an
informational summary that auto-continues to the Phase 9 push.
