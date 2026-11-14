#!/usr/bin/env python3
"""Durable search-only job controller around the unchanged native completion validator."""
import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
import worker as native

read=native.read
digest=native.digest
require=native.require

class BusyJob(ValueError):
    def __init__(self, job):
        super().__init__('Another search run holds the active job lease; do not duplicate it')
        self.run_id = job.get('runId')
        self.retry_after = job.get('leaseUntil')

    def result(self):
        return {'ok': False, 'status': 'failure', 'reason': 'active-lease',
                'runId': self.run_id, 'leaseUntil': self.retry_after,
                'error': str(self),
                'nextAction': 'Record the busy result once and end this invocation. The current owner continues. Use the next scheduled invocation after lease expiry if unfinished.'}


EVIDENCE_BUCKET = 'search-gap-evidence'
SECRET_PATTERNS = re.compile(
    rb'(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-ant-[A-Za-z0-9_-]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|'
    rb'sbp_[A-Za-z0-9]{20,}|sb_secret_[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|'
    rb'rnd_[A-Za-z0-9]{20,}|re_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{30,}|AQ\.[A-Za-z0-9_-]{20,}|'
    rb'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})'
)


def _http_timeout(default=30):
    try:
        override = int(os.environ.get('SEARCH_GAP_HTTP_TIMEOUT', '') or 0)
        return override if override > 0 else default
    except ValueError:
        return default


class Store(native.Store):
    supports_evidence_storage = True

    def request(self,path,method='GET',body=None):
        headers={'apikey':self.key,'Authorization':'Bearer '+self.key,'Content-Type':'application/json','Prefer':'return=representation'}
        request=urllib.request.Request(self.url+'/rest/v1/'+path,method=method,headers=headers,data=json.dumps(body).encode() if body is not None else None)
        timeout = _http_timeout(30)
        for attempt in range(3):
            try:
                with urllib.request.urlopen(request,timeout=timeout) as response:
                    raw=response.read();return json.loads(raw) if raw else None
            except urllib.error.HTTPError as error:
                if error.code not in (408,429,500,502,503,504) or attempt==2:raise
            except (urllib.error.URLError,TimeoutError):
                if attempt==2:raise
            time.sleep(2**attempt)

    def storage_request(self, object_key, method='GET', raw=None):
        headers = {'apikey': self.key, 'Authorization': 'Bearer ' + self.key}
        if raw is not None:
            headers.update({'Content-Type': 'application/octet-stream', 'x-upsert': 'true'})
        quoted = urllib.parse.quote(object_key, safe='/')
        req = urllib.request.Request(self.url + '/storage/v1/object/' + EVIDENCE_BUCKET + '/' + quoted,
                                     method=method, headers=headers, data=raw)
        timeout = _http_timeout(60)
        for attempt in range(3):
            try:
                with urllib.request.urlopen(req, timeout=timeout) as response:
                    return response.read()
            except urllib.error.HTTPError as error:
                if error.code not in (408, 429, 500, 502, 503, 504) or attempt == 2:
                    raise
            except (urllib.error.URLError, TimeoutError):
                if attempt == 2:
                    raise
            time.sleep(2 ** attempt)

    def upload_evidence(self, site, run, sha256, raw):
        require(re.fullmatch(r'[a-z0-9.-]{1,120}', str(site or '')), 'Invalid evidence site key')
        require(re.fullmatch(r'[A-Za-z0-9_-]{1,80}', str(run or '')), 'Invalid evidence run ID')
        require(re.fullmatch(r'[0-9a-f]{64}', str(sha256 or '')), 'Invalid evidence sha256')
        key = f'{site}/{run}/{sha256}'
        self.storage_request(key, 'POST', raw)
        return key

    def download_evidence(self, storage_key, expected_site=None):
        require(isinstance(storage_key, str)
                and re.fullmatch(r'[a-z0-9.-]{1,120}/[A-Za-z0-9_-]{1,80}/[0-9a-f]{64}', storage_key),
                'Invalid evidence storage key')
        if expected_site:
            require(storage_key.startswith(expected_site + '/'), 'Evidence storage key belongs to another site')
        return self.storage_request(storage_key, 'GET')

    def acknowledged_decisions(self, site, run, packet):
        all_events = [eid for c in packet.get('candidates', []) for eid in c.get('eventIds', []) if isinstance(eid, str) and eid]
        if not all_events:
            return {}
        by_event = {}
        for index in range(0, len(all_events), 100):
            chunk = all_events[index:index + 100]
            params = urllib.parse.urlencode({
                'site': 'eq.' + site,
                'event_id': 'in.(' + ','.join(chunk) + ')',
                'resolved_at': 'not.is.null',
                'select': 'event_id,resolution',
            })
            for row in (self.request('search_gap_queue?' + params) or []):
                res = row.get('resolution') or {}
                if res.get('runId') == run and isinstance(res.get('decision'), dict):
                    by_event[row['event_id']] = res['decision']
        settled = {}
        for candidate in packet.get('candidates', []):
            eids = candidate.get('eventIds') or []
            if eids and all(eid in by_event for eid in eids):
                decision = by_event[eids[0]]
                if decision.get('id') == candidate['id'] and decision.get('status') in ('published', 'no-addition', 'dropped'):
                    settled[candidate['id']] = decision
        return settled

    def release_job(self,site,run,owner):
        # Conditional ownership filter cannot expire a different invocation's lease.
        params=urllib.parse.urlencode({
            'site':'eq.'+site,'run_id':'eq.'+run,'owner':'eq.'+owner,'status':'eq.active'})
        now=native.dt.datetime.now(native.dt.timezone.utc).isoformat()
        return self.request('search_gap_jobs?'+params,'PATCH',{'lease_until':now,'updated_at':now})

    def claim_job(self,site,owner,raw,adopt=False):
        require(owner and len(owner)>=16,'Pass --owner with this invocation fresh workflow run ID')
        return self.request('rpc/search_gap_job_claim','POST',{'p_site':site,'p_owner':owner,'p_packet':raw,'p_adopt':adopt})
    def checkpoint_job(self,site,run,owner,checkpoint):
        return self.request('rpc/search_gap_job_checkpoint','POST',{'p_site':site,'p_run':run,'p_owner':owner,'p_checkpoint':checkpoint})
    def acknowledge_job(self,site,run,owner,decision,receipt):
        return self.request('rpc/search_gap_job_ack','POST',{'p_site':site,'p_run':run,'p_owner':owner,'p_decision':decision,'p_receipt':receipt})
    def close_job(self,site,run,owner):
        return self.request('rpc/search_gap_job_close','POST',{'p_site':site,'p_run':run,'p_owner':owner})
    def owner_request_sha(self,site,run):
        rows=self.request('search_gap_owner_requests?'+urllib.parse.urlencode({'site':'eq.'+site,'run_id':'eq.'+run,'select':'request_sha256'}))
        return rows[0]['request_sha256'] if rows else None
    def owner_policy(self,site):
        rows=self.request('search_gap_owner_policy?'+urllib.parse.urlencode({'site':'eq.'+site,'select':'auto_close'}))
        return bool(rows and rows[0].get('auto_close'))
    def prior_restarted_events(self,site):
        rows,offset=[],0
        while True:
            page=self.request('search_gap_jobs?'+urllib.parse.urlencode({'site':'eq.'+site,'status':'eq.owner-closed','select':'packet_text,parked','order':'run_id.asc','limit':200,'offset':offset})) or []
            rows.extend(page);offset+=len(page)
            if len(page)<200:break
        events=set()
        for row in rows:
            restarted=set((row.get('parked') or {}).get('restart') or [])
            for c in json.loads(row['packet_text']).get('candidates',[]):
                if c['id'] in restarted: events.update(c.get('eventIds',[]))
        return events
    def heartbeat_job(self,site,run,owner):
        return self.request('rpc/search_gap_job_heartbeat','POST',{'p_site':site,'p_run':run,'p_owner':owner})
    def owner_close_job(self,site,run,owner,receipt):
        return self.request('rpc/search_gap_job_owner_close','POST',{'p_site':site,'p_run':run,'p_owner':owner,'p_receipt':receipt})
    def park_job(self,site,run,owner,receipt):
        return self.request('rpc/search_gap_job_park','POST',{'p_site':site,'p_run':run,'p_owner':owner,'p_receipt':receipt})

