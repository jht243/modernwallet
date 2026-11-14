#!/usr/bin/env python3
"""Unit tests for fleet item-level quarantine & retry-cap helper."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


def load_quarantine():
    path = Path(__file__).with_name('quarantine.py')
    spec = importlib.util.spec_from_file_location('quarantine_mod', path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class QuarantineTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='layer3-quarantine-')
        self.base = Path(self.tmp.name).resolve()
        self.remote = self.base / 'remote.git'
        self.root = self.base / 'work'
        self.env = dict(os.environ, GIT_CONFIG_GLOBAL=os.devnull, GIT_CONFIG_NOSYSTEM='1')
        subprocess.run(['git', 'init', '--bare', '--initial-branch=main', str(self.remote)], env=self.env, check=True, capture_output=True)
        subprocess.run(['git', 'clone', str(self.remote), str(self.root)], env=self.env, check=True, capture_output=True)
        for k, v in [('user.name', 'Test'), ('user.email', 'test@example.invalid'), ('commit.gpgsign', 'false')]:
            subprocess.run(['git', '-C', str(self.root), 'config', k, v], env=self.env, check=True)
        (self.root / 'README.md').write_text('init\n')
        subprocess.run(['git', '-C', str(self.root), 'add', 'README.md'], env=self.env, check=True)
        subprocess.run(['git', '-C', str(self.root), 'commit', '-qm', 'init'], env=self.env, check=True)
        subprocess.run(['git', '-C', str(self.root), 'push', '-q', 'origin', 'main'], env=self.env, check=True)
        self.mod = load_quarantine()

    def tearDown(self):
        self.tmp.cleanup()

    def test_record_check_save_branch_and_resolve(self):
        doc = self.mod.record_ticket(
            self.root,
            skill='comparison-content-auto',
            item_id='acme-vs-beta',
            reason='Gate mismatch on shared file',
            site='https://www.modernwallet.org',
            attempts=1,
            max_retries=0,
            routes=['/comparisons/acme-vs-beta/'],
            cooldown_days=7,
            save_branch=True,
        )
        self.assertEqual(doc['status'], 'quarantined')
        self.assertTrue(doc['savedBranch'].startswith('claude/quarantine/comparison-content-auto-'))
        self.assertIsNotNone(self.mod.is_quarantined(self.root, 'comparison-content-auto', item_id='acme-vs-beta'))
        self.assertIsNotNone(self.mod.is_quarantined(self.root, 'comparison-content-auto', route='/comparisons/acme-vs-beta'))
        self.assertIsNone(self.mod.is_quarantined(self.root, 'comparison-content-auto', item_id='other-slug'))

        active = self.mod.load_active_tickets(self.root, 'comparison-content-auto')
        self.assertEqual(len(active), 1)

        resolved = self.mod.resolve_ticket(self.root, skill='comparison-content-auto', item_id='acme-vs-beta', note='Fixed gate')
        self.assertEqual(resolved['status'], 'resolved')
        self.assertIsNone(self.mod.is_quarantined(self.root, 'comparison-content-auto', item_id='acme-vs-beta'))


if __name__ == '__main__':
    unittest.main()
