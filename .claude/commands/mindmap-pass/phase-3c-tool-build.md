
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->

# Phase 3c — Build the tool rows (interactive tool / calculator / quiz-assessment)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Phase 3 routes every `create new content` row whose format is `interactive tool`, `calculator` or
`quiz/assessment` here. These are BUILT in this run — a working tool on a live route — not
specced for later. `git add` your work; do NOT commit. Phase 4 (tool checklist) is the gate.

Same rules as Phase 3: NET-NEW routes only (a row pointing at an existing route → STOP and flag it),
and page PROSE (intro, how-to, explanation, FAQ) comes from the API writer —
`scripts/lib/content_gen.py` per `_content-generation.md`, `.meta.json` committed beside it. The
tool's CODE (component, logic, labels, button text) is yours to write.

## 1. Find this repo's tool pattern
Every fleet site already ships tools. Find them before writing anything:
- the fleet usage tracker's roots: `grep -rn 'data-tool' src templates app 2>/dev/null`
- tool routes/registries: `src/pages/tools/`, `src/components/tools/`, `src/data/ia.ts`-style spoke
  registries (`kind:'noapi'`), Python page dicts / Jinja templates with an embedded widget

Pick the existing tool most like the new one (same hub/section, same kind — calculator vs
generator vs quiz). **Mirror its whole wiring exactly; never invent a new pattern:** registry/IA
entry, route/page file, component location and framework (React island, vanilla JS, Jinja
partial…), layout, schema/JSON-LD (e.g. `SoftwareApplication`), breadcrumbs, related-tools block,
FAQ shape, CTA, and the sitemap source the existing tool is listed in.

No interactive tool anywhere in the repo → build it as ONE self-contained client-side component
inside the site's standard page template (same framework as the rest of the site; vanilla JS for
static/Python sites), and say "first tool on this site" in the Phase 8 summary.

## 2. Decide the logic before the UI
From the row's `solution` (what the tool DOES: inputs → outputs / question flow) and the
reader_question, write down:
- inputs (fields, units, sensible defaults so it shows a result on first load, valid ranges)
- outputs (what the reader acts on, in their units and words)
- the formula / scoring / generation rules. **Every number is a named constant with a comment
  saying where it comes from** (official rate table, published method, stated assumption).

If no defensible logic exists — you would have to invent the math or the scoring — do NOT ship a
tool. Re-route the row to a normal article (Phase 3 `--schema guide`) on the same query and note
the switch in the chart row. Never ship invented math.

## 3. Build it
- **Client-side and deterministic.** No tool that calls a paid API (LLM, data vendor) per use, no
  new backend service. Reuse what the site already has.
- **The `data-tool="<slug>"` root** wraps the tool (the fleet usage tracker counts views/uses off
  it) — mirror exactly how the existing tool sets it (attribute on the root, or the layout's
  `tool` slot that adds it). Slug = the route's last segment.
- Accessible labels on every control; works at 390px wide; no console errors.
- **A way to keep the result** when the reader's job ends in a thing (print, copy, download,
  fullscreen for projecting) — whatever the mirrored tool offers, at minimum.
- **Printable output prints like a real worksheet.** If the result is meant to be printed, Print shows ONLY the
  output (no site header, page copy or controls), on a white page with margins, with a title, Name/Date lines
  where students fill it in, one line of directions, and rows spaced to fill the page. Use the repo's shared print
  component if it has one (e.g. Chalkbox `src/components/tools/PrintSheet.tsx`); otherwise mirror the existing
  tool's print CSS. Check it with a print-to-PDF before Phase 4.
- No new runtime dependency over ~30 KB gz (the bundle gate fails the build anyway).

## 4. Write the page around it
Generate the page prose with the API writer exactly as for an article row (same row prompt
template, same standards, same depth floor the repo uses for tool pages — else match the mirrored
tool page's depth). The prose explains how to use the tool, how it works (the logic + named
assumptions, one worked example with real numbers), when its answer is wrong for you, and the
FAQ — and must describe the tool you actually built (labels, steps and defaults match the code).
Place the tool where the mirrored tool sits (above the fold, before the long prose).

## 5. Wire it up and build
- Registry/IA entry, nav/hub listing and sitemap source exactly as the mirrored tool has them.
- Run the site's full build (Node 20 for Node sites). It must pass, including any bundle/depth/
  markup gates. Confirm the new route rendered in the build output.

Record each built tool's route in the chart row (`built: /route`). **Auto-continue to Phase 4.**

<!-- mindmap-execution-v1 -->
Follow `_mindmap-execution.md` for the approved manifest, relevant analysis/case selection and required flags on framing-prose writer calls. Build the actual useful asset; audit its complete rendered page, logic, inputs/outputs and exports.
<!-- /mindmap-execution-v1 -->
