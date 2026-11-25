#!/usr/bin/env python3
"""Fleet-Wide Hourly Monitor for Routines Coming Up Empty on Internal Data / Testing.

Scans both:
  1. Local durable ledger `~/.claude/logs/internal-proof-log.jsonl`
  2. Live GitHub commits across all 40 fleet publications in the lookback window (`--hours`, default 1)
     — reading committed `reports/internal-proof-log.jsonl` rows (with a 24h same-day receipt carryover
     window so precheck-to-publish delays and follow-up audit/polish commits keep their proof receipt)
     AND inspecting any net-new content commits that published without internal testing, client/operator
     experience, reader surveys, or internal cost/spec scenario modeling.

Never blocks publishing. Groups empty results by routine and site, distinguishing:
  - Legitimate domain exemptions (medical, psychedelic, legal, sanctions, public-figure biographies)
  - Actionable empty routines (commercial/product/guide routines coming up empty on internal data)
"""
from __future__ import annotations

import argparse
import base64
from concurrent.futures import ThreadPoolExecutor
import datetime as dt
import json
from pathlib import Path
import re
import subprocess
import sys

REGULATED_SITES = {
    'jht243/psych_report',
    'HarmonicaAya/harmonica-ayahuasca-preview',
    'GetOPTHealth/opt-health',
    'jht243/medicalfrontier',
    'jht243/longevitybenchmark',
    'jht243/next-court',
    'jht243/modernwallet',
    'jht243/cuban_insights',
    'jht243/ven_biz_network',
}

# Exclude non-article navigation, IA, taxonomy, author, and ledger JSON/TS files in data/ and lib/
CONTENT_PATH_RE = re.compile(
    r'^('
    r'(?:src/)?data/(?!ia(?:\.|[-_])|related(?:\.|[-_])|links?(?:\.|[-_])|nav(?:igation)?(?:\.|[-_])|menu(?:\.|[-_])|categor(?:y|ies)|clusters?(?:\.|[-_])|hubs?(?:\.|[-_])|routes?(?:\.|[-_])|redirects?(?:\.|[-_])|taxonom(?:y|ies)|authors?(?:\.|[-_])|team(?:\.|[-_])|site(?:\.|[-_])|config(?:\.|[-_])|tested-methods|placement|testing-|alternatives-pages|sponsored|affiliate|paid-placements|reviewer-notes|pricing|gear-prices|search-index|sitemap|ledger|backlog|snapshot)[^/]+\.(?:ts|tsx|json)|'
    r'lib/(?!rates|utils|seo|sitemap|schema|constants|ia|related|nav|navigation)[^/]*(?:content|trends|guides|articles|posts|alternatives|comparisons|reviews)[^/]*\.(?:ts|tsx|json)|'
    r'src/content/.*\.(?:md|mdx|json)|'
    r'content/.*\.(?:md|mdx|json)|'
    r'posts/.*\.(?:md|mdx)'
    r')$'
)
BIOGRAPHY_PATH_RE = re.compile(r'^(?:src/)?content/people/|/people/')
SKIP_MSG_PATTERNS = (
    '[skip-content]',
    'indexing-pass',
    'internal link',
    'paid placement',
    'paid-placement',
    'page-1-2-no-clicks-pass',
    'upgrade editorial identity',
    ': receipts',
    'revert /',
    'audit fix /',
    'fact fix /',
)
SKIP_MSG_PREFIXES = (
    'chore(',
    'fix(review-policy)',
    'fix(verify-live-urls)',
    'fix(alternatives-daily)',
    'fix(alternatives-builder)',
    'fix(search-gap)',
    'feat(mindmap)',
    'feat(eeat)',
    'feat(trust',
    'feat(seo',
    'feat(tested)',
    'feat(layouts)',
    'affiliate:',
)
INTERNAL_SIGNAL_RE = re.compile(
    r'\(tested\s+20\d\d\)|howwetested|worked cost example|in our (?:internal )?(?:testing|cost|scenario|modeling|analysis)|'
    r'we tested|we modeled|read and reviewed|in our conversations with|at layer3labs,\s+we|'
    r'reader survey|reader poll|scenariotable|break-even',
    re.I,
)


