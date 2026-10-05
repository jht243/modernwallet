#!/usr/bin/env python3
"""Rank-drop detector — Google first-party data ONLY, hard fail otherwise.

Every number this script reports comes straight from Google:
  - Search Console Search Analytics API  (searchconsole.googleapis.com)  — rankings
  - GA4 Analytics Data API               (analyticsdata.googleapis.com)  — traffic
  - Google Search Status Dashboard       (status.search.google.com)      — update gate

No Ahrefs, no SEMrush, no DataForSEO, no estimates, no cached files. If ANY of
the Google sources cannot be reached, authenticated, or returns stale/empty or
truncated data, the script exits non-zero and writes a FAIL report. There is no
fallback rung — a run that cannot read Google stops.

What it finds (lessons from the 2026-10-04 layer3 diagnosis):
  - Compares the SAME page×query pair, never a site-wide average position
    (rank-30+ rows log no impressions, so the average hides losses — survivor
    bias): the last 14 days against that pair's BEST 14-day position in the
    ~90 days before. Best position, not peak traffic — a news spike lifts
    traffic but not position — and it catches slow slides and older losses a
    rolling 28-day baseline would absorb.
  - Classifies by position, not clicks, so a news spike fading out (impressions
    down, position held) reads as DEMAND, not a ranking loss.
  - Drops long synthetic / operator-prefixed queries (AI-agent fan-out
    searches): they make impressions, almost no clicks.
  - Requires the loss to hold in BOTH halves of the current window.
  - Detects when another page on the same site took the query (CANNIBALIZED).
  - Confirms each page's loss in GA4 organic landing-page sessions.

Exit codes: 0 ok · 10 credentials · 11 auth/permission · 12 API error ·
            13 stale data · 14 empty data · 15 truncated data

Usage:
  scripts/rank_drop/detect.py --base-url https://www.layer3labs.io \\
      --ga4-property 536785446 --out reports/rank-drop/<date>
"""

import argparse
import hashlib
import json
import os
import re
import sys
import time
import urllib.parse
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly"
GSC_API = "https://searchconsole.googleapis.com/webmasters/v3"
GA4_API = "https://analyticsdata.googleapis.com/v1beta"
STATUS_FEED = "https://status.search.google.com/incidents.json"
SOURCES = ["searchconsole.googleapis.com", "analyticsdata.googleapis.com",
           "status.search.google.com"]

GSC_PAGE = 25000          # max rows per Search Analytics request
MAX_STALENESS_DAYS = 5    # newest final GSC day must be at most this old

# thresholds
BASE_MAX_POS = 20.0       # only pairs that were on page 1-2
MIN_BASE_IMPR = 75        # impressions in the peak 14-day window for a pair to count
HISTORY_WEEKS = 13        # look back ~90 days for each pair's best position
MIN_PAGE_CLICKS_D = 1.0   # "meaningful page": >= ~90 Google clicks over the 90-day history
                          # (pages nobody visited aren't worth a rewrite, however far they slid)
MIN_DROP = 5.0            # positions lost, current window vs baseline
MIN_HALF_DROP = 4.0       # loss must also hold in each half of the current window
DEMAND_MAX_POS_MOVE = 3.0
DEMAND_MIN_IMPR_FALL = 0.5
SYNTHETIC_WORDS = 7
SYNTHETIC_PREFIX = re.compile(r'^[+%"\'(\-]|site:|inurl:|intitle:')


class HardFail(Exception):
    def __init__(self, code: int, msg: str):
        super().__init__(msg)
        self.code = code


# ── auth ──────────────────────────────────────────────────────────────────

