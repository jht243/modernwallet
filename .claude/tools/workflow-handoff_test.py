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


if __name__ == '__main__':
    unittest.main()
