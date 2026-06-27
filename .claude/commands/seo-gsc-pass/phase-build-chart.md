# Phase BUILD-CHART — Generate the chart from GSC screenshots

Run this phase **only when** Phase 0 cannot find a chart at `reports/seo-pass/<TODAY>.md` AND the user has uploaded GSC screenshots in the current conversation. If no images are present, do NOT generate a chart — STOP and tell the user to upload images or provide a chart path argument.

This phase produces the file Phase 0 then loads. Once this file is saved, control returns to Phase 0 for selection, staleness check, parsing, and the manifest gate.

## API keys
Read from environment variables — never embed in this file or the saved chart:
- `$AHREFS_API_KEY` — Ahrefs API
- `$SEMRUSH_API_KEY` — Semrush API

If either env var is unset, that API is unavailable for this run. Note that in the saved chart's exclusions paragraph, but continue (most rows can be diagnosed from images alone).

If you need either API, prefix the call so the key never appears in the shell history or logs (e.g. `AHREFS_KEY="$AHREFS_API_KEY" curl -H "Authorization: Bearer $AHREFS_KEY" ...`).

## Prompt to follow (verbatim, with API-key placeholders swapped to env-var references)

---

Help me find SEO updates based on recent GSC data (see 5 images attached — these are the only data inputs; we may have access to Ahrefs, GSC tools, or live ranking data).

AHREFS api = `$AHREFS_API_KEY` (read from environment; do not embed)
Semrush API = `$SEMRUSH_API_KEY` (read from environment; do not embed)

Use those APIs sparingly and only when needed, to save on credits.

**► ANALYZE THE GSC DATA THROUGH TWO MANDATORY LENSES — BOTH RUN ON EVERY PASS.**
- **Lens 1 — Per-page / per-keyword diagnosis.** Catches problems with pages you ALREADY have (snippet vs. ranking vs. cannibalization vs. single-keyword coverage gap). Rules below.
- **Lens 2 — Emerging search-pattern & cluster analysis.** Catches *demand you have NOT built for yet* — new query themes/clusters surfacing in the data that no page is the dedicated answer for. **This lens is a core tenet of this workflow and is non-negotiable: a pass that skips it has failed.** Lens 1 is blind to whole-theme demand because it reads rows one at a time; Lens 2 is the opposite lens — it reads the query set as a whole and finds the themes. Full rules under "LENS 2" below. Both lenses feed the same output table.

**► ORDER OF OPERATIONS — DIAGNOSE FIRST, THEN DEDUP AGAINST COMMITS.**

Generate your candidate fixes from the GSC data FIRST; do not let commit history bias what you look at. Only once you have a concrete candidate (e.g. "rewrite the homepage H1") do you check the commits to see if it was already done. This mirrors how you'd verify by hand and keeps the commit check precise — you look up the exact file/field the candidate targets, not a blind summary that may be too coarse to catch it.

Mechanics (efficient, not a full blind history walk):
1. Draft each candidate fix from the GSC images using the diagnosis rules below.
2. Run `git log -20 --stat` **once** for topic-level context (new pages / consolidations on these topics; skim recent `reports/seo-pass/*.md` if present), then a **targeted `git log -p -- <target>`** only on the specific file each candidate touches.
3. A candidate is a **duplicate** if those commits already show: a new page on that topic, a prior rewrite of that file's title/meta/H1 (any rewrite counts toward the 2+-iterations dead-lever rule below), a substantive body section already added for that query, a consolidation already performed for that cluster, or an internal-link pass already pointing at that target.
4. **Any candidate that duplicates shipped work is DROPPED** — it does not belong in the table (see the omit-non-actions rule below). Note it in the exclusions paragraph as "already shipped in `<SHA>`," not as a table row.

Every surviving row must cite the specific SHA(s) checked (or "no prior commits touch this file").

## LENS 1 — Per-page / per-keyword diagnosis

For each candidate fix, apply the diagnosis rules below:

Check git history for the specific file (`git log -p -- <path>`). If the title, meta description, or H1 has already been rewritten 2+ times in prior commits, do NOT suggest another rewrite — CTR-tuning is a dead lever on already-iterated pages. Cite the commit SHAs you checked.

Diagnose the bottleneck from the GSC images alone before prescribing a fix. Use only what the impressions/clicks numbers in the images can tell you:
- High impressions + near-zero clicks across the data shown = likely a ranking-position problem (page 2 or bottom of page 1), not a snippet problem. Rewrites won't help.
- Moderate impressions + low-but-nonzero CTR = plausible snippet problem; a rewrite may help if the file hasn't already been iterated.
- Keyword appears in the image with impressions but no page in the page-list image targets it = coverage gap.
- Two pages in the image cover the same query cluster = possible cannibalization.
Be explicit that ranking position is inferred from impression/click ratios, not measured.

