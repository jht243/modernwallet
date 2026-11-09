"""Mechanical migration never manufactures PASS or admits stale new reviews."""
import importlib.util,json,unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('compatibility_fixture',Path(__file__).with_name('content-review-policy_test.py'))
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f);p=f.p
class Tests(unittest.TestCase):
 def setUp(self):
  self.fixture=f.Tests();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups);self.root=self.fixture.root
 def recorded(self,record=True):
  with patch.object(p,'policy_hash',return_value='1'*64):
   admission=self.fixture.reserve(1);report=self.fixture.report(admission,'PASS');path=self.fixture.put('reports/original-review.json',report)
   if record:p.record(self.root,path)
  self.fixture.config['compatiblePolicies']=[{'sha256':'1'*64,'commit':'3'*40,'reason':'Synthetic mechanical-only migration fixture; preserve the exact real prior judgment, never invent a verdict.'}]
  self.fixture.put(p.CONFIG,self.fixture.config);return report
 def test_exact_recorded_pass_survives_mechanical_policy_hash_change(self):
  report=self.recorded()
  with patch.object(p,'policy_hash',return_value='2'*64):self.assertTrue(p.check_rendered(self.root,self.fixture.snap,report))
  with p.Journal(self.root,'https://example.com','/guide') as journal:self.assertEqual(len(journal.cycle['rounds']),1)
 def test_compatibility_does_not_approve_an_unrecorded_verdict(self):
  report=self.recorded(record=False)
  with patch.object(p,'policy_hash',return_value='2'*64),self.assertRaises(ValueError):p.check_rendered(self.root,self.fixture.snap,report)
 def test_new_reservations_still_require_current_snapshot_policy(self):
  self.recorded()
  with patch.object(p,'policy_hash',return_value='2'*64),self.assertRaisesRegex(ValueError,'current Mindmap candidate'):
   p.reserve(self.root,self.fixture.snapshot_path,'/guide','fixture-job','independent',self.root/'reports/stale-new-admission.json')
 def test_current_stricter_floor_is_not_bypassed(self):
  report=self.recorded();self.fixture.config['minimumProfile']='high';self.fixture.config['defaultProfile']='high';self.fixture.put(p.CONFIG,self.fixture.config)
  with patch.object(p,'policy_hash',return_value='2'*64),self.assertRaises(ValueError):p.check_rendered(self.root,self.fixture.snap,report)
if __name__=='__main__':unittest.main()
