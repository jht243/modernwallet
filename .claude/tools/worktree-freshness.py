#!/usr/bin/env python3
"""Refuse a workflow checkout that silently omits local source changes.

Read-only against both working trees. A receipt in the checkout's private Git
directory allows the run's own edits, but any later source change is checked
again. No stash, copying, staging, commit or publication is performed.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import urllib.parse
import urllib.request


def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args], stderr=subprocess.PIPE, timeout=60)


def primary(root):
    records = git(root, 'worktree', 'list', '--porcelain', '-z').split(b'\0')
    for record in records:
        if record.startswith(b'worktree '):
            return Path(os.fsdecode(record[9:])).resolve()
    raise RuntimeError('Cannot identify the source checkout')


def state(root, rel):
    path = root / rel
    if path.is_symlink():
        return 'link:' + os.readlink(path)
    if not path.exists():
        return None
    if not path.is_file():
        raise RuntimeError(f'Unsupported input type: {rel}')
    mode = 'executable:' if path.stat().st_mode & 0o111 else 'file:'
    return mode + hashlib.sha256(path.read_bytes()).hexdigest()


def run_identity():
    # Scheduled invocations must not inherit another run's own-edit exemption.
    for name in ['WORKFLOW_RUN_ID', 'CODEX_SESSION_ID', 'CODEX_THREAD_ID', 'CLAUDE_CODE_SESSION_ID', 'CLAUDE_SESSION_ID']:
        value = os.environ.get(name)
        if value:
            return hashlib.sha256((name + ':' + value).encode()).hexdigest()
    return None  # No session identity: perform full checks; never reuse a receipt.


def checkout_branch(root):
    result = subprocess.run(['git', '-C', str(root), 'symbolic-ref', '-q', 'HEAD'], capture_output=True, timeout=60)
    if result.returncode not in [0, 1]:
        raise RuntimeError('Cannot determine checkout branch')
    return result.stdout.decode().strip() if result.returncode == 0 else 'detached'


def receipt_file(root, kind, session):
    directory = Path(os.fsdecode(git(root, 'rev-parse', '--absolute-git-dir')).strip())
    return directory / ('workflow-' + kind + '-receipt-' + (session or 'unscoped') + '.json')


def receipt_matches(receipt, root, session):
    if not session or receipt.get('runIdentity') != session or receipt.get('root') != str(root) or receipt.get('branch') != checkout_branch(root) or not receipt.get('head'):
        return False
    result = subprocess.run(['git', '-C', str(root), 'merge-base', '--is-ancestor', receipt['head'], 'HEAD'], capture_output=True, timeout=60)
    return result.returncode == 0


def save_receipt(path, value, root, session):
    import tempfile
    value.update(root=str(root), branch=checkout_branch(root), runIdentity=session)
    with tempfile.NamedTemporaryFile(mode='w', dir=path.parent, prefix=path.name+'.', delete=False) as file:
        json.dump(value, file); file.write('\n'); temporary = file.name
    os.replace(temporary, path)


def cloud_check(root):
    """Verify a cloud clone against the live default branch, without resetting it.

    Cloud cannot observe unpublished files on someone's laptop. Its authority
    is the fetched default branch, never an old cached origin/main reference.
    """
    # Render runtime images need not retain .git. Its immutable build revision
    # still lets us verify that the deployed inputs are the published inputs.
    if os.environ.get('RENDER_GIT_COMMIT') and os.environ.get('RENDER_GIT_REPO_SLUG'):
        slug = os.environ['RENDER_GIT_REPO_SLUG']
        headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'workflow-freshness'}
        token = (os.environ.get('WORKFLOW_GITHUB_TOKEN') or
                 os.environ.get('GIT_PUSH_TOKEN') or os.environ.get('GITHUB_TOKEN'))
        if token:
            headers['Authorization'] = 'Bearer ' + token
        base_url = 'https://api.github.com/repos/' + urllib.parse.quote(slug, safe='/')
        with urllib.request.urlopen(urllib.request.Request(base_url, headers=headers), timeout=45) as response:
            default_branch = json.load(response)['default_branch']
        with urllib.request.urlopen(urllib.request.Request(base_url + '/commits/' + urllib.parse.quote(default_branch, safe=''), headers=headers), timeout=45) as response:
            revision = json.load(response)['sha']
        current = os.environ['RENDER_GIT_COMMIT'] == revision
        return {'status': 'current' if current else 'stale', 'source': slug + '/' + default_branch, 'revision': revision, 'missing': [] if current else ['deployed-build-revision']}
    root = Path(os.fsdecode(git(root, 'rev-parse', '--show-toplevel')).strip()).resolve()
    listing = git(root, 'ls-remote', '--symref', 'origin', 'HEAD').decode()
    ref = next((line.split()[1] for line in listing.splitlines() if line.startswith('ref: refs/heads/')), None)
    if not ref:
        raise RuntimeError('Cannot resolve origin default branch; freshness is unknown')
    revision = next((line.split()[0] for line in listing.splitlines() if line.endswith('\tHEAD') and not line.startswith('ref:')), None)
    if not revision: raise RuntimeError('Cannot resolve published revision')
    git(root, 'fetch', '--quiet', '--no-tags', '--no-write-fetch-head', 'origin', revision)
    head = git(root, 'rev-parse', 'HEAD').decode().strip()
    session = run_identity()
    receipt_path = receipt_file(root, 'cloud', session)
    try:
        previous = json.loads(receipt_path.read_text())
    except (FileNotFoundError, ValueError):
        previous = {}
    session = run_identity()
    identity = hashlib.sha256((git(root, 'remote', 'get-url', 'origin').decode() + ref).encode()).hexdigest()
    if receipt_matches(previous, root, session) and previous.get('identity') == identity and previous.get('revision') == revision:
        return {'status': 'current', 'source': 'origin/' + ref.removeprefix('refs/heads/'), 'revision': revision, 'missing': []}
    if receipt_matches(previous, root, session) and previous.get('identity') == identity and previous.get('revision') and git(root, 'merge-base', previous['revision'], revision).decode().strip() == previous['revision']:
        # A concurrent publication requires its delta, while preserving work
        # authored after this run's verified start.
        base = previous['revision']
        paths = [os.fsdecode(p) for p in git(root, 'diff', '--no-renames', '--name-only', '-z', base, revision, '--').split(b'\0') if p and not p.startswith(b'reports/')]
        missing = [p for p in paths if not includes_published(published_entry(root, base, p), working_entry(root, p), published_entry(root, revision, p))]
        result = {'status': 'stale' if missing else 'current', 'source': 'origin/' + ref.removeprefix('refs/heads/'), 'revision': revision, 'missing': sorted(missing)}
        if not missing: save_receipt(receipt_path, {'revision': revision, 'head': head, 'identity': identity}, root, session)
        return result
    paths = set()
    for args in [('diff', '--no-renames', '--name-only', '-z', 'HEAD', revision, '--'),
                 ('diff', '--no-renames', '--name-only', '-z', 'HEAD', '--'),
                 ('ls-files', '--others', '--exclude-standard', '-z')]:
        paths.update(os.fsdecode(p) for p in git(root, *args).split(b'\0') if p)
    missing = []
    for rel in sorted(paths):
        if rel.startswith('reports/'):
            continue
        entry = git(root, 'ls-tree', revision, '--', rel).decode().strip()
        if not entry:
            expected = None
        else:
            mode, kind, oid = entry.split('\t')[0].split()
            if kind != 'blob':
                raise RuntimeError(f'Unsupported published input: {rel}')
            raw = git(root, 'cat-file', 'blob', oid)
            expected = ('link:' + os.fsdecode(raw)) if mode == '120000' else ('executable:' if mode == '100755' else 'file:') + hashlib.sha256(raw).hexdigest()
        if state(root, rel) != expected:
            missing.append(rel)
    result = {'status': 'stale' if missing else 'current', 'source': 'origin/' + ref.removeprefix('refs/heads/'), 'revision': revision, 'missing': missing}
    if not missing:
        save_receipt(receipt_path, {'revision': revision, 'head': head, 'identity': identity}, root, session)
    return result


def published_entry(root, revision, rel):
    line = git(root, 'ls-tree', revision, '--', rel).decode().strip()
    if not line:
        return None
    mode, kind, oid = line.split('\t')[0].split()
    if kind != 'blob':
        raise RuntimeError('Unsupported published input: ' + rel)
    return mode, git(root, 'cat-file', 'blob', oid)


def working_entry(root, rel):
    p = root / rel
    if p.is_symlink():
        return '120000', os.fsencode(os.readlink(p))
    if not p.exists():
        return None
    if not p.is_file():
        raise RuntimeError('Unsupported local input: ' + rel)
    return ('100755' if p.stat().st_mode & 0o111 else '100644'), p.read_bytes()


def includes_published(base, local, published):
    """Would integrating the published change leave local bytes/mode unchanged?"""
    if local == published or base == published:
        return True
    if local is not None and published is not None and local[0] == published[0] and local[0] in ['100644','100755']:
        # Git can conflict on adjacent insertions even when local retains every
        # complete published line. Exact, ordered line preservation proves that
        # no published byte-line was removed or replaced. Do not normalize text.
        try:
            ours_text, published_text = local[1].decode('utf-8'), published[1].decode('utf-8')
        except UnicodeDecodeError:
            ours_text = published_text = None
        if ours_text is not None and '\0' not in ours_text and '\0' not in published_text:
            remaining = iter(ours_text.splitlines(keepends=True))
            if all(any(line == current for current in remaining) for line in published_text.splitlines(keepends=True)):
                return True
    if base is None or local is None or published is None:
        return False
    old_mode, old = base; local_mode, ours = local; remote_mode, theirs = published
    if remote_mode != old_mode and local_mode != remote_mode:
        return False
    if '120000' in {old_mode, local_mode, remote_mode}:
        return local == published
    if ours == theirs:
        return True
    if b'\0' in old + ours + theirs:
        return False
    import tempfile
    with tempfile.TemporaryDirectory(prefix='workflow-merge-check-') as folder:
        paths = [Path(folder) / name for name in ['local', 'base', 'published']]
        for p, content in zip(paths, [ours, old, theirs]):
            p.write_bytes(content)
        merged = subprocess.run(['git', 'merge-file', '-p', *map(str, paths)], capture_output=True, timeout=60)
        return merged.returncode == 0 and merged.stdout == ours


def primary_check(root):
    # A primary checkout is not automatically current: cloud publications may
    # have advanced its default branch while its local HEAD stayed unchanged.
    try:
        origin = git(root, 'remote', 'get-url', 'origin').decode().strip()
    except subprocess.CalledProcessError:
        return {'status': 'current', 'source': str(root), 'missing': [], 'publishedSource': None}
    listing = git(root, 'ls-remote', '--symref', 'origin', 'HEAD').decode().splitlines()
    ref = next((l.split()[1] for l in listing if l.startswith('ref: refs/heads/')), None)
    revision = next((l.split()[0] for l in listing if l.endswith('\tHEAD') and not l.startswith('ref:')), None)
    if not ref or not revision:
        raise RuntimeError('Cannot verify the live published default branch')
    # Pin the advertised revision; do not race another routine's FETCH_HEAD.
    git(root, 'fetch', '--quiet', '--no-tags', '--no-write-fetch-head', 'origin', revision)
    head = git(root, 'rev-parse', 'HEAD').decode().strip()
    identity = hashlib.sha256((str(root) + '\n' + origin + '\n' + ref).encode()).hexdigest()
    session = run_identity()
    receipt_path = receipt_file(root, 'primary', session)
    try:
        receipt = json.loads(receipt_path.read_text())
    except (FileNotFoundError, ValueError):
        receipt = {}
    session = run_identity()
    acknowledged = receipt.get('revision') if receipt_matches(receipt, root, session) and receipt.get('identity') == identity else None
    if acknowledged and git(root, 'merge-base', acknowledged, revision).decode().strip() != acknowledged:
        acknowledged = None  # A rewritten default branch needs a fresh comparison.
    common = git(root, 'merge-base', head, revision).decode().strip()
    base = acknowledged or common
    # A normal pull/merge can integrate a newer published baseline during this
    # same run. Do not let an older receipt override that committed ancestry.
    # Keep the acknowledged revision when HEAD has not integrated it yet.
    if acknowledged and git(root, 'merge-base', acknowledged, common).decode().strip() == acknowledged:
        base = common
    paths = [os.fsdecode(p) for p in git(root, 'diff', '--no-renames', '--name-only', '-z', base, revision, '--').split(b'\0') if p and not p.startswith(b'reports/')]
    missing = [p for p in paths if not includes_published(published_entry(root, base, p), working_entry(root, p), published_entry(root, revision, p))]
    result = {'status': 'stale' if missing else 'current', 'source': str(root), 'publishedSource': 'origin/' + ref.removeprefix('refs/heads/'), 'revision': revision, 'missing': sorted(missing)}
    if not missing:
        save_receipt(receipt_path, {'identity': identity, 'head': head, 'revision': revision}, root, session)
    return result


def check(root, source=None):
    root = Path(os.fsdecode(git(root, 'rev-parse', '--show-toplevel')).strip()).resolve()
    source = Path(source).resolve() if source else primary(root)
    published = primary_check(source)
    if source == root or published['missing']:
        return published
    # Never compare different repositories, including two unrelated clones.
    common = lambda p: Path(os.fsdecode(git(p, 'rev-parse', '--path-format=absolute', '--git-common-dir')).strip()).resolve()
    if common(root) != common(source):
        raise RuntimeError('Source and target must be worktrees of the same repository')
    base = os.fsdecode(git(root, 'merge-base', 'HEAD', str(git(source, 'rev-parse', 'HEAD').decode().strip()))).strip()
    paths = set()
    for args in [('diff', '--no-renames', '--name-only', '-z', base, '--'),
                 ('ls-files', '--others', '--exclude-standard', '-z')]:
        paths.update(os.fsdecode(p) for p in git(source, *args).split(b'\0') if p)
    # Reports are run outputs, not code/configuration inputs. Everything else
    # eligible for Git is checked, including new runtime dependencies and data.
    paths = sorted(p for p in paths if not p.startswith('reports/'))
    inputs = {p: state(source, p) for p in paths}
    head = git(root, 'rev-parse', 'HEAD').decode().strip()
    session = run_identity()
    receipt_path = receipt_file(root, 'source', session)
    try:
        receipt = json.loads(receipt_path.read_text())
    except (FileNotFoundError, ValueError):
        receipt = {}
    session = run_identity()
    previous = receipt.get('inputs', {}) if receipt_matches(receipt, root, session) and receipt.get('source') == str(source) else {}
    missing = []
    for rel, expected in inputs.items():
        # An unchanged source input already checked at startup may now differ
        # in the target because this run is editing it.
        if rel in previous and previous[rel] == expected:
            continue
        if state(root, rel) != expected:
            missing.append(rel)
    # A previously untracked file can disappear from the source candidate set.
    # It must not silently survive as a dependency in the isolated checkout.
    for rel in previous.keys() - inputs.keys():
        if state(root, rel) != state(source, rel):
            missing.append(rel)
    result = {'status': 'stale' if missing else 'current', 'source': str(source), 'missing': sorted(missing)}
    if not missing:
        save_receipt(receipt_path, {'source': str(source), 'head': head, 'inputs': inputs}, root, session)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', default='.')
    parser.add_argument('--source')
    parser.add_argument('--run-id', help='Unique routine invocation ID for runtimes without a session ID; preserve within this run only')
    parser.add_argument('--cloud', action='store_true', help='Verify against the live published default branch, not a laptop checkout')
    args = parser.parse_args()
    generated_run = None
    if args.run_id:
        os.environ['WORKFLOW_RUN_ID'] = args.run_id
    elif not os.environ.get('WORKFLOW_RUN_ID'):
        # A thread/session can run several routines. Default CLI startup is a
        # new verified run; later phases must explicitly carry its identifier.
        import uuid
        generated_run = uuid.uuid4().hex
        os.environ['WORKFLOW_RUN_ID'] = generated_run
    try:
        result = cloud_check(args.root) if args.cloud else check(args.root, args.source)
    except (OSError, RuntimeError, subprocess.SubprocessError) as exc:
        print(f'FATAL: workflow freshness could not be verified ({type(exc).__name__}); resolve access/source availability before continuing.', file=sys.stderr)
        return 2
    if generated_run and not result['missing']:
        result['runId'] = generated_run
        result['continuation'] = 'For this run only, pass --run-id ' + generated_run + ' to later startup and workflow-preflight.py prepare commands. A new routine starts without that old ID.'
    print(json.dumps(result, indent=2))
    if result['missing']:
        print('STOP: this checkout omits current source changes. Integrate the listed inputs and their dependencies, preserving local work, or run from the source checkout. Re-run this check before loading standards. Do not copy all dirty files or publish inherited work without its required review.', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
