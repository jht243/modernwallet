#!/usr/bin/env python3
"""Hard gates for /tool-usage-mindmap-auto — no shortcuts (USER RULE 2026-10-11).

The routine may not skip the persona walkthrough or mindmap's full pass. Each stage writes an
.ok stamp only when its artifacts really exist; .claude/tools/tool-usage-gates.sh (PreToolUse
hook) blocks code edits, page writing, deploy and the owner email until the right stamps exist.

  start   --site <tracked domain> --base-url <https://host>   open the run (writes /tmp marker)
  persona                 STEP 3 done: one persona file + 2 screenshots per picked tool, each with a
                          `## Monetization` verdict (fit / no-fit / blocked)
  chart                   mindmap chart saved in full (12 columns, lookup: on every create row)
  build                   run the site's build; stamp only on exit 0
  final                   everything before deploy (manifest, audit, standards, links, ledger)
  live                    after deploy: every changed URL answers 200 with its data-tool root; every
                          `tool monetize` page ships the site's own Amazon tag
  status                  print which stamps exist

Run dir: reports/tool-usage-pass/<YYYY-MM-DD>/   Chart: reports/mindmap-pass/<YYYY-MM-DD>-tool-usage.md
Exit 0 = pass, 1 = fail (the reason is printed). Stdlib only, portable across fleet repos.
"""
import argparse, datetime, glob, json, os, re, subprocess, sys, urllib.request
from pathlib import Path

MARKER = Path("/tmp/tool-usage-run.json")
CHART_COLS = ["problem", "solution", "bucket", "target", "format", "best_medium",
              "resolved_deliverable", "serp_verdict", "serp_evidence",
              "reader_question", "answer", "answer_placement"]
PERSONA_SECTIONS = ["## Evidence", "## Persona", "## Walkthrough", "## Friction", "## Monetization"]
VERDICT_RE = re.compile(r"^\s*\**verdict\**\s*:\s*\**\s*(fit|no-fit|blocked)\b", re.I | re.M)
SKIP_DIRS = {".git", "node_modules", "dist", ".next", "build", "reports", ".astro", "__pycache__", ".venv"}


def fail(msg):
    print(f"GATE FAIL: {msg}")
    sys.exit(1)


def ok(stamp, run, msg):
    (run / f"{stamp}.ok").write_text(datetime.datetime.now(datetime.timezone.utc).isoformat() + "\n")
    print(f"GATE PASS ({stamp}): {msg}")


def load_run():
    if not MARKER.exists():
        fail("no open run — call `tool_usage_gate.py start` first")
    m = json.loads(MARKER.read_text())
    return m, Path(m["run_dir"])


def need(run, *stamps):
    missing = [s for s in stamps if not (run / f"{s}.ok").exists()]
    if missing:
        fail(f"earlier stage(s) not passed: {', '.join(missing)}")


def chart_path(m):
    return Path(f"reports/mindmap-pass/{m['date']}-tool-usage.md")


def chart_rows(text):
    """Return (header_cells, rows) of the first markdown table whose header has 'bucket'."""
    lines = text.splitlines()
    for i, l in enumerate(lines):
        cells = [c.strip().lower() for c in l.strip().strip("|").split("|")]
        if "bucket" in cells and i + 1 < len(lines) and set(lines[i + 1].replace("|", "").strip()) <= set("-: "):
            rows = []
            for r in lines[i + 2:]:
                if not r.strip().startswith("|"):
                    break  # A later checklist/cluster table is not an action row.
                rc = [c.strip() for c in r.strip().strip("|").split("|")]
                if len(rc) < 3:
                    break
                rows.append(dict(zip(cells, rc)))
            return cells, rows
    return [], []


def site_cfg():
    cfg = Path(".claude/tool-usage.site.json")
    return json.loads(cfg.read_text()) if cfg.exists() else {}


def is_fix(r):
    """Rows Phase 5 applies as CODE in the tool's component, not as prose."""
    f = r.get("format", "").lower()
    return "tool fix" in f or "tool monetize" in f


def monetize_verdicts(run):
    """{tool slug: fit|no-fit|blocked} from each persona file's ## Monetization section."""
    out = {}
    for f in (run / "personas").glob("*.md"):
        sec = f.read_text().split("## Monetization", 1)
        if len(sec) == 2:
            m = VERDICT_RE.search(sec[1].split("\n## ", 1)[0])
            out[f.stem] = m.group(1).lower() if m else None
    return out


def picked(run):
    p = run / "picked.json"
    if not p.exists():
        fail(f"{p} missing — STEP 2 must write the picked tools list")
    return json.loads(p.read_text())


