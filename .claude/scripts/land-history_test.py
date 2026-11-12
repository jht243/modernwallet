"""Offline fixture for land-history.sh: divergent shallow refs with historical ancestry must fetch ONLY main + the routine branch."""
import os, subprocess, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('land-history.sh')


def git(cwd, *args, check=True):
    env = dict(os.environ, GIT_AUTHOR_NAME='t', GIT_AUTHOR_EMAIL='t@t', GIT_COMMITTER_NAME='t', GIT_COMMITTER_EMAIL='t@t')
    return subprocess.run(['git', *args], cwd=cwd, env=env, text=True, capture_output=True, check=check).stdout.strip()


class LandHistory(unittest.TestCase):
    def setUp(self):
        self.td = tempfile.TemporaryDirectory(); root = Path(self.td.name)
        self.origin = root / 'origin.git'; self.work = root / 'work'; self.clone = root / 'clone'
        git(root, 'init', '--bare', '-b', 'main', str(self.origin))
        git(root, 'init', '-b', 'main', str(self.work)); git(self.work, 'remote', 'add', 'origin', str(self.origin))
        (self.work / 'ledger.txt').write_text('0\n'); git(self.work, 'add', '.'); git(self.work, 'commit', '-m', 'c0')
        self.oldest = git(self.work, 'rev-parse', 'HEAD')   # historical publication ancestry, far beyond the shallow depth
        for i in range(1, 25):
            (self.work / 'ledger.txt').write_text(f'{i}\n'); git(self.work, 'commit', '-qam', f'c{i}')
        git(self.work, 'push', '-q', 'origin', 'main')
        # the routine branch diverges from an old main commit
        git(self.work, 'checkout', '-q', '-b', 'claude/land/routine', 'main~3')
        (self.work / 'routine.txt').write_text('r\n'); git(self.work, 'add', '.'); git(self.work, 'commit', '-qm', 'routine')
        git(self.work, 'push', '-q', 'origin', 'claude/land/routine')
        # many unrelated branches, each with a commit that exists nowhere else
        self.unrelated = []
        for n in range(6):
            git(self.work, 'checkout', '-q', '-b', f'other/{n}', 'main~10')
            (self.work / f'o{n}.txt').write_text(str(n)); git(self.work, 'add', '.'); git(self.work, 'commit', '-qm', f'other{n}')
            git(self.work, 'push', '-q', 'origin', f'other/{n}'); self.unrelated.append(git(self.work, 'rev-parse', 'HEAD'))
        git(self.work, 'checkout', '-q', 'main')
        git(root, 'clone', '-q', '--depth=4', '--branch', 'main', '--single-branch', f'file://{self.origin}', str(self.clone))
        # actions/checkout configures the default wildcard refspec, which is what made a bare --unshallow fetch every branch
        git(self.clone, 'config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*')
        # mimic the workflow checkout: only main (depth) + the routine branch (depth) are present
        git(self.clone, 'fetch', '-q', '--no-tags', '--depth=4', 'origin', '+refs/heads/claude/land/routine:refs/remotes/origin/claude/land/routine')

    def tearDown(self): self.td.cleanup()

    def run_script(self):
        # the diverged branch takes the history path
        return subprocess.run(['bash', str(SCRIPT), 'origin/main', 'origin/claude/land/routine'], cwd=self.clone, text=True, capture_output=True)

    def has(self, sha): return subprocess.run(['git', 'cat-file', '-e', sha + '^{commit}'], cwd=self.clone, capture_output=True).returncode == 0

    def test_diverged_shallow_refs_get_complete_main_and_routine_ancestry_only(self):
        self.assertTrue(git(self.clone, 'rev-parse', '--is-shallow-repository') == 'true')
        self.assertFalse(self.has(self.oldest), 'fixture: the oldest commit starts outside the shallow window')
        r = self.run_script(); self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue(self.has(self.oldest), 'complete main ancestry (historical publication commits) is present')
        self.assertTrue(git(self.clone, 'merge-base', 'origin/main', 'origin/claude/land/routine'))
        self.assertEqual(git(self.clone, 'rev-parse', '--is-shallow-repository'), 'false')
        for sha in self.unrelated: self.assertFalse(self.has(sha), 'unrelated branch commits must not be downloaded')
        self.assertEqual(git(self.clone, 'for-each-ref', 'refs/remotes/origin/other'), '')

    def test_fixture_reproduces_the_old_bare_unshallow_downloading_unrelated_branches(self):
        git(self.clone, 'fetch', '-q', '--no-tags', '--unshallow', 'origin')
        self.assertTrue(all(self.has(sha) for sha in self.unrelated), 'the old bare fetch pulls every unrelated branch')

    def test_fast_forward_without_a_fulfillment_record_stays_shallow(self):
        git(self.clone, 'checkout', '-q', '-B', 'ff', 'origin/main')
        (self.clone / 'ff.txt').write_text('x'); git(self.clone, 'add', '.'); git(self.clone, 'commit', '-qm', 'ff')
        git(self.clone, 'update-ref', 'refs/remotes/origin/ff', 'HEAD')
        r = subprocess.run(['bash', str(SCRIPT), 'origin/main', 'origin/ff'], cwd=self.clone, text=True, capture_output=True)
        self.assertEqual(r.returncode, 0, r.stderr); self.assertEqual(git(self.clone, 'rev-parse', '--is-shallow-repository'), 'true')

    def test_unrecognised_ref_shapes_keep_the_original_complete_behaviour(self):
        r = subprocess.run(['bash', str(SCRIPT), 'refs/remotes/origin/main', 'refs/remotes/origin/claude/land/routine'], cwd=self.clone, text=True, capture_output=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(git(self.clone, 'rev-parse', '--is-shallow-repository'), 'false')


    def _retry_setup(self):
        """Natural landing: routine fast-forwards main, the push is rejected because main moved, and the retry checks the local HEAD."""
        git(self.work, 'checkout', '-q', '-b', 'claude/land/ff', 'main')
        (self.work / 'ffroutine.txt').write_text('f\n'); git(self.work, 'add', '.'); git(self.work, 'commit', '-qm', 'ffroutine')
        git(self.work, 'push', '-q', 'origin', 'claude/land/ff')
        git(self.clone, 'fetch', '-q', '--no-tags', '--depth=4', 'origin', '+refs/heads/claude/land/ff:refs/remotes/origin/claude/land/ff')
        git(self.clone, 'checkout', '-q', '-B', 'landing', 'origin/claude/land/ff')   # the fast-forward: local HEAD is the routine tip
        git(self.work, 'checkout', '-q', 'main'); (self.work / 'moved.txt').write_text('m\n'); git(self.work, 'add', '.')
        git(self.work, 'commit', '-qm', 'main moved'); git(self.work, 'push', '-q', 'origin', 'main')
        git(self.clone, 'fetch', '-q', '--no-tags', '--depth=4', 'origin', 'main')       # git fetch origin main in the retry loop
        self.head = git(self.clone, 'rev-parse', 'HEAD')

    def retry(self, *extra):
        return subprocess.run(['bash', str(SCRIPT), 'origin/main', 'HEAD', *extra], cwd=self.clone, text=True, capture_output=True)

    def test_push_retry_local_head_with_explicit_routine_ref_fetches_only_main_and_routine(self):
        self._retry_setup(); self.assertFalse(self.has(self.oldest))
        r = self.retry('origin/claude/land/ff'); self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue(self.has(self.oldest), 'complete main and routine ancestry')
        self.assertEqual(git(self.clone, 'rev-parse', '--is-shallow-repository'), 'false')
        for sha in self.unrelated: self.assertFalse(self.has(sha), 'no unrelated branch downloaded')
        self.assertEqual(git(self.clone, 'for-each-ref', 'refs/remotes/origin/other'), '')
        self.assertEqual(git(self.clone, 'rev-parse', 'HEAD'), self.head, 'local HEAD is never replaced by a remote ref')
        self.assertTrue(git(self.clone, 'merge-base', 'origin/main', 'HEAD'))

    def test_push_retry_without_or_with_untrusted_third_argument_keeps_complete_fallback(self):
        for extra in ((), ('origin/other/0',), ('refs/heads/claude/land/ff',), ('origin/claude/land/missing',), ('origin/claude/land/..bad',)):
            self.tearDown(); self.setUp(); self._retry_setup()
            r = self.retry(*extra); self.assertEqual(r.returncode, 0, r.stderr)
            self.assertTrue(all(self.has(sha) for sha in self.unrelated), f'unknown/untrusted shape {extra} keeps the original complete fetch')


if __name__ == '__main__':
    unittest.main()
