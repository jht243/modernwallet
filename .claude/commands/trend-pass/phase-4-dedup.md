# Phase 4 — Local pre-filter + research pack

Lanes A and B are research only (2026-10-06 port of the layer3 2026-10-05 redesign). This phase does NOT decide what gets built. It removes findings that obviously already exist, so mindmap doesn't waste work on them, and packages everything for the builder, mindmap (Phase 4c). **Local checks only — no external API, no keyword data, no SERP reads.** Winner protection, near-duplicate judgment, demand validation and the cap all belong to mindmap.

> **"Owned by another engine" is NEVER a removal reason.** The only removal reason here is that the page already exists (or was already judged in the ledger). Overlap with another engine is mutual and self-resolving via existence dedup.

## 1. Pre-filter each finding (local, cheap)
For every finding from Phase 2 (`source: trend`) and Phase 1b (`source: coverage`):
- **Slug inventory:** `python3 scripts/trend_pass/slug_inventory.py --base-url <BASE_URL> --check <slug>` → exit 1 (TAKEN) → remove ("exists: <where>"). It matches the full path OR the last segment, so a bare segment like `interest-calculator` can collide with a route in another vertical — record which route it hit.
- **Git history:** `git log -S "<slug>" --oneline` → hit → remove with the commit ref (a deliberately removed page must not silently return). A hit that is only a planning mention in a report (e.g. a `reports/keyword-pass/*.md` chart row that was never built) is NOT an existing page — keep the finding and note the ref.
- **Candidate ledger:** `reports/trend-pass/ledger.md` has it as KEPT or DROPPED → remove (the old row stands). An owner OVERRIDE row beats an earlier DROPPED; a HELD row does not block (see Phase 4c ledger statuses).

Removed findings are listed in the run report, not ledgered again.

## 2. Assemble the research pack
Write `reports/trend-pass/<YYYY-MM-DD>.research.md`:

```markdown
# Trend-pass research pack — <data_date> (7-day window <start>→<end>)

## Trend (Lane A)
Verdict: <NEW TREND: <theme> / Trend already caught on <date>: <theme> / No clear trend> — <evidence counts>
### Trend gap findings
- <suggested slug> — <entity × angle> — sibling evidence: <route, clicks> — proposed title: <title>

## Query check (Lane B)
Verdict: <N covered / M uncovered of top-20>
- "<uncovered query>" (<clicks> clicks, <impr> impr) — entity: <entity> — suggested angles: <anchor, angle, angle…>

## Pre-filtered out (already exists)
- <slug> — <reason>
```

Every heading is always present; write `None this run` under an empty one.

## Output
The research pack path → Phase 4c.
