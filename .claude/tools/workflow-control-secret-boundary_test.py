import importlib.util,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('secret_boundary',Path(__file__).with_name('workflow-control-store.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Tests(unittest.TestCase):
 def test_actual_policy_version_is_not_a_credential(self):
  self.assertIsNone(m.SECRET.search(b'{"version":"risk-review-budget-2026-11-08.1"}'))
 def test_real_credential_shapes_are_still_rejected(self):
  for prefix in [b'sk-',b'sk-ant-',b'sk-proj-',b'ri_',b'AQ.']:
   for before in [b'"',b'=',b' ',b'\n']:
    self.assertIsNotNone(m.SECRET.search(before+prefix+b'X'*30))
  self.assertIsNotNone(m.SECRET.search(b'-----BEGIN RSA PRIVATE KEY'))
if __name__=='__main__':unittest.main()
