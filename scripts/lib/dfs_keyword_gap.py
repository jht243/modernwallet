#!/usr/bin/env python3
"""Competitor keyword gap on DataForSEO — the ONLY source for keyword-gap routines.

Ahrefs units are reserved for technical site audits (see
.claude/commands/_site-audit-section.md). SEMRUSH is dead on the fleet key. So
the keyword-gap pass gets its competitor data here, never from the Ahrefs API or
the Ahrefs MCP connector. The 2026-09-20 Sunday run burned ~143k Ahrefs units
in 50 minutes doing this through the Ahrefs MCP; the same pull here is ~$0.50.

Per-site config is read (by AST, never imported — some import src.* modules)
from the repo's existing scripts/semrush_keyword_gap.py:
    OUR_DOMAIN, COMPETITORS, DATABASE, RELEVANT, ADJACENT, EXCLUDE, TARGET_KW_FILE
Anything missing falls back to a CLI flag or a permissive default.

COST DISCIPLINE
  * ranked_keywords is $0.012/request + $0.00012/row (measured 2026-09-24).
  * Every domain pull is cached in reports/seo-research/dfs-cache/ for
    CACHE_DAYS (28). Competitor keyword sets barely move week to week, so a
    weekly routine pays for fresh pulls about once a month.
  * DFS_MAX_COST_USD (default $2/process) caps the run; a BudgetExceeded mid-run
    keeps the cached/partial data and says so rather than failing.

Usage:
    python3 scripts/lib/dfs_keyword_gap.py                       # full gap
    python3 scripts/lib/dfs_keyword_gap.py --refresh-competitors # also list live SERP-overlap competitors
    python3 scripts/lib/dfs_keyword_gap.py --no-cache            # force fresh pulls
Writes reports/seo-research/keyword-gap.json and prints a summary.
"""
from __future__ import annotations

import argparse
import ast
import json
import os
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dataforseo as dfs  # noqa: E402

ROOT = Path.cwd()
OUT_DIR = ROOT / "reports" / "seo-research"
CACHE_DIR = OUT_DIR / "dfs-cache"
CACHE_DAYS = 28
DEFAULT_TRACKED = OUT_DIR / "target-keywords.md"
GAP_SCRIPT = ROOT / "scripts" / "semrush_keyword_gap.py"


# ----------------------------------------------------------------- site config
def _regex_from(node: ast.AST) -> re.Pattern | None:
    """re.compile(r"...", re.I) -> compiled pattern, from the AST node."""
    if not (isinstance(node, ast.Call) and node.args):
        return None
    try:
        pat = ast.literal_eval(node.args[0])
    except Exception:
        return None
    return re.compile(pat, re.I) if isinstance(pat, str) else None


def load_site_config(path: Path = GAP_SCRIPT) -> dict:
    cfg: dict = {}
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except (OSError, SyntaxError):
        tree = ast.Module(body=[], type_ignores=[])
    for node in tree.body:
        if not (isinstance(node, ast.Assign) and len(node.targets) == 1
                and isinstance(node.targets[0], ast.Name)):
            continue
        name, val = node.targets[0].id, node.value
        if name in ("OUR_DOMAIN", "DATABASE", "COMPETITORS", "SEED_COMPETITORS"):
            try:
                cfg[name] = ast.literal_eval(val)
            except Exception:
                pass
        elif name in ("RELEVANT", "ADJACENT", "EXCLUDE"):
            rx = _regex_from(val)
            if rx:
                cfg[name] = rx
        elif name == "TARGET_KW_FILE":
            # Usually OUT_DIR / "target-keywords.md" — keep the last string part.
            parts = [n.value for n in ast.walk(val)
                     if isinstance(n, ast.Constant) and isinstance(n.value, str)]
            if parts:
                cfg[name] = parts[-1]
    if not cfg.get("COMPETITORS") and cfg.get("SEED_COMPETITORS"):
        cfg["COMPETITORS"] = cfg["SEED_COMPETITORS"]
    if not cfg.get("OUR_DOMAIN"):
        try:
            facts = json.loads((ROOT / ".claude" / "project-facts.json").read_text())
            dom = facts.get("domain") or facts.get("our_domain") or ""
            if dom:
                cfg["OUR_DOMAIN"] = re.sub(r"^https?://(www\.)?|/.*$", "", dom)
        except Exception:
            pass
    return cfg


