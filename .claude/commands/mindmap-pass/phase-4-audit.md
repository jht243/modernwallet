<!-- fleet-audit-exhaustion-publish-v1 -->
**Fleet rule — publish when audits/reworks are exhausted (narrow direct-liability exception ONLY, 2026-11-13):** Across all Mindmap and non-Mindmap content routines on the fleet, once all allowed audits (`1` for `light`, `2` for `standard`, `2`/`3` for `high` in Mindmap; or max 2 Rung-2 reworks in non-Mindmap routines) are exhausted, **automatically publish the exact final audited version** (logging any remaining non-liability findings honestly in the run report) instead of blocking, stopping, reverting, dropping, marking `draft: true`, or asking the user how held pages should go out — and NEVER edit a Mindmap route after its final allowed audit completes. **The ONLY content exception that blocks publication at audit exhaustion is direct legal or physical-harm liability from publishing incorrect actionable information** (`liabilityBlock`: incorrect/fabricated medical dosing, prescription regimens or dangerous drug interactions/contraindications; acute physical/infant/electrical/chemical safety hazards; or defamatory illegal-conduct accusations, unlawful financial/tax directives, or fabricated clinical/lab testing or clinician sign-off — plus explicit `professionalReviewRequired: true`, explicit paid-client holds, or broken build/HTTP 404/500). **General medical/health pricing, clinic locations, addresses, hours, provider directories, scheduling/insurance logistics, general educational condition overviews, vendor comparisons, attribution wording, `scopeAndExclusions`, and SEO/style/tell findings NEVER block publication once audits are exhausted.**
<!-- /fleet-audit-exhaustion-publish-v1 -->

**Layer3Labs owner rule, November 9, 2026.** The opening release and continuation instructions in `.claude/commands/_content-review-policy.md` supersede older editorial PASS-only, hold-at-limit and repeated-wait wording for Mindmap and its callers.


<!-- fleet-author-defaults-v1 -->
**Author defaults — owner instruction, 2026-10-29:** Apply `_content-standard.md`, “Existing site author by default; missing person never holds publication,” ahead of older generic named-reviewer rules. Reuse this site's established default/category author automatically. If no person exists, use the existing publisher/editorial identity or omit an optional personal byline; a person can be added later. Do not ask for an author/professional assignment, block preparation or publication, or fabricate credentials/review dates. The independent Phase 4 reviewer is an automatic agent; internal `author`/`reviewer` actor IDs remain distinct and are separate from the public byline. Keep source, safety/exclusion, rendered-page and live-verification checks.
<!-- /fleet-author-defaults-v1 -->


<!-- mindmap-unattended-publication-v1 -->
**Unattended Mindmap authorization and recovery:** Apply `_mindmap-execution.md`, “Authorized unattended Mindmap: continue through publication,” before the default Phase 0/stop rules below. Explicitly authorized end-to-end routines record their existing authorization, save the complete independently reviewed chart and continue through publication without asking. Use the single shared per-page audit budget. Once all allowed audits are exhausted, automatically publish the exact final audited snapshot with non-liability FAIL findings preserved (never editing an exhausted route post-audit or asking how held pages should go out), isolating ONLY a narrow direct legal/physical-harm `liabilityBlock` (e.g. incorrect medical dosing; never general medical pricing, clinic locations, attribution phrasing, `scopeAndExclusions`, or SEO/style findings), explicit `professionalReviewRequired: true`, explicit client holds, or mechanical deployment failures. Manual runs retain their Phase 0 approval gate. A generated `ready-for-approval` chart is accepted after structural validation plus the separately recorded authorization; never rewrite it merely to change status.
<!-- /mindmap-unattended-publication-v1 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->

# Phase 4 — Confirm new content (dedicated adversarial review)

