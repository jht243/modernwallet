#!/usr/bin/env python3
"""Build the Phase 5 auditor batches from git — no hand-assembled commit lists.

For every page this run committed, collect its commits (sha + kind), which standard audits it
(new content → mindmap-pass phase-4-audit; price/fact/meta edits → the exempt checks), and its
Rung 0 lint items (lint.json from lint_new_text.py). Pages are grouped by standard into batches
and each batch gets a ready brief, `<P>/audit-batch-<n>.md`; the orchestrator launches one auditor
per brief, all in ONE message, with the prompt "Follow scripts/rank_drop/AUDITOR_TASK.md for
<brief path>".

Usage: scripts/rank_drop/audit_batches.py --packets <P> [--size 5]
Writes <P>/audit-batches.json and <P>/audit-batch-<n>.md; prints the brief paths.
"""

import argparse
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from runlog import ROOT, run_commits  # noqa: E402

NEW_CONTENT_ACTIONS = ("add_section", "rewrite")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    ap.add_argument("--size", type=int, default=5)
    a = ap.parse_args(argv)
    P = Path(a.packets).resolve()
    rel = P.relative_to(ROOT)
    queue = json.load(open(P / "queue.json"))["queue"]
    commits = run_commits(P)
    pages = {"new_content": [], "exempt": []}
    for q in queue:
        cs = [c for c in commits.get(q["path"], []) if c["kind"] not in ("AUDIT FIX",)]
        if not cs:
            continue
        d = P / q["slug"]
        plan = json.load(open(d / "plan.json")) if (d / "plan.json").exists() else {}
        lint = json.load(open(d / "lint.json")).get("run_introduced", []) if (d / "lint.json").exists() else []
        std = "new_content" if plan.get("action") in NEW_CONTENT_ACTIONS else "exempt"
        pages[std].append({"slug": q["slug"], "path": q["path"], "data_file": q["data_file"],
                           "commits": cs, "standard": std, "lint": lint})
    batches = []
    for std, ps in pages.items():
        for i in range(0, len(ps), a.size):
            batches.append({"n": len(batches) + 1, "standard": std, "pages": ps[i:i + a.size]})
    (P / "audit-batches.json").write_text(json.dumps(batches, indent=1, ensure_ascii=False))
    for b in batches:
        L = [f"# Audit batch {b['n']} — {b['standard'].replace('_', ' ')}",
             f"Packets: `{rel}` (so `<slug>` files are `{rel}/<slug>/…`). Standard: "
             + ("**new content** → `.claude/commands/mindmap-pass/phase-4-audit.md` (AUDITOR_TASK.md § Which standard)."
                if b["standard"] == "new_content" else
                "**exempt edits** → the 5 checks in AUDITOR_TASK.md, plus § Prices on every page."),
             "", "## Pages (audit the `git show <sha> -- data/` diff of every listed commit)"]
        for p in b["pages"]:
            L.append(f"- `{p['slug']}` ({p['path']}, {p['data_file']}): "
                     + ", ".join(f"{c['sha']} {c['kind']}" for c in p["commits"]))
            for it in p["lint"]:
                extra = f" ({it['chars']} chars, max {it['max']})" if it.get("chars") else ""
                L.append(f"  - RUNG 0 `{it['code']}` in {it['field']}{extra} → put a `mechanical` old→new: \"{it['text']}\"")
        (P / f"audit-batch-{b['n']}.md").write_text("\n".join(L) + "\n")
        print(f"{rel}/audit-batch-{b['n']}.md  ({b['standard']}, {len(b['pages'])} pages)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
