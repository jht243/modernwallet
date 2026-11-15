#!/usr/bin/env python3
"""Unit tests for merge-pages-generated.py."""
import importlib.util
from pathlib import Path
import unittest

SPEC = importlib.util.spec_from_file_location(
    'merge_pages_generated', Path(__file__).with_name('merge-pages-generated.py')
)
MOD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MOD)

BASE = '''// AUTO-GENERATED
import type { PageMeta } from './types';

export const PAGES: PageMeta[] = [
  {
    "path": "/prayers/healing",
    "title": "Healing"
  },
];
'''


class MergePagesGeneratedTest(unittest.TestCase):
    def test_merges_disjoint_appends_and_preserves_comments(self):
        ours = BASE.replace(
            '];\n',
            '  // trend-pass\n  {\n    "path": "/prayers/wife",\n    "title": "Prayer for Wife"\n  },\n];\n',
        )
        theirs = BASE.replace(
            '];\n',
            '  // keyword-gap\n  {\n    "path": "/prayers/psalm-23",\n    "title": "Psalm 23",\n  },\n];\n',
        )
        merged = MOD.merge(BASE, ours, theirs)
        entries, _, _, _ = MOD.parse(merged)
        self.assertEqual(list(entries), ['/prayers/healing', '/prayers/wife', '/prayers/psalm-23'])
        self.assertIn('// trend-pass', merged)
        self.assertIn('// keyword-gap', merged)

    def test_refuses_conflicting_edit_to_same_path(self):
        ours = BASE.replace('"Healing"', '"Healing A"')
        theirs = BASE.replace('"Healing"', '"Healing B"')
        with self.assertRaises(ValueError):
            MOD.merge(BASE, ours, theirs)

    def test_refuses_changed_envelope(self):
        ours = BASE.replace('PAGES', 'OTHER_PAGES')
        with self.assertRaises(ValueError):
            MOD.merge(BASE, ours, BASE)


if __name__ == '__main__':
    unittest.main()
