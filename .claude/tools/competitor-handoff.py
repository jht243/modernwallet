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
 repairs=pending_reviews(root,path.stem)
 gaps=publication_gaps(root,path.stem)
 held=historical_held_routes(root,path.stem)
 unstarted=unstarted_chart_targets(root,path)
 if gaps and not repairs:
  print('RESUME ORIGINAL PUBLICATION PROOF, no discovery/chart/generation restart. Run competitor-handoff.py publication-plan --out NEW_INTERNAL_DIRECTORY/plan.json to select each actual LAST journal decision, never an earlier batch round. Capture/compare its exact live output and record-deployment. Use deployment-evidence.py --expected-commit FULL_PUBLICATION_SHA --out NEW_HOST_PROOF.json with a long Bash timeout: this reads actual build provenance without a Render key. No connector/key permission is needed. On substantive post-review drift, retain newer source bytes/diffs and restore only the exact affected reviewed route, preserving unrelated work and explicit holds. Never roll back a whole shared data file. Use only an original remaining audit slot where genuinely needed; no extra round or reset. An HTTP 200 is insufficient. '+json.dumps([{k:r[k] for k in ('route','status','remainingReviews')} for r in gaps]))
  eligible=[row['route'] for row in gaps if row['status']=='needs-fix' and row['remainingReviews']>0]
  if eligible:
   print('Complete these eligible original audit slots FIRST, before working on or reporting any held siblings: '+json.dumps(eligible)+'. MAIN must seal the current handoff and dispatch the real independent AUDIT worker on the latest source-backed candidate. A writer returning no edits is a terminal handback: send that candidate directly to AUDIT. Record the actual verdict even when a word-count or other editorial FAIL is expected. No padding, new generation credits, or owner waiver of an editorial finding is required to perform that audit. A different route reaching its ceiling or drifting is not a hold on these routes. Preserve any documented owner-approved corrections. Keep a real historical override distinct from exact reviewed publication.')
  if held:
   print('HISTORICAL HELD ROUTES (exhausted pre-capped-release FAILs): '+json.dumps(held)+'. Record their candidates with {"disposition":"held-audit-limit"} in --dispositions after completing eligible siblings; never regenerate or reset their spent counters.')
  if unstarted:
   print('ALSO COMPLETE UNSTARTED APPROVED CHART TARGETS before closing intake: '+json.dumps(unstarted)+'. After recording deployment for already-reviewed routes, finish production, independent audit, and live verification for these approved chart targets.')
  return
 if repairs:
  print('RESUME EXISTING PENDING AUDIT, even if the URL is already live or the old ledger says complete. Do not rewrite content, redo chart/discovery or reset any review counter. Restore immutable prior dependencies through the normal durable backend, capture to a new immutable output, use content-review-policy.py repair-pending only for an actually corrupt pending capture, and have a real independent reviewer complete this SAME numbered slot with its actual verdict. A reservation or unrecorded reading cannot release a changed page. First call content-review-durable.py restore for the exact canonical origin/route; keep the current content unchanged. For an overwritten capture, retain the actual auditor error report, capture the exact current page to a NEW output, call repair-pending once with the actual independent reviewer identity, then record that real reviewer result using the returned admission (not another reserve/round). Reuse the saved auditor where available. Complete exact live verification and retain the true repair/error history. '+json.dumps(repairs))
 if path.with_suffix('.chart.json').is_file():
  proof=chart_value(root,path)
  plan=json.loads(proof['planText']);review=json.loads(proof['reviewText'])
  validate_chart(root,path,plan,review)
  print('RESUME APPROVED CHART '+str(path.with_suffix('.chart.json').relative_to(root))+'. Skip harvest, source/keyword discovery, BUILD and chart review. Preserve job, findings and counters.')
  print('Use each route’s actual recorded reviews, not an archived batch-level blocker. Already-published routes with native exact-live proof retain completion and are not rewritten. An unfinished draft without an independent audit must finish its original production/review; a truly exhausted route follows the current configured capped-release policy, preserving FAIL findings. Archived instructions to grant more reviews or rewrite completed siblings are not current authorization requirements.')
  if held:
   print('HISTORICAL HELD ROUTES (exhausted pre-capped-release FAILs): '+json.dumps(held)+'. Record their candidates with {"disposition":"held-audit-limit"} in --dispositions after completing any remaining approved siblings; never regenerate or reset their spent counters.')
  if unstarted:
   print('UNSTARTED APPROVED CHART TARGETS: '+json.dumps(unstarted)+'. Complete production, independent audit, and live verification for these approved chart targets before closing the intake.')
  continuation=recovery_path(root,path)
  if continuation.exists():
   hint=read(continuation)
   print('RESUME SAVED PRODUCTION for '+path.stem+' from '+str(hint.get('workCommit') or hint.get('workBranch') or 'saved evidence')+'. Detect performs the restore. Follow its current AUTOMATIC PRODUCTION RECOVERY result. Archived blocker instructions describe the old checkout; do not dispatch WRITE to refresh a historically verified application or AUDIT to repeat a recorded decision.')
  else:print('Continue from the recorded chart and existing handoffs at the first unfinished production step.')
  return
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