def resolve_tracked(name: str | None) -> Path:
    """The tracked-keyword doc: named file under reports/seo-research, else anywhere
    in reports/ or docs/, else the default path (may not exist -> empty set)."""
    for cand in ([name] if name else []) + ["target-keywords.md", "target-keyword-inventory.md",
                                            "TARGET_KEYWORD_INVENTORY.md"]:
        if (OUT_DIR / cand).exists():
            return OUT_DIR / cand
        for base in (ROOT / "reports", ROOT / "docs"):
            hits = sorted(base.rglob(cand)) if base.is_dir() else []
            if hits:
                return hits[0]
    return DEFAULT_TRACKED


# ------------------------------------------------------------------- helpers
def norm(kw: str) -> str:
    return re.sub(r"\s+", " ", kw.lower().strip())


def load_tracked(path: Path) -> set[str]:
    """Every keyword in the tracked doc's markdown tables (primary + secondaries)."""
    tracked: set[str] = set()
    if not path.exists():
        return tracked
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip().strip("`") for c in line.strip().strip("|").split("|")]
        if len(cells) < 2 or set(cells[0]) <= {"-", ":"} or cells[0].lower().startswith("target url"):
            continue
        for cell in cells[1:3]:
            for kw in cell.split(";"):
                if kw.strip():
                    tracked.add(norm(kw))
    return tracked


def cached_ranked(domain: str, limit: int, database: str, use_cache: bool,
                  notes: list[str]) -> list[dict]:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    f = CACHE_DIR / f"{domain.replace('/', '_')}.{database}.json"
    if use_cache and f.exists():
        try:
            blob = json.loads(f.read_text())
            age = (time.time() - blob["fetched_at"]) / 86400
            if age < CACHE_DAYS and blob.get("limit", 0) >= limit:
                notes.append(f"{domain}: cache ({age:.0f}d old, {len(blob['rows'])} rows)")
                return blob["rows"][:limit]
        except Exception:
            pass
    rows = dfs.ranked_keywords(domain, limit, database)
    f.write_text(json.dumps({"domain": domain, "limit": limit, "fetched_at": time.time(),
                             "rows": rows}))
    notes.append(f"{domain}: fresh pull ({len(rows)} rows)")
    return rows


