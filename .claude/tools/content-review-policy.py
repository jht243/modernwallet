#!/usr/bin/env python3
"""Portable risk-based editorial review and an append-only per-page round budget.

Records real independent judgments; never writes an editorial PASS. Mechanical
checks, chart review and pre-review lint do not consume content-review rounds.
Every initial content audit, fix verification and rework audit does consume one.
"""
import argparse
from types import SimpleNamespace
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
import tempfile
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
    if not p.is_file() or sha(p.read_bytes())!=ref.get('sha256'):
        # Resolve the exact earlier bytes, never accept the current changed file.
        cached=durable_reviews(root).cache_path(root,ref['path'],str(ref.get('sha256','')))
        require(cached.is_file() and sha(cached.read_bytes())==ref.get('sha256'),'Review artifact changed or missing: '+str(ref.get('path')))
        return cached
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
    if 'thirdReviewClaimCategories' in p:
        allowed = [] if p['siteId'].rsplit('/', 1)[-1] == 'the_bot_scout' else ['medical', 'legal']
        require(p['thirdReviewClaimCategories'] == allowed, 'Invalid owner third-audit eligibility')
    for item in p.get('compatiblePolicies',[]):
        require(isinstance(item,dict) and re.fullmatch('[0-9a-f]{64}',str(item.get('sha256',''))) and
                re.fullmatch('[0-9a-f]{40}',str(item.get('commit',''))) and len(str(item.get('reason','')).strip())>=40,
                'Invalid compatible review-policy record')
    return p


def accepted_policy_hashes(root):
    """Current policy plus exact earlier hashes whose recorded reviews stay valid.

    Editing the policy tool changes its own hash. Records admitted under a listed
    earlier hash keep their original admission; new reservations always need the
    current hash. The list is committed configuration, never supplied by a review.
    """
    return {policy_hash(root)} | {x['sha256'] for x in policy(root).get('compatiblePolicies',[])}


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


def audit_limit(config, selected, assessment=None):
    """The factual profile controls scrutiny. Only a substantiated medical/legal claim can buy round three."""
    maximum = LIMITS[selected]
    if maximum < 3 or 'thirdReviewClaimCategories' not in config:
        return maximum
    eligible = config['thirdReviewClaimCategories']
    claims = (assessment or {}).get('consequentialClaims', [])
    if any(item.get('category') in eligible and len(item.get('quote', '').strip()) >= 8
           and len(item.get('reason', '').strip()) >= 40 for item in claims):
        return 3
    return 2


def recorded_assessment(route, report):
    rows = report.get('routes', [])
    if isinstance(rows, dict):
        rows = [dict(value, path=path) for path, value in rows.items() if isinstance(value, dict)]
    row = next((item for item in rows if (item.get('path', '').rstrip('/') or '/') == (route.rstrip('/') or '/')), {})
    return row.get('riskAssessment') or {}


def recorded_limit(config, selected, route, report):
    return audit_limit(config, selected, recorded_assessment(route, report))


def last_authoritative_round(cycle):
    """Keep an old unconsumed reservation in the journal without forcing an extra audit."""
    rounds = cycle['rounds']
    if (len(rounds) > 1 and rounds[-1]['status'] == 'pending'
            and rounds[-1]['number'] > cycle.get('maximumRounds', LIMITS[cycle['profile']])):
        return rounds[-2]
    return rounds[-1] if rounds else {}


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
            require(kind in ['begin','reserve','repair-pending','record','published'],'Unknown journal event')
            if kind == 'begin':
                require(self.cycle is None or self.cycle['status']=='published', 'An unfinished page cannot start a new budget')
                self.cycle = {**data,'rounds':[],'status':'open'};self.cycles.append(self.cycle)
            elif kind == 'reserve':
                require(self.cycle is not None and data['number'] == len(self.cycle['rounds'])+1, 'Invalid round sequence')
                self.cycle['rounds'].append(dict(data,status='pending'))
            elif kind == 'repair-pending':
                require(self.cycle is not None and data['number']==len(self.cycle['rounds']),'Repair only the existing final pending slot')
                item=self.cycle['rounds'][-1]
                require(item['status']=='pending' and item['admission']==data['previousAdmission'] and not item.get('repaired'),'Cannot change a completed verdict or repair a slot twice')
                old=read(artifact(self.root,item['admission']));new=read(artifact(self.root,data['admission']))
                require(data.get('invalidatedReferences')==[old['snapshot']] and new['number']==old['number'] and new['cycleId']==old['cycleId'] and new['jobId']==old['jobId'],'Keep the original slot, job and actual lost capture reference')
                artifact(self.root,data['failureEvidence'])
                item.update(admission=data['admission'],fingerprint=new['fingerprint'],reviewer=new['reviewer'],repaired=True)
            elif kind == 'record':
                recorded = read(artifact(self.root,data['report'])) if data.get('report') else {}
                if data.get('report'):
                    require(digest(recorded)==data['reportObjectSha256'],'Retain the actual prior independent report')
                self.cycle['lastRiskAssessment'] = recorded_assessment(self.route, recorded)
                self.cycle['maximumRounds'] = audit_limit(policy(self.root), data['profile'], self.cycle['lastRiskAssessment'])
                item = self.cycle['rounds'][data['number']-1]
                require(item['status']=='pending' and item['admission']==data['admission'], 'Review result must finish its real reserved round')
                item.update(data,status='complete');self.cycle['profile']=data['profile']
                self.cycle['status']='passed' if data['verdict']=='PASS' else 'needs-fix'
            elif kind == 'published':
                require(self.cycle and (self.cycle['status']=='passed' or (data.get('release')=='audit-limit' and exhausted(self.cycle))) and data['cycleId']==self.cycle['cycleId'],'Only a passing reviewed cycle can close')
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


