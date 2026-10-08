#!/usr/bin/env python3
"""Page 1-2 no-clicks detector — Google first-party data ONLY, hard fail otherwise.

Finds pages Google already SHOWS on page 1-2 that almost nobody clicks, and picks the ones worth
fixing today. Same data rule, exit codes and provenance format as scripts/rank_drop/detect.py
(verify_provenance.py gates every later phase on this report).

What it does (lessons from the 2026-10-07 layer3 zero-click analysis, reports/zero-click-analysis/):
  - Judges a page by ITS OWN queries, never its average position: the average blends a broad query
    at #6 with the target query at #42 (best-ai-document-management-software-for-small-business).
  - Drops AI-agent / operator queries ('"docuware" -site:reddit.com', 15-word prompts): they make
    impressions that can never become clicks. A page whose listed impressions are mostly synthetic
    is skipped.
  - Never chases navigational queries ("brevo login", a bare brand name).
  - Compares CTR to THIS SITE's median CTR at the same position band, not an industry curve.
  - Lane by the main real query's position: SNIPPET (#1-10, fix what searchers see) or RANK
    (#11-20, nobody sees page 2 — fix why Google ranks it there).
  - Marks AI-cited pages (GA4 AI-assistant referrals over 180 days, or a Google AI Overview cite
    recorded by ai-answer-citation-pass). They are fixed additively only and never removed.
  - Skips pages younger than 45 days, pages in this routine's 35-day cooldown, and pages ANY routine
    edited in the last 14 days (two engines never work the same page in one cycle).

Exit codes: 0 ok · 10 credentials · 11 auth/permission · 12 API error ·
            13 stale data · 14 empty data · 15 truncated data

Usage: scripts/page12/detect.py --out reports/page-1-2-no-clicks/<date> [--pick 8]
       (site values come from scripts/rank_drop/site.json)
"""

import argparse
import glob
import hashlib
import json
import os
import re
import statistics
import subprocess
import sys
import urllib.parse
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
os.environ.setdefault("RD_ENGINE", "page-1-2-no-clicks-pass")   # shared rank_drop scripts read it
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "rank_drop"))
from detect import (GA4_API, GA4_SCOPE, GSC_SCOPE, SOURCES, HardFail, call,  # noqa: E402
                    check_ga4_access, check_gsc_access, ga4_organic_landing, google_updates,
                    gsc_freshest_final_day, gsc_rows, is_synthetic, load_sa_info, session_for)

LEDGER = ROOT / "reports" / "page-1-2-no-clicks" / "ledger.jsonl"
PICK = 8                  # pages fixed per daily run
TOP_GA4 = 30              # GA4's top-N landing pages (90d sessions, all channels) are "top pages"
TOP_CLICKS_90D = 300      # ...and so is any page with 100+ Google clicks a month
TOP_FACT_PICK = 3         # top pages per run that get a FACTS-ONLY check (no title/section edits)
MIN_IMPR_90D = 500        # page impressions over 90 days
CTR_RATIO = 0.4           # page CTR must be below 40% of the site's median CTR for its band
MIN_AGE_DAYS = 45         # page must have had impressions 45+ days ago
COOLDOWN_DAYS = 35        # this routine's own per-page cooldown
RECENT_EDIT_DAYS = 14     # any routine's edit inside this window → skip today
MAX_SYNTHETIC_SHARE = 0.5
SNIPPET_MAX_POS = 10.5
RANK_MAX_POS = 20.5
BANDS = [(0, 5), (5, 10), (10, 15), (15, 20.5)]
AI_SOURCES = (r"chatgpt|openai|perplexity|gemini|bard|copilot|claude\.ai|anthropic|kagi|"
              r"you\.com|phind|meta\.ai|poe\.com|mistral|grok")
NAV = re.compile(r"\b(login|log in|sign in|signin|sign up|download|app store|customer service|"
                 r"phone number|careers|stock|near me)\b")


