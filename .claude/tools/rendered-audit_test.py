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
 def test_paid_link_relationship_changes_invalidate_review(self):
  s=self.snapshot(HTML.replace('href="https://example.com/other"','href="https://example.com/other" rel="sponsored nofollow" target="_blank"'))
  for change in ['rel="follow" target="_blank"','rel="sponsored nofollow" target="_self"']:
   live=self.snapshot(HTML.replace('href="https://example.com/other"','href="https://example.com/other" '+change))
   with self.assertRaisesRegex(ValueError,'Rendered content differs'): a.compare(s,live,self.review(s))
 def test_commit_evidence(self):
  s=self.snapshot()
  with self.assertRaises(ValueError): a.record(s,s,self.review(s),'a'*40,{'commit':'b'*40,'status':'live'},'/tmp/should-not-write-render-audit.jsonl')
 def test_historical_inline_date_is_not_article_date(self):
  s=self.snapshot(HTML.replace('</main>','<p>The model was <strong>updated on August 13, 2026</strong>.</p></main>')); a.valid_snapshot(s)
 def test_split_updated_label_keeps_date(self):
  s=self.snapshot(HTML.replace('Updated Oct 27, 2026','<span>Updated </span><time>Oct 27, 2026</time>')); a.valid_snapshot(s)
 def test_alias_requires_audited_self_canonical_target(self):
  m={'author':'writer','canonicalBase':'https://example.com','routes':[{'path':'/old','canonicalPath':'/guide'},{'path':'/guide'}]}; a.validate_manifest(m)
  r=a.parse(HTML,{'path':'/old','canonicalPath':'/guide','expectedUpdatedDate':'2026-10-27'},'https://example.com','https://example.com');self.assertEqual(r['failures'],[])
  m['routes'][1]['canonicalPath']='/old'
  with self.assertRaisesRegex(ValueError,'cycles'):a.validate_manifest(m)
  m['routes']=m['routes'][:1]
  with self.assertRaisesRegex(ValueError,'audited'):a.validate_manifest(m)
