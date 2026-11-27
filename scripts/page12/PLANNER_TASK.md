# Page 1-2 no-clicks planner task — a BATCH of pages, files only

> **Why these pages:** Google already shows each one on page 1–2 for real searches, and almost nobody
> clicks. SNIPPET lane (#1–10): searchers see it and pick someone else → fix what they see (title,
> description, the opening, and missing internal decision proof) and any wrong fact. RANK lane (#11–20):
> nobody looks at page 2 → answer faster than the page-1 results and add decision-grade scenario math
> so Google moves it up. Never chase a navigational search.

> **New content follows the mindmap-pass system — no exceptions.** Any reader-facing body addition longer
> than ONE sentence is generated via `content_gen.py section` (Enrichment chapter of `.claude/commands/_content-generation.md`).
> Only these are written by you in-context: `metaTitle`, `metaDescription`, a single corrected sentence
> (`fact-edits.json`), and an optional 1–2 sentence `reviewer_note` (`Publisher's Take` / `Editor's Note`).

> **Date honesty (NO fake freshness / NO backdating):** Never touch `publishedDate` or invent date edits.
> `apply_sections.py` bumps the visible updated date ONLY when a substantive section (`add_section`) or
> verified `FACT FIX` ships — never on `meta_only` or `reviewer_note`-only updates.

You plan fixes for the pages in your batch. You **do not edit the repo's data files, do not write body
sections by hand, do not touch `.claude/`, and do not commit**. Code does the rest (`generate_all.sh`
writes prose through `content_gen`, `apply_sections.py` splices, registers `reviewer_note`, and commits).

P = `reports/page-1-2-no-clicks/<date>/packets`. Read ONCE for the batch: `$P/writer-rules.md` (INTENT,
LINKS, ANCHOR, anti-AI WRITER parts), `.claude/reviewer-voice-profile.json` (if it exists in the repo),
and grep `$P/routes.txt` (don't print it).

For each slug S in your batch:

0. Read `$P/S/diagnosis.json` FIRST (`lane`, `level`, `fact_check`, `evidence`, `evidence.internal_proof_gap`),
   then `$P/S/packet.json` and `$P/S/serp.json`. Open `$P/S/page.md` for the page's current text.

1. **Facts first — the whole page (when `fact_check` is true, or you notice an outdated figure anywhere).**
   - Model API prices: use ONLY `pricing_rows` (`data/pricing.ts`). The newest row of a family is the
     current model; an older version is history.
   - Any other product's price, plan name, limit, or spec: WebFetch the vendor's OWN official page
     (pricing page, official docs, or official spec sheet — never a reseller, review site, or SERP snippet).
     If unreadable, do NOT guess — record `fact-unverified` in `summary`.
   - **Amazon `/gear/` & hardware rule (`internal_proof_gap.amazon_no_price == true`):** NEVER write or
     update Amazon dollar prices (`$`). Ground facts strictly in manufacturer physical specs, dimensions,
     weights, capacities, or operating limits.
   - For EVERY sentence on the page that states a verified outdated or wrong fact, write an exact old → new
     pair in `$P/S/fact-edits.json`:
     `{"summary": "<one line: what was outdated, per which source>", "edits": [{"old": "<exact sentence>", "new": "<corrected sentence>", "source": "<official vendor URL>", "quote": "<exact vendor proof>", "math": "<if any>"}]}`

1b. **FACTS lane (`diagnosis.lane == "FACTS"`, a top page — GA4 top 30 or 100+ clicks/month):** do step 1
    only. Write `fact-edits.json` for verified outdated facts and `plan.json` with
    `{"slug", "lane": "FACTS", "action": "no-fix", "summary": "<facts corrected, or none needed>"}`.
    NEVER plan a title, description, section, link, or reviewer note change on a FACTS-lane top page.

2. **Decide the fix by lane + `evidence.internal_proof_gap`:**
   - **L3 METADATA (SNIPPET lane):** rewrite `metaTitle` (≤ 60 chars) and `metaDescription` (≤ 160 chars)
     around the MAIN search's wording and what that searcher wants to know first. On a non-Amazon price/plan
     search, put the current verified price in the description. Never make a claim the page doesn't support.
   - **L4 SECTION (answer + internal-proof block):** placed FIRST (`insert_before` = the id of the page's
     current first section in `packet.sections`, or its exact `heading` when `id` is null).
     - **When `evidence.internal_proof_gap` is present on a commercial/product page:**
       Plan a **180–240 word** section (`action: "add_section"`) that:
       1. Answers `<main search>` directly with concrete verified figures/specs in sentences 1–2.
       2. Walks through a **three-scenario cost, workload, or spec breakdown** grounded 100% in the
          CLOSED FACT LIST (include a compact 3-row Markdown pipe table when comparing 3 concrete tiers,
          team sizes, usage volumes, or hardware operating profiles; zero `$` prices if `amazon_no_price`
          is true!).
       3. States an explicit **break-even counterexample** naming when a reader should skip the primary
          option or choose a cheaper/simpler alternative instead, plus answers any `paa_not_answered`.
       4. Includes a natural contextual link to a matching site calculator/tool from
          `internal_proof_gap.matching_calculators` (when non-empty and relevant to the topic).
     - **When `evidence.internal_proof_gap` is absent (non-commercial informational page):**
       Plan a **120–200 word** direct answer block answering `<main search>` in sentences 1–2 and covering
       `evidence.paa_not_answered`, with 1–2 internal links from `routes.txt`.
   - **Publisher's Take / Editor's Note (`reviewer_note` in `plan.json`):**
     When `internal_proof_gap.missing_publishers_take` is `true` (meaning `.claude/reviewer-voice-profile.json`
     exists on this non-medical site and this route has no note yet), include `"reviewer_note"` in `plan.json`
     (whether `action` is `"add_section"` or `"meta_only"`!):
     - Write 2 crisp, natural editorial sentences (22–55 words total) giving a sharp, decision-useful
       takeaway on who should pick what and when to walk away.
     - **Numbers are optional** inside `reviewer_note` — never force awkward statistics into the note.
     - Zero em-dashes (`—` or ` -- `), zero AI clichés, and never mention `"Dapper Labs"`.

3. **Write**:
   - `$P/S/plan.json` — `{"slug", "lane": "SNIPPET"|"RANK", "action": "add_section"|"meta_only"|"no-fix",
     "section_id": "<new kebab id>", "insert_before": "<first section id, or its heading text when id is null>",
     "meta": {"metaTitle": "…", "metaDescription": "…"},
     "reviewer_note": "<optional 2-sentence Publisher's Take when missing_publishers_take is true>",
     "reader_question": "<the main search as a question>", "answer": "<the one-line answer>",
     "answer_placement": "section 1", "summary": "<one sentence>"}`
   - `$P/S/section.prompt.md` (`add_section` only), DATA ONLY:
     - Task line specifying exact word range (`180–240 words` when `internal_proof_gap` is present, else
       `120–200 words`), starting with one noun-phrase `## ` heading, answering `<main search>` in the first
       two sentences, presenting the 3-scenario breakdown (and optional 3-row Markdown pipe table when
       `internal_proof_gap` is present), ending with an explicit break-even counterexample, and weaving in
       the matching calculator link when provided.
     - **CLOSED FACT LIST** (verified vendor pricing/specs + explicit scenario math computed by you, with
       `"anything not on this list, you do not know"` — and `"ZERO dollar prices ($)"` if `amazon_no_price`).
     - **CLOSED URL LIST** + 1–2 internal links from `routes.txt` (including the matching calculator route
       from `internal_proof_gap.matching_calculators` when relevant).
   - `$P/S/allowed-urls.txt` — external URL prefixes from the CLOSED URL LIST (empty file is fine).

4. If `page12.ai_cited` is true, keep every existing accurate fact AI assistants may quote; make additive fixes only.
5. Never copy competitor sentences. Never invent a number. Never reference `"Dapper Labs"`. Never plan a deletion, slug change, or redirect.

Return one JSON line per page and nothing else:
`{"slug": S, "lane": "...", "action": "...", "fact_edits": N, "has_reviewer_note": true|false, "summary": "..."}`.
