import copy
import json
import tempfile
import importlib.util
import pathlib
import unittest
spec=importlib.util.spec_from_file_location('audit',pathlib.Path(__file__).with_name('rendered-audit.py'))
a=importlib.util.module_from_spec(spec); spec.loader.exec_module(a)
HTML='''<html><head><title>Model guide</title><link rel="canonical" href="https://example.com/guide"><meta name="robots" content="index,follow"><script type="application/ld+json">{"@type":"Article","datePublished":"2026-10-27","dateModified":"2026-10-27","url":"https://example.com/guide"}</script></head><body><main><h1>Model guide</h1><p>Updated Oct 27, 2026</p><p>'''+('Useful complete reader-facing content. '*12)+'''</p><a href="https://example.com/other">Related guide</a></main><script>build123</script></body></html>'''
class Tests(unittest.TestCase):
 def snapshot(self,html=HTML,class_spaces=False):
  m={'author':'writer','canonicalBase':'https://example.com','routes':[{'path':'/guide','expectedUpdatedDate':'2026-10-27'}]}
  if class_spaces:m['routes'][0]['normalizeClassTokenWhitespace']=True
  r=a.parse(html,m['routes'][0],'http://localhost:3000',m['canonicalBase'])
  s={'manifest':m,'routes':[r],'baseUrl':'https://example.com','capturedAt':'2026-10-27T18:00:00+00:00'}; s['snapshotSha256']=a.digest(s); return s
 def review(self,s):
  return {'reviewer':'independent','snapshotSha256':s['snapshotSha256'],'routes':[{'path':'/guide','fingerprint':s['routes'][0]['fingerprint'],'verdict':'PASS','checks':{k:{'status':'PASS','evidence':'Fixture evidence for negative-path testing only.'} for k in a.CHECKS}}]}
 def test_live_compare_accepts_only_generated_document_font_hash_drift(self):
  approved=self.snapshot(HTML.replace('<html>','<html class="__variable_482ce5">'))
  live=self.snapshot(HTML.replace('<html>','<html class="__variable_eb41fe">'))
  a.compare(approved,live,self.review(approved))
  self.assertNotEqual(approved['routes'][0]['fingerprint'],live['routes'][0]['fingerprint'])
  changed=self.snapshot(HTML.replace('<html>','<html class="__variable_eb41fe hidden">'))
  with self.assertRaises(ValueError):a.compare(approved,changed,self.review(approved))

 def test_build_font_identifiers_preserve_copy_and_visibility_checks(self):
  original={'text':'Exact actual reader copy','structure':[['html',{'class':'__variable_482ce5 __variable_d8ebd1'}],['p',{'class':'visible'}]]}
  current=copy.deepcopy(original);current['structure'][0][1]['class']='__variable_eb41fe __variable_f367f3'
  self.assertEqual(a.publication_semantic(original),a.publication_semantic(current))
  current['text']='Changed claim'
  self.assertNotEqual(a.publication_semantic(original),a.publication_semantic(current))
  current=copy.deepcopy(original);current['structure'][1][1]['class']='hidden'
  self.assertNotEqual(a.publication_semantic(original),a.publication_semantic(current))
  current=copy.deepcopy(original);current['structure'][1][1]['class']='__variable_abcdef'
  self.assertNotEqual(a.publication_semantic(original),a.publication_semantic(current))

 def test_capture_never_overwrites_a_reserved_output_or_contacts_the_server(self):
  from unittest.mock import patch
  with tempfile.TemporaryDirectory() as tmp:
   out=pathlib.Path(tmp)/'reserved.json';out.write_text('original immutable bytes')
   with patch.object(a.urllib.request,'urlopen',side_effect=AssertionError('Must fail before network')):
    with self.assertRaisesRegex(ValueError,'immutable'):a.capture(self.snapshot()['manifest'],'http://localhost:1',str(out))
   self.assertEqual(out.read_text(),'original immutable bytes')
 def test_valid(self):
  s=self.snapshot(); a.review_check(s,self.review(s))
 def test_framework_counter_only_is_ignored(self):
  base=self.snapshot()['routes'][0]['fingerprint']
  for value in ['32','33']:
   self.assertEqual(base,self.snapshot(HTML.replace('</head>','<meta name="next-head-count" content="'+value+'"></head>'))['routes'][0]['fingerprint'])
  for meta in ['<meta name="description" content="Changed">','<meta property="og:title" content="Changed">','<meta property="next-head-count" content="32">']:
   self.assertNotEqual(base,self.snapshot(HTML.replace('</head>',meta+'</head>'))['routes'][0]['fingerprint'])
 def test_only_empty_style_is_ignored(self):
  base=HTML.replace('</main>','<input type="number" value="10"></main>')
  fp=self.snapshot(base)['routes'][0]['fingerprint']
  for style in ['', '   ']:
   self.assertEqual(fp,self.snapshot(base.replace('value="10"','value="10" style="'+style+'"'))['routes'][0]['fingerprint'])
  for change in ['value="11"','value="10" style="display:none"','value="10" style="width:100px"','value="10" disabled']:
   self.assertNotEqual(fp,self.snapshot(base.replace('value="10"',change))['routes'][0]['fingerprint'])
 def test_class_ascii_token_spacing_not_a_page_change(self):
  base=HTML.replace('<main>','<main class="article comparison">')
  before=self.snapshot(base,class_spaces=True); approved=self.review(before)
  for value in [' article comparison ', 'article\tcomparison', '\narticle\r\ncomparison\f']:
   with self.subTest(value=value):
    captured=self.snapshot(base.replace('class="article comparison"','class="'+value+'"'),class_spaces=True)
    a.compare(before,captured,approved)
    self.assertNotEqual(before['routes'][0]['htmlSha256'],captured['routes'][0]['htmlSha256'])
 def test_class_tokens_order_duplicates_and_non_html_whitespace_remain_bound(self):
  base=HTML.replace('<main>','<main class="article comparison">'); before=self.snapshot(base,class_spaces=True)
  for value in ['article', 'article comparison hidden', 'comparison article', 'article article comparison', 'article\u00a0comparison', 'article\vcomparison']:
   with self.subTest(value=value),self.assertRaisesRegex(ValueError,'Rendered content differs'):
    a.compare(before,self.snapshot(base.replace('class="article comparison"','class="'+value+'"'),class_spaces=True),self.review(before))
 def test_class_spacing_never_normalizes_other_attributes(self):
  base=HTML.replace('<main>','<main class="article comparison" aria-label="Reader guide" style="width: 100px">'); before=self.snapshot(base,class_spaces=True)
  for old,new in [('aria-label="Reader guide"','aria-label="Reader  guide"'),('style="width: 100px"','style="width:  100px"'),('class="article comparison"','')]:
   with self.subTest(new=new),self.assertRaisesRegex(ValueError,'Rendered content differs'):
    a.compare(before,self.snapshot(base.replace(old,new),class_spaces=True),self.review(before))
 def test_class_spacing_requires_explicit_boolean_opt_in(self):
  base=HTML.replace('<main>','<main class="article comparison">')
  self.assertNotEqual(self.snapshot(base)['routes'][0]['fingerprint'],self.snapshot(base.replace('article comparison','article comparison '))['routes'][0]['fingerprint'])
  for flag in ['true',1,None]:
   manifest=self.snapshot(base)['manifest'];manifest['routes'][0]['normalizeClassTokenWhitespace']=flag
   with self.subTest(flag=flag),self.assertRaisesRegex(ValueError,'must be boolean'):a.validate_manifest(manifest)
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
 def shaving_school_date_failures(self,label='Last reviewed November 11, 2026',modified='2026-11-11'):
  # Exact ordinary-publication Hero structure, with its date also in Article JSON-LD.
  hero='<p class="meta">By <a href="/about/">Shaving School</a> · '+label+' · 6 min read</p>'
  html=HTML.replace('<p>Updated Oct 27, 2026</p>',hero).replace('"dateModified":"2026-10-27"','"dateModified":"'+modified+'"')
  return a.parse(html,{'path':'/guide','expectedUpdatedDate':'2026-11-11'},'https://example.com','https://example.com')['failures']
 def test_shaving_school_last_reviewed_hero_matches_schema(self):
  self.assertEqual(self.shaving_school_date_failures(),[])
 def test_last_reviewed_date_must_match_expected(self):
  self.assertIn('Visible updated date missing or inconsistent',self.shaving_school_date_failures('Last reviewed November 10, 2026'))
 def test_last_reviewed_date_still_requires_matching_schema(self):
  self.assertIn('Structured-data updated date mismatch',self.shaving_school_date_failures(modified='2026-11-10'))
 def test_publication_or_missing_label_cannot_replace_last_reviewed(self):
  for label in ['November 11, 2026','Published November 11, 2026','First reviewed November 11, 2026']:
   with self.subTest(label=label):
    self.assertIn('Visible updated date missing or inconsistent',self.shaving_school_date_failures(label))
 def test_inline_historical_last_reviewed_is_not_metadata(self):
  self.assertIn('Visible updated date missing or inconsistent',self.shaving_school_date_failures('The product was last reviewed November 11, 2026'))
 def test_updated_label_remains_authoritative_when_review_date_also_exists(self):
  self.assertIn('Visible updated date missing or inconsistent',self.shaving_school_date_failures('Updated November 10, 2026 · Last reviewed November 11, 2026'))
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
 def test_inline_source_policy_last_updated_is_not_article_date(self):
  s=self.snapshot(HTML.replace('</main>','<p>Its privacy policy, last updated August 26, 2026, permits account controls.</p></main>')); a.valid_snapshot(s)
 def test_standalone_last_updated_label_still_rejects_stale_date(self):
  s=self.snapshot(HTML.replace('Updated Oct 27, 2026','Last updated Oct 26, 2026'))
  with self.assertRaisesRegex(ValueError,'Visible updated'): a.valid_snapshot(s)
 def test_split_updated_label_keeps_date(self):
  s=self.snapshot(HTML.replace('Updated Oct 27, 2026','<span>Updated </span><time>Oct 27, 2026</time>')); a.valid_snapshot(s)
 def test_alias_requires_audited_self_canonical_target(self):
  m={'author':'writer','canonicalBase':'https://example.com','routes':[{'path':'/old','canonicalPath':'/guide'},{'path':'/guide'}]}; a.validate_manifest(m)
  r=a.parse(HTML,{'path':'/old','canonicalPath':'/guide','expectedUpdatedDate':'2026-10-27'},'https://example.com','https://example.com');self.assertEqual(r['failures'],[])
  m['routes'][1]['canonicalPath']='/old'
  with self.assertRaisesRegex(ValueError,'cycles'):a.validate_manifest(m)
  m['routes']=m['routes'][:1]
  with self.assertRaisesRegex(ValueError,'audited'):a.validate_manifest(m)
 def test_mixed_legacy_ledger_preserves_records_clock_and_dedup(self):
  with tempfile.TemporaryDirectory(dir=pathlib.Path.cwd()) as temp:
   folder=pathlib.Path(temp); growth=folder/'growth.json'; ledger=folder/'ledger.jsonl'; rel=str(growth.relative_to(pathlib.Path.cwd()))
   growth.write_text(json.dumps({'baseline':{'status':'available'}}))
   legacy={'originRoutine':'link-audit','url':'https://example.com/legacy','status':'reviewed'}
   old_same_path={'path':'/guide','originRoutine':'legacy-without-contribution','firstVerifiedLiveAt':'2026-10-01T01:00:00+00:00'}
   previous={'path':'/guide','contributionId':rel,'firstVerifiedLiveAt':'2026-10-26T19:00:00+00:00','snapshotSha256':'prior-render'}
   original=''.join(json.dumps(row)+'\n' for row in [legacy,old_same_path,previous]); ledger.write_text(original)
   s=self.snapshot(); s['manifest']['routes'][0]['growthFile']=rel; del s['snapshotSha256']; s['snapshotSha256']=a.digest(s)
   host={'commit':'a'*40,'status':'live','verifiedAt':s['capturedAt'],'evidenceUrl':'https://example.com/deployment-proof'}
   self.assertEqual(a.record(s,s,self.review(s),'a'*40,host,ledger),1)
   self.assertTrue(ledger.read_text().startswith(original)); rows=[json.loads(line) for line in ledger.read_text().splitlines()]
   self.assertEqual(rows[:3],[legacy,old_same_path,previous]); self.assertEqual(len(rows),4)
   self.assertEqual(rows[-1]['firstVerifiedLiveAt'],previous['firstVerifiedLiveAt']); self.assertEqual(rows[-1]['windows']['days1to28'],{'start':'2026-10-27','end':'2026-11-23'})
   saved=ledger.read_bytes(); self.assertEqual(a.record(s,s,self.review(s),'a'*40,host,ledger),0); self.assertEqual(ledger.read_bytes(),saved)
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
  for protected in ['<main>Answer</main>','<article>Answer</article>','<h1>Answer</h1>','<section id="reader-survey">2 responses</section>','<aside class="affiliate-card">Product</aside>','<span class="tested-badge">TESTED</span>','<span class="byline">Author</span>','<script type="application/ld+json">{"dateModified":"2026-10-29"}</script>']:
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
 def test_check_recapture_falls_back_to_capture_local_on_dead_loopback(self):
  import sys, tempfile
  from pathlib import Path
  from unittest.mock import patch
  with tempfile.TemporaryDirectory() as td:
   tdp=Path(td);snap_path=tdp/'snap.json';rev_path=tdp/'rev.json'
   route_res=self.parse()
   route_res['htmlFile']='';route_res['textFile']=''
   manifest={'canonicalBase':'https://example.com','author':'writer-1','routes':[self.route]}
   snap={'capturedAt':'2026-11-12T00:00:00Z','baseUrl':'http://127.0.0.1:48435','domDir':None,'manifest':manifest,'routes':[route_res]}
   snap['snapshotSha256']=a.digest(snap)
   checks={k:{'status':'PASS','evidence':'Verified synthetic fixture check passes cleanly.'} for k in a.CHECKS}
   rev={'reviewer':'auditor-1','snapshotSha256':snap['snapshotSha256'],'routes':[{'path':'/guide','fingerprint':route_res['fingerprint'],'verdict':'PASS','checks':checks}]}
   a.save(str(snap_path),snap);a.save(str(rev_path),rev)
   fresh=dict(snap,baseUrl='http://127.0.0.1:51234')
   fresh.pop('snapshotSha256',None);fresh['snapshotSha256']=a.digest(fresh)
   with patch.object(a,'capture',side_effect=ValueError('dead prior container port')), \
        patch.object(a,'capture_local',return_value=fresh) as cap_local, \
        patch.object(Path,'is_file',autospec=True,side_effect=lambda p: False if p.name=='review-archive.py' else p.exists()), \
        patch.object(sys,'argv',['rendered-audit.py','check','--snapshot',str(snap_path),'--review',str(rev_path),'--recapture']):
    a.main()
    self.assertEqual(cap_local.call_count,1)
 def test_valid_snapshot_resolves_repo_root_and_durable_evidence_cache(self):
  import hashlib, os, tempfile
  from pathlib import Path
  from unittest.mock import patch
  with tempfile.TemporaryDirectory() as td, tempfile.TemporaryDirectory() as other_cwd:
   fake_root=Path(td);fake_tool=fake_root/'.claude/tools/rendered-audit.py'
   fake_tool.parent.mkdir(parents=True);fake_tool.write_text('# stub')
   html_bytes=self.core.replace('{ad}','').encode()
   html_sha=hashlib.sha256(html_bytes).hexdigest()
   rel_html='reports/mindmap-pass/snap/guide.html'
   (fake_root/rel_html).parent.mkdir(parents=True);(fake_root/rel_html).write_bytes(html_bytes)
   route_res=self.parse()
   route_res['htmlFile']=rel_html;route_res['htmlSha256']=html_sha;route_res['textFile']=''
   snap={'capturedAt':'2026-11-12T00:00:00Z','baseUrl':'https://example.com','manifest':{'canonicalBase':'https://example.com','author':'writer-1','routes':[self.route]},'routes':[route_res]}
   snap['snapshotSha256']=a.digest(snap)
   prev=os.getcwd()
   try:
    os.chdir(other_cwd)
    with patch.object(a,'__file__',str(fake_tool)):
     a.valid_snapshot(snap)
     (fake_root/rel_html).write_bytes(b'overwritten by later round')
     with self.assertRaisesRegex(ValueError,'Captured HTML changed'):a.valid_snapshot(snap)
     ev=fake_root/'reports/content-review-evidence'/(html_sha+'.html')
     ev.parent.mkdir(parents=True);ev.write_bytes(html_bytes)
     a.valid_snapshot(snap)
   finally:
    os.chdir(prev)
