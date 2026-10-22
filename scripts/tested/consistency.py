#!/usr/bin/env python3
"""Post-build TESTED consistency check (content standard ## TESTED).

For each route, read the BUILT page and check both directions:
  - the template rendered the tested byline ("Tested and reviewed by", src/components/Byline.astro)
    => the page must carry the format: meta description opens "We tested N", a "How We Tested"
    H2 that comes before the first pick label, and a "We tested every" tee-up in the body.
  - no tested byline => none of those may appear, and no pick labels.
Exit 1 on any mismatch, with one line per problem.

  python3 scripts/tested/consistency.py /roundup/best-budgeting-apps/ /compare/ynab-vs-monarch/ ...
  (run after `npm run build`; reads dist/<route>/index.html or dist/<route>.html)
"""
import html, pathlib, re, sys

root = pathlib.Path("dist")
bad = 0
for route in sys.argv[1:]:
    r = route.strip("/")
    p = next((c for c in (root / r / "index.html", root / (r + ".html")) if c.exists()), None)
    if p is None:
        print(f"MISSING BUILD  {route}"); bad += 1; continue
    h = p.read_text(encoding="utf-8")
    tested = "Tested and reviewed by" in h
    meta = html.unescape((re.findall(r'<meta name="description" content="([^"]*)"', h) or [""])[0])
    hwt = re.search(r"<h2[^>]*>How We Tested</h2>", h)
    pick = h.find("Why we picked it:")
    has = {
        "meta 'We tested N'": bool(re.match(r"We tested \d+ ", meta)),
        "How We Tested H2": bool(hwt),
        "tee-up 'We tested every'": "We tested every" in h,
    }
    labels = pick >= 0
    if tested:
        miss = [k for k, v in has.items() if not v]
        if hwt and labels and pick < hwt.start():
            miss.append("How We Tested H2 before the first pick")
        if miss:
            print(f"TESTED PAGE MISSING {miss}  {route}"); bad += 1
        else:
            print(f"ok tested      {route}")
    else:
        extra = [k for k, v in has.items() if v] + (["pick labels"] if labels else [])
        if extra:
            print(f"NOT-TESTED PAGE HAS {extra}  {route}"); bad += 1
        else:
            print(f"ok not-tested  {route}")
sys.exit(1 if bad else 0)
