---
description: Mine Google Autocomplete for live zero-volume keyword demand → classify into a gap chart → execute it through ordered, gated phases → push + IndexNow. No SEMRush required. Manual trigger.
argument-hint: "[optional: comma-separated seed phrases to mine | or path to existing chart .md to skip mining]"
---

# /autocomplete-pass — Google Autocomplete mining → keyword chart → gated execution → push

> **‼️ RUN-WIDE RULE — READ FIRST.** This command runs autonomously end-to-end. There are **EXACTLY TWO** points where you stop and wait for the human: **(1)** the Phase 0 manifest approval, and **(2)** the Phase 8 push approval. At EVERY other phase boundary you **auto-continue in the same turn without asking**. The reviewer gates between phases are automatic adversarial subagents — NOT human checkpoints. Never print "Want me to proceed?", "Should I continue?", or "Next: Phase X" as a question anywhere except those two stops. If you find yourself about to ask the user whether to continue and you are not at Stop 1 or Stop 2, the answer is: don't ask — keep going.

This command runs end-to-end from live Google Autocomplete signal. It is the **zero-cost, zero-API-key** alternative to `/keyword-gap-pass` — instead of a SEMRush competitor gap, it mines Google's own `suggestqueries.google.com` endpoint (the same source Steve Toth recommends in his playbook) for live zero-volume and long-tail demand. Same chart format, same execution phases, same two human gates.

This file is only the orchestrator: it owns **ordering, gates, and rules**. The work for each execution phase lives in its instruction file under `.claude/commands/keyword-gap-pass/` — read and follow it when you reach that step. Do not restate or improvise those step instructions here; the instruction file is the single source of truth for each phase.

---

## ► STEP 1 — Discover project facts

**Do this first, always.** Follow `.claude/commands/keyword-gap-pass/phase-0-discover.md` for the project-fact discovery section only (stop before "Load the chart"). Print what you find for:

- **BASE_URL** — canonical host (e.g. `www.layer3labs.io`)
- **Framework + deploy mode** — static export vs server-rendered
- **IndexNow key** — `public/<32-hex>.txt` filename; note if absent
- **Sitemaps** — list + route→file routing
- **Target-keyword inventory** — the project's tracked keyword file (e.g. `reports/seo-research/target-keywords.md`). This is the file the autocomplete script will append to with `--inventory`.
- **Content standard** — read 2–3 existing high-quality pages; extract voice, depth, claims discipline, structure, CTA style. Print a short summary — this is the quality bar Phases 3 and 5 must match.
- **Business name** — `{BUSINESS_NAME}` for substitution in content prompts.
- **Push target** — default branch.

---

## ► STEP 2 — Determine seeds

Skip this step if the user passed a chart path as argument — proceed to STEP 4.

### If seeds were passed as an argument
The argument is a comma-separated list of seed phrases (e.g. `"ai workflow automation, ai for small business, ai consulting"`). Clean whitespace, de-duplicate. These are the seeds to mine.

### If no seeds were passed
Derive seeds from the project. Read the target-keyword inventory (found in STEP 1) and extract the **primary keyword** from each tracked page cluster. Then winnow to the seeds that are:
1. **Core to the business** — hub-level or high-traffic pages with the most content clusters around them
2. **Not mined in the last 14 days** — check `reports/keyword-pass/*.autocomplete.*.csv` filenames; if a seed's slug appears in a file dated within 14 days, skip it (already fresh)
3. **Between 2 and 5 words** — single-word seeds return too-generic completions; 6+ word seeds return near-zero results. Strip to the core 2–5 word phrase.

Aim for **3–6 seeds**. More than 6 per run is diminishing returns and slow (the `--mode all` sweep takes ~40 seconds per seed). Print the final seed list and why each was chosen (or skipped).

---

## ► STEP 3 — Run the Autocomplete miner

Skip this step if the user passed a chart path — proceed to STEP 4.

For each seed, run:

```bash
python3 .claude/tools/autocomplete-paa/autocomplete.py \
  --seed "<seed phrase>" \
  --mode all \
  --csv reports/keyword-pass/<TODAY>.autocomplete.<seed-slug>.csv \
  --inventory <ABSOLUTE PATH TO THIS PROJECT'S TARGET-KEYWORD INVENTORY>
```

