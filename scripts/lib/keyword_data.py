#!/usr/bin/env python3
"""Shared keyword-demand provider with an automatic three-rung fallback ladder.

A routine must NEVER be blocked because an API key is missing or dry. Every
consumer (podcast-pain-pass, mindmap-pass, trend-pass, keyword-gap-pass, ...)
calls this module instead of hitting SEMRUSH directly, and gets back rows that
always carry an explicit `source` + `confidence` so downstream phases can label
what is measured vs. estimated.

TWO RULES GOVERN THIS MODULE (they are the whole contract):

  RULE 1 — ONE PAID PROVIDER PER RUN, never a blend.
    Exactly ONE of dataforseo / semrush / ahrefs is selected for the whole
    process, on first use, and every later call reuses it. A phrase the
    selected provider has no data for is NOT quietly looked up on a different
    provider — mixing two vendors' volume models inside one chart makes the
    numbers non-comparable, so rows would silently mean different things. Those
    phrases are labelled `no tool volume` and handed to the autocomplete layer
    instead. The provider is only re-selected if the selected one dies mid-run
    (budget cap, auth failure), and that switch is announced loudly in notes().

  RULE 2 — GOOGLE AUTOCOMPLETE ALWAYS RUNS, ON TOP.
    Autocomplete is NOT a fallback rung. It is a free, live, keyless demand
    signal that runs on EVERY call regardless of which provider answered, and
    ADDS to the result:
      * expand()  — autocomplete suggestions are merged into the provider's
                    ideas, so real live long-tail is never missed.
      * volumes() — every row gets an autocomplete corroboration signal, and
                    phrases the provider had no volume for get a conservative
                    autocomplete BAND (source="estimate", confidence="low").
    Disable only with AUTOCOMPLETE_ENRICH=0, and only for a speed-critical run.

Provider selection order (first one usable wins the whole run):
  0. dataforseo — DataForSEO API v3 ($DATAFORSEO_LOGIN/$DATAFORSEO_PASSWORD, or
                the pre-encoded $DATAFORSEO_B64). Real Google-Ads volume/CPC +
                Labs keyword difficulty. Pay-as-you-go with no subscription
                floor, so it does not go dark the way a metered plan does.
                Turn it off fleet-wide with DFS_ENABLED=0; cap per-process
                spend with DFS_MAX_COST_USD (default $2.00).
  1. semrush  — SEMRUSH Analytics API ($SEMRUSH_API_KEY). Real volume/KD/CPC.
                Skipped automatically on "ERROR 132 :: API UNITS BALANCE IS ZERO",
                auth errors, or a missing key.
  2. ahrefs   — Ahrefs API v3 Keywords Explorer ($AHREFS_API_KEY). Real
                volume/KD/CPC. Note Ahrefs returns CPC in USD cents —
                normalized to dollars here.
  (none)      — every provider unusable: the autocomplete layer alone carries
                the run. Rows carry volume_low/volume_high, `volume` = the
                band's low end (the conservative read), source="estimate",
                confidence="low". Never a fabricated precise number.

Row shape (identical from every rung):
  {"keyword", "volume", "volume_low", "volume_high", "kd", "cpc",
   "source": "dataforseo"|"semrush"|"ahrefs"|"estimate",
   "confidence": "high"|"low",
   "autocomplete": {"completions": int, "corroborates": bool},  # ALWAYS present
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

try:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import dataforseo as _dfs
except Exception:  # module absent/broken -> ladder simply starts at semrush
    _dfs = None

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
# Rung 0 — DataForSEO (pay-as-you-go; no plan floor to go dry)
# --------------------------------------------------------------------------

def _dfs_on() -> bool:
    return bool(_dfs) and _dfs.available() and "dataforseo" not in _DEAD


def _dfs_volumes(phrases: list[str], database: str) -> dict[str, dict]:
    """Google Ads volume/CPC + Labs KD, merged into ladder rows.

    Volume and KD are two endpoints. Volume is the load-bearing one, so a KD
    failure degrades the rows (kd="") instead of losing the whole rung.
    """
    sv = _dfs.search_volume(phrases, database)
    if not sv:
        return {}
    kd = {}
    try:
        kd = _dfs.keyword_difficulty([r["keyword"] for r in sv.values()], database)
    except Exception as e:
        _note(f"DataForSEO KD unavailable ({str(e)[:80]}) — volume rows kept without KD")
    out = {}
    for k, r in sv.items():
        out[k] = _row(r["keyword"], r["volume"], kd.get(k, ""), r["cpc"],
                      "dataforseo", "high")
    return out


def _dfs_expand(seed: str, limit: int, database: str) -> list[dict]:
    """Widen from tightest to loosest, stopping as soon as we have enough.

    Order matters for RELEVANCE, not cost: keyword_ideas broad-matches and will
    return "framework computers" for "ai governance framework". keyword_suggestions
    only returns phrases containing the seed, so it goes first; related_keywords
    (the "searches related to" graph) is the semantic middle ground; keyword_ideas
    is the last resort when the first two came back thin.
    """
    rows: list[dict] = []
    have: set[str] = set()

    def take(items):
        for r in items:
            k = (r.get("keyword") or "").strip()
            if k and k.lower() not in have:
                have.add(k.lower())
                rows.append(_row(k, r["volume"], r["kd"], r["cpc"], "dataforseo", "high"))

    for label, fn in (
        ("keyword_suggestions", lambda: _dfs.keyword_suggestions(seed, limit=limit, database=database)),
        ("related_keywords", lambda: _dfs.related_keywords(seed, limit=limit, database=database)),
        ("keyword_ideas", lambda: _dfs.keyword_ideas([seed], limit=limit, database=database)),
    ):
        if len(rows) >= limit:
            break
        try:
            take(fn())
        except Exception as e:
            if type(e).__name__ == "BudgetExceeded":
                raise
            _note(f"DataForSEO {label} skipped for '{seed}' ({str(e)[:80]})")
    return rows


def _dfs_fail(seed_label: str, exc: Exception) -> None:
    """Budget/auth failures kill the rung for the process; others are one-offs."""
    name = type(exc).__name__
    msg = str(exc)[:120]
    if _dfs and name == "BudgetExceeded":
        _DEAD.add("dataforseo")
        _note(f"DataForSEO budget cap hit ({msg}) — demoting to SEMRUSH")
        return
    if "credential" in msg.lower() or "HTTP 401" in msg or "HTTP 402" in msg or "40104" in msg:
        _DEAD.add("dataforseo")
    _note(f"DataForSEO unavailable for {seed_label} ({msg}) — falling through")


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
# RULE 1 — BEST AVAILABLE SOURCE PER FIELD, with ranked backups
# --------------------------------------------------------------------------
#
# Each FIELD has its own quality-ranked provider list. The best provider that
# is actually usable wins that field for the WHOLE run, so every row's volume
# comes from one vendor and every row's KD comes from one vendor — rows stay
# comparable to each other, which was the reason for the no-blending rule.
# Different FIELDS may legitimately come from different vendors, because the
# vendors are not equally good at all of them:
#
#   volume  — Ahrefs/SEMRUSH model finer-grained numbers from clickstream;
#             DataForSEO reports Google's own counts but ROUNDED INTO BUCKETS
#             (10/20/50/390/4400) and with close variants merged. Ahrefs first
#             on quality, DataForSEO as the always-available backup.
#   kd      — Ahrefs KD is calibrated against a real link graph and is the
#             industry reference; SEMRUSH KDI is well established; DataForSEO
#             Labs KD is MODELED and the least proven of the three. Nothing in
#             this fleet gates on KD (floors score volume only), so a weaker KD
#             costs ranking judgement, not dropped rows.
#   expand  — Ahrefs and SEMRUSH have larger, cleaner idea databases, and
#             SEMRUSH has a dedicated questions report. DataForSEO's broad
#             keyword_ideas needs the tightest-first ordering in _dfs_expand to
#             stay on-topic at all.
#
# SERP data is deliberately NOT in this table: no other vendor sells live SERP
# with PAA and AI Overview citations, so there is no ladder to rank. See
# scripts/lib/serp.py.

FIELD_ORDER = {
    "volume": ("ahrefs", "dataforseo", "semrush"),
    "kd":     ("ahrefs", "semrush", "dataforseo"),
    "expand": ("ahrefs", "semrush", "dataforseo"),
}

_FIELD_PROVIDER: dict[str, str | None] = {}


def _provider_usable(name: str, database: str) -> bool:
    """Cheap probe. Never raises — an unusable provider is skipped, not fatal."""
    if name in _DEAD:
        return False
    try:
        if name == "dataforseo":
            return _dfs_on()
        if name == "semrush":
            _semrush_csv({"type": "phrase_these", "database": database,
                          "phrase": "seo", "export_columns": "Ph,Nq"})
            return True
        if name == "ahrefs":
            _ahrefs_get("overview", {"country": database, "keywords": "seo",
                                     "select": "keyword,volume"})
            return True
    except Exception as e:
        _DEAD.add(name)
        _note(f"{name} unusable ({str(e)[:100]})")
    return False


def field_provider(field: str, database: str = "us") -> str | None:
    """Best usable provider for one field. Resolved once, then reused."""
    cur = _FIELD_PROVIDER.get(field)
    if cur is not None and cur not in _DEAD:
        return cur
    for name in FIELD_ORDER[field]:
        if _provider_usable(name, database):
            if cur and cur != name:
                _note(f"{field}: {cur} died mid-run -> {name}")
            else:
                _note(f"{field}: using {name} "
                      f"(quality order {' > '.join(FIELD_ORDER[field])})")
            _FIELD_PROVIDER[field] = name
            return name
    if cur is not None or field not in _FIELD_PROVIDER:
        _note(f"{field}: no provider usable — "
              + ("autocomplete estimate only" if field != "kd" else "KD omitted"))
    _FIELD_PROVIDER[field] = None
    return None


def provider(database: str = "us") -> str | None:
    """Back-compat: the provider answering the volume field."""
    return field_provider("volume", database)


def _died(name: str, exc: Exception) -> None:
    if name == "dataforseo":
        _dfs_fail("call", exc)
    else:
        _DEAD.add(name)
        _note(f"{name} failed ({str(exc)[:100]})")


# ----------------------------------------------------- per-provider fetchers

def _fetch_volumes(name: str, phrases: list[str], database: str) -> dict[str, dict]:
    if name == "dataforseo":
        return _dfs_volumes(phrases, database)
    if name == "semrush":
        return _semrush_volumes(phrases, database)
    return _ahrefs_volumes(phrases, database)


def _fetch_expand(name: str, seed: str, limit: int, database: str) -> list[dict]:
    if name == "dataforseo":
        return _dfs_expand(seed, limit, database)
    if name == "semrush":
        return _semrush_expand(seed, limit, database)
    return _ahrefs_expand(seed, limit, database)


def _fetch_kd(name: str, phrases: list[str], database: str) -> dict[str, int]:
    """KD only, keyed by lowercase phrase."""
    out: dict[str, int] = {}
    if name == "dataforseo":
        return _dfs.keyword_difficulty(phrases, database) if _dfs else {}
    if name == "semrush":
        for i in range(0, len(phrases), 100):
            for r in _semrush_csv({"type": "phrase_kdi", "database": database,
                                   "phrase": ";".join(phrases[i:i + 100]),
                                   "export_columns": "Ph,Kd"}):
                kd = r.get("Keyword Difficulty Index", "")
                if kd not in ("", None):
                    out[r.get("Keyword", "").lower()] = _num(kd)
        return out
    for i in range(0, len(phrases), 50):
        chunk = [p for p in phrases[i:i + 50] if "," not in p]
        if not chunk:
            continue
        data = _ahrefs_get("overview", {"country": database,
                                        "keywords": ",".join(chunk),
                                        "select": "keyword,difficulty"})
        for r in data.get("keywords", []):
            if r.get("difficulty") is not None:
                out[r.get("keyword", "").lower()] = _num(r.get("difficulty"))
        time.sleep(0.2)
    return out


# --------------------------------------------------------------------------
# RULE 2 — Google Autocomplete ALWAYS runs, additively, on top
# --------------------------------------------------------------------------

def _enrich_on() -> bool:
    return os.environ.get("AUTOCOMPLETE_ENRICH", "").strip() != "0"


# Corroborating a row costs ~0.7s. Cap it so a 500-phrase batch cannot stall a
# routine; the cap is announced in notes() rather than silently applied.
ENRICH_CAP = int(os.environ.get("AUTOCOMPLETE_ENRICH_CAP", "80") or 80)


def _autocomplete_signal(phrase: str, gl: str = "us") -> dict:
    hits = _suggest(phrase, gl)
    time.sleep(0.35)
    return {"completions": len(hits),
            "corroborates": any(phrase.lower() in h.lower() for h in hits)}


def _enrich_rows(rows: dict[str, dict], gl: str = "us") -> None:
    """Attach the live autocomplete signal to every row, in place."""
    if not _enrich_on():
        return
    targets = [k for k, r in rows.items() if "autocomplete" not in r]
    if len(targets) > ENRICH_CAP:
        _note(f"Autocomplete corroboration capped at {ENRICH_CAP} of {len(targets)}"
              " rows (raise AUTOCOMPLETE_ENRICH_CAP to widen)")
        targets = targets[:ENRICH_CAP]
    for k in targets:
        rows[k]["autocomplete"] = _autocomplete_signal(rows[k]["keyword"], gl)
    if targets:
        corr = sum(1 for k in targets if rows[k]["autocomplete"]["corroborates"])
        _note(f"Autocomplete: {corr}/{len(targets)} rows corroborated live")


# --------------------------------------------------------------------------
# Public API
# --------------------------------------------------------------------------

def provider_status(database: str = "us") -> dict:
    """Probe every provider once, and report which field each one won."""
    st = {}
    if not _dfs:
        st["dataforseo"] = "unavailable: client module not importable"
    elif not _dfs.available():
        st["dataforseo"] = "off: DFS_ENABLED=0 or no credentials"
    else:
        try:
            acct = _dfs.account()
            st["dataforseo"] = f"ok (balance ${acct.get('balance')})"
        except Exception as e:
            st["dataforseo"] = f"unavailable: {str(e)[:100]}"
    try:
        _semrush_csv({"type": "phrase_these", "database": database,
                      "phrase": "seo", "export_columns": "Ph,Nq"})
        st["semrush"] = "ok"
    except RuntimeError as e:
        st["semrush"] = f"unavailable: {e}"
    try:
        _ahrefs_get("overview", {"country": database, "keywords": "seo",
                                 "select": "keyword,volume"})
        st["ahrefs"] = "ok"
    except RuntimeError as e:
        st["ahrefs"] = f"unavailable: {e}"
    st["autocomplete"] = "ok" if _suggest("seo") else "unavailable: no response"
    st["selected"] = {f: field_provider(f, database) for f in FIELD_ORDER}
    return st


def volumes(phrases, database: str = "us", allow_estimate: bool = True) -> dict[str, dict]:
    """Volume/KD/CPC per phrase, keyed by lowercase phrase.

    Volume and KD are resolved from their own quality ladders, so a row can
    carry Ahrefs KD alongside DataForSEO volume. Both `source` (volume) and
    `kd_source` are stamped on every row so a chart can say where each number
    came from. Autocomplete always runs on top.
    """
    phrases = [p for p in dict.fromkeys(p.strip() for p in phrases) if p]
    if not phrases:
        return {}
    out: dict[str, dict] = {}

    # --- volume: one provider for the whole run ---------------------------
    while True:
        vp = field_provider("volume", database)
        if not vp:
            break
        try:
            out.update(_fetch_volumes(vp, phrases, database))
            _note(f"{vp} returned volume for {len(out)}/{len(phrases)} phrases")
            break
        except Exception as e:
            _died(vp, e)
            if vp not in _DEAD:      # transient, not worth another rung
                break
    for r in out.values():
        r["kd_source"] = r.get("source", "")

    # --- kd: its own ladder; only overwrite when a better source answers --
    kp = field_provider("kd", database)
    if kp and out:
        vp_now = _FIELD_PROVIDER.get("volume")
        if kp != vp_now or not any(r.get("kd") not in ("", None) for r in out.values()):
            try:
                kd = _fetch_kd(kp, [r["keyword"] for r in out.values()], database)
                hits = 0
                for k, r in out.items():
                    if k in kd:
                        r["kd"], r["kd_source"], hits = kd[k], kp, hits + 1
                if hits:
                    _note(f"KD from {kp} for {hits} rows"
                          + (f" (volume came from {vp_now})" if kp != vp_now else ""))
            except Exception as e:
                _died(kp, e)
                _note("KD unavailable — rows keep whatever KD the volume provider gave")

    # --- phrases nobody had: autocomplete band, clearly labelled ----------
    pending = [p for p in phrases if p.lower() not in out]
    if pending and allow_estimate:
        _note(f"No tool volume for {len(pending)} phrases — autocomplete band "
              "(source=estimate, NOT measured)")
        out.update(_estimate_volumes(pending, database))

    # --- RULE 2: autocomplete always runs on top --------------------------
    _enrich_rows(out, database)
    return out


def expand(seed: str, limit: int = 20, database: str = "us") -> list[dict]:
    """Keyword ideas for one seed: best provider PLUS live autocomplete, always.

    Autocomplete is additive here, not a fallback — its suggestions are merged
    into the provider's ideas so real live long-tail is never missed.
    """
    rows: list[dict] = []
    ep = field_provider("expand", database)
    if ep:
        try:
            rows = _fetch_expand(ep, seed, limit, database)
            _note(f"{ep} expanded '{seed}' -> {len(rows)} ideas")
        except Exception as e:
            _died(ep, e)

    if not _enrich_on():
        return rows[:limit]

    have = {r["keyword"].lower() for r in rows}
    extra = [s for s in _estimate_expand(seed, limit, database)
             if s["keyword"].lower() not in have]
    if extra:
        _note(f"Autocomplete added {len(extra)} live ideas '{seed}' "
              f"({'no provider' if not ep else ep + ' missed them'})")
    return (rows + extra)[:limit] if rows else extra[:limit]


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
