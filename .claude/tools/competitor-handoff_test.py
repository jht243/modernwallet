"""Synthetic continuation fixtures; never actual approvals or publication evidence."""
import contextlib,copy,importlib.util,io,json,os,shutil,subprocess,sys,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
here=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('monitor_handoff',here/'competitor-handoff.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
spec=importlib.util.spec_from_file_location('existing_gate_fixtures',here/'mindmap-gates_test.py');f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
class Tests(unittest.TestCase):
 def setUp(self):
  self.fixture=f.Gates();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups);self.root=self.fixture.root.resolve();self.fixture.root=self.root
  subprocess.run(['git','init',str(self.root)],check=True,capture_output=True)
  self.env=patch.dict(os.environ,{'CLAUDE_CODE_SESSION_ID':'synthetic-owner','CLAUDE_CODE_REMOTE_SESSION_ID':'','CLAUDE_CODE_REMOTE':'false'});self.env.start();self.addCleanup(self.env.stop)
  shutil.copyfile(here/'mindmap-gates.py',self.root/'.claude/tools/mindmap-gates.py')
  self.payload={'generated':'2026-11-09T10:00:00Z','candidate_count':2,'candidates':[{'url':'https://fixture.invalid/a','lastmod':'2026-11-09','title':'Synthetic original A'},{'url':'https://fixture.invalid/b','lastmod':'2026-11-08','title':'Synthetic original B'}]}
  with contextlib.redirect_stdout(io.StringIO()):self.path=h.freeze(self.root,self.payload)
 def approve(self):
  plan=copy.deepcopy(self.fixture.plan);plan['actions']=[];plan['newPageBriefs']=[]
  plan['evidenceFiles'].append({'path':str(self.path.relative_to(self.root)),'sha256':self.path.stem})
  plan['candidateDispositions']=[{'candidate':c['url'],'decision':'drop','reason':'Synthetic existing coverage already answers this private fixture.'} for c in self.payload['candidates']]
  self.fixture.plan=plan;(self.root/'chart.md').write_text(f.g.render(plan));review=self.fixture.review()
  f.g.chart(self.root,plan,review);f.g.saved_chart(self.root,plan);h.after_chart(self.root,plan,review);return plan,review
 def test_unfinished_handoff_blocks_even_after_worker_completion(self):
  output=io.StringIO()
  with contextlib.redirect_stdout(output):h.stop(self.root,{'session_id':'synthetic-owner','transcript_path':'completed-fixture-worker'})
  self.assertEqual(json.loads(output.getvalue())['decision'],'block')
 def test_existing_gate_and_every_original_disposition_are_required(self):
  with self.assertRaises(FileNotFoundError):h.record(self.root,{'dispositions':{}})
  self.approve()
  with self.assertRaises(ValueError):h.record(self.root,{'dispositions':{self.payload['candidates'][0]['url']:{'disposition':'skipped-duplicate'}}})
  outcomes={'dispositions':{c['url']:{'disposition':'skipped-low-value'} for c in self.payload['candidates']}}
  verified=h.record(self.root,outcomes);h.complete(self.root,verified)
  output=io.StringIO()
  with contextlib.redirect_stdout(output):h.stop(self.root,{'session_id':'synthetic-owner'})
  self.assertEqual(output.getvalue(),'')
 def test_activated_audit_limit_is_not_a_new_manual_review_allowance(self):
  (self.root/'.claude/content-review-policy.json').write_text(json.dumps({'releaseAtAuditLimit':True}))
  evidence=self.root/'failure.json';evidence.write_text(json.dumps({'intakeSha256':self.path.stem,'status':'blocked','blockingKind':'exhausted-review-budget'}))
  with self.assertRaisesRegex(ValueError,'automatic release'):h.blocked(self.root,evidence)

 def test_unrecorded_audit_cannot_be_published_or_hidden_by_done_receipt(self):
  self.approve();outcomes={'dispositions':{c['url']:{'disposition':'skipped-low-value'} for c in self.payload['candidates']}}
  h.complete(self.root,h.record(self.root,outcomes))
  pending=[{'route':'/fixture','round':2}]
  with patch.object(h,'pending_reviews',return_value=pending):
   self.assertFalse(h.completed(self.root,self.path))
   with self.assertRaises(ValueError):h.record(self.root,outcomes)
   with self.assertRaises(SystemExit),contextlib.redirect_stderr(io.StringIO()):
    h.publication_guard(self.root,{'tool_input':{'command':'git push origin HEAD:main'}})
   h.publication_guard(self.root,{'tool_input':{'command':'git push origin HEAD:claude/fixture'}})

 def test_http_success_cannot_close_reviewed_route_without_exact_deployment(self):
  self.approve();outcomes={'dispositions':{c['url']:{'disposition':'skipped-low-value'} for c in self.payload['candidates']}}
  verified=h.record(self.root,outcomes);h.complete(self.root,verified)
  with patch.object(h,'publication_gaps',return_value=[{'route':'/fixture','jobId':'competitor-'+self.path.stem[:12]}]):
   self.assertFalse(h.completed(self.root,self.path))
   with self.assertRaisesRegex(ValueError,'exact rendered-live'):h.record(self.root,outcomes)
   with self.assertRaisesRegex(ValueError,'Exact rendered-live'):h.complete(self.root,verified)

 def test_publication_plan_uses_the_last_real_round_instead_of_an_older_batch(self):
  spec=importlib.util.spec_from_file_location('actual_policy_fixtures',here/'content-review-policy_test.py');pf=importlib.util.module_from_spec(spec);spec.loader.exec_module(pf)
  fixture=pf.Tests();fixture.setUp();self.addCleanup(fixture.doCleanups)
  fixture.config.update(releaseAtAuditLimit=True,canonicalHosts=['example.com']);fixture.put(pf.p.CONFIG,fixture.config)
  job='competitor-'+self.path.stem[:12]
  for number in (1,2):
   admission=fixture.reserve(number,job=job);report=fixture.report(admission,'FAIL');path=fixture.put('reports/result-'+str(number)+'.json',report);pf.p.record(fixture.root,path)
  with patch.object(h,'active',return_value=self.path),patch.object(h,'load',return_value=pf.p):
   result=h.publication_plan(fixture.root,fixture.root/'reports/publication/plan.json')
  row=result['routes'][0];self.assertEqual(row['round'],2);self.assertEqual(row['remainingReviews'],0)
  actual=pf.p.read(fixture.root/row['review']['path'])
  self.assertEqual(actual['routes'][0]['verdict'],'FAIL')
  self.assertEqual(actual['approvalProjection']['review']['sha256'],pf.p.sha(path.read_bytes()))

 def test_pending_intake_resumes_without_calling_discovery(self):
  target=self.root/'output.json'
  with patch.object(sys,'argv',['scraper.py','detect','--out',str(target)]),contextlib.redirect_stdout(io.StringIO()):
   self.assertEqual(h.execute(self.root,lambda:(_ for _ in ()).throw(AssertionError('Fresh discovery must not execute'))),0)
  self.assertEqual(h.read(target)['candidates'],self.payload['candidates'])
 def test_all_native_date_schema_variants_are_preserved(self):
  for key in ['generated','generated_at','run_date','date']:
   payload={key:'2026-11-09','candidates':self.payload['candidates']}
   temp=self.root/key;temp.mkdir()
   with contextlib.redirect_stdout(io.StringIO()),patch.object(h,'point'):path=h.freeze(temp,payload)
   self.assertEqual(h.read(path)['generated'],'2026-11-09');self.assertEqual(h.read(path)[key],'2026-11-09')
 def test_existing_orbital_priority_exception_can_exceed_normal_cap(self):
  payload=copy.deepcopy(self.payload);payload['priority_count']=2
  for c in payload['candidates']:c['priority']=['Synthetic native watch topic']
  temp=self.root/'priority';temp.mkdir()
  with contextlib.redirect_stdout(io.StringIO()),patch.object(h,'point'):path=h.freeze(temp,payload,1)
  self.assertEqual(len(h.read(path)['candidates']),2)
 def test_medical_native_cap_and_order_are_not_replaced(self):
  payload=copy.deepcopy(self.payload);payload['candidates'].reverse();payload['total_detected']=5;payload['overflow']=[{'url':'https://fixture.invalid/c'}]
  temp=self.root/'medical';temp.mkdir()
  with contextlib.redirect_stdout(io.StringIO()),patch.object(h,'point'):path=h.freeze(temp,payload,1)
  self.assertEqual(h.read(path)['candidates'],payload['candidates'])
 def test_root_cannot_omit_a_candidate_from_independent_chart(self):
  plan=copy.deepcopy(self.fixture.plan);plan['evidenceFiles'].append({'path':str(self.path.relative_to(self.root)),'sha256':self.path.stem});plan['candidateDispositions']=[]
  with self.assertRaises(ValueError):h.after_chart(self.root,plan,self.fixture.review())
 def test_real_validate_chart_entrypoint_automatically_records_handoff(self):
  plan,review=self.approve();self.path.with_suffix('.chart.json').unlink()
  shutil.copyfile(here/'competitor-handoff.py',self.root/'.claude/tools/competitor-handoff.py')
  manifest=self.root/'plan.json';manifest.write_text(json.dumps(plan));receipt=self.root/'review.json';receipt.write_text(json.dumps(review))
  with patch.object(sys,'argv',['mindmap-gates.py','--root',str(self.root),'validate-chart','--manifest',str(manifest),'--review',str(receipt)]),contextlib.redirect_stdout(io.StringIO()):
   f.g.main()
  self.assertTrue(self.path.with_suffix('.chart.json').is_file());h.chart_proof(self.root,self.path)

 def test_corrected_chart_keeps_old_approval_and_same_canonical_job(self):
  plan,review=self.approve();original=h.read(self.path.with_suffix('.chart.json'))
  changed=copy.deepcopy(plan);changed['interpretedBrief']='A corrected synthetic current reader brief with the same original scope.';self.fixture.plan=changed;review=self.fixture.review();(self.root/'chart.md').write_text(f.g.render(changed))
  f.g.chart(self.root,changed,review);f.g.saved_chart(self.root,changed);h.after_chart(self.root,changed,review)
  self.assertTrue((self.root/original['path']).is_file());self.assertNotEqual(h.read(self.path.with_suffix('.chart.json')),original);h.chart_proof(self.root,self.path)
 def test_an_approved_chart_cannot_restart_its_job_or_counters(self):
  plan=copy.deepcopy(self.fixture.plan);plan['jobId']='same-fixture-job';plan['reviewCounters']={'reviews':2,'reworks':1};self.fixture.plan=plan
  plan,review=self.approve()
  for changed in [dict(plan,jobId='replacement-job'),dict(plan,reviewCounters={'reviews':0,'reworks':0})]:
   self.fixture.plan=changed;receipt=self.fixture.review()
   with self.assertRaises(ValueError):h.after_chart(self.root,changed,receipt)
 def test_changed_intake_never_becomes_completion(self):
  self.path.write_text('{}')
  with self.assertRaises(ValueError):h.validate_source(self.path)
 def test_cap_deferrals_are_distinct_from_an_abandoned_selected_gap(self):
  temp=self.root/'cap';temp.mkdir()
  with contextlib.redirect_stdout(io.StringIO()),patch.object(h,'point'):
   source=h.freeze(temp,self.payload,1)
  data=h.read(source);self.assertEqual(len(data['candidates']),1);self.assertEqual(data['deferredByNativeCap'],1)
 def test_cloud_restart_restores_the_real_chart_and_nested_evidence_graph(self):
  remote=self.root/'remote.git';subprocess.run(['git','init','--bare',str(remote)],check=True,capture_output=True)
  subprocess.run(['git','remote','add','origin',str(remote)],cwd=self.root,check=True,capture_output=True)
  shutil.copyfile(here/'workflow-control-store.py',self.root/'.claude/tools/workflow-control-store.py')
  support=self.root/'reports/support';support.mkdir(parents=True)
  (support/'readiness.md').write_bytes((self.root/'readiness.md').read_bytes());(support/'source.txt').write_text('Synthetic nested evidence, never publication evidence.')
  nested={'path':'reports/support/source.txt','sha256':h.sha((support/'source.txt').read_bytes())};(support/'graph.json').write_text(json.dumps({'source':nested}))
  plan=copy.deepcopy(self.fixture.plan);plan['actions']=[];plan['newPageBriefs']=[];plan['chartPath']='reports/support/chart.md'
  plan['preparation']['readiness']={'path':'reports/support/readiness.md','sha256':h.sha((support/'readiness.md').read_bytes())}
  plan['evidenceFiles']=[{'path':'reports/support/graph.json','sha256':h.sha((support/'graph.json').read_bytes())},{'path':str(self.path.relative_to(self.root)),'sha256':self.path.stem}]
  plan['candidateDispositions']=[{'candidate':c['url'],'decision':'drop','reason':'Synthetic independently reviewed duplicate in this isolated test only.'} for c in self.payload['candidates']]
  self.fixture.plan=plan;review=self.fixture.review();(support/'chart.md').write_text(f.g.render(plan))
  f.g.chart(self.root,plan,review);f.g.saved_chart(self.root,plan)
  with patch.dict(os.environ,{'CLAUDE_CODE_REMOTE_SESSION_ID':'cloud-fixture-a','CLAUDE_CODE_REMOTE':'true'}),contextlib.redirect_stdout(io.StringIO()):
   h.announce(self.root,self.path);h.ensure_registered(self.root,self.path);h.after_chart(self.root,plan,review)
   fresh=self.root/'fresh';subprocess.run(['git','clone',str(remote),str(fresh)],check=True,capture_output=True)
   (fresh/'.claude/tools').mkdir(parents=True)
   for name in ['workflow-control-store.py','mindmap-gates.py','rendered-audit.py']:shutil.copyfile(here/name,fresh/'.claude/tools'/name)
   restored=h.pending(fresh)
   self.assertEqual(restored.read_bytes(),self.path.read_bytes());self.assertEqual((fresh/'reports/support/source.txt').read_bytes(),(support/'source.txt').read_bytes())
   h.chart_proof(fresh,restored)
   continuation=io.StringIO()
   with contextlib.redirect_stdout(continuation):h.announce(fresh,restored)
   self.assertIn('RESUME APPROVED CHART',continuation.getvalue());self.assertNotIn('Send every selected candidate',continuation.getvalue())
   terminal={'dispositions':{c['url']:{'disposition':'skipped-low-value'} for c in self.payload['candidates']}}
   h.complete(fresh,h.record(fresh,terminal))
   third=self.root/'local-global-run';subprocess.run(['git','clone',str(remote),str(third)],check=True,capture_output=True)
   (third/'.claude/tools').mkdir(parents=True);shutil.copyfile(here/'workflow-control-store.py',third/'.claude/tools/workflow-control-store.py')
   original=h.state_dir(third)/self.path.name;original.parent.mkdir(parents=True);original.write_bytes(self.path.read_bytes())
   with patch.dict(os.environ,{'CLAUDE_CODE_REMOTE_SESSION_ID':'','CLAUDE_CODE_REMOTE':'false','CLAUDE_CODE_SESSION_ID':'local-fixture'}):
    self.assertIsNone(h.pending(third))  # A tracked legacy input cannot restart already completed cloud work.

 def test_real_failure_evidence_remains_pending_for_a_later_attempt(self):
  evidence=self.root/'failure.json';evidence.write_text('{"synthetic":true,"exitCode":1}')
  hold={'intakeSha256':self.path.stem,'status':'blocked','blockingKind':'external-service','recoveryAttempted':True,'reason':'Synthetic fixture: the external service returned an actual preserved error after native bounded recovery.','nextAction':'Synthetic fixture: retry the preserved original operation with this same intake and native history after service recovery.','evidence':[{'path':evidence.name,'sha256':h.sha(evidence.read_bytes())}]}
  path=self.root/'hold.json';path.write_text(json.dumps(hold));h.blocked(self.root,path)
  self.assertEqual(h.pending(self.root),self.path)
  output=io.StringIO()
  with contextlib.redirect_stdout(output):h.stop(self.root,{'session_id':'synthetic-owner'})
  self.assertEqual(output.getvalue(),'')
  with patch.dict(os.environ,{'CLAUDE_CODE_SESSION_ID':'new-synthetic-owner'}),contextlib.redirect_stdout(io.StringIO()):
   h.announce(self.root,self.path)
  output=io.StringIO()
  with patch.dict(os.environ,{'CLAUDE_CODE_SESSION_ID':'new-synthetic-owner'}),contextlib.redirect_stdout(output):h.stop(self.root,{'session_id':'new-synthetic-owner'})
  self.assertIn('block',output.getvalue())
 def test_legacy_signed_chart_predating_presentation_and_request_still_closes_cleanly(self):
  plan=copy.deepcopy(self.fixture.plan)
  plan['evidenceFiles'].append({'path':str(self.path.relative_to(self.root)),'sha256':self.path.stem})
  plan.pop('request',None)
  for action in plan['actions']:
   action.pop('presentation',None)
  plan['candidateDispositions']=[
   {'candidate':self.payload['candidates'][0]['url'],'decision':'create','target':plan['actions'][0]['target'],'reason':'Synthetic historical chart approved before presentation/request schema existed.'},
   {'candidate':self.payload['candidates'][1]['url'],'decision':'drop','reason':'Synthetic duplicate disposition in historical chart fixture.'},
  ]
  review={'jobId':'legacy-fixture','reviewer':'independent-chart-reviewer','manifestSha256':h.sha(h.canonical(plan)),'verdict':'PASS','findings':[],'resolvedFindingIds':[]}
  h.after_chart(self.root,plan,review)
  outcomes={'dispositions':{
   self.payload['candidates'][0]['url']:{'disposition':'published','our_url':'https://example.com'+plan['actions'][0]['target']},
   self.payload['candidates'][1]['url']:{'disposition':'skipped-duplicate'},
  }}
  verified=h.record(self.root,outcomes);h.complete(self.root,verified)
  self.assertTrue(h.completed(self.root,self.path))
 def test_pre_capped_release_held_fail_closes_via_held_audit_limit_without_blocking_siblings(self):
  spec=importlib.util.spec_from_file_location('actual_policy_fixtures_held',here/'content-review-policy_test.py');pf=importlib.util.module_from_spec(spec);spec.loader.exec_module(pf)
  fixture=pf.Tests();fixture.setUp();self.addCleanup(fixture.doCleanups)
  fixture.config.update(releaseAtAuditLimit=False,canonicalHosts=['example.com']);fixture.put(pf.p.CONFIG,fixture.config)
  job='competitor-'+self.path.stem[:12]
  for number in (1,2):
   admission=fixture.reserve(number,job=job)
   report=fixture.report(admission,'FAIL')
   report['routes'][0]['checks']={}
   path=fixture.put('reports/pre-rollout-'+str(number)+'.json',report)
   pf.p.record(fixture.root,path)
  fixture.config['releaseAtAuditLimit']=True;fixture.put(pf.p.CONFIG,fixture.config)
  with patch.object(h,'active',return_value=self.path),patch.object(h,'load',return_value=pf.p):
   self.assertEqual(h.publication_gaps(fixture.root,self.path.stem),[])
   self.assertEqual(h.historical_held_routes(fixture.root,self.path.stem),['/guide'])
   result=h.publication_plan(fixture.root,fixture.root/'reports/publication/plan-held.json')
   self.assertEqual(result['routes'],[])
  plan=copy.deepcopy(self.fixture.plan)
  plan['actions'][0]['target']='/guide'
  plan['evidenceFiles'].append({'path':str(self.path.relative_to(self.root)),'sha256':self.path.stem})
  plan.pop('request',None)
  for action in plan['actions']:action.pop('presentation',None)
  plan['candidateDispositions']=[
   {'candidate':self.payload['candidates'][0]['url'],'decision':'create','target':'/guide','reason':'Synthetic historical held target recorded before capped release.'},
   {'candidate':self.payload['candidates'][1]['url'],'decision':'skipped-news-event','reason':'Synthetic news-event skip disposition in competitor fixture.'},
  ]
  review={'jobId':job,'reviewer':'independent-chart-reviewer','manifestSha256':h.sha(h.canonical(plan)),'verdict':'PASS','findings':[],'resolvedFindingIds':[]}
  h.after_chart(self.root,plan,review)
  with self.assertRaisesRegex(ValueError,'genuine pre-capped-release'):
   h.record(self.root,{'dispositions':{
    self.payload['candidates'][0]['url']:{'disposition':'held-audit-limit'},
    self.payload['candidates'][1]['url']:{'disposition':'skipped-news-event'},
   }})
  with patch.object(h,'historical_held_routes',return_value=['/guide']):
   verified=h.record(self.root,{'dispositions':{
    self.payload['candidates'][0]['url']:{'disposition':'held-audit-limit'},
    self.payload['candidates'][1]['url']:{'disposition':'skipped-news-event'},
   }})
   h.complete(self.root,verified)
   self.assertTrue(h.completed(self.root,self.path))
if __name__=='__main__':unittest.main()
