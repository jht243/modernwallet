#!/usr/bin/env python3
"""Diagnose why each picked page is shown but not clicked — code only, no model call.

Writes <slug>/diagnosis.json in rank-drop's shape ({level, label, needs, evidence}) so the shared
planner → generate → splice → audit pipeline runs unchanged, plus `lane` and `fact_check`.

Levels (lowest that fixes it, plus any lower fixes it also needs):
  L2 DATA REFRESH  a model price on the page disagrees with data/pricing.ts (code fixes it)
  L3 METADATA      SNIPPET lane: the title/description don't answer the main search the way the
                   results around it do (missing words, no number on a price search)
  L4 SECTION       a short answer-first block at the TOP of the page (added above the existing
                   intro, which stays word for word):
                     SNIPPET lane when the opening doesn't answer the main search,
                     RANK lane always (page 2: answer faster than the page-1 results, cover the
                     People-also-ask questions the page misses)
Plus, independent of level:
  fact_check       numbers in the competitor snippets / AI Overview that disagree with ours
                   (Nutshell: our $7 vs everyone's $13) → the planner verifies against the vendor's
                   own page and corrects every outdated sentence on the WHOLE page
  inbound          fewer than 3 internal links point here → INBOUND LINKS step adds related links

Usage: scripts/page12/diagnose.py --packets <P>
"""

import argparse
import os
import json
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
os.environ.setdefault("RD_ENGINE", "page-1-2-no-clicks-pass")   # shared rank_drop scripts read it
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "rank_drop"))
from diagnose import LEVELS, STR, covered, norm, page_text, pricing, stale_prices  # noqa: E402

PRICE_INTENT = re.compile(r"\b(pric\w*|cost\w*|plans?|subscription|tiers?|free|trial|how much|fees?|per month)\b", re.I)
MONEY = re.compile(r"\$\s?(\d{1,4}(?:,\d{3})*(?:\.\d{1,2})?)")
OPENING_CHARS = 700
MIN_INBOUND = 3


def money(t: str) -> set[float]:
    return {float(x.replace(",", "")) for x in MONEY.findall(t or "")}


def paa_missing(paa: list[str], body_t: set[str], squashed: str) -> list[str]:
    return [q for q in paa if covered(q, body_t, squashed) < 0.6]


def diagnose(pk: dict, src: str, md: str, serp: dict, rows) -> dict:
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

    # what the results around us say (third-party SERP — evidence for the fix, never a metric)
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
        # Close CRM 2026-10-07: our page kept Startup $49 / Professional $99 while close.com, G2 and the
        # AI Overview all said Solo $9 → Scale $139 — one shared figure ($139) must not hide the rest.
        if ours and (strong or len(missing) >= 2):
            fact = {"ours": sorted(ours)[:12],
                    "competitors_agree_not_on_our_page": {f"${v:g}": d for v, d in sorted(missing.items())[:8]},
                    "why": "figures that 2+ other results (incl. the AI Overview) agree on are missing from our page"}
            ev["snippet_fact_disagreement"] = fact
        missing = paa_missing(serp.get("paa", []), body_t, sq_all)
        if missing:
            ev["paa_not_answered"] = missing[:5]
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
    # SNIPPET lane — what searchers see
    if lane == "SNIPPET":
        needs.add(3)
        if covered(q, meta_t, sq_meta) < 1.0:
            ev["main_search_words_missing_from_title_description"] = q
        if PRICE_INTENT.search(q) and not money(meta):
            ev["price_search_but_no_price_in_snippet"] = True
        if covered(q, set(norm(opening)), re.sub(r"[^a-z0-9]", "", opening.lower())) < 0.75 or \
                (PRICE_INTENT.search(q) and not money(opening)):
            needs.add(4)
            ev["opening_does_not_answer_main_search"] = opening[:240]
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
    rows = pricing()
    chart = []
    for item in queue:
        d = P / item["slug"]
        pk = json.load(open(d / "packet.json"))
        serp = json.load(open(d / "serp.json")) if (d / "serp.json").exists() else {}
        md = (d / "page.md").read_text() if (d / "page.md").exists() else ""
        if (d / "page.ts").exists():
            src = (d / "page.ts").read_text()
        else:
            src = "\n".join([f'metaTitle: {json.dumps(pk.get("title", ""))}',
                             f'metaDescription: {json.dumps(pk.get("description", ""))}'] +
                            [json.dumps(l) for l in md.splitlines() if l.strip()])
        dx = diagnose(pk, src, md, serp, rows)
        (d / "diagnosis.json").write_text(json.dumps(dx, indent=2, ensure_ascii=False))
        chart.append((item, pk, dx))
    c = Counter(dx["level"] for _, _, dx in chart)
    L = ["# Page 1-2 no-clicks diagnosis", "",
         "| page | lane | level | fact check | few links | AI-cited | why |", "|---|---|---|---|---|---|---|"]
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
        L.append(f"| `{item['path']}` | {dx['lane']} | L{dx['level']} {dx['label']} | {'yes' if dx['fact_check'] else '—'} | "
                 f"{'yes' if dx['inbound'] else '—'} | {'yes' if dx['ai_cited'] else '—'} | {' · '.join(why)} |")
    (P / "diagnosis.md").write_text("\n".join(L) + "\n")
    print("OK " + " ".join(f"L{k}={c.get(k, 0)}" for k in (2, 3, 4)) +
          f" fact_check={sum(dx['fact_check'] for *_, dx in chart)} → {P / 'diagnosis.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