<!-- mindmap-visible-checks-v1 -->
**Approval chart: completed preparation only.** Follow `_workflow-checkpoints.md`, “Approval chart — completed preparation only.” Finish applicable instruction reading, primary-source research, duplicate review, testing/evidence decisions, and takeaway briefs BEFORE showing the chart. Show one **Preparation check** row: `✅ Passed` linking readiness evidence (or `❌ Failed` with specific failures blocking approval). Keep Phases 1–9 as future execution; never show pending cells. Unattended `*-auto` callers — AND manual `/mindmap-pass` runs on AI `modelLaunch` briefs (`docs/model-launch-page-family.md`, where the launch page family is deterministic) — build and independently review `preparationMode: "full"` (`## New-page briefs` + link inspections) upfront before Phase 0 so human approval goes straight to `WRITE` with zero post-Phase-0 double-review. General open-ended manual `/mindmap-pass` runs use `preparationMode: "fast-scope"` (`## Scope briefs` inline in saved and displayed charts) before the Phase 0 human gate, then expand `preparationMode: "full"` for approved rows right after approval before Phase 3 writing. Approval remains the sole human gate.
<!-- /mindmap-visible-checks-v1 -->


<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->

<!-- intent-takeaway-v1 -->
**Intent-based takeaway audit:** Read `_decision-evidence.md` in the active project's `.claude/commands/`, including its takeaway requirements and section 4. Verify the conclusion answers the approved question, matches actual evidence and retains important conditions; compare the opening answer, tables, calculator and FAQs. An existing sufficient verdict or a supported inconclusive answer can pass. Never require a canned heading or unsupported testing language. For global commands, resolve/install the sibling shared contract in the active project while preserving local rules.
<!-- /intent-takeaway-v1 -->


**Unified testing contract:** read `.claude/commands/_testing-labels.md`. Preserve this site's exclusions; distinguish eligibility from reviewed evidence; use the same decision for writer format, title, byline, methods, picks and testing-related schema. Missing or stale evidence cannot turn the TESTED format on.


<!-- decision-evidence-v1 -->
## Decision-evidence gate

**Layer3Labs reader-survey reuse:** Inspect the current run's durable catalog and route-facts receipt when checking source discovery. An empty `completedSurveys` list must not be described as no surveys on the site or zero demand. When a survey finding is used, inspect the exact intact final snapshot, private response-quality review, independent route approval, question/options/cohort, field dates, denominator and reproduced counts. Verify the final page's finding and takeaway stay within those self-reported observations, with visible source/sample/limitations. Any relevant route may use reviewed data; candidate routes are suggestions, not a reuse boundary. Reject provisional progress counts, synthetic votes, unreviewed snapshots, combined campaign versions, unsupported demographic/model/hardware inferences, causal claims or product-testing labels. Surveys may be combined with other supported sources and are never required on every page. Preserve no-addition, local exclusions and the existing automatic reviewer; no extra human gate.

**Layer3Labs comparison methods:** Apply the public-data and practical-comparison sections of `_layer3-evidence-sources.md` when the packet uses them. Inspect actual source snapshots, extracted facts and normalized terms for public comparisons; independently replay the calculation. For practical comparisons, inspect the predeclared task/expectations, identical inputs, real unedited outputs, option versions, conditions and all item/repetition scores. Check excluded/unavailable options were not treated as failures. Run the existing `mindmap-gates.py validate-analysis` structural check, then independently judge the finding's usefulness, fair scope, visible attribution and testing-label eligibility against the exact finished page. A helper PASS or a tiny task sample cannot establish general product superiority. Do not require a comparison on source-only, other-supported-method or no-addition work.

Read `.claude/commands/_decision-evidence.md`, section 4, and independently audit its evidence packet against the exact rendered contribution. This includes new substantive content/tools embedded in an existing page. Verify visible attribution states what we did, what we found and how readers can check it; naming published inputs alone is insufficient. Match explicit “internal testing,” “internal modeling” or “internal analysis” wording to the saved evidence, without requiring an exact phrase: calculations, hypothetical models, actual tests and documented client observations must remain distinct. Require reproducible findings, important conditions and a counterexample; reject fabricated testing and unsupported benefit assumptions. Audit an optional calculator as a planning aid when that is all it establishes. Verify the growth record exists, but never treat its hypothesis as proven uplift. Once all allowed audits are exhausted, automatically publish the exact final audited snapshot unless blocked by a narrow direct legal/physical-harm `liabilityBlock` (e.g. incorrect medical dosing; general medical pricing, locations, attribution wording, `scopeAndExclusions`, and SEO/style findings never block), and never edit an exhausted route post-audit.
<!-- /decision-evidence-v1 -->