def load_sa_info() -> dict:
    for c in (os.environ.get("GOOGLE_REPORTING_SA_JSON"),
              os.environ.get("GOOGLE_REPORTING_SA_FILE"),
              os.environ.get("GSC_SA_FILE"),
              os.path.expanduser("~/.claude/secrets/gsc-service-account.json")):
        if not c:
            continue
        if c.strip().startswith("{"):
            try:
                return json.loads(c)
            except json.JSONDecodeError:
                continue
        if Path(c).exists():
            return json.loads(Path(c).read_text())
    raise HardFail(10, "no Google service-account credentials "
                       "(GOOGLE_REPORTING_SA_JSON / GOOGLE_REPORTING_SA_FILE unset)")


def session_for(sa_info: dict, scope: str):
    try:
        import requests
        from google.auth.transport.requests import Request
        from google.oauth2 import service_account
    except ImportError as e:
        raise HardFail(10, f"missing dependency: {e} (pip install google-auth requests)")
    creds = service_account.Credentials.from_service_account_info(sa_info, scopes=[scope])
    try:
        creds.refresh(Request())
    except Exception as e:  # noqa: BLE001
        raise HardFail(11, f"Google token refresh failed for {scope}: {e}")
    s = requests.Session()
    s.headers["Authorization"] = f"Bearer {creds.token}"
    return s


def call(s, method: str, url: str, body: dict | None = None) -> dict:
    for attempt in range(4):
        try:
            r = s.request(method, url, json=body, timeout=60)
        except Exception as e:  # noqa: BLE001
            if attempt == 3:
                raise HardFail(12, f"{url}: {e}")
            time.sleep(2 ** attempt)
            continue
        if r.status_code in (401, 403):
            raise HardFail(11, f"{r.status_code} from {url}: {r.text[:300]}")
        if r.status_code in (429, 500, 502, 503) and attempt < 3:
            time.sleep(2 ** attempt + 1)
            continue
        if r.status_code >= 400:
            raise HardFail(12, f"{r.status_code} from {url}: {r.text[:300]}")
        return r.json()
    raise HardFail(12, f"{url}: retries exhausted")


# ── Search Console ────────────────────────────────────────────────────────

def gsc_rows(s, site: str, start: date, end: date, dims: list[str],
             country: str | None = None) -> list[dict]:
    url = f"{GSC_API}/sites/{urllib.parse.quote(site, safe='')}/searchAnalytics/query"
    rows, start_row = [], 0
    while True:
        body = {"startDate": start.isoformat(), "endDate": end.isoformat(),
                "dimensions": dims, "dataState": "final", "type": "web",
                "rowLimit": GSC_PAGE, "startRow": start_row}
        if country:
            body["dimensionFilterGroups"] = [{"filters": [
                {"dimension": "country", "operator": "equals", "expression": country}]}]
        batch = call(s, "POST", url, body).get("rows", [])
        rows.extend(batch)
        if len(batch) < GSC_PAGE:
            return rows
        start_row += GSC_PAGE
        if start_row >= 500000:
            raise HardFail(15, f"GSC rows exceed 500k for {dims} {start}..{end} — refusing a partial pull")


def gsc_freshest_final_day(s, site: str) -> date:
    end = date.today()
    rows = gsc_rows(s, site, end - timedelta(days=10), end, ["date"])
    days = [date.fromisoformat(r["keys"][0]) for r in rows if r.get("impressions", 0) > 0]
    if not days:
        raise HardFail(14, f"GSC returned no final data for {site} in the last 10 days")
    newest = max(days)
    if (end - newest).days > MAX_STALENESS_DAYS:
        raise HardFail(13, f"GSC final data is stale: newest day {newest} "
                           f"({(end - newest).days} days old, max {MAX_STALENESS_DAYS})")
    return newest


def check_gsc_access(s, site: str):
    sites = call(s, "GET", f"{GSC_API}/sites").get("siteEntry", [])
    ok = [x for x in sites if x["siteUrl"] == site and x.get("permissionLevel") != "siteUnverifiedUser"]
    if not ok:
        raise HardFail(11, f"service account has no verified access to GSC property {site}")


# ── GA4 ───────────────────────────────────────────────────────────────────

