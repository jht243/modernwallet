#!/usr/bin/env python3
"""The run's email, built from the run's own records — never hand-written.

2026-10-05: the 20:53 run sent "SUCCESS — (no summary provided) / No further detail reported."
because the agent was left to write the body. This builds it from git + the packets so every email
says, for each page: what it lost in Google (why we touched it), what changed, and how the audit
went, in plain words a person can scan.

Usage: scripts/rank_drop/email_report.py --packets <P> --date <D> [--detect reports/rank-drop/<D>.json]
Writes /tmp/rank-drop-<D>.md (the details) and prints ONE summary line on stdout for --summary.
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from runlog import ROOT, git, run_commits, section_heading_now  # noqa: E402
from siteconf import site, url as site_url  # noqa: E402


def jload(p: Path, default=None):
    try:
        return json.load(open(p))
    except Exception:  # noqa: BLE001
        return default


def pos(x) -> str:
    return "not ranking" if x in (None, 0) or (isinstance(x, (int, float)) and x >= 60) else f"#{round(x)}"


def why(pk: dict) -> str:
    lost = sorted(pk.get("lost_searches", []), key=lambda q: -(q.get("base_impr_d") or 0))[:3]
    parts = [f"“{q['query']}” {pos(q.get('base_pos'))} → {pos(q.get('cur_pos'))}" for q in lost]
    c = (pk.get("traffic") or {}).get("gsc_clicks_d") or {}
    clicks = f" Google clicks/day {c.get('baseline')} → {c.get('current')}." if c else ""
    return ("Lost " + "; ".join(parts) + "." if parts else "Lost rankings.") + clicks


def short(t: str, n: int = 220) -> str:
    t = " ".join(str(t).split())
    return t if len(t) <= n else t[:n].rsplit(" ", 1)[0] + "\u2026"


def body_edits(sha: str) -> int:
    return sum(1 for l in git("log", "-1", "--format=%b", sha).splitlines() if "->" in l)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    ap.add_argument("--date", required=True)
    ap.add_argument("--detect")
    a = ap.parse_args(argv)
    P = Path(a.packets).resolve()
    det = jload(Path(a.detect or ROOT / f"reports/rank-drop/{a.date}.json"), {}) or {}
    queue = (jload(P / "queue.json", {}) or {}).get("queue", [])
    commits = run_commits(P) if queue else {}
    finish = jload(P / "finish.json", {}) or {}
    live = finish.get("live", {})
    rw = {r["slug"]: r for r in (jload(P / "rework.json", {}) or {}).get("reverted", [])}
    # reverted only if THIS run's last commit for the page is a REVERT (git, not a leftover file)
    reverted = {q["slug"]: rw.get(q["slug"], {}) for q in queue
                if (commits.get(q["path"]) or [{}])[-1].get("kind") == "REVERT"}

    changed, flagged, n_sec, n_price, n_meta = [], [], 0, 0, 0
    for q in queue:
        slug, d = q["slug"], P / q["slug"]
        pk = jload(d / "packet.json", {}) or {}
        plan = jload(d / "plan.json", {}) or {}
        au = jload(d / "audit.json", {}) or {}
        title = re.sub(r"\s*\|\s*Layer3\s*Labs\s*$", "", pk.get("title") or slug, flags=re.I)
        url = site_url(q["path"])
        cs = commits.get(q["path"], [])
        act = plan.get("action")
        for x in au.get("out_of_scope") or []:
            flagged.append(f"**{title}**: older text needs a look (left unchanged): {short(x)}")
        if act and act.startswith("flag"):
            flagged.append(f"**{title}**: no change; searchers now want something else. {short(plan.get('summary', act))}")
        if not cs:
            continue
        kinds = [c["kind"] for c in cs]
        what = []
        if slug in reverted:
            r = reverted[slug]
            what.append("**Reverted** to how it was before this run: it failed the audit after 2 rewrites "
                        f"({'; '.join(r.get('findings', [])[:1])[:200]}).")
        else:
            if "REWRITE" in kinds:
                what.append("Rewrote the page.")
            elif any(k in kinds for k in ("RECOVER", "REFRESH", "DIFFERENTIATE", "SECTION", "REWORK")) \
                    and act == "add_section":
                h = section_heading_now(q, plan, d)
                what.append(f"Added a section: “{h}”." if h else "Added a new section.")
                n_sec += 1
            if (plan.get("meta") or {}).get("metaTitle"):
                what.append("New search title and description.")
                n_meta += 1
            p_edits = sum(body_edits(c["sha"]) for c in cs if c["kind"] in ("DATA REFRESH", "FACT FIX"))
            if p_edits:
                what.append(f"Updated {p_edits} outdated price mention{'s' if p_edits != 1 else ''} to current prices.")
                n_price += 1
            fx = sum(body_edits(c["sha"]) for c in cs if c["kind"] == "AUDIT FIX")
            if fx:
                what.append(f"Reviewer corrected {fx} sentence{'s' if fx != 1 else ''} before publishing.")
            if "REWORK" in kinds:
                what.append("The new section was rewritten once after review.")
        audit = au.get("verdict") or "not audited"
        lv = live.get(url)
        status = ("live" if lv == "ok" else f"not live yet ({lv})" if lv else "pending deploy") \
            if slug not in reverted else "reverted"
        changed.append(f"\n### [{title}]({url})\n- **Why:** {why(pk)}\n- **What changed:** {' '.join(what) or 'n/a'}\n"
                       f"- **Review:** {audit.lower() if audit != 'PASS' else 'passed'}"
                       f"{'' if audit == 'not audited' else f' (round {au.get(chr(114)+chr(111)+chr(117)+chr(110)+chr(100), 1)})'}"
                       f" · **Status:** {status}")

    kept = [c for c in changed if "**Reverted**" not in c]
    n_rev = len(changed) - len(kept)
    n_live = sum(1 for v in live.values() if v == "ok")
    mode = det.get("mode", "?")
    summary = (f"{len(kept)} page{'s' if len(kept) != 1 else ''} fixed ({n_sec} new sections, {n_price} price "
               f"updates, {n_meta} new titles), {n_rev} reverted, {len(flagged)} flagged. "
               f"{n_live}/{len(live)} live." if changed or flagged else
               f"No pages needed changes this run (mode {mode}).")

    ongoing = ", ".join(u["name"] for u in (det.get("google_updates") or {}).get("ongoing", [])) or "none"
    stats = det.get("stats") or {}
    L = [f"**{summary}**", "",
         f"Mode: **{mode}**" + (f" ({det['mode_override']})" if det.get("mode_override") else "")
         + f". Google updates rolling out: {ongoing}. Data: Google Search Console + GA4 only.", "",
         "## Pages changed", ""] + (changed or ["None this run."]) + \
        ["", "## Flagged for you (nothing changed)", ""] + ([f"- {x}" for x in flagged] or ["None."]) + \
        ["", "## Run details", "",
         f"- Pages checked: {len(queue)} dropped pages qualified"
         + (f"; {stats['pages_below_traffic_floor']} more were skipped for low traffic" if 'pages_below_traffic_floor' in stats else "") + ".",
         f"- IndexNow: {finish.get('indexnow', 'not sent')} for {finish.get('indexnow_urls', 0)} URLs.",
         f"- Changed pages are left alone for 28 days so Google can react; the next check of their results is at 14 days."]
    out = Path(f"/tmp/rank-drop-{a.date}.md")
    out.write_text("\n".join(L) + "\n")
    print(summary)
    return 0


if __name__ == "__main__":
    sys.exit(main())
