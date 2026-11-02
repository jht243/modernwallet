#!/usr/bin/env python3
"""DataForSEO API v3 client — the measured-demand rung of the keyword ladder.

Why this exists: SEMRUSH requires a ~$549/mo plan before unit one and its units
on this account are dry; Ahrefs caps rows per request by plan tier. DataForSEO
is pay-as-you-go with no subscription floor, so a routine can always get REAL
volume/KD instead of falling through to the autocomplete estimate rung.

Consumers should NOT import this directly — call scripts/lib/keyword_data.py,
which walks dataforseo -> semrush -> ahrefs -> estimate and normalizes rows.
This module is the transport + cost discipline layer only.

COST DISCIPLINE (the whole reason this file is separate):
  * Volume + KD come from ONE labs/keyword_overview call (keyword_overview(),
    $0.0132 measured for 12 phrases). The old pair — google_ads/search_volume at
    a FLAT $0.09 per request plus bulk_keyword_difficulty — cost $0.10 per
    routine run; 58 runs a day across the fleet was $5.90/day (2026-11-02).
    search_volume() is kept for callers that need Google Ads' own numbers.
  * Rows are cached in Supabase (dfs_keyword_cache, CACHE_DAYS) so the same
    phrase is never bought twice in a month; "no data" is cached too.
  * Every call's returned `cost` is accumulated. Once DFS_MAX_COST_USD is hit
    the client raises BudgetExceeded and the ladder demotes to the next rung
    rather than spending unbounded money in an unattended cloud routine.
  * FLEET CAP: every paid call is logged to Supabase (dfs_spend) and the client
    refuses to spend once today's fleet-wide total passes
    FLEET_DFS_DAILY_CAP_USD (default $4). The per-process cap alone never
    bounded the day: 25 sites x several routines x $2.
  * Every task carries a `tag` ("<routine>|<site>", DFS_TAG to override) so
    DataForSEO's own task log attributes spend without guessing from timestamps.
  Both Supabase features need SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and
  fail OPEN (no cache, no fleet cap) when they are missing or unreachable.

KILL SWITCH: set DFS_ENABLED=0 to make available() return False, which takes
this rung out of the ladder without editing any code.

Measured prices on this account, for the cost model:
  serp/google/organic/live/advanced   $0.002    depth 10 (2026-11-01); $0.004 at depth 20
  labs/keyword_overview               $0.0132   for 12 keywords (2026-11-02), volume+CPC+KD
  keywords_data/.../search_volume     $0.09     flat, 1-1000 keywords
  labs/keyword_ideas                  $0.012 base + ~$0.00012/item
  labs/bulk_keyword_difficulty        $0.01236 for 3 keywords
  labs/search_intent                  $0.01236 for 3 keywords

Stdlib only. No pip installs.
"""
from __future__ import annotations

import base64
import datetime as _dt
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.dataforseo.com/v3"
_UA = {"User-Agent": "Layer3Labs-SEO-Research/1.0"}

# Same resolution order as every other key in the fleet. Duplicated from
# keyword_data.resolve_key rather than imported, because keyword_data imports
# THIS module — importing back would be a cycle.
SECRETS_FILES = [
    os.path.join(os.getcwd(), ".claude", "routines.config"),
    os.path.expanduser("~/.claude/secrets.env"),
]

DEFAULT_MAX_COST = 2.00      # USD per process, override with DFS_MAX_COST_USD
DEFAULT_FLEET_DAILY_CAP = 4.00  # USD per UTC day across EVERY repo, override with FLEET_DFS_DAILY_CAP_USD
SEARCH_VOLUME_BATCH = 1000   # hard API max, and the whole point of batching
KEYWORD_OVERVIEW_BATCH = 700  # hard API max for labs/keyword_overview
CACHE_DAYS = 30              # a phrase's volume/KD is reused this long before it is bought again


class BudgetExceeded(RuntimeError):
    """Raised when the accumulated spend would pass DFS_MAX_COST_USD."""


class DFSError(RuntimeError):
    """Any transport/API failure. The ladder treats these as 'demote a rung'."""


def resolve_key(name: str) -> str:
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


def _auth() -> str:
    """Base64 of login:password. Prefers a pre-encoded DATAFORSEO_B64."""
    b64 = resolve_key("DATAFORSEO_B64")
    if b64:
        return b64
    login = resolve_key("DATAFORSEO_LOGIN")
    password = resolve_key("DATAFORSEO_PASSWORD")
    if not (login and password):
        return ""
    return base64.b64encode(f"{login}:{password}".encode()).decode()


