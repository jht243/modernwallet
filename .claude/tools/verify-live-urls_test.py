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

    def test_extends_wait_when_render_deploy_is_actively_building(self):
        clock = [0.0]
        def fake_sleep(dt):
            clock[0] += dt

        def fake_probe(url, request_timeout=15):
            if clock[0] < 220:
                return {'url': url, 'ok': False, 'status': 404, 'error': 'HTTP 404'}
            return {'url': url, 'ok': True, 'status': 200, 'hasH1': True, 'completeHtml': True}

        def fake_render_status(service_id):
            return {
                'serviceId': service_id,
                'deployId': 'dep-test123',
                'status': 'build_in_progress' if clock[0] < 220 else 'live',
            }

        with patch.object(v, 'probe_once', side_effect=fake_probe):
            res = v.verify_urls(
                ['https://www.layer3labs.io/guides/new-page'],
                timeout=180,
                interval=30,
                sleep_fn=fake_sleep,
                clock_fn=lambda: clock[0],
                render_status_fn=fake_render_status,
            )
        self.assertEqual(res['status'], 'all-live')
        self.assertGreaterEqual(clock[0], 220)
        self.assertEqual(res['renderDeploy']['serviceId'], 'srv-d5618t6mcj7s73fkk7b0')

    def test_resolves_approval_manifest_using_content_review_policy_host(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / '.claude').mkdir()
            (root / '.claude/content-review-policy.json').write_text(json.dumps({
                'canonicalHosts': ['colombiadesk.com', 'www.colombiadesk.com'],
            }))
            run_dir = root / 'reports/mindmap-pass/run1'
            run_dir.mkdir(parents=True)
            man = run_dir / 'approval-manifest.json'
            man.write_text(json.dumps({
                'actions': [
                    {'id': 'A1', 'target': '/living/airalo-vs-saily-colombia/'},
                    {'id': 'A2', 'target': '/living/best-esim-for-colombia#pricing'},
                ],
            }))
            urls = v._resolve_urls(str(man))
            self.assertEqual(urls, [
                'https://www.colombiadesk.com/living/airalo-vs-saily-colombia/',
                'https://www.colombiadesk.com/living/best-esim-for-colombia',
            ])


if __name__ == '__main__':
    unittest.main()
