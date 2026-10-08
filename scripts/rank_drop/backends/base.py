"""The one place the rank-drop engine touches a site's page storage.

Every site stores pages differently (layer3: TS object literals; modernwallet: TS with other field
names; metabolic_journal: Python dicts; mindmedicinelaw: Jinja templates + Python catalogs;
rankandpay: Postgres rows). The engine never reads or writes storage itself: it calls a Backend
named in scripts/rank_drop/site.json. A backend MUST implement every method below, keep edits
surgical (never reformat a file), and make every text replacement match EXACTLY ONCE.

Edit operations (`ops`, applied in order, all-or-nothing per call):
  {"op": "meta", "title": str|None, "description": str|None}
        search title + meta description; a field the page cannot carry is skipped (reported in notes)
  {"op": "insert_section", "heading": str, "paragraphs": [str], "before": str|None, "section_id": str|None}
        add a section before the section whose id/heading == before (else at the end); paragraphs
        are markdown text with [anchor](/path) links — the backend converts to its native format
  {"op": "replace_section", "heading": str, "paragraphs": [str], "match": str}
        Rung 2: replace the body (and heading) of the section whose id/heading == match
  {"op": "replace", "old": str, "new": str}
        exact sentence edit (fact fix / audit fix); `old` is the text as a reader sees it
  {"op": "rewrite", "fields": dict}           (optional; L5 full rewrite — may raise Unsupported)
A successful apply() bumps the page's visible "updated" date to `today` ONLY when substantive(ops).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


def substantive(ops: list[dict]) -> bool:
    """Google: change a page's visible date only when its content changed meaningfully. A new or
    replaced section, a rewrite, or a fact correction (replace op flagged `substantive`) qualifies;
    a title/description edit or a wording fix does not (2026-10-07 owner rule)."""
    return any(o["op"] in ("insert_section", "replace_section", "rewrite") or
               (o["op"] == "replace" and o.get("substantive")) for o in ops)


class Unsupported(Exception):
    """The page cannot take this edit (e.g. a calculator page with no sections). Not a bug: the
    engine records it and flags the page for the human instead of erroring."""


@dataclass
class Page:
    path: str                 # URL path, e.g. /guides/claude-pricing
    slug: str                 # last path segment (packet dir name)
    key: str                  # backend-native locator (file::slug, page_key, …)
    files: list[str]          # repo-relative files this page's edits touch (git add these)
    title: str = ""
    kind: str = ""            # page type (guide, comparison, spoke…) — groups the voice sample
    native: str = ""          # the page's source as stored (snapshot for the packet / revert)
    extra: dict = field(default_factory=dict)


@dataclass
class Result:
    ok: bool
    msg: str = ""
    files: list[str] = field(default_factory=list)   # files changed (to stage)
    notes: list[str] = field(default_factory=list)   # human-readable change lines (commit body)


class Backend:
    def __init__(self, root: Path, cfg: dict):
        self.root, self.cfg = root, cfg

    # ---- reading -------------------------------------------------------------------------
    def locate(self, path: str) -> Page | None:
        raise NotImplementedError

    def text(self, page: Page) -> str:
        """Plain reading text: '# H1', intro, '## Heading' + paragraphs, FAQ as '**Q: …**' + answer."""
        raise NotImplementedError

    def headings(self, page: Page) -> list[dict]:
        """[{'id': str|None, 'heading': str}] in page order (for insert_before choices)."""
        raise NotImplementedError

    def has_heading(self, page: Page, heading: str) -> bool:
        return any(h["heading"].strip().lower() == heading.strip().lower() for h in self.headings(self.locate(page.path) or page))

    def voice_sample(self, kind: str, exclude: set[str]) -> str | None:
        """A real published page of the same kind, not being edited (mindmap-pass voice sample)."""
        return None

    # ---- writing -------------------------------------------------------------------------
    def apply(self, page: Page, ops: list[dict], today: str, dry_run: bool = False,
              preview: Path | None = None) -> Result:
        raise NotImplementedError

    def restore(self, page: Page, base_sha: str, today: str) -> Result:
        """Put this page back exactly as it was at the run's base commit (REVERT)."""
        raise NotImplementedError

    def validate(self, files: list[str]) -> tuple[bool, str]:
        return True, "no validator"