def _sync_durable_journal_files(root):
 """Materialize committed review journals and open-cycle artifacts from the durable ref in fresh checkouts."""
 durable_path=root/'.claude/tools/content-review-durable.py'
 if not durable_path.is_file() or not (root/'.claude/tools/workflow-control-store.py').is_file():return
 try:
  durable=load('competitor_durable_journals',durable_path)
  conn=durable.backend(root)
  if conn is None:return
  m,store=conn;revision,state=store.read()
  if not revision:return
  site_id=read(root/'.claude/content-review-policy.json').get('siteId') if (root/'.claude/content-review-policy.json').is_file() else None
  for entry in state.get('reviewJournals',{}).values():
   if site_id and entry.get('identity',{}).get('siteId')!=site_id:continue
   head=entry.get('head');paths=entry.get('artifacts',{})
   rel=next((p for p,h in paths.items() if h==head and p.startswith('reports/content-review-journals/') and p.endswith('.jsonl')),None)
   if not rel or not head:continue
   jtarget=inside(root,rel)
   if not jtarget.is_file() or sha(jtarget.read_bytes())!=head:
    raw=m.git(root,'show',revision+':artifacts/'+head).stdout
    if sha(raw)==head:
     if not jtarget.is_file():
      jtarget.parent.mkdir(parents=True,exist_ok=True);jtarget.write_bytes(raw)
     else:
      current=jtarget.read_bytes()
      if raw.startswith(current):jtarget.write_bytes(raw)
   if not jtarget.is_file():continue
   events=[json.loads(line) for line in jtarget.read_bytes().splitlines() if line.strip()]
   begin_idx=max((i for i,e in enumerate(events) if e.get('kind')=='begin'),default=-1)
   if begin_idx<0 or any(e.get('kind')=='published' for e in events[begin_idx:]):continue
   for name,expected in paths.items():
    if name==rel:continue
    target=(root/name).resolve()
    if root.resolve() not in target.parents or not name.startswith('reports/'):continue
    if target.is_file() and sha(target.read_bytes())==expected:continue
    raw=m.git(root,'show',revision+':artifacts/'+expected).stdout
    if sha(raw)!=expected:continue
    if target.exists():durable.cache(root,name,expected,raw)
    else:target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
 except Exception:
  return

def pending_reviews(root,digest=None):
 """Actual reserved-but-unrecorded slots for this retained canonical intake."""
 if not (root/'.claude/content-review-policy.json').is_file():return []
 _sync_durable_journal_files(root)
 result=[]
 for path in (root/'reports/content-review-journals').glob('*.jsonl'):
  events=[json.loads(line) for line in path.read_bytes().splitlines() if line.strip()]
  if not events:continue
  job=None;pending={}
  for event in events:
   data=event['data']
   if event['kind']=='begin':job=data.get('jobId');pending={}
   elif event['kind']=='reserve':pending[data['number']]=data
   elif event['kind']=='record':pending.pop(data['number'],None)
  if pending and isinstance(job,str) and (digest is None or digest[:12] in job):
   policy=load('pending_native_review_policy',root/'.claude/tools/content-review-policy.py');identity=events[0]['identity']
   with policy.Journal(root,identity['canonicalBase'],identity['route']) as journal:
    if journal.cycle and policy.last_authoritative_round(journal.cycle).get('status')=='pending':
     result.append({'route':identity['route'],'jobId':job,'round':journal.cycle['rounds'][-1]['number'],'admission':journal.cycle['rounds'][-1]['admission']})
 return result

