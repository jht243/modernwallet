#!/usr/bin/env python3
"""Build one ready-to-work packet per dropped page, so writers start writing.

The 2026-10-04 live run spent ~7 of a page's ~9 minutes on rediscovery: finding
the page's entry in a 100k-line data file, re-reading 124 KB of standards,
grepping for successor routes, copying a contract from another routine's
reports, and assembling a system prompt. Everything deterministic now happens
here, once, for every page, in seconds — before any writer starts.

Per page (reports/rank-drop/<date>/packets/<slug>/):
  page.ts       the page's data entry, exactly as it sits in the repo
  packet.json   path, data file + 1-based line range, lost searches, classes,
                takers (cannibalization), successor-route candidates, pricing
                rows for the models the page names, triage hint, worktree path
Shared (reports/rank-drop/<date>/packets/):
  routes.txt         every live route (from the committed sitemaps)
  writer-rules.md    WRITER sections of the canonical standards (extracted now)
  auditor-rules.md   AUDITOR sections of the canonical standards
  queue.json         the ordered work list (cooldown + UNSTABLE-only removed)
  system-<datafile>.md  one content_gen system prompt per page type (shared → cached)

No network. Reads the provenance-checked detection report only.

Usage: scripts/rank_drop/prepare_pages.py --detect reports/rank-drop/<date>.json \\
         --ledger reports/rank-drop/ledger.jsonl --out reports/rank-drop/<date>/packets
"""

import argparse
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
COOLDOWN_DAYS = 28
FAMILY = re.compile(r"(gpt|claude|opus|sonnet|haiku|fable|mythos|kimi|gemini|qwen|glm|deepseek|grok|"
                    r"llama|mistral|astra|sol|terra|luna|codex|copilot|cursor|muse|laya|jev|instinct)")
VERSION = re.compile(r"(?<![a-z])(\d+)(?:-(\d+))?(?![a-z0-9])")


# ── locating a page's entry in data/*.ts ──────────────────────────────────

