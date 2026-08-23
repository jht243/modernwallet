#!/usr/bin/env python3
"""Live SERP reality check — turn one Google SERP into a decision, not a dump.

Why this exists: every content routine in this fleet writes pages without ever
looking at the SERP it is writing into. That is how we ship a vendor-voice
guide into a Reddit-owned SERP, or a fresh article into a result page where
Google answers the query itself with an AI Overview.

This module asks ONE question per keyword — "what kind of page can actually win
here, and can we win at all?" — and returns a compact verdict the chart phases
can print and a human can eyeball at the manifest gate.

VERDICTS ARE ADVISORY. Nothing here drops a row. A wrong automated DROP in an
unattended routine is far more expensive than a mislabeled one, and this fleet
has been bitten by silent single-record failures before. Label first; promote
to a hard gate only after real runs prove the labels right.

Cost: one live advanced SERP is ~$0.00415 (depth 20 + PAA click depth 1). Read
the top ~10 cluster heads per pass, not every candidate row.

Usage:
    import sys; sys.path.insert(0, "scripts/lib")
    from serp import read, read_many
    v = read("ai automation for small business")
    print(v["verdict"], v["paa"])

CLI:
    python3 scripts/lib/serp.py read --keyword "x"
    python3 scripts/lib/serp.py batch --keywords-file heads.txt --out serp.json

Stdlib only. No pip installs.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    import dataforseo as _dfs
except Exception:
    _dfs = None

# Communities where the ranking page is a real person's experience. A vendor
# explainer does not beat these; a first-person / operator-voice / tool page can.
FORUM_DOMAINS = {
    "reddit.com", "quora.com", "stackoverflow.com", "stackexchange.com",
    "news.ycombinator.com", "medium.com", "substack.com", "linkedin.com",
    "facebook.com", "x.com", "twitter.com", "youtube.com", "tiktok.com",
    "discord.com", "trustpilot.com", "g2.com", "capterra.com",
}

# Platforms/publishers whose presence signals an entrenched SERP. Not a
# blocklist — a count of how much of page one is owned by parties we will not
# outrank on authority alone.
MAJOR_DOMAINS = {
    "google.com", "workspace.google.com", "cloud.google.com", "microsoft.com",
    "amazon.com", "aws.amazon.com", "apple.com", "ibm.com", "oracle.com",
    "salesforce.com", "sap.com", "adobe.com", "openai.com", "anthropic.com",
    "wikipedia.org", "forbes.com", "gartner.com", "mckinsey.com", "hbr.org",
    "techcrunch.com", "wired.com", "nytimes.com", "wsj.com", "bloomberg.com",
    "hubspot.com", "zapier.com", "shopify.com", "intuit.com", "deloitte.com",
    "pwc.com", "kpmg.com", "accenture.com", "nvidia.com", "meta.com",
}


def _root(domain: str) -> str:
    """news.ycombinator.com -> ycombinator.com; www.reddit.com -> reddit.com."""
    d = (domain or "").lower().lstrip(".")
    if d.startswith("www."):
        d = d[4:]
    parts = d.split(".")
    if len(parts) > 2 and parts[-2] in {"co", "com", "org", "net", "gov", "ac"}:
        return ".".join(parts[-3:])   # example.co.uk
    return ".".join(parts[-2:]) if len(parts) >= 2 else d


def _matches(domain: str, table: set) -> bool:
    d = (domain or "").lower()
    return d in table or _root(d) in table


def read(keyword: str, database: str = "us", depth: int = 20,
         paa_depth: int = 1) -> dict:
    """One SERP -> one verdict. Raises RuntimeError if the SERP can't be read."""
    if not _dfs or not _dfs.available():
        raise RuntimeError("DataForSEO unavailable — no SERP read possible")
    res = _dfs.serp_organic(keyword, database=database, depth=depth,
                            paa_depth=paa_depth)
    return summarize(keyword, res)