def _is_historical_held_fail(root,policy,row):
 """True only for exhausted pre-capped-release FAIL cycles recorded without capped-release pass_evidence."""
 if row.get('status')!='needs-fix' or row.get('remainingReviews',1)!=0:return False
 if not row.get('admission') or not row.get('report'):return False
 try:
  admission=read(policy.artifact(root,row['admission']))
  snapshot=read(policy.artifact(root,admission['snapshot']))
  review=read(policy.artifact(root,row['report']))
  rr=next((r for r in review.get('routes',[]) if r.get('path','').rstrip('/')==row['route'].rstrip('/')),None)
  if rr is None or rr.get('verdict')!='FAIL':return False
  if not policy.capped_release(root,snapshot):return True
  selected=policy.decision(root,snapshot,review,rr)
  policy.pass_evidence(root,snapshot,rr,selected,policy.local_module(root,snapshot),retain_fail=True)
  return False
 except ValueError:
  return True

def _raw_cycle_rows(root,digest=None):
 if not (root/'.claude/content-review-policy.json').is_file():return []
 _sync_durable_journal_files(root)
 policy=None;rows_out=[]
 for path in (root/'reports/content-review-journals').glob('*.jsonl'):
  events=[json.loads(line) for line in path.read_bytes().splitlines() if line.strip()]
  if not events:continue
  index=max((i for i,e in enumerate(events) if e['kind']=='begin'),default=-1)
  if index<0:continue
  job=events[index]['data'].get('jobId','')
  if not isinstance(job,str) or (digest is not None and digest[:12] not in job):continue
  if any(e['kind']=='published' for e in events[index:]):continue
  if policy is None:policy=load('publication_native_review_policy',root/'.claude/tools/content-review-policy.py')
  identity=events[0]['identity']
  with policy.Journal(root,identity['canonicalBase'],identity['route']) as journal:
   if journal.cycle and journal.cycle['status']!='published':
    rounds=journal.cycle['rounds'];last=policy.last_authoritative_round(journal.cycle)
    row={'route':identity['route'],'jobId':job,'status':journal.cycle['status'],'round':last.get('number'),'report':last.get('report'),'admission':last.get('admission'),'remainingReviews':max(0,journal.cycle.get('maximumRounds',policy.audit_limit(policy.policy(root),journal.cycle['profile']))-len(rounds))}
    rows_out.append((policy,row))
 return rows_out

def historical_held_routes(root,digest):
 return sorted(row['route'] for policy,row in _raw_cycle_rows(root,digest) if _is_historical_held_fail(root,policy,row))

def unstarted_chart_targets(root,path):
 if not (root/'.claude/content-review-policy.json').is_file() or not path.with_suffix('.chart.json').is_file():return []
 try:
  plan=json.loads(chart_value(root,path)['planText'])
 except Exception:
  return []
 targets=[r.get('target') for r in plan.get('actions',[]) if r.get('bucket') in {'create new content','update existing body text'} and isinstance(r.get('target'),str)]
 if not targets:return []
 _sync_durable_journal_files(root)
 seen=set()
 for jpath in (root/'reports/content-review-journals').glob('*.jsonl'):
  events=[json.loads(line) for line in jpath.read_bytes().splitlines() if line.strip()]
  if not events:continue
  route=events[0].get('identity',{}).get('route','')
  for e in events:
   if e.get('kind')=='begin' and path.stem[:12] in str(e.get('data',{}).get('jobId','')):
    seen.add(route.rstrip('/') or '/')
 return [t for t in targets if (t.rstrip('/') or '/') not in seen]

def publication_gaps(root,digest=None):
 """Real reviewed routes still lack the native exact-live deployment receipt."""
 result=[]
 for policy,row in _raw_cycle_rows(root,digest):
  if _is_historical_held_fail(root,policy,row):continue
  result.append({'jobId':row['jobId']} if digest is None else row)
 return result


def publication_plan(root,out):
 path=active(root);require(path is not None,'Resume the actual native intake before selecting its publication evidence')
 policy=load('competitor_publication_policy',root/'.claude/tools/content-review-policy.py')
 result={'intake':path.stem,'scope':'Actual latest independent records only; no new review or verdict.','routes':[]}
 for row in publication_gaps(root,path.stem):
  item=dict(row)
  if row['status']=='pending':item['next']='finish-original-pending-slot'
  elif row['status']!='passed' and row['remainingReviews']>0:item['next']='complete-original-remaining-review-with-current-AUDIT-preflight'
  else:
   admission=read(policy.artifact(root,row['admission']));snapshot=policy.artifact(root,admission['snapshot']);review=policy.artifact(root,row['report'])
   key=sha(canonical({'route':row['route'],'admission':row['admission'],'report':row['report']}))[:20]
   matches=[route['path'] for route in read(snapshot)['routes'] if route['path'].rstrip('/')==row['route'].rstrip('/')]
   require(len(matches)==1,'Route must uniquely match the admitted snapshot: '+row['route'])
   projected=policy.project(root,snapshot,review,matches,out.parent/(key+'-approved.json'),out.parent/(key+'-review.json'))
   item.update(next='exact-live-compare-and-record-deployment',**projected)
  result['routes'].append(item)
 save(out,canonical(result));return result


