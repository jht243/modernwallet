"""Actual full-render and review-record paths; synthetic attribution fixtures only."""
import importlib.util,tempfile,unittest
from pathlib import Path

fixture_path=Path(__file__).with_name('rendered-audit_test.py')
if not fixture_path.exists():fixture_path=Path(__file__).with_name('rendered-audit-fixture.py')
spec=importlib.util.spec_from_file_location('rendered_testing_fixtures',fixture_path)
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)

class Tests(unittest.TestCase):
 def setUp(self):
  self.fixture=f.Tests();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups)
 def prepared(self,label):
  snapshot=self.fixture.snapshot(f.HTML.replace('</main>','<p>'+label+'</p></main>'))
  review=self.fixture.review(snapshot);review['routes'][0]['checks']['testingAndAttribution']['status']='NA'
  return snapshot,review
 def test_testing_byline_in_the_complete_render_cannot_be_not_applicable(self):
  snapshot,review=self.prepared('Tested and reviewed by Synthetic Fixture Person')
  with self.assertRaisesRegex(ValueError,'Visible testing attribution cannot be NA'):f.a.review_check(snapshot,review)
 def test_inherited_footer_claim_also_requires_attribution_review(self):
  snapshot,review=self.prepared('Independent, tested guidance on a fixture topic')
  with self.assertRaisesRegex(ValueError,'Visible testing attribution cannot be NA'):f.a.review_check(snapshot,review)
 def test_a_genuine_applicable_testing_review_keeps_its_existing_path(self):
  snapshot,review=self.prepared('Tested and reviewed by Synthetic Fixture Person')
  review['routes'][0]['checks']['testingAndAttribution']['status']='PASS'
  f.a.review_check(snapshot,review)
 def test_no_testing_claim_remains_not_applicable(self):
  snapshot,review=self.prepared('Research from cited sources; we did not test any product.')
  f.a.review_check(snapshot,review)
 def test_factual_review_cannot_record_the_same_false_na_before_publish(self):
  path=Path(__file__).with_name('content-review-policy.py')
  if not path.exists():self.skipTest('Native client review policy remains authoritative.')
  spec=importlib.util.spec_from_file_location('testing_policy_fixture',path);policy=importlib.util.module_from_spec(spec);spec.loader.exec_module(policy)
  snapshot,review=self.prepared('Tested and reviewed by Synthetic Fixture Person');row=review['routes'][0]
  row['factualReview']={name:{'status':'PASS','evidence':'Synthetic negative-path fixture only; no actual product testing or publication.'} for name in policy.FACTS['light']+['riskClassification','seoQuality']}
  with tempfile.TemporaryDirectory() as directory,self.assertRaisesRegex(ValueError,'Visible testing attribution cannot be NA'):
   policy.pass_evidence(Path(directory),snapshot,row,'light')

if __name__=='__main__':unittest.main()
