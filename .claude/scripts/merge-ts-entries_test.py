import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('merge_ts_entries', Path(__file__).with_name('merge-ts-entries.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

BASE = '''const _entries: any[] = [
  {
    "slug": "existing-alpha",
    "metaTitle": "Alpha"
  }
];
'''


class MergeTsEntriesTests(unittest.TestCase):
    def test_merges_disjoint_tail_appends(self):
        ours = BASE + '\n_entries.push({\n  "slug": "corma-explained",\n  "metaTitle": "Corma"\n});\n'
        theirs = BASE + '\n_entries.push({\n  "slug": "vayo-explained",\n  "metaTitle": "Vayo"\n});\n'
        merged = m.merge(BASE, ours, theirs)
        self.assertIn('"slug": "existing-alpha"', merged)
        self.assertIn('"slug": "corma-explained"', merged)
        self.assertIn('"slug": "vayo-explained"', merged)

    def test_merges_upstream_midfile_edit_with_branch_tail_append(self):
        ours = BASE.replace('"Alpha"', '"Alpha Updated"')
        theirs = BASE + '\n_entries.push({\n  "slug": "new-guide",\n  "metaTitle": "New"\n});\n'
        merged = m.merge(BASE, ours, theirs)
        self.assertIn('"Alpha Updated"', merged)
        self.assertIn('"slug": "new-guide"', merged)

    def test_rejects_duplicate_appended_slug(self):
        ours = BASE + '\n_entries.push({\n  "slug": "same-slug",\n  "metaTitle": "A"\n});\n'
        theirs = BASE + '\n_entries.push({\n  "slug": "same-slug",\n  "metaTitle": "B"\n});\n'
        with self.assertRaisesRegex(ValueError, 'duplicate appended slug'):
            m.merge(BASE, ours, theirs)

    def test_rejects_conflicting_midfile_edits(self):
        ours = BASE.replace('"Alpha"', '"Alpha 1"')
        theirs = BASE.replace('"Alpha"', '"Alpha 2"')
        with self.assertRaisesRegex(ValueError, 'non-append'):
            m.merge(BASE, ours, theirs)

    def test_rejects_unbalanced_tail(self):
        ours = BASE + '\n_entries.push({\n  "slug": "ok-slug"\n});\n'
        theirs = BASE + '\n_entries.push({\n  "slug": "broken-slug"\n'
        with self.assertRaisesRegex(ValueError, 'Unbalanced'):
            m.merge(BASE, ours, theirs)

    def test_merges_disjoint_midfile_inbound_links_plus_disjoint_tail_appends(self):
        two_base = (
            'const _entries: any[] = [];\n'
            '_entries.push({\n  "slug": "guide-one",\n  "metaTitle": "One"\n});\n\n'
            '_entries.push({\n  "slug": "guide-two",\n  "metaTitle": "Two"\n});\n'
        )
        ours = two_base.replace('"One"', '"One + Link A"') + '\n_entries.push({\n  "slug": "new-a",\n  "metaTitle": "A"\n});\n'
        theirs = two_base.replace('"Two"', '"Two + Link B"') + '\n_entries.push({\n  "slug": "new-b",\n  "metaTitle": "B"\n});\n'
        merged = m.merge(two_base, ours, theirs)
        self.assertIn('"One + Link A"', merged)
        self.assertIn('"Two + Link B"', merged)
        self.assertIn('"slug": "new-a"', merged)
        self.assertIn('"slug": "new-b"', merged)


if __name__ == '__main__':
    unittest.main()
