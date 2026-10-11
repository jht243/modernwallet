#!/usr/bin/env python3
"""Per-site tool usage for the /tool-usage-mindmap-auto routine (stdlib only, portable).

Reads OUR tracking table (Supabase tool_usage_events, CubanInsights project) for ONE
site and prints a ranked JSON list of its tools. Same data as the fleet dashboard
(www.layer3labs.io/admin/tool-usage), scoped to one site.

  python3 scripts/tool_usage/site_tool_usage.py --site chalkbox.org [--days 30]

Needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (env, or ~/.claude/secrets.env locally).
Missing creds -> prints {"error": "..."} and exits 0 so the routine can exit quietly.

Output:
  {"site", "window_days", "data_days",          # data_days = days since this site's first event
   "tools": [{"tool", "path", "people", "uses", "views", "use_rate",
              "people_7d", "lane"}]}            # lane: "persona" | "low-use" | "thin"
Lanes (thresholds are deliberately low while the data is young):
  persona  — people >= 3: real usage, run the persona pass on it
  low-use  — views >= 10 and use_rate < 0.25: people land and leave, check why
  thin     — everything else: listed, not worked
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


def rows_for(url, key, site, since=None, select="tool,path,event,visitor,created_at"):
    params = {"select": select, "site": f"eq.{site}", "or": "(is_bot.is.null,is_bot.is.false)",
              "order": "created_at.asc"}
    if since:
        params["created_at"] = f"gte.{since.isoformat()}"
    out, off = [], 0
    while True:
        batch = fetch(url, key, params, off)
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
    agg = defaultdict(lambda: {"uses": 0, "views": 0, "people": set(), "people_7d": set(), "paths": defaultdict(int)})
    for r in rows:
        t = agg[r["tool"]]
        t["paths"][r["path"]] += 1
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
        tools.append({"tool": name, "path": max(t["paths"], key=t["paths"].get), "people": people,
                      "uses": t["uses"], "views": t["views"], "use_rate": rate,
                      "people_7d": len(t["people_7d"]), "lane": lane})
    order = {"persona": 0, "low-use": 1, "thin": 2}
    tools.sort(key=lambda x: (order[x["lane"]], -x["people"], -x["views"]))
    print(json.dumps({"site": site, "window_days": a.days, "data_days": data_days, "tools": tools}, indent=1))


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # never crash the routine on a data hiccup
        print(json.dumps({"error": f"{type(e).__name__}: {e}"}))
        sys.exit(0)
