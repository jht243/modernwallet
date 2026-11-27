#!/usr/bin/env python3
"""Unit tests for internal-proof-monitor.py 5-signal quality scoring, guardrails, and carryover."""
import base64
import importlib.util
import json
from pathlib import Path
import subprocess
import unittest
from unittest import mock

MOD_PATH = Path(__file__).with_name("internal-proof-monitor.py")
spec = importlib.util.spec_from_file_location("ipm_mod", MOD_PATH)
ipm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ipm)


class InternalProofMonitorTest(unittest.TestCase):
    def setUp(self):
        ipm._REPO_FILE_CACHE.clear()
        ipm._REPO_RN_CACHE.clear()

    def test_guardrail_1_never_touches_excluded_client_repos(self):
        repos = [r for r, _ in ipm._discover_fleet_repos()]
        self.assertEqual(len(repos), 35)
        for excluded in (
            "barrycosta/git-darklight",
            "GetOPTHealth/opt-health",
            "HarmonicaAya/harmonica-ayahuasca-preview",
            "jht243/Spin",
        ):
            self.assertNotIn(excluded, repos)
            self.assertEqual(ipm._scan_repo_window((excluded, "main"), "2026-11-25T00:00:00Z"), [])

    def test_excludes_non_article_ia_and_nav_data_files(self):
        for non_article in (
            "data/ia.json",
            "src/data/ia.json",
            "data/related.json",
            "data/related-overrides.json",
            "data/navigation.json",
            "data/nav.ts",
            "data/categories.json",
            "data/tested-methods.json",
            "data/alternatives-pages.json",
        ):
            self.assertIsNone(ipm.CONTENT_PATH_RE.match(non_article), f"should exclude {non_article}")

        for real_article_store in (
            "src/data/air.json",
            "src/data/humidity.json",
            "data/alternatives/vanguard.json",
            "src/content/guides/clickpay-alternatives.md",
            "src/content/people/jared-isaacman.md",
        ):
            self.assertIsNotNone(ipm.CONTENT_PATH_RE.match(real_article_store), f"should match {real_article_store}")

    def test_signal_1_closes_generic_tagline_loophole(self):
        boilerplate_only = (
            "# What Is Agentic Commerce?\n\n"
            "Agentic commerce allows AI shopping assistants to browse catalogs and place orders. "
            "At Layer3Labs, we build and run AI systems inside other people's businesses. "
            "In our review of the primary program documents, checked November 25, 2026, we compared "
            "merchant fees and terms across OpenAI and Google documentation. We read the documentation "
            "carefully and found that Google's checkout fee is not published on the pages we reviewed."
        )
        has_proof, types, had_tagline = ipm._has_substantive_internal_proof(boilerplate_only)
        self.assertFalse(has_proof)
        self.assertEqual(types, [])
        self.assertTrue(had_tagline)

        ev = {
            "route": "/guides/what-is-agentic-commerce",
            "routine": "mindmap-pass",
            "usedInternalProof": True,
            "proofTypesUsed": ["client_and_operator_experience"],
            "legitimateExemption": False,
        }
        with mock.patch.object(ipm, "_get_repo_reviewer_notes", return_value=(True, {})):
            scored = ipm.evaluate_page_quality(ev, "jht243/layer3labs", page_text=boilerplate_only)
        self.assertFalse(scored["usedInternalProof"])
        self.assertEqual(scored["qualityTier"], "empty")
        self.assertIn("tagline-only proof", scored["qualityFlags"])

    def test_signal_2_3_4_5_strong_vs_thin_grading(self):
        # Strong page: P1 numeric hook, top-half 150w+ 3-scenario modeling table, counterexample,
        # wired strong Publisher's Take with post-month-1 friction & walk-away, and matching calculator callout
        strong_text = (
            "# Compound Interest Formula in Excel and Google Sheets\n\n"
            "Entering `=10000*(1+0.05/12)^(12*10)` in Excel or Google Sheets grows a $10,000 balance at 5% "
            "annual interest compounded monthly to $16,470.09 over 10 years, outperforming annual compounding "
            "by $181.14. Run your own deposit schedule instantly in our [compound interest calculator](/investing/compound-interest-calculator/).\n\n"
            "## Worked Cost & Compounding Scenario Breakdown\n\n"
            "In our internal modeling across three standardized 10-year compounding scenarios on a $10,000 balance "
            "at a 5% nominal rate, we compared annual, monthly, and daily frequency schedules alongside a $200 "
            "monthly contribution plan to isolate where compounding frequency and contribution timing shift final wealth. "
            "Across our 10-year verification loop, shifting from annual to monthly compounding adds $181.14 on a static "
            "$10,000 principal, whereas adding $200 per month lifts the ending balance to $47,526.64. We verified every "
            "cell output against both the closed-form algebraic power formula and the `=FV(rate, nper, pmt, pv, type)` "
            "function across 120 monthly rows so your spreadsheet matches bank statements to the cent.\n\n"
            "| Scenario | Compounding | Monthly Contribution | 10-Year Ending Balance | Gain vs Annual |\n"
            "| --- | --- | --- | --- | --- |\n"
            "| Scenario 1: Static Principal | Annual (1x/yr) | $0 | $16,288.95 | Baseline |\n"
            "| Scenario 2: Static Principal | Monthly (12x/yr) | $0 | $16,470.09 | +$181.14 |\n"
            "| Scenario 3: Active Saver | Monthly (12x/yr) | $200 | $47,526.64 | +$31,237.69 |\n\n"
            "## What Would Change Our Answer (Counterexample)\n\n"
            "This recommendation flips if you model irregular cash flows with variable contribution dates: "
            "the standard `=FV()` function breaks down when deposits arrive on non-uniform dates, where you "
            "should walk away from `=FV()` and use `=XNPV()` or an explicit row-by-row schedule instead.\n"
        )
        strong_notes = {
            "/guides/compound-interest-formula-excel-google-sheets": (
                "Spreadsheet models fail in month two when users forget to divide the annual rate by 12 inside FV(), "
                "inflating projected wealth tenfold. Walk away from a single-cell FV formula if your contributions vary "
                "by month, and use an explicit row schedule before committing retirement cash."
            )
        }
        ev_strong = {
            "route": "/guides/compound-interest-formula-excel-google-sheets",
            "routine": "mindmap-pass",
            "usedInternalProof": True,
            "legitimateExemption": False,
        }
        with mock.patch.object(ipm, "_get_repo_reviewer_notes", return_value=(True, strong_notes)):
            scored_strong = ipm.evaluate_page_quality(ev_strong, "jht243/modernwallet", page_text=strong_text)
        self.assertEqual(scored_strong["qualityTier"], "strong")
        self.assertEqual(scored_strong["qualityFlags"], [])
        self.assertGreaterEqual(scored_strong["qualitySignals"]["qualityScorePct"], 90)

        # Thin page: proof buried in bottom 25%, shallow <150w analysis, no multi-scenario table,
        # unwired backend reviewerNote, and missed matching calculator
        filler_intro = (
            "# How to Track Space Debris\n\n"
            "Space debris tracking relies on optical telescopes and phased-array radar installations operated by "
            "government agencies around the globe.\n\n"
        )
        filler_middle = ("## Background on Orbital Catalogs\n\n" + ("Radar networks monitor orbital shells continuously. " * 45) + "\n\n") * 3
        buried_short_proof = (
            "## Operator Takeaway\n\n"
            '{"reviewerNote": {"label": "Publisher\'s Take", "note": "Unwired backend note."}}\n'
            "In our internal scenario modeling of catalog screening, scaling from 1 satellite to 24 satellites "
            "multiplies daily conjunction triage 24-fold, which is the break-even threshold for API automation."
        )
        thin_text = filler_intro + filler_middle + buried_short_proof
        ev_thin = {
            "route": "/technology/how-to-track-space-debris",
            "routine": "podcast-pain-pass",
            "usedInternalProof": True,
            "legitimateExemption": False,
        }
        with mock.patch.object(ipm, "_get_repo_reviewer_notes", return_value=(True, {})):
            scored_thin = ipm.evaluate_page_quality(ev_thin, "jht243/orbitalintel", page_text=thin_text)
        self.assertEqual(scored_thin["qualityTier"], "thin")
        self.assertIn("shallow original analysis (<150w)", scored_thin["qualityFlags"])
        self.assertIn("missing multi-scenario breakdown", scored_thin["qualityFlags"])
        self.assertIn("missing Paragraph 1 numeric hook", scored_thin["qualityFlags"])
        self.assertIn("proof buried in bottom 25%", scored_thin["qualityFlags"])
        self.assertIn("Publisher's Take unwired in backend data", scored_thin["qualityFlags"])
        self.assertIn("missed matching calculator", scored_thin["qualityFlags"])

    def test_signal_1_survey_sample_size_threshold_and_generic_publishers_take(self):
        small_survey = "In our reader survey (N=12 respondents), most users preferred annual billing."
        has_p_small, _, _ = ipm._has_substantive_internal_proof(small_survey)
        self.assertFalse(has_p_small)

        valid_survey = "In our reader survey (N=42 respondents), 68% hit credit caps within two weeks."
        has_p_valid, types_valid, _ = ipm._has_substantive_internal_proof(valid_survey)
        self.assertTrue(has_p_valid)
        self.assertIn("proprietary_reader_survey_or_tool_data", types_valid)

        weak_notes = {
            "/guides/wix-ai-website-builder": (
                "Wix's AI builder is easiest to judge by what Wix itself states: free to start, "
                "with a Premium plan for a custom domain and payments. Check the plan amounts for your location before you build."
            )
        }
        ev_weak_note = {
            "route": "/guides/wix-ai-website-builder",
            "routine": "mindmap-pass",
            "usedInternalProof": True,
            "legitimateExemption": False,
        }
        with mock.patch.object(ipm, "_get_repo_reviewer_notes", return_value=(True, weak_notes)):
            scored = ipm.evaluate_page_quality(ev_weak_note, "jht243/layer3labs", page_text=valid_survey)
        self.assertIn("generic Publisher's Take", scored["qualityFlags"])
        self.assertEqual(scored["qualitySignals"]["signal4_publishersTake"]["status"], "generic")

    def test_same_day_followup_edit_carries_over_initial_proof_and_biography_exempt(self):
        commits = [
            {
                "sha": "3ed8a078821a4db5907b46ec8ae3accc6abd8e77",
                "commit": {
                    "message": "Publish ClickPay alternatives page (audit findings fixed)",
                    "committer": {"date": "2026-11-25T15:20:50Z"},
                },
            },
            {
                "sha": "4bcb67792896998f563e0d71fbceecfe4149e73e",
                "commit": {
                    "message": "WIP alternatives 2026-11-25: ClickPay draft",
                    "committer": {"date": "2026-11-25T15:19:08Z"},
                },
            },
            {
                "sha": "ff9563b1e551020a426bcbe8946b459db23d0e8a",
                "commit": {
                    "message": "People radar: 1 updated",
                    "committer": {"date": "2026-11-25T13:11:58Z"},
                },
            },
        ]

        details = {
            "4bcb67792896998f563e0d71fbceecfe4149e73e": {
                "files": [{
                    "filename": "src/content/guides/clickpay-alternatives.md",
                    "status": "added",
                    "patch": "+" + ("PayHOA vs Buildium Worked Cost Example. Break-even: 1,644 transfers. " * 6),
                }],
            },
            "3ed8a078821a4db5907b46ec8ae3accc6abd8e77": {
                "files": [{
                    "filename": "src/content/guides/clickpay-alternatives.md",
                    "status": "modified",
                    "patch": "+" + ("Minor audit wording adjustment around Buildium starting prices without touching table. " * 5),
                }],
            },
            "ff9563b1e551020a426bcbe8946b459db23d0e8a": {
                "files": [{
                    "filename": "src/content/people/jared-isaacman.md",
                    "status": "modified",
                    "patch": "+" + ("Jared Isaacman attended a NASA ceremony at Johnson Space Center in August 2026. " * 5),
                }],
            },
        }

        def fake_run(cmd, capture_output=True, text=True):
            target = cmd[2]
            if "mindmap-gates.py" in target:
                return subprocess.CompletedProcess(cmd, 0, stdout="abc123\n", stderr="")
            if "internal-proof-log.jsonl" in target:
                return subprocess.CompletedProcess(cmd, 1, stdout="", stderr="404")
            if "/commits?" in target:
                return subprocess.CompletedProcess(cmd, 0, stdout=json.dumps(commits), stderr="")
            for sha, payload in details.items():
                if target.endswith(f"/commits/{sha}"):
                    return subprocess.CompletedProcess(cmd, 0, stdout=json.dumps(payload), stderr="")
            if "contents/src/content/guides/clickpay-alternatives.md" in target:
                raw = base64.b64encode(b"## Worked Cost Example\nBreak-even: 1,644 transfers.").decode()
                return subprocess.CompletedProcess(cmd, 0, stdout=raw, stderr="")
            return subprocess.CompletedProcess(cmd, 1, stdout="", stderr="not found")

        with mock.patch.object(ipm.subprocess, "run", side_effect=fake_run):
            events = ipm._scan_repo_window(("jht243/thehoaguide", "main"), "2026-11-25T10:00:00Z")

        by_route = {e["route"]: e for e in events}
        self.assertIn("/clickpay-alternatives", by_route)
        self.assertTrue(by_route["/clickpay-alternatives"]["usedInternalProof"])
        self.assertIn(by_route["/clickpay-alternatives"]["qualityTier"], ("strong", "thin"))
        self.assertIn("/jared-isaacman", by_route)
        self.assertTrue(by_route["/jared-isaacman"]["legitimateExemption"])
        self.assertEqual(by_route["/jared-isaacman"]["qualityTier"], "exempt")
        actionable = [e for e in events if not e["usedInternalProof"] and not e["legitimateExemption"]]
        self.assertEqual(actionable, [])


if __name__ == "__main__":
    unittest.main()
