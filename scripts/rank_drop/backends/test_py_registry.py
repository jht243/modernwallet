#!/usr/bin/env python3
"""End-to-end test of the py_registry backend on a TEMP CLONE of a metabolic_journal checkout.

    python3 scripts/rank_drop/backends/test_py_registry.py <repo_root> [path ...]

The real checkout is never written: the repo is `git clone --local`d into a temp dir and every
edit/validate/restore runs there. Default pages cover the three shapes:
  /symptoms/foamy-urine        module page (scripts/kwsg1005_foamy_urine.py), no SEO override
                               -> meta title ADDS an _LANDING_SEO_OVERRIDES entry
  /biomarkers/blood-pressure   inline _register page (~line 7574), override with title + description
  /metabolic-health            inline _register page near the top of the file, override entry
Exit 0 = every check passed.
"""

from __future__ import annotations

import ast
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from backends.base import Unsupported  # noqa: E402
from backends.py_registry import BACKEND, _Pos, norm_path  # noqa: E402

TODAY = "2026-10-06"
DEFAULT_PATHS = ["/symptoms/foamy-urine", "/biomarkers/blood-pressure", "/metabolic-health"]
FAILS: list[str] = []


def check(cond, label: str):
    print(("  PASS " if cond else "  FAIL ") + label)
    if not cond:
        FAILS.append(label)
    return cond


def git(root: Path, *args) -> str:
    return subprocess.run(["git", *args], cwd=root, capture_output=True, text=True).stdout


def served(root: Path, path: str) -> dict | None:
    code = ("import json,sys\nimport scripts.generate_seo_pages as g\np=g.PAGES.get(sys.argv[1])\n"
            "print(json.dumps(None if p is None else {'title': p.title, 'reviewed_at': p.reviewed_at, "
            "'meta_description': p.meta_description, 'headings': [s.get('heading') for s in p.sections], "
            "'body': p.introText + ''.join(s.get('content','') for s in p.sections) + "
            "''.join(f.get('answer','') for f in p.faqs)}))")
    r = subprocess.run([sys.executable, "-c", code, path], cwd=root, capture_output=True, text=True,
                       env={"PYTHONDONTWRITEBYTECODE": "1", "PATH": "/usr/bin:/bin"})
    return json.loads(r.stdout.strip().splitlines()[-1]) if r.returncode == 0 else None


def overrides(root: Path, B) -> dict:
    return ast.literal_eval(B._overrides((root / "server.py").read_text()))


def pick_sentence(text: str, want_link_raw: str | None = None) -> str | None:
    """A real reader-visible sentence from the body (after the first '## '), unique in the text."""
    body = text.split("\n## ", 1)[-1]
    best = None
    for para in body.split("\n"):
        if para.startswith(("#", "**Q", "- ")) or "|" in para:
            continue
        for s in re.split(r"(?<=[.!?])\s+", para):
            if len(s.split()) >= 8 and s.endswith(".") and text.count(s) == 1 and not s.startswith("("):
                if want_link_raw is None:
                    return s
                if best is None:
                    best = s
                if any(a in s for a in want_link_raw):
                    return s
    return best


def changed_lines(root: Path, rel: str) -> tuple[list[int], list[int]]:
    """(old-side lines, new-side lines) touched by `git diff -U0` for one file."""
    old, new = [], []
    for m in re.finditer(r"^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@", git(root, "diff", "-U0", "--", rel), re.M):
        o, oc, n, nc = int(m.group(1)), int(m.group(2) or 1), int(m.group(3)), int(m.group(4) or 1)
        old += range(o, o + oc)
        new += range(n, n + nc)
    return old, new


def span_lines(src: str, node) -> range:
    return range(node.lineno, node.end_lineno + 1)


