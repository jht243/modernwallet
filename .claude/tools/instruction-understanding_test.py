"""Synthetic protocol fixtures only. No production understanding or audit PASSes."""
import contextlib
import copy
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest


def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m


u=load('understanding_test_helper',Path(__file__).with_name('instruction-understanding.py'))
fixture_path=Path(__file__).with_name('workflow-local_test.py')
fixture=load('understanding_real_protocol_fixtures',fixture_path) if fixture_path.is_file() else None


class NoActivation(unittest.TestCase):
    def test_does_not_add_a_comprehension_gate_to_other_sites(self):
        with tempfile.TemporaryDirectory() as name:
            root=Path(name);result=u.challenge(root,root/'no-local-bundle')
            self.assertEqual(result['mode'],'existing-protocol');self.assertIsNone(u.local(root))
            with self.assertRaisesRegex(ValueError,'without adding one'):u.record(root,root/'bundle',root/'confirmation',root/'view')

    def test_old_native_reviews_without_new_reuse_records_are_unchanged(self):
        with tempfile.TemporaryDirectory() as name:
            self.assertTrue(u.review_check(Path(name),{'instructionApplications':[{'path':'missing-native-transport.json','sha256':'synthetic'}]}))


@unittest.skipUnless(fixture is not None,'This site has no detailed local protocol to activate')
class RetainedUnderstanding(unittest.TestCase):
    def setUp(self):
        self.f=fixture.LocalWorkflowTests();self.f.setUp();self.addCleanup(self.f.doCleanups);self.root=self.f.root
        self.previous=self.f.prepare('original');self.old=self.f.complete(self.previous)
        self.current=self.f.prepare('current',reuse=self.previous);self.deliver(self.current)

    def deliver(self,directory):
        m=fixture.core.load(directory)
        for _ in range(len(m['parts'])-len(m['delivered'])):
            with contextlib.redirect_stdout(io.StringIO()):fixture.core.emit(self.root,directory)

    def confirmation(self,directory=None):
        directory=directory or self.current;c=u.challenge(self.root,directory)
        m=fixture.core.load(directory);fresh=self.f.application(directory)['understanding']
        fresh=[x for x in fresh if x['source'] in c['freshExplanationSources']]
        for item in fresh:
            item['meaning']+=' Fresh synthetic reading covers the updated source and its retained constraints.'
            item['application']+=' Fresh synthetic application addresses the current changed instructions rather than replaying the old task.'
        return {'version':u.VERSION,**c['identity'],'previousBundleId':c['previousBundleId'],
                'currentContextAvailable':True,'rulesUnderstood':True,'contextRetained':True,
                'unchangedApplicationsStillApply':True,'recallStillUnderstood':True,'reuseEligibleSources':True,
                'task':'Synthetic current task: verify retained instruction understanding without authoring or approving real website content.',
                'accessEvidence':'Synthetic current-context statement: the same fixture actor retains the complete original rules in its unchanged conversation epoch.',
                'currentApplication':'Synthetic current application: recheck the same bounded fixture scope and inspect current differences while retaining unchanged rule meaning.',
                'freshUnderstanding':fresh}

    def record(self,c=None,directory=None,name='retained'):
        directory=directory or self.current;c=c or self.confirmation(directory)
        path=self.f.json(name+'-confirmation.json',c);out=self.root/(name+'-view.json')
        result=u.record(self.root,directory,path,out);return result,path,out

    def test_reuses_actual_prior_explanations_and_original_validator_still_passes(self):
        result,path,out=self.record()
        self.assertGreater(result['unchangedExplanationsReused'],5);self.assertEqual(result['freshExplanations'],0)
        fixture.core.validate(self.root,self.current)
        view=u.read(out);before=self.f.application(self.previous)
        self.assertEqual(view['understanding'][0]['meaning'],before['understanding'][0]['meaning'])
        self.assertIn('explanationOrigin',view['understanding'][0]);self.assertEqual(u.read(path)['actor'],view['actor'])
        self.assertNotIn('editorialPass',view)

    def test_fresh_confirmation_is_far_smaller_than_repeating_all_source_explanations(self):
        c=self.confirmation();full=self.f.application(self.current)
        self.assertLess(len(json.dumps(c)),len(json.dumps(full))*.4)
        _,path,out=self.record(c);summary=u.verify_view(self.root,self.current,out)
        self.assertFalse(summary['freshExplanations']);self.assertNotIn('understanding',summary)

    def test_access_understanding_or_recall_loss_blocks_reuse(self):
        for key in ['currentContextAvailable','rulesUnderstood','contextRetained','unchangedApplicationsStillApply','recallStillUnderstood']:
            c=self.confirmation();c[key]=False
            with self.subTest(key=key),self.assertRaisesRegex(ValueError,'reread'):self.record(c,name='bad-'+key)

    def test_another_actor_context_epoch_or_bundle_cannot_borrow_understanding(self):
        for key in u.IDENTITY:
            c=self.confirmation();c[key]='another-real-identity'
            with self.subTest(key=key),self.assertRaisesRegex(ValueError,'another current'):self.record(c,name='wrong-'+key)

    def test_changed_rule_requires_only_its_real_new_explanation(self):
        source='.claude/commands/_experience.md';path=self.root/source
        path.write_text(path.read_text()+'\nNew synthetic fixture rule: preserve this changed condition too.\n')
        current=self.f.prepare('changed',reuse=self.previous);self.deliver(current)
        c=self.confirmation(current);self.assertEqual([x['source'] for x in c['freshUnderstanding']],[source])
        missing=copy.deepcopy(c);missing['freshUnderstanding']=[]
        with self.assertRaisesRegex(ValueError,'every changed'):self.record(missing,current,'missing-rule')
        result,_,_=self.record(c,current,'changed-rule');self.assertEqual(result['freshExplanations'],1)

    def test_replaying_old_answer_for_changed_source_is_rejected(self):
        source='.claude/commands/_experience.md';path=self.root/source;path.write_text(path.read_text()+'\nChanged synthetic rule.\n')
        current=self.f.prepare('changed',reuse=self.previous);self.deliver(current);c=self.confirmation(current)
        c['freshUnderstanding']=[x for x in self.f.application(self.previous)['understanding'] if x['source']==source]
        with self.assertRaisesRegex(ValueError,'old answer replay'):self.record(c,current,'replayed')

    def test_changed_rules_must_be_read_before_a_compact_confirmation(self):
        path=self.root/'.claude/commands/_experience.md';path.write_text(path.read_text()+'\nAnother synthetic condition requiring a real fresh reading.\n')
        current=self.f.prepare('unread-changes',reuse=self.previous)
        with self.assertRaisesRegex(ValueError,'Read every newly delivered'):u.challenge(self.root,current)

    def test_a_different_canonical_job_cannot_reuse_the_old_task_application(self):
        first_handoff=self.f.handoff('first-handoff.json')
        first=self.f.prepare('audit-original',actor='independent-reviewer',phase='audit',handoff=str(first_handoff.relative_to(self.root)));self.f.complete(first)
        next_handoff=self.f.handoff('next-handoff.json',jobId='different-canonical-job')
        current=self.f.prepare('other-job',actor='independent-reviewer',phase='audit',reuse=first,handoff=str(next_handoff.relative_to(self.root)));self.deliver(current)
        with self.assertRaisesRegex(ValueError,'Different job'):u.challenge(self.root,current)

    def test_prior_meaning_or_confirmation_cannot_be_silently_rewritten(self):
        _,path,out=self.record();view=u.read(out)
        view['understanding'][0]['meaning']+=' An unrecorded substituted explanation must not pass.';out.write_text(json.dumps(view))
        with self.assertRaisesRegex(ValueError,'missing or changed'):u.verify_view(self.root,self.current,out)

    def test_chained_reuse_remains_valid_when_a_rule_changes_later(self):
        _,_,first=self.record();source=self.root/'.claude/commands/_experience.md';source.write_text(source.read_text()+'\nAnother synthetic current condition.\n')
        third=self.f.prepare('third',reuse=self.current);self.deliver(third)
        result,_,out=self.record(self.confirmation(third),third,'third')
        self.assertEqual(result['freshExplanations'],1);u.verify_view(self.root,third,out)
        self.assertIn('retained-view.json',u.sources(self.root,out)['paths'])

    def test_first_reading_and_different_phase_need_the_original_full_application(self):
        fresh=self.f.prepare('no-prior')
        with self.assertRaisesRegex(ValueError,'first full'):u.challenge(self.root,fresh)
        current=self.f.prepare('different-phase',phase='audit',reuse=self.previous,handoff=str(self.f.handoff(producer='another-producer').relative_to(self.root)));self.deliver(current)
        with self.assertRaisesRegex(ValueError,'new phase/role'):u.challenge(self.root,current)

    def test_recorded_full_application_is_never_replaced(self):
        self.f.complete(self.current)
        with self.assertRaisesRegex(ValueError,'already recorded'):self.record()

    def test_publication_verifies_the_new_receipt_registration(self):
        result,_,out=self.record();self.assertTrue(u.review_check(self.root,{'instructionApplications':[result['bundle']]}))
        view=u.read(out);del view['understandingReuse'];out.write_text(json.dumps(view))
        with self.assertRaises(ValueError):u.review_check(self.root,{'instructionApplications':[result['bundle']]})

    def test_dependencies_include_original_explanations_and_current_confirmation(self):
        _,path,out=self.record();paths=u.sources(self.root,out)['paths']
        self.assertIn(str(path.relative_to(self.root)),paths);self.assertIn('original/application.json',paths)

    def test_adding_this_reference_protocol_preserves_the_existing_policy_hash(self):
        before=fixture.local.policy_hash(self.root)
        self.f.put('.claude/commands/_instruction-understanding.md','Synthetic new reference protocol, outside the original policy inputs.')
        self.assertEqual(before,fixture.local.policy_hash(self.root))


if __name__=='__main__':unittest.main()
