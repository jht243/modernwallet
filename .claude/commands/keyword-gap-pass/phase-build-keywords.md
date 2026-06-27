# Phase BUILD-KEYWORDS — Generate the chart from a SEMRUSH keyword-gap analysis

This is Step 1 of `/keyword-gap-pass`. It replaces seo-gsc-pass's "build chart from GSC screenshots" step. Instead of reading screenshots, it explores live opportunity two ways — a **competitor keyword gap via SEMRUSH** (with a competitor set refreshed every run, never hardcoded) **and wider whitespace/live-market exploration** (new verticals, niche long-tail, news-driven demand) — diffs both against the keywords already tracked in the project's target-keyword document, and produces the same machine-readable chart the rest of the phases consume.

Run this phase **only when** Phase 0 cannot find a chart at `reports/keyword-pass/<TODAY>.md`. If today's chart already exists, or the user passed a chart path argument, skip this phase and let Phase 0 load it.

This phase produces the file Phase 0 then loads. Once it is saved, control returns to Phase 0 for selection, staleness check, parsing, and the manifest gate.

## API key (read from environment — NEVER embed in this file or the saved chart)
- `$SEMRUSH_API_KEY` — Semrush Analytics API. The project reads this from `.env` (`SEMRUSH_API_KEY=...`, with optional `SEMRUSH_DATABASE=us`) via `src/config.py`.
- If the key is unset, the gap script will error. STOP and tell the user: "Set `SEMRUSH_API_KEY` in `.env` (or export it) and re-run — I won't hardcode the key into a command file." Do not invent gap data to work around a missing key.

## API budget discipline (SEMRUSH costs credits — use it moderately)
Be deliberately economical; do not hammer the API. Concretely:
- **One pull per domain/seed.** Pull each competitor once (the gap script already does), each seed's related/question expansion once. Never loop or re-query the same thing.
- **Batch where possible** (`keyword_overview_batch` over single `keyword_overview` calls), and only look up volume/difficulty for keywords that are real candidates — not every raw result.
- **Keep the seed/competitor sets tight** (~6–12 competitors, a handful of seeds). More inputs = more credits for diminishing returns.
- **Reuse, don't re-fetch.** If the gap script already returned a keyword's volume, don't re-query it. Cache intermediate JSON in `reports/keyword-pass/` and read from it.
- Prefer free signals (web search, the codebase, the tracked-keyword doc) for judgment calls; spend SEMRUSH credits only where a real metric is needed. The goal is a good chart at modest cost, not exhaustive coverage.

## Ordering — EXPLORE & CLASSIFY FIRST, then dedup against commits

Find and classify opportunities from the live data (Steps A–C) **before** checking git history. Only once you have a concrete candidate — a keyword + its proposed action + target page — do you check whether that work already shipped. This keeps the commit check precise: you look up the exact target file/route, not a blind summary built before you know what you're looking for. The inventory diff (Lens 1) already removes keywords already *tracked* in `target-keyword-inventory.md`, but it does NOT catch work that shipped in a recent commit without the keyword being in the inventory yet (e.g. a prior `keyword-gap-pass` that created a page or added a section). The targeted dedup in **Step C1** plus the **Step C2** gate close that gap.

## Step A — Establish who we are, and REFRESH the competitor set live (never hardcode it)
This pass is about exploring live opportunity, not re-running a frozen list. Treat any competitor list baked into `scripts/semrush_keyword_gap.py` (its `COMPETITORS` constant) as a **stale seed to confirm or prune — never the source of truth.** Re-derive the set every run:

- **OUR_DOMAIN** — the canonical host discovered in Phase 0 (e.g. `caracasresearch.com`).
- **Competitors (re-derived live):**
  1. Ask SEMRUSH who *actually* competes with us now: `SemrushClient.domain_competitors(OUR_DOMAIN)` (`src/seo/semrush.py`) returns our current organic competitors by SERP overlap. This shifts as our rankings and the market move — that's the point.
  2. Cross-check the world: a few quick web/news searches for what's happening in our space right now (Venezuela investment, sanctions/OFAC changes, oil & energy, travel reopening, policy shifts) to catch **emerging players and outlets** that SEMRUSH overlap hasn't caught up to yet.
  3. Reconcile: start from the seed list, **drop** anyone no longer relevant, **add** the new names from steps 1–2. Keep the set tight (~6–12 domains) but current.
