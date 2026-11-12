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
 def test_partial_clone_read_and_mutate_avoid_downloading_historical_blobs(self):
  origin=self.base/'origin'
  for k in ('uploadpack.allowFilter','uploadpack.allowAnySHA1InWant','protocol.version'):
   subprocess.run(['git','-C',str(origin),'config',k,'2' if k=='protocol.version' else 'true'],check=True,capture_output=True)
  fresh=self.base/'fresh'
  subprocess.run(['git','-c','protocol.version=2','clone','file://'+str(origin),str(fresh)],check=True,capture_output=True)
  old_payload=b'historical-artifact-'+(b'x'*65536)
  old_digest=hashlib.sha256(old_payload).hexdigest()
  (self.root/'reports/old.bin').write_bytes(old_payload)
  def seed(state):state['job']={'artifacts':{}}
  self.store.mutate(seed,['reports/old.bin'])
  rev1,_=self.store.read()
  old_oid=subprocess.check_output(['git','-C',str(origin),'rev-parse',rev1+':artifacts/'+old_digest]).decode().strip()
  fresh_store=m.Store(fresh)
  rev_read,st_read=fresh_store.read()
  self.assertEqual(rev_read,rev1)
  self.assertEqual(st_read['job']['artifacts']['reports/old.bin'],old_digest)
  no_lazy=dict(__import__('os').environ,GIT_NO_LAZY_FETCH='1')
  self.assertNotEqual(subprocess.run(['git','-C',str(fresh),'cat-file','-e',old_oid],env=no_lazy,capture_output=True).returncode,0)
  (fresh/'reports').mkdir(exist_ok=True);(fresh/'reports/new.json').write_bytes(b'{"new":true}')
  fresh_store.mutate(lambda s:s.update(step=2),['reports/new.json'])
  self.assertNotEqual(subprocess.run(['git','-C',str(fresh),'cat-file','-e',old_oid],env=no_lazy,capture_output=True).returncode,0)
  rev2,st2=fresh_store.read()
  self.assertEqual(st2['step'],2)
  self.assertEqual(m.git(fresh,'show',rev2+':artifacts/'+old_digest).stdout,old_payload)
if __name__=='__main__':unittest.main()