class VolatileRenderRegions(unittest.TestCase):
 RAIL='<section class="cr-card-section" aria-label="Latest related briefings" data-render-volatile="latest-briefings"><header class="cr-card-header"><h2 class="cr-card-title">Latest related briefings</h2></header><div class="cr-card-grid"><a class="cr-card" href="/briefing/{slug}"><span class="cr-card-eyebrow">POLICY</span><h3 class="cr-card-headline">{title}</h3><div class="cr-card-meta-rows"><span><strong>Nov 13, 2026</strong></span><br></div><span class="cr-card-cta">Read analysis</span></a></div><p class="cr-card-footer"><a href="/briefing"><strong>Browse all daily briefings</strong></a></p></section>'
 def setUp(self):
  self.route={'path':'/guide','volatileRenderRegions':['latest-briefings']}
  self.core=HTML.replace('</main>','{rail}<p>Closing reviewed paragraph</p></main>')
 def rail(self,slug='ai-bill-20261113-1',title='AI bill advances'):return self.RAIL.replace('{slug}',slug).replace('{title}',title)
 def parse(self,rail='',route=None,core=None):return a.parse((core or self.core).replace('{rail}',rail),route or self.route,'http://localhost:3000','https://example.com')
 def snap(self,rail='',route=None):
  route=route or self.route;m={'author':'writer','canonicalBase':'https://example.com','routes':[dict(route)]}
  s={'manifest':m,'routes':[self.parse(rail,route)],'baseUrl':'https://example.com','capturedAt':'2026-11-13T18:00:00+00:00'};s['snapshotSha256']=a.digest(s);return s
 def test_rolling_rail_absent_or_rotated_matches_only_with_opt_in(self):
  fp=self.parse()['fingerprint']
  self.assertEqual(fp,self.parse(self.rail())['fingerprint'])
  self.assertEqual(fp,self.parse(self.rail('eu-act-20261114-2','EU act delayed'))['fingerprint'])
  self.assertEqual(self.parse(self.rail())['volatileRegions'],[{'name':'latest-briefings','text':'Latest related briefings POLICY AI bill advances Nov 13, 2026 Read analysis Browse all daily briefings','links':['/briefing/ai-bill-20261113-1','/briefing']}])
  plain={'path':'/guide'}
  self.assertNotEqual(self.parse(route=plain)['fingerprint'],self.parse(self.rail(),route=plain)['fingerprint'])
  self.assertNotIn('volatileRegions',self.parse(self.rail(),route=plain))
 def test_marker_attribute_alone_never_changes_existing_fingerprints(self):
  plain={'path':'/guide'};unmarked=self.rail().replace(' data-render-volatile="latest-briefings"','')
  self.assertEqual(self.parse(unmarked,route=plain)['fingerprint'],self.parse(self.rail(),route=plain)['fingerprint'])
  self.assertNotEqual(self.parse()['fingerprint'],self.parse(unmarked)['fingerprint'])
 def test_reviewed_content_outside_region_remains_bound(self):
  for before,after in [('Closing reviewed paragraph','Changed claim'),('Model guide</h1>','Other guide</h1>'),('https://example.com/other','https://example.com/changed')]:
   self.assertNotEqual(self.parse(self.rail())['fingerprint'],self.parse(self.rail(),core=self.core.replace(before,after))['fingerprint'])
 def test_live_compare_accepts_rail_drift_and_binds_opt_in_to_review(self):
  approved=self.snap();live=self.snap(self.rail())
  review={'reviewer':'independent','snapshotSha256':approved['snapshotSha256'],'routes':[{'path':'/guide','fingerprint':approved['routes'][0]['fingerprint'],'verdict':'PASS','checks':{k:{'status':'PASS','evidence':'Fixture evidence for negative-path testing only.'} for k in a.CHECKS}}]}
  a.compare(approved,live,review)
  with self.assertRaisesRegex(ValueError,'manifest differs'):a.compare(approved,self.snap(self.rail(),{'path':'/guide'}),review)
 def test_manifest_accepts_only_known_region_lists(self):
  base={'author':'a','canonicalBase':'https://example.com'}
  a.validate_manifest({**base,'routes':[{'path':'/guide','volatileRenderRegions':['latest-briefings']}]})
  for value in ['latest-briefings',[],['reader-survey'],['latest-briefings','latest-briefings'],[['latest-briefings']],None]:
   with self.subTest(value=value),self.assertRaisesRegex(ValueError,'volatile render region'):a.validate_manifest({**base,'routes':[{'path':'/guide','volatileRenderRegions':value}]})
 def test_unlisted_region_name_and_non_section_root_stay_bound_or_fail(self):
  other=self.rail().replace('"latest-briefings"','"sidebar"')
  self.assertNotEqual(self.parse()['fingerprint'],self.parse(other)['fingerprint'])
  with self.assertRaisesRegex(ValueError,'root must be a <section>'):self.parse(self.rail().replace('<section ','<div ',1).replace('</section>','</div>'))
 def test_protected_unsupported_or_foreign_link_content_rejected(self):
  for inner in ['<h1>Answer</h1>','<main>Answer</main>','<article>Answer</article>','<script type="application/ld+json">{"dateModified":"2026-11-14"}</script>','<img src="/x.png">','<iframe src="https://ads.example"></iframe>','<form action="/x"></form>','<span class="tested-badge">TESTED</span>','<span class="byline">Author</span>','<div class="affiliate-card">Deal</div>','<a href="https://partner.example/deal">Deal</a>','<a href="/explainers/other">Other</a>','<a href="/briefing/../admin">x</a>','<a>no link</a>']:
   with self.subTest(inner=inner),self.assertRaises(ValueError):self.parse(self.rail().replace('</section>',inner+'</section>'))
 def test_unterminated_region_rejected(self):
  # Following page text is swallowed into the open region; either guard blocks.
  with self.assertRaisesRegex(ValueError,'Unterminated volatile render region|Visible text outside a link'):self.parse(self.rail().replace('</section>',''))
  with self.assertRaisesRegex(ValueError,'Unterminated volatile render region'):a.parse(HTML.replace('</main>',self.rail().replace('</section>','')+'</main>'),self.route,'http://localhost:3000','https://example.com')
 def test_forbidden_and_label_text_inside_region_fails_capture(self):
  route={**self.route,'forbiddenText':['Grok']}
  self.assertEqual(self.parse(self.rail(),route)['failures'],[])
  self.assertIn('Forbidden text in volatile region latest-briefings: Grok',self.parse(self.rail(title='Grok 5 ships'),route)['failures'])
  for title,label in [('Tested and reviewed by our lab','testing label'),('Best VPN (Tested 2026)','testing label'),('Deals via affiliate links','affiliate disclosure'),('Sponsored: AI pick','affiliate disclosure'),('Written by Jane Doe','byline')]:
   with self.subTest(title=title):self.assertIn('Unreviewed '+label+' in volatile region latest-briefings',self.parse(self.rail(title=title))['failures'])
  self.assertEqual(self.parse(self.rail(title='Lawmakers tested AI rules in court'))['failures'],[])
 def test_one_region_per_name_per_route(self):
  with self.assertRaisesRegex(ValueError,'Duplicate volatile render region'):self.parse(self.rail()+self.rail('other-20261113-2'))
 def test_visible_text_only_in_links_or_region_heading(self):
  self.parse(self.rail().replace('</h2>','</h2><span class="cr-card-meta">Updated daily</span>'))
  for extra in ['<p class="cr-card-intro">Unreviewed claim</p>','<div>Loose text</div>','<span>Stray</span>','Bare text']:
   with self.subTest(extra=extra),self.assertRaisesRegex(ValueError,'Visible text outside a link'):self.parse(self.rail().replace('</header>','</header>'+extra))
  with self.assertRaisesRegex(ValueError,'Visible text outside a link'):self.parse(self.rail().replace('<h2 class="cr-card-title">','<h2 class="cr-card-title"><div>x</div>'))