- **Persist the refreshed set so competitors keep evolving:** record the final list (with a one-line reason per domain — "added: rising on sanctions coverage", "dropped: no topical overlap anymore") in the saved chart under a `## Competitors this run` section. If the project script's hardcoded `COMPETITORS` has drifted from what you just derived, update that constant too so the project's tooling stays current. The list is a living artifact, not a fixed rule.
- **Target-keyword document** — locate the tracked-keywords file. In this project it is `target-keyword-inventory.md` at the repo root, a Markdown table grouped by page: `| Target URL | Primary Keyword | Supporting Keywords |` (supporting keywords are `;`-separated). If you cannot find it, STOP and ask the user for its path — the whole point of this pass is to diff against it and append to it.

## Step B — Find opportunities through TWO lenses
Don't stop at "what competitors rank for that we don't." That's the floor, not the ceiling. Run both lenses and merge the results.

### Lens 1 — Competitor gap (the mechanical floor)
Keywords our refreshed competitors rank for that we neither rank for nor already track. The project script does this set-subtraction:

```bash
mkdir -p reports/keyword-pass
python scripts/semrush_keyword_gap.py > reports/keyword-pass/<TODAY>.gap.json
```

It (a) pulls each competitor's top organic keywords, (b) removes keywords our domain already ranks for, (c) removes keywords already in the target-keyword document, then emits JSON: `{ our_organic_count, tracked_count, gap_count, core_count, adjacent_count, gaps: [ {keyword, volume, kd, tier, intent, comp_position, comp_url, competitor}, ... ] }`. **If you refreshed the competitor set in Step A, sync the script's `COMPETITORS` constant first so this reflects today's market — don't run it against a stale list.** If the script errors (quota, network), report it and either call the SEMRUSH `domain_organic` endpoint per competitor yourself or continue with Lens 2 — note which lenses ran.

**Relevance is a TIER, not a gate — include adjacent keywords.** The script no longer hard-drops everything outside the narrow core vocabulary. It hard-drops only branded/junk (the `EXCLUDE` pattern), then tags every survivor with a `tier`:
- **`core`** — squarely inside our niche (matched the `RELEVANT` vocabulary).
- **`adjacent`** — one step out from the core: general SMB-software / operations / marketing / sales topics we could credibly own next to what we already cover (matched the `ADJACENT` vocabulary). **These are INCLUDED, not excluded.** Past versions of this pass were too strict and silently dropped them; we now surface them for editorial review.

Carry the `tier` field through to classification (Step C) and into the saved chart's `problem` cell (label adjacent rows `tier: adjacent` so the human can see how far out each opportunity sits). Do **not** auto-deprioritize adjacent keywords — a low-difficulty, on-intent adjacent term can beat a crowded core term. Weigh them on equal footing at the manifest gate. If you call `domain_organic` yourself instead of the script, apply the same logic: drop only branded/junk + truly off-mission, and KEEP adjacent terms.

