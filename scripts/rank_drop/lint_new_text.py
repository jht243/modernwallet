#!/usr/bin/env python3
"""Rung 0, scoped to what THIS run wrote.

`content_lint.mts --slug` lints the whole page, so on 2026-10-04 it reported 204 FAILs for 20 pages
when only 8 came from the run (the rest were em-dashes and headings already on the pages before the
run). It also cannot see gear deep-dives or open-weights entries ("slug not found"). This keeps only
the findings whose text the run's own commits added, runs the same deterministic checks directly on
the added text for pages content_lint cannot see, and writes each page's list to
`<slug>/lint.json` (the auditor turns every item into a `mechanical` old→new pair).

Usage: scripts/rank_drop/lint_new_text.py --packets <P>
Writes <P>/<slug>/lint.json and <P>/lint-summary.json. Exit 0 always (findings are work, not errors).
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
from runlog import added_text, run_commits, unescape  # noqa: E402

STRV = r"""(["'])((?:\\.|(?!\1).)*)\1"""
SMALL = {"a", "an", "the", "and", "or", "for", "of", "to", "in", "on", "at", "by", "vs", "with", "per",
         "as", "but", "nor", "via", "from", "into", "is"}
PROSE_KEYS = r"(?:text|answer|question|content|introText|intro|subtitle|summary|verdict|description|blurb|why|[a-z]*Text)"


def field_value(added: str, field: str) -> str | None:
    m = re.search(r"""["']?""" + field + r"""["']?\s*:\s*""" + STRV, added)
    return unescape(m.group(2)) if m else None


def strings(added: str) -> list[str]:
    """Every string literal on an added line (array items and key: value alike)."""
    return [unescape(m.group(2)) for m in re.finditer(STRV, added)]


def bad_heading(h: str) -> str | None:
    for i, w in enumerate(h.split()):
        if w[:1].isalpha() and w[:1].islower() and (i == 0 or w.lower() not in SMALL):
            return w
    return None


def direct_checks(added: str) -> list[dict]:
    """The content_lint checks, run on the added text itself (pages content_lint cannot see)."""
    out = []
    for s in strings(added):
        if "—" in s or " -- " in s:
            out.append({"code": "em-dash", "field": "text", "text": s})
        if re.search(r"[A-Za-z]!(\s|$)", s) and not s.startswith(("http", "/")):
            out.append({"code": "exclamation", "field": "text", "text": s})
    for m in re.finditer(r"""["']?(heading|h1)["']?\s*:\s*""" + STRV, added):
        h = unescape(m.group(3))
        if bad_heading(h):
            out.append({"code": "heading-case", "field": m.group(1), "text": h})
    return out + meta_checks(added)


def meta_checks(added: str) -> list[dict]:
    out = []
    for field, cap in (("metaTitle", 60), ("metaDescription", 160)):
        v = field_value(added, field)
        if v and len(v) > cap:
            out.append({"code": "meta-title-long" if field == "metaTitle" else "meta-desc-long",
                        "field": field, "text": v, "chars": len(v), "max": cap})
    return out


def introduced(f: dict, added: str) -> bool:
    """Was this content_lint finding caused by text the run added?"""
    t = f.get("text", "")
    if f["code"] in ("meta-title-long", "meta-desc-long"):
        return field_value(added, f["field"].split(".")[-1]) is not None
    if f["code"] == "heading-case":
        m = re.match(r'"([^"]+)"', t)
        return bool(m) and m.group(1) in added
    pieces = [p.strip() for p in t.split("…") if len(p.strip()) >= 12]
    return any(p in unescape(added) for p in pieces)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    a = ap.parse_args(argv)
    P = Path(a.packets).resolve()
    queue = json.load(open(P / "queue.json"))["queue"]
    commits = run_commits(P)
    touched = [q for q in queue if commits.get(q["path"])]
    added = {q["slug"]: added_text([c["sha"] for c in commits[q["path"]]]) for q in touched}
    lint = {"findings": []}
    from siteconf import site
    lint_cmd = site().get("lint_cmd")          # e.g. layer3's content_lint.mts; absent → direct checks only
    if touched and lint_cmd:
        args = list(lint_cmd)
        for q in touched:
            args += ["--slug", q["slug"]]
        r = subprocess.run(args, cwd=ROOT, capture_output=True, text=True)
        try:
            lint = json.loads(r.stdout)
        except json.JSONDecodeError:
            print("WARN content_lint gave no JSON; using direct checks for every page", file=sys.stderr)
    by_slug: dict[str, list] = {}
    for f in lint.get("findings", []):
        by_slug.setdefault(f["slug"], []).append(f)
    summary = []
    for q in touched:
        slug, add = q["slug"], added[q["slug"]]
        fs = [f for f in by_slug.get(slug, []) if f.get("level") == "fail"]
        uncovered = any(f["code"] == "missing-field" and "slug not found" in f.get("text", "") for f in fs)
        if uncovered or not lint_cmd or "pages" not in lint:
            mine = direct_checks(add)
            pre = None
        else:
            mine, pre = [], 0
            for f in fs:
                if introduced(f, add):
                    item = {"code": f["code"], "field": f["field"], "text": f.get("text", "")}
                    if f["code"] in ("meta-title-long", "meta-desc-long"):
                        item["text"] = field_value(add, f["field"].split(".")[-1])
                        item["chars"], item["max"] = len(item["text"]), 60 if "title" in f["code"] else 160
                    elif "\u2026" in item["text"]:                 # lint quotes a snippet: hand over the full string
                        piece = max(item["text"].split("\u2026"), key=len).strip()
                        full = [x for x in strings(add) if piece in x]
                        if full:
                            item["text"] = full[0]
                    mine.append(item)
                else:
                    pre += 1
        (P / slug / "lint.json").write_text(json.dumps(
            {"run_introduced": mine, "pre_existing_fails_ignored": pre, "lint_coverage": "direct" if pre is None else "content_lint"},
            indent=1, ensure_ascii=False))
        summary.append({"slug": slug, "run_introduced": len(mine), "pre_existing": pre})
    (P / "lint-summary.json").write_text(json.dumps(summary, indent=1))
    n = sum(s["run_introduced"] for s in summary)
    print(f"OK rung0 pages={len(summary)} run_introduced={n} "
          f"pre_existing_ignored={sum(s['pre_existing'] or 0 for s in summary)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
