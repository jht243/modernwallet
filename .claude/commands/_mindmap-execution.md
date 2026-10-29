# Executable Mindmap preparation, evidence and delivery

These are enforced substeps of the existing chart, Phase 3 and Phase 4. Keep the existing Phase 0 approval, local exclusions, schedules, model pins and publication permissions. No additional human gate. Global commands install this contract, `.claude/tools/mindmap-gates.py`, its tests and `_approved-cases.json` in the active repository alongside the checkpoint/rendered-audit dependencies. Never replace a site's `_experience.md` or testing permission with Layer3's.

## 1. Produce the actual approval chart from a reviewed manifest

Use `<RUN>/approval-manifest.json` with `schemaVersion: 1`, `author`, actual local `date` (`YYYY-MM-DD`), `source`, `interpretedBrief`, `chartPath` (the actual `<CHART>` path), and:

- `actions`: the full original action rows. Every row contains `id`, `problem`, `solution`, `bucket`, `target`, `format`, `best_medium`, `resolved_deliverable`, `serp_verdict`, `serp_evidence`, `reader_question`, `answer`, `answer_placement`. Buckets are `consolidation advisory`, `update existing metadata`, `create new content`, `update existing body text`, `add internal links`. Keep consolidation advisory only.
- `newPageBriefs`: exactly one per new-content action, matching `actionId` and exact `target`. Required fields: `identity`, `readerAndAnswer`, `keywordEvidence`, `serpAndQuestions`, `whyNewPage`, `outline`, `contributionAndEvidence`, `tablesToolsVisuals`, `testingAndReview`, `takeaway`, `inboundLinks`, `outboundLinks`, `technicalAndMeasurement`, plus `evidenceFiles`.
- `identity` contains the working `title`, `pageType`, `format`, `medium` and any planned metadata in scope. Its format must equal the action format and its medium must equal the resolved deliverable. `readerAndAnswer` contains `question`, `answer`, `placement`, copied exactly from the corresponding action fields (including question-evidence tags), plus the audience/intent detail. `outline` is a nonempty array of specific headings and purposes. Other briefs retain all the actual detail required by `_workflow-checkpoints.md`; filling generic strings does not pass independent review.
- `inboundLinks` contains `required` (this site's real required count, at least one) and `placements`; `outboundLinks` contains `placements`. Each placement has exact local `source`, `target`, `section`, `anchor`, `purpose` and `inspection` artifact. Preserve stricter site coverage. An honestly empty outbound plan needs `notApplicableReason`. Link inspections happen before approval.
- `preparation`: `{status: "PASS", readiness: {path, sha256}}`, pointing to the completed detailed readiness report. `evidenceFiles` lists the inspected source/research artifacts. Every artifact reference is `{path, sha256}`, relative to the active repository, with the current actual file hash. Per-page references may reuse the same inspected source.
- `emergingClusters`, `exclusions` and `executionPlan`: retain the original clusters, exceptions and all Phases 1–9. Each execution entry is `{phase: 1..9, action: <specific future action>}`. These are planned actions, never claimed completed work.
- `publicationScope`: explicit booleans `commit`, `push`, `liveVerification`, `indexNow`, matching the actual authorization being requested or the existing authorized local-only scope. Do not broaden it.

The existing independent chart reviewer checks the complete manifest, source research, local rules, coverage, evidence and every brief. It writes `<RUN>/chart-review.json`: `reviewer` distinct from `author`, `verdict: "PASS"`, canonical `manifestSha256`, actual file `readinessSha256`, and concrete `evidence` describing its review. Use `mindmap-gates.py hash --file <file>` to calculate hashes. A hash or helper return is not independent judgment. Never fabricate a review or populate PASS defaults.

```bash
python3 .claude/tools/mindmap-gates.py render-chart --manifest <RUN>/approval-manifest.json --review <RUN>/chart-review.json --out <CHART>
python3 .claude/tools/mindmap-gates.py validate-chart --manifest <RUN>/approval-manifest.json --review <RUN>/chart-review.json
```

Present the complete generated chart, including every actual brief and link placement, unchanged. If long, show it in complete bounded parts before the sole approval question. The renderer provides exactly one preparation summary row. A failed command means a blocked readiness report with specific failures, never an approval-ready chart. Do not hand-render a shortened substitute. Revalidate imported/old Markdown charts by reconstructing their actual supported manifest; do not grandfather missing briefs or invent missing research. Changed sources, readiness or scope invalidate the affected review. No-addition charts may have empty action/brief arrays with their real explanation and do not request pointless content approval. Automatic revalidation of an already-approved unchanged scope adds no human gate. Preserve the original 12 action-column positions, appended row IDs, date frontmatter and `## Emerging search patterns (clusters)` heading. Non-content rows retain explicit N/A fields and exact file-or-route targets; body rows retain N/A format/medium fields but still require actual reader intent and an exact route. The writer also checks that the actual saved chart exactly matches the complete deterministic rendering.

## 2. Execute relevant analysis before the writer

Choose the method that improves the actual reader decision. Run accessible calculations/modeling when meaningful; records are outputs of the run, not a demand that the owner supply a historical test log. A useful model starts from supported public facts, explicit assumptions and a decision-changing condition. Estimates need defensible inputs/ranges. Never derive actual product accuracy, operating success or customer savings from unrelated public benchmarks.

Do not force calculations. For a combat drone with undisclosed price/performance, for example, use verified public facts, useful comparisons, unknowns and the limits of any defensible estimate. If there is no defensible estimate, explain that in the internal record and narrow the answer. News, definitions, qualitative comparisons and already sufficient pages may require no numerical work. Preserve medical/psychedelic/professional exclusions and required human professional review. A source-based or inconclusive answer can pass; arbitrary arithmetic cannot create value. The existing no-addition branch remains terminal and skips writing, tool building and numerical/growth work unless another real experiment needs them.

Before assembling closed facts, retrieve the relevant approved client/fleet records:

```bash
python3 .claude/tools/mindmap-gates.py cases --query "<actual reader question>" --publisher <active-site-domain> --out <RUN>/evidence/<slug>/cases.json
```

This reads the active site's full `_experience.md` plus the shared approved bank, preserving source IDs, exact quotes, ownership and attribution limits. It does not grant another site Layer3's history or testing permission. Record selected/rejected matches and why; never force a client mention. Additional accessible approved records can be added with their source, precise public-use scope and supported facts; a client list alone does not establish outcomes. Keep private records private. Update the shared bank through the existing reviewed sync when approved source facts change. For Layer3, also run the existing durable reader-survey catalog/facts lookup every Phase 3 run. No completed survey is not zero demand; do not simulate respondents or require waiting for a new survey.

Extend the existing `evidence/<slug>/evidence.json` with `gateSchemaVersion: 1`, `author`, `route`, `readerQuestion`, `decisionGap`, actual `finding`, `conditions`, `whatWouldChange`, `basis`, `sourceArtifacts` (artifact references alongside the existing source URLs/check dates), `caseSelection` (the retrieval artifact reference) and `caseDecisions` (actual selections/rejections and reasons).

- `basis: calculated|modeled`: include `method`, `units`, `limitations`, `counterexample`, and `execution: {command: [actual executable and arguments], code: {path, sha256}, inputs: [{path, sha256}], output: {path, sha256}}`. Execute the reviewed code, save machine-readable JSON results and retain all sourced inputs/assumptions. Fixed seeds are required where relevant. Do not merely copy arithmetic into a report and claim a saved executable run.
- `basis: measured`: include method, units, limitations, counterexample and actual `runs: [{testedAt, scope, artifact: {path, sha256}}]`. Existing relevant verified owner/product records are reusable. Physical or stochastic product tests do not need identical fresh API responses. Preserve the separate testing-label adapter's exact full-coverage/approval requirements.
- `basis: reported|client-record`: retain `whyNoQuantitativeAnalysis` and the actual `reasoning` from sources to conclusion. A useful non-numerical synthesis or relevant documented case can pass. Do not imply an executed product test.

The packet reader question must match the manifest exactly. Keep the existing source URLs, provenance, takeaway, survey and applicable growth fields. These gate fields extend the current packet; they do not create a second evidence system. If the page needs a claim the sources cannot support, narrow/exclude it rather than manufacturing numbers.

Mindmap `content_gen.py write`, `section` and `fix` calls require:

```text
--mindmap-manifest <RUN>/approval-manifest.json --mindmap-review <RUN>/chart-review.json --analysis-packet <RUN>/evidence/<slug>/evidence.json
```

The shared writer checks these before spending a call when caller/path identifies Mindmap. Do not relocate prompts or change caller names to bypass it. The target must match the manifest and packet. This verifies preparation/evidence structure, not Phase 0 human approval or a final content PASS; the existing permissions and independent review remain mandatory.

## 3. Existing Phase 4 verifies usefulness, reproducibility and the render

First judge whether the finding resolves the approved reader decision beyond a rewrite of sources. Reject trivial arithmetic used as an originality claim, unsupported assumptions, missing material conditions, or an asset that adds no value. Accept relevant non-numerical reasoning and justified no-addition decisions.

For calculations/modeling, inspect code and inputs, independently rerun the safe deterministic calculation, and save fresh JSON output to a distinct reviewer artifact (never the original output or an alias). Compare its results, units, boundary cases and counterexample to the exact article. Do not execute unreviewed code or spend on unnecessary repeat product/API runs. For measured work, inspect actual raw task records and independently verify the scoring/claims; do not demand identical stochastic outputs. For source-only/client work, verify the reasoning and exact approved public scope.

Perform the existing complete rendered-page audit after all content, asset, template, affiliate and link transformations. Save the normal rendered snapshot and independent rendered review. In the analysis review JSON retain `reviewer`, `verdict: "PASS"`, canonical `packetSha256`, and `{status: "PASS", evidence: <concrete observation>}` for `usefulness`, `sourceAndAssumptions`, `conditionsAndCounterexample`, `renderedConsistency`, `localExclusions`. Include file-hashed `renderedSnapshot` and `renderedReview` references from that same reviewer. Quantitative replays also include canonical `replaySha256`.

```bash
python3 .claude/tools/mindmap-gates.py audit-analysis --packet <RUN>/evidence/<slug>/evidence.json --review <RUN>/audit/<slug>-analysis.json --replay-output <RUN>/audit/<slug>-replay.json
```

Omit `--replay-output` for measured/source/client work without a deterministic calculation. Independently check any numerical derived claims separately. This gate supplements the existing `rendered-audit.py check/compare` and does not replace them. Missing evidence is a failure; changed outputs invalidate affected approvals. Keep the existing rework limit and publication/live-verification process.

The terminal no-addition branch needs no new rendered capture, product run, asset, numerical packet or growth registration. Its existing evidence-backed independent chart decision suffices. If explicitly checking a saved no-addition note with this helper, use `basis: no-addition`, `author`, `route`, `readerQuestion`, `whyNoAddition`, `existingAnswer: {path, sha256}` and an independent `noAddition: {status: PASS, evidence}` decision bound to that note; the helper returns before render/replay requirements.

## 4. Finish the selected useful asset in the approved run

Use prose, a finite table, SVG, a genuine screenshot, an image/illustration, downloadable data or an interactive tool when that format improves the answer and available capabilities support it. Reuse components. Generated illustrations never prove product use. Build and audit the actual asset and its page within Phase 3/4; no placeholder, spec-only completion or future-human-build branch. Determine feasibility before the chart; narrow or exclude an infeasible asset while retaining a supported useful answer. Do not force an asset or add another URL for existing intent. Videos remain outside this Mindmap evidence workflow.
