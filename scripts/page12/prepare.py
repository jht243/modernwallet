#!/usr/bin/env python3
"""Build the run's packets — rank-drop's prepare_pages.py, plus this routine's facts per page.

Runs scripts/rank_drop/prepare_pages.py unchanged (entry location, page.ts/page.md, headings,
pricing rows, shared writer/auditor rules, one system prompt per page type, queue.json with the run
base), then adds to every packet.json:
  page12        lane, main search, impressions/clicks/CTR vs the site's band median, AI-cited flags
  lane_hint     SNIPPET | RANK (replaces rank-drop's RECOVER/REFRESH hint)
  inbound_links how many other places in the repo link to this page today
  detect_report path of the provenance-checked report

Usage: scripts/page12/prepare.py --detect reports/page-1-2-no-clicks/<D>.json --out <P>
"""

import argparse
import os
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
os.environ.setdefault("RD_ENGINE", "page-1-2-no-clicks-pass")   # shared rank_drop scripts read it
ROOT = HERE.parents[1]
RD = ROOT / "scripts" / "rank_drop"
FIELDS = ("lane", "main_query", "main_pos", "main_impressions_90d", "impressions_90d", "clicks_90d",
          "position_90d", "impressions_28d", "clicks_28d", "ctr", "band_median_ctr", "expected_gain_90d",
          "synthetic_share", "listed_query_share", "ai_referrals_180d", "aio_cited", "ai_cited",
          "facts_only", "top_page")


def inbound_links(path: str, own_entry: str) -> int:
    """Occurrences of the route in the repo's content/code (minus the page's own entry)."""
    out = subprocess.run(["git", "grep", "-c", "-F", path, "--", ".", ":(exclude)reports",
                          ":(exclude)public/sitemap*", ":(exclude)public/search-index.json"],
                         cwd=ROOT, capture_output=True, text=True).stdout
    n = sum(int(l.rsplit(":", 1)[1]) for l in out.splitlines() if ":" in l)
    return max(0, n - own_entry.count(path))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--detect", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args(argv)
    led = ROOT / "reports" / "page-1-2-no-clicks" / "ledger.jsonl"
    r = subprocess.run([sys.executable, str(RD / "prepare_pages.py"), "--detect", a.detect,
                        "--ledger", str(led), "--out", a.out], cwd=ROOT)
    if r.returncode:
        return r.returncode
    rep = json.load(open(a.detect))
    by_path = {p["path"]: p for p in rep["pages"]}
    P = Path(a.out)
    qf = P / "queue.json"
    q = json.load(open(qf))
    for item in q["queue"]:
        d = P / item["slug"]
        pk = json.load(open(d / "packet.json"))
        src = by_path.get(item["path"], {})
        pk["page12"] = {k: src.get(k) for k in FIELDS}
        pk["page12"]["google_update_ongoing"] = rep.get("google_update_ongoing") or []
        pk["lane_hint"] = src.get("lane") or pk.get("lane_hint")
        own = (d / "page.ts").read_text() if (d / "page.ts").exists() else ""
        pk["inbound_links"] = inbound_links(item["path"], own)
        pk["detect_report"] = a.detect
        (d / "packet.json").write_text(json.dumps(pk, indent=2))
        item["lane_hint"] = pk["lane_hint"]
    qf.write_text(json.dumps(q, indent=2))
    print(f"OK page12 packets={len(q['queue'])} → {P}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