**Rules:**
- `<TODAY>` = `date +%Y-%m-%d`
- `<seed-slug>` = the seed phrase lowercased, spaces → hyphens (e.g. `ai-workflow-automation`)
- `--mode all` runs question-prefix (10 prefixes) + alphabet (a–z) sweeps, deduped. ~250 suggestions per seed.
- `--inventory` MUST point to **this project's** target-keyword inventory — never a global or different project's file. The tool dedupes against every keyword already tracked there and appends only genuinely new suggestions.
- **The inventory file must already exist** — `autocomplete.py` raises `FileNotFoundError` and aborts if `--inventory` points to a missing path. If STEP 1 found no inventory file: create a minimal stub first (`reports/seo-research/target-keywords.md` or the project's analogous path, with a single `## Autocomplete Discovery Log` heading) so the run doesn't crash, OR run mining **without** `--inventory` (CSV output only) and note that no inventory was updated. Do not invent a third human gate for this — pick the sensible default and proceed.
- Run each seed sequentially (not parallel) — the tool already rate-limits at 0.2s/request; parallel runs risk Google throttling.
- If a seed errors (network, timeout), note it and continue with the remaining seeds.

After all seeds complete, print a count summary: `N seeds mined → M total suggestions → K new suggestions appended to inventory`.

---

## ► STEP 4 — Load or build the chart

**If the user passed a chart path as argument:** load that file exactly. Confirm it exists and has `status: ready-for-execution` in frontmatter. If the date in its filename is >7 days old, STOP and warn the user.

**Otherwise (normal run):** build the chart now from the mined suggestions.

### Building the chart from Autocomplete results

Read all `reports/keyword-pass/<TODAY>.autocomplete.*.csv` files produced in STEP 3. Each row is `seed, suggestion, via`. Merge all seeds into one list. This is your raw candidate set.

**Classify each candidate** into exactly one bucket using the same three-bucket spec as `/keyword-gap-pass`:

1. **`update existing metadata`** — an existing page is the right home and already covers the body, but this keyword belongs in the title / meta description / H1. Apply the metadata-rewrite decision policy (Gate 1 cooldown + Gate 2 GSC + Gate 3 churn — full spec in `.claude/commands/keyword-gap-pass/phase-2-metadata.md`). If the page is in cooldown or performing well, route to body instead.

2. **`update existing body text`** — an existing page is the right home. The fix is a new section, subsection, or FAQ block.

3. **`create new content`** — no existing page is a credible home for the intent. Propose a new route slug.

**Classification rules:**

> **‼️ INCLUSION-FIRST PHILOSOPHY — READ FIRST.** This pass casts a WIDE net. The site can always expand into new verticals, so the default is **KEEP**, not drop. Long-tail, niche, zero-volume, and *slightly off-topic / adjacent* keywords are all valid suggestions and go straight into the chart alongside everything else — **no separate "expansion" bucket, no special tag, no calling them out for a decision.** Do NOT pre-filter a keyword just because it sits outside the site's current topic footprint; just include it as a normal `create new content` row. Err toward over-inclusion. A chart with too many suggestions is fine. A chart that silently dropped a good keyword is not.

- Match each suggestion against the target-keyword inventory and the live page routes. Same cluster as an existing page → update that page (metadata vs body per above). No credible existing home → `create new content` — this applies equally whether the keyword is squarely on-topic or adjacent/off-topic. Treat them identically.
- **Adjacent / off-topic keywords — KEEP them, charted as normal rows.** Jobs, salary, careers, training, courses, certification, degrees, "how to become…", adjacent-industry, news/documentary/personality-driven, and other slightly-off-mission queries are valid suggestions. Chart each as a plain `create new content` row in the normal `### New content` section, exactly like an on-topic keyword. Do NOT tag them, do NOT segregate them, do NOT flag them for separate approval — they are just suggestions in the list.
- **The only true drops (the short list).** Drop a suggestion ONLY when it is genuinely unusable, never merely off-topic:
  - **Already shipped** — a prior commit already created the page / added the section / rewrote the metadata for this exact intent (targeted `git log -p -- <target>` dedup, same as `phase-build-keywords.md` Step C1).
  - **Exact duplicate** of another row this run (after variant grouping).
  - **Pure noise / malformed** — broken fragments, truncated gibberish, or queries with no discernible intent.
  - **Wrong language** — only if the site serves a single language and the suggestion is in another (and even then, note it as a possible localization play rather than deleting silently).
  - **Unsafe / brand-damaging** — illegal, adult, or content that would harm the brand to publish.
  - Everything else gets charted as a normal suggestion. If you're tempted to drop something for being "off-mission," don't — just chart it like any other `create new content` row.
- **Single-vendor branded queries are NOT auto-drops.** A competitor brand name can become a legitimate "[brand] alternatives" or "[brand] vs us" page. Chart it as `create new content` unless it's purely navigational (someone looking for that vendor's login page).
- **Group variants.** Multiple suggestions targeting the same intent (e.g. `what is ai workflow automation` + `ai workflow automation meaning` + `ai workflow automation explained`) → one chart row. List all variants in the `problem` cell; pick the strongest as the primary keyword.
- **Zero-volume is fine.** These are live Autocomplete signals — they represent real searches even when monthly-volume tools show 0. Note `"demand inferred from live Autocomplete — no tool volume"` in the `problem` cell when applicable.