# ---------------------------------------------------------------- stages
def cmd_start(a):
    date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    run = Path(f"reports/tool-usage-pass/{date}")
    (run / "personas").mkdir(parents=True, exist_ok=True)
    (run / "screenshots").mkdir(parents=True, exist_ok=True)
    for s in run.glob("*.ok"):
        s.unlink()
    MARKER.write_text(json.dumps({"date": date, "site": a.site, "base_url": a.base_url.rstrip("/"),
                                  "run_dir": str(run.resolve()), "repo": os.getcwd()}))
    print(f"GATE START: run dir {run}. Next: write {run}/picked.json, then one persona file per tool.")


def cmd_persona(a):
    m, run = load_run()
    tools = picked(run)
    if not tools:
        fail("picked.json is empty — nothing to work means exit 0, not a run")
    probs = []
    for t in tools:
        slug = t["tool"] if isinstance(t, dict) else t
        f = run / "personas" / f"{slug}.md"
        if not f.exists():
            probs.append(f"{slug}: no persona file {f}"); continue
        s = f.read_text()
        for sec in PERSONA_SECTIONS:
            if sec not in s:
                probs.append(f"{slug}: persona file lacks '{sec}'")
        walk = s.split("## Walkthrough", 1)[-1].split("## Friction", 1)[0]
        if not re.search(r"1366|desktop", walk, re.I) or not re.search(r"390|phone|mobile", walk, re.I):
            probs.append(f"{slug}: Walkthrough must record BOTH the desktop (1366px) and phone (390px) runs")
        mon = s.split("## Monetization", 1)[-1].split("\n## ", 1)[0]
        if "## Monetization" in s and not VERDICT_RE.search(mon):
            probs.append(f"{slug}: ## Monetization needs a `Verdict: fit|no-fit|blocked` line (STEP 3b)")
        elif VERDICT_RE.search(mon) and VERDICT_RE.search(mon).group(1).lower() == "fit" \
                and len(re.findall(r"^\s*\d+[.)]\s", mon, re.M)) < 3:
            probs.append(f"{slug}: Monetization verdict is fit but there is no ranked list of 3+ product types "
                         f"(numbered, highest priority first) — variety rule, STEP 3b")
        elif "## Monetization" in s and len(mon.split()) < 25:
            probs.append(f"{slug}: ## Monetization is under 25 words — name what they'd buy for THEIR result, or why nothing fits")
        if len(walk.split()) < 60:
            probs.append(f"{slug}: Walkthrough is under 60 words — record what the persona actually did and saw")
        for view in ("desktop", "mobile"):
            png = run / "screenshots" / f"{slug}-{view}.png"
            if not png.exists() or png.stat().st_size < 5000:
                probs.append(f"{slug}: screenshot {png} missing (take it in the live walkthrough)")
    if probs:
        fail("persona stage incomplete:\n  - " + "\n  - ".join(probs))
    ok("PERSONA", run, f"{len(tools)} persona walkthroughs on file")


def cmd_chart(a):
    m, run = load_run()
    need(run, "PERSONA")
    cp = chart_path(m)
    if not cp.exists():
        fail(f"mindmap chart not saved at {cp} — run phase-build-brief.md in full and save it there")
    cells, rows = chart_rows(cp.read_text())
    missing = [c for c in CHART_COLS if c not in cells]
    if missing:
        fail(f"chart table is missing mindmap columns: {', '.join(missing)} (phase-build-brief.md defines all 12)")
    if not rows:
        fail("chart has no rows")
    no_lookup = [r.get("target", "?") for r in rows
                 if "create new content" in r.get("bucket", "").lower() and "lookup:" not in r.get("problem", "")]
    if no_lookup:
        fail(f"create-new-content rows without a coverage `lookup:` entry: {no_lookup}")
    text = cp.read_text().lower()
    absent = [t["tool"] if isinstance(t, dict) else t for t in picked(run)
              if (t["tool"] if isinstance(t, dict) else t).lower() not in text]
    if absent:
        fail(f"picked tools never reach the chart (each needs its fix rows or an explicit 'no friction' line): {absent}")
    mon_rows = " ".join((r.get("target", "") + " " + r.get("problem", "")).lower()
                        for r in rows if "tool monetize" in r.get("format", "").lower())
    unrowed = [t for t, v in monetize_verdicts(run).items() if v == "fit" and t.lower() not in mon_rows]
    if unrowed:
        fail(f"Monetization verdict is `fit` but no `tool monetize` chart row names the tool: {unrowed}")
    if mon_rows and not site_cfg().get("amazon_tag"):
        fail("chart has `tool monetize` rows but .claude/tool-usage.site.json has no amazon_tag — "
             "mark those tools `Verdict: blocked` instead (STEP 3b); only the owner sets the tag")
    out = subprocess.run([sys.executable, "scripts/mindmap/coverage_lookup.py", "--site-url", m["base_url"],
                          "--chart", str(cp)], capture_output=True, text=True)
    (run / "coverage_lookup.txt").write_text(out.stdout + out.stderr)
    if out.returncode != 0:
        fail(f"coverage_lookup.py failed (see {run}/coverage_lookup.txt)")
    creates = sum(1 for r in rows if "create new content" in r.get("bucket", "").lower())
    m2 = re.search(r"coverage_lookup:\s*(\d+)\s+candidate", out.stdout)
    seen = int(m2.group(1)) if m2 else 0
    if creates and seen < creates:
        fail(f"coverage_lookup.py read {seen} of {creates} create-new-content rows from the chart — its parser needs a "
             f"leading row-number column (`| # | problem | solution | bucket | target | ...` with 1, 2, 3 in col 1). "
             f"Fix the chart so every new page really gets the duplicate check.")
    ok("CHART", run, f"{len(rows)} chart rows, duplicate lookup saved")


