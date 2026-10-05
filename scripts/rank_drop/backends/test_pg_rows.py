"""Offline tests for the pg_rows backend (rankandpay.org / jht243/vet_tools).

Never touches a database: the backend is pointed at an env var nobody sets, the row comes from the
committed keyword-pass INSERT for /explainers/va-benefit-letter/, and the generated scripts are run
against a FAKE `sqlalchemy` module (records SQL, keeps the row in a JSON file). The live class only
SELECTs, and only when DATABASE_URL is set.

Needs a vet_tools checkout for server.py + scripts/seo_field_limits.py + the fixture SQL:
$RANKDROP_PG_SOURCE_ROOT, else this repo's root (when the backend is ported there), else
/tmp/vet_tools_main (git -C <clone> worktree add /tmp/vet_tools_main origin/main).

Run: python3 -m unittest scripts/rank_drop/backends/test_pg_rows.py   (or python3 <this file>)
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import textwrap
import unittest
from datetime import date
from pathlib import Path

ENGINE = Path(__file__).resolve().parents[1]
if str(ENGINE) not in sys.path:
    sys.path.insert(0, str(ENGINE))
from backends.pg_rows import MISSING_DB, PgRows, html_to_text, script_values  # noqa: E402

NO_DB_ENV = "RANKDROP_PG_TEST_NO_SUCH_DSN"
FIXTURE_SQL = "reports/keyword-pass/2026-10-04/sql/va-benefit-letter.sql"
PATH = "/explainers/va-benefit-letter/"
KEY = "explainer:va-benefit-letter"


def source_root() -> Path | None:
    for c in (os.environ.get("RANKDROP_PG_SOURCE_ROOT"), str(ENGINE.parents[1]), "/tmp/vet_tools_main"):
        if c and (Path(c) / "server.py").exists() and (Path(c) / FIXTURE_SQL).exists():
            return Path(c)
    return None


SRC = source_root()


def parse_insert(sql: str) -> dict:
    """First `INSERT INTO landing_pages (cols) VALUES (...)` -> {col: value} ($q$ / '' quoting, ::jsonb)."""
    m = re.search(r"INSERT INTO landing_pages \(([^)]*)\)\s*VALUES \(", sql)
    cols = [c.strip() for c in m.group(1).split(",")]
    i, vals = m.end(), []
    while len(vals) < len(cols):
        while sql[i] in " \n,":
            i += 1
        if sql.startswith("$", i):
            tag = sql[i:sql.index("$", i + 1) + 1]
            j = sql.index(tag, i + len(tag))
            v, i = sql[i + len(tag):j], j + len(tag)
        elif sql[i] == "'":
            j = i + 1
            while True:
                j = sql.index("'", j)
                if sql.startswith("''", j):
                    j += 2
                    continue
                break
            v, i = sql[i + 1:j].replace("''", "'"), j + 1
        else:
            t = re.match(r"[\w.()]+", sql[i:]).group(0)
            v, i = (None if t == "NULL" else int(t) if t.isdigit() else t), i + len(t)
        if sql.startswith("::jsonb", i):
            v, i = json.loads(v), i + len("::jsonb")
        vals.append(v)
    return dict(zip(cols, vals))


FAKE_SQLALCHEMY = textwrap.dedent('''
    """Fake sqlalchemy for tests: one landing_pages row in $FAKE_ROW (JSON), statements logged to $FAKE_LOG."""
    import json, os, re

    class TextClause:
        def __init__(self, s):
            self.text = s

    def text(s):
        return TextClause(s)

    class _Res:
        def __init__(self, rows=None, rowcount=0):
            self._rows, self.rowcount = rows or [], rowcount
        def mappings(self):
            return self
        def one_or_none(self):
            return self._rows[0] if self._rows else None
        def one(self):
            assert len(self._rows) == 1
            return self._rows[0]

    class _Tx:
        def __init__(self, c):
            self.c = c
        def commit(self):
            self.c._commit()
        def rollback(self):
            self.c._rollback()

    class _Conn:
        def __init__(self):
            self.state = json.load(open(os.environ["FAKE_ROW"]))
            self.work, self.log = None, []
        def __enter__(self):
            return self
        def __exit__(self, *a):
            prev = json.load(open(os.environ["FAKE_LOG"])) if os.path.exists(os.environ["FAKE_LOG"]) else []
            json.dump(prev + self.log, open(os.environ["FAKE_LOG"], "w"))
        def begin(self):
            self.work = dict(self.state)
            return _Tx(self)
        def execute(self, clause, params=None):
            sql, params = clause.text, dict(params or {})
            self.log.append({"sql": sql, "params": params})
            row = self.work if self.work is not None else self.state
            low = sql.strip().lower()
            if low.startswith("select"):
                cols = [c.strip() for c in re.search(r"select (.*?) from", sql, re.S | re.I).group(1).split(",")]
                return _Res([{c: row.get(c) for c in cols}] if params.get("k") == row["page_key"] else [])
            if low.startswith("update"):
                if params.get("k") != row["page_key"]:
                    return _Res(rowcount=0)
                for part in re.search(r" set (.*) where ", sql, re.S | re.I).group(1).split(", "):
                    col, expr = [x.strip() for x in part.split("=", 1)]
                    p = re.search(r":(\\w+)", expr)
                    if expr == "now()":
                        row[col] = "NOW"
                    elif "jsonb" in expr:
                        row[col] = None if params[p.group(1)] is None else json.loads(params[p.group(1)])
                    else:
                        row[col] = params[p.group(1)]
                return _Res(rowcount=1)
            raise AssertionError("unexpected SQL: " + sql)
        def _commit(self):
            self.log.append({"sql": "COMMIT"})
            self.state, self.work = self.work, None
            json.dump(self.state, open(os.environ["FAKE_ROW"], "w"))
        def _rollback(self):
            self.log.append({"sql": "ROLLBACK"})
            self.work = None

    class _Engine:
        def connect(self):
            return _Conn()

    def create_engine(url, **kw):
        assert url.startswith("fake://"), "test fake refuses real DSNs"
        return _Engine()
''')


@unittest.skipUnless(SRC, "no vet_tools checkout with server.py + fixture SQL (see module docstring)")
class OfflineTest(unittest.TestCase):
    TODAY = "2026-10-05"

    @classmethod
    def setUpClass(cls):
        os.environ.pop(NO_DB_ENV, None)
        cls.fixture = parse_insert((SRC / FIXTURE_SQL).read_text())
        cls.row = {**{k: cls.fixture.get(k) for k in ("page_key", "page_type", "canonical_path", "title", "subtitle",
                                                       "summary", "body_html", "faq_json", "sections_json")},
                   "updated_at": "2026-10-04T15:00:00", "last_generated_at": "2026-10-04T15:00:00"}

    def setUp(self):
        self.root = Path(tempfile.mkdtemp(prefix="pg_rows_test_"))
        (self.root / "scripts").mkdir()
        shutil.copy(SRC / "server.py", self.root / "server.py")
        shutil.copy(SRC / "scripts/seo_field_limits.py", self.root / "scripts/seo_field_limits.py")
        self.cfg = {"base_url": "https://www.rankandpay.org", "trailing_slash": True, "backend": "pg_rows",
                    "pg": {"database_url_env": NO_DB_ENV}}
        self.B = PgRows(self.root, self.cfg)
        self.B.save_snapshot(self.row, source="fixture")

    def tearDown(self):
        shutil.rmtree(self.root, ignore_errors=True)

    def page(self):
        p = self.B.locate("https://www.rankandpay.org/explainers/va-benefit-letter?utm=x")
        self.assertIsNotNone(p)
        return p

    # ---- locate ---------------------------------------------------------------------------
    def test_resolve_real_urls(self):
        cases = {
            "/explainers/va-benefit-letter/": "explainer:va-benefit-letter",
            "https://www.rankandpay.org/military-ranks/army-ranks": "spoke:military-ranks:army-ranks",
            "/state-benefits/best-states-for-veterans/": "page:best-states-for-veterans-benefits",  # static beats <state>
            "/state-benefits/texas/": "state:texas",
            "/va-compensation-rates/2026/": "page:va-compensation-rates-2026",
        }
        for path, key in cases.items():
            hit = self.B.resolve(path)
            self.assertIsNotNone(hit, path)
            self.assertEqual(hit[1], key, path)
            self.assertTrue(hit[0].endswith("/"))
        for path in ("/state-benefits/narnia/", "/explainers/not-a-real-explainer/", "/va-compensation-rates/2019/",
                     "/tools/", "/briefing/some-post/", "/"):
            self.assertIsNone(self.B.resolve(path), path)
        self.assertIsNone(self.B.resolve("/explainers/sgli-explained/"))  # EXPLAINER_REDIRECTS 301s it

    def test_locate_from_snapshot(self):
        p = self.page()
        self.assertEqual((p.path, p.key, p.slug, p.kind), (PATH, KEY, "va-benefit-letter", "explainer"))
        self.assertEqual(p.extra["source"], "snapshot")
        self.assertEqual(p.extra["description"], self.row["summary"])
        self.assertEqual(p.title, self.row["title"])
        self.assertEqual(json.loads(p.native)["body_html"], self.row["body_html"])
        self.assertEqual(p.files, [f"scripts/rank_drop_{date.today():%Y%m%d}_explainers_va_benefit_letter.py"])
        self.assertIsNone(self.B.locate("/military-ranks/army-ranks/"))  # resolvable, but no row offline

    # ---- reading --------------------------------------------------------------------------
    def test_text_and_headings(self):
        p = self.page()
        want = re.findall(r"<h2>([^<]*)</h2>", self.row["body_html"])
        self.assertEqual([h["heading"] for h in self.B.headings(p)], want)
        self.assertTrue(all(h["id"] is None for h in self.B.headings(p)))
        t = self.B.text(p)
        self.assertTrue(t.startswith("# " + self.row["subtitle"] + "\n\n" + self.row["summary"]))
        self.assertIn("\n## VA Letter Types\n", t)
        self.assertIn("**Q: Is a VA award letter the same as a benefit letter?**", t)
        self.assertIn("The letter is still valid with an incorrect address.", t)
        self.assertIn("using the Download VA benefit letters tool.", t)  # link text kept, markup gone
        self.assertNotRegex(t, r"<[a-z/]")
        self.assertTrue(self.B.has_heading(p, "va letter types"))

    def test_html_to_text_shapes(self):
        self.assertEqual(html_to_text("<h2>A &amp; B</h2><p>x <a href='/y/'>y</a>.</p><ul><li>1</li><li>2</li></ul>"
                                      "<table><tr><th>k</th><th>v</th></tr><tr><td>a</td><td>b</td></tr></table>"),
                         "## A & B\n\nx y.\n\n- 1\n- 2\n\nk | v\na | b")

    # ---- apply (dry run) ------------------------------------------------------------------
    NEW_TITLE = "VA Benefit Letter: How to Download It on VA.gov | Rank and Pay"
    NEW_DESC = ("Download your VA benefit letter on VA.gov in minutes: which letter type to pick, how to fix a wrong "
                "address, and what to use for a VA home loan COE.")
    OLD = "The letter is still valid with an incorrect address."
    NEW = "The VA says the letter is still valid even when the address on it is wrong."

    def ops(self):
        return [
            {"op": "meta", "title": self.NEW_TITLE, "description": self.NEW_DESC},
            {"op": "insert_section", "heading": "Which Letter Lenders & Landlords Ask For",
             "paragraphs": ["Most lenders ask for the Benefit Summary letter; check the "
                            "[VA claim status guide](/explainers/va-claim-status-guide) first.",
                            "Use the [VA letters tool](https://www.va.gov/records/download-va-letters/) to get it."],
             "before": "VA Letter Types", "section_id": "lenders"},
            {"op": "replace", "old": self.OLD, "new": self.NEW},
            {"op": "replace_section", "match": "Home Loan Certificate of Eligibility",
             "heading": "VA Home Loan Certificate of Eligibility (COE)",
             "paragraphs": ["The COE is not in the letters tool.", "- Sign in on VA.gov\n- Open the COE tool"]},
        ]

    def expected_after(self) -> dict:
        b = self.row["body_html"]
        sec = ('<h2>Which Letter Lenders &amp; Landlords Ask For</h2>\n'
               '<p>Most lenders ask for the Benefit Summary letter; check the '
               '<a href="/explainers/va-claim-status-guide/">VA claim status guide</a> first.</p>\n'
               '<p>Use the <a href="https://www.va.gov/records/download-va-letters/" target="_blank" '
               'rel="noopener noreferrer">VA letters tool</a> to get it.</p>\n')
        b = b.replace("<h2>VA Letter Types</h2>", sec + "<h2>VA Letter Types</h2>", 1)
        b = b.replace(self.OLD, self.NEW, 1)
        a = b.index("<h2>Home Loan Certificate of Eligibility</h2>")
        e = b.index("<h2>", a + 4)
        b = (b[:a] + "<h2>VA Home Loan Certificate of Eligibility (COE)</h2>\n<p>The COE is not in the letters tool.</p>\n"
             "<ul><li>Sign in on VA.gov</li><li>Open the COE tool</li></ul>\n" + b[e:])
        return {"title": self.NEW_TITLE, "summary": self.NEW_DESC, "body_html": b}

    def test_apply_dry_run_writes_exact_script(self):
        p = self.page()
        prev = self.root / "preview.diff"
        res = self.B.apply(p, self.ops(), self.TODAY, dry_run=True, preview=prev)
        self.assertTrue(res.ok, res.msg)
        rel = "scripts/rank_drop_20261005_explainers_va_benefit_letter.py"
        self.assertEqual(res.files, [rel, rel[:-3] + ".sql"])
        src = (self.root / rel).read_text()
        compile(src, rel, "exec")
        v = script_values(src)
        self.assertEqual(v["PAGE_KEY"], KEY)
        self.assertEqual(v["AFTER"], self.expected_after())
        self.assertEqual(v["EXPECT"], {k: self.row[k] for k in ("title", "summary", "body_html")})
        self.assertIsNone(v["SET_DATES"])
        self.assertFalse([n for n in res.notes if n.startswith("warn")], res.notes)  # meta inside 50-65 / 140-155
        self.assertIn("+<h2>Which Letter Lenders &amp; Landlords Ask For</h2>", prev.read_text())
        self.assertFalse(list((self.root / "reports/rank-drop/pg-snapshots").glob("*.before.json")))  # dry: no snapshots
        sql = (self.root / (rel[:-3] + ".sql")).read_text()
        self.assertIn("md5(body_html) = '", sql)
        self.assertIn("updated_at = now()", sql)
        # same base -> the real run would reuse (overwrite) the same file, not add _2
        res2 = self.B.apply(p, self.ops(), self.TODAY, dry_run=True, preview=prev)
        self.assertEqual(res2.files[0], rel)
        ok, msg = self.B.validate(res.files)
        self.assertTrue(ok, msg)

    def test_generated_script_against_fake_driver(self):
        p = self.page()
        res = self.B.apply(p, self.ops(), self.TODAY, dry_run=True)
        script = self.root / res.files[0]
        fake = self.root / "_fake"
        (fake / "sqlalchemy").mkdir(parents=True)
        (fake / "sqlalchemy/__init__.py").write_text(FAKE_SQLALCHEMY)
        rowf, logf = self.root / "_row.json", self.root / "_log.json"
        rowf.write_text(json.dumps(self.row))
        env = {**{k: v for k, v in os.environ.items() if k != "DATABASE_URL"}, "PYTHONPATH": str(fake),
               "DATABASE_URL": "fake://test", "FAKE_ROW": str(rowf), "FAKE_LOG": str(logf)}
        run = lambda *a: subprocess.run([sys.executable, str(script), *a], env=env, capture_output=True, text=True)  # noqa: E731

        r = run("--dry")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("DRY", r.stdout)
        self.assertEqual(json.loads(rowf.read_text()), self.row)  # rolled back
        upd = [e for e in json.loads(logf.read_text()) if e["sql"].lower().startswith("update")]
        self.assertEqual(len(upd), 1)
        want = self.expected_after()
        self.assertEqual({k: upd[0]["params"][k] for k in want}, want)          # exact UPDATE values
        self.assertEqual(set(upd[0]["params"]), set(want) | {"k"})               # only changed columns
        self.assertIn("updated_at = now()", upd[0]["sql"])
        self.assertIn("last_generated_at = now()", upd[0]["sql"])

        r = run()
        self.assertEqual(r.returncode, 0, r.stderr)
        state = json.loads(rowf.read_text())
        self.assertEqual({k: state[k] for k in want}, want)
        self.assertEqual(state["updated_at"], "NOW")
        self.assertEqual(state["faq_json"], self.row["faq_json"])

        r = run()  # idempotent
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("already applied", r.stdout)

        state["title"] = "Someone else edited this"
        rowf.write_text(json.dumps(state))
        r = run()
        self.assertEqual(r.returncode, 2)
        self.assertIn("changed since the snapshot", r.stderr)

    def test_replace_rules(self):
        p = self.page()
        with self.assertRaisesRegex(ValueError, "found 2x"):  # body sentence + FAQ answer
            self.B.apply(p, [{"op": "replace", "old": "letter is still valid with an incorrect address", "new": "x"}],
                         self.TODAY, dry_run=True)
        with self.assertRaisesRegex(ValueError, "found 0x"):
            self.B.apply(p, [{"op": "replace", "old": "no such sentence anywhere", "new": "x"}], self.TODAY, dry_run=True)
        with self.assertRaisesRegex(ValueError, "already exists"):
            self.B.apply(p, [{"op": "insert_section", "heading": "VA Letter Types", "paragraphs": ["x"]}],
                         self.TODAY, dry_run=True)
        self.assertFalse(list((self.root / "scripts").glob("rank_drop_*")))  # all-or-nothing: nothing written
        old = "You cannot download a Certificate of Eligibility (COE) for a VA home loan in the standard letters tool."
        res = self.B.apply(p, [{"op": "replace", "old": old, "new": "The letters tool does not issue the COE."}],
                           self.TODAY, dry_run=True)
        after = script_values((self.root / res.files[0]).read_text())["AFTER"]
        self.assertEqual(set(after), {"faq_json"})
        faq = [dict(q) for q in self.row["faq_json"]]
        i = next(n for n, q in enumerate(faq) if old in q["answer"])
        faq[i]["answer"] = faq[i]["answer"].replace(old, "The letters tool does not issue the COE.")
        self.assertEqual(after["faq_json"], faq)
        # a sentence sitting next to a link in a text node
        res = self.B.apply(p, [{"op": "replace", "old": "track its status using the", "new": "follow it with the"}],
                           self.TODAY, dry_run=True)
        body = script_values((self.root / res.files[0]).read_text())["AFTER"]["body_html"]
        self.assertIn('follow it with the <a href="/explainers/va-claim-status-guide/">', body)

    def test_apply_real_without_dsn_then_restore(self):
        p = self.page()
        res = self.B.apply(p, self.ops(), self.TODAY, dry_run=False)
        self.assertFalse(res.ok)
        self.assertEqual(res.msg, MISSING_DB)
        snaps = sorted(f.name for f in (self.root / "reports/rank-drop/pg-snapshots").iterdir())
        self.assertIn("explainer__va-benefit-letter.20261005.1.before.json", snaps)
        self.assertIn("explainer__va-benefit-letter.20261005.1.after.json", snaps)
        rr = self.B.restore(p, "", "2026-10-06")
        self.assertFalse(rr.ok)
        self.assertEqual(rr.msg, MISSING_DB)
        rel = "scripts/rank_drop_20261006_explainers_va_benefit_letter_restore.py"
        self.assertEqual(rr.files, [rel, rel[:-3] + ".sql"])
        src = (self.root / rel).read_text()
        compile(src, rel, "exec")
        v = script_values(src)
        self.assertEqual(v["AFTER"], {k: self.row[k] for k in ("title", "summary", "body_html")})
        self.assertEqual(v["EXPECT"], self.expected_after())
        self.assertEqual(v["SET_DATES"], {"updated_at": self.row["updated_at"],
                                          "last_generated_at": self.row["last_generated_at"]})
        self.assertIn("updated_at = '2026-10-04T15:00:00'::timestamp", (self.root / (rel[:-3] + ".sql")).read_text())

    def test_validate_flags_clipped_title(self):
        p = self.page()
        long_title = "How to Download Your VA Benefit Letter Online, Step by Step, in 2026 | Rank and Pay"
        res = self.B.apply(p, [{"op": "meta", "title": long_title}], self.TODAY, dry_run=True)
        self.assertTrue(any(n.startswith("warn: title") for n in res.notes), res.notes)
        ok, msg = self.B.validate(res.files)
        self.assertFalse(ok)
        self.assertIn("renderer clips", msg)
        self.assertEqual(self.B.voice_sample("explainer", set()), None)  # offline -> None


@unittest.skipUnless(SRC and os.environ.get("DATABASE_URL"), "DATABASE_URL not set — live read-only checks skipped")
class LiveReadOnlyTest(unittest.TestCase):
    """SELECT-only: locate/text/headings/voice_sample against the real row. No apply, no restore."""

    def test_live_locate(self):
        B = PgRows(SRC, {"base_url": "https://www.rankandpay.org", "trailing_slash": True, "pg": {}})
        p = B.locate(PATH)
        self.assertIsNotNone(p)
        self.assertEqual(p.extra["source"], "db")
        self.assertTrue(B.text(p).startswith("# "))
        self.assertTrue(B.headings(p))
        vs = B.voice_sample("explainer", {"va-benefit-letter"})
        self.assertTrue(vs is None or vs.count("<h2") >= 4)


if __name__ == "__main__":
    unittest.main(verbosity=2)
