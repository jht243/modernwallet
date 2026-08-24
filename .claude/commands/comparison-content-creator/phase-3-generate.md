# Phase 3 — Generate the selected comparison pages

Create a brand-new comparison page for **each selected pair** from Phase 2, in the project's discovered content format. `git add` your work but do NOT commit — Phase 5 publishes. Phase 4 is the gate for this phase.

> **NET-NEW ONLY.** This phase creates brand-new routes. It must NEVER overwrite, regenerate, or replace an existing page, and never run a generator that rebuilds existing content. If a selected pair actually points at a route that already exists (Phase 1b should have caught it), do not recreate it — STOP and flag it as an "enrich existing page" item for Phase 6.

> **Reuse project scripts if present.** If Phase 0 found a project generator for comparisons (e.g. `scripts/model_radar/generate.py:gen_comparison`), you may use it — but the content must still meet the standard below and pass Phase 4.

---

## Content-generation prompt — REUSED VERBATIM from `.claude/commands/seo-gsc-pass/phase-3-new-content.md`

> **‼️ HARD RULE — PASS THIS PROMPT VERBATIM.** Whether you write the page yourself or dispatch a generation subagent, the writing instruction MUST be the **exact, full text below, copied character-for-character**. Do NOT paraphrase, summarize, condense, or "capture the substance" of it — a paraphrase is a spec violation. If you spawn a subagent per pair, paste the entire block (from "## Content standard

> **HOW TO LOAD (MANDATORY — this is the only sanctioned way).** Run:
> `bash .claude/tools/load-standards.sh "<routine-name>" "<this-phase>"`
> and treat its ENTIRE output as the standard. The script prints `_content-standard.md`, `_anti-ai-language.md`, and `_experience.md` in full and appends the load receipt to `reports/standards-ledger.jsonl` in the same action — reading and proving-you-read are one step, so never open the files another way. `git add reports/standards-ledger.jsonl` with the run. If the script or any file is missing, STOP and report it.

**Load `.claude/commands/_content-standard.md` and apply it IN FULL.** It is the single source of truth for the medium gate, SEO and required page elements, depth floors, quality and sourcing, readability, voice and register, comparison, linking, the proprietary anchor, and neutrality. Start with its `## PREFLIGHT` section. There is no cherry-picking and no substituting your own standard.

**Also load `.claude/commands/_experience.md`** — it defines who "we" are on this site and is the ONLY source a first-person experience claim may draw on. If it is missing or its `## DOMAIN` is empty, STOP.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its WRITER section; it outranks the content standard on any conflict.

Anything inline below this block is superseded by the canonical files above.

## Successor vs predecessor pages (MANDATORY when the pair is same-line, added 2026-07-28)

For every `versus` page whose two options are the **same product line at different generations** (`Claude Opus 5 vs Claude Opus 4.8`, `Grok 4.5 vs Grok 4.3`, or any new-version-vs-prior-version pair — see the matching lane in `phase-1-candidates.md`):

1. **Lead with what actually changed.** A "what changed" / "what's new" section is mandatory: capability, speed, context window, reliability, availability. Ground every claim in the vendor's own announcement or the site's existing data — never in training memory.
2. **Price the upgrade explicitly.** State both versions' prices side by side and name the relationship in plain words: unchanged (a same-price capability bump is the strongest upgrade case), higher, lower, or an introductory window with its end date. A same-price successor MUST say so — it is the whole decision.
3. **Never assume newer = better.** If the successor is worse on any axis a buyer cares about (higher price, smaller context, narrower availability, unproven stability), that trade-off goes in the comparison table AND the verdict. A successor page that reads as pure marketing for the new version is a failed page.
4. **Verdict = upgrade / wait / run both.** Say who should move now, who should stay on the prior version (validated pipelines, budget, long-context needs), and how to route across both during migration. Recommend re-running the reader's own evals before a full cutover.
5. **Own the alias cluster:** both versions' query forms in headings/body/FAQ, including ≥1 FAQ in the REVERSED order (`{prior} vs {new}`), plus the `is {new} worth it` phrasing. Never a thin duplicate page for an alias.


