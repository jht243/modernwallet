# Phase 0 — EXPAND (pull new episodes → mine money-decision pain → compose the BRIEF)

This phase only EXPANDS: podcasts → mined pain → a free-form brief. **No SEMRUSH, no narrowing here** — all validation/narrowing happens inside the Phase-1 pass. Set `DATE=$(date +%Y-%m-%d)` and `RUN=reports/podcast-pain-pass/run-$DATE`.

### Step 0.1 — Pull new episodes (RSS diff vs ledger)
```bash
python3 scripts/podcast_pain_pass/pull_new_episodes.py --out "$RUN" --max-per-show 8
```
- Reads `scripts/podcast_pain_pass/feeds.json` (roster of TRANSCRIPT-READY money/finance shows) and diffs each feed against `reports/podcast-pain-pass/ledger.json`.
- Downloads + normalizes the transcript for each new episode; writes `$RUN/manifest.json` and marks GUIDs processed in the ledger.
- `--max-per-show 8` is the per-feed circuit breaker (a long gap won't ingest a back catalog).
- Only episodes whose `<item>` carries a `<podcast:transcript>` tag are minable (no speech-to-text). Feeds without transcript tags are silently skipped — this is the routine's hard input gate.
- **If output contains `NO_NEW_EPISODES` (empty manifest):** this is a quiet week. Send the `no-changes` email and STOP the whole run.

### Step 0.2 — Mine money-decision pain clusters
```bash
python3 scripts/podcast_pain_pass/mine_pain.py --run "$RUN"
```
Scans transcripts for sentences where a listener is stuck on a money DECISION or CALCULATION (the pain a ModernWallet calculator/guide could answer) and clusters them per vertical → theme into `$RUN/pain_clusters.json`. Themes map to ModernWallet coverage: `mortgage-home-buying`, `retirement-savings`, `debt-payoff`, `budgeting-saving`, `investing`, `credit-score`, `taxes`, `insurance-estate`.

### Step 0.3 — Compose the BRIEF (the Phase-1 input)
Write `$RUN/brief.md` — the free-form input brief that Phase 1 consumes, exactly as if a human had handed the routine a note. It must contain:
1. **Interpreted brief** (2–4 sentences): what this week's episodes say listeners are stuck on / can't figure out, per vertical, in your own words.
2. **Per-(vertical, theme) sections** for every pair present in `pain_clusters.json`: the vertical + theme, hit count, 1–3 representative pain quotes (verbatim, marked as transcript quotes — they anchor intent only, **never publishable text**), and 3–6 **seed phrases** — the money queries a listener with that pain would actually search (a calculator/how-much/X-vs-Y term, NOT the pain phrasing). Derive seeds from BOTH the mined language and `scripts/podcast_pain_pass/validate_terms.py`'s `THEME_TERMS` baseline for that theme.
3. **Entities named in the episodes** (concrete products/institutions — e.g. "Vanguard", "Fidelity", "a HYSA", "a 529 plan", "Roth IRA", "FHA loan"): list them per vertical; Phase 1's Lens 3 mines vs/alternatives/pricing/"worth it" formats around them.

**If `pain_clusters.json` is empty:** nothing minable this week → send `no-changes` email and STOP.

Proceed to Phase 1 with `$RUN/brief.md`.
