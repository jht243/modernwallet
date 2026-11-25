#!/usr/bin/env python3
"""Unit tests for $0 vendor reachability precheck in alternatives_daily/backlog.py."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import json
from pathlib import Path
import tempfile
import threading
import types
import unittest

spec = importlib.util.spec_from_file_location("backlog", Path(__file__).with_name("backlog.py"))
bl = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bl)


class _VendorHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        return

    def do_GET(self):
        if self.path.startswith("/good"):
            body = "<html><body><h1>Acme Cloud Pricing</h1><p>" + ("Starter plan $29 per user per month with full API access. " * 5) + "</p></body></html>"
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(body.encode())
        elif self.path.startswith("/botgate"):
            body = "<html><body><h1>Just a moment... Enable JavaScript and cookies to continue</h1></body></html>"
            self.send_response(403)
            self.send_header("cf-mitigated", "challenge")
            self.end_headers()
            self.wfile.write(body.encode())
        elif self.path.startswith("/blocked"):
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b"Forbidden")
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")


class BacklogPrecheckTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), _VendorHandler)
        cls.port = cls.httpd.server_address[1]
        cls.base = f"http://127.0.0.1:{cls.port}"
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def test_next_precheck_sidelines_blocked_and_advances_to_readable(self):
        state = {
            "version": 1,
            "timezone": "America/Bogota",
            "dailyCap": 3,
            "rows": [
                {"id": "alt-blocked", "vendor": "BlockedCo", "product": "Blocked", "officialUrl": f"{self.base}/blocked", "status": "eligible", "priority": 1},
                {"id": "alt-botgate", "vendor": "GateCo", "product": "Gate", "officialUrl": f"{self.base}/botgate", "status": "eligible", "priority": 2},
                {"id": "alt-good", "vendor": "Acme", "product": "Acme Cloud", "officialUrl": f"{self.base}/good", "status": "eligible", "priority": 3},
            ],
        }
        out = bl.cmd_next(state, types.SimpleNamespace(max=2, precheck=True))
        self.assertEqual([r["id"] for r in out["new"]], ["alt-good"])
        by_id = {r["id"]: r["status"] for r in state["rows"]}
        self.assertEqual(by_id["alt-blocked"], "held")
        self.assertEqual(by_id["alt-botgate"], "excluded")
        self.assertEqual(by_id["alt-good"], "eligible")


if __name__ == "__main__":
    unittest.main()
