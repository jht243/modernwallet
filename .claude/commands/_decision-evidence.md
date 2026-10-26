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

## 3. Save a small evidence packet and hand it to the writer

Use the calling routine's existing run directory: `evidence/<slug>/`. Save:
- `evidence.json`: route; reader question and demand source; decision gap; sampled alternatives; method; source URLs/check dates and sourced inputs; scenario assumptions; calculation/test command and output paths; findings with `measured|calculated|reported|unknown` labels; counterexample; exclusions; unknowns; what would change the recommendation; selected medium and reason.
- The executable calculation/test and raw outputs needed to reproduce numerical claims. Use an existing helper where possible. For non-numerical analysis, retain the source-to-conclusion reasoning instead of a fake numeric test.
- `growth.json`: origin routine, query family, hypothesis, primary metric, baseline reference and exact window/property/canonical URL, comparator plan, change scope, source refresh trigger and outcome status. Link existing generator-usage/effort records for production cost; use unknown rather than guessing. Missing GSC data is `unavailable` or `evidence-conflict`, never an invented zero. New routes use `not-yet-published` and an age-matched comparator, not a fabricated before-period.

Copy the approved findings, conditions and source IDs into the writer's CLOSED FACT LIST alongside the published facts. Give the writer the current page for enrichments. The answering section stays in the brief's approved slot. Ask for the implication, the worked case, the exception and the next action; never ask it to improvise testing data. Substantive prose still uses `content_gen.py`.

### Make our contribution visible to the reader

When this run produces original analysis or actual testing, the writer must make its origin understandable beside the first material finding. Normally one short, natural sentence or two connected sentences is enough. Use explicit ownership and an action: **what we did → what we found → how readers can check it**. Prefer “In our internal cost analysis, we modeled…” or “In our internal modeling, we compared…” over a bare “Our cost model uses published prices.” Naming the inputs alone does not explain our work. State the actual task, the relevant scope or assumptions, and the result; lead with the reader's answer, not a generic authority claim. Respect the chosen operator/reporter register. Use normal visible page text, with a nearby table, method note or anchor explaining the calculation/test where useful; do not hide the only explanation in metadata, an unrelated FAQ or a private report path.

Match the cue to the evidence:
- **Actual product test:** prefer “In our internal testing, we [performed the specific task under stated conditions] and found [supported result].” “We tested…” is also suitable. Use these only when this run or a reusable verified run actually exercised the relevant product/task. Identify the task and meaningful conditions; retain version/date, sample/repetitions, outputs and scoring in the packet. Testing our calculator's code is not testing Claude's performance. Automated API/browser tests count when they genuinely execute the claimed task; human modeling does not.
- **Calculated analysis:** prefer “In our internal cost analysis, we modeled [the relevant options/scenarios] to see [the reader’s decision]. Using [sourced inputs], we found [supported result and conditions].” For example, introduce the student comparison with “In our internal cost analysis, we modeled student spending across Claude Pro and Max to see when upgrading actually saves money,” then state the verified finding with its conditions. Link the nearby calculation or let readers adjust the inputs. Use “internal modeling” when that describes the work more accurately. “Internal” supplies no extra authority; the specific action, finding and inspectable method do. For this student guide, attribute the conditional cost comparison to our calculation, not to a product trial. Identify vendor prices as sourced inputs, rather than implying we measured them.
- **Hypothetical scenario:** prefer “In our internal modeling, we compared [scenarios] to estimate [outcome]. Assuming [inputs], the model suggests [conditional result].” A study-workload introduction can say “We modeled different study workloads to estimate when Max could justify its higher price. Adjust the assumptions below to see your result.” Keep the assumptions beside each result and make clear these are hypothetical workloads. The study-time scenario's interruptions and recovery rate are hypothetical; it cannot become “our testing found students save two hours.”
- **Client experience:** prefer “In our conversations with [the supported client group/context], [specific documented observation]…” followed by its practical implication. “In our conversations with clients…” requires relevant dated notes/transcripts or approved case records that support the exact observation. Record source IDs, context and the scope of the observed sample. Client names, quotes, counts and outcomes must be grounded and eligible for public use under existing project rules. Anonymize only where permitted; otherwise omit. A single case remains a single case; unrelated business conversations do not establish student behavior or product performance. Do not add a client-conversation claim merely because the company serves clients.
- **External evidence only:** name the actual source: the vendor reports/publishes, or the cited researcher measured. Do not relabel external observations as “our tests.” Original synthesis may be described as our analysis only when the saved reasoning actually adds a conclusion beyond restating the source.

