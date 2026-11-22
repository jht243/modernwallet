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
 def test_nested_history_roundtrips_without_changing_retained_artifacts(self):
   payload=self.path.read_bytes();digest=hashlib.sha256(payload).hexdigest()
   retained={'identity':{'route':'/guides/example','name':'caf\u00e9'},'head':'d'*64,
             'rounds':[{'number':1,'verdict':'FAIL','findings':['preserve: punctuation, quotes " and unicode \u2713']}],
             'artifacts':{'reports/input.json':digest}}
   self.store.mutate(lambda state:state.update(job={'artifacts':{}},reviewJournals={'retained':retained}),['reports/input.json'])
   revision,state=self.store.read()
   self.assertEqual(state['reviewJournals']['retained'],retained)
   self.assertEqual(state['job']['artifacts']['reports/input.json'],digest)
   self.assertEqual(m.git(self.root,'show',revision+':artifacts/'+digest).stdout,payload)
 def test_large_history_fits_without_dropping_records_or_raising_size_bound(self):
   history=[{'identity':{'route':'/guides/retained-'+str(i)},'head':'a'*64,
             'rounds':[{'number':1,'status':'complete','verdict':'FAIL'}]} for i in range(80000)]
   proposed={'version':1,'slots':[],'candidates':{},'job':None,'history':history}
   self.assertGreater(len((json.dumps(proposed,sort_keys=True,indent=2)+'\n').encode()),20000000)
   self.assertLess(len((json.dumps(proposed,sort_keys=True,separators=(',', ':'))+'\n').encode()),20000000)
   self.store.mutate(lambda state:state.update(history=history))
   revision,state=self.store.read()
   self.assertEqual(state['history'],history)
   self.assertLess(len(m.git(self.root,'show',revision+':state.json').stdout),20000000)
 def test_exact_capacity_boundary_roundtrips_and_overflow_does_not_advance_ref(self):
   _,initial=self.store.read()
   retained={'identity':{'route':'/guides/keep-existing'},'rounds':[{'number':1,'verdict':'FAIL'}],'artifacts':{'reports/input.json':hashlib.sha256(self.path.read_bytes()).hexdigest()}}
   proposed={**initial,'history':retained,'payload':''}
   overhead=len((json.dumps(proposed,sort_keys=True,separators=(',',':'))+'\n').encode())
   payload='x'*(m.STATE_LIMIT_BYTES-overhead)
   self.assertEqual(m.STATE_LIMIT_BYTES,96_000_000)
   self.store.mutate(lambda state:state.update(history=retained,payload=payload))
   revision,state=self.store.read();raw=m.git(self.root,'show',revision+':state.json').stdout
   self.assertEqual(len(raw),96_000_000)
   self.assertEqual(state['history'],retained)
   self.assertEqual(hashlib.sha256(state['payload'].encode()).hexdigest(),hashlib.sha256(payload.encode()).hexdigest())
   expected=(json.dumps({**proposed,'payload':payload},sort_keys=True,separators=(',',':'))+'\n').encode()
   self.assertEqual(hashlib.sha256(raw).hexdigest(),hashlib.sha256(expected).hexdigest())
   with self.assertRaisesRegex(m.ControlError,'bounded storage capacity'):
    self.store.mutate(lambda current:current.update(payload=payload+'x'))
   after,unchanged=self.store.read();self.assertEqual(after,revision);self.assertEqual(unchanged,state)
 def test_expanded_state_capacity_preserves_secret_refusal_and_reference(self):
   self.store.mutate(lambda state:state.update(marker='preserve-before-refusal'))
   revision,before=self.store.read()
   with self.assertRaisesRegex(m.ControlError,'Sensitive workflow state refused'):
    self.store.mutate(lambda state:state.update(payload='x'*32_000_000,secret='sk-proj-'+'a'*32))
   after,state=self.store.read();self.assertEqual(after,revision);self.assertEqual(state,before)
 def test_retained_metadata_can_grow_past_legacy_limit_without_truncation(self):
   payload='x'*20000000;expected=hashlib.sha256(payload.encode()).hexdigest()
   self.store.mutate(lambda state:state.update(retainedHistory={'head':'a'*64,'payload':payload}))
   revision,state=self.store.read()
   self.assertEqual(state['retainedHistory']['head'],'a'*64)
   self.assertEqual(hashlib.sha256(state['retainedHistory']['payload'].encode()).hexdigest(),expected)
   size=len(m.git(self.root,'show',revision+':state.json').stdout)
   self.assertGreater(size,20000000);self.assertLess(size,m.STATE_LIMIT_BYTES)
 def test_individual_artifact_limit_is_not_increased_with_state_capacity(self):
   self.path.write_bytes(b'x'*20000001)
   with self.assertRaisesRegex(m.ControlError,'oversized artifact'):
    self.store.mutate(lambda state:state.update(job={'artifacts':{}}),['reports/input.json'])
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

 def test_duplicate_current_bytes_keep_every_path_check_and_write_blob_once(self):
   second=self.root/'reports/alias.json';second.write_bytes(self.path.read_bytes())
   payload=self.path.read_bytes();real_sha=m.sha;real_git=m.git;real_safe=m.safe_path;real_privacy=m.has_sensitive_material
   hashes=[];checked_paths=[];privacy=[];writes=[]
   def digest(raw):hashes.append(raw);return real_sha(raw)
   def safe(root,path):checked_paths.append(path);return real_safe(root,path)
   def private(raw):privacy.append(raw);return real_privacy(raw)
   def git(root,*args,**kw):
    if args[0]=='hash-object':writes.append(kw.get('data'))
    return real_git(root,*args,**kw)
   with mock.patch.object(m,'sha',side_effect=digest),mock.patch.object(m,'safe_path',side_effect=safe),mock.patch.object(m,'has_sensitive_material',side_effect=private),mock.patch.object(m,'git',side_effect=git):
    self.store.mutate(lambda s:s.update(job={'artifacts':{}}),['reports/input.json','reports/alias.json'])
   self.assertEqual(checked_paths,['reports/input.json','reports/alias.json'])
   self.assertEqual(hashes.count(payload),2)
   self.assertEqual(privacy.count(payload),1)
   self.assertEqual(writes.count(payload),1)
   rev,state=self.store.read();want=hashlib.sha256(payload).hexdigest()
   self.assertEqual(state['job']['artifacts'],{'reports/input.json':want,'reports/alias.json':want})
   self.assertEqual(m.git(self.root,'show',rev+':artifacts/'+want).stdout,payload)
 def test_changed_second_file_secret_is_never_cached_by_name_or_previous_call(self):
   second=self.root/'reports/alias.json';second.write_bytes(self.path.read_bytes())
   files=['reports/input.json','reports/alias.json'];self.store.mutate(lambda s:s.update(job={'artifacts':{}}),files);revision,_=self.store.read()
   second.write_text('sk-proj-'+'x'*32)
   with self.assertRaises(m.ControlError):
    self.store.mutate(lambda s:s.update(step=2),files)
   self.assertEqual(self.store.read()[0],revision)
 def test_cached_digest_does_not_remove_path_dependent_size_check(self):
   payload=b'x'*20_000_001;digest=hashlib.sha256(payload).hexdigest()
   valid=self.root/'reports/correction-sources/blobs'/digest/'guides-new.ts';valid.parent.mkdir(parents=True);valid.write_bytes(payload)
   self.store.mutate(lambda s:s.update(job={'artifacts':{}}),[str(valid.relative_to(self.root))])
   revision,_=self.store.read();self.path.write_bytes(payload)
   with self.assertRaises(m.ControlError):
    self.store.mutate(lambda s:s.update(step=2),['reports/input.json'])
   self.assertEqual(self.store.read()[0],revision)
if __name__=='__main__':unittest.main()