def path_of(url: str) -> str:
    return urllib.parse.urlparse(url).path.rstrip("/") or "/"


def band_of(pos: float) -> int:
    for i, (lo, hi) in enumerate(BANDS):
        if lo < pos <= hi:
            return i
    return len(BANDS) - 1


def is_nav(q: str, brand_tokens: set[str]) -> bool:
    words = q.lower().split()
    if NAV.search(q.lower()):
        return True
    return len(words) == 1 or (len(words) <= 2 and set(words) <= brand_tokens)


def ga4_ai_referrals(s, prop: str, start: date, end: date) -> dict[str, int]:
    body = {"dateRanges": [{"startDate": start.isoformat(), "endDate": end.isoformat()}],
            "dimensions": [{"name": "landingPage"}],
            "metrics": [{"name": "sessions"}],
            "dimensionFilter": {"filter": {"fieldName": "sessionSource", "stringFilter": {
                "matchType": "PARTIAL_REGEXP", "value": AI_SOURCES}}},
            "limit": 100000}
    resp = call(s, "POST", f"{GA4_API}/properties/{prop}:runReport", body)
    if resp.get("rowCount", 0) > 100000:
        raise HardFail(15, "GA4 AI-referral report truncated (>100k rows)")
    out: dict[str, int] = {}
    for r in resp.get("rows", []):
        p = r["dimensionValues"][0]["value"].split("?")[0].rstrip("/") or "/"
        out[p] = out.get(p, 0) + int(r["metricValues"][0]["value"])
    return out


def ga4_all_landing(s, prop: str, start: date, end: date) -> dict[str, int]:
    body = {"dateRanges": [{"startDate": start.isoformat(), "endDate": end.isoformat()}],
            "dimensions": [{"name": "landingPage"}], "metrics": [{"name": "sessions"}], "limit": 100000}
    resp = call(s, "POST", f"{GA4_API}/properties/{prop}:runReport", body)
    out: dict[str, int] = {}
    for r in resp.get("rows", []):
        p = r["dimensionValues"][0]["value"].split("?")[0].rstrip("/") or "/"
        out[p] = out.get(p, 0) + int(r["metricValues"][0]["value"])
    return out


def aio_cited_paths(host: str) -> set[str]:
    """Pages Google's AI Overview cited, as recorded by ai-answer-citation-pass (local files)."""
    out = set()
    for f in glob.glob(str(ROOT / "reports/ai-answer-citation-pass/*.serp.json")):
        try:
            for p, v in (json.load(open(f)).get("pages") or {}).items():
                if any(host in d for d in v.get("ai_overview_cited_domains") or []):
                    out.add(path_of(p))
        except Exception:  # noqa: BLE001
            continue
    dp = ROOT / "reports/ai-answer-citation-pass/defended-pages.json"
    if dp.exists():
        try:
            out |= {path_of(p["route"]) for p in json.load(open(dp)).get("pages", [])}
        except Exception:  # noqa: BLE001
            pass
    return out


def in_cooldown() -> set[str]:
    cool = set()
    if LEDGER.exists():
        for line in LEDGER.read_text().splitlines():
            try:
                r = json.loads(line)
            except json.JSONDecodeError:
                continue
            if r.get("status") in ("published", "reverted") and \
                    (date.today() - date.fromisoformat(r["treated"])).days < COOLDOWN_DAYS:
                cool.add(path_of(r["page"]))
    return cool


_OLD: list = []


