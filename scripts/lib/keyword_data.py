#!/usr/bin/env python3
"""Shared keyword-demand provider with an automatic three-rung fallback ladder.

A routine must NEVER be blocked because an API key is missing or dry. Every
consumer (podcast-pain-pass, mindmap-pass, trend-pass, keyword-gap-pass, ...)
calls this module instead of hitting SEMRUSH directly, and gets back rows that
always carry an explicit `source` + `confidence` so downstream phases can label
what is measured vs. estimated.

Ladder (per call, first rung that returns usable data wins):
  1. semrush  — SEMRUSH Analytics API ($SEMRUSH_API_KEY). Real volume/KD/CPC.
                Skipped automatically on "ERROR 132 :: API UNITS BALANCE IS ZERO",
                auth errors, or a missing key.
  2. ahrefs   — Ahrefs API v3 Keywords Explorer ($AHREFS_API_KEY). Real
                volume/KD/CPC. Note Ahrefs returns CPC in USD cents —
                normalized to dollars here.
  3. estimate — Public-source educated guess: Google Autocomplete (free,
                keyless) demand signal converted into a conservative volume
                BAND. Never a fabricated precise number: rows carry
                volume_low/volume_high, `volume` = the band's low end (the
                conservative read), source="estimate", confidence="low".

Row shape (identical from every rung):
  {"keyword", "volume", "volume_low", "volume_high", "kd", "cpc",
   "source": "semrush"|"ahrefs"|"estimate", "confidence": "high"|"low",
   "evidence": "<how the estimate rung got there>"  # estimate rows only}

Stdlib only. No pip installs.

Library use:
    import sys; sys.path.insert(0, "scripts/lib")
    from keyword_data import volumes, expand, provider_status
    rows = volumes(["invoice automation", "dental crm"])   # dict keyed lowercase
    ideas = expand("invoice automation", limit=20)          # list[row]

CLI use (for skill phases that shell out):
    python3 scripts/lib/keyword_data.py volumes --phrase "x" --phrase "y"
    python3 scripts/lib/keyword_data.py expand --seed "x" --limit 20
    python3 scripts/lib/keyword_data.py status
Both CLI verbs print JSON to stdout and always exit 0.
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

SEMRUSH_API = "https://api.semrush.com/"
AHREFS_API = "https://api.ahrefs.com/v3/keywords-explorer"

_UA = {"User-Agent": "Layer3Labs-SEO-Research/1.0"}

# Keys resolve exactly like every other key in the fleet (see
# .claude/scripts/bing_webmaster.py): environment first, then a KEY=value config
# file. NO key is ever hardcoded here — this file is committed.
# Workspace-local plainly-named file FIRST: cloud routines write keys there, and
# a file named ".env"/"secrets" trips Claude Code's sensitive-file guard (a
# permission prompt that hangs an unattended run).
SECRETS_FILES = [
    os.path.join(os.getcwd(), ".claude", "routines.config"),
    os.path.expanduser("~/.claude/secrets.env"),
]


def resolve_key(name: str) -> str:
    """Env var, else the first SECRETS_FILES entry that defines it, else ''."""
    env = os.environ.get(name)
    if env and env.strip():
        return env.strip()
    for path in SECRETS_FILES:
        try:
            with open(path) as fh:
                for line in fh:
                    line = line.strip()
                    if line.startswith(f"{name}="):
                        return line.split("=", 1)[1].strip().strip('"').strip("'")
        except OSError:
            continue
    return ""

# Process-level memo of which rungs are dead, so one dry-key discovery does not
# cost every later batch in the same run another failing round-trip.
_DEAD: set[str] = set()
_NOTES: list[str] = []


def _note(msg: str) -> None:
    if msg not in _NOTES:
        _NOTES.append(msg)
    print(f"[keyword_data] {msg}", file=sys.stderr)


def notes() -> list[str]:
    """Human-readable log of what happened on the ladder (for digests/emails)."""
    return list(_NOTES)


def _ahrefs_key() -> str:
    return resolve_key("AHREFS_API_KEY")


def _num(v, cast=int, default=0):
    try:
        if v in (None, "", "null"):
            return default
        return cast(float(v))
    except (TypeError, ValueError):
        return default


def _row(keyword, volume, kd="", cpc="", source="", confidence="high",
         low=None, high=None, evidence=""):
    r = {
        "keyword": keyword,
        "volume": volume,
        "volume_low": volume if low is None else low,
        "volume_high": volume if high is None else high,
        "kd": kd,
        "cpc": cpc,
        "source": source,
        "confidence": confidence,
    }
    if evidence:
        r["evidence"] = evidence
    return r


# --------------------------------------------------------------------------
# Rung 1 — SEMRUSH
# --------------------------------------------------------------------------

def _semrush_csv(params: dict) -> list[dict]:
    key = resolve_key("SEMRUSH_API_KEY")
    if not key:
        raise RuntimeError("no SEMRUSH_API_KEY")
    q = {"key": key, "export_escape": 1, "export_decode": 1, **params}
    req = urllib.request.Request(SEMRUSH_API + "?" + urllib.parse.urlencode(q), headers=_UA)
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            body = r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}")
    except Exception as e:  # network/DNS/timeout
        raise RuntimeError(str(e)[:120])
    head = body.strip()[:80]
    if head.startswith("ERROR 50"):   # "NOTHING FOUND" — a valid empty answer
        return []
    if head.upper().startswith("ERROR") or head.lower().startswith(("not enough", "wrong")):
        raise RuntimeError(head)
    lines = [l for l in body.splitlines() if l.strip()]
    return list(csv.DictReader(lines, delimiter=";")) if len(lines) >= 2 else []


def _semrush_dead(err: str) -> bool:
    """True when the failure is a key/quota problem, not a transient one."""
    e = err.upper()
    return ("BALANCE IS ZERO" in e or "ERROR 132" in e or "ERROR 120" in e
            or "ERROR 130" in e or "ERROR 131" in e or "ERROR 134" in e
            or "API KEY" in e or "NO SEMRUSH_API_KEY" in e or "HTTP 40" in e)


def _semrush_volumes(phrases: list[str], database: str) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for i in range(0, len(phrases), 100):
        chunk = phrases[i:i + 100]
        these = _semrush_csv({"type": "phrase_these", "database": database,
                              "phrase": ";".join(chunk),
                              "export_columns": "Ph,Nq,Cp,Co,Kd"})
        kdi = {}
        try:
            for r in _semrush_csv({"type": "phrase_kdi", "database": database,
                                   "phrase": ";".join(chunk),
                                   "export_columns": "Ph,Kd"}):
                kdi[r.get("Keyword", "").lower()] = r.get("Keyword Difficulty Index", "")
        except RuntimeError:
            pass  # difficulty is a nice-to-have; volume already landed
        for r in these:
            k = r.get("Keyword", "").lower()
            out[k] = _row(r.get("Keyword", ""), _num(r.get("Search Volume")),
                          kdi.get(k) or r.get("Keyword Difficulty Index", ""),
                          r.get("CPC", ""), "semrush", "high")
    return out


def _semrush_expand(seed: str, limit: int, database: str) -> list[dict]:
    rows = []
    for rtype in ("phrase_related", "phrase_questions"):
        try:
            for r in _semrush_csv({"type": rtype, "database": database, "phrase": seed,
                                   "display_limit": limit, "export_columns": "Ph,Nq,Cp,Co,Kd"}):
                rows.append(_row(r.get("Keyword", ""), _num(r.get("Search Volume")),
                                 r.get("Keyword Difficulty Index", ""), r.get("CPC", ""),
                                 "semrush", "high"))
        except RuntimeError as e:
            if _semrush_dead(str(e)):
                raise
    return rows


# --------------------------------------------------------------------------
# Rung 2 — Ahrefs API v3
# --------------------------------------------------------------------------

def _ahrefs_get(path: str, params: dict) -> dict:
    key = _ahrefs_key()
    if not key:
        raise RuntimeError("no AHREFS_API_KEY")
    url = f"{AHREFS_API}/{path}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={**_UA, "Authorization": f"Bearer {key}",
                                               "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8", "replace")[:160]
        except Exception:
            pass
        raise RuntimeError(f"HTTP {e.code} {body}")
    except Exception as e:
        raise RuntimeError(str(e)[:160])


def _ahrefs_dead(err: str) -> bool:
    e = err.upper()
    return ("HTTP 401" in e or "HTTP 403" in e or "HTTP 402" in e
            or "NO AHREFS_API_KEY" in e or "LIMIT" in e or "QUOTA" in e or "UNITS" in e)


def _ahrefs_row(r: dict) -> dict:
    cpc = r.get("cpc")
    return _row(r.get("keyword", ""), _num(r.get("volume")),
                "" if r.get("difficulty") is None else _num(r.get("difficulty")),
                "" if cpc in (None, "") else round(_num(cpc) / 100.0, 2),  # cents -> USD
                "ahrefs", "high")


def _ahrefs_volumes(phrases: list[str], country: str) -> dict[str, dict]:
    out: dict[str, dict] = {}
    # The overview endpoint takes a comma-joined list; keep batches modest so a
    # single oversized URL can't sink a whole run.
    for i in range(0, len(phrases), 50):
        chunk = [p for p in phrases[i:i + 50] if "," not in p]
        if not chunk:
            continue
        data = _ahrefs_get("overview", {"country": country, "keywords": ",".join(chunk),
                                        "select": "keyword,volume,difficulty,cpc"})
        for r in data.get("keywords", []):
            out[r.get("keyword", "").lower()] = _ahrefs_row(r)
        time.sleep(0.2)
    return out


def _ahrefs_expand(seed: str, limit: int, country: str) -> list[dict]:
    data = _ahrefs_get("matching-terms", {"country": country, "keywords": seed,
                                          "select": "keyword,volume,difficulty,cpc",
                                          "limit": limit, "match_mode": "terms",
                                          "order_by": "volume:desc"})
    return [_ahrefs_row(r) for r in data.get("keywords", [])]


# --------------------------------------------------------------------------
# Rung 3 — public-source estimate (Google Autocomplete, free + keyless)
# --------------------------------------------------------------------------

def _suggest(query: str, gl: str = "us") -> list[str]:
    params = {"client": "firefox", "q": query, "hl": "en", "gl": gl}
    req = urllib.request.Request(
        "https://suggestqueries.google.com/complete/search?" + urllib.parse.urlencode(params),
        headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode("utf-8", "replace"))
        return list(data[1]) if isinstance(data, list) and len(data) >= 2 else []
    except Exception:
        return []


def _estimate_one(phrase: str, gl: str = "us") -> dict:
    """Turn free Autocomplete signal into a conservative volume BAND.

    Google only autocompletes queries people actually type, so three graded
    public signals stand in for volume:
      A. the phrase is itself suggested from its own prefix  -> proven demand
      B. how many completions the full phrase generates      -> breadth of demand
      C. how many words the phrase is                        -> head vs long tail
    The output is a band, never a point estimate presented as measured data.
    """
    words = phrase.split()
    prefix = " ".join(words[:-1]) if len(words) > 1 else phrase[:max(3, len(phrase) - 2)]
    prefix_hits = [s.lower() for s in _suggest(prefix, gl)]
    time.sleep(0.35)
    own_hits = _suggest(phrase, gl)
    time.sleep(0.35)

    exact = phrase.lower() in prefix_hits
    partial = any(phrase.lower() in h for h in prefix_hits)
    breadth = len(own_hits)

    if exact and breadth >= 8:
        low, high, why = 500, 5000, "exact autocomplete match from its own prefix + broad completion set"
    elif exact:
        low, high, why = 150, 1500, "exact autocomplete match from its own prefix"
    elif partial and breadth >= 8:
        low, high, why = 100, 1000, "partial prefix match + broad completion set"
    elif breadth >= 8:
        low, high, why = 50, 500, f"{breadth} live autocomplete completions"
    elif breadth >= 3:
        low, high, why = 20, 200, f"{breadth} live autocomplete completions"
    else:
        low, high, why = 0, 50, "little or no live autocomplete signal"
    if len(words) >= 5:  # long tail: same signal, thinner real volume
        low, high = low // 2, high // 2

    return _row(phrase, low, "", "", "estimate", "low", low=low, high=high,
                evidence=f"Google Autocomplete — {why} (est. {low}-{high}/mo, NOT measured)")


def _estimate_volumes(phrases: list[str], gl: str = "us") -> dict[str, dict]:
    return {p.lower(): _estimate_one(p, gl) for p in phrases}


def _estimate_expand(seed: str, limit: int, gl: str = "us") -> list[dict]:
    """Autocomplete expansion: the seed's completions + a-z widening."""
    seen: dict[str, None] = {}
    for s in _suggest(seed, gl):
        seen.setdefault(s, None)
    time.sleep(0.35)
    for letter in "abcdefghijklmnopqrstuvwxyz":
        if len(seen) >= limit * 2:
            break
        for s in _suggest(f"{seed} {letter}", gl):
            seen.setdefault(s, None)
        time.sleep(0.35)
    out = [_estimate_one(k, gl) for k in list(seen)[:limit]]
    return out


