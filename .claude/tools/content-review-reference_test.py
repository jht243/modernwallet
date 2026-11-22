"""Isolated historical-edge fixture tests; no API, network, real journals or verdicts."""
import hashlib,importlib.util,json,os,tempfile,unittest,subprocess,shutil
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('draft',Path(__file__).with_name('content-review-durable.py'));d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
class Tests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name).resolve();self.scope='reports/mindmap-pass/fixture/batch-5';subprocess.run(['git','init','-q',str(self.root)],check=True);cfg=self.root/'.claude/content-review-policy.json';cfg.parent.mkdir(parents=True);cfg.write_text(json.dumps({'siteId':'fixture','canonicalHosts':['example.com','www.example.com']}));self.route='/guides/fixture';self.job='same-existing-job';self.cycle='same-original-cycle'
  self.env=patch.dict(os.environ,{'CONTENT_REVIEW_REFERENCE_CORRECTION':'','CONTENT_REVIEW_REFERENCE_CORRECTION_SHA256':''});self.env.start();self.addCleanup(self.env.stop)
  self.adm=self.put('admission.json',{'identity':{'siteId':'fixture','canonicalBase':'https://example.com','route':self.route},'jobId':self.job,'cycleId':self.cycle,'number':1})
  self.bad={'path':self.adm['path'],'sha256':'0'*64}
  leaf={'path':self.route,'reviewBudget':self.adm,'verdict':'FAIL','findings':[{'id':'F1','status':'open'}],'fingerprint':'unaltered-candidate'}
  self.oldparent=self.put('unused-draft.json',{**leaf,'reviewBudget':self.bad});self.current=self.put('final.json',leaf)
  self.earlier=self.put('earlier-index.json',{'judgments':[{'route':self.route,**self.oldparent}]})
  self.index=self.put('current-index.json',{'judgments':[{'route':self.route,**self.current}],'preservedEarlierIndex':self.earlier})
  self.report=self.put('review.json',{'jobId':self.job,'routes':[leaf],'supplementaryEvidence':[self.index]})
  self.events=[{'kind':'begin','data':{'jobId':self.job,'cycleId':self.cycle}},{'kind':'reserve','data':{'number':1,'admission':self.adm}},{'kind':'record','data':{'number':1,'verdict':'FAIL','report':self.report}}]
  key=d.sha(json.dumps({'siteId':'fixture','canonicalBase':'https://example.com','route':self.route},sort_keys=True,separators=(',',':'),ensure_ascii=False).encode());self.jp=self.root/'reports/content-review-journals'/(key+'.jsonl');self.jp.parent.mkdir(parents=True,exist_ok=True);self.jp.write_text(''.join(json.dumps(x)+'\n' for x in self.events));self.journal=SimpleNamespace(path=self.jp,route=self.route)
  reason='Unused superseded draft transcribed an incorrect admission hash; preserve it as unavailable historical evidence.'
  self.receipt={'kind':'historical-transcription-edge-correction','version':1,'jobId':self.job,'scopeRoot':self.scope,'report':self.report,'currentIndex':self.index,'earlierIndex':self.earlier,'supersededParent':self.oldparent,'currentJudgment':self.current,'correctAdmission':self.adm,'badReference':self.bad,'judgmentIndex':0,'cycles':{self.route:self.cycle},'reason':reason,'unavailableOriginalSources':[{**self.bad,'reason':reason}],'recordedJournals':{self.route:self.proof()}}
  self.ref=self.put('mechanical-correction.json',self.receipt)
 def proof(self,write_anchor=True):
  previous=None
  report=json.loads((self.root/self.report['path']).read_text())
  for e in self.events:
   e['identity']={'siteId':'fixture','canonicalBase':'https://example.com','route':self.route};e['previous']=previous
   if e['kind']=='record':e['data'].update(admission=self.adm,reportObjectSha256=d.sha(json.dumps(report,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()))
   e.pop('eventSha256',None);e['eventSha256']=d.sha(json.dumps(e,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode());previous=e['eventSha256']
  self.jp.write_text(''.join(json.dumps(e)+'\n' for e in self.events))
  if write_anchor:
   gd=Path(subprocess.check_output(['git','rev-parse','--absolute-git-dir'],cwd=self.root,text=True).strip());anchor=gd/'content-review-policy'/(self.jp.stem+'.head');anchor.parent.mkdir(exist_ok=True);anchor.write_text(previous+'\n')
  return {'path':str(self.jp.relative_to(self.root)),'sha256':d.sha(self.jp.read_bytes())}
 def put(self,name,value):
  p=self.root/self.scope/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(value,sort_keys=True));return {'path':str(p.relative_to(self.root)),'sha256':d.sha(p.read_bytes())}
 def opt(self):
  os.environ['CONTENT_REVIEW_REFERENCE_CORRECTION']=self.ref['path'];os.environ['CONTENT_REVIEW_REFERENCE_CORRECTION_SHA256']=self.ref['sha256']
 def test_no_optin_still_fails(self):
  with self.assertRaisesRegex(ValueError,'Missing actual review dependency'):d.collect(self.root,self.journal)
 def test_exact_historical_edge_retained_without_mutating_evidence(self):
  before={p:p.read_bytes() for p in self.root.rglob('*') if p.is_file()};self.opt();paths=d.collect(self.root,self.journal)
  for p,raw in before.items():self.assertEqual(p.read_bytes(),raw)
  for ref in [self.report,self.index,self.earlier,self.oldparent,self.current,self.adm,self.ref]:self.assertEqual(paths[ref['path']],ref['sha256'])
  self.assertFalse(d.cache_path(self.root,self.bad['path'],self.bad['sha256']).exists())
  self.assertEqual(len([x for x in self.events if x['kind']=='record']),1)
 def test_retained_optin_works_without_environment_and_cannot_change(self):
  paths=d.collect(self.root,self.journal,correction_ref=self.ref);self.assertIn(self.ref['path'],paths)
  self.opt();os.environ['CONTENT_REVIEW_REFERENCE_CORRECTION_SHA256']='f'*64
  with self.assertRaisesRegex(ValueError,'Retained correction cannot change'):d.collect(self.root,self.journal,correction_ref=self.ref)
 def test_tampered_receipt_refused(self):
  self.opt();(self.root/self.ref['path']).write_text('{}')
  with self.assertRaisesRegex(ValueError,'bytes changed'):d.collect(self.root,self.journal)
 def test_tampered_report_parent_admission_refused(self):
  for ref in [self.report,self.oldparent,self.adm,self.current,self.index,self.earlier]:
   with self.subTest(path=ref['path']):
    p=self.root/ref['path'];raw=p.read_bytes();p.write_bytes(raw+b' ');self.opt()
    with self.assertRaisesRegex(ValueError,'bytes changed'):d.collect(self.root,self.journal)
    p.write_bytes(raw)
 def test_wrong_cycle_or_job_refused(self):
  self.opt()
  for key in ['cycleId','jobId']:
   old=self.events[0]['data'][key];self.events[0]['data'][key]='changed';self.jp.write_text(''.join(json.dumps(x)+'\n' for x in self.events))
   with self.assertRaisesRegex(ValueError,'bytes changed'):d.collect(self.root,self.journal)
   self.events[0]['data'][key]=old
 def test_same_bad_pair_through_active_authority_still_fails(self):
  # Additional active pointer to the same exact superseded artifact: no historical lineage.
  report=json.loads((self.root/self.report['path']).read_text());report['supplementaryEvidence'].append(self.oldparent)
  self.report=self.put('review.json',report);self.receipt['report']=self.report;self.events[-1]['data']['report']=self.report;self.jp.write_text(''.join(json.dumps(x)+'\n' for x in self.events));self.receipt['recordedJournals']={self.route:self.proof()};self.ref=self.put('mechanical-correction.json',self.receipt);self.opt()
  with self.assertRaisesRegex(ValueError,'Missing actual review dependency'):d.collect(self.root,self.journal)
 def test_active_current_judgment_cannot_be_excluded(self):
  self.receipt['supersededParent']=self.current;self.ref=self.put('mechanical-correction.json',self.receipt);self.opt()
  with self.assertRaisesRegex(ValueError,'Superseded parent changed'):d.collect(self.root,self.journal)
 def test_outside_job_or_wildcard_refused(self):
  for field,value in [('scopeRoot','reports/mindmap-pass/other'),('judgmentIndex','*'),('badReference',{'path':self.adm['path'],'sha256':'*'})]:
   old=self.receipt[field];self.receipt[field]=value;self.ref=self.put('mechanical-correction.json',self.receipt);self.opt()
   with self.assertRaises(ValueError):d.collect(self.root,self.journal)
   self.receipt[field]=old
 def test_existing_explicit_invalid_pending_behavior_unchanged(self):
  paths=d.collect(self.root,self.journal,invalid={(self.bad['path'],self.bad['sha256'])});self.assertIn(self.report['path'],paths)
 def test_requires_already_recorded_report(self):
  self.jp.write_text(''.join(json.dumps(x)+'\n' for x in self.events[:-1]));self.opt()
  with self.assertRaisesRegex(ValueError,'bytes changed'):d.collect(self.root,self.journal)
 def test_other_collecting_route_and_future_round_use_original_proof(self):
  self.opt();first=d.collect(self.root,self.journal)
  # Exact original journal proof is now hash archived; actual journal may advance.
  e={'kind':'reserve','data':{'number':2,'admission':self.adm},'identity':self.events[-1]['identity'],'previous':self.events[-1]['eventSha256']};e['eventSha256']=d.sha(json.dumps(e,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode());self.jp.write_text(self.jp.read_text()+json.dumps(e)+'\n')
  other=self.root/'reports/other.jsonl';other.write_text(json.dumps({'kind':'begin','data':{'jobId':'another-job'}})+'\n'+json.dumps({'kind':'record','data':{'report':self.report}})+'\n')
  other_journal=SimpleNamespace(path=other,route='/another-existing-route')
  paths=d.collect(self.root,other_journal,correction_ref=self.ref)
  self.assertIn(self.report['path'],paths);self.assertEqual(paths[self.adm['path']],self.adm['sha256'])
 def test_checkpoint_retains_receipt_in_existing_journal_metadata(self):
  # Native placement also runs its sibling archive verifier: use real isolated Git artifacts.
  storepath=Path(__file__).with_name('workflow-control-store.py')
  tools=self.root/'.claude/tools';tools.mkdir();shutil.copyfile(storepath,tools/'workflow-control-store.py')
  remote=self.root/'remote.git';subprocess.run(['git','init','--bare','-q',str(remote)],check=True);subprocess.run(['git','remote','add','origin',str(remote)],cwd=self.root,check=True)
  self.opt();self.journal.key=self.jp.stem;self.journal.identity=self.events[-1]['identity']
  module,store=d.backend(self.root);context={'expectedHead':None,'store':store}
  d.checkpoint(self.root,self.journal,context)
  _,state=store.read();entry=state['reviewJournals'][self.journal.key];self.assertEqual(entry['referenceCorrection'],self.ref)
  self.assertEqual(entry['artifacts'][self.ref['path']],self.ref['sha256'])
 def test_clean_other_route_restore_discovers_exact_retained_proof(self):
  # Real bare Git Store authority, not a fake self-consistent proof or mocked remote.
  # Locate active repository relative to this draft artifact.
  storepath=next(p/'.claude/tools/workflow-control-store.py' for p in Path(__file__).resolve().parents if (p/'.claude/tools/workflow-control-store.py').is_file())
  tools=self.root/'.claude/tools';tools.mkdir();shutil.copyfile(storepath,tools/'workflow-control-store.py')
  remote=self.root/'remote.git';subprocess.run(['git','init','--bare','-q',str(remote)],check=True);subprocess.run(['git','remote','add','origin',str(remote)],cwd=self.root,check=True)
  self.opt();paths=d.collect(self.root,self.journal);module,store=d.backend(self.root)
  key=self.jp.stem;identity=self.events[-1]['identity'];head=d.sha(self.jp.read_bytes())
  def retain(state):state['job']={'artifacts':{}};state['reviewJournals']={key:{'identity':identity,'head':head,'artifacts':paths,'referenceCorrection':self.ref}}
  store.mutate(retain,list(paths))
  # Delete only fixture local proof/evidence; leave real bare remote and Git native metadata.
  shutil.rmtree(self.root/'reports');shutil.rmtree(self.root/'.git/content-review-policy')
  os.environ['CONTENT_REVIEW_REFERENCE_CORRECTION']='';os.environ['CONTENT_REVIEW_REFERENCE_CORRECTION_SHA256']=''
  other=SimpleNamespace(key='new-route',path=self.root/'reports/other.jsonl')
  context=d.restore(self.root,other);self.assertEqual(context['referenceCorrection'],self.ref)
  self.assertTrue(d.reference_correction(self.root,None,[],context['referenceCorrection']))
 def test_forged_hash_chain_without_reservation_refused(self):
  self.events=[x for x in self.events if x['kind']!='reserve'];self.receipt['recordedJournals']={self.route:self.proof(write_anchor=False)};self.ref=self.put('mechanical-correction.json',self.receipt);self.opt()
  with self.assertRaisesRegex(ValueError,'not actually reserved'):d.collect(self.root,self.journal)
 def test_forged_rebound_report_with_reservation_but_no_native_anchor_refused(self):
  value=json.loads((self.root/self.report['path']).read_text());value['forged']='new report';self.report=self.put('review.json',value);self.receipt['report']=self.report;self.events[-1]['data']['report']=self.report
  self.receipt['recordedJournals']={self.route:self.proof(write_anchor=False)};self.ref=self.put('mechanical-correction.json',self.receipt);self.opt()
  with self.assertRaisesRegex(ValueError,'native anchored history'):d.collect(self.root,self.journal)
 def test_mismatched_canonical_proof_path_refused(self):
  wrong=self.jp.with_name('wrong.jsonl');wrong.write_bytes(self.jp.read_bytes());self.receipt['recordedJournals'][self.route]={'path':str(wrong.relative_to(self.root)),'sha256':d.sha(wrong.read_bytes())};self.ref=self.put('mechanical-correction.json',self.receipt);self.opt()
  with self.assertRaisesRegex(ValueError,'journal path changed'):d.collect(self.root,self.journal)
 def test_mismatched_canonical_site_identity_refused(self):
  for e in self.events:e['identity']['siteId']='different-site'
  # Rehash fixture chain without granting native anchor authority.
  previous=None
  for e in self.events:
   e['previous']=previous;e.pop('eventSha256',None);e['eventSha256']=d.sha(json.dumps(e,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode());previous=e['eventSha256']
  self.jp.write_text(''.join(json.dumps(e)+'\n' for e in self.events));self.receipt['recordedJournals'][self.route]={'path':str(self.jp.relative_to(self.root)),'sha256':d.sha(self.jp.read_bytes())};self.ref=self.put('mechanical-correction.json',self.receipt);self.opt()
  with self.assertRaisesRegex(ValueError,'identity changed'):d.collect(self.root,self.journal)
 def test_valid_old_anchor_does_not_authenticate_forged_later_record(self):
  original_head=self.events[1]['eventSha256']
  gd=Path(subprocess.check_output(['git','rev-parse','--absolute-git-dir'],cwd=self.root,text=True).strip());anchor=gd/'content-review-policy'/(self.jp.stem+'.head');anchor.write_text(original_head+'\n')
  self.opt()
  with self.assertRaisesRegex(ValueError,'native anchored history'):d.collect(self.root,self.journal)
 def test_normalized_but_unconfigured_host_refused(self):
  cfg=self.root/'.claude/content-review-policy.json';cfg.write_text(json.dumps({'siteId':'fixture','canonicalHosts':['other.example']}));self.opt()
  with self.assertRaisesRegex(ValueError,'host outside site'):d.collect(self.root,self.journal)
if __name__=='__main__':unittest.main()
