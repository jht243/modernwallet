#!/usr/bin/env python3
"""SEMRUSH Analytics API client — the PRIMARY source for keyword and domain data.

USER RULE 2026-11-02: SEMRUSH is used first whenever it can answer; DataForSEO
(scripts/lib/dataforseo.py) only where SEMRUSH has nothing equivalent — live
SERPs with titles/snippets, People Also Ask text, AI Overview citations, and
long-tail phrases SEMRUSH's database does not carry. Every caller here falls
back to DataForSEO on SemrushError, so a dry or missing key never blocks a run.

Prepaid API units, not dollars. Measured 2026-11-02:
  phrase_these      10 units / keyword          (volume, CPC)
  phrase_kdi        50 units / keyword          (difficulty)
  phrase_fullsearch 20 units / row              (keywords containing a seed, + intent)
  phrase_organic    10 units / row              (top-N domains/URLs, no titles)
  domain_organic    10 units / row              (ranked keywords, rise/fall/new/lost)
  domain_organic_organic 40 units / row         (competitors)
The account balance is a free call: units().

Key: SEMRUSH_API_KEY, resolved like every fleet key (env, .claude/routines.config,
~/.claude/secrets.env). Stdlib only.
"""
from __future__ import annotations

import csv
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.semrush.com/"
_UA = {"User-Agent": "Layer3Labs-SEO-Research/1.0"}
SECRETS_FILES = [
    os.path.join(os.getcwd(), ".claude", "routines.config"),
    os.path.expanduser("~/.claude/secrets.env"),
]
INTENT = {"0": "commercial", "1": "informational", "2": "navigational", "3": "transactional"}


class SemrushError(RuntimeError):
    """Key missing, units exhausted, or the API failed. Callers fall back to DataForSEO."""


def resolve_key(name: str = "SEMRUSH_API_KEY") -> str:
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


def available() -> bool:
    if os.environ.get("SEMRUSH_ENABLED", "").strip() == "0":
        return False
    return bool(resolve_key())


_DEAD = False   # a key/units failure kills SEMRUSH for the rest of the process


def report(params: dict) -> list[dict]:
    """One Analytics API report as rows. [] = SEMRUSH has no data (ERROR 50)."""
    global _DEAD
    key = resolve_key()
    if _DEAD or not key or not available():
        raise SemrushError("SEMRUSH unavailable (no key, disabled, or dead this run)")
    q = {"key": key, "export_escape": 1, "export_decode": 1, **params}
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(q), headers=_UA)
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            body = r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            _DEAD = True
        raise SemrushError(f"HTTP {e.code}")
    except Exception as e:
        raise SemrushError(str(e)[:120])
    head = body.strip()[:80]
    if head.startswith("ERROR 50"):          # NOTHING FOUND — a valid empty answer
        return []
    if head.upper().startswith("ERROR"):
        if any(c in head for c in ("132", "120", "130", "131", "134", "135")):
            _DEAD = True                      # units / key / access problems
        raise SemrushError(head)
    lines = [l for l in body.splitlines() if l.strip()]
    return list(csv.DictReader(lines, delimiter=";")) if len(lines) >= 2 else []


def units() -> int | None:
    key = resolve_key()
    if not key:
        return None
    try:
        with urllib.request.urlopen(
                f"https://www.semrush.com/users/countapiunits.html?key={urllib.parse.quote(key)}", timeout=20) as r:
            return int(r.read().decode().strip())
    except Exception:
        return None


def _int(v, default=0):
    try:
        return int(float(v)) if v not in (None, "") else default
    except (TypeError, ValueError):
        return default


def _num(v):
    try:
        return round(float(v), 2) if v not in (None, "") else ""
    except (TypeError, ValueError):
        return ""


def _host(url: str) -> str:
    return urllib.parse.urlparse(url or "").netloc.lower()


# ------------------------------------------------------------------ reports

