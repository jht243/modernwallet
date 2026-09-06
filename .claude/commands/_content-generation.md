# Content generation — the canonical Phase 3 contract (API-generated prose)

**Status:** MANDATORY for every routine that creates NEW pages, once that routine has been
migrated (see the rollout table at the bottom). Manual global routines and cloud routines
follow the same contract. This file is the single source of truth; a routine's Phase 3 file
points here and adds only its page-specific data.

**One rule above all: the running agent does NOT write the article.** Prose is produced by
the configured model through `scripts/lib/content_gen.py`. The agent assembles the prompts,
runs the generator, verifies the draft mechanically, and hands it to the Phase 4 audit. If the
generator cannot run, STOP and report — never write the page yourself, and never substitute a
model silently.

## The generator

`scripts/lib/content_gen.py` (stdlib only; vendored in every repo, mirrored at
`~/.claude/tools/content_gen/` for manual global runs). The MODEL is configuration:

| Env | Default | Meaning |
|---|---|---|
| `CONTENT_MODEL` | `gemini-3.8-flash` | primary writer. Changing the fleet's model = changing this value. |
| `CONTENT_FALLBACK_MODEL` | `gpt-5.6-sol` | used ONLY when the primary errors, truncates, or returns nothing. Always logged. `""` disables. |
| `CONTENT_THINKING` | `high` | reasoning effort — **`high` is the fleet standard for every writer model** (Gemini `thinkingLevel`, OpenAI `reasoning.effort`, Anthropic extended thinking). Never lower it per routine without a stated reason; an invalid value falls back to `high`. |
| `CONTENT_MAX_TOKENS` | `40000` | thinking tokens count against this on Gemini — keep it high |

Keys: `GEMINI_API_KEY` (or `GEMINI_ACCESS_TOKEN`), `OPENAI_API_KEY` (site-scoped
`CONTENT_OPENAI_KEY` wins). Read from env, `$CONTENT_SECRETS`, `./.env`, `~/.claude/secrets.env`.
**Cloud routines cannot use environment variables for secrets** (the platform redacts them);
their prompt carries an inline key block, and the routine `export`s those values before
calling the generator — the same mechanism the DataForSEO / humanize keys use.

## Step 0 — preflight ONCE per run

```bash
python3 scripts/lib/content_gen.py preflight
```
Verifies every model in the chain has a key and answers. A failing preflight STOPS the phase.

## Step 1 — assemble the prompts

**`system.md` — once per run.** Order is load-bearing (each rule fixed an observed failure):

1. **A real published page of the SAME page type, as a JSON object, labelled "imitate this"** —
   the voice comes from an example, not a description of one. Pick for voice quality; never the
   page being written. (A sibling of the same family is ideal.)
2. The **output contract**: "return ONE JSON object with exactly these keys" + the page-type
   shape (`guide` / `comparison`), noun-phrase headings, at most one heading opening with the
   keyword, CTA button text, the brand first-"we" rule ("At {BUSINESS_NAME}, we…").
3. `.claude/commands/_anti-ai-language.md` WRITER section — state that it wins on conflict.
4. `.claude/commands/_experience.md` in full — the only source a first-person claim may draw on.
5. Any `_content-standard.local.md`.
6. `.claude/commands/_content-standard.md` **LAST**, under a heading that scopes it:
   *"governs STRUCTURE, SEO, depth, sourcing, linking. Follow its rules. Do not copy its tone."*

**`<slug>.prompt.md` — one per row, DATA ONLY.** Copy the row template; never restate a
standing rule here (retyping them is how they go missing). It carries:

- route, slug, page type, depth floor, primary/secondary keywords, intent
- **the CLOSED FACT LIST** — every number, date, price, limit, score the page may state, with
  the sentence *"Anything not on this list, you do not know. Never invent a price, limit,
  benchmark, or URL; say it is unpublished and tell the reader to verify at the vendor page."*
  Where a fact is contested (two sources disagree), say so and require the page to present it
  as varying. Where a sibling page's numbers must NOT leak (e.g. a predecessor's prices), say so.
