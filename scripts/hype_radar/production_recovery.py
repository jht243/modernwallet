"""A chart receipt owns the work until all its real publication cycles close."""
import importlib.util
import json
import subprocess
from pathlib import Path


def publication_targets(plan):
    return sorted({action['target'].rstrip('/') or '/' for action in plan.get('actions',[])})


def outstanding(root, proof):
    routes=set(proof.get('productionTargets',[]))
    if not routes:return []
    spec=importlib.util.spec_from_file_location('hype_review_history',root/'.claude/tools/content-review-policy.py')
    policy=importlib.util.module_from_spec(spec);spec.loader.exec_module(policy)
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