This phase IS the gate for Phase 3. It checks net-new pages and substantive new content/tools embedded in existing pages. Pure metadata/link corrections retain their existing reviewer gates. Run as an Explore subagent that did NOT write those pages.

<!-- chart-obligation: p4-request-and-audit-gate -->
**Check the original request, Information Gain, and actual presentation before applying the checklist.** Read the request artifact, mapped requirements, approved action, and presentation decision; record `requestCoverage`, `presentationReview` and `caseUseReview` under `_mindmap-execution.md` (a pass for one page never closes other mapped actions). On **Round 1** for non-exempt commercial/comparison/roundup/pricing/how-to pages, verify **Information Gain & Top-Half Proof** (Paragraph-1 numeric hook, a 150–250w original scenario/probe/benchmark block + table + counterexample in Section 1–3—never counting generic `"At Layer3Labs, we..."` taglines—plus a non-summary Publisher's Take and matching site calculator link when available). **ZERO-BLOCKED-PAGES GUARANTEE:** If thin on Round 1, send back for **at most 1 targeted rework pass**; after that 1 edit pass (or at audit limit), **continue and publish 100% regardless of result** (never block or hold a page for Information Gain, proof depth, placement, or Publisher's Take).
<!-- /chart-obligation -->

For both new-page and existing-body rows, check the `format`, `resolved_deliverable` and `presentation`. If adjustable inputs would materially help the intended reader, inspect the justification for static delivery. Do not force a tool when a finite table or clear answer is sufficient. Review useful animation against actual behavior, reduced-motion support and a readable static result. Verify client use as context, implementation or outcome against its inspected support; lack of an exact vendor match does not rule out relevant workflow context. Never turn that context into unrecorded product use or modeled outcomes into client results.

Article rows and non-article rows have different review criteria:

**For BUILT tool rows (`interactive tool`, `calculator`, `quiz/assessment` — Phase 3c, MINDMAP-BUILDS-TOOLS), including tools embedded in existing articles:** audit the working tool AND its page. The page prose gets the full standard checklist below (it is a page). The tool gets this checklist on top — any ✗ is hard-fail rework:
- Logic: work 3 realistic inputs by hand; the tool's outputs match. Every number in the code is a named constant with a stated source/assumption ✓/✗
- Edge inputs (empty, zero, negative, huge, all-default) never crash or show NaN/undefined ✓/✗
- It answers the row's `reader_question` start to finish, and the result can be kept (print/copy/download/fullscreen) when the reader's job ends in a thing ✓/✗
- Mirrors the appropriate existing site pattern. New tool pages have registry/IA, layout, schema, related links and sitemap wiring. Embedded tools preserve the host route, page type and sitemap entry; do not require a duplicate URL or standalone tool-page schema. Verify inline integration and mark inapplicable new-route wiring N/A with the reason ✓/✗
- `data-tool="<slug>"` root present, slug = route's last segment ✓/✗
- Client-side and deterministic: no per-use paid API call, no new backend, no runtime dependency over ~30 KB gz ✓/✗
- Works at 390px and desktop width, labelled controls, no console errors; the site build passes and the route rendered ✓/✗
- Print-to-PDF (if the tool prints): only the output, white page, title + Name/Date + directions, not bunched at the top ✓/✗
- The page prose describes the tool that was built (labels, steps, defaults, worked example match the code) ✓/✗
Fix actual mechanical/functionality defects through the existing checks. Editorial corrections and independent verifications share the single configured audit budget; at an activated Mindmap limit publish the exact final audited candidate with FAIL findings retained. Do not allocate extra reworks or an editorial hold. Existing non-editorial mechanical, scope and professional safeguards remain.

**For other asset rows (`template`, `comparison table/database`, `glossary/reference`, `data report`, chart, image or download):** audit the completed real asset plus its complete rendered page under `_mindmap-execution.md`. Verify source-to-output consistency, useful reader purpose, actual fields/format, accessibility/mobile behavior, exports/links and applicable boundary cases. Generated illustrations are not test evidence. A spec, placeholder or deferred human-build handoff fails; a useful finite table is acceptable when that is the approved complete deliverable. Framing prose gets the normal content/evidence review. Preserve justified no-addition and local exclusions.

