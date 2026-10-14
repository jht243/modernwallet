#!/usr/bin/env python3
"""
Register vendors found by RESEARCH (not the SERP roster) so they join the pool and the outreach queue.

Owner rule (2026-10-11, fleet-wide): step 1 of every NEW comparison page is to research the
category's vendor field and actually fill the table — a new page never ships thin. The routine finds
candidates with WebSearch/WebFetch, verifies each on its own site, writes them to
reports/vendor-roundup/research/<vertical>.json (layer3: reports/research/<vertical>.json):

  {"vertical": "<id>", "vendors": [{"domain": "x.com", "name": "X", "url": "https://x.com/",
                                    "note": "what it sells, verified on its site"}]}

and runs this. Rows are inserted as site_kind='vendor' (verified by hand) with priority 50;
existing rows are never touched. The placement radar then finds their contact emails.

  python3 scripts/placement/add_research_vendors.py <vertical>          # fleet sites
  python3 scripts/category_candidates.py ... / add_research_vendors.py   # layer3 copy: table placement_prospects
"""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve()
ROOT = HERE.parents[2] if HERE.parent.name == "placement" else HERE.parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from lib import dataforseo as dfs  # noqa: E402  (resolve_key)

CFG = ROOT / "data" / "placement-verticals.json"
FLEET = CFG.exists()  # fleet sites keep this file; layer3 keeps verticals in TypeScript
SITE = json.loads(CFG.read_text())["site"] if FLEET else None
TABLE = "fleet_placement_prospects" if FLEET else "placement_prospects"
RESEARCH = ROOT / "reports" / ("vendor-roundup/research" if FLEET else "research")


def norm(d: str) -> str:
    d = re.sub(r"^https?://", "", (d or "").strip().lower())
    return re.sub(r"[/?#].*$", "", re.sub(r"^www\.", "", d)).rstrip(".")


def main() -> int:
    if len(sys.argv) < 2:
        raise SystemExit("usage: add_research_vendors.py <vertical>")
    vid = sys.argv[1]
    spec = json.loads((RESEARCH / f"{vid}.json").read_text())
    base = dfs.resolve_key("SUPABASE_URL").rstrip("/")
    key = dfs.resolve_key("SUPABASE_SERVICE_ROLE_KEY")
    if not base or not key:
        raise SystemExit("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set")
    rows = []
    for v in spec["vendors"]:
        d = norm(v.get("domain") or v.get("url", ""))
        if not d:
            continue
        row = {"domain": d, "name": v.get("name") or d, "site_url": v.get("url") or f"https://{d}",
               "one_liner": v.get("note", "")[:300], "sources": [f"research:{vid}"], "vertical": vid,
               "priority": 50, "site_kind": "vendor", "notes": "added by vendor research (verified on its own site)"}
        if FLEET:
            row["site"] = SITE
        rows.append(row)
    if not rows:
        print("no vendors in research file"); return 0
    conflict = "site,domain" if FLEET else "domain"
    req = urllib.request.Request(
        f"{base}/rest/v1/{TABLE}?on_conflict={conflict}", data=json.dumps(rows).encode(), method="POST",
        headers={"Content-Type": "application/json", "apikey": key, "Authorization": f"Bearer {key}",
                 "Prefer": "resolution=ignore-duplicates,return=representation"})
    with urllib.request.urlopen(req, timeout=60) as r:
        created = json.loads(r.read() or b"[]")
    print(f"{vid}: {len(rows)} researched vendors -> {len(created)} new prospects, "
          f"{len(rows) - len(created)} already tracked ({TABLE})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