def object_span(src: str, pos: int) -> tuple[int, int]:
    """Span of the innermost { ... } object containing `pos` (string/comment-aware)."""
    stack, i, n, quote = [], 0, len(src), None
    target = None
    while i < n:
        if i == pos and target is None:
            if not stack:
                raise ValueError("slug is not inside an object")
            target = len(stack)            # depth of the owning object
        c = src[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "'\"`":
            quote = c
        elif src.startswith("//", i):
            j = src.find("\n", i)
            i = n if j < 0 else j
            continue
        elif src.startswith("/*", i):
            j = src.find("*/", i + 2)
            i = n if j < 0 else j + 2
            continue
        elif c == "{":
            stack.append(i)
        elif c == "}":
            start = stack.pop()
            if target is not None and len(stack) == target - 1:
                return start, i + 1
        i += 1
    raise ValueError("unbalanced braces")


def find_entry(slug: str, data_files: list[Path]) -> tuple[Path, int, int, str] | None:
    pat = re.compile(r"""["']?slug["']?\s*:\s*["']""" + re.escape(slug) + r"""["']""")
    # A page's slug also appears inside OTHER pages' entries (gear "related product" cards). The first
    # match can be a 400-char card, not the page (2026-10-05: a meta edit for a gear review looked for
    # metaTitle in a card). The page's own entry is the LARGEST object owning that slug key.
    best = None
    for f in data_files:
        src = f.read_text()
        for m in pat.finditer(src):
            try:
                a, b = object_span(src, m.start())
            except ValueError:
                continue
            if best is None or (b - a) > (best[2] - best[1]):
                best = (f, a, b, src)
        if best is not None:
            break                                   # a page lives in one data file
    if best is None:
        return None
    f, a, b, src = best
    return f, src.count("\n", 0, a) + 1, src.count("\n", 0, b) + 1, src[a:b]


# ── helpers ───────────────────────────────────────────────────────────────

def routes() -> list[str]:
    out = set()
    for sm in sorted((ROOT / "public").glob("sitemap-*.xml")):
        try:
            for loc in ET.parse(sm).getroot().iter():
                if loc.tag.endswith("loc") and loc.text:
                    p = re.sub(r"^https?://[^/]+", "", loc.text.strip()).rstrip("/") or "/"
                    out.add(p)
        except ET.ParseError:
            continue
    if not out:                                   # dynamic sitemap (Flask / Astro build output): read it live
        import urllib.request
        from siteconf import site
        todo, seen = [site()["base_url"].rstrip("/") + "/sitemap.xml"], set()
        while todo and len(seen) < 40:
            u = todo.pop()
            if u in seen:
                continue
            seen.add(u)
            try:
                req = urllib.request.Request(u, headers={"User-Agent": "rank-drop/1.0"})
                root = ET.fromstring(urllib.request.urlopen(req, timeout=30).read())
            except Exception:  # noqa: BLE001
                continue
            for loc in root.iter():
                if loc.tag.endswith("loc") and loc.text:
                    t = loc.text.strip()
                    if t.endswith(".xml"):
                        todo.append(t)
                    else:
                        out.add(re.sub(r"^https?://[^/]+", "", t).rstrip("/") or "/")
    return sorted(out)


def versions(text: str) -> dict[str, float]:
    """family -> highest version mentioned in a slug, e.g. gpt-5-6 -> {'gpt': 5.6}."""
    toks = text.lower().split("-")
    out: dict[str, float] = {}
    for i, t in enumerate(toks):
        if FAMILY.fullmatch(t) and i + 1 < len(toks):
            m = re.fullmatch(r"k?(\d+)", toks[i + 1])
            if m:
                v = float(m.group(1))
                if i + 2 < len(toks) and toks[i + 2].isdigit() and len(toks[i + 2]) <= 2:
                    v = float(f"{m.group(1)}.{toks[i + 2]}")
                out[t] = max(out.get(t, 0), v)
    return out


def successors(path: str, all_routes: list[str]) -> list[str]:
    mine = versions(path.rsplit("/", 1)[-1])
    if not mine:
        return []
    hits = []
    for r in all_routes:
        theirs = versions(r.rsplit("/", 1)[-1])
        if any(f in theirs and theirs[f] > v for f, v in mine.items()):
            hits.append(r)
    return hits[:25]


def pricing_rows(text: str) -> list[str]:
    """Ledger rows for every model the page names, PLUS every row of the same family the page names (vendor line
    minus the version: "Claude Opus 4.8" -> "Claude Opus"), newest first. 2026-10-04: the writing
    page named only Fable 5 / Opus 4.8, so its writer never saw Fable 5.1 / Opus 5.5 and priced a
    two-releases-old pair as current."""
    f = ROOT / "data" / "pricing.ts"
    if not f.exists():
        return []
    low = text.lower()
    lines = [l.strip() for l in f.read_text().splitlines() if re.search(r"model:\s*'[^']+'", l)]
    def model(l): return re.search(r"model:\s*'([^']+)'", l).group(1)
    def family(m): return re.sub(r"[\s-]*v?\d[\w.]*.*$", "", m).strip().lower()
    def eff(l):
        d = re.search(r"effectiveDate:\s*'([^']+)'", l)
        return d.group(1) if d else ""
    named = [l for l in lines if model(l).lower() in low]
    fams = {fm for fm in (family(model(l)) for l in lines)
            if len(fm.split()) >= 2 and re.search(r"\b" + re.escape(fm) + r"\b", low)}  # "Claude Opus" alone counts
    def ver(l):                                  # "Claude Opus 5.5" -> (5, 5); newest version first
        m = re.search(r"(\d+(?:\.\d+)*)", model(l)[len(family(model(l))):] or "")
        return tuple(int(x) for x in m.group(1).split(".")) if m else (0,)
    kin = [l for l in lines if l not in named and family(model(l)) in fams]
    rows = named + kin
    rows.sort(key=lambda l: (family(model(l)), ver(l), eff(l)), reverse=True)  # each family newest first
    return rows[:40]


def section(md: str, start: str, stops: tuple[str, ...]) -> str:
    out, on = [], False
    for line in md.splitlines():
        if line.startswith("## "):
            if line.startswith(start):
                on = True
            elif on and line.startswith(stops):
                on = False
        if on:
            out.append(line)
    return "\n".join(out).strip()


def plain_text(src: str) -> str:
    """The entry as readable text: '# h1', intro paragraphs, '## heading' + paragraphs, FAQ Q/A."""
    out = []
    for line in src.splitlines():
        m = re.match(r"""\s*["']?(\w+)["']?\s*:\s*(["'])((?:\\.|(?!\2).)*)\2""", line)
        if m:
            key, val = m.group(1), m.group(3).replace("\\'", "'").replace('\\"', '"')
            if key == "h1":
                out.append(f"# {val}")
            elif key == "heading":
                out.append(f"\n## {val}")
            elif key == "question":
                out.append(f"\n**Q: {val}**")
            elif key in ("answer", "subtitle", "callout", "verdict"):
                out.append(val)
            continue
        m = re.match(r"""\s*(["'])((?:\\.|(?!\1).)*)\1,?\s*$""", line)       # array item: a paragraph
        if m:
            out.append(m.group(2).replace("\\'", "'").replace('\\"', '"'))
    return "\n".join(out).strip() + "\n"


def pick_voice(data_file: Path, editing: set[str]) -> str | None:
    """First entry in the file with 4+ sections whose slug is not being edited this run."""
    src = data_file.read_text()
    for m in re.finditer(r"""["']?slug["']?\s*:\s*["']([^"']+)["']""", src):
        if m.group(1) in editing:
            continue
        a, b = object_span(src, m.start())
        entry = src[a:b]
        if len(re.findall(r"""["']?heading["']?\s*:""", entry)) >= 4:
            return entry
    return None


def build_rules(out: Path):
    C = ROOT / ".claude" / "commands"
    anti = (C / "_anti-ai-language.md").read_text()
    std = (C / "_content-standard.md").read_text()
    writer = [section(anti, "## WRITER", ("## AUDITOR",))]
    for h in ("## DEFEND-LOCK", "## INTENT", "## STYLE", "## VOICE", "## COMPARISON",
              "## LINKS", "## ANCHOR", "## NEUTRALITY"):
        writer.append(section(std, h, ("## ",)))
    exp = C / "_experience.md"
    if exp.exists():
        writer.append("## EXPERIENCE (only source for first-person claims)\n\n" + exp.read_text().strip())
    (out / "writer-rules.md").write_text("\n\n".join(w for w in writer if w) + "\n")
    auditor = [section(anti, "## AUDITOR", ("## SCOPE",)), section(std, "## AUDITOR", ("## INTRO", "## SCOPE"))]
    (out / "auditor-rules.md").write_text("\n\n".join(a for a in auditor if a) + "\n")


def in_cooldown(ledger: Path) -> set[str]:
    if not ledger.exists():
        return set()
    cool = set()
    for line in ledger.read_text().splitlines():
        if not line.strip():
            continue
        r = json.loads(line)
        if r.get("status") in ("published", "reverted") and \
                (date.today() - date.fromisoformat(r["treated"])).days < COOLDOWN_DAYS:
            cool.add(r["page"])
    return cool


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--detect", required=True)
    ap.add_argument("--ledger", default="reports/rank-drop/ledger.jsonl")
    ap.add_argument("--out", required=True)
    ap.add_argument("--worktree-root", default="/tmp/rank-drop-wt")
    a = ap.parse_args(argv)

    if subprocess.run([sys.executable, str(HERE / "verify_provenance.py"), a.detect]).returncode:
        return 20
    rep = json.load(open(a.detect))
    out = Path(a.out)
    if (out / "queue.json").exists():
        # a second run on the same day must never reuse the first run's packets (2026-10-05: the
        # 20:53 run inherited the 16:57 run's drafts and plans → "section already exists", SKIP done)
        print(f"REFUSED: {out} already holds a run's packets; use a fresh --out "
              f"(the skill sets P to <date>-<HHMM>/packets when <date>/packets exists)", file=sys.stderr)
        return 3
    out.mkdir(parents=True, exist_ok=True)
    from siteconf import backend, site
    B = backend()
    has_ledger = bool(site().get("price_ledger"))
    all_routes = routes()
    (out / "routes.txt").write_text("\n".join(all_routes) + "\n")
    build_rules(out)
    contract = HERE / "contract-section.md"
    cool = in_cooldown(Path(a.ledger))

    queue, skipped = [], []
    for p in rep["pages"]:
        cooling = p["page"] in cool   # still prepared: a wrong price is corrected even inside cooldown (L2 only)
        if set(p["classes"]) <= {"UNSTABLE"}:
            skipped.append({"path": p["path"], "why": "unstable-only"})
            continue
        page = B.locate(p["path"])
        if not page:
            skipped.append({"path": p["path"], "why": f"page source not found by the {site()['backend']} backend"})
            continue
        slug, src = page.slug, page.native
        d = out / slug
        d.mkdir(exist_ok=True)
        (d / ("page.ts" if site()["backend"] == "ts_entries" else "page.src")).write_text(src)
        succ = successors(p["path"], all_routes)
        takers = sorted({q["taker"] for q in p["pairs"] if q.get("taker")})
        classes = p["classes"]
        hint = ("REFRESH" if succ and classes.get("VANISHED", 0) >= classes.get("RANKING_LOSS", 0)
                else "DIFFERENTIATE" if takers and classes.get("CANNIBALIZED", 0) >= classes.get("RANKING_LOSS", 0)
                else "RECOVER")
        packet = {
            "path": p["path"], "url": p["page"], "slug": slug,
            "data_file": page.files[0], "files": page.files, "page_key": page.key, "kind": page.kind,
            "lane_hint": hint, "classes": classes,
            "lost_searches": [{k: q[k] for k in ("query", "class", "market", "base_pos", "cur_pos",
                                                  "base_impr_d", "cur_impr_d", "taker")}
                              for q in p["pairs"][:10]],
            "successor_routes": succ, "taker_routes": takers,
            "pricing_rows": pricing_rows(src) if has_ledger else [],
            "traffic": {"gsc_clicks_d": p["gsc_page_clicks_d"], "ga4_sessions_d": p["ga4_organic_sessions_d"]},
            "worktree": f"{a.worktree_root}/{slug}",
            "detect_sha256": rep["provenance"]["sha256"],
            "cooldown": cooling,
        }
        packet["sections"] = B.headings(page)
        packet["title"] = page.title
        packet["description"] = page.extra.get("description", "")
        # the page's CURRENT text, plain — what content_gen's --page expects (Enrichment chapter)
        (d / "page.md").write_text(B.text(page))
        packet["system"] = str(out / ("system-" + re.sub(r"[^\w-]+", "-", page.kind or "page") + ".md"))
        (d / "packet.json").write_text(json.dumps(packet, indent=2))
        queue.append({"slug": slug, "path": p["path"], "lane_hint": hint,
                      "data_file": packet["data_file"], "kind": page.kind})

    # One system.md per page type, built the mindmap-pass way (phase-3 Step 1): the voice sample is a
    # REAL published page of the same type that is NOT being edited this run. Shared per type, so
    # Gemini caches it after the first call.
    editing = {q["slug"] for q in queue}
    for kind in sorted({q.get("kind") or "page" for q in queue}):
        tag = re.sub(r"[^\w-]+", "-", kind)
        sysf = out / ("system-" + tag + ".md")
        # No DB connection in the cloud → no voice sample from the backend; fall back to a page of this
        # type being edited (still real published text) so a system prompt ALWAYS exists.
        voice = B.voice_sample(kind, editing) or next(
            ((out / q["slug"] / "page.md").read_text() for q in queue
             if (q.get("kind") or "page") == kind and (out / q["slug"] / "page.md").exists()), None)
        if voice:
            vf = out / ("voice-" + tag + ".txt")
            vf.write_text(voice)
            r = subprocess.run([sys.executable, str(ROOT / "scripts/lib/content_gen.py"), "system",
                                "--voice", str(vf), "--contract", str(contract), "--out", str(sysf)],
                               capture_output=True, text=True)
            if r.returncode or not sysf.exists():
                print(f"WARN system prompt for {kind} not built: {(r.stderr or r.stdout)[-300:]}", file=sys.stderr)
    base = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    (out / "queue.json").write_text(json.dumps({"queue": queue, "skipped": skipped, "base_sha": base}, indent=2))
    print(f"OK packets={len(queue)} skipped={len(skipped)} → {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
