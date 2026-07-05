#!/usr/bin/env python3
"""Slug inventory — dedup layer 1 for the portable trend-pass engine.

Portable (repo-agnostic): the source of truth is the LIVE sitemap, so this works
on any site regardless of its content system (Next.js data files, Flask/DB,
markdown, etc.). It fetches <base-url>/sitemap.xml (following a sitemap index one
level deep) and reports every published path.

Usage:
  slug_inventory.py --base-url https://www.example.com            # JSON summary
  slug_inventory.py --base-url https://www.example.com --flat     # one path per line
  slug_inventory.py --base-url https://www.example.com --check /foo/bar   # 0 free / 1 taken

--check matches on the full path AND on the last path segment (a bare candidate
slug collides with any existing URL ending in that segment).
"""

import argparse
import re
import sys
import urllib.request
import urllib.parse
from collections import Counter


def _fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read().decode("utf-8", errors="replace")


def fetch_sitemap_paths(base_url: str) -> list[str]:
    root = base_url.rstrip("/") + "/sitemap.xml"
    try:
        xml = _fetch(root)
    except Exception as e:
        print(f"[warn] could not fetch {root}: {e}", file=sys.stderr)
        return []
    locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml)
    # sitemap index → recurse one level into child sitemaps
    child_sitemaps = [u for u in locs if u.rstrip("/").endswith(".xml")]
    urls = [u for u in locs if u not in child_sitemaps]
    for sm in child_sitemaps[:50]:
        try:
            urls.extend(re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", _fetch(sm)))
        except Exception:
            continue
    paths = set()
    for u in urls:
        p = re.sub(r"^https?://[^/]+", "", u).rstrip("/")
        paths.add(p or "/")
    return sorted(paths)


def taken_segments(paths: list[str]) -> set[str]:
    segs = set(paths)
    for p in paths:
        seg = p.rstrip("/").rsplit("/", 1)[-1]
        if seg:
            segs.add(seg)
    return segs


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", required=True)
    ap.add_argument("--flat", action="store_true")
    ap.add_argument("--check", metavar="PATH")
    args = ap.parse_args(argv)

    paths = fetch_sitemap_paths(args.base_url)

    if args.check:
        needle = args.check.strip()
        segs = taken_segments(paths)
        seg = needle.rstrip("/").rsplit("/", 1)[-1]
        taken = (needle.rstrip("/") in {p.rstrip("/") for p in paths}) or (seg in segs)
        print(("TAKEN: " if taken else "FREE: ") + needle)
        return 1 if taken else 0

    if args.flat:
        sys.stdout.write("\n".join(paths) + "\n")
        return 0

    sections = Counter(p.split("/")[1] if p != "/" and len(p.split("/")) > 1 else "(home)"
                       for p in paths)
    import json
    json.dump({"base_url": args.base_url, "url_count": len(paths),
               "section_counts": dict(sections.most_common()),
               "sample_paths": paths[:40]}, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
