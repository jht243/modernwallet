#!/usr/bin/env python3
"""Unit tests for scripts/alternatives_daily/fetch_page.py."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import unittest
from unittest import mock

SCRIPT = Path(__file__).with_name('fetch_page.py')
SPEC = importlib.util.spec_from_file_location('fetch_page', SCRIPT)
fp = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(fp)


class FetchPageTests(unittest.TestCase):
    def test_proxy_parsing_with_credentials(self):
        proxy = fp._playwright_proxy_from_env({
            'HTTPS_PROXY': 'http://container_1:sec%40ret@21.0.0.5:15004'
        })
        self.assertEqual(proxy, {
            'server': 'http://21.0.0.5:15004',
            'username': 'container_1',
            'password': 'sec@ret',
        })

    def test_proxy_parsing_empty(self):
        self.assertIsNone(fp._playwright_proxy_from_env({}))

    def test_bot_gate_detected_and_never_escalated_to_browser(self):
        anubis = "Making sure you're not a bot!\nAnubis could not load its JavaScript."
        with mock.patch.object(fp, 'plain', return_value=(200, anubis)), \
             mock.patch.object(fp, 'browser') as m_browser:
            res = fp.fetch_readable('https://www.ros.org/')
            m_browser.assert_not_called()
            self.assertTrue(res['anti_bot_gate'])
            self.assertEqual(res['raw_text'], '')

    def test_js_shell_falls_back_to_browser(self):
        with mock.patch.object(fp, 'plain', return_value=(200, 'Gazebo')), \
             mock.patch.object(fp, 'browser', return_value=(200, 'Gazebo open-source simulator ' * 40)) as m_browser:
            res = fp.fetch_readable('https://gazebosim.org/')
            m_browser.assert_called_once_with('https://gazebosim.org/')
            self.assertEqual(res['method'], 'browser')
            self.assertGreater(len(res['raw_text']), 800)

    def test_grep_zero_matches_still_exits_zero_on_readable_page(self):
        body = 'NVIDIA Isaac Sim open-source robotics framework built on Omniverse. ' * 20
        with mock.patch.object(fp, 'fetch_readable', return_value={
            'method': 'plain',
            'status': 200,
            'raw_text': body,
            'errors': [],
            'anti_bot_gate': False,
        }):
            with mock.patch.object(sys, 'argv', ['fetch_page.py', 'https://developer.nvidia.com/isaac/sim', '--grep', 'price']):
                from io import StringIO
                buf = StringIO()
                with mock.patch('sys.stdout', buf):
                    with self.assertRaises(SystemExit) as ctx:
                        fp.main()
                self.assertEqual(ctx.exception.code, 0)
                lines = buf.getvalue().splitlines()
                hdr = json.loads(lines[0])
                self.assertEqual(hdr['grep_matches'], 0)
                self.assertGreater(hdr['chars'], 800)
                self.assertIn('[no lines matched --grep; showing page preview]', lines[1])


if __name__ == '__main__':
    unittest.main()
