"""Native non-forced Git checkpoints, extracted from the existing routine controller."""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
REF = "refs/heads/automation/mindmap-control"
SECRET = re.compile(rb'(?<![A-Za-z0-9_-])(?:sk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY|ri_[A-Za-z0-9_-]{20,}|AQ\.[A-Za-z0-9_-]{20,})')

# Public article URLs whose path slug begins a segment with "sk-<company>-" (e.g.
# SK Telecom, SK Hynix, SK Group — multi-word lowercase hyphenated URL path slugs,
# never sk-proj-/sk-ant- or mixed-case base62 tokens). Redact only that URL path
# slug and continue scanning the rest of the original bytes.
_PUBLIC_SK_URL_SLUG = re.compile(
    rb'https?://[^\s"<>\x27?#]+/(sk-(?!proj-|ant-|svcacct-|live_|test_)[a-z0-9]{1,12}(?:-[a-z0-9]{1,24}){2,})(?=[/?#\s"<>\x27]|$)'
)


def has_sensitive_material(data):
    if not SECRET.search(data):
        return False
    redacted = _PUBLIC_SK_URL_SLUG.sub(
        lambda m: m.group()[:m.start(1) - m.start()] + b'public-slug' + m.group()[m.end(1) - m.start():],
        data,
    )
    return bool(SECRET.search(redacted))




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

    def mutate(self, fn, artifacts=(), source_parent=None):
        blobs = {}
        raw_items = {}
        large_digests = set()
        for rel in artifacts:
            data = safe_path(self.root, rel).read_bytes()
            digest = sha(data)
            raw_items[rel] = (digest, data)
            if (rel.startswith('reports/') and '/correction-sources/blobs/' in rel
                    and Path(rel).name in {'guides-new.ts', 'comparisons-new.ts'}
                    and Path(rel).parent.name == digest):
                large_digests.add(digest)
        for rel, (digest, data) in raw_items.items():
            large_source = (
                digest in large_digests
                or (rel.startswith('reports/content-review-evidence/')
                    and Path(rel).suffix == '.ts'
                    and Path(rel).stem == digest)
            )
            limit = 90_000_000 if large_source else 20_000_000
            if len(data) > limit or has_sensitive_material(data):
                raise ControlError('Sensitive or oversized artifact refused')
            blobs[rel] = (digest, data)
        for _ in range(5):
            base, state = self.read()
            result = fn(state)
            for rel, (digest, _) in blobs.items():
                state['job'].setdefault('artifacts', {})[rel] = digest
            state_bytes = (json.dumps(state, sort_keys=True, indent=2) + '\n').encode()
            if len(state_bytes) > 20_000_000 or has_sensitive_material(state_bytes):
                raise ControlError('Sensitive workflow state refused')
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
            if source_parent is not None:
                if not re.fullmatch('[0-9a-f]{40,64}', source_parent):
                    raise ControlError('Invalid review source base')
                git(self.root, 'cat-file', '-e', source_parent + '^{commit}')
                if not base or git(self.root, 'merge-base', '--is-ancestor', source_parent, base, check=False).returncode:
                    args.extend(['-p', source_parent])
            commit = git(self.root, *args, data=b'Checkpoint workflow controller\n', env=no_lazy_env).stdout.decode().strip()
            push = git(self.root, 'push', '--quiet', 'origin', commit + ':' + self.ref, env=no_lazy_env, check=False, timeout=120)
            if not push.returncode:
                return result
        raise ControlError('Control ref contention/unavailable; retry later without duplicating work')

