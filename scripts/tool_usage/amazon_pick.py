#!/usr/bin/env python3
"""Find REAL Amazon products for a tool's result-driven picks (/tool-usage-mindmap-auto, STEP 3b).

Given a search phrase per result tier ("RTX 4090 24GB graphics card"), returns the top real listings
from Amazon's Creators API (the PA-API successor) so the routine pins an actual ASIN instead of
inventing one. The writer still chooses which listing fits; this only proves it exists.

  amazon_pick.py "RTX 4090 24GB graphics card" ["Mac Studio M4 Max" ...] [--index Electronics] [--n 5]

Output (stdout, JSON): {"tag": "<partner tag>", "api": true|false,
  "queries": {"<phrase>": [{"asin","title","brand","link"}, ...] }}
Links are /dp/<ASIN>?tag=<tag> deep links. NO price, rating or image is returned on purpose: Amazon's
license makes stored prices go stale within 24h, so tool picks say "Check price on Amazon" instead.

No API credentials (AMZ_CLIENT_ID / AMZ_CLIENT_SECRET) or no confident result → "api": false and each
phrase gets one Amazon SEARCH link with the tag ({"asin": null, "link": "https://www.amazon.com/s?k=…"}),
which is always valid. Tag = --tag, else `amazon_tag` in .claude/tool-usage.site.json, else AMZ_PARTNER_TAG.
Missing tag → exit 2 (never ship an untagged or borrowed tag link). Stdlib only, portable across fleet repos.
"""
import argparse, json, os, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

TOKEN_URL = "https://api.amazon.com/auth/o2/token"
SEARCH_URL = "https://creatorsapi.amazon/catalog/v1/searchItems"
MARKETPLACE = "www.amazon.com"


def secrets():
    vals = {}
    for p in (Path(".claude/routines.config"), Path(".claude/secrets.env"), Path.home() / ".claude/secrets.env"):
        if p.exists():
            for line in p.read_text().splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    vals.setdefault(k.strip(), v.strip().strip("\"'"))
    for k in ("AMZ_CLIENT_ID", "AMZ_CLIENT_SECRET", "AMZ_PARTNER_TAG"):
        if os.environ.get(k):
            vals[k] = os.environ[k]
    return vals


def post(url, headers, body):
    for attempt in range(3):
        req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST", headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.status, json.loads(r.read().decode("utf-8", "replace"))
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                time.sleep(2 * (attempt + 1)); continue
            return e.code, {"error": e.read().decode("utf-8", "replace")[:300]}
        except urllib.error.URLError as e:
            time.sleep(2 * (attempt + 1))
    return 0, {"error": "network"}


def search_link(q, tag):
    return f"https://www.amazon.com/s?k={urllib.parse.quote_plus(q)}&tag={tag}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("queries", nargs="+")
    ap.add_argument("--index", default="All")
    ap.add_argument("--n", type=int, default=5)
    ap.add_argument("--tag")
    a = ap.parse_args()

    s = secrets()
    cfg = Path(".claude/tool-usage.site.json")
    site_tag = json.loads(cfg.read_text()).get("amazon_tag") if cfg.exists() else None
    tag = a.tag or site_tag or s.get("AMZ_PARTNER_TAG")
    if not tag:
        print(json.dumps({"error": "no Amazon tracking ID for this site — set amazon_tag in .claude/tool-usage.site.json"}))
        sys.exit(2)

    out = {"tag": tag, "api": False, "queries": {}}
    token = None
    if s.get("AMZ_CLIENT_ID") and s.get("AMZ_CLIENT_SECRET"):
        code, j = post(TOKEN_URL, {"Content-Type": "application/json"},
                       {"grant_type": "client_credentials", "client_id": s["AMZ_CLIENT_ID"],
                        "client_secret": s["AMZ_CLIENT_SECRET"], "scope": "creatorsapi::default"})
        token = j.get("access_token") if code == 200 else None
        if not token:
            sys.stderr.write(f"[amazon_pick] token failed (HTTP {code}) — falling back to search links\n")

    for q in a.queries:
        items = []
        if token:
            code, j = post(SEARCH_URL, {"Authorization": f"Bearer {token}", "Content-Type": "application/json",
                                        "x-marketplace": MARKETPLACE},
                           {"keywords": q, "searchIndex": a.index, "itemCount": 10, "itemPage": 1,
                            "marketplace": MARKETPLACE, "partnerTag": tag,
                            "resources": ["itemInfo.title", "itemInfo.byLineInfo"]})
            for it in ((j.get("searchResult") or {}).get("items") or [])[: a.n] if code == 200 else []:
                info = it.get("itemInfo") or {}
                bl = info.get("byLineInfo") or {}
                asin = it.get("asin")
                if asin:
                    items.append({"asin": asin,
                                  "title": ((info.get("title") or {}).get("displayValue") or "").strip(),
                                  "brand": ((bl.get("brand") or bl.get("manufacturer") or {}).get("displayValue") or "").strip(),
                                  "link": f"https://www.amazon.com/dp/{asin}?tag={tag}&linkCode=ll1"})
            if code != 200:
                sys.stderr.write(f"[amazon_pick] '{q}' HTTP {code}: {str(j)[:200]}\n")
        if items:
            out["api"] = True
        else:
            items = [{"asin": None, "title": q, "brand": "", "link": search_link(q, tag)}]
        out["queries"][q] = items
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
