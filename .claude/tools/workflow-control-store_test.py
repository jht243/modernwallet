"""Exercise real durable artifact persistence in isolated local Git repositories."""
import hashlib,importlib.util,json,subprocess,tempfile,unittest
from unittest import mock
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
 def test_push_timeout_is_bounded_and_configurable(self):
  with mock.patch.dict(m.os.environ):
   m.os.environ.pop('WORKFLOW_CONTROL_PUSH_TIMEOUT_SECONDS',None)
   self.assertEqual(m.push_timeout(),600)
   for value in ('30','240','900'):
    m.os.environ['WORKFLOW_CONTROL_PUSH_TIMEOUT_SECONDS']=value
    self.assertEqual(m.push_timeout(),int(value))
   for value in ('0','29','901','-1','nan','1.5',''):
    m.os.environ['WORKFLOW_CONTROL_PUSH_TIMEOUT_SECONDS']=value
    with self.assertRaises(m.ControlError):self.store.mutate(lambda state:None)
  self.assertEqual(self.store.read()[0],None)
 def test_unaccepted_upload_timeout_uses_existing_nonforced_retry(self):
  real_git=m.git;pushes=[];calls=[]
  def upload(root,*args,**kwargs):
   if args[0]=='push':
    pushes.append((args,kwargs))
    if len(pushes)==1:raise subprocess.TimeoutExpired('git',kwargs['timeout'])
   return real_git(root,*args,**kwargs)
  def add(state):calls.append(True);state['job']={'artifacts':{}};return 'saved'
  with mock.patch.dict(m.os.environ,{'WORKFLOW_CONTROL_PUSH_TIMEOUT_SECONDS':'240'}),mock.patch.object(m,'git',side_effect=upload):
   self.assertEqual(self.store.mutate(add,['reports/input.json']),'saved')
  self.assertEqual(len(pushes),2);self.assertEqual(len(calls),2)
  for args,kwargs in pushes:
   self.assertEqual(args[:3],('push','--quiet','origin'))
   self.assertFalse(args[3].startswith('+'));self.assertNotIn('--force',args)
   self.assertEqual(kwargs['timeout'],240)
   self.assertEqual(kwargs['env']['GIT_NO_LAZY_FETCH'],'1')
  self.assertEqual(self.store.read()[1]['job']['artifacts']['reports/input.json'],hashlib.sha256(self.path.read_bytes()).hexdigest())
 def test_accepted_upload_timeout_does_not_apply_mutation_twice(self):
  real_git=m.git;calls=[];pushes=[]
  def accepted(root,*args,**kwargs):
   result=real_git(root,*args,**kwargs)
   if args[0]=='push':
    pushes.append(args);self.assertEqual(result.returncode,0)
    raise subprocess.TimeoutExpired('git',kwargs['timeout'],stderr=b'private transport diagnostics')
   return result
  def add(state):calls.append(True);state['job']={'artifacts':{}};return 'accepted'
  with mock.patch.object(m,'git',side_effect=accepted):
   self.assertEqual(self.store.mutate(add,['reports/input.json']),'accepted')
  self.assertEqual(len(calls),1);self.assertEqual(len(pushes),1)
  self.assertIn('reports/input.json',self.store.read()[1]['job']['artifacts'])
 def test_timeout_reconciliation_accepts_concurrently_advanced_history(self):
  real_git=m.git;calls=[];first=[True]
  def accepted_then_advanced(root,*args,**kwargs):
   result=real_git(root,*args,**kwargs)
   if args[0]=='push' and first[0]:
    first[0]=False;self.assertEqual(result.returncode,0)
    m.Store(self.root).mutate(lambda state:state.update(other_writer='preserved'))
    raise subprocess.TimeoutExpired('git',kwargs['timeout'])
   return result
  def add(state):calls.append(True);state['job']={'artifacts':{}};return 'accepted'
  with mock.patch.object(m,'git',side_effect=accepted_then_advanced):
   self.assertEqual(self.store.mutate(add,['reports/input.json']),'accepted')
  self.assertEqual(len(calls),1)
  self.assertEqual(self.store.read()[1]['other_writer'],'preserved')
 def test_upload_timeouts_exhaust_only_existing_five_attempts(self):
  real_git=m.git;pushes=[]
  def timeout(root,*args,**kwargs):
   if args[0]=='push':
    pushes.append(args);raise subprocess.TimeoutExpired('git',kwargs['timeout'],stderr=b'private transport diagnostics')
   return real_git(root,*args,**kwargs)
  with mock.patch.object(m,'git',side_effect=timeout):
   with self.assertRaisesRegex(m.ControlError,'Control ref contention/unavailable') as caught:
    self.store.mutate(lambda state:state.update(job={'artifacts':{}}))
  self.assertEqual(len(pushes),5)
  self.assertNotIn('private transport diagnostics',str(caught.exception))
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
