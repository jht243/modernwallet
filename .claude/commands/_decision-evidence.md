# Decision evidence inside content creation

Applies to mindmap-pass and comparison-content-creator, including substantive existing-page enrichments. This is a substep inside Phase 3, before prompt assembly, not another production system or human gate. Existing intent, deduplication, protections, generator, audit and publication rules remain in force. Pure link/metadata corrections do not need a new experiment.

## Purpose and limits

Improve the reader's answer with defensible analysis, then learn whether that change earns incremental search traffic. Google recommends original, useful analysis, transparent sourcing and evidence for review claims. These are editorial directions, not a published scoring formula or a promise of rankings. Calculators, length, simulated personas and an originality label do not earn a ranking bonus by themselves.

Primary guidance, checked 2026-10-25:
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews
- https://developers.google.com/search/docs/appearance/ranking-systems-guide

## 1. Select the decision, using the existing brief

Reuse the approved reader question and its demand evidence; do not invent another intent prompt or a new keyword quota. Inspect the existing page, relevant primary sources and the brief's sampled search results. Record what the reader still cannot decide and what the current alternatives already answer. Never claim competitor-wide uniqueness from a small sample.

Select a finding that could change a real choice: total cost, a capability boundary, a supported workflow, a compatibility constraint, a failure case or a tradeoff. State the expected acquisition mechanism: better coverage/ranking for an existing query family, a clearer search-result promise, or a reference-worthy asset. A model with arbitrary inputs that merely restates its assumptions is a sensitivity tool, not the main evidence advantage.

If the page already answers the decision or no defensible additional analysis fits, record a short no-addition rationale and preserve the useful page. This is a terminal branch: skip the writer, tool building, numerical packet, counterexample and growth registration unless another real experiment already needs them. Do not force a calculator, manufacture a benchmark, pad the article or create another URL for the same intent. Missing evidence for a central recommendation means narrow/defer that recommendation, not invent support.

## 2. Produce evidence before choosing its presentation

Use the strongest feasible method for the decision:
- **Measured:** execute an accessible product/API/browser test with a defined task and success criterion. Save raw inputs/outputs, environment/version/date, repetitions and scoring. Respect access, privacy and cost authorization; lack of access is not permission to simulate a successful test.
- **Calculated:** execute a reproducible calculation from cited facts and explicit scenario inputs. Save the formula/code, units, exclusions and outputs. Exercise boundaries and a counterexample where the recommendation changes or the benefit disappears.
- **Reported:** attribute a vendor or third-party observation to its actual source; retain differences between test conditions. Do not turn unmatched reported benchmarks into our own head-to-head result.
- **Unknown:** state what available evidence cannot establish. Model-generated student personas are hypotheses, not observed users. Never infer actual time savings, reliability, output quality or performance from price, specifications or usage multipliers.

For estimates, disclose the basis and plausible range; test sensitivity. If the result depends entirely on an unsupported assumption, present it as an optional planning aid and find a stronger primary contribution. Do not invent confidence intervals or a composite score. Reuse evidence across related pages only where task, date and conditions match; regenerate when source inputs change.

**Presentation follows the finding.** Preserve useful calculator ideas: choose an interactive tool when reader-adjustable inputs change the answer, a table for finite cases, and prose for a simple finding. Reuse existing tools/components where they fit. Keep the key answer, examples and limitations readable on the page without requiring interaction. A calculator is optional; a useful answer is not.

Record the structured presentation decision under `_mindmap-execution.md` for both new pages and existing-body changes. State the reader inputs, intended placement and why an interaction or animation improves the decision—or why a static answer is sufficient. Compare reader jobs, not implementation convenience: three modeled scenarios can explain a principle but may not help a reader price their own team. Build/reuse the selected component before prose and review the actual rendered result. Useful animation explains changing values or a sequence, supports reduced motion and keeps the answer readable without motion. No format quota and no extra human gate.

**Choose useful visual evidence inside Phase 3, after the analysis and before writing.** Select the smallest useful format from:
- **SVG chart:** a scalable comparison of calculated/measured values, thresholds or scenarios, generated from the same inputs and outputs as the finding.
- **Actual screenshot:** a genuine capture of a product task, tool output or result we executed or observed. Use it when seeing the result helps verify or understand the finding.
- **Interactive animation:** a visual that changes as readers adjust inputs or step through a scenario. Use it when changing an assumption explains the result; integrate into an existing calculator where appropriate.

