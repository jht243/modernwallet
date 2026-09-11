# Phase BUILD-BRIEF — Generate the chart from a free-form input brief (SEMRUSH-validated)

This is Step 1 of `/mindmap-pass`. It replaces seo-gsc-pass's "build chart from 5 GSC screenshots" step. Instead of reading GSC keyword screenshots, it reads **whatever the user handed you** — free text, an image, a chart/screenshot of data, a pasted news article, a URL, or a half-formed "here's a thought" — interprets it into concrete topics the user wants on the site, **validates and expands that intent through the keyword demand ladder (the ladder picks the best usable provider per field (volume: ahrefs > dataforseo > semrush; kd: ahrefs > semrush > dataforseo), then public-source estimate)**, clusters the demand, and produces the **same machine-readable chart** the rest of the phases (0–9) consume unchanged.

Run this phase **only when** Phase 0 cannot find a chart at `reports/mindmap-pass/<TODAY>.md`. If today's chart already exists, or the user passed a chart path argument, skip this phase and let Phase 0 load it.

This phase produces the file Phase 0 then loads. Once it is saved, control returns to Phase 0 for selection, staleness check, parsing, and the manifest gate.

## The input can be ANYTHING — capture it first, do not ask for GSC data
Unlike `/seo-gsc-pass`, this workflow does **not** want GSC screenshots. Its input is the user's own brief about what they want added to the site. Accept and handle every input modality present in the current conversation:

