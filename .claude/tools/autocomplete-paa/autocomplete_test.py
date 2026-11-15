#!/usr/bin/env python3
"""Unit tests for keep-alive + instant Google -> Bing -> DuckDuckGo fallback in autocomplete.py."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest import mock
import urllib.error
import urllib.parse

MOD_PATH = Path(__file__).with_name("autocomplete.py")
spec = importlib.util.spec_from_file_location("autocomplete_mod", MOD_PATH)
ac = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ac)


class AutocompleteFallbackTest(unittest.TestCase):
    def setUp(self):
        ac._reset_runtime_state()

    def tearDown(self):
        ac._reset_runtime_state()

    def test_google_403_switches_immediately_to_bing_zero_retries(self):
        calls = []

        def fake_http_json(url, timeout=8.0):
            host = urllib.parse.urlsplit(url).netloc
            calls.append(host)
            if host == "suggestqueries.google.com":
                raise urllib.error.HTTPError(url, 403, "Forbidden", None, None)
            if host == "api.bing.com":
                return ["ai tools", ["ai tools for lawyers", "ai tools for accounting"]]
            raise AssertionError(f"Unexpected host: {host}")

        with mock.patch.object(ac, "_http_get_json", side_effect=fake_http_json):
            sug1, src1 = ac.fetch_with_source("ai tools", "en", "us")
            sug2, src2 = ac.fetch_with_source("how ai tools", "en", "us")

        self.assertEqual(src1, "bing-live")
        self.assertEqual(sug1, ["ai tools for lawyers", "ai tools for accounting"])
        self.assertEqual(src2, "bing-live")
        # Google was tried ONCE total across both queries (0 retries, tripped circuit for rest of run)
        self.assertEqual(calls.count("suggestqueries.google.com"), 1)
        self.assertEqual(calls.count("api.bing.com"), 2)

    def test_falls_back_to_ddg_when_google_and_bing_unavailable(self):
        def fake_http_json(url, timeout=8.0):
            host = urllib.parse.urlsplit(url).netloc
            if host in ("suggestqueries.google.com", "api.bing.com"):
                raise urllib.error.HTTPError(url, 429, "Too Many Requests", None, None)
            if host == "ac.duckduckgo.com":
                return [{"phrase": "best crm for startups"}, {"phrase": "best crm for agencies"}]
            raise AssertionError(f"Unexpected host: {host}")

        with mock.patch.object(ac, "_http_get_json", side_effect=fake_http_json):
            sugs, src = ac.fetch_with_source("best crm", "en", "us")

        self.assertEqual(src, "ddg-live")
        self.assertEqual(sugs, ["best crm for startups", "best crm for agencies"])

    def test_inventory_dedup_appends_only_new_phrases(self):
        with tempfile.TemporaryDirectory() as td:
            inv = Path(td) / "target-keywords.md"
            inv.write_text(
                "| Target URL | Primary Keyword | Supporting Keywords |\n"
                "|---|---|---|\n"
                "| /crm | best crm | best crm for startups; crm pricing |\n"
            )
            tracked = ac._existing_keywords(inv.read_text())
            self.assertIn("best crm", tracked)
            self.assertIn("best crm for startups", tracked)
            added, skipped = ac.append_to_inventory(
                str(inv),
                [
                    {
                        "seed": "best crm",
                        "suggestions": [
                            {"query": "best crm for startups", "via": "base"},
                            {"query": "best crm for dentists", "via": "alphabet:d (bing-live)"},
                        ],
                    }
                ],
            )
            self.assertEqual(added, 1)
            self.assertEqual(skipped, 1)
            self.assertIn("best crm for dentists", inv.read_text())


if __name__ == "__main__":
    unittest.main()
