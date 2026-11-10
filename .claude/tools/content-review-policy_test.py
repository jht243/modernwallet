"""Synthetic fixtures only. No fixture is real content, an audit or permission."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import threading
import types
import unittest
from unittest import mock


def load(name, filename):
    s=importlib.util.spec_from_file_location(name,Path(__file__).with_name(filename))
    m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m


p=load('budget','content-review-policy.py')
render=load('budget_fixture_render','rendered-audit.py')
HTML='<html><head><title>Model guide</title><link rel="canonical" href="https://example.com/guide"><meta name="robots" content="index,follow"><script type="application/ld+json">{"@type":"Article","datePublished":"2026-10-27","dateModified":"2026-10-27","url":"https://example.com/guide"}</script></head><body><main><h1>Model guide</h1><p>Updated Oct 27, 2026</p><p>'+('Useful complete reader-facing content. '*12)+'</p><a href="https://example.com/other">Related guide</a></main></body></html>'


class RenderFixtures:
    def snapshot(self,html=HTML):
        manifest={'author':'writer','canonicalBase':'https://example.com','routes':[{'path':'/guide','expectedUpdatedDate':'2026-10-27'}]}
        page=render.parse(html,manifest['routes'][0],'http://localhost:3000',manifest['canonicalBase'])
        snapshot={'manifest':manifest,'routes':[page],'baseUrl':'https://example.com','capturedAt':'2026-10-27T18:00:00+00:00'}
        snapshot['snapshotSha256']=render.digest(snapshot);return snapshot

    def review(self,snapshot):
        return {'reviewer':'independent','snapshotSha256':snapshot['snapshotSha256'],
                'routes':[{'path':'/guide','fingerprint':snapshot['routes'][0]['fingerprint'],'verdict':'PASS',
                           'checks':{k:{'status':'PASS','evidence':'Synthetic fixture evidence for negative-path testing only.'} for k in render.CHECKS}}]}


fixtures=types.SimpleNamespace(Tests=RenderFixtures,HTML=HTML)


class Tests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name).resolve();subprocess.run(['git','init','-q',str(self.root)],check=True)
        self.config={'version':p.VERSION,'siteId':'synthetic-fixture','defaultProfile':'standard','minimumProfile':'light','roundLimits':p.LIMITS}
        self.put(p.CONFIG,self.config);self.put(p.CONTRACT,'Synthetic fixture policy only; not production instructions.')
        self.snap=self.snapshot();self.snapshot_path=self.put('reports/snapshot-v1.json',self.snap)

    def put(self, name, value):
        path=self.root/name;path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(json.dumps(value) if not isinstance(value,str) else value);return path

    def set_level(self, level):
        self.config['defaultProfile']=level;self.put(p.CONFIG,self.config)

    def snapshot(self, word='fixture'):
        s=fixtures.Tests().snapshot(fixtures.HTML.replace('Useful complete',word+' useful complete'))
        s['manifest']['workflowKind']='mindmap-pass';s['manifest']['routes'][0]['claimCategories']=['ordinary']
        s['contentReviewPolicy']={'version':p.VERSION,'sha256':p.policy_hash(self.root)}
        s['snapshotSha256']=render.digest({k:v for k,v in s.items() if k!='snapshotSha256'})
        return s

    def assessment(self, semantic=None, incidental=False):
        semantic=semantic or self.snap['routes'][0]['semantic'];text=p.claim_text(semantic)
        return {'textSha256':p.sha(text.encode()),'rationale':'Synthetic fixture: ordinary product information without any medical, legal or financial recommendation.',
                'consequentialClaims':[], 'incidentalMentions':[{'quote':x['quote'],'reason':'Synthetic fixture: this is only an unrelated glossary reference, with no advice or compliance claim.'} for x in p.flags(text)] if incidental else []}

    def reserve(self, version, job='fixture-job', reviewer='independent'):
        self.snap=self.snapshot('revision-'+str(version));self.snapshot_path=self.put('reports/snapshot-'+str(version)+'.json',self.snap)
        return p.reserve(self.root,self.snapshot_path,'/guide',job,reviewer,self.root/('reports/admission-'+str(version)+'.json'))

    def report(self, admission, verdict='FAIL'):
        report=fixtures.Tests().review(self.snap);rr=report['routes'][0]
        rr.update(verdict=verdict,reviewProfile=self.config['defaultProfile'],riskAssessment=self.assessment(),reviewBudget=admission['admissionArtifact'])
        rr['factualReview']={k:{'status':'PASS','evidence':'Synthetic fixture evidence exercising validation only; it is never a production review.'} for k in p.FACTS[rr['reviewProfile']]+['riskClassification','seoQuality']}
        return report

    def test_audit_checkpoint_binds_actual_actor_phase_job_and_route(self):
        (self.root/'.claude/commands/_workflow-efficiency.md').write_text('Synthetic activated native workflow.')
        self.put('reports/handoff.json',{'jobId':'fixture-job','routes':['/guide']})
        reading={'phase':'audit','actor':'independent','runId':'actual-fixture-run','contextId':'fixture-context','contextEpoch':'1','handoff':{'path':'reports/handoff.json'}}
        fake=types.SimpleNamespace(validate=lambda root,directory:reading)
        with mock.patch.object(p.importlib.util,'spec_from_file_location',return_value=types.SimpleNamespace(loader=types.SimpleNamespace(exec_module=lambda module:None))),mock.patch.object(p.importlib.util,'module_from_spec',return_value=fake):
            p.audit_preflight_check(self.root,self.root/'reports/reading','fixture-job','independent','/guide')
            for field,value in [('actor','writer'),('phase','build'),('contextId',None)]:
                saved=reading[field];reading[field]=value
                with self.assertRaises(ValueError):p.audit_preflight_check(self.root,self.root/'reports/reading','fixture-job','independent','/guide')
                reading[field]=saved
            with self.assertRaises(ValueError):p.audit_preflight_check(self.root,self.root/'reports/reading','another-job','independent','/guide')
            with self.assertRaises(ValueError):p.audit_preflight_check(self.root,self.root/'reports/reading','fixture-job','independent','/unowned')

    def test_missing_audit_handoff_fails_before_reserving_any_round(self):
        (self.root/'.claude/commands/_workflow-efficiency.md').write_text('Synthetic activated native workflow.')
        with self.assertRaisesRegex(ValueError,'--preflight'):
            p.reserve(self.root,self.put('reports/current.json',self.snap),'/guide','fixture-job','independent',self.root/'reports/admission.json')
        self.assertFalse(any((self.root/'reports/content-review-journals').glob('*.jsonl')))

    def test_exact_one_two_three_shared_limits(self):
        for level,maximum in p.LIMITS.items():
            with self.subTest(level=level):
                # Independent canonical page identity for each synthetic tier.
                self.config['siteId']='synthetic-'+level;self.set_level(level)
                for n in range(1,maximum+1):
                    admission=self.reserve(level+'-'+str(n));report=self.report(admission)
                    path=self.put('reports/review-'+level+'-'+str(n)+'.json',report)
                    value=p.record(self.root,path);self.assertEqual(value[0]['round'],n)
                with self.assertRaisesRegex(ValueError,'budget exhausted'):self.reserve(level+'-extra')
                with self.assertRaisesRegex(ValueError,'renaming'):self.reserve(level+'-renamed',job='new-name')

    def test_corrupt_pending_capture_reuses_the_same_slot_and_requires_actual_verdict(self):
        first=self.reserve(1);p.record(self.root,self.put('reports/r1.json',self.report(first)))
        second=self.reserve(2);old_path=self.snapshot_path;old_admission=second['admissionArtifact']
        old_path.write_text('{"overwritten":true}')
        self.snap=self.snapshot('actual corrected candidate');fresh=self.put('reports/corrected-capture.json',self.snap)
        failure=self.put('reports/actual-independent-error.md','Synthetic negative-path fixture only: the auditor documented an overwritten snapshot and no recorded verdict. '*3)
        repaired=p.repair_pending(self.root,fresh,'/guide','fixture-job','independent',self.root/'reports/repaired-admission.json',failure)
        with p.Journal(self.root,'https://example.com','/guide') as journal:
            self.assertEqual(len(journal.cycle['rounds']),2);self.assertEqual(journal.cycle['rounds'][-1]['status'],'pending')
            self.assertEqual(journal.events[-1]['kind'],'repair-pending');self.assertEqual(journal.events[-1]['data']['previousAdmission'],old_admission)
        with self.assertRaisesRegex(ValueError,'one unfinished'):
            p.repair_pending(self.root,fresh,'/guide','fixture-job','independent',self.root/'reports/third.json',failure)
        report=self.report(repaired,'PASS');p.record(self.root,self.put('reports/actual-r2.json',report))
        self.assertTrue(p.check_rendered(self.root,self.snap,report))
        with p.Journal(self.root,'https://example.com','/guide') as journal:
            self.assertEqual(len(journal.cycle['rounds']),2);self.assertEqual([x.get('verdict') for x in journal.cycle['rounds']],['FAIL','PASS'])
        p.sources(self.root,self.put('reports/actual-r2.json',report))

    def test_intact_or_completed_admission_cannot_be_rebound(self):
        admission=self.reserve(1);failure=self.put('reports/error.md','Synthetic fixture, not a real failure. '*5)
        with self.assertRaisesRegex(ValueError,'intact'):
            p.repair_pending(self.root,self.snapshot_path,'/guide','fixture-job','independent',self.root/'reports/repaired.json',failure)
        p.record(self.root,self.put('reports/pass.json',self.report(admission,'PASS')))
        with self.assertRaisesRegex(ValueError,'unfinished'):
            p.repair_pending(self.root,self.snapshot_path,'/guide','fixture-job','independent',self.root/'reports/repaired.json',failure)

    def test_prior_dependency_bytes_are_archived_while_current_candidate_stays_current(self):
        d=load('cache_fixture','content-review-durable.py')
        current=self.put('reports/working.json',{'version':'original'});ref=p.reference(self.root,current)
        self.snap['manifest']['reviewDependencies']=[ref];self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'});self.snapshot_path=self.put('reports/snapshot-v1.json',self.snap)
        admission=p.reserve(self.root,self.snapshot_path,'/guide','fixture-job','independent',self.root/'reports/admit.json')
        with p.Journal(self.root,'https://example.com','/guide') as journal:d.collect(self.root,journal)
        current.write_text('{"version":"corrected"}')
        self.assertEqual(json.loads(p.artifact(self.root,ref).read_text()),{'version':'original'})
        self.assertEqual(json.loads(current.read_text()),{'version':'corrected'})
        with p.Journal(self.root,'https://example.com','/guide') as journal:files=d.collect(self.root,journal)
        self.assertEqual(files['reports/working.json'],p.sha(current.read_bytes()));self.assertIn(str(d.cache_path(self.root,ref['path'],ref['sha256']).relative_to(self.root)),files)

    def test_capped_editorial_fail_never_waives_real_exclusions_or_professional_approval(self):
        self.set_level('high');self.snap=self.snapshot();report=self.report({'admissionArtifact':{}},'FAIL');rr=report['routes'][0]
        for name in ['testingAndAttribution','scopeAndExclusions']:
            changed=copy.deepcopy(rr);changed['checks'][name]['status']='FAIL'
            with self.assertRaises(ValueError):p.pass_evidence(self.root,self.snap,changed,'high',retain_fail=True)
        self.snap['manifest']['routes'][0]['professionalReviewRequired']=True;rr['factualReview']['professionalReview']['status']='FAIL'
        with self.assertRaisesRegex(ValueError,'professionalReview'):p.pass_evidence(self.root,self.snap,rr,'high',retain_fail=True)

    def test_real_durable_round_two_survives_mutable_dependencies_and_fresh_checkout(self):
        import shutil
        d=load('durable_round_fixture','content-review-durable.py')
        remote=self.root/'remote.git';subprocess.run(['git','init','--bare','-q',str(remote)],check=True)
        subprocess.run(['git','-C',str(self.root),'remote','add','origin',str(remote)],check=True)
        store_path=Path(__file__).with_name('workflow-control-store.py')
        self.put('.claude/tools/workflow-control-store.py',store_path.read_text())
        working=self.put('reports/working.json',{'version':'original'});old_ref=p.reference(self.root,working)
        self.snap=self.snapshot('one');self.snap['manifest']['reviewDependencies']=[old_ref]
        self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'});old_snapshot=self.put('reports/first.json',self.snap)
        first=p.reserve(self.root,old_snapshot,'/guide','fixture-job','independent',self.root/'reports/admit1.json')
        p.record(self.root,self.put('reports/first-review.json',self.report(first)))
        working.write_text('{"version":"corrected"}')
        stale=self.put('reports/stale-second.json',self.snap)
        second=p.reserve(self.root,stale,'/guide','fixture-job','independent',self.root/'reports/admit2.json')
        stale.write_text('{"overwritten":true}')
        self.snap=self.snapshot('two');self.snap['manifest']['reviewDependencies']=[p.reference(self.root,working)]
        self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'});fresh=self.put('reports/actual-second.json',self.snap)
        failure=self.put('reports/auditor-error.md','Synthetic fixture only: an actual overwritten pending snapshot; not a production report or permission. '*3)
        repair=p.repair_pending(self.root,fresh,'/guide','fixture-job','independent',self.root/'reports/repaired2.json',failure)
        p.record(self.root,self.put('reports/second-review.json',self.report(repair,'PASS')))
        other=self.root/'fresh-checkout';other.mkdir();subprocess.run(['git','init','-q',str(other)],check=True);subprocess.run(['git','-C',str(other),'remote','add','origin',str(remote)],check=True)
        for name in [p.CONFIG,p.CONTRACT,'.claude/tools/workflow-control-store.py']:
            target=other/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(self.root/name,target)
        journal=p.Journal(other,'https://example.com','/guide');d.restore(other,journal)
        with journal as actual:self.assertEqual([x.get('verdict') for x in actual.cycle['rounds']],['FAIL','PASS'])
        self.assertEqual(json.loads(p.artifact(other,old_ref).read_text()),{'version':'original'})
        self.assertEqual(json.loads((other/'reports/working.json').read_text()),{'version':'corrected'})

    def test_first_real_pass_does_not_require_extra_reviews(self):
        self.set_level('standard');admission=self.reserve(1);report=self.report(admission,'PASS')
        p.record(self.root,self.put('reports/review.json',report))
        self.assertTrue(p.check_rendered(self.root,self.snap,report))
        with self.assertRaisesRegex(ValueError,'already passed'):
            p.reserve(self.root,self.snapshot_path,'/guide','fixture-job','independent',self.root/'reports/unneeded.json')

    def test_normal_capture_review_and_live_record_use_the_policy_hooks(self):
        response=mock.MagicMock();response.status=200;response.read.return_value=HTML.encode()
        response.geturl.return_value='https://example.com/guide';response.headers={}
        response.__enter__.return_value=response
        target=self.root/'reports/real-hook-synthetic-snapshot.json'
        with mock.patch.object(render,'__file__',str(self.root/'.claude/tools/rendered-audit.py')), \
             mock.patch.object(render,'content_review_policy',return_value=p), \
             mock.patch.object(render.urllib.request,'urlopen',return_value=response):
            self.snap=render.capture(self.snap['manifest'],'https://example.com',target)
            self.assertEqual(self.snap['contentReviewPolicy']['sha256'],p.policy_hash(self.root))
            admission=p.reserve(self.root,target,'/guide','fixture-job','independent',self.root/'reports/real-hook-synthetic-admission.json')
            report=self.report(admission,'PASS');report_path=self.put('reports/real-hook-synthetic-review.json',report);p.record(self.root,report_path)
            retained=p.sources(self.root,report_path)['paths']
            self.assertTrue(any(x.endswith('.html') for x in retained));self.assertTrue(any(x.endswith('.txt') for x in retained))
            render.review_check(self.snap,report)
            host={'commit':'a'*40,'status':'live','verifiedAt':'2026-11-08T12:00:00+00:00','evidenceUrl':'https://example.com/synthetic-host-fixture'}
            render.record(self.snap,self.snap,report,'a'*40,host,self.root/'reports/synthetic-ledger.jsonl')
        with p.Journal(self.root,'https://example.com','/guide') as journal:self.assertEqual(journal.cycle['status'],'published')

    def test_unrecorded_pass_or_wrong_fingerprint_cannot_publish(self):
        admission=self.reserve(1);report=self.report(admission,'PASS')
        with self.assertRaisesRegex(ValueError,'Record the actual'):p.check_rendered(self.root,self.snap,report)
        report['routes'][0]['fingerprint']='0'*64
        with self.assertRaisesRegex(ValueError,'different rendered'):p.record(self.root,self.put('reports/wrong.json',report))

    def test_publication_sources_include_actual_journal_and_immutable_history(self):
        first=self.reserve(1);report=self.report(first);p.record(self.root,self.put('reports/review1.json',report))
        second=self.reserve(2);report=self.report(second,'PASS');path=self.put('reports/review2.json',report);p.record(self.root,path)
        paths=p.sources(self.root,path)['paths']
        self.assertIn('reports/admission-1.json',paths);self.assertIn('reports/snapshot-1.json',paths)
        self.assertIn('reports/admission-2.json',paths);self.assertIn('reports/snapshot-2.json',paths)
        self.assertTrue(any(x.endswith('.jsonl') for x in paths))
        self.assertEqual(len([x for x in paths if '/blobs/' in x]),2)

    def test_local_independent_application_and_professional_validator_is_preserved(self):
        import types
        admission=self.reserve(1);report=self.report(admission,'PASS')
        report['routes'][0]['factualReview']['instructionUnderstanding']={'status':'PASS','evidence':'Synthetic fixture: the original site-specific understanding and application validator must still run.'}
        # Existing local sites require this field before recording as well.
        self.put('.claude/workflow-policy.local.json',{'minimumReviewProfile':'standard'})
        p.record(self.root,self.put('reports/review.json',report));calls=[]
        def old_profile(*args,**kwargs):raise AssertionError('The old keyword-only risk classifier must be replaced for this exact current page')
        module=types.SimpleNamespace(profile=old_profile)
        def review(root,snapshot,value):
            calls.append(module.profile(root,json.dumps(snapshot['routes'][0]['semantic']),['ordinary']))
            raise ValueError('Synthetic fixture: required independent application evidence is missing')
        module.rendered_review=review
        with self.assertRaisesRegex(ValueError,'required independent application'):p.check_rendered(self.root,self.snap,report,local_module=module)
        self.assertEqual(calls,['standard']);self.assertIs(module.profile,old_profile)

    def test_pending_different_candidate_or_reviewer_cannot_take_another_slot(self):
        first=self.reserve(1)
        same=p.reserve(self.root,self.snapshot_path,'/guide','fixture-job','independent',self.root/'reports/other-path.json')
        self.assertEqual(first['admissionArtifact'],same['admissionArtifact'])
        with self.assertRaisesRegex(ValueError,'pending review'):
            p.reserve(self.root,self.snapshot_path,'/guide','fixture-job','other-reviewer',self.root/'reports/no.json')
        with self.assertRaisesRegex(ValueError,'pending review'):self.reserve(2)

    def test_parallel_reservations_do_not_lose_or_duplicate_rounds(self):
        results=[];errors=[]
        def reserve(n):
            try:results.append(p.reserve(self.root,self.snapshot_path,'/guide','fixture-job','independent',self.root/('reports/parallel-'+str(n)+'.json')))
            except Exception as e:errors.append(str(e))
        threads=[threading.Thread(target=reserve,args=(i,)) for i in range(2)]
        for thread in threads:thread.start()
        for thread in threads:thread.join(timeout=5)
        self.assertFalse(errors);self.assertEqual(len(results),2)
        self.assertEqual(results[0]['admissionArtifact'],results[1]['admissionArtifact'])
        with p.Journal(self.root,'https://example.com','/guide') as j:self.assertEqual(len(j.cycle['rounds']),1)

    def test_report_history_survives_reused_report_filename(self):
        first=self.reserve(1);report=self.report(first);path=self.put('reports/review.json',report);p.record(self.root,path)
        path.write_text('{"overwritten":"synthetic fixture"}')
        with p.Journal(self.root,'https://example.com','/guide') as j:
            record=j.cycle['rounds'][0]
            self.assertEqual(p.read(p.artifact(self.root,record['report'])),report)

    def test_journal_truncation_and_counter_restarts_fail(self):
        admission=self.reserve(1);p.record(self.root,self.put('reports/review.json',self.report(admission)))
        with p.Journal(self.root,'https://example.com','/guide') as j:path=j.path;raw=path.read_bytes()
        path.write_bytes(raw.splitlines(keepends=True)[0])
        with self.assertRaisesRegex(ValueError,'unfinished review history'):self.reserve(2)
        path.write_bytes(raw)
        self.assertEqual(self.reserve(2)['number'],2)  # failed loads release their locks

    def test_new_cycle_requires_actual_verified_publication(self):
        admission=self.reserve(1);report=self.report(admission,'PASS');p.record(self.root,self.put('reports/review.json',report))
        approved=copy.deepcopy(self.snap)
        with self.assertRaisesRegex(ValueError,'renaming'):self.reserve(2,job='next-job')
        with self.assertRaisesRegex(ValueError,'verified host'):p.mark_published(self.root,approved,report,'a'*40,{})
        host={'commit':'a'*40,'status':'live','verifiedAt':'2026-11-08T12:00:00+00:00','evidenceUrl':'https://example.com/fixture-proof'}
        p.mark_published(self.root,approved,report,'a'*40,host)
        self.assertEqual(self.reserve(2,job='next-job')['number'],1)
        self.assertTrue(p.check_rendered(self.root,approved,report))

    def test_existing_site_floor_and_medical_claim_escalation(self):
        self.set_level('light');semantic={'text':'An ordinary beard styling guide with verified product specifications.'}
        self.assertEqual(p.profile(self.root,semantic,['ordinary']),'light')
        self.put('.claude/workflow-policy.local.json',{'minimumReviewProfile':'standard'})
        with self.assertRaisesRegex(ValueError,'site minimum'):p.profile(self.root,semantic,['ordinary'])
        self.put('.claude/workflow-policy.local.json',{'minimumReviewProfile':'light'})
        semantic={'text':'The device treats asthma and reduces disease symptoms.'}
        self.assertEqual(p.profile(self.root,semantic,['ordinary'],assessment=self.assessment(semantic,True)),'high')

    def test_url_only_risk_words_do_not_make_ordinary_software_high(self):
        semantic={'text':'An ordinary software pricing comparison.','links':['https://example.com/hipaa-guide'],'structure':[['a',{'href':'https://example.com/gdpr'}]]}
        self.assertEqual(p.profile(self.root,semantic,['ordinary','pricing']),'standard')

    def test_incidental_visible_mentions_need_exact_context_and_reason(self):
        semantic={'text':'For terminology, read our HIPAA glossary. This comparison concerns export formats and published prices.'}
        self.assertEqual(p.profile(self.root,semantic,['ordinary']),'high')
        self.assertEqual(p.profile(self.root,semantic,['ordinary'],assessment=self.assessment(semantic,True)),'standard')
        bad=self.assessment(semantic,True);bad['incidentalMentions'][0]['reason']='benign'
        with self.assertRaisesRegex(ValueError,'specific explanation'):p.profile(self.root,semantic,['ordinary'],assessment=bad)
        with self.assertRaisesRegex(ValueError,'Unresolved risk'):p.profile(self.root,semantic,['ordinary'],assessment=self.assessment(semantic))

    def test_high_risk_site_does_not_need_an_essay_for_every_keyword(self):
        self.set_level('high');semantic={'text':'Clinical literature discusses medical evidence and diagnosis.'}
        self.assertEqual(p.profile(self.root,semantic,['medical'],assessment=self.assessment(semantic)),'high')

    def test_source_bound_legacy_inventory_is_not_a_new_pass(self):
        report=fixtures.Tests().review(self.snap)
        inventory=self.put('.claude/fixture-legacy.json',{'pairs':[{'snapshotSha256':self.snap['snapshotSha256'],'reviewObjectSha256':p.digest(report)}],'histories':[]})
        self.config['legacyInventory']=p.reference(self.root,inventory);self.put(p.CONFIG,self.config)
        self.assertTrue(p.is_legacy(self.root,self.snap,report))
        self.assertFalse(p.check_rendered(self.root,self.snap,report))
        changed=copy.deepcopy(report);changed['routes'][0]['verdict']='FAIL'
        self.assertFalse(p.is_legacy(self.root,self.snap,changed))

    def test_unrelated_native_release_path_is_unchanged_but_mindmap_requires_policy(self):
        snapshot=fixtures.Tests().snapshot();report=fixtures.Tests().review(snapshot)
        self.assertFalse(p.check_rendered(self.root,snapshot,report))
        with self.assertRaisesRegex(ValueError,'active review policy'):p.check_rendered(self.root,snapshot,report,force=True)

    def test_professional_obligation_cannot_be_na_or_omitted(self):
        self.set_level('high');admission=self.reserve(1);report=self.report(admission,'PASS')
        self.snap['manifest']['routes'][0]['professionalReviewRequired']=True
        self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'})
        report['routes'][0]['factualReview']['professionalReview']['status']='NA'
        with self.assertRaisesRegex(ValueError,'professionalReview'):p.check_rendered(self.root,self.snap,report)

    def test_www_and_trailing_slash_cannot_reset_page_counter(self):
        admission=self.reserve(1);p.record(self.root,self.put('reports/review.json',self.report(admission)))
        with p.Journal(self.root,'https://www.example.com/','/guide/') as journal:
            self.assertEqual(len(journal.cycle['rounds']),1)
        with p.Journal(self.root,'https://example.com','/guide') as journal:
            self.assertEqual(journal.identity['route'],'/guide')

    def test_invalid_pass_receipt_is_corrected_within_its_pending_round(self):
        self.set_level('light');admission=self.reserve(1);report=self.report(admission,'PASS')
        del report['routes'][0]['factualReview']['centralFacts']
        with self.assertRaisesRegex(ValueError,'factual/SEO'):p.record(self.root,self.put('reports/bad.json',report))
        with p.Journal(self.root,'https://example.com','/guide') as journal:self.assertEqual(journal.cycle['rounds'][0]['status'],'pending')
        report=self.report(admission,'PASS');p.record(self.root,self.put('reports/good.json',report))
        self.assertTrue(p.check_rendered(self.root,self.snap,report))

    def test_existing_content_rounds_import_without_extra_fix_budget(self):
        old=self.put('reports/old.json',{'reviewer':'previous-independent','routes':[{'path':'/guide','fingerprint':'old-candidate','verdict':'FAIL'}]})
        self.snap=self.snapshot();self.snapshot_path=self.put('reports/current.json',self.snap)
        admission=p.reserve(self.root,self.snapshot_path,'/guide','fixture-job','independent',self.root/'reports/next.json',[old])
        self.assertEqual(admission['number'],2)
        p.record(self.root,self.put('reports/current-review.json',self.report(admission)))
        with self.assertRaisesRegex(ValueError,'budget exhausted'):self.reserve(3)

    def test_required_legacy_history_is_checked_before_cycle_creation(self):
        legacy=self.put('.claude/legacy.json',{'pairs':[],'histories':[{'jobId':'fixture-job','route':'/guide','rounds':2}]})
        self.config['legacyInventory']=p.reference(self.root,legacy);self.put(p.CONFIG,self.config)
        self.snap=self.snapshot();self.snapshot_path=self.put('reports/new-snapshot.json',self.snap)
        for _ in range(2):
            with self.assertRaisesRegex(ValueError,'Import the actual'):
                p.reserve(self.root,self.snapshot_path,'/guide','fixture-job','independent',self.root/'reports/no.json')
        with p.Journal(self.root,'https://example.com','/guide') as journal:self.assertIsNone(journal.cycle)

    def test_unchanged_passing_sibling_can_publish_without_another_audit(self):
        self.set_level('light');self.snap=self.snapshot('Unicode fixture café')
        second_spec={'path':'/other','expectedUpdatedDate':'2026-10-27','claimCategories':['ordinary']}
        self.snap['manifest']['routes'].append(second_spec)
        self.snap['routes'].append(render.parse(fixtures.HTML.replace('/guide','/other'),second_spec,'http://localhost:3000','https://example.com'))
        self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'})
        self.snapshot_path=self.put('reports/shared-snapshot.json',self.snap)
        first=p.reserve(self.root,self.snapshot_path,'/guide','fixture-job','independent',self.root/'reports/first.json')
        second=p.reserve(self.root,self.snapshot_path,'/other','fixture-job','independent',self.root/'reports/second.json')
        report=self.report(first,'PASS');other=copy.deepcopy(report['routes'][0]);other.update(path='/other',fingerprint=self.snap['routes'][1]['fingerprint'],verdict='FAIL',reviewBudget=second['admissionArtifact'],riskAssessment=self.assessment(self.snap['routes'][1]['semantic']))
        report['routes'].append(other);path=self.put('reports/shared-review.json',report);p.record(self.root,path)
        out_s=self.root/'reports/passing-snapshot.json';out_r=self.root/'reports/passing-review.json'
        result=p.project(self.root,self.snapshot_path,path,['/guide'],out_s,out_r)
        projected=p.read(out_s);review=p.read(out_r);render.valid_snapshot(projected)
        self.assertTrue(p.check_rendered(self.root,projected,review))
        self.assertIn('no new audit',result['scope'])
        with p.Journal(self.root,'https://example.com','/guide') as journal:self.assertEqual(len(journal.cycle['rounds']),1)
        with self.assertRaisesRegex(ValueError,'failing page'):
            p.project(self.root,self.snapshot_path,path,['/other'],self.root/'reports/forged.json',self.root/'reports/forged-review.json')
        changed=copy.deepcopy(review);changed['routes'][0]['factualReview']['centralFacts']['evidence']='A different fabricated finding must never replace the real independent evidence.'
        with self.assertRaisesRegex(ValueError,'only retain exact'):p.check_rendered(self.root,projected,changed)


if __name__=='__main__':unittest.main()