def _infer_routine_from_message(msg: str) -> str:
    low = (msg or '').lower()
    if 'people radar' in low or 'people-radar' in low:
        return 'people-radar'
    if 'mindmap pass' in low or 'mindmap-pass' in low:
        return 'podcast-pain-pass' if 'podcast' in low else 'mindmap-pass'
    if 'why-is-' in low or 'price-move' in low:
        return 'price-move-pass'
    if 'alternatives' in low and ('publish ' in low or 'wip ' in low):
        return 'alternatives-daily'
    for name in (
        'alternatives-daily',
        'podcast-pain-pass',
        'price-move-pass',
        'amazon-gear-radar',
        'comparison-miner',
        'autocomplete-paa',
        'search-gap',
        'question-gap',
        'striking-distance',
        'hype-radar',
        'news-radar',
        'people-radar',
        'x-trends',
        'visitor-requests',
        'vertical-roundup',
        'vendor-roundup',
        'trend-pass',
    ):
        if name in low:
            return name
    m = re.match(r'^([a-z0-9_-]+):', low)
    return m.group(1) if m else 'content-publish'


def _normalize_logged_exemption(rec: dict, full_repo: str) -> dict:
    """Apply consistent regulated-domain / biographical exemption rules to logged rows."""
    routine_low = str(rec.get('routine') or '').lower()
    route_str = str(rec.get('route') or '')
    is_alt = 'alternatives' in routine_low
    if full_repo in REGULATED_SITES and not (full_repo == 'jht243/modernwallet' and is_alt):
        if not rec.get('usedInternalProof'):
            rec['legitimateExemption'] = True
    if ('people-radar' in routine_low or BIOGRAPHY_PATH_RE.search(route_str)) and not rec.get('usedInternalProof'):
        rec['legitimateExemption'] = True
    return rec


def _route_keys_for_filename_or_route(val: str) -> list[str]:
    s = (val or '').strip()
    if not s:
        return []
    if s.startswith('/'):
        norm = '/' + s.strip('/')
        leaf = '/' + norm.strip('/').split('/')[-1]
        return list(dict.fromkeys([norm, leaf]))
    p = Path(s)
    stem = p.stem.strip('/')
    if not stem:
        return [s]
    return list(dict.fromkeys([s, f'/{stem}']))


def _discover_fleet_repos() -> list[tuple[str, str]]:
    jht_raw = subprocess.check_output(
        ['gh', 'repo', 'list', 'jht243', '--limit', '100', '--json', 'name,isArchived,defaultBranchRef'],
        text=True,
    )
    out = []
    for r in json.loads(jht_raw):
        if not r.get('isArchived'):
            br = (r.get('defaultBranchRef') or {}).get('name') or 'main'
            out.append((f"jht243/{r['name']}", br))
    for extra in ['GetOPTHealth/opt-health', 'barrycosta/git-darklight', 'HarmonicaAya/harmonica-ayahuasca-preview']:
        out.append((extra, 'main'))
    return out


