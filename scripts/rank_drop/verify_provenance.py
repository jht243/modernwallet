#!/usr/bin/env python3
"""Gate every later phase on a valid Google-first-party detection report.

Exits 0 only when the detect.py JSON exists, is status OK, lists exactly the
Google sources, names no third-party source, is fresh (< 36h), and its sha256
matches its body (i.e. no hand edits after the pull). Anything else → exit 20.

Usage: scripts/rank_drop/verify_provenance.py reports/rank-drop/<date>.json
"""

import hashlib
import json
import sys
from datetime import datetime, timedelta, timezone

ALLOWED = {"searchconsole.googleapis.com", "analyticsdata.googleapis.com",
           "status.search.google.com"}


def main(path: str) -> int:
    try:
        rep = json.load(open(path))
    except Exception as e:  # noqa: BLE001
        print(f"PROVENANCE FAIL: cannot read {path}: {e}", file=sys.stderr)
        return 20
    prov = rep.get("provenance") or {}
    problems = []
    if rep.get("status") != "OK":
        problems.append(f"status={rep.get('status')} ({rep.get('error')})")
    if set(prov.get("sources", [])) != ALLOWED:
        problems.append(f"sources={prov.get('sources')}")
    if prov.get("third_party_sources"):
        problems.append(f"third_party_sources={prov['third_party_sources']}")
    try:
        age = datetime.now(timezone.utc) - datetime.fromisoformat(rep["generated_at"])
        if age > timedelta(hours=36):
            problems.append(f"report is {age} old")
    except Exception:  # noqa: BLE001
        problems.append("generated_at missing")
    body = json.dumps({k: v for k, v in rep.items() if k != "provenance"}, sort_keys=True)
    if hashlib.sha256(body.encode()).hexdigest() != prov.get("sha256"):
        problems.append("sha256 mismatch — report was edited after the Google pull")
    if problems:
        print("PROVENANCE FAIL: " + "; ".join(problems), file=sys.stderr)
        return 20
    print(f"PROVENANCE OK: {path} (Google first-party, sha {prov['sha256'][:12]})")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]) if len(sys.argv) == 2 else 2)
