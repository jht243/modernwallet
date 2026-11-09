"""A real recorded PASS survives subset save/reload with ordered meta claims."""
import importlib.util,unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('projection_fixture',Path(__file__).with_name('content-review-policy_test.py'))
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
class Tests(unittest.TestCase):
 def test_saved_projection_preserves_existing_risk_assessment_and_round_count(self):
  fixture=f.Tests();fixture.setUp();self.addCleanup(fixture.doCleanups)
  html=f.fixtures.HTML.replace('</head>','<meta name="z-fixture" content="Synthetic Z metadata"><meta name="a-fixture" content="Synthetic A metadata"></head>')
  with patch.object(f.fixtures,'HTML',html):fixture.test_unchanged_passing_sibling_can_publish_without_another_audit()
  original=f.p.read(fixture.root/'reports/shared-snapshot.json');projected=f.p.read(fixture.root/'reports/passing-snapshot.json')
  self.assertTrue(f.p.check_rendered(fixture.root,projected,f.p.read(fixture.root/'reports/passing-review.json')))
  original_review=f.p.read(fixture.root/'reports/shared-review.json');projected_review=f.p.read(fixture.root/'reports/passing-review.json')
  self.assertEqual(original_review['routes'][0],projected_review['routes'][0])
if __name__=='__main__':unittest.main()
