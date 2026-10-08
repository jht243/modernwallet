#!/usr/bin/env python3
"""Read the Google results page for each packet's main search — what searchers actually see.

The ONLY third-party call in this routine (DataForSEO live SERP, ~$0.004 a read). It answers one
question per page: what do the OTHER results show for this search (titles, snippets, People also
ask, AI Overview), so the diagnosis can spot a fact that disagrees with every competitor (Nutshell:
our $7 vs everyone's $13), a buried answer, or questions the page never answers.

Nothing from this file is ever a number about OUR site: our own row is recorded only as
"where we appear and what our snippet says". Every measurement of our site comes from detect.py.

Writes <P>/<slug>/serp.json stamped third_party=dataforseo, purpose=serp_snippets_only.
Usage: DATAFORSEO_B64=… scripts/page12/serp_read.py --packets <P>
"""

import argparse
import os
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
os.environ.setdefault("RD_ENGINE", "page-1-2-no-clicks-pass")   # shared rank_drop scripts read it
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))
sys.path.insert(0, str(ROOT / "scripts" / "rank_drop"))


def text_of(x) -> str:
    if isinstance(x, str):
        return x
    if isinstance(x, dict):
        return " ".join(text_of(v) for k, v in x.items() if k in ("text", "markdown", "title", "description", "items"))
    if isinstance(x, list):
        return " ".join(text_of(v) for v in x)
    return ""


def summarize(res: dict, host: str) -> dict:
    items = res.get("items") or []
    org = sorted([i for i in items if i.get("type") == "organic"], key=lambda i: i.get("rank_group") or 999)
    ours = next((i for i in org if host in (i.get("domain") or "")), None)
    top = [{"rank": i.get("rank_group"), "domain": i.get("domain"), "url": i.get("url"),
            "title": i.get("title"), "description": i.get("description")}
           for i in org if host not in (i.get("domain") or "")][:10]
    paa = []
    for i in items:
        if i.get("type") == "people_also_ask":
            for q in i.get("items") or []:
                if q.get("title") and q["title"] not in paa:
                    paa.append(q["title"])
    aio = [i for i in items if i.get("type") == "ai_overview"]
    cited = []
    for a in aio:
        for ref in (a.get("references") or []) + [r for s in (a.get("items") or []) for r in (s.get("references") or [])]:
            d = ref.get("domain")
            if d and d not in cited:
                cited.append(d)
    fs = next((i for i in items if i.get("type") in ("featured_snippet", "answer_box")), None)
    return {"our_result": ({"rank": ours.get("rank_group"), "title": ours.get("title"),
                            "description": ours.get("description")} if ours else None),
            "top": top, "paa": paa[:8],
            "ai_overview": {"present": bool(aio), "text": text_of(aio)[:1500], "cited_domains": cited[:10],
                            "cites_us": any(host in d for d in cited)},
            "featured_snippet": ({"domain": fs.get("domain"), "text": text_of(fs)[:600]} if fs else None)}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    a = ap.parse_args(argv)
    import dataforseo as dfs
    from siteconf import site
    host = site()["base_url"].split("//", 1)[1].removeprefix("www.").rstrip("/")
    P = Path(a.packets)
    queue = json.load(open(P / "queue.json"))["queue"]
    ok = fail = 0
    for item in queue:
        d = P / item["slug"]
        pk = json.load(open(d / "packet.json"))
        q = (pk.get("page12") or {}).get("main_query")
        if not q:
            continue
        out = {"third_party": "dataforseo", "purpose": "serp_snippets_only", "query": q}
        try:
            if not dfs.available():
                raise RuntimeError("DataForSEO unavailable (DATAFORSEO_B64 not set)")
            try:
                res = dfs.serp_organic(q, depth=20, paa_depth=1)
            except Exception:  # noqa: BLE001 — one retry: DataForSEO returns transient 40101s
                import time
                time.sleep(5)
                res = dfs.serp_organic(q, depth=20, paa_depth=1)
            out.update(summarize(res, host))
            ok += 1
        except Exception as e:  # noqa: BLE001
            out["error"] = str(e)[:300]
            fail += 1
        (d / "serp.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print(f"OK serp read={ok} failed={fail}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
