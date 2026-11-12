#!/usr/bin/env python3
"""Verify live production URLs in a single bounded command (zero multi-turn curl loops).

Stdlib-only. Accepts either `--manifest <capture-manifest.json>` or explicit `--url`
arguments, polls internally with bounded sleep/backoff until all target URLs return
HTTP 200 with complete HTML (`<h1>` + `</html>`), and writes/prints structured JSON.
Never fabricates live status: if host deploy is still queued/pending after timeout,
returns status `pending-host-deploy` and exits 2 so MAIN reports honestly in 1 turn.
"""
import argparse
import json
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.request


def _resolve_urls(manifest_path=None, base_url=None, urls=()):
    resolved = []
    if manifest_path:
        m = json.loads(Path(manifest_path).read_text())
        origin = (base_url or m.get('canonicalBase') or '').rstrip('/')
        if not origin.startswith(('https://', 'http://')):
            raise ValueError('Manifest lacks valid canonicalBase; pass --base-url')
        for r in m.get('routes', []):
            path = r.get('path') if isinstance(r, dict) else str(r)
            if path and str(path).startswith('/'):
                resolved.append(origin + path)
    for u in urls:
        if u and u.strip():
            resolved.append(u.strip())
    deduped = list(dict.fromkeys(resolved))
    if not deduped:
        raise ValueError('Provide --manifest or at least one --url')
    return deduped


def probe_once(url, request_timeout=15):
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'MindmapLiveVerifier/1.0 (+https://layer3labs.io)',
            'Accept': 'text/html,application/xhtml+xml',
            'Cache-Control': 'no-cache',
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=request_timeout) as resp:
            status = resp.status
            final_url = resp.geturl()
            body = resp.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as exc:
        return {'url': url, 'ok': False, 'status': exc.code, 'error': f'HTTP {exc.code}'}
    except Exception as exc:
        return {'url': url, 'ok': False, 'status': 0, 'error': str(exc)}

    has_h1 = bool(re.search(r'<h1\b[^>]*>.*?</h1>', body, re.I | re.S))
    has_close = bool(re.search(r'</html\s*>\s*$', body, re.I))
    canonical_match = re.search(
        r'<link\b[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']|'
        r'<link\b[^>]*href=["\']([^"\']+)["\'][^>]*rel=["\']canonical["\']',
        body, re.I,
    )
    canonical = (canonical_match.group(1) or canonical_match.group(2)) if canonical_match else None
    ok = (status == 200 and has_h1 and has_close)
    res = {
        'url': url,
        'finalUrl': final_url,
        'ok': ok,
        'status': status,
        'hasH1': has_h1,
        'completeHtml': has_close,
        'canonical': canonical,
    }
    if not ok:
        res['error'] = f'HTTP {status} (hasH1={has_h1}, completeHtml={has_close})'
    return res


def verify_urls(urls, timeout=180, interval=12, request_timeout=15, sleep_fn=time.sleep, clock_fn=time.monotonic):
    deadline = clock_fn() + max(0, timeout)
    attempts = 0
    latest = {u: {'url': u, 'ok': False, 'status': 0, 'error': 'unprobed'} for u in urls}
    while True:
        attempts += 1
        pending = [u for u in urls if not latest[u].get('ok')]
        for u in pending:
            latest[u] = probe_once(u, request_timeout=request_timeout)
        still_pending = [u for u in urls if not latest[u].get('ok')]
        if not still_pending:
            return {
                'status': 'all-live',
                'attempts': attempts,
                'verifiedCount': len(urls),
                'pendingCount': 0,
                'results': [latest[u] for u in urls],
            }
        now = clock_fn()
        if now >= deadline or interval <= 0:
            return {
                'status': 'pending-host-deploy',
                'attempts': attempts,
                'verifiedCount': len(urls) - len(still_pending),
                'pendingCount': len(still_pending),
                'pendingUrls': still_pending,
                'results': [latest[u] for u in urls],
            }
        wait = min(interval, max(0.0, deadline - now))
        if wait > 0:
            sleep_fn(wait)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', help='Capture manifest JSON containing canonicalBase and routes')
    parser.add_argument('--base-url', help='Optional base URL override when using --manifest')
    parser.add_argument('--url', action='append', default=[], help='Explicit URL to verify (repeatable)')
    parser.add_argument('--timeout', type=int, default=180, help='Total bounded wait seconds (default 180)')
    parser.add_argument('--interval', type=int, default=12, help='Seconds between internal retries (default 12)')
    parser.add_argument('--request-timeout', type=int, default=15)
    parser.add_argument('--out', help='Optional JSON receipt output path')
    args = parser.parse_args(argv)

    urls = _resolve_urls(args.manifest, args.base_url, args.url)
    summary = verify_urls(
        urls, timeout=args.timeout, interval=args.interval, request_timeout=args.request_timeout,
    )
    if args.out:
        out_p = Path(args.out)
        out_p.parent.mkdir(parents=True, exist_ok=True)
        out_p.write_text(json.dumps(summary, indent=2) + '\n')
    print(json.dumps(summary, indent=2))
    return 0 if summary['status'] == 'all-live' else 2


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (ValueError, KeyError, OSError) as exc:
        print('BLOCKED: ' + str(exc), file=sys.stderr)
        sys.exit(1)
