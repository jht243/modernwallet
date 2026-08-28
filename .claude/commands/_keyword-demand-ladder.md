# Keyword demand ladder — NEVER block a routine on a dry API key

**Standing rule (applies to EVERY pass that needs keyword volume/difficulty):
a routine must never stop, skip, or email failure because a keyword API key is
missing, expired, or out of credits.** Demote one rung and keep going.

## The ladder — BEST SOURCE PER FIELD, with ranked backups

There is no single "best" keyword vendor, so there is no single ladder. Each
FIELD has its own quality order, and the best **usable** provider wins that
field for the whole run:

| Field | Quality order | Why this order |
|---|---|---|
| **volume** | `ahrefs` → `dataforseo` → `semrush` | Ahrefs/SEMRUSH model finer-grained numbers from clickstream. DataForSEO reports Google's own counts, but **rounded into buckets** (10/20/50/390/4400) with close variants merged — closer to the primary source, coarser in the hand. |
| **kd** | `ahrefs` → `semrush` → `dataforseo` | Ahrefs KD is calibrated against a real link graph and is the industry reference. DataForSEO Labs KD is **modeled** and the least proven of the three. |
| **expand** | `ahrefs` → `semrush` → `dataforseo` | Ahrefs/SEMRUSH have larger, cleaner idea databases, and SEMRUSH ships a dedicated questions report. |
| **SERP** | `dataforseo` only | No other vendor sells live SERP with PAA text and AI Overview citations at any price. Not a ladder — see `scripts/lib/serp.py`. |
| **technical site audit** | `ahrefs` → `dataforseo` | Ahrefs' crawler sees what a page alone cannot (backlink-driven issues, crawl depth, orphan pages). DataForSEO OnPage covers every issue the auto-fix table can act on, at ~$0.00015/URL — see `scripts/lib/site_audit.py`, which emits **Ahrefs' issue slugs** so nothing downstream changes. |

**One provider per field, for the whole run.** Every row's volume comes from one
vendor and every row's KD comes from one vendor, so rows stay comparable to each
other. Different fields may come from different vendors — a row can carry Ahrefs
KD next to DataForSEO volume, and both `source` (volume) and `kd_source` are
stamped on it. What is forbidden is two vendors' volumes inside one chart.

**Google Autocomplete is NOT a rung — it ALWAYS runs, on top.** It is free,
keyless and live, so it adds to every call regardless of which provider
answered: `expand()` merges its suggestions into the provider's ideas, and
`volumes()` attaches an `autocomplete: {completions, corroborates}` signal to
every row. Phrases no provider has data for still fall back to a conservative
autocomplete BAND labelled `source: estimate`. Disable only with
`AUTOCOMPLETE_ENRICH=0`; cap corroboration with `AUTOCOMPLETE_ENRICH_CAP`
(default 80 rows).

A provider is skipped automatically on `ERROR 132 :: API UNITS BALANCE IS ZERO`,
`API units limit reached`, HTTP 401/402/403, or a missing key — the exact
condition that killed the podcast-pain runs on 2026-08-18, and the condition
Ahrefs and SEMRUSH are BOTH in as of 2026-08-23.

### The rule generalizes beyond keywords

This file is named for keyword demand because that is where it started, but the
standing rule is about **vendors, not fields**: no routine in this fleet ends
because one vendor's meter ran out. When you add a data source to any routine,
give it a rung below and a way to say which rung answered.

Two corollaries learned the hard way:

- **A check that did not run is not a pass.** A fallback with narrower coverage
  must report what it could not see (`unavailable_on_this_source`), never let a
  silent omission read as a clean bill of health.
- **Normalize at the source, not downstream.** `site_audit.py` translates
  DataForSEO's checks into Ahrefs' issue slugs inside the helper, so the fix
  table, gates and email are untouched. Compare the winner/loser pass, whose two
  Ahrefs sources need a field-mapping table in the skill itself — that mapping is
  a cost you pay on every future edit.

### DataForSEO specifics