# ---------------------------------------------------------------------- main
def main(argv=None) -> int:
    cfg = load_site_config()
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--domain", default=cfg.get("OUR_DOMAIN"),
                    help="our site host; defaults to OUR_DOMAIN or project-facts.json domain")
    ap.add_argument("--competitor", action="append",
                    help="override the COMPETITORS list (repeatable)")
    ap.add_argument("--database", default=cfg.get("DATABASE", "us"))
    ap.add_argument("--tracked", default=None, help="tracked-keyword markdown file")
    ap.add_argument("--our-limit", type=int, default=500)
    ap.add_argument("--comp-limit", type=int, default=200)
    ap.add_argument("--max-competitors", type=int, default=12)
    ap.add_argument("--refresh-competitors", action="store_true",
                    help="also return live SERP-overlap competitors (1 call)")
    ap.add_argument("--no-cache", action="store_true")
    ap.add_argument("--out", default=str(OUT_DIR / "keyword-gap.json"))
    a = ap.parse_args(argv)

    if not a.domain:
        print(json.dumps({"error": "no OUR_DOMAIN in scripts/semrush_keyword_gap.py or "
                          ".claude/project-facts.json; pass --domain <site host>"}))
        return 2
    if not dfs.available():
        print(json.dumps({"error": "DataForSEO unavailable (no credentials or DFS_ENABLED=0)"}))
        return 2

    comps = (a.competitor or cfg.get("COMPETITORS") or [])[:a.max_competitors]
    tracked_path = Path(a.tracked) if a.tracked else resolve_tracked(cfg.get("TARGET_KW_FILE"))
    relevant, adjacent, exclude = cfg.get("RELEVANT"), cfg.get("ADJACENT"), cfg.get("EXCLUDE")
    notes: list[str] = []
    use_cache = not a.no_cache

    live_competitors = []
    if a.refresh_competitors or not comps:
        try:
            live_competitors = dfs.competitors_domain(a.domain, 20, a.database)
        except (dfs.DFSError, dfs.BudgetExceeded) as e:
            notes.append(f"competitors_domain failed: {e}")
        if not comps:
            comps = [c["domain"] for c in live_competitors][:min(8, a.max_competitors)]
            notes.append("no COMPETITORS configured -> using top live SERP-overlap domains; "
                         "prune off-mission ones and write the kept set into COMPETITORS")

    try:
        ours = {norm(r["keyword"]) for r in
                cached_ranked(a.domain, a.our_limit, a.database, use_cache, notes)}
    except (dfs.DFSError, dfs.BudgetExceeded) as e:
        print(json.dumps({"error": f"our-domain pull failed: {e}", "cost": dfs.cost_summary()}))
        return 2
    tracked = load_tracked(tracked_path)

    gap: dict[str, dict] = {}
    pulled = 0
    for dom in comps:
        try:
            rows = cached_ranked(dom, a.comp_limit, a.database, use_cache, notes)
        except (dfs.DFSError, dfs.BudgetExceeded) as e:
            notes.append(f"{dom}: skipped ({str(e)[:80]})")
            continue
        pulled += len(rows)
        for r in rows:
            n = norm(r["keyword"])
            if not n or n in ours or n in tracked:
                continue
            if exclude and exclude.search(n):
                continue
            is_core = bool(relevant.search(n)) if relevant else True
            if not is_core and not (adjacent and adjacent.search(n)):
                continue
            rec = gap.setdefault(n, {"keyword": r["keyword"], "volume": 0,
                                     "kd": r["kd"] if r["kd"] != "" else 0,
                                     "cpc": r["cpc"] or 0, "tier": "adjacent",
                                     "competitors": set(), "best_pos": 999})
            if is_core:
                rec["tier"] = "core"
            rec["competitors"].add(dom)
            rec["volume"] = max(rec["volume"], r["volume"])
            rec["best_pos"] = min(rec["best_pos"], r["position"] or 999)

    results = []
    for rec in gap.values():
        nc = len(rec["competitors"])
        results.append({**rec, "competitors": sorted(rec["competitors"]),
                        "num_competitors": nc,
                        "score": round(rec["volume"] * nc / (float(rec["kd"] or 0) + 1), 1)})
    results.sort(key=lambda x: x["score"], reverse=True)

    out = {
        "source": "dataforseo",
        "domain": a.domain, "database": a.database, "competitors": comps,
        "live_competitors": live_competitors,
        "our_keyword_count": len(ours), "tracked_keyword_count": len(tracked),
        "competitor_rows_pulled": pulled,
        "new_gap_count": len(results),
        "core_count": sum(1 for r in results if r["tier"] == "core"),
        "adjacent_count": sum(1 for r in results if r["tier"] == "adjacent"),
        "cost": dfs.cost_summary(), "notes": notes,
        "gaps": results,
    }
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(json.dumps({k: v for k, v in out.items() if k != "gaps"}, indent=1))
    print(f"\nTop 25 of {len(results)} gaps -> {a.out}")
    for r in results[:25]:
        print(f"  {r['score']:>8.1f}  vol={r['volume']:>6}  kd={r['kd']!s:>3}  "
              f"x{r['num_competitors']}  [{r['tier']:>8}]  {r['keyword']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