def summarize(keyword: str, res: dict) -> dict:
    """Pure function over a SERP payload — unit-testable without spending money."""
    items = res.get("items") or []
    types = [i.get("type") for i in items]

    organic = [i for i in items if i.get("type") == "organic"]
    organic.sort(key=lambda i: i.get("rank_group") or 999)
    top10 = organic[:10]
    domains = [(i.get("domain") or "") for i in top10]

    forum_hits = [d for d in domains if _matches(d, FORUM_DOMAINS)]
    major_hits = [d for d in domains if _matches(d, MAJOR_DOMAINS)]
    top1_forum = bool(domains) and _matches(domains[0], FORUM_DOMAINS)

    # AI Overview: presence, and — more useful — who Google cited instead of us.
    ai_items = [i for i in items if i.get("type") == "ai_overview"]
    ai_cited: list[str] = []
    for a in ai_items:
        for ref in (a.get("references") or []):
            d = ref.get("domain")
            if d and d not in ai_cited:
                ai_cited.append(d)
        for sub in (a.get("items") or []):
            for ref in (sub.get("references") or []):
                d = ref.get("domain")
                if d and d not in ai_cited:
                    ai_cited.append(d)

    paa: list[str] = []
    for i in items:
        if i.get("type") == "people_also_ask":
            for q in (i.get("items") or []):
                t = q.get("title")
                if t and t not in paa:
                    paa.append(t)

    related: list[str] = []
    for i in items:
        if i.get("type") == "related_searches":
            for r in (i.get("items") or []):
                if isinstance(r, str) and r not in related:
                    related.append(r)

    snippet = next((i for i in items if i.get("type") in
                    ("featured_snippet", "answer_box")), None)

    # --- verdict ------------------------------------------------------------
    # Entrenchment is about who owns page one, not about the keyword's volume.
    if len(major_hits) >= 6:
        verdict = "locked"
    elif len(major_hits) >= 3:
        verdict = "contested"
    else:
        verdict = "winnable"

    # A forum-owned SERP is not "locked" — it is winnable with a DIFFERENT page
    # shape. Flag the shape rather than the difficulty.
    forum_dominated = top1_forum or len(forum_hits) >= 3

    reasons = []
    if forum_dominated:
        reasons.append("forum/community results own the SERP "
                       f"({', '.join(dict.fromkeys(forum_hits))[:80]})"
                       + (" incl. #1" if top1_forum else ""))
    if major_hits:
        reasons.append(f"{len(major_hits)}/10 major platforms ({', '.join(major_hits[:4])})")
    if ai_items:
        reasons.append("AI Overview present"
                       + (f", cites {', '.join(ai_cited[:4])}" if ai_cited else ""))
    if snippet:
        reasons.append(f"{snippet.get('type')} occupies the top answer slot")
    if not reasons:
        reasons.append("no entrenched incumbents or SERP features detected")

    # --- recommended page shape --------------------------------------------
    if forum_dominated:
        shape = ("experience-led / operator-voice or interactive tool — a vendor "
                 "explainer will not outrank first-person community answers")
    elif snippet:
        shape = ("direct-answer format: lead with a definition/steps block that "
                 "can take the featured snippet")
    elif "video" in types and types.count("video") >= 1 and verdict != "locked":
        shape = "text page with a how-to / step structure — video results present"
    else:
        shape = "standard article/guide is viable"

    return {
        "keyword": keyword,
        "verdict": verdict,
        "forum_dominated": forum_dominated,
        "ai_overview_present": bool(ai_items),
        "ai_overview_cited_domains": ai_cited[:10],
        "featured_snippet": snippet.get("type") if snippet else None,
        "top10_domains": domains,
        "major_domains": major_hits,
        "forum_domains": forum_hits,
        "serp_feature_mix": {t: types.count(t) for t in sorted(set(types)) if t},
        "paa": paa,
        "related_searches": related[:12],
        "recommended_shape": shape,
        "evidence": "; ".join(reasons),
        "se_results_count": res.get("se_results_count"),
    }


def read_many(keywords: list[str], database: str = "us", cap: int = 12) -> list[dict]:
    """Read the cluster heads. Capped — this is the only call here that spends.

    A failure on one keyword never sinks the batch: it lands as an error row so
    the caller can still print a chart.
    """
    out = []
    for kw in list(dict.fromkeys(k.strip() for k in keywords if k and k.strip()))[:cap]:
        try:
            out.append(read(kw, database))
        except Exception as e:
            out.append({"keyword": kw, "verdict": "unread",
                        "evidence": f"SERP read failed: {str(e)[:120]}",
                        "paa": [], "related_searches": [],
                        "recommended_shape": "unknown — SERP not read"})
    return out