def intake(site,store,output,owner=None,refresh_attempt=0):
    rows=store.pending(site)
    class Rows:
        def pending(self,unused):return rows
    with tempfile.TemporaryDirectory(prefix='search-gap-proposal-') as folder:
        proposal=native.intake(site,Rows(),str(Path(folder)/'intake.json'))
        raw=Path(proposal['intakeFile']).read_text(encoding='utf-8')
    job=store.claim_job(site,owner,raw)
    try:
        if job['status']=='refresh':
            require(refresh_attempt<2,'Intake changed repeatedly; retain demand and retry')
            return intake(site,store,output,owner,refresh_attempt+1)
        if job['status'] == 'busy':
            raise BusyJob(job)
        checkpoints=[];resumed=False
        if job['status']=='claimed':
            raw=job['packetText'];require(hashlib.sha256(raw.encode()).hexdigest()==job['packetSha256'],'Saved intake bytes changed')
            packet=json.loads(raw);resumed=packet['runId']!=proposal['runId'];checkpoints=job['checkpoints']
        else:
            require(job['status']=='empty','Unexpected job status');packet=json.loads(raw)
        path=Path(output) if output else Path('reports/search-gap/intakes')/(packet['runId']+'.json')
        require(not path.exists() or path.read_bytes()==raw.encode(),'Local intake differs from durable original; preserve it before recovery')
        path.parent.mkdir(parents=True,exist_ok=True);path.write_text(raw,encoding='utf-8')
        checkpoint_file=None
        if checkpoints:
            require(re.fullmatch(r'[A-Za-z0-9_-]{1,80}',packet['runId']),'Invalid recovery job ID')
            result=subprocess.run(['git','rev-parse','--git-path','search-gap-recovery/'+packet['runId']+'/checkpoints.json'],check=True,capture_output=True,text=True)
            checkpoint_file=Path(result.stdout.strip());checkpoint_file.parent.mkdir(parents=True,exist_ok=True,mode=0o700)
            checkpoint_file.write_text(json.dumps(checkpoints),encoding='utf-8');checkpoint_file.chmod(0o600)
        summary={k:checkpoints[-1].get(k) for k in ('stage','canonicalJobs','reviewCounters','gitRef','commit','nextAction','results','evidence')} if checkpoints else None
        retained=Path('reports/search-gap/recovery')/(digest(path)+'.json')
        if resumed and retained.is_file():
            saved=read(retained)
            require(saved.get('intakeSha256')==digest(path) and saved.get('runId')==packet['runId'],'Saved completion belongs to another search job')
            for ref in saved['artifacts']:
                require(digest(artifact_path(ref['path']))==ref['sha256'],'Saved completed decision evidence changed')
            summary=dict(summary or {},completionFile=saved['completionFile'],completionSourceCommit=saved['sourceCommit'])
        if resumed and summary:
            # A retained completion supplies its verified evidence source. Earlier checkpoint
            # commits can be sandbox-only history and are not publication evidence.
            revisions={summary.get('completionSourceCommit') or summary.get('commit')} - {None,''}
            for revision in sorted(revisions):
                if not isinstance(revision,str) or not re.fullmatch('[0-9a-f]{40}',revision):
                    continue  # Older optional metadata remains available for native reconciliation.
                exists=subprocess.run(['git','cat-file','-e',revision+'^{commit}'],capture_output=True)
                if exists.returncode:
                    subprocess.run(['git','fetch','--quiet','--no-tags','--no-write-fetch-head','origin',revision],check=True,capture_output=True)
        action='Continue the existing native search workflow.'
        if resumed and checkpoints:
            restore_artifacts(checkpoints, store)
            action = ('Resume at the recorded stage. The saved files have been restored and their hashes checked. '
                      'Use recoverySummary.results/evidence and the recorded nextAction under the current native rules. '
                      'If the original review is awaiting the render gate, use the saved candidate patch, install the project’s '
                      'locked dependencies, build, capture the preview, and finish the required rendered review and live verification. '
                      'Keep the actual prior verdicts, counters and candidate identity.')
        if resumed and checkpoints and not summary.get('completionFile'):
            from preserved_evidence import restore
            recovered = restore(Path.cwd().resolve(), packet, digest(path))
            if recovered: summary.update(recovered)
        previous = next((cp for cp in reversed(checkpoints) if cp.get('completionFile') and cp.get('stage','').startswith('completion-recovery')),None)
        if resumed and previous:
            name = previous.get('completionFile')
            # Restore only the exact checkpointed, independently reviewed decisions.
            files = {item['path']: item['sha256'] for item in previous['artifacts']}
            if name in files:
                completion = read(artifact_path(name))
                require(digest(name) == files[name] and completion['runId'] == packet['runId']
                        and completion['intakeSha256'] == digest(path), 'Recovered completion identity changed')
                receipt = read(artifact_path(completion['chartReview']))
                require(receipt.get('verdict') == 'PASS' and receipt.get('chartSha256') == digest(completion['chart'])
                        and receipt.get('decisionsSha256') == hashlib.sha256(json.dumps(completion['decisions'],sort_keys=True).encode()).hexdigest(),
                        'Decisions differ from the retained independent judgment')
                summary['completionFile'] = name
        if resumed and checkpoints and not summary.get('completionFile'):
            recovery = missing_decision_chart(packet,path,checkpoints)
            if recovery:
                summary['decisionReconciliation'] = recovery
                action = ('Original chart unavailable. Use the prepared retrospective decision index, original receipt, retained disposition list and source evidence. '
                          'MAIN dispatches the actual independent chart reviewer now for the already-outstanding final decision attestation. '
                          'The reviewer must check every original disposition against the immutable intake and evidence. Only that reviewer may write its actual verdict '
                          'at requiredIndependentReceipt, binding chartSha256, intakeSha256 and decisionsSha256 using the native finish contract. Keep the original chart hash and '
                          'history of its loss. Use the distinct producer identity of the mechanical index and the actual independent reviewer identity. '
                          'If validated, finish the proposedCompletion through ALL existing preview/live, ancestry and action gates. Pending observations remain pending. No new content or repeat writing.')
        dispatch = checkpoints[-1].get('verifiedContinuation') if checkpoints else None
        if dispatch:
            require(dispatch.get('runId')==packet['runId'] and dispatch.get('intakeSha256')==digest(path),'Recovery belongs to another original intake')
            for ref in dispatch.get('evidence',[]):
                require(digest(artifact_path(ref['path']))==ref['sha256'],'The original scoped recovery evidence changed')
            summary['verifiedContinuation']=dispatch
            action = ('Continue the original saved work described in recoverySummary.verifiedContinuation. Read its evidence and '
                      'nextAction. Preserve every earlier verdict, counter and site constraint. Reuse the existing decisions and candidate. '
                      'Only the identified changed route may need targeted independent review. Release the exact candidate already at its '
                      'authorized editorial limit using its original review. Complete outstanding native production and live checks. '
                      'The unchanged old completion is evidence, not a substitute for finishing these still-open scoped actions.')
        partial = next((cp for cp in reversed(checkpoints) if cp.get('stage') in ('partial-finish', 'completion-recovery')), {})
        if resumed and partial.get('stage') == 'partial-finish':
            summary['priorCompletionFile'] = partial['completionFile']
            summary.pop('completionFile', None)
            summary['pendingCandidateIds'] = partial['pendingCandidateIds']
            action = ('Resume only recoverySummary.pendingCandidateIds from the original intake. Reuse the independently reviewed '
                      'decisions in priorCompletionFile and the latest stage, findings and counters for each open item. '
                      'Validate the combined final decisions through the native finish before reporting success.')
        if resumed and not checkpoints and not (summary or {}).get('completionFile'):
            recovered = retained_local_completion(packet, digest(path))
            if recovered:
                name, pending_ids = recovered
                if pending_ids:
                    summary = {'priorCompletionFile': name, 'pendingCandidateIds': pending_ids}
                    action = ('Reuse the signed chart and decisions in priorCompletionFile. Work only the pending IDs, '
                              'locate their original audit records, and complete native release and live checks. '
                              'Validate the combined decisions and fresh live evidence through normal finish.')
                else:
                    summary = {'completionFile': name}
        if summary and summary.get('completionFile') and not dispatch:
            comp_doc = read(artifact_path(summary['completionFile'])) if Path(summary['completionFile']).is_file() else {}
            pending_in_comp = [d['id'] for d in (comp_doc.get('decisions') or []) if isinstance(d, dict) and d.get('status') == 'pending' and d.get('id')]
            if pending_in_comp:
                summary['priorCompletionFile'] = summary.pop('completionFile')
                summary['pendingCandidateIds'] = pending_in_comp
                action = ('Reuse the signed chart and decisions in priorCompletionFile. Work only pendingCandidateIds, '
                          'locate their original audit records, and complete native release and live checks (or close via end-run --deploy).')
            else:
                changed_pub = {p for d in (comp_doc.get('decisions') or []) if isinstance(d, dict) and d.get('status') == 'published' for p in (d.get('paths') or [])}
                changed_pub -= {p for m in (comp_doc.get('metadataOnly') or []) if isinstance(m, dict) for p in (m.get('paths') or [])}
                rgroups = comp_doc.get('rendered') if isinstance(comp_doc.get('rendered'), list) else ([comp_doc['rendered']] if isinstance(comp_doc.get('rendered'), dict) else [])
                covered_pub = {r['path'] for g in rgroups if isinstance(g, dict) and g.get('approved') and Path(g['approved']).is_file()
                               for r in (read(artifact_path(g['approved'])).get('routes') or []) if isinstance(r, dict) and r.get('path')}
                uncovered_pub = sorted(changed_pub - covered_pub)
                if uncovered_pub:
                    summary['uncoveredPublishedRoutes'] = uncovered_pub
                    action = ('Reuse recoverySummary.completionFile, run a scoped supplemental AUDIT for uncoveredPublishedRoutes '
                              + json.dumps(uncovered_pub) + ' and append its {approved, live, review} group to completionFile.rendered, '
                              'then finish (or close via end-run --deploy if blocked). Do not dispatch BUILD, WRITE or chart review.')
                else:
                    action='Reuse the restored, already independently reviewed recoverySummary.completionFile, reconcile its separate preview, then finish. For an expired original loopback preview use a separate current build and postPublicationRecovery with the original approved hash and original publication commit (or run a scoped supplemental AUDIT if post-publication sibling drift changed a route). Run python3 scripts/search_gap/publication_history.py FULL_COMMIT for genuine current remote ancestry, including shallow checkouts. Keep all exact-render and live comparisons. Do not dispatch BUILD, WRITE or another decision review.'
                sid=os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID')
                if sid:
                    name='search-gap-continuation/'+hashlib.sha256(sid.encode()).hexdigest()+'.json'
                    marker=Path(subprocess.check_output(['git','rev-parse','--git-path',name],text=True).strip())
                    marker.parent.mkdir(parents=True,exist_ok=True)
                    marker.write_text(json.dumps({
                        'completionFile': summary['completionFile'],
                        'sha256': digest(summary['completionFile']),
                        'runId': packet['runId'],
                        'chartReview': comp_doc.get('chartReview'),
                        'allowSupplementalAudit': True,
                    }))
        request = Path('reports/search-gap/park-requests') / (packet['runId'] + '.json')
        if resumed and request.is_file():
            # Owner-authored, committed request; park itself still verifies every blocked candidate.
            park_request = read(request)
            require(park_request.get('runId') == packet['runId'], 'Park request belongs to another job')
            summary = dict(summary or {}, parkRequest=str(request))
            action += (' OWNER PARK REQUEST ' + str(request) + ': first try finish exactly as above. If finish fails, in this same '
                       'invocation run python3 scripts/search_gap/job_worker.py park --site ' + site + ' --owner <this runId> --intake <intakeFile> '
                       '--completion <request completion> --holds <request holds> --reason "<request reason>". park verifies every blocked '
                       'candidate and refuses anything fixable; report its real result (parked is neither published nor dropped).')
        close_request = Path('reports/search-gap/owner-requests') / (packet['runId'] + '.json')
        if resumed and close_request.is_file() and authorized_request(store, site, packet['runId'], close_request):
            # Authorized only by the owner's database entry for these exact bytes.
            summary = dict(summary or {}, ownerCloseRequest=str(close_request))
            action = ('OWNER CLOSE-OUT REQUEST ' + str(close_request) + ' (owner decision 2026-11-13) replaces the remaining steps of this old job. '
                      'Do not run more BUILD, WRITE, AUDIT or finish for it. First run the same owner-close command with --check and stop if it fails. '
                      'For every candidate the request marks publish-as-written: publish exactly '
                      'the draft already written and last reviewed (named in recoverySummary / the recorded nextAction) to production with the normal '
                      'deploy helper, and confirm each changed page is live. Then run python3 scripts/search_gap/job_worker.py owner-close --site ' + site +
                      ' --owner <this runId> --intake <intakeFile> --request ' + str(close_request) + ' [--published <json {candidateId: [paths]}> '
                      '--published-commit <full published commit>]. A publish-as-written candidate with no written page is left out of --published and is '
                      'restarted. Candidates marked restart need no work: they return to the queue and the next invocation writes them fresh. '
                      'Report exactly what was published and what was restarted.')
        auto_close = job.get('status') == 'claimed' and auto_close_allowed(store, site)
        if auto_close and not summary_has_close(summary):
            lead = 'this job was left unfinished by an earlier run.' if resumed else 'every claimed Search Gap job must finish or close in this same run.'
            action = ('STANDING OWNER RULE (2026-11-13): ' + lead + ' Finish it in THIS invocation; if finish '
                      'fails or cannot be reached, close it before ending with python3 scripts/search_gap/job_worker.py end-run --site ' + site +
                      ' --owner <this runId> --intake ' + str(path) + ' --deploy --reason "<specific blocker>" '
                      '(or owner-close --auto; see CONTRACT "Automatic same-day close-out"). Never leave it for a later run. ' + action)
        if job.get('status') == 'empty':
            action = 'Verified empty intake. Submit the required collector no-op once, then finish. No Git commit, push, build, review or deployment is needed.'
        # Control and recovery state must precede the potentially long candidate list.
        if job.get('status')=='claimed':
            remember_lease(site,packet['runId'],owner,str(path),auto_close)
            heartbeat(store,site,packet['runId'],owner)
        return dict(nextAction=action,resumed=resumed,recoverySummary=summary,durableJob=True,
                    intakeFile=str(path),intakeSha256=digest(path),checkpointFile=str(checkpoint_file) if checkpoint_file else None,
                    checkpointCount=len(checkpoints),**packet)
    except Exception:
        if job.get('status')=='claimed':
            try:
                retained=json.loads(job['packetText'])
                store.release_job(site,retained['runId'],owner)
            except Exception as release_error:
                print('Intake lease release unconfirmed: '+type(release_error).__name__,file=sys.stderr)
        raise


def artifact_path(value):
    path=Path(value)
    require(not path.is_absolute() and '..' not in path.parts and path.parts and path.parts[0]=='reports','Recovery artifacts must be repository-relative reports files')
    require(path.resolve().is_relative_to(Path.cwd().resolve()/'reports'),'Artifact symlink leaves reports')
    return path