Choose more than one only when each adds something distinct; skip visuals that add no value. Place each beside the finding it supports and label modeled results as modeling and observed product results as testing. Do not publish redundant calculator screenshots by default. No videos in this workflow. Phase 4 checks the visual against its source data, evidence wording, accessibility and mobile readability; existing testing/medical exclusions remain in force.

## 3. Save a small evidence packet and hand it to the writer

Use the calling routine's existing run directory: `evidence/<slug>/`. Save:
- `evidence.json`: route; reader question and demand source; decision gap; sampled alternatives; method; source URLs/check dates and sourced inputs; scenario assumptions; calculation/test command and output paths; findings with `measured|calculated|reported|unknown` labels; counterexample; exclusions; unknowns; what would change the recommendation; selected medium and reason.
- The executable calculation/test and raw outputs needed to reproduce numerical claims. Use an existing helper where possible. For non-numerical analysis, retain the source-to-conclusion reasoning instead of a fake numeric test.
- `growth.json`: origin routine, query family, hypothesis, primary metric, baseline reference and exact window/property/canonical URL, comparator plan, change scope, source refresh trigger and outcome status. Link existing generator-usage/effort records for production cost; use unknown rather than guessing. Missing GSC data is `unavailable` or `evidence-conflict`, never an invented zero. New routes use `not-yet-published` and an age-matched comparator, not a fabricated before-period.

Copy the approved findings, conditions and source IDs into the writer's CLOSED FACT LIST alongside the published facts. Give the writer the current page for enrichments. The answering section stays in the brief's approved slot. Ask for the implication, the worked case, the exception and the next action; never ask it to improvise testing data. Substantive prose still uses `content_gen.py`.

### Make our contribution visible in the top half (15%–20% original block + Paragraph-1 hook)

When this run produces original analysis, live sandbox probes, or actual testing on a non-exempt commercial/comparison/roundup/pricing/how-to page:
- **Paragraph 1 Hook:** Surface the single sharpest verified number (from our calculation, live check, tool telemetry, or primary threshold) right in Paragraph 1 alongside the direct answer.
- **Top-Half Original Analysis Block (Section 1, 2, or 3):** Place a dedicated 150–250 word original analysis block plus a structured multi-scenario table and explicit counterexample ("when this recommendation flips") in the top half of the page—never buried near the bottom. Generic company taglines ("At Layer3Labs, we build AI systems...") or "we read the docs" never count as first-party proof.
- **Ownership cue:** State **what we did → what we found → how readers can check it** (e.g., “In our internal cost analysis, we modeled…” or “In a live free-tier check, we verified…”), pairing any matching site calculator prominently near the finding.

Match the cue strictly to the evidence:
- **Actual product test (`basis="measured"`):** “In our internal testing, we [task + conditions] and found [result].” Requires real executed run records on an eligible route; testing our own calculator code is not product testing.
- **Live free-tier / public spec probe:** Describe the exact public workspace, CLI/API, or feed check performed and the concrete ceiling, export lock-in, or friction observed—without claiming full `(Tested YYYY)` unless `tested_eligibility` and full runs pass.
- **Calculated / modeled analysis:** “In our internal cost analysis, we modeled [scenarios] using [sourced inputs] and found [result + flip threshold].” Identify vendor prices as sourced inputs and keep hypothetical workload assumptions beside the table.
- **Client / operator / tool telemetry:** Use approved anonymized client/founder observations (`_approved-cases.json` / experience catalog) within stated limits, or verified first-party calculator usage stats (`N >= 25` unique users only)—never inventing percentages or naming private clients.
- **External evidence only:** Name the actual publisher/vendor source; never relabel external specs as “our tests.”

Record `provenance` (`basis`, `supportingRecordIds`, `scopeAndLimits`, `publicMethod`, `placement`) in `evidence.json`, keep private records private, and copy the approved basis into the writer's closed facts. Preserve source-only exemptions (medical, psychedelic, legal, sanctions, biographies) and the `no-addition` branch.

### Close with a takeaway that answers the page's intent

For new pages and substantive enrichments, make the evidence lead to a useful recommendation or conclusion. Reuse an existing verdict/summary when it already does this; do not append a second conclusion. The no-addition branch still applies to an already-sufficient page, and metadata/link-only work does not trigger a new section.

Within Phase 3, give the writer a planned takeaway tied to the brief's existing reader question and the packet's findings: the conclusion, who/what it applies to, the supporting record IDs and evidence basis, and the condition that would change it. Use the existing brief/packet; no separate workflow or invented experiment is needed.

