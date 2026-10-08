#!/usr/bin/env python3
"""Database I/O for Postgres-backed sites (pg_rows backend) when the cloud runner has no DSN.

The cloud runner's egress is HTTPS-only, so it cannot open the Supabase pooler; the attached Supabase
MCP connector (execute_sql) is the only path to the live rows. These subcommands turn that into a
scripted, two-call exchange — the orchestrator never writes SQL itself:

  pg_mcp.py select --detect reports/rank-drop/<D>.json > /tmp/select.sql
      ONE SELECT for every page in the detection report (+ its page_key). Run it with execute_sql,
      save the JSON rows to /tmp/rows.json, then:
  pg_mcp.py save --rows /tmp/rows.json
      stores one snapshot per row (backend.locate() reads these) — run BEFORE prepare_pages.py.

  pg_mcp.py pending
      prints the queued edit/revert .sql files (apply_sections / apply_fixes / rework queue them).
      Run each file's contents with execute_sql, in order, then:
  pg_mcp.py done --sql <file> [--result <json from execute_sql>]
      marks it applied (pending.jsonl -> applied.jsonl) so finish_run / the next call skip it.
  pg_mcp.py publish
      PG PUBLISH (after the audit): ONE net guarded statement per page (live row → final audited row),
      written to <snapshot_dir>/publish/<page>.sql; prints "<page_key> <file>" per page. Run each file
      with execute_sql, then `pg_mcp.py done --page <page_key> --result '<json>'` (marks all its steps).
  pg_mcp.py confirm > /tmp/confirm.sql
      one SELECT re-reading every row touched this run; run it, then `pg_mcp.py save --rows …` again.
"""

import argparse
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from siteconf import ROOT, backend  # noqa: E402

ROW_SELECT = "select {cols} from {table} where page_key in ({keys});"


def _q(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s1 = sub.add_parser("select")
    s1.add_argument("--detect", required=True)
    s2 = sub.add_parser("save")
    s2.add_argument("--rows", required=True)
    sub.add_parser("pending")
    sub.add_parser("publish")
    s4 = sub.add_parser("done")
    s4.add_argument("--sql", default="")
    s4.add_argument("--page", default="")
    s4.add_argument("--result", default="")
    sub.add_parser("confirm")
    a = ap.parse_args(argv)
    B = backend()
    from backends import pg_rows
    cols = ", ".join(pg_rows.ROW_COLS)
    snap = ROOT / B.snap_dir
    pend, done = snap / "pending.jsonl", snap / "applied.jsonl"

    if a.cmd == "select":
        rep = json.load(open(a.detect))
        keys = []
        for p in rep.get("pages", []):
            hit = B.resolve(p["path"])
            if hit:
                keys.append(hit[1])
        if not keys:
            print("-- no landing_pages rows for this run's pages")
            return 0
        print(ROW_SELECT.format(cols=cols, table=B.table, keys=", ".join(_q(k) for k in sorted(set(keys)))))
        return 0
    if a.cmd == "save":
        rows = json.load(open(a.rows))
        if isinstance(rows, dict):
            rows = rows.get("rows") or rows.get("result") or [rows]
        for r in rows:
            print(B.save_snapshot(r, source="mcp").relative_to(ROOT))
        return 0
    if a.cmd == "pending":
        applied = {json.loads(l)["sql"] for l in done.read_text().splitlines()} if done.exists() else set()
        for l in pend.read_text().splitlines() if pend.exists() else []:
            x = json.loads(l)
            if x["sql"] not in applied:
                print(x["sql"])
        return 0
    if a.cmd == "publish":
        applied = {json.loads(l)["sql"] for l in done.read_text().splitlines()} if done.exists() else set()
        groups: dict[str, list[dict]] = {}
        for l in pend.read_text().splitlines() if pend.exists() else []:
            x = json.loads(l)
            if x["sql"] not in applied:
                groups.setdefault(x["page_key"], []).append(x)
        out_dir = snap / "publish"
        out_dir.mkdir(parents=True, exist_ok=True)
        for key, recs in groups.items():
            if not all(r.get("before") and r.get("after") for r in recs):
                print(f"{key} LEGACY: run these files in order instead: " + " ".join(r["sql"] for r in recs))
                continue
            sql = B.render_net_sql(recs)
            if sql is None:
                print(f"{key} NOTHING (steps cancel out) — mark it: pg_mcp.py done --page '{key}' --result '[]'")
                continue
            f = out_dir / (pg_rows._safe_key(key) + ".sql")
            f.write_text(sql)
            print(f"{key} {f.relative_to(ROOT)}")
        return 0
    if a.cmd == "done":
        snap.mkdir(parents=True, exist_ok=True)
        if a.page:
            sqls = [json.loads(l)["sql"] for l in pend.read_text().splitlines()
                    if json.loads(l)["page_key"] == a.page] if pend.exists() else []
        else:
            sqls = [a.sql]
        with open(done, "a") as fh:
            for q in sqls:
                fh.write(json.dumps({"sql": q, "page_key": a.page or None, "result": a.result[:500]}) + "\n")
        print(f"applied {len(sqls)} queued step(s) for {a.page or a.sql}")
        return 0
    if a.cmd == "confirm":
        keys = sorted({json.loads(l)["page_key"] for l in pend.read_text().splitlines()} if pend.exists() else set())
        print(ROW_SELECT.format(cols=cols, table=B.table, keys=", ".join(_q(k) for k in keys)) if keys
              else "-- nothing to confirm")
        return 0
    return 2


if __name__ == "__main__":
    sys.exit(main())