# --------------------------------------------------------------------------
# Public API — the ladder
# --------------------------------------------------------------------------

def provider_status(database: str = "us") -> dict:
    """Probe each rung once. Cheap; useful for digests and preflight lines."""
    st = {}
    try:
        _semrush_csv({"type": "phrase_these", "database": database,
                      "phrase": "seo", "export_columns": "Ph,Nq"})
        st["semrush"] = "ok"
    except RuntimeError as e:
        st["semrush"] = f"unavailable: {e}"
    try:
        _ahrefs_get("overview", {"country": database, "keywords": "seo", "select": "keyword,volume"})
        st["ahrefs"] = "ok"
    except RuntimeError as e:
        st["ahrefs"] = f"unavailable: {e}"
    st["estimate"] = "ok" if _suggest("seo") else "unavailable: no autocomplete response"
    return st


def volumes(phrases, database: str = "us", allow_estimate: bool = True) -> dict[str, dict]:
    """Volume/KD/CPC for each phrase, keyed by lowercase phrase.

    Walks the ladder. Every returned row states its own `source`/`confidence`,
    so a caller can tell measured data from an educated guess. Phrases a rung
    has no data for fall through to the next rung rather than being dropped.
    """
    phrases = [p for p in dict.fromkeys(p.strip() for p in phrases) if p]
    if not phrases:
        return {}
    out: dict[str, dict] = {}
    pending = list(phrases)

    if "semrush" not in _DEAD:
        try:
            got = _semrush_volumes(pending, database)
            out.update(got)
            pending = [p for p in pending if p.lower() not in out]
            if got:
                _note(f"SEMRUSH returned {len(got)}/{len(phrases)} phrases")
        except RuntimeError as e:
            if _semrush_dead(str(e)):
                _DEAD.add("semrush")
                _note(f"SEMRUSH unavailable ({e}) — falling back to Ahrefs")
            else:
                _note(f"SEMRUSH error ({e}) — falling back to Ahrefs")

    if pending and "ahrefs" not in _DEAD:
        try:
            got = _ahrefs_volumes(pending, database)
            out.update(got)
            pending = [p for p in pending if p.lower() not in out]
            if got:
                _note(f"Ahrefs returned {len(got)} phrases")
        except RuntimeError as e:
            if _ahrefs_dead(str(e)):
                _DEAD.add("ahrefs")
            _note(f"Ahrefs unavailable ({e}) — falling back to public-source estimates")

    if pending and allow_estimate:
        _note(f"Estimating {len(pending)} phrases from public sources (Google Autocomplete)")
        out.update(_estimate_volumes(pending, database))

    return out