def paa_map(pairs: list[tuple[str, str]], database: str = "us",
            cap: int = 12) -> dict[str, dict]:
    """{route: serp verdict + REAL follow-up questions} for (route, query) pairs.

    Built for question-gap-pass, whose Phase 2 otherwise invents the follow-up
    questions with an LLM. `people_also_ask` IS that list, from Google, so the
    routine can stop guessing what a visitor asks next.

    A failed read never sinks the batch — that route lands with an empty
    question list and the reason, and the phase falls back to generated ones.
    """
    out: dict[str, dict] = {}
    for route, query in pairs[:cap]:
        try:
            v = read(query, database)
            out[route] = {
                "query": query,
                "paa": v["paa"],
                "related_searches": v["related_searches"],
                "verdict": v["verdict"],
                "forum_dominated": v["forum_dominated"],
                "ai_overview_present": v["ai_overview_present"],
                "ai_overview_cited_domains": v["ai_overview_cited_domains"],
                "featured_snippet": v["featured_snippet"],
                "top10_domains": v["top10_domains"],
                "recommended_shape": v["recommended_shape"],
            }
        except Exception as e:
            out[route] = {"query": query, "paa": [], "related_searches": [],
                          "verdict": "unread",
                          "error": f"SERP read failed: {str(e)[:120]}"}
    return out


def merge_questions(generated: list[str], paa: list[str],
                    related: list[str] | None = None) -> list[dict]:
    """Merge real PAA with LLM-generated questions, PAA first and deduped.

    Returns [{"question", "source": "paa"|"related"|"generated"}]. A generated
    question that restates a PAA question is dropped, not kept alongside it —
    Google's phrasing is the one real visitors type, so it wins the collision.
    """
    def norm(q: str) -> str:
        q = re.sub(r"[^a-z0-9 ]", "", (q or "").lower())
        stop = {"the", "a", "an", "is", "are", "do", "does", "can", "i", "my",
                "you", "your", "it", "to", "of", "for", "in", "on", "and", "s"}
        return " ".join(sorted(w for w in q.split() if w not in stop))

    out: list[dict] = []
    seen: set[str] = set()
    for q in paa or []:
        k = norm(q)
        if q and k not in seen:
            seen.add(k)
            out.append({"question": q, "source": "paa"})
    for q in related or []:
        k = norm(q)
        if q and k not in seen and q.strip().endswith("?"):
            seen.add(k)
            out.append({"question": q, "source": "related"})
    for q in generated or []:
        k = norm(q)
        if q and k not in seen:
            seen.add(k)
            out.append({"question": q, "source": "generated"})
    return out


def chart_cells(v: dict) -> tuple[str, str]:
    """(serp_verdict, serp_evidence) — the two new mindmap-pass chart columns."""
    flags = []
    if v.get("forum_dominated"):
        flags.append("forum-owned")
    if v.get("ai_overview_present"):
        flags.append("AI Overview")
    if v.get("featured_snippet"):
        flags.append(v["featured_snippet"])
    verdict = v.get("verdict", "unread")
    return (verdict + (f" ({', '.join(flags)})" if flags else ""),
            v.get("evidence", ""))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("read"); r.add_argument("--keyword", required=True)
    r.add_argument("--database", default="us")
    b = sub.add_parser("batch")
    b.add_argument("--keywords-file", required=True)
    b.add_argument("--out"); b.add_argument("--cap", type=int, default=12)
    b.add_argument("--database", default="us")
    q = sub.add_parser("paa", help="route<TAB>query pairs -> real follow-up questions")
    q.add_argument("--pairs-file", required=True)
    q.add_argument("--out"); q.add_argument("--cap", type=int, default=12)
    q.add_argument("--database", default="us")
    a = ap.parse_args(argv)

    if a.cmd == "paa":
        pairs = []
        for line in open(a.pairs_file):
            line = line.rstrip("\n")
            if not line.strip() or "\t" not in line:
                continue
            route, query = line.split("\t", 1)
            pairs.append((route.strip(), query.strip()))
        rows = paa_map(pairs, a.database, a.cap)
        payload = {"pages": rows,
                   "cost": _dfs.cost_summary() if _dfs else "no client"}
        text = json.dumps(payload, indent=1)
        if a.out:
            open(a.out, "w").write(text)
            got = sum(len(v["paa"]) for v in rows.values())
            print(f"wrote {a.out} — {len(rows)} pages, {got} real PAA questions — {payload['cost']}")
        else:
            print(text)
        return 0

    if a.cmd == "read":
        try:
            print(json.dumps(read(a.keyword, a.database), indent=1))
        except Exception as e:
            print(json.dumps({"error": str(e)}, indent=1))
        return 0

    kws = [l.strip() for l in open(a.keywords_file) if l.strip()]
    rows = read_many(kws, a.database, a.cap)
    payload = {"rows": rows,
               "cost": _dfs.cost_summary() if _dfs else "no client"}
    text = json.dumps(payload, indent=1)
    if a.out:
        open(a.out, "w").write(text)
        print(f"wrote {a.out} ({len(rows)} SERPs) — {payload['cost']}")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