def reserve_without_checkpoint(root, snapshot_path, route, job, reviewer, out, prior_reports=()):
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
                cycle['lastRiskAssessment'] = recorded_assessment(route, read(prior))
                cycle['maximumRounds'] = audit_limit(policy(root), selected, cycle['lastRiskAssessment'])
                cycle['rounds'].append({'status':'complete','number':number})
        else:
            require(cycle['jobId']==job, 'Resume the existing canonical page job; renaming it does not reset the review budget')
            require(not prior_reports, 'Prior review history is already imported')
        ceiling = cycle.get('maximumRounds', audit_limit(policy(root), cycle['profile']))
        pending = bool(cycle['rounds'] and cycle['rounds'][-1]['status']=='pending')
        number = cycle['rounds'][-1]['number'] if pending else len(cycle['rounds'])+1
        if number == 3 and ceiling == 3 and 'thirdReviewClaimCategories' in policy(root):
            current_text = claim_text(row['semantic'])
            retained = [claim for claim in cycle.get('lastRiskAssessment', {}).get('consequentialClaims', [])
                        if claim.get('quote') and claim['quote'] in current_text]
            current = (spec.get('riskAssessment') or {}).get('consequentialClaims', [])
            ceiling = audit_limit(policy(root), selected, {'consequentialClaims': retained + current})
        if cycle['rounds'] and cycle['rounds'][-1]['status']=='pending':
            require(cycle['rounds'][-1]['number'] <= ceiling, 'Review budget exhausted; release the latest completed review')
            last = cycle['rounds'][-1];value=read(artifact(root,last['admission']))
            require(value['fingerprint']==row['fingerprint'] and value['reviewer']==reviewer,
                    'Finish or resume the pending review before starting another one')
            return {**value,'admissionArtifact':last['admission']}
        require(number <= ceiling, 'Review budget exhausted for this page; apply the site release policy to the exact latest reviewed candidate')
        require(not any(x.get('reportObjectSha256') for x in cycle['rounds'] if x.get('verdict')=='PASS' and x.get('fingerprint')==row['fingerprint']),
                'This exact page already passed; do not audit it again')
        admission = {'version':VERSION,'identity':journal.identity,'cycleId':cycle['cycleId'],'jobId':job,
                     'number':number,'provisionalProfile':cycle['profile'],'maximumRounds':ceiling,
                     'snapshot':reference(root,snapshot_path),'fingerprint':row['fingerprint'],
                     'author':snapshot['manifest']['author'],'reviewer':reviewer,'policySha256':policy_hash(root)}
        if number == 3 and ceiling == 3 and 'thirdReviewClaimCategories' in policy(root):
            admission['thirdAuditEligibility'] = [claim for claim in retained + current
                                                 if claim.get('category') in policy(root)['thirdReviewClaimCategories']]
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


def pass_evidence(root, snapshot, rr, selected, local_module=None, retain_fail=False):
    checks={'wholePageCoherence','sourceSupport','testingAndAttribution','datesAndSchema','linksAndIndexability','renderedLayout','scopeAndExclusions'}
    supplied=rr.get('checks',{})
    renderer_module().testing_attribution_check(route_in(snapshot,rr['path'])[0]['semantic'],supplied)
    require(set(supplied)==checks,'Missing independent rendered/SEO checks')
    for name,value in supplied.items():
        allowed=['PASS','NA'] if name in ['testingAndAttribution','scopeAndExclusions'] else ['PASS']
        if retain_fail and name not in {'testingAndAttribution','scopeAndExclusions'}: allowed = allowed + ['FAIL']
        require(value.get('status') in allowed and len(value.get('evidence','').strip())>=20,'Missing independent rendered evidence: '+name)
    required=FACTS[selected]+['riskClassification','seoQuality']
    if local_module is not None or (root/'.claude/workflow-policy.local.json').is_file():required+=['instructionUnderstanding']
    facts=rr.get('factualReview',{});require(set(facts)==set(required),'Missing profile-specific factual/SEO checks')
    _,spec=route_in(snapshot,rr['path'])
    for name in required:
        value=facts[name];allowed=['PASS','NA'] if name=='professionalReview' and not spec.get('professionalReviewRequired') else ['PASS']
        if retain_fail and not (name=='professionalReview' and spec.get('professionalReviewRequired')): allowed = allowed + ['FAIL']
        require(value.get('status') in allowed and len(value.get('evidence','').strip())>=40,'Missing real factual-review evidence: '+name)
        if name=='professionalReview' and spec.get('professionalReviewRequired'):artifact(root,value.get('artifact'))


LAYER3_HOSTS = {'layer3labs.io','www.layer3labs.io'}
LOCAL_POLICY = '.claude/workflow-policy.local.json'


def local_module(root, snapshot):
    """The Layer3-only instruction layer, or None for every other site."""
    path = Path(__file__).with_name('workflow-local.py')
    if not (root/LOCAL_POLICY).is_file() or not path.is_file(): return None
    if urlsplit(snapshot['manifest']['canonicalBase']).hostname not in LAYER3_HOSTS: return None
    spec = importlib.util.spec_from_file_location('review_policy_local_layer',path)
    module = importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module


def capped_release(root, snapshot):
    config = root / CONFIG
    if not config.is_file():
        return False
    policy_data = policy(root)
    hosts=policy_data.get('canonicalHosts')
    if hosts is None and policy_data['siteId']=='jht243/layer3labs':
        hosts=sorted(LAYER3_HOSTS)  # Retain already-admitted pilot authority.
    return (policy_data.get('releaseAtAuditLimit') is True
            and isinstance(hosts,list) and bool(hosts)
            and all(isinstance(host,str) and re.fullmatch(r'[a-z0-9.-]+',host) for host in hosts)
            and snapshot['manifest'].get('workflowKind') == 'mindmap-pass'
            and urlsplit(snapshot['manifest']['canonicalBase']).hostname in hosts)


def exhausted(cycle):
    final = last_authoritative_round(cycle)
    return (final.get('number', 0) >= cycle.get('maximumRounds', LIMITS[cycle['profile']])
            and final.get('status') == 'complete' and final.get('verdict') == 'FAIL')


def stamp_ok(root, snapshot):
    stamp = snapshot.get('contentReviewPolicy',{})
    return isinstance(stamp,dict) and set(stamp)=={'version','sha256'} and stamp['version']==VERSION and stamp['sha256'] in accepted_policy_hashes(root)


