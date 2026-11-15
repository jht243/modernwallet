#!/usr/bin/env python3
"""Competitor keyword gap — SEMRUSH first, DataForSEO fallback, never Ahrefs.

USER RULE 2026-11-02: SEMRUSH is primary wherever it can answer. Each domain's
ranked keywords come from SEMRUSH domain_organic and the competitor list from
domain_organic_organic (scripts/lib/semrush.py); a SEMRUSH failure (no key,
units out) falls back to DataForSEO Labs per call. Ahrefs units are reserved for
technical site audits (see .claude/commands/_site-audit-section.md), so the
keyword-gap pass never uses the Ahrefs API or the Ahrefs MCP connector. The 2026-09-20 Sunday run burned ~143k Ahrefs units
in 50 minutes doing this through the Ahrefs MCP; the same pull here is ~$0.50.

Per-site config is read (by AST, never imported — some import src.* modules)
from the repo's existing scripts/semrush_keyword_gap.py:
    OUR_DOMAIN, COMPETITORS, DATABASE, RELEVANT, ADJACENT, EXCLUDE, TARGET_KW_FILE
Anything missing falls back to a CLI flag or a permissive default.

COST DISCIPLINE
  * SEMRUSH domain_organic is 10 units/row (a 200-row competitor pull = 2,000 units).
  * DataForSEO fallback: ranked_keywords is $0.012/request + $0.00012/row (2026-09-24).
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
import semrush as sr  # noqa: E402

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


_CLUSTER_STOP = frozenset("""
a an the of for to in on and or is it its does do with your you are can how what which why
when where who should could would each every pick choose get make guide guides complete full
best top new 2024 2025 2026 2027 tool tools software app apps platform platforms service services
use using much many me my i we our there here than that this these those into from about between
""".split())

_CLUSTER_FORMAT = {
    "pricing": "pricing", "price": "pricing", "prices": "pricing", "cost": "pricing", "costs": "pricing",
    "plan": "pricing", "plans": "pricing", "subscription": "pricing", "tier": "pricing", "tiers": "pricing",
    "vs": "vs", "versus": "vs", "compared": "vs", "comparison": "vs",
    "alternative": "alternatives", "alternatives": "alternatives", "competitor": "alternatives", "competitors": "alternatives",
    "review": "review", "reviews": "review", "worth": "review",
    "calculator": "calculator", "roi": "calculator",
    "template": "template", "templates": "template", "checklist": "template",
    "free": "free", "trial": "free",
    "tutorial": "how-to", "setup": "how-to",
}

_SLUG_SCAN_RE = re.compile(r"""["']?slug["']?\s*:\s*["']([a-z0-9][a-z0-9-]*)["']""")
_TITLE_SCAN_RE = re.compile(r"""["']?(?:metaTitle|title)["']?\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1""", re.S)
_FM_SCAN_RE = re.compile(r"\A---\s*\n(.*?)\n---", re.S)


def _topic_signature(text: str) -> tuple[tuple[str, ...], str]:
    """Return (sorted_entity_tokens, intent_format) preserving version numbers so distinct
    models/versions (e.g. gpt-5 vs gpt-6) never merge while inflection/word-order variants
    of the exact same SERP intent group losslessly."""
    words = re.sub(r"[^a-z0-9]+", " ", (text or "").lower()).split()
    fmt = "general"
    for w in words:
        if w in _CLUSTER_FORMAT:
            fmt = _CLUSTER_FORMAT[w]
            break
    toks: list[str] = []
    ver_run: list[str] = []

    def _flush_ver() -> None:
        if ver_run:
            toks.append("v" + ".".join(ver_run))
            ver_run.clear()

    for w in words:
        if w.isdigit() and not re.fullmatch(r"(19|20)\d\d", w):
            ver_run.append(w)
            continue
        _flush_ver()
        if w in _CLUSTER_STOP or w in _CLUSTER_FORMAT or len(w) < 2:
            continue
        if len(w) > 3 and w.endswith("s") and not w.endswith("ss"):
            w = w[:-1]
        toks.append(w)
    _flush_ver()
    if not toks:
        toks = [w for w in words if len(w) >= 2][:4] or [norm(text)]
    return tuple(sorted(set(toks))), fmt