def missing_decision_chart(packet, intake_path, checkpoints):
    """Prepare a clearly retrospective decision index, never an approval receipt."""
    for checkpoint in reversed(checkpoints):
        if checkpoint.get('stage') != 'published-awaiting-finish':
            continue
        for ref in checkpoint.get('artifacts', []):
            path = artifact_path(ref['path'])
            if path.suffix != '.json' or not path.is_file():
                continue
            value = read(path)
            if not isinstance(value, dict) or value.get('runId') != packet['runId'] or not {'decisions','chartReview','chart'} <= value.keys():
                continue
            require(digest(path) == ref['sha256'] and value['intakeSha256'] == digest(intake_path), 'Use the original retained completion and intake')
            if artifact_path(value['chart']).exists():
                return None
            decisions = value['decisions']
            candidate_ids = [item['id'] for item in packet['candidates']]
            require(len(set(candidate_ids)) == len(candidate_ids) and sorted(candidate_ids) == sorted(item['id'] for item in decisions), 'Retain every original candidate exactly once')
            receipt_path = artifact_path(value['chartReview'])
            revision = checkpoint.get('commit','')
            require(re.fullmatch('[0-9a-f]{40}',revision), 'Use the pinned prior evidence commit')
            # Preserve the original receipt even if the worker sandbox omitted it.
            prior_bytes = subprocess.check_output(['git','show',revision+':'+str(receipt_path)])
            prior = json.loads(prior_bytes)
            require(prior.get('verdict') == 'PASS' and prior.get('author') and prior.get('intakeSha256') == value['intakeSha256'] and re.fullmatch('[0-9a-f]{64}',prior.get('chartSha256','')) and prior.get('reviewer') and prior.get('author') != prior['reviewer'], 'Missing independent historical chart identity')
            folder = Path('reports/search-gap/reconciliation') / ref['sha256']
            folder.mkdir(parents=True,exist_ok=True)
            chart, receipt, proposed = folder/'decision-index.md', folder/'independent-decision-review.json', folder/'completion.json'
            index = ('# Retrospective decision index\n\nOriginal chart unavailable. Original SHA-256: '+prior['chartSha256']+'\n'
                     +'Original completion SHA-256: '+ref['sha256']+'\nThis is a mechanical transcription of the retained final dispositions. It supplies no historical or current approval.\n\n'
                     +json.dumps(decisions,ensure_ascii=False,indent=2,sort_keys=True)+'\n').encode()
            proposal = dict(value,chart=str(chart),chartReview=str(receipt))
            for target, raw in [(chart,index),(folder/'original-chart-receipt.json',prior_bytes),(proposed,(json.dumps(proposal,ensure_ascii=False,indent=2)+'\n').encode())]:
                if target.exists():require(target.read_bytes()==raw,'Reconciliation bytes changed; retain their original identity')
                else:
                    with target.open('xb') as handle:handle.write(raw)
            return {'chart':str(chart),'proposedCompletion':str(proposed),'requiredIndependentReceipt':str(receipt),'originalReceipt':str(folder/'original-chart-receipt.json'),'originalChartSha256':prior['chartSha256'],'originalCompletion':str(path),'candidateCount':len(decisions)}
    return None


EVIDENCE_DIRS = (
    'reports/search-gap',
    'reports/mindmap-pass',
    'reports/rendered-audit',
    'reports/content-review-journals',
    'reports/content-review-evidence',
    'reports/workflow-generation-budgets',
)
EVIDENCE_SKIP_SUFFIXES = ('.lock', '.tmp', '.pyc', '.recapture.json', '.recapture.html', '.recapture.txt')


def has_evidence_storage(store):
    return isinstance(store, Store) or getattr(store, 'supports_evidence_storage', None) is True


def contains_secret(raw):
    if SECRET_PATTERNS.search(raw):
        return True
    for key, secret in os.environ.items():
        if any(x in key.upper() for x in ('KEY', 'TOKEN', 'PASSWORD', 'SECRET', 'AUTH', 'B64', 'DATABASE_URL')) and len(secret) >= 16:
            if secret.encode() in raw:
                return True
    return False


def auto_evidence_paths(extra=(), store=None):
    selected = dict.fromkeys(str(p) for p in (extra or ()) if p)
    if not has_evidence_storage(store):
        return list(selected)
    existing_dirs = [d for d in EVIDENCE_DIRS if Path(d).is_dir()]
    if not existing_dirs:
        return list(selected)
    in_git = subprocess.run(['git', 'rev-parse', '--is-inside-work-tree'], capture_output=True, text=True)
    if in_git.returncode != 0 or in_git.stdout.strip() != 'true':
        return list(selected)
    candidates = set()
    untracked = subprocess.run(['git', 'ls-files', '--others', '--modified', '--exclude-standard', '-z', '--', *existing_dirs],
                               capture_output=True)
    if untracked.returncode == 0 and untracked.stdout:
        candidates.update(p for p in os.fsdecode(untracked.stdout).split('\0') if p)
    has_origin_main = subprocess.run(['git', 'rev-parse', '--verify', 'refs/remotes/origin/main^{commit}'],
                                     capture_output=True).returncode == 0
    if has_origin_main:
        committed = subprocess.run(['git', 'diff', '--name-only', '-z', 'refs/remotes/origin/main...HEAD', '--', *existing_dirs],
                                   capture_output=True)
        if committed.returncode == 0 and committed.stdout:
            candidates.update(p for p in os.fsdecode(committed.stdout).split('\0') if p)
    reports_root = (Path.cwd().resolve() / 'reports')
    for rel in sorted(candidates):
        if (rel in selected
                or rel.startswith('reports/search-gap/intakes/')
                or (rel.startswith('reports/search-gap/intake') and rel.endswith('.json'))
                or rel.endswith(EVIDENCE_SKIP_SUFFIXES)):
            continue
        p = Path(rel)
        if p.is_absolute() or '..' in p.parts or not p.parts or p.parts[0] != 'reports' or p.is_symlink() or not p.is_file():
            continue
        if not p.resolve().is_relative_to(reports_root):
            continue
        size = p.stat().st_size
        if size > 20_000_000:
            continue
        try:
            raw = p.read_bytes()
        except OSError:
            continue
        if contains_secret(raw):
            continue
        if p.suffix == '.json' and size <= 2_000_000:
            try:
                doc = json.loads(raw)
                if isinstance(doc, dict) and {'candidates', 'runId', 'site'} <= doc.keys() and 'autoClose' not in doc and isinstance(doc.get('candidates'), list):
                    continue
            except Exception:
                pass
        selected[str(p)] = None
    return list(selected)


def completion_checkpoint_paths(paths, max_size=2_000_000):
    # Finish reopens the reviewed chart by path. Save its exact bytes in the
    # same durable checkpoint even when a caller names only the completion.
    selected = dict.fromkeys(map(str, paths))
    for value in tuple(selected):
        path = artifact_path(value)
        if path.suffix != '.json':
            continue
        if path.stat().st_size > max_size:
            raise ValueError("Artifact too large; use a reviewed private Git artifact reference")
        try:
            document = read(path)
        except (json.JSONDecodeError, UnicodeDecodeError):
            continue  # Opaque artifacts still go through the normal credential and size checks.
        if not isinstance(document, dict) or not {'runId', 'intakeSha256', 'decisions', 'chart', 'chartReview'} <= document.keys():
            continue
        chart = artifact_path(document['chart'])
        review_path = artifact_path(document['chartReview'])
        review = read(review_path)
        require(digest(chart) == review.get('chartSha256'), 'Checkpoint requires the exact independently reviewed chart bytes')
        require(document['intakeSha256'] == review.get('intakeSha256'), 'Completion and chart receipt belong to different intakes')
        selected[str(chart)] = None
        selected[str(review_path)] = None
        for key in ('manifest', 'review'):
            if isinstance(review.get(key), str):
                selected[str(artifact_path(review[key]))] = None
    return selected