def ga4_organic_landing(s, prop: str, start: date, end: date) -> dict[str, int]:
    body = {"dateRanges": [{"startDate": start.isoformat(), "endDate": end.isoformat()}],
            "dimensions": [{"name": "landingPage"}],
            "metrics": [{"name": "sessions"}],
            "dimensionFilter": {"filter": {"fieldName": "sessionDefaultChannelGroup",
                                           "stringFilter": {"value": "Organic Search"}}},
            "limit": 100000}
    resp = call(s, "POST", f"{GA4_API}/properties/{prop}:runReport", body)
    if resp.get("rowCount", 0) > 100000:
        raise HardFail(15, "GA4 landing-page report truncated (>100k rows)")
    out = {}
    for r in resp.get("rows", []):
        path = r["dimensionValues"][0]["value"].split("?")[0].rstrip("/") or "/"
        out[path] = out.get(path, 0) + int(r["metricValues"][0]["value"])
    return out


def check_ga4_access(s, prop: str):
    call(s, "GET", f"{GA4_API}/properties/{prop}/metadata")


# ── Google Search Status Dashboard ────────────────────────────────────────

def google_updates(s) -> tuple[list[dict], list[dict]]:
    """(ongoing ranking updates, ranking updates in the last 60 days)."""
    import requests
    try:
        r = requests.get(STATUS_FEED, timeout=30)
        r.raise_for_status()
        feed = r.json()
    except Exception as e:  # noqa: BLE001
        raise HardFail(12, f"Google Search Status Dashboard unreachable: {e}")
    cutoff = datetime.now(timezone.utc) - timedelta(days=60)
    ongoing, recent = [], []
    for i in feed:
        if i.get("service_name") != "Ranking":
            continue
        begin = datetime.fromisoformat(i["begin"])
        row = {"name": i.get("external_desc", "").strip(), "begin": i["begin"][:10],
               "end": (i.get("end") or "")[:10] or None}
        if not i.get("end"):
            ongoing.append(row)
        if begin >= cutoff:
            recent.append(row)
    return ongoing, recent


# ── classification ────────────────────────────────────────────────────────

def is_synthetic(q: str) -> bool:
    return len(q.split()) >= SYNTHETIC_WORDS or bool(SYNTHETIC_PREFIX.search(q.strip()))


def index(rows):
    return {tuple(r["keys"]): r for r in rows}


def peak_positions(gsc, site, start: date, dims, country=None) -> dict:
    """Best sustained position per page×query: pull the history as weekly
    buckets, slide a 2-week window across them, keep the window with the LOWEST
    impression-weighted position that had real volume (>= MIN_BASE_IMPR).
    Position doesn't inflate when a news spike lifts demand, so the best
    position is a fair "what this page can rank" bar — unlike peak traffic."""
    from concurrent.futures import ThreadPoolExecutor   # 13 weekly pulls in parallel (was ~2 min serial)
    starts = [start + timedelta(days=7 * w) for w in range(HISTORY_WEEKS)]
    with ThreadPoolExecutor(max_workers=6) as ex:
        pulled = list(ex.map(lambda a: index(gsc_rows(gsc, site, a, a + timedelta(days=6), dims, country)),
                             starts))
    weeks = list(zip(starts, pulled))
    best = {}
    for i in range(HISTORY_WEEKS - 1):
        (a, w1), (_, w2) = weeks[i], weeks[i + 1]
        for k in set(w1) | set(w2):
            rows = [r for r in (w1.get(k), w2.get(k)) if r]
            impr = sum(r["impressions"] for r in rows)
            if impr < MIN_BASE_IMPR:
                continue
            pos = sum(r["position"] * r["impressions"] for r in rows) / impr
            if k not in best or pos < best[k]["position"]:
                best[k] = {"position": pos, "impressions": impr,
                           "clicks": sum(r["clicks"] for r in rows),
                           "window": [a.isoformat(), (a + timedelta(days=13)).isoformat()]}
    return best


