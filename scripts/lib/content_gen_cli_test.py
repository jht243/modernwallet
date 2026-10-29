"""Offline regression tests for the Mindmap CLI gate; no provider calls."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('content_gen', Path(__file__).with_name('content_gen.py'))
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)
COMMANDS = tuple(command for command in ('write', 'section', 'fix')
                 if command != 'fix' or hasattr(gen, 'cmd_fix'))


class MindmapCLI(unittest.TestCase):
    def args(self, command):
        if command == 'fix':
            return ['fix', '--draft', 'reports/mindmap-pass/fixture.json', '--findings', 'missing', '--slug', 'fixture']
        return [command, '--system', 'missing', '--prompt', 'reports/mindmap-pass/prompt.md',
                '--out', 'unused', '--slug', 'fixture']

    def test_options_reach_each_command(self):
        for command in COMMANDS:
            with self.subTest(command=command):
                handler = 'cmd_fix' if command == 'fix' else 'cmd_write'
                with patch.object(gen, handler, return_value=0) as run:
                    self.assertEqual(gen.main(self.args(command) + [
                        '--mindmap-manifest', 'manifest.json', '--mindmap-review', 'review.json',
                        '--analysis-packet', 'packet.json']), 0)
                    args = run.call_args.args[0]
                    self.assertEqual((args.mindmap_manifest, args.mindmap_review, args.analysis_packet),
                                     ('manifest.json', 'review.json', 'packet.json'))

    def test_options_remain_optional_for_other_routines(self):
        for command in COMMANDS:
            with self.subTest(command=command):
                handler = 'cmd_fix' if command == 'fix' else 'cmd_write'
                with patch.object(gen, handler, return_value=0) as run:
                    self.assertEqual(gen.main(self.args(command)), 0)
                    args = run.call_args.args[0]
                    self.assertEqual((args.mindmap_manifest, args.mindmap_review, args.analysis_packet), ('', '', ''))

    @unittest.skipUnless(hasattr(gen, 'mindmap_gate'), 'Legacy engine has no Mindmap gate installed')
    def test_missing_evidence_blocks_all_commands_before_provider(self):
        for command in COMMANDS:
            with self.subTest(command=command), patch.object(gen, 'CALLER', ''), \
                    patch.object(gen, 'complete') as provider, patch.object(gen, '_checker_call', create=True) as checker:
                with self.assertRaisesRegex(RuntimeError, 'Mindmap writing blocked'):
                    gen.main(self.args(command))
                provider.assert_not_called()
                checker.assert_not_called()

    @unittest.skipUnless(hasattr(gen, 'mindmap_gate'), 'Legacy engine has no Mindmap gate installed')
    def test_invalid_evidence_is_validated_after_parsing(self):
        with tempfile.TemporaryDirectory() as directory:
            bad = Path(directory) / 'bad.json'
            bad.write_text('{}')
            for command in COMMANDS:
                with self.subTest(command=command), patch.object(gen, 'CALLER', ''), \
                        patch.object(gen, 'complete') as provider, patch.object(gen, '_checker_call', create=True) as checker:
                    with self.assertRaisesRegex(RuntimeError, 'Mindmap writing blocked'):
                        gen.main(self.args(command) + ['--mindmap-manifest', str(bad),
                                 '--mindmap-review', str(bad), '--analysis-packet', str(bad)])
                    provider.assert_not_called()
                    checker.assert_not_called()


if __name__ == '__main__':
    unittest.main()
