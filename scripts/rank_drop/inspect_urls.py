#!/usr/bin/env python3
"""Technical gate for every queued page, in parallel — Google URL Inspection + a live fetch.

A page Google can't index gets no content edit; it goes to the TECH lane. The first live run did
this ad hoc for 15 pages in ~2 minutes; this does the whole queue in under a minute.

Writes packet.json["tech"] for each page and <packets>/tech.json (failures only).
Usage: GOOGLE_REPORTING_SA_JSON=… scripts/rank_drop/inspect_urls.py --packets reports/rank-drop/<date>/packets
"""

import argparse
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from detect import GSC_SCOPE, HardFail, load_sa_info, session_for  # noqa: E402

INSPECT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"


def check(gsc, site, url):
    import requests
    out = {"url": url}
    try:
        r = requests.get(url, timeout=30, allow_redirects=False)
        out["status"] = r.status_code
        out["noindex"] = "noindex" in r.headers.get("x-robots-tag", "").lower() or \
            bool(re.search(r'<meta[^>]+name=["\']robots["\'][^>]+noindex', r.text, re.I))
        m = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)', r.text, re.I)
        out["canonical"] = m.group(1) if m else None
    except Exception as e:  # noqa: BLE001
        out["status"] = f"error: {e}"
    try:
        res = gsc.post(INSPECT, json={"inspectionUrl": url, "siteUrl": site}, timeout=60).json()
        ir = res.get("inspectionResult", {}).get("indexStatusResult", {})
        out["verdict"] = ir.get("verdict")
        out["coverage"] = ir.get("coverageState")
        out["google_canonical"] = ir.get("googleCanonical")
    except Exception as e:  # noqa: BLE001
        out["verdict"] = f"error: {e}"
    out["ok"] = (out.get("status") == 200 and not out.get("noindex") and out.get("verdict") == "PASS"
                 and (out.get("canonical") in (None, url)))
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    from siteconf import site
    ap.add_argument("--gsc-property", default=site()["gsc_property"])
    a = ap.parse_args(argv)
    P = Path(a.packets)
    queue = json.load(open(P / "queue.json"))["queue"]
    try:
        gsc = session_for(load_sa_info(), GSC_SCOPE)
    except HardFail as e:
        print(f"HARD FAIL ({e.code}): {e}", file=sys.stderr)
        return e.code
    pk = {q["slug"]: json.load(open(P / q["slug"] / "packet.json")) for q in queue}
    with ThreadPoolExecutor(max_workers=8) as ex:
        results = dict(zip(pk, ex.map(lambda s: check(gsc, a.gsc_property, pk[s]["url"]), pk)))
    bad = {}
    for s, r in results.items():
        pk[s]["tech"] = r
        (P / s / "packet.json").write_text(json.dumps(pk[s], indent=2))
        if not r["ok"]:
            bad[s] = r
    (P / "tech.json").write_text(json.dumps(bad, indent=2))
    print(f"OK inspected={len(results)} tech_failures={len(bad)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
