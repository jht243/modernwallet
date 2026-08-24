# Phase 4 — Enrich pages in place (approved actions only)

Execute the actions the user approved at the Phase 3 gate — and **only** those rows. `git add` your work but do NOT commit (Phase 6 stages). Phase 5 is the gate for this phase.


## Content standard

**Load `.claude/commands/_content-standard.md` and apply it IN FULL.** It is the single source of truth for the medium gate, SEO and required page elements, depth floors, quality and sourcing, readability, voice and register, comparison, linking, the proprietary anchor, and neutrality. Start with its `## PREFLIGHT` section. There is no cherry-picking and no substituting your own standard.

**Also load `.claude/commands/_experience.md`** — it defines who "we" are on this site and is the ONLY source a first-person experience claim may draw on. If it is missing or its `## DOMAIN` is empty, STOP.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its WRITER section; it outranks the content standard on any conflict.

Anything inline below this block is superseded by the canonical files above.

> **‼️ NOT NET-NEW, NOT A REGENERATION.** This phase never creates a route and never rebuilds a page. It edits each existing top page in place, adding only the approved missing answer. Everything else on the page stays byte-for-byte unchanged.

## What you act on
The approved action list from `reports/question-gap-pass/gap-chart.md`, each carrying: the page route + source file, the follow-up question, the action (`Add section` / `Strengthen` / `Link`), and — for `Link` — the target route that already answers it.

## Writing standard — REUSED VERBATIM
Any prose you write for an `Add section` or `Strengthen` action MUST follow the **exact, full text** of `.claude/commands/seo-gsc-pass/phase-3-new-content.md`. Load that file and apply it character-for-character. The only permitted change is swapping the literal `{BUSINESS_NAME}` token for the business name discovered in Phase 0. Append the per-question gap description around the verbatim block; never paraphrase the standard. (Key consequences you must honor: plain-factual voice, no hype, AEO opener — the first sentence of the new section is a complete, self-contained declarative answer; E-E-A-T and first-party sourcing; no fabricated facts.)

## Enrichment discipline — REUSED VERBATIM from `.claude/commands/keyword-gap-pass/phase-5-body.md`
> **‼️ HARD RULE — the operating discipline for the edit. Follow it character-for-character; do not loosen it into "regenerate the section."**

Update the body text now, but I don't want you to totally recreate the page using scripts. I'd like you to keep the same page, but update it with your suggestions you identified prior. DO NOT recreate the page via script, only make updates where needed.

Make the edits in place (targeted `Edit` operations on the existing file), preserving everything not called out by the action item.

## What each action means

**`Add section`** — add a focused answer to the missing question:
- Prefer the page's **existing FAQ block** if it has one: append a new Q/A entry using the question as the heading, answer in 1–3 tight sentences (AEO opener first). If the page emits **FAQPage JsonLd**, add the entry to the schema too — don't leave the visible Q/A out of the structured data.
- If there's no FAQ block, add a short **H2/H3 sub-section** titled as the question, with a complete answer in 2–4 sentences. Place it where it flows (e.g. a "cost"/"how it works"/"risks" question near related content).
- Keep it tight — one question, one answer. Do not balloon the page.

**`Strengthen`** — the page partially answers it: tighten the **existing** passage in place so the answer is now complete and extractable (lead with the direct answer). Do not add a duplicate section; edit the sentence(s) that were vague.

**`Link`** — another page already answers it: add a single in-context internal link from this page to that page (natural anchor text near the relevant content). **Do not re-answer the question here.** If a suitable link already exists, record "already linked — skipped."

## Discipline / guardrails (check before handing to Phase 5)
- **Targeted `Edit` only.** Insert into the existing object/MDX/CMS field in place. Never overwrite the file wholesale, never invoke a generator/script that rebuilds the page.
- **Use the project's REAL body field key** (Phase 0 recorded it — e.g. `content:`, not an invented `body:`). A wrong key renders the section empty and `tsc` won't catch it in a loosely-typed store. Grep the surrounding objects and match.
- **Re-check coverage LIVE first.** The page may have improved since Phase 3 (or a prior run filled it — check `cache.json`). If it now already answers the question, **skip** that item and record "already covered — skipped." Don't double-add.
- **Match the page's existing structure + schema + voice.** Mirror its heading style, FAQ shape, and JsonLd conventions.
- **No fabricated facts** — prices, durations, certifications, security claims, stats are accurate or hedged with a range pointing to the primary source, never invented to complete an answer.
- **No new route, no sitemap `<url>` add** — the page already exists. Phase 6 only bumps its `lastmod`.

`git add` your edits. Do not commit. Auto-continue to Phase 5 (the gate covers every enriched page).

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The user already approved at the Phase 3 gate. The moment Phase 5's reviewer gate PASSES, continue in the SAME turn. Do not print "Want me to proceed?" or any question that waits for a human reply.


