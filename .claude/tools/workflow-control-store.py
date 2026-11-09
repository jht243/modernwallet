"""Native non-forced Git checkpoints, extracted from the existing routine controller."""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
REF = "refs/heads/automation/mindmap-control"
SECRET = re.compile(rb'(?<![A-Za-z0-9_])(?:sk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY|ri_[A-Za-z0-9_-]{20,}|AQ\.[A-Za-z0-9_-]{20,})')


class ControlError(RuntimeError):
    pass


def git(root, *args, data=None, env=None, check=True):
    r = subprocess.run(['git', '-C', str(root), *args], input=data, env=env,
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=90)
    if check and r.returncode:
        # Never repeat remote URLs, command arguments, or credential-bearing stderr.
        raise ControlError('Git control operation failed: ' + args[0])
    return r


def sha(data):
    return hashlib.sha256(data).hexdigest()


def safe_path(root, relative):
    p = Path(relative)
    if p.is_absolute() or '..' in p.parts or not p.parts or p.parts[0] in {'.git', '.claude'}:
        raise ControlError('Artifact must be a repository-relative content/evidence path')
    if re.search(r'(?i)(?:^|/)(?:\.env[^/]*|[^/]*credentials[^/]*|[^/]*secret[^/]*|[^/]*transcript[^/]*|[^/]*\.pem)$', relative):
        raise ControlError('Sensitive artifact path refused')
    resolved = (root / p).resolve()
    if root.resolve() not in resolved.parents:
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
            git(self.root, 'fetch', '--quiet', '--no-tags', '--no-write-fetch-head', 'origin', revision)
        data = git(self.root, 'show', revision + ':state.json').stdout
        state = json.loads(data)
        if state.get('version') != 1:
            raise ControlError('Unsupported durable control state')
        return revision, state

    def mutate(self, fn, artifacts=()):
        blobs = {}
        for rel in artifacts:
            data = safe_path(self.root, rel).read_bytes()
            if len(data) > 20_000_000 or SECRET.search(data):
                raise ControlError('Sensitive or oversized artifact refused')
            blobs[rel] = (sha(data), data)
        for _ in range(5):
            base, state = self.read()
            result = fn(state)
            for rel, (digest, _) in blobs.items():
                state['job'].setdefault('artifacts', {})[rel] = digest
            with tempfile.TemporaryDirectory(prefix='routine-control-') as td:
                env = dict(os.environ, GIT_INDEX_FILE=td + '/index',
                           GIT_AUTHOR_NAME='routine-controller', GIT_AUTHOR_EMAIL='routines@layer3labs.io',
                           GIT_COMMITTER_NAME='routine-controller', GIT_COMMITTER_EMAIL='routines@layer3labs.io')
                git(self.root, 'read-tree', base if base else '--empty', env=env)
                files = {'state.json': (json.dumps(state, sort_keys=True, indent=2) + '\n').encode()}
                if len(files['state.json']) > 20_000_000 or SECRET.search(files['state.json']):
                    raise ControlError('Sensitive workflow state refused')
                files.update({'artifacts/' + digest: data for digest, data in blobs.values()})
                for path, data in files.items():
                    oid = git(self.root, 'hash-object', '-w', '--stdin', data=data).stdout.decode().strip()
                    git(self.root, 'update-index', '--add', '--cacheinfo', '100644', oid, path, env=env)
                tree = git(self.root, 'write-tree', env=env).stdout.decode().strip()
                args = ['commit-tree', tree] + (['-p', base] if base else [])
                commit = git(self.root, *args, data=b'Checkpoint workflow controller\n', env=env).stdout.decode().strip()
            push = git(self.root, 'push', '--quiet', 'origin', commit + ':' + self.ref, check=False)
            if not push.returncode:
                return result
        raise ControlError('Control ref contention/unavailable; retry later without duplicating work')

