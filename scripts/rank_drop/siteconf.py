"""Site config + backend loader. Every site-specific value lives in scripts/rank_drop/site.json."""

from __future__ import annotations

import importlib
import json
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