def projection_source(root, snapshot, review):
    proof=review.get('approvalProjection')
    if not proof:return snapshot,review
    original_snapshot=read(artifact(root,proof.get('snapshot')))
    original_review=read(artifact(root,proof.get('review')))
    require(not original_review.get('approvalProjection'),'Do not stack approval projections')
    require(original_review.get('snapshotSha256')==original_snapshot.get('snapshotSha256'),'Projection source review changed')
    selected={r['path'] for r in snapshot['routes']}
    require(selected and selected=={r['path'] for r in review['routes']},'Projection route coverage mismatch')
    expected=copy_subset(original_snapshot,original_review,selected,capped_release(root,original_snapshot))
    require(snapshot==expected[0] and {k:v for k,v in review.items() if k!='approvalProjection'}==expected[1],
            'Projection may only retain exact already-passing pages and their actual evidence')
    return original_snapshot,original_review


COMPOSITION_KEYS = {'reviewer','snapshotSha256','routes','approvalProjection'}


def authorities(root, snapshot, review):
    """Map every approved route to the immutable snapshot/review that independently judged it.

    A projection or composition is only a wrapper: risk text, profile and the
    recorded report digest are always verified against the ORIGINAL authority.
    Re-serialising a snapshot sorts its JSON keys, which changes claim_text's
    traversal order and so the hash of the exact passages the reviewer assessed.
    Returns (route -> (snapshot, review, snapshot reference or None), bindings or None).
    """
    proof=review.get('approvalProjection')
    if not proof:return {r['path']:(snapshot,review,None) for r in review['routes']},None
    if 'groups' not in proof:
        source_snapshot,source_review=projection_source(root,snapshot,review)
        return {r['path']:(source_snapshot,source_review,proof['snapshot']) for r in review['routes']},None
    require(set(proof)<={'groups','bindings'} and set(review)<=COMPOSITION_KEYS,'A composition may only join exact recorded approvals')
    groups=proof['groups'];require(isinstance(groups,list) and groups,'Composition needs at least one recorded approval group')
    current={r['path']:r for r in snapshot['routes']};current_specs={r['path']:r for r in snapshot['manifest']['routes']}
    rows={r['path']:r for r in review['routes']}
    require(len(rows)==len(review['routes']) and set(rows)==set(current),'Composition must cover every route exactly once')
    result={}
    for group in groups:
        reference=group.get('snapshot')
        group_snapshot=read(artifact(root,reference));group_review=read(artifact(root,group.get('review')))
        renderer_module().valid_snapshot(group_snapshot)
        require(not group_review.get('approvalProjection'),'Do not stack approval projections')
        require(group_review.get('snapshotSha256')==group_snapshot.get('snapshotSha256'),'Composition source review changed')
        require(stamp_ok(root,group_snapshot),'Composition source was not captured under a recognised review policy')
        require(group_review.get('reviewer')==review.get('reviewer') and group_snapshot['manifest']['author']==snapshot['manifest']['author'] and
                group_snapshot['manifest']['canonicalBase']==snapshot['manifest']['canonicalBase'],
                'Composition may only join one independent reviewer and one author')
        paths=group.get('routes');require(isinstance(paths,list) and paths,'Composition group needs its routes')
        group_pages={r['path']:r for r in group_snapshot['routes']};group_rows={r['path']:r for r in group_review['routes']}
        group_specs={r['path']:r for r in group_snapshot['manifest']['routes']}
        for path in paths:
            require(path in current and path not in result,'Composition route is unknown or duplicated')
            source=group_rows.get(path);page=group_pages.get(path)
            require(source is not None and page is not None and (source.get('verdict')=='PASS' or (capped_release(root,snapshot) and source.get('verdict')=='FAIL')),'Compose only recorded independent PASS or authorized final capped FAIL routes; preserve actual verdicts')
            require(rows[path]==source,'Composition must retain the exact recorded review row')
            require(current[path]['fingerprint']==page['fingerprint'] and current[path]['semantic']==page['semantic'] and
                    current[path].get('textSha256')==page.get('textSha256') and current_specs[path]==group_specs.get(path),
                    'Approved page differs from the page that was independently reviewed')
            result[path]=(group_snapshot,group_review,reference)
    require(set(result)==set(current),'Composition leaves a route without its own recorded approval')
    return result,proof.get('bindings')


def historical_policy_hash(root, commit):
    """Recompute the Layer3 local instruction-policy hash exactly as it was at an earlier commit."""
    require(isinstance(commit,str) and re.fullmatch('[0-9a-f]{40}',commit),'Use the full policy commit')
    require(subprocess.run(['git','merge-base','--is-ancestor',commit,'HEAD'],cwd=root).returncode==0,'Policy commit is not in this history')
    def blob(name):
        done=subprocess.run(['git','show',commit+':'+name],cwd=root,capture_output=True)
        return done.stdout if done.returncode==0 else None
    config=blob(LOCAL_POLICY);require(config is not None,'Policy commit has no local workflow policy')
    local=json.loads(config)
    names=[LOCAL_POLICY,local.get('policy'),local.get('legacyReviews'),'.claude/tools/workflow-local.py','.claude/tools/workflow-preflight.py',
           '.claude/tools/workflow-context.py','.claude/tools/workflow-dispatch.local.py','.claude/commands/_workflow-dispatch.local.md',
           'scripts/paid_placements/approved_draft_release.py','scripts/publisher_failover/client_review.py']
    names=[n for n in names if n and blob(n) is not None]
    with tempfile.TemporaryDirectory() as folder:
        for name in names:
            target=Path(folder)/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(blob(name))
        spec=importlib.util.spec_from_file_location('historical_local_policy',Path(folder)/'.claude/tools/workflow-local.py')
        module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
        return module.policy_hash(Path(folder))


def bundle_manifest(root, reference):
    path=artifact(root,reference);require(path.name=='manifest.json','A bundle binding must name its checked manifest.json')
    return path


