#!/usr/bin/env python3
"""Diagnose why each picked page is shown but not clicked — code only, no model call.

Writes <slug>/diagnosis.json in rank-drop's shape ({level, label, needs, evidence}) so the shared
planner → generate → splice → audit pipeline runs unchanged, plus `lane`, `fact_check`, and
`internal_proof_gap` on commercial/product pages.

Internal-proof gap detection (commercial/product pages on non-YMYL sites):
  - Checks whether the page already carries:
    1. a 3-scenario cost/workload/spec breakdown (`missing_three_scenario_breakdown`),
    2. an explicit break-even counterexample (`missing_counterexample`),
    3. a link to a matching site calculator/tool from `routes.txt` (`matching_calculators`),
    4. a wired Publisher's Take / Editor's Note in the site's ReviewerNote store (`missing_publishers_take`,
       skipped automatically on the 4 physician-reviewed medical sites).
  - Never triggers on `FACTS` top-pages lane, `ymyl: true` sites, or biographical/about/legal pages.
  - Flags `amazon_no_price: true` on `/gear/` or Amazon hardware pages so zero dollar prices (`$`) are added.
"""

import argparse
import json
import os
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
os.environ.setdefault("RD_ENGINE", "page-1-2-no-clicks-pass")
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "rank_drop"))
from diagnose import LEVELS, STR, covered, norm, page_text, pricing, stale_prices  # noqa: E402
from siteconf import site as _site_cfg  # noqa: E402

PRICE_INTENT = re.compile(r"\b(pric\w*|cost\w*|plans?|subscription|tiers?|free|trial|how much|fees?|per month)\b", re.I)
COMMERCIAL_RE = re.compile(
    r"\b(vs|versus|alternative\w*|pric\w*|cost\w*|worth\s+it|review\w*|best\b|compare|comparison|software|"
    r"platform\w*|tool\w*|app\w*|gear|calculator\w*|plan\w*|subscription\w*|spec\w*|model\w*|buy\w*|"
    r"sizing|dimensions?|filter\w*|purifier\w*|detector\w*|razor\w*|blade\w*|cigar\w*|humidor\w*|"
    r"stroller\w*|crib\w*|pack\w*|ruck\w*|charter\w*|jet\w*|esim\w*|wallet\w*|exchange\w*|fee\w*)\b",
    re.I,
)
EXEMPT_PATH_RE = re.compile(r"^/(about|people|authors?|editorial|privacy|terms|contact|methodology|law|legal)/", re.I)
COUNTEREXAMPLE_RE = re.compile(
    r"\b(skip\s+if|do\s+not\s+(?:buy|switch|use|choose)|don't\s+(?:buy|switch|use|choose)|"
    r"wrong\s+(?:choice|fit|pick)|better\s+off\s+with|stays?\s+cheaper|break-even|breaks?\s+even|"
    r"overkill\s+(?:if|for|when)|stick\s+with|unless\s+you|stop\s+making\s+sense|loses\s+on\s+cost)\b",
    re.I,
)
SCENARIO_RE = re.compile(
    r"(\bthree\s+scenarios?\b|\bscenario\s+[123abc]\b|\bsolo\b.*\bteam\b|\bsmall\b.*\bmid[-\s]?size\b|"
    r"\blight\b.*\bheavy\b|\b10[-,\s]*seat|\b50[-,\s]*seat|\b100[-,\s]*seat)",
    re.I | re.S,
)
CALC_ROUTE_RE = re.compile(
    r"(/tools?/|/calculators?/|-calculator\b|-estimator\b|-checker\b|-converter\b|-sizer\b|-finder\b|-grader\b)",
    re.I,
)
MONEY = re.compile(r"\$\s?(\d{1,4}(?:,\d{3})*(?:\.\d{1,2})?)")
OPENING_CHARS = 700
MIN_INBOUND = 3
MEDICAL_NO_QUOTE_REPOS = {"longevitybenchmark", "medicalfrontier", "metabolic_journal", "psych_report"}


def money(t: str) -> set[float]:
    return {float(x.replace(",", "")) for x in MONEY.findall(t or "")}