def _commit_before() -> str:
    """The last commit older than RECENT_EDIT_DAYS. Cloud runs clone shallow (2026-10-07: the first
    run found no old commit, so the 14-day lock silently passed 5 pages other routines had just
    edited) — deepen the clone once before giving up."""
    if _OLD:
        return _OLD[0]
    def find():
        return subprocess.run(["git", "rev-list", "-1", f"--before={RECENT_EDIT_DAYS}.days", "HEAD"],
                              cwd=ROOT, capture_output=True, text=True).stdout.strip()
    old = find()
    if not old:
        since = (date.today() - timedelta(days=RECENT_EDIT_DAYS + 7)).isoformat()
        subprocess.run(["git", "fetch", "-q", f"--shallow-since={since}", "origin", "HEAD"],
                       cwd=ROOT, capture_output=True, text=True)
        old = find()
    if not old:
        subprocess.run(["git", "fetch", "-q", "--unshallow", "origin"], cwd=ROOT, capture_output=True, text=True)
        old = find()
    _OLD.append(old)
    return old


def recently_edited(path: str, B) -> str | None:
    """Why the page must wait, if ANY routine changed its stored source in the last 14 days.
    Generic across file backends: the page's current source must appear verbatim in its file as it
    was 14 days ago. Returns None when the page is untouched (or the backend has no files)."""
    page = B.locate(path)
    if page is None:
        return "page source not found"
    if not page.files or not page.native:
        return None
    old = _commit_before()
    if not old:                       # history unavailable: can't prove the page is untouched → wait
        return f"cannot verify edits in the last {RECENT_EDIT_DAYS} days (no git history)"
    src = subprocess.run(["git", "show", f"{old}:{page.files[0]}"], cwd=ROOT,
                         capture_output=True, text=True).stdout
    return None if page.native in src else f"edited in the last {RECENT_EDIT_DAYS} days"