**Consolidation is ADVISORY-ONLY — the workflow never executes a redirect/canonical.** A backwards consolidation 301 is the single most destructive action in SEO, so the bot does not do it; Phase 1 only *flags* cannibalization for the human. When you spot two pages competing for the same cluster, do NOT write a `consolidate / canonicalize` row expecting it to be executed — instead flag it so the human can decide. Apply the same evidence bar when writing the flag:
- Flag a **clear-dominance** pair (recommend a possible *manual* consolidation) only if one page has **≥3× the impressions of the other** AND clearly holds the clicks (e.g. 2,900/32 vs 240/4 — obvious).
- If the top two are within ~3× of each other (e.g. 248 vs 279 imp — a coin flip), recommend **differentiate their angles / add internal links — never a redirect.**
- The screenshots are the freshest data you have; use the numbers as-is, don't invent live data. Either way the output is a flag for a human, not an automated redirect.

Verify the suggestion isn't already covered by recent commits — run the targeted dedup from the order-of-operations rule above (one `git log -20 --stat` for topic context + `git log -p -- <target>` on this candidate's file). If the commits show the work already shipped (new page on the same topic, prior fix to the same file, consolidation, or an internal-link pass to that target), DROP the row and record it in the exclusions paragraph as "already shipped in `<SHA>`."

