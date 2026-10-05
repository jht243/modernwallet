#!/usr/bin/env python3
"""Measure treated pages — did the fix win the queries back? Google data only.

Reads reports/rank-drop/ledger.jsonl (one row per treated page, written by the
routine at publish time with the pre-fix position of every target query) and,
for rows treated >= 14 days ago, pulls the CURRENT position of those same
page×query pairs from the Search Console API (`final` data, last 14 days).

Hard fails exactly like detect.py — no Google, no verdict.

Verdicts per page: RECOVERED (median target query regained >= half the lost
positions) · PARTIAL · NO_CHANGE · WORSE (median position worse than pre-fix
by >= 3 → the routine must revert the edit). At >= 28 days the verdict is FINAL.

Usage: scripts/rank_drop/measure.py --ledger reports/rank-drop/ledger.jsonl --out reports/rank-drop/<date>.measure
"""

import argparse
import json
import statistics
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from detect import (GSC_SCOPE, HardFail, check_gsc_access, gsc_freshest_final_day,  # noqa: E402
                    gsc_rows, load_sa_info, session_for)


NOT_LOGGED = 60.0   # stand-in position for a search Google logged no impressions for


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--ledger", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args(argv)
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    ledger = Path(a.ledger)
    rows = [json.loads(x) for x in ledger.read_text().splitlines() if x.strip()] if ledger.exists() else []
    due = [r for r in rows if r.get("status") == "published"
           and (date.today() - date.fromisoformat(r["treated"])).days >= 14]
    if not due:
        Path(str(out) + ".json").write_text(json.dumps({"status": "OK", "results": []}))
        Path(str(out) + ".md").write_text("No treated pages are 14+ days old yet.\n")
        print("OK nothing due")
        return 0

    try:
        gsc = session_for(load_sa_info(), GSC_SCOPE)
        sites = {r["gsc_property"] for r in due}
        for s in sites:
            check_gsc_access(gsc, s)
        results = []
        for s in sites:
            end = gsc_freshest_final_day(gsc, s)
            cur = {tuple(r["keys"]): r for r in
                   gsc_rows(gsc, s, end - timedelta(days=13), end, ["page", "query"])}
            for r in (x for x in due if x["gsc_property"] == s):
                age = (date.today() - date.fromisoformat(r["treated"])).days
                deltas, detail = [], []
                for t in r["targets"]:
                    c = cur.get((r["page"], t["query"]))
                    now = c["position"] if c else None
                    detail.append({"query": t["query"], "pre_drop": t["base_pos"],
                                   "pre_fix": t["cur_pos"], "now": round(now, 1) if now else None})
                    # A search with no logged position (VANISHED) ranked ~30+; treat it as
                    # NOT_LOGGED both before and after, so a VANISHED search that comes
                    # back counts as a gain instead of reading NO_DATA forever.
                    deltas.append((t["cur_pos"] or NOT_LOGGED) - (now or NOT_LOGGED))  # + = improved
                lost = statistics.median([(t["cur_pos"] or NOT_LOGGED) - t["base_pos"] for t in r["targets"]])
                gain = statistics.median(deltas) if deltas else None
                if gain is not None and all(d["now"] is None for d in detail) and \
                        all(t["cur_pos"] is None for t in r["targets"]):
                    gain = None                                   # still nothing logged: no evidence yet
                if gain is None:
                    verdict = "NO_DATA"
                elif gain <= -3:
                    verdict = "WORSE"
                elif gain >= lost / 2:
                    verdict = "RECOVERED"
                elif gain >= 2:
                    verdict = "PARTIAL"
                else:
                    verdict = "NO_CHANGE"
                results.append({"page": r["page"], "treated": r["treated"], "age_days": age,
                                "final": age >= 28, "verdict": verdict,
                                "median_gain": round(gain, 1) if gain is not None else None, "targets": detail})
    except HardFail as e:
        Path(str(out) + ".json").write_text(json.dumps({"status": "FAIL", "exit_code": e.code, "error": str(e)}))
        print(f"HARD FAIL ({e.code}): {e}", file=sys.stderr)
        return e.code

    Path(str(out) + ".json").write_text(json.dumps({"status": "OK", "results": results}, indent=2))
    L = ["| page | treated | age | verdict | median positions regained | final |", "|---|---|---|---|---|---|"]
    L += [f"| `{x['page']}` | {x['treated']} | {x['age_days']}d | {x['verdict']} | {x['median_gain']} | "
          f"{'yes' if x['final'] else 'no'} |" for x in results]
    Path(str(out) + ".md").write_text("\n".join(L) + "\n")
    print(f"OK measured {len(results)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