def capture_artifacts(paths, store=None, site=None, run=None):
    use_storage = bool(site and run and has_evidence_storage(store))
    max_file = 20_000_000 if use_storage else 2_000_000
    artifacts = []
    inline_b64 = 0
    for value in completion_checkpoint_paths(paths, max_size=max_file):
        path = artifact_path(value)
        raw = path.read_bytes()
        require(len(raw) <= max_file, 'Artifact too large; use a reviewed private Git artifact reference')
        require(not contains_secret(raw), 'Credential value found in checkpoint artifact')
        sha = hashlib.sha256(raw).hexdigest()
        if use_storage and (len(raw) > 16_384 or inline_b64 + ((len(raw) + 2) // 3) * 4 > 250_000):
            storage_key = store.upload_evidence(site, run, sha, raw)
            artifacts.append({'path': str(path), 'sha256': sha, 'storageKey': storage_key, 'size': len(raw)})
        else:
            encoded = base64.b64encode(raw).decode()
            inline_b64 += len(encoded)
            artifacts.append({'path': str(path), 'sha256': sha, 'base64': encoded})
    require(sum(len(x.get('base64', '')) for x in artifacts) <= 3_000_000, 'Checkpoint too large; save bounded batches')
    return artifacts


def _decode_artifact_bytes(artifact, store=None):
    if 'base64' in artifact:
        return base64.b64decode(artifact['base64'], validate=True)
    if 'storageKey' in artifact:
        active_store = store if store is not None and hasattr(store, 'download_evidence') else Store()
        return active_store.download_evidence(artifact['storageKey'])
    raise ValueError('Checkpoint artifact lacks payload bytes or storageKey: ' + str(artifact.get('path')))


def restore_artifacts(checkpoints, store=None):
    latest = {}
    for checkpoint in checkpoints:
        for artifact in checkpoint.get('artifacts', []):
            latest[artifact['path']] = artifact
    staged = []
    for value, artifact in latest.items():
        path = artifact_path(value)
        raw = _decode_artifact_bytes(artifact, store)
        require(hashlib.sha256(raw).hexdigest() == artifact['sha256'], 'Saved artifact bytes changed')
        require(not path.exists() or path.read_bytes() == raw, 'Local evidence differs; reconcile without overwriting: ' + value)
        staged.append((path, raw))
    for path, raw in staged:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(raw)
    return {'ok': True, 'restored': len(staged)}


def restore_missing_artifacts(checkpoints, store=None):
    """Restore missing checkpointed artifacts without failing on newer local stage files."""
    latest = {}
    for checkpoint in checkpoints:
        for artifact in checkpoint.get('artifacts', []):
            latest[artifact['path']] = artifact
    restored = 0
    for value, artifact in latest.items():
        path = artifact_path(value)
        if path.exists():
            continue
        raw = _decode_artifact_bytes(artifact, store)
        require(hashlib.sha256(raw).hexdigest() == artifact['sha256'], 'Saved artifact bytes changed')
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(raw)
        restored += 1
    return restored


def retained_local_completion(packet, intake_hash):
    """Look up a committed decision file only when the durable checkpoint is missing."""
    matches = subprocess.run(['git', 'grep', '-l', '-F', packet['runId'], '--',
                              'reports/mindmap-pass/*/completion.json', 'reports/search-gap/*/completion.json'],
                             capture_output=True, text=True)
    if matches.returncode != 0:
        return None
    found = []
    for filename in matches.stdout.splitlines():
        path = artifact_path(filename)
        candidate = read(path)
        if candidate.get('runId') != packet['runId'] or candidate.get('intakeSha256') != intake_hash:
            continue
        if candidate.get('site', packet['site']) != packet['site']:
            continue
        try:
            chart = artifact_path(candidate['chart'])
            receipt = read(artifact_path(candidate['chartReview']))
            decisions = candidate['decisions']
            signed = hashlib.sha256(json.dumps(decisions, sort_keys=True).encode()).hexdigest()
            if (receipt.get('verdict') != 'PASS' or not receipt.get('author') or not receipt.get('reviewer')
                    or receipt['author'] == receipt['reviewer'] or receipt.get('chartSha256') != digest(chart)
                    or receipt.get('decisionsSha256') != signed or receipt.get('intakeSha256') != intake_hash
                    or sorted(d['id'] for d in decisions) != sorted(c['id'] for c in packet['candidates'])):
                continue
        except (KeyError, FileNotFoundError, ValueError, TypeError):
            continue
        found.append((filename, [d['id'] for d in decisions if d['status'] == 'pending']))
    if len(found) == 1:
        return found[0]
    return None


def finish(intake_path,completion_path,store,owner):
    packet,completion=read(intake_path),read(completion_path)
    require(completion.get('intakeSha256')==digest(intake_path),'Intake changed')
    # Renew/reacquire this exact immutable job before any expensive recapture.
    # A failed earlier finish releases its lease; retries must not render first
    # and discover that ownership was lost only at the acknowledgement step.
    lease=store.claim_job(packet['site'],owner,Path(intake_path).read_text(encoding='utf-8'))
    require(lease.get('status')=='claimed','Search job is not available to this invocation; preserve it without repeating render checks')
    require(lease.get('packetSha256')==digest(intake_path),'Claimed search job differs from the retained intake')
    def save_finish(stage, pending_ids=None):
        history = lease.get('checkpoints') or []
        latest = history[-1] if history else {}
        metadata = {key: latest[key] for key in ('canonicalJobs', 'reviewCounters', 'gitRef', 'commit', 'verifiedContinuation') if key in latest}
        metadata.setdefault('canonicalJobs', {})
        metadata.setdefault('reviewCounters', {})
        saved = Path('reports/search-gap/recovery') / (digest(completion_path) + '-completion.json')
        saved.parent.mkdir(parents=True, exist_ok=True)
        saved.write_bytes(Path(completion_path).read_bytes())
        paths = auto_evidence_paths([str(saved), completion['chart'], completion['chartReview']], store)
        metadata.update(stage=stage, completionFile=str(saved),
                        artifacts=capture_artifacts(paths, store, packet['site'], packet['runId']))
        if pending_ids is not None:
            metadata.update(pendingCandidateIds=pending_ids, nextAction='Resume only these unresolved candidate IDs; retain all finished decisions.')
        store.checkpoint_job(packet['site'], packet['runId'], owner, metadata)

    try:
        decisions=native.validate_completion(packet,completion)
        for decision in decisions:
            if decision['status']!='pending':
                store.acknowledge_job(packet['site'],packet['runId'],owner,decision,{'runId':packet['runId'],'decision':decision,'completionSha256':digest(completion_path),'chartReviewSha256':digest(completion['chartReview'])})
        pending=sum(d['status']=='pending' for d in decisions)
        if pending:
            save_finish('partial-finish', [d['id'] for d in decisions if d['status'] == 'pending'])
            store.release_job(packet['site'], packet['runId'], owner)
        else:
            closed=store.close_job(packet['site'],packet['runId'],owner)
            require(closed['complete'],'Production queue is not fully acknowledged')
            mark_lease_closed('complete')
    except Exception:
        # Retain the exact final decisions before making this unfinished job retryable.
        try:
            save_finish('completion-recovery')
        except Exception as checkpoint_error:
            print('Completion checkpoint unavailable: '+type(checkpoint_error).__name__,file=sys.stderr)
        try:store.release_job(packet['site'],packet['runId'],owner)
        except Exception as release_error:
            print('Lease release unconfirmed: '+type(release_error).__name__,file=sys.stderr)
        raise
    return {'ok':not pending,'status':'failure' if pending else 'success','pendingCandidates':pending,'site':packet['site'],'runId':packet['runId'],'durableJob':True}

HOLD_BASES = ('released-at-audit-limit', 'unreviewable-noindex')


def full_history():
    """Lost-evidence decisions need complete history, never a shallow cloud clone."""
    if subprocess.run(['git', 'rev-parse', '--is-shallow-repository'], capture_output=True, text=True, check=True).stdout.strip() == 'true':
        subprocess.run(['git', 'fetch', '--quiet', '--unshallow', '--no-tags', 'origin'], check=True, capture_output=True)
    subprocess.run(['git', 'fetch', '--quiet', '--no-tags', 'origin', '+refs/heads/*:refs/remotes/origin/*'], check=True, capture_output=True)
    require(subprocess.run(['git', 'rev-parse', '--is-shallow-repository'], capture_output=True, text=True, check=True).stdout.strip() == 'false',
            'Complete history unavailable; cannot prove evidence is lost')


def declared_references(files):
    """Every exact (path, sha256) evidence reference reachable from these review/snapshot files."""
    found, opened = set(), set()
    def visit(value):
        if isinstance(value, dict):
            if isinstance(value.get('path'), str) and isinstance(value.get('sha256'), str):
                add(value['path'], value['sha256'])
            for key, hashed in (('htmlFile', 'htmlSha256'), ('textFile', 'textSha256')):
                if isinstance(value.get(key), str) and isinstance(value.get(hashed), str):
                    add(value[key], value[hashed])
            for child in value.values():
                visit(child)
        elif isinstance(value, list):
            for child in value:
                visit(child)
    def add(name, expected):
        path = Path(name)
        if path.is_absolute():
            try:
                path = path.resolve().relative_to(Path.cwd().resolve())
            except ValueError:
                return
        name = path.as_posix()
        if not name.startswith('reports/') or '..' in path.parts or not re.fullmatch('[0-9a-f]{64}', expected):
            return
        found.add((name, expected))
        if name.endswith('.json') and (name, expected) not in opened and path.is_file() and digest(path) == expected:
            opened.add((name, expected))
            visit(read(path))
    for name in files:
        if Path(name).is_file():
            visit(read(name))
    return found


def evidence_available(name, expected, archived, checkpointed):
    """True if ANY native recovery source still holds these exact bytes (or the path ever existed in history)."""
    path = Path(name)
    if path.is_file() and digest(path) == expected:
        return True
    if any(Path('reports/content-review-evidence').glob(expected + '*')) or expected in archived or expected in checkpointed:
        return True
    history = subprocess.run(['git', 'log', '--all', '--format=%H', '-1', '--', name], capture_output=True, text=True, check=True)
    return bool(history.stdout.strip())


def native_tool(name):
    import importlib.util
    path = Path('.claude/tools') / name
    spec = importlib.util.spec_from_file_location(path.stem.replace('-', '_'), path.resolve())
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module


def names_route(text, route):
    return re.search(r'(?<![\w/.-])' + re.escape(route) + r'(?![\w/-])', text) is not None


def same_site(base, site):
    host = urllib.parse.urlsplit(base).hostname or ''
    return urllib.parse.urlsplit(base).scheme == 'https' and host.removeprefix('www.') == site.removeprefix('www.')


def canonical_base(site, completion):
    groups = completion.get('rendered') or []
    for group in (groups if isinstance(groups, list) else [groups]):
        try:
            base = read(group['approved'])['manifest']['canonicalBase'].rstrip('/')
        except Exception:
            continue
        if same_site(base, site):
            return base
    return 'https://www.' + site.removeprefix('www.')


def live_fingerprint(snapshot_path, route, base):
    snapshot = read(snapshot_path)
    with native.verification_directory('search-gap-park-live-') as folder:
        manifest = Path(folder) / 'manifest.json'
        manifest.write_text(json.dumps(snapshot['manifest']))
        out = Path(folder) / 'live.json'
        subprocess.run([sys.executable, '.claude/tools/rendered-audit.py', 'capture', '--manifest', str(manifest),
                        '--base-url', base, '--out', str(out)], check=True, capture_output=True)
        return next(r['fingerprint'] for r in read(out)['routes'] if r['path'] == route)


def verify_hold(site, decision, hold, canonical_jobs, base):
    """A pending candidate is parked only with verifiable proof it can never be finished by this job."""
    route = hold.get('route', '')
    require(route.startswith('/') and names_route(decision['reason'], route), 'Hold route must be the one named in the reviewed decision')
    basis = hold.get('basis')
    require(basis in HOLD_BASES, 'Unsupported hold basis; keep working this candidate')
    if basis == 'released-at-audit-limit':
        # Native, hash-chained content-review journal: never routine-written counters.
        policy = native_tool('content-review-policy.py')
        with policy.Journal(Path.cwd(), base, route) as journal:
            cycle = journal.cycle
        require(cycle and cycle.get('jobId') in canonical_jobs, 'No native review cycle for this job and route')
        require(cycle.get('status') == 'needs-fix' and policy.exhausted(cycle), 'Audit limit not reached; keep working this candidate')
        final = cycle['rounds'][-1]
        require(final.get('status') == 'complete' and final.get('verdict') == 'FAIL', 'Final capped verdict not recorded')
        snapshot = read(hold.get('snapshot', ''))
        require(same_site(snapshot['manifest']['canonicalBase'], site), 'Snapshot belongs to another site')
        require(any(r['path'] == route and r['fingerprint'] == final['fingerprint'] for r in snapshot['routes']),
                'Snapshot is not the exact capped candidate')
        require(live_fingerprint(hold['snapshot'], route, base) == final['fingerprint'], 'Live production page is not the exact capped candidate; finish its release')
        return {'basis': basis, 'route': route, 'liveBase': base, 'cycleId': cycle.get('cycleId'),
                'finalRound': final['number'], 'fingerprint': final['fingerprint']}
    url = base + route
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'search-gap-park'}), timeout=30) as response:
        header = response.headers.get('X-Robots-Tag', '')
        html = response.read().decode('utf-8', 'replace')
    tags = [tag for tag in re.findall(r'<meta\b[^>]*>', html, re.I) if re.search(r'name\s*=\s*["\']?(robots|googlebot)\b', tag, re.I)]
    require('noindex' in header.lower() or any('noindex' in tag.lower() for tag in tags),
            'Page is indexable; it can be render-reviewed, keep working it')
    return {'basis': basis, 'route': route, 'checkedUrl': url}


def park(intake_path, completion_path, store, owner, reason, holds_path=None):
    """Stop a provably unfinishable job from holding later demand (jobs-park.sql, owner rule 2026-11-13).

    Settled, independently reviewed decisions are acknowledged normally. A published decision is
    parked only when its render group fails AND an exact sha-bound evidence file of that group is
    absent from every native recovery source. A pending decision is parked only with a verified
    hold basis. Anything else is refused so the job keeps being worked.
    """
    packet, completion = read(intake_path), read(completion_path)
    require(completion.get('intakeSha256') == digest(intake_path), 'Intake changed')
    require(len((reason or '').strip()) >= 40, 'State the specific reason this job is permanently blocked')
    holds = read(holds_path) if holds_path else {}
    lease = store.claim_job(packet['site'], owner, Path(intake_path).read_text(encoding='utf-8'))
    require(lease.get('status') == 'claimed' and lease.get('packetSha256') == digest(intake_path),
            'Search job is not available to this invocation')
    heartbeat(store, packet['site'], packet['runId'], owner)
    try:
        created = lease.get('createdAt')
        require(created, 'jobs-park.sql is not applied; parking is unavailable')
        history = lease.get('checkpoints') or []
        latest = history[-1] if history else {}
        # Canonical IDs cannot change; union preserves candidates added across checkpoints.
        canonical_jobs = recorded_canonical_jobs(history, packet=packet)
        base = canonical_base(packet['site'], completion)
        decisions = native.validate_decisions(packet, completion)
        full_history()
        listing = subprocess.run(['git', 'ls-tree', '-r', '--name-only', 'origin/automation/content-review-journals'],
                                 capture_output=True, text=True)
        require(listing.returncode == 0 and listing.stdout.strip(), 'Review archive unavailable; cannot prove evidence is lost')
        archived = listing.stdout
        checkpointed = {a.get('sha256') for cp in history for a in cp.get('artifacts', [])}
        covered = set(native.metadata_coverage(completion))
        groups = completion.get('rendered') or []
        groups = groups if isinstance(groups, list) else [groups]
        failed = []
        for group in groups:
            paths = {r['path'] for r in read(group['approved'])['routes']}
            try:
                native.validate_render_groups(packet['site'], set(), [group], True)
                covered |= paths
            except Exception as error:
                lost = sorted(ref for ref in declared_references([group['approved'], group['review']])
                              if not evidence_available(ref[0], ref[1], archived, checkpointed))
                # Tie the loss to what the native rendered check actually needs.
                native_check = subprocess.run([sys.executable, '.claude/tools/rendered-audit.py', 'check', '--snapshot', group['approved'],
                                               '--review', group['review']], capture_output=True, text=True)
                prefix = 'BLOCKED: Missing actual review dependency before checkpoint: '
                needed = [line[len(prefix):].strip() for line in native_check.stderr.splitlines() if line.startswith(prefix)]
                lost = [ref for ref in lost if ref[0] in needed]
                require(native_check.returncode != 0 and lost,
                        'Render group is fixable (no required evidence is lost); fix it and use finish: ' + type(error).__name__ + ': ' + str(error))
                failed.append({'paths': sorted(paths), 'error': type(error).__name__ + ': ' + str(error),
                               'lostEvidence': [{'path': p, 'sha256': s} for p, s in lost]})
        acknowledged, blocked = [], []
        for decision in decisions:
            if decision['status'] in ('no-addition', 'dropped'):
                acknowledged.append(decision)
            elif decision['status'] == 'published':
                require(decision.get('paths'), 'Published decision lacks routes')
                if set(decision['paths']) <= covered:
                    acknowledged.append(decision)
                    continue
                groups_hit = [g for g in failed if set(g['paths']) & set(decision['paths'])]
                require(groups_hit and set(decision['paths']) <= covered | {p for g in groups_hit for p in g['paths']},
                        'Published routes lack a render group; fix the completion and use finish')
                blocked.append({'id': decision['id'], 'decision': decision, 'kind': 'published-evidence-lost', 'groups': groups_hit})
            else:
                require(decision['id'] in holds, 'Pending candidate has no verified hold basis; keep working it: ' + decision['id'])
                blocked.append({'id': decision['id'], 'decision': decision, 'kind': 'verified-hold',
                                'hold': verify_hold(packet['site'], decision, holds[decision['id']], canonical_jobs, base)})
        require(blocked, 'Nothing is blocked; use finish')
        receipt = {'runId': packet['runId'], 'reason': reason.strip(), 'completionSha256': digest(completion_path),
                   'chartReviewSha256': digest(completion['chartReview']), 'blocked': blocked,
                   'acknowledged': [d['id'] for d in acknowledged]}
        folder = Path('reports/search-gap/recovery'); folder.mkdir(parents=True, exist_ok=True)
        saved = folder / (digest(completion_path) + '-completion.json')
        saved.write_bytes(Path(completion_path).read_bytes())
        record = folder / (digest(completion_path) + '-park.json')
        record.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        # Keep every prior resume key (continuations, findings, evidence pointers); add the request.
        metadata = {k: v for k, v in latest.items() if k not in ('stage', 'artifacts', 'completionFile', 'recordedAt')}
        metadata.setdefault('canonicalJobs', {}); metadata.setdefault('reviewCounters', {})
        park_paths = auto_evidence_paths([str(saved), str(record), completion['chart'], completion['chartReview']], store)
        metadata.update(stage='park-requested', completionFile=str(saved), parkReceipt=str(record),
                        artifacts=capture_artifacts(park_paths, store, packet['site'], packet['runId']))
        store.checkpoint_job(packet['site'], packet['runId'], owner, metadata)
        for decision in acknowledged:
            store.acknowledge_job(packet['site'], packet['runId'], owner, decision,
                                  {'runId': packet['runId'], 'decision': decision, 'completionSha256': digest(completion_path),
                                   'chartReviewSha256': digest(completion['chartReview'])})
        store.park_job(packet['site'], packet['runId'], owner, receipt)
        mark_lease_closed('parked')
    except Exception:
        try:
            store.release_job(packet['site'], packet['runId'], owner)
        except Exception as release_error:
            print('Lease release unconfirmed: ' + type(release_error).__name__, file=sys.stderr)
        raise
    return {'ok': True, 'status': 'parked', 'site': packet['site'], 'runId': packet['runId'],
            'acknowledged': len(acknowledged), 'parkedCandidates': len(blocked), 'parkReceipt': str(record),
            'nextAction': 'Report parked candidates honestly (not published, not dropped). New searches start a fresh job on the next invocation.'}


