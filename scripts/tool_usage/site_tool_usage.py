#!/usr/bin/env python3
"""Per-site tool usage for the /tool-usage-mindmap-auto & Mindmap Pass routines (stdlib only, portable).

Reads OUR tracking table (Supabase tool_usage_events, CubanInsights project) for ONE
site and prints a ranked JSON list of its tools (including privacy-safe choiceBuckets and
mindmapEligible when people >= 25).
"""
import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

PERSONA_MIN_PEOPLE = 3
LOWUSE_MIN_VIEWS = 10
LOWUSE_MAX_RATE = 0.25
PAGE = 1000


def creds():
    url, key = os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    f = Path.home() / ".claude" / "secrets.env"
    if not (url and key) and f.exists():
        for line in f.read_text().splitlines():
            m = re.match(r"\s*(?:export\s+)?(SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY)=(.*)", line)
            if m:
                v = m.group(2).strip().strip('"').strip("'")
                if m.group(1) == "SUPABASE_URL":
                    url = url or v
                else:
                    key = key or v
    return (url or "").rstrip("/"), key or ""


def fetch(url, key, params, offset):
    q = urllib.parse.urlencode(params, safe="(),.:")
    req = urllib.request.Request(
        f"{url}/rest/v1/tool_usage_events?{q}",
        headers={"apikey": key, "Authorization": f"Bearer {key}",
                 "Range-Unit": "items", "Range": f"{offset}-{offset + PAGE - 1}"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read() or b"[]")


def rows_for(url, key, site, since=None, select="tool,path,event,visitor,trigger,created_at"):
    params = {"select": select, "site": f"eq.{site}", "or": "(is_bot.is.null,is_bot.is.false)",
              "order": "created_at.asc"}
    if since:
        params["created_at"] = f"gte.{since.isoformat()}"
    out, off = [], 0
    while True:
        try:
            batch = fetch(url, key, params, off)
        except Exception:
            if "trigger" in params.get("select", ""):
                params["select"] = "tool,path,event,visitor,created_at"
                batch = fetch(url, key, params, off)
            else:
                raise
        out += batch
        if len(batch) < PAGE:
            return out
        off += PAGE


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", required=True, help="bare domain as tracked, e.g. chalkbox.org")
    ap.add_argument("--days", type=int, default=30)
    a = ap.parse_args()
    site = a.site.lower().removeprefix("https://").removeprefix("http://").removeprefix("www.").rstrip("/")

    url, key = creds()
    if not (url and key):
        print(json.dumps({"error": "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing"}))
        return

    now = datetime.now(timezone.utc)
    rows = rows_for(url, key, site, now - timedelta(days=a.days))
    first = rows_for(url, key, site, select="created_at")[:1] if rows else []
    data_days = 0
    if first:
        t0 = datetime.fromisoformat(first[0]["created_at"].replace("Z", "+00:00"))
        data_days = max(1, (now - t0).days + 1)

    week_ago = now - timedelta(days=7)
    agg = defaultdict(lambda: {"uses": 0, "views": 0, "people": set(), "people_7d": set(), "paths": defaultdict(int), "buckets": defaultdict(lambda: defaultdict(int))})
    for r in rows:
        t = agg[r["tool"]]
        t["paths"][r["path"]] += 1
        trig = str(r.get("trigger") or "")
        if trig.startswith("b:"):
            for kv in trig[2:].split(";"):
                if "=" in kv:
                    bk, bv = kv.split("=", 1)
                    if bk and bv:
                        t["buckets"][bk][bv] += 1
        if r["event"] == "view":
            t["views"] += 1
        elif r["event"] == "use":
            t["uses"] += 1
            v = r.get("visitor") or f"anon-{r['created_at']}"
            t["people"].add(v)
            if datetime.fromisoformat(r["created_at"].replace("Z", "+00:00")) >= week_ago:
                t["people_7d"].add(v)

    tools = []
    for name, t in agg.items():
        people = len(t["people"])
        rate = round(t["uses"] / t["views"], 3) if t["views"] else (1.0 if t["uses"] else 0.0)
        if people >= PERSONA_MIN_PEOPLE:
            lane = "persona"
        elif t["views"] >= LOWUSE_MIN_VIEWS and rate < LOWUSE_MAX_RATE:
            lane = "low-use"
        else:
            lane = "thin"
        top_buckets = {}
        for bk, dist in t["buckets"].items():
            tot_b = sum(dist.values())
            if tot_b >= 10:
                top_val, top_cnt = max(dist.items(), key=lambda x: x[1])
                top_buckets[bk] = {"topChoice": top_val, "share": round(top_cnt / tot_b, 2), "samples": tot_b}
        entry = {"tool": name, "path": max(t["paths"], key=t["paths"].get), "people": people,
                 "uses": t["uses"], "views": t["views"], "use_rate": rate,
                 "people_7d": len(t["people_7d"]), "lane": lane,
                 "mindmapEligible": people >= 25}
        if top_buckets:
            entry["choiceBuckets"] = top_buckets
        tools.append(entry)
    order = {"persona": 0, "low-use": 1, "thin": 2}
    tools.sort(key=lambda x: (order[x["lane"]], -x["people"], -x["views"]))
    print(json.dumps({"site": site, "window_days": a.days, "data_days": data_days, "tools": tools}, indent=1))


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # never crash the routine on a data hiccup
        print(json.dumps({"error": f"{type(e).__name__}: {e}"}))
        sys.exit(0)