- **Free text / a "random thought"** — e.g. "I think we should own the 'AI receptionist for dental offices' angle." Treat the text as the statement of intent; extract the topics, entities, audiences, and angles inside it.
- **An image** — read it. A **photo/screenshot of a whiteboard, slide, or notes** → OCR/transcribe the concepts. A **chart or data screenshot** (e.g. a trend graph, a competitor's traffic table, a keyword list) → read the axes/labels/rows and pull out the themes and any entities named. A **product/marketing screenshot** → identify what product or topic it depicts.
- **A pasted news article or URL** — extract the story's entities, claims, and the emerging theme; treat "what would a searcher look up after reading this?" as the seed set. If it's a bare URL and fetching is available, fetch it; otherwise work from the text the user pasted.
- **A collection / cluster the user typed** — e.g. a list of topics or keywords. Treat each as a seed.
- **A mix** — e.g. an image plus a sentence of context. Merge them into one intent.

**If NO input is present** (no text beyond the bare command, no image, no article) AND no chart exists → **STOP** and ask the user to paste the text / attach the image / drop the article or link describing what they want added. Do NOT invent a brief.

Write a short **Interpreted brief** paragraph at the top of your working notes (and later into the saved chart's frontmatter/source line): 2–4 sentences restating, in your own words, what the user wants added — the topics, the audience, the angle, and the input modality it came from. This is what everything downstream is validated against; if your interpretation is wrong, the user catches it at the Phase 0 manifest gate.

## API key (read from environment — NEVER embed in this file or the saved chart)
- **Keyword demand comes from the shared ladder, not a single API.** Call `scripts/lib/keyword_data.py` (`volumes()` / `expand()`), which walks the ladder picks the best usable provider per field (volume: ahrefs > dataforseo > semrush; kd: ahrefs > semrush > dataforseo), then public-source estimate automatically. Read `.claude/commands/_keyword-demand-ladder.md` before this phase. Do NOT hand-roll a SEMRUSH call and do NOT hardcode a key — the helper reads `$SEMRUSH_API_KEY` / `$AHREFS_API_KEY` from the environment (`us` database by default; override with `SEMRUSH_DATABASE`).
- **SEMRUSH is preferred, Ahrefs is the automatic backup.** The old "never use Ahrefs here" rule is retired: when SEMRUSH is dry (units zero / 401 / 403 / no key) the helper falls through to Ahrefs, and then to a public-source estimate, so this pass keeps running. (GSC performance data may still be consulted later, in the execution phases' metadata gates — that is a separate signal, not keyword discovery.)
- **NEVER stop this pass because a key is missing or dry.** The helper demotes a rung and continues. If it lands on rung 3 (estimate), keep going and label every affected row `source: estimate (autocomplete) — NOT measured`, carrying the band rather than a point figure. Apply floors with `passes_floor()`, and state the rung that ran in the summary (`keyword_data.notes()`). Fabricating a volume number, or inventing a keyword phrase, remains forbidden at every rung.
- If you must call SEMRUSH from a shell, prefix so the key never lands in shell history/logs (e.g. `SEMRUSH_API_KEY="$SEMRUSH_API_KEY" python scripts/semrush_ai_seo_research.py ...`).

## API budget discipline (SEMRUSH costs credits — use it moderately)
Be deliberately economical; do not hammer the API.
- **One pull per seed / phrase.** Expand each seed once (`phrase_related` / `phrase_fullsearch` / `phrase_questions`), validate each candidate once (`phrase_these` for volume/CPC, `phrase_kdi` for difficulty). Batch phrases with `;` joins (both `phrase_these` and `phrase_kdi` accept a `;`-separated `phrase` list) instead of one call per keyword.
- **Only look up metrics for real candidates**, not every raw expansion result. Filter to plausible, on-mission phrases first, then validate that shortlist.
- **Keep the seed set tight** (a handful of seeds derived from the brief). Cache intermediate JSON/CSV under `reports/mindmap-pass/` and read from it instead of re-querying.
- Prefer free signals (the Autocomplete tool, web search, the codebase, the target-keyword doc) for judgment calls; spend SEMRUSH credits only where a real metric is needed.

## SEMRUSH report types (same endpoint the repo scripts already use)
| Need | `type=` | Notes |
|---|---|---|
| Volume / CPC / competition for exact phrases | `phrase_these` | Batch with `phrase=a;b;c`. The primary validation call. |
| Keyword difficulty (KD) | `phrase_kdi` | Batch with `phrase=a;b;c`. |
| Related-keyword expansion | `phrase_related` | Per seed; cap with `display_limit`. |
| Broad-match expansion | `phrase_fullsearch` | Per seed; cap with `display_limit`. |
| Question-format expansion | `phrase_questions` | Per seed; the "what/how/can/is" long-tail. |
| Who ranks (SERP / competition read) | `phrase_organic` | Per top candidate — tells you how contested the term is and who owns it. |

Free live-demand miner (no SEMRUSH credits, real Google data) — run it on every core seed to widen long-tail/question coverage:
```bash
python3 .claude/tools/autocomplete-paa/autocomplete.py \
  --seed "<seed phrase from the brief>" \
  --mode all \
  --csv reports/mindmap-pass/<TODAY>.autocomplete.<seed-slug>.csv
```
`--mode all` runs the 10 question-prefix sweep + the a–z alphabet sweep and dedups; output is `seed,suggestion,via` CSV. Treat every row as a Lens-2 candidate. If the project has a tracked-keyword inventory file, pass `--inventory <that file>` so new suggestions are appended (deduped) to THIS project's inventory only.

---

## ► ANALYZE THE BRIEF THROUGH THREE MANDATORY LENSES — ALL RUN ON EVERY PASS

- **Lens 1 — Direct intent (what the user explicitly wants added).** Parse the interpreted brief into the concrete topics/pages the user is actually asking for. For each, derive the exact keyword phrase(s) a searcher would use, **validate them on SEMRUSH** (`phrase_these` + `phrase_kdi`, and `phrase_organic` on the strongest to read competition), and shape each into a chart row with a real target. This lens honors the user's request literally.
- **Lens 2 — Adjacent-demand discovery (CORE TENET — never skip).** The brief is a seed, not a ceiling. Expand around it with SEMRUSH (`phrase_related` / `phrase_fullsearch` / `phrase_questions`) + the Autocomplete miner + a quick web/news scan, and surface **clusters of real demand the user did NOT name but that belong with their idea** — sibling questions, adjacent audiences/verticals, comparison/format variants, news-driven spikes. This is the same emerging-search-pattern engine `/seo-gsc-pass` runs, re-pointed from "the GSC query set" to "the demand space around the user's brief." **A pass that returns only the literal terms the user typed, with no SEMRUSH-driven adjacent clusters, has failed this rule.**
- **Lens 3 — Comparison / Alternatives / Pricing (CORE TENET — run on EVERY pass; see the dedicated section below).** For every primary entity the brief names or implies (product, tool, vendor, model, platform, service), systematically mine the three highest-commercial-intent bottom-funnel formats: **`{entity} vs {rival}` comparisons**, **`{entity} alternatives`**, and **`{entity} pricing / cost / is it worth it`**. These convert and are where competitors concentrate — a mindmap pass that ships topical/how-to rows but no vs/alternatives/pricing coverage for the brief's entities has failed this rule. All three lenses feed the same output table.
- **Lens 3b — Model-launch overlay (CONDITIONAL).** Runs only on an AI-content repo when the brief or the lenses surfaced a **new AI model release**; every other repo and brief skips it. It forces the Tier 0 Launch Core rows into the chart regardless of keyword-tool volume. See the dedicated section below.

## LENS 1 — Direct intent → validated rows

1. **Extract seeds from the interpreted brief.** List the concrete topics/entities/audiences/angles the user wants. Convert each into 1–3 candidate search phrases (how a real searcher phrases it), not marketing copy.
2. **Validate on SEMRUSH.** Batch the candidates through `phrase_these` (volume, CPC, competition) and `phrase_kdi` (difficulty). For the strongest 3–5, run `phrase_organic` to see who ranks and how contested the SERP is. **No fabrication** — real phrases and real figures only; a phrase SEMRUSH returns no data for is labeled `no tool volume` (still may be worth a long-tail slot, but say so — never invent a number).
3. **Decide the home + lever** for each validated intent using the ladder in "Decide the lever" below. Name the exact target file/route.
4. A brief item the site **already answers well** with a dedicated, intent-matched page is **not** a new row — record it under exclusions ("already covered by `<route>`"), don't pad the table.

## LENS 2 — Adjacent-demand discovery (CORE TENET — run on every pass)

Lens 1 stays inside what the user typed. Lens 2 reads the **demand space around it** and finds the themes worth owning that the user didn't name. Do all four steps; use only real SEMRUSH/Autocomplete/web data — never invent queries, volume, or movement.

1. **Expand the seeds.** For each Lens-1 seed, pull `phrase_related` + `phrase_fullsearch` + `phrase_questions` from SEMRUSH and run the Autocomplete miner. Merge the results into one candidate pool.
2. **Cluster the pool.** Group candidates into semantic clusters by shared intent, entity, or modifier — a recurring product/model/vendor name, a compliance framework, an audience/use-case modifier ("for dentists", "for startups", "for enterprise"), a format signal ("vs", "alternative", "pricing", "template", "checklist", "calculator", "example"), or a question shape ("can X do Y", "is X compliant", "how to X"). A **cluster** is ≥2 related phrases sharing a theme, OR a single phrase carrying a distinct modifier/entity the site has no dedicated answer for.
3. **Identify EMERGING / under-served clusters.** A cluster is emerging/under-served when SEMRUSH/Autocomplete show real demand (volume, question frequency, or a live news signal) but the site has no page that is the clear, dedicated, intent-matched answer for it. Evidence must be real:
   - The cluster's phrases carry SEMRUSH volume (or repeated Autocomplete completions) but no existing page squarely targets the theme — a coverage gap at the *theme* level.
   - An existing page surfaces for the cluster but is an intent/format mismatch (a pillar that structurally can't satisfy a "vs"/pricing/calculator query).
   - **News-driven demand** the brief pointed at (if the input was an article): translate the breaking theme into the phrases searchers will reach for; validate plausibility with SEMRUSH volume where it exists, or label it `demand inferred from live news/Autocomplete — no tool volume yet` and cite the signal. First-mover clusters often have no competitor footprint — that's the upside, not a reason to drop.
   - A cluster the site ALREADY answers well with a dedicated page is **not** emerging — drop it (note under exclusions if noteworthy).
4. **Decide the lever per cluster** (ladder below) and emit each actionable cluster as a real row **and** as a row in the required `## Emerging search patterns (clusters)` block.

## LENS 3 — Comparison / Alternatives / Pricing (CORE TENET — run on every pass)

Lenses 1 & 2 find topical and adjacent demand. Lens 3 guarantees the **bottom-funnel, high-commercial-intent** formats are covered for the brief's entities — the pages that capture buyers already in evaluation. Run all steps with real SEMRUSH/Autocomplete data only; never invent rivals, volume, or prices.

1. **Enumerate the primary entities.** From the interpreted brief (Lens 1) and the strongest adjacent clusters (Lens 2), list the concrete named entities a searcher would compare or price — products, tools, vendors, platforms, models, services. (Pure topic/how-to briefs with no comparable entity: attempt to identify the category leaders a searcher in that space would weigh; if genuinely none exist, say so under exclusions — do not force empty rows.)
2. **Generate the three format families per entity** and validate each phrase on SEMRUSH (`phrase_these` + `phrase_kdi`; `phrase_organic` on the strongest to read who owns the SERP). Use the free Autocomplete miner on `{entity} vs`, `{entity} alternatives`, and `{entity} pricing` to surface the exact real completions (which rivals people actually compare, real "alternative" phrasings, real pricing questions) before spending SEMRUSH credits:
   - **Comparison (versus):** `{entity} vs {rival}` for the rivals SEMRUSH/Autocomplete/SERP actually surface (not invented matchups). Prefer the head-to-heads with real volume; one page per contested pairing.
   - **Alternatives:** `{entity} alternatives`, `best {entity} alternatives`, `{entity} alternatives for {audience}`, `free {entity} alternatives` — an objective, comparison-table listicle of competing options.
   - **Pricing:** `{entity} pricing`, `{entity} cost`, `how much is {entity}`, `{entity} pricing plans`, `is {entity} worth it` — a pricing/plan-breakdown page (plan tiers, what each costs, who each fits, value verdict).
3. **Decide the lever per candidate** with the ladder below. Most vs/alternatives/pricing candidates are `create new content`; if a dedicated, intent-matched page already ranks for the exact pairing/term, it's an enrich or a drop (dedup step handles it), not a new row.
4. **Emit each surviving candidate as a main-table row** with the correct `format`:
   - `{entity} vs {rival}` and `{entity} alternatives` → `format: comparison table/database`, `resolved_deliverable: comparison table/database`.
   - Pricing → `format: comparison table/database` if it's a multi-plan/multi-vendor breakdown, else `article`; if the query signals a personalized estimate ("cost calculator", "ROI"), consider `format: calculator` / `interactive tool`.
   - **Every vs/alternatives/pricing row also appears in the `## Emerging search patterns (clusters)` block** (theme = e.g. "`{entity}` comparison", "`{entity}` alternatives", "`{entity}` pricing") so the manifest surfaces the bottom-funnel coverage each run — same table+block agreement rule as Lens 2.
5. **Objectivity + affiliate rules.** Comparison/alternatives/pricing pages must be genuinely objective (the business is never the auto-winner); honor the repo's affiliate/referral wiring (first-mention company links, sponsored-referral registry) exactly as the content templates already do. Never fabricate prices — cite the vendor's public pricing or label it `pricing not public / verify on vendor site`.

Lens 3 reuses the same dedup, SEMRUSH-validation, and adversarial duplicate-suppression gate as Lenses 1 & 2 — an entity the site already covers with a real, ranking vs/alternatives/pricing page is dropped as already-shipped, not re-created.

## LENS 3b — Model-launch overlay: the Tier 0 Launch Core (CONDITIONAL — skip unless BOTH conditions hold)

**Condition 1: this repo publishes AI-model / AI-tool content. Condition 2: the brief is (or Lenses 1–3 surfaced) a NEW model release this site has no page family for.** If either is false — and on most repos in this fleet Condition 1 is always false — skip this lens entirely and move to the ladder below. A model launch is not one page, it is a page FAMILY, and launch-day queries have no keyword-tool history yet, so these rows are chosen by contract, not by volume.

1. **Slug the model** (`Claude Opus 5` → `claude-opus-5`), then grep the project's content store for each Tier 0 slug (in a Next/TS repo: `data/guides-new.ts`, `data/guides.ts`, `data/comparisons-new.ts`, `data/comparisons.ts`; elsewhere, whatever store Phase 0 discovered):
   ```bash
   M=<slugged-model>
   for s in explained pricing limits review benchmarks alternatives; do
     grep -qrE "[\"']slug[\"']: [\"']$M-$s[\"']" <content store> || echo "MISSING: $M-$s"
   done
   ```
2. **Emit a `create new content` row for every missing member:** `{model}-explained`, `{model}-pricing`, `{model}-limits`, `{model}-review`, `{model}-benchmarks`, `how-to-use-{model}`, `{model}-alternatives`, `is-{model}-worth-it` (flagship releases only) — `format: article` except `-alternatives` (`comparison table/database`).
3. **Three DISTINCT comparison rows** (`format: comparison table/database`) — Lens 3's generic `{entity} vs {rival}` covers only the second: **(1)** `{model}-vs-{prev}` — the prior generation of the SAME product line ("is the upgrade worth it"); **(2)** `{model}-vs-{rival}` — another vendor's current flagship; **(3)** `{model}-vs-{sibling}` — same vendor, DIFFERENT line (e.g. Claude Opus 5 vs Claude Mythos 5), a *routing* question, not an upgrade question. `{prev}` must resolve to a model that already has a page here — never invent a lineage.
4. **Then access + verticals:** `{model}-api-pricing` (vendor ships an API), `is-{model}-free` (free/trial tier exists), and `{model}-for-{vertical}` for `coding`, `writing`, `education`, `research`, `data-analysis`.
5. **Volume rules are suspended for these rows.** SEMRUSH will return nothing for a week-old model; that is expected. Label each `demand inferred — launch, no tool volume yet` with the launch cited as the signal, sort them **above** every other row, and never drop one for thin data. The duplicate-suppression gate may still DROP a row that already shipped (cite the SHA) — that is the only removal path, and the gate must NOT drop these as "unsupported".
6. **No fabricated numbers, ever.** Prices, rate limits, context windows, and benchmark scores are copied from the vendor's published page or omitted, with a line telling the reader to verify. If `docs/model-launch-page-family.md` exists in this repo it is the source of truth and supersedes this list; otherwise apply the list above.

Every Tier 0 row also appears in the `## Emerging search patterns (clusters)` block (theme = `{model} launch core`), same table+block agreement rule as Lenses 2 & 3.

## Decide the lever per row/cluster (top to bottom; first match wins — same ladder as seo-gsc-pass)
- **No existing page is a reasonable home for this intent →** `create new content` (a new page/hub for the topic). This is the primary engine for net-new pages — exactly what the user is asking for when they say "things I want added."
- **An existing page is the right topical home but doesn't address this angle/subtopic →** `update existing body text` (add a section/FAQ — additive only, never a rewrite).
- **An existing page already covers it in the body AND ranks, but the title/meta/snippet doesn't reflect the framing →** `update existing metadata`.
- **Two existing pages each partly serve the intent →** do NOT pick an edit lever; flag it as `consolidate / canonicalize` for Phase 1 (advisory only — the workflow never executes a 301/canonical).

Name the exact target (file/route) for the chosen lever. For `create new content`, the target is the proposed new route.

### For every `create new content` row — recommend the BEST FORMAT, not just an article
Before defaulting to an article, evaluate the cluster's query signals against these formats (same list as seo-gsc-pass): **interactive tool / calculator** (calculator/estimate/cost/ROI/score signals), **quiz / assessment** (which/what-type/best-for-me signals), **template / downloadable** (template/example/checklist/worksheet signals), **comparison table / database** (vs/alternatives/list-of signals), **glossary / reference** (definitional lookups), **data-driven report / study** (benchmark/stat topics), or **article / guide** (the default only when nothing above fits). Add the `format` field with a one-line rationale grounded in the phrases; for tool/quiz/template rows, note in the solution column what the interactive element would DO.

## ORDER OF OPERATIONS — VALIDATE & CLASSIFY FIRST, THEN DEDUP AGAINST COMMITS
Generate and validate your candidate rows from the brief + SEMRUSH FIRST; do not let commit history bias what you look at. Only once you have a concrete candidate (keyword + action + target file/route) do you check whether it already shipped. Mechanics:
1. Draft + SEMRUSH-validate + classify each candidate (Lenses 1, 2 & 3 above).
2. Run `git log -20 --stat` **once** for topic context (recent new pages/routes + `reports/mindmap-pass/*.md`), then a **targeted `git log -p -- <target>`** only on the file/route each candidate touches.
3. A candidate is a **duplicate** if those commits already show: a page/route created on that topic (`create new content`), a substantive body section already added for that keyword/cluster (`update existing body text`), or that page's title/meta/H1 already rewritten for that term (`update existing metadata`).
4. **Any candidate that duplicates shipped work is DROPPED** — record it in the exclusions paragraph as "already shipped in `<SHA>`," never as a table row. Every surviving row cites the specific SHA(s) checked (or "no prior commits touch this file/route").

## Output format (IDENTICAL to the seo-gsc-pass engine so Phases 0–9 parse it unchanged)

Main action table columns — **col 1: `problem`** (which lens surfaced it — direct-intent vs adjacent-discovery — the cluster/theme + 2–4 member phrases from SEMRUSH/Autocomplete as evidence, the SEMRUSH volume/KD/competition read, and the diagnosis of why the site doesn't own it yet; for inference-based/news rows say so and cite the signal), **col 2: `solution`** (the specific lever in one clause — "Create /route targeting 'X' under the {hub} hub [format]", "Add a section on X to {page}", "Work 'X' into the title + meta of {page}"; for non-article `create new content` rows describe what the format would DO), **col 3: `bucket`** (must map cleanly to exactly one canonical bucket: `update existing metadata`, `create new content`, `update existing body text`, `add internal links`, `consolidate / canonicalize`), **col 4: `target`** (exact file path or route), **col 5: `format`** (for `create new content`: one of `article`, `interactive tool`, `calculator`, `quiz/assessment`, `template`, `comparison table/database`, `glossary/reference`, `data report` + one-line rationale; else `n/a`), **col 6: `best_medium`** (ONLY for `create new content`: one of `text`, `image`, `video`, `chart`, `downloadable data`, `interactive tool`; else `n/a`), **col 7: `resolved_deliverable`** (`best_medium` mapped through our production-capability rules — **WE CANNOT GENERATE IMAGE OR VIDEO ASSETS**: `text`→text, `image`→text, `video`→text, `chart`→chart, `downloadable data`→`downloadable data + on-page text`, `interactive tool`→interactive tool; `n/a` for non-create rows — this is what Phase 3 actually ships and Phase 4 audits).

The table contains **only actionable rows.** No "no action / already addressed / leave alone" rows — note those in a brief exclusions paragraph below the table instead. If after filtering there are no actionable rows, say so plainly (Phase 0 will report an empty pass) and still write the file.

**Save the result to a file.** After the on-screen table, write the full chart to `reports/mindmap-pass/<YYYY-MM-DD>.md` (today's date). It MUST begin with this header block, then the table, the emerging-clusters block, and the exclusions paragraph:

```
---
mindmap_pass_date: <YYYY-MM-DD>
source: free-form input brief ({modality: text | image | chart | news article | thought}), SEMRUSH-validated
interpreted_brief: <2–4 sentence restatement of what the user wants added>
generated_by: mindmap-pass build phase — brief interpretation + SEMRUSH phrase_related/questions/these/kdi/organic + Autocomplete miner
status: ready-for-execution
---
```

In the saved file, col 3 uses the **exact canonical bucket wording** (the machine-readable handoff to Phases 0–9). Cols 4–7 (`target`, `format`, `best_medium`, `resolved_deliverable`) carry the same meanings as above.

**Emerging-clusters block (REQUIRED — the Lens 2 record).** After the main table and before the exclusions paragraph:

```
## Emerging search patterns (clusters)
| Cluster (theme) | Member queries (from SEMRUSH/Autocomplete) | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable |
|---|---|---|---|---|---|---|---|---|
| ... | q1; q2; q3 | coverage gap at theme level / intent mismatch / news-driven | none / partial / snippet-mismatch / cannibalized | create new content | /proposed-route | calculator — searchers want a personalized estimate | interactive tool | interactive tool |
```
- `Lever` uses exact canonical bucket wording (or `consolidate / canonicalize` flag for cannibalized clusters).
- `Format` / `Best medium` / `Resolved deliverable` are populated ONLY for `create new content` clusters (`n/a` otherwise), with the same capability-mapping rule (image/video best-medium falls back to text).
- **Every actionable cluster row here must ALSO appear as a row in the main action table** (same bucket + target) — the main table is the parseable handoff; this block is the human/manifest-facing view. The two must agree.
- If no emerging clusters were found, write exactly: `No emerging clusters detected this run.` Do not invent clusters to fill the block.

---

## Duplicate-suppression gate (adversarial reviewer — runs after the table is built, BEFORE the chart is saved)

The author of the chart does not clear its own duplicates. After the table is produced but before saving, spawn a read-only adversarial reviewer (Agent tool, `subagent_type: Explore`) that did NOT build the chart. Hand it the proposed rows + the repo, and have it independently:
1. Check the commits (`git log -20 --stat` for topic context + `git log -p -- <target>` per row, and `reports/mindmap-pass/*.md`), without trusting the author's dedup.
2. For each row, decide whether the work is **already shipped** per the three-bucket duplicate definitions (page created / body section added / metadata rewritten for that term).
3. Return `KEEP` or `DROP — already shipped in <SHA>`, SHA cited.
4. **Cluster rows get TWO extra checks (Lens 2 integrity):**
   - **Real evidence:** the cluster's member phrases must actually come from SEMRUSH/Autocomplete/the brief — not invented. A cluster built on unsupported phrases → `DROP — unsupported`.
   - **Right lever:** verify no existing page is already the dedicated, intent-matched answer. If one is, `create new content` is wrong → `RECLASSIFY — <correct bucket>` (or `DROP` if fully served). Conversely, if a row enriches a page that isn't a reasonable home, `RECLASSIFY — create new content`.
   - Every cluster row in the main table must have a matching row in the `## Emerging search patterns (clusters)` block (same bucket + target). A mismatch fails the gate.

**Gate rule:** if the reviewer flags ANY row as already-shipped or unsupported, remove it from the table (and clusters block) and record it under exclusions. Apply any `RECLASSIFY` in BOTH the table and the block. Re-run the reviewer on the revised chart. **Max 2 rework attempts.** The chart saves only once the reviewer confirms **zero** surviving rows duplicate shipped work, every cluster row is evidence-supported and correctly leveled, and table + block agree. A row without a cited SHA (or "no prior commits touch this file/route") is unverified and fails the gate. If issues remain after 2 attempts, STOP and report rather than saving a known-bad chart.

## After saving
Print: `Chart saved to reports/mindmap-pass/<TODAY>.md ({N} proposed rows, {C} emerging clusters). Interpreted brief: <one line>.` Control returns to Phase 0, which loads this file, runs the staleness check (passes — brand new), and presents the manifest gate.