OWNER_ACTIONS = ('restart', 'publish-as-written', 'settled', 'drop-after-retry', 'already-acknowledged')
OWNER_REQUESTS = Path('reports/search-gap/owner-requests')
AUTO_REQUESTS = Path('reports/search-gap/auto-close')
ATTEMPT_STAGE_RE = re.compile(r'build|chart|write|draft|audit|review|publish|finish|recover|partial|blocked|held', re.I)


def recorded_canonical_jobs(history, packet=None):
    jobs = {v for cp in (history or []) for v in (cp.get('canonicalJobs') or {}).values() if isinstance(v, str) and v}
    for cp in (history or []):
        for key in (cp.get('reviewCounters') or {}):
            for pattern in (r'^chart-review:([A-Za-z0-9_-]{4,})$', r'^([A-Za-z0-9_-]{4,}):(?:chart|content|phase4[-_]audit)'):
                match = re.match(pattern, str(key))
                if match:
                    jobs.add(match.group(1))
        for art in (cp.get('artifacts') or []):
            if not isinstance(art, dict) or not str(art.get('path', '')).endswith('.json'):
                continue
            ap = Path(art['path'])
            if not ap.is_file() or ap.stat().st_size > 2_000_000:
                continue
            try:
                if digest(ap) != art.get('sha256'):
                    continue
                doc = read(ap)
            except Exception:
                continue
            if isinstance(doc, dict):
                jid = doc.get('jobId') or (doc.get('manifest') or {}).get('jobId')
                if isinstance(jid, str) and len(jid.strip()) >= 4:
                    jobs.add(jid.strip())
    if isinstance(packet, dict):
        run_id = str(packet.get('runId') or '').strip()
        cids = {str(c.get('id') or '') for c in (packet.get('candidates') or []) if isinstance(c, dict) and c.get('id')}
        for folder in (Path('reports/search-gap'), Path('reports/mindmap-pass')):
            if not folder.is_dir():
                continue
            for mf in folder.rglob('*.json'):
                rel = mf.as_posix()
                if any(rel.startswith(prefix) for prefix in DISCOVER_SKIP_SUBDIRS) or mf.stat().st_size > 2_000_000:
                    continue
                try:
                    doc = read(mf)
                except Exception:
                    continue
                if not isinstance(doc, dict) or not isinstance(doc.get('jobId'), str) or len(doc['jobId'].strip()) < 4:
                    continue
                jid = doc['jobId'].strip()
                if (doc.get('runId') == run_id
                        or (len(run_id) >= 8 and run_id[:8] in jid)
                        or any(isinstance(d, dict) and d.get('id') in cids for d in (doc.get('candidateDispositions') or []))
                        or any(isinstance(a, dict) and set(a.get('candidateIds') or a.get('sourceIds') or ()) & cids for a in (doc.get('actions') or []))):
                    jobs.add(jid)
    return jobs


def store_acknowledged_decisions(store, site, run, packet):
    fn = getattr(store, 'acknowledged_decisions', None)
    if not callable(fn):
        return {}
    value = fn(site, run, packet)
    return value if isinstance(value, dict) else {}


def retained_settled_decisions(packet, intake_path, history):
    if not intake_path or not Path(intake_path).is_file():
        return {}
    intake_sha = digest(intake_path)
    for cp in reversed(history or []):
        name = cp.get('completionFile')
        if not isinstance(name, str) or not name:
            continue
        try:
            path = artifact_path(name)
            if not path.is_file():
                continue
            completion = read(path)
            if completion.get('runId') != packet['runId'] or completion.get('intakeSha256') != intake_sha:
                continue
            decisions = native.validate_decisions(packet, completion)
            return {d['id']: (str(path), d) for d in decisions if d.get('status') in ('no-addition', 'dropped')}
        except Exception:
            continue
    return {}


def summary_has_close(summary):
    return bool(summary and summary.get('ownerCloseRequest'))


def auto_close_allowed(store, site):
    try:
        return store.owner_policy(site)
    except Exception:
        return False


def site_base(site):
    """The site's real canonical https origin (apex or www), from where its home page settles."""
    try:
        with urllib.request.urlopen(urllib.request.Request('https://' + site.removeprefix('www.') + '/', headers={'User-Agent': 'search-gap'}), timeout=_http_timeout(30)) as response:
            final = urllib.parse.urlsplit(response.geturl())
            if final.scheme == 'https' and (final.hostname or '').removeprefix('www.') == site.removeprefix('www.'):
                return 'https://' + final.netloc
    except Exception:
        pass
    return 'https://www.' + site.removeprefix('www.')


def home_text(base):
    """Site-wide text (navigation, footer, calls to action) seen on the home page; never accepted as draft proof."""
    with urllib.request.urlopen(urllib.request.Request(base + '/', headers={'User-Agent': 'search-gap'}), timeout=_http_timeout(30)) as response:
        return page_text(response.read().decode('utf-8', 'replace'))


def _report_blocks_auto_release(rep_doc, verdict):
    if not isinstance(rep_doc, dict):
        return False
    if rep_doc.get('professionalReviewRequired') is True or rep_doc.get('releaseAtLimitEligible') is False:
        return True
    pr = rep_doc.get('professionalReview')
    if isinstance(pr, str) and pr.strip().upper() in ('REQUIRED', 'MISSING', 'BLOCKED', 'HOLD'):
        return True
    if isinstance(pr, dict) and (pr.get('required') is True and not pr.get('verified') and pr.get('status') not in ('verified', 'approved', 'not-applicable')):
        return True
    if verdict != 'PASS' and rep_doc.get('holdRelease') is True:
        return True
    return False


def reviewed_text(base, route, canonical_jobs, created_at):
    """Visible text of this route exactly as captured for its latest completed independent review,
    only when that review belongs to this job (canonical job), has no trailing pending/invalidated round,
    has no professional-review hold, and started after the job did."""
    policy = native_tool('content-review-policy.py')
    with policy.Journal(Path.cwd(), base, route) as journal:
        cycle = journal.cycle
        begins = [e for e in journal.events if e.get('kind') == 'begin']
    if not cycle or cycle.get('jobId') not in canonical_jobs or not begins:
        return None
    if cycle.get('status') in ('in-review', 'repair-pending'):
        return None
    if native.dt.datetime.fromisoformat(begins[-1]['recordedAt'].replace('Z', '+00:00')) < created_at:
        return None
    all_rounds = list(cycle.get('rounds') or [])
    if not all_rounds or all_rounds[-1].get('status') != 'complete':
        return None
    last_round = all_rounds[-1]
    try:
        if last_round.get('report'):
            rep_path = last_round['report']['path'] if isinstance(last_round['report'], dict) else last_round['report']
            if Path(rep_path).is_file():
                if _report_blocks_auto_release(read(rep_path), last_round.get('verdict')):
                    return None
        admission = read(last_round['admission']['path'])
        ref = admission['snapshot']
        require(digest(ref['path']) == ref['sha256'], 'Reviewed capture changed')
        entry = next(r for r in read(ref['path'])['routes'] if r['path'] == route)
        raw = Path(entry['textFile']).read_bytes()
        require(hashlib.sha256(raw).hexdigest() == entry['textSha256'], 'Reviewed capture text changed')
    except Exception:
        return None
    return ' '.join(raw.decode('utf-8', 'replace').split())


WRITE_ACTION_BUCKETS = {None, '', 'create new content', 'expand / enrich existing', 'refresh / update', 'create', 'enrich', 'update'}
DISCOVER_SKIP_SUBDIRS = ('reports/search-gap/auto-close/', 'reports/search-gap/owner-requests/',
                         'reports/search-gap/park-requests/', 'reports/search-gap/intakes/')