def available() -> bool:
    """False = this rung is off (kill switch) or has no credentials."""
    if os.environ.get("DFS_ENABLED", "").strip() == "0":
        return False
    return bool(_auth())


# ---------------------------------------------------------------- cost ledger
_SPENT = 0.0
_CALLS: list[tuple[str, float]] = []


def spent() -> float:
    return round(_SPENT, 5)


def call_log() -> list[tuple[str, float]]:
    return list(_CALLS)


def budget() -> float:
    try:
        return float(os.environ.get("DFS_MAX_COST_USD", "") or DEFAULT_MAX_COST)
    except ValueError:
        return DEFAULT_MAX_COST


def cost_summary() -> str:
    return f"DataForSEO: {len(_CALLS)} calls, ${spent():.5f} of ${budget():.2f} budget"


# ------------------------------------------------- Supabase: cache + fleet cap
# Fail OPEN: a missing key or a Supabase hiccup must never block a routine. The
# worst case is the pre-2026-11-02 behaviour (every phrase bought, per-process
# cap only).

def _sb() -> tuple[str, str]:
    url = resolve_key("SUPABASE_URL").rstrip("/")
    key = resolve_key("SUPABASE_SERVICE_ROLE_KEY")
    return (url, key) if url and key else ("", "")


def _sb_req(method: str, path: str, body=None, prefer: str = ""):
    """One PostgREST call; parsed JSON, [] for an empty body, None on ANY failure."""
    url, key = _sb()
    if not url:
        return None
    headers = {**_UA, "apikey": key, "Authorization": f"Bearer {key}",
               "Content-Type": "application/json"}
    if prefer:
        headers["Prefer"] = prefer
    req = urllib.request.Request(f"{url}/rest/v1/{path}", method=method, headers=headers,
                                 data=None if body is None else json.dumps(body).encode())
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            raw = r.read().decode("utf-8", "replace").strip()
            return json.loads(raw) if raw else []
    except Exception:
        return None


def _tag() -> str:
    """'<routine>|<site>' stamped on every task — DataForSEO keeps it in its own
    task log (free), so a cost question is one id_list query, not timestamp forensics."""
    explicit = os.environ.get("DFS_TAG", "").strip()
    if explicit:
        return explicit[:255]
    routine = (os.environ.get("ROUTINE_NAME", "").strip()
               or os.path.splitext(os.path.basename(sys.argv[0] or ""))[0] or "python")
    site = os.environ.get("OUR_DOMAIN", "").strip() or os.path.basename(os.getcwd())
    return re.sub(r"[^A-Za-z0-9 _.|:/-]", "", f"{routine}|{site}")[:255]


def fleet_cap() -> float:
    try:
        return float(os.environ.get("FLEET_DFS_DAILY_CAP_USD", "") or DEFAULT_FLEET_DAILY_CAP)
    except ValueError:
        return DEFAULT_FLEET_DAILY_CAP


_FLEET_TODAY: float | None = None   # today's fleet total at first call; this process adds to it


def fleet_spent_today() -> float | None:
    """Sum of every repo's paid calls today (dfs_spend), or None when Supabase is off."""
    global _FLEET_TODAY
    if _FLEET_TODAY is None:
        got = _sb_req("POST", "rpc/dfs_spent_today", {})
        if isinstance(got, (int, float, str)):
            try:
                _FLEET_TODAY = float(got)
            except ValueError:
                _FLEET_TODAY = None
    return _FLEET_TODAY