def verify_release_bindings(root, snapshot, reviewer, jobs, bindings, local, saved_report=None):
    """Bind the actual writer and reviewer instruction bundles of an already-recorded review.

    Uses the layer's immutable-delivery verification, so it holds after later
    instruction edits, and proves the bundles' policy and sources against the
    commit they name. Missing proof is a failure; nothing here is a verdict.
    """
    require(local is not None and hasattr(local,'historical_delivery'),'Release proof needs the Layer3 instruction layer')
    require(isinstance(bindings,dict) and set(bindings)>={'writer','reviewer','policyCommit','workflowPolicySha256'},'Missing writer/reviewer release bindings')
    policy_value=bindings['workflowPolicySha256'];commit=bindings['policyCommit']
    require(historical_policy_hash(root,commit)==policy_value,'Bound workflow policy is not the policy at its named commit')
    seen=[]
    for role,actor,phase in [('writer',snapshot['manifest']['author'],'write'),('reviewer',reviewer,'audit')]:
        path=bundle_manifest(root,bindings[role])
        role_commit=bindings.get('roleCommits',{}).get(role,commit)
        if role_commit!=commit:
            require(historical_policy_hash(root,role_commit)==policy_value,'Role policy hash differs at its original source revision')
        if saved_report is None:
            manifest,_=local.historical_delivery(root,path.parent)
        else:
            require(bindings[role] in saved_report['instructionApplications'],'Recovered bundle is not cited by the original reviewer')
            manifest,_=local.historical_delivery(root,path.parent,archived_root=read(path)['root'])
        require(manifest['phase']==phase and manifest['role']==local.ROLES[phase] and manifest['actor']==actor,
                'The '+role+' instruction bundle belongs to a different actor or role')
        require(manifest.get('policySha256')==policy_value,'The '+role+' bundle was prepared under a different workflow policy')
        for rel,expected in manifest['files'].items():
            if rel.startswith('reports/'):
                require(sha(inside(root,rel).read_bytes())==expected,'Bundle evidence changed: '+rel)
            else:
                done=subprocess.run(['git','show',role_commit+':'+rel],cwd=root,capture_output=True)
                require(done.returncode==0 and sha(done.stdout)==expected,'Bundle source is not the source at the policy commit: '+rel)
        require(manifest.get('handoff') and read(inside(root,manifest['handoff'])).get('jobId') in jobs and len(jobs)==1,
                'The '+role+' bundle belongs to a different canonical job')
        seen.append(manifest)
    require(seen[0]['runId']==seen[1]['runId'],'Writer and reviewer bundles belong to different invocations')


def saved_applications(root,report):
    path=root/'reports/content-review-journals/recovered-applications'/(digest(report)+'.json')
    if not path.is_file():return None
    value=read(path)
    commit=value['savedCommit']
    require(re.fullmatch('[0-9a-f]{40}',commit),'Invalid saved review commit')
    ref=value['savedReport']
    require(ref['path'].startswith(('reports/mindmap-pass/','reports/search-gap/')) and '..' not in Path(ref['path']).parts,'Unexpected saved review location')
    original=subprocess.check_output(['git','show',commit+':'+ref['path']],cwd=root)
    require(sha(original)==ref['sha256'] and json.loads(original)==report,'Archived independent report changed')
    return value['bindings']


RELEASE_CLARIFICATION = "**Fleet editorial release.** For a Mindmap page covered by the active repository’s editorial release policy, publish the exact independently reviewed version at the first PASS or final allowed audit (LIGHT 1, STANDARD 2, HIGH 3). Retain the verdict and findings and complete the native build, deployment, links and exact live comparison. Apply this rule to the per-page stopping instructions below. Keep professional review, testing honesty and explicit client commitments.\n\n"
WRITER_PROBE_OLD = 'Verifies every model in the chain has a key and answers. A failing preflight STOPS the phase.'
WRITER_PROBE_NEW = 'Use this check only for an actual writing step, after its existing chart and evidence requirements are satisfied. Empty intakes, busy workers, and jobs resuming at audit or publication skip the paid writer probe. Check providers in configured order and stop at the first working model. If none work, preserve the job and report the writer failure. An explicit `preflight --all-models` diagnostic checks standby providers too.'
PENDING_SOURCE_CLARIFICATION = 'For an existing pending audit reservation with a corrupted source dependency, use the existing repair-pending command on the same job and round with its retained failure evidence and a replacement snapshot. The validator compares source hashes and retains the original and replacement identities. The independent reviewer must complete that slot. A recorded verdict cannot use this repair.'


def release_only_instruction_change(rel, old, current):
    if rel == '.claude/commands/_content-review-policy.md':
        return (PENDING_SOURCE_CLARIFICATION not in old
                and current == old + '\n' + PENDING_SOURCE_CLARIFICATION + '\n')
    if rel == '.claude/commands/_remediation-ladder.md':
        return (RELEASE_CLARIFICATION not in old and current.count(RELEASE_CLARIFICATION) == 1
                and current.replace(RELEASE_CLARIFICATION, '', 1) == old)
    if rel == '.claude/commands/_content-generation.md':
        heading = '## Step 0 — preflight ONCE per run'
        return (old.count(heading) == old.count(WRITER_PROBE_OLD) == 1
                and current == old.replace(heading, '## Check the writer once when a reviewed job is ready to write', 1)
                                  .replace(WRITER_PROBE_OLD, WRITER_PROBE_NEW, 1))
    return False


def recorded_release_application(root, path, local):
    """Retain a completed review across the exact release/probe clarifications.

    Called only AFTER check_rendered has verified the original report against
    the actual latest completed canonical journal round. It cannot admit a new
    review, accept another instruction change, or supply a reading attestation.
    """
    manifest, texts = local.historical_delivery(root, path.parent)
    changed = []
    for rel, expected in manifest['files'].items():
        current = inside(root, rel).read_bytes()
        if sha(current) == expected:
            continue
        old = texts[rel]
        require(release_only_instruction_change(rel, old, current.decode()),
                'Recorded instruction changed beyond the exact editorial release clarification: ' + rel)
        changed.append(rel)
    require(changed, 'No matching recorded release clarification')
    return manifest


def verify_current_applications(root, snapshot, reviewer, report, local, recorded=False):
    """Record-time twin of the layer's own release check, for reports carrying current bundles."""
    if recorded and report.get('workflowPolicySha256') != local.policy_hash(root):
        # Only a completed canonical ordinary correction with its separate
        # current mechanical continuity proof may retain its historical policy.
        path = root / '.claude/tools/recorded-mindmap-correction-continuity.py'
        if path.is_file():
            spec = importlib.util.spec_from_file_location('ordinary_recorded_correction_continuity', path)
            module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
            if module.apply(root, snapshot, report, local, SimpleNamespace(**globals()), recorded=True):
                return
    require(report.get('workflowPolicySha256')==local.policy_hash(root),'Layer3 review must bind current local review policy')
    applications=report.get('instructionApplications',[])
    require(isinstance(applications,list) and len(applications)>=2,'Independent review must inspect writer and reviewer instruction applications')
    actors=set()
    for reference in applications:
        path=local.evidence_ref(root,reference);require(path.name=='manifest.json','Instruction application reference must identify its checked bundle manifest')
        try:
            manifest = local.validate(root,path.parent)
        except ValueError:
            if not recorded:
                raise
            manifest = recorded_release_application(root,path,local)
        actors.add(manifest['actor'])
    require({snapshot['manifest']['author'],reviewer}<=actors,'Instruction applications must include the actual author and independent reviewer')


