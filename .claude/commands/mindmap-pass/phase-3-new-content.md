
<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
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

**Layer3Labs local source addition:** Read and apply `.claude/commands/_layer3-evidence-sources.md` before producing the data/analysis and assembling prompts. The existing `mindmap-gates.py cases` lookup now searches the expanded anonymized client/fleet/app catalog for this publisher. It is one optional evidence source: combine as many relevant sources as needed, including internal modeling, genuine internal survey data, primary sources and actual tasks. Do not restrict the page to the inventory, treat a match as sufficient research, force a case or require every source type. Record selected sources and their separate evidence bases in the existing packet; preserve no-addition and the independent Phase 4 review. Client identities and searchable testimonial text remain private.

**Automated Live Product & Pricing Benchmark Step (Comparison, Roundup & Alternatives tracks):** Before `prepare-write-packets` on any commercial Comparison, Roundup, or Alternatives row, run `python3 .claude/tools/mindmap-benchmark.py run --manifest <RUN>/approval-manifest.json [--spec-file <RUN>/benchmark-specs.json]` (also invoked automatically by `mindmap-gates.py prepare-write-packets` when `evidence.json` is absent). This zero-LLM-token helper concurrently snapshots live vendor pricing/cap URLs, resolves verified API token & plan rates from `data/pricing.ts` / `data/gear-prices.json`, matches `_layer3-experience-catalog.json`, executes hands-on `practical` tasks (`basis: "measured"`) ONLY when all ranked options have live runnable targets on a tested-eligible route, and uses deterministic 3-scenario cost/break-even modeling (`basis: "modeled"` / `"calculated"`) everywhere else — reserving `"Tested 2026"` strictly for genuinely executed tests.

**Layer3Labs options 2 and 3 — execute useful comparisons:** Apply that local policy's “Option 2” public-information comparison and “Option 3” practical-task comparison steps. Automatically choose either/both when they improve the approved answer: collect and verify accessible public facts, normalize comparable conditions and run our calculation; or predefine a task/expected result, execute accessible options with identical inputs and save actual outputs/scoring. APIs are optional. Save plans and records in the current page evidence directory, attach their optional `comparisons` entries to the existing packet, then run `python3 .claude/tools/mindmap-gates.py validate-analysis --packet <RUN>/evidence/<slug>/evidence.json` before the writer. Continue with another useful source when collection/access/scoring is unreliable. Missing optional comparisons create no additional gate, quota or owner task. Existing publication permissions, testing-label exclusions and independent Phase 4 still apply.

Read and apply `.claude/commands/_decision-evidence.md` inside this phase, before assembling the writer prompt. Reuse the approved reader question, produce the strongest feasible evidence and counterexample, then select the presentation. Calculators remain an option, not a quota. Give the writer the evidence packet, including the supported provenance and its visible placement, with its closed facts; ask for explicit, natural phrasing at the relevant finding: “In our internal analysis/modeling/testing, we [specific action]…” matched to the evidence, followed by what we found and how readers can check the method or inputs. Merely naming the source of inputs is insufficient; preserve the existing API-writing, review and permission rules. Evidence labels take precedence over automatic TESTED-format eligibility: simulated/calculated data never licenses a firsthand-testing claim.
<!-- /decision-evidence-v1 -->

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->

<!-- chart-obligation: p3-net-new-and-deliverables -->
> **‼️ THE RUNNING AGENT DOES NOT WRITE THE ARTICLE.** Page prose (and substantive enrichments >1 sentence) is generated by the
> configured model through `scripts/lib/content_gen.py` per `.claude/commands/_content-generation.md`, using a closed verified fact list and allowed URL list, with `.meta.json` committed beside it (writer probes run only at actual writing steps, never on empty intakes).
> **Full-page creation is NET-NEW ONLY:** never overwrite, regenerate or replace an existing page as a new route (`create new content` pointing at an existing route → STOP and reclassify). Interactive tools/calculators/quizzes route to Phase 3c working builds; templates/glossaries/data reports/charts/downloads must be real built assets, never specs or stubs. On Layer3, check the durable reader-survey catalog/facts and apply `_layer3-evidence-sources.md` (anonymized client catalog + options 2/3 comparisons where useful; never publish client identities).
<!-- /chart-obligation -->

