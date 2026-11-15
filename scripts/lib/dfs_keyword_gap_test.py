#!/usr/bin/env python3
"""Unit tests for lossless SERP-intent clustering & route pre-matching in dfs_keyword_gap.py."""
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
import dfs_keyword_gap as kg  # noqa: E402


class DfsKeywordGapClusterTest(unittest.TestCase):
    def test_lossless_clustering_preserves_100_percent_of_keywords(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "src/content/guides").mkdir(parents=True)
            (root / "src/content/guides/ai-tools-for-law-firms.md").write_text("---\ntitle: AI Tools for Law Firms\n---\n")

            gaps = [
                {"keyword": "best ai tools for law firms", "volume": 2400, "kd": 18, "tier": "core", "competitors": ["a.com", "b.com"], "score": 2500},
                {"keyword": "top ai tools for law firm", "volume": 1300, "kd": 16, "tier": "core", "competitors": ["a.com"], "score": 1400},
                {"keyword": "ai tool for law firms", "volume": 880, "kd": 14, "tier": "core", "competitors": ["c.com"], "score": 900},
                # Different buyer intent (pricing vs alternatives) MUST NOT merge with general listicle
                {"keyword": "ai tools for law firms pricing", "volume": 320, "kd": 12, "tier": "core", "competitors": ["a.com"], "score": 400},
                {"keyword": "ai tools for law firms alternatives", "volume": 210, "kd": 15, "tier": "adjacent", "competitors": ["b.com"], "score": 300},
                # Different model version numbers MUST NOT merge together
                {"keyword": "gpt 5 benchmark scores", "volume": 1900, "kd": 25, "tier": "core", "competitors": ["x.com"], "score": 2000},
                {"keyword": "gpt 6 benchmark scores", "volume": 1600, "kd": 22, "tier": "core", "competitors": ["x.com"], "score": 1700},
            ]

            clusters = kg.cluster_gaps(gaps, root=root)
            # Every single input keyword must be preserved across primary + supporting_keywords (ZERO cutting)
            flattened = [
                kw
                for c in clusters
                for kw in ([c["primary_keyword"]] + [s["keyword"] for s in c["supporting_keywords"]])
            ]
            self.assertEqual(sorted(flattened), sorted(g["keyword"] for g in gaps))

            # First 3 spelling/singular/plural variants collapse into 1 cluster
            law_cluster = next(c for c in clusters if c["primary_keyword"] == "best ai tools for law firms")
            self.assertEqual(law_cluster["member_count"], 3)
            supp_kws = [s["keyword"] for s in law_cluster["supporting_keywords"]]
            self.assertIn("top ai tools for law firm", supp_kws)
            self.assertIn("ai tool for law firms", supp_kws)
            self.assertEqual(law_cluster["total_volume"], 2400 + 1300 + 880)
            self.assertTrue(any(m["slug"] == "ai-tools-for-law-firms" for m in law_cluster["existing_coverage"]))

            # Pricing, alternatives, gpt-5, gpt-6 remain distinct clusters
            primaries = {c["primary_keyword"] for c in clusters}
            self.assertIn("ai tools for law firms pricing", primaries)
            self.assertIn("ai tools for law firms alternatives", primaries)
            self.assertIn("gpt 5 benchmark scores", primaries)
            self.assertIn("gpt 6 benchmark scores", primaries)

            brief = kg.format_clustered_brief_markdown("example.com", ["a.com", "b.com"], clusters, len(gaps))
            self.assertIn("0 cut", brief)
            self.assertIn("top ai tools for law firm", brief)
            self.assertIn("ai-tools-for-law-firms", brief)


if __name__ == "__main__":
    unittest.main()