def detect(gsc, site, base_url, ga4, prop, end: date, min_page_clicks_d: float = MIN_PAGE_CLICKS_D):
    cur_start = end - timedelta(days=13)                 # current: last 14 final days
    half = cur_start + timedelta(days=6)
    base_end = cur_start - timedelta(days=1)
    base_start = base_end - timedelta(days=7 * HISTORY_WEEKS - 1)   # history: ~90 days before
    W = {"history": [base_start.isoformat(), base_end.isoformat()],
         "current": [cur_start.isoformat(), end.isoformat()],
         "baseline_rule": "each page×query's BEST (lowest) 14-day position inside the history window"}

    dims = ["page", "query"]
    B = peak_positions(gsc, site, base_start, dims)
    C = index(gsc_rows(gsc, site, cur_start, end, dims))
    C1 = index(gsc_rows(gsc, site, cur_start, half, dims))
    C2 = index(gsc_rows(gsc, site, half + timedelta(days=1), end, dims))
    BU = peak_positions(gsc, site, base_start, dims, "usa")
    CU = index(gsc_rows(gsc, site, cur_start, end, dims, "usa"))
    if not B or not C:
        raise HardFail(14, f"GSC returned an empty page×query set (baseline {len(B)}, current {len(C)})")

    # who else on the site holds each query now (cannibalization check)
    by_query_cur = defaultdict(list)
    for (p, q), r in C.items():
        by_query_cur[q].append((p, r))

    ga_base = ga4_organic_landing(ga4, prop, base_start, base_end)
    ga_cur = ga4_organic_landing(ga4, prop, cur_start, end)
    if not ga_base and not ga_cur:
        raise HardFail(14, "GA4 returned no Organic Search landing-page sessions in either window")

    # page-level clicks (complete; page×query rows hide anonymized queries)
    PB = {r["keys"][0]: r for r in gsc_rows(gsc, site, base_start, base_end, ["page"])}
    PC = {r["keys"][0]: r for r in gsc_rows(gsc, site, cur_start, end, ["page"])}

    nb, nc, nh = 14, 14, 7 * HISTORY_WEEKS   # peak window, current window, history window
    pairs, counts = [], defaultdict(int)
    qual_impr = defaultdict(float)        # baseline impressions of every qualifying pair, per page
    for (page, q), b in B.items():
        if b["position"] > BASE_MAX_POS or b["impressions"] < MIN_BASE_IMPR:
            continue
        if is_synthetic(q):
            counts["synthetic_skipped"] += 1
            continue
        qual_impr[page] += b["impressions"]
        c = C.get((page, q))
        # prefer the US view when the pair has real US volume in the baseline
        bu, cu = BU.get((page, q)), CU.get((page, q))
        use_us = bool(bu and bu["impressions"] >= MIN_BASE_IMPR * 0.5)
        bb, cc = (bu, cu) if use_us else (b, c)

        b_impr_d = bb["impressions"] / nb
        c_impr_d = (cc["impressions"] / nc) if cc else 0.0
        lost_clicks_d = round(bb["clicks"] / nb - ((cc["clicks"] / nc) if cc else 0.0), 2)

        if cc is None or cc["impressions"] == 0:
            others = [(p, r) for p, r in by_query_cur.get(q, []) if p != page]
            taker = min(others, key=lambda x: x[1]["position"]) if others else None
            if taker and taker[1]["position"] <= bb["position"] + 2:
                cls = "CANNIBALIZED"
            else:
                cls = "VANISHED"          # gone from the logged results (rank ~30+ or demand gone)
            cur_pos = None
        else:
            cur_pos = cc["position"]
            delta = cur_pos - bb["position"]
            h1, h2 = C1.get((page, q)), C2.get((page, q))
            holds = all(h and h["position"] - bb["position"] >= MIN_HALF_DROP for h in (h1, h2))
            others = [(p, r) for p, r in by_query_cur.get(q, []) if p != page]
            taker = min(others, key=lambda x: x[1]["position"]) if others else None
            if delta >= MIN_DROP and holds:
                cls = ("CANNIBALIZED" if taker and taker[1]["position"] < cur_pos - 2
                       and taker[1]["impressions"] >= cc["impressions"] else "RANKING_LOSS")
            elif delta >= MIN_DROP:
                cls = "UNSTABLE"          # dropped but not in both halves — wait a week
            elif abs(delta) <= DEMAND_MAX_POS_MOVE and c_impr_d <= b_impr_d * (1 - DEMAND_MIN_IMPR_FALL):
                cls = "DEMAND"
            else:
                continue
        counts[cls] += 1
        pairs.append({
            "page": page, "query": q, "class": cls, "market": "US" if use_us else "global",
            "base_pos": round(bb["position"], 1), "cur_pos": round(cur_pos, 1) if cur_pos else None,
            "peak_window": bb["window"],
            "base_impr_d": round(b_impr_d, 1), "cur_impr_d": round(c_impr_d, 1),
            "base_clicks": bb["clicks"], "cur_clicks": cc["clicks"] if cc else 0,
            "lost_clicks_d": lost_clicks_d,
            "taker": taker[0] if taker and cls == "CANNIBALIZED" else None,
        })

    # roll up per page — one page is one fix
    # Roll up per page — one page is one fix. A page's lost clicks are only
    # partly a ranking problem: weight them by the share of its baseline
    # impressions sitting in loss-class queries (the rest is demand/stable).
    pages = defaultdict(lambda: {"pairs": [], "loss_impr": 0.0})
    for p in pairs:
        if p["class"] in ("RANKING_LOSS", "VANISHED", "CANNIBALIZED"):
            pages[p["page"]]["pairs"].append(p)
            pages[p["page"]]["loss_impr"] += p["base_impr_d"] * nb
    out_pages = []
    for page, v in pages.items():
        path = urllib.parse.urlparse(page).path.rstrip("/") or "/"
        gb = ga_base.get(path, 0) / nh
        gc = ga_cur.get(path, 0) / nc
        pcb = PB.get(page, {}).get("clicks", 0) / nh
        pcc = PC.get(page, {}).get("clicks", 0) / nc
        share = min(1.0, v["loss_impr"] / qual_impr[page]) if qual_impr[page] else 0.0
        attributable = round(max(pcb - pcc, 0) * share, 1)
        classes = defaultdict(int)
        for p in v["pairs"]:
            classes[p["class"]] += 1
        out_pages.append({
            "page": page, "path": path,
            "attributable_lost_clicks_d": attributable,
            "gsc_page_clicks_d": {"baseline": round(pcb, 1), "current": round(pcc, 1)},
            "loss_share": round(share, 2),
            "classes": dict(classes),
            "ga4_organic_sessions_d": {"baseline": round(gb, 1), "current": round(gc, 1),
                                       "change": round((gc - gb) / gb, 3) if gb else None},
            "ga4_confirms": bool(gb and gc < gb * 0.85),
            "pairs": sorted(v["pairs"], key=lambda x: -x["base_impr_d"])[:15],
        })
    # meaningful pages only — no cap on how many, but a page must have had real
    # Google traffic over the history window to be worth fixing
    low = [p for p in out_pages if p["gsc_page_clicks_d"]["baseline"] < min_page_clicks_d]
    counts["pages_below_traffic_floor"] = len(low)
    out_pages = [p for p in out_pages if p["gsc_page_clicks_d"]["baseline"] >= min_page_clicks_d]
    out_pages.sort(key=lambda x: (-x["ga4_confirms"], -x["attributable_lost_clicks_d"]))

    demand = sorted([p for p in pairs if p["class"] == "DEMAND"], key=lambda x: -x["base_impr_d"])[:20]
    unstable = sorted([p for p in pairs if p["class"] == "UNSTABLE"], key=lambda x: -x["lost_clicks_d"])[:20]
    stats = {"pairs_baseline": len(B), "pairs_current": len(C), **counts}
    return W, out_pages, demand, unstable, stats


