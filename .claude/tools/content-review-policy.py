#!/usr/bin/env python3
"""Portable risk-based editorial review and an append-only per-page round budget.

Records real independent judgments; never writes an editorial PASS. Mechanical
checks, chart review and pre-review lint do not consume content-review rounds.
Every initial content audit, fix verification and rework audit does consume one.
"""
import argparse
import datetime as dt
import fcntl
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import uuid
from urllib.parse import urlsplit

CONFIG = '.claude/content-review-policy.json'
CONTRACT = '.claude/commands/_content-review-policy.md'
VERSION = 'risk-review-budget-2026-11-08.1'
LEVELS = ['light', 'standard', 'high']
LIMITS = {'light': 1, 'standard': 2, 'high': 3}
FACTS = {
    'light': ['centralFacts', 'truthfulEvidence'],
    'standard': ['centralFacts', 'truthfulEvidence', 'currentDetails', 'recommendationSupport'],
    'high': ['centralFacts', 'truthfulEvidence', 'currentDetails', 'recommendationSupport',
             'primarySources', 'consequentialClaims', 'limitationsAndJurisdiction', 'professionalReview'],
}
CATEGORIES = {'ordinary', 'product', 'pricing', 'capability', 'medical', 'legal', 'investment', 'financial', 'security-critical', 'safety-critical'}
CONSEQUENTIAL = {'medical', 'legal', 'investment', 'financial', 'security-critical', 'safety-critical'}
FLAGS = re.compile(r'\b(?:medical|clinical|diagnos\w*|treat(?:s|ment|ments|ing)?|dosage|doses?|'
                   r'prescri\w*|contraindicat\w*|cancer|diabet\w*|asthma|disease\w*|'
                   r'insulin|antidepressants?|hipaa|gdpr|fiduciary|jurisdiction\w*|'
                   r'legal (?:advice|requirements?)|tax obligations?|investment advice|'
                   r'guaranteed returns?|private keys?|seed phrases?|carbon monoxide|'
                   r'fire hazards?|electric shocks?|choking|infants?|newborns?)\b', re.I)
MANDATORY_HIGH = re.compile(r'\b(?:dosage|contraindicat\w*|prescription|clinical efficacy|'
                            r'hipaa[- ]compliant|gdpr[- ]compliant|guaranteed returns?|'
                            r'carbon monoxide|electric shocks?|choking)\b|'
                            r'\b(?:cures?|treats?|prevents?|relieves?|reduces?)\b.{0,60}\b(?:asthma|cancer|diabet\w*|disease\w*|symptoms?)\b', re.I)


def require(ok, message):
    if not ok: raise ValueError(message)


def read(path): return json.loads(Path(path).read_text())
def sha(raw): return hashlib.sha256(raw).hexdigest()
def canonical(value): return json.dumps(value,sort_keys=True,separators=(',', ':'),ensure_ascii=False).encode()
def digest(value): return sha(canonical(value))
def now(): return dt.datetime.now(dt.timezone.utc).isoformat()


def inside(root, name):
    require(isinstance(name,str) and name, 'Missing internal artifact path')
    p = (root/name).resolve()
    require(root.resolve() in p.parents and 'public' not in p.relative_to(root.resolve()).parts,
            'Review policy evidence must stay inside the repository, outside public/')
    return p


def reference(root, path):
    return {'path':str(path.resolve().relative_to(root.resolve())), 'sha256':sha(path.read_bytes())}


def artifact(root, ref):
    require(isinstance(ref,dict), 'Missing source-bound review artifact')
    p = inside(root,ref.get('path'))
    require(p.is_file() and sha(p.read_bytes()) == ref.get('sha256'), 'Review artifact changed or missing: '+str(ref.get('path')))
    return p


def save_exact(path, value):
    raw = canonical(value)+b'\n';path.parent.mkdir(parents=True,exist_ok=True)
    try:
        with path.open('xb') as stream: stream.write(raw)
    except FileExistsError:
        require(path.read_bytes() == raw, 'Keep immutable review evidence; choose a new output version')