def cmd_build(a):
    m, run = load_run()
    need(run, "PERSONA", "CHART")
    cfg = Path(".claude/tool-usage.site.json")
    site_cmd = json.loads(cfg.read_text()).get("build_cmd") if cfg.exists() else None
    if site_cmd:
        cmd = site_cmd                              # the site's own declared build — not the run's choice
    elif Path("package.json").exists() and '"build"' in Path("package.json").read_text():
        cmd = "npm run build"
    else:
        fail("no build_cmd in .claude/tool-usage.site.json and no package.json build script — the site must declare its build")
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    (run / "build.log").write_text(r.stdout[-20000:] + r.stderr[-20000:])
    if r.returncode != 0:
        fail(f"build failed (`{cmd}`, exit {r.returncode}) — see {run}/build.log")
    ok("BUILD", run, f"`{cmd}` exit 0")


def route_linked(route):
    slug = route.strip("/").split("/")[-1]
    needles = {route.rstrip("/") + "/", route.rstrip("/") + '"', route.rstrip("/") + "'", route.rstrip("/") + ")"}
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
        if slug in root.split(os.sep):
            continue
        for fn in files:
            if fn.endswith((".png", ".jpg", ".webp", ".ico", ".xml", ".json", ".lock")):
                continue
            try:
                s = open(os.path.join(root, fn), errors="ignore").read()
            except Exception:
                continue
            if any(n in s for n in needles):
                return True
    return False


def cmd_final(a):
    m, run = load_run()
    need(run, "PERSONA", "CHART", "BUILD")
    probs = []
    cp = chart_path(m)
    _, rows = chart_rows(cp.read_text())
    man = run / "phase0-manifest.md"
    if not man.exists() or not re.search(r"duplicate check[^\n]*(?:passed|✅\s*Verified)", man.read_text(), re.I):
        probs.append(f"{man} missing or its Duplicate check row is not verified/passed (print Phase 0's manifest table there)")
    audit = run / "audit.md"
    if not audit.exists():
        probs.append(f"{audit} missing — paste the independent Phase 4 auditor's report there")
    else:
        at = audit.read_text()
        for r in rows:
            b = r.get("bucket", "").lower()
            if ("create new content" in b or is_fix(r)) and r.get("target", "") \
                    and r["target"].strip("`") not in at:
                probs.append(f"audit.md never mentions row target {r['target']}")
        if re.search(r"^\s*(VERDICT|FINAL)\s*:\s*FAIL", at, re.I | re.M):
            probs.append("audit.md final verdict is FAIL")
    led = Path("reports/standards-ledger.jsonl")
    today = [l for l in (led.read_text().splitlines() if led.exists() else []) if m["date"] in l]
    if any("create new content" in r.get("bucket", "").lower() for r in rows) and not any('"phase-3"' in l for l in today):
        probs.append("no phase-3 entry in reports/standards-ledger.jsonl today (load-standards.sh was skipped)")
    if any("update existing body text" in r.get("bucket", "").lower() and not is_fix(r)
           for r in rows) and not any('"phase-5"' in l for l in today):
        probs.append("no phase-5 entry in reports/standards-ledger.jsonl today")
    metas = glob.glob(f"reports/mindmap-pass/{m['date']}*/**/*.meta.json", recursive=True)
    for r in rows:
        if "create new content" in r.get("bucket", "").lower():
            route = r.get("target", "").strip("` ")
            slug = route.strip("/").split("/")[-1]
            if not any(slug in x for x in metas):
                probs.append(f"{route}: no content_gen .meta.json — page prose was not generated by the API writer")
            if route.startswith("/") and not route_linked(route):
                probs.append(f"{route}: no inbound internal link anywhere (Phase 6 skipped)")
    summ = run / "phase8-summary.md"
    if not summ.exists():
        probs.append(f"{summ} missing — save mindmap Phase 8's summary there")
    lg = Path("reports/tool-usage-pass/ledger.jsonl")
    lines = [l for l in (lg.read_text().splitlines() if lg.exists() else []) if m["date"] in l]
    for t in picked(run):
        slug = t["tool"] if isinstance(t, dict) else t
        if not any(f'"{slug}"' in l for l in lines):
            probs.append(f"ledger.jsonl has no line for {slug} today")
    if probs:
        fail("not ready to deploy:\n  - " + "\n  - ".join(probs))
    ok("FINAL", run, "all pre-deploy evidence on file")


