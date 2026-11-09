"""Exercise real durable artifact persistence in isolated local Git repositories."""
import hashlib,importlib.util,json,subprocess,tempfile,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('store_fixture',Path(__file__).with_name('workflow-control-store.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Tests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.base=Path(self.tmp.name).resolve();self.root=self.base/'checkout'
  for args in [['init','--bare',str(self.base/'origin')],['clone',str(self.base/'origin'),str(self.root)]]:subprocess.run(['git',*args],check=True,capture_output=True)
  self.store=m.Store(self.root);p=self.root/'reports/input.json';p.parent.mkdir();p.write_text('{"private_fixture":true}')
  self.path=p
 def test_checkpoint_preserves_exact_original_artifact(self):
  raw=self.path.read_bytes();digest=hashlib.sha256(raw).hexdigest()
  def add(state):state['job']={'artifacts':{}};state['hype']={'fixture':True}
  self.store.mutate(add,['reports/input.json'])
  revision,state=self.store.read();self.assertTrue(state['hype']['fixture'])
  self.assertEqual(state['job']['artifacts']['reports/input.json'],digest)
  persisted=m.git(self.root,'show',revision+':artifacts/'+digest).stdout
  self.assertEqual(persisted,raw)
 def test_sensitive_state_is_refused_before_it_can_be_pushed(self):
  def secret(state):state['bad']='sk-proj-'+('b'*32)
  with self.assertRaises(m.ControlError):self.store.mutate(secret)
  self.assertEqual(self.store.read()[0],None)
 def test_sensitive_artifacts_are_not_checkpointed(self):
  self.path.write_text('sk-proj-'+('a'*32))
  with self.assertRaises(m.ControlError):self.store.mutate(lambda state:None,['reports/input.json'])
  with self.assertRaises(m.ControlError):m.safe_path(self.root,'../outside.json')
  self.assertEqual(self.store.read()[0],None)
if __name__=='__main__':unittest.main()