class Ads(unittest.TestCase):
 def setUp(self):
  self.route={'path':'/guide','volatileThirdPartyAds':'mediavine'}
  self.core='<html><head><title>Guide</title><link rel="canonical" href="https://example.com/guide"><script type="application/ld+json">{"@type":"Article","dateModified":"2026-10-28"}</script></head><body><main><h1>Guide</h1><p>'+('Reader-facing guidance. '*20)+'</p><section id="reader-survey"><button>Results</button><p>1 response</p></section><aside class="affiliate-card"><a href="/product">Affiliate product</a></aside>{ad}<p>Following article paragraph</p></main></body></html>'
  self.ad='<div id="content_2_btf_wrapper" class="adunitwrapper content_btf_wrapper"><div id="google_ads_iframe_123"><iframe id="goog_123"></iframe></div></div><div id="mv-first-video" class="mv-video-target"><p>Up next in 15s</p><a href="https://ads.example/one">Advertisement</a></div>'
 def parse(self,ad='',route=None,body=None):return a.parse((body or self.core).replace('{ad}',ad),route or self.route,'https://example.com','https://example.com')
 def test_rotating_ad_ui_only(self):
  self.assertEqual(self.parse()['fingerprint'],self.parse(self.ad)['fingerprint']);self.assertEqual(self.parse(self.ad)['fingerprint'],self.parse(self.ad.replace('15s','4s').replace('/one','/two'))['fingerprint'])
 def test_no_opt_in_no_exclusion(self):self.assertNotEqual(self.parse(route={'path':'/guide'})['fingerprint'],self.parse(self.ad,route={'path':'/guide'})['fingerprint'])
 def test_reader_content_remains_bound(self):
  for before,after in [('1 response','2 responses'),('Affiliate product','Untrue product claim'),('Following article paragraph','Changed answer'),('2026-10-28','2026-10-29'),('href="/product"','href="/other"')]:self.assertNotEqual(self.parse(self.ad)['fingerprint'],self.parse(self.ad,body=self.core.replace(before,after))['fingerprint'])
 def test_body_classes_only_known_transients(self):
  self.assertEqual(self.parse()['fingerprint'],self.parse(body=self.core.replace('<body>','<body class="mv-loaded mv-device-desktop">'))['fingerprint']);self.assertNotEqual(self.parse()['fingerprint'],self.parse(body=self.core.replace('<body>','<body class="hidden">'))['fingerprint'])
 def test_unknown_region_rejected(self):
  with self.assertRaises(ValueError):a.validate_manifest({'author':'a','canonicalBase':'https://example.com','routes':[{'path':'/guide','volatileThirdPartyAds':'reader-survey'}]})
 def test_full_html_hash_retained(self):self.assertNotEqual(self.parse()['htmlSha256'],self.parse(self.ad)['htmlSha256'])
 def test_generic_fixed_container_remains_bound(self):
  self.assertNotEqual(self.parse('<div id="fixed_container_bottom">Original CTA</div>')['fingerprint'],self.parse('<div id="fixed_container_bottom">Changed CTA</div>')['fingerprint'])
 def test_generic_ad_box_remains_bound(self):
  self.assertNotEqual(self.parse('<div class="mv-ad-box">Original CTA</div>')['fingerprint'],self.parse('<div class="mv-ad-box">Changed CTA</div>')['fingerprint'])
 def test_protected_content_nested_in_verified_ad_rejected(self):
  for protected in ['<main>Answer</main>','<article>Answer</article>','<h1>Answer</h1>','<section id="reader-survey">2 responses</section>','<aside class="affiliate-card">Product</aside>','<span class="tested-badge">TESTED</span>','<script type="application/ld+json">{"dateModified":"2026-10-29"}</script>']:
   with self.subTest(protected=protected),self.assertRaises(ValueError):self.parse('<div class="mv-ad-box" data-slotid="content_btf">'+protected+'</div>')
 def test_unclosed_ad_rejected(self):
  with self.assertRaises(ValueError):self.parse('<div class="mv-ad-box" data-slotid="content_btf">Ad')
 def test_complete_capture_required_without_optin(self):
  for ending in ['[Truncated]','']:
   with self.assertRaisesRegex(ValueError,'Incomplete full-page'):a.parse(self.core.split('</main>')[0]+ending,{'path':'/guide'},'https://example.com','https://example.com')
 def test_unknown_hidden_blank_iframe_still_bound(self):
  self.assertNotEqual(self.parse()['fingerprint'],self.parse('<iframe src="about:blank" width="0" height="0"></iframe>')['fingerprint'])
 def test_fixed_container_requires_verified_children(self):
  core=self.core.replace('<body>','<body class="mv-loaded">').replace('</body>','<div id="fixed_container_bottom"><p>First-party CTA</p></div></body>')
  with self.assertRaisesRegex(ValueError,'Unverified child'):self.parse(body=core)
 def test_void_ad_tag_self_closing(self):self.assertEqual(self.parse()['fingerprint'],self.parse('<div class="mv-ad-box" data-slotid="content_btf"><img src="https://ads.example/ad.jpg"/></div>')['fingerprint'])
 def test_boolean_empty_attributes_without_optin(self):self.assertFalse(self.parse('<div class></div>',route={'path':'/guide'})['failures'])
 def test_fake_closures_in_unclosed_comment_or_script_rejected(self):
  for opener in ['<!--','<script>']:
   with self.assertRaisesRegex(ValueError,'Incomplete full-page'):self.parse(body=self.core.replace('</main></body></html>',opener+'</body></html>'))

 def test_observed_tracking_frames_require_hidden_exact_identity(self):
  html='<iframe width="0" height="0" style="display:none;" src="https://ads.pubmatic.com/AdServer/js/user_sync.html?random=one"></iframe>';body=self.core.replace('<body>','<body class="mv-loaded">')
  self.assertEqual(self.parse(body=body)['fingerprint'],self.parse(html,body=body)['fingerprint'])
  self.assertNotEqual(self.parse(body=body)['fingerprint'],self.parse(html.replace('width="0"','width="300"').replace('height="0"','height="250"').replace('display:none;','display:block;'),body=body)['fingerprint'])
  self.assertNotEqual(self.parse(body=body)['fingerprint'],self.parse(html.replace('/AdServer/js/user_sync.html','/editorial.html'),body=body)['fingerprint'])
  self.assertNotEqual(self.parse()['fingerprint'],self.parse(html)['fingerprint'])
 def test_tracking_frame_visible_style_overrides_remain_bound(self):
  body=self.core.replace('<body>','<body class="mv-loaded">')
  for style in ['display:block;width:640px;height:480px','display:none;display:block;width:640px;height:480px']:
   html='<iframe width="0" height="0" style="'+style+'" src="https://ads.pubmatic.com/AdServer/js/user_sync.html"></iframe>'
   self.assertNotEqual(self.parse(body=body)['fingerprint'],self.parse(html,body=body)['fingerprint'])
 def test_percent_encoded_preview_origin_normalized(self):
  one=self.core.replace('{ad}','<iframe src="https://app.grow.me/iframe-login?callback=http%3A%2F%2Flocalhost%3A3000%2Fguide"></iframe>');two=one.replace('http%3A%2F%2Flocalhost%3A3000','https%3A%2F%2Fexample.com')
  a1=a.parse(one,self.route,'http://localhost:3000','https://example.com');a2=a.parse(two,self.route,'https://example.com','https://example.com');self.assertEqual(a1['fingerprint'],a2['fingerprint'])
  self.assertNotEqual(a1['fingerprint'],a.parse(two.replace('%2Fguide','%2Fdifferent'),self.route,'https://example.com','https://example.com')['fingerprint'])
 def test_safeframe_hidden_exact_identity_only(self):
  body=self.core.replace('<body>','<body class="mv-loaded">');frame='<iframe src="https://'+('a'*32)+'.safeframe.googlesyndication.com/safeframe/1-0-45/html/container.html" style="display:none"></iframe>'
  self.assertEqual(self.parse(body=body)['fingerprint'],self.parse(frame,body=body)['fingerprint'])
  for changed in [frame.replace('display:none','display:block'),frame.replace('display:none','display:none;display:block'),frame.replace('/html/container.html','/editorial.html'),frame.replace('.googlesyndication.com','.example.com')]:self.assertNotEqual(self.parse(body=body)['fingerprint'],self.parse(changed,body=body)['fingerprint'])
 def test_confiant_holder_only_vendor_root_and_noneditorial_children(self):
  body=self.core.replace('<body>','<body class="mv-loaded">');empty=body.replace('</body>','<div id="confiant_tag_holder" style="display:none"><script>vendor code</script></div></body>');self.assertEqual(self.parse(body=body)['fingerprint'],self.parse(body=empty)['fingerprint'])
  for content in ['<p>CTA</p>','<section id="reader-survey">2 responses</section>','<script type="application/ld+json">{}</script>','Unverified text']:
   with self.assertRaises(ValueError):self.parse(body=empty.replace('<script>vendor code</script>',content))
  self.assertNotEqual(self.parse(body=body)['fingerprint'],self.parse('<div id="confiant_tag_holder" style="display:none"></div>',body=body)['fingerprint'])
 def test_confiant_frame_identity_and_hidden_body_root_required(self):
  body=self.core.replace('<body>','<body class="mv-loaded">');frame='<iframe name="cnftComm" style="display:none;width:0px;height:0px"></iframe>';atroot=body.replace('</body>',frame+'</body>');self.assertEqual(self.parse(body=body)['fingerprint'],self.parse(body=atroot)['fingerprint'])
  self.assertNotEqual(self.parse(body=body)['fingerprint'],self.parse(frame,body=body)['fingerprint'])
  for change in [atroot.replace('display:none','display:block'),atroot.replace('name="cnftComm"','name="generic"'),atroot.replace('name="cnftComm"','name="cnftComm" src="/first-party"')]:self.assertNotEqual(self.parse(body=body)['fingerprint'],self.parse(body=change)['fingerprint'])
 def test_confiant_unknown_frame_and_unclosed_holder_rejected(self):
  body=self.core.replace('<body>','<body class="mv-loaded">')
  for holder in ['<div id="confiant_tag_holder" style="display:none"><iframe src="/firstparty" style="display:none"></iframe></div>','<div id="confiant_tag_holder" style="display:none">']:
   with self.assertRaises(ValueError):self.parse(body=body.replace('</body>',holder+'</body>'))
 def test_encoded_origin_prefix_lookalike_not_normalized(self):
  self.assertNotEqual(a.normalize('http%3A%2F%2Flocalhost%3A3000.evil%2Fguide','http://localhost:3000','https://example.com'),'https%3A%2F%2Fexample.com.evil%2Fguide')
if __name__=='__main__': unittest.main()
