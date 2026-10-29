import importlib.util, pathlib, subprocess, tempfile, unittest, json, os
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('fresh',pathlib.Path(__file__).with_name('worktree-freshness.py'));f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
class PrimaryTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.envpatch=patch.dict(os.environ,{'WORKFLOW_RUN_ID':self.tmp.name});self.envpatch.start();self.addCleanup(self.envpatch.stop);self.addCleanup(self.tmp.cleanup);self.root=pathlib.Path(self.tmp.name)/'source';self.root.mkdir();self.g('init','-q');self.g('config','user.name','Fixture');self.g('config','user.email','fixture@example.invalid');self.write('a.txt','one\ntwo\nthree\nfour\nfive\n');self.g('add','.');self.g('commit','-qm','initial');self.remote=pathlib.Path(self.tmp.name)/'remote.git';subprocess.check_call(['git','clone','-q','--bare',str(self.root),str(self.remote)]);self.g('remote','add','origin',str(self.remote));self.publisher=pathlib.Path(self.tmp.name)/'publisher';subprocess.check_call(['git','clone','-q',str(self.remote),str(self.publisher)]);self.g('config','user.name','Publisher',root=self.publisher);self.g('config','user.email','publisher@example.invalid',root=self.publisher)
 def g(self,*args,root=None):return subprocess.check_output(['git','-C',str(root or self.root),*args],stderr=subprocess.PIPE)
 def write(self,path,text,root=None):p=(root or self.root)/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
 def publish(self,path='a.txt',text='published\ntwo\nthree\nfour\nfive\n'):
  self.write(path,text,self.publisher);self.g('add','.',root=self.publisher);self.g('commit','-qm','published',root=self.publisher);self.g('push','-q','origin','HEAD',root=self.publisher)
 def test_symlink_is_not_regular_file(self):
  self.assertFalse(f.includes_published(('100644',b'a'),('120000',b'b'),('100644',b'b')))
 def test_receipt_different_run_cannot_hide_revert(self):
  self.publish();self.write('a.txt','published\ntwo\nthree\nfour\nfive\n')
  with patch.dict(os.environ,{'WORKFLOW_RUN_ID':'first'}):self.assertEqual(f.primary_check(self.root)['status'],'current')
  self.g('checkout','HEAD','--','a.txt')
  with patch.dict(os.environ,{'WORKFLOW_RUN_ID':'second'}):self.assertEqual(f.primary_check(self.root)['missing'],['a.txt'])
 def test_cloud_untracked_inputs_block_new_run(self):
  with patch.dict(os.environ,{'WORKFLOW_RUN_ID':'first'}):
   self.assertEqual(f.cloud_check(self.root)['status'],'current');self.write('new.py','run owned');self.assertEqual(f.cloud_check(self.root)['status'],'current')
  with patch.dict(os.environ,{'WORKFLOW_RUN_ID':'second'}):self.assertEqual(f.cloud_check(self.root)['missing'],['new.py'])
 def test_no_run_id_never_reuses_receipt(self):
  with patch.dict(os.environ,{},clear=True):
   self.assertEqual(f.cloud_check(self.root)['status'],'current');self.write('new.py','run owned');self.assertEqual(f.cloud_check(self.root)['missing'],['new.py'])
 def test_own_commit_retains_acknowledged_base(self):
  self.publish();self.write('a.txt','published\ntwo\nthree\nfour\nfive\n');self.assertEqual(f.primary_check(self.root)['status'],'current');self.write('a.txt','owned\ntwo\nthree\nfour\nfive\n');self.g('commit','-qam','run ownedit');self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_branch_switch_invalidates(self):
  f.primary_check(self.root);self.publish();self.g('checkout','-qb','other');self.assertEqual(f.primary_check(self.root)['missing'],['a.txt'])
 def test_new_file_inclusion(self):
  entry=lambda x:('100644',x)
  for local in [b'a\nb\nextra\n',b'extra\na\nb\n',b'a\nextra\nb\n']:
   self.assertTrue(f.includes_published(None,entry(local),entry(b'a\nb\n')))
  for local in [b'a\n',b'a\nchanged\n',b'b\na\n',b'a\nb',b'a\nb\n\0']:
   self.assertFalse(f.includes_published(None,entry(local),entry(b'a\nb\n')))
  self.assertFalse(f.includes_published(None,('100755',b'a\nb\nextra\n'),entry(b'a\nb\n')))
 def test_cloud_receipt_handles_next_publication(self):
  self.assertEqual(f.cloud_check(self.root)['status'],'current');self.write('own.py','owned');self.publish();self.assertEqual(f.cloud_check(self.root)['missing'],['a.txt']);self.write('a.txt','published\ntwo\nthree\nfour\nfive\n');self.assertEqual(f.cloud_check(self.root)['status'],'current')
 def test_clean_behind_blocks(self):self.publish();self.assertEqual(f.primary_check(self.root)['missing'],['a.txt'])
 def test_remote_hunk_and_unrelated_local_edit_pass(self):
  self.publish();self.write('a.txt','published\ntwo\nthree\nfour\nlocal\n');self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_overlap_blocks(self):self.publish();self.write('a.txt','other\ntwo\nthree\nfour\nfive\n');self.assertEqual(f.primary_check(self.root)['missing'],['a.txt'])
 def test_remote_add_collision_blocks(self):self.publish('new.txt','published');self.write('new.txt','local');self.assertEqual(f.primary_check(self.root)['missing'],['new.txt'])
 def test_remote_delete_requires_integration(self):
  self.g('rm','a.txt',root=self.publisher);self.g('commit','-qm','delete',root=self.publisher);self.g('push','-q','origin','HEAD',root=self.publisher);self.assertEqual(f.primary_check(self.root)['missing'],['a.txt']);(self.root/'a.txt').unlink();self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_receipt_preserves_run_edits(self):
  self.assertEqual(f.primary_check(self.root)['status'],'current');self.write('a.txt','owned edit');self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_next_revision_uses_acknowledged_base(self):
  self.publish();self.write('a.txt','published\ntwo\nthree\nfour\nfive\n');self.assertEqual(f.primary_check(self.root)['status'],'current');self.write('a.txt','owned\ntwo\nthree\nfour\nfive\n');self.publish(text='published\ntwo\nthree\nfour\nnew remote\n');self.assertEqual(f.primary_check(self.root)['missing'],['a.txt']);self.write('a.txt','owned\ntwo\nthree\nfour\nnew remote\n');self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_remote_mode_and_symlink(self):
  (self.publisher/'a.txt').chmod(0o755);self.g('add','.',root=self.publisher);self.g('commit','-qm','mode',root=self.publisher);self.g('push','-q','origin','HEAD',root=self.publisher);self.assertEqual(f.primary_check(self.root)['missing'],['a.txt']);(self.root/'a.txt').chmod(0o755);self.assertEqual(f.primary_check(self.root)['status'],'current');(self.publisher/'link').symlink_to('a.txt');self.g('add','.',root=self.publisher);self.g('commit','-qm','link',root=self.publisher);self.g('push','-q','origin','HEAD',root=self.publisher);self.assertEqual(f.primary_check(self.root)['missing'],['link'])
 def test_fetch_failure_blocks(self):
  self.g('remote','set-url','origin',str(self.remote)+'-missing')
  with self.assertRaises(subprocess.CalledProcessError):f.primary_check(self.root)
 def test_receipt_identity_cannot_hide_missing_file(self):
  f.primary_check(self.root);self.publish('new.txt','new');receipt=f.receipt_file(self.root,'primary',f.run_identity());r=json.loads(receipt.read_text());r['identity']='wrong';r['revision']=self.g('rev-parse','HEAD',root=self.publisher).decode().strip();receipt.write_text(json.dumps(r));self.assertEqual(f.primary_check(self.root)['missing'],['new.txt'])
 def test_no_worktree_or_index_mutations(self):
  before=self.g('status','--porcelain');self.publish();f.primary_check(self.root);self.assertEqual(self.g('status','--porcelain'),before)
 def test_same_run_pull_advances_committed_baseline(self):
  self.assertEqual(f.primary_check(self.root)['status'],'current');self.publish();self.g('pull','--ff-only','--quiet','origin','HEAD');self.write('a.txt','owned after integrated pull\ntwo\nthree\nfour\nfive\n');self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_newer_unintegrated_publication_still_blocks_after_pull(self):
  f.primary_check(self.root);self.publish();self.g('pull','--ff-only','--quiet','origin','HEAD');self.write('a.txt','owned after integrated pull\ntwo\nthree\nfour\nfive\n');self.publish('another.txt','new dependency');self.assertEqual(f.primary_check(self.root)['missing'],['another.txt'])
if __name__=='__main__':unittest.main()