def discover_passing_written(packet, base, boilerplate, canonical_jobs, created_at, explicit_written=None, intake_sha=None):
    """Supplement explicit written drafts with routes that passed independent Journal review in this job
    when a manifest or completion maps the route unambiguously to a candidate. Held/failed drafts are never added."""
    discovered = {}
    journals_dir = Path('reports/content-review-journals')
    if not journals_dir.is_dir() or not Path('.claude/tools/content-review-policy.py').is_file() or not canonical_jobs:
        return discovered
    candidate_routes = {}
    for folder in (Path('reports/search-gap'), Path('reports/mindmap-pass')):
        if not folder.is_dir():
            continue
        for mf in folder.rglob('*.json'):
            rel = mf.as_posix()
            if any(rel.startswith(prefix) for prefix in DISCOVER_SKIP_SUBDIRS) or mf.stat().st_size > 2_000_000:
                continue
            try:
                doc = read(mf)
            except Exception:
                continue
            if not isinstance(doc, dict):
                continue
            if doc.get('runId') == packet['runId'] and isinstance(doc.get('decisions'), list):
                if intake_sha and doc.get('intakeSha256') and doc.get('intakeSha256') != intake_sha:
                    continue
                for dec in doc['decisions']:
                    if (isinstance(dec, dict) and dec.get('status') == 'published'
                            and dec.get('id') and isinstance(dec.get('paths'), list) and dec['paths']):
                        candidate_routes.setdefault(dec['id'], []).extend(p for p in dec['paths'] if isinstance(p, str) and p.startswith('/'))
            if doc.get('jobId') in canonical_jobs and isinstance(doc.get('actions'), list):
                disp_by_target = {}
                for drow in (doc.get('candidateDispositions') or []):
                    if isinstance(drow, dict) and isinstance(drow.get('target'), str) and isinstance(drow.get('id'), str):
                        disp_by_target.setdefault(drow['target'].rstrip('/') or '/', []).append(drow['id'])
                for act in doc['actions']:
                    if not isinstance(act, dict):
                        continue
                    bucket = str(act.get('bucket') or '').strip().lower() if act.get('bucket') is not None else None
                    if bucket not in WRITE_ACTION_BUCKETS:
                        continue
                    target = act.get('target')
                    if not isinstance(target, str) or not target.startswith('/'):
                        continue
                    cids = act.get('candidateIds') or act.get('sourceIds') or disp_by_target.get(target.rstrip('/') or '/')
                    if not cids and isinstance(act.get('candidateId'), str):
                        cids = [act['candidateId']]
                    if not cids and len(packet.get('candidates', [])) == 1:
                        cids = [packet['candidates'][0]['id']]
                    if isinstance(cids, list):
                        for cid in cids:
                            if isinstance(cid, str):
                                candidate_routes.setdefault(cid, []).append(target)
    if not candidate_routes:
        return discovered
    policy = native_tool('content-review-policy.py')
    skip_ids = set(explicit_written or ())
    for candidate in packet.get('candidates', []):
        cid = candidate['id']
        if cid in skip_ids or cid not in candidate_routes:
            continue
        routes = sorted(set(candidate_routes[cid]))
        route_specs = []
        ok = True
        for route in routes:
            try:
                with policy.Journal(Path.cwd(), base, route) as journal:
                    cycle = journal.cycle
                all_rounds = list((cycle or {}).get('rounds') or [])
                if (not cycle or cycle.get('jobId') not in canonical_jobs or cycle.get('status') in ('in-review', 'repair-pending')
                        or not all_rounds or all_rounds[-1].get('status') != 'complete'):
                    ok = False
                    break
                last_r = all_rounds[-1]
                verdict = last_r.get('verdict')
                if verdict != 'PASS':
                    max_r = int(cycle.get('maximumRounds') or policy.audit_limit(policy.policy(Path.cwd()), cycle['profile']))
                    if verdict != 'FAIL' or len(all_rounds) < max_r:
                        ok = False
                        break
                    adm_doc = read(last_r['admission']['path'])
                    snap_doc = read(adm_doc['snapshot']['path'])
                    rep_path = last_r['report']['path'] if isinstance(last_r.get('report'), dict) else last_r.get('report')
                    rep_doc = read(rep_path) if rep_path and Path(rep_path).is_file() else {}
                    rep_row = next((x for x in (rep_doc.get('routes') or []) if isinstance(x, dict) and x.get('path') == route), {})
                    snap_page = next((x for x in (snap_doc.get('routes') or []) if isinstance(x, dict) and x.get('path') == route), {})
                    if (not policy.capped_release(Path.cwd(), snap_doc)
                            or _report_blocks_auto_release(rep_doc, verdict)
                            or policy.validate_liability_block(rep_row, snap_page)):
                        ok = False
                        break
                text = reviewed_text(base, route, canonical_jobs, created_at)
                if not text:
                    ok = False
                    break
                phrases = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text)
                           if 25 <= len(s.strip()) <= 160 and ' '.join(s.split()) not in boilerplate]
                if not phrases:
                    ok = False
                    break
                route_specs.append({'path': route, 'requiredText': phrases[:2]})
            except Exception:
                ok = False
                break
        if ok and route_specs:
            discovered[cid] = route_specs
    return discovered


def build_auto_request(packet, store, written, canonical_jobs, created_at, intake_path=None, history=None):
    """The routine's own close-out under the owner's standing rule: already-acknowledged decisions stay
    intact, drafts whose exact reviewed text is verified publish, reviewed no-addition/dropped decisions
    settle, the rest restart once, and a search whose retry also failed is closed as dropped."""
    AUTO_REQUESTS.mkdir(parents=True, exist_ok=True)
    path = AUTO_REQUESTS / (packet['runId'] + '.json')
    # Always rebuilt from native review evidence; an existing file is never trusted or reused.
    base = site_base(packet['site'])
    boilerplate = home_text(base)
    retried = store.prior_restarted_events(packet['site'])
    prior_acked = store_acknowledged_decisions(store, packet['site'], packet['runId'], packet)
    settled_map = retained_settled_decisions(packet, intake_path, history)
    intake_sha = digest(intake_path) if intake_path and Path(intake_path).is_file() else None
    explicit_written = dict(written or {})
    auto_written = discover_passing_written(packet, base, boilerplate, canonical_jobs, created_at, explicit_written, intake_sha=intake_sha)
    def _verified_written_routes(routes):
        if not routes:
            return None
        require(all(isinstance(r, dict) and str(r.get('path', '')).startswith('/') and isinstance(r.get('requiredText'), list) and r['requiredText']
                    and all(isinstance(x, str) and len(x.strip()) >= 12 for x in r['requiredText']) for r in routes),
                'Each written draft needs its routes with text only the draft contains')
        texts = {r['path']: reviewed_text(base, r['path'], canonical_jobs, created_at) for r in routes}
        if all(texts[r['path']] and all(' '.join(x.split()) in texts[r['path']] and ' '.join(x.split()) not in boilerplate and len(x.strip()) >= 20
                   for x in r['requiredText']) for r in routes):
            return routes
        return None
    candidates = {}
    for candidate in packet['candidates']:
        cid = candidate['id']
        if cid in prior_acked:
            candidates[cid] = {'action': 'already-acknowledged', 'decision': prior_acked[cid]}
            continue
        verified_explicit = _verified_written_routes(explicit_written.get(cid))
        if verified_explicit:
            candidates[cid] = {'action': 'publish-as-written', 'routes': verified_explicit}
            continue
        if cid in settled_map:
            comp_file, _ = settled_map[cid]
            candidates[cid] = {'action': 'settled', 'completion': comp_file}
            continue
        verified_auto = _verified_written_routes(auto_written.get(cid))
        if verified_auto:
            candidates[cid] = {'action': 'publish-as-written', 'routes': verified_auto}
            continue
        if set(candidate.get('eventIds', [])) & retried:
            candidates[cid] = {'action': 'drop-after-retry'}
        else:
            candidates[cid] = {'action': 'restart'}
    request = {'runId': packet['runId'], 'site': packet['site'], 'canonicalBase': base, 'autoClose': True,
               'reason': 'Standing owner rule 2026-11-13: anything stuck is fixed in the same run.', 'candidates': candidates}
    path.write_text(json.dumps(request, ensure_ascii=False, indent=2, sort_keys=True) + '\n', encoding='utf-8')
    return path


def authorized_request(store, site, run, path):
    """A request counts only if the owner registered its exact bytes in search_gap_owner_requests."""
    path = Path(path)
    if '..' in path.parts or not path.resolve().is_relative_to(OWNER_REQUESTS.resolve()) or not path.is_file():
        return False
    try:
        expected = store.owner_request_sha(site, run)
    except Exception:
        return False
    return bool(expected) and expected == digest(path)


def page_text(html):
    import html as entities
    body = re.sub(r'<(script|style)\b.*?</\1>', ' ', html, flags=re.S | re.I)
    return ' '.join(entities.unescape(re.sub(r'<[^>]+>', ' ', body)).split())


def live_ok(url, required):
    """HTTP 200 at exactly this route (no redirect off it) and the draft's own text is on the page."""
    request = urllib.request.Request(url, headers={'User-Agent': 'search-gap-owner-close'})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            final = urllib.parse.urlsplit(response.geturl())
            wanted = urllib.parse.urlsplit(url)
            if not (response.status == 200 and final.netloc == wanted.netloc and final.path.rstrip('/') == wanted.path.rstrip('/')):
                return False
            text = page_text(response.read().decode('utf-8', 'replace'))
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
        return False
    return all(' '.join(phrase.split()) in text for phrase in required)


def _is_repo_built_site():
    if not (Path('.claude/content-review-policy.json').is_file() or Path('.claude/scripts/deploy-run-to-main.sh').is_file()):
        return False
    in_git = subprocess.run(['git', 'rev-parse', '--is-inside-work-tree'], capture_output=True, text=True)
    return in_git.returncode == 0 and in_git.stdout.strip() == 'true'


def maybe_archive_owner_close(intake_path, request_path, store=None, lease=None):
    archive_file = Path('.claude/tools/review-archive.py')
    durable_file = Path('.claude/tools/content-review-durable.py')
    if not archive_file.is_file() or not durable_file.is_file():
        return None
    in_git = subprocess.run(['git', 'rev-parse', '--is-inside-work-tree'], capture_output=True, text=True)
    if in_git.returncode != 0 or in_git.stdout.strip() != 'true':
        return None
    archive = native_tool('review-archive.py')
    if not hasattr(archive, 'archive_owner_close'):
        return None
    import inspect
    if 'lease' in inspect.signature(archive.archive_owner_close).parameters:
        return archive.archive_owner_close(Path.cwd().resolve(), Path(intake_path).resolve(), Path(request_path).resolve(), store=store, lease=lease)
    return archive.archive_owner_close(Path.cwd().resolve(), Path(intake_path).resolve(), Path(request_path).resolve(), store=store)


