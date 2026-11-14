#!/usr/bin/env python3
"""Unit tests for routine-fast-exit.py deterministic boundaries."""
import datetime as dt
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest


def load_fast_exit():
    path = Path(__file__).with_name('routine-fast-exit.py')
    spec = importlib.util.spec_from_file_location('fast_exit_mod', path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class RoutineFastExitTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='layer3-fast-exit-')
        self.root = Path(self.tmp.name).resolve()
        tools_dir = self.root / '.claude/tools'
        tools_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(Path(__file__).with_name('quarantine.py'), tools_dir / 'quarantine.py')
        shutil.copy2(Path(__file__).with_name('routine-fast-exit.py'), tools_dir / 'routine-fast-exit.py')
        self.mod = load_fast_exit()

    def tearDown(self):
        self.tmp.cleanup()

    def test_json_candidates_fast_exits_only_when_zero_and_preserves_mindmap_when_nonempty(self):
        pull = self.root / 'reports/news-radar/pull.json'
        pull.parent.mkdir(parents=True, exist_ok=True)
        pull.write_text(json.dumps({'candidates': []}))
        res0 = self.mod.check_json_candidates(self.root, skill='news-radar-mindmap-auto', site='https://example.com', input_path=pull)
        self.assertTrue(res0['fastExit'])

        pull.write_text(json.dumps({'candidates': [{'id': 'c1', 'title': 'New release'}]}))
        res1 = self.mod.check_json_candidates(self.root, skill='news-radar-mindmap-auto', site='https://example.com', input_path=pull)
        self.assertFalse(res1['fastExit'])
        self.assertEqual(res1['reason'], 'candidates_present_requires_mindmap_dedup')

        # Open durable intake blocks fast exit even if today's pull is empty
        pull.write_text(json.dumps({'candidates': []}))
        intake_dir = self.root / 'reports/news-radar/intakes'
        intake_dir.mkdir(parents=True, exist_ok=True)
        (intake_dir / ('a' * 64 + '.json')).write_text('{}')
        res_open = self.mod.check_json_candidates(
            self.root, skill='news-radar-mindmap-auto', site='https://example.com',
            input_path=pull, open_intake_dir=intake_dir,
        )
        self.assertFalse(res_open['fastExit'])

    def test_paid_publisher_fast_exits_on_quiet_hour_and_runs_when_order_queued(self):
        pp = self.root / 'scripts/paid_placements'
        pp.mkdir(parents=True, exist_ok=True)
        (self.root / '.git').mkdir(exist_ok=True)
        (pp / 'ledger.json').write_text(json.dumps({'queued': [{'id': 'pub1', 'liveAt': '2026-11-10T00:00:00Z', 'unpaidPublishFirst': True}]}))
        (pp / 'fix-queue.json').write_text(json.dumps({'rows': []}))
        (pp / 'upsell-queue.json').write_text(json.dumps({'rows': []}))
        quiet = self.mod.check_paid_publisher(self.root)
        self.assertTrue(quiet['fastExit'])

        (pp / 'ledger.json').write_text(json.dumps({'queued': [{'id': 'ord2', 'status': 'queued'}]}))
        active = self.mod.check_paid_publisher(self.root)
        self.assertFalse(active['fastExit'])
        self.assertEqual(active['orders'], ['ord2'])

    def test_ga4_cooldown_fast_exits_when_all_pages_recent_and_runs_when_eligible_or_deferred(self):
        today = dt.datetime.now(dt.timezone.utc).date().isoformat()
        pages = self.root / 'reports/ga4-top10.json'
        pages.parent.mkdir(parents=True, exist_ok=True)
        pages.write_text(json.dumps({'pages': [{'path': '/guides/a'}, {'path': '/guides/b'}]}))
        ledger = self.root / 'reports/trend-pass/ga4-page-audits.md'
        ledger.parent.mkdir(parents=True, exist_ok=True)
        ledger.write_text(f'| /guides/a | audited | {today} |\n| /guides/b | audited | {today} |\n')

        cool = self.mod.check_ga4_cooldown(self.root, skill='ga4-top-pages-pass-auto', site='https://example.com', pages_json=pages, ledger_path=ledger)
        self.assertTrue(cool['fastExit'])

        ledger.write_text(f'| /guides/a | DEFERRED | {today} |\n| /guides/b | audited | {today} |\n')
        def_res = self.mod.check_ga4_cooldown(self.root, skill='ga4-top-pages-pass-auto', site='https://example.com', pages_json=pages, ledger_path=ledger)
        self.assertFalse(def_res['fastExit'])


if __name__ == '__main__':
    unittest.main()
