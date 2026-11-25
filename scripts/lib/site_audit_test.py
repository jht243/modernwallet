#!/usr/bin/env python3
"""Unit tests for the $0 local technical SEO blind-spot checks in site_audit.py."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
from pathlib import Path
import threading
import unittest

spec = importlib.util.spec_from_file_location("site_audit", Path(__file__).with_name("site_audit.py"))
sa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sa)


class _TestHandler(BaseHTTPRequestHandler):
    base = ""

    def log_message(self, fmt, *args):
        return

    def do_GET(self):
        b = self.base
        routes = {
            "/clean": (
                200, {},
                f'<!doctype html><html lang="en-US"><head>'
                f'<title>Clean Enterprise AI Compliance Guide for Small Teams</title>'
                f'<meta name="description" content="Practical compliance checklist for small and mid-size teams deploying AI workflows safely across regulated customer data.">'
                f'<link rel="canonical" href="{b}/clean">'
                f'<link rel="alternate" hreflang="en" href="{b}/clean">'
                f'<link rel="alternate" hreflang="es" href="{b}/es/clean">'
                f'</head><body><h1>Enterprise AI Compliance</h1></body></html>'
            ),
            "/es/clean": (
                200, {},
                f'<!doctype html><html lang="es"><head>'
                f'<title>Guia Practica de Cumplimiento de IA para Empresas</title>'
                f'<meta name="description" content="Lista practica de cumplimiento para equipos que implementan flujos de trabajo de inteligencia artificial de forma segura.">'
                f'<link rel="canonical" href="{b}/es/clean">'
                f'<link rel="alternate" hreflang="es" href="{b}/es/clean">'
                f'<link rel="alternate" hreflang="en" href="{b}/clean">'
                f'</head><body><h1>Cumplimiento de IA</h1></body></html>'
            ),
            "/noindex-page": (
                200, {},
                f'<!doctype html><html lang="en"><head><title>Hidden Draft Page Title Long Enough</title>'
                f'<meta name="robots" content="noindex, follow">'
                f'<meta name="description" content="A draft page accidentally left inside the XML sitemap with a meta robots noindex directive attached to its head.">'
                f'<link rel="canonical" href="{b}/noindex-page"></head><body><h1>Draft</h1></body></html>'
            ),
            "/missing-lang": (
                200, {},
                f'<!doctype html><html><head><title>Page Without HTML Lang Attribute</title>'
                f'<meta name="description" content="This page has valid title, description, canonical, and heading tags, but omits the lang attribute on html.">'
                f'<link rel="canonical" href="{b}/missing-lang"></head><body><h1>No Lang</h1></body></html>'
            ),
            "/canon-to-redir": (
                200, {},
                f'<!doctype html><html lang="en"><head><title>Page With Canonical Pointing to Redirect</title>'
                f'<meta name="description" content="This page points its canonical link at an old URL that 301-redirects somewhere else instead of a 200 target.">'
                f'<link rel="canonical" href="{b}/old-url"></head><body><h1>Canon Redir</h1></body></html>'
            ),
            "/old-url": (301, {"Location": f"{b}/clean"}, ""),
            "/canon-to-404": (
                200, {},
                f'<!doctype html><html lang="en"><head><title>Page With Canonical Pointing to Dead 404</title>'
                f'<meta name="description" content="This page points its canonical tag at a nonexistent URL returning HTTP 404 Not Found on the same host.">'
                f'<link rel="canonical" href="{b}/dead-target"></head><body><h1>Canon 404</h1></body></html>'
            ),
            "/dead-target": (404, {}, "Not found"),
            "/loop-a": (302, {"Location": f"{b}/loop-b"}, ""),
            "/loop-b": (302, {"Location": f"{b}/loop-a"}, ""),
            "/bad-hreflang": (
                200, {},
                f'<!doctype html><html lang="en"><head><title>Page With Unreciprocated Hreflang Alternate</title>'
                f'<meta name="description" content="This page links to a French alternate page that does not link back to the English original in its hreflang set.">'
                f'<link rel="canonical" href="{b}/bad-hreflang">'
                f'<link rel="alternate" hreflang="en" href="{b}/bad-hreflang">'
                f'<link rel="alternate" hreflang="fr" href="{b}/fr-no-backlink">'
                f'</head><body><h1>Hreflang Test</h1></body></html>'
            ),
            "/fr-no-backlink": (
                200, {},
                f'<!doctype html><html lang="fr"><head><title>Page Francaise Sans Lien Retour Hreflang</title>'
                f'<meta name="description" content="Cette page francaise ne contient pas de balise hreflang de retour vers la page anglaise correspondante.">'
                f'<link rel="canonical" href="{b}/fr-no-backlink"></head><body><h1>Francais</h1></body></html>'
            ),
        }
        code, hdrs, body = routes.get(self.path, (404, {}, "Not found"))
        self.send_response(code)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        for k, v in hdrs.items():
            self.send_header(k, v)
        self.end_headers()
        if body:
            self.wfile.write(body.encode("utf-8"))


class LocalBlindspotTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), _TestHandler)
        port = cls.httpd.server_address[1]
        _TestHandler.base = f"http://127.0.0.1:{port}"
        cls.base = _TestHandler.base
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def test_all_six_blindspots_detected_and_clean_page_has_zero_issues(self):
        urls = [
            f"{self.base}/clean",
            f"{self.base}/es/clean",
            f"{self.base}/noindex-page",
            f"{self.base}/missing-lang",
            f"{self.base}/canon-to-redir",
            f"{self.base}/canon-to-404",
            f"{self.base}/loop-a",
            f"{self.base}/bad-hreflang",
        ]
        rep = sa.local_audit(self.base, urls, from_sitemap=True)
        self.assertEqual(rep["unavailable_on_this_source"], [])
        self.assertEqual(rep["cost_usd"], 0.0)
        by_url = {}
        for it in rep["issues"]:
            by_url.setdefault(it["url"], set()).add(it["kind"])

        self.assertNotIn(f"{self.base}/clean", by_url)
        self.assertNotIn(f"{self.base}/es/clean", by_url)
        self.assertIn("noindex_in_sitemap", by_url[f"{self.base}/noindex-page"])
        self.assertIn("lang_missing", by_url[f"{self.base}/missing-lang"])
        self.assertIn("canonical_to_redirect", by_url[f"{self.base}/canon-to-redir"])
        self.assertIn("canonical_to_4xx", by_url[f"{self.base}/canon-to-404"])
        self.assertIn("redirect_loop", by_url[f"{self.base}/loop-a"])
        self.assertIn("hreflang_mismatch", by_url[f"{self.base}/bad-hreflang"])


if __name__ == "__main__":
    unittest.main()
