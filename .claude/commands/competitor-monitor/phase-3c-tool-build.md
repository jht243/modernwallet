# Phase 3c — Study + auto-build improved tools (NET-NEW)

For every `tool` candidate (NEW) from Phase 2, build a real, improved interactive tool for this project — not a guide stub. `git add` your work; do NOT commit. Phase 4 (with its tool-logic check) is the gate.

## 1. Study the competitor's tool

From the candidate's `title`, `outline`, and `tool_io` (captured inputs/labels/selects), infer:
- **Purpose / job-to-be-done** (e.g. ROI calculator, savings estimator, readiness quiz, lead-value calculator).
- **Inputs** (fields, units, sensible ranges/defaults) and **outputs** (the metric(s) it computes).
- **The formula / logic** connecting them. `tool_io` is best-effort (some inputs are JS-rendered or are just a contact form) — if the captured inputs look like a generic lead form rather than the tool's real inputs, reconstruct the tool's real inputs/outputs from the topic + your own domain knowledge. If you genuinely cannot determine a defensible formula, **fall back to a guide page** (Phase 3 `page` path) on the same topic and record disposition `published` with that guide route — never ship a calculator with invented math.

## 2. Build it, mirroring the existing tool scaffolding

Study an existing tool/interactive in the project before writing (the route + component pattern Phase 0 found), and mirror it exactly. **If the project has NO interactive-tool mechanism, do NOT invent one — fall back to a guide page (Phase 3 `page` path) on the same topic.** When a tool pattern exists:
- New tool page at the project's tool-route location — same layout/imports/sections and SoftwareApplication JSON-LD as the project's existing tools.
- New component in the project's component location — input state, computed outputs, accessible labels, and clear formula constants (named, commented).
- Intro / explanation / FAQ copy written with the verbatim content prompt from `keyword-gap-pass/phase-3-new-content.md` (substitute `{BUSINESS_NAME}` with the business name discovered in Phase 0).
- **"Improved" = better than the competitor's:** clearer inputs, a more accurate/defensible formula with stated assumptions, a worked example, and an explanation section the competitor lacks. Never name the competitor.

## 3. Wire it up
- Add the route to the project's tools sitemap (Phase 5 confirms; add with today's `lastmod`).
- Add inbound links from the most relevant existing pages (handled in Phase 5).

## Guardrails
- **Formula correctness is mandatory** — Phase 4's tool-logic check will fetch nothing but will read your component, verify the math is sound and assumptions are stated, and `tsc` compiles. Fail → `draft: true`, route excluded.
- 100% original — no copied copy or code from the competitor; only the *idea* of the tool carries over.

Record each tool's intended `our_url` (`/tools/<slug>`) for Phase 6. **Auto-continue to Phase 4.**