def detect(gsc, site, ga4, prop, end: date, pick: int, B):
    w90 = (end - timedelta(days=89), end)
    w28 = (end - timedelta(days=27), end)
    wold = (end - timedelta(days=119), end - timedelta(days=MIN_AGE_DAYS))
    P90 = {r["keys"][0]: r for r in gsc_rows(gsc, site, *w90, ["page"])}
    P28 = {r["keys"][0]: r for r in gsc_rows(gsc, site, *w28, ["page"])}
    OLD = {r["keys"][0] for r in gsc_rows(gsc, site, *wold, ["page"]) if r["impressions"] > 0}
    PQ = gsc_rows(gsc, site, *w90, ["page", "query"])
    PQ28 = {tuple(r["keys"]): r for r in gsc_rows(gsc, site, *w28, ["page", "query"])}
    if not P90 or not PQ:
        raise HardFail(14, f"GSC returned an empty page set (pages {len(P90)}, page×query {len(PQ)})")
    ga_90 = ga4_organic_landing(ga4, prop, *w90)
    ga_28 = ga4_organic_landing(ga4, prop, *w28)
    ai = ga4_ai_referrals(ga4, prop, end - timedelta(days=179), end)
    ga_all = ga4_all_landing(ga4, prop, *w90)
    top_ga4 = {p for p, _ in sorted(ga_all.items(), key=lambda kv: -kv[1])[:TOP_GA4]}
    aio = aio_cited_paths(site.replace("sc-domain:", "").split("//")[-1].removeprefix("www."))

    by_page: dict[str, list[dict]] = {}
    for r in PQ:
        by_page.setdefault(r["keys"][0], []).append(r)

    # this site's own CTR curve: median page CTR per position band (pages with real volume)
    bands: dict[int, list[float]] = {i: [] for i in range(len(BANDS))}
    for r in P90.values():
        if r["impressions"] >= MIN_IMPR_90D and r["position"] <= RANK_MAX_POS:
            bands[band_of(r["position"])].append(r["clicks"] / r["impressions"])
    medians = {i: (statistics.median(v) if v else 0.0) for i, v in bands.items()}

    host_tokens = set(re.split(r"[^a-z0-9]+", urllib.parse.urlparse(site.replace("sc-domain:", "https://")).netloc.lower()))
    stats = {"pages_90d": len(P90), "below_impression_floor": 0, "too_young": 0, "nav_or_hub": 0,
             "mostly_synthetic": 0, "beyond_page_2": 0, "ctr_ok": 0, "cooldown": 0, "recently_edited": 0}
    cands, skipped = [], []
    for url, r in P90.items():
        path = path_of(url)
        if r["impressions"] < MIN_IMPR_90D:
            stats["below_impression_floor"] += 1
            continue
        if path == "/":                               # home; other non-content pages fail B.locate below
            stats["nav_or_hub"] += 1
            continue
        if url not in OLD:
            stats["too_young"] += 1
            continue
        qs = by_page.get(url, [])
        listed = sum(q["impressions"] for q in qs) or 1
        synth = sum(q["impressions"] for q in qs if is_synthetic(q["keys"][1]))
        real = [q for q in qs if not is_synthetic(q["keys"][1])]
        brand = set(re.split(r"[^a-z0-9]+", path.rsplit("/", 1)[-1])) | host_tokens
        useful = [q for q in real if not is_nav(q["keys"][1], brand)]
        if synth / listed > MAX_SYNTHETIC_SHARE or not useful:
            stats["mostly_synthetic"] += 1
            continue
        useful.sort(key=lambda q: -q["impressions"])
        main = useful[0]
        mpos = main["position"]
        if mpos > RANK_MAX_POS:
            stats["beyond_page_2"] += 1
            continue
        lane = "SNIPPET" if mpos <= SNIPPET_MAX_POS else "RANK"
        ctr = r["clicks"] / r["impressions"]
        med = medians[band_of(mpos)]
        if not med or ctr >= CTR_RATIO * med:
            stats["ctr_ok"] += 1
            continue
        gain = round(r["impressions"] * (med - ctr), 1)
        # Top pages already win: Google may re-evaluate a page whose title/sections change, so they get
        # fact corrections only (owner rule 2026-10-07: GA4 top 30 or 100+ clicks/month → FACTS lane).
        top_why = ("GA4 top %d" % TOP_GA4) if path in top_ga4 else \
                  (f"{r['clicks']} clicks/90d" if r["clicks"] >= TOP_CLICKS_90D else None)
        if top_why:
            lane = "FACTS"
        cands.append({"top_page": top_why, "url": url, "path": path, "row": r, "useful": useful, "main": main, "lane": lane,
                      "ctr": ctr, "med": med, "gain": gain, "synthetic_share": round(synth / listed, 2),
                      "listed_share": round(listed / r["impressions"], 2)})
    cands.sort(key=lambda c: -c["gain"])

    cool = in_cooldown()
    pages = []
    n_full = n_top = 0
    for c in cands:
        if n_full >= pick and n_top >= TOP_FACT_PICK:
            break
        if (c["top_page"] and n_top >= TOP_FACT_PICK) or (not c["top_page"] and n_full >= pick):
            continue
        if c["path"] in cool:
            stats["cooldown"] += 1
            skipped.append({"path": c["path"], "why": f"cooldown ({COOLDOWN_DAYS} days)"})
            continue
        why = recently_edited(c["path"], B)        # also "page source not found" = not a content page
        if why == "page source not found":
            stats["nav_or_hub"] += 1
            continue
        if why:
            stats["recently_edited"] += 1
            skipped.append({"path": c["path"], "why": why})
            continue
        if c["top_page"]:
            n_top += 1
        else:
            n_full += 1
        r, url, path = c["row"], c["url"], c["path"]
        p28 = P28.get(url, {"clicks": 0, "impressions": 0})
        pairs = []
        for q in c["useful"][:10]:
            q28 = PQ28.get((url, q["keys"][1]))
            pairs.append({"query": q["keys"][1],
                          "class": "SNIPPET" if q["position"] <= SNIPPET_MAX_POS else
                                   "RANK" if q["position"] <= RANK_MAX_POS else "FAR",
                          "market": "global", "base_pos": round(q["position"], 1),
                          "cur_pos": round(q28["position"], 1) if q28 else None,
                          "base_impr_d": round(q["impressions"] / 90, 1),
                          "cur_impr_d": round(q28["impressions"] / 28, 1) if q28 else 0.0,
                          "base_clicks": q["clicks"], "cur_clicks": q28["clicks"] if q28 else 0,
                          "lost_clicks_d": 0.0, "taker": None})
        gb, gc = ga_90.get(path, 0) / 90, ga_28.get(path, 0) / 28
        pages.append({
            "page": url, "path": path, "classes": {c["lane"]: 1},
            "lane": c["lane"], "facts_only": bool(c["top_page"]), "top_page": c["top_page"],
            "main_query": c["main"]["keys"][1], "main_pos": round(c["main"]["position"], 1),
            "main_impressions_90d": c["main"]["impressions"],
            "impressions_90d": r["impressions"], "clicks_90d": r["clicks"],
            "position_90d": round(r["position"], 1),
            "impressions_28d": p28["impressions"], "clicks_28d": p28["clicks"],
            "ctr": round(c["ctr"], 5), "band_median_ctr": round(c["med"], 5),
            "expected_gain_90d": c["gain"],
            "synthetic_share": c["synthetic_share"], "listed_query_share": c["listed_share"],
            "ai_referrals_180d": ai.get(path, 0), "aio_cited": path in aio,
            "ai_cited": bool(ai.get(path, 0) or path in aio),
            "gsc_page_clicks_d": {"baseline": round(r["clicks"] / 90, 2), "current": round(p28["clicks"] / 28, 2)},
            "ga4_organic_sessions_d": {"baseline": round(gb, 1), "current": round(gc, 1),
                                       "change": round((gc - gb) / gb, 3) if gb else None},
            "pairs": pairs,
        })
    stats["candidates"] = len(cands)
    stats["picked"] = len(pages)
    stats["top_pages_facts_only"] = n_top
    W = {"w90": [w90[0].isoformat(), w90[1].isoformat()], "w28": [w28[0].isoformat(), w28[1].isoformat()],
         "age_window": [wold[0].isoformat(), wold[1].isoformat()]}
    backlog = [{"path": c["path"], "lane": c["lane"], "gain": c["gain"]} for c in cands
               if c["path"] not in {p["path"] for p in pages}][:40]
    return W, pages, skipped, backlog, {str(BANDS[i]): round(m, 5) for i, m in medians.items()}, stats


