#!/usr/bin/env python3
"""Offline regressions for the land wait loop's own-run failure check. Fake gh, disposable local bare remotes only."""
import importlib.util
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
import time
import unittest

HERE = Path(__file__).resolve().parent
STATUS = HERE / 'land-run-status.py'

spec = importlib.util.spec_from_file_location('deploy_tests', HERE / 'deploy-run-to-main_test.py')
deploy_tests = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy_tests)

BILLING = 'The job was not started because recent account payments have failed or your spending limit needs to be increased.'

FAKE_GH = r'''#!/usr/bin/env python3
import json, os, subprocess, sys
mode = os.environ.get('FAKE_MODE', 'unknown')
args = sys.argv[1:]
if mode == 'unavailable':
    sys.stderr.write('gh: not authenticated\n')
    sys.exit(1)
heads = subprocess.run(['git', '-C', os.environ['FAKE_REPO'], 'for-each-ref', '--format=%(refname:short) %(objectname)', 'refs/heads/claude/land'],
                       capture_output=True, text=True).stdout.split()
branch, sha = (heads + ['', ''])[:2]
if os.environ.get('FAKE_BRANCH'):
    branch, sha = os.environ['FAKE_BRANCH'], os.environ['FAKE_SHA']
if args[:2] == ['run', 'list']:
    base = {'databaseId': 42, 'displayTitle': 'Land ' + branch, 'headBranch': branch, 'headSha': sha, 'event': 'push',
            'status': 'completed', 'conclusion': 'failure', 'url': 'https://example.invalid/runs/42', 'createdAt': '2026-11-09T01:32:15Z', 'attempt': 1}
    old = dict(base, databaseId=7, displayTitle='Land claude/land/older-attempt-1', headBranch='claude/land/older-attempt-1', headSha='0' * 40)
    if mode == 'own-failed':
        runs = [old, base]
    elif mode == 'wrong-sha':
        runs = [dict(base, headSha='f' * 40)]
    elif mode == 'unrelated-failed':
        runs = [old]
    elif mode == 'pending':
        runs = [dict(base, status='in_progress', conclusion=None)]
    elif mode == 'merge-success':
        subprocess.run(['git', '-C', os.environ['FAKE_REPO'], 'update-ref', 'refs/heads/main', sha], check=True)
        runs = [dict(base, conclusion='success')]
    else:
        runs = []
    print(json.dumps(runs))
elif args and args[0] == 'api' and args[1].endswith('/jobs'):
    print(json.dumps({'jobs': [{'id': 99}]}))
elif args and args[0] == 'api' and args[1].endswith('/annotations'):
    print(json.dumps([{'message': os.environ['FAKE_REASON']}]))
else:
    sys.exit(2)
'''


class LandRunStatus(unittest.TestCase):
    # Reuse only the fixture helpers of the existing deployment tests, never its test cases.
    for _name in ('tearDown', 'cmd', 'git', 'configure', 'write', 'commit', 'helper', 'advance', 'own_change', 'remote_tip'):
        locals()[_name] = getattr(deploy_tests.Deployment, _name)

    def setUp(self):
        deploy_tests.Deployment.setUp(self)
        self.write('.claude/scripts/land-run-status.py', STATUS.read_text())
        gh = self.root / 'bin' / 'gh'
        gh.parent.mkdir()
        gh.write_text(FAKE_GH)
        gh.chmod(gh.stat().st_mode | stat.S_IEXEC)
        self.env['PATH'] = str(gh.parent) + os.pathsep + self.env['PATH']
        self.env['FAKE_REPO'] = str(self.remote)
        self.env['FAKE_REASON'] = BILLING
        self.own_change()

    def land(self, mode, deadline='4', poll='1'):
        env = dict(self.env, FAKE_MODE=mode, LAND_DEADLINE=deadline, LAND_POLL_SECONDS=poll)
        started = time.monotonic()
        result = subprocess.run(['bash', '.claude/scripts/deploy-run-to-main.sh', 'land'], cwd=self.work, env=env,
                                capture_output=True, text=True, timeout=60)
        return result, time.monotonic() - started

    def land_branch(self):
        return self.git(self.remote, 'for-each-ref', '--format=%(refname:short)', 'refs/heads/claude/land').stdout.split()

    def test_own_failed_run_stops_before_any_sleep_and_preserves_the_branch(self):
        result, elapsed = self.land('own-failed', deadline='300', poll='60')
        self.assertEqual(result.returncode, 5, result.stdout + result.stderr)
        self.assertLess(elapsed, 30)
        self.assertIn('NOT LANDED: the land workflow run for', result.stderr)
        self.assertIn('https://example.invalid/runs/42', result.stderr)
        self.assertIn('spending limit', result.stderr)
        self.assertNotIn('after 300s', result.stderr)
        self.assertEqual(len(self.land_branch()), 1)
        self.assertNotEqual(self.remote_tip(), self.git(self.work, 'rev-parse', 'HEAD').stdout.strip())

    def test_unrelated_wrong_sha_unavailable_and_pending_runs_do_not_stop_the_wait(self):
        for mode in ('unrelated-failed', 'wrong-sha', 'unavailable', 'unknown', 'pending'):
            with self.subTest(mode=mode):
                for branch in self.land_branch():
                    self.git(self.remote, 'update-ref', '-d', 'refs/heads/' + branch)
                self.git(self.work, 'checkout', '-q', '-B', 'routine-' + mode, 'origin/main')
                self.helper('mark')
                self.write('run.txt', 'exact reviewed candidate ' + mode + '\n')
                self.commit(self.work, 'run candidate ' + mode)
                result, elapsed = self.land(mode, deadline='3', poll='1')
                self.assertEqual(result.returncode, 5, result.stdout + result.stderr)
                self.assertIn('NOT LANDED after 3s', result.stderr)
                self.assertNotIn('the land workflow run for', result.stderr)
                self.assertGreaterEqual(elapsed, 3)

    def test_landed_main_success_is_unchanged(self):
        result, _ = self.land('merge-success', deadline='20', poll='1')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn('[deploy] landed: origin/main', result.stdout)

    def test_status_helper_binds_title_and_sha_and_never_fails_the_caller(self):
        self.assertEqual(self.land_branch(), [])
        sha = self.git(self.work, 'rev-parse', 'HEAD').stdout.strip()
        env = dict(self.env, FAKE_MODE='own-failed', FAKE_REPO=str(self.remote), FAKE_BRANCH='claude/land/key-1', FAKE_SHA=sha)

        def status(name, head):
            out = subprocess.run([sys.executable, str(STATUS), '--branch', name, '--sha', head], env=env, capture_output=True, text=True)
            self.assertEqual(out.returncode, 0)
            return json.loads(out.stdout)

        self.assertEqual(status('claude/land/key-1', sha)['state'], 'failed')
        self.assertEqual(status('claude/land/key-1', sha)['reason'], BILLING)
        self.assertEqual(status('claude/land/key-1', 'e' * 40)['state'], 'unknown')
        self.assertEqual(status('claude/land/key-2', sha)['state'], 'unknown')


if __name__ == '__main__':
    unittest.main()
