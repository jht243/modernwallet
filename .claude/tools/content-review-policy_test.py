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


class RecordedInstructionClarificationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.rel = '.claude/commands/_remediation-ladder.md'
        self.old = '# Existing remediation\n\nKeep every professional and source check.\n'
        target = self.root / self.rel; target.parent.mkdir(parents=True)
        target.write_text('# Existing remediation\n\n' + p.RELEASE_CLARIFICATION + 'Keep every professional and source check.\n')
        self.manifest = {'files': {self.rel: p.sha(self.old.encode())}, 'actor': 'actual-auditor'}
        self.layer = types.SimpleNamespace(historical_delivery=lambda root, directory: (self.manifest, {self.rel: self.old}))

    def test_only_exact_append_preserves_actual_historical_application(self):
        self.assertEqual(p.recorded_release_application(self.root, self.root / 'reports/manifest.json', self.layer), self.manifest)

    def test_changed_professional_or_other_instruction_still_refused(self):
        target = self.root / self.rel
        target.write_text(target.read_text().replace('Keep every professional', 'Skip every professional'))
        with self.assertRaisesRegex(ValueError, 'beyond the exact'):
            p.recorded_release_application(self.root, self.root / 'reports/manifest.json', self.layer)
        target.write_text(self.old + p.RELEASE_CLARIFICATION)
        other = '.claude/commands/phase-4-audit.md'; (self.root / other).write_text('Changed review obligation')
        self.manifest['files'][other] = p.sha(b'Original review obligation')
        self.layer.historical_delivery = lambda root, directory: (self.manifest, {self.rel: self.old, other: 'Original review obligation'})
        with self.assertRaisesRegex(ValueError, 'beyond the exact'):
            p.recorded_release_application(self.root, self.root / 'reports/manifest.json', self.layer)

    def test_new_review_never_uses_historical_release_exception(self):
        path = self.root / 'reports/manifest.json'; path.parent.mkdir(); path.write_text('{}')
        self.layer.policy_hash = lambda root: 'current-policy'
        self.layer.evidence_ref = lambda root, ref: path
        self.layer.validate = mock.Mock(side_effect=ValueError('Instructions changed'))
        self.layer.historical_delivery = mock.Mock(side_effect=AssertionError('New review must not archive-fallback'))
        report = {'workflowPolicySha256': 'current-policy', 'instructionApplications': [{}, {}]}
        with self.assertRaisesRegex(ValueError, 'Instructions changed'):
            p.verify_current_applications(self.root, {'manifest': {'author': 'writer'}}, 'auditor', report, self.layer)
        self.layer.historical_delivery.assert_not_called()

    def test_only_exact_paid_probe_scope_change_is_compatible(self):
        old = 'Before\n## Step 0 — preflight ONCE per run\n' + p.WRITER_PROBE_OLD + '\nKeep source and professional checks.'
        new = old.replace('## Step 0 — preflight ONCE per run', '## Check the writer once when a reviewed job is ready to write').replace(p.WRITER_PROBE_OLD, p.WRITER_PROBE_NEW)
        rel = '.claude/commands/_content-generation.md'
        self.assertTrue(p.release_only_instruction_change(rel, old, new))
        self.assertFalse(p.release_only_instruction_change(rel, old, new.replace('Keep source', 'Skip source')))
        self.assertFalse(p.release_only_instruction_change('.claude/commands/phase-4-audit.md', old, new))

    def test_pending_source_repair_clarification_preserves_only_completed_reviews(self):
        old = 'Keep professional checks and recorded verdicts.\n'
        new = old + '\n' + p.PENDING_SOURCE_CLARIFICATION + '\n'
        rel = '.claude/commands/_content-review-policy.md'
        self.assertTrue(p.release_only_instruction_change(rel, old, new))
        self.assertFalse(p.release_only_instruction_change(rel, old, new.replace('Keep professional', 'Skip professional')))
        self.assertFalse(p.release_only_instruction_change(rel, old, new.replace('A recorded verdict cannot', 'A recorded verdict can')))
        self.assertFalse(p.release_only_instruction_change(rel, new, new))


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
            reading['handoff'] = 'reports/handoff.json'
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

    def test_third_audit_requires_substantive_medical_or_legal_claim_and_never_bot_scout(self):
        config = {'thirdReviewClaimCategories': ['medical', 'legal']}
        claim = {'quote': 'A substantive independently reviewed passage.', 'reason': 'The actual independent reviewer documented the specific material effect of this claim.'}
        for category in ('medical','legal','safety-critical','financial','investment','security-critical'):
            assessment = {'consequentialClaims': [{**claim,'category':category}]}
            self.assertEqual(p.audit_limit(config,'high',assessment), 3 if category in ('medical','legal') else 2)
            self.assertEqual(p.audit_limit({'thirdReviewClaimCategories':[]},'high',assessment),2)
        self.assertEqual(p.audit_limit(config,'high',{'incidentalMentions':[dict(claim,category='medical')]}),2)
        self.assertEqual(p.audit_limit(config,'light',assessment),1)

    def test_third_audit_admits_edited_rework_after_round2_substantiated_legal_claim_without_deadlock(self):
        self.config.update(thirdReviewClaimCategories=['medical', 'legal'], releaseAtAuditLimit=True, canonicalHosts=['example.com'])
        self.put(p.CONFIG, self.config)
        self.set_level('high')
        # Round 1 & Round 2 with a substantiated legal claim in Round 2
        for n, body in ((1, 'Initial retirement tax penalty rule text v1.'), (2, 'Specific legal penalty statutory claim quote v2.')):
            snap = self.snapshot(body)
            snap['manifest']['canonicalBase'] = 'https://example.com'
            snap['snapshotSha256'] = render.digest({k: v for k, v in snap.items() if k != 'snapshotSha256'})
            self.snap = snap
            target = self.put(f'reports/legal-r{n}.json', snap)
            adm = p.reserve(self.root, target, '/guide', 'fixture-job', 'independent', self.root / f'reports/legal-adm-{n}.json')
            rep = self.report(adm, 'FAIL')
            txt = p.claim_text(snap['routes'][0]['semantic'])
            rep['routes'][0]['riskAssessment'] = {
                'textSha256': p.sha(txt.encode()),
                'rationale': 'Substantive legal statutory retirement rule requiring full high-scrutiny verification.',
                'consequentialClaims': [{
                    'category': 'legal',
                    'quote': body,
                    'reason': 'Direct statutory legal claim whose wording requires targeted verification.',
                }],
                'incidentalMentions': [],
            }
            rec_out = p.record(self.root, self.put(f'reports/legal-rep-{n}.json', rep))
            self.assertEqual(rec_out[0]['maximumRounds'], 3)
        # Round 3: writer rewrites the flagged quote completely during Round-2 rework -> must admit Round 3, never deadlock!
        snap3 = self.snapshot('Rewritten compliant summary citing IRS Notice 2026-14 without the prior quote.')
        snap3['manifest']['canonicalBase'] = 'https://example.com'
        snap3['snapshotSha256'] = render.digest({k: v for k, v in snap3.items() if k != 'snapshotSha256'})
        self.snap = snap3
        target3 = self.put('reports/legal-r3.json', snap3)
        adm3 = p.reserve(self.root, target3, '/guide', 'fixture-job', 'independent', self.root / 'reports/legal-adm-3.json')
        self.assertEqual(adm3['number'], 3)
        self.assertEqual(adm3['maximumRounds'], 3)

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

    def test_layer3_release_at_limit_retains_fail_and_closes_only_exact_candidate(self):
        self.exercise_release_at_limit('jht243/layer3labs','https://www.layer3labs.io')

    def test_activated_other_fleet_site_releases_actual_factual_fail_at_limit(self):
        self.config['canonicalHosts']=['example.com']
        self.exercise_release_at_limit('synthetic-other-fleet-site','https://example.com')

    def exercise_release_at_limit(self,site,base):
        self.config.update(siteId=site,releaseAtAuditLimit=True)
        self.set_level('standard')
        self.snap['manifest']['canonicalBase']=base
        for number in (1,2):
            snap=self.snapshot('revision-'+str(number))
            snap['manifest']['canonicalBase']=base
            snap['snapshotSha256']=render.digest({k:v for k,v in snap.items() if k!='snapshotSha256'})
            self.snap=snap
            target=self.put('reports/cap-'+str(number)+'.json',snap)
            admission=p.reserve(self.root,target,'/guide','fixture-job','independent',self.root/('reports/a'+str(number)+'.json'))
            report=self.report(admission,'FAIL')
            report['routes'][0]['checks']['sourceSupport']['status']='FAIL'
            with self.assertRaises(ValueError):p.check_rendered(self.root,snap,report)
            p.record(self.root,self.put('reports/result-'+str(number)+'.json',report))
            if number==1:
                with self.assertRaises(ValueError):p.check_rendered(self.root,snap,report)
        self.assertTrue(p.check_rendered(self.root,snap,report))
        with mock.patch.object(render,'__file__',str(self.root/'.claude/tools/rendered-audit.py')),mock.patch.object(render,'content_review_policy',return_value=p):
            render.review_check(snap,report)
        commit='1'*40
        p.mark_published(self.root,snap,report,commit,{'commit':commit,'status':'live','verifiedAt':'2026-11-09','evidenceUrl':base+'/guide'})
        with p.Journal(self.root,snap['manifest']['canonicalBase'],'/guide') as journal:
            self.assertEqual(journal.cycle['status'],'published')
            self.assertEqual([r['verdict'] for r in journal.cycle['rounds']],['FAIL','FAIL'])

    def test_fleet_release_requires_opt_in_host_and_mindmap_scope(self):
        self.config.update(releaseAtAuditLimit=True,canonicalHosts=['example.com']);self.put(p.CONFIG,self.config)
        self.assertTrue(p.capped_release(self.root,self.snap))
        wrong=copy.deepcopy(self.snap);wrong['manifest']['canonicalBase']='https://unrelated.example'
        self.assertFalse(p.capped_release(self.root,wrong))
        wrong['manifest']['canonicalBase']='https://example.com';wrong['manifest']['workflowKind']='client-delivery'
        self.assertFalse(p.capped_release(self.root,wrong))
        del self.config['canonicalHosts'];self.put(p.CONFIG,self.config)
        self.assertFalse(p.capped_release(self.root,self.snap))

    def test_capped_release_allows_non_liability_findings_while_blocking_lazy_na_and_direct_liability(self):
        self.snap=self.snapshot('Tested and reviewed by our clinic editorial team')
        admission=p.reserve(self.root,self.put('reports/tested-snap.json',self.snap),'/guide','fixture-job','independent',self.root/'reports/tested-admit.json')
        rr=self.report(admission)['routes'][0]
        rr['checks']['scopeAndExclusions']['status']='FAIL'
        rr['checks']['testingAndAttribution']['status']='FAIL'
        p.pass_evidence(self.root,self.snap,rr,'standard',retain_fail=True)
        rr['checks']['testingAndAttribution']['status']='NA'
        with self.assertRaisesRegex(ValueError,'Visible testing attribution cannot be NA'):
            p.pass_evidence(self.root,self.snap,rr,'standard',retain_fail=True)
        rr['checks']['testingAndAttribution']['status']='FAIL'
        rr['liabilityBlock']={
            'category':'medical-dosing-or-treatment-harm',
            'quote':'Tested and reviewed by',
            'harm':'Direct actionable medical dosing/clinical sign-off liability fixture for negative-path validation.',
        }
        with self.assertRaisesRegex(ValueError,'Direct legal/physical liability'):
            p.pass_evidence(self.root,self.snap,rr,'standard',retain_fail=True)

    def test_capped_release_preserves_required_professional_approval(self):
        self.set_level('high');admission=self.reserve(1);rr=self.report(admission)['routes'][0]
        self.snap['manifest']['routes'][0]['professionalReviewRequired']=True
        rr['factualReview']['professionalReview']['status']='FAIL'
        with self.assertRaisesRegex(ValueError,'professionalReview'):p.pass_evidence(self.root,self.snap,rr,'high',retain_fail=True)

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

    def test_capped_editorial_fail_publishes_non_liability_checks_while_preserving_liability_and_professional_approval(self):
        self.set_level('high');self.snap=self.snapshot('Outpatient MRI pricing ranges from $450 to $1,100 across our three Austin clinic locations');report=self.report({'admissionArtifact':{}},'FAIL');rr=report['routes'][0]
        for name in ['testingAndAttribution','scopeAndExclusions']:
            changed=copy.deepcopy(rr);changed['checks'][name]['status']='FAIL'
            p.pass_evidence(self.root,self.snap,changed,'high',retain_fail=True)
        liab=copy.deepcopy(rr)
        liab['liabilityBlock']={
            'category':'medical-dosing-or-treatment-harm',
            'quote':'Outpatient MRI pricing ranges',
            'harm':'Synthetic direct medical dosing harm fixture verifying that liabilityBlock hard-blocks release.',
        }
        with self.assertRaisesRegex(ValueError,'Direct legal/physical liability'):p.pass_evidence(self.root,self.snap,liab,'high',retain_fail=True)
        self.snap['manifest']['routes'][0]['professionalReviewRequired']=True;rr['factualReview']['professionalReview']['status']='FAIL'
        with self.assertRaisesRegex(ValueError,'professionalReview'):p.pass_evidence(self.root,self.snap,rr,'high',retain_fail=True)

    def test_general_medical_pricing_and_locations_publish_at_audit_exhaustion(self):
        self.set_level('standard')
        self.config.update(releaseAtAuditLimit=True,canonicalHosts=['example.com']);self.put(p.CONFIG,self.config)
        for round_num in (1,2):
            self.snap=self.snapshot(f'Round {round_num}: Outpatient MRI pricing ranges from $450 to $1,100 across our three Austin clinic locations; call scheduling to confirm insurance')
            snap_path=self.put(f'reports/med-pricing-s{round_num}.json',self.snap)
            admit=p.reserve(self.root,snap_path,'/guide','med-pricing-job','independent',self.root/f'reports/med-pricing-a{round_num}.json')
            report=self.report(admit,'FAIL')
            report['routes'][0]['checks']['sourceSupport']['status']='FAIL'
            report['routes'][0]['checks']['scopeAndExclusions']['status']='FAIL'
            report['routes'][0]['checks']['testingAndAttribution']['status']='FAIL'
            res=p.record(self.root,self.put(f'reports/med-pricing-r{round_num}.json',report))
            if round_num==1:
                self.assertEqual(res[0]['roundsRemaining'],1)
                self.assertEqual(res[0]['disposition'],'rework-and-reaudit')
            else:
                self.assertEqual(res[0]['roundsRemaining'],0)
                self.assertEqual(res[0]['disposition'],'publish-at-audit-limit')
        self.assertTrue(p.check_rendered(self.root,self.snap,report))
        with mock.patch.object(render,'__file__',str(self.root/'.claude/tools/rendered-audit.py')),mock.patch.object(render,'content_review_policy',return_value=p):
            render.review_check(self.snap,report)
        commit='9'*40
        p.mark_published(self.root,self.snap,report,commit,{'commit':commit,'status':'live','verifiedAt':'2026-11-13','evidenceUrl':'https://example.com/guide'})
        with p.Journal(self.root,'https://example.com','/guide') as journal:
            self.assertEqual(journal.cycle['status'],'published')

    def test_direct_liability_medical_dosing_blocks_at_audit_exhaustion_while_sibling_publishes(self):
        self.set_level('light')
        self.config.update(releaseAtAuditLimit=True,canonicalHosts=['example.com']);self.put(p.CONFIG,self.config)
        dosing_html=fixtures.HTML.replace('/guide','/dosing').replace('Useful complete','Adults should take 5000 mg of warfarin daily to treat blood clots. Useful complete')
        pricing_html=fixtures.HTML.replace('/guide','/clinic-pricing').replace('Useful complete','Clinic MRI pricing is $550 at our Dallas location. Useful complete')
        manifest={
            'author':'writer','canonicalBase':'https://example.com','workflowKind':'mindmap-pass',
            'routes':[
                {'path':'/dosing','expectedUpdatedDate':'2026-10-27','claimCategories':['ordinary']},
                {'path':'/clinic-pricing','expectedUpdatedDate':'2026-10-27','claimCategories':['ordinary']},
            ],
        }
        r_dosing=render.parse(dosing_html,manifest['routes'][0],'http://localhost:3000','https://example.com')
        r_pricing=render.parse(pricing_html,manifest['routes'][1],'http://localhost:3000','https://example.com')
        snap={
            'manifest':manifest,'routes':[r_dosing,r_pricing],'baseUrl':'https://example.com',
            'capturedAt':'2026-11-13T18:00:00+00:00',
            'contentReviewPolicy':{'version':p.VERSION,'sha256':p.policy_hash(self.root)},
        }
        snap['snapshotSha256']=render.digest({k:v for k,v in snap.items() if k!='snapshotSha256'})
        self.snap=snap
        snap_path=self.put('reports/mixed-liab-snap.json',snap)
        a_dos=p.reserve(self.root,snap_path,'/dosing','liab-job','independent',self.root/'reports/a-dos.json')
        a_pri=p.reserve(self.root,snap_path,'/clinic-pricing','liab-job','independent',self.root/'reports/a-pri.json')
        base_checks={k:{'status':'PASS','evidence':'Synthetic fixture evidence for negative-path testing only.'} for k in render.CHECKS}
        dos_facts={k:{'status':'PASS','evidence':'Synthetic fixture evidence exercising validation only; never a production review.'} for k in p.FACTS['high']+['riskClassification','seoQuality']}
        pri_facts={k:{'status':'PASS','evidence':'Synthetic fixture evidence exercising validation only; never a production review.'} for k in p.FACTS['light']+['riskClassification','seoQuality']}
        dos_text=p.claim_text(r_dosing['semantic'])
        dos_assess={
            'textSha256':p.sha(dos_text.encode()),
            'rationale':'Actionable warfarin dosage instruction creates direct clinical patient harm if erroneous.',
            'consequentialClaims':[{'category':'medical','quote':'take 5000 mg of warfarin daily','reason':'Actionable medication dosing instruction on blood-thinner regimen.'}],
            'incidentalMentions':[],
        }
        row_dos={
            'path':'/dosing','fingerprint':r_dosing['fingerprint'],'verdict':'FAIL','reviewProfile':'high',
            'riskAssessment':dos_assess,'reviewBudget':a_dos['admissionArtifact'],
            'checks':{**copy.deepcopy(base_checks),'sourceSupport':{'status':'FAIL','evidence':'5000 mg warfarin is 1000x normal therapeutic dosing and causes fatal hemorrhage.'}},
            'factualReview':dos_facts,
            'liabilityBlock':{
                'category':'medical-dosing-or-treatment-harm',
                'quote':'take 5000 mg of warfarin daily',
                'harm':'Incorrect 5000 mg warfarin dosing instruction creates severe hemorrhage and fatal overdose liability if acted upon by a reader.',
            },
        }
        # Verify invalid liabilityBlock shapes fail closed
        for bad_block in (
            {'category':'pricing','quote':'take 5000 mg of warfarin daily','harm':'x'*50},
            {'category':'medical-dosing-or-treatment-harm','quote':'not on page at all','harm':'x'*50},
            {'category':'medical-dosing-or-treatment-harm','quote':'take 5000 mg of warfarin daily','harm':'too short'},
        ):
            bad_row=copy.deepcopy(row_dos);bad_row['liabilityBlock']=bad_block
            with self.assertRaises(ValueError):p.validate_liability_block(bad_row,r_dosing)
        # Advance /dosing through all 3 high-risk rounds with liabilityBlock still unresolved
        row_pri={
            'path':'/clinic-pricing','fingerprint':r_pricing['fingerprint'],'verdict':'FAIL','reviewProfile':'light',
            'riskAssessment':self.assessment(r_pricing['semantic']),'reviewBudget':a_pri['admissionArtifact'],
            'checks':{**copy.deepcopy(base_checks),'scopeAndExclusions':{'status':'FAIL','evidence':'Editorial scope boundary note on general clinic pricing range.'}},
            'factualReview':pri_facts,
        }
        r1={'reviewer':'independent','snapshotSha256':snap['snapshotSha256'],'routes':[row_dos,row_pri]}
        r1_path=self.put('reports/mixed-r1.json',r1)
        res1=p.record(self.root,r1_path)
        by_path1={x['route']:x for x in res1}
        self.assertEqual(by_path1['/clinic-pricing']['disposition'],'publish-at-audit-limit')
        self.assertEqual(by_path1['/dosing']['disposition'],'rework-liability-and-reaudit')
        for rnum in (2,3):
            ad=p.reserve(self.root,snap_path,'/dosing','liab-job','independent',self.root/f'reports/a-dos-{rnum}.json')
            rd_row=copy.deepcopy(row_dos);rd_row['reviewBudget']=ad['admissionArtifact']
            rn={'reviewer':'independent','snapshotSha256':snap['snapshotSha256'],'routes':[rd_row]}
            rn_path=self.put(f'reports/mixed-r{rnum}.json',rn)
            res_n=p.record(self.root,rn_path)
            if rnum==3:
                self.assertEqual(res_n[0]['roundsRemaining'],0)
                self.assertEqual(res_n[0]['disposition'],'blocked-liability')
        with self.assertRaises(ValueError):p.check_rendered(self.root,snap,r1)
        with self.assertRaisesRegex(ValueError,'liability-blocked'):
            p.project(self.root,snap_path,r1_path,['/dosing'],self.root/'reports/bad-s.json',self.root/'reports/bad-r.json')
        out_s=self.root/'reports/clean-pri-s.json';out_r=self.root/'reports/clean-pri-r.json'
        p.project(self.root,snap_path,r1_path,['/clinic-pricing'],out_s,out_r)
        self.assertTrue(p.check_rendered(self.root,p.read(out_s),p.read(out_r)))

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

    def continuation_r1(self):
        first=self.reserve(1,job='base-family')
        self.snap=self.snapshot('continued first candidate');self.snap['manifest']['jobId']='recorded-continuation'
        self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'})
        snap=self.put('reports/continuation-r1.json',self.snap)
        self.snapshot_path=snap
        failure=self.put('reports/fixture-pending-failure.md','Synthetic fixture: the original pending capture belongs to an earlier worker; retain the exact same unfinished slot. '*3)
        fixed=p.repair_pending(self.root,snap,'/guide','base-family','independent',self.root/'reports/continuation-admission.json',failure)
        report=self.put('reports/continuation-r1-review.json',self.report(fixed,'FAIL'))
        p.record(self.root,report)
        return fixed,report

    def continuation_incident(self, word='corrected candidate', alias='recorded-continuation'):
        first,report=self.continuation_r1()
        self.snap=self.snapshot(word);self.snap['manifest']['jobId']=alias
        self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'})
        self.snapshot_path=self.put('reports/continuation-r2.json',self.snap)
        # Reproduce the old bug only in this isolated synthetic journal.
        with p.Journal(self.root,'https://example.com','/guide') as j:
            original=j.cycle['cycleId'];badcycle='synthetic-accidental-cycle'
            bad={'version':p.VERSION,'identity':j.identity,'cycleId':badcycle,'jobId':alias,
                 'number':1,'provisionalProfile':'high','maximumRounds':2,'snapshot':p.reference(self.root,self.snapshot_path),
                 'fingerprint':self.snap['routes'][0]['fingerprint'],'author':'writer','reviewer':'independent','policySha256':p.policy_hash(self.root)}
            out=self.put('reports/accidental-admission.json',bad);badref=p.reference(self.root,out)
            j.append('published',{'cycleId':original,'release':'auto-closed-prior-run','supersededByJobId':alias})
            j.append('begin',{'cycleId':badcycle,'jobId':alias,'profile':'high'})
            j.append('reserve',{'number':1,'admission':badref,'fingerprint':bad['fingerprint'],'reviewer':'independent'})
            before=j.path.read_bytes();journal_path=j.path
        incident=self.put('reports/continuation-incident.json',{'syntheticFixture':True,'contentReviewStarted':False,
            'currentUIObserved':False,'verdictRecorded':False,'admission':badref,'snapshot':bad['snapshot'],
            'originalReview':p.reference(self.root,report),'journal':p.reference(self.root,journal_path)})
        return badref,incident,before,journal_path

    def test_recorded_alias_reserves_true_second_round_without_autoclose(self):
        self.continuation_r1();self.snap=self.snapshot('next corrected candidate')
        self.snap['manifest']['jobId']='recorded-continuation';self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'})
        snap=self.put('reports/next.json',self.snap)
        admission=p.reserve(self.root,snap,'/guide','recorded-continuation','independent',self.root/'reports/true-r2.json')
        self.assertEqual((admission['jobId'],admission['continuationJobId'],admission['number']),('base-family','recorded-continuation',2))
        with p.Journal(self.root,'https://example.com','/guide') as j:
            self.assertEqual(len(j.cycles),1);self.assertFalse(any(e['kind']=='published' for e in j.events))

    def test_unused_continuation_recovery_preserves_events_r1_and_real_r2_validation(self):
        bad,incident,before,path=self.continuation_incident()
        fixed=p.recover_continuation(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',self.root/'reports/recovered-r2.json',incident)
        self.assertTrue(path.read_bytes().startswith(before));self.assertEqual(len(path.read_bytes().splitlines()),8)
        self.assertEqual((fixed['number'],fixed['maximumRounds'],fixed['jobId']),(2,2,'base-family'))
        self.assertEqual(fixed['continuationRecoveryOf'],bad)
        with p.Journal(self.root,'https://example.com','/guide') as j:
            self.assertEqual([r['status'] for r in j.cycle['rounds']],['complete','pending'])
            self.assertEqual(j.cycle['rounds'][0]['verdict'],'FAIL')
            self.assertEqual(j.cycles[1]['status'],'superseded-continuation-incident')
        # Exact retry after checkpoint uncertainty resumes, not another reserve/event.
        same=p.recover_continuation(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',self.root/'reports/unused-output.json',incident)
        self.assertEqual(same['admissionArtifact'],fixed['admissionArtifact']);self.assertEqual(len(path.read_bytes().splitlines()),8)
        report=self.report(fixed,'PASS');report_path=self.put('reports/actual-recovered-r2.json',report)
        result=p.record(self.root,report_path)
        self.assertEqual(result[0]['round'],2);self.assertEqual(result[0]['roundsRemaining'],0)
        self.assertTrue(p.check_rendered(self.root,self.snap,report))
        archived=p.sources(self.root,report_path)['paths'];self.assertTrue(any(Path(x).name==incident.name for x in archived))
        with self.assertRaises(ValueError):p.reserve(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',self.root/'reports/third.json')

    def test_continuation_recovery_recomputes_high_risk_without_extra_budget(self):
        bad,incident,_,_=self.continuation_incident('HIPAA terminology')
        fixed=p.recover_continuation(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',self.root/'reports/high-r2.json',incident)
        self.assertEqual(fixed['provisionalProfile'],'high');self.assertEqual(fixed['maximumRounds'],2)

    def test_continuation_recovery_rejects_wrong_owner_stale_capture_and_incident(self):
        bad,incident,before,path=self.continuation_incident()
        for job,reviewer in [('different-family','independent'),('recorded-continuation','other-reviewer')]:
            with self.assertRaises(ValueError):p.recover_continuation(self.root,self.snapshot_path,'/guide',job,reviewer,self.root/'reports/no-owner.json',incident)
        changed=self.put('reports/changed-snapshot.json',self.snapshot('another capture'))
        with self.assertRaises(ValueError):p.recover_continuation(self.root,changed,'/guide','recorded-continuation','independent',self.root/'reports/no-snapshot.json',incident)
        doc=p.read(incident);doc['contentReviewStarted']=True;incident.write_text(json.dumps(doc))
        with self.assertRaises(ValueError):p.recover_continuation(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',self.root/'reports/no-incident.json',incident)
        self.assertEqual(path.read_bytes(),before)

    def test_continuation_recovery_rejects_recorded_accidental_cycle(self):
        bad,incident,_,path=self.continuation_incident()
        value=p.read(self.root/bad['path']);value['admissionArtifact']=bad
        p.record(self.root,self.put('reports/accidental-actual-review.json',self.report(value,'FAIL')))
        before=path.read_bytes()
        with self.assertRaises(ValueError):p.recover_continuation(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',self.root/'reports/no-recorded.json',incident)
        self.assertEqual(path.read_bytes(),before)

    def test_continuation_recovery_rejects_genuinely_published_accidental_cycle(self):
        bad,incident,_,path=self.continuation_incident()
        value=p.read(self.root/bad['path']);value['admissionArtifact']=bad
        report=self.report(value,'PASS');p.record(self.root,self.put('reports/actual-accidental-pass.json',report))
        p.mark_published(self.root,self.snap,report,'a'*40,{'commit':'a'*40,'status':'live',
            'verifiedAt':'2026-11-08T12:00:00+00:00','evidenceUrl':'https://example.com/synthetic-publication'})
        before=path.read_bytes()
        with self.assertRaises(ValueError):
            p.recover_continuation(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',self.root/'reports/no-published-recovery.json',incident)
        self.assertEqual(path.read_bytes(),before)

    def test_continuation_recovery_rejects_unrecorded_alias(self):
        bad,incident,before,path=self.continuation_incident(alias='unrecorded-lookalike')
        with self.assertRaisesRegex(ValueError,'exact previously recorded'):
            p.recover_continuation(self.root,self.snapshot_path,'/guide','unrecorded-lookalike','independent',self.root/'reports/no-alias.json',incident)
        self.assertEqual(path.read_bytes(),before)

    def test_recovered_continuation_r2_release_and_live_close_preserve_original_cycle(self):
        for verdict in ['PASS','FAIL']:
            with self.subTest(verdict=verdict):
                f=Tests();f.setUp();self.addCleanup(f.doCleanups)
                f.config.update(releaseAtAuditLimit=True,canonicalHosts=['example.com']);f.put(p.CONFIG,f.config)
                bad,incident,before,path=f.continuation_incident()
                original_snapshot=f.snapshot_path.read_bytes()
                fixed=p.recover_continuation(f.root,f.snapshot_path,'/guide','recorded-continuation','independent',f.root/'reports/final-r2-admission.json',incident)
                report=f.report(fixed,verdict)
                if verdict=='FAIL':
                    report['routes'][0]['checks']['wholePageCoherence']['status']='FAIL'
                    report['routes'][0]['factualReview']['seoQuality']['status']='FAIL'
                result=p.record(f.root,f.put('reports/final-r2-review.json',report))
                self.assertEqual(result[0]['round'],2);self.assertEqual(result[0]['roundsRemaining'],0)
                self.assertEqual(result[0]['disposition'],'publish' if verdict=='PASS' else 'publish-at-audit-limit')
                self.assertEqual(fixed['jobId'],'base-family');self.assertEqual(fixed['continuationJobId'],'recorded-continuation')
                self.assertEqual(f.snap['manifest']['jobId'],'recorded-continuation')
                self.assertTrue(p.check_rendered(f.root,f.snap,report))
                # Synthetic host evidence only; exercises the exact native callback
                # used by rendered-audit.py record-deployment after real live compare.
                p.mark_published(f.root,f.snap,report,'a'*40,{'commit':'a'*40,'status':'live',
                    'verifiedAt':'2026-11-08T12:00:00+00:00','evidenceUrl':'https://example.com/synthetic-host-proof'})
                with p.Journal(f.root,'https://example.com','/guide') as j:
                    self.assertEqual(j.cycle['cycleId'],fixed['cycleId']);self.assertEqual(j.cycle['status'],'published')
                    self.assertEqual(j.cycle['rounds'][0]['verdict'],'FAIL');self.assertEqual(len(j.cycle['rounds']),2)
                    self.assertEqual(j.events[-1]['data']['cycleId'],fixed['cycleId'])
                    self.assertEqual(j.cycles[1]['status'],'superseded-continuation-incident')
                self.assertTrue(path.read_bytes().startswith(before));self.assertEqual(f.snapshot_path.read_bytes(),original_snapshot)
                for job in ['base-family','recorded-continuation']:
                    with self.assertRaisesRegex(ValueError,'published job'):
                        p.reserve(f.root,f.snapshot_path,'/guide',job,'independent',f.root/('reports/no-reset-'+job+'.json'))

    def test_historical_capture_only_continues_exact_open_preceding_policy(self):
        self.continuation_r1();old_hash=p.policy_hash(self.root)
        self.snap=self.snapshot('next candidate');self.snap['manifest']['jobId']='recorded-continuation'
        self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'})
        snap=self.put('reports/historical-next.json',self.snap)
        self.config['compatiblePolicies']=[{'sha256':old_hash,'commit':'a'*40,'reason':'Synthetic mechanical-only change preserving the exact original policy and budget.'}];self.put(p.CONFIG,self.config)
        wrong=copy.deepcopy(self.snap);wrong['contentReviewPolicy']['sha256']='b'*64;wrong['snapshotSha256']=render.digest({k:v for k,v in wrong.items() if k!='snapshotSha256'})
        self.config['compatiblePolicies'].append({'sha256':'b'*64,'commit':'b'*40,'reason':'Synthetic unrelated historical policy is not the preceding native admission.'});self.put(p.CONFIG,self.config)
        with self.assertRaisesRegex(ValueError,'active review policy'):p.reserve(self.root,self.put('reports/wrong-hash.json',wrong),'/guide','recorded-continuation','independent',self.root/'reports/no-hash.json')
        with self.assertRaisesRegex(ValueError,'active review policy'):p.reserve(self.root,snap,'/guide','different-family','independent',self.root/'reports/no-family.json')
        cross=copy.deepcopy(self.snap);cross['manifest']['jobId']='different-family'
        cross['snapshotSha256']=render.digest({k:v for k,v in cross.items() if k!='snapshotSha256'})
        with self.assertRaisesRegex(ValueError,'active review policy'):
            p.reserve(self.root,self.put('reports/cross-family-capture.json',cross),'/guide','recorded-continuation','independent',self.root/'reports/no-cross-capture.json')
        adm=p.reserve(self.root,snap,'/guide','recorded-continuation','independent',self.root/'reports/current-admission.json')
        self.assertEqual(adm['number'],2);self.assertEqual(adm['policySha256'],p.policy_hash(self.root));self.assertNotEqual(adm['policySha256'],old_hash)

    def test_real_publication_cannot_reopen_recorded_continuation(self):
        fixed,_=self.continuation_r1();report=self.report(fixed,'PASS')
        # Use the true second slot, then genuinely close that exact cycle.
        adm=p.reserve(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',self.root/'reports/publish-r2.json')
        report=self.report(adm,'PASS');p.record(self.root,self.put('reports/publish-review.json',report))
        p.mark_published(self.root,self.snap,report,'a'*40,{'commit':'a'*40,'status':'live','verifiedAt':'2026-11-08T12:00:00+00:00','evidenceUrl':'https://example.com/proof'})
        with self.assertRaisesRegex(ValueError,'published job'):p.reserve(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',self.root/'reports/no-reset.json')

    def test_genuine_different_stale_job_auto_close_is_unchanged(self):
        self.continuation_r1()
        with p.Journal(self.root,'https://example.com','/guide') as j:rel=str(j.path.relative_to(self.root))
        subprocess.run(['git','add','--',rel],cwd=self.root,check=True,capture_output=True)
        subprocess.run(['git','-c','user.name=fixture','-c','user.email=fixture@example.com','commit','-qm','Synthetic committed prior cycle'],cwd=self.root,check=True,capture_output=True)
        self.snap=self.snapshot('genuinely different job');self.snap['manifest']['jobId']='other-job'
        self.snap['snapshotSha256']=render.digest({k:v for k,v in self.snap.items() if k!='snapshotSha256'})
        adm=p.reserve(self.root,self.put('reports/other-job.json',self.snap),'/guide','other-job','independent',self.root/'reports/other-admission.json')
        self.assertEqual(adm['number'],1)
        with p.Journal(self.root,'https://example.com','/guide') as j:
            self.assertEqual(len(j.cycles),2);self.assertEqual(j.cycle['jobId'],'other-job')

    def test_recovery_checkpoint_failure_retries_once_and_restores_original_family(self):
        bad,incident,before,path=self.continuation_incident()
        remote=self.root/'remote.git';subprocess.run(['git','init','--bare','-q',str(remote)],check=True)
        subprocess.run(['git','remote','add','origin',str(remote)],cwd=self.root,check=True)
        self.put('.claude/tools/workflow-control-store.py',Path(__file__).with_name('workflow-control-store.py').read_text())
        durable=load('continuation_durable_fixture','content-review-durable.py')
        out=self.root/'reports/recovered-with-checkpoint.json'
        with mock.patch.object(p,'durable_reviews',return_value=durable):
            with mock.patch.object(durable,'checkpoint',side_effect=ValueError('Synthetic checkpoint unavailable after append')):
                with self.assertRaisesRegex(ValueError,'checkpoint unavailable'):
                    p.recover_continuation(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',out,incident)
            self.assertTrue(path.read_bytes().startswith(before));self.assertEqual(len(path.read_bytes().splitlines()),8)
            fixed=p.recover_continuation(self.root,self.snapshot_path,'/guide','recorded-continuation','independent',out,incident)
        self.assertEqual(fixed['number'],2);self.assertEqual(len(path.read_bytes().splitlines()),8)
        fresh=self.root/'restored';fresh.mkdir();subprocess.run(['git','init','-q',str(fresh)],check=True)
        subprocess.run(['git','remote','add','origin',str(remote)],cwd=fresh,check=True)
        for name in [p.CONFIG,p.CONTRACT,'.claude/tools/workflow-control-store.py']:
            target=fresh/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes((self.root/name).read_bytes())
        journal=p.Journal(fresh,'https://example.com','/guide');durable.restore(fresh,journal)
        with journal as restored:
            self.assertEqual(len(restored.events),8);self.assertEqual(restored.cycle['jobId'],'base-family')
            self.assertEqual([r['status'] for r in restored.cycle['rounds']],['complete','pending'])
            self.assertEqual(restored.cycle['rounds'][0]['verdict'],'FAIL')

    def test_historical_reconstruction_copies_exact_optional_helper_from_commit(self):
        helper='.claude/tools/approved-link-audit-scope.py';old=b'Synthetic historical optional helper bytes\n'
        self.put('.claude/workflow-policy.local.json',{})
        self.put(helper,old.decode())
        self.put('.claude/tools/workflow-local.py',
                 "import hashlib\ndef policy_hash(root):\n return hashlib.sha256((root/'.claude/tools/approved-link-audit-scope.py').read_bytes()).hexdigest()\n")
        subprocess.run(['git','add','--','.claude'],cwd=self.root,check=True,capture_output=True)
        subprocess.run(['git','-c','user.name=fixture','-c','user.email=fixture@example.com','commit','-qm','Synthetic historical policy'],cwd=self.root,check=True,capture_output=True)
        commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=self.root,text=True).strip()
        self.put(helper,'Changed current optional helper bytes')
        self.assertEqual(p.historical_policy_hash(self.root,commit),p.sha(old))

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


class ReleaseGateTests(Tests):
    """Authority snapshots, exact compositions, policy migration and record-time proof."""

    def two_route_snapshot(self, guide_word):
        s=self.snapshot(guide_word)
        spec={'path':'/other','expectedUpdatedDate':'2026-10-27','claimCategories':['ordinary']}
        s['manifest']['routes'].append(spec)
        s['routes'].append(render.parse(fixtures.HTML.replace('/guide','/other'),spec,'http://localhost:3000','https://example.com'))
        s['snapshotSha256']=render.digest({k:v for k,v in s.items() if k!='snapshotSha256'})
        return s

    def assess(self, page):
        return self.assessment(page['semantic'])

    def row(self, page, admission, verdict):
        rr=fixtures.Tests().review(self.snap)['routes'][0]
        rr.update(path=page['path'],fingerprint=page['fingerprint'],verdict=verdict,reviewProfile=self.config['defaultProfile'],
                  riskAssessment=self.assess(page),reviewBudget=admission['admissionArtifact'])
        rr['factualReview']={k:{'status':'PASS','evidence':'Synthetic fixture evidence exercising validation only; it is never a production review.'}
                             for k in p.FACTS[rr['reviewProfile']]+['riskClassification','seoQuality']}
        return rr

    def report_for(self, snapshot, rows):
        return {'reviewer':'independent','snapshotSha256':snapshot['snapshotSha256'],'routes':rows}

    def recorded_pair(self):
        """/guide FAIL + /other PASS on snapshot two, then /guide PASS alone on snapshot three."""
        two=self.two_route_snapshot('old');path2=self.put('reports/s2.json',two)
        a=p.reserve(self.root,path2,'/guide','fixture-job','independent',self.root/'reports/a-guide-1.json')
        b=p.reserve(self.root,path2,'/other','fixture-job','independent',self.root/'reports/a-other-1.json')
        r2=self.report_for(two,[self.row(two['routes'][0],a,'FAIL'),self.row(two['routes'][1],b,'PASS')])
        r2path=self.put('reports/r2.json',r2);p.record(self.root,r2path)
        three=self.two_route_snapshot('new');path3=self.put('reports/s3.json',three)
        c=p.reserve(self.root,path3,'/guide','fixture-job','independent',self.root/'reports/a-guide-2.json')
        self.snap=three
        r3=self.report_for(three,[self.row(three['routes'][0],c,'PASS')])
        r3path=self.put('reports/r3.json',r3);p.record(self.root,r3path)
        return three,path3,r3path,two,path2,r2path

    def composition(self, three_path, r3path, two_path, r2path, bindings=None):
        groups=[{'snapshot':self.root/three_path.name if False else three_path,'review':r3path,'routes':['/guide']},
                {'snapshot':two_path,'review':r2path,'routes':['/other']}]
        return groups

    # -- the actual validator integration defect -------------------------------------------------
    def test_projection_survives_reserialised_key_order(self):
        self.set_level('light');s=self.snapshot('Order fixture')
        for page in s['routes']:
            page['semantic']['meta']={'zulu':'Zulu statement for readers','alpha':'Alpha statement for readers'}
            page['fingerprint']=render.digest(page['semantic'])
        s['snapshotSha256']=render.digest({k:v for k,v in s.items() if k!='snapshotSha256'});self.snap=s
        path=self.put('reports/order-snapshot.json',s)
        admission=p.reserve(self.root,path,'/guide','fixture-job','independent',self.root/'reports/order-admission.json')
        rr=self.row(s['routes'][0],admission,'PASS');report=self.report_for(s,[rr])
        review_path=self.put('reports/order-review.json',report);p.record(self.root,review_path)
        out_s=self.root/'reports/order-projected.json';out_r=self.root/'reports/order-projected-review.json'
        p.project(self.root,path,review_path,['/guide'],out_s,out_r)
        projected=p.read(out_s)
        # Precondition for the historical bug: a canonical re-save sorts keys, so claim_text changes.
        self.assertNotEqual(p.claim_text(s['routes'][0]['semantic']),p.claim_text(projected['routes'][0]['semantic']))
        self.assertEqual(s['routes'][0]['semantic'],projected['routes'][0]['semantic'])
        self.assertTrue(p.check_rendered(self.root,projected,p.read(out_r)))

    # -- composition ---------------------------------------------------------------------------
    def test_separately_recorded_passes_compose_into_one_exact_publication(self):
        three,path3,r3path,two,path2,r2path=self.recorded_pair()
        groups=[{'snapshot':path3,'review':r3path,'routes':['/guide']},{'snapshot':path2,'review':r2path,'routes':['/other']}]
        out=self.root/'reports/composite-review.json'
        result=p.compose(self.root,path3,groups,None,out);self.assertIn('no new audit',result['scope'])
        composite=p.read(out)
        self.assertEqual(composite['routes'],[p.read(r3path)['routes'][0],p.read(r2path)['routes'][1]])
        self.assertTrue(p.check_rendered(self.root,three,composite))
        before=p.digest(p.read(r2path))
        host={'commit':'b'*40,'status':'live','verifiedAt':'2026-11-09T12:00:00+00:00','evidenceUrl':'https://example.com/synthetic-host'}
        p.mark_published(self.root,three,composite,'b'*40,host)
        for route in ['/guide','/other']:
            with p.Journal(self.root,'https://example.com',route) as journal:self.assertEqual(journal.cycle['status'],'published')
        self.assertEqual(before,p.digest(p.read(r2path)),'Recorded PASS digests must stay unchanged')
        paths=p.sources(self.root,out)['paths']
        self.assertIn('reports/r2.json',paths);self.assertIn('reports/r3.json',paths);self.assertIn('reports/s2.json',paths)

    def test_cross_batch_or_cross_round_distinct_admitted_actors_compose_cleanly(self):
        s_b1=self.two_route_snapshot('b1');s_b1['manifest']['author']='writer-b1'
        s_b1['snapshotSha256']=render.digest({k:v for k,v in s_b1.items() if k!='snapshotSha256'})
        p_b1=self.put('reports/s-b1.json',s_b1)
        adm_b1=p.reserve(self.root,p_b1,'/guide','fixture-job','auditor-b1',self.root/'reports/adm-b1.json')
        rep_b1=self.report_for(s_b1,[self.row(s_b1['routes'][0],adm_b1,'PASS')])
        rep_b1['reviewer']='auditor-b1'
        r_b1=self.put('reports/r-b1.json',rep_b1)
        p.record(self.root,r_b1)

        s_b2=self.two_route_snapshot('b1');s_b2['manifest']['author']='writer-b2'
        s_b2['snapshotSha256']=render.digest({k:v for k,v in s_b2.items() if k!='snapshotSha256'})
        p_b2=self.put('reports/s-b2.json',s_b2)
        adm_b2=p.reserve(self.root,p_b2,'/other','fixture-job','auditor-b2',self.root/'reports/adm-b2.json')
        rep_b2=self.report_for(s_b2,[self.row(s_b2['routes'][1],adm_b2,'PASS')])
        rep_b2['reviewer']='auditor-b2'
        r_b2=self.put('reports/r-b2.json',rep_b2)
        p.record(self.root,r_b2)

        groups=[{'snapshot':p_b1,'review':r_b1,'routes':['/guide']},{'snapshot':p_b2,'review':r_b2,'routes':['/other']}]
        out=self.root/'reports/composite-multi-batch.json'
        p.compose(self.root,p_b2,groups,None,out)
        self.assertTrue(p.check_rendered(self.root,s_b2,p.read(out)))

    def test_composition_fails_closed_on_forged_or_unreviewed_pages(self):
        three,path3,r3path,two,path2,r2path=self.recorded_pair()
        good=[{'snapshot':path3,'review':r3path,'routes':['/guide']},{'snapshot':path2,'review':r2path,'routes':['/other']}]
        out=lambda n:self.root/('reports/bad-'+n+'.json')
        with self.assertRaisesRegex(ValueError,'recorded independent PASS'):   # /guide FAILed in report two
            p.compose(self.root,path3,[{'snapshot':path2,'review':r2path,'routes':['/guide','/other']}],None,out('failed'))
        changed=self.two_route_snapshot('new');spec=changed['manifest']['routes'][1]
        changed['routes'][1]=render.parse(fixtures.HTML.replace('/guide','/other').replace('Useful','Altered after review'),spec,'http://localhost:3000','https://example.com')
        changed['snapshotSha256']=render.digest({k:v for k,v in changed.items() if k!='snapshotSha256'})
        changed_path=self.put('reports/changed-snapshot.json',changed)
        with self.assertRaisesRegex(ValueError,'differs from the page'):       # /other was edited after its independent review
            p.compose(self.root,changed_path,good,None,out('old'))
        with self.assertRaisesRegex(ValueError,'cover every route'):
            p.compose(self.root,path3,good[:1],None,out('partial'))
        with self.assertRaisesRegex(ValueError,'cover every route|unknown or duplicated'):
            p.compose(self.root,path3,good+[{'snapshot':path3,'review':r3path,'routes':['/guide']}],None,out('dup'))
        forged=p.read(r2path);forged['reviewer']='someone-else';forged_path=self.put('reports/forged-reviewer.json',forged)
        with self.assertRaisesRegex(ValueError,'one independent reviewer'):
            p.compose(self.root,path3,[good[0],{'snapshot':path2,'review':forged_path,'routes':['/other']}],None,out('reviewer'))
        composite=p.read(self.root/'reports/composite-ok.json') if False else None
        p.compose(self.root,path3,good,None,out('ok'));composite=p.read(out('ok'))
        changed=copy.deepcopy(composite);changed['routes'][1]['factualReview']['centralFacts']['evidence']='A fabricated replacement for the real independent evidence record.'
        with self.assertRaisesRegex(ValueError,'exact recorded review row'):p.check_rendered(self.root,three,changed)
        extra=copy.deepcopy(composite);extra['workflowPolicySha256']='0'*64
        with self.assertRaisesRegex(ValueError,'only join exact'):p.check_rendered(self.root,three,extra)

    # -- policy migration --------------------------------------------------------------------------
    def test_listed_earlier_policy_hash_keeps_recorded_reviews_valid_but_never_new_ones(self):
        admission=self.reserve(1);report=self.report(admission,'PASS');p.record(self.root,self.put('reports/old-policy-review.json',report))
        old=p.policy_hash(self.root)
        self.put(p.CONTRACT,'Synthetic fixture policy edited later; hash must change.')
        with self.assertRaisesRegex(ValueError,'active review policy'):p.check_rendered(self.root,self.snap,report)
        self.config['compatiblePolicies']=[{'sha256':old,'commit':'a'*40,'reason':'Synthetic fixture: policy edited after this review was admitted and recorded.'}]
        self.put(p.CONFIG,self.config)
        self.assertTrue(p.check_rendered(self.root,self.snap,report))
        with self.assertRaisesRegex(ValueError,'Capture the current'):   # new reservations need the current hash
            p.reserve(self.root,self.snapshot_path,'/guide','other-job','independent',self.root/'reports/never.json')
        self.config['compatiblePolicies']=[{'sha256':'not-a-hash','commit':'a'*40,'reason':'x'}]
        with self.assertRaisesRegex(ValueError,'Invalid compatible'):
            self.put(p.CONFIG,self.config);p.policy(self.root)

    # -- record cannot strand a partial report ---------------------------------------------------
    def test_record_validates_every_page_before_appending_any(self):
        two=self.two_route_snapshot('atomic');path=self.put('reports/atomic.json',two)
        a=p.reserve(self.root,path,'/guide','fixture-job','independent',self.root/'reports/atomic-a.json')
        b=p.reserve(self.root,path,'/other','fixture-job','independent',self.root/'reports/atomic-b.json')
        self.snap=two
        rows=[self.row(two['routes'][0],a,'PASS'),self.row(two['routes'][1],b,'PASS')]
        rows[1]['factualReview']['centralFacts']['evidence']='short'
        with self.assertRaisesRegex(ValueError,'Missing real factual-review evidence'):
            p.record(self.root,self.put('reports/atomic-review.json',self.report_for(two,rows)))
        for route in ['/guide','/other']:
            with p.Journal(self.root,'https://example.com',route) as journal:
                self.assertEqual([r['status'] for r in journal.cycle['rounds']],['pending'])
        rows[1]=self.row(two['routes'][1],b,'PASS')
        done=p.record(self.root,self.put('reports/atomic-review-fixed.json',self.report_for(two,rows)))
        self.assertEqual([x['verdict'] for x in done],['PASS','PASS'])

    # -- Layer3 release proof ------------------------------------------------------------------
    def fake_layer(self, tamper=None):
        def historical_delivery(root, directory):
            manifest=p.read(directory/'manifest.json')
            if tamper:manifest.update(tamper.get(directory.name,{}))
            return manifest,{}
        return types.SimpleNamespace(historical_delivery=historical_delivery,ROLES={'write':'writer','audit':'independent-reviewer'},
                                     policy_hash=lambda _root:'p'*64,evidence_ref=lambda _root,ref:p.artifact(self.root,ref),
                                     validate=lambda _root,directory:p.read(directory/'manifest.json'))

    def bundles(self, job='fixture-job'):
        self.put('reports/handoff.json',{'jobId':job})
        evidence=p.reference(self.root,self.put('reports/bundle-evidence.json',{'fixture':True}))
        common={'policySha256':'p'*64,'runId':'run-1','handoff':'reports/handoff.json','files':{evidence['path']:evidence['sha256']}}
        writer=self.put('reports/bundle-writer/manifest.json',{**common,'phase':'write','role':'writer','actor':'writer'})
        reviewer=self.put('reports/bundle-reviewer/manifest.json',{**common,'phase':'audit','role':'independent-reviewer','actor':'independent'})
        return {'policyCommit':'c'*40,'workflowPolicySha256':'p'*64,'writer':p.reference(self.root,writer),'reviewer':p.reference(self.root,reviewer)}

    def test_release_bindings_verify_actor_policy_job_and_sources_or_fail_closed(self):
        bound=self.bundles()
        with mock.patch.object(p,'historical_policy_hash',return_value='p'*64):
            p.verify_release_bindings(self.root,self.snap,'independent',{'fixture-job'},bound,self.fake_layer())
            with self.assertRaisesRegex(ValueError,'Missing writer/reviewer'):
                p.verify_release_bindings(self.root,self.snap,'independent',{'fixture-job'},{},self.fake_layer())
            with self.assertRaisesRegex(ValueError,'different canonical job'):
                p.verify_release_bindings(self.root,self.snap,'independent',{'another-job'},bound,self.fake_layer())
            with self.assertRaisesRegex(ValueError,'different actor or role'):
                p.verify_release_bindings(self.root,self.snap,'someone-else',{'fixture-job'},bound,self.fake_layer())
            with self.assertRaisesRegex(ValueError,'different workflow policy'):
                p.verify_release_bindings(self.root,self.snap,'independent',{'fixture-job'},bound,
                                          self.fake_layer({'bundle-writer':{'policySha256':'q'*64}}))
            with self.assertRaisesRegex(ValueError,'different invocations'):
                p.verify_release_bindings(self.root,self.snap,'independent',{'fixture-job'},bound,
                                          self.fake_layer({'bundle-writer':{'runId':'run-2'}}))
            (self.root/'reports/bundle-evidence.json').write_text('{"fixture": false}')
            with self.assertRaisesRegex(ValueError,'Bundle evidence changed|changed or missing'):
                p.verify_release_bindings(self.root,self.snap,'independent',{'fixture-job'},bound,self.fake_layer())
        with mock.patch.object(p,'historical_policy_hash',return_value='z'*64):
            with self.assertRaisesRegex(ValueError,'not the policy at its named commit'):
                p.verify_release_bindings(self.root,self.snap,'independent',{'fixture-job'},self.bundles(),self.fake_layer())

    def test_a_pass_without_release_proof_cannot_be_recorded_on_layer3(self):
        admission=self.reserve(1);report=self.report(admission,'PASS')
        layer=self.fake_layer()
        with mock.patch.object(p,'local_module',return_value=layer):
            with self.assertRaisesRegex(ValueError,'must bind current local review policy'):
                p.record(self.root,self.put('reports/no-proof.json',report))
            with p.Journal(self.root,'https://example.com','/guide') as journal:
                self.assertEqual([r['status'] for r in journal.cycle['rounds']],['pending'])   # round not spent
            report['releaseBindings']=self.bundles()
            with mock.patch.object(p,'historical_policy_hash',return_value='p'*64):
                self.assertEqual(p.record(self.root,self.put('reports/with-proof.json',report))[0]['verdict'],'PASS')


for _name in [n for n in dir(Tests) if n.startswith('test_') and n not in ReleaseGateTests.__dict__]:
    setattr(ReleaseGateTests,_name,None)   # inherited fixtures only; do not run the base tests twice


class HistoricalMixedSnapshotSourcesTests(unittest.TestCase):
    """Synthetic filesystem evidence only; never a real review or permission."""
    def setUp(self):
        temp=tempfile.TemporaryDirectory();self.addCleanup(temp.cleanup)
        self.root=Path(temp.name).resolve()
        def save(name,value):
            path=self.root/'reports'/name;path.parent.mkdir(parents=True,exist_ok=True)
            path.write_text(json.dumps(value) if not isinstance(value,str) else value)
            return p.reference(self.root,path)
        self.save=save
        self.old_page=save('old-guide.html','old exact guide bytes')
        self.current_page=save('current-guide.html','current exact guide bytes')
        self.current_other=save('current-other.html','current unrelated route bytes')
        def page(route,ref):
            return {'path':route,'htmlFile':ref['path'],'htmlSha256':ref['sha256']}
        self.page=page
        self.old={'routes':[page('/guide',self.old_page),
            page('/unrelated',{'path':'reports/unavailable-old-other.html','sha256':'a'*64})]}
        self.current={'routes':[page('/guide',self.current_page),page('/unrelated',self.current_other)]}
        self.journal_path=self.root/'reports/journal.jsonl';self.journal_path.write_text('synthetic fixture')

    def export(self,kind='reserve',closed_cycle=False):
        current=self.save('current-snapshot.json',self.current)
        old=self.save('old-snapshot.json',self.old)
        identity={'canonicalBase':'https://example.com'}
        admission=self.save('current-admission.json',{'identity':identity,'snapshot':current})
        old_admission=self.save('old-admission.json',{'identity':identity,'snapshot':old})
        data={'admission':old_admission}
        if kind=='repair-pending':
            data.update(failureEvidence=self.save('failure.json',{'kind':'synthetic'}),invalidatedReferences=[])
        events=[{'kind':kind,'data':data}]
        if closed_cycle:
            events=[{'kind':'begin','data':{'cycleId':'old'}},*events,
                {'kind':'begin','data':{'cycleId':'current'}},
                {'kind':'reserve','data':{'admission':admission}}]
        journal=types.SimpleNamespace(path=self.journal_path,events=events)
        context=mock.MagicMock();context.__enter__.return_value=journal
        report=self.save('review.json',{'routes':[{'path':'/guide','reviewBudget':admission}]})
        with mock.patch.object(p,'Journal',return_value=context),mock.patch.object(p,'saved_applications',return_value=None):
            return p.sources(self.root,self.root/report['path'])['paths']

    def test_retains_exact_historical_snapshot_and_selected_route_bytes(self):
        for kind in ['reserve','repair-pending']:
            with self.subTest(kind=kind):
                paths=self.export(kind)
                self.assertIn('reports/old-snapshot.json',paths)
                self.assertIn(self.old_page['path'],paths)
                self.assertIn(self.current_other['path'],paths)
                self.assertNotIn('reports/unavailable-old-other.html',paths)

    def test_historical_selected_route_must_exist_exactly_once(self):
        for pages in [[],[self.old['routes'][0],self.old['routes'][0]]]:
            self.old['routes']=pages
            with self.assertRaisesRegex(ValueError,'Historical snapshot must contain the exact journal route'):
                self.export()

    def test_missing_or_changed_selected_historical_html_remains_blocked(self):
        target=self.root/self.old_page['path'];target.write_text('changed')
        with mock.patch.object(p.subprocess,'run',return_value=types.SimpleNamespace(returncode=1,stdout=b'')):
            with self.assertRaisesRegex(ValueError,'Review artifact changed or missing'):
                self.export()
            target.unlink()
            with self.assertRaisesRegex(ValueError,'Review artifact changed or missing'):
                self.export()

    def test_current_snapshot_still_requires_every_route_html(self):
        (self.root/self.current_other['path']).unlink()
        with mock.patch.object(p.subprocess,'run',return_value=types.SimpleNamespace(returncode=1,stdout=b'')):
            with self.assertRaisesRegex(ValueError,'Review artifact changed or missing'):
                self.export()

    def test_closed_cycle_metadata_and_counters_remain_without_html_availability_claim(self):
        (self.root/self.old_page['path']).unlink()
        for kind in ['reserve','repair-pending']:
            with self.subTest(kind=kind):
                paths=self.export(kind,closed_cycle=True)
                self.assertIn('reports/old-admission.json',paths)
                self.assertIn('reports/old-snapshot.json',paths)
                self.assertIn('reports/journal.jsonl',paths)
                self.assertIn(self.current_page['path'],paths)
                self.assertNotIn(self.old_page['path'],paths)


if __name__=='__main__':unittest.main()