**For `article` format rows — and for `comparison table/database` rows that Phase 3 generated as REAL pages (`--schema comparison`, a `<slug>.json.meta.json` exists):** apply the standard checklist below. A generated comparison is a page, not a spec: audit its `comparisonTable`, `verdict`, and objectivity (the business is never the auto-winner).

**Hand the auditor the row's `reader_question`, `answer` and `answer_placement` (chart cols 10–12) with every page.** `_content-standard.md`'s `GATE — Reader question` is audited against them — without them the auditor has to guess what the page was supposed to answer, which is how a definitional opener passed three audit rounds on 2026-09-22. Include the evidence tag (`[PAA n/m …]` / `[verb-only …]`): a verb-only question is a weaker premise and the auditor should say so rather than fail the page for missing evidence it never had.

**API-generated pages (the normal case — see `_content-generation.md`):** hand the auditor the run's **closed fact list** (`reports/mindmap-pass/<TODAY>/prompts/<slug>.prompt.md`) and **`allowed-urls.txt`** alongside the drafts, plus each draft's `meta.guards.numbers_not_in_facts`. An auditor working from a trimmed fact set will flag TRUE sourced facts as fabrication — on 2026-09-05 it flagged Claude Opus 5's real Pro/Max pricing and Sonnet/Fable positioning, all confirmed on the site's own page. Before acting on any "unsupported claim" finding, verify it against the source; keep confirmed facts, cut only what no source supports. A finding is only actionable with the exact quoted text.

---

<!-- CRON_PROMPT_START -->
<!-- mindmap-visible-checks-cron-v1 -->
Show the approval chart only after all applicable preparation passes independent chart review under `_workflow-checkpoints.md`. Show one aggregate Preparation check row: Passed with linked evidence, or Failed with only the specific failures and approval blocked; keep the full checklist in the linked report. No incomplete status cells. Every new-page action requires its complete, matching actual per-page brief inline in BOTH saved and displayed approval charts under `_workflow-checkpoints.md`; missing briefs block presentation. Writing, content audit, internal-link changes and publication stay in the future execution plan until approved; never pre-certify their results.
<!-- /mindmap-visible-checks-cron-v1 -->

<!-- workflow-checkpoint-cron-v1 -->
**Required before executing this content phase:** Follow `.claude/commands/_workflow-checkpoints.md` in the active repository. Complete the phase-specific `workflow-preflight.py` chunk delivery and freshness check. Existing independent chart/Phase 4 audits must record rule-by-rule artifact evidence for local exclusions, provenance, visible attribution, intent takeaways, testing labels and applicable growth/visual checks. Follow `_rendered-page-audit.md`: finish central research before preparation Passed; independently audit the complete rendered decision path after template/affiliate/link changes; verify the exact reviewed render live using `rendered-audit.py` and close deployment/measurement records. A read-only reviewer may write internal receipts. A loader receipt or worker assertion is not a review PASS. Preserve the sole Phase 0 human gate.
<!-- /workflow-checkpoint-cron-v1 -->

Make sure all article pages meet metadata length requirements (title/description), follow FAQ JSON, schema.org, and have good internal linking.

**FAIL — orphaned first-person "we".** The FIRST first-person *company claim* on a page (what the business does, builds, runs, helps with, audits, charges for, or refuses to do) must name the business: `At {BUSINESS_NAME}, we…`. A bare "We build and run AI systems inside other people's businesses" in an intro leaves the reader with no antecedent. Set fail with note `orphan-we: [the sentence]`. The fix is a three-word prefix, never a rewrite. **Do not fire** when: the brand already appears earlier on the page or in the same breath just after; the "we" is authorial ("we cover", "we compared", "we ranked these on"); it is a later "we" on a page that already named the brand once; or it sits in `metaTitle`/`metaDescription`.