def freeze(root, path, folder):
    raw=path.read_bytes();target=folder/'blobs'/sha(raw)/path.name
    target.parent.mkdir(parents=True,exist_ok=True)
    try:
        with target.open('xb') as stream:stream.write(raw)
    except FileExistsError:require(target.read_bytes()==raw,'Immutable review history changed')
    return reference(root,target)


def policy(root):
    p = read(root/CONFIG)
    require(p.get('version') == VERSION and isinstance(p.get('siteId'),str) and p['siteId'], 'Invalid review-policy identity')
    require(p.get('defaultProfile') in LEVELS and p.get('minimumProfile') in LEVELS, 'Invalid site risk profile')
    require(LEVELS.index(p['defaultProfile']) >= LEVELS.index(p['minimumProfile']), 'Default below site floor')
    require(p.get('roundLimits') == LIMITS, 'The shared round budget must be exactly 1/2/3')
    return p


def policy_hash(root):
    p = policy(root)
    raw = (root/CONFIG).read_bytes()+(root/CONTRACT).read_bytes()+Path(__file__).read_bytes()
    if p.get('legacyInventory'): raw += artifact(root,p['legacyInventory']).read_bytes()
    return sha(raw)


def legacy_inventory(root):
    p = policy(root)
    return read(artifact(root,p['legacyInventory'])) if p.get('legacyInventory') else {'pairs':[], 'histories':[]}


def is_legacy(root, snapshot, review):
    return any(x.get('snapshotSha256') == snapshot.get('snapshotSha256') and
               x.get('reviewObjectSha256') == digest(review)
               for x in legacy_inventory(root).get('pairs',[]))


def claim_text(semantic):
    """Reader claims and descriptive schema, not risk words appearing only in URLs."""
    result = []
    def collect(value, key=''):
        if key in {'url','@id','image','logo','sameAs','mainEntityOfPage','href','src','srcset'}: return
        if isinstance(value,str): result.append(value)
        elif isinstance(value,list):
            for child in value: collect(child)
        elif isinstance(value,dict):
            for name,child in value.items(): collect(child,name)
    for key in ['text','title','meta','schemas']:
        collect(semantic.get(key),key)
    return '\n'.join(result)


def flags(text):
    result = []
    for match in FLAGS.finditer(text):
        quote = text[max(0,match.start()-80):min(len(text),match.end()+80)]
        value = {'term':match.group(),'quote':quote}
        if value not in result: result.append(value)
    return result


def profile(root, semantic, categories, requested=None, assessment=None):
    p = policy(root); require(isinstance(categories,list) and set(categories) <= CATEGORIES, 'Unknown claim category')
    text = claim_text(semantic)
    selected = requested or p['defaultProfile']
    require(selected in LEVELS, 'Unknown factual review profile')
    floor = p['minimumProfile']
    local = root/'.claude/workflow-policy.local.json'
    if local.is_file():
        old = read(local)
        if old.get('minimumReviewProfile') in LEVELS:
            floor = max([floor,old['minimumReviewProfile']],key=LEVELS.index)
    require(LEVELS.index(selected) >= LEVELS.index(floor), 'Review profile below this site minimum')
    high = bool(set(categories)&CONSEQUENTIAL or MANDATORY_HIGH.search(text))
    mentions = flags(text)
    if assessment is None:
        high = high or bool(mentions)  # Unresolved risk remains conservative.
    else:
        require(assessment.get('textSha256') == sha(text.encode()), 'Risk assessment belongs to different page claims')
        require(len(assessment.get('rationale','').strip()) >= 40, 'Explain actual claim risk, not just the site name')
        claims = assessment.get('consequentialClaims',[])
        incidental = assessment.get('incidentalMentions',[])
        require(isinstance(claims,list) and isinstance(incidental,list), 'Missing explicit claim-risk scope')
        for item in claims+incidental:
            require(isinstance(item,dict) and isinstance(item.get('quote'),str) and item['quote'] in text and
                    len(item['quote'].strip()) >= 8 and len(item.get('reason','').strip()) >= 40,
                    'Risk ruling needs a real exact passage and a specific explanation')
        require(all(x.get('category') in CONSEQUENTIAL for x in claims), 'Consequential claims need a known high-risk category')
        high = high or bool(claims)
        if not high and selected != 'high':
            for mention in mentions:
                require(any(mention['term'].casefold() in x['quote'].casefold() and
                            mention['quote'] in x['quote'] for x in claims+incidental),
                        'Unresolved risk passage; use HIGH or supply its exact context and reason')
    return 'high' if high else selected


