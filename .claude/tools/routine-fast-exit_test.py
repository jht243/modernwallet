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

        # Historical sent upsell hosted job record does not block fast-exit;
        # queued Q2b upsells under CLAUDE_CODE_REMOTE delegate cleanly to GitHub Actions publisher-failover.
        import os
        (pp / 'ledger.json').write_text(json.dumps({'queued': []}))
        (pp / 'upsell-queue.json').write_text(json.dumps({'rows': [
            {'id': 'sent_1', 'status': 'sent'},
            {'id': 'q_1', 'status': 'queued'},
        ]}))
        hosted_done = self.root / 'reports/mindmap-pass/2026-11-05-upsell-sent/hosted'
        hosted_done.mkdir(parents=True, exist_ok=True)
        (hosted_done / 'job-record.json').write_text(json.dumps({
            'jobId': 'upsell:sent_1',
            'orderIdentity': {'rowId': 'sent_1'},
            'completedSpecs': {'abc': True},
        }))
        prev_remote = os.environ.get('CLAUDE_CODE_REMOTE')
        try:
            os.environ['CLAUDE_CODE_REMOTE'] = 'true'
            cloud_quiet = self.mod.check_paid_publisher(self.root)
            self.assertTrue(cloud_quiet['fastExit'])
            self.assertIn('delegated to GitHub Actions publisher-failover', cloud_quiet['summary'])
        finally:
            if prev_remote is None:
                os.environ.pop('CLAUDE_CODE_REMOTE', None)
            else:
                os.environ['CLAUDE_CODE_REMOTE'] = prev_remote

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

    def test_two_strike_publisher_failure_quarantines_row_and_restores_quiet_fast_exit(self):
        pp = self.root / 'scripts/paid_placements'
        pp.mkdir(parents=True, exist_ok=True)
        (self.root / '.git').mkdir(exist_ok=True)
        (pp / 'ledger.json').write_text(json.dumps({'queued': []}))
        (pp / 'fix-queue.json').write_text(json.dumps({'rows': [{'id': 'stuck_fix_1', 'status': 'queued', 'pageUrl': 'https://www.layer3labs.io/comparisons/ai-crm'}]}))
        (pp / 'upsell-queue.json').write_text(json.dumps({'rows': []}))

        # Initially actionable
        self.assertFalse(self.mod.check_paid_publisher(self.root)['fastExit'])

        # Strike 1 -> recorded, NOT yet quarantined (1 retry permitted)
        s1 = self.mod.record_publisher_failure(self.root, kind='fix', item_id='stuck_fix_1', reason='old snippet mismatch')
        self.assertFalse(s1['quarantined'])
        self.assertEqual(s1['attempts'], 1)
        self.assertFalse(self.mod.check_paid_publisher(self.root)['fastExit'])

        # Strike 2 -> auto-quarantined -> quiet hours fast-exit in Turn 1!
        s2 = self.mod.record_publisher_failure(self.root, kind='fix', item_id='stuck_fix_1', reason='old snippet mismatch')
        self.assertTrue(s2['quarantined'])
        self.assertEqual(s2['attempts'], 2)
        self.assertTrue(self.mod.check_paid_publisher(self.root)['fastExit'])

    def test_fix_queue_check_locates_repo_source_line_across_markdown_formatting(self):
        fq_path = Path(__file__).resolve().parents[2] / 'scripts/paid_placements/fix_queue_check.py'
        if not fq_path.is_file():
            self.skipTest('scripts/paid_placements/fix_queue_check.py is central-repo only')
        spec = importlib.util.spec_from_file_location('fq_check', fq_path)
        fq = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(fq)

        (self.root / 'data').mkdir(parents=True, exist_ok=True)
        (self.root / 'data/comparisons-new.ts').write_text(
            'export const rows = [\n'
            '  { slug: "ai-video-ads", verdict: "Only **Creatify** and [Higgsfield](https://higgsfield.ai) insert the actual product object into the shot." }\n'
            '];\n'
        )
        hit = fq.locate_in_repo(
            'Only Creatify and Higgsfield insert the actual product object into the shot.',
            'https://www.layer3labs.io/comparisons/ai-video-ads',
            str(self.root),
        )
        self.assertIsNotNone(hit)
        self.assertEqual(hit['file'], 'data/comparisons-new.ts')
        self.assertEqual(hit['line'], 2)
        self.assertEqual(hit['similarity'], 1.0)


if __name__ == '__main__':
    unittest.main()
