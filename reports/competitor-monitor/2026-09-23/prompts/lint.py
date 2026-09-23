#!/usr/bin/env python3
import json, re, sys, glob

BANS = [
 r"\bhonest(ly|y)?\b", r"—", r"delve into", r"\bleverage\b", r"navigate the complexities",
 r"unlock the power", r"it's worth noting", r"a testament to", r"in the realm of",
 r"\bunlock\b", r"\bharness\b", r"\bsupercharge\b", r"\bfoster\b", r"\butilize\b",
 r"\bfacilitate\b", r"\bempower\b", r"\bstreamline\b", r"cannot be overstated",
 r"\bcrucial\b", r"\bvital\b", r"\bessential\b", r"\bpivotal\b", r"\bparamount\b",
 r"\bpowerful\b", r"\bprofound\b", r"\bremarkable\b", r"game-changer", r"cutting-edge",
 r"revolutionary", r"breakthrough", r"\brobust\b", r"\bholistic\b", r"wealth of",
 r"\bmyriad\b", r"\bplethora\b", r"in conclusion", r"\bultimately\b,", r"\boverall\b,",
 r"the vendor\b", r"the platform\b", r"this provider\b", r"one major provider",
 r"a leading tool", r"studies show", r"experts agree", r"research suggests",
 r"what nobody tells you", r"the part everyone misses", r"here is the gap",
 r"here's the thing", r"the truth is,", r"what this means is,", r"this guide covers",
 r"in this article", r"as we'll see", r"you might be wondering", r"that's why you're here",
 r"make no mistake", r"and that matters\b",
]

def all_strings(o):
    if isinstance(o, str):
        yield o
    elif isinstance(o, dict):
        for v in o.values():
            yield from all_strings(v)
    elif isinstance(o, list):
        for v in o:
            yield from all_strings(v)

for path in sorted(glob.glob(sys.argv[1] + "/*.json")):
    if path.endswith(".meta.json"):
        continue
    d = json.load(open(path))
    slug = d.get("slug", "?")
    print(f"\n=== {slug} ===")
    title = d.get("title", "")
    meta = d.get("metaDescription", "")
    print(f"title ({len(title)} chars): {title}")
    print(f"metaDescription ({len(meta)} chars): {meta}")
    if not (50 <= len(title) <= 60):
        print(f"  !! title length out of 50-60 range")
    if len(meta) > 160:
        print(f"  !! metaDescription over 160 chars")
    # body word count (guide: intro+sections+faqs ; comparison: intro+sections+verdict+faqs)
    body_parts = []
    body_parts.append(d.get("introText", ""))
    for s in d.get("sections", []):
        body_parts.append(s.get("body", "") or s.get("content", ""))
    body_parts.append(d.get("verdict", "") if isinstance(d.get("verdict"), str) else "")
    for f in d.get("faqs", []):
        body_parts.append(f.get("answer", ""))
    body = " ".join(body_parts)
    words = len(body.split())
    print(f"body words (intro+sections+verdict+faqs): {words}")
    # comparison table check
    if "comparisonTable" in d:
        rows = d["comparisonTable"].get("rows", [])
        print(f"comparisonTable rows: {len(rows)}")
        for r in rows:
            if not r.get("a") or not r.get("b"):
                print(f"  !! empty cell in row: {r}")
            for side in ("a","b"):
                v = str(r.get(side,"")).lower()
                if any(p in v for p in ["confirm on site","check vendor","check provider","verify current","contact us","see website"]):
                    print(f"  !! deferral-in-cell: {r}")
    print(f"faqs: {len(d.get('faqs', []))}")
    if "relatedComparisons" in d:
        print(f"relatedComparisons: {d.get('relatedComparisons')}")
    if "tools" in d:
        print(f"tools: {[t.get('href') for t in d.get('tools',[])]}")
    if "calculatorLinks" in d:
        print(f"calculatorLinks: {[t.get('href') for t in d.get('calculatorLinks',[])]}")
    # ban scan across all strings
    hits = {}
    for s in all_strings(d):
        for pat in BANS:
            if re.search(pat, s, re.IGNORECASE):
                hits.setdefault(pat, []).append(s[:120])
    if hits:
        print("  BAN HITS:")
        for pat, exs in hits.items():
            print(f"    {pat}: {exs[:2]}")
    else:
        print("  no ban-list hits")
    # "At ModernWallet, we" count
    cnt = len(re.findall(r"At ModernWallet, we", body, re.IGNORECASE))
    print(f'  "At ModernWallet, we" occurrences: {cnt}')
    # brand-name check
    if "The Modern Wallet" in body:
        print("  !! wrong brand name 'The Modern Wallet' found")
    # competitor name check
    if "smartasset" in body.lower() or "smart asset" in body.lower():
        print("  !! competitor named on page")