def publication_guard(root,payload):
 command=payload.get('tool_input',{}).get('command','')
 import re
 if not re.search(r'(?:^|[;&|\n])\s*(?:\S*deploy-run-to-main\.sh\s+push|git\s+(?:-\S+\s+)*push\b)',command):return
 if re.search(r'(?:HEAD:|refs/heads/)(?:claude|automation)/',command) and not re.search(r':(?:refs/heads/)?(?:main|master)\b',command):return
 path=active(root,payload)
 if path is None:return
 pending=pending_reviews(root,path.stem)
 if pending:
  print('A reserved audit is not a completed audit. Preserve the exact latest candidate, reuse the actual auditor and finish its existing slot. If its snapshot was overwritten, use content-review-policy.py repair-pending with the real failure handback and a new immutable capture; never release on an older FAIL or buy another round. '+json.dumps(pending),file=sys.stderr)
  raise SystemExit(2)


def completed(root,path):
 receipt=path.with_suffix('.done.json')
 if not receipt.is_file():return False
 value=read(receipt);proof=chart_value(root,path);plan=json.loads(proof['planText']);review=json.loads(proof['reviewText'])
 validate_chart(root,path,plan,review)
 require(value.get('intake')==path.stem and value.get('manifest')==review['manifestSha256'] and value.get('review')==sha(canonical(review)),'Completed handoff evidence changed')
 return not pending_reviews(root,path.stem) and not publication_gaps(root,path.stem)

def recovery_path(root,path):
 # A private checkout hint, never a new candidate, review or completion receipt.
 return marker(root,'recovery-'+path.stem).with_suffix('.json')


def remember_work_branch(root,path,row):
 blocked=row.get('blockedEvidence')
 if not blocked:return
 require(blocked['intake']==path.stem,'Recovery evidence belongs to another intake')
 hint={'intake':path.stem,'priorSession':blocked['session'],'nextAction':blocked['failure']['nextAction'],
       'evidence':blocked['failure']['evidence']}
 branch=row.get('workBranch')
 if branch:hint['workBranch']=branch
 if row.get('workCommit'):hint['workCommit']=row['workCommit']
 target=recovery_path(root,path);target.parent.mkdir(parents=True,exist_ok=True)
 replace_pointer(target,hint)


def register_recovery(root,path,branch,commit):
 """Pin an existing remote worker commit only if it contains this exact blocked intake and chart."""
 import re
 require(re.fullmatch(r'claude/[A-Za-z0-9._/-]+',branch) and re.fullmatch(r'[0-9a-f]{40}',commit),'Use a real cloud work branch and full commit')
 m,store=connection(root)
 m.git(root,'check-ref-format','refs/heads/'+branch)
 tip=m.git(root,'ls-remote','--exit-code','origin','refs/heads/'+branch).stdout.split()[0].decode()
 m.git(root,'fetch','--quiet','--no-tags','--no-write-fetch-head','origin',tip)
 m.git(root,'merge-base','--is-ancestor',commit,tip)
 def register(state):
  row=state['competitorIntakes'][path.stem];failure=row['blockedEvidence']
  require(not row.get('complete') and failure['intake']==path.stem,'Only an unfinished matching intake may resume')
  refs=[{'path':str(path.relative_to(root)),'sha256':path.stem},row['chartRef'],*failure['failure']['evidence']]
  for ref in refs:
   require(sha(m.git(root,'show',commit+':'+ref['path']).stdout)==ref['sha256'],'Recovery commit lacks the exact saved work')
  row.update(workBranch=branch,workCommit=commit)
 store.mutate(register)


