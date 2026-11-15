#!/usr/bin/env python3
"""Unit tests for scripts/lib/serp.py Google goto/redirect domain resolution."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("serp", Path(__file__).with_name("serp.py"))
serp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(serp)


class SerpGotoDomainTests(unittest.TestCase):
    def test_google_goto_resolves_breadcrumb_domains_without_false_locked_verdict(self):
        payload = {
            "se_results_count": 150,
            "items": [
                {
                    "type": "organic",
                    "rank_group": 1,
                    "domain": "google.com",
                    "breadcrumb": "https://www.healthline.com › health › metabolism-test",
                    "url": "https://google.com/goto?url=CAESbgHEIkXXEn6W04fXdRw",
                },
                {
                    "type": "organic",
                    "rank_group": 2,
                    "domain": "google.com",
                    "breadcrumb": "https://pmc.ncbi.nlm.nih.gov › articles › PMC9987730",
                    "url": "https://google.com/goto?url=CAESbgHEIkXXZ5C1hrYiGs93",
                },
                {
                    "type": "organic",
                    "rank_group": 3,
                    "domain": "google.com",
                    "breadcrumb": "1.4K+ views · 1 year ago",
                    "url": "https://google.com/goto?url=CAESaAHEIkXXIx8WgTdCc2NR",
                },
                {
                    "type": "organic",
                    "rank_group": 4,
                    "domain": "google.com",
                    "url": "https://www.google.com/url?q=https%3A%2F%2Fwww.reddit.com%2Fr%2Fpeptides%2F&sa=U",
                },
                {
                    "type": "organic",
                    "rank_group": 5,
                    "domain": "workspace.google.com",
                    "breadcrumb": "https://workspace.google.com › products",
                    "url": "https://workspace.google.com/products/gmail/",
                },
                {
                    "type": "ai_overview",
                    "references": [
                        {"domain": "www.mayoclinic.org", "url": "https://www.mayoclinic.org/drugs"},
                        {"domain": "google.com", "url": "https://google.com/goto?url=CAESopaque"},
                    ],
                },
            ],
        }
        out = serp.summarize("best metabolic tracker", payload)
        self.assertEqual(
            out["top10_domains"],
            ["www.healthline.com", "pmc.ncbi.nlm.nih.gov", "www.reddit.com", "workspace.google.com"],
        )
        self.assertEqual(out["major_domains"], ["workspace.google.com"])
        self.assertEqual(out["forum_domains"], ["www.reddit.com"])
        self.assertEqual(out["verdict"], "winnable")
        self.assertEqual(out["ai_overview_cited_domains"], ["www.mayoclinic.org"])


if __name__ == "__main__":
    unittest.main()
