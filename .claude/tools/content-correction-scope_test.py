"""Synthetic correction fixtures only; no real content or editorial approvals."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest
from unittest import mock


def load(name,file):
    spec=importlib.util.spec_from_file_location(name,Path(__file__).with_name(file));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m


s=load('scope_test','content-correction-scope.py')
b=load('scope_budget_fixtures','content-review-policy_test.py')
p=b.p;r=b.render


class Tests(unittest.TestCase):
    def setUp(self):
        self.f=b.Tests();self.f.setUp();self.addCleanup(self.f.doCleanups);self.root=self.f.root
        self.evidence=self.f.put('reports/original-evidence.json',{'source':'Synthetic primary-source fixture, not real research.'})
        self.before,self.before_path=self.capture('simlpe','before')
        admission=p.reserve(self.root,self.before_path,'/guide','fixture-job','independent',self.root/'reports/admission1.json')
        self.f.snap=self.before;self.old=self.f.report(admission)
        self.old['routes'][0]['checks']['wholePageCoherence']={'status':'FAIL','evidence':'Synthetic fixture: correct one spelling mistake; the completed other findings remain recorded.'}
        self.old_path=self.f.put('reports/old-review.json',self.old);p.record(self.root,self.old_path)

    def capture(self,word,name,extra=None):
        html=b.HTML.replace('Useful complete reader-facing content.','Useful '+word+' reader-facing content.',1)
        snap=b.RenderFixtures().snapshot(html);snap['capturedAt']=p.now()
        evidence=p.reference(self.root,self.evidence)
        snap['manifest'].update(workflowKind='mindmap-pass',reviewDependencies=[evidence])
        snap['manifest']['routes'][0].update(claimCategories=['ordinary'],correctionContentFiles=['content/guide.json'])
        self.f.put('content/guide.json',{'body':snap['routes'][0]['semantic']['text']})
        if extra:extra(snap)
        snap['contentReviewPolicy']={'version':p.VERSION,'sha256':p.policy_hash(self.root)}
        snap['correctionBoundary']=s.boundary(self.root,self.root/('reports/boundary-'+name+'.json'),snap['manifest'])
        snap['snapshotSha256']=r.digest({k:v for k,v in snap.items() if k!='snapshotSha256'})
        return snap,self.f.put('reports/'+name+'.json',snap)

    def prepare(self,extra=None,word='simple'):
        self.after,self.after_path=self.capture(word,'after',extra)
        self.proof=s.scope(self.root,self.before_path,self.old_path,self.after_path,'/guide')
        self.proof_path=self.f.put('reports/scope.json',self.proof);return self.proof

    def actual(self):
        admission=p.reserve(self.root,self.after_path,'/guide','fixture-job','independent',self.root/'reports/admission2.json')
        self.f.snap=self.after;report=self.f.report(admission,'PASS');row=report['routes'][0]
        row.update(correctionScope=p.reference(self.root,self.proof_path),carriedFactualChecks=self.proof['carryableFactualChecks'])
        for name in row['factualReview']:
            row['factualReview'][name]=copy.deepcopy(self.old['routes'][0]['factualReview'][name]) if name in row['carriedFactualChecks'] else {'status':'PASS','evidence':'Fresh synthetic correction evidence for '+name+': actual delta and unchanged context checked.'}
        row['checks']={name:{'status':'PASS','evidence':'Fresh synthetic full-render and SEO observation for '+name+' after this exact correction.'} for name in r.CHECKS}
        row['carriedRenderedChecks']=self.proof['carryableRenderedChecks']
        for name in row['carriedRenderedChecks']:row['checks'][name]=copy.deepcopy(self.old['routes'][0]['checks'][name])
        row['correctionReview']={name:{'status':'PASS','evidence':'Synthetic independent correction judgment for '+name+': the spelling change preserves the original meaning and evidence.'} for name in ['changedPassage','meaningAndScope','priorFindings','unchangedEvidence']}
        return report

    def test_spelling_recheck_carries_only_valid_factual_evidence_and_uses_round_two(self):
        proof=self.prepare();self.assertEqual(proof['mode'],'targeted',proof['reasons'])
        self.assertIn('currentDetails',proof['carryableFactualChecks']);self.assertNotIn('centralFacts',proof['carryableFactualChecks'])
        self.assertIn('sourceSupport',proof['carryableRenderedChecks']);self.assertNotIn('linksAndIndexability',proof['carryableRenderedChecks'])
        report=self.actual();s.validate(self.root,self.after,report)
        result=p.record(self.root,self.f.put('reports/new-review.json',report));self.assertEqual(result[0]['round'],2)
        s.validate(self.root,self.after,report)  # remains valid after recording
        with mock.patch.object(r,'__file__',str(self.root/'.claude/tools/rendered-audit.py')),mock.patch.object(r,'content_review_policy',return_value=p),mock.patch.object(r,'content_correction_scope',return_value=s):
            r.review_check(self.after,report)
        with self.assertRaisesRegex(ValueError,'budget exhausted'):
            p.reserve(self.root,self.after_path,'/guide','fixture-job','independent',self.root/'reports/no-third.json')

    def test_numeric_and_negation_changes_widen_review(self):
        for word in ['15','not','guaranteed','unsafe']:
            after,path=self.capture(word,'risky-'+word)
            proof=s.scope(self.root,self.before_path,self.old_path,path,'/guide')
            self.assertEqual(proof['mode'],'full')

    def test_metadata_and_links_need_full_affected_page_review(self):
        def extra(snap):
            snap['routes'][0]['semantic']['links'].append('https://example.com/new-destination')
            snap['routes'][0]['fingerprint']=r.digest(snap['routes'][0]['semantic'])
        self.assertEqual(self.prepare(extra)['mode'],'full')

    def test_shared_template_or_asset_changes_widen_review(self):
        self.f.put('src/components/Layout.tsx','Synthetic newly changed shared layout')
        proof=self.prepare();self.assertEqual(proof['mode'],'full');self.assertIn('src/components/Layout.tsx',proof['sourceChanges'])

    def test_missing_baseline_boundary_or_incomplete_review_never_carries(self):
        del self.before['correctionBoundary'];self.before['snapshotSha256']=r.digest({k:v for k,v in self.before.items() if k!='snapshotSha256'})
        # Removing evidence also invalidates the actual prior recorded review.
        self.before_path.write_text(json.dumps(self.before))
        with self.assertRaisesRegex(ValueError,'mismatch'):self.prepare()

    def test_prior_fail_cannot_be_carried_or_original_evidence_rewritten(self):
        self.prepare();report=self.actual();row=report['routes'][0]
        row['carriedFactualChecks'].append('centralFacts')
        with self.assertRaisesRegex(ValueError,'Only unchanged'):s.validate(self.root,self.after,report)
        row['carriedFactualChecks'].remove('centralFacts');row['factualReview']['currentDetails']['evidence']='Invented replacement evidence must not replace the actual original independent finding.'
        with self.assertRaisesRegex(ValueError,'exact original'):s.validate(self.root,self.after,report)

    def test_unchanged_fact_sources_must_still_exist_with_their_exact_hashes(self):
        self.evidence.write_text('{"changed":"synthetic source changed"}')
        with self.assertRaisesRegex(ValueError,'artifact changed'):self.prepare()

    def test_source_logic_change_is_not_a_text_correction(self):
        old=self.f.put('reports/source-old.ts','const enabled = true; const copy = "Useful simlpe reader-facing content.";')
        new=self.f.put('reports/source-new.ts','const enabled = false; const copy = "Useful simple reader-facing content.";')
        self.assertFalse(s.literal_correction(self.root,'content/page.ts',{'artifact':p.reference(self.root,old)},{'artifact':p.reference(self.root,new)},'Useful simlpe reader-facing content.','Useful simple reader-facing content.','/guide'))

    def test_source_literal_text_change_is_proven_without_ignoring_code(self):
        old=self.f.put('reports/source-old.ts','const copy = "Useful simlpe reader-facing content.";')
        new=self.f.put('reports/source-new.ts','const copy = "Useful simple reader-facing content.";')
        self.assertTrue(s.literal_correction(self.root,'data/pages.ts',{'artifact':p.reference(self.root,old)},{'artifact':p.reference(self.root,new)},'Useful simlpe reader-facing content.','Useful simple reader-facing content.','/guide'))

    def test_seo_and_risk_checks_cannot_be_copied_as_fresh(self):
        self.prepare();report=self.actual();report['routes'][0]['checks']['linksAndIndexability']=copy.deepcopy(self.old['routes'][0]['checks']['linksAndIndexability'])
        with self.assertRaisesRegex(ValueError,'freshly verified'):s.validate(self.root,self.after,report)

    def test_changed_meaning_cannot_get_a_targeted_pass(self):
        self.prepare();report=self.actual();report['routes'][0]['correctionReview']['meaningAndScope']['status']='FAIL'
        with self.assertRaisesRegex(ValueError,'genuine independent targeted judgment'):s.validate(self.root,self.after,report)

    def test_manually_forcing_a_narrow_scope_cannot_bypass_the_actual_delta(self):
        self.prepare(word='unsafe');self.proof['mode']='targeted';self.proof['reasons']=[];self.proof_path.write_text(json.dumps(self.proof))
        report=self.actual()
        with self.assertRaisesRegex(ValueError,'requires a full'):s.validate(self.root,self.after,report)

    def test_genuine_rejection_can_escalate_risk_without_losing_its_round(self):
        self.prepare();report=self.actual();row=report['routes'][0];row.update(verdict='FAIL',reviewProfile='high')
        row['correctionReview']['meaningAndScope']['status']='FAIL'
        row['riskAssessment']['consequentialClaims']=[{'quote':'Useful simple reader-facing content.','category':'medical','reason':'Synthetic classification fixture only: exercise an independent high-risk rejection without inventing a real medical verdict.'}]
        self.assertTrue(s.validate(self.root,self.after,report))
        result=p.record(self.root,self.f.put('reports/escalated-fail.json',report))
        self.assertEqual(result[0]['round'],2);self.assertEqual(result[0]['verdict'],'FAIL')
        with p.Journal(self.root,'https://example.com','/guide') as journal:self.assertEqual(journal.cycle['profile'],'high')

    def test_source_bundle_contains_boundary_and_archived_page_content(self):
        self.prepare();report=self.actual();path=self.f.put('reports/new-review.json',report);s.validate(self.root,self.after,report);p.record(self.root,path)
        paths=s.sources(self.root,path)['paths']
        self.assertIn('reports/scope.json',paths);self.assertIn('reports/boundary-before.json',paths)
        self.assertTrue(any('correction-sources/blobs/' in name for name in paths))

    def test_normal_renderer_capture_seals_the_source_boundary(self):
        response=mock.MagicMock();response.status=200;response.headers={};response.read.return_value=b.HTML.encode();response.geturl.return_value='https://example.com/guide';response.__enter__.return_value=response
        with mock.patch.object(r,'__file__',str(self.root/'.claude/tools/rendered-audit.py')),mock.patch.object(r,'content_review_policy',return_value=p),mock.patch.object(r,'content_correction_scope',return_value=s),mock.patch.object(r.urllib.request,'urlopen',return_value=response):
            capture=r.capture(self.before['manifest'],'https://example.com',self.root/'reports/captured.json')
        inventory=read_boundary=p.read(p.artifact(self.root,capture['correctionBoundary']))
        self.assertIn('content/guide.json',inventory['files'])

    def test_targeted_approval_remains_valid_after_actual_live_closure(self):
        self.prepare();report=self.actual();path=self.f.put('reports/new-review.json',report);s.validate(self.root,self.after,report);p.record(self.root,path)
        host={'commit':'a'*40,'status':'live','verifiedAt':p.now(),'evidenceUrl':'https://example.com/synthetic-host-proof'}
        p.mark_published(self.root,self.after,report,'a'*40,host)
        self.assertTrue(s.validate(self.root,self.after,report))

    def test_new_scope_installation_does_not_change_existing_risk_policy_stamp(self):
        before=p.policy_hash(self.root);self.f.put('.claude/commands/_content-correction-scope.md','Synthetic new scope contract')
        self.assertEqual(before,p.policy_hash(self.root))


if __name__=='__main__':unittest.main()