def write_md(path: Path, rep: dict):
    L = [f"# Page 1-2 no-clicks detection — {rep['site']} — {rep['generated_at'][:10]}", "",
         f"**Sources (Google first-party only):** {', '.join(rep['provenance']['sources'])}  ",
         f"**Windows:** 90d {rep['windows']['w90'][0]}→{rep['windows']['w90'][1]} · 28d "
         f"{rep['windows']['w28'][0]}→{rep['windows']['w28'][1]} (GSC `final` data)  ",
         f"**This site's median CTR by position band:** "
         + ", ".join(f"{k}: {v:.2%}" for k, v in rep["band_median_ctr"].items()), ""]
    if rep["google_updates"]["ongoing"]:
        L += [f"**Note:** Google ranking update in progress ({', '.join(rep['google_update_ongoing'])}). "
              "Fixes still run; their 28-day measurement is flagged.", ""]
    L += ["## Picked today", "",
          "| # | page | lane | main search (#pos, impr 90d) | impr 90d | clicks 90d | CTR vs site | AI-cited | expected gain |",
          "|---|---|---|---|---|---|---|---|---|"]
    for i, p in enumerate(rep["pages"], 1):
        L.append(f"| {i} | `{p['path']}` | {p['lane']} | “{p['main_query']}” (#{p['main_pos']}, {p['main_impressions_90d']}) | "
                 f"{p['impressions_90d']} | {p['clicks_90d']} | {p['ctr']:.2%} vs {p['band_median_ctr']:.2%} | "
                 f"{'yes' if p['ai_cited'] else 'no'} | +{p['expected_gain_90d']} clicks/90d |")
    L += ["", "## Skipped (cooldown / recently edited)", ""]
    L += [f"- `{s['path']}` — {s['why']}" for s in rep["skipped"]] or ["None"]
    L += ["", f"## Backlog (next {len(rep['backlog'])} by expected gain)", ""]
    L += [f"- `{b['path']}` {b['lane']} +{b['gain']}" for b in rep["backlog"]] or ["None"]
    L += ["", "## Stats", "", "```", json.dumps(rep["stats"], indent=1), "```", "",
          f"Report sha256: `{rep['provenance']['sha256']}`"]
    path.write_text("\n".join(L) + "\n")


