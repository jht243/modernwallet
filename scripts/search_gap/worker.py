#!/usr/bin/env python3
"""Search-to-article intake and completion gate; stdlib only, no mindmap changes."""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
import uuid


def read(path):
    return json.loads(Path(path).read_text())


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def require(ok, message):
    if not ok:
        raise ValueError(message)


class Store:
    def __init__(self):
        self.url = os.environ.get('SUPABASE_URL', '').rstrip('/')
        self.key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        require(self.url and self.key, 'Supabase credentials missing; intake failed, not empty')

    def request(self, path, method='GET', body=None):
        headers = {'apikey': self.key, 'Authorization': 'Bearer '+self.key,
                   'Content-Type': 'application/json', 'Prefer': 'return=representation'}
        req = urllib.request.Request(self.url+'/rest/v1/'+path, method=method,
                                     headers=headers, data=json.dumps(body).encode() if body is not None else None)
        with urllib.request.urlopen(req, timeout=60) as response:
            raw = response.read()
            return json.loads(raw) if raw else None

    def pending(self, site):
        self.request('rpc/search_gap_harvest', 'POST', {'p_site': site})
        rows, offset = [], 0
        while True:
            params = urllib.parse.urlencode({'site': 'eq.'+site, 'resolved_at': 'is.null',
                'select': 'event_id,payload', 'order': 'event_id.asc', 'limit': 500, 'offset': offset})
            page = self.request('search_gap_queue?'+params)
            require(isinstance(page, list), 'Invalid intake response')
            rows.extend(page)
            if len(page) < 500:
                return rows
            offset += len(page)

    def resolve(self, site, ids, receipt):
        # Only exact observations in the saved intake; later repeats remain pending.
        for i in range(0, len(ids), 100):
            params = urllib.parse.urlencode({'site': 'eq.'+site,
                'event_id': 'in.('+','.join(ids[i:i+100])+')', 'resolved_at': 'is.null'})
            self.request('search_gap_queue?'+params, 'PATCH', {
                'resolution': receipt, 'resolved_at': dt.datetime.now(dt.timezone.utc).isoformat()})


def intake(site, store, output):
    rows = store.pending(site)
    groups = {}
    for row in rows:
        p = row['payload']
        term = ' '.join(p['term'].lower().split())
        kind = 'chat' if p.get('source') == 'chatbot' else 'search'
        key = hashlib.sha256((kind+'\0'+term).encode()).hexdigest()
        c = groups.setdefault(key, {'id': key, 'term': p['term'], 'kind': kind,
            'count': 0, 'paths': [], 'eventIds': [], 'firstSeen': p['created_at'], 'lastSeen': p['created_at']})
        c['count'] += 1
        c['eventIds'].append(row['event_id'])
        c['firstSeen'] = min(c['firstSeen'], p['created_at'])
        c['lastSeen'] = max(c['lastSeen'], p['created_at'])
        if p.get('path') and p['path'] not in c['paths']:
            c['paths'].append(p['path'])
    packet = {'ok': True, 'site': site, 'runId': uuid.uuid4().hex,
              'candidateCount': len(groups), 'candidates': list(groups.values()),
              'bootstrapSince': '2026-11-01T00:00:00Z', 'pendingEventCount': len(rows)}
    path = Path(output) if output else Path('reports/search-gap/intakes')/(packet['runId']+'.json')
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(packet, ensure_ascii=False, indent=2)+'\n')
    return dict(packet, intakeFile=str(path), intakeSha256=digest(path))


def recovery_preview(artifacts, approved, check_render):
    """Reconcile a historical live-only review using a separately running current build.

    The original approval remains unchanged and is never described as prepublication.
    """
    import importlib.util
    import re
    proof = artifacts.get('postPublicationRecovery', {})
    require(proof.get('method') == 'retrospective-exact-render',
            'Live-only historical approval needs explicit retrospective recovery evidence')
    require(proof.get('originalApprovedSha256') == digest(artifacts['approved']),
            'Recovery must retain the exact original approval')
    commit = proof.get('publishedCommit', '')
    require(re.fullmatch('[0-9a-f]{40}', commit) is not None,
            'Use the original actually published full commit')
    subprocess.run(['git','merge-base','--is-ancestor',commit,'origin/main'],
                   check=True,capture_output=True)
    preview = read(proof['preview'])
    require(urllib.parse.urlsplit(preview['baseUrl']).hostname in ('127.0.0.1','localhost','::1'),
            'Retrospective recovery requires an independently running local build')
    require(preview['manifest'] == approved['manifest'], 'Recovery preview scope changed')
    require(dt.datetime.fromisoformat(preview['capturedAt'].replace('Z','+00:00')) >
            dt.datetime.fromisoformat(approved['capturedAt'].replace('Z','+00:00')),
            'Retain the original review date and the actual later reconciliation date')
    require({r['path']:r['fingerprint'] for r in preview['routes']} ==
            {r['path']:r['fingerprint'] for r in approved['routes']},
            'Recovery build differs from the independently reviewed output')
    if check_render:
        helper = Path('.claude/tools/rendered-audit.py').resolve()
        spec = importlib.util.spec_from_file_location('search_recovery_renderer', helper)
        renderer = importlib.util.module_from_spec(spec);spec.loader.exec_module(renderer)
        renderer.compare(approved,preview,read(artifacts['review']),require_live=False)
        with tempfile.TemporaryDirectory(prefix='search-gap-recovery-preview-') as folder:
            fresh = renderer.capture(approved['manifest'],preview['baseUrl'],str(Path(folder)/'preview.json'),comparison_only=True)
            renderer.compare(approved,fresh,read(artifacts['review']),require_live=False)
    return proof


