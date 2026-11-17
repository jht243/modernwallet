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

        # Historical DEFERRED row drained by a newer row with 0 deferred + utility/sub-floor routes -> fastExit True
        old_day = (dt.datetime.now(dt.timezone.utc).date() - dt.timedelta(days=10)).isoformat()
        pages.write_text(json.dumps({'pages': [
            {'path': '/', 'views': 220},
            {'path': '/privacy', 'views': 15},
            {'path': '/guides/a', 'views': 80},
            {'path': '/guides/b', 'views': 60},
            {'path': '/guides/tiny-noise', 'views': 2},
        ]}))
        ledger.write_text(
            f'| {old_day} | /guides/a | 80 | DEFERRED | 1 |\n'
            f'| {today} | /guides/a | 80 | enriched | 0 |\n'
            f'| {today} | /guides/b | 60 | audited | 0 |\n'
        )
        drained = self.mod.check_ga4_cooldown(self.root, skill='ga4-top-pages-pass-auto', site='https://example.com', pages_json=pages, ledger_path=ledger)
        self.assertTrue(drained['fastExit'])
        self.assertIn('/', drained['skippedUtility'])
        self.assertIn('/guides/tiny-noise', drained['skippedLowViews'])

    def test_page_quality_pull_enforces_50_session_floor_two_flags_quick_answer_and_3strike_cooldown(self):
        pages = self.root / 'reports/pq-pull.json'
        pages.parent.mkdir(parents=True, exist_ok=True)
        ledger = self.root / 'reports/page-quality-pass/treatments.md'
        ledger.parent.mkdir(parents=True, exist_ok=True)
        ledger.write_text('')

        # Healthy / below-floor / QUICK_ANSWER_OK -> fastExit True
        pages.write_text(json.dumps({'pages': [
            {'path': '/guides/h1', 'sessions': 120, 'avg_eng_s': 60, 'engagement_rate': 0.70, 'bounce_rate': 0.30, 'scrolled_pct': 65},
            {'path': '/guides/h2', 'sessions': 110, 'avg_eng_s': 58, 'engagement_rate': 0.68, 'bounce_rate': 0.32, 'scrolled_pct': 62},
            {'path': '/guides/h3', 'sessions': 90, 'avg_eng_s': 62, 'engagement_rate': 0.72, 'bounce_rate': 0.28, 'scrolled_pct': 70},
            # Quick-answer page: low dwell (20s < 30s), low engagement_rate (0.20 < 0.34), BUT bounce <= median (0.25 <= 0.31) and scroll healthy (60%)
            {'path': '/guides/quick-def', 'sessions': 85, 'avg_eng_s': 20, 'engagement_rate': 0.20, 'bounce_rate': 0.25, 'scrolled_pct': 60},
            # Below 50-session floor even with terrible engagement
            {'path': '/guides/low-vol', 'sessions': 35, 'avg_eng_s': 5, 'engagement_rate': 0.10, 'bounce_rate': 0.90, 'scrolled_pct': 10},
        ]}))
        res_quiet = self.mod.check_page_quality_pull(self.root, site='https://example.com', pages_json=pages, ledger_path=ledger)
        self.assertTrue(res_quiet['fastExit'])

        # Add a genuinely weak >=50-session page (DWELL + BOUNCE) -> fastExit False
        doc = json.loads(pages.read_text())
        doc['pages'].append({'path': '/guides/weak-page', 'sessions': 75, 'avg_eng_s': 12, 'engagement_rate': 0.20, 'bounce_rate': 0.65, 'scrolled_pct': 20})
        pages.write_text(json.dumps(doc))
        res_active = self.mod.check_page_quality_pull(self.root, site='https://example.com', pages_json=pages, ledger_path=ledger)
        self.assertFalse(res_active['fastExit'])
        self.assertEqual([r['route'] for r in res_active['eligible']], ['/guides/weak-page'])

        # 3-strike repeat offender within 30 days -> skipped on 30-day cooldown -> fastExit True
        d25 = (dt.datetime.now(dt.timezone.utc).date() - dt.timedelta(days=25)).isoformat()
        d18 = (dt.datetime.now(dt.timezone.utc).date() - dt.timedelta(days=18)).isoformat()
        d12 = (dt.datetime.now(dt.timezone.utc).date() - dt.timedelta(days=12)).isoformat()
        ledger.write_text(
            f'| {d25} | /guides/weak-page | rewrite |\n'
            f'| {d18} | /guides/weak-page | rewrite |\n'
            f'| {d12} | /guides/weak-page | rewrite |\n'
        )
        res_3strike = self.mod.check_page_quality_pull(self.root, site='https://example.com', pages_json=pages, ledger_path=ledger)
        self.assertTrue(res_3strike['fastExit'])

        # Real ga4_pull_24h.py schema uses {"top_pages": [{"page": "/...", ...}]} — must NOT false-fast-exit!
        ledger.write_text('')
        pages.write_text(json.dumps({
            'property_id': '12345',
            'data_date': '2026-11-16',
            'source': 'ga4',
            'top_pages': [
                {'page': '/', 'views': 250, 'sessions': 210, 'avg_eng_s': 45, 'engagement_rate': 0.55, 'bounce_rate': 0.45},
                {'page': '/guides/h1', 'views': 140, 'sessions': 120, 'avg_eng_s': 60, 'engagement_rate': 0.70, 'bounce_rate': 0.30, 'scrolled_pct': 0.65},
                {'page': '/guides/h2', 'views': 130, 'sessions': 110, 'avg_eng_s': 58, 'engagement_rate': 0.68, 'bounce_rate': 0.32, 'scrolled_pct': 0.62},
                {'page': '/guides/h3', 'views': 105, 'sessions': 90, 'avg_eng_s': 62, 'engagement_rate': 0.72, 'bounce_rate': 0.28, 'scrolled_pct': 0.70},
                {'page': '/companies/weak-target', 'views': 88, 'sessions': 73, 'avg_eng_s': 0.3, 'engagement_rate': 0.05, 'bounce_rate': 0.95, 'scrolled_pct': 0.04},
            ],
        }))
        res_real_schema = self.mod.check_page_quality_pull(self.root, site='https://example.com', pages_json=pages, ledger_path=ledger)
        self.assertFalse(res_real_schema['fastExit'])
        self.assertEqual([r['route'] for r in res_real_schema['eligible']], ['/companies/weak-target'])

        res_ga4_real_schema = self.mod.check_ga4_cooldown(
            self.root, skill='ga4-top-pages-pass-auto', site='https://example.com', pages_json=pages, ledger_path=ledger
        )
        self.assertFalse(res_ga4_real_schema['fastExit'])
        self.assertIn('/companies/weak-target', res_ga4_real_schema['eligibleRoutes'])

    def test_trend_research_pack_never_skips_when_wide_view_has_findings(self):
        rmd = self.root / 'reports/trend-pass/2026-11-15.research.md'
        rmd.parent.mkdir(parents=True, exist_ok=True)
        empty_pack = (
            '## Tier-0 breaking events (last 72h)\n- None this run\n\n'
            '## Trend gap findings\nVerdict: No clear trend\n- None this run\n\n'
            '## Query check — uncovered top-20 queries\nVerdict: All top-20 queries already covered\n- None this run\n\n'
            '## Rising & spillover uncovered queries (wide view)\n- None this run\n\n'
            '## Sideways formula / pattern expansion candidates (wide view)\n- None this run\n'
        )
        rmd.write_text(empty_pack)
        res0 = self.mod.check_trend_research_pack(self.root, research_md=rmd, site='https://example.com')
        self.assertTrue(res0['fastExit'])

        # Trend=0, Top20=0, BUT Wide View rising/spillover found 1 item -> MUST NOT fast-exit!
        rmd.write_text(empty_pack.replace(
            '## Rising & spillover uncovered queries (wide view)\n- None this run',
            '## Rising & spillover uncovered queries (wide view)\n- `claude code remote routines` — +240% WoW, 0 dedicated guide',
        ))
        res_wide1 = self.mod.check_trend_research_pack(self.root, research_md=rmd, site='https://example.com')
        self.assertFalse(res_wide1['fastExit'])
        self.assertEqual(res_wide1['counts']['wideViewRisingSpillover'], 1)

        # Trend=0, Top20=0, BUT Wide View sideways formula found 1 item -> MUST NOT fast-exit!
        rmd.write_text(empty_pack.replace(
            '## Sideways formula / pattern expansion candidates (wide view)\n- None this run',
            '## Sideways formula / pattern expansion candidates (wide view)\n- `[tool] vs [tool] for agencies` — 3 winners, 2 unbuilt siblings',
        ))
        res_wide2 = self.mod.check_trend_research_pack(self.root, research_md=rmd, site='https://example.com')
        self.assertFalse(res_wide2['fastExit'])
        self.assertEqual(res_wide2['counts']['wideViewSidewaysFormulas'], 1)

    def test_comparison_prefilter_removes_duplicates_without_capping_survivors(self):
        pub = self.root / 'public'
        pub.mkdir(parents=True, exist_ok=True)
        (pub / 'sitemap.xml').write_text(
            '<urlset><url><loc>https://example.com/comparisons/alpha-vs-beta</loc></url>'
            '<url><loc>https://example.com/comparisons/best-crm-tools</loc></url></urlset>'
        )
        cache = self.root / 'reports/comparison-content-creator/cache.json'
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(json.dumps({'versus_scored': {'old-vs-dead': {'status': 'dropped', 'reason': 'zero volume'}}}))

        q = self.mod._load_quarantine(self.root)
        q.record_ticket(self.root, skill='comparison-content-auto', item_id='quarantined-vs-tool', routes=['/comparisons/quarantined-vs-tool'], reason='audit fail')

        cands = self.root / 'reports/comparison-content-creator/2026-11-15-candidates.json'
        # Include 4 dup/rejected/quarantined + 15 brand-new valid candidates (verifies NO artificial cap!)
        raw_items = [
            {'slug': 'best-crm-tools', 'status': 'NEW'},
            {'slug': 'beta-vs-alpha', 'status': 'NEW'},  # symmetric B-vs-A of live alpha-vs-beta
            {'slug': 'old-vs-dead', 'status': 'NEW'},
            {'slug': 'quarantined-vs-tool', 'status': 'NEW'},
        ] + [{'slug': f'new-tool-{i}-vs-rival', 'status': 'NEW'} for i in range(15)]
        cands.write_text(json.dumps({'candidates': raw_items}))

        res = self.mod.check_comparison_prefilter(self.root, candidates_json=cands, site='https://example.com', cache_path=cache)
        self.assertFalse(res['fastExit'])
        self.assertEqual(res['survivingCount'], 15)
        self.assertEqual(res['dropped']['duplicate_live'], 1)
        self.assertEqual(res['dropped']['symmetric_versus_live'], 1)
        self.assertEqual(res['dropped']['cached_rejected'], 1)
        self.assertEqual(res['dropped']['quarantined'], 1)

        # When 0 survive -> fastExit True
        cands.write_text(json.dumps({'candidates': raw_items[:4]}))
        res_empty = self.mod.check_comparison_prefilter(self.root, candidates_json=cands, site='https://example.com', cache_path=cache)
        self.assertTrue(res_empty['fastExit'])

    def test_indexing_sweep_fast_exits_when_only_healthy_or_linked_uncrawled_and_runs_on_defect(self):
        pub = self.root / 'public'
        pub.mkdir(parents=True, exist_ok=True)
        (pub / 'sitemap.xml').write_text(
            '<urlset><url><loc>https://example.com/guides/a</loc></url>'
            '<url><loc>https://example.com/guides/new-linked</loc></url>'
            '<url><loc>https://example.com/guides/orphan</loc></url></urlset>'
        )
        src = self.root / 'src/pages'
        src.mkdir(parents=True, exist_ok=True)
        (src / 'hub1.tsx').write_text('<a href="/guides/new-linked">New</a>')
        (src / 'hub2.tsx').write_text('[New](/guides/new-linked)')

        insp = self.root / 'reports/indexing-pass/2026-11-15.inspection.json'
        insp.parent.mkdir(parents=True, exist_ok=True)
        insp.write_text(json.dumps({
            'inspected': {
                'https://example.com/guides/a': {'coverage_state': 'Submitted and indexed'},
                'https://example.com/guides/a?ref=1': {'coverage_state': 'Alternate page with proper canonical'},
                'https://example.com/guides/new-linked': {'coverage_state': 'Discovered - currently not indexed'},
            },
            'skipped_sitemaps': [],
        }))
        res_ok = self.mod.check_indexing_sweep(self.root, inspection_json=insp, site='https://example.com')
        self.assertTrue(res_ok['fastExit'])
        self.assertEqual(res_ok['awaitingCrawlLinked'], 1)

        # Unlinked orphan Discovered URL -> fastExit False so routine adds internal links!
        insp.write_text(json.dumps({
            'inspected': {
                'https://example.com/guides/orphan': {'coverage_state': 'Discovered - currently not indexed'},
            },
            'skipped_sitemaps': [],
        }))
        res_orphan = self.mod.check_indexing_sweep(self.root, inspection_json=insp, site='https://example.com')
        self.assertFalse(res_orphan['fastExit'])

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



    def test_post_collector_alias_emits_stop_directive(self):
        pull = self.root / 'reports/search-gap/pull.json'
        pull.parent.mkdir(parents=True, exist_ok=True)
        pull.write_text(json.dumps({'candidates': []}))
        import io
        from contextlib import redirect_stdout
        buf = io.StringIO()
        with redirect_stdout(buf):
            rc = self.mod.main([
                '--root', str(self.root),
                'json-candidates',
                '--skill', 'search-gap-content-auto',
                '--site', 'https://example.com',
                '--input', str(pull),
                '--post-collector',
            ])
        self.assertEqual(rc, 0)
        out = json.loads(buf.getvalue())
        self.assertTrue(out['fastExit'])
        self.assertTrue(out['collectorPosted'])
        self.assertIn('STOP_IMMEDIATELY', out['next'])

    def test_ga4_cooldown_filters_low_view_noise_on_low_traffic_sites_and_defaults_ledger(self):
        pages = self.root / 'reports/trend-pass/ga4_24h.json'
        pages.parent.mkdir(parents=True, exist_ok=True)
        # Total views = 11 (< 25), all routes have < 5 views -> must fastExit True!
        pages.write_text(json.dumps({
            'top_pages': [
                {'page': '/', 'views': 4},
                {'page': '/guides/a', 'views': 4},
                {'page': '/guides/b', 'views': 3},
            ],
        }))
        import io
        from contextlib import redirect_stdout
        buf = io.StringIO()
        with redirect_stdout(buf):
            # Omit --ledger to verify CLI default
            rc = self.mod.main([
                '--root', str(self.root),
                'ga4-cooldown',
                '--site', 'https://example.com',
                '--pages-json', str(pages),
            ])
        self.assertEqual(rc, 0)
        out = json.loads(buf.getvalue())
        self.assertTrue(out['fastExit'])
        self.assertEqual(out['skippedLowViews'], ['/guides/a', '/guides/b'])

    def test_indexing_sweep_counts_links_in_lib_and_large_multi_entry_data_ts(self):
        pub = self.root / 'public'
        pub.mkdir(parents=True, exist_ok=True)
        (pub / 'sitemap.xml').write_text(
            '<urlset><url><loc>https://example.com/guides/multi-linked</loc></url>'
            '<url><loc>https://example.com/guides/lib-linked</loc></url></urlset>'
        )
        data_dir = self.root / 'data'
        data_dir.mkdir(parents=True, exist_ok=True)
        # >25KB multi-entry data/*.ts file mentioning /guides/multi-linked in 2 distinct entries
        padding = '// ' + ('x' * 28000) + '\n'
        (data_dir / 'guides-new.ts').write_text(
            padding
            + 'export const g1 = { body: "See [Guide](/guides/multi-linked) for details." };\n'
            + 'export const g2 = { body: "Also check [Guide](/guides/multi-linked) next." };\n'
        )
        lib_dir = self.root / 'lib'
        lib_dir.mkdir(parents=True, exist_ok=True)
        (lib_dir / 'nav.ts').write_text(
            'export const nav1 = { path: "/guides/lib-linked" };\n'
        )
        src_dir = self.root / 'src/pages'
        src_dir.mkdir(parents=True, exist_ok=True)
        (src_dir / 'index.tsx').write_text('<a href="/guides/lib-linked">Lib</a>\n')

        insp = self.root / 'reports/indexing-pass/2026-11-17.inspection.json'
        insp.parent.mkdir(parents=True, exist_ok=True)
        insp.write_text(json.dumps({
            'inspected': {
                'https://example.com/guides/multi-linked': {'coverage_state': 'Discovered - currently not indexed'},
                'https://example.com/guides/lib-linked': {'coverage_state': 'Discovered - currently not indexed'},
            },
            'skipped_sitemaps': [],
        }))
        res = self.mod.check_indexing_sweep(self.root, inspection_json=insp, site='https://example.com')
        self.assertTrue(res['fastExit'])
        self.assertEqual(res['awaitingCrawlLinked'], 2)


if __name__ == '__main__':
    unittest.main()