def gitdir(root):
    return Path(subprocess.check_output(['git','rev-parse','--absolute-git-dir'],cwd=root,text=True).strip())


class Journal:
    def __init__(self, root, base, route):
        self.root = root.resolve();origin=urlsplit(base)
        require(origin.scheme=='https' and origin.hostname and not origin.username and not origin.password and
                origin.path in ['','/'] and not origin.query and not origin.fragment and origin.port in [None,443],
                'Use the actual canonical HTTPS site origin')
        self.base='https://'+origin.hostname.lower().removeprefix('www.').rstrip('.')
        self.route=route.rstrip('/') or '/'
        require(route.startswith('/') and not route.startswith('//') and
                '?' not in route and '#' not in route and '..' not in route, 'Use the canonical page identity')
        self.identity = {'siteId':policy(root)['siteId'],'canonicalBase':self.base,'route':self.route}
        self.key = digest(self.identity)
        self.path = root/'reports/content-review-journals'/(self.key+'.jsonl')
        private = gitdir(root)/'content-review-policy';private.mkdir(exist_ok=True,mode=0o700)
        self.anchor = private/(self.key+'.head')
        self.lock_path = private/(self.key+'.lock')

    def __enter__(self):
        self.lock = self.lock_path.open('a');fcntl.flock(self.lock,fcntl.LOCK_EX)
        try:return self._load()
        except BaseException:
            fcntl.flock(self.lock,fcntl.LOCK_UN);self.lock.close();raise

    def _load(self):
        self.events = [];self.cycles = []
        raw = self.path.read_bytes() if self.path.exists() else b''
        # A committed journal can only grow; changing job IDs cannot erase it.
        rel = str(self.path.relative_to(self.root))
        original = subprocess.run(['git','show','HEAD:'+rel],cwd=self.root,capture_output=True)
        require(original.returncode != 0 or raw.startswith(original.stdout), 'Restore committed review history; counters cannot reset')
        previous = None
        for line in raw.splitlines():
            event = json.loads(line);unsigned = {k:v for k,v in event.items() if k!='eventSha256'}
            require(event.get('previous') == previous and digest(unsigned) == event.get('eventSha256') and
                    event.get('identity') == self.identity, 'Review journal history changed')
            previous = event['eventSha256'];self.events.append(event)
        if self.anchor.exists():
            anchored = self.anchor.read_text().strip()
            require(anchored in {e['eventSha256'] for e in self.events}, 'Restore unfinished review history; do not restart its budget')
        if previous: self.anchor.write_text(previous+'\n');self.anchor.chmod(0o600)
        self.cycle = None
        for event in self.events:
            data = event['data'];kind = event['kind']
            require(kind in ['begin','reserve','record','published'],'Unknown journal event')
            if kind == 'begin':
                require(self.cycle is None or self.cycle['status']=='published', 'An unfinished page cannot start a new budget')
                self.cycle = {**data,'rounds':[],'status':'open'};self.cycles.append(self.cycle)
            elif kind == 'reserve':
                require(self.cycle is not None and data['number'] == len(self.cycle['rounds'])+1, 'Invalid round sequence')
                self.cycle['rounds'].append(dict(data,status='pending'))
            elif kind == 'record':
                if data.get('report'):
                    require(digest(read(artifact(self.root,data['report'])))==data['reportObjectSha256'],'Retain the actual prior independent report')
                item = self.cycle['rounds'][data['number']-1]
                require(item['status']=='pending' and item['admission']==data['admission'], 'Review result must finish its real reserved round')
                item.update(data,status='complete');self.cycle['profile']=data['profile']
                self.cycle['status']='passed' if data['verdict']=='PASS' else 'needs-fix'
            elif kind == 'published':
                require(self.cycle and self.cycle['status']=='passed' and data['cycleId']==self.cycle['cycleId'],'Only a passing reviewed cycle can close')
                self.cycle['status']='published'
        return self

    def append(self, kind, data):
        event = {'identity':self.identity,'kind':kind,'data':data,'recordedAt':now(),
                 'previous':self.events[-1]['eventSha256'] if self.events else None}
        event['eventSha256']=digest(event);self.path.parent.mkdir(parents=True,exist_ok=True)
        with self.path.open('ab') as stream:
            stream.write(canonical(event)+b'\n');stream.flush();os.fsync(stream.fileno())
        self.anchor.write_text(event['eventSha256']+'\n');self.anchor.chmod(0o600);self.events.append(event)
        return event

    def __exit__(self, *args):
        fcntl.flock(self.lock,fcntl.LOCK_UN);self.lock.close()


