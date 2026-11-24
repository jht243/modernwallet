#!/usr/bin/env python3
"""Verify live production URLs in a single bounded command (zero multi-turn curl loops).

Stdlib-only. Accepts either `--manifest <capture-manifest.json>` or explicit `--url`
arguments, polls internally with bounded sleep/backoff until all target URLs return
HTTP 200 with complete HTML (`<h1>` + `</html>`), and writes/prints structured JSON.
Also consults Render's Deploy API (read-only, when RENDER_API_KEY is available) to
report live/in-progress/failed deploy status and avoid premature timeout while a
build is actively running on Render.
Never fabricates live status: if host deploy is still queued/pending after timeout,
returns status `pending-host-deploy` and exits 2 so MAIN reports honestly in 1 turn.
"""
import argparse
import json
import os
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

# Read-only canonical hostname -> Render service ID lookup for deploy-status awareness.
HOST_TO_RENDER_SERVICE_ID = {
    'americanpivot.org': 'srv-dbm12e8ae00c7381naq0',
    'ayahuasca-retreat.com': 'srv-da32u3uk1f9s73duhsl0',
    'banthebots.org': 'srv-d87hpi5ckfvc73a8qlj0',
    'caracasresearch.com': 'srv-d7gnh0l8nd3s73e5q850',
    'chalkbox.org': 'srv-da1shhfqj5pc73d35pu0',
    'colombiadesk.com': 'srv-db6sboou01pc73bduso0',
    'cubaninsights.com': 'srv-d7jafposfn5c73bjinug',
    'diyrepairguide.com': 'srv-daepl80u01pc73fh0em0',
    'droneanddefense.com': 'srv-d9l549u1egvs738otbb0',
    'earnbycreating.com': 'srv-dbb9ks4s728c73ej83pg',
    'findaprayer.com': 'srv-d9025rreo5us73bp20eg',
    'getopt.com': 'srv-da9hjs4s728c73dpu4j0',
    'humidorist.com': 'srv-d90262po3t8c73brm0a0',
    'jetandbeyond.com': 'srv-d9tqd9u417fc73f2cfcg',
    'jonathanteplitsky.com': 'srv-d83am9gg4nts73d6k350',
    'lawfareclaims.org': 'srv-d88c3pa8qa3s73f5bttg',
    'layer3labs.io': 'srv-d5618t6mcj7s73fkk7b0',
    'longevitybenchmark.com': 'srv-d9qb3aqjobas7385e36g',
    'loveanswers.org': 'srv-dbbau8c9v7es73eiagbg',
    'medicalfrontier.org': 'srv-da1sg85bedkc73cr5lug',
    'mindmedicinelaw.com': 'srv-d7lfertckfvc73a8j9fg',
    'newparentpicks.com': 'srv-daf2epad0e5s73ah2va0',
    'orbitalintel.org': 'srv-da88mqm7bikc73c2782g',
    'partygamekit.com': 'srv-daiapsu1egvs73fnofng',
    'pipeflare.io': 'srv-d91j17reo5us73972osg',
    'rankandpay.org': 'srv-d8860o8js32c73epnoi0',
    'readnextguide.com': 'srv-davdj4k9v7es73fdc080',
    'safetotravel.org': 'srv-db4i3sfavr4c73faobs0',
    'shavingschool.com': 'srv-da4t848u01pc73d95egg',
    'thebotscout.com': 'srv-d9l53agae00c738f1sj0',
    'thehoaguide.com': 'srv-d9c3lcjtqb8s73aaed1g',
    'theindoorreport.com': 'srv-daieqj5g1s2s73f22390',
    'themetabolicjournal.com': 'srv-d7sdfhhj2pic73evb5jg',
    'themodernwallet.com': 'srv-d901evv7f7vs739n02b0',
    'trecklist.com': 'srv-d8s9h57avr4c73ffv0j0',
    'undertheload.com': 'srv-dain1ojm8hqs73dhl6d0',
    'wearespin.com': 'srv-dbdrrc3l550s738643tg',
    'wildcardsport.com': 'srv-db40meg473hc73c7i8pg',
}

ACTIVE_RENDER_DEPLOY_STATUSES = {
    'created',
    'queued',
    'build_in_progress',
    'update_in_progress',
    'pre_deploy_in_progress',
}


def _load_render_api_key() -> str:
    key = os.environ.get('RENDER_API_KEY', '').strip()
    if key:
        return key
    secrets_path = Path.home() / '.claude/secrets.env'
    if secrets_path.is_file():
        try:
            for line in secrets_path.read_text(errors='ignore').splitlines():
                s = line.strip()
                if not s or s.startswith('#') or '=' not in s:
                    continue
                k, v = s.split('=', 1)
                if k.strip().removeprefix('export ').strip() == 'RENDER_API_KEY':
                    return v.strip().strip('"\'')
        except OSError:
            pass
    return ''


def _service_id_for_urls(urls) -> str:
    for u in urls:
        host = (urllib.parse.urlsplit(u).hostname or '').lower().removeprefix('www.')
        if host in HOST_TO_RENDER_SERVICE_ID:
            return HOST_TO_RENDER_SERVICE_ID[host]
    return ''


