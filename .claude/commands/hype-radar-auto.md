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

## STEP 2b — The figure gate (carry this into the brief; mindmap enforces it)
A breakout thing has no settled secondary coverage, so every number on the page is a fabrication risk. These rules ride in the brief and the page does not ship until they hold:

1. **Every figure traces to a primary source.** Price, dose, percentage, date, approval status, funding amount, user count — fetch the maker's own page, the regulator's notice, or the named study, and confirm the figure is stated there. A figure you cannot land on a primary source is removed, not hedged.
2. **A conditional price is never quoted bare.** If a price depends on a program, a refill window, a plan tier, an eligibility rule or a promo that expires, the condition goes in the same sentence as the number. Quoting the conditional price as "the price" is a failure.
3. **Never compare across conditions.** A penalty/standard price on one product against a discounted/program price on another is an invented gap. Compare like for like, or say plainly that the two are not comparable. (2026-09-22: a Foundayo page compared a missed-refill $349 against a competitor's standard $299 and derived a $600/yr gap from it. That is the error this rule exists to stop.)
4. **State the source in the page.** The reader sees where the figure came from, not just the figure.
5. **Report it.** The email lists every figure the page asserts and the primary source each one came from. A figure with no source line in the report means the gate did not run.

## STEP 3 — Run /mindmap-pass with that brief
```
/mindmap-pass <the brief>
```
Force-create (zero volume never vetoes a row). Mindmap does everything from here — research, dedup, writing, audit, build, commit, push, 200-verify, IndexNow, report. Nothing after it.