def route_in(snapshot, route):
    found = next((r for r in snapshot['routes'] if r['path']==route),None)
    require(found is not None, 'Snapshot does not contain this page')
    spec = next(r for r in snapshot['manifest']['routes'] if r['path']==route)
    return found,spec


def renderer_module():
    spec=importlib.util.spec_from_file_location('budget_render_validation',Path(__file__).with_name('rendered-audit.py'))
    renderer=importlib.util.module_from_spec(spec);spec.loader.exec_module(renderer)
    return renderer


def valid_snapshot(snapshot):renderer_module().valid_snapshot(snapshot)


def reserve(root, snapshot_path, route, job, reviewer, out, prior_reports=()):
    snapshot = read(snapshot_path);row,spec = route_in(snapshot,route)
    valid_snapshot(snapshot)
    require(snapshot.get('contentReviewPolicy')=={'version':VERSION,'sha256':policy_hash(root)},
            'Capture the current Mindmap candidate under the active review policy before reserving its audit')
    require(reviewer and reviewer != snapshot['manifest']['author'] and job, 'Use actual independent identities and canonical job')
    selected = profile(root,row['semantic'],spec.get('claimCategories',[]),spec.get('reviewProfile'),spec.get('riskAssessment'))
    with Journal(root,snapshot['manifest']['canonicalBase'],route) as journal:
        cycle = journal.cycle
        if cycle is None or cycle['status']=='published':
            require(cycle is None or cycle['jobId'] != job, 'A published job cannot be regenerated/reset')
            known = [h for h in legacy_inventory(root).get('histories',[]) if h.get('jobId')==job and h.get('route')==route]
            require(len(prior_reports) >= max([h.get('rounds',0) for h in known]+[0]), 'Import the actual prior content reviews; migration cannot reset counters')
            imported=[]
            for prior in prior_reports:
                report = read(prior);rows = report.get('routes',[])
                old = rows.get(route) if isinstance(rows,dict) else next((r for r in rows if r.get('path')==route),None)
                require(old is not None and report.get('reviewer') and report['reviewer']!=snapshot['manifest']['author'], 'Prior history must contain a real independent review of this page')
                require(digest(report) not in {x[2] for x in imported}, 'Do not count duplicate copies of one review')
                imported.append((prior,old,digest(report),report['reviewer']))
            cycle = {'cycleId':uuid.uuid4().hex,'jobId':job,'profile':selected,'rounds':[],'status':'open'}
            journal.append('begin',{k:v for k,v in cycle.items() if k not in ['rounds','status']})
            for prior,old,report_hash,old_reviewer in imported:
                number = len(cycle['rounds'])+1
                prior_ref=freeze(root,prior,journal.path.parent)
                admission = {'legacyImport':prior_ref,'number':number}
                journal.append('reserve',{'number':number,'admission':admission,'fingerprint':old.get('fingerprint'),'reviewer':old_reviewer})
                journal.append('record',{'number':number,'admission':admission,'report':prior_ref,'reportObjectSha256':report_hash,'profile':selected,'verdict':old.get('verdict','FAIL'),'legacyImport':prior_ref})
                cycle['rounds'].append({'status':'complete','number':number})
        else:
            require(cycle['jobId']==job, 'Resume the existing canonical page job; renaming it does not reset the review budget')
            require(not prior_reports, 'Prior review history is already imported')
        if cycle['rounds'] and cycle['rounds'][-1]['status']=='pending':
            last = cycle['rounds'][-1];value=read(artifact(root,last['admission']))
            require(value['fingerprint']==row['fingerprint'] and value['reviewer']==reviewer,
                    'Finish or resume the pending review before starting another one')
            return {**value,'admissionArtifact':last['admission']}
        ceiling = LIMITS[cycle['profile']]
        number = len(cycle['rounds'])+1
        require(number <= ceiling, 'Review budget exhausted for this page; hold unresolved material errors, preserve findings, continue eligible siblings')
        require(not any(x.get('reportObjectSha256') for x in cycle['rounds'] if x.get('verdict')=='PASS' and x.get('fingerprint')==row['fingerprint']),
                'This exact page already passed; do not audit it again')
        admission = {'version':VERSION,'identity':journal.identity,'cycleId':cycle['cycleId'],'jobId':job,
                     'number':number,'provisionalProfile':cycle['profile'],'maximumRounds':ceiling,
                     'snapshot':reference(root,snapshot_path),'fingerprint':row['fingerprint'],
                     'author':snapshot['manifest']['author'],'reviewer':reviewer,'policySha256':policy_hash(root)}
        save_exact(out,admission)
        journal.append('reserve',{'number':number,'admission':reference(root,out),'fingerprint':row['fingerprint'],'reviewer':reviewer})
        return {**admission,'admissionArtifact':reference(root,out)}


