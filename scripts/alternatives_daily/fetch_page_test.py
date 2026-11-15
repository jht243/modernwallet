#!/usr/bin/env python3
"""Unit tests for scripts/alternatives_daily/fetch_page.py same-day URL disk cache & bot-gate behavior."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch


def load_fetch_page():
    path = Path(__file__).with_name('fetch_page.py')
    spec = importlib.util.spec_from_file_location('fetch_page_mod', path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class FetchPageCacheTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='alt-fetch-cache-')
        self.cache_dir = Path(self.tmp.name)
        self.mod = load_fetch_page()

    def tearDown(self):
        self.tmp.cleanup()

    def test_caches_readable_response_and_reuses_without_refetching(self):
        calls = []

        def fake_plain(url):
            calls.append(url)
            return 200, ('Starter Plan $29/month\nPro Plan $99/month\n' * 30)

        with patch.object(self.mod, 'plain', side_effect=fake_plain):
            r1 = self.mod.fetch_readable('https://vendor.example/pricing', use_cache=True, cache_dir=str(self.cache_dir))
            self.assertFalse(r1['cached'])
            self.assertEqual(len(calls), 1)

            r2 = self.mod.fetch_readable('https://vendor.example/pricing', use_cache=True, cache_dir=str(self.cache_dir))
            self.assertTrue(r2['cached'])
            self.assertEqual(len(calls), 1)
            self.assertIn('Pro Plan $99/month', r2['raw_text'])

            # --no-cache bypasses cache cleanly
            r3 = self.mod.fetch_readable('https://vendor.example/pricing', use_cache=False, cache_dir=str(self.cache_dir))
            self.assertFalse(r3['cached'])
            self.assertEqual(len(calls), 2)

    def test_caches_anti_bot_gate_and_never_caches_transient_errors(self):
        bot_calls = []

        def fake_bot(url):
            bot_calls.append(url)
            return 403, 'Just a moment... Enable JavaScript and cookies to continue'

        with patch.object(self.mod, 'plain', side_effect=fake_bot):
            b1 = self.mod.fetch_readable('https://gated.example/pricing', use_cache=True, cache_dir=str(self.cache_dir))
            self.assertTrue(b1['anti_bot_gate'])
            self.assertFalse(b1['cached'])

            b2 = self.mod.fetch_readable('https://gated.example/pricing', use_cache=True, cache_dir=str(self.cache_dir))
            self.assertTrue(b2['anti_bot_gate'])
            self.assertTrue(b2['cached'])
            self.assertEqual(len(bot_calls), 1)

        err_calls = []

        def fake_500(url):
            err_calls.append(url)
            return 503, 'Service temporarily unavailable'

        with patch.object(self.mod, 'plain', side_effect=fake_500), patch.object(self.mod, 'browser', side_effect=RuntimeError('no browser')):
            e1 = self.mod.fetch_readable('https://flaky.example/pricing', use_cache=True, cache_dir=str(self.cache_dir))
            self.assertFalse(e1['cached'])
            e2 = self.mod.fetch_readable('https://flaky.example/pricing', use_cache=True, cache_dir=str(self.cache_dir))
            self.assertFalse(e2['cached'])
            self.assertEqual(len(err_calls), 2)

    def test_grep_runs_dynamically_against_cached_full_text(self):
        cache_file = self.mod._cache_file_for_url('https://cached.example/pricing', cache_dir=str(self.cache_dir))
        cache_file.parent.mkdir(parents=True, exist_ok=True)
        full_body = 'Overview of Vendor\nStarter Tier: $19/user/month\nEnterprise Tier: Quote-based; no public price\n' + ('Feature details line\n' * 15)
        cache_file.write_text(json.dumps({
            'url': 'https://cached.example/pricing',
            'method': 'plain',
            'status': 200,
            'raw_text': full_body,
            'errors': [],
            'anti_bot_gate': False,
        }))
        proc = subprocess.run(
            [sys.executable, str(Path(__file__).with_name('fetch_page.py')), 'https://cached.example/pricing', '--grep', 'Enterprise'],
            env={'ALT_FETCH_CACHE_DIR': str(self.cache_dir), 'PATH': '/usr/bin:/bin'},
            capture_output=True,
            text=True,
            timeout=10,
        )
        self.assertEqual(proc.returncode, 0)
        lines = proc.stdout.strip().splitlines()
        hdr = json.loads(lines[0])
        self.assertTrue(hdr.get('cached'))
        self.assertEqual(hdr.get('grep_matches'), 1)
        self.assertIn('Enterprise Tier: Quote-based', lines[1])


if __name__ == '__main__':
    unittest.main()