For ranking-problem pages, recommend upstream levers instead of meta rewrites: backlinks to the specific URL, internal link equity (count + prominence of internal links pointing in, which you can check in the codebase), substantive new body sections (not tweaks), SERP-format mismatch fixes (e.g., pillar page can't rank for a listicle query — build a separate listicle), or consolidation/canonicalization.

## LENS 2 — Emerging search-pattern & cluster analysis (CORE TENET — run on every pass)

Lens 1 reads rows one at a time and only sees pages you already have. Lens 2 reads the **whole query set** in the screenshots and finds the **themes** — the new demand the site has no good answer for yet. Do all four steps. Use only what the screenshots show; never invent queries, movement, or trend data not visible in the images.

1. **Cluster the queries.** Group every query visible in the screenshots into semantic clusters by shared intent, entity, or modifier — e.g. a recurring product/model/vendor name, a compliance framework, an industry or use-case modifier ("for clinics", "for startups", "for enterprise"), a format signal ("vs", "alternative", "pricing", "template", "checklist", "example"), or a question shape ("can X do Y", "is X compliant", "how to X"). A **cluster** is ≥2 related queries sharing a theme, OR a single query carrying a distinct modifier/entity the site has no dedicated answer for. The recurrence of a theme across several queries is the signal that it's a real pattern, not a one-off.

2. **Identify the EMERGING / under-served clusters.** A cluster is emerging/under-served when it is pulling impressions but the site has no page that is the clear, dedicated, intent-matched answer for it. Evidence (screenshots only):
   - The cluster's queries have impressions but the page-list screenshot shows no page squarely targeting that theme — a coverage gap at the *theme* level, not just one keyword.
   - A page surfaces for the cluster but is an intent/format mismatch (e.g. a pillar appearing for a "vs"/listicle/pricing query it structurally can't satisfy).
   - If the screenshots show movement (newly-appearing rows, rising impressions, a comparison/period view), treat newly-appearing or rising clusters as higher-priority emerging patterns. Do NOT fabricate movement the images don't show.
   - A cluster the site ALREADY answers well with a dedicated, well-matched page is **not** emerging — drop it (record under exclusions if noteworthy).

3. **Decide the lever per cluster — this is the judgment the workflow exists to make.** For each emerging/under-served cluster, choose exactly ONE lever using this ladder (top to bottom; first match wins):
   - **No existing page is a reasonable home for this intent →** `create new content` (a new page/hub built for the cluster). This is the primary engine for net-new pages on this workflow.
   - **An existing page is the right topical home but does not address this cluster's specific angle/subtopic/question →** `update existing body text` (enrich that page with a section/FAQ targeting the cluster — additive only, never a rewrite).
   - **An existing page already covers the cluster in its body AND ranks for it, but its title/meta/snippet doesn't reflect the query's framing →** `update existing metadata`.
   - **Two existing pages each partly serve the cluster →** do NOT pick an edit lever; this is cannibalization — emit it as a `consolidate / canonicalize` flag for Phase 1 (advisory only).
   Name the exact target (file/route) for the chosen lever. When the lever is `create new content`, the target is the proposed new route.

3a. **For every `create new content` cluster — recommend the BEST FORMAT, not just an article.** Written articles are one option; often a different format captures the cluster's demand better AND drives more traffic. Before defaulting to an article, evaluate these formats against the cluster's query signals:
   - **Interactive tool / calculator** — queries with "calculator", "estimate", "how much", "cost", "ROI", "score", "rate", or any input→output structure where the user wants a personalized answer, not a general explanation. Example: "AI pricing calculator", "chatbot ROI estimator".
   - **Quiz / assessment** — queries with "which", "what type", "best for me", "should I use", or any self-selection / recommendation framing. Example: "which AI model is right for my use case", "AI readiness quiz".
   - **Template / downloadable** — queries with "template", "example", "sample", "checklist", "worksheet". The deliverable is the thing, not prose about it.
   - **Comparison table / database** — queries with "vs", "alternatives", "list of", "best X for Y", where the value is structured reference data a reader scans, not prose they read linearly.
   - **Glossary / reference** — queries that are definitional or lookup ("what is X", repeated entity lookups), where a well-structured reference page outranks a long article.
   - **Data-driven report / study** — if the cluster maps to a topic where first-party or synthesized data is the differentiator (benchmarks, industry stats, survey results), a report format captures backlinks and repeat visits that articles don't.
   - **Article / guide** — everything else: explanatory, how-to, opinion, narrative, comparison-in-prose. The default only when no format above is a better fit.

   For each `create new content` cluster, add a `format` field to the row (see output format below) with the recommended format and a one-line rationale grounded in the cluster's query signals. If the format is a tool, quiz, or template, note in the solution column what the interactive element would DO (e.g. "calculator: user inputs headcount + AI use-case → outputs estimated monthly cost"). The execution phases handle article writing; non-article formats are flagged for human implementation (Phase 3 writes articles; a tool/quiz/template row is created as a brief spec, not built end-to-end by the workflow — but it DOES appear in the chart and manifest so it isn't dropped).

4. **Emit cluster findings as real, deduped rows.** Every cluster that warrants action becomes a row in the main action table below — its `bucket` is the chosen lever, its `target` is the chosen file/route, and its `problem` column names the cluster and lists 2–4 member queries from the screenshots as evidence (e.g. "Emerging cluster '[theme]' — queries: a, b, c — no dedicated page"). Run the same dedup (order-of-operations above) on every cluster row; drop any cluster already served by shipped work and note it under exclusions. **De-duplicate across lenses:** if a Lens-1 single-keyword row and a Lens-2 cluster row would drive the same fix on the same page, keep the cluster row (richer framing) and drop the Lens-1 duplicate. Also produce the human-readable cluster summary block required under "Save the result to a file."

If, after this analysis, there are genuinely no emerging/under-served clusters, say so explicitly — do not pad the table with weak clusters to look thorough.

Output format: table with col 1: problem (include the diagnosis — snippet vs. ranking vs. cannibalization vs. coverage gap, and the impression/click evidence from the images that supports it), col 2: solution (specific lever — not "rewrite title" unless the file has not been title-rewritten recently; for `create new content` rows also describe what the format would DO if it's non-article), col 3: the action category (must map cleanly to exactly one of the five canonical buckets below), **col 4: format** (for `create new content` rows: one of `article`, `interactive tool`, `calculator`, `quiz/assessment`, `template`, `comparison table/database`, `glossary/reference`, `data report` — with a one-line rationale; for all other buckets: `n/a`). In the on-screen table you may phrase the category naturally, but col 3 MUST map cleanly to exactly one of these five canonical buckets: `update existing metadata`, `create new content`, `update existing body text`, `add internal links`, `consolidate / canonicalize`.

The table must contain only actionable suggestions. Do NOT include rows for items where the recommendation is "no action," "already addressed in commit X," "too new to evaluate," "leave alone," or any other non-action. If a page or keyword from the GSC images falls into one of those buckets, omit it from the table entirely. If you want to note what was excluded and why, do so in a brief paragraph below the table, not as table rows. If, after filtering, there are no actionable suggestions, say so.

For each suggestion in the table, cite the specific commit SHA you checked against (or "no prior commits touch this file"). Do not invent ranking positions, backlink counts, or any data not visible in the 5 images or derivable from the codebase.

**Save the result to a file.** After producing the on-screen table, write the full chart to `reports/seo-pass/<YYYY-MM-DD>.md` (use today's date). The saved file must begin with this header block, then contain the table and the exclusions paragraph:

```
---
seo_pass_date: <YYYY-MM-DD>
source: 5 GSC screenshots (keyword + page impressions/clicks)
generated_by: chart-generation prompt
status: ready-for-execution
---
```

In the saved file's table, the third column must use the **exact canonical bucket wording** (one of the five above), even if the on-screen version phrased it differently — this is the machine-readable handoff to the `/seo-gsc-pass` execution command. Add a fourth column `target` containing the exact file path or route for each row (e.g. `src/pages/ai-crm-integration.tsx` or `/ai-workflow-consultant`) so the execution command knows precisely what to act on. Add a fifth column `format`: for `create new content` rows, the exact format token from the format list above (e.g. `calculator`, `quiz/assessment`, `article`); for all other rows, `n/a`. This is the machine-readable signal Phase 3 reads to determine whether to write article prose or to write a spec for a non-article asset.

**Emerging-clusters block (REQUIRED — this is the Lens 2 record).** After the main table and before the exclusions paragraph, add a section titled `## Emerging search patterns (clusters)` with one row per emerging/under-served cluster found in Lens 2:

```
## Emerging search patterns (clusters)
| Cluster (theme) | Member queries (from screenshots) | Why emerging / under-served | Current coverage | Lever | Target | Format |
|---|---|---|---|---|---|---|
| ... | q1; q2; q3 | coverage gap at theme level / intent mismatch / rising | none / partial / snippet-mismatch / cannibalized | create new content | /proposed-route | calculator — users want a personalized estimate, not a guide |
```

- `Lever` must use the exact canonical bucket wording (or `consolidate / canonicalize` flag for cannibalized clusters).
- `Format` is only populated for `create new content` clusters; write `n/a` for all other levers. Use the exact format token from the format list in step 3a (e.g. `interactive tool`, `quiz/assessment`, `article`), followed by a one-line rationale grounded in the cluster's query signals.
- **Every actionable cluster row here must ALSO appear as a row in the main action table above** — the main table is the parseable handoff the execution phases read; this block is the human/manifest-facing view of the same clusters. The two must agree (same bucket + target).
- If no emerging clusters were found, write exactly: `No emerging clusters detected this run.` Do not invent clusters to fill the block.

---

## Duplicate-suppression gate (adversarial reviewer — runs after the table is built, BEFORE the chart is saved)

The author of the chart does not get to clear its own duplicates. After the table is produced but before saving, spawn a read-only adversarial reviewer (Agent tool, `subagent_type: Explore`) that did NOT build the chart. Hand it the proposed chart rows and the repo, and have it independently:

1. Independently check the commits (`git log -20 --stat` for topic context + `git log -p -- <target>` per row, and `reports/seo-pass/*.md`), without trusting the author's dedup.
2. For each proposed row, decide whether the work is **already shipped** in those commits (new page on topic / prior title-meta-H1 rewrite / substantive body section / consolidation / internal-link pass to that target).
3. Return a verdict per row: `KEEP` (genuinely not yet done) or `DROP — already shipped in <SHA>`, with the SHA cited.
4. **Cluster rows get TWO extra checks (Lens 2 integrity):**
   - **Real evidence:** the cluster's member queries must actually appear in the screenshots. A cluster built on invented or unsupported queries → `DROP — unsupported`.
   - **Right lever:** verify no existing page is already the dedicated, intent-matched answer for the cluster. If one is, a `create new content` row is wrong — return `RECLASSIFY — <correct bucket>` (downgrade to `update existing body text` or `update existing metadata`, or `DROP` if the page already fully serves it). Conversely, if the row enriches a page that isn't actually a reasonable home for the intent, return `RECLASSIFY — create new content`.
   - Every cluster row in the main table must have a matching row in the `## Emerging search patterns (clusters)` block (same bucket + target). A mismatch fails the gate.

**Gate rule:** if the reviewer flags ANY row as already-shipped or unsupported, remove those rows from the table (and the clusters block) and record them in the exclusions paragraph. For any `RECLASSIFY` verdict, apply the corrected bucket/target in BOTH the table and the clusters block. Then re-run the reviewer on the revised chart. **Max 2 rework attempts.** The chart may be saved only once the reviewer confirms **zero** surviving rows duplicate shipped work, every cluster row is screenshot-supported and correctly leveled, and the table and clusters block agree. If issues remain after 2 attempts, STOP and report them rather than saving a known-bad chart. A row without a cited SHA (or "no prior commits touch this file") is treated as unverified and fails the gate.

## After saving

Print: `Chart saved to reports/seo-pass/<TODAY>.md`. Control returns to Phase 0, which will load this file, run the staleness check (will pass — chart is brand new), and present the manifest gate.
