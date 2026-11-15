#!/usr/bin/env python3
"""Unit tests for GSC SA pure-stdlib PEM validation, multi-source fallback, and exit 4 on corrupt keys."""
import base64
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest import mock

MOD_PATH = Path(__file__).with_name("gsc_search_analytics.py")
spec = importlib.util.spec_from_file_location("gsc_sa_mod", MOD_PATH)
gsc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gsc)


def _make_valid_shaped_pem() -> str:
    body = b"\x02\x01\x00" + (b"\x04\x82\x02\x40" + b"A" * 0x240)
    length = len(body)
    der = bytes([0x30, 0x82, (length >> 8) & 0xFF, length & 0xFF]) + body
    b64 = base64.b64encode(der).decode("ascii")
    lines = [b64[i : i + 64] for i in range(0, len(b64), 64)]
    return "-----BEGIN PRIVATE KEY-----\n" + "\n".join(lines) + "\n-----END PRIVATE KEY-----\n"


def _make_truncated_pem() -> str:
    valid = _make_valid_shaped_pem().splitlines()
    # Drop middle base64 lines so DER outer SEQUENCE length > actual bytes (ASN.1 short data)
    truncated_lines = [valid[0], *valid[1:6], valid[-1]]
    return "\n".join(truncated_lines) + "\n"


class GscCredentialValidationTest(unittest.TestCase):
    def test_valid_pem_passes_and_truncated_pem_fails(self):
        ok, reason = gsc._validate_sa_dict({"client_email": "bot@proj.iam.gserviceaccount.com", "private_key": _make_valid_shaped_pem()})
        self.assertTrue(ok, reason)

        bad_ok, bad_reason = gsc._validate_sa_dict({"client_email": "bot@proj.iam.gserviceaccount.com", "private_key": _make_truncated_pem()})
        self.assertFalse(bad_ok)
        self.assertIn("truncated", bad_reason)

    def test_truncated_env_key_falls_back_to_valid_secrets_env(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / ".claude").mkdir()
            valid_json = json.dumps({"client_email": "backup@proj.iam.gserviceaccount.com", "private_key": _make_valid_shaped_pem()})
            (root / ".claude/secrets.env").write_text(f"GOOGLE_REPORTING_SA_JSON='{valid_json}'\n")
            corrupt_json = json.dumps({"client_email": "broken@proj.iam.gserviceaccount.com", "private_key": _make_truncated_pem()})

            with mock.patch.dict(os.environ, {"GOOGLE_REPORTING_SA_JSON": corrupt_json, "GOOGLE_REPORTING_SA_FILE": "", "GSC_SA_FILE": ""}, clear=False):
                info, label = gsc.resolve_sa_info(None, repo_root=root)
            self.assertEqual(info["client_email"], "backup@proj.iam.gserviceaccount.com")
            self.assertIn("secrets.env", label)

    def test_all_corrupt_keys_exit_4_no_retry(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            corrupt_json = json.dumps({"client_email": "broken@proj.iam.gserviceaccount.com", "private_key": _make_truncated_pem()})
            with mock.patch.dict(os.environ, {"GOOGLE_REPORTING_SA_JSON": corrupt_json, "GOOGLE_REPORTING_SA_FILE": "", "GSC_SA_FILE": ""}, clear=False):
                with mock.patch.object(gsc.os.path, "expanduser", return_value=str(root / "nonexistent.json")):
                    with mock.patch.object(gsc.Path, "home", return_value=root):
                        with self.assertRaises(SystemExit) as ctx:
                            gsc.resolve_sa_info(None, repo_root=root)
            self.assertEqual(ctx.exception.code, 4)


if __name__ == "__main__":
    unittest.main()
