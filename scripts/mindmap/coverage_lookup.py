#!/usr/bin/env python3
"""Coverage lookup — EVIDENCE ONLY for mindmap-pass's existing dedup / lever decisions.

For every proposed page it lists the existing pages that may already serve the same
reader, with each one's title + description so the model can compare INTENT with
INTENT. It decides nothing: the lever ladder, the duplicate-suppression gate and the
reviewer in phase-build-brief.md keep making the call exactly as before — they just
make it from a lookup instead of from memory.

Sources (no Search Console). Stack-neutral: the same file runs on Next.js, Astro,
Python/Jinja and database-backed sites.
  1. Repo page data       — structured files (data/, src/data/, src/content/ *.ts/js/json/yaml:
                            slug + title/metaTitle + description/metaDescription + h1) and
                            Markdown/MDX frontmatter (title, description, slug or file name).
                            Covers pages that are live AND pages not yet deployed.
  2. Sitemaps             — local public/**/sitemap*.xml, public/search-index.json, AND the
                            live sitemap at --site-url (auto-detected from astro.config `site`
                            or the local sitemaps when omitted). Covers database-backed pages.
                            Matched pages known only from a sitemap get their live <title> and
                            meta description fetched (≤8 per candidate).
  3. Redirects            — next.config.js, public/_redirects, vercel.json, astro.config
                            redirects: a topic deliberately merged into another page
  4. reports/mindmap-pass/*.md — what past runs proposed, shipped, or dropped, and why
  5. git log --grep       — commits whose message names the topic
  6. the other candidates in this call — the same run

Usage:
  scripts/mindmap/coverage_lookup.py --chart reports/mindmap-pass/2026-10-10.md
  scripts/mindmap/coverage_lookup.py --candidate "/guides/claude-plans-explained|claude plans explained|What does each Claude plan cost?"
  add --json for machine output, --all-rows to include enrich/metadata rows of a chart,
  --site-url https://www.example.com to fetch the live sitemap when public/ has none.

Exit code is always 0 — this tool never blocks a run.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE_URL: str | None = None
ROUTE_BY_SLUG: dict[str, str] = {}

# Question/filler words that carry no topical signal (kept short — the model reads the
# titles/descriptions anyway; this only ranks candidates).
STOP = set("""
a an the of for to in on and or is it its does do with your you are can how what which why
when where who should could would each every pick choose get make vs versus compared comparison
guide guides complete full best top new ai 2024 2025 2026 business tool tools use using much many
me my i we our there here than that this these those into from about between
""".split())
# Format words say what KIND of page it is (pricing / vs / alternatives …). They never
# count as topic overlap on their own, but a shared format is reported as extra evidence.
FORMAT = {
    "pricing": "pricing", "price": "pricing", "prices": "pricing", "cost": "pricing", "costs": "pricing",
    "plan": "pricing", "plans": "pricing", "subscription": "pricing", "tier": "pricing", "tiers": "pricing",
    "vs": "vs", "versus": "vs", "alternative": "alternatives", "alternatives": "alternatives",
    "competitor": "alternatives", "competitors": "alternatives", "explained": "explained", "overview": "explained",
    "review": "review", "worth": "review", "benchmark": "benchmarks", "benchmarks": "benchmarks",
    "limit": "limits", "limits": "limits", "release": "release", "launch": "release", "date": "release",
    "tutorial": "how-to", "setup": "how-to", "free": "free", "template": "template", "checklist": "template",
    "calculator": "calculator", "roi": "calculator",
}

SLUG_RE = re.compile(r"""["']?slug["']?\s*:\s*["']([^"']+)["']""")
FIELD_RE = {
    "title": re.compile(r"""["']?(?:metaTitle|title)["']?\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1""", re.S),
    "desc": re.compile(r"""["']?(?:metaDescription|description)["']?\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1""", re.S),
    "h1": re.compile(r"""["']?h1["']?\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1""", re.S),
}
REDIRECT_RE = re.compile(r"""source\s*:\s*["']([^"']+)["']\s*,\s*destination\s*:\s*["']([^"']+)["']""", re.S)
PREFIX_BY_FILE = [
    ("comparisons", "/comparisons/"), ("guides", "/guides/"), ("robotics", "/robotics/"),
    ("templates", "/templates/"), ("governance", "/governance/"), ("gear-deep", "/gear/reviews/"),
    ("gear-round", "/gear/"), ("open-weights", "/guides/"), ("ai-worker", "/ai-workers/"),
]


def words(text: str) -> list[str]:
    return re.sub(r"[^a-z0-9]+", " ", (text or "").lower()).split()


def tokens(text: str) -> list[str]:
    """Topic (entity) tokens: no stop words, no format words, light plural stem.
    Version numbers are KEPT and joined ("gpt-6-1-sol" → gpt, v6.1, sol) — a different
    version is a different model, never the same topic."""
    out, run = [], []
    def flush():
        if run:
            out.append("v" + ".".join(run)); run.clear()
    for w in words(text):
        if w.isdigit() and not re.fullmatch(r"(19|20)\d\d", w):
            run.append(w); continue
        flush()
        if w in STOP or w in FORMAT or len(w) < 2:
            continue
        if len(w) > 3 and w.endswith("s") and not w.endswith("ss"):
            w = w[:-1]
        out.append(w)
    flush()
    return out


def versions(toks) -> set[str]:
    return {t for t in toks if t.startswith("v") and t[1:2].isdigit()}


def formats(text: str) -> set[str]:
    return {FORMAT[w] for w in words(text) if w in FORMAT}


def last_segment(route: str) -> str:
    return route.rstrip("/").split("/")[-1] if route else ""


# ---------------------------------------------------------------- sources

SKIP_DIRS = (".claude/", "reports/", "docs/", "node_modules/", "scripts/", ".github/", "dist/", "out/", ".next/", "tests/", "test/")
FM_RE = re.compile(r"\A---\s*\n(.*?)\n---", re.S)


def _fm_field(fm: str, key: str) -> str:
    m = re.search(rf"^{key}\s*:\s*(.+)$", fm, re.M)
    return m.group(1).strip().strip("'\"") if m else ""


def _git_files(patterns: list[str]) -> list[str]:
    try:
        r = subprocess.run(["git", "ls-files", *patterns], cwd=ROOT, capture_output=True, text=True, timeout=30)
        keep_claude = any(p.startswith(".claude/") for p in patterns)
        return [f for f in r.stdout.splitlines()
                if f and (not f.startswith(SKIP_DIRS) or (keep_claude and f.startswith(".claude/commands/")))]
    except Exception:
        return []


def pages_from_data() -> dict[str, dict]:
    """slug -> {slug, file, title, desc, h1}; one entry per slug, first file wins.
    Reads structured data files and Markdown/MDX frontmatter."""
    pages: dict[str, dict] = {}
    structured = _git_files(["data/**", "src/data/**", "src/content/**", "content/**", "src/lib/data/**"])
    for rel in sorted(f for f in structured if f.endswith((".ts", ".js", ".mjs", ".json", ".yaml", ".yml"))):
        try:
            text = (ROOT / rel).read_text(errors="replace")
        except Exception:
            continue
        hits = list(SLUG_RE.finditer(text))
        for i, m in enumerate(hits):
            slug = m.group(1).strip("/").split("/")[-1]
            if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", slug) or slug in pages:
                continue
            end = hits[i + 1].start() if i + 1 < len(hits) else min(len(text), m.end() + 6000)
            chunk = text[m.end():min(end, m.end() + 6000)]
            rec = {"slug": slug, "file": rel}
            for key, rx in FIELD_RE.items():
                fm = rx.search(chunk)
                rec[key] = fm.group(2).replace("\\'", "'").strip() if fm else ""
            pages[slug] = rec
    for rel in _git_files(["*.md", "*.mdx"]):
        name = rel.rsplit("/", 1)[-1].lower()
        if name in ("readme.md", "changelog.md", "license.md", "claude.md", "agents.md"):
            continue
        try:
            head = (ROOT / rel).read_text(errors="replace")[:4000]
        except Exception:
            continue
        fm = FM_RE.match(head)
        if not fm:
            continue
        fm = fm.group(1)
        stem = Path(rel).stem
        if stem in ("index", "_index"):
            stem = Path(rel).parent.name
        slug = (_fm_field(fm, "slug") or stem).strip("/").split("/")[-1].lower()
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", slug) or slug in pages:
            continue
        pages[slug] = {"slug": slug, "file": rel, "title": _fm_field(fm, "title"),
                       "desc": _fm_field(fm, "description"), "h1": ""}
    return pages


def detect_site_url() -> str | None:
    for cfg in ("astro.config.mjs", "astro.config.ts", "astro.config.js"):
        f = ROOT / cfg
        if f.exists():
            m = re.search(r"""site\s*:\s*["'](https?://[^"']+)""", f.read_text(errors="replace"))
            if m:
                return m.group(1).rstrip("/")
    for xml in (ROOT / "public").glob("**/sitemap*.xml") if (ROOT / "public").exists() else []:
        m = re.search(r"<loc>\s*(https?://[^/<\s]+)", xml.read_text(errors="replace"))
        if m:
            return m.group(1)
    # Python/Jinja/Next sites: a BASE_URL / SITE_URL constant somewhere in the code or the skill files
    rx = re.compile(r"""(?:BASE_URL|SITE_URL|SITE_ORIGIN|CANONICAL_BASE|site_url|base_url)["']?\s*[:=]\s*["'`](https?://[a-z0-9.-]+\.[a-z]{2,})""", re.I)
    hits: dict[str, int] = defaultdict(int)
    for rel in _git_files(["*.py", "*.ts", "*.js", "*.mjs", "*.toml", "*.yaml", "*.yml", "CLAUDE.md", ".claude/commands/*.md"])[:4000]:
        try:
            for u in rx.findall((ROOT / rel).read_text(errors="replace")[:200_000]):
                if re.search(r"//(api|v\d|www\.googleapis)\.|localhost|example\.com|semrush|openstates|supabase|resend|stripe|github|googleapis|dataforseo|ahrefs", u):
                    continue
                if not re.search(r"onrender\.com|layer3labs\.io", u) or ROOT.name.startswith("layer3"):
                    hits[u.rstrip("/")] += 1
        except Exception:
            continue
    return max(hits, key=hits.get) if hits else None


def _fetch(url: str, timeout: int = 10) -> str:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (coverage_lookup)"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read(4_000_000).decode("utf-8", "replace")
    except Exception:
        return ""


def live_sitemap_paths(site_url: str) -> list[str]:
    """Every page path in the live sitemap (follows sitemap indexes, max 60 files)."""
    seen, queue, out = set(), [], []
    robots = _fetch(f"{site_url}/robots.txt", 6)
    queue += re.findall(r"(?im)^sitemap:\s*(\S+)", robots)
    queue += [f"{site_url}/sitemap-index.xml", f"{site_url}/sitemap_index.xml", f"{site_url}/sitemap.xml"]
    while queue and len(seen) < 60:
        u = queue.pop(0)
        if u in seen:
            continue
        seen.add(u)
        for loc in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", _fetch(u)):
            (queue if loc.split("?")[0].endswith(".xml") else out).append(loc)
    return [re.sub(r"^https?://[^/]+", "", l).rstrip("/") or "/" for l in out]


def published_routes(site_url: str | None) -> dict[str, dict]:
    """route -> {route, title, keywords, in_sitemap/in_index} from local search index +
    local sitemaps + the live sitemap."""
    routes: dict[str, dict] = {}
    idx = ROOT / "public" / "search-index.json"
    if idx.exists():
        try:
            for e in json.loads(idx.read_text()):
                u = e.get("u", "") if isinstance(e, dict) else ""
                if u:
                    routes[u] = {"route": u, "title": e.get("t", ""), "keywords": e.get("k", ""), "in_index": True}
        except Exception:
            pass
    paths = []
    if (ROOT / "public").exists():
        for x in (ROOT / "public").glob("**/sitemap*.xml"):
            paths += [re.sub(r"^https?://[^/]+", "", l).rstrip("/") or "/"
                      for l in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", x.read_text(errors="replace"))]
    if site_url and len(paths) < 20:          # no usable local sitemap (built at deploy, or db-backed) → read the live one
        paths += live_sitemap_paths(site_url.rstrip("/"))
    for path in paths:
        if path.endswith(".xml"):
            continue
        routes.setdefault(path, {"route": path, "title": "", "keywords": "", "in_index": False})["in_sitemap"] = True
    return routes


def live_meta(url: str) -> tuple[str, str]:
    html = _fetch(url, 8)[:200_000]
    t = re.search(r"<title[^>]*>(.*?)</title>", html, re.S | re.I)
    d = re.search(r"""<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)""", html, re.I) \
        or re.search(r"""<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']""", html, re.I)
    clean = lambda x: re.sub(r"\s+", " ", x).replace("&amp;", "&").replace("&#39;", "'").replace("&quot;", '"').strip()
    return (clean(t.group(1)) if t else "", clean(d.group(1)) if d else "")


def redirects() -> list[tuple[str, str]]:
    out: list[tuple[str, str]] = []
    cfg = ROOT / "next.config.js"
    if cfg.exists():
        out += REDIRECT_RE.findall(cfg.read_text(errors="replace"))
    rd = ROOT / "public" / "_redirects"
    if rd.exists():
        for line in rd.read_text(errors="replace").splitlines():
            parts = line.split()
            if len(parts) >= 2 and parts[0].startswith("/") and not line.lstrip().startswith("#"):
                out.append((parts[0], parts[1]))
    vj = ROOT / "vercel.json"
    if vj.exists():
        try:
            out += [(r.get("source", ""), r.get("destination", "")) for r in json.loads(vj.read_text()).get("redirects", [])]
        except Exception:
            pass
    for cfg in ("astro.config.mjs", "astro.config.ts"):
        f = ROOT / cfg
        if f.exists():
            m = re.search(r"redirects\s*:\s*\{(.*?)\n\s*\}", f.read_text(errors="replace"), re.S)
            if m:
                out += re.findall(r"""["'](/[^"']*)["']\s*:\s*["'](/[^"']*)["']""", m.group(1))
    return out


def past_chart_lines() -> list[tuple[str, str, str]]:
    """(chart file, section, line) for every table row / exclusion line in past charts."""
    out = []
    for md in sorted((ROOT / "reports" / "mindmap-pass").glob("*.md")):
        section = "table"
        for line in md.read_text(errors="replace").splitlines():
            if line.startswith("## "):
                section = "exclusions" if "xclusion" in line else "table"
                continue
            if line.startswith("| ") and not line.startswith("| ---") and not re.match(r"\|\s*(#|problem|Cluster)\b", line, re.I):
                out.append((md.name, section, line))
            elif section == "exclusions" and line.strip().startswith(("-", "*")):
                out.append((md.name, section, line))
    return out


def git_grep(term: str, n: int = 8) -> list[str]:
    try:
        r = subprocess.run(["git", "log", "--oneline", f"-n{n}", "-i", f"--grep={term}"],
                           cwd=ROOT, capture_output=True, text=True, timeout=20)
        return [l for l in r.stdout.splitlines() if l.strip()]
    except Exception:
        return []


# ---------------------------------------------------------------- candidates

def parse_chart(path: Path, all_rows: bool) -> list[dict]:
    """Read every chart table by its HEADER names, so both chart formats work: the
    numbered one (`| # | problem | solution | bucket | target | ...`) and the plain one
    (`| problem | solution | bucket | target | ...`, used by hype / x-trends / trend-pass /
    keyword-gap charts). The clusters block (`| Cluster (theme) | Member queries | ... |
    Lever | Target |`) is read too; a route already taken from the main table is skipped."""
    cands, seen, cols = [], set(), None
    def cell(cells, *names):
        for n in names:
            if n in cols and cols[n] < len(cells):
                return cells[cols[n]]
        return ""
    for line in path.read_text(errors="replace").splitlines():
        if not line.startswith("|"):
            if line.startswith("#"):        # a new section ends the table; blank/prose lines inside a table do not
                cols = None
            continue
        if re.match(r"^\|\s*:?-{3,}", line):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        low = [re.sub(r"[^a-z_ ]", "", c.lower()).strip() for c in cells]
        if ("target" in low) and ({"bucket", "lever"} & set(low)):
            cols = {name: i for i, name in enumerate(low)}
            continue
        if cols is None:
            continue
        bucket = cell(cells, "bucket", "lever")
        if not all_rows and "create new content" not in bucket.lower():
            continue
        target, solution = cell(cells, "target"), cell(cells, "solution")
        route = ""
        for c in (target, solution):
            m = re.search(r"(?<![\w./])(/[a-z0-9][a-z0-9/-]*)(?![\w.])", c)
            if m:
                route = m.group(1).rstrip("/")
                break
        if route and route in seen:
            continue
        seen.add(route)
        problem = cell(cells, "problem", "cluster theme", "cluster")
        members = cell(cells, "member queries")
        kw = re.findall(r"[\"“`]([^\"”`]{3,80})[\"”`]", problem)
        kw = [k for k in kw if not k.startswith("/")]
        if not kw and members:
            kw = [m.strip() for m in members.split(";") if m.strip()][:3]
        cands.append({"route": route, "keyword": "; ".join(kw[:3]) or last_segment(route).replace("-", " "),
                      "question": cell(cells, "reader_question", "reader question"), "bucket": bucket,
                      "row": cells[0] if cells and cells[0].isdigit() else str(len(cands) + 1)})
    return cands


def parse_candidate_arg(s: str) -> dict:
    parts = [p.strip() for p in s.split("|")]
    while len(parts) < 3:
        parts.append("")
    return {"route": parts[0], "keyword": parts[1], "question": parts[2], "bucket": "create new content", "row": "-"}


# ---------------------------------------------------------------- matching

def candidate_terms(c: dict) -> tuple[list[str], set[str]]:
    """Topic terms come from the route + keyword (the question is mostly filler);
    format cues come from all three."""
    t = tokens(last_segment(c["route"]).replace("-", " ")) + tokens(c["keyword"])
    seen, out = set(), []
    for w in t:
        if w not in seen:
            seen.add(w); out.append(w)
    q = re.sub(r"\[.*?\]", "", c["question"])
    return out, formats(last_segment(c["route"]).replace("-", " ")) | formats(c["keyword"]) | formats(q)


def score(cand_terms: list[str], cand_formats: set[str], page_text: str) -> tuple[float, list[str], set[str]]:
    """Share of the candidate's topic terms found in the page's slug/title/h1, the shared
    terms, and the shared format cues (reported, and used only to break ties)."""
    if not cand_terms:
        return 0.0, [], set()
    pt = set(tokens(page_text))
    shared = [w for w in cand_terms if w in pt]
    return len(shared) / len(cand_terms), shared, cand_formats & formats(page_text)


def lookup(c: dict, data_pages: dict, routes: dict, rds: list, chart_lines: list, others: list[dict]) -> dict:
    terms, fmts = candidate_terms(c)
    slug = last_segment(c["route"])
    need = 1 if len(terms) <= 2 else 2          # shared topic terms required
    cand_v = versions(terms)
    matches = []
    for p in data_pages.values():
        text = f"{p['slug'].replace('-', ' ')} {p['title']} {p['h1']}"
        sc, shared, shared_f = score(terms, fmts, text)
        exact = p["slug"] == slug
        slug_terms = set(tokens(p["slug"].replace("-", " ")))
        pv = versions(slug_terms)
        if not exact and cand_v and pv and not (cand_v & pv):
            continue                                # same family, different version = different model
        # parent page: its slug's topics (≥2 of them, a real share of the candidate's) all sit inside the
        # candidate's — /claude-dashboards is the parent of claude-dashboards-vs-power-bi; a bare /claude-pricing is not
        parent = (not exact and len(slug_terms) >= 2 and slug_terms < set(terms)
                  and len(slug_terms) >= 0.4 * len(terms))
        if exact or parent or (len(shared) >= need and sc >= 0.5):
            route = ROUTE_BY_SLUG.get(p["slug"])
            if route is None:
                route = next((pre for key, pre in PREFIX_BY_FILE if key in p["file"]), "/") + p["slug"]
            matches.append({"route": route, "file": p["file"], "title": p["title"] or p["h1"], "desc": p["desc"],
                            "score": round(sc, 2), "shared": shared, "formats": sorted(shared_f), "exact_slug": exact,
                            "parent": parent, "extra": len(slug_terms - set(terms)),
                            "published": bool(routes.get(route, {}).get("in_sitemap") or routes.get(route, {}).get("in_index"))})
    known = {m["route"] for m in matches}
    for r, info in routes.items():          # published routes the data files don't know (static/tool/db pages)
        if r in known:
            continue
        text = f"{last_segment(r).replace('-', ' ')} {info.get('title', '')} {info.get('keywords', '')}"
        sc, shared, shared_f = score(terms, fmts, text)
        rv = versions(tokens(last_segment(r).replace("-", " ")))
        if last_segment(r) != slug and cand_v and rv and not (cand_v & rv):
            continue
        if last_segment(r) == slug or (len(shared) >= need and sc >= 0.5):
            matches.append({"route": r, "file": "(sitemap only)", "title": info.get("title", ""), "desc": "",
                            "score": round(sc, 2), "shared": shared, "formats": sorted(shared_f),
                            "exact_slug": last_segment(r) == slug, "parent": False,
                            "extra": len(set(tokens(last_segment(r).replace("-", " "))) - set(terms)), "published": True})
    # rank: exact slug → topic share → the page whose slug adds the fewest OTHER topics → same format;
    # a PARENT page is always kept in the list even when weaker matches would push it out
    matches.sort(key=lambda m: (not m["exact_slug"], -m["score"], m["extra"], -len(m["formats"])))
    top = matches[:8]
    for m in matches[8:]:
        if m["parent"] and len([x for x in top if x["parent"]]) < 2:
            top.append(m)
    matches = top
    if SITE_URL:                       # sitemap-only pages (db-backed / static routes): read their live head
        for m in matches:
            if not m["title"] and m["published"]:
                m["title"], m["desc"] = live_meta(SITE_URL + m["route"])
                m["file"] += " · title fetched live"

    red = [(src, d) for src, d in rds if len([w for w in terms if w in tokens(src.replace("-", " "))]) >= need]
    past = []
    phrase = c["keyword"].split(";")[0].strip().lower()
    for fname, section, line in chart_lines:
        lt = set(tokens(line))
        hit = [w for w in terms if w in lt]
        if (slug and slug in line) or (phrase and len(phrase) > 3 and phrase in line.lower()) \
                or (len(terms) > 1 and len(hit) >= need):
            past.append({"chart": fname, "section": section, "line": re.sub(r"\s+", " ", line)[:220]})
    past = past[-6:]
    commits = git_grep(slug) if slug else []
    if not commits and phrase and " " in phrase:
        commits = git_grep(phrase)
    same_run = []
    for o in others:
        if o is c:
            continue
        sc, shared, _ = score(terms, fmts, f"{last_segment(o['route']).replace('-', ' ')} {o['keyword']}")
        if len(shared) >= need and sc >= 0.5:
            same_run.append({"route": o["route"], "row": o["row"], "score": round(sc, 2)})
    return {"candidate": c, "terms": terms, "formats": sorted(fmts), "matches": matches, "redirects": red,
            "past_charts": past, "commits": commits[:6], "same_run": same_run}


# ---------------------------------------------------------------- output

def render(res: dict) -> str:
    c = res["candidate"]
    out = [f"### {c['route'] or '(no route)'}  — row {c['row']} · {c['bucket']}",
           f"keyword: {c['keyword']}",
           f"reader question (new page intent): {c['question'] or '(none recorded)'}",
           f"lookup terms: {' '.join(res['terms'])}   format cues: {' '.join(res['formats']) or '-'}", ""]
    if res["matches"]:
        out.append("Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:")
        for m in res["matches"]:
            flags = ("EXACT SLUG · " if m["exact_slug"] else "") + ("PARENT PAGE · " if m.get("parent") else "") \
                + ("in sitemap" if m["published"] else "NOT IN SITEMAP (unreleased, or live but missing from the sitemap)")
            fmt = f" · same format: {' '.join(m['formats'])}" if m["formats"] else ""
            out.append(f"- {m['route']}  [{flags} · {m['file']} · topic match {m['score']} on {' '.join(m['shared']) or '-'}{fmt}]")
            if m["title"]:
                out.append(f"    title: {m['title']}")
            if m["desc"]:
                out.append(f"    desc:  {m['desc'][:240]}")
    else:
        out.append("Possible existing homes: none found in the repo page data, the search index or the sitemaps.")
    out.append("")
    out.append("Redirects (topic deliberately merged elsewhere): " + ("; ".join(f"{s} → {d}" for s, d in res["redirects"]) if res["redirects"] else "none"))
    if res["past_charts"]:
        out.append("Past mindmap charts mentioning these terms:")
        out += [f"- {p['chart']} [{p['section']}] {p['line']}" for p in res["past_charts"]]
    else:
        out.append("Past mindmap charts mentioning these terms: none")
    out.append("Commits naming the topic: " + ("; ".join(res["commits"]) if res["commits"] else "none"))
    out.append("Same run overlap: " + ("; ".join(f"row {s['row']} {s['route']} ({s['score']})" for s in res["same_run"]) if res["same_run"] else "none"))
    return "\n".join(out) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--chart", type=Path)
    ap.add_argument("--candidate", action="append", default=[], help='"route|keyword|reader question" (repeatable)')
    ap.add_argument("--all-rows", action="store_true")
    ap.add_argument("--site-url", help="site origin, e.g. https://www.example.com (auto-detected when omitted)")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    cands = [parse_candidate_arg(s) for s in a.candidate]
    if a.chart:
        cands += parse_chart(a.chart, a.all_rows)
    if not cands:
        print("no candidates (use --chart or --candidate)", file=sys.stderr)
        return 0
    global SITE_URL, ROUTE_BY_SLUG
    SITE_URL = (a.site_url or detect_site_url() or "").rstrip("/") or None
    data_pages = pages_from_data()
    routes = published_routes(SITE_URL)
    ROUTE_BY_SLUG = {}
    for r in routes:
        ROUTE_BY_SLUG.setdefault(last_segment(r), r)
    rds = redirects()
    chart_lines = past_chart_lines()
    results = [lookup(c, data_pages, routes, rds, chart_lines, cands) for c in cands]
    if a.json:
        print(json.dumps(results, indent=1))
    else:
        print(f"coverage_lookup: {len(cands)} candidate(s) vs {len(data_pages)} repo pages / {len(routes)} sitemap routes ({SITE_URL or 'no live sitemap'}) / {len(rds)} redirects / {len(chart_lines)} past-chart lines\n")
        for r in results:
            print(render(r))
    return 0


if __name__ == "__main__":
    sys.exit(main())
