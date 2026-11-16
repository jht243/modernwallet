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

    def test_init_skeleton_scope_manifest_phase0_approval_and_evidence_batch_fail_closed_until_filled(self):
        # 1. scope-manifest skeleton initializes cleanly and fails closed while TODOs remain
        res_m = g.init_skeleton(
            self.root, 'scope-manifest', out='skel/manifest.json', author='builder-1',
            job_id='job-skel-1', chart_path='reports/skel-chart.md', request_file='request.txt',
            readiness_file='readiness.md', mode='fast-scope',
        )
        self.assertEqual(res_m['status'], 'skeleton-initialized')
        skel_plan = g.read(self.root / 'skel/manifest.json')
        self.assertEqual(skel_plan['request']['source']['sha256'], g.file_sha(self.root / 'request.txt'))
        with self.assertRaisesRegex(ValueError, 'Unfinished or unexplained'):
            g.chart(self.root, skel_plan, {'reviewer': 'rev-1', 'verdict': 'PASS', 'manifestSha256': g.digest(skel_plan)})

        # 2. phase0-approval records exact hashes on a passing chart review
        (self.root / 'valid-manifest.json').write_text(json.dumps(self.plan))
        (self.root / 'valid-review.json').write_text(json.dumps(self.review()))
        res_p0 = g.init_skeleton(
            self.root, 'phase0-approval', out='skel/phase0-approval.json',
            manifest_path='valid-manifest.json', review_path='valid-review.json',
        )
        self.assertEqual(res_p0['status'], 'phase0-approval-recorded')
        p0_obj = g.read(self.root / 'skel/phase0-approval.json')
        self.assertEqual(p0_obj['approvedManifest']['canonicalJsonSha256'], g.digest(self.plan))

        # 3. evidence-batch retrieves cases.json and writes pre-bound evidence.json that fails closed until TODOs are filled
        res_ev = g.init_skeleton(
            self.root, 'evidence-batch', out_dir='skel/evidence',
            manifest_path='valid-manifest.json', review_path='valid-review.json',
            author='writer-1', publisher='example.com', basis='reported',
        )
        self.assertEqual(res_ev['count'], 1)
        ev_file = self.root / res_ev['items'][0]['evidence']
        ev_pkt = g.read(ev_file)
        self.assertEqual(ev_pkt['approvedPlan']['manifest']['sha256'], g.file_sha(self.root / 'valid-manifest.json'))
        with self.assertRaisesRegex(ValueError, 'Unfinished or unexplained'):
            g.analysis(self.root, ev_pkt)
        for k in ('decisionGap', 'finding', 'conditions', 'whatWouldChange', 'caseDecisions', 'whyNoQuantitativeAnalysis', 'reasoning'):
            ev_pkt[k] = f'Substantive verified prose for {k} grounded in source.txt.'
        g.analysis(self.root, ev_pkt)

    def test_compatible_text_medium_format_link_requirements_seal_draft_and_rebind_mechanical(self):
        # Reproduce exact trecklist-web / DroneZ pre-Phase-0 mechanical scenarios:
        # CR-9 ("text + comparison table" vs "text"), CR-10 (REQ-3 mapped to link-only A3/A4),
        # CR-11 ("comparison table/database" vs "comparison table/database - searchers want to choose..."),
        # plus Round-2 ("2 of 2") reviewer guardrails carried into writing via rebind_mechanical.
        plan = copy.deepcopy(self.plan)
        plan['preparationMode'] = 'fast-scope'
        plan.pop('newPageBriefs', None)
        plan['actions'][0]['format'] = 'comparison table/database - searchers want to choose between several flasks'
        plan['actions'][0]['resolved_deliverable'] = 'text'
        plan['actions'][0]['presentation']['medium'] = 'text + comparison table'
        link_row = {
            'id': 'A3', 'problem': 'Existing mug page has no link to travel thermos.',
            'solution': 'Add contextual inbound link in related gear section.',
            'bucket': 'add internal links', 'target': '/gear/travel-coffee-mug',
            'format': 'N/A', 'best_medium': 'N/A', 'resolved_deliverable': 'N/A',
            'serp_verdict': 'N/A', 'serp_evidence': 'N/A',
            'reader_question': 'N/A', 'answer': 'N/A', 'answer_placement': 'N/A',
        }
        plan['actions'].append(link_row)
        plan['request']['requirements'].append({
            'id': 'REQ-3',
            'description': 'Inbound internal links from existing travel mug coverage.',
            'acceptance': 'Contextual inbound link added without bumping updatedDate.',
            'actionIds': ['A3'],
        })
        plan['scopeBriefs'] = [{
            'actionId': 'A1',
            'target': plan['actions'][0]['target'],
            'identity': {
                'title': 'Best Travel Thermos: Heat Retention Compared',
                'pageType': 'comparison',
                'format': 'comparison table/database',
                'medium': 'text + comparison table',
            },
            'readerAndAnswer': {
                'question': plan['actions'][0]['reader_question'],
                'answer': plan['actions'][0]['answer'],
                'placement': plan['actions'][0]['answer_placement'],
            },
            'keywordEvidence': 'coffee thermos 6,600/mo (SEMrush US, checked 2026-11-15).',
            'whyNewPage': 'Existing mug page targets 12-16 oz commuter lids, not 24-40 oz insulated flasks.',
            'outline': [{'heading': 'Heat-Retention Comparison Table', 'purpose': 'Compare brand-stated hours and weights.'}],
            'takeaway': 'Thermos Stainless King 40 oz leads published 24-hour hot retention at $39.99.',
            'evidenceFiles': [{'path': 'source.txt', 'sha256': '0' * 64}],
        }]
        manifest_path = self.root / 'thermos-manifest.json'
        manifest_path.write_text(json.dumps(plan, indent=2))

        # 1. seal-draft refreshes stale SHA-256s and validates structure BEFORE chart-review!
        sealed = g.seal_draft(self.root, 'thermos-manifest.json', out='draft-thermos.md')
        self.assertEqual(sealed['status'], 'PASS')
        self.assertTrue((self.root / 'draft-thermos.md').is_file())

        # Genuine interactive vs static mismatch STILL fails closed
        bad_plan = g.read(manifest_path)
        bad_plan['actions'][0]['presentation']['medium'] = 'interactive calculator'
        bad_plan['actions'][0]['presentation']['interaction']['decision'] = 'build'
        bad_plan['actions'][0]['presentation']['readerInputs'] = ['Oz capacity']
        with self.assertRaisesRegex(ValueError, 'Action/presentation medium differs'):
            g.chart_structure(self.root, bad_plan)

        # 2. init-skeleton --kind chart-review creates pre-hashed skeleton with REQ-1 & REQ-3
        skel_rev = g.init_skeleton(
            self.root, 'chart-review', out='thermos-review.json',
            manifest_path='thermos-manifest.json', author='reviewer-1',
        )
        self.assertEqual(skel_rev['status'], 'chart-review-skeleton-initialized')

        # 3. Simulate Round-2 ("second and final allowed round (2 of 2)") FAIL with mechanical CR-9
        # and non-liability writer guardrails CR-5..CR-8 -> rebind_mechanical resolves & renders chart!
        r2_rev = g.read(self.root / 'thermos-review.json')
        r2_rev.update({
            'verdict': 'FAIL',
            'manifestSha256': 'f' * 64,
            'evidence': 'Second and final allowed round (2 of 2): content judged PASS-quality; CR-9 mechanical field mismatch plus writer limits CR-5..CR-6.',
            'requestCoverage': [
                {'requirementId': 'REQ-1', 'status': 'PASS', 'evidence': 'A1 satisfies core travel thermos comparison intent with primary brand specs.'},
                {'requirementId': 'REQ-3', 'status': 'PASS', 'evidence': 'A3 wires contextual inbound link from travel-coffee-mug without date bump.'},
            ],
            'findings': [
                {'id': 'CR-9', 'severity': 'mechanical', 'status': 'open', 'summary': 'presentation.medium says text + comparison table while resolved_deliverable says text.'},
                {'id': 'CR-5', 'severity': 'medium', 'status': 'open', 'summary': 'Stanley saved page says a full day; writer must cite a full day unless 24h listing is saved.'},
            ],
            'resolvedFindingIds': ['CR-1', 'CR-2', 'CR-3', 'CR-4'],
        })
        (self.root / 'thermos-review.json').write_text(json.dumps(r2_rev, indent=2))
        rebound = g.rebind_mechanical(
            self.root, 'thermos-manifest.json', 'thermos-review.json', out=plan['chartPath'],
        )
        self.assertEqual(rebound['status'], 'PASS')
        self.assertIn('CR-9', rebound['resolvedMechanicalIds'])
        self.assertEqual(rebound['carriedGuardrails'], 1)
        rendered_md = (self.root / plan['chartPath']).read_text()
        self.assertIn('## Reviewer guardrails carried into writing', rendered_md)
        self.assertIn('CR-5', rendered_md)
        g.chart(self.root, g.read(manifest_path), g.read(self.root / 'thermos-review.json'))
        g.saved_chart(self.root, g.read(manifest_path))

    def test_append_only_ledger_prefix_accepted_while_mutation_rejected(self):
        ledger = self.root / 'reports/trend-pass/ledger.md'
        ledger.parent.mkdir(parents=True, exist_ok=True)
        initial = '| 2026-11-13 | wegovy-pill-side-effects | HELD | chart-review PASS |\n'
        ledger.write_text(initial)
        plan = copy.deepcopy(self.plan)
        plan['evidenceFiles'].append(self.ref('reports/trend-pass/ledger.md'))
        (self.root / 'chart.md').write_text(g.render(plan))
        rev = {
            'verdict': 'PASS',
            'reviewer': 'independent-reviewer',
            'manifestSha256': g.digest(plan),
            'readinessSha256': g.file_sha(self.root / 'readiness.md'),
            'evidence': 'Verified all chart rows and primary evidence.',
            'requestCoverage': [{'requirementId': 'R1', 'status': 'PASS', 'evidence': 'Covered by A1.'}],
        }
        g.chart(self.root, plan, rev)

        # Appending later daily run rows to reports/trend-pass/ledger.md keeps historical prefix valid
        ledger.write_text(initial + '| 2026-11-14 | run note | N/A | appended daily row |\n')
        g.chart(self.root, plan, rev)

        # Editing historical prefix bytes inside ledger.md STILL fails closed
        ledger.write_text(initial.replace('HELD', 'KEPT') + '| 2026-11-14 | run note | N/A | appended daily row |\n')
        with self.assertRaisesRegex(ValueError, 'Changed artifact: reports/trend-pass/ledger.md'):
            g.chart(self.root, plan, rev)

        # Appending to non-ledger source evidence STILL fails closed
        ledger.write_text(initial + '| 2026-11-14 | run note | N/A | appended daily row |\n')
        orig_src = (self.root / 'source.txt').read_text()
        (self.root / 'source.txt').write_text(orig_src + '\nAppended unauthorized line\n')
        with self.assertRaisesRegex(ValueError, 'Changed artifact: source.txt'):
            g.chart(self.root, plan, rev)

    def test_inbound_link_inspection_accepts_committed_pre_edit_blob_sha(self):
        (self.root / 'existing.md').write_text('# Existing Guide\nPre-edit body text.\n')
        self.brief['inboundLinks']['placements'] = [{
            'source': '/existing',
            'target': self.row['target'],
            'section': 'Relevant fixture section',
            'anchor': 'Fixture answer',
            'purpose': 'Resolve related question',
            'inspection': self.ref('existing.md'),
        }]
        self.bind_plan()
        subprocess.run(['git', 'init', '-q'], cwd=self.root, check=True)
        subprocess.run(['git', 'config', 'user.email', 'test@example.com'], cwd=self.root, check=True)
        subprocess.run(['git', 'config', 'user.name', 'Test'], cwd=self.root, check=True)
        subprocess.run(['git', 'add', 'existing.md'], cwd=self.root, check=True)
        subprocess.run(['git', 'commit', '-qm', 'pre-edit existing page'], cwd=self.root, check=True)

        plan = copy.deepcopy(self.plan)
        rev = self.review()
        # Simulate Phase 6 editing existing.md to insert the approved inbound link
        (self.root / 'existing.md').write_text((self.root / 'existing.md').read_text() + '\nSee [New Guide](/guides/fixture).\n')
        g.chart(self.root, plan, rev)
        g.generation(self.root, plan, rev, self.packet, 'fixture')

    def test_prepare_write_packets_and_precheck_drafts_fixes_pipe_tables(self):
        run_dir = self.root / 'reports/mindmap-pass/run-packets'
        (run_dir / 'research/sources').mkdir(parents=True)
        (run_dir / 'research/sources/vendor-spec.txt').write_text(
            'URL: https://vendor.example/specs\nCheckedAt: 2026-11-15T12:00:00Z\n\nBattery lasts 18 hours under continuous load.\n'
        )
        manifest_path = run_dir / 'approval-manifest.json'
        manifest = copy.deepcopy(self.plan)
        manifest['actions'][0]['target'] = '/guides/vendor-battery-test'
        manifest['newPageBriefs'][0]['target'] = '/guides/vendor-battery-test'
        manifest['newPageBriefs'][0]['sources'] = [{'url': 'https://vendor.example/specs', 'title': 'Vendor Specs'}]
        manifest_path.write_text(json.dumps(manifest, indent=2))
        rev_path = run_dir / 'chart-review.json'
        rev_obj = self.review()
        rev_obj['findings'] = [{'id': 'CR-5', 'status': 'open', 'severity': 'medium', 'summary': 'Cite 18 hours only from saved spec sheet.'}]
        rev_path.write_text(json.dumps(rev_obj, indent=2))

        ev_dir = run_dir / 'evidence/vendor-battery-test'
        ev_dir.mkdir(parents=True)
        (ev_dir / 'evidence.json').write_text(json.dumps(self.packet, indent=2))

        res = g.prepare_write_packets(
            self.root,
            manifest_path=str(manifest_path.relative_to(self.root)),
            out_dir=str((run_dir / 'prompts').relative_to(self.root)),
            evidence_dir=str((run_dir / 'evidence').relative_to(self.root)),
            review_path=str(rev_path.relative_to(self.root)),
        )
        self.assertEqual(res['status'], 'PASS')
        self.assertEqual(res['count'], 1)
        sys_md = (run_dir / 'prompts/system.md').read_text()
        prompt_md = (run_dir / 'prompts/vendor-battery-test.prompt.md').read_text()
        urls_txt = (run_dir / 'prompts/vendor-battery-test.allowed-urls.txt').read_text()
        self.assertIn('structured `table` fields', sys_md)
        self.assertIn('CR-5', prompt_md)
        self.assertIn('Battery lasts 18 hours', prompt_md)
        self.assertIn('https://vendor.example/specs', urls_txt)

        drafts_dir = run_dir / 'drafts'
        drafts_dir.mkdir(parents=True)
        body_words = ' '.join(['Verified battery runtime analysis from primary spec sheet with measured discharge curve.'] * 95)
        draft_path = drafts_dir / 'vendor-battery-test.json'
        draft_path.write_text(json.dumps({
            'slug': 'vendor-battery-test',
            'title': 'Vendor Battery Runtime Guide',
            'sections': [{
                'heading': 'Runtime Comparison',
                'paragraphs': [
                    body_words + ' Source: https://vendor.example/specs and https://rogue.example/unverified',
                    '| Model | Runtime |\n| --- | --- |\n| Pro 1 | 18 hours |\n| Lite 2 | 12 hours |',
                ],
            }],
        }, indent=2))

        # Missing .meta.json + rogue URL + raw pipe table fails precheck
        bad = g.precheck_drafts(
            self.root,
            manifest_path=str(manifest_path.relative_to(self.root)),
            drafts_dir=str(drafts_dir.relative_to(self.root)),
            prompts_dir=str((run_dir / 'prompts').relative_to(self.root)),
            fix_pipe_tables=False,
        )
        self.assertEqual(bad['status'], 'FAIL')
        issue_kinds = {item['kind'] for item in bad['issues']}
        self.assertIn('missing-meta-json', issue_kinds)
        self.assertIn('pipe-table-in-paragraphs', issue_kinds)
        self.assertIn('unverified-external-url', issue_kinds)

        # Add .meta.json, remove rogue URL, and enable --fix-pipe-tables -> converts to structured table & PASSes!
        (drafts_dir / 'vendor-battery-test.json.meta.json').write_text(json.dumps({
            'provider': 'anthropic',
            'model': 'claude-opus-4-7',
        }))
        draft_obj = json.loads(draft_path.read_text())
        draft_obj['sections'][0]['paragraphs'][0] = body_words + ' Source: https://vendor.example/specs'
        draft_path.write_text(json.dumps(draft_obj, indent=2))

        fixed = g.precheck_drafts(
            self.root,
            manifest_path=str(manifest_path.relative_to(self.root)),
            drafts_dir=str(drafts_dir.relative_to(self.root)),
            prompts_dir=str((run_dir / 'prompts').relative_to(self.root)),
            fix_pipe_tables=True,
        )
        self.assertEqual(fixed['status'], 'PASS')
        repaired_obj = json.loads(draft_path.read_text())
        self.assertIn('table', repaired_obj['sections'][0])
        self.assertEqual(repaired_obj['sections'][0]['table']['headers'], ['Model', 'Runtime'])
        self.assertEqual(len(repaired_obj['sections'][0]['table']['rows']), 2)

    def test_check_write_scope_catches_unapproved_standalone_and_monolithic_edits_and_reverts(self):
        repo = self.root / 'scope-repo'
        (repo / 'src/content/guides').mkdir(parents=True)
        (repo / 'data').mkdir(parents=True)
        (repo / 'src/content/guides/approved-slug.md').write_text('# Approved\nInitial.\n')
        (repo / 'src/content/guides/stray-slug.md').write_text('# Stray\nInitial.\n')
        (repo / 'data/pages.json').write_text(json.dumps({
            '/guides/approved-slug': {'title': 'Approved', 'body': 'v1'},
            '/guides/other-locked': {'title': 'Locked', 'body': 'v1'},
        }, indent=2))
        subprocess.run(['git', 'init', '-q'], cwd=repo, check=True)
        subprocess.run(['git', 'config', 'user.email', 'test@example.com'], cwd=repo, check=True)
        subprocess.run(['git', 'config', 'user.name', 'Test'], cwd=repo, check=True)
        subprocess.run(['git', 'add', '.'], cwd=repo, check=True)
        subprocess.run(['git', 'commit', '-qm', 'init'], cwd=repo, check=True)

        manifest_path = repo / 'reports/run/approval-manifest.json'
        manifest_path.parent.mkdir(parents=True)
        manifest_path.write_text(json.dumps({
            'jobId': 'scope-job-1',
            'actions': [{'id': 'A1', 'bucket': 'create new content', 'target': '/guides/approved-slug'}],
        }))

        # Modify approved + stray standalone + unapproved key in monolithic JSON
        (repo / 'src/content/guides/approved-slug.md').write_text('# Approved\nUpdated.\n')
        (repo / 'src/content/guides/stray-slug.md').write_text('# Stray\nUnapproved edit!\n')
        (repo / 'data/pages.json').write_text(json.dumps({
            '/guides/approved-slug': {'title': 'Approved', 'body': 'v2'},
            '/guides/other-locked': {'title': 'Locked', 'body': 'UNAPPROVED_V2'},
        }, indent=2))

        chk_bad = g.check_write_scope(repo, manifest_path='reports/run/approval-manifest.json', fix=False)
        self.assertEqual(chk_bad['status'], 'FAIL')
        viol_paths = [v['file'] for v in chk_bad['violations']]
        self.assertIn('src/content/guides/stray-slug.md', viol_paths)
        self.assertIn('data/pages.json', viol_paths)

        # Fix monolithic JSON back to approved-only, and let check_write_scope(fix=True) revert stray standalone file
        (repo / 'data/pages.json').write_text(json.dumps({
            '/guides/approved-slug': {'title': 'Approved', 'body': 'v2'},
            '/guides/other-locked': {'title': 'Locked', 'body': 'v1'},
        }, indent=2))
        chk_fixed = g.check_write_scope(repo, manifest_path='reports/run/approval-manifest.json', fix=True)
        self.assertEqual(chk_fixed['status'], 'PASS')
        self.assertIn('src/content/guides/stray-slug.md', chk_fixed['reverted'])
        self.assertEqual((repo / 'src/content/guides/stray-slug.md').read_text(), '# Stray\nInitial.\n')

    def test_plan_batches_disjoint_sub_batching_for_large_manifests(self):
        small_path = self.root / 'small-manifest.json'
        small_path.write_text(json.dumps({
            'jobId': 'job-small',
            'actions': [
                {'id': 'A1', 'bucket': 'create new content', 'target': '/guides/p1'},
                {'id': 'A2', 'bucket': 'create new content', 'target': '/guides/p2'},
            ],
            'newPageBriefs': [{'target': '/guides/p1', 'inboundLinks': {'placements': [{'source': '/guides/hub'}]}}],
        }))
        small = g.plan_batches(self.root, manifest_path='small-manifest.json')
        self.assertFalse(small['subBatchingRecommended'])
        self.assertEqual(small['batchCount'], 1)
        self.assertTrue(small['disjointPartition'])

        large_path = self.root / 'large-manifest.json'
        large_path.write_text(json.dumps({
            'jobId': 'job-large',
            'actions': [
                {'id': f'A{i}', 'bucket': 'create new content', 'target': f'/guides/new-{i}'}
                for i in range(1, 6)
            ],
            'newPageBriefs': [
                {'target': '/guides/new-1', 'inboundLinks': {'placements': [{'source': '/guides/hub-a'}, {'source': '/guides/hub-b'}]}},
                {'target': '/guides/new-4', 'inboundLinks': {'placements': [{'source': '/guides/hub-a'}]}},
            ],
        }))
        large = g.plan_batches(self.root, manifest_path='large-manifest.json', max_new_pages=3)
        self.assertTrue(large['subBatchingRecommended'])
        self.assertTrue(large['disjointPartition'])
        self.assertGreaterEqual(large['batchCount'], 2)
        seen = []
        for b in large['batches']:
            seen.extend(b['routes'])
        self.assertEqual(len(seen), len(set(seen)))
        self.assertEqual(set(seen), {'/guides/new-1', '/guides/new-2', '/guides/new-3', '/guides/new-4', '/guides/new-5', '/guides/hub-a', '/guides/hub-b'})

    def test_prune_failed_routes_quarantines_only_failed_page_and_preserves_valid_chart_for_survivors(self):
        shutil.copyfile(Path(__file__).with_name('quarantine.py'), self.root / '.claude/tools/quarantine.py')
        subprocess.run(['git', 'init', '-q'], cwd=self.root, check=True)
        subprocess.run(['git', 'config', 'user.email', 'test@example.com'], cwd=self.root, check=True)
        subprocess.run(['git', 'config', 'user.name', 'Test'], cwd=self.root, check=True)
        (self.root / 'src/content/guides').mkdir(parents=True, exist_ok=True)
        (self.root / 'public').mkdir(parents=True, exist_ok=True)
        (self.root / 'src/content/guides/existing.md').write_text('# Existing\n')
        (self.root / 'public/sitemap.xml').write_text('<urlset>\n  <url><loc>https://fixture.invalid/existing</loc></url>\n</urlset>\n')
        subprocess.run(['git', 'add', '.'], cwd=self.root, check=True)
        subprocess.run(['git', 'commit', '-qm', 'init'], cwd=self.root, check=True)

        # Build a 2-page manifest (A1=/guides/fixture PASS, A2=/guides/bad-page FAIL, L2=inbound link for A2)
        row2 = copy.deepcopy(self.row)
        row2.update(id='A2', target='/guides/bad-page', reader_question='Which bad option fails?')
        brief2 = copy.deepcopy(self.brief)
        brief2.update(
            actionId='A2',
            target='/guides/bad-page',
            readerAndAnswer={'question': row2['reader_question'], 'answer': row2['answer'], 'placement': row2['answer_placement']},
            inboundLinks={'required': 1, 'placements': [self.link('/existing', '/guides/bad-page')]},
            outboundLinks={'placements': [self.link('/guides/bad-page', '/existing')]},
        )
        link_row = {k: 'n/a' for k in g.COLUMNS}
        link_row.update(id='L2', problem='Add inbound link to /guides/bad-page', solution='Link from /existing to /guides/bad-page', bucket='add internal links', target='/existing')

        self.plan['actions'].extend([row2, link_row])
        self.plan['newPageBriefs'].append(brief2)
        self.plan['request']['requirements'].append({
            'id': 'R2',
            'description': 'Cover bad-page comparison',
            'acceptance': 'Reader sees bad-page breakdown',
            'actionIds': ['A2', 'L2'],
        })
        self.bind_plan()
        g.chart(self.root, self.plan, self.review())

        # Simulate drafted files for both A1 (surviving) and A2 (failed)
        (self.root / 'src/content/guides/fixture.md').write_text('# Passing Page\n')
        (self.root / 'src/content/guides/bad-page.md').write_text('# Failing Page\n')
        (self.root / 'public/sitemap.xml').write_text(
            '<urlset>\n'
            '  <url><loc>https://fixture.invalid/existing</loc></url>\n'
            '  <url><loc>https://fixture.invalid/guides/fixture</loc></url>\n'
            '  <url><loc>https://fixture.invalid/guides/bad-page</loc></url>\n'
            '</urlset>\n'
        )
        snap = {
            'manifest': {'author': 'fixture-worker', 'canonicalBase': 'https://fixture.invalid', 'routes': [{'path': '/guides/fixture'}, {'path': '/guides/bad-page'}]},
            'routes': [{'path': '/guides/fixture', 'fingerprint': 'fp1'}, {'path': '/guides/bad-page', 'fingerprint': 'fp2'}],
        }
        snap['snapshotSha256'] = g.digest(snap)
        r_rev = {
            'reviewer': 'fixture-independent',
            'snapshotSha256': snap['snapshotSha256'],
            'routes': [
                {'path': '/guides/fixture', 'verdict': 'PASS', 'fingerprint': 'fp1'},
                {'path': '/guides/bad-page', 'verdict': 'FAIL', 'fingerprint': 'fp2'},
            ],
        }
        (self.root / 'multi-snap.json').write_text(json.dumps(snap))
        (self.root / 'multi-rev.json').write_text(json.dumps(r_rev))

        pruned = g.prune_failed_routes(
            self.root,
            manifest_path='plan.json',
            review_path='review.json',
            failed_routes=['/guides/bad-page'],
            reason='Final audit hard blocker on /guides/bad-page',
            skill='comparison-content-auto',
            snapshot_path='multi-snap.json',
            audit_review_path='multi-rev.json',
        )
        self.assertEqual(pruned['status'], 'PASS')
        self.assertEqual(pruned['prunedRoutes'], ['/guides/bad-page'])
        self.assertEqual(pruned['survivingSubstantiveRoutes'], ['/guides/fixture'])
        self.assertFalse((self.root / 'src/content/guides/bad-page.md').exists())
        self.assertTrue((self.root / 'src/content/guides/fixture.md').exists())
        self.assertNotIn('bad-page', (self.root / 'public/sitemap.xml').read_text())
        self.assertIn('/guides/fixture', (self.root / 'public/sitemap.xml').read_text())

        # Pruned manifest + review + chart still pass full validate-chart!
        saved_plan = g.read(self.root / 'plan.json')
        saved_rev = g.read(self.root / 'review.json')
        g.chart(self.root, saved_plan, saved_rev)
        g.saved_chart(self.root, saved_plan)

        # Projected snapshot + review contain ONLY the passing page
        proj_snap = g.read(self.root / pruned['projectedAuditPair']['snapshot'])
        proj_rev = g.read(self.root / pruned['projectedAuditPair']['review'])
        self.assertEqual([r['path'] for r in proj_snap['routes']], ['/guides/fixture'])
        self.assertEqual([r['path'] for r in proj_rev['routes']], ['/guides/fixture'])

        # And quarantine ticket was recorded ONLY for bad-page
        q_spec = importlib.util.spec_from_file_location('qm', self.root / '.claude/tools/quarantine.py')
        qm = importlib.util.module_from_spec(q_spec)
        q_spec.loader.exec_module(qm)
        self.assertTrue(qm.is_quarantined(self.root, 'comparison-content-auto', item_id='bad-page', route='/guides/bad-page'))
        self.assertFalse(qm.is_quarantined(self.root, 'comparison-content-auto', item_id='fixture', route='/guides/fixture'))

    def test_prune_failed_routes_handles_empty_outbound_and_pruned_link_hub_and_src_data_json(self):
        """Reproduces drones_and_defense partial-batch edge case:
        - A1 (/guides/fixture) links outbound ONLY to pruned sibling A2 (/guides/bad-page) AND outbound to existing hub (/existing) whose link-edit row L1 is ALSO pruned.
        - A1's inbound link comes from /existing (L1), which is pruned in --failed-route.
        - src/data/people.json contains both fixture and bad-page entries.
        - prune-failed-routes must NOT strip /existing from A1's outboundLinks when /existing is an existing page,
          AND must still pass chart validation even when outboundLinks.placements or inboundLinks.placements becomes [].
        """
        tools_dir = self.root / '.claude/tools'
        tools_dir.mkdir(parents=True, exist_ok=True)
        src_q = Path(__file__).with_name('quarantine.py')
        if src_q.is_file():
            (tools_dir / 'quarantine.py').write_bytes(src_q.read_bytes())

        subprocess.run(['git', 'init', '-q'], cwd=self.root, check=True)
        subprocess.run(['git', 'config', 'user.email', 'test@example.com'], cwd=self.root, check=True)
        subprocess.run(['git', 'config', 'user.name', 'Test'], cwd=self.root, check=True)
        (self.root / 'src/data').mkdir(parents=True, exist_ok=True)
        (self.root / 'src/data/people.json').write_text(json.dumps([{'slug': 'founder-zero', 'name': 'Zero'}]) + '\n')
        subprocess.run(['git', 'add', '.'], cwd=self.root, check=True)
        subprocess.run(['git', 'commit', '-qm', 'init'], cwd=self.root, check=True)

        # A1's ONLY outbound placement points to pruned net-new A2 (/guides/bad-page) -> becomes [] after prune!
        # A1's ONLY inbound placement comes from /existing (link-edit row L1), which is ALSO passed to --failed-route -> becomes [] after prune!
        self.brief['inboundLinks'] = {'required': 1, 'placements': [self.link('/existing', '/guides/fixture')]}
        self.brief['outboundLinks'] = {'placements': [self.link('/guides/fixture', '/guides/bad-page')]}

        row2 = copy.deepcopy(self.row)
        row2.update(id='A2', target='/guides/bad-page', reader_question='Who is bad-page?')
        brief2 = copy.deepcopy(self.brief)
        brief2.update(
            actionId='A2',
            target='/guides/bad-page',
            readerAndAnswer={'question': row2['reader_question'], 'answer': row2['answer'], 'placement': row2['answer_placement']},
            inboundLinks={'required': 1, 'placements': [self.link('/existing', '/guides/bad-page')]},
            outboundLinks={'placements': [self.link('/guides/bad-page', '/existing')]},
        )
        link_row = {k: 'n/a' for k in g.COLUMNS}
        link_row.update(id='L1', problem='Add inbound links on /existing', solution='Link from /existing to /guides/fixture and /guides/bad-page', bucket='add internal links', target='/existing')

        self.plan['actions'].extend([row2, link_row])
        self.plan['newPageBriefs'].append(brief2)
        self.plan['request']['requirements'][0]['actionIds'] = ['A1', 'A2', 'L1']
        self.bind_plan()
        g.chart(self.root, self.plan, self.review())

        # Simulate edits to src/data/people.json for both fixture (PASS) and bad-page (FAIL)
        (self.root / 'src/data/people.json').write_text(json.dumps([
            {'slug': 'founder-zero', 'name': 'Zero'},
            {'slug': 'fixture', 'route': '/guides/fixture', 'name': 'Pass Person'},
            {'slug': 'bad-page', 'route': '/guides/bad-page', 'name': 'Fail Person'},
        ], indent=2) + '\n')

        pruned = g.prune_failed_routes(
            self.root,
            manifest_path='plan.json',
            review_path='review.json',
            failed_routes=['/guides/bad-page', '/existing'],
            reason='Lowery failed depth check and /existing bound to older canonical job',
            skill='trend-pass-auto',
        )
        self.assertEqual(pruned['status'], 'PASS')
        self.assertEqual(pruned['survivingSubstantiveRoutes'], ['/guides/fixture'])
        saved_plan = g.read(self.root / 'plan.json')
        saved_rev = g.read(self.root / 'review.json')
        g.chart(self.root, saved_plan, saved_rev)
        g.saved_chart(self.root, saved_plan)

        # Verify src/data/people.json kept founder-zero + fixture, and dropped bad-page
        people_after = json.loads((self.root / 'src/data/people.json').read_text())
        self.assertEqual([p['slug'] for p in people_after], ['founder-zero', 'fixture'])


if __name__ == '__main__':
    unittest.main()