def _fetch_file_text_at_ref(full_repo: str, filename: str, ref: str) -> str:
    proc = subprocess.run(
        ['gh', 'api', f'repos/{full_repo}/contents/{filename}?ref={ref}', '--jq', '.content'],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0 or not proc.stdout.strip():
        return ''
    try:
        return base64.b64decode(proc.stdout).decode('utf-8', errors='ignore')
    except Exception:
        return ''


def _scan_repo_window(item: tuple[str, str], since_iso: str) -> list[dict]:
    full_repo, branch = item
    chk = subprocess.run(
        ['gh', 'api', f'repos/{full_repo}/contents/.claude/tools/mindmap-gates.py?ref={branch}', '--jq', '.sha'],
        capture_output=True,
        text=True,
    )
    if chk.returncode != 0 or not chk.stdout.strip():
        return []

    commits_proc = subprocess.run(
        ['gh', 'api', f'repos/{full_repo}/commits?sha={branch}&since={since_iso}&per_page=20'],
        capture_output=True,
        text=True,
    )
    if commits_proc.returncode != 0 or not commits_proc.stdout.strip():
        return []

    try:
        commits = json.loads(commits_proc.stdout)
    except Exception:
        return []

    events: list[dict] = []
    emitted_route_keys: set[str] = set()
    carryover_by_key: dict[str, dict] = {}
    cutoff_dt = dt.datetime.fromisoformat(since_iso.replace('Z', '+00:00'))
    carryover_cutoff_dt = cutoff_dt - dt.timedelta(hours=24)

    # 0. Read committed `reports/internal-proof-log.jsonl` directly:
    #    - Rows with `ts >= cutoff_dt` emit directly.
    #    - Rows within `cutoff_dt - 24h` populate `carryover_by_key` so precheck-to-publish lag
    #      or same-day follow-up edits inherit their verified proof receipt.
    raw_log = _fetch_file_text_at_ref(full_repo, 'reports/internal-proof-log.jsonl', branch)
    if raw_log:
        for ln in raw_log.splitlines():
            if not ln.strip():
                continue
            try:
                rec = _normalize_logged_exemption(json.loads(ln), full_repo)
                ts_s = str(rec.get('timestamp') or '')
                if not ts_s:
                    continue
                rec_dt = dt.datetime.fromisoformat(ts_s.replace('Z', '+00:00'))
                if rec_dt < carryover_cutoff_dt:
                    continue
                rec['repoFull'] = full_repo
                rt = str(rec.get('route') or '').strip()
                rkeys = _route_keys_for_filename_or_route(rt)
                for rk in rkeys:
                    prev = carryover_by_key.get(rk)
                    if prev is None or rec.get('usedInternalProof') or not prev.get('usedInternalProof'):
                        carryover_by_key[rk] = rec
                if rec_dt >= cutoff_dt:
                    events.append(rec)
                    emitted_route_keys.update(rkeys)
            except Exception:
                pass

    # Process commits oldest-first so initial page creation in commit N carries forward to polish commit N+1
    for c in reversed(commits):
        sha = c.get('sha', '')
        msg = ((c.get('commit') or {}).get('message') or '').splitlines()[0]
        committed_at = ((c.get('commit') or {}).get('committer') or {}).get('date') or ''
        msg_low = msg.lower()
        if any(p in msg_low for p in SKIP_MSG_PATTERNS) or msg_low.startswith(SKIP_MSG_PREFIXES):
            continue

        detail_proc = subprocess.run(
            ['gh', 'api', f'repos/{full_repo}/commits/{sha}'],
            capture_output=True,
            text=True,
        )
        if detail_proc.returncode != 0:
            continue
        try:
            detail = json.loads(detail_proc.stdout)
        except Exception:
            continue

        files = detail.get('files') or []
        proof_log_patch = next((f.get('patch', '') for f in files if f.get('filename') == 'reports/internal-proof-log.jsonl'), '')
        parsed_from_log = False
        if proof_log_patch:
            for ln in proof_log_patch.splitlines():
                if ln.startswith('+') and not ln.startswith('+++'):
                    try:
                        rec = _normalize_logged_exemption(json.loads(ln[1:]), full_repo)
                        rec['commitSha'] = sha[:10]
                        rec['repoFull'] = full_repo
                        rkeys = _route_keys_for_filename_or_route(str(rec.get('route') or ''))
                        for rk in rkeys:
                            carryover_by_key[rk] = rec
                        if not any(rk in emitted_route_keys for rk in rkeys):
                            events.append(rec)
                            emitted_route_keys.update(rkeys)
                        parsed_from_log = True
                    except Exception:
                        pass
        if parsed_from_log:
            continue

        content_files = [f for f in files if CONTENT_PATH_RE.match(f.get('filename', ''))]
        if not content_files:
            continue
        pool_presented = any('pool-receipt.json' in f.get('filename', '') for f in files)
        routine = _infer_routine_from_message(msg)
        is_reg = full_repo in REGULATED_SITES and not (full_repo == 'jht243/modernwallet' and routine == 'alternatives-daily')

        commit_events = []
        had_concrete_slug = False
        for cf in content_files:
            fname = cf.get('filename', '')
            patch_added = '\n'.join(
                ln[1:] for ln in (cf.get('patch') or '').splitlines() if ln.startswith('+') and not ln.startswith('+++')
            )
            if len(patch_added.strip()) < 250:
                continue
            has_internal = bool(INTERNAL_SIGNAL_RE.search(patch_added))
            # On follow-up edits (`modified`) where the diff didn't touch the existing proof block, check full file at sha
            if not has_internal and cf.get('status') == 'modified' and fname.endswith(('.md', '.mdx')):
                full_txt = _fetch_file_text_at_ref(full_repo, fname, sha)
                if full_txt and INTERNAL_SIGNAL_RE.search(full_txt):
                    has_internal = True

            slugs = list(dict.fromkeys(re.findall(r'"?slug"?\s*:\s*["\']([a-z0-9/-]+)["\']', patch_added)))
            if not slugs and fname.endswith(('.md', '.mdx')):
                slugs = [Path(fname).stem]
            if slugs:
                had_concrete_slug = True
            routes = [f"/{s.lstrip('/')}" for s in slugs] if slugs else [fname]
            is_bio = routine == 'people-radar' or bool(BIOGRAPHY_PATH_RE.search(fname))
            is_exempt = is_reg or is_bio

            for route in routes:
                rkeys = _route_keys_for_filename_or_route(route)
                if any(rk in emitted_route_keys for rk in rkeys):
                    continue
                carried = next((carryover_by_key[rk] for rk in rkeys if rk in carryover_by_key), None)
                if carried is not None:
                    ev_copy = dict(carried)
                    ev_copy['commitSha'] = sha[:10]
                    ev_copy['timestamp'] = committed_at or ev_copy.get('timestamp')
                    events.append(ev_copy)
                    emitted_route_keys.update(rkeys)
                    continue

                why_not = None
                if not has_internal:
                    if is_bio:
                        why_not = 'Valid exemption: public-figure biographical profile/update.'
                    elif is_reg:
                        why_not = 'Valid domain exemption: regulated medical/psychedelic/legal/policy publication.'
                    elif pool_presented:
                        why_not = 'Pool was presented in prompt artifacts, but draft published using external primary sources only.'
                    else:
                        why_not = 'Published without pool receipt (routine ran prior to pool rollout or bypassed write-packet builder).'

                ev = {
                    'timestamp': committed_at,
                    'site': full_repo.split('/')[-1],
                    'repoFull': full_repo,
                    'commitSha': sha[:10],
                    'routine': routine,
                    'route': route,
                    'pageCategory': (
                        'public-figure-biography'
                        if is_bio
                        else ('regulated-domain' if is_reg else 'content-publish')
                    ),
                    'usedInternalProof': has_internal,
                    'proofTypesUsed': ['detected-in-diff'] if has_internal else [],
                    'poolPresented': pool_presented,
                    'legitimateExemption': is_exempt,
                    'whyNotUsed': why_not,
                    'publishedStatus': 'published',
                }
                commit_events.append(ev)

        if had_concrete_slug or any(str(ev.get('route') or '').startswith('/') for ev in commit_events):
            commit_events = [ev for ev in commit_events if str(ev.get('route') or '').startswith('/')]
        for ev in commit_events:
            rkeys = _route_keys_for_filename_or_route(str(ev.get('route') or ''))
            if any(rk in emitted_route_keys for rk in rkeys):
                continue
            for rk in rkeys:
                carryover_by_key[rk] = ev
            emitted_route_keys.update(rkeys)
            events.append(ev)
    return events


def run_monitor(hours: float = 1.0) -> dict:
    now = dt.datetime.now(dt.timezone.utc)
    cutoff = now - dt.timedelta(hours=hours)
    since_iso = cutoff.replace(microsecond=0).isoformat().replace('+00:00', 'Z')

    seen_keys = set()
    all_events = []

    # 1. Read local `~/.claude/logs/internal-proof-log.jsonl`
    local_log = Path.home() / '.claude/logs/internal-proof-log.jsonl'
    if local_log.is_file():
        for ln in local_log.read_text(errors='ignore').splitlines():
            if not ln.strip():
                continue
            try:
                rec = json.loads(ln)
                if str(rec.get('repo') or '').startswith('tmp') or str(rec.get('jobId') or '').startswith('test-') or rec.get('routine') == 'Synthetic test fixture':
                    continue
                repo_name = str(rec.get('repo') or rec.get('site') or '').strip()
                rec = _normalize_logged_exemption(rec, f'jht243/{repo_name}')
                ts_str = str(rec.get('timestamp') or '')
                ts = dt.datetime.fromisoformat(ts_str.replace('Z', '+00:00'))
                if ts >= cutoff:
                    key = (rec.get('site'), rec.get('route'), rec.get('jobId') or ts_str[:16])
                    if key not in seen_keys:
                        seen_keys.add(key)
                        all_events.append(rec)
            except Exception:
                pass

    # 2. Scan all 40 fleet repos on GitHub in parallel
    repos = _discover_fleet_repos()
    with ThreadPoolExecutor(max_workers=10) as pool:
        for repo_events in pool.map(lambda r: _scan_repo_window(r, since_iso), repos):
            for ev in repo_events:
                key = (ev.get('site'), ev.get('route'), ev.get('commitSha') or ev.get('jobId'))
                if key not in seen_keys:
                    seen_keys.add(key)
                    all_events.append(ev)

    with_proof = [e for e in all_events if e.get('usedInternalProof')]
    empty_exempt = [e for e in all_events if not e.get('usedInternalProof') and e.get('legitimateExemption')]
    empty_actionable = [e for e in all_events if not e.get('usedInternalProof') and not e.get('legitimateExemption')]

    by_routine: dict[str, dict] = {}
    for e in all_events:
        rt = str(e.get('routine') or 'unknown')
        bucket = by_routine.setdefault(rt, {'totalPublished': 0, 'withInternalProof': 0, 'emptyExempt': 0, 'emptyActionable': 0})
        bucket['totalPublished'] += 1
        if e.get('usedInternalProof'):
            bucket['withInternalProof'] += 1
        elif e.get('legitimateExemption'):
            bucket['emptyExempt'] += 1
        else:
            bucket['emptyActionable'] += 1

    return {
        'checkedAt': now.replace(microsecond=0).isoformat().replace('+00:00', 'Z'),
        'windowHours': hours,
        'since': since_iso,
        'fleetReposScanned': len(repos),
        'totalPagesPublished': len(all_events),
        'pagesWithInternalProof': len(with_proof),
        'pagesEmptyLegitimateExemption': len(empty_exempt),
        'pagesEmptyActionable': len(empty_actionable),
        'routineBreakdown': by_routine,
        'actionableEmptyPages': empty_actionable,
        'exemptEmptyPages': empty_exempt,
        'withProofPages': with_proof,
    }


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--hours', type=float, default=1.0, help='Lookback window in hours (default: 1.0)')
    args = p.parse_args()
    report = run_monitor(hours=args.hours)
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
