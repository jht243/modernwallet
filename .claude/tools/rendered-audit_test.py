import copy
import importlib.util
import pathlib
import unittest
spec=importlib.util.spec_from_file_location('audit',pathlib.Path(__file__).with_name('rendered-audit.py'))
a=importlib.util.module_from_spec(spec); spec.loader.exec_module(a)
HTML='''<html><head><title>Model guide</title><link rel="canonical" href="https://example.com/guide"><meta name="robots" content="index,follow"><script type="application/ld+json">{"@type":"Article","datePublished":"2026-10-27","dateModified":"2026-10-27","url":"https://example.com/guide"}</script></head><body><main><h1>Model guide</h1><p>Updated Oct 27, 2026</p><p>'''+('Useful complete reader-facing content. '*12)+'''</p><a href="https://example.com/other">Related guide</a></main><script>build123</script></body></html>'''
class Tests(unittest.TestCase):
 def snapshot(self,html=HTML):
  m={'author':'writer','canonicalBase':'https://example.com','routes':[{'path':'/guide','expectedUpdatedDate':'2026-10-27'}]}
  r=a.parse(html,m['routes'][0],'http://localhost:3000',m['canonicalBase'])
  s={'manifest':m,'routes':[r],'baseUrl':'https://example.com','capturedAt':'2026-10-27T18:00:00+00:00'}; s['snapshotSha256']=a.digest(s); return s
 def review(self,s):
  return {'reviewer':'independent','snapshotSha256':s['snapshotSha256'],'routes':[{'path':'/guide','fingerprint':s['routes'][0]['fingerprint'],'verdict':'PASS','checks':{k:{'status':'PASS','evidence':'Fixture evidence for negative-path testing only.'} for k in a.CHECKS}}]}
 def test_valid(self):
  s=self.snapshot(); a.review_check(s,self.review(s))
 def test_date_regression(self):
  s=self.snapshot(HTML.replace('"dateModified":"2026-10-27"','"dateModified":"2026-09-09"'))
  with self.assertRaises(ValueError): a.valid_snapshot(s)
 def test_injected_copy_invalidates_approval(self):
  s=self.snapshot(); live=self.snapshot(HTML.replace('</main>','<p>Unreviewed injected claim</p></main>'))
  with self.assertRaises(ValueError): a.compare(s,live,self.review(s))
 def test_shell(self):
  s=self.snapshot('<html><body><div id="app"></div></body></html>')
  with self.assertRaises(ValueError): a.valid_snapshot(s)
 def test_missing_route_or_check(self):
  s=self.snapshot(); review=self.review(s); del review['routes'][0]['checks']['sourceSupport']
  with self.assertRaises(ValueError): a.review_check(s,review)
  review=self.review(s); review['routes']=[]
  with self.assertRaises(ValueError): a.review_check(s,review)
 def test_independence(self):
  s=self.snapshot(); review=self.review(s); review['reviewer']='writer'
  with self.assertRaises(ValueError): a.review_check(s,review)
 def test_origins_build_ids_ignored_not_copy(self):
  s=self.snapshot(); other=self.snapshot(HTML.replace('https://example.com','http://localhost:3000').replace('build123','build456'))
  a.compare(s,other,self.review(s),require_live=False)
 def test_preview_is_not_live(self):
  s=self.snapshot(); live=copy.deepcopy(s); live['baseUrl']='http://localhost:3000'; del live['snapshotSha256']; live['snapshotSha256']=a.digest(live)
  with self.assertRaisesRegex(ValueError,'canonical production'): a.compare(s,live,self.review(s))
 def test_visible_date_not_publication(self):
  s=self.snapshot(HTML.replace('Updated Oct 27, 2026','Published Oct 27, 2026 Updated Sep 9, 2026'))
  with self.assertRaisesRegex(ValueError,'Visible updated'): a.valid_snapshot(s)
 def test_readable_date_variants_and_review_date(self):
  s=self.snapshot(HTML.replace('Updated Oct 27, 2026','Updated on October 27 2026 Last reviewed September 9, 2026')); a.valid_snapshot(s)
 def test_robots_none(self):
  s=self.snapshot(HTML.replace('index,follow','none'))
  with self.assertRaisesRegex(ValueError,'blocks indexing'): a.valid_snapshot(s)
 def test_form_and_svg(self):
  for element in ['<input value="new">','<svg><path d="M1 2 L3 4"></path></svg>','<img src="new.png" alt="changed">']:
   s=self.snapshot(); live=self.snapshot(HTML.replace('</main>',element+'</main>'))
   with self.assertRaisesRegex(ValueError,'Rendered content differs'): a.compare(s,live,self.review(s))
 def test_nested_schema_date(self):
  s=self.snapshot(HTML.replace('"@type":"Article"','"isPartOf":{"@type":"WebSite","dateModified":"2026-01-01"},"@type":"Article"')); a.valid_snapshot(s)
 def test_tampered_snapshot(self):
  s=self.snapshot(); s['routes'][0]['semantic']['text']='changed'
  with self.assertRaises(ValueError): a.valid_snapshot(s)
 def test_date_and_source_cannot_be_na(self):
  s=self.snapshot(); review=self.review(s); review['routes'][0]['checks']['datesAndSchema']['status']='NA'
  with self.assertRaises(ValueError): a.review_check(s,review)
 def test_commit_evidence(self):
  s=self.snapshot()
  with self.assertRaises(ValueError): a.record(s,s,self.review(s),'a'*40,{'commit':'b'*40,'status':'live'},'/tmp/should-not-write-render-audit.jsonl')
if __name__=='__main__': unittest.main()
