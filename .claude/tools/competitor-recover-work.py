"""Restore a pinned competitor work branch into the current checkout without re-running production."""
import hashlib
import json
import os
import importlib.util
from pathlib import Path
import subprocess
import tempfile


def git(root, *args):
    return subprocess.check_output(['git', *args], cwd=root, stderr=subprocess.DEVNULL)


def checkpoint(root,intake,failure):
    """Keep reviewed work reachable even if the worker never pushed its working branch."""
    tool=root/'.claude/tools/content-review-policy.py'
    if not tool.is_file():return None
    spec=importlib.util.spec_from_file_location('checkpoint_policy',tool)
    policy=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(policy)
    sources={}
    refs=failure['evidence']
    for ref in refs:
        path=policy.artifact(root,ref)
        if path.suffix!='.json':continue
        report=json.loads(path.read_bytes())
        if not isinstance(report,dict) or not report.get('snapshotSha256'):continue
        for row in report.get('routes',[]):
            admission=json.loads(policy.artifact(root,row['reviewBudget']).read_bytes())
            snapshot=json.loads(policy.artifact(root,admission['snapshot']).read_bytes())
            if snapshot['snapshotSha256']!=report['snapshotSha256']:
                raise ValueError('Recovery report and admitted snapshot differ')
            durable=policy.durable_reviews(root)
            ident=admission['identity']
            journal=policy.Journal(root,ident['canonicalBase'],ident['route'])
            context=durable.restore(root,journal)
            if context is None or not journal.path.exists():raise ValueError('Original admission journal unavailable')
            durable.checkpoint(root,journal,context)
            boundary=json.loads(policy.artifact(root,snapshot['correctionBoundary']).read_bytes())
            for route in snapshot['manifest']['routes']:
                for name in route.get('correctionContentFiles',[]):
                    if not name.startswith(('reports/','.claude/')):
                        sources[name]=boundary['files'][name]['sha256']
    if not sources:return None
    default=git(root,'symbolic-ref','refs/remotes/origin/HEAD').decode().strip()
    base=git(root,'merge-base','HEAD',default).decode().strip()
    names=git(root,'ls-files','-co','--exclude-standard','-z','--','reports/mindmap-pass','reports/competitor-monitor/intakes').decode().split('\0')
    names={n for n in names if intake.stem[:12] in n}
    names.update(ref['path'] for ref in refs)
    names.update(sources)
    backend=policy.durable_reviews(root).backend(root)
    if not backend:raise ValueError('Missing durable repository for saved candidate')
    m,_=backend
    with tempfile.TemporaryDirectory() as td:
        env=dict(os.environ,GIT_INDEX_FILE=td+'/index',GIT_AUTHOR_NAME='routine-controller',GIT_AUTHOR_EMAIL='routines@fleet.invalid',GIT_COMMITTER_NAME='routine-controller',GIT_COMMITTER_EMAIL='routines@fleet.invalid')
        m.git(root,'read-tree',base,env=env)
        for name in sorted(names):
            path=m.safe_path(root,name)
            if not path.is_file():continue
            raw=path.read_bytes()
            if name in sources and m.sha(raw)!=sources[name]:
                raise ValueError('Candidate changed since its audit: '+name)
            if m.SECRET.search(raw) or len(raw)>90_000_000:
                raise ValueError('Restricted recovery artifact: '+name)
            oid=m.git(root,'hash-object','-w','--stdin',data=raw).stdout.decode().strip()
            m.git(root,'update-index','--add','--cacheinfo','100644,'+oid+','+name,env=env)
        tree=m.git(root,'write-tree',env=env).stdout.decode().strip()
        branch='automation/competitor-recovery/'+intake.stem+'/'+tree
        ref='refs/heads/'+branch
        remote=m.git(root,'ls-remote','--exit-code','origin',ref,check=False)
        if remote.returncode==0:
            commit=remote.stdout.split()[0].decode()
        else:
            if remote.returncode!=2:raise ValueError('Saved-work remote unavailable')
            commit=m.git(root,'commit-tree',tree,'-p',base,'-m','Checkpoint reviewed competitor intake '+intake.stem,env=env).stdout.decode().strip()
            m.git(root,'push','--quiet','origin',commit+':'+ref)
        return {'workCommit':commit,'workBranch':branch}


