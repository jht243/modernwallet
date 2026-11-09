#!/usr/bin/env python3
"""Bind a real competitor intake to its existing independent Mindmap chart.

No editorial verdict, understanding, publication or delivery proof is generated.
"""
import contextlib,io
import argparse,hashlib,importlib.util,json,os,subprocess,sys,tempfile
from pathlib import Path
REF='refs/heads/automation/competitor-handoffs'
def sha(raw):return hashlib.sha256(raw).hexdigest()
def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
def require(ok,message):
 if not ok:raise ValueError(message)
def load(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def read(path):return json.loads(Path(path).read_bytes())
def save(path,raw):
 path.parent.mkdir(parents=True,exist_ok=True)
 if path.exists():require(path.read_bytes()==raw,'Keep immutable original intake/review receipts');return
 with path.open('xb') as out:out.write(raw)
def inside(root,name):
 p=(root/name).resolve();require(root.resolve() in p.parents,'Internal repository evidence only');return p
def connection(root):
 path=root/'.claude/tools/workflow-control-store.py'
 if not path.is_file():
  require(not (root/'.claude/commands/_workflow-efficiency.md').is_file() and not os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID'),'Restore the required durable handoff backend before continuing')
  return None  # Isolated legacy/manual fixtures without an installed protocol.
 m=load('competitor_checkpoint',path);return m,m.Store(root,ref=REF)
def session(payload=None):return os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID') or (payload or {}).get('session_id')
def marker(root,sid):
 gd=subprocess.check_output(['git','rev-parse','--absolute-git-dir'],cwd=root,text=True).strip();return Path(gd)/'competitor-dispatch'/sha(sid.encode())
def point(root,path):
 sid=session()
 if sid:
  p=marker(root,sid);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(str(path.relative_to(root)))
def active(root,payload=None):
 sid=session(payload)
 if not sid:return None
 p=marker(root,sid)
 return inside(root,p.read_text()) if p.is_file() else None
def state_dir(root):return root/'reports/competitor-monitor/intakes'
def rows(data):return data['candidates']
def validate_source(path):
 raw=path.read_bytes();require(path.stem==sha(raw),'Original competitor intake changed');return read(path)
def quality_findings(root,data):
 refs=data.get('qualityFindings',[]);require(isinstance(refs,list),'Invalid source quality-finding references')
 ids=[]
 for ref in refs:
  require(isinstance(ref,dict) and str(ref.get('path','')).startswith('reports/competitor-monitor/intakes/quality-findings/') and str(ref['path']).endswith('.json'),'Quality findings must be internal non-executable source records')
  path=inside(root,ref['path']);require(sha(path.read_bytes())==ref.get('sha256'),'Original source quality finding changed')
  value=read(path);require(isinstance(value,dict),'Invalid source quality-finding record')
  findings=value.get('findings',[]);require(isinstance(findings,list) and findings,'Missing actual source quality findings')
  for finding in findings:
   require(isinstance(finding,dict),'Invalid source quality finding')
   identifier=finding.get('id');require(isinstance(identifier,str) and 0<len(identifier)<=100,'Missing stable quality-finding identity');ids.append(identifier)
 require(len(ids)==len(set(ids)),'Duplicate quality-finding identities')
 return refs,ids
def announce(root,path):
 data=validate_source(path);point(root,path)
 print('AUTOMATED MINDMAP HANDOFF REQUIRED: '+str(path.relative_to(root))+' sha256='+path.stem)
 print('Send every selected candidate, without root filtering, to the existing independent preparation/chart workflow. Complete its approved native production and record every terminal disposition. A next scheduled pass is not a production handoff.')
 print('Use unique chartPath reports/mindmap-pass/'+data['generated'][:10]+'-competitor-'+path.stem[:12]+'.md. Include the exact intake path/hash in evidenceFiles and one candidateDispositions row per original selected URL: candidate=URL, decision, reason, and target for production. Preserve the native max-items cap, site rules and real blocking/failed states.')
 refs,ids=quality_findings(root,data)
 if refs:
  print('This intake carries reported post-publication quality findings, not a new competitor publication. Independently verify '+', '.join(ids)+' from '+', '.join(ref['path'] for ref in refs)+'. Bind these exact source records in chart evidenceFiles and address each finding ID in the disposition reasons. Existing coverage alone does not resolve a material error. Preserve the original completed job/reviews and native correction budgets; never fabricate a PASS or broaden publication permissions.')
def chart_value(root,path):
 value=read(path.with_suffix('.chart.json'))
 if 'planText' in value:return value  # Earlier protocol receipt, preserved without rewriting it.
 source=inside(root,value['path']);require(sha(source.read_bytes())==value['sha256'],'Original chart proof changed')
 return read(source)
def replace_pointer(path,value):
 raw=canonical(value);path.parent.mkdir(parents=True,exist_ok=True)
 if path.is_file() and path.read_bytes()==raw:return
 with tempfile.NamedTemporaryFile(dir=path.parent,delete=False) as stream:stream.write(raw);name=stream.name
 os.replace(name,path)

def completed(root,path):
 receipt=path.with_suffix('.done.json')
 if not receipt.is_file():return False
 value=read(receipt);proof=chart_value(root,path);plan=json.loads(proof['planText']);review=json.loads(proof['reviewText'])
 validate_chart(root,path,plan,review)
 require(value.get('intake')==path.stem and value.get('manifest')==review['manifestSha256'] and value.get('review')==sha(canonical(review)),'Completed handoff evidence changed')
 return True

def pending(root):
 closed=set()
 c=connection(root)
 if c:
  m,store=c;revision,state=store.read()
  if revision:
   for digest,row in state.get('competitorIntakes',{}).items():
    require(len(digest)==64 and all(x in '0123456789abcdef' for x in digest),'Invalid durable intake hash')
    if row.get('complete'):
     closed.add(digest);continue
    p=state_dir(root)/(digest+'.json')
    if not p.exists():save(p,m.git(root,'show',revision+':artifacts/'+digest).stdout)
    validate_source(p)
    for rel,expected in row.get('support',{}).items():
     destination=inside(root,rel)
     if not destination.exists():
      artifact=m.git(root,'show',revision+':artifacts/'+expected).stdout
      require(sha(artifact)==expected,'Original chart evidence changed');save(destination,artifact)
    if row.get('chartRef') and row['chartRef']['path']!=str(p.with_suffix('.chart.json').relative_to(root)):
     reference=row['chartRef'];proof=inside(root,reference['path']);require(sha(proof.read_bytes())==reference['sha256'],'Latest immutable chart proof changed')
     replace_pointer(p.with_suffix('.chart.json'),reference)
    if row.get('chart'):save(p.with_suffix('.chart.json'),canonical(row['chart']))
 for path in sorted(state_dir(root).glob('*.json')):
  if len(path.stem)!=64 or any(x not in '0123456789abcdef' for x in path.stem):continue
  validate_source(path)
  if path.stem in closed:continue
  if not completed(root,path):return path
 return None
def ensure_registered(root,path):
 c=connection(root)
 if c:
  _,store=c;_,state=store.read()
  if path.stem in state.get('competitorIntakes',{}):return
  def add(value):
   if value.get('job') is None:value['job']={'artifacts':{}}
   value.setdefault('competitorIntakes',{}).setdefault(path.stem,{'complete':False})
  store.mutate(add,[str(path.relative_to(root))])

def resume(root,out_path):
 path=pending(root)
 if path is None:return False
 point(root,path);ensure_registered(root,path)
 data=validate_source(path);out=Path(out_path);out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(canonical(data)+b'\n');announce(root,path);return True
def freeze(root,payload,limit=10):
 require(type(limit) is int and limit>0,'Keep the explicit positive native item cap')
 if not rows(payload):return None
 ordered=sorted(rows(payload),key=lambda c:c.get('lastmod') or '',reverse=True)
 if 'total_detected' in payload and 'overflow' in payload:
  selected=list(rows(payload))  # Preserve Medical Frontier's native --cap and new/updated priority.
 elif 'priority_count' in payload:
  priority=[c for c in ordered if c.get('priority')];ordinary=[c for c in ordered if not c.get('priority')]
  selected=priority+ordinary[:max(0,limit-len(priority))]  # Orbital's existing watch-topic exception.
 else:selected=ordered[:limit]
 generated=payload.get('generated') or payload.get('generated_at') or payload.get('run_date') or payload.get('date')
 require(isinstance(generated,str) and len(generated)>=10,'Preserve the actual native harvest date')
 data={**payload,'generated':generated,'candidates':selected,'candidate_count':len(selected),'nativeItemLimit':limit,'deferredByNativeCap':len(rows(payload))-len(selected)}
 raw=canonical(data);path=state_dir(root)/(sha(raw)+'.json');save(path,raw);point(root,path)
 c=connection(root)
 if c:
  _,store=c
  def add(state):
   state.setdefault('job',None)
   if state['job'] is None:state['job']={'artifacts':{}}
   state.setdefault('competitorIntakes',{}).setdefault(path.stem,{'complete':False})
  store.mutate(add,[str(path.relative_to(root))])
 announce(root,path);return path
def validate_chart(root,path,plan,review):
 data=validate_source(path)
 require(path.stem in {r.get('sha256') for r in plan.get('evidenceFiles',[])},'Independent chart must bind the exact original competitor intake')
 expected=sorted(c['url'] for c in rows(data));decisions=plan.get('candidateDispositions',[])
 require(sorted(d.get('candidate','') for d in decisions)==expected and all(d.get('decision') and len(d.get('reason','').strip())>=20 for d in decisions),'Account for every selected original URL exactly once, with real reasons')
 refs,ids=quality_findings(root,data);evidence={(ref.get('path'),ref.get('sha256')) for ref in plan.get('evidenceFiles',[])}
 require(all((ref['path'],ref['sha256']) in evidence for ref in refs),'Bind the actual source-backed quality findings in preparation evidence')
 reasons='\n'.join(d['reason'] for d in decisions)
 require(all(identifier in reasons for identifier in ids),'Address every source-backed quality finding in the independent dispositions')
 # Called only after chart + saved_chart pass, or revalidated on resume/record.
 require(review.get('manifestSha256')==sha(canonical(plan)) and review.get('reviewer')!=plan.get('author') and review.get('verdict')=='PASS','Actual independent preparation PASS required')
 return {'intake':path.stem,'planText':json.dumps(plan,ensure_ascii=False),'reviewText':json.dumps(review,ensure_ascii=False)}
def supporting_artifacts(root,plan,proof_path):
    """Keep the current structured evidence graph; never copy a conversation or secrets."""
    found={str(proof_path.relative_to(root)):sha(proof_path.read_bytes())};seen=set()
    def visit(value,parent=None):
        if isinstance(value,dict):
            if isinstance(value.get('path'),str) and isinstance(value.get('sha256'),str):
                candidates=[(root/value['path']).resolve()]
                if parent is not None:candidates.append((parent/value['path']).resolve())
                for source in candidates:
                    if root not in source.parents or not source.is_file():continue
                    rel=str(source.relative_to(root))
                    if not rel.startswith('reports/') or sha(source.read_bytes())!=value['sha256']:continue
                    if rel in seen:break
                    seen.add(rel);found[rel]=value['sha256']
                    if source.suffix=='.json':
                        try:visit(read(source),source.parent)
                        except json.JSONDecodeError:pass
                    break
            if isinstance(value.get('directory'),str) and value.get('sha256'):
                visit({'path':value['directory']+'/manifest.json','sha256':value['sha256']},parent)
            for child in value.values():visit(child,parent)
        elif isinstance(value,list):
            for child in value:visit(child,parent)
    visit(plan)
    chart=inside(root,plan['chartPath'])
    if chart.is_file():found[str(chart.relative_to(root))]=sha(chart.read_bytes())
    return found

def after_chart(root,plan,review):
 path=active(root)
 if path is None or completed(root,path):return
 proof=validate_chart(root,path,plan,review)
 if path.with_suffix('.chart.json').is_file():
  old=json.loads(chart_value(root,path)['planText'])
  require(not old.get('jobId') or old.get('jobId')==plan.get('jobId'),'A corrected chart cannot replace the original canonical job')
  for key,value in old.get('reviewCounters',{}).items():require(plan.get('reviewCounters',{}).get(key,-1)>=value,'Keep every existing review counter across chart corrections')
 raw=canonical(proof);immutable=state_dir(root)/'proofs'/(path.stem+'-'+sha(raw)+'.json');save(immutable,raw)
 pointer={'path':str(immutable.relative_to(root)),'sha256':sha(raw)};replace_pointer(path.with_suffix('.chart.json'),pointer)
 c=connection(root)
 if c:
  _,store=c;support=supporting_artifacts(root,plan,immutable);support[str(path.with_suffix('.chart.json').relative_to(root))]=sha(path.with_suffix('.chart.json').read_bytes())
  def record(state):
   row=state['competitorIntakes'][path.stem];history=row.setdefault('chartHistory',[])
   if row.get('chartRef') and row['chartRef']!=pointer and row['chartRef'] not in history:history.append(row['chartRef'])
   row.update(chartRef=pointer,support=support)
  store.mutate(record,list(support))
def chart_proof(root,path):
 proof=chart_value(root,path);plan=json.loads(proof['planText']);review=json.loads(proof['reviewText']);gate=load('competitor_chart_gate',root/'.claude/tools/mindmap-gates.py')
 gate.chart(root,plan,review);gate.saved_chart(root,plan);validate_chart(root,path,plan,review);return {**proof,'plan':plan,'review':review}
def record(root,dispositions):
 path=active(root)
 if path is None:return
 proof=chart_proof(root,path);data=validate_source(path);expected={c['url'] for c in rows(data)};outcomes=dispositions.get('dispositions',{})
 require(set(outcomes)==expected,'Record every selected candidate. Do not silently leave an owned gap pending or consume cap-deferred candidates')
 decisions={r['candidate']:r for r in proof['plan']['candidateDispositions']};actions=proof['plan']['actions']
 for url,result in outcomes.items():
  status=result.get('disposition');require(status in ('published','enriched','skipped-duplicate','skipped-low-value','fetch-failed'),'Use actual terminal native dispositions, never arbitrary pending/success labels')
  decision=decisions[url]
  if status in ('published','enriched'):
   target=decision.get('target');require(target and any(r.get('target')==target for r in actions),'Production must match the independently approved action')
   require(result.get('our_url','').rstrip('/').endswith(target.rstrip('/')),'Record the actual approved canonical destination')
  else:require(decision['decision'].lower() in ('drop','dropped','skip','skipped','duplicate','skipped-duplicate','skipped-low-value','already-covered','no-addition'),'A dropped outcome must have an independent chart disposition')
 return path,proof

def complete(root,verified):
 if verified is None:return
 path,proof=verified;receipt={'intake':path.stem,'manifest':proof['review']['manifestSha256'],'review':sha(canonical(proof['review'])),'scope':'Terminal ledger handoff only. Native content/audit/live/reporting gates remain authoritative.'};save(path.with_suffix('.done.json'),canonical(receipt))
 c=connection(root)
 if c:
  _,store=c
  def mark(state):state['competitorIntakes'][path.stem]['complete']=True
  store.mutate(mark)
def blocked(root,evidence):
 path=active(root);require(path is not None,'No owned competitor intake')
 value=read(evidence)
 require(value.get('intakeSha256')==path.stem and value.get('status')=='blocked','Bind an honest failure to this original intake')
 require(value.get('blockingKind') in ('professional-review','exhausted-review-budget','external-service','source-freshness','authorization-hold'),'Only actual native holds/failures can stop unfinished production')
 for name in ('reason','nextAction'):require(isinstance(value.get(name),str) and len(value[name].strip())>=60,'Preserve the real blocker and exact automated next action')
 require(not any(x in value['reason'].lower() for x in ('not enough time','context window','save tokens','next scheduled pass')),'Time/context/token convenience is not a blocking gate')
 require(value.get('recoveryAttempted') is True and value.get('evidence'),'Attempt native recovery and retain concrete source/gate/failure artifacts')
 for ref in value['evidence']:
  source=inside(root,ref['path']);require(source.is_file() and sha(source.read_bytes())==ref['sha256'],'Actual blocking evidence missing or changed')
 proof={'intake':path.stem,'session':session(),'failure':value,'scope':'Recorded claimed blocker evidence only; not an editorial PASS, publication or independent proof that a command executed.'}
 save(path.with_suffix('.blocked-'+sha(session().encode())[:12]+'.json'),canonical(proof))
 c=connection(root)
 if c:
  _,store=c
  def keep(state):state['competitorIntakes'][path.stem]['blockedEvidence']=proof
  store.mutate(keep,[ref['path'] for ref in value['evidence']])
 return {'status':'blocked-work-preserved','intake':str(path.relative_to(root)),'reportStatus':'failure'}

def stop(root,payload):
 path=active(root,payload)
 if path is None or completed(root,path):return
 validate_source(path)
 sid=session(payload);hold=path.with_suffix('.blocked-'+sha(sid.encode())[:12]+'.json')
 if hold.is_file():
  proof=read(hold);require(proof['intake']==path.stem and proof['session']==sid,'Block receipt belongs to another job/session')
  for ref in proof['failure']['evidence']:
   require(sha(inside(root,ref['path']).read_bytes())==ref['sha256'],'Preserve original native blocking evidence')
  return
 print(json.dumps({'decision':'block','reason':'Complete the existing unattended competitor handoff for '+str(path.relative_to(root))+'. Keep all selected URLs, sources, canonical jobs, findings and counters. Obtain the real independent preparation chart, complete its approved native production, then scraper.py record/baseline. Do not finish as success/no-op with an unowned pending gap or substitute a worker completion for the required chart. Genuine professional/quality blocks retain exact work and must be reported honestly; never fabricate PASS or publish around a hold.'}))
def report_guard(root,payload):
 command=payload.get('tool_input',{}).get('command','')
 if '/api/routine-run' not in command:return
 # Use exactly the same canonical completion/real-hold proof as Stop. A
 # recoverable pause is not a final failure report; report once at termination.
 output=io.StringIO()
 with contextlib.redirect_stdout(output):stop(root,payload)
 if output.getvalue():
  print('Finish the pending competitor handoff before submitting its final report. A genuine unrecoverable native hold must first retain its validated blocked evidence; a running worker or time/context convenience is not a final failure.',file=sys.stderr)
  raise SystemExit(2)

def status(root):
 require(session(),'Use the actual native session identity for a status check')
 path=active(root)
 if path is None:return {'status':'no-active-intake'}
 if completed(root,path):return {'status':'complete','intakeSha256':path.stem}
 output=io.StringIO()
 with contextlib.redirect_stdout(output):stop(root,{})
 return {'status':'pending' if output.getvalue() else 'blocked','intakeSha256':path.stem}

def execute(root,main):
    """Wrap existing CLIs without changing their roster, filters or ledger formats."""
    import datetime
    root=Path(root).resolve();argv=list(sys.argv[1:]);limit=10
    if '--workflow-limit' in argv:
        i=argv.index('--workflow-limit');limit=int(argv[i+1]);del argv[i:i+2];sys.argv=[sys.argv[0],*argv]
    if not argv or argv[0] not in ('detect','record') or '--dry-run' in argv:return main()
    def argument(name,default=None):
        return argv[argv.index(name)+1] if name in argv else default
    limit=int(argument('--cap',str(limit)))
    today=argument('--today',datetime.date.today().isoformat())
    out=Path(argument('--out',str(root/'reports/competitor-monitor'/('candidates-'+today+'.json'))))
    if argv[0]=='detect':
        if resume(root,out):return 0
        # The native parser and crawler remain authoritative.
        result=main()
        if result not in (None,0):return result
        require(out.is_file(),'Native monitor output missing; preserve the actual failure, do not claim a no-op')
        payload=read(out);require(isinstance(payload.get('candidates'),list),'Unknown native monitor intake schema; preserve it for its native adapter')
        freeze(root,payload,limit);return result
    raw=read(Path(argument('--dispositions')))
    values=raw.get('dispositions',raw)
    normalized={'dispositions':{url:({'disposition':value} if isinstance(value,str) else value) for url,value in values.items()}}
    verified=record(root,normalized);result=main()
    if result in (None,0):complete(root,verified)
    return result

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('command',choices=['stop','blocked','report-guard','status']);p.add_argument('--evidence',type=Path);a=p.parse_args();root=Path(__file__).resolve().parents[2]
 try:
  if a.command=='stop':stop(root,json.load(sys.stdin))
  elif a.command=='report-guard':report_guard(root,json.load(sys.stdin))
  elif a.command=='status':print(json.dumps(status(root)))
  else:
   require(a.evidence is not None,'Record actual blocking evidence');print(json.dumps(blocked(root,a.evidence)))
 except (ValueError,OSError,KeyError) as error:
  if a.command=='stop':print(json.dumps({'decision':'block','reason':'Recover the original competitor handoff evidence: '+str(error)}))
  else:print('BLOCKED: '+str(error),file=sys.stderr);sys.exit(2 if a.command=='report-guard' else 1)