def paa_missing(paa: list[str], body_t: set[str], squashed: str) -> list[str]:
    return [q for q in paa if covered(q, body_t, squashed) < 0.6]


def _load_reviewer_note_routes() -> set[str]:
    routes: set[str] = set()
    for rel in ("src/utils/reviewerNotes.ts", "src/data/reviewer-notes.ts", "lib/reviewer-notes.ts", "src/reviewer_notes.py"):
        f = ROOT / rel
        if not f.exists():
            continue
        txt = f.read_text(encoding="utf-8", errors="ignore")
        for m in re.finditer(r"""["'](/[^"']+)["']\s*:""", txt):
            routes.add("/" + m.group(1).strip("/"))
    return routes


def _find_matching_calculators(path: str, q: str, all_routes: list[str], raw_src_and_md: str) -> tuple[bool, list[str]]:
    calc_routes = [r for r in all_routes if CALC_ROUTE_RE.search(r) and r.rstrip("/") != path.rstrip("/")]
    if not calc_routes:
        return True, []
    already_linked = any(r in raw_src_and_md for r in calc_routes)
    if already_linked:
        return True, []
    page_toks = set(norm(path.replace("/", " ") + " " + q)) - {"guide", "guides", "comparison", "comparisons", "alternatives"}
    scored = []
    for r in calc_routes:
        rtoks = set(norm(r.replace("/", " ")))
        ov = len(page_toks & rtoks)
        scored.append((-ov, len(r), r))
    scored.sort()
    top = [r for neg_ov, _, r in scored[:3] if -neg_ov >= 1] or [r for _, _, r in scored[:2]]
    return False, top


def _check_internal_proof_gap(pk: dict, src: str, md: str, all_routes: list[str], note_routes: set[str]) -> dict | None:
    cfg = _site_cfg()
    if cfg.get("ymyl") or ROOT.name in MEDICAL_NO_QUOTE_REPOS:
        return None
    path = "/" + (pk.get("path") or "").strip("/")
    if EXEMPT_PATH_RE.search(path):
        return None
    q = (pk.get("page12") or {}).get("main_query") or ""
    is_commercial = bool(
        COMMERCIAL_RE.search(path)
        or COMMERCIAL_RE.search(q)
        or any(path.startswith(p) for p in ("/comparisons/", "/compare/", "/alternatives/", "/gear/", "/reviews/", "/cost/", "/pricing/"))
    )
    if not is_commercial:
        return None

    combined = src + "\n" + md
    table_Pipe_lines = [ln for ln in md.splitlines() if ln.strip().startswith("|") and ln.strip().endswith("|")]
    has_table = len(table_Pipe_lines) >= 4 or bool(re.search(r"""["']?table["']?\s*:\s*\{""", src))
    has_three_scenarios = has_table or bool(SCENARIO_RE.search(md))
    has_counterexample = bool(COUNTEREXAMPLE_RE.search(md))
    has_calc_link, matching_calcs = _find_matching_calculators(path, q, all_routes, combined)
    has_voice = (ROOT / ".claude/reviewer-voice-profile.json").exists() and ROOT.name not in MEDICAL_NO_QUOTE_REPOS
    missing_note = has_voice and (path not in note_routes)
    amazon_no_price = bool(
        path.startswith("/gear/")
        or re.search(r"amazon\.com/|/dp/[A-Z0-9]{10}|amzn\.to/", combined, re.I)
    )

    if has_three_scenarios and has_counterexample and has_calc_link and not missing_note:
        return None
    return {
        "missing_three_scenario_breakdown": not has_three_scenarios,
        "missing_counterexample": not has_counterexample,
        "missing_calculator_link": not has_calc_link,
        "matching_calculators": matching_calcs,
        "missing_publishers_take": missing_note,
        "amazon_no_price": amazon_no_price,
    }