def copy_subset(snapshot, review, selected, allow_fail=False):
    snapshot=json.loads(json.dumps(snapshot));review=json.loads(json.dumps(review))
    require(selected <= {r['path'] for r in snapshot['routes']},'Cannot add a page through projection')
    source_rows={r['path']:r for r in review['routes']}
    require(all(source_rows.get(r,{}).get('verdict') in (('PASS','FAIL') if allow_fail else ('PASS',)) for r in selected),'Cannot project a failing page as approved')
    snapshot['manifest']['routes']=[r for r in snapshot['manifest']['routes'] if r['path'] in selected]
    snapshot['routes']=[r for r in snapshot['routes'] if r['path'] in selected]
    snapshot['snapshotSha256']=renderer_module().digest({k:v for k,v in snapshot.items() if k!='snapshotSha256'})
    review['snapshotSha256']=snapshot['snapshotSha256'];review['routes']=[r for r in review['routes'] if r['path'] in selected]
    return snapshot,review


def project(root, snapshot_path, review_path, routes, out_snapshot, out_review):
    original_snapshot=read(snapshot_path);original_review=read(review_path);valid_snapshot(original_snapshot)
    snapshot,review=copy_subset(original_snapshot,original_review,set(routes),capped_release(root,original_snapshot))
    review['approvalProjection']={'snapshot':reference(root,snapshot_path),'review':reference(root,review_path)}
    check_rendered(root,snapshot,review,force=True)
    save_exact(out_snapshot,snapshot);save_exact(out_review,review)
    return {'snapshot':reference(root,out_snapshot),'review':reference(root,out_review),
            'scope':'Mechanical projection of exact existing independent approvals; no new audit or PASS.'}


def compose(root, snapshot_path, groups, bindings, out_review):
    """Join separately recorded PASS routes for one publication snapshot. Writes no judgment."""
    snapshot=read(snapshot_path);valid_snapshot(snapshot)
    proof={'groups':[{'snapshot':reference(root,Path(g['snapshot'])),'review':reference(root,Path(g['review'])),'routes':list(g['routes'])} for g in groups]}
    rows=[];reviewer=None
    for group in proof['groups']:
        source=read(artifact(root,group['review']));reviewer=reviewer or source.get('reviewer')
        by_path={r['path']:r for r in source['routes']}
        rows.extend(by_path[path] for path in group['routes'] if path in by_path)
    order={r['path']:n for n,r in enumerate(snapshot['routes'])}
    rows=sorted(rows,key=lambda r:order.get(r['path'],len(order)))
    review={'reviewer':reviewer,'snapshotSha256':snapshot['snapshotSha256'],'routes':rows,'approvalProjection':proof}
    if bindings:
        proof['bindings']={'policyCommit':bindings['policyCommit'],'workflowPolicySha256':bindings['workflowPolicySha256'],
                           'writer':reference(root,Path(bindings['writer'])),'reviewer':reference(root,Path(bindings['reviewer']))}
    check_rendered(root,snapshot,review,local_module=local_module(root,snapshot),force=True)
    save_exact(out_review,review)
    return {'review':reference(root,out_review),'scope':'Mechanical composition of exact existing independent approvals; no new audit or PASS.'}


def record_without_checkpoint(root, report_path):
    report = read(report_path);require(isinstance(report.get('routes'),list) and report['routes'], 'Record the actual per-route independent content review')
    require(len({rr.get('path') for rr in report['routes']})==len(report['routes']),'Each page appears once in a recorded review')
    accepted = accepted_policy_hashes(root)
    plan = []
    # Phase 1 validates EVERY page before anything is appended, so a later page
    # that cannot be recorded never leaves a partly recorded, unrecoverable report.
    for rr in report['routes']:
        admission_ref = rr.get('reviewBudget');admission = read(artifact(root,admission_ref))
        snapshot = read(artifact(root,admission['snapshot']))
        require(report.get('snapshotSha256')==snapshot['snapshotSha256'] and report.get('reviewer')==admission['reviewer'], 'Result must belong to the reserved independent review')
        require((rr['path'].rstrip('/') or '/')==admission['identity']['route'] and admission['policySha256'] in accepted, 'Review identity/policy changed')
        selected = decision(root,snapshot,report,rr)
        ceiling = audit_limit(policy(root), selected, rr.get('riskAssessment'))
        require(rr.get('verdict') in ['PASS','FAIL'], 'Keep the actual audit verdict; no synthetic approval')
        final_fail = (rr['verdict']=='FAIL' and capped_release(root,snapshot) and admission['number']>=ceiling)
        if rr['verdict']=='PASS' or final_fail:
            pass_evidence(root,snapshot,rr,selected,retain_fail=final_fail)
            layer=local_module(root,snapshot)
            if layer is not None:
                # A PASS that cannot be released is not recoverable once its round is spent.
                effective_job = admission.get('continuationJobId') or admission['jobId']
                recovered=saved_applications(root,report)
                if recovered is not None:
                    verify_release_bindings(root,snapshot,report['reviewer'],{effective_job},recovered,layer,saved_report=report)
                elif report.get('releaseBindings') is not None:
                    verify_release_bindings(root,snapshot,report['reviewer'],{effective_job},report['releaseBindings'],layer)
                else:
                    verify_current_applications(root,snapshot,report['reviewer'],report,layer)
        with Journal(root,admission['identity']['canonicalBase'],rr['path']) as journal:
            cycle=journal.cycle;require(cycle and cycle['cycleId']==admission['cycleId'], 'Wrong canonical review cycle')
            number=admission['number'];item=cycle['rounds'][number-1]
            if item['status']=='complete':
                require(item.get('reportObjectSha256')==digest(report), 'Review result is immutable')
                plan.append((rr,None,None,number,None));continue
            require(item['admission']==admission_ref and number==len(cycle['rounds']), 'Actual reserved round required')
            # The first independent judgment may correct a provisional keyword
            # escalation. Later rounds can raise risk but cannot buy a reset.
            if any(x.get('status')=='complete' and not x.get('legacyImport') for x in cycle['rounds']):
                selected=max([selected,cycle['profile']],key=LEVELS.index)
            require(rr['reviewProfile']==selected, 'A later correction cannot lower the established risk to reset its budget')
            already_admitted_third = (number == 3 and admission.get('maximumRounds') == 3
                                      and bool(admission.get('thirdAuditEligibility'))
                                      and bool(policy(root).get('thirdReviewClaimCategories')))
            require(number <= ceiling or already_admitted_third, 'This page has already used its content-review budget')
        plan.append((rr,admission,admission_ref,number,selected))
    result = []
    for rr,admission,admission_ref,number,selected in plan:
        if admission is None:
            result.append({'route':rr['path'],'round':number,'verdict':rr['verdict']});continue
        with Journal(root,admission['identity']['canonicalBase'],rr['path']) as journal:
            item=journal.cycle['rounds'][number-1]
            if item['status']=='pending':
                journal.append('record',{'number':number,'admission':admission_ref,'report':freeze(root,report_path,journal.path.parent),
                                         'reportObjectSha256':digest(report),'profile':selected,'maximumRounds':ceiling,'verdict':rr['verdict'],
                                         'fingerprint':rr['fingerprint']})
            result.append({'route':rr['path'],'round':number,'maximumRounds':ceiling,'verdict':rr['verdict']})
    return result



