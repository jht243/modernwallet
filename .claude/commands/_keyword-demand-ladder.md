# Keyword demand ladder — NEVER block a routine on a dry API key

**Standing rule (applies to EVERY pass that needs keyword volume/difficulty):
a routine must never stop, skip, or email failure because a keyword API key is
missing, expired, or out of credits.** Demote one rung and keep going.

## The ladder

| Rung | Source | Key | Data | Label rows as |
|---|---|---|---|---|
| 1 | SEMRUSH Analytics API | `$SEMRUSH_API_KEY` | real volume / KD / CPC | `source: semrush`, confidence high |
| 2 | **Ahrefs API v3** Keywords Explorer | `$AHREFS_API_KEY` | real volume / KD / CPC | `source: ahrefs`, confidence high |
| 3 | **Educated guess from public sources** — Google Autocomplete (free, keyless) | none | a conservative volume **BAND**, never a point figure | `source: estimate`, confidence low |

Rung 1 is skipped automatically on `ERROR 132 :: API UNITS BALANCE IS ZERO`,
HTTP 401/403, or a missing key — the exact condition that killed the podcast-pain
runs on 2026-08-18.

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

Every row comes back in one shape regardless of rung, carrying `source`,
`confidence`, `volume`, `volume_low`, `volume_high`, `kd`, `cpc` (USD).

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
5. **Say which rung ran.** Every routine email/digest includes a line like
   `Keyword data: ahrefs (SEMRUSH units exhausted)`. `keyword_data.notes()`
   returns exactly that log. A run that silently degrades is a bug.
6. **Still never invent a keyword.** The ladder relaxes where the *numbers* come
   from. Phrases themselves must always be real (autocomplete, GSC, the brief,
   the SERP) — fabricating queries remains forbidden at every rung.
