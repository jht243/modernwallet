"""Synthetic admission fixtures, never editorial approval or production evidence."""
import copy
import importlib.util
import json
from pathlib import Path
from types import SimpleNamespace
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('scope_admission',
                                             Path(__file__).with_name('mindmap-scope-continuation.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class Admission(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.base = {'schemaVersion': 1, 'author': 'actual-builder', 'jobId': 'original-job',
                     'actions': [{'id': 'A1', 'target': '/guides/original'}],
                     'newPageBriefs': [{'actionId': 'A1', 'target': '/guides/original'}],
                     'request': {'goal': 'Original whole-family request', 'requirements': [
                         {'id': 'R1', 'description': 'Keep original intent', 'actionIds': ['A1']}]},
                     'candidateDispositions': [{'candidate': 'original-candidate', 'reason': 'Original reason',
                                               'actionIds': ['A1'], 'prunedActionIds': ['A2']}],
                     'reviewerGuardrails': ['Do not invent tests'], 'emergingClusters': [],
                     'evidenceFiles': []}
        self.review = {'jobId': 'original-job', 'reviewer': 'independent-reviewer', 'round': 1,
                       'verdict': 'FAIL', 'reviewCompletionStatus': 'completed',
                       'completedAt': '2026-11-18T12:00:00Z', 'resolvedFindingIds': [],
                       'findings': [{'id': 'FAMILY', 'status': 'open', 'requiredChange':
                                    'Resolve this actual supported original-family gap with current source facts.'}]}
        self.pf = {'phase': 'build', 'actor': 'actual-builder', 'runId': 'actual-run'}
        self.plan = copy.deepcopy(self.base)
        self.plan['actions'].append({'id': 'A3', 'target': '/comparisons/current-pair'})
        self.plan['newPageBriefs'].append({'actionId': 'A3', 'target': '/comparisons/current-pair'})
        self.plan['request']['requirements'][0]['actionIds'].append('A3')
        self.plan['candidateDispositions'][0].update(actionIds=['A1', 'A3'],
                                                     preContinuationReason='Original reason',
                                                     reason='Original history; new proposal is pending Phase4')
        base_ref = self.write('original-manifest.json', self.base)
        review_ref = self.write('original-review.json', self.review)
        self.handoff = {'jobId': 'original-job', 'candidates': [base_ref], 'sources': [review_ref],
                        'reviewCounters': {'reviews': 0, 'reworks': 0}}
        h_ref = self.write('original-handoff.json', self.handoff)
        self.plan['scopeContinuation'] = {
            'kind': 'original-guardrail-preparation-continuation', 'newActionIds': ['A3'],
            'originalManifest': base_ref, 'originalReview': review_ref, 'originalHandoff': h_ref}
        self.write('preflight/manifest.json', self.pf)
        self.ready = self.root / 'ready.md'
        self.ready.write_text('Synthetic readiness fixture, not production evidence.')
        self.gates = SimpleNamespace(chart=lambda *a: None, chart_structure=lambda *a: self.ready,
                                     _finding_is_hard_block=lambda f, **kw: bool(f.get('liabilityBlock')),
                                     digest=m.digest, render=lambda p: 'Synthetic chart')
        self.patcher = patch.object(m, 'module', side_effect=self.module)
        self.patcher.start()
        self.addCleanup(self.patcher.stop)

    def module(self, root, name):
        return {'mindmap-gates': self.gates,
                'workflow-handoff': SimpleNamespace(handoff_check=lambda *a: None),
                'workflow-preflight': SimpleNamespace(validate=lambda *a, **kw: self.pf)}[name]

    def write(self, name, value):
        p = self.root / name
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(value))
        return m.reference(self.root, p)

    def check(self):
        return m.proposal_check(self.root, self.plan, 'FAMILY', self.root / 'preflight', 'actual-run')

    def test_valid_first_fail_continuation_keeps_pending_independent_review(self):
        self.write('candidate.json', self.plan)
        out = [self.root / n for n in ['new-manifest.json', 'new-review.json', 'admission.json', 'new-chart.md']]
        result = m.admit(self.root, self.root / 'candidate.json', 'FAMILY', self.root / 'preflight',
                         'actual-run', *out)
        self.assertEqual(result['status'], 'admitted-to-write-pending-independent-phase4')
        self.assertIsNone(result['newIndependentVerdict'])
        self.assertEqual(result['newReviewRounds'], 0)
        self.assertTrue(result['contentReviewRequired'])
        self.assertEqual(m.read(out[1])['verdict'], 'FAIL')
        self.assertEqual(m.read(out[1])['findings'], self.review['findings'])
        self.assertEqual(result['originalReviewCounters'], self.handoff['reviewCounters'])
        m.validate(self.root, m.read(out[0]), m.read(out[1]))

    def test_missing_admission_marker_cannot_authorize_generation(self):
        with self.assertRaisesRegex(ValueError, 'Missing hash-bound'):
            m.validate(self.root, self.plan)

    def test_missing_or_forged_guardrail_rejected(self):
        with self.assertRaisesRegex(ValueError, 'actual open carried'):
            m.proposal_check(self.root, self.plan, 'FORGED', self.root / 'preflight', 'actual-run')

    def test_wrong_canonical_job_rejected(self):
        self.plan['jobId'] = 'new-job'
        with self.assertRaisesRegex(ValueError, 'canonical job'):
            self.check()

    def test_original_generated_action_and_brief_locked(self):
        for field in ['actions', 'newPageBriefs']:
            with self.subTest(field=field):
                old = copy.deepcopy(self.plan)
                self.plan[field][0]['target'] = '/guides/changed'
                with self.assertRaisesRegex(ValueError, 'Existing'):
                    self.check()
                self.plan = old

    def test_pruned_action_cannot_return_under_a_new_target(self):
        self.plan['actions'][1]['id'] = 'A2'
        self.plan['scopeContinuation']['newActionIds'] = ['A2']
        with self.assertRaisesRegex(ValueError, 'resurrected'):
            self.check()

    def test_unnamed_action_rejected(self):
        self.plan['actions'].append({'id': 'A4', 'target': '/guides/unasked'})
        with self.assertRaisesRegex(ValueError, 'Name every'):
            self.check()

    def test_original_intake_id_or_history_cannot_change(self):
        self.plan['candidateDispositions'][0]['candidate'] = 'replacement-intake'
        with self.assertRaisesRegex(ValueError, 'intake candidate'):
            self.check()

    def test_original_request_cannot_expand(self):
        self.plan['request']['requirements'][0]['description'] = 'Different topic'
        with self.assertRaisesRegex(ValueError, 'requirement mappings'):
            self.check()

    def test_fabricated_prior_pass_and_liability_rejected(self):
        for update in [{'verdict': 'PASS'}, {'round': 0}, {'liabilityBlock': True}]:
            with self.subTest(update=update):
                source = {**self.review, **update}
                ref = self.write('variant-review.json', source)
                self.plan['scopeContinuation']['originalReview'] = ref
                with self.assertRaises(ValueError):
                    self.check()

    def test_stale_primary_source_hash_rejected(self):
        source = self.write('source.json', {'actual': 'source'})
        self.plan['evidenceFiles'] = [source]
        (self.root / 'source.json').write_text('changed')
        with self.assertRaisesRegex(ValueError, 'Stale'):
            self.check()

    def test_wrong_author_or_run_cannot_supply_preparation_authority(self):
        for key, value in [('actor', 'someone-else'), ('phase', 'write'), ('runId', 'different-run')]:
            with self.subTest(key=key):
                self.pf[key] = value
                with self.assertRaisesRegex(ValueError, 'actual current author'):
                    self.check()
                self.pf = {'phase': 'build', 'actor': 'actual-builder', 'runId': 'actual-run'}

    def test_stale_or_forged_receipt_and_reset_counters_rejected(self):
        self.write('candidate.json', self.plan)
        out = [self.root / n for n in ['new-manifest.json', 'new-review.json', 'admission.json', 'new-chart.md']]
        m.admit(self.root, self.root / 'candidate.json', 'FAMILY', self.root / 'preflight', 'actual-run', *out)
        admitted = m.read(out[0])
        admitted['actions'][1]['target'] = '/comparisons/changed'
        with self.assertRaisesRegex(ValueError, 'candidate changed'):
            m.validate(self.root, admitted)
        admitted = m.read(out[0]); receipt = m.read(out[2])
        receipt['originalReviewCounters']['reviews'] = 99
        ref = self.write('forged-admission.json', receipt)
        admitted['scopeContinuation']['admission'] = ref
        with self.assertRaisesRegex(ValueError, 'authority/counters'):
            m.validate(self.root, admitted)

    def test_outputs_immutable_and_failure_does_not_write(self):
        self.plan['jobId'] = 'bad-job'
        self.write('candidate.json', self.plan)
        out = [self.root / n for n in ['new-manifest.json', 'new-review.json', 'admission.json', 'new-chart.md']]
        with self.assertRaises(ValueError):
            m.admit(self.root, self.root / 'candidate.json', 'FAMILY', self.root / 'preflight', 'actual-run', *out)
        self.assertFalse(any(p.exists() for p in out))
        out[0].write_text('existing')
        with self.assertRaisesRegex(ValueError, 'immutable'):
            m.admit(self.root, self.root / 'candidate.json', 'FAMILY', self.root / 'preflight', 'actual-run', *out)
        self.assertEqual(out[0].read_text(), 'existing')


if __name__ == '__main__':
    unittest.main()