> **‼️ THE RUNNING AGENT DOES NOT WRITE THE ARTICLE.** Page prose is generated by the
> configured model through `scripts/lib/content_gen.py` per
> `.claude/commands/_content-generation.md` (the canonical contract — read it in full before
> this phase). You assemble the prompts, run the generator, verify the draft mechanically, and
> hand it to the Phase 4 audit. Writing a page yourself, or substituting a model silently, is a
> hard failure of this phase. If the generator cannot run, STOP and report.

Act on every **new-content** row in the chart. The row's `format` column routes it:

- **`article` / no format** → generate with `--schema guide`.
- **`comparison table/database` whose target is a real comparison page type** (in this repo:
  `data/comparisons-new.ts` — `{a}-vs-{b}`, `{x}-alternatives`) → generate with
  `--schema comparison`. These are real pages, not specs.
- **`interactive tool`, `calculator`, `quiz/assessment`** → BUILT in this run, for real: follow
  `.claude/commands/mindmap-pass/phase-3c-tool-build.md` (mirror this repo's existing tool wiring,
  defensible logic, `data-tool` root, page prose from the API writer). A working tool on a live
  route — never a spec, never a stub. (MINDMAP-BUILDS-TOOLS)
- **`template`, `glossary/reference`, `data report`, chart, image or download** → produce the actual useful asset and its page in this approved run. Reuse the site's mechanisms; generate framing prose through the configured writer. Follow `_mindmap-execution.md`; a spec or placeholder cannot count as delivery. Assess feasibility before approval and narrow/exclude unsupported formats. Phase 4 reviews the actual asset and complete page.

> **Full-page creation is NET-NEW ONLY.** Never overwrite, regenerate or replace an existing page as a new route. A `create new content` row pointing at an existing route → STOP and correct its classification. Substantive `update existing body text` rows reuse Phase 3's preparation and the writer's section mode, build approved embedded tools through Phase 3c, then integrate through Phase 5. This shared preparation does not authorize replacing the whole article.

Carry the original request, action mapping and approved `presentation` through the evidence packet under `_mindmap-execution.md`. Confirm the medium against completed findings before writing; any material change must be reflected in the plan and its existing independent review within the authorized scope. Build/reuse actual interactive code before asking the writer for framing prose, bind its implementation artifacts and keep a readable static answer. The preview viewer's tabs or animations cannot stand in for an article tool. For Layer3 case selection, use contextual workflow queries where relevant and distinguish context, documented implementation and measured outcomes as specified in `_layer3-evidence-sources.md`.

## Step 0 — load the standards (sanctioned loader) and preflight the generator

```bash
bash .claude/tools/load-standards.sh "mindmap-pass" "phase-3"     # prints the three standards + writes the ledger
python3 scripts/lib/content_gen.py preflight                       # every model in the chain must answer
```
`git add reports/standards-ledger.jsonl`. A failing preflight STOPS the phase — do not write
the pages by hand instead.

## Step 1 — assemble the prompts (order per `_content-generation.md`)

Write everything under `reports/mindmap-pass/<TODAY>/prompts/`:

For Layer3Labs, include `_layer3-evidence-sources.md` in the writer's system instructions after the existing experience/standards context so the anonymous-client rule supersedes older named examples. Per-page facts include only verified selected findings from all relevant sources, with the public anonymous descriptor and each finding's basis/limits. Do not provide the full catalog or private identity mapping as publishable facts.

