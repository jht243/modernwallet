#!/usr/bin/env python3
"""Coverage-first research planning. Never creates editorial decisions or PASSes.

An existing vendor row can avoid another company/pricing crawl for a vendor-
addition task. It cannot answer a new product, news, clinical or pricing claim.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import datetime as dt
import hashlib
from html.parser import HTMLParser
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import urlsplit

VERSION='coverage-first-vendors-2026-11-08.1'
SHARED={'github.com','huggingface.co','apps.apple.com','play.google.com','notion.site','substack.com','medium.com','linkedin.com','facebook.com','x.com','youtube.com','amazon.com','wikipedia.org'}
CHANGE_FIELDS=['newProduct','productVersion','version','model','requestedOffering','releaseDate','announcement','announcementUrl','materialChange','refreshRequired','refreshReason','newClaim','changeEvidence','pricingChanged','pricingUpdate','priceChange','capabilityChange','productChanged','newVersion']


def require(ok,message):
    if not ok:raise ValueError(message)
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def read(path):return json.loads(Path(path).read_text())
def sha(raw):return hashlib.sha256(raw).hexdigest()
def digest(value):return sha(json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode())
def now():return dt.datetime.now(dt.timezone.utc)
def domain(value):
    u=urlsplit(value if '://' in value else 'https://'+value)
    require(u.scheme in ['http','https'] and u.hostname and not u.username and not u.password,'Use an actual vendor URL/domain')
    return u.hostname.lower().removeprefix('www.').rstrip('.')
def inside(root,name):
    p=(root/name).resolve();require(root.resolve() in p.parents and 'public' not in p.relative_to(root.resolve()).parts,'Keep vendor research evidence internal');return p
def ref(root,path):return {'path':str(path.resolve().relative_to(root.resolve())),'sha256':sha(path.read_bytes())}
def artifact(root,value):
    require(isinstance(value,dict),'Missing research evidence reference');path=inside(root,value['path'])
    require(path.is_file() and sha(path.read_bytes())==value.get('sha256'),'Vendor evidence missing or changed');return path
def save(path,value):
    raw=(json.dumps(value,indent=2,sort_keys=True)+'\n').encode();save_raw(path,raw)
def save_raw(path,raw):
    path.parent.mkdir(parents=True,exist_ok=True)
    if path.exists():require(path.read_bytes()==raw,'Preserve immutable vendor evidence; use a new version')
    else:
        with path.open('xb') as stream:stream.write(raw)
def freeze(root,path,directory):
    raw=path.read_bytes();target=directory/'blobs'/sha(raw)/path.name;save_raw(target,raw);return ref(root,target)


class VendorCells(HTMLParser):
    """Only visible first-column vendor links in actual main/article tables."""
    VOID={'meta','link','img','input','br','hr','source','wbr','area','base','embed','param','track','col'}
    def __init__(self):super().__init__(convert_charrefs=True);self.stack=[];self.cells=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);style=re.sub(r'\s+','',a.get('style','').lower())
        hidden=any(n['hidden'] for n in self.stack) or tag in ['script','style','template','noscript'] or 'hidden' in a or a.get('aria-hidden','').lower()=='true' or 'display:none' in style or 'visibility:hidden' in style or bool(set(a.get('class','').split())&{'hidden','sr-only','visually-hidden','invisible'})
        node={'tag':tag,'hidden':hidden}
        tables=[n for n in self.stack if n['tag']=='table' and not n['hidden']]
        if not hidden and len(tables)==1 and any(n['tag'] in ['main','article'] for n in self.stack):
            row=next((n for n in reversed(self.stack) if 'columns' in n),None)
            if tag=='tr':node['columns']=[]
            if tag in ['td','th'] and row is not None:node.update(cell={'text':[],'links':[]},row=row)
            cell=next((n for n in reversed(self.stack) if 'cell' in n),None)
            if tag=='a' and cell and a.get('href'):cell['cell']['links'].append(a['href'])
        if tag not in self.VOID:self.stack.append(node)
    def handle_data(self,data):
        if any(n['hidden'] for n in self.stack):return
        cell=next((n for n in reversed(self.stack) if 'cell' in n),None)
        if cell:cell['cell']['text'].append(data)
    def handle_endtag(self,tag):
        i=next((i for i in range(len(self.stack)-1,-1,-1) if self.stack[i]['tag']==tag),None)
        if i is None:return
        for n in reversed(self.stack[i:]):
            if 'cell' in n:n['row']['columns'].append(n['cell'])
            if n.get('columns'):self.cells.append(n['columns'][0])
        del self.stack[i:]


def linked_vendor(html,canonical):
    p=VendorCells();p.feed(html);p.close()
    for cell in p.cells:
        if not ''.join(cell['text']).strip():continue
        for link in cell['links']:
            try:host=domain(link)
            except ValueError:continue
            if host==canonical or host.endswith('.'+canonical):return True
    return False


def native_covered(root,snapshot,page,canonical,native,identities):
    native.covered_check(root,snapshot,page['path'],canonical,identities)
    html=Path(page['htmlFile']).read_text();visible=VendorCells();visible.feed(html);visible.close()
    if linked_vendor(html,canonical):return
    # Preserve the native NONE link-policy exception, but never count an
    # invisible name as reader coverage merely because it exists in HTML.
    names={' '.join(''.join(cell['text']).split()).casefold() for cell in visible.cells}
    for source in identities.get((page['path'],canonical),[]):
        if source.get('linkKinds') and all(kind=='none' for kind in source['linkKinds']):
            cells=native.covered_rows('<main><table><tr><td>'+source['cellHtml']+'</td></tr></table></main>')
            if cells and cells[0]['text'] in names:return
    raise ValueError('Covered vendor needs a visible current first-column identity')


def git(root,*args):return subprocess.check_output(['git','-C',str(root),*args],stderr=subprocess.PIPE,timeout=120)


def history_aliases(root,directory,revision=None,clock=None):
    """Read only prior independently reviewed POSITIVE identity evidence.

    Freeze exact original artifacts. Old prices/facts are not reused as current
    claims. Cuts, guesses, name similarity and incomplete jobs never seed this.
    """
    clock=clock or now();revision=revision or git(root,'rev-parse','HEAD').decode().strip()
    require(re.fullmatch('[a-f0-9]{40}',revision),'Pin the verified published source revision')
    paths=git(root,'ls-tree','-r','--name-only',revision,'reports').decode().splitlines()
    completions=[p for p in paths if 'vertical' in p and p.endswith('/completion.json')]
    config=root/'.claude/content-review-policy.json';high=config.is_file() and read(config).get('minimumProfile')=='high';max_age=dt.timedelta(days=1 if high else 7)
    cache={};aliases={}
    def blob(path):
        require(not path.startswith('/') and '..' not in Path(path).parts,'Invalid archived evidence path')
        if path not in cache:cache[path]=git(root,'show',revision+':'+path)
        return cache[path]
    def bound(value):
        raw=blob(value['path']);require(sha(raw)==value['sha256'],'Archived vendor evidence hash mismatch');return raw
    def keep(value):
        raw=bound(value);target=directory/'history'/sha(raw)/Path(value['path']).name;save_raw(target,raw);return ref(root,target)
    for path in completions:
        try:
            done=json.loads(blob(path))
            if done.get('kind')!='vertical-completion-v1':continue
            intake=json.loads(bound(done['intake']));decisions_raw=bound(done['decisions']);decisions=json.loads(decisions_raw)
            plan=json.loads(bound(done['chart']));review=json.loads(bound(done['chartReview']))
            require(review.get('verdict')=='PASS' and review.get('reviewer') and review['reviewer']!=plan.get('author') and review.get('manifestSha256')==digest(plan),'Prior chart was not independently approved')
            require(done['jobId']==intake['jobId']==decisions['jobId']==review['jobId'] and review['verticalDecisionsSha256']==sha(decisions_raw) and review['verticalPoolSha256']==intake['pool']['sha256'],'Prior vendor decisions are not source-bound')
            original={r['id']:r for r in intake['candidates']}
            require(set(original)=={r['id'] for r in decisions['candidates']},'Prior intake accounting is incomplete')
            for row in decisions['candidates']:
                if row['decision'] not in ['covered','enrich'] or not row.get('canonicalDomain'):continue
                candidate=original[row['id']];old=domain(candidate['vendor']['domain']);canonical=domain(row['canonicalDomain'])
                if old==canonical:continue
                for evidence in row.get('evidence',[]):
                    try:
                        v=json.loads(bound(evidence))
                        if v.get('candidateId')!=row['id'] or domain(v.get('poolDomain',''))!=old or domain(v.get('canonicalDomain',''))!=canonical:continue
                        checked=dt.datetime.fromisoformat(v['checkedAt'].replace('Z','+00:00'))
                        if checked.tzinfo is None:checked=checked.replace(tzinfo=dt.timezone.utc)
                        captures=v.get('sourceCaptures',[])
                        if not captures:continue
                        refs=[]
                        for capture in captures:refs.append({'path':capture['file'],'sha256':capture['sha256']});bound(refs[-1])
                        key=(candidate['roundupSlug'],old)
                        bindings={'chart':keep(done['chart']),'review':keep(done['chartReview']),'decisions':keep(done['decisions']),'vendorEvidence':keep(evidence),'sourceCaptures':[keep(r) for r in refs]}
                        value={'originalDomain':old,'canonicalDomain':canonical,'checkedAt':checked.isoformat(),'bindings':bindings,
                               'fresh':dt.timedelta(0)<=clock-checked<=max_age,
                               'evidence':[keep(done['chart']),keep(done['chartReview']),keep(done['decisions']),keep(evidence)]+[keep(r) for r in refs],
                               'scope':'Reviewed identity only; no cached pricing, capabilities or clinical claims.'}
                        if key not in aliases or value['checkedAt']>aliases[key]['checkedAt']:aliases[key]=value
                    except (ValueError,KeyError,TypeError,subprocess.CalledProcessError):continue
        except (ValueError,KeyError,TypeError,subprocess.CalledProcessError):continue
    return aliases


def changed(candidate,default_intent=None):
    if candidate.get('intent',default_intent)!='vendor-addition':return True
    vendor=candidate.get('vendor',{})
    signals={re.sub('[^a-z]','',k.lower()) for k in CHANGE_FIELDS}
    return any(value and re.sub('[^a-z]','',key.lower()) in signals for obj in [candidate,vendor] for key,value in obj.items())


def own_site(intake,base):
    expected='https://layer3labs.io' if intake.get('kind')=='vertical-intake-v1' else intake.get('canonicalBase')
    if not expected:return False
    try:
        for value in [expected,base]:
            u=urlsplit(value)
            if u.scheme!='https' or u.username or u.password or u.port not in [None,443] or u.path not in ['','/'] or u.query or u.fragment:return False
        return domain(expected)==domain(base)
    except ValueError:return False


def plan(root,intake_path,directory,run_id,snapshots=(),aliases=None,native=None,identities=None,clock=None):
    clock=clock or now();intake=read(intake_path);rows=intake.get('candidates',[])
    require(intake.get('jobId') and isinstance(rows,list) and len({r['id'] for r in rows})==len(rows),'Preserve all original vendor candidates and the canonical job')
    aliases=aliases or {};renderer=load('vendor_coverage_renderer',root/'.claude/tools/rendered-audit.py');captures={}
    default_intent='vendor-addition' if intake.get('kind') in ['vertical-intake-v1','vendor-addition-intake-v1'] else None
    for path in snapshots:
        snapshot=read(path);renderer.valid_snapshot(snapshot)
        base=snapshot['manifest']['canonicalBase'];require(snapshot['baseUrl'].rstrip('/')==base.rstrip('/') and urlsplit(base).scheme=='https','Use actual canonical live coverage, not a preview')
        require(own_site(intake,base),'Coverage belongs to another site or lacks the original canonical site identity')
        age=clock-dt.datetime.fromisoformat(snapshot['capturedAt'].replace('Z','+00:00'))
        require(dt.timedelta(minutes=-5)<=age<=dt.timedelta(hours=1),'Coverage needs a fresh own-site capture for this invocation')
        for page in snapshot['routes']:captures[page['path']]=(snapshot,page,path)
    result=[]
    for candidate in rows:
        original=domain(candidate['vendor']['domain']);slug=candidate.get('roundupSlug');route=candidate.get('target') or ('/comparisons/'+slug if slug else None)
        alias=aliases.get((slug,original));canonical=alias['canonicalDomain'] if alias else original
        row={'id':candidate['id'],'originalDomain':original,'canonicalDomain':canonical,'target':route,'research':'normal','reason':'No proven current coverage of this exact vendor on the requested target.','evidence':[]}
        if alias:row['identityEvidence']=alias
        if changed(candidate,default_intent):row.update(research='changed-claims-only',reason='New/unknown intent, product, announcement or refresh trigger: existing brand coverage does not cover the new claim.')
        elif original in SHARED or canonical in SHARED:row['reason']='Shared-host identity needs the actual product/profile; a hostname alone never suppresses research.'
        elif alias and not alias['fresh']:row.update(research='identity-only',reason='Refresh the stale alias identity first; do not repeat the whole company/pricing investigation.',evidence=alias['evidence'])
        elif route in captures:
            snapshot,page,path=captures[route]
            try:
                if native is not None:native_covered(root,snapshot,page,canonical,native,identities or {})
                else:require(linked_vendor(Path(page['htmlFile']).read_text(),canonical),'No exact current vendor table row')
                row.update(research='none-covered',reason='Exact vendor already has a current row on the original target; retain it for independent coverage review without another vendor/profile/pricing crawl.',
                           coveredSnapshot=ref(root,path),evidence=[ref(root,path)]+(alias['evidence'] if alias else []))
            except (ValueError,OSError,KeyError):pass
        result.append(row)
    output={'version':VERSION,'jobId':intake['jobId'],'runId':run_id,'intake':ref(root,intake_path),'preparedAt':clock.isoformat(),
            'candidates':result,'counts':{key:sum(r['research']==key for r in result) for key in ['none-covered','normal','identity-only','changed-claims-only']},
            'scope':'Research allocation only. No editorial decision, cut, approval, publication or factual freshness verdict.'}
    output_path=directory/'vendor-research-plan.json';save(output_path,output);return ref(root,output_path)


def vertical_prepare(root,intake_path,directory,run_id,native,revision=None,clock=None):
    """Operational dispatcher hook: batch own-page checks BEFORE vendor research."""
    directory=directory/('research-'+run_id);path=directory/'vendor-research-plan.json'
    if path.exists():
        value=read(path);require(value['intake']==ref(root,intake_path) and value['runId']==run_id,'Research queue belongs to another original intake/run');validate(root,path);return ref(root,path)
    try:aliases=history_aliases(root,directory,revision,clock)
    except (OSError,subprocess.CalledProcessError):aliases={}
    intake=read(intake_path)
    queries={}
    for candidate in intake['candidates']:
        if not candidate.get('roundupSlug') or changed(candidate,'vendor-addition'):continue
        original=domain(candidate['vendor']['domain']);alias=aliases.get((candidate['roundupSlug'],original))
        canonical=alias['canonicalDomain'] if alias else original
        if canonical in SHARED or alias and not alias['fresh']:continue
        slug = candidate['roundupSlug']
        if re.fullmatch(r'[a-z0-9-]+', slug) and re.fullmatch(r'[a-z0-9.-]+', canonical):
            queries[(slug,canonical)] = {'slug':slug, 'domain':canonical, 'allowMissingRoundup':True}
    identities = {}
    values = list(queries.values())
    if values and hasattr(native,'ensure_identity_runtime') and not native.ensure_identity_runtime(root):
        print('Locked coverage checker unavailable. Unverified vendors need normal research.',file=sys.stderr)
        values = []
    for start in range(0,len(values),200):
        try:
            identities.update(native.source_identities(root,values[start:start+200]))
        except (ValueError,OSError,subprocess.CalledProcessError):
            continue  # Only candidates without usable proof need normal research.
    routes = sorted({route for (route,_),matches in identities.items() if matches})
    snapshots = []
    if routes:
        renderer = load('vendor_own_site_capture',root/'.claude/tools/rendered-audit.py')
        base = 'https://www.layer3labs.io'
        def capture_route(route):
            manifest = {'author':'mechanical-vendor-coverage','canonicalBase':base,'routes':[{'path':route}]}
            path = directory/'own-site-coverage'/(sha(route.encode())+'.json')
            try:
                renderer.capture(manifest,base,path)
                return path
            except (ValueError,OSError):
                return None
        with ThreadPoolExecutor(max_workers=min(8,len(routes))) as pool:
            snapshots = [path for path in pool.map(capture_route,routes) if path is not None]
    return plan(root,intake_path,directory,run_id,snapshots,aliases,native,identities,clock)


def validate_alias(root,row,candidate,prepared):
    a=row.get('identityEvidence',{});b=a.get('bindings',{})
    chart=read(artifact(root,b.get('chart')));review=read(artifact(root,b.get('review')));decisions_path=artifact(root,b.get('decisions'));decisions=read(decisions_path)
    vendor_path=artifact(root,b.get('vendorEvidence'));vendor=read(vendor_path)
    require(review.get('verdict')=='PASS' and review.get('reviewer') and review['reviewer']!=chart.get('author') and
            review.get('manifestSha256')==digest(chart) and review.get('verticalDecisionsSha256')==sha(decisions_path.read_bytes()),'Alias lacks its actual independently reviewed source evidence')
    # The old proof keeps its real old intake ID; a later intake still keeps
    # its own ID. Exact domain + target identity permits reuse without merging
    # the two accounting records or pretending the old review was of this run.
    prior=next((r for r in decisions['candidates'] if r['id']==vendor.get('candidateId')),None)
    require(prior and prior['decision'] in ['covered','enrich'] and domain(prior.get('canonicalDomain',''))==row['canonicalDomain'] and
            any(r['sha256']==sha(vendor_path.read_bytes()) for r in prior['evidence']),'A cut, guess or unrelated vendor cannot supply an alias')
    require(vendor.get('roundupSlug')==candidate.get('roundupSlug') and
            domain(vendor.get('poolDomain',''))==row['originalDomain'] and domain(vendor.get('canonicalDomain',''))==row['canonicalDomain'],'Alias belongs to another vendor or reader target')
    captures=vendor.get('sourceCaptures',[]);refs=b.get('sourceCaptures',[])
    require(captures and len(captures)==len(refs),'Alias needs its original primary-source captures')
    for original,reference in zip(captures,refs):require(original['sha256']==reference['sha256'] and artifact(root,reference),'Alias source capture changed')
    checked=dt.datetime.fromisoformat(vendor['checkedAt'].replace('Z','+00:00'))
    if checked.tzinfo is None:checked=checked.replace(tzinfo=dt.timezone.utc)
    config=root/'.claude/content-review-policy.json';high=config.is_file() and read(config).get('minimumProfile')=='high'
    age=dt.datetime.fromisoformat(prepared)-checked
    require(dt.timedelta(0)<=age<=dt.timedelta(days=1 if high else 7),'Alias identity evidence is stale; refresh identity rather than repeating the full profile')


def validate(root,path):
    value=read(path);require(value.get('version')==VERSION,'Unknown vendor research plan')
    intake=read(artifact(root,value['intake']));require(value['jobId']==intake['jobId'],'Research plan changed the canonical job')
    originals={c['id']:c for c in intake['candidates']};rows=value['candidates']
    require(len(rows)==len(originals) and set(originals)=={r['id'] for r in rows},'Research planning cannot drop or duplicate candidates')
    require(value['counts']=={key:sum(r['research']==key for r in rows) for key in ['none-covered','normal','identity-only','changed-claims-only']},'Research allocation counts changed')
    renderer=load('vendor_coverage_validation',root/'.claude/tools/rendered-audit.py')
    default_intent='vendor-addition' if intake.get('kind') in ['vertical-intake-v1','vendor-addition-intake-v1'] else None
    native_path=root/'.claude/tools/vertical-run.local.py';native=load('vendor_native_validation',native_path) if native_path.is_file() and intake.get('kind')=='vertical-intake-v1' else None
    queries=[{'slug':originals[r['id']]['roundupSlug'],'domain':r['canonicalDomain']} for r in rows if r['research']=='none-covered']
    identities={}
    if native:
        for start in range(0,len(queries),200):identities.update(native.source_identities(root,queries[start:start+200]))
    for row in rows:
        c=originals[row['id']];require(row['originalDomain']==domain(c['vendor']['domain']),'Original vendor identity changed')
        expected=c.get('target') or ('/comparisons/'+c['roundupSlug'] if c.get('roundupSlug') else None)
        require(row['target']==expected,'Vendor research moved to a different reader target')
        require(row['research'] in ['none-covered','normal','identity-only','changed-claims-only'],'Unknown research disposition')
        for reference in row['evidence']:artifact(root,reference)
        if row['research']=='none-covered':
            require(not changed(c,default_intent),'A new claim/product/refresh cannot be suppressed as already covered')
            require(row['canonicalDomain'] not in SHARED and row['originalDomain'] not in SHARED,'Shared-host identity cannot suppress vendor research')
            if row['canonicalDomain']!=row['originalDomain']:validate_alias(root,row,c,value['preparedAt'])
            snapshot=read(artifact(root,row['coveredSnapshot']));renderer.valid_snapshot(snapshot)
            require(snapshot['baseUrl'].rstrip('/')==snapshot['manifest']['canonicalBase'].rstrip('/') and urlsplit(snapshot['baseUrl']).scheme=='https','Covered evidence is not live canonical output')
            require(own_site(intake,snapshot['manifest']['canonicalBase']),'Coverage belongs to another fleet site')
            require(any(p['path']==row['target'] for p in snapshot['routes']),'Coverage is for a different target')
            if native:
                page=next(p for p in snapshot['routes'] if p['path']==row['target'])
                native_covered(root,snapshot,page,row['canonicalDomain'],native,identities)
            else:
                page=next(p for p in snapshot['routes'] if p['path']==row['target'])
                require(linked_vendor(Path(page['htmlFile']).read_text(),row['canonicalDomain']),'No exact current first-column vendor identity')
    return value


def sources(root,path):
    value=validate(root,path);found={str(path.relative_to(root)),value['intake']['path']}
    for row in value['candidates']:
        for reference in row['evidence']:found.add(str(artifact(root,reference).relative_to(root)))
        for reference in row.get('identityEvidence',{}).get('evidence',[]):found.add(str(artifact(root,reference).relative_to(root)))
        if row.get('coveredSnapshot'):
            snapshot=read(artifact(root,row['coveredSnapshot']))
            for p in snapshot['routes']:
                for key in ['htmlFile','textFile']:
                    if p.get(key):found.add(str(Path(p[key]).resolve().relative_to(root)))
    return {'paths':sorted(found),'scope':'Internal exact coverage/identity evidence only; no cached facts promoted to current claims.'}


def queue(root,path,candidate=None):
    value=validate(root,path)
    if candidate:
        row=next((r for r in value['candidates'] if r['id']==candidate),None)
        require(row is not None,'Unknown original candidate ID');return row
    fields=['id','originalDomain','canonicalDomain','target','research','reason']
    return {'jobId':value['jobId'],'counts':value['counts'],'plan':ref(root,path),
            'researchQueue':[{k:r[k] for k in fields} for r in value['candidates'] if r['research']!='none-covered'],
            'coveredForIndependentReview':[{k:r[k] for k in ['id','originalDomain','canonicalDomain','target','coveredSnapshot']} for r in value['candidates'] if r['research']=='none-covered'],
            'scope':'Compact allocation only. Keep the entire original intake. Retrieve one candidate proof when needed; do not load all archived company research again.'}


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--root',default=str(Path(__file__).resolve().parents[2]));sub=parser.add_subparsers(dest='command',required=True)
    q=sub.add_parser('plan');q.add_argument('--intake',required=True);q.add_argument('--run-id',required=True);q.add_argument('--run-dir',required=True);q.add_argument('--snapshot',action='append',default=[])
    for name in ['check','sources']:
        q=sub.add_parser(name);q.add_argument('--plan',required=True)
    q=sub.add_parser('queue');q.add_argument('--plan',required=True);q.add_argument('--candidate')
    args=parser.parse_args();root=Path(args.root).resolve()
    if args.command=='plan':result=plan(root,inside(root,args.intake),inside(root,args.run_dir),args.run_id,[inside(root,p) for p in args.snapshot])
    elif args.command=='check':
        value=validate(root,inside(root,args.plan));result={'jobId':value['jobId'],'counts':value['counts'],'scope':value['scope']}
    elif args.command=='queue':result=queue(root,inside(root,args.plan),args.candidate)
    else:result=sources(root,inside(root,args.plan))
    print(json.dumps(result,indent=2))


if __name__=='__main__':
    try:main()
    except (ValueError,KeyError,OSError,subprocess.CalledProcessError) as error:
        print('BLOCKED: '+(str(error) if isinstance(error,ValueError) else type(error).__name__),file=sys.stderr);sys.exit(1)