| Page intent | What the takeaway must resolve |
|---|---|
| Is it worth it? | Worth it for whom and under which conditions; when the benefit disappears or the cheaper/no-purchase option is enough. |
| Purchase, review or comparison | Which option fits which reader/task, the decisive supported reason, and when to choose the alternative or buy nothing. Never assume the newest, most expensive or sponsored option wins. |
| How-to or troubleshooting | The best supported next step, the result the evidence supports expecting, and when to stop or use a different approach. |
| Informational or research | The main answer and its practical meaning, with the material uncertainty. Do not turn a definition or research summary into a purchase recommendation. |

Keep the concise direct answer in the brief's approved answer placement, normally near the top. Put the fuller takeaway after the relevant evidence, usually at the end of the substantive analysis before FAQs/related links. Use the existing verdict field/section or a natural heading such as **Our Takeaway**; respect local schema and heading rules. Short pages may use one answer/verdict that serves both purposes. Do not repeat the opening paragraph verbatim or add a section just for its heading.

The takeaway should connect **answer → actual evidence basis → important exception or next step** in a short paragraph. Where we did original work, naturally name it again at the decision: “Based on our internal cost modeling…” or “In our internal testing of [actual task]…” with the supported conclusion. Attribute mixed evidence to the specific finding it supports; a test of one capability cannot substantiate a broader modeled performance claim. Never use the combined phrase “our testing and scenarios” unless both exist, are relevant, and their limits are clear. An accurate evidence cue here may complement the first-finding attribution; it is not a phrase quota or a Google ranking signal.

If only external evidence exists, name that evidence instead of implying an internal test. If evidence cannot settle the central question, say what remains unknown and give the supported conditional conclusion or next verification step; do not force a yes/no verdict. Preserve all local medical, psychedelic, legal, financial and other testing exclusions. A research summary is not our clinical testing, and a model cannot establish treatment safety or efficacy. Apply the site's existing professional-review requirements.

The closing takeaway, top answer, table, calculator outputs and FAQs must agree on the recommendation and its conditions. Do not extend a calculator's conclusions beyond what its inputs/formula establish. Preserve useful tools; no new calculator is required. Adding or changing this takeaway changes the reviewed content, so an existing tested approval must be refreshed under `_testing-labels.md` before its labels can return.

Update nearby verdicts and FAQs that the new evidence actually contradicts through targeted edits. Preserve unrelated content and intent. For existing pages, retain metadata unless the authorized metadata lane approves a separate experiment; record a proposed result-specific search promise without silently applying it. For new pages, titles/descriptions may reflect the finding honestly, including essential conditions; never turn conditional savings into a guaranteed claim.

**Tested-format precedence:** read `_testing-labels.md` for the unified local-permission, exclusion, evidence and automatic-rendering contract. page-type switches identify eligibility, not evidence. Neither a calculator nor a persona simulation licenses `we tested`, `howWeTested`, measured scores or tested schema/bylines. Actual relevant run records are required for those claims. Where the site's automatic format would assert testing without those records, use its existing exclusion mechanism and log why. Do not fabricate experience to satisfy another template instruction.

## 4. Independent audit of the contribution