- **the CLOSED URL LIST** — the only external `href`s allowed (also written to
  `allowed-urls.txt` for the mechanical guard)
- the **internal links** it may use — real routes only (siblings shipping in the same run are fine)
- what to cover, section by section; the FAQ questions (verbatim PAA where available)
- for comparisons: `optionAName`/`optionBName`, the table dimensions, the objectivity rule

## Step 2 — generate, one row at a time

```bash
python3 scripts/lib/content_gen.py write \
  --system reports/<run>/prompts/system.md \
  --prompt reports/<run>/prompts/<slug>.prompt.md \
  --out    reports/<run>/drafts/<slug>.json \
  --slug   <slug> --floor <depth floor> --schema guide|comparison \
  --allowed-urls reports/<run>/prompts/allowed-urls.txt \
  --facts  reports/<run>/prompts/<slug>.prompt.md
```

The generator's built-in verify stage is **the remediation ladder applied to the returned
draft** — it never throws a page away for a one-line fix:

- **Rung 0 — repaired in place, logged in `meta.guards.repairs`:** a code fence stripped, the
  JSON object salvaged from surrounding text, control characters and house style normalised
  (dashes → commas, ranges → "to", straight quotes), the slug set to the expected one, a
  missing `relatedLinks` inserted (undefined crashes `next build`), any external link off the
  allowed list **stripped while keeping the sentence**.
- **Rung 1 — placeholder + flag in `meta.guards.flags` for the auditor:** a missing content
  field, a sentence whose citation was stripped ("verify it is still supported"), a draft
  under the depth floor, and every number it could not trace to the fact list.
- **Rung 2 — regenerate, only for what nobody can repair:** a draft cut off at the token cap
  (the same model is first retried once at double the cap, then the fallback), or output that
  is not a parseable page object at all (the raw text is saved beside the draft first).

Read `meta.guards` before handing the draft on — it is the repair log the auditor needs.

Check draft one before generating draft two: a systemic prompt defect is cheapest on page one.

## Step 3 — verify, then the Phase 4 audit (the gate — unchanged)

The draft is a draft, not a page. Before templating:
- **Topic residue**: grep for sibling topics that could have leaked from the voice sample or
  other rows (a predecessor's price presented as the new model's, a disclaimer from another page).
- **Read it.** Reject on: a claim not traceable to the fact list; violated row constraints;
  first-person claims outside `_experience.md`; anti-AI WRITER tells; device misplacement.
- Then run the **Phase 4 adversarial audit exactly as for hand-written content.** No reduced
  standard. Hand the auditor the closed fact list and the allowed URL list so it can tell a
  real fact from an invented one — an auditor working from a trimmed list will flag true
  facts as fabrication (verify any "unsupported" finding against the source before acting).

**Fixing a finding** follows `_remediation-ladder.md`: Rung 0 mechanical lint (a banned word,
a heading, an anchor text, one sentence) is applied in place. Anything larger is a
**regeneration** with a `# CORRECTIONS FROM THE PHASE 4 AUDIT` block appended to the row
prompt (defect → the exact offending text → the replacing rule). Never hand-write generated
prose; it defeats the routine and falsifies the provenance record. Two failed regenerations
on the same defect → drop the page and report.

## Step 4 — template + provenance

Insert the verified object into the repo's store exactly as the routine already does (in a
Next/TS repo: an `_entries.push({...});` block before the `export const …` line; add
`publishedDate`/`updatedDate`). **`git add` the `.meta.json` beside every draft** — it records
the model actually used, whether the fallback fired and why, tokens including thinking, and
the estimated cost. The run summary / routine email MUST state the model used per page and
call out any page that fell back.

## Enrichment — adding to an EXISTING page goes through the same generator

**Rule (2026-09-06): any reader-facing addition longer than ONE sentence is generated by the
API writer, never written in-context.** That covers an FAQ answer, a new section, body
paragraphs, an "answer block", an expansion of thin content, a rewritten section or intro, a
comparison row's prose. The agent still decides WHAT to add and WHERE, still assembles the
facts, and still splices the result in with a targeted `Edit` — it just does not write the prose.
**Exempt (stay in-context):** a title or description, a single clarifying sentence, an
internal-link sentence, a number/date correction, alt text, a schema field.

