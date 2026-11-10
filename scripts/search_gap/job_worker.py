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

class Store(native.Store):
    def request(self,path,method='GET',body=None):
        headers={'apikey':self.key,'Authorization':'Bearer '+self.key,'Content-Type':'application/json','Prefer':'return=representation'}
        request=urllib.request.Request(self.url+'/rest/v1/'+path,method=method,headers=headers,data=json.dumps(body).encode() if body is not None else None)
        for attempt in range(3):
            try:
                with urllib.request.urlopen(request,timeout=30) as response:
                    raw=response.read();return json.loads(raw) if raw else None
            except urllib.error.HTTPError as error:
                if error.code not in (408,429,500,502,503,504) or attempt==2:raise
            except (urllib.error.URLError,TimeoutError):
                if attempt==2:raise
            time.sleep(2**attempt)
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
        require(job['status']!='busy','Another search run holds the active job lease; do not duplicate it')
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
            restore_artifacts(checkpoints)
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
            action='Reuse the restored, already independently reviewed recoverySummary.completionFile, reconcile its separate preview, then finish. For an expired original loopback preview use a separate current build and postPublicationRecovery with the original approved hash and original publication commit. Run python3 scripts/search_gap/publication_history.py FULL_COMMIT for genuine current remote ancestry, including shallow checkouts. Keep all exact-render and live comparisons. Do not dispatch BUILD, WRITE or another decision/content review.'
            sid=os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID')
            if sid:
                name='search-gap-continuation/'+hashlib.sha256(sid.encode()).hexdigest()+'.json'
                marker=Path(subprocess.check_output(['git','rev-parse','--git-path',name],text=True).strip())
                marker.parent.mkdir(parents=True,exist_ok=True)
                marker.write_text(json.dumps({'completionFile':summary['completionFile'],'sha256':digest(summary['completionFile']),'runId':packet['runId']}))
        if job.get('status') == 'empty':
            action = 'Verified empty intake. Submit the required collector no-op once, then finish. No Git commit, push, build, review or deployment is needed.'
        # Control and recovery state must precede the potentially long candidate list.
        if job.get('status')=='claimed':
            remember_lease(site,packet['runId'],owner)
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


def completion_checkpoint_paths(paths):
    # Finish reopens the reviewed chart by path. Save its exact bytes in the
    # same durable checkpoint even when a caller names only the completion.
    selected = dict.fromkeys(map(str, paths))
    for value in tuple(selected):
        path = artifact_path(value)
        if path.suffix != '.json':
            continue
        if path.stat().st_size > 2_000_000:
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


def capture_artifacts(paths):
    artifacts=[]
    for value in completion_checkpoint_paths(paths):
        path=artifact_path(value);raw=path.read_bytes();require(len(raw)<=2_000_000,'Artifact too large; use a reviewed private Git artifact reference')
        for key,secret in os.environ.items():
            if any(x in key.upper() for x in ('KEY','TOKEN','PASSWORD','SECRET','AUTH','B64','DATABASE_URL')) and len(secret)>=16:
                require(secret.encode() not in raw,'Credential value found in checkpoint artifact')
        artifacts.append({'path':str(path),'sha256':hashlib.sha256(raw).hexdigest(),'base64':base64.b64encode(raw).decode()})
    require(sum(len(x['base64']) for x in artifacts)<=3_000_000,'Checkpoint too large; save bounded batches')
    return artifacts

def restore_artifacts(checkpoints):
    latest={}
    for checkpoint in checkpoints:
        for artifact in checkpoint.get('artifacts',[]):latest[artifact['path']]=artifact
    staged=[]
    for value,artifact in latest.items():
        path=artifact_path(value);raw=base64.b64decode(artifact['base64'],validate=True)
        require(hashlib.sha256(raw).hexdigest()==artifact['sha256'],'Saved artifact bytes changed')
        require(not path.exists() or path.read_bytes()==raw,'Local evidence differs; reconcile without overwriting: '+value)
        staged.append((path,raw))
    for path,raw in staged:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(raw)
    return {'ok':True,'restored':len(staged)}

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
        metadata.update(stage=stage, completionFile=str(saved),
                        artifacts=capture_artifacts([str(saved), completion['chart'], completion['chartReview']]))
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

def lease_marker(payload=None):
    session = os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID') or (payload or {}).get('session_id')
    if not session:
        return None
    key = hashlib.sha256(session.encode()).hexdigest()
    path = subprocess.check_output(['git','rev-parse','--git-path','search-gap-recovery/leases/'+key+'.json'],text=True).strip()
    return Path(path)


def remember_lease(site, run, owner):
    marker = lease_marker()
    if marker:
        marker.parent.mkdir(parents=True,exist_ok=True)
        marker.write_text(json.dumps({'site':site,'run':run,'owner':owner}),encoding='utf-8')
        marker.chmod(0o600)


def release_at_session_end(payload):
    if payload.get('hook_event_name')!='SessionEnd':
        return
    marker = lease_marker(payload)
    if marker and marker.is_file():
        saved = read(marker)
        Store().release_job(saved['site'],saved['run'],saved['owner'])
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
    p=argparse.ArgumentParser();p.add_argument('command',choices=['list-gaps','checkpoint','restore','adopt','finish']);p.add_argument('--site',required=True);p.add_argument('--owner',default=invocation_owner());p.add_argument('--out');p.add_argument('--intake');p.add_argument('--completion');p.add_argument('--metadata');p.add_argument('--files',nargs='*',default=[]);p.add_argument('--end-invocation', action='store_true',help='Release only this owner after the checkpoint is safely retained');p.add_argument('--checkpoint-file');p.add_argument('--days');p.add_argument('--limit');p.add_argument('--min-count');a=p.parse_args()
    terminal = terminal_record(a.site, a.owner) if a.command in ('list-gaps', 'finish') else None
    if a.command == 'list-gaps' and terminal and terminal.is_file():
        print(json.dumps(read(terminal)))
        return 0
    store=Store()
    if a.command=='list-gaps':
        result=dict(intake(a.site,store,a.out,a.owner),invocationOwner=a.owner)
        if not result['candidateCount'] and not result['resumed']:
            save_terminal_record(terminal, result)
    elif a.command=='restore':result=restore_artifacts(read(a.checkpoint_file))
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
            metadata['artifacts']=capture_artifacts(a.files);result=store.checkpoint_job(a.site,packet['runId'],a.owner,metadata)
            if a.end_invocation and result.get('ok',True):
                store.release_job(a.site,packet['runId'],a.owner)
        else:
            result=finish(a.intake,a.completion,store,a.owner)
            if result['ok']:
                save_terminal_record(terminal, result)
                result['nextAction'] = 'Send the final collector report once and end this invocation. New searches belong to the next schedule.'
    print(json.dumps(result,ensure_ascii=False));return 0 if result.get('ok',True) else 1
if __name__=='__main__':
    try:sys.exit(main())
    except Exception as error:print(json.dumps({'ok':False,'status':'failure','error':type(error).__name__+': '+str(error)}));sys.exit(1)
