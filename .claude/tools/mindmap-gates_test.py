"""Synthetic protocol fixtures: never production approval or evidence receipts."""
import copy
import importlib.util
import json
import shutil
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('gates', Path(__file__).with_name('mindmap-gates.py'))
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)


class Gates(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        for rel, text in {'.claude/commands/_experience.md': 'Fixture publisher; no clinical testing.',
                          '.claude/commands/_approved-cases.json': '{"records":[]}',
                          'readiness.md': 'Synthetic readiness fixture', 'source.txt': 'Synthetic inspected source',
                          'calc.py': 'print({"cost": 2})', 'inputs.json': '{"n":2}',
                          'output.json': '{"cost":2}', 'replay.json': '{"cost":2}'}.items():
            p = self.root / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(text)
        (self.root / '.claude/tools').mkdir(parents=True, exist_ok=True)
        shutil.copyfile(Path(__file__).with_name('rendered-audit.py'), self.root / '.claude/tools/rendered-audit.py')
        self.ref = lambda rel: {'path': rel, 'sha256': g.file_sha(self.root / rel)}
        self.row = {k: 'Fixture ' + k for k in g.COLUMNS}
        self.row.update(id='A1', bucket='create new content', target='/guides/fixture', reader_question='Which fixture cost applies?', format='article', resolved_deliverable='text')
        self.brief = {k: 'Researched fixture ' + k for k in g.BRIEFS}
        self.brief.update(actionId='A1', target=self.row['target'], identity={'title': 'Fixture', 'pageType': 'guide', 'format': 'article', 'medium': 'text'},
                          outline=[{'heading': 'Answer', 'purpose': 'Resolve the fixture reader question'}], evidenceFiles=[self.ref('source.txt')],
                          readerAndAnswer={'question': self.row['reader_question'], 'answer': self.row['answer'], 'placement': self.row['answer_placement']},
                          inboundLinks={'required': 1, 'placements': [self.link('/existing', self.row['target'])]},
                          outboundLinks={'placements': [self.link(self.row['target'], '/existing')]})
        self.plan = {'schemaVersion': 1, 'author': 'fixture-worker', 'date': '2026-10-29', 'source': 'Synthetic test fixture', 'interpretedBrief': 'Validate the fixture reader decision', 'chartPath': 'chart.md', 'actions': [self.row], 'newPageBriefs': [self.brief],
                     'preparation': {'status': 'PASS', 'readiness': self.ref('readiness.md')}, 'evidenceFiles': [self.ref('source.txt')],
                     'executionPlan': [{'phase': n, 'action': f'Perform fixture phase {n}'} for n in range(1, 10)],
                     'emergingClusters': ['Fixture demand cluster'], 'exclusions': ['No clinical conclusions'],
                     'publicationScope': {'commit': True, 'push': True, 'liveVerification': True, 'indexNow': True}}
        (self.root / 'chart.md').write_text(g.render(self.plan))
        selection = g.cases(self.root, self.row['reader_question'], 'fixture.invalid')
        (self.root / 'cases.json').write_text(json.dumps(selection))
        self.packet = {'gateSchemaVersion': 1, 'author': 'fixture-worker', 'route': self.row['target'],
                       'readerQuestion': 'Which fixture cost applies?', 'decisionGap': 'Costs depend on volume', 'finding': 'Fixture cost2',
                       'conditions': 'Fixture n2', 'whatWouldChange': 'Different volume', 'basis': 'calculated',
                       'caseSelection': self.ref('cases.json'), 'caseDecisions': 'No relevant fixture cases', 'sourceArtifacts': [self.ref('source.txt')],
                       'method': 'Multiply fixture n', 'units': 'USD', 'limitations': 'Synthetic scenario', 'counterexample': 'Zero volume costs zero',
                       'execution': {'command': ['python3', 'calc.py'], 'code': self.ref('calc.py'), 'inputs': [self.ref('inputs.json')], 'output': self.ref('output.json')}}

    def link(self, source, target):
        return {'source': source, 'target': target, 'section': 'Relevant fixture section', 'anchor': 'Fixture answer',
                'purpose': 'Resolve related question', 'inspection': self.ref('source.txt')}

    def review(self):
        return {'reviewer': 'fixture-independent', 'verdict': 'PASS', 'manifestSha256': g.digest(self.plan),
                'readinessSha256': g.file_sha(self.root / 'readiness.md'), 'evidence': 'Synthetic reviewer fixture, not a real approval'}

    def audit(self):
        spec = importlib.util.spec_from_file_location('fixture_renderer', self.root / '.claude/tools/rendered-audit.py')
        renderer = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(renderer)
        route = {'path': self.row['target']}
        base = 'https://fixture.invalid'
        html = '<html><head><title>Fixture</title><link rel="canonical" href="https://fixture.invalid/guides/fixture"><script type="application/ld+json">{"@type":"WebPage","url":"https://fixture.invalid/guides/fixture"}</script></head><body><main><h1>Fixture</h1>' + ('Synthetic internal unit-test paragraph. ' * 12) + '</main></body></html>'
        result = renderer.parse(html, route, base, base)
        self.assertFalse(result['failures'])
        (self.root / 'render.html').write_text(html)
        result['htmlFile'] = str((self.root / 'render.html').resolve())
        snapshot = {'manifest': {'author': 'fixture-worker', 'canonicalBase': base, 'routes': [route]}, 'routes': [result]}
        snapshot['snapshotSha256'] = g.digest(snapshot)
        rendered = {'reviewer': 'fixture-independent', 'snapshotSha256': snapshot['snapshotSha256'],
                    'routes': [{'path': self.row['target'], 'verdict': 'PASS', 'fingerprint': result['fingerprint'],
                                'checks': {k: {'status': 'PASS', 'evidence': 'Synthetic internal test observation for ' + k} for k in renderer.CHECKS}}]}
        for name, obj in [('snapshot.json', snapshot), ('rendered-review.json', rendered)]:
            (self.root / name).write_text(json.dumps(obj))
        result = {'reviewer': 'fixture-independent', 'verdict': 'PASS', 'packetSha256': g.digest(self.packet),
                  'replaySha256': g.digest({'cost': 2}), 'renderedSnapshot': self.ref('snapshot.json'), 'renderedReview': self.ref('rendered-review.json')}
        for key in ['usefulness', 'sourceAndAssumptions', 'conditionsAndCounterexample', 'renderedConsistency', 'localExclusions']:
            result[key] = {'status': 'PASS', 'evidence': 'Synthetic fixture observation for ' + key}
        return result

    def test_full_plan_renders_complete_briefs_one_summary_and_all_phases(self):
        g.chart(self.root, self.plan, self.review())
        text = g.render(self.plan)
        self.assertEqual(text.count('| Preparation check |'), 1)
        for title in g.BRIEFS.values():
            self.assertIn('**' + title + '**', text)
        self.assertIn('9. Perform fixture phase 9', text)

    def test_missing_briefs_regression(self):
        self.plan['newPageBriefs'] = []
        with self.assertRaisesRegex(ValueError, 'Every new-page'):
            g.chart(self.root, self.plan, self.review())

    def test_every_required_brief_field_is_enforced(self):
        for key in g.BRIEFS:
            with self.subTest(key=key):
                plan = copy.deepcopy(self.plan)
                del plan['newPageBriefs'][0][key]
                review = self.review()
                review['manifestSha256'] = g.digest(plan)
                with self.assertRaises(ValueError):
                    g.chart(self.root, plan, review)

    def test_link_inspection_and_coverage(self):
        self.brief['inboundLinks']['required'] = 3
        with self.assertRaisesRegex(ValueError, 'coverage'):
            g.chart(self.root, self.plan, self.review())

    def test_stale_sources_or_readiness_block(self):
        for file in ['source.txt', 'readiness.md']:
            with self.subTest(file=file):
                p = self.root / file
                original = p.read_text()
                review = self.review()
                p.write_text(original + ' changed')
                with self.assertRaisesRegex(ValueError, 'Changed artifact'):
                    g.chart(self.root, self.plan, review)
                p.write_text(original)

    def test_self_review_and_changed_manifest_block(self):
        r = self.review()
        r['reviewer'] = self.plan['author']
        with self.assertRaises(ValueError):
            g.chart(self.root, self.plan, r)
        r = self.review()
        self.brief['takeaway'] = 'Changed conclusion'
        with self.assertRaisesRegex(ValueError, 'different artifact'):
            g.chart(self.root, self.plan, r)

    def test_pending_preparation_blocks_chart(self):
        self.plan['preparation']['status'] = 'PENDING'
        with self.assertRaisesRegex(ValueError, 'Preparation incomplete'):
            g.chart(self.root, self.plan, self.review())

    def test_publication_and_brief_target_consistency(self):
        self.plan['publicationScope']['push'] = False
        with self.assertRaisesRegex(ValueError, 'IndexNow'):
            g.chart(self.root, self.plan, self.review())

    def test_non_quantitative_drone_branch_needs_no_made_up_math(self):
        self.packet.update(basis='reported', whyNoQuantitativeAnalysis='Combat drone cost and operational performance are not public; no defensible estimate resolves this question.', reasoning='Compare only published dimensions and identify the limits of the available sources.')
        del self.packet['execution']
        del self.packet['counterexample']
        g.analysis(self.root, self.packet)

    def test_missing_quantitative_execution_or_case_retrieval_blocks_writer(self):
        del self.packet['execution']
        with self.assertRaises(ValueError):
            g.generation(self.root, self.plan, self.review(), self.packet, 'fixture')

    def test_irrelevant_but_reproducible_calculation_fails_audit(self):
        review = self.audit()
        review['usefulness']['status'] = 'FAIL'
        with self.assertRaisesRegex(ValueError, 'usefulness'):
            g.audit_analysis(self.root, self.packet, review, 'replay.json')

    def test_changed_replayed_numbers_fail(self):
        review = self.audit()
        (self.root / 'replay.json').write_text('{"cost":3}')
        with self.assertRaisesRegex(ValueError, 'Replayed results differ'):
            g.audit_analysis(self.root, self.packet, review, 'replay.json')

    def test_nested_nonfinite_or_exponent_overflow_results_are_rejected(self):
        for text in ['{"cost":1e999}', '{"runs":[{"cost":-1e999}]}', '{"cost":NaN}', '{"cost":Infinity}']:
            with self.subTest(text=text):
                (self.root / 'invalid.json').write_text(text)
                with self.assertRaisesRegex(ValueError, 'Non-finite JSON'):
                    g.read(self.root / 'invalid.json')

    def test_successful_replay_is_bound_to_final_render(self):
        g.audit_analysis(self.root, self.packet, self.audit(), 'replay.json')
        review = self.audit()
        review['renderedSnapshot']['sha256'] = 'bad'
        with self.assertRaisesRegex(ValueError, 'Changed artifact'):
            g.audit_analysis(self.root, self.packet, review, 'replay.json')

    def test_case_permissions_remain_local_and_stale_retrieval_blocks(self):
        (self.root / '.claude/commands/_experience.md').write_text('Changed local permission')
        with self.assertRaisesRegex(ValueError, 'permission changed'):
            g.analysis(self.root, self.packet)

    def test_unrelated_target_and_no_addition_cannot_generate(self):
        self.packet['route'] = '/other'
        with self.assertRaisesRegex(ValueError, 'outside approved'):
            g.generation(self.root, self.plan, self.review(), self.packet, 'other')
        self.packet['route'] = self.row['target']
        self.packet.update(basis='no-addition', whyNoQuantitativeAnalysis='The existing answer is sufficient', reasoning='Preserve the sufficient page')
        self.packet.update(whyNoAddition='Existing answer already resolves the decision', existingAnswer=self.ref('source.txt'))
        with self.assertRaisesRegex(ValueError, 'terminal'):
            g.generation(self.root, self.plan, self.review(), self.packet, 'fixture')

    def test_measured_human_runs_do_not_require_identical_api_reexecution(self):
        self.packet.update(basis='measured', runs=[{'testedAt': '2026-10-29', 'scope': 'Synthetic fixture product task', 'artifact': self.ref('source.txt')}])
        del self.packet['execution']
        g.audit_analysis(self.root, self.packet, self.audit(), None)

    def test_artifact_cannot_escape_repository(self):
        with self.assertRaises(ValueError):
            g.local(self.root, '/etc/hosts')

    def test_metadata_and_link_rows_keep_legacy_na_fields(self):
        for bucket in ['update existing metadata', 'add internal links', 'consolidation advisory']:
            row = {k: 'n/a' for k in g.COLUMNS}
            row.update(id='M1', problem='Fixture metadata framing', solution='Update existing head only', bucket=bucket, target='src/data/pages.ts#existing')
            plan = copy.deepcopy(self.plan)
            plan['actions'].append(row)
            review = self.review()
            review['manifestSha256'] = g.digest(plan)
            g.chart(self.root, plan, review)

    def test_body_rows_allow_format_na_but_keep_actual_intent(self):
        body = copy.deepcopy(self.row)
        body.update(id='B1', bucket='update existing body text', target='/existing', format='n/a', best_medium='n/a', resolved_deliverable='n/a')
        self.plan['actions'].append(body)
        g.chart(self.root, self.plan, self.review())
        body['reader_question'] = 'n/a'
        with self.assertRaises(ValueError):
            g.chart(self.root, self.plan, self.review())

    def test_format_and_question_mismatch_block_before_generation(self):
        for key, value in [('format', 'interactive tool'), ('medium', 'video')]:
            with self.subTest(key=key):
                old = self.brief['identity'][key]
                self.brief['identity'][key] = value
                with self.assertRaises(ValueError):
                    g.chart(self.root, self.plan, self.review())
                self.brief['identity'][key] = old
        self.packet['readerQuestion'] = 'A completely different intent'
        (self.root / 'cases.json').write_text(json.dumps(g.cases(self.root, self.packet['readerQuestion'], 'fixture.invalid')))
        self.packet['caseSelection'] = self.ref('cases.json')
        with self.assertRaisesRegex(ValueError, 'approved intent'):
            g.generation(self.root, self.plan, self.review(), self.packet, 'fixture')

    def test_fabricated_case_receipt_with_only_hashes_is_rejected(self):
        (self.root / 'cases.json').write_text(json.dumps({'bankSha256': g.file_sha(self.root / '.claude/commands/_approved-cases.json'),
                                                       'experienceSha256': g.file_sha(self.root / '.claude/commands/_experience.md')}))
        self.packet['caseSelection'] = self.ref('cases.json')
        with self.assertRaises(ValueError):
            g.analysis(self.root, self.packet)

    def test_no_addition_uses_existing_decision_without_new_render(self):
        self.packet = {'gateSchemaVersion': 1, 'author': 'fixture-worker', 'route': '/guides/fixture', 'readerQuestion': self.row['reader_question'],
                       'basis': 'no-addition', 'whyNoAddition': 'The current supported answer is sufficient', 'existingAnswer': self.ref('source.txt')}
        review = {'reviewer': 'fixture-independent', 'verdict': 'PASS', 'packetSha256': g.digest(self.packet),
                  'noAddition': {'status': 'PASS', 'evidence': 'Synthetic unchanged-answer decision'}}
        g.audit_analysis(self.root, self.packet, review, None)

    def test_skeletal_rendered_receipt_and_changed_html_cannot_pass(self):
        review = self.audit()
        (self.root / 'snapshot.json').write_text('{"snapshotSha256":"fixture-snapshot"}')
        review['renderedSnapshot'] = self.ref('snapshot.json')
        with self.assertRaises(ValueError):
            g.audit_analysis(self.root, self.packet, review, 'replay.json')
        review = self.audit()
        with (self.root / 'render.html').open('a') as f:
            f.write('changed')
        with self.assertRaisesRegex(ValueError, 'HTML changed'):
            g.audit_analysis(self.root, self.packet, review, 'replay.json')

    def test_incomplete_rendered_checks_cannot_pass(self):
        review = self.audit()
        rendered = json.loads((self.root / 'rendered-review.json').read_text())
        rendered['routes'][0]['checks'].pop('wholePageCoherence')
        (self.root / 'rendered-review.json').write_text(json.dumps(rendered))
        review['renderedReview'] = self.ref('rendered-review.json')
        with self.assertRaisesRegex(ValueError, 'missing audit checks'):
            g.audit_analysis(self.root, self.packet, review, 'replay.json')

    def test_legacy_column_positions_and_cluster_heading_are_preserved(self):
        text = g.render(self.plan)
        self.assertIn('mindmap_pass_date: 2026-10-29', text)
        self.assertIn('## Emerging search patterns (clusters)', text)
        self.assertEqual(g.COLUMNS[9:12], ['reader_question', 'answer', 'answer_placement'])

    def test_shortened_actual_chart_blocks_writer(self):
        (self.root / 'chart.md').write_text('Shortened table without complete briefs')
        with self.assertRaisesRegex(ValueError, 'Actual saved chart'):
            g.generation(self.root, self.plan, self.review(), self.packet, 'fixture')

    def test_original_output_cannot_stand_in_for_independent_replay(self):
        with self.assertRaisesRegex(ValueError, 'distinct independently'):
            g.audit_analysis(self.root, self.packet, self.audit(), 'output.json')
        (self.root / 'alias.json').symlink_to(self.root / 'output.json')
        with self.assertRaisesRegex(ValueError, 'distinct independently'):
            g.audit_analysis(self.root, self.packet, self.audit(), 'alias.json')

    def test_malformed_execution_command_is_not_a_saved_run(self):
        for command in ['python3 calc.py', True, 1, [], [None]]:
            self.packet['execution']['command'] = command
            with self.assertRaisesRegex(ValueError, 'executable/arguments array'):
                g.analysis(self.root, self.packet)

    def test_actual_generator_blocks_mindmap_before_any_writer_call(self):
        generator = Path(__file__).resolve().parents[2] / 'scripts/lib/content_gen.py'
        if not generator.exists():
            self.skipTest('No content generator installed in this fixture checkout')
        result = subprocess.run([sys.executable, str(generator), 'write', '--system', 'missing', '--prompt',
                                 'reports/mindmap-pass/synthetic-fixture/prompt.md', '--out', 'unused', '--slug', 'fixture'],
                                cwd=self.root, capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Mindmap writing blocked', result.stderr)


if __name__ == '__main__':
    unittest.main()