def cmd_live(a):
    m, run = load_run()
    need(run, "FINAL")
    cp = chart_path(m)
    _, rows = chart_rows(cp.read_text())
    routes = {r.get("target", "").strip("` ").split(" ")[0] for r in rows}
    routes |= {t["path"] for t in picked(run) if isinstance(t, dict) and t.get("path")}
    routes = sorted(x for x in routes if x.startswith("/"))
    report, bad = [], []
    for route in routes:
        url = m["base_url"] + route
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "tool-usage-gate"})
            with urllib.request.urlopen(req, timeout=30) as r:
                code, html = r.status, r.read().decode("utf-8", "ignore")
        except urllib.error.HTTPError as e:
            code, html = e.code, ""
        except Exception as e:
            code, html = f"ERR {e}", ""
        slug = route.strip("/").split("/")[-1]
        tool_ok = f'data-tool="{slug}"' in html or "data-tool=" in html
        report.append(f"- {url} — {code}{'' if tool_ok else ' — NO data-tool root'}")
        if code != 200:
            bad.append(url)
    tag = site_cfg().get("amazon_tag")
    for r in rows:
        if "tool monetize" not in r.get("format", "").lower():
            continue
        route = r.get("target", "").strip("` ").split(" ")[0]
        if not route.startswith("/"):
            route = next((t["path"] for t in picked(run) if isinstance(t, dict) and t.get("tool", "").lower()
                          in r.get("target", "").lower()), "")
        if not route.startswith("/"):
            bad.append(f"tool monetize row {r.get('target')!r} has no route"); continue
        slug = route.strip("/").split("/")[-1]
        text = page_bundle(m["base_url"], route)
        row_text = " ".join(r.values())
        asins = sorted(set(re.findall(r"\b(B0[A-Z0-9]{8}|\d{9}[\dX])\b", row_text)))  # product ASINs + book ISBN-10s
        miss = [x for x in asins if x not in text]
        checks = {f'data-tool-picks="{slug}"': f'data-tool-picks="{slug}"' in text or
                  ("data-tool-picks" in text and slug in text),
                  f"tag {tag}": bool(tag) and tag in text,
                  f"{len(asins)} pinned ASINs": not miss}
        failed = [k for k, v in checks.items() if not v]
        report.append(f"- {m['base_url'] + route} — affiliate picks: "
                      + ("OK (" + ", ".join(checks) + ")" if not failed else "MISSING " + ", ".join(failed)
                         + (f" {miss}" if miss else "")))
        if failed:
            bad.append(f"{route} (picks not live: {', '.join(failed)})")
    (run / "live.md").write_text("## Live verification\n" + "\n".join(report) + "\n")
    if bad:
        fail(f"live check failed: {bad} (fix, or revert those pages per the routine)")
    ok("LIVE", run, f"{len(routes)} URLs 200 — {run}/live.md")


def fetch(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "tool-usage-gate"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode("utf-8", "ignore")
    except Exception:
        return ""


def page_bundle(base, route):
    """Picks render after the visitor computes, so read the page AND its same-origin JS chunks."""
    html = fetch(base + route)
    parts = [html]
    # <script src> plus Astro island chunks (component-url / renderer-url): client:only islands render the picks.
    for src in re.findall(r'<script[^>]+src="([^"]+)"', html) + re.findall(r'(?:component|renderer)-url="([^"]+)"', html):
        if src.startswith("//") or (src.startswith("http") and not src.startswith(base)):
            continue
        parts.append(fetch(src if src.startswith("http") else base + "/" + src.lstrip("/")))
    return "\n".join(parts)


def cmd_status(a):
    m, run = load_run()
    print(json.dumps({"run": str(run), "stamps": sorted(p.stem for p in run.glob('*.ok'))}))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sp = ap.add_subparsers(dest="cmd_name", required=True)
    s = sp.add_parser("start"); s.add_argument("--site", required=True); s.add_argument("--base-url", required=True)
    for n in ("persona", "chart", "final", "live", "status"):
        sp.add_parser(n)
    b = sp.add_parser("build")
    a = ap.parse_args()
    {"start": cmd_start, "persona": cmd_persona, "chart": cmd_chart, "build": cmd_build,
     "final": cmd_final, "live": cmd_live, "status": cmd_status}[a.cmd_name](a)
