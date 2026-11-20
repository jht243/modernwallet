"""Retain publication inputs and consume existing native live-proof records.

No writing, audit verdict, deployment, permission override or model call.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import checkpoints

ROOT=Path(__file__).resolve().parents[2]

def require(value,message):
    if not value:raise ValueError(message)

def inside(root,value):
    p=Path(value)
    require(not p.is_absolute() and p.parts and p.parts[0]=='reports' and '..' not in p.parts,'Use an internal reports artifact')
    require((root/p).resolve().is_relative_to((root/'reports').resolve()),'Artifact leaves reports')
    return root/p

def read(path):return json.loads(path.read_bytes())
def sha(raw):return hashlib.sha256(raw).hexdigest()

def retain(root,pull,ref,commit,snapshot,job,durable=False):
    require(re.fullmatch(r'refs/heads/(?:claude|codex)/[A-Za-z0-9._/-]+',ref) is not None and '..' not in ref,'Use the original owned working branch')
    require(re.fullmatch('[0-9a-f]{40}',commit) is not None,'Use the actual frozen source commit')
    advertised=subprocess.check_output(['git','ls-remote','origin',ref],cwd=root,text=True).split()
    require(advertised and advertised[0]==commit,'Freeze the actual advertised branch tip before retaining publication')
    subprocess.run(['git','fetch','--quiet','--no-tags','--no-write-fetch-head','origin',commit],cwd=root,check=True)
    digest=pull.stem;raw=pull.read_bytes();require(sha(raw)==digest,'Retain the original frozen intake')
    saved=subprocess.run(['git','show',commit+':'+str(pull.relative_to(root))],cwd=root,capture_output=True)
    if saved.returncode==0:
        original=saved.stdout
    else:
        connection=checkpoints.backend(root,durable)
        require(connection is not None,'Restore the original frozen intake from its durable checkpoint')
        module,store=connection;revision,state=store.read()
        row=checkpoints.data(state)['intakes'].get(digest,{})
        require(revision and row.get('review',{}).get('job')==job,'Use the original chart-reviewed durable intake')
        original=module.git(root,'show',revision+':artifacts/'+digest).stdout
    require(original==raw,'Publication source contains another intake')
    inside(root,snapshot)
    captured=subprocess.check_output(['git','show',commit+':'+snapshot],cwd=root)
    snap=json.loads(captured)
    require(snap.get('routes') and snap['manifest'].get('workflowKind')=='mindmap-pass','Retain the actual complete Mindmap snapshot')
    plan={'kind':'hype-retained-publication-v1','state':'pending','pull':digest,'jobId':job,
          'sourceRef':ref,'sourceCommit':commit,'snapshot':{'path':snapshot,'sha256':sha(captured)},
          'expectedRoutes':{r['path']:r['fingerprint'] for r in snap['routes']},
          'canonicalBase':snap['manifest']['canonicalBase'],
          'authority':'Inputs only. Reuse actual recorded reviews, compose their exact authority and run all normal publication/live checks. No new audit verdict or permission grant.'}
    checkpoints.publication(root,digest,plan,durable)
    return plan

def complete(root,pull,snapshot_path,review_path,live_path=None):
    digest=pull.stem;require(sha(pull.read_bytes())==digest,'Frozen intake changed')
    plan_path=pull.parent/'production'/pull.name;plan=read(plan_path)
    require(plan.get('kind')=='hype-retained-publication-v1','Retain reviewed publication inputs before completion')
    snapshot=read(snapshot_path);review=read(review_path)
    def load(name,file):
        spec=importlib.util.spec_from_file_location(name,root/file);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
    q_mod=load('hype_quarantine','.claude/tools/quarantine.py') if (root/'.claude/tools/quarantine.py').is_file() else None
    expected_active={
        p:fp for p,fp in plan['expectedRoutes'].items()
        if not (q_mod and q_mod.is_quarantined(root,'hype-radar-auto',item_id=plan.get('jobId'),route=p))
    }
    require(snapshot['manifest']['canonicalBase']==plan['canonicalBase'] and
            {r['path']:r['fingerprint'] for r in snapshot['routes']}==expected_active,'Do not omit or change the retained reviewed routes')
    renderer=load('hype_completed_render','.claude/tools/rendered-audit.py')
    policy=load('hype_completed_policy','.claude/tools/content-review-policy.py')
    renderer.valid_snapshot(snapshot)
    require(live_path is not None,'Supply the existing actual canonical live snapshot; do not recapture or re-audit unchanged output')
    renderer.compare(snapshot,read(live_path),review)
    provenance=load('hype_host_provenance','.claude/tools/deployment-evidence.local.py')
    require(policy.check_rendered(root,snapshot,review,force=True),'Actual recorded review/release authority required')
    commits=set()
    for row in review['routes']:
        admission=policy.read(policy.artifact(root,row['reviewBudget']))
        with policy.Journal(root,plan['canonicalBase'],row['path']) as journal:
            cycle=next((c for c in journal.cycles if c['cycleId']==admission['cycleId']),None)
            require(cycle and cycle['status']=='published','Run the existing exact-live record-deployment step before completion')
            events=[e['data'] for e in journal.events if e['kind']=='published' and e['data']['cycleId']==cycle['cycleId']]
            require(events and events[-1].get('verifiedAt'),'Missing actual published journal event')
            commits.add(events[-1]['commit'])
    for commit in commits:
        require(re.fullmatch('[0-9a-f]{40}',commit) is not None,'Missing actual verified publication commit')
    require(len(commits)==1,'Use the single original actual publication commit')
    proof=provenance.verify(root,provenance.fetch(),next(iter(commits)))
    proof['purpose']='host-deployment-evidence'
    result={**plan,'hostVerification':proof,
            'completedLiveSnapshot':{'path':str(live_path.relative_to(root)),'sha256':sha(live_path.read_bytes())},'state':'complete','publishedCommits':sorted(commits),
            'completedSnapshot':{'path':str(snapshot_path.relative_to(root)),'sha256':sha(snapshot_path.read_bytes())},
            'completedReview':{'path':str(review_path.relative_to(root)),'sha256':sha(review_path.read_bytes())}}
    checkpoints.publication(root,digest,result)
    return {'ok':True,'jobId':plan['jobId'],'publishedRoutes':len(snapshot['routes']),'state':'complete'}

def _route_present_in_repo(root, route_path):
    """Best-effort check whether a published route path/slug already exists in the current repo checkout."""
    clean = str(route_path or '').strip().strip('/')
    if not clean:
        return False
    slug = clean.rsplit('/', 1)[-1]
    if not slug:
        return False
    # 1. Check sitemaps first (fastest authoritative signal on Next.js/Astro/static fleet sites)
    for sm in list((root / 'public').glob('sitemap*.xml')) if (root / 'public').is_dir() else []:
        try:
            txt = sm.read_text(errors='ignore')
            if f'/{clean}' in txt or f'/{slug}<' in txt or f'/{slug}/<' in txt:
                return True
        except OSError:
            pass
    # 2. Check data/*.ts / content files / static HTML / Next.js & Astro route files
    for rel in ('data', 'src/data', 'src/content', 'content', 'guides', 'public', 'src/pages', 'pages', 'src/app', 'app'):
        base = root / rel
        if not base.is_dir():
            continue
        for cand in (
            base / (slug + '.md'),
            base / (slug + '.mdx'),
            base / (slug + '.html'),
            base / (slug + '.tsx'),
            base / (slug + '.astro'),
            base / clean / 'index.html',
            base / clean / 'index.tsx',
            base / clean / 'index.astro',
            base / clean / 'page.tsx',
            base / (clean + '.tsx'),
            base / (clean + '.astro'),
            base / (clean + '.md'),
            base / (clean + '.mdx'),
        ):
            if cand.is_file():
                return True
        if rel in ('data', 'src/data'):
            for f in base.glob('*.ts'):
                try:
                    if f'"{slug}"' in f.read_text(errors='ignore') or f"'{slug}'" in f.read_text(errors='ignore'):
                        return True
                except OSError:
                    pass
    return False


def _chart_created_routes(root, digest):
    """Extract 'create new content' target routes from reports/mindmap-pass/*-hype-<digest[:12]>.md."""
    mm_dir = root / 'reports/mindmap-pass'
    if not mm_dir.is_dir():
        return []
    routes = []
    for chart in sorted(mm_dir.glob(f'*-hype-{digest[:12]}.md')):
        try:
            text = chart.read_text(errors='ignore')
        except OSError:
            continue
        for line in text.splitlines():
            if '|' not in line or 'create new content' not in line.lower():
                continue
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            for idx, cell in enumerate(cells):
                if cell.lower() == 'create new content' and idx + 1 < len(cells):
                    cand = cells[idx + 1].strip().split()[0].strip('`"\'')
                    if cand.startswith('/') and len(cand) > 1 and cand not in routes:
                        routes.append(cand)
    return routes


def _verified_live_run_dir(root, digest):
    """Return the mindmap run directory if live.json and host-evidence.json prove live completion on main."""
    runs_dir = root / 'reports/mindmap-pass/runs'
    if not runs_dir.is_dir():
        return None
    for run_dir in sorted(runs_dir.glob(f'*-hype-{digest[:12]}')):
        live_path = run_dir / 'live.json'
        host_path = run_dir / 'host-evidence.json'
        if not (live_path.is_file() and host_path.is_file()):
            continue
        try:
            live = read(live_path)
            host = read(host_path)
        except Exception:
            continue
        if (
            live.get('status') == 'all-live'
            and int(live.get('verifiedCount') or 0) >= 1
            and int(live.get('pendingCount') or 0) == 0
            and host.get('status') == 'live'
            and host.get('includesPublicationCommit') is True
        ):
            return run_dir
    return None


def retire(root, pull, reason, durable=False, extra=None):
    """Explicitly retire an unrecoverable retained publication without fabricating a PASS or wiping history."""
    digest = pull.stem
    require(sha(pull.read_bytes()) == digest, 'Frozen intake changed')
    require(bool(str(reason or '').strip()), 'Provide a non-empty retirement reason')
    plan_path = pull.parent / 'production' / pull.name
    plan = read(plan_path) if plan_path.is_file() else {'kind': 'hype-retained-publication-v1', 'pull': digest}
    require(plan.get('state') != 'complete', 'Cannot retire already-completed production')
    updated = {
        **plan,
        'state': 'retired',
        'retiredReason': str(reason).strip(),
        'retiredAt': datetime.now(timezone.utc).isoformat(),
    }
    if isinstance(extra, dict):
        updated.update(extra)
    checkpoints.publication(root, digest, updated, durable=durable)
    return updated


def reconcile_orphaned(root, pull, durable=False):
    """Auto-retire a retained publication ONLY when origin is reachable AND its sourceRef/sourceCommit are provably gone or already live on main."""
    plan_path = pull.parent / 'production' / pull.name
    if not plan_path.is_file():
        return None
    try:
        plan = read(plan_path)
    except Exception:
        return None
    if checkpoints.production_complete(plan):
        return None
    digest = pull.stem
    verified_dir = _verified_live_run_dir(root, digest)
    if verified_dir is not None:
        return retire(
            root,
            pull,
            'already-published-and-live-verified-on-main',
            durable=True,
            extra={
                'orphanedSourceVerified': True,
                'liveEvidenceDir': str(verified_dir.relative_to(root)),
            },
        )
    if plan.get('kind') != 'hype-retained-publication-v1':
        reviewed_path = pull.parent / 'reviewed' / pull.name
        if reviewed_path.is_file():
            chart_routes = _chart_created_routes(root, digest)
            if chart_routes and all(_route_present_in_repo(root, r) for r in chart_routes):
                return retire(
                    root,
                    pull,
                    'chart-routes-already-published-on-main',
                    durable=True,
                    extra={
                        'orphanedSourceVerified': True,
                        'routesPresentOnMain': sorted(chart_routes),
                    },
                )
        return None
    source_commit = str(plan.get('sourceCommit') or '').strip()
    source_ref = str(plan.get('sourceRef') or '').strip()
    if not re.fullmatch(r'[0-9a-f]{40}', source_commit) or not source_ref:
        return None
    # Fail-closed #1: if sourceRef still exists locally AND points to a live commit, job is NOT orphaned.
    local_ref = subprocess.run(['git', 'show-ref', '--verify', '--quiet', source_ref], cwd=root, capture_output=True)
    local_obj = subprocess.run(['git', 'cat-file', '-e', f'{source_commit}^{{commit}}'], cwd=root, capture_output=True)
    if local_ref.returncode == 0 and local_obj.returncode == 0:
        return None
    # Fail-closed #2: verify origin is actually reachable (never retire on transient network/auth error).
    head_check = subprocess.run(['git', 'ls-remote', 'origin', 'HEAD'], cwd=root, capture_output=True, text=True)
    if head_check.returncode != 0 or not head_check.stdout.strip():
        return None
    # Fail-closed #3: verify both sourceRef and sourceCommit are absent on origin.
    ref_check = subprocess.run(['git', 'ls-remote', 'origin', source_ref], cwd=root, capture_output=True, text=True)
    if ref_check.returncode != 0 or ref_check.stdout.strip():
        return None
    commit_check = subprocess.run(['git', 'ls-remote', 'origin', source_commit], cwd=root, capture_output=True, text=True)
    if commit_check.returncode != 0 or commit_check.stdout.strip():
        return None
    expected = plan.get('expectedRoutes') or {}
    present = [route for route in expected if _route_present_in_repo(root, route)]
    all_present = bool(expected) and len(present) == len(expected)
    if all_present:
        reason = 'orphaned-source-branch-already-on-main'
    elif plan.get('state') == 'blocked' and plan.get('blockedReason') == 'mechanical-dependency':
        reason = 'orphaned-source-branch-deleted'
    else:
        return None
    return retire(
        root,
        pull,
        reason,
        durable=durable,
        extra={
            'orphanedSourceVerified': True,
            'routesPresentOnMain': sorted(present),
        },
    )


def main():
    p=argparse.ArgumentParser(description=__doc__);s=p.add_subparsers(dest='command',required=True)
    r=s.add_parser('retain');r.add_argument('--pull',required=True);r.add_argument('--source-ref',required=True);r.add_argument('--commit',required=True);r.add_argument('--snapshot',required=True);r.add_argument('--job-id',required=True);r.add_argument('--durable',action='store_true')
    f=s.add_parser('complete');f.add_argument('--pull',required=True);f.add_argument('--snapshot',required=True);f.add_argument('--review',required=True);f.add_argument('--live-snapshot',required=True)
    b=s.add_parser('blocked');b.add_argument('--pull',required=True);b.add_argument('--reason',required=True,choices=['platform-approval','mechanical-dependency'])
    t=s.add_parser('retire');t.add_argument('--pull',required=True);t.add_argument('--reason',required=True);t.add_argument('--durable',action='store_true')
    a=p.parse_args();pull=inside(ROOT,a.pull)
    if a.command=='retain':result=retain(ROOT,pull,a.source_ref,a.commit,a.snapshot,a.job_id,a.durable)
    elif a.command=='complete':result=complete(ROOT,pull,inside(ROOT,a.snapshot),inside(ROOT,a.review),inside(ROOT,a.live_snapshot))
    elif a.command=='retire':result=retire(ROOT,pull,a.reason,durable=a.durable)
    else:
        plan=read(pull.parent/'production'/pull.name)
        if plan.get('state')=='complete':plan['verificationBlockedReason']=a.reason
        else:plan.update(state='blocked',blockedReason=a.reason)
        checkpoints.publication(ROOT,pull.stem,plan);result={'ok':False,'state':'blocked','reason':a.reason}
    print(json.dumps(result,sort_keys=True))

if __name__=='__main__':main()
