"""Retain actual review journals and dependencies across disposable checkouts.

This stores existing evidence only; it never creates a verdict or a review round.
"""
from pathlib import Path
import importlib.util,json,os,subprocess,hashlib,tempfile
REF='refs/heads/automation/content-review-journals'
def sha(raw):return hashlib.sha256(raw).hexdigest()
def require(ok,message):
 if not ok:raise ValueError(message)
def cache_path(root,name,expected):
 require(len(expected)==64 and all(c in '0123456789abcdef' for c in expected),'Invalid archived evidence hash')
 path=(root/'reports/content-review-evidence'/(expected+Path(name).suffix)).resolve()
 require(root.resolve() in path.parents and 'public' not in path.relative_to(root.resolve()).parts,'Archive must remain internal to the repository')
 return path
def cache(root,name,expected,raw):
 require(sha(raw)==expected,'Archived evidence changed')
 path=cache_path(root,name,expected);path.parent.mkdir(parents=True,exist_ok=True)
 if path.exists():require(path.read_bytes()==raw,'Immutable review archive changed')
 else:
  with tempfile.NamedTemporaryFile(dir=path.parent,delete=False) as stream:stream.write(raw);temporary=Path(stream.name)
  try:
   try:os.link(temporary,path)
   except FileExistsError:require(path.read_bytes()==raw,'Immutable review archive changed')
  finally:temporary.unlink()
 return path

