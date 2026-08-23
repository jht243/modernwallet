# Phase 2 — Collect the real follow-up questions per page (PAA first, generated second)

For each top page from Phase 1, assemble the questions a visitor has **right after** reading that page. This is the demand signal the coverage check scores against in Phase 3.

**Two sources, in this order — and the first one is not optional.**

## ► Step 0 (RUN FIRST) — pull the REAL questions from Google

Google publishes what people actually ask next: the `people_also_ask` block on the page's own SERP. Those are real queries from real searchers. Everything in Step 1 below is a model *guessing* at that list. **Always read the real one first.**

Build a `route<TAB>query` pairs file — one line per page from `reports/question-gap-pass/pages.json`. The query is **the page's top GSC query** if Phase 1 captured it; otherwise the page's H1 phrased the way a searcher would type it (not the marketing title):

```bash
# reports/question-gap-pass/pairs.tsv  —  route<TAB>query
python3 scripts/lib/serp.py paa \
  --pairs-file reports/question-gap-pass/pairs.tsv \
  --out reports/question-gap-pass/serp.json --cap 12
```

Cost is ~$0.004 per page (~$0.05 for a 12-page run). Each page comes back with `paa`, `related_searches`, `verdict`, `forum_dominated`, `ai_overview_present` + `ai_overview_cited_domains`, `featured_snippet` and `recommended_shape`.

**Three things to carry forward into Phase 3, not just the questions:**
- **`ai_overview_cited_domains`** — the domains Google quotes instead of us for this page's own query. A question whose answer is being cited from a competitor is a HIGH-value gap, not a Med one.
- **`featured_snippet`** — if one exists, the winning answer format is already visible. The enrichment should match that shape (definition block, numbered steps, table).
- **`forum_dominated`** — a Reddit/Quora-owned SERP means visitors want lived experience, not another vendor explanation. Say so in the Gap Chart so Phase 4 writes accordingly.

**If the SERP read fails** (no credentials, budget cap, API error) the route comes back with `"verdict": "unread"` and an `error`. Do NOT stop — fall through to Step 1 alone for that page and label its questions `source: generated` so the Gap Chart shows which pages had no real data behind them.

## Step 1 — Generate the rest locally

FREE, local only — **zero external calls.** PAA gives 4–8 questions per page; a page needs 20–30 for real coverage breadth. Generate the remainder to fill the intent buckets PAA did not touch.

> Think like the visitor, not the marketer. They just learned what the page teaches; now they want to act. From a page like "AI consulting for small business" the follow-ups are: *How much does it cost? What should I automate first? Consultant vs agency? How long does implementation take? What access does the consultant need? Can it connect to my CRM? Who maintains it afterward? What can go wrong?* Generate that, for every page.

## How to generate

For each page, read its actual content (Phase 1 mapped the source) and produce **20–30 distinct follow-up questions**. Pull from these intent buckets so the set is broad, not just rephrasings of the H1:

- **Cost / pricing** — "how much does it cost", "what's the cheapest way", "is there a free tier", "hidden fees".
- **Time / effort** — "how long does it take", "how much work on my side", "how fast will I see results".
- **Decision / comparison** — "X vs Y", "do I need this if I already have Z", "which option for my situation".
- **Process / how-it-works** — "what are the steps", "what do I need to prepare", "what access/data is required".
- **Risk / failure** — "what can go wrong", "is it safe/secure", "what if it breaks", "common mistakes".
- **Maintenance / after** — "who maintains it", "what happens after launch", "can I do it myself later".
- **Eligibility / fit** — "is this right for my size/industry", "what are the requirements", "does it work for [segment]".
- **Proof / trust** — "does it actually work", "examples/results", "how is it measured".

Rules:
- **Real phrasing.** Write each question the way a person types or speaks it — short, natural, one question per line. These double as candidate FAQ headings and AEO query targets.
- **Specific to the page's topic**, not generic. Bind each question to the page's actual subject (the segment, product, or service it covers).
- **No duplicates within a page.** Merge near-identical phrasings into one canonical question.
- **Don't pre-judge coverage here.** Generating a question the page already answers is fine — Phase 3 sorts answered from missing. Your job is breadth of real demand.

## Step 2 — Merge, PAA first

Use the shared merge so the collision rule is applied consistently, never by eye:

```python
import sys; sys.path.insert(0, "scripts/lib")
from serp import merge_questions
merged = merge_questions(generated=my_questions, paa=serp[route]["paa"],
                         related=serp[route]["related_searches"])
```

The rule it enforces: **when a generated question restates a PAA question, the PAA phrasing wins and the generated one is dropped** — Google's wording is what real visitors type, so it is the better FAQ heading and the better AEO target. PAA questions sort first.

## Output

Write `reports/question-gap-pass/questions.json` keyed by page route, with each question tagged by origin:

```json
{ "/guides/example": [
    {"question": "How much does AI cost per month?", "source": "paa"},
    {"question": "Who maintains it afterward?",      "source": "generated"} ] }
```

`source` is `paa` (real, from Google), `related` (a question-shaped related search), or `generated` (model-written). Phase 3 ranks `paa` above `generated` at equal value, because one is measured demand and the other is inference.

Print the Phase Summary — per page: total questions, how many were real PAA, and the SERP verdict — plus the SERP cost line, and **auto-continue to Phase 3**.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The one human stop is the Phase 3 Gap Chart gate. This phase is NOT it. Start Phase 3 in the same turn.
