#!/usr/bin/env python3
"""Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver — not Google).

Standard library only. Reads the key from the key file in public/ so the key and the file that
proves ownership can never drift apart, which is the usual cause of a silent 403.

Usage:
    python3 scripts/submit_indexnow.py URL [URL ...]
    python3 scripts/submit_indexnow.py --from-sitemap --match self-employment-tax
    python3 scripts/submit_indexnow.py --from-sitemap --since-commit HEAD~1

IndexNow accepts up to 10,000 URLs per request; this batches at 1,000 to keep payloads small.
A 200 or 202 means accepted. Submitting the same URL repeatedly with no content change is the
one thing IndexNow asks you not to do, so prefer --match or --since-commit over blanket resubmits.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOST = "www.themodernwallet.com"
ENDPOINT = "https://api.indexnow.org/indexnow"
BATCH = 1000


def find_key() -> str:
    """The key is the basename of the <key>.txt file in public/, and its contents must match."""
    candidates = [
        p for p in (ROOT / "public").glob("*.txt")
        if re.fullmatch(r"[0-9a-f]{8,128}", p.stem)
    ]
    if not candidates:
        sys.exit("No IndexNow key file found in public/ (expected <hexkey>.txt)")
    key_file = candidates[0]
    contents = key_file.read_text().strip()
    if contents != key_file.stem:
        sys.exit(f"{key_file.name} contents ({contents!r}) do not match the filename — IndexNow will 403")
    return key_file.stem


def sitemap_urls() -> list[str]:
    sm = ROOT / "dist" / "sitemap-0.xml"
    if not sm.exists():
        sys.exit("dist/sitemap-0.xml not found — run `npm run build` first")
    return re.findall(r"<loc>([^<]+)</loc>", sm.read_text())


def urls_from_commit(ref: str) -> list[str]:
    """Best-effort: map changed data/page files to routes by matching slugs against the sitemap."""
    changed = subprocess.run(
        ["git", "diff", "--name-only", f"{ref}..HEAD"],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.split()
    slugs = set()
    for path in changed:
        for m in re.finditer(r'slug:\s*"([a-z0-9-]+)"', (ROOT / path).read_text(errors="ignore")) if (ROOT / path).exists() else []:
            slugs.add(m.group(1))
    return [u for u in sitemap_urls() if any(f"/{s}/" in u for s in slugs)]


def submit(urls: list[str], key: str, dry_run: bool = False) -> int:
    failures = 0
    for i in range(0, len(urls), BATCH):
        batch = urls[i : i + BATCH]
        payload = {
            "host": HOST,
            "key": key,
            "keyLocation": f"https://{HOST}/{key}.txt",
            "urlList": batch,
        }
        if dry_run:
            print(f"[dry-run] would submit {len(batch)} URLs")
            continue
        req = urllib.request.Request(
            ENDPOINT,
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                print(f"Submitted {len(batch)} URLs — HTTP {resp.status}")
        except urllib.error.HTTPError as e:
            # 422 usually means the key or host does not match; 403 means the key file failed.
            print(f"FAILED batch of {len(batch)} — HTTP {e.code}: {e.read().decode()[:300]}")
            failures += 1
    return failures


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("urls", nargs="*")
    ap.add_argument("--from-sitemap", action="store_true")
    ap.add_argument("--match", help="Only sitemap URLs containing this substring")
    ap.add_argument("--since-commit", help="Only routes whose source changed since this ref")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if args.since_commit:
        urls = urls_from_commit(args.since_commit)
    elif args.from_sitemap:
        urls = sitemap_urls()
        if args.match:
            urls = [u for u in urls if args.match in u]
    else:
        urls = args.urls

    urls = sorted(set(urls))
    if not urls:
        sys.exit("No URLs to submit")

    key = find_key()
    print(f"Key {key} · {len(urls)} URLs")
    for u in urls[:5]:
        print(f"  {u}")
    if len(urls) > 5:
        print(f"  ... and {len(urls) - 5} more")

    sys.exit(1 if submit(urls, key, args.dry_run) else 0)


if __name__ == "__main__":
    main()
