# Phase 0 — EXPAND (pull new episodes → mine patient pain → compose the BRIEF)

This phase only EXPANDS: podcasts → mined pain → a free-form brief. **No SEMRUSH, no narrowing here** — all validation/narrowing happens inside the Phase-1 mindmap pass. Set `DATE=$(date +%Y-%m-%d)` and `RUN=reports/podcast-pain-pass/run-$DATE`.

### Step 0.1 — Pull new episodes (RSS diff vs ledger)
```bash
python3 scripts/podcast_pain_pass/pull_new_episodes.py --out "$RUN" --max-per-show 6
```
- Reads `scripts/podcast_pain_pass/feeds.json` (roster of TRANSCRIPT-READY hormone / menopause / longevity / lab shows) and diffs each feed against `reports/podcast-pain-pass/ledger.json`.
- Downloads + normalizes the transcript for each new episode; writes `$RUN/manifest.json` and marks GUIDs processed in the ledger. Only episodes carrying a `<podcast:transcript>` tag are pulled (no speech-to-text). Transcript downloads are large — allow several minutes.
- `--max-per-show 6` is the per-feed circuit breaker (a long gap won't ingest a back catalog).
- **If output contains `NO_NEW_EPISODES` (empty manifest):** quiet week. Send the `no-changes` email and STOP the whole run.

### Step 0.2 — Mine patient-pain clusters
```bash
python3 scripts/podcast_pain_pass/mine_pain.py --run "$RUN"
```
Scans transcripts for patient-pain sentences (symptoms / struggles / unanswered questions / lab-number talk) and clusters them per site theme into `$RUN/pain_clusters.json`. Routing is by the theme matched IN the sentence, not the show's coarse topic tag.

### Step 0.3 — Compose the BRIEF (the mindmap-pass input)
Write `$RUN/brief.md` — the free-form input brief that Phase 1 (the mindmap-pass duplicate) consumes, exactly as if a human had handed `/mindmap-pass` a note. It must contain:
1. **Interpreted brief** (2–4 sentences): what this week's episodes say readers are struggling with / asking about, in your own words.
2. **Per-theme sections** for every theme present in `pain_clusters.json`: the theme, its hit count, 1–3 representative pain quotes (verbatim, marked as transcript quotes — they may contain speech-to-text noise; they anchor intent only), and 3–6 **seed phrases** — the informational queries a reader with that pain would type. Derive seeds from BOTH the mined language and `scripts/podcast_pain_pass/validate_terms.py`'s THEME_TERMS baseline for that theme.
3. **Entities named in the episodes** (supplements, drugs, tests, devices, protocols — e.g. "magnesium glycinate", "Mounjaro", "DEXA scan", "CGM"): list them; Phase 1's Lens 3 mines vs/alternatives/pricing formats around them.

**If `pain_clusters.json` is empty:** nothing minable this week → send `no-changes` email and STOP.

Proceed to Phase 1 with `$RUN/brief.md`.