def archive_applications(root,policy,report,ref,commit,base):
    # Look up actual rule bytes from the saved workspace. A change to repository
    # instructions between WRITE and AUDIT can give the roles different commits.
    if not report.get('workflowPolicySha256'):return
    role_refs={}
    revisions={}
    for app in report.get('instructionApplications',[]):
        manifest=json.loads(policy.artifact(root,app).read_bytes())
        role={'write':'writer','audit':'reviewer'}.get(manifest['phase'])
        if not role:continue
        files={k:v for k,v in manifest['files'].items() if not k.startswith('reports/')}
        def mismatches(revision):
            bad=[]
            for name,expected in files.items():
                blob=subprocess.run(['git','show',revision+':'+name],cwd=root,capture_output=True)
                if blob.returncode or hashlib.sha256(blob.stdout).hexdigest()!=expected:bad.append(name)
            return bad
        revision=base
        different=mismatches(revision)
        if different:
            candidates=git(root,'log','--first-parent','-32','--format=%P',base,'--',*different).decode().splitlines()
            revision=next((r.split()[0] for r in candidates if r and not mismatches(r.split()[0])),None)
            if not revision:raise ValueError('No original revision matches the saved '+role+' instructions')
        role_refs[role]=app
        revisions[role]=revision
    if set(role_refs)!={'writer','reviewer'}:raise ValueError('Missing real writer/reviewer bindings')
    bindings={**role_refs,'roleCommits':revisions,'policyCommit':revisions['reviewer'],'workflowPolicySha256':report['workflowPolicySha256']}
    path=root/'reports/content-review-journals/recovered-applications'/(policy.digest(report)+'.json')
    policy.save_exact(path,{'savedCommit':commit,'savedReport':ref,'bindings':bindings})


