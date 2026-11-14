#!/usr/bin/env python3
"""Unit tests for additive GSC pull signals (`gsc_signals.py`, `gsc_pull_24h.py`, `gsc_pull_7d.py`)."""

from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import gsc_signals  # noqa: E402

try:
    import gsc_pull_24h  # noqa: E402
except ImportError:
    gsc_pull_24h = None

try:
    import gsc_pull_7d  # noqa: E402
except ImportError:
    gsc_pull_7d = None


class GscSignalsTests(unittest.TestCase):
    def setUp(self):
        # Mirrors the exact Ban the Bots GSC screenshot + hidden page-2/3 rows.
        self.btb_rows = [
            {"query": "dumb tv", "clicks": 26, "impressions": 722, "ctr": 0.036, "position": 7.4},
            {"query": "non smart tv", "clicks": 23, "impressions": 1480, "ctr": 0.0155, "position": 8.9},
            {"query": "pinterest alternatives without ai", "clicks": 19, "impressions": 170, "ctr": 0.1118, "position": 2.9},
            {"query": "dumb tvs 2026", "clicks": 18, "impressions": 166, "ctr": 0.1084, "position": 4.8},
            {"query": "dumb phone for kids", "clicks": 12, "impressions": 558, "ctr": 0.0215, "position": 6.4},
            {"query": "4k dumb tv", "clicks": 9, "impressions": 112, "ctr": 0.0804, "position": 5.6},
            {"query": "alternatives to pinterest no ai", "clicks": 7, "impressions": 49, "ctr": 0.1429, "position": 3.1},
            {"query": "dumb phones for kids", "clicks": 6, "impressions": 161, "ctr": 0.0373, "position": 6.5},
            {"query": "pinterest without ai", "clicks": 5, "impressions": 85, "ctr": 0.0588, "position": 5.8},
            {"query": "alternative to pinterest without ai", "clicks": 5, "impressions": 26, "ctr": 0.1923, "position": 3.3},
            {"query": "browser without ai", "clicks": 4, "impressions": 94, "ctr": 0.0426, "position": 6.2},
            {"query": "how to turn off google ai", "clicks": 4, "impressions": 167, "ctr": 0.024, "position": 7.1},
            {"query": "how to turn off meta ai", "clicks": 3, "impressions": 118, "ctr": 0.0254, "position": 8.4},
            {"query": "search engine without ai", "clicks": 3, "impressions": 89, "ctr": 0.0337, "position": 7.9},
            {"query": "ai water usage", "clicks": 3, "impressions": 65, "ctr": 0.0462, "position": 6.1},
            {"query": "data center noise", "clicks": 3, "impressions": 54, "ctr": 0.0556, "position": 5.9},
            {"query": "grok controversy", "clicks": 2, "impressions": 48, "ctr": 0.0417, "position": 6.8},
            {"query": "waymo safety", "clicks": 2, "impressions": 44, "ctr": 0.0455, "position": 7.2},
            {"query": "ai layoffs 2026", "clicks": 2, "impressions": 41, "ctr": 0.0488, "position": 7.5},
            {"query": "ban the bots", "clicks": 2, "impressions": 20, "ctr": 0.1, "position": 1.2},
            # Rows 21+ (previously discarded before additive upgrade):
            {"query": "dumb baby monitor", "clicks": 1, "impressions": 240, "ctr": 0.0042, "position": 14.2},
            {"query": "reddit alternatives without ai", "clicks": 0, "impressions": 185, "ctr": 0.0, "position": 18.6},
            {"query": "non smart washing machine", "clicks": 0, "impressions": 142, "ctr": 0.0, "position": 21.4},
            {"query": "dumb watch for runners", "clicks": 1, "impressions": 96, "ctr": 0.0104, "position": 16.0},
            {"query": "-site:pinterest.com aesthetic wallpaper", "clicks": 0, "impressions": 500, "ctr": 0.0, "position": 12.0},
        ]

        self.btb_baseline = [
            {"query": "dumb tv", "clicks": 24, "impressions": 690},
            {"query": "non smart tv", "clicks": 10, "impressions": 520},
            {"query": "dumb phone for kids", "clicks": 11, "impressions": 530},
            {"query": "ai water usage", "clicks": 3, "impressions": 62},
            # Notice: `pinterest alternatives without ai`, `dumb baby monitor`,
            # and `reddit alternatives without ai` were absent in baseline (0 impr).
        ]

    def test_extracts_dumb_non_smart_and_without_ai_formulas(self):
        patterns = gsc_signals.extract_modifier_patterns(self.btb_rows)
        pattern_names = [p["pattern"] for p in patterns]

        self.assertIn("dumb <X>", pattern_names)
        self.assertIn("non smart <X>", pattern_names)
        self.assertTrue(
            "<X> without ai" in pattern_names or "<X> alternatives without ai" in pattern_names,
            msg=f"Expected without-ai formula in {pattern_names}",
        )
        self.assertIn("how to turn off <X>", pattern_names)

        dumb_pat = next(p for p in patterns if p["pattern"] == "dumb <X>")
        self.assertEqual(dumb_pat["pattern_type"], "multi_entity")
        self.assertGreaterEqual(dumb_pat["distinct_entities"], 3)  # tv, phone, baby monitor, watch

    def test_single_breakout_formula_triggers_even_on_first_entity(self):
        # Only 10 screenshot rows: `non smart tv` has 1 entity (`tv`) with 23 clicks & 1,480 impr,
        # and `pinterest alternatives without ai` has 1 entity (`pinterest`) with 19 clicks & 170 impr.
        top10_only = self.btb_rows[:10]
        patterns = gsc_signals.extract_modifier_patterns(top10_only)
        names = [p["pattern"] for p in patterns]
        self.assertIn("dumb <X>", names)  # tv + phone -> multi_entity
        self.assertIn("non smart <X>", names)  # single_breakout
        self.assertIn("<X> alternatives without ai", names)  # single_breakout

        # Plural variants (`dumb tv` + `dumb tvs 2026`) alone should count as ONE entity (`tv`),
        # NOT falsely inflate distinct_entities to 2.
        tv_only = [
            {"query": "dumb tv", "clicks": 26, "impressions": 722},
            {"query": "dumb tvs 2026", "clicks": 18, "impressions": 166},
            {"query": "4k dumb tv", "clicks": 9, "impressions": 112},
        ]
        tv_patterns = gsc_signals.extract_modifier_patterns(tv_only)
        dumb_tv_pat = next(p for p in tv_patterns if p["pattern"] == "dumb <X>")
        self.assertEqual(dumb_tv_pat["distinct_entities"], 1)
        self.assertEqual(dumb_tv_pat["pattern_type"], "single_breakout")

    def test_spillover_queries_surface_page2_gems_and_filter_noise(self):
        top20_set = {r["query"].lower() for r in self.btb_rows[:20]}
        spillovers = gsc_signals.compute_spillover_queries(self.btb_rows, top20_queries=top20_set, is_24h=False)
        queries = [s["query"] for s in spillovers]

        self.assertIn("dumb baby monitor", queries)
        self.assertIn("reddit alternatives without ai", queries)
        self.assertIn("non smart washing machine", queries)
        # Crawler noise `-site:pinterest.com` must be excluded despite 500 impressions
        self.assertFalse(any("site:" in q for q in queries))
        # None of top-20 should duplicate into spillovers
        self.assertTrue(all(q.lower() not in top20_set for q in queries))

    def test_rising_queries_detect_new_and_surging_breakouts(self):
        top20_set = {r["query"].lower() for r in self.btb_rows[:20]}
        rising = gsc_signals.compute_rising_queries(
            self.btb_rows,
            self.btb_baseline,
            baseline_divisor=1.0,
            top20_queries=top20_set,
        )
        by_q = {r["query"]: r for r in rising}

        self.assertIn("dumb baby monitor", by_q)
        self.assertEqual(by_q["dumb baby monitor"]["growth_tag"], "new")
        self.assertFalse(by_q["dumb baby monitor"]["in_top20"])

        self.assertIn("pinterest alternatives without ai", by_q)
        self.assertEqual(by_q["pinterest alternatives without ai"]["growth_tag"], "new")

        self.assertIn("non smart tv", by_q)
        self.assertEqual(by_q["non smart tv"]["growth_tag"], "surging")

        # Flat steady query (`ai water usage`: 65 vs 62 impr) must NOT be flagged rising
        self.assertNotIn("ai water usage", by_q)

    @unittest.skipIf(gsc_pull_7d is None, "gsc_pull_7d.py not installed in this repo")
    def test_pull_7d_preserves_legacy_keys_and_degrades_gracefully_on_baseline_error(self):
        current_gsc_resp = {
            "rows": [
                {
                    "keys": [r["query"]],
                    "clicks": r["clicks"],
                    "impressions": r["impressions"],
                    "ctr": r["ctr"],
                    "position": r["position"],
                }
                for r in self.btb_rows
            ]
        }
        pages_resp = {
            "rows": [
                {"keys": ["https://www.banthebots.org/guides/dumb-tvs"], "clicks": 50, "impressions": 1900, "ctr": 0.026, "position": 6.1}
            ]
        }

        call_count = {"n": 0}

        def fake_query(_session, _site_url, body):
            call_count["n"] += 1
            if body["dimensions"] == ["page"]:
                return pages_resp
            if call_count["n"] == 1:
                return current_gsc_resp
            raise RuntimeError("simulated transient GSC baseline timeout")

        with tempfile.TemporaryDirectory() as td:
            out_file = Path(td) / "pull.json"
            with (
                patch.object(gsc_pull_7d, "load_credentials", return_value=object()),
                patch.object(gsc_pull_7d, "build_session", return_value=object()),
                patch.object(gsc_pull_7d, "query_search_analytics", side_effect=fake_query),
            ):
                rc = gsc_pull_7d.main(["--base-url", "https://www.banthebots.org", "--json", str(out_file)])
            self.assertEqual(rc, 0)
            payload = json.loads(out_file.read_text())

        # Legacy contract preserved 100%
        self.assertEqual(len(payload["top_queries"]), 10)
        self.assertEqual(len(payload["coverage_queries"]), 20)
        self.assertEqual(len(payload["top_pages"]), 1)
        self.assertIn("top10_pages_total_clicks", payload)
        self.assertIn("top10_queries_total_clicks", payload)
        # Additive keys present even when baseline failed
        self.assertIsNone(payload["baseline_window"])
        self.assertEqual(payload["rising_queries"], [])
        self.assertGreaterEqual(len(payload["spillover_queries"]), 3)
        self.assertGreaterEqual(len(payload["modifier_patterns"]), 3)

    @unittest.skipIf(gsc_pull_24h is None, "gsc_pull_24h.py not installed in this repo")
    def test_pull_24h_normalizes_7d_baseline_daily_average(self):
        date_resp = {"rows": [{"keys": ["2026-11-13"]}]}
        day_queries_resp = {
            "rows": [
                {"keys": ["chatgpt free trial"], "clicks": 6, "impressions": 420, "ctr": 0.014, "position": 7.5},
                {"keys": ["claude pro free trial"], "clicks": 0, "impressions": 95, "ctr": 0.0, "position": 14.0},
            ] + [
                {"keys": [f"steady query {i}"], "clicks": 2, "impressions": 30, "ctr": 0.066, "position": 4.0}
                for i in range(20)
            ]
        }
        # Prior 7 days total: steady queries had 14 clicks & 210 impr (= 2 clicks/day, 30 impr/day -> flat),
        # while `chatgpt free trial` had 7 clicks & 350 impr (= 1 click/day, 50 impr/day -> surging 8.4x!).
        base_queries_resp = {
            "rows": [
                {"keys": ["chatgpt free trial"], "clicks": 7, "impressions": 350, "ctr": 0.02, "position": 8.0},
            ] + [
                {"keys": [f"steady query {i}"], "clicks": 14, "impressions": 210, "ctr": 0.066, "position": 4.0}
                for i in range(20)
            ]
        }
        pages_resp = {
            "rows": [{"keys": ["https://www.layer3labs.io/guides/chatgpt"], "clicks": 10, "impressions": 500, "ctr": 0.02, "position": 4.2}]
        }

        def fake_query(_session, _site_url, body):
            if body["dimensions"] == ["date"]:
                return date_resp
            if body["dimensions"] == ["page"]:
                return pages_resp
            if body["startDate"] == body["endDate"]:
                return day_queries_resp
            return base_queries_resp

        with tempfile.TemporaryDirectory() as td:
            out_file = Path(td) / "pull24.json"
            with (
                patch.object(gsc_pull_24h, "load_credentials", return_value=object()),
                patch.object(gsc_pull_24h, "build_session", return_value=object()),
                patch.object(gsc_pull_24h, "query_search_analytics", side_effect=fake_query),
            ):
                rc = gsc_pull_24h.main(["--base-url", "https://www.layer3labs.io", "--json", str(out_file)])
            self.assertEqual(rc, 0)
            payload = json.loads(out_file.read_text())

        self.assertEqual(payload["data_date"], "2026-11-13")
        self.assertEqual(len(payload["top_queries"]), 10)
        self.assertEqual(len(payload["coverage_queries"]), 20)
        rising_q = {r["query"]: r for r in payload["rising_queries"]}
        self.assertIn("chatgpt free trial", rising_q)
        self.assertEqual(rising_q["chatgpt free trial"]["growth_tag"], "surging")
        self.assertIn("claude pro free trial", rising_q)
        self.assertEqual(rising_q["claude pro free trial"]["growth_tag"], "new")
        self.assertIn("claude pro free trial", [s["query"] for s in payload["spillover_queries"]])
        self.assertIn("<X> free trial", [p["pattern"] for p in payload["modifier_patterns"]])


if __name__ == "__main__":
    unittest.main()
