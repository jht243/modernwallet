"""Site config + backend loader. Every site-specific value lives in scripts/rank_drop/site.json."""

from __future__ import annotations

import importlib
import json
import os
import sys
from functools import lru_cache
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


@lru_cache(maxsize=1)
def site() -> dict:
    f = HERE / "site.json"
    if not f.exists():
        raise SystemExit("scripts/rank_drop/site.json missing — every site needs one (see backends/base.py)")
    cfg = json.load(open(f))
    cfg.setdefault("gsc_property", "sc-domain:" + cfg["base_url"].split("//", 1)[1].removeprefix("www."))
    return cfg


@lru_cache(maxsize=1)
def backend():
    cfg = site()
    mod = importlib.import_module(f"backends.{cfg['backend']}")
    return mod.BACKEND(ROOT, cfg)


def url(path: str) -> str:
    return site()["base_url"].rstrip("/") + path


# ── engine — the same pipeline serves more than one routine ─────────────────
# rank-drop-recovery (default) and page-1-2-no-clicks-pass share every script from the splice on
# (apply_sections → lint → audit → apply_fixes → rework → finish_run → email). The engine decides the
# commit-subject prefix runlog matches, the reports dir (ledger) and the task files. It is read from
# RD_ENGINE, else inferred from a packets path on the command line, else rank-drop-recovery.
ENGINES = {
    "rank-drop-recovery": {"reports": "reports/rank-drop", "tasks": "scripts/rank_drop"},
    "page-1-2-no-clicks-pass": {"reports": "reports/page-1-2-no-clicks", "tasks": "scripts/page12"},
}


def engine() -> str:
    e = os.environ.get("RD_ENGINE", "").strip()
    if e in ENGINES:
        return e
    if any("page-1-2-no-clicks" in a for a in sys.argv[1:]):
        return "page-1-2-no-clicks-pass"
    return "rank-drop-recovery"


def reports_dir() -> str:
    return ENGINES[engine()]["reports"]