def test_page(B, root: Path, base: str, path: str):
    print(f"\n== {path}")
    page = B.locate(path)
    if not check(page is not None, "locate finds the page"):
        return
    rel = page.extra["file"]
    print(f"     key={page.key} files={page.files} kind={page.kind} override={page.extra['override']}")
    check(B.locate("https://www.themetabolicjournal.com" + path + "/").key == page.key,
          "locate normalises host + trailing slash")
    text = B.text(page)
    check(text.startswith("# ") and "\n## " in text and "<p>" not in text, "text(): '# title', '## headings', no HTML")
    hs = B.headings(page)
    check(len(hs) >= 3 and all(h["id"] is None for h in hs), f"headings(): {len(hs)} sections, id None")
    check(B.has_heading(page, hs[0]["heading"].upper()), "has_heading is case-insensitive")
    before, last = hs[1]["heading"], hs[-1]["heading"]
    d0 = B._values(page)
    raw_body = d0.get("introText", "") + "".join(s.get("content", "") for s in d0["sections"])
    anchors = [re.sub(r"<[^>]+>", "", a) for a in re.findall(r"<a\b[^>]*>(.*?)</a>", raw_body)]
    sentence = pick_sentence(text, anchors or None)
    check(sentence is not None, f"picked a real sentence: {sentence!r}"[:160])
    new_sentence = sentence[:-1] + ", according to current guidance."
    ov_before = overrides(root, B).get(path)

    new_title = "Rank Drop Test Title for " + path
    new_desc = "Rank-drop test meta description for " + path + " & friends."
    ops = [
        {"op": "meta", "title": new_title, "description": new_desc},
        {"op": "insert_section", "heading": "Rank Drop Test Section",
         "paragraphs": ["First paragraph with [a link](/biomarkers) & an ampersand < and a \"quote\".",
                        "Second paragraph, plain."], "before": before},
        {"op": "replace", "old": sentence, "new": new_sentence},
        {"op": "replace_section", "heading": "Rank Drop Replaced Section",
         "paragraphs": ["Replacement body one.", "Replacement body two with [link](/metabolic-health)."],
         "match": last},
    ]

    # ---- dry run: repo untouched, preview written, validation ran on the overlay -----------
    snap = {f: (root / f).read_text() for f in (rel, "server.py")}
    with tempfile.TemporaryDirectory() as td:
        prev = Path(td) / "p.diff"
        res = B.apply(page, ops, TODAY, dry_run=True, preview=prev)
        check(res.ok, f"dry-run apply ok: {res.msg[:200]}")
        check(prev.exists() and "Rank Drop Test Section" in prev.read_text(), "dry-run preview diff written")
    check(all((root / f).read_text() == s for f, s in snap.items()), "dry-run left the files untouched")

    # ---- real apply -------------------------------------------------------------------------
    res = B.apply(page, ops, TODAY)
    check(res.ok, f"apply ok: {res.msg[:300]}")
    print("     notes:", *res.notes, sep="\n       ")
    ok, msg = B.validate(res.files)
    check(ok, f"validate passes: {msg[:200]}")
    live = served(root, path)
    check(live is not None, "edited page still loads in PAGES")
    if live:
        h = live["headings"]
        check("Rank Drop Test Section" in h and h.index("Rank Drop Test Section") == h.index(before) - 1,
              "new section served, right before " + repr(before))
        check("Rank Drop Replaced Section" in h and last not in h, "replace_section swapped " + repr(last))
        check(live["reviewed_at"] == TODAY, "reviewed_at bumped to " + TODAY)
        check('<a href="/biomarkers">a link</a> &amp; an ampersand &lt; and a "quote".' in live["body"],
              "markdown link -> <a>, text HTML-escaped")
        vis = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", live["body"]))
        import html as _h
        vis = _h.unescape(vis)
        check(new_sentence in vis and sentence not in vis, "replace changed the reader-visible sentence")
        check(live["title"] == d0["title"], "H1/page title unchanged (SEO title goes to the override)")
    ov = overrides(root, B).get(path) or {}
    check(ov.get("title") == new_title, "override title = new SEO title")
    if ov_before and "description" in ov_before:
        check(ov.get("description") == new_desc, "description edited in the existing override")
    else:
        check(live and live["meta_description"] == new_desc, "description set on the page's meta_description")
    after_text = B.text(B.locate(path))
    check(new_sentence in after_text and "## Rank Drop Test Section" in after_text, "text() reflects the edit")

    # ---- the diff touches only this page's dict/call and its override entry ----------------
    files = git(root, "diff", "--name-only").split()
    check(set(files) <= {rel, "server.py"}, f"diff limited to {rel} (+server.py): {files}")
    cur, bsrc = (root / rel).read_text(), git(root, "show", f"{base}:{rel}")
    cnode, bnode = B._node_in(rel, cur, path)[1], B._node_in(rel, bsrc, path)[1]
    o, n = changed_lines(root, rel)
    check(set(o) <= set(span_lines(bsrc, bnode)) and set(n) <= set(span_lines(cur, cnode)),
          f"{rel} hunks inside the page's own node (lines {bnode.lineno}-{bnode.end_lineno})")
    if "server.py" in files:
        s_cur, s_base = (root / "server.py").read_text(), git(root, "show", f"{base}:server.py")
        _, ck, cv = B._ov_entry(s_cur, path)
        _, bk, bv = B._ov_entry(s_base, path)
        o, n = changed_lines(root, "server.py")
        okn = set(n) <= set(range(ck.lineno - 1, cv.end_lineno + 2))
        oko = (not o) if bk is None else set(o) <= set(range(bk.lineno, bv.end_lineno + 1))
        check(okn and oko, "server.py hunks inside this path's override entry")

    # ---- failure modes: no partial writes ---------------------------------------------------
    snap = {f: (root / f).read_text() for f in (rel, "server.py")}
    for bad, why in (([{"op": "replace", "old": "this sentence is not on the page at all", "new": "x"}], "absent"),
                     ([{"op": "replace", "old": "the", "new": "x"}], "ambiguous"),
                     ([{"op": "insert_section", "heading": "rank drop test section", "paragraphs": ["x"]}], "dup")):
        try:
            r = B.apply(B.locate(path), bad, TODAY)
            raised = not r.ok
        except (ValueError, Unsupported):
            raised = True
        check(raised, f"bad op rejected ({why})")
    check(all((root / f).read_text() == s for f, s in snap.items()), "rejected ops wrote nothing")

    # ---- restore: byte-identical to base ----------------------------------------------------
    res = B.restore(B.locate(path), base, TODAY)
    check(res.ok, f"restore ok: {res.msg[:200]}")
    check(git(root, "status", "--porcelain").strip() == "", "restore -> clean tree (byte-identical to base)")