def keyword_suggestions(seed: str, limit: int = 200, database: str = "us",
                        min_volume: int = 0) -> list[dict]:
    """Keywords CONTAINING the seed (phrase_fullsearch). Same row shape as
    dataforseo.keyword_suggestions: keyword, volume, kd, cpc, intent."""
    params = {"type": "phrase_fullsearch", "phrase": seed.strip(), "database": database,
              "display_limit": min(limit, 1000), "display_sort": "nq_desc",
              "export_columns": "Ph,Nq,Kd,Cp,In"}
    if min_volume:
        params["display_filter"] = f"+|Nq|Gt|{min_volume}"
    rows = []
    for r in report(params):
        intents = [INTENT.get(c.strip(), "") for c in (r.get("Intent") or "").split(",")]
        rows.append({"keyword": r.get("Keyword") or "", "volume": _int(r.get("Search Volume")),
                     "kd": _int(r.get("Keyword Difficulty Index"), "") if r.get("Keyword Difficulty Index") else "",
                     "cpc": _num(r.get("CPC")), "intent": next((i for i in intents if i), "")})
    return rows


def ranked_keywords(domain: str, limit: int = 300, database: str = "us") -> list[dict]:
    """Keywords a domain ranks for, highest traffic first. Same row shape as
    dataforseo.ranked_keywords: keyword, volume, kd, cpc, position, url."""
    rows = []
    for r in report({"type": "domain_organic", "domain": domain.strip(), "database": database,
                     "display_limit": min(limit, 10000), "display_sort": "tr_desc",
                     "export_columns": "Ph,Po,Nq,Kd,Cp,Ur"}):
        rows.append({"keyword": r.get("Keyword") or "", "volume": _int(r.get("Search Volume")),
                     "kd": _int(r.get("Keyword Difficulty"), "") if r.get("Keyword Difficulty") else "",
                     "cpc": _num(r.get("CPC")), "position": _int(r.get("Position")),
                     "url": r.get("Url") or ""})
    return rows


def competitors_domain(domain: str, limit: int = 20, database: str = "us") -> list[dict]:
    """Organic competitors by common keywords. Same shape as dataforseo.competitors_domain
    (avg_position is not in this report and is returned as 0)."""
    rows = []
    for r in report({"type": "domain_organic_organic", "domain": domain.strip(), "database": database,
                     "display_limit": min(limit, 100), "export_columns": "Dn,Np,Cr"}):
        d = (r.get("Domain") or "").lower()
        if d and d != domain:
            rows.append({"domain": d, "intersections": _int(r.get("Common Keywords")), "avg_position": 0})
    return rows


def organic_top(keyword: str, depth: int = 10, database: str = "us") -> list[dict]:
    """Who ranks for a keyword per SEMRUSH's database: [{domain, url, rank}].
    No titles/snippets and nothing for long-tail phrases it does not track —
    callers needing either use dataforseo.serp_organic."""
    out = []
    for i, r in enumerate(report({"type": "phrase_organic", "phrase": keyword.strip(), "database": database,
                                  "display_limit": min(depth, 100), "export_columns": "Dn,Ur"}), 1):
        url = r.get("Url") or ""
        dom = (r.get("Domain") or _host(url)).lower()
        if dom:
            out.append({"domain": dom, "url": url, "rank": i})
    return out


def domain_movers(domain: str, positions: str, limit: int = 100, database: str = "us",
                  min_volume: int = 0, extra_filter: str = "") -> list[dict]:
    """domain_organic filtered to display_positions=new|lost|rise|fall ('' = all),
    highest volume first. Raw SEMRUSH rows with the columns winner/loser needs."""
    flt = [f"+|Nq|Gt|{max(min_volume - 1, 0)}"] if min_volume else []
    if extra_filter:
        flt.append(extra_filter)
    params = {"type": "domain_organic", "domain": domain, "database": database,
              "display_limit": min(limit, 10000), "display_sort": "nq_desc",
              "export_columns": "Ph,Po,Pp,Pd,Nq,Kd,Cp,Tr,Ur,Fk,Ts"}
    if positions:
        params["display_positions"] = positions
    if flt:
        params["display_filter"] = "|".join(flt)
    return report(params)


def domain_rank(domain: str, database: str = "us") -> dict:
    rows = report({"type": "domain_ranks", "domain": domain, "database": database,
                   "export_columns": "Dn,Or,Ot"})
    r = rows[0] if rows else {}
    return {"count": _int(r.get("Organic Keywords"), None), "etv": _int(r.get("Organic Traffic"), None)}


if __name__ == "__main__":
    print(units() if sys.argv[1:] == ["units"] else __doc__)
