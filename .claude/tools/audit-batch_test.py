#!/usr/bin/env python3
"""Unit tests for audit-batch.py pending-slot resume hash matching."""
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import types
import unittest


def load_audit_batch():
    path = Path(__file__).with_name('audit-batch.py')
    spec = importlib.util.spec_from_file_location('audit_batch_mod', path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class FakeJournalCtx:
    def __init__(self, cycle):
        self.cycle = cycle

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False


class AuditBatchPendingResumeTests(unittest.TestCase):
    def test_resumes_pending_slot_when_admission_stores_snapshot_file_sha256(self):
        mod = load_audit_batch()
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            snap_rel = 'reports/run/snapshot.json'
            snap_file = root / snap_rel
            snap_file.parent.mkdir(parents=True, exist_ok=True)
            snapshot_doc = {
                'snapshotSha256': 'semantic-digest-' + 'a' * 48,
                'manifest': {'canonicalBase': 'https://www.modernwallet.org'},
                'routes': [{'path': '/guides/best-cards', 'fingerprint': 'fp1'}],
            }
            snap_bytes = (json.dumps(snapshot_doc, indent=2) + '\n').encode('utf-8')
            snap_file.write_bytes(snap_bytes)
            file_sha = hashlib.sha256(snap_bytes).hexdigest()
            self.assertNotEqual(file_sha, snapshot_doc['snapshotSha256'])

            adm_rel = 'reports/run/admit-r2.json'
            adm_doc = {
                'reviewer': 'mindmap-audit',
                'round': 2,
                'snapshot': {'path': snap_rel, 'sha256': file_sha},
            }
            (root / adm_rel).write_text(json.dumps(adm_doc))
            adm_ref = {'path': adm_rel, 'sha256': hashlib.sha256(json.dumps(adm_doc).encode()).hexdigest()}

            cycle = {'rounds': [{'number': 2, 'status': 'pending', 'admission': adm_ref}]}
            crp = types.SimpleNamespace(
                durable_reviews=lambda r: types.SimpleNamespace(restore=lambda r2, j: None, cache=lambda *a: None),
                Journal=lambda r, base, route: FakeJournalCtx(cycle),
                artifact=lambda r, ref: r / ref['path'],
                read=lambda p: json.loads(Path(p).read_text()),
                sha=lambda b: hashlib.sha256(b).hexdigest(),
                require=lambda cond, msg: (_ for _ in ()).throw(ValueError(msg)) if not cond else None,
            )

            res = mod._reserve_or_repair_route(
                root,
                crp,
                snapshot_doc,
                snap_file,
                snapshot_doc['routes'][0],
                'job-123',
                'mindmap-audit',
                root / 'reports/run/out-adm.json',
                prior_reports=(),
                preflight=None,
                accepts_preflight=True,
                repair_pending_failure=None,
            )
            self.assertEqual(res['round'], 2)
            self.assertEqual(res['admissionArtifact'], adm_ref)

    def test_routine_control_runbook_omits_forbidden_reviewer_bash_helpers(self):
        rb_path = Path(__file__).with_name('workflow-runbook.py')
        spec = importlib.util.spec_from_file_location('rb_mod', rb_path)
        rb = importlib.util.module_from_spec(spec); spec.loader.exec_module(rb)
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            rc_dir = root / 'reports/routine-control/preflight/toolu_123'
            rc_dir.mkdir(parents=True, exist_ok=True)
            (rc_dir / 'manifest.json').write_text(json.dumps({'phase': 'audit', 'actor': 'a12345', 'runId': 'run-1'}))
            out = rb.render_runbook(root, rc_dir, 'audit')
            self.assertIn('ROUTINE-CONTROL READ-ONLY REVIEWER MODE', out)
            self.assertNotIn('audit-batch.py reserve-batch', out)
            normal_dir = root / 'reports/mindmap-pass/run/preflight-audit'
            normal_dir.mkdir(parents=True, exist_ok=True)
            (normal_dir / 'manifest.json').write_text(json.dumps({'phase': 'audit', 'actor': 'a12345', 'runId': 'run-1'}))
            normal = rb.render_runbook(root, normal_dir, 'audit')
            self.assertIn('audit-batch.py reserve-batch', normal)

    def test_repairs_intact_pending_slot_across_reviewers_via_cross_job_continuation(self):
        mod = load_audit_batch()
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            snap_rel = 'reports/run/candidate-r3.json'
            snap_file = root / snap_rel
            snap_file.parent.mkdir(parents=True, exist_ok=True)
            snapshot_doc = {
                'manifest': {
                    'author': 'main-builder',
                    'workflowKind': 'mindmap-pass',
                    'canonicalBase': 'https://www.banthebots.org',
                    'routes': [{'path': '/explainers/no-robo-bosses-act-sb-947'}],
                },
                'routes': [{'path': '/explainers/no-robo-bosses-act-sb-947', 'fingerprint': 'fp-r3'}],
                'snapshotSha256': 'orig-semantic-' + 'b' * 50,
            }
            snap_bytes = (json.dumps(snapshot_doc, indent=2) + '\n').encode('utf-8')
            snap_file.write_bytes(snap_bytes)
            file_sha = hashlib.sha256(snap_bytes).hexdigest()

            adm_rel = 'reports/run/admissions/admission-1.json'
            adm_doc = {
                'jobId': 'competitor-8cfa84950fb7',
                'reviewer': 'old-reviewer-a059',
                'number': 3,
                'snapshot': {'path': snap_rel, 'sha256': file_sha},
            }
            (root / adm_rel).parent.mkdir(parents=True, exist_ok=True)
            (root / adm_rel).write_text(json.dumps(adm_doc))
            adm_ref = {'path': adm_rel, 'sha256': hashlib.sha256(json.dumps(adm_doc).encode()).hexdigest()}

            cycle = {
                'jobId': 'competitor-8cfa84950fb7',
                'rounds': [{'number': 3, 'status': 'pending', 'admission': adm_ref}],
            }
            cached = []

            def fake_repair_pending(r, sp, route, job, reviewer, out, failure):
                # Simulate content-review-policy.py's durable.restore re-materializing original
                if not snap_file.is_file():
                    snap_file.write_bytes(snap_bytes)
                rep_doc = json.loads(Path(sp).read_text())
                snap_job = rep_doc.get('manifest', {}).get('jobId')
                cross_job = bool(
                    isinstance(snap_job, str)
                    and snap_job.strip()
                    and snap_job != adm_doc['jobId']
                    and rep_doc.get('snapshotSha256') != adm_doc['snapshot']['sha256']
                )
                if not cross_job:
                    raise ValueError('The original admission is intact; resume it normally')
                self.assertEqual(job, 'competitor-8cfa84950fb7')
                self.assertTrue(failure.is_file() and len(failure.read_bytes()) >= 100)
                out.write_text(json.dumps({'reviewer': reviewer, 'continuationJobId': snap_job}))
                return {
                    'number': 3,
                    'maximumRounds': 3,
                    'reviewer': reviewer,
                    'continuationJobId': snap_job,
                    'admissionArtifact': {'path': str(out.relative_to(r)), 'sha256': 'c' * 64},
                }

            crp = types.SimpleNamespace(
                durable_reviews=lambda r: types.SimpleNamespace(
                    restore=lambda r2, j: None,
                    cache=lambda r2, name, exp, raw: cached.append((name, exp)),
                ),
                Journal=lambda r, base, route: FakeJournalCtx(cycle),
                artifact=lambda r, ref: r / ref['path'],
                inside=lambda r, rel: r / rel,
                read=lambda p: json.loads(Path(p).read_text()),
                sha=lambda b: hashlib.sha256(b).hexdigest(),
                require=lambda cond, msg: (_ for _ in ()).throw(ValueError(msg)) if not cond else None,
                repair_pending=fake_repair_pending,
            )
            renderer = types.SimpleNamespace(
                digest=lambda val: hashlib.sha256(json.dumps(val, sort_keys=True).encode()).hexdigest(),
            )
            shared = {}
            res = mod._reserve_or_repair_route(
                root,
                crp,
                snapshot_doc,
                snap_file,
                snapshot_doc['routes'][0],
                'competitor-8cfa84950fb7',
                'af6fb3263c7646f4d',
                root / 'reports/run/admissions/admission-1.json',
                prior_reports=(),
                preflight=None,
                accepts_preflight=True,
                repair_pending_failure=None,
                renderer=renderer,
                shared_cont_state=shared,
            )
            self.assertEqual(res['reviewer'], 'af6fb3263c7646f4d')
            self.assertTrue(res['continuationJobId'].startswith('competitor-8cfa84950fb7-cont-'))
            self.assertEqual(cached, [(snap_rel, file_sha)])
            self.assertIn('doc', shared)


if __name__ == '__main__':
    unittest.main()
