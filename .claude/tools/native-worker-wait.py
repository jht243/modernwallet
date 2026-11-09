#!/usr/bin/env python3
"""Let a native parent pause for its own finite worker; never approve output."""
import hashlib,json,os,sys

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
 if payload.get('tool_name')!='Agent':return
 value=payload.get('tool_input',{});tag=worker_tag(payload)
 if not tag or not isinstance(value,dict):return
 description=value.get('description')
 if not isinstance(description,str) or not description.strip() or tag in description:return
 # Metadata only: do not emit a permission decision or change model, prompt,
 # blocking mode, resume identity, or any native security/approval field.
 updated=dict(value,description=description+' '+tag)
 print(json.dumps({'hookSpecificOutput':{'hookEventName':'PreToolUse','updatedInput':updated}}))

if __name__=='__main__':
 if sys.argv[1:]!=['bind']:raise SystemExit('Use the native bind hook')
 bind(json.load(sys.stdin))
