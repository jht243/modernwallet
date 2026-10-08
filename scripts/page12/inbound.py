#!/usr/bin/env python3
"""Add internal links TO pages that almost nothing links to — code only, one commit per page.

Both examples that started this routine (is-nutshell-worth-it, zoho-crm-vs-pipedrive) had ONE internal
link pointing at them. For every packet whose diagnosis says `inbound: true`, this picks up to 5
related pages (same entity words in the slug, not in today's queue, not already linking) and adds a
link card for the target to the FRONT of each one's `relatedLinks` list. The card's title and
description are the target's own (current) title and meta description — no new prose.

Structured data only, so it is an exempt edit; the auditor still checks every INBOUND LINKS commit.
Backends: ts_entries (relatedLinks arrays). Other backends are skipped and reported.

Usage: scripts/page12/inbound.py --packets <P> --date <D> [--max 5]
"""

import argparse
import os
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
os.environ.setdefault("RD_ENGINE", "page-1-2-no-clicks-pass")   # shared rank_drop scripts read it
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "rank_drop"))

GENERIC = set("""ai a an the and or of for to in on at by with vs versus is are it its how what which who why
best top free guide review reviews pricing price prices cost costs plans plan explained worth 2025 2026 new
latest model models tool tools software app apps alternatives alternative small business businesses use
using vs comparison compare guides comparisons""".split())


def tokens(path: str) -> set[str]:
    return {t for t in re.split(r"[^a-z0-9]+", path.rsplit("/", 1)[-1].lower()) if len(t) >= 3 and t not in GENERIC}


def card(page, path: str) -> dict:
    title = re.sub(r"\s*[|·–-]\s*Layer\s*3\s*Labs\s*$", "", page.title or "", flags=re.I).strip()
    desc = (page.extra.get("description") or "").strip()
    cat = "Comparison" if path.startswith("/comparisons/") else "Guide" if path.startswith("/guides/") else "Resource"
    return {"title": title, "description": desc, "href": path, "category": cat}


def insert_card(entry: str, c: dict) -> str | None:
    m = re.search(r"""["']?relatedLinks["']?\s*:\s*\[""", entry)
    if not m or c["href"] in entry:
        return None
    json_keys = bool(re.search(r'^\s*"slug"\s*:', entry, re.M))
    if json_keys:
        obj = json.dumps(c, ensure_ascii=False)
    else:
        obj = "{ " + ", ".join(f"{k}: {json.dumps(v, ensure_ascii=False)}" for k, v in c.items()) + " }"
    nl = entry.rfind("\n", 0, m.start())
    ind = re.match(r"\s*", entry[nl + 1:]).group(0) + "  "
    return entry[:m.end()] + "\n" + ind + obj + "," + entry[m.end():]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    ap.add_argument("--date", required=True)
    ap.add_argument("--max", type=int, default=5)
    a = ap.parse_args(argv)
    from siteconf import backend, engine, site
    P = Path(a.packets).resolve()
    if site()["backend"] != "ts_entries":
        (P / "inbound.json").write_text(json.dumps({"skipped": f"backend {site()['backend']} not supported"}))
        print(f"SKIP inbound: backend {site()['backend']} has no relatedLinks support yet")
        return 0
    B = backend()
    queue = json.load(open(P / "queue.json"))["queue"]
    todo = {q["path"] for q in queue}
    routes = [r for r in (P / "routes.txt").read_text().split() if r.startswith(("/guides/", "/comparisons/"))]
    results = []
    for q in queue:
        d = P / q["slug"]
        dx = json.load(open(d / "diagnosis.json")) if (d / "diagnosis.json").exists() else {}
        if not dx.get("inbound"):
            continue
        target = B.locate(q["path"])
        if not target:
            continue
        mine = tokens(q["path"])
        if not mine:
            results.append({"path": q["path"], "added": [], "why": "no entity words in slug"})
            continue
        scored = []
        for r in routes:
            if r in todo or r == q["path"]:
                continue
            ov = len(mine & tokens(r))
            if ov:                                       # tie-break: same intent word (pricing, vs, alternatives…)
                same_intent = len(set(re.split(r"[^a-z0-9]+", q["path"].rsplit("/", 1)[-1])) & GENERIC &
                                  set(re.split(r"[^a-z0-9]+", r.rsplit("/", 1)[-1])))
                scored.append((-ov, -same_intent, len(r), r))
        c = card(target, q["path"])
        if not c["title"] or not c["description"]:
            results.append({"path": q["path"], "added": [], "why": "target has no title/description to show"})
            continue
        added, files = [], set()
        for *_, r in sorted(scored):
            if len(added) >= a.max:
                break
            src_page = B.locate(r)
            if not src_page or not src_page.files:
                continue
            f = ROOT / src_page.files[0]
            text = f.read_text()
            new_entry = insert_card(src_page.native, c)
            if not new_entry or text.count(src_page.native) != 1:
                continue
            f.write_text(text.replace(src_page.native, new_entry))
            ok, msg = B.validate([src_page.files[0]])
            if not ok:
                f.write_text(text)                      # never leave a broken file behind
                continue
            added.append(r)
            files.add(src_page.files[0])
        if added:
            subprocess.run(["git", "add", *sorted(files)], cwd=ROOT)
            body = "\n".join(f"-> linked from {r}" for r in added)
            subprocess.run(["git", "commit", "-q", "-m",
                            f"{engine()} {a.date}: INBOUND LINKS {q['path']}\n\n{body}\n\n"
                            "Co-Authored-By: Claude <noreply@anthropic.com>"], cwd=ROOT)
        results.append({"path": q["path"], "added": added})
    (P / "inbound.json").write_text(json.dumps(results, indent=2))
    print(f"OK inbound pages={sum(1 for r in results if r.get('added'))} links={sum(len(r.get('added', [])) for r in results)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