def decision(root, snapshot, review, rr):
    route = rr['path'];page,spec = route_in(snapshot,route)
    require(rr.get('fingerprint')==page['fingerprint'], 'Review belongs to a different rendered page')
    require(review.get('reviewer') and review['reviewer']!=snapshot['manifest']['author'], 'Independent content reviewer required')
    selected = profile(root,page['semantic'],spec.get('claimCategories',[]),spec.get('reviewProfile'),rr.get('riskAssessment'))
    require(rr.get('riskAssessment') is not None and rr.get('reviewProfile')==selected, 'Independent reviewer must explain actual risk and select the corresponding depth')
    return selected


def pass_evidence(root, snapshot, rr, selected, local_module=None):
    checks={'wholePageCoherence','sourceSupport','testingAndAttribution','datesAndSchema','linksAndIndexability','renderedLayout','scopeAndExclusions'}
    supplied=rr.get('checks',{})
    require(set(supplied)==checks,'Missing independent rendered/SEO checks')
    for name,value in supplied.items():
        allowed=['PASS','NA'] if name in ['testingAndAttribution','scopeAndExclusions'] else ['PASS']
        require(value.get('status') in allowed and len(value.get('evidence','').strip())>=20,'Missing independent rendered evidence: '+name)
    required=FACTS[selected]+['riskClassification','seoQuality']
    if local_module is not None or (root/'.claude/workflow-policy.local.json').is_file():required+=['instructionUnderstanding']
    facts=rr.get('factualReview',{});require(set(facts)==set(required),'Missing profile-specific factual/SEO checks')
    _,spec=route_in(snapshot,rr['path'])
    for name in required:
        value=facts[name];allowed=['PASS','NA'] if name=='professionalReview' and not spec.get('professionalReviewRequired') else ['PASS']
        require(value.get('status') in allowed and len(value.get('evidence','').strip())>=40,'Missing real factual-review evidence: '+name)
        if name=='professionalReview' and spec.get('professionalReviewRequired'):artifact(root,value.get('artifact'))


