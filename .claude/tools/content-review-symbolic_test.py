import copy,hashlib,importlib.util,json,shutil,subprocess,tempfile,unittest,types
import unittest.mock
from pathlib import Path
HERE=Path(__file__).resolve().parent
REPO=next(p for p in HERE.parents if (p/'.claude/tools/content-review-policy.py').is_file())
def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
D=load('draft_symbolic',REPO/'.claude/tools/content-review-durable.py')
N=load('native_policy',REPO/'.claude/tools/content-review-policy.py')
def canonical(x):return json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
def digest(raw):return hashlib.sha256(raw).hexdigest()
class SymbolicTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name).resolve()
  subprocess.run(['git','init','-q'],cwd=self.root,check=True)
  p=self.root/'.claude/tools';p.mkdir(parents=True)
  shutil.copy(REPO/'.claude/tools/content-review-policy.py',p/'content-review-policy.py')
  shutil.copy(REPO/'.claude/content-review-policy.json',p.parent/'content-review-policy.json')
  (p.parent/'workflow-policy.local.json').write_text('{}')
  self.route='/guides/example';self.reportpath='reports/audit/review.json';self.jpath='reports/audit/judgments/example.json';self.apath='reports/audit/admission.json';self.spath='reports/snapshot.json';self.boundpath='reports/audit/analysis-reviews/example.json'
  self.snapshot={'snapshotSha256':'snapshotsemantic','routes':[{'path':self.route,'fingerprint':'candidate'}]};self.sref=self.put(self.spath,self.snapshot)
  identity={'siteId':json.loads((p.parent/'content-review-policy.json').read_text())['siteId'],'canonicalBase':'https://layer3labs.io','route':self.route}
  self.admission={'identity':identity,'cycleId':'cycle','jobId':'job','number':1,'fingerprint':'candidate','reviewer':'reviewer','snapshot':self.sref};self.aref=self.put(self.apath,self.admission)
  facts={k:{'status':'PASS','evidence':'Actual independently checked test fixture evidence.'} for k in list(N.FACTS['standard'])+['riskClassification','seoQuality','instructionUnderstanding']}
  self.row={'path':self.route,'fingerprint':'candidate','verdict':'FAIL','reviewProfile':'standard','reviewBudget':self.aref,'factualReview':facts,'findings':[{'id':'F1','status':'open'}]}
  self.analysis={'renderedReview':{'path':self.reportpath,'sha256':'AUTO_BOUND_ON_FINALIZE'},'renderedSnapshot':self.sref,'reviewer':'reviewer','verdict':'FAIL','usefulness':{'status':'FAIL','evidence':'Actual independent finding remains unchanged.'}}
  self.judgment={'kind':'genuine-independent-route-judgment','actor':'reviewer','contextEpoch':1,'reviewerApplication':{'path':'application','sha256':'a'*64},'snapshot':self.sref,'routeReview':copy.deepcopy(self.row),'analysisReview':copy.deepcopy(self.analysis)}
  self.rebuild()
 def put(self,name,value):
  path=self.root/name;path.parent.mkdir(parents=True,exist_ok=True);raw=canonical(value)+b'\n';path.write_bytes(raw);return {'path':name,'sha256':digest(raw)}
 def rebuild(self,record=True):
  jr=self.put(self.jpath,self.judgment)
  self.report={'jobId':'job','reviewer':'reviewer','snapshotSha256':self.snapshot['snapshotSha256'],'routes':[copy.deepcopy(self.row)],'decisionProvenance':[{'route':self.route,'contextEpoch':1,'instructionApplication':self.judgment['reviewerApplication'],'judgment':jr}]}
  self.rref=self.put(self.reportpath,self.report)
  bound=copy.deepcopy(self.analysis);bound['renderedReview']=self.rref;self.put(self.boundpath,bound)
  jd=self.root/'reports/content-review-journals';shutil.rmtree(jd,ignore_errors=True)
  anchors=self.root/'.git/content-review-policy';shutil.rmtree(anchors,ignore_errors=True)
  self.journal=N.Journal(self.root,'https://layer3labs.io',self.route)
  with self.journal as j:
   j.append('begin',{'cycleId':'cycle','jobId':'job','profile':'standard'})
   j.append('reserve',{'number':1,'admission':self.aref,'fingerprint':'candidate','reviewer':'reviewer'})
   if record:j.append('record',{'number':1,'admission':self.aref,'report':self.rref,'reportObjectSha256':digest(canonical(self.report)),'fingerprint':'candidate','verdict':'FAIL','profile':'standard'})
 def auth(self):return D.symbolic_provenance(self.root,self.report,self.rref['sha256'])
 def test_native_record_and_finalized_binding(self):
  edges,deps=self.auth();self.assertEqual(len(edges),1);self.assertEqual(set(deps),{self.boundpath,self.reportpath})
 def test_no_native_record(self):
  self.rebuild(False)
  with self.assertRaisesRegex(ValueError,'actual native recorded'):self.auth()
 def test_no_anchor_or_committed_or_store_authority(self):
  self.journal.anchor.unlink()
  with unittest.mock.patch.object(D,'backend',return_value=None):
   with self.assertRaisesRegex(ValueError,'No native authority'):self.auth()
 def test_old_anchor_cannot_authenticate_appended_record(self):
  ev=[json.loads(x) for x in self.journal.path.read_text().splitlines()];self.journal.anchor.write_text(ev[1]['eventSha256'])
  with self.assertRaisesRegex(ValueError,'anchored history'):self.auth()
 def test_forged_self_consistent_rebound_report_after_anchor(self):
  self.journal.anchor.unlink()
  with unittest.mock.patch.object(D,'backend',return_value=None):
   with self.assertRaises(ValueError):self.auth()
 def test_wrong_bound_contents(self):
  p=self.root/self.boundpath;x=json.loads(p.read_text());x['usefulness']['evidence']='Changed';self.put(self.boundpath,x)
  with self.assertRaisesRegex(ValueError,'exact symbolic'):self.auth()
 def test_wrong_bound_report(self):
  p=self.root/self.boundpath;x=json.loads(p.read_text());x['renderedReview']['sha256']='b'*64;self.put(self.boundpath,x)
  with self.assertRaises(ValueError):self.auth()
 def test_wrong_symbolic_target(self):
  self.judgment['analysisReview']['renderedReview']['path']='reports/other.json';self.rebuild()
  with self.assertRaises(ValueError):self.auth()
 def test_changed_judgment_verdict(self):
  self.judgment['routeReview']['verdict']='PASS';self.rebuild()
  with self.assertRaisesRegex(ValueError,'route judgment'):self.auth()
 def test_changed_judgment_fingerprint(self):
  self.judgment['routeReview']['fingerprint']='different';self.rebuild()
  with self.assertRaisesRegex(ValueError,'route judgment'):self.auth()
 def test_changed_admission_cycle(self):
  self.admission['cycleId']='other';self.aref=self.put(self.apath,self.admission);self.row['reviewBudget']=self.aref;self.judgment['routeReview']=copy.deepcopy(self.row);self.rebuild()
  with self.assertRaisesRegex(ValueError,'cycle'):self.auth()
 def test_changed_admission_identity(self):
  self.admission['identity']['route']='/guides/other';self.aref=self.put(self.apath,self.admission);self.row['reviewBudget']=self.aref;self.judgment['routeReview']=copy.deepcopy(self.row);self.rebuild()
  with self.assertRaisesRegex(ValueError,'identity'):self.auth()
 def test_native_fact_projection_only(self):
  for k in set(N.FACTS['high'])-set(N.FACTS['standard']):self.judgment['routeReview']['factualReview'][k]={'status':'FAIL','evidence':'Retained higher profile original field.'}
  self.rebuild();self.assertEqual(len(self.auth()[0]),1)
 def test_fact_value_changed_rejected(self):
  k=next(iter(self.row['factualReview']));self.judgment['routeReview']['factualReview'][k]['evidence']='changed';self.rebuild()
  with self.assertRaisesRegex(ValueError,'route judgment'):self.auth()
 def test_collect_authenticates_exact_lineage(self):
  result=D.collect(self.root,None,extra={self.reportpath:self.rref['sha256']});self.assertIn(self.jpath,result);self.assertIn(self.boundpath,result)
 def test_genuine_direct_judgment_authenticated_after_parent_visit(self):
  result=D.collect(self.root,None,extra={self.reportpath:self.rref['sha256'],self.jpath:digest((self.root/self.jpath).read_bytes())});self.assertIn(self.jpath,result)
 def test_decision_index_report_first(self):
  index=self.put('reports/decision-index.json',{'judgments':[{'route':self.route,'path':self.jpath,'sha256':digest((self.root/self.jpath).read_bytes())}]})
  result=D.collect(self.root,None,extra={self.reportpath:self.rref['sha256'],index['path']:index['sha256']});self.assertIn(self.jpath,result)
 def test_decision_index_first_recovers_native_parent(self):
  index=self.put('reports/decision-index.json',{'judgments':[{'route':self.route,'path':self.jpath,'sha256':digest((self.root/self.jpath).read_bytes())}]})
  result=D.collect(self.root,None,extra={index['path']:index['sha256'],self.reportpath:self.rref['sha256']});self.assertIn(self.reportpath,result);self.assertIn(self.boundpath,result)
 def test_direct_genuine_judgment_recovers_parent(self):
  result=D.collect(self.root,None,extra={self.jpath:digest((self.root/self.jpath).read_bytes())});self.assertIn(self.reportpath,result);self.assertIn(self.boundpath,result)
 def test_unrecorded_direct_judgment_rejected(self):
  self.rebuild(False)
  with self.assertRaisesRegex(ValueError,'recorded symbolic parent'):D.collect(self.root,None,extra={self.jpath:digest((self.root/self.jpath).read_bytes())})
 def test_ordinary_active_sentinel_still_rejected_after_authorized_visit(self):
  bad=self.put('reports/ordinary.json',{'path':self.reportpath,'sha256':'AUTO_BOUND_ON_FINALIZE'})
  with self.assertRaisesRegex(ValueError,'Invalid archived evidence hash'):D.collect(self.root,None,extra={self.reportpath:self.rref['sha256'],bad['path']:bad['sha256']})
 def test_generic_invalid_hash_still_rejected(self):
  other=self.put('reports/other.json',{'path':'reports/missing.json','sha256':'AUTO_BOUND_ON_FINALIZE'})
  with self.assertRaisesRegex(ValueError,'Invalid archived evidence hash'):D.collect(self.root,None,extra={other['path']:other['sha256']})
 def test_wrong_case_sentinel_not_exempt(self):
  self.judgment['analysisReview']['renderedReview']['sha256']='auto_bound_on_finalize';self.rebuild()
  with self.assertRaisesRegex(ValueError,'Invalid archived evidence hash'):D.collect(self.root,None,extra={self.reportpath:self.rref['sha256']})
 def test_wrong_judgment_hash(self):
  self.report['decisionProvenance'][0]['judgment']['sha256']='b'*64
  with self.assertRaises(ValueError):self.auth()
 def test_unknown_fact_extra_rejected(self):
  self.judgment['routeReview']['factualReview']['inventedExtra']={'status':'FAIL','evidence':'Not a native field'};self.rebuild()
  with self.assertRaisesRegex(ValueError,'fact schema'):self.auth()
 def test_native_later_round_extension_keeps_original_proof_valid(self):
  with self.journal as j:
   j.append('reserve',{'number':2,'admission':{'path':'reports/later.json','sha256':'b'*64},'fingerprint':'candidate','reviewer':'reviewer'})
   j.append('record',{'number':2,'admission':{'path':'reports/later.json','sha256':'b'*64},'report':{'path':'reports/later-report.json','sha256':'c'*64},'reportObjectSha256':'d'*64,'fingerprint':'candidate','verdict':'FAIL','profile':'standard'})
  self.assertEqual(len(self.auth()[0]),1)
 def test_sentinel_elsewhere_in_authorized_judgment_rejected(self):
  self.judgment['otherReference']={'path':self.reportpath,'sha256':'AUTO_BOUND_ON_FINALIZE'};self.rebuild()
  with self.assertRaisesRegex(ValueError,'Invalid archived evidence hash'):D.collect(self.root,None,extra={self.reportpath:self.rref['sha256']})
 def test_wrong_context_epoch_rejected(self):
  self.judgment['contextEpoch']=99;self.rebuild()
  with self.assertRaisesRegex(ValueError,'reviewer provenance'):self.auth()
 def test_modified_findings_rejected(self):
  self.judgment['routeReview']['findings']=[];self.rebuild()
  with self.assertRaisesRegex(ValueError,'route judgment'):self.auth()
 def test_actual_wrong_candidate_rejected(self):
  self.snapshot['routes'][0]['fingerprint']='other';self.sref=self.put(self.spath,self.snapshot);self.admission['snapshot']=self.sref;self.aref=self.put(self.apath,self.admission);self.row['reviewBudget']=self.aref;self.judgment['routeReview']=copy.deepcopy(self.row);self.judgment['snapshot']=self.sref;self.analysis['renderedSnapshot']=self.sref;self.judgment['analysisReview']=copy.deepcopy(self.analysis);self.rebuild()
  with self.assertRaisesRegex(ValueError,'candidate fingerprint'):self.auth()
 def test_wrong_source_namespace_even_identical_report_rejected(self):
  self.judgment['analysisReview']['renderedReview']['path']='reports/other/review.json';self.rebuild();self.put('reports/other/review.json',self.report)
  with self.assertRaisesRegex(ValueError,'namespace'):self.auth()
 def durable_fixture(self):
  raw=self.journal.path.read_bytes();head=digest(raw);artifact=self.root/'artifacts'/head;artifact.parent.mkdir();artifact.write_bytes(raw)
  subprocess.run(['git','add','artifacts'],cwd=self.root,check=True,capture_output=True)
  subprocess.run(['git','-c','user.name=NativeFixture','-c','user.email=fixture@example.invalid','commit','-qm','native durable fixture'],cwd=self.root,check=True,capture_output=True)
  rev=subprocess.run(['git','rev-parse','HEAD'],cwd=self.root,check=True,capture_output=True,text=True).stdout.strip()
  identity=self.admission['identity'];state={'reviewJournals':{self.journal.key:{'identity':identity,'head':head,'artifacts':{str(self.journal.path.relative_to(self.root)):head}}}}
  module=types.SimpleNamespace(git=lambda root,*args:subprocess.run(['git',*args],cwd=root,capture_output=True,check=True))
  store=types.SimpleNamespace(read=lambda:(rev,state))
  self.journal.path.unlink();self.journal.anchor.unlink()
  return (module,store),artifact,state
 def test_clean_restore_uses_actual_git_artifact_and_canonical_entry(self):
  connection,artifact,state=self.durable_fixture()
  with unittest.mock.patch.object(D,'backend',return_value=connection):self.assertEqual(len(self.auth()[0]),1)
 def test_clean_restore_wrong_store_identity_rejected(self):
  connection,artifact,state=self.durable_fixture();state['reviewJournals'][self.journal.key]['identity']={'route':'other'}
  with unittest.mock.patch.object(D,'backend',return_value=connection):
   with self.assertRaisesRegex(ValueError,'identity'):self.auth()
 def test_direct_rebound_judgment_not_in_actual_parent_rejected(self):
  self.judgment['routeReview']['findings']=[];jr=self.put(self.jpath,self.judgment)
  with self.assertRaisesRegex(ValueError,'recorded symbolic parent'):D.collect(self.root,None,extra={self.jpath:jr['sha256']})
 def test_direct_old_anchor_before_record_rejected(self):
  events=[json.loads(line) for line in self.journal.path.read_text().splitlines()];self.journal.anchor.write_text(events[1]['eventSha256'])
  with self.assertRaisesRegex(ValueError,'anchored history'):D.collect(self.root,None,extra={self.jpath:digest((self.root/self.jpath).read_bytes())})
 def test_symbolic_sentinel_in_bound_analysis_rejected(self):
  self.put(self.boundpath,self.analysis)
  with self.assertRaises(ValueError):D.collect(self.root,None,extra={self.jpath:digest((self.root/self.jpath).read_bytes())})
 def test_no_report_or_journal_mutation(self):
  paths=[self.root/self.reportpath,self.root/self.jpath,self.journal.path,self.journal.anchor,self.root/self.apath];before={p:p.read_bytes() for p in paths};self.auth();self.assertEqual(before,{p:p.read_bytes() for p in paths})
if __name__=='__main__':
 import unittest.mock
 unittest.main()