- **`system.md`, once per run** — (1) a real published page of the SAME page type from this
  repo as a JSON object, labelled *imitate this* (for a model-launch family, the predecessor's
  sibling page is ideal; never the page being written); (2) the output contract for that shape
  (`guide` or `comparison` keys, noun-phrase headings, ≤1 heading opening with the keyword,
  `ctaButton` = the project's CTA text, first company-"we" = "At Layer3Labs, we…");
  (2a) when writing `metaTitle`, `h1`, `subtitle` and `metaDescription`, take the row's
  `reader question` into account — these are what the person who typed that question sees in
  the results and on arrival, so their wording is a useful guide to what will read as the
  answer. Lean toward the words that person would use over the words the vendor uses for
  itself; a term the product coined for itself usually lands better in the body, where you
  define it, than in the headline.
  (3) `_anti-ai-language.md` WRITER section (wins on conflict); (4) `_experience.md` in full;
  (5) `_content-standard.local.md` if present; (6) `_content-standard.md` LAST, scoped to
  structure/SEO/depth — "follow its rules, do not copy its tone".
  Build a second `system.md` per page type if the run has both guides and comparisons.
- **`<slug>.prompt.md`, one per row, DATA ONLY** — route/slug/type/depth floor, keywords +
  intent from the chart row, **the chart's cols 10–12 copied verbatim — `reader question: "…"`, `answer: …` (with its
  shape), `answer placement: section 1|2 "<heading>"` — decided in build-brief Step 4.6, never
  re-derived here; the writer is told the answering section goes in that slot, before any
  scope/definition material (`_content-standard.md` INTENT; Phase 4 fails `intent-answered-late`)**, the chart's SERP evidence and real PAA questions as the FAQ spec,
  **the CLOSED FACT LIST** (with the "anything not on this list, you do not know" sentence and
  any leak warnings, e.g. a predecessor's prices), **the CLOSED URL LIST**, the real internal
  routes it may link (siblings shipping in this run are fine), section-by-section coverage,
  and for comparisons `optionAName`/`optionBName` + table dimensions + the objectivity rule.
- **`allowed-urls.txt`** — one allowed external URL prefix per line (the mechanical guard).

## Step 2 — generate in parallel across the sub-batch (never run `content_gen.py fix` before Phase 4 audit)

```bash
python3 scripts/lib/content_gen.py write \
  --system reports/mindmap-pass/<TODAY>/prompts/system.md \
  --prompt reports/mindmap-pass/<TODAY>/prompts/<slug>.prompt.md \
  --out    reports/mindmap-pass/<TODAY>/drafts/<slug>.json \
  --slug   <slug> --floor <floor> --schema guide|comparison \
  --allowed-urls reports/mindmap-pass/<TODAY>/prompts/allowed-urls.txt \
  --facts  reports/mindmap-pass/<TODAY>/prompts/<slug>.prompt.md \
  --mindmap-manifest <RUN>/approval-manifest.json --mindmap-review <RUN>/chart-review.json \
  --analysis-packet <RUN>/evidence/<slug>/evidence.json
```
Issue the `content_gen.py write` calls for the active sub-batch's pages as **parallel foreground `Bash` tool calls in a single turn** (`timeout: 600000`). The generator applies the remediation ladder to the returned
draft rather than rejecting it: it **repairs in place** (fence, slug, a missing `relatedLinks`,
an off-list link stripped with the sentence kept, house style) and logs each repair in
`meta.guards.repairs`; it **flags** for the Phase 4 auditor (`meta.guards.flags`) a missing content
field, a stripped citation, a page under the depth floor, and untraceable numbers; it
**regenerates only** a truncated page (after one retry at double the cap) or unparseable
output (raw saved). **`meta.guards.flags` are advisory notes for the Phase 4 auditor — NEVER run `content_gen.py fix` during Phase 3 (`WRITE`) before Phase 4 `AUDIT` has run!**
**`git add` every `<slug>.json.meta.json`** — it is the provenance record (model actually
used, fallback fired or not, tokens incl. thinking, est. cost).

## Step 3 — verify → template → lint → Phase 4

1. **Topic-residue grep** across each draft for sibling topics that could have leaked from
   the voice sample or other rows. Read the draft; reject on any claim outside the fact list.
2. **Template**: `relatedLinks` (3 real siblings, `{title, description, href, category}`),
   `publishedDate`/`updatedDate`, `inlineCta.buttonHref` = `"/ai-workflow-audit"` (never
   another URL). Insert as an `_entries.push({...});` block immediately before
   `export const newGuides` / `export const newComparisons` — the repo's append pattern.
3. **Mechanical lint (Rung 0)** on every templated slug, fix until 0:
   `npx tsx scripts/content_lint.mts --slug <slug> [...]`
4. **Phase 4 audit is the gate** — hand the auditor the closed fact list AND the allowed URL
   list with the drafts, so a real sourced fact is not flagged as fabrication. Verify any
   "unsupported claim" finding against the source before acting on it. Fixes follow
   `_remediation-ladder.md`, **per page**: Rung-0 mechanical edits in place. Claim and tell
   findings (unsupported / inferred / contradicted claims, restatements, AI tells) go to
   **Rung 1 FIX-IN-PLACE first**, never straight to a regeneration — save that page's findings
   to `reports/mindmap-pass/<TODAY>/audit/<slug>.findings.txt` and run
   `python3 scripts/lib/content_gen.py fix --draft <draft> --findings <findings.txt> --facts <row prompt> --floor <floor> --allowed-urls <allowed-urls.txt> --mindmap-manifest <RUN>/approval-manifest.json --mindmap-review <RUN>/chart-review.json --analysis-packet <RUN>/evidence/<slug>/evidence.json`,
   then re-template and re-audit that page in full on the same bar. **A re-audit that still
   finds claims or tells is another fix round (max 3 per page), not a failed attempt** — it
   never counts toward the 2-regeneration cap and never drops a page by itself (2026-10-08:
   both pages were dropped as "failed twice" after a single fix round). A **regeneration**
   (Rung 2) is only for what `fix` lists as NOT FIXABLE IN PLACE, a page under its floor, an
   auditor note that the floor can only be met by restating facts, or a page still failing
   after 3 fix rounds: first EXPAND the closed fact list with sourced facts (always when
   `meta.guards.fact_budget.thin`), then regenerate with a `# CORRECTIONS FROM THE PHASE 4
   AUDIT` block appended to the row prompt, and run the fix loop again on the new draft —
   never hand-write generated prose. Once all allowed audits are exhausted (`roundsRemaining: 0`), NEVER edit or regenerate that route again — automatically publish the exact final audited snapshot unless blocked by a narrow direct legal/physical-harm `liabilityBlock` (e.g. incorrect medical dosing; general medical pricing, locations, attribution wording, and SEO/style findings never block).

`git add` your work; do NOT commit (Phase 9 commits).

## Project specifics for this routine

Match the discovered page template + schema builders so new pages carry the same JsonLd/SEO
scaffolding. Tool rows → built per `phase-3c-tool-build.md`; other asset rows → complete real assets under `_mindmap-execution.md`. **Phase 7b (intro
humanize) is SKIPPED for every page this phase generated** — they are exempt per the content
standard's INTRO HUMANIZE section.

## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME
turn. Do NOT stop or print any question that waits for a human. The `/mindmap-pass` run has
EXACTLY ONE human stop (the Phase 0 manifest approval); this phase is not it. Phase 8 is an
informational summary that auto-continues to the Phase 9 push.

## Monetization check (layer3labs only)

> <!-- monetization-check-v3 -->
> **‼️ MONETIZATION CHECK — run on every page you create or materially expand here (no-op unless the affiliate engine is installed).** Skip this entire check unless BOTH `src/utils/affiliateInject.ts` and `data/affiliate/catalog.ts` exist in this repo — they exist only where the inline-affiliate engine is installed (layer3labs); absent → do nothing, never create them. Where it IS installed, a fit page that ships un-monetized is a defect — but a section forced onto a page it does not naturally fit is an EQUAL defect. The affiliate section, its `sponsored nofollow` rels, the FTC disclosure, and the "Last updated" bump are ALL automatic — your ONLY action is adding ONE line to the `AFFILIATE_INJECTIONS` map in `src/utils/affiliateInject.ts` (a normal repo file; editing it is allowed — it is APPEND-only and never rewrites body prose). Dedup: skip if the slug is already in the map or the page already carries an affiliate / `sponsored` link — never double-monetize.
> **Natural fit is the gate — never force it.** Add a section ONLY where it genuinely serves THIS article's reader and topic. If a "what you need to run / use this" block would read as bolted-on, off-topic, or salesy for the page's real intent, SKIP it and log no-fit — a relevant omission beats a forced link every time; reader trust and editorial fit outrank a marginal referral.
> **Where the affiliate links come from — you NEVER type or invent one.** Every destination is centralized in code: the catalog `data/affiliate/catalog.ts` holds the products/tiers per profile, and the real referral codes live in `src/utils/affiliate.ts` — `amazonSearchLink()` appends the Amazon tag (`AMAZON_AFFILIATE_TAG`), plus first-party `CURSOR_ / RUNPOD_ / APOLLO_ / PINECONE_ / MURF_ / NUTSHELL_ / ELEVENLABS_ / …_REFERRAL_URL` constants. Common tools (Cursor, Apollo, Pinecone, Murf, Nutshell, …) are ALSO auto-linked from their plain name by `ENTITY_LINKS` in `src/utils/sectionContent.tsx`. So for hardware/how-to-use you only point a slug at a `profileKey`/`kind` and the catalog supplies the links; for a referral tool you just write its plain name. If a genuinely-fit product/tool is NOT wired: if `src/utils/affiliate.ts` already exports a constant for it, add a catalog entry using that constant; otherwise link its official site as PLAIN text and flag it as an affiliate-program candidate in your summary — NEVER fabricate a referral code (the catalog is the only source).
> Classify the page (only after it clears the natural-fit gate above):
> - **Open-weights model with a stated size** (weights downloadable; parameter / MoE count given on the page) → hardware entry `'<slug>': { modelName: '<Model>', profileKey: '<key>' }`. Pick `profileKey` from the size the PAGE states (never guess): `small-local` (≤~14B), `mid-large` (~15–150B), `frontier-moe` (>~150B / large MoE), or `general-spectrum` for a multi-model "best open-weights to run" page (skip general-spectrum if the page already has a "what runs where" section). Closed models (GPT, Claude, Gemini, Grok) are NEVER hardware-eligible; a model page with no stated size → skip.
> - **Closed / hosted model, model-vs-model comparison, or coding roundup** → how-to-use entry. Guide: `'<slug>': { kind: 'how-to-use', subject: '<model or "these models">', models: [{ name, vendor }] }`. Comparison (keyed by the comparison slug): `'<slug>': { kind: 'how-to-use' }` — the two models auto-derive from `optionAName` / `optionBName`. Fit: the reader must plausibly use the model through an AI IDE/tool (dev / coding / general-model audience).
> - **Non-model page that prominently uses a tool with a referral program** → no map entry; just write the tool's plain name and render auto-links it to its referral URL when it is in `ENTITY_LINKS` / `src/utils/affiliate.ts`. Never hand-write the URL; if the tool has no wired referral, link its official site plainly.
> - **`/{model}-for-{industry}` vertical page** → AUTO-covered at build; do NOTHING (already monetized).
> - **Genuine non-fit** — a pure conversion / nav / pricing page, a conceptual / definitional / news / opinion / policy-or-compliance piece with no real "run it or use it" need, or an image / video / robotics model with no product or tool to recommend → log "no monetization fit" and move on. When a page IS genuinely about running/using a model or tool and you are only unsure of the classification (hardware vs how-to-use), lean to adding the how-to-use section; but if you are unsure whether an affiliate section belongs on the page AT ALL, that is a no-fit — do not force it.
>
> `git add src/utils/affiliateInject.ts` explicitly. Before hand-off confirm the model is genuinely open-weights, the `profileKey` matches the size the page states, and (post-build) the live section carries `rel="sponsored nofollow"` + the bottom disclosure — any miss → remove the entry before push. The routine's existing build gate + 200-verify catch a broken injection.
> **Engine reference (layer3labs only):** catalog + profiles `data/affiliate/catalog.ts`; referral codes/constants `src/utils/affiliate.ts`; section builder `src/utils/affiliateSection.ts`; injection map + guardrails `src/utils/affiliateInject.ts`; detector `pageHasAffiliateLinks` in `src/utils/affiliate.ts`; auto-link registry `ENTITY_LINKS` in `src/utils/sectionContent.tsx`. Full design: memory `inline-affiliate-section-engine`.

<!-- reader-survey-evidence-v1 -->
## Required internal survey evidence check — before assembling closed facts

For Layer3Labs, read the durable internal reader-survey log on **every Phase 3 run**, including existing-page enrichments. Do not rely solely on a checked-in registry: recently completed surveys may not have been exported yet.

Use inherited environment variables on cloud/hosted runs. For local runs only, add `--env-file=.env` and/or `--env-file=.env.local` before `--import` when those files exist; never require missing local files.

```bash
node --import tsx scripts/reader-surveys/research.mts catalog --out <RUN>/evidence/<slug>/survey-catalog.json
node --import tsx scripts/reader-surveys/research.mts facts --route /guides/ACTUAL-TARGET-SLUG
```

Use the actual target route in the second command, including non-guide routes such as `/ai-model-pricing`. Save the output of `facts` in the same page evidence directory. Read both catalog fields: `campaigns` discovers configured and historical surveys, their questions/source routes, collection progress and version mismatches; `completedSurveys` contains only intact final snapshots eligible for independent review. A collecting or not-recorded campaign is discovery context, never a finding, and its progress count must not enter the writer's facts. A closed campaign without an intact result requires investigation, not a substitute result.

Consider all discovered survey topics against the approved reader question, cohort and dates; do not search only the current page's poll or limit reuse to `candidateRoutes`. Those routes are suggestions. Record survey IDs considered, selected/rejected findings, relevance rationale and exact snapshot/approval artifacts in the existing evidence packet. No intact completed results means there are no final findings to reuse yet, not zero demand or no surveys on the site. Continue with other supported sources without waiting for responses. A connection failure is unavailable evidence: resolve/retry it and report it honestly; never claim the log was checked successfully.

For a relevant completed survey not already approved for this route, export its private evidence using `research.mts export --campaign <id> --include-responses --out <private-path>`, then have the independent reviewer inspect response quality, counts/denominator, exact question/options, timing, limitations and target-page relevance. Older-version evidence remains in the catalog; use its exact wording and snapshot, never reinterpret it as the current campaign. If the old campaign is no longer in active definitions, use the catalog result and privately retrieve its full stored state by ID for the reviewer rather than dropping it silently.

Only reviewed, route-approved snapshots may enter the writer's CLOSED FACT LIST. Use the existing `research.mts approve --review <independent-artifact>` step and `facts --route <target>` to supply verified source IDs, field dates, counts, scope and limitations. Any relevant page may reuse a finding after its own relevance review; initial candidate routes are suggestions, not an allowlist. New findings still follow Phase 3 generation and independent Phase 4 review. Surveys are voluntary self-reports, never product tests, representative samples or proof of causation. Preserve professional/topic exclusions and sufficient existing verdicts. Keep private answers/paths and production labels out of reader-facing copy.

Treat these reader results as one original-data source alongside anonymous client/fleet experience, internal modeling, actual executed tasks and external primary research. Use as many relevant sources as needed; a survey is neither compulsory nor sufficient by itself. Keep survey findings visibly attributed to our opt-in reader poll with the actual question, sample, field dates and material limitations near the finding. Do not invent respondents, merge campaign versions, infer an unasked demographic/model/hardware attribute, or claim that a reported recovery proves a fix caused it. Carry the finding's `reader-self-report` basis into the writer's facts and provenance; it does not enable a TESTED label.
<!-- /reader-survey-evidence-v1 -->

**Unified testing contract:** read `.claude/commands/_testing-labels.md`. Preserve this site's exclusions; distinguish eligibility from reviewed evidence; use the same decision for writer format, title, byline, methods, picks and testing-related schema. Missing or stale evidence cannot turn the TESTED format on.

<!-- mindmap-execution-v1 -->
Before writing, follow `_mindmap-execution.md`: retrieve approved cases and applicable survey records, execute relevant supported analysis and save current evidence. Use a justified source-based branch when numerical work adds nothing or cannot be defended. Pass the manifest/review/packet flags to every Mindmap writer call.
<!-- /mindmap-execution-v1 -->