def projection_source(root, snapshot, review):
    proof=review.get('approvalProjection')
    if not proof:return snapshot,review
    original_snapshot=read(artifact(root,proof.get('snapshot')))
    original_review=read(artifact(root,proof.get('review')))
    require(not original_review.get('approvalProjection'),'Do not stack approval projections')
    require(original_review.get('snapshotSha256')==original_snapshot.get('snapshotSha256'),'Projection source review changed')
    selected={r['path'] for r in snapshot['routes']}
    require(selected and selected=={r['path'] for r in review['routes']},'Projection route coverage mismatch')
    expected=copy_subset(original_snapshot,original_review,selected)
    require(snapshot==expected[0] and {k:v for k,v in review.items() if k!='approvalProjection'}==expected[1],
            'Projection may only retain exact already-passing pages and their actual evidence')
    return original_snapshot,original_review


def copy_subset(snapshot, review, selected):
    snapshot=json.loads(json.dumps(snapshot));review=json.loads(json.dumps(review))
    require(selected <= {r['path'] for r in snapshot['routes']},'Cannot add a page through projection')
    source_rows={r['path']:r for r in review['routes']}
    require(all(source_rows.get(r,{}).get('verdict')=='PASS' for r in selected),'Cannot project a failing page as approved')
    snapshot['manifest']['routes']=[r for r in snapshot['manifest']['routes'] if r['path'] in selected]
    snapshot['routes']=[r for r in snapshot['routes'] if r['path'] in selected]
    snapshot['snapshotSha256']=renderer_module().digest({k:v for k,v in snapshot.items() if k!='snapshotSha256'})
    review['snapshotSha256']=snapshot['snapshotSha256'];review['routes']=[r for r in review['routes'] if r['path'] in selected]
    return snapshot,review


def project(root, snapshot_path, review_path, routes, out_snapshot, out_review):
    original_snapshot=read(snapshot_path);original_review=read(review_path);valid_snapshot(original_snapshot)
    snapshot,review=copy_subset(original_snapshot,original_review,set(routes))
    review['approvalProjection']={'snapshot':reference(root,snapshot_path),'review':reference(root,review_path)}
    check_rendered(root,snapshot,review,force=True)
    save_exact(out_snapshot,snapshot);save_exact(out_review,review)
    return {'snapshot':reference(root,out_snapshot),'review':reference(root,out_review),
            'scope':'Mechanical projection of exact existing independent approvals; no new audit or PASS.'}


def record(root, report_path):
    report = read(report_path);require(isinstance(report.get('routes'),list) and report['routes'], 'Record the actual per-route independent content review')
    result = []
    for rr in report['routes']:
        admission_ref = rr.get('reviewBudget');admission = read(artifact(root,admission_ref))
        snapshot = read(artifact(root,admission['snapshot']))
        require(report.get('snapshotSha256')==snapshot['snapshotSha256'] and report.get('reviewer')==admission['reviewer'], 'Result must belong to the reserved independent review')
        require((rr['path'].rstrip('/') or '/')==admission['identity']['route'] and admission['policySha256']==policy_hash(root), 'Review identity/policy changed')
        selected = decision(root,snapshot,report,rr)
        require(rr.get('verdict') in ['PASS','FAIL'], 'Keep the actual audit verdict; no synthetic approval')
        if rr['verdict']=='PASS':pass_evidence(root,snapshot,rr,selected)
        with Journal(root,admission['identity']['canonicalBase'],rr['path']) as journal:
            cycle=journal.cycle;require(cycle and cycle['cycleId']==admission['cycleId'], 'Wrong canonical review cycle')
            number=admission['number'];item=cycle['rounds'][number-1]
            if item['status']=='complete':
                require(item.get('reportObjectSha256')==digest(report), 'Review result is immutable')
                result.append({'route':rr['path'],'round':number,'verdict':rr['verdict']});continue
            require(item['admission']==admission_ref and number==len(cycle['rounds']), 'Actual reserved round required')
            # The first independent judgment may correct a provisional keyword
            # escalation. Later rounds can raise risk but cannot buy a reset.
            if any(x.get('status')=='complete' and not x.get('legacyImport') for x in cycle['rounds']):
                selected=max([selected,cycle['profile']],key=LEVELS.index)
            require(rr['reviewProfile']==selected, 'A later correction cannot lower the established risk to reset its budget')
            require(number <= LIMITS[selected], 'This page has already used its content-review budget')
            journal.append('record',{'number':number,'admission':admission_ref,'report':freeze(root,report_path,journal.path.parent),
                                    'reportObjectSha256':digest(report),'profile':selected,'verdict':rr['verdict'],
                                    'fingerprint':rr['fingerprint']})
            result.append({'route':rr['path'],'round':number,'maximumRounds':LIMITS[selected],'verdict':rr['verdict']})
    return result


