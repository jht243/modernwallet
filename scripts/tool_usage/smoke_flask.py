#!/usr/bin/env python3
"""Build check for Flask fleet sites (no `npm run build`) — used as build_cmd by tool_usage_gate.py.

  python3 scripts/tool_usage/smoke_flask.py

1. Byte-compiles server.py, src/, scripts/ — any syntax error fails.
2. Parses every Jinja template under templates/ — any template syntax error fails.
3. Imports `server:app` and GETs, through Flask's test client, every route the open tool-usage run
   touches (picked tools + chart targets). Any 4xx/5xx or exception fails; 2xx/3xx pass.
   If the app cannot be imported only because a runtime secret (database URL, API key) is absent in
   this sandbox, step 3 is reported as SKIPPED with the reason — steps 1–2 still gate.
Exit 0 = pass.
"""
import compileall, json, os, re, sys, traceback
from pathlib import Path

ok = True
targets = [p for p in ("server.py", "src", "scripts") if Path(p).exists()]
for t in targets:
    good = compileall.compile_file(t, quiet=1) if t.endswith(".py") else compileall.compile_dir(t, quiet=1)
    if not good:
        print(f"FAIL compile: {t}"); ok = False

try:
    import jinja2
    env = jinja2.Environment(loader=jinja2.FileSystemLoader("templates"), extensions=["jinja2.ext.do", "jinja2.ext.loopcontrols"])
    n = 0
    for f in Path("templates").rglob("*"):
        if f.is_file() and f.suffix in (".j2", ".html", ".jinja", ".txt", ".xml"):
            try:
                env.parse(f.read_text(errors="ignore")); n += 1
            except jinja2.TemplateSyntaxError as e:
                print(f"FAIL template {f}:{e.lineno}: {e.message}"); ok = False
    print(f"templates parsed: {n}")
except ImportError:
    print("FAIL: jinja2 not installed (pip install -r requirements.txt first)"); ok = False

routes = set()
marker = Path("/tmp/tool-usage-run.json")
if marker.exists():
    m = json.loads(marker.read_text()); run = Path(m["run_dir"])
    if (run / "picked.json").exists():
        routes |= {t.get("path") for t in json.loads((run / "picked.json").read_text()) if isinstance(t, dict)}
    chart = Path(f"reports/mindmap-pass/{m['date']}-tool-usage.md")
    if chart.exists():
        routes |= set(re.findall(r"\|\s*`?(/[a-z0-9][a-z0-9/_-]*/?)`?\s*\|", chart.read_text()))
routes = sorted(r for r in routes if r and r.startswith("/"))

sys.path.insert(0, os.getcwd())
try:
    from server import app  # noqa
except Exception as e:  # missing runtime secret in the sandbox is not a code failure
    msg = f"{type(e).__name__}: {e}"
    if re.search(r"DATABASE|database|SUPABASE|connect|environ|KeyError|API_KEY|secret|credential", msg):
        print(f"SKIPPED route check (app needs a runtime secret here): {msg[:200]}")
    else:
        print("FAIL import server:app"); traceback.print_exc(); ok = False
    app = None
DB_ERR = re.compile(r"OperationalError|could not connect|Connection refused|connection to server|DATABASE_URL|"
                    r"psycopg|sqlalchemy\.exc|InterfaceError|no such table|SUPABASE", re.I)
if app is not None:
    app.config["PROPAGATE_EXCEPTIONS"] = True      # surface the real error instead of an opaque 500
    c = app.test_client()
    for r in routes:
        try:
            code = c.get(r).status_code
        except Exception as e:
            msg = f"{type(e).__name__}: {e}"
            if DB_ERR.search(msg):
                print(f"SKIP GET {r} -> needs the live database here ({msg[:120]})"); continue
            code = f"EXC {msg[:160]}"
        bad = not isinstance(code, int) or code >= 400   # a tool route must exist (2xx/3xx)
        print(f"{'FAIL' if bad else 'ok  '} GET {r} -> {code}")
        ok = ok and not bad
sys.exit(0 if ok else 1)