def validate_completion(packet, completion, check_render=True):
    require(completion['site'] == packet['site'] and completion['runId'] == packet['runId'], 'Wrong site/run')
    chart = completion['chart']
    review = read(completion['chartReview'])
    require(review.get('verdict') == 'PASS' and review.get('reviewer') and review.get('author')
            and review['reviewer'] != review['author'], 'Independent chart decision review required')
    require(review.get('chartSha256') == digest(chart), 'Chart changed after decision review')
    require(review.get('intakeSha256') == completion.get('intakeSha256'), 'Review must bind exact intake')
    candidates = {c['id']: c for c in packet['candidates']}
    decisions = completion['decisions']
    require(len(decisions) == len(candidates) and {d['id'] for d in decisions} == set(candidates),
            'Every candidate needs exactly one decision, including pending work')
    require(review.get('decisionsSha256') == hashlib.sha256(json.dumps(decisions, sort_keys=True).encode()).hexdigest(),
            'Dispositions differ from independent chart review')
    for decision in decisions:
        require(decision['status'] in ('published', 'no-addition', 'dropped', 'pending'), 'Invalid decision')
        require(len(decision.get('reason', '').strip()) >= 20, 'Concrete reason required')
    changed = {p for d in decisions if d['status'] == 'published' for p in d.get('paths', [])}
    require(all(d.get('paths') for d in decisions if d['status'] == 'published'), 'Published decision lacks routes')
    if changed:
        artifacts = completion['rendered']
        approved = read(artifacts['approved'])
        host = urllib.parse.urlsplit(approved['manifest']['canonicalBase']).hostname or ''
        require(host.removeprefix('www.') == packet['site'].removeprefix('www.'), 'Cross-site render refused')
        preview_host = urllib.parse.urlsplit(approved['baseUrl']).hostname or ''
        if not preview_host or preview_host.removeprefix('www.') == host.removeprefix('www.'):
            require(artifacts.get('postPublicationRecovery'),
                    'Approved candidate must be rendered separately from production; two live captures cannot prove publication matches a reviewed preview')
            recovery_preview(artifacts,approved,check_render)
        require(changed <= {r['path'] for r in approved['routes']}, 'Render does not cover published routes')
        if check_render:
            helper = str(Path('.claude/tools/rendered-audit.py'))
            subprocess.run([sys.executable, helper, 'check', '--snapshot', artifacts['approved'],
                            '--review', artifacts['review'], '--recapture'], check=True, capture_output=True)
            subprocess.run([sys.executable, helper, 'compare', '--approved', artifacts['approved'],
                            '--live', artifacts['live'], '--review', artifacts['review']], check=True, capture_output=True)
            # A saved live receipt alone cannot establish what is served now.
            with tempfile.TemporaryDirectory(prefix='search-gap-live-') as folder:
                manifest = Path(folder)/'manifest.json'
                manifest.write_text(json.dumps(approved['manifest']))
                fresh = str(Path(folder)/'live.json')
                subprocess.run([sys.executable, helper, 'capture', '--manifest', str(manifest),
                    '--base-url', approved['manifest']['canonicalBase'], '--out', fresh], check=True, capture_output=True)
                subprocess.run([sys.executable, helper, 'compare', '--approved', artifacts['approved'],
                    '--live', fresh, '--review', artifacts['review']], check=True, capture_output=True)
    return decisions


def finish(intake_path, completion_path, store):
    packet, completion = read(intake_path), read(completion_path)
    require(completion.get('intakeSha256') == digest(intake_path), 'Intake changed')
    decisions = validate_completion(packet, completion)
    # Validate all evidence before resolving any observation. Pending is never acknowledged.
    for decision in decisions:
        if decision['status'] != 'pending':
            ids = next(c['eventIds'] for c in packet['candidates'] if c['id'] == decision['id'])
            store.resolve(packet['site'], ids, {'runId': packet['runId'], 'decision': decision,
                'completionSha256': digest(completion_path), 'chartReviewSha256': digest(completion['chartReview'])})
    pending = sum(d['status'] == 'pending' for d in decisions)
    return {'ok': not pending, 'status': 'failure' if pending else 'success', 'pendingCandidates': pending,
            'site': packet['site'], 'runId': packet['runId']}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['list-gaps', 'finish'])
    parser.add_argument('--site', required=True)
    parser.add_argument('--out')
    parser.add_argument('--intake')
    parser.add_argument('--completion')
    # Legacy routine prompts still pass these. They must never cap or age out pending work.
    parser.add_argument('--days'); parser.add_argument('--limit'); parser.add_argument('--min-count')
    a = parser.parse_args()
    store = Store()
    if a.command == 'list-gaps':
        result = intake(a.site, store, a.out)
    else:
        require(read(a.intake)['site'] == a.site, 'Cross-site completion refused')
        result = finish(a.intake, a.completion, store)
    print(json.dumps(result, ensure_ascii=False))
    return 0 if result['ok'] else 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as e:
        print(json.dumps({'ok': False, 'status': 'failure', 'error': type(e).__name__+': '+str(e)}))
        sys.exit(1)
