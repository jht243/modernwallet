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
 def test_hyphenated_sk_company_url_slugs_are_not_false_positive_secrets(self):
  urls=[
   b'{"url":"https://dronedj.com/2026/11/10/korean-carrier-sk-telecom-expands-autonomous-drone-corridor"}',
   b'{"url":"https://vetnews.example/2026/11/sk-group-veterinary-diagnostics-acquisition-explained"}',
   b'{"url":"https://chips.example/sk-hynix-hbm4-packaging-roadmap-2026?utm=rss"}',
  ]
  for sample in urls:
   self.assertFalse(m.has_sensitive_material(sample), sample)
  # Real keys (including inside query strings or alongside valid SK URLs) must still fail closed.
  self.assertTrue(m.has_sensitive_material(b'https://example.com/callback?token=sk-proj-' + b'a'*32))
  self.assertTrue(m.has_sensitive_material(urls[0] + b' sk-' + b'A9b'*10))
if __name__=='__main__':unittest.main()
