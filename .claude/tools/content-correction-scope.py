#!/usr/bin/env python3
"""Bound a small editorial recheck to its real source/render delta. No generated PASS."""
import argparse
import difflib
import hashlib
import html
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
import datetime as dt

VERSION='targeted-corrections-2026-11-08.1'
EXCLUDED={'reports','.git','node_modules','.next','dist','build','.cache','coverage','tmp','.tmp','.venv','venv','__pycache__'}
FRESH_FACTS={'centralFacts','instructionUnderstanding','riskClassification','seoQuality'}
CARRY_RENDERED={'sourceSupport','testingAndAttribution','scopeAndExclusions'}
SENSITIVE=re.compile(r'\b(?:not|no|never|without|except|unless|only|must|may|can|cannot|should|always|guarantee\w*|safe\w*|unsafe|effective\w*|ineffective\w*|best|worst|recommend\w*|proven|tested|million|billion|percent|mg|mcg|ml|kg|dollars?)\b',re.I)


def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module


def budget():return load('correction_budget',Path(__file__).with_name('content-review-policy.py'))
def renderer():return load('correction_renderer',Path(__file__).with_name('rendered-audit.py'))
def require(ok,message):
    if not ok:raise ValueError(message)
def read(path):return json.loads(Path(path).read_text())
def sha(raw):return hashlib.sha256(raw).hexdigest()


def boundary(root,out,manifest):
    """Machine-only source inventory; do not deliver its contents to the model."""
    p=budget();names=subprocess.check_output(['git','ls-files','-co','--exclude-standard','-z'],cwd=root).decode().split('\0')
    files={};copy={name for row in manifest['routes'] for name in row.get('correctionContentFiles',[])}|{'public/search-index.json'}
    names+=list(copy)+['.claude/tools/content-correction-scope.py','.claude/commands/_content-correction-scope.md','.claude/rules/content-correction-scope.md']
    for name in copy:
        require(isinstance(name,str) and not Path(name).is_absolute() and '..' not in Path(name).parts and
                Path(name).parts[0] in {'src','app','pages','content','data','public'} and
                Path(name).suffix in {'.json','.md','.mdx','.ts','.tsx','.js','.jsx','.astro','.html'} and
                not re.search(r'(?:^|[/_.-])(?:secrets?|credentials?|private[-_]?keys?|tokens?)(?:[/_.-]|$)',name,re.I),
                'Declare actual page content paths only; never archive credentials as correction content')
    for name in sorted(set(names)):
        if not name or any(part in EXCLUDED for part in Path(name).parts):continue
        path=root/name
        if path.is_symlink():files[name]={'symlink':str(path.readlink())};continue
        if path.is_file():
            raw=path.read_bytes();files[name]={'sha256':sha(raw)}
            if name in copy:
                files[name]['artifact']=p.freeze(root,path,out.parent/'correction-sources')
                require(files[name]['artifact']['sha256']==files[name]['sha256'],'Content changed while sealing its source boundary; recapture')
    p.save_exact(out,{'version':VERSION,'files':files})
    return dict(p.reference(root,out),version=VERSION)


def words(text):return re.findall(r"\w+(?:['’-]\w+)*|[^\w\s]",text)


def changes(before,after):
    a=words(before);b=words(after);result=[]
    for kind,i,j,k,l in difflib.SequenceMatcher(None,a,b,autojunk=False).get_opcodes():
        if kind!='equal':result.append({'before':' '.join(a[i:j]),'after':' '.join(b[k:l]),'changedTokens':max(j-i,l-k),
                                        'beforeContext':' '.join(a[max(0,i-30):min(len(a),j+30)]),
                                        'afterContext':' '.join(b[max(0,k-30):min(len(b),l+30)])})
    return result