**FAIL — heading not in Title Case.** Every H1 and section heading (H2/H3) must use Title Case: the first letter of each major word is capitalized. If any heading has a major word starting lowercase — e.g. `"Who Spark fits, and who should look elsewhere"`, `"Spark pros and cons"` — set fail with note `heading-case: [the heading]`. The fix is a one-field capitalization (capitalize the major words; keep minor words a/an/the/and/or/nor/but/for/to/of/in/on/at/by/with/from/vs/via/per lowercase unless first or last; preserve acronyms and brand casing like AI, API, SEO, GPT-5, iOS exactly — never lowercase them). FAQ `question` fields are exempt (they are questions, keep sentence casing).


---

---

## ‼️ SELF-SERVING DISCLAIMER GATE — blocks the phase (MANDATORY — added 2026-08-21)

**Never write a sentence asserting our own neutrality, independence, or lack of a financial interest.** This is a hard fail, not a style note. Strip every instance before the page ships.

Banned constructions (non-exhaustive — judge by intent, not exact wording):
- "Layer3 Labs does not resell / resells none of / does not refer / does not partner with…"
- "We take no referral fee / no commission / no kickback from…"
- "This ranking is independent." / "A note on objectivity:" / "Layer3 Labs is vendor-neutral."
- "No paid placement" / "No sponsored placement" / "We don't take payment to be listed" / "Our rankings are editorial, not paid" — the site sells paid placements, so any claim it doesn't is false.
- "We run our own repositories on this stack, so this is written from the position of someone who has to live with the choice."
- Any variant that asks the reader to trust our motives rather than showing our reasoning.

**Why this is a hard fail, on two independent grounds:**

1. **It is frequently FALSE.** This repo auto-inserts `rel="sponsored"` affiliate links via the `ENTITY_LINKS` registry in `src/utils/sectionContent.tsx`. Any entity there with `sponsored: true` (Cursor, ElevenLabs, Murf, Apollo.io, Instantly.ai, Dext, Nutshell, Pinecone, Netlify, RunPod, Carepatron, Prezi, ZoomInfo — re-read the registry, it grows) earns us a referral fee **on that very page**. A page that autolinks Cursor and also says "we take no referral fee from Cursor" is publishing a false statement about a material financial relationship. On 2026-08-21 two such sentences shipped and had to be removed.
2. **It does not work even when true.** Objectivity is demonstrated by the analysis: naming who should NOT pick our preferred option, stating what would change the verdict, and citing what each vendor actually publishes. Asserting neutrality adds nothing a skeptical reader will credit, and reads as protesting too much.

**Auditor procedure — run this on every page in the phase:**
```bash
grep -inE "does not resell|do not resell|resells? none|takes? no (referral|commission|kickback)|no commission on|does not (refer|partner)|vendor.neutral|this (ranking|comparison|page) is independent|note on objectivity|we are not (paid|sponsored)|no financial (interest|stake)|no sponsored placement|not paid placements|(do not|don.t) (charge|take payment) to be (listed|included|ranked)" <the new/edited entries>
```
Any hit → **FAIL the page** and require removal. Delete the claim outright; do not soften it. Where the sentence also carried real methodology ("we weighed what each vendor publishes about X"), keep only the methodology half and drop the financial/neutrality assertion.

**What to do instead:** nothing. Say what the page found and why. If a genuine affiliate relationship exists, that is handled by the site's affiliate-disclosure mechanism, **not** by prose in the body — and never by a sentence claiming the relationship does not exist.

**Scope note:** this gate covers the pages THIS pass creates or edits. If the auditor notices the pattern on pre-existing pages, record it as an advisory finding for the human, do not mass-edit other pages inside this run.

---