def query_render_deploy_status(service_id: str, request_timeout: int = 10):
    """Read-only check of the latest Render deploy for `service_id` (never triggers deploys)."""
    if not service_id:
        return None
    token = _load_render_api_key()
    if not token:
        return None
    req = urllib.request.Request(
        f'https://api.render.com/v1/services/{service_id}/deploys?limit=3',
        headers={'Authorization': f'Bearer {token}', 'Accept': 'application/json'},
    )
    try:
        with urllib.request.urlopen(req, timeout=request_timeout) as resp:
            rows = json.loads(resp.read().decode('utf-8', errors='replace'))
        if not rows or not isinstance(rows, list):
            return None
        dep = rows[0].get('deploy') or {}
        commit = dep.get('commit') or {}
        return {
            'serviceId': service_id,
            'deployId': dep.get('id'),
            'status': dep.get('status'),
            'trigger': dep.get('trigger'),
            'commitId': (commit.get('id') or '')[:40],
            'createdAt': dep.get('createdAt'),
            'finishedAt': dep.get('finishedAt'),
        }
    except Exception:
        return None


def _infer_canonical_base(manifest_file: Path) -> str:
    # Walk up from manifest_file to find sibling capture-manifest.json or repo .claude/content-review-policy.json
    sibling_cap = manifest_file.parent / 'audit/capture-manifest.json'
    if sibling_cap.is_file():
        try:
            cb = str(json.loads(sibling_cap.read_text()).get('canonicalBase') or '').rstrip('/')
            if cb.startswith(('https://', 'http://')):
                return cb
        except Exception:
            pass
    cur = manifest_file.resolve().parent
    for _ in range(8):
        pol = cur / '.claude/content-review-policy.json'
        if pol.is_file():
            try:
                doc = json.loads(pol.read_text())
                hosts = doc.get('canonicalHosts') or []
                if hosts:
                    h = next((x for x in hosts if str(x).startswith('www.')), hosts[0])
                    return f'https://{str(h).strip("/")}'
            except Exception:
                pass
        loc_pol = cur / '.claude/workflow-policy.local.json'
        if loc_pol.is_file():
            try:
                cb = str(json.loads(loc_pol.read_text()).get('canonicalBase') or '').rstrip('/')
                if cb.startswith(('https://', 'http://')):
                    return cb
            except Exception:
                pass
        if cur.parent == cur:
            break
        cur = cur.parent
    return ''


def _resolve_urls(manifest_path=None, base_url=None, urls=()):
    resolved = []
    if manifest_path:
        mf = Path(manifest_path)
        m = json.loads(mf.read_text())
        origin = (base_url or m.get('canonicalBase') or _infer_canonical_base(mf) or '').rstrip('/')
        if not origin.startswith(('https://', 'http://')):
            raise ValueError('Manifest lacks valid canonicalBase; pass --base-url')
        if isinstance(m.get('routes'), list) and m['routes']:
            for r in m['routes']:
                path = r.get('path') if isinstance(r, dict) else str(r)
                if path and str(path).startswith('/'):
                    resolved.append(origin + path)
        elif isinstance(m.get('actions'), list) and m['actions']:
            for a in m['actions']:
                if not isinstance(a, dict):
                    continue
                t = str(a.get('target') or '').split('#', 1)[0].strip()
                if t.startswith('/'):
                    resolved.append(origin + t)
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


def verify_urls(
    urls,
    timeout=480,
    interval=12,
    request_timeout=15,
    sleep_fn=time.sleep,
    clock_fn=time.monotonic,
    render_status_fn=query_render_deploy_status,
):
    start_time = clock_fn()
    deadline = start_time + max(0, timeout)
    hard_cap = start_time + max(timeout, 600)
    service_id = _service_id_for_urls(urls)
    last_render_deploy = None
    attempts = 0
    latest = {u: {'url': u, 'ok': False, 'status': 0, 'error': 'unprobed'} for u in urls}
    while True:
        attempts += 1
        pending = [u for u in urls if not latest[u].get('ok')]
        for u in pending:
            latest[u] = probe_once(u, request_timeout=request_timeout)
        still_pending = [u for u in urls if not latest[u].get('ok')]
        if not still_pending:
            out = {
                'status': 'all-live',
                'attempts': attempts,
                'verifiedCount': len(urls),
                'pendingCount': 0,
                'results': [latest[u] for u in urls],
            }
            if last_render_deploy:
                out['renderDeploy'] = last_render_deploy
            return out

        if service_id and render_status_fn is not None:
            dep_info = render_status_fn(service_id)
            if dep_info:
                last_render_deploy = dep_info
                if dep_info.get('status') in ACTIVE_RENDER_DEPLOY_STATUSES and deadline < hard_cap:
                    # Extend wait up to hard_cap while Render is actively building/deploying
                    deadline = min(hard_cap, max(deadline, clock_fn() + 120))

        now = clock_fn()
        if now >= deadline or interval <= 0:
            out = {
                'status': 'pending-host-deploy',
                'attempts': attempts,
                'verifiedCount': len(urls) - len(still_pending),
                'pendingCount': len(still_pending),
                'pendingUrls': still_pending,
                'results': [latest[u] for u in urls],
            }
            if last_render_deploy:
                out['renderDeploy'] = last_render_deploy
            return out
        wait = min(interval, max(0.0, deadline - now))
        if wait > 0:
            sleep_fn(wait)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', help='Capture manifest JSON containing canonicalBase and routes')
    parser.add_argument('--base-url', help='Optional base URL override when using --manifest')
    parser.add_argument('--url', action='append', default=[], help='Explicit URL to verify (repeatable)')
    parser.add_argument('--timeout', type=int, default=480, help='Total bounded wait seconds (default 480)')
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
