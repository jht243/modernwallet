"""Synthetic admission proofs only; no real article verdicts or audit rounds."""
import copy, hashlib, importlib.util, json, tempfile, unittest
from pathlib import Path
from types import SimpleNamespace

def load(name):
 s=importlib.util.spec_from_file_location(name,Path(__file__).with_name(name+'.py'));m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
helper=load('approved-link-audit-scope');portable=load('workflow-handoff');renderer=load('rendered-audit');local=load('workflow-local') if Path(__file__).with_name('workflow-local.py').is_file() else None
class Tests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name)
  self.api=SimpleNamespace(require=portable.require,read=portable.read,evidence_ref=portable.evidence_ref)
  self.before={'slug':'existing','h1':'Existing fixture','updatedDate':'2026-01-01','sections':[{'heading':'Tracking','content':['Original unchanged claim.']}]}
  self.after=copy.deepcopy(self.before);self.after['sections'][0]['content'].append('See [Approved fixture](/guides/new).')
  self.old={'jobId':'original','producer':'synthetic-producer','canonicalBase':'https://fixture.example','routes':['/guides/new'],'reviewCounters':{'reviews':1,'reworks':0},'findings':[{'id':'retained','status':'open','evidence':'Synthetic original finding remains unchanged through admission.'}],'sources':[],'candidates':[]}
 def put(self,name,value):
  p=self.root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(value if isinstance(value,str) else json.dumps(value));return {'path':name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 def fixture(self):
  before=self.put('before.txt','SOURCE data/guides-new.ts\n'+json.dumps(self.before));source=self.put('immutable/guides-new.ts','pages.push('+json.dumps(self.after)+');')
  inspection=self.put('inspection.json',{'inbound':[{'source':'/guides/existing','target':'/guides/new','anchor':'Approved fixture','section':'Tracking','sourceSnapshot':before}]})
  plan=self.put('plan.json',{'jobId':'original','chartPath':'chart.md','newPageBriefs':[{'target':'/guides/new','inboundLinks':{'placements':[{'source':'/guides/existing','target':'/guides/new','anchor':'Approved fixture','section':'Tracking','inspection':inspection}]}}]})
  chart=self.put('chart.md','Synthetic approved chart bytes; no real approval.');review=self.put('review.json',{'reviewer':'synthetic-independent','jobId':'original','verdict':'PASS','manifestFileSha256':plan['sha256']})
  self.old['candidates']=[plan,chart,review];previous=self.put('old.json',self.old)
  boundary=self.put('boundary.json',{'files':{'data/guides-new.ts':{'sha256':source['sha256'],'artifact':source}}})
  # Exercise real snapshot validation; complete synthetic HTML/text is hash bound.
  rows=[]
  for n,route in enumerate(['/guides/new','/guides/existing']):
   html=self.put('page%d.html'%n,'<html><body>synthetic fixture</body></html>');text=self.put('page%d.txt'%n,'Synthetic fixture')
   semantic={'text':'Synthetic fixture'}
   rows.append({'path':route,'semantic':semantic,'fingerprint':renderer.digest(semantic),'failures':[],'htmlFile':str(self.root/html['path']),'htmlSha256':html['sha256'],'textFile':str(self.root/text['path']),'textSha256':text['sha256']})
  snap={'manifest':{'author':'synthetic-author','jobId':'original','canonicalBase':'https://fixture.example','routes':[{'path':r['path']} for r in rows]},'routes':rows,'reviewSourceArchive':boundary};snap['snapshotSha256']=renderer.digest(snap)
  capture=self.put('capture.json',snap);proof=self.put('proof.json',{'version':1,'kind':'approved-existing-link-audit-dependencies','previousHandoff':previous,'approvedManifest':plan,'chartReview':review,'dependencies':[{'route':'/guides/existing','sourcePath':'data/guides-new.ts','currentSource':source}]})
  h=copy.deepcopy(self.old);h.update(routes=['/guides/new','/guides/existing'],previous=previous,snapshot=capture,approvedLinkDependencies=proof,candidates=[capture]);return h
 def check(self,h,phase='audit'):helper.check(self.root,h,self.old,phase,self.api,renderer)
 def test_valid_and_historical_admission(self):
  h=self.fixture();self.check(h);self.check(h,None)
 def test_both_native_interfaces_share_strict_predicate(self):
  for api in [portable] + ([local] if local else []):
   h=self.fixture();api.approved_link_audit_scope_check(self.root,h,self.old,'audit')
   with self.assertRaises(ValueError):api.approved_link_audit_scope_check(self.root,h,self.old,'publish')
 def test_write_publish_identity_counter_finding_and_route_guards(self):
  for change in [{'jobId':'other'},{'canonicalBase':'https://other.example'},{'reviewCounters':{'reviews':0,'reworks':0}},{'findings':[]},{'routes':['/guides/new','/guides/unapproved']}]:
   h=self.fixture();h.update(change)
   with self.subTest(change=change),self.assertRaises((ValueError,KeyError)):self.check(h)
  for phase in ['write','publish']:
   with self.subTest(phase=phase),self.assertRaises(ValueError):self.check(self.fixture(),phase)
 def test_body_date_and_undeclared_paragraph_rejected(self):
  for kind in ['body','date','claim','new-entry']:
   self.after=copy.deepcopy(self.before)
   self.after['sections'][0]['content'].append('See [Approved fixture](/guides/new).')
   if kind=='body':self.after['sections'][0]['content'][0]='Different claim.'
   if kind=='date':self.after['updatedDate']='2026-02-01'
   if kind=='claim':self.after['sections'][0]['content'][-1]+=' It is cheaper.'
   if kind=='new-entry':self.after['slug']='new-other'
   with self.subTest(kind=kind),self.assertRaises((ValueError,KeyError)):self.check(self.fixture())
 def test_live_source_change_preserves_history_but_immutable_tampering_fails(self):
  h=self.fixture();self.put('data/guides-new.ts','Later unrelated live entry change')
  self.check(h,None)
  (self.root/'immutable/guides-new.ts').write_text('Tampered immutable capture')
  with self.assertRaises(ValueError):self.check(h,None)
 def test_wrong_source_identity_fails(self):
  h=self.fixture();p=json.loads((self.root/'proof.json').read_text());p['dependencies'][0]['sourcePath']='data/other.ts'
  h['approvedLinkDependencies']=self.put('wrong-source.json',p)
  with self.assertRaises(ValueError):self.check(h)
 def test_source_only_plan_and_missing_or_producer_reviewer_fail(self):
  h=self.fixture();plan=self.old['candidates'][0];self.old['candidates']=self.old['candidates'][1:];self.old['sources']=[plan]
  with self.assertRaises(ValueError):self.check(h)
  for reviewer in ['', 'synthetic-producer']:
   h=self.fixture();r=json.loads((self.root/'review.json').read_text());r['reviewer']=reviewer
   rr=self.put('invalid-review.json',r);self.old['candidates'][-1]=rr
   proof=json.loads((self.root/'proof.json').read_text());proof['chartReview']=rr
   h['approvedLinkDependencies']=self.put('invalid-proof.json',proof)
   with self.subTest(reviewer=reviewer),self.assertRaises(ValueError):self.check(h)
 def test_tampered_approval_or_missing_capture_rejected(self):
  h=self.fixture();(self.root/'plan.json').write_text('{}')
  with self.assertRaises(ValueError):self.check(h)
  h=self.fixture();(self.root/'page0.html').unlink()
  with self.assertRaises((ValueError,FileNotFoundError)):self.check(h)
if __name__=='__main__':unittest.main()
