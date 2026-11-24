#!/usr/bin/env python3
"""Unit tests for unified Mindmap format-track router, token slicing, and proof gates."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[2]


def _load(name: str, rel: str):
    p = REPO / rel
    spec = importlib.util.spec_from_file_location(name, p)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


tracks = _load('mm_tracks', '.claude/tools/mindmap-tracks.py')
gates = _load('mm_gates', '.claude/tools/mindmap-gates.py')
wfl = _load('mm_wfl', '.claude/tools/workflow-local.py')


class MindmapTracksTests(unittest.TestCase):
    def test_policy_hash_remains_conserved(self):
        # Verify local workflow policy hash evaluates cleanly to 64-char hex without regression
        h = wfl.policy_hash(REPO)
        self.assertEqual(len(h), 64)

    def test_track_classification_covers_all_five_tracks(self):
        self.assertEqual(tracks.classify_action({'target': '/comparisons/landbot-alternatives'}), 'alternatives')
        self.assertEqual(tracks.classify_action({'target': '/comparisons/apollo-vs-clay'}), 'comparison')
        self.assertEqual(tracks.classify_action({'target': '/gear/best-mini-pcs-for-local-ai'}), 'roundup')
        self.assertEqual(tracks.classify_action({'target': '/guides/best-ai-email-tools'}), 'roundup')
        self.assertEqual(tracks.classify_action({'target': '/guides/deepseek-pricing'}), 'guide')
        self.assertEqual(
            tracks.classify_action({'target': '/guides/glm-5-4-explained'}, {'modelLaunch': {'level': 'mid'}}),
            'launch',
        )

    def test_tested_eligibility_mirrors_testedPage_ts(self):
        # Alternatives on B2B software is eligible
        el_ok = tracks.tested_eligibility(REPO, '/comparisons/landbot-alternatives', title='Landbot Alternatives: Pricing Compared')
        self.assertTrue(el_ok['eligible'], el_ok)
        # Guide non-roundup is excluded by guide type; comparison with pricing slug is excluded by pricing word
        el_gd = tracks.tested_eligibility(REPO, '/guides/deepseek-pricing', title='DeepSeek Pricing: Plans Compared')
        self.assertFalse(el_gd['eligible'])
        self.assertIn('guide is not', el_gd['exclusionReason'])
        el_pr = tracks.tested_eligibility(REPO, '/comparisons/deepseek-pricing', title='DeepSeek Pricing: Plans Compared')
        self.assertFalse(el_pr['eligible'])
        self.assertIn('pricing', el_pr['exclusionReason'])
        # Health/legal/money topics are excluded by Gate 2
        el_fin = tracks.tested_eligibility(REPO, '/comparisons/quickbooks-alternatives', title='QuickBooks Alternatives')
        self.assertFalse(el_fin['eligible'])
        self.assertIn('money', el_fin['exclusionReason'])
        # Industry verticals: general industry playbooks stay excluded; software roundups under /ai-for/ & /robotics/ qualify
        el_vert_play = tracks.tested_eligibility(REPO, '/ai-for/logistics', title='AI for Logistics & Supply Chain')
        self.assertFalse(el_vert_play['eligible'])
        el_vert_roundup = tracks.tested_eligibility(REPO, '/ai-for/best-ai-logistics-software', title='Best AI Logistics Software')
        self.assertTrue(el_vert_roundup['eligible'], el_vert_roundup)
        self.assertEqual(el_vert_roundup['section'], 'vertical')
        el_robo_roundup = tracks.tested_eligibility(REPO, '/robotics/best-warehouse-robots', title='Best Warehouse Robots')
        self.assertTrue(el_robo_roundup['eligible'], el_robo_roundup)
        el_roi = tracks.tested_eligibility(REPO, '/roi/ai-automation-roi-framework', title='AI Automation ROI Framework')
        self.assertFalse(el_roi['eligible'])

    def test_track_sliced_system_cuts_over_45_percent_and_isolates_tracks(self):
        bench = tracks.benchmark_tracks(REPO)
        self.assertGreater(bench['baselineSystemChars'], 180000)
        for key, st in bench['tracks'].items():
            self.assertGreater(st['savedPctVsBaseline'], 40.0, f'{key} saved too little: {st}')
        # Verify guide track omits COMPARISON and TESTED while alternatives includes its own contract only
        guide_sys, _ = tracks.compile_track_system(REPO, 'guide', include_tested=False)
        self.assertNotIn('## AUDITOR', guide_sys)
        self.assertNotIn('## PREFLIGHT', guide_sys)
        self.assertNotIn('## TESTED — first-hand format', guide_sys)
        self.assertNotIn('## COMPARISON', guide_sys)
        self.assertNotIn('Active Mindmap Format Track: `alternatives`', guide_sys)
        self.assertIn('Active Mindmap Format Track: `guide`', guide_sys)
        self.assertIn('Hyperlink the VERY FIRST mention', guide_sys)
        self.assertIn('structured `table` fields', guide_sys)

        alt_sys, _ = tracks.compile_track_system(REPO, 'alternatives', include_tested=False)
        self.assertIn('Active Mindmap Format Track: `alternatives`', alt_sys)
        self.assertNotIn('Active Mindmap Format Track: `launch`', alt_sys)
        self.assertIn('## COMPARISON', alt_sys)

    def test_minimal_phase_files_drops_unused_manuals(self):
        bench = tracks.benchmark_tracks(REPO)
        self.assertGreater(bench['workerWritePhaseManualsSavedPct'], 60.0)
        slim = tracks.minimal_phase_files(REPO, 'write', {'actions': [{'bucket': 'create new content'}]})
        self.assertEqual(
            slim,
            [
                '.claude/commands/mindmap-pass/phase-3-new-content.md',
                '.claude/commands/mindmap-pass/phase-7-sitemap-indexnow.md',
            ],
        )

    def test_scout_intake_and_proof_precheck_end_to_end(self):
        with tempfile.TemporaryDirectory(dir=str(REPO / 'reports')) as tmp:
            run_dir = Path(tmp) / 'scout-test'
            spec = {
                'track': 'alternatives',
                'jobId': 'test-alt-intake-1',
                'candidates': [
                    {
                        'target': '/comparisons/testbot-alternatives',
                        'subject': 'TestBot',
                        'officialUrl': 'https://testbot.example/pricing',
                        'officialHosts': ['testbot.example'],
                        'primaryKeyword': 'testbot alternatives',
                        'title': 'TestBot Alternatives 2026: Pricing and Limits Compared',
                        'readerQuestion': 'What should I use instead of TestBot when monthly AI chat caps drive up costs?',
                        'workingAnswer': 'Switch to ReplyFlow ($39/month for 2,000 chats) for high-volume web forms, or HelpDeskLite ($33/month) when you need live human ticketing; stay on TestBot Free ($0 under 100 chats) for low-traffic prototypes.',
                        'counterexample': 'Below 100 chats per month, TestBot Free ($0/month) beats every paid alternative ($18 to $39/month). Above 500 chats with WhatsApp enabled, TestBot ($188/month with $100 add-on) costs 4.8x ReplyFlow ($39/month).',
                        'scenarios': [
                            {'name': 'Solo prototype (80 chats/mo)', 'seats': 1, 'monthlyVolume': 80, 'requiresAddon': False},
                            {'name': 'SMB lead capture (1,500 chats/mo)', 'seats': 3, 'monthlyVolume': 1500, 'requiresAddon': False},
                            {'name': 'WhatsApp support pod (2,500 chats/mo)', 'seats': 5, 'monthlyVolume': 2500, 'requiresAddon': True},
                        ],
                        'vendors': [
                            {'name': 'TestBot', 'planName': 'Pro', 'baseMonthlyUsd': 88, 'includedVolume': 2500, 'requiredAddonMonthlyUsd': 100},
                            {'name': 'ReplyFlow', 'planName': 'Starter', 'baseMonthlyUsd': 39, 'includedVolume': 2000, 'overageUnitSize': 1000, 'overageUsdPerUnit': 10},
                            {'name': 'HelpDeskLite', 'planName': 'Growth', 'baseMonthlyUsd': 63, 'includedVolume': 5000},
                        ],
                    }
                ],
            }
            spec_file = Path(tmp) / 'spec.json'
            spec_file.write_text(json.dumps(spec))
            intake_res = tracks.intake_scout_spec(REPO, spec_file, run_dir)
            self.assertEqual(intake_res['status'], 'PASS')

            # Prepare write packets and confirm subject-only allowed URLs + model output injection
            pkt_res = gates.prepare_write_packets(
                REPO,
                manifest_path=intake_res['manifest'],
                out_dir=str((run_dir / 'prompts').relative_to(REPO)),
                evidence_dir=str((run_dir / 'evidence').relative_to(REPO)),
            )
            self.assertEqual(pkt_res['track'], 'alternatives')
            allowed_txt = (run_dir / 'prompts/testbot-alternatives.allowed-urls.txt').read_text()
            self.assertIn('https://testbot.example/pricing', allowed_txt)
            prompt_txt = (run_dir / 'prompts/testbot-alternatives.prompt.md').read_text()
            self.assertIn('Executed Scenario Model Output', prompt_txt)
            self.assertIn('Matched First-Party Layer3 Experience Records', prompt_txt)

            # Verify generic proof-free draft FAILS precheck_drafts when mindmapTrack is active!
            drafts_dir = run_dir / 'drafts'
            drafts_dir.mkdir()
            filler = ' '.join(['substantive'] * 1000)
            bad_draft = {
                'slug': 'testbot-alternatives',
                'metaTitle': 'TestBot Alternatives',
                'h1': 'TestBot Alternatives',
                'comparisonTable': [{'dimension': 'Price', 'optionA': '$88', 'optionB': '$39'}],
                'sections': [{'id': 's1', 'heading': 'Overview', 'content': [filler + ' [Comp](https://rogue-competitor.example/pricing)']}],
                'verdict': ['Short generic verdict.'],
            }
            (drafts_dir / 'testbot-alternatives.json').write_text(json.dumps(bad_draft))
            (drafts_dir / 'testbot-alternatives.json.meta.json').write_text(json.dumps({'provider': 'google', 'model': 'gemini-3.8-flash'}))
            bad_check = gates.precheck_drafts(
                REPO,
                intake_res['manifest'],
                str(drafts_dir.relative_to(REPO)),
                prompts_dir=str((run_dir / 'prompts').relative_to(REPO)),
                evidence_dir=str((run_dir / 'evidence').relative_to(REPO)),
            )
            self.assertEqual(bad_check['status'], 'FAIL')
            issue_kinds = {i['kind'] for i in bad_check['issues']}
            self.assertIn('missing-scenario-table', issue_kinds)
            self.assertIn('missing-counterexample', issue_kinds)
            self.assertIn('missing-source-note', issue_kinds)
            self.assertIn('forbidden-competitor-outbound-link', issue_kinds)

    def test_normalize_comparison_draft_and_client_experience_match(self):
        raw = {
            'slug': 'landbot-alternatives',
            'metaTitle': 'Landbot Alternatives 2026: Pricing & Switching Math',
            'h1': 'Landbot Alternatives 2026: Pricing & Switching Math',
            'optionAName': 'Landbot',
            'optionBName': 'Alternatives',
            'tableColumnLabels': ['A', 'B', 'C', 'D'],
            'comparisonTable': [{'dimension': f'V{i}', 'optionA': '$88', 'optionB': '$39'} for i in range(5)],
            'sections': [
                {
                    'title': 'Best Landbot Alternatives',
                    'content': 'Intro paragraph.\n\n| Scenario | Landbot | Typebot |\n| :--- | :--- | :--- |\n| 2k chats | $88 | $39 |\n\n### Break-Even\n\nCounterexample: below 100 chats Landbot Free wins.',
                }
            ],
            'verdict': [' '.join(['actionable'] * 45)],
            'ctaButton': {'label': 'Book an Assessment', 'href': '/contact'},
            'relatedLinks': [{'title': 'AI Pricing', 'description': 'Compare.', 'href': '/ai-model-pricing'}],
            'attributionMode': 'Layer3Labs Research',
            'faqSchemaPlainText': 'Q: ...',
            'sourceNote': 'Verified vendor docs.',
        }
        norm = tracks.normalize_comparison_draft(raw)
        self.assertEqual(norm['sections'][0]['heading'], 'Best Landbot Alternatives')
        self.assertIsInstance(norm['sections'][0]['content'], list)
        self.assertEqual(norm['ctaButton'], 'Book an Assessment')
        self.assertEqual(len(norm['tableColumnLabels']), 3)
        self.assertEqual(norm['attributionMode'], 'author')
        self.assertIs(norm['faqSchemaPlainText'], True)
        self.assertEqual(norm['relatedLinks'][0]['category'], 'Guide')
        issues = tracks.validate_track_draft(
            norm,
            track='alternatives',
            evidence_obj={'basis': 'modeled'},
            is_registered_alternatives=True,
            subject_official_hosts=['landbot.io'],
        )
        self.assertEqual(issues, [])
        exp = tracks.match_experience_records(REPO, 'What should I use instead of Landbot when chat caps or WhatsApp add-ons push up my bill?')
        self.assertTrue(any(r['relationship'] == 'Client projects' for r in exp))
        self.assertFalse(any(r['id'] in ('fleet-psychedelic', 'fleet-space') for r in exp))


if __name__ == '__main__':
    unittest.main()
