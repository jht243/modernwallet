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
        params=__import__('urllib.parse',fromlist=['urlencode']).urlencode({
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
    summary={k:checkpoints[-1].get(k) for k in ('stage','canonicalJobs','reviewCounters','gitRef','commit')} if checkpoints else None
    retained=Path('reports/search-gap/recovery')/(digest(path)+'.json')
    if resumed and retained.is_file():
        saved=read(retained)
        require(saved.get('intakeSha256')==digest(path) and saved.get('runId')==packet['runId'],'Saved completion belongs to another search job')
        for ref in saved['artifacts']:
            require(digest(artifact_path(ref['path']))==ref['sha256'],'Saved completed decision evidence changed')
        summary=dict(summary or {},completionFile=saved['completionFile'],completionSourceCommit=saved['sourceCommit'])
    return dict(packet,durableJob=True,intakeFile=str(path),intakeSha256=digest(path),resumed=resumed,checkpointFile=str(checkpoint_file) if checkpoint_file else None,checkpointCount=len(checkpoints),recoverySummary=summary)

def artifact_path(value):
    path=Path(value)
    require(not path.is_absolute() and '..' not in path.parts and path.parts and path.parts[0]=='reports','Recovery artifacts must be repository-relative reports files')
    require(path.resolve().is_relative_to(Path.cwd().resolve()/'reports'),'Artifact symlink leaves reports')
    return path

def capture_artifacts(paths):
    artifacts=[]
    for value in paths:
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

def finish(intake_path,completion_path,store,owner):
    packet,completion=read(intake_path),read(completion_path)
    require(completion.get('intakeSha256')==digest(intake_path),'Intake changed')
    try:
        decisions=native.validate_completion(packet,completion)
        for decision in decisions:
            if decision['status']!='pending':
                store.acknowledge_job(packet['site'],packet['runId'],owner,decision,{'runId':packet['runId'],'decision':decision,'completionSha256':digest(completion_path),'chartReviewSha256':digest(completion['chartReview'])})
        pending=sum(d['status']=='pending' for d in decisions)
        closed=store.close_job(packet['site'],packet['runId'],owner)
        require(pending or closed['complete'],'Production queue is not fully acknowledged')
    except Exception:
        # Retain the exact final decisions before making this unfinished job retryable.
        try:
            location=subprocess.check_output(['git','rev-parse','--git-path','search-gap-recovery/'+packet['runId']+'/checkpoints.json'],text=True).strip()
            history=read(location)
            metadata={k:v for k,v in history[-1].items() if k not in ('artifacts','recordedAt')}
            saved=Path('reports/search-gap/recovery')/(digest(completion_path)+'-completion.json')
            saved.parent.mkdir(parents=True,exist_ok=True);saved.write_bytes(Path(completion_path).read_bytes())
            metadata.update(stage='completion-recovery',completionFile=str(saved))
            metadata['artifacts']=capture_artifacts([str(saved),completion['chart'],completion['chartReview']])
            store.checkpoint_job(packet['site'],packet['runId'],owner,metadata)
        except Exception as checkpoint_error:
            print('Completion checkpoint unavailable: '+type(checkpoint_error).__name__,file=sys.stderr)
        try:store.release_job(packet['site'],packet['runId'],owner)
        except Exception as release_error:
            print('Lease release unconfirmed: '+type(release_error).__name__,file=sys.stderr)
        raise
    return {'ok':not pending,'status':'failure' if pending else 'success','pendingCandidates':pending,'site':packet['site'],'runId':packet['runId'],'durableJob':True}

def main():
    p=argparse.ArgumentParser();p.add_argument('command',choices=['list-gaps','checkpoint','restore','adopt','finish']);p.add_argument('--site',required=True);p.add_argument('--owner',default=os.environ.get('WORKFLOW_RUN_ID'));p.add_argument('--out');p.add_argument('--intake');p.add_argument('--completion');p.add_argument('--metadata');p.add_argument('--files',nargs='*',default=[]);p.add_argument('--checkpoint-file');p.add_argument('--days');p.add_argument('--limit');p.add_argument('--min-count');a=p.parse_args()
    store=Store()
    if a.command=='list-gaps':result=intake(a.site,store,a.out,a.owner)
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
            metadata['artifacts']=capture_artifacts(a.files);result=store.checkpoint_job(a.site,packet['runId'],a.owner,metadata)
        else:result=finish(a.intake,a.completion,store,a.owner)
    print(json.dumps(result,ensure_ascii=False));return 0 if result.get('ok',True) else 1
if __name__=='__main__':
    try:sys.exit(main())
    except Exception as error:print(json.dumps({'ok':False,'status':'failure','error':type(error).__name__+': '+str(error)}));sys.exit(1)
