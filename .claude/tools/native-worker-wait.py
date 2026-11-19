#!/usr/bin/env python3
"""Let a native parent pause for its own finite worker; never approve output."""
import hashlib,json,os,subprocess,sys,time,importlib.util
from pathlib import Path

REGISTRY_TTL = 21600

def _session_id(payload=None):
 return os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID') or (payload or {}).get('session_id')

def worker_tag(payload=None):
 sid=_session_id(payload)
 return '[workflow-parent:'+hashlib.sha256(sid.encode()).hexdigest()[:12]+']' if sid else None

def _registry_file(root,sid):
 if not sid:return None
 try:
  res=subprocess.run(['git','rev-parse','--git-path','native-worker-wait/'+hashlib.sha256(sid.encode()).hexdigest()+'.json'],cwd=root,capture_output=True,text=True)
  if res.returncode!=0 or not res.stdout.strip():return None
  p=Path(res.stdout.strip())
  return p if p.is_absolute() else (root/p)
 except Exception:
  return None

def _record_bound_worker(root,sid,description,subagent_type=''):
 p=_registry_file(root,sid)
 if p is None or not isinstance(description,str) or not description.strip():return
 now=time.time()
 try:
  existing=json.loads(p.read_text()) if p.is_file() else []
  if not isinstance(existing,list):existing=[]
 except Exception:
  existing=[]
 entries=[e for e in existing if isinstance(e,dict) and now-float(e.get('boundAt',0))<=REGISTRY_TTL]
 clean_desc=description.strip()
 entries=[e for e in entries if e.get('description')!=clean_desc]
 entries.append({'description':clean_desc,'subagentType':str(subagent_type or ''),'boundAt':now})
 try:
  p.parent.mkdir(parents=True,exist_ok=True)
  p.write_text(json.dumps(entries[-50:]))
 except Exception:
  pass

def _load_bound_descriptions(root,sid):
 p=_registry_file(root,sid)
 if p is None or not p.is_file():return set()
 now=time.time()
 try:
  entries=json.loads(p.read_text())
  if not isinstance(entries,list):return set()
  return {str(e['description']) for e in entries if isinstance(e,dict) and isinstance(e.get('description'),str) and now-float(e.get('boundAt',0))<=REGISTRY_TTL}
 except Exception:
  return set()

def _normalize_mindmap_stage(subagent_type):
 role=str(subagent_type or '').strip().lower()
 for stage in ('chart-review','build','write','audit'):
  if role==f'mindmap-{stage}' or role==f'layer3-mindmap-{stage}' or role.endswith(f'-mindmap-{stage}'):
   return stage
 return None

def _find_prior_stage_worker(root,sid,stage):
 p=_registry_file(root,sid)
 if p is None or not p.is_file():return None
 now=time.time()
 try:
  entries=json.loads(p.read_text())
  if not isinstance(entries,list):return None
 except Exception:
  return None
 prior=None
 for e in entries:
  if not isinstance(e,dict) or now-float(e.get('boundAt',0))>REGISTRY_TTL:continue
  if _normalize_mindmap_stage(e.get('subagentType'))==stage:
   prior=e
 if prior is None:return None
 reports_dir=root/'reports'
 if not reports_dir.is_dir():return None
 if any(reports_dir.glob(f'**/preflight-{stage}*/manifest.json')):
  return prior
 return None

def _project_root(payload=None):
 env_dir=os.environ.get('CLAUDE_PROJECT_DIR') or (payload or {}).get('cwd')
 if env_dir:return Path(env_dir).resolve()
 repo_candidate=Path(__file__).resolve().parents[2]
 if (repo_candidate/'.git').exists():return repo_candidate
 return Path(os.getcwd()).resolve()

ACTIVE_SUBAGENT_TTL = 1800
_SUBAGENT_TYPES = ('subagent','local_agent','agent','in_process_teammate','remote_agent')
_ACTIVE_STATUSES = ('running','in_progress','pending','queued','starting')


