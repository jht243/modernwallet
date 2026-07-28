# Phase 1 — Candidate generation (FREE — local only, zero API calls)

Build the universe of candidate "X vs Y" comparison articles from the entities Phase 0 discovered. **No external API calls in this phase** — this is deliberate: dedup is cheap and must happen before any paid keyword research.

## Generate candidate pairs

From the grouped entity list, form all plausible pairs:
- **Same-type head-to-heads:** tool vs tool, platform vs platform, model vs model (only pairs that a real buyer would actually weigh against each other — same category, comparable use case). Skip nonsense pairs (e.g. a CRM vs an accounting tool) unless the site's audience genuinely compares them.
- **Category / approach pairs:** conceptual comparisons the business's buyers face (e.g. AI agent vs chatbot, build vs buy, consulting vs in-house, managed vs DIY).
- **`X vs Y for [segment]` long-tail:** cross any strong pair with an audience segment/vertical from Phase 0 (e.g. "X vs Y for law firms"). These are lower-competition and high-intent — favor them, especially where the segment maps to a service the business sells.

## For each candidate, attach
- **`optionA`, `optionB`** — the two entities (canonical display names).
- **`segment`** — the vertical/audience, or `null` for a general comparison.
- **`primaryKeyword`** — the natural search phrase, e.g. `"zapier vs make for accounting"` or `"ai agent vs chatbot"`. Use the phrasing a real searcher would type.
- **`slug`** — per the project's discovered convention (e.g. `optiona-vs-optionb[-for-segment]`), lowercased and hyphenated.

## MANDATORY lane — successor vs predecessor (same product line, added 2026-07-28)

Whenever a candidate subject is a **NEW VERSION / GENERATION that replaces an earlier one** — an AI model (`Claude Opus 5` after `Opus 4.8`, `GPT-6` after `GPT-5.6`), but equally a device model-year, a software major version, or a re-issued product line — the candidate set MUST include the same-line comparison **`{new} vs {the immediately prior version}`**, provided the predecessor is already covered on the site.

**Why this is its own mandatory lane:** cross-brand matrices deliberately skip the releasing brand's own models, so without this lane the prior-generation comparison is never produced by anything. Layer3 shipped Claude Opus 5's entire page set — explainer hub, five industry verticals, four cross-vendor matchups — with **no `Opus 5 vs Opus 4.8` page at all** (caught 2026-07-28); the generator even carried a comment claiming it was "covered upstream" when no such candidate existed. `{new} vs {old}` / "what changed" / "is the upgrade worth it" is the single most reliable release-day query, and it was structurally unreachable.

- **Same LINE only.** The predecessor is the version this release directly succeeds. A sibling at the same generation, a different family from the same brand, or a rival's product is NOT a predecessor — those are separate cross-brand candidates. A NEWER version is never a predecessor.
- **Ground it, never infer it.** Emit the candidate only when the predecessor genuinely exists AND already has a page. Never invent a lineage, a version number, or a release order. If you cannot confirm the predecessor from a real source, emit nothing.
- **Report the honest delta, including when it is unflattering.** The upgrade is not always a win: a same-price capability bump (Opus 5 vs 4.8 — identical $5/$25), a real trade-off (Grok 4.5 costs MORE and has LESS context than 4.3), or a temporary intro-price window (Sonnet 5). Never write a successor page that assumes "newer = strictly better".
- **Verdict shape = upgrade / wait / run both** — who should move now, who should stay on the prior version, and how to route across both during a migration.
- **One page owns the cluster:** weave both names' query variants into headings/body/FAQ plus ≥1 FAQ in the REVERSED order (`{prior} vs {new}`). Never a thin alias duplicate.

## Prune cross-run cache losers (still free)
Load `reports/comparison-content-creator/cache.json` if it exists. Drop any candidate whose slug or `(optionA, optionB, segment)` key is already recorded there as published or previously rejected. This keeps each run exploring fresh pairs.

## Output
Print the candidate table (optionA, optionB, segment, primaryKeyword, slug) and the count. Hand the full list to **Phase 1b** — do NOT score anything yet, and do NOT call any SEO data tool. Auto-continue.
