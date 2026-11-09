"""Synthetic vendor coverage fixtures; no real company research or editorial PASS."""
import copy
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import datetime as dt
from unittest.mock import patch
from types import SimpleNamespace


def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m


v=load('vendor_test',Path(__file__).with_name('vendor-research.py'))
r=load('vendor_test_renderer',Path(__file__).with_name('rendered-audit.py'))


class Tests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name).resolve();self.clock=dt.datetime(2026,11,8,21,tzinfo=dt.timezone.utc)
        self.put('.claude/tools/rendered-audit.py',Path(__file__).with_name('rendered-audit.py').read_text())
        self.intake={'kind':'vendor-addition-intake-v1','canonicalBase':'https://fixture.example','jobId':'synthetic-job','candidates':[{'id':'synthetic-vendor','target':'/comparisons/tools','roundupSlug':'tools','vendor':{'domain':'vendor.example','name':'Synthetic Vendor'}}]}
        self.intake_path=self.put('reports/intake.json',self.intake)

    def put(self,name,value):
        p=self.root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(value if isinstance(value,str) else json.dumps(value));return p

    def snapshot(self,table=None,route='/comparisons/tools',base='https://fixture.example',age=0):
        table=table or '<table><tr><td><a href="https://vendor.example/">Synthetic Vendor</a></td><td>Existing synthetic description</td></tr></table>'
        html='<html><head><title>Synthetic guide</title><link rel="canonical" href="'+base+route+'"><meta name="robots" content="index,follow"><script type="application/ld+json">'+json.dumps({'@type':'WebPage','url':base+route})+'</script></head><body><main><h1>Synthetic guide</h1><p>'+('Synthetic ordinary reader content for software validation only. '*12)+'</p>'+table+'</main></body></html>'
        row=r.parse(html,{'path':route},base,base);html_path=self.put('reports/page-'+str(len(list((self.root/'reports').glob('*.html'))))+'.html',html)
        row['htmlFile']=str(html_path);row['htmlSha256']=v.sha(html.encode())
        snap={'manifest':{'author':'synthetic-writer','canonicalBase':base,'routes':[{'path':route}]},'routes':[row],'baseUrl':base,'capturedAt':(self.clock-dt.timedelta(hours=age)).isoformat()}
        snap['snapshotSha256']=r.digest(snap);return self.put('reports/snapshot-'+str(len(list((self.root/'reports').glob('snapshot*'))))+'.json',snap)

    def plan(self,snapshot=None,aliases=None):
        self.intake_path.write_text(json.dumps(self.intake));proof=v.plan(self.root,self.intake_path,self.root/'reports/plan','synthetic-run',[snapshot or self.snapshot()],aliases=aliases,clock=self.clock)
        return v.read(v.artifact(self.root,proof)),v.artifact(self.root,proof)

    def test_existing_vendor_avoids_new_company_pricing_research_but_is_not_a_pass(self):
        plan,path=self.plan();self.assertEqual(plan['counts']['none-covered'],1);self.assertEqual(plan['candidates'][0]['id'],'synthetic-vendor')
        self.assertNotIn('verdict',plan);self.assertNotIn('editorialPass',plan);v.validate(self.root,path)

    def test_footer_mentions_and_non_first_columns_never_prove_coverage(self):
        for body in ['<footer><a href="https://vendor.example">Synthetic Vendor</a></footer>','<table><tr><td>Other Vendor</td><td><a href="https://vendor.example">Mention</a></td></tr></table>','<table hidden><tr><td><a href="https://vendor.example">Synthetic Vendor</a></td></tr></table>','<table class="hidden"><tr><td><a href="https://vendor.example">Synthetic Vendor</a></td></tr></table>']:
            self.assertFalse(v.linked_vendor('<main>'+body+'</main>','vendor.example'))

    def test_new_product_version_news_or_refresh_needs_actual_new_claim_research(self):
        for field in v.CHANGE_FIELDS:
            candidate=copy.deepcopy(self.intake['candidates'][0]);candidate[field]='synthetic new signal'
            self.assertTrue(v.changed(candidate,'vendor-addition'))
        self.intake['candidates'][0]['newProduct']='Synthetic second product';plan,_=self.plan();self.assertEqual(plan['counts']['none-covered'],0);self.assertEqual(plan['counts']['changed-claims-only'],1)
        self.assertTrue(v.changed({'vendor':{'pricing_update':'New synthetic price evidence'}},'vendor-addition'))

    def test_unknown_intent_is_not_suppressed_because_the_company_is_known(self):
        self.intake['kind']='synthetic-news-intake';plan,_=self.plan();self.assertEqual(plan['counts']['changed-claims-only'],1)

    def test_shared_host_is_not_the_identity_of_every_product(self):
        self.intake['candidates'][0]['vendor']['domain']='github.com';snapshot=self.snapshot('<table><tr><td><a href="https://github.com/other/project">Other Product</a></td></tr></table>')
        plan,_=self.plan(snapshot);self.assertEqual(plan['counts']['none-covered'],0)

    def test_other_target_does_not_cover_the_requested_roundup(self):
        plan,_=self.plan(self.snapshot(route='/comparisons/other'));self.assertEqual(plan['counts']['none-covered'],0)

    def test_another_fleet_site_cannot_supply_coverage(self):
        with self.assertRaisesRegex(ValueError,'another site'):self.plan(self.snapshot(base='https://other.example'))

    def test_old_capture_must_be_refreshed_on_our_site(self):
        with self.assertRaisesRegex(ValueError,'fresh own-site capture'):self.plan(self.snapshot(age=12))

    def test_original_candidate_ids_are_preserved_even_when_two_inputs_resolve_to_one_vendor(self):
        self.intake['candidates'].append({**copy.deepcopy(self.intake['candidates'][0]),'id':'synthetic-second-original-id'})
        plan,path=self.plan();self.assertEqual(plan['counts']['none-covered'],2);self.assertEqual({r['id'] for r in plan['candidates']},{'synthetic-vendor','synthetic-second-original-id'});v.validate(self.root,path)

    def test_missing_or_forged_coverage_cannot_be_promoted_to_a_skip(self):
        plan,path=self.plan(self.snapshot('<p>No vendor table exists in this synthetic fixture.</p>'))
        plan['candidates'][0].update(research='none-covered',coveredSnapshot=v.ref(self.root,self.root/'reports/snapshot-0.json'))
        plan['counts'].update(normal=0,**{'none-covered':1});path.write_text(json.dumps(plan))
        with self.assertRaisesRegex(ValueError,'first-column'):v.validate(self.root,path)

    def test_stale_alias_refreshes_identity_instead_of_recrawling_pricing(self):
        alias={'canonicalDomain':'renamed.example','fresh':False,'evidence':[]}
        plan,_=self.plan(aliases={('tools','vendor.example'):alias});self.assertEqual(plan['counts']['identity-only'],1)

    def test_unlinked_name_needs_the_existing_site_specific_policy_proof(self):
        self.assertFalse(v.linked_vendor('<main><table><tr><td>Synthetic Vendor</td></tr></table></main>','vendor.example'))

    def test_counts_and_candidate_accounting_cannot_reset(self):
        plan,path=self.plan();plan['counts']['none-covered']=0;path.write_text(json.dumps(plan))
        with self.assertRaisesRegex(ValueError,'counts changed'):v.validate(self.root,path)

    def test_internal_dependencies_include_the_complete_current_capture(self):
        _,path=self.plan();paths=v.sources(self.root,path)['paths'];self.assertIn('reports/intake.json',paths);self.assertTrue(any(x.endswith('.html') for x in paths))

    def test_compact_work_packet_keeps_covered_ids_without_reloading_all_research(self):
        _,path=self.plan();packet=v.queue(self.root,path)
        self.assertFalse(packet['researchQueue']);self.assertEqual(len(packet['coveredForIndependentReview']),1)
        self.assertNotIn('identityEvidence',packet['coveredForIndependentReview'][0]);self.assertEqual(v.queue(self.root,path,'synthetic-vendor')['research'],'none-covered')

    def archive(self,decision='covered',verdict='PASS',corrupt=False,checked='2026-11-08'):
        files={}
        def add(name,value):
            raw=value.encode() if isinstance(value,str) else json.dumps(value).encode();files[name]=raw
            return {'path':name,'sha256':v.sha(raw)}
        capture=add('reports/vertical-synthetic/raw.html','Synthetic primary identity capture only; never real vendor evidence.')
        identity=add('reports/vertical-synthetic/identity.json',{'syntheticFixtureOnly':True,'candidateId':'synthetic-vendor','roundupSlug':'tools','poolDomain':'vendor.example','canonicalDomain':'renamed.example','checkedAt':checked,'facts':{'pricing':'Synthetic old value is not a current price claim'},'sourceCaptures':[{'url':'https://vendor.example','file':capture['path'],'sha256':capture['sha256']}]})
        intake=copy.deepcopy(self.intake);intake['pool']={'sha256':v.sha(b'synthetic-pool')};intake_ref=add('reports/vertical-synthetic/intake.json',intake)
        decisions={'jobId':'synthetic-job','candidates':[{'id':'synthetic-vendor','decision':decision,'canonicalDomain':'renamed.example','evidence':[identity]}]};decisions_ref=add('reports/vertical-synthetic/decisions.json',decisions)
        chart={'author':'synthetic-author','syntheticFixtureOnly':True};chart_ref=add('reports/vertical-synthetic/chart.json',chart)
        review={'syntheticFixtureOnly':True,'jobId':'synthetic-job','reviewer':'synthetic-independent','verdict':verdict,'manifestSha256':v.digest(chart),'verticalDecisionsSha256':decisions_ref['sha256'],'verticalPoolSha256':intake['pool']['sha256']};review_ref=add('reports/vertical-synthetic/review.json',review)
        add('reports/vertical-synthetic/completion.json',{'kind':'vertical-completion-v1','jobId':'synthetic-job','intake':intake_ref,'decisions':decisions_ref,'chart':chart_ref,'chartReview':review_ref})
        if corrupt:files[capture['path']]=b'Changed synthetic source must not retain its old identity hash'
        def git(root,*args):
            if args[0]=='ls-tree':return '\n'.join(files).encode()
            if args[0]=='show':return files[args[1].split(':',1)[1]]
            raise AssertionError('No external source call is permitted in this synthetic archive fixture')
        with patch.object(v,'git',side_effect=git):return v.history_aliases(self.root,self.root/'reports/history-fixture',revision='a'*40,clock=self.clock)

    def test_real_review_binding_can_reuse_identity_without_reusing_old_prices(self):
        aliases=self.archive();alias=aliases[('tools','vendor.example')];self.assertTrue(alias['fresh']);self.assertNotIn('facts',alias)
        snap=self.snapshot('<table><tr><td><a href="https://renamed.example">Synthetic Renamed Vendor</a></td></tr></table>')
        plan,path=self.plan(snap,aliases);self.assertEqual(plan['counts']['none-covered'],1);v.validate(self.root,path)

    def test_later_intake_keeps_its_id_without_relabeling_the_prior_identity_review(self):
        aliases=self.archive();self.intake['candidates'][0]['id']='synthetic-new-original-id'
        snap=self.snapshot('<table><tr><td><a href="https://renamed.example">Synthetic Renamed Vendor</a></td></tr></table>')
        plan,path=self.plan(snap,aliases);self.assertEqual(plan['candidates'][0]['id'],'synthetic-new-original-id');v.validate(self.root,path)

    def test_a_prior_cut_cannot_become_cached_coverage(self):
        self.assertFalse(self.archive(decision='cut'))

    def test_a_failed_prior_review_cannot_supply_an_alias(self):
        self.assertFalse(self.archive(verdict='FAIL'))

    def test_changed_primary_identity_capture_is_not_reused(self):
        self.assertFalse(self.archive(corrupt=True))

    def test_high_risk_site_keeps_the_shorter_identity_window(self):
        self.put('.claude/content-review-policy.json',{'minimumProfile':'high'})
        aliases=self.archive(checked='2026-11-06');self.assertFalse(aliases[('tools','vendor.example')]['fresh'])

    def test_unavailable_identity_dependency_keeps_normal_research_without_a_new_gate(self):
        native=SimpleNamespace(source_identities=lambda *args:(_ for _ in ()).throw(ValueError('Synthetic missing dependency')))
        proof=v.vertical_prepare(self.root,self.intake_path,self.root/'reports/fallback','synthetic-run',native)
        value=v.read(v.artifact(self.root,proof));self.assertEqual(value['counts']['normal'],1);self.assertEqual(value['counts']['none-covered'],0)

    @unittest.skipUnless(Path(__file__).with_name('vertical-run.local_test.py').is_file(),'No Layer3 native Vertical hook on this fleet site')
    def test_native_prepare_supplies_the_plan_without_filtering_original_intake(self):
        fixture=load('vendor_native_fixtures',Path(__file__).with_name('vertical-run.local_test.py'));f=fixture.Tests();f.setUp()
        try:
            tool=f.root/'.claude/tools/vendor-research.py';tool.parent.mkdir(parents=True,exist_ok=True);tool.write_text('Synthetic helper placeholder, never executed.')
            pool=f.root/'pool.json';pool.write_text(json.dumps(f.pool));directory=f.root/'reports/native'
            def prepared(root,intake_path,directory,run_id,native):
                current=v.read(intake_path);self.assertEqual(current['candidates'],fixture.v.candidates(f.pool))
                path=directory/'synthetic-plan.json';v.save(path,{'counts':{'normal':len(current['candidates'])},'scope':'Synthetic allocation only, no approval.'});return v.ref(root,path)
            helper=SimpleNamespace(vertical_prepare=prepared)
            with patch.object(fixture.v,'load',side_effect=lambda name,path:helper if name=='vertical_vendor_research' else fixture.v):result=fixture.v.prepare(f.root,pool,directory,'synthetic-run')
            self.assertIn('vendorResearchPlan',result);self.assertEqual(result['candidates'],1)
            self.assertEqual((directory/'original-pool.json').read_bytes(),pool.read_bytes())
        finally:f.doCleanups()


if __name__=='__main__':unittest.main()