```
python3 scripts/lib/content_gen.py section \
  --system  reports/<routine>/<TODAY>/prompts/system.md      # same system.md as Step 1 (voice sample, anti-AI, standard)
  --prompt  reports/<routine>/<TODAY>/prompts/<slug>--<section-id>.prompt.md \
  --page    reports/<routine>/<TODAY>/prompts/<slug>.page.md  # the page's CURRENT text, plain
  --out     reports/<routine>/<TODAY>/drafts/<slug>--<section-id>.md \
  --slug    <slug>--<section-id> --facts <facts file> --allowed-urls <allowed-urls.txt> [--floor <words>]
```

The per-section prompt is DATA-ONLY, like Step 1's: the page's current text (so the writer
matches its voice and does not repeat what is already said), the **closed fact list** for the
addition, the **closed URL list**, and the task in one line — the reader question to answer,
or the section to add and why (the GSC/GA4/citation signal). Output is always markdown: one
`## ` heading (omit it for an FAQ answer or a paragraph insert — say so in the task line) plus
the prose. The generator applies the same ladder as `write`: fences and control characters
repaired, house style normalised, off-list links removed with the text kept, any H1 dropped,
a heading the page already has flagged for the auditor, numbers not in the fact list listed
in `meta.guards`. `<slug>--<section-id>.md.meta.json` is committed beside the draft like a
page's.

**Splicing:** markdown/MDX stores insert the draft verbatim at the chosen anchor. TS/JSON
stores map each paragraph to one `content[]` string (or the FAQ `answer` field) — no
re-wording while mapping. The routine's existing reviewer gate then audits the addition
exactly as before, with the fact list beside it (see Step 3). A one-sentence edit that the
agent writes itself is still subject to `_anti-ai-language.md`.

## What this retires

For pages generated here end-to-end, the **INTRO HUMANIZE step does not run**. The whole page
is already written in voice by the writer model, and a second re-voice call only adds cost and
fact-drift risk. The two things that step protected — the number/link fact guard and house-style
normalisation — now run inside the generator. Sections generated through `section` are exempt
the same way; a page that only had a one-sentence edit is untouched by this rule.

## Rollout (edit as routines migrate)

| Routine | Status |
|---|---|
| `mindmap-pass` | migrated (pilot shipped a live page 2026-09-06) |
| `keyword-gap-pass`, `seo-gsc-pass` (+ `autocomplete-pass`, `amazon-gear-radar`, `ahrefs_winner_loser_pass`, `-rank-tracker` by inheritance) | migrated — Phase 3 regenerated from the mindmap version |
| `podcast-pain-pass`, `seminar-pass` (writer-standard) | migrated |
| `content-request-fulfillment-auto`, `search-gap-content-auto`, `youtube-video-pass` | migrated by delegation to mindmap-pass Phase 3 |
| `comparison-content-creator` (+ `roundup-pass`, `vertical-roundup-auto`, `comparison-content-auto`), `trend-pass`, `ga4-top-pages-pass`, `competitor-monitor`, `downloadable-asset-pass`, `amazon-gear-radar`, `indexing-issues-gsc-pass` (Mode B), `pdf-for-sale` (product page) | migrated — governing block at the top of each writer phase; new-page lanes only |
| **Enrichment** — `question-gap-pass`, `page-quality-pass`, `ai-answer-citation-pass`, `*/phase-3b-enrich.md`, `*/phase-5-body.md`, indexing Mode A | migrating 2026-09-06 via the `section` command (see "Enrichment" above); >1 sentence = API, ≤1 sentence = in-context |
| `new-ai-model-pass` | stays on its own `model_radar` pipeline for now (radar track) |
| fleet repos | generator + contract + mindmap Phase 3 synced 2026-09-06; the other routine phases sync in the next fleet pass |
| client routines (getopt, harmonica) | NOT yet — hold |
