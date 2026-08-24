# Phase 3 — New content creation

Act on every **new-content** row in the chart. For each, check the row's `format` column first — it determines what this phase produces:

- **`article` (or no format column / `n/a`)** → write the full article following the content guidance below. This is the only format Phase 3 builds end-to-end.
- **`interactive tool`, `calculator`, `quiz/assessment`, `template`, `comparison table/database`, `glossary/reference`, `data report`** → this phase does **NOT** build the asset. Instead, write a **one-page asset spec** at the route (e.g. `reports/seo-pass/specs/<slug>-spec.md`) containing: (1) the target route/URL, (2) recommended format + rationale from the chart, (3) what the asset does (inputs → outputs for tools/calculators; question flow for quizzes; column schema for databases; data sources for reports), (4) the primary and secondary keywords it targets, (5) word count / scope estimate, and (6) any technical dependencies (e.g. "requires a React component at /components/Calculator.tsx"). `git add` the spec. Phase 4 reviews the spec for completeness; the spec is what ships in this commit so the human can build the asset in a follow-up session. Never write stub/placeholder page content for non-article formats — the spec IS the deliverable.

Wire the route for all rows — article pages get full page files; non-article rows get the spec file at `reports/seo-pass/specs/<slug>-spec.md` plus a `// TODO: implement <format> asset — see spec` placeholder at the target route if a route file is expected by the framework. `git add` your work but do NOT commit — inbound links FROM existing pages are added in Phase 5, and Phase 4 is the gate for this phase.

> **NET-NEW ONLY.** This phase creates brand-new routes. It must NEVER overwrite, regenerate, or replace an existing page, and never run a generator that rebuilds existing content. If a "new-content" row actually points at a route that already exists, do not recreate it — STOP and flag it (it likely belongs in body/metadata, or it was already shipped). Each page here is written by hand to the content standard, not stamped out by a script.

---

## Content standard

**Load `.claude/commands/_content-standard.md` and apply it IN FULL.** It is the single source of truth for the medium gate, SEO and required page elements, depth floors, quality and sourcing, readability, voice and register, comparison, linking, the proprietary anchor, and neutrality. Start with its `## PREFLIGHT` section. There is no cherry-picking and no substituting your own standard.

**Also load `.claude/commands/_experience.md`** — it defines who "we" are on this site and is the ONLY source a first-person experience claim may draw on. If it is missing or its `## DOMAIN` is empty, STOP.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its WRITER section; it outranks the content standard on any conflict.

Anything inline below this block is superseded by the canonical files above.

## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/seo-gsc-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).


