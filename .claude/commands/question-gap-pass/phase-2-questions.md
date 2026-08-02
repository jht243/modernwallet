# Phase 2 — Generate 20–30 realistic follow-up questions per page

FREE, local only — **zero external calls.** For each top page from Phase 1, generate the real questions a visitor has **right after** reading that page. This is the demand signal the coverage check scores against in Phase 3.

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

## Output

Write `reports/question-gap-pass/questions.json` keyed by page route: `{ route: [ "question", ... ] }`. Print the Phase Summary (per page: question count) and **auto-continue to Phase 3**.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The one human stop is the Phase 3 Gap Chart gate. This phase is NOT it. Start Phase 3 in the same turn.
