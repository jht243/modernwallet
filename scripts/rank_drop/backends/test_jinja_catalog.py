#!/usr/bin/env python3
"""End-to-end test of the jinja_catalog backend on a THROWAWAY CLONE of psych_report.

    python3 test_jinja_catalog.py "/path/to/psych_report"

Never touches the given checkout: it is `git clone --local`d into a temp dir, every edit happens
there, and the temp dir is deleted at the end. For /guides/ayahuasca (has an overrides block with
implicitly-concatenated FAQ strings), /guides/spravato-cost-with-insurance (NO overrides block +
an "On this page" TOC) and one /law/ page it runs: locate, text, headings, a dry run (must change
nothing), apply [meta, insert_section before an existing h2, replace on a real sentence,
(ayahuasca: replace inside an override FAQ answer), replace_section], validate, a diff-scope check
(only that page's template / overrides block / catalog entry changed, both dates bumped), then
restore -> byte-identical to the base commit. Plus the Unsupported / not-found cases.
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
import tempfile
from datetime import date, timedelta
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backends.base import Unsupported  # noqa: E402
from backends.jinja_catalog import JinjaCatalog, _Offsets  # noqa: E402

TODAY = (date.today() + timedelta(days=1)).isoformat()   # differs from every existing date
FAILS: list[str] = []


def check(cond, msg):
    print(("  ok   " if cond else "  FAIL ") + msg)
    if not cond:
        FAILS.append(msg)
    return cond


def git(root, *args):
    return subprocess.run(["git", *args], cwd=root, capture_output=True, text=True).stdout


def hunks(root, rel):
    """[(new_start, new_len)] of `git diff -U0` for rel (line ranges in the CURRENT file)."""
    out = []
    for m in re.finditer(r"^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@", git(root, "diff", "-U0", "--", rel), re.M):
        out.append((int(m.group(1)), int(m.group(2) or 1)))
    return out


def within(hs, lo, hi):
    return all(lo <= s and s + max(n, 1) - 1 <= hi for s, n in hs)


def pick_sentence(B, page):
    """A real body sentence that the backend can edit (unique, no markup inside the change)."""
    for line in B.text(page).splitlines():
        if line.startswith(("#", "-", "|", "**")) or len(line) < 80:
            continue
        for sent in re.split(r"(?<=[.!?])\s+", line):
            words = sent.split()
            if len(sent) < 50 or len(words) < 8 or not sent.endswith("."):
                continue
            new = sent[:-1] + " today."
            try:
                B.apply(page, [{"op": "replace", "old": sent, "new": new}], TODAY, dry_run=True)
                return sent, new
            except (ValueError, Unsupported):
                continue
    return None, None


def run_page(B, root, base, path, faq_old=None, faq_new=None, body_old=None, body_new=None):
    print(f"\n== {path}")
    page = B.locate(path)
    if not check(page is not None, "locate"):
        return
    print(f"     files={page.files} title={page.title!r}")
    tpl_rel = page.extra["template"]
    check(page.files[0] == tpl_rel and page.extra["catalog"] in page.files, "files = [template, …, catalog]")
    txt = B.text(page)
    check(txt.startswith("# ") and txt.count("\n## ") >= 4, f"text(): H1 + {txt.count(chr(10) + '## ')} h2 sections")
    hs = B.headings(page)
    check(len(hs) >= 4, f"headings(): {len(hs)}")
    body_hs = [h for h in hs if not re.match(r"(faq|frequently)", (h["id"] or h["heading"]).lower())]
    before = body_hs[2]
    victim = body_hs[4]

    if body_old is None:
        body_old, body_new = pick_sentence(B, page)
    check(body_old is not None, f"found an editable sentence: {str(body_old)[:70]!r}")

    new_title = f"{page.title.split(':')[0][:40]}: Test Title & Check (2026)"
    new_desc = "A test meta description for the rank-drop backend, with an apostrophe's edge and a quote \"here\"."
    ops = [
        {"op": "meta", "title": new_title, "description": new_desc},
        {"op": "insert_section", "heading": "Rank-drop test section", "before": before["id"] or before["heading"],
         "paragraphs": ["First paragraph with a [link to psilocybin](/guides/psilocybin) & an ampersand.",
                        "Second paragraph with **bold** text and {{ not jinja }}."]},
        {"op": "replace", "old": body_old, "new": body_new},
        {"op": "replace_section", "match": victim["id"] or victim["heading"], "heading": victim["heading"] + " (rewritten)",
         "paragraphs": ["Replaced body paragraph one.", "Replaced body paragraph two."]},
    ]
    if faq_old:
        ops.insert(3, {"op": "replace", "old": faq_old, "new": faq_new})

    # ---- dry run: preview only, repo untouched
    with tempfile.TemporaryDirectory() as td:
        prev = Path(td) / "p.diff"
        r = B.apply(page, ops, TODAY, dry_run=True, preview=prev)
        check(r.ok, f"dry run ok ({r.msg[:120]})")
        check(prev.exists() and "+" in prev.read_text() and "Rank-drop test section" in prev.read_text(), "preview diff written")
        check(git(root, "status", "--porcelain").strip() == "", "dry run changed nothing")

    # ---- real apply
    r = B.apply(page, ops, TODAY)
    check(r.ok, f"apply ok: {r.msg[:200]}")
    for n in r.notes:
        print("       note:", n[:140])
    changed = set(git(root, "diff", "--name-only").split())
    check(changed <= set(page.files) | {"server.py"}, f"only page files changed: {sorted(changed)}")
    ok, msg = B.validate(sorted(changed))
    check(ok, f"validate(): {msg[:200]}")

    # diff scope: overrides block / catalog entry / template
    page2 = B.locate(path)
    kind = B.kinds[page2.extra["prefix"]]
    cat = kind["catalog"]
    cat_src = (root / cat).read_text()
    call = B._catalog_call(kind, page2.slug, cat_src)
    check(within(hunks(root, cat), call.lineno, call.end_lineno), f"{cat} diff confined to the {kind['cls']} entry")
    check(B._kwval(call, "last_reviewed") == TODAY, "catalog last_reviewed bumped")
    if kind["header"]:
        tpl = (root / tpl_rel).read_text()
        check(re.search(kind["header"] + r"\(\s*\w+\s*,\s*\"" + TODAY + '"', tpl) is not None, "template header date bumped")
    if "server.py" in changed:
        srv = (root / "server.py").read_text()
        blk = B._block(srv, page2.slug)
        check(blk is not None and within(hunks(root, "server.py"), blk.lineno, blk.end_lineno + 1),
              "server.py diff confined to this slug's overrides block")
    check(page2.title == new_title, "meta title stored")
    check(page2.extra["description"] == new_desc, "meta description stored")
    hs2 = [h["heading"] for h in B.headings(page2)]
    i_new, i_before = hs2.index("Rank-drop test section"), hs2.index(before["heading"])
    check(i_new == i_before - 1, "inserted section sits right before the anchor h2")
    check(victim["heading"] + " (rewritten)" in hs2 and victim["heading"] not in hs2, "replace_section swapped heading")
    txt2 = B.text(page2)
    check(" ".join(body_new.split()) in " ".join(txt2.split()), "replace landed in body text")
    if faq_old:
        check(faq_new in txt2 and faq_old not in txt2, "replace landed in overrides FAQ (implicit concatenation)")
    check("{{ not jinja }}" not in (root / tpl_rel).read_text() and "&#123;{ not jinja }}" in (root / tpl_rel).read_text(),
          "user text cannot inject Jinja")
    check('<a href="/guides/psilocybin">link to psilocybin</a> &amp; an ampersand' in (root / tpl_rel).read_text(),
          "markdown link + escaping")

    # ---- a second apply of the same insert must refuse (heading exists)
    try:
        B.apply(page2, [ops[1]], TODAY, dry_run=True)
        check(False, "duplicate insert refused")
    except ValueError:
        check(True, "duplicate insert refused")

    # ---- restore -> byte-identical to base
    r = B.restore(page2, base, TODAY)
    check(r.ok, f"restore ok: {r.msg[:120]}")
    check(git(root, "status", "--porcelain").strip() == "", "restore is byte-identical (git status clean)")
    for rel in page.files + ["server.py"]:
        same = (root / rel).read_bytes() == subprocess.run(["git", "show", f"{base}:{rel}"], cwd=root,
                                                           capture_output=True).stdout
        check(same, f"  {rel} == base")


def run_unsupported(B, root):
    print("\n== unsupported / not-found cases")
    check(B.locate("/guides/definitely-not-a-catalog-slug") is None, "non-catalog (DB-fallback) guide -> locate None")
    check(B.locate("/es/guias/ayahuasca") is None, "/es/ pages -> locate None")
    pg = B.locate("/commentary/joe-weller-ayahuasca-retreat")
    check(pg is not None, "commentary locate")
    try:
        B.apply(pg, [{"op": "insert_section", "heading": "X", "paragraphs": ["y."]}], TODAY, dry_run=True)
        check(False, "commentary insert_section -> Unsupported")
    except Unsupported:
        check(True, "commentary insert_section -> Unsupported")
    try:
        B.apply(B.locate("/guides/ayahuasca"), [{"op": "rewrite", "fields": {}}], TODAY, dry_run=True)
        check(False, "rewrite -> Unsupported")
    except Unsupported:
        check(True, "rewrite -> Unsupported")
    try:
        B.apply(B.locate("/guides/ayahuasca"), [{"op": "replace_section", "match": "faq", "heading": "x",
                                                 "paragraphs": ["y."]}], TODAY, dry_run=True)
        check(False, "replace_section on the data-driven FAQ -> Unsupported")
    except Unsupported:
        check(True, "replace_section on the data-driven FAQ -> Unsupported")
    try:
        B.apply(B.locate("/guides/ayahuasca"), [{"op": "replace", "old": "ayahuasca", "new": "x"}], TODAY, dry_run=True)
        check(False, "ambiguous replace -> ValueError")
    except ValueError:
        check(True, "ambiguous replace -> ValueError")
    check(git(root, "status", "--porcelain").strip() == "", "no files touched by refused ops")
    v = B.voice_sample("guides", {"ayahuasca"})
    check(v is not None and v.count("<h2") >= 4, "voice_sample(guides)")


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 2
    src = Path(argv[1]).resolve()
    tmp = Path(tempfile.mkdtemp(prefix="jinja_catalog_test_"))
    root = tmp / "repo"
    try:
        subprocess.run(["git", "clone", "-q", "--local", str(src), str(root)], check=True)
        base = git(root, "rev-parse", "HEAD").strip()
        print(f"clone {root} @ {base[:10]}  today={TODAY}")
        B = JinjaCatalog(root, {"jinja": {}})
        run_page(B, root, base, "/guides/ayahuasca",
                 faq_old="four US religious organizations currently hold confirmed federal DEA exemptions",
                 faq_new="five US religious organizations currently hold confirmed federal DEA exemptions",
                 body_old="The MAOIs in the vine prevent the stomach from breaking down the DMT, allowing it to "
                          "reach the brain via oral dosing.",
                 body_new="The MAOIs in the vine stop the gut from breaking down the DMT, allowing it to "
                          "reach the brain when swallowed.")
        run_page(B, root, base, "/guides/spravato-cost-with-insurance")
        run_page(B, root, base, "/law/arizona-hb-2871")
        run_unsupported(B, root)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(f"\n{'PASS' if not FAILS else 'FAIL'}: {len(FAILS)} failure(s)")
    for f in FAILS:
        print("  -", f)
    return 1 if FAILS else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
