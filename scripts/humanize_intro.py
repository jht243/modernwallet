#!/usr/bin/env python3
"""
humanize_intro.py — PORTABLE, store-agnostic intro re-voicer (fleet-wide).

Text in, humanised text out. One call to GPT-5.6 Sol with one fixed prompt and NO ban
list. It does not know or care how this repo stores content — the routine that calls it
reads the new page's intro paragraphs from its own store (TS data file, Astro/markdown
frontmatter, DB row, whatever), pipes them in here, and writes the result back.

  PROMPT: make this sound more human. you can change structure, rhythm, tone,
          but do not add any new facts

WHAT IT PROTECTS (learned from the 2026-09-03 layer3 run of 467 pages):
  * Bylines and disclosures are never sent to the model. A reviewer line ("Reviewed by…")
    or an affiliate/FTC disclosure is attribution and legal copy, not voice. They are held
    back, then restored in their original positions.
  * Facts must survive. Every number and every markdown link in the input must appear in
    the output, or the rewrite is dropped and the original returned. This caught a page
    where the model silently reformatted a release date away.
  * House style is applied after the model: em/en dashes become commas and curly quotes
    become ASCII, because the model emits both and the anti-ai standard bans them. A dash
    BETWEEN NUMBERS becomes "to", never a comma — "$20-30" must not turn into "$20, 30".
  * The paragraph count may change. The model often splits a long paragraph, which is
    fine and usually better; an earlier strict count check silently rejected ~25% of pages.

USAGE
  printf '%s' "$intro" | python3 scripts/humanize_intro.py        # stdin -> stdout
  python3 scripts/humanize_intro.py --file intro.txt              # file  -> stdout
Paragraphs are separated by blank lines, in and out. If OPENAI_API_KEY is not set, or the
API errors, it prints the input UNCHANGED and exits 0 — this step must never break a run.
Pass --verbose to send a one-line reason to stderr when the input is returned unchanged.

Key: OPENAI_API_KEY from env, .env, or ~/.claude/secrets.env. Model override: HUMANIZE_MODEL.
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
from pathlib import Path

PROMPT = "make this sound more human. you can change structure, rhythm, tone, but do not add any new facts"
MODEL = os.environ.get("HUMANIZE_MODEL", "gpt-5.6-sol")

# Attribution / legal copy: never sent to the model, restored in place afterwards.
PROTECTED = re.compile(
    r"^\s*(Reviewed by|Last (updated|reviewed))\b"
    r"|referral commission|affiliate (link|commission|disclosure)"
    r"|may earn a commission|at no (extra|additional) cost",
    re.I,
)
_NUM = re.compile(r"\d[\d,]*(?:\.\d+)?")
_LINK = re.compile(r"\]\(([^)]+)\)")


def _load_env(p: Path) -> None:
    if not p.exists():
        return
    for ln in p.read_text(errors="ignore").splitlines():
        ln = ln.strip()
        if ln and not ln.startswith("#") and "=" in ln:
            k, v = ln.split("=", 1)
            os.environ.setdefault(k.strip().removeprefix("export ").strip(), v.strip().strip('"').strip("'"))


def _paras(s: str) -> list[str]:
    return [p.strip() for p in re.split(r"\n\s*\n", s.strip()) if p.strip()]


def _house_style(s: str) -> str:
    """Fold the model's typography into house style. Ranges keep their meaning."""
    s = (s.replace("’", "'").replace("‘", "'")
           .replace("“", '"').replace("”", '"').replace("…", "..."))
    # A dash between numbers is a RANGE -> "to". Handles "$20–$30", "20–30", "25–45%".
    s = re.sub(r"(\d%?)\s*[–—]\s*([$£€]?\d)", r"\1 to \2", s)
    s = re.sub(r"\s*[–—]\s*", ", ", s)                   # remaining dashes -> comma
    s = re.sub(r",\s*,", ",", s)
    s = re.sub(r"\s+,", ",", s)
    s = re.sub(r",\s*\.", ".", s)
    return re.sub(r"[ \t]{2,}", " ", s).strip()


def _facts_lost(before: str, after: str) -> list[str]:
    """Numbers and links that the rewrite dropped. Comma-formatting differences ignored."""
    a_plain = after.replace(",", "")
    lost = [n for n in set(_NUM.findall(before))
            if n not in after and n.replace(",", "") not in a_plain]
    lost += [u for u in set(_LINK.findall(before)) if u not in after]
    return lost


def humanize(text: str, verbose: bool = False) -> str:
    """Return the re-voiced text, or the original unchanged on any failure."""
    def bail(why: str) -> str:
        if verbose:
            print(f"humanize_intro: unchanged ({why})", file=sys.stderr)
        return text

    text = text.strip()
    if not text:
        return text
    for base in (".env", os.path.expanduser("~/.claude/secrets.env")):
        _load_env(Path(base))
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return bail("OPENAI_API_KEY not set")

    paras = _paras(text)
    keep = {i: p for i, p in enumerate(paras) if PROTECTED.search(p)}
    editable = [p for i, p in enumerate(paras) if i not in keep]
    if not editable:
        return bail("nothing but protected paragraphs")

    body = {"model": MODEL,
            "messages": [{"role": "user", "content": f"{PROMPT}\n\n" + "\n\n".join(editable)}]}
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions", data=json.dumps(body).encode(), method="POST",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            out = json.loads(r.read())["choices"][0]["message"]["content"].strip()
    except Exception as e:  # noqa: BLE001 - this step must never break a run
        return bail(f"api error: {type(e).__name__}")

    new = [_house_style(p) for p in _paras(out)]
    if not new:
        return bail("empty response")

    lost = _facts_lost(" ".join(editable), " ".join(new))
    if lost:
        return bail(f"fact loss: {lost[:3]}")

    # Restore protected paragraphs: those before the body stay first, the rest go after.
    head = [p for i, p in keep.items() if i < min((i for i in range(len(paras)) if i not in keep), default=0)]
    tail = [p for i, p in keep.items() if p not in head]
    return "\n\n".join(head + new + tail)


def main() -> int:
    args = [a for a in sys.argv[1:]]
    verbose = "--verbose" in args
    args = [a for a in args if a != "--verbose"]
    text = Path(args[1]).read_text() if args[:1] == ["--file"] else sys.stdin.read()
    sys.stdout.write(humanize(text, verbose=verbose))
    return 0


if __name__ == "__main__":
    sys.exit(main())
