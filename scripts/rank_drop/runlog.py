#!/usr/bin/env python3
"""What did THIS run change, page by page — read from git, never assembled by hand.

Every phase after the splice needs the same three facts per page: the run's commits for that page
(sha + kind, from the `rank-drop-recovery <date>: <KIND> <path>` subjects), the run's base commit,
and the text those commits added to data/. The 2026-10-04 re-audit built these by hand in the
terminal; the routine now calls these helpers.
"""

import json
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
SUBJECT = re.compile(r"^rank-drop-recovery \S+: ([A-Z][A-Z ]*?) (/\S+)$")


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True).stdout


def base_sha(P: Path) -> str:
    """The commit the run started from: queue.json's base_sha (prepare_pages writes it), else the
    deploy helper's run-base mark, else the merge-base with origin/main."""
    q = json.load(open(P / "queue.json"))
    if q.get("base_sha"):
        return q["base_sha"]
    gd = git("rev-parse", "--git-dir").strip()
    for f in sorted((ROOT / gd).glob("run-base-*")) if gd else []:
        s = f.read_text().strip()
        if s:
            return s
    return git("merge-base", "HEAD", "origin/main").strip()


def run_commits(P: Path) -> dict[str, list[dict]]:
    """{path: [{"sha", "kind"}...]} oldest first, for every rank-drop commit since the run base."""
    out: dict[str, list[dict]] = {}
    for line in reversed(git("log", "--format=%h %s", f"{base_sha(P)}..HEAD").splitlines()):
        sha, _, subj = line.partition(" ")
        m = SUBJECT.match(subj.strip())
        if m:
            out.setdefault(m.group(2), []).append({"sha": sha, "kind": m.group(1)})
    return out


def added_text(shas: list[str]) -> str:
    """The '+' lines those commits added to content files (as they read in the file)."""
    lines = []
    for sha in shas:
        # every content file the commit touched (data/, templates/, scripts/…) — never packet/report artifacts
        for l in git("show", "--format=", "-U0", sha, "--", ".", ":(exclude)reports").splitlines():
            if l.startswith("+") and not l.startswith("+++"):
                lines.append(l[1:])
    return "\n".join(lines)


def unescape(s: str) -> str:
    return s.replace("\\'", "'").replace('\\"', '"')


def section_heading_now(item: dict, plan: dict, d: Path) -> str | None:
    """The heading of the section this run added, as it reads NOW (audit fixes may have retitled it).
    Matched by section id (TS sites) or by the heading recorded at apply time; None if not found."""
    from siteconf import backend
    if plan.get("action") != "add_section":
        return None
    B = backend()
    page = B.locate(item["path"])
    if not page:
        return None
    hs = B.headings(page)
    sid = plan.get("section_id")
    prev = (json.load(open(d / "applied_section.json")).get("heading") if (d / "applied_section.json").exists() else None)
    for h in hs:
        if sid and h.get("id") == sid:
            return h["heading"]
    for h in hs:
        if prev and h["heading"].strip().lower() == prev.strip().lower():
            return h["heading"]
    return None
