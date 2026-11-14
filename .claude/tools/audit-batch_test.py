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


if __name__ == '__main__':
    unittest.main()
