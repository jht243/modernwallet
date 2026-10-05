#!/usr/bin/env python3
"""Measurement revert (a WORSE verdict at 14d+): put ONE page back as it was before its treatment.

Through the site's backend — `git revert` cannot undo a database write (rankandpay) and would also
undo other crons' later edits in shared data files. Commits as `REVERT <path>` and updates nothing
else; the caller marks the ledger row `status: reverted`.

Usage: scripts/rank_drop/revert_page.py --path /guides/x --sha <first treatment commit> --date <D>
"""
import argparse
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from siteconf import ROOT, backend  # noqa: E402


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", required=True)
    ap.add_argument("--sha", required=True, help="the FIRST treatment commit; the page returns to its parent")
    ap.add_argument("--date", required=True)
    a = ap.parse_args(argv)
    B = backend()
    page = B.locate(a.path)
    if not page:
        print(f"FAIL page {a.path} not found by backend", file=sys.stderr)
        return 1
    res = B.restore(page, f"{a.sha}^", a.date)
    if not res.ok:
        print(f"FAIL {res.msg}", file=sys.stderr)
        return 1
    subprocess.run(["git", "add", *res.files], cwd=ROOT)
    subprocess.run(["git", "commit", "-q", "-m", f"rank-drop-recovery {a.date}: REVERT {a.path}\n\n"
                    f"Measurement verdict WORSE; restored to before {a.sha}."], cwd=ROOT)
    print(f"OK reverted {a.path} ({res.msg})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
