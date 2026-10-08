#!/usr/bin/env python3
"""Measure treated pages — did the fix turn impressions into clicks? Google data only.

Reads reports/page-1-2-no-clicks/ledger.jsonl (finish_run.py writes one row per published page with
its pre-fix `baseline`: 90-day impressions, clicks, CTR, main search + position). For rows treated
>= 14 days ago it pulls the page's clicks/impressions/position from Search Console for the days
since the fix (skipping the first 3 days while Google re-crawls), plus the main search's position.

Verdicts: WIN (CTR >= 1.5x baseline and clicks/day up) · PARTIAL (CTR up >= 1.15x) · NO_CHANGE ·
WORSE (clicks/day < 0.7x baseline AND CTR < 0.8x baseline, with enough impressions to judge) →
the routine reverts the page (revert_page.py). FINAL at >= 28 days. Rows treated while a Google
ranking update was rolling out are marked `update_window` so a verdict is read with that in mind.

Hard fails exactly like detect.py — no Google, no verdict.
Usage: scripts/page12/measure.py --out reports/page-1-2-no-clicks/<D>.measure
"""

import argparse
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

HERE = Path(__file__).resolve().parent
os.environ.setdefault("RD_ENGINE", "page-1-2-no-clicks-pass")
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "rank_drop"))
from detect import (GSC_SCOPE, HardFail, check_gsc_access, gsc_freshest_final_day,  # noqa: E402
                    gsc_rows, load_sa_info, session_for)

LEDGER = ROOT / "reports" / "page-1-2-no-clicks" / "ledger.jsonl"
SETTLE_DAYS = 3
MIN_IMPR_TO_JUDGE = 300


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    a = ap.parse_args(argv)
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    rows = [json.loads(x) for x in LEDGER.read_text().splitlines() if x.strip()] if LEDGER.exists() else []
    due = [r for r in rows if r.get("status") == "published" and r.get("baseline")
           and (date.today() - date.fromisoformat(r["treated"])).days >= 14]
    if not due:
        Path(str(out) + ".json").write_text(json.dumps({"status": "OK", "results": []}))
        Path(str(out) + ".md").write_text("No treated pages are 14+ days old yet.\n")
        print("OK nothing due")
        return 0
    try:
        gsc = session_for(load_sa_info(), GSC_SCOPE)
        results = []
        for s in sorted({r["gsc_property"] for r in due}):
            check_gsc_access(gsc, s)
            end = gsc_freshest_final_day(gsc, s)
            for r in (x for x in due if x["gsc_property"] == s):
                b = r["baseline"]
                start = date.fromisoformat(r["treated"]) + timedelta(days=SETTLE_DAYS)
                if start > end:
                    continue
                days = (end - start).days + 1
                filt = [{"dimension": "page", "operator": "equals", "expression": r["page"]}]
                import urllib.parse
                from detect import GSC_API, call
                url = f"{GSC_API}/sites/{urllib.parse.quote(s, safe='')}/searchAnalytics/query"
                body = {"startDate": start.isoformat(), "endDate": end.isoformat(), "dimensions": ["query"],
                        "dataState": "final", "type": "web", "rowLimit": 25000,
                        "dimensionFilterGroups": [{"filters": filt}]}
                q_rows = call(gsc, "POST", url, body).get("rows", [])
                tot = call(gsc, "POST", url, {**body, "dimensions": []}).get("rows", [])
                clicks = tot[0]["clicks"] if tot else 0
                impr = tot[0]["impressions"] if tot else 0
                ctr = clicks / impr if impr else 0.0
                main = next((x for x in q_rows if x["keys"][0] == b.get("main_query")), None)
                c_before, c_after = (b["clicks_90d"] or 0) / 90, clicks / days
                ctr_before = b.get("ctr") or 0.0
                if impr < MIN_IMPR_TO_JUDGE:
                    verdict = "NO_DATA"
                elif c_after < 0.7 * c_before and ctr < 0.8 * ctr_before:
                    verdict = "WORSE"
                elif ctr >= 1.5 * max(ctr_before, 1e-6) and c_after > c_before:
                    verdict = "WIN"
                elif ctr >= 1.15 * max(ctr_before, 1e-6):
                    verdict = "PARTIAL"
                else:
                    verdict = "NO_CHANGE"
                age = (date.today() - date.fromisoformat(r["treated"])).days
                results.append({"page": r["page"], "treated": r["treated"], "age_days": age, "final": age >= 28,
                                "verdict": verdict, "lane": r.get("lane"),
                                "clicks_d": [round(c_before, 2), round(c_after, 2)],
                                "ctr": [round(ctr_before, 5), round(ctr, 5)],
                                "impressions_d": [round((b["impressions_90d"] or 0) / 90, 1), round(impr / days, 1)],
                                "main_query": b.get("main_query"),
                                "main_pos": [b.get("main_pos"), round(main["position"], 1) if main else None],
                                "update_window": bool(b.get("google_update_ongoing")),
                                "first_sha": (r.get("commits") or [None])[0]})
    except HardFail as e:
        Path(str(out) + ".json").write_text(json.dumps({"status": "FAIL", "exit_code": e.code, "error": str(e)}))
        print(f"HARD FAIL ({e.code}): {e}", file=sys.stderr)
        return e.code
    Path(str(out) + ".json").write_text(json.dumps({"status": "OK", "results": results}, indent=2))
    L = ["| page | treated | age | lane | verdict | clicks/day before→after | CTR before→after | main search pos | final |",
         "|---|---|---|---|---|---|---|---|---|"]
    L += [f"| `{x['page']}` | {x['treated']} | {x['age_days']}d | {x['lane']} | {x['verdict']}"
          f"{' (update window)' if x['update_window'] else ''} | {x['clicks_d'][0]}→{x['clicks_d'][1]} | "
          f"{x['ctr'][0]:.2%}→{x['ctr'][1]:.2%} | {x['main_pos'][0]}→{x['main_pos'][1]} | {'yes' if x['final'] else 'no'} |"
          for x in results]
    Path(str(out) + ".md").write_text("\n".join(L) + "\n")
    print(f"OK measured {len(results)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