# ── report ────────────────────────────────────────────────────────────────

def write_md(path: Path, rep: dict):
    L = [f"# Rank-drop detection — {rep['site']} — {rep['generated_at'][:10]}", "",
         f"**Sources (Google first-party only):** {', '.join(rep['provenance']['sources'])}  ",
         f"**GSC property:** `{rep['provenance']['gsc_property']}` · **GA4 property:** "
         f"`{rep['provenance']['ga4_property']}` · **SA:** `{rep['provenance']['service_account']}`  ",
         f"**Windows:** current {rep['windows']['current'][0]}→{rep['windows']['current'][1]} vs each "
         f"search's BEST 14-day position in {rep['windows']['history'][0]}→{rep['windows']['history'][1]} "
         f"(GSC `final` data)", ""]
    g = rep["google_updates"]
    if g["ongoing"]:
        L += [f"**⚠ Google ranking update in progress:** "
              f"{'; '.join(u['name'] + ' (since ' + u['begin'] + ')' for u in g['ongoing'])} — "
              f"run mode **{rep['mode']}**.", ""]
    L += ["## Pages with a ranking drop", "",
          "| # | page | lost clicks/day from ranking | GSC page clicks/day (90d avg→now) | loss share | GA4 organic sessions/day (90d avg→now) | GA4 confirms | query classes |",
          "|---|---|---|---|---|---|---|---|"]
    for i, p in enumerate(rep["pages"], 1):
        ga = p["ga4_organic_sessions_d"]
        gc = p["gsc_page_clicks_d"]
        L.append(f"| {i} | `{p['path']}` | {p['attributable_lost_clicks_d']} | {gc['baseline']}→{gc['current']} | "
                 f"{p['loss_share']:.0%} | {ga['baseline']}→{ga['current']} | "
                 f"{'yes' if p['ga4_confirms'] else 'no'} | "
                 f"{', '.join(f'{k} {v}' for k, v in p['classes'].items())} |")
    L += ["", "## Top lost queries (per page)", ""]
    for p in rep["pages"][:12]:
        L.append(f"**`{p['path']}`**")
        for q in p["pairs"][:6]:
            cur = q["cur_pos"] if q["cur_pos"] is not None else "not logged"
            extra = f" → taken by `{q['taker']}`" if q["taker"] else ""
            L.append(f"- {q['class']} [{q['market']}] \"{q['query']}\" best pos {q['base_pos']} "
                     f"({q['peak_window'][0]}→{q['peak_window'][1]}) → now {cur}, "
                     f"impr/day {q['base_impr_d']} → {q['cur_impr_d']}{extra}")
        L.append("")
    L += ["## Demand decay — still at its best position, searches fell (NO ACTION)", ""]
    L += [f"- \"{d['query']}\" `{urllib.parse.urlparse(d['page']).path}` pos {d['base_pos']}→{d['cur_pos']}, "
          f"impr/day {d['base_impr_d']}→{d['cur_impr_d']}" for d in rep["demand"][:10]] or ["None"]
    L += ["", "## Unstable — dropped but not in both weeks (re-check next run)", ""]
    L += [f"- \"{d['query']}\" `{urllib.parse.urlparse(d['page']).path}` pos {d['base_pos']}→{d['cur_pos']}"
          for d in rep["unstable"][:10]] or ["None"]
    L += ["", "## Stats", "", "```", json.dumps(rep["stats"], indent=1), "```", "",
          f"Report sha256: `{rep['provenance']['sha256']}`"]
    path.write_text("\n".join(L) + "\n")