def pending(root):
 closed=set();open_jobs=[row['jobId'] for row in pending_reviews(root)+publication_gaps(root)]
 c=connection(root)
 if c:
  m,store=c;revision,state=store.read()
  if revision:
   for digest,row in state.get('competitorIntakes',{}).items():
    require(len(digest)==64 and all(x in '0123456789abcdef' for x in digest),'Invalid durable intake hash')
    if row.get('complete') and not any(digest[:12] in job for job in open_jobs):
     closed.add(digest);continue
    p=state_dir(root)/(digest+'.json')
    if not p.exists():save(p,m.git(root,'show',revision+':artifacts/'+digest).stdout)
    validate_source(p)
    remember_work_branch(root,p,row)
    support=dict(row.get('support',{}))
    if row.get('baselineObservation'):
     ref=row['baselineObservation'];support[ref['path']]=ref['sha256']
    for rel,expected in support.items():
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
 data=validate_source(path);out=Path(out_path);out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(canonical(data)+b'\n');announce(root,path)
 continuation=recovery_path(root,path)
 if path.with_suffix('.chart.json').is_file() and continuation.exists() and not pending_reviews(root,path.stem) and not publication_gaps(root,path.stem):
  hint=read(continuation)
  if hint.get('workBranch'):
   require(hint['intake']==path.stem,'Recovery checkpoint belongs to a different intake')
   module=load('competitor_saved_work',Path(__file__).with_name('competitor-recover-work.py'))
   result=module.restore(root,path,hint)
   if result.get('release'):
    release_path=marker(root,'release-'+str(session())+path.stem).with_suffix('.json')
    release_path.parent.mkdir(parents=True,exist_ok=True);replace_pointer(release_path,result['release'])
   print('AUTOMATIC PRODUCTION RECOVERY: '+json.dumps(result))
   print('Dispatch only PUBLISH when release.phase=publish. Rebuild the indexes and start the current preview first, then use competitor-handoff.py verify-preview --base-url http://127.0.0.1:PORT. The helper captures once and retains only material differences. Do not capture a second 33 MB approval bundle or send the already recorded batch through WRITE or AUDIT again.')
 return True
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
   row=state.setdefault('competitorIntakes',{}).setdefault(path.stem,{'complete':False})
   if data.get('baselineObservation'):row['baselineObservation']=data['baselineObservation']
  artifacts=[str(path.relative_to(root))]
  if data.get('baselineObservation'):
   ref=data['baselineObservation'];require(ref['path']=='reports/competitor-monitor/harvests/'+ref['sha256']+'.json' and sha(inside(root,ref['path']).read_bytes())==ref['sha256'],'Invalid original sitemap observation');artifacts.append(ref['path'])
  store.mutate(add,artifacts)
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
def _is_legacy_recorded_chart(root,path,plan):
 """True only when re-reading an already-signed .chart.json proof recorded before presentation/request existed."""
 if not path.with_suffix('.chart.json').is_file():return False
 substantive=[r for r in plan.get('actions',[]) if r.get('bucket') in {'create new content','update existing body text'}]
 if not substantive:return False
 return any('presentation' not in r for r in substantive) or 'request' not in plan

def chart_proof(root,path):
 proof=chart_value(root,path);plan=json.loads(proof['planText']);review=json.loads(proof['reviewText']);gate=load('competitor_chart_gate',root/'.claude/tools/mindmap-gates.py')
 if _is_legacy_recorded_chart(root,path,plan):
  gate.independent(review,plan.get('author'),'manifestSha256',sha(canonical(plan)))
 else:
  gate.chart(root,plan,review);gate.saved_chart(root,plan)
 validate_chart(root,path,plan,review);return {**proof,'plan':plan,'review':review}
def record(root,dispositions):
 path=active(root)
 if path is None:return
 require(not pending_reviews(root,path.stem),'Finish the actual pending independent audit before closing production; a reserved slot is not a verdict')
 require(not publication_gaps(root,path.stem),'Finish native exact rendered-live comparison and rendered-audit.py record-deployment for each actual saved reviewed route before closing production. Reuse genuine verdicts; no new writing or editorial review.')
 proof=chart_proof(root,path);data=validate_source(path);expected={c['url'] for c in rows(data)};outcomes=dispositions.get('dispositions',{})
 require(set(outcomes)==expected,'Record every selected candidate. Do not silently leave an owned gap pending or consume cap-deferred candidates')
 decisions={r['candidate']:r for r in proof['plan']['candidateDispositions']};actions=proof['plan']['actions']
 for url,result in outcomes.items():
  status=result.get('disposition');require(status in ('published','enriched','held-audit-limit','skipped-duplicate','skipped-low-value','skipped-off-niche','skipped-news-event','fetch-failed'),'Use actual terminal native dispositions, never arbitrary pending/success labels')
  decision=decisions[url]
  if status in ('published','enriched'):
   target=decision.get('target');require(target and any(r.get('target')==target for r in actions),'Production must match the independently approved action')
   require(result.get('our_url','').rstrip('/').endswith(target.rstrip('/')),'Record the actual approved canonical destination')
  elif status=='held-audit-limit':
   target=decision.get('target');require(target and any(r.get('target')==target for r in actions),'Held audit-limit outcome must match an independently approved action')
   held_routes={r.rstrip('/') or '/' for r in historical_held_routes(root,path.stem)}
   require((target.rstrip('/') or '/') in held_routes,'held-audit-limit requires a genuine pre-capped-release exhausted FAIL cycle for that target')
  else:require(decision['decision'].lower() in ('drop','dropped','skip','skipped','duplicate','skipped-duplicate','skipped-low-value','skipped-off-niche','skipped-news-event','off-niche','news-event','already-covered','no-addition'),'A dropped outcome must have an independent chart disposition')
 return path,proof