### Lens 2 — Whitespace & live-market exploration (the upside)
This is the part the user actually cares about: opportunities **no current competitor has claimed**, found by wider thinking rather than copying rivals. Cast deliberately beyond the existing footprint:
- **New verticals / adjacencies** — could we credibly own a topic next to what we already cover? (e.g. from oil → mining/gold/critical minerals; from sanctions → compliance tooling; from travel → diaspora/remittances). Use `SemrushClient.related_keywords(seed)` and `phrase_questions(seed)` on our strongest existing topics to map the edges of each cluster.
- **Niche / long-tail** — specific, lower-volume, lower-difficulty queries with clear intent we could win quickly, even at <100 volume if the intent is valuable. The Lens-1 script floors at 100 volume; here you may go lower when the niche is strategic.
- **Live-market / news-driven demand** — what's spiking *right now*? Web-search current events in our space (policy changes, sanctions actions, elections, market moves, flight resumptions) and translate breaking themes into keywords searchers will reach for. These often have no competitor footprint yet — first-mover advantage.
- **Demand we could create** — emerging questions with rising interest even before volume shows up in historic SEMRUSH data; validate plausibility with a web search rather than waiting for the tools to confirm.
- **Question-format / zero-volume long-tail (Steve Toth #3–7) — run the Autocomplete miner explicitly, do NOT just "use web search."** For each core seed identified in this run, invoke the project-agnostic Autocomplete tool — it hits Google's own `suggestqueries.google.com` endpoint (free, no auth, true live data) and returns the live completion list Google would show in the search box. The seeds you run it on should be: the project's core topics from the target-keyword inventory, plus any new vertical / news-driven theme surfaced earlier in Lens 2. **Mandatory invocation per seed — pass `--inventory <THIS PROJECT'S target-keyword doc path>` so every new suggestion is appended (deduped) to THIS project's inventory, not anywhere else:**
  ```bash
  python3 .claude/tools/autocomplete-paa/autocomplete.py \
    --seed "<seed phrase>" \
    --mode all \
    --csv reports/keyword-pass/<TODAY>.autocomplete.<seed-slug>.csv \
    --inventory <ABSOLUTE OR RELATIVE PATH TO THIS PROJECT'S target-keyword-inventory.md>
  ```
  - The `--inventory` flag is **per-project**: pass the path discovered in Step A (e.g. `target-keyword-inventory.md` at THIS project's repo root). The tool dedupes against everything already tracked there — primary keywords, supporting-keywords cells, and prior log entries — and appends only genuinely new suggestions under a `## Autocomplete Discovery Log` section. NEVER point it at another project's inventory.
  - `--mode all` runs the question-prefix sweep (10 prefixes — what/how/why/is/does/can/should/when/where/which) AND the alphabet sweep (seed + a-z), then dedups. Output is `seed,suggestion,via` CSV.
  - **Read the CSV** AND **scan the newly-appended rows in the Discovery Log** — treat every row as a Lens-2 candidate to consider. These are phrases real Google searchers are typing right now. Phrases that look genuinely customer-relevant get classified into a bucket in Step C even when SEMRUSH shows zero volume; note `"demand inferred from live Autocomplete — no tool volume"` in the chart's `problem` cell.
  - **People Also Ask:** Autocomplete covers the bulk; for PAA-specific gaps, if the Ahrefs MCP `serp-overview` tool is connected this run, call it on the top 3-5 candidates' parent queries to extract their PAA boxes — record any PAA phrase not already captured by Autocomplete, and add them manually to the same Discovery Log section in the inventory (one row per PAA phrase, with `via: paa:<source-query>`).
  - These candidates compete with higher-volume opportunities **on equal footing** — they are options to weigh at the manifest gate, NOT auto-prioritized; when a stronger higher-volume or more-relevant keyword exists for the same slot, prefer it.

For Lens 2, judge relevance **editorially** — "is this something this site could credibly and usefully own?" — not by a fixed regex. The script's `RELEVANT` pattern is a coarse *core-tier tag* for Lens 1 only; do not let it cap exploration. **Adjacency is the goal here, not a risk to filter out** — a topic next to our core that we could plausibly rank for is exactly what both lenses should be surfacing. Capture each Lens-2 idea with its rationale and any volume/difficulty you can pull from `keyword_overview`.

**No fabrication:** real keywords and real figures only. When a Lens-2 opportunity is inference-based (news-driven, demand-we-could-create), say so explicitly in the chart's `problem` cell and cite the signal (the news item or related-keyword source) — never invent a volume or position to make it look measured. Keep SEMRUSH credit use lean: pull each domain/seed once.

## Step C — Classify each opportunity into a bucket + target
Merge both lenses into one list, then for every keyword/opportunity worth acting on, decide exactly one action. Per the `/keyword-gap-pass` spec, choose from these three (use the **exact canonical wording** in the saved chart's bucket column — this is the machine-readable handoff to the execution phases):

1. **`update existing body text`** — an existing page already covers this topic cluster, but its body does not yet target the keyword. Target = that page's route/file. Use when there is a clear topical home and the fix is a new section/paragraph.
2. **`update existing metadata`** — an existing page is the right home and already covers the body, but the keyword belongs in the title / meta description / H1 to win the snippet. Target = that page's route/file. Prefer this over body when the page already discusses the topic and only the head fields miss the term. Apply the **metadata-rewrite decision policy** from Step C1.5 below — if the page is in cooldown (<21 days since last metadata change), in churn (≥3 metadata changes in last 90 days), or currently performing well per GSC, **route the keyword to body instead** (it still gets in a heading/section). If the metadata was already rewritten for *this same term*, DROP the row as already shipped.
3. **`create new content`** — no existing page is a credible home for the intent. Target = a NEW route slug (propose the URL, e.g. `/venezuela-<topic>`). Place it under the most relevant existing hub — OR, when a Lens-2 idea opens a genuinely **new vertical**, propose a new hub and say so in the `solution` cell so the user can weigh the expansion at the manifest gate.

Decide the home by matching the opportunity against the target-keyword document and the live pages: same cluster as an existing page → update that page (metadata vs body per above); otherwise → new content. When two of our own pages plausibly compete for the cluster, note it in the exclusions paragraph rather than forcing a consolidation row — `/keyword-gap-pass` only emits the three buckets above.

Don't over-prune for "safety." A niche, **adjacent**, or new-vertical opportunity with a credible path to ranking is exactly what this pass is for — include it and let the human decide at the manifest gate. The bar to **drop** is high: drop an idea only when it is genuinely **off-mission** (the site has no credible claim to the topic — e.g. a different industry, brand junk, navigational/login queries) **or** you can't see a realistic way for the site to win it. "Adjacent rather than core" is **not** grounds to drop — adjacent keywords are kept and carried into the chart with their `tier: adjacent` label. When you set keywords aside, the one-line exclusion count below the table should reflect only true off-mission/unwinnable drops, not adjacency.

## Step C1 — Dedup each classified candidate against commits (targeted)

Now that each candidate has a concrete target (route/file) and action, check whether it already shipped. Run `git log -20 --stat` **once** for topic-level context (new pages/routes + recent `reports/keyword-pass/*` files), then a **targeted `git log -p -- <target>`** only on the file/route each candidate touches — not a blind full-history walk. A candidate is a **duplicate** if those commits already show:
- **`create new content`** → a page/route on that same topic or intent was already created.
- **`update existing body text`** → a substantive section targeting that keyword/cluster was already added to that page.
- **`update existing metadata`** → that page's title/meta/H1 was already rewritten for that term.

**Any candidate that duplicates shipped work is DROPPED** (it is not an actionable row — see the actionable-only rule in Step D). Record it in the exclusions paragraph as "already shipped in `<SHA>`," do NOT re-append its keyword in Step E, and never list it as a table row. Every surviving row cites the specific SHA(s) checked (or "no prior commits touch this file/route").

## Step C1.5 — Metadata-rewrite policy filter (run BEFORE the chart is saved)

For every candidate currently classified as `update existing metadata`, run the **metadata-rewrite decision policy** (also documented in detail in `phase-2-metadata.md`):

### Gate 1 — Cooldown + churn (git history dates)

For the target file:
```bash
# Last metadata-touching commit date
LAST=$(git log -1 --format=%ad --date=short -G "metaTitle|metaDescription|<h1|pageTitle|pageDesc" -- <target-file>)
# Recent churn count
RECENT=$(git log --since="90 days ago" --format=%H -G "metaTitle|metaDescription|<h1|pageTitle|pageDesc" -- <target-file> | wc -l)
```

- **`days_since_last_change < 7`** → ROUTE this candidate to `update existing body text` (hard cooldown). Note `metadata in hard cooldown (last change N days ago) — routed to body`.
- **`7 ≤ days_since_last_change < 21`** → keep as `update existing metadata` for now but mark `requires Gate-2 confirmation` (Gate 2 below decides; if page is performing, route to body; otherwise approve).
- **`rewrites_in_last_90_days >= 3` (per-slug for shared files like `data/guides.ts`)** → AI auto-decides via severity (no human flag): pull GSC `impressions_30d` for the page. If `impressions_30d >= 1000`, keep as `update existing metadata` with note `approved (churn override, M imp)` — the page has real traffic and warrants another data-driven attempt using the GSC top-impression query. If `impressions_30d < 1000`, ROUTE to `update existing body text` with note `churn + low-impressions — routed to body` (page isn't big enough to justify yet another title swing).
- **Otherwise** → continue to Gate 2.

### Gate 2 — GSC performance check (run once per unique target page)

For each unique page targeted by surviving metadata candidates, call the GSC Search Analytics tool once:

```bash
.claude/tools/indexing-issues-gsc-pass/.venv/bin/python \
  .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
  --base-url <project base URL discovered in Step A> \
  --page <full page URL> \
  --trend \
  --json reports/keyword-pass/<TODAY>.gsc.<slug>.json
```

Read the `verdict.label` and `verdict.rewrite_recommended` fields:
- **`performing`** (rewrite_recommended=false) → ROUTE all metadata candidates for this page to `update existing body text`. Note `metadata deferred — page performing well (CTR X%, trend up) — routed to body`.
- **`underperforming` / `no-data` / `mixed`** (rewrite_recommended=true) → metadata candidates stay as-is; survive into the chart.

### Result

After Step C1.5, every metadata row that survives has cleared cooldown, churn, AND GSC performance. Re-routed candidates are still actionable as body-update rows on the same target.

## Step C2 — Duplicate-suppression gate (adversarial reviewer — runs after classification, BEFORE the chart is saved)

The author of the chart does not get to clear its own duplicates. After the rows are classified (Step C) but before saving (Step D), spawn a read-only adversarial reviewer (Agent tool, `subagent_type: Explore`) that did NOT build the chart. Hand it the proposed rows and the repo, and have it independently:

1. Independently check the commits (`git log -20 --stat` for topic context + `git log -p -- <target>` per row, and recent `reports/keyword-pass/*` files), without trusting the author's dedup.
2. For each proposed row, decide whether the work is **already shipped** in those commits, per the three-bucket duplicate definitions in Step C1 (page already created / body section already added / metadata already rewritten for that term).
3. Return a verdict per row: `KEEP` (genuinely not yet done) or `DROP — already shipped in <SHA>`, with the SHA cited.

**Gate rule:** if the reviewer flags ANY row as already-shipped, remove those rows from the chart, record them in the exclusions paragraph, and ensure their keywords are NOT re-appended in Step E; then re-run the reviewer on the trimmed chart. **Max 2 rework attempts.** The chart may be saved only once the reviewer confirms **zero** surviving rows duplicate shipped work. A row without a cited SHA (or "no prior commits touch this file/route") is treated as unverified and fails the gate. If rows still fail after 2 attempts, STOP and report the unresolved rows rather than saving a chart with known duplicates.

## Step D — Save the chart (canonical 4-column format the phases consume)
Write the chart to `reports/keyword-pass/<YYYY-MM-DD>.md` (today's date). It MUST begin with this frontmatter, then the table, then a short exclusions paragraph:

```
---
keyword_pass_date: <YYYY-MM-DD>
source: live competitor gap (Lens 1) + whitespace/live-market exploration (Lens 2), diffed against target-keyword-inventory.md
generated_by: keyword-gap-pass build phase — SEMRUSH domain_competitors + gap script + related/question expansion + web research
status: ready-for-execution
---
```

Include a `## Competitors this run` section (the refreshed set from Step A, with the add/drop reasons) and, for each chart row, make the `problem` cell name which lens surfaced it so the user can see how much is competitor-gap vs. net-new exploration.

The table uses the **same four columns as the seo-gsc-pass engine** so Phases 0–9 parse it unchanged — `problem | solution | bucket | target`:

| Column | Contents |
|---|---|
| `problem` | Lead with the **keyword in bold**, then: which lens surfaced it (competitor-gap vs exploration), its **relevance tier** (`core` or `adjacent` — carry the Lens-1 `tier` field; for Lens-2 ideas judge it editorially), volume + intent, and the diagnosis (for gaps: which competitor ranks and where, why we don't; for exploration: the vertical/niche/news signal and why it's an opening). Figures come from SEMRUSH (the gap JSON or `keyword_overview`); for inference-based exploration rows, label them as such and cite the signal — never invent a number. |
| `solution` | The specific action in one clause: "Add a section on X to {page}", "Work 'X' into the title + meta description of {page}", or "Create {new-url} targeting 'X' under the {hub} hub". |
| `bucket` | Exactly one of: `update existing body text`, `update existing metadata`, `create new content`. |
| `target` | The exact existing file/route to edit, or the proposed new route for new content. |

The canonical chart holds only **rows we propose to act on**. Keywords with no good action are **excluded entirely** — not listed as "drop" or "not needed" rows. You may note *how many* were set aside and why in one short prose line below the table (e.g. "8 off-mission candidates excluded: sports, controversy, competitor brand"), but never enumerate them as chart rows. If, after filtering, there are zero actionable opportunities, say so plainly and still write the file (Phase 0 will report an empty pass).

## Step D2 — Per-keyword export + on-screen review (REQUIRED, before the manifest)
The canonical chart is the machine handoff; it is NOT enough for the human. You MUST also produce a granular **per-keyword export** of every keyword **we propose to act on** — so the user sees the keyword-level view, not just the collapsed phase view.

- **Actionable keywords only.** Do NOT include `drop` / `not needed` / off-mission keywords in the export or the on-screen table. They are excluded silently (a one-line count of what was set aside is fine; an itemized drop list is not).
- **Save the export** to `reports/keyword-pass/<YYYY-MM-DD>.keywords.csv` with columns: `keyword,action,target_page_or_new_url,lens,tier,volume,notes`. One row per actionable keyword; `tier` is `core` or `adjacent`. `git add` it.
- **Display it on screen before Phase 0's manifest**, in the user's three-column format: **col 1 = new keyword · col 2 = proposed action · col 3 = page to update (existing) or proposed URL (new content)**. Col 2 is one of the three buckets only — `update existing body` / `update existing metadata` / `create new content`.
- **Language discipline — nothing is done yet.** This is discovery. Use **"proposed action"**, never "actioned"/"done"/"complete." No keyword has been worked until the user approves the manifest and the edit phases run.
- **No collapsing of actionable keywords.** Every actionable keyword appears individually. If you group a cluster into one chart row (e.g. six news keywords → one `/briefing` body row), the export still lists all six separately, each pointing at that target.
- This export is shown FIRST; the Phase 0 manifest (phase-level grouping) comes AFTER it. Both are presented before the human approves.

## Step E — Update the target-keyword document (required deliverable)
Every NEW gap keyword the pass acts on must be added to `target-keyword-inventory.md` so the site keeps tracking it:
- **`update existing body text` / `update existing metadata`** → append the keyword to the **Supporting Keywords** cell of that page's existing row (the `;`-separated list), under the correct section. Do not duplicate a keyword already present.
- **`create new content`** → add a NEW row under the most relevant section: `| {new-route} | {primary keyword} | {the gap keyword(s) for that page} |`.
- Keep the file's existing grouping and table formatting intact. Bump the `Updated:` line at the top to today with a short note (e.g. `Updated: <TODAY> (keyword-gap-pass gap keywords added)`).
- `git add target-keyword-inventory.md` (do NOT commit — Phase 9 commits everything atomically).

## After saving
Print: `Chart saved to reports/keyword-pass/<TODAY>.md (N proposed rows); per-keyword export → reports/keyword-pass/<TODAY>.keywords.csv (M keywords total); target-keyword-inventory.md updated.` Then **display the per-keyword review table (Step D2) on screen.** Control returns to Phase 0, which loads the chart, runs the staleness check (passes — brand new), and presents the manifest gate — which must come AFTER the per-keyword export has been shown.
