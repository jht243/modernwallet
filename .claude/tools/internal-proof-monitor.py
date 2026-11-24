#!/usr/bin/env python3
"""Fleet-Wide Hourly Monitor for Routines Coming Up Empty on Internal Data / Testing.

Scans both:
  1. Local durable ledger `~/.claude/logs/internal-proof-log.jsonl`
  2. Live GitHub commits across all 40 fleet publications in the lookback window (`--hours`, default 1)
     — reading committed `reports/internal-proof-log.jsonl` rows AND inspecting any net-new content
     commits that published without internal testing, client/operator experience, reader surveys,
     or internal cost/spec scenario modeling.

Never blocks publishing. Groups empty results by routine and site, distinguishing:
  - Legitimate domain exemptions (medical, psychedelic, legal, sanctions)
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

CONTENT_PATH_RE = re.compile(
    r'^(data/(?!testing-|alternatives-pages|sponsored|affiliate).*\.ts|src/content/.*\.(md|mdx|json)|content/.*\.(md|mdx|json)|posts/.*\.md)$'
)
INTERNAL_SIGNAL_RE = re.compile(
    r'\(tested\s+20\d\d\)|howwetested|in our (?:internal )?(?:testing|cost|scenario|modeling|analysis)|'
    r'we tested|we modeled|read and reviewed|in our conversations with|at layer3labs,\s+we|'
    r'reader survey|reader poll|scenariotable|break-even',
    re.I,
)


def _infer_routine_from_message(msg: str) -> str:
    low = (msg or '').lower()
    for name in (
        'alternatives-daily',
        'amazon-gear-radar',
        'comparison-miner',
        'autocomplete-paa',
        'search-gap',
        'question-gap',
        'striking-distance',
        'hype-radar',
        'news-radar',
        'x-trends',
        'visitor-requests',
        'vertical-roundup',
        'mindmap-pass',
    ):
        if name in low:
            return name
    m = re.match(r'^([a-z0-9_-]+):', low)
    return m.group(1) if m else 'content-publish'


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


def _scan_repo_window(item: tuple[str, str], since_iso: str) -> list[dict]:
    full_repo, branch = item
    # Only scan active fleet publications carrying Mindmap gates
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

    events = []
    for c in commits:
        sha = c.get('sha', '')
        msg = ((c.get('commit') or {}).get('message') or '').splitlines()[0]
        committed_at = ((c.get('commit') or {}).get('committer') or {}).get('date') or ''
        if '[skip-content]' in msg.lower() or msg.startswith(('chore(', 'fix(review-policy)', 'feat(mindmap)', 'feat(tested)', 'feat(layouts)', 'affiliate:')):
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
        # 1. Check if commit updated `reports/internal-proof-log.jsonl` directly
        proof_log_patch = next((f.get('patch', '') for f in files if f.get('filename') == 'reports/internal-proof-log.jsonl'), '')
        parsed_from_log = False
        if proof_log_patch:
            for ln in proof_log_patch.splitlines():
                if ln.startswith('+') and not ln.startswith('+++'):
                    try:
                        rec = json.loads(ln[1:])
                        rec['commitSha'] = sha[:10]
                        rec['repoFull'] = full_repo
                        events.append(rec)
                        parsed_from_log = True
                    except Exception:
                        pass
        if parsed_from_log:
            continue

        # 2. Fallback commit diff inspection for any content files added/modified without a log line yet
        content_files = [f for f in files if CONTENT_PATH_RE.match(f.get('filename', ''))]
        if not content_files:
            continue
        pool_presented = any('pool-receipt.json' in f.get('filename', '') or 'prompts/' in f.get('filename', '') for f in files)
        routine = _infer_routine_from_message(msg)
        is_reg = full_repo in REGULATED_SITES

        for cf in content_files:
            patch_added = '\n'.join(
                ln[1:] for ln in (cf.get('patch') or '').splitlines() if ln.startswith('+') and not ln.startswith('+++')
            )
            if len(patch_added.strip()) < 250:
                # Minor link/typo edit, not a substantive page creation
                continue
            has_internal = bool(INTERNAL_SIGNAL_RE.search(patch_added))
            slug_m = re.search(r'"?slug"?\s*:\s*["\']([a-z0-9-]+)["\']', patch_added)
            route = f"/{slug_m.group(1)}" if slug_m else cf.get('filename', '')
            why_not = None
            if not has_internal:
                why_not = (
                    'Valid domain exemption: regulated medical/psychedelic/legal/policy publication.'
                    if is_reg
                    else (
                        'Pool was presented in prompt artifacts, but draft published using external primary sources only.'
                        if pool_presented
                        else 'Published without pool receipt (routine ran prior to pool rollout or bypassed write-packet builder).'
                    )
                )
            events.append({
                'timestamp': committed_at,
                'site': full_repo.split('/')[-1],
                'repoFull': full_repo,
                'commitSha': sha[:10],
                'routine': routine,
                'route': route,
                'pageCategory': 'regulated-domain' if is_reg else 'content-publish',
                'usedInternalProof': has_internal,
                'proofTypesUsed': ['detected-in-diff'] if has_internal else [],
                'poolPresented': pool_presented,
                'legitimateExemption': is_reg,
                'whyNotUsed': why_not,
                'publishedStatus': 'published',
            })
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