def complete(root,verified):
 if verified is None:return
 require(not pending_reviews(root,verified[0].stem),'Complete the existing pending audit before closing production')
 require(not publication_gaps(root,verified[0].stem),'Exact rendered-live verification and native record-deployment are still missing; an HTTP 200 is insufficient.')
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
 config=root/'.claude/content-review-policy.json'
 require(not (value.get('blockingKind')=='exhausted-review-budget' and config.is_file() and read(config).get('releaseAtAuditLimit') is True),'An editorial audit limit uses the configured automatic release; finish missing original reviews and publish eligible exact candidates, without a new allowance or reset')
 reason=(value.get('reason','')+' '+value.get('nextAction','')).lower()
 if value.get('blockingKind')=='authorization-hold' and any(word in reason for word in ('word floor','word-count','word count','1,200','1200','under-length','generation budget')):
  unfinished=[r for r in publication_gaps(root,path.stem) if r['status']=='needs-fix' and r['remainingReviews']>0]
  require(not unfinished or value.get('explicitOwnerHoldEvidence') in [ref for ref in value.get('evidence',[]) if isinstance(ref,dict)],'Word count, a spent writing allowance, or an expected editorial FAIL cannot authorize skipping an original independent audit. Audit the actual retained candidate now, preserve its findings and use the configured ceiling. Only an explicit independent owner hold, identified by its actual evidence reference, can supersede this.')
 for name in ('reason','nextAction'):require(isinstance(value.get(name),str) and len(value[name].strip())>=60,'Preserve the real blocker and exact automated next action')
 require(not any(x in value['reason'].lower() for x in ('not enough time','context window','save tokens','next scheduled pass')),'Time/context/token convenience is not a blocking gate')
 require(value.get('recoveryAttempted') is True and value.get('evidence'),'Attempt native recovery and retain concrete source/gate/failure artifacts')
 for ref in value['evidence']:
  source=inside(root,ref['path']);require(source.is_file() and sha(source.read_bytes())==ref['sha256'],'Actual blocking evidence missing or changed')
 proof={'intake':path.stem,'session':session(),'failure':value,'scope':'Recorded claimed blocker evidence only; not an editorial PASS, publication or independent proof that a command executed.'}
 failure_path=path.with_suffix('.blocked-'+sha(session().encode())[:12]+'-'+sha(canonical(proof))[:12]+'.json')
 save(failure_path,canonical(proof))
 replace_pointer(path.with_suffix('.blocked-'+sha(session().encode())[:12]+'.json'),proof)
 c=connection(root)
 if c:
  _,store=c
  module=load('competitor_saved_work',Path(__file__).with_name('competitor-recover-work.py'))
  saved=module.checkpoint(root,path,value)
  branch=subprocess.run(['git','branch','--show-current'],cwd=root,capture_output=True,text=True).stdout.strip()
  def keep(state):
   row=state['competitorIntakes'][path.stem]
   row['blockedEvidence']=proof
   if saved:
    row.update(saved)
   elif branch.startswith('claude/'):
    row['workBranch']=branch
    row.pop('workCommit',None)  # This new checkpoint can precede its branch push.
  store.mutate(keep,[ref['path'] for ref in value['evidence']])
 return {'status':'blocked-work-preserved','intake':str(path.relative_to(root)),'reportStatus':'failure'}

def release_state(root,payload=None):
 sid=session(payload)
 if not sid:return None,None
 path=active(root,payload)
 if path is None:return None,None
 target=marker(root,'release-'+str(sid)+path.stem).with_suffix('.json')
 return (target,read(target)) if target.is_file() else (None,None)


