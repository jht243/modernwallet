"""Synthetic protocol fixtures: never production approval or evidence receipts."""
import copy
import ast
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
    def native_service_fixture(self):
        import hashlib
        url = 'https://fixture.invalid/guides/fixture'
        source = '1a00000000001234'
        service_id = 'service-' + source + '-' + hashlib.sha256(url.encode()).hexdigest()[:10]
        row = {'id': service_id, 'kind': 'customerEdit', 'serviceSla': True,
               'sourcePaymentId': 'verified-original-order', 'sourceMessageId': source,
               'requestedAt': '2026-01-02T12:00:00Z', 'dueAt': '2026-01-03T12:00:00Z',
               'threadId': '1a00000000005678', 'vendorEmail': 'buyer@fixture.invalid',
               'requestText': 'Please correct the published price.',
               'requestItems': [{'text': 'correct the published price', 'required': True}],
               'pageUrl': url, 'serviceOwner': 'partner.M', 'status': 'queued'}
        order = {'id': row['sourcePaymentId'], 'company': 'Fixture', 'liveAt': '2026-01-01T12:00:00Z',
                 'pages': [url], 'clientEmail': {'status': 'sent', 'to': row['vendorEmail'], 'threadId': row['threadId']}}
        queue_src = Path(__file__).resolve().parents[2] / 'scripts/paid_placements/service_queue.py'
        if not queue_src.is_file():
            raise unittest.SkipTest('Layer3 paid_placements queue is not installed in this repository')
        directory = self.root / 'scripts/paid_placements'; directory.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(queue_src, directory / 'service_queue.py')
        (directory / 'fix-queue.json').write_text(json.dumps([row]))
        (directory / 'ledger.json').write_text(json.dumps({'fulfilled': [order], 'queued': []}))
        snapshot = {'manifest': {'workflowKind': 'client-service-correction',
                                'nativeServiceId': service_id, 'jobId': 'service:' + service_id},
                    'routes': [{'path': '/guides/fixture'}]}
        return row, snapshot, {'routes': [{'path': '/guides/fixture', 'verdict': 'PASS'}]}

    def test_delivered_customer_edit_keeps_its_native_service_contract(self):
        row, snapshot, rendered = self.native_service_fixture()
        self.assertTrue(g.native_customer_service_analysis(self.root, snapshot, rendered))
        saved = json.loads((self.root / 'scripts/paid_placements/fix-queue.json').read_text())[0]
        self.assertEqual(saved, row)  # Pure validation preserves deadline and queue state.

    def test_service_label_cannot_exempt_new_pages_or_unknown_orders(self):
        row, snapshot, rendered = self.native_service_fixture()
        snapshot['routes'].append({'path': '/guides/new-page'})
        with self.assertRaisesRegex(ValueError, 'exact existing route'):
            g.native_customer_service_analysis(self.root, snapshot, rendered)
        snapshot['routes'].pop()
        (self.root / 'scripts/paid_placements/ledger.json').write_text('{"fulfilled":[],"queued":[]}')
        with self.assertRaisesRegex(ValueError, 'delivered canonical order'):
            g.native_customer_service_analysis(self.root, snapshot, rendered)

    def test_service_contract_preserves_recipient_holds_and_actual_pass(self):
        row, snapshot, rendered = self.native_service_fixture()
        rendered['routes'][0]['verdict'] = 'FAIL'
        with self.assertRaisesRegex(ValueError, 'actual PASS'):
            g.native_customer_service_analysis(self.root, snapshot, rendered)
        rendered['routes'][0]['verdict'] = 'PASS'
        path = self.root / 'scripts/paid_placements/fix-queue.json'
        row['vendorEmail'] = 'another-customer@fixture.invalid'; path.write_text(json.dumps([row]))
        with self.assertRaisesRegex(ValueError, 'actual delivered customer'):
            g.native_customer_service_analysis(self.root, snapshot, rendered)
        row['vendorEmail'] = 'buyer@fixture.invalid'; row['customerApprovalRequired'] = True; path.write_text(json.dumps([row]))
        with self.assertRaisesRegex(ValueError, 'protected dependency'):
            g.native_customer_service_analysis(self.root, snapshot, rendered)

    def test_ordinary_mindmap_action_retains_editorial_budget(self):
        self.assertFalse(g.native_customer_service_analysis(self.root, {'manifest': {'workflowKind': 'mindmap-pass'}}, {}))

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        for rel, text in {'.claude/commands/_experience.md': 'Fixture publisher; no clinical testing.',
                          '.claude/commands/_approved-cases.json': '{"records":[]}',
                          'readiness.md': 'Synthetic readiness fixture', 'source.txt': 'Synthetic inspected source',
                          'request.txt': 'Synthetic request: explain which fixture cost applies.',
                          'calc.py': 'print({"cost": 2})', 'inputs.json': '{"n":2}',
                          'output.json': '{"cost":2}', 'replay.json': '{"cost":2}'}.items():
            p = self.root / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(text)
        (self.root / '.claude/tools').mkdir(parents=True, exist_ok=True)
        shutil.copyfile(Path(__file__).with_name('rendered-audit.py'), self.root / '.claude/tools/rendered-audit.py')
        self.ref = lambda rel: {'path': rel, 'sha256': g.file_sha(self.root / rel)}
        self.row = {k: 'Fixture ' + k for k in g.COLUMNS}
        self.row.update(id='A1', bucket='create new content', target='/guides/fixture', reader_question='Which fixture cost applies?', format='article', best_medium='text', resolved_deliverable='text',
                        presentation={'medium': 'text', 'placement': 'Answer section', 'reason': 'One fixed fixture result resolves the question',
                                      'readerInputs': [], 'interaction': {'decision': 'not-useful', 'reason': 'Only one fixed source fact'},
                                      'animation': {'decision': 'not-useful', 'reason': 'No changing process to explain'}})
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
        self.plan['request'] = {'source': self.ref('request.txt'), 'goal': 'Explain the fixture cost',
                                'requirements': [{'id': 'R1', 'description': 'Answer the actual cost question',
                                                  'acceptance': 'Reader can identify the applicable cost', 'actionIds': ['A1']}]}
        (self.root / 'chart.md').write_text(g.render(self.plan))
        selection = g.cases(self.root, self.row['reader_question'], 'fixture.invalid')
        (self.root / 'cases.json').write_text(json.dumps(selection))
        self.packet = {'gateSchemaVersion': 1, 'author': 'fixture-worker', 'route': self.row['target'],
                       'readerQuestion': 'Which fixture cost applies?', 'decisionGap': 'Costs depend on volume', 'finding': 'Fixture cost2',
                       'conditions': 'Fixture n2', 'whatWouldChange': 'Different volume', 'basis': 'calculated',
                       'caseSelection': self.ref('cases.json'), 'caseDecisions': 'No relevant fixture cases', 'sourceArtifacts': [self.ref('source.txt')],
                       'method': 'Multiply fixture n', 'units': 'USD', 'limitations': 'Synthetic scenario', 'counterexample': 'Zero volume costs zero',
                       'execution': {'command': ['python3', 'calc.py'], 'code': self.ref('calc.py'), 'inputs': [self.ref('inputs.json')], 'output': self.ref('output.json')}}
        self.packet['presentation'] = copy.deepcopy(self.row['presentation'])
        self.bind_plan()

    def bind_plan(self):
        (self.root / 'plan.json').write_text(json.dumps(self.plan))
        (self.root / 'review.json').write_text(json.dumps(self.review()))
        (self.root / 'chart.md').write_text(g.render(self.plan))
        self.packet['approvedPlan'] = {'manifest': self.ref('plan.json'), 'review': self.ref('review.json'), 'actionId': 'A1'}

    def link(self, source, target):
        return {'source': source, 'target': target, 'section': 'Relevant fixture section', 'anchor': 'Fixture answer',
                'purpose': 'Resolve related question', 'inspection': self.ref('source.txt')}

    def review(self):
        return {'reviewer': 'fixture-independent', 'verdict': 'PASS', 'manifestSha256': g.digest(self.plan),
                'readinessSha256': g.file_sha(self.root / 'readiness.md'), 'evidence': 'Synthetic reviewer fixture, not a real approval',
                'requestCoverage': [{'requirementId': r['id'], 'status': 'PASS', 'evidence': 'Synthetic request coverage fixture'}
                                    for r in self.plan['request']['requirements']]}

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
        result['requestCoverage'] = self.review()['requestCoverage']
        for key in ['presentationReview', 'caseUseReview']:
            result[key] = {'status': 'PASS', 'evidence': 'Synthetic fixture judgment for ' + key}
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
        with self.assertRaisesRegex(ValueError, 'approved action|outside approved'):
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

    def test_body_rows_require_presentation_and_keep_actual_intent(self):
        body = copy.deepcopy(self.row)
        body.update(id='B1', bucket='update existing body text', target='/existing', format='n/a', best_medium='n/a', resolved_deliverable='n/a')
        self.plan['actions'].append(body)
        self.plan['request']['requirements'][0]['actionIds'].append('B1')
        with self.assertRaisesRegex(ValueError, 'Unfinished'):
            g.chart(self.root, self.plan, self.review())
        body.update(format='article', best_medium='text', resolved_deliverable='text')
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

    def test_actual_generator_accepts_gate_options_on_every_writer_command(self):
        generator = Path(__file__).resolve().parents[2] / 'scripts/lib/content_gen.py'
        if not generator.exists():
            self.skipTest('No content generator installed in this fixture checkout')
        tree = ast.parse(generator.read_text())
        commands = {n.args[0].value for n in ast.walk(tree) if isinstance(n, ast.Call)
                    and isinstance(n.func, ast.Attribute) and n.func.attr == 'add_parser'
                    and n.args and isinstance(n.args[0], ast.Constant)} & {'write', 'section', 'fix'}
        self.assertTrue({'write', 'section'} <= commands)
        for command in sorted(commands):
            with self.subTest(command=command):
                result = subprocess.run([sys.executable, str(generator), command, '--help'],
                                        cwd=self.root, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                for option in ('--mindmap-manifest', '--mindmap-review', '--analysis-packet'):
                    self.assertIn(option, result.stdout)


    def test_actual_generator_blocks_mindmap_before_any_writer_call(self):
        generator = Path(__file__).resolve().parents[2] / 'scripts/lib/content_gen.py'
        if not generator.exists():
            self.skipTest('No content generator installed in this fixture checkout')
        result = subprocess.run([sys.executable, str(generator), 'write', '--system', 'missing', '--prompt',
                                 'reports/mindmap-pass/synthetic-fixture/prompt.md', '--out', 'unused', '--slug', 'fixture'],
                                cwd=self.root, capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Mindmap writing blocked', result.stderr)

    def test_original_request_cannot_disappear_from_plan_or_reviews(self):
        review = self.review()
        review['requestCoverage'] = []
        with self.assertRaisesRegex(ValueError, 'every original request'):
            g.chart(self.root, self.plan, review)
        review = self.audit()
        review['requestCoverage'][0]['status'] = 'FAIL'
        with self.assertRaisesRegex(ValueError, 'not fulfilled'):
            g.audit_analysis(self.root, self.packet, review, 'replay.json')
        del self.plan['request']
        with self.assertRaisesRegex(ValueError, 'Artifact needs'):
            g.chart(self.root, self.plan, {})

    def test_original_request_artifact_and_action_coverage_are_checked(self):
        self.plan['request']['requirements'][0]['actionIds'] = ['missing']
        with self.assertRaisesRegex(ValueError, 'matching substantive'):
            g.chart(self.root, self.plan, self.review())
        self.plan['request']['requirements'][0]['actionIds'] = ['A1']
        (self.root / 'request.txt').write_text('Changed request')
        with self.assertRaisesRegex(ValueError, 'Changed artifact'):
            g.chart(self.root, self.plan, self.review())

    def test_embedded_interactive_tool_has_same_route_and_actual_artifact(self):
        self.row.update(bucket='update existing body text', format='article + embedded calculator',
                        best_medium='interactive tool + text', resolved_deliverable='interactive tool + text')
        self.row['presentation'].update(medium='interactive tool + text', readerInputs=['Fixture volume'],
                                       interaction={'decision': 'build', 'reason': 'Reader volume changes the answer'})
        self.plan['newPageBriefs'] = []
        self.packet['presentation'] = copy.deepcopy(self.row['presentation'])
        self.bind_plan()
        with self.assertRaisesRegex(ValueError, 'actual implementation'):
            g.generation(self.root, self.plan, self.review(), self.packet, 'fixture', section=True)
        self.packet['presentationArtifacts'] = [self.ref('calc.py')]
        g.generation(self.root, self.plan, self.review(), self.packet, 'fixture', section=True)
        self.assertEqual(self.packet['route'], '/guides/fixture')

    def test_presentation_cannot_silently_downgrade_after_review(self):
        self.packet['presentation']['reason'] = 'A different decision after approval'
        with self.assertRaisesRegex(ValueError, 'Presentation changed'):
            g.analysis(self.root, self.packet)
        self.packet['presentation'] = copy.deepcopy(self.row['presentation'])
        review = self.audit()
        del review['presentationReview']
        with self.assertRaisesRegex(ValueError, 'presentationReview'):
            g.audit_analysis(self.root, self.packet, review, 'replay.json')

    def test_justified_static_and_no_animation_remain_valid(self):
        g.generation(self.root, self.plan, self.review(), self.packet, 'fixture')
        self.row['presentation']['interaction']['reason'] = 'N/A'
        with self.assertRaisesRegex(ValueError, 'Unfinished'):
            g.chart(self.root, self.plan, self.review())

    def layer3_catalog(self):
        record = {'id': 'client-fixture', 'publicDescription': 'An anonymous services firm',
                  'relationship': 'Client projects', 'topic': 'Client intake', 'workSummary': 'Client intake workflow',
                  'possibleUses': 'Describe documented implementation', 'evidenceStatus': 'Synthetic fixture record',
                  'limits': 'No measured savings', 'outcomeLeads': [], 'privateTestimonialRecords': 0,
                  'verification': 'Inspect supporting records'}
        noise = dict(record, id='unrelated-fixture', publicDescription='A gardening project', topic='Gardening',
                     workSummary='PAA completions only', possibleUses='Garden design')
        for name, data in [('_layer3-experience-catalog.json', {'schemaVersion': 1, 'publisher': 'layer3labs.io', 'records': [record, noise]})]:
            (self.root / '.claude/commands' / name).write_text(json.dumps(data))
        (self.root / '.claude/commands/_layer3-evidence-sources.md').write_text('Synthetic anonymity policy')

    def test_case_search_annotations_do_not_change_candidates(self):
        self.layer3_catalog()
        question = 'How does client intake work?'
        a = g.cases(self.root, question, 'layer3labs.io')
        b = g.cases(self.root, question + ' [verb-only — no PAA, no completions]', 'layer3labs.io')
        self.assertEqual(a['candidates'], b['candidates'])
        self.assertEqual(b['searchQuery'], question)
        self.assertEqual([r['record']['id'] for r in b['candidates']], ['client-fixture'])
        self.assertEqual(g.clean_reader_question('Access [for editors]'), 'Access [for editors]')

    def test_context_search_finds_workflow_without_claiming_vendor_experience(self):
        self.layer3_catalog()
        direct = g.cases(self.root, 'ToolZ pricing', 'layer3labs.io')
        expanded = g.cases(self.root, 'ToolZ pricing', 'layer3labs.io', ['Customer onboarding'])
        self.assertEqual(direct['candidates'], [])
        self.assertEqual([c['record']['id'] for c in expanded['candidates']], ['client-fixture'])
        self.assertEqual(expanded['candidates'][0]['matchSources']['question'], [])
        self.assertIn('No measured savings', expanded['candidates'][0]['record']['limits'])

    def test_case_context_and_claim_support_are_bound(self):
        self.layer3_catalog()
        self.packet['caseSearchContext'] = ['Customer onboarding']
        selection = g.cases(self.root, self.packet['readerQuestion'], 'layer3labs.io', self.packet['caseSearchContext'])
        (self.root / 'cases.json').write_text(json.dumps(selection))
        self.packet.update(caseSelection=self.ref('cases.json'), caseUses=[])
        g.analysis(self.root, self.packet)
        self.packet['caseUses'] = [{'recordId': 'client-fixture', 'use': 'context',
                                   'publicDescription': 'An anonymous services firm', 'claim': 'Client intake context',
                                   'limits': 'No ToolZ use or savings claimed', 'sourceArtifacts': [self.ref('source.txt')]}]
        g.analysis(self.root, self.packet)
        self.packet['caseUses'][0]['sourceArtifacts'] = []
        with self.assertRaisesRegex(ValueError, 'supporting records'):
            g.analysis(self.root, self.packet)
        self.packet['caseUses'] = []
        self.packet['caseSearchContext'] = ['Unrelated gardening']
        with self.assertRaisesRegex(ValueError, 'Case receipt'):
            g.analysis(self.root, self.packet)

    def test_preparation_cannot_hash_the_execution_packet_that_hashes_it(self):
        (self.root / 'packet.json').write_text(json.dumps(self.packet))
        self.plan['evidenceFiles'].append(self.ref('packet.json'))
        with self.assertRaisesRegex(ValueError, 'circular plan binding'):
            g.chart(self.root, self.plan, self.review())

    def test_unbound_no_addition_decision_can_be_preparation_evidence(self):
        packet = {'gateSchemaVersion': 1, 'basis': 'no-addition', 'route': '/guides/other',
                  'whyNoAddition': 'Existing answer is sufficient'}
        (self.root / 'unchanged.json').write_text(json.dumps(packet))
        self.plan['evidenceFiles'].append(self.ref('unchanged.json'))
        g.chart(self.root, self.plan, self.review())

    def test_request_and_presentation_cannot_use_boolean_checkmarks_as_prose(self):
        mutations = [(self.plan['request'], 'goal'),
                     (self.plan['request']['requirements'][0], 'acceptance'),
                     (self.row['presentation'], 'reason'),
                     (self.row['presentation']['interaction'], 'reason')]
        for obj, key in mutations:
            old = obj[key]
            obj[key] = True
            with self.subTest(key=key), self.assertRaisesRegex(ValueError, 'readable text'):
                g.chart(self.root, self.plan, self.review())
            obj[key] = old
        review = self.audit()
        review['presentationReview']['evidence'] = True
        with self.assertRaisesRegex(ValueError, 'readable text'):
            g.audit_analysis(self.root, self.packet, review, 'replay.json')

    def test_fast_scope_chart_renders_and_blocks_writing_until_full_mode(self):
        fast_plan = copy.deepcopy(self.plan)
        fast_plan['preparationMode'] = 'fast-scope'
        del fast_plan['newPageBriefs']
        fast_plan['scopeBriefs'] = [{
            'actionId': 'A1',
            'target': '/guides/fixture',
            'identity': {
                'title': 'Fixture guide',
                'pageType': 'guide',
                'format': self.row['format'],
                'medium': self.row['resolved_deliverable'],
            },
            'readerAndAnswer': {
                'question': self.row['reader_question'],
                'answer': self.row['answer'],
                'placement': self.row['answer_placement'],
            },
            'keywordEvidence': 'Exact phrase validated with SERP read',
            'whyNewPage': 'coverage_lookup checked; no existing page matches intent',
            'outline': [{'heading': 'Opening answer', 'purpose': 'Deliver the direct answer in H2 #1'}],
            'takeaway': 'Ordinary non-tested format; cost threshold takeaway',
            'evidenceFiles': [self.ref('source.txt')],
        }]
        (self.root / 'manifest.json').write_text(json.dumps(fast_plan))
        fast_rev = {
            'reviewer': 'chart-reviewer-1',
            'verdict': 'PASS',
            'manifestSha256': g.digest(fast_plan),
            'readinessSha256': g.file_sha(self.root / 'readiness.md'),
            'evidence': 'Reviewed scope chart and primary sources',
            'requestCoverage': [{'requirementId': 'R1', 'status': 'PASS', 'evidence': 'Covered by A1'}],
        }
        (self.root / 'chart-review.json').write_text(json.dumps(fast_rev))
        g.chart(self.root, fast_plan, fast_rev)
        rendered = g.render(fast_plan)
        self.assertIn('preparation_mode: fast-scope', rendered)
        self.assertIn('## Scope briefs (fast-scope', rendered)
        (self.root / 'chart.md').write_text(rendered)
        g.saved_chart(self.root, fast_plan)
        # Phase 3 analysis and writer generation MUST stay blocked until expanded to preparationMode="full"
        fast_packet = copy.deepcopy(self.packet)
        fast_packet['approvedPlan'] = {'manifest': self.ref('manifest.json'), 'review': self.ref('chart-review.json'), 'actionId': 'A1'}
        with self.assertRaisesRegex(ValueError, 'Fast-scope chart requires post-approval full brief'):
            g.analysis(self.root, fast_packet)
        with self.assertRaisesRegex(ValueError, 'Fast-scope chart requires post-approval full brief'):
            g.generation(self.root, fast_plan, fast_rev, fast_packet, 'fixture')

    def test_model_launch_lean_set_enforces_small_3_page_cap_and_rejects_alternatives(self):
        (self.root / 'docs').mkdir(exist_ok=True)
        (self.root / 'docs/model-launch-page-family.md').write_text('# Lean Launch Set\n')
        small_plan = copy.deepcopy(self.plan)
        small_plan['modelLaunch'] = {'level': 'small', 'modelSlug': 'gemini-4-hydrogen'}
        targets = [
            '/guides/gemini-4-hydrogen-explained',
            '/guides/gemini-4-hydrogen-pricing',
            '/comparisons/gemini-4-hydrogen-vs-gemini-3-8-flash',
        ]
        small_plan['actions'] = []
        small_plan['newPageBriefs'] = []
        for idx, target in enumerate(targets, 1):
            aid = f'A{idx}'
            row = copy.deepcopy(self.row)
            row.update(id=aid, target=target)
            small_plan['actions'].append(row)
            brief = copy.deepcopy(self.plan['newPageBriefs'][0])
            brief.update(
                actionId=aid,
                target=target,
                inboundLinks={'required': 1, 'placements': [self.link('/existing', target)]},
                outboundLinks={'placements': [self.link(target, '/existing')]},
            )
            small_plan['newPageBriefs'].append(brief)
        small_plan['request']['requirements'][0]['actionIds'] = ['A1', 'A2', 'A3']
        rev = self.review()
        rev['manifestSha256'] = g.digest(small_plan)
        g.chart(self.root, small_plan, rev)
        # Adding a 4th page (e.g. how-to-use) on a small launch is rejected
        extra_target = '/guides/how-to-use-gemini-4-hydrogen'
        extra_row = copy.deepcopy(self.row)
        extra_row.update(id='A4', target=extra_target)
        extra_brief = copy.deepcopy(self.plan['newPageBriefs'][0])
        extra_brief.update(
            actionId='A4',
            target=extra_target,
            inboundLinks={'required': 1, 'placements': [self.link('/existing', extra_target)]},
            outboundLinks={'placements': [self.link(extra_target, '/existing')]},
        )
        small_plan['actions'].append(extra_row)
        small_plan['newPageBriefs'].append(extra_brief)
        small_plan['request']['requirements'][0]['actionIds'].append('A4')
        rev['manifestSha256'] = g.digest(small_plan)
        with self.assertRaisesRegex(ValueError, 'caps small/sub-tier model launches'):
            g.chart(self.root, small_plan, rev)
        # -alternatives is rejected even on mid/frontier launches
        alt_target = '/comparisons/gemini-4-hydrogen-alternatives'
        small_plan['modelLaunch']['level'] = 'mid'
        small_plan['actions'][-1]['target'] = alt_target
        small_plan['newPageBriefs'][-1].update(
            target=alt_target,
            inboundLinks={'required': 1, 'placements': [self.link('/existing', alt_target)]},
            outboundLinks={'placements': [self.link(alt_target, '/existing')]},
        )
        rev['manifestSha256'] = g.digest(small_plan)
        with self.assertRaisesRegex(ValueError, 'forbids -alternatives'):
            g.chart(self.root, small_plan, rev)


if __name__ == '__main__':
    unittest.main()