def test_silent_drop_guard(B, root: Path, base: str):
    print("\n== validate() catches a module that silently drops out of PAGES")
    rel = B.locate(DEFAULT_PATHS[0]).extra["file"]
    f = root / rel
    orig = f.read_text()
    f.write_text(orig + "\nraise RuntimeError('boom')\n")
    ok, msg = B.validate([rel])
    check(not ok and "dropped" in msg, f"import-time crash flagged: {msg[:120]}")
    f.write_text(orig + "\nPAGE = {\n")
    ok, msg = B.validate([rel])
    check(not ok and "py_compile" in msg, f"syntax error flagged: {msg[:120]}")
    f.write_text(orig)
    check(git(root, "status", "--porcelain").strip() == "", "tree clean again")


def test_unit():
    print("\n== helpers")
    from backends.py_registry import _lit, _project
    s = "<p>a “b”   'c' \"d\" \\ é</p>\n<p>second</p>"
    check(ast.literal_eval("(" + _lit(s, 8, "'") + ")") == s, "literal round-trips unicode/quotes/newlines")
    src = "x = {'k': 'μμμ', 'v': 'tail'}\n"
    node = ast.parse(src).body[0].value.values[1]
    P = _Pos(src)
    check(src[P.start(node):P.end(node)] == "'tail'", "byte columns -> char offsets with non-ASCII")
    vis, _ = _project("<p>A <a href='/x'>link</a> &amp; more</p>", True)
    check(vis.strip() == "A link & more", "visible projection strips tags/entities")
    check(norm_path("https://www.x.com/a/b/?q=1#f") == "/a/b", "norm_path")


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    src_root = Path(sys.argv[1]).resolve()
    paths = sys.argv[2:] or DEFAULT_PATHS
    td = Path(tempfile.mkdtemp(prefix="py-registry-test-"))
    root = td / "repo"
    try:
        r = subprocess.run(["git", "clone", "-q", "--local", str(src_root), str(root)], capture_output=True, text=True)
        if r.returncode:
            print("clone failed:", r.stderr)
            return 2
        base = git(root, "rev-parse", "HEAD").strip()
        print(f"temp clone {root} @ {base[:10]} (real checkout untouched)")
        B = BACKEND(root, {})
        test_unit()
        for p in paths:
            test_page(B, root, base, norm_path(p))
        test_silent_drop_guard(B, root, base)
        print("\n== voice_sample")
        v = B.voice_sample("symptom", {"foamy-urine"})
        check(v is not None and "foamy-urine" not in v and v.count("heading") >= 4, "voice_sample: other symptom page, 4+ sections")
    finally:
        shutil.rmtree(td, ignore_errors=True)
    print(f"\n{'ALL PASSED' if not FAILS else f'{len(FAILS)} FAILED'}")
    for f in FAILS:
        print("  -", f)
    return 1 if FAILS else 0


if __name__ == "__main__":
    sys.exit(main())
