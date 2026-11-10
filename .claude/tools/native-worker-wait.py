#!/usr/bin/env python3
"""Let a native parent pause for its own finite worker; never approve output."""
import hashlib,json,os,sys,importlib.util
from pathlib import Path

def worker_tag(payload=None):
 sid=os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID') or (payload or {}).get('session_id')
 return '[workflow-parent:'+hashlib.sha256(sid.encode()).hexdigest()[:12]+']' if sid else None

def running(payload):
 if payload.get('hook_event_name')!='Stop':return False
 tag=worker_tag(payload);tasks=payload.get('background_tasks')
 if not tag or not isinstance(tasks,list):return False
 return any(isinstance(t,dict) and t.get('type')=='subagent' and t.get('status')=='running'
            and isinstance(t.get('description'),str) and tag in t['description'] for t in tasks)

def bind(payload):
 if payload.get('tool_name') not in ('Agent','Task'):return
 root=Path(os.environ.get('CLAUDE_PROJECT_DIR') or os.getcwd()).resolve()
 # A recovered final search decision needs only mechanical completion.
 sid=os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID') or os.environ.get('CLAUDE_CODE_SESSION_ID') or payload.get('session_id')
 if sid:
  import subprocess
  result=subprocess.run(['git','rev-parse','--git-path','search-gap-continuation/'+hashlib.sha256(sid.encode()).hexdigest()+'.json'],cwd=root,capture_output=True,text=True)
  marker=Path(result.stdout.strip()) if result.returncode==0 else None
  if marker and not marker.is_absolute():marker=root/marker
  if marker and marker.is_file():
   saved=json.loads(marker.read_bytes());file=(root/saved['completionFile']).resolve()
   if not file.is_relative_to(root/'reports') or hashlib.sha256(file.read_bytes()).hexdigest()!=saved['sha256']:
    print('Restore the exact retained search completion before dispatch.',file=sys.stderr);raise SystemExit(2)
   value=payload.get('tool_input',{});role=str(value.get('subagent_type','')).lower();description=str(value.get('description','')).lower()
   editorial=any(word in role or word in description for word in ('writer','write','audit','chart','decision review'))
   repeat_build='build' in role or ('build' in description and 'preview' not in description)
   if editorial or repeat_build:
    print('This search job already has its independent final decisions. Reuse '+saved['completionFile']+' and perform only the separate-preview reconciliation and native finish. Preserve all reviews and counters.',file=sys.stderr);raise SystemExit(2)
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
 description=value.get('description')
 if not isinstance(description,str) or not description.strip():return
 # Competitor jobs join once in the foreground. Keep permission, model and worker identity.
 updated=dict(value,description=description if tag in description else description+' '+tag)
 if inline:updated['run_in_background']=False
 if updated==value:return
 print(json.dumps({'hookSpecificOutput':{'hookEventName':'PreToolUse','updatedInput':updated}}))

if __name__=='__main__':
 if sys.argv[1:]!=['bind']:raise SystemExit('Use the native bind hook')
 bind(json.load(sys.stdin))
