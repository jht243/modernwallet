"""Synthetic real-Git propagation regressions only; no editorial verdict or live-site claim."""
import importlib.util,json,pathlib,shutil,subprocess,unittest
from types import SimpleNamespace
from unittest.mock import patch
HERE=pathlib.Path(__file__).resolve().parent
ROOT=next(p for p in HERE.parents if (p/'.claude/tools/content-review-durable.py').is_file())
def load(name,p):
 spec=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
fixture_module=load('registered_native_fixture',ROOT/'.claude/tools/content-review-reference_test.py')
a=load('archive_draft',HERE/'review-archive.py')
class Tests(unittest.TestCase):
 def setUp(self):
  self.fixture=fixture_module.Tests();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups);self.root=self.fixture.root;self.d=fixture_module.d
  tools=self.root/'.claude/tools';tools.mkdir();shutil.copyfile(ROOT/'.claude/tools/workflow-control-store.py',tools/'workflow-control-store.py')
  remote=self.root/'remote.git';subprocess.run(['git','init','--bare','-q',str(remote)],check=True);subprocess.run(['git','remote','add','origin',str(remote)],cwd=self.root,check=True)
  self.module,self.store=self.d.backend(self.root)
 def seed_registered(self):
  f=self.fixture;paths=self.d.collect(self.root,f.journal,correction_ref=f.ref)
  def retain(state):state.update(job={'artifacts':{}},reviewJournals={f.jp.stem:{'identity':f.events[-1]['identity'],'head':self.d.sha(f.jp.read_bytes()),'artifacts':paths,'referenceCorrection':f.ref}})
  self.store.mutate(retain,list(paths));return paths
 def test_unregistered_legacy_behavior_keeps_native_failure(self):
  f=self.fixture;ref=a.registered_collection_correction(self.root,self.d,self.store);self.assertIsNone(ref)
  with self.assertRaisesRegex(ValueError,'Missing actual review dependency'):
   self.d.collect(self.root,f.journal,correction_ref=ref)
 def test_registered_metadata_reuses_authenticated_history_and_roots(self):
  f=self.fixture;self.seed_registered();ref=a.registered_collection_correction(self.root,self.d,self.store);self.assertEqual(ref,f.ref)
  history=self.d.collect(self.root,f.journal,correction_ref=ref);roots=self.d.collect(self.root,None,extra={f.report['path']:f.report['sha256']},correction_ref=ref)
  self.assertIn(f.current['path'],history);self.assertEqual(roots[f.adm['path']],f.adm['sha256'])
  for name in set(history)|set(roots):self.module.safe_path(self.root,name)
 def test_registered_metadata_never_exempts_active_bad_pair(self):
  f=self.fixture;self.seed_registered();ref=a.registered_collection_correction(self.root,self.d,self.store);active=f.put('active-authority.json',{'requiredAdmission':f.bad})
  with self.assertRaisesRegex(ValueError,'Missing actual review dependency'):
   self.d.collect(self.root,None,extra={active['path']:active['sha256']},correction_ref=ref)
 def test_clean_archive_worker_hydrates_actual_registered_native_proof(self):
  f=self.fixture;self.seed_registered();shutil.rmtree(self.root/'reports');shutil.rmtree(self.root/'.git/content-review-policy')
  ref=a.registered_collection_correction(self.root,self.d,self.store)
  paths=self.d.collect(self.root,None,extra={f.report['path']:f.report['sha256']},correction_ref=ref)
  self.assertEqual(paths[self.d.cache_path(self.root,f.report['path'],f.report['sha256']).relative_to(self.root).as_posix()],f.report['sha256'])
 def test_conflicting_registered_receipts_fail_closed(self):
  f=self.fixture;state={'reviewJournals':{'first':{'referenceCorrection':f.ref},'second':{'referenceCorrection':{**f.ref,'sha256':'f'*64}}}}
  with self.assertRaisesRegex(ValueError,'Multiple historical corrections'):
   a.registered_collection_correction(self.root,self.d,self.store,'unused',state)
 def test_corrupt_registered_hash_cannot_be_hydrated_or_accepted(self):
  f=self.fixture;self.seed_registered();revision,state=self.store.read();state['reviewJournals'][f.jp.stem]['referenceCorrection']={**f.ref,'sha256':'f'*64}
  with self.assertRaises(Exception):a.registered_collection_correction(self.root,self.d,self.store,revision,state)
 def test_save_checked_pair_passes_registered_ref_to_history(self):
  # Exercise actual save_checked_pair argument propagation without claiming a release/publishing.
  f=self.fixture;self.seed_registered();snap=f.put('candidate.json',{'manifest':{'canonicalBase':'https://example.com','workflowKind':'mindmap-pass','jobId':f.job},'baseUrl':'http://localhost:1234'})
  report=f.put('candidate-review.json',{'routes':[{'reviewBudget':f.adm}]})
  # Instead of replacing import mechanics, materialize a small fixture-only policy module.
  pp=self.root/'.claude/tools/content-review-policy.py';pp.write_text('from pathlib import Path\nfrom types import SimpleNamespace\ndef artifact(root,ref):return root/ref["path"]\ndef Journal(root,base,route):return SimpleNamespace(path=root/'+repr(str(f.jp.relative_to(self.root)))+',route=route)\n')
  with patch.object(a,'durable',return_value=self.d),patch.object(a,'search_job',return_value=None),patch.object(a,'source_manifest',return_value=('a'*40,{})),patch.object(a,'persist',return_value='fixture-only-index') as persist:
   result=a.save_checked_pair(self.root,self.root/snap['path'],self.root/report['path'])
  self.assertEqual(result,'fixture-only-index');self.assertIn(f.current['path'],persist.call_args.args[9])
 def test_persist_roots_with_registered_metadata_writes_verified_native_archive(self):
  f=self.fixture;self.seed_registered();src=self.root/'src';src.mkdir();(src/'base.txt').write_text('synthetic unchanged source')
  for args in [('config','user.name','fixture'),('config','user.email','fixture@invalid.test'),('add','src'),('commit','-qm','synthetic base')]:subprocess.run(['git',*args],cwd=self.root,check=True,capture_output=True)
  base=subprocess.check_output(['git','rev-parse','HEAD'],cwd=self.root,text=True).strip()
  index=a.persist(self.root,self.store,self.d,{f.report['path']:f.report['sha256']},base,{},None,f.job,False)
  self.assertEqual(len(index),64);revision,state=self.store.read();self.assertIn(index,state['verifiedReleasePairs'].values())
  raw=a.call(self.root,'show',revision+':artifacts/'+index).stdout;saved=json.loads(raw)
  self.assertEqual(saved['paths'][f.adm['path']],f.adm['sha256'])
if __name__=='__main__':unittest.main()
