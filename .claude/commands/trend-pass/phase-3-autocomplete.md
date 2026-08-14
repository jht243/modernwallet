# Phase 3 — Keyword expansion (Autocomplete + SEMrush, run-scoped)

Expand the run's **seed set** through TWO sources: free Google Autocomplete **and** paid SEMrush. **Seed set = trend entities ∪ uncovered coverage queries** (from Phase 1b) — on a trendless run the seeds are purely the coverage queries. Sitewide mining still belongs to /autocomplete-pass.

## 3a. Google Autocomplete (always on, free)
```bash
python3 scripts/trend_pass/mine_trend_autocomplete.py \
  --seed "<seed 1>" --seed "<seed 2>" ... \
  --json reports/trend-pass/$(date +%Y-%m-%d).autocomplete.json
```
Generic topic templates ("X", "X vs", "X for", "best X", "is X", "X review", "how to X", "X alternatives", "X guide") + a–z on the top 2 seeds. Free endpoint, stdlib only.

## 3b. SEMrush expansion (best-effort, adds real volume)
```bash
python3 scripts/trend_pass/semrush_trend_expand.py \
  --seed "<seed 1>" --seed "<seed 2>" ... \
  --json reports/trend-pass/$(date +%Y-%m-%d).semrush.json
```
Pulls `phrase_related` + `phrase_these` per seed and returns keywords with **search volume + CPC + KD**. Reads `SEMRUSH_API_KEY` from the environment (`~/.claude/secrets.env`). **Best-effort — NEVER a blocker:** the script always exits 0; check the JSON `status` field. `ok` → merge its keywords (prefer higher volume, drop 0-volume noise). `skipped` (no key) / `error` / `empty` → note it on the digest's SEMrush line and continue autocomplete-only. Volume is the signal SEMrush adds: surface NEW candidate intents and attach a volume number to every candidate.

## Classify each suggestion (from BOTH 3a and 3b)
1. **New-page candidate** — a dedicated intent with no existing home → convert to a slug (site conventions), append to the candidate list (source `autocomplete` / `semrush`; carry SEMrush volume when known).
2. **Body sub-intent** on an existing page → note `route + section` as a flagged enrichment suggestion (not an auto-build).
3. **Noise** (navigational / wrong-language / unusable / 0-volume) → drop silently.

**Zero-suggestion seeds** are logged in the JSON — copy to the digest, never pad into rows.

## Output
Merged candidate list (matrix + coverage + autocomplete + SEMrush) → Phase 4. Record the SEMrush `status` + keyword count for the digest.