def backend(root):
 path=root/'.claude/tools/workflow-control-store.py'
 cloud=bool(os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID'))
 origin=subprocess.run(['git','remote','get-url','origin'],cwd=root,capture_output=True)
 if origin.returncode:
  require(not cloud,'Restore the cloud review checkpoint origin before reserving another audit');return None
 require(path.is_file(),'Restore the existing durable review backend before reserving another audit')
 spec=importlib.util.spec_from_file_location('durable_review_store',path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 return m,m.Store(root,ref=REF)
def _job_matches_search_gap_row(old_job_id,row):
 run_id=str(row.get('run_id') or '')
 if old_job_id==run_id:return True
 recorded={v for cp in (row.get('checkpoints') or []) if isinstance(cp,dict)
           for v in (cp.get('canonicalJobs') or {}).values() if isinstance(v,str)}
 if old_job_id in recorded:return True
 if old_job_id.startswith(('search-gap-','sg-')) or 'search-gap' in old_job_id.lower():
  if len(run_id)>=8 and run_id[:8] in old_job_id:return True
  try:cids=[str(c.get('id') or '') for c in (json.loads(row.get('packet_text') or '{}').get('candidates') or [])]
  except Exception:cids=[]
  if any(len(cid)>=12 and cid[:12] in old_job_id for cid in cids):return True
 return False

def _search_gap_job_closed_for_restart(root,journal,old_job_id):
 import re,urllib.parse,urllib.request
 url=os.environ.get('SUPABASE_URL','').strip().rstrip('/')
 svc_key=os.environ.get('SUPABASE_SERVICE_ROLE_KEY','').strip()
 if not url or not svc_key:
  for env_name in ('.env','.env.local'):
   env_p=root/env_name
   if not env_p.is_file():continue
   try:
    for ln in env_p.read_text(errors='ignore').splitlines():
     if '=' not in ln or ln.lstrip().startswith('#'):continue
     k,v=ln.split('=',1);k=k.strip().removeprefix('export ').strip();v=v.strip().strip('"').strip("'")
     if k in ('SUPABASE_URL','VITE_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_URL') and not url:url=v.rstrip('/')
     elif k=='SUPABASE_SERVICE_ROLE_KEY' and not svc_key:svc_key=v
   except Exception:pass
 if not url or not svc_key or not isinstance(old_job_id,str) or not old_job_id:return False
 raw=[os.environ.get('SEARCH_SITE',''),urllib.parse.urlsplit(journal.base).hostname or '']
 cfg=root/'.claude/content-review-policy.json'
 if cfg.is_file():
  try:raw.extend(json.loads(cfg.read_text()).get('canonicalHosts') or [])
  except Exception:pass
 leases_dir=root/'.git/search-gap-recovery/leases'
 if leases_dir.is_dir():
  for lf in leases_dir.glob('*.json'):
   try:raw.append(str(json.loads(lf.read_text()).get('site') or ''))
   except Exception:pass
 sites=sorted({s.strip().lower().removeprefix('www.').rstrip('.') for s in raw if isinstance(s,str) and s.strip() and re.fullmatch(r'[a-z0-9.-]+\.[a-z]{2,}',s.strip().lower().removeprefix('www.').rstrip('.'))})
 if not sites:return False
 params=urllib.parse.urlencode({'site':'in.('+','.join(sites)+')','status':'in.(active,complete,owner-closed,parked)','select':'site,run_id,status,checkpoints,parked,packet_text,created_at','order':'created_at.desc','limit':'200'})
 req=urllib.request.Request(url+'/rest/v1/search_gap_jobs?'+params,headers={'apikey':svc_key,'Authorization':'Bearer '+svc_key})
 try:
  with urllib.request.urlopen(req,timeout=15) as resp:rows=json.loads(resp.read() or b'[]')
 except Exception:return False
 if not isinstance(rows,list):return False
 norm_route=journal.route.rstrip('/') or '/'
 closed_match=False
 for row in rows:
  if not isinstance(row,dict) or not _job_matches_search_gap_row(old_job_id,row):continue
  st=row.get('status')
  if st in ('active','complete'):return False
  pub_paths={str(p).rstrip('/') or '/' for paths in ((row.get('parked') or {}).get('published') or {}).values() for p in (paths or []) if isinstance(p,str)}
  if norm_route in pub_paths:return False
  if st in ('owner-closed','parked'):closed_match=True
 return closed_match

def _maybe_retire_closed_search_gap_cycle(root,journal,module,store,revision,entry):
 head=entry.get('head')
 if not head:return None
 rel=str(journal.path.relative_to(root))
 raw_journal=module.git(root,'show',revision+':artifacts/'+head).stdout
 require(sha(raw_journal)==head,'Durable review artifact changed')
 lines=[ln for ln in raw_journal.splitlines(keepends=True) if ln.strip()]
 events=[json.loads(ln) for ln in lines]
 last_begin=max((i for i,e in enumerate(events) if e.get('kind')=='begin'),default=-1)
 if last_begin<0:return None
 active_events=events[last_begin:]
 if any(e.get('kind')=='published' for e in active_events):return None
 old_job_id=str((active_events[0].get('data') or {}).get('jobId') or '').strip()
 if not old_job_id or not _search_gap_job_closed_for_restart(root,journal,old_job_id):return None
 kept_raw=b''.join(lines[:last_begin])
 committed=subprocess.run(['git','show','HEAD:'+rel],cwd=root,capture_output=True)
 if committed.returncode==0 and not kept_raw.startswith(committed.stdout):return None
 if last_begin==0:
  def retire_empty(st):
   st.setdefault('job',{'artifacts':{}})
   if st['job'] is None:st['job']={'artifacts':{}}
   cur=(st.get('reviewJournals') or {}).get(journal.key)
   if cur and cur.get('head')==head:
    st.setdefault('retiredSearchGapJournals',{})[journal.key+':'+head]=cur
    st['reviewJournals'].pop(journal.key,None)
  store.mutate(retire_empty,[])
  if journal.path.is_file() and sha(journal.path.read_bytes())==head:
   journal.path.unlink()
   if journal.anchor.is_file():journal.anchor.unlink()
  return {'module':module,'store':store,'expectedHead':None,'key':journal.key}
 kept_head=sha(kept_raw)
 journal.path.parent.mkdir(parents=True,exist_ok=True);journal.path.write_bytes(kept_raw)
 journal.anchor.write_text(events[last_begin-1]['eventSha256']+'\n');journal.anchor.chmod(0o600)
 saved=cache(root,rel,kept_head,kept_raw);saved_rel=str(saved.relative_to(root))
 def retire_truncate(st):
  st.setdefault('job',{'artifacts':{}})
  if st['job'] is None:st['job']={'artifacts':{}}
  cur=(st.get('reviewJournals') or {}).get(journal.key)
  if cur and cur.get('head')==head:
   st.setdefault('retiredSearchGapJournals',{})[journal.key+':'+head]=cur
   merged={**cur.get('artifacts',{}),rel:kept_head,saved_rel:kept_head}
   st['reviewJournals'][journal.key]={'identity':journal.identity,'head':kept_head,'artifacts':merged}
 store.mutate(retire_truncate,[rel,saved_rel])
 revision2,st2=store.read();entry2=st2.get('reviewJournals',{}).get(journal.key)
 return (revision2,entry2)

def retained_correction_scope(root,journal,doc,report,proof,proof_raw):
 """A retained edge belongs to an exact recorded candidate in this journal."""
 canonical=lambda value:json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
 identity=journal.identity;route=identity['route'];rel=str(journal.path.relative_to(root))
 require(journal.key==sha(canonical(identity)) and proof['path']==rel,'Retained correction canonical journal changed')
 require(journal.path.is_file() and journal.path.read_bytes().startswith(proof_raw),'Retained correction is not original journal history')
 previous=None;cycle=None;reserved={};record=None
 for line in proof_raw.splitlines():
  if not line.strip():continue
  event=json.loads(line);unsigned={k:v for k,v in event.items() if k!='eventSha256'}
  require(event.get('identity')==identity and event.get('previous')==previous and sha(canonical(unsigned))==event.get('eventSha256'),'Retained correction canonical identity/history changed')
  previous=event['eventSha256'];data=event.get('data',{})
  if event['kind']=='begin':cycle=data;reserved={}
  if event['kind']=='reserve':reserved[data['number']]=data['admission']
  if event['kind']=='repair-pending':
   require(reserved.get(data['number'])==data['previousAdmission'],'Retained correction admission repair changed')
   reserved[data['number']]=data['admission']
  if (event['kind']=='record' and cycle and cycle.get('jobId')==doc['jobId']
      and cycle.get('cycleId')==doc['cycles'][route] and data.get('report',{}).get('sha256')==doc['report']['sha256']):
   require(reserved.get(data['number'])==data.get('admission'),'Retained correction candidate was not reserved')
   record=data
 selected=[r for r in report.get('routes',[]) if r.get('path')==route]
 require(report.get('jobId')==doc['jobId'] and len(selected)==1 and record
         and record.get('reportObjectSha256')==sha(canonical(report))
         and record.get('admission')==selected[0].get('reviewBudget')
         and record.get('verdict')==selected[0].get('verdict'),
         'Retained correction has no original job/cycle/candidate authority')


def restore_reference_correction(root,module,revision,ref,journal=None):
 """Hydrate only exact already-archived correction proof, never the nonexistent bad hash."""
 def hydrate(item):
  name=item['path'];expected=item['sha256']
  require(isinstance(name,str) and name.startswith('reports/') and '..' not in Path(name).parts and not Path(name).is_absolute(),'Internal correction evidence only')
  saved=cache_path(root,name,expected)
  if not saved.is_file():
   raw=module.git(root,'show',revision+':artifacts/'+expected).stdout
   saved=cache(root,name,expected,raw)
  require(sha(saved.read_bytes())==expected,'Archived correction proof changed')
  return saved.read_bytes()
 doc=json.loads(hydrate(ref))
 require(doc.get('kind')=='historical-transcription-edge-correction','Unsupported retained correction')
 if journal is not None:
  route=journal.identity['route'];proof=doc.get('recordedJournals',{}).get(route)
  require(proof and route in doc.get('cycles',{}),'Retained correction does not own this canonical route')
  require(proof.get('path')==str(journal.path.relative_to(root)),'Retained correction canonical journal changed')
  retained_correction_scope(root,journal,doc,json.loads(hydrate(doc['report'])),proof,hydrate(proof))
 for key in ('report','currentIndex','earlierIndex','supersededParent','currentJudgment','correctAdmission'):hydrate(doc[key])
 for proof in doc['recordedJournals'].values():hydrate(proof)
 for item in json.loads(hydrate(doc['currentIndex']))['judgments']:hydrate({k:item[k] for k in ('path','sha256')})
 for item in json.loads(hydrate(doc['report']))['routes']:hydrate(item['reviewBudget'])

def restore(root,journal):
 connection=backend(root)
 if connection is None:return None
 module,store=connection;revision,state=store.read();entry=state.get('reviewJournals',{}).get(journal.key)
 if entry:
  require(entry.get('identity')==journal.identity,'Durable review canonical identity changed')
  retired=_maybe_retire_closed_search_gap_cycle(root,journal,module,store,revision,entry)
  if isinstance(retired,dict):return retired
  if isinstance(retired,tuple):revision,entry=retired
 head=entry.get('head') if entry else None
 if entry:
  paths=entry['artifacts'];rel=str(journal.path.relative_to(root));require(paths.get(rel)==head,'Durable review identity changed')
  for name,expected in paths.items():
   target=(root/name).resolve();require(root.resolve() in target.parents and name.startswith('reports/'),'Internal review evidence only')
   if target.is_file() and sha(target.read_bytes())==expected:continue
   raw=module.git(root,'show',revision+':artifacts/'+expected).stdout;require(sha(raw)==expected,'Durable review artifact changed')
   if target.exists():
    current=target.read_bytes()
    if name==rel:
     require(raw.startswith(current) or current.startswith(raw),'Divergent review histories; preserve both before continuation')
     if current.startswith(raw):continue
    else:cache(root,name,expected,raw);continue
   target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
 # A correction is retained metadata of this canonical journal, never a
 # repository-wide default. Other journals and new keys keep their own evidence.
 # Auto-detach any stray foreign retained referenceCorrection whose cycles do not own this route.
 correction=entry.get('referenceCorrection') if entry else None
 if correction:
  try:
   raw_corr=cache_path(root,correction['path'],correction['sha256'])
   corr_bytes=raw_corr.read_bytes() if raw_corr.is_file() else module.git(root,'show',revision+':artifacts/'+correction['sha256']).stdout
   corr_doc=json.loads(corr_bytes)
   own_route=(journal.identity or {}).get('route')
   if own_route not in (corr_doc.get('cycles') or {}) or own_route not in (corr_doc.get('recordedJournals') or {}):
    correction=None
  except Exception:
   pass
 if correction:restore_reference_correction(root,module,revision,correction,journal=journal)
 return {'module':module,'store':store,'expectedHead':head,'key':journal.key,'referenceCorrection':correction}
def active_review_events(events):
 # A recovered alias remains the original cycle. Retain its actual R1/repair
 # dependencies as well as the mistaken intervening events, not just the last begin.
 last_begin=max((i for i,e in enumerate(events) if e.get('kind')=='begin'),default=0)
 for event in events[last_begin:]:
  if event.get('kind')=='recover-continuation':
   original=event['data']['originalCycleId']
   last_begin=next(i for i,e in enumerate(events) if e.get('kind')=='begin' and e['data']['cycleId']==original)
 return events[last_begin:]
def invalidated(journal):
 if not journal or not journal.path.is_file():return set()
 events=[json.loads(line) for line in journal.path.read_bytes().splitlines() if line.strip()]
 return {(ref['path'],ref['sha256']) for e in active_review_events(events) if e['kind']=='repair-pending' for ref in e['data'].get('invalidatedReferences',[])}

def recorded_proof_authority(root,identity,proof,proof_raw,remote):
 """Authenticate immutable proof without taking a journal lock or writing an anchor."""
 from urllib.parse import urlsplit
 canonical=lambda value:json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
 require(set(identity)=={'siteId','canonicalBase','route'},'Original journal identity changed')
 config=json.loads((root/'.claude/content-review-policy.json').read_bytes())
 origin=urlsplit(identity['canonicalBase']);route=identity['route']
 require(origin.hostname and origin.hostname.lower().removeprefix('www.').rstrip('.') in {str(h).lower().removeprefix('www.').rstrip('.') for h in config.get('canonicalHosts',[])},'Canonical proof host outside site')
 require(identity['siteId']==config['siteId'] and origin.scheme=='https' and origin.hostname and not origin.username and not origin.password and not origin.query and not origin.fragment and origin.path=='' and origin.port in (None,443) and identity['canonicalBase']=='https://'+origin.hostname.lower().removeprefix('www.').rstrip('.') and route.startswith('/') and not route.startswith('//') and '?' not in route and '#' not in route and '..' not in route and route==(route.rstrip('/') or '/'),'Canonical proof identity changed')
 key=sha(canonical(identity));name='reports/content-review-journals/'+key+'.jsonl'
 require(proof['path']==name,'Canonical proof journal path changed')
 def verified(raw):
  previous=None;heads=[]
  for line in raw.splitlines():
   if not line.strip():continue
   event=json.loads(line);unsigned={k:v for k,v in event.items() if k!='eventSha256'}
   require(event.get('previous')==previous and event.get('identity')==identity and sha(canonical(unsigned))==event.get('eventSha256'),'Authoritative journal history changed')
   previous=event['eventSha256'];heads.append(previous)
  return heads
 gd=subprocess.run(['git','rev-parse','--absolute-git-dir'],cwd=root,capture_output=True,text=True)
 require(gd.returncode==0,'Native journal Git identity required')
 anchor=Path(gd.stdout.strip())/'content-review-policy'/(key+'.head');target=root/name
 committed=subprocess.run(['git','show','HEAD:'+name],cwd=root,capture_output=True)
 if target.is_file() and anchor.is_file():
  actual=target.read_bytes();heads=verified(actual)
  anchored=anchor.read_text().strip();proof_heads=verified(proof_raw)
  require(actual.startswith(proof_raw) and anchored in heads and proof_heads and heads.index(anchored)>=len(proof_heads)-1,'Frozen proof is not native anchored history')
  require(committed.returncode!=0 or actual.startswith(committed.stdout),'Committed journal history changed')
  return 'native-private-anchor'
 if committed.returncode==0 and committed.stdout.startswith(proof_raw):
  verified(committed.stdout)
  require(not target.is_file() or target.read_bytes().startswith(committed.stdout),'Committed journal history changed')
  return 'committed-native-prefix'
 # Clean checkouts can authenticate against the unchanged native Store remote history.
 # Store.read obtains the actual origin ref, and git show verifies that exact artifact head.
 if 'connection' not in remote:
  connection=backend(root);require(connection is not None,'No native authority for original proof')
  module,store=connection;revision,state=store.read();remote.update(connection=connection,revision=revision,state=state)
 module,store=remote['connection'];entry=remote['state'].get('reviewJournals',{}).get(key,{})
 head=entry.get('head');require(entry.get('identity')==identity and isinstance(head,str) and entry.get('artifacts',{}).get(name)==head,'No durable canonical authority for original proof')
 raw=module.git(root,'show',remote['revision']+':artifacts/'+head).stdout
 require(sha(raw)==head and raw.startswith(proof_raw),'Frozen proof is not verified durable history')
 verified(raw)
 return 'verified-native-durable-prefix'

def reference_correction(root,journal,events,retained=None):
 """One exact, recorded historical transcription edge; never active authority."""
 name=os.environ.get('CONTENT_REVIEW_REFERENCE_CORRECTION','')
 expected=os.environ.get('CONTENT_REVIEW_REFERENCE_CORRECTION_SHA256','')
 require(bool(name)==bool(expected),'Correction opt-in needs path and exact hash')
 explicit={'path':name,'sha256':expected} if name else None
 require(not explicit or not retained or explicit==retained,'Retained correction cannot change')
 ref=explicit or retained
 if not ref:return None
 def read_ref(item):
  require(isinstance(item,dict) and set(item)=={'path','sha256'},'Exact correction reference required')
  p=Path(item['path']);h=item['sha256']
  require(isinstance(h,str) and len(h)==64 and all(c in '0123456789abcdef' for c in h),'Exact correction SHA required')
  require(not p.is_absolute() and '..' not in p.parts and p.parts[:1]==('reports',),'Internal correction evidence only')
  target=(root/p).resolve();require(root.resolve() in target.parents,'Correction path escapes repository')
  raw=target.read_bytes() if target.is_file() else None
  if raw is None or sha(raw)!=h:
   saved=cache_path(root,item['path'],h)
   require(saved.is_file() and sha(saved.read_bytes())==h,'Correction evidence bytes changed: '+str(p))
   raw=saved.read_bytes()
  return [json.loads(line) for line in raw.splitlines() if line.strip()] if p.suffix=='.jsonl' else json.loads(raw)
 doc=read_ref(ref)
 require(set(doc)=={'kind','version','jobId','scopeRoot','report','currentIndex','earlierIndex','supersededParent','currentJudgment','correctAdmission','badReference','judgmentIndex','cycles','reason','unavailableOriginalSources','recordedJournals'},'Unexpected correction fields')
 require(doc['kind']=='historical-transcription-edge-correction' and doc['version']==1,'Unsupported correction')
 require(isinstance(doc['reason'],str) and len(doc['reason'].strip())>=40,'Retain exact correction reason')
 scope=Path(doc['scopeRoot']);require(not scope.is_absolute() and '..' not in scope.parts and scope.parts[:2]==('reports','mindmap-pass'),'Correction must stay in one job evidence directory')
 refs=[ref]+[doc[k] for k in ['report','currentIndex','earlierIndex','supersededParent','currentJudgment','correctAdmission','badReference']]
 require(all(Path(x['path']).is_relative_to(scope) for x in refs),'Correction source outside job')
 report=read_ref(doc['report']);index=read_ref(doc['currentIndex']);earlier=read_ref(doc['earlierIndex']);parent=read_ref(doc['supersededParent']);leaf=read_ref(doc['currentJudgment']);admission=read_ref(doc['correctAdmission'])
 require(report.get('jobId')==doc['jobId']==admission.get('jobId'),'Correction job changed')
 require(doc['currentIndex'] in report.get('supplementaryEvidence',[]),'Current index is not recorded authority')
 require(index.get('preservedEarlierIndex')==doc['earlierIndex'],'Historical index link changed')
 i=doc['judgmentIndex'];require(type(i) is int and 0<=i<len(earlier.get('judgments',[])),'Exact historical judgment index required')
 old=earlier['judgments'][i];require({k:old[k] for k in ['path','sha256']}==doc['supersededParent'],'Superseded parent changed')
 require(parent.get('reviewBudget')==doc['badReference'],'Exact erroneous parent reference required')
 require(doc['badReference']['path']==doc['correctAdmission']['path'] and doc['badReference']['sha256']!=doc['correctAdmission']['sha256'],'Only a wrong-hash transcription of the same original admission is supported')
 # Validate the malformed hash shape without asking for nonexistent bytes.
 cache_path(root,doc['badReference']['path'],doc['badReference']['sha256'])
 require(doc['unavailableOriginalSources']==[{'path':doc['badReference']['path'],'sha256':doc['badReference']['sha256'],'reason':doc['reason']}],'Retain exact unavailable historical source')
 route=admission.get('identity',{}).get('route')
 require(parent.get('path')==leaf.get('path')==old.get('route')==route,'Admission/parent route changed')
 require(leaf.get('reviewBudget')==doc['correctAdmission'],'Current judgment must retain true admission')
 current=[x for x in index.get('judgments',[]) if x.get('route')==route]
 require(len(current)==1 and {k:current[0][k] for k in ['path','sha256']}==doc['currentJudgment'],'Current judgment link changed')
 # All current leaves must remain exact judgment authority, not historical replacements.
 for item in index.get('judgments',[]):
  value=read_ref({k:item[k] for k in ['path','sha256']});matches=[x for x in report.get('routes',[]) if x.get('path')==item['route']]
  require(len(matches)==1 and all(matches[0].get(k)==value.get(k) for k in ('path','fingerprint','verdict','reviewBudget','reviewProfile','riskAssessment','checks')) and [(x.get('id'),x.get('status')) for x in matches[0].get('findings',[])]==[(x.get('id'),x.get('status')) for x in value.get('findings',[])],'Current recorded judgment changed')
 require(len(index.get('judgments',[]))==len(report.get('routes',[])) and len({x['route'] for x in index['judgments']})==len(report['routes']),'Complete current judgment set required')
 require(isinstance(doc['cycles'],dict) and set(doc['cycles'])=={x['path'] for x in report['routes']},'Exact recorded cycle set required')
 require(isinstance(doc['recordedJournals'],dict) and set(doc['recordedJournals'])==set(doc['cycles']),'Complete original recorded-journal proof required')
 object_sha=sha(json.dumps(report,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode());remote={}
 for proof_route,proof in doc['recordedJournals'].items():
  require(Path(proof['path']).parts[:2]==('reports','content-review-journals') and Path(proof['path']).suffix=='.jsonl','Canonical journal proof required')
  proof_events=read_ref(proof);previous=None;cycle=None;record=None;identity=None;reserved={}
  for event in proof_events:
   unsigned={k:v for k,v in event.items() if k!='eventSha256'}
   require(event.get('previous')==previous and sha(json.dumps(unsigned,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode())==event.get('eventSha256'),'Original journal proof chain changed')
   previous=event['eventSha256'];identity=event.get('identity',{})
   require(identity.get('route')==proof_route,'Original journal identity changed')
   if event['kind']=='begin':cycle=event['data'];reserved={}
   if event['kind']=='reserve':reserved[event['data']['number']]=event['data']['admission']
   if event['kind']=='repair-pending':
    require(reserved.get(event['data']['number'])==event['data']['previousAdmission'],'Original admission repair changed')
    reserved[event['data']['number']]=event['data']['admission']
   if event['kind']=='record' and cycle and cycle.get('cycleId')==doc['cycles'][proof_route] and cycle.get('jobId')==doc['jobId'] and event['data'].get('report',{}).get('sha256')==doc['report']['sha256']:
    require(reserved.get(event['data']['number'])==event['data'].get('admission'),'Original recorded admission was not actually reserved')
    record=event['data']
  require(record and record.get('reportObjectSha256')==object_sha,'Correction needs exact already-recorded report/cycle')
  target=root/proof['path'];proof_raw=target.read_bytes() if target.is_file() and sha(target.read_bytes())==proof['sha256'] else cache_path(root,proof['path'],proof['sha256']).read_bytes()
  recorded_proof_authority(root,identity,proof,proof_raw,remote)
  selected=next(x for x in report['routes'] if x['path']==proof_route)
  require(record.get('admission')==selected.get('reviewBudget') and record.get('verdict')==selected.get('verdict'),'Original recorded decision/admission changed')
  true_admission=read_ref(selected['reviewBudget'])
  require(true_admission.get('cycleId')==doc['cycles'][proof_route] and true_admission.get('jobId')==doc['jobId'] and true_admission.get('identity')==identity and true_admission.get('number')==record.get('number'),'Correct admission cycle changed')
 require(admission.get('cycleId')==doc['cycles'][route],'Correct admission cycle changed')
 edge=((doc['currentIndex']['sha256'],('preservedEarlierIndex',)),(doc['earlierIndex']['sha256'],('judgments',i)),(doc['supersededParent']['sha256'],('reviewBudget',)))
 return {'reference':ref,'document':doc,'edge':edge,'bad':(doc['badReference']['path'],doc['badReference']['sha256'])}

def symbolic_judgment_parent(root,judgment,judgment_sha,remote):
 """Find the parent from an authenticated canonical record, never from a candidate hash."""
 analysis=judgment.get('analysisReview')
 if judgment.get('kind')!='genuine-independent-route-judgment' or not isinstance(analysis,dict) or not isinstance(analysis.get('renderedReview'),dict) or analysis['renderedReview'].get('sha256')!='AUTO_BOUND_ON_FINALIZE':return None
 canonical=lambda value:json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
 def exact(ref):
  require(isinstance(ref,dict) and set(ref)=={'path','sha256'},'Exact symbolic parent reference required')
  name=ref['path'];expected=ref['sha256'];saved=cache_path(root,name,expected);target=(root/name).resolve()
  require(root.resolve() in target.parents and str(target.relative_to(root)).startswith('reports/'),'Symbolic parent must remain internal')
  raw=target.read_bytes() if target.is_file() and sha(target.read_bytes())==expected else saved.read_bytes() if saved.is_file() else None
  if raw is None:
   if 'connection' not in remote and 'store_checked' not in remote:
    remote['store_checked']=True
    try:
     conn=backend(root)
     if conn is not None:
      mod,st=conn;rev,st_doc=st.read();remote.update(connection=conn,revision=rev,state=st_doc)
    except Exception:pass
   if 'connection' in remote and remote.get('revision'):
    try:
     probe=remote['connection'][0].git(root,'show',remote['revision']+':artifacts/'+expected)
     if probe.returncode==0 and sha(probe.stdout)==expected:
      saved=cache(root,name,expected,probe.stdout);raw=probe.stdout
    except Exception:pass
  require(raw is not None and sha(raw)==expected,'Missing exact native symbolic parent')
  return json.loads(raw)
 row=judgment.get('routeReview');require(isinstance(row,dict),'Symbolic judgment lacks native route')
 admission=exact(row['reviewBudget']);identity=admission['identity'];key=sha(canonical(identity));name='reports/content-review-journals/'+key+'.jsonl';target=root/name
 if target.is_file():raw=target.read_bytes()
 else:
  if 'connection' not in remote:
   connection=backend(root);require(connection is not None,'No native symbolic parent authority')
   module,store=connection;revision,state=store.read();remote.update(connection=connection,revision=revision,state=state)
  module,store=remote['connection'];entry=remote['state'].get('reviewJournals',{}).get(key,{})
  head=entry.get('head');require(entry.get('identity')==identity and entry.get('artifacts',{}).get(name)==head and isinstance(head,str),'No durable symbolic parent identity')
  raw=module.git(root,'show',remote['revision']+':artifacts/'+head).stdout
  require(sha(raw)==head,'Durable symbolic parent journal changed')
 matches=[]
 for n,event in enumerate([json.loads(line) for line in raw.splitlines() if line.strip()]):
  data=event.get('data',{})
  if event.get('kind')!='record' or data.get('admission')!=row['reviewBudget']:continue
  prefix=b'\n'.join(raw.splitlines()[:n+1])+b'\n'
  recorded_proof_authority(root,identity,{'path':name,'sha256':sha(prefix)},prefix,remote)
  report=exact(data['report'])
  require(data.get('reportObjectSha256')==sha(canonical(report)),'Native symbolic parent object changed')
  bound=[p for p in report.get('decisionProvenance',[]) if p.get('route')==row.get('path') and p.get('judgment',{}).get('sha256')==judgment_sha]
  if len(bound)==1 and exact(bound[0]['judgment'])==judgment:matches.append((report,data['report']['sha256']))
 require(len(matches)==1,'No unique recorded symbolic parent for this exact judgment')
 return matches[0]

def symbolic_provenance(root,report,report_sha,remote=None):
 """Authenticate native pre-finalization self-bindings; never accept an invalid artifact hash."""
 canonical=lambda value:json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
 remote={} if remote is None else remote
 edges=set();dependencies={}
 def exact(ref):
  require(isinstance(ref,dict) and set(ref)=={'path','sha256'},'Exact symbolic provenance reference required')
  name=ref['path'];expected=ref['sha256'];saved=cache_path(root,name,expected)
  target=(root/name).resolve()
  require(root.resolve() in target.parents and str(target.relative_to(root)).startswith('reports/'),'Symbolic provenance must remain internal')
  raw=target.read_bytes() if target.is_file() and sha(target.read_bytes())==expected else saved.read_bytes() if saved.is_file() else None
  if raw is None:
   if 'connection' not in remote and 'store_checked' not in remote:
    remote['store_checked']=True
    try:
     conn=backend(root)
     if conn is not None:
      mod,st=conn;rev,st_doc=st.read();remote.update(connection=conn,revision=rev,state=st_doc)
    except Exception:pass
   if 'connection' in remote and remote.get('revision'):
    try:
     probe=remote['connection'][0].git(root,'show',remote['revision']+':artifacts/'+expected)
     if probe.returncode==0 and sha(probe.stdout)==expected:
      saved=cache(root,name,expected,probe.stdout);raw=probe.stdout
    except Exception:pass
  require(raw is not None and sha(raw)==expected,'Missing exact symbolic provenance dependency')
  return json.loads(raw)
 provenance=report.get('decisionProvenance')
 if not isinstance(provenance,list):return edges,dependencies
 routes=report.get('routes',[])
 for i,item in enumerate(provenance):
  if not isinstance(item,dict) or not isinstance(item.get('judgment'),dict):continue
  judgment=exact(item['judgment']);analysis=judgment.get('analysisReview')
  if not isinstance(analysis,dict) or not isinstance(analysis.get('renderedReview'),dict) or analysis['renderedReview'].get('sha256')!='AUTO_BOUND_ON_FINALIZE':continue
  symbolic=analysis['renderedReview'];route=item.get('route')
  require(set(symbolic)=={'path','sha256'},'Unexpected symbolic self-binding fields')
  require(Path(item['judgment']['path']).parent==Path(symbolic['path']).parent/'judgments' and Path(symbolic['path']).suffix=='.json','Symbolic native source namespace changed')
  report_ref={'path':symbolic['path'],'sha256':report_sha}
  require(exact(report_ref)==report,'Symbolic self-binding targets another report')
  rows=[row for row in routes if row.get('path')==route]
  require(len(rows)==1 and judgment.get('kind')=='genuine-independent-route-judgment','Symbolic route judgment changed')
  row=rows[0];original=judgment.get('routeReview')
  spec=importlib.util.spec_from_file_location('symbolic_native_policy',root/'.claude/tools/content-review-policy.py');native=importlib.util.module_from_spec(spec);spec.loader.exec_module(native)
  required=list(native.FACTS[row['reviewProfile']])+['riskClassification','seoQuality']
  if (root/'.claude/workflow-policy.local.json').is_file():required.append('instructionUnderstanding')
  require(isinstance(original,dict) and isinstance(original.get('factualReview'),dict),'Symbolic original facts missing')
  known=set().union(*[set(v) for v in native.FACTS.values()])|{'riskClassification','seoQuality','instructionUnderstanding'}
  require(set(original['factualReview'])<=known and all(k in original['factualReview'] for k in required),'Symbolic original fact schema changed')
  projected=dict(original);projected['factualReview']={k:original['factualReview'][k] for k in required}
  require(projected==row,'Symbolic route judgment changed')
  require(judgment.get('actor')==report.get('reviewer') and judgment.get('contextEpoch')==item.get('contextEpoch') and judgment.get('reviewerApplication')==item.get('instructionApplication'),'Symbolic reviewer provenance changed')
  admission=exact(row['reviewBudget']);identity=admission['identity']
  require(identity.get('route')==route and admission.get('jobId')==report.get('jobId') and admission.get('reviewer')==report.get('reviewer') and admission.get('fingerprint')==row.get('fingerprint'),'Symbolic admission identity changed')
  require(judgment.get('snapshot')==admission.get('snapshot') and analysis.get('renderedSnapshot')==admission.get('snapshot'),'Symbolic snapshot reference changed')
  snapshot=exact(admission['snapshot'])
  require(snapshot.get('snapshotSha256')==report.get('snapshotSha256'),'Symbolic report snapshot changed')
  pages=[page for page in snapshot.get('routes',[]) if page.get('path')==route]
  require(len(pages)==1 and pages[0].get('fingerprint')==row.get('fingerprint'),'Symbolic candidate fingerprint changed')
  key=sha(canonical(identity));name='reports/content-review-journals/'+key+'.jsonl';target=root/name
  if target.is_file():raw=target.read_bytes()
  else:
   if 'connection' not in remote:
    connection=backend(root);require(connection is not None,'No native symbolic record authority')
    module,store=connection;revision,state=store.read();remote.update(connection=connection,revision=revision,state=state)
   module,store=remote['connection'];entry=remote['state'].get('reviewJournals',{}).get(key,{})
   head=entry.get('head');require(entry.get('identity')==identity and entry.get('artifacts',{}).get(name)==head and isinstance(head,str),'No durable symbolic record identity')
   raw=module.git(root,'show',remote['revision']+':artifacts/'+head).stdout
   require(sha(raw)==head,'Durable symbolic journal changed')
  events=[json.loads(line) for line in raw.splitlines() if line.strip()]
  selected=[];begin=None
  for n,event in enumerate(events):
   if event.get('kind')=='begin':begin=event['data']
   if event.get('kind')=='record' and event.get('data',{}).get('reportObjectSha256')==sha(canonical(report)):
    data=event['data']
    if data.get('admission')==row['reviewBudget']:
     require(begin and begin.get('cycleId')==admission.get('cycleId') and begin.get('jobId')==admission.get('jobId'),'Symbolic canonical cycle changed')
     reservations=[e['data'] for e in events[:n] if e.get('kind')=='reserve' and e.get('data',{}).get('admission')==row['reviewBudget']]
     require(len(reservations)==1 and reservations[0].get('number')==admission.get('number') and reservations[0].get('fingerprint')==row.get('fingerprint') and reservations[0].get('reviewer')==report.get('reviewer'),'Symbolic native reservation changed')
     require(data.get('report',{}).get('sha256')==report_sha and exact(data['report'])==report and data.get('number')==admission.get('number') and data.get('fingerprint')==row.get('fingerprint') and data.get('verdict')==row.get('verdict') and data.get('profile')==row.get('reviewProfile'),'Symbolic native recorded result changed')
     prefix=b'\n'.join(raw.splitlines()[:n+1])+b'\n'
     recorded_proof_authority(root,identity,{'path':name,'sha256':sha(prefix)},prefix,remote)
     selected.append(n)
  require(len(selected)==1,'Symbolic provenance requires an actual native recorded result')
  # Native finalizer writes canonical JSON plus newline, changing only renderedReview.
  bound=dict(analysis);bound['renderedReview']=report_ref
  require(bound.get('reviewer')==report.get('reviewer'),'Symbolic analysis reviewer changed')
  slug=route.rsplit('/',1)[-1]
  bound_name=str(Path(symbolic['path']).parent/'analysis-reviews'/(slug+'.json'))
  bound_ref={'path':bound_name,'sha256':sha(canonical(bound)+b'\n')}
  require(exact(bound_ref)==bound,'Native finalized symbolic analysis changed')
  dependencies[bound_name]=bound_ref['sha256']
  dependencies[symbolic['path']]=report_sha
  edges.add(((report_sha,('decisionProvenance',i,'judgment')),(item['judgment']['sha256'],('analysisReview','renderedReview')),symbolic['path'],'AUTO_BOUND_ON_FINALIZE'))
 return edges,dependencies

def collect(root,journal,extra=None,invalid=None,correction_ref=None):
 paths={};seen=set();symbolic_edges=set();symbolic_reports=set();symbolic_judgments=set();symbolic_remote={};events=[json.loads(line) for line in journal.path.read_bytes().splitlines() if line.strip()] if journal else []
 active_events=active_review_events(events)
 invalid=set(invalid or ())|invalidated(journal)
 correction=reference_correction(root,journal,events,correction_ref)
 def file(name,expected=None,lineage=()):
  target=(root/name).resolve()
  if root.resolve() not in target.parents or not str(target.relative_to(root)).startswith('reports/'):return
  name=str(target.relative_to(root))
  if lineage and (lineage[-1],name,expected) in symbolic_edges:return
  if correction and (name,expected)==correction['bad'] and lineage[-3:]==correction['edge']:
   return  # Preserve exact parent and correction receipt; nonexistent transcription bytes are never fabricated.
  if (name,expected) in invalid:
   saved=cache_path(root,name,expected)
   if target.is_file() and sha(target.read_bytes()) == expected:
    saved = cache(root, name, expected, target.read_bytes())
    paths[name] = expected
   if saved.is_file() and sha(saved.read_bytes())==expected:paths[str(saved.relative_to(root))]=expected
   return  # Exact unavailable pending capture remains declared, never fabricated.
  current=target.read_bytes() if target.is_file() else None
  if current is not None:paths[name]=sha(current)
  raw=current
  if expected and (raw is None or sha(raw)!=expected):
   saved=cache_path(root,name,expected)
   if not saved.is_file():
    if 'store_checked' not in symbolic_remote:
     symbolic_remote['store_checked']=True
     try:
      conn=backend(root)
      if conn is not None:
       mod,st=conn;rev,st_doc=st.read();symbolic_remote.update(connection=conn,revision=rev,state=st_doc)
     except Exception:pass
    if 'connection' in symbolic_remote and symbolic_remote.get('revision'):
     try:
      probe=symbolic_remote['connection'][0].git(root,'show',symbolic_remote['revision']+':artifacts/'+expected)
      if probe.returncode==0 and sha(probe.stdout)==expected:
       saved=cache(root,name,expected,probe.stdout)
     except Exception:pass
   require(saved.is_file(),'Missing actual review dependency before checkpoint: '+name)
   raw=saved.read_bytes();require(sha(raw)==expected,'Archived review dependency changed')
  if raw is None:
   require(expected is None,'Missing actual review dependency before checkpoint: '+name);return
  wanted=expected or sha(raw);saved=cache(root,name,wanted,raw);paths[str(saved.relative_to(root))]=wanted
  # Only three relevant contexts: ordinary authority, historical-index edge, historical-parent edge.
  # Other ancestry is immaterial; retaining arbitrary triples would multiply large shared graphs.
  history_context=max((n for n in (1,2) if correction and lineage[-n:]==correction['edge'][:n]),default=0)
  key=(name,wanted,history_context)
  if key in seen:return
  seen.add(key)
  if target.suffix=='.json':
   value=json.loads(raw)
   if isinstance(value,dict) and isinstance(value.get('decisionProvenance'),list) and wanted not in symbolic_reports:
    symbolic_reports.add(wanted)
    edges,dependencies=symbolic_provenance(root,value,wanted,symbolic_remote)
    symbolic_edges.update((edge[1],edge[2],edge[3]) for edge in edges)
    symbolic_judgments.update(edge[1][0] for edge in edges)
    for dependency,digest in dependencies.items():
     if (dependency,digest)!=(name,wanted):file(dependency,digest)
   if isinstance(value,dict) and value.get('kind')=='genuine-independent-route-judgment' and wanted not in symbolic_judgments:
    symbolic_judgments.add(wanted)
    parent=symbolic_judgment_parent(root,value,wanted,symbolic_remote)
    if parent:
     report,report_sha=parent
     edges,dependencies=symbolic_provenance(root,report,report_sha,symbolic_remote)
     symbolic_edges.update((edge[1],edge[2],edge[3]) for edge in edges)
     symbolic_judgments.update(edge[1][0] for edge in edges);symbolic_reports.add(report_sha)
     for dependency,digest in dependencies.items():file(dependency,digest)
   if correction and name==correction['reference']['path'] and wanted==correction['reference']['sha256']:
    value={k:v for k,v in value.items() if k not in ('badReference','earlierIndex','supersededParent','recordedJournals')}  # exact unavailable pair retained in receipt, not active evidence
   visit(value,wanted,(),lineage)
 def visit(value,parent_sha=None,pointer=(),lineage=()):
  if isinstance(value,dict):
   if isinstance(value.get('path'),str) and isinstance(value.get('sha256'),str):file(value['path'],value['sha256'],lineage+((parent_sha,pointer),))
   for key,digest in [('htmlFile','htmlSha256'),('textFile','textSha256')]:
    if isinstance(value.get(key),str) and isinstance(value.get(digest),str):
     p=Path(value[key]);file(str(p.relative_to(root)) if p.is_absolute() and root in p.parents else str(p),value[digest])
   for k,child in value.items():
    if k!='unavailableOriginalSources':visit(child,parent_sha,pointer+(k,),lineage)
  elif isinstance(value,list):
   for i,child in enumerate(value):visit(child,parent_sha,pointer+(i,),lineage)
 if correction:
  file(correction['reference']['path'],correction['reference']['sha256'])
  for proof in correction['document']['recordedJournals'].values():
   target=root/proof['path'];raw=target.read_bytes() if target.is_file() and sha(target.read_bytes())==proof['sha256'] else cache_path(root,proof['path'],proof['sha256']).read_bytes()
   saved=cache(root,proof['path'],proof['sha256'],raw);paths[str(saved.relative_to(root))]=proof['sha256']
 if journal:file(str(journal.path.relative_to(root)))
 for name,digest in (extra or {}).items():file(name,digest)
 for event in active_events:visit(event)
 return paths

def checkpoint(root,journal,context):
 if context is None or not journal.path.is_file():return
 expected=context['expectedHead']
 if expected and sha(journal.path.read_bytes())==expected:return  # restore already verified this exact archive
 paths=collect(root,journal,correction_ref=context.get('referenceCorrection'));rel=str(journal.path.relative_to(root));head=paths[rel]
 def retain(state):
  entries=state.setdefault('reviewJournals',{});existing=entries.get(journal.key,{});current=existing.get('head')
  require(current in (expected,head),'Another worker advanced this canonical review; restore its actual history before retrying')
  state.setdefault('job',{'artifacts':{}})
  if state['job'] is None:state['job']={'artifacts':{}}
  merged={**existing.get('artifacts',{}),**paths}
  entries[journal.key]={'identity':journal.identity,'head':head,'artifacts':merged}
  correction=reference_correction(root,journal,[json.loads(line) for line in journal.path.read_bytes().splitlines() if line.strip()],context.get('referenceCorrection'))
  if correction and (journal.identity or {}).get('route') in correction.get('document',{}).get('cycles',{}):entries[journal.key]['referenceCorrection']=correction['reference']
 context['store'].mutate(retain,list(paths))
 revision,remote=context['store'].read()
 saved=remote.get('reviewJournals',{}).get(journal.key,{})
 if saved.get('head') != head or not (paths.items() <= saved.get('artifacts',{}).items()):
  raise ValueError('Remote did not confirm the exact review journal and its evidence; resume the original slot')
 archive=Path(__file__).with_name('review-archive.py')
 if not archive.is_file() and os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID'):
  raise ValueError('Missing native review archive verifier')
 if archive.is_file():
  spec=importlib.util.spec_from_file_location('review_archive_check',archive);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
  module.verified_objects(root,revision,saved['artifacts'].values())
 context['expectedHead']=head


def main():
 import argparse
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('command',choices=['checkpoint','restore']);parser.add_argument('--canonical-base',required=True);parser.add_argument('--route',required=True);args=parser.parse_args()
 root=Path(__file__).resolve().parents[2];path=Path(__file__).with_name('content-review-policy.py')
 spec=importlib.util.spec_from_file_location('checkpoint_actual_review_policy',path);policy=importlib.util.module_from_spec(spec);spec.loader.exec_module(policy)
 journal=policy.Journal(root,args.canonical_base,args.route);context=restore(root,journal)
 require(context is not None,'An actual native Git checkpoint origin is required')
 with journal as actual:require(bool(actual.events),'No actual review history exists to checkpoint')
 if args.command=='checkpoint':checkpoint(root,journal,context)
 print(json.dumps({'status':'actual-review-history-'+('checkpointed' if args.command=='checkpoint' else 'restored'),'identity':journal.identity,'scope':'Existing journal/evidence only; no new review, verdict or publication.'}))

if __name__=='__main__':main()
