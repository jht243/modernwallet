#!/usr/bin/env python3
"""Phase 6 after the deploy push — ledger rows, ONE IndexNow POST, live verification. All code.

Pages = every queue page this run committed whose latest audit.json is PASS and that rework.py did
not revert. For each: one ledger row (targets copied from packet.json's Google pairs, never typed),
its URL in a single IndexNow POST, and a live check that polls until the page returns 200 and
shows the new section heading (pages without a new section: 200 only), capped at --wait minutes.
Then commits the packets dir + ledger (stage only those). The 2026-10-04 re-audit did all of this
by hand; never again.

Usage: scripts/rank_drop/finish_run.py --packets <P> --date <D> [--wait 15] [--no-commit]
Writes <P>/finish.json {ledger_rows, indexnow, live: {url: "ok"|"timeout"|code}}; exit 0 even if a
page is not live yet (the email reports it), 1 only when nothing could be verified at all.
"""

import argparse
import html
import json
import os
import re
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from runlog import ROOT, run_commits, section_heading_now  # noqa: E402
from siteconf import engine, reports_dir, site, url as site_url  # noqa: E402

SITE = site()["base_url"].rstrip("/")
GSC = site()["gsc_property"]
INDEXNOW_FALLBACK = site().get("indexnow_key", "dc557f6bfced447aa1a71771d8a0d24a")


def fetch(url: str) -> tuple[int, str]:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "rank-drop-verify/1.0", "Cache-Control": "no-cache"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception:  # noqa: BLE001
        return 0, ""


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    ap.add_argument("--date", required=True)
    ap.add_argument("--wait", type=int, default=15, help="minutes to wait for the deploy")
    ap.add_argument("--no-commit", action="store_true")
    ap.add_argument("--no-indexnow", action="store_true", help="testing only")
    a = ap.parse_args(argv)
    P = Path(a.packets).resolve()
    queue = json.load(open(P / "queue.json"))["queue"]
    commits = run_commits(P)
    # reverted = this run's LAST commit for the page is a REVERT (git is the truth; a rework.json left by
    # an earlier run in the same folder once hid a live, passed page from the ledger on 2026-10-05)
    reverted = {q["slug"] for q in queue if (commits.get(q["path"]) or [{}])[-1].get("kind") == "REVERT"}

    rows, checks = [], {}
    for q in queue:
        slug, d = q["slug"], P / q["slug"]
        cs = [c for c in commits.get(q["path"], []) if c["kind"] != "REVERT"]
        if not cs or slug in reverted:
            continue
        au = json.load(open(d / "audit.json")) if (d / "audit.json").exists() else {}
        if au.get("verdict") != "PASS":
            continue
        pk = json.load(open(d / "packet.json"))
        plan = json.load(open(d / "plan.json")) if (d / "plan.json").exists() else {}
        url = site_url(q["path"])
        rows.append({
            "page": url, "gsc_property": GSC, "treated": a.date,
            "lane": plan.get("lane") or q.get("lane_hint"),
            "commits": [c["sha"] for c in cs], "edits": sorted({c["kind"] for c in cs}),
            "status": "published", "audit_rounds": au.get("round", 1),
            "detect_report": pk.get("detect_report") or f"{reports_dir()}/{a.date}.json",
            "detect_sha256": pk.get("detect_sha256"),
            "targets": [{"query": s["query"], "base_pos": s.get("base_pos"), "cur_pos": s.get("cur_pos")}
                        for s in pk.get("lost_searches", [])],
            # page-1-2-no-clicks-pass: the pre-fix clicks/impressions/CTR its measure.py compares against
            **({"baseline": pk["page12"]} if pk.get("page12") else {}),
        })
        marker = section_heading_now(q, plan, d)   # the new heading as it reads NOW (audit fixes may retitle)
        checks[url] = marker

    led = ROOT / reports_dir() / "ledger.jsonl"
    led.parent.mkdir(parents=True, exist_ok=True)
    have = set()
    if led.exists():
        for line in led.read_text().splitlines():
            try:
                x = json.loads(line)
                have.add((x.get("page"), x.get("treated"), tuple(x.get("commits") or [])))
            except json.JSONDecodeError:
                continue
    new_rows = [r for r in rows if (r["page"], r["treated"], tuple(r["commits"])) not in have]  # re-run safe
    with open(led, "a") as fh:
        for r in new_rows:
            fh.write(json.dumps(r) + "\n")

    # live check — poll until every page is 200 (+ shows its new heading) or the cap
    live, deadline = {}, time.time() + a.wait * 60
    pending = dict(checks)
    while pending and time.time() < deadline:
        for url, marker in list(pending.items()):
            code, body = fetch(url)
            if code == 200 and (not marker or marker in html.unescape(body)):
                live[url] = "ok"
                pending.pop(url)
            else:
                live[url] = code
        if pending:
            time.sleep(30)
    for url in pending:
        live[url] = "timeout" if live.get(url) == 200 else live.get(url, "timeout")

    # ONE IndexNow POST for every changed URL that is live
    urls = [u for u, v in live.items() if v == "ok"]
    indexnow = None
    if urls and not a.no_indexnow:
        key = os.environ.get("INDEXNOW_KEY") or INDEXNOW_FALLBACK
        body = json.dumps({"host": SITE.split("//")[1], "key": key,
                           "keyLocation": f"{SITE}/{key}.txt", "urlList": urls}).encode()
        try:
            with urllib.request.urlopen(urllib.request.Request(
                    "https://api.indexnow.org/indexnow", data=body,
                    headers={"Content-Type": "application/json"}), timeout=30) as r:
                indexnow = r.status
        except urllib.error.HTTPError as e:
            indexnow = e.code
        except Exception as e:  # noqa: BLE001
            indexnow = str(e)[:100]

    oos = {}
    for af in P.glob("*/audit.json"):
        x = json.load(open(af)).get("out_of_scope") or []
        if x:
            oos[af.parent.name] = x
    out = {"ledger_rows": len(rows), "ledger_rows_new": len(new_rows), "indexnow": indexnow, "indexnow_urls": len(urls), "live": live,
           "out_of_scope": oos}
    (P / "finish.json").write_text(json.dumps(out, indent=1))
    if not a.no_commit:
        subprocess.run(["git", "add", str(P.relative_to(ROOT)), f"{reports_dir()}/ledger.jsonl"], cwd=ROOT)
        subprocess.run(["git", "commit", "-q", "-m",
                        f"{engine()} {a.date}: packets, audit rounds, ledger rows ({len(rows)} pages)"], cwd=ROOT)
    ok = sum(v == "ok" for v in live.values())
    print(f"OK finish ledger_rows={len(rows)} live={ok}/{len(live)} indexnow={indexnow}")
    return 0 if (ok or not live) else 1


if __name__ == "__main__":
    sys.exit(main())