def fail_report(out: Path, site: str, code: int, msg: str):
    out.parent.mkdir(parents=True, exist_ok=True)
    rep = {"status": "FAIL", "exit_code": code, "error": msg, "site": site,
           "generated_at": datetime.now(timezone.utc).isoformat(),
           "rule": "Google first-party data unavailable — run must stop. No fallback source is permitted."}
    Path(str(out) + ".json").write_text(json.dumps(rep, indent=2))
    Path(str(out) + ".md").write_text(
        f"# Rank-drop detection FAILED — {site}\n\n**Exit {code}:** {msg}\n\n"
        "Google first-party data (Search Console / GA4) could not be read. "
        "The run stops here; no other data source may be substituted.\n")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--base-url")
    ap.add_argument("--gsc-property", help="default sc-domain:<host>")
    ap.add_argument("--ga4-property", default=os.environ.get("GA4_PROPERTY_ID"), required=False)
    ap.add_argument("--out", required=True, help="output path stem (writes .json + .md)")
    ap.add_argument("--force-fix", action="store_true",
                    help="owner override: FIX mode even while a Google ranking update is rolling out")
    ap.add_argument("--min-page-clicks-d", type=float, default=MIN_PAGE_CLICKS_D,
                    help="traffic floor: avg Google clicks/day over the history window")
    a = ap.parse_args(argv)
    try:                                   # site.json supplies the defaults (fleet rollout)
        from siteconf import site as _site
        _c = _site()
        if not a.base_url:                 # site.json only fills in when no site was named on the CLI
            a.base_url = _c["base_url"]
            a.gsc_property = a.gsc_property or _c.get("gsc_property")
            a.ga4_property = a.ga4_property or _c.get("ga4_property")
    except (ImportError, SystemExit, KeyError):
        pass
    if not a.base_url:
        ap.error("--base-url required (or scripts/rank_drop/site.json)")

    host = urllib.parse.urlparse(a.base_url).netloc.lower()
    site = a.gsc_property or f"sc-domain:{host.removeprefix('www.')}"
    out = Path(a.out)
    try:
        if not a.ga4_property:
            raise HardFail(10, "GA4 property id missing (--ga4-property or GA4_PROPERTY_ID)")
        sa = load_sa_info()
        gsc = session_for(sa, GSC_SCOPE)
        ga4 = session_for(sa, GA4_SCOPE)
        check_gsc_access(gsc, site)
        check_ga4_access(ga4, a.ga4_property)
        end = gsc_freshest_final_day(gsc, site)
        ongoing, recent = google_updates(gsc)
        W, pages, demand, unstable, stats = detect(gsc, site, a.base_url, ga4, a.ga4_property, end,
                                                    a.min_page_clicks_d)
    except HardFail as e:
        fail_report(out, site, e.code, str(e))
        print(f"HARD FAIL ({e.code}): {e}", file=sys.stderr)
        return e.code

    rep = {"status": "OK", "site": site, "base_url": a.base_url,
           "generated_at": datetime.now(timezone.utc).isoformat(),
           "mode": "OBSERVE" if ongoing and not a.force_fix else "FIX",
           "mode_override": (f"owner forced FIX during: {', '.join(u['name'] for u in ongoing)}"
                             if ongoing and a.force_fix else None),
           "windows": W,
           "google_updates": {"ongoing": ongoing, "recent_60d": recent},
           "pages": pages, "demand": demand, "unstable": unstable, "stats": stats,
           "provenance": {"sources": SOURCES, "gsc_property": site,
                          "ga4_property": a.ga4_property,
                          "service_account": sa.get("client_email", "?"),
                          "gsc_data_state": "final", "third_party_sources": []}}
    body = json.dumps({k: v for k, v in rep.items() if k != "provenance"}, sort_keys=True)
    rep["provenance"]["sha256"] = hashlib.sha256(body.encode()).hexdigest()
    out.parent.mkdir(parents=True, exist_ok=True)
    Path(str(out) + ".json").write_text(json.dumps(rep, indent=2))
    write_md(Path(str(out) + ".md"), rep)
    print(f"OK mode={rep['mode']} pages={len(pages)} demand={len(demand)} unstable={len(unstable)} "
          f"→ {out}.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