def literal_correction(root,name,before,after,old_text,new_text,route):
    p=budget()
    try:
        a=p.artifact(root,before['artifact']).read_text();b=p.artifact(root,after['artifact']).read_text()
    except (ValueError,KeyError,UnicodeError):return False
    def plain(value):return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]*>',' ',value))).strip()
    def visible(old,new):
        old=plain(old);new=plain(new)
        if len(old)<8 or len(new)<8:return False
        edits=changes(old,new)
        return bool(edits) and all(e['beforeContext'] in ' '.join(words(old_text)) and e['afterContext'] in ' '.join(words(new_text)) for e in edits)
    def json_values(old,new):
        if type(old)!=type(new):return False
        if isinstance(old,dict):return old.keys()==new.keys() and all(json_values(old[k],new[k]) for k in old)
        if isinstance(old,list):return len(old)==len(new) and all(json_values(x,y) for x,y in zip(old,new))
        return old==new or isinstance(old,str) and visible(old,new)
    if name=='public/search-index.json':
        try:
            old=json.loads(a);new=json.loads(b)
            if not isinstance(old,list) or not isinstance(new,list):return False
            left={r['u']:r for r in old};right={r['u']:r for r in new}
            return len(left)==len(old)==len(new)==len(right) and left.keys()==right.keys() and route in left and all(left[k]==right[k] for k in left if k!=route) and json_values(left[route],right[route])
        except (ValueError,TypeError,KeyError):return False
    if name.endswith('.json'):
        try:return json_values(json.loads(a),json.loads(b))
        except ValueError:return False
    if name.endswith(('.md','.mdx')):
        # Frontmatter, markup, links and headings are outside a spelling fix.
        for line in difflib.ndiff(a.splitlines(),b.splitlines()):
            if line[:2] in ['- ','+ '] and re.search(r'[<>={}\[\]#]|^[-+] ---',line):return False
        return visible(a,b)
    if not name.endswith(('.js','.ts','.mjs','.cjs','.jsx','.tsx','.astro','.html')):return False
    token=re.compile(r'''(?P<q>["'`])(?:\\[\s\S]|(?!(?P=q))[\s\S])*(?P=q)|(?P<tag><(?:p|li|span|td|th|a|strong|em|div|label|button)(?:\s[^<>]*)?>)(?P<body>[^<>{}]+)(?=<)''')
    def split(value):
        shape=[];values=[];end=0
        for match in token.finditer(value):
            shape.append(value[end:match.start()]);end=match.end()
            if match.group('body') is not None:shape.append(match.group('tag')+'TEXT');values.append(match.group('body'))
            else:
                shape.append(match.group('q')+'STRING'+match.group('q'))
                raw=match.group()[1:-1]
                if '${' in raw:return None,None
                values.append(raw.replace('\\n','\n').replace('\\"','"').replace("\\'","'"))
        shape.append(value[end:]);return shape,values
    sa,va=split(a);sb,vb=split(b)
    return sa is not None and sa==sb and len(va)==len(vb) and all(x==y or visible(x,y) for x,y in zip(va,vb))


def recorded_baseline(root,snapshot,report,route,approval=None):
    p=budget();old,_=p.route_in(snapshot,route)
    require(report.get('snapshotSha256')==snapshot['snapshotSha256'],'Previous review/snapshot mismatch')
    row=next((r for r in report.get('routes',[]) if r['path']==route),None)
    require(row and row.get('fingerprint')==old['fingerprint'],'Missing exact previous page judgment')
    require(report.get('reviewer') and report['reviewer']!=snapshot['manifest']['author'],'Previous review was not independent')
    admission=p.read(p.artifact(root,row.get('reviewBudget')))
    with p.Journal(root,snapshot['manifest']['canonicalBase'],route) as journal:
        cycle=next((c for c in journal.cycles if c['cycleId']==admission['cycleId']),None)
        require(cycle and (approval or cycle is journal.cycle and cycle['status']!='published'),
                'Targeted corrections resume the current unfinished job; a new revision needs its normal fresh review')
        complete=[r for r in cycle['rounds'] if r['status']=='complete']
        if approval and complete and complete[-1].get('reportObjectSha256')==approval:complete=complete[:-1]
        require(complete and complete[-1].get('reportObjectSha256')==p.digest(report),'Use the latest actual recorded independent review')
    return row,admission


