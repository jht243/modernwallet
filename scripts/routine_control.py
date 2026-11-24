#!/usr/bin/env python3
"""Durable competitor-run supervisor. Standard library only; no model/provider keys.

The dedicated control ref is advanced by a normal, non-forced Git push. Each
mutation re-reads it, so a competing writer must retry instead of losing state.
Artifacts are content addressed. No transcripts, environment or command text is
uploaded. Run `--help` for the deliberately small worker protocol.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import sys
import tempfile
import time
import urllib.request

REF = 'refs/heads/automation/competitor-control'
LEASE = 5400
TERMINAL = {'held', 'deferred', 'published'}
SECRET = re.compile(rb'(?:sk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY|ri_[A-Za-z0-9_-]{20,}|AQ\.[A-Za-z0-9_-]{20,})')


PROMISOR_FLAGS = ('-c', 'remote.origin.promisor=true', '-c', 'remote.origin.partialclonefilter=blob:none')


class ControlError(RuntimeError):
    pass


def git(root, *args, data=None, env=None, check=True, timeout=90):
    r = subprocess.run(['git', *PROMISOR_FLAGS, '-C', str(root), *args], input=data, env=env,
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)
    if check and r.returncode:
        # Never repeat remote URLs, command arguments, or credential-bearing stderr.
        raise ControlError('Git control operation failed: ' + args[0])
    return r


def atomic(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, mode='w', delete=False) as f:
        json.dump(value, f, sort_keys=True); f.write('\n'); tmp = f.name
    os.replace(tmp, path)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def fingerprint(root, candidate):
    return sha(json.dumps({p: sha(safe_path(root, p).read_bytes()) for p in candidate['files']}, sort_keys=True).encode())


def normal_identity(store, value):
    identity = '/' + value.strip('/') + '/'
    config = json.loads((store.root / 'scripts/competitor-control.json').read_text())
    return config.get('identity_aliases', {}).get(identity, identity)


def display(state):
    """Bound model-facing state; full immutable history stays on the Git ref."""
    job = state.get('job') or {}
    current = {k: {f: v for f, v in c.items() if f != 'history'} for k, c in state['candidates'].items() if job.get('id') and c.get('job_id') == job['id']}
    index = {k: {'state': c['state'], 'reworks': c['reworks'], 'versions': c.get('version', 1)} for k, c in list(state['candidates'].items())[-100:]}
    counts = {}
    for c in state['candidates'].values(): counts[c['state']] = counts.get(c['state'], 0) + 1
    visible_job = {k: v for k, v in job.items() if k not in {'tools', 'artifacts'}}
    visible_job['tools'] = {k: {f: v for f, v in task.items() if f != 'before'} for k, task in job.get('tools', {}).items()}
    visible_job['artifact_count'] = len(job.get('artifacts', {}))
    return {'version': state['version'], 'state_ref': REF, 'job': visible_job if job else None,
            'candidates': current, 'candidate_index': index, 'candidate_counts': counts,
            'older_candidates_omitted': max(0, len(state['candidates']) - len(index))}


def safe_path(root, relative):
    p = Path(relative)
    root_res = Path(root).resolve()
    if p.is_absolute() and '..' not in p.parts:
        try:
            rel_p = p.resolve().relative_to(root_res)
            p = rel_p
            relative = rel_p.as_posix()
        except ValueError:
            pass
    if p.is_absolute() or '..' in p.parts or not p.parts or p.parts[0] in {'.git', '.claude'}:
        raise ControlError('Artifact must be a repository-relative content/evidence path')
    if re.search(r'(?i)(?:^|/)(?:\.env[^/]*|[^/]*credentials[^/]*|[^/]*secret[^/]*|[^/]*transcript[^/]*|[^/]*\.pem)$', relative):
        raise ControlError('Sensitive artifact path refused')
    resolved = (root / p).resolve()
    if root_res not in resolved.parents:
        raise ControlError('Artifact escapes repository')
    return resolved


class Store:
    def __init__(self, root, ref=REF):
        self.ref = ref
        self.root = Path(git(Path(root).resolve(), 'rev-parse', '--show-toplevel').stdout.decode().strip()).resolve()
        gd = git(self.root, 'rev-parse', '--absolute-git-dir').stdout.decode().strip()
        self.local = Path(gd) / 'routine-control-session.json'

    def read(self):
        listing = git(self.root, 'ls-remote', '--exit-code', 'origin', self.ref, check=False)
        if listing.returncode == 2:
            return None, {'version': 1, 'slots': [], 'candidates': {}, 'job': None}
        if listing.returncode:
            raise ControlError('Durable control store unavailable; do not duplicate work')
        revision = listing.stdout.split()[0].decode()
        if git(self.root, 'cat-file', '-e', revision + '^{commit}', check=False).returncode:
            fetched = git(self.root, 'fetch', '--filter=blob:none', '--quiet', '--no-tags', '--no-write-fetch-head',
                          'origin', revision, check=False, timeout=90)
            if fetched.returncode:
                git(self.root, 'fetch', '--quiet', '--no-tags', '--no-write-fetch-head',
                    'origin', revision, timeout=180)
        data = git(self.root, 'show', revision + ':state.json').stdout
        state = json.loads(data)
        if state.get('version') != 1:
            raise ControlError('Unsupported durable control state')
        return revision, state

    def mutate(self, fn, artifacts=()):
        blobs = {}
        expanded_artifacts = []
        for rel in artifacts:
            p = safe_path(self.root, rel)
            if p.is_dir():
                for fp in sorted(p.rglob('*')):
                    if fp.is_file():
                        expanded_artifacts.append(fp.resolve().relative_to(self.root.resolve()).as_posix())
            else:
                expanded_artifacts.append(p.resolve().relative_to(self.root.resolve()).as_posix())
        for rel in expanded_artifacts:
            data = safe_path(self.root, rel).read_bytes()
            digest = sha(data)
            large_source = (
                (rel.startswith('reports/') and '/correction-sources/blobs/' in rel
                 and Path(rel).name in {'guides-new.ts','comparisons-new.ts'}
                 and Path(rel).parent.name == digest)
                or (rel.startswith('reports/content-review-evidence/')
                    and Path(rel).suffix == '.ts'
                    and Path(rel).stem == digest)
            )
            limit = 90_000_000 if large_source else 20_000_000
            if len(data) > limit or SECRET.search(data):
                raise ControlError('Sensitive or oversized artifact refused')
            blobs[rel] = (digest, data)
        for _ in range(5):
            base, state = self.read()
            result = fn(state)
            if isinstance(state.get('job'), dict):
                known_arts = state['job'].setdefault('artifacts', {})
                auto_candidates = []
                for t in (state['job'].get('tools') or {}).values():
                    for nr in (t.get('native_receipts') or []):
                        auto_candidates.append(nr)
                for auto_dir in ('reports/competitor-monitor', 'reports/mindmap-runs'):
                    ad = self.root / auto_dir
                    if ad.is_dir():
                        for fp in sorted(ad.rglob('*')):
                            if fp.is_file():
                                try:
                                    auto_candidates.append(fp.resolve().relative_to(self.root.resolve()).as_posix())
                                except ValueError:
                                    pass
                mp_dir = self.root / 'reports/mindmap-pass'
                if mp_dir.is_dir():
                    for pat in ('*competitor*/approval-manifest.json', '*competitor*/chart-review.json', '*competitor*/readiness.md', '*competitor*/evidence/*/*.json'):
                        for fp in sorted(mp_dir.glob(pat)):
                            if fp.is_file():
                                try:
                                    auto_candidates.append(fp.resolve().relative_to(self.root.resolve()).as_posix())
                                except ValueError:
                                    pass
                for rel in auto_candidates:
                    if rel in blobs:
                        continue
                    try:
                        p = safe_path(self.root, rel)
                        if not p.is_file():
                            continue
                        data = p.read_bytes()
                        if len(data) > 2_000_000 or SECRET.search(data):
                            continue
                        digest = sha(data)
                        if known_arts.get(rel) != digest:
                            blobs[rel] = (digest, data)
                    except (ControlError, OSError):
                        continue
            for rel, (digest, _) in blobs.items():
                state['job'].setdefault('artifacts', {})[rel] = digest
            state_bytes = (json.dumps(state, sort_keys=True, indent=2) + '\n').encode()
            no_lazy_env = dict(
                os.environ,
                GIT_NO_LAZY_FETCH='1',
                GIT_AUTHOR_NAME='routine-controller',
                GIT_AUTHOR_EMAIL='routines@layer3labs.io',
                GIT_COMMITTER_NAME='routine-controller',
                GIT_COMMITTER_EMAIL='routines@layer3labs.io',
            )
            state_oid = git(self.root, 'hash-object', '-w', '--stdin', data=state_bytes, env=no_lazy_env).stdout.decode().strip()
            new_art_oids = {
                digest: git(self.root, 'hash-object', '-w', '--stdin', data=data, env=no_lazy_env).stdout.decode().strip()
                for digest, data in blobs.values()
            }
            root_entries = {}
            if base:
                for line in git(self.root, 'ls-tree', base).stdout.decode().splitlines():
                    meta, name = line.split('\t', 1)
                    mode, kind, oid = meta.split()
                    root_entries[name] = (mode, kind, oid)
            art_entries = {}
            if 'artifacts' in root_entries and root_entries['artifacts'][1] == 'tree':
                for line in git(self.root, 'ls-tree', root_entries['artifacts'][2]).stdout.decode().splitlines():
                    meta, name = line.split('\t', 1)
                    mode, kind, oid = meta.split()
                    art_entries[name] = (mode, kind, oid)
            for digest, oid in new_art_oids.items():
                art_entries[digest] = ('100644', 'blob', oid)
            if art_entries:
                art_input = ''.join(
                    f'{mode} {kind} {oid}\t{name}\n' for name, (mode, kind, oid) in sorted(art_entries.items())
                ).encode()
                art_tree = git(self.root, 'mktree', '--missing', data=art_input, env=no_lazy_env).stdout.decode().strip()
                root_entries['artifacts'] = ('040000', 'tree', art_tree)
            root_entries['state.json'] = ('100644', 'blob', state_oid)
            root_input = ''.join(
                f'{mode} {kind} {oid}\t{name}\n' for name, (mode, kind, oid) in sorted(root_entries.items())
            ).encode()
            tree = git(self.root, 'mktree', '--missing', data=root_input, env=no_lazy_env).stdout.decode().strip()
            args = ['commit-tree', tree] + (['-p', base] if base else [])
            commit = git(self.root, *args, data=b'Checkpoint competitor controller\n', env=no_lazy_env).stdout.decode().strip()
            push = git(self.root, 'push', '--quiet', 'origin', commit + ':' + self.ref, env=no_lazy_env, check=False, timeout=120)
            if not push.returncode:
                return result
        raise ControlError('Control ref contention/unavailable; retry later without duplicating work')

    def session(self):
        if not self.local.is_file():
            raise ControlError('No native session receipt; start the routine in Claude Code')
        value = json.loads(self.local.read_text())
        if not value.get('active'):
            raise ControlError('Competitor controller is not active')
        return value['session']

    def owned(self, state, owner):
        job = state.get('job')
        if not job or job.get('owner') != owner or job.get('status') != 'running':
            raise ControlError('Job ownership changed; stop this worker')
        job['lease_until'] = time.time() + LEASE
        return job

    def restore(self, revision, state):
        restored, conflicts = [], []
        for rel, digest in (state.get('job') or {}).get('artifacts', {}).items():
            p = safe_path(self.root, rel)
            if p.exists() and sha(p.read_bytes()) == digest:
                continue
            data = git(self.root, 'show', revision + ':artifacts/' + digest).stdout
            if sha(data) != digest:
                raise ControlError('Stored artifact hash mismatch')
            if p.exists():
                p = self.root / 'reports/routine-control/recovered' / digest / rel
                conflicts.append(rel)
            p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(data); restored.append(str(p.relative_to(self.root)))
        return {'restored': restored, 'conflicts': conflicts}


def _open_handoff_state(root):
    handoff_path = root / '.claude/tools/competitor-handoff.py'
    store_path = root / '.claude/tools/workflow-control-store.py'
    if not handoff_path.is_file() or not store_path.is_file():
        return {'has_open': False, 'pending_reviews': [], 'publication_gaps': []}
    try:
        spec = importlib.util.spec_from_file_location('routine_competitor_handoff', handoff_path)
        mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
        open_digests = []
        conn = mod.connection(root)
        if conn is not None:
            _, hstore = conn; _, hstate = hstore.read()
            open_digests = [
                d for d, row in hstate.get('competitorIntakes', {}).items()
                if not row.get('complete') and not (root / f'reports/competitor-monitor/intakes/{d}.done.json').is_file()
            ]
        pending_revs = []
        pub_gaps = []
        for d in open_digests:
            pending_revs.extend(mod.pending_reviews(root, d))
            pub_gaps.extend(mod.publication_gaps(root, d))
        return {
            'has_open': bool(open_digests or pending_revs or pub_gaps),
            'pending_reviews': pending_revs,
            'publication_gaps': pub_gaps,
        }
    except Exception:
        return {'has_open': False, 'pending_reviews': [], 'publication_gaps': []}


def _handoff_next_instruction(handoff_info):
    pending = handoff_info.get('pending_reviews') or []
    gaps = handoff_info.get('publication_gaps') or []
    if pending:
        items = [{'route': r.get('route'), 'jobId': r.get('jobId'), 'round': r.get('round')} for r in pending]
        return (
            'OPEN COMPETITOR INTAKE RECOVERY: (1) Run `python3 scripts/competitor_monitor/scraper.py detect` FIRST to activate the open intake. '
            '(2) Prior rounds/reworks are ALREADY recorded — DO NOT hold at the rework cap. Complete the pending independent review on '
            + json.dumps(items)
            + ': if editing any file outside reports/ (e.g. cluster nav), run `python3 scripts/routine_control.py bind` BEFORE auditing; '
            'spawn ONE read-only `mindmap-audit` worker with `REVIEW_RECEIPT: reports/<run>/audit/rendered-review-r3.json` in the first prompt header (before any blank line), '
            'passing `--handoff reports/<run>/handoff-audit-r3.json` in `workflow-preflight.py prepare`, plus `rendered/candidate-r3.json` and `audit/review-skeleton.json`. '
            '(3) After SubagentStop exports the receipt, MAIN runs `python3 .claude/tools/audit-batch.py finalize-review --snapshot <candidate-r3.json> --review <rendered-review-r3.json> --job-id <jobId> --reviewer <agent_id> --preflight <preflight_dir> --out-dir <audit/admissions> && python3 .claude/tools/content-review-policy.py record --review <rendered-review-r3.json> && python3 .claude/tools/rendered-audit.py check --snapshot <candidate-r3.json> --review <rendered-review-r3.json>`. '
            '(4) Under releaseAtAuditLimit=true, publish the exact reviewed candidate live, verify live + `rendered-audit.py compare` + `record-deployment`, run `scraper.py record` + `baseline`, `disposition --status published`, and `finish --status complete`.'
        )
    if gaps:
        items = [{'route': r.get('route'), 'jobId': r.get('jobId')} for r in gaps]
        return (
            'OPEN COMPETITOR INTAKE PUBLICATION RECOVERY: Run `python3 scripts/competitor_monitor/scraper.py detect` FIRST, then publish the already-reviewed open routes '
            + json.dumps(items)
            + ' live (releaseAtAuditLimit=true — do NOT hold), run `rendered-audit.py compare` + `record-deployment`, `scraper.py record` + `baseline`, `disposition --status published`, and `finish --status complete`.'
        )
    return 'Resume the existing competitor ledger and saved reviews before discovery. Follow native source/review/publication contracts.'


def _matches_handoff_row(store, key, cand, row):
    route = str(row.get('route') or '')
    if not route:
        return False
    if normal_identity(store, route) == key:
        return True
    slug = '/' + route.strip('/').rsplit('/', 1)[-1] + '/'
    job_id = str(row.get('jobId') or '')
    return slug == key and (not job_id or job_id in str(cand.get('path') or ''))


def begin(store, run_id, force_due=False):
    config = json.loads((store.root / 'scripts/competitor-control.json').read_text())
    local = json.loads(store.local.read_text())
    owner = local['session']
    # Refresh the actual remote-tracking ref, not just FETCH_HEAD. This is the
    # Opt Health false-positive scanner fix, shared by every invocation.
    branch = config.get('default_branch', 'main')
    target = 'refs/remotes/origin/' + branch
    git(store.root, 'fetch', '--quiet', '--no-tags', 'origin', '+refs/heads/' + branch + ':' + target)
    advertised = git(store.root, 'ls-remote', 'origin', 'refs/heads/' + branch).stdout.split()[0].decode()
    if git(store.root, 'rev-parse', target).stdout.decode().strip() != advertised:
        raise ControlError('Published source moved; rerun startup before claiming work')
    check = subprocess.run(['bash', '.claude/tools/workflow-start.sh', '--cloud', '--run-id', run_id],
                           cwd=store.root, capture_output=True, timeout=180)
    if check.returncode:
        raise ControlError('Source freshness failed; preserve work and integrate listed dependencies')
    handoff_info = _open_handoff_state(store.root)
    now = dt.datetime.now(dt.timezone.utc)
    due = now.isoweekday() % 7 in config['utc_days'] and now.hour == config['utc_hour']
    slot = now.strftime('%Y-%m-%d') + ':' + str(config['utc_hour'])
    def change(state):
        job = state.get('job')
        if job and job['status'] == 'running':
            if job['owner'] != owner and job['lease_until'] > time.time():
                return {'action': 'busy', 'next': 'Another session owns the live lease. End without discovery.'}
            if job['owner'] != owner:
                for task in job['tools'].values():
                    if task['status'] == 'pending':
                        task.update(status='interrupted', error='Previous session lease expired; no verdict inferred')
                for command in job.get('commands', {}).values():
                    if command['status'] == 'running':
                        command.update(status='interrupted', error='Previous session ended; verify effects before retrying')
                for c in state['candidates'].values():
                    if c.get('operation') == 'pending':
                        c.update(state='deferred', disposition_reason='Interrupted provider operation with unknown result; preserve identity/counters and avoid duplicate paid generation')
                job['next'] = ('Previous session interrupted. Relaunch only interrupted independent reviews with no completed receipt; defer uncertain paid outcomes. Resume the exact saved step: ' + job['next'])
            if handoff_info['has_open'] and isinstance(job.get('artifacts'), dict):
                job['artifacts'] = {
                    k: v for k, v in job['artifacts'].items()
                    if not re.search(r'(?:held\.md$|blocked-evidence\.json$)', k)
                }
            for k, c in state['candidates'].items():
                if any(_matches_handoff_row(store, k, c, r) for r in handoff_info['pending_reviews']):
                    c['job_id'] = job['id']
                    c.pop('disposition_evidence', None); c.pop('disposition_reason', None)
                    if c.get('state') == 'held':
                        c['state'] = 'needs-independent-review'
                elif any(_matches_handoff_row(store, k, c, r) for r in handoff_info['publication_gaps']):
                    c['job_id'] = job['id']
                    c.pop('disposition_evidence', None); c.pop('disposition_reason', None)
                    if c.get('state') == 'held' and native_release_eligible(store, c):
                        c['state'] = 'reviewed'
            job['owner'] = owner; job['lease_until'] = time.time() + LEASE; job['head_oid'] = advertised
            return {'action': 'resume', 'next': job['next'], 'job': job['id']}
        queued = state.get('requested_slot')
        selected_slot = queued or slot
        can_start_slot = bool((due or force_due or queued) and selected_slot not in state['slots'])
        if not can_start_slot and not handoff_info['has_open']:
            return {'action': 'idle', 'next': 'Recovery tick: no unfinished job and no new harvest slot. End without discovery, models, report or publication.'}
        if can_start_slot:
            state['slots'].append(selected_slot)
        state.pop('requested_slot', None)
        for hold in config.get('historical_holds', []):
            identity = '/' + hold['identity'].strip('/') + '/'
            state['candidates'].setdefault(identity, {'path': hold['evidence'], 'files': [], 'state': 'held', 'reworks': hold['reworks'], 'reviews': [], 'writer': 'historical-native-run', 'operation': 'complete', 'historical_evidence': hold['evidence'], 'historical_branch': hold.get('evidence_branch', 'main'), 'historical_commit': hold.get('evidence_commit')})
        prior_artifacts = dict((state.get('job') or {}).get('artifacts') or {})
        if handoff_info['has_open']:
            prior_artifacts = {
                k: v for k, v in prior_artifacts.items()
                if not re.search(r'(?:held\.md$|blocked-evidence\.json$)', k)
            }
        open_rows = handoff_info['pending_reviews'] + handoff_info['publication_gaps']
        for k, c in state['candidates'].items():
            if c.get('state') not in TERMINAL or any(_matches_handoff_row(store, k, c, r) for r in open_rows):
                c['job_id'] = run_id
            if any(_matches_handoff_row(store, k, c, r) for r in handoff_info['pending_reviews']):
                c.pop('disposition_evidence', None); c.pop('disposition_reason', None)
                if c.get('state') == 'held':
                    c['state'] = 'needs-independent-review'
            elif any(_matches_handoff_row(store, k, c, r) for r in handoff_info['publication_gaps']):
                c.pop('disposition_evidence', None); c.pop('disposition_reason', None)
                if c.get('state') == 'held' and native_release_eligible(store, c):
                    c['state'] = 'reviewed'
        state['job'] = {'id': run_id, 'owner': owner, 'lease_until': time.time() + LEASE,
                        'status': 'running', 'head_oid': advertised, 'tools': {}, 'artifacts': prior_artifacts,
                        'next': _handoff_next_instruction(handoff_info)}
        return {'action': 'start', 'next': state['job']['next'], 'job': run_id}
    outcome = store.mutate(change)
    if outcome['action'] in {'start', 'resume'}:
        local.update(active=True, run_id=run_id); atomic(store.local, local)
        rev, state = store.read(); outcome.update(store.restore(rev, state))
        outcome.update({k: v for k, v in display(state).items() if k != 'job'})
        install_push_hook(store)
    return outcome


def install_push_hook(store):
    raw = git(store.root, 'rev-parse', '--git-path', 'hooks/pre-push').stdout.decode().strip()
    path = Path(raw) if Path(raw).is_absolute() else store.root / raw
    path = path.resolve()
    gd = Path(git(store.root, 'rev-parse', '--absolute-git-dir').stdout.decode().strip())
    if gd not in path.parents and store.root not in path.parents:
        raise ControlError('Existing global hooks directory cannot be modified; install the release check in the native deployment wrapper')
    path.parent.mkdir(parents=True, exist_ok=True)
    original = path.with_name('pre-push.before-routine-control')
    if path.exists() and 'routine-control-pre-push-v1' not in path.read_text():
        if original.exists():
            raise ControlError('Existing push hook changed; preserve both versions before reinstalling')
        path.rename(original)
    script = shlex.quote(str(store.root / 'scripts/routine_control.py'))
    root = shlex.quote(str(store.root))
    previous = shlex.quote(str(original))
    path.write_text('#!/bin/sh\n# routine-control-pre-push-v1\nset -e\n'
        'receipt=$(mktemp)\ntrap \'rm -f "$receipt"\' EXIT HUP INT TERM\ncat > "$receipt"\n'
        f'python3 {script} --root {root} release-check < "$receipt"\n'
        f'if [ -x {previous} ]; then {previous} "$@" < "$receipt"; fi\n')
    path.chmod(0o755)


def release_check(store, refs):
    if not store.local.exists() or not json.loads(store.local.read_text()).get('active'):
        return
    config = json.loads((store.root / 'scripts/competitor-control.json').read_text())
    if not any(len(x.split()) == 4 and x.split()[2] == 'refs/heads/' + config.get('default_branch', 'main') for x in refs.splitlines()):
        return  # Control-ref checkpoints must never recursively require a publication lease.
    _, state = store.read(); owner = store.session(); store.owned(state, owner)
    for line in refs.splitlines():
        fields = line.split()
        if len(fields) != 4 or fields[2] != 'refs/heads/' + config.get('default_branch', 'main'):
            continue
        local, remote = fields[1], fields[3]
        if local == '0' * 40:
            raise ControlError('Competitor worker cannot delete main')
        if remote == '0' * 40:
            raise ControlError('Competitor worker cannot create a new default branch')
        git(store.root, 'fetch', '--quiet', '--no-tags', '--no-write-fetch-head', 'origin', remote)
        changed = git(store.root, 'diff', '--name-only', '--no-renames', '-z', remote, local).stdout.split(b'\0')
        approved = {}
        for c in state['candidates'].values():
            if c.get('job_id') != state['job']['id']:
                continue  # Old publications cannot approve new work or require old temp files.
            if not native_release_state(c, allow_published=True) or not native_release_eligible(store,c):
                continue
            if fingerprint(store.root, c) != c['reviews'][-1]['digest']:
                continue
            for path in c['files']:
                approved[path] = sha(safe_path(store.root, path).read_bytes())
        for raw in changed:
            path = os.fsdecode(raw)
            if not path or path.startswith('reports/'):
                continue  # records-only progress is independently publishable
            data = git(store.root, 'show', local + ':' + path, check=False)
            if data.returncode or approved.get(path) != sha(data.stdout):
                raise ControlError('Publication refused: changed source has no exact independent reviewed binding: ' + path)


def native_review_ceiling(store, candidate):
    """Apply the existing site policy to this canonical candidate, never reset history."""
    config = store.root / '.claude/content-review-policy.json'
    if not config.is_file(): return 3  # Existing legacy ceiling: initial review + two reworks.
    spec = importlib.util.spec_from_file_location('native_content_review_policy',store.root / '.claude/tools/content-review-policy.py')
    policy = importlib.util.module_from_spec(spec); spec.loader.exec_module(policy)
    path = safe_path(store.root,candidate['path'])
    semantic = {'text':path.read_text() if path.is_file() else ''}
    selected = policy.profile(store.root,semantic,candidate.get('claimCategories',[]),candidate.get('reviewProfile'))
    # Consequential claims can raise the profile; later edits never erase that history.
    old = candidate.get('nativeReviewProfile')
    if old in policy.LEVELS: selected = max([old,selected],key=policy.LEVELS.index)
    candidate['nativeReviewProfile'] = selected
    return policy.LIMITS[selected]


def native_release_state(candidate, allow_published=False):
    if candidate['state'] == 'reviewed' or (allow_published and candidate['state'] == 'published'):
        return True
    # Older controllers persisted a final FAIL as held. Its actual verdict,
    # limit and bytes still have to pass the normal release checks.
    return candidate['state'] == 'held' and candidate['reviews'] and candidate['reviews'][-1]['verdict'] == 'FAIL'


def native_release_eligible(store, candidate):
    reviews = candidate.get('reviews', [])
    if not reviews or not reviews[-1].get('release_eligible', True):
        return False
    if reviews[-1]['verdict'] == 'PASS':
        return True
    config = store.root / '.claude/content-review-policy.json'
    if not config.is_file():
        return False
    policy = json.loads(config.read_text())
    completed = sum(r['verdict'] in ('PASS','FAIL') and r.get('release_eligible', True) for r in reviews)
    hosts=policy.get('canonicalHosts',[])
    scoped=(policy.get('siteId')=='jht243/layer3labs' or
            isinstance(hosts,list) and bool(hosts) and all(isinstance(h,str) and re.fullmatch(r'[a-z0-9.-]+',h) for h in hosts))
    return (scoped and policy.get('releaseAtAuditLimit') is True
            and reviews[-1]['verdict'] == 'FAIL' and completed >= native_review_ceiling(store,candidate))


def native_review_count(candidate):
    return max(len(candidate['reviews']),candidate.get('reworks',0))


def candidate(store, identity, path, operation):
    """Reserve before paying/editing. Canonical route, not filename, owns the cap."""
    owner = store.session(); identity = normal_identity(store, identity)
    def change(state):
        store.owned(state, owner)
        c = state['candidates'].get(identity)
        if operation in {'generate', 'expand'}:
            history = []
            version = 1
            if c:
                if operation == 'expand' and c['state'] == 'published':
                    history = c.get('history', []) + [{k: v for k, v in c.items() if k != 'history'}]
                    version = c.get('version', 1) + 1
                elif operation == 'expand' and not c['reviews'] and c['state'] == 'needs-review' and c['operation'] == 'complete' and path not in c['files']:
                    # Multiple distinct, pre-approved sections belong to one
                    # unreviewed candidate. Never pay twice for the same output.
                    c['files'].append(path); c.update(path=path, state='generating', operation='pending', job_id=state['job']['id'])
                    return c.copy()
                else:
                    raise ControlError('Canonical candidate already exists; recover it, never regenerate/reset')
            c = {'path': path, 'files': [path], 'state': 'generating', 'reworks': 0, 'reviews': [], 'writer': json.loads(store.local.read_text()).get('provider_actor', owner), 'operation': 'pending', 'job_id': state['job']['id'], 'version': version, 'history': history}
            state['candidates'][identity] = c
        elif not c:
            raise ControlError('Register the existing candidate with adopt before correction/review')
        elif operation == 'fix':
            if c['state'] in TERMINAL or c.get('operation') == 'pending':
                raise ControlError('Candidate is terminal or its previous provider result is unresolved; reuse output or defer it')
            if not c['reviews'] or c['reviews'][-1]['verdict'] != 'FAIL':
                raise ControlError('A correction requires actual independent FAIL findings')
            if c.get('corrected_review') != len(c['reviews']):
                if c['reworks'] >= 2 or native_review_count(c) >= native_review_ceiling(store,c):
                    raise ControlError('Review/rework budget exhausted: hold this candidate and continue unrelated work')
                c['reworks'] += 1; c['corrected_review'] = len(c['reviews'])
            c['operation'] = 'pending'; c['state'] = 'correcting'
            c['job_id'] = state['job']['id']
        c['path'] = path
        return c.copy()
    return store.mutate(change)


def complete_candidate(store, identity, path):
    owner = store.session(); identity = normal_identity(store, identity)
    def change(state):
        store.owned(state, owner); c = state['candidates'][identity]
        c.update(path=path, state='needs-review', operation='complete')
        c['digest'] = fingerprint(store.root, c)
    store.mutate(change, [path] + ([path + '.meta.json'] if (store.root / (path + '.meta.json')).exists() else []))


def active_store(root):
    store = Store(root)
    if not store.local.exists() or not json.loads(store.local.read_text()).get('active'):
        return None
    return store


def wake(store, token, now=None):
    """A separate scheduled GitHub worker wakes Claude only for actionable work.

    It edits the body of one dedicated machine-control issue, whose exact title
    is the native routine's issues.edited filter. No new API/fire credentials.
    """
    config_path = store.root / 'scripts/competitor-control.json'
    if not config_path.is_file(): return {'action': 'unconfigured'}
    config = json.loads(config_path.read_text())
    repo, issue = config.get('repo', ''), config.get('wake_issue')
    if not token or not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repo) or not isinstance(issue, int) or issue < 1:
        raise ControlError('Recovery clock requires its repository token and dedicated configured control issue')
    now = time.time() if now is None else now
    day = dt.datetime.fromtimestamp(now, dt.timezone.utc).strftime('%Y-%m-%d')
    start_after = dt.datetime.fromisoformat(config['start_after'].replace('Z', '+00:00')).timestamp()
    handoff_info = _open_handoff_state(store.root)
    head_oid = git(store.root, 'rev-parse', 'HEAD').stdout.decode().strip()
    def reserve(s):
        job = s.get('job')
        pending = bool(job and job['status'] == 'running')
        if pending and job['lease_until'] > now:
            return {'action': 'busy'}
        handoff_recovery = False
        if not pending:
            # Recover a scheduled launch that died before begin could run.
            for age in range(8):
                date = dt.datetime.fromtimestamp(now, dt.timezone.utc) - dt.timedelta(days=age)
                slot_at = date.replace(hour=config['utc_hour'], minute=0, second=0, microsecond=0)
                slot = slot_at.strftime('%Y-%m-%d') + ':' + str(config['utc_hour'])
                if date.isoweekday() % 7 in config['utc_days'] and start_after <= slot_at.timestamp() <= now - 1200 and slot not in s['slots']:
                    s['requested_slot'] = slot; break
            handoff_recovery = bool(handoff_info['has_open'] and (not job or job.get('head_oid') != head_oid))
            if not s.get('requested_slot') and not handoff_recovery:
                return {'action': 'idle'}
        clock = s.setdefault('clock', {})
        if clock.get('day') != day: clock.update(day=day, attempts=0)
        if handoff_recovery and clock.get('woke_head') != head_oid:
            clock['after'] = 0
            clock['attempts'] = min(clock.get('attempts', 0), 2)
        if clock.get('after', 0) > now or clock.get('attempts', 0) >= 3:
            return {'action': 'throttled'}
        clock.update(after=now + 7200, attempts=clock.get('attempts', 0) + 1, status='requested')
        if handoff_recovery:
            clock['woke_head'] = head_oid
        return {'action': 'wake', 'job': (job or {}).get('id'), 'slot': s.get('requested_slot'), 'at': now}
    outcome = store.mutate(reserve)
    if outcome['action'] != 'wake': return outcome
    body = 'Machine control for the competitor supervisor. No human response is required.\n\n' + json.dumps(outcome, sort_keys=True)
    request = urllib.request.Request('https://api.github.com/repos/' + repo + '/issues/' + str(issue),
        data=json.dumps({'body': body}).encode(), method='PATCH', headers={
            'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'competitor-controller'})
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            if response.status != 200: raise ControlError('Control issue update not confirmed')
            result = json.load(response)
            if result.get('number') != issue or result.get('title') != 'competitor-control-wakeup-v1':
                raise ControlError('Control issue identity mismatch')
    except Exception:
        # Ambiguous network results are not immediately replayed: the webhook
        # may already have fired. The next clock can reconcile/retry boundedly.
        store.mutate(lambda s: s['clock'].update(status='delivery-unconfirmed'))
        raise ControlError('Recovery wake-up delivery unconfirmed; preserved for the next clock')
    store.mutate(lambda s: s['clock'].update(status='delivered'))
    return outcome


def run_command(store, key, command):
    """Own long-command output/exit status even when the model turn detaches."""
    owner = store.session()
    def reserve(s):
        job = store.owned(s, owner); commands = job.setdefault('commands', {})
        prior = commands.get(key)
        if prior and prior['status'] == 'complete' and (prior['exit_code'] == 0 or prior.get('attempts', 1) >= 3): return prior
        if prior and prior['status'] == 'running':
            raise ControlError('This exact command is still running; retrieve its status instead of duplicating it')
        if prior and prior['status'] == 'interrupted':
            raise ControlError('Command outcome was interrupted; verify actual effects and checkpoint a new operation before retrying')
        commands[key] = {'status': 'running', 'started': time.time(), 'attempts': (prior or {}).get('attempts', 0) + 1}
        return None
    prior = store.mutate(reserve)
    if prior:
        print(prior.get('output_tail', '')); return prior['exit_code']
    folder = store.local.parent / 'routine-control-outputs'; folder.mkdir(exist_ok=True)
    output = folder / (sha(key.encode()) + '.log')
    with output.open('wb') as f:
        proc = subprocess.Popen(command, cwd=store.root, stdout=f, stderr=subprocess.STDOUT)
        while True:
            try:
                code = proc.wait(timeout=30); break
            except subprocess.TimeoutExpired:
                store.mutate(lambda s: store.owned(s, owner) and None)
    with output.open('rb') as f:
        f.seek(max(0, output.stat().st_size - 6000)); tail = f.read()
    tail = SECRET.sub(b'[credential redacted]', tail).decode(errors='replace')
    def done(s):
        j = store.owned(s, owner)
        j['commands'][key].update(status='complete', exit_code=code, finished=time.time(), output_tail=tail)
    store.mutate(done)
    print(tail); return code


def content_start(root, identity, path, operation):
    store = active_store(root)
    if store:
        candidate(store, identity, str(Path(path).resolve().relative_to(store.root)), operation)


def content_done(root, identity, path):
    store = active_store(root)
    if store:
        complete_candidate(store, identity, str(Path(path).resolve().relative_to(store.root)))


def snapshot(root):
    paths = git(root, 'ls-files', '-z', '--cached', '--others', '--exclude-standard').stdout.split(b'\0')
    result = {}
    for raw in paths:
        rel = os.fsdecode(raw)
        if not rel or rel.startswith(('reports/', '.git/', 'node_modules/')):
            continue
        p = root / rel
        if p.is_file():
            result[rel] = sha(p.read_bytes())
    return result


def worker_task(job, agent):
    matches = [v for v in job.get('tools', {}).values() if agent and v.get('agent') == agent]
    return max(matches, key=lambda v: (v['status'] == 'pending', bool(v.get('authored_receipt')), v.get('created', 0)), default=None)


def agent_review_tasks(job, agent, review=None):
    tasks = [v for v in (job or {}).get('tools', {}).values() if v.get('review') and ((agent and v.get('agent') == agent) or v is review)]
    return tasks or ([review] if review else [])


def reviewer_understanding(store, task, inp, job=None, agent=None):
    """Canonical retained-evidence operations; no candidate/source writes."""
    command = inp.get('command', '')
    if any(c in command for c in '\n\r;&|<>$`'): return None
    try:
        args = shlex.split(command)
        if len(args) < 3 or args[0] not in {'python3', sys.executable}: return None
        script = Path(args[1]) if Path(args[1]).is_absolute() else store.root / args[1]
        if script.resolve() != (store.root / '.claude/tools/instruction-understanding.py').resolve(): return None
        action = args[2]
        required = {'challenge': {'--run-dir'}, 'record': {'--run-dir','--confirmation','--out'}, 'inspect': {'--run-dir','--application'}}.get(action)
        if required is None or len(args[3:]) != 2 * len(required): return None
        values = dict(zip(args[3::2],args[4::2]))
        if set(values) != required: return None
        bases = [(store.root / t['preflight_dir']).resolve() for t in agent_review_tasks(job, agent, task) if t.get('preflight_dir')]
        for key, value in values.items():
            path = safe_path(store.root, value)
            if not any(path == b or b in path.parents for b in bases): return None
            if key == '--run-dir' and not path.is_dir(): return None
            if key in {'--confirmation','--application'} and not path.is_file(): return None
            if key == '--out' and (path.suffix != '.json' or path.exists()): return None
        return dict(inp, run_in_background=False, timeout=max(inp.get('timeout', 0),600000))
    except (ValueError,ControlError,OSError): return None


def reviewer_preflight(store, task, agent, inp, run_id, job=None):
    """Permit the canonical receipt helper, never arbitrary reviewer shell code."""
    command = inp.get('command', '')
    if any(c in command for c in '\n\r;&|<>$`'):
        return None
    try:
        args = shlex.split(command)
        if len(args) < 3 or args[0] not in {'python3', sys.executable}:
            return None
        script = Path(args[1]) if Path(args[1]).is_absolute() else store.root / args[1]
        serial_delivery = script.resolve() == (store.root / '.claude/tools/workflow-delivery-serial.local.py').resolve()
        if not serial_delivery and script.resolve() != (store.root / '.claude/tools/workflow-preflight.py').resolve():
            return None
        action = 'next' if serial_delivery else args[2]
        if action not in {'prepare', 'next', 'check', 'challenge'}: return None
        values = {}; instructions = []; i = 2 if serial_delivery else 3
        while i < len(args):
            key = args[i]; i += 1
            if key == '--cloud': values[key] = True; continue
            if key not in {'--phase', '--instruction', '--run-dir', '--actor', '--run-id', '--reuse', '--part', '--through', '--context-id', '--context-epoch', '--handoff', '--context-packet', '--reuse-application', '--application'} or i == len(args): return None
            value = args[i]; i += 1
            if key == '--instruction': instructions.append(value)
            elif key in values: return None
            else: values[key] = value
        directory = values.get('--run-dir', '')
        actual = safe_path(store.root, directory)
        bases = [(store.root / t['preflight_dir']).resolve() for t in agent_review_tasks(job, agent, task) if t.get('preflight_dir')]
        if not any(actual == b or b in actual.parents for b in bases): return None
        rel_dir = actual.relative_to(store.root.resolve()).as_posix()
        use_serial = serial_delivery or ('--through' in values and action == 'next')
        out = ([args[0], str(store.root / '.claude/tools/workflow-delivery-serial.local.py'), '--run-dir', rel_dir]
               if use_serial else [args[0], str(store.root / '.claude/tools/workflow-preflight.py'), action, '--run-dir', rel_dir])
        if action == 'prepare':
            if values.get('--phase') not in {'build', 'write', 'audit', 'publish'} or not instructions or '--part' in values or '--through' in values: return None
            out += ['--phase', values['--phase'], '--actor', agent, '--run-id', run_id, '--cloud']
            if (store.root / '.claude/tools/workflow-efficiency.py').is_file() or (store.root / '.claude/workflow-policy.local.json').is_file():
                out += ['--context-id', agent, '--context-epoch', values.get('--context-epoch', 'initial')]
            for path in instructions:
                resolved = (store.root / path).resolve()
                commands = (store.root / '.claude/commands').resolve()
                if not re.fullmatch(r'[A-Za-z0-9_./-]+\.md', path) or not resolved.is_file(): return None
                if commands not in resolved.parents and resolved.parent != store.root: return None
                out += ['--instruction', path]
            for key in ('--handoff','--context-packet','--reuse-application'):
                if key not in values:
                    continue
                source = safe_path(store.root, values[key])
                rel = str(source.relative_to(store.root))
                own = actual == source or actual in source.parents
                if not source.is_file() or (not own and task.get('before', {}).get(rel) != sha(source.read_bytes())):
                    return None
                out += [key, rel]
            if '--reuse' in values:
                reuse = safe_path(store.root, values['--reuse'])
                _, state = store.read()
                allowed = [store.root / t['preflight_dir'] for t in state['job']['tools'].values() if t.get('agent') == agent and t.get('preflight_dir')]
                if not any(reuse == p.resolve() or p.resolve() in reuse.parents for p in allowed): return None
                out += ['--reuse', reuse.relative_to(store.root.resolve()).as_posix()]
        else:
            if instructions or set(values) - {'--run-dir','--part','--through','--application'}: return None
            if '--application' in values:
                application = safe_path(store.root, values['--application'])
                if action != 'check' or not any(b in application.parents for b in bases) or not application.is_file():
                    return None
                out += ['--application', application.relative_to(store.root.resolve()).as_posix()]
            if '--part' in values:
                if action != 'next' or not values['--part'].isdigit() or int(values['--part']) < 1: return None
                out += ['--part', values['--part']]
            if '--through' in values:
                if action != 'next' or '--part' not in values or not values['--through'].isdigit() or int(values['--through']) < int(values['--part']): return None
                out += ['--through', values['--through']]
        return dict(inp, command=shlex.join(out), run_in_background=False, timeout=max(inp.get('timeout', 0), 600000))
    except (ValueError, ControlError, OSError):
        return None


def hook(store, event):
    name = event['hook_event_name']; sid = event['session_id']
    if name == 'SessionStart':
        if not event.get('agent_id'):
            atomic(store.local, {'session': sid, 'active': False})
        return {}
    if not store.local.exists() or not json.loads(store.local.read_text()).get('active'):
        return {}
    _, state = store.read(); job = state.get('job') or {}
    if job.get('owner') != sid or job.get('status') != 'running':
        return {}
    agent = event.get('agent_id')
    # Reviewer assignments are rooted in actual native agent IDs, never a
    # worker's self-reported identity. Reviewer Bash is intentionally unavailable.
    current_worker = worker_task(job, agent)
    review = current_worker if current_worker and current_worker.get('review') else None
    tool = event.get('tool_name'); inp = event.get('tool_input') or {}
    if name == 'PreToolUse':
        if tool == 'Bash':
            local = json.loads(store.local.read_text()); local['provider_actor'] = agent or sid; atomic(store.local, local)
        reserved = {v['receipt'] for v in job.get('tools', {}).values() if v.get('review')}
        if not review and tool in {'Write', 'Edit', 'MultiEdit'} and inp.get('file_path'):
            target = Path(inp['file_path']).resolve()
            if target in {(store.root / x).resolve() for x in reserved}:
                return {'hookSpecificOutput': {'hookEventName': name, 'permissionDecision': 'deny', 'permissionDecisionReason': 'Only the assigned independent reviewer may write this verdict receipt.'}}
        if review and tool == 'Bash':
            updated = reviewer_preflight(store, review, agent, inp, json.loads(store.local.read_text())['run_id'], job=job) or reviewer_understanding(store, review, inp, job=job, agent=agent)
            if updated:
                return {'hookSpecificOutput': {'hookEventName': name, 'updatedInput': updated, 'permissionDecision': 'allow', 'permissionDecisionReason': 'Canonical preflight helper; only this reviewer\'s assigned internal receipt directory is writable'}}
        if review and tool not in {'Read', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'ToolSearch', 'ReadMcpResource', 'ListMcpResources', 'SubagentHandback'}:
            target = inp.get('file_path', '')
            path = Path(target).resolve()
            tasks = agent_review_tasks(job, agent, review)
            internals = [(store.root / t['preflight_dir']).resolve() for t in tasks if t.get('preflight_dir')]
            receipts = {(store.root / t['receipt']).resolve() for t in tasks if t.get('receipt')}
            native_receipt_paths = {(store.root / r).resolve() for t in tasks for r in t.get('native_receipts', []) if r}
            authored_evidence = any(internal in path.parents for internal in internals) and path.suffix == '.json' and not path.exists()
            allowed = tool == 'Write' and (path in receipts or path in native_receipt_paths or authored_evidence)
            if not allowed:
                return {'hookSpecificOutput': {'hookEventName': name, 'permissionDecision': 'deny',
                        'permissionDecisionReason': 'Independent reviewer may read sources, use only canonical preflight/delivery/retained-understanding helpers in '+review['preflight_dir']+', and Write its assigned verdict (' + ', '.join(sorted(str(t['receipt']) for t in tasks if t.get('receipt'))) + ') or a new internal JSON application receipt. Other shell commands, connector mutations and content edits are forbidden; ask the root to supply deterministic check artifacts.'}}
        if tool == 'SendMessage':
            tid = event['tool_use_id']
            recipient = str(inp.get('to') or inp.get('recipient') or inp.get('agent_id') or inp.get('agentId') or '').strip()
            prior_reviews = [v for v in job.get('tools', {}).values() if recipient and v.get('agent') == recipient and v.get('review')]
            if prior_reviews:
                msg_body = str(inp.get('message') or inp.get('content') or inp.get('prompt') or '')
                receipt = 'reports/routine-control/receipts/' + re.sub(r'[^a-zA-Z0-9_-]', '_', tid) + '.json'
                before = snapshot(store.root)
                header = msg_body.replace('\r\n', '\n').split('\n\n', 1)[0]
                native_receipts = sorted(set(re.findall(r'(?im)^REVIEW_RECEIPT:[ \t]*(reports/[\w./-]+\.(?:json|txt|md))[ \t]*$', header)) | set(re.findall(r'\b(reports/[\w./-]+/(?:audit-verdict|rendered-review)[\w.-]*\.json)\b', msg_body)) | {r for v in prior_reviews for r in v.get('native_receipts', [])})
                protected = {p for c in state['candidates'].values() for p in c['files']}
                native_receipts = [r for r in native_receipts if r not in protected and Path(r).name.lower() not in {'manifest.json','analysis-packet.json','analysis_packet.json'} and not r.endswith('.meta.json')]
                inputs = protected | set(re.findall(r'\b(reports/[\w./-]+\.(?:json|txt|md|html))\b', msg_body))
                for hp in list(store.root.glob('reports/*/handoff*.json')) + list(store.root.glob('reports/*/*/handoff*.json')):
                    if hp.is_file():
                        inputs.add(str(hp.resolve().relative_to(store.root.resolve())))
                for rel in inputs - set(native_receipts):
                    path = safe_path(store.root, rel)
                    if path.is_file(): before[rel] = sha(path.read_bytes())
                def start_send(s):
                    j = store.owned(s, sid)
                    j['tools'][tid] = {'status': 'pending', 'review': True, 'agent': recipient, 'receipt': receipt, 'before': before, 'native_receipts': native_receipts, 'created': time.time(), 'preflight_dir': 'reports/routine-control/preflight/' + re.sub(r'[^a-zA-Z0-9_-]', '_', tid)}
                    j['next'] = 'Retrieve the actual pending worker result and receipt; do not launch a duplicate or end while waiting.'
                store.mutate(start_send)
                msg_key = 'message' if 'message' in inp else ('content' if 'content' in inp else 'prompt')
                updated = dict(inp)
                updated[msg_key] = msg_body + ('\nSYSTEM WORKER PROTOCOL (RESUMED REVIEW): Write your structured review JSON to ' + str(store.root / receipt) +
                    ' (or your earlier assigned receipt path) with {"verdict":"PASS|FAIL","findings":[...],"candidates":[{"identity":"/canonical-route/","path":"repo-relative-path","sha256":"actual candidate SHA256 supplied by controller","verdict":"PASS|FAIL"}],"native_receipts":[{"path":"reports/...","content":object_or_string}]}. '
                    'Use --run-dir reports/routine-control/preflight/' + re.sub(r'[^a-zA-Z0-9_-]', '_', tid) + ' (or --reuse your prior preflight_dir). Allowed native receipt paths: ' + json.dumps(native_receipts) + '. '
                    'Controller current-job candidate hashes: ' + json.dumps({k:v for k,v in display(state)['candidates'].items() if v['state'] not in TERMINAL}))
                return {'hookSpecificOutput': {'hookEventName': name, 'updatedInput': updated, 'permissionDecision': 'allow', 'permissionDecisionReason': 'Resumed independent reviewer operation; controller registers new review round'}}
        if tool in {'Agent', 'Task'}:
            tid = event['tool_use_id']
            description = inp.get('description', '')
            resumed_agent = inp.get('resume')
            prior_reviews = [v for v in job.get('tools', {}).values() if resumed_agent and v.get('agent') == resumed_agent and v.get('review')]
            author = not prior_reviews and bool(re.search(r'(?i)\b(author|writer|write|generate|generation)\b', description))
            is_review = bool(prior_reviews) or (not author and bool(re.search(r'(?i)\b(audit|auditor|review|reviewer)\b', description) or
                re.search(r'(?i)^\s*(?:you are (?:an? |the )?|role:\s*)?(?:independent |read-only |phase [34] |chart |rendered |adversarial )*(?:auditor|reviewer|review\b|audit\b)', inp.get('prompt', '')[:400])))
            receipt = 'reports/routine-control/receipts/' + re.sub(r'[^a-zA-Z0-9_-]', '_', tid) + '.json'
            before = snapshot(store.root) if is_review else {}
            header = inp.get('prompt', '').replace('\r\n', '\n').split('\n\n', 1)[0]
            native_receipts = sorted(set(re.findall(r'(?im)^REVIEW_RECEIPT:[ \t]*(reports/[\w./-]+\.(?:json|txt|md))[ \t]*$', header)) | (set(re.findall(r'\b(reports/[\w./-]+/(?:audit-verdict|rendered-review)[\w.-]*\.json)\b', inp.get('prompt', ''))) if prior_reviews else set()) | {r for v in prior_reviews for r in v.get('native_receipts', [])})
            protected = {p for c in state['candidates'].values() for p in c['files']}
            for rel in native_receipts:
                safe_path(store.root, rel)
                if rel in protected or Path(rel).name.lower() in {'manifest.json','analysis-packet.json','analysis_packet.json'} or rel.endswith('.meta.json'):
                    raise ControlError('A native review receipt cannot overwrite a candidate, preparation manifest or writer input')
            inputs = protected | set(re.findall(r'\b(reports/[\w./-]+\.(?:json|txt|md|html))\b', inp.get('prompt', '')))
            if is_review:
                for hp in list(store.root.glob('reports/*/handoff*.json')) + list(store.root.glob('reports/*/*/handoff*.json')):
                    if hp.is_file():
                        inputs.add(str(hp.resolve().relative_to(store.root.resolve())))
            for rel in inputs - set(native_receipts):
                path = safe_path(store.root, rel)
                if path.is_file(): before[rel] = sha(path.read_bytes())
            def start(s):
                j = store.owned(s, sid)
                entry = {'status': 'pending', 'review': is_review, 'receipt': receipt, 'before': before, 'native_receipts': native_receipts, 'created': time.time(), 'preflight_dir': 'reports/routine-control/preflight/' + re.sub(r'[^a-zA-Z0-9_-]', '_', tid)}
                if resumed_agent and any(v.get('agent') == resumed_agent for v in j['tools'].values()):
                    entry['agent'] = resumed_agent
                j['tools'][tid] = entry
                j['next'] = 'Retrieve the actual pending worker result and receipt; do not launch a duplicate or end while waiting.'
            store.mutate(start)
            updated = dict(inp, run_in_background=False)
            if is_review:
                updated['prompt'] = inp.get('prompt', '') + ('\nSYSTEM WORKER PROTOCOL: Read-only independent reviewer. Do not edit content or run arbitrary shell commands. '
                    'Use Read for artifacts. Complete your own canonical instruction preflight with python3 .claude/tools/workflow-preflight.py prepare/next/check, using --run-dir reports/routine-control/preflight/' + re.sub(r'[^a-zA-Z0-9_-]', '_', tid) +
                    '. The hook binds prepare to your real native actor and this invocation\'s runId. Use one next call per full instruction part, then check. Other shell commands are forbidden; the root supplies deterministic check artifacts. Write only ' + str(store.root / receipt) +
                    '. Return JSON there: {"verdict":"PASS|FAIL","findings":[...],"candidates":[{"identity":"/canonical-route/","path":"repo-relative-path","sha256":"actual candidate SHA256 supplied by controller","verdict":"PASS|FAIL"}]}. '
                    'For chart/preparation reviews use an empty candidates array; only a complete Phase 4/final rendered adversarial review can approve candidates. '
                    'You may Write genuine JSON application/confirmation evidence in your assigned preflight directory; existing receipts are immutable. Retained understanding uses only instruction-understanding.py challenge/record/inspect with paths in that directory. Read complete first instructions and preserve actual access/understanding. '+
                    'If the original assignment requests native review/findings files, put their exact original schema/text in native_receipts:[{"path":"the requested reports/... path","content":object_or_string}]. '
                    'The parent must declare output paths as REVIEW_RECEIPT: reports/... lines in the first prompt header, before a blank line and before source data. Read paths never become write permissions. The controller copies exact reviewer-authored receipts after immutability validation. Do not try to Write a second path. Allowed native receipt paths: ' + json.dumps(native_receipts) + '. '
                    'sha256 is the controller bundle digest covering ALL files listed for that candidate; inspect every file. '
                    'Retain all findings honestly. If candidate evidence is unavailable return FAIL, never invent a hash. Controller current-job candidate hashes: ' + json.dumps({k:v for k,v in display(state)['candidates'].items() if v['state'] not in TERMINAL}))
            return {'hookSpecificOutput': {'hookEventName': name, 'updatedInput': updated, 'permissionDecision': 'allow', 'permissionDecisionReason': 'Existing unattended worker operation; controller enforces foreground completion'}}
        if tool == 'Bash':
            updated = dict(inp, run_in_background=False)
            if re.search(r'content_gen|npm run build|next build|astro build|deploy-run|\bsleep\b', inp.get('command', '')):
                updated['timeout'] = max(inp.get('timeout', 0), 600000)
            command = inp.get('command', '')
            if 'routine_control.py' not in command and re.search(r'npm run build|next build|astro build|npx tsc|pre-push-check\.sh|deploy-run-to-main\.sh push', command):
                key = sha((job['id'] + command + json.dumps(snapshot(store.root), sort_keys=True)).encode())[:32]
                updated['command'] = 'python3 ' + shlex.quote(str(store.root / 'scripts/routine_control.py')) + ' run --key ' + key + ' -- /bin/bash -c ' + shlex.quote(command)
            if updated != inp:
                return {'hookSpecificOutput': {'hookEventName': name, 'updatedInput': updated, 'permissionDecision': 'allow', 'permissionDecisionReason': 'Existing unattended worker operation; controller enforces foreground completion'}}
    if name == 'SubagentStart':
        def started(s):
            j = store.owned(s, sid)
            pending = [v for v in j['tools'].values() if v['status'] == 'pending' and v.get('agent') == event['agent_id']]
            if not pending:
                pending = [v for v in j['tools'].values() if v['status'] == 'pending' and not v.get('agent')]
            if len(pending) > 1:
                newest = max(pending, key=lambda v: (v.get('created', 0), id(v)))
                for stale in pending:
                    if stale is not newest:
                        stale.update(status='interrupted', error='Superseded by newer worker dispatch before SubagentStart')
                pending = [newest]
            if len(pending) != 1:
                raise ControlError('Ambiguous worker identity; parallel review dispatch is not admitted')
            pending[0]['agent'] = event['agent_id']
            prior_reviews = [v for v in j['tools'].values() if v is not pending[0] and v.get('agent') == event['agent_id'] and v.get('review')]
            if prior_reviews:
                pending[0]['review'] = True
                pending[0]['native_receipts'] = sorted(set(pending[0].get('native_receipts', [])) | {r for v in prior_reviews for r in v.get('native_receipts', [])})
        store.mutate(started)
    if name == 'SubagentStop':
        def stopped(s):
            j = store.owned(s, sid)
            task = worker_task(j, agent)
            if not task:
                raise ControlError('Unregistered worker completion')
            if task['status'] == 'complete':
                return
            if task['review']:
                receipt = safe_path(store.root, task['receipt'])
                if not receipt.is_file():
                    raise ControlError('Write the actual structured review to the designated receipt before finishing')
                data = json.loads(receipt.read_text())
                if data.get('verdict') not in {'PASS', 'FAIL'} or not isinstance(data.get('findings'), list):
                    raise ControlError('Review receipt requires an honest verdict and findings')
                after = snapshot(store.root)
                for rel in task['before']:
                    if rel.startswith('reports/'):
                        path = safe_path(store.root, rel)
                        after[rel] = sha(path.read_bytes()) if path.is_file() else None
                unchanged = after == task['before']
                task['mutations'] = {p: {'before': task['before'].get(p), 'after': after.get(p)} for p in set(task['before']) | set(after) if task['before'].get(p) != after.get(p)}
                task['valid'] = unchanged; task['verdict'] = data['verdict']
                if task.get('authored_receipt') != sha(receipt.read_bytes()):
                    raise ControlError('Review receipt lacks native reviewer write provenance')
                for item in data.get('candidates', []):
                    identity = normal_identity(store, item['identity'])
                    c = s['candidates'].get(identity)
                    if not c:
                        raise ControlError('Review candidate has no canonical registration')
                    actual = fingerprint(store.root, c)
                    valid = unchanged and item.get('sha256') == actual == c.get('digest') and item.get('path') == c['path'] and agent != c['writer'] and task.get('authored_receipt') == sha(receipt.read_bytes())
                    task['valid'] = task['valid'] and valid
                    verdict = item.get('verdict') if valid else 'INVALID'
                    if verdict not in {'PASS', 'FAIL', 'INVALID'}:
                        raise ControlError('Invalid candidate verdict')
                    terminal = c['state'] in TERMINAL
                    if c['reviews'] and c['reviews'][-1].get('agent') == agent and c['reviews'][-1].get('digest') == actual and c['reviews'][-1].get('verdict') == verdict:
                        c['reviews'][-1]['receipt'] = task['receipt']
                    else:
                        c['reviews'].append({'agent': agent, 'verdict': verdict, 'digest': actual, 'receipt': task['receipt'], 'release_eligible': not terminal})
                    if not terminal:
                        c['state'] = 'reviewed' if native_release_eligible(store,c) else ('held' if c['reworks'] >= 2 or native_review_count(c) >= native_review_ceiling(store,c) else ('needs-independent-review' if verdict == 'INVALID' else 'needs-correction'))
                if task['valid']:
                    for native in data.get('native_receipts', []):
                        if native['path'] not in task.get('native_receipts', []):
                            raise ControlError('Native receipt path was not in the independent reviewer assignment')
                        target = safe_path(store.root, native['path'])
                        target.parent.mkdir(parents=True, exist_ok=True)
                        value = native['content']
                        if native['path'].endswith('.json') and isinstance(value, str):
                            try:
                                json.loads(value)
                            except ValueError:
                                recovered = None
                                for pt in reversed(agent_review_tasks(j, agent, task)):
                                    pr = safe_path(store.root, pt['receipt'])
                                    if pr.is_file() and pr != receipt:
                                        try:
                                            for pn in json.loads(pr.read_text()).get('native_receipts', []):
                                                if pn.get('path') == native['path']:
                                                    pv = pn.get('content')
                                                    if isinstance(pv, (dict, list)) or (isinstance(pv, str) and json.loads(pv) is not None):
                                                        recovered = pv; break
                                        except Exception:
                                            pass
                                    if recovered is not None:
                                        break
                                if recovered is None:
                                    raise ControlError('Native JSON receipt content must be a JSON object or valid JSON string, not a prose placeholder')
                                value = recovered
                        payload = value if isinstance(value, str) else json.dumps(value, indent=2)
                        if SECRET.search(payload.encode()): raise ControlError('Sensitive review receipt refused')
                        target.write_text(payload)
            task['status'] = 'complete'
            if 'before' in task:
                task['before_sha256'] = sha(json.dumps(task.pop('before'), sort_keys=True).encode())
            for other in j.get('tools', {}).values():
                if other is not task and other.get('agent') == agent and other.get('status') == 'pending' and not other.get('authored_receipt'):
                    other.update(status='interrupted', error='Superseded by completed task on the same agent')
            j['next'] = 'Read completed worker receipts. Continue the earliest unfinished gate; isolate held candidates.'
        artifacts = [review['receipt']] if review and (store.root / review['receipt']).is_file() else []
        store.mutate(stopped, artifacts)
    if name == 'PostToolUse':
        if review and tool == 'Write':
            written_path = Path(inp.get('file_path', '')).resolve()
            tasks = agent_review_tasks(job, agent, review)
            receipt_paths = {(store.root / t['receipt']).resolve() for t in tasks if t.get('receipt')}
            native_receipt_paths = {(store.root / r).resolve() for t in tasks for r in t.get('native_receipts', []) if r}
            if written_path in receipt_paths or written_path in native_receipt_paths:
                rel_written = written_path.relative_to(store.root.resolve()).as_posix()
                def authored(s):
                    j = store.owned(s, sid)
                    matching = [t for t in agent_review_tasks(j, agent) if t.get('status') == 'pending' and (rel_written == t.get('receipt') or rel_written in t.get('native_receipts', []))]
                    task = max(matching, key=lambda v: v.get('created', 0), default=None) or worker_task(j, agent)
                    task['receipt'] = rel_written
                    task['authored_receipt'] = sha(safe_path(store.root, rel_written).read_bytes())
                store.mutate(authored)
        changed = [k for k, c in state['candidates'].items() if c.get('digest') and c.get('operation') != 'pending' and c['state'] not in TERMINAL and fingerprint(store.root, c) != c['digest']]
        if changed:
            def edited(s):
                store.owned(s, sid)
                for key in changed:
                    c = s['candidates'][key]
                    if c['reviews'] and c.get('corrected_review') != len(c['reviews']):
                        if c['reworks'] >= 2 or native_review_count(c) >= native_review_ceiling(store,c):
                            c.update(state='held', disposition_reason='Unadmitted change after the profile/rework limit; latest reviewed bytes remain preserved')
                            continue
                        c['reworks'] += 1; c['corrected_review'] = len(c['reviews'])
                    c['digest'] = fingerprint(store.root, c); c['state'] = 'needs-review'
            store.mutate(edited, [p for key in changed for p in state['candidates'][key]['files']])
        # Heartbeat only every ten minutes, not one network commit per read.
        if job.get('lease_until', 0) < time.time() + LEASE - 600:
            store.mutate(lambda s: store.owned(s, sid) and None)
    if name == 'StopFailure':
        def failed(s):
            j = store.owned(s, sid); j['lease_until'] = 0
            j['next'] = 'Recover existing worker outputs and artifacts after the native session failure; do not repeat discovery or paid generation.'
        store.mutate(failed)
    if name == 'Stop':
        if event.get('stop_hook_active') is True:
            return {}  # Preserve pending work without starting another reminder turn.
        # A terminal job has already returned above. An ordinary final response
        # cannot silently discard outstanding work, even if no callback arrives.
        return {'decision': 'block', 'reason': 'Durable competitor job is unfinished. Run python3 scripts/routine_control.py status; recover pending results, then continue. Use checkpoint/finish with real evidence. Do not end while waiting or mark a review as no-op.'}
    return {}


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root', default=os.getcwd())
    sub = p.add_subparsers(dest='cmd', required=True)
    sub.add_parser('hook')
    b = sub.add_parser('begin'); b.add_argument('--run-id', required=True); b.add_argument('--scheduled-slot', action='store_true', help='Explicit native scheduled/manual harvest invocation (not a recovery tick)')
    st = sub.add_parser('status'); st.add_argument('--full', action='store_true', help='Raw internal state; can be large. Default omits history and pending source maps.')
    sub.add_parser('wait')
    r = sub.add_parser('run'); r.add_argument('--key', required=True); r.add_argument('command', nargs=argparse.REMAINDER)
    sub.add_parser('release-check')
    sub.add_parser('wake')
    b = sub.add_parser('bind'); b.add_argument('--identity', required=True); b.add_argument('paths', nargs='+')
    a = sub.add_parser('adopt'); a.add_argument('--identity', required=True); a.add_argument('--path', required=True); a.add_argument('--reworks', type=int, required=True); a.add_argument('--evidence', required=True)
    c = sub.add_parser('checkpoint'); c.add_argument('--next', required=True); c.add_argument('paths', nargs='+')
    f = sub.add_parser('finish'); f.add_argument('--report', required=True); f.add_argument('--status', choices=['complete', 'no-op', 'held'], required=True)
    d = sub.add_parser('disposition'); d.add_argument('--identity', required=True); d.add_argument('--status', choices=['deferred', 'held', 'published'], required=True); d.add_argument('--evidence', required=True)
    a = p.parse_args(argv); store = Store(a.root)
    if a.cmd == 'hook':
        event = json.load(sys.stdin)
        try:
            result = hook(store, event)
        except (ControlError, ValueError, KeyError, OSError) as e:
            if event['hook_event_name'] in {'Stop', 'SubagentStop'}:
                result = {'decision': 'block', 'reason': str(e)}
            else:
                raise
        print(json.dumps(result)); return 0
    if a.cmd == 'begin':
        print(json.dumps(begin(store, a.run_id, a.scheduled_slot))); return 0
    if a.cmd == 'wake':
        print(json.dumps(wake(store, os.environ.get('GITHUB_TOKEN', '')))); return 0
    if a.cmd == 'status':
        _, state = store.read(); print(json.dumps(state if a.full else display(state), indent=2)); return 0
    if a.cmd == 'wait':
        deadline = time.monotonic() + 30
        while True:
            _, state = store.read()
            pending = [k for k, v in (state.get('job') or {}).get('tools', {}).items() if v['status'] == 'pending']
            if not pending or time.monotonic() >= deadline:
                print(json.dumps({'pending': pending, 'job': display(state)['job']})); return 0
            time.sleep(min(5, deadline - time.monotonic()))
    if a.cmd == 'release-check':
        release_check(store, sys.stdin.read()); return 0
    if a.cmd == 'run':
        command = a.command[1:] if a.command[:1] == ['--'] else a.command
        if not command: raise ControlError('Missing foreground command')
        return run_command(store, a.key, command)
    owner = store.session()
    paths = []
    if a.cmd in {'finish', 'adopt', 'disposition'}:
        paths = [getattr(a, 'report', None) or a.evidence]
    if a.cmd == 'adopt': paths.append(a.path)
    if a.cmd == 'checkpoint': paths = a.paths
    if a.cmd == 'bind': paths = a.paths
    def change(state):
        job = store.owned(state, owner)
        if a.cmd == 'checkpoint':
            if SECRET.search(a.next.encode()): raise ControlError('Secret refused in resume instruction')
            job['next'] = a.next
        elif a.cmd == 'adopt':
            identity = normal_identity(store, a.identity)
            if identity in state['candidates']: raise ControlError('Canonical identity already registered')
            if not 0 <= a.reworks: raise ControlError('Invalid historical rework count')
            state['candidates'][identity] = {'path': a.path, 'files': [a.path],
                'state': 'held' if a.reworks >= 2 else 'needs-review', 'reworks': a.reworks, 'reviews': [],
                'writer': owner, 'operation': 'complete', 'historical_evidence': a.evidence, 'job_id': job['id'], 'version': 1, 'history': []}
            state['candidates'][identity]['digest'] = fingerprint(store.root, state['candidates'][identity])
        elif a.cmd == 'bind':
            c = state['candidates'][normal_identity(store, a.identity)]
            if c['state'] in TERMINAL:
                raise ControlError('Cannot rebind a held/deferred/published candidate')
            c['files'] = sorted(set(c['files'] + a.paths))
            c['digest'] = fingerprint(store.root, c); c['state'] = 'needs-review'
        elif a.cmd == 'disposition':
            ident = normal_identity(store, a.identity)
            c = state['candidates'][ident]
            if a.status == 'published':
                if not native_release_state(c) or not native_release_eligible(store,c) or fingerprint(store.root, c) != c['reviews'][-1]['digest']:
                    raise ControlError('Publication requires exact latest independent PASS plus existing mechanical/render/live gates')
            elif a.status in {'held', 'deferred'}:
                h_info = _open_handoff_state(store.root)
                if any(_matches_handoff_row(store, ident, c, r) for r in h_info['pending_reviews']):
                    raise ControlError('Cannot hold/defer a candidate with an unrecorded pending content-review-policy round: spawn independent mindmap-audit with REVIEW_RECEIPT header, then run audit-batch.py finalize-review --job-id <jobId> --reviewer <agent_id> --preflight <preflight_dir> --out-dir .../admissions && content-review-policy.py record first')
                if a.status == 'held' and native_release_eligible(store, c) and any(_matches_handoff_row(store, ident, c, r) for r in h_info['publication_gaps']):
                    raise ControlError('releaseAtAuditLimit is true and candidate is eligible for capped/approved release: publish the exact reviewed candidate live, run rendered-audit.py compare + record-deployment, scraper.py record, and disposition --status published')
            c.update(state=a.status, disposition_evidence=a.evidence)
        elif a.cmd == 'finish':
            pending = [v for v in job['tools'].values() if v['status'] == 'pending']
            commands = [v for v in job.get('commands', {}).values() if v['status'] == 'running']
            if pending or commands or any(c['state'] not in TERMINAL for c in state['candidates'].values()):
                raise ControlError('Cannot finish with unresolved workers/candidates; preserve evidence and continue or defer')
            job.update(status=a.status, lease_until=0, report=a.report, next='Completed; wait for the next native harvest slot')
    store.mutate(change, paths)
    print(json.dumps({'ok': True, 'action': a.cmd}))
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (ControlError, ValueError, KeyError, OSError) as exc:
        print('Competitor controller: ' + str(exc), file=sys.stderr); sys.exit(2)
