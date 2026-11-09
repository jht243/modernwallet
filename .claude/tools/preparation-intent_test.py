"""Exercise the actual preparation CLI while preserving historical receipt scope."""
import contextlib,copy,importlib.util,io,json,shutil,sys,unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('intent_fixtures',Path(__file__).with_name('mindmap-gates_test.py'))
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
class Tests(unittest.TestCase):
 def setUp(self):
  self.fixture=f.Gates();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups)
 def packet(self,question=None,route=None,stale_cases=False):
  packet=copy.deepcopy(self.fixture.packet)
  if question is not None:packet['readerQuestion']=question
  if route is not None:packet['route']=route
  cases=self.fixture.root/'cases.json'
  cases.write_text(json.dumps(f.g.cases(self.fixture.root,'An old question' if stale_cases else packet['readerQuestion'],'fixture.invalid')))
  packet['caseSelection']=self.fixture.ref(cases.name)
  p=self.fixture.root/'current-analysis.json';p.write_text(json.dumps(packet))
  self.fixture.plan['evidenceFiles'].append(self.fixture.ref(p.name))
 def cli(self,review_extra=None):
  root=self.fixture.root;plan=root/'plan.json';review=root/'review.json'
  plan.write_text(json.dumps(self.fixture.plan));value=self.fixture.review();value.update(review_extra or {});review.write_text(json.dumps(value))
  (root/'chart.md').write_text(f.g.render(self.fixture.plan))
  with patch.object(sys,'argv',['mindmap-gates.py','--root',str(root),'validate-chart','--manifest',str(plan),'--review',str(review)]),contextlib.redirect_stdout(io.StringIO()):f.g.main()
 def test_mismatched_question_is_caught_before_any_writer_call(self):
  self.packet('A genuinely different reader question')
  with self.assertRaisesRegex(ValueError,'Analysis reader question differs'):self.cli()
 def test_exact_question_with_internal_evidence_annotation_still_passes(self):
  question=self.fixture.row['reader_question']+' [verb-only; keyword volume NOT measured]'
  self.fixture.row['reader_question']=question;self.fixture.brief['readerAndAnswer']['question']=question
  self.packet(question);self.cli()
 def test_current_complete_analysis_remains_valid_at_preparation(self):
  self.packet();self.cli()
 def test_stale_case_receipt_is_caught_before_dispatching_a_writer(self):
  self.packet(stale_cases=True)
  with self.assertRaisesRegex(ValueError,'Case receipt is incomplete'):self.cli()
 def test_unrelated_source_packet_does_not_create_a_new_production_gate(self):
  self.packet('Unrelated source question',route='/unrelated-source');self.cli()
 def budget(self):
  source=Path(__file__).with_name('content-generation-budget.py')
  if not source.is_file():self.skipTest('This site retains its native writer budget instead of the portable adapter.')
  shutil.copyfile(source,self.fixture.root/'.claude/tools/content-generation-budget.py')
  self.fixture.plan['jobId']='fixture-original-job'
 def test_missing_actual_reviewer_job_identity_is_caught_before_writer_dispatch(self):
  self.budget();self.packet()
  with self.assertRaisesRegex(ValueError,'same original canonical jobId'):self.cli()
  self.assertFalse((self.fixture.root/'reports/workflow-generation-budgets').exists())
 def test_same_reviewer_job_identity_keeps_the_existing_generation_scope(self):
  self.budget();self.packet();self.cli({'jobId':'fixture-original-job'})
  self.assertFalse((self.fixture.root/'reports/workflow-generation-budgets').exists())
 def test_packet_failures_are_reported_together_without_a_paid_reservation(self):
  self.packet('A different question',stale_cases=True)
  with self.assertRaises(ValueError) as error:self.cli()
  self.assertIn('Case receipt is incomplete',str(error.exception))
  self.assertIn('Analysis reader question differs',str(error.exception))
  self.assertFalse((self.fixture.root/'reports/workflow-generation-budgets').exists())
 def test_historical_structural_receipt_is_not_reinterpreted(self):
  self.packet('An older different question')
  f.g.chart(self.fixture.root,self.fixture.plan,self.fixture.review())
if __name__=='__main__':unittest.main()
