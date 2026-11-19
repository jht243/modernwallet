"""Actual Stop pause semantics keep completion/report gates intact."""
import contextlib,copy,importlib.util,io,json,unittest,os
from unittest.mock import patch
from pathlib import Path
spec=importlib.util.spec_from_file_location('worker_fixtures',Path(__file__).with_name('competitor-handoff_test.py'))
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f);h=f.h
class Tests(unittest.TestCase):
 def setUp(self):
  self.fixture=f.Tests();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups);self.root=self.fixture.root
 def payload(self):return {'session_id':'synthetic-owner','hook_event_name':'Stop','stop_hook_active':False,'background_tasks':[{'id':'fixture-worker','type':'subagent','status':'running','description':'Independent reviewer '+h.worker_tag(self.fixture.path)}]}
 def output(self,payload):
  out=io.StringIO()
  with contextlib.redirect_stdout(out):h.stop(self.root,payload)
  return out.getvalue()
 def test_running_owned_reviewer_pauses_without_closing_or_passing(self):
  before=self.fixture.path.read_bytes();self.assertEqual(self.output(self.payload()),'')
  self.assertFalse(self.fixture.path.with_suffix('.done.json').exists());self.assertEqual(self.fixture.path.read_bytes(),before)
  self.assertEqual(h.status(self.root)['status'],'pending')
 def test_repeated_stop_reminder_preserves_unfinished_job(self):
  payload=self.payload();payload.update(stop_hook_active=True,background_tasks=[])
  self.assertEqual(self.output(payload),'');self.assertEqual(h.status(self.root)['status'],'pending')
 def test_terminal_worker_wakes_into_required_completion_gate(self):
  for state in ['completed','failed','cancelled','blocked']:
   payload=self.payload();payload['background_tasks'][0]['status']=state
   self.assertEqual(json.loads(self.output(payload))['decision'],'block')
 def test_unrelated_or_missing_task_registry_cannot_release_pending_work(self):
  for task in [None,[],[{'type':'subagent','status':'running','description':'Unrelated task'}],[{'type':'shell','status':'running','description':h.worker_tag(self.fixture.path)}],[{'type':'subagent','status':'running','description':None}]]:
   payload=self.payload();payload['background_tasks']=task
   self.assertEqual(json.loads(self.output(payload))['decision'],'block')
 def test_report_cannot_use_worker_pause_as_completion(self):
  payload=self.payload();payload['hook_event_name']='PreToolUse';payload['tool_input']={'command':'curl https://fixture.invalid/api/routine-run'}
  with contextlib.redirect_stderr(io.StringIO()),self.assertRaises(SystemExit) as e:h.report_guard(self.root,payload)
  self.assertEqual(e.exception.code,2)
 def test_binding_preserves_prompt_model_permissions_and_resume(self):
  inputs={'description':'Independent Phase 4 review','prompt':'Synthetic fixture only','model':'unchanged-fixture-model','resume':'actual-fixture-worker','mode':'unchanged-fixture-mode'}
  payload={'session_id':'synthetic-owner','tool_name':'Agent','tool_input':copy.deepcopy(inputs)};out=io.StringIO()
  with contextlib.redirect_stdout(out):h.bind_worker(self.root,payload)
  value=json.loads(out.getvalue())['hookSpecificOutput'];updated=value['updatedInput'];self.assertNotIn('permissionDecision',value)
  self.assertEqual({k:v for k,v in updated.items() if k!='description'},{k:v for k,v in inputs.items() if k!='description'})
  self.assertIn(h.worker_tag(self.fixture.path),updated['description']);self.assertEqual(payload['tool_input'],inputs)
 def test_verified_release_only_blocks_stale_write_and_repeat_audit(self):
  target=h.marker(self.root,'release-synthetic-owner'+self.fixture.path.stem).with_suffix('.json')
  target.parent.mkdir(parents=True,exist_ok=True)
  value={'jobId':'fixture-job','publishHandoff':{'path':'reports/publish.json'},'review':{'path':'reports/review.json'}}
  h.replace_pointer(target,value)
  for desc in ['Refresh WRITE instructions','Audit original page again','Build competitor preparation']:
   with self.assertRaisesRegex(ValueError,'Only dispatch PUBLISH'):h.guard_recovered_stage(self.root,{'tool_input':{'description':desc}})
  h.guard_recovered_stage(self.root,{'tool_input':{'description':'Publish approved content'}})
  value['changedRoutes']=['/changed'];h.replace_pointer(target,value)
  h.guard_recovered_stage(self.root,{'tool_input':{'description':'Audit changed page'}})
 def test_other_tool_cannot_bind_a_worker(self):
  payload={'session_id':'different-owner','tool_name':'Bash','tool_input':{'description':'Another task'}};out=io.StringIO()
  with patch.dict(os.environ,{'CLAUDE_CODE_SESSION_ID':'different-owner'}),contextlib.redirect_stdout(out):h.bind_worker(self.root,payload)
  self.assertEqual(out.getvalue(),'')
 def test_empty_registry_after_failure_does_not_reset_original_state(self):
  self.fixture.approve();proof=self.fixture.path.with_suffix('.chart.json');before=proof.read_bytes()
  payload=self.payload();payload['background_tasks']=[];self.assertIn('block',self.output(payload));self.assertEqual(proof.read_bytes(),before)
 def test_subagent_start_stop_tracks_active_worker_when_background_tasks_omitted(self):
  spec=importlib.util.spec_from_file_location('nww_test',Path(__file__).with_name('native-worker-wait.py'))
  nww=importlib.util.module_from_spec(spec);spec.loader.exec_module(nww)
  base={'session_id':'synthetic-owner','cwd':str(self.root),'agent_id':'agent-build-1','agent_type':'mindmap-build'}
  stop_no_tasks={'session_id':'synthetic-owner','cwd':str(self.root),'hook_event_name':'Stop','stop_hook_active':False}
  self.assertFalse(nww.running(stop_no_tasks))
  nww.record_subagent_event(base,True)
  self.assertTrue(nww.running(stop_no_tasks))
  self.assertFalse(nww.running({**stop_no_tasks,'background_tasks':[]}))
  nww.record_subagent_event(base,False)
  self.assertFalse(nww.running(stop_no_tasks))
  # Expanded subagent types and pending status work; shell still rejected
  p_agent=self.payload();p_agent['background_tasks'][0].update(type='agent',status='pending')
  self.assertEqual(self.output(p_agent),'')
if __name__=='__main__':unittest.main()
