"""A chart receipt owns the work until all its real publication cycles close."""
import importlib.util
import json
import subprocess
from pathlib import Path


def publication_targets(plan):
    return sorted({action['target'].rstrip('/') or '/' for action in plan.get('actions',[]) if action.get('bucket') != 'consolidation advisory'})


def _restore_durable_routes(root, policy, routes):
    durable_path = root / '.claude/tools/content-review-durable.py'
    if not durable_path.is_file() or not (root / '.claude/tools/workflow-control-store.py').is_file():
        return
    try:
        hosts = policy.policy(root).get('canonicalHosts') or []
        if not hosts:
            return
        spec = importlib.util.spec_from_file_location('hype_durable_restore', durable_path)
        durable = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(durable)
        for route in list(routes):
            durable.restore(root, policy.Journal(root, 'https://' + hosts[0], route))
    except Exception:
        return


def outstanding(root, proof):
    routes=set(proof.get('productionTargets',[]))
    if not routes:return []
    spec=importlib.util.spec_from_file_location('hype_review_history',root/'.claude/tools/content-review-policy.py')
    policy=importlib.util.module_from_spec(spec);spec.loader.exec_module(policy)
    _restore_durable_routes(root, policy, routes)
    for path in (root/'reports/content-review-journals').glob('*.jsonl'):
        with path.open() as stream:first=stream.readline()
        if not first.strip():continue
        identity=json.loads(first)['identity'];route=identity['route'].rstrip('/') or '/'
        if route not in routes:continue
        with policy.Journal(root,identity['canonicalBase'],identity['route']) as journal:
            if any(c['jobId']==proof['job'] and c['status']=='published' for c in journal.cycles):routes.remove(route)
    return sorted(routes)


def work_reference(root):
    branch=subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip()
    return branch if branch.startswith('claude/') else ''


def restore_work(root, proof):
    # A recovery archive is evidence only. Never check out the old branch over
    # current application files or import a past preflight as today's reading.
    import hashlib
    import re
    from pathlib import PurePosixPath
    revision = proof.get('retainedWorkCommit')
    branch = proof.get('workBranch')
    if not branch or not re.fullmatch(r'claude/[A-Za-z0-9._/-]+', branch):
        return None
    if revision and not re.fullmatch(r'[0-9a-f]{40}', revision):
        raise ValueError('Invalid retained Hype revision')
    ref = revision or ('refs/heads/' + branch)
    get = lambda *args: subprocess.run(['git', *args], cwd=root, capture_output=True)
    if not revision or get('cat-file', '-e', revision + '^{commit}').returncode:
        fetched = get('fetch', '--quiet', '--no-tags', 'origin', ref)
        if fetched.returncode:
            if revision: raise ValueError('Restore pinned Hype work before rebuilding any paid stage')
            return None
        if not revision: revision = get('rev-parse', 'FETCH_HEAD').stdout.decode().strip()
    prefix = 'reports/mindmap-pass/'
    paths = get('ls-tree', '-r', '--name-only', revision, '--', prefix).stdout.decode().splitlines()
    canonical = lambda obj: hashlib.sha256(json.dumps(obj,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
    def original(name):
        result = get('show', revision + ':' + name)
        if result.returncode: raise ValueError('Missing original Hype file: '+name)
        return result.stdout
    for name in paths:
        if not name.endswith('/approval-manifest.json'): continue
        parent = name.rsplit('/',1)[0]
        if proof['job'] not in parent: continue
        review_name = parent + '/chart-review.json'
        if review_name not in paths: continue
        plan, review = json.loads(original(name)), json.loads(original(review_name))
        if canonical(plan)!=proof['manifest'] or canonical(review)!=proof['review']: continue
        archive = Path(get('rev-parse','--absolute-git-dir').stdout.decode().strip()) / 'hype-resume' / revision
        wanted = [name, review_name, plan['chartPath']]
        wanted.extend(p for p in paths if p.startswith((parent+'/drafts/',parent+'/audit/',parent+'/evidence/',parent+'/handoffs/')) or p==parent+'/HOLD.md')
        for p in dict.fromkeys(wanted):
            rel = PurePosixPath(p)
            if not p.startswith(prefix) or '..' in rel.parts or rel.is_absolute():
                raise ValueError('Invalid Hype archive path')
            dst = archive.joinpath(*rel.parts); dst.parent.mkdir(parents=True,exist_ok=True)
            if not dst.exists(): dst.write_bytes(original(p))
        return archive
    if proof.get('retainedWorkCommit'):
        raise ValueError('Original Hype archive does not match the independent manifest and verdict')
    return None
