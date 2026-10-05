#!/usr/bin/env python3
"""Competitor discovery for a dropped page — the ONE place DataForSEO is allowed.

Scope (owner decision 2026-10-04): DataForSEO may be used ONLY to list which
OTHER sites now rank for the searches a page lost, so the gap study knows whose
pages to read. It is never used for anything about our own site:
  - every result row on our own domain is DROPPED before writing (we do not
    even record our own rank from it — our positions come from Search Console);
  - no volume, difficulty, traffic or keyword endpoints are called;
  - the output file is separate from the Google detection report and is
    stamped third_party=dataforseo, purpose=competitor_discovery_only.

Input: the Google detection report (provenance-checked first) + a page path.
The searches studied are that page's top lost queries from the report, so the
question asked of DataForSEO comes from Google data, never the other way round.

If DataForSEO is unavailable this exits 0 with status SKIPPED — the gap study
continues on Google data alone. (The Google-data hard fail lives in detect.py.)

Usage:
  scripts/rank_drop/competitor_serp.py --detect reports/rank-drop/<date>.json \\
      --page /guides/best-llm-for-coding --out reports/rank-drop/<date>.<slug>.serp.json
"""

import argparse
import json
import subprocess
import sys
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[0] / "lib"))

MAX_QUERIES = 3       # per page
TOP_N = 10            # competitors kept per search
FORUMS = ("reddit.com", "quora.com", "stackexchange.com", "stackoverflow.com",
          "news.ycombinator.com", "community.", "forum.")


def kind(domain: str) -> str:
    d = domain.lower()
    if any(f in d for f in FORUMS):
        return "forum"
    if any(x in d for x in ("youtube.com", "tiktok.com")):
        return "video"
    return "site"


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--detect", required=True)
    ap.add_argument("--page", required=True, help="path, e.g. /guides/best-llm-for-coding")
    ap.add_argument("--out", required=True)
    a = ap.parse_args(argv)

    # the detection report must be a valid Google-only report
    if subprocess.run([sys.executable, str(HERE / "verify_provenance.py"), a.detect]).returncode:
        print("detection report failed provenance — not studying competitors", file=sys.stderr)
        return 20
    rep = json.load(open(a.detect))
    own = urllib.parse.urlparse(rep["base_url"]).netloc.lower().removeprefix("www.")
    page = next((p for p in rep["pages"] if p["path"] == a.page.rstrip("/")), None)
    if not page:
        print(f"{a.page} is not in the detection report", file=sys.stderr)
        return 2
    queries = [p["query"] for p in page["pairs"]][:MAX_QUERIES]

    out = {"page": a.page, "generated_at": datetime.now(timezone.utc).isoformat(),
           "third_party": "dataforseo", "purpose": "competitor_discovery_only",
           "rule": "Competitor URLs only. No data about our own site is taken from this source.",
           "queries_from": a.detect, "searches": []}

    import dataforseo as dfs
    if not dfs.available():
        out["status"] = "SKIPPED"
        out["reason"] = "DataForSEO unavailable — gap study continues on Google data only"
        Path(a.out).write_text(json.dumps(out, indent=2))
        print("SKIPPED (no DataForSEO key)")
        return 0

    for q in queries:
        try:
            res = dfs.serp_organic(q, depth=TOP_N + 5, paa_depth=0)
        except Exception as e:  # noqa: BLE001
            out["searches"].append({"query": q, "error": str(e)[:200]})
            continue
        items = res.get("items") or []
        features = sorted({i.get("type") for i in items if i.get("type") and i.get("type") != "organic"})
        comps = []
        for i in items:
            if i.get("type") != "organic":
                continue
            dom = (i.get("domain") or "").lower().removeprefix("www.")
            if dom == own or dom.endswith("." + own):
                continue                      # never record our own row from a third party
            comps.append({"rank": i.get("rank_group"), "domain": dom, "url": i.get("url"),
                          "title": i.get("title"), "kind": kind(dom)})
            if len(comps) >= TOP_N:
                break
        out["searches"].append({"query": q, "serp_features": features, "competitors": comps})

    out["status"] = "OK"
    out["cost"] = dfs.cost_summary()
    Path(a.out).write_text(json.dumps(out, indent=2))
    print(f"OK {len(out['searches'])} searches · {out['cost']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
