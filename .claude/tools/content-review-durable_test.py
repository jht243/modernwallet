"""Real bare-Git restart tests; synthetic evidence and no provider calls."""
import importlib.util,json,shutil,subprocess,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('durable_fixture',Path(__file__).with_name('content-review-policy_test.py'))
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f);p=f.p
class Tests(unittest.TestCase):
 def setUp(self):
  self.fixture=f.Tests();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups);self.root=self.fixture.root
  self.remote=self.root/'remote.git';subprocess.run(['git','init','--bare','-q',str(self.remote)],check=True)
  subprocess.run(['git','remote','add','origin',str(self.remote)],cwd=self.root,check=True)
  tools=self.root/'.claude/tools';tools.mkdir(exist_ok=True);shutil.copyfile(Path(__file__).with_name('workflow-control-store.py'),tools/'workflow-control-store.py')
 def fresh(self,name):
  fresh=self.root/name;subprocess.run(['git','clone','-q',str(self.remote),str(fresh)],check=True,capture_output=True)
  shutil.copytree(self.root/'.claude',fresh/'.claude');return fresh
 def test_restart_resumes_pending_ticket_without_a_new_round(self):
  admission=self.fixture.reserve(1);fresh=self.fresh('fresh')
  snapshot=fresh/'reports/current.json';snapshot.parent.mkdir(exist_ok=True);snapshot.write_bytes(self.fixture.snapshot_path.read_bytes())
  resumed=p.reserve(fresh,snapshot,'/guide','fixture-job','independent',fresh/'reports/new-name.json')
  self.assertEqual(resumed['number'],1);self.assertEqual(resumed['admissionArtifact'],admission['admissionArtifact'])
  self.assertEqual((fresh/admission['admissionArtifact']['path']).read_bytes(),(self.root/admission['admissionArtifact']['path']).read_bytes())
 def test_actual_recorded_failure_and_counter_survive_a_clean_checkout(self):
  admission=self.fixture.reserve(1);report=self.fixture.report(admission,'FAIL');path=self.fixture.put('reports/real-failure.json',report);p.record(self.root,path)
  fresh=self.fresh('after-failure');snapshot=fresh/'reports/next.json';snapshot.parent.mkdir(exist_ok=True);snapshot.write_text(json.dumps(self.fixture.snapshot('changed synthetic revision')))
  next_ticket=p.reserve(fresh,snapshot,'/guide','fixture-job','independent',fresh/'reports/next-admission.json')
  self.assertEqual(next_ticket['number'],2)
  with p.Journal(fresh,'https://example.com','/guide') as journal:
   self.assertEqual(journal.cycle['rounds'][0]['verdict'],'FAIL');self.assertEqual(len(journal.cycle['rounds']),2)
   self.assertEqual(p.read(p.artifact(fresh,journal.cycle['rounds'][0]['report'])),report)
 def test_partial_real_result_is_retained_when_another_route_is_invalid(self):
  admission=self.fixture.reserve(1);report=self.fixture.report(admission,'PASS');report['routes'].append({'path':'/bad','verdict':'PASS'})
  path=self.fixture.put('reports/mixed-result.json',report)
  with self.assertRaises(ValueError):p.record(self.root,path)
  with p.Journal(self.root,'https://example.com','/guide') as original:
   partial_pass=original.cycle['rounds'][0].get('verdict')=='PASS'
  fresh=self.fresh('after-partial');snapshot=fresh/'reports/current.json';snapshot.parent.mkdir(exist_ok=True);snapshot.write_bytes(self.fixture.snapshot_path.read_bytes())
  if partial_pass:
   with self.assertRaisesRegex(ValueError,'already passed'):p.reserve(fresh,snapshot,'/guide','fixture-job','independent',fresh/'reports/no-extra-round.json')
  else:
   # Preserve native all-or-nothing validation: a rejected batch invented no PASS.
   self.assertEqual(p.reserve(fresh,snapshot,'/guide','fixture-job','independent',fresh/'reports/same-ticket.json')['number'],1)
  with p.Journal(fresh,'https://example.com','/guide') as journal:self.assertEqual(len(journal.cycle['rounds']),1)
if __name__=='__main__':unittest.main()