def owner_close(intake_path, request_path, store, owner, published_path=None, published_commit=None, check_only=False, auto_written=None):
    """Close an old job exactly as the owner's registered request says (owner rule 2026-11-13).

    publish-as-written: only the request's own draft routes, changed by a default-branch commit made
    after the job began, live at exactly that route, are acknowledged as an owner release (never a
    review PASS); settled: a reviewed no-addition/dropped decision from the job's retained completion;
    everything else restarts (unresolved, unparked) so the next intake writes it fresh.
    """
    packet = read(intake_path)
    auto = auto_written is not None
    if auto:
        require(auto_close_allowed(store, packet['site']), 'The owner has not enabled automatic close-out for this site')
        lease = store.claim_job(packet['site'], owner, Path(intake_path).read_text(encoding='utf-8'))
        require(lease.get('status') == 'claimed' and lease.get('packetSha256') == digest(intake_path), 'Search job is not available to this invocation')
        try:
            history = lease.get('checkpoints') or []
            require(any(ATTEMPT_STAGE_RE.search(str(cp.get('stage', '')))
                        and not str(cp.get('stage', '')).endswith('-requested') for cp in history),
                    'No recorded attempt on this job yet; do the work first (auto close-out is for work that could not finish)')
            restore_missing_artifacts(history, store)
            canonical_jobs = recorded_canonical_jobs(history, packet=packet)
            created = native.dt.datetime.fromisoformat(lease['createdAt'].replace('Z', '+00:00'))
            written_data = read(auto_written) if isinstance(auto_written, (str, Path)) and str(auto_written) else (auto_written if isinstance(auto_written, dict) else {})
            request_path = build_auto_request(packet, store, written_data, canonical_jobs, created, intake_path=intake_path, history=history)
        except Exception:
            store.release_job(packet['site'], packet['runId'], owner)
            raise
    request = read(request_path)
    require(request.get('runId') == packet['runId'] and request.get('site') == packet['site'], 'Owner request belongs to another job')
    require(auto or (not request.get('autoClose') and authorized_request(store, packet['site'], packet['runId'], request_path)),
            'Owner request is not registered by the owner for these exact bytes')
    base = request.get('canonicalBase', '').rstrip('/')
    require(same_site(base, packet['site']), 'Owner request needs this site\'s canonical https base')
    actions = request.get('candidates') or {}
    require(set(actions) == {c['id'] for c in packet['candidates']} and all(a.get('action') in OWNER_ACTIONS for a in actions.values()),
            'The owner request must give every candidate exactly one action')
    for entry in actions.values():
        require(auto or entry['action'] != 'already-acknowledged', 'Only automatic close-out uses already-acknowledged queue state')
        require(auto or entry['action'] != 'drop-after-retry', 'Only automatic close-out uses drop-after-retry')
        if entry['action'] == 'publish-as-written':
            routes = entry.get('routes')
            require(isinstance(routes, list) and routes and all(isinstance(r, dict) and str(r.get('path', '')).startswith('/')
                    and isinstance(r.get('requiredText'), list) and r['requiredText'] and all(isinstance(x, str) and len(x.strip()) >= 12 for x in r['requiredText'])
                    for r in routes), 'Each publish-as-written candidate needs its draft routes, each with text that only the draft contains')
    published = (published_path if isinstance(published_path, dict) else read(published_path)) if published_path and not check_only else {}
    for cid, paths in published.items():
        require(actions.get(cid, {}).get('action') == 'publish-as-written', 'Only publish-as-written candidates can be reported as published')
        require(isinstance(paths, list) and set(paths) == {r['path'] for r in actions[cid]['routes']}, 'Published paths must be exactly the request\'s draft routes')
    lease = store.claim_job(packet['site'], owner, Path(intake_path).read_text(encoding='utf-8'))
    require(lease.get('status') == 'claimed' and lease.get('packetSha256') == digest(intake_path),
            'Search job is not available to this invocation')
    heartbeat(store, packet['site'], packet['runId'], owner)
    try:
        created = lease.get('createdAt')
        require(created, 'jobs-park.sql is not applied; close-out is unavailable')
        created_at = native.dt.datetime.fromisoformat(created.replace('Z', '+00:00'))
        prior_acked = store_acknowledged_decisions(store, packet['site'], packet['runId'], packet) if auto else {}
        completions = {}
        acks, prior_done, restart = [], [], []
        for candidate in packet['candidates']:
            entry = actions[candidate['id']]
            if entry['action'] == 'already-acknowledged':
                verified_dec = prior_acked.get(candidate['id'])
                require(verified_dec is not None, 'Candidate is not acknowledged in search_gap_queue: ' + candidate['id'])
                prior_done.append(verified_dec)
            elif entry['action'] == 'settled':
                name = entry.get('completion', '')
                if name not in completions:
                    completion = read(name)
                    require(completion.get('runId') == packet['runId'] and completion.get('intakeSha256') == digest(intake_path),
                            'Settled decision must come from this job\'s retained completion')
                    completions[name] = {d['id']: d for d in native.validate_decisions(packet, completion)}
                decision = completions[name][candidate['id']]
                require(decision['status'] in ('no-addition', 'dropped'), 'Only reviewed no-addition/dropped decisions can be settled')
                acks.append((decision, {'settledFrom': name, 'completionSha256': digest(name)}))
            elif entry['action'] == 'drop-after-retry':
                acks.append(({'id': candidate['id'], 'status': 'dropped',
                              'reason': 'Closed under the standing owner rule (2026-11-13): a fresh retry of this search also could not be completed. A new search for this term starts again.'},
                             {'autoClose': {'requestSha256': digest(request_path)}}))
            elif candidate['id'] in published:
                acks.append(({'id': candidate['id'], 'status': 'published', 'paths': published[candidate['id']],
                              'reason': 'Owner release as written (2026-11-13): ' + str(request.get('reason', ''))[:400]}, None))
            else:
                restart.append(candidate['id'])
        if check_only:
            archived_release = None
            if any(e['action'] == 'publish-as-written' for e in actions.values()):
                archived_release = maybe_archive_owner_close(intake_path, request_path, store=store, lease=lease)
            store.release_job(packet['site'], packet['runId'], owner)
            return {'ok': True, 'status': 'owner-close-check-passed', 'site': packet['site'], 'runId': packet['runId'],
                    'requestFile': str(request_path),
                    'publishAsWritten': [cid for cid, e in actions.items() if e['action'] == 'publish-as-written'],
                    'releaseArchive': archived_release,
                    'nextAction': 'Publish the publish-as-written drafts, then run owner-close without --check.'}
        if published and _is_repo_built_site():
            require(published_commit, 'Repository-built sites must pass --published-commit proving the default-branch commit')
        if published and published_commit:
            # Repository-built sites: also prove the deploying commit. Database-backed content is proven by the live text below.
            from publication_history import published as on_default_branch
            on_default_branch(published_commit)
            stamp = subprocess.run(['git', 'show', '-s', '--format=%cI', published_commit], capture_output=True, text=True, check=True).stdout.strip()
            require(native.dt.datetime.fromisoformat(stamp) > created_at, 'Published commit predates this job')
            changed = subprocess.run(['git', 'show', '--name-only', '--format=', published_commit], capture_output=True, text=True, check=True).stdout.split()
            require(changed, 'Published commit changed nothing')
            if not auto:
                at_commit = subprocess.run(['git', 'show', published_commit + ':' + str(request_path)], capture_output=True)
                require(at_commit.returncode == 0 and at_commit.stdout == Path(request_path).read_bytes(), 'The owner request must be on the default branch at the published commit')
        for decision, _ in acks:
            if decision['status'] != 'published':
                continue
            for route in actions[decision['id']]['routes']:
                require(live_ok(base + route['path'], route['requiredText']),
                        'Draft is not live at exactly this route (HTTP 200, no redirect, draft text present): ' + base + route['path'])
        acks = [(d, extra or {'ownerRelease': {'commit': published_commit, 'requestSha256': digest(request_path)}}) for d, extra in acks]
        published_map = {d['id']: d['paths'] for d in prior_done if d['status'] == 'published'}
        published_map.update({d['id']: d['paths'] for d, _ in acks if d['status'] == 'published'})
        settled_ids = [d['id'] for d in prior_done if d['status'] in ('no-addition', 'dropped')]
        settled_ids.extend(d['id'] for d, e in acks if d['status'] in ('no-addition', 'dropped') and 'settledFrom' in (e or {}))
        receipt = {'runId': packet['runId'], 'requestSha256': digest(request_path), 'reason': request.get('reason'), 'autoClose': auto,
                   'request': str(request_path), 'restart': restart, 'published': published_map,
                   'settled': settled_ids,
                   'dropped': [d['id'] for d, e in acks if d['status'] == 'dropped' and 'autoClose' in (e or {})],
                   'publishedCommit': published_commit}
        if prior_done:
            receipt['alreadyAcknowledged'] = [d['id'] for d in prior_done]
        latest = (lease.get('checkpoints') or [{}])[-1]
        metadata = {k: v for k, v in latest.items() if k not in ('stage', 'artifacts', 'completionFile', 'recordedAt')}
        metadata.setdefault('canonicalJobs', {}); metadata.setdefault('reviewCounters', {})
        close_paths = auto_evidence_paths([str(request_path)], store)
        metadata.update(stage='owner-close-requested', ownerCloseReceipt=receipt,
                        artifacts=capture_artifacts(close_paths, store, packet['site'], packet['runId']))
        store.checkpoint_job(packet['site'], packet['runId'], owner, metadata)
        for decision, extra in acks:
            store.acknowledge_job(packet['site'], packet['runId'], owner, decision, dict({'runId': packet['runId'], 'decision': decision}, **extra))
        store.owner_close_job(packet['site'], packet['runId'], owner, receipt)
        mark_lease_closed('owner-closed')
    except Exception:
        try:
            store.release_job(packet['site'], packet['runId'], owner)
        except Exception as release_error:
            print('Lease release unconfirmed: ' + type(release_error).__name__, file=sys.stderr)
        raise
    return {'ok': True, 'status': 'owner-closed', 'site': packet['site'], 'runId': packet['runId'],
            'published': receipt['published'], 'restarted': restart, 'settled': receipt['settled'], 'dropped': receipt['dropped'],
            'nextAction': 'Report what was published and restarted. Restarted searches are written fresh by the next invocation.'}


def _origin_main_head():
    in_git = subprocess.run(['git', 'rev-parse', '--is-inside-work-tree'], capture_output=True, text=True)
    if in_git.returncode != 0 or in_git.stdout.strip() != 'true':
        return None
    subprocess.run(['git', 'fetch', '--quiet', '--no-tags', 'origin', 'main'], capture_output=True)
    rev = subprocess.run(['git', 'rev-parse', '--verify', 'refs/remotes/origin/main^{commit}'], capture_output=True, text=True)
    return rev.stdout.strip() if rev.returncode == 0 and rev.stdout.strip() else None


def _find_route_commit_after(created_at, routes):
    head = _origin_main_head()
    if not head:
        return None
    slugs = {r.strip('/').rsplit('/', 1)[-1] for r in routes if r.strip('/')}
    log = subprocess.run(['git', 'log', '--format=%H %cI', '-n', '30', head], capture_output=True, text=True)
    if log.returncode != 0:
        return None
    for line in log.stdout.splitlines():
        parts = line.strip().split(' ', 1)
        if len(parts) != 2:
            continue
        sha, stamp = parts
        try:
            if native.dt.datetime.fromisoformat(stamp) <= created_at:
                break
        except ValueError:
            continue
        diff = subprocess.run(['git', 'show', '--name-only', '--format=', sha], capture_output=True, text=True)
        changed = [p for p in diff.stdout.splitlines() if p and not p.startswith('reports/') and not p.startswith('.claude/')]
        if not changed:
            continue
        if not slugs or any(any(sl in p for sl in slugs) or p.startswith(('src/', 'app/', 'pages/', 'content/', 'data/', 'public/')) for p in changed):
            return sha
    return None


def _harvest_canonical_jobs(swept_paths, created_at):
    harvested = {}
    created_epoch = created_at.timestamp() - 5
    for p_str in (swept_paths or ()):
        p = Path(p_str)
        if not p.is_file() or p.suffix not in ('.json', '.jsonl'):
            continue
        try:
            if p.stat().st_mtime < created_epoch:
                continue
            if p.suffix == '.jsonl':
                for line in p.read_text(encoding='utf-8', errors='replace').splitlines():
                    if not line.strip():
                        continue
                    ev = json.loads(line)
                    jid = (ev.get('data') or {}).get('jobId')
                    if isinstance(jid, str) and len(jid) >= 4:
                        harvested[f'journal:{p.stem}'] = jid
            else:
                doc = json.loads(p.read_bytes())
                if isinstance(doc, dict) and isinstance(doc.get('jobId'), str) and len(doc['jobId']) >= 4:
                    if isinstance(doc.get('actions'), list) or isinstance(doc.get('generated'), list):
                        harvested[f'swept:{p.stem}'] = doc['jobId']
        except Exception:
            continue
    return harvested


def _deploy_and_poll_reviewed_drafts(intake_path, request_path, store, packet, owner, base, pub_routes, created_at, deploy):
    lease = store.claim_job(packet['site'], owner, Path(intake_path).read_text(encoding='utf-8'))
    require(lease.get('status') == 'claimed' and lease.get('packetSha256') == digest(intake_path), 'Search job lease unavailable for deploy')
    heartbeat(store, packet['site'], packet['runId'], owner)
    try:
        already_live = {cid: [r['path'] for r in routes] for cid, routes in pub_routes.items()
                        if all(live_ok(base + r['path'], r['requiredText']) for r in routes)}
        deployed_commit = None
        if len(already_live) < len(pub_routes) and deploy:
            maybe_archive_owner_close(intake_path, request_path, store=store, lease=lease)
            heartbeat(store, packet['site'], packet['runId'], owner)
            before_main = _origin_main_head()
            if Path('.github/workflows/land.yml').is_file() and Path('.claude/scripts/land-run.sh').is_file():
                cmd = ['bash', '.claude/scripts/land-run.sh', 'land']
            elif Path('.claude/scripts/deploy-run-to-main.sh').is_file():
                cmd = ['bash', '.claude/scripts/deploy-run-to-main.sh', 'push']
            else:
                cmd = None
            if cmd is not None:
                res = subprocess.run(cmd, capture_output=True, text=True)
                heartbeat(store, packet['site'], packet['runId'], owner)
                if res.returncode == 0:
                    after_main = _origin_main_head()
                    if after_main and after_main != before_main:
                        deployed_commit = after_main
                    deadline = time.time() + 180
                    while time.time() < deadline:
                        already_live = {cid: [r['path'] for r in routes] for cid, routes in pub_routes.items()
                                        if all(live_ok(base + r['path'], r['requiredText']) for r in routes)}
                        if len(already_live) == len(pub_routes):
                            break
                        time.sleep(10)
        if already_live and not deployed_commit:
            live_paths = [p for paths in already_live.values() for p in paths]
            deployed_commit = _find_route_commit_after(created_at, live_paths)
        return already_live, deployed_commit
    finally:
        store.release_job(packet['site'], packet['runId'], owner)


