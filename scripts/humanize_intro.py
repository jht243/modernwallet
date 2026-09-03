#!/usr/bin/env python3
"""
humanize_intro.py — PORTABLE, store-agnostic intro re-voicer (fleet-wide).

Text in, humanised text out. One call to GPT-5.6 Sol with one fixed prompt and NO ban
list. It does not know or care how this repo stores content — the routine that calls it
reads the new page's intro paragraphs from its own store (TS data file, Astro/markdown
frontmatter, DB row, whatever), pipes them in here, and writes the result back.

  PROMPT: make this sound more human. you can change structure, rhythm, tone,
          but do not add any new facts

USAGE
  printf '%s' "$intro" | python3 scripts/humanize_intro.py        # stdin -> stdout
  python3 scripts/humanize_intro.py --file intro.txt              # file  -> stdout
Paragraphs are separated by blank lines, in and out. If OPENAI_API_KEY is not set, or the
API errors, it prints the input UNCHANGED and exits 0 — this step must never break a run.

Key: OPENAI_API_KEY from env, .env, or ~/.claude/secrets.env. Model override: HUMANIZE_MODEL.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
from pathlib import Path

PROMPT = "make this sound more human. you can change structure, rhythm, tone, but do not add any new facts"
MODEL = os.environ.get("HUMANIZE_MODEL", "gpt-5.6-sol")


def _load_env(p: Path) -> None:
    if not p.exists():
        return
    for ln in p.read_text(errors="ignore").splitlines():
        ln = ln.strip()
        if ln and not ln.startswith("#") and "=" in ln:
            k, v = ln.split("=", 1)
            os.environ.setdefault(k.strip().removeprefix("export ").strip(), v.strip().strip('"').strip("'"))


def humanize(text: str) -> str:
    """Return the re-voiced text, or the original unchanged on any failure."""
    text = text.strip()
    if not text:
        return text
    for base in (".env", os.path.expanduser("~/.claude/secrets.env")):
        _load_env(Path(base))
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return text
    body = {"model": MODEL, "messages": [{"role": "user", "content": f"{PROMPT}\n\n{text}"}]}
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions", data=json.dumps(body).encode(), method="POST",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            out = json.loads(r.read())["choices"][0]["message"]["content"].strip()
    except Exception:
        return text
    # Guard: paragraph count must match, or we return the original untouched.
    def _paras(s: str) -> list[str]:
        import re
        return [p.strip() for p in re.split(r"\n\s*\n", s.strip()) if p.strip()]
    return out if len(_paras(out)) == len(_paras(text)) else text


def main() -> int:
    args = sys.argv[1:]
    if args and args[0] == "--file":
        text = Path(args[1]).read_text()
    else:
        text = sys.stdin.read()
    sys.stdout.write(humanize(text))
    return 0


if __name__ == "__main__":
    sys.exit(main())
