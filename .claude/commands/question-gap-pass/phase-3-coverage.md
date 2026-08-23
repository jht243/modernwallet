# Phase 3 — Coverage scoring + cross-page dedup → Gap Chart → ‼️ THE ONE HUMAN GATE

This is the core. For every follow-up question from Phase 2, decide whether the page answers it, whether another page already answers it, and how valuable it is — then assemble the **Gap Chart** and STOP for human approval. FREE, local only (re-reading site content, zero external calls).

## Step 1 — Coverage: score each question against ITS page

Open the page's **actual source content** (not the title, not your memory of it). For each follow-up question, assign exactly one:

- **`✅ clear`** — the page answers it directly and completely. A reader gets the answer without leaving. (Cite the section/heading where.)
- **`🟡 partial`** — the topic is touched but the answer is implicit, buried, vague, or incomplete. A reader would still wonder.
- **`🔴 missing`** — the page does not answer it at all.

Be strict: "mentioned in passing" is `partial`, not `clear`. The bar for `clear` is *a visitor would not need to search again.*

## Step 2 — Dedup: is a `missing`/`partial` question already answered ELSEWHERE on the site?

For every `🔴 missing` and weak `🟡 partial`, check it against the **full content URL set** Phase 0 cataloged (other guides, pages, FAQs). Use slug/H1/topic matching and read the candidate page if unsure.

- If another page **answers it well** → record that route in **Answered elsewhere?**. The action becomes **`Link`**: the fix is an internal link from this page to the one that already answers it — **never re-write the answer here.** Duplicating an answer across two pages cannibalizes both; linking concentrates authority and is the correct, deliberate choice.
- If **no** page answers it → `Answered elsewhere? = —`; it's a real site-wide gap eligible for a new section.

## Step 2b — Weight by where the question came from

Phase 2 tags every question `paa` / `related` / `generated`. That tag is evidence, so it changes the ranking:

- **`paa` questions are measured demand** — Google published them because people ask them. At equal Value, a `paa` question outranks a `generated` one, and a `paa` question is never dropped as "low value" on a hunch.
- **`generated` questions are inference.** Keep them, but when the chart has to be trimmed, they are what gets trimmed first.
- **A `🔴 missing` question whose answer Google is citing from a competitor** (the page's `ai_overview_cited_domains` from Phase 2) is automatically **High** value — Google is answering our visitors from someone else's page. Name the cited domain in the chart's evidence cell.
- **If the SERP came back `forum_dominated`**, note it on the page's rows: the enrichment must read as lived experience, not vendor explanation, or it will not win the click even once it ranks.
- **If a `featured_snippet` exists**, the enrichment for that page's top question should match its shape (definition block / numbered steps / table).

Rows whose page returned `"verdict": "unread"` carry no SERP evidence — mark them so the reader knows the page was ranked on generated questions alone.

## Step 3 — Value: rank each question's worth

Score `Value` using the service/lead mapping from Phase 0:
- **`High`** — gates a real decision or conversion: cost, "is it right for me", "what can go wrong", access/security, time-to-result, maintenance ownership. The questions a buyer must resolve before acting.
- **`Med`** — useful context that improves the page but doesn't gate action.
- **`Low`** — trivia, edge cases, or things only a tiny fraction of visitors ask.

## Step 4 — Decide the Action per question

Apply top to bottom; first match wins:

| Condition | Action |
|---|---|
| `✅ clear` | `Skip — already clear` |
| answered elsewhere (Step 2 found a page) | `Link` |
| `🔴 missing` (or weak `🟡 partial`) **and** `Value = High` **and** not elsewhere | `Add section` |
| `🟡 partial` **and** `Value = High` **and** not elsewhere | `Strengthen` (tighten the existing answer in place) |
| anything else (`Value` Med/Low, not elsewhere) | `Skip — low value` |

**Add ONLY high-value missing sections** (global rule 4). Med/Low-value gaps are recorded in the chart for transparency but not acted on — quality of additions over quantity. A typical page should yield a handful of `Add`/`Strengthen` actions, not 20.

## Step 5 — Assemble + print the Gap Chart (MANDATORY, every run)

Print one block per page, in GSC-rank order, using the exact format from the orchestrator:

```
### <Page title> — <route>   (GSC: <clicks> clicks / <impressions> impr, last <window>)
| # | Follow-up question | Coverage | Answered elsewhere? | Value | Action |
...every question, including skipped ones...
→ Add: <n> · Strengthen: <n> · Link: <n> · Skip: <n>
```

Then a run-total line: `TOTAL across <P> pages — Add: <A> · Strengthen: <S> · Link: <L> · Skip: <K> (of <G> questions).`

Write the full chart + the action list (page, question, action, target file, "answered elsewhere" route) to `reports/question-gap-pass/gap-chart.md`. Append analyzed pages + planned additions to `reports/question-gap-pass/cache.json` (so re-runs don't re-suggest a section a prior run added — check this cache before proposing `Add`/`Strengthen` and drop anything already filled).

## ‼️ Step 6 — THE ONE HUMAN GATE — STOP HERE

After printing the chart, STOP and ask the user to approve the planned actions, in these words or similar:

> Here's the gap analysis across the top <P> pages. Planned: **<A> sections to add**, **<S> to strengthen**, **<L> internal links**. Approve all, or tell me which rows to strike (e.g. "drop page X row 4, skip all Strengthen") and I'll run enrichment → audit → push.

Do **not** edit any page until the user replies. Do **not** print "Continuing to Phase 4". This is the single editorial checkpoint — it's cheap here and expensive after writing. Once the user approves (in full or with strikes), proceed through Phases 4→5→6 end-to-end with no further stops, acting only on the approved rows.
