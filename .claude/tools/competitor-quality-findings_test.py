"""Source-backed correction input does not reopen/reset its completed predecessor."""
import contextlib,copy,importlib.util,io,json,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('quality_fixture',Path(__file__).with_name('competitor-handoff_test.py'))
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f);h=f.h;g=f.f.g
class Tests(unittest.TestCase):
 def setUp(self):
  self.fixture=f.Tests();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups);self.root=self.fixture.root
 def finding(self):
  path=self.root/'reports/competitor-monitor/intakes/quality-findings/source-finding.json';path.parent.mkdir(parents=True,exist_ok=True)
  path.write_text(json.dumps({'findings':[{'id':'QA-REAL-FIXTURE','problem':'Synthetic source-backed correction fixture, not an actual editorial finding.'}]}))
  self.reference={'path':str(path.relative_to(self.root)),'sha256':h.sha(path.read_bytes())}
  payload=copy.deepcopy(self.fixture.payload);payload['qualityFindings']=[self.reference]
  with contextlib.redirect_stdout(io.StringIO()):self.path=h.freeze(self.root,payload)
 def approve(self,include_reference=True,include_id=True):
  plan=copy.deepcopy(self.fixture.fixture.plan);plan['actions']=[];plan['newPageBriefs']=[]
  plan['evidenceFiles'].append({'path':str(self.path.relative_to(self.root)),'sha256':self.path.stem})
  if include_reference:plan['evidenceFiles'].append(self.reference)
  reason='Synthetic disposition independently inspected in this private fixture.'+(' QA-REAL-FIXTURE is addressed by the actual fixture evidence.' if include_id else '')
  plan['candidateDispositions']=[{'candidate':row['url'],'decision':'drop','reason':reason} for row in self.fixture.payload['candidates']]
  self.fixture.fixture.plan=plan;(self.root/'chart.md').write_text(g.render(plan));review=self.fixture.fixture.review()
  g.chart(self.root,plan,review);g.saved_chart(self.root,plan);return h.after_chart(self.root,plan,review)
 def test_source_finding_must_be_bound_to_the_independent_chart(self):
  self.finding()
  with self.assertRaisesRegex(ValueError,'source-backed quality findings'):self.approve(include_reference=False)
 def test_existing_coverage_without_addressing_the_finding_does_not_close_it(self):
  self.finding()
  with self.assertRaisesRegex(ValueError,'every source-backed quality finding'):self.approve(include_id=False)
 def test_explicit_independent_accounting_uses_the_existing_chart_path(self):
  self.finding();self.approve();self.assertTrue(self.path.with_suffix('.chart.json').is_file())
 def test_new_source_finding_preserves_completed_original_intake(self):
  self.fixture.approve();terminal={'dispositions':{c['url']:{'disposition':'skipped-low-value'} for c in self.fixture.payload['candidates']}}
  h.complete(self.root,h.record(self.root,terminal));original=self.fixture.path.with_suffix('.done.json');before=original.read_bytes()
  self.finding();self.assertEqual(h.pending(self.root),self.path);self.assertEqual(original.read_bytes(),before)
if __name__=='__main__':unittest.main()