def _active_subagents_file(root,sid):
 if not sid:return None
 try:
  res=subprocess.run(['git','rev-parse','--git-path','native-worker-wait/active-'+hashlib.sha256(sid.encode()).hexdigest()+'.json'],cwd=root,capture_output=True,text=True)
  if res.returncode!=0 or not res.stdout.strip():return None
  p=Path(res.stdout.strip())
  return p if p.is_absolute() else (root/p)
 except Exception:
  return None


def record_subagent_event(payload,started):
 sid=_session_id(payload)
 if not sid:return
 root=_project_root(payload)
 p=_active_subagents_file(root,sid)
 if p is None:return
 aid=str(payload.get('agent_id') or payload.get('subagent_id') or payload.get('task_id') or '').strip()
 if not aid:return
 now=time.time()
 try:
  data=json.loads(p.read_text()) if p.is_file() else {}
  if not isinstance(data,dict):data={}
 except Exception:
  data={}
 data={k:v for k,v in data.items() if isinstance(v,dict) and now-float(v.get('startedAt',0))<=ACTIVE_SUBAGENT_TTL}
 if started:
  data[aid]={'startedAt':now,'agentType':str(payload.get('agent_type') or payload.get('subagent_type') or '')}
 else:
  data.pop(aid,None)
 try:
  p.parent.mkdir(parents=True,exist_ok=True)
  p.write_text(json.dumps(data))
 except Exception:
  pass


def _has_active_tracked_subagent(root,sid):
 p=_active_subagents_file(root,sid)
 if p is None or not p.is_file():return False
 now=time.time()
 try:
  data=json.loads(p.read_text())
  if not isinstance(data,dict):return False
  return any(isinstance(v,dict) and now-float(v.get('startedAt',0))<=ACTIVE_SUBAGENT_TTL for v in data.values())
 except Exception:
  return False


def running(payload):
 if payload.get('hook_event_name')!='Stop':return False
 sid=_session_id(payload);tag=worker_tag(payload);tasks=payload.get('background_tasks')
 if not sid or not tag:return False
 root=_project_root(payload)
 if tasks is None:
  return _has_active_tracked_subagent(root,sid)
 if not isinstance(tasks,list):return False
 bound=_load_bound_descriptions(root,sid)
 for t in tasks:
  if not isinstance(t,dict):continue
  ttype=str(t.get('type') or t.get('task_type') or '').strip().lower()
  if ttype not in _SUBAGENT_TYPES:continue
  status=t.get('status')
  if status is not None and str(status).strip().lower() not in _ACTIVE_STATUSES:continue
  desc=t.get('description') or t.get('name')
  if not isinstance(desc,str) or not desc.strip():continue
  if tag in desc:return True
  clean=desc.strip()
  if bound and any(clean==b or clean.startswith(b+' ') for b in bound):return True
 return False

