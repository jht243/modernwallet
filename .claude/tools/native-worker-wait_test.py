import contextlib,importlib.util,io,json,os,shutil,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('native_wait',HERE/'native-worker-wait.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Tests(unittest.TestCase):
 def setUp(self):
  env=patch.dict(os.environ,{'CLAUDE_CODE_REMOTE_SESSION_ID':'synthetic-parent','CLAUDE_CODE_SESSION_ID':''});env.start();self.addCleanup(env.stop)
 def payload(self):return {'hook_event_name':'Stop','background_tasks':[{'id':'fixture-task','type':'subagent','status':'running','description':'Independent audit '+m.worker_tag()}]}
 def test_only_owned_running_finite_worker_can_pause(self):
  self.assertTrue(m.running(self.payload()))
  for key,values in [('status',['completed','failed','cancelled','blocked']),('type',['shell','monitor','workflow']),('description',['Unrelated reviewer',None])]:
   for value in values:
    p=self.payload();p['background_tasks'][0][key]=value;self.assertFalse(m.running(p))
 def test_different_parent_missing_registry_and_reporting_stay_closed(self):
  p=self.payload()
  with patch.dict(os.environ,{'CLAUDE_CODE_REMOTE_SESSION_ID':'another-parent'}):self.assertFalse(m.running(p))
  for value in [None,[],{}]:p=self.payload();p['background_tasks']=value;self.assertFalse(m.running(p))
  p=self.payload();p['hook_event_name']='PreToolUse';self.assertFalse(m.running(p))
 def test_binding_cannot_change_native_permissions_or_work(self):
  original={'description':'Independent reviewer','prompt':'Synthetic fixture only','model':'unchanged','run_in_background':False,'resume':'unchanged'};p={'tool_name':'Agent','tool_input':original};out=io.StringIO()
  with contextlib.redirect_stdout(out):m.bind(p)
  result=json.loads(out.getvalue())['hookSpecificOutput'];self.assertNotIn('permissionDecision',result)
  updated=result['updatedInput'];self.assertEqual({k:v for k,v in updated.items() if k!='description'},{k:v for k,v in original.items() if k!='description'})
 def test_hype_stop_pauses_without_releasing_its_final_report(self):
  script=HERE.parents[1]/'scripts/hype_radar/handoff.py'
  if not script.exists():self.skipTest('No native Hype caller in this repository')
  spec=importlib.util.spec_from_file_location('hype_wait_fixture',script);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
  with tempfile.TemporaryDirectory() as directory:
   root=Path(directory);tools=root/'.claude/tools';tools.mkdir(parents=True);shutil.copyfile(HERE/'native-worker-wait.py',tools/'native-worker-wait.py');source=root/'original.json'
   with patch.object(h,'active_pull',return_value=source):
    out=io.StringIO()
    with contextlib.redirect_stdout(out):h.stop(root,self.payload())
    self.assertEqual(out.getvalue(),'')
    payload=self.payload();payload['hook_event_name']='PreToolUse';payload['tool_input']={'command':'curl https://fixture.invalid/api/routine-run'}
    with contextlib.redirect_stderr(io.StringIO()),self.assertRaises(SystemExit):h.report_guard(root,payload)
 def test_auto_permission_mode_emits_no_updated_input_so_classifier_never_blocks(self):
  original={'description':'Build fast scope chart','prompt':'Synthetic fixture only','run_in_background':False}
  out=io.StringIO()
  with contextlib.redirect_stdout(out):m.bind({'tool_name':'Agent','permission_mode':'auto','tool_input':original})
  self.assertEqual(out.getvalue(),'')
 def test_continuation_marker_blocks_write_and_chart_but_allows_supplemental_audit(self):
  import subprocess
  with tempfile.TemporaryDirectory() as directory:
   root=Path(directory);subprocess.run(['git','init','-q'],cwd=root,check=True)
   comp=root/'reports/search-gap/comp.json';comp.parent.mkdir(parents=True)
   comp.write_text(json.dumps({'runId':'r1','chartReview':'reports/search-gap/cr.json'}))
   sha=m.hashlib.sha256(comp.read_bytes()).hexdigest()
   sid_sha=m.hashlib.sha256(b'synthetic-parent').hexdigest()
   marker=root/'.git/search-gap-continuation'/(sid_sha+'.json');marker.parent.mkdir(parents=True)
   marker.write_text(json.dumps({'completionFile':'reports/search-gap/comp.json','sha256':sha,'runId':'r1','chartReview':'reports/search-gap/cr.json'}))
   with patch.dict(os.environ,{'CLAUDE_PROJECT_DIR':str(root)}):
    for blocked_role in ('mindmap-write','mindmap-build','mindmap-chart-review'):
     with contextlib.redirect_stderr(io.StringIO()),self.assertRaises(SystemExit):
      m.bind({'tool_name':'Agent','permission_mode':'auto','tool_input':{'subagent_type':blocked_role,'description':'Run stage'}})
    out=io.StringIO()
    with contextlib.redirect_stdout(out):
     m.bind({'tool_name':'Agent','permission_mode':'auto','tool_input':{'subagent_type':'mindmap-audit','description':'Supplemental route audit'}})
    self.assertEqual(out.getvalue(),'')
if __name__=='__main__':unittest.main()