def _scan_repo_pages(root: Path) -> list[dict]:
    """Fast local-only scan of structured page data & markdown frontmatter for route pre-matching."""
    pages: list[dict] = []
    seen_slugs: set[str] = set()
    for sub in ("data", "src/data", "src/content", "content", "src/lib/data", "src/pages"):
        base = root / sub
        if not base.is_dir():
            continue
        for p in sorted(base.rglob("*")):
            if not p.is_file() or p.suffix not in (".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".mdx"):
                continue
            try:
                txt = p.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            if p.suffix in (".md", ".mdx"):
                fm = _FM_SCAN_RE.match(txt[:4000])
                title = ""
                slug = p.parent.name if p.stem in ("index", "_index") else p.stem
                if fm:
                    m_t = re.search(r"^title\s*:\s*(.+)$", fm.group(1), re.M)
                    m_s = re.search(r"^slug\s*:\s*(.+)$", fm.group(1), re.M)
                    if m_t:
                        title = m_t.group(1).strip().strip("'\"")
                    if m_s:
                        slug = m_s.group(1).strip().strip("'\"")
                slug = slug.strip("/").split("/")[-1]
                if slug and slug not in seen_slugs:
                    seen_slugs.add(slug)
                    toks, fmt = _topic_signature(f"{slug.replace('-', ' ')} {title}")
                    pages.append({"slug": slug, "file": str(p.relative_to(root)), "title": title[:120],
                                  "tokens": set(toks), "format": fmt})
            else:
                hits = list(_SLUG_SCAN_RE.finditer(txt))
                for idx, m in enumerate(hits):
                    slug = m.group(1)
                    if slug in seen_slugs:
                        continue
                    seen_slugs.add(slug)
                    end = hits[idx + 1].start() if idx + 1 < len(hits) else min(len(txt), m.end() + 3000)
                    chunk = txt[m.end():end]
                    tm = _TITLE_SCAN_RE.search(chunk)
                    title = tm.group(2).strip()[:120] if tm else ""
                    toks, fmt = _topic_signature(f"{slug.replace('-', ' ')} {title}")
                    pages.append({"slug": slug, "file": str(p.relative_to(root)), "title": title,
                                  "tokens": set(toks), "format": fmt})
    return pages


def cluster_gaps(results: list[dict], root: Path | None = None) -> list[dict]:
    """Losslessly group raw gap rows sharing the same entity-token + SERP-intent signature.
    100% of input keywords are preserved (1 primary + all supporting_keywords per cluster)."""
    groups: dict[tuple[tuple[str, ...], str], list[dict]] = {}
    for r in results:
        sig = _topic_signature(r["keyword"])
        groups.setdefault(sig, []).append(r)

    repo_pages = _scan_repo_pages(root) if root is not None else []
    clusters: list[dict] = []
    for (toks, fmt), members in groups.items():
        members_sorted = sorted(members, key=lambda x: (x.get("score", 0), x.get("volume", 0)), reverse=True)
        primary = members_sorted[0]
        all_comps = sorted({c for m in members_sorted for c in m.get("competitors", [])})
        kds = [float(m["kd"]) for m in members_sorted if m.get("kd") not in ("", None)]
        min_kd = round(min(kds), 1) if kds else 0
        total_vol = sum(int(m.get("volume") or 0) for m in members_sorted)
        tier = "core" if any(m.get("tier") == "core" for m in members_sorted) else "adjacent"
        cluster_score = round(total_vol * max(1, len(all_comps)) / (float(min_kd) + 1.0), 1)

        matched_pages: list[dict] = []
        tok_set = set(toks)
        if tok_set and repo_pages:
            scored_pages = []
            for pg in repo_pages:
                overlap = len(tok_set & pg["tokens"])
                if overlap == 0:
                    continue
                ratio = overlap / max(1, len(tok_set))
                if overlap >= 2 or ratio >= 0.65:
                    fmt_bonus = 0.15 if pg["format"] == fmt else 0.0
                    scored_pages.append((ratio + fmt_bonus, overlap, pg))
            scored_pages.sort(key=lambda x: (x[0], x[1]), reverse=True)
            for _, _, pg in scored_pages[:2]:
                matched_pages.append({"slug": pg["slug"], "file": pg["file"], "title": pg["title"]})

        slug_id = re.sub(r"[^a-z0-9]+", "-", primary["keyword"].lower()).strip("-")[:64] or "cluster"
        clusters.append({
            "cluster_id": f"{slug_id}--{fmt}",
            "primary_keyword": primary["keyword"],
            "primary_volume": primary.get("volume", 0),
            "total_volume": total_vol,
            "min_kd": min_kd,
            "tier": tier,
            "intent_format": fmt,
            "competitors": all_comps,
            "num_competitors": len(all_comps),
            "score": cluster_score,
            "member_count": len(members_sorted),
            "supporting_keywords": [
                {"keyword": m["keyword"], "volume": m.get("volume", 0), "kd": m.get("kd", 0), "tier": m.get("tier", tier)}
                for m in members_sorted[1:]
            ],
            "existing_coverage": matched_pages,
        })

    clusters.sort(key=lambda c: c["score"], reverse=True)
    return clusters


def format_clustered_brief_markdown(domain: str, comps: list[str], clusters: list[dict], total_gaps: int) -> str:
    """Render a compact, 100%-lossless Markdown table where every single discovered gap
    keyword is preserved inside its SERP-intent cluster row."""
    lines = [
        f"# Clustered Competitor Keyword Gap — {domain}",
        "",
        f"- **Competitors ({len(comps)}):** {', '.join(comps)}",
        f"- **Total raw gap keywords preserved (0 cut):** {total_gaps} across **{len(clusters)}** SERP-intent clusters",
        "",
        "| # | Primary Keyword | Intent | Tier | Combined Vol (Primary) | Min KD | Comps | Supporting Variants (include ALL on target page & inventory) | Pre-Matched Existing Route(s) |",
        "|---:|---|---|---|---:|---:|---:|---|---|",
    ]
    for idx, c in enumerate(clusters, 1):
        supp = "; ".join(
            f"{s['keyword']} ({s['volume']})" for s in c["supporting_keywords"]
        ) or "—"
        cov = "; ".join(
            f"`{m['slug']}` ({m['file']})" for m in c["existing_coverage"]
        ) or "none (new-page candidate)"
        lines.append(
            f"| {idx} | {c['primary_keyword']} | {c['intent_format']} | {c['tier']} | "
            f"{c['total_volume']} ({c['primary_volume']}) | {c['min_kd']} | {c['num_competitors']} | "
            f"{supp} | {cov} |"
        )
    lines.append("")
    return "\n".join(lines)


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
    src = "semrush"
    try:
        rows = sr.ranked_keywords(domain, limit, database)
    except sr.SemrushError as e:
        if not dfs.available():
            raise dfs.DFSError(f"SEMRUSH failed ({e}) and DataForSEO is unavailable")
        notes.append(f"{domain}: SEMRUSH failed ({str(e)[:60]}) -> DataForSEO")
        rows, src = dfs.ranked_keywords(domain, limit, database), "dataforseo"
    f.write_text(json.dumps({"domain": domain, "limit": limit, "fetched_at": time.time(),
                             "source": src, "rows": rows}))
    notes.append(f"{domain}: fresh pull from {src} ({len(rows)} rows)")
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
    ap.add_argument("--brief-out", default=str(OUT_DIR / "keyword-gap.brief.md"),
                    help="lossless intent-clustered Markdown brief preserving 100%% of gap keywords")
    a = ap.parse_args(argv)

    if not a.domain:
        print(json.dumps({"error": "no OUR_DOMAIN in scripts/semrush_keyword_gap.py or "
                          ".claude/project-facts.json; pass --domain <site host>"}))
        return 2
    if not (sr.available() or dfs.available()):
        print(json.dumps({"error": "SEMRUSH and DataForSEO both unavailable (no keys, or disabled)"}))
        return 2

    comps = (a.competitor or cfg.get("COMPETITORS") or [])[:a.max_competitors]
    tracked_path = Path(a.tracked) if a.tracked else resolve_tracked(cfg.get("TARGET_KW_FILE"))
    relevant, adjacent, exclude = cfg.get("RELEVANT"), cfg.get("ADJACENT"), cfg.get("EXCLUDE")
    notes: list[str] = []
    use_cache = not a.no_cache

    live_competitors = []
    if a.refresh_competitors or not comps:
        try:
            live_competitors = sr.competitors_domain(a.domain, 20, a.database)
        except sr.SemrushError as e:
            notes.append(f"SEMRUSH competitors failed ({str(e)[:60]}) -> DataForSEO")
            try:
                live_competitors = dfs.competitors_domain(a.domain, 20, a.database)
            except (dfs.DFSError, dfs.BudgetExceeded) as e2:
                notes.append(f"competitors_domain failed: {e2}")
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
    clusters = cluster_gaps(results, root=ROOT)

    out = {
        "source": "semrush (dataforseo fallback per domain; see notes)",
        "domain": a.domain, "database": a.database, "competitors": comps,
        "live_competitors": live_competitors,
        "our_keyword_count": len(ours), "tracked_keyword_count": len(tracked),
        "competitor_rows_pulled": pulled,
        "new_gap_count": len(results),
        "cluster_count": len(clusters),
        "core_count": sum(1 for r in results if r["tier"] == "core"),
        "adjacent_count": sum(1 for r in results if r["tier"] == "adjacent"),
        "cost": dfs.cost_summary(), "notes": notes,
        "clusters": clusters,
        "gaps": results,
    }
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(json.dumps(out, indent=2), encoding="utf-8")
    if a.brief_out:
        Path(a.brief_out).parent.mkdir(parents=True, exist_ok=True)
        Path(a.brief_out).write_text(
            format_clustered_brief_markdown(a.domain, comps, clusters, len(results)),
            encoding="utf-8",
        )
    print(json.dumps({k: v for k, v in out.items() if k not in ("gaps", "clusters")}, indent=1))
    print(f"\nTop 25 of {len(clusters)} SERP-intent clusters ({len(results)} total keywords, 0 cut) -> {a.out} & {a.brief_out}")
    for c in clusters[:25]:
        print(f"  {c['score']:>8.1f}  vol={c['total_volume']:>6}  kd={c['min_kd']!s:>4}  "
              f"x{c['num_competitors']}  members={c['member_count']:>2}  [{c['tier']:>8}]  {c['primary_keyword']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
