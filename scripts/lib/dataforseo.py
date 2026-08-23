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
  * keywords_data/google_ads/search_volume is charged FLAT PER REQUEST for
    1..1000 keywords ($0.09 measured). Sending one keyword per call instead of
    batching is the difference between $0.09 and $90 for the same data, so
    batching is enforced here, not left to the caller.
  * Every call's returned `cost` is accumulated. Once DFS_MAX_COST_USD is hit
    the client raises BudgetExceeded and the ladder demotes to the next rung
    rather than spending unbounded money in an unattended cloud routine.

KILL SWITCH: set DFS_ENABLED=0 to make available() return False, which takes
this rung out of the ladder without editing any code.

Measured prices on this account (2026-08-23), for the cost model:
  serp/google/organic/live/advanced   $0.00415  (depth 20 + PAA click depth 1)
  keywords_data/.../search_volume     $0.09     flat, 1-1000 keywords
  labs/keyword_ideas                  $0.012 base + ~$0.00012/item
  labs/bulk_keyword_difficulty        $0.01236 for 3 keywords
  labs/search_intent                  $0.01236 for 3 keywords

Stdlib only. No pip installs.
"""
from __future__ import annotations

import base64
import json
import os
import sys
import urllib.error
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
SEARCH_VOLUME_BATCH = 1000   # hard API max, and the whole point of batching


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


def _post(path: str, payload: list[dict]) -> dict:
    """POST one task array. Accumulates cost, enforces the budget cap."""
    global _SPENT
    cred = _auth()
    if not cred:
        raise DFSError("no DataForSEO credentials")
    if _SPENT >= budget():
        raise BudgetExceeded(f"spent ${_SPENT:.4f} >= cap ${budget():.2f}")

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

def search_volume(phrases: list[str], database: str = "us") -> dict[str, dict]:
    """Real Google Ads volume/competition/CPC, keyed by lowercase phrase.

    BATCHED — flat price per request, so we send up to 1000 phrases at a time.
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


def serp_organic(keyword: str, database: str = "us", depth: int = 20,
                 paa_depth: int = 1) -> dict:
    """One live Google SERP, advanced. Raw payload — see serp.py for the verdict."""
    body = _post("serp/google/organic/live/advanced",
                 [{"keyword": keyword, "location_code": _loc(database),
                   "language_code": "en", "device": "desktop", "depth": depth,
                   "people_also_ask_click_depth": paa_depth}])
    res = _task_result(body)
    return res[0] if res else {}


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
            "balance": (res.get("money") or {}).get("balance")}


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
            print(json.dumps({"rows": search_volume(a.phrase),
                              "cost": cost_summary()}, indent=1)); return 0
        print(json.dumps({"rows": keyword_ideas(a.seed, a.limit, min_volume=a.min_volume),
                          "cost": cost_summary()}, indent=1)); return 0
    except (DFSError, BudgetExceeded) as exc:
        print(json.dumps({"error": str(exc), "cost": cost_summary()}, indent=1))
        return 0


if __name__ == "__main__":
    sys.exit(main())