def scope(root,before_path,review_path,after_path,route,approval=None):
    p=budget();r=renderer();before=read(before_path);after=read(after_path);review=read(review_path)
    r.valid_snapshot(before);r.valid_snapshot(after)
    prior,admission=recorded_baseline(root,before,review,route,approval)
    proof={'version':VERSION,'previousSnapshot':p.reference(root,before_path),'previousReview':p.reference(root,review_path),
           'snapshot':p.reference(root,after_path),'route':route,'jobId':admission['jobId'],
           'mode':'full','reasons':[],'changes':[],'carryableFactualChecks':[],'carryableRenderedChecks':[],'sourceChanges':[]}
    def broad(reason):proof['reasons'].append(reason)
    if before['manifest']!=after['manifest']:broad('Manifest, SEO dates, permissions or route scope changed')
    if before.get('contentReviewPolicy')!=after.get('contentReviewPolicy'):broad('Risk/review policy changed')
    try:
        age=dt.datetime.fromisoformat(after['capturedAt'].replace('Z','+00:00'))-dt.datetime.fromisoformat(before['capturedAt'].replace('Z','+00:00'))
        if not dt.timedelta(0)<=age<=dt.timedelta(hours=24):broad('Previous evidence is outside the same-day correction window')
    except (ValueError,KeyError,TypeError):broad('Missing actual previous capture time')
    old,spec=p.route_in(before,route);new,_=p.route_in(after,route)
    if {x['path'] for x in before['routes']}!={x['path'] for x in after['routes']}:broad('Affected route coverage changed')
    for page in before['routes']:
        current=next((x for x in after['routes'] if x['path']==page['path']),None)
        if current is not None and page['path']!=route and current['fingerprint']!=page['fingerprint']:broad('Another affected page changed')
    if {k:v for k,v in old['semantic'].items() if k!='text'}!={k:v for k,v in new['semantic'].items() if k!='text'}:
        broad('Markup, headings, metadata/schema, links, attribution or layout changed')
    edits=changes(old['semantic']['text'],new['semantic']['text']);proof['changes']=edits
    total=sum(x['changedTokens'] for x in edits);page_words=len(words(old['semantic']['text']))
    if not edits:broad('No visible correction: reuse the existing approval and run mechanical/live checks')
    if len(edits)>3 or total>12 or total>max(2,int(page_words*.03)):broad('Correction exceeds the bounded small-edit scope')
    for edit in edits:
        changed=edit['before']+' '+edit['after']
        if re.search(r'\d|[$€£%<>={}]',changed) or SENSITIVE.search(changed) or p.FLAGS.search(changed) or p.MANDATORY_HIGH.search(changed):
            broad('A number, factual qualifier, recommendation, safety or consequential term changed')
    chain=0;cursor=prior
    while cursor.get('correctionScope'):
        chain+=1
        if chain>=3:broad('Cumulative correction chain requires a fresh full review');break
        old_scope=read(p.artifact(root,cursor['correctionScope']))
        older=read(p.artifact(root,old_scope['previousReview']))
        cursor=next(x for x in older['routes'] if x['path']==route)
    source_before=before.get('correctionBoundary');source_after=after.get('correctionBoundary')
    if not source_before or not source_after:broad('Missing original source boundary: run a full review')
    else:
        a=read(p.artifact(root,source_before));b=read(p.artifact(root,source_after))
        require(a.get('version')==b.get('version')==VERSION,'Unknown correction boundary version')
        def fingerprint(entry):return {k:v for k,v in (entry or {}).items() if k!='artifact'}
        changed=[name for name in sorted(set(a['files'])|set(b['files'])) if fingerprint(a['files'].get(name))!=fingerprint(b['files'].get(name))]
        proof['sourceChanges']=changed
        if not changed:broad('No captured source change explains the rendered correction')
        allowed=spec.get('correctionContentFiles',[])
        permitted=set(allowed)|{'public/search-index.json'} if isinstance(allowed,list) else set()
        if not allowed or not set(changed)<=permitted:broad('Source/template/assets changed outside the original page content files')
        for name in changed:
            if re.search(r'(?:^|/)(?:components?|layouts?|templates?|middleware|routes)(?:/|\.)|\[',name,re.I):
                broad('Shared template/data code requires broader review')
            if name not in a['files'] or name not in b['files']:broad('Source file added or deleted')
            elif not literal_correction(root,name,a['files'][name],b['files'][name],old['semantic']['text'],new['semantic']['text'],route):
                broad('Source delta is not a proven reader-text correction: '+name)
    dependencies=before['manifest'].get('reviewDependencies',[])
    if not isinstance(dependencies,list) or not dependencies:broad('No complete original evidence dependency inventory')
    else:
        for ref in dependencies:p.artifact(root,ref)
    checks=prior.get('checks',{});facts=prior.get('factualReview',{})
    required=set(p.FACTS.get(prior.get('reviewProfile'),[]))|{'riskClassification','seoQuality'}
    if (root/'.claude/workflow-policy.local.json').is_file():required.add('instructionUnderstanding')
    if set(checks)!=r.CHECKS or set(facts)!=required:broad('Previous review did not cover the complete page and factual scope')
    for group in [checks,facts]:
        if any(not isinstance(v,dict) or v.get('status') not in ['PASS','FAIL','NA'] or len(v.get('evidence','').strip())<20 for v in group.values()):
            broad('Incomplete original findings/evidence cannot be carried')
    proof['carryableFactualChecks']=sorted(name for name,item in facts.items() if name not in FRESH_FACTS and item.get('status') in ['PASS','NA'])
    proof['carryableRenderedChecks']=sorted(name for name,item in checks.items() if name in CARRY_RENDERED and item.get('status') in ['PASS','NA'])
    if not proof['reasons']:proof['mode']='targeted'
    return proof


