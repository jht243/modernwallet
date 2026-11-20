"""Synthetic canonical handoff checks; never actual content approval."""
import copy, hashlib, importlib.util, json, tempfile, unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('handoff_test', Path(__file__).with_name('workflow-handoff.py'))
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)


class Tests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name).resolve()
        (self.root / '.claude').mkdir()
        (self.root / '.claude/content-review-policy.json').write_text('{"siteId":"fixture"}')
        self.candidate = self.root / 'candidate.txt'
        self.candidate.write_text('Synthetic retained candidate. No publication.')
        self.ref = {'path': 'candidate.txt', 'sha256': hashlib.sha256(self.candidate.read_bytes()).hexdigest()}
        self.value = {
            'version': 1, 'siteId': 'fixture', 'canonicalBase': 'https://fixture.example',
            'jobId': 'original', 'producer': 'author', 'nextAction': 'Review this private fixture',
            'routes': ['/guide'], 'candidates': [self.ref], 'sources': [],
            'findings': [{'id': 'F1', 'status': 'open', 'evidence': 'Synthetic unresolved finding preserved across this private test only.'}],
            'reviewCounters': {'reviews': 1, 'reworks': 0},
        }
        self.path = self.put('handoff.json', self.value)

    def put(self, name, value):
        p = self.root / name
        p.write_text(json.dumps(value))
        return p

    def test_focused_task_preserves_actual_open_findings(self):
        task = h.focused(self.root, self.path, 'audit', 'independent')
        self.assertEqual(task['findings'], self.value['findings'])
        self.assertEqual(task['reviewCounters'], self.value['reviewCounters'])
        self.assertNotIn('previous', task)

    def test_independent_reviewer_and_original_site_cannot_be_replaced(self):
        with self.assertRaises(ValueError):
            h.focused(self.root, self.path, 'audit', 'author')
        changed = dict(self.value, siteId='other')
        p = self.put('other.json', changed)
        with self.assertRaises(ValueError):
            h.handoff_check(self.root, p)

    def test_candidate_edits_invalidate_the_old_handoff(self):
        self.candidate.write_text('Different content')
        with self.assertRaises(ValueError):
            h.handoff_check(self.root, self.path)

    def test_job_counters_and_findings_cannot_reset(self):
        for key, value in [('jobId', 'other'), ('reviewCounters', {'reviews': 0, 'reworks': 0}), ('findings', []), ('canonicalBase', 'https://other.example')]:
            current = copy.deepcopy(self.value)
            current[key] = value
            current['previous'] = {'path': self.path.name, 'sha256': hashlib.sha256(self.path.read_bytes()).hexdigest()}
            p = self.put('next.json', current)
            with self.assertRaises(ValueError):
                h.handoff_check(self.root, p)

    def test_seal_preserves_exact_immutable_evidence(self):
        out = self.root / 'sealed.json'
        h.seal(self.root, self.path, out, h.api())
        h.handoff_check(self.root, out)
        self.candidate.write_text('Source moved on after an immutable snapshot')
        h.handoff_check(self.root, out)
        with self.assertRaises(ValueError):
            h.seal(self.root, self.path, out, h.api())

    def test_auto_seal_write_audit_rework_publish_portable_chain(self):
        (self.root / '.claude/content-review-policy.json').write_text(
            json.dumps({'siteId': 'fixture', 'canonicalHosts': ['fixture.example']})
        )
        (self.root / '.claude/tools').mkdir(parents=True, exist_ok=True)
        (self.root / '.claude/tools/rendered-audit.py').write_text(
            'def review_check(snap, rev):\n'
            '    if rev.get("routes", [{}])[0].get("verdict") != "PASS":\n'
            '        raise ValueError("not pass")\n'
        )
        run_dir = self.root / 'reports/mindmap-pass/run-1'
        run_dir.mkdir(parents=True)
        chart_rev = run_dir / 'chart-review.json'
        chart_rev.write_text(json.dumps({'verdict': 'PASS', 'jobId': 'job-auto-1'}))
        manifest = run_dir / 'approval-manifest.json'
        manifest.write_text(json.dumps({
            'jobId': 'job-auto-1',
            'actions': [
                {'id': 'A1', 'bucket': 'create new content', 'target': '/guides/alpha'},
                {'id': 'A2', 'bucket': 'add internal links', 'target': '/guides/beta'},
            ],
        }))
        hw = run_dir / 'handoff-write-v1.json'
        res_w = h.auto_seal(
            self.root, phase='write', manifest_path=manifest, producer='chart-reviewer-1',
            out_path=hw, review_path=chart_rev,
        )
        self.assertEqual(res_w['routes'], ['/guides/alpha', '/guides/beta'])
        h.handoff_check(self.root, hw)
        h.focused(self.root, hw, 'write', 'writer-1')

        snap1 = run_dir / 'snapshot-r1.json'
        snap1.write_text(json.dumps({'manifest': {'author': 'writer-1'}, 'routes': [{'path': '/guides/alpha'}, {'path': '/guides/beta'}]}))
        ha1 = run_dir / 'handoff-audit-v1.json'
        h.auto_seal(
            self.root, phase='audit', manifest_path=manifest, producer='writer-1',
            out_path=ha1, previous_path=hw, snapshot_path=snap1,
        )
        h.handoff_check(self.root, ha1)
        h.focused(self.root, ha1, 'audit', 'auditor-1')

        # Round 1 FAIL -> rework handoff back to WRITE imports FAIL findings and bumps reviews
        rev1 = run_dir / 'review-r1.json'
        rev1.write_text(json.dumps({
            'reviewer': 'auditor-1',
            'routes': [{
                'path': '/guides/alpha',
                'verdict': 'FAIL',
                'checks': {'internalLinks': {'status': 'FAIL', 'evidence': 'Outbound link anchor is generic click-here text instead of descriptive topic text.'}},
                'factualReview': {},
            }],
        }))
        hw2 = run_dir / 'handoff-write-v2.json'
        res_w2 = h.auto_seal(
            self.root, phase='write', manifest_path=manifest, producer='auditor-1',
            out_path=hw2, previous_path=ha1, snapshot_path=snap1, review_path=rev1, rework=True,
        )
        self.assertEqual(res_w2['reviewCounters']['reviews'], 2)
        sealed_w2 = json.loads(hw2.read_text())
        self.assertGreaterEqual(len(sealed_w2['findings']), 1)
        h.handoff_check(self.root, hw2)

        # Round 2 WRITE -> AUDIT -> PUBLISH
        snap2 = run_dir / 'snapshot-r2.json'
        snap2.write_text(json.dumps({'manifest': {'author': 'writer-1'}, 'routes': [{'path': '/guides/alpha'}, {'path': '/guides/beta'}]}))
        ha2 = run_dir / 'handoff-audit-v2.json'
        res_a2 = h.auto_seal(
            self.root, phase='audit', manifest_path=manifest, producer='writer-1',
            out_path=ha2, previous_path=hw2, snapshot_path=snap2, rework=True,
        )
        self.assertEqual(res_a2['reviewCounters'], {'reviews': 2, 'reworks': 1})
        h.handoff_check(self.root, ha2)

        rev2 = run_dir / 'review-r2.json'
        rev2.write_text(json.dumps({'reviewer': 'auditor-1', 'routes': [{'path': '/guides/alpha', 'verdict': 'PASS'}]}))
        hp = run_dir / 'handoff-publish-v1.json'
        res_p = h.auto_seal(
            self.root, phase='publish', manifest_path=manifest, producer='auditor-1',
            out_path=hp, previous_path=ha2, snapshot_path=snap2, review_path=rev2,
        )
        self.assertEqual(res_p['reviewCounters'], {'reviews': 3, 'reworks': 1})
        h.handoff_check(self.root, hp)

    def test_auto_seal_refuses_post_cap_write_when_all_audits_exhausted(self):
        crp_src = Path(__file__).with_name('content-review-policy.py')
        ren_src = Path(__file__).with_name('rendered-audit.py')
        dur_src = Path(__file__).with_name('content-review-durable.py')
        (self.root / '.claude/tools').mkdir(parents=True, exist_ok=True)
        (self.root / '.claude/commands').mkdir(parents=True, exist_ok=True)
        (self.root / '.claude/tools/content-review-policy.py').write_bytes(crp_src.read_bytes())
        (self.root / '.claude/tools/rendered-audit.py').write_bytes(ren_src.read_bytes())
        (self.root / '.claude/tools/content-review-durable.py').write_bytes(dur_src.read_bytes())
        (self.root / '.claude/commands/_content-review-policy.md').write_text('Fixture policy contract.\n')
        (self.root / '.claude/content-review-policy.json').write_text(json.dumps({
            'version': 'risk-review-budget-2026-11-08.1',
            'siteId': 'fixture',
            'defaultProfile': 'light',
            'minimumProfile': 'light',
            'roundLimits': {'light': 1, 'standard': 2, 'high': 3},
            'releaseAtAuditLimit': True,
            'canonicalHosts': ['fixture.example'],
        }))
        import subprocess
        subprocess.run(['git', 'init', '-q', str(self.root)], check=True)
        spec_c = importlib.util.spec_from_file_location('crp_handoff_t', self.root / '.claude/tools/content-review-policy.py')
        crp = importlib.util.module_from_spec(spec_c); spec_c.loader.exec_module(crp)
        spec_r = importlib.util.spec_from_file_location('ren_handoff_t', self.root / '.claude/tools/rendered-audit.py')
        ren = importlib.util.module_from_spec(spec_r); spec_r.loader.exec_module(ren)

        run_dir = self.root / 'reports/mindmap-pass/run-cap'
        run_dir.mkdir(parents=True)
        manifest = run_dir / 'approval-manifest.json'
        manifest.write_text(json.dumps({
            'jobId': 'job-cap-1',
            'actions': [{'id': 'A1', 'bucket': 'create new content', 'target': '/guides/alpha'}],
        }))
        html = (
            '<html><head><title>Alpha</title><link rel="canonical" href="https://fixture.example/guides/alpha">'
            '<meta name="robots" content="index,follow">'
            '<script type="application/ld+json">{"@type":"Article","datePublished":"2026-11-13","dateModified":"2026-11-13","url":"https://fixture.example/guides/alpha"}</script>'
            '</head><body><main><h1>Alpha</h1><p>Updated Nov 13, 2026</p><p>' + ('Plain clinic pricing overview. ' * 15) + '</p></main></body></html>'
        )
        rspec = {'path': '/guides/alpha', 'expectedUpdatedDate': '2026-11-13', 'claimCategories': ['ordinary']}
        page = ren.parse(html, rspec, 'http://localhost:3000', 'https://fixture.example')
        snap = {
            'manifest': {'author': 'writer-1', 'canonicalBase': 'https://fixture.example', 'workflowKind': 'mindmap-pass', 'routes': [rspec]},
            'routes': [page],
            'baseUrl': 'https://fixture.example',
            'capturedAt': '2026-11-13T18:00:00+00:00',
            'contentReviewPolicy': {'version': crp.VERSION, 'sha256': crp.policy_hash(self.root)},
        }
        snap['snapshotSha256'] = ren.digest({k: v for k, v in snap.items() if k != 'snapshotSha256'})
        snap_path = run_dir / 'snapshot-r1.json'
        snap_path.write_text(json.dumps(snap))
        admit = crp.reserve(self.root, snap_path, '/guides/alpha', 'job-cap-1', 'auditor-1', run_dir / 'admit-r1.json')
        text = crp.claim_text(page['semantic'])
        rev = {
            'reviewer': 'auditor-1',
            'snapshotSha256': snap['snapshotSha256'],
            'routes': [{
                'path': '/guides/alpha',
                'fingerprint': page['fingerprint'],
                'verdict': 'FAIL',
                'reviewProfile': 'light',
                'reviewBudget': admit['admissionArtifact'],
                'riskAssessment': {
                    'textSha256': crp.sha(text.encode()),
                    'rationale': 'Ordinary pricing overview with zero medical dosing or acute safety liability.',
                    'consequentialClaims': [],
                    'incidentalMentions': [],
                },
                'checks': {
                    k: {'status': 'FAIL' if k == 'sourceSupport' else 'PASS', 'evidence': 'Synthetic test evidence verifying audit-exhaustion guard behavior.'}
                    for k in ren.CHECKS
                },
                'factualReview': {
                    k: {'status': 'PASS', 'evidence': 'Synthetic factual check evidence for handoff cap test.'}
                    for k in crp.FACTS['light'] + ['riskClassification', 'seoQuality']
                },
            }],
        }
        rev_path = run_dir / 'review-r1.json'
        rev_path.write_text(json.dumps(rev))
        crp.record(self.root, rev_path)

        with self.assertRaisesRegex(ValueError, 'exhausted their audit budget'):
            h.auto_seal(
                self.root, phase='write', manifest_path=manifest, producer='auditor-1',
                out_path=run_dir / 'forbidden-write.json', snapshot_path=snap_path, review_path=rev_path, rework=True,
            )

    def test_extract_routes_includes_inbound_link_sources_and_reserve_batch_scopes_to_handoff(self):
        manifest_obj = {
            'jobId': 'job-links-1',
            'actions': [
                {'id': 'R1', 'bucket': 'create new content', 'target': '/study/alliteration-poems/'},
            ],
            'newPageBriefs': [{
                'target': '/study/alliteration-poems/',
                'links': {
                    'inbound': [
                        {'source': '/study/figurative-language/'},
                        {'source': '/study/onomatopoeia-examples/#comparing'},
                    ],
                },
            }],
        }
        routes = h._extract_routes(manifest_obj)
        self.assertEqual(routes, ['/study/alliteration-poems/', '/study/figurative-language/', '/study/onomatopoeia-examples/'])

    def test_portable_auto_seal_aligns_trailing_slash_and_www_canonical_base_to_snapshot(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / '.claude/tools').mkdir(parents=True)
            (root / '.claude/tools/rendered-audit.py').write_bytes((Path(__file__).with_name('rendered-audit.py')).read_bytes())
            (root / '.claude/content-review-policy.json').write_text(json.dumps({
                'siteId': 'jht243/chalkbox',
                'canonicalHosts': ['chalkbox.org', 'www.chalkbox.org'],
            }))
            (root / 'astro.config.mjs').write_text(
                "// Business: Chalkbox — https://chalkbox.org\n"
                "export default defineConfig({ site: 'https://www.chalkbox.org', trailingSlash: 'always' });\n"
            )
            (root / 'readiness.md').write_text('# Ready\nVerified preparation checklist.\n')
            manifest = root / 'approval-manifest.json'
            manifest.write_text(json.dumps({
                'jobId': 'trend-chalkbox-1',
                'actions': [{'id': 'A1', 'bucket': 'create new content', 'target': '/classroom/this-or-that-template'}],
                'newPageBriefs': [{
                    'target': '/classroom/this-or-that-template',
                    'inboundLinks': {'placements': [{'source': '/classroom/icebreakers'}]},
                }],
            }))
            hw = root / 'handoff-write.json'
            # Simulate an older slashless/apex handoff-write followed by a trailingSlash+www snapshot
            h.auto_seal(root, phase='write', manifest_path=manifest, producer='build-1', out_path=hw, readiness_path=root / 'readiness.md')
            raw_hw = json.loads(hw.read_text())
            self.assertEqual(raw_hw['canonicalBase'], 'https://www.chalkbox.org')
            self.assertEqual(raw_hw['routes'], ['/classroom/this-or-that-template/', '/classroom/icebreakers/'])

            # Also verify backward-compat when previous handoff had apex + slashless routes
            legacy_hw = root / 'handoff-write-legacy.json'
            legacy_obj = dict(raw_hw, canonicalBase='https://chalkbox.org', routes=['/classroom/this-or-that-template', '/classroom/icebreakers'])
            legacy_hw.write_text(json.dumps(legacy_obj, indent=2) + '\n')
            snap = root / 'snapshot.json'
            snap.write_text(json.dumps({
                'manifest': {'canonicalBase': 'https://www.chalkbox.org'},
                'routes': [{'path': '/classroom/this-or-that-template/'}, {'path': '/classroom/icebreakers/'}],
            }))
            ha = root / 'handoff-audit.json'
            h.auto_seal(
                root, phase='audit', manifest_path=manifest, producer='write-1', actor='auditor-1',
                previous_path=legacy_hw, snapshot_path=snap, out_path=ha, readiness_path=root / 'readiness.md',
            )
            sealed_ha = json.loads(ha.read_text())
            self.assertEqual(sealed_ha['canonicalBase'], 'https://www.chalkbox.org')
            self.assertEqual(sealed_ha['routes'], ['/classroom/this-or-that-template/', '/classroom/icebreakers/'])

    def test_rework_locks_round1_pass_routes_and_publish_composes_review_pairs_and_active_write_docs(self):
        crp_src = Path(__file__).with_name('content-review-policy.py')
        ren_src = Path(__file__).with_name('rendered-audit.py')
        dur_src = Path(__file__).with_name('content-review-durable.py')
        gates_src = Path(__file__).with_name('mindmap-gates.py')
        (self.root / '.claude/tools').mkdir(parents=True, exist_ok=True)
        (self.root / '.claude/commands/mindmap-pass').mkdir(parents=True, exist_ok=True)
        (self.root / '.claude/tools/content-review-policy.py').write_bytes(crp_src.read_bytes())
        (self.root / '.claude/tools/rendered-audit.py').write_bytes(ren_src.read_bytes())
        (self.root / '.claude/tools/content-review-durable.py').write_bytes(dur_src.read_bytes())
        (self.root / '.claude/tools/mindmap-gates.py').write_bytes(gates_src.read_bytes())
        for doc in ('phase-2-metadata.md', 'phase-3-new-content.md', 'phase-3c-tool-build.md', 'phase-5-body.md', 'phase-6-internal-linking.md'):
            (self.root / '.claude/commands/mindmap-pass' / doc).write_text(f'# {doc}\n')
        (self.root / '.claude/commands/_content-review-policy.md').write_text('Fixture policy contract.\n')
        (self.root / '.claude/content-review-policy.json').write_text(json.dumps({
            'version': 'risk-review-budget-2026-11-08.1',
            'siteId': 'fixture',
            'defaultProfile': 'standard',
            'minimumProfile': 'standard',
            'roundLimits': {'light': 1, 'standard': 2, 'high': 3},
            'releaseAtAuditLimit': True,
            'canonicalHosts': ['fixture.example'],
        }))
        import subprocess
        subprocess.run(['git', 'init', '-q', str(self.root)], check=True)
        spec_c = importlib.util.spec_from_file_location('crp_r2_t', self.root / '.claude/tools/content-review-policy.py')
        crp = importlib.util.module_from_spec(spec_c); spec_c.loader.exec_module(crp)
        spec_r = importlib.util.spec_from_file_location('ren_r2_t', self.root / '.claude/tools/rendered-audit.py')
        ren = importlib.util.module_from_spec(spec_r); spec_r.loader.exec_module(ren)

        run_dir = self.root / 'reports/mindmap-pass/run-delta'
        run_dir.mkdir(parents=True)
        (run_dir / 'readiness.md').write_text('# Ready\n')
        manifest = run_dir / 'approval-manifest.json'
        manifest.write_text(json.dumps({
            'jobId': 'job-delta-1',
            'actions': [
                {'id': 'A1', 'bucket': 'create new content', 'target': '/guides/pass-one', 'resolved_deliverable': 'text'},
                {'id': 'A2', 'bucket': 'create new content', 'target': '/guides/fail-two', 'resolved_deliverable': 'text'},
            ],
        }))

        # Verify _active_write_instructions strips tool-build & phase-5-body when only new text pages exist
        active_docs = h._active_write_instructions(self.root, json.loads(manifest.read_text()), '.claude/agents/mindmap-write.md')
        self.assertIn('.claude/commands/mindmap-pass/phase-3-new-content.md', active_docs)
        self.assertNotIn('.claude/commands/mindmap-pass/phase-3c-tool-build.md', active_docs)
        self.assertNotIn('.claude/commands/mindmap-pass/phase-5-body.md', active_docs)

        def make_page(route, title_txt, body_phrase):
            html = (
                f'<html><head><title>{title_txt}</title><link rel="canonical" href="https://fixture.example{route}">'
                '<meta name="robots" content="index,follow">'
                f'<script type="application/ld+json">{{"@type":"Article","datePublished":"2026-11-15","dateModified":"2026-11-15","url":"https://fixture.example{route}"}}</script>'
                f'</head><body><main><h1>{title_txt}</h1><p>Updated Nov 15, 2026</p><p>' + (body_phrase * 16) + '</p></main></body></html>'
            )
            rspec = {'path': route, 'expectedUpdatedDate': '2026-11-15', 'claimCategories': ['ordinary']}
            return rspec, ren.parse(html, rspec, 'http://localhost:3000', 'https://fixture.example')

        rs1, p1 = make_page('/guides/pass-one', 'Pass One', 'Verified primary source benchmark data. ')
        rs2, p2 = make_page('/guides/fail-two', 'Fail Two', 'Initial draft needing source citation fix. ')
        snap_r1 = {
            'manifest': {'author': 'writer-1', 'canonicalBase': 'https://fixture.example', 'workflowKind': 'mindmap-pass', 'jobId': 'job-delta-1', 'routes': [rs1, rs2]},
            'routes': [p1, p2],
            'baseUrl': 'https://fixture.example',
            'capturedAt': '2026-11-15T12:00:00+00:00',
            'contentReviewPolicy': {'version': crp.VERSION, 'sha256': crp.policy_hash(self.root)},
        }
        snap_r1['snapshotSha256'] = ren.digest({k: v for k, v in snap_r1.items() if k != 'snapshotSha256'})
        snap_r1_path = run_dir / 'snapshot-r1.json'
        snap_r1_path.write_text(json.dumps(snap_r1))

        adm1 = crp.reserve(self.root, snap_r1_path, '/guides/pass-one', 'job-delta-1', 'auditor-1', run_dir / 'adm-1.json')
        adm2 = crp.reserve(self.root, snap_r1_path, '/guides/fail-two', 'job-delta-1', 'auditor-1', run_dir / 'adm-2.json')
        rev_r1 = {
            'jobId': 'job-delta-1',
            'reviewer': 'auditor-1',
            'snapshotSha256': snap_r1['snapshotSha256'],
            'routes': [
                {
                    'path': '/guides/pass-one',
                    'fingerprint': p1['fingerprint'],
                    'verdict': 'PASS',
                    'reviewProfile': 'standard',
                    'reviewBudget': adm1['admissionArtifact'],
                    'riskAssessment': {'textSha256': crp.sha(crp.claim_text(p1['semantic']).encode()), 'rationale': 'Standard non-YMYL guide with zero medical, legal, financial, or safety claims.', 'consequentialClaims': [], 'incidentalMentions': []},
                    'checks': {k: {'status': 'PASS', 'evidence': 'Verified clean PASS on route 1 against primary evidence artifacts.'} for k in ren.CHECKS},
                    'factualReview': {k: {'status': 'PASS', 'evidence': 'Verified factual support on route 1 against captured vendor specifications.'} for k in crp.FACTS['standard'] + ['riskClassification', 'seoQuality']},
                },
                {
                    'path': '/guides/fail-two',
                    'fingerprint': p2['fingerprint'],
                    'verdict': 'FAIL',
                    'reviewProfile': 'standard',
                    'reviewBudget': adm2['admissionArtifact'],
                    'riskAssessment': {'textSha256': crp.sha(crp.claim_text(p2['semantic']).encode()), 'rationale': 'Standard non-YMYL guide with zero medical, legal, financial, or safety claims.', 'consequentialClaims': [], 'incidentalMentions': []},
                    'checks': {k: {'status': 'FAIL' if k == 'sourceSupport' else 'PASS', 'evidence': 'Missing inline citation on route 2 for battery runtime claim.'} for k in ren.CHECKS},
                    'factualReview': {k: {'status': 'PASS', 'evidence': 'Verified factual support on route 2 except missing inline citation.'} for k in crp.FACTS['standard'] + ['riskClassification', 'seoQuality']},
                },
            ],
        }
        rev_r1_path = run_dir / 'review-r1.json'
        rev_r1_path.write_text(json.dumps(rev_r1))
        crp.record(self.root, rev_r1_path)

        hw1 = run_dir / 'handoff-write-r1.json'
        h.auto_seal(self.root, phase='write', manifest_path=manifest, producer='build-1', out_path=hw1, readiness_path=run_dir / 'readiness.md')
        ha1 = run_dir / 'handoff-audit-r1.json'
        h.auto_seal(self.root, phase='audit', manifest_path=manifest, producer='writer-1', actor='auditor-1', previous_path=hw1, snapshot_path=snap_r1_path, out_path=ha1, readiness_path=run_dir / 'readiness.md')

        # Seal Round-2 rework: automatically projects /guides/pass-one into lockedReviewPair!
        hw2_res = h.auto_seal(
            self.root, phase='write', manifest_path=manifest, producer='auditor-1', actor='writer-1',
            previous_path=ha1, snapshot_path=snap_r1_path, review_path=rev_r1_path, rework=True,
            out_path=run_dir / 'handoff-write-r2.json', readiness_path=run_dir / 'readiness.md',
        )
        self.assertIn('lockedReviewPair', hw2_res)
        self.assertEqual(hw2_res['lockedReviewPair']['routes'], ['/guides/pass-one'])
        self.assertIn('--only-rework-from', hw2_res['round2CaptureFlags'])

        # Verify rendered-audit init_manifest --only-rework-from scopes Round 2 strictly to /guides/fail-two
        r2_man_res = ren.init_manifest(
            manifest, 'writer-1', run_dir / 'r2-audit-manifest.json',
            root=self.root, canonical_base='https://fixture.example', only_rework_from=rev_r1_path,
        )
        self.assertEqual([r['path'] for r in json.loads((run_dir / 'r2-audit-manifest.json').read_text())['routes']], ['/guides/fail-two'])
        self.assertEqual(len(r2_man_res['routes']), 1)

        # Capture & audit ONLY /guides/fail-two in Round 2, then seal unified publish handoff via reviewPairs!
        rs2_fixed, p2_fixed = make_page('/guides/fail-two', 'Fail Two', 'Repaired inline citation with verified source support. ')
        snap_r2 = {
            'manifest': {'author': 'writer-1', 'canonicalBase': 'https://fixture.example', 'workflowKind': 'mindmap-pass', 'jobId': 'job-delta-1', 'routes': [rs2_fixed]},
            'routes': [p2_fixed],
            'baseUrl': 'https://fixture.example',
            'capturedAt': '2026-11-15T12:10:00+00:00',
            'contentReviewPolicy': {'version': crp.VERSION, 'sha256': crp.policy_hash(self.root)},
        }
        snap_r2['snapshotSha256'] = ren.digest({k: v for k, v in snap_r2.items() if k != 'snapshotSha256'})
        snap_r2_path = run_dir / 'snapshot-r2.json'
        snap_r2_path.write_text(json.dumps(snap_r2))
        adm2_r2 = crp.reserve(self.root, snap_r2_path, '/guides/fail-two', 'job-delta-1', 'auditor-1', run_dir / 'adm-2-r2.json')
        rev_r2 = {
            'jobId': 'job-delta-1',
            'reviewer': 'auditor-1',
            'snapshotSha256': snap_r2['snapshotSha256'],
            'routes': [{
                'path': '/guides/fail-two',
                'fingerprint': p2_fixed['fingerprint'],
                'verdict': 'PASS',
                'reviewProfile': 'standard',
                'reviewBudget': adm2_r2['admissionArtifact'],
                'riskAssessment': {'textSha256': crp.sha(crp.claim_text(p2_fixed['semantic']).encode()), 'rationale': 'Standard non-YMYL guide with zero medical, legal, financial, or safety claims.', 'consequentialClaims': [], 'incidentalMentions': []},
                'checks': {k: {'status': 'PASS', 'evidence': 'Citation repaired in Round 2 with verified primary-source link.'} for k in ren.CHECKS},
                'factualReview': {k: {'status': 'PASS', 'evidence': 'Verified factual support in Round 2 against captured vendor specifications.'} for k in crp.FACTS['standard'] + ['riskClassification', 'seoQuality']},
            }],
        }
        rev_r2_path = run_dir / 'review-r2.json'
        rev_r2_path.write_text(json.dumps(rev_r2))
        crp.record(self.root, rev_r2_path)

        ha2 = run_dir / 'handoff-audit-r2.json'
        h.auto_seal(
            self.root, phase='audit', manifest_path=manifest, producer='writer-1', actor='auditor-1',
            previous_path=run_dir / 'handoff-write-r2.json', snapshot_path=snap_r2_path, out_path=ha2,
            readiness_path=run_dir / 'readiness.md',
        )
        hp = run_dir / 'handoff-publish.json'
        pub_res = h.auto_seal(
            self.root, phase='publish', manifest_path=manifest, producer='auditor-1',
            previous_path=ha2,
            review_pairs=[
                (self.root / hw2_res['lockedReviewPair']['snapshot'], self.root / hw2_res['lockedReviewPair']['review']),
                (snap_r2_path, rev_r2_path),
            ],
            out_path=hp, readiness_path=run_dir / 'readiness.md',
        )
        self.assertEqual(pub_res['phase'], 'publish')
        checked_pub = h.handoff_check(self.root, hp, 'publish')
        self.assertEqual(len(checked_pub['reviewPairs']), 2)
        self.assertEqual(set(checked_pub['routes']), {'/guides/pass-one', '/guides/fail-two'})

    def test_auto_seal_does_not_leak_preflight_reuse_across_sibling_runs(self):
        (self.root / '.claude/content-review-policy.json').write_text(json.dumps({
            'version': 'risk-review-budget-2026-11-08.1',
            'siteId': 'fixture',
            'defaultProfile': 'standard',
            'minimumProfile': 'standard',
            'roundLimits': {'light': 1, 'standard': 2, 'high': 3},
            'releaseAtAuditLimit': True,
            'canonicalHosts': ['fixture.example'],
        }))
        old_pf = self.root / 'reports/search-gap/run-old/preflight-audit'
        old_pf.mkdir(parents=True)
        (old_pf / 'manifest.json').write_text(json.dumps({
            'phase': 'audit', 'actor': 'sg-auditor', 'runId': 'old-run-id',
            'contextId': 'old-ctx', 'contextEpoch': '1',
            'parts': ['p1'], 'delivered': [1],
        }))
        run_new = self.root / 'reports/search-gap/run-new'
        run_new.mkdir(parents=True)
        (run_new / 'readiness.md').write_text('# Ready\n')
        manifest = run_new / 'approval-manifest.json'
        manifest.write_text(json.dumps({
            'jobId': 'job-new-1',
            'actions': [{'id': 'A1', 'bucket': 'create new content', 'target': '/guides/new-one', 'resolved_deliverable': 'text'}],
        }))
        res = h.auto_seal(
            self.root, phase='audit', manifest_path=manifest, producer='sg-writer', actor='sg-auditor',
            out_path=run_new / 'handoff-audit.json', readiness_path=run_new / 'readiness.md',
        )
        self.assertNotIn('autoDetectedReuseDir', res)
        self.assertNotIn('--reuse', res['workerPrepareCommand'])
        self.assertNotIn('old-run-id', res['workerPrepareCommand'])


if __name__ == '__main__':
    unittest.main()