def bind(payload):
 if payload.get('tool_name') not in ('Agent','Task'):return
 root=_project_root(payload)
 # A recovered final search decision needs only mechanical completion.
 sid=os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID') or payload.get('session_id')
 if sid:
  import subprocess
  result=subprocess.run(['git','rev-parse','--git-path','search-gap-continuation/'+hashlib.sha256(sid.encode()).hexdigest()+'.json'],cwd=root,capture_output=True,text=True)
  marker=Path(result.stdout.strip()) if result.returncode==0 else None
  if marker and not marker.is_absolute():marker=root/marker
  if marker and marker.is_file():
   saved=json.loads(marker.read_bytes());file=(root/saved['completionFile']).resolve()
   if not file.is_relative_to(root/'reports') or not file.is_file():
    print('Restore the exact retained search completion before dispatch.',file=sys.stderr);raise SystemExit(2)
   same_bytes=hashlib.sha256(file.read_bytes()).hexdigest()==saved['sha256']
   if not same_bytes:
    try:comp=json.loads(file.read_bytes())
    except Exception:comp={}
    if not (isinstance(comp,dict) and comp.get('runId')==saved.get('runId') and saved.get('chartReview') and comp.get('chartReview')==saved.get('chartReview')):
     print('Restore the exact retained search completion before dispatch.',file=sys.stderr);raise SystemExit(2)
   value=payload.get('tool_input',{});role=str(value.get('subagent_type','')).lower();description=str(value.get('description','')).lower()
   non_audit_editorial=any(word in role or word in description for word in ('writer','write','chart','decision review'))
   repeat_build='build' in role or ('build' in description and 'preview' not in description)
   supplemental_audit=('audit' in role or 'audit' in description) and not non_audit_editorial and not repeat_build
   if non_audit_editorial or repeat_build or (not supplemental_audit and 'audit' in (role+' '+description)):
    print('This search job already has its independent final decisions. Reuse '+saved['completionFile']+' and perform only the separate-preview reconciliation, supplemental route/drift audit if required, and native finish. Preserve all reviews and counters.',file=sys.stderr);raise SystemExit(2)
 hype=root/'scripts/hype_radar/handoff.py'
 if hype.is_file() and (hype.parent/'production_recovery.py').is_file():
  spec=importlib.util.spec_from_file_location('native_hype_dispatch',hype)
  radar=importlib.util.module_from_spec(spec);spec.loader.exec_module(radar)
  if hasattr(radar,'guard_paid_dispatch'):
   try:radar.guard_paid_dispatch(root,payload)
   except ValueError as error:
    print(str(error),file=sys.stderr);raise SystemExit(2)
 helper=root/'.claude/tools/competitor-handoff.py'
 inline=False
 if helper.is_file() and worker_tag(payload):
  spec=importlib.util.spec_from_file_location('competitor_release_lane',helper)
  monitor=importlib.util.module_from_spec(spec);spec.loader.exec_module(monitor)
  inline=monitor.active(root,payload) is not None
  try:monitor.guard_recovered_stage(root,payload)
  except ValueError as error:
   print(str(error),file=sys.stderr);raise SystemExit(2)
 value=payload.get('tool_input',{});tag=worker_tag(payload)
 if not tag or not isinstance(value,dict):return
 if sid and not value.get('resume') and os.environ.get('ALLOW_COLD_MINDMAP_STAGE_RESPAWN')!='1':
  stage=_normalize_mindmap_stage(value.get('subagent_type'))
  if stage is not None:
   prior=_find_prior_stage_worker(root,sid,stage)
   if prior is not None:
    stype=str(value.get('subagent_type') or f'mindmap-{stage}')
    pdesc=str(prior.get('description') or stype)
    print(
     f'BLOCKED: A warm {stype} worker ("{pdesc}") already ran in this session and created preflight-{stage}. '
     f'Never cold-spawn a second {stype} subagent via Agent for Round-2 rework or Batch 2+ — '
     f'use SendMessage (to your existing warm {stype} agentId) or Agent(resume: <agentId>) with --reuse <prev_preflight_dir> '
     f'so unchanged rules stay in context at zero reread cost!',
     file=sys.stderr,
    )
    raise SystemExit(2)
 description=value.get('description')
 if isinstance(description,str) and description.strip():
  _record_bound_worker(root,sid,description,value.get('subagent_type',''))
 pmode=str(payload.get('permission_mode') or '').lower()
 if pmode.startswith('auto') or pmode=='bypasspermissions':return
 if not inline and value.get('run_in_background') is False and 'permission_mode' in payload:return
 if not isinstance(description,str) or not description.strip():return
 # Competitor jobs join once in the foreground. Keep permission, model and worker identity.
 updated=dict(value,description=description if tag in description else description+' '+tag)
 if inline:updated['run_in_background']=False
 if updated==value:return
 print(json.dumps({'hookSpecificOutput':{'hookEventName':'PreToolUse','updatedInput':updated}}))

if __name__=='__main__':
 cmd=sys.argv[1:]
 if cmd==['bind']:
  bind(json.load(sys.stdin))
 elif cmd==['subagent-start']:
  try:record_subagent_event(json.load(sys.stdin),True)
  except Exception:pass
 elif cmd==['subagent-stop']:
  try:record_subagent_event(json.load(sys.stdin),False)
  except Exception:pass
 else:
  raise SystemExit('Use bind | subagent-start | subagent-stop')