**Metadata-rewrite policy (Step C1.5):** for any candidate classified as `update existing metadata`, run all three gates from `.claude/commands/keyword-gap-pass/phase-2-metadata.md` before saving the chart. Pages in hard cooldown (<7 days) or soft cooldown + performing → demote to body. Record the gate decision in the chart. **Gate 2 needs live GSC data** via `.claude/tools/gsc-search-analytics/gsc_search_analytics.py` (auth: `~/.claude/secrets/gsc-service-account.json`) or the Ahrefs MCP if the project is registered there. If neither is available this run, treat the page as `no-data` (which approves under the policy) and note in the chart that the metadata decision was made without GSC — do not silently skip the gate.

**Shipped-work dedup (Step C1):** for each candidate, run a targeted `git log -p -- <target-file>` to confirm the work hasn't already shipped in a prior commit. Drop any row where the action was already taken (create, body section, or metadata rewrite for the same keyword). Record `already shipped in <SHA>` in the exclusions paragraph.

### Save the chart

Save to `reports/keyword-pass/<TODAY>.md` with this frontmatter:

```yaml
---
keyword_pass_date: <TODAY>
source: Autocomplete (google suggestqueries.google.com) via .claude/tools/autocomplete-paa/autocomplete.py --mode all
seeds: <comma-separated list of seeds mined>
generated_by: /autocomplete-pass build phase
status: ready-for-execution
---
```

Chart format mirrors `/keyword-gap-pass`: four columns — `problem | solution | bucket | target`. Group rows under H3 sections: `### New content (N rows)`, `### Metadata (N rows)`, `### Body text updates (N rows)`. Adjacent/off-topic keywords are just normal rows in `### New content` — no separate section for them. Include an `### Exclusions` paragraph listing the (now short) true-drop list and why each was dropped — this should be a small list, not the bulk of the run.

