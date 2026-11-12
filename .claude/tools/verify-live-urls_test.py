"""Unit tests for single-turn bounded live URL verifier."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('verify_live', Path(__file__).with_name('verify-live-urls.py'))
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)


class VerifyLiveUrlsTests(unittest.TestCase):
    def test_resolves_manifest_and_converges_after_retry(self):
        with tempfile.TemporaryDirectory() as tmp:
            man = Path(tmp) / 'capture-manifest.json'
            man.write_text(json.dumps({
                'canonicalBase': 'https://example.com',
                'routes': [{'path': '/guides/a'}, {'path': '/guides/b'}],
            }))
            urls = v._resolve_urls(str(man))
            self.assertEqual(urls, ['https://example.com/guides/a', 'https://example.com/guides/b'])

            calls = {'https://example.com/guides/a': 0, 'https://example.com/guides/b': 0}
            def fake_probe(url, request_timeout=15):
                calls[url] += 1
                if url.endswith('/b') and calls[url] == 1:
                    return {'url': url, 'ok': False, 'status': 404, 'error': 'HTTP 404'}
                return {'url': url, 'ok': True, 'status': 200, 'hasH1': True, 'completeHtml': True}

            clock = [0.0]
            def fake_sleep(dt):
                clock[0] += dt

            with patch.object(v, 'probe_once', side_effect=fake_probe):
                res = v.verify_urls(urls, timeout=30, interval=5, sleep_fn=fake_sleep, clock_fn=lambda: clock[0])
            self.assertEqual(res['status'], 'all-live')
            self.assertEqual(res['attempts'], 2)
            self.assertEqual(calls['https://example.com/guides/a'], 1)
            self.assertEqual(calls['https://example.com/guides/b'], 2)

    def test_timeout_returns_honest_pending_host_deploy(self):
        clock = [0.0]
        def fake_sleep(dt):
            clock[0] += dt
        with patch.object(v, 'probe_once', return_value={'url': 'https://example.com/x', 'ok': False, 'status': 404, 'error': 'HTTP 404'}):
            res = v.verify_urls(['https://example.com/x'], timeout=10, interval=5, sleep_fn=fake_sleep, clock_fn=lambda: clock[0])
        self.assertEqual(res['status'], 'pending-host-deploy')
        self.assertEqual(res['pendingCount'], 1)
        self.assertEqual(res['attempts'], 3)


if __name__ == '__main__':
    unittest.main()
