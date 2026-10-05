#!/usr/bin/env python3
"""Rung 2 of the remediation ladder — REWORK, as code.

For every page whose latest audit.json still has `rework` findings (substance Rung 1 cannot fix):

  * rework 1 or 2  → archive the failed draft (section.md → section.round<N>.md, page.json →
    page.round<N>.json), append a `# CORRECTIONS FROM THE PHASE 4 AUDIT (rework N)` block to its
    prompt carrying the auditor's findings verbatim PLUS the current ledger rows for every model
    family the page or draft names (so a stale-price finding is fixed from data/pricing.ts, not
    from the old draft), and list the page under `regenerate` in rework.json.
  * a third rework → the cap is 2: restore that page's entry to the run base (REVERT commit,
    entry-level so other crons' edits to the same file survive) and list it under `reverted` with
    its findings for the email's Flagged section.

Then the routine runs: generate_all.sh (regenerates only missing drafts) → apply_sections.py
--rework (replaces the section in place) → lint_new_text.py → a FULL audit of that page.

The 2026-10-04 re-audit did every one of these steps by hand. Never again.

Usage: scripts/rank_drop/rework.py --packets <P> --date <D> [--max 2]
Writes <P>/rework.json {"regenerate": [slug], "reverted": [{slug, findings}]}.
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from prepare_pages import pricing_rows  # noqa: E402
from runlog import ROOT, base_sha, git  # noqa: E402
from siteconf import backend, site  # noqa: E402


def restore_entry(item: dict, base: str, date: str) -> tuple[bool, str]:
    """Put this ONE page back exactly as it was at the run base and commit it as REVERT — through the
    site's backend, so other pages (and other crons' edits) in the same files survive."""
    B = backend()
    page = B.locate(item["path"])
    if not page:
        return False, "page not found by backend; flagged for the human"
    res = B.restore(page, base, date)
    if not res.ok:
        return False, res.msg
    subprocess.run(["git", "add", *res.files], cwd=ROOT)
    subprocess.run(["git", "commit", "-q", "-m", f"rank-drop-recovery {date}: REVERT {item['path']}\n\n"
                    "Failed audit after the maximum reworks; page restored to its pre-run state."], cwd=ROOT)
    return True, "restored to " + base


def ledger_lines(text: str) -> list[str]:
    out = []
    if not site().get("price_ledger"):
        return out
    for row in pricing_rows(text):
        f = lambda k: (re.search(k + r":\s*'?([^,'}]+)'?", row) or [None, None])[1]
        model, i, o, c, eff = f("model"), f("inputPer1M"), f("outputPer1M"), f("cachedInputPer1M"), f("effectiveDate")
        if model and i and o:
            out.append(f"- {model}: ${i} input / ${o} output per 1M tokens"
                       + (f", cached input ${c}" if c and c != "undefined" else "")
                       + (f" (effective {eff})" if eff else ""))
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    ap.add_argument("--max", type=int, default=2)
    ap.add_argument("--date", required=True)
    a = ap.parse_args(argv)
    P = Path(a.packets).resolve()
    queue = {q["slug"]: q for q in json.load(open(P / "queue.json"))["queue"]}
    regen, reverted = [], []
    # A regenerated draft the splice guard rejected (apply_sections --rework: "REWORK: draft states a
    # stale price…") never reached an auditor, so its error IS the finding for the next attempt —
    # 2026-10-05 dropped it, re-ran with the same corrections and hit the cap on claude-pricing.
    guard = {}
    if (P / "applied.rework.json").exists():
        for r in json.load(open(P / "applied.rework.json")):
            if r.get("status") == "error" and str(r.get("error", "")).startswith("REWORK"):
                guard[r["slug"]] = r["error"]
    for audit_f in sorted(P.glob("*/audit.json")):
        d, slug = audit_f.parent, audit_f.parent.name
        au = json.load(open(audit_f))
        if slug in guard:
            au = {**au, "verdict": "FAIL", "rework": [f"Splice guard rejected the last draft: {guard[slug]}"]
                  + [f"(earlier audit) {x}" for x in au.get("rework", [])]}
        if au.get("verdict") == "PASS" or not au.get("rework") or slug not in queue:
            continue
        plan = json.load(open(d / "plan.json")) if (d / "plan.json").exists() else {}
        out, prompt = (("page.json", "page.prompt.md") if plan.get("action") == "rewrite"
                       else ("section.md", "section.prompt.md"))
        stem, ext = out.split(".")
        done = len(list(d.glob(f"{stem}.round*.{ext}")))
        if done >= a.max:
            ok, msg = restore_entry(queue[slug], base_sha(P), a.date)
            reverted.append({"slug": slug, "findings": au["rework"], "restored": ok, "detail": msg})
            continue
        n = done + 1
        if (d / out).exists():
            (d / out).rename(d / f"{stem}.round{n}.{ext}")
        meta = d / f"{out}.meta.json"
        if meta.exists():
            meta.rename(d / f"{stem}.round{n}.meta.json")
        draft = (d / f"{stem}.round{n}.{ext}")
        text = (d / "page.md").read_text() + "\n" + (draft.read_text() if draft.exists() else "")
        rows = ledger_lines(text)
        block = [f"\n\n# CORRECTIONS FROM THE PHASE 4 AUDIT (rework {n} of {a.max})",
                 "The previous draft failed audit on substance. Fix exactly these; introduce no facts beyond the lists:"]
        block += [f"{i}. {f}" for i, f in enumerate(au["rework"], 1)]
        if rows:
            block += ["", "CURRENT LEDGER ROWS (data/pricing.ts; authoritative: where a price or model above "
                      "disagrees, use these, and present the NEWEST row of each family as current):"] + rows
        with open(d / prompt, "a") as fh:
            fh.write("\n".join(block) + "\n")
        regen.append(slug)
    if (P / "applied.rework.json").exists():
        (P / "applied.rework.json").rename(P / "applied.rework.consumed.json")
    (P / "rework.json").write_text(json.dumps({"regenerate": regen, "reverted": reverted}, indent=1))
    print(f"OK rung2 regenerate={len(regen)} reverted={len(reverted)}"
          + (f" → then: generate_all.sh {P}; apply_sections.py --rework" if regen else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
