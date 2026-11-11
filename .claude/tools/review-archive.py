"""Persist and verify the bytes used for a fleet editorial decision. No model calls."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile

SOURCE_DIRS = {'src', 'app', 'pages', 'components', 'content', 'data', 'public', 'static',
               'styles', 'layouts', 'templates', 'theme', 'themes', 'lib', 'assets'}
SOURCE_EXTS = {'.astro','.html','.htm','.md','.mdx','.css','.scss','.sass','.less','.ts','.tsx',
               '.js','.jsx','.mjs','.cjs','.json','.yaml','.yml','.py','.jinja','.jinja2','.vue','.svelte','.toml'}
ROOT_FILES = {'server.py','app.py','main.py','astro.config.mjs','astro.config.ts','next.config.js',
              'next.config.mjs','next.config.ts','scripts/generate_seo_pages.py'}
PRIVATE = re.compile(r'(?:^|[/_.-])(?:secrets?|credentials?|private[-_]?keys?|tokens?|transcripts?)(?:[/_.-]|$)',re.I)

def source(name):
    p = Path(name)
    return (bool(p.parts) and not p.is_absolute() and '..' not in p.parts
            and not any(x.startswith('.') for x in p.parts) and not PRIVATE.search(name)
            and (name in ROOT_FILES or (p.parts[0] in SOURCE_DIRS and p.suffix.lower() in SOURCE_EXTS)))

def call(root, *args, check=True):
    return subprocess.run(['git', *args],cwd=root,capture_output=True,check=check)

def changed_sources(root):
    """Save render-affecting edits, including styles, templates, additions and deletions."""
    base = None
    has_origin = call(root,'remote','get-url','origin',check=False).returncode == 0
    candidates = ['refs/remotes/origin/HEAD','refs/remotes/origin/main'] if has_origin else ['HEAD']
    for candidate in candidates:
        ref = call(root, 'rev-parse', '--verify', candidate+'^{commit}', check=False)
        if not ref.returncode:
            merge = call(root,'merge-base','HEAD',ref.stdout.decode().strip(),check=False)
            if not merge.returncode:
                base = merge.stdout.decode().strip()
                break
    if has_origin and not base:
        listing=call(root,'ls-remote','origin','HEAD').stdout.split()
        if not listing:raise ValueError('Missing published source base for recovery')
        published=listing[0].decode()
        if call(root,'cat-file','-e',published+'^{commit}',check=False).returncode:
            call(root,'fetch','--quiet','--no-tags','--no-write-fetch-head','origin',published)
        base=call(root,'merge-base','HEAD',published).stdout.decode().strip()
    names = call(root,'ls-files','--others','--exclude-standard','-z').stdout
    if base:
        names += call(root,'diff','--no-renames','--name-only','-z',base,'--').stdout
    else:
        names += call(root,'ls-files','-z').stdout
    return base, {n for n in os.fsdecode(names).split('\0') if source(n)}

def durable(root):
    src=root/'.claude/tools/content-review-durable.py'
    spec=importlib.util.spec_from_file_location('archive_durable',src)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module

def verified_objects(root, revision, digests):
    """Read from the commit actually advertised by the remote; hash each unique blob once."""
    if not revision: raise ValueError('Missing remote review archive')
    wanted_list=sorted(set(digests))
    if not all(re.fullmatch('[0-9a-f]{64}',v) for v in wanted_list):
        raise ValueError('Invalid archive digest')
    specs=''.join(revision+':artifacts/'+v+'\n' for v in wanted_list).encode()
    result=subprocess.run(['git','cat-file','--batch-check=%(objectname) %(objecttype)'],cwd=root,input=specs,capture_output=True,check=True)
    headers=result.stdout.splitlines()
    if len(headers)!=len(wanted_list):raise ValueError('Incomplete archive index')
    cache=Path(call(root,'rev-parse','--absolute-git-dir').stdout.decode().strip())/'verified-review-blobs'
    cache.mkdir(parents=True,exist_ok=True)
    new=[]
    for wanted,header in zip(wanted_list,headers):
        parts=header.split()
        if len(parts)!=2 or parts[1]!=b'blob':raise ValueError('Remote review archive is missing '+wanted)
        receipt=cache/wanted
        if not receipt.is_file() or receipt.read_bytes()!=parts[0]:new.append((wanted,parts[0]))
    if not new:return
    process=subprocess.Popen(['git','cat-file','--batch'],cwd=root,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL)
    try:
        for wanted, oid in new:
            if not re.fullmatch('[0-9a-f]{64}',wanted):raise ValueError('Invalid review archive digest')
            process.stdin.write((revision+':artifacts/'+wanted+'\n').encode());process.stdin.flush()
            header=process.stdout.readline().split()
            if len(header)!=3 or header[1]!=b'blob':raise ValueError('Remote review archive is missing '+wanted)
            remaining=int(header[2]);digest=hashlib.sha256()
            while remaining:
                chunk=process.stdout.read(min(remaining,1024*1024))
                if not chunk:raise ValueError('Truncated remote review archive')
                digest.update(chunk);remaining-=len(chunk)
            if process.stdout.read(1)!=b'\n' or digest.hexdigest()!=wanted:
                raise ValueError('Remote review archive bytes differ: '+wanted)
            with tempfile.NamedTemporaryFile(dir=cache,delete=False) as stamp:stamp.write(oid)
            os.replace(stamp.name,cache/wanted)
    finally:
        process.stdin.close();process.stdout.close();process.wait()

def marker(root, prefix):
    sid=os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID')
    if not sid:return None
    key=hashlib.sha256(sid.encode()).hexdigest()+'.json'
    p=Path(os.fsdecode(call(root,'rev-parse','--git-path',prefix+key).stdout).strip())
    return p if p.is_absolute() else root/p

def search_job(root):
    lease=marker(root,'search-gap-recovery/leases/')
    if not lease or not lease.is_file():return None
    value=json.loads(lease.read_bytes())
    return {k:value[k] for k in ('site','run','owner')}

def snapshot_sources(root, folder):
    d=durable(root);base,names=changed_sources(root);files={}
    for name in sorted(names):
        target=root/name
        if target.is_symlink():raise ValueError('Resolve changed source symlink before review: '+name)
        if target.is_file():
            raw=target.read_bytes();digest=d.sha(raw)
            cache=d.cache(root,name,digest,raw)
            files[name]={'sha256':digest,'artifact':{'path':str(cache.relative_to(root)),'sha256':digest}}
    result={'recoveryBaseCommit':base,'recoverySourcePaths':sorted(names),'files':files}
    raw=json.dumps(result,sort_keys=True).encode()
    target=d.cache(root,'reviewed-sources.json',d.sha(raw),raw)
    return {'path':str(target.relative_to(root)),'sha256':d.sha(raw)}


def source_manifest(root, snapshot, d, fresh):
    base, names = changed_sources(root)
    boundary = snapshot.get('correctionBoundary') or snapshot.get('reviewSourceArchive')
    original = {}
    if boundary:
        bp = root/boundary['path']
        if not bp.is_file() or d.sha(bp.read_bytes()) != boundary['sha256']:
            bp = d.cache_path(root, boundary['path'], boundary['sha256'])
        if not bp.is_file() or d.sha(bp.read_bytes()) != boundary['sha256']:
            raise ValueError('Missing signed source boundary')
        boundary_data = json.loads(bp.read_bytes())
        original = boundary_data['files']
        base = boundary_data.get('recoveryBaseCommit', base)
        names = set(boundary_data.get('recoverySourcePaths', names))
    files = {}
    for name in names:
        if not source(name):continue
        path = root/name
        if path.is_symlink():raise ValueError('Resolve the changed source symlink before archiving: '+name)
        expected = original.get(name,{}).get('sha256')
        if expected is None:
            if not path.is_file():files[name] = None
            continue
        raw = path.read_bytes() if path.is_file() else b''
        if expected != d.sha(raw):
            cached = d.cache_path(root,name,expected)
            if not cached.is_file() or d.sha(cached.read_bytes()) != expected:
                raise ValueError('Reviewed source differs; recapture the approved preview before publishing: '+name)
            raw = cached.read_bytes()
        saved = d.cache(root,name,expected,raw)
        files[name] = {'path':str(saved.relative_to(root)), 'sha256':expected}
    return base, files


def save_checked_pair(root, snapshot_file, review_file, fresh=False):
    snapshot=json.loads(snapshot_file.read_bytes())
    job=search_job(root)
    if not job and snapshot.get('manifest',{}).get('workflowKind')!='mindmap-pass':return
    if not (root/'.claude/content-review-policy.json').is_file():return
    from urllib.parse import urlsplit
    canon=urlsplit(snapshot['manifest']['canonicalBase']).hostname
    preview=urlsplit(snapshot['baseUrl']).hostname
    if canon and preview and canon.removeprefix('www.')==preview.removeprefix('www.'):return
    d=durable(root);conn=d.backend(root)
    if conn is None:return
    _,store=conn
    refs={}
    for path in (snapshot_file,review_file):
        name=path.resolve().relative_to(root).as_posix()
        if not name.startswith('reports/'):raise ValueError('Store reviewed release evidence under internal reports')
        refs[name]=d.sha(path.read_bytes())
    source_snapshot=snapshot
    if fresh and not (snapshot.get('correctionBoundary') or snapshot.get('reviewSourceArchive')):
        recapture=snapshot_file.with_suffix('.recapture.json')
        source_snapshot=json.loads(recapture.read_bytes())
        refs[str(recapture.resolve().relative_to(root))]=d.sha(recapture.read_bytes())
    base,files=source_manifest(root,source_snapshot,d,fresh)
    if not base:raise ValueError('Missing source base commit for the reviewed release')
    job_id = (job and job['run']) or snapshot['manifest'].get('jobId') or key_for_refs(refs)
    history = {}
    invalid = set()
    report = json.loads(review_file.read_bytes())
    for row in report.get('routes', []):
        admission_ref = row.get('reviewBudget')
        if not admission_ref:
            continue
        if not history and not invalid:
            path = root/'.claude/tools/content-review-policy.py'
            spec = importlib.util.spec_from_file_location('release_review_policy', path)
            policy = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(policy)
        admission = json.loads(policy.artifact(root, admission_ref).read_bytes())
        identity = admission['identity']
        journal = policy.Journal(root, identity['canonicalBase'], identity['route'])
        if not journal.path.is_file():
            d.restore(root, journal)
        if not journal.path.is_file():
            raise ValueError('Missing original review journal for '+identity['route'])
        history.update(d.collect(root,journal))
        invalid.update(d.invalidated(journal))
    return persist(root,store,d,refs,base,files,job,job_id,True,history,invalid)


def key_for_refs(refs):
    return hashlib.sha256(json.dumps(refs,sort_keys=True).encode()).hexdigest()


def persist(root,store,d,refs,base,files,job,job_id,release,history=None,invalid=None):
    key=d.sha(json.dumps([refs,base,files,job_id],sort_keys=True).encode())
    revision,state=store.read()
    indexes=state.get('verifiedReleasePairs',{})
    if key in indexes:
        index=indexes[key]
    else:
        more={v['path']:v['sha256'] for v in files.values() if v}
        paths={**(history or {}),**d.collect(root,None,{**refs,**more},invalid=invalid)}
        index_bytes=json.dumps({'roots':refs,'paths':paths,'baseCommit':base,'sourceFiles':files,'jobId':job_id,'searchSite':job['site'] if job else None},sort_keys=True).encode()
        index=d.sha(index_bytes)
        index_file=d.cache(root,'release-index.json',index,index_bytes)
        paths[str(index_file.relative_to(root))]=index
        archived=set((state.get('job') or {}).get('artifacts',{}).values())
        missing={value:name for name,value in paths.items() if value not in archived}
        def register(current):
            if current.get('job') is None:current['job']={'artifacts':{}}
            records=current.setdefault('verifiedReleasePairs',{})
            if key in records and records[key]!=index:raise ValueError('Conflicting evidence for immutable reviewed pair')
            records[key]=index
            current.setdefault('reviewPairsByJob',{}).setdefault(job_id,{})[key]=index
        store.mutate(register,list(missing.values()),source_parent=base)
        revision,state=store.read()
        if state.get('verifiedReleasePairs',{}).get(key)!=index:raise ValueError('Release archive write not confirmed')
    raw=call(root,'show',revision+':artifacts/'+index).stdout
    if d.sha(raw)!=index:raise ValueError('Release archive index changed')
    saved=json.loads(raw)
    if saved['roots']!=refs or saved['sourceFiles']!=files:raise ValueError('Wrong review archive')
    verified_objects(root,revision,saved['paths'].values())
    receipt=marker(root,'review-release-receipts/') if release else None
    if receipt:
        scope = hashlib.sha256(json.dumps(job,sort_keys=True).encode()).hexdigest()
        directory=receipt.parent/receipt.stem/scope
        directory.mkdir(parents=True,exist_ok=True)
        with tempfile.NamedTemporaryFile(mode='w',dir=directory,delete=False) as f:
            json.dump({'job':job,'pair':key,'index':index,'archiveCommit':revision},f)
        os.replace(f.name,directory/(key+'.json'))

    return index


def confirm_changed_journals(root, changed):
    if not any(source(name) for name in changed):return
    journals=[n for n in changed if Path(n).parent==Path('reports/content-review-journals') and n.endswith('.jsonl')]
    if not journals:return
    d=durable(root);conn=d.backend(root)
    if conn is None:return
    _,store=conn;revision,state=store.read()
    for name in journals:
        raw=call(root,'show','HEAD:'+name,check=False)
        if raw.returncode:continue
        lines=raw.stdout.splitlines()
        if not lines:continue
        last=json.loads(lines[-1])
        if last.get('kind')!='record' or last['data'].get('legacyImport'):continue
        head=d.sha(raw.stdout)
        saved=next((entry for entry in state.get('reviewJournals',{}).values()
                    if entry.get('head')==head and entry.get('artifacts',{}).get(name)==head),None)
        if not saved:
            raise ValueError('A changed review journal has no matching remote archive. Checkpoint the original journal and its evidence before publishing: '+name)
        verified_objects(root,revision,saved['artifacts'].values())


def require_search_archive(root, changed):
    changed={name for name in changed if source(name)}
    job=search_job(root)
    if not job or not changed:return
    receipt=marker(root,'review-release-receipts/')
    scope=hashlib.sha256(json.dumps(job,sort_keys=True).encode()).hexdigest()
    receipts=list((receipt.parent/receipt.stem/scope).glob('*.json'))
    _,store=durable(root).backend(root);revision,state=store.read()
    records=state.get('verifiedReleasePairs',{})
    proofs=[json.loads(file.read_bytes()) for file in receipts]
    if not proofs:
        # A replacement worker has a new lease owner and no local receipts. Recover only
        # the original verified packages for this site's still-active canonical intake.
        proofs=[{'pair':pair,'index':index,'archiveCommit':None,'job':job}
                for pair,index in state.get('reviewPairsByJob',{}).get(job['run'],{}).items()]
    if not proofs:
        raise ValueError('Archive the approved preview and review using the native rendered-audit check before publishing this Search Gap job')
    matched=set()
    for proof in proofs:
        if proof.get('job')!=job or records.get(proof['pair'])!=proof['index']:
            raise ValueError('The checked review package is unavailable on the remote')
        raw=call(root,'show',revision+':artifacts/'+proof['index']).stdout
        if hashlib.sha256(raw).hexdigest()!=proof['index']:raise ValueError('Release archive index differs')
        saved=json.loads(raw)
        if saved.get('jobId')!=job['run'] or (not receipts and saved.get('searchSite')!=job['site']):
            continue
        if revision!=proof['archiveCommit']:verified_objects(root,revision,saved['paths'].values())
        for name in changed.intersection(saved['sourceFiles']):
            captured=saved['sourceFiles'][name]
            head=call(root,'show','HEAD:'+name,check=False)
            if captured is None and head.returncode or captured and not head.returncode and hashlib.sha256(head.stdout).hexdigest()==captured['sha256']:
                matched.add(name)
    if changed-matched:
        raise ValueError('The exact changed source must be present in a verified review archive before publishing: '+', '.join(sorted(changed-matched)))


def archive_metadata(root, intake, completion):
    job=search_job(root)
    if not job:raise ValueError('Use the active native Search Gap session')
    data=json.loads(completion.read_bytes());packet=json.loads(intake.read_bytes())
    if data.get('runId')!=job['run'] or packet.get('runId')!=job['run'] or data.get('site')!=job['site'] or data.get('intakeSha256')!=hashlib.sha256(intake.read_bytes()).hexdigest():
        raise ValueError('The metadata approval belongs to a different intake')
    import sys
    sys.path.insert(0,str(root/'scripts/search_gap'))
    import worker
    if not worker.metadata_coverage(data):raise ValueError('Native metadata coverage is empty')
    d=durable(root);_,store=d.backend(root);refs={};files={};base,_=changed_sources(root)
    for item in data['metadataOnly']:
        for name in (data['chart'],data['chartReview'],item['manifest'],item['auditReceipt'],item['approvedValues']):
            if not name.startswith('reports/') or not (root/name).resolve().is_relative_to(root/'reports'):raise ValueError('Internal metadata evidence required')
            refs[name]=d.sha((root/name).read_bytes())
        name=item['sourceFile']
        if not source(name):raise ValueError('Retain the metadata source through the normal source archive')
        raw=(root/name).read_bytes()
        approved=call(root,'show',item['sourceCommit']+':'+name).stdout
        if raw!=approved:raise ValueError('Only the exact independently approved metadata source can take this path')
        digest=d.sha(raw);f=d.cache(root,name,digest,raw)
        files[name]={'path':str(f.relative_to(root)),'sha256':digest}
    return persist(root,store,d,refs,base,files,job,job['run'],True)


def restore_package(root, job_id):
    d=durable(root);_,store=d.backend(root);rev,state=store.read()
    packages=state.get('reviewPairsByJob',{}).get(job_id,{})
    if not packages:raise ValueError('No archived release under this job; preserve the original missing-evidence status')
    gitdir=Path(call(root,'rev-parse','--absolute-git-dir').stdout.decode().strip())
    for index in sorted(set(packages.values())):
        raw=call(root,'show',rev+':artifacts/'+index).stdout
        if d.sha(raw)!=index:raise ValueError('Wrong recovery index')
        entry=json.loads(raw);folder=gitdir/'review-recovery'/index
        if entry.get('jobId')!=job_id:raise ValueError('Recovery job mismatch')
        verified_objects(root,rev,entry['paths'].values())
        def copy(name,digest,where):
            dest=(where/name).resolve()
            if not dest.is_relative_to(where.resolve()):raise ValueError('Unsafe archived path')
            content=call(root,'show',rev+':artifacts/'+digest).stdout
            if d.sha(content)!=digest or (dest.exists() and dest.read_bytes()!=content):raise ValueError('Recovery bytes conflict')
            dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(content)
        for name,digest in entry['paths'].items():copy(name,digest,folder)
        for name,ref in entry['sourceFiles'].items():
            if ref:copy(name,ref['sha256'],folder/'sources')
        (folder/'index.json').write_bytes(raw)
        print('Verified recovery package:',folder)


if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();sub=parser.add_subparsers(dest='action',required=True)
    recover=sub.add_parser('restore');recover.add_argument('--job',required=True)
    meta=sub.add_parser('metadata');meta.add_argument('--intake',type=Path,required=True);meta.add_argument('--completion',type=Path,required=True)
    args=parser.parse_args();root=Path(__file__).resolve().parents[2]
    if args.action=='restore':restore_package(root,args.job)
    else:print('Verified metadata package:',archive_metadata(root,args.intake,args.completion))
