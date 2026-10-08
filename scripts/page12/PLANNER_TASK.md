# Page 1-2 no-clicks planner task — a BATCH of pages, files only

> **Why these pages:** Google already shows each one on page 1–2 for real searches, and almost nobody
> clicks. SNIPPET lane (#1–10): searchers see it and pick someone else → fix what they see (title,
> description, the opening) and any wrong fact. RANK lane (#11–20): nobody looks at page 2 → answer
> faster than the page-1 results so Google moves it up. Never chase a navigational search.

> **New content follows the mindmap-pass system — no exceptions.** Any reader-facing addition longer
> than ONE sentence is generated exactly as mindmap-pass Phase 5 does it: the **Enrichment** chapter of
> `.claude/commands/_content-generation.md` + `.claude/commands/mindmap-pass/phase-5-body.md`. Only
> these are written by you in-context: a title, a description, a single corrected sentence (fact fix).

> **Nothing already on the page is rewritten or removed**, except (a) the title and description and
> (b) a sentence that states an outdated or wrong fact, corrected from the official source. The answer
> block is ADDED above the existing intro; the existing intro stays word for word.

You plan fixes for the pages in your batch. You **do not edit the repo's data files, do not write
prose longer than one sentence, do not commit**. Code does the rest (`generate_all.sh` writes prose
through content_gen, `apply_sections.py` splices and commits).

P = `reports/page-1-2-no-clicks/<date>/packets`. Read ONCE for the batch: `$P/writer-rules.md` (INTENT,
LINKS, ANCHOR, anti-AI WRITER parts) and grep `$P/routes.txt` (don't print it).

For each slug S in your batch:

0. Read `$P/S/diagnosis.json` FIRST (`lane`, `level`, `fact_check`, `evidence`), then `$P/S/packet.json`
   (`page12`: main search, impressions, clicks, CTR vs the site's median; `lost_searches` = the page's
   real searches with positions; `sections`; `pricing_rows`) and `$P/S/serp.json` (what the OTHER
   results show for the main search: titles, snippets, People also ask, AI Overview). Open
   `$P/S/page.md` for the page's current text.

1. **Facts first — the whole page (when `fact_check` is true, or you notice an outdated figure anywhere).**
   - Model API prices: use ONLY `pricing_rows` (data/pricing.ts). The newest row of a family is the
     current model; an older version is history.
   - Any other product's price, plan name, limit or date: WebFetch the vendor's OWN page (its pricing
     page, docs or announcement — never a reseller, review site or the SERP snippet). If the page is a
     JS app WebFetch can't read, try the vendor's docs/help-center page; if still unreadable, do NOT
     change the fact — add it to `notes` as `fact-unverified`.
   - For EVERY sentence on the page that states an outdated or wrong fact (body, FAQ, table rows, the
     intro — not only the snippet), write an exact old → new pair. Keep the sentence's job, voice and
     length; recompute any derived figure (totals, "cheaper", %) and show the math.
   - Write `$P/S/fact-edits.json`:
     `{"summary": "<one line: what was outdated, per which source>", "edits": [{"old": "<exact sentence as on the page>", "new": "<corrected sentence>", "source": "<vendor URL you fetched>", "quote": "<the vendor's words that prove it>", "math": "<if any>"}]}`
   - If `$P/S/fact-fixes.json` exists, `apply_data_refresh.py` already swapped the plain model-price
     statements and left sentences a number swap would break (comparisons, totals, price history):
     include an edit for each of them, following `scripts/rank_drop/FACT_FIX_TASK.md`'s rules.
   - A competitor snippet is a lead, never a source. If the vendor page agrees with OUR page, write no
     edit and say so in `summary` (the snippets were stale, not us).

1b. **FACTS lane (`diagnosis.lane == "FACTS"`, a top page — GA4 top 30 or 100+ clicks/month):** do step 1
   only. Write `fact-edits.json` for verified outdated facts and a `plan.json` with
   `{"slug", "lane": "FACTS", "action": "no-fix", "summary": "<facts corrected, or none needed>"}`. NEVER
   plan a title, description, section or link change on a top page — it already wins its clicks.

2. **Decide the fix by lane** (one line of reasoning in `summary`):
   - **L3 METADATA (SNIPPET lane):** rewrite `metaTitle` (≤ 60 chars) and `metaDescription` (≤ 160)
     around the MAIN search's wording and what that searcher wants to know first. On a price/plan
     search, put the current verified price in the description ("Close starts at $9/user/mo. Here is
     what each plan adds"). Give a reason to pick us over the snippets in serp.json (a comparison,
     the hidden costs, a verdict) — never a claim the page doesn't support.
     → `plan.json` action `meta_only`.
   - **L4 SECTION (answer block):** one short section placed FIRST (`insert_before` = the id of the
     page's current first section in `packet.sections`), 120–220 words, paragraphs only:
     sentence 1–2 answer the main search directly (the number, the verdict, the yes/no); then
     the People-also-ask questions from `evidence.paa_not_answered` the page doesn't answer yet,
     each in a sentence or two. Plus the L3 meta rewrite when `needs` includes 3.
     → `plan.json` action `add_section` (+ `meta`), `section.prompt.md`, `allowed-urls.txt`.
   - Nothing concrete to fix (the snippet and opening already answer it; the searches are
     navigational) → `action: "no-fix"` with the reason.

3. **Write**:
   - `$P/S/plan.json` — `{"slug", "lane": "SNIPPET"|"RANK", "action": "add_section"|"meta_only"|"no-fix",
     "section_id": "<new kebab id, not in packet.sections>", "insert_before": "<first section id, or its heading text when the id is null (Postgres/Jinja sites)>",
     "meta": {"metaTitle": "…", "metaDescription": "…"}, "reader_question": "<the main search as a question>",
     "answer": "<the one-line answer>", "answer_placement": "section 1", "summary": "<one sentence>"}`
   - `$P/S/section.prompt.md` (add_section only), DATA ONLY, the Enrichment chapter's shape: one task
     line (answer "<main search>" in the first two sentences, then the listed questions, 120–220 words,
     begin with exactly one "## " heading line — a short topic phrase, not the H1 or page title — then paragraphs only; every backend rejects a draft without it); reader question / answer / placement; a
     **CLOSED FACT LIST** (only facts from pricing_rows, the page itself AFTER your fact-edits, or a
     vendor page you fetched — with the sentence "anything not on this list, you do not know"); a
     **CLOSED URL LIST**; 1–2 internal links from routes.txt with anchor text.
   - `$P/S/allowed-urls.txt` — external URL prefixes from the CLOSED URL LIST (empty file is fine).

4. If `page12.ai_cited` is true, the page is cited by AI assistants: keep every existing fact the
   assistants could be quoting unless it is outdated; prefer additive fixes.

5. Never copy competitor sentences or claims. Never invent a number. Never plan a deletion, slug
   change or redirect.

Return one JSON line per page and nothing else:
`{"slug": S, "lane": "...", "action": "...", "fact_edits": N, "summary": "..."}`.
Budget: about 1–3 minutes per page. Work through the whole batch; do not stop early.