class RelatedCardsLiveCompareTests(unittest.TestCase):
 APPROVED_REL = (
  '<div class="Pillar_pillar__related-wrap__qbcVo">'
  '<div class="RelatedResources_related__t0w8B">'
  '<h3 class="RelatedResources_related__title__eq30W">Related Resources</h3>'
  '<div class="RelatedResources_related__grid__Pt53_">'
  '<a class="RelatedResources_related__card__uJcZ0" href="/guides/email-tools">'
  '<span class="RelatedResources_related__card-category__WY8_n">Guide</span>'
  '<h4 class="RelatedResources_related__card-title__YuLza">Best Email Tools</h4>'
  '<p class="RelatedResources_related__card-desc__SsbMI">Reviewed comparison of email tools.</p>'
  '</a></div></div></div>'
 )
 LIVE_REL = (
  '<div class="Pillar_pillar__related-wrap__qbcVo">'
  '<div class="RelatedResources_related__t0w8B">'
  '<h3 class="RelatedResources_related__title__eq30W">Related Resources</h3>'
  '<div class="RelatedResources_related__grid__Pt53_">'
  '<a class="RelatedResources_related__card__uJcZ0" href="/guides/email-tools">'
  '<span class="RelatedResources_related__card-category__WY8_n">Guide</span>'
  '<h4 class="RelatedResources_related__card-title__YuLza">Best Email Tools</h4>'
  '<p class="RelatedResources_related__card-desc__SsbMI">Reviewed comparison of email tools.</p>'
  '</a>'
  '<a class="RelatedResources_related__card__uJcZ0 RelatedResources_related__card--hidden__x1" href="/guides/how-ai-email-automation-works">'
  '<span class="RelatedResources_related__card-category__WY8_n">Guide</span>'
  '<h4 class="RelatedResources_related__card-title__YuLza">How AI Email Automation Works</h4>'
  '<p class="RelatedResources_related__card-desc__SsbMI">Concurrent routine sibling card.</p>'
  '</a></div>'
  '<button class="RelatedResources_related__more-btn__z9" type="button">See 1 more</button>'
  '</div></div>'
 )

 def _build_snap(self, td, name, html_str, route=None):
  import hashlib
  from pathlib import Path
  route = route or {'path': '/guide', 'forbiddenText': ['BannedVendor']}
  res = a.parse(html_str, route, 'https://example.com', 'https://example.com')
  html_path = Path(td) / f'{name}.html'
  html_path.write_text(html_str)
  res['htmlFile'] = str(html_path)
  res['htmlSha256'] = hashlib.sha256(html_str.encode()).hexdigest()
  res['textFile'] = ''
  snap = {
   'capturedAt': '2026-11-13T19:00:00+00:00',
   'baseUrl': 'https://example.com',
   'manifest': {'author': 'writer', 'canonicalBase': 'https://example.com', 'routes': [dict(route)]},
   'routes': [res],
  }
  snap['snapshotSha256'] = a.digest(snap)
  return snap

 def test_related_cards_addition_passes_live_compare_while_preserving_audit_fingerprints(self):
  import tempfile
  with tempfile.TemporaryDirectory() as td:
   approved_html = HTML.replace('</main>', '</main>' + self.APPROVED_REL)
   live_html = HTML.replace('</main>', '</main>' + self.LIVE_REL)
   approved = self._build_snap(td, 'approved', approved_html)
   live = self._build_snap(td, 'live', live_html)
   # Audit fingerprints remain 100% distinct (parse() is completely unchanged!)
   self.assertNotEqual(approved['routes'][0]['fingerprint'], live['routes'][0]['fingerprint'])
   review = {
    'reviewer': 'independent-auditor',
    'snapshotSha256': approved['snapshotSha256'],
    'routes': [{
     'path': '/guide',
     'fingerprint': approved['routes'][0]['fingerprint'],
     'verdict': 'PASS',
     'checks': {k: {'status': 'PASS', 'evidence': 'Verified full-page audit evidence.'} for k in a.CHECKS},
    }],
   }
   # Live compare succeeds because 100% of main editorial content, metadata, H1, and schema match!
   a.compare(approved, live, review)

   # Any 1-word edit in <main>, <h1>, <title>, or external/forbidden/loose text inside RelatedResources MUST fail!
   edited_main = self._build_snap(td, 'live_edit_main', live_html.replace('Model guide</h1>', 'Altered guide</h1>'))
   with self.assertRaisesRegex(ValueError, 'Rendered content differs'):
    a.compare(approved, edited_main, review)

   ext_link_rel = self.LIVE_REL.replace('href="/guides/how-ai-email-automation-works"', 'href="https://affiliate.example/deal"')
   live_ext = self._build_snap(td, 'live_ext', HTML.replace('</main>', '</main>' + ext_link_rel))
   with self.assertRaisesRegex(ValueError, 'Rendered content differs'):
    a.compare(approved, live_ext, review)

   loose_prose_rel = self.LIVE_REL.replace('</h3>', '</h3><p>Unreviewed prose paragraph outside link</p>')
   live_loose = self._build_snap(td, 'live_loose', HTML.replace('</main>', '</main>' + loose_prose_rel))
   with self.assertRaisesRegex(ValueError, 'Rendered content differs'):
    a.compare(approved, live_loose, review)

   banned_rel = self.LIVE_REL.replace('Concurrent routine sibling card.', 'Includes BannedVendor pitch.')
   live_banned = self._build_snap(td, 'live_banned', HTML.replace('</main>', '</main>' + banned_rel))
   with self.assertRaisesRegex(ValueError, 'Forbidden text: BannedVendor|Rendered content differs'):
    a.compare(approved, live_banned, review)

   tested_claim_rel = self.LIVE_REL.replace('Concurrent routine sibling card.', 'Tested and reviewed by our lab.')
   live_tested_claim = self._build_snap(td, 'live_tested_claim', HTML.replace('</main>', '</main>' + tested_claim_rel))
   with self.assertRaisesRegex(ValueError, 'Rendered content differs'):
    a.compare(approved, live_tested_claim, review)


if __name__=='__main__': unittest.main()