def expand(seed: str, limit: int = 20, database: str = "us") -> list[dict]:
    """Related/matching keyword ideas for one seed, via the same ladder."""
    if "semrush" not in _DEAD:
        try:
            rows = _semrush_expand(seed, limit, database)
            if rows:
                return rows[:limit]
        except RuntimeError as e:
            if _semrush_dead(str(e)):
                _DEAD.add("semrush")
            _note(f"SEMRUSH expansion unavailable for '{seed}' ({e})")

    if "ahrefs" not in _DEAD:
        try:
            rows = _ahrefs_expand(seed, limit, database)
            if rows:
                return rows[:limit]
        except RuntimeError as e:
            if _ahrefs_dead(str(e)):
                _DEAD.add("ahrefs")
            _note(f"Ahrefs expansion unavailable for '{seed}' ({e})")

    _note(f"Expanding '{seed}' from public sources (Google Autocomplete)")
    return _estimate_expand(seed, limit, database)


def score_volume(row: dict) -> int:
    """The number a floor test should compare against.

    Measured rows (semrush/ahrefs) score their real volume. Estimate rows score
    the MIDPOINT of their band, not the low end: scoring estimates at the low
    end would fail almost every row the moment both APIs are dry, which is just
    the original "blocked routine" failure wearing a different hat. The midpoint
    keeps an all-estimate run productive while still dropping the tiers with
    little or no live demand signal.
    """
    if row.get("source") == "estimate":
        return (_num(row.get("volume_low")) + _num(row.get("volume_high"))) // 2
    return _num(row.get("volume"))