Keys: `$DATAFORSEO_LOGIN` + `$DATAFORSEO_PASSWORD`, or the pre-encoded
`$DATAFORSEO_B64`. Pay-as-you-go against a prepaid balance, so unlike a metered
monthly allowance it does not hit a cliff mid-month. Two controls, neither
needing a code change: `DFS_ENABLED=0` removes it from every field ladder, and
`DFS_MAX_COST_USD` (default `$2.00`) caps per-process spend — on hitting the cap
the field demotes to the next provider instead of spending on.

## How to call it — always through the shared helper

`scripts/lib/keyword_data.py` implements the whole ladder (stdlib only, no pip).
**Do not hand-roll a SEMRUSH or Ahrefs call in a phase.** **Never hardcode a key
into a committed file.** Keys resolve exactly like every other key in the fleet
(same pattern as `.claude/scripts/bing_webmaster.py`): environment variable
first, then `.claude/routines.config`, then `~/.claude/secrets.env`. Cloud
routines pass `SEMRUSH_API_KEY` / `AHREFS_API_KEY` inline from the trigger
config — a routine whose trigger has no `AHREFS_API_KEY` yet simply runs one
rung lower, on public-source estimates, instead of failing.

From Python:

```python
import sys; sys.path.insert(0, "scripts/lib")
from keyword_data import volumes, expand, passes_floor, score_volume, notes
rows  = volumes(["invoice automation", "dental crm"])   # dict keyed by lowercase phrase
ideas = expand("invoice automation", limit=20)          # related/matching terms
```

From a shell (for phases that shell out):

```bash
python3 scripts/lib/keyword_data.py volumes --phrase "x" --phrase "y"
python3 scripts/lib/keyword_data.py expand  --seed "x" --limit 20
python3 scripts/lib/keyword_data.py status   # which rungs are live right now
```

Every row comes back in one shape regardless of provider, carrying `source`
(the VOLUME provider), `kd_source` (the KD provider — may differ), `confidence`,
`volume`, `volume_low`, `volume_high`, `kd`, `cpc` (USD), and `autocomplete`
(`{completions, corroborates}` — always present unless enrichment is disabled).

`status` prints which provider won each field this run:

```json
{"selected": {"volume": "dataforseo", "kd": "dataforseo", "expand": "dataforseo"}}
```

## Honesty rules — non-negotiable

The point of rung 3 is to keep shipping, **not** to launder a guess into a fact.

1. **Never present an estimate as measured volume.** An estimate row is a band
   (`est. 150-1500/mo`), always written with its source: `estimate — Google
   Autocomplete, NOT measured`.
2. **Charts must carry the source column.** Any chart/table row built on rung 3
   states `source: estimate (autocomplete)` in its evidence cell. A reader must
   be able to tell measured demand from inferred demand at a glance.
3. **Rank measured above estimated.** When both exist, a real-volume row
   outranks an estimated row of nominally similar size.
4. **Floors use `passes_floor(row, floor)`** from the helper — never a raw
   `row["volume"] >= floor` comparison. Measured rows score their real volume;
   estimate rows score their band MIDPOINT, because scoring estimates at the low
   end would fail nearly every row in an all-estimate run and quietly recreate
   the blocked-routine failure.
5. **Say which provider won each field.** Every routine email/digest includes a
   line like `Keyword data: volume=dataforseo, kd=dataforseo (Ahrefs units
   exhausted, SEMRUSH 403)`. `keyword_data.notes()` returns exactly that log. A
   run that silently degrades is a bug.
6. **Do not over-read DataForSEO KD.** It is modeled, not calibrated against a
   link graph. Nothing in this fleet gates on KD — `passes_floor()` scores
   volume only — so treat a DataForSEO KD as a rough ordering hint, never as a
   reason to drop a row.
7. **Read DataForSEO volume as a bucket, not a count.** Google rounds Keyword
   Planner volumes and merges close variants, so cluster totals are more
   trustworthy than any single row.
8. **Still never invent a keyword.** The ladder relaxes where the *numbers* come
   from. Phrases themselves must always be real (autocomplete, GSC, the brief,
   the SERP) — fabricating queries remains forbidden at every rung.