def _post(path: str, payload: list[dict]) -> dict:
    """POST one task array. Tags every task, accumulates cost, enforces both caps."""
    global _SPENT, _FLEET_TODAY
    cred = _auth()
    if not cred:
        raise DFSError("no DataForSEO credentials")
    if _SPENT >= budget():
        raise BudgetExceeded(f"spent ${_SPENT:.4f} >= cap ${budget():.2f}")
    fleet = fleet_spent_today()
    if fleet is not None and fleet >= fleet_cap():
        raise BudgetExceeded(f"fleet spent ${fleet:.2f} today >= daily cap ${fleet_cap():.2f}")

    tag = _tag()
    for task in payload:
        if isinstance(task, dict):
            task.setdefault("tag", tag)

    req = urllib.request.Request(
        f"{API}/{path}",
        data=json.dumps(payload).encode(),
        headers={**_UA, "Authorization": f"Basic {cred}",
                 "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            body = json.loads(r.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode("utf-8", "replace")[:200]
        except Exception:
            pass
        raise DFSError(f"HTTP {e.code} {detail}")
    except Exception as e:
        raise DFSError(str(e)[:200])

    cost = float(body.get("cost") or 0)
    _SPENT += cost
    _CALLS.append((path, cost))
    if cost > 0:
        if _FLEET_TODAY is not None:
            _FLEET_TODAY += cost
        _sb_req("POST", "dfs_spend", {"usd": round(cost, 5), "path": path, "tag": tag},
                prefer="return=minimal")

    if body.get("status_code") != 20000:
        raise DFSError(f"{body.get('status_code')} {body.get('status_message')}")
    return body


def _task_result(body: dict) -> list:
    """First task's result list, or [] — a task can fail while the call is Ok."""
    tasks = body.get("tasks") or []
    if not tasks:
        return []
    t = tasks[0]
    if t.get("status_code") != 20000:
        raise DFSError(f"task {t.get('status_code')} {t.get('status_message')}")
    return t.get("result") or []


def _num(v, cast=int, default=0):
    try:
        if v in (None, "", "null"):
            return default
        return cast(float(v))
    except (TypeError, ValueError):
        return default


def _loc(database: str) -> int:
    """Ladder databases are SEMRUSH-style country codes; map to location_code."""
    return {"us": 2840, "uk": 2826, "gb": 2826, "ca": 2124, "au": 2036,
            "de": 2276, "fr": 2250, "es": 2724, "it": 2380, "in": 2356}.get(
        (database or "us").lower(), 2840)


# ------------------------------------------------------------------ endpoints

def _cache_row(r: dict) -> dict:
    return {"keyword": r.get("keyword") or "",
            "volume": _num(r.get("volume")),
            "cpc": "" if r.get("cpc") in (None, "") else round(float(r["cpc"]), 2),
            "competition": r.get("competition") or "",
            "kd": "" if r.get("kd") in (None, "") else _num(r["kd"])}


def _cache_get(keys: list[str], loc: int) -> dict[str, dict | None]:
    """Cached rows younger than CACHE_DAYS, keyed by lowercase phrase.
    None = DataForSEO had no data for it last time (do not buy it again)."""
    found: dict[str, dict | None] = {}
    since = (_dt.datetime.now(_dt.timezone.utc) - _dt.timedelta(days=CACHE_DAYS)).isoformat()
    for i in range(0, len(keys), 60):
        quoted = ",".join('"' + k.replace('"', "").replace("\\", "") + '"' for k in keys[i:i + 60])
        rows = _sb_req("GET", "dfs_keyword_cache?select=keyword,volume,cpc,competition,kd"
                              f"&location_code=eq.{loc}&fetched_at=gte.{urllib.parse.quote(since)}"
                              f"&keyword=in.({urllib.parse.quote(quoted)})")
        if rows is None:
            return found                 # Supabase off -> buy everything, as before
        for r in rows:
            k = (r.get("keyword") or "").lower()
            found[k] = None if r.get("volume") is None else _cache_row(r)
    return found


def _cache_put(rows: list[dict], loc: int) -> None:
    now = _dt.datetime.now(_dt.timezone.utc).isoformat()
    body = [{"keyword": r["keyword"].lower(), "location_code": loc,
             "volume": r["volume"],
             "cpc": None if r["cpc"] == "" else r["cpc"],
             "competition": r["competition"] or None,
             "kd": None if r["kd"] == "" else r["kd"],
             "fetched_at": now} for r in rows if r.get("keyword")]
    if body:
        _sb_req("POST", "dfs_keyword_cache?on_conflict=keyword,location_code", body,
                prefer="resolution=merge-duplicates,return=minimal")


def keyword_overview(phrases: list[str], database: str = "us",
                     use_cache: bool = True) -> dict[str, dict]:
    """Volume / CPC / competition / KD in ONE Labs call, keyed by lowercase phrase.

    Replaces search_volume() + keyword_difficulty() for the ladder: $0.0132 for
    12 phrases instead of $0.09 + $0.013 (measured 2026-11-02). Up to 700
    phrases per request. Phrases DataForSEO has no row for are left out (the
    ladder's estimate rung takes them) and cached as volume NULL so they are
    not bought again for CACHE_DAYS.
    """
    out: dict[str, dict] = {}
    clean: list[str] = []
    seen: set[str] = set()
    for p in phrases:
        p = (p or "").strip()
        if len(p) >= 3 and p.lower() not in seen:
            seen.add(p.lower())
            clean.append(p)
    loc = _loc(database)
    todo = clean
    if use_cache and clean:
        cached = _cache_get([p.lower() for p in clean], loc)
        todo = [p for p in clean if p.lower() not in cached]
        out.update({k: r for k, r in cached.items() if r is not None})
    fresh: list[dict] = []
    for i in range(0, len(todo), KEYWORD_OVERVIEW_BATCH):
        chunk = todo[i:i + KEYWORD_OVERVIEW_BATCH]
        body = _post("dataforseo_labs/google/keyword_overview/live",
                     [{"keywords": chunk, "location_code": loc, "language_code": "en"}])
        got: set[str] = set()
        for res in _task_result(body):
            for it in (res.get("items") or []):
                kw = (it.get("keyword") or "").strip()
                ki = it.get("keyword_info") or {}
                kp = it.get("keyword_properties") or {}
                if not kw or ki.get("search_volume") is None:
                    continue
                row = _cache_row({"keyword": kw, "volume": ki.get("search_volume"),
                                  "cpc": ki.get("cpc"), "competition": ki.get("competition_level"),
                                  "kd": kp.get("keyword_difficulty")})
                out[kw.lower()] = row
                got.add(kw.lower())
                fresh.append(row)
        fresh.extend({"keyword": p, "volume": None, "cpc": "", "competition": "", "kd": ""}
                     for p in chunk if p.lower() not in got)
    if use_cache and fresh:
        _cache_put(fresh, loc)
    return out


def search_volume(phrases: list[str], database: str = "us") -> dict[str, dict]:
    """Real Google Ads volume/competition/CPC, keyed by lowercase phrase.

    $0.09 FLAT per request — prefer keyword_overview() unless Google Ads' own
    numbers are required. BATCHED: up to 1000 phrases at a time.
    """
    out: dict[str, dict] = {}
    clean = [p.strip() for p in phrases if p and len(p.strip()) >= 3]
    for i in range(0, len(clean), SEARCH_VOLUME_BATCH):
        chunk = clean[i:i + SEARCH_VOLUME_BATCH]
        body = _post("keywords_data/google_ads/search_volume/live",
                     [{"keywords": chunk, "location_code": _loc(database),
                       "language_code": "en"}])
        for r in (_task_result(body) or []):
            kw = (r.get("keyword") or "").strip()
            if not kw or r.get("search_volume") is None:
                continue  # no data for this phrase -> let the next rung try
            out[kw.lower()] = {
                "keyword": kw,
                "volume": _num(r.get("search_volume")),
                "cpc": "" if r.get("cpc") is None else round(float(r["cpc"]), 2),
                "competition": r.get("competition") or "",
            }
    return out


def keyword_difficulty(phrases: list[str], database: str = "us") -> dict[str, int]:
    """KD 0-100 keyed by lowercase phrase. Max 1000 per request."""
    out: dict[str, int] = {}
    clean = [p.strip() for p in phrases if p and len(p.strip()) >= 3]
    for i in range(0, len(clean), 1000):
        body = _post("dataforseo_labs/google/bulk_keyword_difficulty/live",
                     [{"keywords": clean[i:i + 1000], "location_code": _loc(database),
                       "language_code": "en"}])
        for res in _task_result(body):
            for it in (res.get("items") or []):
                kd = it.get("keyword_difficulty")
                if kd is not None:
                    out[(it.get("keyword") or "").lower()] = _num(kd)
    return out


def search_intent(phrases: list[str]) -> dict[str, str]:
    """Main intent label (informational/commercial/navigational/transactional)."""
    out: dict[str, str] = {}
    clean = [p.strip() for p in phrases if p and len(p.strip()) >= 3]
    for i in range(0, len(clean), 1000):
        body = _post("dataforseo_labs/google/search_intent/live",
                     [{"keywords": clean[i:i + 1000], "language_code": "en"}])
        for res in _task_result(body):
            for it in (res.get("items") or []):
                label = (it.get("keyword_intent") or {}).get("label")
                if label:
                    out[(it.get("keyword") or "").lower()] = label
    return out


def keyword_ideas(seeds: list[str], limit: int = 300, database: str = "us",
                  min_volume: int = 0) -> list[dict]:
    """Expansion around seeds, sorted by volume. Up to 200 seeds in one call.

    Returns raw-ish dicts: keyword, volume, kd, cpc, intent.
    """
    seeds = [s.strip() for s in seeds if s and len(s.strip()) >= 3][:200]
    if not seeds:
        return []
    task: dict = {"keywords": seeds, "location_code": _loc(database),
                  "language_code": "en", "limit": min(limit, 1000),
                  "order_by": ["keyword_info.search_volume,desc"]}
    if min_volume:
        task["filters"] = [["keyword_info.search_volume", ">", min_volume]]
    body = _post("dataforseo_labs/google/keyword_ideas/live", [task])
    rows = []
    for res in _task_result(body):
        for it in (res.get("items") or []):
            ki = it.get("keyword_info") or {}
            kp = it.get("keyword_properties") or {}
            rows.append({
                "keyword": it.get("keyword") or "",
                "volume": _num(ki.get("search_volume")),
                "kd": "" if kp.get("keyword_difficulty") is None else _num(kp["keyword_difficulty"]),
                "cpc": "" if ki.get("cpc") is None else round(float(ki["cpc"]), 2),
                "intent": (it.get("search_intent_info") or {}).get("main_intent") or "",
            })
    return rows


def keyword_suggestions(seed: str, limit: int = 200, database: str = "us",
                        min_volume: int = 0) -> list[dict]:
    """Long-tail keywords CONTAINING the seed phrase — the tightest expansion.

    Prefer this over keyword_ideas for a named topic: keyword_ideas broad-matches
    and will happily return "framework computers" for "ai governance framework".
    """
    task: dict = {"keyword": seed.strip(), "location_code": _loc(database),
                  "language_code": "en", "limit": min(limit, 1000),
                  "order_by": ["keyword_info.search_volume,desc"]}
    if min_volume:
        task["filters"] = [["keyword_info.search_volume", ">", min_volume]]
    body = _post("dataforseo_labs/google/keyword_suggestions/live", [task])
    rows = []
    for res in _task_result(body):
        for it in (res.get("items") or []):
            ki = it.get("keyword_info") or {}
            kp = it.get("keyword_properties") or {}
            rows.append({
                "keyword": it.get("keyword") or "",
                "volume": _num(ki.get("search_volume")),
                "kd": "" if kp.get("keyword_difficulty") is None else _num(kp["keyword_difficulty"]),
                "cpc": "" if ki.get("cpc") is None else round(float(ki["cpc"]), 2),
                "intent": (it.get("search_intent_info") or {}).get("main_intent") or "",
            })
    return rows


def related_keywords(seed: str, limit: int = 200, database: str = "us",
                     depth: int = 2) -> list[dict]:
    """The 'searches related to' graph around one seed — question/long-tail rich."""
    body = _post("dataforseo_labs/google/related_keywords/live",
                 [{"keyword": seed.strip(), "location_code": _loc(database),
                   "language_code": "en", "depth": depth, "limit": min(limit, 1000)}])
    rows = []
    for res in _task_result(body):
        for it in (res.get("items") or []):
            kd_ = it.get("keyword_data") or {}
            ki = kd_.get("keyword_info") or {}
            kp = kd_.get("keyword_properties") or {}
            rows.append({
                "keyword": kd_.get("keyword") or "",
                "volume": _num(ki.get("search_volume")),
                "kd": "" if kp.get("keyword_difficulty") is None else _num(kp["keyword_difficulty"]),
                "cpc": "" if ki.get("cpc") is None else round(float(ki["cpc"]), 2),
                "intent": "",
            })
    return rows


def serp_organic(keyword: str, database: str = "us", depth: int = 10,
                 paa_depth: int = 1) -> dict:
    """
    One live Google SERP, advanced. Raw payload — see serp.py for the verdict.

    depth 10 (owner 2026-11-02): the top 10 is the answer every caller reads;
    depth 20 doubled the price of ~200 routine SERPs a day. Pass depth=20 where
    positions 11-20 matter.

    paa_depth <= 0 OMITS the People-Also-Ask field entirely rather than sending
    a zero, which the API rejects as an invalid field (task error 40501). Drop
    it when you only need the organic roster: it is roughly a third of the call
    cost and none of the answer.
    """
    task = {"keyword": keyword, "location_code": _loc(database),
            "language_code": "en", "device": "desktop", "depth": depth}
    if paa_depth > 0:
        task["people_also_ask_click_depth"] = paa_depth
    body = _post("serp/google/organic/live/advanced", [task])
    res = _task_result(body)
    return res[0] if res else {}


def ranked_keywords(domain: str, limit: int = 300, database: str = "us") -> list[dict]:
    """Organic keywords a domain ranks for, highest estimated traffic first.

    The DataForSEO equivalent of SEMRUSH domain_organic / Ahrefs organic-keywords,
    used by the keyword-gap engine (scripts/lib/dfs_keyword_gap.py).
    """
    body = _post("dataforseo_labs/google/ranked_keywords/live",
                 [{"target": domain.strip(), "location_code": _loc(database),
                   "language_code": "en", "limit": min(limit, 1000),
                   "item_types": ["organic"],
                   "order_by": ["ranked_serp_element.serp_item.etv,desc"]}])
    rows = []
    for res in _task_result(body):
        for it in (res.get("items") or []):
            kd_ = it.get("keyword_data") or {}
            ki = kd_.get("keyword_info") or {}
            kp = kd_.get("keyword_properties") or {}
            si = (it.get("ranked_serp_element") or {}).get("serp_item") or {}
            rows.append({
                "keyword": kd_.get("keyword") or "",
                "volume": _num(ki.get("search_volume")),
                "kd": "" if kp.get("keyword_difficulty") is None else _num(kp["keyword_difficulty"]),
                "cpc": "" if ki.get("cpc") is None else round(float(ki["cpc"]), 2),
                "position": _num(si.get("rank_group")),
                "url": si.get("url") or "",
            })
    return rows


def competitors_domain(domain: str, limit: int = 20, database: str = "us") -> list[dict]:
    """Domains sharing the most organic keywords with `domain` (SERP overlap).

    exclude_top_domains drops youtube/reddit/wikipedia-type giants, which
    otherwise dominate every overlap list and are never real competitors.
    """
    body = _post("dataforseo_labs/google/competitors_domain/live",
                 [{"target": domain.strip(), "location_code": _loc(database),
                   "language_code": "en", "limit": min(limit, 1000),
                   "exclude_top_domains": True}])
    rows = []
    for res in _task_result(body):
        for it in (res.get("items") or []):
            dom = it.get("domain") or ""
            if not dom or dom == domain:
                continue
            rows.append({"domain": dom,
                         "intersections": _num(it.get("intersections")),
                         "avg_position": round(float(it.get("avg_position") or 0), 1)})
    return rows


def account() -> dict:
    """Balance + login. Free call — use it as a preflight."""
    cred = _auth()
    if not cred:
        raise DFSError("no DataForSEO credentials")
    req = urllib.request.Request(
        f"{API}/appendix/user_data",
        headers={**_UA, "Authorization": f"Basic {cred}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            body = json.loads(r.read().decode("utf-8", "replace"))
    except Exception as e:
        raise DFSError(str(e)[:200])
    res = ((body.get("tasks") or [{}])[0].get("result") or [{}])[0]
    return {"login": res.get("login"),
            "balance": (res.get("money") or {}).get("balance"),
            "spent_today": ((res.get("money") or {}).get("statistics") or {}).get("day", {}).get("total"),
            "fleet_logged_today": fleet_spent_today(),
            "fleet_daily_cap": fleet_cap()}


def main(argv=None) -> int:
    import argparse
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("account")
    v = sub.add_parser("volumes"); v.add_argument("--phrase", action="append", required=True)
    e = sub.add_parser("ideas"); e.add_argument("--seed", action="append", required=True)
    e.add_argument("--limit", type=int, default=50); e.add_argument("--min-volume", type=int, default=0)
    a = ap.parse_args(argv)
    try:
        if a.cmd == "account":
            print(json.dumps(account(), indent=1)); return 0
        if a.cmd == "volumes":
            print(json.dumps({"rows": keyword_overview(a.phrase),
                              "cost": cost_summary()}, indent=1)); return 0
        print(json.dumps({"rows": keyword_ideas(a.seed, a.limit, min_volume=a.min_volume),
                          "cost": cost_summary()}, indent=1)); return 0
    except (DFSError, BudgetExceeded) as exc:
        print(json.dumps({"error": str(exc), "cost": cost_summary()}, indent=1))
        return 0


if __name__ == "__main__":
    sys.exit(main())