def validate(root,snapshot,report):
    p=budget()
    for row in report.get('routes',[]):
        if not row.get('correctionScope'):continue
        receipt=read(p.artifact(root,row['correctionScope']))
        require(receipt.get('version')==VERSION and receipt.get('route')==row['path'],'Wrong correction scope')
        fresh=scope(root,p.artifact(root,receipt['previousSnapshot']),p.artifact(root,receipt['previousReview']),p.artifact(root,receipt['snapshot']),row['path'],p.digest(report))
        require(receipt==fresh and receipt['mode']=='targeted','Scope changed or requires a full affected-page review')
        require(read(p.artifact(root,receipt['snapshot']))==snapshot,'Targeted review belongs to a different snapshot')
        admission=read(p.artifact(root,row.get('reviewBudget')))
        require(admission['jobId']==receipt['jobId'] and admission['reviewer']==report.get('reviewer'),'Retain the original job and actual independent reviewer')
        previous=read(p.artifact(root,receipt['previousReview']));old=next(x for x in previous['routes'] if x['path']==row['path'])
        require(row.get('reviewProfile') in p.LEVELS and
                (row['reviewProfile']==old.get('reviewProfile') if row.get('verdict')=='PASS' else
                 p.LEVELS.index(row['reviewProfile'])>=p.LEVELS.index(old['reviewProfile'])),
                'A targeted correction cannot downgrade risk; an actual FAIL may escalate for full review')
        carried=row.get('carriedFactualChecks',[])
        require(isinstance(carried,list) and set(carried)<=set(receipt['carryableFactualChecks']) and len(set(carried))==len(carried),'Only unchanged previously sufficient factual checks may be carried')
        for name in carried:
            require(row.get('factualReview',{}).get(name)==old['factualReview'][name],'Preserve the exact original finding, status and evidence')
        require(not any(row.get('factualReview',{}).get(name)==value for name,value in old['factualReview'].items() if name not in carried),
                'Current and previously failed factual checks need fresh real evidence')
        actual=row.get('correctionReview',{})
        for name in ['changedPassage','meaningAndScope','priorFindings','unchangedEvidence']:
            item=actual.get(name,{})
            require(item.get('status') in (['PASS'] if row.get('verdict')=='PASS' else ['PASS','FAIL']) and len(item.get('evidence','').strip())>=40,
                    'Record the genuine independent targeted judgment: '+name)
        rendered=row.get('carriedRenderedChecks',[])
        require(isinstance(rendered,list) and len(set(rendered))==len(rendered) and set(rendered)<=set(receipt['carryableRenderedChecks']),
                'Only proven unchanged source/testing/scope findings can be carried')
        for name in rendered:require(row.get('checks',{}).get(name)==old['checks'][name],'Retain the exact original rendered finding and evidence')
        require(all(row.get('checks',{}).get(k)!=v for k,v in old['checks'].items() if k not in rendered),
                'Full-render coherence/layout and SEO checks must be freshly verified')
    return True