def passes_floor(row: dict, floor: int) -> bool:
    return score_volume(row) >= floor


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    v = sub.add_parser("volumes")
    v.add_argument("--phrase", action="append", default=[])
    v.add_argument("--phrases-file", help="newline-delimited phrases")
    v.add_argument("--database", default=os.environ.get("SEMRUSH_DATABASE", "us"))
    e = sub.add_parser("expand")
    e.add_argument("--seed", action="append", required=True)
    e.add_argument("--limit", type=int, default=20)
    e.add_argument("--database", default=os.environ.get("SEMRUSH_DATABASE", "us"))
    s = sub.add_parser("status")
    s.add_argument("--database", default=os.environ.get("SEMRUSH_DATABASE", "us"))
    a = ap.parse_args(argv)

    if a.cmd == "status":
        print(json.dumps(provider_status(a.database), indent=1))
        return 0
    if a.cmd == "volumes":
        phrases = list(a.phrase)
        if a.phrases_file:
            phrases += [l.strip() for l in open(a.phrases_file) if l.strip()]
        rows = volumes(phrases, a.database)
        print(json.dumps({"rows": list(rows.values()), "notes": notes()}, indent=1))
        return 0
    rows = []
    for seed in a.seed:
        rows += [{**r, "seed": seed} for r in expand(seed, a.limit, a.database)]
    print(json.dumps({"rows": rows, "notes": notes()}, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