**Remediation:** Use `_remediation-ladder.md` for mechanical and targeted correction methods, and `_content-review-policy.md` for the single total 1/2/3 independent-audit budget and release decision. These are not additional rework allowances. Keep actual PASS/FAIL judgments and reuse unchanged pages. At an activated Mindmap audit limit publish the exact final candidate with factual and cosmetic FAIL findings retained; do not stop, isolate it for editorial failure, regenerate, or buy another audit. Preserve existing non-editorial safeguards and the separate native client/upsell contracts.
<!-- CRON_PROMPT_END -->

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/mindmap-pass` run has EXACTLY ONE human stop (the Phase 0 manifest approval), and this phase is NOT it:
- Stop 1: the Phase 0 manifest approval (before any edits).
- (Phase 8 is an informational summary that auto-continues to the Phase 9 push — NOT a stop.)

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going through Phase 8 and the Phase 9 push without stopping.


## Updated-page date-bump rule (MANDATORY — workflow-wide, added 2026-07-12; link-only exemption aligned 2026-11-18)

**Editors (any step that substantively updates what an EXISTING page renders — Phase 2 metadata/title, Phase 5 body or enrich sections, FAQs, embedded tools, thin-content rework):** every substantively updated existing page MUST have its "last updated" date bumped to the run date **in the SAME change** — the content edit and the date bump ship together, never separately. Discover how THIS project surfaces the date (record it as a Phase 0 project fact) and bump the field the template ACTUALLY renders:
- **DB-backed pages** (e.g. ban_the_bots: `landing_pages.last_generated_at` renders both the visible "Last updated" byline and JSON-LD `dateModified`; `blog_posts.updated_at` for posts): any script/SQL that substantively edits content columns MUST also set the date column to now (e.g. `page.last_generated_at = datetime.utcnow()`). Never ship a substantive enrichment/edit script that touches content but not the date column.
- **File-backed pages**: bump the frontmatter/date field the template renders (`updatedDate`, `last_updated`, `updated`, `dateModified`, …) and re-render if the project pre-renders static HTML.

Also refresh every surface derived from that date: JSON-LD `dateModified`, and the sitemap `<lastmod>` when the generator does not derive it from the same field. **New pages created this run are exempt** (their date fields already default to now). **Phase 6 link-only touches (adding inbound internal links or fixing broken links without a Phase 2/5 substantive edit) AND purely non-rendering technical fixes (robots.txt, redirects, canonical tags, sitemap-only hygiene) are EXEMPT** — preserve each link-only page's existing `updatedDate`, JSON-LD `dateModified`, and sitemap `<lastmod>` (matching Phase 7 `<lastmod>` rules; never bump dates for link-only edits).

**Auditors / reviewer gates (adversarial review):** for EVERY substantively edited existing page (Phase 2 metadata / Phase 5 body or tool enrichment), verify the rendered "Last updated" date (and JSON-LD `dateModified`) now equals the run date — a stale date on a substantively updated page is a **HARD FAIL** (one-field fix; never rewrite the page). For **Phase 6 link-only routes** (inbound internal link additions with no Phase 2/5 substantive action), verify the page **preserves** its existing `updatedDate` / `dateModified` — NEVER fail `datesAndSchema` on a Phase 6 link-only route for keeping its prior `updatedDate`, and treat date churn on an unchanged or link-only page as a fail.


## Content standard — audit gates

**Load `.claude/commands/_content-standard.md` and apply its `## AUDITOR` section in full.** It is the single source of truth for the content gates: register and voice, tee-up, experience truth, required page elements, the proprietary anchor, neutrality, depth floors, first-mention links, and the medium record.

**Also load `.claude/commands/_experience.md`** — established company-experience claims must be traceable to it. Run-specific calculations, actual tests and client observations may instead cite the verified supporting records allowed by `_decision-evidence.md`; audit those records and the exact scope. A claim supported by neither source fails. Broad company experience or template eligibility alone cannot substantiate a page-specific product test.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its **AUDITOR** section in full. It outranks the content standard on any conflict.

If any of those three files is missing, **FAIL the run and report it** — never substitute your own gates. If `.claude/commands/_content-standard.local.md` exists in this repo, its sections override the same-named sections of the standard.

<!-- mindmap-execution-v1 -->
Apply `_mindmap-execution.md` inside this existing audit: independently judge usefulness and source/assumption limits, replay deterministic calculations where relevant, inspect real run records for measured work, and bind the analysis decision to the exact final rendered snapshot/review. Accept justified non-quantitative and no-addition branches; do not require new paid/physical testing merely to repeat a saved valid record.
<!-- /mindmap-execution-v1 -->