def guard_recovered_stage(root,payload):
 """After exact recorded recovery, only the publisher is needed until the render actually changes."""
 if payload.get('agent_id'):return
 _,release=release_state(root,payload)
 if not release or release.get('changedRoutes'):return
 value=payload.get('tool_input',{})
 role=value.get('subagent_type','').lower()
 description=value.get('description','').lower()
 if role.endswith('publish') or 'publish' in description or 'deploy' in description:return
 raise ValueError('Recovered job '+release['jobId']+' has recorded independent decisions. Only dispatch PUBLISH using '+str(release.get('publishHandoff',release['review'])['path'])+'. No BUILD, WRITE refresh, or repeat AUDIT. If preview differs, capture it then run competitor-handoff.py compare-preview --snapshot PATH.')


def compare_preview(root,snapshot_path):
 target,release=release_state(root)
 require(release is not None,'No recorded competitor release in this invocation')
 policy=load('competitor_policy',root/'.claude/tools/content-review-policy.py')
 renderer=policy.renderer_module()
 earlier=read(policy.artifact(root,release['approvedSnapshot']));current=read(snapshot_path)
 renderer.valid_snapshot(current)
 require(earlier['manifest']==current['manifest'],'Compare the same complete release manifest')
 old={r['path']:r['fingerprint'] for r in earlier['routes']}
 changed=[r['path'] for r in current['routes'] if old[r['path']]!=r['fingerprint']]
 release.update(changedRoutes=changed,currentPreview=policy.reference(root,snapshot_path))
 replace_pointer(target,release)
 return {'changedRoutes':changed,'next':'Review only changed routes' if changed else 'Publish the exact reviewed candidate'}


def verify_preview(root,base):
 import shutil
 from urllib.parse import urlsplit
 require(urlsplit(base).hostname in {'127.0.0.1','localhost','::1'},'Use the running local preview')
 target,release=release_state(root);require(release is not None,'No recovered release')
 policy=load('preview_policy',root/'.claude/tools/content-review-policy.py')
 renderer=policy.renderer_module()
 approved=read(policy.artifact(root,release['approvedSnapshot']));review=read(policy.artifact(root,release['review']))
 parent=root/'reports/competitor-monitor/previews';parent.mkdir(parents=True,exist_ok=True)
 directory=Path(tempfile.mkdtemp(prefix='verify-',dir=parent));shot=directory/'capture.json'
 current=renderer.capture(approved['manifest'],base,str(shot.relative_to(root)),comparison_only=True)
 renderer.valid_snapshot(current)
 expected={r['path']:r['fingerprint'] for r in approved['routes']}
 changed=[r['path'] for r in current['routes'] if r['fingerprint']!=expected[r['path']]]
 if changed:
  # Promote this very capture for the affected reviewer. Preserve all original HTML bytes.
  renderer.attach_review_evidence(current,shot.with_suffix(''))
  current['snapshotSha256']=renderer.digest({k:v for k,v in current.items() if k!='snapshotSha256'})
  renderer.save(shot,current)
  return {**compare_preview(root,shot),'snapshot':str(shot.relative_to(root))}
 renderer.compare(approved,current,review,require_live=False)
 release.update(changedRoutes=[],verifiedPreview={'capturedAt':current['capturedAt'],'fingerprints':expected})
 replace_pointer(target,release);shutil.rmtree(directory)
 return {'changedRoutes':[],'verified':len(expected),'next':'Publish the exact reviewed candidate'}


def worker_wait_api():return load('workflow_native_wait',Path(__file__).with_name('native-worker-wait.py'))
def worker_tag(path):return worker_wait_api().worker_tag()  # Compatibility for intake-bound callers.
def bind_worker(root,payload):return worker_wait_api().bind(payload)
def waiting_for_owned_worker(path,payload):
 if payload.get('hook_event_name')!='Stop' or not Path(__file__).with_name('native-worker-wait.py').is_file():return False
 return worker_wait_api().running(payload)
