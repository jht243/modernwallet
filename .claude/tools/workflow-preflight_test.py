import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import subprocess

spec = importlib.util.spec_from_file_location('preflight', Path(__file__).with_name('workflow-preflight.py'))
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

class PreflightTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name); self.run = self.root / 'run'
        for name in m.BASE + ['_keyword-demand-ladder.md', '_remediation-ladder.md', 'phase.md']:
            p = self.root / '.claude/commands' / name; p.parent.mkdir(parents=True, exist_ok=True); p.write_text('rules ' * 2000)
        self.instruction = ['.claude/commands/phase.md']
    def prepare(self):
        with patch.object(m.subprocess, 'run') as run:
            value = m.prepare(self.root, 'build', self.instruction, self.run)
            self.assertTrue(run.call_args.kwargs['check'])
            return value
    def deliver(self):
        for _ in m.load(self.run)['parts']:
            with contextlib.redirect_stdout(io.StringIO()): m.emit(self.root, self.run)
    def test_partial_read_fails(self):
        self.prepare()
        with contextlib.redirect_stdout(io.StringIO()): m.emit(self.root, self.run)
        with self.assertRaisesRegex(ValueError, 'Incomplete'): m.validate(self.root, self.run)
    def test_complete_read_reconstructs_every_file(self):
        manifest = self.prepare(); self.deliver(); m.validate(self.root, self.run)
        for rel in manifest['files']:
            actual = ''.join((self.run / p['path']).read_text().split('\n\n', 1)[1] for p in manifest['parts'] if (self.run / p['path']).read_text().startswith(rel + ' —'))
            self.assertEqual(actual, (self.root / rel).read_text())
    def test_cannot_skip_chunks(self):
        self.prepare()
        with self.assertRaisesRegex(ValueError, 'sequentially'): m.emit(self.root, self.run, 2)
    def test_changed_rules_fail(self):
        self.prepare(); self.deliver(); (self.root / self.instruction[0]).write_text('new')
        with self.assertRaisesRegex(ValueError, 'Instructions changed'): m.validate(self.root, self.run)
    def test_new_local_override_fails(self):
        self.prepare(); self.deliver(); (self.root / '.claude/commands/_testing-labels.local.md').write_text('excluded')
        with self.assertRaisesRegex(ValueError, 'file set changed'): m.validate(self.root, self.run)
    def test_tampered_chunk_fails(self):
        self.prepare(); (self.run / 'part-001.txt').write_text('cut')
        with self.assertRaisesRegex(ValueError, 'chunk changed'): m.emit(self.root, self.run)
    def test_failure_cannot_be_hidden_by_tail(self):
        with patch.object(m.subprocess, 'run', side_effect=subprocess.CalledProcessError(17, ['bash'])):
            with self.assertRaises(subprocess.CalledProcessError): m.prepare(self.root, 'build', self.instruction, self.run)
        self.assertFalse(self.run.exists())
    def test_missing_contract_fails(self):
        (self.root / '.claude/commands/_testing-labels.md').unlink()
        with self.assertRaises(FileNotFoundError): self.prepare()
        self.assertFalse(self.run.exists())
    def test_receipt_cannot_move_between_repos(self):
        self.prepare()
        with self.assertRaisesRegex(ValueError, 'another repository'): m.validate(self.root / 'other', self.run)
    def test_optional_local_rule_is_included(self):
        (self.root / '.claude/commands/_testing-labels.local.md').write_text('excluded')
        self.assertIn('.claude/commands/_testing-labels.local.md', self.prepare()['files'])
    def test_cannot_overwrite_existing_run(self):
        self.prepare()
        with self.assertRaises(FileExistsError): self.prepare()
    def test_broken_output_does_not_mark_delivery(self):
        self.prepare()
        with patch('builtins.print', side_effect=BrokenPipeError):
            with self.assertRaises(BrokenPipeError): m.emit(self.root, self.run)
        self.assertEqual(m.load(self.run)['delivered'], [])

if __name__ == '__main__': unittest.main()
