# Rank-drop fact-fix task — rewrite stale-price SENTENCES, a batch of pages

> **Prices come ONLY from the ledger.** Every price in a CLOSED FACT LIST comes from `pricing_rows` (data/pricing.ts) or a vendor page fetched now — NEVER from `page.ts`/`page.md`, which may be the stale thing being fixed. `apply_sections.py` rejects any draft that states a price disagreeing with the ledger.
> **Current model = newest row of its family.** `pricing_rows` carries every row of each family the page names (e.g. "Claude Opus" → Opus 5.5, 5, 4.8…). A fact list presents the NEWEST row as the current pick; an older version the page names appears only as history ("was"), never as the model to buy. 2026-10-04: the writing page priced Fable 5 vs Opus 4.8 as current, two releases stale.


`apply_data_refresh.py` already swapped every plain rate statement in code. What's left in
`reports/rank-drop/<date>/packets/<slug>/fact-fixes.json` are sentences a number swap would break:
comparisons ("cheaper", "half the input cost", "doubles", "82% higher"), worked examples
("costs $55 total ($25 for input and $30 for output)"), and price-history narratives ("rises to $3 / $15
on Sept 1" — when the ledger says that increase was withdrawn).

These are one-sentence corrections — the content standard allows them in-context. For each page in your
batch, write `<slug>/fact-edits.json`:

```json
{"edits": [{"old": "<the sentence exactly as listed in fact-fixes.json, apostrophes unescaped>",
            "new": "<the corrected sentence>"}]}
```

Rules:
- Facts come ONLY from `fact-fixes.json` → `ledger` (current price + the ledger row's notes). Any
  derived figure (a total, a difference, a percentage, "half", "double") is recomputed from those
  numbers — show your arithmetic in a `"math"` field on the edit.
- Keep the sentence's job, voice, length and citations (`(OpenAI)`, links) — change only what the new
  facts force. If a comparison flips (no longer cheaper), say what is now true; don't keep a false claim.
- A price-history sentence whose event didn't happen (ledger notes say withdrawn/reversed) is rewritten
  to the current fact, e.g. "Sonnet 5 stays at $2 input / $10 output; Anthropic withdrew the planned
  increase."
- If a listed sentence doesn't actually state the stale model's price, leave it out of `edits`.
- No em-dashes in new text, no new claims, no new links.

Return one JSON line per page: `{"slug": "...", "edits": N, "skipped": M}`. Budget: under 1 minute per page.
