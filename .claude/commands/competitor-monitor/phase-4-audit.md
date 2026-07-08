# Phase 4 — Adversarial audit (+ no-plagiarism + tool-logic)

This phase IS the gate for Phase 3, 3b-enrich, and 3c. Run as an **Agent tool, `subagent_type: Explore`, read-only** reviewer that did NOT write the content.

## 1. Reuse the comparison/keyword audit VERBATIM

Apply `.claude/commands/comparison-content-creator/phase-4-audit.md` in full — the verbatim audit sentence plus its comparison-specific, enrichment-specific, and advisory checks (metadata length, FAQ JSON, schema.org, internal links resolve, no fabricated facts, net-new only, correct content-array key).

## 2. ADD: competitor no-plagiarism / must-improve check (this skill's highest risk)

For each generated/enriched page, the reviewer must also confirm:
- **No reproduced text.** The reviewer transiently reads the competitor source URL (from the candidate) and confirms **no sentence or passage is copied or near-paraphrased** from it. Any reproduced passage → **FAIL**.
- **Information gain present.** Our page adds ≥1 element the competitor's `outline` does not have (first-hand operational detail, SMB-specific failure mode, non-obvious tradeoff, or decision criterion). If it merely restates the competitor's coverage in different words → **FAIL**.
- **Coverage floor met.** Our page covers every topic in the competitor's `outline` (or better). Material gaps → **FAIL** (rework to add the missing topic).
- **Competitor not named** on the page → if named, **FAIL**.
- Competitor HTML/text was **not** committed into the repo → if present, **FAIL**.

## 3. ADD: tool-logic correctness check (for Phase 3c tools)

For each built tool, the reviewer reads the tool page + its component and confirms:
- **The formula is mathematically sound** and produces sensible outputs across the input range (spot-check 2–3 input sets by hand).
- **Assumptions are stated** on-page (no hidden magic constants; named, commented formula constants).
- **`npx tsc --noEmit` compiles** and the component has no obvious runtime error (undefined state, division-by-zero on default inputs, NaN outputs).
- Uses `buildSoftwareApplicationSchema` JsonLd like the existing tools.
Any failure → **FAIL** (rework, or fall back to a guide page per Phase 3c).

## Rework + escalation
On failure, hand specific notes back to the relevant writer logic (Phase 3 for a page, 3b for an enrichment, 3c for a tool) and re-run. **Max 2 rework attempts**, then escalate:
- **net-new page/tool** → mark `draft: true` (noindex, excluded from sitemap + IndexNow), record the reason, continue.
- **enrichment edit** → revert that file (`git checkout -- <file>`), record the reason, continue.

One failing item never blocks the others. Record the pass/draft outcome per item for the email. **Auto-continue to Phase 5.**


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** if THIS project auto-links entities at render time (an ENTITY_LINKS-style registry — check `src/utils/` or the templates before writing), those registered entities must stay PLAIN TEXT to avoid double-linking; **check the registry — never assume an entity is in it.** If the project has no auto-linker, or the entity is not registered, hand-link it inline. If an entity will recur across many pages and the project HAS a registry, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by a render-time auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.
