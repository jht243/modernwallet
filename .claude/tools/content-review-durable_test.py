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
 def test_closed_unpublished_search_gap_cycle_retires_preserving_evidence_but_active_or_published_blocks(self):
  import os
  from unittest.mock import patch
  snap1=self.fixture.put('reports/sg-old.json',self.fixture.snapshot('abandoned search gap draft'))
  p.reserve(self.root,snap1,'/guide','search-gap-af1233d99e49','independent',self.root/'reports/sg-adm1.json')
  def fake_urlopen(rows):
   class Resp:
    def __enter__(s):return s
    def __exit__(s,*a):return False
    def read(s):return json.dumps(rows).encode()
   return lambda *a,**k:Resp()
  active_rows=[{'run_id':'oldrun1234','status':'active','packet_text':json.dumps({'candidates':[{'id':'af1233d99e490000'}]}),'parked':None}]
  closed_pub_rows=[{'run_id':'oldrun1234','status':'owner-closed','packet_text':json.dumps({'candidates':[{'id':'af1233d99e490000'}]}),'parked':{'published':{'af1233d99e490000':['/guide']},'restart':[]}}]
  closed_restarted_rows=[{'run_id':'oldrun1234','status':'owner-closed','packet_text':json.dumps({'candidates':[{'id':'af1233d99e490000'}]}),'parked':{'published':{},'restart':['af1233d99e490000']}}]
  with patch.dict(os.environ,{'SUPABASE_URL':'https://example.supabase.co','SUPABASE_SERVICE_ROLE_KEY':'srv-key'}):
   fresh_active=self.fresh('sg-active');snap_a=fresh_active/'reports/new.json';snap_a.parent.mkdir(exist_ok=True);snap_a.write_text(json.dumps(self.fixture.snapshot('fresh retry draft')))
   with patch('urllib.request.urlopen',side_effect=fake_urlopen(active_rows)):
    with self.assertRaisesRegex(ValueError,'Resume the existing canonical page job'):
     p.reserve(fresh_active,snap_a,'/guide','search-gap-newjob999999','independent',fresh_active/'reports/new-adm.json')
   fresh_pub=self.fresh('sg-pub');snap_p=fresh_pub/'reports/new.json';snap_p.parent.mkdir(exist_ok=True);snap_p.write_text(json.dumps(self.fixture.snapshot('fresh retry draft')))
   with patch('urllib.request.urlopen',side_effect=fake_urlopen(closed_pub_rows)):
    with self.assertRaisesRegex(ValueError,'Resume the existing canonical page job'):
     p.reserve(fresh_pub,snap_p,'/guide','search-gap-newjob999999','independent',fresh_pub/'reports/new-adm.json')
   fresh_ok=self.fresh('sg-restarted');snap_ok=fresh_ok/'reports/new.json';snap_ok.parent.mkdir(exist_ok=True);snap_ok.write_text(json.dumps(self.fixture.snapshot('fresh retry draft')))
   with patch('urllib.request.urlopen',side_effect=fake_urlopen(closed_restarted_rows)):
    admitted=p.reserve(fresh_ok,snap_ok,'/guide','search-gap-newjob999999','independent',fresh_ok/'reports/new-adm.json')
    self.assertEqual(admitted['number'],1)
    self.assertEqual(admitted['jobId'],'search-gap-newjob999999')
   spec_s=importlib.util.spec_from_file_location('wcs_check',fresh_ok/'.claude/tools/workflow-control-store.py')
   wcs=importlib.util.module_from_spec(spec_s);spec_s.loader.exec_module(wcs)
   _,remote_state=wcs.Store(fresh_ok,ref='refs/heads/automation/content-review-journals').read()
   self.assertEqual(len(remote_state.get('retiredSearchGapJournals',{})),1)
if __name__=='__main__':unittest.main()
