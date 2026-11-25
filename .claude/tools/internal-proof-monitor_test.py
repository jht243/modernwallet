#!/usr/bin/env python3
"""Unit tests for internal-proof-monitor.py non-article exclusions and same-day receipt carryover."""
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
            "src/content/guides/clickpay-alternatives.md",
            "src/content/people/jared-isaacman.md",
        ):
            self.assertIsNotNone(ipm.CONTENT_PATH_RE.match(real_article_store), f"should match {real_article_store}")

    def test_same_day_followup_edit_carries_over_initial_proof_and_biography_exempt(self):
        commits = [
            # Newest first, just like GitHub API
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
        self.assertIn("/jared-isaacman", by_route)
        self.assertTrue(by_route["/jared-isaacman"]["legitimateExemption"])
        actionable = [e for e in events if not e["usedInternalProof"] and not e["legitimateExemption"]]
        self.assertEqual(actionable, [])


if __name__ == "__main__":
    unittest.main()
