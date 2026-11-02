#!/usr/bin/env python3
"""Fact-lock gate for in-place content rewrites. Fleet-shared (synced from layer3).

    python3 .claude/scripts/rewrite-gate.py <file> [<file> ...] [--base HEAD]
    python3 .claude/scripts/rewrite-gate.py --check-ledger <file> [<file> ...]

Compares each rewritten file against its committed version (`--base`, default HEAD)
and FAILS if any fact moved. A "fact" is every number (prices, rates, %, years,
counts, ranges), every currency amount, and every URL. They are compared as
multisets, so a rewrite may reword around them but may not add, drop or change one.
The frontmatter `updated:` / `updatedAt:` / `lastmod:` date is ignored (a rewrite
bumps it on purpose), and an `http://` -> `https://` upgrade of the same link is not
a change.

`--check-ledger` gates the commit: every named file must have a latest line of PASS
in any reports/site-audit/*.rewrite-gate.jsonl; a missing file or a latest FAIL
exits 2.

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
    out = Counter("url:" + re.sub(r"^http://", "https://", u.rstrip('.,;')) for u in urls)
    out.update("cur:" + " ".join(c.split()).lower() for c in CUR.findall(body))
    out.update(f"num:{n.rstrip(',')}" for n in NUM.findall(body))
    return out


def check_ledger(files: list[str]) -> int:
    root = Path(subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True).stdout.strip() or ".")
    latest: dict[str, tuple[str, str]] = {}
    for led in sorted((root / "reports" / "site-audit").glob("*.rewrite-gate.jsonl")):
        for line in led.read_text(encoding="utf-8").splitlines():
            try:
                rec = json.loads(line)
            except ValueError:
                continue
            prev = latest.get(rec.get("file", ""))
            if prev is None or rec.get("ts", "") >= prev[0]:
                latest[rec.get("file", "")] = (rec.get("ts", ""), rec.get("verdict", ""))
    bad = 0
    for f in files:
        rel = Path(f).resolve().relative_to(root.resolve()).as_posix()
        verdict = latest.get(rel, ("", "MISSING"))[1]
        print(f"LEDGER {'OK ' if verdict == 'PASS' else 'BAD'} {rel} latest={verdict}")
        bad |= verdict != "PASS"
    return 2 if bad else 0


def main() -> int:
    args = sys.argv[1:]
    if args[:1] == ["--check-ledger"]:
        return check_ledger(args[1:]) if args[1:] else 1
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