def durable_reviews(root):
    path=Path(__file__).with_name('content-review-durable.py')
    require(path.is_file(),'Restore durable review dependencies before continuing')
    spec=importlib.util.spec_from_file_location('review_durability',path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module

def audit_preflight_check(root,directory,job,reviewer,route):
    if not (root/'.claude/commands/_workflow-efficiency.md').is_file():return
    require(directory,'Before reserving an audit, MAIN must seal the current canonical handoff and the actual independent auditor must complete AUDIT preflight; pass --preflight ITS_COMPLETED_DIRECTORY. Do not begin the content audit or consume a round on a missing handoff.')
    spec=importlib.util.spec_from_file_location('review_audit_preflight',root/'.claude/tools/workflow-preflight.py')
    preflight=importlib.util.module_from_spec(spec);spec.loader.exec_module(preflight)
    m=preflight.validate(root,directory)
    require(m.get('phase')=='audit' and m.get('actor')==reviewer,'Use this actual independent auditor’s completed AUDIT reading, not BUILD or another actor’s receipt')
    require(m.get('runId') and m.get('contextId') and m.get('contextEpoch'),'Retain actual run and uninterrupted auditor context identities')
    # validate() checks the exact handoff or its hash-bound context packet.
    # Local preflight returns its path directly, portable preflight a reference.
    handoff = m.get('handoff')
    name = handoff.get('path') if isinstance(handoff, dict) else handoff
    h = read(inside(root, name))
    require(h.get('jobId')==job and route in h.get('routes',[]),'AUDIT handoff must bind the original canonical job and this actual route')


def reserve(root, snapshot_path, route, job, reviewer, out, prior_reports=(),preflight=None):
    audit_preflight_check(root,preflight,job,reviewer,route)
    durable=durable_reviews(root);snapshot=read(snapshot_path)
    journal=Journal(root,snapshot['manifest']['canonicalBase'],route)
    context=durable.restore(root,journal)
    try:return reserve_without_checkpoint(root,snapshot_path,route,job,reviewer,out,prior_reports)
    finally:durable.checkpoint(root,journal,context)

def changed_pending_dependencies(root, original, replacement):
    """Identify original source references whose exact bytes are missing from an unused slot."""
    prior = original.get('manifest', {}).get('reviewDependencies', [])
    current = replacement.get('manifest', {}).get('reviewDependencies', [])
    for ref in current:
        artifact(root, ref)
    updated = {ref['path']: ref for ref in current}
    missing = []
    for ref in prior:
        name = ref['path']
        expected = ref['sha256']
        source = inside(root, name)
        cached = durable_reviews(root).cache_path(root, name, expected)
        if any(path.is_file() and sha(path.read_bytes()) == expected for path in (source, cached)):
            continue
        require(name in updated and updated[name]['sha256'] != expected,
                'Retain the source path and capture its actual replacement before repairing the pending slot')
        artifact(root, updated[name])
        missing.append({'path': name, 'sha256': expected, 'replacementSha256': updated[name]['sha256']})
    return missing


def repair_pending(root,snapshot_path,route,job,reviewer,out,failure):
    """Rebind one corrupt, unfinished capture admission; no verdict or new round."""
    snapshot=read(snapshot_path);valid_snapshot(snapshot);row,spec=route_in(snapshot,route)
    require(snapshot.get('contentReviewPolicy',{}).get('sha256') in accepted_policy_hashes(root),'Use an actual recognised captured candidate')
    require(reviewer and reviewer!=snapshot['manifest']['author'],'Use an actual independent reviewer')
    durable=durable_reviews(root);journal=Journal(root,snapshot['manifest']['canonicalBase'],route)
    context=durable.restore(root,journal)
    with journal as actual:
        cycle=actual.cycle
        require(cycle and cycle['jobId']==job and cycle['rounds'],'Recover the original canonical job')
        last=cycle['rounds'][-1]
        require(last['status']=='pending' and not last.get('repaired'),'Repair only one unfinished slot; never reset a completed review')
        require(last['number'] <= cycle.get('maximumRounds', audit_limit(policy(root), cycle['profile'])),
                'Review budget exhausted; retain the pending admission and release the last completed round')
        old=read(artifact(root,last['admission']));original=inside(root,old['snapshot']['path'])
        changed_sources = []
        snap_job = snapshot['manifest'].get('jobId')
        cross_job_continuation = bool(isinstance(snap_job, str) and snap_job.strip() and snap_job != old.get('jobId') and snapshot.get('snapshotSha256') != old['snapshot']['sha256'])
        if original.is_file() and sha(original.read_bytes()) == old['snapshot']['sha256']:
            original_capture = read(original)
            require(original_capture['manifest']['canonicalBase'] == snapshot['manifest']['canonicalBase'],
                    'Keep the original canonical site and job')
            if cross_job_continuation:
                for ref in snapshot.get('manifest', {}).get('reviewDependencies', []):
                    artifact(root, ref)
            else:
                require(original_capture['manifest'].get('jobId') == snap_job,
                        'Keep the original canonical site and job')
                changed_sources = changed_pending_dependencies(root, original_capture, snapshot)
                require(changed_sources, 'The original admission is intact; resume it normally')
        require(failure.is_file() and str(failure.relative_to(root)).startswith('reports/'),'Retain the actual independent failure handback')
        require(len(failure.read_bytes())>=100,'Retain the complete actual failure, not an invented summary')
        value={**old,'snapshot':freeze(root,snapshot_path,actual.path.parent),'fingerprint':row['fingerprint'],
               'author':snapshot['manifest']['author'],'reviewer':reviewer,'policySha256':policy_hash(root),
               'repairOf':last['admission'],'failureEvidence':freeze(root,failure,actual.path.parent)}
        if cross_job_continuation:
            value['continuationJobId'] = snap_job
        if changed_sources:
            value['unavailableOriginalSources'] = changed_sources
        save_exact(out,value)
        actual.append('repair-pending',{'number':old['number'],'previousAdmission':last['admission'],
                      'admission':reference(root,out),'failureEvidence':value['failureEvidence'],
                      'invalidatedReferences':[old['snapshot']],'reason':'Original pending capture or a bound source is unavailable; retain the loss and complete this same slot. No verdict, counter reset or additional round.'})
    durable.checkpoint(root,journal,context)
    return {**value,'admissionArtifact':reference(root,out),'scope':'Pending capture repair only; the real independent verdict is still required.'}


def record(root, report_path):
    durable=durable_reviews(root);report=read(report_path);contexts=[];seen=set()
    for row in report.get('routes',[]):
        reference=row.get('reviewBudget')
        if not reference:continue  # The original validator still rejects missing admissions.
        admission=read(artifact(root,reference));identity=admission['identity']
        journal=Journal(root,identity['canonicalBase'],identity['route'])
        if journal.key not in seen:
            contexts.append((journal,durable.restore(root,journal)));seen.add(journal.key)
    try:return record_without_checkpoint(root,report_path)
    finally:
        # Preserve genuine partial results even if a later route is invalid.
        for journal,context in contexts:durable.checkpoint(root,journal,context)

def check_rendered(root, snapshot, review, local_module=None, force=False):
    """Return True for current-policy records; old records still run old checks."""
    if not (root/CONFIG).is_file() or is_legacy(root,snapshot,review): return False
    if not force and not snapshot.get('contentReviewPolicy'): return False
    accepted=accepted_policy_hashes(root)
    require(stamp_ok(root,snapshot), 'Capture the current candidate under the active review policy')
    sources,bindings=authorities(root,snapshot,review)
    for rr in review['routes']:
        auth_snapshot,auth_review,auth_ref=sources[rr['path']]
        selected=decision(root,auth_snapshot,auth_review,rr)
        at_limit = rr.get('verdict') == 'FAIL' and capped_release(root,auth_snapshot)
        pass_evidence(root,auth_snapshot,rr,selected,local_module,retain_fail=at_limit)
        admission_ref=rr.get('reviewBudget');admission=read(artifact(root,admission_ref))
        require(admission.get('policySha256') in accepted and admission.get('reviewer')==auth_review['reviewer'] and
                admission.get('author')==auth_snapshot['manifest']['author'] and admission.get('fingerprint')==rr['fingerprint'] and
                (auth_ref is None or admission.get('snapshot')==auth_ref),
                'Wrong current review admission')
        with Journal(root,snapshot['manifest']['canonicalBase'],rr['path']) as journal:
            cycle=next((c for c in journal.cycles if c['cycleId']==admission['cycleId']),None)
            require(cycle and (cycle is journal.cycle or cycle['status']=='published'), 'Missing actual canonical review history')
            item=last_authoritative_round(cycle)
            require(admission['number']==item.get('number') and admission['number'] <= LIMITS[cycle['profile']],
                    'Cannot publish an older round or exceed the historical shared budget')
            require(item['status']=='complete' and (item.get('verdict')=='PASS' or (at_limit and exhausted(cycle))) and item.get('verdict')==rr['verdict'] and item.get('reportObjectSha256')==digest(auth_review) and
                    item.get('profile')==selected and item['admission']==admission_ref, 'Record the actual latest independent verdict eligible for publication')
    if local_module is not None and bindings is None and sources and all(saved_applications(root,v[1]) for v in sources.values()):
        for path,(original,report,_) in sources.items():
            rr=next(row for row in report['routes'] if row['path']==path)
            adm=read(artifact(root,rr['reviewBudget']))
            job=adm.get('continuationJobId') or adm['jobId']
            verify_release_bindings(root,original,report['reviewer'],{job},saved_applications(root,report),local_module,saved_report=report)
        return True
    if local_module is not None and bindings is not None:
        jobs={
            (adm.get('continuationJobId') or adm['jobId'])
            for rr in review['routes']
            for adm in [read(artifact(root,rr['reviewBudget']))]
        }
        verify_release_bindings(root,snapshot,review['reviewer'],jobs,bindings,local_module)
    elif local_module is not None:
        require(not (review.get('approvalProjection') or {}).get('groups'),'A composition needs verified release bindings')
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
            if any(row.get('verdict')=='FAIL' for row in review['routes']):
                verify_current_applications(root,snapshot,review['reviewer'],review,local_module,recorded=True)
            else:
                local_module.rendered_review(root,snapshot,review)
        finally: local_module.profile=previous
    return True


def mark_published(root, snapshot, review, commit, host):
    if not (root/CONFIG).is_file() or not snapshot.get('contentReviewPolicy') or is_legacy(root,snapshot,review): return
    require(host.get('commit')==commit and host.get('status')=='live' and host.get('verifiedAt') and host.get('evidenceUrl'), 'Actual verified host evidence required')
    require(review.get('snapshotSha256')==snapshot.get('snapshotSha256'), 'Close only the exact reviewed publication')
    sources,_=authorities(root,snapshot,review)
    for rr in review['routes']:
        page,_=route_in(snapshot,rr['path']);require(rr.get('fingerprint')==page['fingerprint'],'Published page differs from its real review')
        authority=sources[rr['path']][1]
        admission=read(artifact(root,rr['reviewBudget']))
        with Journal(root,snapshot['manifest']['canonicalBase'],rr['path']) as journal:
            require(journal.cycle and journal.cycle['cycleId']==admission['cycleId'] and
                    (journal.cycle['status'] in ['passed','published'] or (capped_release(root,snapshot) and exhausted(journal.cycle))), 'Publish only the actual approved cycle')
            if journal.cycle['status']=='published': continue
            require(last_authoritative_round(journal.cycle).get('reportObjectSha256')==digest(authority), 'Wrong actual published review')
            journal.append('published',{'release':'audit-limit' if rr['verdict']=='FAIL' else 'pass','cycleId':admission['cycleId'],'commit':commit,'reviewObjectSha256':digest(authority),'verifiedAt':host['verifiedAt']})


def bundle_files(root, manifest_path, found):
    """Every file of an instruction bundle and the bundles it reuses."""
    manifest=read(manifest_path);folder=manifest_path.parent
    found.update(str(x.relative_to(root)) for x in folder.rglob('*') if x.is_file())
    for key in ['application','contextPacket']:
        value=manifest.get(key)
        if isinstance(value,dict):found.add(str(artifact(root,value).relative_to(root)))
        elif isinstance(value,str) and value:found.add(str(inside(root,value).relative_to(root)))
    if manifest.get('handoff'):found.add(str(inside(root,manifest['handoff']).relative_to(root)))
    if manifest.get('reuse'):bundle_files(root,inside(root,manifest['reuse']['directory'])/'manifest.json',found)


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
    recovered=saved_applications(root,report)
    if recovered:
        found.add('reports/content-review-journals/recovered-applications/'+digest(report)+'.json')
        for role in ('writer','reviewer'):bundle_files(root,add(recovered[role]),found)
    proof=report.get('approvalProjection')
    if proof and 'groups' in proof:
        for group in proof['groups']:
            snapshot_files(group['snapshot']);add(group['review'])
        for role in ['writer','reviewer']:
            if proof.get('bindings'):bundle_files(root,add(proof['bindings'][role]),found)
    elif proof:
        snapshot_files(proof['snapshot']);add(proof['review'])
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
                        old_admission=read(add(ref))
                        invalid=[v for e in journal.events if e['kind']=='repair-pending' for v in e['data']['invalidatedReferences']]
                        if old_admission['snapshot'] not in invalid:snapshot_files(old_admission['snapshot'])
                if event['kind']=='repair-pending':
                    repaired=read(add(data['admission']));snapshot_files(repaired['snapshot']);add(data['failureEvidence'])
                if event['kind']=='record':add(data['report'])
    return {'paths':sorted(found),'scope':'Internal evidence only; retain the updated journal again after live closure.'}


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--root',default=str(Path(__file__).resolve().parents[2]))
    sub=parser.add_subparsers(dest='command',required=True)
    p=sub.add_parser('classify');p.add_argument('--snapshot',required=True);p.add_argument('--route',required=True);p.add_argument('--assessment')
    p=sub.add_parser('reserve')
    for name in ['snapshot','route','job-id','reviewer','out']:p.add_argument('--'+name,required=True)
    p.add_argument('--prior-review',action='append',default=[])
    p.add_argument('--preflight',help='This actual auditor’s completed current AUDIT preflight directory')
    p=sub.add_parser('record');p.add_argument('--review',required=True)
    p=sub.add_parser('sources');p.add_argument('--review',required=True)
    p=sub.add_parser('project')
    for name in ['snapshot','review','out-snapshot','out-review']:p.add_argument('--'+name,required=True)
    p.add_argument('--route',required=True,action='append')
    p=sub.add_parser('compose')
    for name in ['snapshot','spec','out-review']:p.add_argument('--'+name,required=True)
    p=sub.add_parser('repair-pending')
    for name in ['snapshot','route','job-id','reviewer','out','failure']:p.add_argument('--'+name,required=True)
    args=parser.parse_args();root=Path(args.root).resolve();policy(root)
    if args.command=='classify':
        snapshot=read(inside(root,args.snapshot));page,spec=route_in(snapshot,args.route);text=claim_text(page['semantic'])
        assessment=read(inside(root,args.assessment)) if args.assessment else None
        selected=profile(root,page['semantic'],spec.get('claimCategories',[]),spec.get('reviewProfile'),assessment)
        print(json.dumps({'profile':selected,'maximumRounds':audit_limit(policy(root),selected,assessment),'textSha256':sha(text.encode()),'riskPassages':flags(text),'requiredFactualChecks':FACTS[selected],'fullSeoRequired':True},indent=2))
    elif args.command=='reserve':
        print(json.dumps(reserve(root,inside(root,args.snapshot),args.route,args.job_id,args.reviewer,inside(root,args.out),[inside(root,p) for p in args.prior_review],inside(root,args.preflight) if args.preflight else None),indent=2))
    elif args.command=='repair-pending':print(json.dumps(repair_pending(root,inside(root,args.snapshot),args.route,args.job_id,args.reviewer,inside(root,args.out),inside(root,args.failure)),indent=2))
    elif args.command=='record':print(json.dumps(record(root,inside(root,args.review)),indent=2))
    elif args.command=='sources':print(json.dumps(sources(root,inside(root,args.review)),indent=2))
    elif args.command=='compose':
        spec=read(inside(root,args.spec));bound=spec.get('bindings')
        groups=[{'snapshot':inside(root,g['snapshot']),'review':inside(root,g['review']),'routes':g['routes']} for g in spec['groups']]
        if bound:bound={**bound,'writer':inside(root,bound['writer']),'reviewer':inside(root,bound['reviewer'])}
        print(json.dumps(compose(root,inside(root,args.snapshot),groups,bound,inside(root,args.out_review)),indent=2))
    else:print(json.dumps(project(root,inside(root,args.snapshot),inside(root,args.review),args.route,inside(root,args.out_snapshot),inside(root,args.out_review)),indent=2))


if __name__=='__main__':
    try: main()
    except (ValueError,KeyError,OSError) as error:
        print('BLOCKED: '+str(error),file=sys.stderr);sys.exit(1)
