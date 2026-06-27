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

## Prune cross-run cache losers (still free)
Load `reports/comparison-content-creator/cache.json` if it exists. Drop any candidate whose slug or `(optionA, optionB, segment)` key is already recorded there as published or previously rejected. This keeps each run exploring fresh pairs.

## Output
Print the candidate table (optionA, optionB, segment, primaryKeyword, slug) and the count. Hand the full list to **Phase 1b** — do NOT score anything yet, and do NOT call any SEO data tool. Auto-continue.
