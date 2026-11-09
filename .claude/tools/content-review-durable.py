"""Retain actual review journals and dependencies across disposable checkouts.

This stores existing evidence only; it never creates a verdict or a review round.
"""
from pathlib import Path
import importlib.util,json,os,subprocess,hashlib
REF='refs/heads/automation/content-review-journals'
def sha(raw):return hashlib.sha256(raw).hexdigest()
def require(ok,message):
 if not ok:raise ValueError(message)
def backend(root):
 path=root/'.claude/tools/workflow-control-store.py'
 cloud=bool(os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID'))
 origin=subprocess.run(['git','remote','get-url','origin'],cwd=root,capture_output=True)
 if origin.returncode:
  require(not cloud,'Restore the cloud review checkpoint origin before reserving another audit');return None
 require(path.is_file(),'Restore the existing durable review backend before reserving another audit')
 spec=importlib.util.spec_from_file_location('durable_review_store',path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 return m,m.Store(root,ref=REF)
def restore(root,journal):
 connection=backend(root)
 if connection is None:return None
 module,store=connection;revision,state=store.read();entry=state.get('reviewJournals',{}).get(journal.key)
 head=entry.get('head') if entry else None
 if entry:
  paths=entry['artifacts'];rel=str(journal.path.relative_to(root));require(paths.get(rel)==head,'Durable review identity changed')
  for name,expected in paths.items():
   target=(root/name).resolve();require(root.resolve() in target.parents and name.startswith('reports/'),'Internal review evidence only')
   raw=module.git(root,'show',revision+':artifacts/'+expected).stdout;require(sha(raw)==expected,'Durable review artifact changed')
   if target.exists():
    current=target.read_bytes()
    if name==rel:
     require(raw.startswith(current) or current.startswith(raw),'Divergent review histories; preserve both before continuation')
     if current.startswith(raw):continue
    else:require(current==raw,'Restore the exact prior independent review evidence: '+name);continue
   target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
 return {'module':module,'store':store,'expectedHead':head,'key':journal.key}
def collect(root,journal):
 paths={};seen=set()
 def file(name,expected=None):
  target=(root/name).resolve()
  if root.resolve() not in target.parents or not str(target.relative_to(root)).startswith('reports/'):return
  require(target.is_file() or expected is None,'Missing actual review dependency before checkpoint: '+name)
  if not target.is_file():return
  name=str(target.relative_to(root));raw=target.read_bytes()
  if expected:require(sha(raw)==expected,'Review dependency changed before checkpoint: '+name)
  paths[name]=sha(raw)
  if name in seen:return
  seen.add(name)
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
 file(str(journal.path.relative_to(root)))
 for line in journal.path.read_bytes().splitlines():visit(json.loads(line))
 return paths
def checkpoint(root,journal,context):
 if context is None or not journal.path.is_file():return
 paths=collect(root,journal);rel=str(journal.path.relative_to(root));head=paths[rel];expected=context['expectedHead']
 def retain(state):
  entries=state.setdefault('reviewJournals',{});current=entries.get(journal.key,{}).get('head')
  require(current in (expected,head),'Another worker advanced this canonical review; restore its actual history before retrying')
  state.setdefault('job',{'artifacts':{}})
  if state['job'] is None:state['job']={'artifacts':{}}
  entries[journal.key]={'identity':journal.identity,'head':head,'artifacts':paths}
 context['store'].mutate(retain,list(paths));context['expectedHead']=head


def main():
 import argparse
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('command',choices=['checkpoint']);parser.add_argument('--canonical-base',required=True);parser.add_argument('--route',required=True);args=parser.parse_args()
 root=Path(__file__).resolve().parents[2];path=Path(__file__).with_name('content-review-policy.py')
 spec=importlib.util.spec_from_file_location('checkpoint_actual_review_policy',path);policy=importlib.util.module_from_spec(spec);spec.loader.exec_module(policy)
 journal=policy.Journal(root,args.canonical_base,args.route);context=restore(root,journal)
 require(context is not None,'An actual native Git checkpoint origin is required')
 with journal as actual:require(bool(actual.events),'No actual review history exists to checkpoint')
 checkpoint(root,journal,context)
 print(json.dumps({'status':'actual-review-history-checkpointed','identity':journal.identity,'scope':'Existing journal/evidence only; no new review, verdict or publication.'}))

if __name__=='__main__':main()
