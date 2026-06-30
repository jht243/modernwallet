# Phase 3 — Generate improved original content (+ enrich PARTIALs)

For every surviving candidate from Phase 2, produce an **original, improved** page for this project. The competitor's `outline` (and `tool_io` for tools, handled in Phase 3c) is the **minimum coverage/structure floor** — our page must cover everything they cover and beat it. `git add` your work but do NOT commit (Phase 5 stages). Phase 4 is the gate.

> **`tool` candidates are NOT handled here** — they go to Phase 3c. This phase handles `page` (→ guide) and `comparison` (→ comparison page) candidates only.

## Route each candidate to the reused generator

- **`page` (NEW)** → write a new **guide** using the VERBATIM content-generation prompt in `.claude/commands/keyword-gap-pass/phase-3-new-content.md` (the `<!-- CRON_PROMPT_START -->…<!-- CRON_PROMPT_END -->` block). Substitute `{BUSINESS_NAME}` with the business name discovered in Phase 0. Add the new page to the project's content store in its exact discovered format/schema.
- **`comparison` (NEW)** → write a new comparison/alternatives page using `.claude/commands/comparison-content-creator/phase-3-generate.md` (same verbatim prompt + the comparison-table/verdict/FAQ requirements). Add it to the project's comparison content store in its discovered format.
- **`PARTIAL` (either kind)** → do NOT create a new route. Enrich the existing page for this project in place using `.claude/commands/comparison-content-creator/phase-3b-enrich.md` → `.claude/commands/keyword-gap-pass/phase-5-body.md`, adding only what the competitor's `outline` covers that we're missing.

Follow the **medium-determination sub-step (3.0)** in those files first (text/chart/data; image/video → text).

## The competitor coverage floor (the one net-new generation input)

When you dispatch the verbatim content prompt for a candidate, append — as an ADDITIVE instruction, never a modification of the verbatim block — the following, filled from the candidate:

```
COVERAGE FLOOR — a competitor (<competitor_name>) published a page on this topic:
  Title: <title>
  Section outline (H2/H3): <outline as a bullet list>
Your page MUST cover every topic in this outline and beat its depth and usefulness.
Treat this outline only as a checklist of topics to exceed.
‼️ Write 100% ORIGINAL prose. Do NOT copy, paraphrase sentence-by-sentence, or mirror
the competitor's wording. Add information gain they do not have (a first-hand operational
detail, an SMB-specific failure mode, a non-obvious tradeoff, or a decision criterion).
Never reference or name the competitor on the page.
```

> **Never fetch-and-store competitor HTML into the repo.** Use only the `outline`/`title` already captured in the candidate. If you must look at the live competitor page to understand the topic, read it transiently — never paste its text into our content.

## Guardrails (from the reused files — do not skip)
- **NET-NEW only** for NEW candidates; never overwrite/regenerate an existing route. Re-check live slugs before insert (a page may have been added since Phase 0).
- Use the project's **exact data-file field keys** (grep an existing entry); a wrong key renders a section empty and `tsc` won't catch it.
- **Every emitted record MUST include an `inlineCta`** (`{ text, buttonLabel, buttonHref }`) — a tailored, two-sentence consultation nudge that NAMES the page's actual subject (model/tool/vertical/workflow); a generic line that fits any page is a spec violation. `buttonLabel` default `"Book a Consultation"`, `buttonHref` always `"/ai-workflow-audit"`. Missing it falls back to a generic default.
- Match the discovered page template + schema builders (JsonLd/FAQ/breadcrumb).

Record each item's intended `our_url` (route) for Phase 6's ledger `record`. **Auto-continue to Phase 3c, then Phase 4.**
