"""Final report timing against real helper fixtures; no network requests."""
import contextlib,importlib.util,io,json,shutil,subprocess,sys,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('report_fixtures',Path(__file__).with_name('competitor-handoff_test.py'))
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
h=f.h
class Tests(unittest.TestCase):
 def setUp(self):
  self.fixture=f.Tests();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups)
  self.root=self.fixture.root
  self.request={'session_id':'synthetic-owner','tool_input':{'command':'curl https://fixture.invalid/api/routine-run --data @final.json'}}
 def test_pending_recoverable_work_cannot_be_reported_as_a_final_failure(self):
  with contextlib.redirect_stderr(io.StringIO()),self.assertRaises(SystemExit) as error:h.report_guard(self.root,self.request)
  self.assertEqual(error.exception.code,2)
 def test_completed_original_handoff_can_submit_its_final_report(self):
  self.fixture.approve()
  rows={c['url']:{'disposition':'skipped-low-value'} for c in self.fixture.payload['candidates']}
  h.complete(self.root,h.record(self.root,{'dispositions':rows}));h.report_guard(self.root,self.request)
 def test_validated_native_hold_can_report_without_closing_the_intake(self):
  evidence=self.root/'actual-fixture-error.json';evidence.write_text('{"synthetic":true,"exitCode":1}')
  value={'intakeSha256':self.fixture.path.stem,'status':'blocked','blockingKind':'external-service','recoveryAttempted':True,
         'reason':'Synthetic fixture: an actual preserved external service error remained after bounded native recovery.',
         'nextAction':'Synthetic fixture: retry the exact saved operation with its original identity after external service recovery.',
         'evidence':[{'path':evidence.name,'sha256':h.sha(evidence.read_bytes())}]}
  path=self.root/'hold.json';path.write_text(json.dumps(value));h.blocked(self.root,path)
  h.report_guard(self.root,self.request);self.assertEqual(h.pending(self.root),self.fixture.path)
 def test_unrelated_commands_do_not_acquire_a_reporting_gate(self):
  h.report_guard(self.root,{'session_id':'synthetic-owner','tool_input':{'command':'python3 prepare.py'}})
 def test_status_command_does_not_wait_for_hook_input(self):
  script=self.root/'.claude/tools/competitor-handoff.py';shutil.copyfile(Path(__file__).with_name('competitor-handoff.py'),script)
  result=subprocess.run([sys.executable,str(script),'status'],cwd=self.root,input='',capture_output=True,text=True,timeout=2)
  self.assertEqual(result.returncode,0,result.stderr)
  self.assertEqual(json.loads(result.stdout)['status'],'pending')
if __name__=='__main__':unittest.main()