def stop(root,payload):
 if payload.get('hook_event_name') == 'Stop' and payload.get('stop_hook_active') is True:
  return  # The first reminder already fired. Report guards still enforce completion.
 path=active(root,payload)
 if path is None or completed(root,path):return
 validate_source(path)
 sid=session(payload);hold=path.with_suffix('.blocked-'+sha(sid.encode())[:12]+'.json')
 if hold.is_file():
  proof=read(hold);require(proof['intake']==path.stem and proof['session']==sid,'Block receipt belongs to another job/session')
  for ref in proof['failure']['evidence']:
   require(sha(inside(root,ref['path']).read_bytes())==ref['sha256'],'Preserve original native blocking evidence')
  return
 if waiting_for_owned_worker(path,payload):return
 print(json.dumps({'decision':'block','reason':'Complete the existing unattended competitor handoff for '+str(path.relative_to(root))+'. Keep all selected URLs, sources, canonical jobs, findings and counters. Obtain the real independent preparation chart, complete its approved native production, then scraper.py record/baseline. Join the actual worker terminal handback; do not repeatedly end the turn or poll notifications/list agents while waiting. An owned running background worker may pause the parent until its native completion wakeup, but cannot authorize final reporting, publication or an editorial PASS. Do not finish as success/no-op with an unowned pending gap or substitute a worker completion for the required chart. Genuine professional/quality blocks retain exact work and must be reported honestly; never fabricate PASS or publish around a hold.'}))
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
    if not argument('--dispositions'):return main()
    intake=active(root)
    if intake is not None and completed(root,intake):
        print('Already recorded this exact selected intake; preserve the original terminal dispositions.')
        return 0
    raw=read(Path(argument('--dispositions')))
    values=raw.get('dispositions',raw)
    normalized={'dispositions':{url:({'disposition':value} if isinstance(value,str) else value) for url,value in values.items()}}
    verified=record(root,normalized)
    ledger_helper=Path(__file__).with_name('competitor-ledger.py')
    if ledger_helper.is_file():
        native=load('native_competitor_ledger',ledger_helper)
        result=native.record(root,validate_source(active(root)),normalized['dispositions'],main.__globals__)
    else:
        result=main()
    if result in (None,0):complete(root,verified)
    return result

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('command',choices=['stop','blocked','report-guard','publication-guard','publication-plan','status','bind-worker','register-recovery','recover-work','compare-preview','verify-preview']);p.add_argument('--out',type=Path);p.add_argument('--evidence',type=Path);p.add_argument('--base-url');p.add_argument('--snapshot',type=Path);p.add_argument('--branch');p.add_argument('--commit');p.add_argument('--intake',type=Path);a=p.parse_args();root=Path(__file__).resolve().parents[2]
 try:
  if a.command=='verify-preview':print(json.dumps(verify_preview(root,a.base_url)))
  elif a.command=='compare-preview':print(json.dumps(compare_preview(root,inside(root,a.snapshot))))
  elif a.command=='recover-work':
   path=active(root);require(path is not None,'Detect/resume the original intake first')
   hint=read(recovery_path(root,path));require(hint['intake']==path.stem,'Work checkpoint belongs to a different intake')
   module=load('native_competitor_recovery',Path(__file__).with_name('competitor-recover-work.py'));print(json.dumps(module.restore(root,path,hint)))
  elif a.command=='register-recovery':register_recovery(root,inside(root,a.intake),a.branch,a.commit)
  elif a.command=='stop':stop(root,json.load(sys.stdin))
  elif a.command=='report-guard':report_guard(root,json.load(sys.stdin))
  elif a.command=='publication-guard':publication_guard(root,json.load(sys.stdin))
  elif a.command=='publication-plan':
   require(a.out is not None,'Use --out NEW_INTERNAL_PLAN.json');print(json.dumps(publication_plan(root,inside(root,str(a.out)))))
  elif a.command=='bind-worker':bind_worker(root,json.load(sys.stdin))
  elif a.command=='status':print(json.dumps(status(root)))
  else:
   require(a.evidence is not None,'Record actual blocking evidence');print(json.dumps(blocked(root,a.evidence)))
 except (ValueError,OSError,KeyError) as error:
  if a.command=='verify-preview':print(json.dumps(verify_preview(root,a.base_url)))
  elif a.command=='compare-preview':print(json.dumps(compare_preview(root,inside(root,a.snapshot))))
  elif a.command=='recover-work':
   path=active(root);require(path is not None,'Detect/resume the original intake first')
   hint=read(recovery_path(root,path));require(hint['intake']==path.stem,'Work checkpoint belongs to a different intake')
   module=load('native_competitor_recovery',Path(__file__).with_name('competitor-recover-work.py'));print(json.dumps(module.restore(root,path,hint)))
  elif a.command=='register-recovery':register_recovery(root,inside(root,a.intake),a.branch,a.commit)
  elif a.command=='stop':print(json.dumps({'decision':'block','reason':'Recover the original competitor handoff evidence: '+str(error)}))
  else:print('BLOCKED: '+str(error),file=sys.stderr);sys.exit(2 if a.command in ('report-guard','bind-worker') else 1)
