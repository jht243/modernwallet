"""Reserve Mindmap generation work before a provider request; preserve native review journals."""
import fcntl
import hashlib
import importlib.util
import json
from pathlib import Path
import os

def read(p):
    return json.loads(Path(p).read_bytes())

def load_policy(root):
    spec=importlib.util.spec_from_file_location('generation_review_policy',root/'.claude/tools/content-review-policy.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module

def scope(root,args):
    manifest=getattr(args,'mindmap_manifest',None)
    if not manifest:
        return None
    plan=read(manifest);job=read(args.mindmap_review)['jobId']
    targets={row['target']:row for row in plan['actions']}
    matched=[(route,row) for route,row in targets.items()
             if args.slug==route.rstrip('/').rsplit('/',1)[-1]
             or args.slug.startswith(route.rstrip('/').rsplit('/',1)[-1]+'--')]
    if not job or len(matched)!=1:
        raise ValueError('Use the approved canonical job and page identity before generation')
    route,row=matched[0]
    return job,route,row

def current_cycle(root,route,policy):
    found=[]
    for path in (root/'reports/content-review-journals').glob('*.jsonl'):
        with path.open() as stream:
            first=stream.readline()
        if not first:
            continue
        identity=json.loads(first)['identity']
        if identity['siteId']!=policy.policy(root)['siteId'] or identity['route']!=route:
            continue
        with policy.Journal(root,identity['canonicalBase'],route) as journal:
            if journal.cycle:
                found.append(journal.cycle)
    if len(found)>1:
        raise ValueError('Resolve ambiguous canonical review identity before paid generation')
    return found[0] if found else None

def claim_limit(root,args,text):
    selected=scope(root,args)
    if selected is None:
        return None
    _,_,row=selected;policy=load_policy(root)
    level=policy.profile(root,{'text':text},row.get('claimCategories',[]),row.get('reviewProfile'))
    return policy.LIMITS[level]

def reserve(root,args,operation):
    selected=scope(root,args)
    if selected is None:
        return
    job,route,row=selected;policy=load_policy(root)
    key=hashlib.sha256(json.dumps([policy.policy(root)['siteId'],route]).encode()).hexdigest()
    directory=root/'reports/workflow-generation-budgets';directory.mkdir(parents=True,exist_ok=True)
    path=directory/(key+'.json')
    with (directory/(key+'.lock')).open('a') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX)
        if path.exists():
            state=read(path)
        else:
            parent=Path(args.mindmap_manifest).resolve().parent
            slug=route.rstrip('/').rsplit('/',1)[-1]
            drafts=[p for suffix in ('.json','.md') for p in parent.glob('**/drafts*/'+slug+suffix)]
            state={'jobId':job,'route':route,'generated':['full'] if drafts else [],'repairs':[],'previousJobs':[]}
        def admit(state):
            cycle=None
            if state['jobId']!=job:
                cycle=current_cycle(root,route,policy)
                if not cycle or cycle['jobId']!=state['jobId'] or cycle['status']!='published':
                    raise ValueError('Resume the unfinished original page job; a new job cannot restart paid generation')
                state={'jobId':job,'route':route,'generated':[],'repairs':[],
                       'previousJobs':state['previousJobs']+[{k:v for k,v in state.items() if k!='previousJobs'}]}
            if operation=='repair':
                cycle=cycle or current_cycle(root,route,policy)
                if not cycle or cycle['jobId']!=job or cycle['status']!='needs-fix':
                    raise ValueError('A paid repair needs the actual failed independent review')
                last=cycle['rounds'][-1]
                if last['status']!='complete' or last['verdict']!='FAIL' or last['number']>=policy.LIMITS[cycle['profile']]:
                    raise ValueError('No independent review slot remains for this repair')
                report=last['reportObjectSha256']
                if report in state['repairs'] or len(state['repairs'])>=2:
                    raise ValueError('This repair was already reserved or the repair budget is exhausted')
                state['repairs'].append(report)
            else:
                unit='full' if operation=='write' or row.get('bucket')=='create new content' else args.slug
                if 'full' in state['generated'] or unit in state['generated']:
                    raise ValueError('Generation already reserved. Resume the retained candidate; do not regenerate into a different directory')
                state['generated'].append(unit)
            return state
        cloud = os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_REMOTE','').lower() in ('1','true')
        if cloud:
            spec=importlib.util.spec_from_file_location('generation_checkpoint',root/'.claude/tools/workflow-control-store.py')
            module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
            def save_remote(snapshot):
                budgets=snapshot.setdefault('generationBudgets',{})
                previous=budgets.get(key,state)
                if len(state['generated'])+len(state['repairs'])>len(previous['generated'])+len(previous['repairs']):
                    raise ValueError('Recover divergent generation history before another provider request')
                budgets[key]=admit(previous)
                return budgets[key]
            state=module.Store(root).mutate(save_remote)
        else:
            state=admit(state)
        tmp=path.with_suffix('.tmp');tmp.write_text(json.dumps(state,indent=2)+'\n');os.replace(tmp,path)
