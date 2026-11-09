"""Synthetic canonical handoff checks; never actual content approval."""
import copy,hashlib,importlib.util,json,tempfile,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('handoff_test',Path(__file__).with_name('workflow-handoff.py'))
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
class Tests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name)
  (self.root/'.claude').mkdir();(self.root/'.claude/content-review-policy.json').write_text('{"siteId":"fixture"}')
  self.candidate=self.root/'candidate.txt';self.candidate.write_text('Synthetic retained candidate. No publication.')
  self.ref={'path':'candidate.txt','sha256':hashlib.sha256(self.candidate.read_bytes()).hexdigest()}
  self.value={'version':1,'siteId':'fixture','canonicalBase':'https://fixture.example','jobId':'original','producer':'author','nextAction':'Review this private fixture','routes':['/guide'],'candidates':[self.ref],'sources':[],
   'findings':[{'id':'F1','status':'open','evidence':'Synthetic unresolved finding preserved across this private test only.'}],'reviewCounters':{'reviews':1,'reworks':0}}
  self.path=self.put('handoff.json',self.value)
 def put(self,name,value):
  p=self.root/name;p.write_text(json.dumps(value));return p
 def test_focused_task_preserves_actual_open_findings(self):
  task=h.focused(self.root,self.path,'audit','independent')
  self.assertEqual(task['findings'],self.value['findings']);self.assertEqual(task['reviewCounters'],self.value['reviewCounters'])
  self.assertNotIn('previous',task)
 def test_independent_reviewer_and_original_site_cannot_be_replaced(self):
  with self.assertRaises(ValueError):h.focused(self.root,self.path,'audit','author')
  changed=dict(self.value,siteId='other');p=self.put('other.json',changed)
  with self.assertRaises(ValueError):h.handoff_check(self.root,p)
 def test_candidate_edits_invalidate_the_old_handoff(self):
  self.candidate.write_text('Different content')
  with self.assertRaises(ValueError):h.handoff_check(self.root,self.path)
 def test_job_counters_and_findings_cannot_reset(self):
  for key,value in [('jobId','other'),('reviewCounters',{'reviews':0,'reworks':0}),('findings',[]),('canonicalBase','https://other.example')]:
   current=copy.deepcopy(self.value);current[key]=value
   current['previous']={'path':self.path.name,'sha256':hashlib.sha256(self.path.read_bytes()).hexdigest()}
   p=self.put('next.json',current)
   with self.assertRaises(ValueError):h.handoff_check(self.root,p)
 def test_seal_preserves_exact_immutable_evidence(self):
  out=self.root/'sealed.json'
  h.seal(self.root,self.path,out,h.api());h.handoff_check(self.root,out)
  self.candidate.write_text('Source moved on after an immutable snapshot')
  h.handoff_check(self.root,out)
  with self.assertRaises(ValueError):h.seal(self.root,self.path,out,h.api())
if __name__=='__main__':unittest.main()
