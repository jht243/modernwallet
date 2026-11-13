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

def restore(root,journal):
 connection=backend(root)
 if connection is None:return None
 module,store=connection;revision,state=store.read();entry=state.get('reviewJournals',{}).get(journal.key)
 if entry:
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
 return {'module':module,'store':store,'expectedHead':head,'key':journal.key}
def invalidated(journal):
 if not journal or not journal.path.is_file():return set()
 events=[json.loads(line) for line in journal.path.read_bytes().splitlines() if line.strip()]
 last_begin=max((i for i,e in enumerate(events) if e.get('kind')=='begin'),default=0)
 return {(ref['path'],ref['sha256']) for e in events[last_begin:] if e['kind']=='repair-pending' for ref in e['data'].get('invalidatedReferences',[])}
def collect(root,journal,extra=None,invalid=None):
 paths={};seen=set();events=[json.loads(line) for line in journal.path.read_bytes().splitlines() if line.strip()] if journal else []
 last_begin=max((i for i,e in enumerate(events) if e.get('kind')=='begin'),default=0)
 active_events=events[last_begin:]
 invalid=set(invalid or ())|invalidated(journal)
 def file(name,expected=None):
  target=(root/name).resolve()
  if root.resolve() not in target.parents or not str(target.relative_to(root)).startswith('reports/'):return
  name=str(target.relative_to(root))
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
   saved=cache_path(root,name,expected);require(saved.is_file(),'Missing actual review dependency before checkpoint: '+name)
   raw=saved.read_bytes();require(sha(raw)==expected,'Archived review dependency changed')
  if raw is None:
   require(expected is None,'Missing actual review dependency before checkpoint: '+name);return
  wanted=expected or sha(raw);saved=cache(root,name,wanted,raw);paths[str(saved.relative_to(root))]=wanted
  key=(name,wanted)
  if key in seen:return
  seen.add(key)
  if target.suffix=='.json':visit(json.loads(raw))
 def visit(value):
  if isinstance(value,dict):
   if isinstance(value.get('path'),str) and isinstance(value.get('sha256'),str):file(value['path'],value['sha256'])
   for key,digest in [('htmlFile','htmlSha256'),('textFile','textSha256')]:
    if isinstance(value.get(key),str) and isinstance(value.get(digest),str):
     p=Path(value[key]);file(str(p.relative_to(root)) if p.is_absolute() and root in p.parents else str(p),value[digest])
   for child in value.values():visit(child)
  elif isinstance(value,list):
   for child in value:visit(child)
 if journal:file(str(journal.path.relative_to(root)))
 for name,digest in (extra or {}).items():file(name,digest)
 for event in active_events:visit(event)
 return paths

def checkpoint(root,journal,context):
 if context is None or not journal.path.is_file():return
 expected=context['expectedHead']
 if expected and sha(journal.path.read_bytes())==expected:return  # restore already verified this exact archive
 paths=collect(root,journal);rel=str(journal.path.relative_to(root));head=paths[rel]
 def retain(state):
  entries=state.setdefault('reviewJournals',{});existing=entries.get(journal.key,{});current=existing.get('head')
  require(current in (expected,head),'Another worker advanced this canonical review; restore its actual history before retrying')
  state.setdefault('job',{'artifacts':{}})
  if state['job'] is None:state['job']={'artifacts':{}}
  merged={**existing.get('artifacts',{}),**paths}
  entries[journal.key]={'identity':journal.identity,'head':head,'artifacts':merged}
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