def check_rendered(root, snapshot, review, local_module=None, force=False):
    """Return True for current-policy records; old records still run old checks."""
    if not (root/CONFIG).is_file() or is_legacy(root,snapshot,review): return False
    if not force and not snapshot.get('contentReviewPolicy'): return False
    stamp=snapshot.get('contentReviewPolicy',{})
    require(stamp=={'version':VERSION,'sha256':policy_hash(root)}, 'Capture the current candidate under the active review policy')
    _,authority=projection_source(root,snapshot,review)
    for rr in review['routes']:
        selected=decision(root,snapshot,review,rr)
        pass_evidence(root,snapshot,rr,selected,local_module)
        admission_ref=rr.get('reviewBudget');admission=read(artifact(root,admission_ref))
        require(admission.get('policySha256')==policy_hash(root) and admission.get('reviewer')==review['reviewer'] and
                admission.get('author')==snapshot['manifest']['author'] and admission.get('fingerprint')==rr['fingerprint'],
                'Wrong current review admission')
        with Journal(root,snapshot['manifest']['canonicalBase'],rr['path']) as journal:
            cycle=next((c for c in journal.cycles if c['cycleId']==admission['cycleId']),None)
            require(cycle and (cycle is journal.cycle or cycle['status']=='published'), 'Missing actual canonical review history')
            require(admission['number']==len(cycle['rounds']) <= LIMITS[cycle['profile']], 'Cannot publish an older round or exceed the shared budget')
            item=cycle['rounds'][-1]
            require(item['status']=='complete' and item.get('verdict')=='PASS' and item.get('reportObjectSha256')==digest(authority) and
                    item.get('profile')==selected and item['admission']==admission_ref, 'Record the actual latest independent PASS before publication')
    if local_module is not None:
        # Preserve the site's existing source/application/professional checks.
        # Only the old keyword-only risk resolver is replaced, after the new
        # independent exact-passage risk assessment has already passed above.
        profiles={json.dumps(p['semantic']):next(r['reviewProfile'] for r in review['routes'] if r['path']==p['path']) for p in snapshot['routes']}
        previous=local_module.profile
        def classified(_root,text,categories=(),requested=None):
            require(text in profiles, 'Local review risk scope changed')
            return profiles[text]
        try:
            local_module.profile=classified
            local_module.rendered_review(root,snapshot,review)
        finally: local_module.profile=previous
    return True


def mark_published(root, snapshot, review, commit, host):
    if not (root/CONFIG).is_file() or not snapshot.get('contentReviewPolicy') or is_legacy(root,snapshot,review): return
    require(host.get('commit')==commit and host.get('status')=='live' and host.get('verifiedAt') and host.get('evidenceUrl'), 'Actual verified host evidence required')
    require(review.get('snapshotSha256')==snapshot.get('snapshotSha256'), 'Close only the exact reviewed publication')
    _,authority=projection_source(root,snapshot,review)
    for rr in review['routes']:
        page,_=route_in(snapshot,rr['path']);require(rr.get('fingerprint')==page['fingerprint'],'Published page differs from its real review')
        admission=read(artifact(root,rr['reviewBudget']))
        with Journal(root,snapshot['manifest']['canonicalBase'],rr['path']) as journal:
            require(journal.cycle and journal.cycle['cycleId']==admission['cycleId'] and
                    journal.cycle['status'] in ['passed','published'], 'Publish only the actual approved cycle')
            if journal.cycle['status']=='published': continue
            require(journal.cycle['rounds'][-1].get('reportObjectSha256')==digest(authority), 'Wrong actual published review')
            journal.append('published',{'cycleId':admission['cycleId'],'commit':commit,'reviewObjectSha256':digest(authority),'verifiedAt':host['verifiedAt']})