def diagnose(pk: dict, src: str, md: str, serp: dict, rows, all_routes: list[str], note_routes: set[str]) -> dict:
    n = pk.get("page12") or {}
    lane = n.get("lane") or pk.get("lane_hint")
    q = n.get("main_query") or ""
    meta, body = page_text(src)
    meta_t, body_t = set(norm(meta)), set(norm(meta + " " + body))
    sq_meta = re.sub(r"[^a-z0-9]", "", meta.lower())
    sq_all = re.sub(r"[^a-z0-9]", "", (meta + body).lower())
    opening = " ".join(l for l in md.splitlines() if l.strip() and not l.startswith("#"))[:OPENING_CHARS]
    needs, ev = set(), {"main_search": f"“{q}” #{n.get('main_pos')}"}

    sp = stale_prices(body, rows, [m.group(2) for m in STR.finditer(src)])
    if sp:
        needs.add(2)
        ev["stale_prices"] = sp

    fact = None
    if serp and not serp.get("error"):
        theirs: dict[float, set[str]] = {}
        for r in serp.get("top", [])[:8]:
            for v in money((r.get("title") or "") + " " + (r.get("description") or "")):
                theirs.setdefault(v, set()).add(r.get("domain") or "?")
        for v in money(serp.get("ai_overview", {}).get("text", "")):
            theirs.setdefault(v, set()).add("google-ai-overview")
        ours = money(meta + " " + body)
        agreed = {v: sorted(d) for v, d in theirs.items() if len(d) >= 2}
        missing = {v: d for v, d in agreed.items() if v not in ours}
        strong = {v: d for v, d in missing.items() if len(d) >= 3}
        if ours and (strong or len(missing) >= 2):
            fact = {"ours": sorted(ours)[:12],
                    "competitors_agree_not_on_our_page": {f"${v:g}": d for v, d in sorted(missing.items())[:8]},
                    "why": "figures that 2+ other results (incl. the AI Overview) agree on are missing from our page"}
            ev["snippet_fact_disagreement"] = fact
        missing_paa = paa_missing(serp.get("paa", []), body_t, sq_all)
        if missing_paa:
            ev["paa_not_answered"] = missing_paa[:5]
        if serp.get("our_result"):
            ev["our_snippet"] = serp["our_result"]
        ai = serp.get("ai_overview") or {}
        if ai.get("present"):
            ev["ai_overview"] = {"present": True, "cites_us": ai.get("cites_us"), "cited": ai.get("cited_domains", [])[:5]}
    elif serp.get("error"):
        ev["serp_unread"] = serp["error"][:120]

    # FACTS lane — a top page: correct outdated facts only, never touch title, description or sections
    if n.get("facts_only"):
        lvl = 2 if (fact or sp) else 0
        return {"level": lvl, "label": "FACTS ONLY" if lvl else "TOP PAGE — NO FACT ISSUE",
                "needs": [2] if lvl else [], "lane": "FACTS", "fact_check": bool(fact) or bool(sp),
                "inbound": False, "ai_cited": bool(n.get("ai_cited")), "facts_only": True,
                "evidence": {**ev, "top_page": n.get("top_page")}}

    proof_gap = _check_internal_proof_gap(pk, src, md, all_routes, note_routes)
    if proof_gap:
        ev["internal_proof_gap"] = proof_gap

    # SNIPPET lane — what searchers see
    if lane == "SNIPPET":
        needs.add(3)
        if covered(q, meta_t, sq_meta) < 1.0:
            ev["main_search_words_missing_from_title_description"] = q
        if PRICE_INTENT.search(q) and not money(meta) and not (proof_gap and proof_gap.get("amazon_no_price")):
            ev["price_search_but_no_price_in_snippet"] = True
        if covered(q, set(norm(opening)), re.sub(r"[^a-z0-9]", "", opening.lower())) < 0.75 or \
                (PRICE_INTENT.search(q) and not money(opening) and not (proof_gap and proof_gap.get("amazon_no_price"))):
            needs.add(4)
            ev["opening_does_not_answer_main_search"] = opening[:240]
        if proof_gap and (proof_gap["missing_three_scenario_breakdown"] or proof_gap["missing_counterexample"]):
            needs.add(4)

    # RANK lane — why Google puts it on page 2
    if lane == "RANK":
        needs.add(4)
        ev["rank_lane"] = "page 2: add an answer-first block at the top; cover what page 1 answers"
        if covered(q, meta_t, sq_meta) < 1.0:
            needs.add(3)
            ev["main_search_words_missing_from_title_description"] = q

    inbound = pk.get("inbound_links", 0)
    if inbound < MIN_INBOUND:
        ev["few_internal_links"] = inbound
    level = max(needs) if needs else 0
    return {"level": level, "label": LEVELS[level], "needs": sorted(needs), "lane": lane,
            "fact_check": bool(fact) or bool(sp), "inbound": inbound < MIN_INBOUND,
            "ai_cited": bool(n.get("ai_cited")), "evidence": ev}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    a = ap.parse_args(argv)
    P = Path(a.packets)
    queue = json.load(open(P / "queue.json"))["queue"]
    all_routes = (P / "routes.txt").read_text().splitlines() if (P / "routes.txt").exists() else []
    note_routes = _load_reviewer_note_routes()
    rows = pricing()
    chart = []
    for item in queue:
        d = P / item["slug"]
        pk = json.load(open(d / "packet.json"))
        serp = json.load(open(d / "serp.json")) if (d / "serp.json").exists() else {}
        md = (d / "page.md").read_text() if (d / "page.md").exists() else ""
        if (d / "page.ts").exists():
            src = (d / "page.ts").read_text()
        elif (d / "page.src").exists():
            src = (d / "page.src").read_text()
        else:
            src = "\n".join([f'metaTitle: {json.dumps(pk.get("title", ""))}',
                             f'metaDescription: {json.dumps(pk.get("description", ""))}'] +
                            [json.dumps(l) for l in md.splitlines() if l.strip()])
        dx = diagnose(pk, src, md, serp, rows, all_routes, note_routes)
        (d / "diagnosis.json").write_text(json.dumps(dx, indent=2, ensure_ascii=False))
        chart.append((item, pk, dx))
    c = Counter(dx["level"] for _, _, dx in chart)
    L = ["# Page 1-2 no-clicks diagnosis", "",
         "| page | lane | level | fact check | proof gap | few links | AI-cited | why |",
         "|---|---|---|---|---|---|---|---|"]
    for item, pk, dx in chart:
        e = dx["evidence"]
        why = [e["main_search"]]
        if "snippet_fact_disagreement" in e:
            why.append("others agree on " + ", ".join(e["snippet_fact_disagreement"]["competitors_agree_not_on_our_page"]) + " (not on our page)")
        if "stale_prices" in e:
            why.append("stale model price")
        if "price_search_but_no_price_in_snippet" in e:
            why.append("price search, no price in snippet")
        if "opening_does_not_answer_main_search" in e:
            why.append("opening doesn't answer it")
        if "paa_not_answered" in e:
            why.append(f"{len(e['paa_not_answered'])} PAA questions unanswered")
        pg = e.get("internal_proof_gap")
        pg_flag = "yes" if pg else "—"
        if pg:
            parts = []
            if pg.get("missing_three_scenario_breakdown"):
                parts.append("3-scenario breakdown")
            if pg.get("missing_counterexample"):
                parts.append("counterexample")
            if pg.get("missing_calculator_link") and pg.get("matching_calculators"):
                parts.append("calculator link")
            if pg.get("missing_publishers_take"):
                parts.append("Publisher's Take")
            if parts:
                why.append("missing " + "+".join(parts))
        L.append(f"| `{item['path']}` | {dx['lane']} | L{dx['level']} {dx['label']} | {'yes' if dx['fact_check'] else '—'} | "
                 f"{pg_flag} | {'yes' if dx['inbound'] else '—'} | {'yes' if dx['ai_cited'] else '—'} | {' · '.join(why)} |")
    (P / "diagnosis.md").write_text("\n".join(L) + "\n")
    print("OK " + " ".join(f"L{k}={c.get(k, 0)}" for k in (2, 3, 4)) +
          f" fact_check={sum(dx['fact_check'] for *_, dx in chart)} " +
          f"proof_gap={sum('internal_proof_gap' in dx['evidence'] for *_, dx in chart)} → {P / 'diagnosis.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