def fail_report(out: Path, site: str, code: int, msg: str):
    out.parent.mkdir(parents=True, exist_ok=True)
    rep = {"status": "FAIL", "exit_code": code, "error": msg, "site": site,
           "generated_at": datetime.now(timezone.utc).isoformat(),
           "rule": "Google first-party data unavailable — run must stop. No fallback source is permitted."}
    Path(str(out) + ".json").write_text(json.dumps(rep, indent=2))
    Path(str(out) + ".md").write_text(f"# Page 1-2 no-clicks detection FAILED — {site}\n\n**Exit {code}:** {msg}\n")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--out", required=True)
    ap.add_argument("--pick", type=int, default=int(os.environ.get("PAGE12_PICK", PICK)))
    a = ap.parse_args(argv)
    from siteconf import backend, site as _site
    cfg = _site()
    site = cfg["gsc_property"]
    out = Path(a.out)
    try:
        if not cfg.get("ga4_property"):
            raise HardFail(10, "GA4 property id missing in scripts/rank_drop/site.json")
        sa = load_sa_info()
        gsc = session_for(sa, GSC_SCOPE)
        ga4 = session_for(sa, GA4_SCOPE)
        check_gsc_access(gsc, site)
        check_ga4_access(ga4, cfg["ga4_property"])
        end = gsc_freshest_final_day(gsc, site)
        ongoing, recent = google_updates(gsc)
        W, pages, skipped, backlog, medians, stats = detect(gsc, site, ga4, cfg["ga4_property"], end,
                                                           a.pick, backend())
    except HardFail as e:
        fail_report(out, site, e.code, str(e))
        print(f"HARD FAIL ({e.code}): {e}", file=sys.stderr)
        return e.code

    rep = {"status": "OK", "site": site, "base_url": cfg["base_url"],
           "generated_at": datetime.now(timezone.utc).isoformat(),
           # Unlike rank-drop, no OBSERVE hold: titles, descriptions, fact fixes and an answer block
           # don't chase moving rankings. An ongoing update is recorded so measure.py flags the window.
           "mode": "FIX",
           "mode_override": None,
           "google_update_ongoing": [u["name"] for u in ongoing],
           "windows": W, "google_updates": {"ongoing": ongoing, "recent_60d": recent},
           "band_median_ctr": medians, "pages": pages, "skipped": skipped, "backlog": backlog,
           "demand": [], "unstable": [], "stats": stats,
           "provenance": {"sources": SOURCES, "gsc_property": site, "ga4_property": cfg["ga4_property"],
                          "service_account": sa.get("client_email", "?"),
                          "gsc_data_state": "final", "third_party_sources": []}}
    body = json.dumps({k: v for k, v in rep.items() if k != "provenance"}, sort_keys=True)
    rep["provenance"]["sha256"] = hashlib.sha256(body.encode()).hexdigest()
    out.parent.mkdir(parents=True, exist_ok=True)
    Path(str(out) + ".json").write_text(json.dumps(rep, indent=2))
    write_md(Path(str(out) + ".md"), rep)
    print(f"OK mode={rep['mode']} candidates={stats['candidates']} picked={len(pages)} → {out}.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