def sources(root, report_path):
    """Exact internal dependencies to retain with the normal publication receipts."""
    report=read(report_path);found={str(report_path.resolve().relative_to(root))}
    def add(ref):
        path=artifact(root,ref);found.add(str(path.relative_to(root)));return path
    def snapshot_files(ref):
        snapshot=read(add(ref))
        for page in snapshot.get('routes',[]):
            for key,hash_key in [('htmlFile','htmlSha256'),('textFile','textSha256')]:
                if not page.get(key):continue
                captured=Path(page[key]);captured=captured if captured.is_absolute() else root/captured
                relative=str(captured.resolve().relative_to(root))
                add({'path':relative,'sha256':page[hash_key]})
    if report.get('approvalProjection'):
        snapshot_files(report['approvalProjection']['snapshot']);add(report['approvalProjection']['review'])
    for row in report['routes']:
        admission=read(add(row['reviewBudget']));snapshot_files(admission['snapshot'])
        with Journal(root,admission['identity']['canonicalBase'],row['path']) as journal:
            found.add(str(journal.path.relative_to(root)))
            for event in journal.events:
                data=event['data']
                if event['kind']=='reserve':
                    ref=data['admission']
                    if ref.get('legacyImport'):add(ref['legacyImport'])
                    else:
                        old_admission=read(add(ref));snapshot_files(old_admission['snapshot'])
                if event['kind']=='record':add(data['report'])
    return {'paths':sorted(found),'scope':'Internal evidence only; retain the updated journal again after live closure.'}


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--root',default=str(Path(__file__).resolve().parents[2]))
    sub=parser.add_subparsers(dest='command',required=True)
    p=sub.add_parser('classify');p.add_argument('--snapshot',required=True);p.add_argument('--route',required=True);p.add_argument('--assessment')
    p=sub.add_parser('reserve')
    for name in ['snapshot','route','job-id','reviewer','out']:p.add_argument('--'+name,required=True)
    p.add_argument('--prior-review',action='append',default=[])
    p=sub.add_parser('record');p.add_argument('--review',required=True)
    p=sub.add_parser('sources');p.add_argument('--review',required=True)
    p=sub.add_parser('project')
    for name in ['snapshot','review','out-snapshot','out-review']:p.add_argument('--'+name,required=True)
    p.add_argument('--route',required=True,action='append')
    args=parser.parse_args();root=Path(args.root).resolve();policy(root)
    if args.command=='classify':
        snapshot=read(inside(root,args.snapshot));page,spec=route_in(snapshot,args.route);text=claim_text(page['semantic'])
        selected=profile(root,page['semantic'],spec.get('claimCategories',[]),spec.get('reviewProfile'),read(inside(root,args.assessment)) if args.assessment else None)
        print(json.dumps({'profile':selected,'maximumRounds':LIMITS[selected],'textSha256':sha(text.encode()),'riskPassages':flags(text),'requiredFactualChecks':FACTS[selected],'fullSeoRequired':True},indent=2))
    elif args.command=='reserve':
        print(json.dumps(reserve(root,inside(root,args.snapshot),args.route,args.job_id,args.reviewer,inside(root,args.out),[inside(root,p) for p in args.prior_review]),indent=2))
    elif args.command=='record':print(json.dumps(record(root,inside(root,args.review)),indent=2))
    elif args.command=='sources':print(json.dumps(sources(root,inside(root,args.review)),indent=2))
    else:print(json.dumps(project(root,inside(root,args.snapshot),inside(root,args.review),args.route,inside(root,args.out_snapshot),inside(root,args.out_review)),indent=2))


if __name__=='__main__':
    try: main()
    except (ValueError,KeyError,OSError) as error:
        print('BLOCKED: '+str(error),file=sys.stderr);sys.exit(1)