Add a small `provenance` entry to the existing evidence packet: `basis` (tested/calculated/modeled/client-record/reported), `supportingRecordIds`, `scopeAndLimits`, `publicMethod` (on-page explanation/anchor or suitable public source), and `placement` (section/field). Private records stay private; provide a publishable method summary rather than exposing internal paths or client records. Copy this approved basis into the writer's closed facts and explicitly ask for the appropriate visible attribution. The writer chooses natural wording; examples above are patterns, never a phrase quota or placeholders to publish.

Do not repeat “we tested” throughout the page, add an empty “internal testing” badge, or force first person into a source-only page. A different evidence type may need its own short clarification at that finding. Preserve the no-addition branch and existing sufficient attribution. These cues help readers understand provenance; no particular phrase is a known Google ranking trigger, and the traffic hypothesis remains unproven until measured.

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

Phase 4 reviews the packet and the exact page/tool, including new content embedded in an existing route. In addition to existing gates, fail when:
- A central finding is untraceable, irreproducible, contradicts its inputs, or presents assumed behavior as measured behavior.
- A claimed test, model or client observation lacks its supporting record, exaggerates the scope, or uses the wrong evidence label. Reject unsupported first-person experience even if a template asks for it.
- Original work is presented without enough visible attribution or method context for the reader to tell what we did. Check that the wording identifies our specific action, the supported finding and a nearby way to inspect the method or inputs. A bare “Our cost model uses published prices” is insufficient by itself. Ask for a short accurate clarification at the finding; do not fail an already-clear attribution for lacking an exact phrase, and do not force one on source-only/no-addition work.
- An attractive headline/conclusion omits a condition that reverses the decision, or nearby verdicts contradict the new finding.
- The takeaway (or existing equivalent verdict) fails to answer the approved reader question, adds an unsupported recommendation, mismatches the evidence basis, or omits a material condition/alternative that reverses the decision. Check it against the packet and the top answer, table, calculator and FAQs. Reject “our testing and scenarios” when only modeling or external research exists. Accept a clear supported conditional/inconclusive answer, an already-sufficient verdict or the no-addition branch; do not demand an exact heading, canned phrase, repeated conclusion or commercial recommendation on an informational page.
- The alleged contribution is only reworded vendor facts or arbitrary arithmetic presented as empirical insight. Optional sensitivity tools may stay when clearly labeled; they cannot stand in for a missing central answer.
- A promised tool is a placeholder, its default/boundary cases fail, or the useful answer is unavailable without completing the interaction.

Check date/source freshness, units, comparable conditions, counterexamples, first-use source links, rendered labels, accessibility and mobile readability. Record any limitation in the verdict. A factual correction or technical fix does not need to invent a new proprietary finding. A no-addition decision must explain why the existing answer is sufficient. After the second failed rework, stop this workflow and escalate with the unresolved findings. Do not continue to commit, push or publish. Higher-priority user/project gate rules override older drop-and-continue instructions; the remediation ladder still chooses the cheapest valid repair.

## 5. Carry evidence into the existing growth loop

At summary, register the contribution in the existing run report/ledger with its evidence and `growth.json` paths. Record deployed URL/commit/date only after actual deployment. Local pilots stay `local-only`; their Google impact is unmeasured. Keep deployment status, data availability and outcome in separate fields. Store review results separately for day 28 and day 56. Before reading outcomes, declare the day-28 window (first 28 complete live days) and day-56 window (second 28 complete live days), reporting delay, baseline and comparator. Assign a deployed date only with verified deployment evidence. Unavailable or deferred reviews remain pending for the next eligible existing run; record a retry reason.

Use the existing growth/striking-distance review to assess eligible cohorts after 28 and 56 days of live exposure, with adequate volume and reporting delay. This records review windows, not permission to create a scheduler or publish. Respect protected-winner rules, cooldowns and shared locks; a routine must not use this protocol to bypass them.

Primary outcome: incremental Google clicks. Diagnose impressions, query-level position and CTR separately; segment material country/device/query changes and compare suitable unchanged pages or age-matched cohorts. Keep query families and experiments non-overlapping where possible, record concurrent edits/algorithm changes, and label weak evidence `inconclusive`. Engagement, tool use and citations are supporting outcomes, not proof of ranking benefit. Do not infer success from publishing, a fresh date, an audit pass or a before/after CTR change with a different query mix.

On subsequent passes, read available cohort outcomes before choosing more work. Expand approaches with credible incremental returns, revise inconclusive ones, and stop adding formats that only increase cost. Record production/maintenance cost with outcomes. This is the connection to the 10× ambition; never assign a fabricated traffic multiplier to a content feature.
