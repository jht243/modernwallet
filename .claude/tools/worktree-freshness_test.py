"""Exercise actual Git worktrees, including uncommitted runtime dependencies."""
import importlib.util
import io
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('freshness', Path(__file__).with_name('worktree-freshness.py'))
freshness = importlib.util.module_from_spec(spec)
spec.loader.exec_module(freshness)


class FreshnessTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.source = Path(self.tmp.name) / 'source'
        self.target = Path(self.tmp.name) / 'target'
        self.source.mkdir()
        self.run_git('init', '-q')
        self.run_git('config', 'user.email', 'test@example.invalid')
        self.run_git('config', 'user.name', 'Fixture')
        self.write('src/runtime.py', 'old')
        self.write('.gitignore', '*.secret\n')
        self.run_git('add', '.')
        self.run_git('commit', '-qm', 'base')
        self.run_git('worktree', 'add', '-q', '--detach', str(self.target))

    def run_git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.source), *args], stderr=subprocess.PIPE)

    def write(self, rel, text, target=False):
        p = (self.target if target else self.source) / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)

    def check(self):
        return freshness.check(self.target)

    def test_clean_worktree_and_primary(self):
        self.assertEqual(self.check()['status'], 'current')
        self.assertEqual(freshness.check(self.source)['status'], 'current')

    def test_dirty_runtime_cannot_be_hidden_by_current_instructions(self):
        self.write('src/runtime.py', 'new')
        self.write('.claude/commands/routine.md', 'current instructions')
        self.write('.claude/commands/routine.md', 'current instructions', target=True)
        self.assertEqual(self.check()['missing'], ['src/runtime.py'])
        self.assertEqual((self.target / 'src/runtime.py').read_text(), 'old')
        self.assertEqual((self.source / 'src/runtime.py').read_text(), 'new')

    def test_new_dependency_and_deletion(self):
        self.write('scripts/new.py', 'dependency')
        (self.source / 'src/runtime.py').unlink()
        self.assertEqual(self.check()['missing'], ['scripts/new.py', 'src/runtime.py'])

    def test_staged_changes_are_inputs(self):
        self.write('src/runtime.py', 'staged')
        self.run_git('add', 'src/runtime.py')
        self.assertEqual(self.check()['missing'], ['src/runtime.py'])

    def test_unpushed_source_commit_is_input(self):
        self.write('src/runtime.py', 'committed locally')
        self.run_git('commit', '-qam', 'local change')
        self.assertEqual(self.check()['missing'], ['src/runtime.py'])

    def test_rechecking_allows_run_edits_but_detects_later_source_changes(self):
        self.write('src/runtime.py', 'source v2')
        self.write('src/runtime.py', 'source v2', target=True)
        self.assertEqual(self.check()['status'], 'current')
        self.write('src/runtime.py', 'intentional run edit', target=True)
        self.assertEqual(self.check()['status'], 'current')
        self.write('src/runtime.py', 'source v3')
        self.assertEqual(self.check()['missing'], ['src/runtime.py'])

    def test_receipt_cannot_hide_next_checkout_commit(self):
        self.write('src/runtime.py', 'v2')
        self.write('src/runtime.py', 'v2', target=True)
        self.check()
        self.write('src/runtime.py', 'stale', target=True)
        subprocess.check_call(['git', '-C', str(self.target), 'commit', '-qam', 'new run base'], stdout=subprocess.DEVNULL)
        self.assertEqual(self.check()['missing'], ['src/runtime.py'])

    def test_reports_and_ignored_secrets_are_not_copied_or_checked(self):
        self.write('reports/output.md', 'run output')
        self.write('token.secret', 'synthetic fixture')
        self.assertEqual(self.check()['status'], 'current')
        self.assertFalse((self.target / 'token.secret').exists())

    def test_removed_untracked_input_is_rechecked(self):
        self.write('scripts/new.py', 'v1')
        self.write('scripts/new.py', 'v1', target=True)
        self.check()
        (self.source / 'scripts/new.py').unlink()
        self.assertEqual(self.check()['missing'], ['scripts/new.py'])

    def test_loader_stops_before_standard_receipt_on_stale_runtime(self):
        tools = Path(__file__).parent
        for rel in ['worktree-freshness.py', 'load-standards.sh', 'workflow-start.sh']:
            for root in [self.source, self.target]:
                dest = root / '.claude/tools' / rel
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(tools / rel, dest)
        for name in ['_content-standard.md', '_experience.md', '_anti-ai-language.md']:
            self.write('.claude/commands/' + name, '## DOMAIN\nFixture\n')
            self.write('.claude/commands/' + name, '## DOMAIN\nFixture\n', target=True)
        self.write('src/runtime.py', 'new')
        result = subprocess.run(['bash', str(self.target / '.claude/tools/load-standards.sh'), 'fixture', 'phase-3'], cwd=self.target, capture_output=True, text=True)
        self.assertEqual(result.returncode, 1)
        self.assertIn('src/runtime.py', result.stdout)
        self.assertNotIn('standard-loaded:', result.stdout)
        self.assertFalse((self.target / 'reports/standards-ledger.jsonl').exists())
        self.write('src/runtime.py', 'new', target=True)
        result = subprocess.run(['bash', str(self.target / '.claude/tools/load-standards.sh'), 'fixture', 'phase-3'], cwd=self.target, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('standard-loaded:', result.stdout)
        self.assertTrue((self.target / 'reports/standards-ledger.jsonl').exists())

    def setup_remote(self):
        remote = Path(self.tmp.name) / 'remote.git'
        subprocess.check_call(['git', 'clone', '-q', '--bare', str(self.source), str(remote)])
        self.run_git('remote', 'add', 'origin', str(remote))

    def test_cloud_checks_live_remote_not_cached_origin(self):
        self.setup_remote()
        self.assertEqual(freshness.cloud_check(self.target)['status'], 'current')
        self.write('src/runtime.py', 'published change')
        self.run_git('commit', '-qam', 'publish runtime')
        self.run_git('push', '-q', 'origin', 'HEAD')
        self.assertEqual(freshness.cloud_check(self.target)['missing'], ['src/runtime.py'])

    def test_cloud_allows_run_edits_after_initial_check(self):
        self.setup_remote()
        freshness.cloud_check(self.target)
        self.write('src/runtime.py', 'run edit', target=True)
        self.assertEqual(freshness.cloud_check(self.target)['status'], 'current')

    def test_cloud_missing_remote_cannot_pass(self):
        with self.assertRaises(subprocess.CalledProcessError):
            freshness.cloud_check(self.target)

    def test_render_runtime_without_git_verifies_published_build(self):
        env = {'RENDER_GIT_REPO_SLUG': 'fixture/site', 'RENDER_GIT_COMMIT': 'abc'}
        with patch.dict(os.environ, env, clear=True), patch.object(freshness.urllib.request, 'urlopen', side_effect=[io.StringIO('{"default_branch":"main"}'), io.StringIO('{"sha":"abc"}')]), patch.object(freshness, 'git', side_effect=AssertionError('Runtime has no git')):
            self.assertEqual(freshness.cloud_check('/no-git')['status'], 'current')

    def test_render_old_build_cannot_pass(self):
        env = {'RENDER_GIT_REPO_SLUG': 'fixture/site', 'RENDER_GIT_COMMIT': 'old'}
        with patch.dict(os.environ, env, clear=True), patch.object(freshness.urllib.request, 'urlopen', side_effect=[io.StringIO('{"default_branch":"main"}'), io.StringIO('{"sha":"new"}')]):
            self.assertEqual(freshness.cloud_check('/no-git')['missing'], ['deployed-build-revision'])


if __name__ == '__main__':
    unittest.main()