def restore(root, intake, hint):
    branch = hint.get('workBranch', '')
    if not branch.startswith(('claude/', 'automation/competitor-recovery/'+intake.stem+'/')):
        raise ValueError('Unrecognised competitor work branch')
    if git(root, 'check-ref-format', 'refs/heads/'+branch):
        raise ValueError('Missing valid saved competitor work branch')
    tip = git(root, 'ls-remote', '--exit-code', 'origin', 'refs/heads/'+branch).split()[0].decode()
    git(root, 'fetch', '--quiet', '--no-tags', '--no-write-fetch-head', 'origin', tip)
    commit = hint.get('workCommit',tip)
    git(root,'merge-base','--is-ancestor',commit,tip)
    relative=str(intake.relative_to(root))
    if git(root,'show',commit+':'+relative)!=intake.read_bytes():
        raise ValueError('Saved branch belongs to another intake')
    for ref in hint['evidence']:
        if hashlib.sha256(git(root,'show',commit+':'+ref['path'])).hexdigest()!=ref['sha256']:
            raise ValueError('Saved branch lacks the referenced blocking evidence')
    base=git(root,'merge-base',commit,'HEAD').decode().strip()
    changed=git(root,'diff','--name-only','-z',base,commit).decode().strip('\0').split('\0')
    declared=set()
    for ref in hint['evidence']:
        if not ref['path'].endswith('.json'):continue
        report=json.loads(git(root,'show',commit+':'+ref['path']))
        if not isinstance(report,dict) or not report.get('snapshotSha256'):continue
        for row in report.get('routes',[]):
            admitted=json.loads(git(root,'show',commit+':'+row['reviewBudget']['path']))
            snapshot=json.loads(git(root,'show',commit+':'+admitted['snapshot']['path']))
            for route in snapshot['manifest']['routes']:declared.update(route.get('correctionContentFiles',[]))
    planned={}
    source_hashes={}
    rebuild=[]
    for name in filter(None,changed):
        part=Path(name)
        target=root/part
        if part.is_absolute() or '..' in part.parts or not target.resolve().is_relative_to(root) or target.is_symlink():
            raise ValueError('Unsafe recovery path: '+name)
        if name in ('public/search-index.json','public/sitemap-guides.xml'):
            rebuild.append(name)
            continue
        if name.startswith('reports/'):
            belongs=(name.startswith('reports/mindmap-pass/') and intake.stem[:12] in name or
                     name.startswith('reports/competitor-monitor/intakes/') and intake.stem in name)
            if not belongs:
                continue  # The ledger and canonical route journals have their own restore operations.
        elif name not in declared:
            raise ValueError('Reconcile this additional source path before paid work: '+name)
        saved=git(root,'show',commit+':'+name)
        if not name.startswith('reports/'):
            source_hashes[name]=hashlib.sha256(saved).hexdigest()
        previous=target.read_bytes() if target.exists() else None
        if previous==saved:
            continue
        if name.startswith('reports/'):
            if previous is not None:
                raise ValueError('Conflicting existing intake evidence: '+name)
        elif previous is not None:
            original=git(root,'show',base+':'+name)
            if previous!=original:
                with tempfile.TemporaryDirectory() as directory:
                    files=[Path(directory)/n for n in ('current','base','candidate')]
                    for file,data in zip(files,(previous,original,saved)):
                        file.write_bytes(data)
                    result=subprocess.run(['git','merge-file','-p',*files],capture_output=True)
                    if result.returncode:
                        raise ValueError('Resolve saved candidate against concurrent change: '+name)
                    saved=result.stdout
        planned[target]=(previous,saved)
    def install(target,previous,saved):
        if (target.read_bytes() if target.exists() else None)!=previous:
            raise ValueError('Recovery target changed concurrently: '+str(target))
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(saved)
    for target,(previous,saved) in planned.items():
        if target.is_relative_to(root/'reports'):
            install(target,previous,saved)
    def module(filename):
        spec=importlib.util.spec_from_file_location(filename,root/'.claude/tools'/(filename+'.py'))
        value=importlib.util.module_from_spec(spec)
        spec.loader.exec_module(value)
        return value
    policy=module('content-review-policy')
    durable=module('content-review-durable')
    restored_routes=[]
    recorded=[]
    reviewed_hashes={}
    pending_reports=[]
    for ref in hint['evidence']:
        evidence=root/ref['path']
        if evidence.suffix!='.json':
            continue
        report=json.loads(evidence.read_bytes())
        if not isinstance(report,dict) or not report.get('snapshotSha256'):
            continue
        archive_applications(root,policy,report,ref,commit,base)
        for row in report.get('routes',[]):
            admission=json.loads(policy.artifact(root,row['reviewBudget']).read_bytes())
            ident=admission['identity']
            journal=policy.Journal(root,ident['canonicalBase'],ident['route'])
            conn=durable.restore(root,journal)
            if conn is None or not journal.path.is_file():
                raise ValueError('Restore the original journal before allocating a new round: '+ident['route'])
            snap=json.loads(policy.artifact(root,admission['snapshot']).read_bytes())
            boundary=json.loads(policy.artifact(root,snap['correctionBoundary']).read_bytes())
            for name in source_hashes:
                entry=boundary['files'].get(name,{})
                if entry.get('sha256')==source_hashes[name]:reviewed_hashes[name]=entry['sha256']
            restored_routes.append(ident['route'])
        pending_reports.append(evidence)
    if pending_reports and reviewed_hashes!=source_hashes:
        raise ValueError('Saved source changes differ from the independent review capture')
    for target,(previous,saved) in planned.items():
        if not target.is_relative_to(root/'reports'):
            install(target,previous,saved)
    for evidence in pending_reports:
        recorded.extend(policy.record(root,evidence))
    release={}
    if len(pending_reports)==1:
        report_path=pending_reports[0]
        report=json.loads(report_path.read_bytes())
        rows=report['routes']
        if all(r['verdict']=='PASS' or json.loads(policy.artifact(root,r['reviewBudget']).read_bytes())['number']==policy.LIMITS[r['reviewProfile']] for r in rows):
            admitted=json.loads(policy.artifact(root,rows[0]['reviewBudget']).read_bytes())
            snapshot=policy.artifact(root,admitted['snapshot'])
            data=json.loads(snapshot.read_bytes())
            policy.renderer_module().review_check(data,report)
            release={'phase':'publish','approvedSnapshot':admitted['snapshot'],'review':policy.reference(root,report_path),
                     'routes':[r['path'] for r in rows],'jobId':admitted['jobId']}
            folder=report_path.parent
            manifests=report.get('instructionApplications',[])
            for ref in manifests:
                manifest=json.loads(policy.artifact(root,ref).read_bytes())
                if manifest.get('phase')!='audit':continue
                previous=root/manifest['handoff']
                handoff=json.loads(previous.read_bytes())
                if set(handoff['routes'])!=set(release['routes']):continue
                handoff.update(previous=policy.reference(root,previous),producer='competitor-recovery',
                               nextAction='PUBLISH: verify the current merged render and release the exact recorded candidate.',
                               snapshot=release['approvedSnapshot'],review=release['review'])
                target=folder/('publish-recovery-'+policy.digest(handoff)[:16]+'.json')
                policy.save_exact(target,handoff)
                local=policy.local_module(root,data) if hasattr(policy,'local_module') else None
                if local is not None:local.handoff_check(root,target,phase='publish')
                release['publishHandoff']=policy.reference(root,target)
    return {'release':release,'recordedExistingDecisions':recorded,'restoredOriginalJournals':restored_routes,'commit':commit,'restoredFiles':len(planned),'regenerateFromMergedSources':rebuild,
            'next':'Use the sealed publish handoff when present. Rebuild generated outputs and compare the current merged render. If equal, deploy; if different, capture the changed routes before dispatching a reviewer.'}
