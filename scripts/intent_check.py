#!/usr/bin/env python3
"""Name-mixup check: does Google's top 10 for a phrase mean OUR thing?

Some product names are also common words or other brands ("make", "granola",
"mercury", "llama"). A page targeting "make alternatives" can't win when Google's
top 10 is about Makefile. This reads the live top 10 (DataForSEO, desktop US) and
counts results whose title or URL matches the terms that identify our entity.

  python3 scripts/intent_check.py "make alternatives" --terms "make.com,integromat,zapier,automation"
  python3 scripts/intent_check.py "granola alternatives" --terms "granola.ai,meeting,note,notes,notetaker,transcri"

Verdict (stdout JSON): on_intent (>= 6 of the top 10 match), mixed (3-5),
off_intent (<= 2). Exit 0 always; the caller decides. ~$0.002 per phrase.
"""
import argparse, json, os, sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "lib"))
import dataforseo as D  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("phrase")
    ap.add_argument("--terms", required=True, help="comma-separated words/domains that identify OUR entity")
    ap.add_argument("--database", default="us")
    a = ap.parse_args()
    terms = [t.strip().lower() for t in a.terms.split(",") if t.strip()]
    r = D.serp_organic(a.phrase, database=a.database, depth=10, paa_depth=0)
    items = [i for i in (r.get("items") or []) if i.get("type") == "organic"][:10]
    rows = []
    for i in items:
        hay = " ".join(str(i.get(k) or "") for k in ("title", "url", "description")).lower()
        rows.append({"domain": i.get("domain"), "title": (i.get("title") or "")[:90],
                     "match": any(t in hay for t in terms)})
    n = sum(r["match"] for r in rows)
    verdict = "on_intent" if n >= 6 else "mixed" if n >= 3 else "off_intent"
    print(json.dumps({"phrase": a.phrase, "matched": n, "of": len(rows), "verdict": verdict,
                      "results": rows}, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