def sources(root,report_path):
    p=budget();result=set(p.sources(root,report_path)['paths']);report=read(report_path);pending=[r['correctionScope'] for r in report['routes'] if r.get('correctionScope')]
    def add(ref):
        path=p.artifact(root,ref);result.add(str(path.relative_to(root)));return path
    seen=set()
    while pending:
        ref=pending.pop();key=(ref.get('path'),ref.get('sha256'))
        if key in seen:continue
        seen.add(key)
        receipt=read(add(ref));old=read(add(receipt['previousReview']));before=read(add(receipt['previousSnapshot']));after=read(add(receipt['snapshot']))
        for snapshot in [before,after]:
            captured=read(add(snapshot['correctionBoundary']))
            for entry in captured['files'].values():
                if entry.get('artifact'):add(entry['artifact'])
            for ref in snapshot['manifest'].get('reviewDependencies',[]):add(ref)
        pending.extend(r['correctionScope'] for r in old['routes'] if r.get('correctionScope'))
    return {'paths':sorted(result),'scope':'Actual correction and original evidence dependencies; no generated editorial approval.'}


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--root',default=str(Path(__file__).resolve().parents[2]));sub=parser.add_subparsers(dest='command',required=True)
    prepare=sub.add_parser('prepare')
    for key in ['previous-snapshot','previous-review','snapshot','route','out']:prepare.add_argument('--'+key,required=True)
    record=sub.add_parser('record');record.add_argument('--review',required=True)
    deps=sub.add_parser('sources');deps.add_argument('--review',required=True)
    args=parser.parse_args();root=Path(args.root).resolve();p=budget()
    if args.command=='prepare':
        result=scope(root,p.inside(root,args.previous_snapshot),p.inside(root,args.previous_review),p.inside(root,args.snapshot),args.route)
        p.save_exact(p.inside(root,args.out),result)
        print(json.dumps({**result,'scopeArtifact':p.reference(root,p.inside(root,args.out))},indent=2))
    elif args.command=='record':
        path=p.inside(root,args.review);report=read(path)
        snapshots=[read(p.artifact(root,read(p.artifact(root,r['reviewBudget']))['snapshot'])) for r in report['routes']]
        require(snapshots and all(x==snapshots[0] for x in snapshots),'One actual rendered snapshot per report')
        validate(root,snapshots[0],report);print(json.dumps(p.record(root,path),indent=2))
    else:print(json.dumps(sources(root,p.inside(root,args.review)),indent=2))


if __name__=='__main__':
    try:main()
    except (ValueError,KeyError,OSError) as error:print('BLOCKED: '+str(error),file=sys.stderr);sys.exit(1)