def end_run(intake_path, store, owner, completion_path=None, written_path=None, published_path=None, published_commit=None, reason=None, deploy=False):
    """Guarantee that an invocation finishes its Search Gap job or closes it out before ending."""
    packet = read(intake_path)
    if not packet.get('candidates'):
        marker = lease_marker()
        if marker and marker.is_file():
            try:
                saved_m = read(marker)
                if saved_m.get('closed') or saved_m.get('run') == packet.get('runId'):
                    mark_lease_closed('empty')
            except Exception:
                pass
        else:
            mark_lease_closed('empty')
        result = {'ok': True, 'status': 'empty', 'site': packet['site'], 'runId': packet['runId'], 'durableJob': True,
                  'nextAction': 'Verified empty intake; report no-op once and end this invocation.'}
        save_terminal_record(terminal_record(packet['site'], owner), result)
        return result
    finish_failure = None
    if completion_path and Path(completion_path).is_file():
        try:
            done = finish(intake_path, completion_path, store, owner)
            if done.get('ok'):
                save_terminal_record(terminal_record(packet['site'], owner), done)
                done['nextAction'] = 'Send the final collector report once and end this invocation. New searches belong to the next schedule.'
                return done
            finish_failure = f"partial-finish ({done.get('pendingCandidates')} pending)"
        except Exception as error:
            finish_failure = f'{type(error).__name__}: {error}'
    require(auto_close_allowed(store, packet['site']), 'The owner has not enabled automatic close-out for this site')
    lease = store.claim_job(packet['site'], owner, Path(intake_path).read_text(encoding='utf-8'))
    require(lease.get('status') == 'claimed' and lease.get('packetSha256') == digest(intake_path),
            'Search job is not available to this invocation')
    created_at = native.dt.datetime.fromisoformat(lease['createdAt'].replace('Z', '+00:00'))
    try:
        history = list(lease.get('checkpoints') or [])
        restore_missing_artifacts(history, store)
        has_attempt = any(ATTEMPT_STAGE_RE.search(str(cp.get('stage', '')))
                          and not str(cp.get('stage', '')).endswith('-requested') for cp in history)
        if not has_attempt:
            swept = auto_evidence_paths(store=store)
            effective_reason = (reason or finish_failure or '').strip()
            if not effective_reason and not swept:
                raise ValueError('No recorded attempt on this job yet; pass --reason explaining the blocker or complete a stage checkpoint first')
            previous = history[-1] if history else {}
            canon_jobs = dict(previous.get('canonicalJobs') or {})
            if not canon_jobs:
                canon_jobs.update(_harvest_canonical_jobs(swept, created_at))
            blocked_cp = {
                'stage': 'run-blocked',
                'reason': effective_reason or 'Unfinished invocation auto-closed with swept evidence',
                'canonicalJobs': canon_jobs,
                'reviewCounters': dict(previous.get('reviewCounters') or {}),
                'artifacts': capture_artifacts(swept, store, packet['site'], packet['runId']),
            }
            store.checkpoint_job(packet['site'], packet['runId'], owner, blocked_cp)
    finally:
        store.release_job(packet['site'], packet['runId'], owner)
    written_arg = written_path or ''
    check_res = owner_close(intake_path, None, store, owner, check_only=True, auto_written=written_arg)
    request_file = Path(check_res['requestFile'])
    built = read(request_file)
    base = built['canonicalBase'].rstrip('/')
    pub_routes = {cid: entry['routes'] for cid, entry in built['candidates'].items() if entry.get('action') == 'publish-as-written'}
    effective_pub = published_path
    effective_commit = published_commit
    if not effective_pub and pub_routes:
        already_live, deployed_commit = _deploy_and_poll_reviewed_drafts(
            intake_path, request_file, store, packet, owner, base, pub_routes, created_at, deploy
        )
        if already_live:
            effective_pub = already_live
            effective_commit = effective_commit or deployed_commit
    result = owner_close(intake_path, None, store, owner, effective_pub, effective_commit, check_only=False, auto_written=written_arg)
    if finish_failure:
        result['finishAttempt'] = finish_failure
    save_terminal_record(terminal_record(packet['site'], owner), result)
    return result


def heartbeat(store, site, run, owner):
    """Tell the shared claim this owner is alive (new-worker jobs get dead-run takeover after 3 silent hours)."""
    try:
        store.heartbeat_job(site, run, owner)
    except Exception as error:
        print('Heartbeat unavailable: ' + type(error).__name__, file=sys.stderr)


def lease_marker(payload=None):
    session = os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID') or (payload or {}).get('session_id')
    if not session:
        try:
            hint = Path(subprocess.check_output(['git', 'rev-parse', '--git-path', 'search-gap-recovery/current-session.json'], text=True).strip())
            if hint.is_file():
                data = read(hint)
                if time.time() - float(data.get('updatedAt', 0)) <= 3600:
                    session = str(data.get('sessionId') or '')
        except Exception:
            session = ''
    if not session:
        return None
    key = hashlib.sha256(session.encode()).hexdigest()
    path = subprocess.check_output(['git','rev-parse','--git-path','search-gap-recovery/leases/'+key+'.json'],text=True).strip()
    return Path(path)


def remember_lease(site, run, owner, intake_path=None, auto_close=False):
    marker = lease_marker()
    if marker:
        marker.parent.mkdir(parents=True,exist_ok=True)
        record = {
            'site': site,
            'run': run,
            'owner': owner,
            'createdAt': time.time(),
            'workflowRunEnv': os.environ.get('WORKFLOW_RUN_ID', '').strip(),
        }
        if intake_path:
            record['intake'] = str(Path(intake_path).resolve())
            record['autoClose'] = bool(auto_close)
            record['closed'] = False
        marker.write_text(json.dumps(record),encoding='utf-8')
        marker.chmod(0o600)
    try:
        root = Path.cwd().resolve()
        if root.parent == Path('/home/user') and (root / 'scripts/search_gap/session_end.py').is_file():
            import session_end
            session_end.install_runtime(root)
    except Exception:
        pass


def mark_lease_closed(outcome='closed', payload=None):
    try:
        marker = lease_marker(payload)
    except Exception:
        return
    if marker and marker.is_file():
        try:
            saved = read(marker)
            saved['closed'] = True
            saved['closedOutcome'] = outcome
            marker.write_text(json.dumps(saved), encoding='utf-8')
            marker.chmod(0o600)
        except Exception:
            pass


def release_at_session_end(payload):
    if payload.get('hook_event_name')!='SessionEnd':
        return
    marker = lease_marker(payload)
    if marker and marker.is_file():
        saved = read(marker)
        try:
            if saved.get('closed'):
                return
            if (saved.get('autoClose') and saved.get('intake') and Path(saved['intake']).is_file()
                    and os.environ.get('SUPABASE_URL') and os.environ.get('SUPABASE_SERVICE_ROLE_KEY')):
                store = Store()
                try:
                    end_run(saved['intake'], store, saved['owner'],
                            reason='Session ended with an unfinished Search Gap job; closed automatically by SessionEnd.')
                    return
                except Exception:
                    store.release_job(saved['site'], saved['run'], saved['owner'])
                    return
            Store().release_job(saved['site'],saved['run'],saved['owner'])
        finally:
            marker.unlink(missing_ok=True)


def invocation_owner():
    if os.environ.get('WORKFLOW_RUN_ID'):return os.environ['WORKFLOW_RUN_ID']
    # Legacy cloud prompts predate --owner. Bind them to the real native
    # invocation, never a random per-command ID or another run's saved owner.
    session=os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID')
    return hashlib.sha256(('search-gap-native:'+session).encode()).hexdigest() if session else None

def terminal_record(site, owner):
    """Use only the fresh invocation identity; a persisted Claude session may span schedules."""
    if not owner or len(owner) < 16:
        return None
    sid = os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID')
    if sid and owner == hashlib.sha256(('search-gap-native:' + sid).encode()).hexdigest():
        return None
    key = hashlib.sha256((site + '\0' + owner).encode()).hexdigest()
    relative = 'search-gap-recovery/completed-invocations/' + key + '.json'
    return Path(subprocess.check_output(['git', 'rev-parse', '--git-path', relative], text=True).strip())


def save_terminal_record(path, result):
    if path is None:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    record = {'ok': True, 'status': 'invocation-complete', 'site': result['site'],
              'runId': result['runId'], 'outcome': result.get('status', 'no-op'),
              'nextAction': 'Report the verified outcome once and end this invocation. Later searches belong to the next schedule.'}
    with tempfile.NamedTemporaryFile(mode='w', dir=path.parent, delete=False) as target:
        json.dump(record, target)
    os.replace(target.name, path)


def main():
    p=argparse.ArgumentParser();p.add_argument('command',choices=['list-gaps','checkpoint','restore','adopt','finish','park','owner-close','end-run','heartbeat']);p.add_argument('--site',required=True);p.add_argument('--owner',default=invocation_owner());p.add_argument('--out');p.add_argument('--intake');p.add_argument('--completion');p.add_argument('--metadata');p.add_argument('--files',nargs='*',default=[]);p.add_argument('--end-invocation', action='store_true',help='Release only this owner after the checkpoint is safely retained');p.add_argument('--checkpoint-file');p.add_argument('--reason');p.add_argument('--holds');p.add_argument('--request');p.add_argument('--published');p.add_argument('--published-commit');p.add_argument('--check',action='store_true');p.add_argument('--auto',action='store_true');p.add_argument('--deploy',action='store_true');p.add_argument('--written');p.add_argument('--days');p.add_argument('--limit');p.add_argument('--min-count');a=p.parse_args()
    terminal = terminal_record(a.site, a.owner) if a.command in ('list-gaps', 'finish', 'end-run') else None
    if a.command == 'list-gaps' and terminal and terminal.is_file():
        print(json.dumps(read(terminal)))
        return 0
    store=Store()
    if a.command=='list-gaps':
        result=dict(intake(a.site,store,a.out,a.owner),invocationOwner=a.owner)
        if not result['candidateCount'] and not result['resumed']:
            save_terminal_record(terminal, result)
    elif a.command=='restore':result=restore_artifacts(read(a.checkpoint_file), store)
    else:
        packet=read(a.intake);require(packet['site']==a.site,'Cross-site job refused')
        if a.command=='adopt':
            raw=Path(a.intake).read_text(encoding='utf-8');job=store.claim_job(a.site,a.owner,raw,adopt=True)
            require(job.get('packetText')==raw,'A different job is active or legacy input is no longer pending; do not replace it')
            result={'ok':True,'runId':packet['runId'],'intakeSha256':digest(a.intake)}
        elif a.command=='checkpoint':
            metadata=read(a.metadata)
            require(metadata.get('stage') and isinstance(metadata.get('canonicalJobs'),dict) and isinstance(metadata.get('reviewCounters'),dict),'Stage, canonicalJobs and reviewCounters required')
            require(all(isinstance(v,str) and v for v in metadata['canonicalJobs'].values()),'Canonical job IDs required')
            require(all(isinstance(v,int) and not isinstance(v,bool) and v>=0 for v in metadata['reviewCounters'].values()),'Nonnegative integer review counters required')
            lease = store.claim_job(a.site, a.owner, Path(a.intake).read_text(encoding='utf-8'))
            require(lease.get('status') == 'claimed' and lease.get('packetSha256') == digest(a.intake),
                    'Cannot checkpoint another owner or a different search intake')
            previous = (lease.get('checkpoints') or [{}])[-1]
            for key in ('canonicalJobs', 'reviewCounters'):
                metadata[key] = {**previous.get(key, {}), **metadata[key]}
            swept_files = auto_evidence_paths(a.files, store)
            metadata['artifacts']=capture_artifacts(swept_files, store, a.site, packet['runId']);result=store.checkpoint_job(a.site,packet['runId'],a.owner,metadata)
            heartbeat(store,a.site,packet['runId'],a.owner)
            if a.end_invocation and result.get('ok',True):
                store.release_job(a.site,packet['runId'],a.owner)
        elif a.command=='heartbeat':
            store.heartbeat_job(a.site,packet['runId'],a.owner);result={'ok':True,'status':'alive'}
        elif a.command=='owner-close':
            result=owner_close(a.intake,a.request,store,a.owner,a.published,a.published_commit,a.check,(a.written or '') if a.auto else None)
        elif a.command=='end-run':
            result=end_run(a.intake,store,a.owner,a.completion,a.written,a.published,a.published_commit,a.reason,a.deploy)
        elif a.command=='park':
            result=park(a.intake,a.completion,store,a.owner,a.reason,a.holds)
        else:
            result=finish(a.intake,a.completion,store,a.owner)
            if result['ok']:
                save_terminal_record(terminal, result)
                result['nextAction'] = 'Send the final collector report once and end this invocation. New searches belong to the next schedule.'
    print(json.dumps(result,ensure_ascii=False));return 0 if result.get('ok',True) else 1
if __name__=='__main__':
    try:sys.exit(main())
    except BusyJob as error:print(json.dumps(error.result()));sys.exit(1)
    except Exception as error:print(json.dumps({'ok':False,'status':'failure','error':type(error).__name__+': '+str(error)}));sys.exit(1)
