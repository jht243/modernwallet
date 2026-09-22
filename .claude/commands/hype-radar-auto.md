---
description: AUTONOMOUS trending-tool catcher. Finds tool names breaking out right now (named in ≥3 independent stories in 72h) and hands them to /mindmap-pass as a brief. NO human gates.
argument-hint: "(no arguments — fully autonomous)"
---

# /hype-radar-auto — breakout AI tools → /mindmap-pass

> **‼️ AUTONOMOUS.** No human checkpoint. Never print "Approve?". Nothing new → exit 0 silently.

## STEP 1 — Harvest
```bash
python3 scripts/hype_radar/pull.py pull --json reports/hype-radar/$(date +%Y-%m-%d).json
```
Scans Hacker News, Google Trends daily RSS and Reddit; keeps a name only when it appears in ≥3 distinct stories; skips names already in the ledger; records every survivor to the ledger.

`candidates: []` → exit 0. Done.

## STEP 2 — Send them all
Every candidate goes into the brief as returned. No filtering, no judging, no volume gate — a brand-new tool has no volume yet; that is the point.

Brief = one line per candidate: name, story count, sources, `search_caught_up`, and the evidence titles verbatim.

## STEP 3 — Run /mindmap-pass with that brief
```
/mindmap-pass <the brief>
```
Force-create (zero volume never vetoes a row). Mindmap does everything from here — research, dedup, writing, audit, build, commit, push, 200-verify, IndexNow, report. Nothing after it.
