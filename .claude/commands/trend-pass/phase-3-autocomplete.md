# Phase 3 — Autocomplete expansion (trend-scoped)

Mine live Google Autocomplete for the trend's entities/topics ONLY (sitewide mining belongs to /autocomplete-pass).

```bash
python3 scripts/trend_pass/mine_trend_autocomplete.py \
  --seed "<entity 1>" --seed "<entity 2>" ... \
  --json reports/trend-pass/$(date +%Y-%m-%d).autocomplete.json
```
Generic topic templates ("X", "X vs", "X for", "best X", "is X", "X review", "how to X", "X alternatives", "X guide") + a–z on the top 2 seeds. Free endpoint, stdlib only.

## Classify each suggestion
1. **New-page candidate** — a dedicated intent with no existing home → convert to a slug (site conventions), append to the Phase 2 list.
2. **Body sub-intent** on an existing page → note `route + section` as a flagged enrichment suggestion (not an auto-build).
3. **Noise** (navigational / wrong-language / unusable) → drop silently.

**Zero-suggestion seeds** are logged in the JSON — copy to the digest, never pad into rows.

## Output
Merged candidate list (matrix + autocomplete) → Phase 4.