Phase 4 reviews the packet and the exact page/tool, including new content embedded in an existing route. Check the original request and its mapped acceptance requirements as well as the approved row; a narrower brief cannot silently redefine success. In addition to existing gates, fail when:
- A central finding is untraceable, irreproducible, contradicts its inputs, or presents assumed behavior as measured behavior.
- A claimed test, model or client observation lacks its supporting record, exaggerates the scope, or uses the wrong evidence label. Reject unsupported first-person experience even if a template asks for it.
- Original work is presented without enough visible attribution or method context for the reader to tell what we did. Check that the wording identifies our specific action, the supported finding and a nearby way to inspect the method or inputs. A bare “Our cost model uses published prices” is insufficient by itself. Ask for a short accurate clarification at the finding; do not fail an already-clear attribution for lacking an exact phrase, and do not force one on source-only/no-addition work.
- An attractive headline/conclusion omits a condition that reverses the decision, or nearby verdicts contradict the new finding.
- The takeaway (or existing equivalent verdict) fails to answer the approved reader question, adds an unsupported recommendation, mismatches the evidence basis, or omits a material condition/alternative that reverses the decision. Check it against the packet and the top answer, table, calculator and FAQs. Reject “our testing and scenarios” when only modeling or external research exists. Accept a clear supported conditional/inconclusive answer, an already-sufficient verdict or the no-addition branch; do not demand an exact heading, canned phrase, repeated conclusion or commercial recommendation on an informational page.
- The alleged contribution is only reworded vendor facts, generic company taglines ("At Layer3Labs, we build AI systems..."), or thin prose buried at the bottom: on Round 1 for non-exempt commercial/comparison/roundup/pricing/how-to pages, check **Information Gain & Top-Half Placement** (Paragraph-1 numeric hook + a 150–250 word original analysis/scenario table + counterexample in Section 1–3 + non-summary Publisher's Take where supported) and send back for **at most 1 targeted rework pass**. **ZERO-BLOCKED-PAGES HARD RULE:** Information Gain, proof depth, placement, calculator pairing, and Publisher's Take findings are Round-1 edit triggers ONLY—after that 1 rework pass (or when `roundsRemaining == 0`), **100% continue and publish regardless of outcome**, logging any remaining thinness passively to `internal-proof-log.jsonl`.
- A promised tool is a placeholder, its default/boundary cases fail, or the useful answer is unavailable without completing the interaction.

Check date/source freshness, units, comparable conditions, counterexamples, first-use source links, rendered labels, accessibility and mobile readability. Record any limitation in the verdict. A factual correction or technical fix does not need to invent a new proprietary finding. A no-addition decision must explain why the existing answer is sufficient. Once all allowed audits/reworks are exhausted, automatically publish the exact final audited candidate (logging remaining non-liability findings honestly) unless blocked by a narrow direct legal/physical-harm `liabilityBlock` (e.g. incorrect medical dosing or acute safety hazard — general medical pricing, clinic locations, scheduling, educational overviews, attribution phrasing, `scopeAndExclusions`, and SEO/style findings never block); never edit an exhausted route after its final audit. The remediation ladder still chooses the cheapest valid repair within budget.

## 5. Carry evidence into the existing growth loop

At summary, register the contribution in the existing run report/ledger with its evidence and `growth.json` paths. Record deployed URL/commit/date only after actual deployment. Local pilots stay `local-only`; their Google impact is unmeasured. Keep deployment status, data availability and outcome in separate fields. Store review results separately for day 28 and day 56. Before reading outcomes, declare the day-28 window (first 28 complete live days) and day-56 window (second 28 complete live days), reporting delay, baseline and comparator. Assign a deployed date only with verified deployment evidence. Unavailable or deferred reviews remain pending for the next eligible existing run; record a retry reason.

Use the existing growth/striking-distance review to assess eligible cohorts after 28 and 56 days of live exposure, with adequate volume and reporting delay. This records review windows, not permission to create a scheduler or publish. Respect protected-winner rules, cooldowns and shared locks; a routine must not use this protocol to bypass them.

Primary outcome: incremental Google clicks. Diagnose impressions, query-level position and CTR separately; segment material country/device/query changes and compare suitable unchanged pages or age-matched cohorts. Keep query families and experiments non-overlapping where possible, record concurrent edits/algorithm changes, and label weak evidence `inconclusive`. Engagement, tool use and citations are supporting outcomes, not proof of ranking benefit. Do not infer success from publishing, a fresh date, an audit pass or a before/after CTR change with a different query mix.

On subsequent passes, read available cohort outcomes before choosing more work. Expand approaches with credible incremental returns, revise inconclusive ones, and stop adding formats that only increase cost. Record production/maintenance cost with outcomes. This is the connection to the 10× ambition; never assign a fabricated traffic multiplier to a content feature.

<!-- mindmap-execution-v1 -->
Apply `_mindmap-execution.md` for the relevance-based execution branch, approved-case lookup, current packet/artifact checks and independent replay/usefulness checks. Execute useful research; a prior test log is not an admission requirement. Preserve source-only/no-addition and professional exclusions.
<!-- /mindmap-execution-v1 -->

Owner source/attribution clarification 2026-11-09: Within the existing independent review, test the central consequential conclusion against its strongest plausible primary-source counterexample. Source silence is not affirmative proof of a universal negative. Keep material product, use and applicability conditions in the first answer, FAQ and takeaway; a usual-use limitation must not become an unconditional claim about every product. Record this in the existing sourceSupport/consequentialClaims evidence, without an extra pass or review tier.

Audit the complete rendered attribution, including unchanged templates, bylines, footer promises and author schema. An inherited “Tested and reviewed by” or “tested guidance” claim cannot have testingAndAttribution=NA. A PASS must explain the actual permitted test evidence/identity or truthful third-party attribution. If that evidence does not exist, remove or narrow the unsupported label; do not invent a person, credentials, testing, or a PASS. Metadata-only corrections retain their existing scope; no unrelated product research or new physical testing is required merely to remove a false badge.