**Also append** every newly classified keyword (that isn't already tracked) to the target-keyword inventory under the relevant page cluster. This is the second write to the inventory this run (the first was `--inventory` during mining). Don't double-append — check what the `--inventory` flag already added.

---

## ► STEP 5 — Phase 0: manifest gate (HARD HUMAN STOP #1)

Follow the manifest gate instructions in `.claude/commands/keyword-gap-pass/phase-0-discover.md` (the "Pre-execution manifest gate" section) exactly.

**Precondition — show the granular per-keyword export FIRST.** Before the manifest table, print the granular keyword list this run produced: **every keyword classified, including the drops**, in `keyword | proposed action | target` format (drops show `proposed action = dropped` + the reason). The phase-level manifest is NOT a substitute for this — the user must see the per-keyword decisions before approving. This satisfies the phase-0 precondition.

**Then print the full manifest table** (Phase / Rows / Plan), with per-row action detail in the Plan column. Adjacent/off-topic keywords appear as ordinary new-content rows — do not separate, tag, or call them out; they are simply part of the suggestions.

**Edge case — 0 actionable rows.** Given the inclusion-first philosophy this should be rare. Only if literally every suggestion was a true-drop (already shipped, duplicate, noise, unsafe) do you STOP and report: "Mined N seeds → all M suggestions were already-shipped/duplicate/noise. No actionable rows." Then end cleanly. If you find yourself about to report this because everything was "off-mission," STOP — off-mission is NOT a drop reason here; chart those as normal suggestions.

**Do NOT auto-proceed.** This is HARD STOP #1. Do not start Phase 1 until the user says "approve", "go", "start", "yes", or any clear affirmative. If the user wants to revise, STOP cleanly — do not start Phase 1.

---

## ► After approval: execute phases in order

Once the user approves the manifest, execute each phase in order, auto-continuing between them (no human checkpoints until Phase 8). For each phase, read and follow its instruction file verbatim:

| Phase | Instruction file | Auto-continue after? |
|-------|-----------------|----------------------|
| Phase 1 — Cannibalization detection | `.claude/commands/keyword-gap-pass/phase-1-consolidation.md` | Yes — advisory only, no edits |
| Phase 2 — Metadata rewrites | `.claude/commands/keyword-gap-pass/phase-2-metadata.md` | Yes |
| Phase 3 — New content creation | `.claude/commands/keyword-gap-pass/phase-3-new-content.md` | Yes |
| Phase 4 — Adversarial audit | `.claude/commands/keyword-gap-pass/phase-4-audit.md` | Yes — fix ACTION_REQUIRED items, then continue |
| Phase 5 — Body text updates | `.claude/commands/keyword-gap-pass/phase-5-body.md` | Yes |
| Phase 6 — Internal linking | `.claude/commands/keyword-gap-pass/phase-6-internal-linking.md` | Yes |
| Phase 7 — Sitemap + IndexNow prep | `.claude/commands/keyword-gap-pass/phase-7-sitemap-indexnow.md` | Yes |

---

## ► Phase 8 — Summary gate (HARD HUMAN STOP #2)

Follow `.claude/commands/keyword-gap-pass/phase-8-summary.md` exactly — it owns the summary-table format and the approval question. Add **one row at the top** of that table for the mining step that is unique to this command:

| Phase | Rows | Outcome |
|-------|------|---------|
| 0 — Autocomplete mining | — | `{N seeds → M suggestions → K new appended to inventory}` |

**Before printing the summary — run the project's typecheck/build gate.** In STEP 1 you discovered the framework; run its compile/typecheck (e.g. `npx tsc --noEmit --skipLibCheck` for a TS project, `npm run build` / `next build` where that's the canonical check, or the project's lint/test script). If it fails, **fix the errors before surfacing the summary** — never present a summary on top of a broken build. If the project has no typecheck/build step, note that and continue.

Then STOP and wait for the user's explicit approval per the canonical file's approval question. **Do NOT commit or push until the user gives explicit approval.** This is HARD STOP #2. Acceptable approvals: "approve", "push", "commit", "go", "yes", or any clear affirmative.

---

## ► Phase 9 — Commit + deliver

After the user approves Phase 8, follow `.claude/commands/keyword-gap-pass/phase-9-commit-deliver.md` exactly.

Commit message format:
```
feat(autocomplete-pass): {N} new pages, {M} metadata rewrites, {B} body updates — {SEED_COUNT} Autocomplete seeds

{brief bullet list of routes created/changed}

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

---

## Drop rules — DELIBERATELY MINIMAL

> This pass is **inclusion-first**. Unlike `/keyword-gap-pass`, it does NOT drop keywords for being off-mission, adjacent, niche, branded, jobs/training/career-related, news/personality-driven, or low-volume. **The site can always expand.** Off-topic ≠ drop — off-topic keywords are charted as ordinary `create new content` suggestions, mixed in with everything else. No tag, no separate bucket, no special handling.

**The ONLY reasons to drop a suggestion (keep this list short):**
- **Already shipped** — a prior commit already did this exact work (targeted `git log -p -- <target>` dedup, Step C1).
- **Exact duplicate** of another row this run (after variant grouping).
- **Pure noise / malformed** — broken fragments, gibberish, no discernible intent.
- **Wrong language** — only if the site serves a single language (and even then, note it as a possible localization play, don't silently delete).
- **Unsafe / brand-damaging** — illegal, adult, or content harmful to publish under the brand.

Everything else — including jobs, salary, courses, certification, "how to become…", adjacent industries, competitor brands, documentary/personality queries, and zero-volume long-tail — gets **charted as a normal `create new content` suggestion**, mixed into the list with everything else. When unsure, keep it.

**Note:** single-word seeds are still expanded to 2+ word phrases before mining (a tooling rule for useful completions, not a relevance filter) — but the *suggestions* they return are all fair game.

---

## Quality bar (non-negotiable for all content phases)

All new and updated content must meet the project's derived content standard (extracted from existing pages in STEP 1) plus these universal rules drawn from the project's SEO guidelines:

- **Research-first:** every factual claim backed by a named, checkable source — no fabricated stats, no vague "studies show." If uncertain, omit rather than invent.
- **E-E-A-T signals:** named human authorship signal on YMYL pages; Person JSON-LD where the framework supports it; first-party sourcing over aggregators.
- **AEO (Answer Engine Optimization):** section openers are self-contained declarative claims, not rhetorical questions or transition phrases. The first sentence of each section can stand alone as a featured-snippet candidate.
- **Information Gain:** every section contains at least one non-obvious insight, original example, or specific figure not findable on the first SERP page.
- **Task completion:** each page fully answers the reader's intent on-page. Does not thin-wrap or redirect out without first completing the answer.
- **Hub-and-spoke internal linking:** every new page links up to its hub; hub pages link down to the new spoke.
- **metaTitle ≤ 60 chars; metaDescription ≤ 160 chars** — verified before Phase 4 passes.
