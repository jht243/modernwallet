"""Recover original retained review files for this immutable job. No new judgment is made."""
import hashlib
import json
import re
import subprocess
from pathlib import Path

def restore(root, packet, intake_sha):
    index = root / '.claude/search-gap-recovery-sources.json'
    if not index.is_file():
        return None
    row = json.loads(index.read_bytes()).get(intake_sha)
    if not row:
        return None
    if row['site'] != packet['site'] or row['runId'] != packet['runId']:
        raise ValueError('Recovery index belongs to another job')
    sources = row['commits']
    for rev in sources:
        if not re.fullmatch('[0-9a-f]{40}', rev):
            raise ValueError('Expected immutable evidence revision')
        if subprocess.run(['git','cat-file','-e',rev+'^{commit}'],cwd=root,capture_output=True).returncode:
            subprocess.run(['git','fetch','--quiet','--no-tags','--no-write-fetch-head','origin',rev],cwd=root,check=True,capture_output=True)
    for item in row['files']:
        rel = Path(item['path'])
        if rel.is_absolute() or '..' in rel.parts or rel.parts[:1] != ('reports',) or item['commit'] not in sources:
            raise ValueError('Only named internal evidence may be restored')
        dst = (root/rel).resolve()
        if not dst.is_relative_to(root/'reports'):
            raise ValueError('Evidence escapes internal reports')
        raw = subprocess.check_output(['git','show',item['commit']+':'+item.get('originalPath',str(rel))],cwd=root)
        if hashlib.sha256(raw).hexdigest()!=item['sha256']:
            raise ValueError('Original review evidence changed')
        if dst.exists() and dst.read_bytes()!=raw:
            raise ValueError('Conflicting active evidence at '+str(rel))
        if not dst.exists():
            dst.parent.mkdir(parents=True,exist_ok=True)
            with dst.open('xb') as stream: stream.write(raw)
            dst.chmod(0o600)
    completion = json.loads((root/row['completion']).read_bytes())
    receipt = json.loads((root/completion['chartReview']).read_bytes())
    if (completion['runId']!=packet['runId'] or completion['intakeSha256']!=intake_sha
        or receipt.get('verdict')!='PASS' or not receipt.get('reviewer') or receipt.get('reviewer')==receipt.get('author')
        or receipt['intakeSha256']!=intake_sha or receipt['chartSha256']!=hashlib.sha256((root/completion['chart']).read_bytes()).hexdigest()
        or receipt['decisionsSha256']!=hashlib.sha256(json.dumps(completion['decisions'],sort_keys=True).encode()).hexdigest()):
        raise ValueError('Restored decision review does not match the original job')
    return {'completionFile':row['completion'],'completionSourceCommit':sources[0]}
