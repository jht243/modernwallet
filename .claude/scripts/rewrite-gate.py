#!/usr/bin/env python3
"""Fact-lock gate for in-place content rewrites. Fleet-shared (synced from layer3).

    python3 .claude/scripts/rewrite-gate.py <file> [<file> ...] [--base HEAD]

Compares each rewritten file against its committed version (`--base`, default HEAD)
and FAILS if any fact moved. A "fact" is every number (prices, rates, %, years,
counts, ranges), every currency amount, and every URL. They are compared as
multisets, so a rewrite may reword around them but may not add, drop or change one.
The frontmatter `updated:` / `updatedAt:` / `lastmod:` date is ignored (a rewrite
bumps it on purpose).

Appends one JSON line per file to reports/site-audit/<UTC date>.rewrite-gate.jsonl —
the receipt the routine commits with the run. Stdlib only.
Exit 0 = every file PASS, 2 = at least one FAIL, 1 = bad input.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

URL = re.compile(r"https?://[^\s)\"'<>\]]+")
NUM = re.compile(r"(?<![\w.])[$€£]?\d[\d,]*(?:\.\d+)?%?")
CUR = re.compile(r"\b(?:COP|USD|EUR|GBP|MXN|BRL|CAD|AUD)\s?\$?\d[\d,.]*\s*(?:million|billion|thousand|k|m)?\b", re.I)
DATE_KEYS = re.compile(r"^\s*(updated|updatedAt|lastmod|dateModified|modified)\s*:.*$", re.M)


def facts(text: str) -> Counter:
    text = DATE_KEYS.sub("", text)
    urls = URL.findall(text)
    body = URL.sub(" ", text)
    out = Counter(f"url:{u.rstrip('.,;')}" for u in urls)
    out.update("cur:" + " ".join(c.split()).lower() for c in CUR.findall(body))
    out.update(f"num:{n.rstrip(',')}" for n in NUM.findall(body))
    return out


def main() -> int:
    args = sys.argv[1:]
    base = "HEAD"
    if "--base" in args:
        i = args.index("--base"); base = args[i + 1]; del args[i:i + 2]
    if not args:
        print(__doc__); return 1
    root = Path(subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True).stdout.strip() or ".")
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    ledger = root / "reports" / "site-audit" / f"{day}.rewrite-gate.jsonl"
    ledger.parent.mkdir(parents=True, exist_ok=True)
    worst = 0
    for f in args:
        p = Path(f)
        if not p.exists():
            print(f"REWRITE-GATE FAIL {f}: file not found"); worst = 2; continue
        rel = p.resolve().relative_to(root.resolve()).as_posix()
        old = subprocess.run(["git", "-C", str(root), "show", f"{base}:{rel}"], capture_output=True, text=True)
        if old.returncode:
            print(f"REWRITE-GATE FAIL {f}: no committed version at {base}"); worst = 2; continue
        a, b = facts(old.stdout), facts(p.read_text(encoding="utf-8"))
        removed, added = dict(a - b), dict(b - a)
        verdict = "PASS" if not removed and not added else "FAIL"
        if verdict == "FAIL":
            worst = 2
        rec = {"ts": datetime.now(timezone.utc).isoformat(timespec="seconds"), "file": rel, "base": base,
               "facts": sum(a.values()), "verdict": verdict, "removed": removed, "added": added,
               "words_before": len(old.stdout.split()), "words_after": len(p.read_text(encoding="utf-8").split())}
        with ledger.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
        detail = "" if verdict == "PASS" else f" removed={removed} added={added}"
        print(f"REWRITE-GATE {verdict} {rel} facts={rec['facts']}{detail}")
    print(f"receipt: {ledger.relative_to(root)}")
    return worst


if __name__ == "__main__":
    sys.exit(main())
