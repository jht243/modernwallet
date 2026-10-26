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
    git(root, 'fetch', '--quiet', '--no-tags', 'origin', ref)
    revision = git(root, 'rev-parse', 'FETCH_HEAD').decode().strip()
    head = git(root, 'rev-parse', 'HEAD').decode().strip()
    receipt_path = Path(os.fsdecode(git(root, 'rev-parse', '--absolute-git-dir')).strip()) / 'workflow-cloud-receipt.json'
    try:
        previous = json.loads(receipt_path.read_text())
    except (FileNotFoundError, ValueError):
        previous = {}
    if previous.get('revision') == revision and previous.get('head') == head:
        return {'status': 'current', 'source': 'origin/' + ref.removeprefix('refs/heads/'), 'revision': revision, 'missing': []}
    paths = set()
    for args in [('diff', '--no-renames', '--name-only', '-z', 'HEAD', revision, '--'),
                 ('diff', '--no-renames', '--name-only', '-z', 'HEAD', '--')]:
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
        receipt_path.write_text(json.dumps({'revision': revision, 'head': head}) + '\n')
    return result


def check(root, source=None):
    root = Path(os.fsdecode(git(root, 'rev-parse', '--show-toplevel')).strip()).resolve()
    source = Path(source).resolve() if source else primary(root)
    if source == root:
        return {'status': 'current', 'source': str(source), 'missing': []}
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
    receipt_path = Path(os.fsdecode(git(root, 'rev-parse', '--absolute-git-dir')).strip()) / 'workflow-source-receipt.json'
    try:
        receipt = json.loads(receipt_path.read_text())
    except (FileNotFoundError, ValueError):
        receipt = {}
    previous = receipt.get('inputs', {}) if receipt.get('source') == str(source) and receipt.get('head') == head else {}
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
        receipt_path.write_text(json.dumps({'source': str(source), 'head': head, 'inputs': inputs}, indent=2) + '\n')
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', default='.')
    parser.add_argument('--source')
    parser.add_argument('--cloud', action='store_true', help='Verify against the live published default branch, not a laptop checkout')
    args = parser.parse_args()
    try:
        result = cloud_check(args.root) if args.cloud else check(args.root, args.source)
    except (OSError, RuntimeError, subprocess.SubprocessError) as exc:
        print(f'FATAL: workflow freshness could not be verified ({type(exc).__name__}); resolve access/source availability before continuing.', file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    if result['missing']:
        print('STOP: this checkout omits current source changes. Integrate the listed inputs and their dependencies, preserving local work, or run from the source checkout. Re-run this check before loading standards. Do not copy all dirty files or publish inherited work without its required review.', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
