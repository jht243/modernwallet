"""Verify real Git ancestry across a same-invocation pull; missing updates still block."""
import importlib.util,os,subprocess,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('actual_cloud_freshness',Path(__file__).with_name('worktree-freshness.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Tests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.base=Path(self.tmp.name).resolve();self.root=self.base/'work';self.root.mkdir()
  self.git('init','-q');self.git('config','user.name','Fixture');self.git('config','user.email','fixture@example.invalid');(self.root/'a.txt').write_text('Original fixture source\n');self.git('add','.');self.git('commit','-qm','initial')
  self.remote=self.base/'remote.git';subprocess.run(['git','clone','-q','--bare',str(self.root),str(self.remote)],check=True,capture_output=True);self.git('remote','add','origin',str(self.remote))
  self.publisher=self.base/'publisher';subprocess.run(['git','clone','-q',str(self.remote),str(self.publisher)],check=True,capture_output=True);self.git('config','user.name','Fixture',root=self.publisher);self.git('config','user.email','fixture@example.invalid',root=self.publisher)
  p=patch.dict(os.environ,{'WORKFLOW_RUN_ID':'synthetic-'+self.base.name});p.start();self.addCleanup(p.stop)
 def git(self,*args,root=None):return subprocess.check_output(['git',*args],cwd=root or self.root,stderr=subprocess.PIPE)
 def publish(self,name,text):
  (self.publisher/name).write_text(text);self.git('add','.',root=self.publisher);self.git('commit','-qm','published fixture',root=self.publisher);self.git('push','-q','origin','HEAD',root=self.publisher)
 def integrate(self):
  self.assertEqual(m.cloud_check(self.root)['status'],'current');self.publish('a.txt','New published fixture source\n');self.git('pull','--ff-only','--quiet','origin','HEAD');(self.root/'a.txt').write_text('Legitimate own edit after integrated source\n')
 def test_same_run_integrated_pull_allows_subsequent_own_edits(self):
  self.integrate();self.assertEqual(m.cloud_check(self.root)['status'],'current')
 def test_later_unintegrated_publication_is_still_a_blocker(self):
  self.integrate();self.publish('dependency.txt','Actual newer dependency\n');self.assertEqual(m.cloud_check(self.root)['missing'],['dependency.txt'])
if __name__=='__main__':unittest.main()
